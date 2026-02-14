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
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Video, Plus, Edit, Trash2, Loader2, FileText, Music, Image } from "lucide-react";
import type { Tenant } from "@/hooks/useTenant";

interface CourseResourcesManagementProps {
  currentTenant: Tenant | null;
}

interface Course {
  id: string;
  course_number: number;
  title: string;
}

interface Unit {
  id: string;
  unit_number: number | null;
  title: string;
  is_welcome_unit: boolean;
}

interface Resource {
  id: string;
  course_id: string | null;
  unit_id: string | null;
  resource_type: string;
  title: string;
  description: string | null;
  url: string | null;
  file_path: string | null;
  duration_seconds: number | null;
  is_teacher_only: boolean;
  order_index: number;
}

const RESOURCE_TYPES = [
  { value: "video", label: "Video", icon: Video },
  { value: "audio", label: "Audio", icon: Music },
  { value: "pdf", label: "PDF", icon: FileText },
  { value: "ebook", label: "E-book", icon: FileText },
  { value: "image", label: "Imagen", icon: Image },
  { value: "interactive", label: "Interactivo", icon: FileText },
] as const;

const CourseResourcesManagement = ({ currentTenant }: CourseResourcesManagementProps) => {
  const { toast } = useToast();
  const [courses, setCourses] = useState<Course[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [selectedUnitId, setSelectedUnitId] = useState<string>("all");
  const [formData, setFormData] = useState({
    course_id: "",
    unit_id: "",
    resource_type: "video",
    title: "",
    description: "",
    url: "",
    duration_seconds: "",
    is_teacher_only: false,
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
      setResources([]);
    }
  }, [selectedCourseId]);

  useEffect(() => {
    if (selectedCourseId) {
      fetchResources(selectedCourseId, selectedUnitId === "all" ? null : selectedUnitId);
    } else {
      setResources([]);
    }
  }, [selectedCourseId, selectedUnitId]);

  const fetchCourses = async () => {
    if (!currentTenant) return;

    try {
      const { data, error } = await (supabase as any)
        .from("courses")
        .select("id, course_number, title")
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
    try {
      const { data, error } = await (supabase as any)
        .from("units")
        .select("id, unit_number, title, is_welcome_unit")
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
    }
  };

  const fetchResources = async (courseId: string, unitId: string | null) => {
    setIsLoading(true);
    try {
      let query = (supabase as any)
        .from("course_resources")
        .select("*")
        .eq("course_id", courseId)
        .order("order_index", { ascending: true });

      if (unitId) {
        query = query.eq("unit_id", unitId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setResources(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudieron cargar los recursos",
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
        description: "Primero selecciona un curso",
        variant: "destructive",
      });
      return;
    }
    setIsEditing(false);
    setEditingResource(null);
    setFormData({
      course_id: selectedCourseId,
      unit_id: selectedUnitId === "all" ? "" : selectedUnitId,
      resource_type: "video",
      title: "",
      description: "",
      url: "",
      duration_seconds: "",
      is_teacher_only: false,
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (resource: Resource) => {
    setIsEditing(true);
    setEditingResource(resource);
    setFormData({
      course_id: resource.course_id || selectedCourseId,
      unit_id: resource.unit_id || "",
      resource_type: resource.resource_type,
      title: resource.title,
      description: resource.description || "",
      url: resource.url || "",
      duration_seconds: resource.duration_seconds?.toString() || "",
      is_teacher_only: resource.is_teacher_only,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);
    try {
      const resourceData = {
        course_id: formData.course_id || null,
        unit_id: formData.unit_id || null,
        resource_type: formData.resource_type,
        title: formData.title,
        description: formData.description || null,
        url: formData.url || null,
        duration_seconds: formData.duration_seconds ? parseInt(formData.duration_seconds) : null,
        is_teacher_only: formData.is_teacher_only,
      };

      if (isEditing && editingResource) {
        const { error } = await (supabase as any)
          .from("course_resources")
          .update(resourceData)
          .eq("id", editingResource.id);

        if (error) throw error;
        toast({
          title: "Recurso actualizado",
          description: "El recurso ha sido actualizado exitosamente",
        });
      } else {
        const { error } = await (supabase as any).from("course_resources").insert(resourceData);

        if (error) throw error;
        toast({
          title: "Recurso creado",
          description: "El recurso ha sido creado exitosamente",
        });
      }

      setIsDialogOpen(false);
      if (selectedCourseId) {
        await fetchResources(selectedCourseId, selectedUnitId === "all" ? null : selectedUnitId);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo guardar el recurso",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (resourceId: string) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este recurso?")) return;

    setIsLoading(true);
    try {
      const { error } = await (supabase as any).from("course_resources").delete().eq("id", resourceId);

      if (error) throw error;

      toast({
        title: "Recurso eliminado",
        description: "El recurso ha sido eliminado exitosamente",
      });

      if (selectedCourseId) {
        await fetchResources(selectedCourseId, selectedUnitId === "all" ? null : selectedUnitId);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo eliminar el recurso",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getResourceTypeLabel = (type: string) => RESOURCE_TYPES.find((r) => r.value === type)?.label ?? type;

  if (!currentTenant) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <p className="text-muted-foreground">Selecciona una organización para gestionar recursos</p>
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
              <Video className="w-5 h-5" />
              Recursos del Curso
            </CardTitle>
            <CardDescription>
              Videos, audios, PDFs y otros recursos digitales por curso o unidad
            </CardDescription>
          </div>
          <Button type="button" onClick={handleCreate} disabled={!selectedCourseId}>
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Recurso
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 space-y-4">
          <div>
            <Label className="mb-2 block">Curso</Label>
            <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un curso" />
              </SelectTrigger>
              <SelectContent>
                {courses.map((course) => (
                  <SelectItem key={course.id} value={course.id}>
                    Options {course.course_number} - {course.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedCourseId && (
            <div>
              <Label className="mb-2 block">Unidad (opcional)</Label>
              <Select value={selectedUnitId} onValueChange={setSelectedUnitId}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las unidades</SelectItem>
                  {units.map((unit) => (
                    <SelectItem key={unit.id} value={unit.id}>
                      {unit.is_welcome_unit ? "Welcome" : `Unit ${unit.unit_number}`}: {unit.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tipo</TableHead>
                <TableHead>Título</TableHead>
                <TableHead>URL / Enlace</TableHead>
                <TableHead>Duración</TableHead>
                <TableHead>Solo docente</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {resources.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No hay recursos. Añade videos, audios o enlaces.
                  </TableCell>
                </TableRow>
              ) : (
                resources.map((res) => (
                  <TableRow key={res.id}>
                    <TableCell>
                      <span className="px-2 py-1 bg-muted rounded text-xs">
                        {getResourceTypeLabel(res.resource_type)}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium">{res.title}</TableCell>
                    <TableCell className="max-w-[200px] truncate text-muted-foreground">
                      {res.url || "—"}
                    </TableCell>
                    <TableCell>{res.duration_seconds ? `${res.duration_seconds}s` : "—"}</TableCell>
                    <TableCell>{res.is_teacher_only ? "Sí" : "No"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(res)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(res.id)}>
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
            if (!open) setEditingResource(null);
          }}
        >
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{isEditing ? "Editar Recurso" : "Nuevo Recurso"}</DialogTitle>
              <DialogDescription>
                Añade un enlace a video, audio, PDF o recurso externo
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Tipo</Label>
                  <Select
                    value={formData.resource_type}
                    onValueChange={(v) => setFormData({ ...formData, resource_type: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {RESOURCE_TYPES.map((r) => (
                        <SelectItem key={r.value} value={r.value}>
                          {r.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Título</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Unidad (opcional)</Label>
                  <Select
                    value={formData.unit_id || "none"}
                    onValueChange={(v) => setFormData({ ...formData, unit_id: v === "none" ? "" : v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Curso completo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Todo el curso</SelectItem>
                      {units.map((unit) => (
                        <SelectItem key={unit.id} value={unit.id}>
                          {unit.is_welcome_unit ? "Welcome" : `Unit ${unit.unit_number}`}: {unit.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>URL del recurso</Label>
                  <Input
                    type="url"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    placeholder="https://..."
                  />
                </div>

                <div className="space-y-2">
                  <Label>Duración (segundos, opcional)</Label>
                  <Input
                    type="number"
                    min={0}
                    value={formData.duration_seconds}
                    onChange={(e) => setFormData({ ...formData, duration_seconds: e.target.value })}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox
                    id="teacher_only"
                    checked={formData.is_teacher_only}
                    onCheckedChange={(c) => setFormData({ ...formData, is_teacher_only: !!c })}
                  />
                  <Label htmlFor="teacher_only">Solo visible para docentes</Label>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
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

export default CourseResourcesManagement;
