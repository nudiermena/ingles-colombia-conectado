# Database Migration Instructions

## Fix Tenant Permissions (403 Error)

You need to run the migration file to fix the 403 error when creating tenants.

### Option 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy and paste the contents of `supabase/migrations/20251106222000_fix_tenant_policies.sql`
5. Click **Run** to execute the migration

### Option 2: Using Supabase CLI

If you have Supabase CLI installed:

```bash
# Make sure you're in the project root
cd ingles-colombia-conectado

# Link to your Supabase project (if not already linked)
supabase link --project-ref igdokomdqplamqwbuzat

# Push the migration
supabase db push
```

### What the Migration Does

1. **Adds INSERT policy for tenants**: Allows authenticated users to create new tenants
2. **Adds INSERT policy for user_roles**: Allows users to assign themselves roles when creating tenants
3. **Creates `create_tenant_with_admin` function**: A secure function that creates a tenant and automatically assigns the creator as admin (atomic operation)

### Verification

After running the migration, you should be able to:
- Create new tenants/organizations
- Automatically become admin of the tenant you create
- No more 403 errors when accessing the tenant-select page

### Troubleshooting

If you still get errors after running the migration:
1. Check that you're logged in as an authenticated user
2. Verify the migration ran successfully in the Supabase dashboard
3. Check the RLS policies in the Supabase dashboard under **Authentication > Policies**
4. Make sure the `create_tenant_with_admin` function exists in **Database > Functions**

