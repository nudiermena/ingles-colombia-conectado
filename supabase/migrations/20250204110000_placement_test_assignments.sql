-- Placement test assignments: teachers/admins assign the placement test to students
-- so students can take it before being assigned lessons (check how they performed).
CREATE TABLE IF NOT EXISTS public.placement_test_assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
  assigned_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, tenant_id)
);

CREATE INDEX IF NOT EXISTS idx_placement_test_assignments_user ON public.placement_test_assignments(user_id);
CREATE INDEX IF NOT EXISTS idx_placement_test_assignments_tenant ON public.placement_test_assignments(tenant_id);

ALTER TABLE public.placement_test_assignments ENABLE ROW LEVEL SECURITY;

-- Users can view their own assignment
CREATE POLICY "Users can view own placement test assignment"
  ON public.placement_test_assignments FOR SELECT
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
        AND user_roles.tenant_id = placement_test_assignments.tenant_id
        AND user_roles.role IN ('admin', 'teacher')
    )
  );

-- Admins and teachers can create/delete
CREATE POLICY "Admins and teachers can create placement test assignment"
  ON public.placement_test_assignments FOR INSERT
  WITH CHECK (
    public.has_role_in_tenant(auth.uid(), tenant_id, 'admin')
    OR public.has_role_in_tenant(auth.uid(), tenant_id, 'teacher')
  );

CREATE POLICY "Admins and teachers can delete placement test assignment"
  ON public.placement_test_assignments FOR DELETE
  USING (
    public.has_role_in_tenant(auth.uid(), tenant_id, 'admin')
    OR public.has_role_in_tenant(auth.uid(), tenant_id, 'teacher')
  );
