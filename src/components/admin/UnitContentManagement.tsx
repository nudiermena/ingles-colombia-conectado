import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { FileText, Plus, Edit, Trash2, Loader2, BookOpen, List } from "lucide-react";
import type { Tenant } from "@/hooks/useTenant";

interface UnitContentManagementProps {
  currentTenant: Tenant | null;
}

interface Course {
  id: string;
  course_number: number;
  title: string;
}

interface Unit {
  id: string;
  course_id: string;
  unit_number: number | null;
  title: string;
  is_welcome_unit: boolean;
}

interface UnitContent {
  id: string;
  unit_id: string;
  content_type: string;
  title: string | null;
  content: any;
  order_index: number;
}

const CONTENT_TYPES = [
  { value: "vocabulary", label: "Vocabulario" },
  { value: "grammar", label: "Gramática" },
  { value: "listening", label: "Listening" },
  { value: "reading", label: "Reading" },
  { value: "speaking", label: "Speaking & Pronunciation" },
  { value: "writing", label: "Writing" },
  { value: "learning_for_life", label: "Learning for Life" },
  { value: "culture_clil", label: "Culture & CLIL/SDG" },
] as const;

const UnitContentManagement = ({ currentTenant }: UnitContentManagementProps) => {
  const { toast } = useToast();
  const [courses, setCourses] = useState<Course[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [contents, setContents] = useState<UnitContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingContent, setEditingContent] = useState<UnitContent | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [selectedUnitId, setSelectedUnitId] = useState<string>("");
  const [selectedContentType, setSelectedContentType] = useState<string>("vocabulary");
  const [formData, setFormData] = useState({
    content_type: "vocabulary",
    title: "",
    content: "",
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
      setSelectedUnitId("");
    }
  }, [selectedCourseId]);

  useEffect(() => {
    if (selectedUnitId) {
      fetchContents(selectedUnitId);
    } else {
      setContents([]);
    }
  }, [selectedUnitId]);

  const fetchCourses = async () => {
    if (!currentTenant) return;

    try {
      const { data, error } = await supabase
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
    try {
      const { data, error } = await supabase
        .from("units")
        .select("*")
        .eq("course_id", courseId)
        .order("is_welcome_unit", { ascending: false })
        .order("order_index", { ascending: true });

      if (error) throw error;
      setUnits(data || []);
      if (data && data.length > 0 && !selectedUnitId) {
        setSelectedUnitId(data[0].id);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudieron cargar las unidades",
        variant: "destructive",
      });
    }
  };

  const fetchContents = async (unitId: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("unit_content")
        .select("*")
        .eq("unit_id", unitId)
        .order("order_index", { ascending: true });

      if (error) throw error;
      setContents(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudieron cargar el contenido",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = (contentType?: string) => {
    if (!selectedUnitId) {
      toast({
        title: "Selecciona una unidad",
        description: "Primero selecciona un curso y una unidad",
        variant: "destructive",
      });
      return;
    }
    setIsEditing(false);
    setEditingContent(null);
    setFormData({
      content_type: contentType || selectedContentType,
      title: "",
      content: "",
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (content: UnitContent) => {
    setIsEditing(true);
    setEditingContent(content);
    setFormData({
      content_type: content.content_type,
      title: content.title || "",
      content: typeof content.content === "string" ? content.content : JSON.stringify(content.content, null, 2),
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUnitId) return;

    setIsSubmitting(true);
    try {
      let contentJson: any = {};
      
      // Try to parse as JSON, if fails, store as plain text
      try {
        contentJson = formData.content ? JSON.parse(formData.content) : {};
      } catch {
        // If not valid JSON, store as text in a structured format
        contentJson = { text: formData.content };
      }

      const contentData = {
        unit_id: selectedUnitId,
        content_type: formData.content_type,
        title: formData.title || null,
        content: contentJson,
        order_index: contents.length,
      };

      if (isEditing && editingContent) {
        const { error } = await supabase
          .from("unit_content")
          .update(contentData)
          .eq("id", editingContent.id);

        if (error) throw error;
        toast({
          title: "Contenido actualizado",
          description: "El contenido ha sido actualizado exitosamente",
        });
      } else {
        const { error } = await supabase.from("unit_content").insert(contentData);

        if (error) throw error;
        toast({
          title: "Contenido creado",
          description: "El contenido ha sido creado exitosamente",
        });
      }

      setIsDialogOpen(false);
      await fetchContents(selectedUnitId);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo guardar el contenido",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (contentId: string) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este contenido?")) {
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.from("unit_content").delete().eq("id", contentId);

      if (error) throw error;

      toast({
        title: "Contenido eliminado",
        description: "El contenido ha sido eliminado exitosamente",
      });

      if (selectedUnitId) {
        await fetchContents(selectedUnitId);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo eliminar el contenido",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getContentTypeLabel = (type: string) => {
    return CONTENT_TYPES.find((ct) => ct.value === type)?.label || type;
  };

  const selectedCourse = courses.find((c) => c.id === selectedCourseId);
  const selectedUnit = units.find((u) => u.id === selectedUnitId);

  const contentsByType = contents.reduce((acc, content) => {
    if (!acc[content.content_type]) {
      acc[content.content_type] = [];
    }
    acc[content.content_type].push(content);
    return acc;
  }, {} as Record<string, UnitContent[]>);

  if (!currentTenant) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <p className="text-muted-foreground">Selecciona una organización para gestionar contenido</p>
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
              <List className="w-5 h-5" />
              Gestión de Contenido de Unidades
            </CardTitle>
            <CardDescription>
              Administra el contenido (vocabulario, gramática, etc.) de las unidades
            </CardDescription>
          </div>
          <Button
            type="button"
            onClick={() => handleCreate()}
            disabled={!selectedUnitId}
          >
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Contenido
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 space-y-4">
          <div>
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
                    Options {course.course_number}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedCourseId && (
            <div>
              <Label htmlFor="unit-select" className="mb-2 block">
                Seleccionar Unidad
              </Label>
              <Select value={selectedUnitId} onValueChange={setSelectedUnitId}>
                <SelectTrigger id="unit-select">
                  <SelectValue placeholder="Selecciona una unidad" />
                </SelectTrigger>
                <SelectContent>
                  {units.map((unit) => (
                    <SelectItem key={unit.id} value={unit.id}>
                      {unit.is_welcome_unit ? "Welcome Unit" : `Unit ${unit.unit_number}`}: {unit.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {selectedUnit && (
            <div className="p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">
                  {selectedUnit.is_welcome_unit ? "Welcome Unit" : `Unit ${selectedUnit.unit_number}`}: {selectedUnit.title}
                </span>
              </div>
            </div>
          )}
        </div>

        {selectedUnitId && (
          <>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : contents.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No hay contenido creado para esta unidad.</p>
                <p className="text-sm mt-2">Crea contenido usando los botones de abajo.</p>
              </div>
            ) : (
              <Tabs value={selectedContentType} onValueChange={setSelectedContentType} className="w-full">
                <TabsList className="grid w-full grid-cols-4 mb-4">
                  {CONTENT_TYPES.map((type) => (
                    <TabsTrigger key={type.value} value={type.value} className="text-xs">
                      {type.label}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {CONTENT_TYPES.map((type) => (
                  <TabsContent key={type.value} value={type.value} className="space-y-2">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold">{type.label}</h3>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCreate(type.value)}
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Agregar {type.label}
                      </Button>
                    </div>
                    {contentsByType[type.value]?.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Título</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {contentsByType[type.value].map((content) => (
                            <TableRow key={content.id}>
                              <TableCell>{content.title || `Contenido ${type.label}`}</TableCell>
                              <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleEdit(content)}
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDelete(content.id)}
                                  >
                                    <Trash2 className="w-4 h-4 text-destructive" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="text-center py-4 text-muted-foreground text-sm">
                        No hay contenido de {type.label} aún.
                      </div>
                    )}
                  </TabsContent>
                ))}
              </Tabs>
            )}
          </>
        )}

        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) {
              setEditingContent(null);
              setFormData({
                content_type: selectedContentType,
                title: "",
                content: "",
              });
            }
          }}
        >
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {isEditing ? "Editar Contenido" : "Nuevo Contenido"}
              </DialogTitle>
              <DialogDescription>
                {isEditing
                  ? "Actualiza el contenido de la unidad"
                  : `Agrega nuevo contenido de ${getContentTypeLabel(formData.content_type)}`}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="content_type">Tipo de Contenido</Label>
                  <Select
                    value={formData.content_type}
                    onValueChange={(value) =>
                      setFormData({ ...formData, content_type: value })
                    }
                    disabled={isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CONTENT_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Título (Opcional)</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Ej: Jobs, Applying for a job"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">
                    Contenido (JSON o texto)
                    <span className="text-xs text-muted-foreground ml-2">
                      Puedes usar JSON estructurado o texto plano
                    </span>
                  </Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={12}
                    placeholder={
                      formData.content_type === "vocabulary"
                        ? '{"words": [{"english": "Hello", "spanish": "Hola", "pronunciation": "/həˈloʊ/"}]}'
                        : formData.content_type === "grammar"
                        ? '{"topic": "Question tags", "explanation": "...", "examples": [...]}'
                        : "Escribe el contenido aquí o usa JSON estructurado"
                    }
                    className="font-mono text-sm"
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

export default UnitContentManagement;
