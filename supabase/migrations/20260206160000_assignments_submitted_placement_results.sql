-- submitted_at: when time ran out or assignment was "submitted"; student cannot retake until teacher clears (allow retake)
ALTER TABLE public.user_lesson_assignments
  ADD COLUMN IF NOT EXISTS submitted_at TIMESTAMP WITH TIME ZONE NULL;

COMMENT ON COLUMN public.user_lesson_assignments.submitted_at IS 'Set when time ran out or student submitted; student cannot retake until teacher clears this to allow retake';

-- Placement test results: store outcome so teachers can track Test de Nivelación
CREATE TABLE IF NOT EXISTS public.placement_test_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
  recommended_level TEXT NOT NULL,
  correct_count INT NOT NULL,
  total_questions INT NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, tenant_id)
);

CREATE INDEX IF NOT EXISTS idx_placement_test_results_user ON public.placement_test_results(user_id);
CREATE INDEX IF NOT EXISTS idx_placement_test_results_tenant ON public.placement_test_results(tenant_id);

ALTER TABLE public.placement_test_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own placement test result"
  ON public.placement_test_results FOR SELECT
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
        AND user_roles.tenant_id = placement_test_results.tenant_id
        AND user_roles.role IN ('admin', 'teacher')
    )
  );

CREATE POLICY "Users can insert own placement test result"
  ON public.placement_test_results FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins and teachers can delete placement test result"
  ON public.placement_test_results FOR DELETE
  USING (
    public.has_role_in_tenant(auth.uid(), tenant_id, 'admin')
    OR public.has_role_in_tenant(auth.uid(), tenant_id, 'teacher')
  );
