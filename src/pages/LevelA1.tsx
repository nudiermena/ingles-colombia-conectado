import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useTenant } from "@/hooks/useTenant";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { 
  BookOpen, 
  Play, 
  Clock, 
  Star, 
  Users, 
  Target,
  CheckCircle2,
  Lock,
  Mic,
  FileText,
  Headphones
} from "lucide-react";

const lessons = [
  { id: 1, title: "Saludos y Despedidas", description: "Aprende las formas básicas de saludar y despedirte", duration: "15 min", type: "Vocabulario", completed: false, locked: false },
  { id: 2, title: "El Alfabeto en Inglés", description: "Domina la pronunciación del alfabeto inglés", duration: "10 min", type: "Pronunciación", completed: false, locked: false },
  { id: 3, title: "Números del 1 al 20", description: "Aprende a contar en inglés del 1 al 20", duration: "12 min", type: "Vocabulario", completed: false, locked: false },
  { id: 4, title: "Colores Básicos", description: "Vocabulario esencial de colores en inglés", duration: "8 min", type: "Vocabulario", completed: false, locked: false },
  { id: 5, title: "Pronombres Personales", description: "I, you, he, she, it, we, they", duration: "20 min", type: "Gramática", completed: false, locked: false },
  { id: 6, title: "Verbo 'To Be' - Presente", description: "Estructura básica del verbo ser/estar", duration: "25 min", type: "Gramática", completed: false, locked: false },
  { id: 7, title: "Días de la Semana", description: "Monday to Sunday - Vocabulario de días", duration: "10 min", type: "Vocabulario", completed: false, locked: false },
  { id: 8, title: "La Familia", description: "Vocabulario para hablar de tu familia", duration: "18 min", type: "Vocabulario", completed: false, locked: false },
  { id: 9, title: "Meses del Año", description: "January to December - Los 12 meses", duration: "12 min", type: "Vocabulario", completed: false, locked: false },
  { id: 10, title: "Adjetivos Básicos", description: "Describe personas, lugares y cosas", duration: "20 min", type: "Vocabulario", completed: false, locked: false },
  { id: 11, title: "Artículos: A, An, The", description: "Cuándo y cómo usar artículos en inglés", duration: "22 min", type: "Gramática", completed: false, locked: false },
  { id: 12, title: "Preguntas con WH", description: "What, Where, When, Who, Why, How", duration: "25 min", type: "Gramática", completed: false, locked: false },
  { id: 13, title: "El Clima y las Estaciones", description: "Habla sobre el tiempo y las estaciones", duration: "15 min", type: "Vocabulario", completed: false, locked: false },
  { id: 14, title: "Comida y Bebidas", description: "Vocabulario esencial de alimentos", duration: "18 min", type: "Vocabulario", completed: false, locked: false },
  { id: 15, title: "En el Restaurante", description: "Frases útiles para ordenar comida", duration: "20 min", type: "Conversación", completed: false, locked: false },
  { id: 16, title: "Las Partes del Cuerpo", description: "Head, shoulders, knees and toes...", duration: "14 min", type: "Vocabulario", completed: false, locked: false },
  { id: 17, title: "Presente Simple", description: "Rutinas y acciones habituales", duration: "28 min", type: "Gramática", completed: false, locked: false },
  { id: 18, title: "La Hora en Inglés", description: "Aprende a decir y preguntar la hora", duration: "16 min", type: "Vocabulario", completed: false, locked: false },
  { id: 19, title: "Lugares en la Ciudad", description: "Bank, hospital, supermarket, etc.", duration: "17 min", type: "Vocabulario", completed: false, locked: false },
  { id: 20, title: "Direcciones Básicas", description: "Turn left, go straight, turn right", duration: "19 min", type: "Conversación", completed: false, locked: false },
  { id: 21, title: "La Ropa", description: "Vocabulario de prendas de vestir", duration: "15 min", type: "Vocabulario", completed: false, locked: false },
  { id: 22, title: "Hobbies y Pasatiempos", description: "I like/love/enjoy + actividades", duration: "20 min", type: "Conversación", completed: false, locked: false },
  { id: 23, title: "En la Casa", description: "Habitaciones y muebles del hogar", duration: "18 min", type: "Vocabulario", completed: false, locked: false },
  { id: 24, title: "Repaso Final A1", description: "Ejercicios integradores del nivel", duration: "30 min", type: "Evaluación", completed: false, locked: false }
];

const skills = [
  { name: "Vocabulario Básico", progress: 15, icon: BookOpen },
  { name: "Pronunciación", progress: 8, icon: Mic },
  { name: "Gramática", progress: 0, icon: FileText },
  { name: "Comprensión Auditiva", progress: 5, icon: Headphones }
];

const LevelA1 = () => {
  const { user } = useAuth();
  const { currentTenant } = useTenant(user?.id);
  const [studentCount, setStudentCount] = useState<number | null>(null);

  useEffect(() => {
    if (!currentTenant?.id) {
      setStudentCount(null);
      return;
    }
    (async () => {
      const { count, error } = await (supabase as any)
        .from("user_roles")
        .select("*", { count: "exact", head: true })
        .eq("tenant_id", currentTenant.id)
        .eq("role", "student");
      if (!error) setStudentCount(count ?? 0);
      else setStudentCount(0);
    })();
  }, [currentTenant?.id]);

  const completedLessons = lessons.filter(lesson => lesson.completed).length;
  const totalLessons = lessons.length;
  const overallProgress = Math.round((completedLessons / totalLessons) * 100);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 animate-fade-in">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
              ← Volver
            </Link>
            <Badge variant="secondary" className="text-lg px-4 py-2">A1</Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Nivel A1 - Fundamentos del Inglés
          </h1>
          <p className="text-xl text-muted-foreground">
            Comienza tu aventura aprendiendo lo esencial del idioma inglés
          </p>
        </div>

        {/* Progress Overview */}
        <Card className="mb-8 hover:shadow-card transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Tu Progreso en A1
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">{overallProgress}%</div>
                <p className="text-muted-foreground">Completado</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-success mb-2">{completedLessons}</div>
                <p className="text-muted-foreground">Lecciones completadas</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-warning mb-2">4-6</div>
                <p className="text-muted-foreground">Semanas estimadas</p>
              </div>
            </div>
            <div className="mt-6">
              <Progress value={overallProgress} className="h-3" />
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Lessons List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Lecciones</h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="w-4 h-4" />
                <span>{studentCount !== null ? `${studentCount} estudiante${studentCount !== 1 ? "s" : ""} en esta organización` : "—"}</span>
              </div>
            </div>

            <div className="space-y-4">
              {lessons.map((lesson, index) => (
                <Card 
                  key={lesson.id}
                  className={`transition-all duration-300 hover:shadow-card group ${
                    lesson.completed 
                      ? 'bg-success/5 border-success/20' 
                      : lesson.locked 
                        ? 'opacity-60' 
                        : 'hover:scale-[1.02]'
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      {/* Lesson Number */}
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                        lesson.completed 
                          ? 'bg-success' 
                          : lesson.locked 
                            ? 'bg-muted text-muted-foreground' 
                            : 'bg-primary'
                      }`}>
                        {lesson.completed ? (
                          <CheckCircle2 className="w-6 h-6" />
                        ) : lesson.locked ? (
                          <Lock className="w-6 h-6" />
                        ) : (
                          <span>{lesson.id}</span>
                        )}
                      </div>

                      {/* Lesson Content */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">{lesson.title}</h3>
                          <Badge variant="outline" className="text-xs">
                            {lesson.type}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground text-sm mb-3">
                          {lesson.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{lesson.duration}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-secondary text-secondary" />
                            <span>4.8</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Button */}
                      <Button 
                        variant={
                          lesson.completed 
                            ? "success" 
                            : lesson.locked 
                              ? "outline" 
                              : "lesson"
                        }
                        disabled={lesson.locked}
                        className="group-hover:scale-105 transition-transform"
                        asChild={!lesson.locked}
                      >
                        {lesson.locked ? (
                          "Bloqueado"
                        ) : (
                          <Link 
                            to={`/leccion/${lesson.id}`} 
                            state={{ restart: lesson.completed }}
                          >
                            {lesson.completed ? (
                              "Repasar"
                            ) : (
                              <>
                                <Play className="w-4 h-4 mr-2" />
                                Comenzar
                              </>
                            )}
                          </Link>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Skills Progress */}
            <Card className="hover:shadow-card transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-lg">Habilidades A1</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {skills.map((skill, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <skill.icon className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">{skill.name}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{skill.progress}%</span>
                    </div>
                    <Progress value={skill.progress} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Level Info */}
            <Card className="hover:shadow-card transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-lg">Sobre el Nivel A1</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div>
                  <h4 className="font-semibold mb-2">¿Qué aprenderás?</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Vocabulario básico de 500+ palabras</li>
                    <li>• Estructuras gramaticales fundamentales</li>
                    <li>• Conversaciones simples</li>
                    <li>• Comprensión auditiva básica</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Al completar podrás:</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Presentarte en inglés</li>
                    <li>• Hacer preguntas básicas</li>
                    <li>• Entender instrucciones simples</li>
                    <li>• Describir situaciones cotidianas</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* CTA */}
            <Card className="bg-gradient-hero text-white border-0">
              <CardContent className="text-center py-6">
                <h3 className="font-bold mb-2">¿Necesitas ayuda?</h3>
                <p className="text-white/80 text-sm mb-4">
                  Nuestro equipo está aquí para apoyarte
                </p>
                <Button variant="secondary" size="sm" className="w-full">
                  Contactar Soporte
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LevelA1;