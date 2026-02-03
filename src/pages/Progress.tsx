import { Link, useNavigate } from "react-router-dom";
import { useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { useTenant } from "@/hooks/useTenant";
import { useLessons, useLessonProgress } from "@/hooks/useLessons";
import { useAchievements } from "@/hooks/useAchievements";
import { Trophy, Target, Clock, TrendingUp, Star, Calendar, Award, Zap, Loader2, AlertCircle } from "lucide-react";

const ProgressPage = () => {
  const { user } = useAuth();
  const { currentTenant } = useTenant(user?.id);
  const navigate = useNavigate();
  const { lessons, loading: lessonsLoading } = useLessons(currentTenant?.id || null);
  const { progress, getOverallStats, loading: progressLoading } = useLessonProgress(user?.id, currentTenant?.id || null);
  const { achievements, loading: achievementsLoading } = useAchievements(user?.id, currentTenant?.id || null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (!currentTenant) {
      navigate('/tenant-select');
    }
  }, [user, currentTenant, navigate]);

  const stats = getOverallStats();

  // Calculate level progress
  const levelProgress = useMemo(() => {
    const levels = ['A1', 'A2', 'B1'];
    return levels.map(level => {
      const levelLessons = lessons.filter(l => l.level === level);
      const completedLevelLessons = progress.filter(p => {
        const lesson = lessons.find(l => l.id === p.lesson_id);
        return lesson?.level === level && p.completed;
      }).length;
      const progressPercent = levelLessons.length > 0 
        ? Math.round((completedLevelLessons / levelLessons.length) * 100)
        : 0;
      
      return {
        level,
        name: level === 'A1' ? 'Básico' : level === 'A2' ? 'Pre-Intermedio' : 'Intermedio',
        progress: progressPercent,
        color: level === 'A1' ? 'bg-success' : level === 'A2' ? 'bg-warning' : 'bg-primary',
      };
    });
  }, [lessons, progress]);

  // Calculate current level
  const currentLevel = useMemo(() => {
    const sorted = levelProgress.sort((a, b) => {
      const order = { 'A1': 1, 'A2': 2, 'B1': 3 };
      return (order[a.level as keyof typeof order] || 0) - (order[b.level as keyof typeof order] || 0);
    });
    const inProgress = sorted.find(l => l.progress > 0 && l.progress < 100);
    return inProgress || sorted.find(l => l.progress === 0) || sorted[0];
  }, [levelProgress]);

  // Calculate streak (simplified - would need daily tracking)
  const streakDays = useMemo(() => {
    // This is a simplified calculation - in production, you'd track daily activity
    const recentCompletions = progress
      .filter(p => p.completed_at)
      .map(p => new Date(p.completed_at!).toDateString())
      .filter((date, index, self) => self.indexOf(date) === index)
      .length;
    return Math.min(recentCompletions, 30); // Cap at 30 for demo
  }, [progress]);

  const achievementsList = [
    { 
      id: 'first_lesson', 
      title: "Primera Lección", 
      description: "Completaste tu primera lección", 
      icon: Star, 
      unlocked: achievements.some(a => a.achievement_type === 'first_lesson')
    },
    { 
      id: 'streak_7', 
      title: "Racha de 7 días", 
      description: "Estudia 7 días consecutivos", 
      icon: Calendar, 
      unlocked: achievements.some(a => a.achievement_type === 'streak_7_days')
    },
    { 
      id: 'level_a1', 
      title: "Maestro A1", 
      description: "Completa todo el nivel A1", 
      icon: Award, 
      unlocked: achievements.some(a => a.achievement_type === 'level_complete_a1')
    },
    { 
      id: 'speed', 
      title: "Speed Learner", 
      description: "Completa 5 lecciones en un día", 
      icon: Zap, 
      unlocked: achievements.some(a => a.achievement_type === 'speed_learner')
    }
  ];

  if (!currentTenant) {
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

  if (lessonsLoading || progressLoading || achievementsLoading) {
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
              <div className="text-2xl font-bold text-primary">{currentLevel?.level || 'A1'}</div>
              <p className="text-xs text-muted-foreground">
                {currentLevel?.progress || 0}% completado
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-card transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Racha Actual</CardTitle>
              <Calendar className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{streakDays}</div>
              <p className="text-xs text-muted-foreground">días consecutivos</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-card transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Lecciones</CardTitle>
              <Target className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedLessons}</div>
              <p className="text-xs text-muted-foreground">
                de {lessons.length} completadas
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-card transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tiempo Total</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalTimeHours.toFixed(1)}h</div>
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
                {levelProgress.map((level) => (
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
                    {stats.totalTimeMinutes} / 150 min
                  </span>
                </div>
                <Progress 
                  value={Math.min((stats.totalTimeMinutes / 150) * 100, 100)} 
                  className="h-3" 
                />
                <p className="text-sm text-muted-foreground">
                  {stats.totalTimeMinutes >= 150 
                    ? "¡Felicidades! Has cumplido tu meta semanal."
                    : "¡Sigue así! Vas por buen camino."}
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
              {achievementsList.map((achievement) => (
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