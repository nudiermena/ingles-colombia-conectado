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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { UserCog, Plus, Trash2, Search, Loader2 } from "lucide-react";
import type { Tenant } from "@/hooks/useTenant";

interface RolesManagementProps {
  currentTenant: Tenant | null;
}

interface UserRole {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  role: 'admin' | 'teacher' | 'student';
  created_at: string;
}

const RolesManagement = ({ currentTenant }: RolesManagementProps) => {
  const { user: currentUser } = useAuth();
  const { toast } = useToast();
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    user_id: "",
    role: "student" as 'admin' | 'teacher' | 'student',
  });

  useEffect(() => {
    if (currentTenant) {
      fetchRoles();
    }
  }, [currentTenant]);

  const fetchRoles = async () => {
    if (!currentTenant) return;

    setIsLoading(true);
    try {
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('*')
        .eq('tenant_id', currentTenant.id)
        .order('created_at', { ascending: false });

      if (rolesError) throw rolesError;

      // Fetch user profiles
      const userIds = rolesData?.map(r => r.user_id) || [];
      if (userIds.length === 0) {
        setRoles([]);
        setIsLoading(false);
        return;
      }

      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .in('user_id', userIds);

      if (profilesError) throw profilesError;

      // Combine data
      const rolesWithUsers: UserRole[] = (rolesData || []).map(role => {
        const profile = profilesData?.find(p => p.user_id === role.user_id);

        return {
          id: role.id,
          user_id: role.user_id,
          full_name: profile?.full_name || 'Sin nombre',
          email: role.user_id.substring(0, 8) + '...', // Placeholder
          role: role.role,
          created_at: role.created_at,
        };
      });

      setRoles(rolesWithUsers);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudieron cargar los roles",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleChange = async (roleId: string, newRole: 'admin' | 'teacher' | 'student') => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('user_roles')
        .update({ role: newRole })
        .eq('id', roleId);

      if (error) throw error;

      toast({
        title: "Rol actualizado",
        description: "El rol ha sido actualizado exitosamente",
      });

      await fetchRoles();
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

  const handleDelete = async (roleId: string) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este rol?")) {
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('id', roleId);

      if (error) throw error;

      toast({
        title: "Rol eliminado",
        description: "El rol ha sido eliminado exitosamente",
      });

      await fetchRoles();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo eliminar el rol",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTenant) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('user_roles')
        .insert({
          user_id: formData.user_id,
          tenant_id: currentTenant.id,
          role: formData.role,
        });

      if (error) throw error;

      toast({
        title: "Rol asignado",
        description: "El rol ha sido asignado exitosamente",
      });

      setIsDialogOpen(false);
      setFormData({ user_id: "", role: "student" });
      await fetchRoles();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo asignar el rol",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredRoles = roles.filter(role =>
    role.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const roleCounts = {
    admin: roles.filter(r => r.role === 'admin').length,
    teacher: roles.filter(r => r.role === 'teacher').length,
    student: roles.filter(r => r.role === 'student').length,
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <UserCog className="w-5 h-5" />
              Gestión de Roles
            </CardTitle>
            <CardDescription>
              Administra los roles de usuarios en {currentTenant?.name || "la organización"}
            </CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setFormData({ user_id: "", role: "student" })}>
                <Plus className="w-4 h-4 mr-2" />
                Asignar Rol
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Asignar Nuevo Rol</DialogTitle>
                <DialogDescription>
                  Asigna un rol a un usuario en esta organización
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="user_id">ID de Usuario</Label>
                    <Input
                      id="user_id"
                      value={formData.user_id}
                      onChange={(e) =>
                        setFormData({ ...formData, user_id: e.target.value })
                      }
                      placeholder="UUID del usuario"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Rol</Label>
                    <Select
                      value={formData.role}
                      onValueChange={(value: 'admin' | 'teacher' | 'student') =>
                        setFormData({ ...formData, role: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Administrador</SelectItem>
                        <SelectItem value="teacher">Profesor</SelectItem>
                        <SelectItem value="student">Estudiante</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Asignar
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-primary">{roleCounts.admin}</div>
              <p className="text-xs text-muted-foreground">Administradores</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-secondary">{roleCounts.teacher}</div>
              <p className="text-xs text-muted-foreground">Profesores</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{roleCounts.student}</div>
              <p className="text-xs text-muted-foreground">Estudiantes</p>
            </CardContent>
          </Card>
        </div>

        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Buscar roles..."
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
                <TableHead>Usuario</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Fecha de Asignación</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRoles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    {searchTerm ? "No se encontraron roles" : "No hay roles asignados"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredRoles.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {role.user_id === currentUser?.id && (
                          <span className="w-2 h-2 bg-primary rounded-full" />
                        )}
                        {role.full_name}
                      </div>
                    </TableCell>
                    <TableCell>{role.email}</TableCell>
                    <TableCell>
                      <Select
                        value={role.role}
                        onValueChange={(value: 'admin' | 'teacher' | 'student') =>
                          handleRoleChange(role.id, value)
                        }
                        disabled={isLoading}
                      >
                        <SelectTrigger className="w-36">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Administrador</SelectItem>
                          <SelectItem value="teacher">Profesor</SelectItem>
                          <SelectItem value="student">Estudiante</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      {new Date(role.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(role.id)}
                        disabled={isLoading || role.user_id === currentUser?.id}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
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

export default RolesManagement;


