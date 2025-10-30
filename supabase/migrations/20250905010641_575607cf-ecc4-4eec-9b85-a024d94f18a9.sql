-- Add automatic ticket code generation trigger for secure bookings
CREATE OR REPLACE FUNCTION public.auto_generate_ticket_code()
RETURNS TRIGGER AS $$
BEGIN
  -- Only generate ticket code if it's not already set
  IF NEW.ticket_code IS NULL THEN
    NEW.ticket_code := generate_ticket_code();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger to auto-generate ticket codes
CREATE TRIGGER trigger_auto_generate_ticket_code
  BEFORE INSERT ON public.campus_ticket_bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_generate_ticket_code();