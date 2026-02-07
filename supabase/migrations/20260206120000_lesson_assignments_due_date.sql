-- Add optional due date to lesson assignments (for teachers to set deadlines)
ALTER TABLE public.user_lesson_assignments
  ADD COLUMN IF NOT EXISTS due_date TIMESTAMP WITH TIME ZONE;

CREATE INDEX IF NOT EXISTS idx_user_lesson_assignments_due_date
  ON public.user_lesson_assignments(due_date)
  WHERE due_date IS NOT NULL;

-- Teachers/admins can update assignments (e.g. set due_date)
DROP POLICY IF EXISTS "Admins and teachers can update assignments" ON public.user_lesson_assignments;
CREATE POLICY "Admins and teachers can update assignments"
  ON public.user_lesson_assignments
  FOR UPDATE
  USING (
    public.has_role_in_tenant(auth.uid(), tenant_id, 'admin')
    OR public.has_role_in_tenant(auth.uid(), tenant_id, 'teacher')
  )
  WITH CHECK (
    public.has_role_in_tenant(auth.uid(), tenant_id, 'admin')
    OR public.has_role_in_tenant(auth.uid(), tenant_id, 'teacher')
  );
