-- Add producer and platform fields to tracks table
ALTER TABLE public.tracks 
ADD COLUMN producer TEXT,
ADD COLUMN platform TEXT DEFAULT 'YouTube';