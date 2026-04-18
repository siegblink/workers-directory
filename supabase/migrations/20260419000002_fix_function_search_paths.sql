-- Pin search_path on all public functions to prevent search-path hijacking.
-- Functions that call PostGIS (ST_*) also include 'extensions' because
-- PostGIS was moved there in migration 20260419000000.
--
-- Trigger functions declare no parameters; regular functions that have unique
-- names in the schema can be altered without repeating the argument list.

-- Trigger functions (no parameters)
ALTER FUNCTION public.handle_new_auth_user() SET search_path = public;
ALTER FUNCTION public.set_invoice_number()   SET search_path = public;

-- Trigger / utility functions created via the dashboard (unique names)
ALTER FUNCTION public.set_worker_slug         SET search_path = public;
ALTER FUNCTION public.generate_worker_slug    SET search_path = public;
ALTER FUNCTION public.get_user_role_info      SET search_path = public;
ALTER FUNCTION public.is_admin                SET search_path = public;
ALTER FUNCTION public.mark_stale_users_offline SET search_path = public;

-- Location functions may call PostGIS ST_* helpers; include extensions schema
ALTER FUNCTION public.update_user_location          SET search_path = public, extensions;
ALTER FUNCTION public.sync_user_presence_gps_location SET search_path = public, extensions;
ALTER FUNCTION public.search_workers_by_location    SET search_path = public, extensions;
