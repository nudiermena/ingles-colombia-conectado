import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
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
import { useTenant } from "@/hooks/useTenant";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Building2, Plus, Edit, Trash2, Loader2, BookOpen, Copy } from "lucide-react";
import type { Tenant } from "@/hooks/useTenant";

interface TenantsManagementProps {
  currentTenant: Tenant | null;
  currentUserRole?: 'admin' | 'teacher' | 'student' | null;
  onSwitchToLessons?: (tenantId: string) => void;
}

interface TenantLessonsStats {
  total: number;
  byLevel: Record<string, number>;
}

const TenantsManagement = ({ currentTenant, currentUserRole, onSwitchToLessons }: TenantsManagementProps) => {
  const { user } = useAuth();
  const { tenants: userTenants, refreshTenants, createTenant } = useTenant(user?.id);
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);
  const [formData, setFormData] = useState({ name: "", slug: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [lessonsStats, setLessonsStats] = useState<Record<string, TenantLessonsStats>>({});
  const [allTenants, setAllTenants] = useState<Tenant[]>([]);
  const [loadingAllTenants, setLoadingAllTenants] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [selectedTenantForAssignment, setSelectedTenantForAssignment] = useState<Tenant | null>(null);
  const [availableLessons, setAvailableLessons] = useState<any[]>([]);
  const [selectedLessons, setSelectedLessons] = useState<string[]>([]);
  const [isAssigning, setIsAssigning] = useState(false);

  const handleCreate = () => {
    setIsEditing(false);
    setEditingTenant(null);
    setFormData({ name: "", slug: "" });
    setIsDialogOpen(true);
  };

  const handleEdit = (tenant: Tenant) => {
    setIsEditing(true);
    setEditingTenant(tenant);
    setFormData({ name: tenant.name, slug: tenant.slug });
    setIsDialogOpen(true);
  };

  const handleDelete = async (tenantId: string) => {
    if (!confirm("¿Estás seguro de que deseas eliminar esta organización? Esta acción no se puede deshacer.")) {
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('tenants')
        .delete()
        .eq('id', tenantId);

      if (error) throw error;

      toast({
        title: "Organización eliminada",
        description: "La organización ha sido eliminada exitosamente",
      });

      await refreshTenants();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo eliminar la organización",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch ALL organizations for admins (not just ones they belong to)
  useEffect(() => {
    const fetchAllTenants = async () => {
      if (!user) return;
      
      setLoadingAllTenants(true);
      try {
        // Check if user is admin in any tenant
        const { data: adminRoles } = await supabase
          .from('user_roles')
          .select('tenant_id')
          .eq('user_id', user.id)
          .eq('role', 'admin')
          .limit(1);

        if (adminRoles && adminRoles.length > 0 && currentUserRole === 'admin') {
          // User is an admin, fetch ALL tenants (teachers only see their own)
          const { data: allTenantsData, error } = await supabase
            .from('tenants')
            .select('*')
            .order('created_at', { ascending: false });

          if (error) throw error;
          setAllTenants(Array.isArray(allTenantsData) ? allTenantsData : []);
        } else {
          // Not an admin, use user's tenants
          setAllTenants(Array.isArray(userTenants) ? userTenants : []);
        }
      } catch (error) {
        console.error('Error fetching all tenants:', error);
        setAllTenants(Array.isArray(userTenants) ? userTenants : []);
      } finally {
        setLoadingAllTenants(false);
      }
    };

    fetchAllTenants();
  }, [user, userTenants, currentUserRole]);

  // Fetch lessons stats for all tenants
  useEffect(() => {
    const fetchLessonsStats = async () => {
      const tenantsToCheck = allTenants.length > 0 ? allTenants : userTenants;
      if (tenantsToCheck.length === 0) return;

      const tenantIds = tenantsToCheck.map(t => t.id);
      
      try {
        const { data, error } = await supabase
          .from('lessons')
          .select('tenant_id, level')
          .in('tenant_id', tenantIds)
          .eq('is_active', true);

        if (error) throw error;

        // Group by tenant and level
        const stats: Record<string, TenantLessonsStats> = {};
        tenantIds.forEach(id => {
          stats[id] = { total: 0, byLevel: {} };
        });

        data?.forEach((lesson: any) => {
          if (!stats[lesson.tenant_id]) {
            stats[lesson.tenant_id] = { total: 0, byLevel: {} };
          }
          stats[lesson.tenant_id].total++;
          stats[lesson.tenant_id].byLevel[lesson.level] = 
            (stats[lesson.tenant_id].byLevel[lesson.level] || 0) + 1;
        });

        setLessonsStats(stats);
      } catch (error) {
        console.error('Error fetching lessons stats:', error);
      }
    };

    fetchLessonsStats();
  }, [allTenants, userTenants]);

  // Fetch available lessons from all organizations for assignment
  const fetchAvailableLessons = async () => {
    try {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('is_active', true)
        .order('level', { ascending: true })
        .order('order_index', { ascending: true });

      if (error) throw error;
      setAvailableLessons(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudieron cargar las lecciones",
        variant: "destructive"
      });
    }
  };

  const handleAssignLessons = (tenant: Tenant) => {
    setSelectedTenantForAssignment(tenant);
    setSelectedLessons([]);
    setIsAssignDialogOpen(true);
    fetchAvailableLessons();
  };

  const handleAssignLessonsToTenant = async () => {
    if (!selectedTenantForAssignment || selectedLessons.length === 0) {
      toast({
        title: "Error",
        description: "Selecciona al menos una lección",
        variant: "destructive"
      });
      return;
    }

    setIsAssigning(true);
    try {
      // Get lessons to copy
      const lessonsToCopy = availableLessons.filter(l => selectedLessons.includes(l.id));
      
      // Copy lessons to the target tenant
      const lessonsToInsert = lessonsToCopy.map(lesson => ({
        tenant_id: selectedTenantForAssignment.id,
        title: lesson.title,
        level: lesson.level,
        duration: lesson.duration,
        difficulty: lesson.difficulty,
        rating: lesson.rating || 0,
        type: lesson.type,
        objectives: lesson.objectives || [],
        content: lesson.content || {},
        order_index: lesson.order_index || 0,
        is_active: true,
      }));

      // Check for duplicates first
      const { data: existingLessons } = await supabase
        .from('lessons')
        .select('title, level')
        .eq('tenant_id', selectedTenantForAssignment.id);

      const existingTitles = new Set(
        existingLessons?.map((l: any) => `${l.title}::${l.level}`) || []
      );

      // Filter out duplicates
      const uniqueLessons = lessonsToInsert.filter(lesson => {
        const uniqueKey = `${lesson.title}::${lesson.level}`;
        return !existingTitles.has(uniqueKey);
      });

      if (uniqueLessons.length === 0) {
        toast({
          title: "Info",
          description: "Todas las lecciones seleccionadas ya existen en esta organización",
        });
        setIsAssignDialogOpen(false);
        return;
      }

      // Insert in batches
      const batchSize = 10;
      let inserted = 0;
      for (let i = 0; i < uniqueLessons.length; i += batchSize) {
        const batch = uniqueLessons.slice(i, i + batchSize);
        const { error } = await supabase
          .from('lessons')
          .insert(batch);

        if (error) throw error;
        inserted += batch.length;
      }

      toast({
        title: "¡Lecciones asignadas!",
        description: `Se asignaron ${inserted} lección${inserted !== 1 ? 'es' : ''} a ${selectedTenantForAssignment.name}`,
      });

      // Refresh stats
      const tenantIds = allTenants.length > 0 ? allTenants.map(t => t.id) : userTenants.map(t => t.id);
      const { data: updatedStats } = await supabase
        .from('lessons')
        .select('tenant_id, level')
        .in('tenant_id', tenantIds)
        .eq('is_active', true);

      if (updatedStats) {
        const stats: Record<string, TenantLessonsStats> = {};
        tenantIds.forEach(id => {
          stats[id] = { total: 0, byLevel: {} };
        });

        updatedStats.forEach((lesson: any) => {
          if (!stats[lesson.tenant_id]) {
            stats[lesson.tenant_id] = { total: 0, byLevel: {} };
          }
          stats[lesson.tenant_id].total++;
          stats[lesson.tenant_id].byLevel[lesson.level] = 
            (stats[lesson.tenant_id].byLevel[lesson.level] || 0) + 1;
        });

        setLessonsStats(stats);
      }

      setIsAssignDialogOpen(false);
      setSelectedLessons([]);
      setSelectedTenantForAssignment(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudieron asignar las lecciones",
        variant: "destructive"
      });
    } finally {
      setIsAssigning(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isEditing && editingTenant) {
        const { error } = await supabase
          .from('tenants')
          .update({ name: formData.name, slug: formData.slug })
          .eq('id', editingTenant.id);

        if (error) throw error;

        toast({
          title: "Organización actualizada",
          description: "La organización ha sido actualizada exitosamente",
        });
      } else {
        const { error } = await createTenant(formData.name, formData.slug);
        if (error) throw error;

        toast({
          title: "Organización creada",
          description: "La organización ha sido creada exitosamente",
        });
      }

      setIsDialogOpen(false);
      setFormData({ name: "", slug: "" });
      await refreshTenants();
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

  const handleManageLessons = (tenantId: string) => {
    if (onSwitchToLessons) {
      onSwitchToLessons(tenantId);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Gestión de Organizaciones
            </CardTitle>
            <CardDescription>
              {currentUserRole === 'teacher'
                ? 'Tu organización'
                : 'Administra las organizaciones de tu plataforma'}
            </CardDescription>
          </div>
          {currentUserRole === 'admin' && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleCreate}>
                <Plus className="w-4 h-4 mr-2" />
                Nueva Organización
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {isEditing ? "Editar Organización" : "Nueva Organización"}
                </DialogTitle>
                <DialogDescription>
                  {isEditing
                    ? "Actualiza la información de la organización"
                    : "Crea una nueva organización en la plataforma"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          name: e.target.value,
                          slug: isEditing
                            ? formData.slug
                            : e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
                        });
                      }}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug (Identificador)</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) =>
                        setFormData({ ...formData, slug: e.target.value })
                      }
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Usado en URLs, debe ser único
                    </p>
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
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Lecciones</TableHead>
              <TableHead>Fecha de Creación</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(() => {
              const tenantsToShow = Array.isArray(allTenants) && allTenants.length > 0 
                ? allTenants 
                : (Array.isArray(userTenants) ? userTenants : []);
              if (!tenantsToShow || tenantsToShow.length === 0) {
                return (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No hay organizaciones registradas
                    </TableCell>
                  </TableRow>
                );
              }
              return tenantsToShow.map((tenant) => {
                const stats = lessonsStats[tenant.id] || { total: 0, byLevel: {} };
                const isUserTenant = userTenants.some(t => t.id === tenant.id);
                return (
                  <TableRow key={tenant.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {tenant.id === currentTenant?.id && (
                          <span className="w-2 h-2 bg-primary rounded-full" />
                        )}
                        {tenant.name}
                        {!isUserTenant && (
                          <span className="text-xs px-1.5 py-0.5 bg-muted rounded" title="No eres miembro de esta organización">
                            Externa
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>@{tenant.slug}</TableCell>
                    <TableCell>
                      {stats.total > 0 ? (
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium">{stats.total} lecciones</span>
                          </div>
                          <div className="flex gap-1 flex-wrap">
                            {Object.entries(stats.byLevel).map(([level, count]) => (
                              <span
                                key={level}
                                className="text-xs px-1.5 py-0.5 bg-primary/10 text-primary rounded"
                              >
                                {level}: {count}
                              </span>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">Sin lecciones</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(tenant.created_at || '').toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {currentUserRole === 'admin' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleAssignLessons(tenant)}
                            title="Asignar lecciones"
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        )}
                        {onSwitchToLessons && isUserTenant && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleManageLessons(tenant.id)}
                            title="Gestionar lecciones"
                          >
                            <BookOpen className="w-4 h-4" />
                          </Button>
                        )}
                        {isUserTenant && currentUserRole === 'admin' && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(tenant)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(tenant.id)}
                              disabled={isLoading || tenant.id === currentTenant?.id}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              });
            })()}
          </TableBody>
        </Table>
      </CardContent>

      {/* Assign Lessons Dialog */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Asignar Lecciones a {selectedTenantForAssignment?.name}</DialogTitle>
            <DialogDescription>
              Selecciona las lecciones que deseas asignar a esta organización. Las lecciones duplicadas se omitirán automáticamente.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {/* Filter by level */}
            <div className="flex gap-2">
              {['Todos', 'A1', 'A2', 'B1', 'B2'].map((level) => (
                <Button
                  key={level}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (level === 'Todos') {
                      setSelectedLessons(availableLessons.map(l => l.id));
                    } else {
                      const levelLessons = availableLessons.filter(l => l.level === level);
                      setSelectedLessons(prev => {
                        const newSelection = [...prev];
                        levelLessons.forEach(lesson => {
                          if (!newSelection.includes(lesson.id)) {
                            newSelection.push(lesson.id);
                          }
                        });
                        return newSelection;
                      });
                    }
                  }}
                >
                  {level}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedLessons([])}
              >
                Limpiar
              </Button>
            </div>

            {/* Lessons list */}
            <div className="border rounded-lg max-h-96 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={availableLessons.length > 0 && selectedLessons.length === availableLessons.length}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedLessons(availableLessons.map(l => l.id));
                          } else {
                            setSelectedLessons([]);
                          }
                        }}
                      />
                    </TableHead>
                    <TableHead>Título</TableHead>
                    <TableHead>Nivel</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Duración</TableHead>
                    <TableHead>Origen</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {availableLessons.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No hay lecciones disponibles
                      </TableCell>
                    </TableRow>
                  ) : (
                    availableLessons.map((lesson) => (
                      <TableRow key={lesson.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedLessons.includes(lesson.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedLessons(prev => [...prev, lesson.id]);
                              } else {
                                setSelectedLessons(prev => prev.filter(id => id !== lesson.id));
                              }
                            }}
                          />
                        </TableCell>
                        <TableCell className="font-medium">{lesson.title}</TableCell>
                        <TableCell>
                          <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                            {lesson.level}
                          </span>
                        </TableCell>
                        <TableCell>{lesson.type}</TableCell>
                        <TableCell>{lesson.duration}</TableCell>
                        <TableCell>
                          <span className="text-xs text-muted-foreground">
                            {allTenants.find(t => t.id === lesson.tenant_id)?.name || 'N/A'}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {selectedLessons.length > 0 && (
              <div className="p-3 bg-primary/10 rounded-lg">
                <p className="text-sm font-medium">
                  {selectedLessons.length} lección{selectedLessons.length !== 1 ? 'es' : ''} seleccionada{selectedLessons.length !== 1 ? 's' : ''}
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAssignDialogOpen(false);
                setSelectedLessons([]);
                setSelectedTenantForAssignment(null);
              }}
              disabled={isAssigning}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleAssignLessonsToTenant}
              disabled={isAssigning || selectedLessons.length === 0}
            >
              {isAssigning ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Asignando...
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Asignar {selectedLessons.length} Lección{selectedLessons.length !== 1 ? 'es' : ''}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default TenantsManagement;


