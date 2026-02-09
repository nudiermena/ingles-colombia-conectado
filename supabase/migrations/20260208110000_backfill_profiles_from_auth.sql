-- Backfill profiles so every user in user_roles has name and email in Admin > Usuarios.
-- 1) Create missing profile rows for auth.users that have user_roles but no profile.
-- 2) Update existing profiles that have null/empty email or full_name from auth.users.

-- Ensure email column exists (idempotent)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email text;

-- Insert missing profiles (user has user_roles but no profile)
INSERT INTO public.profiles (user_id, full_name, email)
SELECT
  u.id,
  COALESCE(NULLIF(TRIM(u.raw_user_meta_data->>'full_name'), ''), u.email, 'Usuario'),
  u.email
FROM auth.users u
WHERE EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = u.id)
  AND NOT EXISTS (SELECT 1 FROM public.profiles p WHERE p.user_id = u.id)
ON CONFLICT (user_id) DO NOTHING;

-- Update existing profiles where email or full_name is null/empty (from auth.users)
UPDATE public.profiles p
SET
  full_name = COALESCE(NULLIF(TRIM(p.full_name), ''), NULLIF(TRIM(u.raw_user_meta_data->>'full_name'), ''), u.email, 'Usuario'),
  email = COALESCE(NULLIF(TRIM(p.email), ''), u.email)
FROM auth.users u
WHERE u.id = p.user_id
  AND EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = p.user_id)
  AND (p.email IS NULL OR TRIM(p.email) = '' OR p.full_name IS NULL OR TRIM(p.full_name) = '');
