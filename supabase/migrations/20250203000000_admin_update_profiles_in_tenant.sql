-- Allow tenant admins and teachers to update profiles of users in their tenant
-- (so the Admin "Usuarios" edit form can change full_name)

CREATE POLICY "Tenant admins and teachers can update member profiles"
  ON public.profiles
  FOR UPDATE
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = profiles.user_id
        AND (
          public.has_role_in_tenant(auth.uid(), ur.tenant_id, 'admin')
          OR public.has_role_in_tenant(auth.uid(), ur.tenant_id, 'teacher')
        )
    )
  );
