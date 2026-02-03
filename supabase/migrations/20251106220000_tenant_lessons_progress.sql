-- Create lessons table (tenant-specific)
CREATE TABLE IF NOT EXISTS public.lessons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  level TEXT NOT NULL CHECK (level IN ('A1', 'A2', 'B1', 'B2', 'C1', 'C2')),
  duration TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('Básico', 'Intermedio', 'Avanzado')),
  rating NUMERIC(3, 1) DEFAULT 0,
  type TEXT NOT NULL CHECK (type IN ('Vocabulario', 'Gramática', 'Conversación', 'Pronunciación', 'Evaluación', 'Cultural')),
  objectives TEXT[] DEFAULT ARRAY[]::TEXT[],
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(tenant_id, title)
);

-- Create lesson_progress table (tracks user progress per lesson per tenant)
CREATE TABLE IF NOT EXISTS public.lesson_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE NOT NULL,
  progress_percentage INTEGER NOT NULL DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  completed BOOLEAN DEFAULT false,
  time_spent_minutes INTEGER DEFAULT 0,
  last_accessed_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  exercise_results JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, tenant_id, lesson_id)
);

-- Create user_achievements table (tenant-specific achievements)
CREATE TABLE IF NOT EXISTS public.user_achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
  achievement_type TEXT NOT NULL,
  achievement_data JSONB DEFAULT '{}'::jsonb,
  unlocked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, tenant_id, achievement_type)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_lessons_tenant_id ON public.lessons(tenant_id);
CREATE INDEX IF NOT EXISTS idx_lessons_level ON public.lessons(level);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_user_tenant ON public.lesson_progress(user_id, tenant_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_lesson ON public.lesson_progress(lesson_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_tenant ON public.user_achievements(user_id, tenant_id);

-- Enable RLS on all tables
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

-- RLS Policies for lessons
-- Members can view lessons in their tenant
CREATE POLICY "Tenant members can view lessons"
  ON public.lessons
  FOR SELECT
  USING (public.is_tenant_member(auth.uid(), tenant_id));

-- Admins and teachers can insert lessons
CREATE POLICY "Admins and teachers can create lessons"
  ON public.lessons
  FOR INSERT
  WITH CHECK (
    public.has_role_in_tenant(auth.uid(), tenant_id, 'admin') OR
    public.has_role_in_tenant(auth.uid(), tenant_id, 'teacher')
  );

-- Admins and teachers can update lessons
CREATE POLICY "Admins and teachers can update lessons"
  ON public.lessons
  FOR UPDATE
  USING (
    public.has_role_in_tenant(auth.uid(), tenant_id, 'admin') OR
    public.has_role_in_tenant(auth.uid(), tenant_id, 'teacher')
  );

-- Admins can delete lessons
CREATE POLICY "Admins can delete lessons"
  ON public.lessons
  FOR DELETE
  USING (public.has_role_in_tenant(auth.uid(), tenant_id, 'admin'));

-- RLS Policies for lesson_progress
-- Users can view their own progress
CREATE POLICY "Users can view their own progress"
  ON public.lesson_progress
  FOR SELECT
  USING (user_id = auth.uid());

-- Teachers and admins can view all progress in their tenant
CREATE POLICY "Teachers and admins can view tenant progress"
  ON public.lesson_progress
  FOR SELECT
  USING (
    public.has_role_in_tenant(auth.uid(), tenant_id, 'admin') OR
    public.has_role_in_tenant(auth.uid(), tenant_id, 'teacher')
  );

-- Users can insert/update their own progress
CREATE POLICY "Users can manage their own progress"
  ON public.lesson_progress
  FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- RLS Policies for user_achievements
-- Users can view their own achievements
CREATE POLICY "Users can view their own achievements"
  ON public.user_achievements
  FOR SELECT
  USING (user_id = auth.uid());

-- Teachers and admins can view all achievements in their tenant
CREATE POLICY "Teachers and admins can view tenant achievements"
  ON public.user_achievements
  FOR SELECT
  USING (
    public.has_role_in_tenant(auth.uid(), tenant_id, 'admin') OR
    public.has_role_in_tenant(auth.uid(), tenant_id, 'teacher')
  );

-- Users can insert their own achievements
CREATE POLICY "Users can create their own achievements"
  ON public.user_achievements
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Add update triggers
CREATE TRIGGER update_lessons_updated_at
  BEFORE UPDATE ON public.lessons
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_lesson_progress_updated_at
  BEFORE UPDATE ON public.lesson_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

