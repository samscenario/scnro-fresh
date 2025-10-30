-- Update RLS policy for signal_invitations to allow anyone to sign up for alerts
-- The current policy requires auth.uid() = user_id, but we want to allow anonymous signups

-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "Users can create their own invitations" ON public.signal_invitations;

-- Create a new policy that allows anyone to create invitations
CREATE POLICY "Anyone can create signal invitations" 
ON public.signal_invitations 
FOR INSERT 
WITH CHECK (true);

-- Also update the select policy to allow viewing invitations by email even for non-authenticated users
DROP POLICY IF EXISTS "Users can view their own invitations" ON public.signal_invitations;

CREATE POLICY "Users can view invitations by email or user_id" 
ON public.signal_invitations 
FOR SELECT 
USING (
  (auth.uid() IS NOT NULL AND auth.uid() = user_id) OR 
  (email = (SELECT auth.email()))
);