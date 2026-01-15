-- Add user_category and participation_type columns to profiles table
-- user_category: BTech 1st-4th Year, MTech 1st-2nd Year, PhD Scholar, Faculty, Staff, Alumni
-- participation_type: Only for Faculty (Friendly or Competitive)

-- Create enum for user categories
CREATE TYPE public.user_category AS ENUM (
  'BTech 1st Year',
  'BTech 2nd Year',
  'BTech 3rd Year',
  'BTech 4th Year',
  'MTech 1st Year',
  'MTech 2nd Year',
  'PhD Scholar',
  'Faculty',
  'Staff',
  'Alumni'
);

-- Create enum for participation types (Faculty only)
CREATE TYPE public.participation_type AS ENUM (
  'Friendly',
  'Competitive'
);

-- Add columns to profiles table
ALTER TABLE public.profiles
ADD COLUMN user_category public.user_category,
ADD COLUMN participation_type public.participation_type;

-- Update the handle_new_user trigger function to include new fields
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
  SELECT COUNT(*) INTO user_count FROM profiles;
  
  -- Extract user_category from raw_user_meta_data
  user_category_val := (NEW.raw_user_meta_data->>'user_category')::public.user_category;
  
  -- Extract participation_type from raw_user_meta_data (only for Faculty)
  IF user_category_val = 'Faculty' THEN
    participation_type_val := (NEW.raw_user_meta_data->>'participation_type')::public.participation_type;
  ELSE
    participation_type_val := NULL;
  END IF;
  
  -- Insert a profile synced with fields collected at signup
  INSERT INTO public.profiles (id, email, full_name, role, user_category, participation_type)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    CASE WHEN user_count = 0 THEN 'admin'::public.user_role ELSE 'user'::public.user_role END,
    user_category_val,
    participation_type_val
  );
  RETURN NEW;
END;
$$;

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_confirmed ON auth.users;
CREATE TRIGGER on_auth_user_confirmed
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  WHEN (OLD.confirmed_at IS NULL AND NEW.confirmed_at IS NOT NULL)
  EXECUTE FUNCTION handle_new_user();