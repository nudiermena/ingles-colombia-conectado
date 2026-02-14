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
import { FileText, Plus, Edit, Trash2, Loader2, BookOpen, Download } from "lucide-react";
import type { Tenant } from "@/hooks/useTenant";
import { jsPDF } from "jspdf";

interface UnitsManagementProps {
  currentTenant: Tenant | null;
}

interface Course {
  id: string;
  course_number: number;
  title: string;
  cefr_level: string;
}

interface Unit {
  id: string;
  course_id: string;
  unit_number: number | null;
  title: string;
  is_welcome_unit: boolean;
  order_index: number;
  course?: Course;
}

const UnitsManagement = ({ currentTenant }: UnitsManagementProps) => {
  const { toast } = useToast();
  const [courses, setCourses] = useState<Course[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingUnit, setEditingUnit] = useState<Unit | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [downloadingPdfUnitId, setDownloadingPdfUnitId] = useState<string | null>(null);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [formData, setFormData] = useState({
    course_id: "",
    unit_number: "",
    title: "",
    is_welcome_unit: false,
  });

  useEffect(() => {
    if (currentTenant) {
      fetchCourses();
    }
  }, [currentTenant]);

  useEffect(() => {
    if (selectedCourseId) {
      fetchUnits(selectedCourseId);
    } else {
      setUnits([]);
    }
  }, [selectedCourseId]);

  const fetchCourses = async () => {
    if (!currentTenant) return;

    try {
      const { data, error } = await (supabase as any)
        .from("courses")
        .select("*")
        .eq("tenant_id", currentTenant.id)
        .order("course_number", { ascending: true });

      if (error) throw error;
      setCourses(data || []);
      if (data && data.length > 0 && !selectedCourseId) {
        setSelectedCourseId(data[0].id);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudieron cargar los cursos",
        variant: "destructive",
      });
    }
  };

  const fetchUnits = async (courseId: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await (supabase as any)
        .from("units")
        .select(`
          *,
          course:courses(*)
        `)
        .eq("course_id", courseId)
        .order("is_welcome_unit", { ascending: false })
        .order("order_index", { ascending: true });

      if (error) throw error;
      setUnits(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudieron cargar las unidades",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = () => {
    if (!selectedCourseId) {
      toast({
        title: "Selecciona un curso",
        description: "Primero selecciona un curso para crear unidades",
        variant: "destructive",
      });
      return;
    }
    setIsEditing(false);
    setEditingUnit(null);
    setFormData({
      course_id: selectedCourseId,
      unit_number: "",
      title: "",
      is_welcome_unit: false,
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (unit: Unit) => {
    setIsEditing(true);
    setEditingUnit(unit);
    setFormData({
      course_id: unit.course_id,
      unit_number: unit.unit_number?.toString() || "",
      title: unit.title,
      is_welcome_unit: unit.is_welcome_unit,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseId) return;

    setIsSubmitting(true);
    try {
      const unitData: any = {
        course_id: selectedCourseId,
        title: formData.title,
        is_welcome_unit: formData.is_welcome_unit,
        order_index: formData.is_welcome_unit ? 0 : parseInt(formData.unit_number) || 0,
      };

      if (!formData.is_welcome_unit) {
        unitData.unit_number = parseInt(formData.unit_number);
      } else {
        unitData.unit_number = null;
      }

      if (isEditing && editingUnit) {
        const { error } = await (supabase as any)
          .from("units")
          .update(unitData)
          .eq("id", editingUnit.id);

        if (error) throw error;
        toast({
          title: "Unidad actualizada",
          description: "La unidad ha sido actualizada exitosamente",
        });
      } else {
        const { error } = await (supabase as any).from("units").insert(unitData);

        if (error) throw error;
        toast({
          title: "Unidad creada",
          description: "La unidad ha sido creada exitosamente",
        });
      }

      setIsDialogOpen(false);
      await fetchUnits(selectedCourseId);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo guardar la unidad",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (unitId: string) => {
    if (!confirm("¿Estás seguro de que deseas eliminar esta unidad?")) {
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await (supabase as any).from("units").delete().eq("id", unitId);

      if (error) throw error;

      toast({
        title: "Unidad eliminada",
        description: "La unidad ha sido eliminada exitosamente",
      });

      if (selectedCourseId) {
        await fetchUnits(selectedCourseId);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo eliminar la unidad",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const downloadLessonPlanPdf = async (unit: Unit) => {
    setDownloadingPdfUnitId(unit.id);
    try {
      const { data: contentRows, error } = await (supabase as any)
        .from("unit_content")
        .select("content_type, title, content, order_index")
        .eq("unit_id", unit.id)
        .order("order_index", { ascending: true });

      if (error) throw error;

      const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const course = unit.course || selectedCourse;
      const courseLabel = course
        ? `Options ${course.course_number} - ${course.cefr_level}`
        : "Curso";

      let y = 20;
      doc.setFontSize(18);
      doc.text("Plan de clase", 20, y);
      y += 10;
      doc.setFontSize(12);
      doc.text(`Unidad: ${unit.title}`, 20, y);
      y += 7;
      doc.text(`Curso: ${courseLabel}`, 20, y);
      y += 7;
      doc.text(unit.is_welcome_unit ? "Tipo: Welcome Unit" : `Unidad ${unit.unit_number ?? ""}`, 20, y);
      y += 12;

      doc.setFontSize(14);
      doc.text("Contenido de la unidad", 20, y);
      y += 8;

      const contentTypes: Record<string, string> = {
        vocabulary: "Vocabulario",
        grammar: "Gramática",
        listening: "Comprensión auditiva",
        reading: "Comprensión de lectura",
        speaking: "Expresión oral",
        writing: "Expresión escrita",
        learning_for_life: "Learning for life",
        culture_clil: "Culture / CLIL",
      };

      (contentRows || []).forEach((row: { content_type: string; title?: string; order_index?: number }) => {
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
        doc.setFontSize(11);
        const typeLabel = contentTypes[row.content_type] || row.content_type;
        const title = row.title || typeLabel;
        doc.text(`• ${typeLabel}: ${title}`, 20, y);
        y += 6;
      });

      if (!contentRows?.length) {
        doc.setFontSize(10);
        doc.text("(Sin contenido registrado aún)", 25, y);
      }

      doc.save(`plan-clase-${unit.title.replace(/[^a-z0-9]/gi, "-").slice(0, 40)}.pdf`);
      toast({
        title: "PDF descargado",
        description: "Plan de clase listo para imprimir.",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.message || "No se pudo generar el PDF",
        variant: "destructive",
      });
    } finally {
      setDownloadingPdfUnitId(null);
    }
  };

  const selectedCourse = courses.find((c) => c.id === selectedCourseId);

  if (!currentTenant) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <p className="text-muted-foreground">Selecciona una organización para gestionar unidades</p>
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
              <FileText className="w-5 h-5" />
              Gestión de Unidades
            </CardTitle>
            <CardDescription>
              Administra las unidades de los cursos Options
            </CardDescription>
          </div>
          <Button type="button" onClick={handleCreate} disabled={!selectedCourseId}>
            <Plus className="w-4 h-4 mr-2" />
            Nueva Unidad
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Label htmlFor="course-select" className="mb-2 block">
            Seleccionar Curso
          </Label>
          <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
            <SelectTrigger id="course-select">
              <SelectValue placeholder="Selecciona un curso" />
            </SelectTrigger>
            <SelectContent>
              {courses.map((course) => (
                <SelectItem key={course.id} value={course.id}>
                  Options {course.course_number} - {course.cefr_level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedCourse && (
          <div className="mb-4 p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">
                Curso seleccionado: Options {selectedCourse.course_number} ({selectedCourse.cefr_level})
              </span>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tipo</TableHead>
                <TableHead>Número</TableHead>
                <TableHead>Título</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {units.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    {selectedCourseId
                      ? "No hay unidades creadas. Crea la primera unidad."
                      : "Selecciona un curso para ver sus unidades"}
                  </TableCell>
                </TableRow>
              ) : (
                units.map((unit) => (
                  <TableRow key={unit.id}>
                    <TableCell>
                      {unit.is_welcome_unit ? (
                        <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                          Welcome
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-muted rounded text-xs">Unidad</span>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">
                      {unit.is_welcome_unit ? "—" : unit.unit_number}
                    </TableCell>
                    <TableCell>{unit.title}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => downloadLessonPlanPdf(unit)}
                          disabled={isLoading || downloadingPdfUnitId === unit.id}
                          title="Descargar plan de clase (PDF)"
                        >
                          {downloadingPdfUnitId === unit.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Download className="w-4 h-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(unit)}
                          disabled={isLoading}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(unit.id)}
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
              setEditingUnit(null);
              setFormData({
                course_id: selectedCourseId,
                unit_number: "",
                title: "",
                is_welcome_unit: false,
              });
            }
          }}
        >
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{isEditing ? "Editar Unidad" : "Nueva Unidad"}</DialogTitle>
              <DialogDescription>
                {isEditing
                  ? "Actualiza la información de la unidad"
                  : "Crea una nueva unidad para el curso seleccionado"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="is_welcome_unit">Tipo de Unidad</Label>
                  <Select
                    value={formData.is_welcome_unit ? "welcome" : "regular"}
                    onValueChange={(value) =>
                      setFormData({ ...formData, is_welcome_unit: value === "welcome" })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="regular">Unidad Regular (1-8)</SelectItem>
                      <SelectItem value="welcome">Welcome Unit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {!formData.is_welcome_unit && (
                  <div className="space-y-2">
                    <Label htmlFor="unit_number">Número de Unidad</Label>
                    <Select
                      value={formData.unit_number}
                      onValueChange={(value) =>
                        setFormData({ ...formData, unit_number: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona el número" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            Unidad {num}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Ej: Feeling fine, The arts, Working life..."
                    required
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

export default UnitsManagement;
