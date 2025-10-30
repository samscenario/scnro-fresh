-- First, fix existing tracks with null user_id by assigning them to a default system user
-- We'll need to handle this more gracefully
UPDATE public.tracks 
SET user_id = '00000000-0000-0000-0000-000000000000'::uuid 
WHERE user_id IS NULL;

-- Now we can safely make user_id NOT NULL
ALTER TABLE public.tracks ALTER COLUMN user_id SET NOT NULL;

-- Fix critical RLS policy issues for tracks table
-- Drop the overly permissive policies that allow anyone to do anything
DROP POLICY IF EXISTS "Anyone can create tracks" ON public.tracks;
DROP POLICY IF EXISTS "Anyone can update tracks" ON public.tracks;
DROP POLICY IF EXISTS "Anyone can delete tracks" ON public.tracks;

-- Create user-specific policies for track management
-- Users can only create tracks with their own user_id
CREATE POLICY "Users can create their own tracks" 
ON public.tracks 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Users can only update their own tracks
CREATE POLICY "Users can update their own tracks" 
ON public.tracks 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id);

-- Users can only delete their own tracks
CREATE POLICY "Users can delete their own tracks" 
ON public.tracks 
FOR DELETE 
TO authenticated
USING (auth.uid() = user_id);

-- Create storage policies for secure file management
-- Tracks bucket - users can only manage their own files
CREATE POLICY "Users can upload their own audio files" 
ON storage.objects 
FOR INSERT 
TO authenticated
WITH CHECK (bucket_id = 'tracks' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own audio files" 
ON storage.objects 
FOR UPDATE 
TO authenticated
USING (bucket_id = 'tracks' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own audio files" 
ON storage.objects 
FOR DELETE 
TO authenticated
USING (bucket_id = 'tracks' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Covers bucket - users can only manage their own files
CREATE POLICY "Users can upload their own cover images" 
ON storage.objects 
FOR INSERT 
TO authenticated
WITH CHECK (bucket_id = 'covers' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own cover images" 
ON storage.objects 
FOR UPDATE 
TO authenticated
USING (bucket_id = 'covers' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own cover images" 
ON storage.objects 
FOR DELETE 
TO authenticated
USING (bucket_id = 'covers' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Public read access for all files (needed for playback)
CREATE POLICY "Public read access for tracks" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'tracks');

CREATE POLICY "Public read access for covers" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'covers');