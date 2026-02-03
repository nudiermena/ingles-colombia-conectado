import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Users, Search, UserCog, Loader2 } from "lucide-react";
import type { Tenant } from "@/hooks/useTenant";

interface UsersManagementProps {
  currentTenant: Tenant | null;
}

interface UserWithRole {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'teacher' | 'student' | null;
  role_id: string | null;
  created_at: string;
}

const UsersManagement = ({ currentTenant }: UsersManagementProps) => {
  const { user: currentUser } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (currentTenant) {
      fetchUsers();
    }
  }, [currentTenant]);

  const fetchUsers = async () => {
    if (!currentTenant) return;

    setIsLoading(true);
    try {
      // Fetch all user roles in this tenant
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('*')
        .eq('tenant_id', currentTenant.id);

      if (rolesError) throw rolesError;

      // Fetch user profiles
      const userIds = rolesData?.map(r => r.user_id) || [];
      if (userIds.length === 0) {
        setUsers([]);
        setIsLoading(false);
        return;
      }

      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .in('user_id', userIds);

      if (profilesError) throw profilesError;

      // Combine data - Note: Email requires server-side admin access
      // For now, we'll use user_id as identifier
      const usersWithRoles: UserWithRole[] = (profilesData || []).map(profile => {
        const role = rolesData?.find(r => r.user_id === profile.user_id);

        return {
          id: profile.user_id,
          email: profile.user_id.substring(0, 8) + '...', // Placeholder - requires admin API
          full_name: profile.full_name,
          role: role?.role || null,
          role_id: role?.id || null,
          created_at: profile.created_at,
        };
      });

      setUsers(usersWithRoles);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudieron cargar los usuarios",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: 'admin' | 'teacher' | 'student') => {
    if (!currentTenant) return;

    setIsLoading(true);
    try {
      const user = users.find(u => u.id === userId);
      
      if (user?.role_id) {
        // Update existing role
        const { error } = await supabase
          .from('user_roles')
          .update({ role: newRole })
          .eq('id', user.role_id);

        if (error) throw error;
      } else {
        // Create new role
        const { error } = await supabase
          .from('user_roles')
          .insert({
            user_id: userId,
            tenant_id: currentTenant.id,
            role: newRole,
          });

        if (error) throw error;
      }

      toast({
        title: "Rol actualizado",
        description: "El rol del usuario ha sido actualizado exitosamente",
      });

      await fetchUsers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo actualizar el rol",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Gestión de Usuarios
            </CardTitle>
            <CardDescription>
              Administra los usuarios de {currentTenant?.name || "la organización"}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Buscar usuarios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Fecha de Registro</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    {searchTerm ? "No se encontraron usuarios" : "No hay usuarios registrados"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {user.id === currentUser?.id && (
                          <span className="w-2 h-2 bg-primary rounded-full" />
                        )}
                        {user.full_name || "Sin nombre"}
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Select
                        value={user.role || ""}
                        onValueChange={(value: 'admin' | 'teacher' | 'student') =>
                          handleRoleChange(user.id, value)
                        }
                        disabled={isLoading}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="Sin rol" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="teacher">Profesor</SelectItem>
                          <SelectItem value="student">Estudiante</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      {new Date(user.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <UserCog className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default UsersManagement;

