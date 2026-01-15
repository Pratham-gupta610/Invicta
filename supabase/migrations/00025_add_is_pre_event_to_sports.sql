-- Add is_pre_event column to sports table
ALTER TABLE sports ADD COLUMN IF NOT EXISTS is_pre_event BOOLEAN DEFAULT false;

-- Update the three pre-events
UPDATE sports SET is_pre_event = true WHERE slug IN ('push-ups', '7-stones', 'gully-cricket');