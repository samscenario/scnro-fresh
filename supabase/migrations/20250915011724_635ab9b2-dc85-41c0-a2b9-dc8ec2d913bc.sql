-- Add position field to tracks table for ordering
ALTER TABLE public.tracks 
ADD COLUMN position INTEGER DEFAULT 1;

-- Create index for better performance when ordering
CREATE INDEX idx_tracks_position ON public.tracks(playlist_number, position);

-- Update existing tracks to have sequential positions within each playlist
WITH numbered_tracks AS (
  SELECT id, ROW_NUMBER() OVER (PARTITION BY playlist_number ORDER BY created_at) as new_position
  FROM public.tracks
)
UPDATE public.tracks 
SET position = numbered_tracks.new_position
FROM numbered_tracks 
WHERE tracks.id = numbered_tracks.id;