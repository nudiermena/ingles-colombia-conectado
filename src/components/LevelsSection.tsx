import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GraduationCap, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import LevelCard from "./LevelCard";

const levels = [
  {
    level: "A1",
    title: "Fundamentos del Inglés",
    description: "Aprende lo básico: saludos, presentaciones, números, colores y vocabulario esencial para la vida cotidiana.",
    progress: 0,
    lessons: 24,
    duration: "4-6 semanas",
    difficulty: "Básico" as const,
    isRecommended: true
  },
  {
    level: "A2",
    title: "Inglés Pre-Intermedio",
    description: "Desarrolla conversaciones simples, habla sobre hobbies, familia, trabajo y planes futuros.",
    progress: 0,
    lessons: 32,
    duration: "6-8 semanas",
    difficulty: "Básico" as const,
    isLocked: true
  },
  {
    level: "B1",
    title: "Inglés Intermedio",
    description: "Expresa opiniones, maneja situaciones de viaje, describe experiencias y participa en debates sencillos.",
    progress: 0,
    lessons: 40,
    duration: "8-10 semanas",
    difficulty: "Intermedio" as const,
    isLocked: true
  }
];

const LevelsSection = () => {
  const navigate = useNavigate();

  const handlePlacementTest = () => {
    // Navigate to placement test page
    // For now, we'll create a simple modal or redirect to a test page
    // You can replace this with your actual placement test route
    navigate('/placement-test');
  };

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <Badge variant="secondary" className="w-fit mx-auto">
            <GraduationCap className="w-4 h-4 mr-2" />
            Rutas de Aprendizaje
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Elige tu nivel y 
            <span className="text-transparent bg-gradient-success bg-clip-text">
              {" "}comienza a crecer
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Desde principiante hasta intermedio, nuestras rutas están diseñadas 
            para llevarte paso a paso hacia la fluidez en inglés.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {levels.map((level, index) => (
            <LevelCard key={index} {...level} />
          ))}
        </div>

        <div className="mt-16 text-center space-y-4">
          <p className="text-muted-foreground">
            ¿No estás seguro de tu nivel actual?
          </p>
          <Button 
            variant="link" 
            className="text-primary font-semibold hover:text-primary/80 transition-colors"
            onClick={handlePlacementTest}
          >
            Toma nuestro test de nivelación gratuito
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default LevelsSection;