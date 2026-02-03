import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  settings: any;
  created_at?: string;
  updated_at?: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  tenant_id: string;
  role: 'admin' | 'teacher' | 'student';
  created_at: string;
}

export const useTenant = (userId: string | undefined) => {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize currentTenant from localStorage immediately (before async fetch)
  useEffect(() => {
    if (userId) {
      const savedTenantId = localStorage.getItem('currentTenantId');
      if (savedTenantId && tenants.length > 0) {
        const savedTenant = tenants.find(t => t.id === savedTenantId);
        if (savedTenant && (!currentTenant || currentTenant.id !== savedTenant.id)) {
          setCurrentTenant(savedTenant);
        }
      }
    }
  }, [userId, tenants]);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      setCurrentTenant(null);
      return;
    }

    fetchUserTenants();
  }, [userId]);

  // Sync currentTenant with localStorage when tenants are loaded
  // This runs after fetchUserTenants completes
  useEffect(() => {
    if (!userId || tenants.length === 0) {
      // If we have a saved tenant ID but no tenants loaded yet, keep currentTenant
      // This prevents clearing the tenant during the initial load
      return;
    }

    const savedTenantId = localStorage.getItem('currentTenantId');
    
    if (savedTenantId) {
      const tenant = tenants.find(t => t.id === savedTenantId);
      if (tenant) {
        if (!currentTenant || currentTenant.id !== tenant.id) {
          setCurrentTenant(tenant);
        }
      } else {
        // Saved tenant ID doesn't exist in list, use first tenant
        setCurrentTenant(tenants[0]);
        localStorage.setItem('currentTenantId', tenants[0].id);
      }
    } else if (tenants.length > 0 && !currentTenant) {
      // No saved tenant, use first one
      setCurrentTenant(tenants[0]);
      localStorage.setItem('currentTenantId', tenants[0].id);
    }
  }, [userId, tenants]);

  const fetchUserTenants = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // Fetch user roles
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', userId);

      if (rolesError) {
        console.error('Error fetching user roles:', rolesError);
        setUserRoles([]);
        setTenants([]);
        setLoading(false);
        return;
      }

      setUserRoles(rolesData || []);

      // Fetch tenants only if user has roles
      const tenantIds = rolesData?.map(role => role.tenant_id).filter(Boolean) || [];
      
      if (tenantIds.length === 0) {
        setTenants([]);
        setCurrentTenant(null);
        setLoading(false);
        return;
      }

      const { data: tenantsData, error: tenantsError } = await supabase
        .from('tenants')
        .select('*')
        .in('id', tenantIds);

      if (tenantsError) {
        console.error('Error fetching tenants:', tenantsError);
        setTenants([]);
        setLoading(false);
        return;
      }

      setTenants(tenantsData || []);

      // Set current tenant based on saved preference or first tenant
      const savedTenantId = localStorage.getItem('currentTenantId');
      if (tenantsData && tenantsData.length > 0) {
        // Always respect the saved tenant ID if it exists in the tenant list
        if (savedTenantId) {
          const savedTenant = tenantsData.find(t => t.id === savedTenantId);
          if (savedTenant) {
            setCurrentTenant(savedTenant);
          } else {
            // Saved tenant ID doesn't exist in list, use first tenant
            setCurrentTenant(tenantsData[0]);
            localStorage.setItem('currentTenantId', tenantsData[0].id);
          }
        } else {
          // No saved tenant, use first tenant
          setCurrentTenant(tenantsData[0]);
          localStorage.setItem('currentTenantId', tenantsData[0].id);
        }
      } else {
        setCurrentTenant(null);
        localStorage.removeItem('currentTenantId');
      }
    } catch (error) {
      console.error('Error fetching tenants:', error);
      setTenants([]);
      setUserRoles([]);
    } finally {
      setLoading(false);
    }
  };

  const createTenant = async (name: string, slug: string) => {
    if (!userId) return { error: new Error('User not authenticated') };

    try {
      // Try using the database function first (if migration has been run)
      const { data: tenantId, error: functionError } = await supabase
        .rpc('create_tenant_with_admin', {
          _name: name,
          _slug: slug,
        });

      // If function exists and works, fetch the created tenant
      if (!functionError && tenantId) {
        const { data: tenantData, error: fetchError } = await supabase
          .from('tenants')
          .select('*')
          .eq('id', tenantId)
          .single();

        if (fetchError) return { error: fetchError };

        await fetchUserTenants();
        return { data: tenantData };
      }

      // Fallback: Manual creation (requires INSERT policies to be set)
      // Check if error is because function doesn't exist (404) or other reason
      if (functionError && functionError.code !== 'PGRST404' && functionError.code !== '42883') {
        // Function exists but there's another error - return it
        return { error: functionError };
      }

      // Function doesn't exist or not accessible - use manual creation
      const { data, error } = await supabase
        .from('tenants')
        .insert({ name, slug })
        .select()
        .single();

      if (error) {
        // If we get a 403, the INSERT policy hasn't been set up
        if (error.code === '42501' || error.message?.includes('permission denied')) {
          return { 
            error: new Error(
              'No tienes permisos para crear organizaciones. ' +
              'Por favor, contacta al administrador o ejecuta la migración de base de datos.'
            ) 
          };
        }
        return { error };
      }

      // Create admin role for creator
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: userId,
          tenant_id: data.id,
          role: 'admin'
        });

      if (roleError) {
        // If role creation fails, try to clean up the tenant
        await supabase.from('tenants').delete().eq('id', data.id);
        return { error: roleError };
      }

      await fetchUserTenants();
      return { data };
    } catch (error: any) {
      return { error: error instanceof Error ? error : new Error('Error desconocido al crear organización') };
    }
  };

  const getRoleInTenant = (tenantId: string): 'admin' | 'teacher' | 'student' | null => {
    const role = userRoles.find(r => r.tenant_id === tenantId);
    return role?.role || null;
  };

  const switchTenant = (tenant: Tenant) => {
    setCurrentTenant(tenant);
    localStorage.setItem('currentTenantId', tenant.id);
    // Trigger a custom event to notify other components
    window.dispatchEvent(new CustomEvent('tenantChanged', { detail: { tenantId: tenant.id } }));
  };

  return {
    tenants,
    userRoles,
    currentTenant,
    loading,
    createTenant,
    getRoleInTenant,
    switchTenant,
    refreshTenants: fetchUserTenants
  };
};
