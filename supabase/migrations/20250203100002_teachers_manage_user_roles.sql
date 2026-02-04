-- Allow teachers to update/delete non-admin roles in their tenant.
-- This is required for Admin > Usuarios: Edit/Delete actions when logged in as teacher.

-- UPDATE policy (teachers: cannot modify admin rows or set role to admin)
DROP POLICY IF EXISTS "Tenant admins can update roles in their tenant" ON public.user_roles;
DROP POLICY IF EXISTS "Tenant admins and teachers can update roles in their tenant" ON public.user_roles;

CREATE POLICY "Tenant admins and teachers can update roles in their tenant"
  ON public.user_roles
  FOR UPDATE
  USING (
    public.has_role_in_tenant(auth.uid(), tenant_id, 'admin')
    OR (
      public.has_role_in_tenant(auth.uid(), tenant_id, 'teacher')
      AND role <> 'admin'
    )
  )
  WITH CHECK (
    public.has_role_in_tenant(auth.uid(), tenant_id, 'admin')
    OR (
      public.has_role_in_tenant(auth.uid(), tenant_id, 'teacher')
      AND role <> 'admin'
    )
  );

-- DELETE policy (teachers: cannot delete admin rows)
DROP POLICY IF EXISTS "Tenant admins can delete roles in their tenant" ON public.user_roles;
DROP POLICY IF EXISTS "Tenant admins and teachers can delete roles in their tenant" ON public.user_roles;

CREATE POLICY "Tenant admins and teachers can delete roles in their tenant"
  ON public.user_roles
  FOR DELETE
  USING (
    public.has_role_in_tenant(auth.uid(), tenant_id, 'admin')
    OR (
      public.has_role_in_tenant(auth.uid(), tenant_id, 'teacher')
      AND role <> 'admin'
    )
  );

