import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { useLessons, type Lesson } from "@/hooks/useLessons";
import { seedLessonsForTenant } from "@/scripts/seedLessons";
import { seedCursoInglesLessonsForTenant } from "@/scripts/seedCursoInglesLessons";
import { BookOpen, Plus, Edit, Trash2, Loader2, Search, CheckCircle, Code2, CheckCircle2, AlertCircle, GripVertical } from "lucide-react";
import type { Tenant } from "@/hooks/useTenant";

interface LessonsManagementProps {
  currentTenant: Tenant | null;
}

const LessonsManagement = ({ currentTenant }: LessonsManagementProps) => {
  const { toast } = useToast();
  const { lessons, loading: lessonsLoading, createLesson, updateLesson, deleteLesson, fetchLessons } = useLessons(currentTenant?.id || null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("Todos");
  const [isLoading, setIsLoading] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [selectedLevels, setSelectedLevels] = useState<string[]>(['A1', 'A2', 'B1']);
  const [importSource, setImportSource] = useState<'default' | 'curso-ingles'>('default');
  const [isSeeding, setIsSeeding] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [importResult, setImportResult] = useState<{ success: number; errors: number; skipped: number; updated?: number; inserted?: number } | null>(null);
  const [jsonValidationError, setJsonValidationError] = useState<string | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [isReordering, setIsReordering] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    level: "A1",
    duration: "",
    difficulty: "Básico",
    type: "Vocabulario",
    objectives: "",
    content: "",
  });

  const handleCreate = () => {
    setIsEditing(false);
    setEditingLesson(null);
    setFormData({
      title: "",
      level: "A1",
      duration: "",
      difficulty: "Básico",
      type: "Vocabulario",
      objectives: "",
      content: "",
    });
    setJsonValidationError(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (lesson: Lesson) => {
    setIsEditing(true);
    setEditingLesson(lesson);
    setFormData({
      title: lesson.title,
      level: lesson.level,
      duration: lesson.duration,
      difficulty: lesson.difficulty,
      type: lesson.type,
      objectives: (lesson.objectives || []).join("\n"),
      content: JSON.stringify(lesson.content || {}, null, 2),
    });
    setJsonValidationError(null);
    setIsDialogOpen(true);
  };

  const handleFormatJSON = () => {
    try {
      if (!formData.content.trim()) {
        toast({
          title: "Error",
          description: "El campo JSON está vacío",
          variant: "destructive",
        });
        return;
      }
      const parsed = JSON.parse(formData.content);
      const formatted = JSON.stringify(parsed, null, 2);
      setFormData({ ...formData, content: formatted });
      setJsonValidationError(null);
      toast({
        title: "JSON formateado",
        description: "El JSON ha sido formateado correctamente",
      });
    } catch (error: any) {
      const errorMessage = error.message || "Error al formatear JSON";
      setJsonValidationError(errorMessage);
      toast({
        title: "Error de formato",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleValidateJSON = () => {
    try {
      if (!formData.content.trim()) {
        setJsonValidationError("El campo JSON está vacío");
        toast({
          title: "Error de validación",
          description: "El campo JSON está vacío",
          variant: "destructive",
        });
        return;
      }
      const parsed = JSON.parse(formData.content);
      
      // Basic structure validation
      if (typeof parsed !== 'object' || parsed === null) {
        throw new Error("El JSON debe ser un objeto");
      }

      // Check for common lesson content structure
      if (parsed.vocabulary && !Array.isArray(parsed.vocabulary)) {
        throw new Error("'vocabulary' debe ser un array");
      }
      
      if (parsed.exercises && !Array.isArray(parsed.exercises)) {
        throw new Error("'exercises' debe ser un array");
      }

      setJsonValidationError(null);
      toast({
        title: "JSON válido",
        description: "El JSON es válido y tiene la estructura correcta",
      });
    } catch (error: any) {
      const errorMessage = error.message || "Error al validar JSON";
      setJsonValidationError(errorMessage);
      toast({
        title: "Error de validación",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (lessonId: string) => {
    if (!confirm("¿Estás seguro de que deseas eliminar esta lección?")) {
      return;
    }

    setIsLoading(true);
    try {
      await deleteLesson(lessonId);
      toast({
        title: "Lección eliminada",
        description: "La lección ha sido eliminada exitosamente",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo eliminar la lección",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTenant) {
      toast({
        title: "Error",
        description: "No hay una organización seleccionada",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const objectives = formData.objectives
        .split("\n")
        .map(o => o.trim())
        .filter(o => o.length > 0);

      let content = {};
      try {
        content = formData.content ? JSON.parse(formData.content) : {};
      } catch {
        // If invalid JSON, use empty object
        content = {};
      }

      const lessonData = {
        title: formData.title,
        level: formData.level,
        duration: formData.duration,
        difficulty: formData.difficulty,
        type: formData.type,
        objectives,
        content,
        order_index: lessons.length,
      };

      if (isEditing && editingLesson) {
        await updateLesson(editingLesson.id, lessonData);
        toast({
          title: "Lección actualizada",
          description: "La lección ha sido actualizada exitosamente",
        });
      } else {
        await createLesson(lessonData);
        toast({
          title: "Lección creada",
          description: "La lección ha sido creada exitosamente",
        });
      }

      setIsDialogOpen(false);
      setFormData({
        title: "",
        level: "A1",
        duration: "",
        difficulty: "Básico",
        type: "Vocabulario",
        objectives: "",
        content: "",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Ocurrió un error",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form when dialog opens for creating new lesson
  useEffect(() => {
    if (isDialogOpen && !isEditing) {
      setFormData({
        title: "",
        level: "A1",
        duration: "",
        difficulty: "Básico",
        type: "Vocabulario",
        objectives: "",
        content: "",
      });
      setEditingLesson(null);
    }
  }, [isDialogOpen, isEditing]);

  const filteredLessons = lessons.filter((lesson) => {
    const matchesSearch =
      lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lesson.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = selectedLevel === "Todos" || lesson.level === selectedLevel;
    return matchesSearch && matchesLevel;
  });

  // Debug logging
  useEffect(() => {
    console.log('LessonsManagement Debug:', {
      totalLessons: lessons.length,
      selectedLevel,
      filteredCount: filteredLessons.length,
      lessonsByLevel: lessons.reduce((acc, l) => {
        acc[l.level] = (acc[l.level] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    });
  }, [lessons, selectedLevel, filteredLessons.length]);

  const handleLevelToggle = (level: string) => {
    setSelectedLevels(prev =>
      prev.includes(level)
        ? prev.filter(l => l !== level)
        : [...prev, level]
    );
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(index));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex == null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      return;
    }
    const draggedId = filteredLessons[draggedIndex].id;
    const dropId = filteredLessons[dropIndex].id;
    const fromIdx = lessons.findIndex((l) => l.id === draggedId);
    const toIdx = lessons.findIndex((l) => l.id === dropId);
    if (fromIdx === -1 || toIdx === -1) {
      setDraggedIndex(null);
      return;
    }
    const newOrder = [...lessons];
    const [item] = newOrder.splice(fromIdx, 1);
    newOrder.splice(toIdx, 0, item);
    setIsReordering(true);
    try {
      for (let i = 0; i < newOrder.length; i++) {
        await updateLesson(newOrder[i].id, { order_index: i });
      }
      await fetchLessons();
      toast({ title: "Orden actualizado", description: "La prioridad de las lecciones se ha guardado." });
    } catch (err: any) {
      toast({ title: "Error", description: err?.message || "No se pudo actualizar el orden", variant: "destructive" });
    } finally {
      setIsReordering(false);
      setDraggedIndex(null);
    }
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleImport = async () => {
    if (!currentTenant) {
      toast({
        title: "Error",
        description: "No hay organización seleccionada",
        variant: "destructive"
      });
      return;
    }

    if (importSource === 'curso-ingles') {
      // Import from curso-ingles.com
      setIsSeeding(true);
      setImportProgress(0);
      setImportResult(null);

      try {
        const progressInterval = setInterval(() => {
          setImportProgress(prev => Math.min(prev + 2, 90));
        }, 100);

        const seedResult = await seedCursoInglesLessonsForTenant(currentTenant.id);

        clearInterval(progressInterval);
        setImportProgress(100);
        setImportResult(seedResult);

        await fetchLessons();

        const updateMsg = seedResult.updated ? ` (${seedResult.updated} actualizadas)` : '';
        const insertMsg = seedResult.inserted ? ` (${seedResult.inserted} nuevas)` : '';
        toast({
          title: "¡Importación completada!",
          description: `Se procesaron ${seedResult.success} lecciones de curso-ingles.com exitosamente${updateMsg}${insertMsg}`,
        });
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Error al importar lecciones de curso-ingles.com",
          variant: "destructive"
        });
      } finally {
        setIsSeeding(false);
      }
      return;
    }

    // Default import (existing lessons)
    if (selectedLevels.length === 0) {
      toast({
        title: "Error",
        description: "Selecciona al menos un nivel",
        variant: "destructive"
      });
      return;
    }

    setIsSeeding(true);
    setImportProgress(0);
    setImportResult(null);

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setImportProgress(prev => Math.min(prev + 2, 90));
      }, 100);

      const seedResult = await seedLessonsForTenant(
        currentTenant.id,
        selectedLevels
      );

      clearInterval(progressInterval);
      setImportProgress(100);
      setImportResult(seedResult);

      // Refresh lessons after import
      await fetchLessons();

      toast({
        title: "¡Importación completada!",
        description: `Se importaron ${seedResult.success} lecciones exitosamente`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Error al importar lecciones",
        variant: "destructive"
      });
    } finally {
      setIsSeeding(false);
    }
  };

  if (!currentTenant) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <p className="text-muted-foreground">Selecciona una organización para gestionar lecciones</p>
        </CardContent>
      </Card>
    );
  }

  if (lessonsLoading) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" />
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
              Gestión de Lecciones
            </CardTitle>
            <CardDescription>
              Administra las lecciones disponibles en la plataforma
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Importar Lecciones
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Importar Lecciones</DialogTitle>
                  <DialogDescription>
                    Selecciona la fuente de lecciones que deseas importar. Las lecciones duplicadas se omitirán automáticamente.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  {/* Source Selection */}
                  <div className="space-y-3">
                    <Label className="text-base font-semibold">Fuente de Lecciones</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="source-default"
                          name="importSource"
                          value="default"
                          checked={importSource === 'default'}
                          onChange={(e) => setImportSource(e.target.value as 'default')}
                          disabled={isSeeding}
                          className="w-4 h-4"
                        />
                        <Label htmlFor="source-default" className="cursor-pointer flex-1">
                          <span className="font-medium">Lecciones Predeterminadas</span>
                          <span className="text-sm text-muted-foreground block">Lecciones básicas del sistema</span>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="source-curso-ingles"
                          name="importSource"
                          value="curso-ingles"
                          checked={importSource === 'curso-ingles'}
                          onChange={(e) => setImportSource(e.target.value as 'curso-ingles')}
                          disabled={isSeeding}
                          className="w-4 h-4"
                        />
                        <Label htmlFor="source-curso-ingles" className="cursor-pointer flex-1">
                          <span className="font-medium">Curso-Ingles.com (Nivel Básico A1)</span>
                          <span className="text-sm text-muted-foreground block">Lecciones de gramática básica con ejercicios</span>
                        </Label>
                      </div>
                    </div>
                  </div>

                  {/* Level Selection (only for default source) */}
                  {importSource === 'default' && (
                    <div className="space-y-4">
                      <Label className="text-base font-semibold">Niveles</Label>
                      {[
                        { value: 'A1', label: 'A1 (Básico)', count: 24 },
                        { value: 'A2', label: 'A2 (Intermedio)', count: 32 },
                        { value: 'B1', label: 'B1 (Avanzado)', count: 40 },
                        { value: 'B2', label: 'B2 (Avanzado Superior)', count: 0 },
                      ].map((level) => (
                        <div key={level.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={`import-${level.value}`}
                            checked={selectedLevels.includes(level.value)}
                            onCheckedChange={() => handleLevelToggle(level.value)}
                            disabled={isSeeding || level.count === 0}
                          />
                          <Label
                            htmlFor={`import-${level.value}`}
                            className="flex-1 cursor-pointer flex items-center justify-between"
                          >
                            <span>{level.label}</span>
                            <span className="text-sm text-muted-foreground">
                              {level.count > 0 ? `${level.count} lecciones` : 'No disponible'}
                            </span>
                          </Label>
                        </div>
                      ))}
                    </div>
                  )}

                  {importSource === 'curso-ingles' && (
                    <div className="p-4 bg-primary/10 rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        Se importarán <strong>10 lecciones de gramática A1</strong> de curso-ingles.com, incluyendo:
                      </p>
                      <ul className="list-disc list-inside mt-2 text-sm text-muted-foreground space-y-1">
                        <li>Pronombres (Personal, Possessives, Demonstrative, Reflexive)</li>
                        <li>Artículos (Definite, Indefinite)</li>
                        <li>Preposiciones (Place, Time, Movement)</li>
                      </ul>
                      <p className="text-xs text-muted-foreground mt-2">
                        Cada lección incluye vocabulario y ejercicios interactivos.
                      </p>
                    </div>
                  )}

                  {isSeeding && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Importando lecciones...</span>
                        <span>{importProgress}%</span>
                      </div>
                      <Progress value={importProgress} />
                    </div>
                  )}

                  {importResult && (
                    <div className="p-4 bg-muted rounded-lg space-y-2">
                      <div className="flex items-center gap-2 text-success">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-semibold">Importación completada</span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Exitosas</p>
                          <p className="text-2xl font-bold text-success">{importResult.success}</p>
                          {importResult.updated !== undefined && importResult.inserted !== undefined && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {importResult.updated} actualizadas, {importResult.inserted} nuevas
                            </p>
                          )}
                        </div>
                        <div>
                          <p className="text-muted-foreground">Errores</p>
                          <p className="text-2xl font-bold text-destructive">{importResult.errors}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Omitidas</p>
                          <p className="text-2xl font-bold text-muted-foreground">{importResult.skipped}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsImportDialogOpen(false)}
                    disabled={isSeeding}
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleImport}
                    disabled={isSeeding || (importSource === 'default' && selectedLevels.length === 0)}
                  >
                    {isSeeding ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Importando...
                      </>
                    ) : (
                      <>
                        <BookOpen className="w-4 h-4 mr-2" />
                        Importar Lecciones
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button type="button">
                  <Plus className="w-4 h-4 mr-2" />
                  Nueva Lección
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {isEditing ? "Editar Lección" : "Nueva Lección"}
                </DialogTitle>
                <DialogDescription>
                  {isEditing
                    ? "Actualiza la información de la lección"
                    : "Crea una nueva lección en la plataforma"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Título</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="level">Nivel</Label>
                      <Select
                        value={formData.level}
                        onValueChange={(value) =>
                          setFormData({ ...formData, level: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A1">A1</SelectItem>
                          <SelectItem value="A2">A2</SelectItem>
                          <SelectItem value="B1">B1</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="duration">Duración</Label>
                      <Input
                        id="duration"
                        value={formData.duration}
                        onChange={(e) =>
                          setFormData({ ...formData, duration: e.target.value })
                        }
                        placeholder="Ej: 20 min"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="difficulty">Dificultad</Label>
                      <Select
                        value={formData.difficulty}
                        onValueChange={(value) =>
                          setFormData({ ...formData, difficulty: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Básico">Básico</SelectItem>
                          <SelectItem value="Intermedio">Intermedio</SelectItem>
                          <SelectItem value="Avanzado">Avanzado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="type">Tipo</Label>
                      <Select
                        value={formData.type}
                        onValueChange={(value) =>
                          setFormData({ ...formData, type: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Vocabulario">Vocabulario</SelectItem>
                          <SelectItem value="Gramática">Gramática</SelectItem>
                          <SelectItem value="Conversación">Conversación</SelectItem>
                          <SelectItem value="Pronunciación">Pronunciación</SelectItem>
                          <SelectItem value="Evaluación">Evaluación</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="objectives">Objetivos (uno por línea)</Label>
                    <Textarea
                      id="objectives"
                      value={formData.objectives}
                      onChange={(e) =>
                        setFormData({ ...formData, objectives: e.target.value })
                      }
                      rows={4}
                      placeholder="Objetivo 1&#10;Objetivo 2&#10;..."
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="content">Contenido (JSON)</Label>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleFormatJSON}
                          className="h-8"
                        >
                          <Code2 className="w-4 h-4 mr-1" />
                          Formatear
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleValidateJSON}
                          className="h-8"
                        >
                          <CheckCircle2 className="w-4 h-4 mr-1" />
                          Validar
                        </Button>
                      </div>
                    </div>
                    <Textarea
                      id="content"
                      value={formData.content}
                      onChange={(e) => {
                        setFormData({ ...formData, content: e.target.value });
                        setJsonValidationError(null);
                      }}
                      rows={6}
                      placeholder='{"vocabulary": [...], "exercises": [...]}'
                      className={jsonValidationError ? "border-destructive" : ""}
                    />
                    {jsonValidationError ? (
                      <div className="flex items-start gap-2 p-2 rounded-md bg-destructive/10 text-destructive text-sm">
                        <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>{jsonValidationError}</span>
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground">
                        Formato JSON con vocabulary y exercises
                      </p>
                    )}
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
                  <Button type="submit" disabled={isLoading}>
                    {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    {isEditing ? "Actualizar" : "Crear"}
                  </Button>
                </DialogFooter>
              </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Buscar lecciones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            {["Todos", "A1", "A2", "B1"].map((level) => (
              <Button
                key={level}
                variant={selectedLevel === level ? "default" : "outline"}
                onClick={() => setSelectedLevel(level)}
                size="sm"
              >
                {level}
              </Button>
            ))}
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10"></TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Título</TableHead>
              <TableHead>Nivel</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Duración</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
                {filteredLessons.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="space-y-2">
                        <p className="text-muted-foreground">
                          {lessons.length === 0 
                            ? "No hay lecciones importadas aún" 
                            : selectedLevel === "Todos"
                            ? "No se encontraron lecciones"
                            : `No se encontraron lecciones para el nivel ${selectedLevel}`}
                        </p>
                        {lessons.length === 0 && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setIsImportDialogOpen(true)}
                          >
                            <BookOpen className="w-4 h-4 mr-2" />
                            Importar Lecciones Ahora
                          </Button>
                        )}
                        {lessons.length > 0 && selectedLevel !== "Todos" && (
                          <p className="text-xs text-muted-foreground">
                            Hay {lessons.length} lección{lessons.length !== 1 ? 'es' : ''} en total. 
                            Prueba con "Todos" o otro nivel.
                          </p>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
              filteredLessons.map((lesson, index) => (
                <TableRow
                  key={lesson.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`cursor-grab active:cursor-grabbing ${draggedIndex === index ? 'opacity-50' : ''}`}
                >
                  <TableCell className="w-10 p-1" onDragStart={(e) => e.stopPropagation()}>
                    <GripVertical className="w-4 h-4 text-muted-foreground" />
                  </TableCell>
                  <TableCell className="font-medium">{lesson.id}</TableCell>
                  <TableCell>{lesson.title}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                      {lesson.level}
                    </span>
                  </TableCell>
                  <TableCell>{lesson.type}</TableCell>
                  <TableCell>{lesson.duration}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(lesson)}
                        disabled={isReordering}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(lesson.id)}
                        disabled={isLoading || isReordering}
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
      </CardContent>
    </Card>
  );
};

export default LessonsManagement;

