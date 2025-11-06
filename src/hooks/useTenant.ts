import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  settings: any;
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

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    fetchUserTenants();
  }, [userId]);

  const fetchUserTenants = async () => {
    if (!userId) return;

    try {
      // Fetch user roles
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', userId);

      if (rolesError) throw rolesError;
      setUserRoles(rolesData || []);

      // Fetch tenants
      const tenantIds = rolesData?.map(role => role.tenant_id) || [];
      if (tenantIds.length > 0) {
        const { data: tenantsData, error: tenantsError } = await supabase
          .from('tenants')
          .select('*')
          .in('id', tenantIds);

        if (tenantsError) throw tenantsError;
        setTenants(tenantsData || []);

        // Set first tenant as current if exists
        if (tenantsData && tenantsData.length > 0 && !currentTenant) {
          setCurrentTenant(tenantsData[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching tenants:', error);
    } finally {
      setLoading(false);
    }
  };

  const createTenant = async (name: string, slug: string) => {
    if (!userId) return { error: new Error('User not authenticated') };

    const { data, error } = await supabase
      .from('tenants')
      .insert({ name, slug })
      .select()
      .single();

    if (error) return { error };

    // Create admin role for creator
    const { error: roleError } = await supabase
      .from('user_roles')
      .insert({
        user_id: userId,
        tenant_id: data.id,
        role: 'admin'
      });

    if (roleError) return { error: roleError };

    await fetchUserTenants();
    return { data };
  };

  const getRoleInTenant = (tenantId: string): 'admin' | 'teacher' | 'student' | null => {
    const role = userRoles.find(r => r.tenant_id === tenantId);
    return role?.role || null;
  };

  const switchTenant = (tenant: Tenant) => {
    setCurrentTenant(tenant);
    localStorage.setItem('currentTenantId', tenant.id);
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
