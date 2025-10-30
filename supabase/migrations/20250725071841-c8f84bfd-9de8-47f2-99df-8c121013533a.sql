-- Add content_type enum and column to tracks table
CREATE TYPE public.content_type AS ENUM ('sound', 'interview');

-- Add content_type column to tracks table with default value
ALTER TABLE public.tracks 
ADD COLUMN content_type public.content_type NOT NULL DEFAULT 'sound';

-- Update existing tracks to have 'sound' as content_type (they're already defaulted)
-- No additional update needed since we set DEFAULT 'sound'