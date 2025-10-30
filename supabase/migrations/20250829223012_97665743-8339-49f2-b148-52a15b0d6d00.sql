-- Update the default title in the mainframe_content table
UPDATE public.mainframe_content 
SET title = 'SCNRO Conference and Mainframe Festival ''26'
WHERE id IN (SELECT id FROM public.mainframe_content LIMIT 1);