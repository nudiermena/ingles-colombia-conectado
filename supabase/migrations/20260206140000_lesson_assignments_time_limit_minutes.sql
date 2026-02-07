-- Add optional time limit in minutes for assignments (teacher sets e.g. "complete within 30 minutes from assignment")
ALTER TABLE public.user_lesson_assignments
  ADD COLUMN IF NOT EXISTS time_limit_minutes INTEGER CHECK (time_limit_minutes IS NULL OR time_limit_minutes > 0);
