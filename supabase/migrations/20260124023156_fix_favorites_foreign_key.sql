-- Fix favorites table foreign key constraint
-- The worker_id should reference workers(id), not users(id)

-- Drop the incorrect foreign key constraint
ALTER TABLE favorites
DROP CONSTRAINT IF EXISTS favorites_worker_id_fkey;

-- Add the correct foreign key constraint
ALTER TABLE favorites
ADD CONSTRAINT favorites_worker_id_fkey
FOREIGN KEY (worker_id) REFERENCES workers(id) ON DELETE CASCADE;
