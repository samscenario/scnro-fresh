import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Clock, Users, Ticket, Home } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import CampusTicketBookingDialog from "@/components/CampusTicketBookingDialog";

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

const CampusTickets = () => {
  const [events, setEvents] = useState<CampusEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<CampusEvent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('campus_events')
        .select('*')
        .order('event_date', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error: any) {
      toast.error("Failed to load events: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'tickets_live':
        return 'bg-gradient-to-r from-acid-green to-electric-blue';
      case 'upcoming':
        return 'bg-gradient-to-r from-neon-orange to-warning-red';
      case 'sold_out':
        return 'bg-gradient-to-r from-cyber-purple to-hot-pink';
      default:
        return 'bg-gradient-to-r from-electric-blue to-hot-pink';
    }
  };

  const getAvailableTickets = (event: CampusEvent) => {
    return event.max_capacity - event.current_attendees;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-electric-blue border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-electric-blue font-bold">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-black via-primary/20 to-black relative overflow-hidden">
        {/* Home Button */}
        <div className="absolute top-4 left-4 z-20">
          <Button
            variant="outline"
            size="sm"
            asChild
            className="border-electric-blue/50 text-electric-blue hover:bg-electric-blue hover:text-black font-bold transition-all duration-300"
          >
            <Link to="/">
              <Home className="w-4 h-4 mr-2" />
              HOME
            </Link>
          </Button>
        </div>

        {/* Animated Background Grid */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.1)_1px,transparent_1px)] bg-[size:20px_20px] animate-pulse" />
        </div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-black text-transparent bg-gradient-to-r from-electric-blue via-hot-pink to-cyber-purple bg-clip-text mb-6 uppercase tracking-wider">
            CAMPUS LIVE TICKETS
          </h1>
          <p className="text-xl text-electric-blue/80 font-bold uppercase tracking-wide mb-8">
            // SECURE YOUR SPOT AT THE HOTTEST UNIVERSITY EVENTS
          </p>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="all">ALL EVENTS</TabsTrigger>
              <TabsTrigger value="tickets_live">TICKETS LIVE</TabsTrigger>
              <TabsTrigger value="upcoming">UPCOMING</TabsTrigger>
              <TabsTrigger value="sold_out">SOLD OUT</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <EventGrid events={events} onEventSelect={setSelectedEvent} />
            </TabsContent>
            
            <TabsContent value="tickets_live">
              <EventGrid 
                events={events.filter(e => e.status === 'tickets_live')} 
                onEventSelect={setSelectedEvent} 
              />
            </TabsContent>
            
            <TabsContent value="upcoming">
              <EventGrid 
                events={events.filter(e => e.status === 'upcoming')} 
                onEventSelect={setSelectedEvent} 
              />
            </TabsContent>
            
            <TabsContent value="sold_out">
              <EventGrid 
                events={events.filter(e => e.status === 'sold_out')} 
                onEventSelect={setSelectedEvent} 
              />
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Booking Dialog */}
      {selectedEvent && (
        <CampusTicketBookingDialog
          event={selectedEvent}
          open={!!selectedEvent}
          onOpenChange={(open) => !open && setSelectedEvent(null)}
          onBookingComplete={fetchEvents}
        />
      )}
    </div>
  );
};

interface EventGridProps {
  events: CampusEvent[];
  onEventSelect: (event: CampusEvent) => void;
}

const EventGrid = ({ events, onEventSelect }: EventGridProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'tickets_live':
        return 'bg-gradient-to-r from-acid-green to-electric-blue';
      case 'upcoming':
        return 'bg-gradient-to-r from-neon-orange to-warning-red';
      case 'sold_out':
        return 'bg-gradient-to-r from-cyber-purple to-hot-pink';
      default:
        return 'bg-gradient-to-r from-electric-blue to-hot-pink';
    }
  };

  const getAvailableTickets = (event: CampusEvent) => {
    return event.max_capacity - event.current_attendees;
  };

  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <Ticket className="w-16 h-16 text-electric-blue/50 mx-auto mb-4" />
        <p className="text-xl text-electric-blue/80 font-bold">NO EVENTS FOUND</p>
        <p className="text-foreground/60">Check back soon for new events!</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {events.map((event) => (
        <Card key={event.id} className="relative group overflow-hidden bg-black/90 border-electric-blue/30 hover:border-electric-blue/60 transition-all duration-300">
          {/* Status Badge */}
          <div className="absolute top-4 right-4 z-10">
            <Badge className={`${getStatusColor(event.status)} text-black font-black text-xs uppercase tracking-wider`}>
              {event.status.replace('_', ' ')}
            </Badge>
          </div>

          <CardHeader className="pb-3">
            <CardTitle className="text-2xl font-black text-white mb-2 uppercase tracking-wider">
              {event.university}
            </CardTitle>
            <div className="space-y-2">
              <div className="flex items-center text-electric-blue/80 text-sm">
                <MapPin className="w-4 h-4 mr-2" />
                {event.location} • {event.venue}
              </div>
              <div className="flex items-center text-electric-blue/80 text-sm">
                <Calendar className="w-4 h-4 mr-2" />
                {format(new Date(event.event_date), 'MMMM d, yyyy')}
              </div>
              <div className="flex items-center text-electric-blue/80 text-sm">
                <Clock className="w-4 h-4 mr-2" />
                {event.event_time}
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Headliners */}
            {event.headliners.length > 0 && (
              <div>
                <p className="text-xs text-electric-blue/60 uppercase tracking-wider mb-1">Headliners</p>
                <div className="flex flex-wrap gap-1">
                  {event.headliners.map((headliner, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs border-electric-blue/30 text-electric-blue">
                      {headliner}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Capacity */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center text-electric-blue/80">
                <Users className="w-4 h-4 mr-2" />
                {event.current_attendees} / {event.max_capacity}
              </div>
              <div className="text-hot-pink font-bold">
                £{event.ticket_price.toFixed(2)}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-electric-blue/20 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-electric-blue to-hot-pink h-2 rounded-full transition-all duration-300"
                style={{ width: `${(event.current_attendees / event.max_capacity) * 100}%` }}
              />
            </div>

            {/* Available Tickets */}
            <p className="text-xs text-center text-electric-blue/60">
              {getAvailableTickets(event)} tickets remaining
            </p>

            {/* Book Ticket Button */}
            <Button
              onClick={() => onEventSelect(event)}
              disabled={event.status === 'sold_out' || getAvailableTickets(event) === 0}
              className="w-full bg-gradient-to-r from-electric-blue to-hot-pink hover:from-hot-pink hover:to-cyber-purple text-black font-black uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {event.status === 'sold_out' || getAvailableTickets(event) === 0 ? 'SOLD OUT' : 'GET TICKET'}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CampusTickets;