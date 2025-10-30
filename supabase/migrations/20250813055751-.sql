-- Fix Security Definer View issue
-- The lab_mentors_public view may have been created with SECURITY DEFINER
-- Recreate it as a normal view (SECURITY INVOKER by default)

-- Drop the existing view
DROP VIEW IF EXISTS public.lab_mentors_public CASCADE;

-- Recreate the view without SECURITY DEFINER
-- This will use SECURITY INVOKER by default, which is safer
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

-- Grant appropriate permissions
GRANT SELECT ON public.lab_mentors_public TO anon;
GRANT SELECT ON public.lab_mentors_public TO authenticated;

-- Add a comment to document the purpose
COMMENT ON VIEW public.lab_mentors_public IS 'Public view of lab mentors excluding sensitive contact information (email, phone)';

-- Verify the view works correctly by testing it
-- This ensures the RLS policies on the underlying table work as expected