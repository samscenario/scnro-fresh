-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create tracks table for uploaded music
CREATE TABLE public.tracks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  genre TEXT,
  description TEXT,
  audio_url TEXT NOT NULL,
  cover_image_url TEXT,
  file_size BIGINT NOT NULL DEFAULT 0,
  duration INTEGER NOT NULL DEFAULT 0,
  play_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracks ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Profiles are viewable by everyone" 
ON public.profiles 
FOR SELECT 
USING (true);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for tracks (public for now, can be restricted later)
CREATE POLICY "Tracks are viewable by everyone" 
ON public.tracks 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create tracks" 
ON public.tracks 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update tracks" 
ON public.tracks 
FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can delete tracks" 
ON public.tracks 
FOR DELETE 
USING (true);

-- Create storage buckets for tracks and cover images
INSERT INTO storage.buckets (id, name, public) VALUES ('tracks', 'tracks', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('covers', 'covers', true);

-- Create storage policies for tracks bucket
CREATE POLICY "Track files are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'tracks');

CREATE POLICY "Anyone can upload track files" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'tracks');

CREATE POLICY "Anyone can update track files" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'tracks');

CREATE POLICY "Anyone can delete track files" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'tracks');

-- Create storage policies for covers bucket
CREATE POLICY "Cover images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'covers');

CREATE POLICY "Anyone can upload cover images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'covers');

CREATE POLICY "Anyone can update cover images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'covers');

CREATE POLICY "Anyone can delete cover images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'covers');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tracks_updated_at
  BEFORE UPDATE ON public.tracks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user signups
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'display_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signups
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();