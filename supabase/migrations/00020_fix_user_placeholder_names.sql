-- Update profiles where full_name is 'User' or NULL to extract name from email
-- This fixes legacy users who signed up before the name capture was working

-- Function to extract and format name from email
CREATE OR REPLACE FUNCTION extract_name_from_email(email_address TEXT)
RETURNS TEXT AS $$
DECLARE
  local_part TEXT;
  cleaned_part TEXT;
  name_parts TEXT[];
  formatted_name TEXT;
BEGIN
  -- Extract part before @
  local_part := split_part(email_address, '@', 1);
  
  -- Remove numbers and trailing single letters (like 23b)
  cleaned_part := regexp_replace(local_part, '\d+[a-z]?', '', 'gi');
  
  -- Split by dots, underscores, hyphens
  name_parts := regexp_split_to_array(cleaned_part, '[._-]+');
  
  -- Capitalize each part and join with space
  SELECT string_agg(initcap(part), ' ')
  INTO formatted_name
  FROM unnest(name_parts) AS part
  WHERE length(part) > 0;
  
  -- Return formatted name or 'User' if empty
  RETURN COALESCE(NULLIF(formatted_name, ''), 'User');
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Update profiles with 'User' or NULL full_name
UPDATE profiles
SET full_name = extract_name_from_email(email)
WHERE full_name = 'User' 
   OR full_name IS NULL 
   OR full_name = ''
   OR full_name = email;  -- Also fix cases where full_name is the same as email

-- Update the trigger function to use the new extraction function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(
      NULLIF(NEW.raw_user_meta_data->>'full_name', ''),
      extract_name_from_email(NEW.email)
    ),
    NEW.email,
    'user'
  )
  ON CONFLICT (id) DO UPDATE
  SET 
    username = COALESCE(EXCLUDED.username, profiles.username),
    full_name = COALESCE(
      NULLIF(EXCLUDED.full_name, ''),
      NULLIF(EXCLUDED.full_name, 'User'),
      profiles.full_name
    ),
    email = COALESCE(EXCLUDED.email, profiles.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();