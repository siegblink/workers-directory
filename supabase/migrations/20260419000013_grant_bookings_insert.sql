-- Re-assert full grant on bookings for authenticated users.
-- Live DB drifted from the original GRANT ALL in the production schema migration.
GRANT ALL ON TABLE public.bookings TO authenticated;
