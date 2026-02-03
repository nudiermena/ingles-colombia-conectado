-- Add INSERT policy for tenants - authenticated users can create tenants
DROP POLICY IF EXISTS "Users can create tenants" ON public.tenants;
CREATE POLICY "Users can create tenants"
  ON public.tenants
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Allow users to insert their own role
-- This allows users to assign themselves a role when creating a tenant
DROP POLICY IF EXISTS "Users can insert their own role" ON public.user_roles;
CREATE POLICY "Users can insert their own role"
  ON public.user_roles
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Create a function to safely create a tenant with admin role for the creator
CREATE OR REPLACE FUNCTION public.create_tenant_with_admin(
  _name TEXT,
  _slug TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _tenant_id UUID;
  _user_id UUID;
BEGIN
  _user_id := auth.uid();
  
  IF _user_id IS NULL THEN
    RAISE EXCEPTION 'User must be authenticated';
  END IF;

  -- Insert tenant
  INSERT INTO public.tenants (name, slug)
  VALUES (_name, _slug)
  RETURNING id INTO _tenant_id;

  -- Insert admin role for creator
  INSERT INTO public.user_roles (user_id, tenant_id, role)
  VALUES (_user_id, _tenant_id, 'admin');

  RETURN _tenant_id;
END;
$$;

