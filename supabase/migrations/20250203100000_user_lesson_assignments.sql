-- User Lesson Assignments: teachers/admins can assign lessons to students
CREATE TABLE IF NOT EXISTS public.user_lesson_assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE NOT NULL,
  assigned_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, tenant_id, lesson_id)
);

CREATE INDEX IF NOT EXISTS idx_user_lesson_assignments_user ON public.user_lesson_assignments(user_id);
CREATE INDEX IF NOT EXISTS idx_user_lesson_assignments_tenant ON public.user_lesson_assignments(tenant_id);
CREATE INDEX IF NOT EXISTS idx_user_lesson_assignments_lesson ON public.user_lesson_assignments(lesson_id);

ALTER TABLE public.user_lesson_assignments ENABLE ROW LEVEL SECURITY;

-- Users can view their own assignments
CREATE POLICY "Users can view their own assignments"
  ON public.user_lesson_assignments FOR SELECT
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
        AND user_roles.tenant_id = user_lesson_assignments.tenant_id
        AND user_roles.role IN ('admin', 'teacher')
    )
  );

-- Admins and teachers can create assignments
CREATE POLICY "Admins and teachers can create assignments"
  ON public.user_lesson_assignments FOR INSERT
  WITH CHECK (
    public.has_role_in_tenant(auth.uid(), tenant_id, 'admin')
    OR public.has_role_in_tenant(auth.uid(), tenant_id, 'teacher')
  );

-- Admins and teachers can delete assignments
CREATE POLICY "Admins and teachers can delete assignments"
  ON public.user_lesson_assignments FOR DELETE
  USING (
    public.has_role_in_tenant(auth.uid(), tenant_id, 'admin')
    OR public.has_role_in_tenant(auth.uid(), tenant_id, 'teacher')
  );
