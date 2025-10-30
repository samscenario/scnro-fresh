-- Create table for storing editable MAINFRAME content
CREATE TABLE public.mainframe_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL DEFAULT 'MAINFRAME FESTIVAL 2026',
  subtitle TEXT NOT NULL DEFAULT 'A free youth-led festival powered by culture, sound, and the next generation.',
  current_raised INTEGER NOT NULL DEFAULT 0,
  target_amount INTEGER NOT NULL DEFAULT 22000,
  supporter_count INTEGER NOT NULL DEFAULT 0,
  event_date TEXT NOT NULL DEFAULT 'Saturday 18 July 2026',
  event_location TEXT NOT NULL DEFAULT 'Hopkins Meadow, Queen Elizabeth Olympic Park',
  event_audience TEXT NOT NULL DEFAULT 'Students, young creatives, Gen Z (ages 16-25)',
  about_title TEXT NOT NULL DEFAULT 'About MAINFRAME',
  about_content TEXT NOT NULL DEFAULT 'MAINFRAME is not just a music event. It''s a launchpad. Organised by Scenario Arts (UK Charity Reg. 1203542) and powered by SCNRO.live, MAINFRAME is our flagship creative festival — bringing 500+ young people together for a full day of live music, workshops, streetwear, media, and opportunity.',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.mainframe_content ENABLE ROW LEVEL SECURITY;

-- Create policies for admin access
CREATE POLICY "Admins can view mainframe content"
ON public.mainframe_content
FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update mainframe content"
ON public.mainframe_content
FOR UPDATE
TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "Public can view mainframe content"
ON public.mainframe_content
FOR SELECT
TO anon
USING (true);

-- Insert default content
INSERT INTO public.mainframe_content (
  title,
  subtitle,
  about_title,
  about_content
) VALUES (
  'SCNRO Conference and Festival ''26',
  'A free youth-led festival powered by culture, sound, and the next generation.',
  'About SCNRO',
  'SCNRO is not just a music event. It''s a launchpad. Organised by Scenario Arts (UK Charity Reg. 1203542) and powered by SCNRO.live, SCNRO is our flagship creative festival — bringing 500+ young people together for a full day of live music, workshops, streetwear, media, and opportunity.'
);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_mainframe_content_updated_at
BEFORE UPDATE ON public.mainframe_content
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();