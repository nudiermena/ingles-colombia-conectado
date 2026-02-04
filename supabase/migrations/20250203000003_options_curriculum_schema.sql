-- Options Curriculum Schema
-- Creates the database structure for the Options course curriculum

-- 1. Courses Table (Options 1, 2, 3, 4)
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
  course_number INTEGER NOT NULL CHECK (course_number BETWEEN 1 AND 4),
  title TEXT NOT NULL DEFAULT 'Options',
  cefr_level TEXT NOT NULL CHECK (cefr_level IN ('A1+', 'A2', 'B1', 'B1+')),
  cambridge_exam TEXT,
  description TEXT,
  hours_per_week TEXT, -- e.g., "4-8/semana"
  is_active BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(tenant_id, course_number)
);

-- 2. Units Table (Welcome unit + Units 1-8 per course)
CREATE TABLE IF NOT EXISTS public.units (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  unit_number INTEGER, -- NULL for Welcome unit, 1-8 for regular units
  title TEXT NOT NULL,
  is_welcome_unit BOOLEAN DEFAULT false,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(course_id, unit_number, is_welcome_unit)
);

-- 3. Unit Content Table (flexible storage for all content types)
CREATE TABLE IF NOT EXISTS public.unit_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  unit_id UUID REFERENCES public.units(id) ON DELETE CASCADE NOT NULL,
  content_type TEXT NOT NULL CHECK (content_type IN (
    'vocabulary',
    'grammar',
    'listening',
    'reading',
    'speaking',
    'writing',
    'learning_for_life',
    'culture_clil'
  )),
  title TEXT,
  content JSONB NOT NULL DEFAULT '{}'::jsonb, -- Flexible JSON structure
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 4. Course Resources Table (videos, audio, PDFs, etc.)
CREATE TABLE IF NOT EXISTS public.course_resources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  unit_id UUID REFERENCES public.units(id) ON DELETE CASCADE,
  resource_type TEXT NOT NULL CHECK (resource_type IN (
    'video',
    'audio',
    'pdf',
    'ebook',
    'image',
    'interactive'
  )),
  title TEXT NOT NULL,
  description TEXT,
  url TEXT, -- URL to file in storage or external
  file_path TEXT, -- Path in Supabase Storage
  mime_type TEXT,
  file_size BIGINT,
  duration_seconds INTEGER, -- For video/audio
  is_teacher_only BOOLEAN DEFAULT false,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 5. Course Enrollments (students enrolled in courses)
CREATE TABLE IF NOT EXISTS public.course_enrollments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  enrolled_by UUID REFERENCES auth.users(id), -- Teacher/admin who enrolled
  enrolled_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  UNIQUE(user_id, tenant_id, course_id)
);

-- 6. Unit Progress (student progress per unit)
CREATE TABLE IF NOT EXISTS public.unit_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
  unit_id UUID REFERENCES public.units(id) ON DELETE CASCADE NOT NULL,
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  completed BOOLEAN DEFAULT false,
  time_spent_minutes INTEGER DEFAULT 0,
  last_accessed_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  content_progress JSONB DEFAULT '{}'::jsonb, -- Track progress per content type
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, tenant_id, unit_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_courses_tenant ON public.courses(tenant_id);
CREATE INDEX IF NOT EXISTS idx_units_course ON public.units(course_id);
CREATE INDEX IF NOT EXISTS idx_unit_content_unit ON public.unit_content(unit_id);
CREATE INDEX IF NOT EXISTS idx_course_resources_course ON public.course_resources(course_id);
CREATE INDEX IF NOT EXISTS idx_course_resources_unit ON public.course_resources(unit_id);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_user ON public.course_enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_tenant ON public.course_enrollments(tenant_id);
CREATE INDEX IF NOT EXISTS idx_unit_progress_user ON public.unit_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_unit_progress_tenant ON public.unit_progress(tenant_id);

-- Update triggers
CREATE TRIGGER update_courses_updated_at
  BEFORE UPDATE ON public.courses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_units_updated_at
  BEFORE UPDATE ON public.units
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_unit_content_updated_at
  BEFORE UPDATE ON public.unit_content
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_course_resources_updated_at
  BEFORE UPDATE ON public.course_resources
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_unit_progress_updated_at
  BEFORE UPDATE ON public.unit_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable RLS
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.unit_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.unit_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies for courses
CREATE POLICY "Users can view courses in their tenant"
  ON public.courses FOR SELECT
  USING (
    public.is_tenant_member(tenant_id, auth.uid())
  );

CREATE POLICY "Admins and teachers can create courses"
  ON public.courses FOR INSERT
  WITH CHECK (
    public.has_role_in_tenant(auth.uid(), tenant_id, 'admin')
    OR public.has_role_in_tenant(auth.uid(), tenant_id, 'teacher')
  );

CREATE POLICY "Admins and teachers can update courses"
  ON public.courses FOR UPDATE
  USING (
    public.has_role_in_tenant(auth.uid(), tenant_id, 'admin')
    OR public.has_role_in_tenant(auth.uid(), tenant_id, 'teacher')
  );

CREATE POLICY "Admins can delete courses"
  ON public.courses FOR DELETE
  USING (
    public.has_role_in_tenant(auth.uid(), tenant_id, 'admin')
  );

-- RLS Policies for units
CREATE POLICY "Users can view units in their tenant"
  ON public.units FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.courses
      WHERE courses.id = units.course_id
        AND public.is_tenant_member(courses.tenant_id, auth.uid())
    )
  );

CREATE POLICY "Admins and teachers can manage units"
  ON public.units FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.courses
      WHERE courses.id = units.course_id
        AND (
          public.has_role_in_tenant(auth.uid(), courses.tenant_id, 'admin')
          OR public.has_role_in_tenant(auth.uid(), courses.tenant_id, 'teacher')
        )
    )
  );

-- RLS Policies for unit_content
CREATE POLICY "Users can view unit content in their tenant"
  ON public.unit_content FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.units
      JOIN public.courses ON courses.id = units.course_id
      WHERE units.id = unit_content.unit_id
        AND public.is_tenant_member(courses.tenant_id, auth.uid())
    )
  );

CREATE POLICY "Admins and teachers can manage unit content"
  ON public.unit_content FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.units
      JOIN public.courses ON courses.id = units.course_id
      WHERE units.id = unit_content.unit_id
        AND (
          public.has_role_in_tenant(auth.uid(), courses.tenant_id, 'admin')
          OR public.has_role_in_tenant(auth.uid(), courses.tenant_id, 'teacher')
        )
    )
  );

-- RLS Policies for course_resources
CREATE POLICY "Users can view course resources in their tenant"
  ON public.course_resources FOR SELECT
  USING (
    (course_id IS NULL OR EXISTS (
      SELECT 1 FROM public.courses
      WHERE courses.id = course_resources.course_id
        AND public.is_tenant_member(courses.tenant_id, auth.uid())
    ))
    AND
    (unit_id IS NULL OR EXISTS (
      SELECT 1 FROM public.units
      JOIN public.courses ON courses.id = units.course_id
      WHERE units.id = course_resources.unit_id
        AND public.is_tenant_member(courses.tenant_id, auth.uid())
    ))
  );

CREATE POLICY "Admins and teachers can manage course resources"
  ON public.course_resources FOR ALL
  USING (
    (course_id IS NULL OR EXISTS (
      SELECT 1 FROM public.courses
      WHERE courses.id = course_resources.course_id
        AND (
          public.has_role_in_tenant(auth.uid(), courses.tenant_id, 'admin')
          OR public.has_role_in_tenant(auth.uid(), courses.tenant_id, 'teacher')
        )
    ))
    AND
    (unit_id IS NULL OR EXISTS (
      SELECT 1 FROM public.units
      JOIN public.courses ON courses.id = units.course_id
      WHERE units.id = course_resources.unit_id
        AND (
          public.has_role_in_tenant(auth.uid(), courses.tenant_id, 'admin')
          OR public.has_role_in_tenant(auth.uid(), courses.tenant_id, 'teacher')
        )
    ))
  );

-- RLS Policies for course_enrollments
CREATE POLICY "Users can view their own enrollments"
  ON public.course_enrollments FOR SELECT
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
        AND user_roles.tenant_id = course_enrollments.tenant_id
        AND user_roles.role IN ('admin', 'teacher')
    )
  );

CREATE POLICY "Admins and teachers can create enrollments"
  ON public.course_enrollments FOR INSERT
  WITH CHECK (
    public.has_role_in_tenant(auth.uid(), tenant_id, 'admin')
    OR public.has_role_in_tenant(auth.uid(), tenant_id, 'teacher')
  );

CREATE POLICY "Admins and teachers can update enrollments"
  ON public.course_enrollments FOR UPDATE
  USING (
    public.has_role_in_tenant(auth.uid(), tenant_id, 'admin')
    OR public.has_role_in_tenant(auth.uid(), tenant_id, 'teacher')
  );

-- RLS Policies for unit_progress
CREATE POLICY "Users can view their own progress"
  ON public.unit_progress FOR SELECT
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
        AND user_roles.tenant_id = unit_progress.tenant_id
        AND user_roles.role IN ('admin', 'teacher')
    )
  );

CREATE POLICY "Users can update their own progress"
  ON public.unit_progress FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own progress"
  ON public.unit_progress FOR INSERT
  WITH CHECK (user_id = auth.uid());
