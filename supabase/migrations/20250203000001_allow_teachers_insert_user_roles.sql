-- Allow both tenant admins AND teachers to insert user_roles in their tenant.
-- This fixes "new row violates row-level security policy for table user_roles"
-- when a teacher (or admin) creates a new user from the Admin > Usuarios tab.

DROP POLICY IF EXISTS "Tenant admins can insert roles in their tenant" ON public.user_roles;

CREATE POLICY "Tenant admins and teachers can insert roles in their tenant"
  ON public.user_roles
  FOR INSERT
  WITH CHECK (
    public.has_role_in_tenant(auth.uid(), tenant_id, 'admin')
    OR public.has_role_in_tenant(auth.uid(), tenant_id, 'teacher')
  );
