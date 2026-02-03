-- Function to seed lessons for a tenant
-- This function allows admins to import lessons from a predefined set
CREATE OR REPLACE FUNCTION public.seed_lessons_for_tenant(
  _tenant_id UUID,
  _levels TEXT[] DEFAULT ARRAY['A1', 'A2', 'B1', 'B2']::TEXT[]
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _lesson_count INTEGER := 0;
  _lesson_data JSONB;
BEGIN
  -- Check if user has admin role in tenant
  IF NOT public.has_role_in_tenant(auth.uid(), _tenant_id, 'admin') THEN
    RAISE EXCEPTION 'Only admins can seed lessons for a tenant';
  END IF;

  -- Note: This function expects lesson data to be passed or inserted manually
  -- For bulk insertion, use the TypeScript utility script instead
  -- This function is a placeholder for future server-side seeding

  RETURN _lesson_count;
END;
$$;

-- Function to get lesson statistics by level for a tenant
CREATE OR REPLACE FUNCTION public.get_lesson_stats_by_level(
  _tenant_id UUID
)
RETURNS TABLE (
  level TEXT,
  lesson_count BIGINT,
  total_duration_minutes INTEGER
)
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    l.level,
    COUNT(*)::BIGINT as lesson_count,
    SUM(
      CASE 
        WHEN l.duration ~ '(\d+) min' THEN 
          (regexp_match(l.duration, '(\d+) min'))[1]::INTEGER
        ELSE 0
      END
    )::INTEGER as total_duration_minutes
  FROM public.lessons l
  WHERE l.tenant_id = _tenant_id
    AND l.is_active = true
  GROUP BY l.level
  ORDER BY 
    CASE l.level
      WHEN 'A1' THEN 1
      WHEN 'A2' THEN 2
      WHEN 'B1' THEN 3
      WHEN 'B2' THEN 4
      WHEN 'C1' THEN 5
      WHEN 'C2' THEN 6
      ELSE 7
    END;
$$;

