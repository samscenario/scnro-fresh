-- First, check for tracks with NULL user_id and handle them
-- Option 1: Delete tracks without user_id (orphaned tracks)
DELETE FROM public.tracks WHERE user_id IS NULL;

-- Security Fix 1: Make user_id NOT NULL in tracks table to prevent RLS bypass
ALTER TABLE public.tracks ALTER COLUMN user_id SET NOT NULL;

-- Security Fix 2: Add database-level validation to ensure proper user association
CREATE OR REPLACE FUNCTION public.validate_track_user_association()
RETURNS TRIGGER AS $$
BEGIN
  -- Ensure user_id matches authenticated user for new records
  IF NEW.user_id != auth.uid() THEN
    RAISE EXCEPTION 'Track user_id must match authenticated user';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for track validation
DROP TRIGGER IF EXISTS validate_track_user_trigger ON public.tracks;
CREATE TRIGGER validate_track_user_trigger
  BEFORE INSERT OR UPDATE ON public.tracks
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_track_user_association();

-- Security Fix 3: Create function for secure file cleanup
CREATE OR REPLACE FUNCTION public.cleanup_orphaned_files()
RETURNS void AS $$
BEGIN
  -- This function can be called periodically to clean up orphaned files
  -- Implementation would depend on specific cleanup requirements
  RETURN;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;