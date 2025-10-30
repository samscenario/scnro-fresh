import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Calendar, Users, Ticket, Search, Download, CheckCircle, XCircle } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

interface CampusEvent {
  id: string;
  university: string;
  location: string;
  event_date: string;
  event_time: string;
  venue: string;
  status: string;
  ticket_price: number;
  max_capacity: number;
  current_attendees: number;
  headliners: string[];
  societies: string[];
  description?: string;
}

interface TicketBooking {
  id: string;
  event_id: string;
  student_name: string;
  student_email: string;
  university: string;
  course?: string;
  year_of_study?: number;
  phone_number?: string;
  dietary_requirements?: string;
  emergency_contact?: string;
  ticket_code: string;
  booking_status: string;
  checked_in: boolean;
  checked_in_at?: string;
  created_at: string;
  campus_events?: CampusEvent;
}

const CampusAdmin = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<CampusEvent[]>([]);
  const [bookings, setBookings] = useState<TicketBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<string>("all");
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);

  useEffect(() => {
    if (user) {
      checkAdminStatus();
    } else {
      setCheckingAdmin(false);
    }
  }, [user]);

  const checkAdminStatus = async () => {
    try {
      const { data, error } = await supabase.rpc('is_admin');
      if (error) throw error;
      setIsAdmin(data);
      if (data) {
        fetchData();
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
      setLoading(false);
    } finally {
      setCheckingAdmin(false);
    }
  };

  const fetchData = async () => {
    try {
      // Fetch events
      const { data: eventsData, error: eventsError } = await supabase
        .from('campus_events')
        .select('*')
        .order('event_date', { ascending: true });

      if (eventsError) throw eventsError;

      // Fetch bookings with event details
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('campus_ticket_bookings')
        .select(`
          *,
          campus_events (*)
        `)
        .order('created_at', { ascending: false });

      if (bookingsError) throw bookingsError;

      setEvents(eventsData || []);
      setBookings(bookingsData || []);
    } catch (error: any) {
      toast.error("Failed to load data: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async (bookingId: string) => {
    try {
      const { error } = await supabase
        .from('campus_ticket_bookings')
        .update({ 
          checked_in: true, 
          checked_in_at: new Date().toISOString() 
        })
        .eq('id', bookingId);

      if (error) throw error;

      setBookings(prev => prev.map(booking => 
        booking.id === bookingId 
          ? { ...booking, checked_in: true, checked_in_at: new Date().toISOString() }
          : booking
      ));

      toast.success("Student checked in successfully!");
    } catch (error: any) {
      toast.error("Failed to check in: " + error.message);
    }
  };

  const exportBookings = () => {
    const filteredBookings = getFilteredBookings();
    const csvContent = [
      ['Event', 'Name', 'Email', 'University', 'Course', 'Year', 'Phone', 'Ticket Code', 'Status', 'Checked In', 'Booking Date'].join(','),
      ...filteredBookings.map(booking => [
        booking.campus_events?.university || '',
        booking.student_name,
        booking.student_email,
        booking.university,
        booking.course || '',
        booking.year_of_study || '',
        booking.phone_number || '',
        booking.ticket_code,
        booking.booking_status,
        booking.checked_in ? 'Yes' : 'No',
        format(new Date(booking.created_at), 'yyyy-MM-dd HH:mm')
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `campus_bookings_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getFilteredBookings = () => {
    return bookings.filter(booking => {
      const matchesSearch = booking.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          booking.student_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          booking.ticket_code.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesEvent = selectedEvent === "all" || booking.event_id === selectedEvent;
      
      return matchesSearch && matchesEvent;
    });
  };

  const getEventStats = () => {
    const totalBookings = bookings.length;
    const totalRevenue = bookings.reduce((sum, booking) => {
      const event = events.find(e => e.id === booking.event_id);
      return sum + (event?.ticket_price || 0);
    }, 0);
    const checkedInCount = bookings.filter(b => b.checked_in).length;
    
    return { totalBookings, totalRevenue, checkedInCount };
  };

  const stats = getEventStats();
  const filteredBookings = getFilteredBookings();

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold text-white">Admin Access Required</h2>
          <p className="text-electric-blue">Please sign in to view the campus admin dashboard.</p>
          <Button asChild>
            <a href="/auth">Sign In</a>
          </Button>
        </div>
      </div>
    );
  }

  if (checkingAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-electric-blue border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-electric-blue font-bold">Checking admin permissions...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold text-white">Access Denied</h2>
          <p className="text-electric-blue">You do not have administrator privileges to view this dashboard.</p>
          <Button asChild>
            <a href="/">Return to Home</a>
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-electric-blue border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-electric-blue font-bold">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="py-12 px-4 bg-gradient-to-br from-black via-primary/20 to-black">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-black text-transparent bg-gradient-to-r from-electric-blue via-hot-pink to-cyber-purple bg-clip-text mb-4 uppercase tracking-wider">
            CAMPUS ADMIN DASHBOARD
          </h1>
          <p className="text-lg text-electric-blue/80 font-bold uppercase tracking-wide">
            // MANAGE EVENTS AND TRACK ATTENDEES
          </p>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-black/90 border-electric-blue/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-electric-blue/60 uppercase tracking-wider">Total Events</p>
                  <p className="text-2xl font-black text-white">{events.length}</p>
                </div>
                <Calendar className="w-8 h-8 text-electric-blue" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/90 border-electric-blue/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-electric-blue/60 uppercase tracking-wider">Total Bookings</p>
                  <p className="text-2xl font-black text-white">{stats.totalBookings}</p>
                </div>
                <Ticket className="w-8 h-8 text-hot-pink" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/90 border-electric-blue/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-electric-blue/60 uppercase tracking-wider">Total Revenue</p>
                  <p className="text-2xl font-black text-white">£{stats.totalRevenue.toFixed(2)}</p>
                </div>
                <Users className="w-8 h-8 text-cyber-purple" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/90 border-electric-blue/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-electric-blue/60 uppercase tracking-wider">Checked In</p>
                  <p className="text-2xl font-black text-white">{stats.checkedInCount}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-acid-green" />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Main Content */}
      <section className="px-4 pb-20">
        <div className="max-w-7xl mx-auto">
          <Tabs defaultValue="bookings" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="bookings">TICKET BOOKINGS</TabsTrigger>
              <TabsTrigger value="events">EVENT MANAGEMENT</TabsTrigger>
            </TabsList>

            <TabsContent value="bookings">
              <Card className="bg-black/90 border-electric-blue/30">
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <CardTitle className="text-xl font-black text-white uppercase tracking-wider">
                      Ticket Bookings
                    </CardTitle>
                    <div className="flex gap-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-electric-blue/60" />
                        <Input
                          placeholder="Search by name, email, or ticket code..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 bg-black/50 border-electric-blue/30 text-white w-64"
                        />
                      </div>
                      <select
                        value={selectedEvent}
                        onChange={(e) => setSelectedEvent(e.target.value)}
                        className="bg-black/50 border border-electric-blue/30 text-white rounded-md px-3 py-2 text-sm"
                      >
                        <option value="all">All Events</option>
                        {events.map(event => (
                          <option key={event.id} value={event.id}>
                            {event.university} - {format(new Date(event.event_date), 'MMM d')}
                          </option>
                        ))}
                      </select>
                      <Button onClick={exportBookings} variant="outline" className="border-electric-blue/30 text-electric-blue">
                        <Download className="w-4 h-4 mr-2" />
                        Export CSV
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border border-electric-blue/30 overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-electric-blue/30">
                          <TableHead className="text-electric-blue font-bold">Event</TableHead>
                          <TableHead className="text-electric-blue font-bold">Student</TableHead>
                          <TableHead className="text-electric-blue font-bold">University</TableHead>
                          <TableHead className="text-electric-blue font-bold">Ticket Code</TableHead>
                          <TableHead className="text-electric-blue font-bold">Status</TableHead>
                          <TableHead className="text-electric-blue font-bold">Booked</TableHead>
                          <TableHead className="text-electric-blue font-bold">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredBookings.map((booking) => (
                          <TableRow key={booking.id} className="border-electric-blue/30">
                            <TableCell className="text-white">
                              <div>
                                <p className="font-bold">{booking.campus_events?.university}</p>
                                <p className="text-xs text-electric-blue/60">
                                  {booking.campus_events && format(new Date(booking.campus_events.event_date), 'MMM d, yyyy')}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell className="text-white">
                              <div>
                                <p className="font-bold">{booking.student_name}</p>
                                <p className="text-xs text-electric-blue/60">{booking.student_email}</p>
                                {booking.course && <p className="text-xs text-electric-blue/60">{booking.course}</p>}
                              </div>
                            </TableCell>
                            <TableCell className="text-white">{booking.university}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="border-electric-blue/30 text-electric-blue font-mono">
                                {booking.ticket_code}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {booking.checked_in ? (
                                  <Badge className="bg-acid-green text-black">
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Checked In
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="border-electric-blue/30 text-electric-blue">
                                    <XCircle className="w-3 h-3 mr-1" />
                                    Not Checked In
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-electric-blue/60 text-xs">
                              {format(new Date(booking.created_at), 'MMM d, HH:mm')}
                            </TableCell>
                            <TableCell>
                              {!booking.checked_in && (
                                <Button
                                  onClick={() => handleCheckIn(booking.id)}
                                  size="sm"
                                  className="bg-gradient-to-r from-acid-green to-electric-blue hover:from-electric-blue hover:to-acid-green text-black font-bold text-xs"
                                >
                                  Check In
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  
                  {filteredBookings.length === 0 && (
                    <div className="text-center py-8 text-electric-blue/60">
                      No bookings found matching your criteria.
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="events">
              <Card className="bg-black/90 border-electric-blue/30">
                <CardHeader>
                  <CardTitle className="text-xl font-black text-white uppercase tracking-wider">
                    Event Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {events.map((event) => (
                      <div key={event.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-electric-blue/10 to-hot-pink/10 rounded-lg border border-electric-blue/30">
                        <div className="flex-1">
                          <h3 className="text-lg font-black text-white uppercase tracking-wider">{event.university}</h3>
                          <p className="text-electric-blue/80 text-sm">
                            {format(new Date(event.event_date), 'MMMM d, yyyy')} at {event.event_time}
                          </p>
                          <p className="text-electric-blue/60 text-sm">{event.venue}, {event.location}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-bold">{event.current_attendees} / {event.max_capacity}</p>
                          <p className="text-electric-blue/60 text-sm">£{event.ticket_price.toFixed(2)}</p>
                          <Badge className={`mt-2 ${
                            event.status === 'tickets_live' ? 'bg-acid-green text-black' :
                            event.status === 'upcoming' ? 'bg-neon-orange text-black' :
                            'bg-cyber-purple text-white'
                          }`}>
                            {event.status.replace('_', ' ').toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
};

export default CampusAdmin;