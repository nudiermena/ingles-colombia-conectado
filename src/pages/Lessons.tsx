import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { useTenant } from "@/hooks/useTenant";
import { useLessons, useLessonProgress, useAssignedLessonIds } from "@/hooks/useLessons";
import { supabase } from "@/integrations/supabase/client";
import { Search, Play, Clock, Star, ChevronRight, BookOpen, Loader2, AlertCircle, RefreshCw, ClipboardList } from "lucide-react";

const Lessons = () => {
  const { user } = useAuth();
  const location = useLocation();
  const { currentTenant, loading: tenantLoading, switchTenant, getRoleInTenant } = useTenant(user?.id);
  const navigate = useNavigate();
  
  // Get tenant from navigation state if available
  const [initialTenant] = useState(() => {
    const state = location.state as { selectedTenant?: any } | null;
    return state?.selectedTenant || null;
  });
  
  // Use initialTenant if available, otherwise use currentTenant from hook
  const activeTenant = initialTenant || currentTenant;
  
  const { lessons, loading: lessonsLoading, fetchLessons } = useLessons(activeTenant?.id || null);
  const { progress, getProgressForLesson } = useLessonProgress(user?.id, activeTenant?.id || null);
  const { assignedLessonIds, dueDateByLessonId, assignmentByLessonId, loading: assignedLoading } = useAssignedLessonIds(user?.id ?? undefined, activeTenant?.id ?? null);
  const roleInTenant = getRoleInTenant(activeTenant?.id ?? '');
  const [searchParams] = useSearchParams();
  const levelParam = searchParams.get("level")?.toUpperCase();
  const initialLevel = levelParam && ["A1", "A2", "B1", "B2"].includes(levelParam) ? levelParam : "Todos";
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLevel, setSelectedLevel] = useState(initialLevel);
  const [hasPlacementTestAssigned, setHasPlacementTestAssigned] = useState(false);
  const [hasPlacementTestCompleted, setHasPlacementTestCompleted] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(interval);
  }, []);

  const formatTimeLeft = (deadline: string | null) => {
    if (!deadline) return null;
    const ms = new Date(deadline).getTime() - now;
    if (ms <= 0) return { text: "Vencido", expired: true };
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));
    const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    if (days > 0) return { text: `Quedan ${days} día${days !== 1 ? "s" : ""}`, expired: false };
    if (hours > 0) return { text: `Quedan ${hours} h ${minutes} min`, expired: false };
    return { text: `Quedan ${minutes} min`, expired: false };
  };

  const isStudent = roleInTenant === 'student';
  const lessonsForUser = isStudent
    ? lessons.filter((l) => assignedLessonIds.includes(l.id))
    : lessons;

  // If we have initialTenant from navigation, set it in the hook
  useEffect(() => {
    if (initialTenant && (!currentTenant || currentTenant.id !== initialTenant.id)) {
      switchTenant(initialTenant);
    }
  }, [initialTenant, currentTenant, switchTenant]);

  useEffect(() => {
    // Wait for tenant to load before redirecting
    if (tenantLoading) return;
    
    if (!user) {
      navigate('/login');
    } else if (!activeTenant) {
      navigate('/tenant-select');
    }
  }, [user, activeTenant, tenantLoading, navigate]);

  useEffect(() => {
    if (!user?.id || !activeTenant?.id) return;
    (async () => {
      const [{ data: assigned }, { data: result }] = await Promise.all([
        (supabase as any)
          .from('placement_test_assignments')
          .select('id')
          .eq('user_id', user.id)
          .eq('tenant_id', activeTenant.id)
          .maybeSingle(),
        (supabase as any)
          .from('placement_test_results')
          .select('id')
          .eq('user_id', user.id)
          .eq('tenant_id', activeTenant.id)
          .maybeSingle(),
      ]);
      setHasPlacementTestAssigned(!!assigned);
      setHasPlacementTestCompleted(!!result);
    })();
  }, [user?.id, activeTenant?.id]);

  const filteredLessons = lessonsForUser.filter(lesson => {
    const matchesSearch = lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (lesson.objectives?.[0] || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = selectedLevel === "Todos" || lesson.level === selectedLevel;
    return matchesSearch && matchesLevel;
  });

  const getLessonProgress = (lessonId: string) => {
    const lessonProgress = getProgressForLesson(lessonId);
    return {
      completed: lessonProgress?.completed || false,
      progress: lessonProgress?.progress_percentage || 0,
    };
  };

  if (tenantLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Cargando organización...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!activeTenant) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8 flex items-center justify-center">
          <Card>
            <CardContent className="pt-6 text-center">
              <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Selecciona una Organización</h2>
              <p className="text-muted-foreground mb-4">
                Necesitas seleccionar una organización para ver las lecciones
              </p>
              <Button asChild>
                <Link to="/tenant-select">Seleccionar Organización</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  if (lessonsLoading || (isStudent && assignedLoading)) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Cargando lecciones...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
        <main className="container mx-auto px-4 py-8">
            {/* Header Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                    Mis Lecciones
                  </h1>
                  <p className="text-xl text-muted-foreground">
                    Explora el catálogo de lecciones de {activeTenant.name}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchLessons()}
                  disabled={lessonsLoading}
                  title="Refrescar lecciones"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${lessonsLoading ? 'animate-spin' : ''}`} />
                  Refrescar
                </Button>
              </div>
              <div className="text-sm text-muted-foreground">
                {isStudent
                  ? `${lessonsForUser.length} lección${lessonsForUser.length !== 1 ? 'es' : ''} asignada${lessonsForUser.length !== 1 ? 's' : ''}`
                  : `${lessons.length} lección${lessons.length !== 1 ? 'es' : ''} disponible${lessons.length !== 1 ? 's' : ''}`}
              </div>
            </div>

        {isStudent && hasPlacementTestAssigned && !hasPlacementTestCompleted && (
          <div className="mb-6 p-4 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-primary" />
              <span className="font-medium">Tienes un Test de Nivelación asignado. Realízalo para que tu profesor vea tu desempeño antes de asignarte lecciones.</span>
            </div>
            <Button asChild>
              <Link to="/placement-test">Ir al Test de Nivelación</Link>
            </Button>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Buscar lecciones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2 flex-wrap">
            {["Todos", "A1", "A2", "B1", "B2"].map((level) => (
              <Button
                key={level}
                variant={selectedLevel === level ? "default" : "outline"}
                onClick={() => setSelectedLevel(level)}
                size="sm"
              >
                {level}
              </Button>
            ))}
            {!(isStudent && hasPlacementTestCompleted) && (
              <Button variant="secondary" size="sm" asChild>
                <Link to="/placement-test">
                  <ClipboardList className="w-4 h-4 mr-2" />
                  Test de Nivelación
                </Link>
              </Button>
            )}
          </div>
        </div>

        {/* How it works: hide for students who already completed placement test */}
        {!(isStudent && hasPlacementTestCompleted) && (
          <div className="mb-6 p-4 rounded-lg bg-muted/50 border border-border text-sm text-muted-foreground">
            <strong className="text-foreground">Cómo usar:</strong> Haz clic en <strong>Comenzar</strong> o <strong>Repasar</strong> en cualquier tarjeta para abrir la lección. Dentro verás vocabulario, ejercicios y, en lecciones mejoradas, comprensión de lectura y auditiva. ¿No sabes tu nivel? Prueba el <Link to="/placement-test" className="text-primary font-medium hover:underline">Test de Nivelación</Link>.
          </div>
        )}

        {/* Lessons Grid */}
        {isStudent && lessonsForUser.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-muted/30 p-12 text-center">
            <p className="text-muted-foreground mb-2">No tienes lecciones asignadas.</p>
            <p className="text-sm text-muted-foreground">Pide a tu profesor que te asigne lecciones desde el panel de administración.</p>
          </div>
        ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLessons.map((lesson, index) => {
            const { completed, progress: lessonProgress } = getLessonProgress(lesson.id);
            const dueDate = dueDateByLessonId[lesson.id];
            const dueDateObj = dueDate ? new Date(dueDate) : null;
            const timeLeft = formatTimeLeft(dueDate);
            const assignment = assignmentByLessonId[lesson.id];
            const isSubmitted = !!assignment?.submitted_at;
            return (
              <Card 
                key={lesson.id} 
                className={`group hover:shadow-card transition-all duration-300 hover:scale-105 ${
                  completed ? 'bg-success/5 border-success/20' : ''
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader className="space-y-3">
                  <div className="flex items-start justify-between">
                    <Badge 
                      variant={lesson.level === "A1" ? "secondary" : lesson.level === "A2" ? "default" : "outline"}
                      className="w-fit"
                    >
                      {lesson.level}
                    </Badge>
                    {completed && (
                      <div className="w-6 h-6 bg-success rounded-full flex items-center justify-center">
                        <BookOpen className="w-3 h-3 text-success-foreground" />
                      </div>
                    )}
                    {isSubmitted && (
                      <Badge variant="secondary" className="bg-amber-500/10 text-amber-700 dark:text-amber-400">
                        Entregada
                      </Badge>
                    )}
                  </div>
                  
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    {lesson.title}
                  </CardTitle>
                  
                  <Badge variant="outline" className="w-fit">
                    {lesson.type}
                  </Badge>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {lesson.objectives?.[0] || "Lección de inglés"}
                  </p>
                  
                  {dueDate && (
                    <div className={`flex items-center gap-2 text-sm ${timeLeft?.expired ? "text-destructive" : "text-muted-foreground"}`}>
                      <Clock className="w-4 h-4" />
                      <span>{timeLeft?.text ?? `Límite: ${dueDateObj!.toLocaleDateString()}`}</span>
                    </div>
                  )}
                  
                  {lessonProgress > 0 && lessonProgress < 100 && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Progreso</span>
                        <span className="font-medium">{lessonProgress}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-gradient-primary h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${lessonProgress}%` }}
                        />
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{lesson.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-secondary text-secondary" />
                      <span>{lesson.rating.toFixed(1)}</span>
                    </div>
                  </div>

                  <Button 
                    variant={completed && !isSubmitted ? "success" : "lesson"} 
                    className="w-full group"
                    asChild
                  >
                    <Link 
                      to={`/leccion/${lesson.id}`} 
                      state={{ selectedTenant: activeTenant, restart: completed && !isSubmitted }}
                    >
                      <Play className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                      {isSubmitted ? "Ver (entregada)" : completed ? "Repasar" : "Comenzar"}
                      <ChevronRight className="w-4 h-4 ml-auto group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
        )}

        {filteredLessons.length === 0 && !(isStudent && lessonsForUser.length === 0) && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              {lessonsForUser.length === 0
                ? isStudent && assignedLessonIds.length === 0
                  ? "No tienes lecciones asignadas aún"
                  : "No hay lecciones disponibles"
                : "No se encontraron lecciones"}
            </h3>
            <p className="text-muted-foreground">
              {isStudent && assignedLessonIds.length === 0
                ? "Pide a tu profesor o administrador que te asigne lecciones."
                : lessonsForUser.length === 0
                  ? "Contacta a tu administrador para agregar lecciones"
                  : "Intenta con otros términos de búsqueda"}
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Lessons;