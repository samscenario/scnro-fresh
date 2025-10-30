-- Create table for uploaded culture videos
CREATE TABLE public.culture_videos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  title TEXT,
  video_url TEXT NOT NULL,
  file_size BIGINT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.culture_videos ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Culture videos are viewable by everyone" 
ON public.culture_videos 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can upload culture videos" 
ON public.culture_videos 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can update their own videos" 
ON public.culture_videos 
FOR UPDATE 
USING (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY "Users can delete their own videos" 
ON public.culture_videos 
FOR DELETE 
USING (user_id = auth.uid() OR user_id IS NULL);

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_culture_videos_updated_at
BEFORE UPDATE ON public.culture_videos
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();