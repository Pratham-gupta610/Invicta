
-- BLOCKER FIX: Add user_id to team_members for proper role-based permissions
-- This enables:
-- 1. Team members to see events in "My Events"
-- 2. Role-based permissions (exit team for members, delete team for leaders)
-- 3. Proper event visibility for all team participants

-- Step 1: Add user_id column to team_members
ALTER TABLE team_members 
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Step 2: Add index for fast lookups
CREATE INDEX idx_team_members_user_id ON team_members(user_id);
CREATE INDEX idx_team_members_registration_user ON team_members(registration_id, user_id);

-- Step 3: Create function to get all user events (leader + member)
CREATE OR REPLACE FUNCTION get_user_events(p_user_id UUID)
RETURNS TABLE (
  registration_id UUID,
  event_id UUID,
  event_title TEXT,
  event_description TEXT,
  event_date DATE,
  event_time TIME,
  event_location TEXT,
  sport_name TEXT,
  registration_type TEXT,
  team_name TEXT,
  user_role TEXT,
  team_size INTEGER,
  current_team_size INTEGER,
  status TEXT,
  qr_code_data TEXT,
  team_invite_code TEXT,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  -- Get events where user is the leader (created the registration)
  SELECT 
    r.id as registration_id,
    e.id as event_id,
    e.title as event_title,
    e.description as event_description,
    e.event_date,
    e.event_time,
    e.location as event_location,
    s.name as sport_name,
    r.registration_type::text,
    r.team_name,
    'Leader'::text as user_role,
    e.team_size,
    r.current_team_size,
    r.status,
    r.qr_code_data,
    r.team_invite_code,
    r.created_at
  FROM registrations r
  JOIN events e ON r.event_id = e.id
  JOIN sports s ON e.sport_id = s.id
  WHERE r.user_id = p_user_id
    AND r.status IN ('registered', 'confirmed')
  
  UNION ALL
  
  -- Get events where user is a team member
  SELECT 
    r.id as registration_id,
    e.id as event_id,
    e.title as event_title,
    e.description as event_description,
    e.event_date,
    e.event_time,
    e.location as event_location,
    s.name as sport_name,
    r.registration_type::text,
    r.team_name,
    'Member'::text as user_role,
    e.team_size,
    r.current_team_size,
    r.status,
    r.qr_code_data,
    r.team_invite_code,
    tm.created_at
  FROM team_members tm
  JOIN registrations r ON tm.registration_id = r.id
  JOIN events e ON r.event_id = e.id
  JOIN sports s ON e.sport_id = s.id
  WHERE tm.user_id = p_user_id
    AND r.status IN ('registered', 'confirmed')
  
  ORDER BY created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 4: Create function to exit team (members only)
CREATE OR REPLACE FUNCTION exit_team(
  p_registration_id UUID,
  p_user_id UUID
) RETURNS JSON AS $$
DECLARE
  v_member_record RECORD;
  v_registration RECORD;
BEGIN
  -- Check if user is a member of this team
  SELECT tm.id, tm.user_id, tm.registration_id
  INTO v_member_record
  FROM team_members tm
  WHERE tm.registration_id = p_registration_id
    AND tm.user_id = p_user_id;
  
  IF v_member_record.id IS NULL THEN
    -- Check if user is the leader
    SELECT r.id, r.user_id
    INTO v_registration
    FROM registrations r
    WHERE r.id = p_registration_id
      AND r.user_id = p_user_id;
    
    IF v_registration.id IS NOT NULL THEN
      RETURN json_build_object(
        'success', false,
        'error_code', 'LEADER_CANNOT_EXIT',
        'error', 'Team leaders cannot exit the team. Please delete the team instead.'
      );
    ELSE
      RETURN json_build_object(
        'success', false,
        'error_code', 'NOT_A_MEMBER',
        'error', 'You are not a member of this team'
      );
    END IF;
  END IF;
  
  -- Remove member from team
  DELETE FROM team_members
  WHERE id = v_member_record.id;
  
  -- Update team size
  UPDATE registrations
  SET current_team_size = GREATEST(1, COALESCE(current_team_size, 1) - 1)
  WHERE id = p_registration_id;
  
  RETURN json_build_object(
    'success', true,
    'message', 'Successfully exited the team'
  );
  
EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object(
      'success', false,
      'error_code', 'DATABASE_ERROR',
      'error', 'Failed to exit team: ' || SQLERRM
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 5: Create function to delete team (leaders only)
CREATE OR REPLACE FUNCTION delete_team(
  p_registration_id UUID,
  p_user_id UUID
) RETURNS JSON AS $$
DECLARE
  v_registration RECORD;
BEGIN
  -- Check if user is the leader of this team
  SELECT r.id, r.user_id, r.team_name
  INTO v_registration
  FROM registrations r
  WHERE r.id = p_registration_id
    AND r.user_id = p_user_id
    AND r.registration_type = 'team';
  
  IF v_registration.id IS NULL THEN
    -- Check if user is just a member
    PERFORM 1 FROM team_members tm
    WHERE tm.registration_id = p_registration_id
      AND tm.user_id = p_user_id;
    
    IF FOUND THEN
      RETURN json_build_object(
        'success', false,
        'error_code', 'MEMBER_CANNOT_DELETE',
        'error', 'Only the team leader can delete the team. Use "Exit Team" instead.'
      );
    ELSE
      RETURN json_build_object(
        'success', false,
        'error_code', 'NOT_AUTHORIZED',
        'error', 'You are not authorized to delete this team'
      );
    END IF;
  END IF;
  
  -- Delete team members (CASCADE will handle this, but explicit for clarity)
  DELETE FROM team_members
  WHERE registration_id = p_registration_id;
  
  -- Delete registration (this invalidates invite codes and removes team)
  DELETE FROM registrations
  WHERE id = p_registration_id;
  
  RETURN json_build_object(
    'success', true,
    'message', 'Team "' || v_registration.team_name || '" has been deleted'
  );
  
EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object(
      'success', false,
      'error_code', 'DATABASE_ERROR',
      'error', 'Failed to delete team: ' || SQLERRM
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 6: Update join_team_via_invite to set user_id
-- This ensures new members have user_id set
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

  -- Add member to team with user_id
  INSERT INTO team_members (
    registration_id,
    user_id,
    member_name,
    member_email,
    member_phone,
    position
  ) VALUES (
    v_registration.id,
    p_user_id,
    p_member_name,
    NULLIF(p_member_email, ''),
    NULLIF(p_member_phone, ''),
    'Member'
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add comments
COMMENT ON FUNCTION get_user_events IS 'Returns all events for a user, including events where they are a team leader or team member';
COMMENT ON FUNCTION exit_team IS 'Allows team members to exit a team. Leaders cannot exit, they must delete the team instead.';
COMMENT ON FUNCTION delete_team IS 'Allows team leaders to delete their team. Members cannot delete, they must exit instead.';
