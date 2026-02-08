import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Award, Download, Share2, Calendar, CheckCircle2, Lock, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useTenant } from "@/hooks/useTenant";
import { supabase } from "@/integrations/supabase/client";
import { generateCertificatePDF } from "@/lib/generateCertificatePDF";
import { useToast } from "@/hooks/use-toast";

const CERT_LEVELS = [
  { level: "A1", title: "Certificado Básico de Inglés", description: "Completaste exitosamente el nivel A1 - Fundamentos del Inglés", skills: ["Vocabulario básico", "Presente simple", "Saludos y presentaciones", "Números y colores"] },
  { level: "A2", title: "Certificado Pre-Intermedio", description: "Dominio del nivel A2 - Inglés Pre-Intermedio", skills: ["Pasado simple", "Conversaciones cotidianas", "Descripción de personas", "Planes futuros"] },
  { level: "B1", title: "Certificado Intermedio", description: "Certificación del nivel B1 - Inglés Intermedio", skills: ["Expresar opiniones", "Situaciones de viaje", "Describir experiencias", "Debates básicos"] },
] as const;

interface CertState {
  id: string;
  level: string;
  title: string;
  description: string;
  dateEarned: string | null;
  progress: number;
  status: "earned" | "in-progress" | "locked";
  skills: string[];
}

const Certificates = () => {
  const { user } = useAuth();
  const { currentTenant, loading: tenantLoading } = useTenant(user?.id);
  const { toast } = useToast();
  const [userProfile, setUserProfile] = useState<{ fullName?: string; email?: string } | null>(null);
  const [certificates, setCertificates] = useState<CertState[]>([]);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) return;
      try {
        const { data: profile } = await supabase.from("profiles").select("full_name").eq("user_id", user.id).single();
        setUserProfile({
          fullName: profile?.full_name || user.user_metadata?.full_name || undefined,
          email: user.email || undefined,
        });
      } catch {
        setUserProfile({ fullName: user.user_metadata?.full_name, email: user.email });
      }
    };
    fetchProfile();
  }, [user]);

  useEffect(() => {
    const fetchCertificateState = async () => {
      if (!user?.id || !currentTenant?.id) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const { data: assignments } = await supabase
          .from("user_lesson_assignments")
          .select("lesson_id")
          .eq("user_id", user.id)
          .eq("tenant_id", currentTenant.id);
        const assignedLessonIds = new Set((assignments || []).map((a) => a.lesson_id));

        const { data: lessons } = await supabase
          .from("lessons")
          .select("id, level")
          .eq("tenant_id", currentTenant.id)
          .eq("is_active", true);
        const lessonLevelMap = new Map<string, string>((lessons || []).map((l) => [l.id, l.level]));

        const { data: progress } = await supabase
          .from("lesson_progress")
          .select("lesson_id, completed, completed_at")
          .eq("user_id", user.id)
          .eq("tenant_id", currentTenant.id);
        const completedLessons = new Set((progress || []).filter((p) => p.completed).map((p) => p.lesson_id));
        const completedAtMap = new Map<string, string>((progress || [])
          .filter((p) => p.completed && p.completed_at)
          .map((p) => [p.lesson_id, p.completed_at!]));

        const certs: CertState[] = CERT_LEVELS.map((c, idx) => {
          const levelLessonIds = (lessons || [])
            .filter((l) => l.level === c.level)
            .map((l) => l.id);
          const assignedForLevel = levelLessonIds.filter((id) => assignedLessonIds.has(id));
          const completedForLevel = assignedForLevel.filter((id) => completedLessons.has(id));

          let status: "earned" | "in-progress" | "locked" = "locked";
          let progress = 0;
          let dateEarned: string | null = null;

          if (assignedForLevel.length > 0) {
            progress = Math.round((completedForLevel.length / assignedForLevel.length) * 100);
            if (completedForLevel.length === assignedForLevel.length) {
              status = "earned";
              const dates = completedForLevel.map((id) => completedAtMap.get(id)).filter(Boolean) as string[];
              dateEarned = dates.length > 0
                ? new Date(dates.sort().pop()!).toLocaleDateString("es-CO", { year: "numeric", month: "long", day: "numeric" })
                : new Date().toLocaleDateString("es-CO", { year: "numeric", month: "long", day: "numeric" });
            } else if (completedForLevel.length > 0) {
              status = "in-progress";
            }
          }

          return {
            id: `cert-${c.level}-${idx}`,
            level: c.level,
            title: c.title,
            description: c.description,
            dateEarned,
            progress,
            status,
            skills: [...c.skills],
          };
        });
        setCertificates(certs);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCertificateState();
  }, [user?.id, currentTenant?.id]);

  const handleDownloadPDF = (cert: CertState) => {
    if (cert.status !== "earned" || !cert.dateEarned) {
      toast({
        title: "Certificado no disponible",
        description: "Debes completar todas las lecciones asignadas para este nivel",
        variant: "destructive",
      });
      return;
    }
    setIsGeneratingPDF(cert.id);
    try {
      generateCertificatePDF(
        { id: cert.id, level: cert.level, title: cert.title, description: cert.description, dateEarned: cert.dateEarned, skills: cert.skills },
        { fullName: userProfile?.fullName, email: userProfile?.email || user?.email }
      );
      toast({ title: "Certificado descargado", description: "El certificado PDF se ha descargado exitosamente" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "No se pudo generar el PDF", variant: "destructive" });
    } finally {
      setIsGeneratingPDF(null);
    }
  };

  if (tenantLoading || !user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!currentTenant) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8 text-center">
          <p className="text-muted-foreground mb-4">Selecciona una organización para ver tus certificados</p>
          <Button asChild>
            <Link to="/tenant-select">Seleccionar Organización</Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  const earnedCount = certificates.filter((c) => c.status === "earned").length;
  const inProgressCount = certificates.filter((c) => c.status === "in-progress").length;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 animate-fade-in">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Mis Certificados</h1>
          <p className="text-xl text-muted-foreground">Documenta tu progreso con certificaciones oficiales</p>
        </div>

        <Card className="mb-8 bg-gradient-card hover:shadow-card transition-all duration-300">
          <CardContent className="py-6">
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-success mb-2">{earnedCount}</div>
                <p className="text-muted-foreground">Certificados Obtenidos</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-warning mb-2">{inProgressCount}</div>
                <p className="text-muted-foreground">En Progreso</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-muted-foreground mb-2">{certificates.length}</div>
                <p className="text-muted-foreground">Total Disponibles</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            certificates.map((cert, index) => (
              <Card
                key={cert.id}
                className={`hover:shadow-card transition-all duration-300 relative overflow-hidden ${
                  cert.status === "earned" ? "border-success bg-success/5" :
                  cert.status === "in-progress" ? "border-warning bg-warning/5" :
                  "border-muted bg-muted/20 opacity-75"
                }`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <CardHeader className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge
                      variant={cert.level === "A1" ? "secondary" : cert.level === "A2" ? "default" : "outline"}
                      className="text-lg px-3 py-1"
                    >
                      {cert.level}
                    </Badge>
                    {cert.status === "earned" && <CheckCircle2 className="w-6 h-6 text-success" />}
                    {cert.status === "locked" && <Lock className="w-6 h-6 text-muted-foreground" />}
                  </div>
                  <div className="space-y-2">
                    <CardTitle className="text-lg">{cert.title}</CardTitle>
                    <p className="text-sm text-muted-foreground leading-relaxed">{cert.description}</p>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {cert.status === "in-progress" && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progreso</span>
                        <span className="font-medium">{cert.progress}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-warning h-2 rounded-full transition-all duration-500" style={{ width: `${cert.progress}%` }} />
                      </div>
                    </div>
                  )}
                  {cert.status === "earned" && cert.dateEarned && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>Obtenido el {cert.dateEarned}</span>
                    </div>
                  )}
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold">Habilidades Cubiertas:</h4>
                    <div className="flex flex-wrap gap-1">
                      {cert.skills.map((skill, i) => (
                        <Badge key={i} variant="outline" className="text-xs">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {cert.status === "earned" && (
                      <>
                        <Button
                          variant="success"
                          size="sm"
                          className="flex-1"
                          onClick={() => handleDownloadPDF(cert)}
                          disabled={isGeneratingPDF === cert.id}
                        >
                          {isGeneratingPDF === cert.id ? (
                            <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Generando...</>
                          ) : (
                            <><Download className="w-4 h-4 mr-2" />Descargar PDF</>
                          )}
                        </Button>
                        <Button variant="outline" size="sm">
                          <Share2 className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                    {cert.status === "in-progress" && (
                      <Button variant="lesson" size="sm" className="w-full" asChild>
                        <Link to="/lecciones">Continuar Aprendiendo</Link>
                      </Button>
                    )}
                    {cert.status === "locked" && (
                      <Button variant="outline" size="sm" className="w-full" disabled>
                        <Lock className="w-4 h-4 mr-2" />
                        {cert.progress === 0 ? "Sin lecciones asignadas" : "Bloqueado"}
                      </Button>
                    )}
                  </div>
                </CardContent>
                {cert.status === "earned" && (
                  <div className="absolute top-4 right-4">
                    <div className="w-12 h-12 bg-success rounded-full flex items-center justify-center shadow-lg">
                      <Award className="w-6 h-6 text-success-foreground" />
                    </div>
                  </div>
                )}
              </Card>
            ))
          )}
        </div>

        <Card className="mt-8 bg-gradient-hero text-white border-0">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Award className="w-6 h-6" />
              Sobre Nuestros Certificados
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4 text-white/90">
              <div className="space-y-2">
                <h3 className="font-semibold">Reconocimiento Oficial</h3>
                <p className="text-sm">Nuestros certificados están alineados con el Marco Común Europeo de Referencia (MCER)</p>
              </div>            
            </div>
            <p className="text-sm text-white/80">
              Tu profesor o administrador debe asignarte lecciones para cada nivel. Solo podrás descargar el certificado al completar todas las lecciones asignadas.
            </p>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default Certificates;
