
-- Make total_slots nullable since we no longer use slot limits
ALTER TABLE events 
ALTER COLUMN total_slots DROP NOT NULL;

-- Set existing events to NULL for total_slots
UPDATE events 
SET total_slots = NULL, available_slots = NULL
WHERE total_slots IS NOT NULL;
