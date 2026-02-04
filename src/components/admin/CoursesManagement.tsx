import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { BookOpen, Plus, Edit, Trash2, Loader2 } from "lucide-react";
import type { Tenant } from "@/hooks/useTenant";

interface CoursesManagementProps {
  currentTenant: Tenant | null;
}

interface Course {
  id: string;
  course_number: number;
  title: string;
  cefr_level: string;
  cambridge_exam: string | null;
  description: string | null;
  hours_per_week: string | null;
  is_active: boolean;
  order_index: number;
}

const CoursesManagement = ({ currentTenant }: CoursesManagementProps) => {
  const { toast } = useToast();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    course_number: 1,
    title: "Options",
    cefr_level: "A1+",
    cambridge_exam: "",
    description: "",
    hours_per_week: "4-8/semana",
  });

  useEffect(() => {
    if (currentTenant) {
      fetchCourses();
    }
  }, [currentTenant]);

  const fetchCourses = async () => {
    if (!currentTenant) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("tenant_id", currentTenant.id)
        .order("course_number", { ascending: true });

      if (error) throw error;
      setCourses(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudieron cargar los cursos",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = () => {
    setIsEditing(false);
    setEditingCourse(null);
    setFormData({
      course_number: 1,
      title: "Options",
      cefr_level: "A1+",
      cambridge_exam: "",
      description: "",
      hours_per_week: "4-8/semana",
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (course: Course) => {
    setIsEditing(true);
    setEditingCourse(course);
    setFormData({
      course_number: course.course_number,
      title: course.title,
      cefr_level: course.cefr_level,
      cambridge_exam: course.cambridge_exam || "",
      description: course.description || "",
      hours_per_week: course.hours_per_week || "4-8/semana",
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTenant) return;

    setIsSubmitting(true);
    try {
      const courseData = {
        tenant_id: currentTenant.id,
        course_number: formData.course_number,
        title: formData.title,
        cefr_level: formData.cefr_level,
        cambridge_exam: formData.cambridge_exam || null,
        description: formData.description || null,
        hours_per_week: formData.hours_per_week || null,
      };

      if (isEditing && editingCourse) {
        const { error } = await supabase
          .from("courses")
          .update(courseData)
          .eq("id", editingCourse.id);

        if (error) throw error;
        toast({
          title: "Curso actualizado",
          description: "El curso ha sido actualizado exitosamente",
        });
      } else {
        const { error } = await supabase.from("courses").insert(courseData);

        if (error) throw error;
        toast({
          title: "Curso creado",
          description: "El curso ha sido creado exitosamente",
        });
      }

      setIsDialogOpen(false);
      await fetchCourses();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo guardar el curso",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (courseId: string) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este curso?")) {
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.from("courses").delete().eq("id", courseId);

      if (error) throw error;

      toast({
        title: "Curso eliminado",
        description: "El curso ha sido eliminado exitosamente",
      });

      await fetchCourses();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo eliminar el curso",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getCambridgeExamLabel = (level: string) => {
    const mapping: Record<string, string> = {
      "A1+": "Towards A2 Key for Schools",
      A2: "A2 Key for Schools",
      B1: "B1 Preliminary for Schools",
      "B1+": "Towards B2 First",
    };
    return mapping[level] || "";
  };

  if (!currentTenant) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <p className="text-muted-foreground">Selecciona una organización para gestionar cursos</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Gestión de Cursos Options
            </CardTitle>
            <CardDescription>
              Administra los cursos Options (1-4) para {currentTenant.name}
            </CardDescription>
          </div>
          <Button type="button" onClick={handleCreate}>
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Curso
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número</TableHead>
                <TableHead>Título</TableHead>
                <TableHead>Nivel CEFR</TableHead>
                <TableHead>Examen Cambridge</TableHead>
                <TableHead>Horas/Semana</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No hay cursos creados. Crea el primer curso Options.
                  </TableCell>
                </TableRow>
              ) : (
                courses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell className="font-medium">Options {course.course_number}</TableCell>
                    <TableCell>{course.title}</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                        {course.cefr_level}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {course.cambridge_exam || getCambridgeExamLabel(course.cefr_level)}
                    </TableCell>
                    <TableCell>{course.hours_per_week || "—"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(course)}
                          disabled={isLoading}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(course.id)}
                          disabled={isLoading}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}

        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) {
              setEditingCourse(null);
              setFormData({
                course_number: 1,
                title: "Options",
                cefr_level: "A1+",
                cambridge_exam: "",
                description: "",
                hours_per_week: "4-8/semana",
              });
            }
          }}
        >
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{isEditing ? "Editar Curso" : "Nuevo Curso"}</DialogTitle>
              <DialogDescription>
                {isEditing
                  ? "Actualiza la información del curso Options"
                  : "Crea un nuevo curso Options para la organización"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="course_number">Número de Curso</Label>
                  <Select
                    value={formData.course_number.toString()}
                    onValueChange={(value) =>
                      setFormData({ ...formData, course_number: parseInt(value) })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Options 1</SelectItem>
                      <SelectItem value="2">Options 2</SelectItem>
                      <SelectItem value="3">Options 3</SelectItem>
                      <SelectItem value="4">Options 4</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cefr_level">Nivel CEFR</Label>
                  <Select
                    value={formData.cefr_level}
                    onValueChange={(value) => setFormData({ ...formData, cefr_level: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A1+">A1+</SelectItem>
                      <SelectItem value="A2">A2</SelectItem>
                      <SelectItem value="B1">B1</SelectItem>
                      <SelectItem value="B1+">B1+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cambridge_exam">Examen Cambridge</Label>
                  <Input
                    id="cambridge_exam"
                    value={formData.cambridge_exam}
                    onChange={(e) =>
                      setFormData({ ...formData, cambridge_exam: e.target.value })
                    }
                    placeholder="Ej: Towards A2 Key for Schools"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hours_per_week">Horas por Semana</Label>
                  <Input
                    id="hours_per_week"
                    value={formData.hours_per_week}
                    onChange={(e) =>
                      setFormData({ ...formData, hours_per_week: e.target.value })
                    }
                    placeholder="Ej: 4-8/semana"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Descripción del curso"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {isEditing ? "Actualizar" : "Crear"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default CoursesManagement;
