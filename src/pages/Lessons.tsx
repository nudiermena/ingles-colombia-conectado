import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Search, Filter, Play, Clock, Star, ChevronRight, BookOpen } from "lucide-react";

const lessons = [
  {
    id: 1,
    title: "Saludos y Presentaciones",
    description: "Aprende a saludar y presentarte en inglés de manera natural",
    level: "A1",
    duration: "15 min",
    difficulty: "Básico",
    rating: 4.8,
    completed: true,
    type: "Vocabulario"
  },
  {
    id: 2,
    title: "Números del 1 al 100",
    description: "Domina los números en inglés para situaciones cotidianas",
    level: "A1", 
    duration: "12 min",
    difficulty: "Básico",
    rating: 4.9,
    completed: true,
    type: "Gramática"
  },
  {
    id: 3,
    title: "La Familia en Inglés",
    description: "Vocabulario esencial para hablar sobre tu familia",
    level: "A1",
    duration: "18 min", 
    difficulty: "Básico",
    rating: 4.7,
    completed: false,
    type: "Vocabulario"
  },
  {
    id: 4,
    title: "Present Simple - Estructura",
    description: "Aprende la estructura básica del presente simple",
    level: "A1",
    duration: "20 min",
    difficulty: "Básico", 
    rating: 4.6,
    completed: false,
    type: "Gramática"
  },
  {
    id: 5,
    title: "Describing People",
    description: "Describe personas físicamente y su personalidad",
    level: "A2",
    duration: "25 min",
    difficulty: "Intermedio",
    rating: 4.8,
    completed: false,
    type: "Conversación"
  },
  {
    id: 6,
    title: "Past Tense Stories", 
    description: "Cuenta historias usando el pasado simple",
    level: "B1",
    duration: "30 min",
    difficulty: "Avanzado",
    rating: 4.9,
    completed: false,
    type: "Conversación"
  }
];

const Lessons = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("Todos");

  const filteredLessons = lessons.filter(lesson => {
    const matchesSearch = lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lesson.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = selectedLevel === "Todos" || lesson.level === selectedLevel;
    return matchesSearch && matchesLevel;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 animate-fade-in">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Mis Lecciones
          </h1>
          <p className="text-xl text-muted-foreground">
            Explora nuestro catálogo completo de lecciones interactivas
          </p>
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
          {filteredLessons.map((lesson, index) => (
            <Card 
              key={lesson.id} 
              className={`group hover:shadow-card transition-all duration-300 hover:scale-105 ${
                lesson.completed ? 'bg-success/5 border-success/20' : ''
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
                  {lesson.completed && (
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
                  {lesson.description}
                </p>
                
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{lesson.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-secondary text-secondary" />
                    <span>{lesson.rating}</span>
                  </div>
                </div>

                <Button 
                  variant={lesson.completed ? "success" : "lesson"} 
                  className="w-full group"
                  asChild
                >
                  <Link to={`/leccion/${lesson.id}`}>
                    <Play className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                    {lesson.completed ? "Repasar" : "Comenzar"}
                    <ChevronRight className="w-4 h-4 ml-auto group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredLessons.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No se encontraron lecciones</h3>
            <p className="text-muted-foreground">Intenta con otros términos de búsqueda</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Lessons;