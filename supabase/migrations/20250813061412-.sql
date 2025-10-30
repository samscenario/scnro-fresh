-- Security Fix Migration: Critical Data Protection and Access Control
-- Phase 1: Restructure sensitive data and improve RLS policies

-- 1. Create audit log table for tracking sensitive data access
CREATE TABLE public.security_audit_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id UUID,
  ip_address INET,
  user_agent TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on audit log
ALTER TABLE public.security_audit_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Only admins can view security audit logs" 
ON public.security_audit_log 
FOR SELECT 
USING (is_admin());

-- Service role can insert audit logs
CREATE POLICY "Service role can create audit logs" 
ON public.security_audit_log 
FOR INSERT 
WITH CHECK (auth.role() = 'service_role');

-- 2. Create secure mentor profiles table (public info only)
CREATE TABLE public.lab_mentors_secure (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  mentor_id UUID REFERENCES public.lab_mentors(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  expertise TEXT NOT NULL,
  background TEXT,
  bio TEXT,
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on secure mentor profiles
ALTER TABLE public.lab_mentors_secure ENABLE ROW LEVEL SECURITY;

-- Everyone can view active mentor public profiles
CREATE POLICY "Public mentor profiles are viewable by everyone" 
ON public.lab_mentors_secure 
FOR SELECT 
USING (is_active = true);

-- Only admins can manage secure mentor profiles
CREATE POLICY "Only admins can manage secure mentor profiles" 
ON public.lab_mentors_secure 
FOR ALL 
USING (is_admin());

-- 3. Create mentor contact requests table
CREATE TABLE public.mentor_contact_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  mentor_id UUID REFERENCES public.lab_mentors(id) ON DELETE CASCADE,
  requester_name TEXT NOT NULL,
  requester_email TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Enable RLS on mentor contact requests
ALTER TABLE public.mentor_contact_requests ENABLE ROW LEVEL SECURITY;

-- Anyone can submit contact requests
CREATE POLICY "Anyone can submit mentor contact requests" 
ON public.mentor_contact_requests 
FOR INSERT 
WITH CHECK (
  requester_name IS NOT NULL AND 
  requester_email IS NOT NULL AND 
  message IS NOT NULL
);

-- Users can view their own requests
CREATE POLICY "Users can view their own contact requests" 
ON public.mentor_contact_requests 
FOR SELECT 
USING (requester_email = auth.email());

-- Admins can view and manage all requests
CREATE POLICY "Admins can manage all contact requests" 
ON public.mentor_contact_requests 
FOR ALL 
USING (is_admin());

-- 4. Enhance existing sensitive data policies with stricter access controls

-- Update campus_ticket_bookings policies to require verified email match
DROP POLICY IF EXISTS "Users can view their own ticket bookings" ON public.campus_ticket_bookings;
CREATE POLICY "Users can view their own verified ticket bookings" 
ON public.campus_ticket_bookings 
FOR SELECT 
USING (
  student_email = auth.email() AND 
  auth.email_confirmed_at() IS NOT NULL
);

-- Update lab_applications policies for stricter access
DROP POLICY IF EXISTS "Users can view their own applications" ON public.lab_applications;
CREATE POLICY "Users can view their own verified applications" 
ON public.lab_applications 
FOR SELECT 
USING (
  applicant_email = auth.email() AND 
  auth.email_confirmed_at() IS NOT NULL
);

-- Update signal_invitations policies for stricter access
DROP POLICY IF EXISTS "Users can view their own invitations" ON public.signal_invitations;
CREATE POLICY "Users can view their own verified invitations" 
ON public.signal_invitations 
FOR SELECT 
USING (
  email = auth.email() AND 
  auth.email_confirmed_at() IS NOT NULL AND
  auth.uid() IS NOT NULL
);

-- Update alert_subscriptions policies for stricter access
DROP POLICY IF EXISTS "Users can view their own subscriptions" ON public.alert_subscriptions;
CREATE POLICY "Users can view their own verified subscriptions" 
ON public.alert_subscriptions 
FOR SELECT 
USING (
  email = auth.email() AND 
  auth.email_confirmed_at() IS NOT NULL AND
  auth.uid() IS NOT NULL
);

-- 5. Restrict lab_mentors table to admin access only for contact info
DROP POLICY IF EXISTS "Authenticated users can view lab mentors" ON public.lab_mentors;
CREATE POLICY "Only admins can access full mentor details" 
ON public.lab_mentors 
FOR SELECT 
USING (is_admin());

-- 6. Create function to log sensitive data access
CREATE OR REPLACE FUNCTION public.log_sensitive_access(
  action_type TEXT,
  table_name TEXT,
  record_id UUID DEFAULT NULL,
  additional_metadata JSONB DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.security_audit_log (
    user_id,
    action,
    table_name,
    record_id,
    metadata,
    created_at
  ) VALUES (
    auth.uid(),
    action_type,
    table_name,
    record_id,
    additional_metadata,
    now()
  );
END;
$$;

-- 7. Create triggers for sensitive data access logging
CREATE OR REPLACE FUNCTION public.trigger_log_sensitive_access()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Log access to sensitive tables
  PERFORM public.log_sensitive_access(
    TG_OP,
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    jsonb_build_object(
      'table', TG_TABLE_NAME,
      'operation', TG_OP,
      'timestamp', now()
    )
  );
  
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;
  RETURN NEW;
END;
$$;

-- Add triggers to sensitive tables
CREATE TRIGGER log_campus_bookings_access
  AFTER SELECT OR INSERT OR UPDATE OR DELETE ON public.campus_ticket_bookings
  FOR EACH ROW EXECUTE FUNCTION public.trigger_log_sensitive_access();

CREATE TRIGGER log_lab_applications_access
  AFTER SELECT OR INSERT OR UPDATE OR DELETE ON public.lab_applications
  FOR EACH ROW EXECUTE FUNCTION public.trigger_log_sensitive_access();

CREATE TRIGGER log_signal_invitations_access
  AFTER SELECT OR INSERT OR UPDATE OR DELETE ON public.signal_invitations
  FOR EACH ROW EXECUTE FUNCTION public.trigger_log_sensitive_access();

-- 8. Create updated_at triggers for new tables
CREATE TRIGGER update_lab_mentors_secure_updated_at
  BEFORE UPDATE ON public.lab_mentors_secure
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 9. Populate lab_mentors_secure with existing data (public info only)
INSERT INTO public.lab_mentors_secure (mentor_id, name, expertise, background, bio, avatar_url, is_active)
SELECT id, name, expertise, background, bio, avatar_url, is_active
FROM public.lab_mentors
WHERE is_active = true;

-- 10. Add rate limiting function for sensitive operations
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  operation_type TEXT,
  time_window_minutes INTEGER DEFAULT 5,
  max_operations INTEGER DEFAULT 10
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  operation_count INTEGER;
BEGIN
  -- Count recent operations by this user
  SELECT COUNT(*) INTO operation_count
  FROM public.security_audit_log
  WHERE user_id = auth.uid()
    AND action = operation_type
    AND created_at > NOW() - INTERVAL '1 minute' * time_window_minutes;
  
  -- Return false if rate limit exceeded
  RETURN operation_count < max_operations;
END;
$$;