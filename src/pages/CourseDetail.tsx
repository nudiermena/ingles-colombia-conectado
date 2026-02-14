import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { useTenant } from "@/hooks/useTenant";
import { supabase } from "@/integrations/supabase/client";
import {
  BookOpen,
  Loader2,
  ArrowRight,
  ArrowLeft,
  FileText,
  CheckCircle2,
  Circle,
} from "lucide-react";

interface Course {
  id: string;
  course_number: number;
  title: string;
  cefr_level: string;
  cambridge_exam: string | null;
  description: string | null;
}

interface Unit {
  id: string;
  unit_number: number | null;
  title: string;
  is_welcome_unit: boolean;
  order_index: number;
}

interface UnitProgress {
  unit_id: string;
  progress_percentage: number;
  completed: boolean;
}

const CourseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { currentTenant } = useTenant(user?.id);
  const [course, setCourse] = useState<Course | null>(null);
  const [units, setUnits] = useState<Unit[]>([]);
  const [unitProgress, setUnitProgress] = useState<Record<string, UnitProgress>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id && currentTenant) {
      fetchCourse();
      fetchUnits();
      if (user) fetchProgress();
    }
  }, [id, currentTenant, user]);

  const fetchCourse = async () => {
    if (!id) return;

    try {
      const { data, error } = await (supabase as any)
        .from("courses")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setCourse(data);
    } catch (error: any) {
      console.error("Error fetching course:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUnits = async () => {
    if (!id) return;

    try {
      const { data, error } = await (supabase as any)
        .from("units")
        .select("id, unit_number, title, is_welcome_unit, order_index")
        .eq("course_id", id)
        .order("is_welcome_unit", { ascending: false })
        .order("order_index", { ascending: true });

      if (error) throw error;
      setUnits(data || []);
    } catch (error: any) {
      console.error("Error fetching units:", error);
    }
  };

  const fetchProgress = async () => {
    if (!user || !currentTenant) return;

    try {
      const { data, error } = await (supabase as any)
        .from("unit_progress")
        .select("unit_id, progress_percentage, completed")
        .eq("user_id", user.id)
        .eq("tenant_id", currentTenant.id);

      if (error) throw error;

      const byUnit = (data || []).reduce((acc: Record<string, UnitProgress>, row: any) => {
        acc[row.unit_id] = {
          unit_id: row.unit_id,
          progress_percentage: row.progress_percentage,
          completed: row.completed,
        };
        return acc;
      }, {});
      setUnitProgress(byUnit);
    } catch (error: any) {
      console.error("Error fetching progress:", error);
    }
  };

  if (isLoading || !course) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const totalUnits = units.length;
  const completedUnits = Object.values(unitProgress).filter((p) => p.completed).length;
  const overallProgress = totalUnits > 0 ? Math.round((completedUnits / totalUnits) * 100) : 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate("/cursos")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a Cursos
        </Button>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Options {course.course_number} – {course.title}
              </h1>
              <p className="text-muted-foreground flex items-center gap-2 mt-1">
                <span className="px-2 py-0.5 bg-primary/10 text-primary rounded text-sm">
                  {course.cefr_level}
                </span>
                {course.cambridge_exam && (
                  <span className="text-sm">{course.cambridge_exam}</span>
                )}
              </p>
            </div>
          </div>

          {totalUnits > 0 && (
            <div className="max-w-md">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Progreso del curso</span>
                <span className="font-medium">{completedUnits}/{totalUnits} unidades</span>
              </div>
              <Progress value={overallProgress} className="h-2" />
            </div>
          )}
        </div>

        {units.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center text-muted-foreground">
              Este curso aún no tiene unidades publicadas.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {units.map((unit) => {
              const progress = unitProgress[unit.id];
              const completed = progress?.completed ?? false;
              const percent = progress?.progress_percentage ?? 0;

              return (
                <Card
                  key={unit.id}
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => navigate(`/course/${id}/unit/${unit.id}`)}
                >
                  <CardContent className="py-4 flex items-center gap-4">
                    <div className="flex-shrink-0">
                      {completed ? (
                        <CheckCircle2 className="w-8 h-8 text-primary" />
                      ) : (
                        <Circle className="w-8 h-8 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {unit.is_welcome_unit ? "Welcome Unit" : `Unit ${unit.unit_number}`}
                        </span>
                        <span className="text-muted-foreground">–</span>
                        <span className="text-muted-foreground truncate">{unit.title}</span>
                      </div>
                      {percent > 0 && !completed && (
                        <Progress value={percent} className="h-1.5 mt-2 max-w-[200px]" />
                      )}
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default CourseDetail;
