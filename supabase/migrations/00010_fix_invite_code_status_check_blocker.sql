
-- BLOCKER FIX: Update join_team_via_invite function to accept correct status values
-- The function was checking for status='registered' but registrations use status='confirmed'
-- This caused ALL invite codes to be rejected as "Invalid or expired"

DROP FUNCTION IF EXISTS join_team_via_invite(TEXT, UUID, TEXT, TEXT, TEXT);

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
  -- VALIDATION STEP 1: Find the registration by invite code
  -- Accept both 'registered' and 'confirmed' status (system uses 'confirmed')
  -- Only check that registration_type is 'team'
  SELECT r.id, r.event_id, r.team_name, r.current_team_size, r.user_id as captain_id, r.status
  INTO v_registration
  FROM registrations r
  WHERE r.team_invite_code = p_invite_code
    AND r.registration_type = 'team'
    AND r.status IN ('registered', 'confirmed');  -- FIXED: Accept both statuses

  -- Check if invite code exists in database
  IF v_registration.id IS NULL THEN
    -- Check if code exists but with wrong status
    PERFORM 1 FROM registrations WHERE team_invite_code = p_invite_code;
    IF FOUND THEN
      RETURN json_build_object(
        'success', false,
        'error_code', 'INVITE_REVOKED',
        'error', 'This invite has been revoked or cancelled'
      );
    ELSE
      RETURN json_build_object(
        'success', false,
        'error_code', 'INVITE_NOT_FOUND',
        'error', 'Invalid or expired invite code'
      );
    END IF;
  END IF;

  -- VALIDATION STEP 2: Get event details and check if event is active
  SELECT e.id, e.title, e.team_size, e.status
  INTO v_event
  FROM events e
  WHERE e.id = v_registration.event_id;

  IF v_event.id IS NULL THEN
    RETURN json_build_object(
      'success', false,
      'error_code', 'EVENT_NOT_FOUND',
      'error', 'Event not found'
    );
  END IF;

  -- Check if event is still accepting registrations
  IF v_event.status != 'upcoming' THEN
    RETURN json_build_object(
      'success', false,
      'error_code', 'EVENT_CLOSED',
      'error', 'Event registration is closed'
    );
  END IF;

  -- VALIDATION STEP 3: Check if user is the captain (cannot join own team)
  IF p_user_id = v_registration.captain_id THEN
    RETURN json_build_object(
      'success', false,
      'error_code', 'CAPTAIN_CANNOT_JOIN',
      'error', 'You are the captain of this team'
    );
  END IF;

  -- VALIDATION STEP 4: Check if user already registered for this event
  SELECT id INTO v_existing_registration
  FROM registrations
  WHERE user_id = p_user_id
    AND event_id = v_registration.event_id
    AND status IN ('registered', 'confirmed');

  IF v_existing_registration IS NOT NULL THEN
    RETURN json_build_object(
      'success', false,
      'error_code', 'ALREADY_REGISTERED',
      'error', 'You have already registered for this event'
    );
  END IF;

  -- VALIDATION STEP 5: Check if user is already a member of this team (by email)
  IF p_member_email IS NOT NULL AND p_member_email != '' THEN
    SELECT id INTO v_existing_member
    FROM team_members
    WHERE registration_id = v_registration.id
      AND member_email = p_member_email;

    IF v_existing_member IS NOT NULL THEN
      RETURN json_build_object(
        'success', false,
        'error_code', 'ALREADY_MEMBER',
        'error', 'You are already a member of this team'
      );
    END IF;
  END IF;

  -- VALIDATION STEP 6: Get current team size and check if team is full
  v_current_size := COALESCE(v_registration.current_team_size, 1);

  IF v_event.team_size IS NOT NULL AND v_current_size >= v_event.team_size THEN
    RETURN json_build_object(
      'success', false,
      'error_code', 'TEAM_FULL',
      'error', 'Team is full. Maximum ' || v_event.team_size || ' members allowed. Current size: ' || v_current_size
    );
  END IF;

  -- ALL VALIDATIONS PASSED: Add member to team
  INSERT INTO team_members (
    registration_id,
    member_name,
    member_email,
    member_phone,
    position
  ) VALUES (
    v_registration.id,
    p_member_name,
    NULLIF(p_member_email, ''),  -- Convert empty string to NULL
    NULLIF(p_member_phone, ''),  -- Convert empty string to NULL
    'Member'
  ) RETURNING id INTO v_new_member_id;

  -- Update team size counter
  UPDATE registrations
  SET current_team_size = v_current_size + 1
  WHERE id = v_registration.id;

  -- Return success with detailed information
  RETURN json_build_object(
    'success', true,
    'data', json_build_object(
      'team_name', v_registration.team_name,
      'event_title', v_event.title,
      'member_id', v_new_member_id,
      'new_team_size', v_current_size + 1,
      'max_team_size', v_event.team_size
    )
  );

EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object(
      'success', false,
      'error_code', 'DATABASE_ERROR',
      'error', 'Database error: ' || SQLERRM
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add comment explaining the function
COMMENT ON FUNCTION join_team_via_invite IS 'Allows users to join a team using an invite code. Performs validation in strict order: 1) invite exists, 2) team exists, 3) event active, 4) team not full, 5) user not already registered. Returns structured error codes for proper frontend handling.';
