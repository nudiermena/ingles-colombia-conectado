import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { useTenant } from "@/hooks/useTenant";
import { useLessons, useLessonProgress } from "@/hooks/useLessons";
import { Search, Play, Clock, Star, ChevronRight, BookOpen, Loader2, AlertCircle, RefreshCw } from "lucide-react";

const Lessons = () => {
  const { user } = useAuth();
  const location = useLocation();
  const { currentTenant, loading: tenantLoading, switchTenant } = useTenant(user?.id);
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
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("Todos");

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

  const filteredLessons = lessons.filter(lesson => {
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

  if (lessonsLoading) {
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
              {lessons.length > 0 && (
                <div className="text-sm text-muted-foreground">
                  {lessons.length} lección{lessons.length !== 1 ? 'es' : ''} disponible{lessons.length !== 1 ? 's' : ''}
                </div>
              )}
            </div>

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
          
          <div className="flex gap-2">
            {["Todos", "A1", "A2", "B1"].map((level) => (
              <Button
                key={level}
                variant={selectedLevel === level ? "default" : "outline"}
                onClick={() => setSelectedLevel(level)}
                size="sm"
              >
                {level}
              </Button>
            ))}
          </div>
        </div>

        {/* Lessons Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLessons.map((lesson, index) => {
            const { completed, progress: lessonProgress } = getLessonProgress(lesson.id);
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
                    variant={completed ? "success" : "lesson"} 
                    className="w-full group"
                    asChild
                  >
                    <Link to={`/leccion/${lesson.id}`}>
                      <Play className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                      {completed ? "Repasar" : "Comenzar"}
                      <ChevronRight className="w-4 h-4 ml-auto group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredLessons.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              {lessons.length === 0 ? "No hay lecciones disponibles" : "No se encontraron lecciones"}
            </h3>
            <p className="text-muted-foreground">
              {lessons.length === 0 
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