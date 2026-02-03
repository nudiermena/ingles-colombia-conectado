import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Badge } from "@/components/ui/badge";
import { useInvitations } from "@/hooks/useInvitations";
import { useToast } from "@/hooks/use-toast";
import { Mail, Plus, Trash2, RefreshCw, Loader2, Copy, Check } from "lucide-react";
import type { Tenant } from "@/hooks/useTenant";

interface InvitationsManagementProps {
  currentTenant: Tenant | null;
}

const InvitationsManagement = ({ currentTenant }: InvitationsManagementProps) => {
  const { invitations, loading, createInvitation, cancelInvitation, deleteInvitation, resendInvitation } = useInvitations(currentTenant?.id || null);
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    role: "student" as 'admin' | 'teacher' | 'student',
  });

  const handleCreate = () => {
    setFormData({ email: "", role: "student" });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTenant) return;

    setIsLoading(true);
    try {
      const invitation = await createInvitation(formData.email, formData.role);
      
      // Generate invitation URL
      const invitationUrl = `${window.location.origin}/accept-invitation/${invitation.token}`;
      
      toast({
        title: "Invitación enviada",
        description: `Se ha creado la invitación para ${formData.email}`,
      });

      // Copy invitation link to clipboard
      try {
        await navigator.clipboard.writeText(invitationUrl);
        toast({
          title: "Enlace copiado",
          description: "El enlace de invitación ha sido copiado al portapapeles",
        });
      } catch (err) {
        console.error('Failed to copy:', err);
      }

      setIsDialogOpen(false);
      setFormData({ email: "", role: "student" });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo crear la invitación",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async (invitationId: string) => {
    setIsLoading(true);
    try {
      await cancelInvitation(invitationId);
      toast({
        title: "Invitación cancelada",
        description: "La invitación ha sido cancelada exitosamente",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo cancelar la invitación",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (invitationId: string) => {
    if (!confirm("¿Estás seguro de que deseas eliminar esta invitación?")) {
      return;
    }

    setIsLoading(true);
    try {
      await deleteInvitation(invitationId);
      toast({
        title: "Invitación eliminada",
        description: "La invitación ha sido eliminada exitosamente",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo eliminar la invitación",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async (invitationId: string) => {
    setIsLoading(true);
    try {
      const newInvitation = await resendInvitation(invitationId);
      const invitationUrl = `${window.location.origin}/accept-invitation/${newInvitation.token}`;
      
      await navigator.clipboard.writeText(invitationUrl);
      
      toast({
        title: "Invitación reenviada",
        description: "Se ha creado una nueva invitación y el enlace ha sido copiado",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo reenviar la invitación",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyInvitationLink = async (token: string) => {
    const invitationUrl = `${window.location.origin}/accept-invitation/${token}`;
    try {
      await navigator.clipboard.writeText(invitationUrl);
      setCopiedToken(token);
      toast({
        title: "Enlace copiado",
        description: "El enlace de invitación ha sido copiado al portapapeles",
      });
      setTimeout(() => setCopiedToken(null), 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo copiar el enlace",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      pending: "default",
      accepted: "secondary",
      expired: "outline",
      cancelled: "destructive",
    };
    const labels: Record<string, string> = {
      pending: "Pendiente",
      accepted: "Aceptada",
      expired: "Expirada",
      cancelled: "Cancelada",
    };
    return (
      <Badge variant={variants[status] || "outline"}>
        {labels[status] || status}
      </Badge>
    );
  };

  const getRoleBadge = (role: string) => {
    const colors: Record<string, string> = {
      admin: "bg-primary/10 text-primary",
      teacher: "bg-secondary/10 text-secondary",
      student: "bg-muted text-muted-foreground",
    };
    const labels: Record<string, string> = {
      admin: "Administrador",
      teacher: "Profesor",
      student: "Estudiante",
    };
    return (
      <span className={`px-2 py-1 rounded text-xs ${colors[role] || colors.student}`}>
        {labels[role] || role}
      </span>
    );
  };

  const isExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date();
  };

  if (!currentTenant) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <p className="text-muted-foreground">Selecciona una organización para gestionar invitaciones</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Gestión de Invitaciones
            </CardTitle>
            <CardDescription>
              Invita nuevos usuarios a {currentTenant.name}
            </CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleCreate}>
                <Plus className="w-4 h-4 mr-2" />
                Nueva Invitación
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Invitar Usuario</DialogTitle>
                <DialogDescription>
                  Envía una invitación por correo electrónico para unirse a la organización
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Correo Electrónico</Label>
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
                        <SelectItem value="student">Estudiante</SelectItem>
                        <SelectItem value="teacher">Profesor</SelectItem>
                        <SelectItem value="admin">Administrador</SelectItem>
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
                    Enviar Invitación
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Expira</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invitations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No hay invitaciones pendientes
                  </TableCell>
                </TableRow>
              ) : (
                invitations.map((invitation) => (
                  <TableRow key={invitation.id}>
                    <TableCell className="font-medium">{invitation.email}</TableCell>
                    <TableCell>{getRoleBadge(invitation.role)}</TableCell>
                    <TableCell>{getStatusBadge(invitation.status)}</TableCell>
                    <TableCell>
                      <span className={isExpired(invitation.expires_at) ? "text-destructive" : ""}>
                        {new Date(invitation.expires_at).toLocaleDateString()}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {invitation.status === 'pending' && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyInvitationLink(invitation.token)}
                              title="Copiar enlace"
                            >
                              {copiedToken === invitation.token ? (
                                <Check className="w-4 h-4 text-success" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleResend(invitation.id)}
                              disabled={isLoading}
                              title="Reenviar"
                            >
                              <RefreshCw className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCancel(invitation.id)}
                              disabled={isLoading}
                              title="Cancelar"
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </>
                        )}
                        {invitation.status !== 'pending' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(invitation.id)}
                            disabled={isLoading}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        )}
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

export default InvitationsManagement;

