-- Support Requests: allow users to contact support from the app

CREATE TABLE IF NOT EXISTS public.support_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE SET NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  full_name TEXT,
  subject TEXT NOT NULL DEFAULT 'Soporte',
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'closed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_support_requests_tenant_id ON public.support_requests(tenant_id);
CREATE INDEX IF NOT EXISTS idx_support_requests_user_id ON public.support_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_support_requests_created_at ON public.support_requests(created_at DESC);

ALTER TABLE public.support_requests ENABLE ROW LEVEL SECURITY;

-- Users can create support requests (must be authenticated)
DROP POLICY IF EXISTS "Authenticated users can create support requests" ON public.support_requests;
CREATE POLICY "Authenticated users can create support requests"
  ON public.support_requests
  FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL
    AND (user_id IS NULL OR user_id = auth.uid())
  );

-- Users can view their own requests
DROP POLICY IF EXISTS "Users can view their own support requests" ON public.support_requests;
CREATE POLICY "Users can view their own support requests"
  ON public.support_requests
  FOR SELECT
  USING (user_id = auth.uid());

-- Teachers/admins can view support requests for their tenant
DROP POLICY IF EXISTS "Teachers and admins can view tenant support requests" ON public.support_requests;
CREATE POLICY "Teachers and admins can view tenant support requests"
  ON public.support_requests
  FOR SELECT
  USING (
    tenant_id IS NOT NULL
    AND (
      public.has_role_in_tenant(auth.uid(), tenant_id, 'admin')
      OR public.has_role_in_tenant(auth.uid(), tenant_id, 'teacher')
    )
  );

