-- Add category field to culture_videos table to support multiple video upload boxes
ALTER TABLE public.culture_videos 
ADD COLUMN category text DEFAULT 'general';

-- Create index for better performance when filtering by category
CREATE INDEX idx_culture_videos_category ON public.culture_videos(category);

-- Update existing videos to have 'general' category
UPDATE public.culture_videos 
SET category = 'general' 
WHERE category IS NULL;