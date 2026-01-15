-- Remove member_phone and position columns from team_members table
ALTER TABLE team_members 
DROP COLUMN IF EXISTS member_phone,
DROP COLUMN IF EXISTS position;