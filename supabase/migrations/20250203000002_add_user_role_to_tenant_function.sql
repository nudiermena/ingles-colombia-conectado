-- Add a user to a tenant with a role.
-- - Admins (admin in any tenant) can add users to ANY tenant.
-- - Teachers can add users only to the tenant they belong to.
-- Uses SECURITY DEFINER so the insert bypasses RLS (avoids 403 on user_roles INSERT).

CREATE OR REPLACE FUNCTION public.add_user_role_to_tenant(
  _user_id UUID,
  _tenant_id UUID,
  _role public.app_role
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _role_id UUID;
BEGIN
  -- Caller must be: (1) platform admin (admin in any tenant), OR (2) teacher in this tenant
  IF NOT (
    -- Platform admin: has admin role in any tenant → can add to any tenant
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
    OR
    -- Teacher in this tenant → can add users only to this tenant
    public.has_role_in_tenant(auth.uid(), _tenant_id, 'teacher')
  ) THEN
    RAISE EXCEPTION 'No tienes permiso para agregar usuarios a esta organización';
  END IF;

  -- If user already has a role in this tenant, update it
  SELECT id INTO _role_id
  FROM public.user_roles
  WHERE user_id = _user_id AND tenant_id = _tenant_id;

  IF _role_id IS NOT NULL THEN
    UPDATE public.user_roles SET role = _role WHERE id = _role_id;
    RETURN _role_id;
  END IF;

  -- Otherwise insert new role
  INSERT INTO public.user_roles (user_id, tenant_id, role)
  VALUES (_user_id, _tenant_id, _role)
  RETURNING id INTO _role_id;

  RETURN _role_id;
END;
$$;

-- Expose the function to the API (anon/authenticated can call it; function checks auth inside)
GRANT EXECUTE ON FUNCTION public.add_user_role_to_tenant(UUID, UUID, public.app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.add_user_role_to_tenant(UUID, UUID, public.app_role) TO service_role;
