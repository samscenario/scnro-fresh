-- Create lab sessions table
CREATE TABLE public.lab_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  mentor_id UUID REFERENCES public.lab_mentors(id) ON DELETE SET NULL,
  session_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  max_participants INTEGER DEFAULT 20,
  current_participants INTEGER DEFAULT 0,
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'in_progress', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create lab mentors table
CREATE TABLE public.lab_mentors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  expertise TEXT NOT NULL,
  background TEXT,
  bio TEXT,
  avatar_url TEXT,
  email TEXT,
  phone TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create lab applications table
CREATE TABLE public.lab_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  applicant_name TEXT NOT NULL,
  applicant_email TEXT NOT NULL,
  phone TEXT,
  lab_title TEXT NOT NULL,
  lab_description TEXT NOT NULL,
  target_audience TEXT,
  duration_hours INTEGER,
  equipment_needed TEXT,
  mentor_experience TEXT,
  motivation TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'under_review')),
  admin_notes TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.lab_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lab_mentors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lab_applications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for lab_sessions
CREATE POLICY "Lab sessions are viewable by everyone" 
ON public.lab_sessions 
FOR SELECT 
USING (true);

CREATE POLICY "Only admins can manage lab sessions" 
ON public.lab_sessions 
FOR ALL 
USING (is_admin());

-- RLS Policies for lab_mentors
CREATE POLICY "Lab mentors are viewable by everyone" 
ON public.lab_mentors 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Only admins can manage lab mentors" 
ON public.lab_mentors 
FOR ALL 
USING (is_admin());

-- RLS Policies for lab_applications
CREATE POLICY "Anyone can submit lab applications" 
ON public.lab_applications 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can view their own applications" 
ON public.lab_applications 
FOR SELECT 
USING (applicant_email = auth.email());

CREATE POLICY "Admins can view all applications" 
ON public.lab_applications 
FOR SELECT 
USING (is_admin());

CREATE POLICY "Only admins can update applications" 
ON public.lab_applications 
FOR UPDATE 
USING (is_admin());

-- Add foreign key constraint after both tables exist
ALTER TABLE public.lab_sessions 
ADD CONSTRAINT fk_lab_sessions_mentor 
FOREIGN KEY (mentor_id) REFERENCES public.lab_mentors(id) ON DELETE SET NULL;

-- Create updated_at trigger for all tables
CREATE TRIGGER update_lab_sessions_updated_at
  BEFORE UPDATE ON public.lab_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_lab_mentors_updated_at
  BEFORE UPDATE ON public.lab_mentors
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_lab_applications_updated_at
  BEFORE UPDATE ON public.lab_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some sample data for mentors
INSERT INTO public.lab_mentors (name, expertise, background, bio, is_active) VALUES
('DJ Kojo', 'Music Production', 'Goldsmiths Graduate', 'Experienced producer specializing in electronic music and beat-making fundamentals.', true),
('Nia Chen', 'Visual Arts', 'UAL Alumni', 'Visual storytelling expert with a focus on digital media and creative direction.', true),
('Zara M.', 'Fashion Design', 'Industry Professional', 'Fashion designer with 8+ years in the industry, specializing in sustainable fashion.', true),
('Marcus K.', 'Photography', 'Freelance Artist', 'Professional photographer with expertise in portrait and street photography.', true);

-- Insert some sample sessions
INSERT INTO public.lab_sessions (title, mentor_id, session_date, start_time, end_time, max_participants) 
SELECT 
  'Beat Making Fundamentals',
  m.id,
  CURRENT_DATE + INTERVAL '5 days',
  '19:00',
  '21:00',
  15
FROM public.lab_mentors m WHERE m.name = 'DJ Kojo';

INSERT INTO public.lab_sessions (title, mentor_id, session_date, start_time, end_time, max_participants)
SELECT 
  'Visual Storytelling Workshop',
  m.id,
  CURRENT_DATE + INTERVAL '8 days',
  '18:00',
  '20:00',
  12
FROM public.lab_mentors m WHERE m.name = 'Nia Chen';

INSERT INTO public.lab_sessions (title, mentor_id, session_date, start_time, end_time, max_participants)
SELECT 
  'Fashion Design Lab',
  m.id,
  CURRENT_DATE + INTERVAL '12 days',
  '14:00',
  '17:00',
  10
FROM public.lab_mentors m WHERE m.name = 'Zara M.';

INSERT INTO public.lab_sessions (title, mentor_id, session_date, start_time, end_time, max_participants)
SELECT 
  'Photography Masterclass',
  m.id,
  CURRENT_DATE + INTERVAL '15 days',
  '13:00',
  '16:00',
  8
FROM public.lab_mentors m WHERE m.name = 'Marcus K.';