-- Add slug column to workers table
ALTER TABLE workers ADD COLUMN slug VARCHAR(10) UNIQUE;

-- Create function to generate unique 10-digit numeric slug
CREATE OR REPLACE FUNCTION generate_worker_slug()
RETURNS VARCHAR(10) AS $$
DECLARE
  new_slug VARCHAR(10);
  slug_exists BOOLEAN;
BEGIN
  LOOP
    -- Generate random 10-digit number (1000000000 to 9999999999)
    new_slug := LPAD(FLOOR(RANDOM() * 9000000000 + 1000000000)::TEXT, 10, '0');

    -- Check if this slug already exists
    SELECT EXISTS(SELECT 1 FROM workers WHERE slug = new_slug) INTO slug_exists;

    -- Exit loop if slug is unique
    EXIT WHEN NOT slug_exists;
  END LOOP;

  RETURN new_slug;
END;
$$ LANGUAGE plpgsql;

-- Create function to set slug on insert
CREATE OR REPLACE FUNCTION set_worker_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL THEN
    NEW.slug := generate_worker_slug();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Populate existing workers with unique slugs
UPDATE workers SET slug = generate_worker_slug() WHERE slug IS NULL;

-- Make slug NOT NULL after populating existing data
ALTER TABLE workers ALTER COLUMN slug SET NOT NULL;

-- Create index on slug for faster lookups
CREATE INDEX idx_workers_slug ON workers(slug);

-- Create trigger to auto-generate slug for new workers
CREATE TRIGGER trigger_set_worker_slug
BEFORE INSERT ON workers
FOR EACH ROW
EXECUTE FUNCTION set_worker_slug();

COMMENT ON COLUMN workers.slug IS '10-digit numeric slug for worker profile URLs';
