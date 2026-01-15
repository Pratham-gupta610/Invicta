-- Drop and recreate the join_team_via_invite function without member_phone and position
DROP FUNCTION IF EXISTS join_team_via_invite(TEXT, UUID, TEXT, TEXT, TEXT);

CREATE OR REPLACE FUNCTION join_team_via_invite(
  p_invite_code TEXT,
  p_user_id UUID,
  p_member_name TEXT,
  p_member_email TEXT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_registration RECORD;
  v_event RECORD;
  v_current_size INTEGER;
  v_existing_registration UUID;
  v_existing_member UUID;
  v_new_member_id UUID;
BEGIN
  -- Find the registration by invite code
  SELECT r.id, r.event_id, r.team_name, r.current_team_size, r.user_id as captain_id, r.status
  INTO v_registration
  FROM registrations r
  WHERE r.team_invite_code = p_invite_code
    AND r.registration_type = 'team'
    AND r.status IN ('registered', 'confirmed');

  IF v_registration.id IS NULL THEN
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

  -- Get event details
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

  IF v_event.status != 'upcoming' THEN
    RETURN json_build_object(
      'success', false,
      'error_code', 'EVENT_CLOSED',
      'error', 'Event registration is closed'
    );
  END IF;

  -- Check if user is the captain
  IF p_user_id = v_registration.captain_id THEN
    RETURN json_build_object(
      'success', false,
      'error_code', 'CAPTAIN_CANNOT_JOIN',
      'error', 'You are the captain of this team'
    );
  END IF;

  -- Check if user already registered for this event
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

  -- Check if user is already a member by user_id
  SELECT id INTO v_existing_member
  FROM team_members
  WHERE registration_id = v_registration.id
    AND user_id = p_user_id;

  IF v_existing_member IS NOT NULL THEN
    RETURN json_build_object(
      'success', false,
      'error_code', 'ALREADY_MEMBER',
      'error', 'You are already a member of this team'
    );
  END IF;

  -- Get current team size
  v_current_size := COALESCE(v_registration.current_team_size, 1);

  -- Check team size limit
  IF v_event.team_size IS NOT NULL AND v_current_size >= v_event.team_size THEN
    RETURN json_build_object(
      'success', false,
      'error_code', 'TEAM_FULL',
      'error', 'Team is full. Maximum ' || v_event.team_size || ' members allowed. Current size: ' || v_current_size
    );
  END IF;

  -- Add member to team with user_id (removed member_phone and position)
  INSERT INTO team_members (
    registration_id,
    user_id,
    member_name,
    member_email
  ) VALUES (
    v_registration.id,
    p_user_id,
    p_member_name,
    NULLIF(p_member_email, '')
  ) RETURNING id INTO v_new_member_id;

  -- Update team size
  UPDATE registrations
  SET current_team_size = v_current_size + 1
  WHERE id = v_registration.id;

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
$$;