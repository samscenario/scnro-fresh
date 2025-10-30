-- Create table for SCNRO Education Programme registrations (for individuals)
CREATE TABLE public.scnro_ed_registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  age INTEGER NOT NULL,
  address_newham TEXT NOT NULL,
  previous_experience TEXT,
  motivation TEXT NOT NULL,
  registration_status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for SCNRO Education Schools registrations
CREATE TABLE public.scnro_ed_schools_registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  school_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  school_type TEXT NOT NULL,
  student_count INTEGER NOT NULL,
  preferred_start_date TEXT,
  additional_info TEXT,
  registration_status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.scnro_ed_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scnro_ed_schools_registrations ENABLE ROW LEVEL SECURITY;

-- Policies for scnro_ed_registrations
CREATE POLICY "Anyone can register for SCNRO ED programme"
  ON public.scnro_ed_registrations
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view all SCNRO ED registrations"
  ON public.scnro_ed_registrations
  FOR SELECT
  USING (is_admin());

CREATE POLICY "Admins can update SCNRO ED registrations"
  ON public.scnro_ed_registrations
  FOR UPDATE
  USING (is_admin());

-- Policies for scnro_ed_schools_registrations
CREATE POLICY "Anyone can register their school"
  ON public.scnro_ed_schools_registrations
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view all school registrations"
  ON public.scnro_ed_schools_registrations
  FOR SELECT
  USING (is_admin());

CREATE POLICY "Admins can update school registrations"
  ON public.scnro_ed_schools_registrations
  FOR UPDATE
  USING (is_admin());

-- Add updated_at triggers
CREATE TRIGGER update_scnro_ed_registrations_updated_at
  BEFORE UPDATE ON public.scnro_ed_registrations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_scnro_ed_schools_registrations_updated_at
  BEFORE UPDATE ON public.scnro_ed_schools_registrations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();