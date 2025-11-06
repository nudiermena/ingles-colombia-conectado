import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen, Building2, Plus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useTenant } from "@/hooks/useTenant";
import { useToast } from "@/hooks/use-toast";

const TenantSelect = () => {
  const { user, loading: authLoading } = useAuth();
  const { tenants, loading: tenantsLoading, createTenant, switchTenant } = useTenant(user?.id);
  const [showCreate, setShowCreate] = useState(false);
  const [tenantName, setTenantName] = useState("");
  const [tenantSlug, setTenantSlug] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  const handleCreateTenant = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      const { error } = await createTenant(tenantName, tenantSlug);
      
      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "¡Organización creada!",
          description: "Tu organización ha sido creada exitosamente"
        });
        setShowCreate(false);
        setTenantName("");
        setTenantSlug("");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Ocurrió un error inesperado",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleSelectTenant = (tenant: any) => {
    switchTenant(tenant);
    navigate('/');
  };

  if (authLoading || tenantsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl animate-scale-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-foreground">EnglishCo</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Selecciona tu Organización</h1>
          <p className="text-muted-foreground">Elige o crea una organización para continuar</p>
        </div>

        {!showCreate ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {tenants.map((tenant) => (
                <Card
                  key={tenant.id}
                  className="cursor-pointer hover:shadow-card hover:scale-105 transition-all"
                  onClick={() => handleSelectTenant(tenant)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{tenant.name}</h3>
                        <p className="text-sm text-muted-foreground">@{tenant.slug}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Button
              variant="outline"
              className="w-full"
              size="lg"
              onClick={() => setShowCreate(true)}
            >
              <Plus className="w-5 h-5 mr-2" />
              Crear Nueva Organización
            </Button>
          </>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Crear Nueva Organización</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateTenant} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre de la Organización</Label>
                  <Input
                    id="name"
                    placeholder="Ej: Colegio San José"
                    value={tenantName}
                    onChange={(e) => {
                      setTenantName(e.target.value);
                      setTenantSlug(e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''));
                    }}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">Identificador (slug)</Label>
                  <Input
                    id="slug"
                    placeholder="colegio-san-jose"
                    value={tenantSlug}
                    onChange={(e) => setTenantSlug(e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Este identificador será usado en URLs y debe ser único
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowCreate(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    variant="hero"
                    className="flex-1"
                    disabled={isCreating}
                  >
                    {isCreating ? "Creando..." : "Crear Organización"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TenantSelect;
