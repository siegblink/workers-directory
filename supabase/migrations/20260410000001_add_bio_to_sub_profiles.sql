-- Add bio column to sub_profiles so each persona can have its own description
ALTER TABLE public.sub_profiles ADD COLUMN bio TEXT;
