import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Trophy, Target, Clock, TrendingUp, Star, Calendar, Award, Zap } from "lucide-react";

const progressData = {
  currentLevel: "A1",
  overallProgress: 65,
  streakDays: 12,
  totalLessons: 156,
  completedLessons: 42,
  totalHours: 28.5,
  weeklyGoal: 150, // minutes
  weeklyProgress: 120 // minutes
};

const achievements = [
  { id: 1, title: "Primera Lección", description: "Completaste tu primera lección", icon: Star, unlocked: true },
  { id: 2, title: "Racha de 7 días", description: "Estudia 7 días consecutivos", icon: Calendar, unlocked: true },
  { id: 3, title: "Maestro A1", description: "Completa todo el nivel A1", icon: Award, unlocked: false },
  { id: 4, title: "Speed Learner", description: "Completa 5 lecciones en un día", icon: Zap, unlocked: false }
];

const levelProgress = [
  { level: "A1", name: "Básico", progress: 65, color: "bg-success" },
  { level: "A2", name: "Pre-Intermedio", progress: 0, color: "bg-warning" },
  { level: "B1", name: "Intermedio", progress: 0, color: "bg-primary" }
];

const ProgressPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 animate-fade-in">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Mi Progreso
          </h1>
          <p className="text-xl text-muted-foreground">
            Seguimiento detallado de tu evolución en el aprendizaje
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-card transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Nivel Actual</CardTitle>
              <Trophy className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{progressData.currentLevel}</div>
              <p className="text-xs text-muted-foreground">
                {progressData.overallProgress}% completado
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-card transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Racha Actual</CardTitle>
              <Calendar className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{progressData.streakDays}</div>
              <p className="text-xs text-muted-foreground">días consecutivos</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-card transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Lecciones</CardTitle>
              <Target className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{progressData.completedLessons}</div>
              <p className="text-xs text-muted-foreground">
                de {progressData.totalLessons} completadas
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-card transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tiempo Total</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{progressData.totalHours}h</div>
              <p className="text-xs text-muted-foreground">estudiando inglés</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Level Progress */}
          <div className="space-y-6">
            <Card className="hover:shadow-card transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Progreso por Nivel
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {levelProgress.map((level, index) => (
                  <div key={level.level} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{level.level}</Badge>
                        <span className="font-medium">{level.name}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{level.progress}%</span>
                    </div>
                    <Progress value={level.progress} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Weekly Goal */}
            <Card className="hover:shadow-card transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-success" />
                  Meta Semanal
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Tiempo de estudio</span>
                  <span className="font-semibold">
                    {progressData.weeklyProgress} / {progressData.weeklyGoal} min
                  </span>
                </div>
                <Progress 
                  value={(progressData.weeklyProgress / progressData.weeklyGoal) * 100} 
                  className="h-3" 
                />
                <p className="text-sm text-muted-foreground">
                  ¡Excelente! Vas por buen camino para cumplir tu meta semanal.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Achievements */}
          <Card className="hover:shadow-card transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-warning" />
                Logros Obtenidos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {achievements.map((achievement) => (
                <div 
                  key={achievement.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-300 ${
                    achievement.unlocked 
                      ? 'bg-success/5 border-success/20' 
                      : 'bg-muted/30 border-muted opacity-60'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    achievement.unlocked ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'
                  }`}>
                    <achievement.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm">{achievement.title}</h3>
                    <p className="text-xs text-muted-foreground">{achievement.description}</p>
                  </div>
                  {achievement.unlocked && (
                    <Badge variant="secondary" className="text-xs">
                      ✓ Desbloqueado
                    </Badge>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Continue Learning CTA */}
        <Card className="mt-8 bg-gradient-hero text-white border-0">
          <CardContent className="text-center py-8">
            <h2 className="text-2xl font-bold mb-4">¡Sigue Aprendiendo!</h2>
            <p className="text-white/80 mb-6">
              Mantén tu racha y continúa progresando hacia la fluidez
            </p>
            <Button variant="secondary" size="lg" asChild>
              <Link to="/lecciones">
                Continuar con las Lecciones
              </Link>
            </Button>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default ProgressPage;