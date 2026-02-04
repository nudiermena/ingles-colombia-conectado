-- Allow teachers to view all user_roles in their tenant (needed for Users tab in Admin)
DROP POLICY IF EXISTS "Tenant admins can view all roles in their tenant" ON public.user_roles;
CREATE POLICY "Tenant admins and teachers can view all roles in their tenant"
  ON public.user_roles
  FOR SELECT
  USING (
    public.has_role_in_tenant(auth.uid(), tenant_id, 'admin')
    OR public.has_role_in_tenant(auth.uid(), tenant_id, 'teacher')
  );
