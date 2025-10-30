-- Security Fix 1: Create admin role system
CREATE TYPE public.user_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role user_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check admin role
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_roles.user_id = is_admin.user_id 
    AND role = 'admin'
  );
$$;

-- Create function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID DEFAULT auth.uid())
RETURNS user_role
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT role FROM public.user_roles 
  WHERE user_roles.user_id = get_user_role.user_id 
  LIMIT 1;
$$;

-- Security Fix 2: Restrict admin_notifications access
DROP POLICY IF EXISTS "Only authenticated users can view admin notifications" ON public.admin_notifications;
DROP POLICY IF EXISTS "Authenticated users can create admin notifications" ON public.admin_notifications;
DROP POLICY IF EXISTS "Service role can create admin notifications" ON public.admin_notifications;

-- Only admins can view admin notifications
CREATE POLICY "Only admins can view admin notifications" 
ON public.admin_notifications 
FOR SELECT 
USING (public.is_admin());

-- Only admins can insert admin notifications 
CREATE POLICY "Only admins can insert admin notifications" 
ON public.admin_notifications 
FOR INSERT 
WITH CHECK (public.is_admin());

-- Service role can still create notifications (for edge functions)
CREATE POLICY "Service role can create admin notifications" 
ON public.admin_notifications 
FOR INSERT 
WITH CHECK (auth.role() = 'service_role');

-- Security Fix 3: Restrict alert_subscriptions access
DROP POLICY IF EXISTS "Anyone can subscribe for alerts" ON public.alert_subscriptions;
DROP POLICY IF EXISTS "Users can view their own subscriptions by email" ON public.alert_subscriptions;
DROP POLICY IF EXISTS "Users can update their own subscriptions by email" ON public.alert_subscriptions;

-- Anyone can subscribe for alerts (this is intentional for lead generation)
CREATE POLICY "Anyone can subscribe for alerts" 
ON public.alert_subscriptions 
FOR INSERT 
WITH CHECK (true);

-- Only admins can view all subscriptions
CREATE POLICY "Admins can view all alert subscriptions" 
ON public.alert_subscriptions 
FOR SELECT 
USING (public.is_admin());

-- Users can view their own subscriptions by email (when authenticated)
CREATE POLICY "Users can view their own subscriptions" 
ON public.alert_subscriptions 
FOR SELECT 
USING (auth.uid() IS NOT NULL AND email = auth.email());

-- Only admins can update subscriptions
CREATE POLICY "Admins can update alert subscriptions" 
ON public.alert_subscriptions 
FOR UPDATE 
USING (public.is_admin());

-- Security Fix 4: Restrict campus events access
DROP POLICY IF EXISTS "Authenticated users can create campus events" ON public.campus_events;
DROP POLICY IF EXISTS "Authenticated users can update campus events" ON public.campus_events;

-- Only admins can create campus events
CREATE POLICY "Only admins can create campus events" 
ON public.campus_events 
FOR INSERT 
WITH CHECK (public.is_admin());

-- Only admins can update campus events
CREATE POLICY "Only admins can update campus events" 
ON public.campus_events 
FOR UPDATE 
USING (public.is_admin());

-- Security Fix 5: Restrict campus ticket bookings access
DROP POLICY IF EXISTS "Users can view all ticket bookings" ON public.campus_ticket_bookings;
DROP POLICY IF EXISTS "Authenticated users can update ticket bookings" ON public.campus_ticket_bookings;

-- Only admins can view all ticket bookings
CREATE POLICY "Admins can view all ticket bookings" 
ON public.campus_ticket_bookings 
FOR SELECT 
USING (public.is_admin());

-- Users can view their own bookings by email
CREATE POLICY "Users can view their own ticket bookings" 
ON public.campus_ticket_bookings 
FOR SELECT 
USING (student_email = auth.email());

-- Only admins can update ticket bookings (for check-in, etc.)
CREATE POLICY "Only admins can update ticket bookings" 
ON public.campus_ticket_bookings 
FOR UPDATE 
USING (public.is_admin());

-- Security Fix 6: Restrict signal events access
DROP POLICY IF EXISTS "Authenticated users can create events" ON public.signal_events;
DROP POLICY IF EXISTS "Users can update their own events" ON public.signal_events;

-- Only admins can create signal events
CREATE POLICY "Only admins can create signal events" 
ON public.signal_events 
FOR INSERT 
WITH CHECK (public.is_admin() AND created_by = auth.uid());

-- Only admins can update signal events
CREATE POLICY "Only admins can update signal events" 
ON public.signal_events 
FOR UPDATE 
USING (public.is_admin());

-- Security Fix 7: Restrict signal invitations access
DROP POLICY IF EXISTS "Users can update their own invitations" ON public.signal_invitations;
DROP POLICY IF EXISTS "Users can view invitations by email or user_id" ON public.signal_invitations;

-- Only admins can view all signal invitations
CREATE POLICY "Admins can view all signal invitations" 
ON public.signal_invitations 
FOR SELECT 
USING (public.is_admin());

-- Users can view their own invitations
CREATE POLICY "Users can view their own invitations" 
ON public.signal_invitations 
FOR SELECT 
USING (auth.uid() IS NOT NULL AND (user_id = auth.uid() OR email = auth.email()));

-- Only admins can update invitations
CREATE POLICY "Only admins can update signal invitations" 
ON public.signal_invitations 
FOR UPDATE 
USING (public.is_admin());

-- RLS policies for user_roles table
CREATE POLICY "Users can view their own roles" 
ON public.user_roles 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Admins can view all user roles" 
ON public.user_roles 
FOR SELECT 
USING (public.is_admin());

CREATE POLICY "Only admins can manage user roles" 
ON public.user_roles 
FOR ALL 
USING (public.is_admin());

-- Create trigger for updating timestamps
CREATE TRIGGER update_user_roles_updated_at
    BEFORE UPDATE ON public.user_roles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();