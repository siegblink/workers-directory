-- Move PostGIS from public schema to extensions schema.
-- Supabase security advisor flags spatial_ref_sys daily because it lives in
-- public (PostgREST-exposed) with no RLS. Moving it to extensions removes it
-- from PostgREST's view. PostGIS functions (ST_Distance, ST_MakePoint, etc.)
-- remain callable because Supabase includes extensions in the DB search_path.

CREATE SCHEMA IF NOT EXISTS extensions;

DROP EXTENSION IF EXISTS postgis CASCADE;

CREATE EXTENSION IF NOT EXISTS postgis SCHEMA extensions;
