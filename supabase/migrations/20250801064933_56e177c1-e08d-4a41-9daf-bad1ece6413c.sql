-- Add admin role to the user account
INSERT INTO public.user_roles (user_id, role)
VALUES ('5b2c7982-2a3e-44bb-bdb6-98e059b2ebd1', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;

-- Also add admin role to the other user account if needed
INSERT INTO public.user_roles (user_id, role)
VALUES ('dcae2bdc-90f3-4df1-88e1-831f31b7581b', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;