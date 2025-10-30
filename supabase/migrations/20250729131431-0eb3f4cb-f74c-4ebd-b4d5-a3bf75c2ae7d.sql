-- Fix search_path issues for security
DROP FUNCTION IF EXISTS public.generate_ticket_code();
DROP FUNCTION IF EXISTS public.update_event_attendee_count();

-- Recreate functions with proper search_path
CREATE OR REPLACE FUNCTION public.generate_ticket_code()
RETURNS TEXT 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  code TEXT;
  exists_check INT;
  chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  i INT;
BEGIN
  LOOP
    code := 'TKT-';
    FOR i IN 1..8 LOOP
      code := code || substr(chars, (random() * length(chars))::int + 1, 1);
    END LOOP;
    
    SELECT COUNT(*) INTO exists_check 
    FROM public.campus_ticket_bookings 
    WHERE ticket_code = code;
    
    EXIT WHEN exists_check = 0;
  END LOOP;
  
  RETURN code;
END;
$$;

-- Recreate attendee count function with proper search_path
CREATE OR REPLACE FUNCTION public.update_event_attendee_count()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.campus_events 
    SET current_attendees = current_attendees + 1,
        updated_at = now()
    WHERE id = NEW.event_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.campus_events 
    SET current_attendees = current_attendees - 1,
        updated_at = now()
    WHERE id = OLD.event_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;