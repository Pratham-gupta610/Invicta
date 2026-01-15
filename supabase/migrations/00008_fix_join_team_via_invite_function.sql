
-- Drop the old function
DROP FUNCTION IF EXISTS join_team_via_invite(TEXT, UUID, TEXT, TEXT, TEXT);

-- Create the corrected function
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
  v_existing_registration UUID;
  v_existing_member UUID;
  v_new_member_id UUID;
BEGIN
  -- Find the registration by invite code
  SELECT r.id, r.event_id, r.team_name, r.current_team_size, r.user_id as captain_id
  INTO v_registration
  FROM registrations r
  WHERE r.team_invite_code = p_invite_code
    AND r.status = 'registered'
    AND r.registration_type = 'team';

  -- Check if invite code is valid
  IF v_registration.id IS NULL THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Invalid or expired invite code'
    );
  END IF;

  -- Get event details
  SELECT e.id, e.title, e.team_size
  INTO v_event
  FROM events e
  WHERE e.id = v_registration.event_id;

  -- Check if user is the captain (cannot join own team)
  IF p_user_id = v_registration.captain_id THEN
    RETURN json_build_object(
      'success', false,
      'error', 'You are the captain of this team'
    );
  END IF;

  -- Check if user already registered for this event
  SELECT id INTO v_existing_registration
  FROM registrations
  WHERE user_id = p_user_id
    AND event_id = v_registration.event_id
    AND status = 'registered';

  IF v_existing_registration IS NOT NULL THEN
    RETURN json_build_object(
      'success', false,
      'error', 'You have already registered for this event'
    );
  END IF;

  -- Check if user is already a member of this team
  SELECT id INTO v_existing_member
  FROM team_members
  WHERE registration_id = v_registration.id
    AND member_email = p_member_email;

  IF v_existing_member IS NOT NULL THEN
    RETURN json_build_object(
      'success', false,
      'error', 'You are already a member of this team'
    );
  END IF;

  -- Get current team size (captain + members)
  v_current_size := COALESCE(v_registration.current_team_size, 1);

  -- Check team size limit
  IF v_event.team_size IS NOT NULL AND v_current_size >= v_event.team_size THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Team is full. Maximum ' || v_event.team_size || ' members allowed.'
    );
  END IF;

  -- Add member to team_members table
  INSERT INTO team_members (
    registration_id,
    member_name,
    member_email,
    member_phone,
    position
  ) VALUES (
    v_registration.id,
    p_member_name,
    p_member_email,
    p_member_phone,
    'Member'
  ) RETURNING id INTO v_new_member_id;

  -- Update team size
  UPDATE registrations
  SET current_team_size = v_current_size + 1
  WHERE id = v_registration.id;

  -- Return success
  RETURN json_build_object(
    'success', true,
    'data', json_build_object(
      'team_name', v_registration.team_name,
      'event_title', v_event.title,
      'member_id', v_new_member_id,
      'new_team_size', v_current_size + 1
    )
  );

EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object(
      'success', false,
      'error', SQLERRM
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
