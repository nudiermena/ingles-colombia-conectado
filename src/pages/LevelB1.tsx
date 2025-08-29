import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { 
  BookOpen, 
  Lock, 
  Clock, 
  Star, 
  Users, 
  Target,
  Mic,
  FileText,
  Headphones,
  MessageCircle,
  Brain
} from "lucide-react";

const lessons = [
  {
    id: 1,
    title: "Expressing Opinions",
    description: "Aprende a expresar y defender tus opiniones",
    duration: "30 min",
    type: "Conversación",
    completed: false,
    locked: true
  },
  {
    id: 2,
    title: "Travel & Tourism",
    description: "Vocabulario y situaciones de viaje",
    duration: "28 min", 
    type: "Vocabulario",
    completed: false,
    locked: true
  },
  {
    id: 3,
    title: "Present Perfect",
    description: "Domina el presente perfecto y sus usos",
    duration: "35 min",
    type: "Gramática",
    completed: false,
    locked: true
  },
  {
    id: 4,
    title: "Job Interviews",
    description: "Prepárate para entrevistas laborales en inglés",
    duration: "40 min",
    type: "Conversación",
    completed: false,
    locked: true
  },
  {
    id: 5,
    title: "Describing Experiences",
    description: "Cuenta experiencias pasadas con detalle",
    duration: "25 min",
    type: "Conversación",
    completed: false,
    locked: true
  },
  {
    id: 6,
    title: "Conditional Sentences",
    description: "Situaciones hipotéticas y condicionales",
    duration: "38 min",
    type: "Gramática",
    completed: false,
    locked: true
  },
  {
    id: 7,
    title: "Academic Writing Basics",
    description: "Fundamentos de escritura académica",
    duration: "45 min",
    type: "Escritura",
    completed: false,
    locked: true
  },
  {
    id: 8,
    title: "Debate & Discussion",
    description: "Participa en debates y discusiones",
    duration: "50 min",
    type: "Conversación",
    completed: false,
    locked: true
  }
];

const skills = [
  { name: "Vocabulario Avanzado", progress: 0, icon: BookOpen },
  { name: "Fluidez Oral", progress: 0, icon: Mic },
  { name: "Gramática Compleja", progress: 0, icon: FileText },
  { name: "Comprensión Avanzada", progress: 0, icon: Headphones },
  { name: "Pensamiento Crítico", progress: 0, icon: Brain }
];

const LevelB1 = () => {
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
            <Badge variant="outline" className="text-lg px-4 py-2 border-primary text-primary">B1</Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Nivel B1 - Inglés Intermedio
          </h1>
          <p className="text-xl text-muted-foreground">
            Alcanza la independencia lingüística y domina conversaciones complejas
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
                <h3 className="font-semibold text-lg mb-2">Nivel Avanzado Bloqueado</h3>
                <p className="text-muted-foreground">
                  Completa los niveles A1 y A2 para acceder al contenido intermedio B1.
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link to="/nivel/a1">
                    Nivel A1
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/nivel/a2">
                    Nivel A2
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress Overview */}
        <Card className="mb-8 hover:shadow-card transition-all duration-300 opacity-75">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Progreso en B1
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
                <div className="text-3xl font-bold text-muted-foreground mb-2">8-10</div>
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
              <h2 className="text-2xl font-bold">Lecciones del Nivel B1</h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="w-4 h-4" />
                <span>+1,200 estudiantes en este nivel</span>
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
                <CardTitle className="text-lg">Habilidades B1</CardTitle>
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
                <CardTitle className="text-lg">Sobre el Nivel B1</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div>
                  <h4 className="font-semibold mb-2">¿Qué aprenderás?</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Vocabulario profesional y académico</li>
                    <li>• Estructuras gramaticales complejas</li>
                    <li>• Expresión de opiniones y argumentos</li>
                    <li>• Comprensión de textos especializados</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Al completar podrás:</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Participar en debates complejos</li>
                    <li>• Escribir textos académicos básicos</li>
                    <li>• Comprender películas y programas</li>
                    <li>• Desenvolverte en entornos profesionales</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Achievement Preview */}
            <Card className="bg-gradient-hero text-white border-0">
              <CardContent className="text-center py-6">
                <h3 className="font-bold mb-2">🏆 Certificación B1</h3>
                <p className="text-white/80 text-sm mb-4">
                  Obtén tu certificado oficial de inglés intermedio
                </p>
                <Button variant="secondary" size="sm" className="w-full" disabled>
                  Disponible al completar A1 y A2
                </Button>
              </CardContent>
            </Card>

            {/* Prerequisites */}
            <Card className="border-primary bg-primary/5">
              <CardContent className="py-6">
                <h3 className="font-bold mb-2 text-primary">Ruta de Aprendizaje</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-6 h-6 bg-success rounded-full flex items-center justify-center">
                      <span className="text-xs text-success-foreground font-bold">1</span>
                    </div>
                    <span className="text-success">Completar Nivel A1</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center">
                      <span className="text-xs text-muted-foreground font-bold">2</span>
                    </div>
                    <span className="text-muted-foreground">Completar Nivel A2</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center">
                      <span className="text-xs text-muted-foreground font-bold">3</span>
                    </div>
                    <span className="text-muted-foreground">Acceder a Nivel B1</span>
                  </div>
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

export default LevelB1;