-- Fix the search path security warning for the rate limit function
CREATE OR REPLACE FUNCTION public.check_booking_rate_limit()
RETURNS trigger 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Check if the same email has made a booking in the last 5 minutes
  IF EXISTS (
    SELECT 1 FROM public.campus_ticket_bookings 
    WHERE student_email = NEW.student_email 
    AND created_at > NOW() - INTERVAL '5 minutes'
    AND id != COALESCE(NEW.id, gen_random_uuid())
  ) THEN
    RAISE EXCEPTION 'Rate limit exceeded. Please wait before making another booking.';
  END IF;
  
  RETURN NEW;
END;
$$;