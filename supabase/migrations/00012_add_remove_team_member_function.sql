
-- BLOCKER FIX: Add remove_team_member function with strict role enforcement
-- Only team leaders can remove members
-- Leaders cannot remove themselves

CREATE OR REPLACE FUNCTION remove_team_member(
  p_member_id UUID,
  p_requesting_user_id UUID
) RETURNS JSON AS $$
DECLARE
  v_member RECORD;
  v_registration RECORD;
BEGIN
  -- Get the team member details
  SELECT 
    tm.id,
    tm.user_id,
    tm.member_name,
    tm.registration_id
  INTO v_member
  FROM team_members tm
  WHERE tm.id = p_member_id;
  
  -- Check if member exists
  IF v_member.id IS NULL THEN
    RETURN json_build_object(
      'success', false,
      'error_code', 'MEMBER_NOT_FOUND',
      'error', 'Team member not found'
    );
  END IF;
  
  -- Get the registration (team) details
  SELECT 
    r.id,
    r.user_id as leader_id,
    r.team_name,
    r.current_team_size
  INTO v_registration
  FROM registrations r
  WHERE r.id = v_member.registration_id
    AND r.registration_type = 'team';
  
  -- Check if registration exists
  IF v_registration.id IS NULL THEN
    RETURN json_build_object(
      'success', false,
      'error_code', 'TEAM_NOT_FOUND',
      'error', 'Team not found'
    );
  END IF;
  
  -- CRITICAL: Check if requesting user is the team leader
  IF p_requesting_user_id != v_registration.leader_id THEN
    RETURN json_build_object(
      'success', false,
      'error_code', 'FORBIDDEN',
      'error', 'Only the team leader can remove members',
      'http_status', 403
    );
  END IF;
  
  -- CRITICAL: Leader cannot remove themselves (they should delete team instead)
  IF v_member.user_id = v_registration.leader_id THEN
    RETURN json_build_object(
      'success', false,
      'error_code', 'CANNOT_REMOVE_LEADER',
      'error', 'Team leader cannot be removed. Use "Delete Team" instead.'
    );
  END IF;
  
  -- Remove the member
  DELETE FROM team_members
  WHERE id = p_member_id;
  
  -- Update team size
  UPDATE registrations
  SET current_team_size = GREATEST(1, COALESCE(current_team_size, 1) - 1)
  WHERE id = v_registration.id;
  
  RETURN json_build_object(
    'success', true,
    'message', 'Member "' || v_member.member_name || '" has been removed from the team',
    'removed_user_id', v_member.user_id
  );
  
EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object(
      'success', false,
      'error_code', 'DATABASE_ERROR',
      'error', 'Failed to remove member: ' || SQLERRM
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add comment
COMMENT ON FUNCTION remove_team_member IS 'Allows team leaders to remove members from their team. Leaders cannot remove themselves. Returns 403 if non-leader attempts removal.';
