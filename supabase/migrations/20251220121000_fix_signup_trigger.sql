-- Fix handle_new_auth_user trigger to use correct role level
--
-- Problem: Trigger was trying to insert role = 'customer' (string)
-- But role column expects bigint: 1=admin, 2=worker, 3=user
--
-- Error on signup: "Database error saving new user"
-- Caused by type mismatch (string vs bigint)
--
-- Solution: Use role level 3 (user) for new signups

CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  INSERT INTO public.users (id, firstname, lastname, role, status)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'first_name', 'Unknown'),
    COALESCE(new.raw_user_meta_data->>'last_name', 'User'),
    3, -- Role level 3 = 'user' (default role for new signups)
    'active'
  );
  RETURN new;
END;
$function$;

-- Add comment to document the role levels
COMMENT ON FUNCTION public.handle_new_auth_user() IS
'Trigger function that creates a user record in public.users when a new auth user is created.
Role levels: 1=admin, 2=worker, 3=user. New signups default to role 3 (user).';

-- Verification
SELECT 'Trigger function updated successfully - new users will have role level 3 (user)' as status;
