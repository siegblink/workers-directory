--
-- PostgreSQL database dump
--

\restrict yjCfPW8bTrOy0odDH77wX3uvNFb6qJ8tuZKkBcaUSojohQH63NCu0Ftv4REPAwT

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: _realtime; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA _realtime;


--
-- Name: auth; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA auth;


--
-- Name: extensions; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA extensions;


--
-- Name: graphql; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA graphql;


--
-- Name: graphql_public; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA graphql_public;


--
-- Name: pg_net; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;


--
-- Name: EXTENSION pg_net; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pg_net IS 'Async HTTP';


--
-- Name: pgbouncer; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA pgbouncer;


--
-- Name: realtime; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA realtime;


--
-- Name: storage; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA storage;


--
-- Name: supabase_functions; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA supabase_functions;


--
-- Name: supabase_migrations; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA supabase_migrations;


--
-- Name: vault; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA vault;


--
-- Name: pg_graphql; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_graphql WITH SCHEMA graphql;


--
-- Name: EXTENSION pg_graphql; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pg_graphql IS 'pg_graphql: GraphQL support';


--
-- Name: pg_stat_statements; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_stat_statements WITH SCHEMA extensions;


--
-- Name: EXTENSION pg_stat_statements; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pg_stat_statements IS 'track planning and execution statistics of all SQL statements executed';


--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: postgis; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA public;


--
-- Name: EXTENSION postgis; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION postgis IS 'PostGIS geometry and geography spatial types and functions';


--
-- Name: supabase_vault; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS supabase_vault WITH SCHEMA vault;


--
-- Name: EXTENSION supabase_vault; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION supabase_vault IS 'Supabase Vault Extension';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: aal_level; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.aal_level AS ENUM (
    'aal1',
    'aal2',
    'aal3'
);


--
-- Name: code_challenge_method; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.code_challenge_method AS ENUM (
    's256',
    'plain'
);


--
-- Name: factor_status; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.factor_status AS ENUM (
    'unverified',
    'verified'
);


--
-- Name: factor_type; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.factor_type AS ENUM (
    'totp',
    'webauthn',
    'phone'
);


--
-- Name: oauth_authorization_status; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.oauth_authorization_status AS ENUM (
    'pending',
    'approved',
    'denied',
    'expired'
);


--
-- Name: oauth_client_type; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.oauth_client_type AS ENUM (
    'public',
    'confidential'
);


--
-- Name: oauth_registration_type; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.oauth_registration_type AS ENUM (
    'dynamic',
    'manual'
);


--
-- Name: oauth_response_type; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.oauth_response_type AS ENUM (
    'code'
);


--
-- Name: one_time_token_type; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.one_time_token_type AS ENUM (
    'confirmation_token',
    'reauthentication_token',
    'recovery_token',
    'email_change_token_new',
    'email_change_token_current',
    'phone_change_token'
);


--
-- Name: action; Type: TYPE; Schema: realtime; Owner: -
--

CREATE TYPE realtime.action AS ENUM (
    'INSERT',
    'UPDATE',
    'DELETE',
    'TRUNCATE',
    'ERROR'
);


--
-- Name: equality_op; Type: TYPE; Schema: realtime; Owner: -
--

CREATE TYPE realtime.equality_op AS ENUM (
    'eq',
    'neq',
    'lt',
    'lte',
    'gt',
    'gte',
    'in'
);


--
-- Name: user_defined_filter; Type: TYPE; Schema: realtime; Owner: -
--

CREATE TYPE realtime.user_defined_filter AS (
	column_name text,
	op realtime.equality_op,
	value text
);


--
-- Name: wal_column; Type: TYPE; Schema: realtime; Owner: -
--

CREATE TYPE realtime.wal_column AS (
	name text,
	type_name text,
	type_oid oid,
	value jsonb,
	is_pkey boolean,
	is_selectable boolean
);


--
-- Name: wal_rls; Type: TYPE; Schema: realtime; Owner: -
--

CREATE TYPE realtime.wal_rls AS (
	wal jsonb,
	is_rls_enabled boolean,
	subscription_ids uuid[],
	errors text[]
);


--
-- Name: buckettype; Type: TYPE; Schema: storage; Owner: -
--

CREATE TYPE storage.buckettype AS ENUM (
    'STANDARD',
    'ANALYTICS'
);


--
-- Name: email(); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION auth.email() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.email', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'email')
  )::text
$$;


--
-- Name: FUNCTION email(); Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON FUNCTION auth.email() IS 'Deprecated. Use auth.jwt() -> ''email'' instead.';


--
-- Name: jwt(); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION auth.jwt() RETURNS jsonb
    LANGUAGE sql STABLE
    AS $$
  select 
    coalesce(
        nullif(current_setting('request.jwt.claim', true), ''),
        nullif(current_setting('request.jwt.claims', true), '')
    )::jsonb
$$;


--
-- Name: role(); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION auth.role() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.role', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role')
  )::text
$$;


--
-- Name: FUNCTION role(); Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON FUNCTION auth.role() IS 'Deprecated. Use auth.jwt() -> ''role'' instead.';


--
-- Name: uid(); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION auth.uid() RETURNS uuid
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.sub', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
  )::uuid
$$;


--
-- Name: FUNCTION uid(); Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON FUNCTION auth.uid() IS 'Deprecated. Use auth.jwt() -> ''sub'' instead.';


--
-- Name: grant_pg_cron_access(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION extensions.grant_pg_cron_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF EXISTS (
    SELECT
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_cron'
  )
  THEN
    grant usage on schema cron to postgres with grant option;

    alter default privileges in schema cron grant all on tables to postgres with grant option;
    alter default privileges in schema cron grant all on functions to postgres with grant option;
    alter default privileges in schema cron grant all on sequences to postgres with grant option;

    alter default privileges for user supabase_admin in schema cron grant all
        on sequences to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on tables to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on functions to postgres with grant option;

    grant all privileges on all tables in schema cron to postgres with grant option;
    revoke all on table cron.job from postgres;
    grant select on table cron.job to postgres with grant option;
  END IF;
END;
$$;


--
-- Name: FUNCTION grant_pg_cron_access(); Type: COMMENT; Schema: extensions; Owner: -
--

COMMENT ON FUNCTION extensions.grant_pg_cron_access() IS 'Grants access to pg_cron';


--
-- Name: grant_pg_graphql_access(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION extensions.grant_pg_graphql_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $_$
DECLARE
    func_is_graphql_resolve bool;
BEGIN
    func_is_graphql_resolve = (
        SELECT n.proname = 'resolve'
        FROM pg_event_trigger_ddl_commands() AS ev
        LEFT JOIN pg_catalog.pg_proc AS n
        ON ev.objid = n.oid
    );

    IF func_is_graphql_resolve
    THEN
        -- Update public wrapper to pass all arguments through to the pg_graphql resolve func
        DROP FUNCTION IF EXISTS graphql_public.graphql;
        create or replace function graphql_public.graphql(
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language sql
        as $$
            select graphql.resolve(
                query := query,
                variables := coalesce(variables, '{}'),
                "operationName" := "operationName",
                extensions := extensions
            );
        $$;

        -- This hook executes when `graphql.resolve` is created. That is not necessarily the last
        -- function in the extension so we need to grant permissions on existing entities AND
        -- update default permissions to any others that are created after `graphql.resolve`
        grant usage on schema graphql to postgres, anon, authenticated, service_role;
        grant select on all tables in schema graphql to postgres, anon, authenticated, service_role;
        grant execute on all functions in schema graphql to postgres, anon, authenticated, service_role;
        grant all on all sequences in schema graphql to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on tables to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on functions to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on sequences to postgres, anon, authenticated, service_role;

        -- Allow postgres role to allow granting usage on graphql and graphql_public schemas to custom roles
        grant usage on schema graphql_public to postgres with grant option;
        grant usage on schema graphql to postgres with grant option;
    END IF;

END;
$_$;


--
-- Name: FUNCTION grant_pg_graphql_access(); Type: COMMENT; Schema: extensions; Owner: -
--

COMMENT ON FUNCTION extensions.grant_pg_graphql_access() IS 'Grants access to pg_graphql';


--
-- Name: grant_pg_net_access(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION extensions.grant_pg_net_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_net'
  )
  THEN
    GRANT USAGE ON SCHEMA net TO supabase_functions_admin, postgres, anon, authenticated, service_role;

    ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;
    ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;

    ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;
    ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;

    REVOKE ALL ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;
    REVOKE ALL ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;

    GRANT EXECUTE ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
    GRANT EXECUTE ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
  END IF;
END;
$$;


--
-- Name: FUNCTION grant_pg_net_access(); Type: COMMENT; Schema: extensions; Owner: -
--

COMMENT ON FUNCTION extensions.grant_pg_net_access() IS 'Grants access to pg_net';


--
-- Name: pgrst_ddl_watch(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION extensions.pgrst_ddl_watch() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN SELECT * FROM pg_event_trigger_ddl_commands()
  LOOP
    IF cmd.command_tag IN (
      'CREATE SCHEMA', 'ALTER SCHEMA'
    , 'CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO', 'ALTER TABLE'
    , 'CREATE FOREIGN TABLE', 'ALTER FOREIGN TABLE'
    , 'CREATE VIEW', 'ALTER VIEW'
    , 'CREATE MATERIALIZED VIEW', 'ALTER MATERIALIZED VIEW'
    , 'CREATE FUNCTION', 'ALTER FUNCTION'
    , 'CREATE TRIGGER'
    , 'CREATE TYPE', 'ALTER TYPE'
    , 'CREATE RULE'
    , 'COMMENT'
    )
    -- don't notify in case of CREATE TEMP table or other objects created on pg_temp
    AND cmd.schema_name is distinct from 'pg_temp'
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


--
-- Name: pgrst_drop_watch(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION extensions.pgrst_drop_watch() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  obj record;
BEGIN
  FOR obj IN SELECT * FROM pg_event_trigger_dropped_objects()
  LOOP
    IF obj.object_type IN (
      'schema'
    , 'table'
    , 'foreign table'
    , 'view'
    , 'materialized view'
    , 'function'
    , 'trigger'
    , 'type'
    , 'rule'
    )
    AND obj.is_temporary IS false -- no pg_temp objects
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


--
-- Name: set_graphql_placeholder(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION extensions.set_graphql_placeholder() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $_$
    DECLARE
    graphql_is_dropped bool;
    BEGIN
    graphql_is_dropped = (
        SELECT ev.schema_name = 'graphql_public'
        FROM pg_event_trigger_dropped_objects() AS ev
        WHERE ev.schema_name = 'graphql_public'
    );

    IF graphql_is_dropped
    THEN
        create or replace function graphql_public.graphql(
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language plpgsql
        as $$
            DECLARE
                server_version float;
            BEGIN
                server_version = (SELECT (SPLIT_PART((select version()), ' ', 2))::float);

                IF server_version >= 14 THEN
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql extension is not enabled.'
                            )
                        )
                    );
                ELSE
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql is only available on projects running Postgres 14 onwards.'
                            )
                        )
                    );
                END IF;
            END;
        $$;
    END IF;

    END;
$_$;


--
-- Name: FUNCTION set_graphql_placeholder(); Type: COMMENT; Schema: extensions; Owner: -
--

COMMENT ON FUNCTION extensions.set_graphql_placeholder() IS 'Reintroduces placeholder function for graphql_public.graphql';


--
-- Name: get_auth(text); Type: FUNCTION; Schema: pgbouncer; Owner: -
--

CREATE FUNCTION pgbouncer.get_auth(p_usename text) RETURNS TABLE(username text, password text)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $_$
begin
    raise debug 'PgBouncer auth request: %', p_usename;

    return query
    select 
        rolname::text, 
        case when rolvaliduntil < now() 
            then null 
            else rolpassword::text 
        end 
    from pg_authid 
    where rolname=$1 and rolcanlogin;
end;
$_$;


--
-- Name: get_user_role_info(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_user_role_info(user_id uuid) RETURNS TABLE(role_level bigint, role_name character varying, is_admin boolean)
    LANGUAGE sql STABLE
    AS $$
  SELECT
    u.role as role_level,
    r.name as role_name,
    (u.role = 1) as is_admin
  FROM public.users u
  LEFT JOIN public.roles r ON u.role = r.level
  WHERE u.id = user_id
  LIMIT 1;
$$;


--
-- Name: FUNCTION get_user_role_info(user_id uuid); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.get_user_role_info(user_id uuid) IS 'Get complete role information for a user';


--
-- Name: handle_new_auth_user(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.handle_new_auth_user() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
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


--
-- Name: is_admin(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.is_admin(user_id uuid) RETURNS boolean
    LANGUAGE sql STABLE
    AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users
    WHERE id = user_id AND role = 1
  );
$$;


--
-- Name: FUNCTION is_admin(user_id uuid); Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON FUNCTION public.is_admin(user_id uuid) IS 'Check if a user has admin role (role = 1)';


--
-- Name: search_workers_by_location(double precision, double precision, double precision, double precision, integer, text, integer, integer, boolean, boolean, integer, integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.search_workers_by_location(user_lat double precision, user_lon double precision, filter_lat double precision DEFAULT NULL::double precision, filter_lon double precision DEFAULT NULL::double precision, radius_meters integer DEFAULT 50000, search_profession text DEFAULT NULL::text, min_rate integer DEFAULT NULL::integer, max_rate integer DEFAULT NULL::integer, verified_only boolean DEFAULT false, online_only boolean DEFAULT false, result_limit integer DEFAULT 10, result_offset integer DEFAULT 0) RETURNS TABLE(id uuid, worker_id uuid, profession character varying, hourly_rate_min integer, hourly_rate_max integer, is_verified boolean, years_experience integer, jobs_completed integer, response_time_minutes integer, firstname character varying, lastname character varying, city character varying, state character varying, latitude numeric, longitude numeric, profile_pic_url text, bio text, is_online boolean, last_seen timestamp with time zone, distance_km double precision, average_rating numeric, total_ratings bigint)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  RETURN QUERY
  SELECT
    w.id,
    w.worker_id,
    w.profession,
    w.hourly_rate_min,
    w.hourly_rate_max,
    w.is_verified,
    w.years_experience,
    w.jobs_completed,
    w.response_time_minutes,
    u.firstname,
    u.lastname,
    u.city,
    u.state,
    u.latitude,
    u.longitude,
    u.profile_pic_url,
    u.bio,
    COALESCE(up.is_online, false) as is_online,
    up.last_seen,
    CASE
      WHEN u.location IS NOT NULL THEN
        ST_Distance(
          u.location,
          ST_SetSRID(ST_MakePoint(user_lon, user_lat), 4326)::geography
        ) / 1000.0
      ELSE 0
    END as distance_km,
    COALESCE(AVG(r.rating_value), 0) as average_rating,
    COUNT(r.id) as total_ratings
  FROM workers w
  INNER JOIN users u ON w.worker_id = u.id
  LEFT JOIN user_presence up ON u.id = up.user_id
  LEFT JOIN ratings r ON w.worker_id = r.worker_id
  WHERE w.status = 'available'
    AND w.deleted_at IS NULL
    AND u.location IS NOT NULL
    AND (
      filter_lat IS NULL OR filter_lon IS NULL OR
      ST_DWithin(
        u.location,
        ST_SetSRID(ST_MakePoint(filter_lon, filter_lat), 4326)::geography,
        radius_meters
      )
    )
    AND (search_profession IS NULL OR w.profession ILIKE '%' || search_profession || '%')
    AND (min_rate IS NULL OR w.hourly_rate_min >= min_rate)
    AND (max_rate IS NULL OR w.hourly_rate_max <= max_rate)
    AND (NOT verified_only OR w.is_verified = true)
    AND (NOT online_only OR COALESCE(up.is_online, false) = true)
  GROUP BY w.id, w.worker_id, w.profession, w.hourly_rate_min, w.hourly_rate_max,
           w.is_verified, w.years_experience, w.jobs_completed, w.response_time_minutes,
           u.firstname, u.lastname, u.city, u.state, u.latitude, u.longitude,
           u.profile_pic_url, u.bio, up.is_online, up.last_seen, u.location
  ORDER BY distance_km ASC
  LIMIT result_limit
  OFFSET result_offset;
END;
$$;


--
-- Name: update_user_location(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_user_location() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF NEW.latitude IS NOT NULL AND NEW.longitude IS NOT NULL THEN
    NEW.location = ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326)::geography;
  ELSE
    NEW.location = NULL;
  END IF;
  RETURN NEW;
END;
$$;


--
-- Name: apply_rls(jsonb, integer); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer DEFAULT (1024 * 1024)) RETURNS SETOF realtime.wal_rls
    LANGUAGE plpgsql
    AS $$
declare
-- Regclass of the table e.g. public.notes
entity_ regclass = (quote_ident(wal ->> 'schema') || '.' || quote_ident(wal ->> 'table'))::regclass;

-- I, U, D, T: insert, update ...
action realtime.action = (
    case wal ->> 'action'
        when 'I' then 'INSERT'
        when 'U' then 'UPDATE'
        when 'D' then 'DELETE'
        else 'ERROR'
    end
);

-- Is row level security enabled for the table
is_rls_enabled bool = relrowsecurity from pg_class where oid = entity_;

subscriptions realtime.subscription[] = array_agg(subs)
    from
        realtime.subscription subs
    where
        subs.entity = entity_;

-- Subscription vars
roles regrole[] = array_agg(distinct us.claims_role::text)
    from
        unnest(subscriptions) us;

working_role regrole;
claimed_role regrole;
claims jsonb;

subscription_id uuid;
subscription_has_access bool;
visible_to_subscription_ids uuid[] = '{}';

-- structured info for wal's columns
columns realtime.wal_column[];
-- previous identity values for update/delete
old_columns realtime.wal_column[];

error_record_exceeds_max_size boolean = octet_length(wal::text) > max_record_bytes;

-- Primary jsonb output for record
output jsonb;

begin
perform set_config('role', null, true);

columns =
    array_agg(
        (
            x->>'name',
            x->>'type',
            x->>'typeoid',
            realtime.cast(
                (x->'value') #>> '{}',
                coalesce(
                    (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                    (x->>'type')::regtype
                )
            ),
            (pks ->> 'name') is not null,
            true
        )::realtime.wal_column
    )
    from
        jsonb_array_elements(wal -> 'columns') x
        left join jsonb_array_elements(wal -> 'pk') pks
            on (x ->> 'name') = (pks ->> 'name');

old_columns =
    array_agg(
        (
            x->>'name',
            x->>'type',
            x->>'typeoid',
            realtime.cast(
                (x->'value') #>> '{}',
                coalesce(
                    (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                    (x->>'type')::regtype
                )
            ),
            (pks ->> 'name') is not null,
            true
        )::realtime.wal_column
    )
    from
        jsonb_array_elements(wal -> 'identity') x
        left join jsonb_array_elements(wal -> 'pk') pks
            on (x ->> 'name') = (pks ->> 'name');

for working_role in select * from unnest(roles) loop

    -- Update `is_selectable` for columns and old_columns
    columns =
        array_agg(
            (
                c.name,
                c.type_name,
                c.type_oid,
                c.value,
                c.is_pkey,
                pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
            )::realtime.wal_column
        )
        from
            unnest(columns) c;

    old_columns =
            array_agg(
                (
                    c.name,
                    c.type_name,
                    c.type_oid,
                    c.value,
                    c.is_pkey,
                    pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
                )::realtime.wal_column
            )
            from
                unnest(old_columns) c;

    if action <> 'DELETE' and count(1) = 0 from unnest(columns) c where c.is_pkey then
        return next (
            jsonb_build_object(
                'schema', wal ->> 'schema',
                'table', wal ->> 'table',
                'type', action
            ),
            is_rls_enabled,
            -- subscriptions is already filtered by entity
            (select array_agg(s.subscription_id) from unnest(subscriptions) as s where claims_role = working_role),
            array['Error 400: Bad Request, no primary key']
        )::realtime.wal_rls;

    -- The claims role does not have SELECT permission to the primary key of entity
    elsif action <> 'DELETE' and sum(c.is_selectable::int) <> count(1) from unnest(columns) c where c.is_pkey then
        return next (
            jsonb_build_object(
                'schema', wal ->> 'schema',
                'table', wal ->> 'table',
                'type', action
            ),
            is_rls_enabled,
            (select array_agg(s.subscription_id) from unnest(subscriptions) as s where claims_role = working_role),
            array['Error 401: Unauthorized']
        )::realtime.wal_rls;

    else
        output = jsonb_build_object(
            'schema', wal ->> 'schema',
            'table', wal ->> 'table',
            'type', action,
            'commit_timestamp', to_char(
                ((wal ->> 'timestamp')::timestamptz at time zone 'utc'),
                'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'
            ),
            'columns', (
                select
                    jsonb_agg(
                        jsonb_build_object(
                            'name', pa.attname,
                            'type', pt.typname
                        )
                        order by pa.attnum asc
                    )
                from
                    pg_attribute pa
                    join pg_type pt
                        on pa.atttypid = pt.oid
                where
                    attrelid = entity_
                    and attnum > 0
                    and pg_catalog.has_column_privilege(working_role, entity_, pa.attname, 'SELECT')
            )
        )
        -- Add "record" key for insert and update
        || case
            when action in ('INSERT', 'UPDATE') then
                jsonb_build_object(
                    'record',
                    (
                        select
                            jsonb_object_agg(
                                -- if unchanged toast, get column name and value from old record
                                coalesce((c).name, (oc).name),
                                case
                                    when (c).name is null then (oc).value
                                    else (c).value
                                end
                            )
                        from
                            unnest(columns) c
                            full outer join unnest(old_columns) oc
                                on (c).name = (oc).name
                        where
                            coalesce((c).is_selectable, (oc).is_selectable)
                            and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                    )
                )
            else '{}'::jsonb
        end
        -- Add "old_record" key for update and delete
        || case
            when action = 'UPDATE' then
                jsonb_build_object(
                        'old_record',
                        (
                            select jsonb_object_agg((c).name, (c).value)
                            from unnest(old_columns) c
                            where
                                (c).is_selectable
                                and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                        )
                    )
            when action = 'DELETE' then
                jsonb_build_object(
                    'old_record',
                    (
                        select jsonb_object_agg((c).name, (c).value)
                        from unnest(old_columns) c
                        where
                            (c).is_selectable
                            and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                            and ( not is_rls_enabled or (c).is_pkey ) -- if RLS enabled, we can't secure deletes so filter to pkey
                    )
                )
            else '{}'::jsonb
        end;

        -- Create the prepared statement
        if is_rls_enabled and action <> 'DELETE' then
            if (select 1 from pg_prepared_statements where name = 'walrus_rls_stmt' limit 1) > 0 then
                deallocate walrus_rls_stmt;
            end if;
            execute realtime.build_prepared_statement_sql('walrus_rls_stmt', entity_, columns);
        end if;

        visible_to_subscription_ids = '{}';

        for subscription_id, claims in (
                select
                    subs.subscription_id,
                    subs.claims
                from
                    unnest(subscriptions) subs
                where
                    subs.entity = entity_
                    and subs.claims_role = working_role
                    and (
                        realtime.is_visible_through_filters(columns, subs.filters)
                        or (
                          action = 'DELETE'
                          and realtime.is_visible_through_filters(old_columns, subs.filters)
                        )
                    )
        ) loop

            if not is_rls_enabled or action = 'DELETE' then
                visible_to_subscription_ids = visible_to_subscription_ids || subscription_id;
            else
                -- Check if RLS allows the role to see the record
                perform
                    -- Trim leading and trailing quotes from working_role because set_config
                    -- doesn't recognize the role as valid if they are included
                    set_config('role', trim(both '"' from working_role::text), true),
                    set_config('request.jwt.claims', claims::text, true);

                execute 'execute walrus_rls_stmt' into subscription_has_access;

                if subscription_has_access then
                    visible_to_subscription_ids = visible_to_subscription_ids || subscription_id;
                end if;
            end if;
        end loop;

        perform set_config('role', null, true);

        return next (
            output,
            is_rls_enabled,
            visible_to_subscription_ids,
            case
                when error_record_exceeds_max_size then array['Error 413: Payload Too Large']
                else '{}'
            end
        )::realtime.wal_rls;

    end if;
end loop;

perform set_config('role', null, true);
end;
$$;


--
-- Name: broadcast_changes(text, text, text, text, text, record, record, text); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text DEFAULT 'ROW'::text) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
    -- Declare a variable to hold the JSONB representation of the row
    row_data jsonb := '{}'::jsonb;
BEGIN
    IF level = 'STATEMENT' THEN
        RAISE EXCEPTION 'function can only be triggered for each row, not for each statement';
    END IF;
    -- Check the operation type and handle accordingly
    IF operation = 'INSERT' OR operation = 'UPDATE' OR operation = 'DELETE' THEN
        row_data := jsonb_build_object('old_record', OLD, 'record', NEW, 'operation', operation, 'table', table_name, 'schema', table_schema);
        PERFORM realtime.send (row_data, event_name, topic_name);
    ELSE
        RAISE EXCEPTION 'Unexpected operation type: %', operation;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Failed to process the row: %', SQLERRM;
END;

$$;


--
-- Name: build_prepared_statement_sql(text, regclass, realtime.wal_column[]); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) RETURNS text
    LANGUAGE sql
    AS $$
      /*
      Builds a sql string that, if executed, creates a prepared statement to
      tests retrive a row from *entity* by its primary key columns.
      Example
          select realtime.build_prepared_statement_sql('public.notes', '{"id"}'::text[], '{"bigint"}'::text[])
      */
          select
      'prepare ' || prepared_statement_name || ' as
          select
              exists(
                  select
                      1
                  from
                      ' || entity || '
                  where
                      ' || string_agg(quote_ident(pkc.name) || '=' || quote_nullable(pkc.value #>> '{}') , ' and ') || '
              )'
          from
              unnest(columns) pkc
          where
              pkc.is_pkey
          group by
              entity
      $$;


--
-- Name: cast(text, regtype); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime."cast"(val text, type_ regtype) RETURNS jsonb
    LANGUAGE plpgsql IMMUTABLE
    AS $$
    declare
      res jsonb;
    begin
      execute format('select to_jsonb(%L::'|| type_::text || ')', val)  into res;
      return res;
    end
    $$;


--
-- Name: check_equality_op(realtime.equality_op, regtype, text, text); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) RETURNS boolean
    LANGUAGE plpgsql IMMUTABLE
    AS $$
      /*
      Casts *val_1* and *val_2* as type *type_* and check the *op* condition for truthiness
      */
      declare
          op_symbol text = (
              case
                  when op = 'eq' then '='
                  when op = 'neq' then '!='
                  when op = 'lt' then '<'
                  when op = 'lte' then '<='
                  when op = 'gt' then '>'
                  when op = 'gte' then '>='
                  when op = 'in' then '= any'
                  else 'UNKNOWN OP'
              end
          );
          res boolean;
      begin
          execute format(
              'select %L::'|| type_::text || ' ' || op_symbol
              || ' ( %L::'
              || (
                  case
                      when op = 'in' then type_::text || '[]'
                      else type_::text end
              )
              || ')', val_1, val_2) into res;
          return res;
      end;
      $$;


--
-- Name: is_visible_through_filters(realtime.wal_column[], realtime.user_defined_filter[]); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) RETURNS boolean
    LANGUAGE sql IMMUTABLE
    AS $_$
    /*
    Should the record be visible (true) or filtered out (false) after *filters* are applied
    */
        select
            -- Default to allowed when no filters present
            $2 is null -- no filters. this should not happen because subscriptions has a default
            or array_length($2, 1) is null -- array length of an empty array is null
            or bool_and(
                coalesce(
                    realtime.check_equality_op(
                        op:=f.op,
                        type_:=coalesce(
                            col.type_oid::regtype, -- null when wal2json version <= 2.4
                            col.type_name::regtype
                        ),
                        -- cast jsonb to text
                        val_1:=col.value #>> '{}',
                        val_2:=f.value
                    ),
                    false -- if null, filter does not match
                )
            )
        from
            unnest(filters) f
            join unnest(columns) col
                on f.column_name = col.name;
    $_$;


--
-- Name: list_changes(name, name, integer, integer); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) RETURNS SETOF realtime.wal_rls
    LANGUAGE sql
    SET log_min_messages TO 'fatal'
    AS $$
      with pub as (
        select
          concat_ws(
            ',',
            case when bool_or(pubinsert) then 'insert' else null end,
            case when bool_or(pubupdate) then 'update' else null end,
            case when bool_or(pubdelete) then 'delete' else null end
          ) as w2j_actions,
          coalesce(
            string_agg(
              realtime.quote_wal2json(format('%I.%I', schemaname, tablename)::regclass),
              ','
            ) filter (where ppt.tablename is not null and ppt.tablename not like '% %'),
            ''
          ) w2j_add_tables
        from
          pg_publication pp
          left join pg_publication_tables ppt
            on pp.pubname = ppt.pubname
        where
          pp.pubname = publication
        group by
          pp.pubname
        limit 1
      ),
      w2j as (
        select
          x.*, pub.w2j_add_tables
        from
          pub,
          pg_logical_slot_get_changes(
            slot_name, null, max_changes,
            'include-pk', 'true',
            'include-transaction', 'false',
            'include-timestamp', 'true',
            'include-type-oids', 'true',
            'format-version', '2',
            'actions', pub.w2j_actions,
            'add-tables', pub.w2j_add_tables
          ) x
      )
      select
        xyz.wal,
        xyz.is_rls_enabled,
        xyz.subscription_ids,
        xyz.errors
      from
        w2j,
        realtime.apply_rls(
          wal := w2j.data::jsonb,
          max_record_bytes := max_record_bytes
        ) xyz(wal, is_rls_enabled, subscription_ids, errors)
      where
        w2j.w2j_add_tables <> ''
        and xyz.subscription_ids[1] is not null
    $$;


--
-- Name: quote_wal2json(regclass); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.quote_wal2json(entity regclass) RETURNS text
    LANGUAGE sql IMMUTABLE STRICT
    AS $$
      select
        (
          select string_agg('' || ch,'')
          from unnest(string_to_array(nsp.nspname::text, null)) with ordinality x(ch, idx)
          where
            not (x.idx = 1 and x.ch = '"')
            and not (
              x.idx = array_length(string_to_array(nsp.nspname::text, null), 1)
              and x.ch = '"'
            )
        )
        || '.'
        || (
          select string_agg('' || ch,'')
          from unnest(string_to_array(pc.relname::text, null)) with ordinality x(ch, idx)
          where
            not (x.idx = 1 and x.ch = '"')
            and not (
              x.idx = array_length(string_to_array(nsp.nspname::text, null), 1)
              and x.ch = '"'
            )
          )
      from
        pg_class pc
        join pg_namespace nsp
          on pc.relnamespace = nsp.oid
      where
        pc.oid = entity
    $$;


--
-- Name: send(jsonb, text, text, boolean); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean DEFAULT true) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  BEGIN
    -- Set the topic configuration
    EXECUTE format('SET LOCAL realtime.topic TO %L', topic);

    -- Attempt to insert the message
    INSERT INTO realtime.messages (payload, event, topic, private, extension)
    VALUES (payload, event, topic, private, 'broadcast');
  EXCEPTION
    WHEN OTHERS THEN
      -- Capture and notify the error
      RAISE WARNING 'ErrorSendingBroadcastMessage: %', SQLERRM;
  END;
END;
$$;


--
-- Name: subscription_check_filters(); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.subscription_check_filters() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
    /*
    Validates that the user defined filters for a subscription:
    - refer to valid columns that the claimed role may access
    - values are coercable to the correct column type
    */
    declare
        col_names text[] = coalesce(
                array_agg(c.column_name order by c.ordinal_position),
                '{}'::text[]
            )
            from
                information_schema.columns c
            where
                format('%I.%I', c.table_schema, c.table_name)::regclass = new.entity
                and pg_catalog.has_column_privilege(
                    (new.claims ->> 'role'),
                    format('%I.%I', c.table_schema, c.table_name)::regclass,
                    c.column_name,
                    'SELECT'
                );
        filter realtime.user_defined_filter;
        col_type regtype;

        in_val jsonb;
    begin
        for filter in select * from unnest(new.filters) loop
            -- Filtered column is valid
            if not filter.column_name = any(col_names) then
                raise exception 'invalid column for filter %', filter.column_name;
            end if;

            -- Type is sanitized and safe for string interpolation
            col_type = (
                select atttypid::regtype
                from pg_catalog.pg_attribute
                where attrelid = new.entity
                      and attname = filter.column_name
            );
            if col_type is null then
                raise exception 'failed to lookup type for column %', filter.column_name;
            end if;

            -- Set maximum number of entries for in filter
            if filter.op = 'in'::realtime.equality_op then
                in_val = realtime.cast(filter.value, (col_type::text || '[]')::regtype);
                if coalesce(jsonb_array_length(in_val), 0) > 100 then
                    raise exception 'too many values for `in` filter. Maximum 100';
                end if;
            else
                -- raises an exception if value is not coercable to type
                perform realtime.cast(filter.value, col_type);
            end if;

        end loop;

        -- Apply consistent order to filters so the unique constraint on
        -- (subscription_id, entity, filters) can't be tricked by a different filter order
        new.filters = coalesce(
            array_agg(f order by f.column_name, f.op, f.value),
            '{}'
        ) from unnest(new.filters) f;

        return new;
    end;
    $$;


--
-- Name: to_regrole(text); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.to_regrole(role_name text) RETURNS regrole
    LANGUAGE sql IMMUTABLE
    AS $$ select role_name::regrole $$;


--
-- Name: topic(); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.topic() RETURNS text
    LANGUAGE sql STABLE
    AS $$
select nullif(current_setting('realtime.topic', true), '')::text;
$$;


--
-- Name: add_prefixes(text, text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.add_prefixes(_bucket_id text, _name text) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    prefixes text[];
BEGIN
    prefixes := "storage"."get_prefixes"("_name");

    IF array_length(prefixes, 1) > 0 THEN
        INSERT INTO storage.prefixes (name, bucket_id)
        SELECT UNNEST(prefixes) as name, "_bucket_id" ON CONFLICT DO NOTHING;
    END IF;
END;
$$;


--
-- Name: can_insert_object(text, text, uuid, jsonb); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  INSERT INTO "storage"."objects" ("bucket_id", "name", "owner", "metadata") VALUES (bucketid, name, owner, metadata);
  -- hack to rollback the successful insert
  RAISE sqlstate 'PT200' using
  message = 'ROLLBACK',
  detail = 'rollback successful insert';
END
$$;


--
-- Name: delete_leaf_prefixes(text[], text[]); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.delete_leaf_prefixes(bucket_ids text[], names text[]) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_rows_deleted integer;
BEGIN
    LOOP
        WITH candidates AS (
            SELECT DISTINCT
                t.bucket_id,
                unnest(storage.get_prefixes(t.name)) AS name
            FROM unnest(bucket_ids, names) AS t(bucket_id, name)
        ),
        uniq AS (
             SELECT
                 bucket_id,
                 name,
                 storage.get_level(name) AS level
             FROM candidates
             WHERE name <> ''
             GROUP BY bucket_id, name
        ),
        leaf AS (
             SELECT
                 p.bucket_id,
                 p.name,
                 p.level
             FROM storage.prefixes AS p
                  JOIN uniq AS u
                       ON u.bucket_id = p.bucket_id
                           AND u.name = p.name
                           AND u.level = p.level
             WHERE NOT EXISTS (
                 SELECT 1
                 FROM storage.objects AS o
                 WHERE o.bucket_id = p.bucket_id
                   AND o.level = p.level + 1
                   AND o.name COLLATE "C" LIKE p.name || '/%'
             )
             AND NOT EXISTS (
                 SELECT 1
                 FROM storage.prefixes AS c
                 WHERE c.bucket_id = p.bucket_id
                   AND c.level = p.level + 1
                   AND c.name COLLATE "C" LIKE p.name || '/%'
             )
        )
        DELETE
        FROM storage.prefixes AS p
            USING leaf AS l
        WHERE p.bucket_id = l.bucket_id
          AND p.name = l.name
          AND p.level = l.level;

        GET DIAGNOSTICS v_rows_deleted = ROW_COUNT;
        EXIT WHEN v_rows_deleted = 0;
    END LOOP;
END;
$$;


--
-- Name: delete_prefix(text, text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.delete_prefix(_bucket_id text, _name text) RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
    -- Check if we can delete the prefix
    IF EXISTS(
        SELECT FROM "storage"."prefixes"
        WHERE "prefixes"."bucket_id" = "_bucket_id"
          AND level = "storage"."get_level"("_name") + 1
          AND "prefixes"."name" COLLATE "C" LIKE "_name" || '/%'
        LIMIT 1
    )
    OR EXISTS(
        SELECT FROM "storage"."objects"
        WHERE "objects"."bucket_id" = "_bucket_id"
          AND "storage"."get_level"("objects"."name") = "storage"."get_level"("_name") + 1
          AND "objects"."name" COLLATE "C" LIKE "_name" || '/%'
        LIMIT 1
    ) THEN
    -- There are sub-objects, skip deletion
    RETURN false;
    ELSE
        DELETE FROM "storage"."prefixes"
        WHERE "prefixes"."bucket_id" = "_bucket_id"
          AND level = "storage"."get_level"("_name")
          AND "prefixes"."name" = "_name";
        RETURN true;
    END IF;
END;
$$;


--
-- Name: delete_prefix_hierarchy_trigger(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.delete_prefix_hierarchy_trigger() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    prefix text;
BEGIN
    prefix := "storage"."get_prefix"(OLD."name");

    IF coalesce(prefix, '') != '' THEN
        PERFORM "storage"."delete_prefix"(OLD."bucket_id", prefix);
    END IF;

    RETURN OLD;
END;
$$;


--
-- Name: enforce_bucket_name_length(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.enforce_bucket_name_length() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin
    if length(new.name) > 100 then
        raise exception 'bucket name "%" is too long (% characters). Max is 100.', new.name, length(new.name);
    end if;
    return new;
end;
$$;


--
-- Name: extension(text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.extension(name text) RETURNS text
    LANGUAGE plpgsql IMMUTABLE
    AS $$
DECLARE
    _parts text[];
    _filename text;
BEGIN
    SELECT string_to_array(name, '/') INTO _parts;
    SELECT _parts[array_length(_parts,1)] INTO _filename;
    RETURN reverse(split_part(reverse(_filename), '.', 1));
END
$$;


--
-- Name: filename(text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.filename(name text) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
_parts text[];
BEGIN
	select string_to_array(name, '/') into _parts;
	return _parts[array_length(_parts,1)];
END
$$;


--
-- Name: foldername(text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.foldername(name text) RETURNS text[]
    LANGUAGE plpgsql IMMUTABLE
    AS $$
DECLARE
    _parts text[];
BEGIN
    -- Split on "/" to get path segments
    SELECT string_to_array(name, '/') INTO _parts;
    -- Return everything except the last segment
    RETURN _parts[1 : array_length(_parts,1) - 1];
END
$$;


--
-- Name: get_level(text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.get_level(name text) RETURNS integer
    LANGUAGE sql IMMUTABLE STRICT
    AS $$
SELECT array_length(string_to_array("name", '/'), 1);
$$;


--
-- Name: get_prefix(text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.get_prefix(name text) RETURNS text
    LANGUAGE sql IMMUTABLE STRICT
    AS $_$
SELECT
    CASE WHEN strpos("name", '/') > 0 THEN
             regexp_replace("name", '[\/]{1}[^\/]+\/?$', '')
         ELSE
             ''
        END;
$_$;


--
-- Name: get_prefixes(text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.get_prefixes(name text) RETURNS text[]
    LANGUAGE plpgsql IMMUTABLE STRICT
    AS $$
DECLARE
    parts text[];
    prefixes text[];
    prefix text;
BEGIN
    -- Split the name into parts by '/'
    parts := string_to_array("name", '/');
    prefixes := '{}';

    -- Construct the prefixes, stopping one level below the last part
    FOR i IN 1..array_length(parts, 1) - 1 LOOP
            prefix := array_to_string(parts[1:i], '/');
            prefixes := array_append(prefixes, prefix);
    END LOOP;

    RETURN prefixes;
END;
$$;


--
-- Name: get_size_by_bucket(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.get_size_by_bucket() RETURNS TABLE(size bigint, bucket_id text)
    LANGUAGE plpgsql STABLE
    AS $$
BEGIN
    return query
        select sum((metadata->>'size')::bigint) as size, obj.bucket_id
        from "storage".objects as obj
        group by obj.bucket_id;
END
$$;


--
-- Name: list_multipart_uploads_with_delimiter(text, text, text, integer, text, text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, next_key_token text DEFAULT ''::text, next_upload_token text DEFAULT ''::text) RETURNS TABLE(key text, id text, created_at timestamp with time zone)
    LANGUAGE plpgsql
    AS $_$
BEGIN
    RETURN QUERY EXECUTE
        'SELECT DISTINCT ON(key COLLATE "C") * from (
            SELECT
                CASE
                    WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                        substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1)))
                    ELSE
                        key
                END AS key, id, created_at
            FROM
                storage.s3_multipart_uploads
            WHERE
                bucket_id = $5 AND
                key ILIKE $1 || ''%'' AND
                CASE
                    WHEN $4 != '''' AND $6 = '''' THEN
                        CASE
                            WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                                substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1))) COLLATE "C" > $4
                            ELSE
                                key COLLATE "C" > $4
                            END
                    ELSE
                        true
                END AND
                CASE
                    WHEN $6 != '''' THEN
                        id COLLATE "C" > $6
                    ELSE
                        true
                    END
            ORDER BY
                key COLLATE "C" ASC, created_at ASC) as e order by key COLLATE "C" LIMIT $3'
        USING prefix_param, delimiter_param, max_keys, next_key_token, bucket_id, next_upload_token;
END;
$_$;


--
-- Name: list_objects_with_delimiter(text, text, text, integer, text, text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.list_objects_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, start_after text DEFAULT ''::text, next_token text DEFAULT ''::text) RETURNS TABLE(name text, id uuid, metadata jsonb, updated_at timestamp with time zone)
    LANGUAGE plpgsql
    AS $_$
BEGIN
    RETURN QUERY EXECUTE
        'SELECT DISTINCT ON(name COLLATE "C") * from (
            SELECT
                CASE
                    WHEN position($2 IN substring(name from length($1) + 1)) > 0 THEN
                        substring(name from 1 for length($1) + position($2 IN substring(name from length($1) + 1)))
                    ELSE
                        name
                END AS name, id, metadata, updated_at
            FROM
                storage.objects
            WHERE
                bucket_id = $5 AND
                name ILIKE $1 || ''%'' AND
                CASE
                    WHEN $6 != '''' THEN
                    name COLLATE "C" > $6
                ELSE true END
                AND CASE
                    WHEN $4 != '''' THEN
                        CASE
                            WHEN position($2 IN substring(name from length($1) + 1)) > 0 THEN
                                substring(name from 1 for length($1) + position($2 IN substring(name from length($1) + 1))) COLLATE "C" > $4
                            ELSE
                                name COLLATE "C" > $4
                            END
                    ELSE
                        true
                END
            ORDER BY
                name COLLATE "C" ASC) as e order by name COLLATE "C" LIMIT $3'
        USING prefix_param, delimiter_param, max_keys, next_token, bucket_id, start_after;
END;
$_$;


--
-- Name: lock_top_prefixes(text[], text[]); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.lock_top_prefixes(bucket_ids text[], names text[]) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_bucket text;
    v_top text;
BEGIN
    FOR v_bucket, v_top IN
        SELECT DISTINCT t.bucket_id,
            split_part(t.name, '/', 1) AS top
        FROM unnest(bucket_ids, names) AS t(bucket_id, name)
        WHERE t.name <> ''
        ORDER BY 1, 2
        LOOP
            PERFORM pg_advisory_xact_lock(hashtextextended(v_bucket || '/' || v_top, 0));
        END LOOP;
END;
$$;


--
-- Name: objects_delete_cleanup(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.objects_delete_cleanup() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_bucket_ids text[];
    v_names      text[];
BEGIN
    IF current_setting('storage.gc.prefixes', true) = '1' THEN
        RETURN NULL;
    END IF;

    PERFORM set_config('storage.gc.prefixes', '1', true);

    SELECT COALESCE(array_agg(d.bucket_id), '{}'),
           COALESCE(array_agg(d.name), '{}')
    INTO v_bucket_ids, v_names
    FROM deleted AS d
    WHERE d.name <> '';

    PERFORM storage.lock_top_prefixes(v_bucket_ids, v_names);
    PERFORM storage.delete_leaf_prefixes(v_bucket_ids, v_names);

    RETURN NULL;
END;
$$;


--
-- Name: objects_insert_prefix_trigger(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.objects_insert_prefix_trigger() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    PERFORM "storage"."add_prefixes"(NEW."bucket_id", NEW."name");
    NEW.level := "storage"."get_level"(NEW."name");

    RETURN NEW;
END;
$$;


--
-- Name: objects_update_cleanup(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.objects_update_cleanup() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    -- NEW - OLD (destinations to create prefixes for)
    v_add_bucket_ids text[];
    v_add_names      text[];

    -- OLD - NEW (sources to prune)
    v_src_bucket_ids text[];
    v_src_names      text[];
BEGIN
    IF TG_OP <> 'UPDATE' THEN
        RETURN NULL;
    END IF;

    -- 1) Compute NEW−OLD (added paths) and OLD−NEW (moved-away paths)
    WITH added AS (
        SELECT n.bucket_id, n.name
        FROM new_rows n
        WHERE n.name <> '' AND position('/' in n.name) > 0
        EXCEPT
        SELECT o.bucket_id, o.name FROM old_rows o WHERE o.name <> ''
    ),
    moved AS (
         SELECT o.bucket_id, o.name
         FROM old_rows o
         WHERE o.name <> ''
         EXCEPT
         SELECT n.bucket_id, n.name FROM new_rows n WHERE n.name <> ''
    )
    SELECT
        -- arrays for ADDED (dest) in stable order
        COALESCE( (SELECT array_agg(a.bucket_id ORDER BY a.bucket_id, a.name) FROM added a), '{}' ),
        COALESCE( (SELECT array_agg(a.name      ORDER BY a.bucket_id, a.name) FROM added a), '{}' ),
        -- arrays for MOVED (src) in stable order
        COALESCE( (SELECT array_agg(m.bucket_id ORDER BY m.bucket_id, m.name) FROM moved m), '{}' ),
        COALESCE( (SELECT array_agg(m.name      ORDER BY m.bucket_id, m.name) FROM moved m), '{}' )
    INTO v_add_bucket_ids, v_add_names, v_src_bucket_ids, v_src_names;

    -- Nothing to do?
    IF (array_length(v_add_bucket_ids, 1) IS NULL) AND (array_length(v_src_bucket_ids, 1) IS NULL) THEN
        RETURN NULL;
    END IF;

    -- 2) Take per-(bucket, top) locks: ALL prefixes in consistent global order to prevent deadlocks
    DECLARE
        v_all_bucket_ids text[];
        v_all_names text[];
    BEGIN
        -- Combine source and destination arrays for consistent lock ordering
        v_all_bucket_ids := COALESCE(v_src_bucket_ids, '{}') || COALESCE(v_add_bucket_ids, '{}');
        v_all_names := COALESCE(v_src_names, '{}') || COALESCE(v_add_names, '{}');

        -- Single lock call ensures consistent global ordering across all transactions
        IF array_length(v_all_bucket_ids, 1) IS NOT NULL THEN
            PERFORM storage.lock_top_prefixes(v_all_bucket_ids, v_all_names);
        END IF;
    END;

    -- 3) Create destination prefixes (NEW−OLD) BEFORE pruning sources
    IF array_length(v_add_bucket_ids, 1) IS NOT NULL THEN
        WITH candidates AS (
            SELECT DISTINCT t.bucket_id, unnest(storage.get_prefixes(t.name)) AS name
            FROM unnest(v_add_bucket_ids, v_add_names) AS t(bucket_id, name)
            WHERE name <> ''
        )
        INSERT INTO storage.prefixes (bucket_id, name)
        SELECT c.bucket_id, c.name
        FROM candidates c
        ON CONFLICT DO NOTHING;
    END IF;

    -- 4) Prune source prefixes bottom-up for OLD−NEW
    IF array_length(v_src_bucket_ids, 1) IS NOT NULL THEN
        -- re-entrancy guard so DELETE on prefixes won't recurse
        IF current_setting('storage.gc.prefixes', true) <> '1' THEN
            PERFORM set_config('storage.gc.prefixes', '1', true);
        END IF;

        PERFORM storage.delete_leaf_prefixes(v_src_bucket_ids, v_src_names);
    END IF;

    RETURN NULL;
END;
$$;


--
-- Name: objects_update_level_trigger(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.objects_update_level_trigger() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Ensure this is an update operation and the name has changed
    IF TG_OP = 'UPDATE' AND (NEW."name" <> OLD."name" OR NEW."bucket_id" <> OLD."bucket_id") THEN
        -- Set the new level
        NEW."level" := "storage"."get_level"(NEW."name");
    END IF;
    RETURN NEW;
END;
$$;


--
-- Name: objects_update_prefix_trigger(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.objects_update_prefix_trigger() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    old_prefixes TEXT[];
BEGIN
    -- Ensure this is an update operation and the name has changed
    IF TG_OP = 'UPDATE' AND (NEW."name" <> OLD."name" OR NEW."bucket_id" <> OLD."bucket_id") THEN
        -- Retrieve old prefixes
        old_prefixes := "storage"."get_prefixes"(OLD."name");

        -- Remove old prefixes that are only used by this object
        WITH all_prefixes as (
            SELECT unnest(old_prefixes) as prefix
        ),
        can_delete_prefixes as (
             SELECT prefix
             FROM all_prefixes
             WHERE NOT EXISTS (
                 SELECT 1 FROM "storage"."objects"
                 WHERE "bucket_id" = OLD."bucket_id"
                   AND "name" <> OLD."name"
                   AND "name" LIKE (prefix || '%')
             )
         )
        DELETE FROM "storage"."prefixes" WHERE name IN (SELECT prefix FROM can_delete_prefixes);

        -- Add new prefixes
        PERFORM "storage"."add_prefixes"(NEW."bucket_id", NEW."name");
    END IF;
    -- Set the new level
    NEW."level" := "storage"."get_level"(NEW."name");

    RETURN NEW;
END;
$$;


--
-- Name: operation(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.operation() RETURNS text
    LANGUAGE plpgsql STABLE
    AS $$
BEGIN
    RETURN current_setting('storage.operation', true);
END;
$$;


--
-- Name: prefixes_delete_cleanup(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.prefixes_delete_cleanup() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_bucket_ids text[];
    v_names      text[];
BEGIN
    IF current_setting('storage.gc.prefixes', true) = '1' THEN
        RETURN NULL;
    END IF;

    PERFORM set_config('storage.gc.prefixes', '1', true);

    SELECT COALESCE(array_agg(d.bucket_id), '{}'),
           COALESCE(array_agg(d.name), '{}')
    INTO v_bucket_ids, v_names
    FROM deleted AS d
    WHERE d.name <> '';

    PERFORM storage.lock_top_prefixes(v_bucket_ids, v_names);
    PERFORM storage.delete_leaf_prefixes(v_bucket_ids, v_names);

    RETURN NULL;
END;
$$;


--
-- Name: prefixes_insert_trigger(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.prefixes_insert_trigger() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    PERFORM "storage"."add_prefixes"(NEW."bucket_id", NEW."name");
    RETURN NEW;
END;
$$;


--
-- Name: search(text, text, integer, integer, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.search(prefix text, bucketname text, limits integer DEFAULT 100, levels integer DEFAULT 1, offsets integer DEFAULT 0, search text DEFAULT ''::text, sortcolumn text DEFAULT 'name'::text, sortorder text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql
    AS $$
declare
    can_bypass_rls BOOLEAN;
begin
    SELECT rolbypassrls
    INTO can_bypass_rls
    FROM pg_roles
    WHERE rolname = coalesce(nullif(current_setting('role', true), 'none'), current_user);

    IF can_bypass_rls THEN
        RETURN QUERY SELECT * FROM storage.search_v1_optimised(prefix, bucketname, limits, levels, offsets, search, sortcolumn, sortorder);
    ELSE
        RETURN QUERY SELECT * FROM storage.search_legacy_v1(prefix, bucketname, limits, levels, offsets, search, sortcolumn, sortorder);
    END IF;
end;
$$;


--
-- Name: search_legacy_v1(text, text, integer, integer, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.search_legacy_v1(prefix text, bucketname text, limits integer DEFAULT 100, levels integer DEFAULT 1, offsets integer DEFAULT 0, search text DEFAULT ''::text, sortcolumn text DEFAULT 'name'::text, sortorder text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
declare
    v_order_by text;
    v_sort_order text;
begin
    case
        when sortcolumn = 'name' then
            v_order_by = 'name';
        when sortcolumn = 'updated_at' then
            v_order_by = 'updated_at';
        when sortcolumn = 'created_at' then
            v_order_by = 'created_at';
        when sortcolumn = 'last_accessed_at' then
            v_order_by = 'last_accessed_at';
        else
            v_order_by = 'name';
        end case;

    case
        when sortorder = 'asc' then
            v_sort_order = 'asc';
        when sortorder = 'desc' then
            v_sort_order = 'desc';
        else
            v_sort_order = 'asc';
        end case;

    v_order_by = v_order_by || ' ' || v_sort_order;

    return query execute
        'with folders as (
           select path_tokens[$1] as folder
           from storage.objects
             where objects.name ilike $2 || $3 || ''%''
               and bucket_id = $4
               and array_length(objects.path_tokens, 1) <> $1
           group by folder
           order by folder ' || v_sort_order || '
     )
     (select folder as "name",
            null as id,
            null as updated_at,
            null as created_at,
            null as last_accessed_at,
            null as metadata from folders)
     union all
     (select path_tokens[$1] as "name",
            id,
            updated_at,
            created_at,
            last_accessed_at,
            metadata
     from storage.objects
     where objects.name ilike $2 || $3 || ''%''
       and bucket_id = $4
       and array_length(objects.path_tokens, 1) = $1
     order by ' || v_order_by || ')
     limit $5
     offset $6' using levels, prefix, search, bucketname, limits, offsets;
end;
$_$;


--
-- Name: search_v1_optimised(text, text, integer, integer, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.search_v1_optimised(prefix text, bucketname text, limits integer DEFAULT 100, levels integer DEFAULT 1, offsets integer DEFAULT 0, search text DEFAULT ''::text, sortcolumn text DEFAULT 'name'::text, sortorder text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
declare
    v_order_by text;
    v_sort_order text;
begin
    case
        when sortcolumn = 'name' then
            v_order_by = 'name';
        when sortcolumn = 'updated_at' then
            v_order_by = 'updated_at';
        when sortcolumn = 'created_at' then
            v_order_by = 'created_at';
        when sortcolumn = 'last_accessed_at' then
            v_order_by = 'last_accessed_at';
        else
            v_order_by = 'name';
        end case;

    case
        when sortorder = 'asc' then
            v_sort_order = 'asc';
        when sortorder = 'desc' then
            v_sort_order = 'desc';
        else
            v_sort_order = 'asc';
        end case;

    v_order_by = v_order_by || ' ' || v_sort_order;

    return query execute
        'with folders as (
           select (string_to_array(name, ''/''))[level] as name
           from storage.prefixes
             where lower(prefixes.name) like lower($2 || $3) || ''%''
               and bucket_id = $4
               and level = $1
           order by name ' || v_sort_order || '
     )
     (select name,
            null as id,
            null as updated_at,
            null as created_at,
            null as last_accessed_at,
            null as metadata from folders)
     union all
     (select path_tokens[level] as "name",
            id,
            updated_at,
            created_at,
            last_accessed_at,
            metadata
     from storage.objects
     where lower(objects.name) like lower($2 || $3) || ''%''
       and bucket_id = $4
       and level = $1
     order by ' || v_order_by || ')
     limit $5
     offset $6' using levels, prefix, search, bucketname, limits, offsets;
end;
$_$;


--
-- Name: search_v2(text, text, integer, integer, text, text, text, text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.search_v2(prefix text, bucket_name text, limits integer DEFAULT 100, levels integer DEFAULT 1, start_after text DEFAULT ''::text, sort_order text DEFAULT 'asc'::text, sort_column text DEFAULT 'name'::text, sort_column_after text DEFAULT ''::text) RETURNS TABLE(key text, name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
DECLARE
    sort_col text;
    sort_ord text;
    cursor_op text;
    cursor_expr text;
    sort_expr text;
BEGIN
    -- Validate sort_order
    sort_ord := lower(sort_order);
    IF sort_ord NOT IN ('asc', 'desc') THEN
        sort_ord := 'asc';
    END IF;

    -- Determine cursor comparison operator
    IF sort_ord = 'asc' THEN
        cursor_op := '>';
    ELSE
        cursor_op := '<';
    END IF;
    
    sort_col := lower(sort_column);
    -- Validate sort column  
    IF sort_col IN ('updated_at', 'created_at') THEN
        cursor_expr := format(
            '($5 = '''' OR ROW(date_trunc(''milliseconds'', %I), name COLLATE "C") %s ROW(COALESCE(NULLIF($6, '''')::timestamptz, ''epoch''::timestamptz), $5))',
            sort_col, cursor_op
        );
        sort_expr := format(
            'COALESCE(date_trunc(''milliseconds'', %I), ''epoch''::timestamptz) %s, name COLLATE "C" %s',
            sort_col, sort_ord, sort_ord
        );
    ELSE
        cursor_expr := format('($5 = '''' OR name COLLATE "C" %s $5)', cursor_op);
        sort_expr := format('name COLLATE "C" %s', sort_ord);
    END IF;

    RETURN QUERY EXECUTE format(
        $sql$
        SELECT * FROM (
            (
                SELECT
                    split_part(name, '/', $4) AS key,
                    name,
                    NULL::uuid AS id,
                    updated_at,
                    created_at,
                    NULL::timestamptz AS last_accessed_at,
                    NULL::jsonb AS metadata
                FROM storage.prefixes
                WHERE name COLLATE "C" LIKE $1 || '%%'
                    AND bucket_id = $2
                    AND level = $4
                    AND %s
                ORDER BY %s
                LIMIT $3
            )
            UNION ALL
            (
                SELECT
                    split_part(name, '/', $4) AS key,
                    name,
                    id,
                    updated_at,
                    created_at,
                    last_accessed_at,
                    metadata
                FROM storage.objects
                WHERE name COLLATE "C" LIKE $1 || '%%'
                    AND bucket_id = $2
                    AND level = $4
                    AND %s
                ORDER BY %s
                LIMIT $3
            )
        ) obj
        ORDER BY %s
        LIMIT $3
        $sql$,
        cursor_expr,    -- prefixes WHERE
        sort_expr,      -- prefixes ORDER BY
        cursor_expr,    -- objects WHERE
        sort_expr,      -- objects ORDER BY
        sort_expr       -- final ORDER BY
    )
    USING prefix, bucket_name, limits, levels, start_after, sort_column_after;
END;
$_$;


--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW; 
END;
$$;


--
-- Name: http_request(); Type: FUNCTION; Schema: supabase_functions; Owner: -
--

CREATE FUNCTION supabase_functions.http_request() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'supabase_functions'
    AS $$
  DECLARE
    request_id bigint;
    payload jsonb;
    url text := TG_ARGV[0]::text;
    method text := TG_ARGV[1]::text;
    headers jsonb DEFAULT '{}'::jsonb;
    params jsonb DEFAULT '{}'::jsonb;
    timeout_ms integer DEFAULT 1000;
  BEGIN
    IF url IS NULL OR url = 'null' THEN
      RAISE EXCEPTION 'url argument is missing';
    END IF;

    IF method IS NULL OR method = 'null' THEN
      RAISE EXCEPTION 'method argument is missing';
    END IF;

    IF TG_ARGV[2] IS NULL OR TG_ARGV[2] = 'null' THEN
      headers = '{"Content-Type": "application/json"}'::jsonb;
    ELSE
      headers = TG_ARGV[2]::jsonb;
    END IF;

    IF TG_ARGV[3] IS NULL OR TG_ARGV[3] = 'null' THEN
      params = '{}'::jsonb;
    ELSE
      params = TG_ARGV[3]::jsonb;
    END IF;

    IF TG_ARGV[4] IS NULL OR TG_ARGV[4] = 'null' THEN
      timeout_ms = 1000;
    ELSE
      timeout_ms = TG_ARGV[4]::integer;
    END IF;

    CASE
      WHEN method = 'GET' THEN
        SELECT http_get INTO request_id FROM net.http_get(
          url,
          params,
          headers,
          timeout_ms
        );
      WHEN method = 'POST' THEN
        payload = jsonb_build_object(
          'old_record', OLD,
          'record', NEW,
          'type', TG_OP,
          'table', TG_TABLE_NAME,
          'schema', TG_TABLE_SCHEMA
        );

        SELECT http_post INTO request_id FROM net.http_post(
          url,
          payload,
          params,
          headers,
          timeout_ms
        );
      ELSE
        RAISE EXCEPTION 'method argument % is invalid', method;
    END CASE;

    INSERT INTO supabase_functions.hooks
      (hook_table_id, hook_name, request_id)
    VALUES
      (TG_RELID, TG_NAME, request_id);

    RETURN NEW;
  END
$$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: extensions; Type: TABLE; Schema: _realtime; Owner: -
--

CREATE TABLE _realtime.extensions (
    id uuid NOT NULL,
    type text,
    settings jsonb,
    tenant_external_id text,
    inserted_at timestamp(0) without time zone NOT NULL,
    updated_at timestamp(0) without time zone NOT NULL
);


--
-- Name: schema_migrations; Type: TABLE; Schema: _realtime; Owner: -
--

CREATE TABLE _realtime.schema_migrations (
    version bigint NOT NULL,
    inserted_at timestamp(0) without time zone
);


--
-- Name: tenants; Type: TABLE; Schema: _realtime; Owner: -
--

CREATE TABLE _realtime.tenants (
    id uuid NOT NULL,
    name text,
    external_id text,
    jwt_secret text,
    max_concurrent_users integer DEFAULT 200 NOT NULL,
    inserted_at timestamp(0) without time zone NOT NULL,
    updated_at timestamp(0) without time zone NOT NULL,
    max_events_per_second integer DEFAULT 100 NOT NULL,
    postgres_cdc_default text DEFAULT 'postgres_cdc_rls'::text,
    max_bytes_per_second integer DEFAULT 100000 NOT NULL,
    max_channels_per_client integer DEFAULT 100 NOT NULL,
    max_joins_per_second integer DEFAULT 500 NOT NULL,
    suspend boolean DEFAULT false,
    jwt_jwks jsonb,
    notify_private_alpha boolean DEFAULT false,
    private_only boolean DEFAULT false NOT NULL,
    migrations_ran integer DEFAULT 0,
    broadcast_adapter character varying(255) DEFAULT 'gen_rpc'::character varying,
    max_presence_events_per_second integer DEFAULT 10000,
    max_payload_size_in_kb integer DEFAULT 3000
);


--
-- Name: audit_log_entries; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.audit_log_entries (
    instance_id uuid,
    id uuid NOT NULL,
    payload json,
    created_at timestamp with time zone,
    ip_address character varying(64) DEFAULT ''::character varying NOT NULL
);


--
-- Name: TABLE audit_log_entries; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.audit_log_entries IS 'Auth: Audit trail for user actions.';


--
-- Name: flow_state; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.flow_state (
    id uuid NOT NULL,
    user_id uuid,
    auth_code text NOT NULL,
    code_challenge_method auth.code_challenge_method NOT NULL,
    code_challenge text NOT NULL,
    provider_type text NOT NULL,
    provider_access_token text,
    provider_refresh_token text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    authentication_method text NOT NULL,
    auth_code_issued_at timestamp with time zone
);


--
-- Name: TABLE flow_state; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.flow_state IS 'stores metadata for pkce logins';


--
-- Name: identities; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.identities (
    provider_id text NOT NULL,
    user_id uuid NOT NULL,
    identity_data jsonb NOT NULL,
    provider text NOT NULL,
    last_sign_in_at timestamp with time zone,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    email text GENERATED ALWAYS AS (lower((identity_data ->> 'email'::text))) STORED,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


--
-- Name: TABLE identities; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.identities IS 'Auth: Stores identities associated to a user.';


--
-- Name: COLUMN identities.email; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.identities.email IS 'Auth: Email is a generated column that references the optional email property in the identity_data';


--
-- Name: instances; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.instances (
    id uuid NOT NULL,
    uuid uuid,
    raw_base_config text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


--
-- Name: TABLE instances; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.instances IS 'Auth: Manages users across multiple sites.';


--
-- Name: mfa_amr_claims; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.mfa_amr_claims (
    session_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    authentication_method text NOT NULL,
    id uuid NOT NULL
);


--
-- Name: TABLE mfa_amr_claims; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.mfa_amr_claims IS 'auth: stores authenticator method reference claims for multi factor authentication';


--
-- Name: mfa_challenges; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.mfa_challenges (
    id uuid NOT NULL,
    factor_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    verified_at timestamp with time zone,
    ip_address inet NOT NULL,
    otp_code text,
    web_authn_session_data jsonb
);


--
-- Name: TABLE mfa_challenges; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.mfa_challenges IS 'auth: stores metadata about challenge requests made';


--
-- Name: mfa_factors; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.mfa_factors (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    friendly_name text,
    factor_type auth.factor_type NOT NULL,
    status auth.factor_status NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    secret text,
    phone text,
    last_challenged_at timestamp with time zone,
    web_authn_credential jsonb,
    web_authn_aaguid uuid
);


--
-- Name: TABLE mfa_factors; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.mfa_factors IS 'auth: stores metadata about factors';


--
-- Name: oauth_authorizations; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.oauth_authorizations (
    id uuid NOT NULL,
    authorization_id text NOT NULL,
    client_id uuid NOT NULL,
    user_id uuid,
    redirect_uri text NOT NULL,
    scope text NOT NULL,
    state text,
    resource text,
    code_challenge text,
    code_challenge_method auth.code_challenge_method,
    response_type auth.oauth_response_type DEFAULT 'code'::auth.oauth_response_type NOT NULL,
    status auth.oauth_authorization_status DEFAULT 'pending'::auth.oauth_authorization_status NOT NULL,
    authorization_code text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    expires_at timestamp with time zone DEFAULT (now() + '00:03:00'::interval) NOT NULL,
    approved_at timestamp with time zone,
    CONSTRAINT oauth_authorizations_authorization_code_length CHECK ((char_length(authorization_code) <= 255)),
    CONSTRAINT oauth_authorizations_code_challenge_length CHECK ((char_length(code_challenge) <= 128)),
    CONSTRAINT oauth_authorizations_expires_at_future CHECK ((expires_at > created_at)),
    CONSTRAINT oauth_authorizations_redirect_uri_length CHECK ((char_length(redirect_uri) <= 2048)),
    CONSTRAINT oauth_authorizations_resource_length CHECK ((char_length(resource) <= 2048)),
    CONSTRAINT oauth_authorizations_scope_length CHECK ((char_length(scope) <= 4096)),
    CONSTRAINT oauth_authorizations_state_length CHECK ((char_length(state) <= 4096))
);


--
-- Name: oauth_clients; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.oauth_clients (
    id uuid NOT NULL,
    client_secret_hash text,
    registration_type auth.oauth_registration_type NOT NULL,
    redirect_uris text NOT NULL,
    grant_types text NOT NULL,
    client_name text,
    client_uri text,
    logo_uri text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    client_type auth.oauth_client_type DEFAULT 'confidential'::auth.oauth_client_type NOT NULL,
    CONSTRAINT oauth_clients_client_name_length CHECK ((char_length(client_name) <= 1024)),
    CONSTRAINT oauth_clients_client_uri_length CHECK ((char_length(client_uri) <= 2048)),
    CONSTRAINT oauth_clients_logo_uri_length CHECK ((char_length(logo_uri) <= 2048))
);


--
-- Name: oauth_consents; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.oauth_consents (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    client_id uuid NOT NULL,
    scopes text NOT NULL,
    granted_at timestamp with time zone DEFAULT now() NOT NULL,
    revoked_at timestamp with time zone,
    CONSTRAINT oauth_consents_revoked_after_granted CHECK (((revoked_at IS NULL) OR (revoked_at >= granted_at))),
    CONSTRAINT oauth_consents_scopes_length CHECK ((char_length(scopes) <= 2048)),
    CONSTRAINT oauth_consents_scopes_not_empty CHECK ((char_length(TRIM(BOTH FROM scopes)) > 0))
);


--
-- Name: one_time_tokens; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.one_time_tokens (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    token_type auth.one_time_token_type NOT NULL,
    token_hash text NOT NULL,
    relates_to text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT one_time_tokens_token_hash_check CHECK ((char_length(token_hash) > 0))
);


--
-- Name: refresh_tokens; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.refresh_tokens (
    instance_id uuid,
    id bigint NOT NULL,
    token character varying(255),
    user_id character varying(255),
    revoked boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    parent character varying(255),
    session_id uuid
);


--
-- Name: TABLE refresh_tokens; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.refresh_tokens IS 'Auth: Store of tokens used to refresh JWT tokens once they expire.';


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE; Schema: auth; Owner: -
--

CREATE SEQUENCE auth.refresh_tokens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: auth; Owner: -
--

ALTER SEQUENCE auth.refresh_tokens_id_seq OWNED BY auth.refresh_tokens.id;


--
-- Name: saml_providers; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.saml_providers (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    entity_id text NOT NULL,
    metadata_xml text NOT NULL,
    metadata_url text,
    attribute_mapping jsonb,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    name_id_format text,
    CONSTRAINT "entity_id not empty" CHECK ((char_length(entity_id) > 0)),
    CONSTRAINT "metadata_url not empty" CHECK (((metadata_url = NULL::text) OR (char_length(metadata_url) > 0))),
    CONSTRAINT "metadata_xml not empty" CHECK ((char_length(metadata_xml) > 0))
);


--
-- Name: TABLE saml_providers; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.saml_providers IS 'Auth: Manages SAML Identity Provider connections.';


--
-- Name: saml_relay_states; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.saml_relay_states (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    request_id text NOT NULL,
    for_email text,
    redirect_to text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    flow_state_id uuid,
    CONSTRAINT "request_id not empty" CHECK ((char_length(request_id) > 0))
);


--
-- Name: TABLE saml_relay_states; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.saml_relay_states IS 'Auth: Contains SAML Relay State information for each Service Provider initiated login.';


--
-- Name: schema_migrations; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.schema_migrations (
    version character varying(255) NOT NULL
);


--
-- Name: TABLE schema_migrations; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.schema_migrations IS 'Auth: Manages updates to the auth system.';


--
-- Name: sessions; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.sessions (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    factor_id uuid,
    aal auth.aal_level,
    not_after timestamp with time zone,
    refreshed_at timestamp without time zone,
    user_agent text,
    ip inet,
    tag text,
    oauth_client_id uuid
);


--
-- Name: TABLE sessions; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.sessions IS 'Auth: Stores session data associated to a user.';


--
-- Name: COLUMN sessions.not_after; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.sessions.not_after IS 'Auth: Not after is a nullable column that contains a timestamp after which the session should be regarded as expired.';


--
-- Name: sso_domains; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.sso_domains (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    domain text NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    CONSTRAINT "domain not empty" CHECK ((char_length(domain) > 0))
);


--
-- Name: TABLE sso_domains; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.sso_domains IS 'Auth: Manages SSO email address domain mapping to an SSO Identity Provider.';


--
-- Name: sso_providers; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.sso_providers (
    id uuid NOT NULL,
    resource_id text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    disabled boolean,
    CONSTRAINT "resource_id not empty" CHECK (((resource_id = NULL::text) OR (char_length(resource_id) > 0)))
);


--
-- Name: TABLE sso_providers; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.sso_providers IS 'Auth: Manages SSO identity provider information; see saml_providers for SAML.';


--
-- Name: COLUMN sso_providers.resource_id; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.sso_providers.resource_id IS 'Auth: Uniquely identifies a SSO provider according to a user-chosen resource ID (case insensitive), useful in infrastructure as code.';


--
-- Name: users; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.users (
    instance_id uuid,
    id uuid NOT NULL,
    aud character varying(255),
    role character varying(255),
    email character varying(255),
    encrypted_password character varying(255),
    email_confirmed_at timestamp with time zone,
    invited_at timestamp with time zone,
    confirmation_token character varying(255),
    confirmation_sent_at timestamp with time zone,
    recovery_token character varying(255),
    recovery_sent_at timestamp with time zone,
    email_change_token_new character varying(255),
    email_change character varying(255),
    email_change_sent_at timestamp with time zone,
    last_sign_in_at timestamp with time zone,
    raw_app_meta_data jsonb,
    raw_user_meta_data jsonb,
    is_super_admin boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    phone text DEFAULT NULL::character varying,
    phone_confirmed_at timestamp with time zone,
    phone_change text DEFAULT ''::character varying,
    phone_change_token character varying(255) DEFAULT ''::character varying,
    phone_change_sent_at timestamp with time zone,
    confirmed_at timestamp with time zone GENERATED ALWAYS AS (LEAST(email_confirmed_at, phone_confirmed_at)) STORED,
    email_change_token_current character varying(255) DEFAULT ''::character varying,
    email_change_confirm_status smallint DEFAULT 0,
    banned_until timestamp with time zone,
    reauthentication_token character varying(255) DEFAULT ''::character varying,
    reauthentication_sent_at timestamp with time zone,
    is_sso_user boolean DEFAULT false NOT NULL,
    deleted_at timestamp with time zone,
    is_anonymous boolean DEFAULT false NOT NULL,
    CONSTRAINT users_email_change_confirm_status_check CHECK (((email_change_confirm_status >= 0) AND (email_change_confirm_status <= 2)))
);


--
-- Name: TABLE users; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.users IS 'Auth: Stores user login data within a secure schema.';


--
-- Name: COLUMN users.is_sso_user; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.users.is_sso_user IS 'Auth: Set this column to true when the account comes from SSO. These accounts can have duplicate emails.';


--
-- Name: bookings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.bookings (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    customer_id uuid NOT NULL,
    worker_id uuid NOT NULL,
    category_id uuid NOT NULL,
    description text,
    requested_at timestamp with time zone DEFAULT now(),
    accepted_at timestamp with time zone,
    completed_at timestamp with time zone,
    canceled_at timestamp with time zone,
    status character varying,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT bookings_status_check CHECK (((status)::text = ANY (ARRAY['pending'::text, 'completed'::text, 'canceled'::text])))
);


--
-- Name: categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.categories (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: chats; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.chats (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    booking_id uuid NOT NULL,
    customer_id uuid NOT NULL,
    worker_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    deleted_at timestamp with time zone NOT NULL
);


--
-- Name: credit_transactions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.credit_transactions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    credit_id uuid NOT NULL,
    booking_id uuid NOT NULL,
    amount double precision NOT NULL,
    type character varying NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    CONSTRAINT credit_transactions_type_check CHECK (((type)::text = ANY (ARRAY['credit'::text, 'debit'::text])))
);


--
-- Name: credits; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.credits (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    worker_id uuid NOT NULL,
    balance double precision NOT NULL,
    currency character varying,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: favorites; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.favorites (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    customer_id uuid NOT NULL,
    worker_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: global_settings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.global_settings (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    key character varying NOT NULL,
    value text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: messages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.messages (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    chat_id uuid NOT NULL,
    sender_id uuid NOT NULL,
    receiver_id uuid NOT NULL,
    message_text text NOT NULL,
    media_url text,
    sent_at timestamp with time zone DEFAULT now() NOT NULL,
    status character varying,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT messages_status_check CHECK (((status)::text = ANY (ARRAY['sent'::text, 'delivered'::text, 'read'::text])))
);


--
-- Name: notifications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.notifications (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    title character varying NOT NULL,
    message text,
    type character varying NOT NULL,
    status character varying,
    sent_at timestamp with time zone DEFAULT now() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT notifications_status_check CHECK (((status)::text = ANY (ARRAY['delivered'::text, 'read'::text, 'failed'::text])))
);


--
-- Name: payments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    booking_id uuid NOT NULL,
    customer_id uuid NOT NULL,
    worker_id uuid NOT NULL,
    amount numeric(10,2) NOT NULL,
    currency character varying,
    payment_method character varying NOT NULL,
    reference_id character varying NOT NULL,
    payment_status character varying,
    paid_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    CONSTRAINT payments_payment_method_check CHECK (((payment_method)::text = ANY (ARRAY['card'::text, 'wallet'::text, 'cash'::text]))),
    CONSTRAINT payments_payment_status_check CHECK (((payment_status)::text = ANY (ARRAY['pending'::text, 'successful'::text, 'failed'::text])))
);


--
-- Name: profile_settings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.profile_settings (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    preference_key character varying NOT NULL,
    preference_value text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: ratings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ratings (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    booking_id uuid NOT NULL,
    customer_id uuid NOT NULL,
    worker_id uuid NOT NULL,
    rating_value integer NOT NULL,
    review_comment text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT ratings_rating_value_check CHECK (((rating_value >= 1) AND (rating_value <= 5)))
);


--
-- Name: roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.roles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    level bigint DEFAULT '2'::bigint NOT NULL,
    name character varying NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


--
-- Name: TABLE roles; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.roles IS 'System roles with hierarchical levels';


--
-- Name: COLUMN roles.level; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.roles.level IS 'Role hierarchy level (1=highest admin, 2=regular user)';


--
-- Name: user_presence; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_presence (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    last_seen timestamp with time zone DEFAULT now(),
    is_online boolean DEFAULT false NOT NULL
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id uuid NOT NULL,
    firstname character varying NOT NULL,
    lastname character varying NOT NULL,
    profile_pic_url text,
    bio text,
    status character varying,
    created_at timestamp with time zone DEFAULT now(),
    deleted_at timestamp with time zone,
    city character varying,
    state character varying,
    latitude numeric(10,8),
    longitude numeric(11,8),
    location public.geography(Point,4326),
    role_id integer DEFAULT 2 NOT NULL,
    role bigint DEFAULT 2 NOT NULL,
    CONSTRAINT users_status_check CHECK (((status)::text = ANY (ARRAY['active'::text, 'inactive'::text, 'banned'::text])))
);


--
-- Name: COLUMN users.city; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.users.city IS 'City where the user is located';


--
-- Name: COLUMN users.state; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.users.state IS 'State/Province where the user is located';


--
-- Name: COLUMN users.latitude; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.users.latitude IS 'Latitude coordinate for location-based search';


--
-- Name: COLUMN users.longitude; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.users.longitude IS 'Longitude coordinate for location-based search';


--
-- Name: COLUMN users.location; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.users.location IS 'Geographic location point for spatial queries. Auto-populated from latitude/longitude columns.';


--
-- Name: COLUMN users.role_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.users.role_id IS 'User role ID (1=ADMIN, 2=USER). References roles table.';


--
-- Name: COLUMN users.role; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.users.role IS 'User role level (1=ADMIN, 2=USER). References roles.level.';


--
-- Name: user_roles_view; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.user_roles_view AS
 SELECT u.id AS user_id,
    u.firstname,
    u.lastname,
    u.role AS role_level,
    r.name AS role_name,
    (u.role = 1) AS is_admin
   FROM (public.users u
     LEFT JOIN public.roles r ON ((u.role = r.level)));


--
-- Name: VIEW user_roles_view; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON VIEW public.user_roles_view IS 'Convenient view showing user roles with level and name';


--
-- Name: worker_posts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.worker_posts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    worker_id uuid NOT NULL,
    title character varying NOT NULL,
    content text NOT NULL,
    media_url text,
    status character varying,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: workers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.workers (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    worker_id uuid NOT NULL,
    skills text[],
    status character varying DEFAULT 'active'::character varying,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    hourly_rate_min integer,
    hourly_rate_max integer,
    years_experience integer DEFAULT 0,
    jobs_completed integer DEFAULT 0,
    response_time_minutes integer DEFAULT 60,
    is_verified boolean DEFAULT false,
    profession character varying,
    CONSTRAINT workers_status_check CHECK (((status)::text = ANY (ARRAY['available'::text, 'busy'::text, 'suspended'::text])))
);


--
-- Name: COLUMN workers.hourly_rate_min; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.workers.hourly_rate_min IS 'Minimum hourly rate in PHP';


--
-- Name: COLUMN workers.hourly_rate_max; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.workers.hourly_rate_max IS 'Maximum hourly rate in PHP';


--
-- Name: COLUMN workers.years_experience; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.workers.years_experience IS 'Number of years of professional experience';


--
-- Name: COLUMN workers.jobs_completed; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.workers.jobs_completed IS 'Total number of completed jobs';


--
-- Name: COLUMN workers.response_time_minutes; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.workers.response_time_minutes IS 'Average response time in minutes';


--
-- Name: COLUMN workers.is_verified; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.workers.is_verified IS 'Whether the worker has been verified';


--
-- Name: COLUMN workers.profession; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.workers.profession IS 'Primary profession/service category';


--
-- Name: workers_categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.workers_categories (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    worker_id uuid NOT NULL,
    category_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: messages; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.messages (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
)
PARTITION BY RANGE (inserted_at);


--
-- Name: messages_2025_12_18; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.messages_2025_12_18 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


--
-- Name: messages_2025_12_19; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.messages_2025_12_19 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


--
-- Name: messages_2025_12_20; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.messages_2025_12_20 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


--
-- Name: messages_2025_12_21; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.messages_2025_12_21 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


--
-- Name: messages_2025_12_22; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.messages_2025_12_22 (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


--
-- Name: schema_migrations; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.schema_migrations (
    version bigint NOT NULL,
    inserted_at timestamp(0) without time zone
);


--
-- Name: subscription; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.subscription (
    id bigint NOT NULL,
    subscription_id uuid NOT NULL,
    entity regclass NOT NULL,
    filters realtime.user_defined_filter[] DEFAULT '{}'::realtime.user_defined_filter[] NOT NULL,
    claims jsonb NOT NULL,
    claims_role regrole GENERATED ALWAYS AS (realtime.to_regrole((claims ->> 'role'::text))) STORED NOT NULL,
    created_at timestamp without time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


--
-- Name: subscription_id_seq; Type: SEQUENCE; Schema: realtime; Owner: -
--

ALTER TABLE realtime.subscription ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME realtime.subscription_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: buckets; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.buckets (
    id text NOT NULL,
    name text NOT NULL,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    public boolean DEFAULT false,
    avif_autodetection boolean DEFAULT false,
    file_size_limit bigint,
    allowed_mime_types text[],
    owner_id text,
    type storage.buckettype DEFAULT 'STANDARD'::storage.buckettype NOT NULL
);


--
-- Name: COLUMN buckets.owner; Type: COMMENT; Schema: storage; Owner: -
--

COMMENT ON COLUMN storage.buckets.owner IS 'Field is deprecated, use owner_id instead';


--
-- Name: buckets_analytics; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.buckets_analytics (
    id text NOT NULL,
    type storage.buckettype DEFAULT 'ANALYTICS'::storage.buckettype NOT NULL,
    format text DEFAULT 'ICEBERG'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: iceberg_namespaces; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.iceberg_namespaces (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    bucket_id text NOT NULL,
    name text NOT NULL COLLATE pg_catalog."C",
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: iceberg_tables; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.iceberg_tables (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    namespace_id uuid NOT NULL,
    bucket_id text NOT NULL,
    name text NOT NULL COLLATE pg_catalog."C",
    location text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: migrations; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.migrations (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    hash character varying(40) NOT NULL,
    executed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: objects; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.objects (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    bucket_id text,
    name text,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    last_accessed_at timestamp with time zone DEFAULT now(),
    metadata jsonb,
    path_tokens text[] GENERATED ALWAYS AS (string_to_array(name, '/'::text)) STORED,
    version text,
    owner_id text,
    user_metadata jsonb,
    level integer
);


--
-- Name: COLUMN objects.owner; Type: COMMENT; Schema: storage; Owner: -
--

COMMENT ON COLUMN storage.objects.owner IS 'Field is deprecated, use owner_id instead';


--
-- Name: prefixes; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.prefixes (
    bucket_id text NOT NULL,
    name text NOT NULL COLLATE pg_catalog."C",
    level integer GENERATED ALWAYS AS (storage.get_level(name)) STORED NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: s3_multipart_uploads; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.s3_multipart_uploads (
    id text NOT NULL,
    in_progress_size bigint DEFAULT 0 NOT NULL,
    upload_signature text NOT NULL,
    bucket_id text NOT NULL,
    key text NOT NULL COLLATE pg_catalog."C",
    version text NOT NULL,
    owner_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    user_metadata jsonb
);


--
-- Name: s3_multipart_uploads_parts; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.s3_multipart_uploads_parts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    upload_id text NOT NULL,
    size bigint DEFAULT 0 NOT NULL,
    part_number integer NOT NULL,
    bucket_id text NOT NULL,
    key text NOT NULL COLLATE pg_catalog."C",
    etag text NOT NULL,
    owner_id text,
    version text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: hooks; Type: TABLE; Schema: supabase_functions; Owner: -
--

CREATE TABLE supabase_functions.hooks (
    id bigint NOT NULL,
    hook_table_id integer NOT NULL,
    hook_name text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    request_id bigint
);


--
-- Name: TABLE hooks; Type: COMMENT; Schema: supabase_functions; Owner: -
--

COMMENT ON TABLE supabase_functions.hooks IS 'Supabase Functions Hooks: Audit trail for triggered hooks.';


--
-- Name: hooks_id_seq; Type: SEQUENCE; Schema: supabase_functions; Owner: -
--

CREATE SEQUENCE supabase_functions.hooks_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: hooks_id_seq; Type: SEQUENCE OWNED BY; Schema: supabase_functions; Owner: -
--

ALTER SEQUENCE supabase_functions.hooks_id_seq OWNED BY supabase_functions.hooks.id;


--
-- Name: migrations; Type: TABLE; Schema: supabase_functions; Owner: -
--

CREATE TABLE supabase_functions.migrations (
    version text NOT NULL,
    inserted_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: schema_migrations; Type: TABLE; Schema: supabase_migrations; Owner: -
--

CREATE TABLE supabase_migrations.schema_migrations (
    version text NOT NULL,
    statements text[],
    name text
);


--
-- Name: messages_2025_12_18; Type: TABLE ATTACH; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2025_12_18 FOR VALUES FROM ('2025-12-18 00:00:00') TO ('2025-12-19 00:00:00');


--
-- Name: messages_2025_12_19; Type: TABLE ATTACH; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2025_12_19 FOR VALUES FROM ('2025-12-19 00:00:00') TO ('2025-12-20 00:00:00');


--
-- Name: messages_2025_12_20; Type: TABLE ATTACH; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2025_12_20 FOR VALUES FROM ('2025-12-20 00:00:00') TO ('2025-12-21 00:00:00');


--
-- Name: messages_2025_12_21; Type: TABLE ATTACH; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2025_12_21 FOR VALUES FROM ('2025-12-21 00:00:00') TO ('2025-12-22 00:00:00');


--
-- Name: messages_2025_12_22; Type: TABLE ATTACH; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages ATTACH PARTITION realtime.messages_2025_12_22 FOR VALUES FROM ('2025-12-22 00:00:00') TO ('2025-12-23 00:00:00');


--
-- Name: refresh_tokens id; Type: DEFAULT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.refresh_tokens ALTER COLUMN id SET DEFAULT nextval('auth.refresh_tokens_id_seq'::regclass);


--
-- Name: hooks id; Type: DEFAULT; Schema: supabase_functions; Owner: -
--

ALTER TABLE ONLY supabase_functions.hooks ALTER COLUMN id SET DEFAULT nextval('supabase_functions.hooks_id_seq'::regclass);


--
-- Data for Name: extensions; Type: TABLE DATA; Schema: _realtime; Owner: -
--

COPY _realtime.extensions (id, type, settings, tenant_external_id, inserted_at, updated_at) FROM stdin;
9ce16960-38d6-4f79-9445-d5e6499cac82	postgres_cdc_rls	{"region": "us-east-1", "db_host": "DEqlojjh0/9GxDSXRjL6eDBUgrwV3hfxEHm31k80OYs=", "db_name": "sWBpZNdjggEPTQVlI52Zfw==", "db_port": "+enMDFi1J/3IrrquHHwUmA==", "db_user": "uxbEq/zz8DXVD53TOI1zmw==", "slot_name": "supabase_realtime_replication_slot", "db_password": "sWBpZNdjggEPTQVlI52Zfw==", "publication": "supabase_realtime", "ssl_enforced": false, "poll_interval_ms": 100, "poll_max_changes": 100, "poll_max_record_bytes": 1048576}	realtime-dev	2025-12-19 22:52:59	2025-12-19 22:52:59
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: _realtime; Owner: -
--

COPY _realtime.schema_migrations (version, inserted_at) FROM stdin;
20210706140551	2025-12-12 23:51:17
20220329161857	2025-12-12 23:51:17
20220410212326	2025-12-12 23:51:17
20220506102948	2025-12-12 23:51:17
20220527210857	2025-12-12 23:51:17
20220815211129	2025-12-12 23:51:17
20220815215024	2025-12-12 23:51:17
20220818141501	2025-12-12 23:51:17
20221018173709	2025-12-12 23:51:17
20221102172703	2025-12-12 23:51:17
20221223010058	2025-12-12 23:51:17
20230110180046	2025-12-12 23:51:17
20230810220907	2025-12-12 23:51:17
20230810220924	2025-12-12 23:51:17
20231024094642	2025-12-12 23:51:17
20240306114423	2025-12-12 23:51:17
20240418082835	2025-12-12 23:51:17
20240625211759	2025-12-12 23:51:17
20240704172020	2025-12-12 23:51:17
20240902173232	2025-12-12 23:51:17
20241106103258	2025-12-12 23:51:17
20250424203323	2025-12-12 23:51:17
20250613072131	2025-12-12 23:51:17
20250711044927	2025-12-12 23:51:17
20250811121559	2025-12-12 23:51:17
\.


--
-- Data for Name: tenants; Type: TABLE DATA; Schema: _realtime; Owner: -
--

COPY _realtime.tenants (id, name, external_id, jwt_secret, max_concurrent_users, inserted_at, updated_at, max_events_per_second, postgres_cdc_default, max_bytes_per_second, max_channels_per_client, max_joins_per_second, suspend, jwt_jwks, notify_private_alpha, private_only, migrations_ran, broadcast_adapter, max_presence_events_per_second, max_payload_size_in_kb) FROM stdin;
f067ed55-df44-4bc2-9ace-fe3a4e280663	realtime-dev	realtime-dev	iNjicxc4+llvc9wovDvqymwfnj9teWMlyOIbJ8Fh6j2WNU8CIJ2ZgjR6MUIKqSmeDmvpsKLsZ9jgXJmQPpwL8w==	200	2025-12-19 22:52:59	2025-12-19 22:52:59	100	postgres_cdc_rls	100000	100	100	f	{"keys": [{"k": "c3VwZXItc2VjcmV0LWp3dC10b2tlbi13aXRoLWF0LWxlYXN0LTMyLWNoYXJhY3RlcnMtbG9uZw", "kty": "oct"}]}	f	f	64	gen_rpc	10000	3000
\.


--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) FROM stdin;
00000000-0000-0000-0000-000000000000	e6d950a4-5d19-475a-87c3-18a2a6754ce1	{"action":"user_signedup","actor_id":"de78b808-6d79-4f50-b72a-f8373c055d5a","actor_username":"alfiepogado@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-12-13 00:10:40.471683+00	
00000000-0000-0000-0000-000000000000	55d46d60-29cc-4632-87d2-98921aa75003	{"action":"login","actor_id":"de78b808-6d79-4f50-b72a-f8373c055d5a","actor_username":"alfiepogado@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-12-13 00:10:40.474916+00	
00000000-0000-0000-0000-000000000000	2c52a56e-2474-4797-873d-f95d359cbade	{"action":"user_signedup","actor_id":"493fda70-bd9a-4506-b71f-bce5f5b9b36c","actor_username":"johndoe@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-12-13 00:11:15.158223+00	
00000000-0000-0000-0000-000000000000	17672820-9e7d-46ba-b80e-e4501058ea11	{"action":"login","actor_id":"493fda70-bd9a-4506-b71f-bce5f5b9b36c","actor_username":"johndoe@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-12-13 00:11:15.160287+00	
00000000-0000-0000-0000-000000000000	2580c22c-d8ce-46f6-aafd-a4ee59eb452d	{"action":"logout","actor_id":"493fda70-bd9a-4506-b71f-bce5f5b9b36c","actor_username":"johndoe@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-12-13 00:11:35.56998+00	
00000000-0000-0000-0000-000000000000	e5e8b066-67ab-4728-833d-f439f1f98b9f	{"action":"user_signedup","actor_id":"77b4f4ee-454e-40e9-8e1f-f34b33270d83","actor_username":"customer1@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-12-13 01:01:31.078161+00	
00000000-0000-0000-0000-000000000000	93f493b9-d59b-4040-b379-c1c09f939ad5	{"action":"login","actor_id":"77b4f4ee-454e-40e9-8e1f-f34b33270d83","actor_username":"customer1@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-12-13 01:01:31.081616+00	
00000000-0000-0000-0000-000000000000	ed9a5965-2fa5-4798-94ea-8f1a75a80dc3	{"action":"user_signedup","actor_id":"061feebf-f82f-4c95-909a-77b4b0c0690d","actor_username":"customer2@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-12-13 01:02:02.668557+00	
00000000-0000-0000-0000-000000000000	17ce119f-c197-4eef-9567-245db5670b2c	{"action":"login","actor_id":"061feebf-f82f-4c95-909a-77b4b0c0690d","actor_username":"customer2@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-12-13 01:02:02.670516+00	
00000000-0000-0000-0000-000000000000	e1a99193-98a3-465d-b90b-cbc4c497cadf	{"action":"token_refreshed","actor_id":"061feebf-f82f-4c95-909a-77b4b0c0690d","actor_username":"customer2@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-12-13 02:00:35.854974+00	
00000000-0000-0000-0000-000000000000	76484b42-b622-4c64-b428-8296d26a0029	{"action":"token_revoked","actor_id":"061feebf-f82f-4c95-909a-77b4b0c0690d","actor_username":"customer2@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-12-13 02:00:35.858514+00	
00000000-0000-0000-0000-000000000000	25d80f94-a626-4265-a07c-321314972ad8	{"action":"logout","actor_id":"061feebf-f82f-4c95-909a-77b4b0c0690d","actor_username":"customer2@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-12-13 02:08:21.980549+00	
00000000-0000-0000-0000-000000000000	e0bff449-3c7b-43c4-8eb2-28ed60a81c5d	{"action":"login","actor_id":"de78b808-6d79-4f50-b72a-f8373c055d5a","actor_username":"alfiepogado@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-12-13 02:08:28.13599+00	
00000000-0000-0000-0000-000000000000	f217a56f-56a3-4de7-a560-f83cfb35a22b	{"action":"logout","actor_id":"de78b808-6d79-4f50-b72a-f8373c055d5a","actor_username":"alfiepogado@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-12-13 02:47:51.870203+00	
00000000-0000-0000-0000-000000000000	79203663-9259-463b-afbe-6264b7bbe81b	{"action":"login","actor_id":"77b4f4ee-454e-40e9-8e1f-f34b33270d83","actor_username":"customer1@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-12-13 02:50:25.657951+00	
00000000-0000-0000-0000-000000000000	1dcf0509-630a-47e3-b64d-c132c306244e	{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"customer2@gmail.com","user_id":"061feebf-f82f-4c95-909a-77b4b0c0690d","user_phone":""}}	2025-12-13 03:30:03.850859+00	
00000000-0000-0000-0000-000000000000	7a9f5c6f-dc84-41d4-8952-9d18f878ce0b	{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"customer1@gmail.com","user_id":"77b4f4ee-454e-40e9-8e1f-f34b33270d83","user_phone":""}}	2025-12-13 03:30:03.850669+00	
00000000-0000-0000-0000-000000000000	db023ff9-e27c-455e-9053-f0c59126fe9f	{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"johndoe@gmail.com","user_id":"493fda70-bd9a-4506-b71f-bce5f5b9b36c","user_phone":""}}	2025-12-13 03:30:03.857945+00	
00000000-0000-0000-0000-000000000000	0bd8f904-0a07-414a-ac47-c9a8cbbae672	{"action":"login","actor_id":"de78b808-6d79-4f50-b72a-f8373c055d5a","actor_username":"alfiepogado@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-12-19 23:24:42.106274+00	
\.


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.flow_state (id, user_id, auth_code, code_challenge_method, code_challenge, provider_type, provider_access_token, provider_refresh_token, created_at, updated_at, authentication_method, auth_code_issued_at) FROM stdin;
\.


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at, id) FROM stdin;
de78b808-6d79-4f50-b72a-f8373c055d5a	de78b808-6d79-4f50-b72a-f8373c055d5a	{"sub": "de78b808-6d79-4f50-b72a-f8373c055d5a", "email": "alfiepogado@gmail.com", "last_name": "Pogado", "first_name": "Alfie", "email_verified": false, "phone_verified": false}	email	2025-12-13 00:10:40.470256+00	2025-12-13 00:10:40.470276+00	2025-12-13 00:10:40.470276+00	36048164-4939-4931-9ad2-6fe2d3d5084a
\.


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.instances (id, uuid, raw_base_config, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.mfa_amr_claims (session_id, created_at, updated_at, authentication_method, id) FROM stdin;
df05c53b-9337-4099-b3d0-a37bfc4b7667	2025-12-19 23:24:42.120319+00	2025-12-19 23:24:42.120319+00	password	6e6532db-4934-46f2-afdc-eea4887523a3
\.


--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.mfa_challenges (id, factor_id, created_at, verified_at, ip_address, otp_code, web_authn_session_data) FROM stdin;
\.


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.mfa_factors (id, user_id, friendly_name, factor_type, status, created_at, updated_at, secret, phone, last_challenged_at, web_authn_credential, web_authn_aaguid) FROM stdin;
\.


--
-- Data for Name: oauth_authorizations; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.oauth_authorizations (id, authorization_id, client_id, user_id, redirect_uri, scope, state, resource, code_challenge, code_challenge_method, response_type, status, authorization_code, created_at, expires_at, approved_at) FROM stdin;
\.


--
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.oauth_clients (id, client_secret_hash, registration_type, redirect_uris, grant_types, client_name, client_uri, logo_uri, created_at, updated_at, deleted_at, client_type) FROM stdin;
\.


--
-- Data for Name: oauth_consents; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.oauth_consents (id, user_id, client_id, scopes, granted_at, revoked_at) FROM stdin;
\.


--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.one_time_tokens (id, user_id, token_type, token_hash, relates_to, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.refresh_tokens (instance_id, id, token, user_id, revoked, created_at, updated_at, parent, session_id) FROM stdin;
00000000-0000-0000-0000-000000000000	8	6b6ihdiyb53v	de78b808-6d79-4f50-b72a-f8373c055d5a	f	2025-12-19 23:24:42.113664+00	2025-12-19 23:24:42.113664+00	\N	df05c53b-9337-4099-b3d0-a37bfc4b7667
\.


--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.saml_providers (id, sso_provider_id, entity_id, metadata_xml, metadata_url, attribute_mapping, created_at, updated_at, name_id_format) FROM stdin;
\.


--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.saml_relay_states (id, sso_provider_id, request_id, for_email, redirect_to, created_at, updated_at, flow_state_id) FROM stdin;
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.schema_migrations (version) FROM stdin;
20171026211738
20171026211808
20171026211834
20180103212743
20180108183307
20180119214651
20180125194653
00
20210710035447
20210722035447
20210730183235
20210909172000
20210927181326
20211122151130
20211124214934
20211202183645
20220114185221
20220114185340
20220224000811
20220323170000
20220429102000
20220531120530
20220614074223
20220811173540
20221003041349
20221003041400
20221011041400
20221020193600
20221021073300
20221021082433
20221027105023
20221114143122
20221114143410
20221125140132
20221208132122
20221215195500
20221215195800
20221215195900
20230116124310
20230116124412
20230131181311
20230322519590
20230402418590
20230411005111
20230508135423
20230523124323
20230818113222
20230914180801
20231027141322
20231114161723
20231117164230
20240115144230
20240214120130
20240306115329
20240314092811
20240427152123
20240612123726
20240729123726
20240802193726
20240806073726
20241009103726
20250717082212
20250731150234
20250804100000
20250901200500
20250903112500
20250904133000
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.sessions (id, user_id, created_at, updated_at, factor_id, aal, not_after, refreshed_at, user_agent, ip, tag, oauth_client_id) FROM stdin;
df05c53b-9337-4099-b3d0-a37bfc4b7667	de78b808-6d79-4f50-b72a-f8373c055d5a	2025-12-19 23:24:42.108113+00	2025-12-19 23:24:42.108113+00	\N	aal1	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	172.18.0.1	\N	\N
\.


--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.sso_domains (id, sso_provider_id, domain, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.sso_providers (id, resource_id, created_at, updated_at, disabled) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, invited_at, confirmation_token, confirmation_sent_at, recovery_token, recovery_sent_at, email_change_token_new, email_change, email_change_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at, phone, phone_confirmed_at, phone_change, phone_change_token, phone_change_sent_at, email_change_token_current, email_change_confirm_status, banned_until, reauthentication_token, reauthentication_sent_at, is_sso_user, deleted_at, is_anonymous) FROM stdin;
00000000-0000-0000-0000-000000000000	de78b808-6d79-4f50-b72a-f8373c055d5a	authenticated	authenticated	alfiepogado@gmail.com	$2a$10$fob9P.uyevHJzasLWbgCoe1MXqlUf4zk1uh2EP4O.2Tb6YYAF5mLy	2025-12-13 00:10:40.472358+00	\N		\N		\N			\N	2025-12-19 23:24:42.108064+00	{"provider": "email", "providers": ["email"]}	{"sub": "de78b808-6d79-4f50-b72a-f8373c055d5a", "email": "alfiepogado@gmail.com", "last_name": "Pogado", "first_name": "Alfie", "email_verified": true, "phone_verified": false}	\N	2025-12-13 00:10:40.442563+00	2025-12-19 23:24:42.119562+00	\N	\N			\N		0	\N		\N	f	\N	f
\.


--
-- Data for Name: bookings; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.bookings (id, customer_id, worker_id, category_id, description, requested_at, accepted_at, completed_at, canceled_at, status, created_at) FROM stdin;
f96c43ee-63bc-42d1-b6af-52ca4dfe384d	158e9458-44c9-4638-83b9-bf0c99bdb64a	26e02acd-4f32-4619-b25d-dc8273db7df6	368f7187-4490-4015-84fa-20a4f46eea09	Locksmith service needed in Manila. Inspection and consultation.	2025-01-11 06:16:07.720918+00	\N	\N	\N	pending	2025-02-02 16:29:38.095318+00
26c17795-ab71-48e6-83b1-2ed9b80af601	503f2221-11c2-4415-9a5b-9b0e81e95b67	26e02acd-4f32-4619-b25d-dc8273db7df6	368f7187-4490-4015-84fa-20a4f46eea09	Locksmith service needed in Manila. General service request.	2025-08-05 18:20:22.514518+00	\N	\N	\N	canceled	2025-08-15 04:57:17.061718+00
dac8a8cd-df46-41ba-a1f2-a8b7f58c1ebc	5eae5e90-1914-41e5-be8a-aef4314d4892	26e02acd-4f32-4619-b25d-dc8273db7df6	368f7187-4490-4015-84fa-20a4f46eea09	Locksmith service needed in Manila. Urgent repair needed.	2025-10-31 23:03:26.076118+00	\N	2025-10-23 10:04:15.381718+00	\N	completed	2025-10-18 07:08:46.764118+00
e9b29b9e-ffd9-4850-8c55-04ec7fe8ae78	4893cb6b-0ffd-422a-b940-7b9201daa34f	26e02acd-4f32-4619-b25d-dc8273db7df6	368f7187-4490-4015-84fa-20a4f46eea09	Locksmith service needed in Manila. Regular maintenance required.	2025-08-17 14:09:07.010518+00	\N	2025-07-10 23:30:06.117718+00	\N	completed	2025-02-25 01:54:00.242518+00
545e0cb6-71d8-4399-af56-5578f14d40c9	218a9cdd-7d3a-44c9-bd7a-d885d38d6063	26e02acd-4f32-4619-b25d-dc8273db7df6	368f7187-4490-4015-84fa-20a4f46eea09	Locksmith service needed in Manila. Installation and setup.	2025-03-19 15:49:59.416918+00	\N	2025-11-01 07:25:17.253718+00	\N	completed	2025-09-19 07:24:24.549718+00
76c7da3d-2327-4ce1-9e00-c4304752a303	4eea189c-607a-466d-8f92-1f53d790fb6f	26e02acd-4f32-4619-b25d-dc8273db7df6	368f7187-4490-4015-84fa-20a4f46eea09	Locksmith service needed in Manila. Inspection and consultation.	2025-10-23 01:46:31.567318+00	\N	2025-11-18 11:24:32.700118+00	\N	completed	2025-12-01 11:44:15.256918+00
2b8e1311-4db4-4876-beea-9552a244db8d	5c74fdb2-b4d9-4f4b-9c6c-f6b72854db84	26e02acd-4f32-4619-b25d-dc8273db7df6	368f7187-4490-4015-84fa-20a4f46eea09	Locksmith service needed in Manila. General service request.	2025-09-05 15:21:30.597718+00	\N	2025-10-26 16:47:44.143318+00	\N	completed	2025-02-01 08:27:11.157718+00
246e1f10-b0b5-41ee-80df-53972111c83a	9e61d17b-97a4-45e7-a26c-4fdc3086cdb7	26e02acd-4f32-4619-b25d-dc8273db7df6	368f7187-4490-4015-84fa-20a4f46eea09	Locksmith service needed in Manila. Urgent repair needed.	2025-08-17 23:54:01.135318+00	\N	2025-11-09 19:08:16.696918+00	\N	completed	2025-02-17 16:18:44.047318+00
09a79789-124a-4d64-8cc2-b76dad586a16	6302ea1c-5af4-4302-918a-c87152175bae	26e02acd-4f32-4619-b25d-dc8273db7df6	368f7187-4490-4015-84fa-20a4f46eea09	Locksmith service needed in Manila. Regular maintenance required.	2025-02-27 10:08:33.717718+00	\N	2025-08-22 23:56:51.084118+00	\N	completed	2025-04-25 15:46:59.704918+00
9b24940b-4138-4fa9-a328-10b949b834fc	a3563a32-75c5-4d0b-b672-9f548fe69a06	26e02acd-4f32-4619-b25d-dc8273db7df6	368f7187-4490-4015-84fa-20a4f46eea09	Locksmith service needed in Manila. Installation and setup.	2025-08-23 18:54:26.392918+00	\N	2025-09-23 03:23:21.880918+00	\N	completed	2025-02-01 20:37:53.023318+00
7669a23d-c969-4096-9d6a-32add44951b8	5fcd65e1-d364-4762-a7e2-9939ef039247	26e02acd-4f32-4619-b25d-dc8273db7df6	368f7187-4490-4015-84fa-20a4f46eea09	Locksmith service needed in Manila. Inspection and consultation.	2025-01-24 00:33:51.564118+00	\N	2025-08-26 06:22:58.466518+00	\N	completed	2024-12-20 23:27:24.290518+00
318c127c-5ddb-45ee-996d-268f18315553	649a4947-627c-43f2-9c5e-b75f213a0d93	26e02acd-4f32-4619-b25d-dc8273db7df6	368f7187-4490-4015-84fa-20a4f46eea09	Locksmith service needed in Manila. General service request.	2025-12-01 03:47:55.605718+00	\N	2025-05-15 05:58:32.258518+00	\N	completed	2025-08-17 09:01:01.039318+00
ba4e0d3d-0e40-46a3-b92b-6e2f97aed121	3c6ff2a2-e59e-48af-8a8e-9238dc49ecc6	26e02acd-4f32-4619-b25d-dc8273db7df6	368f7187-4490-4015-84fa-20a4f46eea09	Locksmith service needed in Manila. Urgent repair needed.	2025-01-30 04:48:31.490518+00	\N	2025-06-28 22:29:38.008918+00	\N	completed	2025-02-27 04:34:02.392918+00
bd0b92f0-642b-40ee-8a1d-31a0d806fe91	9e61d17b-97a4-45e7-a26c-4fdc3086cdb7	daf2b506-ab68-4768-8088-8c513172906b	fa26da00-47e3-4456-8d91-ef631d37234a	Landscaper service needed in Quezon City. Urgent repair needed.	2025-01-19 15:05:29.570518+00	\N	\N	\N	pending	2025-08-22 20:56:54.021718+00
9fad6db7-93b8-4ffc-86ae-597d9db6e525	6302ea1c-5af4-4302-918a-c87152175bae	daf2b506-ab68-4768-8088-8c513172906b	fa26da00-47e3-4456-8d91-ef631d37234a	Landscaper service needed in Quezon City. Regular maintenance required.	2025-12-01 21:39:58.245718+00	\N	2025-08-01 04:47:38.181718+00	\N	completed	2025-07-31 17:03:29.618518+00
07c4d7be-1ee4-4e00-b751-657bc99ff13f	a3563a32-75c5-4d0b-b672-9f548fe69a06	daf2b506-ab68-4768-8088-8c513172906b	fa26da00-47e3-4456-8d91-ef631d37234a	Landscaper service needed in Quezon City. Installation and setup.	2024-12-21 10:01:09.535318+00	\N	2025-06-28 17:44:07.308118+00	\N	completed	2025-05-29 02:01:05.762518+00
e3823134-a61c-4029-b48f-c6fa080ec07d	5fcd65e1-d364-4762-a7e2-9939ef039247	daf2b506-ab68-4768-8088-8c513172906b	fa26da00-47e3-4456-8d91-ef631d37234a	Landscaper service needed in Quezon City. Inspection and consultation.	2025-10-27 17:20:38.815318+00	\N	2025-12-06 03:00:43.672918+00	\N	completed	2025-11-16 23:12:15.794518+00
f8dcf1af-4416-42ae-b591-f0611618c3d7	649a4947-627c-43f2-9c5e-b75f213a0d93	daf2b506-ab68-4768-8088-8c513172906b	fa26da00-47e3-4456-8d91-ef631d37234a	Landscaper service needed in Quezon City. General service request.	2025-02-08 15:52:38.565718+00	\N	2025-11-07 01:46:22.754518+00	\N	completed	2025-06-18 23:18:00.184918+00
a27fba30-c121-41b6-9207-beb5b225d73e	3c6ff2a2-e59e-48af-8a8e-9238dc49ecc6	daf2b506-ab68-4768-8088-8c513172906b	fa26da00-47e3-4456-8d91-ef631d37234a	Landscaper service needed in Quezon City. Urgent repair needed.	2025-10-02 06:38:45.496918+00	\N	2025-08-23 01:45:40.504918+00	\N	completed	2025-02-10 01:13:23.330518+00
23b8606e-6a86-414a-8a79-77028de9dd7e	496d267d-f0aa-4592-a87a-bd69e1196f23	daf2b506-ab68-4768-8088-8c513172906b	fa26da00-47e3-4456-8d91-ef631d37234a	Landscaper service needed in Quezon City. Regular maintenance required.	2025-03-08 20:00:18.847318+00	\N	2025-02-23 07:19:43.058518+00	\N	completed	2025-11-04 23:17:06.271318+00
dfdaa2c9-b351-4021-9c78-6590513b1570	5c328f75-464c-4053-a41e-00fbc6eba934	daf2b506-ab68-4768-8088-8c513172906b	fa26da00-47e3-4456-8d91-ef631d37234a	Landscaper service needed in Quezon City. Installation and setup.	2025-09-04 11:03:43.183318+00	\N	2025-02-28 13:54:57.439318+00	\N	completed	2025-08-10 01:07:00.146518+00
39a81f14-a1e4-46e0-9773-53d2ba0083c0	bed6bf7a-bfbb-4eac-b6d7-35ca3e7d6660	daf2b506-ab68-4768-8088-8c513172906b	fa26da00-47e3-4456-8d91-ef631d37234a	Landscaper service needed in Quezon City. Inspection and consultation.	2025-07-16 20:55:37.557718+00	\N	2025-03-16 16:58:22.293718+00	\N	completed	2025-10-07 14:41:29.023318+00
34db24e8-5510-47f8-802d-4c509a3fe08c	549f87d2-961e-48f8-bcff-7286d7db879e	daf2b506-ab68-4768-8088-8c513172906b	fa26da00-47e3-4456-8d91-ef631d37234a	Landscaper service needed in Quezon City. General service request.	2025-01-21 19:20:53.474518+00	\N	2025-12-19 01:03:14.901718+00	\N	completed	2025-06-19 00:29:38.930518+00
9b444c74-8fb1-4cfb-91ba-51591834817e	5c328f75-464c-4053-a41e-00fbc6eba934	c2881953-2ba8-4258-b661-5cd2f4e212d5	ff8acab6-8c85-4fb8-af36-781b98920efb	Painter service needed in Makati. Installation and setup.	2025-03-22 11:47:32.594518+00	\N	\N	\N	pending	2024-12-25 13:08:25.682518+00
e191d69a-a8b0-4695-8fd4-bd9116bdd117	bed6bf7a-bfbb-4eac-b6d7-35ca3e7d6660	c2881953-2ba8-4258-b661-5cd2f4e212d5	ff8acab6-8c85-4fb8-af36-781b98920efb	Painter service needed in Makati. Inspection and consultation.	2025-09-10 20:09:26.536918+00	\N	2025-06-11 21:12:46.495318+00	\N	completed	2025-08-05 13:47:23.752918+00
53bb2956-faab-44b6-bc70-24ac0a917217	549f87d2-961e-48f8-bcff-7286d7db879e	c2881953-2ba8-4258-b661-5cd2f4e212d5	ff8acab6-8c85-4fb8-af36-781b98920efb	Painter service needed in Makati. General service request.	2025-07-24 10:20:15.717718+00	\N	2025-07-29 18:04:32.373718+00	\N	completed	2025-08-22 18:26:41.551318+00
2161f556-0f56-4aab-b071-aed84a1ca3af	a8957421-6c24-4110-ad8a-89513c6cfe93	c2881953-2ba8-4258-b661-5cd2f4e212d5	ff8acab6-8c85-4fb8-af36-781b98920efb	Painter service needed in Makati. Urgent repair needed.	2025-10-26 19:06:03.295318+00	\N	2025-04-19 07:48:48.079318+00	\N	completed	2025-05-08 03:21:03.640918+00
817c907c-5636-4e02-9bdd-92d5a69c087a	ded07a3d-2dc7-40f1-a9df-81b72c989abf	c2881953-2ba8-4258-b661-5cd2f4e212d5	ff8acab6-8c85-4fb8-af36-781b98920efb	Painter service needed in Makati. Regular maintenance required.	2024-12-30 03:04:27.016918+00	\N	2025-04-16 14:33:25.788118+00	\N	completed	2025-11-13 07:15:56.172118+00
9fe5a710-877f-4a6a-aa0d-7d28a4d5d5b5	f97cfaac-5a4e-420a-a445-9776c13600b8	c2881953-2ba8-4258-b661-5cd2f4e212d5	ff8acab6-8c85-4fb8-af36-781b98920efb	Painter service needed in Makati. Installation and setup.	2025-09-24 04:31:36.204118+00	\N	2025-05-01 00:19:04.408918+00	\N	completed	2025-07-29 03:08:48.895318+00
98287418-4e35-4d53-9a5d-67da104adfc7	2594b276-c01e-4543-b2b5-0cd20667b7a6	c2881953-2ba8-4258-b661-5cd2f4e212d5	ff8acab6-8c85-4fb8-af36-781b98920efb	Painter service needed in Makati. Inspection and consultation.	2025-11-05 07:43:34.101718+00	\N	2025-12-19 15:50:06.760918+00	\N	completed	2025-02-02 14:06:14.901718+00
c5125e2a-69c0-4276-984a-7d6256f01e26	216ebdf7-cd45-4b40-86f2-268b4e33bb68	862bf73b-5359-4061-9312-c7c9bcb54dc9	c87b314f-ad10-4e91-b2e6-dbd8cdf13230	Plumber service needed in Taguig. General service request.	2025-02-03 22:46:05.820118+00	\N	\N	\N	pending	2025-04-24 01:14:58.629718+00
7ba0c836-c84c-47e4-8905-51c64ce7f61e	f74860cc-f981-42b4-809d-11e92bedd14f	862bf73b-5359-4061-9312-c7c9bcb54dc9	c87b314f-ad10-4e91-b2e6-dbd8cdf13230	Plumber service needed in Taguig. Urgent repair needed.	2025-09-27 12:49:44.037718+00	\N	2025-09-15 22:33:15.391318+00	\N	completed	2025-10-05 00:04:54.664918+00
34da8887-3b19-4f3d-9aff-456130cf2b24	d951675f-497c-4ccb-b55d-6a72f9cfb8fc	862bf73b-5359-4061-9312-c7c9bcb54dc9	c87b314f-ad10-4e91-b2e6-dbd8cdf13230	Plumber service needed in Taguig. Regular maintenance required.	2025-09-30 10:07:31.855318+00	\N	2025-10-04 07:33:51.160918+00	\N	completed	2025-03-16 18:27:14.037718+00
54c67e38-b737-4221-9a94-f9a8e5d8b1e1	dd3b46e4-576f-488e-928f-a5a2688e0fd4	862bf73b-5359-4061-9312-c7c9bcb54dc9	c87b314f-ad10-4e91-b2e6-dbd8cdf13230	Plumber service needed in Taguig. Installation and setup.	2025-06-03 07:31:13.826518+00	\N	2025-12-07 13:31:29.724118+00	\N	completed	2025-07-04 13:34:12.674518+00
f9414ab0-916b-4ab8-bb52-fdf9b1d59da9	7d6e1a27-d7f8-445f-a544-81c817a39304	862bf73b-5359-4061-9312-c7c9bcb54dc9	c87b314f-ad10-4e91-b2e6-dbd8cdf13230	Plumber service needed in Taguig. Inspection and consultation.	2025-09-15 08:56:31.903318+00	\N	2025-04-07 04:50:57.765718+00	\N	completed	2025-01-10 11:19:10.773718+00
ed11e821-3514-4f6d-9520-2bc9575ae4be	088c7759-5ee8-4fd2-99fa-6d6953d6e99c	862bf73b-5359-4061-9312-c7c9bcb54dc9	c87b314f-ad10-4e91-b2e6-dbd8cdf13230	Plumber service needed in Taguig. General service request.	2025-11-20 10:53:19.548118+00	\N	2025-05-22 01:32:18.453718+00	\N	completed	2025-10-23 02:52:07.692118+00
bae1f94b-9449-4719-a89f-00f810437539	ce930397-85a0-4a2c-9d12-343341780701	862bf73b-5359-4061-9312-c7c9bcb54dc9	c87b314f-ad10-4e91-b2e6-dbd8cdf13230	Plumber service needed in Taguig. Urgent repair needed.	2025-06-22 10:38:33.775318+00	\N	2025-11-11 16:29:41.551318+00	\N	completed	2025-04-03 14:55:26.757718+00
21efc08f-242b-4829-808d-623acf8bb097	2637c6dd-5fbe-487c-85c5-3ef87dc74cf5	862bf73b-5359-4061-9312-c7c9bcb54dc9	c87b314f-ad10-4e91-b2e6-dbd8cdf13230	Plumber service needed in Taguig. Regular maintenance required.	2025-10-07 00:58:12.760918+00	\N	2025-05-10 14:21:53.292118+00	\N	completed	2025-09-12 19:43:05.762518+00
2ec6d2b1-d2a9-4f8a-82cd-9a3337f85047	d4d09b07-6022-4d29-8d83-2905a67c2fb0	862bf73b-5359-4061-9312-c7c9bcb54dc9	c87b314f-ad10-4e91-b2e6-dbd8cdf13230	Plumber service needed in Taguig. Installation and setup.	2025-08-23 23:11:56.700118+00	\N	2025-10-21 07:12:13.692118+00	\N	completed	2025-04-20 09:05:02.181718+00
045407d5-07ad-48bc-980e-0bba40a54469	9c0e3b56-4094-4a57-b207-abb436a8fe3d	862bf73b-5359-4061-9312-c7c9bcb54dc9	c87b314f-ad10-4e91-b2e6-dbd8cdf13230	Plumber service needed in Taguig. Inspection and consultation.	2025-11-19 19:14:44.114518+00	\N	2025-08-27 12:14:25.682518+00	\N	completed	2025-11-11 22:57:50.757718+00
58a6ca88-7a26-4730-8f84-f56cd6ffc249	6e0bbfe1-f2fd-4356-8684-bc8d8fb15a28	862bf73b-5359-4061-9312-c7c9bcb54dc9	c87b314f-ad10-4e91-b2e6-dbd8cdf13230	Plumber service needed in Taguig. General service request.	2025-06-22 18:30:38.546518+00	\N	2025-07-05 18:16:41.503318+00	\N	completed	2025-10-11 04:53:10.130518+00
5cb89257-6162-4540-9ac8-d30ffed732a3	2f6a0b4d-ff98-443f-a347-bc1c2e867bf5	862bf73b-5359-4061-9312-c7c9bcb54dc9	c87b314f-ad10-4e91-b2e6-dbd8cdf13230	Plumber service needed in Taguig. Urgent repair needed.	2025-11-17 06:15:58.303318+00	\N	2025-03-13 06:18:37.797718+00	\N	completed	2025-05-01 23:39:35.925718+00
4cccd307-c0ec-4849-8827-5c2855ffed78	c02b1823-7eec-4776-812e-b2a42402a542	862bf73b-5359-4061-9312-c7c9bcb54dc9	c87b314f-ad10-4e91-b2e6-dbd8cdf13230	Plumber service needed in Taguig. Regular maintenance required.	2025-11-30 19:01:47.119318+00	\N	2025-08-14 00:05:35.359318+00	\N	completed	2025-09-03 09:53:05.090518+00
12c866dc-8749-41db-a900-326ea715d33a	8568204d-bac8-4bd2-be49-666099493157	862bf73b-5359-4061-9312-c7c9bcb54dc9	c87b314f-ad10-4e91-b2e6-dbd8cdf13230	Plumber service needed in Taguig. Installation and setup.	2025-04-15 07:06:49.000918+00	\N	2025-12-12 19:28:41.589718+00	\N	completed	2025-12-07 14:21:24.088918+00
36a41972-2a59-4028-af3a-8706ffb97e9b	2637c6dd-5fbe-487c-85c5-3ef87dc74cf5	34228761-bcf2-4ff3-bfd1-f65d3d050d2b	67b073d4-c07b-4f32-97c5-d64e4797044e	Handyman service needed in Pasig. Regular maintenance required.	2025-08-22 16:31:59.445718+00	\N	\N	\N	pending	2025-08-14 07:13:53.224918+00
489f3ddc-bdae-4eed-9d5d-7522f1123528	d4d09b07-6022-4d29-8d83-2905a67c2fb0	34228761-bcf2-4ff3-bfd1-f65d3d050d2b	67b073d4-c07b-4f32-97c5-d64e4797044e	Handyman service needed in Pasig. Installation and setup.	2025-08-30 02:28:10.514518+00	\N	2025-06-28 12:28:24.453718+00	\N	completed	2025-10-22 06:34:54.376918+00
119ea188-30cf-462a-add9-99f22aa0b5d2	9c0e3b56-4094-4a57-b207-abb436a8fe3d	34228761-bcf2-4ff3-bfd1-f65d3d050d2b	67b073d4-c07b-4f32-97c5-d64e4797044e	Handyman service needed in Pasig. Inspection and consultation.	2025-04-29 01:40:33.612118+00	\N	2025-08-31 23:05:58.399318+00	\N	completed	2025-09-12 21:49:07.749718+00
81f70da5-7e0c-4b73-a5c2-7bfd00f3067c	6e0bbfe1-f2fd-4356-8684-bc8d8fb15a28	34228761-bcf2-4ff3-bfd1-f65d3d050d2b	67b073d4-c07b-4f32-97c5-d64e4797044e	Handyman service needed in Pasig. General service request.	2025-07-17 02:28:37.816918+00	\N	2025-09-04 09:55:31.452118+00	\N	completed	2025-01-13 21:41:25.423318+00
127aaa27-af59-4f1f-b78e-1946dd873d6c	2f6a0b4d-ff98-443f-a347-bc1c2e867bf5	34228761-bcf2-4ff3-bfd1-f65d3d050d2b	67b073d4-c07b-4f32-97c5-d64e4797044e	Handyman service needed in Pasig. Urgent repair needed.	2025-01-03 06:41:32.421718+00	\N	2025-08-03 13:38:04.053718+00	\N	completed	2025-04-03 11:43:19.442518+00
c9cbad17-9262-42e7-a629-a316c745c911	c02b1823-7eec-4776-812e-b2a42402a542	34228761-bcf2-4ff3-bfd1-f65d3d050d2b	67b073d4-c07b-4f32-97c5-d64e4797044e	Handyman service needed in Pasig. Regular maintenance required.	2025-05-10 10:36:30.914518+00	\N	2025-12-19 01:39:09.458518+00	\N	completed	2025-06-04 07:00:59.080918+00
9504ffb6-86ef-4de2-bc23-c7d4c17f72b1	8568204d-bac8-4bd2-be49-666099493157	34228761-bcf2-4ff3-bfd1-f65d3d050d2b	67b073d4-c07b-4f32-97c5-d64e4797044e	Handyman service needed in Pasig. Installation and setup.	2025-04-12 16:48:57.237718+00	\N	2025-05-11 16:31:39.573718+00	\N	completed	2025-08-24 03:01:44.930518+00
020c15b9-43cd-4407-833f-91140f10d838	3505bad0-2d27-427b-ae95-3169a5838fbf	34228761-bcf2-4ff3-bfd1-f65d3d050d2b	67b073d4-c07b-4f32-97c5-d64e4797044e	Handyman service needed in Pasig. Inspection and consultation.	2025-04-27 06:45:28.639318+00	\N	2025-11-06 03:09:52.053718+00	\N	completed	2025-09-05 11:48:54.760918+00
b348d8ae-45a3-42e3-af7b-e957c3fe08c0	5be0cd9f-a466-4485-ac43-bdc4b104ecc0	34228761-bcf2-4ff3-bfd1-f65d3d050d2b	67b073d4-c07b-4f32-97c5-d64e4797044e	Handyman service needed in Pasig. General service request.	2024-12-30 08:49:57.055318+00	\N	2025-10-12 22:39:28.380118+00	\N	completed	2025-12-03 00:03:26.018518+00
2f3dd643-1a8d-4365-ba49-0a64f90a5b57	ee82e0a0-0f37-4a6f-ae93-2113eddeb55c	34228761-bcf2-4ff3-bfd1-f65d3d050d2b	67b073d4-c07b-4f32-97c5-d64e4797044e	Handyman service needed in Pasig. Urgent repair needed.	2025-08-19 21:46:35.944918+00	\N	2025-04-30 02:15:51.103318+00	\N	completed	2025-09-12 01:21:00.904918+00
73b9577b-5bff-4db6-921e-b093c9a49cd9	40ec397a-f1cf-4855-8a3a-c5673fb20e05	34228761-bcf2-4ff3-bfd1-f65d3d050d2b	67b073d4-c07b-4f32-97c5-d64e4797044e	Handyman service needed in Pasig. Regular maintenance required.	2025-04-21 04:29:57.016918+00	\N	2025-09-23 11:33:05.484118+00	\N	completed	2025-01-11 20:55:09.564118+00
fc259a1e-327a-4414-914a-6736261c12ba	3505bad0-2d27-427b-ae95-3169a5838fbf	b0d0319f-3ccd-4386-978e-e8243923db36	19a03c30-e580-4bda-bec4-d59fb737e8e0	Carpenter service needed in Cebu City. Inspection and consultation.	2025-01-24 23:25:20.738518+00	\N	\N	\N	pending	2025-09-08 12:19:39.400918+00
b93f99b1-9600-47d1-8f7c-d5ab52896292	5be0cd9f-a466-4485-ac43-bdc4b104ecc0	b0d0319f-3ccd-4386-978e-e8243923db36	19a03c30-e580-4bda-bec4-d59fb737e8e0	Carpenter service needed in Cebu City. General service request.	2025-07-18 16:58:23.935318+00	\N	2025-11-15 23:15:31.836118+00	\N	completed	2025-08-12 21:24:25.384918+00
84d7be44-62ce-414a-964a-46f4a11b8007	ee82e0a0-0f37-4a6f-ae93-2113eddeb55c	b0d0319f-3ccd-4386-978e-e8243923db36	19a03c30-e580-4bda-bec4-d59fb737e8e0	Carpenter service needed in Cebu City. Urgent repair needed.	2025-08-22 01:39:13.000918+00	\N	2025-09-05 18:16:05.042518+00	\N	completed	2025-10-17 07:55:05.474518+00
fce37baf-8f1c-40a8-af23-2b2e1f60627b	40ec397a-f1cf-4855-8a3a-c5673fb20e05	b0d0319f-3ccd-4386-978e-e8243923db36	19a03c30-e580-4bda-bec4-d59fb737e8e0	Carpenter service needed in Cebu City. Regular maintenance required.	2025-10-31 08:46:00.232918+00	\N	2025-09-21 12:03:31.980118+00	\N	completed	2025-10-07 13:18:27.717718+00
92bbe846-841b-497f-8886-dca09509c371	0897825a-ab99-41e9-98ba-b4ed822155a5	b0d0319f-3ccd-4386-978e-e8243923db36	19a03c30-e580-4bda-bec4-d59fb737e8e0	Carpenter service needed in Cebu City. Installation and setup.	2025-11-26 23:06:51.189718+00	\N	2025-03-05 07:40:49.077718+00	\N	completed	2025-10-13 08:23:22.370518+00
09472c08-043b-4993-aa81-1f3a95b05f86	b19b93f9-ccf5-4b17-bdcf-a105d11018af	b0d0319f-3ccd-4386-978e-e8243923db36	19a03c30-e580-4bda-bec4-d59fb737e8e0	Carpenter service needed in Cebu City. Inspection and consultation.	2025-08-04 04:58:10.888918+00	\N	2025-03-10 03:29:55.605718+00	\N	completed	2025-03-12 23:59:10.101718+00
6413015d-0afb-4fa0-9515-2e04793cc65d	6fc15c3f-2c63-4a80-b499-3744ac6c5e0a	b0d0319f-3ccd-4386-978e-e8243923db36	19a03c30-e580-4bda-bec4-d59fb737e8e0	Carpenter service needed in Cebu City. General service request.	2025-08-17 23:55:34.706518+00	\N	2025-10-08 21:29:03.938518+00	\N	completed	2025-09-30 03:03:19.020118+00
a24dab41-2995-4754-a3f3-e289832b215f	97c5f2cc-ef11-452a-9aa3-b4705f3280f8	b0d0319f-3ccd-4386-978e-e8243923db36	19a03c30-e580-4bda-bec4-d59fb737e8e0	Carpenter service needed in Cebu City. Urgent repair needed.	2025-05-24 14:05:52.783318+00	\N	2025-05-22 05:37:41.618518+00	\N	completed	2025-09-10 12:33:48.712918+00
2d2da3b5-4f48-46df-b555-55b90d7a8b9d	97c5f2cc-ef11-452a-9aa3-b4705f3280f8	8730c98e-607b-491b-ba1a-ec47f577da1c	2fd74584-4526-428d-b506-d92de93f45b1	Electrician service needed in Mandaue City. Urgent repair needed.	2025-11-27 11:27:09.602518+00	\N	\N	\N	pending	2025-05-06 13:41:11.023318+00
35f94331-43bd-4b5d-9b85-9ee728706887	1be14a91-1b2c-48d6-8465-d1d4d12a785c	8730c98e-607b-491b-ba1a-ec47f577da1c	2fd74584-4526-428d-b506-d92de93f45b1	Electrician service needed in Mandaue City. Regular maintenance required.	2025-06-17 10:22:20.479318+00	\N	2025-12-03 04:59:28.389718+00	\N	completed	2025-10-27 22:28:28.543318+00
083bdbd3-fb6f-4ddb-9bd5-eab52b6df753	4cfa17c8-4d9f-4283-97f2-3a4976248b91	8730c98e-607b-491b-ba1a-ec47f577da1c	2fd74584-4526-428d-b506-d92de93f45b1	Electrician service needed in Mandaue City. Installation and setup.	2025-05-21 14:17:00.655318+00	\N	2025-12-02 13:21:38.143318+00	\N	completed	2025-09-04 02:24:04.188118+00
7bc4838b-7e08-4f36-af12-004caef0efee	57dfd528-5470-40a1-8fde-40eb61dd7ae1	8730c98e-607b-491b-ba1a-ec47f577da1c	2fd74584-4526-428d-b506-d92de93f45b1	Electrician service needed in Mandaue City. Inspection and consultation.	2025-11-18 14:51:26.738518+00	\N	2025-07-16 22:59:55.087318+00	\N	completed	2025-10-31 18:27:17.320918+00
6178c24c-dbe8-4b86-b43a-1e66f17e31d9	3cc9e6b9-d7d7-4d91-904b-65aeb230b14b	8730c98e-607b-491b-ba1a-ec47f577da1c	2fd74584-4526-428d-b506-d92de93f45b1	Electrician service needed in Mandaue City. General service request.	2025-02-11 09:52:22.581718+00	\N	2025-06-13 19:34:10.946518+00	\N	completed	2025-03-05 22:45:05.253718+00
6227f296-913c-4de9-a45b-aac08458d6a4	8d3c4c94-5ab8-4070-a7cc-a12e88219bf3	59676f81-363d-4b81-81a8-326f11304145	8a10c3b6-f3d9-4e9d-89c3-0e47b7c652d0	Roofer service needed in Lapu-Lapu. Installation and setup.	2025-06-02 19:22:39.832918+00	\N	\N	\N	pending	2025-10-04 08:01:38.680918+00
71a38c44-dc5a-4474-8faf-481f7510f3ff	158e9458-44c9-4638-83b9-bf0c99bdb64a	59676f81-363d-4b81-81a8-326f11304145	8a10c3b6-f3d9-4e9d-89c3-0e47b7c652d0	Roofer service needed in Lapu-Lapu. Inspection and consultation.	2025-09-08 07:40:46.572118+00	\N	\N	\N	canceled	2025-04-08 15:55:45.621718+00
4f304817-bdd3-4c66-919a-5fa3c4c6cb6a	503f2221-11c2-4415-9a5b-9b0e81e95b67	59676f81-363d-4b81-81a8-326f11304145	8a10c3b6-f3d9-4e9d-89c3-0e47b7c652d0	Roofer service needed in Lapu-Lapu. General service request.	2025-04-09 20:38:16.005718+00	\N	2025-07-02 04:32:56.383318+00	\N	completed	2025-12-07 05:30:38.172118+00
f484b1d5-34eb-49c9-a840-97b66be0498e	5eae5e90-1914-41e5-be8a-aef4314d4892	59676f81-363d-4b81-81a8-326f11304145	8a10c3b6-f3d9-4e9d-89c3-0e47b7c652d0	Roofer service needed in Lapu-Lapu. Urgent repair needed.	2025-01-13 04:37:38.824918+00	\N	2025-04-13 20:39:31.173718+00	\N	completed	2025-11-25 10:48:32.268118+00
6bf2205e-dd70-448e-88ac-8f9f025b2be1	4893cb6b-0ffd-422a-b940-7b9201daa34f	59676f81-363d-4b81-81a8-326f11304145	8a10c3b6-f3d9-4e9d-89c3-0e47b7c652d0	Roofer service needed in Lapu-Lapu. Regular maintenance required.	2025-06-20 22:06:27.055318+00	\N	2025-10-18 16:31:15.295318+00	\N	completed	2025-07-26 06:13:05.935318+00
7dd4e136-b06b-4459-b397-c3d8957c2a9d	218a9cdd-7d3a-44c9-bd7a-d885d38d6063	59676f81-363d-4b81-81a8-326f11304145	8a10c3b6-f3d9-4e9d-89c3-0e47b7c652d0	Roofer service needed in Lapu-Lapu. Installation and setup.	2025-08-06 22:58:58.408918+00	\N	2025-07-13 18:31:50.776918+00	\N	completed	2025-04-02 08:58:07.288918+00
16bc300b-c252-421c-85ae-ad2e6b7b18a9	4eea189c-607a-466d-8f92-1f53d790fb6f	59676f81-363d-4b81-81a8-326f11304145	8a10c3b6-f3d9-4e9d-89c3-0e47b7c652d0	Roofer service needed in Lapu-Lapu. Inspection and consultation.	2025-09-28 19:47:11.743318+00	\N	2025-11-11 20:53:16.552918+00	\N	completed	2025-03-02 19:34:44.383318+00
eb79a5c2-1395-4f4e-a2de-ef3578eaf5e1	5c74fdb2-b4d9-4f4b-9c6c-f6b72854db84	59676f81-363d-4b81-81a8-326f11304145	8a10c3b6-f3d9-4e9d-89c3-0e47b7c652d0	Roofer service needed in Lapu-Lapu. General service request.	2025-11-02 17:42:30.626518+00	\N	2025-04-30 14:35:53.359318+00	\N	completed	2025-07-14 10:55:18.088918+00
6eed417e-973e-4cb1-b5ed-4a0855923392	9e61d17b-97a4-45e7-a26c-4fdc3086cdb7	59676f81-363d-4b81-81a8-326f11304145	8a10c3b6-f3d9-4e9d-89c3-0e47b7c652d0	Roofer service needed in Lapu-Lapu. Urgent repair needed.	2025-02-18 05:14:01.980118+00	\N	2025-03-26 09:18:49.288918+00	\N	completed	2025-05-18 01:38:08.287318+00
a83434aa-e6ac-4e1a-a757-36cb3b13d463	6302ea1c-5af4-4302-918a-c87152175bae	59676f81-363d-4b81-81a8-326f11304145	8a10c3b6-f3d9-4e9d-89c3-0e47b7c652d0	Roofer service needed in Lapu-Lapu. Regular maintenance required.	2025-01-10 05:54:28.783318+00	\N	2025-05-31 10:07:12.069718+00	\N	completed	2025-12-11 13:30:02.546518+00
d6b03625-430d-44b9-b8ee-babc98678dd8	a3563a32-75c5-4d0b-b672-9f548fe69a06	59676f81-363d-4b81-81a8-326f11304145	8a10c3b6-f3d9-4e9d-89c3-0e47b7c652d0	Roofer service needed in Lapu-Lapu. Installation and setup.	2025-01-30 08:53:00.396118+00	\N	2025-04-18 10:00:01.711318+00	\N	completed	2025-12-06 11:06:55.336918+00
28b7f46b-64d3-41ae-ad56-3e38eb573c20	8568204d-bac8-4bd2-be49-666099493157	6a3724bd-1757-4b94-be45-5650c4cbc84a	ff8acab6-8c85-4fb8-af36-781b98920efb	Painter service needed in Manila. Installation and setup.	2025-04-11 12:22:56.220118+00	\N	\N	\N	pending	2025-04-16 16:13:33.612118+00
7c510418-c31f-4a3c-89d9-2ddd7401ac9b	5fcd65e1-d364-4762-a7e2-9939ef039247	59676f81-363d-4b81-81a8-326f11304145	8a10c3b6-f3d9-4e9d-89c3-0e47b7c652d0	Roofer service needed in Lapu-Lapu. Inspection and consultation.	2025-11-02 20:57:01.106518+00	\N	2025-09-04 09:13:10.600918+00	\N	completed	2025-10-03 04:15:39.410518+00
3b64540b-02fb-499a-a528-47c4ed8ce155	5c74fdb2-b4d9-4f4b-9c6c-f6b72854db84	d2e65c84-18ae-4b35-ae87-78a3ab244754	45138e1c-7f74-4a2e-b43c-86f41855fac4	HVAC Technician service needed in Davao City. General service request.	2025-04-24 23:29:15.055318+00	\N	\N	\N	pending	2025-05-14 11:57:07.932118+00
e5c142ed-a07d-4b3e-a737-5e949c6fbb03	9e61d17b-97a4-45e7-a26c-4fdc3086cdb7	d2e65c84-18ae-4b35-ae87-78a3ab244754	45138e1c-7f74-4a2e-b43c-86f41855fac4	HVAC Technician service needed in Davao City. Urgent repair needed.	2025-01-16 13:00:07.154518+00	\N	2025-07-18 17:21:28.927318+00	\N	completed	2025-09-01 16:47:25.308118+00
8aef08bb-d0a4-4d56-a145-95ab0d381448	6302ea1c-5af4-4302-918a-c87152175bae	d2e65c84-18ae-4b35-ae87-78a3ab244754	45138e1c-7f74-4a2e-b43c-86f41855fac4	HVAC Technician service needed in Davao City. Regular maintenance required.	2025-06-15 09:46:19.788118+00	\N	2025-08-18 15:25:54.290518+00	\N	completed	2025-01-02 03:56:21.391318+00
afa7917a-3b22-4db5-aec7-10bfa877db0b	a3563a32-75c5-4d0b-b672-9f548fe69a06	d2e65c84-18ae-4b35-ae87-78a3ab244754	45138e1c-7f74-4a2e-b43c-86f41855fac4	HVAC Technician service needed in Davao City. Installation and setup.	2025-01-19 15:56:24.069718+00	\N	2025-11-19 11:20:02.700118+00	\N	completed	2025-08-24 12:17:34.984918+00
12daed6f-fb03-4cb2-86fd-3a58608ae0cb	5fcd65e1-d364-4762-a7e2-9939ef039247	d2e65c84-18ae-4b35-ae87-78a3ab244754	45138e1c-7f74-4a2e-b43c-86f41855fac4	HVAC Technician service needed in Davao City. Inspection and consultation.	2025-07-23 20:32:39.045718+00	\N	2025-05-30 15:09:13.087318+00	\N	completed	2025-07-27 11:21:19.423318+00
73b9bcb5-7974-4f99-b6b6-5d925e8cc0e5	649a4947-627c-43f2-9c5e-b75f213a0d93	d2e65c84-18ae-4b35-ae87-78a3ab244754	45138e1c-7f74-4a2e-b43c-86f41855fac4	HVAC Technician service needed in Davao City. General service request.	2025-09-29 13:43:56.047318+00	\N	2025-12-15 16:47:38.872918+00	\N	completed	2025-05-30 21:31:38.853718+00
f6b95ec7-4858-43bd-a5a7-cace06dae3a0	3c6ff2a2-e59e-48af-8a8e-9238dc49ecc6	d2e65c84-18ae-4b35-ae87-78a3ab244754	45138e1c-7f74-4a2e-b43c-86f41855fac4	HVAC Technician service needed in Davao City. Urgent repair needed.	2025-02-13 22:19:44.268118+00	\N	2025-07-14 09:54:27.256918+00	\N	completed	2025-03-03 10:23:13.269718+00
3a561e03-0d16-459a-9119-1c32879de29a	496d267d-f0aa-4592-a87a-bd69e1196f23	d2e65c84-18ae-4b35-ae87-78a3ab244754	45138e1c-7f74-4a2e-b43c-86f41855fac4	HVAC Technician service needed in Davao City. Regular maintenance required.	2025-09-04 03:43:07.807318+00	\N	2025-08-05 01:23:31.672918+00	\N	completed	2025-05-24 04:37:08.930518+00
1ed8e7b1-aa78-409c-a475-ba9e02224ba3	5c328f75-464c-4053-a41e-00fbc6eba934	d2e65c84-18ae-4b35-ae87-78a3ab244754	45138e1c-7f74-4a2e-b43c-86f41855fac4	HVAC Technician service needed in Davao City. Installation and setup.	2024-12-21 00:11:24.328918+00	\N	2025-07-01 14:34:43.029718+00	\N	completed	2025-04-11 18:18:56.978518+00
3fcdb468-e137-4e09-91c6-a96c205cb812	496d267d-f0aa-4592-a87a-bd69e1196f23	cf981ea0-ea50-476e-aae6-96e103cfb358	8ec0536f-dc92-40ba-87d8-f60e42a55db6	Cleaner service needed in Cagayan de Oro. Regular maintenance required.	2025-07-14 09:22:41.704918+00	\N	\N	\N	pending	2025-03-27 14:57:36.184918+00
02308de5-1b88-4b5e-97f8-6ef618b2a447	5c328f75-464c-4053-a41e-00fbc6eba934	cf981ea0-ea50-476e-aae6-96e103cfb358	8ec0536f-dc92-40ba-87d8-f60e42a55db6	Cleaner service needed in Cagayan de Oro. Installation and setup.	2025-01-11 10:20:22.370518+00	\N	2025-12-02 10:52:41.877718+00	\N	completed	2025-02-04 01:58:09.679318+00
5cef81ea-dd43-443e-b7aa-d4a327ef33ca	bed6bf7a-bfbb-4eac-b6d7-35ca3e7d6660	cf981ea0-ea50-476e-aae6-96e103cfb358	8ec0536f-dc92-40ba-87d8-f60e42a55db6	Cleaner service needed in Cagayan de Oro. Inspection and consultation.	2025-12-05 06:32:04.428118+00	\N	2025-11-07 05:18:54.962518+00	\N	completed	2025-10-10 14:45:21.612118+00
ef9d96de-e76a-41fb-b9fe-48b98ae950e1	549f87d2-961e-48f8-bcff-7286d7db879e	cf981ea0-ea50-476e-aae6-96e103cfb358	8ec0536f-dc92-40ba-87d8-f60e42a55db6	Cleaner service needed in Cagayan de Oro. General service request.	2025-04-07 22:00:32.124118+00	\N	2025-12-06 14:43:05.704918+00	\N	completed	2025-07-31 02:19:59.935318+00
d4273b3a-ab28-4458-b4cd-2c778ddebfa5	a8957421-6c24-4110-ad8a-89513c6cfe93	cf981ea0-ea50-476e-aae6-96e103cfb358	8ec0536f-dc92-40ba-87d8-f60e42a55db6	Cleaner service needed in Cagayan de Oro. Urgent repair needed.	2025-10-10 09:53:06.559318+00	\N	2025-10-27 22:03:44.709718+00	\N	completed	2025-07-16 15:34:32.776918+00
7f44a390-a1d3-4767-8658-482982c4c488	ded07a3d-2dc7-40f1-a9df-81b72c989abf	cf981ea0-ea50-476e-aae6-96e103cfb358	8ec0536f-dc92-40ba-87d8-f60e42a55db6	Cleaner service needed in Cagayan de Oro. Regular maintenance required.	2025-11-29 10:24:14.527318+00	\N	2025-11-27 20:04:12.127318+00	\N	completed	2025-12-19 14:23:08.632918+00
53c19196-05c4-4b41-8c80-f39a69c5a6b1	2594b276-c01e-4543-b2b5-0cd20667b7a6	25ecace8-49ad-4af9-b1aa-97352291eb02	368f7187-4490-4015-84fa-20a4f46eea09	Locksmith service needed in Iloilo City. Inspection and consultation.	2025-09-21 05:40:14.892118+00	\N	\N	\N	pending	2025-07-19 22:40:36.463318+00
d2ca6601-0eba-4070-8e87-19081412ce5e	216ebdf7-cd45-4b40-86f2-268b4e33bb68	25ecace8-49ad-4af9-b1aa-97352291eb02	368f7187-4490-4015-84fa-20a4f46eea09	Locksmith service needed in Iloilo City. General service request.	2025-03-11 22:42:05.282518+00	\N	\N	\N	canceled	2025-05-23 21:05:41.320918+00
0acd668c-cd56-4586-ac0e-ec44251c98d7	f74860cc-f981-42b4-809d-11e92bedd14f	25ecace8-49ad-4af9-b1aa-97352291eb02	368f7187-4490-4015-84fa-20a4f46eea09	Locksmith service needed in Iloilo City. Urgent repair needed.	2025-05-07 15:40:52.677718+00	\N	2025-09-14 09:39:33.448918+00	\N	completed	2025-06-24 20:46:10.946518+00
2523a3dc-f24d-4226-9114-c619ff72dd3f	d951675f-497c-4ccb-b55d-6a72f9cfb8fc	25ecace8-49ad-4af9-b1aa-97352291eb02	368f7187-4490-4015-84fa-20a4f46eea09	Locksmith service needed in Iloilo City. Regular maintenance required.	2025-04-14 03:59:10.735318+00	\N	2025-12-04 13:20:01.634518+00	\N	completed	2025-07-28 22:39:53.608918+00
08a22194-2f07-49b5-a85e-755f0b5eb9a1	dd3b46e4-576f-488e-928f-a5a2688e0fd4	25ecace8-49ad-4af9-b1aa-97352291eb02	368f7187-4490-4015-84fa-20a4f46eea09	Locksmith service needed in Iloilo City. Installation and setup.	2025-07-26 17:47:51.948118+00	\N	2025-02-24 09:28:07.432918+00	\N	completed	2025-06-01 12:59:42.444118+00
30b6bf8c-7d28-4af6-b1ab-7d23e67df9f7	7d6e1a27-d7f8-445f-a544-81c817a39304	25ecace8-49ad-4af9-b1aa-97352291eb02	368f7187-4490-4015-84fa-20a4f46eea09	Locksmith service needed in Iloilo City. Inspection and consultation.	2025-08-14 13:41:08.085718+00	\N	2025-11-23 21:56:02.901718+00	\N	completed	2025-10-22 00:57:58.332118+00
dbc78f0c-b0c6-4fa9-9eb4-3ba00ccc4353	088c7759-5ee8-4fd2-99fa-6d6953d6e99c	25ecace8-49ad-4af9-b1aa-97352291eb02	368f7187-4490-4015-84fa-20a4f46eea09	Locksmith service needed in Iloilo City. General service request.	2025-04-12 09:26:11.397718+00	\N	2025-03-02 14:45:56.949718+00	\N	completed	2024-12-26 15:07:40.380118+00
69b37d05-b900-4e1f-94e1-a8f8646f591d	ce930397-85a0-4a2c-9d12-343341780701	25ecace8-49ad-4af9-b1aa-97352291eb02	368f7187-4490-4015-84fa-20a4f46eea09	Locksmith service needed in Iloilo City. Urgent repair needed.	2025-10-16 11:41:59.608918+00	\N	2025-10-03 20:18:09.948118+00	\N	completed	2025-04-19 11:58:31.912918+00
0cbb2ef5-3b25-43e3-bdce-4e7ddc82e571	2637c6dd-5fbe-487c-85c5-3ef87dc74cf5	25ecace8-49ad-4af9-b1aa-97352291eb02	368f7187-4490-4015-84fa-20a4f46eea09	Locksmith service needed in Iloilo City. Regular maintenance required.	2025-02-19 18:24:28.581718+00	\N	2025-04-26 13:36:45.948118+00	\N	completed	2025-07-17 11:48:48.108118+00
c1949b70-ac23-4d13-b284-097cd3575424	d4d09b07-6022-4d29-8d83-2905a67c2fb0	25ecace8-49ad-4af9-b1aa-97352291eb02	368f7187-4490-4015-84fa-20a4f46eea09	Locksmith service needed in Iloilo City. Installation and setup.	2025-06-07 00:41:35.359318+00	\N	2025-12-01 20:20:34.754518+00	\N	completed	2025-02-18 20:02:13.586518+00
f2066b9d-5aa1-4037-a306-613e04f328d8	9c0e3b56-4094-4a57-b207-abb436a8fe3d	25ecace8-49ad-4af9-b1aa-97352291eb02	368f7187-4490-4015-84fa-20a4f46eea09	Locksmith service needed in Iloilo City. Inspection and consultation.	2025-07-22 15:21:49.519318+00	\N	2025-07-03 13:10:54.549718+00	\N	completed	2025-03-29 11:07:11.148118+00
6926ac76-d577-4df6-b33b-35f7f953576c	6e0bbfe1-f2fd-4356-8684-bc8d8fb15a28	25ecace8-49ad-4af9-b1aa-97352291eb02	368f7187-4490-4015-84fa-20a4f46eea09	Locksmith service needed in Iloilo City. General service request.	2025-07-24 05:40:50.575318+00	\N	2025-06-08 08:27:20.834518+00	\N	completed	2025-08-29 20:46:10.428118+00
f5b6a0c6-1cf3-4839-84e8-bbf125e24f5c	2f6a0b4d-ff98-443f-a347-bc1c2e867bf5	25ecace8-49ad-4af9-b1aa-97352291eb02	368f7187-4490-4015-84fa-20a4f46eea09	Locksmith service needed in Iloilo City. Urgent repair needed.	2025-10-31 13:54:08.450518+00	\N	2025-09-18 21:09:03.410518+00	\N	completed	2025-08-07 05:56:34.322518+00
7bb7988d-e370-496c-9566-d430c922d598	ce930397-85a0-4a2c-9d12-343341780701	d1be4162-b83a-400e-9a30-07f3b2bf2f37	fa26da00-47e3-4456-8d91-ef631d37234a	Landscaper service needed in Baguio. Urgent repair needed.	2025-05-03 07:52:03.429718+00	\N	\N	\N	pending	2025-04-13 03:56:44.546518+00
3443ac99-5bef-4b02-94a7-5497341dc441	2637c6dd-5fbe-487c-85c5-3ef87dc74cf5	d1be4162-b83a-400e-9a30-07f3b2bf2f37	fa26da00-47e3-4456-8d91-ef631d37234a	Landscaper service needed in Baguio. Regular maintenance required.	2025-09-23 04:26:43.221718+00	\N	2025-09-05 04:45:43.269718+00	\N	completed	2025-11-21 12:25:13.596118+00
5366b130-7029-4bc2-af86-4affa6bf6ea4	d4d09b07-6022-4d29-8d83-2905a67c2fb0	d1be4162-b83a-400e-9a30-07f3b2bf2f37	fa26da00-47e3-4456-8d91-ef631d37234a	Landscaper service needed in Baguio. Installation and setup.	2025-04-07 19:56:41.205718+00	\N	2025-09-11 06:24:18.127318+00	\N	completed	2025-01-13 02:58:05.906518+00
9690d6d8-c230-42c2-bc84-ed3372ae521f	9c0e3b56-4094-4a57-b207-abb436a8fe3d	d1be4162-b83a-400e-9a30-07f3b2bf2f37	fa26da00-47e3-4456-8d91-ef631d37234a	Landscaper service needed in Baguio. Inspection and consultation.	2025-07-28 00:38:58.975318+00	\N	2025-09-10 07:35:13.932118+00	\N	completed	2025-02-09 04:12:47.388118+00
483ff1e0-5fa8-484d-bb1a-82af7406323c	6e0bbfe1-f2fd-4356-8684-bc8d8fb15a28	d1be4162-b83a-400e-9a30-07f3b2bf2f37	fa26da00-47e3-4456-8d91-ef631d37234a	Landscaper service needed in Baguio. General service request.	2025-05-18 03:32:38.988118+00	\N	2025-08-30 07:04:14.604118+00	\N	completed	2025-03-21 14:12:40.159318+00
09daa833-1841-420c-9dc2-cfa761bcf63c	2f6a0b4d-ff98-443f-a347-bc1c2e867bf5	d1be4162-b83a-400e-9a30-07f3b2bf2f37	fa26da00-47e3-4456-8d91-ef631d37234a	Landscaper service needed in Baguio. Urgent repair needed.	2025-06-12 02:58:43.836118+00	\N	2025-06-04 06:27:44.968918+00	\N	completed	2025-10-09 10:57:57.928918+00
1e28186a-8b59-4687-a864-0f82ba43fb08	c02b1823-7eec-4776-812e-b2a42402a542	d1be4162-b83a-400e-9a30-07f3b2bf2f37	fa26da00-47e3-4456-8d91-ef631d37234a	Landscaper service needed in Baguio. Regular maintenance required.	2025-09-08 07:57:35.551318+00	\N	2025-06-29 04:02:52.783318+00	\N	completed	2025-09-11 00:20:39.535318+00
4c617aed-738c-4f0f-bd8c-f70509bc476e	8568204d-bac8-4bd2-be49-666099493157	d1be4162-b83a-400e-9a30-07f3b2bf2f37	fa26da00-47e3-4456-8d91-ef631d37234a	Landscaper service needed in Baguio. Installation and setup.	2025-01-05 19:24:22.389718+00	\N	2025-04-23 10:03:47.820118+00	\N	completed	2025-01-02 06:22:17.685718+00
ac422590-0d00-4232-8739-f14bad1cb441	3505bad0-2d27-427b-ae95-3169a5838fbf	d1be4162-b83a-400e-9a30-07f3b2bf2f37	fa26da00-47e3-4456-8d91-ef631d37234a	Landscaper service needed in Baguio. Inspection and consultation.	2025-06-12 04:43:45.333718+00	\N	2025-02-21 05:44:35.474518+00	\N	completed	2025-12-13 16:28:10.226518+00
409c85cc-4d84-4beb-8f69-67c2353c5367	5be0cd9f-a466-4485-ac43-bdc4b104ecc0	d1be4162-b83a-400e-9a30-07f3b2bf2f37	fa26da00-47e3-4456-8d91-ef631d37234a	Landscaper service needed in Baguio. General service request.	2025-05-28 05:52:01.212118+00	\N	2025-10-06 02:11:37.519318+00	\N	completed	2025-08-03 10:43:43.605718+00
51ccefea-4bfb-4f4e-8c99-7d20599b0664	3505bad0-2d27-427b-ae95-3169a5838fbf	6a3724bd-1757-4b94-be45-5650c4cbc84a	ff8acab6-8c85-4fb8-af36-781b98920efb	Painter service needed in Manila. Inspection and consultation.	2025-12-12 20:09:14.008918+00	\N	2025-05-11 14:37:03.948118+00	\N	completed	2025-05-24 03:00:31.490518+00
d1d14c30-bac2-44ce-b22a-5ff09fbe8826	5be0cd9f-a466-4485-ac43-bdc4b104ecc0	6a3724bd-1757-4b94-be45-5650c4cbc84a	ff8acab6-8c85-4fb8-af36-781b98920efb	Painter service needed in Manila. General service request.	2025-01-12 21:07:48.674518+00	\N	2025-04-19 21:05:06.501718+00	\N	completed	2025-07-21 11:32:05.608918+00
312fa649-6ae4-4ca9-bfa3-cfe2a6db10b3	ee82e0a0-0f37-4a6f-ae93-2113eddeb55c	6a3724bd-1757-4b94-be45-5650c4cbc84a	ff8acab6-8c85-4fb8-af36-781b98920efb	Painter service needed in Manila. Urgent repair needed.	2025-04-09 23:28:47.752918+00	\N	2025-06-07 20:55:49.912918+00	\N	completed	2025-12-02 14:21:42.751318+00
65cacca0-1f9e-47f3-aec8-57dea31ebbe5	40ec397a-f1cf-4855-8a3a-c5673fb20e05	6a3724bd-1757-4b94-be45-5650c4cbc84a	ff8acab6-8c85-4fb8-af36-781b98920efb	Painter service needed in Manila. Regular maintenance required.	2025-04-09 18:19:30.242518+00	\N	2025-07-21 21:31:57.861718+00	\N	completed	2025-08-07 02:40:33.381718+00
f7527b48-ad64-49cb-83a5-2a2aca12a883	0897825a-ab99-41e9-98ba-b4ed822155a5	6a3724bd-1757-4b94-be45-5650c4cbc84a	ff8acab6-8c85-4fb8-af36-781b98920efb	Painter service needed in Manila. Installation and setup.	2025-02-28 03:17:24.184918+00	\N	2025-06-20 05:54:48.655318+00	\N	completed	2025-08-31 18:28:34.130518+00
067508aa-d2fe-4c88-8437-d4edff27b1c7	b19b93f9-ccf5-4b17-bdcf-a105d11018af	6a3724bd-1757-4b94-be45-5650c4cbc84a	ff8acab6-8c85-4fb8-af36-781b98920efb	Painter service needed in Manila. Inspection and consultation.	2025-08-03 08:21:49.317718+00	\N	2025-02-20 17:39:08.364118+00	\N	completed	2025-11-05 18:56:11.973718+00
2b6ab2d4-f0fe-4576-b3f2-91e2a112c255	6fc15c3f-2c63-4a80-b499-3744ac6c5e0a	2abd59e7-f229-4457-9b4f-05dd7ff9f950	c87b314f-ad10-4e91-b2e6-dbd8cdf13230	Plumber service needed in Quezon City. General service request.	2025-12-14 23:14:30.751318+00	\N	\N	\N	pending	2025-08-13 17:18:13.576918+00
353e9a03-fb66-41f9-b3a2-a1b7222d67a4	97c5f2cc-ef11-452a-9aa3-b4705f3280f8	2abd59e7-f229-4457-9b4f-05dd7ff9f950	c87b314f-ad10-4e91-b2e6-dbd8cdf13230	Plumber service needed in Quezon City. Urgent repair needed.	2025-10-09 09:53:41.810518+00	\N	2025-10-05 09:21:30.684118+00	\N	completed	2025-11-30 07:45:38.431318+00
12c67012-a8bc-4d24-b552-ab7f355d78d0	1be14a91-1b2c-48d6-8465-d1d4d12a785c	2abd59e7-f229-4457-9b4f-05dd7ff9f950	c87b314f-ad10-4e91-b2e6-dbd8cdf13230	Plumber service needed in Quezon City. Regular maintenance required.	2025-06-21 23:26:47.224918+00	\N	2025-04-15 05:28:53.368918+00	\N	completed	2025-07-22 09:07:41.589718+00
5e469bb3-0208-4aa2-850a-f0127a369bb0	4cfa17c8-4d9f-4283-97f2-3a4976248b91	2abd59e7-f229-4457-9b4f-05dd7ff9f950	c87b314f-ad10-4e91-b2e6-dbd8cdf13230	Plumber service needed in Quezon City. Installation and setup.	2025-12-02 05:12:25.212118+00	\N	2025-06-27 07:31:13.826518+00	\N	completed	2025-01-02 00:59:16.610518+00
6b73bf11-d443-40f9-86a6-429386767ea0	57dfd528-5470-40a1-8fde-40eb61dd7ae1	2abd59e7-f229-4457-9b4f-05dd7ff9f950	c87b314f-ad10-4e91-b2e6-dbd8cdf13230	Plumber service needed in Quezon City. Inspection and consultation.	2025-10-25 11:53:30.895318+00	\N	2025-03-23 01:34:43.951318+00	\N	completed	2025-11-02 17:03:54.501718+00
0427744a-c9d8-4bea-b090-a851213a85ad	3cc9e6b9-d7d7-4d91-904b-65aeb230b14b	2abd59e7-f229-4457-9b4f-05dd7ff9f950	c87b314f-ad10-4e91-b2e6-dbd8cdf13230	Plumber service needed in Quezon City. General service request.	2025-11-13 03:00:27.170518+00	\N	2025-10-05 18:08:45.871318+00	\N	completed	2025-05-07 11:40:09.362518+00
343a9b76-bd1b-47d7-a546-6bf1c3347620	ff8bb61b-1117-4f5c-880b-ac4ebd7ea6c2	2abd59e7-f229-4457-9b4f-05dd7ff9f950	c87b314f-ad10-4e91-b2e6-dbd8cdf13230	Plumber service needed in Quezon City. Urgent repair needed.	2024-12-24 21:28:37.500118+00	\N	2025-09-18 00:26:39.218518+00	\N	completed	2025-10-09 13:26:58.600918+00
f36a89a6-e06b-445b-ad59-550cc22e8e87	feaac7e1-3bc3-4462-b2f8-b4a19f990531	2abd59e7-f229-4457-9b4f-05dd7ff9f950	c87b314f-ad10-4e91-b2e6-dbd8cdf13230	Plumber service needed in Quezon City. Regular maintenance required.	2025-07-22 14:42:34.600918+00	\N	2025-11-09 00:09:53.176918+00	\N	completed	2025-05-01 00:46:21.516118+00
0b6cbc6f-6d6d-4504-ad99-93e5149d56c2	8d3c4c94-5ab8-4070-a7cc-a12e88219bf3	2abd59e7-f229-4457-9b4f-05dd7ff9f950	c87b314f-ad10-4e91-b2e6-dbd8cdf13230	Plumber service needed in Quezon City. Installation and setup.	2025-03-08 14:36:54.962518+00	\N	2025-10-17 16:59:15.602518+00	\N	completed	2025-02-03 15:00:00.818518+00
47f1f77a-6726-4629-bbd4-2b4988eec656	158e9458-44c9-4638-83b9-bf0c99bdb64a	2abd59e7-f229-4457-9b4f-05dd7ff9f950	c87b314f-ad10-4e91-b2e6-dbd8cdf13230	Plumber service needed in Quezon City. Inspection and consultation.	2025-07-11 11:56:07.020118+00	\N	2025-05-04 21:51:30.828118+00	\N	completed	2025-09-09 07:57:02.719318+00
4024c972-a3fb-4a6f-aa8a-9259285ef27a	503f2221-11c2-4415-9a5b-9b0e81e95b67	2abd59e7-f229-4457-9b4f-05dd7ff9f950	c87b314f-ad10-4e91-b2e6-dbd8cdf13230	Plumber service needed in Quezon City. General service request.	2025-01-15 23:26:29.426518+00	\N	2025-12-17 13:11:37.922518+00	\N	completed	2025-03-03 06:53:57.708118+00
081f0277-c893-43c0-9cce-ac80ee10cca1	5eae5e90-1914-41e5-be8a-aef4314d4892	2abd59e7-f229-4457-9b4f-05dd7ff9f950	c87b314f-ad10-4e91-b2e6-dbd8cdf13230	Plumber service needed in Quezon City. Urgent repair needed.	2025-09-22 21:09:52.053718+00	\N	2025-07-24 22:59:28.735318+00	\N	completed	2025-04-03 07:44:33.285718+00
16fac697-ad98-4cf1-947a-4114646316c9	4893cb6b-0ffd-422a-b940-7b9201daa34f	2abd59e7-f229-4457-9b4f-05dd7ff9f950	c87b314f-ad10-4e91-b2e6-dbd8cdf13230	Plumber service needed in Quezon City. Regular maintenance required.	2025-03-31 09:12:31.116118+00	\N	2025-11-03 23:13:16.706518+00	\N	completed	2025-10-19 13:22:38.536918+00
c486e016-df0b-4a0c-b401-c3b8bbf44152	218a9cdd-7d3a-44c9-bd7a-d885d38d6063	2abd59e7-f229-4457-9b4f-05dd7ff9f950	c87b314f-ad10-4e91-b2e6-dbd8cdf13230	Plumber service needed in Quezon City. Installation and setup.	2025-01-09 10:40:36.290518+00	\N	2025-12-12 20:09:57.986518+00	\N	completed	2025-02-17 16:07:23.301718+00
79402067-1073-4250-9e3d-24a8ca4b5bfb	feaac7e1-3bc3-4462-b2f8-b4a19f990531	f2252c07-5c2c-4dee-8cb4-9475115c59ca	67b073d4-c07b-4f32-97c5-d64e4797044e	Handyman service needed in Makati. Regular maintenance required.	2025-06-18 09:34:59.647318+00	\N	\N	\N	pending	2025-08-19 22:55:21.890518+00
2d7ac1e4-e7e3-4fc6-a7ff-903926fffd0b	8d3c4c94-5ab8-4070-a7cc-a12e88219bf3	f2252c07-5c2c-4dee-8cb4-9475115c59ca	67b073d4-c07b-4f32-97c5-d64e4797044e	Handyman service needed in Makati. Installation and setup.	2025-04-20 09:21:31.807318+00	\N	2025-08-31 13:20:00.684118+00	\N	completed	2025-07-13 11:44:26.229718+00
78038dcd-b529-48f1-b027-117fc312adc4	158e9458-44c9-4638-83b9-bf0c99bdb64a	f2252c07-5c2c-4dee-8cb4-9475115c59ca	67b073d4-c07b-4f32-97c5-d64e4797044e	Handyman service needed in Makati. Inspection and consultation.	2025-12-01 03:54:56.632918+00	\N	2025-11-26 10:38:12.088918+00	\N	completed	2025-03-24 07:35:12.722518+00
c6118eb4-bb64-4833-b143-7bae11e50982	503f2221-11c2-4415-9a5b-9b0e81e95b67	f2252c07-5c2c-4dee-8cb4-9475115c59ca	67b073d4-c07b-4f32-97c5-d64e4797044e	Handyman service needed in Makati. General service request.	2025-12-06 17:08:53.791318+00	\N	2025-09-13 14:17:33.573718+00	\N	completed	2025-04-11 02:23:09.928918+00
9794ac10-7a4e-4feb-87f9-4e11a444161c	5eae5e90-1914-41e5-be8a-aef4314d4892	f2252c07-5c2c-4dee-8cb4-9475115c59ca	67b073d4-c07b-4f32-97c5-d64e4797044e	Handyman service needed in Makati. Urgent repair needed.	2025-04-04 19:58:20.652118+00	\N	2025-08-16 11:42:17.580118+00	\N	completed	2025-12-17 00:17:06.645718+00
20084069-fcc5-453c-a135-0212db97fa75	4893cb6b-0ffd-422a-b940-7b9201daa34f	f2252c07-5c2c-4dee-8cb4-9475115c59ca	67b073d4-c07b-4f32-97c5-d64e4797044e	Handyman service needed in Makati. Regular maintenance required.	2025-02-12 02:12:35.925718+00	\N	2025-10-15 08:45:27.228118+00	\N	completed	2025-05-25 05:21:46.293718+00
5fd70e17-4adb-4259-9676-fc3856199417	218a9cdd-7d3a-44c9-bd7a-d885d38d6063	f2252c07-5c2c-4dee-8cb4-9475115c59ca	67b073d4-c07b-4f32-97c5-d64e4797044e	Handyman service needed in Makati. Installation and setup.	2025-06-21 16:19:31.135318+00	\N	2025-03-04 21:56:45.669718+00	\N	completed	2025-05-27 03:58:27.016918+00
93120b33-39e8-4ea2-b38b-435f5000ab5b	4eea189c-607a-466d-8f92-1f53d790fb6f	f2252c07-5c2c-4dee-8cb4-9475115c59ca	67b073d4-c07b-4f32-97c5-d64e4797044e	Handyman service needed in Makati. Inspection and consultation.	2025-07-26 07:00:20.892118+00	\N	2025-05-09 22:37:09.276118+00	\N	completed	2025-12-13 16:42:33.189718+00
efd0a0fe-2731-4f1c-832a-bb2032cdc489	5c74fdb2-b4d9-4f4b-9c6c-f6b72854db84	f2252c07-5c2c-4dee-8cb4-9475115c59ca	67b073d4-c07b-4f32-97c5-d64e4797044e	Handyman service needed in Makati. General service request.	2025-06-02 15:00:01.164118+00	\N	2025-08-01 04:42:47.186518+00	\N	completed	2025-03-08 10:42:07.269718+00
6912c32b-a564-4270-b981-78b4f68726b7	9e61d17b-97a4-45e7-a26c-4fdc3086cdb7	f2252c07-5c2c-4dee-8cb4-9475115c59ca	67b073d4-c07b-4f32-97c5-d64e4797044e	Handyman service needed in Makati. Urgent repair needed.	2025-12-16 11:30:28.927318+00	\N	2025-06-25 14:24:56.892118+00	\N	completed	2025-04-30 22:45:44.392918+00
3fa29dc5-69bd-49c2-896e-e0104f42d157	6302ea1c-5af4-4302-918a-c87152175bae	f2252c07-5c2c-4dee-8cb4-9475115c59ca	67b073d4-c07b-4f32-97c5-d64e4797044e	Handyman service needed in Makati. Regular maintenance required.	2025-07-17 10:06:44.853718+00	\N	2025-07-17 19:52:35.829718+00	\N	completed	2025-10-18 04:30:55.250518+00
f15effa8-0f18-472a-bba5-bc1dd00e23c0	4eea189c-607a-466d-8f92-1f53d790fb6f	86ad7fd4-80f1-4376-af0b-29926fdf3944	19a03c30-e580-4bda-bec4-d59fb737e8e0	Carpenter service needed in Taguig. Inspection and consultation.	2025-04-08 02:58:45.564118+00	\N	\N	\N	pending	2025-08-16 00:41:00.799318+00
d62fa0fe-e9bd-45e6-bf6c-e29d9c5a3065	5c74fdb2-b4d9-4f4b-9c6c-f6b72854db84	86ad7fd4-80f1-4376-af0b-29926fdf3944	19a03c30-e580-4bda-bec4-d59fb737e8e0	Carpenter service needed in Taguig. General service request.	2025-08-06 09:28:08.642518+00	\N	2025-03-05 02:27:25.413718+00	\N	completed	2025-07-04 10:02:02.757718+00
1582dcc3-4b22-42f7-8e2d-56ea32413c53	9e61d17b-97a4-45e7-a26c-4fdc3086cdb7	86ad7fd4-80f1-4376-af0b-29926fdf3944	19a03c30-e580-4bda-bec4-d59fb737e8e0	Carpenter service needed in Taguig. Urgent repair needed.	2025-03-03 23:57:37.653718+00	\N	2025-06-25 09:06:02.834518+00	\N	completed	2025-11-25 17:57:27.717718+00
763f1149-eb32-45ca-9a7f-313b254b394b	6302ea1c-5af4-4302-918a-c87152175bae	86ad7fd4-80f1-4376-af0b-29926fdf3944	19a03c30-e580-4bda-bec4-d59fb737e8e0	Carpenter service needed in Taguig. Regular maintenance required.	2025-01-10 18:33:55.192918+00	\N	2025-09-22 02:56:01.836118+00	\N	completed	2025-09-12 14:36:18.069718+00
6727fde8-2275-4aa2-806c-6c817c106dc7	a3563a32-75c5-4d0b-b672-9f548fe69a06	86ad7fd4-80f1-4376-af0b-29926fdf3944	19a03c30-e580-4bda-bec4-d59fb737e8e0	Carpenter service needed in Taguig. Installation and setup.	2025-10-17 06:53:55.116118+00	\N	2025-10-17 20:00:17.983318+00	\N	completed	2025-04-06 02:34:36.204118+00
acdcfa61-9cb8-4a39-8f3f-a1f52aade66d	5fcd65e1-d364-4762-a7e2-9939ef039247	86ad7fd4-80f1-4376-af0b-29926fdf3944	19a03c30-e580-4bda-bec4-d59fb737e8e0	Carpenter service needed in Taguig. Inspection and consultation.	2025-01-10 12:53:03.276118+00	\N	2025-09-11 10:50:57.333718+00	\N	completed	2025-10-06 19:04:31.452118+00
a9fcb2f9-46ec-4bea-aba2-46362216dc17	649a4947-627c-43f2-9c5e-b75f213a0d93	86ad7fd4-80f1-4376-af0b-29926fdf3944	19a03c30-e580-4bda-bec4-d59fb737e8e0	Carpenter service needed in Taguig. General service request.	2025-12-08 22:33:50.988118+00	\N	2025-10-30 07:38:53.128918+00	\N	completed	2025-12-08 11:35:22.860118+00
5ea747d0-bd7c-4ea9-9c3a-bd03baeb0ad3	3c6ff2a2-e59e-48af-8a8e-9238dc49ecc6	86ad7fd4-80f1-4376-af0b-29926fdf3944	19a03c30-e580-4bda-bec4-d59fb737e8e0	Carpenter service needed in Taguig. Urgent repair needed.	2025-05-22 03:42:21.756118+00	\N	2025-11-11 20:37:36.607318+00	\N	completed	2025-04-14 13:20:04.744918+00
5caefd42-2f65-4966-bd94-181c9aa053d9	3c6ff2a2-e59e-48af-8a8e-9238dc49ecc6	aeef5a83-d194-4ab2-bc0e-0b8d59c3f9d6	2fd74584-4526-428d-b506-d92de93f45b1	Electrician service needed in Pasig. Urgent repair needed.	2025-11-21 09:28:21.602518+00	\N	\N	\N	pending	2025-01-23 08:07:04.236118+00
40df5060-9d6a-4f24-b50a-3194c07a06f6	496d267d-f0aa-4592-a87a-bd69e1196f23	aeef5a83-d194-4ab2-bc0e-0b8d59c3f9d6	2fd74584-4526-428d-b506-d92de93f45b1	Electrician service needed in Pasig. Regular maintenance required.	2025-08-21 17:20:04.860118+00	\N	2025-03-12 18:03:13.576918+00	\N	completed	2025-05-10 12:44:44.920918+00
3e999446-de4e-4a6a-baa7-2b785203957f	5c328f75-464c-4053-a41e-00fbc6eba934	aeef5a83-d194-4ab2-bc0e-0b8d59c3f9d6	2fd74584-4526-428d-b506-d92de93f45b1	Electrician service needed in Pasig. Installation and setup.	2025-02-25 06:13:05.416918+00	\N	2025-07-27 14:56:21.967318+00	\N	completed	2025-06-04 00:20:54.914518+00
73ccf1b7-0086-4a7a-9d1c-26b8d2b80ab5	bed6bf7a-bfbb-4eac-b6d7-35ca3e7d6660	aeef5a83-d194-4ab2-bc0e-0b8d59c3f9d6	2fd74584-4526-428d-b506-d92de93f45b1	Electrician service needed in Pasig. Inspection and consultation.	2025-03-12 18:47:27.352918+00	\N	2025-09-16 02:59:18.741718+00	\N	completed	2025-02-14 23:49:14.028118+00
d7a3ded2-012a-4b14-81aa-e96b5529e6fe	549f87d2-961e-48f8-bcff-7286d7db879e	aeef5a83-d194-4ab2-bc0e-0b8d59c3f9d6	2fd74584-4526-428d-b506-d92de93f45b1	Electrician service needed in Pasig. General service request.	2025-05-12 19:56:18.655318+00	\N	2025-12-19 15:05:49.874518+00	\N	completed	2025-01-13 05:33:52.140118+00
cb8d6bcc-3d09-43a9-a78b-32e9088d9b3b	f97cfaac-5a4e-420a-a445-9776c13600b8	5eaabc8f-02e6-43e3-a7e1-7c223c8fee9d	8a10c3b6-f3d9-4e9d-89c3-0e47b7c652d0	Roofer service needed in Cebu City. Installation and setup.	2025-04-07 10:42:58.418518+00	\N	\N	\N	pending	2025-01-25 20:02:13.413718+00
950283e5-82f3-414b-ad55-6b59f4d19905	2594b276-c01e-4543-b2b5-0cd20667b7a6	5eaabc8f-02e6-43e3-a7e1-7c223c8fee9d	8a10c3b6-f3d9-4e9d-89c3-0e47b7c652d0	Roofer service needed in Cebu City. Inspection and consultation.	2025-02-19 20:02:16.437718+00	\N	\N	\N	canceled	2025-07-22 06:42:48.021718+00
4c6aa853-3056-436c-960b-e0114f53c37b	216ebdf7-cd45-4b40-86f2-268b4e33bb68	5eaabc8f-02e6-43e3-a7e1-7c223c8fee9d	8a10c3b6-f3d9-4e9d-89c3-0e47b7c652d0	Roofer service needed in Cebu City. General service request.	2025-07-17 00:29:16.466518+00	\N	2025-05-02 02:15:46.610518+00	\N	completed	2025-07-21 14:11:33.631318+00
75f4d0bc-189e-4cc8-8808-8d574b923be3	f74860cc-f981-42b4-809d-11e92bedd14f	5eaabc8f-02e6-43e3-a7e1-7c223c8fee9d	8a10c3b6-f3d9-4e9d-89c3-0e47b7c652d0	Roofer service needed in Cebu City. Urgent repair needed.	2025-08-19 02:47:47.800918+00	\N	2025-11-30 01:39:42.463318+00	\N	completed	2025-04-06 05:57:29.618518+00
88e42201-cbb2-4d0a-ad1b-3970f60f0a1c	d951675f-497c-4ccb-b55d-6a72f9cfb8fc	5eaabc8f-02e6-43e3-a7e1-7c223c8fee9d	8a10c3b6-f3d9-4e9d-89c3-0e47b7c652d0	Roofer service needed in Cebu City. Regular maintenance required.	2025-04-26 09:20:48.348118+00	\N	2025-05-03 05:33:19.999318+00	\N	completed	2025-12-04 14:08:52.063318+00
86c0d424-8966-4303-bb09-63cb183c2083	dd3b46e4-576f-488e-928f-a5a2688e0fd4	5eaabc8f-02e6-43e3-a7e1-7c223c8fee9d	8a10c3b6-f3d9-4e9d-89c3-0e47b7c652d0	Roofer service needed in Cebu City. Installation and setup.	2025-01-27 17:20:10.821718+00	\N	2025-11-18 21:20:10.936918+00	\N	completed	2025-01-13 15:42:01.279318+00
9d267bef-a30c-401e-b9d5-aed52b2016ca	7d6e1a27-d7f8-445f-a544-81c817a39304	5eaabc8f-02e6-43e3-a7e1-7c223c8fee9d	8a10c3b6-f3d9-4e9d-89c3-0e47b7c652d0	Roofer service needed in Cebu City. Inspection and consultation.	2025-01-09 13:05:26.748118+00	\N	2025-11-23 07:25:52.159318+00	\N	completed	2025-03-28 02:54:09.602518+00
ee835322-6c8a-4820-b1a5-54e49445c38c	088c7759-5ee8-4fd2-99fa-6d6953d6e99c	5eaabc8f-02e6-43e3-a7e1-7c223c8fee9d	8a10c3b6-f3d9-4e9d-89c3-0e47b7c652d0	Roofer service needed in Cebu City. General service request.	2025-03-30 08:57:55.365718+00	\N	2025-08-05 18:05:34.149718+00	\N	completed	2025-02-09 12:50:58.341718+00
39fbbcd9-3429-429f-9f11-e7bc3a5478bb	ce930397-85a0-4a2c-9d12-343341780701	5eaabc8f-02e6-43e3-a7e1-7c223c8fee9d	8a10c3b6-f3d9-4e9d-89c3-0e47b7c652d0	Roofer service needed in Cebu City. Urgent repair needed.	2025-08-25 13:10:04.610518+00	\N	2025-07-17 00:53:11.052118+00	\N	completed	2025-06-19 20:20:12.376918+00
4bb549b7-5a6b-4215-b7ff-1221b6e25e28	2637c6dd-5fbe-487c-85c5-3ef87dc74cf5	5eaabc8f-02e6-43e3-a7e1-7c223c8fee9d	8a10c3b6-f3d9-4e9d-89c3-0e47b7c652d0	Roofer service needed in Cebu City. Regular maintenance required.	2025-04-25 10:51:03.727318+00	\N	2025-06-22 02:15:44.709718+00	\N	completed	2025-09-05 13:59:03.074518+00
df548333-a98a-48dd-b814-a5323a1438ad	d4d09b07-6022-4d29-8d83-2905a67c2fb0	5eaabc8f-02e6-43e3-a7e1-7c223c8fee9d	8a10c3b6-f3d9-4e9d-89c3-0e47b7c652d0	Roofer service needed in Cebu City. Installation and setup.	2025-01-06 16:15:24.895318+00	\N	2025-11-22 08:43:19.701718+00	\N	completed	2025-05-23 21:04:07.922518+00
f8e8a818-ab0b-4c13-ada9-20304f02cc54	9c0e3b56-4094-4a57-b207-abb436a8fe3d	5eaabc8f-02e6-43e3-a7e1-7c223c8fee9d	8a10c3b6-f3d9-4e9d-89c3-0e47b7c652d0	Roofer service needed in Cebu City. Inspection and consultation.	2025-07-18 09:22:02.911318+00	\N	2025-06-18 11:04:00.895318+00	\N	completed	2025-08-25 08:50:42.847318+00
22ad5a06-4130-4e43-800f-e0a8ad719258	088c7759-5ee8-4fd2-99fa-6d6953d6e99c	f237dee0-b324-4b4f-8a56-e51c8dfe7941	45138e1c-7f74-4a2e-b43c-86f41855fac4	HVAC Technician service needed in Mandaue City. General service request.	2025-06-13 05:57:47.071318+00	\N	\N	\N	pending	2025-07-16 17:12:56.402518+00
452940ae-b00f-4441-8e05-62a292cae774	ce930397-85a0-4a2c-9d12-343341780701	f237dee0-b324-4b4f-8a56-e51c8dfe7941	45138e1c-7f74-4a2e-b43c-86f41855fac4	HVAC Technician service needed in Mandaue City. Urgent repair needed.	2025-04-20 01:34:16.735318+00	\N	2025-05-27 21:13:45.074518+00	\N	completed	2025-09-27 00:19:05.791318+00
5a9cdda7-820a-4710-90e7-1ae3b68b6664	2637c6dd-5fbe-487c-85c5-3ef87dc74cf5	f237dee0-b324-4b4f-8a56-e51c8dfe7941	45138e1c-7f74-4a2e-b43c-86f41855fac4	HVAC Technician service needed in Mandaue City. Regular maintenance required.	2025-10-15 00:08:18.309718+00	\N	2025-05-23 06:30:40.188118+00	\N	completed	2025-02-19 06:05:41.666518+00
2df03dd4-09df-412d-a8f4-f1d20c82fa28	d4d09b07-6022-4d29-8d83-2905a67c2fb0	f237dee0-b324-4b4f-8a56-e51c8dfe7941	45138e1c-7f74-4a2e-b43c-86f41855fac4	HVAC Technician service needed in Mandaue City. Installation and setup.	2025-12-15 12:08:48.636118+00	\N	2025-04-10 17:51:25.960918+00	\N	completed	2025-07-31 17:11:08.316118+00
b440406f-6e0e-46bc-aae3-22208e917686	9c0e3b56-4094-4a57-b207-abb436a8fe3d	f237dee0-b324-4b4f-8a56-e51c8dfe7941	45138e1c-7f74-4a2e-b43c-86f41855fac4	HVAC Technician service needed in Mandaue City. Inspection and consultation.	2025-02-06 17:08:14.997718+00	\N	2025-05-12 02:17:15.516118+00	\N	completed	2025-05-26 18:00:59.484118+00
4d5d9511-9069-4fd3-8fe8-d078bfe7e13d	6e0bbfe1-f2fd-4356-8684-bc8d8fb15a28	f237dee0-b324-4b4f-8a56-e51c8dfe7941	45138e1c-7f74-4a2e-b43c-86f41855fac4	HVAC Technician service needed in Mandaue City. General service request.	2025-08-07 01:17:04.773718+00	\N	2025-07-28 14:39:29.272918+00	\N	completed	2025-04-12 05:06:56.028118+00
0b716487-565f-484c-8e2b-9a3af9d2abaf	2f6a0b4d-ff98-443f-a347-bc1c2e867bf5	f237dee0-b324-4b4f-8a56-e51c8dfe7941	45138e1c-7f74-4a2e-b43c-86f41855fac4	HVAC Technician service needed in Mandaue City. Urgent repair needed.	2025-03-31 11:00:47.100118+00	\N	2025-12-13 05:01:58.812118+00	\N	completed	2025-05-17 04:30:10.063318+00
8ba3a312-1f89-4e43-a9d5-464784b01e5b	c02b1823-7eec-4776-812e-b2a42402a542	f237dee0-b324-4b4f-8a56-e51c8dfe7941	45138e1c-7f74-4a2e-b43c-86f41855fac4	HVAC Technician service needed in Mandaue City. Regular maintenance required.	2025-02-22 01:34:47.752918+00	\N	2025-08-13 02:17:05.061718+00	\N	completed	2025-08-15 21:29:16.034518+00
0382d1c0-5656-4041-aa10-61ec34ea9917	8568204d-bac8-4bd2-be49-666099493157	f237dee0-b324-4b4f-8a56-e51c8dfe7941	45138e1c-7f74-4a2e-b43c-86f41855fac4	HVAC Technician service needed in Mandaue City. Installation and setup.	2025-01-16 17:20:55.231318+00	\N	2025-06-04 00:20:25.970518+00	\N	completed	2025-07-18 08:10:55.960918+00
d85090e7-0705-4c23-bf10-4599f864d3aa	c02b1823-7eec-4776-812e-b2a42402a542	6905635d-7e04-460d-8734-d8cfede31a47	8ec0536f-dc92-40ba-87d8-f60e42a55db6	Cleaner service needed in Lapu-Lapu. Regular maintenance required.	2025-02-20 07:43:38.335318+00	\N	\N	\N	pending	2025-07-26 12:51:32.988118+00
636874f9-6cfd-428d-9768-8b56298a66c1	8568204d-bac8-4bd2-be49-666099493157	6905635d-7e04-460d-8734-d8cfede31a47	8ec0536f-dc92-40ba-87d8-f60e42a55db6	Cleaner service needed in Lapu-Lapu. Installation and setup.	2025-05-09 10:44:37.432918+00	\N	2025-05-14 23:15:07.471318+00	\N	completed	2025-07-21 12:04:28.917718+00
4812adad-210f-4d22-a1fe-9d1b16c2d4d5	3505bad0-2d27-427b-ae95-3169a5838fbf	6905635d-7e04-460d-8734-d8cfede31a47	8ec0536f-dc92-40ba-87d8-f60e42a55db6	Cleaner service needed in Lapu-Lapu. Inspection and consultation.	2025-05-16 16:57:30.108118+00	\N	2025-08-28 23:50:00.597718+00	\N	completed	2025-09-25 09:40:59.848918+00
7c0ed1e3-34ee-4c15-acd7-38b3cb15e49d	5be0cd9f-a466-4485-ac43-bdc4b104ecc0	6905635d-7e04-460d-8734-d8cfede31a47	8ec0536f-dc92-40ba-87d8-f60e42a55db6	Cleaner service needed in Lapu-Lapu. General service request.	2025-01-14 14:22:45.477718+00	\N	2025-10-22 04:05:11.714518+00	\N	completed	2025-11-13 22:58:23.071318+00
05964ba6-36b0-45f7-9497-5014091e44a7	ee82e0a0-0f37-4a6f-ae93-2113eddeb55c	6905635d-7e04-460d-8734-d8cfede31a47	8ec0536f-dc92-40ba-87d8-f60e42a55db6	Cleaner service needed in Lapu-Lapu. Urgent repair needed.	2025-04-04 21:00:40.303318+00	\N	2025-05-12 08:04:13.768918+00	\N	completed	2025-03-10 14:06:51.621718+00
da1d1789-e28d-4b17-a36b-4cfe51466087	40ec397a-f1cf-4855-8a3a-c5673fb20e05	6905635d-7e04-460d-8734-d8cfede31a47	8ec0536f-dc92-40ba-87d8-f60e42a55db6	Cleaner service needed in Lapu-Lapu. Regular maintenance required.	2025-03-06 15:50:19.807318+00	\N	2025-03-02 19:58:58.840918+00	\N	completed	2025-07-18 12:54:53.608918+00
8408a5e9-f4ea-4086-be73-18380085bfb8	b19b93f9-ccf5-4b17-bdcf-a105d11018af	ce45455d-4356-4250-b920-27e2a9a6acd3	368f7187-4490-4015-84fa-20a4f46eea09	Locksmith service needed in Davao City. Inspection and consultation.	2025-07-01 05:41:41.378518+00	\N	\N	\N	pending	2025-06-21 23:47:39.506518+00
4d833c6e-8cb9-4626-ad8f-30b48cd5d842	6fc15c3f-2c63-4a80-b499-3744ac6c5e0a	ce45455d-4356-4250-b920-27e2a9a6acd3	368f7187-4490-4015-84fa-20a4f46eea09	Locksmith service needed in Davao City. General service request.	2025-05-16 03:33:01.797718+00	\N	\N	\N	canceled	2025-09-24 01:23:47.570518+00
2499a393-7407-44f0-afaa-664f486afa10	97c5f2cc-ef11-452a-9aa3-b4705f3280f8	ce45455d-4356-4250-b920-27e2a9a6acd3	368f7187-4490-4015-84fa-20a4f46eea09	Locksmith service needed in Davao City. Urgent repair needed.	2025-03-11 14:30:01.192918+00	\N	2025-05-14 09:33:38.085718+00	\N	completed	2025-05-30 15:42:01.538518+00
4d71670b-be91-40d6-a825-6865f2de56dc	1be14a91-1b2c-48d6-8465-d1d4d12a785c	ce45455d-4356-4250-b920-27e2a9a6acd3	368f7187-4490-4015-84fa-20a4f46eea09	Locksmith service needed in Davao City. Regular maintenance required.	2025-02-25 01:42:18.242518+00	\N	2025-05-14 08:47:35.964118+00	\N	completed	2025-02-12 22:01:43.490518+00
b0ee1129-3d23-4591-b4b9-b784c0f36481	4cfa17c8-4d9f-4283-97f2-3a4976248b91	ce45455d-4356-4250-b920-27e2a9a6acd3	368f7187-4490-4015-84fa-20a4f46eea09	Locksmith service needed in Davao City. Installation and setup.	2025-07-18 09:44:32.997718+00	\N	2025-08-30 05:33:21.381718+00	\N	completed	2025-10-07 00:14:42.444118+00
37310c0f-2217-4396-9d29-991ede4da91b	57dfd528-5470-40a1-8fde-40eb61dd7ae1	ce45455d-4356-4250-b920-27e2a9a6acd3	368f7187-4490-4015-84fa-20a4f46eea09	Locksmith service needed in Davao City. Inspection and consultation.	2025-11-04 15:10:51.324118+00	\N	2025-03-23 08:18:29.560918+00	\N	completed	2025-03-26 05:20:20.066518+00
7bf621c0-cd2b-4583-856a-87316c00a817	3cc9e6b9-d7d7-4d91-904b-65aeb230b14b	ce45455d-4356-4250-b920-27e2a9a6acd3	368f7187-4490-4015-84fa-20a4f46eea09	Locksmith service needed in Davao City. General service request.	2025-05-17 19:25:22.956118+00	\N	2025-04-29 06:11:43.423318+00	\N	completed	2025-12-14 02:31:19.471318+00
f0e03a0a-acb5-4975-94bb-44542e5ae43f	ff8bb61b-1117-4f5c-880b-ac4ebd7ea6c2	ce45455d-4356-4250-b920-27e2a9a6acd3	368f7187-4490-4015-84fa-20a4f46eea09	Locksmith service needed in Davao City. Urgent repair needed.	2025-06-19 03:55:07.692118+00	\N	2025-04-22 10:55:40.207318+00	\N	completed	2025-05-05 13:40:45.016918+00
2aa4036e-aeb5-449c-bc77-14e587564b19	feaac7e1-3bc3-4462-b2f8-b4a19f990531	ce45455d-4356-4250-b920-27e2a9a6acd3	368f7187-4490-4015-84fa-20a4f46eea09	Locksmith service needed in Davao City. Regular maintenance required.	2025-04-27 19:46:49.797718+00	\N	2025-07-09 17:00:09.602518+00	\N	completed	2025-08-27 23:33:47.388118+00
8f412d60-464d-4d9e-abae-aa2f306d17c1	8d3c4c94-5ab8-4070-a7cc-a12e88219bf3	ce45455d-4356-4250-b920-27e2a9a6acd3	368f7187-4490-4015-84fa-20a4f46eea09	Locksmith service needed in Davao City. Installation and setup.	2025-06-26 17:06:17.925718+00	\N	2025-05-13 15:03:32.066518+00	\N	completed	2025-07-10 10:29:41.119318+00
7f5d7465-fef5-4f04-93ad-cf4e6487b0c8	158e9458-44c9-4638-83b9-bf0c99bdb64a	ce45455d-4356-4250-b920-27e2a9a6acd3	368f7187-4490-4015-84fa-20a4f46eea09	Locksmith service needed in Davao City. Inspection and consultation.	2025-01-15 06:00:07.039318+00	\N	2025-02-20 15:35:09.496918+00	\N	completed	2025-03-08 01:54:02.488918+00
a58d46cc-6977-4869-ba39-af9adad80379	503f2221-11c2-4415-9a5b-9b0e81e95b67	ce45455d-4356-4250-b920-27e2a9a6acd3	368f7187-4490-4015-84fa-20a4f46eea09	Locksmith service needed in Davao City. General service request.	2025-12-05 09:17:02.412118+00	\N	2025-11-30 18:38:53.186518+00	\N	completed	2025-12-16 14:43:17.023318+00
e6c776b6-6b25-41b7-b9b8-4f2ab31fb719	5eae5e90-1914-41e5-be8a-aef4314d4892	ce45455d-4356-4250-b920-27e2a9a6acd3	368f7187-4490-4015-84fa-20a4f46eea09	Locksmith service needed in Davao City. Urgent repair needed.	2025-08-23 19:10:04.956118+00	\N	2025-04-30 10:50:34.524118+00	\N	completed	2025-09-19 14:55:02.738518+00
affc2c81-ec09-4401-bfef-d0d93a317671	ff8bb61b-1117-4f5c-880b-ac4ebd7ea6c2	307faedf-c25e-4493-a483-60960460ef13	fa26da00-47e3-4456-8d91-ef631d37234a	Landscaper service needed in Cagayan de Oro. Urgent repair needed.	2025-04-13 22:57:04.188118+00	\N	\N	\N	pending	2025-08-15 04:59:38.671318+00
300c4c02-eb19-4dd1-ba45-e1661c2c4e05	feaac7e1-3bc3-4462-b2f8-b4a19f990531	307faedf-c25e-4493-a483-60960460ef13	fa26da00-47e3-4456-8d91-ef631d37234a	Landscaper service needed in Cagayan de Oro. Regular maintenance required.	2025-02-20 04:20:47.253718+00	\N	2025-10-08 22:06:23.167318+00	\N	completed	2025-05-27 07:41:33.573718+00
8bf019a0-7858-4710-96bd-aca3cc2c9c02	8d3c4c94-5ab8-4070-a7cc-a12e88219bf3	307faedf-c25e-4493-a483-60960460ef13	fa26da00-47e3-4456-8d91-ef631d37234a	Landscaper service needed in Cagayan de Oro. Installation and setup.	2025-01-29 19:28:15.583318+00	\N	2025-06-16 15:11:51.372118+00	\N	completed	2024-12-22 07:36:11.474518+00
24a91f08-84fa-4889-81d4-ce774ebd19ba	158e9458-44c9-4638-83b9-bf0c99bdb64a	307faedf-c25e-4493-a483-60960460ef13	fa26da00-47e3-4456-8d91-ef631d37234a	Landscaper service needed in Cagayan de Oro. Inspection and consultation.	2025-01-23 06:30:16.860118+00	\N	2025-04-14 07:34:55.096918+00	\N	completed	2025-08-25 23:13:38.392918+00
3a110d7c-b682-4c2d-82aa-d4b06143a971	503f2221-11c2-4415-9a5b-9b0e81e95b67	307faedf-c25e-4493-a483-60960460ef13	fa26da00-47e3-4456-8d91-ef631d37234a	Landscaper service needed in Cagayan de Oro. General service request.	2025-06-08 22:24:46.495318+00	\N	2025-05-01 00:12:10.034518+00	\N	completed	2025-07-07 08:30:02.316118+00
7881ccfb-a137-49d0-b8b4-99a8b645b916	5eae5e90-1914-41e5-be8a-aef4314d4892	307faedf-c25e-4493-a483-60960460ef13	fa26da00-47e3-4456-8d91-ef631d37234a	Landscaper service needed in Cagayan de Oro. Urgent repair needed.	2025-11-01 14:59:15.372118+00	\N	2025-02-21 13:52:49.135318+00	\N	completed	2025-11-24 10:44:47.196118+00
1f66e680-f8aa-41f1-a3ad-5d4d2fdc58ef	4893cb6b-0ffd-422a-b940-7b9201daa34f	307faedf-c25e-4493-a483-60960460ef13	fa26da00-47e3-4456-8d91-ef631d37234a	Landscaper service needed in Cagayan de Oro. Regular maintenance required.	2024-12-30 03:04:23.906518+00	\N	2025-06-30 17:42:46.783318+00	\N	completed	2025-06-08 12:14:58.600918+00
8fb86f22-457f-4c08-a181-c36d03e25847	218a9cdd-7d3a-44c9-bd7a-d885d38d6063	307faedf-c25e-4493-a483-60960460ef13	fa26da00-47e3-4456-8d91-ef631d37234a	Landscaper service needed in Cagayan de Oro. Installation and setup.	2025-11-10 16:14:29.340118+00	\N	2025-03-05 03:32:41.666518+00	\N	completed	2025-06-16 18:01:28.946518+00
a60da30b-0512-4ee2-8ba1-38f6e028d934	4eea189c-607a-466d-8f92-1f53d790fb6f	307faedf-c25e-4493-a483-60960460ef13	fa26da00-47e3-4456-8d91-ef631d37234a	Landscaper service needed in Cagayan de Oro. Inspection and consultation.	2025-12-03 03:31:24.597718+00	\N	2025-10-01 19:18:56.488918+00	\N	completed	2025-01-15 21:57:47.186518+00
722b582c-afed-4251-bd4a-7f3cbd420a5a	5c74fdb2-b4d9-4f4b-9c6c-f6b72854db84	307faedf-c25e-4493-a483-60960460ef13	fa26da00-47e3-4456-8d91-ef631d37234a	Landscaper service needed in Cagayan de Oro. General service request.	2025-09-04 01:59:56.642518+00	\N	2025-05-11 23:09:53.839318+00	\N	completed	2025-01-09 20:46:02.824918+00
6d449077-25ac-405e-8c40-c87fe1a1b68a	218a9cdd-7d3a-44c9-bd7a-d885d38d6063	eaa4b66d-41c3-4990-a1e8-9570f25a2a90	ff8acab6-8c85-4fb8-af36-781b98920efb	Painter service needed in Iloilo City. Installation and setup.	2025-01-17 10:40:17.714518+00	\N	\N	\N	pending	2025-08-04 18:55:54.780118+00
8a05626f-b4bf-474d-8e7a-bf1f7998606b	4eea189c-607a-466d-8f92-1f53d790fb6f	eaa4b66d-41c3-4990-a1e8-9570f25a2a90	ff8acab6-8c85-4fb8-af36-781b98920efb	Painter service needed in Iloilo City. Inspection and consultation.	2025-02-04 17:28:51.900118+00	\N	2025-05-09 19:27:08.968918+00	\N	completed	2025-09-07 09:39:59.196118+00
2213fca1-1156-4e9a-89e4-b4a4b46d2cc8	5c74fdb2-b4d9-4f4b-9c6c-f6b72854db84	eaa4b66d-41c3-4990-a1e8-9570f25a2a90	ff8acab6-8c85-4fb8-af36-781b98920efb	Painter service needed in Iloilo City. General service request.	2024-12-31 18:08:58.485718+00	\N	2025-09-06 23:26:58.888918+00	\N	completed	2025-03-21 05:39:05.167318+00
7c2783f5-96df-46cd-b122-e4ee9ce7e444	9e61d17b-97a4-45e7-a26c-4fdc3086cdb7	eaa4b66d-41c3-4990-a1e8-9570f25a2a90	ff8acab6-8c85-4fb8-af36-781b98920efb	Painter service needed in Iloilo City. Urgent repair needed.	2025-11-10 04:45:28.668118+00	\N	2025-10-06 19:44:01.231318+00	\N	completed	2025-11-09 23:59:50.968918+00
ce856a33-5c7c-4f06-a0f4-b86acf0b6ae7	6302ea1c-5af4-4302-918a-c87152175bae	eaa4b66d-41c3-4990-a1e8-9570f25a2a90	ff8acab6-8c85-4fb8-af36-781b98920efb	Painter service needed in Iloilo City. Regular maintenance required.	2025-03-09 22:11:26.085718+00	\N	2025-03-24 12:15:52.255318+00	\N	completed	2025-04-03 14:45:11.935318+00
fe662ef1-aace-4f58-a314-5004b6fbe148	a3563a32-75c5-4d0b-b672-9f548fe69a06	eaa4b66d-41c3-4990-a1e8-9570f25a2a90	ff8acab6-8c85-4fb8-af36-781b98920efb	Painter service needed in Iloilo City. Installation and setup.	2025-10-06 05:07:12.098518+00	\N	2025-10-15 05:17:53.618518+00	\N	completed	2025-06-03 00:54:28.898518+00
e115896f-a1e5-419d-ba40-bac0375985a4	5fcd65e1-d364-4762-a7e2-9939ef039247	eaa4b66d-41c3-4990-a1e8-9570f25a2a90	ff8acab6-8c85-4fb8-af36-781b98920efb	Painter service needed in Iloilo City. Inspection and consultation.	2025-11-08 08:26:18.885718+00	\N	2025-05-12 01:01:40.639318+00	\N	completed	2025-08-24 16:16:20.968918+00
89d640ba-8462-4734-8fd4-4e6857a782aa	649a4947-627c-43f2-9c5e-b75f213a0d93	c3542c4f-23e1-4df8-bcab-3b5aace21c7b	c87b314f-ad10-4e91-b2e6-dbd8cdf13230	Plumber service needed in Baguio. General service request.	2025-10-08 05:16:37.932118+00	\N	\N	\N	pending	2025-02-10 15:37:44.757718+00
c7ac9622-0f81-4045-83fd-57085bb996b9	3c6ff2a2-e59e-48af-8a8e-9238dc49ecc6	c3542c4f-23e1-4df8-bcab-3b5aace21c7b	c87b314f-ad10-4e91-b2e6-dbd8cdf13230	Plumber service needed in Baguio. Urgent repair needed.	2025-01-27 10:51:45.976918+00	\N	2025-10-02 04:52:11.551318+00	\N	completed	2025-08-09 16:38:45.093718+00
dad81484-9c38-4013-b0e3-57a12d36702a	496d267d-f0aa-4592-a87a-bd69e1196f23	c3542c4f-23e1-4df8-bcab-3b5aace21c7b	c87b314f-ad10-4e91-b2e6-dbd8cdf13230	Plumber service needed in Baguio. Regular maintenance required.	2025-10-01 03:55:27.477718+00	\N	2025-11-19 21:23:12.808918+00	\N	completed	2025-04-19 10:41:57.938518+00
c527356d-e286-41fd-9952-8caddfdaaa36	5c328f75-464c-4053-a41e-00fbc6eba934	c3542c4f-23e1-4df8-bcab-3b5aace21c7b	c87b314f-ad10-4e91-b2e6-dbd8cdf13230	Plumber service needed in Baguio. Installation and setup.	2025-08-08 12:18:16.197718+00	\N	2025-10-17 15:11:33.400918+00	\N	completed	2025-01-29 12:48:45.717718+00
6b9cdc55-3cb7-4b90-ba50-2295991aa7f1	bed6bf7a-bfbb-4eac-b6d7-35ca3e7d6660	c3542c4f-23e1-4df8-bcab-3b5aace21c7b	c87b314f-ad10-4e91-b2e6-dbd8cdf13230	Plumber service needed in Baguio. Inspection and consultation.	2025-03-01 07:07:24.684118+00	\N	2025-07-06 23:26:57.852118+00	\N	completed	2025-10-01 22:13:26.700118+00
5d5c6454-6302-4a57-ad51-cdd0e6444f15	549f87d2-961e-48f8-bcff-7286d7db879e	c3542c4f-23e1-4df8-bcab-3b5aace21c7b	c87b314f-ad10-4e91-b2e6-dbd8cdf13230	Plumber service needed in Baguio. General service request.	2025-08-15 00:21:52.975318+00	\N	2025-04-10 19:08:35.704918+00	\N	completed	2025-08-01 06:16:42.194518+00
3f0f0034-b121-4c3c-b597-8b2cf5bc4c85	a8957421-6c24-4110-ad8a-89513c6cfe93	c3542c4f-23e1-4df8-bcab-3b5aace21c7b	c87b314f-ad10-4e91-b2e6-dbd8cdf13230	Plumber service needed in Baguio. Urgent repair needed.	2025-04-06 23:59:40.082518+00	\N	2025-04-30 21:20:09.640918+00	\N	completed	2025-06-05 07:10:32.344918+00
ec4144a5-c1cb-46c8-8b24-bd5a4d0ef9b9	ded07a3d-2dc7-40f1-a9df-81b72c989abf	c3542c4f-23e1-4df8-bcab-3b5aace21c7b	c87b314f-ad10-4e91-b2e6-dbd8cdf13230	Plumber service needed in Baguio. Regular maintenance required.	2025-07-11 07:05:52.149718+00	\N	2025-09-08 09:13:13.020118+00	\N	completed	2025-02-09 13:17:38.383318+00
8498e7be-6898-4a8a-a397-467a8c842bda	f97cfaac-5a4e-420a-a445-9776c13600b8	c3542c4f-23e1-4df8-bcab-3b5aace21c7b	c87b314f-ad10-4e91-b2e6-dbd8cdf13230	Plumber service needed in Baguio. Installation and setup.	2025-11-29 16:41:11.800918+00	\N	2025-05-10 10:32:25.106518+00	\N	completed	2025-09-29 07:25:31.164118+00
91aad3ef-e036-444a-8a72-a2ee18c58ffd	2594b276-c01e-4543-b2b5-0cd20667b7a6	c3542c4f-23e1-4df8-bcab-3b5aace21c7b	c87b314f-ad10-4e91-b2e6-dbd8cdf13230	Plumber service needed in Baguio. Inspection and consultation.	2025-08-27 19:24:05.455318+00	\N	2025-05-08 10:35:17.733718+00	\N	completed	2025-08-28 12:35:53.733718+00
bba9b8d1-b7b2-4c0f-be50-febfd6da3602	216ebdf7-cd45-4b40-86f2-268b4e33bb68	c3542c4f-23e1-4df8-bcab-3b5aace21c7b	c87b314f-ad10-4e91-b2e6-dbd8cdf13230	Plumber service needed in Baguio. General service request.	2025-03-18 15:22:22.610518+00	\N	2025-05-10 11:43:18.664918+00	\N	completed	2025-04-13 03:08:03.448918+00
754e6f01-d95a-40c5-894d-2bc4e8ed8c4c	f74860cc-f981-42b4-809d-11e92bedd14f	c3542c4f-23e1-4df8-bcab-3b5aace21c7b	c87b314f-ad10-4e91-b2e6-dbd8cdf13230	Plumber service needed in Baguio. Urgent repair needed.	2025-03-17 07:52:20.364118+00	\N	2025-05-16 11:11:10.821718+00	\N	completed	2025-07-04 08:29:39.765718+00
17820f69-8c54-42e6-8aa6-cef4e48e0f5d	d951675f-497c-4ccb-b55d-6a72f9cfb8fc	c3542c4f-23e1-4df8-bcab-3b5aace21c7b	c87b314f-ad10-4e91-b2e6-dbd8cdf13230	Plumber service needed in Baguio. Regular maintenance required.	2025-07-24 22:48:23.973718+00	\N	2025-06-11 04:55:29.234518+00	\N	completed	2025-01-31 12:35:28.418518+00
a5e92daf-1e36-4e2b-ab3c-819fff1d9e34	dd3b46e4-576f-488e-928f-a5a2688e0fd4	c3542c4f-23e1-4df8-bcab-3b5aace21c7b	c87b314f-ad10-4e91-b2e6-dbd8cdf13230	Plumber service needed in Baguio. Installation and setup.	2025-01-15 19:14:34.178518+00	\N	2025-07-16 08:25:03.544918+00	\N	completed	2025-07-02 05:46:24.424918+00
db94afdd-4d68-40c0-b438-90115f6d66d8	ded07a3d-2dc7-40f1-a9df-81b72c989abf	2fafc06b-a809-4acc-b9ce-ea53779d48d4	67b073d4-c07b-4f32-97c5-d64e4797044e	Handyman service needed in Manila. Regular maintenance required.	2025-05-31 05:37:59.244118+00	\N	\N	\N	pending	2025-09-13 20:38:01.058518+00
947949fd-840b-4fba-b752-9612aa586369	f97cfaac-5a4e-420a-a445-9776c13600b8	2fafc06b-a809-4acc-b9ce-ea53779d48d4	67b073d4-c07b-4f32-97c5-d64e4797044e	Handyman service needed in Manila. Installation and setup.	2025-09-30 16:59:36.424918+00	\N	2025-03-28 01:07:36.175318+00	\N	completed	2025-10-30 21:26:53.820118+00
1599dadc-f3f2-4767-a5f1-1791a10d7e84	2594b276-c01e-4543-b2b5-0cd20667b7a6	2fafc06b-a809-4acc-b9ce-ea53779d48d4	67b073d4-c07b-4f32-97c5-d64e4797044e	Handyman service needed in Manila. Inspection and consultation.	2025-07-28 07:44:02.440918+00	\N	2025-12-05 01:19:37.356118+00	\N	completed	2025-03-07 07:13:53.138518+00
8c994052-1ebd-4be6-a31b-cca1ee08a53a	216ebdf7-cd45-4b40-86f2-268b4e33bb68	2fafc06b-a809-4acc-b9ce-ea53779d48d4	67b073d4-c07b-4f32-97c5-d64e4797044e	Handyman service needed in Manila. General service request.	2025-01-15 19:42:09.861718+00	\N	2025-06-22 23:27:02.776918+00	\N	completed	2025-12-11 19:08:21.621718+00
5a3bebb1-1d17-4f86-bc5f-dc0e76d2d403	f74860cc-f981-42b4-809d-11e92bedd14f	2fafc06b-a809-4acc-b9ce-ea53779d48d4	67b073d4-c07b-4f32-97c5-d64e4797044e	Handyman service needed in Manila. Urgent repair needed.	2025-12-01 02:20:25.596118+00	\N	2025-06-14 01:53:01.490518+00	\N	completed	2025-05-05 12:32:17.992918+00
d353d7f6-5b1c-4b91-83f6-264c5ae683c5	d951675f-497c-4ccb-b55d-6a72f9cfb8fc	2fafc06b-a809-4acc-b9ce-ea53779d48d4	67b073d4-c07b-4f32-97c5-d64e4797044e	Handyman service needed in Manila. Regular maintenance required.	2025-03-23 23:28:26.757718+00	\N	2025-10-03 06:26:13.644118+00	\N	completed	2025-04-22 18:08:53.388118+00
c1c7c386-5273-4da3-a363-263103284bbc	dd3b46e4-576f-488e-928f-a5a2688e0fd4	2fafc06b-a809-4acc-b9ce-ea53779d48d4	67b073d4-c07b-4f32-97c5-d64e4797044e	Handyman service needed in Manila. Installation and setup.	2025-06-12 08:48:24.693718+00	\N	2025-08-07 06:34:28.975318+00	\N	completed	2025-08-14 04:39:10.322518+00
c47f2b6c-b34c-4769-a86e-f061b0b55e8b	7d6e1a27-d7f8-445f-a544-81c817a39304	2fafc06b-a809-4acc-b9ce-ea53779d48d4	67b073d4-c07b-4f32-97c5-d64e4797044e	Handyman service needed in Manila. Inspection and consultation.	2025-05-29 01:59:02.642518+00	\N	2025-11-11 21:56:40.744918+00	\N	completed	2025-09-23 18:10:50.978518+00
e48f7737-7b4f-4ae0-af07-47a841925bcc	088c7759-5ee8-4fd2-99fa-6d6953d6e99c	2fafc06b-a809-4acc-b9ce-ea53779d48d4	67b073d4-c07b-4f32-97c5-d64e4797044e	Handyman service needed in Manila. General service request.	2025-05-09 05:21:23.397718+00	\N	2025-07-02 05:18:57.036118+00	\N	completed	2025-08-05 13:52:37.125718+00
a87da33e-1f70-4b36-8a03-9f5715dca350	ce930397-85a0-4a2c-9d12-343341780701	2fafc06b-a809-4acc-b9ce-ea53779d48d4	67b073d4-c07b-4f32-97c5-d64e4797044e	Handyman service needed in Manila. Urgent repair needed.	2025-01-31 19:29:37.404118+00	\N	2025-03-04 14:41:20.556118+00	\N	completed	2025-07-14 13:16:42.223318+00
3c170e99-b7fb-4a1c-a3e7-c5047f5b4245	2637c6dd-5fbe-487c-85c5-3ef87dc74cf5	2fafc06b-a809-4acc-b9ce-ea53779d48d4	67b073d4-c07b-4f32-97c5-d64e4797044e	Handyman service needed in Manila. Regular maintenance required.	2025-05-11 16:06:29.992918+00	\N	2025-12-04 18:50:29.052118+00	\N	completed	2025-05-21 20:18:09.170518+00
af38f58b-5f60-4566-8ae8-7aa3365d345d	7d6e1a27-d7f8-445f-a544-81c817a39304	81610da5-f9ae-444a-953d-05db70defdf5	19a03c30-e580-4bda-bec4-d59fb737e8e0	Carpenter service needed in Quezon City. Inspection and consultation.	2025-08-21 02:50:27.640918+00	\N	\N	\N	pending	2025-04-15 20:38:53.676118+00
ec117555-f1c6-47d6-bb11-d37c1beeb4d5	088c7759-5ee8-4fd2-99fa-6d6953d6e99c	81610da5-f9ae-444a-953d-05db70defdf5	19a03c30-e580-4bda-bec4-d59fb737e8e0	Carpenter service needed in Quezon City. General service request.	2025-01-22 05:23:08.460118+00	\N	2025-05-01 03:04:31.250518+00	\N	completed	2025-01-14 17:29:07.884118+00
88cdb1bf-9e19-4ae5-9418-79cad8b810bc	ce930397-85a0-4a2c-9d12-343341780701	81610da5-f9ae-444a-953d-05db70defdf5	19a03c30-e580-4bda-bec4-d59fb737e8e0	Carpenter service needed in Quezon City. Urgent repair needed.	2024-12-29 19:31:51.151318+00	\N	2025-10-11 16:25:24.165718+00	\N	completed	2025-12-01 07:08:07.624918+00
79a87627-0fe3-4895-9f57-77133d920515	2637c6dd-5fbe-487c-85c5-3ef87dc74cf5	81610da5-f9ae-444a-953d-05db70defdf5	19a03c30-e580-4bda-bec4-d59fb737e8e0	Carpenter service needed in Quezon City. Regular maintenance required.	2025-03-08 04:58:37.759318+00	\N	2025-08-10 05:18:22.562518+00	\N	completed	2025-01-02 13:47:10.015318+00
6c4802d8-5091-4ce7-a0f6-308ec3cfcf24	d4d09b07-6022-4d29-8d83-2905a67c2fb0	81610da5-f9ae-444a-953d-05db70defdf5	19a03c30-e580-4bda-bec4-d59fb737e8e0	Carpenter service needed in Quezon City. Installation and setup.	2025-07-31 06:43:26.296918+00	\N	2025-11-04 12:11:52.149718+00	\N	completed	2024-12-26 05:38:59.292118+00
c14f6b2d-614f-4c3b-817c-b8c2b37b0ded	9c0e3b56-4094-4a57-b207-abb436a8fe3d	81610da5-f9ae-444a-953d-05db70defdf5	19a03c30-e580-4bda-bec4-d59fb737e8e0	Carpenter service needed in Quezon City. Inspection and consultation.	2025-06-02 15:47:12.924118+00	\N	2025-12-18 04:02:36.108118+00	\N	completed	2025-10-12 07:49:01.989718+00
ec34e7f8-767a-4b38-8107-9d2def9fed11	6e0bbfe1-f2fd-4356-8684-bc8d8fb15a28	81610da5-f9ae-444a-953d-05db70defdf5	19a03c30-e580-4bda-bec4-d59fb737e8e0	Carpenter service needed in Quezon City. General service request.	2025-06-11 12:23:21.276118+00	\N	2025-09-07 09:44:48.031318+00	\N	completed	2025-09-28 02:54:22.821718+00
6e93f447-529c-4017-afc7-cdf97daaa00f	2f6a0b4d-ff98-443f-a347-bc1c2e867bf5	81610da5-f9ae-444a-953d-05db70defdf5	19a03c30-e580-4bda-bec4-d59fb737e8e0	Carpenter service needed in Quezon City. Urgent repair needed.	2025-04-17 17:39:27.372118+00	\N	2025-06-21 03:15:30.914518+00	\N	completed	2025-06-28 10:45:08.536918+00
7b90cc7d-ab12-4817-8320-3c4dd238633e	2f6a0b4d-ff98-443f-a347-bc1c2e867bf5	43fc2e10-b7f4-497d-8e3e-3cc3504b607d	2fd74584-4526-428d-b506-d92de93f45b1	Electrician service needed in Makati. Urgent repair needed.	2025-04-11 21:26:51.400918+00	\N	\N	\N	pending	2024-12-23 09:37:22.207318+00
2b9eee0c-0f0f-47a5-b152-780fb828e5a5	c02b1823-7eec-4776-812e-b2a42402a542	43fc2e10-b7f4-497d-8e3e-3cc3504b607d	2fd74584-4526-428d-b506-d92de93f45b1	Electrician service needed in Makati. Regular maintenance required.	2025-07-07 13:56:06.472918+00	\N	2025-04-08 23:24:37.192918+00	\N	completed	2025-01-09 08:41:02.584918+00
a22e9fa5-1bc5-47d7-be4b-41f2c2af22e5	8568204d-bac8-4bd2-be49-666099493157	43fc2e10-b7f4-497d-8e3e-3cc3504b607d	2fd74584-4526-428d-b506-d92de93f45b1	Electrician service needed in Makati. Installation and setup.	2025-06-03 00:58:57.948118+00	\N	2025-04-02 06:45:18.357718+00	\N	completed	2025-05-22 09:39:29.906518+00
2c717bdd-bd6b-4702-b0ac-c1d29b29ddca	3505bad0-2d27-427b-ae95-3169a5838fbf	43fc2e10-b7f4-497d-8e3e-3cc3504b607d	2fd74584-4526-428d-b506-d92de93f45b1	Electrician service needed in Makati. Inspection and consultation.	2025-06-22 06:06:58.044118+00	\N	2025-06-12 22:00:47.848918+00	\N	completed	2025-09-09 00:02:46.188118+00
3e780152-1356-401d-8c43-4d06b59aa7fe	5be0cd9f-a466-4485-ac43-bdc4b104ecc0	43fc2e10-b7f4-497d-8e3e-3cc3504b607d	2fd74584-4526-428d-b506-d92de93f45b1	Electrician service needed in Makati. General service request.	2025-11-06 19:46:53.426518+00	\N	2025-08-12 23:57:50.268118+00	\N	completed	2025-03-29 11:17:52.840918+00
c72ba092-d813-48d2-a5d2-bb33408aee00	0897825a-ab99-41e9-98ba-b4ed822155a5	78a4aadd-b865-4eb6-80a7-48519d0e2ba2	8a10c3b6-f3d9-4e9d-89c3-0e47b7c652d0	Roofer service needed in Taguig. Installation and setup.	2025-11-07 05:52:30.847318+00	\N	\N	\N	pending	2025-09-02 15:29:45.842518+00
e1f6f907-5f8e-41f0-8942-959eb6c9a951	b19b93f9-ccf5-4b17-bdcf-a105d11018af	78a4aadd-b865-4eb6-80a7-48519d0e2ba2	8a10c3b6-f3d9-4e9d-89c3-0e47b7c652d0	Roofer service needed in Taguig. Inspection and consultation.	2025-01-01 17:35:50.767318+00	\N	\N	\N	canceled	2025-01-14 00:37:08.642518+00
153371a4-8ca3-4aeb-8b20-f72e04241d38	6fc15c3f-2c63-4a80-b499-3744ac6c5e0a	78a4aadd-b865-4eb6-80a7-48519d0e2ba2	8a10c3b6-f3d9-4e9d-89c3-0e47b7c652d0	Roofer service needed in Taguig. General service request.	2025-01-27 04:32:47.311318+00	\N	2025-08-28 12:50:51.170518+00	\N	completed	2025-04-25 02:43:42.079318+00
27671c50-5f7c-45ab-92f9-67b7922475c0	97c5f2cc-ef11-452a-9aa3-b4705f3280f8	78a4aadd-b865-4eb6-80a7-48519d0e2ba2	8a10c3b6-f3d9-4e9d-89c3-0e47b7c652d0	Roofer service needed in Taguig. Urgent repair needed.	2025-06-06 01:28:42.540118+00	\N	2025-05-26 04:47:21.333718+00	\N	completed	2025-07-12 21:55:06.136918+00
adea4021-6fd1-4117-bd40-656ced5ad4f1	1be14a91-1b2c-48d6-8465-d1d4d12a785c	78a4aadd-b865-4eb6-80a7-48519d0e2ba2	8a10c3b6-f3d9-4e9d-89c3-0e47b7c652d0	Roofer service needed in Taguig. Regular maintenance required.	2025-03-04 05:57:44.306518+00	\N	2025-04-06 01:41:33.919318+00	\N	completed	2025-11-20 18:56:57.938518+00
68e96836-6c0c-4a82-9e15-975d70fb8f0d	4cfa17c8-4d9f-4283-97f2-3a4976248b91	78a4aadd-b865-4eb6-80a7-48519d0e2ba2	8a10c3b6-f3d9-4e9d-89c3-0e47b7c652d0	Roofer service needed in Taguig. Installation and setup.	2025-06-06 04:06:24.463318+00	\N	2025-11-05 20:20:42.703318+00	\N	completed	2025-09-24 01:45:34.197718+00
604ca8b7-0d68-4047-9e83-953fb40b0037	57dfd528-5470-40a1-8fde-40eb61dd7ae1	78a4aadd-b865-4eb6-80a7-48519d0e2ba2	8a10c3b6-f3d9-4e9d-89c3-0e47b7c652d0	Roofer service needed in Taguig. Inspection and consultation.	2025-03-07 17:01:25.807318+00	\N	2025-05-17 21:05:15.228118+00	\N	completed	2025-02-25 16:21:36.674518+00
a418a7e0-4b56-44fc-b7cb-217f0e945059	3cc9e6b9-d7d7-4d91-904b-65aeb230b14b	78a4aadd-b865-4eb6-80a7-48519d0e2ba2	8a10c3b6-f3d9-4e9d-89c3-0e47b7c652d0	Roofer service needed in Taguig. General service request.	2025-11-27 20:53:37.029718+00	\N	2025-12-02 16:06:38.200918+00	\N	completed	2025-06-28 01:09:20.892118+00
c0bb548f-e330-41f6-a7f3-b2ffa82e451f	ff8bb61b-1117-4f5c-880b-ac4ebd7ea6c2	78a4aadd-b865-4eb6-80a7-48519d0e2ba2	8a10c3b6-f3d9-4e9d-89c3-0e47b7c652d0	Roofer service needed in Taguig. Urgent repair needed.	2025-01-05 13:31:36.204118+00	\N	2025-08-14 18:43:02.104918+00	\N	completed	2025-10-08 20:43:16.332118+00
a257ed11-0d7f-4944-bfb1-8d4d9f1d13fc	feaac7e1-3bc3-4462-b2f8-b4a19f990531	78a4aadd-b865-4eb6-80a7-48519d0e2ba2	8a10c3b6-f3d9-4e9d-89c3-0e47b7c652d0	Roofer service needed in Taguig. Regular maintenance required.	2025-04-30 20:38:37.346518+00	\N	2025-11-25 02:14:11.052118+00	\N	completed	2025-04-20 02:45:22.648918+00
a8bdeb5e-755d-4e25-b400-0fd93701a514	8d3c4c94-5ab8-4070-a7cc-a12e88219bf3	78a4aadd-b865-4eb6-80a7-48519d0e2ba2	8a10c3b6-f3d9-4e9d-89c3-0e47b7c652d0	Roofer service needed in Taguig. Installation and setup.	2025-07-27 09:09:46.437718+00	\N	2025-12-13 02:55:35.052118+00	\N	completed	2025-07-30 18:37:32.661718+00
a710689e-c65f-4e34-87e1-89f688af516a	158e9458-44c9-4638-83b9-bf0c99bdb64a	78a4aadd-b865-4eb6-80a7-48519d0e2ba2	8a10c3b6-f3d9-4e9d-89c3-0e47b7c652d0	Roofer service needed in Taguig. Inspection and consultation.	2025-09-11 16:52:25.029718+00	\N	2025-10-04 01:29:05.868118+00	\N	completed	2025-11-07 21:00:19.308118+00
92c9d64a-b3b2-43e0-80a1-8cb9816a47ee	3cc9e6b9-d7d7-4d91-904b-65aeb230b14b	41ecd97e-ef9c-4a81-8261-126c4d90cdc4	45138e1c-7f74-4a2e-b43c-86f41855fac4	HVAC Technician service needed in Pasig. General service request.	2025-09-16 02:54:37.164118+00	\N	\N	\N	pending	2025-04-11 05:18:51.333718+00
c88f5280-9fc8-4e04-a757-56421b7c29e4	ff8bb61b-1117-4f5c-880b-ac4ebd7ea6c2	41ecd97e-ef9c-4a81-8261-126c4d90cdc4	45138e1c-7f74-4a2e-b43c-86f41855fac4	HVAC Technician service needed in Pasig. Urgent repair needed.	2025-08-13 03:00:52.744918+00	\N	2025-04-23 09:33:29.013718+00	\N	completed	2025-06-13 17:00:19.452118+00
2953a530-8952-4526-b02e-6f27026490bc	feaac7e1-3bc3-4462-b2f8-b4a19f990531	41ecd97e-ef9c-4a81-8261-126c4d90cdc4	45138e1c-7f74-4a2e-b43c-86f41855fac4	HVAC Technician service needed in Pasig. Regular maintenance required.	2025-01-01 02:16:25.749718+00	\N	2025-12-14 12:56:37.288918+00	\N	completed	2025-12-19 20:02:19.461718+00
9c24a144-5d32-45b7-b444-49a09cbe4831	8d3c4c94-5ab8-4070-a7cc-a12e88219bf3	41ecd97e-ef9c-4a81-8261-126c4d90cdc4	45138e1c-7f74-4a2e-b43c-86f41855fac4	HVAC Technician service needed in Pasig. Installation and setup.	2025-11-04 05:16:59.359318+00	\N	2025-05-27 19:45:05.253718+00	\N	completed	2025-11-15 07:45:29.704918+00
e13c80f3-c5ad-4b8b-9f8c-7781ff1a0146	158e9458-44c9-4638-83b9-bf0c99bdb64a	41ecd97e-ef9c-4a81-8261-126c4d90cdc4	45138e1c-7f74-4a2e-b43c-86f41855fac4	HVAC Technician service needed in Pasig. Inspection and consultation.	2025-12-17 06:54:51.016918+00	\N	2025-12-18 14:36:11.935318+00	\N	completed	2025-01-02 02:19:02.565718+00
5ff87450-1915-49ec-86aa-2d4812687204	503f2221-11c2-4415-9a5b-9b0e81e95b67	41ecd97e-ef9c-4a81-8261-126c4d90cdc4	45138e1c-7f74-4a2e-b43c-86f41855fac4	HVAC Technician service needed in Pasig. General service request.	2025-07-21 11:18:09.688918+00	\N	2025-08-24 06:37:54.261718+00	\N	completed	2025-12-18 03:17:26.776918+00
1268d818-645c-487f-a4b9-b87364c39b69	5eae5e90-1914-41e5-be8a-aef4314d4892	41ecd97e-ef9c-4a81-8261-126c4d90cdc4	45138e1c-7f74-4a2e-b43c-86f41855fac4	HVAC Technician service needed in Pasig. Urgent repair needed.	2025-10-24 02:29:41.666518+00	\N	2025-09-30 01:48:14.210518+00	\N	completed	2025-09-27 12:14:27.756118+00
fd6c8b0e-a632-401d-ac0f-6529bfd36395	4893cb6b-0ffd-422a-b940-7b9201daa34f	41ecd97e-ef9c-4a81-8261-126c4d90cdc4	45138e1c-7f74-4a2e-b43c-86f41855fac4	HVAC Technician service needed in Pasig. Regular maintenance required.	2025-04-20 03:59:48.492118+00	\N	2025-07-14 11:36:04.850518+00	\N	completed	2025-07-14 00:35:24.012118+00
fbc0fb95-6e41-4469-a25f-933baf023b06	218a9cdd-7d3a-44c9-bd7a-d885d38d6063	41ecd97e-ef9c-4a81-8261-126c4d90cdc4	45138e1c-7f74-4a2e-b43c-86f41855fac4	HVAC Technician service needed in Pasig. Installation and setup.	2025-02-19 18:41:40.024918+00	\N	2025-07-02 20:37:57.170518+00	\N	completed	2025-01-18 01:42:41.743318+00
84fd7caf-bcc3-4d1e-aaee-aa43cae5fc01	4893cb6b-0ffd-422a-b940-7b9201daa34f	7624d68c-87c9-454d-8a81-b9e04a9835d5	8ec0536f-dc92-40ba-87d8-f60e42a55db6	Cleaner service needed in Cebu City. Regular maintenance required.	2025-06-13 14:05:11.570518+00	\N	\N	\N	pending	2025-08-15 04:55:40.898518+00
27742430-f901-4fe7-86b9-cf2860c0ad50	218a9cdd-7d3a-44c9-bd7a-d885d38d6063	7624d68c-87c9-454d-8a81-b9e04a9835d5	8ec0536f-dc92-40ba-87d8-f60e42a55db6	Cleaner service needed in Cebu City. Installation and setup.	2025-06-20 06:25:18.607318+00	\N	2025-09-11 14:37:14.834518+00	\N	completed	2024-12-28 06:02:24.415318+00
ef853b1f-eb2b-4f7a-9f95-1e18be8634d8	4eea189c-607a-466d-8f92-1f53d790fb6f	7624d68c-87c9-454d-8a81-b9e04a9835d5	8ec0536f-dc92-40ba-87d8-f60e42a55db6	Cleaner service needed in Cebu City. Inspection and consultation.	2025-10-22 01:55:14.460118+00	\N	2025-03-07 06:30:32.671318+00	\N	completed	2024-12-21 02:09:13.231318+00
f3dc8c67-805d-4963-a52b-aa942a18edb8	5c74fdb2-b4d9-4f4b-9c6c-f6b72854db84	7624d68c-87c9-454d-8a81-b9e04a9835d5	8ec0536f-dc92-40ba-87d8-f60e42a55db6	Cleaner service needed in Cebu City. General service request.	2025-04-16 07:12:03.324118+00	\N	2025-07-29 20:55:07.058518+00	\N	completed	2025-05-04 07:25:14.748118+00
edd5275f-a2c2-467f-9df2-064a56601e09	9e61d17b-97a4-45e7-a26c-4fdc3086cdb7	7624d68c-87c9-454d-8a81-b9e04a9835d5	8ec0536f-dc92-40ba-87d8-f60e42a55db6	Cleaner service needed in Cebu City. Urgent repair needed.	2025-10-28 21:46:14.258518+00	\N	2025-06-28 09:24:14.498518+00	\N	completed	2025-04-24 18:25:16.533718+00
a9e8910b-8c94-4961-bcb5-448fadc35859	6302ea1c-5af4-4302-918a-c87152175bae	7624d68c-87c9-454d-8a81-b9e04a9835d5	8ec0536f-dc92-40ba-87d8-f60e42a55db6	Cleaner service needed in Cebu City. Regular maintenance required.	2025-11-20 05:42:23.541718+00	\N	2025-08-05 15:42:08.104918+00	\N	completed	2025-06-22 22:13:43.116118+00
cba4c5ee-cb1d-4746-afbc-2b8dd864f8c7	5fcd65e1-d364-4762-a7e2-9939ef039247	8dfa85c7-8db4-4f2e-ae73-1cdbce4cf8d8	368f7187-4490-4015-84fa-20a4f46eea09	Locksmith service needed in Mandaue City. Inspection and consultation.	2025-04-01 19:51:20.143318+00	\N	\N	\N	pending	2025-04-27 16:03:57.842518+00
dfc3e7d8-210a-4653-bb83-c360734e3294	649a4947-627c-43f2-9c5e-b75f213a0d93	8dfa85c7-8db4-4f2e-ae73-1cdbce4cf8d8	368f7187-4490-4015-84fa-20a4f46eea09	Locksmith service needed in Mandaue City. General service request.	2025-03-09 05:11:05.724118+00	\N	\N	\N	canceled	2025-07-15 20:50:05.954518+00
07782c0b-701a-45f2-9eaa-39b54673c238	3c6ff2a2-e59e-48af-8a8e-9238dc49ecc6	8dfa85c7-8db4-4f2e-ae73-1cdbce4cf8d8	368f7187-4490-4015-84fa-20a4f46eea09	Locksmith service needed in Mandaue City. Urgent repair needed.	2025-12-15 21:33:46.552918+00	\N	2025-06-01 06:15:43.701718+00	\N	completed	2025-03-23 03:50:48.146518+00
7b8ae44f-357c-40c5-82e3-5f5bfb0f869e	496d267d-f0aa-4592-a87a-bd69e1196f23	8dfa85c7-8db4-4f2e-ae73-1cdbce4cf8d8	368f7187-4490-4015-84fa-20a4f46eea09	Locksmith service needed in Mandaue City. Regular maintenance required.	2025-10-02 14:31:31.048918+00	\N	2025-08-27 18:28:47.695318+00	\N	completed	2025-10-14 08:49:04.610518+00
fd05ab62-2526-45a2-9044-d119f93c6b81	5c328f75-464c-4053-a41e-00fbc6eba934	8dfa85c7-8db4-4f2e-ae73-1cdbce4cf8d8	368f7187-4490-4015-84fa-20a4f46eea09	Locksmith service needed in Mandaue City. Installation and setup.	2025-06-17 20:31:34.504918+00	\N	2025-04-28 19:20:52.869718+00	\N	completed	2025-04-08 05:47:07.970518+00
14f9cc03-3a74-417e-8dae-3e9fb800b18b	bed6bf7a-bfbb-4eac-b6d7-35ca3e7d6660	8dfa85c7-8db4-4f2e-ae73-1cdbce4cf8d8	368f7187-4490-4015-84fa-20a4f46eea09	Locksmith service needed in Mandaue City. Inspection and consultation.	2025-12-01 02:36:46.408918+00	\N	2025-07-11 08:32:56.671318+00	\N	completed	2025-12-13 10:01:15.496918+00
f9d1a872-e832-4958-a37e-a82d81fb0065	549f87d2-961e-48f8-bcff-7286d7db879e	8dfa85c7-8db4-4f2e-ae73-1cdbce4cf8d8	368f7187-4490-4015-84fa-20a4f46eea09	Locksmith service needed in Mandaue City. General service request.	2025-07-03 09:06:41.368918+00	\N	2025-10-30 06:08:30.492118+00	\N	completed	2025-03-18 07:46:31.221718+00
7b8f23b5-64bb-4ffb-ab45-3bdf210c9a2a	a8957421-6c24-4110-ad8a-89513c6cfe93	8dfa85c7-8db4-4f2e-ae73-1cdbce4cf8d8	368f7187-4490-4015-84fa-20a4f46eea09	Locksmith service needed in Mandaue City. Urgent repair needed.	2025-10-12 20:13:37.010518+00	\N	2025-08-06 13:57:30.540118+00	\N	completed	2025-06-13 11:04:12.991318+00
c98b3a1d-a119-49bc-8b7a-644676886953	ded07a3d-2dc7-40f1-a9df-81b72c989abf	8dfa85c7-8db4-4f2e-ae73-1cdbce4cf8d8	368f7187-4490-4015-84fa-20a4f46eea09	Locksmith service needed in Mandaue City. Regular maintenance required.	2025-07-24 06:24:56.056918+00	\N	2025-07-03 08:52:51.237718+00	\N	completed	2025-09-16 01:31:19.356118+00
0eac34e6-f4bf-4c06-81c1-7927d35c7ecf	f97cfaac-5a4e-420a-a445-9776c13600b8	8dfa85c7-8db4-4f2e-ae73-1cdbce4cf8d8	368f7187-4490-4015-84fa-20a4f46eea09	Locksmith service needed in Mandaue City. Installation and setup.	2025-08-25 17:05:01.288918+00	\N	2025-10-17 12:06:22.101718+00	\N	completed	2025-04-18 03:38:56.124118+00
8f0143f6-27dd-46c3-93b3-c50ac74ef729	2594b276-c01e-4543-b2b5-0cd20667b7a6	8dfa85c7-8db4-4f2e-ae73-1cdbce4cf8d8	368f7187-4490-4015-84fa-20a4f46eea09	Locksmith service needed in Mandaue City. Inspection and consultation.	2024-12-25 00:55:14.949718+00	\N	2025-09-02 20:47:18.252118+00	\N	completed	2025-09-08 02:08:33.919318+00
d8b859b1-96b1-4982-8b0b-a129218418fa	216ebdf7-cd45-4b40-86f2-268b4e33bb68	8dfa85c7-8db4-4f2e-ae73-1cdbce4cf8d8	368f7187-4490-4015-84fa-20a4f46eea09	Locksmith service needed in Mandaue City. General service request.	2025-09-29 18:15:41.714518+00	\N	2025-12-13 22:33:22.303318+00	\N	completed	2025-04-18 17:55:34.706518+00
208e990f-452b-4e69-aa04-b393a8bd6fe0	f74860cc-f981-42b4-809d-11e92bedd14f	8dfa85c7-8db4-4f2e-ae73-1cdbce4cf8d8	368f7187-4490-4015-84fa-20a4f46eea09	Locksmith service needed in Mandaue City. Urgent repair needed.	2025-08-22 22:44:44.949718+00	\N	2025-12-16 17:41:58.053718+00	\N	completed	2025-02-20 21:02:48.088918+00
1dcb7c17-22c7-4fa3-ba1f-f889e7464fc3	a8957421-6c24-4110-ad8a-89513c6cfe93	66916789-7b07-40f9-9df7-57c432205d9e	fa26da00-47e3-4456-8d91-ef631d37234a	Landscaper service needed in Lapu-Lapu. Urgent repair needed.	2025-12-01 16:37:47.810518+00	\N	\N	\N	pending	2025-10-24 05:07:47.004118+00
d86b73e1-85d0-44e5-9e79-ea46fb665e8e	ded07a3d-2dc7-40f1-a9df-81b72c989abf	66916789-7b07-40f9-9df7-57c432205d9e	fa26da00-47e3-4456-8d91-ef631d37234a	Landscaper service needed in Lapu-Lapu. Regular maintenance required.	2025-10-28 01:43:28.312918+00	\N	2025-04-30 12:17:54.856918+00	\N	completed	2025-09-01 19:53:56.786518+00
83d53f39-d0d6-4e94-8046-98891ce99bb3	f97cfaac-5a4e-420a-a445-9776c13600b8	66916789-7b07-40f9-9df7-57c432205d9e	fa26da00-47e3-4456-8d91-ef631d37234a	Landscaper service needed in Lapu-Lapu. Installation and setup.	2025-03-18 09:30:33.880918+00	\N	2025-04-22 07:25:45.506518+00	\N	completed	2025-11-02 10:42:39.151318+00
8d399b70-df13-453b-97bc-d3c2a108045a	2594b276-c01e-4543-b2b5-0cd20667b7a6	66916789-7b07-40f9-9df7-57c432205d9e	fa26da00-47e3-4456-8d91-ef631d37234a	Landscaper service needed in Lapu-Lapu. Inspection and consultation.	2025-05-01 20:25:35.944918+00	\N	2025-05-17 15:42:19.336918+00	\N	completed	2025-01-29 13:35:33.717718+00
963cb210-ca20-418c-a54c-81606f698daa	216ebdf7-cd45-4b40-86f2-268b4e33bb68	66916789-7b07-40f9-9df7-57c432205d9e	fa26da00-47e3-4456-8d91-ef631d37234a	Landscaper service needed in Lapu-Lapu. General service request.	2025-05-01 17:44:03.160918+00	\N	2025-07-19 20:19:25.461718+00	\N	completed	2025-08-23 13:47:01.634518+00
9e11d301-a530-4cd9-9e5e-3430320e69a8	f74860cc-f981-42b4-809d-11e92bedd14f	66916789-7b07-40f9-9df7-57c432205d9e	fa26da00-47e3-4456-8d91-ef631d37234a	Landscaper service needed in Lapu-Lapu. Urgent repair needed.	2025-02-06 09:16:07.807318+00	\N	2025-12-04 18:13:33.583318+00	\N	completed	2025-01-23 15:31:52.936918+00
3a55ea19-b24a-4985-97ba-b20360fda613	d951675f-497c-4ccb-b55d-6a72f9cfb8fc	66916789-7b07-40f9-9df7-57c432205d9e	fa26da00-47e3-4456-8d91-ef631d37234a	Landscaper service needed in Lapu-Lapu. Regular maintenance required.	2025-11-10 17:04:38.479318+00	\N	2025-10-24 16:00:25.212118+00	\N	completed	2025-11-16 05:04:48.242518+00
6eb16840-cc46-416e-bf69-925496c57257	dd3b46e4-576f-488e-928f-a5a2688e0fd4	66916789-7b07-40f9-9df7-57c432205d9e	fa26da00-47e3-4456-8d91-ef631d37234a	Landscaper service needed in Lapu-Lapu. Installation and setup.	2025-05-19 03:52:36.146518+00	\N	2025-08-02 01:31:29.119318+00	\N	completed	2025-08-09 17:52:07.519318+00
fef7163a-c112-4ca9-b2cd-7d49d82ff907	7d6e1a27-d7f8-445f-a544-81c817a39304	66916789-7b07-40f9-9df7-57c432205d9e	fa26da00-47e3-4456-8d91-ef631d37234a	Landscaper service needed in Lapu-Lapu. Inspection and consultation.	2025-05-27 22:16:34.533718+00	\N	2025-03-18 22:28:57.660118+00	\N	completed	2025-10-29 02:16:17.628118+00
24c87190-58b3-4dd2-982d-a7ea325c5c5e	088c7759-5ee8-4fd2-99fa-6d6953d6e99c	66916789-7b07-40f9-9df7-57c432205d9e	fa26da00-47e3-4456-8d91-ef631d37234a	Landscaper service needed in Lapu-Lapu. General service request.	2024-12-22 15:27:59.311318+00	\N	2025-09-15 14:52:23.157718+00	\N	completed	2025-07-11 05:50:13.989718+00
f29698e3-a157-448f-98c4-71a80e485967	dd3b46e4-576f-488e-928f-a5a2688e0fd4	68824670-6c5d-4812-8fee-2070bcdbc90c	ff8acab6-8c85-4fb8-af36-781b98920efb	Painter service needed in Davao City. Installation and setup.	2025-09-18 09:10:13.999318+00	\N	\N	\N	pending	2025-01-11 04:36:30.136918+00
c2216e7f-88c5-4fb4-aa4d-65c9eb658ec0	7d6e1a27-d7f8-445f-a544-81c817a39304	68824670-6c5d-4812-8fee-2070bcdbc90c	ff8acab6-8c85-4fb8-af36-781b98920efb	Painter service needed in Davao City. Inspection and consultation.	2025-05-26 13:58:06.914518+00	\N	2025-06-10 14:29:10.821718+00	\N	completed	2025-01-27 15:20:16.120918+00
8c6476ee-3730-44b2-81ee-d9b1f6f75f56	088c7759-5ee8-4fd2-99fa-6d6953d6e99c	68824670-6c5d-4812-8fee-2070bcdbc90c	ff8acab6-8c85-4fb8-af36-781b98920efb	Painter service needed in Davao City. General service request.	2025-06-07 00:46:46.744918+00	\N	2025-11-02 22:00:39.208918+00	\N	completed	2025-01-21 16:32:50.680918+00
7c23aebe-6401-4452-9d4a-a78e7ddaffb4	ce930397-85a0-4a2c-9d12-343341780701	68824670-6c5d-4812-8fee-2070bcdbc90c	ff8acab6-8c85-4fb8-af36-781b98920efb	Painter service needed in Davao City. Urgent repair needed.	2025-01-25 04:14:23.119318+00	\N	2025-05-11 18:26:54.943318+00	\N	completed	2025-08-01 01:22:22.380118+00
3a6ce68f-550a-484c-819d-5ed2292ef397	2637c6dd-5fbe-487c-85c5-3ef87dc74cf5	68824670-6c5d-4812-8fee-2070bcdbc90c	ff8acab6-8c85-4fb8-af36-781b98920efb	Painter service needed in Davao City. Regular maintenance required.	2025-05-23 07:10:04.437718+00	\N	2025-11-13 15:45:58.274518+00	\N	completed	2025-08-01 07:23:13.096918+00
9a59dbdb-d69e-45de-8999-bcf4e13d01ab	d4d09b07-6022-4d29-8d83-2905a67c2fb0	68824670-6c5d-4812-8fee-2070bcdbc90c	ff8acab6-8c85-4fb8-af36-781b98920efb	Painter service needed in Davao City. Installation and setup.	2025-11-20 08:36:50.037718+00	\N	2025-02-25 14:17:24.760918+00	\N	completed	2025-06-20 07:38:13.816918+00
d7997d68-63ba-4fcb-9575-1d1725152fb7	9c0e3b56-4094-4a57-b207-abb436a8fe3d	68824670-6c5d-4812-8fee-2070bcdbc90c	ff8acab6-8c85-4fb8-af36-781b98920efb	Painter service needed in Davao City. Inspection and consultation.	2025-11-06 19:03:37.970518+00	\N	2025-10-30 13:05:54.914518+00	\N	completed	2025-06-16 18:58:28.658518+00
f9f0d2e6-4c64-4fc3-abd1-c04ae022a824	6e0bbfe1-f2fd-4356-8684-bc8d8fb15a28	29fa14c5-4010-4b58-bfd0-8740da9910b6	c87b314f-ad10-4e91-b2e6-dbd8cdf13230	Plumber service needed in Cagayan de Oro. General service request.	2025-03-19 22:25:17.080918+00	\N	\N	\N	pending	2025-09-20 17:08:08.604118+00
830fb634-f7c4-4074-a790-a09529275c4c	2f6a0b4d-ff98-443f-a347-bc1c2e867bf5	29fa14c5-4010-4b58-bfd0-8740da9910b6	c87b314f-ad10-4e91-b2e6-dbd8cdf13230	Plumber service needed in Cagayan de Oro. Urgent repair needed.	2025-09-08 06:50:56.786518+00	\N	2025-09-02 03:20:28.130518+00	\N	completed	2025-01-25 03:15:12.252118+00
80e30158-2c39-4c9a-a771-908efa7b83b0	c02b1823-7eec-4776-812e-b2a42402a542	29fa14c5-4010-4b58-bfd0-8740da9910b6	c87b314f-ad10-4e91-b2e6-dbd8cdf13230	Plumber service needed in Cagayan de Oro. Regular maintenance required.	2025-01-01 09:23:07.970518+00	\N	2025-03-05 09:51:31.605718+00	\N	completed	2025-11-09 09:15:27.458518+00
eb2220fa-ca20-4b50-88c1-bc24bd5cfd0e	8568204d-bac8-4bd2-be49-666099493157	29fa14c5-4010-4b58-bfd0-8740da9910b6	c87b314f-ad10-4e91-b2e6-dbd8cdf13230	Plumber service needed in Cagayan de Oro. Installation and setup.	2025-06-03 15:02:20.181718+00	\N	2025-03-31 14:56:06.415318+00	\N	completed	2025-01-14 05:25:02.248918+00
9cd532db-5657-4a91-a774-cb8c7537d607	3505bad0-2d27-427b-ae95-3169a5838fbf	29fa14c5-4010-4b58-bfd0-8740da9910b6	c87b314f-ad10-4e91-b2e6-dbd8cdf13230	Plumber service needed in Cagayan de Oro. Inspection and consultation.	2025-12-15 03:21:36.472918+00	\N	2025-09-17 15:44:19.346518+00	\N	completed	2025-04-18 12:52:01.068118+00
0fecac51-339b-4648-997e-f41e65ed9e32	5be0cd9f-a466-4485-ac43-bdc4b104ecc0	29fa14c5-4010-4b58-bfd0-8740da9910b6	c87b314f-ad10-4e91-b2e6-dbd8cdf13230	Plumber service needed in Cagayan de Oro. General service request.	2025-05-11 15:16:53.599318+00	\N	2025-04-15 03:16:26.469718+00	\N	completed	2025-05-18 03:21:57.295318+00
b782438c-3ca2-42f6-9598-7e496e2ef9fb	ee82e0a0-0f37-4a6f-ae93-2113eddeb55c	29fa14c5-4010-4b58-bfd0-8740da9910b6	c87b314f-ad10-4e91-b2e6-dbd8cdf13230	Plumber service needed in Cagayan de Oro. Urgent repair needed.	2025-03-16 07:55:02.191318+00	\N	2025-03-16 04:21:11.964118+00	\N	completed	2025-09-18 00:55:13.567318+00
ffd51e17-db75-49b2-8a69-668e7a41df85	40ec397a-f1cf-4855-8a3a-c5673fb20e05	29fa14c5-4010-4b58-bfd0-8740da9910b6	c87b314f-ad10-4e91-b2e6-dbd8cdf13230	Plumber service needed in Cagayan de Oro. Regular maintenance required.	2025-01-08 07:16:43.519318+00	\N	2025-08-21 03:23:39.160918+00	\N	completed	2025-02-07 03:15:17.349718+00
a42954fd-3924-4764-a90a-7de19fcc4f0b	0897825a-ab99-41e9-98ba-b4ed822155a5	29fa14c5-4010-4b58-bfd0-8740da9910b6	c87b314f-ad10-4e91-b2e6-dbd8cdf13230	Plumber service needed in Cagayan de Oro. Installation and setup.	2025-07-30 18:24:54.760918+00	\N	2025-08-18 02:24:34.860118+00	\N	completed	2025-08-27 09:07:16.188118+00
95c32d8b-7311-4ebc-abeb-beb35bd58048	b19b93f9-ccf5-4b17-bdcf-a105d11018af	29fa14c5-4010-4b58-bfd0-8740da9910b6	c87b314f-ad10-4e91-b2e6-dbd8cdf13230	Plumber service needed in Cagayan de Oro. Inspection and consultation.	2025-02-07 10:54:23.743318+00	\N	2025-03-09 22:45:32.642518+00	\N	completed	2025-04-28 22:57:34.255318+00
b26a965b-6ff8-492e-b2d6-589765812e9f	6fc15c3f-2c63-4a80-b499-3744ac6c5e0a	29fa14c5-4010-4b58-bfd0-8740da9910b6	c87b314f-ad10-4e91-b2e6-dbd8cdf13230	Plumber service needed in Cagayan de Oro. General service request.	2025-03-09 12:12:46.322518+00	\N	2025-09-29 07:15:22.130518+00	\N	completed	2025-07-23 05:15:36.501718+00
ef509ba3-2fa8-4e3d-82bb-1a0139f0e889	97c5f2cc-ef11-452a-9aa3-b4705f3280f8	29fa14c5-4010-4b58-bfd0-8740da9910b6	c87b314f-ad10-4e91-b2e6-dbd8cdf13230	Plumber service needed in Cagayan de Oro. Urgent repair needed.	2025-09-14 05:41:16.927318+00	\N	2025-07-26 04:42:39.237718+00	\N	completed	2025-06-20 03:33:09.660118+00
c50991bb-7fc8-4567-a22b-adb32f3aa2a0	1be14a91-1b2c-48d6-8465-d1d4d12a785c	29fa14c5-4010-4b58-bfd0-8740da9910b6	c87b314f-ad10-4e91-b2e6-dbd8cdf13230	Plumber service needed in Cagayan de Oro. Regular maintenance required.	2025-08-30 14:00:21.007318+00	\N	2025-04-15 20:45:26.796118+00	\N	completed	2025-12-09 19:16:06.021718+00
4f2ea6f5-6bfb-4101-871e-67a3dc1b1b82	4cfa17c8-4d9f-4283-97f2-3a4976248b91	29fa14c5-4010-4b58-bfd0-8740da9910b6	c87b314f-ad10-4e91-b2e6-dbd8cdf13230	Plumber service needed in Cagayan de Oro. Installation and setup.	2025-04-01 16:43:44.642518+00	\N	2025-03-29 06:46:42.856918+00	\N	completed	2025-05-11 15:30:14.268118+00
ab6014e6-175c-4b7b-8fcf-a928d6061632	40ec397a-f1cf-4855-8a3a-c5673fb20e05	60e71417-59da-467f-9aa2-ee6d86187a69	67b073d4-c07b-4f32-97c5-d64e4797044e	Handyman service needed in Iloilo City. Regular maintenance required.	2025-04-02 14:47:41.925718+00	\N	\N	\N	pending	2025-08-17 02:31:01.327318+00
72f76ce1-75bf-4c82-97f0-f15eb02dde56	0897825a-ab99-41e9-98ba-b4ed822155a5	60e71417-59da-467f-9aa2-ee6d86187a69	67b073d4-c07b-4f32-97c5-d64e4797044e	Handyman service needed in Iloilo City. Installation and setup.	2025-11-13 04:50:54.655318+00	\N	2025-07-23 00:11:36.424918+00	\N	completed	2025-11-06 10:45:53.378518+00
ca38bb6d-30c5-458a-8f06-9b3e2805900b	b19b93f9-ccf5-4b17-bdcf-a105d11018af	60e71417-59da-467f-9aa2-ee6d86187a69	67b073d4-c07b-4f32-97c5-d64e4797044e	Handyman service needed in Iloilo City. Inspection and consultation.	2025-02-13 09:23:27.928918+00	\N	2025-03-16 06:27:56.028118+00	\N	completed	2025-10-09 15:46:12.530518+00
9f769ee3-2e16-48dc-b532-f3376bb984b1	6fc15c3f-2c63-4a80-b499-3744ac6c5e0a	60e71417-59da-467f-9aa2-ee6d86187a69	67b073d4-c07b-4f32-97c5-d64e4797044e	Handyman service needed in Iloilo City. General service request.	2024-12-23 08:18:51.333718+00	\N	2025-05-11 19:09:53.983318+00	\N	completed	2025-02-21 22:42:33.276118+00
bf39278f-def0-44a5-afed-62cb2479a8f8	97c5f2cc-ef11-452a-9aa3-b4705f3280f8	60e71417-59da-467f-9aa2-ee6d86187a69	67b073d4-c07b-4f32-97c5-d64e4797044e	Handyman service needed in Iloilo City. Urgent repair needed.	2025-07-21 23:55:07.404118+00	\N	2025-07-17 02:38:30.088918+00	\N	completed	2025-10-08 23:32:03.535318+00
a83b6d21-a145-4e49-89ce-0983c50f0807	1be14a91-1b2c-48d6-8465-d1d4d12a785c	60e71417-59da-467f-9aa2-ee6d86187a69	67b073d4-c07b-4f32-97c5-d64e4797044e	Handyman service needed in Iloilo City. Regular maintenance required.	2025-08-19 16:30:38.229718+00	\N	2025-06-24 17:13:19.212118+00	\N	completed	2025-06-09 11:33:01.423318+00
6429f6e6-eebc-4f8a-b72b-96dcefbb82fc	4cfa17c8-4d9f-4283-97f2-3a4976248b91	60e71417-59da-467f-9aa2-ee6d86187a69	67b073d4-c07b-4f32-97c5-d64e4797044e	Handyman service needed in Iloilo City. Installation and setup.	2025-06-25 14:57:05.685718+00	\N	2025-07-08 12:51:03.784918+00	\N	completed	2025-12-11 06:36:40.735318+00
96ea2814-1c04-4815-aa68-04552fc7d9e0	57dfd528-5470-40a1-8fde-40eb61dd7ae1	60e71417-59da-467f-9aa2-ee6d86187a69	67b073d4-c07b-4f32-97c5-d64e4797044e	Handyman service needed in Iloilo City. Inspection and consultation.	2025-06-13 03:57:50.296918+00	\N	2025-08-04 01:46:53.340118+00	\N	completed	2025-08-13 01:14:41.608918+00
8a2f5058-369a-49f6-99f1-547efdc1651b	3cc9e6b9-d7d7-4d91-904b-65aeb230b14b	60e71417-59da-467f-9aa2-ee6d86187a69	67b073d4-c07b-4f32-97c5-d64e4797044e	Handyman service needed in Iloilo City. General service request.	2025-10-11 20:40:40.812118+00	\N	2025-04-11 18:26:14.508118+00	\N	completed	2025-04-27 06:51:02.488918+00
76097a5f-3619-406b-8654-0bc45d8c7e96	ff8bb61b-1117-4f5c-880b-ac4ebd7ea6c2	60e71417-59da-467f-9aa2-ee6d86187a69	67b073d4-c07b-4f32-97c5-d64e4797044e	Handyman service needed in Iloilo City. Urgent repair needed.	2025-08-13 22:14:04.629718+00	\N	2025-10-29 15:50:29.484118+00	\N	completed	2025-02-19 21:21:21.439318+00
1bda6bb0-1556-43c6-a218-a718bba5e5b7	feaac7e1-3bc3-4462-b2f8-b4a19f990531	60e71417-59da-467f-9aa2-ee6d86187a69	67b073d4-c07b-4f32-97c5-d64e4797044e	Handyman service needed in Iloilo City. Regular maintenance required.	2025-01-02 20:00:06.751318+00	\N	2025-09-25 10:19:37.615318+00	\N	completed	2025-08-08 12:13:06.885718+00
c4a1c0d1-12a0-44de-9427-552e575b186d	57dfd528-5470-40a1-8fde-40eb61dd7ae1	b77c81a6-a8a9-42e0-acc8-ce1ce2d92bf7	19a03c30-e580-4bda-bec4-d59fb737e8e0	Carpenter service needed in Baguio. Inspection and consultation.	2025-01-22 17:40:58.783318+00	\N	\N	\N	pending	2025-08-03 23:48:20.978518+00
75061fe7-756e-4220-8ba9-91553296d6c6	3cc9e6b9-d7d7-4d91-904b-65aeb230b14b	b77c81a6-a8a9-42e0-acc8-ce1ce2d92bf7	19a03c30-e580-4bda-bec4-d59fb737e8e0	Carpenter service needed in Baguio. General service request.	2025-03-30 11:31:50.229718+00	\N	2025-07-05 13:37:54.722518+00	\N	completed	2025-05-02 13:50:00.741718+00
4071ec24-6812-42c4-8952-0820551f1b45	ff8bb61b-1117-4f5c-880b-ac4ebd7ea6c2	b77c81a6-a8a9-42e0-acc8-ce1ce2d92bf7	19a03c30-e580-4bda-bec4-d59fb737e8e0	Carpenter service needed in Baguio. Urgent repair needed.	2025-04-13 12:19:28.773718+00	\N	2025-12-13 10:38:12.002518+00	\N	completed	2025-08-07 23:03:58.562518+00
a9bea133-1f6b-415e-ab29-7efea7fc87af	feaac7e1-3bc3-4462-b2f8-b4a19f990531	b77c81a6-a8a9-42e0-acc8-ce1ce2d92bf7	19a03c30-e580-4bda-bec4-d59fb737e8e0	Carpenter service needed in Baguio. Regular maintenance required.	2025-05-29 22:40:44.671318+00	\N	2025-12-13 02:12:20.028118+00	\N	completed	2025-01-22 14:13:08.498518+00
a36a3306-5270-4af0-a10f-250b55a58065	8d3c4c94-5ab8-4070-a7cc-a12e88219bf3	b77c81a6-a8a9-42e0-acc8-ce1ce2d92bf7	19a03c30-e580-4bda-bec4-d59fb737e8e0	Carpenter service needed in Baguio. Installation and setup.	2025-09-26 13:47:38.613718+00	\N	2025-04-03 23:09:27.573718+00	\N	completed	2025-01-07 03:23:20.930518+00
ee899c13-713c-4961-813a-b4996817c9d8	158e9458-44c9-4638-83b9-bf0c99bdb64a	b77c81a6-a8a9-42e0-acc8-ce1ce2d92bf7	19a03c30-e580-4bda-bec4-d59fb737e8e0	Carpenter service needed in Baguio. Inspection and consultation.	2025-02-17 10:15:21.007318+00	\N	2025-11-02 06:26:27.640918+00	\N	completed	2025-04-27 03:54:37.711318+00
855ba14c-c2d3-49ed-9b04-7680deffda73	503f2221-11c2-4415-9a5b-9b0e81e95b67	b77c81a6-a8a9-42e0-acc8-ce1ce2d92bf7	19a03c30-e580-4bda-bec4-d59fb737e8e0	Carpenter service needed in Baguio. General service request.	2025-09-26 04:49:03.976918+00	\N	2025-12-04 13:02:27.727318+00	\N	completed	2024-12-26 13:23:20.786518+00
793dcfb2-dde5-49be-b102-71b1c276d376	5eae5e90-1914-41e5-be8a-aef4314d4892	b77c81a6-a8a9-42e0-acc8-ce1ce2d92bf7	19a03c30-e580-4bda-bec4-d59fb737e8e0	Carpenter service needed in Baguio. Urgent repair needed.	2025-07-19 19:27:49.317718+00	\N	2025-04-25 12:40:41.186518+00	\N	completed	2025-03-18 14:51:16.370518+00
973b318d-afbe-45f8-8388-31a449119583	5eae5e90-1914-41e5-be8a-aef4314d4892	8dfa3373-45d8-448e-a3b5-4d1dfec4ba2f	2fd74584-4526-428d-b506-d92de93f45b1	Electrician service needed in Manila. Urgent repair needed.	2025-07-12 17:46:05.762518+00	\N	\N	\N	pending	2025-01-16 23:32:54.252118+00
ee1170f6-dee1-49f0-aaf7-6f01ee52361e	4893cb6b-0ffd-422a-b940-7b9201daa34f	8dfa3373-45d8-448e-a3b5-4d1dfec4ba2f	2fd74584-4526-428d-b506-d92de93f45b1	Electrician service needed in Manila. Regular maintenance required.	2025-02-26 19:59:48.348118+00	\N	2025-10-13 02:51:59.052118+00	\N	completed	2025-02-04 11:21:38.431318+00
47ce87fa-feca-436d-9865-829b960cdfa1	218a9cdd-7d3a-44c9-bd7a-d885d38d6063	8dfa3373-45d8-448e-a3b5-4d1dfec4ba2f	2fd74584-4526-428d-b506-d92de93f45b1	Electrician service needed in Manila. Installation and setup.	2025-03-22 08:58:58.783318+00	\N	2025-05-27 06:58:55.442518+00	\N	completed	2025-02-16 20:50:18.223318+00
e2eecfbc-63e6-4021-931c-16296575e811	4eea189c-607a-466d-8f92-1f53d790fb6f	8dfa3373-45d8-448e-a3b5-4d1dfec4ba2f	2fd74584-4526-428d-b506-d92de93f45b1	Electrician service needed in Manila. Inspection and consultation.	2025-03-23 17:33:34.687318+00	\N	2025-03-31 07:13:49.941718+00	\N	completed	2025-05-02 18:57:13.576918+00
d5870e35-8c96-4a3f-8ed4-081386ec54bb	5c74fdb2-b4d9-4f4b-9c6c-f6b72854db84	8dfa3373-45d8-448e-a3b5-4d1dfec4ba2f	2fd74584-4526-428d-b506-d92de93f45b1	Electrician service needed in Manila. General service request.	2025-06-25 04:24:24.722518+00	\N	2025-05-21 01:26:15.573718+00	\N	completed	2025-04-03 04:34:47.752918+00
aa22855d-39f7-45db-8342-9e5d4b440d85	a3563a32-75c5-4d0b-b672-9f548fe69a06	5f5145a0-1827-46fd-b44f-6b2a7170d6a9	8a10c3b6-f3d9-4e9d-89c3-0e47b7c652d0	Roofer service needed in Quezon City. Installation and setup.	2025-10-11 17:42:54.213718+00	\N	\N	\N	pending	2024-12-31 01:21:53.090518+00
09b79a2f-a261-4f5a-b139-7df6ed8aa484	5fcd65e1-d364-4762-a7e2-9939ef039247	5f5145a0-1827-46fd-b44f-6b2a7170d6a9	8a10c3b6-f3d9-4e9d-89c3-0e47b7c652d0	Roofer service needed in Quezon City. Inspection and consultation.	2025-02-02 20:31:30.876118+00	\N	\N	\N	canceled	2025-09-26 08:41:16.495318+00
afcc9389-8dfc-49c5-8f70-1bbc77ad12af	649a4947-627c-43f2-9c5e-b75f213a0d93	5f5145a0-1827-46fd-b44f-6b2a7170d6a9	8a10c3b6-f3d9-4e9d-89c3-0e47b7c652d0	Roofer service needed in Quezon City. General service request.	2025-09-29 03:01:46.312918+00	\N	2025-06-16 15:36:45.573718+00	\N	completed	2025-09-20 17:15:27.084118+00
dd1eedc6-a93d-43ce-89e6-0a4f3564caae	3c6ff2a2-e59e-48af-8a8e-9238dc49ecc6	5f5145a0-1827-46fd-b44f-6b2a7170d6a9	8a10c3b6-f3d9-4e9d-89c3-0e47b7c652d0	Roofer service needed in Quezon City. Urgent repair needed.	2025-11-25 23:06:36.847318+00	\N	2025-07-18 11:22:53.340118+00	\N	completed	2025-02-18 05:41:40.341718+00
15779e7f-77d1-4357-9ba7-744e63507125	496d267d-f0aa-4592-a87a-bd69e1196f23	5f5145a0-1827-46fd-b44f-6b2a7170d6a9	8a10c3b6-f3d9-4e9d-89c3-0e47b7c652d0	Roofer service needed in Quezon City. Regular maintenance required.	2025-08-26 01:17:57.045718+00	\N	2025-03-17 03:13:46.543318+00	\N	completed	2025-11-23 17:07:56.594518+00
49b1bae4-c2c0-4f89-9da8-fa64cbcb7925	5c328f75-464c-4053-a41e-00fbc6eba934	5f5145a0-1827-46fd-b44f-6b2a7170d6a9	8a10c3b6-f3d9-4e9d-89c3-0e47b7c652d0	Roofer service needed in Quezon City. Installation and setup.	2025-02-28 15:57:57.813718+00	\N	2025-12-18 20:42:04.015318+00	\N	completed	2025-06-01 19:13:34.130518+00
7f486f13-23fb-4264-9ff3-0aac1fae9f56	bed6bf7a-bfbb-4eac-b6d7-35ca3e7d6660	5f5145a0-1827-46fd-b44f-6b2a7170d6a9	8a10c3b6-f3d9-4e9d-89c3-0e47b7c652d0	Roofer service needed in Quezon City. Inspection and consultation.	2025-02-05 03:06:06.290518+00	\N	2025-06-25 13:08:12.463318+00	\N	completed	2025-05-25 22:16:03.516118+00
ad14c88c-7d59-48ea-a0ad-fcdab3ed9ecd	549f87d2-961e-48f8-bcff-7286d7db879e	5f5145a0-1827-46fd-b44f-6b2a7170d6a9	8a10c3b6-f3d9-4e9d-89c3-0e47b7c652d0	Roofer service needed in Quezon City. General service request.	2025-10-15 08:16:10.975318+00	\N	2025-06-26 01:01:41.416918+00	\N	completed	2025-01-23 03:14:03.045718+00
947d8ef7-25bc-4811-9e2c-479412e54853	a8957421-6c24-4110-ad8a-89513c6cfe93	5f5145a0-1827-46fd-b44f-6b2a7170d6a9	8a10c3b6-f3d9-4e9d-89c3-0e47b7c652d0	Roofer service needed in Quezon City. Urgent repair needed.	2025-01-24 19:15:30.252118+00	\N	2025-03-26 21:49:03.861718+00	\N	completed	2025-11-03 06:14:54.453718+00
e253c033-0f32-4be2-9de6-602d1fca213d	ded07a3d-2dc7-40f1-a9df-81b72c989abf	5f5145a0-1827-46fd-b44f-6b2a7170d6a9	8a10c3b6-f3d9-4e9d-89c3-0e47b7c652d0	Roofer service needed in Quezon City. Regular maintenance required.	2025-01-11 03:56:09.036118+00	\N	2025-06-21 04:48:03.237718+00	\N	completed	2025-06-16 08:07:45.794518+00
dffd1467-924c-434b-8277-d98caf3d72db	f97cfaac-5a4e-420a-a445-9776c13600b8	5f5145a0-1827-46fd-b44f-6b2a7170d6a9	8a10c3b6-f3d9-4e9d-89c3-0e47b7c652d0	Roofer service needed in Quezon City. Installation and setup.	2025-05-05 07:07:40.581718+00	\N	2025-05-26 18:11:46.706518+00	\N	completed	2024-12-24 13:31:56.335318+00
cbadf3c7-04ee-4676-9642-f9b969d1ed2e	2594b276-c01e-4543-b2b5-0cd20667b7a6	5f5145a0-1827-46fd-b44f-6b2a7170d6a9	8a10c3b6-f3d9-4e9d-89c3-0e47b7c652d0	Roofer service needed in Quezon City. Inspection and consultation.	2025-06-18 02:03:32.988118+00	\N	2025-06-15 15:59:26.114518+00	\N	completed	2025-11-29 13:15:40.533718+00
bcf9efc4-e7b7-44b6-80d4-0f71d39e8de6	549f87d2-961e-48f8-bcff-7286d7db879e	bf42a091-8815-4f72-bf8d-6f3bdb13e3c6	45138e1c-7f74-4a2e-b43c-86f41855fac4	HVAC Technician service needed in Makati. General service request.	2025-06-12 10:48:44.191318+00	\N	\N	\N	pending	2025-08-01 07:51:11.676118+00
41e6ce07-ec85-4535-b2d9-22b065a28329	a8957421-6c24-4110-ad8a-89513c6cfe93	bf42a091-8815-4f72-bf8d-6f3bdb13e3c6	45138e1c-7f74-4a2e-b43c-86f41855fac4	HVAC Technician service needed in Makati. Urgent repair needed.	2025-08-05 17:39:26.162518+00	\N	2025-07-18 00:34:41.848918+00	\N	completed	2025-08-07 21:32:41.407318+00
c431e91e-69c3-4c96-a315-11b8707eec3d	ded07a3d-2dc7-40f1-a9df-81b72c989abf	bf42a091-8815-4f72-bf8d-6f3bdb13e3c6	45138e1c-7f74-4a2e-b43c-86f41855fac4	HVAC Technician service needed in Makati. Regular maintenance required.	2025-03-22 03:50:25.509718+00	\N	2025-03-26 18:44:43.538518+00	\N	completed	2025-03-29 12:35:12.866518+00
68551738-8aed-4917-a4f5-28bcf0106b42	f97cfaac-5a4e-420a-a445-9776c13600b8	bf42a091-8815-4f72-bf8d-6f3bdb13e3c6	45138e1c-7f74-4a2e-b43c-86f41855fac4	HVAC Technician service needed in Makati. Installation and setup.	2025-08-22 10:20:11.656918+00	\N	2025-06-29 09:10:44.066518+00	\N	completed	2025-08-03 05:28:02.392918+00
c3780a77-9f46-40bf-8637-9bc3f2fa4089	2594b276-c01e-4543-b2b5-0cd20667b7a6	bf42a091-8815-4f72-bf8d-6f3bdb13e3c6	45138e1c-7f74-4a2e-b43c-86f41855fac4	HVAC Technician service needed in Makati. Inspection and consultation.	2025-08-01 21:05:45.813718+00	\N	2025-11-24 18:54:37.452118+00	\N	completed	2025-09-18 19:38:52.956118+00
fce46d8e-42f1-435d-825d-d59a1a7b388f	216ebdf7-cd45-4b40-86f2-268b4e33bb68	bf42a091-8815-4f72-bf8d-6f3bdb13e3c6	45138e1c-7f74-4a2e-b43c-86f41855fac4	HVAC Technician service needed in Makati. General service request.	2025-01-17 19:34:17.512918+00	\N	2025-07-12 18:10:26.354518+00	\N	completed	2025-01-19 10:25:26.066518+00
9fb9ee5e-5778-476b-b663-0748b21b0b9f	f74860cc-f981-42b4-809d-11e92bedd14f	bf42a091-8815-4f72-bf8d-6f3bdb13e3c6	45138e1c-7f74-4a2e-b43c-86f41855fac4	HVAC Technician service needed in Makati. Urgent repair needed.	2025-07-28 10:44:15.573718+00	\N	2025-11-30 16:23:34.351318+00	\N	completed	2025-06-09 21:19:03.544918+00
c30130ea-572f-445d-b5fb-c6d3ed7fc557	d951675f-497c-4ccb-b55d-6a72f9cfb8fc	bf42a091-8815-4f72-bf8d-6f3bdb13e3c6	45138e1c-7f74-4a2e-b43c-86f41855fac4	HVAC Technician service needed in Makati. Regular maintenance required.	2025-02-13 04:41:34.610518+00	\N	2025-08-31 12:29:38.584918+00	\N	completed	2025-07-25 03:17:48.290518+00
cf9c1c4d-34a3-49d1-a66c-0f5561ee5b38	dd3b46e4-576f-488e-928f-a5a2688e0fd4	bf42a091-8815-4f72-bf8d-6f3bdb13e3c6	45138e1c-7f74-4a2e-b43c-86f41855fac4	HVAC Technician service needed in Makati. Installation and setup.	2025-08-15 10:38:08.719318+00	\N	2025-09-13 10:41:25.452118+00	\N	completed	2025-04-17 04:48:33.823318+00
aa327d37-2d62-4f9e-8fa2-f5688d8c58d2	d951675f-497c-4ccb-b55d-6a72f9cfb8fc	ad584595-9c2b-4d07-ad8c-59481f88ac28	8ec0536f-dc92-40ba-87d8-f60e42a55db6	Cleaner service needed in Taguig. Regular maintenance required.	2025-04-07 09:15:57.007318+00	\N	\N	\N	pending	2025-04-05 02:36:39.237718+00
a743ccf5-31b5-4970-a3ed-8dcfa1056c4d	dd3b46e4-576f-488e-928f-a5a2688e0fd4	ad584595-9c2b-4d07-ad8c-59481f88ac28	8ec0536f-dc92-40ba-87d8-f60e42a55db6	Cleaner service needed in Taguig. Installation and setup.	2025-09-09 17:32:06.386518+00	\N	2025-05-26 19:40:08.815318+00	\N	completed	2025-03-23 17:00:16.687318+00
e401e28b-2d45-43e4-8537-38854ee0d446	7d6e1a27-d7f8-445f-a544-81c817a39304	ad584595-9c2b-4d07-ad8c-59481f88ac28	8ec0536f-dc92-40ba-87d8-f60e42a55db6	Cleaner service needed in Taguig. Inspection and consultation.	2025-03-15 22:20:02.844118+00	\N	2025-05-04 22:45:12.079318+00	\N	completed	2025-05-16 16:22:28.255318+00
9d130ca4-2776-4398-a538-c2f40ad8cec9	088c7759-5ee8-4fd2-99fa-6d6953d6e99c	ad584595-9c2b-4d07-ad8c-59481f88ac28	8ec0536f-dc92-40ba-87d8-f60e42a55db6	Cleaner service needed in Taguig. General service request.	2025-09-29 03:34:40.552918+00	\N	2025-08-28 12:54:34.946518+00	\N	completed	2025-02-04 16:44:12.290518+00
3e02e876-e97a-458f-9d08-e02cdb9ed046	ce930397-85a0-4a2c-9d12-343341780701	ad584595-9c2b-4d07-ad8c-59481f88ac28	8ec0536f-dc92-40ba-87d8-f60e42a55db6	Cleaner service needed in Taguig. Urgent repair needed.	2025-08-21 21:26:05.781718+00	\N	2025-12-04 08:04:27.333718+00	\N	completed	2025-02-28 00:42:12.165718+00
2d167a4e-678d-46df-99d5-c82a60c366c6	2637c6dd-5fbe-487c-85c5-3ef87dc74cf5	ad584595-9c2b-4d07-ad8c-59481f88ac28	8ec0536f-dc92-40ba-87d8-f60e42a55db6	Cleaner service needed in Taguig. Regular maintenance required.	2025-06-02 15:07:05.388118+00	\N	2025-05-09 23:19:41.100118+00	\N	completed	2025-01-15 20:23:56.757718+00
4ac168cf-2f98-4f87-b8bc-50322b8d9adc	9c0e3b56-4094-4a57-b207-abb436a8fe3d	44aa15b3-b26c-4a83-b592-91adddfc9f9a	368f7187-4490-4015-84fa-20a4f46eea09	Locksmith service needed in Pasig. Inspection and consultation.	2025-09-26 05:21:07.068118+00	\N	\N	\N	pending	2025-03-06 04:10:40.812118+00
314a24a2-5fe8-4041-bc61-0dbfe46667c5	6e0bbfe1-f2fd-4356-8684-bc8d8fb15a28	44aa15b3-b26c-4a83-b592-91adddfc9f9a	368f7187-4490-4015-84fa-20a4f46eea09	Locksmith service needed in Pasig. General service request.	2025-06-29 07:28:43.144918+00	\N	\N	\N	canceled	2025-01-19 08:25:47.436118+00
6da43867-f49e-4565-8479-0f10d281220e	2f6a0b4d-ff98-443f-a347-bc1c2e867bf5	44aa15b3-b26c-4a83-b592-91adddfc9f9a	368f7187-4490-4015-84fa-20a4f46eea09	Locksmith service needed in Pasig. Urgent repair needed.	2025-10-07 09:42:09.573718+00	\N	2025-12-10 16:46:31.826518+00	\N	completed	2025-02-01 16:46:08.152918+00
f3d2272b-39e3-4abd-9a3d-2b1ff3bd27b2	c02b1823-7eec-4776-812e-b2a42402a542	44aa15b3-b26c-4a83-b592-91adddfc9f9a	368f7187-4490-4015-84fa-20a4f46eea09	Locksmith service needed in Pasig. Regular maintenance required.	2025-08-09 22:52:55.010518+00	\N	2025-09-18 13:56:26.431318+00	\N	completed	2025-09-07 08:19:04.725718+00
c0c7fa21-b191-49d4-921b-9f611364aced	8568204d-bac8-4bd2-be49-666099493157	44aa15b3-b26c-4a83-b592-91adddfc9f9a	368f7187-4490-4015-84fa-20a4f46eea09	Locksmith service needed in Pasig. Installation and setup.	2025-10-22 12:42:45.948118+00	\N	2025-04-13 22:59:31.327318+00	\N	completed	2025-02-15 18:01:50.805718+00
55b90a3e-b3e7-40ef-80aa-51398631dd99	3505bad0-2d27-427b-ae95-3169a5838fbf	44aa15b3-b26c-4a83-b592-91adddfc9f9a	368f7187-4490-4015-84fa-20a4f46eea09	Locksmith service needed in Pasig. Inspection and consultation.	2025-10-03 06:51:47.416918+00	\N	2025-06-05 14:55:56.479318+00	\N	completed	2025-08-16 01:19:21.631318+00
b0bab2c7-63ee-4808-a3ba-de1137aca41d	5be0cd9f-a466-4485-ac43-bdc4b104ecc0	44aa15b3-b26c-4a83-b592-91adddfc9f9a	368f7187-4490-4015-84fa-20a4f46eea09	Locksmith service needed in Pasig. General service request.	2025-06-27 07:02:01.634518+00	\N	2025-09-22 22:45:46.725718+00	\N	completed	2025-07-24 20:20:38.988118+00
7713933b-2a02-4253-9199-4db713b060d2	ee82e0a0-0f37-4a6f-ae93-2113eddeb55c	44aa15b3-b26c-4a83-b592-91adddfc9f9a	368f7187-4490-4015-84fa-20a4f46eea09	Locksmith service needed in Pasig. Urgent repair needed.	2025-08-10 07:37:30.184918+00	\N	2025-09-10 16:08:43.308118+00	\N	completed	2025-09-28 00:19:57.458518+00
d52904d0-3c59-4210-95e4-9ab729eee958	40ec397a-f1cf-4855-8a3a-c5673fb20e05	44aa15b3-b26c-4a83-b592-91adddfc9f9a	368f7187-4490-4015-84fa-20a4f46eea09	Locksmith service needed in Pasig. Regular maintenance required.	2025-11-10 22:07:38.680918+00	\N	2025-03-08 01:20:40.514518+00	\N	completed	2025-05-18 00:30:10.380118+00
903ef485-9423-434f-9ddf-5adc36815ca5	0897825a-ab99-41e9-98ba-b4ed822155a5	44aa15b3-b26c-4a83-b592-91adddfc9f9a	368f7187-4490-4015-84fa-20a4f46eea09	Locksmith service needed in Pasig. Installation and setup.	2025-12-01 05:40:19.471318+00	\N	2025-07-30 05:59:06.991318+00	\N	completed	2025-03-14 00:42:33.074518+00
6592d757-eaf2-468d-b790-378be21341f5	b19b93f9-ccf5-4b17-bdcf-a105d11018af	44aa15b3-b26c-4a83-b592-91adddfc9f9a	368f7187-4490-4015-84fa-20a4f46eea09	Locksmith service needed in Pasig. Inspection and consultation.	2025-11-01 08:09:26.968918+00	\N	2025-02-25 11:31:48.501718+00	\N	completed	2025-08-15 14:31:43.749718+00
df70cffb-5543-4f19-b99c-ad0bd15f74a5	6fc15c3f-2c63-4a80-b499-3744ac6c5e0a	44aa15b3-b26c-4a83-b592-91adddfc9f9a	368f7187-4490-4015-84fa-20a4f46eea09	Locksmith service needed in Pasig. General service request.	2025-01-22 17:34:55.903318+00	\N	2025-10-23 13:43:30.732118+00	\N	completed	2025-08-31 13:01:05.474518+00
96b5a9ea-8f7c-4a62-9d99-c05159dcb17c	97c5f2cc-ef11-452a-9aa3-b4705f3280f8	44aa15b3-b26c-4a83-b592-91adddfc9f9a	368f7187-4490-4015-84fa-20a4f46eea09	Locksmith service needed in Pasig. Urgent repair needed.	2024-12-21 21:35:22.543318+00	\N	2025-06-17 17:33:46.696918+00	\N	completed	2025-02-18 17:35:32.796118+00
bbb2787d-ed6a-48ed-9d50-293cd20a647d	ee82e0a0-0f37-4a6f-ae93-2113eddeb55c	63c0a431-ca11-4691-96b4-900155ce869b	fa26da00-47e3-4456-8d91-ef631d37234a	Landscaper service needed in Cebu City. Urgent repair needed.	2025-12-09 18:05:09.266518+00	\N	\N	\N	pending	2025-12-18 17:26:31.068118+00
ea1979c9-2a9b-462b-ad44-d0c13de3b65a	40ec397a-f1cf-4855-8a3a-c5673fb20e05	63c0a431-ca11-4691-96b4-900155ce869b	fa26da00-47e3-4456-8d91-ef631d37234a	Landscaper service needed in Cebu City. Regular maintenance required.	2025-01-13 22:23:05.925718+00	\N	2025-03-24 00:02:03.247318+00	\N	completed	2025-01-17 06:52:20.335318+00
b7e7f8ef-78b1-4624-9f3f-136c1248d771	0897825a-ab99-41e9-98ba-b4ed822155a5	63c0a431-ca11-4691-96b4-900155ce869b	fa26da00-47e3-4456-8d91-ef631d37234a	Landscaper service needed in Cebu City. Installation and setup.	2025-04-28 19:40:41.301718+00	\N	2025-10-13 14:24:41.512918+00	\N	completed	2025-08-07 05:35:34.696918+00
478186e7-0256-4682-b810-74d8e8143efe	b19b93f9-ccf5-4b17-bdcf-a105d11018af	63c0a431-ca11-4691-96b4-900155ce869b	fa26da00-47e3-4456-8d91-ef631d37234a	Landscaper service needed in Cebu City. Inspection and consultation.	2025-11-22 14:29:21.448918+00	\N	2025-11-20 10:23:22.687318+00	\N	completed	2025-05-21 08:07:40.264918+00
2ae97807-7c76-4c4d-9208-a7eed8cf757c	6fc15c3f-2c63-4a80-b499-3744ac6c5e0a	63c0a431-ca11-4691-96b4-900155ce869b	fa26da00-47e3-4456-8d91-ef631d37234a	Landscaper service needed in Cebu City. General service request.	2025-01-03 03:50:30.866518+00	\N	2025-10-14 00:38:58.716118+00	\N	completed	2025-03-27 18:03:17.896918+00
45c8c9ce-3595-4278-89ab-18ebe413d912	97c5f2cc-ef11-452a-9aa3-b4705f3280f8	63c0a431-ca11-4691-96b4-900155ce869b	fa26da00-47e3-4456-8d91-ef631d37234a	Landscaper service needed in Cebu City. Urgent repair needed.	2025-04-30 11:15:01.596118+00	\N	2025-10-10 04:18:20.287318+00	\N	completed	2025-02-21 09:15:12.943318+00
cba1b923-6b1a-4a9a-90f1-fe877fbf54d0	1be14a91-1b2c-48d6-8465-d1d4d12a785c	63c0a431-ca11-4691-96b4-900155ce869b	fa26da00-47e3-4456-8d91-ef631d37234a	Landscaper service needed in Cebu City. Regular maintenance required.	2025-05-19 17:11:03.996118+00	\N	2025-11-21 07:37:14.373718+00	\N	completed	2025-09-10 22:31:38.104918+00
ca5b34da-0aee-485a-a526-5d056246a573	4cfa17c8-4d9f-4283-97f2-3a4976248b91	63c0a431-ca11-4691-96b4-900155ce869b	fa26da00-47e3-4456-8d91-ef631d37234a	Landscaper service needed in Cebu City. Installation and setup.	2025-01-03 09:34:56.968918+00	\N	2025-12-19 06:01:13.912918+00	\N	completed	2025-03-24 01:48:22.936918+00
f468f796-d5d6-4ca0-adad-f3739791803c	57dfd528-5470-40a1-8fde-40eb61dd7ae1	63c0a431-ca11-4691-96b4-900155ce869b	fa26da00-47e3-4456-8d91-ef631d37234a	Landscaper service needed in Cebu City. Inspection and consultation.	2025-03-11 01:07:54.146518+00	\N	2025-09-16 05:04:25.346518+00	\N	completed	2025-05-07 04:18:12.424918+00
d4d87618-d911-48aa-a2d4-12536a0b39fd	3cc9e6b9-d7d7-4d91-904b-65aeb230b14b	63c0a431-ca11-4691-96b4-900155ce869b	fa26da00-47e3-4456-8d91-ef631d37234a	Landscaper service needed in Cebu City. General service request.	2025-03-02 14:49:51.525718+00	\N	2025-03-03 21:27:01.768918+00	\N	completed	2025-12-04 17:40:43.922518+00
12eed2a2-d460-4ef2-a1fe-7c18d0efdc98	4cfa17c8-4d9f-4283-97f2-3a4976248b91	5b57cd3c-d7ec-4e25-83a9-20bcadbb2f1c	ff8acab6-8c85-4fb8-af36-781b98920efb	Painter service needed in Mandaue City. Installation and setup.	2025-08-17 19:33:43.644118+00	\N	\N	\N	pending	2025-10-17 00:20:42.559318+00
7687315e-e5d2-45e9-a179-05ac1f8ce967	57dfd528-5470-40a1-8fde-40eb61dd7ae1	5b57cd3c-d7ec-4e25-83a9-20bcadbb2f1c	ff8acab6-8c85-4fb8-af36-781b98920efb	Painter service needed in Mandaue City. Inspection and consultation.	2025-03-23 10:37:09.103318+00	\N	2025-02-27 15:16:23.445718+00	\N	completed	2025-03-16 19:17:18.943318+00
4c7b745b-5c3a-48cc-a5d1-2f3be30f2f64	3cc9e6b9-d7d7-4d91-904b-65aeb230b14b	5b57cd3c-d7ec-4e25-83a9-20bcadbb2f1c	ff8acab6-8c85-4fb8-af36-781b98920efb	Painter service needed in Mandaue City. General service request.	2025-12-13 04:16:57.602518+00	\N	2025-03-24 07:02:45.525718+00	\N	completed	2025-05-27 11:12:35.148118+00
55b52838-d015-485b-b292-6d06ff5ab696	ff8bb61b-1117-4f5c-880b-ac4ebd7ea6c2	5b57cd3c-d7ec-4e25-83a9-20bcadbb2f1c	ff8acab6-8c85-4fb8-af36-781b98920efb	Painter service needed in Mandaue City. Urgent repair needed.	2025-06-02 13:40:33.871318+00	\N	2025-07-04 05:08:05.493718+00	\N	completed	2024-12-21 02:48:19.336918+00
bbbc4ace-5215-4534-ae63-cdbabee673ce	feaac7e1-3bc3-4462-b2f8-b4a19f990531	5b57cd3c-d7ec-4e25-83a9-20bcadbb2f1c	ff8acab6-8c85-4fb8-af36-781b98920efb	Painter service needed in Mandaue City. Regular maintenance required.	2025-01-24 03:57:26.709718+00	\N	2025-09-06 19:23:33.660118+00	\N	completed	2025-06-13 17:23:51.400918+00
f57f8a63-d79b-4951-bd13-38a8a3a23707	8d3c4c94-5ab8-4070-a7cc-a12e88219bf3	5b57cd3c-d7ec-4e25-83a9-20bcadbb2f1c	ff8acab6-8c85-4fb8-af36-781b98920efb	Painter service needed in Mandaue City. Installation and setup.	2025-06-29 23:58:41.589718+00	\N	2025-09-17 18:06:14.930518+00	\N	completed	2025-04-14 11:54:28.437718+00
860e19d2-0c9d-4ed2-acc4-1746039092ca	158e9458-44c9-4638-83b9-bf0c99bdb64a	5b57cd3c-d7ec-4e25-83a9-20bcadbb2f1c	ff8acab6-8c85-4fb8-af36-781b98920efb	Painter service needed in Mandaue City. Inspection and consultation.	2025-08-29 21:57:54.184918+00	\N	2025-07-11 02:40:47.637718+00	\N	completed	2025-10-26 09:11:17.762518+00
52b1083a-19c1-44ed-a6d5-61793906e909	503f2221-11c2-4415-9a5b-9b0e81e95b67	247b80be-b7dc-4582-aa28-5dd8888d8c53	c87b314f-ad10-4e91-b2e6-dbd8cdf13230	Plumber service needed in Lapu-Lapu. General service request.	2025-10-16 01:02:01.720918+00	\N	\N	\N	pending	2025-06-24 10:41:51.285718+00
9bcb7a33-efea-413a-bd74-7aae2c84ced0	5eae5e90-1914-41e5-be8a-aef4314d4892	247b80be-b7dc-4582-aa28-5dd8888d8c53	c87b314f-ad10-4e91-b2e6-dbd8cdf13230	Plumber service needed in Lapu-Lapu. Urgent repair needed.	2025-06-03 03:45:02.200918+00	\N	2025-11-11 18:33:43.874518+00	\N	completed	2025-06-07 11:06:07.644118+00
d3ce48ec-661c-4345-b73a-32014f431277	4893cb6b-0ffd-422a-b940-7b9201daa34f	247b80be-b7dc-4582-aa28-5dd8888d8c53	c87b314f-ad10-4e91-b2e6-dbd8cdf13230	Plumber service needed in Lapu-Lapu. Regular maintenance required.	2025-10-12 19:59:57.765718+00	\N	2025-03-23 07:18:03.007318+00	\N	completed	2025-05-26 14:20:20.584918+00
1ffd4dd4-5f65-40bd-9073-da5d8a847b70	218a9cdd-7d3a-44c9-bd7a-d885d38d6063	247b80be-b7dc-4582-aa28-5dd8888d8c53	c87b314f-ad10-4e91-b2e6-dbd8cdf13230	Plumber service needed in Lapu-Lapu. Installation and setup.	2025-04-06 05:06:34.687318+00	\N	2025-07-30 03:26:24.789718+00	\N	completed	2025-04-21 21:35:13.125718+00
c4791450-c963-4740-a40d-250481a99d7a	4eea189c-607a-466d-8f92-1f53d790fb6f	247b80be-b7dc-4582-aa28-5dd8888d8c53	c87b314f-ad10-4e91-b2e6-dbd8cdf13230	Plumber service needed in Lapu-Lapu. Inspection and consultation.	2025-06-14 08:13:22.063318+00	\N	2025-05-25 01:47:18.482518+00	\N	completed	2025-01-17 14:43:01.039318+00
ec086af9-f362-4713-bf92-1e9f6ea6f115	5c74fdb2-b4d9-4f4b-9c6c-f6b72854db84	247b80be-b7dc-4582-aa28-5dd8888d8c53	c87b314f-ad10-4e91-b2e6-dbd8cdf13230	Plumber service needed in Lapu-Lapu. General service request.	2025-03-26 23:31:14.632918+00	\N	2025-11-15 09:46:31.624918+00	\N	completed	2025-05-23 09:49:13.884118+00
bc02bbd8-bd82-4bf1-8671-37c898f8d321	9e61d17b-97a4-45e7-a26c-4fdc3086cdb7	247b80be-b7dc-4582-aa28-5dd8888d8c53	c87b314f-ad10-4e91-b2e6-dbd8cdf13230	Plumber service needed in Lapu-Lapu. Urgent repair needed.	2025-03-29 10:43:08.527318+00	\N	2025-11-25 07:44:12.117718+00	\N	completed	2025-03-08 14:28:21.055318+00
fde6e8ee-374a-478d-8234-dc85074f8218	6302ea1c-5af4-4302-918a-c87152175bae	247b80be-b7dc-4582-aa28-5dd8888d8c53	c87b314f-ad10-4e91-b2e6-dbd8cdf13230	Plumber service needed in Lapu-Lapu. Regular maintenance required.	2025-03-22 12:02:54.568918+00	\N	2025-05-26 12:48:51.420118+00	\N	completed	2025-08-05 12:33:33.592918+00
cef35510-64c8-490c-8d49-8d12882f6d9d	a3563a32-75c5-4d0b-b672-9f548fe69a06	247b80be-b7dc-4582-aa28-5dd8888d8c53	c87b314f-ad10-4e91-b2e6-dbd8cdf13230	Plumber service needed in Lapu-Lapu. Installation and setup.	2025-01-05 09:30:51.852118+00	\N	2025-05-24 18:21:01.826518+00	\N	completed	2025-08-01 09:59:05.292118+00
ad64353a-4f88-4499-bb1d-d077bf87e9ba	5fcd65e1-d364-4762-a7e2-9939ef039247	247b80be-b7dc-4582-aa28-5dd8888d8c53	c87b314f-ad10-4e91-b2e6-dbd8cdf13230	Plumber service needed in Lapu-Lapu. Inspection and consultation.	2025-01-17 08:01:37.384918+00	\N	2025-04-11 15:30:50.124118+00	\N	completed	2025-08-24 13:38:29.541718+00
b8b9db45-4a3f-4a47-aab0-8ab9df945640	649a4947-627c-43f2-9c5e-b75f213a0d93	247b80be-b7dc-4582-aa28-5dd8888d8c53	c87b314f-ad10-4e91-b2e6-dbd8cdf13230	Plumber service needed in Lapu-Lapu. General service request.	2025-11-08 12:50:00.367318+00	\N	2025-07-13 16:51:22.389718+00	\N	completed	2025-03-12 13:54:32.815318+00
5ee9c87d-25c5-433f-94ca-2ba076f2dace	3c6ff2a2-e59e-48af-8a8e-9238dc49ecc6	247b80be-b7dc-4582-aa28-5dd8888d8c53	c87b314f-ad10-4e91-b2e6-dbd8cdf13230	Plumber service needed in Lapu-Lapu. Urgent repair needed.	2025-01-22 07:46:17.743318+00	\N	2025-05-27 22:21:50.757718+00	\N	completed	2025-01-03 07:08:17.733718+00
88726b7c-1186-4f21-a3fb-cb544b94735f	496d267d-f0aa-4592-a87a-bd69e1196f23	247b80be-b7dc-4582-aa28-5dd8888d8c53	c87b314f-ad10-4e91-b2e6-dbd8cdf13230	Plumber service needed in Lapu-Lapu. Regular maintenance required.	2025-03-01 18:41:20.325718+00	\N	2025-07-02 03:42:53.205718+00	\N	completed	2025-06-07 13:23:48.693718+00
cfd6415d-8c87-4feb-93f4-eeb24efed98c	5c328f75-464c-4053-a41e-00fbc6eba934	247b80be-b7dc-4582-aa28-5dd8888d8c53	c87b314f-ad10-4e91-b2e6-dbd8cdf13230	Plumber service needed in Lapu-Lapu. Installation and setup.	2025-01-10 14:45:10.207318+00	\N	2025-03-07 04:36:19.941718+00	\N	completed	2025-03-09 05:32:35.330518+00
91765c5b-e52d-4189-a010-95efceb5e87d	6302ea1c-5af4-4302-918a-c87152175bae	7affa09f-b335-4d36-81e3-0a179279fc69	67b073d4-c07b-4f32-97c5-d64e4797044e	Handyman service needed in Davao City. Regular maintenance required.	2025-06-30 11:40:39.775318+00	\N	\N	\N	pending	2025-06-21 19:11:15.544918+00
fc116d3f-5ca1-4661-a56c-5d204b67c285	a3563a32-75c5-4d0b-b672-9f548fe69a06	7affa09f-b335-4d36-81e3-0a179279fc69	67b073d4-c07b-4f32-97c5-d64e4797044e	Handyman service needed in Davao City. Installation and setup.	2025-04-19 12:48:09.516118+00	\N	2025-04-13 10:56:00.943318+00	\N	completed	2025-12-02 08:38:37.346518+00
07520687-856e-4b38-8096-c2dacab2f438	5fcd65e1-d364-4762-a7e2-9939ef039247	7affa09f-b335-4d36-81e3-0a179279fc69	67b073d4-c07b-4f32-97c5-d64e4797044e	Handyman service needed in Davao City. Inspection and consultation.	2025-05-12 12:40:41.186518+00	\N	2025-11-14 13:17:21.103318+00	\N	completed	2025-04-25 23:25:09.247318+00
d1fa2bf7-a35d-483a-a88b-d216023cc2f9	649a4947-627c-43f2-9c5e-b75f213a0d93	7affa09f-b335-4d36-81e3-0a179279fc69	67b073d4-c07b-4f32-97c5-d64e4797044e	Handyman service needed in Davao City. General service request.	2025-09-01 00:10:10.456918+00	\N	2025-08-28 04:14:54.828118+00	\N	completed	2025-12-07 01:44:12.204118+00
3b3e391d-0b12-4a98-8914-8ea74e3ef8b6	3c6ff2a2-e59e-48af-8a8e-9238dc49ecc6	7affa09f-b335-4d36-81e3-0a179279fc69	67b073d4-c07b-4f32-97c5-d64e4797044e	Handyman service needed in Davao City. Urgent repair needed.	2025-01-25 05:53:46.274518+00	\N	2025-06-03 21:31:40.495318+00	\N	completed	2025-04-12 19:58:25.576918+00
4f66b3ae-c026-42cd-90c8-b3e546944c7c	496d267d-f0aa-4592-a87a-bd69e1196f23	7affa09f-b335-4d36-81e3-0a179279fc69	67b073d4-c07b-4f32-97c5-d64e4797044e	Handyman service needed in Davao City. Regular maintenance required.	2025-01-15 05:16:00.520918+00	\N	2025-08-29 03:14:09.957718+00	\N	completed	2025-06-02 21:35:12.261718+00
dde02e83-c625-4309-ae30-8a43893cb9f1	5c328f75-464c-4053-a41e-00fbc6eba934	7affa09f-b335-4d36-81e3-0a179279fc69	67b073d4-c07b-4f32-97c5-d64e4797044e	Handyman service needed in Davao City. Installation and setup.	2025-02-17 08:07:10.888918+00	\N	2025-07-26 02:14:19.692118+00	\N	completed	2025-10-19 00:40:08.613718+00
4b507a50-07aa-4f5f-85c3-670530406330	bed6bf7a-bfbb-4eac-b6d7-35ca3e7d6660	7affa09f-b335-4d36-81e3-0a179279fc69	67b073d4-c07b-4f32-97c5-d64e4797044e	Handyman service needed in Davao City. Inspection and consultation.	2025-05-27 18:24:01.020118+00	\N	2025-07-10 11:41:42.328918+00	\N	completed	2025-07-23 03:39:54.098518+00
8f234864-1698-4e19-ab03-0aadf9fdfd52	549f87d2-961e-48f8-bcff-7286d7db879e	7affa09f-b335-4d36-81e3-0a179279fc69	67b073d4-c07b-4f32-97c5-d64e4797044e	Handyman service needed in Davao City. General service request.	2025-10-13 17:59:45.352918+00	\N	2025-12-01 07:44:16.437718+00	\N	completed	2025-02-24 13:10:50.402518+00
1947a5ab-8a94-46b0-aa32-a12eed09642c	a8957421-6c24-4110-ad8a-89513c6cfe93	7affa09f-b335-4d36-81e3-0a179279fc69	67b073d4-c07b-4f32-97c5-d64e4797044e	Handyman service needed in Davao City. Urgent repair needed.	2025-01-14 15:06:56.056918+00	\N	2025-05-13 23:12:03.698518+00	\N	completed	2025-08-08 04:49:01.816918+00
555cbaaa-6c90-4685-9451-f86124ab29c6	ded07a3d-2dc7-40f1-a9df-81b72c989abf	7affa09f-b335-4d36-81e3-0a179279fc69	67b073d4-c07b-4f32-97c5-d64e4797044e	Handyman service needed in Davao City. Regular maintenance required.	2025-08-12 15:06:43.788118+00	\N	2025-02-28 09:23:37.087318+00	\N	completed	2025-08-09 07:52:18.117718+00
c526a164-448e-402a-85fa-12d81079d1c8	bed6bf7a-bfbb-4eac-b6d7-35ca3e7d6660	96fe7dab-91ec-4c51-a775-a406572da480	19a03c30-e580-4bda-bec4-d59fb737e8e0	Carpenter service needed in Cagayan de Oro. Inspection and consultation.	2025-02-10 11:07:18.060118+00	\N	\N	\N	pending	2025-11-16 22:46:11.781718+00
5a47874b-1161-4c2f-84dc-344d3d821eec	549f87d2-961e-48f8-bcff-7286d7db879e	96fe7dab-91ec-4c51-a775-a406572da480	19a03c30-e580-4bda-bec4-d59fb737e8e0	Carpenter service needed in Cagayan de Oro. General service request.	2025-03-06 06:43:54.031318+00	\N	2025-10-28 07:28:22.581718+00	\N	completed	2025-09-15 19:23:10.159318+00
84e1291d-015d-4ee8-a91b-1506ad9d4a73	a8957421-6c24-4110-ad8a-89513c6cfe93	96fe7dab-91ec-4c51-a775-a406572da480	19a03c30-e580-4bda-bec4-d59fb737e8e0	Carpenter service needed in Cagayan de Oro. Urgent repair needed.	2025-08-27 02:02:39.938518+00	\N	2025-03-06 23:57:52.168918+00	\N	completed	2025-01-14 18:47:26.056918+00
ad32fcd8-e509-4b4a-bfd7-35d0fa1b363c	ded07a3d-2dc7-40f1-a9df-81b72c989abf	96fe7dab-91ec-4c51-a775-a406572da480	19a03c30-e580-4bda-bec4-d59fb737e8e0	Carpenter service needed in Cagayan de Oro. Regular maintenance required.	2025-07-15 12:28:52.533718+00	\N	2025-07-19 19:31:27.045718+00	\N	completed	2025-09-24 06:52:41.935318+00
1054ec14-0759-4653-bd21-41b27d640d93	f97cfaac-5a4e-420a-a445-9776c13600b8	96fe7dab-91ec-4c51-a775-a406572da480	19a03c30-e580-4bda-bec4-d59fb737e8e0	Carpenter service needed in Cagayan de Oro. Installation and setup.	2025-09-25 05:27:43.384918+00	\N	2025-03-23 17:49:19.039318+00	\N	completed	2025-12-02 23:45:34.226518+00
9c0eaf11-db98-442f-b13a-7611a37cc998	2594b276-c01e-4543-b2b5-0cd20667b7a6	96fe7dab-91ec-4c51-a775-a406572da480	19a03c30-e580-4bda-bec4-d59fb737e8e0	Carpenter service needed in Cagayan de Oro. Inspection and consultation.	2025-05-24 01:16:36.520918+00	\N	2025-12-18 22:07:47.839318+00	\N	completed	2025-02-01 08:22:19.039318+00
1e116db7-ec77-45a2-bb0b-2fd75686b801	216ebdf7-cd45-4b40-86f2-268b4e33bb68	96fe7dab-91ec-4c51-a775-a406572da480	19a03c30-e580-4bda-bec4-d59fb737e8e0	Carpenter service needed in Cagayan de Oro. General service request.	2025-07-07 22:04:04.754518+00	\N	2025-11-29 08:02:28.274518+00	\N	completed	2025-04-01 10:25:41.877718+00
5d6d997d-a8af-4d94-bcda-4452cf5eac88	f74860cc-f981-42b4-809d-11e92bedd14f	96fe7dab-91ec-4c51-a775-a406572da480	19a03c30-e580-4bda-bec4-d59fb737e8e0	Carpenter service needed in Cagayan de Oro. Urgent repair needed.	2025-12-02 01:25:30.732118+00	\N	2025-05-28 22:09:59.858518+00	\N	completed	2025-10-18 15:06:19.682518+00
05ffb47f-0d12-48e6-9305-a83c70106e08	f74860cc-f981-42b4-809d-11e92bedd14f	7c681db7-cff1-40e6-b38b-79919297ca90	2fd74584-4526-428d-b506-d92de93f45b1	Electrician service needed in Iloilo City. Urgent repair needed.	2025-06-11 21:09:28.207318+00	\N	\N	\N	pending	2025-08-04 21:41:31.989718+00
c476fd64-3739-44b5-91f0-9b1d32b5a010	d951675f-497c-4ccb-b55d-6a72f9cfb8fc	7c681db7-cff1-40e6-b38b-79919297ca90	2fd74584-4526-428d-b506-d92de93f45b1	Electrician service needed in Iloilo City. Regular maintenance required.	2025-11-30 20:54:24.636118+00	\N	2025-10-08 20:11:19.375318+00	\N	completed	2025-06-28 15:41:52.984918+00
d57344b6-ab48-4e7b-b9bd-591a386bb24e	dd3b46e4-576f-488e-928f-a5a2688e0fd4	7c681db7-cff1-40e6-b38b-79919297ca90	2fd74584-4526-428d-b506-d92de93f45b1	Electrician service needed in Iloilo City. Installation and setup.	2025-03-09 04:41:52.495318+00	\N	2025-12-19 19:19:08.671318+00	\N	completed	2025-05-31 11:47:10.562518+00
ab73a3a2-50cf-42f4-a2b0-4d2a9b444d9a	7d6e1a27-d7f8-445f-a544-81c817a39304	7c681db7-cff1-40e6-b38b-79919297ca90	2fd74584-4526-428d-b506-d92de93f45b1	Electrician service needed in Iloilo City. Inspection and consultation.	2025-07-07 03:26:42.847318+00	\N	2025-07-02 14:28:38.680918+00	\N	completed	2025-03-25 03:06:51.045718+00
03528def-ae96-4d78-b5e5-b2f94897cdbd	088c7759-5ee8-4fd2-99fa-6d6953d6e99c	7c681db7-cff1-40e6-b38b-79919297ca90	2fd74584-4526-428d-b506-d92de93f45b1	Electrician service needed in Iloilo City. General service request.	2025-08-04 12:30:59.628118+00	\N	2025-07-10 18:20:13.788118+00	\N	completed	2025-07-06 20:27:07.269718+00
a900fb5e-b2d6-4b9d-9015-bb748990213d	d4d09b07-6022-4d29-8d83-2905a67c2fb0	b4f1941c-0fd5-43f9-ba92-40fc055c11c8	8a10c3b6-f3d9-4e9d-89c3-0e47b7c652d0	Roofer service needed in Baguio. Installation and setup.	2025-05-24 00:58:37.816918+00	\N	\N	\N	pending	2025-07-04 13:07:16.994518+00
d204c0c7-f94b-4b31-979f-328aee5008f4	9c0e3b56-4094-4a57-b207-abb436a8fe3d	b4f1941c-0fd5-43f9-ba92-40fc055c11c8	8a10c3b6-f3d9-4e9d-89c3-0e47b7c652d0	Roofer service needed in Baguio. Inspection and consultation.	2025-07-25 03:10:05.100118+00	\N	\N	\N	canceled	2025-04-20 08:51:33.823318+00
c6e79dd8-5a81-4ec8-bb7d-d5c5aa86d61d	6e0bbfe1-f2fd-4356-8684-bc8d8fb15a28	b4f1941c-0fd5-43f9-ba92-40fc055c11c8	8a10c3b6-f3d9-4e9d-89c3-0e47b7c652d0	Roofer service needed in Baguio. General service request.	2025-07-23 15:28:29.378518+00	\N	2025-08-28 22:14:29.426518+00	\N	completed	2025-03-11 08:13:28.629718+00
37ff4a80-481c-4d14-b202-68d8577d8359	2f6a0b4d-ff98-443f-a347-bc1c2e867bf5	b4f1941c-0fd5-43f9-ba92-40fc055c11c8	8a10c3b6-f3d9-4e9d-89c3-0e47b7c652d0	Roofer service needed in Baguio. Urgent repair needed.	2025-03-21 00:15:55.279318+00	\N	2025-09-03 01:24:14.700118+00	\N	completed	2025-11-02 23:37:30.127318+00
fce96628-5555-4402-8ae7-6808da0bffec	c02b1823-7eec-4776-812e-b2a42402a542	b4f1941c-0fd5-43f9-ba92-40fc055c11c8	8a10c3b6-f3d9-4e9d-89c3-0e47b7c652d0	Roofer service needed in Baguio. Regular maintenance required.	2025-02-22 01:32:31.154518+00	\N	2025-06-21 18:51:55.538518+00	\N	completed	2025-11-23 06:46:56.680918+00
cf87f4d6-9ebb-4db2-af9a-fcd11071594a	8568204d-bac8-4bd2-be49-666099493157	b4f1941c-0fd5-43f9-ba92-40fc055c11c8	8a10c3b6-f3d9-4e9d-89c3-0e47b7c652d0	Roofer service needed in Baguio. Installation and setup.	2025-02-24 17:08:47.484118+00	\N	2025-09-25 03:34:03.228118+00	\N	completed	2025-07-31 23:39:06.290518+00
557b4333-ae93-48ca-b0ce-f3371635e88d	3505bad0-2d27-427b-ae95-3169a5838fbf	b4f1941c-0fd5-43f9-ba92-40fc055c11c8	8a10c3b6-f3d9-4e9d-89c3-0e47b7c652d0	Roofer service needed in Baguio. Inspection and consultation.	2025-08-16 06:04:49.048918+00	\N	2025-05-12 00:19:03.544918+00	\N	completed	2025-07-21 07:46:47.810518+00
fc7c7691-7758-41d8-b92d-02211e1fff1d	5be0cd9f-a466-4485-ac43-bdc4b104ecc0	b4f1941c-0fd5-43f9-ba92-40fc055c11c8	8a10c3b6-f3d9-4e9d-89c3-0e47b7c652d0	Roofer service needed in Baguio. General service request.	2025-03-10 10:00:11.820118+00	\N	2025-06-17 01:01:02.536918+00	\N	completed	2025-12-06 23:31:19.557718+00
2585d2a7-d452-48ad-b9fc-7d94ef79e529	ee82e0a0-0f37-4a6f-ae93-2113eddeb55c	b4f1941c-0fd5-43f9-ba92-40fc055c11c8	8a10c3b6-f3d9-4e9d-89c3-0e47b7c652d0	Roofer service needed in Baguio. Urgent repair needed.	2025-07-13 02:30:28.840918+00	\N	2025-05-10 21:31:42.568918+00	\N	completed	2025-10-09 12:20:59.666518+00
a98450cc-f1d2-4c43-9c1c-cbd43440d8e0	40ec397a-f1cf-4855-8a3a-c5673fb20e05	b4f1941c-0fd5-43f9-ba92-40fc055c11c8	8a10c3b6-f3d9-4e9d-89c3-0e47b7c652d0	Roofer service needed in Baguio. Regular maintenance required.	2025-10-08 00:49:17.944918+00	\N	2025-06-20 03:09:48.684118+00	\N	completed	2025-02-12 21:04:34.620118+00
983e601e-cfa4-4e63-a26d-315e5ba54518	0897825a-ab99-41e9-98ba-b4ed822155a5	b4f1941c-0fd5-43f9-ba92-40fc055c11c8	8a10c3b6-f3d9-4e9d-89c3-0e47b7c652d0	Roofer service needed in Baguio. Installation and setup.	2025-05-28 19:32:19.836118+00	\N	2025-06-03 23:15:46.005718+00	\N	completed	2025-09-19 12:28:18.837718+00
ca7e701b-1eea-43f6-b9f1-5855704d5e12	b19b93f9-ccf5-4b17-bdcf-a105d11018af	b4f1941c-0fd5-43f9-ba92-40fc055c11c8	8a10c3b6-f3d9-4e9d-89c3-0e47b7c652d0	Roofer service needed in Baguio. Inspection and consultation.	2025-07-27 09:47:32.364118+00	\N	2025-11-16 14:19:29.176918+00	\N	completed	2025-05-12 12:02:52.840918+00
ec3010c0-271b-44ba-a6d8-98bd2b22d421	5be0cd9f-a466-4485-ac43-bdc4b104ecc0	ccc0cbbb-a469-4e83-a5ca-259f2b1acce2	45138e1c-7f74-4a2e-b43c-86f41855fac4	HVAC Technician service needed in Manila. General service request.	2025-12-18 22:40:09.420118+00	\N	\N	\N	pending	2025-11-16 14:24:04.879318+00
5588af0a-67d1-415c-80cb-d3af65f27995	ee82e0a0-0f37-4a6f-ae93-2113eddeb55c	ccc0cbbb-a469-4e83-a5ca-259f2b1acce2	45138e1c-7f74-4a2e-b43c-86f41855fac4	HVAC Technician service needed in Manila. Urgent repair needed.	2025-06-27 17:35:00.223318+00	\N	2025-08-25 22:19:31.740118+00	\N	completed	2025-05-13 13:51:16.946518+00
e261bb36-076c-44f4-a366-9286bc88229e	40ec397a-f1cf-4855-8a3a-c5673fb20e05	ccc0cbbb-a469-4e83-a5ca-259f2b1acce2	45138e1c-7f74-4a2e-b43c-86f41855fac4	HVAC Technician service needed in Manila. Regular maintenance required.	2025-03-19 06:45:26.220118+00	\N	2025-05-04 01:34:02.306518+00	\N	completed	2025-07-17 21:06:37.221718+00
c7e7a81d-43be-4fa0-b920-5f731491eb1a	0897825a-ab99-41e9-98ba-b4ed822155a5	ccc0cbbb-a469-4e83-a5ca-259f2b1acce2	45138e1c-7f74-4a2e-b43c-86f41855fac4	HVAC Technician service needed in Manila. Installation and setup.	2025-02-03 18:19:52.360918+00	\N	2025-08-04 07:32:37.893718+00	\N	completed	2025-04-22 16:09:36.962518+00
3501a44f-a85f-4d7c-9e21-72df307ea9a9	b19b93f9-ccf5-4b17-bdcf-a105d11018af	ccc0cbbb-a469-4e83-a5ca-259f2b1acce2	45138e1c-7f74-4a2e-b43c-86f41855fac4	HVAC Technician service needed in Manila. Inspection and consultation.	2025-12-07 09:14:48.924118+00	\N	2025-03-29 14:50:57.880918+00	\N	completed	2025-02-06 09:03:09.688918+00
afb16a90-9d09-4bb2-9a86-d6808bdaead7	6fc15c3f-2c63-4a80-b499-3744ac6c5e0a	ccc0cbbb-a469-4e83-a5ca-259f2b1acce2	45138e1c-7f74-4a2e-b43c-86f41855fac4	HVAC Technician service needed in Manila. General service request.	2025-10-27 12:32:09.784918+00	\N	2025-04-14 04:11:52.005718+00	\N	completed	2025-03-21 14:18:56.863318+00
145d5fc4-1518-4ca7-8b35-e5503f7ba13a	97c5f2cc-ef11-452a-9aa3-b4705f3280f8	ccc0cbbb-a469-4e83-a5ca-259f2b1acce2	45138e1c-7f74-4a2e-b43c-86f41855fac4	HVAC Technician service needed in Manila. Urgent repair needed.	2025-09-26 17:12:42.405718+00	\N	2025-10-09 15:19:36.463318+00	\N	completed	2025-06-25 13:55:44.354518+00
fcb69218-8a26-4dc0-b39f-851a82f44366	1be14a91-1b2c-48d6-8465-d1d4d12a785c	ccc0cbbb-a469-4e83-a5ca-259f2b1acce2	45138e1c-7f74-4a2e-b43c-86f41855fac4	HVAC Technician service needed in Manila. Regular maintenance required.	2025-10-26 10:11:57.967318+00	\N	2025-05-05 20:11:46.332118+00	\N	completed	2025-05-24 18:49:27.880918+00
582e4e5c-7cad-41a4-8f68-74aadb348e2b	4cfa17c8-4d9f-4283-97f2-3a4976248b91	ccc0cbbb-a469-4e83-a5ca-259f2b1acce2	45138e1c-7f74-4a2e-b43c-86f41855fac4	HVAC Technician service needed in Manila. Installation and setup.	2025-06-19 19:20:54.165718+00	\N	2025-08-18 12:17:17.618518+00	\N	completed	2025-11-24 22:40:43.980118+00
38007edf-fed7-412d-9fa1-ed94c6f1e283	1be14a91-1b2c-48d6-8465-d1d4d12a785c	21007243-551a-49f7-8df4-d188ad7e6244	8ec0536f-dc92-40ba-87d8-f60e42a55db6	Cleaner service needed in Quezon City. Regular maintenance required.	2025-07-19 15:11:29.512918+00	\N	\N	\N	pending	2025-11-27 03:45:49.029718+00
8b66b89f-2c99-4eca-89c2-6372c068f2bd	4cfa17c8-4d9f-4283-97f2-3a4976248b91	21007243-551a-49f7-8df4-d188ad7e6244	8ec0536f-dc92-40ba-87d8-f60e42a55db6	Cleaner service needed in Quezon City. Installation and setup.	2025-11-01 00:54:13.087318+00	\N	2025-08-21 21:42:38.085718+00	\N	completed	2025-10-05 22:36:16.658518+00
920ad54f-1efa-455a-9da2-389584e6f190	57dfd528-5470-40a1-8fde-40eb61dd7ae1	21007243-551a-49f7-8df4-d188ad7e6244	8ec0536f-dc92-40ba-87d8-f60e42a55db6	Cleaner service needed in Quezon City. Inspection and consultation.	2025-05-21 00:44:49.932118+00	\N	2025-04-07 07:44:56.008918+00	\N	completed	2025-01-02 16:58:11.666518+00
5443530a-0cc2-44de-b066-1a2ad2a1baf9	3cc9e6b9-d7d7-4d91-904b-65aeb230b14b	21007243-551a-49f7-8df4-d188ad7e6244	8ec0536f-dc92-40ba-87d8-f60e42a55db6	Cleaner service needed in Quezon City. General service request.	2025-10-22 17:04:00.463318+00	\N	2025-11-14 03:23:32.508118+00	\N	completed	2025-01-21 11:17:24.501718+00
d6c4cf94-0522-4b5a-9012-eeb5c798aac4	ff8bb61b-1117-4f5c-880b-ac4ebd7ea6c2	21007243-551a-49f7-8df4-d188ad7e6244	8ec0536f-dc92-40ba-87d8-f60e42a55db6	Cleaner service needed in Quezon City. Urgent repair needed.	2025-11-19 13:06:50.642518+00	\N	2025-10-19 07:10:15.237718+00	\N	completed	2025-04-07 13:38:29.887318+00
45a85fb6-34c9-49d5-91ac-09ba2f10d9b5	feaac7e1-3bc3-4462-b2f8-b4a19f990531	21007243-551a-49f7-8df4-d188ad7e6244	8ec0536f-dc92-40ba-87d8-f60e42a55db6	Cleaner service needed in Quezon City. Regular maintenance required.	2025-12-08 05:38:07.020118+00	\N	2025-08-26 15:38:17.503318+00	\N	completed	2025-06-10 13:04:33.525718+00
c7a4318d-e397-441f-ab2b-88651ee80191	158e9458-44c9-4638-83b9-bf0c99bdb64a	8d2d4afc-beef-44d3-8628-428dcebdf008	368f7187-4490-4015-84fa-20a4f46eea09	Locksmith service needed in Makati. Inspection and consultation.	2025-02-06 19:35:02.700118+00	\N	\N	\N	pending	2025-04-18 21:26:01.720918+00
76eceb0d-9624-4d65-a178-7db212fbcb61	503f2221-11c2-4415-9a5b-9b0e81e95b67	8d2d4afc-beef-44d3-8628-428dcebdf008	368f7187-4490-4015-84fa-20a4f46eea09	Locksmith service needed in Makati. General service request.	2025-11-13 15:47:54.136918+00	\N	\N	\N	canceled	2025-10-02 18:42:50.786518+00
a0a46d1b-bd11-4407-bf15-761d051471da	5eae5e90-1914-41e5-be8a-aef4314d4892	8d2d4afc-beef-44d3-8628-428dcebdf008	368f7187-4490-4015-84fa-20a4f46eea09	Locksmith service needed in Makati. Urgent repair needed.	2025-08-26 03:10:50.287318+00	\N	2025-06-09 02:42:30.453718+00	\N	completed	2025-02-18 10:53:07.020118+00
0635a4bf-27bb-4d33-89f3-3ed39578c660	4893cb6b-0ffd-422a-b940-7b9201daa34f	8d2d4afc-beef-44d3-8628-428dcebdf008	368f7187-4490-4015-84fa-20a4f46eea09	Locksmith service needed in Makati. Regular maintenance required.	2025-03-18 11:48:19.423318+00	\N	2025-10-15 13:52:16.389718+00	\N	completed	2025-05-06 05:53:14.997718+00
d3687eee-6506-4fb9-aa8d-45e7b0e29874	218a9cdd-7d3a-44c9-bd7a-d885d38d6063	8d2d4afc-beef-44d3-8628-428dcebdf008	368f7187-4490-4015-84fa-20a4f46eea09	Locksmith service needed in Makati. Installation and setup.	2025-05-01 05:46:48.098518+00	\N	2025-06-15 13:47:53.560918+00	\N	completed	2025-07-16 10:17:35.445718+00
6789d61e-208e-47d4-bc41-8e0215601097	4eea189c-607a-466d-8f92-1f53d790fb6f	8d2d4afc-beef-44d3-8628-428dcebdf008	368f7187-4490-4015-84fa-20a4f46eea09	Locksmith service needed in Makati. Inspection and consultation.	2025-04-18 00:02:32.623318+00	\N	2025-12-06 01:57:37.106518+00	\N	completed	2025-10-17 06:40:57.084118+00
baa291ca-32ab-4ec5-aa88-95810fd37f56	5c74fdb2-b4d9-4f4b-9c6c-f6b72854db84	8d2d4afc-beef-44d3-8628-428dcebdf008	368f7187-4490-4015-84fa-20a4f46eea09	Locksmith service needed in Makati. General service request.	2025-01-11 14:59:31.010518+00	\N	2025-06-11 11:45:44.335318+00	\N	completed	2025-06-18 14:11:14.536918+00
97d04e04-739e-4135-bc01-6b07be85c6a8	9e61d17b-97a4-45e7-a26c-4fdc3086cdb7	8d2d4afc-beef-44d3-8628-428dcebdf008	368f7187-4490-4015-84fa-20a4f46eea09	Locksmith service needed in Makati. Urgent repair needed.	2025-06-26 16:10:31.999318+00	\N	2025-05-18 15:46:58.495318+00	\N	completed	2025-06-25 12:12:42.520918+00
438c37cb-24bf-473e-8994-04fb19d20438	6302ea1c-5af4-4302-918a-c87152175bae	8d2d4afc-beef-44d3-8628-428dcebdf008	368f7187-4490-4015-84fa-20a4f46eea09	Locksmith service needed in Makati. Regular maintenance required.	2025-05-26 00:48:12.021718+00	\N	2025-06-14 09:30:40.188118+00	\N	completed	2025-05-30 12:39:45.112918+00
e4f5fa95-2c60-4af2-9b20-034ed196ea34	a3563a32-75c5-4d0b-b672-9f548fe69a06	8d2d4afc-beef-44d3-8628-428dcebdf008	368f7187-4490-4015-84fa-20a4f46eea09	Locksmith service needed in Makati. Installation and setup.	2025-01-31 00:52:46.860118+00	\N	2025-04-10 17:19:58.120918+00	\N	completed	2025-04-18 17:22:06.770518+00
c0bc84de-c96d-402f-83ab-4dd8c2b2c015	5fcd65e1-d364-4762-a7e2-9939ef039247	8d2d4afc-beef-44d3-8628-428dcebdf008	368f7187-4490-4015-84fa-20a4f46eea09	Locksmith service needed in Makati. Inspection and consultation.	2025-09-06 09:24:16.399318+00	\N	2025-07-26 14:56:26.546518+00	\N	completed	2025-05-17 19:42:03.900118+00
80e73192-4f1a-4566-a899-5af0189790e0	649a4947-627c-43f2-9c5e-b75f213a0d93	8d2d4afc-beef-44d3-8628-428dcebdf008	368f7187-4490-4015-84fa-20a4f46eea09	Locksmith service needed in Makati. General service request.	2025-07-04 17:20:33.544918+00	\N	2025-05-26 15:52:25.087318+00	\N	completed	2025-11-25 05:47:29.916118+00
4a8b56c9-eab6-4161-b0e4-2feb4e3cddce	3c6ff2a2-e59e-48af-8a8e-9238dc49ecc6	8d2d4afc-beef-44d3-8628-428dcebdf008	368f7187-4490-4015-84fa-20a4f46eea09	Locksmith service needed in Makati. Urgent repair needed.	2025-12-04 14:29:47.628118+00	\N	2025-05-27 17:09:45.631318+00	\N	completed	2025-10-31 12:20:11.455318+00
a90b33e5-02ce-4912-bff3-fe527a929049	9e61d17b-97a4-45e7-a26c-4fdc3086cdb7	6f9859a4-f31c-4445-becd-04934b9b4677	fa26da00-47e3-4456-8d91-ef631d37234a	Landscaper service needed in Taguig. Urgent repair needed.	2025-11-12 21:44:11.311318+00	\N	\N	\N	pending	2025-03-26 20:02:03.045718+00
16a6dae3-e3a0-4896-977c-4cbb26b46f51	6302ea1c-5af4-4302-918a-c87152175bae	6f9859a4-f31c-4445-becd-04934b9b4677	fa26da00-47e3-4456-8d91-ef631d37234a	Landscaper service needed in Taguig. Regular maintenance required.	2025-05-15 12:01:11.925718+00	\N	2025-05-06 12:08:41.637718+00	\N	completed	2025-08-12 22:34:49.567318+00
b43b4dcc-c4bc-4110-8d84-606515b16827	a3563a32-75c5-4d0b-b672-9f548fe69a06	6f9859a4-f31c-4445-becd-04934b9b4677	fa26da00-47e3-4456-8d91-ef631d37234a	Landscaper service needed in Taguig. Installation and setup.	2025-07-19 08:12:00.501718+00	\N	2025-11-25 00:35:41.378518+00	\N	completed	2025-05-21 01:16:17.944918+00
f2e0b1d5-5995-457c-938e-45b448a348ef	5fcd65e1-d364-4762-a7e2-9939ef039247	6f9859a4-f31c-4445-becd-04934b9b4677	fa26da00-47e3-4456-8d91-ef631d37234a	Landscaper service needed in Taguig. Inspection and consultation.	2025-07-25 06:47:37.288918+00	\N	2025-09-19 00:09:14.037718+00	\N	completed	2025-07-02 18:02:57.333718+00
3b6861a6-2915-4c6f-8c2b-841eb39cfa6c	649a4947-627c-43f2-9c5e-b75f213a0d93	6f9859a4-f31c-4445-becd-04934b9b4677	fa26da00-47e3-4456-8d91-ef631d37234a	Landscaper service needed in Taguig. General service request.	2025-02-18 04:09:20.028118+00	\N	2025-11-28 12:06:10.696918+00	\N	completed	2025-09-24 22:00:35.234518+00
80a00d17-78d3-426b-b910-e2490bcb0136	3c6ff2a2-e59e-48af-8a8e-9238dc49ecc6	6f9859a4-f31c-4445-becd-04934b9b4677	fa26da00-47e3-4456-8d91-ef631d37234a	Landscaper service needed in Taguig. Urgent repair needed.	2025-05-01 18:00:00.904918+00	\N	2025-06-05 13:37:51.352918+00	\N	completed	2024-12-24 15:45:13.692118+00
3b1e0400-151f-4706-a367-4e51f89ceaed	496d267d-f0aa-4592-a87a-bd69e1196f23	6f9859a4-f31c-4445-becd-04934b9b4677	fa26da00-47e3-4456-8d91-ef631d37234a	Landscaper service needed in Taguig. Regular maintenance required.	2025-08-21 12:18:57.410518+00	\N	2025-10-02 14:32:23.580118+00	\N	completed	2025-02-08 00:23:03.996118+00
d67c7634-298b-4fab-9a0f-0b8db50f0bd5	5c328f75-464c-4053-a41e-00fbc6eba934	6f9859a4-f31c-4445-becd-04934b9b4677	fa26da00-47e3-4456-8d91-ef631d37234a	Landscaper service needed in Taguig. Installation and setup.	2025-01-08 23:38:24.904918+00	\N	2025-02-19 19:41:33.055318+00	\N	completed	2025-11-27 18:01:08.728918+00
05077a93-253c-4a20-b1d5-cfb66cc1d41d	bed6bf7a-bfbb-4eac-b6d7-35ca3e7d6660	6f9859a4-f31c-4445-becd-04934b9b4677	fa26da00-47e3-4456-8d91-ef631d37234a	Landscaper service needed in Taguig. Inspection and consultation.	2025-04-24 08:16:11.752918+00	\N	2025-03-03 13:31:15.208918+00	\N	completed	2025-07-15 22:04:29.810518+00
b50456a7-f0c3-4bf5-9b55-c9f7bfb05089	549f87d2-961e-48f8-bcff-7286d7db879e	6f9859a4-f31c-4445-becd-04934b9b4677	fa26da00-47e3-4456-8d91-ef631d37234a	Landscaper service needed in Taguig. General service request.	2025-04-17 01:08:53.503318+00	\N	2025-06-03 17:23:03.535318+00	\N	completed	2025-10-12 14:48:25.039318+00
559d3db2-6895-4ee0-b4d7-a8c473bbb0ef	5c328f75-464c-4053-a41e-00fbc6eba934	e4b6d247-223e-4032-bb0e-949dc97f052c	ff8acab6-8c85-4fb8-af36-781b98920efb	Painter service needed in Pasig. Installation and setup.	2025-08-03 06:41:26.719318+00	\N	\N	\N	pending	2025-04-22 19:28:40.293718+00
7114dacc-26c7-4fd2-b8a2-f3a70cade9ef	bed6bf7a-bfbb-4eac-b6d7-35ca3e7d6660	e4b6d247-223e-4032-bb0e-949dc97f052c	ff8acab6-8c85-4fb8-af36-781b98920efb	Painter service needed in Pasig. Inspection and consultation.	2025-10-07 01:00:46.898518+00	\N	2025-08-09 20:55:26.498518+00	\N	completed	2025-05-28 08:46:39.804118+00
b08f253d-a6f5-4db3-8b9e-06bb06d32406	549f87d2-961e-48f8-bcff-7286d7db879e	e4b6d247-223e-4032-bb0e-949dc97f052c	ff8acab6-8c85-4fb8-af36-781b98920efb	Painter service needed in Pasig. General service request.	2025-05-21 19:51:19.192918+00	\N	2025-10-03 21:45:39.957718+00	\N	completed	2025-06-10 07:32:51.804118+00
fe7968af-6fdb-477f-b6c8-0b9a1dc81c0c	a8957421-6c24-4110-ad8a-89513c6cfe93	e4b6d247-223e-4032-bb0e-949dc97f052c	ff8acab6-8c85-4fb8-af36-781b98920efb	Painter service needed in Pasig. Urgent repair needed.	2025-10-06 10:34:43.087318+00	\N	2025-06-15 15:43:35.800918+00	\N	completed	2025-02-22 04:31:28.341718+00
d81708d8-2e94-44bc-be90-6bb50d75d44a	ded07a3d-2dc7-40f1-a9df-81b72c989abf	e4b6d247-223e-4032-bb0e-949dc97f052c	ff8acab6-8c85-4fb8-af36-781b98920efb	Painter service needed in Pasig. Regular maintenance required.	2024-12-22 00:18:10.149718+00	\N	2025-04-06 21:30:23.340118+00	\N	completed	2025-03-11 19:57:22.159318+00
729440bb-60a7-41ff-834d-d59f4dd3723d	f97cfaac-5a4e-420a-a445-9776c13600b8	e4b6d247-223e-4032-bb0e-949dc97f052c	ff8acab6-8c85-4fb8-af36-781b98920efb	Painter service needed in Pasig. Installation and setup.	2025-11-17 11:45:43.212118+00	\N	2025-05-14 02:16:51.410518+00	\N	completed	2025-10-06 09:07:28.802518+00
3092d96b-f796-4cab-9742-6bad06370a58	2594b276-c01e-4543-b2b5-0cd20667b7a6	e4b6d247-223e-4032-bb0e-949dc97f052c	ff8acab6-8c85-4fb8-af36-781b98920efb	Painter service needed in Pasig. Inspection and consultation.	2025-07-13 04:58:51.756118+00	\N	2025-10-18 22:35:31.298518+00	\N	completed	2025-07-13 23:06:39.007318+00
1ae5265d-562b-4338-80c7-dffa148a11c0	216ebdf7-cd45-4b40-86f2-268b4e33bb68	99b0b1ec-e1fb-4c44-a35e-2f14fd03e819	c87b314f-ad10-4e91-b2e6-dbd8cdf13230	Plumber service needed in Cebu City. General service request.	2025-10-12 17:20:17.820118+00	\N	\N	\N	pending	2025-03-25 21:14:01.231318+00
4885cfbc-ac78-46de-b998-cbd497b8f6ea	f74860cc-f981-42b4-809d-11e92bedd14f	99b0b1ec-e1fb-4c44-a35e-2f14fd03e819	c87b314f-ad10-4e91-b2e6-dbd8cdf13230	Plumber service needed in Cebu City. Urgent repair needed.	2025-12-06 07:13:56.594518+00	\N	2025-09-13 10:35:15.919318+00	\N	completed	2024-12-30 00:57:45.199318+00
13756169-5874-46cd-a22a-da03bb0ccaa9	d951675f-497c-4ccb-b55d-6a72f9cfb8fc	99b0b1ec-e1fb-4c44-a35e-2f14fd03e819	c87b314f-ad10-4e91-b2e6-dbd8cdf13230	Plumber service needed in Cebu City. Regular maintenance required.	2025-02-20 07:38:47.167318+00	\N	2025-05-04 12:02:17.330518+00	\N	completed	2025-04-10 07:53:11.253718+00
6a90ec86-9081-4fed-ab51-b6d0c89292cf	dd3b46e4-576f-488e-928f-a5a2688e0fd4	99b0b1ec-e1fb-4c44-a35e-2f14fd03e819	c87b314f-ad10-4e91-b2e6-dbd8cdf13230	Plumber service needed in Cebu City. Installation and setup.	2025-02-02 05:10:56.047318+00	\N	2025-05-21 18:00:18.703318+00	\N	completed	2025-08-14 05:44:49.816918+00
b9028aae-c5ec-4167-adb1-cde5ac1b0de7	7d6e1a27-d7f8-445f-a544-81c817a39304	99b0b1ec-e1fb-4c44-a35e-2f14fd03e819	c87b314f-ad10-4e91-b2e6-dbd8cdf13230	Plumber service needed in Cebu City. Inspection and consultation.	2025-02-28 01:20:46.044118+00	\N	2025-02-28 06:21:32.584918+00	\N	completed	2025-04-17 02:35:56.556118+00
c29981f6-f668-460c-82a7-36af3e88a0ad	088c7759-5ee8-4fd2-99fa-6d6953d6e99c	99b0b1ec-e1fb-4c44-a35e-2f14fd03e819	c87b314f-ad10-4e91-b2e6-dbd8cdf13230	Plumber service needed in Cebu City. General service request.	2025-09-03 17:52:58.063318+00	\N	2025-10-24 11:45:12.367318+00	\N	completed	2025-03-25 08:55:26.066518+00
6a62d3c4-7758-409c-b5c2-2cfd672dbe83	ce930397-85a0-4a2c-9d12-343341780701	99b0b1ec-e1fb-4c44-a35e-2f14fd03e819	c87b314f-ad10-4e91-b2e6-dbd8cdf13230	Plumber service needed in Cebu City. Urgent repair needed.	2025-01-12 10:23:20.095318+00	\N	2025-08-05 03:43:12.645718+00	\N	completed	2025-07-29 22:46:20.421718+00
0d6e6d2e-e160-413c-a58e-7831143cc5b5	2637c6dd-5fbe-487c-85c5-3ef87dc74cf5	99b0b1ec-e1fb-4c44-a35e-2f14fd03e819	c87b314f-ad10-4e91-b2e6-dbd8cdf13230	Plumber service needed in Cebu City. Regular maintenance required.	2025-04-13 16:03:17.061718+00	\N	2025-06-08 06:32:20.152918+00	\N	completed	2025-02-09 14:09:25.672918+00
f0ab985d-23ac-4dbe-abc3-20c5dd0933ae	d4d09b07-6022-4d29-8d83-2905a67c2fb0	99b0b1ec-e1fb-4c44-a35e-2f14fd03e819	c87b314f-ad10-4e91-b2e6-dbd8cdf13230	Plumber service needed in Cebu City. Installation and setup.	2025-08-13 15:41:15.919318+00	\N	2025-06-09 17:03:05.253718+00	\N	completed	2025-04-27 16:31:37.759318+00
fb42a180-34a3-45c7-bfac-ae39a646d324	9c0e3b56-4094-4a57-b207-abb436a8fe3d	99b0b1ec-e1fb-4c44-a35e-2f14fd03e819	c87b314f-ad10-4e91-b2e6-dbd8cdf13230	Plumber service needed in Cebu City. Inspection and consultation.	2025-03-02 21:38:32.882518+00	\N	2025-03-23 12:50:23.522518+00	\N	completed	2025-09-20 04:55:39.429718+00
d23da861-c768-41dd-837c-dcb6f92c642d	6e0bbfe1-f2fd-4356-8684-bc8d8fb15a28	99b0b1ec-e1fb-4c44-a35e-2f14fd03e819	c87b314f-ad10-4e91-b2e6-dbd8cdf13230	Plumber service needed in Cebu City. General service request.	2025-08-25 17:39:53.032918+00	\N	2025-03-02 17:36:14.354518+00	\N	completed	2025-01-07 10:17:24.904918+00
349339ab-1e70-4e24-853a-c1bb7b93d94d	2f6a0b4d-ff98-443f-a347-bc1c2e867bf5	99b0b1ec-e1fb-4c44-a35e-2f14fd03e819	c87b314f-ad10-4e91-b2e6-dbd8cdf13230	Plumber service needed in Cebu City. Urgent repair needed.	2025-08-05 12:04:09.045718+00	\N	2025-04-12 23:53:47.916118+00	\N	completed	2025-11-29 14:01:50.517718+00
c80c4ca1-e7f3-4ab6-b946-15b3555912f6	c02b1823-7eec-4776-812e-b2a42402a542	99b0b1ec-e1fb-4c44-a35e-2f14fd03e819	c87b314f-ad10-4e91-b2e6-dbd8cdf13230	Plumber service needed in Cebu City. Regular maintenance required.	2025-10-11 09:34:23.532118+00	\N	2025-04-09 06:06:17.868118+00	\N	completed	2025-06-17 01:21:10.840918+00
f35169ad-afa7-436c-b50f-6df370b4d067	8568204d-bac8-4bd2-be49-666099493157	99b0b1ec-e1fb-4c44-a35e-2f14fd03e819	c87b314f-ad10-4e91-b2e6-dbd8cdf13230	Plumber service needed in Cebu City. Installation and setup.	2025-06-10 21:37:22.380118+00	\N	2025-08-19 10:09:26.767318+00	\N	completed	2025-02-11 22:49:58.668118+00
c972e0fe-68a3-4ec0-8d5c-eafa8d7fee4a	2637c6dd-5fbe-487c-85c5-3ef87dc74cf5	90c8bc6d-8bfd-46c0-aca0-528cb60346ff	67b073d4-c07b-4f32-97c5-d64e4797044e	Handyman service needed in Mandaue City. Regular maintenance required.	2025-12-02 10:09:08.623318+00	\N	\N	\N	pending	2025-08-14 19:49:16.159318+00
04f01eb1-680d-4e86-b14b-0e9d06b37505	d4d09b07-6022-4d29-8d83-2905a67c2fb0	90c8bc6d-8bfd-46c0-aca0-528cb60346ff	67b073d4-c07b-4f32-97c5-d64e4797044e	Handyman service needed in Mandaue City. Installation and setup.	2025-01-08 17:08:47.138518+00	\N	2025-05-24 10:48:38.920918+00	\N	completed	2025-01-02 01:39:28.466518+00
8f408df8-0100-4136-bc8c-711dce685964	9c0e3b56-4094-4a57-b207-abb436a8fe3d	90c8bc6d-8bfd-46c0-aca0-528cb60346ff	67b073d4-c07b-4f32-97c5-d64e4797044e	Handyman service needed in Mandaue City. Inspection and consultation.	2025-11-11 13:12:16.716118+00	\N	2025-06-05 09:17:47.340118+00	\N	completed	2025-01-28 12:23:44.258518+00
3ae16a7b-1342-4c34-9d48-4fedb369a3ac	6e0bbfe1-f2fd-4356-8684-bc8d8fb15a28	90c8bc6d-8bfd-46c0-aca0-528cb60346ff	67b073d4-c07b-4f32-97c5-d64e4797044e	Handyman service needed in Mandaue City. General service request.	2025-10-07 02:16:15.295318+00	\N	2025-05-12 19:59:16.207318+00	\N	completed	2025-01-05 04:32:07.135318+00
de69ea15-df7f-4689-93d9-3176747ac788	2f6a0b4d-ff98-443f-a347-bc1c2e867bf5	90c8bc6d-8bfd-46c0-aca0-528cb60346ff	67b073d4-c07b-4f32-97c5-d64e4797044e	Handyman service needed in Mandaue City. Urgent repair needed.	2025-05-16 22:58:35.253718+00	\N	2025-11-26 12:29:10.764118+00	\N	completed	2024-12-22 02:18:58.936918+00
1ec0b554-d128-4ad5-aaaa-477b2435c798	c02b1823-7eec-4776-812e-b2a42402a542	90c8bc6d-8bfd-46c0-aca0-528cb60346ff	67b073d4-c07b-4f32-97c5-d64e4797044e	Handyman service needed in Mandaue City. Regular maintenance required.	2025-05-11 23:26:16.984918+00	\N	2025-05-12 18:40:27.880918+00	\N	completed	2025-11-05 15:09:00.818518+00
25131c35-c3fd-47e8-9628-2174f2853a13	8568204d-bac8-4bd2-be49-666099493157	90c8bc6d-8bfd-46c0-aca0-528cb60346ff	67b073d4-c07b-4f32-97c5-d64e4797044e	Handyman service needed in Mandaue City. Installation and setup.	2025-03-30 16:37:48.156118+00	\N	2025-05-21 09:20:23.551318+00	\N	completed	2025-04-10 08:36:47.964118+00
6e037108-bad3-4ea4-94fb-7691f285ab7f	3505bad0-2d27-427b-ae95-3169a5838fbf	90c8bc6d-8bfd-46c0-aca0-528cb60346ff	67b073d4-c07b-4f32-97c5-d64e4797044e	Handyman service needed in Mandaue City. Inspection and consultation.	2025-05-16 23:16:21.516118+00	\N	2025-11-14 22:03:08.940118+00	\N	completed	2025-02-19 12:25:30.703318+00
d266287b-45ef-48c5-815f-c8a763084637	5be0cd9f-a466-4485-ac43-bdc4b104ecc0	90c8bc6d-8bfd-46c0-aca0-528cb60346ff	67b073d4-c07b-4f32-97c5-d64e4797044e	Handyman service needed in Mandaue City. General service request.	2025-04-24 06:28:23.330518+00	\N	2025-11-16 06:41:10.303318+00	\N	completed	2025-10-18 09:26:32.997718+00
f1103b19-da6c-4a30-b678-b0d19825ab86	ee82e0a0-0f37-4a6f-ae93-2113eddeb55c	90c8bc6d-8bfd-46c0-aca0-528cb60346ff	67b073d4-c07b-4f32-97c5-d64e4797044e	Handyman service needed in Mandaue City. Urgent repair needed.	2025-07-07 12:30:22.994518+00	\N	2025-05-15 01:59:51.458518+00	\N	completed	2025-10-28 10:18:41.455318+00
685795f2-9130-4b8f-af21-9dbed316a6af	40ec397a-f1cf-4855-8a3a-c5673fb20e05	90c8bc6d-8bfd-46c0-aca0-528cb60346ff	67b073d4-c07b-4f32-97c5-d64e4797044e	Handyman service needed in Mandaue City. Regular maintenance required.	2025-10-24 23:25:21.170518+00	\N	2025-08-22 13:45:01.192918+00	\N	completed	2025-11-07 04:05:38.152918+00
969453ea-af31-4740-8863-45905599932f	3505bad0-2d27-427b-ae95-3169a5838fbf	ffdae030-82ae-435b-a1a4-10ecbd39dd6b	19a03c30-e580-4bda-bec4-d59fb737e8e0	Carpenter service needed in Lapu-Lapu. Inspection and consultation.	2025-10-14 05:24:30.453718+00	\N	\N	\N	pending	2025-10-08 11:13:18.520918+00
f80ee73b-dcbc-4af0-8396-d8c6f22a3b62	5be0cd9f-a466-4485-ac43-bdc4b104ecc0	ffdae030-82ae-435b-a1a4-10ecbd39dd6b	19a03c30-e580-4bda-bec4-d59fb737e8e0	Carpenter service needed in Lapu-Lapu. General service request.	2025-09-09 11:48:58.908118+00	\N	2025-02-23 09:24:50.354518+00	\N	completed	2025-04-18 08:02:19.375318+00
e8a38677-82d6-4d8e-9cfe-7d4582c48695	ee82e0a0-0f37-4a6f-ae93-2113eddeb55c	ffdae030-82ae-435b-a1a4-10ecbd39dd6b	19a03c30-e580-4bda-bec4-d59fb737e8e0	Carpenter service needed in Lapu-Lapu. Urgent repair needed.	2025-03-15 21:30:17.810518+00	\N	2025-06-02 07:54:39.727318+00	\N	completed	2025-05-01 06:39:54.271318+00
e456e8d7-fe64-4a90-952e-d1d74442d2b7	40ec397a-f1cf-4855-8a3a-c5673fb20e05	ffdae030-82ae-435b-a1a4-10ecbd39dd6b	19a03c30-e580-4bda-bec4-d59fb737e8e0	Carpenter service needed in Lapu-Lapu. Regular maintenance required.	2025-01-16 11:52:32.143318+00	\N	2025-05-14 06:34:31.826518+00	\N	completed	2025-12-14 04:04:34.735318+00
1a62ddec-96a5-410b-b936-74447469272e	0897825a-ab99-41e9-98ba-b4ed822155a5	ffdae030-82ae-435b-a1a4-10ecbd39dd6b	19a03c30-e580-4bda-bec4-d59fb737e8e0	Carpenter service needed in Lapu-Lapu. Installation and setup.	2025-06-26 01:31:10.543318+00	\N	2025-03-27 08:13:34.591318+00	\N	completed	2025-05-26 14:24:53.090518+00
f22c0078-816c-4c0f-a369-30a7367be5e9	b19b93f9-ccf5-4b17-bdcf-a105d11018af	ffdae030-82ae-435b-a1a4-10ecbd39dd6b	19a03c30-e580-4bda-bec4-d59fb737e8e0	Carpenter service needed in Lapu-Lapu. Inspection and consultation.	2025-03-26 11:39:12.597718+00	\N	2025-03-16 07:24:02.690518+00	\N	completed	2025-12-06 06:59:59.032918+00
ed820f22-3747-4be7-9a84-fb60f3adb926	6fc15c3f-2c63-4a80-b499-3744ac6c5e0a	ffdae030-82ae-435b-a1a4-10ecbd39dd6b	19a03c30-e580-4bda-bec4-d59fb737e8e0	Carpenter service needed in Lapu-Lapu. General service request.	2025-02-24 06:58:30.040918+00	\N	2025-08-16 22:39:00.645718+00	\N	completed	2025-03-27 16:13:58.322518+00
9482e749-86d9-4aa9-8b45-7943586f9e16	97c5f2cc-ef11-452a-9aa3-b4705f3280f8	ffdae030-82ae-435b-a1a4-10ecbd39dd6b	19a03c30-e580-4bda-bec4-d59fb737e8e0	Carpenter service needed in Lapu-Lapu. Urgent repair needed.	2025-08-11 15:42:24.780118+00	\N	2025-11-23 06:35:11.397718+00	\N	completed	2025-09-11 13:58:29.378518+00
f10817fd-612b-4e8d-8844-23a0c189683c	97c5f2cc-ef11-452a-9aa3-b4705f3280f8	96eaea48-f243-41e6-8c5c-db8c475a5dcd	2fd74584-4526-428d-b506-d92de93f45b1	Electrician service needed in Davao City. Urgent repair needed.	2025-11-26 05:32:13.903318+00	\N	\N	\N	pending	2025-03-12 21:40:24.165718+00
3f02ae6f-bca0-430b-8b31-cfd0d768d261	1be14a91-1b2c-48d6-8465-d1d4d12a785c	96eaea48-f243-41e6-8c5c-db8c475a5dcd	2fd74584-4526-428d-b506-d92de93f45b1	Electrician service needed in Davao City. Regular maintenance required.	2025-06-12 12:57:56.863318+00	\N	2025-12-03 17:46:35.052118+00	\N	completed	2025-05-12 06:29:45.756118+00
032f78e8-c10a-4730-a82a-97ea58e7099b	4cfa17c8-4d9f-4283-97f2-3a4976248b91	96eaea48-f243-41e6-8c5c-db8c475a5dcd	2fd74584-4526-428d-b506-d92de93f45b1	Electrician service needed in Davao City. Installation and setup.	2025-09-21 12:24:55.192918+00	\N	2025-10-13 11:12:18.300118+00	\N	completed	2025-07-07 13:11:35.935318+00
bc2a79df-8892-443e-afb0-d26fbb6a74a6	57dfd528-5470-40a1-8fde-40eb61dd7ae1	96eaea48-f243-41e6-8c5c-db8c475a5dcd	2fd74584-4526-428d-b506-d92de93f45b1	Electrician service needed in Davao City. Inspection and consultation.	2025-06-13 16:05:57.852118+00	\N	2025-10-15 21:39:23.944918+00	\N	completed	2025-04-24 18:25:13.250518+00
e2e43eff-9bcf-421b-ade8-273b880f00ca	3cc9e6b9-d7d7-4d91-904b-65aeb230b14b	96eaea48-f243-41e6-8c5c-db8c475a5dcd	2fd74584-4526-428d-b506-d92de93f45b1	Electrician service needed in Davao City. General service request.	2025-06-26 23:09:03.986518+00	\N	2025-12-15 00:33:28.754518+00	\N	completed	2025-11-07 14:12:09.573718+00
8a5964cd-8f2d-4848-a968-f3cc865aaf99	8d3c4c94-5ab8-4070-a7cc-a12e88219bf3	170ee8a2-3694-4aa3-a02b-aeba5f7c3a31	8a10c3b6-f3d9-4e9d-89c3-0e47b7c652d0	Roofer service needed in Cagayan de Oro. Installation and setup.	2025-01-26 15:23:28.965718+00	\N	\N	\N	pending	2025-06-26 21:26:55.461718+00
a5138469-dca9-4532-a70d-cd354a67dc42	158e9458-44c9-4638-83b9-bf0c99bdb64a	170ee8a2-3694-4aa3-a02b-aeba5f7c3a31	8a10c3b6-f3d9-4e9d-89c3-0e47b7c652d0	Roofer service needed in Cagayan de Oro. Inspection and consultation.	2025-10-29 22:21:14.124118+00	\N	\N	\N	canceled	2025-05-29 00:44:07.941718+00
efd896fe-a035-416c-bd9c-7c1b04ac3aaa	503f2221-11c2-4415-9a5b-9b0e81e95b67	170ee8a2-3694-4aa3-a02b-aeba5f7c3a31	8a10c3b6-f3d9-4e9d-89c3-0e47b7c652d0	Roofer service needed in Cagayan de Oro. General service request.	2025-04-24 23:22:33.813718+00	\N	2025-04-18 16:07:27.794518+00	\N	completed	2025-09-08 16:07:39.976918+00
33f5bd5f-8908-444f-bda6-0a0cee2491f7	5eae5e90-1914-41e5-be8a-aef4314d4892	170ee8a2-3694-4aa3-a02b-aeba5f7c3a31	8a10c3b6-f3d9-4e9d-89c3-0e47b7c652d0	Roofer service needed in Cagayan de Oro. Urgent repair needed.	2025-09-29 00:57:54.962518+00	\N	2025-11-13 18:26:41.637718+00	\N	completed	2025-07-09 04:49:23.157718+00
5446d2e4-a276-4a7e-bf8b-6afd2eb4a8df	4893cb6b-0ffd-422a-b940-7b9201daa34f	170ee8a2-3694-4aa3-a02b-aeba5f7c3a31	8a10c3b6-f3d9-4e9d-89c3-0e47b7c652d0	Roofer service needed in Cagayan de Oro. Regular maintenance required.	2025-08-04 11:34:42.165718+00	\N	2025-12-17 00:03:30.597718+00	\N	completed	2025-02-19 01:31:01.816918+00
36cdede5-0867-4562-a0c5-545ca2633194	218a9cdd-7d3a-44c9-bd7a-d885d38d6063	170ee8a2-3694-4aa3-a02b-aeba5f7c3a31	8a10c3b6-f3d9-4e9d-89c3-0e47b7c652d0	Roofer service needed in Cagayan de Oro. Installation and setup.	2025-05-23 10:08:26.719318+00	\N	2025-09-14 18:47:20.786518+00	\N	completed	2025-01-18 20:23:24.703318+00
af698657-6b64-4546-a05d-6da754d20398	4eea189c-607a-466d-8f92-1f53d790fb6f	170ee8a2-3694-4aa3-a02b-aeba5f7c3a31	8a10c3b6-f3d9-4e9d-89c3-0e47b7c652d0	Roofer service needed in Cagayan de Oro. Inspection and consultation.	2025-09-26 07:51:12.280918+00	\N	2025-05-11 17:27:43.125718+00	\N	completed	2025-06-16 07:06:26.364118+00
932ff282-aa9f-48db-b9a6-eb54795cf043	5c74fdb2-b4d9-4f4b-9c6c-f6b72854db84	170ee8a2-3694-4aa3-a02b-aeba5f7c3a31	8a10c3b6-f3d9-4e9d-89c3-0e47b7c652d0	Roofer service needed in Cagayan de Oro. General service request.	2025-06-11 18:06:05.426518+00	\N	2025-05-24 00:41:56.268118+00	\N	completed	2025-06-13 00:28:14.344918+00
dbd2db74-93b2-4160-a563-0a92fc6b2c54	9e61d17b-97a4-45e7-a26c-4fdc3086cdb7	170ee8a2-3694-4aa3-a02b-aeba5f7c3a31	8a10c3b6-f3d9-4e9d-89c3-0e47b7c652d0	Roofer service needed in Cagayan de Oro. Urgent repair needed.	2025-11-13 03:56:53.359318+00	\N	2025-09-28 17:46:08.527318+00	\N	completed	2025-10-25 03:06:06.808918+00
fbceb685-3979-476f-bcdd-84fe551593e0	6302ea1c-5af4-4302-918a-c87152175bae	170ee8a2-3694-4aa3-a02b-aeba5f7c3a31	8a10c3b6-f3d9-4e9d-89c3-0e47b7c652d0	Roofer service needed in Cagayan de Oro. Regular maintenance required.	2025-09-19 20:06:40.389718+00	\N	2025-07-01 18:56:15.256918+00	\N	completed	2025-02-18 07:09:53.983318+00
db37aa58-bca7-4b37-9baf-3bb0c1dc92d6	a3563a32-75c5-4d0b-b672-9f548fe69a06	170ee8a2-3694-4aa3-a02b-aeba5f7c3a31	8a10c3b6-f3d9-4e9d-89c3-0e47b7c652d0	Roofer service needed in Cagayan de Oro. Installation and setup.	2025-08-03 05:16:07.000918+00	\N	2025-04-02 15:48:22.216918+00	\N	completed	2025-07-27 15:17:01.548118+00
7599fc3f-c188-4ece-a6e3-afbe3195bb71	5fcd65e1-d364-4762-a7e2-9939ef039247	170ee8a2-3694-4aa3-a02b-aeba5f7c3a31	8a10c3b6-f3d9-4e9d-89c3-0e47b7c652d0	Roofer service needed in Cagayan de Oro. Inspection and consultation.	2025-07-06 19:06:38.892118+00	\N	2025-11-04 15:34:52.130518+00	\N	completed	2025-03-21 19:58:00.261718+00
90ccc409-e1d0-48f5-a039-f527ccf59817	5c74fdb2-b4d9-4f4b-9c6c-f6b72854db84	3b4010dd-6e26-45f0-a020-8626a8357589	45138e1c-7f74-4a2e-b43c-86f41855fac4	HVAC Technician service needed in Iloilo City. General service request.	2025-04-03 07:34:14.748118+00	\N	\N	\N	pending	2025-01-17 00:30:15.650518+00
dfb7f0de-fc81-4958-bd5c-92bd46ae650b	9e61d17b-97a4-45e7-a26c-4fdc3086cdb7	3b4010dd-6e26-45f0-a020-8626a8357589	45138e1c-7f74-4a2e-b43c-86f41855fac4	HVAC Technician service needed in Iloilo City. Urgent repair needed.	2025-05-08 00:08:07.336918+00	\N	2025-05-30 09:10:16.332118+00	\N	completed	2025-06-17 23:44:50.076118+00
4737f301-12da-4ccc-92d9-8e0700d26e1b	6302ea1c-5af4-4302-918a-c87152175bae	3b4010dd-6e26-45f0-a020-8626a8357589	45138e1c-7f74-4a2e-b43c-86f41855fac4	HVAC Technician service needed in Iloilo City. Regular maintenance required.	2025-03-06 16:31:14.863318+00	\N	2025-06-03 05:39:07.845718+00	\N	completed	2025-03-13 05:45:29.820118+00
cbb97b88-caa0-4467-ac6c-3718dc6d6e37	a3563a32-75c5-4d0b-b672-9f548fe69a06	3b4010dd-6e26-45f0-a020-8626a8357589	45138e1c-7f74-4a2e-b43c-86f41855fac4	HVAC Technician service needed in Iloilo City. Installation and setup.	2025-09-06 08:49:05.474518+00	\N	2025-04-04 10:18:51.045718+00	\N	completed	2025-11-11 20:05:27.122518+00
ae1a3eb7-1bd1-4056-ac7b-0fc66b8adeeb	5fcd65e1-d364-4762-a7e2-9939ef039247	3b4010dd-6e26-45f0-a020-8626a8357589	45138e1c-7f74-4a2e-b43c-86f41855fac4	HVAC Technician service needed in Iloilo City. Inspection and consultation.	2025-03-02 03:17:35.762518+00	\N	2025-03-16 21:09:28.466518+00	\N	completed	2025-10-01 02:32:59.522518+00
9e124032-a2e0-49a4-b08d-f4afd29ea977	649a4947-627c-43f2-9c5e-b75f213a0d93	3b4010dd-6e26-45f0-a020-8626a8357589	45138e1c-7f74-4a2e-b43c-86f41855fac4	HVAC Technician service needed in Iloilo City. General service request.	2025-08-17 08:59:13.989718+00	\N	2025-10-13 17:56:15.573718+00	\N	completed	2025-03-19 04:47:05.868118+00
f812e27e-4ce5-4403-959e-2ed3be827c06	3c6ff2a2-e59e-48af-8a8e-9238dc49ecc6	3b4010dd-6e26-45f0-a020-8626a8357589	45138e1c-7f74-4a2e-b43c-86f41855fac4	HVAC Technician service needed in Iloilo City. Urgent repair needed.	2025-05-28 14:57:03.439318+00	\N	2025-09-13 17:55:34.188118+00	\N	completed	2025-02-12 14:17:21.996118+00
634a4b28-97bb-4df1-a78e-175c4f045d47	496d267d-f0aa-4592-a87a-bd69e1196f23	3b4010dd-6e26-45f0-a020-8626a8357589	45138e1c-7f74-4a2e-b43c-86f41855fac4	HVAC Technician service needed in Iloilo City. Regular maintenance required.	2025-07-01 20:50:35.676118+00	\N	2025-04-05 03:23:16.437718+00	\N	completed	2025-05-04 01:37:26.383318+00
9eb2fc47-9e27-4929-b386-cc80fd8273df	5c328f75-464c-4053-a41e-00fbc6eba934	3b4010dd-6e26-45f0-a020-8626a8357589	45138e1c-7f74-4a2e-b43c-86f41855fac4	HVAC Technician service needed in Iloilo City. Installation and setup.	2025-02-21 19:25:13.365718+00	\N	2025-09-28 22:12:41.253718+00	\N	completed	2025-07-03 11:00:05.455318+00
4f7ee5af-37a5-4e7e-8a6c-b3dfbeb0e4ba	496d267d-f0aa-4592-a87a-bd69e1196f23	068750c2-3598-4ca7-b7f0-2d457def57ae	8ec0536f-dc92-40ba-87d8-f60e42a55db6	Cleaner service needed in Baguio. Regular maintenance required.	2025-02-17 07:08:22.658518+00	\N	\N	\N	pending	2025-10-30 12:33:29.704918+00
9ddf93c6-4396-4635-92df-66d6415bbde6	5c328f75-464c-4053-a41e-00fbc6eba934	068750c2-3598-4ca7-b7f0-2d457def57ae	8ec0536f-dc92-40ba-87d8-f60e42a55db6	Cleaner service needed in Baguio. Installation and setup.	2025-04-14 06:25:12.386518+00	\N	2025-05-08 19:45:08.623318+00	\N	completed	2025-08-15 09:07:26.988118+00
6761800a-a10d-49bd-bfcb-0d59a9d9cb48	bed6bf7a-bfbb-4eac-b6d7-35ca3e7d6660	068750c2-3598-4ca7-b7f0-2d457def57ae	8ec0536f-dc92-40ba-87d8-f60e42a55db6	Cleaner service needed in Baguio. Inspection and consultation.	2025-12-06 21:55:11.234518+00	\N	2025-09-19 18:43:13.336918+00	\N	completed	2025-01-07 23:09:07.010518+00
4a6038b9-33d4-43e0-8d3a-1cafca0bd4e3	549f87d2-961e-48f8-bcff-7286d7db879e	068750c2-3598-4ca7-b7f0-2d457def57ae	8ec0536f-dc92-40ba-87d8-f60e42a55db6	Cleaner service needed in Baguio. General service request.	2025-07-25 17:58:41.330518+00	\N	2025-04-30 04:36:39.468118+00	\N	completed	2025-02-12 07:38:57.016918+00
a3119406-8f15-4317-965b-97ea90eb19eb	a8957421-6c24-4110-ad8a-89513c6cfe93	068750c2-3598-4ca7-b7f0-2d457def57ae	8ec0536f-dc92-40ba-87d8-f60e42a55db6	Cleaner service needed in Baguio. Urgent repair needed.	2025-10-26 16:40:00.002518+00	\N	2025-11-02 03:03:35.176918+00	\N	completed	2025-03-17 16:10:13.509718+00
4a44867a-d1ce-4afa-a7ae-a932c0aff1d0	ded07a3d-2dc7-40f1-a9df-81b72c989abf	068750c2-3598-4ca7-b7f0-2d457def57ae	8ec0536f-dc92-40ba-87d8-f60e42a55db6	Cleaner service needed in Baguio. Regular maintenance required.	2025-04-16 08:33:09.544918+00	\N	2025-04-18 19:23:23.464918+00	\N	completed	2025-09-29 02:48:49.404118+00
2debeac7-1ae1-40d3-aedc-f10893c490c1	2594b276-c01e-4543-b2b5-0cd20667b7a6	15d2e617-64e9-40af-a836-b3d19a6dd3bb	368f7187-4490-4015-84fa-20a4f46eea09	Locksmith service needed in Manila. Inspection and consultation.	2025-09-16 07:46:20.594518+00	\N	\N	\N	pending	2025-09-14 11:20:13.586518+00
f9a495d9-96a0-4294-b09c-a41d50c06099	216ebdf7-cd45-4b40-86f2-268b4e33bb68	15d2e617-64e9-40af-a836-b3d19a6dd3bb	368f7187-4490-4015-84fa-20a4f46eea09	Locksmith service needed in Manila. General service request.	2025-02-18 15:06:29.013718+00	\N	\N	\N	canceled	2025-11-17 17:19:28.053718+00
73f595c6-c91b-4b62-8764-4698b3fa4894	f74860cc-f981-42b4-809d-11e92bedd14f	15d2e617-64e9-40af-a836-b3d19a6dd3bb	368f7187-4490-4015-84fa-20a4f46eea09	Locksmith service needed in Manila. Urgent repair needed.	2025-12-03 07:41:13.269718+00	\N	2025-09-20 10:06:44.594518+00	\N	completed	2025-10-08 23:13:45.650518+00
e5f55f15-ff0e-4fb4-a246-de7b365992b7	d951675f-497c-4ccb-b55d-6a72f9cfb8fc	15d2e617-64e9-40af-a836-b3d19a6dd3bb	368f7187-4490-4015-84fa-20a4f46eea09	Locksmith service needed in Manila. Regular maintenance required.	2025-11-11 11:36:42.693718+00	\N	2025-11-03 07:36:10.178518+00	\N	completed	2025-06-19 10:43:44.556118+00
9bcaede5-c59f-4b16-889c-c61eb8616343	dd3b46e4-576f-488e-928f-a5a2688e0fd4	15d2e617-64e9-40af-a836-b3d19a6dd3bb	368f7187-4490-4015-84fa-20a4f46eea09	Locksmith service needed in Manila. Installation and setup.	2025-11-22 10:59:55.692118+00	\N	2025-09-23 03:45:42.463318+00	\N	completed	2025-03-13 10:40:04.581718+00
8f2f7aca-1fce-40e6-8c97-b2111885c09c	7d6e1a27-d7f8-445f-a544-81c817a39304	15d2e617-64e9-40af-a836-b3d19a6dd3bb	368f7187-4490-4015-84fa-20a4f46eea09	Locksmith service needed in Manila. Inspection and consultation.	2025-04-12 13:52:48.876118+00	\N	2025-11-12 17:08:13.874518+00	\N	completed	2025-05-02 05:41:51.487318+00
4183675e-3c07-4d1d-a954-789600a94ba3	088c7759-5ee8-4fd2-99fa-6d6953d6e99c	15d2e617-64e9-40af-a836-b3d19a6dd3bb	368f7187-4490-4015-84fa-20a4f46eea09	Locksmith service needed in Manila. General service request.	2024-12-28 21:52:33.208918+00	\N	2025-09-11 12:11:18.194518+00	\N	completed	2025-04-22 19:12:32.786518+00
2b407e9e-dfcb-4fdd-ad0e-6e13f28760cc	ce930397-85a0-4a2c-9d12-343341780701	15d2e617-64e9-40af-a836-b3d19a6dd3bb	368f7187-4490-4015-84fa-20a4f46eea09	Locksmith service needed in Manila. Urgent repair needed.	2025-12-10 08:52:02.680918+00	\N	2025-08-19 18:18:52.053718+00	\N	completed	2025-01-12 05:37:45.679318+00
f08eec83-eaaf-42b5-baab-583127d353f0	2637c6dd-5fbe-487c-85c5-3ef87dc74cf5	15d2e617-64e9-40af-a836-b3d19a6dd3bb	368f7187-4490-4015-84fa-20a4f46eea09	Locksmith service needed in Manila. Regular maintenance required.	2025-01-12 23:50:21.074518+00	\N	2025-09-21 10:42:48.396118+00	\N	completed	2025-02-23 00:12:43.471318+00
8ce12954-68ba-4577-8f60-f517a84a88d6	d4d09b07-6022-4d29-8d83-2905a67c2fb0	15d2e617-64e9-40af-a836-b3d19a6dd3bb	368f7187-4490-4015-84fa-20a4f46eea09	Locksmith service needed in Manila. Installation and setup.	2025-09-06 23:36:22.562518+00	\N	2025-05-28 20:55:20.364118+00	\N	completed	2025-09-25 10:29:57.967318+00
ea4e200c-7d71-47c1-ae5a-0626035d36a3	9c0e3b56-4094-4a57-b207-abb436a8fe3d	15d2e617-64e9-40af-a836-b3d19a6dd3bb	368f7187-4490-4015-84fa-20a4f46eea09	Locksmith service needed in Manila. Inspection and consultation.	2025-12-05 17:23:09.496918+00	\N	2025-11-11 02:16:08.383318+00	\N	completed	2025-11-13 19:36:34.975318+00
8b8bad8e-6da6-4f84-b08f-6e2b76b6c4d2	6e0bbfe1-f2fd-4356-8684-bc8d8fb15a28	15d2e617-64e9-40af-a836-b3d19a6dd3bb	368f7187-4490-4015-84fa-20a4f46eea09	Locksmith service needed in Manila. General service request.	2025-09-24 19:19:44.354518+00	\N	2025-11-09 20:17:12.664918+00	\N	completed	2025-09-13 11:03:26.853718+00
1f7f52da-05cd-4679-8de0-84e74fa631ec	2f6a0b4d-ff98-443f-a347-bc1c2e867bf5	15d2e617-64e9-40af-a836-b3d19a6dd3bb	368f7187-4490-4015-84fa-20a4f46eea09	Locksmith service needed in Manila. Urgent repair needed.	2025-03-13 08:46:18.808918+00	\N	2025-11-14 06:44:19.778518+00	\N	completed	2025-01-19 14:50:43.797718+00
d9634b2b-a163-42fa-9b67-d0280591e17c	ce930397-85a0-4a2c-9d12-343341780701	f04f5ddb-af57-4ae7-8a8c-ac18cf63f9f3	fa26da00-47e3-4456-8d91-ef631d37234a	Landscaper service needed in Quezon City. Urgent repair needed.	2025-09-30 12:21:26.796118+00	\N	\N	\N	pending	2025-07-31 18:37:19.615318+00
6c8b77e5-a0ea-4c5f-af4f-233245142d19	2637c6dd-5fbe-487c-85c5-3ef87dc74cf5	f04f5ddb-af57-4ae7-8a8c-ac18cf63f9f3	fa26da00-47e3-4456-8d91-ef631d37234a	Landscaper service needed in Quezon City. Regular maintenance required.	2025-11-17 04:22:28.168918+00	\N	2025-10-22 19:32:12.924118+00	\N	completed	2025-09-13 18:13:16.562518+00
fc385615-f22a-4d3b-ad3e-8491155c6b3e	d4d09b07-6022-4d29-8d83-2905a67c2fb0	f04f5ddb-af57-4ae7-8a8c-ac18cf63f9f3	fa26da00-47e3-4456-8d91-ef631d37234a	Landscaper service needed in Quezon City. Installation and setup.	2025-02-27 10:35:01.317718+00	\N	2025-03-28 11:05:36.021718+00	\N	completed	2025-03-18 16:00:43.269718+00
80ba8489-032a-42d3-889e-a9f6885c000c	9c0e3b56-4094-4a57-b207-abb436a8fe3d	f04f5ddb-af57-4ae7-8a8c-ac18cf63f9f3	fa26da00-47e3-4456-8d91-ef631d37234a	Landscaper service needed in Quezon City. Inspection and consultation.	2025-11-20 19:14:14.911318+00	\N	2025-10-11 12:18:20.085718+00	\N	completed	2025-06-04 21:29:30.981718+00
eed12e9c-91a8-48f5-9c51-a89a938bd36a	6e0bbfe1-f2fd-4356-8684-bc8d8fb15a28	f04f5ddb-af57-4ae7-8a8c-ac18cf63f9f3	fa26da00-47e3-4456-8d91-ef631d37234a	Landscaper service needed in Quezon City. General service request.	2025-10-21 06:04:52.418518+00	\N	2025-10-01 23:57:02.748118+00	\N	completed	2025-11-08 01:37:25.605718+00
ac1b7358-1eda-4059-8e5d-5c3fd6be229b	2f6a0b4d-ff98-443f-a347-bc1c2e867bf5	f04f5ddb-af57-4ae7-8a8c-ac18cf63f9f3	fa26da00-47e3-4456-8d91-ef631d37234a	Landscaper service needed in Quezon City. Urgent repair needed.	2025-03-10 06:38:35.733718+00	\N	2025-04-02 15:32:43.653718+00	\N	completed	2025-09-30 13:49:27.564118+00
e69bd3d9-f1db-489a-b595-96dce17665ab	c02b1823-7eec-4776-812e-b2a42402a542	f04f5ddb-af57-4ae7-8a8c-ac18cf63f9f3	fa26da00-47e3-4456-8d91-ef631d37234a	Landscaper service needed in Quezon City. Regular maintenance required.	2025-02-04 06:54:39.698518+00	\N	2025-07-23 22:03:35.032918+00	\N	completed	2025-03-07 12:33:10.524118+00
69883a29-5e0b-4b12-b5e3-0f1df8b65063	8568204d-bac8-4bd2-be49-666099493157	f04f5ddb-af57-4ae7-8a8c-ac18cf63f9f3	fa26da00-47e3-4456-8d91-ef631d37234a	Landscaper service needed in Quezon City. Installation and setup.	2025-04-03 04:11:40.428118+00	\N	2025-11-10 08:41:52.869718+00	\N	completed	2025-10-11 23:07:34.735318+00
5f35ebf6-dc27-42c1-85e4-b225fe3fbb6b	3505bad0-2d27-427b-ae95-3169a5838fbf	f04f5ddb-af57-4ae7-8a8c-ac18cf63f9f3	fa26da00-47e3-4456-8d91-ef631d37234a	Landscaper service needed in Quezon City. Inspection and consultation.	2025-10-02 06:01:13.653718+00	\N	2025-05-17 01:40:00.866518+00	\N	completed	2025-01-30 23:59:58.140118+00
80e40ea3-cf51-41ab-97b0-fdcec6a1c241	5be0cd9f-a466-4485-ac43-bdc4b104ecc0	f04f5ddb-af57-4ae7-8a8c-ac18cf63f9f3	fa26da00-47e3-4456-8d91-ef631d37234a	Landscaper service needed in Quezon City. General service request.	2025-01-09 14:43:07.605718+00	\N	2025-11-30 23:28:48.444118+00	\N	completed	2025-10-05 08:44:32.709718+00
7a804dc5-5173-4577-a66e-3ac11993fe58	8568204d-bac8-4bd2-be49-666099493157	e5d667b8-6cb8-470f-b72a-e91776ec2798	ff8acab6-8c85-4fb8-af36-781b98920efb	Painter service needed in Makati. Installation and setup.	2025-04-21 06:38:11.196118+00	\N	\N	\N	pending	2025-08-13 22:47:29.628118+00
6a49e083-2606-4102-86ba-b318c9a372ed	3505bad0-2d27-427b-ae95-3169a5838fbf	e5d667b8-6cb8-470f-b72a-e91776ec2798	ff8acab6-8c85-4fb8-af36-781b98920efb	Painter service needed in Makati. Inspection and consultation.	2025-10-01 03:54:10.063318+00	\N	2025-11-21 19:52:22.610518+00	\N	completed	2025-12-17 14:06:30.108118+00
8d17b321-e75c-4e2d-9ed6-01b412169ad7	5be0cd9f-a466-4485-ac43-bdc4b104ecc0	e5d667b8-6cb8-470f-b72a-e91776ec2798	ff8acab6-8c85-4fb8-af36-781b98920efb	Painter service needed in Makati. General service request.	2025-03-10 08:51:36.156118+00	\N	2025-11-10 17:28:40.236118+00	\N	completed	2024-12-24 07:00:29.791318+00
0cefe255-a977-43fb-bcf6-cf99bb5dc907	ee82e0a0-0f37-4a6f-ae93-2113eddeb55c	e5d667b8-6cb8-470f-b72a-e91776ec2798	ff8acab6-8c85-4fb8-af36-781b98920efb	Painter service needed in Makati. Urgent repair needed.	2025-03-09 10:34:07.404118+00	\N	2025-04-09 13:20:36.108118+00	\N	completed	2025-03-11 19:14:54.568918+00
1f84f930-569d-4e32-bf3f-28f0f95355d4	40ec397a-f1cf-4855-8a3a-c5673fb20e05	e5d667b8-6cb8-470f-b72a-e91776ec2798	ff8acab6-8c85-4fb8-af36-781b98920efb	Painter service needed in Makati. Regular maintenance required.	2025-11-24 03:08:20.037718+00	\N	2025-04-21 15:33:47.503318+00	\N	completed	2025-09-27 10:41:43.336918+00
4397e410-09a2-44b9-a85a-c6ca8ff91801	0897825a-ab99-41e9-98ba-b4ed822155a5	e5d667b8-6cb8-470f-b72a-e91776ec2798	ff8acab6-8c85-4fb8-af36-781b98920efb	Painter service needed in Makati. Installation and setup.	2025-10-01 01:48:24.578518+00	\N	2025-11-04 17:33:38.402518+00	\N	completed	2025-06-22 22:26:08.920918+00
f59280ac-86ef-49c5-a633-8758bb6dbabc	b19b93f9-ccf5-4b17-bdcf-a105d11018af	e5d667b8-6cb8-470f-b72a-e91776ec2798	ff8acab6-8c85-4fb8-af36-781b98920efb	Painter service needed in Makati. Inspection and consultation.	2025-04-03 18:29:48.348118+00	\N	2025-05-15 20:22:36.146518+00	\N	completed	2025-03-14 18:31:44.383318+00
a540606e-2292-4a89-8260-d703ce891f59	6fc15c3f-2c63-4a80-b499-3744ac6c5e0a	6eceabcf-8962-41b5-ae91-cd153cc581b9	c87b314f-ad10-4e91-b2e6-dbd8cdf13230	Plumber service needed in Taguig. General service request.	2025-05-31 22:10:01.154518+00	\N	\N	\N	pending	2025-07-03 09:31:09.218518+00
667e9690-445b-4d99-a072-5fd386ba3153	97c5f2cc-ef11-452a-9aa3-b4705f3280f8	6eceabcf-8962-41b5-ae91-cd153cc581b9	c87b314f-ad10-4e91-b2e6-dbd8cdf13230	Plumber service needed in Taguig. Urgent repair needed.	2025-06-18 17:14:19.432918+00	\N	2025-07-27 11:17:05.234518+00	\N	completed	2025-11-21 22:34:31.336918+00
22499737-de23-4354-b7d8-7d8516b73547	1be14a91-1b2c-48d6-8465-d1d4d12a785c	6eceabcf-8962-41b5-ae91-cd153cc581b9	c87b314f-ad10-4e91-b2e6-dbd8cdf13230	Plumber service needed in Taguig. Regular maintenance required.	2025-06-11 12:13:49.221718+00	\N	2025-11-07 11:00:25.327318+00	\N	completed	2025-10-12 20:40:10.744918+00
8c8a8c12-44fd-4650-bed8-88013c92383b	4cfa17c8-4d9f-4283-97f2-3a4976248b91	6eceabcf-8962-41b5-ae91-cd153cc581b9	c87b314f-ad10-4e91-b2e6-dbd8cdf13230	Plumber service needed in Taguig. Installation and setup.	2024-12-26 08:15:50.066518+00	\N	2025-04-21 11:32:08.373718+00	\N	completed	2024-12-28 15:16:10.485718+00
5aa58b75-5fa7-4f68-8873-89dddff31cab	57dfd528-5470-40a1-8fde-40eb61dd7ae1	6eceabcf-8962-41b5-ae91-cd153cc581b9	c87b314f-ad10-4e91-b2e6-dbd8cdf13230	Plumber service needed in Taguig. Inspection and consultation.	2025-06-15 15:32:53.935318+00	\N	2025-02-18 11:12:31.951318+00	\N	completed	2025-12-14 21:22:24.943318+00
19d839e2-1891-4925-95f9-aff48868ce99	3cc9e6b9-d7d7-4d91-904b-65aeb230b14b	6eceabcf-8962-41b5-ae91-cd153cc581b9	c87b314f-ad10-4e91-b2e6-dbd8cdf13230	Plumber service needed in Taguig. General service request.	2025-01-24 13:19:53.512918+00	\N	2025-05-07 17:40:37.010518+00	\N	completed	2025-03-25 05:52:30.933718+00
b03519c0-47ca-4a2a-a20a-a866da2ec9dc	ff8bb61b-1117-4f5c-880b-ac4ebd7ea6c2	6eceabcf-8962-41b5-ae91-cd153cc581b9	c87b314f-ad10-4e91-b2e6-dbd8cdf13230	Plumber service needed in Taguig. Urgent repair needed.	2025-08-06 07:07:31.855318+00	\N	2025-05-30 13:39:49.116118+00	\N	completed	2025-04-25 18:45:20.172118+00
ad431eb4-b573-463a-aab1-73de88130ea7	feaac7e1-3bc3-4462-b2f8-b4a19f990531	6eceabcf-8962-41b5-ae91-cd153cc581b9	c87b314f-ad10-4e91-b2e6-dbd8cdf13230	Plumber service needed in Taguig. Regular maintenance required.	2025-09-13 00:00:27.688918+00	\N	2025-11-19 16:16:28.140118+00	\N	completed	2025-12-13 07:24:37.682518+00
eab2fa37-fab4-43ac-90b5-6c9959fd231d	8d3c4c94-5ab8-4070-a7cc-a12e88219bf3	6eceabcf-8962-41b5-ae91-cd153cc581b9	c87b314f-ad10-4e91-b2e6-dbd8cdf13230	Plumber service needed in Taguig. Installation and setup.	2025-08-11 13:28:56.018518+00	\N	2025-09-22 18:47:52.322518+00	\N	completed	2025-05-28 08:41:29.109718+00
41b2a213-5c1c-4d10-9387-3d71ea865f2b	158e9458-44c9-4638-83b9-bf0c99bdb64a	6eceabcf-8962-41b5-ae91-cd153cc581b9	c87b314f-ad10-4e91-b2e6-dbd8cdf13230	Plumber service needed in Taguig. Inspection and consultation.	2025-02-11 06:31:15.784918+00	\N	2025-05-02 00:42:43.442518+00	\N	completed	2025-10-21 04:09:29.186518+00
d7088fda-0935-4f50-b8f5-7970648990b6	503f2221-11c2-4415-9a5b-9b0e81e95b67	6eceabcf-8962-41b5-ae91-cd153cc581b9	c87b314f-ad10-4e91-b2e6-dbd8cdf13230	Plumber service needed in Taguig. General service request.	2025-02-22 14:31:33.208918+00	\N	2025-11-03 23:36:24.031318+00	\N	completed	2025-10-25 15:37:41.301718+00
0b708249-b48f-47eb-9b1c-108280d905e4	5eae5e90-1914-41e5-be8a-aef4314d4892	6eceabcf-8962-41b5-ae91-cd153cc581b9	c87b314f-ad10-4e91-b2e6-dbd8cdf13230	Plumber service needed in Taguig. Urgent repair needed.	2025-07-10 16:23:37.116118+00	\N	2025-09-09 07:21:34.773718+00	\N	completed	2025-08-30 01:52:37.212118+00
c1423db8-4691-45d6-8015-9276edbc49e7	4893cb6b-0ffd-422a-b940-7b9201daa34f	6eceabcf-8962-41b5-ae91-cd153cc581b9	c87b314f-ad10-4e91-b2e6-dbd8cdf13230	Plumber service needed in Taguig. Regular maintenance required.	2025-11-29 16:46:36.837718+00	\N	2025-03-02 16:43:30.645718+00	\N	completed	2025-04-12 16:40:45.016918+00
73a557c6-f71c-4042-a3ab-e1c4dda29528	218a9cdd-7d3a-44c9-bd7a-d885d38d6063	6eceabcf-8962-41b5-ae91-cd153cc581b9	c87b314f-ad10-4e91-b2e6-dbd8cdf13230	Plumber service needed in Taguig. Installation and setup.	2025-11-09 14:48:15.535318+00	\N	2025-05-10 06:57:46.754518+00	\N	completed	2025-06-05 07:16:37.644118+00
8e5290ae-336e-42f3-848e-f9e606e7816d	feaac7e1-3bc3-4462-b2f8-b4a19f990531	60513923-0ed2-4d03-a195-f951c01708ef	67b073d4-c07b-4f32-97c5-d64e4797044e	Handyman service needed in Pasig. Regular maintenance required.	2025-01-06 23:26:39.103318+00	\N	\N	\N	pending	2025-09-24 06:27:49.807318+00
488abd51-37b6-4749-acbf-b1f979eb3db6	8d3c4c94-5ab8-4070-a7cc-a12e88219bf3	60513923-0ed2-4d03-a195-f951c01708ef	67b073d4-c07b-4f32-97c5-d64e4797044e	Handyman service needed in Pasig. Installation and setup.	2025-04-18 20:38:59.983318+00	\N	2025-11-02 15:48:01.394518+00	\N	completed	2025-06-13 02:45:30.424918+00
86c67a0c-17f0-4b31-97d1-fb237d5aa6e9	158e9458-44c9-4638-83b9-bf0c99bdb64a	60513923-0ed2-4d03-a195-f951c01708ef	67b073d4-c07b-4f32-97c5-d64e4797044e	Handyman service needed in Pasig. Inspection and consultation.	2025-06-23 22:11:36.453718+00	\N	2025-03-02 21:30:32.930518+00	\N	completed	2025-03-17 16:23:03.506518+00
1463ffe3-8775-44de-a415-0d344e21f217	503f2221-11c2-4415-9a5b-9b0e81e95b67	60513923-0ed2-4d03-a195-f951c01708ef	67b073d4-c07b-4f32-97c5-d64e4797044e	Handyman service needed in Pasig. General service request.	2025-12-07 13:40:24.626518+00	\N	2025-06-27 22:29:50.968918+00	\N	completed	2025-01-23 19:30:52.140118+00
461086ca-1a61-4152-9895-893a05cb6c2f	5eae5e90-1914-41e5-be8a-aef4314d4892	60513923-0ed2-4d03-a195-f951c01708ef	67b073d4-c07b-4f32-97c5-d64e4797044e	Handyman service needed in Pasig. Urgent repair needed.	2025-07-03 02:39:42.060118+00	\N	2025-07-30 01:31:26.008918+00	\N	completed	2025-12-11 05:51:47.906518+00
cb1f0f1c-3eb2-4201-b713-116f32c20934	4893cb6b-0ffd-422a-b940-7b9201daa34f	60513923-0ed2-4d03-a195-f951c01708ef	67b073d4-c07b-4f32-97c5-d64e4797044e	Handyman service needed in Pasig. Regular maintenance required.	2025-03-31 14:04:33.640918+00	\N	2025-09-21 13:06:09.170518+00	\N	completed	2025-04-05 16:13:48.040918+00
bc14bea0-d0a4-4a4b-8dcc-d828b55073b9	218a9cdd-7d3a-44c9-bd7a-d885d38d6063	60513923-0ed2-4d03-a195-f951c01708ef	67b073d4-c07b-4f32-97c5-d64e4797044e	Handyman service needed in Pasig. Installation and setup.	2025-01-10 07:53:41.839318+00	\N	2025-07-06 12:46:38.191318+00	\N	completed	2025-04-01 22:06:00.530518+00
b8a062b4-3127-4e42-ae63-8a4022a55aed	4eea189c-607a-466d-8f92-1f53d790fb6f	60513923-0ed2-4d03-a195-f951c01708ef	67b073d4-c07b-4f32-97c5-d64e4797044e	Handyman service needed in Pasig. Inspection and consultation.	2025-11-08 02:58:47.292118+00	\N	2025-05-10 17:27:10.898518+00	\N	completed	2025-07-26 19:37:54.722518+00
c377c533-4d65-4eca-9194-a04daeafc36c	5c74fdb2-b4d9-4f4b-9c6c-f6b72854db84	60513923-0ed2-4d03-a195-f951c01708ef	67b073d4-c07b-4f32-97c5-d64e4797044e	Handyman service needed in Pasig. General service request.	2025-07-22 16:29:43.020118+00	\N	2025-12-16 17:28:56.220118+00	\N	completed	2025-10-24 21:15:26.940118+00
07a87066-44d3-4ced-83be-a68b4d3b3f5e	9e61d17b-97a4-45e7-a26c-4fdc3086cdb7	60513923-0ed2-4d03-a195-f951c01708ef	67b073d4-c07b-4f32-97c5-d64e4797044e	Handyman service needed in Pasig. Urgent repair needed.	2025-02-19 21:09:38.661718+00	\N	2025-07-17 16:20:13.903318+00	\N	completed	2025-03-16 19:28:23.532118+00
114b7362-54b7-4e96-98d4-cd989c2d295c	6302ea1c-5af4-4302-918a-c87152175bae	60513923-0ed2-4d03-a195-f951c01708ef	67b073d4-c07b-4f32-97c5-d64e4797044e	Handyman service needed in Pasig. Regular maintenance required.	2025-03-18 23:03:01.279318+00	\N	2025-07-13 18:01:31.365718+00	\N	completed	2025-10-06 01:56:58.140118+00
7c2f8616-ad79-47c9-8f48-16ba2bda78ca	4eea189c-607a-466d-8f92-1f53d790fb6f	b5a8acc9-aae8-4a02-9c54-392273be2bed	19a03c30-e580-4bda-bec4-d59fb737e8e0	Carpenter service needed in Cebu City. Inspection and consultation.	2025-06-27 05:48:28.149718+00	\N	\N	\N	pending	2025-03-14 11:09:21.093718+00
0753abe9-5a50-4be3-96d0-27ee33a1c822	5c74fdb2-b4d9-4f4b-9c6c-f6b72854db84	b5a8acc9-aae8-4a02-9c54-392273be2bed	19a03c30-e580-4bda-bec4-d59fb737e8e0	Carpenter service needed in Cebu City. General service request.	2025-02-20 12:21:13.317718+00	\N	2025-07-05 00:42:10.351318+00	\N	completed	2025-01-07 11:39:22.015318+00
f77e81e7-fecd-47ff-81f6-d166eee6e302	9e61d17b-97a4-45e7-a26c-4fdc3086cdb7	b5a8acc9-aae8-4a02-9c54-392273be2bed	19a03c30-e580-4bda-bec4-d59fb737e8e0	Carpenter service needed in Cebu City. Urgent repair needed.	2025-03-13 09:13:18.808918+00	\N	2025-10-22 15:08:01.461718+00	\N	completed	2025-03-08 09:23:01.404118+00
0e7f9e7c-68c7-4046-af70-90bb7fd2a7a4	6302ea1c-5af4-4302-918a-c87152175bae	b5a8acc9-aae8-4a02-9c54-392273be2bed	19a03c30-e580-4bda-bec4-d59fb737e8e0	Carpenter service needed in Cebu City. Regular maintenance required.	2025-10-13 01:09:51.564118+00	\N	2025-07-23 00:35:12.520918+00	\N	completed	2025-03-12 18:55:11.234518+00
3e2f34ef-93c8-448c-824a-a2d9fea87b57	a3563a32-75c5-4d0b-b672-9f548fe69a06	b5a8acc9-aae8-4a02-9c54-392273be2bed	19a03c30-e580-4bda-bec4-d59fb737e8e0	Carpenter service needed in Cebu City. Installation and setup.	2025-06-14 07:03:54.040918+00	\N	2025-03-28 04:26:21.448918+00	\N	completed	2025-10-04 01:28:46.255318+00
ec98bd59-48cd-4824-8cd1-5c094fb1492d	5fcd65e1-d364-4762-a7e2-9939ef039247	b5a8acc9-aae8-4a02-9c54-392273be2bed	19a03c30-e580-4bda-bec4-d59fb737e8e0	Carpenter service needed in Cebu City. Inspection and consultation.	2025-03-25 17:25:08.815318+00	\N	2025-10-17 03:56:08.863318+00	\N	completed	2025-02-25 12:19:27.045718+00
18f07078-70bb-45a6-98ee-880fce3a5a7b	649a4947-627c-43f2-9c5e-b75f213a0d93	b5a8acc9-aae8-4a02-9c54-392273be2bed	19a03c30-e580-4bda-bec4-d59fb737e8e0	Carpenter service needed in Cebu City. General service request.	2025-06-16 23:00:25.845718+00	\N	2025-03-03 17:36:48.914518+00	\N	completed	2025-08-09 16:33:15.996118+00
1cba0b35-2882-4a5a-b2e8-1b1386b70168	3c6ff2a2-e59e-48af-8a8e-9238dc49ecc6	b5a8acc9-aae8-4a02-9c54-392273be2bed	19a03c30-e580-4bda-bec4-d59fb737e8e0	Carpenter service needed in Cebu City. Urgent repair needed.	2025-10-31 00:49:51.295318+00	\N	2025-04-29 23:08:42.127318+00	\N	completed	2025-08-25 03:30:18.933718+00
843d9aa6-e3f6-4ac8-a8fb-768fa693c96c	3c6ff2a2-e59e-48af-8a8e-9238dc49ecc6	3f72aef4-850b-401a-b6e2-b5524ee835e6	2fd74584-4526-428d-b506-d92de93f45b1	Electrician service needed in Mandaue City. Urgent repair needed.	2025-01-29 15:37:59.272918+00	\N	\N	\N	pending	2025-09-04 16:30:13.778518+00
6538e86e-4dc4-449b-89d9-eb65cfe5f9b3	496d267d-f0aa-4592-a87a-bd69e1196f23	3f72aef4-850b-401a-b6e2-b5524ee835e6	2fd74584-4526-428d-b506-d92de93f45b1	Electrician service needed in Mandaue City. Regular maintenance required.	2025-02-18 10:33:52.802518+00	\N	2025-06-30 07:28:09.535318+00	\N	completed	2025-06-22 18:13:40.063318+00
4b693479-30e7-46c4-a568-a4734502248d	5c328f75-464c-4053-a41e-00fbc6eba934	3f72aef4-850b-401a-b6e2-b5524ee835e6	2fd74584-4526-428d-b506-d92de93f45b1	Electrician service needed in Mandaue City. Installation and setup.	2025-01-31 06:23:42.184918+00	\N	2025-02-19 08:23:41.896918+00	\N	completed	2025-07-16 05:26:48.434518+00
6b396a7b-a879-4767-976b-23a153e86ac6	bed6bf7a-bfbb-4eac-b6d7-35ca3e7d6660	3f72aef4-850b-401a-b6e2-b5524ee835e6	2fd74584-4526-428d-b506-d92de93f45b1	Electrician service needed in Mandaue City. Inspection and consultation.	2025-01-15 13:12:12.309718+00	\N	2025-10-02 09:04:09.909718+00	\N	completed	2025-07-15 20:10:43.864918+00
6085bfb2-e19a-4035-ae94-5cb6016657d8	549f87d2-961e-48f8-bcff-7286d7db879e	3f72aef4-850b-401a-b6e2-b5524ee835e6	2fd74584-4526-428d-b506-d92de93f45b1	Electrician service needed in Mandaue City. General service request.	2025-08-31 14:09:06.060118+00	\N	2025-07-24 02:37:15.093718+00	\N	completed	2025-12-02 05:59:42.242518+00
c196eb64-1110-462a-b7b9-dee23767860f	f97cfaac-5a4e-420a-a445-9776c13600b8	d689dc1e-c670-4544-8c03-8056d6c54c47	8a10c3b6-f3d9-4e9d-89c3-0e47b7c652d0	Roofer service needed in Lapu-Lapu. Installation and setup.	2025-09-04 00:04:41.272918+00	\N	\N	\N	pending	2025-10-22 01:34:04.812118+00
1c29fa2a-4737-4b27-947c-a366f61cc942	2594b276-c01e-4543-b2b5-0cd20667b7a6	d689dc1e-c670-4544-8c03-8056d6c54c47	8a10c3b6-f3d9-4e9d-89c3-0e47b7c652d0	Roofer service needed in Lapu-Lapu. Inspection and consultation.	2025-02-18 14:41:02.239318+00	\N	\N	\N	canceled	2025-04-25 15:56:00.655318+00
1454df26-3c7f-44b6-bba9-018499630634	216ebdf7-cd45-4b40-86f2-268b4e33bb68	d689dc1e-c670-4544-8c03-8056d6c54c47	8a10c3b6-f3d9-4e9d-89c3-0e47b7c652d0	Roofer service needed in Lapu-Lapu. General service request.	2025-06-02 01:23:36.424918+00	\N	2025-04-06 23:47:33.717718+00	\N	completed	2025-09-30 18:45:38.056918+00
f7c70ee6-6eee-45be-9d4b-fc52773c798e	f74860cc-f981-42b4-809d-11e92bedd14f	d689dc1e-c670-4544-8c03-8056d6c54c47	8a10c3b6-f3d9-4e9d-89c3-0e47b7c652d0	Roofer service needed in Lapu-Lapu. Urgent repair needed.	2025-07-12 05:22:29.148118+00	\N	2025-08-13 22:10:06.943318+00	\N	completed	2025-10-06 07:06:24.808918+00
935eb920-39f7-4334-acec-247489e36e6a	d951675f-497c-4ccb-b55d-6a72f9cfb8fc	d689dc1e-c670-4544-8c03-8056d6c54c47	8a10c3b6-f3d9-4e9d-89c3-0e47b7c652d0	Roofer service needed in Lapu-Lapu. Regular maintenance required.	2025-01-12 06:20:35.820118+00	\N	2025-06-06 17:44:46.533718+00	\N	completed	2025-06-19 04:42:53.752918+00
3cb9cf09-ce2f-4e25-a590-00c3eadc2ffd	dd3b46e4-576f-488e-928f-a5a2688e0fd4	d689dc1e-c670-4544-8c03-8056d6c54c47	8a10c3b6-f3d9-4e9d-89c3-0e47b7c652d0	Roofer service needed in Lapu-Lapu. Installation and setup.	2025-07-24 00:14:43.048918+00	\N	2025-11-20 16:57:55.077718+00	\N	completed	2025-04-16 05:35:55.173718+00
d3c15113-773b-4505-b2d8-64cb504f7680	7d6e1a27-d7f8-445f-a544-81c817a39304	d689dc1e-c670-4544-8c03-8056d6c54c47	8a10c3b6-f3d9-4e9d-89c3-0e47b7c652d0	Roofer service needed in Lapu-Lapu. Inspection and consultation.	2025-01-07 04:01:55.413718+00	\N	2025-11-06 22:24:51.247318+00	\N	completed	2024-12-22 11:42:30.626518+00
712b71fb-f029-4644-ac62-2d4dc7691329	088c7759-5ee8-4fd2-99fa-6d6953d6e99c	d689dc1e-c670-4544-8c03-8056d6c54c47	8a10c3b6-f3d9-4e9d-89c3-0e47b7c652d0	Roofer service needed in Lapu-Lapu. General service request.	2024-12-31 12:04:37.212118+00	\N	2025-10-03 23:30:35.666518+00	\N	completed	2025-08-22 20:45:24.722518+00
15e22b0e-7e35-4754-9eee-891ab7f4a1d0	ce930397-85a0-4a2c-9d12-343341780701	d689dc1e-c670-4544-8c03-8056d6c54c47	8a10c3b6-f3d9-4e9d-89c3-0e47b7c652d0	Roofer service needed in Lapu-Lapu. Urgent repair needed.	2025-12-06 01:25:44.556118+00	\N	2025-07-29 21:29:54.223318+00	\N	completed	2025-11-27 23:21:32.901718+00
c7d1818e-4178-43ba-8881-bbca2e931391	2637c6dd-5fbe-487c-85c5-3ef87dc74cf5	d689dc1e-c670-4544-8c03-8056d6c54c47	8a10c3b6-f3d9-4e9d-89c3-0e47b7c652d0	Roofer service needed in Lapu-Lapu. Regular maintenance required.	2025-02-02 21:40:24.424918+00	\N	2025-04-04 23:42:13.432918+00	\N	completed	2025-08-13 12:58:59.676118+00
8478e779-a372-4f53-b6d8-09e75579b1f2	d4d09b07-6022-4d29-8d83-2905a67c2fb0	d689dc1e-c670-4544-8c03-8056d6c54c47	8a10c3b6-f3d9-4e9d-89c3-0e47b7c652d0	Roofer service needed in Lapu-Lapu. Installation and setup.	2025-11-17 03:45:32.268118+00	\N	2025-06-20 09:30:51.592918+00	\N	completed	2025-08-12 07:57:06.261718+00
413196c1-aef7-4849-8279-d85813ef4451	9c0e3b56-4094-4a57-b207-abb436a8fe3d	d689dc1e-c670-4544-8c03-8056d6c54c47	8a10c3b6-f3d9-4e9d-89c3-0e47b7c652d0	Roofer service needed in Lapu-Lapu. Inspection and consultation.	2025-11-12 06:24:39.900118+00	\N	2025-05-02 13:02:16.840918+00	\N	completed	2024-12-31 06:22:35.484118+00
9295dca6-c6db-4be6-b0b5-066839aca86c	088c7759-5ee8-4fd2-99fa-6d6953d6e99c	772dd6aa-88ce-463c-af72-def381fe2dc3	45138e1c-7f74-4a2e-b43c-86f41855fac4	HVAC Technician service needed in Davao City. General service request.	2025-10-28 19:27:51.650518+00	\N	\N	\N	pending	2025-05-09 21:07:19.989718+00
3f9125ec-aee3-491e-b240-998a278b1ab3	ce930397-85a0-4a2c-9d12-343341780701	772dd6aa-88ce-463c-af72-def381fe2dc3	45138e1c-7f74-4a2e-b43c-86f41855fac4	HVAC Technician service needed in Davao City. Urgent repair needed.	2025-01-01 19:20:53.906518+00	\N	2025-07-13 08:45:12.885718+00	\N	completed	2025-08-13 16:12:12.568918+00
5c8e3aa2-8d58-4aa8-81b5-2140c042b633	2637c6dd-5fbe-487c-85c5-3ef87dc74cf5	772dd6aa-88ce-463c-af72-def381fe2dc3	45138e1c-7f74-4a2e-b43c-86f41855fac4	HVAC Technician service needed in Davao City. Regular maintenance required.	2025-02-19 22:41:04.543318+00	\N	2025-11-25 17:42:43.500118+00	\N	completed	2025-04-07 17:28:26.584918+00
5fed691e-1f80-46c0-9dda-e8badf2eee6d	d4d09b07-6022-4d29-8d83-2905a67c2fb0	772dd6aa-88ce-463c-af72-def381fe2dc3	45138e1c-7f74-4a2e-b43c-86f41855fac4	HVAC Technician service needed in Davao City. Installation and setup.	2025-01-19 17:15:33.132118+00	\N	2025-07-22 11:23:07.423318+00	\N	completed	2025-01-02 13:07:36.952918+00
e3755ad3-68d0-4450-a352-e51fa9f736a1	9c0e3b56-4094-4a57-b207-abb436a8fe3d	772dd6aa-88ce-463c-af72-def381fe2dc3	45138e1c-7f74-4a2e-b43c-86f41855fac4	HVAC Technician service needed in Davao City. Inspection and consultation.	2025-04-02 00:55:57.285718+00	\N	2025-11-25 22:41:24.933718+00	\N	completed	2025-04-05 11:04:12.386518+00
5d196a46-05f0-4cd0-bf52-7e18bf48eea0	6e0bbfe1-f2fd-4356-8684-bc8d8fb15a28	772dd6aa-88ce-463c-af72-def381fe2dc3	45138e1c-7f74-4a2e-b43c-86f41855fac4	HVAC Technician service needed in Davao City. General service request.	2025-12-16 00:29:38.412118+00	\N	2025-04-19 00:32:04.168918+00	\N	completed	2025-07-13 23:25:58.063318+00
3ce85573-90c7-4fdc-a7fe-f61938142902	2f6a0b4d-ff98-443f-a347-bc1c2e867bf5	772dd6aa-88ce-463c-af72-def381fe2dc3	45138e1c-7f74-4a2e-b43c-86f41855fac4	HVAC Technician service needed in Davao City. Urgent repair needed.	2025-06-06 14:49:37.874518+00	\N	2025-09-02 16:08:02.613718+00	\N	completed	2025-07-04 10:50:52.236118+00
253e1fd4-83f8-4460-aba4-1f84a54da0f6	c02b1823-7eec-4776-812e-b2a42402a542	772dd6aa-88ce-463c-af72-def381fe2dc3	45138e1c-7f74-4a2e-b43c-86f41855fac4	HVAC Technician service needed in Davao City. Regular maintenance required.	2025-06-17 18:50:49.528918+00	\N	2025-05-14 08:04:08.930518+00	\N	completed	2025-03-08 10:56:53.301718+00
97c9faad-3a8a-47b7-8749-5c3fc0a29228	8568204d-bac8-4bd2-be49-666099493157	772dd6aa-88ce-463c-af72-def381fe2dc3	45138e1c-7f74-4a2e-b43c-86f41855fac4	HVAC Technician service needed in Davao City. Installation and setup.	2025-11-08 21:35:12.175318+00	\N	2025-02-20 05:02:36.914518+00	\N	completed	2025-12-15 00:44:13.730518+00
086a724d-5d9c-46c6-97b3-f70e8b8410f2	c02b1823-7eec-4776-812e-b2a42402a542	875a1841-c516-4aff-8dec-7b29080e7902	8ec0536f-dc92-40ba-87d8-f60e42a55db6	Cleaner service needed in Cagayan de Oro. Regular maintenance required.	2025-03-24 21:24:04.994518+00	\N	\N	\N	pending	2025-06-25 06:27:26.392918+00
1203a459-ce1d-4231-ad76-f44938c73ad4	8568204d-bac8-4bd2-be49-666099493157	875a1841-c516-4aff-8dec-7b29080e7902	8ec0536f-dc92-40ba-87d8-f60e42a55db6	Cleaner service needed in Cagayan de Oro. Installation and setup.	2025-11-13 19:04:36.808918+00	\N	2025-05-15 16:02:48.204118+00	\N	completed	2025-09-09 23:36:27.746518+00
40c307fa-d477-481e-94a0-b0506b3d8eb1	3505bad0-2d27-427b-ae95-3169a5838fbf	875a1841-c516-4aff-8dec-7b29080e7902	8ec0536f-dc92-40ba-87d8-f60e42a55db6	Cleaner service needed in Cagayan de Oro. Inspection and consultation.	2025-01-26 03:03:32.152918+00	\N	2025-02-23 18:16:24.309718+00	\N	completed	2025-10-26 17:47:37.864918+00
2e832741-b5e1-41d8-bc11-85a727902e77	5be0cd9f-a466-4485-ac43-bdc4b104ecc0	875a1841-c516-4aff-8dec-7b29080e7902	8ec0536f-dc92-40ba-87d8-f60e42a55db6	Cleaner service needed in Cagayan de Oro. General service request.	2025-08-23 10:43:25.461718+00	\N	2025-04-22 17:53:09.381718+00	\N	completed	2025-02-04 05:39:16.226518+00
b44513c5-19c3-4081-9ba4-06bad5516344	ee82e0a0-0f37-4a6f-ae93-2113eddeb55c	875a1841-c516-4aff-8dec-7b29080e7902	8ec0536f-dc92-40ba-87d8-f60e42a55db6	Cleaner service needed in Cagayan de Oro. Urgent repair needed.	2025-10-26 14:17:50.421718+00	\N	2025-03-12 19:54:51.045718+00	\N	completed	2025-08-18 22:50:10.418518+00
bf62ec08-de85-4fc0-afd6-5d3079fac55a	40ec397a-f1cf-4855-8a3a-c5673fb20e05	875a1841-c516-4aff-8dec-7b29080e7902	8ec0536f-dc92-40ba-87d8-f60e42a55db6	Cleaner service needed in Cagayan de Oro. Regular maintenance required.	2025-08-31 18:26:01.720918+00	\N	2025-08-24 18:45:27.775318+00	\N	completed	2025-06-15 01:29:09.151318+00
ec11ac56-ffaf-4c67-afa2-180e8cdce347	b19b93f9-ccf5-4b17-bdcf-a105d11018af	28cffd4f-2d69-4667-9c34-dd0f1c365c93	368f7187-4490-4015-84fa-20a4f46eea09	Locksmith service needed in Iloilo City. Inspection and consultation.	2025-04-24 15:15:35.925718+00	\N	\N	\N	pending	2025-02-20 08:57:53.896918+00
e0e1eaf2-25af-4d24-a2d9-599eb1c57ff5	6fc15c3f-2c63-4a80-b499-3744ac6c5e0a	28cffd4f-2d69-4667-9c34-dd0f1c365c93	368f7187-4490-4015-84fa-20a4f46eea09	Locksmith service needed in Iloilo City. General service request.	2025-11-18 20:20:45.208918+00	\N	\N	\N	canceled	2025-09-10 13:04:49.164118+00
64e8d670-eec6-430d-9d09-f355cec9fc66	97c5f2cc-ef11-452a-9aa3-b4705f3280f8	28cffd4f-2d69-4667-9c34-dd0f1c365c93	368f7187-4490-4015-84fa-20a4f46eea09	Locksmith service needed in Iloilo City. Urgent repair needed.	2025-01-29 19:23:54.309718+00	\N	2025-05-13 09:24:25.903318+00	\N	completed	2025-11-05 04:10:30.789718+00
5ab75691-931a-4ab7-acf2-92a0081588b2	1be14a91-1b2c-48d6-8465-d1d4d12a785c	28cffd4f-2d69-4667-9c34-dd0f1c365c93	368f7187-4490-4015-84fa-20a4f46eea09	Locksmith service needed in Iloilo City. Regular maintenance required.	2025-08-04 14:22:13.682518+00	\N	2025-08-15 10:45:58.821718+00	\N	completed	2025-10-30 12:48:47.100118+00
c7d84623-af1e-4182-85be-d8db8878ade9	4cfa17c8-4d9f-4283-97f2-3a4976248b91	28cffd4f-2d69-4667-9c34-dd0f1c365c93	368f7187-4490-4015-84fa-20a4f46eea09	Locksmith service needed in Iloilo City. Installation and setup.	2025-11-03 12:30:18.760918+00	\N	2025-05-18 11:02:36.136918+00	\N	completed	2025-03-05 08:42:22.591318+00
3e9f2e84-c3c6-46f9-b220-910465704d10	57dfd528-5470-40a1-8fde-40eb61dd7ae1	28cffd4f-2d69-4667-9c34-dd0f1c365c93	368f7187-4490-4015-84fa-20a4f46eea09	Locksmith service needed in Iloilo City. Inspection and consultation.	2025-07-31 03:38:27.093718+00	\N	2025-09-18 12:01:38.709718+00	\N	completed	2025-10-25 17:59:34.639318+00
be15407c-724f-4d6a-a4b5-2be353a006b2	3cc9e6b9-d7d7-4d91-904b-65aeb230b14b	28cffd4f-2d69-4667-9c34-dd0f1c365c93	368f7187-4490-4015-84fa-20a4f46eea09	Locksmith service needed in Iloilo City. General service request.	2025-03-14 17:07:23.330518+00	\N	2025-07-16 04:25:29.522518+00	\N	completed	2025-08-02 12:54:58.447318+00
638d8818-9680-4e12-bedf-d33c64013a73	ff8bb61b-1117-4f5c-880b-ac4ebd7ea6c2	28cffd4f-2d69-4667-9c34-dd0f1c365c93	368f7187-4490-4015-84fa-20a4f46eea09	Locksmith service needed in Iloilo City. Urgent repair needed.	2025-05-08 02:43:45.708118+00	\N	2025-06-04 14:56:51.170518+00	\N	completed	2025-08-10 05:15:53.090518+00
dc2894cb-cdfb-4fe2-9023-387d63c045a1	feaac7e1-3bc3-4462-b2f8-b4a19f990531	28cffd4f-2d69-4667-9c34-dd0f1c365c93	368f7187-4490-4015-84fa-20a4f46eea09	Locksmith service needed in Iloilo City. Regular maintenance required.	2025-05-01 14:20:15.832918+00	\N	2025-03-24 09:08:30.664918+00	\N	completed	2025-10-19 20:06:52.053718+00
ab453d9b-800d-46bc-bd82-21b91f3b0176	8d3c4c94-5ab8-4070-a7cc-a12e88219bf3	28cffd4f-2d69-4667-9c34-dd0f1c365c93	368f7187-4490-4015-84fa-20a4f46eea09	Locksmith service needed in Iloilo City. Installation and setup.	2025-11-11 21:17:35.071318+00	\N	2025-04-01 06:43:09.016918+00	\N	completed	2025-09-20 09:58:25.116118+00
fc70125f-d1a9-4be7-a04a-098e745091de	158e9458-44c9-4638-83b9-bf0c99bdb64a	28cffd4f-2d69-4667-9c34-dd0f1c365c93	368f7187-4490-4015-84fa-20a4f46eea09	Locksmith service needed in Iloilo City. Inspection and consultation.	2025-07-15 03:08:57.880918+00	\N	2025-11-09 10:31:23.244118+00	\N	completed	2025-09-29 20:04:57.055318+00
455a817c-b48f-4a39-8018-d3c1984853b0	503f2221-11c2-4415-9a5b-9b0e81e95b67	28cffd4f-2d69-4667-9c34-dd0f1c365c93	368f7187-4490-4015-84fa-20a4f46eea09	Locksmith service needed in Iloilo City. General service request.	2025-10-07 14:32:04.053718+00	\N	2025-09-13 19:58:54.607318+00	\N	completed	2025-02-14 16:31:01.903318+00
c69b2bcc-ac3a-449e-b7dc-9382f8f3058e	5eae5e90-1914-41e5-be8a-aef4314d4892	28cffd4f-2d69-4667-9c34-dd0f1c365c93	368f7187-4490-4015-84fa-20a4f46eea09	Locksmith service needed in Iloilo City. Urgent repair needed.	2025-09-16 10:57:40.735318+00	\N	2025-02-18 05:31:21.976918+00	\N	completed	2025-06-06 10:34:27.708118+00
7cb29a64-369e-4962-aaf7-2f74daa93857	ff8bb61b-1117-4f5c-880b-ac4ebd7ea6c2	29cfad14-d90e-4a79-9b31-d0b2e8d69036	fa26da00-47e3-4456-8d91-ef631d37234a	Landscaper service needed in Baguio. Urgent repair needed.	2025-10-24 17:59:15.285718+00	\N	\N	\N	pending	2025-11-10 00:50:56.008918+00
af118f7f-93b3-448a-8251-995e08f19ae0	feaac7e1-3bc3-4462-b2f8-b4a19f990531	29cfad14-d90e-4a79-9b31-d0b2e8d69036	fa26da00-47e3-4456-8d91-ef631d37234a	Landscaper service needed in Baguio. Regular maintenance required.	2025-08-07 23:41:05.349718+00	\N	2025-07-24 11:58:42.367318+00	\N	completed	2024-12-26 18:55:19.269718+00
9a5b369a-9fdc-4b2f-846c-7234cbb7e60b	8d3c4c94-5ab8-4070-a7cc-a12e88219bf3	29cfad14-d90e-4a79-9b31-d0b2e8d69036	fa26da00-47e3-4456-8d91-ef631d37234a	Landscaper service needed in Baguio. Installation and setup.	2025-03-18 23:40:31.308118+00	\N	2025-08-18 00:33:30.396118+00	\N	completed	2025-10-31 15:25:08.498518+00
187b31a3-b1d2-4145-aae3-5d0ae6451ec7	158e9458-44c9-4638-83b9-bf0c99bdb64a	29cfad14-d90e-4a79-9b31-d0b2e8d69036	fa26da00-47e3-4456-8d91-ef631d37234a	Landscaper service needed in Baguio. Inspection and consultation.	2025-03-28 06:21:40.620118+00	\N	2025-09-30 06:12:40.274518+00	\N	completed	2024-12-29 20:16:53.656918+00
3d3e4f88-83f5-460f-964b-3710f9ac956c	503f2221-11c2-4415-9a5b-9b0e81e95b67	29cfad14-d90e-4a79-9b31-d0b2e8d69036	fa26da00-47e3-4456-8d91-ef631d37234a	Landscaper service needed in Baguio. General service request.	2025-01-01 01:01:43.922518+00	\N	2025-07-01 07:55:41.416918+00	\N	completed	2025-11-13 02:13:50.661718+00
877555f9-dc99-4102-9d83-7395f69faa20	5eae5e90-1914-41e5-be8a-aef4314d4892	29cfad14-d90e-4a79-9b31-d0b2e8d69036	fa26da00-47e3-4456-8d91-ef631d37234a	Landscaper service needed in Baguio. Urgent repair needed.	2025-05-16 03:12:03.554518+00	\N	2025-02-20 20:22:00.895318+00	\N	completed	2025-07-02 16:29:38.008918+00
10ce1149-cb56-4760-9e7b-ac9e4b77d900	4893cb6b-0ffd-422a-b940-7b9201daa34f	29cfad14-d90e-4a79-9b31-d0b2e8d69036	fa26da00-47e3-4456-8d91-ef631d37234a	Landscaper service needed in Baguio. Regular maintenance required.	2025-11-30 23:55:33.237718+00	\N	2025-11-24 20:44:10.504918+00	\N	completed	2025-05-18 15:01:24.453718+00
33bd7d79-2791-4cb4-af4c-37f8d015961f	218a9cdd-7d3a-44c9-bd7a-d885d38d6063	29cfad14-d90e-4a79-9b31-d0b2e8d69036	fa26da00-47e3-4456-8d91-ef631d37234a	Landscaper service needed in Baguio. Installation and setup.	2025-05-04 09:29:50.940118+00	\N	2025-08-29 22:36:27.717718+00	\N	completed	2025-04-12 13:30:15.506518+00
26e51825-7c3a-4bcb-af0f-21a699d8d9fb	4eea189c-607a-466d-8f92-1f53d790fb6f	29cfad14-d90e-4a79-9b31-d0b2e8d69036	fa26da00-47e3-4456-8d91-ef631d37234a	Landscaper service needed in Baguio. Inspection and consultation.	2025-07-10 19:22:47.608918+00	\N	2025-09-30 07:39:38.316118+00	\N	completed	2025-10-09 11:41:32.565718+00
04443efa-8688-4c39-9be6-0a7444eb5359	5c74fdb2-b4d9-4f4b-9c6c-f6b72854db84	29cfad14-d90e-4a79-9b31-d0b2e8d69036	fa26da00-47e3-4456-8d91-ef631d37234a	Landscaper service needed in Baguio. General service request.	2025-11-23 09:38:46.188118+00	\N	2025-06-04 22:49:47.090518+00	\N	completed	2025-11-26 18:28:11.666518+00
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.categories (id, name, description, created_at) FROM stdin;
368f7187-4490-4015-84fa-20a4f46eea09	Locksmith	Professional Locksmith services	2025-12-19 23:23:46.303318+00
fa26da00-47e3-4456-8d91-ef631d37234a	Landscaper	Professional Landscaper services	2025-12-19 23:23:46.303318+00
ff8acab6-8c85-4fb8-af36-781b98920efb	Painter	Professional Painter services	2025-12-19 23:23:46.303318+00
c87b314f-ad10-4e91-b2e6-dbd8cdf13230	Plumber	Professional Plumber services	2025-12-19 23:23:46.303318+00
67b073d4-c07b-4f32-97c5-d64e4797044e	Handyman	Professional Handyman services	2025-12-19 23:23:46.303318+00
19a03c30-e580-4bda-bec4-d59fb737e8e0	Carpenter	Professional Carpenter services	2025-12-19 23:23:46.303318+00
2fd74584-4526-428d-b506-d92de93f45b1	Electrician	Professional Electrician services	2025-12-19 23:23:46.303318+00
8a10c3b6-f3d9-4e9d-89c3-0e47b7c652d0	Roofer	Professional Roofer services	2025-12-19 23:23:46.303318+00
45138e1c-7f74-4a2e-b43c-86f41855fac4	HVAC Technician	Professional HVAC Technician services	2025-12-19 23:23:46.303318+00
8ec0536f-dc92-40ba-87d8-f60e42a55db6	Cleaner	Professional Cleaner services	2025-12-19 23:23:46.303318+00
\.


--
-- Data for Name: chats; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.chats (id, booking_id, customer_id, worker_id, created_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: credit_transactions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.credit_transactions (id, credit_id, booking_id, amount, type, description, created_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: credits; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.credits (id, worker_id, balance, currency, created_at) FROM stdin;
\.


--
-- Data for Name: favorites; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.favorites (id, customer_id, worker_id, created_at) FROM stdin;
\.


--
-- Data for Name: global_settings; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.global_settings (id, key, value, created_at) FROM stdin;
\.


--
-- Data for Name: messages; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.messages (id, chat_id, sender_id, receiver_id, message_text, media_url, sent_at, status, created_at) FROM stdin;
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.notifications (id, user_id, title, message, type, status, sent_at, created_at) FROM stdin;
\.


--
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.payments (id, booking_id, customer_id, worker_id, amount, currency, payment_method, reference_id, payment_status, paid_at, created_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: profile_settings; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.profile_settings (id, user_id, preference_key, preference_value, created_at) FROM stdin;
\.


--
-- Data for Name: ratings; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.ratings (id, booking_id, customer_id, worker_id, rating_value, review_comment, created_at) FROM stdin;
6561a6bc-b30b-4071-871b-9aaec17050af	dac8a8cd-df46-41ba-a1f2-a8b7f58c1ebc	5eae5e90-1914-41e5-be8a-aef4314d4892	26e02acd-4f32-4619-b25d-dc8273db7df6	4	Good work done on time. Would recommend.	2025-11-18 17:50:11.743318+00
870a1fb1-b184-4880-8b06-5221e793d6f8	e9b29b9e-ffd9-4850-8c55-04ec7fe8ae78	4893cb6b-0ffd-422a-b940-7b9201daa34f	26e02acd-4f32-4619-b25d-dc8273db7df6	5	Perfect! Exceeded my expectations.	2025-08-09 14:33:25.356118+00
06b78b44-361b-485b-a7f6-16de8a85fb07	545e0cb6-71d8-4399-af56-5578f14d40c9	218a9cdd-7d3a-44c9-bd7a-d885d38d6063	26e02acd-4f32-4619-b25d-dc8273db7df6	3	Good service overall. Met expectations.	2025-05-31 00:10:50.028118+00
c31f46a6-1587-477c-9cba-e9dcf2c7368b	76c7da3d-2327-4ce1-9e00-c4304752a303	4eea189c-607a-466d-8f92-1f53d790fb6f	26e02acd-4f32-4619-b25d-dc8273db7df6	4	Good work done on time. Would recommend.	2025-11-29 11:01:51.554518+00
e7b63a55-8dbc-4489-b821-87a246aca88e	2b8e1311-4db4-4876-beea-9552a244db8d	5c74fdb2-b4d9-4f4b-9c6c-f6b72854db84	26e02acd-4f32-4619-b25d-dc8273db7df6	5	Very satisfied with the quality of work. Highly recommended!	2025-11-11 03:05:22.917718+00
16a55a63-fb31-418f-83e3-ca1a1f85d693	246e1f10-b0b5-41ee-80df-53972111c83a	9e61d17b-97a4-45e7-a26c-4fdc3086cdb7	26e02acd-4f32-4619-b25d-dc8273db7df6	3	Good service overall. Met expectations.	2025-09-04 11:34:36.463318+00
555e63a9-de09-417e-8514-1ce205b48ded	09a79789-124a-4d64-8cc2-b76dad586a16	6302ea1c-5af4-4302-918a-c87152175bae	26e02acd-4f32-4619-b25d-dc8273db7df6	4	Good work done on time. Would recommend.	2025-10-24 08:19:59.330518+00
dcb2047f-a5f6-4451-aa90-b10ff7834e8a	9b24940b-4138-4fa9-a328-10b949b834fc	a3563a32-75c5-4d0b-b672-9f548fe69a06	26e02acd-4f32-4619-b25d-dc8273db7df6	5	Excellent service! Will definitely hire again.	2025-09-04 18:00:56.460118+00
702d03fb-e290-4bf1-b8eb-351ddbac591d	7669a23d-c969-4096-9d6a-32add44951b8	5fcd65e1-d364-4762-a7e2-9939ef039247	26e02acd-4f32-4619-b25d-dc8273db7df6	3	Good service overall. Met expectations.	2025-09-19 10:49:05.186518+00
1a91ecf0-937f-4639-834d-c241d93d12d2	318c127c-5ddb-45ee-996d-268f18315553	649a4947-627c-43f2-9c5e-b75f213a0d93	26e02acd-4f32-4619-b25d-dc8273db7df6	4	Good work done on time. Would recommend.	2025-08-24 23:01:39.199318+00
0376ffbd-c7a7-454d-a1f5-fa3894cd3ae2	ba4e0d3d-0e40-46a3-b92b-6e2f97aed121	3c6ff2a2-e59e-48af-8a8e-9238dc49ecc6	26e02acd-4f32-4619-b25d-dc8273db7df6	5	Outstanding work! Highly professional and efficient.	2025-08-29 18:44:40.428118+00
698a5767-d806-4a9d-93a7-faa5f64de431	9fad6db7-93b8-4ffc-86ae-597d9db6e525	6302ea1c-5af4-4302-918a-c87152175bae	daf2b506-ab68-4768-8088-8c513172906b	4	Good work done on time. Would recommend.	2025-08-31 02:39:35.148118+00
83f67a8d-f86b-4549-afc2-1fa9e05d7a75	07c4d7be-1ee4-4e00-b751-657bc99ff13f	a3563a32-75c5-4d0b-b672-9f548fe69a06	daf2b506-ab68-4768-8088-8c513172906b	5	Excellent service! Will definitely hire again.	2025-09-17 15:31:59.762518+00
2a0cad8f-e720-4b1a-b574-97ab304f4bf5	e3823134-a61c-4029-b48f-c6fa080ec07d	5fcd65e1-d364-4762-a7e2-9939ef039247	daf2b506-ab68-4768-8088-8c513172906b	3	Good service overall. Met expectations.	2025-04-30 05:45:28.092118+00
cff0aa96-559f-414c-810b-d9773866a366	f8dcf1af-4416-42ae-b591-f0611618c3d7	649a4947-627c-43f2-9c5e-b75f213a0d93	daf2b506-ab68-4768-8088-8c513172906b	4	Good work done on time. Would recommend.	2025-09-04 12:00:47.128918+00
0781acad-9ce7-495d-ac2f-7a1fef038cef	a27fba30-c121-41b6-9207-beb5b225d73e	3c6ff2a2-e59e-48af-8a8e-9238dc49ecc6	daf2b506-ab68-4768-8088-8c513172906b	5	Outstanding work! Highly professional and efficient.	2025-08-28 13:07:28.226518+00
6f1573f4-260f-4df3-b2d2-8d8bb1196595	23b8606e-6a86-414a-8a79-77028de9dd7e	496d267d-f0aa-4592-a87a-bd69e1196f23	daf2b506-ab68-4768-8088-8c513172906b	3	Good service overall. Met expectations.	2025-03-24 11:35:28.735318+00
be73dfa3-41bf-41d8-ae7c-058795c43548	dfdaa2c9-b351-4021-9c78-6590513b1570	5c328f75-464c-4053-a41e-00fbc6eba934	daf2b506-ab68-4768-8088-8c513172906b	4	Good work done on time. Would recommend.	2025-12-15 01:32:50.594518+00
ff7c7198-48af-4f83-87c5-9cce398ae1be	39a81f14-a1e4-46e0-9773-53d2ba0083c0	bed6bf7a-bfbb-4eac-b6d7-35ca3e7d6660	daf2b506-ab68-4768-8088-8c513172906b	5	Perfect! Exceeded my expectations.	2025-06-27 07:42:10.725718+00
d85caf37-6f20-4aa2-ae87-6f96a5e2d585	34db24e8-5510-47f8-802d-4c509a3fe08c	549f87d2-961e-48f8-bcff-7286d7db879e	daf2b506-ab68-4768-8088-8c513172906b	3	Good service overall. Met expectations.	2025-07-23 06:39:28.869718+00
28a5824d-039b-435f-8829-08065216fa86	e191d69a-a8b0-4695-8fd4-bd9116bdd117	bed6bf7a-bfbb-4eac-b6d7-35ca3e7d6660	c2881953-2ba8-4258-b661-5cd2f4e212d5	5	Perfect! Exceeded my expectations.	2025-12-02 20:04:34.936918+00
42fff0f8-69df-4078-8fbb-8bfc69e5b98c	53bb2956-faab-44b6-bc70-24ac0a917217	549f87d2-961e-48f8-bcff-7286d7db879e	c2881953-2ba8-4258-b661-5cd2f4e212d5	3	Good service overall. Met expectations.	2025-06-27 10:41:09.727318+00
65f4f458-6975-477e-bb46-498ca7a94232	2161f556-0f56-4aab-b071-aed84a1ca3af	a8957421-6c24-4110-ad8a-89513c6cfe93	c2881953-2ba8-4258-b661-5cd2f4e212d5	4	Good work done on time. Would recommend.	2025-03-30 19:44:30.780118+00
3d5006e7-197a-4489-a197-5da0faeb0a37	817c907c-5636-4e02-9bdd-92d5a69c087a	ded07a3d-2dc7-40f1-a9df-81b72c989abf	c2881953-2ba8-4258-b661-5cd2f4e212d5	5	Very satisfied with the quality of work. Highly recommended!	2025-12-10 01:24:33.189718+00
9a4b6b86-0c7d-4748-8250-dd4f1128385a	9fe5a710-877f-4a6a-aa0d-7d28a4d5d5b5	f97cfaac-5a4e-420a-a445-9776c13600b8	c2881953-2ba8-4258-b661-5cd2f4e212d5	3	Good service overall. Met expectations.	2025-05-04 11:29:53.503318+00
049afd82-6859-4910-9597-c300c9c865df	98287418-4e35-4d53-9a5d-67da104adfc7	2594b276-c01e-4543-b2b5-0cd20667b7a6	c2881953-2ba8-4258-b661-5cd2f4e212d5	4	Good work done on time. Would recommend.	2025-06-13 04:35:46.159318+00
a68c0373-4463-4b22-8fb8-e432162ee8cf	7ba0c836-c84c-47e4-8905-51c64ce7f61e	f74860cc-f981-42b4-809d-11e92bedd14f	862bf73b-5359-4061-9312-c7c9bcb54dc9	3	Good service overall. Met expectations.	2025-10-04 10:18:44.133718+00
16b6fb9c-3994-45c0-91ae-c647a2f264b2	34da8887-3b19-4f3d-9aff-456130cf2b24	d951675f-497c-4ccb-b55d-6a72f9cfb8fc	862bf73b-5359-4061-9312-c7c9bcb54dc9	4	Good work done on time. Would recommend.	2025-10-11 09:50:52.725718+00
8afee522-18b7-4028-b48d-a4b6e37c2acc	54c67e38-b737-4221-9a94-f9a8e5d8b1e1	dd3b46e4-576f-488e-928f-a5a2688e0fd4	862bf73b-5359-4061-9312-c7c9bcb54dc9	5	Outstanding work! Highly professional and efficient.	2025-06-02 22:15:59.196118+00
40986c15-886d-4c46-a2d5-f2e9d22dee09	f9414ab0-916b-4ab8-bb52-fdf9b1d59da9	7d6e1a27-d7f8-445f-a544-81c817a39304	862bf73b-5359-4061-9312-c7c9bcb54dc9	3	Good service overall. Met expectations.	2025-10-21 02:13:50.661718+00
8638b1ed-6e16-4e8c-ba7c-6393d87fc332	ed11e821-3514-4f6d-9520-2bc9575ae4be	088c7759-5ee8-4fd2-99fa-6d6953d6e99c	862bf73b-5359-4061-9312-c7c9bcb54dc9	4	Good work done on time. Would recommend.	2025-10-02 06:36:02.028118+00
befb1646-190a-4e41-ba0e-7021f3b0a100	bae1f94b-9449-4719-a89f-00f810437539	ce930397-85a0-4a2c-9d12-343341780701	862bf73b-5359-4061-9312-c7c9bcb54dc9	5	Perfect! Exceeded my expectations.	2025-10-13 05:45:08.911318+00
70d79096-b167-4981-886e-a5ed7592ba6c	21efc08f-242b-4829-808d-623acf8bb097	2637c6dd-5fbe-487c-85c5-3ef87dc74cf5	862bf73b-5359-4061-9312-c7c9bcb54dc9	3	Good service overall. Met expectations.	2025-06-14 14:14:43.020118+00
376c3cc5-f912-4338-b54f-7c2dc752ecaf	2ec6d2b1-d2a9-4f8a-82cd-9a3337f85047	d4d09b07-6022-4d29-8d83-2905a67c2fb0	862bf73b-5359-4061-9312-c7c9bcb54dc9	4	Good work done on time. Would recommend.	2025-12-03 02:47:29.397718+00
2f72413b-8f6f-4ff2-b566-76d676812dba	045407d5-07ad-48bc-980e-0bba40a54469	9c0e3b56-4094-4a57-b207-abb436a8fe3d	862bf73b-5359-4061-9312-c7c9bcb54dc9	5	Very satisfied with the quality of work. Highly recommended!	2025-05-04 22:33:28.178518+00
aa02f428-1bf7-44bd-9cd0-916203f632c9	58a6ca88-7a26-4730-8f84-f56cd6ffc249	6e0bbfe1-f2fd-4356-8684-bc8d8fb15a28	862bf73b-5359-4061-9312-c7c9bcb54dc9	3	Good service overall. Met expectations.	2025-11-13 07:29:08.287318+00
6dca7b6f-d76a-46e1-9170-2e5b26a5fe1e	5cb89257-6162-4540-9ac8-d30ffed732a3	2f6a0b4d-ff98-443f-a347-bc1c2e867bf5	862bf73b-5359-4061-9312-c7c9bcb54dc9	4	Good work done on time. Would recommend.	2025-05-21 17:06:30.885718+00
95320363-095e-460f-9bf4-891e9219ea23	4cccd307-c0ec-4849-8827-5c2855ffed78	c02b1823-7eec-4776-812e-b2a42402a542	862bf73b-5359-4061-9312-c7c9bcb54dc9	5	Excellent service! Will definitely hire again.	2025-11-05 02:27:18.847318+00
e919ec85-c53b-4635-8844-1f885ad46fef	12c866dc-8749-41db-a900-326ea715d33a	8568204d-bac8-4bd2-be49-666099493157	862bf73b-5359-4061-9312-c7c9bcb54dc9	3	Good service overall. Met expectations.	2025-11-10 02:20:30.780118+00
ff55b770-359a-4749-95f2-4ec84ddfa190	489f3ddc-bdae-4eed-9d5d-7522f1123528	d4d09b07-6022-4d29-8d83-2905a67c2fb0	34228761-bcf2-4ff3-bfd1-f65d3d050d2b	4	Good work done on time. Would recommend.	2025-12-05 05:29:01.576918+00
d4ac8b9b-ea54-4548-bbe3-009a8ad97a7b	119ea188-30cf-462a-add9-99f22aa0b5d2	9c0e3b56-4094-4a57-b207-abb436a8fe3d	34228761-bcf2-4ff3-bfd1-f65d3d050d2b	5	Very satisfied with the quality of work. Highly recommended!	2025-10-13 20:25:55.212118+00
60fd4450-40d7-4534-897a-57f95d1c7a8b	81f70da5-7e0c-4b73-a5c2-7bfd00f3067c	6e0bbfe1-f2fd-4356-8684-bc8d8fb15a28	34228761-bcf2-4ff3-bfd1-f65d3d050d2b	3	Good service overall. Met expectations.	2025-05-09 19:41:34.524118+00
b6384a66-f0db-468d-b2d8-f679c7d0cc1e	127aaa27-af59-4f1f-b78e-1946dd873d6c	2f6a0b4d-ff98-443f-a347-bc1c2e867bf5	34228761-bcf2-4ff3-bfd1-f65d3d050d2b	4	Good work done on time. Would recommend.	2025-04-10 00:47:56.383318+00
7d0e406d-4e45-4daf-9b3a-4ae52364bdeb	c9cbad17-9262-42e7-a629-a316c745c911	c02b1823-7eec-4776-812e-b2a42402a542	34228761-bcf2-4ff3-bfd1-f65d3d050d2b	5	Excellent service! Will definitely hire again.	2025-07-16 00:47:27.266518+00
97ff6032-1589-464c-992e-d7d9bfcfea90	9504ffb6-86ef-4de2-bc23-c7d4c17f72b1	8568204d-bac8-4bd2-be49-666099493157	34228761-bcf2-4ff3-bfd1-f65d3d050d2b	3	Good service overall. Met expectations.	2025-08-31 19:15:38.805718+00
ba712257-2bf2-4f47-b5bb-0d0aca22a751	020c15b9-43cd-4407-833f-91140f10d838	3505bad0-2d27-427b-ae95-3169a5838fbf	34228761-bcf2-4ff3-bfd1-f65d3d050d2b	4	Good work done on time. Would recommend.	2025-11-11 05:27:06.232918+00
3a867576-1a68-408a-8afa-f02c186e401b	b348d8ae-45a3-42e3-af7b-e957c3fe08c0	5be0cd9f-a466-4485-ac43-bdc4b104ecc0	34228761-bcf2-4ff3-bfd1-f65d3d050d2b	5	Outstanding work! Highly professional and efficient.	2025-06-25 02:04:17.916118+00
99fd7306-ae45-4ff2-98f7-2b3311fc78aa	2f3dd643-1a8d-4365-ba49-0a64f90a5b57	ee82e0a0-0f37-4a6f-ae93-2113eddeb55c	34228761-bcf2-4ff3-bfd1-f65d3d050d2b	3	Good service overall. Met expectations.	2025-05-22 03:00:19.480918+00
7f712165-93ed-4fa4-a13f-85c1553c2101	73b9577b-5bff-4db6-921e-b093c9a49cd9	40ec397a-f1cf-4855-8a3a-c5673fb20e05	34228761-bcf2-4ff3-bfd1-f65d3d050d2b	4	Good work done on time. Would recommend.	2025-03-23 05:07:17.023318+00
4824bea3-1415-4f53-a6b3-7c165f263151	b93f99b1-9600-47d1-8f7c-d5ab52896292	5be0cd9f-a466-4485-ac43-bdc4b104ecc0	b0d0319f-3ccd-4386-978e-e8243923db36	5	Outstanding work! Highly professional and efficient.	2025-05-18 05:31:03.314518+00
304f19df-6ece-48fb-8141-1c8544ee6a23	84d7be44-62ce-414a-964a-46f4a11b8007	ee82e0a0-0f37-4a6f-ae93-2113eddeb55c	b0d0319f-3ccd-4386-978e-e8243923db36	3	Good service overall. Met expectations.	2025-08-30 18:21:31.720918+00
2cf36324-9797-45f7-8cf4-1a7c0f28097b	fce37baf-8f1c-40a8-af23-2b2e1f60627b	40ec397a-f1cf-4855-8a3a-c5673fb20e05	b0d0319f-3ccd-4386-978e-e8243923db36	4	Good work done on time. Would recommend.	2025-09-20 01:11:31.615318+00
d477ff79-378b-46c7-b1e8-a0bfd447ae15	92bbe846-841b-497f-8886-dca09509c371	0897825a-ab99-41e9-98ba-b4ed822155a5	b0d0319f-3ccd-4386-978e-e8243923db36	5	Perfect! Exceeded my expectations.	2025-11-19 17:14:24.962518+00
030650b9-bb4a-4cad-b027-79fee5317243	09472c08-043b-4993-aa81-1f3a95b05f86	b19b93f9-ccf5-4b17-bdcf-a105d11018af	b0d0319f-3ccd-4386-978e-e8243923db36	3	Good service overall. Met expectations.	2025-08-10 16:46:13.941718+00
bcdd8c12-b946-4896-baec-4299b3bc648c	6413015d-0afb-4fa0-9515-2e04793cc65d	6fc15c3f-2c63-4a80-b499-3744ac6c5e0a	b0d0319f-3ccd-4386-978e-e8243923db36	4	Good work done on time. Would recommend.	2025-07-28 01:35:12.981718+00
50a8dd39-ab39-47f2-8b9c-88f531ef7320	a24dab41-2995-4754-a3f3-e289832b215f	97c5f2cc-ef11-452a-9aa3-b4705f3280f8	b0d0319f-3ccd-4386-978e-e8243923db36	5	Very satisfied with the quality of work. Highly recommended!	2025-05-29 09:25:23.791318+00
c418c4b4-d9c1-4de2-a862-a62ea39fe820	35f94331-43bd-4b5d-9b85-9ee728706887	1be14a91-1b2c-48d6-8465-d1d4d12a785c	8730c98e-607b-491b-ba1a-ec47f577da1c	3	Good service overall. Met expectations.	2025-05-05 07:00:16.312918+00
83a934fa-8a3e-499c-9f21-b3b6fdc0011f	083bdbd3-fb6f-4ddb-9bd5-eab52b6df753	4cfa17c8-4d9f-4283-97f2-3a4976248b91	8730c98e-607b-491b-ba1a-ec47f577da1c	4	Good work done on time. Would recommend.	2025-11-09 15:46:17.541718+00
da452e9a-437b-46e7-9063-4b1740338247	7bc4838b-7e08-4f36-af12-004caef0efee	57dfd528-5470-40a1-8fde-40eb61dd7ae1	8730c98e-607b-491b-ba1a-ec47f577da1c	5	Excellent service! Will definitely hire again.	2025-04-04 03:56:51.199318+00
ccc660df-a8d0-43d1-a4e5-462c1caee324	6178c24c-dbe8-4b86-b43a-1e66f17e31d9	3cc9e6b9-d7d7-4d91-904b-65aeb230b14b	8730c98e-607b-491b-ba1a-ec47f577da1c	3	Good service overall. Met expectations.	2025-07-16 09:06:23.224918+00
ec098512-ac34-4857-8b48-6adf7f7f4d4f	4f304817-bdd3-4c66-919a-5fa3c4c6cb6a	503f2221-11c2-4415-9a5b-9b0e81e95b67	59676f81-363d-4b81-81a8-326f11304145	5	Perfect! Exceeded my expectations.	2025-04-16 01:52:13.279318+00
9c769399-4c7e-4fa9-863d-8ee1356a407c	f484b1d5-34eb-49c9-a840-97b66be0498e	5eae5e90-1914-41e5-be8a-aef4314d4892	59676f81-363d-4b81-81a8-326f11304145	3	Good service overall. Met expectations.	2025-03-30 06:09:55.941718+00
c7f4b985-5000-40e3-badf-e3ab736a72db	6bf2205e-dd70-448e-88ac-8f9f025b2be1	4893cb6b-0ffd-422a-b940-7b9201daa34f	59676f81-363d-4b81-81a8-326f11304145	4	Good work done on time. Would recommend.	2025-06-14 14:53:09.208918+00
10b8d890-87e2-483e-ad03-3043ef9a1f5f	7dd4e136-b06b-4459-b397-c3d8957c2a9d	218a9cdd-7d3a-44c9-bd7a-d885d38d6063	59676f81-363d-4b81-81a8-326f11304145	5	Very satisfied with the quality of work. Highly recommended!	2025-08-14 16:34:43.605718+00
8a65be02-5c9c-4500-8c5c-15bf3838b9c7	16bc300b-c252-421c-85ae-ad2e6b7b18a9	4eea189c-607a-466d-8f92-1f53d790fb6f	59676f81-363d-4b81-81a8-326f11304145	3	Good service overall. Met expectations.	2025-08-14 02:25:12.962518+00
574616bb-57b7-4f4f-b32b-e087b1928ade	eb79a5c2-1395-4f4e-a2de-ef3578eaf5e1	5c74fdb2-b4d9-4f4b-9c6c-f6b72854db84	59676f81-363d-4b81-81a8-326f11304145	4	Good work done on time. Would recommend.	2025-10-08 02:12:54.847318+00
0a7ec99b-8301-4282-8ab8-e070d75dd7e4	6eed417e-973e-4cb1-b5ed-4a0855923392	9e61d17b-97a4-45e7-a26c-4fdc3086cdb7	59676f81-363d-4b81-81a8-326f11304145	5	Excellent service! Will definitely hire again.	2025-06-14 09:19:29.810518+00
962e3364-5768-46c2-b3c9-4dea20d429da	a83434aa-e6ac-4e1a-a757-36cb3b13d463	6302ea1c-5af4-4302-918a-c87152175bae	59676f81-363d-4b81-81a8-326f11304145	3	Good service overall. Met expectations.	2025-11-18 08:50:33.429718+00
3095b153-4aac-4a00-b31b-44d7f671d616	d6b03625-430d-44b9-b8ee-babc98678dd8	a3563a32-75c5-4d0b-b672-9f548fe69a06	59676f81-363d-4b81-81a8-326f11304145	4	Good work done on time. Would recommend.	2025-10-06 01:03:31.922518+00
6a5f5f6e-253c-4e19-974c-25e0dca93c6f	7c510418-c31f-4a3c-89d9-2ddd7401ac9b	5fcd65e1-d364-4762-a7e2-9939ef039247	59676f81-363d-4b81-81a8-326f11304145	5	Outstanding work! Highly professional and efficient.	2025-03-21 13:26:47.196118+00
e7e585dc-e731-4f18-90f3-27424aebf4d9	e5c142ed-a07d-4b3e-a737-5e949c6fbb03	9e61d17b-97a4-45e7-a26c-4fdc3086cdb7	d2e65c84-18ae-4b35-ae87-78a3ab244754	5	Excellent service! Will definitely hire again.	2025-12-05 09:37:26.181718+00
72296406-f293-408d-a616-c0b6d275281d	8aef08bb-d0a4-4d56-a145-95ab0d381448	6302ea1c-5af4-4302-918a-c87152175bae	d2e65c84-18ae-4b35-ae87-78a3ab244754	3	Good service overall. Met expectations.	2025-08-12 01:38:01.202518+00
4fef3dba-8447-416e-9618-59fb2c88190a	afa7917a-3b22-4db5-aec7-10bfa877db0b	a3563a32-75c5-4d0b-b672-9f548fe69a06	d2e65c84-18ae-4b35-ae87-78a3ab244754	4	Good work done on time. Would recommend.	2025-10-18 21:18:44.277718+00
7e5bfbbc-67ac-4434-9c98-404b24db44cd	12daed6f-fb03-4cb2-86fd-3a58608ae0cb	5fcd65e1-d364-4762-a7e2-9939ef039247	d2e65c84-18ae-4b35-ae87-78a3ab244754	5	Outstanding work! Highly professional and efficient.	2025-06-23 17:38:25.768918+00
8b42dee6-ec0f-4979-a27c-2a5019db99e3	73b9bcb5-7974-4f99-b6b6-5d925e8cc0e5	649a4947-627c-43f2-9c5e-b75f213a0d93	d2e65c84-18ae-4b35-ae87-78a3ab244754	3	Good service overall. Met expectations.	2025-08-25 13:36:37.221718+00
1baaf10a-bcc4-40ff-8ae0-514a0459d437	f6b95ec7-4858-43bd-a5a7-cace06dae3a0	3c6ff2a2-e59e-48af-8a8e-9238dc49ecc6	d2e65c84-18ae-4b35-ae87-78a3ab244754	4	Good work done on time. Would recommend.	2025-08-21 16:41:13.442518+00
bd6ed6cb-7a5d-4967-b5ef-8fb13a821c05	3a561e03-0d16-459a-9119-1c32879de29a	496d267d-f0aa-4592-a87a-bd69e1196f23	d2e65c84-18ae-4b35-ae87-78a3ab244754	5	Perfect! Exceeded my expectations.	2025-12-02 08:48:29.186518+00
2f842e97-72ab-4e59-9b4a-7141a82bd1bc	1ed8e7b1-aa78-409c-a475-ba9e02224ba3	5c328f75-464c-4053-a41e-00fbc6eba934	d2e65c84-18ae-4b35-ae87-78a3ab244754	3	Good service overall. Met expectations.	2025-04-25 16:24:41.138518+00
78c53e31-9ab8-4b9b-8891-c711035e519c	02308de5-1b88-4b5e-97f8-6ef618b2a447	5c328f75-464c-4053-a41e-00fbc6eba934	cf981ea0-ea50-476e-aae6-96e103cfb358	3	Good service overall. Met expectations.	2025-03-31 23:03:43.010518+00
e43e849a-6cb7-406d-a99d-4163d1becbcd	5cef81ea-dd43-443e-b7aa-d4a327ef33ca	bed6bf7a-bfbb-4eac-b6d7-35ca3e7d6660	cf981ea0-ea50-476e-aae6-96e103cfb358	4	Good work done on time. Would recommend.	2025-04-01 01:56:21.938518+00
b185f022-5133-4223-a0e6-3e181090c1d7	ef9d96de-e76a-41fb-b9fe-48b98ae950e1	549f87d2-961e-48f8-bcff-7286d7db879e	cf981ea0-ea50-476e-aae6-96e103cfb358	5	Very satisfied with the quality of work. Highly recommended!	2025-07-26 08:10:30.386518+00
04fdecb3-8f47-40d0-9189-da4d8bf37f5c	d4273b3a-ab28-4458-b4cd-2c778ddebfa5	a8957421-6c24-4110-ad8a-89513c6cfe93	cf981ea0-ea50-476e-aae6-96e103cfb358	3	Good service overall. Met expectations.	2025-04-19 01:31:34.821718+00
89279d14-6115-4fb0-b5d4-9e734e09abad	7f44a390-a1d3-4767-8658-482982c4c488	ded07a3d-2dc7-40f1-a9df-81b72c989abf	cf981ea0-ea50-476e-aae6-96e103cfb358	4	Good work done on time. Would recommend.	2025-04-03 12:37:29.896918+00
f2ccb33a-68c3-4edb-a8ab-29791b7fcb96	0acd668c-cd56-4586-ac0e-ec44251c98d7	f74860cc-f981-42b4-809d-11e92bedd14f	25ecace8-49ad-4af9-b1aa-97352291eb02	5	Outstanding work! Highly professional and efficient.	2025-09-18 20:44:59.839318+00
32071d50-8c56-492d-a6a9-d592d8cb2df1	2523a3dc-f24d-4226-9114-c619ff72dd3f	d951675f-497c-4ccb-b55d-6a72f9cfb8fc	25ecace8-49ad-4af9-b1aa-97352291eb02	3	Good service overall. Met expectations.	2025-08-07 13:54:37.480918+00
d1527848-1e92-4cb8-983d-358ecc904a02	08a22194-2f07-49b5-a85e-755f0b5eb9a1	dd3b46e4-576f-488e-928f-a5a2688e0fd4	25ecace8-49ad-4af9-b1aa-97352291eb02	4	Good work done on time. Would recommend.	2025-05-24 08:15:33.391318+00
32c58bcf-2c38-4235-9d9c-557f6ebaf1d5	30b6bf8c-7d28-4af6-b1ab-7d23e67df9f7	7d6e1a27-d7f8-445f-a544-81c817a39304	25ecace8-49ad-4af9-b1aa-97352291eb02	5	Perfect! Exceeded my expectations.	2025-11-16 02:18:36.732118+00
86fc28c4-6251-40c5-924c-f112b09331e2	dbc78f0c-b0c6-4fa9-9eb4-3ba00ccc4353	088c7759-5ee8-4fd2-99fa-6d6953d6e99c	25ecace8-49ad-4af9-b1aa-97352291eb02	3	Good service overall. Met expectations.	2025-12-11 17:05:23.148118+00
4b05cd7b-1746-4ed8-bc5a-0d0553a0eae6	69b37d05-b900-4e1f-94e1-a8f8646f591d	ce930397-85a0-4a2c-9d12-343341780701	25ecace8-49ad-4af9-b1aa-97352291eb02	4	Good work done on time. Would recommend.	2025-11-24 04:14:08.517718+00
2a971376-1fe0-4ed1-a250-ec44f7884665	0cbb2ef5-3b25-43e3-bdce-4e7ddc82e571	2637c6dd-5fbe-487c-85c5-3ef87dc74cf5	25ecace8-49ad-4af9-b1aa-97352291eb02	5	Very satisfied with the quality of work. Highly recommended!	2025-05-02 10:03:20.085718+00
b41f8239-9999-4982-bf5a-591c0f40d953	c1949b70-ac23-4d13-b284-097cd3575424	d4d09b07-6022-4d29-8d83-2905a67c2fb0	25ecace8-49ad-4af9-b1aa-97352291eb02	3	Good service overall. Met expectations.	2025-11-30 03:49:16.044118+00
7a22fccb-8bde-4887-b12a-2ee2a5740cfe	f2066b9d-5aa1-4037-a306-613e04f328d8	9c0e3b56-4094-4a57-b207-abb436a8fe3d	25ecace8-49ad-4af9-b1aa-97352291eb02	4	Good work done on time. Would recommend.	2025-09-04 01:33:29.820118+00
83cd3bb6-c460-406f-81f8-75e13f407872	6926ac76-d577-4df6-b33b-35f7f953576c	6e0bbfe1-f2fd-4356-8684-bc8d8fb15a28	25ecace8-49ad-4af9-b1aa-97352291eb02	5	Excellent service! Will definitely hire again.	2025-08-07 06:55:08.728918+00
59486511-cac8-4246-9830-d78670cde6ae	f5b6a0c6-1cf3-4839-84e8-bbf125e24f5c	2f6a0b4d-ff98-443f-a347-bc1c2e867bf5	25ecace8-49ad-4af9-b1aa-97352291eb02	3	Good service overall. Met expectations.	2025-12-07 16:19:07.893718+00
f583d679-fe22-483c-b4b0-16a9df662707	3443ac99-5bef-4b02-94a7-5497341dc441	2637c6dd-5fbe-487c-85c5-3ef87dc74cf5	d1be4162-b83a-400e-9a30-07f3b2bf2f37	5	Very satisfied with the quality of work. Highly recommended!	2025-12-14 20:46:48.876118+00
ad4a99d5-fa08-4b8c-83e1-1081c1bd617a	5366b130-7029-4bc2-af86-4affa6bf6ea4	d4d09b07-6022-4d29-8d83-2905a67c2fb0	d1be4162-b83a-400e-9a30-07f3b2bf2f37	3	Good service overall. Met expectations.	2025-09-19 00:13:36.520918+00
3d74869d-fe8a-4ff4-8145-08b63638e3ed	9690d6d8-c230-42c2-bc84-ed3372ae521f	9c0e3b56-4094-4a57-b207-abb436a8fe3d	d1be4162-b83a-400e-9a30-07f3b2bf2f37	4	Good work done on time. Would recommend.	2025-11-26 12:36:19.567318+00
60728110-ff35-478b-963d-927ec195807e	483ff1e0-5fa8-484d-bb1a-82af7406323c	6e0bbfe1-f2fd-4356-8684-bc8d8fb15a28	d1be4162-b83a-400e-9a30-07f3b2bf2f37	5	Excellent service! Will definitely hire again.	2025-07-28 00:30:33.016918+00
713ebca1-41fe-46ed-968b-c9c300daaae8	09daa833-1841-420c-9dc2-cfa761bcf63c	2f6a0b4d-ff98-443f-a347-bc1c2e867bf5	d1be4162-b83a-400e-9a30-07f3b2bf2f37	3	Good service overall. Met expectations.	2025-09-26 18:07:22.927318+00
c8eb9e2b-2701-4d8d-9202-9e4824d8eeb8	1e28186a-8b59-4687-a864-0f82ba43fb08	c02b1823-7eec-4776-812e-b2a42402a542	d1be4162-b83a-400e-9a30-07f3b2bf2f37	4	Good work done on time. Would recommend.	2025-06-28 13:55:00.204118+00
161a58f9-8f34-4fe2-8828-4953ca791dd4	4c617aed-738c-4f0f-bd8c-f70509bc476e	8568204d-bac8-4bd2-be49-666099493157	d1be4162-b83a-400e-9a30-07f3b2bf2f37	5	Outstanding work! Highly professional and efficient.	2025-06-12 02:32:50.277718+00
b77afc77-155f-4926-b686-2e6224ac270c	ac422590-0d00-4232-8739-f14bad1cb441	3505bad0-2d27-427b-ae95-3169a5838fbf	d1be4162-b83a-400e-9a30-07f3b2bf2f37	3	Good service overall. Met expectations.	2025-07-29 14:43:11.925718+00
549b5e9a-8864-4903-b717-aab76fbebd5e	409c85cc-4d84-4beb-8f69-67c2353c5367	5be0cd9f-a466-4485-ac43-bdc4b104ecc0	d1be4162-b83a-400e-9a30-07f3b2bf2f37	4	Good work done on time. Would recommend.	2025-07-27 15:22:18.808918+00
99c4c9df-cd88-4241-a74b-18988d26be2f	51ccefea-4bfb-4f4e-8c99-7d20599b0664	3505bad0-2d27-427b-ae95-3169a5838fbf	6a3724bd-1757-4b94-be45-5650c4cbc84a	3	Good service overall. Met expectations.	2025-09-02 08:29:04.428118+00
41d7339b-cae5-46ed-b4b0-dc1d050e41b9	d1d14c30-bac2-44ce-b22a-5ff09fbe8826	5be0cd9f-a466-4485-ac43-bdc4b104ecc0	6a3724bd-1757-4b94-be45-5650c4cbc84a	4	Good work done on time. Would recommend.	2025-04-27 20:40:36.492118+00
4b8fe012-9384-479d-91cf-002390d73865	312fa649-6ae4-4ca9-bfa3-cfe2a6db10b3	ee82e0a0-0f37-4a6f-ae93-2113eddeb55c	6a3724bd-1757-4b94-be45-5650c4cbc84a	5	Perfect! Exceeded my expectations.	2025-06-16 19:28:35.455318+00
1f2293ce-b2b0-4e72-bb07-a080da9c7565	65cacca0-1f9e-47f3-aec8-57dea31ebbe5	40ec397a-f1cf-4855-8a3a-c5673fb20e05	6a3724bd-1757-4b94-be45-5650c4cbc84a	3	Good service overall. Met expectations.	2025-03-21 14:11:05.551318+00
79a62567-1010-451a-9b0c-06cefdfcbff4	f7527b48-ad64-49cb-83a5-2a2aca12a883	0897825a-ab99-41e9-98ba-b4ed822155a5	6a3724bd-1757-4b94-be45-5650c4cbc84a	4	Good work done on time. Would recommend.	2025-09-18 19:56:27.986518+00
7370305a-ea5a-457d-9fc0-60765f051330	067508aa-d2fe-4c88-8437-d4edff27b1c7	b19b93f9-ccf5-4b17-bdcf-a105d11018af	6a3724bd-1757-4b94-be45-5650c4cbc84a	5	Very satisfied with the quality of work. Highly recommended!	2025-08-08 09:29:13.269718+00
18d758e8-6a67-4322-8a7c-0abaac5c422a	353e9a03-fb66-41f9-b3a2-a1b7222d67a4	97c5f2cc-ef11-452a-9aa3-b4705f3280f8	2abd59e7-f229-4457-9b4f-05dd7ff9f950	4	Good work done on time. Would recommend.	2025-12-19 16:45:52.946518+00
7c1ce6dc-f39b-468b-8b1d-f60cc3958dcf	12c67012-a8bc-4d24-b552-ab7f355d78d0	1be14a91-1b2c-48d6-8465-d1d4d12a785c	2abd59e7-f229-4457-9b4f-05dd7ff9f950	5	Excellent service! Will definitely hire again.	2025-05-06 19:08:47.368918+00
cfcb28c8-ae13-4421-a1e1-9b970a7204c7	5e469bb3-0208-4aa2-850a-f0127a369bb0	4cfa17c8-4d9f-4283-97f2-3a4976248b91	2abd59e7-f229-4457-9b4f-05dd7ff9f950	3	Good service overall. Met expectations.	2025-07-09 20:46:30.818518+00
f0980ee0-888d-4ff1-8371-e991a7116b3d	6b73bf11-d443-40f9-86a6-429386767ea0	57dfd528-5470-40a1-8fde-40eb61dd7ae1	2abd59e7-f229-4457-9b4f-05dd7ff9f950	4	Good work done on time. Would recommend.	2025-09-24 03:13:21.400918+00
df3809cc-9f60-492a-b851-8ac7146e05f2	0427744a-c9d8-4bea-b090-a851213a85ad	3cc9e6b9-d7d7-4d91-904b-65aeb230b14b	2abd59e7-f229-4457-9b4f-05dd7ff9f950	5	Outstanding work! Highly professional and efficient.	2025-09-01 22:20:58.572118+00
de08fb50-7d00-433b-ac08-7698b9d1e97c	343a9b76-bd1b-47d7-a546-6bf1c3347620	ff8bb61b-1117-4f5c-880b-ac4ebd7ea6c2	2abd59e7-f229-4457-9b4f-05dd7ff9f950	3	Good service overall. Met expectations.	2025-09-21 15:22:04.380118+00
1984e574-63cf-4255-bf5e-5bc8330e543d	f36a89a6-e06b-445b-ad59-550cc22e8e87	feaac7e1-3bc3-4462-b2f8-b4a19f990531	2abd59e7-f229-4457-9b4f-05dd7ff9f950	4	Good work done on time. Would recommend.	2025-12-02 18:42:47.244118+00
3c3abc8d-09d9-403f-a261-0b4888d2b6b8	0b6cbc6f-6d6d-4504-ad99-93e5149d56c2	8d3c4c94-5ab8-4070-a7cc-a12e88219bf3	2abd59e7-f229-4457-9b4f-05dd7ff9f950	5	Perfect! Exceeded my expectations.	2025-10-12 19:01:02.277718+00
6aecb3a5-3391-48af-85da-85182d2cd366	47f1f77a-6726-4629-bbd4-2b4988eec656	158e9458-44c9-4638-83b9-bf0c99bdb64a	2abd59e7-f229-4457-9b4f-05dd7ff9f950	3	Good service overall. Met expectations.	2025-04-27 07:50:37.116118+00
0334a581-763f-43ca-a87c-7d93b7960c4a	4024c972-a3fb-4a6f-aa8a-9259285ef27a	503f2221-11c2-4415-9a5b-9b0e81e95b67	2abd59e7-f229-4457-9b4f-05dd7ff9f950	4	Good work done on time. Would recommend.	2025-05-31 11:29:19.807318+00
484000a2-f0eb-4dbf-bf72-0c7731fd1e63	081f0277-c893-43c0-9cce-ac80ee10cca1	5eae5e90-1914-41e5-be8a-aef4314d4892	2abd59e7-f229-4457-9b4f-05dd7ff9f950	5	Very satisfied with the quality of work. Highly recommended!	2025-04-12 18:32:49.010518+00
2a5e5548-af5d-446f-bb63-42033def1d93	16fac697-ad98-4cf1-947a-4114646316c9	4893cb6b-0ffd-422a-b940-7b9201daa34f	2abd59e7-f229-4457-9b4f-05dd7ff9f950	3	Good service overall. Met expectations.	2025-10-04 22:56:05.090518+00
61852ce6-8605-4052-9a35-d7ecf6cc1935	c486e016-df0b-4a0c-b401-c3b8bbf44152	218a9cdd-7d3a-44c9-bd7a-d885d38d6063	2abd59e7-f229-4457-9b4f-05dd7ff9f950	4	Good work done on time. Would recommend.	2025-07-30 10:22:11.580118+00
19ddae87-7c8d-4084-9856-248c5902e25b	2d7ac1e4-e7e3-4fc6-a7ff-903926fffd0b	8d3c4c94-5ab8-4070-a7cc-a12e88219bf3	f2252c07-5c2c-4dee-8cb4-9475115c59ca	5	Perfect! Exceeded my expectations.	2025-06-12 09:37:47.522518+00
79c435ba-8359-41de-97c5-b64217e0f464	78038dcd-b529-48f1-b027-117fc312adc4	158e9458-44c9-4638-83b9-bf0c99bdb64a	f2252c07-5c2c-4dee-8cb4-9475115c59ca	3	Good service overall. Met expectations.	2025-12-03 13:40:45.794518+00
fc3c4b01-34b7-4287-a9da-226bdc6a9a6a	c6118eb4-bb64-4833-b143-7bae11e50982	503f2221-11c2-4415-9a5b-9b0e81e95b67	f2252c07-5c2c-4dee-8cb4-9475115c59ca	4	Good work done on time. Would recommend.	2025-06-25 19:28:27.074518+00
60c9b277-1ab7-4f68-a989-cd23026679ca	9794ac10-7a4e-4feb-87f9-4e11a444161c	5eae5e90-1914-41e5-be8a-aef4314d4892	f2252c07-5c2c-4dee-8cb4-9475115c59ca	5	Very satisfied with the quality of work. Highly recommended!	2025-04-09 00:44:44.661718+00
67bd4160-d2dc-411c-8fac-46f28bc7bcd9	20084069-fcc5-453c-a135-0212db97fa75	4893cb6b-0ffd-422a-b940-7b9201daa34f	f2252c07-5c2c-4dee-8cb4-9475115c59ca	3	Good service overall. Met expectations.	2025-08-04 15:29:18.712918+00
c950876c-b58c-4331-966a-d674516e4c05	5fd70e17-4adb-4259-9676-fc3856199417	218a9cdd-7d3a-44c9-bd7a-d885d38d6063	f2252c07-5c2c-4dee-8cb4-9475115c59ca	4	Good work done on time. Would recommend.	2025-11-01 19:06:57.122518+00
7b5d4b13-7558-4b5f-bb21-64a8eaa38156	93120b33-39e8-4ea2-b38b-435f5000ab5b	4eea189c-607a-466d-8f92-1f53d790fb6f	f2252c07-5c2c-4dee-8cb4-9475115c59ca	5	Excellent service! Will definitely hire again.	2025-09-14 20:20:34.495318+00
c4977cc6-ecfa-435f-8055-3b9eb307bc53	efd0a0fe-2731-4f1c-832a-bb2032cdc489	5c74fdb2-b4d9-4f4b-9c6c-f6b72854db84	f2252c07-5c2c-4dee-8cb4-9475115c59ca	3	Good service overall. Met expectations.	2025-10-12 06:14:18.597718+00
8c21777e-c17f-4bf0-83a9-1898ae28b7d7	6912c32b-a564-4270-b981-78b4f68726b7	9e61d17b-97a4-45e7-a26c-4fdc3086cdb7	f2252c07-5c2c-4dee-8cb4-9475115c59ca	4	Good work done on time. Would recommend.	2025-05-09 04:46:08.325718+00
e96c7a9e-4ce3-4407-8522-753affd18c1a	3fa29dc5-69bd-49c2-896e-e0104f42d157	6302ea1c-5af4-4302-918a-c87152175bae	f2252c07-5c2c-4dee-8cb4-9475115c59ca	5	Outstanding work! Highly professional and efficient.	2025-07-05 04:54:54.674518+00
2f6fff60-85ae-4188-baff-a8777821977d	d62fa0fe-e9bd-45e6-bf6c-e29d9c5a3065	5c74fdb2-b4d9-4f4b-9c6c-f6b72854db84	86ad7fd4-80f1-4376-af0b-29926fdf3944	3	Good service overall. Met expectations.	2025-05-25 07:42:38.892118+00
34ae6fb5-a417-4750-88d5-f5e396906b21	1582dcc3-4b22-42f7-8e2d-56ea32413c53	9e61d17b-97a4-45e7-a26c-4fdc3086cdb7	86ad7fd4-80f1-4376-af0b-29926fdf3944	4	Good work done on time. Would recommend.	2025-10-15 08:40:49.106518+00
35894492-cd66-48c5-af2f-2fe835135cbb	763f1149-eb32-45ca-9a7f-313b254b394b	6302ea1c-5af4-4302-918a-c87152175bae	86ad7fd4-80f1-4376-af0b-29926fdf3944	5	Outstanding work! Highly professional and efficient.	2025-06-06 23:12:03.612118+00
63aa11be-982b-46b9-8658-81fea095defb	6727fde8-2275-4aa2-806c-6c817c106dc7	a3563a32-75c5-4d0b-b672-9f548fe69a06	86ad7fd4-80f1-4376-af0b-29926fdf3944	3	Good service overall. Met expectations.	2025-06-09 09:23:52.293718+00
6e35c7fc-865e-4452-a15c-1384c57941d9	acdcfa61-9cb8-4a39-8f3f-a1f52aade66d	5fcd65e1-d364-4762-a7e2-9939ef039247	86ad7fd4-80f1-4376-af0b-29926fdf3944	4	Good work done on time. Would recommend.	2025-07-08 15:19:52.015318+00
61b48ffb-290a-4015-b747-34753f27bed8	a9fcb2f9-46ec-4bea-aba2-46362216dc17	649a4947-627c-43f2-9c5e-b75f213a0d93	86ad7fd4-80f1-4376-af0b-29926fdf3944	5	Perfect! Exceeded my expectations.	2025-08-02 09:44:24.098518+00
38f1ef9f-1323-491b-bc14-f135e8e06e9a	5ea747d0-bd7c-4ea9-9c3a-bd03baeb0ad3	3c6ff2a2-e59e-48af-8a8e-9238dc49ecc6	86ad7fd4-80f1-4376-af0b-29926fdf3944	3	Good service overall. Met expectations.	2025-05-08 01:46:38.220118+00
b61928ec-fac7-4b58-8871-4715cae591d7	40df5060-9d6a-4f24-b50a-3194c07a06f6	496d267d-f0aa-4592-a87a-bd69e1196f23	aeef5a83-d194-4ab2-bc0e-0b8d59c3f9d6	4	Good work done on time. Would recommend.	2025-05-16 09:56:52.063318+00
2e837fd2-16ca-400f-9d76-5458007696b0	3e999446-de4e-4a6a-baa7-2b785203957f	5c328f75-464c-4053-a41e-00fbc6eba934	aeef5a83-d194-4ab2-bc0e-0b8d59c3f9d6	5	Very satisfied with the quality of work. Highly recommended!	2025-12-06 13:35:04.860118+00
e83bb073-13f4-432c-a96e-7a77e53b1242	73ccf1b7-0086-4a7a-9d1c-26b8d2b80ab5	bed6bf7a-bfbb-4eac-b6d7-35ca3e7d6660	aeef5a83-d194-4ab2-bc0e-0b8d59c3f9d6	3	Good service overall. Met expectations.	2025-09-09 10:20:12.348118+00
0c7772cb-58dd-4846-bb13-e6b6129071f0	d7a3ded2-012a-4b14-81aa-e96b5529e6fe	549f87d2-961e-48f8-bcff-7286d7db879e	aeef5a83-d194-4ab2-bc0e-0b8d59c3f9d6	4	Good work done on time. Would recommend.	2025-06-23 10:54:40.677718+00
861e65db-27df-47a2-ad04-da7e9618ddf5	4c6aa853-3056-436c-960b-e0114f53c37b	216ebdf7-cd45-4b40-86f2-268b4e33bb68	5eaabc8f-02e6-43e3-a7e1-7c223c8fee9d	3	Good service overall. Met expectations.	2025-05-01 04:20:01.807318+00
1d293430-7da7-4ef2-91dd-4e1580d8ef47	75f4d0bc-189e-4cc8-8808-8d574b923be3	f74860cc-f981-42b4-809d-11e92bedd14f	5eaabc8f-02e6-43e3-a7e1-7c223c8fee9d	4	Good work done on time. Would recommend.	2025-08-05 18:57:40.360918+00
a59e52bc-cb58-4817-924e-564e6955722e	88e42201-cbb2-4d0a-ad1b-3970f60f0a1c	d951675f-497c-4ccb-b55d-6a72f9cfb8fc	5eaabc8f-02e6-43e3-a7e1-7c223c8fee9d	5	Perfect! Exceeded my expectations.	2025-05-01 22:52:39.717718+00
7b4c69df-acea-4dd5-9a25-82b390c0f7db	86c0d424-8966-4303-bb09-63cb183c2083	dd3b46e4-576f-488e-928f-a5a2688e0fd4	5eaabc8f-02e6-43e3-a7e1-7c223c8fee9d	3	Good service overall. Met expectations.	2025-05-13 10:27:14.844118+00
70d72261-7b79-4b55-9e2b-5c5f358e2f6e	9d267bef-a30c-401e-b9d5-aed52b2016ca	7d6e1a27-d7f8-445f-a544-81c817a39304	5eaabc8f-02e6-43e3-a7e1-7c223c8fee9d	4	Good work done on time. Would recommend.	2025-05-28 15:14:27.064918+00
2ab341d6-8cc5-48bf-8c44-9cdfa6adabcc	ee835322-6c8a-4820-b1a5-54e49445c38c	088c7759-5ee8-4fd2-99fa-6d6953d6e99c	5eaabc8f-02e6-43e3-a7e1-7c223c8fee9d	5	Very satisfied with the quality of work. Highly recommended!	2025-11-01 18:40:00.664918+00
0737f1a5-133b-4d1e-9519-b0d9752af03c	39fbbcd9-3429-429f-9f11-e7bc3a5478bb	ce930397-85a0-4a2c-9d12-343341780701	5eaabc8f-02e6-43e3-a7e1-7c223c8fee9d	3	Good service overall. Met expectations.	2025-07-10 21:35:42.415318+00
0e93eddc-2949-4d56-884c-0c552e0e0f3a	4bb549b7-5a6b-4215-b7ff-1221b6e25e28	2637c6dd-5fbe-487c-85c5-3ef87dc74cf5	5eaabc8f-02e6-43e3-a7e1-7c223c8fee9d	4	Good work done on time. Would recommend.	2025-04-07 23:07:45.016918+00
a822354a-80ef-4c9b-9c31-ac1ba94d0c56	df548333-a98a-48dd-b814-a5323a1438ad	d4d09b07-6022-4d29-8d83-2905a67c2fb0	5eaabc8f-02e6-43e3-a7e1-7c223c8fee9d	5	Excellent service! Will definitely hire again.	2025-11-30 04:47:34.207318+00
fe039b37-fb08-4c6a-b8d1-f8a770ed5b8f	f8e8a818-ab0b-4c13-ada9-20304f02cc54	9c0e3b56-4094-4a57-b207-abb436a8fe3d	5eaabc8f-02e6-43e3-a7e1-7c223c8fee9d	3	Good service overall. Met expectations.	2025-07-13 02:19:59.244118+00
4bdb220c-d0c0-4e4e-9025-3edb6ed33537	452940ae-b00f-4441-8e05-62a292cae774	ce930397-85a0-4a2c-9d12-343341780701	f237dee0-b324-4b4f-8a56-e51c8dfe7941	3	Good service overall. Met expectations.	2025-03-24 16:05:42.300118+00
a5439527-6ff9-410c-9dd1-f112219c725d	5a9cdda7-820a-4710-90e7-1ae3b68b6664	2637c6dd-5fbe-487c-85c5-3ef87dc74cf5	f237dee0-b324-4b4f-8a56-e51c8dfe7941	4	Good work done on time. Would recommend.	2025-12-10 21:13:30.645718+00
8e086524-5f51-45da-a20b-3558638ec0f4	2df03dd4-09df-412d-a8f4-f1d20c82fa28	d4d09b07-6022-4d29-8d83-2905a67c2fb0	f237dee0-b324-4b4f-8a56-e51c8dfe7941	5	Excellent service! Will definitely hire again.	2025-07-13 17:49:32.863318+00
2219b912-28ec-4963-bd4d-872da28351fc	b440406f-6e0e-46bc-aae3-22208e917686	9c0e3b56-4094-4a57-b207-abb436a8fe3d	f237dee0-b324-4b4f-8a56-e51c8dfe7941	3	Good service overall. Met expectations.	2025-09-16 06:06:21.496918+00
a48a5a4e-cd5d-4b56-8538-6d8eef1f34f2	4d5d9511-9069-4fd3-8fe8-d078bfe7e13d	6e0bbfe1-f2fd-4356-8684-bc8d8fb15a28	f237dee0-b324-4b4f-8a56-e51c8dfe7941	4	Good work done on time. Would recommend.	2025-06-04 20:35:58.802518+00
d43989cd-e8a5-4bf9-b8b2-27115880a9f6	0b716487-565f-484c-8e2b-9a3af9d2abaf	2f6a0b4d-ff98-443f-a347-bc1c2e867bf5	f237dee0-b324-4b4f-8a56-e51c8dfe7941	5	Outstanding work! Highly professional and efficient.	2025-08-28 22:00:02.488918+00
5db70663-1feb-43e7-84a2-69ee4003833c	8ba3a312-1f89-4e43-a9d5-464784b01e5b	c02b1823-7eec-4776-812e-b2a42402a542	f237dee0-b324-4b4f-8a56-e51c8dfe7941	3	Good service overall. Met expectations.	2025-11-17 04:21:46.869718+00
d761cab8-03ea-4596-8350-96237f1f1a2f	0382d1c0-5656-4041-aa10-61ec34ea9917	8568204d-bac8-4bd2-be49-666099493157	f237dee0-b324-4b4f-8a56-e51c8dfe7941	4	Good work done on time. Would recommend.	2025-07-31 12:56:34.696918+00
43ce01e2-d593-4d5c-a38a-337f04f3e705	636874f9-6cfd-428d-9768-8b56298a66c1	8568204d-bac8-4bd2-be49-666099493157	6905635d-7e04-460d-8734-d8cfede31a47	4	Good work done on time. Would recommend.	2025-04-12 04:49:18.060118+00
542b778d-2086-401d-8791-ad5acd6cb0a8	4812adad-210f-4d22-a1fe-9d1b16c2d4d5	3505bad0-2d27-427b-ae95-3169a5838fbf	6905635d-7e04-460d-8734-d8cfede31a47	5	Perfect! Exceeded my expectations.	2025-06-10 20:58:10.226518+00
7938bd8c-73fc-4a0f-8523-4037902dbce0	7c0ed1e3-34ee-4c15-acd7-38b3cb15e49d	5be0cd9f-a466-4485-ac43-bdc4b104ecc0	6905635d-7e04-460d-8734-d8cfede31a47	3	Good service overall. Met expectations.	2025-07-22 22:15:25.413718+00
c3a782cc-8f4d-4f9b-b691-a437c1d60d5e	05964ba6-36b0-45f7-9497-5014091e44a7	ee82e0a0-0f37-4a6f-ae93-2113eddeb55c	6905635d-7e04-460d-8734-d8cfede31a47	4	Good work done on time. Would recommend.	2025-07-08 12:55:57.026518+00
aabcfe21-b9ca-4b95-9574-121c82a9c2ea	da1d1789-e28d-4b17-a36b-4cfe51466087	40ec397a-f1cf-4855-8a3a-c5673fb20e05	6905635d-7e04-460d-8734-d8cfede31a47	5	Very satisfied with the quality of work. Highly recommended!	2025-09-15 02:59:37.749718+00
e6030682-0ccf-4503-8ecb-9029e5d6b8ad	2499a393-7407-44f0-afaa-664f486afa10	97c5f2cc-ef11-452a-9aa3-b4705f3280f8	ce45455d-4356-4250-b920-27e2a9a6acd3	3	Good service overall. Met expectations.	2025-04-04 04:05:39.448918+00
7dcbc9d4-67b2-48b5-b92c-3c32ff5ff6ea	4d71670b-be91-40d6-a825-6865f2de56dc	1be14a91-1b2c-48d6-8465-d1d4d12a785c	ce45455d-4356-4250-b920-27e2a9a6acd3	4	Good work done on time. Would recommend.	2025-06-11 19:04:19.701718+00
05300b46-7704-42cc-a42b-1e37f57dc887	b0ee1129-3d23-4591-b4b9-b784c0f36481	4cfa17c8-4d9f-4283-97f2-3a4976248b91	ce45455d-4356-4250-b920-27e2a9a6acd3	5	Outstanding work! Highly professional and efficient.	2025-04-05 22:04:47.090518+00
40154f01-9439-4354-bdcf-11727582c438	37310c0f-2217-4396-9d29-991ede4da91b	57dfd528-5470-40a1-8fde-40eb61dd7ae1	ce45455d-4356-4250-b920-27e2a9a6acd3	3	Good service overall. Met expectations.	2025-10-27 04:46:41.935318+00
268b3f42-4858-4a5f-8470-b6332ec57724	7bf621c0-cd2b-4583-856a-87316c00a817	3cc9e6b9-d7d7-4d91-904b-65aeb230b14b	ce45455d-4356-4250-b920-27e2a9a6acd3	4	Good work done on time. Would recommend.	2025-07-14 18:59:06.328918+00
0acd4253-8982-483e-ba45-6c064380e4cb	f0e03a0a-acb5-4975-94bb-44542e5ae43f	ff8bb61b-1117-4f5c-880b-ac4ebd7ea6c2	ce45455d-4356-4250-b920-27e2a9a6acd3	5	Perfect! Exceeded my expectations.	2025-12-19 09:49:46.975318+00
5399dbf1-bb08-427c-822f-3fb4048832be	2aa4036e-aeb5-449c-bc77-14e587564b19	feaac7e1-3bc3-4462-b2f8-b4a19f990531	ce45455d-4356-4250-b920-27e2a9a6acd3	3	Good service overall. Met expectations.	2025-04-01 21:38:15.861718+00
32e3db6f-9d65-468e-9494-c6c59c77549f	8f412d60-464d-4d9e-abae-aa2f306d17c1	8d3c4c94-5ab8-4070-a7cc-a12e88219bf3	ce45455d-4356-4250-b920-27e2a9a6acd3	4	Good work done on time. Would recommend.	2025-05-14 17:49:37.701718+00
dccff9fe-c175-41a6-8e48-1adc51246764	7f5d7465-fef5-4f04-93ad-cf4e6487b0c8	158e9458-44c9-4638-83b9-bf0c99bdb64a	ce45455d-4356-4250-b920-27e2a9a6acd3	5	Very satisfied with the quality of work. Highly recommended!	2025-07-09 23:06:42.463318+00
befbc5d9-938f-456b-9454-d1b878b5f349	a58d46cc-6977-4869-ba39-af9adad80379	503f2221-11c2-4415-9a5b-9b0e81e95b67	ce45455d-4356-4250-b920-27e2a9a6acd3	3	Good service overall. Met expectations.	2025-11-07 02:51:39.784918+00
9e8a9f5e-ed0c-4ff5-a6fa-6d02e8c50303	e6c776b6-6b25-41b7-b9b8-4f2ab31fb719	5eae5e90-1914-41e5-be8a-aef4314d4892	ce45455d-4356-4250-b920-27e2a9a6acd3	4	Good work done on time. Would recommend.	2025-05-14 20:35:12.492118+00
f7f152a0-3a1c-4721-af11-0803dbedb1b4	300c4c02-eb19-4dd1-ba45-e1661c2c4e05	feaac7e1-3bc3-4462-b2f8-b4a19f990531	307faedf-c25e-4493-a483-60960460ef13	3	Good service overall. Met expectations.	2025-08-10 19:54:36.789718+00
c7c6590f-de6b-4299-9224-869261c53d15	8bf019a0-7858-4710-96bd-aca3cc2c9c02	8d3c4c94-5ab8-4070-a7cc-a12e88219bf3	307faedf-c25e-4493-a483-60960460ef13	4	Good work done on time. Would recommend.	2025-06-07 17:04:01.068118+00
266251d3-9f53-495d-a5f6-69d074e823ce	24a91f08-84fa-4889-81d4-ce774ebd19ba	158e9458-44c9-4638-83b9-bf0c99bdb64a	307faedf-c25e-4493-a483-60960460ef13	5	Very satisfied with the quality of work. Highly recommended!	2025-08-12 18:48:09.343318+00
c6ab86d6-9080-407a-a157-7fd97eae04da	3a110d7c-b682-4c2d-82aa-d4b06143a971	503f2221-11c2-4415-9a5b-9b0e81e95b67	307faedf-c25e-4493-a483-60960460ef13	3	Good service overall. Met expectations.	2025-09-26 09:44:02.584918+00
33e5e9c0-4643-4073-a3c9-ed7c513ffb95	7881ccfb-a137-49d0-b8b4-99a8b645b916	5eae5e90-1914-41e5-be8a-aef4314d4892	307faedf-c25e-4493-a483-60960460ef13	4	Good work done on time. Would recommend.	2025-09-28 22:36:54.069718+00
ca82cba9-52d7-4a1e-85c2-46292e263f36	1f66e680-f8aa-41f1-a3ad-5d4d2fdc58ef	4893cb6b-0ffd-422a-b940-7b9201daa34f	307faedf-c25e-4493-a483-60960460ef13	5	Excellent service! Will definitely hire again.	2025-06-20 03:47:58.456918+00
e7d4fddc-04ef-4e63-9236-3837e17bf326	8fb86f22-457f-4c08-a181-c36d03e25847	218a9cdd-7d3a-44c9-bd7a-d885d38d6063	307faedf-c25e-4493-a483-60960460ef13	3	Good service overall. Met expectations.	2025-05-11 04:26:45.295318+00
57efa0a1-5a34-4580-a456-9e2323554008	a60da30b-0512-4ee2-8ba1-38f6e028d934	4eea189c-607a-466d-8f92-1f53d790fb6f	307faedf-c25e-4493-a483-60960460ef13	4	Good work done on time. Would recommend.	2025-03-23 05:33:54.732118+00
b630af84-e47f-42f6-9343-545424d8a2d7	722b582c-afed-4251-bd4a-7f3cbd420a5a	5c74fdb2-b4d9-4f4b-9c6c-f6b72854db84	307faedf-c25e-4493-a483-60960460ef13	5	Outstanding work! Highly professional and efficient.	2025-10-01 23:57:25.125718+00
a14b9b9e-7e55-482a-bdb9-c50e62fa3f62	8a05626f-b4bf-474d-8e7a-bf1f7998606b	4eea189c-607a-466d-8f92-1f53d790fb6f	eaa4b66d-41c3-4990-a1e8-9570f25a2a90	4	Good work done on time. Would recommend.	2025-10-25 23:04:33.295318+00
3ee12c08-e390-4c7c-bca1-27008b3a4782	2213fca1-1156-4e9a-89e4-b4a4b46d2cc8	5c74fdb2-b4d9-4f4b-9c6c-f6b72854db84	eaa4b66d-41c3-4990-a1e8-9570f25a2a90	5	Outstanding work! Highly professional and efficient.	2025-11-08 01:23:53.618518+00
6f7a90a7-a150-444e-a2e2-a913deca7945	7c2783f5-96df-46cd-b122-e4ee9ce7e444	9e61d17b-97a4-45e7-a26c-4fdc3086cdb7	eaa4b66d-41c3-4990-a1e8-9570f25a2a90	3	Good service overall. Met expectations.	2025-05-05 21:13:58.898518+00
fc81f089-b039-4607-8e15-9101e6f78378	ce856a33-5c7c-4f06-a0f4-b86acf0b6ae7	6302ea1c-5af4-4302-918a-c87152175bae	eaa4b66d-41c3-4990-a1e8-9570f25a2a90	4	Good work done on time. Would recommend.	2025-12-07 09:39:44.421718+00
f9f04077-e108-4f81-aaa3-7c2d5d3b62e5	fe662ef1-aace-4f58-a314-5004b6fbe148	a3563a32-75c5-4d0b-b672-9f548fe69a06	eaa4b66d-41c3-4990-a1e8-9570f25a2a90	5	Perfect! Exceeded my expectations.	2025-07-31 07:39:48.856918+00
2efd5423-92c7-4379-a1ea-6778dc7cfe42	e115896f-a1e5-419d-ba40-bac0375985a4	5fcd65e1-d364-4762-a7e2-9939ef039247	eaa4b66d-41c3-4990-a1e8-9570f25a2a90	3	Good service overall. Met expectations.	2025-06-14 14:00:30.943318+00
a7ee6dd2-0cc7-4171-a09a-201a1c69cb78	c7ac9622-0f81-4045-83fd-57085bb996b9	3c6ff2a2-e59e-48af-8a8e-9238dc49ecc6	c3542c4f-23e1-4df8-bcab-3b5aace21c7b	5	Very satisfied with the quality of work. Highly recommended!	2025-08-24 22:39:12.914518+00
a08f0f69-5531-4804-90bc-74a04c261c26	dad81484-9c38-4013-b0e3-57a12d36702a	496d267d-f0aa-4592-a87a-bd69e1196f23	c3542c4f-23e1-4df8-bcab-3b5aace21c7b	3	Good service overall. Met expectations.	2025-08-05 11:17:11.196118+00
2abbd34e-3c2c-4f4b-b534-32449abcda48	c527356d-e286-41fd-9952-8caddfdaaa36	5c328f75-464c-4053-a41e-00fbc6eba934	c3542c4f-23e1-4df8-bcab-3b5aace21c7b	4	Good work done on time. Would recommend.	2025-07-30 03:35:12.952918+00
e226e32f-9c5d-4147-a317-ddd5589d27e3	6b9cdc55-3cb7-4b90-ba50-2295991aa7f1	bed6bf7a-bfbb-4eac-b6d7-35ca3e7d6660	c3542c4f-23e1-4df8-bcab-3b5aace21c7b	5	Excellent service! Will definitely hire again.	2025-08-05 00:08:56.412118+00
5a9fc1de-455d-4686-823d-cdbecef902e3	5d5c6454-6302-4a57-ad51-cdd0e6444f15	549f87d2-961e-48f8-bcff-7286d7db879e	c3542c4f-23e1-4df8-bcab-3b5aace21c7b	3	Good service overall. Met expectations.	2025-10-07 12:33:04.648918+00
21cb58ab-8d81-479e-8865-b7e9ac7aae31	3f0f0034-b121-4c3c-b597-8b2cf5bc4c85	a8957421-6c24-4110-ad8a-89513c6cfe93	c3542c4f-23e1-4df8-bcab-3b5aace21c7b	4	Good work done on time. Would recommend.	2025-04-01 03:09:59.829718+00
7bf11519-7ff7-48d6-8c4b-8f34ae2e9b2e	ec4144a5-c1cb-46c8-8b24-bd5a4d0ef9b9	ded07a3d-2dc7-40f1-a9df-81b72c989abf	c3542c4f-23e1-4df8-bcab-3b5aace21c7b	5	Outstanding work! Highly professional and efficient.	2025-08-27 21:26:08.028118+00
2f1142f5-9c67-467c-a3db-d807af7df46d	8498e7be-6898-4a8a-a397-467a8c842bda	f97cfaac-5a4e-420a-a445-9776c13600b8	c3542c4f-23e1-4df8-bcab-3b5aace21c7b	3	Good service overall. Met expectations.	2025-12-14 08:08:28.648918+00
bd0220c1-d903-4791-9a0f-5d6200a0b9c9	91aad3ef-e036-444a-8a72-a2ee18c58ffd	2594b276-c01e-4543-b2b5-0cd20667b7a6	c3542c4f-23e1-4df8-bcab-3b5aace21c7b	4	Good work done on time. Would recommend.	2025-10-24 22:00:41.714518+00
a5cfd36c-f8c8-408b-bff5-9ef6734deb94	bba9b8d1-b7b2-4c0f-be50-febfd6da3602	216ebdf7-cd45-4b40-86f2-268b4e33bb68	c3542c4f-23e1-4df8-bcab-3b5aace21c7b	5	Perfect! Exceeded my expectations.	2025-05-22 06:47:21.218518+00
5ac95f2b-94cc-4df0-b888-5de91b564b40	754e6f01-d95a-40c5-894d-2bc4e8ed8c4c	f74860cc-f981-42b4-809d-11e92bedd14f	c3542c4f-23e1-4df8-bcab-3b5aace21c7b	3	Good service overall. Met expectations.	2025-10-06 22:09:59.512918+00
ddce51ce-34de-4a91-bb7c-3bf7fca38321	17820f69-8c54-42e6-8aa6-cef4e48e0f5d	d951675f-497c-4ccb-b55d-6a72f9cfb8fc	c3542c4f-23e1-4df8-bcab-3b5aace21c7b	4	Good work done on time. Would recommend.	2025-09-18 03:33:44.047318+00
4284e414-42fe-4959-9252-177c4c84c3b4	a5e92daf-1e36-4e2b-ab3c-819fff1d9e34	dd3b46e4-576f-488e-928f-a5a2688e0fd4	c3542c4f-23e1-4df8-bcab-3b5aace21c7b	5	Very satisfied with the quality of work. Highly recommended!	2025-06-28 03:04:05.244118+00
395701ff-578e-440a-828a-d17ea6a40d8a	947949fd-840b-4fba-b752-9612aa586369	f97cfaac-5a4e-420a-a445-9776c13600b8	2fafc06b-a809-4acc-b9ce-ea53779d48d4	3	Good service overall. Met expectations.	2025-06-13 00:36:12.914518+00
e1edaea6-4a40-42be-9d92-11d172603c0c	1599dadc-f3f2-4767-a5f1-1791a10d7e84	2594b276-c01e-4543-b2b5-0cd20667b7a6	2fafc06b-a809-4acc-b9ce-ea53779d48d4	4	Good work done on time. Would recommend.	2025-08-23 05:57:03.266518+00
ec3ccd2e-26e8-409a-bda3-304f0b2a7b0b	8c994052-1ebd-4be6-a31b-cca1ee08a53a	216ebdf7-cd45-4b40-86f2-268b4e33bb68	2fafc06b-a809-4acc-b9ce-ea53779d48d4	5	Perfect! Exceeded my expectations.	2025-08-18 16:36:11.992918+00
c41cd91b-b98a-4e82-9d02-c5d514dbb52d	5a3bebb1-1d17-4f86-bc5f-dc0e76d2d403	f74860cc-f981-42b4-809d-11e92bedd14f	2fafc06b-a809-4acc-b9ce-ea53779d48d4	3	Good service overall. Met expectations.	2025-11-06 09:59:32.680918+00
ee9a07ac-a637-4976-919e-7bba9dab16a0	d353d7f6-5b1c-4b91-83f6-264c5ae683c5	d951675f-497c-4ccb-b55d-6a72f9cfb8fc	2fafc06b-a809-4acc-b9ce-ea53779d48d4	4	Good work done on time. Would recommend.	2025-07-19 20:34:54.520918+00
af3ac2fb-b735-483d-9b08-87e1f1dcd673	c1c7c386-5273-4da3-a363-263103284bbc	dd3b46e4-576f-488e-928f-a5a2688e0fd4	2fafc06b-a809-4acc-b9ce-ea53779d48d4	5	Very satisfied with the quality of work. Highly recommended!	2025-07-08 06:57:19.365718+00
06e51694-5c1a-4b8e-a1b8-80cf8fe7f1c1	c47f2b6c-b34c-4769-a86e-f061b0b55e8b	7d6e1a27-d7f8-445f-a544-81c817a39304	2fafc06b-a809-4acc-b9ce-ea53779d48d4	3	Good service overall. Met expectations.	2025-11-18 17:27:13.663318+00
247ccb0d-8093-441c-9622-e90efa7734fd	e48f7737-7b4f-4ae0-af07-47a841925bcc	088c7759-5ee8-4fd2-99fa-6d6953d6e99c	2fafc06b-a809-4acc-b9ce-ea53779d48d4	4	Good work done on time. Would recommend.	2025-03-28 11:25:34.476118+00
fbb167c6-5e71-4cda-be7a-fd4ca2de49ba	a87da33e-1f70-4b36-8a03-9f5715dca350	ce930397-85a0-4a2c-9d12-343341780701	2fafc06b-a809-4acc-b9ce-ea53779d48d4	5	Excellent service! Will definitely hire again.	2025-11-01 03:55:06.050518+00
a08b5692-d433-45d2-b030-60472c0b8599	3c170e99-b7fb-4a1c-a3e7-c5047f5b4245	2637c6dd-5fbe-487c-85c5-3ef87dc74cf5	2fafc06b-a809-4acc-b9ce-ea53779d48d4	3	Good service overall. Met expectations.	2025-12-13 02:25:05.186518+00
eb182a56-835e-4df6-97d2-95ff121962c8	ec117555-f1c6-47d6-bb11-d37c1beeb4d5	088c7759-5ee8-4fd2-99fa-6d6953d6e99c	81610da5-f9ae-444a-953d-05db70defdf5	4	Good work done on time. Would recommend.	2025-08-19 15:29:46.965718+00
f34d2993-26ee-4dd3-9d73-cdd1a765ae7a	88cdb1bf-9e19-4ae5-9418-79cad8b810bc	ce930397-85a0-4a2c-9d12-343341780701	81610da5-f9ae-444a-953d-05db70defdf5	5	Excellent service! Will definitely hire again.	2025-03-22 16:21:14.037718+00
d3723243-da62-4e89-bbb1-4e8ef96f3604	79a87627-0fe3-4895-9f57-77133d920515	2637c6dd-5fbe-487c-85c5-3ef87dc74cf5	81610da5-f9ae-444a-953d-05db70defdf5	3	Good service overall. Met expectations.	2025-05-31 23:00:19.365718+00
8e5ef94f-e71b-4315-b52b-11fc52b1f650	6c4802d8-5091-4ce7-a0f6-308ec3cfcf24	d4d09b07-6022-4d29-8d83-2905a67c2fb0	81610da5-f9ae-444a-953d-05db70defdf5	4	Good work done on time. Would recommend.	2025-04-24 11:51:54.300118+00
22d22e19-059e-444e-8016-d9b7b66236df	c14f6b2d-614f-4c3b-817c-b8c2b37b0ded	9c0e3b56-4094-4a57-b207-abb436a8fe3d	81610da5-f9ae-444a-953d-05db70defdf5	5	Outstanding work! Highly professional and efficient.	2025-12-09 02:03:25.039318+00
72017a86-b49f-4882-977f-f6852546f76a	ec34e7f8-767a-4b38-8107-9d2def9fed11	6e0bbfe1-f2fd-4356-8684-bc8d8fb15a28	81610da5-f9ae-444a-953d-05db70defdf5	3	Good service overall. Met expectations.	2025-08-01 02:01:33.756118+00
77a0b1da-3369-4b99-a699-5158d8cb22c0	6e93f447-529c-4017-afc7-cdf97daaa00f	2f6a0b4d-ff98-443f-a347-bc1c2e867bf5	81610da5-f9ae-444a-953d-05db70defdf5	4	Good work done on time. Would recommend.	2025-09-10 04:57:44.450518+00
2b6a5ed8-8bc4-4816-877f-41a7feebc643	2b9eee0c-0f0f-47a5-b152-780fb828e5a5	c02b1823-7eec-4776-812e-b2a42402a542	43fc2e10-b7f4-497d-8e3e-3cc3504b607d	5	Perfect! Exceeded my expectations.	2025-11-07 07:17:52.898518+00
54f65acb-4aec-41cc-93b5-49c291b5d8d7	a22e9fa5-1bc5-47d7-be4b-41f2c2af22e5	8568204d-bac8-4bd2-be49-666099493157	43fc2e10-b7f4-497d-8e3e-3cc3504b607d	3	Good service overall. Met expectations.	2025-05-09 02:34:36.722518+00
67400091-607d-4023-93dc-937c518257df	2c717bdd-bd6b-4702-b0ac-c1d29b29ddca	3505bad0-2d27-427b-ae95-3169a5838fbf	43fc2e10-b7f4-497d-8e3e-3cc3504b607d	4	Good work done on time. Would recommend.	2025-10-29 14:38:34.322518+00
2ad0fa29-7927-4266-b8e9-219a5279b81d	3e780152-1356-401d-8c43-4d06b59aa7fe	5be0cd9f-a466-4485-ac43-bdc4b104ecc0	43fc2e10-b7f4-497d-8e3e-3cc3504b607d	5	Very satisfied with the quality of work. Highly recommended!	2025-04-11 06:27:19.394518+00
8b0768f1-05c7-44ce-8d99-8514f4965078	153371a4-8ca3-4aeb-8b20-f72e04241d38	6fc15c3f-2c63-4a80-b499-3744ac6c5e0a	78a4aadd-b865-4eb6-80a7-48519d0e2ba2	4	Good work done on time. Would recommend.	2025-05-04 01:29:24.703318+00
1587b7eb-c3c1-4fe5-87e8-bd44090ec6fc	27671c50-5f7c-45ab-92f9-67b7922475c0	97c5f2cc-ef11-452a-9aa3-b4705f3280f8	78a4aadd-b865-4eb6-80a7-48519d0e2ba2	5	Outstanding work! Highly professional and efficient.	2025-04-27 13:55:03.919318+00
e0261de6-a0c5-453f-9021-3ec7edd50ce9	adea4021-6fd1-4117-bd40-656ced5ad4f1	1be14a91-1b2c-48d6-8465-d1d4d12a785c	78a4aadd-b865-4eb6-80a7-48519d0e2ba2	3	Good service overall. Met expectations.	2025-04-11 17:10:46.456918+00
6c96b14f-2e2b-43d5-b32a-1d111b4f9e47	68e96836-6c0c-4a82-9e15-975d70fb8f0d	4cfa17c8-4d9f-4283-97f2-3a4976248b91	78a4aadd-b865-4eb6-80a7-48519d0e2ba2	4	Good work done on time. Would recommend.	2025-04-10 16:37:07.980118+00
23f9a9fb-fc41-4a85-99d4-4657592e6388	604ca8b7-0d68-4047-9e83-953fb40b0037	57dfd528-5470-40a1-8fde-40eb61dd7ae1	78a4aadd-b865-4eb6-80a7-48519d0e2ba2	5	Perfect! Exceeded my expectations.	2025-12-04 12:11:56.210518+00
019e5f6d-588b-4163-ad09-0b1696b0beb0	a418a7e0-4b56-44fc-b7cb-217f0e945059	3cc9e6b9-d7d7-4d91-904b-65aeb230b14b	78a4aadd-b865-4eb6-80a7-48519d0e2ba2	3	Good service overall. Met expectations.	2025-11-14 05:32:27.813718+00
fba83a8a-e4a9-4e21-a46f-1b22ed4b6461	c0bb548f-e330-41f6-a7f3-b2ffa82e451f	ff8bb61b-1117-4f5c-880b-ac4ebd7ea6c2	78a4aadd-b865-4eb6-80a7-48519d0e2ba2	4	Good work done on time. Would recommend.	2025-12-09 01:29:15.026518+00
c138eda8-ffdd-47a6-89b9-efae8e0eab82	a257ed11-0d7f-4944-bfb1-8d4d9f1d13fc	feaac7e1-3bc3-4462-b2f8-b4a19f990531	78a4aadd-b865-4eb6-80a7-48519d0e2ba2	5	Very satisfied with the quality of work. Highly recommended!	2025-07-03 04:58:33.784918+00
e4748a76-6e96-4ede-9580-3eb7f0d6339c	a8bdeb5e-755d-4e25-b400-0fd93701a514	8d3c4c94-5ab8-4070-a7cc-a12e88219bf3	78a4aadd-b865-4eb6-80a7-48519d0e2ba2	3	Good service overall. Met expectations.	2025-11-11 21:04:11.551318+00
cd9a0180-43ed-4fab-8647-9f6b95ae4c35	a710689e-c65f-4e34-87e1-89f688af516a	158e9458-44c9-4638-83b9-bf0c99bdb64a	78a4aadd-b865-4eb6-80a7-48519d0e2ba2	4	Good work done on time. Would recommend.	2025-03-29 07:53:33.372118+00
73d0975c-d09c-4df2-900e-d6e4286e221e	c88f5280-9fc8-4e04-a757-56421b7c29e4	ff8bb61b-1117-4f5c-880b-ac4ebd7ea6c2	41ecd97e-ef9c-4a81-8261-126c4d90cdc4	4	Good work done on time. Would recommend.	2025-07-28 09:04:04.639318+00
4e30537b-1a0e-43c5-a5a7-adb299beac7a	2953a530-8952-4526-b02e-6f27026490bc	feaac7e1-3bc3-4462-b2f8-b4a19f990531	41ecd97e-ef9c-4a81-8261-126c4d90cdc4	5	Very satisfied with the quality of work. Highly recommended!	2025-09-10 07:54:00.674518+00
f618d01c-9e1b-4ddc-83d3-810ec5c0682d	9c24a144-5d32-45b7-b444-49a09cbe4831	8d3c4c94-5ab8-4070-a7cc-a12e88219bf3	41ecd97e-ef9c-4a81-8261-126c4d90cdc4	3	Good service overall. Met expectations.	2025-08-09 23:13:21.544918+00
876c5cba-a4ac-40e5-a80e-e39415cd360a	e13c80f3-c5ad-4b8b-9f8c-7781ff1a0146	158e9458-44c9-4638-83b9-bf0c99bdb64a	41ecd97e-ef9c-4a81-8261-126c4d90cdc4	4	Good work done on time. Would recommend.	2025-04-27 17:07:38.018518+00
1ca81677-a5b6-4c6c-955f-65012eb582ba	5ff87450-1915-49ec-86aa-2d4812687204	503f2221-11c2-4415-9a5b-9b0e81e95b67	41ecd97e-ef9c-4a81-8261-126c4d90cdc4	5	Excellent service! Will definitely hire again.	2025-06-30 04:33:06.664918+00
46c2fc4f-0225-4bad-9cae-d033dad5ea8c	1268d818-645c-487f-a4b9-b87364c39b69	5eae5e90-1914-41e5-be8a-aef4314d4892	41ecd97e-ef9c-4a81-8261-126c4d90cdc4	3	Good service overall. Met expectations.	2025-09-07 13:01:50.402518+00
67dcf3fd-577c-49e2-ac7f-2cd53a4d2c28	fd6c8b0e-a632-401d-ac0f-6529bfd36395	4893cb6b-0ffd-422a-b940-7b9201daa34f	41ecd97e-ef9c-4a81-8261-126c4d90cdc4	4	Good work done on time. Would recommend.	2025-11-09 06:40:12.328918+00
df44133d-ed27-4af7-be6e-2ed84bd5c389	fbc0fb95-6e41-4469-a25f-933baf023b06	218a9cdd-7d3a-44c9-bd7a-d885d38d6063	41ecd97e-ef9c-4a81-8261-126c4d90cdc4	5	Outstanding work! Highly professional and efficient.	2025-07-05 03:03:59.541718+00
65fb01c7-6b78-4f89-9253-510d552895c3	27742430-f901-4fe7-86b9-cf2860c0ad50	218a9cdd-7d3a-44c9-bd7a-d885d38d6063	7624d68c-87c9-454d-8a81-b9e04a9835d5	5	Outstanding work! Highly professional and efficient.	2025-11-08 17:04:16.792918+00
54c0dfdd-c6b8-46c1-87e6-07c27cc74be5	ef853b1f-eb2b-4f7a-9f95-1e18be8634d8	4eea189c-607a-466d-8f92-1f53d790fb6f	7624d68c-87c9-454d-8a81-b9e04a9835d5	3	Good service overall. Met expectations.	2025-04-20 08:17:51.112918+00
c8edfcec-ea8f-4b15-be8e-0888f7f6259f	f3dc8c67-805d-4963-a52b-aa942a18edb8	5c74fdb2-b4d9-4f4b-9c6c-f6b72854db84	7624d68c-87c9-454d-8a81-b9e04a9835d5	4	Good work done on time. Would recommend.	2025-09-18 21:59:12.895318+00
3c854558-5131-497b-b469-7945e7c47f3d	edd5275f-a2c2-467f-9df2-064a56601e09	9e61d17b-97a4-45e7-a26c-4fdc3086cdb7	7624d68c-87c9-454d-8a81-b9e04a9835d5	5	Perfect! Exceeded my expectations.	2025-10-02 10:29:21.247318+00
fd2c354b-0b9f-49f0-a2da-bbc0a77757f4	a9e8910b-8c94-4961-bcb5-448fadc35859	6302ea1c-5af4-4302-918a-c87152175bae	7624d68c-87c9-454d-8a81-b9e04a9835d5	3	Good service overall. Met expectations.	2025-06-22 10:34:39.458518+00
e0e2c611-b8b7-4ffd-863d-78ace83e66f6	07782c0b-701a-45f2-9eaa-39b54673c238	3c6ff2a2-e59e-48af-8a8e-9238dc49ecc6	8dfa85c7-8db4-4f2e-ae73-1cdbce4cf8d8	4	Good work done on time. Would recommend.	2025-09-23 19:26:50.911318+00
935cf403-4347-43e2-87e1-19e16f084841	7b8ae44f-357c-40c5-82e3-5f5bfb0f869e	496d267d-f0aa-4592-a87a-bd69e1196f23	8dfa85c7-8db4-4f2e-ae73-1cdbce4cf8d8	5	Excellent service! Will definitely hire again.	2025-04-07 03:52:35.628118+00
3af258ef-7faa-4e57-9192-f434efee0ad2	fd05ab62-2526-45a2-9044-d119f93c6b81	5c328f75-464c-4053-a41e-00fbc6eba934	8dfa85c7-8db4-4f2e-ae73-1cdbce4cf8d8	3	Good service overall. Met expectations.	2025-10-25 17:21:38.344918+00
85426964-37d3-4a42-86e6-43f3f9dbc825	14f9cc03-3a74-417e-8dae-3e9fb800b18b	bed6bf7a-bfbb-4eac-b6d7-35ca3e7d6660	8dfa85c7-8db4-4f2e-ae73-1cdbce4cf8d8	4	Good work done on time. Would recommend.	2025-12-03 13:29:50.968918+00
9bac300b-72ea-440b-a30e-f109bf0791f4	f9d1a872-e832-4958-a37e-a82d81fb0065	549f87d2-961e-48f8-bcff-7286d7db879e	8dfa85c7-8db4-4f2e-ae73-1cdbce4cf8d8	5	Outstanding work! Highly professional and efficient.	2025-05-23 04:56:05.436118+00
23df4bc7-707b-45b5-846b-7ea1970a7223	7b8f23b5-64bb-4ffb-ab45-3bdf210c9a2a	a8957421-6c24-4110-ad8a-89513c6cfe93	8dfa85c7-8db4-4f2e-ae73-1cdbce4cf8d8	3	Good service overall. Met expectations.	2025-05-19 21:37:39.055318+00
8ace32b4-13e1-4fb3-9764-66d3c9b0da32	c98b3a1d-a119-49bc-8b7a-644676886953	ded07a3d-2dc7-40f1-a9df-81b72c989abf	8dfa85c7-8db4-4f2e-ae73-1cdbce4cf8d8	4	Good work done on time. Would recommend.	2025-08-15 04:50:25.452118+00
0d082618-0707-4446-a38a-99664bd67a28	0eac34e6-f4bf-4c06-81c1-7927d35c7ecf	f97cfaac-5a4e-420a-a445-9776c13600b8	8dfa85c7-8db4-4f2e-ae73-1cdbce4cf8d8	5	Perfect! Exceeded my expectations.	2025-04-04 18:37:27.304918+00
52cd7bbf-011f-407e-b44f-ace4613c9a6b	8f0143f6-27dd-46c3-93b3-c50ac74ef729	2594b276-c01e-4543-b2b5-0cd20667b7a6	8dfa85c7-8db4-4f2e-ae73-1cdbce4cf8d8	3	Good service overall. Met expectations.	2025-05-01 10:17:20.671318+00
9bface45-0ba9-4ae9-9a6e-696b31d4e3dd	d8b859b1-96b1-4982-8b0b-a129218418fa	216ebdf7-cd45-4b40-86f2-268b4e33bb68	8dfa85c7-8db4-4f2e-ae73-1cdbce4cf8d8	4	Good work done on time. Would recommend.	2025-06-10 10:01:42.712918+00
2ac9c11f-81d5-4b45-9c53-cf77f0d0433d	208e990f-452b-4e69-aa04-b393a8bd6fe0	f74860cc-f981-42b4-809d-11e92bedd14f	8dfa85c7-8db4-4f2e-ae73-1cdbce4cf8d8	5	Very satisfied with the quality of work. Highly recommended!	2025-11-27 19:33:38.287318+00
514eaef5-daee-435a-b2a7-f6cd6eb478a4	d86b73e1-85d0-44e5-9e79-ea46fb665e8e	ded07a3d-2dc7-40f1-a9df-81b72c989abf	66916789-7b07-40f9-9df7-57c432205d9e	4	Good work done on time. Would recommend.	2025-07-23 00:43:11.781718+00
1065812a-f0e4-483d-98c3-497ad2be2c88	83d53f39-d0d6-4e94-8046-98891ce99bb3	f97cfaac-5a4e-420a-a445-9776c13600b8	66916789-7b07-40f9-9df7-57c432205d9e	5	Perfect! Exceeded my expectations.	2025-04-25 05:53:06.357718+00
d343d5ee-2ae1-41ff-962f-f8688702db28	8d399b70-df13-453b-97bc-d3c2a108045a	2594b276-c01e-4543-b2b5-0cd20667b7a6	66916789-7b07-40f9-9df7-57c432205d9e	3	Good service overall. Met expectations.	2025-11-17 13:24:28.005718+00
40400d92-f183-4258-aaf0-5d6cd4243e2f	963cb210-ca20-418c-a54c-81606f698daa	216ebdf7-cd45-4b40-86f2-268b4e33bb68	66916789-7b07-40f9-9df7-57c432205d9e	4	Good work done on time. Would recommend.	2025-04-03 14:19:47.234518+00
4600ed6f-a7a7-44df-b241-2b88e2dcc579	9e11d301-a530-4cd9-9e5e-3430320e69a8	f74860cc-f981-42b4-809d-11e92bedd14f	66916789-7b07-40f9-9df7-57c432205d9e	5	Very satisfied with the quality of work. Highly recommended!	2025-04-04 13:14:56.815318+00
8277bd78-6436-4e9f-bbe0-00ee0f4c4834	3a55ea19-b24a-4985-97ba-b20360fda613	d951675f-497c-4ccb-b55d-6a72f9cfb8fc	66916789-7b07-40f9-9df7-57c432205d9e	3	Good service overall. Met expectations.	2025-04-10 01:57:00.213718+00
511ff0f7-e863-4147-8f2b-a6cded108e3f	6eb16840-cc46-416e-bf69-925496c57257	dd3b46e4-576f-488e-928f-a5a2688e0fd4	66916789-7b07-40f9-9df7-57c432205d9e	4	Good work done on time. Would recommend.	2025-09-23 18:59:50.738518+00
3a17cdba-8fad-441e-a06c-310357033249	fef7163a-c112-4ca9-b2cd-7d49d82ff907	7d6e1a27-d7f8-445f-a544-81c817a39304	66916789-7b07-40f9-9df7-57c432205d9e	5	Excellent service! Will definitely hire again.	2025-11-26 10:11:44.316118+00
4cfd12c2-a09c-4c55-a46d-f0033e7990b5	24c87190-58b3-4dd2-982d-a7ea325c5c5e	088c7759-5ee8-4fd2-99fa-6d6953d6e99c	66916789-7b07-40f9-9df7-57c432205d9e	3	Good service overall. Met expectations.	2025-12-15 17:36:24.463318+00
29d0ea20-b799-48c5-a578-7c710d35dbd7	c2216e7f-88c5-4fb4-aa4d-65c9eb658ec0	7d6e1a27-d7f8-445f-a544-81c817a39304	68824670-6c5d-4812-8fee-2070bcdbc90c	5	Excellent service! Will definitely hire again.	2025-05-12 21:23:07.452118+00
65f19c07-93ab-4a02-a349-c5a0026bb753	8c6476ee-3730-44b2-81ee-d9b1f6f75f56	088c7759-5ee8-4fd2-99fa-6d6953d6e99c	68824670-6c5d-4812-8fee-2070bcdbc90c	3	Good service overall. Met expectations.	2025-03-25 03:27:49.116118+00
0e76cfa9-316c-4a3b-ab74-3de35743979f	7c23aebe-6401-4452-9d4a-a78e7ddaffb4	ce930397-85a0-4a2c-9d12-343341780701	68824670-6c5d-4812-8fee-2070bcdbc90c	4	Good work done on time. Would recommend.	2025-04-04 21:55:31.884118+00
22959114-a438-45ab-bea3-cf842ca8aecb	3a6ce68f-550a-484c-819d-5ed2292ef397	2637c6dd-5fbe-487c-85c5-3ef87dc74cf5	68824670-6c5d-4812-8fee-2070bcdbc90c	5	Outstanding work! Highly professional and efficient.	2025-03-23 12:40:33.064918+00
3741b401-dc89-4fb1-a0f9-fa93d24fed7f	9a59dbdb-d69e-45de-8999-bcf4e13d01ab	d4d09b07-6022-4d29-8d83-2905a67c2fb0	68824670-6c5d-4812-8fee-2070bcdbc90c	3	Good service overall. Met expectations.	2025-04-09 19:49:02.508118+00
858108c5-e762-4612-a101-7f4100f35be3	d7997d68-63ba-4fcb-9575-1d1725152fb7	9c0e3b56-4094-4a57-b207-abb436a8fe3d	68824670-6c5d-4812-8fee-2070bcdbc90c	4	Good work done on time. Would recommend.	2025-12-11 00:39:02.776918+00
7f358253-6dff-439e-84fc-5ec77b4156d0	830fb634-f7c4-4074-a790-a09529275c4c	2f6a0b4d-ff98-443f-a347-bc1c2e867bf5	29fa14c5-4010-4b58-bfd0-8740da9910b6	3	Good service overall. Met expectations.	2025-05-27 13:18:08.277718+00
4920a37d-dd05-4b0e-b99e-b0ac7215ab44	80e30158-2c39-4c9a-a771-908efa7b83b0	c02b1823-7eec-4776-812e-b2a42402a542	29fa14c5-4010-4b58-bfd0-8740da9910b6	4	Good work done on time. Would recommend.	2025-06-18 02:28:21.660118+00
73864370-b9af-444f-9b2d-9fd5b0328d42	eb2220fa-ca20-4b50-88c1-bc24bd5cfd0e	8568204d-bac8-4bd2-be49-666099493157	29fa14c5-4010-4b58-bfd0-8740da9910b6	5	Very satisfied with the quality of work. Highly recommended!	2025-04-11 22:54:58.562518+00
01e5655a-e6c0-4569-b6af-0a8216a2f386	9cd532db-5657-4a91-a774-cb8c7537d607	3505bad0-2d27-427b-ae95-3169a5838fbf	29fa14c5-4010-4b58-bfd0-8740da9910b6	3	Good service overall. Met expectations.	2025-10-18 07:52:00.664918+00
e198eaae-4840-4e62-9b2c-5f8aa87a3c86	0fecac51-339b-4648-997e-f41e65ed9e32	5be0cd9f-a466-4485-ac43-bdc4b104ecc0	29fa14c5-4010-4b58-bfd0-8740da9910b6	4	Good work done on time. Would recommend.	2025-04-17 06:31:24.770518+00
de4e5992-36d5-4b30-a7c9-64d3d5a1fff0	b782438c-3ca2-42f6-9598-7e496e2ef9fb	ee82e0a0-0f37-4a6f-ae93-2113eddeb55c	29fa14c5-4010-4b58-bfd0-8740da9910b6	5	Excellent service! Will definitely hire again.	2025-09-09 21:25:38.306518+00
bfa82b8e-9a4e-4dc1-9afb-36bae433b898	ffd51e17-db75-49b2-8a69-668e7a41df85	40ec397a-f1cf-4855-8a3a-c5673fb20e05	29fa14c5-4010-4b58-bfd0-8740da9910b6	3	Good service overall. Met expectations.	2025-10-09 07:36:56.834518+00
50be8950-1e95-4fc5-b169-5cc910be3014	a42954fd-3924-4764-a90a-7de19fcc4f0b	0897825a-ab99-41e9-98ba-b4ed822155a5	29fa14c5-4010-4b58-bfd0-8740da9910b6	4	Good work done on time. Would recommend.	2025-08-31 15:48:43.298518+00
0a072da3-59f8-49d1-b38d-ad990a62f692	95c32d8b-7311-4ebc-abeb-beb35bd58048	b19b93f9-ccf5-4b17-bdcf-a105d11018af	29fa14c5-4010-4b58-bfd0-8740da9910b6	5	Outstanding work! Highly professional and efficient.	2025-04-17 10:03:14.469718+00
83002b98-21aa-4af6-8c96-1f6262ecb29d	b26a965b-6ff8-492e-b2d6-589765812e9f	6fc15c3f-2c63-4a80-b499-3744ac6c5e0a	29fa14c5-4010-4b58-bfd0-8740da9910b6	3	Good service overall. Met expectations.	2025-10-08 04:45:39.122518+00
70a7b61c-7fee-44f5-ae95-f8f018a26aa3	ef509ba3-2fa8-4e3d-82bb-1a0139f0e889	97c5f2cc-ef11-452a-9aa3-b4705f3280f8	29fa14c5-4010-4b58-bfd0-8740da9910b6	4	Good work done on time. Would recommend.	2025-04-06 23:22:06.511318+00
2e6f6734-cd6a-471f-9d19-16dd53807b72	c50991bb-7fc8-4567-a22b-adb32f3aa2a0	1be14a91-1b2c-48d6-8465-d1d4d12a785c	29fa14c5-4010-4b58-bfd0-8740da9910b6	5	Perfect! Exceeded my expectations.	2025-05-07 07:25:44.037718+00
b5329432-c205-4d54-a409-2c0d77589be6	4f2ea6f5-6bfb-4101-871e-67a3dc1b1b82	4cfa17c8-4d9f-4283-97f2-3a4976248b91	29fa14c5-4010-4b58-bfd0-8740da9910b6	3	Good service overall. Met expectations.	2025-09-16 07:27:30.568918+00
59ddeda3-60fb-4890-b371-288ce58e79f7	72f76ce1-75bf-4c82-97f0-f15eb02dde56	0897825a-ab99-41e9-98ba-b4ed822155a5	60e71417-59da-467f-9aa2-ee6d86187a69	4	Good work done on time. Would recommend.	2025-07-15 01:33:12.885718+00
f2dde5a6-48a7-4599-ae3d-a16157b6c84a	ca38bb6d-30c5-458a-8f06-9b3e2805900b	b19b93f9-ccf5-4b17-bdcf-a105d11018af	60e71417-59da-467f-9aa2-ee6d86187a69	5	Outstanding work! Highly professional and efficient.	2025-10-31 00:57:24.549718+00
90a6f4bf-9cbf-44a1-846c-aa101d595c69	9f769ee3-2e16-48dc-b532-f3376bb984b1	6fc15c3f-2c63-4a80-b499-3744ac6c5e0a	60e71417-59da-467f-9aa2-ee6d86187a69	3	Good service overall. Met expectations.	2025-07-05 11:50:30.492118+00
603f17ce-e9b7-4034-b55f-e036e083e79a	bf39278f-def0-44a5-afed-62cb2479a8f8	97c5f2cc-ef11-452a-9aa3-b4705f3280f8	60e71417-59da-467f-9aa2-ee6d86187a69	4	Good work done on time. Would recommend.	2025-07-03 08:34:54.261718+00
ce4f425a-cdf9-49d0-b23c-b27e38745faf	a83b6d21-a145-4e49-89ce-0983c50f0807	1be14a91-1b2c-48d6-8465-d1d4d12a785c	60e71417-59da-467f-9aa2-ee6d86187a69	5	Perfect! Exceeded my expectations.	2025-12-06 11:03:28.754518+00
40402d79-892d-4b1d-9183-07b184c7b3d5	6429f6e6-eebc-4f8a-b72b-96dcefbb82fc	4cfa17c8-4d9f-4283-97f2-3a4976248b91	60e71417-59da-467f-9aa2-ee6d86187a69	3	Good service overall. Met expectations.	2025-12-11 01:13:23.848918+00
d736e616-92bc-436d-abba-8355b89349df	96ea2814-1c04-4815-aa68-04552fc7d9e0	57dfd528-5470-40a1-8fde-40eb61dd7ae1	60e71417-59da-467f-9aa2-ee6d86187a69	4	Good work done on time. Would recommend.	2025-08-08 05:19:39.544918+00
2b565baa-3f4c-4feb-a659-0685def7727c	8a2f5058-369a-49f6-99f1-547efdc1651b	3cc9e6b9-d7d7-4d91-904b-65aeb230b14b	60e71417-59da-467f-9aa2-ee6d86187a69	5	Very satisfied with the quality of work. Highly recommended!	2025-09-01 04:05:58.370518+00
03a8c57c-306c-42ec-bf8a-7f611b9d3655	76097a5f-3619-406b-8654-0bc45d8c7e96	ff8bb61b-1117-4f5c-880b-ac4ebd7ea6c2	60e71417-59da-467f-9aa2-ee6d86187a69	3	Good service overall. Met expectations.	2025-10-12 18:58:06.194518+00
22ad1060-33e8-4596-892b-a7c126dac750	1bda6bb0-1556-43c6-a218-a718bba5e5b7	feaac7e1-3bc3-4462-b2f8-b4a19f990531	60e71417-59da-467f-9aa2-ee6d86187a69	4	Good work done on time. Would recommend.	2025-11-02 18:37:32.748118+00
2040cc88-1d16-4844-9c01-fda85b41d923	75061fe7-756e-4220-8ba9-91553296d6c6	3cc9e6b9-d7d7-4d91-904b-65aeb230b14b	b77c81a6-a8a9-42e0-acc8-ce1ce2d92bf7	5	Very satisfied with the quality of work. Highly recommended!	2025-06-12 21:13:31.164118+00
20064aaa-ae00-4f63-8b42-0d3c0e1c4388	4071ec24-6812-42c4-8952-0820551f1b45	ff8bb61b-1117-4f5c-880b-ac4ebd7ea6c2	b77c81a6-a8a9-42e0-acc8-ce1ce2d92bf7	3	Good service overall. Met expectations.	2025-06-08 07:22:23.848918+00
51a948c3-07f6-4090-9d92-6f118e374365	a9bea133-1f6b-415e-ab29-7efea7fc87af	feaac7e1-3bc3-4462-b2f8-b4a19f990531	b77c81a6-a8a9-42e0-acc8-ce1ce2d92bf7	4	Good work done on time. Would recommend.	2025-10-29 11:04:48.069718+00
ced51a1f-71c0-4f0e-859d-26610423e214	a36a3306-5270-4af0-a10f-250b55a58065	8d3c4c94-5ab8-4070-a7cc-a12e88219bf3	b77c81a6-a8a9-42e0-acc8-ce1ce2d92bf7	5	Excellent service! Will definitely hire again.	2025-08-09 05:13:03.573718+00
e6405ec9-3745-4b66-be26-e5ba70109ff5	ee899c13-713c-4961-813a-b4996817c9d8	158e9458-44c9-4638-83b9-bf0c99bdb64a	b77c81a6-a8a9-42e0-acc8-ce1ce2d92bf7	3	Good service overall. Met expectations.	2025-10-17 23:36:04.936918+00
7f4d55be-cc26-48b2-b67e-7e97a1bd7859	855ba14c-c2d3-49ed-9b04-7680deffda73	503f2221-11c2-4415-9a5b-9b0e81e95b67	b77c81a6-a8a9-42e0-acc8-ce1ce2d92bf7	4	Good work done on time. Would recommend.	2025-09-12 21:45:27.343318+00
9a9db635-75c4-4c70-a2bb-65ae0202d330	793dcfb2-dde5-49be-b102-71b1c276d376	5eae5e90-1914-41e5-be8a-aef4314d4892	b77c81a6-a8a9-42e0-acc8-ce1ce2d92bf7	5	Outstanding work! Highly professional and efficient.	2025-04-14 19:42:45.890518+00
e176f134-920b-4b09-9472-e85bd1f3b445	ee1170f6-dee1-49f0-aaf7-6f01ee52361e	4893cb6b-0ffd-422a-b940-7b9201daa34f	8dfa3373-45d8-448e-a3b5-4d1dfec4ba2f	3	Good service overall. Met expectations.	2025-07-24 10:29:58.744918+00
4737bd94-b7c7-49fc-930b-009dc72b3910	47ce87fa-feca-436d-9865-829b960cdfa1	218a9cdd-7d3a-44c9-bd7a-d885d38d6063	8dfa3373-45d8-448e-a3b5-4d1dfec4ba2f	4	Good work done on time. Would recommend.	2025-07-08 19:03:02.892118+00
895f323f-386e-4146-9f31-f1451d592419	e2eecfbc-63e6-4021-931c-16296575e811	4eea189c-607a-466d-8f92-1f53d790fb6f	8dfa3373-45d8-448e-a3b5-4d1dfec4ba2f	5	Perfect! Exceeded my expectations.	2025-04-10 01:17:15.228118+00
ced9b3e1-1242-4221-9931-f1813a514517	d5870e35-8c96-4a3f-8ed4-081386ec54bb	5c74fdb2-b4d9-4f4b-9c6c-f6b72854db84	8dfa3373-45d8-448e-a3b5-4d1dfec4ba2f	3	Good service overall. Met expectations.	2025-09-03 15:12:35.608918+00
9d04b336-893d-45f7-9ee0-5151508cfb0f	afcc9389-8dfc-49c5-8f70-1bbc77ad12af	649a4947-627c-43f2-9c5e-b75f213a0d93	5f5145a0-1827-46fd-b44f-6b2a7170d6a9	5	Excellent service! Will definitely hire again.	2025-04-16 01:50:37.980118+00
a58bb344-cacd-4a2a-9fe5-52206c8586f5	dd1eedc6-a93d-43ce-89e6-0a4f3564caae	3c6ff2a2-e59e-48af-8a8e-9238dc49ecc6	5f5145a0-1827-46fd-b44f-6b2a7170d6a9	3	Good service overall. Met expectations.	2025-08-24 14:49:59.647318+00
faf76283-32d7-407e-a02d-f42db9e6f786	15779e7f-77d1-4357-9ba7-744e63507125	496d267d-f0aa-4592-a87a-bd69e1196f23	5f5145a0-1827-46fd-b44f-6b2a7170d6a9	4	Good work done on time. Would recommend.	2025-11-27 20:24:16.888918+00
42a175b7-081f-419d-875d-6a13cb379098	49b1bae4-c2c0-4f89-9da8-fa64cbcb7925	5c328f75-464c-4053-a41e-00fbc6eba934	5f5145a0-1827-46fd-b44f-6b2a7170d6a9	5	Outstanding work! Highly professional and efficient.	2025-06-27 21:52:20.767318+00
7c771053-299d-4d7d-89af-a806e2dd28b4	7f486f13-23fb-4264-9ff3-0aac1fae9f56	bed6bf7a-bfbb-4eac-b6d7-35ca3e7d6660	5f5145a0-1827-46fd-b44f-6b2a7170d6a9	3	Good service overall. Met expectations.	2025-11-17 19:18:43.269718+00
70bab345-a101-43ca-9d24-090f2a25075c	ad14c88c-7d59-48ea-a0ad-fcdab3ed9ecd	549f87d2-961e-48f8-bcff-7286d7db879e	5f5145a0-1827-46fd-b44f-6b2a7170d6a9	4	Good work done on time. Would recommend.	2025-09-15 22:34:32.028118+00
f09f18d3-a1ab-476f-ba92-a3a873b95da5	947d8ef7-25bc-4811-9e2c-479412e54853	a8957421-6c24-4110-ad8a-89513c6cfe93	5f5145a0-1827-46fd-b44f-6b2a7170d6a9	5	Perfect! Exceeded my expectations.	2025-05-17 09:42:44.824918+00
d93ae233-3b87-4db8-a2be-3b0587178717	e253c033-0f32-4be2-9de6-602d1fca213d	ded07a3d-2dc7-40f1-a9df-81b72c989abf	5f5145a0-1827-46fd-b44f-6b2a7170d6a9	3	Good service overall. Met expectations.	2025-04-21 14:58:46.687318+00
ade3262d-88cb-4f77-9518-994ec34416cf	dffd1467-924c-434b-8277-d98caf3d72db	f97cfaac-5a4e-420a-a445-9776c13600b8	5f5145a0-1827-46fd-b44f-6b2a7170d6a9	4	Good work done on time. Would recommend.	2025-05-31 05:21:44.565718+00
40e43c96-e18a-4d72-ba9a-9eddc7a2b618	cbadf3c7-04ee-4676-9642-f9b969d1ed2e	2594b276-c01e-4543-b2b5-0cd20667b7a6	5f5145a0-1827-46fd-b44f-6b2a7170d6a9	5	Very satisfied with the quality of work. Highly recommended!	2025-05-19 00:27:32.700118+00
5d65a4e0-e783-4edb-ae80-784b0d48149c	41e6ce07-ec85-4535-b2d9-22b065a28329	a8957421-6c24-4110-ad8a-89513c6cfe93	bf42a091-8815-4f72-bf8d-6f3bdb13e3c6	5	Perfect! Exceeded my expectations.	2025-07-29 15:19:24.972118+00
94fd4fa4-1531-4efd-808c-fd5a3864ec95	c431e91e-69c3-4c96-a315-11b8707eec3d	ded07a3d-2dc7-40f1-a9df-81b72c989abf	bf42a091-8815-4f72-bf8d-6f3bdb13e3c6	3	Good service overall. Met expectations.	2025-08-26 15:25:23.877718+00
ce6084e8-ae26-4640-be41-2bfbfc9d2d59	68551738-8aed-4917-a4f5-28bcf0106b42	f97cfaac-5a4e-420a-a445-9776c13600b8	bf42a091-8815-4f72-bf8d-6f3bdb13e3c6	4	Good work done on time. Would recommend.	2025-08-13 15:42:35.493718+00
981fd8de-144b-4f2a-994e-c135159db65a	c3780a77-9f46-40bf-8637-9bc3f2fa4089	2594b276-c01e-4543-b2b5-0cd20667b7a6	bf42a091-8815-4f72-bf8d-6f3bdb13e3c6	5	Very satisfied with the quality of work. Highly recommended!	2025-09-23 15:39:03.122518+00
39488793-6421-4dcb-8c49-0ecf435685eb	fce46d8e-42f1-435d-825d-d59a1a7b388f	216ebdf7-cd45-4b40-86f2-268b4e33bb68	bf42a091-8815-4f72-bf8d-6f3bdb13e3c6	3	Good service overall. Met expectations.	2025-07-25 09:02:32.623318+00
abb8560c-725c-4eb2-8102-64d0b302f413	9fb9ee5e-5778-476b-b663-0748b21b0b9f	f74860cc-f981-42b4-809d-11e92bedd14f	bf42a091-8815-4f72-bf8d-6f3bdb13e3c6	4	Good work done on time. Would recommend.	2025-09-13 04:51:11.848918+00
7064d808-374d-4945-b98a-929a77edcdd5	c30130ea-572f-445d-b5fb-c6d3ed7fc557	d951675f-497c-4ccb-b55d-6a72f9cfb8fc	bf42a091-8815-4f72-bf8d-6f3bdb13e3c6	5	Excellent service! Will definitely hire again.	2025-03-21 03:56:06.098518+00
926ef28e-3181-4de4-a58e-b2309aa3543e	cf9c1c4d-34a3-49d1-a66c-0f5561ee5b38	dd3b46e4-576f-488e-928f-a5a2688e0fd4	bf42a091-8815-4f72-bf8d-6f3bdb13e3c6	3	Good service overall. Met expectations.	2025-05-26 12:09:08.248918+00
999a7e70-c9e2-4585-b251-edbf1c4c9129	a743ccf5-31b5-4970-a3ed-8dcfa1056c4d	dd3b46e4-576f-488e-928f-a5a2688e0fd4	ad584595-9c2b-4d07-ad8c-59481f88ac28	3	Good service overall. Met expectations.	2025-10-18 04:06:02.776918+00
00c06faf-79b0-441f-88ad-1e40a5e95cf8	e401e28b-2d45-43e4-8537-38854ee0d446	7d6e1a27-d7f8-445f-a544-81c817a39304	ad584595-9c2b-4d07-ad8c-59481f88ac28	4	Good work done on time. Would recommend.	2025-12-05 06:30:22.735318+00
b5db26f6-51a6-452c-8a7b-318f694b2f02	9d130ca4-2776-4398-a538-c2f40ad8cec9	088c7759-5ee8-4fd2-99fa-6d6953d6e99c	ad584595-9c2b-4d07-ad8c-59481f88ac28	5	Outstanding work! Highly professional and efficient.	2025-05-25 09:30:59.714518+00
87e67c68-3451-4616-93d1-826750485554	3e02e876-e97a-458f-9d08-e02cdb9ed046	ce930397-85a0-4a2c-9d12-343341780701	ad584595-9c2b-4d07-ad8c-59481f88ac28	3	Good service overall. Met expectations.	2025-10-22 09:32:04.255318+00
c33221ff-4616-42bb-b66f-b8c7f395cd0e	2d167a4e-678d-46df-99d5-c82a60c366c6	2637c6dd-5fbe-487c-85c5-3ef87dc74cf5	ad584595-9c2b-4d07-ad8c-59481f88ac28	4	Good work done on time. Would recommend.	2025-06-03 20:32:37.058518+00
0f07489d-82dc-421b-b0ab-f516c3b34c0f	6da43867-f49e-4565-8479-0f10d281220e	2f6a0b4d-ff98-443f-a347-bc1c2e867bf5	44aa15b3-b26c-4a83-b592-91adddfc9f9a	5	Very satisfied with the quality of work. Highly recommended!	2025-05-11 22:37:05.042518+00
d5d3c45e-6616-487b-9497-04888fc58741	f3d2272b-39e3-4abd-9a3d-2b1ff3bd27b2	c02b1823-7eec-4776-812e-b2a42402a542	44aa15b3-b26c-4a83-b592-91adddfc9f9a	3	Good service overall. Met expectations.	2025-08-06 15:11:58.716118+00
1f3abcec-cbc3-4974-bf1f-664f6cd2cdc5	c0c7fa21-b191-49d4-921b-9f611364aced	8568204d-bac8-4bd2-be49-666099493157	44aa15b3-b26c-4a83-b592-91adddfc9f9a	4	Good work done on time. Would recommend.	2025-08-17 12:29:36.511318+00
5e7c9d18-8b31-420b-9faf-6eff25be299d	55b90a3e-b3e7-40ef-80aa-51398631dd99	3505bad0-2d27-427b-ae95-3169a5838fbf	44aa15b3-b26c-4a83-b592-91adddfc9f9a	5	Excellent service! Will definitely hire again.	2025-10-09 13:29:07.423318+00
2db1a4f4-5512-457b-9ee8-25d6028f0ec4	b0bab2c7-63ee-4808-a3ba-de1137aca41d	5be0cd9f-a466-4485-ac43-bdc4b104ecc0	44aa15b3-b26c-4a83-b592-91adddfc9f9a	3	Good service overall. Met expectations.	2025-11-20 20:24:51.621718+00
237b1573-b1cc-4aa1-a0af-291152855682	7713933b-2a02-4253-9199-4db713b060d2	ee82e0a0-0f37-4a6f-ae93-2113eddeb55c	44aa15b3-b26c-4a83-b592-91adddfc9f9a	4	Good work done on time. Would recommend.	2025-11-25 13:58:43.980118+00
7d91b161-93de-4fd8-a886-9e74e2cec14b	d52904d0-3c59-4210-95e4-9ab729eee958	40ec397a-f1cf-4855-8a3a-c5673fb20e05	44aa15b3-b26c-4a83-b592-91adddfc9f9a	5	Outstanding work! Highly professional and efficient.	2025-08-31 11:39:01.452118+00
bda6b16a-0d59-4603-ac5b-b32a685aabd6	903ef485-9423-434f-9ddf-5adc36815ca5	0897825a-ab99-41e9-98ba-b4ed822155a5	44aa15b3-b26c-4a83-b592-91adddfc9f9a	3	Good service overall. Met expectations.	2025-10-04 16:19:59.042518+00
b245ffbf-6926-4e69-ad93-7c8afcde1965	6592d757-eaf2-468d-b790-378be21341f5	b19b93f9-ccf5-4b17-bdcf-a105d11018af	44aa15b3-b26c-4a83-b592-91adddfc9f9a	4	Good work done on time. Would recommend.	2025-08-13 10:24:14.268118+00
f09757eb-a3f6-4ae3-8e59-cce92f58551e	df70cffb-5543-4f19-b99c-ad0bd15f74a5	6fc15c3f-2c63-4a80-b499-3744ac6c5e0a	44aa15b3-b26c-4a83-b592-91adddfc9f9a	5	Perfect! Exceeded my expectations.	2025-10-04 19:28:31.740118+00
b6795361-5c9e-44f9-8be1-8aabd1a2a618	96b5a9ea-8f7c-4a62-9d99-c05159dcb17c	97c5f2cc-ef11-452a-9aa3-b4705f3280f8	44aa15b3-b26c-4a83-b592-91adddfc9f9a	3	Good service overall. Met expectations.	2025-06-02 12:40:55.356118+00
4024aeb6-b04d-490c-8696-0902f1aae61d	ea1979c9-2a9b-462b-ad44-d0c13de3b65a	40ec397a-f1cf-4855-8a3a-c5673fb20e05	63c0a431-ca11-4691-96b4-900155ce869b	5	Outstanding work! Highly professional and efficient.	2025-08-28 02:10:43.432918+00
a084b60d-9d9b-493f-ad6b-542d5447d3a2	b7e7f8ef-78b1-4624-9f3f-136c1248d771	0897825a-ab99-41e9-98ba-b4ed822155a5	63c0a431-ca11-4691-96b4-900155ce869b	3	Good service overall. Met expectations.	2025-09-12 13:35:09.698518+00
8d6b93e5-719c-4ad3-94e2-7aca7fe055ba	478186e7-0256-4682-b810-74d8e8143efe	b19b93f9-ccf5-4b17-bdcf-a105d11018af	63c0a431-ca11-4691-96b4-900155ce869b	4	Good work done on time. Would recommend.	2025-11-29 23:50:09.237718+00
79332c8e-e7a4-4c8e-94e6-26f555c06917	2ae97807-7c76-4c4d-9208-a7eed8cf757c	6fc15c3f-2c63-4a80-b499-3744ac6c5e0a	63c0a431-ca11-4691-96b4-900155ce869b	5	Perfect! Exceeded my expectations.	2025-11-27 07:59:16.293718+00
83d459da-63c0-4aa6-845f-3424937b0440	45c8c9ce-3595-4278-89ab-18ebe413d912	97c5f2cc-ef11-452a-9aa3-b4705f3280f8	63c0a431-ca11-4691-96b4-900155ce869b	3	Good service overall. Met expectations.	2025-12-15 18:55:22.639318+00
ae373c9d-a58c-42d9-ad34-8166649fedab	cba1b923-6b1a-4a9a-90f1-fe877fbf54d0	1be14a91-1b2c-48d6-8465-d1d4d12a785c	63c0a431-ca11-4691-96b4-900155ce869b	4	Good work done on time. Would recommend.	2025-12-14 17:13:06.424918+00
e27e98f7-4b08-4969-9afb-42f1cd6af12f	ca5b34da-0aee-485a-a526-5d056246a573	4cfa17c8-4d9f-4283-97f2-3a4976248b91	63c0a431-ca11-4691-96b4-900155ce869b	5	Very satisfied with the quality of work. Highly recommended!	2025-10-11 01:11:45.612118+00
8588a072-ff1c-4751-88d7-2c6e89fc40d2	f468f796-d5d6-4ca0-adad-f3739791803c	57dfd528-5470-40a1-8fde-40eb61dd7ae1	63c0a431-ca11-4691-96b4-900155ce869b	3	Good service overall. Met expectations.	2025-04-08 05:58:19.384918+00
7ae18ed3-7555-4373-b5b8-61a24eabd5a5	d4d87618-d911-48aa-a2d4-12536a0b39fd	3cc9e6b9-d7d7-4d91-904b-65aeb230b14b	63c0a431-ca11-4691-96b4-900155ce869b	4	Good work done on time. Would recommend.	2025-08-25 08:26:20.440918+00
2af107b8-76d0-4e61-a3e5-70d10323d6af	7687315e-e5d2-45e9-a179-05ac1f8ce967	57dfd528-5470-40a1-8fde-40eb61dd7ae1	5b57cd3c-d7ec-4e25-83a9-20bcadbb2f1c	3	Good service overall. Met expectations.	2025-11-21 07:09:03.698518+00
27bebbe9-b6bb-4407-ba52-40e16079b13c	4c7b745b-5c3a-48cc-a5d1-2f3be30f2f64	3cc9e6b9-d7d7-4d91-904b-65aeb230b14b	5b57cd3c-d7ec-4e25-83a9-20bcadbb2f1c	4	Good work done on time. Would recommend.	2025-10-13 01:57:23.023318+00
4c984a4e-c14b-425f-a003-61926f418e3c	55b52838-d015-485b-b292-6d06ff5ab696	ff8bb61b-1117-4f5c-880b-ac4ebd7ea6c2	5b57cd3c-d7ec-4e25-83a9-20bcadbb2f1c	5	Excellent service! Will definitely hire again.	2025-09-27 09:03:36.472918+00
e4ee447b-a893-42cd-ad75-1d0fbc8be957	bbbc4ace-5215-4534-ae63-cdbabee673ce	feaac7e1-3bc3-4462-b2f8-b4a19f990531	5b57cd3c-d7ec-4e25-83a9-20bcadbb2f1c	3	Good service overall. Met expectations.	2025-09-23 17:15:21.727318+00
17cd8d1a-e28c-4094-b5a8-4155de930b78	f57f8a63-d79b-4951-bd13-38a8a3a23707	8d3c4c94-5ab8-4070-a7cc-a12e88219bf3	5b57cd3c-d7ec-4e25-83a9-20bcadbb2f1c	4	Good work done on time. Would recommend.	2025-12-10 22:46:45.132118+00
8e95d9de-b366-4880-94b6-3a35cb4da724	860e19d2-0c9d-4ed2-acc4-1746039092ca	158e9458-44c9-4638-83b9-bf0c99bdb64a	5b57cd3c-d7ec-4e25-83a9-20bcadbb2f1c	5	Outstanding work! Highly professional and efficient.	2025-09-17 13:14:32.968918+00
3270626c-37d4-452e-b758-8c97f70d7989	9bcb7a33-efea-413a-bd74-7aae2c84ced0	5eae5e90-1914-41e5-be8a-aef4314d4892	247b80be-b7dc-4582-aa28-5dd8888d8c53	4	Good work done on time. Would recommend.	2025-05-03 14:24:00.040918+00
3e122924-b578-4028-800d-bba845a3b4a4	d3ce48ec-661c-4345-b73a-32014f431277	4893cb6b-0ffd-422a-b940-7b9201daa34f	247b80be-b7dc-4582-aa28-5dd8888d8c53	5	Perfect! Exceeded my expectations.	2025-06-04 13:36:32.728918+00
03349dbb-66d0-4216-9a94-18dfcfcda8cc	1ffd4dd4-5f65-40bd-9073-da5d8a847b70	218a9cdd-7d3a-44c9-bd7a-d885d38d6063	247b80be-b7dc-4582-aa28-5dd8888d8c53	3	Good service overall. Met expectations.	2025-04-06 02:52:22.725718+00
ef4bddbf-268e-44c4-a4f1-f150223de89a	c4791450-c963-4740-a40d-250481a99d7a	4eea189c-607a-466d-8f92-1f53d790fb6f	247b80be-b7dc-4582-aa28-5dd8888d8c53	4	Good work done on time. Would recommend.	2025-09-24 10:18:50.527318+00
e17dc814-58b3-4b02-a891-4827d5442309	ec086af9-f362-4713-bf92-1e9f6ea6f115	5c74fdb2-b4d9-4f4b-9c6c-f6b72854db84	247b80be-b7dc-4582-aa28-5dd8888d8c53	5	Very satisfied with the quality of work. Highly recommended!	2025-06-30 09:40:30.386518+00
7676908b-beca-46a5-aea4-8694b156c891	bc02bbd8-bd82-4bf1-8671-37c898f8d321	9e61d17b-97a4-45e7-a26c-4fdc3086cdb7	247b80be-b7dc-4582-aa28-5dd8888d8c53	3	Good service overall. Met expectations.	2025-04-25 16:33:14.008918+00
f830edfd-9f7d-4cc9-b3d1-f4875e71651d	fde6e8ee-374a-478d-8234-dc85074f8218	6302ea1c-5af4-4302-918a-c87152175bae	247b80be-b7dc-4582-aa28-5dd8888d8c53	4	Good work done on time. Would recommend.	2025-07-14 16:02:09.064918+00
83d78b9b-4d83-4dc6-8837-dafbbdadff5e	cef35510-64c8-490c-8d49-8d12882f6d9d	a3563a32-75c5-4d0b-b672-9f548fe69a06	247b80be-b7dc-4582-aa28-5dd8888d8c53	5	Excellent service! Will definitely hire again.	2025-10-02 12:26:46.908118+00
f8d2aee9-65e9-45dc-98b8-f9f59035a4b2	ad64353a-4f88-4499-bb1d-d077bf87e9ba	5fcd65e1-d364-4762-a7e2-9939ef039247	247b80be-b7dc-4582-aa28-5dd8888d8c53	3	Good service overall. Met expectations.	2025-11-02 15:09:44.882518+00
c68af5c8-573b-4a1a-afb1-6ce78df21b1a	b8b9db45-4a3f-4a47-aab0-8ab9df945640	649a4947-627c-43f2-9c5e-b75f213a0d93	247b80be-b7dc-4582-aa28-5dd8888d8c53	4	Good work done on time. Would recommend.	2025-05-21 12:09:19.394518+00
e56e6588-348d-4114-a3bd-c20df2cce2b5	5ee9c87d-25c5-433f-94ca-2ba076f2dace	3c6ff2a2-e59e-48af-8a8e-9238dc49ecc6	247b80be-b7dc-4582-aa28-5dd8888d8c53	5	Outstanding work! Highly professional and efficient.	2025-09-09 03:24:27.890518+00
6a1f0699-5213-4d01-a28e-96131e406b9b	88726b7c-1186-4f21-a3fb-cb544b94735f	496d267d-f0aa-4592-a87a-bd69e1196f23	247b80be-b7dc-4582-aa28-5dd8888d8c53	3	Good service overall. Met expectations.	2025-06-20 23:05:49.068118+00
71602c43-b8ca-4fca-9055-85e7ae40230e	cfd6415d-8c87-4feb-93f4-eeb24efed98c	5c328f75-464c-4053-a41e-00fbc6eba934	247b80be-b7dc-4582-aa28-5dd8888d8c53	4	Good work done on time. Would recommend.	2025-09-16 18:28:40.610518+00
e9d8a616-c2c5-4c07-b335-c250e57248d0	fc116d3f-5ca1-4661-a56c-5d204b67c285	a3563a32-75c5-4d0b-b672-9f548fe69a06	7affa09f-b335-4d36-81e3-0a179279fc69	5	Excellent service! Will definitely hire again.	2025-09-22 06:29:55.000918+00
79f1516c-0f9c-446e-af3d-c6879d551fb9	07520687-856e-4b38-8096-c2dacab2f438	5fcd65e1-d364-4762-a7e2-9939ef039247	7affa09f-b335-4d36-81e3-0a179279fc69	3	Good service overall. Met expectations.	2025-11-12 01:34:00.232918+00
b4f09084-20e1-4f50-9c62-f120babe6b14	d1fa2bf7-a35d-483a-a88b-d216023cc2f9	649a4947-627c-43f2-9c5e-b75f213a0d93	7affa09f-b335-4d36-81e3-0a179279fc69	4	Good work done on time. Would recommend.	2025-10-27 23:03:10.005718+00
9326761e-d6c7-4f60-8939-606acdbb9236	3b3e391d-0b12-4a98-8914-8ea74e3ef8b6	3c6ff2a2-e59e-48af-8a8e-9238dc49ecc6	7affa09f-b335-4d36-81e3-0a179279fc69	5	Outstanding work! Highly professional and efficient.	2025-09-06 12:12:55.394518+00
f742b480-8c9f-4f61-ad60-440bcdcbcf72	4f66b3ae-c026-42cd-90c8-b3e546944c7c	496d267d-f0aa-4592-a87a-bd69e1196f23	7affa09f-b335-4d36-81e3-0a179279fc69	3	Good service overall. Met expectations.	2025-05-29 04:23:26.402518+00
7c5c976e-34c3-4772-ba99-9fb9f282e5b9	dde02e83-c625-4309-ae30-8a43893cb9f1	5c328f75-464c-4053-a41e-00fbc6eba934	7affa09f-b335-4d36-81e3-0a179279fc69	4	Good work done on time. Would recommend.	2025-04-20 17:37:22.264918+00
d7baf5f4-0dad-4d9f-a0f2-4d6bfbcc0e94	4b507a50-07aa-4f5f-85c3-670530406330	bed6bf7a-bfbb-4eac-b6d7-35ca3e7d6660	7affa09f-b335-4d36-81e3-0a179279fc69	5	Perfect! Exceeded my expectations.	2025-05-21 14:04:21.976918+00
12d5522a-f6cd-438e-808e-5a136b963e5a	8f234864-1698-4e19-ab03-0aadf9fdfd52	549f87d2-961e-48f8-bcff-7286d7db879e	7affa09f-b335-4d36-81e3-0a179279fc69	3	Good service overall. Met expectations.	2025-07-01 13:08:05.983318+00
423c37b5-c25d-4628-b1bb-a779975d917e	1947a5ab-8a94-46b0-aa32-a12eed09642c	a8957421-6c24-4110-ad8a-89513c6cfe93	7affa09f-b335-4d36-81e3-0a179279fc69	4	Good work done on time. Would recommend.	2025-06-23 16:37:46.860118+00
bb1bd077-ea19-4233-9aa5-35ee036f94b0	555cbaaa-6c90-4685-9451-f86124ab29c6	ded07a3d-2dc7-40f1-a9df-81b72c989abf	7affa09f-b335-4d36-81e3-0a179279fc69	5	Very satisfied with the quality of work. Highly recommended!	2025-06-14 21:03:27.314518+00
d185dd2b-ccf2-4d06-808d-668ddeab4ebc	5a47874b-1161-4c2f-84dc-344d3d821eec	549f87d2-961e-48f8-bcff-7286d7db879e	96fe7dab-91ec-4c51-a775-a406572da480	3	Good service overall. Met expectations.	2025-10-06 21:09:59.311318+00
9ac690e2-f8f0-44ac-95b1-b177209a1a23	84e1291d-015d-4ee8-a91b-1506ad9d4a73	a8957421-6c24-4110-ad8a-89513c6cfe93	96fe7dab-91ec-4c51-a775-a406572da480	4	Good work done on time. Would recommend.	2025-11-21 06:45:57.669718+00
91266251-f4c4-40ff-82d6-d106628f5b3d	ad32fcd8-e509-4b4a-bfd7-35d0fa1b363c	ded07a3d-2dc7-40f1-a9df-81b72c989abf	96fe7dab-91ec-4c51-a775-a406572da480	5	Very satisfied with the quality of work. Highly recommended!	2025-11-10 13:45:45.516118+00
ab9c4abb-1d07-4669-b5fd-1d93372cec13	1054ec14-0759-4653-bd21-41b27d640d93	f97cfaac-5a4e-420a-a445-9776c13600b8	96fe7dab-91ec-4c51-a775-a406572da480	3	Good service overall. Met expectations.	2025-12-16 04:55:03.400918+00
9766fe71-f7fa-4295-8c74-fa2dbef00b28	9c0eaf11-db98-442f-b13a-7611a37cc998	2594b276-c01e-4543-b2b5-0cd20667b7a6	96fe7dab-91ec-4c51-a775-a406572da480	4	Good work done on time. Would recommend.	2025-11-21 10:42:48.309718+00
4a42d4c6-19a5-49f0-8601-fa7629cc0203	1e116db7-ec77-45a2-bb0b-2fd75686b801	216ebdf7-cd45-4b40-86f2-268b4e33bb68	96fe7dab-91ec-4c51-a775-a406572da480	5	Excellent service! Will definitely hire again.	2025-10-14 07:30:54.991318+00
903ff927-cd39-4f1f-9391-f2488f072f05	5d6d997d-a8af-4d94-bcda-4452cf5eac88	f74860cc-f981-42b4-809d-11e92bedd14f	96fe7dab-91ec-4c51-a775-a406572da480	3	Good service overall. Met expectations.	2025-04-12 08:03:29.704918+00
8563b27a-6571-44a4-b426-8f9f5a3f12be	c476fd64-3739-44b5-91f0-9b1d32b5a010	d951675f-497c-4ccb-b55d-6a72f9cfb8fc	7c681db7-cff1-40e6-b38b-79919297ca90	4	Good work done on time. Would recommend.	2025-08-09 22:40:54.434518+00
e2f1b78e-3915-46a7-934b-7fdec478e5fd	d57344b6-ab48-4e7b-b9bd-591a386bb24e	dd3b46e4-576f-488e-928f-a5a2688e0fd4	7c681db7-cff1-40e6-b38b-79919297ca90	5	Outstanding work! Highly professional and efficient.	2025-06-30 12:39:27.832918+00
51186b6b-7513-4c79-b70b-44abdfce2c4f	ab73a3a2-50cf-42f4-a2b0-4d2a9b444d9a	7d6e1a27-d7f8-445f-a544-81c817a39304	7c681db7-cff1-40e6-b38b-79919297ca90	3	Good service overall. Met expectations.	2025-11-10 10:14:14.392918+00
acfdc8b2-1649-4437-913f-241868afeb7f	03528def-ae96-4d78-b5e5-b2f94897cdbd	088c7759-5ee8-4fd2-99fa-6d6953d6e99c	7c681db7-cff1-40e6-b38b-79919297ca90	4	Good work done on time. Would recommend.	2025-08-30 17:58:51.007318+00
6d40f69f-4826-4118-b32e-686e162fb34e	c6e79dd8-5a81-4ec8-bb7d-d5c5aa86d61d	6e0bbfe1-f2fd-4356-8684-bc8d8fb15a28	b4f1941c-0fd5-43f9-ba92-40fc055c11c8	3	Good service overall. Met expectations.	2025-04-20 11:28:24.856918+00
144b8d97-fa85-4673-a518-19ad1082c69a	37ff4a80-481c-4d14-b202-68d8577d8359	2f6a0b4d-ff98-443f-a347-bc1c2e867bf5	b4f1941c-0fd5-43f9-ba92-40fc055c11c8	4	Good work done on time. Would recommend.	2025-09-18 06:51:09.919318+00
6ae1e9b8-38bb-4dd7-a26e-f51227b51bc2	fce96628-5555-4402-8ae7-6808da0bffec	c02b1823-7eec-4776-812e-b2a42402a542	b4f1941c-0fd5-43f9-ba92-40fc055c11c8	5	Excellent service! Will definitely hire again.	2025-12-08 06:07:13.596118+00
9d59f421-d5c5-4070-82fa-a566ed38b042	cf87f4d6-9ebb-4db2-af9a-fcd11071594a	8568204d-bac8-4bd2-be49-666099493157	b4f1941c-0fd5-43f9-ba92-40fc055c11c8	3	Good service overall. Met expectations.	2025-09-04 18:02:00.136918+00
e13db3a6-357e-479c-a547-619731bab7c2	557b4333-ae93-48ca-b0ce-f3371635e88d	3505bad0-2d27-427b-ae95-3169a5838fbf	b4f1941c-0fd5-43f9-ba92-40fc055c11c8	4	Good work done on time. Would recommend.	2025-11-27 03:55:52.620118+00
65aa81cd-49ac-46e4-8e6c-eb3d8c13aff2	fc7c7691-7758-41d8-b92d-02211e1fff1d	5be0cd9f-a466-4485-ac43-bdc4b104ecc0	b4f1941c-0fd5-43f9-ba92-40fc055c11c8	5	Outstanding work! Highly professional and efficient.	2025-08-27 23:53:11.800918+00
058343bd-9a3c-49b5-9e0f-9ff99d0cc221	2585d2a7-d452-48ad-b9fc-7d94ef79e529	ee82e0a0-0f37-4a6f-ae93-2113eddeb55c	b4f1941c-0fd5-43f9-ba92-40fc055c11c8	3	Good service overall. Met expectations.	2025-07-16 15:02:50.594518+00
daee145b-2c1e-4715-8be0-d9765ac9fcef	a98450cc-f1d2-4c43-9c1c-cbd43440d8e0	40ec397a-f1cf-4855-8a3a-c5673fb20e05	b4f1941c-0fd5-43f9-ba92-40fc055c11c8	4	Good work done on time. Would recommend.	2025-11-05 06:29:49.730518+00
4ad2fbca-ce24-40db-b32c-bfd439a9552f	983e601e-cfa4-4e63-a26d-315e5ba54518	0897825a-ab99-41e9-98ba-b4ed822155a5	b4f1941c-0fd5-43f9-ba92-40fc055c11c8	5	Perfect! Exceeded my expectations.	2025-11-10 14:15:13.692118+00
ab4e9f29-6953-4ad9-8ee4-e21277651aab	ca7e701b-1eea-43f6-b9f1-5855704d5e12	b19b93f9-ccf5-4b17-bdcf-a105d11018af	b4f1941c-0fd5-43f9-ba92-40fc055c11c8	3	Good service overall. Met expectations.	2025-07-26 00:17:44.661718+00
a861c9b3-ddf6-4da9-8fb5-35e74d45c601	5588af0a-67d1-415c-80cb-d3af65f27995	ee82e0a0-0f37-4a6f-ae93-2113eddeb55c	ccc0cbbb-a469-4e83-a5ca-259f2b1acce2	3	Good service overall. Met expectations.	2025-06-08 23:38:42.357718+00
2a0728d9-f130-43d9-bfa0-61c0cf681279	e261bb36-076c-44f4-a366-9286bc88229e	40ec397a-f1cf-4855-8a3a-c5673fb20e05	ccc0cbbb-a469-4e83-a5ca-259f2b1acce2	4	Good work done on time. Would recommend.	2025-10-15 01:20:28.504918+00
7c3db5bb-c023-457e-a045-7556c5bfd575	c7e7a81d-43be-4fa0-b920-5f731491eb1a	0897825a-ab99-41e9-98ba-b4ed822155a5	ccc0cbbb-a469-4e83-a5ca-259f2b1acce2	5	Perfect! Exceeded my expectations.	2025-09-22 02:13:16.101718+00
9e011a73-54f2-44c9-a394-427991e5e69f	3501a44f-a85f-4d7c-9e21-72df307ea9a9	b19b93f9-ccf5-4b17-bdcf-a105d11018af	ccc0cbbb-a469-4e83-a5ca-259f2b1acce2	3	Good service overall. Met expectations.	2025-08-05 22:07:46.197718+00
4920b5b4-23d8-4de9-96ae-8b0c52112ee9	afb16a90-9d09-4bb2-9a86-d6808bdaead7	6fc15c3f-2c63-4a80-b499-3744ac6c5e0a	ccc0cbbb-a469-4e83-a5ca-259f2b1acce2	4	Good work done on time. Would recommend.	2025-09-27 18:01:34.130518+00
9f75f5bd-a532-4960-8191-d4e9e477aedb	145d5fc4-1518-4ca7-8b35-e5503f7ba13a	97c5f2cc-ef11-452a-9aa3-b4705f3280f8	ccc0cbbb-a469-4e83-a5ca-259f2b1acce2	5	Very satisfied with the quality of work. Highly recommended!	2025-07-05 20:28:44.901718+00
2e2f59dc-906f-416b-80fa-d020568c593b	fcb69218-8a26-4dc0-b39f-851a82f44366	1be14a91-1b2c-48d6-8465-d1d4d12a785c	ccc0cbbb-a469-4e83-a5ca-259f2b1acce2	3	Good service overall. Met expectations.	2025-08-26 14:08:14.133718+00
02d58f3d-818f-4407-b25b-3f4d7f6d82bb	582e4e5c-7cad-41a4-8f68-74aadb348e2b	4cfa17c8-4d9f-4283-97f2-3a4976248b91	ccc0cbbb-a469-4e83-a5ca-259f2b1acce2	4	Good work done on time. Would recommend.	2025-04-16 18:25:37.788118+00
6ae196f4-feeb-4719-bfc5-2d71b946e1e5	8b66b89f-2c99-4eca-89c2-6372c068f2bd	4cfa17c8-4d9f-4283-97f2-3a4976248b91	21007243-551a-49f7-8df4-d188ad7e6244	4	Good work done on time. Would recommend.	2025-04-11 00:27:34.773718+00
c78a5b10-af07-4b62-a990-5b6d3555e9e5	920ad54f-1efa-455a-9da2-389584e6f190	57dfd528-5470-40a1-8fde-40eb61dd7ae1	21007243-551a-49f7-8df4-d188ad7e6244	5	Excellent service! Will definitely hire again.	2025-08-09 17:53:24.156118+00
f22d0d42-1249-4867-ba6f-c64ff5d6ae6d	5443530a-0cc2-44de-b066-1a2ad2a1baf9	3cc9e6b9-d7d7-4d91-904b-65aeb230b14b	21007243-551a-49f7-8df4-d188ad7e6244	3	Good service overall. Met expectations.	2025-06-03 13:10:53.426518+00
4d111334-b67a-455d-815d-725df36c01a4	d6c4cf94-0522-4b5a-9012-eeb5c798aac4	ff8bb61b-1117-4f5c-880b-ac4ebd7ea6c2	21007243-551a-49f7-8df4-d188ad7e6244	4	Good work done on time. Would recommend.	2025-03-24 18:57:18.156118+00
46e92df5-9575-4f24-927d-c5d945459746	45a85fb6-34c9-49d5-91ac-09ba2f10d9b5	feaac7e1-3bc3-4462-b2f8-b4a19f990531	21007243-551a-49f7-8df4-d188ad7e6244	5	Outstanding work! Highly professional and efficient.	2025-04-09 15:22:58.466518+00
2cdc4cc1-b0ad-45cc-a2d1-082213c01393	a0a46d1b-bd11-4407-bf15-761d051471da	5eae5e90-1914-41e5-be8a-aef4314d4892	8d2d4afc-beef-44d3-8628-428dcebdf008	3	Good service overall. Met expectations.	2025-08-27 09:40:29.954518+00
e765a3be-6ac7-4ae5-9812-5b757ca45d80	0635a4bf-27bb-4d33-89f3-3ed39578c660	4893cb6b-0ffd-422a-b940-7b9201daa34f	8d2d4afc-beef-44d3-8628-428dcebdf008	4	Good work done on time. Would recommend.	2025-06-07 09:56:49.298518+00
c44e41c5-b138-477c-af67-db7b6dfd55d3	d3687eee-6506-4fb9-aa8d-45e7b0e29874	218a9cdd-7d3a-44c9-bd7a-d885d38d6063	8d2d4afc-beef-44d3-8628-428dcebdf008	5	Very satisfied with the quality of work. Highly recommended!	2025-10-26 08:59:50.968918+00
f4333e34-3e35-4e12-bf9c-9d1133f8dd86	6789d61e-208e-47d4-bc41-8e0215601097	4eea189c-607a-466d-8f92-1f53d790fb6f	8d2d4afc-beef-44d3-8628-428dcebdf008	3	Good service overall. Met expectations.	2025-07-05 21:26:08.892118+00
6b1478e5-0310-4a82-aded-049437235354	baa291ca-32ab-4ec5-aa88-95810fd37f56	5c74fdb2-b4d9-4f4b-9c6c-f6b72854db84	8d2d4afc-beef-44d3-8628-428dcebdf008	4	Good work done on time. Would recommend.	2025-11-21 21:39:02.085718+00
a014ef9b-dc81-4dd7-ae49-add43ce969b1	97d04e04-739e-4135-bc01-6b07be85c6a8	9e61d17b-97a4-45e7-a26c-4fdc3086cdb7	8d2d4afc-beef-44d3-8628-428dcebdf008	5	Excellent service! Will definitely hire again.	2025-06-21 20:39:26.767318+00
f0133287-7633-42a3-8ede-f2d3f29f0981	438c37cb-24bf-473e-8994-04fb19d20438	6302ea1c-5af4-4302-918a-c87152175bae	8d2d4afc-beef-44d3-8628-428dcebdf008	3	Good service overall. Met expectations.	2025-03-24 09:51:59.167318+00
25b8787d-006a-413f-af3d-8293ff9337fd	e4f5fa95-2c60-4af2-9b20-034ed196ea34	a3563a32-75c5-4d0b-b672-9f548fe69a06	8d2d4afc-beef-44d3-8628-428dcebdf008	4	Good work done on time. Would recommend.	2025-04-16 19:25:17.426518+00
b028eeae-9b3a-44ba-9c03-2c637fce9e1b	c0bc84de-c96d-402f-83ab-4dd8c2b2c015	5fcd65e1-d364-4762-a7e2-9939ef039247	8d2d4afc-beef-44d3-8628-428dcebdf008	5	Outstanding work! Highly professional and efficient.	2025-05-31 12:52:41.244118+00
0bf28a5d-1ba3-4264-a156-74d92261ac60	80e73192-4f1a-4566-a899-5af0189790e0	649a4947-627c-43f2-9c5e-b75f213a0d93	8d2d4afc-beef-44d3-8628-428dcebdf008	3	Good service overall. Met expectations.	2025-12-02 04:33:57.122518+00
42cb8234-91c3-40e8-97ee-52b8d8201ffc	4a8b56c9-eab6-4161-b0e4-2feb4e3cddce	3c6ff2a2-e59e-48af-8a8e-9238dc49ecc6	8d2d4afc-beef-44d3-8628-428dcebdf008	4	Good work done on time. Would recommend.	2025-12-19 00:22:03.602518+00
46e76e8d-be9e-4dfc-a0d7-a97ccf184b05	16a6dae3-e3a0-4896-977c-4cbb26b46f51	6302ea1c-5af4-4302-918a-c87152175bae	6f9859a4-f31c-4445-becd-04934b9b4677	3	Good service overall. Met expectations.	2025-11-28 18:12:49.432918+00
54e61567-f2b6-4086-9941-c491af620100	b43b4dcc-c4bc-4110-8d84-606515b16827	a3563a32-75c5-4d0b-b672-9f548fe69a06	6f9859a4-f31c-4445-becd-04934b9b4677	4	Good work done on time. Would recommend.	2025-09-29 10:30:21.813718+00
432774cf-9184-4e41-a16f-37ad0cee8542	f2e0b1d5-5995-457c-938e-45b448a348ef	5fcd65e1-d364-4762-a7e2-9939ef039247	6f9859a4-f31c-4445-becd-04934b9b4677	5	Outstanding work! Highly professional and efficient.	2025-12-14 09:56:10.332118+00
61095679-79b8-4ad9-b239-b46f0bd22403	3b6861a6-2915-4c6f-8c2b-841eb39cfa6c	649a4947-627c-43f2-9c5e-b75f213a0d93	6f9859a4-f31c-4445-becd-04934b9b4677	3	Good service overall. Met expectations.	2025-06-22 09:06:19.164118+00
17bf6158-351a-4a94-901b-d8e2c96adb35	80a00d17-78d3-426b-b910-e2490bcb0136	3c6ff2a2-e59e-48af-8a8e-9238dc49ecc6	6f9859a4-f31c-4445-becd-04934b9b4677	4	Good work done on time. Would recommend.	2025-08-28 23:49:56.796118+00
f4575c47-4829-4fa3-8371-731447e7eae5	3b1e0400-151f-4706-a367-4e51f89ceaed	496d267d-f0aa-4592-a87a-bd69e1196f23	6f9859a4-f31c-4445-becd-04934b9b4677	5	Perfect! Exceeded my expectations.	2025-04-21 23:30:59.772118+00
35db5bc1-cf21-4ca3-b9c5-7d27d2346c22	d67c7634-298b-4fab-9a0f-0b8db50f0bd5	5c328f75-464c-4053-a41e-00fbc6eba934	6f9859a4-f31c-4445-becd-04934b9b4677	3	Good service overall. Met expectations.	2025-04-28 13:29:37.749718+00
a699b0b2-3808-41e4-9fc4-356ad6ccea4f	05077a93-253c-4a20-b1d5-cfb66cc1d41d	bed6bf7a-bfbb-4eac-b6d7-35ca3e7d6660	6f9859a4-f31c-4445-becd-04934b9b4677	4	Good work done on time. Would recommend.	2025-05-11 08:18:17.032918+00
f38ef840-7c21-4678-9995-b66c2646a5bb	b50456a7-f0c3-4bf5-9b55-c9f7bfb05089	549f87d2-961e-48f8-bcff-7286d7db879e	6f9859a4-f31c-4445-becd-04934b9b4677	5	Very satisfied with the quality of work. Highly recommended!	2025-05-11 18:32:20.152918+00
c98b0a03-cf6e-455e-955f-71a64f7663cb	7114dacc-26c7-4fd2-b8a2-f3a70cade9ef	bed6bf7a-bfbb-4eac-b6d7-35ca3e7d6660	e4b6d247-223e-4032-bb0e-949dc97f052c	4	Good work done on time. Would recommend.	2025-04-16 18:51:39.295318+00
8054cefb-74c9-4744-b8e1-8b16d3e9b281	b08f253d-a6f5-4db3-8b9e-06bb06d32406	549f87d2-961e-48f8-bcff-7286d7db879e	e4b6d247-223e-4032-bb0e-949dc97f052c	5	Very satisfied with the quality of work. Highly recommended!	2025-04-23 19:17:24.645718+00
84b3136f-5d2d-4078-8c7c-f17c9436f261	fe7968af-6fdb-477f-b6c8-0b9a1dc81c0c	a8957421-6c24-4110-ad8a-89513c6cfe93	e4b6d247-223e-4032-bb0e-949dc97f052c	3	Good service overall. Met expectations.	2025-05-15 03:53:20.210518+00
ef7cde75-3c84-470c-9cad-cbd5e69e1f8c	d81708d8-2e94-44bc-be90-6bb50d75d44a	ded07a3d-2dc7-40f1-a9df-81b72c989abf	e4b6d247-223e-4032-bb0e-949dc97f052c	4	Good work done on time. Would recommend.	2025-05-02 05:40:59.647318+00
4ac2123e-10c3-45be-915e-5cd2a3be6339	729440bb-60a7-41ff-834d-d59f4dd3723d	f97cfaac-5a4e-420a-a445-9776c13600b8	e4b6d247-223e-4032-bb0e-949dc97f052c	5	Excellent service! Will definitely hire again.	2025-10-04 08:06:36.501718+00
39fe01cf-4c01-467a-aa8f-5eecde7c1e22	3092d96b-f796-4cab-9742-6bad06370a58	2594b276-c01e-4543-b2b5-0cd20667b7a6	e4b6d247-223e-4032-bb0e-949dc97f052c	3	Good service overall. Met expectations.	2025-10-25 09:24:58.735318+00
316a2fd3-a890-4a6f-a019-5608bccf2a89	4885cfbc-ac78-46de-b998-cbd497b8f6ea	f74860cc-f981-42b4-809d-11e92bedd14f	99b0b1ec-e1fb-4c44-a35e-2f14fd03e819	5	Outstanding work! Highly professional and efficient.	2025-05-30 15:51:16.312918+00
fc3b2800-7361-4699-a16f-8bcb38a011ca	13756169-5874-46cd-a22a-da03bb0ccaa9	d951675f-497c-4ccb-b55d-6a72f9cfb8fc	99b0b1ec-e1fb-4c44-a35e-2f14fd03e819	3	Good service overall. Met expectations.	2025-03-23 02:41:12.607318+00
63960554-6de0-4795-b5c4-12d9b5560418	6a90ec86-9081-4fed-ab51-b6d0c89292cf	dd3b46e4-576f-488e-928f-a5a2688e0fd4	99b0b1ec-e1fb-4c44-a35e-2f14fd03e819	4	Good work done on time. Would recommend.	2025-12-18 04:06:41.829718+00
f0658788-3162-4c43-b1cd-f19c68ddebb2	b9028aae-c5ec-4167-adb1-cde5ac1b0de7	7d6e1a27-d7f8-445f-a544-81c817a39304	99b0b1ec-e1fb-4c44-a35e-2f14fd03e819	5	Perfect! Exceeded my expectations.	2025-07-23 05:23:44.056918+00
32714ec5-323c-4b4d-aecf-77aedcfb5d91	c29981f6-f668-460c-82a7-36af3e88a0ad	088c7759-5ee8-4fd2-99fa-6d6953d6e99c	99b0b1ec-e1fb-4c44-a35e-2f14fd03e819	3	Good service overall. Met expectations.	2025-11-27 01:16:47.925718+00
7685c6f9-80c6-4dc2-bd0b-d476dc15c1b7	6a62d3c4-7758-409c-b5c2-2cfd672dbe83	ce930397-85a0-4a2c-9d12-343341780701	99b0b1ec-e1fb-4c44-a35e-2f14fd03e819	4	Good work done on time. Would recommend.	2025-12-10 00:01:37.759318+00
ad30ee4f-0612-43bd-9c29-837535150c0c	0d6e6d2e-e160-413c-a58e-7831143cc5b5	2637c6dd-5fbe-487c-85c5-3ef87dc74cf5	99b0b1ec-e1fb-4c44-a35e-2f14fd03e819	5	Very satisfied with the quality of work. Highly recommended!	2025-11-03 17:47:33.544918+00
4ef28f53-a413-4cb7-bafb-957e3ed1da5d	f0ab985d-23ac-4dbe-abc3-20c5dd0933ae	d4d09b07-6022-4d29-8d83-2905a67c2fb0	99b0b1ec-e1fb-4c44-a35e-2f14fd03e819	3	Good service overall. Met expectations.	2025-12-12 04:30:30.626518+00
53d6e2b8-07e7-4f6e-a4ff-35888d852a4c	fb42a180-34a3-45c7-bfac-ae39a646d324	9c0e3b56-4094-4a57-b207-abb436a8fe3d	99b0b1ec-e1fb-4c44-a35e-2f14fd03e819	4	Good work done on time. Would recommend.	2025-03-21 17:29:29.397718+00
7e59d9d7-24bc-4f61-a529-81a045aa575a	d23da861-c768-41dd-837c-dcb6f92c642d	6e0bbfe1-f2fd-4356-8684-bc8d8fb15a28	99b0b1ec-e1fb-4c44-a35e-2f14fd03e819	5	Excellent service! Will definitely hire again.	2025-12-19 18:07:30.184918+00
91f45126-eb47-4038-88d8-ebc2161cb7df	349339ab-1e70-4e24-853a-c1bb7b93d94d	2f6a0b4d-ff98-443f-a347-bc1c2e867bf5	99b0b1ec-e1fb-4c44-a35e-2f14fd03e819	3	Good service overall. Met expectations.	2025-05-29 06:48:43.989718+00
3e13d96d-1c06-4e35-bf6f-c68fb7ac6deb	c80c4ca1-e7f3-4ab6-b946-15b3555912f6	c02b1823-7eec-4776-812e-b2a42402a542	99b0b1ec-e1fb-4c44-a35e-2f14fd03e819	4	Good work done on time. Would recommend.	2025-09-09 15:46:29.464918+00
12825154-464b-4cf7-bf54-edea53954171	f35169ad-afa7-436c-b50f-6df370b4d067	8568204d-bac8-4bd2-be49-666099493157	99b0b1ec-e1fb-4c44-a35e-2f14fd03e819	5	Outstanding work! Highly professional and efficient.	2025-05-29 03:42:13.720918+00
22738a4f-48ec-4d0b-97dc-89698b69bc04	04f01eb1-680d-4e86-b14b-0e9d06b37505	d4d09b07-6022-4d29-8d83-2905a67c2fb0	90c8bc6d-8bfd-46c0-aca0-528cb60346ff	3	Good service overall. Met expectations.	2025-04-17 03:54:19.999318+00
7e50aabb-6283-4939-a59a-2be1a430f296	8f408df8-0100-4136-bc8c-711dce685964	9c0e3b56-4094-4a57-b207-abb436a8fe3d	90c8bc6d-8bfd-46c0-aca0-528cb60346ff	4	Good work done on time. Would recommend.	2025-05-02 15:26:05.522518+00
14e178c5-9eec-458f-aa5c-4d7c4cfdbaa4	3ae16a7b-1342-4c34-9d48-4fedb369a3ac	6e0bbfe1-f2fd-4356-8684-bc8d8fb15a28	90c8bc6d-8bfd-46c0-aca0-528cb60346ff	5	Excellent service! Will definitely hire again.	2025-05-14 22:24:46.149718+00
bfe156c7-551a-43ef-b8c7-5bf8971c630c	de69ea15-df7f-4689-93d9-3176747ac788	2f6a0b4d-ff98-443f-a347-bc1c2e867bf5	90c8bc6d-8bfd-46c0-aca0-528cb60346ff	3	Good service overall. Met expectations.	2025-11-11 18:38:11.887318+00
715338f5-b26b-4821-a246-869af2338227	1ec0b554-d128-4ad5-aaaa-477b2435c798	c02b1823-7eec-4776-812e-b2a42402a542	90c8bc6d-8bfd-46c0-aca0-528cb60346ff	4	Good work done on time. Would recommend.	2025-07-19 08:18:12.194518+00
4ea26c0e-80f5-4d62-bba0-24e9d2878b19	25131c35-c3fd-47e8-9628-2174f2853a13	8568204d-bac8-4bd2-be49-666099493157	90c8bc6d-8bfd-46c0-aca0-528cb60346ff	5	Outstanding work! Highly professional and efficient.	2025-11-28 03:38:42.904918+00
505367d5-e0b1-4aff-be4f-ac9e33db1266	6e037108-bad3-4ea4-94fb-7691f285ab7f	3505bad0-2d27-427b-ae95-3169a5838fbf	90c8bc6d-8bfd-46c0-aca0-528cb60346ff	3	Good service overall. Met expectations.	2025-07-07 04:24:03.381718+00
e452dd74-828e-4369-8a3f-62d9d35b5f8a	d266287b-45ef-48c5-815f-c8a763084637	5be0cd9f-a466-4485-ac43-bdc4b104ecc0	90c8bc6d-8bfd-46c0-aca0-528cb60346ff	4	Good work done on time. Would recommend.	2025-11-28 11:29:40.284118+00
f017d650-181a-4cc1-87c8-2da8e8826072	f1103b19-da6c-4a30-b678-b0d19825ab86	ee82e0a0-0f37-4a6f-ae93-2113eddeb55c	90c8bc6d-8bfd-46c0-aca0-528cb60346ff	5	Perfect! Exceeded my expectations.	2025-11-11 05:25:38.968918+00
c0c7b48b-8b1d-4bc1-a242-5b5d43d9c578	685795f2-9130-4b8f-af21-9dbed316a6af	40ec397a-f1cf-4855-8a3a-c5673fb20e05	90c8bc6d-8bfd-46c0-aca0-528cb60346ff	3	Good service overall. Met expectations.	2025-06-04 01:02:10.188118+00
8816075d-38e3-4b41-aefb-c65468885fbd	f80ee73b-dcbc-4af0-8396-d8c6f22a3b62	5be0cd9f-a466-4485-ac43-bdc4b104ecc0	ffdae030-82ae-435b-a1a4-10ecbd39dd6b	4	Good work done on time. Would recommend.	2025-05-08 08:37:04.725718+00
00f91065-f745-4944-a4a9-78c311bb8d4a	e8a38677-82d6-4d8e-9cfe-7d4582c48695	ee82e0a0-0f37-4a6f-ae93-2113eddeb55c	ffdae030-82ae-435b-a1a4-10ecbd39dd6b	5	Perfect! Exceeded my expectations.	2025-07-28 00:50:43.740118+00
780c1dd5-1959-4775-8a6d-5544819f6062	e456e8d7-fe64-4a90-952e-d1d74442d2b7	40ec397a-f1cf-4855-8a3a-c5673fb20e05	ffdae030-82ae-435b-a1a4-10ecbd39dd6b	3	Good service overall. Met expectations.	2025-03-26 06:46:02.853718+00
fa7a4725-4823-4d7b-bcfb-92d18befbd83	1a62ddec-96a5-410b-b936-74447469272e	0897825a-ab99-41e9-98ba-b4ed822155a5	ffdae030-82ae-435b-a1a4-10ecbd39dd6b	4	Good work done on time. Would recommend.	2025-06-19 02:45:45.804118+00
8b5beabb-2aac-4381-8be0-9743fdb800ee	f22c0078-816c-4c0f-a369-30a7367be5e9	b19b93f9-ccf5-4b17-bdcf-a105d11018af	ffdae030-82ae-435b-a1a4-10ecbd39dd6b	5	Very satisfied with the quality of work. Highly recommended!	2025-04-18 20:33:10.840918+00
ed02db74-8820-4f56-91eb-5cfc0ccecc1c	ed820f22-3747-4be7-9a84-fb60f3adb926	6fc15c3f-2c63-4a80-b499-3744ac6c5e0a	ffdae030-82ae-435b-a1a4-10ecbd39dd6b	3	Good service overall. Met expectations.	2025-08-09 01:50:09.122518+00
3b397422-aae0-4814-b718-ca0a3b480bad	9482e749-86d9-4aa9-8b45-7943586f9e16	97c5f2cc-ef11-452a-9aa3-b4705f3280f8	ffdae030-82ae-435b-a1a4-10ecbd39dd6b	4	Good work done on time. Would recommend.	2025-05-15 02:45:05.887318+00
4c972bf2-1eaa-4d4e-bafe-517e7d132f38	3f02ae6f-bca0-430b-8b31-cfd0d768d261	1be14a91-1b2c-48d6-8465-d1d4d12a785c	96eaea48-f243-41e6-8c5c-db8c475a5dcd	5	Excellent service! Will definitely hire again.	2025-04-29 17:02:22.658518+00
5b86c245-ffb0-4340-84e1-cf0460138391	032f78e8-c10a-4730-a82a-97ea58e7099b	4cfa17c8-4d9f-4283-97f2-3a4976248b91	96eaea48-f243-41e6-8c5c-db8c475a5dcd	3	Good service overall. Met expectations.	2025-12-16 13:51:01.394518+00
ddb26074-c006-4cbc-97d1-315213ad2107	bc2a79df-8892-443e-afb0-d26fbb6a74a6	57dfd528-5470-40a1-8fde-40eb61dd7ae1	96eaea48-f243-41e6-8c5c-db8c475a5dcd	4	Good work done on time. Would recommend.	2025-05-05 08:15:12.741718+00
ddc5e880-d144-4b6e-8d6d-8741b40b2bf5	e2e43eff-9bcf-421b-ade8-273b880f00ca	3cc9e6b9-d7d7-4d91-904b-65aeb230b14b	96eaea48-f243-41e6-8c5c-db8c475a5dcd	5	Outstanding work! Highly professional and efficient.	2025-08-03 22:15:02.604118+00
38f143e6-b488-49fa-873a-d533d84aad69	efd896fe-a035-416c-bd9c-7c1b04ac3aaa	503f2221-11c2-4415-9a5b-9b0e81e95b67	170ee8a2-3694-4aa3-a02b-aeba5f7c3a31	4	Good work done on time. Would recommend.	2025-05-05 16:00:40.418518+00
bcc14634-46d6-4445-b897-f991e7a65f98	33f5bd5f-8908-444f-bda6-0a0cee2491f7	5eae5e90-1914-41e5-be8a-aef4314d4892	170ee8a2-3694-4aa3-a02b-aeba5f7c3a31	5	Very satisfied with the quality of work. Highly recommended!	2025-07-14 20:34:06.050518+00
ddf65790-7bb8-48e6-848e-c58575aeaf69	5446d2e4-a276-4a7e-bf8b-6afd2eb4a8df	4893cb6b-0ffd-422a-b940-7b9201daa34f	170ee8a2-3694-4aa3-a02b-aeba5f7c3a31	3	Good service overall. Met expectations.	2025-09-26 14:27:31.375318+00
53aeb074-820b-4c49-a275-5e8cc1a2392e	36cdede5-0867-4562-a0c5-545ca2633194	218a9cdd-7d3a-44c9-bd7a-d885d38d6063	170ee8a2-3694-4aa3-a02b-aeba5f7c3a31	4	Good work done on time. Would recommend.	2025-06-30 12:03:24.722518+00
5cd11a25-86ad-4794-9acf-3a24b84648bd	af698657-6b64-4546-a05d-6da754d20398	4eea189c-607a-466d-8f92-1f53d790fb6f	170ee8a2-3694-4aa3-a02b-aeba5f7c3a31	5	Excellent service! Will definitely hire again.	2025-08-29 09:34:51.352918+00
cd408942-37d6-4bc9-8ce9-3a8759b08094	932ff282-aa9f-48db-b9a6-eb54795cf043	5c74fdb2-b4d9-4f4b-9c6c-f6b72854db84	170ee8a2-3694-4aa3-a02b-aeba5f7c3a31	3	Good service overall. Met expectations.	2025-09-26 08:48:12.597718+00
fc58a436-c811-4f36-bd25-8b58e87e95e2	dbd2db74-93b2-4160-a563-0a92fc6b2c54	9e61d17b-97a4-45e7-a26c-4fdc3086cdb7	170ee8a2-3694-4aa3-a02b-aeba5f7c3a31	4	Good work done on time. Would recommend.	2025-05-11 07:07:23.128918+00
f378993f-f613-4749-a203-7015722cf7cc	fbceb685-3979-476f-bcdd-84fe551593e0	6302ea1c-5af4-4302-918a-c87152175bae	170ee8a2-3694-4aa3-a02b-aeba5f7c3a31	5	Outstanding work! Highly professional and efficient.	2025-12-04 02:26:55.173718+00
efde1e54-e220-489c-a14e-157a40326c68	db37aa58-bca7-4b37-9baf-3bb0c1dc92d6	a3563a32-75c5-4d0b-b672-9f548fe69a06	170ee8a2-3694-4aa3-a02b-aeba5f7c3a31	3	Good service overall. Met expectations.	2025-03-29 14:55:38.508118+00
a9c35594-d48c-41be-94f8-6cb06a232ad5	7599fc3f-c188-4ece-a6e3-afbe3195bb71	5fcd65e1-d364-4762-a7e2-9939ef039247	170ee8a2-3694-4aa3-a02b-aeba5f7c3a31	4	Good work done on time. Would recommend.	2025-09-19 05:09:58.332118+00
8196c514-d09f-4222-ba90-2adab5b20040	dfb7f0de-fc81-4958-bd5c-92bd46ae650b	9e61d17b-97a4-45e7-a26c-4fdc3086cdb7	3b4010dd-6e26-45f0-a020-8626a8357589	4	Good work done on time. Would recommend.	2025-06-15 21:50:47.714518+00
99f54b68-76a5-44e4-8d51-e57f6f9d0340	4737f301-12da-4ccc-92d9-8e0700d26e1b	6302ea1c-5af4-4302-918a-c87152175bae	3b4010dd-6e26-45f0-a020-8626a8357589	5	Outstanding work! Highly professional and efficient.	2025-08-10 22:44:06.069718+00
7950961b-7667-4de8-a6cd-4be74a5dcebf	cbb97b88-caa0-4467-ac6c-3718dc6d6e37	a3563a32-75c5-4d0b-b672-9f548fe69a06	3b4010dd-6e26-45f0-a020-8626a8357589	3	Good service overall. Met expectations.	2025-08-19 09:29:13.269718+00
f0dc726e-40c3-49f9-b2bf-0984c0d365e6	ae1a3eb7-1bd1-4056-ac7b-0fc66b8adeeb	5fcd65e1-d364-4762-a7e2-9939ef039247	3b4010dd-6e26-45f0-a020-8626a8357589	4	Good work done on time. Would recommend.	2025-09-03 09:30:47.186518+00
15921f44-63c5-4d43-8706-07a45081443d	9e124032-a2e0-49a4-b08d-f4afd29ea977	649a4947-627c-43f2-9c5e-b75f213a0d93	3b4010dd-6e26-45f0-a020-8626a8357589	5	Perfect! Exceeded my expectations.	2025-09-28 00:02:22.773718+00
3dc51c86-553a-4079-a5b8-05dcd83ba476	f812e27e-4ce5-4403-959e-2ed3be827c06	3c6ff2a2-e59e-48af-8a8e-9238dc49ecc6	3b4010dd-6e26-45f0-a020-8626a8357589	3	Good service overall. Met expectations.	2025-07-25 12:21:33.535318+00
0a7c8973-31bb-4074-b130-e23ae1f346b5	634a4b28-97bb-4df1-a78e-175c4f045d47	496d267d-f0aa-4592-a87a-bd69e1196f23	3b4010dd-6e26-45f0-a020-8626a8357589	4	Good work done on time. Would recommend.	2025-05-25 12:02:34.092118+00
7655bfea-5df2-45e0-8f30-b5e9bf246b00	9eb2fc47-9e27-4929-b386-cc80fd8273df	5c328f75-464c-4053-a41e-00fbc6eba934	3b4010dd-6e26-45f0-a020-8626a8357589	5	Very satisfied with the quality of work. Highly recommended!	2025-08-11 07:30:18.098518+00
91484bde-f9d6-4948-b4f3-168905a58ba2	9ddf93c6-4396-4635-92df-66d6415bbde6	5c328f75-464c-4053-a41e-00fbc6eba934	068750c2-3598-4ca7-b7f0-2d457def57ae	5	Very satisfied with the quality of work. Highly recommended!	2025-11-11 08:50:52.005718+00
7b90e16d-6e69-462a-bb20-6d3d52cc24e9	6761800a-a10d-49bd-bfcb-0d59a9d9cb48	bed6bf7a-bfbb-4eac-b6d7-35ca3e7d6660	068750c2-3598-4ca7-b7f0-2d457def57ae	3	Good service overall. Met expectations.	2025-07-25 15:51:12.338518+00
48558d96-7c0a-4ae7-8958-e80e5f04aa0c	4a6038b9-33d4-43e0-8d3a-1cafca0bd4e3	549f87d2-961e-48f8-bcff-7286d7db879e	068750c2-3598-4ca7-b7f0-2d457def57ae	4	Good work done on time. Would recommend.	2025-11-03 12:46:06.136918+00
834927b6-4d52-4ebc-9bab-f0db3bca4a18	a3119406-8f15-4317-965b-97ea90eb19eb	a8957421-6c24-4110-ad8a-89513c6cfe93	068750c2-3598-4ca7-b7f0-2d457def57ae	5	Excellent service! Will definitely hire again.	2025-07-10 14:42:05.570518+00
0b9caa84-7d9a-4870-a5d4-3c8405320436	4a44867a-d1ce-4afa-a7ae-a932c0aff1d0	ded07a3d-2dc7-40f1-a9df-81b72c989abf	068750c2-3598-4ca7-b7f0-2d457def57ae	3	Good service overall. Met expectations.	2025-11-28 00:21:03.468118+00
89817b88-c0f7-44f6-9565-e473e1393ea8	73f595c6-c91b-4b62-8764-4698b3fa4894	f74860cc-f981-42b4-809d-11e92bedd14f	15d2e617-64e9-40af-a836-b3d19a6dd3bb	4	Good work done on time. Would recommend.	2025-09-17 04:07:33.928918+00
b95da91d-7f47-4fae-8a3c-59bd8ebcfea2	e5f55f15-ff0e-4fb4-a246-de7b365992b7	d951675f-497c-4ccb-b55d-6a72f9cfb8fc	15d2e617-64e9-40af-a836-b3d19a6dd3bb	5	Perfect! Exceeded my expectations.	2025-07-28 10:07:36.952918+00
a0a8f739-790b-4460-82b5-a1e763642d5f	9bcaede5-c59f-4b16-889c-c61eb8616343	dd3b46e4-576f-488e-928f-a5a2688e0fd4	15d2e617-64e9-40af-a836-b3d19a6dd3bb	3	Good service overall. Met expectations.	2025-10-14 01:53:07.365718+00
2e116845-e07f-4e85-a5e0-3872af7c63d2	8f2f7aca-1fce-40e6-8c97-b2111885c09c	7d6e1a27-d7f8-445f-a544-81c817a39304	15d2e617-64e9-40af-a836-b3d19a6dd3bb	4	Good work done on time. Would recommend.	2025-04-18 15:13:27.276118+00
34d0c5c4-1826-4599-891e-4327ff1854b5	4183675e-3c07-4d1d-a954-789600a94ba3	088c7759-5ee8-4fd2-99fa-6d6953d6e99c	15d2e617-64e9-40af-a836-b3d19a6dd3bb	5	Very satisfied with the quality of work. Highly recommended!	2025-12-14 18:55:29.119318+00
39dfd798-8298-4f58-bddf-9258a6657d81	2b407e9e-dfcb-4fdd-ad0e-6e13f28760cc	ce930397-85a0-4a2c-9d12-343341780701	15d2e617-64e9-40af-a836-b3d19a6dd3bb	3	Good service overall. Met expectations.	2025-06-19 13:20:45.093718+00
a748af70-df87-453c-bd37-97170858c1b0	f08eec83-eaaf-42b5-baab-583127d353f0	2637c6dd-5fbe-487c-85c5-3ef87dc74cf5	15d2e617-64e9-40af-a836-b3d19a6dd3bb	4	Good work done on time. Would recommend.	2025-11-01 09:50:20.152918+00
94c90954-e934-438d-a700-fd2bb6b1d923	8ce12954-68ba-4577-8f60-f517a84a88d6	d4d09b07-6022-4d29-8d83-2905a67c2fb0	15d2e617-64e9-40af-a836-b3d19a6dd3bb	5	Excellent service! Will definitely hire again.	2025-10-05 12:37:29.551318+00
88ab8a08-a24c-4cf8-95d2-44a42c20b46b	ea4e200c-7d71-47c1-ae5a-0626035d36a3	9c0e3b56-4094-4a57-b207-abb436a8fe3d	15d2e617-64e9-40af-a836-b3d19a6dd3bb	3	Good service overall. Met expectations.	2025-12-17 04:16:15.439318+00
17ff318a-f078-4a0f-ba87-b8a81c53196c	8b8bad8e-6da6-4f84-b08f-6e2b76b6c4d2	6e0bbfe1-f2fd-4356-8684-bc8d8fb15a28	15d2e617-64e9-40af-a836-b3d19a6dd3bb	4	Good work done on time. Would recommend.	2025-08-30 02:53:30.376918+00
35b71ff8-b4dc-4925-b851-e39c52a571a0	1f7f52da-05cd-4679-8de0-84e74fa631ec	2f6a0b4d-ff98-443f-a347-bc1c2e867bf5	15d2e617-64e9-40af-a836-b3d19a6dd3bb	5	Outstanding work! Highly professional and efficient.	2025-06-28 10:22:23.244118+00
68ee3af7-e3c1-4f89-9f6a-75fb860e5e71	6c8b77e5-a0ea-4c5f-af4f-233245142d19	2637c6dd-5fbe-487c-85c5-3ef87dc74cf5	f04f5ddb-af57-4ae7-8a8c-ac18cf63f9f3	4	Good work done on time. Would recommend.	2025-10-06 06:33:19.941718+00
84acf101-11e6-4e78-8ccb-68cbf5d42213	fc385615-f22a-4d3b-ad3e-8491155c6b3e	d4d09b07-6022-4d29-8d83-2905a67c2fb0	f04f5ddb-af57-4ae7-8a8c-ac18cf63f9f3	5	Excellent service! Will definitely hire again.	2025-10-09 23:11:17.906518+00
6504f11d-25f4-40c4-a985-7a8f5896735c	80ba8489-032a-42d3-889e-a9f6885c000c	9c0e3b56-4094-4a57-b207-abb436a8fe3d	f04f5ddb-af57-4ae7-8a8c-ac18cf63f9f3	3	Good service overall. Met expectations.	2025-08-29 04:01:02.364118+00
fef34457-85a6-47fc-906c-0ff54f1da1fe	eed12e9c-91a8-48f5-9c51-a89a938bd36a	6e0bbfe1-f2fd-4356-8684-bc8d8fb15a28	f04f5ddb-af57-4ae7-8a8c-ac18cf63f9f3	4	Good work done on time. Would recommend.	2025-11-21 16:05:00.568918+00
74be7c45-54c5-4743-854d-79b9bd79bd59	ac1b7358-1eda-4059-8e5d-5c3fd6be229b	2f6a0b4d-ff98-443f-a347-bc1c2e867bf5	f04f5ddb-af57-4ae7-8a8c-ac18cf63f9f3	5	Outstanding work! Highly professional and efficient.	2025-04-17 06:32:22.831318+00
b07eb995-f11c-40e1-af2b-780e1a2f6cd7	e69bd3d9-f1db-489a-b595-96dce17665ab	c02b1823-7eec-4776-812e-b2a42402a542	f04f5ddb-af57-4ae7-8a8c-ac18cf63f9f3	3	Good service overall. Met expectations.	2025-08-22 15:10:44.584918+00
1a07ad01-0c7b-442c-bbda-f9907b1d9756	69883a29-5e0b-4b12-b5e3-0f1df8b65063	8568204d-bac8-4bd2-be49-666099493157	f04f5ddb-af57-4ae7-8a8c-ac18cf63f9f3	4	Good work done on time. Would recommend.	2025-07-16 22:56:51.400918+00
02b8fa12-b5fd-4819-b3a7-2f1276899da7	5f35ebf6-dc27-42c1-85e4-b225fe3fbb6b	3505bad0-2d27-427b-ae95-3169a5838fbf	f04f5ddb-af57-4ae7-8a8c-ac18cf63f9f3	5	Perfect! Exceeded my expectations.	2025-10-08 04:57:48.770518+00
bd4f794b-874c-4c9c-ac26-fbacbbcd72b7	80e40ea3-cf51-41ab-97b0-fdcec6a1c241	5be0cd9f-a466-4485-ac43-bdc4b104ecc0	f04f5ddb-af57-4ae7-8a8c-ac18cf63f9f3	3	Good service overall. Met expectations.	2025-07-23 23:05:26.517718+00
232ecda8-7ac3-4614-9517-ee1b47b50b2c	6a49e083-2606-4102-86ba-b318c9a372ed	3505bad0-2d27-427b-ae95-3169a5838fbf	e5d667b8-6cb8-470f-b72a-e91776ec2798	5	Perfect! Exceeded my expectations.	2025-12-02 11:02:39.592918+00
e5811311-9de4-497b-9209-b8c170578778	8d17b321-e75c-4e2d-9ed6-01b412169ad7	5be0cd9f-a466-4485-ac43-bdc4b104ecc0	e5d667b8-6cb8-470f-b72a-e91776ec2798	3	Good service overall. Met expectations.	2025-12-18 00:57:58.764118+00
b8f70350-aa18-4a2e-a6d5-b2c1c0b8e34c	0cefe255-a977-43fb-bcf6-cf99bb5dc907	ee82e0a0-0f37-4a6f-ae93-2113eddeb55c	e5d667b8-6cb8-470f-b72a-e91776ec2798	4	Good work done on time. Would recommend.	2025-07-19 11:02:18.684118+00
2cdd5f88-0a49-4bb5-a8c3-515850f4319b	1f84f930-569d-4e32-bf3f-28f0f95355d4	40ec397a-f1cf-4855-8a3a-c5673fb20e05	e5d667b8-6cb8-470f-b72a-e91776ec2798	5	Very satisfied with the quality of work. Highly recommended!	2025-09-15 02:42:01.423318+00
22671431-eb70-44b6-b349-6a4e4fdf76e2	4397e410-09a2-44b9-a85a-c6ca8ff91801	0897825a-ab99-41e9-98ba-b4ed822155a5	e5d667b8-6cb8-470f-b72a-e91776ec2798	3	Good service overall. Met expectations.	2025-06-05 08:17:23.464918+00
06aaeaf6-0904-4622-bdfc-6e3252068a0d	f59280ac-86ef-49c5-a633-8758bb6dbabc	b19b93f9-ccf5-4b17-bdcf-a105d11018af	e5d667b8-6cb8-470f-b72a-e91776ec2798	4	Good work done on time. Would recommend.	2025-06-21 06:39:26.536918+00
ea188381-44fc-4d33-878a-e26a39c7278c	667e9690-445b-4d99-a072-5fd386ba3153	97c5f2cc-ef11-452a-9aa3-b4705f3280f8	6eceabcf-8962-41b5-ae91-cd153cc581b9	3	Good service overall. Met expectations.	2025-05-27 21:29:02.728918+00
f60bf622-50f6-43d7-ae19-6728d91a5d79	22499737-de23-4354-b7d8-7d8516b73547	1be14a91-1b2c-48d6-8465-d1d4d12a785c	6eceabcf-8962-41b5-ae91-cd153cc581b9	4	Good work done on time. Would recommend.	2025-07-27 00:39:01.999318+00
8a585757-387e-462e-9f20-5fd60c779f61	8c8a8c12-44fd-4650-bed8-88013c92383b	4cfa17c8-4d9f-4283-97f2-3a4976248b91	6eceabcf-8962-41b5-ae91-cd153cc581b9	5	Outstanding work! Highly professional and efficient.	2025-05-07 14:14:17.272918+00
8d2aa69a-2fc0-468a-af14-28f1acfb673c	5aa58b75-5fa7-4f68-8873-89dddff31cab	57dfd528-5470-40a1-8fde-40eb61dd7ae1	6eceabcf-8962-41b5-ae91-cd153cc581b9	3	Good service overall. Met expectations.	2025-11-16 04:42:48.396118+00
e328ca73-0f7e-4059-b31e-1ddc7a21fba4	19d839e2-1891-4925-95f9-aff48868ce99	3cc9e6b9-d7d7-4d91-904b-65aeb230b14b	6eceabcf-8962-41b5-ae91-cd153cc581b9	4	Good work done on time. Would recommend.	2025-12-15 15:13:19.932118+00
58ce0f11-a41d-45a6-ba6a-789849c29ac8	b03519c0-47ca-4a2a-a20a-a866da2ec9dc	ff8bb61b-1117-4f5c-880b-ac4ebd7ea6c2	6eceabcf-8962-41b5-ae91-cd153cc581b9	5	Perfect! Exceeded my expectations.	2025-09-08 21:12:40.620118+00
3d826695-bc45-4232-9e14-f89ddc93f38d	ad431eb4-b573-463a-aab1-73de88130ea7	feaac7e1-3bc3-4462-b2f8-b4a19f990531	6eceabcf-8962-41b5-ae91-cd153cc581b9	3	Good service overall. Met expectations.	2025-10-27 01:18:03.784918+00
d9f15444-9a13-4cfc-9a35-03e69544bb94	eab2fa37-fab4-43ac-90b5-6c9959fd231d	8d3c4c94-5ab8-4070-a7cc-a12e88219bf3	6eceabcf-8962-41b5-ae91-cd153cc581b9	4	Good work done on time. Would recommend.	2025-08-01 23:47:05.464918+00
d7db66ac-1898-487e-a2ce-a72f6d1e394f	41b2a213-5c1c-4d10-9387-3d71ea865f2b	158e9458-44c9-4638-83b9-bf0c99bdb64a	6eceabcf-8962-41b5-ae91-cd153cc581b9	5	Very satisfied with the quality of work. Highly recommended!	2025-11-20 09:24:32.728918+00
6655bde1-4040-4b76-8393-5d8033c43af3	d7088fda-0935-4f50-b8f5-7970648990b6	503f2221-11c2-4415-9a5b-9b0e81e95b67	6eceabcf-8962-41b5-ae91-cd153cc581b9	3	Good service overall. Met expectations.	2025-05-11 05:13:24.050518+00
167c32d2-29c4-40b9-ba84-2ae952727df5	0b708249-b48f-47eb-9b1c-108280d905e4	5eae5e90-1914-41e5-be8a-aef4314d4892	6eceabcf-8962-41b5-ae91-cd153cc581b9	4	Good work done on time. Would recommend.	2025-03-29 14:16:40.783318+00
23f90eee-e658-4caa-928a-a640128275a9	c1423db8-4691-45d6-8015-9276edbc49e7	4893cb6b-0ffd-422a-b940-7b9201daa34f	6eceabcf-8962-41b5-ae91-cd153cc581b9	5	Excellent service! Will definitely hire again.	2025-05-16 03:34:41.244118+00
024d876b-1780-43d1-80ce-48a4662e2886	73a557c6-f71c-4042-a3ab-e1c4dda29528	218a9cdd-7d3a-44c9-bd7a-d885d38d6063	6eceabcf-8962-41b5-ae91-cd153cc581b9	3	Good service overall. Met expectations.	2025-12-06 09:26:40.946518+00
3e863c94-8044-42dc-9e8a-2f388d2564f8	488abd51-37b6-4749-acbf-b1f979eb3db6	8d3c4c94-5ab8-4070-a7cc-a12e88219bf3	60513923-0ed2-4d03-a195-f951c01708ef	4	Good work done on time. Would recommend.	2025-10-02 23:28:56.997718+00
de0ed34d-5fa2-40f5-ac7a-c885dbadf545	86c67a0c-17f0-4b31-97d1-fb237d5aa6e9	158e9458-44c9-4638-83b9-bf0c99bdb64a	60513923-0ed2-4d03-a195-f951c01708ef	5	Very satisfied with the quality of work. Highly recommended!	2025-05-08 20:40:25.346518+00
a3d1f455-78b7-45a2-a103-83d7978fc736	1463ffe3-8775-44de-a415-0d344e21f217	503f2221-11c2-4415-9a5b-9b0e81e95b67	60513923-0ed2-4d03-a195-f951c01708ef	3	Good service overall. Met expectations.	2025-09-01 13:58:34.476118+00
6dcf3ddb-0ebd-49c0-ba04-57782816029b	461086ca-1a61-4152-9895-893a05cb6c2f	5eae5e90-1914-41e5-be8a-aef4314d4892	60513923-0ed2-4d03-a195-f951c01708ef	4	Good work done on time. Would recommend.	2025-05-25 11:42:55.250518+00
aeb345f8-1b8c-4c11-9669-8b35ed8fc13c	cb1f0f1c-3eb2-4201-b713-116f32c20934	4893cb6b-0ffd-422a-b940-7b9201daa34f	60513923-0ed2-4d03-a195-f951c01708ef	5	Excellent service! Will definitely hire again.	2025-04-10 22:35:42.184918+00
e37bb56c-9002-45a9-a3b7-6a15298ae533	bc14bea0-d0a4-4a4b-8dcc-d828b55073b9	218a9cdd-7d3a-44c9-bd7a-d885d38d6063	60513923-0ed2-4d03-a195-f951c01708ef	3	Good service overall. Met expectations.	2025-09-28 07:40:40.005718+00
e9613a61-7c42-40f8-bf32-523130551a38	b8a062b4-3127-4e42-ae63-8a4022a55aed	4eea189c-607a-466d-8f92-1f53d790fb6f	60513923-0ed2-4d03-a195-f951c01708ef	4	Good work done on time. Would recommend.	2025-05-27 23:56:50.911318+00
a6803b06-3b08-4f3e-8c6f-476ced603533	c377c533-4d65-4eca-9194-a04daeafc36c	5c74fdb2-b4d9-4f4b-9c6c-f6b72854db84	60513923-0ed2-4d03-a195-f951c01708ef	5	Outstanding work! Highly professional and efficient.	2025-07-10 17:02:12.636118+00
7f1aaa29-d00c-4947-b04c-f7a4fc83573b	07a87066-44d3-4ced-83be-a68b4d3b3f5e	9e61d17b-97a4-45e7-a26c-4fdc3086cdb7	60513923-0ed2-4d03-a195-f951c01708ef	3	Good service overall. Met expectations.	2025-05-25 10:16:57.343318+00
b1dc381f-9887-4820-8cb7-5b2ba3d5b11f	114b7362-54b7-4e96-98d4-cd989c2d295c	6302ea1c-5af4-4302-918a-c87152175bae	60513923-0ed2-4d03-a195-f951c01708ef	4	Good work done on time. Would recommend.	2025-04-15 22:20:11.570518+00
b9845f8e-feed-4fcb-b7c1-8cb9a888b4d9	0753abe9-5a50-4be3-96d0-27ee33a1c822	5c74fdb2-b4d9-4f4b-9c6c-f6b72854db84	b5a8acc9-aae8-4a02-9c54-392273be2bed	5	Outstanding work! Highly professional and efficient.	2025-11-14 17:43:25.836118+00
29c09913-219a-4649-99ac-92e6209d9c3d	f77e81e7-fecd-47ff-81f6-d166eee6e302	9e61d17b-97a4-45e7-a26c-4fdc3086cdb7	b5a8acc9-aae8-4a02-9c54-392273be2bed	3	Good service overall. Met expectations.	2025-04-23 00:25:48.588118+00
17976e16-d67d-44b0-a222-9e97a12ef30e	0e7f9e7c-68c7-4046-af70-90bb7fd2a7a4	6302ea1c-5af4-4302-918a-c87152175bae	b5a8acc9-aae8-4a02-9c54-392273be2bed	4	Good work done on time. Would recommend.	2025-12-09 16:04:08.815318+00
67c969f5-a5c1-4428-a59b-db1db654e2fe	3e2f34ef-93c8-448c-824a-a2d9fea87b57	a3563a32-75c5-4d0b-b672-9f548fe69a06	b5a8acc9-aae8-4a02-9c54-392273be2bed	5	Perfect! Exceeded my expectations.	2025-06-17 06:53:48.895318+00
e6130907-d5e8-4a54-8ea4-85abc8c82d99	ec98bd59-48cd-4824-8cd1-5c094fb1492d	5fcd65e1-d364-4762-a7e2-9939ef039247	b5a8acc9-aae8-4a02-9c54-392273be2bed	3	Good service overall. Met expectations.	2025-04-07 03:57:39.237718+00
933d422f-362f-4c4b-9324-0ed5023afcf5	18f07078-70bb-45a6-98ee-880fce3a5a7b	649a4947-627c-43f2-9c5e-b75f213a0d93	b5a8acc9-aae8-4a02-9c54-392273be2bed	4	Good work done on time. Would recommend.	2025-07-11 14:59:30.751318+00
7e01d132-fd6d-451e-a719-f2bedbf6bf5e	1cba0b35-2882-4a5a-b2e8-1b1386b70168	3c6ff2a2-e59e-48af-8a8e-9238dc49ecc6	b5a8acc9-aae8-4a02-9c54-392273be2bed	5	Very satisfied with the quality of work. Highly recommended!	2025-07-11 04:50:30.981718+00
d8450ed9-5e5a-428e-a984-f9fc387a7949	6538e86e-4dc4-449b-89d9-eb65cfe5f9b3	496d267d-f0aa-4592-a87a-bd69e1196f23	3f72aef4-850b-401a-b6e2-b5524ee835e6	3	Good service overall. Met expectations.	2025-11-09 14:39:20.978518+00
64a94c39-d2db-44ae-b766-469599c3d881	4b693479-30e7-46c4-a568-a4734502248d	5c328f75-464c-4053-a41e-00fbc6eba934	3f72aef4-850b-401a-b6e2-b5524ee835e6	4	Good work done on time. Would recommend.	2025-12-08 18:45:35.724118+00
1cbdda85-b3a3-43b1-aba4-55c43aad0622	6b396a7b-a879-4767-976b-23a153e86ac6	bed6bf7a-bfbb-4eac-b6d7-35ca3e7d6660	3f72aef4-850b-401a-b6e2-b5524ee835e6	5	Excellent service! Will definitely hire again.	2025-11-10 22:06:08.479318+00
33ef218d-0294-473b-8af9-2fa53ca916b5	6085bfb2-e19a-4035-ae94-5cb6016657d8	549f87d2-961e-48f8-bcff-7286d7db879e	3f72aef4-850b-401a-b6e2-b5524ee835e6	3	Good service overall. Met expectations.	2025-05-21 00:39:42.434518+00
30a6b78d-3b47-4460-90df-7dbb852b1676	1454df26-3c7f-44b6-bba9-018499630634	216ebdf7-cd45-4b40-86f2-268b4e33bb68	d689dc1e-c670-4544-8c03-8056d6c54c47	5	Perfect! Exceeded my expectations.	2025-09-02 11:34:00.607318+00
69d63013-39b5-42fe-9adf-c44cf7046a0f	f7c70ee6-6eee-45be-9d4b-fc52773c798e	f74860cc-f981-42b4-809d-11e92bedd14f	d689dc1e-c670-4544-8c03-8056d6c54c47	3	Good service overall. Met expectations.	2025-06-06 17:25:57.199318+00
d0ef8b56-6407-4510-8069-bb5982d3e83d	935eb920-39f7-4334-acec-247489e36e6a	d951675f-497c-4ccb-b55d-6a72f9cfb8fc	d689dc1e-c670-4544-8c03-8056d6c54c47	4	Good work done on time. Would recommend.	2025-06-28 23:58:01.759318+00
beffb52c-c807-449f-92b8-aca5941adab9	3cb9cf09-ce2f-4e25-a590-00c3eadc2ffd	dd3b46e4-576f-488e-928f-a5a2688e0fd4	d689dc1e-c670-4544-8c03-8056d6c54c47	5	Very satisfied with the quality of work. Highly recommended!	2025-07-24 03:16:24.396118+00
8eb0308d-1a2a-4874-b0dd-ebaa6ccce6b0	d3c15113-773b-4505-b2d8-64cb504f7680	7d6e1a27-d7f8-445f-a544-81c817a39304	d689dc1e-c670-4544-8c03-8056d6c54c47	3	Good service overall. Met expectations.	2025-07-16 17:02:28.101718+00
07d72e9a-8b65-4d09-8980-d32df7580ea0	712b71fb-f029-4644-ac62-2d4dc7691329	088c7759-5ee8-4fd2-99fa-6d6953d6e99c	d689dc1e-c670-4544-8c03-8056d6c54c47	4	Good work done on time. Would recommend.	2025-09-09 11:21:43.960918+00
d94b1e7f-bc94-42fe-9a82-913a8481cfcd	15e22b0e-7e35-4754-9eee-891ab7f4a1d0	ce930397-85a0-4a2c-9d12-343341780701	d689dc1e-c670-4544-8c03-8056d6c54c47	5	Excellent service! Will definitely hire again.	2025-12-05 20:46:45.074518+00
9dd7cf61-a5c3-4fd8-9c38-4781a548ef7c	c7d1818e-4178-43ba-8881-bbca2e931391	2637c6dd-5fbe-487c-85c5-3ef87dc74cf5	d689dc1e-c670-4544-8c03-8056d6c54c47	3	Good service overall. Met expectations.	2025-08-05 20:58:24.482518+00
9d5daf48-3f17-4f3f-894e-a235c6dba53f	8478e779-a372-4f53-b6d8-09e75579b1f2	d4d09b07-6022-4d29-8d83-2905a67c2fb0	d689dc1e-c670-4544-8c03-8056d6c54c47	4	Good work done on time. Would recommend.	2025-10-12 16:42:38.546518+00
dac2e823-e133-4447-bf54-4d6963a94ac3	413196c1-aef7-4849-8279-d85813ef4451	9c0e3b56-4094-4a57-b207-abb436a8fe3d	d689dc1e-c670-4544-8c03-8056d6c54c47	5	Outstanding work! Highly professional and efficient.	2025-10-25 21:27:16.975318+00
937e5f87-c045-4ad6-8863-39b3453788a6	3f9125ec-aee3-491e-b240-998a278b1ab3	ce930397-85a0-4a2c-9d12-343341780701	772dd6aa-88ce-463c-af72-def381fe2dc3	5	Excellent service! Will definitely hire again.	2025-07-11 21:21:19.711318+00
2c62e417-ba13-4013-b97a-83deba18433e	5c8e3aa2-8d58-4aa8-81b5-2140c042b633	2637c6dd-5fbe-487c-85c5-3ef87dc74cf5	772dd6aa-88ce-463c-af72-def381fe2dc3	3	Good service overall. Met expectations.	2025-09-29 05:43:40.524118+00
bd5d5e9b-bb83-4acb-8e29-2d76c2bdbf36	5fed691e-1f80-46c0-9dda-e8badf2eee6d	d4d09b07-6022-4d29-8d83-2905a67c2fb0	772dd6aa-88ce-463c-af72-def381fe2dc3	4	Good work done on time. Would recommend.	2025-05-09 14:47:25.164118+00
46f05d51-a77f-443f-878c-614931c49b29	e3755ad3-68d0-4450-a352-e51fa9f736a1	9c0e3b56-4094-4a57-b207-abb436a8fe3d	772dd6aa-88ce-463c-af72-def381fe2dc3	5	Outstanding work! Highly professional and efficient.	2025-12-19 10:38:18.655318+00
b5541227-ac68-4383-9208-d61a828f0f3a	5d196a46-05f0-4cd0-bf52-7e18bf48eea0	6e0bbfe1-f2fd-4356-8684-bc8d8fb15a28	772dd6aa-88ce-463c-af72-def381fe2dc3	3	Good service overall. Met expectations.	2025-12-10 18:07:15.237718+00
ca76e000-4462-403e-bc25-a07692f21be5	3ce85573-90c7-4fdc-a7fe-f61938142902	2f6a0b4d-ff98-443f-a347-bc1c2e867bf5	772dd6aa-88ce-463c-af72-def381fe2dc3	4	Good work done on time. Would recommend.	2025-07-24 05:46:24.511318+00
e1a5cda3-230c-4650-9f48-a2a10d1b9ac5	253e1fd4-83f8-4460-aba4-1f84a54da0f6	c02b1823-7eec-4776-812e-b2a42402a542	772dd6aa-88ce-463c-af72-def381fe2dc3	5	Perfect! Exceeded my expectations.	2025-08-06 17:15:24.319318+00
19bc34f4-7329-4c19-9899-614880e9e125	97c9faad-3a8a-47b7-8749-5c3fc0a29228	8568204d-bac8-4bd2-be49-666099493157	772dd6aa-88ce-463c-af72-def381fe2dc3	3	Good service overall. Met expectations.	2025-11-12 13:01:29.839318+00
52671bfa-6fec-4a35-bb5f-71ec9a948568	1203a459-ce1d-4231-ad76-f44938c73ad4	8568204d-bac8-4bd2-be49-666099493157	875a1841-c516-4aff-8dec-7b29080e7902	3	Good service overall. Met expectations.	2025-09-23 15:53:56.239318+00
07cbbaf1-09c2-475a-9bae-2717eb29324f	40c307fa-d477-481e-94a0-b0506b3d8eb1	3505bad0-2d27-427b-ae95-3169a5838fbf	875a1841-c516-4aff-8dec-7b29080e7902	4	Good work done on time. Would recommend.	2025-04-06 03:07:40.898518+00
03975a48-4256-45fe-a2f9-c6db02895447	2e832741-b5e1-41d8-bc11-85a727902e77	5be0cd9f-a466-4485-ac43-bdc4b104ecc0	875a1841-c516-4aff-8dec-7b29080e7902	5	Very satisfied with the quality of work. Highly recommended!	2025-05-30 21:51:51.304918+00
db2d4580-3bdd-4730-be43-1cdacd3426a2	b44513c5-19c3-4081-9ba4-06bad5516344	ee82e0a0-0f37-4a6f-ae93-2113eddeb55c	875a1841-c516-4aff-8dec-7b29080e7902	3	Good service overall. Met expectations.	2025-07-07 04:00:06.722518+00
d0ffe62c-4d9d-4f68-a198-b5b1cb7c4e47	bf62ec08-de85-4fc0-afd6-5d3079fac55a	40ec397a-f1cf-4855-8a3a-c5673fb20e05	875a1841-c516-4aff-8dec-7b29080e7902	4	Good work done on time. Would recommend.	2025-11-28 10:28:55.068118+00
74e6a4d5-b559-449e-a3e8-26e8e4be046d	64e8d670-eec6-430d-9d09-f355cec9fc66	97c5f2cc-ef11-452a-9aa3-b4705f3280f8	28cffd4f-2d69-4667-9c34-dd0f1c365c93	5	Outstanding work! Highly professional and efficient.	2025-07-21 19:08:19.288918+00
8549a6e8-f67c-4f57-b7d3-5563cc9b55d5	5ab75691-931a-4ab7-acf2-92a0081588b2	1be14a91-1b2c-48d6-8465-d1d4d12a785c	28cffd4f-2d69-4667-9c34-dd0f1c365c93	3	Good service overall. Met expectations.	2025-11-06 09:56:15.775318+00
e0d775c7-cc12-48ac-a5eb-648cc305f7aa	c7d84623-af1e-4182-85be-d8db8878ade9	4cfa17c8-4d9f-4283-97f2-3a4976248b91	28cffd4f-2d69-4667-9c34-dd0f1c365c93	4	Good work done on time. Would recommend.	2025-04-09 19:09:45.343318+00
0b7307c6-8f51-4500-bb98-b23acc435d6d	3e9f2e84-c3c6-46f9-b220-910465704d10	57dfd528-5470-40a1-8fde-40eb61dd7ae1	28cffd4f-2d69-4667-9c34-dd0f1c365c93	5	Perfect! Exceeded my expectations.	2025-06-18 12:33:48.453718+00
18ea6345-32eb-4083-a7ba-efac50b9cda1	be15407c-724f-4d6a-a4b5-2be353a006b2	3cc9e6b9-d7d7-4d91-904b-65aeb230b14b	28cffd4f-2d69-4667-9c34-dd0f1c365c93	3	Good service overall. Met expectations.	2025-12-12 07:11:25.999318+00
e09dd4f7-07b4-4006-abe8-05ee8b510bf4	638d8818-9680-4e12-bedf-d33c64013a73	ff8bb61b-1117-4f5c-880b-ac4ebd7ea6c2	28cffd4f-2d69-4667-9c34-dd0f1c365c93	4	Good work done on time. Would recommend.	2025-07-04 21:21:49.778518+00
b1f92235-8ef9-4e25-9035-fc87a2228e64	dc2894cb-cdfb-4fe2-9023-387d63c045a1	feaac7e1-3bc3-4462-b2f8-b4a19f990531	28cffd4f-2d69-4667-9c34-dd0f1c365c93	5	Very satisfied with the quality of work. Highly recommended!	2025-06-18 05:32:28.591318+00
9c803612-f638-4d92-b4c4-a585c6bcfd0b	ab453d9b-800d-46bc-bd82-21b91f3b0176	8d3c4c94-5ab8-4070-a7cc-a12e88219bf3	28cffd4f-2d69-4667-9c34-dd0f1c365c93	3	Good service overall. Met expectations.	2025-10-01 23:29:12.808918+00
1353bfb9-d929-4027-8e7a-0fc7788dd564	fc70125f-d1a9-4be7-a04a-098e745091de	158e9458-44c9-4638-83b9-bf0c99bdb64a	28cffd4f-2d69-4667-9c34-dd0f1c365c93	4	Good work done on time. Would recommend.	2025-07-27 20:11:42.271318+00
12fa5cec-9db9-47aa-871b-fc236d9ca256	455a817c-b48f-4a39-8018-d3c1984853b0	503f2221-11c2-4415-9a5b-9b0e81e95b67	28cffd4f-2d69-4667-9c34-dd0f1c365c93	5	Excellent service! Will definitely hire again.	2025-04-24 14:03:52.514518+00
f3eda843-5b9e-489c-a867-afbbb8bd2214	c69b2bcc-ac3a-449e-b7dc-9382f8f3058e	5eae5e90-1914-41e5-be8a-aef4314d4892	28cffd4f-2d69-4667-9c34-dd0f1c365c93	3	Good service overall. Met expectations.	2025-03-26 00:37:15.208918+00
155459f4-51bf-4b33-b1eb-a4ea4f9beeaa	af118f7f-93b3-448a-8251-995e08f19ae0	feaac7e1-3bc3-4462-b2f8-b4a19f990531	29cfad14-d90e-4a79-9b31-d0b2e8d69036	5	Very satisfied with the quality of work. Highly recommended!	2025-08-11 18:57:50.296918+00
e41790ee-8400-46c5-836b-7bfee7826ddb	9a5b369a-9fdc-4b2f-846c-7234cbb7e60b	8d3c4c94-5ab8-4070-a7cc-a12e88219bf3	29cfad14-d90e-4a79-9b31-d0b2e8d69036	3	Good service overall. Met expectations.	2025-05-02 07:28:51.698518+00
0080e3c0-58ee-4ad9-8298-cb1bda90fee7	187b31a3-b1d2-4145-aae3-5d0ae6451ec7	158e9458-44c9-4638-83b9-bf0c99bdb64a	29cfad14-d90e-4a79-9b31-d0b2e8d69036	4	Good work done on time. Would recommend.	2025-11-18 18:47:36.597718+00
7298accc-567c-4a65-ad49-272b760e7431	3d3e4f88-83f5-460f-964b-3710f9ac956c	503f2221-11c2-4415-9a5b-9b0e81e95b67	29cfad14-d90e-4a79-9b31-d0b2e8d69036	5	Excellent service! Will definitely hire again.	2025-05-02 21:52:51.612118+00
6a71ebba-20e3-4de3-87c3-4f8f5c00ddd6	877555f9-dc99-4102-9d83-7395f69faa20	5eae5e90-1914-41e5-be8a-aef4314d4892	29cfad14-d90e-4a79-9b31-d0b2e8d69036	3	Good service overall. Met expectations.	2025-04-24 08:48:07.759318+00
5cc90b61-fd9a-4c05-afd6-801cc1c74947	10ce1149-cb56-4760-9e7b-ac9e4b77d900	4893cb6b-0ffd-422a-b940-7b9201daa34f	29cfad14-d90e-4a79-9b31-d0b2e8d69036	4	Good work done on time. Would recommend.	2025-10-19 12:09:42.981718+00
093a798e-5084-4edf-9278-89ee4ec2b9d3	33bd7d79-2791-4cb4-af4c-37f8d015961f	218a9cdd-7d3a-44c9-bd7a-d885d38d6063	29cfad14-d90e-4a79-9b31-d0b2e8d69036	5	Outstanding work! Highly professional and efficient.	2025-06-26 18:01:23.503318+00
11fd9511-2d2a-48cf-b32e-36a72e0cbb55	26e51825-7c3a-4bcb-af0f-21a699d8d9fb	4eea189c-607a-466d-8f92-1f53d790fb6f	29cfad14-d90e-4a79-9b31-d0b2e8d69036	3	Good service overall. Met expectations.	2025-08-14 08:23:59.090518+00
b1d54f6b-5da2-479b-83fc-ff80e2cddd45	04443efa-8688-4c39-9be6-0a7444eb5359	5c74fdb2-b4d9-4f4b-9c6c-f6b72854db84	29cfad14-d90e-4a79-9b31-d0b2e8d69036	4	Good work done on time. Would recommend.	2025-09-09 18:54:31.058518+00
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.roles (id, level, name, created_at, deleted_at) FROM stdin;
f3e7850a-f16c-4e5a-a5b8-cc9a1a701658	1	admin	2025-12-19 23:10:20.043736+00	\N
3f5105d5-1e2b-4d81-a2fa-a8715da339e2	2	worker	2025-12-19 23:10:39.148152+00	\N
17fcd032-5209-4c11-86ff-872810fc2208	3	user	2025-12-19 23:19:12.770776+00	\N
\.


--
-- Data for Name: spatial_ref_sys; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.spatial_ref_sys (srid, auth_name, auth_srid, srtext, proj4text) FROM stdin;
\.


--
-- Data for Name: user_presence; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.user_presence (id, user_id, last_seen, is_online) FROM stdin;
27f19add-672e-4165-9d6e-71c71eaeb715	26e02acd-4f32-4619-b25d-dc8273db7df6	2025-12-19 20:35:45.585741+00	t
829a5a89-d32f-4dc1-aad2-c0cb3db30c7a	daf2b506-ab68-4768-8088-8c513172906b	2025-12-19 22:35:46.148906+00	f
521e6ae4-1cab-400b-ab2a-ac528a6e2b39	c2881953-2ba8-4258-b661-5cd2f4e212d5	2025-12-19 23:15:52.518267+00	f
e28837e3-2204-4fec-baeb-8896a64cd0a0	862bf73b-5359-4061-9312-c7c9bcb54dc9	2025-12-19 21:30:15.886852+00	t
37dda35d-ca14-4eb5-9cce-598dd9ca8d5c	34228761-bcf2-4ff3-bfd1-f65d3d050d2b	2025-12-19 21:04:50.943529+00	f
c1df318e-b6a1-4591-bdf6-fccd9abfcb91	b0d0319f-3ccd-4386-978e-e8243923db36	2025-12-19 20:48:50.131085+00	f
126298ec-b254-42f4-a959-d816315f5bea	8730c98e-607b-491b-ba1a-ec47f577da1c	2025-12-19 20:58:17.036789+00	t
661d8e0c-58eb-488a-bcb0-f591ca788bba	59676f81-363d-4b81-81a8-326f11304145	2025-12-19 21:07:25.591113+00	f
e6494162-85e3-448b-92ca-90fc40b3e66a	d2e65c84-18ae-4b35-ae87-78a3ab244754	2025-12-19 20:29:51.764988+00	f
51698693-7fd1-4fd0-9563-a6ecaffae5f5	cf981ea0-ea50-476e-aae6-96e103cfb358	2025-12-19 22:52:19.139802+00	f
b5fc4ae4-a0cf-4c97-8d0e-f79cea2f7dad	25ecace8-49ad-4af9-b1aa-97352291eb02	2025-12-19 21:18:48.397071+00	t
6b0c3420-d896-4ab1-8548-db66193109a9	d1be4162-b83a-400e-9a30-07f3b2bf2f37	2025-12-19 22:41:32.19787+00	f
2b5f2670-ab11-43cd-a50b-8f58101f679a	6a3724bd-1757-4b94-be45-5650c4cbc84a	2025-12-19 23:22:56.889112+00	f
f9621283-b599-4e2a-af88-6f3d39da36fa	2abd59e7-f229-4457-9b4f-05dd7ff9f950	2025-12-19 21:11:19.253589+00	t
cf21c958-f926-4cae-8d6d-151d541c0181	f2252c07-5c2c-4dee-8cb4-9475115c59ca	2025-12-19 21:30:13.065874+00	f
a120f3c4-89d1-450f-8889-31e994b0cf33	86ad7fd4-80f1-4376-af0b-29926fdf3944	2025-12-19 21:36:31.213413+00	f
fc114696-0cab-46b4-bb2f-f67b9142c09e	aeef5a83-d194-4ab2-bc0e-0b8d59c3f9d6	2025-12-19 22:21:04.881965+00	t
ccb26259-e732-4e3a-840d-10cc75f80a92	5eaabc8f-02e6-43e3-a7e1-7c223c8fee9d	2025-12-19 21:46:59.298204+00	f
950f9db8-7342-4763-9220-3c23c9095e67	f237dee0-b324-4b4f-8a56-e51c8dfe7941	2025-12-19 20:50:23.818373+00	f
066c257c-1adf-4174-99ed-b393e50e4caa	6905635d-7e04-460d-8734-d8cfede31a47	2025-12-19 22:45:47.154742+00	f
25a0204f-0a7d-4ad9-802c-50ee5971f120	ce45455d-4356-4250-b920-27e2a9a6acd3	2025-12-19 22:13:48.381403+00	t
4bf4a422-0157-4b44-bb46-a27b4f455a4f	307faedf-c25e-4493-a483-60960460ef13	2025-12-19 20:54:04.567361+00	f
24a029e9-20d7-43ea-8895-21926dff5442	eaa4b66d-41c3-4990-a1e8-9570f25a2a90	2025-12-19 22:56:14.979226+00	f
f7352392-13a5-4cd4-8695-401cf5269a63	c3542c4f-23e1-4df8-bcab-3b5aace21c7b	2025-12-19 22:17:53.960347+00	t
5ce3b35d-aeca-4cb8-9da7-a4e5b2974e88	2fafc06b-a809-4acc-b9ce-ea53779d48d4	2025-12-19 23:19:51.343405+00	f
5af41df5-8ec5-46fa-b755-aa8fbed9f86d	81610da5-f9ae-444a-953d-05db70defdf5	2025-12-19 22:45:09.970713+00	f
be988614-0af2-48a7-8411-a00811d1fed4	43fc2e10-b7f4-497d-8e3e-3cc3504b607d	2025-12-19 22:46:51.888277+00	t
0a2d8941-4422-4a18-b436-24a6308bfd1b	78a4aadd-b865-4eb6-80a7-48519d0e2ba2	2025-12-19 20:55:07.034797+00	f
9f04edb5-e737-4387-b7ef-175c120fc68e	41ecd97e-ef9c-4a81-8261-126c4d90cdc4	2025-12-19 21:34:20.110721+00	f
9b893368-9af7-4800-8dd9-ae393a18832a	7624d68c-87c9-454d-8a81-b9e04a9835d5	2025-12-19 21:59:28.464205+00	f
1f9a27c5-d8bc-4d1d-bd52-900070138d4d	8dfa85c7-8db4-4f2e-ae73-1cdbce4cf8d8	2025-12-19 21:16:18.083543+00	t
68003fad-976c-4bf0-8e88-97fe29ff32d9	66916789-7b07-40f9-9df7-57c432205d9e	2025-12-19 22:19:24.13123+00	f
6fe68d38-46a1-42c8-96df-72d19d10268f	68824670-6c5d-4812-8fee-2070bcdbc90c	2025-12-19 22:43:13.080651+00	f
651604d3-9e0a-4aed-807d-6baeebde5bb2	29fa14c5-4010-4b58-bfd0-8740da9910b6	2025-12-19 21:16:35.564316+00	t
fbd55d84-ccf8-496a-a09d-08a052180a33	60e71417-59da-467f-9aa2-ee6d86187a69	2025-12-19 21:15:51.520209+00	f
32a2c3c9-28ad-4e1d-bc03-cea697ad8605	b77c81a6-a8a9-42e0-acc8-ce1ce2d92bf7	2025-12-19 20:37:31.354865+00	f
1cc43b19-5c40-44d5-8ff9-a085dabef6e5	8dfa3373-45d8-448e-a3b5-4d1dfec4ba2f	2025-12-19 21:06:10.118886+00	t
39fb6c05-9022-4ec8-ac60-bdb82f0459f6	5f5145a0-1827-46fd-b44f-6b2a7170d6a9	2025-12-19 23:14:51.133766+00	f
3f601173-93a1-48b2-be9b-1d361d685c2e	bf42a091-8815-4f72-bf8d-6f3bdb13e3c6	2025-12-19 20:37:18.265267+00	f
04a69801-9a0a-4c2a-8e41-8df6b26a78cd	ad584595-9c2b-4d07-ad8c-59481f88ac28	2025-12-19 22:33:01.131456+00	f
041a4b27-7328-46ef-aec3-b85584b61059	44aa15b3-b26c-4a83-b592-91adddfc9f9a	2025-12-19 20:30:37.521226+00	t
329ab89c-db4b-4c89-a806-7b6ba77e7cd4	63c0a431-ca11-4691-96b4-900155ce869b	2025-12-19 21:25:30.280168+00	f
dfe9a6e6-4884-4cbb-b43e-c37b0196dd0b	5b57cd3c-d7ec-4e25-83a9-20bcadbb2f1c	2025-12-19 21:29:17.976607+00	f
e9d7c95b-569f-456e-ba09-14e129e963f6	247b80be-b7dc-4582-aa28-5dd8888d8c53	2025-12-19 21:16:13.922301+00	t
f1c53201-bbcd-436d-b30e-b6afe6b8ef6d	7affa09f-b335-4d36-81e3-0a179279fc69	2025-12-19 20:52:59.189556+00	f
4736a0ee-1d21-483c-b540-3c7b20ea6db0	96fe7dab-91ec-4c51-a775-a406572da480	2025-12-19 21:33:36.059837+00	f
307d8728-64ac-4ddb-bca6-1a2aaa39451d	7c681db7-cff1-40e6-b38b-79919297ca90	2025-12-19 22:12:28.841113+00	t
5e30d276-3684-409d-90cf-d35e6e6c55c0	b4f1941c-0fd5-43f9-ba92-40fc055c11c8	2025-12-19 23:00:54.034358+00	f
770c2fbd-3757-4b42-8831-040162039c3d	ccc0cbbb-a469-4e83-a5ca-259f2b1acce2	2025-12-19 20:35:43.001118+00	f
3370e0a7-2bc5-4a77-a78b-a16fc92045cd	21007243-551a-49f7-8df4-d188ad7e6244	2025-12-19 22:05:06.247059+00	f
b137b629-2373-4a0c-8a52-1e2eb7193f6d	8d2d4afc-beef-44d3-8628-428dcebdf008	2025-12-19 22:33:06.593132+00	t
18892971-6b09-44b3-9d6a-6cdbdf23cab0	6f9859a4-f31c-4445-becd-04934b9b4677	2025-12-19 21:28:27.044164+00	f
a4f8f81a-b083-4f7f-8fde-7d6b562d7ba8	e4b6d247-223e-4032-bb0e-949dc97f052c	2025-12-19 23:02:14.507301+00	f
145fa7bc-e35d-4e24-96b1-ea1facf8210f	99b0b1ec-e1fb-4c44-a35e-2f14fd03e819	2025-12-19 20:32:25.728071+00	t
7570c202-bf15-4c8f-92cb-c6df37568049	90c8bc6d-8bfd-46c0-aca0-528cb60346ff	2025-12-19 22:48:10.584809+00	f
a07d7e85-8d10-4e98-8d92-68e8a54ba40c	ffdae030-82ae-435b-a1a4-10ecbd39dd6b	2025-12-19 22:48:02.718694+00	f
7a14de5c-04cf-4fae-ba0a-4fef94ddbf1c	96eaea48-f243-41e6-8c5c-db8c475a5dcd	2025-12-19 22:41:57.271593+00	t
81ab4da2-d3da-4966-a9b7-0e2b6d5ecc29	170ee8a2-3694-4aa3-a02b-aeba5f7c3a31	2025-12-19 22:09:43.255968+00	f
56196de4-e521-4c73-9491-57f6ab4a2581	3b4010dd-6e26-45f0-a020-8626a8357589	2025-12-19 23:00:50.366592+00	f
9f45ab12-22d7-4c75-8742-05bd1359ef71	068750c2-3598-4ca7-b7f0-2d457def57ae	2025-12-19 22:27:15.447661+00	f
49a5898c-7330-4d0a-a54c-090ac56d4d5d	15d2e617-64e9-40af-a836-b3d19a6dd3bb	2025-12-19 21:57:11.955961+00	t
fb7b4721-a758-4a0d-b3a6-74c08910895b	f04f5ddb-af57-4ae7-8a8c-ac18cf63f9f3	2025-12-19 22:28:07.555981+00	f
834dd74e-f808-41a9-9d6b-d88a4480a3c7	e5d667b8-6cb8-470f-b72a-e91776ec2798	2025-12-19 23:04:38.956089+00	f
4bac7a37-be56-4cc1-ad4c-a0bc63d64e0d	6eceabcf-8962-41b5-ae91-cd153cc581b9	2025-12-19 21:10:36.418854+00	t
e9dae658-153a-470d-892e-4cbda2acfa44	60513923-0ed2-4d03-a195-f951c01708ef	2025-12-19 21:08:04.321967+00	f
e933f392-a97d-4585-8496-0b380e08f029	b5a8acc9-aae8-4a02-9c54-392273be2bed	2025-12-19 22:58:02.825794+00	f
494f3e60-af87-49c3-a26a-a6d735779bc8	3f72aef4-850b-401a-b6e2-b5524ee835e6	2025-12-19 23:05:29.133221+00	t
4d262b29-713c-42fb-b351-e58b2ddc12ae	d689dc1e-c670-4544-8c03-8056d6c54c47	2025-12-19 20:47:33.456565+00	f
97ddd6fb-ff6f-4032-bdd1-bf0335335af2	772dd6aa-88ce-463c-af72-def381fe2dc3	2025-12-19 22:23:58.8885+00	f
e769205a-eebb-45ca-a184-70cec6e3c66e	875a1841-c516-4aff-8dec-7b29080e7902	2025-12-19 22:33:01.157227+00	f
aa9e6720-b8e1-436e-acce-cc70df8da080	28cffd4f-2d69-4667-9c34-dd0f1c365c93	2025-12-19 20:29:21.55021+00	t
47e19cc5-37b9-49be-b10a-c79fef5e695a	29cfad14-d90e-4a79-9b31-d0b2e8d69036	2025-12-19 21:29:13.106373+00	f
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, firstname, lastname, profile_pic_url, bio, status, created_at, deleted_at, city, state, latitude, longitude, location, role_id, role) FROM stdin;
d9608c69-ca9e-447b-b362-e34f96f4710f	System	Administrator	\N	Platform administrator with full system access and management capabilities.	active	2025-12-19 23:23:46.303318+00	\N	Manila	Metro Manila	\N	\N	\N	2	1
97c5f2cc-ef11-452a-9aa3-b4705f3280f8	Carmen	Perez	\N	Customer from Manila looking for quality home services.	active	2025-03-13 21:10:46.658518+00	\N	Manila	Metro Manila	14.59561777	120.97937359	0101000020E61000006EE7900EAE3E5E400622F6CFF4302D40	2	3
1be14a91-1b2c-48d6-8465-d1d4d12a785c	Jose	Bautista	\N	Customer from Quezon City looking for quality home services.	active	2025-05-12 14:58:42.194518+00	\N	Quezon City	Metro Manila	14.71065350	121.03314929	0101000020E6100000E11B331E1F425E406C938AC6DA6B2D40	2	3
4cfa17c8-4d9f-4283-97f2-3a4976248b91	Elena	Castro	\N	Customer from Makati looking for quality home services.	active	2024-05-02 22:48:37.884118+00	\N	Makati	Metro Manila	14.55217518	121.03724028	0101000020E6100000692C0E2562425E409D8687B4B61A2D40	2	3
57dfd528-5470-40a1-8fde-40eb61dd7ae1	Pedro	Mendoza	\N	Customer from Taguig looking for quality home services.	active	2024-07-17 20:35:52.668118+00	\N	Taguig	Metro Manila	14.52075025	121.01104746	0101000020E6100000D9D96700B5405E408544DAC69F0A2D40	2	3
3cc9e6b9-d7d7-4d91-904b-65aeb230b14b	Teresa	Aquino	\N	Customer from Pasig looking for quality home services.	active	2025-01-01 10:09:22.015318+00	\N	Pasig	Metro Manila	14.53868124	121.09463347	0101000020E610000073B08A790E465E4097890907CE132D40	2	3
ff8bb61b-1117-4f5c-880b-ac4ebd7ea6c2	Miguel	Rivera	\N	Customer from Cebu City looking for quality home services.	active	2024-03-27 05:52:37.154518+00	\N	Cebu City	Cebu	10.33458877	123.85455501	0101000020E61000004F257F07B1F65E408A8421384FAB2440	2	3
feaac7e1-3bc3-4462-b2f8-b4a19f990531	Patricia	Lopez	\N	Customer from Mandaue City looking for quality home services.	active	2025-08-19 09:14:21.448918+00	\N	Mandaue City	Cebu	10.32982844	123.96075940	0101000020E6100000C694FE147DFD5E40702EF645DFA82440	2	3
8d3c4c94-5ab8-4070-a7cc-a12e88219bf3	Carlos	Ramos	\N	Customer from Lapu-Lapu looking for quality home services.	active	2025-08-14 09:56:44.200918+00	\N	Lapu-Lapu	Cebu	10.30212188	123.91555141	0101000020E61000006EF0F06498FA5E40170314B8AF9A2440	2	3
158e9458-44c9-4638-83b9-bf0c99bdb64a	Laura	Santos	\N	Customer from Davao City looking for quality home services.	active	2024-01-09 09:42:20.632918+00	\N	Davao City	Davao del Sur	7.18833238	125.41653641	0101000020E6100000C5A25488A85A5F40EA821334DAC01C40	2	3
503f2221-11c2-4415-9a5b-9b0e81e95b67	Luis	Gonzales	\N	Customer from Cagayan de Oro looking for quality home services.	active	2025-04-23 18:06:25.298518+00	\N	Cagayan de Oro	Misamis Oriental	8.44100744	124.66024991	0101000020E6100000C4A8D688412A5F40742F28BACBE12040	2	3
5eae5e90-1914-41e5-be8a-aef4314d4892	Maria	Cruz	\N	Customer from Iloilo City looking for quality home services.	active	2024-06-29 03:16:44.440918+00	\N	Iloilo City	Iloilo	10.74045284	122.55253709	0101000020E610000021D886C45CA35E40860F78A21C7B2540	2	3
4893cb6b-0ffd-422a-b940-7b9201daa34f	Antonio	Sanchez	\N	Customer from Baguio looking for quality home services.	active	2024-05-31 12:00:11.013718+00	\N	Baguio	Benguet	16.40376971	120.58584517	0101000020E6100000DA6ABD7C7E255E40BE90A3735D673040	2	3
218a9cdd-7d3a-44c9-bd7a-d885d38d6063	Ana	Garcia	\N	Customer from Manila looking for quality home services.	active	2024-02-04 01:56:30.924118+00	\N	Manila	Metro Manila	14.60788462	120.94818872	0101000020E610000083B5BD1FAF3C5E40644825A73C372D40	2	3
4eea189c-607a-466d-8f92-1f53d790fb6f	Francisco	Morales	\N	Customer from Quezon City looking for quality home services.	active	2024-08-01 15:22:55.874518+00	\N	Quezon City	Metro Manila	14.67567823	121.01639497	0101000020E610000002FE7C9D0C415E4037F0387FF2592D40	2	3
5c74fdb2-b4d9-4f4b-9c6c-f6b72854db84	Sofia	Torres	\N	Customer from Makati looking for quality home services.	active	2025-07-11 11:21:53.205718+00	\N	Makati	Metro Manila	14.55572063	121.00503173	0101000020E6100000B5F29A7052405E400220176A871C2D40	2	3
9e61d17b-97a4-45e7-a26c-4fdc3086cdb7	Manuel	Villanueva	\N	Customer from Taguig looking for quality home services.	active	2024-01-25 01:52:02.824918+00	\N	Taguig	Metro Manila	14.48259747	121.08029479	0101000020E6100000B545C28C23455E408F90FD0317F72C40	2	3
6302ea1c-5af4-4302-918a-c87152175bae	Isabel	Fernandez	\N	Customer from Pasig looking for quality home services.	active	2025-10-12 07:48:00.904918+00	\N	Pasig	Metro Manila	14.61301430	121.05505064	0101000020E6100000219B1EF385435E40EEF5A402DD392D40	2	3
a3563a32-75c5-4d0b-b672-9f548fe69a06	Jorge	Hernandez	\N	Customer from Cebu City looking for quality home services.	active	2025-09-13 18:40:26.584918+00	\N	Cebu City	Cebu	10.31738822	123.86914830	0101000020E6100000F0F73020A0F75E40411272B580A22440	2	3
5fcd65e1-d364-4762-a7e2-9939ef039247	Rosa	Flores	\N	Customer from Mandaue City looking for quality home services.	active	2023-12-22 20:11:49.528918+00	\N	Mandaue City	Cebu	10.34007823	123.94876301	0101000020E6100000B0E67C88B8FC5E40F6DCD7BB1EAE2440	2	3
649a4947-627c-43f2-9c5e-b75f213a0d93	Juan	Reyes	\N	Customer from Lapu-Lapu looking for quality home services.	active	2025-10-13 05:59:43.624918+00	\N	Lapu-Lapu	Cebu	10.31620847	123.94739673	0101000020E6100000FDEBE425A2FC5E4084BC9A13E6A12440	2	3
3c6ff2a2-e59e-48af-8a8e-9238dc49ecc6	Carmen	Perez	\N	Customer from Davao City looking for quality home services.	active	2025-09-28 20:34:02.335318+00	\N	Davao City	Davao del Sur	7.21596185	125.45283409	0101000020E610000017C4D53BFB5C5F4011BC6B1A25DD1C40	2	3
496d267d-f0aa-4592-a87a-bd69e1196f23	Jose	Bautista	\N	Customer from Cagayan de Oro looking for quality home services.	active	2025-12-17 13:59:47.224918+00	\N	Cagayan de Oro	Misamis Oriental	8.44774013	124.63365009	0101000020E6100000146A1BB98D285F40E0E9BE313EE52040	2	3
5c328f75-464c-4053-a41e-00fbc6eba934	Elena	Castro	\N	Customer from Iloilo City looking for quality home services.	active	2024-03-21 07:45:37.221718+00	\N	Iloilo City	Iloilo	10.69743125	122.57969783	0101000020E6100000615AEDC419A55E40B3EA73B515652540	2	3
bed6bf7a-bfbb-4eac-b6d7-35ca3e7d6660	Pedro	Mendoza	\N	Customer from Baguio looking for quality home services.	active	2024-04-02 01:01:05.042518+00	\N	Baguio	Benguet	16.38536797	120.59516230	0101000020E6100000FA939D2317265E406F13AC79A7623040	2	3
549f87d2-961e-48f8-bcff-7286d7db879e	Teresa	Aquino	\N	Customer from Manila looking for quality home services.	active	2025-01-31 23:47:21.362518+00	\N	Manila	Metro Manila	14.57760242	120.99108911	0101000020E6100000CBB704016E3F5E401DFB1F81BB272D40	2	3
a8957421-6c24-4110-ad8a-89513c6cfe93	Miguel	Rivera	\N	Customer from Quezon City looking for quality home services.	active	2025-09-19 20:05:59.436118+00	\N	Quezon City	Metro Manila	14.67620284	121.00805963	0101000020E610000025D1890C84405E404F863642375A2D40	2	3
ded07a3d-2dc7-40f1-a9df-81b72c989abf	Patricia	Lopez	\N	Customer from Makati looking for quality home services.	active	2025-09-11 18:19:34.044118+00	\N	Makati	Metro Manila	14.54644915	120.99207335	0101000020E6100000EC5E38217E3F5E40A05AD82EC8172D40	2	3
f97cfaac-5a4e-420a-a445-9776c13600b8	Carlos	Ramos	\N	Customer from Taguig looking for quality home services.	active	2024-10-11 14:29:51.948118+00	\N	Taguig	Metro Manila	14.47816981	121.07429267	0101000020E6100000E2FE0A36C1445E40E2C45FACD2F42C40	2	3
2594b276-c01e-4543-b2b5-0cd20667b7a6	Laura	Santos	\N	Customer from Pasig looking for quality home services.	active	2025-07-28 03:51:51.650518+00	\N	Pasig	Metro Manila	14.54206018	121.07888242	0101000020E61000004788D9680C455E40B42073E988152D40	2	3
216ebdf7-cd45-4b40-86f2-268b4e33bb68	Luis	Gonzales	\N	Customer from Cebu City looking for quality home services.	active	2024-04-17 08:08:36.597718+00	\N	Cebu City	Cebu	10.31532399	123.92301741	0101000020E6100000AC659DB712FB5E407263612572A12440	2	3
f74860cc-f981-42b4-809d-11e92bedd14f	Maria	Cruz	\N	Customer from Mandaue City looking for quality home services.	active	2025-05-01 13:41:14.392918+00	\N	Mandaue City	Cebu	10.30939089	123.94473613	0101000020E6100000C66C878E76FC5E40EE75947B689E2440	2	3
d951675f-497c-4ccb-b55d-6a72f9cfb8fc	Antonio	Sanchez	\N	Customer from Lapu-Lapu looking for quality home services.	active	2025-05-01 02:33:26.133718+00	\N	Lapu-Lapu	Cebu	10.30526281	123.97190789	0101000020E61000008F9126BD33FE5E40274533684B9C2440	2	3
dd3b46e4-576f-488e-928f-a5a2688e0fd4	Ana	Garcia	\N	Customer from Davao City looking for quality home services.	active	2025-02-27 11:53:22.428118+00	\N	Davao City	Davao del Sur	7.20200762	125.46484530	0101000020E6100000C14C8006C05D5F406CC5E515DBCE1C40	2	3
7d6e1a27-d7f8-445f-a544-81c817a39304	Francisco	Morales	\N	Customer from Cagayan de Oro looking for quality home services.	active	2025-10-26 22:39:34.255318+00	\N	Cagayan de Oro	Misamis Oriental	8.45533213	124.61450566	0101000020E61000000B3A8C0F54275F400756FE4A21E92040	2	3
088c7759-5ee8-4fd2-99fa-6d6953d6e99c	Sofia	Torres	\N	Customer from Iloilo City looking for quality home services.	active	2025-01-25 14:17:59.925718+00	\N	Iloilo City	Iloilo	10.75288338	122.54421092	0101000020E6100000ABE1095AD4A25E40989A2DEE79812540	2	3
ce930397-85a0-4a2c-9d12-343341780701	Manuel	Villanueva	\N	Customer from Baguio looking for quality home services.	active	2025-12-01 23:14:38.959318+00	\N	Baguio	Benguet	16.37764753	120.61435978	0101000020E6100000FAC4AEAB51275E40E3C32E82AD603040	2	3
2637c6dd-5fbe-487c-85c5-3ef87dc74cf5	Isabel	Fernandez	\N	Customer from Manila looking for quality home services.	active	2024-10-17 18:35:00.597718+00	\N	Manila	Metro Manila	14.57207270	121.01792602	0101000020E610000070692DB325415E406CDE82B6E6242D40	2	3
d4d09b07-6022-4d29-8d83-2905a67c2fb0	Jorge	Hernandez	\N	Customer from Quezon City looking for quality home services.	active	2024-06-02 20:16:00.952918+00	\N	Quezon City	Metro Manila	14.65359270	121.06616767	0101000020E6100000F6AC52173C445E4006CFCEB3A34E2D40	2	3
9c0e3b56-4094-4a57-b207-abb436a8fe3d	Rosa	Flores	\N	Customer from Makati looking for quality home services.	active	2025-05-10 23:14:17.877718+00	\N	Makati	Metro Manila	14.54544499	121.03042490	0101000020E6100000FB9E477BF2415E4054A2D39044172D40	2	3
6e0bbfe1-f2fd-4356-8684-bc8d8fb15a28	Juan	Reyes	\N	Customer from Taguig looking for quality home services.	active	2024-11-12 15:23:47.368918+00	\N	Taguig	Metro Manila	14.48333565	121.02921762	0101000020E61000007C9794B3DE415E40587B33C577F72C40	2	3
2f6a0b4d-ff98-443f-a347-bc1c2e867bf5	Carmen	Perez	\N	Customer from Pasig looking for quality home services.	active	2025-08-15 10:35:15.573718+00	\N	Pasig	Metro Manila	14.58890070	121.09982111	0101000020E6100000A0B9147863465E40DA2E7E64842D2D40	2	3
c02b1823-7eec-4776-812e-b2a42402a542	Jose	Bautista	\N	Customer from Cebu City looking for quality home services.	active	2024-06-26 22:21:36.328918+00	\N	Cebu City	Cebu	10.35540060	123.86271758	0101000020E610000031F2CBC336F75E4022F54311F7B52440	2	3
8568204d-bac8-4bd2-be49-666099493157	Elena	Castro	\N	Customer from Mandaue City looking for quality home services.	active	2024-09-07 00:39:12.799318+00	\N	Mandaue City	Cebu	10.36008003	123.95884756	0101000020E6100000290328C25DFD5E40DD95E1685CB82440	2	3
3505bad0-2d27-427b-ae95-3169a5838fbf	Pedro	Mendoza	\N	Customer from Lapu-Lapu looking for quality home services.	active	2025-01-02 23:05:10.879318+00	\N	Lapu-Lapu	Cebu	10.32446520	123.97120386	0101000020E6100000BC1C3C3428FE5E4055617D4D20A62440	2	3
5be0cd9f-a466-4485-ac43-bdc4b104ecc0	Teresa	Aquino	\N	Customer from Davao City looking for quality home services.	active	2025-10-10 11:22:31.826518+00	\N	Davao City	Davao del Sur	7.17135022	125.42273910	0101000020E6100000644F4C280E5B5F40E73F9C6E76AF1C40	2	3
ee82e0a0-0f37-4a6f-ae93-2113eddeb55c	Miguel	Rivera	\N	Customer from Cagayan de Oro looking for quality home services.	active	2025-10-11 10:17:44.776918+00	\N	Cagayan de Oro	Misamis Oriental	8.49379912	124.66452985	0101000020E6100000CF3D35A8872A5F401D63FE3CD3FC2040	2	3
40ec397a-f1cf-4855-8a3a-c5673fb20e05	Patricia	Lopez	\N	Customer from Iloilo City looking for quality home services.	active	2024-08-08 09:18:03.583318+00	\N	Iloilo City	Iloilo	10.75509770	122.56024968	0101000020E6100000724C7921DBA35E40D4916D2A9C822540	2	3
0897825a-ab99-41e9-98ba-b4ed822155a5	Carlos	Ramos	\N	Customer from Baguio looking for quality home services.	active	2024-09-20 10:23:35.733718+00	\N	Baguio	Benguet	16.40523041	120.56738725	0101000020E6100000B6BA9C1250245E40704B1E2EBD673040	2	3
b19b93f9-ccf5-4b17-bdcf-a105d11018af	Laura	Santos	\N	Customer from Manila looking for quality home services.	active	2024-04-09 08:20:49.528918+00	\N	Manila	Metro Manila	14.63163026	120.97289172	0101000020E6100000C0FCA1DB433E5E405BBA9B0A65432D40	2	3
6fc15c3f-2c63-4a80-b499-3744ac6c5e0a	Luis	Gonzales	\N	Customer from Quezon City looking for quality home services.	active	2025-09-30 09:10:05.618518+00	\N	Quezon City	Metro Manila	14.65883446	121.03573486	0101000020E6100000BDC1DD7A49425E400B5B16C052512D40	2	3
26e02acd-4f32-4619-b25d-dc8273db7df6	Isabel	Fernandez	\N	Professional Locksmith with 15 years of experience serving Manila and surrounding areas. Committed to quality work and customer satisfaction.	active	2024-11-22 01:08:20.930518+00	\N	Manila	Metro Manila	14.61148617	120.97995050	0101000020E6100000BA4C4D82B73E5E406C361CB714392D40	2	2
daf2b506-ab68-4768-8088-8c513172906b	Francisco	Morales	\N	Professional Landscaper with 4 years of experience serving Quezon City and surrounding areas. Committed to quality work and customer satisfaction.	active	2023-10-28 17:35:49.039318+00	\N	Quezon City	Metro Manila	14.68852836	121.02906584	0101000020E6100000C50EF836DC415E40142309CA86602D40	2	2
c2881953-2ba8-4258-b661-5cd2f4e212d5	Maria	Cruz	\N	Professional Painter with 11 years of experience serving Makati and surrounding areas. Committed to quality work and customer satisfaction.	active	2024-03-21 21:26:24.789718+00	\N	Makati	Metro Manila	14.57350149	121.00461044	0101000020E61000004A4196894B405E40B983BFFCA1252D40	2	2
862bf73b-5359-4061-9312-c7c9bcb54dc9	Carlos	Ramos	\N	Professional Plumber with 18 years of experience serving Taguig and surrounding areas. Committed to quality work and customer satisfaction.	active	2023-05-06 12:25:53.080918+00	\N	Taguig	Metro Manila	14.54852616	121.07584246	0101000020E61000004956559ADA445E40A366BC6BD8182D40	2	2
34228761-bcf2-4ff3-bfd1-f65d3d050d2b	Teresa	Aquino	\N	Professional Handyman with 7 years of experience serving Pasig and surrounding areas. Committed to quality work and customer satisfaction.	active	2024-06-17 00:24:05.685718+00	\N	Pasig	Metro Manila	14.61557753	121.05275914	0101000020E61000005E37DF6760435E4042015FFA2C3B2D40	2	2
b0d0319f-3ccd-4386-978e-e8243923db36	Jose	Bautista	\N	Professional Carpenter with 14 years of experience serving Cebu City and surrounding areas. Committed to quality work and customer satisfaction.	active	2025-04-07 22:06:34.744918+00	\N	Cebu City	Cebu	10.29217586	123.91776696	0101000020E610000028A3A1B1BCFA5E40E8C2061398952440	2	2
8730c98e-607b-491b-ba1a-ec47f577da1c	Rosa	Flores	\N	Professional Electrician with 3 years of experience serving Mandaue City and surrounding areas. Committed to quality work and customer satisfaction.	active	2024-02-03 09:58:17.599318+00	\N	Mandaue City	Cebu	10.31962604	123.92945279	0101000020E6100000760E8E277CFB5E40FE7F3906A6A32440	2	2
59676f81-363d-4b81-81a8-326f11304145	Manuel	Villanueva	\N	Professional Roofer with 10 years of experience serving Lapu-Lapu and surrounding areas. Committed to quality work and customer satisfaction.	active	2024-02-03 18:37:47.263318+00	\N	Lapu-Lapu	Cebu	10.32493331	123.97471319	0101000020E6100000E9816EB361FE5E407DA9A7A85DA62440	2	2
d2e65c84-18ae-4b35-ae87-78a3ab244754	Ana	Garcia	\N	Professional HVAC Technician with 17 years of experience serving Davao City and surrounding areas. Committed to quality work and customer satisfaction.	active	2023-12-21 01:17:31.644118+00	\N	Davao City	Davao del Sur	7.16823263	125.44330940	0101000020E61000009AC0632E5F5C5F405AE1AF2C45AC1C40	2	2
cf981ea0-ea50-476e-aae6-96e103cfb358	Luis	Gonzales	\N	Professional Cleaner with 6 years of experience serving Cagayan de Oro and surrounding areas. Committed to quality work and customer satisfaction.	active	2024-10-26 01:20:03.880918+00	\N	Cagayan de Oro	Misamis Oriental	8.41955026	124.66029164	0101000020E6100000D2E7DD37422A5F40E374AB4ACFD62040	2	2
25ecace8-49ad-4af9-b1aa-97352291eb02	Patricia	Lopez	\N	Professional Locksmith with 13 years of experience serving Iloilo City and surrounding areas. Committed to quality work and customer satisfaction.	active	2023-01-29 06:20:07.048918+00	\N	Iloilo City	Iloilo	10.71371574	122.58554011	0101000020E61000008FBC397D79A55E4081E143266C6D2540	2	2
d1be4162-b83a-400e-9a30-07f3b2bf2f37	Pedro	Mendoza	\N	Professional Landscaper with 2 years of experience serving Baguio and surrounding areas. Committed to quality work and customer satisfaction.	active	2025-12-18 08:38:05.205718+00	\N	Baguio	Benguet	16.38674624	120.61189435	0101000020E6100000DC76EB4629275E40A6A634CD01633040	2	2
6a3724bd-1757-4b94-be45-5650c4cbc84a	Carmen	Perez	\N	Professional Painter with 9 years of experience serving Manila and surrounding areas. Committed to quality work and customer satisfaction.	active	2023-01-29 22:15:52.284118+00	\N	Manila	Metro Manila	14.57607335	121.02167782	0101000020E6100000B5FC5D2B63415E40BFB10C16F3262D40	2	2
2abd59e7-f229-4457-9b4f-05dd7ff9f950	Jorge	Hernandez	\N	Professional Plumber with 16 years of experience serving Quezon City and surrounding areas. Committed to quality work and customer satisfaction.	active	2025-10-30 05:46:00.837718+00	\N	Quezon City	Metro Manila	14.64514166	121.00403516	0101000020E6100000FC0EB01C42405E406CF9F501504A2D40	2	2
f2252c07-5c2c-4dee-8cb4-9475115c59ca	Sofia	Torres	\N	Professional Handyman with 5 years of experience serving Makati and surrounding areas. Committed to quality work and customer satisfaction.	active	2025-01-02 12:01:09.592918+00	\N	Makati	Metro Manila	14.58044758	120.99238496	0101000020E6100000810F353C833F5E40E148DA6C30292D40	2	2
86ad7fd4-80f1-4376-af0b-29926fdf3944	Antonio	Sanchez	\N	Professional Carpenter with 12 years of experience serving Taguig and surrounding areas. Committed to quality work and customer satisfaction.	active	2025-10-12 18:26:40.082518+00	\N	Taguig	Metro Manila	14.52477199	121.09032062	0101000020E61000007C4323D0C7455E404DD00DEAAE0C2D40	2	2
aeef5a83-d194-4ab2-bc0e-0b8d59c3f9d6	Laura	Santos	\N	Professional Electrician with 19 years of experience serving Pasig and surrounding areas. Committed to quality work and customer satisfaction.	active	2025-09-08 05:21:27.544918+00	\N	Pasig	Metro Manila	14.58884728	121.10989635	0101000020E6100000C94CB38A08475E408AE003647D2D2D40	2	2
5eaabc8f-02e6-43e3-a7e1-7c223c8fee9d	Miguel	Rivera	\N	Professional Roofer with 8 years of experience serving Cebu City and surrounding areas. Committed to quality work and customer satisfaction.	active	2025-04-06 04:38:39.391318+00	\N	Cebu City	Cebu	10.28314711	123.86985774	0101000020E61000003D5ECCBFABF75E4057D072A8F8902440	2	2
f237dee0-b324-4b4f-8a56-e51c8dfe7941	Elena	Castro	\N	Professional HVAC Technician with 15 years of experience serving Mandaue City and surrounding areas. Committed to quality work and customer satisfaction.	active	2025-12-10 19:13:38.968918+00	\N	Mandaue City	Cebu	10.34534386	123.89154487	0101000020E610000043E436120FF95E40182611E9D0B02440	2	2
6905635d-7e04-460d-8734-d8cfede31a47	Juan	Reyes	\N	Professional Cleaner with 4 years of experience serving Lapu-Lapu and surrounding areas. Committed to quality work and customer satisfaction.	active	2023-04-18 11:19:56.738518+00	\N	Lapu-Lapu	Cebu	10.30320293	123.93846698	0101000020E610000075DECED70FFC5E4081CD186A3D9B2440	2	2
ce45455d-4356-4250-b920-27e2a9a6acd3	Isabel	Fernandez	\N	Professional Locksmith with 11 years of experience serving Davao City and surrounding areas. Committed to quality work and customer satisfaction.	active	2025-08-03 00:33:43.788118+00	\N	Davao City	Davao del Sur	7.18729663	125.44487395	0101000020E6100000E98596D0785C5F40090112B0CABF1C40	2	2
307faedf-c25e-4493-a483-60960460ef13	Francisco	Morales	\N	Professional Landscaper with 18 years of experience serving Cagayan de Oro and surrounding areas. Committed to quality work and customer satisfaction.	active	2023-05-30 14:35:07.653718+00	\N	Cagayan de Oro	Misamis Oriental	8.45068549	124.64778197	0101000020E6100000A905824275295F40D9A9A03FC0E62040	2	2
eaa4b66d-41c3-4990-a1e8-9570f25a2a90	Maria	Cruz	\N	Professional Painter with 7 years of experience serving Iloilo City and surrounding areas. Committed to quality work and customer satisfaction.	active	2024-10-25 07:37:28.543318+00	\N	Iloilo City	Iloilo	10.70387706	122.53240484	0101000020E61000000E02C0EB12A25E409235F29262682540	2	2
c3542c4f-23e1-4df8-bcab-3b5aace21c7b	Carlos	Ramos	\N	Professional Plumber with 14 years of experience serving Baguio and surrounding areas. Committed to quality work and customer satisfaction.	active	2024-08-30 07:58:19.096918+00	\N	Baguio	Benguet	16.36708667	120.57403530	0101000020E6100000F90F8EFEBC245E4092725A64F95D3040	2	2
2fafc06b-a809-4acc-b9ce-ea53779d48d4	Teresa	Aquino	\N	Professional Handyman with 3 years of experience serving Manila and surrounding areas. Committed to quality work and customer satisfaction.	active	2023-05-13 09:06:09.055318+00	\N	Manila	Metro Manila	14.62881371	120.97297039	0101000020E6100000B0419925453E5E40EE73DFDEF3412D40	2	2
81610da5-f9ae-444a-953d-05db70defdf5	Jose	Bautista	\N	Professional Carpenter with 10 years of experience serving Quezon City and surrounding areas. Committed to quality work and customer satisfaction.	active	2024-06-29 22:41:43.164118+00	\N	Quezon City	Metro Manila	14.66850056	121.05435852	0101000020E61000002C6A289C7A435E40891D95B445562D40	2	2
43fc2e10-b7f4-497d-8e3e-3cc3504b607d	Rosa	Flores	\N	Professional Electrician with 17 years of experience serving Makati and surrounding areas. Committed to quality work and customer satisfaction.	active	2025-10-22 22:22:31.624918+00	\N	Makati	Metro Manila	14.53016090	121.03846098	0101000020E61000006AD10A2576425E40613CDE3F710F2D40	2	2
78a4aadd-b865-4eb6-80a7-48519d0e2ba2	Manuel	Villanueva	\N	Professional Roofer with 6 years of experience serving Taguig and surrounding areas. Committed to quality work and customer satisfaction.	active	2023-10-21 04:56:33.170518+00	\N	Taguig	Metro Manila	14.55460606	121.02827481	0101000020E61000000A102641CF415E4011BA5353F51B2D40	2	2
41ecd97e-ef9c-4a81-8261-126c4d90cdc4	Ana	Garcia	\N	Professional HVAC Technician with 13 years of experience serving Pasig and surrounding areas. Committed to quality work and customer satisfaction.	active	2024-02-26 21:52:14.546518+00	\N	Pasig	Metro Manila	14.55628489	121.08106154	0101000020E6100000DBD0BD1C30455E40309E835FD11C2D40	2	2
7624d68c-87c9-454d-8a81-b9e04a9835d5	Luis	Gonzales	\N	Professional Cleaner with 2 years of experience serving Cebu City and surrounding areas. Committed to quality work and customer satisfaction.	active	2024-05-29 05:29:04.168918+00	\N	Cebu City	Cebu	10.30457613	123.87928826	0101000020E61000003B1D444246F85E4007FC0A67F19B2440	2	2
8dfa85c7-8db4-4f2e-ae73-1cdbce4cf8d8	Patricia	Lopez	\N	Professional Locksmith with 9 years of experience serving Mandaue City and surrounding areas. Committed to quality work and customer satisfaction.	active	2023-04-29 03:28:27.045718+00	\N	Mandaue City	Cebu	10.32221788	123.92933941	0101000020E61000005F35014C7AFB5E40AA92F1BDF9A42440	2	2
66916789-7b07-40f9-9df7-57c432205d9e	Pedro	Mendoza	\N	Professional Landscaper with 16 years of experience serving Lapu-Lapu and surrounding areas. Committed to quality work and customer satisfaction.	active	2025-02-22 13:18:26.767318+00	\N	Lapu-Lapu	Cebu	10.29483639	123.96295160	0101000020E61000006068BFFFA0FD5E40007199CBF4962440	2	2
68824670-6c5d-4812-8fee-2070bcdbc90c	Carmen	Perez	\N	Professional Painter with 5 years of experience serving Davao City and surrounding areas. Committed to quality work and customer satisfaction.	active	2023-07-01 22:06:03.813718+00	\N	Davao City	Davao del Sur	7.17694064	125.48980101	0101000020E6100000DBDF55E6585F5F40828858ED2FB51C40	2	2
29fa14c5-4010-4b58-bfd0-8740da9910b6	Jorge	Hernandez	\N	Professional Plumber with 12 years of experience serving Cagayan de Oro and surrounding areas. Committed to quality work and customer satisfaction.	active	2025-10-14 15:11:33.746518+00	\N	Cagayan de Oro	Misamis Oriental	8.46356799	124.65303305	0101000020E6100000423D224BCB295F407F0B99C858ED2040	2	2
60e71417-59da-467f-9aa2-ee6d86187a69	Sofia	Torres	\N	Professional Handyman with 19 years of experience serving Iloilo City and surrounding areas. Committed to quality work and customer satisfaction.	active	2024-04-24 23:27:44.421718+00	\N	Iloilo City	Iloilo	10.75650722	122.57601453	0101000020E6100000BB170C6CDDA45E40FE2C12EA54832540	2	2
b77c81a6-a8a9-42e0-acc8-ce1ce2d92bf7	Antonio	Sanchez	\N	Professional Carpenter with 8 years of experience serving Baguio and surrounding areas. Committed to quality work and customer satisfaction.	active	2023-05-27 12:55:16.159318+00	\N	Baguio	Benguet	16.38647259	120.56326684	0101000020E6100000292E5C900C245E40B5D91EDEEF623040	2	2
8dfa3373-45d8-448e-a3b5-4d1dfec4ba2f	Laura	Santos	\N	Professional Electrician with 15 years of experience serving Manila and surrounding areas. Committed to quality work and customer satisfaction.	active	2025-05-24 00:48:22.821718+00	\N	Manila	Metro Manila	14.56215613	120.98936643	0101000020E61000000F2793C7513F5E401D31A3EDD21F2D40	2	2
5f5145a0-1827-46fd-b44f-6b2a7170d6a9	Miguel	Rivera	\N	Professional Roofer with 4 years of experience serving Quezon City and surrounding areas. Committed to quality work and customer satisfaction.	active	2023-08-08 08:35:42.472918+00	\N	Quezon City	Metro Manila	14.64841259	121.01826377	0101000020E610000082B6CD3B2B415E40B4BA28BCFC4B2D40	2	2
bf42a091-8815-4f72-bf8d-6f3bdb13e3c6	Elena	Castro	\N	Professional HVAC Technician with 11 years of experience serving Makati and surrounding areas. Committed to quality work and customer satisfaction.	active	2023-11-16 04:55:07.893718+00	\N	Makati	Metro Manila	14.55434406	121.06364543	0101000020E6100000F31848C412445E401DDD10FCD21B2D40	2	2
ad584595-9c2b-4d07-ad8c-59481f88ac28	Juan	Reyes	\N	Professional Cleaner with 18 years of experience serving Taguig and surrounding areas. Committed to quality work and customer satisfaction.	active	2023-04-02 14:42:19.394518+00	\N	Taguig	Metro Manila	14.49919830	121.01545514	0101000020E6100000BA368E37FD405E40067069EB96FF2C40	2	2
44aa15b3-b26c-4a83-b592-91adddfc9f9a	Isabel	Fernandez	\N	Professional Locksmith with 7 years of experience serving Pasig and surrounding areas. Committed to quality work and customer satisfaction.	active	2023-06-04 09:02:53.618518+00	\N	Pasig	Metro Manila	14.57565795	121.06319649	0101000020E610000068714A690B445E4064DD89A3BC262D40	2	2
63c0a431-ca11-4691-96b4-900155ce869b	Francisco	Morales	\N	Professional Landscaper with 14 years of experience serving Cebu City and surrounding areas. Committed to quality work and customer satisfaction.	active	2023-07-17 09:51:24.866518+00	\N	Cebu City	Cebu	10.33996754	123.90283972	0101000020E610000082BB3F20C8F95E40CE00B43910AE2440	2	2
5b57cd3c-d7ec-4e25-83a9-20bcadbb2f1c	Maria	Cruz	\N	Professional Painter with 3 years of experience serving Mandaue City and surrounding areas. Committed to quality work and customer satisfaction.	active	2024-11-26 23:39:45.516118+00	\N	Mandaue City	Cebu	10.33138854	123.92070982	0101000020E61000006380E1E8ECFA5E406D233BC2ABA92440	2	2
247b80be-b7dc-4582-aa28-5dd8888d8c53	Carlos	Ramos	\N	Professional Plumber with 10 years of experience serving Lapu-Lapu and surrounding areas. Committed to quality work and customer satisfaction.	active	2025-01-22 09:25:59.042518+00	\N	Lapu-Lapu	Cebu	10.31931242	123.96287840	0101000020E61000009681B9CC9FFD5E409636E2EA7CA32440	2	2
7affa09f-b335-4d36-81e3-0a179279fc69	Teresa	Aquino	\N	Professional Handyman with 17 years of experience serving Davao City and surrounding areas. Committed to quality work and customer satisfaction.	active	2023-03-21 20:27:09.343318+00	\N	Davao City	Davao del Sur	7.17752173	125.41664393	0101000020E6100000535B4D4BAA5A5F40A5B7A241C8B51C40	2	2
96fe7dab-91ec-4c51-a775-a406572da480	Jose	Bautista	\N	Professional Carpenter with 6 years of experience serving Cagayan de Oro and surrounding areas. Committed to quality work and customer satisfaction.	active	2023-02-15 18:27:29.676118+00	\N	Cagayan de Oro	Misamis Oriental	8.43134339	124.59446587	0101000020E61000003E8F93BA0B265F40A3CA720AD9DC2040	2	2
7c681db7-cff1-40e6-b38b-79919297ca90	Rosa	Flores	\N	Professional Electrician with 13 years of experience serving Iloilo City and surrounding areas. Committed to quality work and customer satisfaction.	active	2023-04-15 14:02:36.655318+00	\N	Iloilo City	Iloilo	10.70484611	122.56044778	0101000020E6100000D08D5D60DEA35E405D53DE96E1682540	2	2
b4f1941c-0fd5-43f9-ba92-40fc055c11c8	Manuel	Villanueva	\N	Professional Roofer with 2 years of experience serving Baguio and surrounding areas. Committed to quality work and customer satisfaction.	active	2024-02-27 14:40:03.314518+00	\N	Baguio	Benguet	16.38759768	120.59079515	0101000020E6100000ABF87596CF255E40009BFF9939633040	2	2
ccc0cbbb-a469-4e83-a5ca-259f2b1acce2	Ana	Garcia	\N	Professional HVAC Technician with 9 years of experience serving Manila and surrounding areas. Committed to quality work and customer satisfaction.	active	2024-07-18 06:03:38.978518+00	\N	Manila	Metro Manila	14.62726177	120.98664658	0101000020E6100000DB73B237253F5E40B65C687428412D40	2	2
21007243-551a-49f7-8df4-d188ad7e6244	Luis	Gonzales	\N	Professional Cleaner with 16 years of experience serving Quezon City and surrounding areas. Committed to quality work and customer satisfaction.	active	2023-08-12 21:12:57.986518+00	\N	Quezon City	Metro Manila	14.65215190	121.04861375	0101000020E6100000B398D87C1C435E406C0C95DAE64D2D40	2	2
8d2d4afc-beef-44d3-8628-428dcebdf008	Patricia	Lopez	\N	Professional Locksmith with 5 years of experience serving Makati and surrounding areas. Committed to quality work and customer satisfaction.	active	2024-03-21 07:29:08.805718+00	\N	Makati	Metro Manila	14.57149801	120.98669300	0101000020E61000004C8C65FA253F5E40B05B1D639B242D40	2	2
6f9859a4-f31c-4445-becd-04934b9b4677	Pedro	Mendoza	\N	Professional Landscaper with 12 years of experience serving Taguig and surrounding areas. Committed to quality work and customer satisfaction.	active	2023-08-26 08:01:48.876118+00	\N	Taguig	Metro Manila	14.54422238	121.07307358	0101000020E61000004E13CF3CAD445E40DCB3D750A4162D40	2	2
e4b6d247-223e-4032-bb0e-949dc97f052c	Carmen	Perez	\N	Professional Painter with 19 years of experience serving Pasig and surrounding areas. Committed to quality work and customer satisfaction.	active	2023-09-18 02:57:08.796118+00	\N	Pasig	Metro Manila	14.54690761	121.06991320	0101000020E6100000C2E3367579445E405DC4354604182D40	2	2
99b0b1ec-e1fb-4c44-a35e-2f14fd03e819	Jorge	Hernandez	\N	Professional Plumber with 8 years of experience serving Cebu City and surrounding areas. Committed to quality work and customer satisfaction.	active	2023-10-22 20:44:48.866518+00	\N	Cebu City	Cebu	10.35237028	123.90613340	0101000020E61000000DB4F116FEF95E405F5D99E069B42440	2	2
90c8bc6d-8bfd-46c0-aca0-528cb60346ff	Sofia	Torres	\N	Professional Handyman with 15 years of experience serving Mandaue City and surrounding areas. Committed to quality work and customer satisfaction.	active	2024-03-12 21:54:19.394518+00	\N	Mandaue City	Cebu	10.34649307	123.92711076	0101000020E6100000107E5EC855FB5E409BE1278A67B12440	2	2
ffdae030-82ae-435b-a1a4-10ecbd39dd6b	Antonio	Sanchez	\N	Professional Carpenter with 4 years of experience serving Lapu-Lapu and surrounding areas. Committed to quality work and customer satisfaction.	active	2025-09-10 21:06:07.068118+00	\N	Lapu-Lapu	Cebu	10.28610281	123.98721046	0101000020E610000006FEC7742EFF5E40C67C48117C922440	2	2
96eaea48-f243-41e6-8c5c-db8c475a5dcd	Laura	Santos	\N	Professional Electrician with 11 years of experience serving Davao City and surrounding areas. Committed to quality work and customer satisfaction.	active	2023-12-27 12:38:44.978518+00	\N	Davao City	Davao del Sur	7.20397833	125.46401178	0101000020E6100000C303775EB25D5F4052C501B2DFD01C40	2	2
170ee8a2-3694-4aa3-a02b-aeba5f7c3a31	Miguel	Rivera	\N	Professional Roofer with 18 years of experience serving Cagayan de Oro and surrounding areas. Committed to quality work and customer satisfaction.	active	2024-01-23 06:05:19.807318+00	\N	Cagayan de Oro	Misamis Oriental	8.43133623	124.61739753	0101000020E6100000CCFEED7083275F4020DC321AD8DC2040	2	2
3b4010dd-6e26-45f0-a020-8626a8357589	Elena	Castro	\N	Professional HVAC Technician with 7 years of experience serving Iloilo City and surrounding areas. Committed to quality work and customer satisfaction.	active	2025-08-21 13:51:42.693718+00	\N	Iloilo City	Iloilo	10.69364503	122.54125362	0101000020E6100000772F39E6A3A25E4011C4FD7025632540	2	2
068750c2-3598-4ca7-b7f0-2d457def57ae	Juan	Reyes	\N	Professional Cleaner with 14 years of experience serving Baguio and surrounding areas. Committed to quality work and customer satisfaction.	active	2023-10-15 17:02:52.380118+00	\N	Baguio	Benguet	16.41070126	120.58211060	0101000020E6100000EA69D14C41255E404120C0B723693040	2	2
15d2e617-64e9-40af-a836-b3d19a6dd3bb	Isabel	Fernandez	\N	Professional Locksmith with 3 years of experience serving Manila and surrounding areas. Committed to quality work and customer satisfaction.	active	2024-08-30 09:42:44.911318+00	\N	Manila	Metro Manila	14.57417590	120.95154519	0101000020E6100000D5EDCB1DE63C5E40804D3162FA252D40	2	2
f04f5ddb-af57-4ae7-8a8c-ac18cf63f9f3	Francisco	Morales	\N	Professional Landscaper with 10 years of experience serving Quezon City and surrounding areas. Committed to quality work and customer satisfaction.	active	2023-11-02 14:26:03.160918+00	\N	Quezon City	Metro Manila	14.66034079	121.04954727	0101000020E6100000641050C82B435E409487223018522D40	2	2
e5d667b8-6cb8-470f-b72a-e91776ec2798	Maria	Cruz	\N	Professional Painter with 17 years of experience serving Makati and surrounding areas. Committed to quality work and customer satisfaction.	active	2023-08-21 00:32:44.863318+00	\N	Makati	Metro Manila	14.53376545	120.98853163	0101000020E6100000577A2B1A443F5E402EF87EB449112D40	2	2
6eceabcf-8962-41b5-ae91-cd153cc581b9	Carlos	Ramos	\N	Professional Plumber with 6 years of experience serving Taguig and surrounding areas. Committed to quality work and customer satisfaction.	active	2023-06-18 03:30:08.824918+00	\N	Taguig	Metro Manila	14.50091721	121.02931922	0101000020E6100000D5C2B85DE0415E403AE8753878002D40	2	2
60513923-0ed2-4d03-a195-f951c01708ef	Teresa	Aquino	\N	Professional Handyman with 13 years of experience serving Pasig and surrounding areas. Committed to quality work and customer satisfaction.	active	2024-03-05 22:09:48.194518+00	\N	Pasig	Metro Manila	14.60290881	121.10931099	0101000020E61000002DC985F3FE465E402FD7AA76B0342D40	2	2
b5a8acc9-aae8-4a02-9c54-392273be2bed	Jose	Bautista	\N	Professional Carpenter with 2 years of experience serving Cebu City and surrounding areas. Committed to quality work and customer satisfaction.	active	2023-04-29 20:52:38.191318+00	\N	Cebu City	Cebu	10.28970657	123.87698268	0101000020E61000008A70F67B20F85E40342C676B54942440	2	2
3f72aef4-850b-401a-b6e2-b5524ee835e6	Rosa	Flores	\N	Professional Electrician with 9 years of experience serving Mandaue City and surrounding areas. Committed to quality work and customer satisfaction.	active	2025-03-09 13:16:53.023318+00	\N	Mandaue City	Cebu	10.29124333	123.90933073	0101000020E610000042A6847932FA5E40680E83D81D952440	2	2
d689dc1e-c670-4544-8c03-8056d6c54c47	Manuel	Villanueva	\N	Professional Roofer with 16 years of experience serving Lapu-Lapu and surrounding areas. Committed to quality work and customer satisfaction.	active	2025-12-12 04:31:32.488918+00	\N	Lapu-Lapu	Cebu	10.30610863	123.95784737	0101000020E61000006A2D0E5F4DFD5E402ABF3545BA9C2440	2	2
772dd6aa-88ce-463c-af72-def381fe2dc3	Ana	Garcia	\N	Professional HVAC Technician with 5 years of experience serving Davao City and surrounding areas. Committed to quality work and customer satisfaction.	active	2025-08-27 08:32:31.183318+00	\N	Davao City	Davao del Sur	7.15076656	125.43498021	0101000020E6100000DD163CB7D65B5F40271F928C629A1C40	2	2
875a1841-c516-4aff-8dec-7b29080e7902	Luis	Gonzales	\N	Professional Cleaner with 12 years of experience serving Cagayan de Oro and surrounding areas. Committed to quality work and customer satisfaction.	active	2023-11-22 13:28:36.405718+00	\N	Cagayan de Oro	Misamis Oriental	8.47913300	124.65354277	0101000020E6100000FCEB0DA5D3295F4065DEAAEB50F52040	2	2
28cffd4f-2d69-4667-9c34-dd0f1c365c93	Patricia	Lopez	\N	Professional Locksmith with 19 years of experience serving Iloilo City and surrounding areas. Committed to quality work and customer satisfaction.	active	2025-07-05 23:31:21.804118+00	\N	Iloilo City	Iloilo	10.74101958	122.56078575	0101000020E61000000514EAE9E3A35E4060971BEB667B2540	2	2
29cfad14-d90e-4a79-9b31-d0b2e8d69036	Pedro	Mendoza	\N	Professional Landscaper with 8 years of experience serving Baguio and surrounding areas. Committed to quality work and customer satisfaction.	active	2023-06-22 17:47:48.578518+00	\N	Baguio	Benguet	16.40974206	120.62101204	0101000020E6100000398E48A9BE275E40E47E0BDBE4683040	2	2
\.


--
-- Data for Name: worker_posts; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.worker_posts (id, worker_id, title, content, media_url, status, created_at) FROM stdin;
\.


--
-- Data for Name: workers; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.workers (id, worker_id, skills, status, created_at, deleted_at, hourly_rate_min, hourly_rate_max, years_experience, jobs_completed, response_time_minutes, is_verified, profession) FROM stdin;
4b847ab6-8433-40f9-8a4a-c6b567fca4b1	26e02acd-4f32-4619-b25d-dc8273db7df6	{Locksmith,"General Maintenance","Emergency Services","Quality Assurance"}	available	2024-12-05 20:53:20.872918+00	\N	60	220	15	24	25	t	Locksmith
e4be346a-48b6-4b9a-beef-440172e49496	daf2b506-ab68-4768-8088-8c513172906b	{Landscaper,"General Maintenance","Emergency Services","Quality Assurance"}	available	2024-04-20 16:32:16.466518+00	\N	130	140	4	31	32	f	Landscaper
197564d1-d2d1-4ea9-a2f3-2ca061738023	c2881953-2ba8-4258-b661-5cd2f4e212d5	{Painter,"General Maintenance","Emergency Services","Quality Assurance"}	available	2024-03-02 13:50:25.970518+00	\N	100	210	11	38	39	f	Painter
6d80d013-d98a-47ea-906e-d7c15013a668	862bf73b-5359-4061-9312-c7c9bcb54dc9	{Plumber,"General Maintenance","Emergency Services","Quality Assurance"}	available	2024-01-19 02:35:09.208918+00	\N	70	130	18	45	46	t	Plumber
801c5827-22b7-42dc-b0e6-a2679d857713	34228761-bcf2-4ff3-bfd1-f65d3d050d2b	{Handyman,"General Maintenance","Emergency Services","Quality Assurance"}	available	2023-01-26 01:03:08.940118+00	\N	140	200	7	52	53	t	Handyman
c0b517b7-bbcc-40ca-a069-603e598d0f22	b0d0319f-3ccd-4386-978e-e8243923db36	{Carpenter,"General Maintenance","Emergency Services","Quality Assurance"}	available	2025-10-28 15:17:55.029718+00	\N	110	120	14	59	60	f	Carpenter
694070cf-c96f-490e-bba9-438d2802e4b0	8730c98e-607b-491b-ba1a-ec47f577da1c	{Electrician,"General Maintenance","Emergency Services","Quality Assurance"}	available	2024-08-19 19:38:00.165718+00	\N	80	190	3	66	67	t	Electrician
b39c335d-3fd4-4072-afa3-22decebbc831	59676f81-363d-4b81-81a8-326f11304145	{Roofer,"General Maintenance","Emergency Services","Quality Assurance"}	available	2025-07-27 19:04:37.586518+00	\N	50	110	10	73	74	t	Roofer
641da401-8b72-4dd9-b12b-6482e9ff1911	d2e65c84-18ae-4b35-ae87-78a3ab244754	{"HVAC Technician","General Maintenance","Emergency Services","Quality Assurance"}	available	2023-03-23 09:14:49.269718+00	\N	120	180	17	80	81	f	HVAC Technician
476a0153-511f-4e6e-be93-60d8d02e9c84	cf981ea0-ea50-476e-aae6-96e103cfb358	{Cleaner,"General Maintenance","Emergency Services","Quality Assurance"}	available	2023-10-09 02:20:10.044118+00	\N	90	100	6	87	88	t	Cleaner
6dcccbc6-dc48-4e28-936b-8d7145089efa	25ecace8-49ad-4af9-b1aa-97352291eb02	{Locksmith,"General Maintenance","Emergency Services","Quality Assurance"}	available	2024-11-10 05:40:11.263318+00	\N	60	170	13	94	95	t	Locksmith
6530fe9e-2a24-445d-b0f8-0bf9262a33ae	d1be4162-b83a-400e-9a30-07f3b2bf2f37	{Landscaper,"General Maintenance","Emergency Services","Quality Assurance"}	available	2024-01-21 21:27:38.834518+00	\N	130	240	2	101	102	f	Landscaper
b11f3c53-2fb8-490f-8411-566708234c20	6a3724bd-1757-4b94-be45-5650c4cbc84a	{Painter,"General Maintenance","Emergency Services","Quality Assurance"}	available	2023-12-29 23:53:23.724118+00	\N	100	160	9	108	109	f	Painter
54f373db-9728-4920-972d-01b70dbad71d	2abd59e7-f229-4457-9b4f-05dd7ff9f950	{Plumber,"General Maintenance","Emergency Services","Quality Assurance"}	available	2025-10-02 05:07:45.103318+00	\N	70	230	16	115	116	t	Plumber
d91a1f8b-149c-4c9a-a382-9413cfa32fa8	f2252c07-5c2c-4dee-8cb4-9475115c59ca	{Handyman,"General Maintenance","Emergency Services","Quality Assurance"}	available	2024-04-06 06:02:02.383318+00	\N	140	150	5	122	13	t	Handyman
545571a9-67c8-41bb-94d6-b6bafbdce08c	86ad7fd4-80f1-4376-af0b-29926fdf3944	{Carpenter,"General Maintenance","Emergency Services","Quality Assurance"}	available	2024-05-30 01:17:17.215318+00	\N	110	220	12	129	20	f	Carpenter
19ed47df-8c96-4b10-94fa-d2695495c1b3	aeef5a83-d194-4ab2-bc0e-0b8d59c3f9d6	{Electrician,"General Maintenance","Emergency Services","Quality Assurance"}	available	2023-09-07 09:27:40.389718+00	\N	80	140	19	136	27	t	Electrician
6d5774cd-0017-4d17-b128-3f53026e7653	5eaabc8f-02e6-43e3-a7e1-7c223c8fee9d	{Roofer,"General Maintenance","Emergency Services","Quality Assurance"}	available	2024-04-25 09:22:54.319318+00	\N	50	210	8	143	34	t	Roofer
af77e6b2-a2fb-4d6c-99d6-db1f30e514fc	f237dee0-b324-4b4f-8a56-e51c8dfe7941	{"HVAC Technician","General Maintenance","Emergency Services","Quality Assurance"}	available	2023-01-01 02:01:30.645718+00	\N	120	130	15	150	41	f	HVAC Technician
b071d861-5f04-49e4-b350-35a8516f02bb	6905635d-7e04-460d-8734-d8cfede31a47	{Cleaner,"General Maintenance","Emergency Services","Quality Assurance"}	available	2024-02-12 08:20:14.623318+00	\N	90	200	4	157	48	t	Cleaner
26dd6f0a-5fde-4240-bc07-dd7489ea4c71	ce45455d-4356-4250-b920-27e2a9a6acd3	{Locksmith,"General Maintenance","Emergency Services","Quality Assurance"}	available	2025-08-13 12:44:41.464918+00	\N	60	120	11	164	55	t	Locksmith
3b16b767-c651-47bc-a8a2-8617b907e687	307faedf-c25e-4493-a483-60960460ef13	{Landscaper,"General Maintenance","Emergency Services","Quality Assurance"}	available	2024-11-30 19:17:07.538518+00	\N	130	190	18	171	62	f	Landscaper
6bce38da-4870-4c0a-89d1-b4ada469f666	eaa4b66d-41c3-4990-a1e8-9570f25a2a90	{Painter,"General Maintenance","Emergency Services","Quality Assurance"}	available	2024-04-23 17:37:12.415318+00	\N	100	110	7	178	69	f	Painter
1eddd4f1-7deb-4f76-9aea-2e16ee1dcfb4	c3542c4f-23e1-4df8-bcab-3b5aace21c7b	{Plumber,"General Maintenance","Emergency Services","Quality Assurance"}	available	2025-07-07 05:04:49.538518+00	\N	70	180	14	185	76	t	Plumber
385e8633-83d0-42d7-ba63-4a51acb5d3c4	2fafc06b-a809-4acc-b9ce-ea53779d48d4	{Handyman,"General Maintenance","Emergency Services","Quality Assurance"}	available	2023-01-17 07:09:15.189718+00	\N	140	100	3	192	83	t	Handyman
d8be5bc6-d48e-4e34-8f3a-1f8ce8cadd0a	81610da5-f9ae-444a-953d-05db70defdf5	{Carpenter,"General Maintenance","Emergency Services","Quality Assurance"}	available	2024-08-31 02:59:41.810518+00	\N	110	170	10	199	90	f	Carpenter
fe34982b-fdaa-43fd-8adb-39ef55431ec3	43fc2e10-b7f4-497d-8e3e-3cc3504b607d	{Electrician,"General Maintenance","Emergency Services","Quality Assurance"}	available	2024-05-31 23:31:12.559318+00	\N	80	240	17	206	97	t	Electrician
acc2cb07-630d-4190-9631-7f4282269d7b	78a4aadd-b865-4eb6-80a7-48519d0e2ba2	{Roofer,"General Maintenance","Emergency Services","Quality Assurance"}	available	2023-10-08 12:32:33.717718+00	\N	50	160	6	213	104	t	Roofer
0d749d6f-d595-4a60-b73b-707000723005	41ecd97e-ef9c-4a81-8261-126c4d90cdc4	{"HVAC Technician","General Maintenance","Emergency Services","Quality Assurance"}	available	2023-02-05 14:35:17.589718+00	\N	120	230	13	220	111	f	HVAC Technician
50f538e7-2b00-4822-8c3e-336ee96fed8b	7624d68c-87c9-454d-8a81-b9e04a9835d5	{Cleaner,"General Maintenance","Emergency Services","Quality Assurance"}	available	2024-05-31 07:26:06.588118+00	\N	90	150	2	227	118	t	Cleaner
b805d260-771d-4ff4-b4ef-68667abb3eda	8dfa85c7-8db4-4f2e-ae73-1cdbce4cf8d8	{Locksmith,"General Maintenance","Emergency Services","Quality Assurance"}	available	2024-07-03 23:05:38.959318+00	\N	60	220	9	234	15	t	Locksmith
e032b030-4f2f-4471-8445-566bbe470c5b	66916789-7b07-40f9-9df7-57c432205d9e	{Landscaper,"General Maintenance","Emergency Services","Quality Assurance"}	available	2023-04-08 09:55:08.901718+00	\N	130	140	16	241	22	f	Landscaper
b96cc84a-5628-40d6-a41a-688edbce5440	68824670-6c5d-4812-8fee-2070bcdbc90c	{Painter,"General Maintenance","Emergency Services","Quality Assurance"}	available	2025-07-08 02:38:40.370518+00	\N	100	210	5	248	29	f	Painter
facc5240-90a6-4720-b442-872ee8c8f02b	29fa14c5-4010-4b58-bfd0-8740da9910b6	{Plumber,"General Maintenance","Emergency Services","Quality Assurance"}	available	2024-06-02 19:16:21.055318+00	\N	70	130	12	255	36	t	Plumber
ade56c89-3463-4ce2-abf0-9941c323fc41	60e71417-59da-467f-9aa2-ee6d86187a69	{Handyman,"General Maintenance","Emergency Services","Quality Assurance"}	available	2024-12-23 16:36:59.599318+00	\N	140	200	19	262	43	t	Handyman
0f83e411-b7e6-40db-9335-e8fd00465d60	b77c81a6-a8a9-42e0-acc8-ce1ce2d92bf7	{Carpenter,"General Maintenance","Emergency Services","Quality Assurance"}	available	2023-08-24 14:37:20.968918+00	\N	110	120	8	269	50	f	Carpenter
a064957b-4cc2-4053-81a0-cadc89d581ab	8dfa3373-45d8-448e-a3b5-4d1dfec4ba2f	{Electrician,"General Maintenance","Emergency Services","Quality Assurance"}	available	2024-06-29 18:18:10.063318+00	\N	80	190	15	276	57	t	Electrician
3e541060-661a-4081-a2b4-36c6b3be4877	5f5145a0-1827-46fd-b44f-6b2a7170d6a9	{Roofer,"General Maintenance","Emergency Services","Quality Assurance"}	available	2023-11-12 10:05:59.839318+00	\N	50	110	4	283	64	t	Roofer
1e888930-6ec3-40f3-ad4b-84c64631011a	bf42a091-8815-4f72-bf8d-6f3bdb13e3c6	{"HVAC Technician","General Maintenance","Emergency Services","Quality Assurance"}	available	2025-01-26 02:52:21.688918+00	\N	120	180	11	290	71	f	HVAC Technician
da4f12f2-1a75-49af-9093-d9189adad3c8	ad584595-9c2b-4d07-ad8c-59481f88ac28	{Cleaner,"General Maintenance","Emergency Services","Quality Assurance"}	available	2024-10-05 13:14:47.743318+00	\N	90	100	18	297	78	t	Cleaner
c50a5576-0dea-4451-a4d3-ba06fa162d90	44aa15b3-b26c-4a83-b592-91adddfc9f9a	{Locksmith,"General Maintenance","Emergency Services","Quality Assurance"}	available	2025-10-25 06:45:25.701718+00	\N	60	170	7	304	85	t	Locksmith
d0265243-f33d-408e-8ef1-5d5de2ff2cca	63c0a431-ca11-4691-96b4-900155ce869b	{Landscaper,"General Maintenance","Emergency Services","Quality Assurance"}	available	2025-08-14 10:06:22.648918+00	\N	130	240	14	311	92	f	Landscaper
650a800e-e052-4cc1-94e7-bee61fa63d86	5b57cd3c-d7ec-4e25-83a9-20bcadbb2f1c	{Painter,"General Maintenance","Emergency Services","Quality Assurance"}	available	2024-03-18 20:53:36.079318+00	\N	100	160	3	318	99	f	Painter
db08d831-fc46-4357-a680-de44c5c8d692	247b80be-b7dc-4582-aa28-5dd8888d8c53	{Plumber,"General Maintenance","Emergency Services","Quality Assurance"}	available	2023-08-21 01:07:09.909718+00	\N	70	230	10	325	106	t	Plumber
ddf9f92d-b5e5-4de0-aeb5-16ca10e83d72	7affa09f-b335-4d36-81e3-0a179279fc69	{Handyman,"General Maintenance","Emergency Services","Quality Assurance"}	available	2023-03-17 00:20:31.932118+00	\N	140	150	17	332	113	t	Handyman
b86a5761-5da4-4a65-b1ab-a81076bdffaa	96fe7dab-91ec-4c51-a775-a406572da480	{Carpenter,"General Maintenance","Emergency Services","Quality Assurance"}	available	2023-01-08 00:24:07.154518+00	\N	110	220	6	339	10	f	Carpenter
8a7fe435-9ab2-47fc-a823-447111e28198	7c681db7-cff1-40e6-b38b-79919297ca90	{Electrician,"General Maintenance","Emergency Services","Quality Assurance"}	available	2023-06-23 21:48:33.880918+00	\N	80	140	13	346	17	t	Electrician
f8b4e221-3364-4136-bac4-fa39ad906f3b	b4f1941c-0fd5-43f9-ba92-40fc055c11c8	{Roofer,"General Maintenance","Emergency Services","Quality Assurance"}	available	2025-01-15 10:33:19.538518+00	\N	50	210	2	353	24	t	Roofer
6c2a09bd-dd84-4386-b740-a69e5db6d990	ccc0cbbb-a469-4e83-a5ca-259f2b1acce2	{"HVAC Technician","General Maintenance","Emergency Services","Quality Assurance"}	available	2023-12-27 08:51:57.151318+00	\N	120	130	9	360	31	f	HVAC Technician
12b4fd33-d1e2-4775-bc18-194f1da2a877	21007243-551a-49f7-8df4-d188ad7e6244	{Cleaner,"General Maintenance","Emergency Services","Quality Assurance"}	available	2024-08-03 00:21:06.664918+00	\N	90	200	16	367	38	t	Cleaner
0bccd4e3-c6ee-499e-bb57-54df25431856	8d2d4afc-beef-44d3-8628-428dcebdf008	{Locksmith,"General Maintenance","Emergency Services","Quality Assurance"}	available	2025-09-15 19:00:46.639318+00	\N	60	120	5	374	45	t	Locksmith
2ff2662b-1b3d-4b1d-976e-90f98817dda6	6f9859a4-f31c-4445-becd-04934b9b4677	{Landscaper,"General Maintenance","Emergency Services","Quality Assurance"}	available	2024-02-21 17:06:15.074518+00	\N	130	190	12	381	52	f	Landscaper
58ba1740-8def-4f8e-9913-02556fd9ed10	e4b6d247-223e-4032-bb0e-949dc97f052c	{Painter,"General Maintenance","Emergency Services","Quality Assurance"}	available	2024-09-28 12:58:10.860118+00	\N	100	110	19	388	59	f	Painter
34fa186b-1627-44c5-bb8e-182dccd2fd06	99b0b1ec-e1fb-4c44-a35e-2f14fd03e819	{Plumber,"General Maintenance","Emergency Services","Quality Assurance"}	available	2024-04-21 10:32:38.239318+00	\N	70	180	8	395	66	t	Plumber
125508a9-013c-45d5-88a0-a805cd79ed70	90c8bc6d-8bfd-46c0-aca0-528cb60346ff	{Handyman,"General Maintenance","Emergency Services","Quality Assurance"}	available	2025-02-04 15:01:48.818518+00	\N	140	100	15	402	73	t	Handyman
6211d164-b88d-4c6d-9fc7-57f255d5b16d	ffdae030-82ae-435b-a1a4-10ecbd39dd6b	{Carpenter,"General Maintenance","Emergency Services","Quality Assurance"}	available	2024-03-25 01:39:42.031318+00	\N	110	170	4	409	80	f	Carpenter
8b5e2185-c7be-4866-9576-df0716cfc5a9	96eaea48-f243-41e6-8c5c-db8c475a5dcd	{Electrician,"General Maintenance","Emergency Services","Quality Assurance"}	available	2024-06-13 07:15:01.653718+00	\N	80	240	11	416	87	t	Electrician
dd2c1eaf-8366-4b9b-aafa-9ab09f54bc02	170ee8a2-3694-4aa3-a02b-aeba5f7c3a31	{Roofer,"General Maintenance","Emergency Services","Quality Assurance"}	available	2025-02-23 03:55:26.354518+00	\N	50	160	18	423	94	t	Roofer
eafcca21-bf07-476c-be76-0367085a36a9	3b4010dd-6e26-45f0-a020-8626a8357589	{"HVAC Technician","General Maintenance","Emergency Services","Quality Assurance"}	available	2025-06-14 16:46:56.364118+00	\N	120	230	7	430	101	f	HVAC Technician
ba8fb7bf-83e2-47ad-9bd1-4f1adcacd310	068750c2-3598-4ca7-b7f0-2d457def57ae	{Cleaner,"General Maintenance","Emergency Services","Quality Assurance"}	available	2025-10-27 00:02:26.143318+00	\N	90	150	14	437	108	t	Cleaner
8ffc2f6b-47c1-4b89-ab39-3b874a3edfd5	15d2e617-64e9-40af-a836-b3d19a6dd3bb	{Locksmith,"General Maintenance","Emergency Services","Quality Assurance"}	available	2023-05-22 22:25:36.866518+00	\N	60	220	3	444	115	t	Locksmith
8b6e159b-d5b0-4ce8-abd5-db5cd30779fb	f04f5ddb-af57-4ae7-8a8c-ac18cf63f9f3	{Landscaper,"General Maintenance","Emergency Services","Quality Assurance"}	available	2024-03-16 04:47:59.436118+00	\N	130	140	10	451	12	f	Landscaper
569c7732-3d78-450b-8718-1433d128bff9	e5d667b8-6cb8-470f-b72a-e91776ec2798	{Painter,"General Maintenance","Emergency Services","Quality Assurance"}	available	2022-12-23 23:18:55.653718+00	\N	100	210	17	458	19	f	Painter
3d45cf47-93ef-4f02-ba33-fe9d00cf438b	6eceabcf-8962-41b5-ae91-cd153cc581b9	{Plumber,"General Maintenance","Emergency Services","Quality Assurance"}	available	2023-07-26 18:01:05.877718+00	\N	70	130	6	465	26	t	Plumber
46d9d0ab-75f4-44cb-93ee-23d66aebb52e	60513923-0ed2-4d03-a195-f951c01708ef	{Handyman,"General Maintenance","Emergency Services","Quality Assurance"}	available	2023-06-24 12:49:39.285718+00	\N	140	200	13	472	33	t	Handyman
1afaad63-2c47-4b54-b27f-7ceb82650c7a	b5a8acc9-aae8-4a02-9c54-392273be2bed	{Carpenter,"General Maintenance","Emergency Services","Quality Assurance"}	available	2023-09-10 12:50:49.010518+00	\N	110	120	2	479	40	f	Carpenter
726fd868-3f60-4f98-af6f-3f7e8ff7659e	3f72aef4-850b-401a-b6e2-b5524ee835e6	{Electrician,"General Maintenance","Emergency Services","Quality Assurance"}	available	2025-06-20 06:58:43.778518+00	\N	80	190	9	486	47	t	Electrician
33e16af9-50b0-4b4c-ad37-60e5ef19adcd	d689dc1e-c670-4544-8c03-8056d6c54c47	{Roofer,"General Maintenance","Emergency Services","Quality Assurance"}	available	2024-02-15 21:39:36.645718+00	\N	50	110	16	493	54	t	Roofer
c28db18d-5e84-422c-a046-46da05807c03	772dd6aa-88ce-463c-af72-def381fe2dc3	{"HVAC Technician","General Maintenance","Emergency Services","Quality Assurance"}	available	2024-08-01 09:14:01.836118+00	\N	120	180	5	10	61	f	HVAC Technician
1306f5da-57c7-45c9-b123-0b8174c5516a	875a1841-c516-4aff-8dec-7b29080e7902	{Cleaner,"General Maintenance","Emergency Services","Quality Assurance"}	available	2024-09-07 02:41:22.888918+00	\N	90	100	12	17	68	t	Cleaner
ec34f952-7034-4d18-a036-2332190bc212	28cffd4f-2d69-4667-9c34-dd0f1c365c93	{Locksmith,"General Maintenance","Emergency Services","Quality Assurance"}	available	2023-04-27 14:45:03.640918+00	\N	60	170	19	24	75	t	Locksmith
37ab60dd-1951-4846-8368-3aebadfdd5b9	29cfad14-d90e-4a79-9b31-d0b2e8d69036	{Landscaper,"General Maintenance","Emergency Services","Quality Assurance"}	available	2023-03-21 05:55:28.485718+00	\N	130	240	8	31	82	f	Landscaper
\.


--
-- Data for Name: workers_categories; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.workers_categories (id, worker_id, category_id, created_at) FROM stdin;
\.


--
-- Data for Name: messages_2025_12_18; Type: TABLE DATA; Schema: realtime; Owner: -
--

COPY realtime.messages_2025_12_18 (topic, extension, payload, event, private, updated_at, inserted_at, id) FROM stdin;
\.


--
-- Data for Name: messages_2025_12_19; Type: TABLE DATA; Schema: realtime; Owner: -
--

COPY realtime.messages_2025_12_19 (topic, extension, payload, event, private, updated_at, inserted_at, id) FROM stdin;
\.


--
-- Data for Name: messages_2025_12_20; Type: TABLE DATA; Schema: realtime; Owner: -
--

COPY realtime.messages_2025_12_20 (topic, extension, payload, event, private, updated_at, inserted_at, id) FROM stdin;
\.


--
-- Data for Name: messages_2025_12_21; Type: TABLE DATA; Schema: realtime; Owner: -
--

COPY realtime.messages_2025_12_21 (topic, extension, payload, event, private, updated_at, inserted_at, id) FROM stdin;
\.


--
-- Data for Name: messages_2025_12_22; Type: TABLE DATA; Schema: realtime; Owner: -
--

COPY realtime.messages_2025_12_22 (topic, extension, payload, event, private, updated_at, inserted_at, id) FROM stdin;
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: realtime; Owner: -
--

COPY realtime.schema_migrations (version, inserted_at) FROM stdin;
20211116024918	2025-12-12 23:51:18
20211116045059	2025-12-12 23:51:18
20211116050929	2025-12-12 23:51:18
20211116051442	2025-12-12 23:51:18
20211116212300	2025-12-12 23:51:18
20211116213355	2025-12-12 23:51:18
20211116213934	2025-12-12 23:51:18
20211116214523	2025-12-12 23:51:18
20211122062447	2025-12-12 23:51:18
20211124070109	2025-12-12 23:51:18
20211202204204	2025-12-12 23:51:18
20211202204605	2025-12-12 23:51:18
20211210212804	2025-12-12 23:51:18
20211228014915	2025-12-12 23:51:18
20220107221237	2025-12-12 23:51:18
20220228202821	2025-12-12 23:51:18
20220312004840	2025-12-12 23:51:18
20220603231003	2025-12-12 23:51:18
20220603232444	2025-12-12 23:51:18
20220615214548	2025-12-12 23:51:18
20220712093339	2025-12-12 23:51:18
20220908172859	2025-12-12 23:51:18
20220916233421	2025-12-12 23:51:18
20230119133233	2025-12-12 23:51:18
20230128025114	2025-12-12 23:51:18
20230128025212	2025-12-12 23:51:18
20230227211149	2025-12-12 23:51:18
20230228184745	2025-12-12 23:51:18
20230308225145	2025-12-12 23:51:18
20230328144023	2025-12-12 23:51:18
20231018144023	2025-12-12 23:51:18
20231204144023	2025-12-12 23:51:18
20231204144024	2025-12-12 23:51:18
20231204144025	2025-12-12 23:51:18
20240108234812	2025-12-12 23:51:18
20240109165339	2025-12-12 23:51:18
20240227174441	2025-12-12 23:51:18
20240311171622	2025-12-12 23:51:18
20240321100241	2025-12-12 23:51:18
20240401105812	2025-12-12 23:51:18
20240418121054	2025-12-12 23:51:18
20240523004032	2025-12-12 23:51:18
20240618124746	2025-12-12 23:51:18
20240801235015	2025-12-12 23:51:18
20240805133720	2025-12-12 23:51:18
20240827160934	2025-12-12 23:51:18
20240919163303	2025-12-12 23:51:18
20240919163305	2025-12-12 23:51:18
20241019105805	2025-12-12 23:51:18
20241030150047	2025-12-12 23:51:18
20241108114728	2025-12-12 23:51:18
20241121104152	2025-12-12 23:51:18
20241130184212	2025-12-12 23:51:18
20241220035512	2025-12-12 23:51:18
20241220123912	2025-12-12 23:51:18
20241224161212	2025-12-12 23:51:18
20250107150512	2025-12-12 23:51:18
20250110162412	2025-12-12 23:51:18
20250123174212	2025-12-12 23:51:18
20250128220012	2025-12-12 23:51:18
20250506224012	2025-12-12 23:51:18
20250523164012	2025-12-12 23:51:18
20250714121412	2025-12-12 23:51:18
20250905041441	2025-12-12 23:51:18
\.


--
-- Data for Name: subscription; Type: TABLE DATA; Schema: realtime; Owner: -
--

COPY realtime.subscription (id, subscription_id, entity, filters, claims, created_at) FROM stdin;
\.


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY storage.buckets (id, name, owner, created_at, updated_at, public, avif_autodetection, file_size_limit, allowed_mime_types, owner_id, type) FROM stdin;
\.


--
-- Data for Name: buckets_analytics; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY storage.buckets_analytics (id, type, format, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: iceberg_namespaces; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY storage.iceberg_namespaces (id, bucket_id, name, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: iceberg_tables; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY storage.iceberg_tables (id, namespace_id, bucket_id, name, location, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY storage.migrations (id, name, hash, executed_at) FROM stdin;
0	create-migrations-table	e18db593bcde2aca2a408c4d1100f6abba2195df	2025-12-12 23:51:27.969172
1	initialmigration	6ab16121fbaa08bbd11b712d05f358f9b555d777	2025-12-12 23:51:27.97097
2	storage-schema	5c7968fd083fcea04050c1b7f6253c9771b99011	2025-12-12 23:51:27.971643
3	pathtoken-column	2cb1b0004b817b29d5b0a971af16bafeede4b70d	2025-12-12 23:51:27.976776
4	add-migrations-rls	427c5b63fe1c5937495d9c635c263ee7a5905058	2025-12-12 23:51:27.98081
5	add-size-functions	79e081a1455b63666c1294a440f8ad4b1e6a7f84	2025-12-12 23:51:27.981734
6	change-column-name-in-get-size	f93f62afdf6613ee5e7e815b30d02dc990201044	2025-12-12 23:51:27.983096
7	add-rls-to-buckets	e7e7f86adbc51049f341dfe8d30256c1abca17aa	2025-12-12 23:51:27.984461
8	add-public-to-buckets	fd670db39ed65f9d08b01db09d6202503ca2bab3	2025-12-12 23:51:27.985245
9	fix-search-function	3a0af29f42e35a4d101c259ed955b67e1bee6825	2025-12-12 23:51:27.986107
10	search-files-search-function	68dc14822daad0ffac3746a502234f486182ef6e	2025-12-12 23:51:27.987186
11	add-trigger-to-auto-update-updated_at-column	7425bdb14366d1739fa8a18c83100636d74dcaa2	2025-12-12 23:51:27.988431
12	add-automatic-avif-detection-flag	8e92e1266eb29518b6a4c5313ab8f29dd0d08df9	2025-12-12 23:51:27.989793
13	add-bucket-custom-limits	cce962054138135cd9a8c4bcd531598684b25e7d	2025-12-12 23:51:27.990724
14	use-bytes-for-max-size	941c41b346f9802b411f06f30e972ad4744dad27	2025-12-12 23:51:27.991409
15	add-can-insert-object-function	934146bc38ead475f4ef4b555c524ee5d66799e5	2025-12-12 23:51:27.999927
16	add-version	76debf38d3fd07dcfc747ca49096457d95b1221b	2025-12-12 23:51:28.001145
17	drop-owner-foreign-key	f1cbb288f1b7a4c1eb8c38504b80ae2a0153d101	2025-12-12 23:51:28.001876
18	add_owner_id_column_deprecate_owner	e7a511b379110b08e2f214be852c35414749fe66	2025-12-12 23:51:28.002857
19	alter-default-value-objects-id	02e5e22a78626187e00d173dc45f58fa66a4f043	2025-12-12 23:51:28.004163
20	list-objects-with-delimiter	cd694ae708e51ba82bf012bba00caf4f3b6393b7	2025-12-12 23:51:28.005011
21	s3-multipart-uploads	8c804d4a566c40cd1e4cc5b3725a664a9303657f	2025-12-12 23:51:28.006328
22	s3-multipart-uploads-big-ints	9737dc258d2397953c9953d9b86920b8be0cdb73	2025-12-12 23:51:28.009633
23	optimize-search-function	9d7e604cddc4b56a5422dc68c9313f4a1b6f132c	2025-12-12 23:51:28.012188
24	operation-function	8312e37c2bf9e76bbe841aa5fda889206d2bf8aa	2025-12-12 23:51:28.013341
25	custom-metadata	d974c6057c3db1c1f847afa0e291e6165693b990	2025-12-12 23:51:28.014276
26	objects-prefixes	ef3f7871121cdc47a65308e6702519e853422ae2	2025-12-12 23:51:28.015077
27	search-v2	33b8f2a7ae53105f028e13e9fcda9dc4f356b4a2	2025-12-12 23:51:28.018968
28	object-bucket-name-sorting	ba85ec41b62c6a30a3f136788227ee47f311c436	2025-12-12 23:51:28.041227
29	create-prefixes	a7b1a22c0dc3ab630e3055bfec7ce7d2045c5b7b	2025-12-12 23:51:28.043049
30	update-object-levels	6c6f6cc9430d570f26284a24cf7b210599032db7	2025-12-12 23:51:28.044049
31	objects-level-index	33f1fef7ec7fea08bb892222f4f0f5d79bab5eb8	2025-12-12 23:51:28.045159
32	backward-compatible-index-on-objects	2d51eeb437a96868b36fcdfb1ddefdf13bef1647	2025-12-12 23:51:28.045997
33	backward-compatible-index-on-prefixes	fe473390e1b8c407434c0e470655945b110507bf	2025-12-12 23:51:28.046918
34	optimize-search-function-v1	82b0e469a00e8ebce495e29bfa70a0797f7ebd2c	2025-12-12 23:51:28.047105
35	add-insert-trigger-prefixes	63bb9fd05deb3dc5e9fa66c83e82b152f0caf589	2025-12-12 23:51:28.048416
36	optimise-existing-functions	81cf92eb0c36612865a18016a38496c530443899	2025-12-12 23:51:28.049081
37	add-bucket-name-length-trigger	3944135b4e3e8b22d6d4cbb568fe3b0b51df15c1	2025-12-12 23:51:28.051065
38	iceberg-catalog-flag-on-buckets	19a8bd89d5dfa69af7f222a46c726b7c41e462c5	2025-12-12 23:51:28.051992
39	add-search-v2-sort-support	39cf7d1e6bf515f4b02e41237aba845a7b492853	2025-12-12 23:51:28.055806
40	fix-prefix-race-conditions-optimized	fd02297e1c67df25a9fc110bf8c8a9af7fb06d1f	2025-12-12 23:51:28.057106
41	add-object-level-update-trigger	44c22478bf01744b2129efc480cd2edc9a7d60e9	2025-12-12 23:51:28.059332
42	rollback-prefix-triggers	f2ab4f526ab7f979541082992593938c05ee4b47	2025-12-12 23:51:28.0603
43	fix-object-level	ab837ad8f1c7d00cc0b7310e989a23388ff29fc6	2025-12-12 23:51:28.06141
\.


--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY storage.objects (id, bucket_id, name, owner, created_at, updated_at, last_accessed_at, metadata, version, owner_id, user_metadata, level) FROM stdin;
\.


--
-- Data for Name: prefixes; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY storage.prefixes (bucket_id, name, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY storage.s3_multipart_uploads (id, in_progress_size, upload_signature, bucket_id, key, version, owner_id, created_at, user_metadata) FROM stdin;
\.


--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY storage.s3_multipart_uploads_parts (id, upload_id, size, part_number, bucket_id, key, etag, owner_id, version, created_at) FROM stdin;
\.


--
-- Data for Name: hooks; Type: TABLE DATA; Schema: supabase_functions; Owner: -
--

COPY supabase_functions.hooks (id, hook_table_id, hook_name, created_at, request_id) FROM stdin;
\.


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: supabase_functions; Owner: -
--

COPY supabase_functions.migrations (version, inserted_at) FROM stdin;
initial	2025-12-12 23:51:16.157965+00
20210809183423_update_grants	2025-12-12 23:51:16.157965+00
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: supabase_migrations; Owner: -
--

COPY supabase_migrations.schema_migrations (version, statements, name) FROM stdin;
20251024181356	{"SET statement_timeout = 0","SET lock_timeout = 0","SET idle_in_transaction_session_timeout = 0","SET client_encoding = 'UTF8'","SET standard_conforming_strings = on","SELECT pg_catalog.set_config('search_path', '', false)","SET check_function_bodies = false","SET xmloption = content","SET client_min_messages = warning","SET row_security = off","CREATE SCHEMA IF NOT EXISTS \\"public\\"","ALTER SCHEMA \\"public\\" OWNER TO \\"pg_database_owner\\"","COMMENT ON SCHEMA \\"public\\" IS 'standard public schema'","CREATE OR REPLACE FUNCTION \\"public\\".\\"handle_new_auth_user\\"() RETURNS \\"trigger\\"\n    LANGUAGE \\"plpgsql\\" SECURITY DEFINER\n    AS $$\nbegin\n  insert into public.users (id, role, status)\n  values (new.id, 'customer', 'active');\n  return new;\nend;\n$$","ALTER FUNCTION \\"public\\".\\"handle_new_auth_user\\"() OWNER TO \\"postgres\\"","SET default_tablespace = ''","SET default_table_access_method = \\"heap\\"","CREATE TABLE IF NOT EXISTS \\"public\\".\\"bookings\\" (\n    \\"id\\" \\"uuid\\" DEFAULT \\"gen_random_uuid\\"() NOT NULL,\n    \\"customer_id\\" \\"uuid\\" NOT NULL,\n    \\"worker_id\\" \\"uuid\\" NOT NULL,\n    \\"category_id\\" \\"uuid\\" NOT NULL,\n    \\"description\\" \\"text\\",\n    \\"requested_at\\" timestamp with time zone DEFAULT \\"now\\"(),\n    \\"accepted_at\\" timestamp with time zone,\n    \\"completed_at\\" timestamp with time zone,\n    \\"canceled_at\\" timestamp with time zone,\n    \\"status\\" character varying,\n    \\"created_at\\" timestamp with time zone DEFAULT \\"now\\"(),\n    CONSTRAINT \\"bookings_status_check\\" CHECK (((\\"status\\")::\\"text\\" = ANY (ARRAY['pending'::\\"text\\", 'completed'::\\"text\\", 'canceled'::\\"text\\"])))\n)","ALTER TABLE \\"public\\".\\"bookings\\" OWNER TO \\"postgres\\"","CREATE TABLE IF NOT EXISTS \\"public\\".\\"categories\\" (\n    \\"id\\" \\"uuid\\" DEFAULT \\"gen_random_uuid\\"() NOT NULL,\n    \\"name\\" character varying NOT NULL,\n    \\"description\\" \\"text\\",\n    \\"created_at\\" timestamp with time zone DEFAULT \\"now\\"() NOT NULL\n)","ALTER TABLE \\"public\\".\\"categories\\" OWNER TO \\"postgres\\"","CREATE TABLE IF NOT EXISTS \\"public\\".\\"chats\\" (\n    \\"id\\" \\"uuid\\" DEFAULT \\"gen_random_uuid\\"() NOT NULL,\n    \\"booking_id\\" \\"uuid\\" NOT NULL,\n    \\"customer_id\\" \\"uuid\\" NOT NULL,\n    \\"worker_id\\" \\"uuid\\" NOT NULL,\n    \\"created_at\\" timestamp with time zone DEFAULT \\"now\\"(),\n    \\"deleted_at\\" timestamp with time zone NOT NULL\n)","ALTER TABLE \\"public\\".\\"chats\\" OWNER TO \\"postgres\\"","CREATE TABLE IF NOT EXISTS \\"public\\".\\"credit_transactions\\" (\n    \\"id\\" \\"uuid\\" DEFAULT \\"gen_random_uuid\\"() NOT NULL,\n    \\"credit_id\\" \\"uuid\\" NOT NULL,\n    \\"booking_id\\" \\"uuid\\" NOT NULL,\n    \\"amount\\" double precision NOT NULL,\n    \\"type\\" character varying NOT NULL,\n    \\"description\\" \\"text\\",\n    \\"created_at\\" timestamp with time zone DEFAULT \\"now\\"() NOT NULL,\n    \\"deleted_at\\" timestamp with time zone,\n    CONSTRAINT \\"credit_transactions_type_check\\" CHECK (((\\"type\\")::\\"text\\" = ANY (ARRAY['credit'::\\"text\\", 'debit'::\\"text\\"])))\n)","ALTER TABLE \\"public\\".\\"credit_transactions\\" OWNER TO \\"postgres\\"","CREATE TABLE IF NOT EXISTS \\"public\\".\\"credits\\" (\n    \\"id\\" \\"uuid\\" DEFAULT \\"gen_random_uuid\\"() NOT NULL,\n    \\"worker_id\\" \\"uuid\\" NOT NULL,\n    \\"balance\\" double precision NOT NULL,\n    \\"currency\\" character varying,\n    \\"created_at\\" timestamp with time zone DEFAULT \\"now\\"() NOT NULL\n)","ALTER TABLE \\"public\\".\\"credits\\" OWNER TO \\"postgres\\"","CREATE TABLE IF NOT EXISTS \\"public\\".\\"favorites\\" (\n    \\"id\\" \\"uuid\\" DEFAULT \\"gen_random_uuid\\"() NOT NULL,\n    \\"customer_id\\" \\"uuid\\" NOT NULL,\n    \\"worker_id\\" \\"uuid\\" NOT NULL,\n    \\"created_at\\" timestamp with time zone DEFAULT \\"now\\"() NOT NULL\n)","ALTER TABLE \\"public\\".\\"favorites\\" OWNER TO \\"postgres\\"","CREATE TABLE IF NOT EXISTS \\"public\\".\\"global_settings\\" (\n    \\"id\\" \\"uuid\\" DEFAULT \\"gen_random_uuid\\"() NOT NULL,\n    \\"key\\" character varying NOT NULL,\n    \\"value\\" \\"text\\",\n    \\"created_at\\" timestamp with time zone DEFAULT \\"now\\"() NOT NULL\n)","ALTER TABLE \\"public\\".\\"global_settings\\" OWNER TO \\"postgres\\"","CREATE TABLE IF NOT EXISTS \\"public\\".\\"messages\\" (\n    \\"id\\" \\"uuid\\" DEFAULT \\"gen_random_uuid\\"() NOT NULL,\n    \\"chat_id\\" \\"uuid\\" NOT NULL,\n    \\"sender_id\\" \\"uuid\\" NOT NULL,\n    \\"receiver_id\\" \\"uuid\\" NOT NULL,\n    \\"message_text\\" \\"text\\" NOT NULL,\n    \\"media_url\\" \\"text\\",\n    \\"sent_at\\" timestamp with time zone DEFAULT \\"now\\"() NOT NULL,\n    \\"status\\" character varying,\n    \\"created_at\\" timestamp with time zone DEFAULT \\"now\\"(),\n    CONSTRAINT \\"messages_status_check\\" CHECK (((\\"status\\")::\\"text\\" = ANY (ARRAY['sent'::\\"text\\", 'delivered'::\\"text\\", 'read'::\\"text\\"])))\n)","ALTER TABLE \\"public\\".\\"messages\\" OWNER TO \\"postgres\\"","CREATE TABLE IF NOT EXISTS \\"public\\".\\"notifications\\" (\n    \\"id\\" \\"uuid\\" DEFAULT \\"gen_random_uuid\\"() NOT NULL,\n    \\"user_id\\" \\"uuid\\" NOT NULL,\n    \\"title\\" character varying NOT NULL,\n    \\"message\\" \\"text\\",\n    \\"type\\" character varying NOT NULL,\n    \\"status\\" character varying,\n    \\"sent_at\\" timestamp with time zone DEFAULT \\"now\\"() NOT NULL,\n    \\"created_at\\" timestamp with time zone DEFAULT \\"now\\"() NOT NULL,\n    CONSTRAINT \\"notifications_status_check\\" CHECK (((\\"status\\")::\\"text\\" = ANY (ARRAY['delivered'::\\"text\\", 'read'::\\"text\\", 'failed'::\\"text\\"])))\n)","ALTER TABLE \\"public\\".\\"notifications\\" OWNER TO \\"postgres\\"","CREATE TABLE IF NOT EXISTS \\"public\\".\\"payments\\" (\n    \\"id\\" \\"uuid\\" DEFAULT \\"gen_random_uuid\\"() NOT NULL,\n    \\"booking_id\\" \\"uuid\\" NOT NULL,\n    \\"customer_id\\" \\"uuid\\" NOT NULL,\n    \\"worker_id\\" \\"uuid\\" NOT NULL,\n    \\"amount\\" numeric(10,2) NOT NULL,\n    \\"currency\\" character varying,\n    \\"payment_method\\" character varying NOT NULL,\n    \\"reference_id\\" character varying NOT NULL,\n    \\"payment_status\\" character varying,\n    \\"paid_at\\" timestamp with time zone,\n    \\"created_at\\" timestamp with time zone DEFAULT \\"now\\"() NOT NULL,\n    \\"deleted_at\\" timestamp with time zone,\n    CONSTRAINT \\"payments_payment_method_check\\" CHECK (((\\"payment_method\\")::\\"text\\" = ANY (ARRAY['card'::\\"text\\", 'wallet'::\\"text\\", 'cash'::\\"text\\"]))),\n    CONSTRAINT \\"payments_payment_status_check\\" CHECK (((\\"payment_status\\")::\\"text\\" = ANY (ARRAY['pending'::\\"text\\", 'successful'::\\"text\\", 'failed'::\\"text\\"])))\n)","ALTER TABLE \\"public\\".\\"payments\\" OWNER TO \\"postgres\\"","CREATE TABLE IF NOT EXISTS \\"public\\".\\"profile_settings\\" (\n    \\"id\\" \\"uuid\\" DEFAULT \\"gen_random_uuid\\"() NOT NULL,\n    \\"user_id\\" \\"uuid\\" NOT NULL,\n    \\"preference_key\\" character varying NOT NULL,\n    \\"preference_value\\" \\"text\\",\n    \\"created_at\\" timestamp with time zone DEFAULT \\"now\\"() NOT NULL\n)","ALTER TABLE \\"public\\".\\"profile_settings\\" OWNER TO \\"postgres\\"","CREATE TABLE IF NOT EXISTS \\"public\\".\\"ratings\\" (\n    \\"id\\" \\"uuid\\" DEFAULT \\"gen_random_uuid\\"() NOT NULL,\n    \\"booking_id\\" \\"uuid\\" NOT NULL,\n    \\"customer_id\\" \\"uuid\\" NOT NULL,\n    \\"worker_id\\" \\"uuid\\" NOT NULL,\n    \\"rating_value\\" integer NOT NULL,\n    \\"review_comment\\" \\"text\\",\n    \\"created_at\\" timestamp with time zone DEFAULT \\"now\\"() NOT NULL,\n    CONSTRAINT \\"ratings_rating_value_check\\" CHECK (((\\"rating_value\\" >= 1) AND (\\"rating_value\\" <= 5)))\n)","ALTER TABLE \\"public\\".\\"ratings\\" OWNER TO \\"postgres\\"","CREATE TABLE IF NOT EXISTS \\"public\\".\\"user_presence\\" (\n    \\"id\\" \\"uuid\\" DEFAULT \\"gen_random_uuid\\"() NOT NULL,\n    \\"user_id\\" \\"uuid\\" NOT NULL,\n    \\"last_seen\\" timestamp with time zone DEFAULT \\"now\\"(),\n    \\"is_online\\" boolean DEFAULT false NOT NULL\n)","ALTER TABLE \\"public\\".\\"user_presence\\" OWNER TO \\"postgres\\"","CREATE TABLE IF NOT EXISTS \\"public\\".\\"users\\" (\n    \\"id\\" \\"uuid\\" NOT NULL,\n    \\"firstname\\" character varying NOT NULL,\n    \\"lastname\\" character varying NOT NULL,\n    \\"role\\" character varying NOT NULL,\n    \\"profile_pic_url\\" \\"text\\",\n    \\"bio\\" \\"text\\",\n    \\"status\\" character varying,\n    \\"created_at\\" timestamp with time zone DEFAULT \\"now\\"(),\n    \\"deleted_at\\" timestamp with time zone,\n    CONSTRAINT \\"users_role_check\\" CHECK (((\\"role\\")::\\"text\\" = ANY (ARRAY['customer'::\\"text\\", 'worker'::\\"text\\", 'admin'::\\"text\\"]))),\n    CONSTRAINT \\"users_status_check\\" CHECK (((\\"status\\")::\\"text\\" = ANY (ARRAY['active'::\\"text\\", 'inactive'::\\"text\\", 'banned'::\\"text\\"])))\n)","ALTER TABLE \\"public\\".\\"users\\" OWNER TO \\"postgres\\"","CREATE TABLE IF NOT EXISTS \\"public\\".\\"worker_posts\\" (\n    \\"id\\" \\"uuid\\" DEFAULT \\"gen_random_uuid\\"() NOT NULL,\n    \\"worker_id\\" \\"uuid\\" NOT NULL,\n    \\"title\\" character varying NOT NULL,\n    \\"content\\" \\"text\\" NOT NULL,\n    \\"media_url\\" \\"text\\",\n    \\"status\\" character varying,\n    \\"created_at\\" timestamp with time zone DEFAULT \\"now\\"()\n)","ALTER TABLE \\"public\\".\\"worker_posts\\" OWNER TO \\"postgres\\"","CREATE TABLE IF NOT EXISTS \\"public\\".\\"workers\\" (\n    \\"id\\" \\"uuid\\" DEFAULT \\"gen_random_uuid\\"() NOT NULL,\n    \\"worker_id\\" \\"uuid\\" NOT NULL,\n    \\"skills\\" \\"text\\"[],\n    \\"status\\" character varying DEFAULT 'active'::character varying,\n    \\"created_at\\" timestamp with time zone DEFAULT \\"now\\"() NOT NULL,\n    \\"deleted_at\\" timestamp with time zone,\n    CONSTRAINT \\"workers_status_check\\" CHECK (((\\"status\\")::\\"text\\" = ANY (ARRAY['available'::\\"text\\", 'busy'::\\"text\\", 'suspended'::\\"text\\"])))\n)","ALTER TABLE \\"public\\".\\"workers\\" OWNER TO \\"postgres\\"","CREATE TABLE IF NOT EXISTS \\"public\\".\\"workers_categories\\" (\n    \\"id\\" \\"uuid\\" DEFAULT \\"gen_random_uuid\\"() NOT NULL,\n    \\"worker_id\\" \\"uuid\\" NOT NULL,\n    \\"category_id\\" \\"uuid\\" NOT NULL,\n    \\"created_at\\" timestamp with time zone DEFAULT \\"now\\"() NOT NULL\n)","ALTER TABLE \\"public\\".\\"workers_categories\\" OWNER TO \\"postgres\\"","ALTER TABLE ONLY \\"public\\".\\"bookings\\"\n    ADD CONSTRAINT \\"bookings_pkey\\" PRIMARY KEY (\\"id\\")","ALTER TABLE ONLY \\"public\\".\\"categories\\"\n    ADD CONSTRAINT \\"categories_name_key\\" UNIQUE (\\"name\\")","ALTER TABLE ONLY \\"public\\".\\"categories\\"\n    ADD CONSTRAINT \\"categories_pkey\\" PRIMARY KEY (\\"id\\")","ALTER TABLE ONLY \\"public\\".\\"chats\\"\n    ADD CONSTRAINT \\"chats_pkey\\" PRIMARY KEY (\\"id\\")","ALTER TABLE ONLY \\"public\\".\\"credit_transactions\\"\n    ADD CONSTRAINT \\"credit_transactions_pkey\\" PRIMARY KEY (\\"id\\")","ALTER TABLE ONLY \\"public\\".\\"credits\\"\n    ADD CONSTRAINT \\"credits_pkey\\" PRIMARY KEY (\\"id\\")","ALTER TABLE ONLY \\"public\\".\\"favorites\\"\n    ADD CONSTRAINT \\"favorites_pkey\\" PRIMARY KEY (\\"id\\")","ALTER TABLE ONLY \\"public\\".\\"global_settings\\"\n    ADD CONSTRAINT \\"global_settings_key_key\\" UNIQUE (\\"key\\")","ALTER TABLE ONLY \\"public\\".\\"global_settings\\"\n    ADD CONSTRAINT \\"global_settings_pkey\\" PRIMARY KEY (\\"id\\")","ALTER TABLE ONLY \\"public\\".\\"messages\\"\n    ADD CONSTRAINT \\"messages_pkey\\" PRIMARY KEY (\\"id\\")","ALTER TABLE ONLY \\"public\\".\\"notifications\\"\n    ADD CONSTRAINT \\"notifications_pkey\\" PRIMARY KEY (\\"id\\")","ALTER TABLE ONLY \\"public\\".\\"payments\\"\n    ADD CONSTRAINT \\"payments_pkey\\" PRIMARY KEY (\\"id\\")","ALTER TABLE ONLY \\"public\\".\\"payments\\"\n    ADD CONSTRAINT \\"payments_reference_id_key\\" UNIQUE (\\"reference_id\\")","ALTER TABLE ONLY \\"public\\".\\"profile_settings\\"\n    ADD CONSTRAINT \\"profile_settings_pkey\\" PRIMARY KEY (\\"id\\")","ALTER TABLE ONLY \\"public\\".\\"ratings\\"\n    ADD CONSTRAINT \\"ratings_pkey\\" PRIMARY KEY (\\"id\\")","ALTER TABLE ONLY \\"public\\".\\"user_presence\\"\n    ADD CONSTRAINT \\"user_presence_pkey\\" PRIMARY KEY (\\"id\\")","ALTER TABLE ONLY \\"public\\".\\"users\\"\n    ADD CONSTRAINT \\"users_pkey\\" PRIMARY KEY (\\"id\\")","ALTER TABLE ONLY \\"public\\".\\"worker_posts\\"\n    ADD CONSTRAINT \\"worker_posts_pkey\\" PRIMARY KEY (\\"id\\")","ALTER TABLE ONLY \\"public\\".\\"workers_categories\\"\n    ADD CONSTRAINT \\"workers_categories_pkey\\" PRIMARY KEY (\\"id\\")","ALTER TABLE ONLY \\"public\\".\\"workers\\"\n    ADD CONSTRAINT \\"workers_pkey\\" PRIMARY KEY (\\"id\\")","ALTER TABLE ONLY \\"public\\".\\"bookings\\"\n    ADD CONSTRAINT \\"bookings_category_id_fkey\\" FOREIGN KEY (\\"category_id\\") REFERENCES \\"public\\".\\"categories\\"(\\"id\\") ON DELETE CASCADE","ALTER TABLE ONLY \\"public\\".\\"bookings\\"\n    ADD CONSTRAINT \\"bookings_customer_id_fkey\\" FOREIGN KEY (\\"customer_id\\") REFERENCES \\"public\\".\\"users\\"(\\"id\\") ON DELETE CASCADE","ALTER TABLE ONLY \\"public\\".\\"bookings\\"\n    ADD CONSTRAINT \\"bookings_worker_id_fkey\\" FOREIGN KEY (\\"worker_id\\") REFERENCES \\"public\\".\\"users\\"(\\"id\\") ON DELETE CASCADE","ALTER TABLE ONLY \\"public\\".\\"chats\\"\n    ADD CONSTRAINT \\"chats_booking_id_fkey\\" FOREIGN KEY (\\"booking_id\\") REFERENCES \\"public\\".\\"bookings\\"(\\"id\\") ON DELETE CASCADE","ALTER TABLE ONLY \\"public\\".\\"chats\\"\n    ADD CONSTRAINT \\"chats_customer_id_fkey\\" FOREIGN KEY (\\"customer_id\\") REFERENCES \\"public\\".\\"users\\"(\\"id\\") ON DELETE CASCADE","ALTER TABLE ONLY \\"public\\".\\"chats\\"\n    ADD CONSTRAINT \\"chats_worker_id_fkey\\" FOREIGN KEY (\\"worker_id\\") REFERENCES \\"public\\".\\"users\\"(\\"id\\") ON DELETE CASCADE","ALTER TABLE ONLY \\"public\\".\\"credit_transactions\\"\n    ADD CONSTRAINT \\"credit_transactions_booking_id_fkey\\" FOREIGN KEY (\\"booking_id\\") REFERENCES \\"public\\".\\"bookings\\"(\\"id\\")","ALTER TABLE ONLY \\"public\\".\\"credit_transactions\\"\n    ADD CONSTRAINT \\"credit_transactions_credit_id_fkey\\" FOREIGN KEY (\\"credit_id\\") REFERENCES \\"public\\".\\"credits\\"(\\"id\\") ON DELETE CASCADE","ALTER TABLE ONLY \\"public\\".\\"credits\\"\n    ADD CONSTRAINT \\"credits_worker_id_fkey\\" FOREIGN KEY (\\"worker_id\\") REFERENCES \\"public\\".\\"users\\"(\\"id\\") ON DELETE CASCADE","ALTER TABLE ONLY \\"public\\".\\"favorites\\"\n    ADD CONSTRAINT \\"favorites_customer_id_fkey\\" FOREIGN KEY (\\"customer_id\\") REFERENCES \\"public\\".\\"users\\"(\\"id\\") ON DELETE CASCADE","ALTER TABLE ONLY \\"public\\".\\"favorites\\"\n    ADD CONSTRAINT \\"favorites_worker_id_fkey\\" FOREIGN KEY (\\"worker_id\\") REFERENCES \\"public\\".\\"users\\"(\\"id\\") ON DELETE CASCADE","ALTER TABLE ONLY \\"public\\".\\"messages\\"\n    ADD CONSTRAINT \\"messages_chat_id_fkey\\" FOREIGN KEY (\\"chat_id\\") REFERENCES \\"public\\".\\"chats\\"(\\"id\\") ON DELETE CASCADE","ALTER TABLE ONLY \\"public\\".\\"messages\\"\n    ADD CONSTRAINT \\"messages_receiver_id_fkey\\" FOREIGN KEY (\\"receiver_id\\") REFERENCES \\"public\\".\\"users\\"(\\"id\\") ON DELETE CASCADE","ALTER TABLE ONLY \\"public\\".\\"messages\\"\n    ADD CONSTRAINT \\"messages_sender_id_fkey\\" FOREIGN KEY (\\"sender_id\\") REFERENCES \\"public\\".\\"users\\"(\\"id\\") ON DELETE CASCADE","ALTER TABLE ONLY \\"public\\".\\"notifications\\"\n    ADD CONSTRAINT \\"notifications_user_id_fkey\\" FOREIGN KEY (\\"user_id\\") REFERENCES \\"public\\".\\"users\\"(\\"id\\") ON DELETE CASCADE","ALTER TABLE ONLY \\"public\\".\\"payments\\"\n    ADD CONSTRAINT \\"payments_booking_id_fkey\\" FOREIGN KEY (\\"booking_id\\") REFERENCES \\"public\\".\\"bookings\\"(\\"id\\") ON DELETE CASCADE","ALTER TABLE ONLY \\"public\\".\\"payments\\"\n    ADD CONSTRAINT \\"payments_customer_id_fkey\\" FOREIGN KEY (\\"customer_id\\") REFERENCES \\"public\\".\\"users\\"(\\"id\\") ON DELETE CASCADE","ALTER TABLE ONLY \\"public\\".\\"payments\\"\n    ADD CONSTRAINT \\"payments_worker_id_fkey\\" FOREIGN KEY (\\"worker_id\\") REFERENCES \\"public\\".\\"users\\"(\\"id\\") ON DELETE CASCADE","ALTER TABLE ONLY \\"public\\".\\"profile_settings\\"\n    ADD CONSTRAINT \\"profile_settings_user_id_fkey\\" FOREIGN KEY (\\"user_id\\") REFERENCES \\"public\\".\\"users\\"(\\"id\\") ON DELETE CASCADE","ALTER TABLE ONLY \\"public\\".\\"ratings\\"\n    ADD CONSTRAINT \\"ratings_booking_id_fkey\\" FOREIGN KEY (\\"booking_id\\") REFERENCES \\"public\\".\\"bookings\\"(\\"id\\") ON DELETE CASCADE","ALTER TABLE ONLY \\"public\\".\\"ratings\\"\n    ADD CONSTRAINT \\"ratings_customer_id_fkey\\" FOREIGN KEY (\\"customer_id\\") REFERENCES \\"public\\".\\"users\\"(\\"id\\") ON DELETE CASCADE","ALTER TABLE ONLY \\"public\\".\\"ratings\\"\n    ADD CONSTRAINT \\"ratings_worker_id_fkey\\" FOREIGN KEY (\\"worker_id\\") REFERENCES \\"public\\".\\"users\\"(\\"id\\") ON DELETE CASCADE","ALTER TABLE ONLY \\"public\\".\\"user_presence\\"\n    ADD CONSTRAINT \\"user_presence_user_id_fkey\\" FOREIGN KEY (\\"user_id\\") REFERENCES \\"public\\".\\"users\\"(\\"id\\") ON DELETE CASCADE","ALTER TABLE ONLY \\"public\\".\\"worker_posts\\"\n    ADD CONSTRAINT \\"worker_posts_worker_id_fkey\\" FOREIGN KEY (\\"worker_id\\") REFERENCES \\"public\\".\\"users\\"(\\"id\\") ON DELETE CASCADE","ALTER TABLE ONLY \\"public\\".\\"workers_categories\\"\n    ADD CONSTRAINT \\"workers_categories_category_id_fkey\\" FOREIGN KEY (\\"category_id\\") REFERENCES \\"public\\".\\"categories\\"(\\"id\\") ON DELETE CASCADE","ALTER TABLE ONLY \\"public\\".\\"workers_categories\\"\n    ADD CONSTRAINT \\"workers_categories_worker_id_fkey\\" FOREIGN KEY (\\"worker_id\\") REFERENCES \\"public\\".\\"users\\"(\\"id\\") ON DELETE CASCADE","ALTER TABLE ONLY \\"public\\".\\"workers\\"\n    ADD CONSTRAINT \\"workers_worker_id_fkey\\" FOREIGN KEY (\\"worker_id\\") REFERENCES \\"public\\".\\"users\\"(\\"id\\") ON DELETE CASCADE","CREATE POLICY \\"Admin manages categories\\" ON \\"public\\".\\"categories\\" USING ((EXISTS ( SELECT 1\n   FROM \\"public\\".\\"users\\"\n  WHERE ((\\"users\\".\\"id\\" = \\"auth\\".\\"uid\\"()) AND ((\\"users\\".\\"role\\")::\\"text\\" = 'admin'::\\"text\\")))))","CREATE POLICY \\"Admin manages global settings\\" ON \\"public\\".\\"global_settings\\" USING ((EXISTS ( SELECT 1\n   FROM \\"public\\".\\"users\\"\n  WHERE ((\\"users\\".\\"id\\" = \\"auth\\".\\"uid\\"()) AND ((\\"users\\".\\"role\\")::\\"text\\" = 'admin'::\\"text\\")))))","CREATE POLICY \\"Booking updatable by participants\\" ON \\"public\\".\\"bookings\\" FOR UPDATE USING (((\\"customer_id\\" = \\"auth\\".\\"uid\\"()) OR (\\"worker_id\\" = \\"auth\\".\\"uid\\"())))","CREATE POLICY \\"Booking visible to customer or worker\\" ON \\"public\\".\\"bookings\\" FOR SELECT USING (((\\"customer_id\\" = \\"auth\\".\\"uid\\"()) OR (\\"worker_id\\" = \\"auth\\".\\"uid\\"())))","CREATE POLICY \\"Chats creatable for participants\\" ON \\"public\\".\\"chats\\" FOR INSERT WITH CHECK (((\\"customer_id\\" = \\"auth\\".\\"uid\\"()) OR (\\"worker_id\\" = \\"auth\\".\\"uid\\"())))","CREATE POLICY \\"Chats visible to participants\\" ON \\"public\\".\\"chats\\" FOR SELECT USING (((\\"customer_id\\" = \\"auth\\".\\"uid\\"()) OR (\\"worker_id\\" = \\"auth\\".\\"uid\\"())))","CREATE POLICY \\"Customer creates own booking\\" ON \\"public\\".\\"bookings\\" FOR INSERT WITH CHECK ((\\"customer_id\\" = \\"auth\\".\\"uid\\"()))","CREATE POLICY \\"Customer manages own favorites\\" ON \\"public\\".\\"favorites\\" USING ((\\"customer_id\\" = \\"auth\\".\\"uid\\"())) WITH CHECK ((\\"customer_id\\" = \\"auth\\".\\"uid\\"()))","CREATE POLICY \\"Customers can rate after booking\\" ON \\"public\\".\\"ratings\\" FOR INSERT WITH CHECK ((\\"customer_id\\" = \\"auth\\".\\"uid\\"()))","CREATE POLICY \\"Everyone can view posts\\" ON \\"public\\".\\"worker_posts\\" FOR SELECT USING (true)","CREATE POLICY \\"Everyone can view worker profiles\\" ON \\"public\\".\\"workers\\" FOR SELECT USING (true)","CREATE POLICY \\"Messages visible to participants\\" ON \\"public\\".\\"messages\\" FOR SELECT USING (((\\"sender_id\\" = \\"auth\\".\\"uid\\"()) OR (\\"receiver_id\\" = \\"auth\\".\\"uid\\"())))","CREATE POLICY \\"Payments visible to related users\\" ON \\"public\\".\\"payments\\" FOR SELECT USING (((\\"customer_id\\" = \\"auth\\".\\"uid\\"()) OR (\\"worker_id\\" = \\"auth\\".\\"uid\\"())))","CREATE POLICY \\"Public can view categories\\" ON \\"public\\".\\"categories\\" FOR SELECT USING (true)","CREATE POLICY \\"Public read global settings\\" ON \\"public\\".\\"global_settings\\" FOR SELECT USING (true)","CREATE POLICY \\"Ratings visible to related users\\" ON \\"public\\".\\"ratings\\" FOR SELECT USING (((\\"customer_id\\" = \\"auth\\".\\"uid\\"()) OR (\\"worker_id\\" = \\"auth\\".\\"uid\\"())))","CREATE POLICY \\"User manages own profile settings\\" ON \\"public\\".\\"profile_settings\\" USING ((\\"user_id\\" = \\"auth\\".\\"uid\\"())) WITH CHECK ((\\"user_id\\" = \\"auth\\".\\"uid\\"()))","CREATE POLICY \\"Users can send messages\\" ON \\"public\\".\\"messages\\" FOR INSERT WITH CHECK ((\\"sender_id\\" = \\"auth\\".\\"uid\\"()))","CREATE POLICY \\"Users can update own profile\\" ON \\"public\\".\\"users\\" FOR UPDATE USING ((\\"id\\" = \\"auth\\".\\"uid\\"())) WITH CHECK ((\\"id\\" = \\"auth\\".\\"uid\\"()))","CREATE POLICY \\"Users can view own profile\\" ON \\"public\\".\\"users\\" FOR SELECT USING ((\\"id\\" = \\"auth\\".\\"uid\\"()))","CREATE POLICY \\"Users can view their own notifications\\" ON \\"public\\".\\"notifications\\" FOR SELECT USING ((\\"user_id\\" = \\"auth\\".\\"uid\\"()))","CREATE POLICY \\"Worker can update own worker record\\" ON \\"public\\".\\"workers\\" FOR UPDATE USING ((\\"worker_id\\" = \\"auth\\".\\"uid\\"())) WITH CHECK ((\\"worker_id\\" = \\"auth\\".\\"uid\\"()))","CREATE POLICY \\"Worker manages own posts\\" ON \\"public\\".\\"worker_posts\\" USING ((\\"worker_id\\" = \\"auth\\".\\"uid\\"())) WITH CHECK ((\\"worker_id\\" = \\"auth\\".\\"uid\\"()))","CREATE POLICY \\"Worker manages their categories\\" ON \\"public\\".\\"workers_categories\\" USING ((\\"worker_id\\" = \\"auth\\".\\"uid\\"())) WITH CHECK ((\\"worker_id\\" = \\"auth\\".\\"uid\\"()))","CREATE POLICY \\"Worker sees own credits\\" ON \\"public\\".\\"credits\\" FOR SELECT USING ((\\"worker_id\\" = \\"auth\\".\\"uid\\"()))","CREATE POLICY \\"Worker sees transactions of their credits\\" ON \\"public\\".\\"credit_transactions\\" FOR SELECT USING ((EXISTS ( SELECT 1\n   FROM \\"public\\".\\"credits\\" \\"c\\"\n  WHERE ((\\"c\\".\\"id\\" = \\"credit_transactions\\".\\"credit_id\\") AND (\\"c\\".\\"worker_id\\" = \\"auth\\".\\"uid\\"())))))","ALTER TABLE \\"public\\".\\"bookings\\" ENABLE ROW LEVEL SECURITY","ALTER TABLE \\"public\\".\\"categories\\" ENABLE ROW LEVEL SECURITY","ALTER TABLE \\"public\\".\\"chats\\" ENABLE ROW LEVEL SECURITY","ALTER TABLE \\"public\\".\\"credit_transactions\\" ENABLE ROW LEVEL SECURITY","ALTER TABLE \\"public\\".\\"credits\\" ENABLE ROW LEVEL SECURITY","ALTER TABLE \\"public\\".\\"favorites\\" ENABLE ROW LEVEL SECURITY","ALTER TABLE \\"public\\".\\"global_settings\\" ENABLE ROW LEVEL SECURITY","ALTER TABLE \\"public\\".\\"messages\\" ENABLE ROW LEVEL SECURITY","ALTER TABLE \\"public\\".\\"notifications\\" ENABLE ROW LEVEL SECURITY","ALTER TABLE \\"public\\".\\"payments\\" ENABLE ROW LEVEL SECURITY","ALTER TABLE \\"public\\".\\"profile_settings\\" ENABLE ROW LEVEL SECURITY","ALTER TABLE \\"public\\".\\"ratings\\" ENABLE ROW LEVEL SECURITY","ALTER TABLE \\"public\\".\\"user_presence\\" ENABLE ROW LEVEL SECURITY","ALTER TABLE \\"public\\".\\"users\\" ENABLE ROW LEVEL SECURITY","ALTER TABLE \\"public\\".\\"worker_posts\\" ENABLE ROW LEVEL SECURITY","ALTER TABLE \\"public\\".\\"workers\\" ENABLE ROW LEVEL SECURITY","ALTER TABLE \\"public\\".\\"workers_categories\\" ENABLE ROW LEVEL SECURITY","GRANT USAGE ON SCHEMA \\"public\\" TO \\"postgres\\"","GRANT USAGE ON SCHEMA \\"public\\" TO \\"anon\\"","GRANT USAGE ON SCHEMA \\"public\\" TO \\"authenticated\\"","GRANT USAGE ON SCHEMA \\"public\\" TO \\"service_role\\"","GRANT ALL ON FUNCTION \\"public\\".\\"handle_new_auth_user\\"() TO \\"anon\\"","GRANT ALL ON FUNCTION \\"public\\".\\"handle_new_auth_user\\"() TO \\"authenticated\\"","GRANT ALL ON FUNCTION \\"public\\".\\"handle_new_auth_user\\"() TO \\"service_role\\"","GRANT ALL ON TABLE \\"public\\".\\"bookings\\" TO \\"anon\\"","GRANT ALL ON TABLE \\"public\\".\\"bookings\\" TO \\"authenticated\\"","GRANT ALL ON TABLE \\"public\\".\\"bookings\\" TO \\"service_role\\"","GRANT ALL ON TABLE \\"public\\".\\"categories\\" TO \\"anon\\"","GRANT ALL ON TABLE \\"public\\".\\"categories\\" TO \\"authenticated\\"","GRANT ALL ON TABLE \\"public\\".\\"categories\\" TO \\"service_role\\"","GRANT ALL ON TABLE \\"public\\".\\"chats\\" TO \\"anon\\"","GRANT ALL ON TABLE \\"public\\".\\"chats\\" TO \\"authenticated\\"","GRANT ALL ON TABLE \\"public\\".\\"chats\\" TO \\"service_role\\"","GRANT ALL ON TABLE \\"public\\".\\"credit_transactions\\" TO \\"anon\\"","GRANT ALL ON TABLE \\"public\\".\\"credit_transactions\\" TO \\"authenticated\\"","GRANT ALL ON TABLE \\"public\\".\\"credit_transactions\\" TO \\"service_role\\"","GRANT ALL ON TABLE \\"public\\".\\"credits\\" TO \\"anon\\"","GRANT ALL ON TABLE \\"public\\".\\"credits\\" TO \\"authenticated\\"","GRANT ALL ON TABLE \\"public\\".\\"credits\\" TO \\"service_role\\"","GRANT ALL ON TABLE \\"public\\".\\"favorites\\" TO \\"anon\\"","GRANT ALL ON TABLE \\"public\\".\\"favorites\\" TO \\"authenticated\\"","GRANT ALL ON TABLE \\"public\\".\\"favorites\\" TO \\"service_role\\"","GRANT ALL ON TABLE \\"public\\".\\"global_settings\\" TO \\"anon\\"","GRANT ALL ON TABLE \\"public\\".\\"global_settings\\" TO \\"authenticated\\"","GRANT ALL ON TABLE \\"public\\".\\"global_settings\\" TO \\"service_role\\"","GRANT ALL ON TABLE \\"public\\".\\"messages\\" TO \\"anon\\"","GRANT ALL ON TABLE \\"public\\".\\"messages\\" TO \\"authenticated\\"","GRANT ALL ON TABLE \\"public\\".\\"messages\\" TO \\"service_role\\"","GRANT ALL ON TABLE \\"public\\".\\"notifications\\" TO \\"anon\\"","GRANT ALL ON TABLE \\"public\\".\\"notifications\\" TO \\"authenticated\\"","GRANT ALL ON TABLE \\"public\\".\\"notifications\\" TO \\"service_role\\"","GRANT ALL ON TABLE \\"public\\".\\"payments\\" TO \\"anon\\"","GRANT ALL ON TABLE \\"public\\".\\"payments\\" TO \\"authenticated\\"","GRANT ALL ON TABLE \\"public\\".\\"payments\\" TO \\"service_role\\"","GRANT ALL ON TABLE \\"public\\".\\"profile_settings\\" TO \\"anon\\"","GRANT ALL ON TABLE \\"public\\".\\"profile_settings\\" TO \\"authenticated\\"","GRANT ALL ON TABLE \\"public\\".\\"profile_settings\\" TO \\"service_role\\"","GRANT ALL ON TABLE \\"public\\".\\"ratings\\" TO \\"anon\\"","GRANT ALL ON TABLE \\"public\\".\\"ratings\\" TO \\"authenticated\\"","GRANT ALL ON TABLE \\"public\\".\\"ratings\\" TO \\"service_role\\"","GRANT ALL ON TABLE \\"public\\".\\"user_presence\\" TO \\"anon\\"","GRANT ALL ON TABLE \\"public\\".\\"user_presence\\" TO \\"authenticated\\"","GRANT ALL ON TABLE \\"public\\".\\"user_presence\\" TO \\"service_role\\"","GRANT ALL ON TABLE \\"public\\".\\"users\\" TO \\"anon\\"","GRANT ALL ON TABLE \\"public\\".\\"users\\" TO \\"authenticated\\"","GRANT ALL ON TABLE \\"public\\".\\"users\\" TO \\"service_role\\"","GRANT ALL ON TABLE \\"public\\".\\"worker_posts\\" TO \\"anon\\"","GRANT ALL ON TABLE \\"public\\".\\"worker_posts\\" TO \\"authenticated\\"","GRANT ALL ON TABLE \\"public\\".\\"worker_posts\\" TO \\"service_role\\"","GRANT ALL ON TABLE \\"public\\".\\"workers\\" TO \\"anon\\"","GRANT ALL ON TABLE \\"public\\".\\"workers\\" TO \\"authenticated\\"","GRANT ALL ON TABLE \\"public\\".\\"workers\\" TO \\"service_role\\"","GRANT ALL ON TABLE \\"public\\".\\"workers_categories\\" TO \\"anon\\"","GRANT ALL ON TABLE \\"public\\".\\"workers_categories\\" TO \\"authenticated\\"","GRANT ALL ON TABLE \\"public\\".\\"workers_categories\\" TO \\"service_role\\"","ALTER DEFAULT PRIVILEGES FOR ROLE \\"postgres\\" IN SCHEMA \\"public\\" GRANT ALL ON SEQUENCES TO \\"postgres\\"","ALTER DEFAULT PRIVILEGES FOR ROLE \\"postgres\\" IN SCHEMA \\"public\\" GRANT ALL ON SEQUENCES TO \\"anon\\"","ALTER DEFAULT PRIVILEGES FOR ROLE \\"postgres\\" IN SCHEMA \\"public\\" GRANT ALL ON SEQUENCES TO \\"authenticated\\"","ALTER DEFAULT PRIVILEGES FOR ROLE \\"postgres\\" IN SCHEMA \\"public\\" GRANT ALL ON SEQUENCES TO \\"service_role\\"","ALTER DEFAULT PRIVILEGES FOR ROLE \\"postgres\\" IN SCHEMA \\"public\\" GRANT ALL ON FUNCTIONS TO \\"postgres\\"","ALTER DEFAULT PRIVILEGES FOR ROLE \\"postgres\\" IN SCHEMA \\"public\\" GRANT ALL ON FUNCTIONS TO \\"anon\\"","ALTER DEFAULT PRIVILEGES FOR ROLE \\"postgres\\" IN SCHEMA \\"public\\" GRANT ALL ON FUNCTIONS TO \\"authenticated\\"","ALTER DEFAULT PRIVILEGES FOR ROLE \\"postgres\\" IN SCHEMA \\"public\\" GRANT ALL ON FUNCTIONS TO \\"service_role\\"","ALTER DEFAULT PRIVILEGES FOR ROLE \\"postgres\\" IN SCHEMA \\"public\\" GRANT ALL ON TABLES TO \\"postgres\\"","ALTER DEFAULT PRIVILEGES FOR ROLE \\"postgres\\" IN SCHEMA \\"public\\" GRANT ALL ON TABLES TO \\"anon\\"","ALTER DEFAULT PRIVILEGES FOR ROLE \\"postgres\\" IN SCHEMA \\"public\\" GRANT ALL ON TABLES TO \\"authenticated\\"","ALTER DEFAULT PRIVILEGES FOR ROLE \\"postgres\\" IN SCHEMA \\"public\\" GRANT ALL ON TABLES TO \\"service_role\\"","RESET ALL"}	production_schema
20251025120000	{"-- Update the handle_new_auth_user trigger to populate firstname and lastname from user metadata\n-- This migration updates the trigger to extract first_name and last_name from auth user metadata\n-- and populates the public.users table fields during signup\n\n-- Drop the existing trigger and function\nDROP TRIGGER IF EXISTS on_auth_user_created ON auth.users","DROP FUNCTION IF EXISTS public.handle_new_auth_user() CASCADE","-- Create the updated function with firstname and lastname population\nCREATE OR REPLACE FUNCTION public.handle_new_auth_user()\nRETURNS trigger\nLANGUAGE plpgsql\nSECURITY DEFINER\nAS $$\nBEGIN\n  INSERT INTO public.users (id, firstname, lastname, role, status)\n  VALUES (\n    new.id,\n    COALESCE(new.raw_user_meta_data->>'first_name', 'Unknown'),\n    COALESCE(new.raw_user_meta_data->>'last_name', 'User'),\n    'customer',\n    'active'\n  );\n  RETURN new;\nEND;\n$$","-- Create the trigger\nCREATE TRIGGER on_auth_user_created\n  AFTER INSERT ON auth.users\n  FOR EACH ROW EXECUTE FUNCTION public.handle_new_auth_user()","-- Migrate existing users' names from auth.users metadata to public.users\n-- This updates all users who currently have empty or missing firstname/lastname\n-- Safe to run multiple times (idempotent)\nUPDATE public.users u\nSET\n  firstname = COALESCE(NULLIF(au.raw_user_meta_data->>'first_name', ''), u.firstname, ''),\n  lastname = COALESCE(NULLIF(au.raw_user_meta_data->>'last_name', ''), u.lastname, '')\nFROM auth.users au\nWHERE u.id = au.id\n  AND (\n    u.firstname IS NULL\n    OR u.firstname = ''\n    OR u.lastname IS NULL\n    OR u.lastname = ''\n  )\n  AND au.raw_user_meta_data IS NOT NULL"}	update_user_trigger
20251210103000	{"-- Add worker profile fields needed for search page\n-- This migration adds fields for location, rates, experience, and verification\n\n-- Add location fields to users table\nALTER TABLE public.users\nADD COLUMN IF NOT EXISTS city VARCHAR,\nADD COLUMN IF NOT EXISTS state VARCHAR,\nADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8),\nADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8)","-- Add worker-specific fields to workers table\nALTER TABLE public.workers\nADD COLUMN IF NOT EXISTS hourly_rate_min INTEGER,\nADD COLUMN IF NOT EXISTS hourly_rate_max INTEGER,\nADD COLUMN IF NOT EXISTS years_experience INTEGER DEFAULT 0,\nADD COLUMN IF NOT EXISTS jobs_completed INTEGER DEFAULT 0,\nADD COLUMN IF NOT EXISTS response_time_minutes INTEGER DEFAULT 60,\nADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false,\nADD COLUMN IF NOT EXISTS profession VARCHAR","-- Add indexes for search performance\nCREATE INDEX IF NOT EXISTS idx_users_city ON public.users(city)","CREATE INDEX IF NOT EXISTS idx_users_state ON public.users(state)","CREATE INDEX IF NOT EXISTS idx_users_location ON public.users(latitude, longitude)","CREATE INDEX IF NOT EXISTS idx_workers_profession ON public.workers(profession)","CREATE INDEX IF NOT EXISTS idx_workers_hourly_rate ON public.workers(hourly_rate_min, hourly_rate_max)","CREATE INDEX IF NOT EXISTS idx_workers_verified ON public.workers(is_verified)","-- Add comments for documentation\nCOMMENT ON COLUMN public.users.city IS 'City where the user is located'","COMMENT ON COLUMN public.users.state IS 'State/Province where the user is located'","COMMENT ON COLUMN public.users.latitude IS 'Latitude coordinate for location-based search'","COMMENT ON COLUMN public.users.longitude IS 'Longitude coordinate for location-based search'","COMMENT ON COLUMN public.workers.hourly_rate_min IS 'Minimum hourly rate in PHP'","COMMENT ON COLUMN public.workers.hourly_rate_max IS 'Maximum hourly rate in PHP'","COMMENT ON COLUMN public.workers.years_experience IS 'Number of years of professional experience'","COMMENT ON COLUMN public.workers.jobs_completed IS 'Total number of completed jobs'","COMMENT ON COLUMN public.workers.response_time_minutes IS 'Average response time in minutes'","COMMENT ON COLUMN public.workers.is_verified IS 'Whether the worker has been verified'","COMMENT ON COLUMN public.workers.profession IS 'Primary profession/service category'"}	add_worker_profile_fields
\.


--
-- Data for Name: secrets; Type: TABLE DATA; Schema: vault; Owner: -
--

COPY vault.secrets (id, name, description, secret, key_id, nonce, created_at, updated_at) FROM stdin;
\.


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: -
--

SELECT pg_catalog.setval('auth.refresh_tokens_id_seq', 8, true);


--
-- Name: subscription_id_seq; Type: SEQUENCE SET; Schema: realtime; Owner: -
--

SELECT pg_catalog.setval('realtime.subscription_id_seq', 1, false);


--
-- Name: hooks_id_seq; Type: SEQUENCE SET; Schema: supabase_functions; Owner: -
--

SELECT pg_catalog.setval('supabase_functions.hooks_id_seq', 1, false);


--
-- Name: extensions extensions_pkey; Type: CONSTRAINT; Schema: _realtime; Owner: -
--

ALTER TABLE ONLY _realtime.extensions
    ADD CONSTRAINT extensions_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: _realtime; Owner: -
--

ALTER TABLE ONLY _realtime.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: tenants tenants_pkey; Type: CONSTRAINT; Schema: _realtime; Owner: -
--

ALTER TABLE ONLY _realtime.tenants
    ADD CONSTRAINT tenants_pkey PRIMARY KEY (id);


--
-- Name: mfa_amr_claims amr_id_pk; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT amr_id_pk PRIMARY KEY (id);


--
-- Name: audit_log_entries audit_log_entries_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.audit_log_entries
    ADD CONSTRAINT audit_log_entries_pkey PRIMARY KEY (id);


--
-- Name: flow_state flow_state_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.flow_state
    ADD CONSTRAINT flow_state_pkey PRIMARY KEY (id);


--
-- Name: identities identities_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_pkey PRIMARY KEY (id);


--
-- Name: identities identities_provider_id_provider_unique; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_provider_id_provider_unique UNIQUE (provider_id, provider);


--
-- Name: instances instances_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.instances
    ADD CONSTRAINT instances_pkey PRIMARY KEY (id);


--
-- Name: mfa_amr_claims mfa_amr_claims_session_id_authentication_method_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT mfa_amr_claims_session_id_authentication_method_pkey UNIQUE (session_id, authentication_method);


--
-- Name: mfa_challenges mfa_challenges_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_challenges
    ADD CONSTRAINT mfa_challenges_pkey PRIMARY KEY (id);


--
-- Name: mfa_factors mfa_factors_last_challenged_at_key; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_last_challenged_at_key UNIQUE (last_challenged_at);


--
-- Name: mfa_factors mfa_factors_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_pkey PRIMARY KEY (id);


--
-- Name: oauth_authorizations oauth_authorizations_authorization_code_key; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_authorization_code_key UNIQUE (authorization_code);


--
-- Name: oauth_authorizations oauth_authorizations_authorization_id_key; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_authorization_id_key UNIQUE (authorization_id);


--
-- Name: oauth_authorizations oauth_authorizations_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_pkey PRIMARY KEY (id);


--
-- Name: oauth_clients oauth_clients_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.oauth_clients
    ADD CONSTRAINT oauth_clients_pkey PRIMARY KEY (id);


--
-- Name: oauth_consents oauth_consents_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_pkey PRIMARY KEY (id);


--
-- Name: oauth_consents oauth_consents_user_client_unique; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_user_client_unique UNIQUE (user_id, client_id);


--
-- Name: one_time_tokens one_time_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.one_time_tokens
    ADD CONSTRAINT one_time_tokens_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_token_unique; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_token_unique UNIQUE (token);


--
-- Name: saml_providers saml_providers_entity_id_key; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_entity_id_key UNIQUE (entity_id);


--
-- Name: saml_providers saml_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_pkey PRIMARY KEY (id);


--
-- Name: saml_relay_states saml_relay_states_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: sso_domains sso_domains_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.sso_domains
    ADD CONSTRAINT sso_domains_pkey PRIMARY KEY (id);


--
-- Name: sso_providers sso_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.sso_providers
    ADD CONSTRAINT sso_providers_pkey PRIMARY KEY (id);


--
-- Name: users users_phone_key; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_phone_key UNIQUE (phone);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: bookings bookings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_pkey PRIMARY KEY (id);


--
-- Name: categories categories_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_name_key UNIQUE (name);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: chats chats_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chats
    ADD CONSTRAINT chats_pkey PRIMARY KEY (id);


--
-- Name: credit_transactions credit_transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.credit_transactions
    ADD CONSTRAINT credit_transactions_pkey PRIMARY KEY (id);


--
-- Name: credits credits_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.credits
    ADD CONSTRAINT credits_pkey PRIMARY KEY (id);


--
-- Name: favorites favorites_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_pkey PRIMARY KEY (id);


--
-- Name: global_settings global_settings_key_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.global_settings
    ADD CONSTRAINT global_settings_key_key UNIQUE (key);


--
-- Name: global_settings global_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.global_settings
    ADD CONSTRAINT global_settings_pkey PRIMARY KEY (id);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (id);


--
-- Name: payments payments_reference_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_reference_id_key UNIQUE (reference_id);


--
-- Name: profile_settings profile_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profile_settings
    ADD CONSTRAINT profile_settings_pkey PRIMARY KEY (id);


--
-- Name: ratings ratings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ratings
    ADD CONSTRAINT ratings_pkey PRIMARY KEY (id);


--
-- Name: roles roles_level_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_level_key UNIQUE (level);


--
-- Name: roles roles_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key UNIQUE (name);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: user_presence user_presence_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_presence
    ADD CONSTRAINT user_presence_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: worker_posts worker_posts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.worker_posts
    ADD CONSTRAINT worker_posts_pkey PRIMARY KEY (id);


--
-- Name: workers_categories workers_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.workers_categories
    ADD CONSTRAINT workers_categories_pkey PRIMARY KEY (id);


--
-- Name: workers workers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.workers
    ADD CONSTRAINT workers_pkey PRIMARY KEY (id);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: messages_2025_12_18 messages_2025_12_18_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages_2025_12_18
    ADD CONSTRAINT messages_2025_12_18_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: messages_2025_12_19 messages_2025_12_19_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages_2025_12_19
    ADD CONSTRAINT messages_2025_12_19_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: messages_2025_12_20 messages_2025_12_20_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages_2025_12_20
    ADD CONSTRAINT messages_2025_12_20_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: messages_2025_12_21 messages_2025_12_21_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages_2025_12_21
    ADD CONSTRAINT messages_2025_12_21_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: messages_2025_12_22 messages_2025_12_22_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages_2025_12_22
    ADD CONSTRAINT messages_2025_12_22_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: subscription pk_subscription; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.subscription
    ADD CONSTRAINT pk_subscription PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: buckets_analytics buckets_analytics_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.buckets_analytics
    ADD CONSTRAINT buckets_analytics_pkey PRIMARY KEY (id);


--
-- Name: buckets buckets_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.buckets
    ADD CONSTRAINT buckets_pkey PRIMARY KEY (id);


--
-- Name: iceberg_namespaces iceberg_namespaces_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.iceberg_namespaces
    ADD CONSTRAINT iceberg_namespaces_pkey PRIMARY KEY (id);


--
-- Name: iceberg_tables iceberg_tables_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.iceberg_tables
    ADD CONSTRAINT iceberg_tables_pkey PRIMARY KEY (id);


--
-- Name: migrations migrations_name_key; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_name_key UNIQUE (name);


--
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);


--
-- Name: objects objects_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT objects_pkey PRIMARY KEY (id);


--
-- Name: prefixes prefixes_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.prefixes
    ADD CONSTRAINT prefixes_pkey PRIMARY KEY (bucket_id, level, name);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_pkey PRIMARY KEY (id);


--
-- Name: s3_multipart_uploads s3_multipart_uploads_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.s3_multipart_uploads
    ADD CONSTRAINT s3_multipart_uploads_pkey PRIMARY KEY (id);


--
-- Name: hooks hooks_pkey; Type: CONSTRAINT; Schema: supabase_functions; Owner: -
--

ALTER TABLE ONLY supabase_functions.hooks
    ADD CONSTRAINT hooks_pkey PRIMARY KEY (id);


--
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: supabase_functions; Owner: -
--

ALTER TABLE ONLY supabase_functions.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (version);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: supabase_migrations; Owner: -
--

ALTER TABLE ONLY supabase_migrations.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: extensions_tenant_external_id_index; Type: INDEX; Schema: _realtime; Owner: -
--

CREATE INDEX extensions_tenant_external_id_index ON _realtime.extensions USING btree (tenant_external_id);


--
-- Name: extensions_tenant_external_id_type_index; Type: INDEX; Schema: _realtime; Owner: -
--

CREATE UNIQUE INDEX extensions_tenant_external_id_type_index ON _realtime.extensions USING btree (tenant_external_id, type);


--
-- Name: tenants_external_id_index; Type: INDEX; Schema: _realtime; Owner: -
--

CREATE UNIQUE INDEX tenants_external_id_index ON _realtime.tenants USING btree (external_id);


--
-- Name: audit_logs_instance_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX audit_logs_instance_id_idx ON auth.audit_log_entries USING btree (instance_id);


--
-- Name: confirmation_token_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX confirmation_token_idx ON auth.users USING btree (confirmation_token) WHERE ((confirmation_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: email_change_token_current_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX email_change_token_current_idx ON auth.users USING btree (email_change_token_current) WHERE ((email_change_token_current)::text !~ '^[0-9 ]*$'::text);


--
-- Name: email_change_token_new_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX email_change_token_new_idx ON auth.users USING btree (email_change_token_new) WHERE ((email_change_token_new)::text !~ '^[0-9 ]*$'::text);


--
-- Name: factor_id_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX factor_id_created_at_idx ON auth.mfa_factors USING btree (user_id, created_at);


--
-- Name: flow_state_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX flow_state_created_at_idx ON auth.flow_state USING btree (created_at DESC);


--
-- Name: identities_email_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX identities_email_idx ON auth.identities USING btree (email text_pattern_ops);


--
-- Name: INDEX identities_email_idx; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON INDEX auth.identities_email_idx IS 'Auth: Ensures indexed queries on the email column';


--
-- Name: identities_user_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX identities_user_id_idx ON auth.identities USING btree (user_id);


--
-- Name: idx_auth_code; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX idx_auth_code ON auth.flow_state USING btree (auth_code);


--
-- Name: idx_user_id_auth_method; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX idx_user_id_auth_method ON auth.flow_state USING btree (user_id, authentication_method);


--
-- Name: mfa_challenge_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX mfa_challenge_created_at_idx ON auth.mfa_challenges USING btree (created_at DESC);


--
-- Name: mfa_factors_user_friendly_name_unique; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX mfa_factors_user_friendly_name_unique ON auth.mfa_factors USING btree (friendly_name, user_id) WHERE (TRIM(BOTH FROM friendly_name) <> ''::text);


--
-- Name: mfa_factors_user_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX mfa_factors_user_id_idx ON auth.mfa_factors USING btree (user_id);


--
-- Name: oauth_auth_pending_exp_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX oauth_auth_pending_exp_idx ON auth.oauth_authorizations USING btree (expires_at) WHERE (status = 'pending'::auth.oauth_authorization_status);


--
-- Name: oauth_clients_deleted_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX oauth_clients_deleted_at_idx ON auth.oauth_clients USING btree (deleted_at);


--
-- Name: oauth_consents_active_client_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX oauth_consents_active_client_idx ON auth.oauth_consents USING btree (client_id) WHERE (revoked_at IS NULL);


--
-- Name: oauth_consents_active_user_client_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX oauth_consents_active_user_client_idx ON auth.oauth_consents USING btree (user_id, client_id) WHERE (revoked_at IS NULL);


--
-- Name: oauth_consents_user_order_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX oauth_consents_user_order_idx ON auth.oauth_consents USING btree (user_id, granted_at DESC);


--
-- Name: one_time_tokens_relates_to_hash_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX one_time_tokens_relates_to_hash_idx ON auth.one_time_tokens USING hash (relates_to);


--
-- Name: one_time_tokens_token_hash_hash_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX one_time_tokens_token_hash_hash_idx ON auth.one_time_tokens USING hash (token_hash);


--
-- Name: one_time_tokens_user_id_token_type_key; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX one_time_tokens_user_id_token_type_key ON auth.one_time_tokens USING btree (user_id, token_type);


--
-- Name: reauthentication_token_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX reauthentication_token_idx ON auth.users USING btree (reauthentication_token) WHERE ((reauthentication_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: recovery_token_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX recovery_token_idx ON auth.users USING btree (recovery_token) WHERE ((recovery_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: refresh_tokens_instance_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX refresh_tokens_instance_id_idx ON auth.refresh_tokens USING btree (instance_id);


--
-- Name: refresh_tokens_instance_id_user_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX refresh_tokens_instance_id_user_id_idx ON auth.refresh_tokens USING btree (instance_id, user_id);


--
-- Name: refresh_tokens_parent_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX refresh_tokens_parent_idx ON auth.refresh_tokens USING btree (parent);


--
-- Name: refresh_tokens_session_id_revoked_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX refresh_tokens_session_id_revoked_idx ON auth.refresh_tokens USING btree (session_id, revoked);


--
-- Name: refresh_tokens_updated_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX refresh_tokens_updated_at_idx ON auth.refresh_tokens USING btree (updated_at DESC);


--
-- Name: saml_providers_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX saml_providers_sso_provider_id_idx ON auth.saml_providers USING btree (sso_provider_id);


--
-- Name: saml_relay_states_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX saml_relay_states_created_at_idx ON auth.saml_relay_states USING btree (created_at DESC);


--
-- Name: saml_relay_states_for_email_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX saml_relay_states_for_email_idx ON auth.saml_relay_states USING btree (for_email);


--
-- Name: saml_relay_states_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX saml_relay_states_sso_provider_id_idx ON auth.saml_relay_states USING btree (sso_provider_id);


--
-- Name: sessions_not_after_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX sessions_not_after_idx ON auth.sessions USING btree (not_after DESC);


--
-- Name: sessions_oauth_client_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX sessions_oauth_client_id_idx ON auth.sessions USING btree (oauth_client_id);


--
-- Name: sessions_user_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX sessions_user_id_idx ON auth.sessions USING btree (user_id);


--
-- Name: sso_domains_domain_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX sso_domains_domain_idx ON auth.sso_domains USING btree (lower(domain));


--
-- Name: sso_domains_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX sso_domains_sso_provider_id_idx ON auth.sso_domains USING btree (sso_provider_id);


--
-- Name: sso_providers_resource_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX sso_providers_resource_id_idx ON auth.sso_providers USING btree (lower(resource_id));


--
-- Name: sso_providers_resource_id_pattern_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX sso_providers_resource_id_pattern_idx ON auth.sso_providers USING btree (resource_id text_pattern_ops);


--
-- Name: unique_phone_factor_per_user; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX unique_phone_factor_per_user ON auth.mfa_factors USING btree (user_id, phone);


--
-- Name: user_id_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX user_id_created_at_idx ON auth.sessions USING btree (user_id, created_at);


--
-- Name: users_email_partial_key; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX users_email_partial_key ON auth.users USING btree (email) WHERE (is_sso_user = false);


--
-- Name: INDEX users_email_partial_key; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON INDEX auth.users_email_partial_key IS 'Auth: A partial unique index that applies only when is_sso_user is false';


--
-- Name: users_instance_id_email_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX users_instance_id_email_idx ON auth.users USING btree (instance_id, lower((email)::text));


--
-- Name: users_instance_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX users_instance_id_idx ON auth.users USING btree (instance_id);


--
-- Name: users_is_anonymous_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX users_is_anonymous_idx ON auth.users USING btree (is_anonymous);


--
-- Name: idx_users_city; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_users_city ON public.users USING btree (city);


--
-- Name: idx_users_location; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_users_location ON public.users USING btree (latitude, longitude);


--
-- Name: idx_users_role; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_users_role ON public.users USING btree (role);


--
-- Name: idx_users_role_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_users_role_id ON public.users USING btree (role_id);


--
-- Name: idx_users_state; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_users_state ON public.users USING btree (state);


--
-- Name: idx_workers_hourly_rate; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_workers_hourly_rate ON public.workers USING btree (hourly_rate_min, hourly_rate_max);


--
-- Name: idx_workers_profession; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_workers_profession ON public.workers USING btree (profession);


--
-- Name: idx_workers_verified; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_workers_verified ON public.workers USING btree (is_verified);


--
-- Name: users_location_gix; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_location_gix ON public.users USING gist (location);


--
-- Name: ix_realtime_subscription_entity; Type: INDEX; Schema: realtime; Owner: -
--

CREATE INDEX ix_realtime_subscription_entity ON realtime.subscription USING btree (entity);


--
-- Name: messages_inserted_at_topic_index; Type: INDEX; Schema: realtime; Owner: -
--

CREATE INDEX messages_inserted_at_topic_index ON ONLY realtime.messages USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- Name: messages_2025_12_18_inserted_at_topic_idx; Type: INDEX; Schema: realtime; Owner: -
--

CREATE INDEX messages_2025_12_18_inserted_at_topic_idx ON realtime.messages_2025_12_18 USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- Name: messages_2025_12_19_inserted_at_topic_idx; Type: INDEX; Schema: realtime; Owner: -
--

CREATE INDEX messages_2025_12_19_inserted_at_topic_idx ON realtime.messages_2025_12_19 USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- Name: messages_2025_12_20_inserted_at_topic_idx; Type: INDEX; Schema: realtime; Owner: -
--

CREATE INDEX messages_2025_12_20_inserted_at_topic_idx ON realtime.messages_2025_12_20 USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- Name: messages_2025_12_21_inserted_at_topic_idx; Type: INDEX; Schema: realtime; Owner: -
--

CREATE INDEX messages_2025_12_21_inserted_at_topic_idx ON realtime.messages_2025_12_21 USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- Name: messages_2025_12_22_inserted_at_topic_idx; Type: INDEX; Schema: realtime; Owner: -
--

CREATE INDEX messages_2025_12_22_inserted_at_topic_idx ON realtime.messages_2025_12_22 USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- Name: subscription_subscription_id_entity_filters_key; Type: INDEX; Schema: realtime; Owner: -
--

CREATE UNIQUE INDEX subscription_subscription_id_entity_filters_key ON realtime.subscription USING btree (subscription_id, entity, filters);


--
-- Name: bname; Type: INDEX; Schema: storage; Owner: -
--

CREATE UNIQUE INDEX bname ON storage.buckets USING btree (name);


--
-- Name: bucketid_objname; Type: INDEX; Schema: storage; Owner: -
--

CREATE UNIQUE INDEX bucketid_objname ON storage.objects USING btree (bucket_id, name);


--
-- Name: idx_iceberg_namespaces_bucket_id; Type: INDEX; Schema: storage; Owner: -
--

CREATE UNIQUE INDEX idx_iceberg_namespaces_bucket_id ON storage.iceberg_namespaces USING btree (bucket_id, name);


--
-- Name: idx_iceberg_tables_namespace_id; Type: INDEX; Schema: storage; Owner: -
--

CREATE UNIQUE INDEX idx_iceberg_tables_namespace_id ON storage.iceberg_tables USING btree (namespace_id, name);


--
-- Name: idx_multipart_uploads_list; Type: INDEX; Schema: storage; Owner: -
--

CREATE INDEX idx_multipart_uploads_list ON storage.s3_multipart_uploads USING btree (bucket_id, key, created_at);


--
-- Name: idx_name_bucket_level_unique; Type: INDEX; Schema: storage; Owner: -
--

CREATE UNIQUE INDEX idx_name_bucket_level_unique ON storage.objects USING btree (name COLLATE "C", bucket_id, level);


--
-- Name: idx_objects_bucket_id_name; Type: INDEX; Schema: storage; Owner: -
--

CREATE INDEX idx_objects_bucket_id_name ON storage.objects USING btree (bucket_id, name COLLATE "C");


--
-- Name: idx_objects_lower_name; Type: INDEX; Schema: storage; Owner: -
--

CREATE INDEX idx_objects_lower_name ON storage.objects USING btree ((path_tokens[level]), lower(name) text_pattern_ops, bucket_id, level);


--
-- Name: idx_prefixes_lower_name; Type: INDEX; Schema: storage; Owner: -
--

CREATE INDEX idx_prefixes_lower_name ON storage.prefixes USING btree (bucket_id, level, ((string_to_array(name, '/'::text))[level]), lower(name) text_pattern_ops);


--
-- Name: name_prefix_search; Type: INDEX; Schema: storage; Owner: -
--

CREATE INDEX name_prefix_search ON storage.objects USING btree (name text_pattern_ops);


--
-- Name: objects_bucket_id_level_idx; Type: INDEX; Schema: storage; Owner: -
--

CREATE UNIQUE INDEX objects_bucket_id_level_idx ON storage.objects USING btree (bucket_id, level, name COLLATE "C");


--
-- Name: supabase_functions_hooks_h_table_id_h_name_idx; Type: INDEX; Schema: supabase_functions; Owner: -
--

CREATE INDEX supabase_functions_hooks_h_table_id_h_name_idx ON supabase_functions.hooks USING btree (hook_table_id, hook_name);


--
-- Name: supabase_functions_hooks_request_id_idx; Type: INDEX; Schema: supabase_functions; Owner: -
--

CREATE INDEX supabase_functions_hooks_request_id_idx ON supabase_functions.hooks USING btree (request_id);


--
-- Name: messages_2025_12_18_inserted_at_topic_idx; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX realtime.messages_inserted_at_topic_index ATTACH PARTITION realtime.messages_2025_12_18_inserted_at_topic_idx;


--
-- Name: messages_2025_12_18_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2025_12_18_pkey;


--
-- Name: messages_2025_12_19_inserted_at_topic_idx; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX realtime.messages_inserted_at_topic_index ATTACH PARTITION realtime.messages_2025_12_19_inserted_at_topic_idx;


--
-- Name: messages_2025_12_19_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2025_12_19_pkey;


--
-- Name: messages_2025_12_20_inserted_at_topic_idx; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX realtime.messages_inserted_at_topic_index ATTACH PARTITION realtime.messages_2025_12_20_inserted_at_topic_idx;


--
-- Name: messages_2025_12_20_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2025_12_20_pkey;


--
-- Name: messages_2025_12_21_inserted_at_topic_idx; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX realtime.messages_inserted_at_topic_index ATTACH PARTITION realtime.messages_2025_12_21_inserted_at_topic_idx;


--
-- Name: messages_2025_12_21_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2025_12_21_pkey;


--
-- Name: messages_2025_12_22_inserted_at_topic_idx; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX realtime.messages_inserted_at_topic_index ATTACH PARTITION realtime.messages_2025_12_22_inserted_at_topic_idx;


--
-- Name: messages_2025_12_22_pkey; Type: INDEX ATTACH; Schema: realtime; Owner: -
--

ALTER INDEX realtime.messages_pkey ATTACH PARTITION realtime.messages_2025_12_22_pkey;


--
-- Name: users on_auth_user_created; Type: TRIGGER; Schema: auth; Owner: -
--

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_auth_user();


--
-- Name: users update_user_location_trigger; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_user_location_trigger BEFORE INSERT OR UPDATE OF latitude, longitude ON public.users FOR EACH ROW EXECUTE FUNCTION public.update_user_location();


--
-- Name: subscription tr_check_filters; Type: TRIGGER; Schema: realtime; Owner: -
--

CREATE TRIGGER tr_check_filters BEFORE INSERT OR UPDATE ON realtime.subscription FOR EACH ROW EXECUTE FUNCTION realtime.subscription_check_filters();


--
-- Name: buckets enforce_bucket_name_length_trigger; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER enforce_bucket_name_length_trigger BEFORE INSERT OR UPDATE OF name ON storage.buckets FOR EACH ROW EXECUTE FUNCTION storage.enforce_bucket_name_length();


--
-- Name: objects objects_delete_delete_prefix; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER objects_delete_delete_prefix AFTER DELETE ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.delete_prefix_hierarchy_trigger();


--
-- Name: objects objects_insert_create_prefix; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER objects_insert_create_prefix BEFORE INSERT ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.objects_insert_prefix_trigger();


--
-- Name: objects objects_update_create_prefix; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER objects_update_create_prefix BEFORE UPDATE ON storage.objects FOR EACH ROW WHEN (((new.name <> old.name) OR (new.bucket_id <> old.bucket_id))) EXECUTE FUNCTION storage.objects_update_prefix_trigger();


--
-- Name: prefixes prefixes_create_hierarchy; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER prefixes_create_hierarchy BEFORE INSERT ON storage.prefixes FOR EACH ROW WHEN ((pg_trigger_depth() < 1)) EXECUTE FUNCTION storage.prefixes_insert_trigger();


--
-- Name: prefixes prefixes_delete_hierarchy; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER prefixes_delete_hierarchy AFTER DELETE ON storage.prefixes FOR EACH ROW EXECUTE FUNCTION storage.delete_prefix_hierarchy_trigger();


--
-- Name: objects update_objects_updated_at; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER update_objects_updated_at BEFORE UPDATE ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.update_updated_at_column();


--
-- Name: extensions extensions_tenant_external_id_fkey; Type: FK CONSTRAINT; Schema: _realtime; Owner: -
--

ALTER TABLE ONLY _realtime.extensions
    ADD CONSTRAINT extensions_tenant_external_id_fkey FOREIGN KEY (tenant_external_id) REFERENCES _realtime.tenants(external_id) ON DELETE CASCADE;


--
-- Name: identities identities_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: mfa_amr_claims mfa_amr_claims_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT mfa_amr_claims_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE;


--
-- Name: mfa_challenges mfa_challenges_auth_factor_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_challenges
    ADD CONSTRAINT mfa_challenges_auth_factor_id_fkey FOREIGN KEY (factor_id) REFERENCES auth.mfa_factors(id) ON DELETE CASCADE;


--
-- Name: mfa_factors mfa_factors_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: oauth_authorizations oauth_authorizations_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_client_id_fkey FOREIGN KEY (client_id) REFERENCES auth.oauth_clients(id) ON DELETE CASCADE;


--
-- Name: oauth_authorizations oauth_authorizations_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: oauth_consents oauth_consents_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_client_id_fkey FOREIGN KEY (client_id) REFERENCES auth.oauth_clients(id) ON DELETE CASCADE;


--
-- Name: oauth_consents oauth_consents_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: one_time_tokens one_time_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.one_time_tokens
    ADD CONSTRAINT one_time_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: refresh_tokens refresh_tokens_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE;


--
-- Name: saml_providers saml_providers_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: saml_relay_states saml_relay_states_flow_state_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_flow_state_id_fkey FOREIGN KEY (flow_state_id) REFERENCES auth.flow_state(id) ON DELETE CASCADE;


--
-- Name: saml_relay_states saml_relay_states_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: sessions sessions_oauth_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_oauth_client_id_fkey FOREIGN KEY (oauth_client_id) REFERENCES auth.oauth_clients(id) ON DELETE CASCADE;


--
-- Name: sessions sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: sso_domains sso_domains_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.sso_domains
    ADD CONSTRAINT sso_domains_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: bookings bookings_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE CASCADE;


--
-- Name: bookings bookings_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: bookings bookings_worker_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_worker_id_fkey FOREIGN KEY (worker_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: chats chats_booking_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chats
    ADD CONSTRAINT chats_booking_id_fkey FOREIGN KEY (booking_id) REFERENCES public.bookings(id) ON DELETE CASCADE;


--
-- Name: chats chats_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chats
    ADD CONSTRAINT chats_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: chats chats_worker_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chats
    ADD CONSTRAINT chats_worker_id_fkey FOREIGN KEY (worker_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: credit_transactions credit_transactions_booking_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.credit_transactions
    ADD CONSTRAINT credit_transactions_booking_id_fkey FOREIGN KEY (booking_id) REFERENCES public.bookings(id);


--
-- Name: credit_transactions credit_transactions_credit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.credit_transactions
    ADD CONSTRAINT credit_transactions_credit_id_fkey FOREIGN KEY (credit_id) REFERENCES public.credits(id) ON DELETE CASCADE;


--
-- Name: credits credits_worker_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.credits
    ADD CONSTRAINT credits_worker_id_fkey FOREIGN KEY (worker_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: favorites favorites_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: favorites favorites_worker_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_worker_id_fkey FOREIGN KEY (worker_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: users fk_users_role_level; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT fk_users_role_level FOREIGN KEY (role) REFERENCES public.roles(level);


--
-- Name: messages messages_chat_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_chat_id_fkey FOREIGN KEY (chat_id) REFERENCES public.chats(id) ON DELETE CASCADE;


--
-- Name: messages messages_receiver_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_receiver_id_fkey FOREIGN KEY (receiver_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: messages messages_sender_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: notifications notifications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: payments payments_booking_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_booking_id_fkey FOREIGN KEY (booking_id) REFERENCES public.bookings(id) ON DELETE CASCADE;


--
-- Name: payments payments_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: payments payments_worker_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_worker_id_fkey FOREIGN KEY (worker_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: profile_settings profile_settings_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profile_settings
    ADD CONSTRAINT profile_settings_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: ratings ratings_booking_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ratings
    ADD CONSTRAINT ratings_booking_id_fkey FOREIGN KEY (booking_id) REFERENCES public.bookings(id) ON DELETE CASCADE;


--
-- Name: ratings ratings_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ratings
    ADD CONSTRAINT ratings_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: ratings ratings_worker_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ratings
    ADD CONSTRAINT ratings_worker_id_fkey FOREIGN KEY (worker_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: user_presence user_presence_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_presence
    ADD CONSTRAINT user_presence_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: worker_posts worker_posts_worker_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.worker_posts
    ADD CONSTRAINT worker_posts_worker_id_fkey FOREIGN KEY (worker_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: workers_categories workers_categories_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.workers_categories
    ADD CONSTRAINT workers_categories_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE CASCADE;


--
-- Name: workers_categories workers_categories_worker_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.workers_categories
    ADD CONSTRAINT workers_categories_worker_id_fkey FOREIGN KEY (worker_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: workers workers_worker_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.workers
    ADD CONSTRAINT workers_worker_id_fkey FOREIGN KEY (worker_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: iceberg_namespaces iceberg_namespaces_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.iceberg_namespaces
    ADD CONSTRAINT iceberg_namespaces_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets_analytics(id) ON DELETE CASCADE;


--
-- Name: iceberg_tables iceberg_tables_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.iceberg_tables
    ADD CONSTRAINT iceberg_tables_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets_analytics(id) ON DELETE CASCADE;


--
-- Name: iceberg_tables iceberg_tables_namespace_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.iceberg_tables
    ADD CONSTRAINT iceberg_tables_namespace_id_fkey FOREIGN KEY (namespace_id) REFERENCES storage.iceberg_namespaces(id) ON DELETE CASCADE;


--
-- Name: objects objects_bucketId_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT "objects_bucketId_fkey" FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: prefixes prefixes_bucketId_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.prefixes
    ADD CONSTRAINT "prefixes_bucketId_fkey" FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads s3_multipart_uploads_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.s3_multipart_uploads
    ADD CONSTRAINT s3_multipart_uploads_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_upload_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_upload_id_fkey FOREIGN KEY (upload_id) REFERENCES storage.s3_multipart_uploads(id) ON DELETE CASCADE;


--
-- Name: audit_log_entries; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.audit_log_entries ENABLE ROW LEVEL SECURITY;

--
-- Name: flow_state; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.flow_state ENABLE ROW LEVEL SECURITY;

--
-- Name: identities; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.identities ENABLE ROW LEVEL SECURITY;

--
-- Name: instances; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.instances ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_amr_claims; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.mfa_amr_claims ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_challenges; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.mfa_challenges ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_factors; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.mfa_factors ENABLE ROW LEVEL SECURITY;

--
-- Name: one_time_tokens; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.one_time_tokens ENABLE ROW LEVEL SECURITY;

--
-- Name: refresh_tokens; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.refresh_tokens ENABLE ROW LEVEL SECURITY;

--
-- Name: saml_providers; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.saml_providers ENABLE ROW LEVEL SECURITY;

--
-- Name: saml_relay_states; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.saml_relay_states ENABLE ROW LEVEL SECURITY;

--
-- Name: schema_migrations; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.schema_migrations ENABLE ROW LEVEL SECURITY;

--
-- Name: sessions; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.sessions ENABLE ROW LEVEL SECURITY;

--
-- Name: sso_domains; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.sso_domains ENABLE ROW LEVEL SECURITY;

--
-- Name: sso_providers; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.sso_providers ENABLE ROW LEVEL SECURITY;

--
-- Name: users; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

--
-- Name: bookings Booking updatable by participants; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Booking updatable by participants" ON public.bookings FOR UPDATE USING (((customer_id = auth.uid()) OR (worker_id = auth.uid())));


--
-- Name: bookings Booking visible to customer or worker; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Booking visible to customer or worker" ON public.bookings FOR SELECT USING (((customer_id = auth.uid()) OR (worker_id = auth.uid())));


--
-- Name: chats Chats creatable for participants; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Chats creatable for participants" ON public.chats FOR INSERT WITH CHECK (((customer_id = auth.uid()) OR (worker_id = auth.uid())));


--
-- Name: chats Chats visible to participants; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Chats visible to participants" ON public.chats FOR SELECT USING (((customer_id = auth.uid()) OR (worker_id = auth.uid())));


--
-- Name: bookings Customer creates own booking; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Customer creates own booking" ON public.bookings FOR INSERT WITH CHECK ((customer_id = auth.uid()));


--
-- Name: favorites Customer manages own favorites; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Customer manages own favorites" ON public.favorites USING ((customer_id = auth.uid())) WITH CHECK ((customer_id = auth.uid()));


--
-- Name: ratings Customers can rate after booking; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Customers can rate after booking" ON public.ratings FOR INSERT WITH CHECK ((customer_id = auth.uid()));


--
-- Name: worker_posts Everyone can view posts; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Everyone can view posts" ON public.worker_posts FOR SELECT USING (true);


--
-- Name: workers Everyone can view worker profiles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Everyone can view worker profiles" ON public.workers FOR SELECT USING (true);


--
-- Name: messages Messages visible to participants; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Messages visible to participants" ON public.messages FOR SELECT USING (((sender_id = auth.uid()) OR (receiver_id = auth.uid())));


--
-- Name: payments Payments visible to related users; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Payments visible to related users" ON public.payments FOR SELECT USING (((customer_id = auth.uid()) OR (worker_id = auth.uid())));


--
-- Name: categories Public can view categories; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public can view categories" ON public.categories FOR SELECT USING (true);


--
-- Name: global_settings Public read global settings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public read global settings" ON public.global_settings FOR SELECT USING (true);


--
-- Name: ratings Ratings visible to related users; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Ratings visible to related users" ON public.ratings FOR SELECT USING (((customer_id = auth.uid()) OR (worker_id = auth.uid())));


--
-- Name: profile_settings User manages own profile settings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "User manages own profile settings" ON public.profile_settings USING ((user_id = auth.uid())) WITH CHECK ((user_id = auth.uid()));


--
-- Name: messages Users can send messages; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can send messages" ON public.messages FOR INSERT WITH CHECK ((sender_id = auth.uid()));


--
-- Name: users Users can update own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING ((id = auth.uid())) WITH CHECK ((id = auth.uid()));


--
-- Name: users Users can view own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING ((id = auth.uid()));


--
-- Name: notifications Users can view their own notifications; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own notifications" ON public.notifications FOR SELECT USING ((user_id = auth.uid()));


--
-- Name: workers Worker can update own worker record; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Worker can update own worker record" ON public.workers FOR UPDATE USING ((worker_id = auth.uid())) WITH CHECK ((worker_id = auth.uid()));


--
-- Name: worker_posts Worker manages own posts; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Worker manages own posts" ON public.worker_posts USING ((worker_id = auth.uid())) WITH CHECK ((worker_id = auth.uid()));


--
-- Name: workers_categories Worker manages their categories; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Worker manages their categories" ON public.workers_categories USING ((worker_id = auth.uid())) WITH CHECK ((worker_id = auth.uid()));


--
-- Name: credits Worker sees own credits; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Worker sees own credits" ON public.credits FOR SELECT USING ((worker_id = auth.uid()));


--
-- Name: credit_transactions Worker sees transactions of their credits; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Worker sees transactions of their credits" ON public.credit_transactions FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.credits c
  WHERE ((c.id = credit_transactions.credit_id) AND (c.worker_id = auth.uid())))));


--
-- Name: bookings; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

--
-- Name: categories; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

--
-- Name: chats; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;

--
-- Name: credit_transactions; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;

--
-- Name: credits; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.credits ENABLE ROW LEVEL SECURITY;

--
-- Name: favorites; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

--
-- Name: global_settings; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.global_settings ENABLE ROW LEVEL SECURITY;

--
-- Name: messages; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

--
-- Name: notifications; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

--
-- Name: payments; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

--
-- Name: profile_settings; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.profile_settings ENABLE ROW LEVEL SECURITY;

--
-- Name: ratings; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;

--
-- Name: roles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;

--
-- Name: user_presence; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.user_presence ENABLE ROW LEVEL SECURITY;

--
-- Name: users; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

--
-- Name: worker_posts; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.worker_posts ENABLE ROW LEVEL SECURITY;

--
-- Name: workers; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.workers ENABLE ROW LEVEL SECURITY;

--
-- Name: workers_categories; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.workers_categories ENABLE ROW LEVEL SECURITY;

--
-- Name: messages; Type: ROW SECURITY; Schema: realtime; Owner: -
--

ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;

--
-- Name: buckets; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;

--
-- Name: buckets_analytics; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.buckets_analytics ENABLE ROW LEVEL SECURITY;

--
-- Name: iceberg_namespaces; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.iceberg_namespaces ENABLE ROW LEVEL SECURITY;

--
-- Name: iceberg_tables; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.iceberg_tables ENABLE ROW LEVEL SECURITY;

--
-- Name: migrations; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.migrations ENABLE ROW LEVEL SECURITY;

--
-- Name: objects; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

--
-- Name: prefixes; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.prefixes ENABLE ROW LEVEL SECURITY;

--
-- Name: s3_multipart_uploads; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.s3_multipart_uploads ENABLE ROW LEVEL SECURITY;

--
-- Name: s3_multipart_uploads_parts; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.s3_multipart_uploads_parts ENABLE ROW LEVEL SECURITY;

--
-- Name: supabase_realtime; Type: PUBLICATION; Schema: -; Owner: -
--

CREATE PUBLICATION supabase_realtime WITH (publish = 'insert, update, delete, truncate');


--
-- Name: issue_graphql_placeholder; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER issue_graphql_placeholder ON sql_drop
         WHEN TAG IN ('DROP EXTENSION')
   EXECUTE FUNCTION extensions.set_graphql_placeholder();


--
-- Name: issue_pg_cron_access; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER issue_pg_cron_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION extensions.grant_pg_cron_access();


--
-- Name: issue_pg_graphql_access; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER issue_pg_graphql_access ON ddl_command_end
         WHEN TAG IN ('CREATE FUNCTION')
   EXECUTE FUNCTION extensions.grant_pg_graphql_access();


--
-- Name: issue_pg_net_access; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER issue_pg_net_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION extensions.grant_pg_net_access();


--
-- Name: pgrst_ddl_watch; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER pgrst_ddl_watch ON ddl_command_end
   EXECUTE FUNCTION extensions.pgrst_ddl_watch();


--
-- Name: pgrst_drop_watch; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER pgrst_drop_watch ON sql_drop
   EXECUTE FUNCTION extensions.pgrst_drop_watch();


--
-- PostgreSQL database dump complete
--

\unrestrict yjCfPW8bTrOy0odDH77wX3uvNFb6qJ8tuZKkBcaUSojohQH63NCu0Ftv4REPAwT

