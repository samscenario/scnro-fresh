-- Create academic calendar events table
CREATE TABLE public.academic_calendar_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  event_type TEXT NOT NULL DEFAULT 'term_day', -- 'term_day', 'half_term', 'holiday', 'festival', 'conference', 'special'
  institution TEXT, -- 'newham_college', 'uel', 'schools', 'all'
  color TEXT NOT NULL DEFAULT 'green',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID
);

-- Enable RLS
ALTER TABLE public.academic_calendar_events ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Calendar events are viewable by everyone" 
ON public.academic_calendar_events 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Only admins can create calendar events" 
ON public.academic_calendar_events 
FOR INSERT 
WITH CHECK (is_admin());

CREATE POLICY "Only admins can update calendar events" 
ON public.academic_calendar_events 
FOR UPDATE 
USING (is_admin());

CREATE POLICY "Only admins can delete calendar events" 
ON public.academic_calendar_events 
FOR DELETE 
USING (is_admin());

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_academic_calendar_events_updated_at
BEFORE UPDATE ON public.academic_calendar_events
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert the initial September 2025 data
INSERT INTO public.academic_calendar_events (date, title, description, event_type, institution, color) VALUES
('2025-09-01', 'Y12 Term Starts', 'College Autumn term begins', 'term_day', 'newham_college', 'green'),
('2025-09-03', 'Y13 Term Starts & UEL/Schools Start', 'Schools and UEL start', 'term_day', 'all', 'green'),
('2025-10-27', 'Half Term Break Starts', 'Half-term break begins', 'half_term', 'all', 'red'),
('2025-10-28', 'Half Term Break', 'Half-term break continues', 'half_term', 'all', 'red'),
('2025-10-29', 'Half Term Break', 'Half-term break continues', 'half_term', 'all', 'red'),
('2025-10-30', 'Half Term Break', 'Half-term break continues', 'half_term', 'all', 'red'),
('2025-10-31', 'Half Term Break Ends', 'Last day of half-term break', 'half_term', 'all', 'red'),
('2025-12-19', 'Autumn Term Ends', 'Last day of Autumn term for students', 'term_day', 'newham_college', 'green'),
('2026-01-06', 'Spring Term Starts', 'Spring term begins', 'term_day', 'newham_college', 'green'),
('2026-02-16', 'Spring Half Term Starts', 'Spring half-term break begins', 'half_term', 'all', 'red'),
('2026-02-17', 'Spring Half Term', 'Spring half-term break continues', 'half_term', 'all', 'red'),
('2026-02-18', 'Spring Half Term', 'Spring half-term break continues', 'half_term', 'all', 'red'),
('2026-02-19', 'Spring Half Term', 'Spring half-term break continues', 'half_term', 'all', 'red'),
('2026-02-20', 'Spring Half Term Ends', 'Last day of spring half-term break', 'half_term', 'all', 'red'),
('2026-03-27', 'Spring Term Ends', 'Last day of Spring term', 'term_day', 'newham_college', 'green'),
('2026-03-30', 'Easter Break Starts', 'Easter holidays begin', 'holiday', 'uel', 'yellow'),
('2026-04-10', 'Easter Break Ends', 'Easter holidays end', 'holiday', 'uel', 'yellow'),
('2026-04-13', 'Summer Term Starts', 'Summer term begins', 'term_day', 'newham_college', 'green'),
('2026-05-25', 'Summer Half Term Starts', 'Summer half-term break begins', 'half_term', 'all', 'red'),
('2026-05-26', 'Summer Half Term', 'Summer half-term break continues', 'half_term', 'all', 'red'),
('2026-05-27', 'Summer Half Term', 'Summer half-term break continues', 'half_term', 'all', 'red'),
('2026-05-28', 'Summer Half Term', 'Summer half-term break continues', 'half_term', 'all', 'red'),
('2026-05-29', 'Summer Half Term Ends', 'Last day of summer half-term break', 'half_term', 'all', 'red'),
('2026-07-08', 'Summer Term Ends', 'Summer term concludes', 'term_day', 'newham_college', 'green');