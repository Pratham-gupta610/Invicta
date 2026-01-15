-- Step 1: Remove slot-related columns from events table
-- Make available_slots nullable and set to NULL for unlimited participation
ALTER TABLE events 
ALTER COLUMN available_slots DROP NOT NULL;

UPDATE events SET available_slots = NULL;

-- Add comment to clarify unlimited participation
COMMENT ON COLUMN events.available_slots IS 'NULL means unlimited participation';

-- Step 2: Add team invite QR code to registrations table
ALTER TABLE registrations 
ADD COLUMN team_invite_code TEXT UNIQUE;

-- Generate unique invite codes for existing team registrations
UPDATE registrations 
SET team_invite_code = 'TEAM-' || id::text || '-' || substr(md5(random()::text), 1, 8)
WHERE registration_type = 'team' AND team_invite_code IS NULL;

-- Step 3: Create index for fast team invite lookups
CREATE INDEX IF NOT EXISTS idx_registrations_team_invite 
ON registrations(team_invite_code) WHERE team_invite_code IS NOT NULL;

-- Step 4: Add team member count tracking
ALTER TABLE registrations 
ADD COLUMN current_team_size INTEGER DEFAULT 1;

-- Update current team size for existing registrations
UPDATE registrations r
SET current_team_size = (
  SELECT COUNT(*) 
  FROM team_members tm 
  WHERE tm.registration_id = r.id
) + 1  -- +1 for the captain
WHERE r.registration_type = 'team';

-- Step 5: Create function to generate team invite code
CREATE OR REPLACE FUNCTION generate_team_invite_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.registration_type = 'team' AND NEW.team_invite_code IS NULL THEN
    NEW.team_invite_code := 'TEAM-' || NEW.id::text || '-' || substr(md5(random()::text), 1, 8);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-generate invite codes
DROP TRIGGER IF EXISTS trigger_generate_team_invite ON registrations;
CREATE TRIGGER trigger_generate_team_invite
  BEFORE INSERT ON registrations
  FOR EACH ROW
  EXECUTE FUNCTION generate_team_invite_code();

-- Step 6: Create function to join team via invite code
CREATE OR REPLACE FUNCTION join_team_via_invite(
  p_invite_code TEXT,
  p_user_id UUID,
  p_member_name TEXT,
  p_member_email TEXT,
  p_member_phone TEXT
) RETURNS JSON AS $$
DECLARE
  v_registration RECORD;
  v_event RECORD;
  v_current_size INTEGER;
  v_result JSON;
BEGIN
  -- Find the registration by invite code
  SELECT * INTO v_registration
  FROM registrations
  WHERE team_invite_code = p_invite_code
  AND registration_type = 'team'
  AND status = 'confirmed';

  IF NOT FOUND THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Invalid or expired invite code'
    );
  END IF;

  -- Get event details
  SELECT * INTO v_event
  FROM events
  WHERE id = v_registration.event_id;

  -- Check if user already registered for this event
  IF EXISTS (
    SELECT 1 FROM registrations 
    WHERE user_id = p_user_id 
    AND event_id = v_registration.event_id
  ) THEN
    RETURN json_build_object(
      'success', false,
      'error', 'You have already registered for this event'
    );
  END IF;

  -- Check current team size
  SELECT current_team_size INTO v_current_size
  FROM registrations
  WHERE id = v_registration.id;

  -- Check if team is full
  IF v_event.team_size IS NOT NULL AND v_current_size >= v_event.team_size THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Team is full. Maximum ' || v_event.team_size || ' members allowed.'
    );
  END IF;

  -- Add team member
  INSERT INTO team_members (
    registration_id,
    member_name,
    member_email,
    member_phone,
    user_id
  ) VALUES (
    v_registration.id,
    p_member_name,
    p_member_email,
    p_member_phone,
    p_user_id
  );

  -- Update team size
  UPDATE registrations
  SET current_team_size = current_team_size + 1
  WHERE id = v_registration.id;

  RETURN json_build_object(
    'success', true,
    'team_name', v_registration.team_name,
    'event_name', v_event.name,
    'current_size', v_current_size + 1,
    'max_size', v_event.team_size
  );

EXCEPTION WHEN OTHERS THEN
  RETURN json_build_object(
    'success', false,
    'error', SQLERRM
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 7: Add trigger to update team size when members are added/removed
CREATE OR REPLACE FUNCTION update_team_size()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE registrations
    SET current_team_size = current_team_size + 1
    WHERE id = NEW.registration_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE registrations
    SET current_team_size = current_team_size - 1
    WHERE id = OLD.registration_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_team_size ON team_members;
CREATE TRIGGER trigger_update_team_size
  AFTER INSERT OR DELETE ON team_members
  FOR EACH ROW
  EXECUTE FUNCTION update_team_size();