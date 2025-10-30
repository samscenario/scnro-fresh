-- Drop and recreate the view to ensure no SECURITY DEFINER properties remain
DROP VIEW IF EXISTS public.lab_mentors_public CASCADE;

-- Create a simple view without any SECURITY DEFINER properties
CREATE VIEW public.lab_mentors_public AS
SELECT 
  id,
  is_active,
  created_at,
  updated_at,
  name,
  expertise,
  background,
  bio,
  avatar_url
FROM public.lab_mentors_secure
WHERE is_active = true;

-- Ensure proper permissions
GRANT SELECT ON public.lab_mentors_public TO authenticated;
GRANT SELECT ON public.lab_mentors_public TO anon;