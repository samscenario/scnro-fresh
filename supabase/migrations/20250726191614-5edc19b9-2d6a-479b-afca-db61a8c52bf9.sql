-- Add name and telephone fields to signal_invitations table
ALTER TABLE public.signal_invitations 
ADD COLUMN full_name TEXT,
ADD COLUMN telephone TEXT;