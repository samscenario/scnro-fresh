-- Create campus events table
CREATE TABLE public.campus_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  university TEXT NOT NULL,
  location TEXT NOT NULL,
  event_date DATE NOT NULL,
  event_time TIME NOT NULL,
  venue TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'upcoming',
  ticket_price DECIMAL(10,2) DEFAULT 0.00,
  max_capacity INTEGER DEFAULT 500,
  current_attendees INTEGER DEFAULT 0,
  headliners TEXT[] DEFAULT '{}',
  societies TEXT[] DEFAULT '{}',
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create campus ticket bookings table
CREATE TABLE public.campus_ticket_bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES public.campus_events(id) ON DELETE CASCADE,
  student_name TEXT NOT NULL,
  student_email TEXT NOT NULL,
  university TEXT NOT NULL,
  course TEXT,
  year_of_study INTEGER,
  phone_number TEXT,
  dietary_requirements TEXT,
  emergency_contact TEXT,
  ticket_code TEXT NOT NULL UNIQUE,
  booking_status TEXT NOT NULL DEFAULT 'confirmed',
  checked_in BOOLEAN DEFAULT false,
  checked_in_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.campus_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campus_ticket_bookings ENABLE ROW LEVEL SECURITY;

-- Create policies for campus events (public read, admin write)
CREATE POLICY "Campus events are viewable by everyone" 
ON public.campus_events 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create campus events" 
ON public.campus_events 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update campus events" 
ON public.campus_events 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

-- Create policies for ticket bookings
CREATE POLICY "Anyone can create ticket bookings" 
ON public.campus_ticket_bookings 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can view all ticket bookings" 
ON public.campus_ticket_bookings 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can update ticket bookings" 
ON public.campus_ticket_bookings 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

-- Create function to generate unique ticket codes
CREATE OR REPLACE FUNCTION public.generate_ticket_code()
RETURNS TEXT AS $$
DECLARE
  code TEXT;
  exists_check INT;
  chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  i INT;
BEGIN
  LOOP
    code := 'TKT-';
    FOR i IN 1..8 LOOP
      code := code || substr(chars, (random() * length(chars))::int + 1, 1);
    END LOOP;
    
    SELECT COUNT(*) INTO exists_check 
    FROM public.campus_ticket_bookings 
    WHERE ticket_code = code;
    
    EXIT WHEN exists_check = 0;
  END LOOP;
  
  RETURN code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to update attendee count
CREATE OR REPLACE FUNCTION public.update_event_attendee_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.campus_events 
    SET current_attendees = current_attendees + 1,
        updated_at = now()
    WHERE id = NEW.event_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.campus_events 
    SET current_attendees = current_attendees - 1,
        updated_at = now()
    WHERE id = OLD.event_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for attendee count updates
CREATE TRIGGER update_campus_event_attendees
  AFTER INSERT OR DELETE ON public.campus_ticket_bookings
  FOR EACH ROW EXECUTE FUNCTION public.update_event_attendee_count();

-- Create trigger for updated_at timestamps
CREATE TRIGGER update_campus_events_updated_at
  BEFORE UPDATE ON public.campus_events
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_campus_bookings_updated_at
  BEFORE UPDATE ON public.campus_ticket_bookings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample campus events
INSERT INTO public.campus_events (university, location, event_date, event_time, venue, status, ticket_price, headliners, societies) VALUES
('UCL', 'London', '2024-03-14', '20:00', 'UCL Student Union', 'upcoming', 15.00, '{"DJ NEXUS", "MC VOLTAGE"}', '{"Electronic Music Society", "Student Union Events"}'),
('Loughborough', 'Leicestershire', '2024-03-22', '19:30', 'Loughborough SU', 'upcoming', 12.00, '{"BASS QUEEN", "RHYTHM MASTER"}', '{"Music Society", "Events Committee"}'),
('Goldsmiths', 'London', '2024-04-05', '21:00', 'Goldsmiths SU Venue', 'tickets_live', 18.00, '{"CYBER BEATS", "NEON NIGHTS"}', '{"Electronic Society", "Arts Union"}');