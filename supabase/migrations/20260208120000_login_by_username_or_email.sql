-- Migration: Allow login by username or email
-- 1. Add username column to profiles if it doesn't exist
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS username text;

-- 2. Unique case-insensitive index on username (ignoring null/empty)
CREATE UNIQUE INDEX IF NOT EXISTS profiles_username_lower_unique
  ON public.profiles (lower(trim(username)))
  WHERE username IS NOT NULL AND trim(username) <> '';

-- 3. Backfill existing profiles with a username derived from email or id
WITH base AS (
  SELECT 
    id,
    lower(regexp_replace(split_part(email, '@', 1), '[^a-zA-Z0-9._-]', '', 'g')) AS base_username,
    ROW_NUMBER() OVER (
      PARTITION BY lower(regexp_replace(split_part(email, '@', 1), '[^a-zA-Z0-9._-]', '', 'g'))
      ORDER BY created_at ASC
    ) AS rn
  FROM public.profiles
  WHERE (username IS NULL OR trim(username) = '')
    AND email IS NOT NULL
)
UPDATE public.profiles p
SET username = CASE 
  WHEN b.base_username IS NULL OR b.base_username = '' THEN 'user_' || substr(p.user_id::text, 1, 6)
  WHEN b.rn = 1 THEN b.base_username
  ELSE b.base_username || b.rn::text
END
FROM base b
WHERE p.id = b.id;

-- 4. Update trigger function to assign username on new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_username text;
  v_candidate text;
  v_counter integer := 1;
BEGIN
  v_candidate := COALESCE(
    NULLIF(TRIM(NEW.raw_user_meta_data->>'username'), ''),
    lower(regexp_replace(split_part(NEW.email, '@', 1), '[^a-zA-Z0-9._-]', '', 'g'))
  );
  
  IF v_candidate IS NULL OR v_candidate = '' THEN
    v_candidate := 'user_' || substr(NEW.id::text, 1, 6);
  END IF;

  v_username := v_candidate;
  WHILE EXISTS (SELECT 1 FROM public.profiles WHERE lower(username) = lower(v_username) AND user_id <> NEW.id) LOOP
    v_counter := v_counter + 1;
    v_username := v_candidate || v_counter::text;
  END LOOP;

  INSERT INTO public.profiles (user_id, full_name, email, username)
  VALUES (
    NEW.id,
    COALESCE(NULLIF(TRIM(NEW.raw_user_meta_data->>'full_name'), ''), NEW.email),
    NEW.email,
    v_username
  )
  ON CONFLICT (user_id) DO UPDATE
  SET
    full_name = EXCLUDED.full_name,
    email = EXCLUDED.email,
    username = COALESCE(public.profiles.username, EXCLUDED.username);

  RETURN NEW;
END;
$$;

-- 5. Helper function to resolve email by username or email identifier (accessible by anon & authenticated)
CREATE OR REPLACE FUNCTION public.get_email_by_identifier(_identifier text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_clean text;
  v_email text;
BEGIN
  IF _identifier IS NULL THEN
    RETURN NULL;
  END IF;
  
  v_clean := lower(trim(_identifier));
  
  IF v_clean = '' THEN
    RETURN NULL;
  END IF;

  -- 1. Check exact email in profiles
  SELECT p.email INTO v_email
  FROM public.profiles p
  WHERE lower(p.email) = v_clean
    AND p.email IS NOT NULL
  LIMIT 1;

  IF v_email IS NOT NULL THEN
    RETURN v_email;
  END IF;

  -- 2. Check username in profiles (case-insensitive)
  SELECT p.email INTO v_email
  FROM public.profiles p
  WHERE lower(p.username) = v_clean
    AND p.email IS NOT NULL
  LIMIT 1;

  IF v_email IS NOT NULL THEN
    RETURN v_email;
  END IF;

  -- 3. If identifier has no '@', match against the prefix of email
  IF position('@' in v_clean) = 0 THEN
    SELECT p.email INTO v_email
    FROM public.profiles p
    WHERE lower(split_part(p.email, '@', 1)) = v_clean
      AND p.email IS NOT NULL
    LIMIT 1;

    IF v_email IS NOT NULL THEN
      RETURN v_email;
    END IF;
  END IF;

  -- 4. Fallback search directly in auth.users
  SELECT u.email INTO v_email
  FROM auth.users u
  WHERE lower(u.email) = v_clean
     OR (position('@' in v_clean) = 0 AND lower(split_part(u.email, '@', 1)) = v_clean)
     OR lower(u.raw_user_meta_data->>'username') = v_clean
  LIMIT 1;

  RETURN v_email;
END;
$$;

-- Allow unauthenticated callers (login screen) and authenticated callers to execute the function
GRANT EXECUTE ON FUNCTION public.get_email_by_identifier(text) TO anon, authenticated, service_role;
