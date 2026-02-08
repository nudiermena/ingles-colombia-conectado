import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Clock, Star, Lock } from "lucide-react";
import { Link } from "react-router-dom";

interface LevelCardProps {
  level: string;
  title: string;
  description: string;
  progress: number;
  lessons: number;
  duration: string;
  difficulty: "Básico" | "Intermedio" | "Avanzado";
  isLocked?: boolean;
  isRecommended?: boolean;
}

const LevelCard = ({ 
  level, 
  title, 
  description, 
  progress, 
  lessons, 
  duration, 
  difficulty, 
  isLocked = false,
  isRecommended = false 
}: LevelCardProps) => {
  const difficultyColor = {
    "Básico": "bg-success/10 text-success border-success/20",
    "Intermedio": "bg-warning/10 text-warning border-warning/20",
    "Avanzado": "bg-destructive/10 text-destructive border-destructive/20"
  };

  return (
    <Card className={`relative overflow-hidden transition-all duration-300 hover:shadow-card group ${
      isLocked ? 'opacity-60' : 'hover:scale-105'
    }`}>
      {isRecommended && (
        <div className="absolute top-4 right-4 z-10">
          <Badge variant="default" className="bg-gradient-primary border-0">
            <Star className="w-3 h-3 mr-1" />
            Recomendado
          </Badge>
        </div>
      )}
      
      <CardHeader className="space-y-4 relative z-10">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-2xl font-bold text-primary group-hover:text-primary">{level}</p>
            <CardTitle className="text-lg group-hover:text-foreground">{title}</CardTitle>
          </div>
          {isLocked && <Lock className="w-5 h-5 text-muted-foreground" />}
        </div>
        
        <Badge className={`w-fit ${difficultyColor[difficulty]}`}>
          {difficulty}
        </Badge>
      </CardHeader>

      <CardContent className="space-y-6 relative z-10">
        <p className="text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors">{description}</p>
        
        {!isLocked && progress > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground group-hover:text-foreground transition-colors">Progreso</span>
              <span className="font-medium group-hover:text-foreground transition-colors">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        <div className="flex items-center gap-4 text-sm text-muted-foreground group-hover:text-foreground transition-colors">
          <div className="flex items-center gap-1">
            <BookOpen className="w-4 h-4" />
            <span>{lessons} lecciones</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{duration}</span>
          </div>
        </div>

        <Button 
          variant={isLocked ? "outline" : "lesson"} 
          className="w-full relative z-10"
          disabled={isLocked}
          asChild={!isLocked}
        >
          {!isLocked ? (
            <Link to={`/login?redirect=${encodeURIComponent(`/nivel/${level.toLowerCase()}`)}`}>
              {progress > 0 ? "Continuar" : "Comenzar"}
            </Link>
          ) : (
            "Próximamente"
          )}
        </Button>
      </CardContent>

      <div className="absolute inset-0 bg-gradient-card opacity-0 group-hover:opacity-30 transition-opacity pointer-events-none z-0" />
    </Card>
  );
};

export default LevelCard;