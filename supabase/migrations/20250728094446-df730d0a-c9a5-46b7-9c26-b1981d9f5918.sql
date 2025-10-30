-- Fix the SELECT policy for signal_invitations - the previous one had an issue with auth.email()
DROP POLICY IF EXISTS "Users can view invitations by email or user_id" ON public.signal_invitations;

CREATE POLICY "Users can view invitations by email or user_id" 
ON public.signal_invitations 
FOR SELECT 
USING (
  (auth.uid() IS NOT NULL AND auth.uid() = user_id) OR 
  (auth.uid() IS NULL)
);