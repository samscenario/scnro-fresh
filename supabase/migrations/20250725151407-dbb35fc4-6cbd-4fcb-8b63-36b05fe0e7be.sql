-- Fix search path security warnings for functions
CREATE OR REPLACE FUNCTION public.validate_track_user_association()
RETURNS TRIGGER AS $$
BEGIN
  -- Ensure user_id matches authenticated user for new records
  IF NEW.user_id != auth.uid() THEN
    RAISE EXCEPTION 'Track user_id must match authenticated user';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.cleanup_orphaned_files()
RETURNS void AS $$
BEGIN
  -- This function can be called periodically to clean up orphaned files
  -- Implementation would depend on specific cleanup requirements
  RETURN;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;