-- Create events table for SIGNAL events
CREATE TABLE public.signal_events (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text,
  event_date timestamp with time zone NOT NULL,
  location text,
  max_attendees integer,
  registration_opens_at timestamp with time zone NOT NULL DEFAULT now(),
  registration_closes_at timestamp with time zone,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

-- Enable RLS on signal_events
ALTER TABLE public.signal_events ENABLE ROW LEVEL SECURITY;

-- Create policies for signal_events
CREATE POLICY "Events are viewable by everyone" 
ON public.signal_events 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Authenticated users can create events" 
ON public.signal_events 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own events" 
ON public.signal_events 
FOR UPDATE 
TO authenticated
USING (auth.uid() = created_by);

-- Add event_id to signal_invitations table
ALTER TABLE public.signal_invitations 
ADD COLUMN event_id uuid REFERENCES public.signal_events(id) ON DELETE CASCADE;

-- Create index for better performance
CREATE INDEX idx_signal_invitations_event_id ON public.signal_invitations(event_id);
CREATE INDEX idx_signal_events_event_date ON public.signal_events(event_date);

-- Add trigger for automatic timestamp updates on signal_events
CREATE TRIGGER update_signal_events_updated_at
BEFORE UPDATE ON public.signal_events
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert a sample upcoming event
INSERT INTO public.signal_events (title, description, event_date, location, max_attendees, registration_closes_at)
VALUES (
  'SIGNAL: Underground Session #1',
  'An exclusive underground music experience featuring emerging artists and cutting-edge sounds.',
  now() + interval '2 weeks',
  'Secret Location - Details revealed to invitees',
  50,
  now() + interval '1 week'
);