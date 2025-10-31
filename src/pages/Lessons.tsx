import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Search, Filter, Play, Clock, Star, ChevronRight, BookOpen } from "lucide-react";
import { lessonsData } from "@/data/lessonsData";

// Convert lessonsData to lessons array format
const lessons = Object.values(lessonsData).map((lesson, index) => ({
  id: lesson.id,
  title: lesson.title,
  description: lesson.objectives?.[0] || "Lección de inglés",
  level: lesson.level,
  duration: lesson.duration,
  difficulty: lesson.difficulty,
  rating: lesson.rating,
  completed: index < 3, // Mark first 3 as completed for demo
  type: lesson.type,
  progress: index < 3 ? 100 : index < 5 ? 65 : 0
}));

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
                
                {lesson.progress > 0 && lesson.progress < 100 && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Progreso</span>
                      <span className="font-medium">{lesson.progress}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-gradient-primary h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${lesson.progress}%` }}
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