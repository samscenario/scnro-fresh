-- Create enum for subscription types
CREATE TYPE public.subscription_type AS ENUM ('event_alerts', 'merchandise_alerts', 'signal_show_announcements');

-- Create alert_subscriptions table
CREATE TABLE public.alert_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  subscription_types subscription_type[] NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(email)
);

-- Enable RLS
ALTER TABLE public.alert_subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policies for alert subscriptions
CREATE POLICY "Anyone can subscribe for alerts" 
ON public.alert_subscriptions 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can view their own subscriptions by email" 
ON public.alert_subscriptions 
FOR SELECT 
USING (true);

CREATE POLICY "Users can update their own subscriptions by email" 
ON public.alert_subscriptions 
FOR UPDATE 
USING (true);

-- Create admin_notifications table for dashboard notifications
CREATE TABLE public.admin_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  notification_type TEXT NOT NULL DEFAULT 'alert_signup',
  is_read BOOLEAN NOT NULL DEFAULT false,
  related_email TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for admin notifications
ALTER TABLE public.admin_notifications ENABLE ROW LEVEL SECURITY;

-- Admin notifications policies (only admins can access)
CREATE POLICY "Only authenticated users can view admin notifications" 
ON public.admin_notifications 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Add trigger for updated_at on alert_subscriptions
CREATE TRIGGER update_alert_subscriptions_updated_at
BEFORE UPDATE ON public.alert_subscriptions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();