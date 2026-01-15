-- Add full_name column to profiles table
ALTER TABLE public.profiles ADD COLUMN full_name TEXT;

-- Update existing profiles to have a placeholder name if null
-- This handles legacy users who signed up before the name field was added
UPDATE public.profiles 
SET full_name = COALESCE(username, 'User')
WHERE full_name IS NULL;