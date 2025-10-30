-- Fix security issue: Restrict mentor contact information to authenticated users only
-- This prevents spam/scraping of mentor email addresses and phone numbers

-- Drop the existing policy that allows everyone to view mentors
DROP POLICY "Lab mentors are viewable by everyone" ON public.lab_mentors;

-- Create new policy: Only authenticated users can view mentor details
CREATE POLICY "Authenticated users can view lab mentors" 
ON public.lab_mentors 
FOR SELECT 
TO authenticated
USING (is_active = true);

-- Create a restricted public view for unauthenticated users (name, expertise, bio only)
CREATE OR REPLACE VIEW public.lab_mentors_public AS
SELECT 
  id,
  name,
  expertise,
  background,
  bio,
  avatar_url,
  is_active,
  created_at,
  updated_at
FROM public.lab_mentors
WHERE is_active = true;

-- Allow public access to the restricted view
CREATE POLICY "Public view of lab mentors (no contact info)" 
ON public.lab_mentors_public 
FOR SELECT 
TO anon, authenticated
USING (true);