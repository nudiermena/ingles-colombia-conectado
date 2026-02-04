-- Ensure profiles has an email column and populate it from auth.users.
-- This enables showing real emails in Admin > Usuarios without querying auth.users from the client.

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS email text;

-- Unique index (case-insensitive) for non-null emails
CREATE UNIQUE INDEX IF NOT EXISTS profiles_email_lower_unique
  ON public.profiles (lower(email))
  WHERE email IS NOT NULL;

-- Backfill existing profile emails from auth.users
UPDATE public.profiles p
SET email = u.email
FROM auth.users u
WHERE u.id = p.user_id
  AND (p.email IS NULL OR p.email = '');

-- Update trigger function to store email on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.email
  );
  RETURN NEW;
END;
$$;

