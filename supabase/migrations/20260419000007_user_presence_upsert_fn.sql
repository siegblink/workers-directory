-- Replace client-side INSERT/UPDATE RLS policies with a SECURITY DEFINER
-- function. PostgREST upserts require simultaneous INSERT+UPDATE RLS passes,
-- which is unreliable. The function runs as the table owner and scopes the
-- write to auth.uid() server-side.

DROP POLICY IF EXISTS "User manages own presence" ON public.user_presence;
DROP POLICY IF EXISTS "User updates own presence" ON public.user_presence;

CREATE OR REPLACE FUNCTION public.update_user_presence(p_is_online boolean)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO user_presence (user_id, is_online, last_seen)
  VALUES (auth.uid(), p_is_online, now())
  ON CONFLICT (user_id) DO UPDATE
    SET is_online = EXCLUDED.is_online,
        last_seen = EXCLUDED.last_seen;
END;
$$;

GRANT EXECUTE ON FUNCTION public.update_user_presence(boolean) TO authenticated;
