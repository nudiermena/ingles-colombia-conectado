-- =====================================================
-- QUICK FIX: Run this SQL in your Supabase SQL Editor
-- =====================================================
-- This will fix the 403/404 errors when creating tenants

-- Step 1: Add INSERT policy for tenants
DROP POLICY IF EXISTS "Users can create tenants" ON public.tenants;
CREATE POLICY "Users can create tenants"
  ON public.tenants
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Step 2: Allow users to insert their own role
DROP POLICY IF EXISTS "Users can insert their own role" ON public.user_roles;
CREATE POLICY "Users can insert their own role"
  ON public.user_roles
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Step 3: Create function to safely create tenant with admin role
CREATE OR REPLACE FUNCTION public.create_tenant_with_admin(
  _name TEXT,
  _slug TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _tenant_id UUID;
  _user_id UUID;
BEGIN
  _user_id := auth.uid();
  
  IF _user_id IS NULL THEN
    RAISE EXCEPTION 'User must be authenticated';
  END IF;

  -- Insert tenant
  INSERT INTO public.tenants (name, slug)
  VALUES (_name, _slug)
  RETURNING id INTO _tenant_id;

  -- Insert admin role for creator
  INSERT INTO public.user_roles (user_id, tenant_id, role)
  VALUES (_user_id, _tenant_id, 'admin');

  RETURN _tenant_id;
END;
$$;

-- =====================================================
-- Instructions:
-- 1. Go to your Supabase Dashboard
-- 2. Click on "SQL Editor" in the left sidebar
-- 3. Click "New Query"
-- 4. Copy and paste ALL of the SQL above
-- 5. Click "Run" (or press Ctrl+Enter)
-- 6. You should see "Success. No rows returned"
-- =====================================================

