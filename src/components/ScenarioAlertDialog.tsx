import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface ScenarioAlertDialogProps {
  children: React.ReactNode;
}

interface ScenarioEvent {
  id: string;
  title: string;
  description: string;
  event_date: string;
  location: string;
  max_attendees: number;
  registration_closes_at: string;
}

export const ScenarioAlertDialog = ({ children }: ScenarioAlertDialogProps) => {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [telephone, setTelephone] = useState("");
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const [events, setEvents] = useState<ScenarioEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchEvents = async () => {
      const { data, error } = await supabase
        .from('signal_events')
        .select('*')
        .eq('is_active', true)
        .gte('registration_closes_at', new Date().toISOString())
        .order('event_date', { ascending: true });

      if (error) {
        console.error('Error fetching events:', error);
      } else {
        setEvents(data || []);
        // Auto-select first event if available
        if (data && data.length > 0) {
          setSelectedEventId(data[0].id);
        }
      }
    };

    if (isOpen) {
      fetchEvents();
    }
  }, [isOpen]);

  const handleSignUp = async () => {
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    if (!fullName) {
      toast.error("Please enter your full name");
      return;
    }

    if (!telephone) {
      toast.error("Please enter your telephone number");
      return;
    }

    if (!selectedEventId) {
      toast.error("Please select an event");
      return;
    }

    setIsLoading(true);
    try {
      // Generate invitation code
      const { data: codeData, error: codeError } = await supabase
        .rpc('generate_invitation_code');

      if (codeError) {
        console.error('Error generating code:', codeError);
        toast.error("Failed to generate invitation code");
        return;
      }

      // Insert the invitation record with event_id
      const { error: insertError } = await supabase
        .from('signal_invitations')
        .insert({
          user_id: user?.id || null,
          email: email,
          full_name: fullName,
          telephone: telephone,
          invitation_code: codeData,
          event_id: selectedEventId
        });

      if (insertError) {
        console.error('Error saving invitation:', insertError);
        toast.error("Failed to sign up for alerts");
        return;
      }

      const selectedEvent = events.find(e => e.id === selectedEventId);
      
      // Send email notifications
      try {
        await supabase.functions.invoke('send-signal-notification', {
          body: {
            email: email,
            fullName: fullName,
            telephone: telephone,
            eventTitle: selectedEvent?.title,
            eventDate: selectedEvent?.event_date,
            eventLocation: selectedEvent?.location,
            invitationCode: codeData
          }
        });
        console.log("Email notifications sent successfully");
      } catch (emailError) {
        console.error("Failed to send email notifications:", emailError);
        // Don't fail the whole process if email fails
      }

      toast.success(`Successfully signed up for ${selectedEvent?.title}! Your invitation code is: ${codeData}`, {
        duration: 10000,
      });

      setEmail("");
      setFullName("");
      setTelephone("");
      setSelectedEventId("");
      setIsOpen(false);
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-transparent bg-gradient-to-r from-cyber-purple to-electric-blue bg-clip-text">
            SCENARIO ALERT SIGNUP
          </DialogTitle>
          <DialogDescription>
            Get notified when new SCENARIO events drop. You'll receive an invitation code that proves you were invited.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="event">Select Event</Label>
            <Select value={selectedEventId} onValueChange={setSelectedEventId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose an event to sign up for" />
              </SelectTrigger>
              <SelectContent>
                {events.map((event) => (
                  <SelectItem key={event.id} value={event.id}>
                    <div className="flex flex-col">
                      <span className="font-medium">{event.title}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(event.event_date).toLocaleDateString()} - {event.location}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              type="text"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSignUp()}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="telephone">Telephone Number</Label>
            <Input
              id="telephone"
              type="tel"
              placeholder="Enter your telephone number"
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSignUp()}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSignUp()}
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <Button 
              onClick={handleSignUp} 
              disabled={isLoading}
              className="flex-1"
              variant="cta"
            >
              {isLoading ? "Generating Code..." : "Sign Up for Alerts"}
            </Button>
            <Button 
              onClick={() => setIsOpen(false)} 
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>

        <div className="text-sm text-muted-foreground mt-4 p-3 bg-card/50 rounded-lg border border-cyber-purple/20">
          <p className="font-semibold text-cyber-purple mb-1">How it works:</p>
          <p>1. Enter your email to sign up for SCENARIO alerts</p>
          <p>2. You'll receive a unique invitation code</p>
          <p>3. This code proves you were invited when events are announced</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};