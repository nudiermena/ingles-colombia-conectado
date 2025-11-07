# Invitation System Setup

To enable the invitation functionality, you need to manually run the following SQL in your database:

## Step 1: Create the invitations table

```sql
-- Create invitations table
CREATE TABLE IF NOT EXISTS public.invitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  email text NOT NULL,
  role app_role NOT NULL,
  invited_by uuid NOT NULL,
  token uuid NOT NULL DEFAULT gen_random_uuid(),
  expires_at timestamp with time zone NOT NULL DEFAULT (now() + interval '7 days'),
  accepted_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(tenant_id, email)
);

-- Enable RLS
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;

-- Admins can view all invitations for their tenant
CREATE POLICY "Admins can view invitations in their tenant"
ON public.invitations
FOR SELECT
USING (has_role_in_tenant(auth.uid(), tenant_id, 'admin'::app_role));

-- Admins can create invitations for their tenant
CREATE POLICY "Admins can create invitations in their tenant"
ON public.invitations
FOR INSERT
WITH CHECK (
  has_role_in_tenant(auth.uid(), tenant_id, 'admin'::app_role)
  AND invited_by = auth.uid()
);

-- Admins can delete invitations in their tenant
CREATE POLICY "Admins can delete invitations in their tenant"
ON public.invitations
FOR DELETE
USING (has_role_in_tenant(auth.uid(), tenant_id, 'admin'::app_role));

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_invitations_token ON public.invitations(token);
CREATE INDEX IF NOT EXISTS idx_invitations_tenant_email ON public.invitations(tenant_id, email);
```

## Step 2: Create the accept_invitation function

```sql
CREATE OR REPLACE FUNCTION public.accept_invitation(invitation_token uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_invitation record;
  v_user_email text;
BEGIN
  -- Get current user email
  SELECT email INTO v_user_email FROM auth.users WHERE id = auth.uid();
  
  -- Get invitation
  SELECT * INTO v_invitation
  FROM public.invitations
  WHERE token = invitation_token
    AND email = v_user_email
    AND accepted_at IS NULL
    AND expires_at > now();
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Invalid or expired invitation'
    );
  END IF;
  
  -- Create user role
  INSERT INTO public.user_roles (user_id, tenant_id, role)
  VALUES (auth.uid(), v_invitation.tenant_id, v_invitation.role)
  ON CONFLICT (user_id, tenant_id) DO NOTHING;
  
  -- Mark invitation as accepted
  UPDATE public.invitations
  SET accepted_at = now()
  WHERE token = invitation_token;
  
  RETURN jsonb_build_object(
    'success', true,
    'tenant_id', v_invitation.tenant_id,
    'role', v_invitation.role
  );
END;
$$;
```

## Step 3: Set up email sending (Resend)

1. Go to https://resend.com and create an account
2. Verify your domain at https://resend.com/domains
3. Create an API key at https://resend.com/api-keys
4. Add the `RESEND_API_KEY` secret to your project

## Step 4: Test the system

1. Navigate to `/invite` as an admin
2. Enter an email and select a role
3. The system will send an invitation email
4. The recipient can accept via the link in the email or by visiting `/accept-invitation?token=<token>`
