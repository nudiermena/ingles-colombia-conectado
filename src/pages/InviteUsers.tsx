import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useTenant } from "@/hooks/useTenant";
import { useInvitations } from "@/hooks/useInvitations";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Mail, Send, Loader2, Trash2, RefreshCw, Clock, CheckCircle, XCircle, ArrowLeft } from "lucide-react";

const InviteUsers = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { currentTenant } = useTenant(user?.id);
  const { invitations, loading, createInvitation, deleteInvitation, resendInvitation } = useInvitations(currentTenant?.id || null);
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"teacher" | "student">("student");
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !role) return;

    setSending(true);
    try {
      await createInvitation(email, role);
      toast({
        title: "Invitación enviada",
        description: `Se ha enviado una invitación a ${email}`,
      });
      setEmail("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo enviar la invitación",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteInvitation(id);
      toast({
        title: "Invitación eliminada",
        description: "La invitación ha sido eliminada",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo eliminar la invitación",
        variant: "destructive",
      });
    }
  };

  const handleResend = async (id: string) => {
    try {
      await resendInvitation(id);
      toast({
        title: "Invitación reenviada",
        description: "Se ha creado una nueva invitación",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo reenviar la invitación",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (invitation: any) => {
    const isExpired = new Date(invitation.expires_at) < new Date();
    
    if (invitation.status === 'accepted' || invitation.accepted_at) {
      return <Badge className="bg-primary/10 text-primary"><CheckCircle className="w-3 h-3 mr-1" /> Aceptada</Badge>;
    }
    if (invitation.status === 'cancelled') {
      return <Badge variant="secondary"><XCircle className="w-3 h-3 mr-1" /> Cancelada</Badge>;
    }
    if (isExpired) {
      return <Badge variant="destructive"><Clock className="w-3 h-3 mr-1" /> Expirada</Badge>;
    }
    return <Badge className="bg-secondary/20 text-secondary-foreground"><Clock className="w-3 h-3 mr-1" /> Pendiente</Badge>;
  };

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      admin: "Administrador",
      teacher: "Profesor",
      student: "Estudiante",
    };
    return labels[role] || role;
  };

  if (!currentTenant) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">Selecciona una organización primero</p>
              <Button className="mt-4" onClick={() => navigate("/tenant-select")}>
                Seleccionar Organización
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Invite Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Invitar Usuario
              </CardTitle>
              <CardDescription>
                Envía una invitación por email para unirse a {currentTenant.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="usuario@ejemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Rol</Label>
                  <Select value={role} onValueChange={(value: "teacher" | "student") => setRole(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un rol" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="teacher">Profesor</SelectItem>
                      <SelectItem value="student">Estudiante</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" className="w-full" disabled={sending || !email}>
                  {sending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Enviar Invitación
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Invitations List */}
          <Card>
            <CardHeader>
              <CardTitle>Invitaciones Enviadas</CardTitle>
              <CardDescription>
                Historial de invitaciones para esta organización
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : invitations.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No hay invitaciones aún
                </p>
              ) : (
                <div className="space-y-3">
                  {invitations.map((invitation) => {
                    const isExpired = new Date(invitation.expires_at) < new Date();
                    const isPending = invitation.status === 'pending' && !isExpired && !invitation.accepted_at;
                    
                    return (
                      <div
                        key={invitation.id}
                        className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{invitation.email}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {getRoleLabel(invitation.role)}
                            </Badge>
                            {getStatusBadge(invitation)}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1 ml-2">
                          {isPending && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleResend(invitation.id)}
                              title="Reenviar"
                            >
                              <RefreshCw className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(invitation.id)}
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default InviteUsers;
