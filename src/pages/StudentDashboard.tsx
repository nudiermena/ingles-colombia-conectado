import { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { useTenant } from "@/hooks/useTenant";
import { useLessons, useLessonProgress } from "@/hooks/useLessons";
import { 
  BookOpen, 
  TrendingUp, 
  Trophy, 
  Target, 
  Clock, 
  Play, 
  Loader2,
  AlertCircle,
  ArrowRight,
  RefreshCw
} from "lucide-react";

const StudentDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const location = useLocation();
  const { currentTenant, loading: tenantLoading, switchTenant } = useTenant(user?.id);
  const navigate = useNavigate();
  
  // Get tenant from navigation state if available (immediate access)
  const [initialTenant] = useState(() => {
    const state = location.state as { selectedTenant?: any } | null;
    return state?.selectedTenant || null;
  });
  
  // Use initialTenant if available, otherwise use currentTenant from hook
  const activeTenant = initialTenant || currentTenant;
  
  const { lessons, loading: lessonsLoading, fetchLessons } = useLessons(activeTenant?.id || null);
  const { progress, getOverallStats } = useLessonProgress(user?.id, activeTenant?.id || null);
  
  // If we have initialTenant from navigation, set it in the hook
  useEffect(() => {
    if (initialTenant && (!currentTenant || currentTenant.id !== initialTenant.id)) {
      switchTenant(initialTenant);
    }
  }, [initialTenant, currentTenant, switchTenant]);

  useEffect(() => {
    // Wait for auth to finish loading before checking
    if (authLoading) {
      return;
    }

    // Only redirect if we're absolutely sure there's no user
    // Give it a moment in case auth state is still updating
    if (!user) {
      const timer = setTimeout(() => {
        // Double-check user is still null after a brief delay
        if (!user) {
          navigate('/login');
        }
      }, 100);
      return () => clearTimeout(timer);
    }
    
    // If we have a tenant (from state or hook), we're good
    if (activeTenant) {
      return;
    }
    
    // Only redirect if we're sure there's no tenant after loading completes
    if (!tenantLoading) {
      const timer = setTimeout(() => {
        if (!activeTenant && user) {
          navigate('/tenant-select');
        }
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [user, activeTenant, authLoading, tenantLoading, navigate]);

  const stats = getOverallStats();
  const recentLessons = lessons.slice(0, 3);
  const completedLessons = progress.filter(p => p.completed).length;
  const inProgressLessons = progress.filter(p => !p.completed && p.progress_percentage > 0).length;

  // Show loading state while auth is loading (but not tenant if we have it from state)
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Cargando...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Show loading only if we don't have tenant from navigation state
  if (!initialTenant && tenantLoading) {
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

  // Only show "no tenant" message if we're sure loading is complete
  if (!activeTenant && !tenantLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8 flex items-center justify-center">
          <Card>
            <CardContent className="pt-6 text-center">
              <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Selecciona una Organización</h2>
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

  if (lessonsLoading) {
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
            {/* Welcome Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                    ¡Bienvenido de vuelta!
                  </h1>
                  <p className="text-xl text-muted-foreground">
                    Continúa tu aprendizaje en {activeTenant.name}
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
            </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-card transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Lecciones Completadas</CardTitle>
              <Trophy className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{completedLessons}</div>
              <p className="text-xs text-muted-foreground">
                de {lessons.length} lecciones
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-card transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En Progreso</CardTitle>
              <TrendingUp className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{inProgressLessons}</div>
              <p className="text-xs text-muted-foreground">lecciones activas</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-card transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tiempo Total</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalTimeHours.toFixed(1)}h</div>
              <p className="text-xs text-muted-foreground">estudiando</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-card transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Progreso General</CardTitle>
              <Target className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageProgress}%</div>
              <p className="text-xs text-muted-foreground">promedio</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Continue Learning */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Continuar Aprendiendo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentLessons.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No hay lecciones disponibles aún
                </p>
              ) : (
                recentLessons.map((lesson) => {
                  const lessonProgress = progress.find(p => p.lesson_id === lesson.id);
                  const progressPercent = lessonProgress?.progress_percentage || 0;
                  return (
                    <div key={lesson.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{lesson.title}</h3>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="text-xs">{lesson.level}</Badge>
                            <Badge variant="secondary" className="text-xs">{lesson.type}</Badge>
                          </div>
                        </div>
                      </div>
                      {progressPercent > 0 && (
                        <div className="space-y-1 mb-3">
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Progreso</span>
                            <span className="font-medium">{progressPercent}%</span>
                          </div>
                          <Progress value={progressPercent} className="h-2" />
                        </div>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full" 
                        onClick={() => {
                          if (lesson?.id && activeTenant) {
                            navigate(`/leccion/${lesson.id}`, {
                              state: { selectedTenant: activeTenant }
                            });
                          } else {
                            console.error('Lesson ID or Tenant is missing:', { lesson, activeTenant });
                          }
                        }}
                      >
                        <Play className="w-4 h-4 mr-2" />
                        {progressPercent === 100 ? "Repasar" : progressPercent > 0 ? "Continuar" : "Comenzar"}
                      </Button>
                    </div>
                  );
                })
              )}
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  if (activeTenant) {
                    navigate('/lecciones', {
                      state: { selectedTenant: activeTenant }
                    });
                  } else {
                    navigate('/lecciones');
                  }
                }}
              >
                Ver Todas las Lecciones
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Accesos Rápidos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/lecciones">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Mis Lecciones
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/progreso">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Mi Progreso
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/certificados">
                    <Trophy className="w-4 h-4 mr-2" />
                    Certificados
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Progress Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Resumen de Progreso</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Lecciones Completadas</span>
                    <span className="font-semibold">{completedLessons}/{lessons.length}</span>
                  </div>
                  <Progress 
                    value={lessons.length > 0 ? (completedLessons / lessons.length) * 100 : 0} 
                    className="h-3" 
                  />
                </div>
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    {completedLessons === 0 
                      ? "¡Comienza tu primera lección para ver tu progreso!"
                      : completedLessons < lessons.length / 2
                      ? "¡Vas por buen camino! Sigue aprendiendo."
                      : "¡Excelente progreso! Estás cerca de completar todas las lecciones."}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default StudentDashboard;

