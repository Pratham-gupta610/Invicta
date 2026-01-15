
-- CRITICAL FIX: Allow team view access for ALL team members
-- Issue: Members with NULL user_id OR members added via email cannot view team
-- Solution: Create flexible access check function

-- Drop existing function if exists
DROP FUNCTION IF EXISTS check_team_member_access(UUID, UUID);

-- Create comprehensive team access check function
CREATE OR REPLACE FUNCTION check_team_member_access(
  p_registration_id UUID,
  p_user_id UUID
) RETURNS JSON AS $$
DECLARE
  v_registration RECORD;
  v_is_leader BOOLEAN := FALSE;
  v_is_member BOOLEAN := FALSE;
  v_user_email TEXT;
BEGIN
  -- Get user email for email-based matching
  SELECT email INTO v_user_email
  FROM auth.users
  WHERE id = p_user_id;

  -- Check if registration exists
  SELECT 
    id,
    user_id as leader_id,
    team_name,
    registration_type
  INTO v_registration
  FROM registrations
  WHERE id = p_registration_id;

  -- Registration not found
  IF v_registration.id IS NULL THEN
    RETURN json_build_object(
      'success', false,
      'error_code', 'TEAM_NOT_FOUND',
      'error', 'Team does not exist',
      'http_status', 404
    );
  END IF;

  -- Check if user is the team leader
  IF p_user_id = v_registration.leader_id THEN
    v_is_leader := TRUE;
  END IF;

  -- Check if user is a team member (by user_id OR email)
  SELECT EXISTS(
    SELECT 1
    FROM team_members
    WHERE registration_id = p_registration_id
      AND (
        user_id = p_user_id 
        OR (user_id IS NULL AND LOWER(TRIM(member_email)) = LOWER(TRIM(v_user_email)))
      )
  ) INTO v_is_member;

  -- Grant access if leader OR member
  IF v_is_leader OR v_is_member THEN
    RETURN json_build_object(
      'success', true,
      'is_leader', v_is_leader,
      'is_member', v_is_member,
      'access_granted', true
    );
  ELSE
    RETURN json_build_object(
      'success', false,
      'error_code', 'ACCESS_DENIED',
      'error', 'You are not a member of this team',
      'http_status', 403,
      'debug_info', json_build_object(
        'user_id', p_user_id,
        'user_email', v_user_email,
        'registration_id', p_registration_id,
        'is_leader', v_is_leader,
        'is_member', v_is_member
      )
    );
  END IF;

EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object(
      'success', false,
      'error_code', 'SERVER_ERROR',
      'error', 'Failed to check team access: ' || SQLERRM,
      'http_status', 500
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add comment
COMMENT ON FUNCTION check_team_member_access IS 'Checks if a user has access to view a team. Matches by user_id OR email for members without linked accounts. Returns detailed access information.';

-- Create index for email-based lookups (performance optimization)
CREATE INDEX IF NOT EXISTS idx_team_members_email_lower 
ON team_members (LOWER(TRIM(member_email)));

-- Update existing team_members with user_id where possible (data fix)
UPDATE team_members tm
SET user_id = au.id
FROM auth.users au
WHERE tm.user_id IS NULL
  AND LOWER(TRIM(tm.member_email)) = LOWER(TRIM(au.email))
  AND au.id IS NOT NULL;
