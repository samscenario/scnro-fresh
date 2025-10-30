import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { Calendar, MapPin, Plus, Trash2 } from 'lucide-react';

interface SignalEvent {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  location: string | null;
  max_attendees: number | null;
  registration_opens_at: string;
  registration_closes_at: string | null;
  is_active: boolean;
  created_at: string;
}

export const SignalEventsAdmin: React.FC = () => {
  const [events, setEvents] = useState<SignalEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    event_date: '',
    location: '',
    max_attendees: 100,
    registration_closes_at: ''
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('signal_events')
        .select('*')
        .order('event_date', { ascending: false });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async () => {
    if (!newEvent.title || !newEvent.event_date) {
      toast.error('Title and event date are required');
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('You must be logged in to create events');
        return;
      }

      const { error } = await supabase
        .from('signal_events')
        .insert({
          title: newEvent.title,
          description: newEvent.description || null,
          event_date: new Date(newEvent.event_date).toISOString(),
          location: newEvent.location || null,
          max_attendees: newEvent.max_attendees,
          registration_closes_at: newEvent.registration_closes_at 
            ? new Date(newEvent.registration_closes_at).toISOString()
            : null,
          is_active: true,
          created_by: user.id
        });

      if (error) throw error;

      toast.success('Event created successfully');
      setNewEvent({
        title: '',
        description: '',
        event_date: '',
        location: '',
        max_attendees: 100,
        registration_closes_at: ''
      });
      fetchEvents();
    } catch (error) {
      console.error('Error creating event:', error);
      toast.error('Failed to create event');
    }
  };

  const handleToggleActive = async (eventId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('signal_events')
        .update({ is_active: !currentStatus })
        .eq('id', eventId);

      if (error) throw error;

      toast.success(`Event ${!currentStatus ? 'activated' : 'deactivated'}`);
      fetchEvents();
    } catch (error) {
      console.error('Error updating event:', error);
      toast.error('Failed to update event');
    }
  };

  if (loading) {
    return <div className="p-6">Loading events...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Create New Signal Event
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Event Title *</Label>
              <Input
                id="title"
                placeholder="e.g., SIGNAL Summer Festival 2025"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="e.g., Olympic Park, London"
                value={newEvent.location}
                onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="event_date">Event Date & Time *</Label>
              <Input
                id="event_date"
                type="datetime-local"
                value={newEvent.event_date}
                onChange={(e) => setNewEvent({ ...newEvent, event_date: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="registration_closes">Registration Closes At</Label>
              <Input
                id="registration_closes"
                type="datetime-local"
                value={newEvent.registration_closes_at}
                onChange={(e) => setNewEvent({ ...newEvent, registration_closes_at: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="max_attendees">Max Attendees</Label>
              <Input
                id="max_attendees"
                type="number"
                min="1"
                value={newEvent.max_attendees}
                onChange={(e) => setNewEvent({ ...newEvent, max_attendees: parseInt(e.target.value) })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Event description..."
              rows={3}
              value={newEvent.description}
              onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
            />
          </div>

          <Button onClick={handleCreateEvent} className="w-full md:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Create Event
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing Events ({events.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Max Attendees</TableHead>
                  <TableHead>Registration Closes</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell className="font-medium">{event.title}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {new Date(event.event_date).toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        {event.location || 'TBA'}
                      </div>
                    </TableCell>
                    <TableCell>{event.max_attendees || 'Unlimited'}</TableCell>
                    <TableCell>
                      {event.registration_closes_at 
                        ? new Date(event.registration_closes_at).toLocaleString()
                        : 'No deadline'}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs ${
                        event.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {event.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant={event.is_active ? "outline" : "default"}
                        onClick={() => handleToggleActive(event.id, event.is_active)}
                      >
                        {event.is_active ? 'Deactivate' : 'Activate'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {events.length === 0 && (
              <p className="text-center py-8 text-muted-foreground">
                No events created yet. Create your first event above!
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
