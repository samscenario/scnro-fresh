-- Add playlist_number column to tracks table to separate tracks by playlist
ALTER TABLE public.tracks 
ADD COLUMN playlist_number integer DEFAULT 1;

-- Add index for better performance when filtering by playlist
CREATE INDEX idx_tracks_playlist_number ON public.tracks(playlist_number);

-- Add check constraint to ensure valid playlist numbers
ALTER TABLE public.tracks 
ADD CONSTRAINT tracks_playlist_number_check 
CHECK (playlist_number IN (1, 2));