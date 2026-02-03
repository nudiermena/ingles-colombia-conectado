-- Create invitations table
CREATE TABLE IF NOT EXISTS public.invitations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
  email TEXT NOT NULL,
  role public.app_role NOT NULL,
  invited_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  token TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired', 'cancelled')),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + INTERVAL '7 days'),
  accepted_at TIMESTAMP WITH TIME ZONE,
  accepted_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(tenant_id, email, status) WHERE status = 'pending'
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_invitations_token ON public.invitations(token);
CREATE INDEX IF NOT EXISTS idx_invitations_tenant_email ON public.invitations(tenant_id, email);
CREATE INDEX IF NOT EXISTS idx_invitations_status ON public.invitations(status);

-- Enable RLS on invitations
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for invitations
-- Admins and teachers can view invitations in their tenant
CREATE POLICY "Tenant admins and teachers can view invitations"
  ON public.invitations
  FOR SELECT
  USING (
    public.has_role_in_tenant(auth.uid(), tenant_id, 'admin') OR
    public.has_role_in_tenant(auth.uid(), tenant_id, 'teacher')
  );

-- Admins can create invitations
CREATE POLICY "Tenant admins can create invitations"
  ON public.invitations
  FOR INSERT
  WITH CHECK (
    public.has_role_in_tenant(auth.uid(), tenant_id, 'admin')
  );

-- Admins can update invitations (cancel, etc.)
CREATE POLICY "Tenant admins can update invitations"
  ON public.invitations
  FOR UPDATE
  USING (
    public.has_role_in_tenant(auth.uid(), tenant_id, 'admin')
  );

-- Admins can delete invitations
CREATE POLICY "Tenant admins can delete invitations"
  ON public.invitations
  FOR DELETE
  USING (
    public.has_role_in_tenant(auth.uid(), tenant_id, 'admin')
  );

-- Anyone with a valid token can view their invitation
CREATE POLICY "Users can view their own invitation by token"
  ON public.invitations
  FOR SELECT
  USING (true); -- Token will be validated in application logic

-- Function to generate invitation token
CREATE OR REPLACE FUNCTION public.generate_invitation_token()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  token TEXT;
BEGIN
  -- Generate a secure random token
  token := encode(gen_random_bytes(32), 'base64');
  -- Remove any characters that might cause issues in URLs
  token := replace(replace(token, '/', '_'), '+', '-');
  token := replace(token, '=', '');
  RETURN token;
END;
$$;

-- Function to accept invitation
CREATE OR REPLACE FUNCTION public.accept_invitation(
  _token TEXT,
  _user_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _invitation RECORD;
BEGIN
  -- Find the invitation
  SELECT * INTO _invitation
  FROM public.invitations
  WHERE token = _token
    AND status = 'pending'
    AND expires_at > now();

  IF NOT FOUND THEN
    RETURN false;
  END IF;

  -- Check if user already has a role in this tenant
  IF EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND tenant_id = _invitation.tenant_id
  ) THEN
    -- User already has a role, update it instead
    UPDATE public.user_roles
    SET role = _invitation.role
    WHERE user_id = _user_id AND tenant_id = _invitation.tenant_id;
  ELSE
    -- Create new role
    INSERT INTO public.user_roles (user_id, tenant_id, role)
    VALUES (_user_id, _invitation.tenant_id, _invitation.role);
  END IF;

  -- Mark invitation as accepted
  UPDATE public.invitations
  SET 
    status = 'accepted',
    accepted_at = now(),
    accepted_by = _user_id
  WHERE id = _invitation.id;

  RETURN true;
END;
$$;

-- Add update trigger
CREATE TRIGGER update_invitations_updated_at
  BEFORE UPDATE ON public.invitations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

