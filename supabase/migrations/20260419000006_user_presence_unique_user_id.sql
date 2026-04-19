-- Add unique constraint on user_presence.user_id.
-- Required for upsert ON CONFLICT (user_id) to work — PostgreSQL needs a
-- unique index as the conflict arbiter. Without it PostgREST returns 403.
ALTER TABLE public.user_presence
  ADD CONSTRAINT user_presence_user_id_key UNIQUE (user_id);
