-- ============================================
-- SEED REALISTIC DATA WITH 3 ROLES
-- 1 = ADMIN, 2 = WORKER, 3 = USER (customer)
-- ============================================
-- WARNING: This migration will TRUNCATE all data tables
-- Only run this on a fresh database or when you want to reset test data

-- Check if data already exists
DO $$
DECLARE
  user_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO user_count FROM public.users;

  IF user_count > 0 THEN
    RAISE NOTICE 'Database already contains % users. Skipping seed data migration.', user_count;
    RAISE NOTICE 'To reset data, manually truncate tables first.';
    RETURN;
  END IF;
END $$;

DO $$
DECLARE
  professions TEXT[] := ARRAY['Plumber', 'Electrician', 'Cleaner', 'Painter', 'Carpenter', 'HVAC Technician', 'Landscaper', 'Handyman', 'Roofer', 'Locksmith'];
  cities TEXT[] := ARRAY['Manila', 'Quezon City', 'Makati', 'Taguig', 'Pasig', 'Cebu City', 'Mandaue City', 'Lapu-Lapu', 'Davao City', 'Cagayan de Oro', 'Iloilo City', 'Baguio'];
  states TEXT[] := ARRAY['Metro Manila', 'Metro Manila', 'Metro Manila', 'Metro Manila', 'Metro Manila', 'Cebu', 'Cebu', 'Cebu', 'Davao del Sur', 'Misamis Oriental', 'Iloilo', 'Benguet'];
  first_names TEXT[] := ARRAY['Juan', 'Maria', 'Jose', 'Ana', 'Pedro', 'Sofia', 'Miguel', 'Isabel', 'Carlos', 'Rosa', 'Luis', 'Carmen', 'Antonio', 'Elena', 'Francisco', 'Teresa', 'Manuel', 'Patricia', 'Jorge', 'Laura'];
  last_names TEXT[] := ARRAY['Santos', 'Reyes', 'Cruz', 'Bautista', 'Garcia', 'Mendoza', 'Torres', 'Rivera', 'Fernandez', 'Ramos', 'Flores', 'Gonzales', 'Perez', 'Sanchez', 'Castro', 'Morales', 'Aquino', 'Villanueva', 'Lopez', 'Hernandez'];

  city_lats NUMERIC[] := ARRAY[14.5995, 14.6760, 14.5547, 14.5176, 14.5764, 10.3157, 10.3237, 10.3103, 7.1907, 8.4542, 10.7202, 16.4023];
  city_lons NUMERIC[] := ARRAY[120.9842, 121.0437, 121.0244, 121.0509, 121.0851, 123.8854, 123.9222, 123.9494, 125.4553, 124.6319, 122.5621, 120.5960];

  first_name TEXT;
  last_name TEXT;
  profession TEXT;
  city TEXT;
  state TEXT;
  base_lat NUMERIC;
  base_lon NUMERIC;
  worker_id UUID;
  customer_id UUID;
  i INTEGER;
  seed INTEGER;
  j INTEGER;
  city_index INTEGER;

  admin_user_id UUID;
  customer_ids UUID[];
BEGIN
  RAISE NOTICE '============================================';
  RAISE NOTICE 'Seeding database with 3 roles';
  RAISE NOTICE '1 = ADMIN, 2 = WORKER, 3 = USER (customer)';
  RAISE NOTICE '============================================';

  -- Create Admin User
  admin_user_id := gen_random_uuid();
  INSERT INTO public.users (
    id, firstname, lastname, role, status,
    city, state, bio, created_at
  ) VALUES (
    admin_user_id,
    'System',
    'Administrator',
    1,
    'active',
    'Manila',
    'Metro Manila',
    'Platform administrator with full system access and management capabilities.',
    NOW()
  );
  RAISE NOTICE '✓ Created 1 admin user';

  -- Create Customer Users (50 users)
  FOR i IN 1..50 LOOP
    seed := i * 11;
    city_index := ((i - 1) % array_length(cities, 1)) + 1;

    first_name := first_names[(seed % array_length(first_names, 1)) + 1];
    last_name := last_names[((seed + 1) % array_length(last_names, 1)) + 1];
    city := cities[city_index];
    state := states[city_index];
    base_lat := city_lats[city_index];
    base_lon := city_lons[city_index];

    customer_id := gen_random_uuid();
    customer_ids := array_append(customer_ids, customer_id);

    INSERT INTO public.users (
      id, firstname, lastname, role, status,
      city, state, latitude, longitude, bio, created_at
    ) VALUES (
      customer_id,
      first_name,
      last_name,
      3,
      'active',
      city,
      state,
      base_lat + (random() * 0.08 - 0.04),
      base_lon + (random() * 0.08 - 0.04),
      'Customer from ' || city || ' looking for quality home services.',
      NOW() - (random() * interval '2 years')
    );
  END LOOP;
  RAISE NOTICE '✓ Created 50 customer users (role=3)';

  -- Create Worker Users (72 workers = 6 per city)
  FOR i IN 1..72 LOOP
    seed := i * 7;
    city_index := ((i - 1) % array_length(cities, 1)) + 1;

    first_name := first_names[(seed % array_length(first_names, 1)) + 1];
    last_name := last_names[((seed + 1) % array_length(last_names, 1)) + 1];
    profession := professions[((seed + 2) % array_length(professions, 1)) + 1];
    city := cities[city_index];
    state := states[city_index];
    base_lat := city_lats[city_index];
    base_lon := city_lons[city_index];

    worker_id := gen_random_uuid();

    INSERT INTO public.users (
      id, firstname, lastname, role, status,
      city, state, latitude, longitude, bio, created_at
    ) VALUES (
      worker_id,
      first_name,
      last_name,
      2,
      'active',
      city,
      state,
      base_lat + (random() * 0.08 - 0.04),
      base_lon + (random() * 0.08 - 0.04),
      'Professional ' || profession || ' with ' || (2 + ((seed + 6) % 18)) || ' years of experience serving ' || city || ' and surrounding areas. Committed to quality work and customer satisfaction.',
      NOW() - (random() * interval '3 years')
    );

    INSERT INTO public.workers (
      worker_id, profession, hourly_rate_min, hourly_rate_max,
      years_experience, jobs_completed, response_time_minutes,
      is_verified, skills, status, created_at
    ) VALUES (
      worker_id,
      profession,
      50 + (((seed + 4) % 10) * 10),
      100 + (((seed + 5) % 15) * 10),
      2 + ((seed + 6) % 18),
      10 + ((seed + 7) % 490),
      10 + ((seed + 8) % 110),
      ((seed + 9) % 10) > 3,
      ARRAY[profession, 'General Maintenance', 'Emergency Services', 'Quality Assurance'],
      'available',
      NOW() - (random() * interval '3 years')
    );

    INSERT INTO public.user_presence (
      user_id, is_online, last_seen
    ) VALUES (
      worker_id,
      ((seed + 10) % 10) > 6,
      NOW() - (random() * interval '3 hours')
    );

    -- Create Bookings & Ratings
    FOR j IN 1..(5 + ((seed + 11) % 10)) LOOP
      DECLARE
        booking_id UUID := gen_random_uuid();
        selected_customer_id UUID;
        category_id UUID;
        rating_val INTEGER;
        booking_status TEXT;
      BEGIN
        selected_customer_id := customer_ids[(((seed + j) % array_length(customer_ids, 1)) + 1)];

        SELECT id INTO category_id FROM public.categories WHERE name = profession LIMIT 1;
        IF category_id IS NULL THEN
          category_id := gen_random_uuid();
          INSERT INTO public.categories (id, name, description)
          VALUES (category_id, profession, 'Professional ' || profession || ' services')
          ON CONFLICT DO NOTHING;
        END IF;

        -- Valid statuses: pending, completed, canceled
        IF j = 1 THEN
          booking_status := 'pending';
        ELSIF j = 2 AND ((seed + j) % 10) > 7 THEN
          booking_status := 'canceled';
        ELSE
          booking_status := 'completed';
        END IF;

        INSERT INTO public.bookings (
          id, customer_id, worker_id, category_id, description, status,
          requested_at, completed_at, created_at
        ) VALUES (
          booking_id,
          selected_customer_id,
          worker_id,
          category_id,
          profession || ' service needed in ' || city || '. ' ||
          CASE ((seed + j) % 5)
            WHEN 0 THEN 'Urgent repair needed.'
            WHEN 1 THEN 'Regular maintenance required.'
            WHEN 2 THEN 'Installation and setup.'
            WHEN 3 THEN 'Inspection and consultation.'
            ELSE 'General service request.'
          END,
          booking_status,
          NOW() - (random() * interval '1 year'),
          CASE WHEN booking_status = 'completed' THEN NOW() - (random() * interval '10 months') ELSE NULL END,
          NOW() - (random() * interval '1 year')
        );

        -- Create rating only for completed bookings
        IF booking_status = 'completed' THEN
          rating_val := 3 + ((seed + j) % 3);
          INSERT INTO public.ratings (
            booking_id, customer_id, worker_id,
            rating_value, review_comment, created_at
          ) VALUES (
            booking_id,
            selected_customer_id,
            worker_id,
            rating_val,
            CASE rating_val
              WHEN 5 THEN CASE ((seed + j) % 4)
                WHEN 0 THEN 'Outstanding work! Highly professional and efficient.'
                WHEN 1 THEN 'Excellent service! Will definitely hire again.'
                WHEN 2 THEN 'Very satisfied with the quality of work. Highly recommended!'
                ELSE 'Perfect! Exceeded my expectations.'
              END
              WHEN 4 THEN CASE ((seed + j) % 3)
                WHEN 0 THEN 'Great service. Very reliable and professional.'
                WHEN 1 THEN 'Good work done on time. Would recommend.'
                ELSE 'Satisfied with the service provided.'
              END
              ELSE 'Good service overall. Met expectations.'
            END,
            NOW() - (random() * interval '9 months')
          );
        END IF;
      END;
    END LOOP;

    IF i % 12 = 0 THEN
      RAISE NOTICE '  → Created % workers...', i;
    END IF;

  END LOOP;
  RAISE NOTICE '✓ Created 72 workers (role=2) with bookings and ratings';
  RAISE NOTICE '============================================';
  RAISE NOTICE 'Database seeding complete!';
  RAISE NOTICE '============================================';
END $$;
