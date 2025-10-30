-- Fix the security definer view warning by making it explicit that it's intentional
-- and secure since it only exposes non-sensitive fields

-- Drop and recreate the view without SECURITY DEFINER (it's not needed here)
DROP VIEW IF EXISTS public.lab_mentors_public;

-- Create a simple view that excludes sensitive fields
-- This is safe because it only shows public information
CREATE VIEW public.lab_mentors_public AS
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

-- Grant appropriate access
GRANT SELECT ON public.lab_mentors_public TO anon;
GRANT SELECT ON public.lab_mentors_public TO authenticated;