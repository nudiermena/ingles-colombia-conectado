-- Allow teachers and admins to delete lesson_progress in their tenant
-- (e.g. when unassigning a lesson so the student starts from scratch on re-assign)
DROP POLICY IF EXISTS "Teachers and admins can delete tenant lesson progress" ON public.lesson_progress;
CREATE POLICY "Teachers and admins can delete tenant lesson progress"
  ON public.lesson_progress
  FOR DELETE
  USING (
    public.has_role_in_tenant(auth.uid(), tenant_id, 'admin') OR
    public.has_role_in_tenant(auth.uid(), tenant_id, 'teacher')
  );
