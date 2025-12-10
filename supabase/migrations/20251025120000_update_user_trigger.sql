-- Update the handle_new_auth_user trigger to populate firstname and lastname from user metadata
-- This migration updates the trigger to extract first_name and last_name from auth user metadata
-- and populates the public.users table fields during signup

-- Drop the existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_auth_user() CASCADE;

-- Create the updated function with firstname and lastname population
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.users (id, firstname, lastname, role, status)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'first_name', 'Unknown'),
    COALESCE(new.raw_user_meta_data->>'last_name', 'User'),
    'customer',
    'active'
  );
  RETURN new;
END;
$$;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_auth_user();

-- Migrate existing users' names from auth.users metadata to public.users
-- This updates all users who currently have empty or missing firstname/lastname
-- Safe to run multiple times (idempotent)
UPDATE public.users u
SET
  firstname = COALESCE(NULLIF(au.raw_user_meta_data->>'first_name', ''), u.firstname, ''),
  lastname = COALESCE(NULLIF(au.raw_user_meta_data->>'last_name', ''), u.lastname, '')
FROM auth.users au
WHERE u.id = au.id
  AND (
    u.firstname IS NULL
    OR u.firstname = ''
    OR u.lastname IS NULL
    OR u.lastname = ''
  )
  AND au.raw_user_meta_data IS NOT NULL;
