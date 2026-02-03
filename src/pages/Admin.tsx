import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useTenant } from "@/hooks/useTenant";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Shield, Building2, Users, BookOpen, UserCog, Mail, Loader2 } from "lucide-react";
import TenantsManagement from "@/components/admin/TenantsManagement";
import UsersManagement from "@/components/admin/UsersManagement";
import LessonsManagement from "@/components/admin/LessonsManagement";
import RolesManagement from "@/components/admin/RolesManagement";
import InvitationsManagement from "@/components/admin/InvitationsManagement";

const Admin = () => {
  const { user, loading: authLoading } = useAuth();
  const { currentTenant, getRoleInTenant, loading: tenantLoading, switchTenant, tenants } = useTenant(user?.id);
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [activeTab, setActiveTab] = useState("lessons"); // Default to "lessons" instead of "invitations"

  useEffect(() => {
    const checkAdminAccess = async () => {
      if (authLoading || tenantLoading) return;

      if (!user) {
        navigate('/login');
        return;
      }

      if (!currentTenant) {
        navigate('/tenant-select');
        return;
      }

      const role = getRoleInTenant(currentTenant.id);
      if (role !== 'admin' && role !== 'teacher') {
        navigate('/');
        return;
      }

      setIsAdmin(true); // renaming this state variable might be good, but for now it controls visibility
      setCheckingAccess(false);
    };

    checkAdminAccess();
  }, [user, currentTenant, authLoading, tenantLoading, navigate, getRoleInTenant]);

  if (checkingAccess || authLoading || tenantLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Verificando acceso...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const role = currentTenant ? getRoleInTenant(currentTenant.id) : null;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 animate-fade-in">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                Panel de Administración
              </h1>
              <p className="text-muted-foreground">
                Gestiona tu organización, usuarios, lecciones y roles
              </p>
            </div>
          </div>

          {currentTenant && (
            <Card className="mt-4">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-muted-foreground" />
                  <span className="font-medium">Organización actual:</span>
                  <span className="text-primary font-semibold">{currentTenant.name}</span>
                  <span className="text-sm text-muted-foreground ml-2">
                    ({role === 'admin' ? 'Administrador' : 'Profesor'})
                  </span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="invitations" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span className="hidden sm:inline">Invitaciones</span>
              <span className="sm:hidden">Inv</span>
            </TabsTrigger>

            {role === 'admin' && (
              <TabsTrigger value="tenants" className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                <span className="hidden sm:inline">Organizaciones</span>
                <span className="sm:hidden">Org</span>
              </TabsTrigger>
            )}

            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Usuarios</span>
              <span className="sm:hidden">Usr</span>
            </TabsTrigger>
            <TabsTrigger value="lessons" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Lecciones</span>
              <span className="sm:hidden">Lec</span>
            </TabsTrigger>

            {role === 'admin' && (
              <TabsTrigger value="roles" className="flex items-center gap-2">
                <UserCog className="w-4 h-4" />
                <span className="hidden sm:inline">Roles</span>
                <span className="sm:hidden">Rol</span>
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="invitations" className="space-y-4">
            <InvitationsManagement currentTenant={currentTenant} />
          </TabsContent>

          {role === 'admin' && (
            <TabsContent value="tenants" className="space-y-4">
              <TenantsManagement
                currentTenant={currentTenant}
                onSwitchToLessons={(tenantId) => {
                  // Find the tenant and switch to it
                  const tenant = tenants.find(t => t.id === tenantId);
                  if (tenant && tenant.id !== currentTenant?.id) {
                    switchTenant(tenant);
                  }
                  // Switch to lessons tab
                  setActiveTab('lessons');
                }}
              />
            </TabsContent>
          )}

          <TabsContent value="users" className="space-y-4">
            <UsersManagement
              currentTenant={currentTenant}
              currentUserRole={role}
            />
          </TabsContent>

          <TabsContent value="lessons" className="space-y-4">
            <LessonsManagement currentTenant={currentTenant} />
          </TabsContent>

          {role === 'admin' && (
            <TabsContent value="roles" className="space-y-4">
              <RolesManagement currentTenant={currentTenant} />
            </TabsContent>
          )}
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default Admin;

