-- Add sort_order column to people table for drag and drop ordering
ALTER TABLE people ADD COLUMN IF NOT EXISTS sort_order integer DEFAULT 0;

-- Update existing rows to have a sort order based on name
WITH numbered AS (
  SELECT id, ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY name) as rn
  FROM people
)
UPDATE people
SET sort_order = numbered.rn
FROM numbered
WHERE people.id = numbered.id;
