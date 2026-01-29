-- Update remaining foreign keys to reference workers.id instead of users.id
-- Tables: chats, credits, payments, workers_categories

-- Step 1: Update chats.worker_id
-- Drop existing foreign key constraint
ALTER TABLE chats
DROP CONSTRAINT IF EXISTS chats_worker_id_fkey;

-- Migrate data: Update chats.worker_id from users.id to workers.id
UPDATE chats c
SET worker_id = w.id
FROM workers w
WHERE c.worker_id = w.user_id;

-- Add new foreign key constraint: chats.worker_id -> workers.id
ALTER TABLE chats
ADD CONSTRAINT chats_worker_id_fkey
FOREIGN KEY (worker_id)
REFERENCES workers(id)
ON DELETE CASCADE;

-- Step 2: Update credits.worker_id
-- Drop existing foreign key constraint
ALTER TABLE credits
DROP CONSTRAINT IF EXISTS credits_worker_id_fkey;

-- Migrate data: Update credits.worker_id from users.id to workers.id
UPDATE credits cr
SET worker_id = w.id
FROM workers w
WHERE cr.worker_id = w.user_id;

-- Add new foreign key constraint: credits.worker_id -> workers.id
ALTER TABLE credits
ADD CONSTRAINT credits_worker_id_fkey
FOREIGN KEY (worker_id)
REFERENCES workers(id)
ON DELETE CASCADE;

-- Step 3: Update payments.worker_id
-- Drop existing foreign key constraint
ALTER TABLE payments
DROP CONSTRAINT IF EXISTS payments_worker_id_fkey;

-- Migrate data: Update payments.worker_id from users.id to workers.id
UPDATE payments p
SET worker_id = w.id
FROM workers w
WHERE p.worker_id = w.user_id;

-- Add new foreign key constraint: payments.worker_id -> workers.id
ALTER TABLE payments
ADD CONSTRAINT payments_worker_id_fkey
FOREIGN KEY (worker_id)
REFERENCES workers(id)
ON DELETE CASCADE;

-- Step 4: Update workers_categories.worker_id
-- Drop existing foreign key constraint
ALTER TABLE workers_categories
DROP CONSTRAINT IF EXISTS workers_categories_worker_id_fkey;

-- Migrate data: Update workers_categories.worker_id from users.id to workers.id
UPDATE workers_categories wc
SET worker_id = w.id
FROM workers w
WHERE wc.worker_id = w.user_id;

-- Add new foreign key constraint: workers_categories.worker_id -> workers.id
ALTER TABLE workers_categories
ADD CONSTRAINT workers_categories_worker_id_fkey
FOREIGN KEY (worker_id)
REFERENCES workers(id)
ON DELETE CASCADE;

COMMENT ON CONSTRAINT chats_worker_id_fkey ON chats IS 'Foreign key to workers table';
COMMENT ON CONSTRAINT credits_worker_id_fkey ON credits IS 'Foreign key to workers table';
COMMENT ON CONSTRAINT payments_worker_id_fkey ON payments IS 'Foreign key to workers table';
COMMENT ON CONSTRAINT workers_categories_worker_id_fkey ON workers_categories IS 'Foreign key to workers table';
