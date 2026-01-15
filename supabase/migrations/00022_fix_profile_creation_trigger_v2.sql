-- Fix the profile creation trigger to work on INSERT instead of UPDATE
-- This ensures profiles are created immediately when users sign up

-- Drop all existing triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_confirmed ON auth.users;

-- Recreate the trigger function with better logic
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  user_count int;
  user_category_val public.user_category;
  participation_type_val public.participation_type;
BEGIN
  -- Check if profile already exists to prevent duplicates
  IF EXISTS (SELECT 1 FROM public.profiles WHERE id = NEW.id) THEN
    RETURN NEW;
  END IF;

  SELECT COUNT(*) INTO user_count FROM profiles;
  
  -- Extract user_category from raw_user_meta_data
  BEGIN
    user_category_val := (NEW.raw_user_meta_data->>'user_category')::public.user_category;
  EXCEPTION WHEN OTHERS THEN
    user_category_val := NULL;
  END;
  
  -- Extract participation_type from raw_user_meta_data (only for Faculty)
  IF user_category_val = 'Faculty' THEN
    BEGIN
      participation_type_val := (NEW.raw_user_meta_data->>'participation_type')::public.participation_type;
    EXCEPTION WHEN OTHERS THEN
      participation_type_val := NULL;
    END;
  ELSE
    participation_type_val := NULL;
  END IF;
  
  -- Insert a profile synced with fields collected at signup
  INSERT INTO public.profiles (id, email, full_name, role, user_category, participation_type)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    CASE WHEN user_count = 0 THEN 'admin'::public.user_role ELSE 'user'::public.user_role END,
    user_category_val,
    participation_type_val
  );
  
  RETURN NEW;
END;
$$;

-- Create trigger that fires on INSERT (when user is created)
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Also keep the UPDATE trigger for email confirmation scenarios
CREATE TRIGGER on_auth_user_confirmed
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  WHEN (OLD.confirmed_at IS NULL AND NEW.confirmed_at IS NOT NULL)
  EXECUTE FUNCTION handle_new_user();

-- Backfill missing profiles for existing users
INSERT INTO public.profiles (id, email, full_name, role, user_category, participation_type)
SELECT 
  u.id,
  u.email,
  COALESCE(u.raw_user_meta_data->>'full_name', 'User') as full_name,
  'user'::public.user_role as role,
  CASE 
    WHEN u.raw_user_meta_data->>'user_category' IS NOT NULL 
    THEN (u.raw_user_meta_data->>'user_category')::public.user_category
    ELSE NULL
  END as user_category,
  CASE 
    WHEN (u.raw_user_meta_data->>'user_category')::public.user_category = 'Faculty' 
      AND u.raw_user_meta_data->>'participation_type' IS NOT NULL
    THEN (u.raw_user_meta_data->>'participation_type')::public.participation_type
    ELSE NULL
  END as participation_type
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;