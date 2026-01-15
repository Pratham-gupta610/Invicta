-- Add gender_category column to sports table
ALTER TABLE sports ADD COLUMN IF NOT EXISTS gender_category TEXT DEFAULT 'both';

-- Add check constraint for valid values
ALTER TABLE sports DROP CONSTRAINT IF EXISTS sports_gender_category_check;
ALTER TABLE sports ADD CONSTRAINT sports_gender_category_check 
  CHECK (gender_category IN ('both', 'boys', 'girls'));

-- Update sports with gender categories
-- Events for both boys and girls
UPDATE sports SET gender_category = 'both' 
WHERE slug IN ('table-tennis', 'chess', 'carrom', 'badminton', 'tug-of-war', 'shot-put', '100m-race', 'dodgeball', '7-stones', 'push-ups');

-- Events for boys only
UPDATE sports SET gender_category = 'boys' 
WHERE slug IN ('cricket', 'football', 'volleyball', 'relay', 'kabaddi');

-- Events for girls only
UPDATE sports SET gender_category = 'girls' 
WHERE slug = 'gully-cricket';