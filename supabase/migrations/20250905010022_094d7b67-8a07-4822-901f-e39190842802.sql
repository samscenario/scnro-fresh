-- Remove the problematic view entirely since we have proper RLS on the underlying table
-- The lab_mentors_secure table already has RLS policies for public viewing
DROP VIEW IF EXISTS public.lab_mentors_public CASCADE;

-- Verify that the lab_mentors_secure table has the correct RLS policy for public access
-- The existing policy "Public mentor profiles are viewable by everyone" should handle this