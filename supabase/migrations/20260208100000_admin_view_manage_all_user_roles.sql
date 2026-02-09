-- Allow admins (users with 'admin' role in at least one tenant) to:
-- 1. View ALL user_roles (so they can see all users in the system and their organizations)
-- 2. Insert/Update/Delete user_roles for ANY tenant (add/remove/edit users to/from organizations)

-- Helper: user is platform admin (has admin role in any tenant)
CREATE OR REPLACE FUNCTION public.is_platform_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  );
$$;

-- Admins can view all user_roles (any tenant)
CREATE POLICY "Admins can view all user_roles"
  ON public.user_roles
  FOR SELECT
  USING (public.is_platform_admin());

-- Admins can insert user_roles for any tenant (add user to any organization)
CREATE POLICY "Admins can insert user_roles for any tenant"
  ON public.user_roles
  FOR INSERT
  WITH CHECK (public.is_platform_admin());

-- Admins can update user_roles for any tenant (change role in organization)
CREATE POLICY "Admins can update user_roles for any tenant"
  ON public.user_roles
  FOR UPDATE
  USING (public.is_platform_admin())
  WITH CHECK (public.is_platform_admin());

-- Admins can delete user_roles for any tenant (remove user from organization)
CREATE POLICY "Admins can delete user_roles for any tenant"
  ON public.user_roles
  FOR DELETE
  USING (public.is_platform_admin());
