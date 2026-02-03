/**
 * Admin page to seed lessons for the current tenant
 * This page allows admins to bulk import lessons from lessonsData.ts
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { useTenant } from "@/hooks/useTenant";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { seedLessonsForTenant } from "@/scripts/seedLessons";
import { Loader2, CheckCircle, XCircle, BookOpen, AlertCircle } from "lucide-react";

const SeedLessons = () => {
  const { user } = useAuth();
  const { currentTenant, getRoleInTenant } = useTenant(user?.id);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [selectedLevels, setSelectedLevels] = useState<string[]>(['A1', 'A2', 'B1', 'B2']);
  const [isSeeding, setIsSeeding] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{ success: number; errors: number; skipped: number } | null>(null);

  const isAdmin = currentTenant && getRoleInTenant(currentTenant.id) === 'admin';

  const levels = [
    { value: 'A1', label: 'A1 (Básico)', count: 24 },
    { value: 'A2', label: 'A2 (Intermedio)', count: 32 },
    { value: 'B1', label: 'B1 (Avanzado)', count: 40 },
    { value: 'B2', label: 'B2 (Avanzado Superior)', count: 0 },
  ];

  const handleLevelToggle = (level: string) => {
    setSelectedLevels(prev =>
      prev.includes(level)
        ? prev.filter(l => l !== level)
        : [...prev, level]
    );
  };

  const handleSeed = async () => {
    if (!currentTenant) {
      toast({
        title: "Error",
        description: "No hay organización seleccionada",
        variant: "destructive"
      });
      return;
    }

    if (selectedLevels.length === 0) {
      toast({
        title: "Error",
        description: "Selecciona al menos un nivel",
        variant: "destructive"
      });
      return;
    }

    setIsSeeding(true);
    setProgress(0);
    setResult(null);

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 2, 90));
      }, 100);

      const seedResult = await seedLessonsForTenant(
        currentTenant.id,
        selectedLevels
      );

      clearInterval(progressInterval);
      setProgress(100);
      setResult(seedResult);

      toast({
        title: "¡Importación completada!",
        description: `Se importaron ${seedResult.success} lecciones exitosamente`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Error al importar lecciones",
        variant: "destructive"
      });
    } finally {
      setIsSeeding(false);
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  if (!currentTenant) {
    navigate('/tenant-select');
    return null;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="pt-6 text-center">
              <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Acceso Denegado</h2>
              <p className="text-muted-foreground">
                Solo los administradores pueden importar lecciones
              </p>
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
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Importar Lecciones</h1>
            <p className="text-muted-foreground">
              Importa lecciones predefinidas para {currentTenant.name}
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Seleccionar Niveles a Importar</CardTitle>
              <CardDescription>
                Elige los niveles de inglés que deseas importar. Las lecciones duplicadas se omitirán automáticamente.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {levels.map((level) => (
                  <div key={level.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={level.value}
                      checked={selectedLevels.includes(level.value)}
                      onCheckedChange={() => handleLevelToggle(level.value)}
                      disabled={isSeeding || level.count === 0}
                    />
                    <Label
                      htmlFor={level.value}
                      className="flex-1 cursor-pointer flex items-center justify-between"
                    >
                      <span>{level.label}</span>
                      <span className="text-sm text-muted-foreground">
                        {level.count > 0 ? `${level.count} lecciones` : 'No disponible'}
                      </span>
                    </Label>
                  </div>
                ))}
              </div>

              {isSeeding && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Importando lecciones...</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} />
                </div>
              )}

              {result && (
                <div className="p-4 bg-muted rounded-lg space-y-2">
                  <div className="flex items-center gap-2 text-success">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-semibold">Importación completada</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Exitosas</p>
                      <p className="text-2xl font-bold text-success">{result.success}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Errores</p>
                      <p className="text-2xl font-bold text-destructive">{result.errors}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Omitidas</p>
                      <p className="text-2xl font-bold text-muted-foreground">{result.skipped}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  onClick={handleSeed}
                  disabled={isSeeding || selectedLevels.length === 0}
                  className="flex-1"
                >
                  {isSeeding ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Importando...
                    </>
                  ) : (
                    <>
                      <BookOpen className="w-4 h-4 mr-2" />
                      Importar Lecciones
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/admin')}
                  disabled={isSeeding}
                >
                  Volver al Admin
                </Button>
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="flex-1 text-sm">
                    <p className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                      Nota Importante
                    </p>
                    <p className="text-blue-800 dark:text-blue-200">
                      Esta acción importará lecciones predefinidas para tu organización. 
                      Las lecciones duplicadas (mismo título y nivel) serán omitidas automáticamente.
                      Puedes editar o eliminar lecciones después de importarlas desde el panel de administración.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SeedLessons;

