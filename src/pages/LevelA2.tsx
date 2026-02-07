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
  Lock, 
  Clock, 
  Star, 
  Users, 
  Target,
  CheckCircle2,
  Mic,
  FileText,
  Headphones,
  MessageCircle
} from "lucide-react";

const lessons = [
  { id: 25, title: "Past Simple - Introducción", description: "Aprende a hablar sobre acciones pasadas", duration: "25 min", type: "Gramática", completed: false, locked: true },
  { id: 26, title: "Irregular Verbs - Part 1", description: "Los 50 verbos irregulares más comunes", duration: "30 min", type: "Gramática", completed: false, locked: true },
  { id: 27, title: "Describing People & Places", description: "Vocabulario para describir personas y lugares", duration: "20 min", type: "Vocabulario", completed: false, locked: true },
  { id: 28, title: "Making Requests", description: "Cómo hacer peticiones educadas en inglés", duration: "18 min", type: "Conversación", completed: false, locked: true },
  { id: 29, title: "Time Expressions", description: "Expresiones de tiempo para conversaciones", duration: "15 min", type: "Vocabulario", completed: false, locked: true },
  { id: 30, title: "Future Plans - Going to", description: "Habla sobre planes futuros usando 'going to'", duration: "22 min", type: "Gramática", completed: false, locked: true },
  { id: 31, title: "Shopping & Money", description: "Situaciones de compras y manejo de dinero", duration: "28 min", type: "Conversación", completed: false, locked: true },
  { id: 32, title: "Comparatives & Superlatives", description: "Bigger, the biggest - Comparar cosas", duration: "26 min", type: "Gramática", completed: false, locked: true },
  { id: 33, title: "Health & Body", description: "Habla sobre salud y síntomas", duration: "20 min", type: "Vocabulario", completed: false, locked: true },
  { id: 34, title: "At the Doctor", description: "Conversación médica básica", duration: "24 min", type: "Conversación", completed: false, locked: true },
  { id: 35, title: "Technology & Internet", description: "Vocabulario tecnológico moderno", duration: "18 min", type: "Vocabulario", completed: false, locked: true },
  { id: 36, title: "Modal Verbs - Can/Could", description: "Habilidades y posibilidades", duration: "25 min", type: "Gramática", completed: false, locked: true },
  { id: 37, title: "Transportation", description: "Medios de transporte y viajes", duration: "17 min", type: "Vocabulario", completed: false, locked: true },
  { id: 38, title: "At the Airport", description: "Check-in, boarding, customs", duration: "22 min", type: "Conversación", completed: false, locked: true },
  { id: 39, title: "Hobbies & Interests", description: "Habla sobre tus pasatiempos favoritos", duration: "19 min", type: "Conversación", completed: false, locked: true },
  { id: 40, title: "Past Continuous", description: "Acciones en progreso en el pasado", duration: "27 min", type: "Gramática", completed: false, locked: true },
  { id: 41, title: "Work & Occupations", description: "Profesiones y lugares de trabajo", duration: "20 min", type: "Vocabulario", completed: false, locked: true },
  { id: 42, title: "Job Interview Basics", description: "Preguntas comunes de entrevistas", duration: "25 min", type: "Conversación", completed: false, locked: true },
  { id: 43, title: "Irregular Verbs - Part 2", description: "Más verbos irregulares importantes", duration: "28 min", type: "Gramática", completed: false, locked: true },
  { id: 44, title: "Adverbs of Frequency", description: "Always, often, sometimes, never", duration: "16 min", type: "Gramática", completed: false, locked: true },
  { id: 45, title: "Sports & Activities", description: "Play, do, go + deportes", duration: "18 min", type: "Vocabulario", completed: false, locked: true },
  { id: 46, title: "Making Suggestions", description: "Let's, Why don't we, How about", duration: "21 min", type: "Conversación", completed: false, locked: true },
  { id: 47, title: "Prepositions of Time", description: "In, on, at para expresar tiempo", duration: "19 min", type: "Gramática", completed: false, locked: true },
  { id: 48, title: "Weather & Climate", description: "Descripciones detalladas del clima", duration: "17 min", type: "Vocabulario", completed: false, locked: true },
  { id: 49, title: "Email Writing Basics", description: "Estructura de correos formales", duration: "24 min", type: "Escritura", completed: false, locked: true },
  { id: 50, title: "Modal Verbs - Should/Must", description: "Consejos y obligaciones", duration: "26 min", type: "Gramática", completed: false, locked: true },
  { id: 51, title: "Emotions & Feelings", description: "Expresar sentimientos y emociones", duration: "18 min", type: "Vocabulario", completed: false, locked: true },
  { id: 52, title: "Social Events", description: "Invitaciones y celebraciones", duration: "22 min", type: "Conversación", completed: false, locked: true },
  { id: 53, title: "Present Perfect - Introduction", description: "Introducción al presente perfecto", duration: "30 min", type: "Gramática", completed: false, locked: true },
  { id: 54, title: "Environmental Issues", description: "Vocabulario sobre el medio ambiente", duration: "20 min", type: "Vocabulario", completed: false, locked: true },
  { id: 55, title: "Giving Directions Advanced", description: "Direcciones más complejas", duration: "23 min", type: "Conversación", completed: false, locked: true },
  { id: 56, title: "Repaso Final A2", description: "Evaluación integral del nivel A2", duration: "35 min", type: "Evaluación", completed: false, locked: true }
];

const skills = [
  { name: "Vocabulario Intermedio", progress: 0, icon: BookOpen },
  { name: "Pronunciación", progress: 0, icon: Mic },
  { name: "Gramática", progress: 0, icon: FileText },
  { name: "Conversación", progress: 0, icon: MessageCircle }
];

const LevelA2 = () => {
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
            <Badge variant="default" className="text-lg px-4 py-2">A2</Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Nivel A2 - Inglés Pre-Intermedio
          </h1>
          <p className="text-xl text-muted-foreground">
            Desarrolla conversaciones más complejas y expande tu vocabulario
          </p>
        </div>

        {/* Unlock Notice */}
        <Card className="mb-8 border-warning bg-warning/5">
          <CardContent className="py-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-warning rounded-full flex items-center justify-center">
                <Lock className="w-6 h-6 text-warning-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">Nivel Bloqueado</h3>
                <p className="text-muted-foreground">
                  Completa el nivel A1 (Fundamentos del Inglés) para desbloquear el contenido A2.
                </p>
              </div>
              <Button variant="outline" asChild>
                <Link to="/nivel/a1">
                  Ir a Nivel A1
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Progress Overview */}
        <Card className="mb-8 hover:shadow-card transition-all duration-300 opacity-75">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Progreso en A2
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-muted-foreground mb-2">{overallProgress}%</div>
                <p className="text-muted-foreground">Completado</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-muted-foreground mb-2">{completedLessons}</div>
                <p className="text-muted-foreground">Lecciones completadas</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-muted-foreground mb-2">6-8</div>
                <p className="text-muted-foreground">Semanas estimadas</p>
              </div>
            </div>
            <div className="mt-6">
              <Progress value={overallProgress} className="h-3 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Lessons List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Lecciones del Nivel A2</h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="w-4 h-4" />
                <span>{studentCount !== null ? `${studentCount} estudiante${studentCount !== 1 ? "s" : ""} en esta organización` : "—"}</span>
              </div>
            </div>

            <div className="space-y-4">
              {lessons.map((lesson, index) => (
                <Card 
                  key={lesson.id}
                  className="transition-all duration-300 opacity-60"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      {/* Lesson Number */}
                      <div className="w-12 h-12 rounded-full bg-muted text-muted-foreground flex items-center justify-center">
                        <Lock className="w-6 h-6" />
                      </div>

                      {/* Lesson Content */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg text-muted-foreground">{lesson.title}</h3>
                          <Badge variant="outline" className="text-xs opacity-50">
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
                            <Star className="w-4 h-4" />
                            <span>4.9</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Button */}
                      <Button variant="outline" disabled>
                        Bloqueado
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
            <Card className="hover:shadow-card transition-all duration-300 opacity-75">
              <CardHeader>
                <CardTitle className="text-lg">Habilidades A2</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {skills.map((skill, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <skill.icon className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium text-muted-foreground">{skill.name}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{skill.progress}%</span>
                    </div>
                    <Progress value={skill.progress} className="h-2 opacity-50" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Level Info */}
            <Card className="hover:shadow-card transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-lg">Sobre el Nivel A2</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div>
                  <h4 className="font-semibold mb-2">¿Qué aprenderás?</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Vocabulario ampliado de 1000+ palabras</li>
                    <li>• Tiempos verbales básicos (pasado y futuro)</li>
                    <li>• Conversaciones sobre temas familiares</li>
                    <li>• Descripción de experiencias pasadas</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Al completar podrás:</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Comunicarte en situaciones rutinarias</li>
                    <li>• Describir tu pasado y planes futuros</li>
                    <li>• Participar en conversaciones simples</li>
                    <li>• Comprender textos básicos</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Prerequisites */}
            <Card className="bg-gradient-hero text-white border-0">
              <CardContent className="text-center py-6">
                <h3 className="font-bold mb-2">Requisitos</h3>
                <p className="text-white/80 text-sm mb-4">
                  Completa el nivel A1 para acceder a este contenido
                </p>
                <Button variant="secondary" size="sm" className="w-full" asChild>
                  <Link to="/nivel/a1">
                    Comenzar Nivel A1
                  </Link>
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

export default LevelA2;