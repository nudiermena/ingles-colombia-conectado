import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Users, Search, Loader2, Trash2, Pencil, Plus } from "lucide-react";
import type { Tenant } from "@/hooks/useTenant";

interface UsersManagementProps {
  currentTenant: Tenant | null;
  currentUserRole?: 'admin' | 'teacher' | 'student' | null;
  onInvite?: () => void;
}

interface UserWithRole {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'teacher' | 'student' | null;
  role_id: string | null;
  created_at: string;
}

const UsersManagement = ({ currentTenant, currentUserRole, onInvite }: UsersManagementProps) => {
  const { user: currentUser } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingUser, setEditingUser] = useState<UserWithRole | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    full_name: "",
    role: "student" as "admin" | "teacher" | "student",
  });

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

      // Build list from user_roles (source of truth) so new users show up even if profile is delayed
      const usersWithRoles: UserWithRole[] = (rolesData || []).map((roleRow) => {
        const profile = (profilesData || []).find((p) => p.user_id === roleRow.user_id);
        return {
          id: roleRow.user_id,
          email: roleRow.user_id.substring(0, 8) + '...',
          full_name: profile?.full_name ?? 'Sin nombre',
          role: roleRow.role ?? null,
          role_id: roleRow.id ?? null,
          created_at: profile?.created_at ?? roleRow.created_at,
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

  const handleDeleteUser = async (userId: string, targetUserRole: string | null) => {
    if (!currentTenant) return;

    // Safety checks
    if (userId === currentUser?.id) {
      toast({
        title: "Acción no permitida",
        description: "No puedes eliminar tu propia cuenta de la organización",
        variant: "destructive"
      });
      return;
    }

    if (currentUserRole !== 'admin' && targetUserRole === 'admin') {
      toast({
        title: "Acción no permitida",
        description: "No tienes permisos para eliminar administradores",
        variant: "destructive"
      });
      return;
    }

    if (!confirm("¿Estás seguro de que deseas eliminar a este usuario de la organización? Esta acción no se puede deshacer.")) {
      return;
    }

    setIsLoading(true);
    try {
      // Find and delete the role assignment
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .match({
          user_id: userId,
          tenant_id: currentTenant.id
        });

      if (error) throw error;

      toast({
        title: "Usuario eliminado",
        description: "El usuario ha sido removido de la organización exitosamente",
      });

      await fetchUsers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo eliminar al usuario",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = () => {
    setIsEditing(false);
    setEditingUser(null);
    setFormData({
      email: "",
      password: "",
      full_name: "",
      role: "student",
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (user: UserWithRole) => {
    setIsEditing(true);
    setEditingUser(user);
    setFormData({
      email: "",
      password: "",
      full_name: user.full_name || "",
      role: user.role || "student",
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTenant) return;

    setIsSubmitting(true);
    try {
      if (isEditing && editingUser) {
        // Update: profile full_name and user_roles role
        const updates: Promise<any>[] = [];
        updates.push(
          supabase
            .from("profiles")
            .update({ full_name: formData.full_name })
            .eq("user_id", editingUser.id)
        );
        if (editingUser.role_id) {
          updates.push(
            supabase
              .from("user_roles")
              .update({ role: formData.role })
              .eq("id", editingUser.role_id)
          );
        } else {
          updates.push(
            supabase.from("user_roles").insert({
              user_id: editingUser.id,
              tenant_id: currentTenant.id,
              role: formData.role,
            })
          );
        }
        await Promise.all(updates);
        toast({
          title: "Usuario actualizado",
          description: "El usuario ha sido actualizado exitosamente",
        });
      } else {
        // Create: signUp then add to tenant
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: formData.email.trim(),
          password: formData.password,
          options: {
            data: { full_name: formData.full_name },
          },
        });

        if (signUpError) throw signUpError;
        if (!data.user) {
          throw new Error("No se pudo crear el usuario. ¿El correo ya está registrado?");
        }

        const { error: roleError } = await supabase.rpc("add_user_role_to_tenant", {
          _user_id: data.user.id,
          _tenant_id: currentTenant.id,
          _role: formData.role,
        });

        if (roleError) throw roleError;

        toast({
          title: "Usuario creado",
          description: "El usuario ha sido creado y agregado a la organización",
        });
      }

      setIsDialogOpen(false);
      setFormData({ email: "", password: "", full_name: "", role: "student" });
      setEditingUser(null);
      await fetchUsers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo guardar",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
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
          <div className="flex gap-2">
            {onInvite && (
              <Button variant="outline" onClick={onInvite}>
                <Plus className="w-4 h-4 mr-2" />
                Nueva Invitación
              </Button>
            )}
            <Button type="button" onClick={handleCreate}>
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Usuario
            </Button>
            <Dialog
              open={isDialogOpen}
              onOpenChange={(open) => {
                setIsDialogOpen(open);
                if (!open) {
                  setEditingUser(null);
                  setFormData({ email: "", password: "", full_name: "", role: "student" });
                }
              }}
            >
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>
                    {isEditing ? "Editar Usuario" : "Nuevo Usuario"}
                  </DialogTitle>
                  <DialogDescription>
                    {isEditing
                      ? "Actualiza el nombre y rol del usuario"
                      : "Crea un usuario con correo y contraseña y asígnalo a la organización"}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4 py-4">
                    {!isEditing && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="email">Correo electrónico</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) =>
                              setFormData({ ...formData, email: e.target.value })
                            }
                            placeholder="usuario@ejemplo.com"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="password">Contraseña</Label>
                          <Input
                            id="password"
                            type="password"
                            value={formData.password}
                            onChange={(e) =>
                              setFormData({ ...formData, password: e.target.value })
                            }
                            placeholder="Mínimo 6 caracteres"
                            required={!isEditing}
                            minLength={6}
                          />
                        </div>
                      </>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="full_name">Nombre completo</Label>
                      <Input
                        id="full_name"
                        value={formData.full_name}
                        onChange={(e) =>
                          setFormData({ ...formData, full_name: e.target.value })
                        }
                        placeholder="Nombre del usuario"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Rol</Label>
                      <Select
                        value={formData.role}
                        onValueChange={(value: "admin" | "teacher" | "student") =>
                          setFormData({ ...formData, role: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {currentUserRole === "admin" && (
                            <SelectItem value="admin">Administrador</SelectItem>
                          )}
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
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting && (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      )}
                      {isEditing ? "Actualizar" : "Crear"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
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
                    <TableCell className="text-muted-foreground">{user.email}</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium">
                        {user.role === "admin"
                          ? "Administrador"
                          : user.role === "teacher"
                          ? "Profesor"
                          : user.role === "student"
                          ? "Estudiante"
                          : "Sin rol"}
                      </span>
                    </TableCell>
                    <TableCell>
                      {new Date(user.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(user)}
                          disabled={isLoading}
                          title="Editar usuario"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteUser(user.id, user.role)}
                          disabled={
                            isLoading ||
                            user.id === currentUser?.id ||
                            (user.role === "admin" && currentUserRole !== "admin")
                          }
                          title="Eliminar usuario"
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
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

