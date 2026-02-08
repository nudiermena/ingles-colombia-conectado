import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useInvitationAcceptance } from "@/hooks/useInvitations";
import { useTenant } from "@/hooks/useTenant";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Mail, CheckCircle, XCircle, Loader2, AlertCircle, Building2, UserCog } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const AcceptInvitation = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getInvitationByToken, acceptInvitation, loading } = useInvitationAcceptance();
  const { refreshTenants } = useTenant(user?.id);
  const { toast } = useToast();
  
  const [invitation, setInvitation] = useState<any>(null);
  const [loadingInvitation, setLoadingInvitation] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      loadInvitation();
    }
  }, [token]);

  const loadInvitation = async () => {
    if (!token) return;

    setLoadingInvitation(true);
    setError(null);
    try {
      const inv = await getInvitationByToken(token);
      if (!inv) {
        setError("Invitación no encontrada o expirada");
        return;
      }
      
      // Fetch tenant information
      const { data: tenantData } = await supabase
        .from('tenants' as any)
        .select('*')
        .eq('id', inv.tenant_id)
        .single();
      
      setInvitation({ ...inv, tenant: tenantData });
    } catch (err: any) {
      setError(err.message || "Error al cargar la invitación");
    } finally {
      setLoadingInvitation(false);
    }
  };

  const handleAccept = async () => {
    if (!token || !invitation) return;

    if (!user) {
      navigate(`/signup?invitation=${token}`);
      return;
    }

    setAccepting(true);
    try {
      const success = await acceptInvitation(token, user.id);
      
      if (success) {
        await refreshTenants();
        toast({
          title: "¡Invitación aceptada!",
          description: `Has sido agregado a ${invitation.tenant?.name || 'la organización'} como ${getRoleLabel(invitation.role)}`,
        });
        
        if (invitation.role === 'admin' || invitation.role === 'teacher') {
          navigate('/admin');
        } else {
          navigate('/student');
        }
      } else {
        setError("No se pudo aceptar la invitación");
      }
    } catch (err: any) {
      setError(err.message || "Error al aceptar la invitación");
    } finally {
      setAccepting(false);
    }
  };

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      admin: "Administrador",
      teacher: "Profesor",
      student: "Estudiante",
    };
    return labels[role] || role;
  };

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      admin: "bg-primary/10 text-primary",
      teacher: "bg-secondary/10 text-secondary-foreground",
      student: "bg-muted text-muted-foreground",
    };
    return colors[role] || colors.student;
  };

  if (loadingInvitation) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Cargando invitación...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error && !invitation) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
          <Card className="max-w-md w-full">
            <CardHeader>
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
                  <XCircle className="w-8 h-8 text-destructive" />
                </div>
              </div>
              <CardTitle className="text-center">Invitación Inválida</CardTitle>
              <CardDescription className="text-center">
                {error}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full" asChild>
                <Link to="/">Volver al Inicio</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  if (!invitation) {
    return null;
  }

  const isExpired = new Date(invitation.expires_at) < new Date();
  const isAccepted = invitation.status === 'accepted' || invitation.accepted_at;
  const isCancelled = invitation.status === 'cancelled';

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md w-full">
          <CardHeader>
            <div className="flex items-center justify-center mb-4">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                isExpired || isCancelled || isAccepted
                  ? 'bg-muted'
                  : 'bg-primary/10'
              }`}>
                {isExpired || isCancelled || isAccepted ? (
                  <XCircle className="w-8 h-8 text-muted-foreground" />
                ) : (
                  <Mail className="w-8 h-8 text-primary" />
                )}
              </div>
            </div>
            <CardTitle className="text-center">
              {isExpired ? "Invitación Expirada" : 
               isCancelled ? "Invitación Cancelada" :
               isAccepted ? "Invitación Ya Aceptada" :
               "Invitación Recibida"}
            </CardTitle>
            <CardDescription className="text-center">
              {isExpired ? "Esta invitación ha expirado" :
               isCancelled ? "Esta invitación ha sido cancelada" :
               isAccepted ? "Esta invitación ya fue aceptada" :
               "Has sido invitado a unirte a una organización"}
            </CardDescription>
          </CardHeader>
          
          {!isExpired && !isCancelled && !isAccepted && (
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                  <Building2 className="w-5 h-5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Organización</p>
                    <p className="font-semibold">
                      {invitation.tenant?.name || 'Organización'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                  <UserCog className="w-5 h-5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Rol</p>
                    <Badge className={getRoleColor(invitation.role)}>
                      {getRoleLabel(invitation.role)}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                  <Mail className="w-5 h-5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-semibold">{invitation.email}</p>
                  </div>
                </div>
              </div>

              {!user ? (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground text-center">
                    Necesitas crear una cuenta o iniciar sesión para aceptar esta invitación
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1" asChild>
                      <Link to={`/login?redirect=/accept-invitation/${token}`}>Iniciar Sesión</Link>
                    </Button>
                    <Button className="flex-1" asChild>
                      <Link to={`/signup?invitation=${token}`}>Crear Cuenta</Link>
                    </Button>
                  </div>
                </div>
              ) : user.email?.toLowerCase() !== invitation.email.toLowerCase() ? (
                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-destructive mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-destructive">Email no coincide</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Esta invitación es para {invitation.email}, pero has iniciado sesión como {user.email}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <Button 
                  className="w-full" 
                  onClick={handleAccept}
                  disabled={accepting || loading}
                  size="lg"
                >
                  {accepting || loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Aceptando...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Aceptar Invitación
                    </>
                  )}
                </Button>
              )}
            </CardContent>
          )}

          {(isExpired || isCancelled || isAccepted) && (
            <CardContent>
              <Button className="w-full" asChild>
                <Link to="/">Volver al Inicio</Link>
              </Button>
            </CardContent>
          )}
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default AcceptInvitation;
