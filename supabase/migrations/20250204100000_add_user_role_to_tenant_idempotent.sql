-- Make add_user_role_to_tenant idempotent: handle unique_violation (row created
-- between SELECT and INSERT, e.g. by trigger or race) and FK violation timing.

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
  -- Caller must be: (1) platform admin, OR (2) teacher in this tenant
  IF NOT (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
    OR
    public.has_role_in_tenant(auth.uid(), _tenant_id, 'teacher')
  ) THEN
    RAISE EXCEPTION 'No tienes permiso para agregar usuarios a esta organización';
  END IF;

  -- If user already has a role in this tenant, update it and return
  SELECT id INTO _role_id
  FROM public.user_roles
  WHERE user_id = _user_id AND tenant_id = _tenant_id;

  IF _role_id IS NOT NULL THEN
    UPDATE public.user_roles SET role = _role WHERE id = _role_id;
    RETURN _role_id;
  END IF;

  -- Insert new role; if unique_violation (race/trigger), do update instead
  BEGIN
    INSERT INTO public.user_roles (user_id, tenant_id, role)
    VALUES (_user_id, _tenant_id, _role)
    RETURNING id INTO _role_id;
    RETURN _role_id;
  EXCEPTION
    WHEN unique_violation THEN
      SELECT id INTO _role_id
      FROM public.user_roles
      WHERE user_id = _user_id AND tenant_id = _tenant_id;
      IF _role_id IS NOT NULL THEN
        UPDATE public.user_roles SET role = _role WHERE id = _role_id;
        RETURN _role_id;
      END IF;
      RAISE;
  END;
END;
$$;
