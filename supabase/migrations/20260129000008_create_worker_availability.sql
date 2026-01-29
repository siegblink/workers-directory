-- Create worker_availability table with JSONB schedule
-- Stores weekly availability schedule for workers

CREATE TABLE worker_availability (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    worker_id uuid NOT NULL REFERENCES workers(id) ON DELETE CASCADE,
    schedule jsonb NOT NULL DEFAULT '{
        "monday": "Closed",
        "tuesday": "Closed",
        "wednesday": "Closed",
        "thursday": "Closed",
        "friday": "Closed",
        "saturday": "Closed",
        "sunday": "Closed"
    }'::jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT unique_worker_availability UNIQUE (worker_id)
);

-- Create indexes for performance
CREATE INDEX idx_worker_availability_worker_id ON worker_availability(worker_id);
CREATE INDEX idx_worker_availability_schedule ON worker_availability USING GIN (schedule);

-- Enable Row Level Security
ALTER TABLE worker_availability ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Anyone can view worker availability
CREATE POLICY "Anyone can view worker availability"
ON worker_availability
FOR SELECT
USING (true);

-- RLS Policy: Workers can insert own availability
CREATE POLICY "Workers can insert own availability"
ON worker_availability
FOR INSERT
TO authenticated
WITH CHECK (
    worker_id IN (
        SELECT id FROM workers WHERE user_id = auth.uid()
    )
);

-- RLS Policy: Workers can update own availability
CREATE POLICY "Workers can update own availability"
ON worker_availability
FOR UPDATE
TO authenticated
USING (
    worker_id IN (
        SELECT id FROM workers WHERE user_id = auth.uid()
    )
)
WITH CHECK (
    worker_id IN (
        SELECT id FROM workers WHERE user_id = auth.uid()
    )
);

-- Seed default availability for existing workers
-- Monday-Friday: 9 AM - 5 PM, Weekend: Closed
INSERT INTO worker_availability (worker_id, schedule)
SELECT
    id,
    '{
        "monday": "9:00 AM - 5:00 PM",
        "tuesday": "9:00 AM - 5:00 PM",
        "wednesday": "9:00 AM - 5:00 PM",
        "thursday": "9:00 AM - 5:00 PM",
        "friday": "9:00 AM - 5:00 PM",
        "saturday": "Closed",
        "sunday": "Closed"
    }'::jsonb
FROM workers
ON CONFLICT (worker_id) DO NOTHING;

-- Add helpful comments
COMMENT ON TABLE worker_availability IS 'Stores weekly availability schedule for workers using JSONB';
COMMENT ON COLUMN worker_availability.worker_id IS 'Foreign key reference to workers table';
COMMENT ON COLUMN worker_availability.schedule IS 'JSONB object containing weekly schedule with day names as keys (e.g., {"monday": "9:00 AM - 5:00 PM", "tuesday": "Closed"})';
