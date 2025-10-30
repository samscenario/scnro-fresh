-- Allow authenticated users to insert admin notifications
CREATE POLICY "Authenticated users can create admin notifications" 
ON public.admin_notifications 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- Also allow service role to insert admin notifications for edge functions
CREATE POLICY "Service role can create admin notifications" 
ON public.admin_notifications 
FOR INSERT 
WITH CHECK (auth.role() = 'service_role');