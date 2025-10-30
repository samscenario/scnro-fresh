-- SECURITY FIX: Add user_id for proper authentication and update policies
-- This addresses the vulnerability where users could access other students' personal data

-- Step 1: Add user_id column for proper authentication
ALTER TABLE public.campus_ticket_bookings 
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Step 2: Drop the vulnerable email-only policy
DROP POLICY IF EXISTS "Users can view their own verified ticket bookings" ON public.campus_ticket_bookings;

-- Step 3: Create new secure policies that require user_id matching
CREATE POLICY "Authenticated users can view their own bookings"
ON public.campus_ticket_bookings
FOR SELECT
USING (auth.uid() = user_id AND auth.uid() IS NOT NULL);

-- Step 4: Allow users to update their own bookings (excluding sensitive data)
CREATE POLICY "Authenticated users can update their own bookings"
ON public.campus_ticket_bookings
FOR UPDATE
USING (auth.uid() = user_id AND auth.uid() IS NOT NULL);

-- Step 5: Update the booking creation policy to require authentication and user_id
DROP POLICY IF EXISTS "Restricted ticket booking creation" ON public.campus_ticket_bookings;

CREATE POLICY "Authenticated users can create their own bookings"
ON public.campus_ticket_bookings
FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND auth.uid() = user_id 
  AND student_email = auth.email()
  AND student_name IS NOT NULL 
  AND student_email IS NOT NULL 
  AND university IS NOT NULL 
  AND event_id IS NOT NULL 
  AND EXISTS (
    SELECT 1 FROM campus_events 
    WHERE campus_events.id = campus_ticket_bookings.event_id 
    AND campus_events.status = ANY (ARRAY['upcoming'::text, 'open_registration'::text]) 
    AND campus_events.event_date >= CURRENT_DATE
  )
);