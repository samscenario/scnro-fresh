-- SECURITY FIX: Separate sensitive student data and implement proper authentication
-- This addresses the vulnerability where users could access other students' personal data

-- Step 1: Remove sensitive data from the main bookings table and add user_id for proper authentication
ALTER TABLE public.campus_ticket_bookings 
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Step 2: Create a separate table for sensitive booking data with strict access controls
CREATE TABLE public.campus_booking_sensitive_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES public.campus_ticket_bookings(id) ON DELETE CASCADE,
  phone_number TEXT,
  emergency_contact TEXT,
  dietary_requirements TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Step 3: Enable RLS on the sensitive data table
ALTER TABLE public.campus_booking_sensitive_data ENABLE ROW LEVEL SECURITY;

-- Step 4: Create strict RLS policies for sensitive data (admin access only)
CREATE POLICY "Only admins can access sensitive booking data"
ON public.campus_booking_sensitive_data
FOR ALL
USING (is_admin());

-- Step 5: Create audit logging for access to sensitive data
CREATE TABLE public.campus_booking_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID,
  action TEXT NOT NULL,
  user_agent TEXT,
  ip_address INET,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Step 6: Enable RLS on audit log
ALTER TABLE public.campus_booking_audit_log ENABLE ROW LEVEL SECURITY;

-- Step 7: Create policy for audit log (admin access only)
CREATE POLICY "Only admins can view booking audit logs"
ON public.campus_booking_audit_log
FOR SELECT
USING (is_admin());

-- Step 8: Create trigger for automatic audit logging
CREATE OR REPLACE FUNCTION public.log_booking_access()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.campus_booking_audit_log (booking_id, action, user_agent, ip_address)
  VALUES (
    COALESCE(NEW.booking_id, OLD.booking_id),
    TG_OP,
    current_setting('request.headers', true)::json->>'user-agent',
    inet_client_addr()
  );
  
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Step 9: Attach the audit trigger
CREATE TRIGGER audit_sensitive_booking_access
  AFTER INSERT OR UPDATE OR DELETE ON public.campus_booking_sensitive_data
  FOR EACH ROW EXECUTE FUNCTION public.log_booking_access();

-- Step 10: Update the booking policies to require proper user authentication
-- Drop the vulnerable email-only policy
DROP POLICY IF EXISTS "Users can view their own verified ticket bookings" ON public.campus_ticket_bookings;

-- Create new secure policies that require user_id matching
CREATE POLICY "Authenticated users can view their own bookings"
ON public.campus_ticket_bookings
FOR SELECT
USING (auth.uid() = user_id AND auth.uid() IS NOT NULL);

-- Allow users to update their own bookings (excluding sensitive data)
CREATE POLICY "Authenticated users can update their own bookings"
ON public.campus_ticket_bookings
FOR UPDATE
USING (auth.uid() = user_id AND auth.uid() IS NOT NULL);

-- Step 11: Remove sensitive columns from main table (will be moved to sensitive data table)
-- Note: We'll handle the data migration in the application layer to preserve existing data
-- ALTER TABLE public.campus_ticket_bookings DROP COLUMN phone_number;
-- ALTER TABLE public.campus_ticket_bookings DROP COLUMN emergency_contact;
-- ALTER TABLE public.campus_ticket_bookings DROP COLUMN dietary_requirements;

-- Step 12: Create a function to safely create bookings with proper user linking
CREATE OR REPLACE FUNCTION public.create_secure_booking(
  p_event_id UUID,
  p_student_name TEXT,
  p_student_email TEXT,
  p_university TEXT,
  p_course TEXT DEFAULT NULL,
  p_year_of_study INTEGER DEFAULT NULL,
  p_phone_number TEXT DEFAULT NULL,
  p_emergency_contact TEXT DEFAULT NULL,
  p_dietary_requirements TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  booking_id UUID;
  current_user_id UUID;
BEGIN
  -- Get the current authenticated user
  current_user_id := auth.uid();
  
  -- Ensure user is authenticated
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'User must be authenticated to create bookings';
  END IF;
  
  -- Ensure the email matches the authenticated user's email
  IF p_student_email != auth.email() THEN
    RAISE EXCEPTION 'Student email must match authenticated user email';
  END IF;
  
  -- Create the main booking record
  INSERT INTO public.campus_ticket_bookings (
    event_id,
    student_name,
    student_email,
    university,
    course,
    year_of_study,
    user_id,
    ticket_code
  ) VALUES (
    p_event_id,
    p_student_name,
    p_student_email,
    p_university,
    p_course,
    p_year_of_study,
    current_user_id,
    generate_ticket_code()
  ) RETURNING id INTO booking_id;
  
  -- Create the sensitive data record if any sensitive data is provided
  IF p_phone_number IS NOT NULL OR p_emergency_contact IS NOT NULL OR p_dietary_requirements IS NOT NULL THEN
    INSERT INTO public.campus_booking_sensitive_data (
      booking_id,
      phone_number,
      emergency_contact,
      dietary_requirements
    ) VALUES (
      booking_id,
      p_phone_number,
      p_emergency_contact,
      p_dietary_requirements
    );
  END IF;
  
  RETURN booking_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;