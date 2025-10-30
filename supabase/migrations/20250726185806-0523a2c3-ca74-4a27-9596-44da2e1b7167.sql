-- Fix the generate_invitation_code function to not use gen_random_bytes
CREATE OR REPLACE FUNCTION public.generate_invitation_code()
RETURNS TEXT AS $$
DECLARE
  code TEXT;
  exists_check INT;
  chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  i INT;
BEGIN
  LOOP
    -- Generate a random 8-character alphanumeric code using random()
    code := '';
    FOR i IN 1..8 LOOP
      code := code || substr(chars, (random() * length(chars))::int + 1, 1);
    END LOOP;
    
    -- Check if code already exists
    SELECT COUNT(*) INTO exists_check 
    FROM public.signal_invitations 
    WHERE invitation_code = code;
    
    -- Exit loop if code is unique
    EXIT WHEN exists_check = 0;
  END LOOP;
  
  RETURN code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public';