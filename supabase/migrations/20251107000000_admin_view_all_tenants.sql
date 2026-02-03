-- Allow admins to view ALL tenants (not just ones they belong to)
-- This enables admins to see all organizations for lesson assignment

-- Add policy for admins to view all tenants
-- An admin is defined as someone who has 'admin' role in at least one tenant
DROP POLICY IF EXISTS "Admins can view all tenants" ON public.tenants;
CREATE POLICY "Admins can view all tenants"
  ON public.tenants
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM public.user_roles
      WHERE user_id = auth.uid()
        AND role = 'admin'
    )
  );

-- Also allow admins to view all lessons for assignment purposes
DROP POLICY IF EXISTS "Admins can view all lessons" ON public.lessons;
CREATE POLICY "Admins can view all lessons"
  ON public.lessons
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM public.user_roles
      WHERE user_id = auth.uid()
        AND role = 'admin'
    )
  );

-- Allow admins to insert lessons into any tenant
DROP POLICY IF EXISTS "Admins can insert lessons into any tenant" ON public.lessons;
CREATE POLICY "Admins can insert lessons into any tenant"
  ON public.lessons
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.user_roles
      WHERE user_id = auth.uid()
        AND role = 'admin'
    )
  );

