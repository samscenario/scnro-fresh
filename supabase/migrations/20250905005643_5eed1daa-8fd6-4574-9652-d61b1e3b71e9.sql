-- Fix Security Definer View issue by recreating lab_mentors_public view properly
-- This removes the SECURITY DEFINER property and creates a standard view

-- Drop the existing view with SECURITY DEFINER
DROP VIEW IF EXISTS public.lab_mentors_public;

-- Recreate the view without SECURITY DEFINER 
-- This view should respect the RLS policies on the underlying lab_mentors table
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
FROM public.lab_mentors_secure
WHERE is_active = true;

-- Grant appropriate permissions
GRANT SELECT ON public.lab_mentors_public TO authenticated, anon;