-- Reorder workers table columns to: id, user_id, slug, (other columns)
-- PostgreSQL doesn't support column reordering directly, so we need to recreate the table

-- Step 1: Create a temporary table with the desired column order
CREATE TABLE workers_new (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    slug varchar(10) NOT NULL UNIQUE,
    profession character varying,
    hourly_rate_min integer,
    hourly_rate_max integer,
    years_experience integer DEFAULT 0,
    jobs_completed integer DEFAULT 0,
    response_time_minutes integer DEFAULT 60,
    is_verified boolean DEFAULT false,
    skills text[],
    status character varying DEFAULT 'active',
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    CONSTRAINT workers_status_check CHECK (status::text = ANY (ARRAY['available'::text, 'busy'::text, 'suspended'::text]))
);

-- Step 2: Copy all data from old table to new table
INSERT INTO workers_new (
    id, user_id, slug, profession, hourly_rate_min, hourly_rate_max,
    years_experience, jobs_completed, response_time_minutes, is_verified,
    skills, status, created_at, deleted_at
)
SELECT
    id, user_id, slug, profession, hourly_rate_min, hourly_rate_max,
    years_experience, jobs_completed, response_time_minutes, is_verified,
    skills, status, created_at, deleted_at
FROM workers;

-- Step 3: Drop all triggers that depend on the old table
DROP TRIGGER IF EXISTS trigger_set_worker_slug ON workers;

-- Step 4: Drop all foreign key constraints that reference workers table
-- We'll need to recreate these after swapping tables
-- Get the constraint names first
DO $$
DECLARE
    constraint_record RECORD;
BEGIN
    -- Drop foreign keys from other tables that reference workers
    FOR constraint_record IN
        SELECT conname, conrelid::regclass AS table_name
        FROM pg_constraint
        WHERE confrelid = 'workers'::regclass
    LOOP
        EXECUTE format('ALTER TABLE %s DROP CONSTRAINT IF EXISTS %I',
            constraint_record.table_name, constraint_record.conname);
    END LOOP;
END $$;

-- Step 5: Swap tables using rename
ALTER TABLE workers RENAME TO workers_old;
ALTER TABLE workers_new RENAME TO workers;
DROP TABLE workers_old CASCADE;

-- Step 6: Recreate foreign key from workers to users
ALTER TABLE workers
ADD CONSTRAINT workers_user_id_fkey
FOREIGN KEY (user_id)
REFERENCES users(id)
ON DELETE CASCADE;

-- Step 7: Recreate foreign keys from other tables to workers
ALTER TABLE bookings
ADD CONSTRAINT bookings_worker_id_fkey
FOREIGN KEY (worker_id)
REFERENCES workers(id)
ON DELETE CASCADE;

ALTER TABLE ratings
ADD CONSTRAINT ratings_worker_id_fkey
FOREIGN KEY (worker_id)
REFERENCES workers(id)
ON DELETE CASCADE;

ALTER TABLE chats
ADD CONSTRAINT chats_worker_id_fkey
FOREIGN KEY (worker_id)
REFERENCES workers(id)
ON DELETE CASCADE;

ALTER TABLE credits
ADD CONSTRAINT credits_worker_id_fkey
FOREIGN KEY (worker_id)
REFERENCES workers(id)
ON DELETE CASCADE;

ALTER TABLE payments
ADD CONSTRAINT payments_worker_id_fkey
FOREIGN KEY (worker_id)
REFERENCES workers(id)
ON DELETE CASCADE;

ALTER TABLE workers_categories
ADD CONSTRAINT workers_categories_worker_id_fkey
FOREIGN KEY (worker_id)
REFERENCES workers(id)
ON DELETE CASCADE;

ALTER TABLE favorites
ADD CONSTRAINT favorites_worker_id_fkey
FOREIGN KEY (worker_id)
REFERENCES workers(id)
ON DELETE CASCADE;

-- Step 8: Recreate indexes
CREATE INDEX idx_workers_slug ON workers(slug);
CREATE INDEX idx_workers_profession ON workers(profession);
CREATE INDEX idx_workers_verified ON workers(is_verified);
CREATE INDEX idx_workers_hourly_rate ON workers(hourly_rate_min, hourly_rate_max);

-- Step 9: Recreate triggers
CREATE TRIGGER trigger_set_worker_slug
BEFORE INSERT ON workers
FOR EACH ROW
EXECUTE FUNCTION set_worker_slug();

-- Step 10: Recreate RLS policies
ALTER TABLE workers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view worker profiles"
ON workers
FOR SELECT
USING (true);

CREATE POLICY "Public can view available workers"
ON workers
FOR SELECT
USING (status::text = 'available' AND deleted_at IS NULL);

CREATE POLICY "User can create own worker profile"
ON workers
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Worker can update own worker record"
ON workers
FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Step 11: Add comments
COMMENT ON COLUMN workers.id IS 'Primary key - worker profile ID';
COMMENT ON COLUMN workers.user_id IS 'Foreign key to users table';
COMMENT ON COLUMN workers.slug IS '10-digit numeric slug for worker profile URLs';

-- Verify column order
DO $$
DECLARE
    col_order TEXT;
BEGIN
    SELECT string_agg(column_name, ', ' ORDER BY ordinal_position)
    INTO col_order
    FROM information_schema.columns
    WHERE table_name = 'workers' AND table_schema = 'public'
    LIMIT 5;

    RAISE NOTICE 'Workers table column order (first 5): %', col_order;
END $$;
