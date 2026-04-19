-- Allow bookings without a specific category (worker may not have categories listed)
ALTER TABLE bookings ALTER COLUMN category_id DROP NOT NULL;
