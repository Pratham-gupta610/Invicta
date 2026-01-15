-- Fix the delete_user_cascade function to properly handle documents table
-- The documents table uses registration_id, not user_id

CREATE OR REPLACE FUNCTION delete_user_cascade(user_id_to_delete UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  deleted_email TEXT;
  deleted_name TEXT;
  registrations_count INT;
  team_memberships_count INT;
  result JSON;
BEGIN
  -- Check if the user exists
  SELECT email, full_name INTO deleted_email, deleted_name
  FROM public.profiles
  WHERE id = user_id_to_delete;

  IF deleted_email IS NULL THEN
    RAISE EXCEPTION 'User not found';
  END IF;

  -- Count registrations before deletion
  SELECT COUNT(*) INTO registrations_count
  FROM public.registrations
  WHERE user_id = user_id_to_delete;

  -- Count team memberships before deletion
  SELECT COUNT(*) INTO team_memberships_count
  FROM public.team_members
  WHERE user_id = user_id_to_delete;

  -- Delete documents for user's registrations (documents are linked to registrations, not users directly)
  DELETE FROM public.documents
  WHERE registration_id IN (
    SELECT id FROM public.registrations WHERE user_id = user_id_to_delete
  );

  -- Delete team members where user is a member
  DELETE FROM public.team_members
  WHERE user_id = user_id_to_delete;

  -- Delete registrations where user is the owner
  -- This will cascade delete team_members through foreign key
  DELETE FROM public.registrations
  WHERE user_id = user_id_to_delete;

  -- Delete the user profile
  DELETE FROM public.profiles
  WHERE id = user_id_to_delete;

  -- Delete from auth.users (this is the final step)
  DELETE FROM auth.users
  WHERE id = user_id_to_delete;

  -- Build result JSON
  result := json_build_object(
    'success', true,
    'deleted_user_id', user_id_to_delete,
    'deleted_email', deleted_email,
    'deleted_name', deleted_name,
    'registrations_deleted', registrations_count,
    'team_memberships_deleted', team_memberships_count
  );

  RETURN result;
EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Failed to delete user: %', SQLERRM;
END;
$$;

-- Grant execute permission to authenticated users (admin check will be done in RLS/app layer)
GRANT EXECUTE ON FUNCTION delete_user_cascade(UUID) TO authenticated;