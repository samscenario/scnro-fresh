import { useState, useEffect } from "react";
import { Calendar, CalendarIcon, Plus, Edit2, Trash2, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useAdminCheck } from "@/hooks/useAdminCheck";
import { toast } from "sonner";
import { Link } from "react-router-dom";

interface CalendarEvent {
  id: string;
  date: string;
  title: string;
  description?: string;
  event_type: string;
  institution?: string;
  color: string;
  is_active: boolean;
}

const eventTypeColors = {
  term_day: "bg-green-100 text-green-800 border-green-200",
  half_term: "bg-red-100 text-red-800 border-red-200",
  holiday: "bg-yellow-100 text-yellow-800 border-yellow-200",
  festival: "bg-purple-100 text-purple-800 border-purple-200",
  conference: "bg-blue-100 text-blue-800 border-blue-200",
  special: "bg-orange-100 text-orange-800 border-orange-200"
};

export default function AcademicCalendar() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    event_type: "term_day",
    institution: "all",
    color: "green"
  });
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  
  const { user } = useAuth();
  const { isAdmin } = useAdminCheck();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('academic_calendar_events')
        .select('*')
        .order('date', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to load calendar events');
    } finally {
      setLoading(false);
    }
  };

  const handleAddEvent = async () => {
    if (!selectedDate || !formData.title.trim()) {
      toast.error('Please select a date and enter a title');
      return;
    }

    try {
      const { error } = await supabase
        .from('academic_calendar_events')
        .insert({
          date: format(selectedDate, 'yyyy-MM-dd'),
          title: formData.title,
          description: formData.description,
          event_type: formData.event_type,
          institution: formData.institution,
          color: formData.color,
          created_by: user?.id
        });

      if (error) throw error;
      
      toast.success('Event added successfully');
      setIsAddDialogOpen(false);
      setFormData({
        title: "",
        description: "",
        event_type: "term_day",
        institution: "all",
        color: "green"
      });
      setSelectedDate(undefined);
      fetchEvents();
    } catch (error) {
      console.error('Error adding event:', error);
      toast.error('Failed to add event');
    }
  };

  const handleEditEvent = async () => {
    if (!editingEvent || !selectedDate || !formData.title.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const { error } = await supabase
        .from('academic_calendar_events')
        .update({
          date: format(selectedDate, 'yyyy-MM-dd'),
          title: formData.title,
          description: formData.description,
          event_type: formData.event_type,
          institution: formData.institution,
          color: formData.color
        })
        .eq('id', editingEvent.id);

      if (error) throw error;
      
      toast.success('Event updated successfully');
      setIsEditDialogOpen(false);
      setEditingEvent(null);
      setFormData({
        title: "",
        description: "",
        event_type: "term_day",
        institution: "all",
        color: "green"
      });
      setSelectedDate(undefined);
      fetchEvents();
    } catch (error) {
      console.error('Error updating event:', error);
      toast.error('Failed to update event');
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('academic_calendar_events')
        .delete()
        .eq('id', eventId);

      if (error) throw error;
      
      toast.success('Event deleted successfully');
      fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('Failed to delete event');
    }
  };

  const openEditDialog = (event: CalendarEvent) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description || "",
      event_type: event.event_type,
      institution: event.institution || "all",
      color: event.color
    });
    setSelectedDate(new Date(event.date));
    setIsEditDialogOpen(true);
  };

  const getEventsForMonth = (month: Date) => {
    const year = month.getFullYear();
    const monthIndex = month.getMonth();
    
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getFullYear() === year && eventDate.getMonth() === monthIndex;
    });
  };

  const getEventTypeLabel = (type: string) => {
    const labels = {
      term_day: "Term Day",
      half_term: "Half Term",
      holiday: "Holiday",
      festival: "Festival",
      conference: "Conference",
      special: "Special Event"
    };
    return labels[type as keyof typeof labels] || type;
  };

  const monthEvents = getEventsForMonth(selectedMonth);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-foreground flex items-center gap-3">
              <Calendar className="h-8 w-8 text-primary" />
              East London Academic Calendar 2025-2026
            </h1>
            <p className="text-muted-foreground mt-2">
              Academic calendar for colleges, universities and schools in East London
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link to="/" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Home
              </Link>
            </Button>
            
            {isAdmin && (
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-primary hover:bg-primary/90">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Event
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[525px]">
                  <DialogHeader>
                    <DialogTitle>Add Calendar Event</DialogTitle>
                    <DialogDescription>
                      Add a new event to the academic calendar
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="date">Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "justify-start text-left font-normal",
                              !selectedDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            initialFocus
                            className="p-3 pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        placeholder="Event title"
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        placeholder="Event description (optional)"
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="event_type">Event Type</Label>
                      <Select value={formData.event_type} onValueChange={(value) => setFormData({...formData, event_type: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="term_day">Term Day</SelectItem>
                          <SelectItem value="half_term">Half Term</SelectItem>
                          <SelectItem value="holiday">Holiday</SelectItem>
                          <SelectItem value="festival">Festival</SelectItem>
                          <SelectItem value="conference">Conference</SelectItem>
                          <SelectItem value="special">Special Event</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="institution">Institution</Label>
                      <Select value={formData.institution} onValueChange={(value) => setFormData({...formData, institution: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Institutions</SelectItem>
                          <SelectItem value="newham_college">Newham College</SelectItem>
                          <SelectItem value="uel">UEL University</SelectItem>
                          <SelectItem value="schools">Schools</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddEvent}>
                      Add Event
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}

            {/* Edit Event Dialog */}
            {isAdmin && (
              <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-[525px]">
                  <DialogHeader>
                    <DialogTitle>Edit Calendar Event</DialogTitle>
                    <DialogDescription>
                      Update the event details
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="edit-date">Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "justify-start text-left font-normal",
                              !selectedDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            initialFocus
                            className="p-3 pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="edit-title">Title</Label>
                      <Input
                        id="edit-title"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        placeholder="Event title"
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="edit-description">Description</Label>
                      <Textarea
                        id="edit-description"
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        placeholder="Event description (optional)"
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="edit-event_type">Event Type</Label>
                      <Select value={formData.event_type} onValueChange={(value) => setFormData({...formData, event_type: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="term_day">Term Day</SelectItem>
                          <SelectItem value="half_term">Half Term</SelectItem>
                          <SelectItem value="holiday">Holiday</SelectItem>
                          <SelectItem value="festival">Festival</SelectItem>
                          <SelectItem value="conference">Conference</SelectItem>
                          <SelectItem value="special">Special Event</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="edit-institution">Institution</Label>
                      <Select value={formData.institution} onValueChange={(value) => setFormData({...formData, institution: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Institutions</SelectItem>
                          <SelectItem value="newham_college">Newham College</SelectItem>
                          <SelectItem value="uel">UEL University</SelectItem>
                          <SelectItem value="schools">Schools</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleEditEvent}>
                      Update Event
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar View */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  Calendar View
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1))}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1))}
                    >
                      Next
                    </Button>
                  </div>
                </CardTitle>
                <CardDescription>
                  {format(selectedMonth, "MMMM yyyy")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {monthEvents.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      No events for this month
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {monthEvents.map((event) => (
                        <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="text-sm font-medium min-w-[80px]">
                              {format(new Date(event.date), "MMM dd")}
                            </div>
                            <div>
                              <h4 className="font-medium">{event.title}</h4>
                              {event.description && (
                                <p className="text-sm text-muted-foreground">{event.description}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={eventTypeColors[event.event_type as keyof typeof eventTypeColors]}>
                              {getEventTypeLabel(event.event_type)}
                            </Badge>
                            {event.institution && event.institution !== 'all' && (
                              <Badge variant="secondary">
                                {event.institution.replace('_', ' ').toUpperCase()}
                              </Badge>
                            )}
                            {isAdmin && (
                              <div className="flex gap-1 ml-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => openEditDialog(event)}
                                  className="h-8 w-8 p-0"
                                >
                                  <Edit2 className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteEvent(event.id)}
                                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Legend & Info */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Event Types</CardTitle>
                <CardDescription>Color coding for different event types</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(eventTypeColors).map(([type, colorClass]) => (
                    <div key={type} className="flex items-center gap-3">
                      <Badge className={colorClass}>
                        {getEventTypeLabel(type)}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Events:</span>
                    <span className="font-medium">{events.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">This Month:</span>
                    <span className="font-medium">{monthEvents.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Festivals:</span>
                    <span className="font-medium">
                      {events.filter(e => e.event_type === 'festival').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Conferences:</span>
                    <span className="font-medium">
                      {events.filter(e => e.event_type === 'conference').length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}