import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { useTenant } from "@/hooks/useTenant";
import { supabase } from "@/integrations/supabase/client";
import { BookOpen, GraduationCap, Loader2, ArrowRight, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Course {
  id: string;
  course_number: number;
  title: string;
  cefr_level: string;
  cambridge_exam: string | null;
  description: string | null;
  hours_per_week: string | null;
}

interface CourseEnrollment {
  id: string;
  course_id: string;
  progress_percentage: number;
  course?: Course;
}

const Courses = () => {
  const { user } = useAuth();
  const { currentTenant } = useTenant(user?.id);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<CourseEnrollment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (currentTenant && user) {
      fetchCourses();
      fetchEnrollments();
    }
  }, [currentTenant, user]);

  const fetchCourses = async () => {
    if (!currentTenant) return;

    try {
      const { data, error } = await (supabase as any)
        .from("courses")
        .select("*")
        .eq("tenant_id", currentTenant.id)
        .eq("is_active", true)
        .order("course_number", { ascending: true });

      if (error) throw error;
      setCourses(data || []);
    } catch (error: any) {
      console.error("Error fetching courses:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEnrollments = async () => {
    if (!currentTenant || !user) return;

    try {
      const { data, error } = await (supabase as any)
        .from("course_enrollments")
        .select(`
          *,
          course:courses(*)
        `)
        .eq("tenant_id", currentTenant.id)
        .eq("user_id", user.id);

      if (error) throw error;
      setEnrollments(data || []);
    } catch (error: any) {
      console.error("Error fetching enrollments:", error);
    }
  };

  const handleEnroll = async (courseId: string) => {
    if (!currentTenant || !user) return;

    try {
      const { error } = await (supabase as any).from("course_enrollments").insert({
        user_id: user.id,
        tenant_id: currentTenant.id,
        course_id: courseId,
        enrolled_by: user.id,
      });

      if (error) throw error;

      toast({
        title: "Inscripción exitosa",
        description: "Te has inscrito al curso exitosamente",
      });

      await fetchEnrollments();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo inscribir al curso",
        variant: "destructive",
      });
    }
  };

  const getEnrollmentProgress = (courseId: string) => {
    const enrollment = enrollments.find((e) => e.course_id === courseId);
    return enrollment?.progress_percentage || 0;
  };

  const isEnrolled = (courseId: string) => {
    return enrollments.some((e) => e.course_id === courseId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                Cursos Options
              </h1>
              <p className="text-muted-foreground">
                Explora y accede a los cursos disponibles
              </p>
            </div>
          </div>
        </div>

        {courses.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">
                No hay cursos disponibles en este momento.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {courses.map((course) => {
              const enrolled = isEnrolled(course.id);
              const progress = getEnrollmentProgress(course.id);

              return (
                <Card key={course.id} className="flex flex-col">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-primary" />
                      </div>
                      {enrolled && (
                        <CheckCircle2 className="w-5 h-5 text-primary" />
                      )}
                    </div>
                    <CardTitle className="text-xl">
                      Options {course.course_number}
                    </CardTitle>
                    <CardDescription>
                      <div className="space-y-1 mt-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium">
                            {course.cefr_level}
                          </span>
                        </div>
                        {course.cambridge_exam && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {course.cambridge_exam}
                          </p>
                        )}
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    {enrolled && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-muted-foreground">Progreso</span>
                          <span className="font-medium">{progress}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>
                    )}

                    {course.description && (
                      <p className="text-sm text-muted-foreground mb-4 flex-1">
                        {course.description}
                      </p>
                    )}

                    <div className="mt-auto">
                      {enrolled ? (
                        <Button
                          className="w-full"
                          onClick={() => navigate(`/course/${course.id}`)}
                        >
                          Continuar Curso
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      ) : (
                        <Button
                          className="w-full"
                          onClick={() => handleEnroll(course.id)}
                        >
                          Inscribirse
                        </Button>
                      )}
                    </div>
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

export default Courses;
