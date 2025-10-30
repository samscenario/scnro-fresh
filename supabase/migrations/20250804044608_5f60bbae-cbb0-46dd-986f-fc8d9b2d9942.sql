-- Create storage bucket for video uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('culture-videos', 'culture-videos', true);

-- Create policies for video uploads
CREATE POLICY "Culture videos are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'culture-videos');

CREATE POLICY "Anyone can upload culture videos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'culture-videos');

CREATE POLICY "Anyone can update culture videos" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'culture-videos');

CREATE POLICY "Anyone can delete culture videos" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'culture-videos');