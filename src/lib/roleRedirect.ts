import { useTenant } from "@/hooks/useTenant";
import { useAuth } from "@/hooks/useAuth";

/**
 * Determines the appropriate redirect path based on user role
 * @returns The redirect path or null if no redirect needed
 */
export const getRoleBasedRedirect = (
  user: any,
  currentTenant: any,
  getRoleInTenant: (tenantId: string) => 'admin' | 'teacher' | 'student' | null
): string | null => {
  if (!user || !currentTenant) {
    return null;
  }

  const role = getRoleInTenant(currentTenant.id);

  switch (role) {
    case 'admin':
      return '/admin';
    case 'teacher':
    case 'student':
      return '/student';
    default:
      return '/tenant-select';
  }
};

