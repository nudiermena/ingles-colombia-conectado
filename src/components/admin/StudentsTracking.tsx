import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Tenant } from "@/hooks/useTenant";
import { Loader2, RefreshCw, Search, TrendingUp, UserRound, Unlock } from "lucide-react";

type StudentRow = {
  user_id: string;
  full_name: string;
  email: string;
};

type AssignedLessonRow = {
  lesson_id: string;
  assigned_at: string;
  submitted_at: string | null;
  lessons?: {
    title: string;
    level: string;
    order_index: number;
  } | null;
};

type LessonProgressRow = {
  lesson_id: string;
  progress_percentage: number;
  completed: boolean;
  time_spent_minutes: number | null;
  last_accessed_at: string | null;
  completed_at: string | null;
  exercise_results?: { completed?: number[]; correct?: number[] } | null;
};

type PlacementTestResultRow = {
  user_id: string;
  recommended_level: string;
  correct_count: number;
  total_questions: number;
  completed_at: string;
} | null;

interface StudentsTrackingProps {
  currentTenant: Tenant | null;
}

const StudentsTracking = ({ currentTenant }: StudentsTrackingProps) => {
  const { toast } = useToast();
  const [isLoadingStudents, setIsLoadingStudents] = useState(true);
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const selectedStudent = useMemo(
    () => students.find((s) => s.user_id === selectedStudentId) || null,
    [students, selectedStudentId]
  );

  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [assignedLessons, setAssignedLessons] = useState<AssignedLessonRow[]>([]);
  const [progressRows, setProgressRows] = useState<LessonProgressRow[]>([]);
  const [placementTestResult, setPlacementTestResult] = useState<PlacementTestResultRow>(null);
  const [placementTestAssigned, setPlacementTestAssigned] = useState(false);
  const [allowingRetakeLessonId, setAllowingRetakeLessonId] = useState<string | null>(null);
  const [allowingPlacementRetake, setAllowingPlacementRetake] = useState(false);

  const handleAllowPlacementRetake = async () => {
    if (!currentTenant || !selectedStudentId) return;
    setAllowingPlacementRetake(true);
    try {
      await (supabase as any)
        .from("placement_test_results")
        .delete()
        .eq("user_id", selectedStudentId)
        .eq("tenant_id", currentTenant.id);
      setPlacementTestResult(null);
      toast({ title: "Reintento permitido", description: "El estudiante puede volver a realizar el Test de Nivelación." });
      if (selectedStudentId) fetchStudentDetail(selectedStudentId);
    } catch (err: any) {
      toast({ title: "Error", description: err?.message || "No se pudo permitir reintento", variant: "destructive" });
    } finally {
      setAllowingPlacementRetake(false);
    }
  };

  const handleAllowRetake = async (lessonId: string) => {
    if (!currentTenant || !selectedStudentId) return;
    setAllowingRetakeLessonId(lessonId);
    try {
      await (supabase as any)
        .from("user_lesson_assignments")
        .update({ submitted_at: null })
        .eq("user_id", selectedStudentId)
        .eq("tenant_id", currentTenant.id)
        .eq("lesson_id", lessonId);
      toast({ title: "Reintento permitido", description: "El estudiante puede volver a realizar la asignación." });
      if (selectedStudentId) fetchStudentDetail(selectedStudentId);
    } catch (err: any) {
      toast({ title: "Error", description: err?.message || "No se pudo permitir reintento", variant: "destructive" });
    } finally {
      setAllowingRetakeLessonId(null);
    }
  };

  const fetchStudents = async () => {
    if (!currentTenant) return;
    setIsLoadingStudents(true);
    try {
      const { data: rolesData, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id")
        .eq("tenant_id", currentTenant.id)
        .eq("role", "student");
      if (rolesError) throw rolesError;

      const userIds = (rolesData || []).map((r) => r.user_id).filter(Boolean) as string[];
      if (userIds.length === 0) {
        setStudents([]);
        setSelectedStudentId(null);
        return;
      }

      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("user_id, full_name, email")
        .in("user_id", userIds);
      if (profilesError) throw profilesError;

      const rows: StudentRow[] = (profilesData || []).map((p: any) => ({
        user_id: p.user_id,
        full_name: p.full_name || "Sin nombre",
        email: p.email || p.user_id?.substring?.(0, 8) + "...",
      }));
      rows.sort((a, b) => (a.full_name || "").localeCompare(b.full_name || ""));
      setStudents(rows);

      // Keep selection stable; default to first student
      setSelectedStudentId((prev) => {
        if (prev && rows.some((s) => s.user_id === prev)) return prev;
        return rows[0]?.user_id ?? null;
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.message || "No se pudieron cargar los estudiantes",
        variant: "destructive",
      });
    } finally {
      setIsLoadingStudents(false);
    }
  };

  const fetchStudentDetail = async (studentId: string) => {
    if (!currentTenant) return;
    setIsLoadingDetail(true);
    try {
      const { data: assignmentsData, error: assignmentsError } = await (supabase as any)
        .from("user_lesson_assignments")
        .select("lesson_id, assigned_at, submitted_at, lessons(title, level, order_index)")
        .eq("tenant_id", currentTenant.id)
        .eq("user_id", studentId);
      if (assignmentsError) throw assignmentsError;
      setAssignedLessons(assignmentsData || []);

      const { data: progressData, error: progressError } = await (supabase as any)
        .from("lesson_progress")
        .select("lesson_id, progress_percentage, completed, time_spent_minutes, last_accessed_at, completed_at, exercise_results")
        .eq("tenant_id", currentTenant.id)
        .eq("user_id", studentId);
      if (progressError) throw progressError;
      setProgressRows((progressData as any) || []);

      const { data: ptResult } = await (supabase as any)
        .from("placement_test_results")
        .select("recommended_level, correct_count, total_questions, completed_at")
        .eq("user_id", studentId)
        .eq("tenant_id", currentTenant.id)
        .maybeSingle();
      setPlacementTestResult(ptResult ? { user_id: studentId, ...ptResult } : null);

      const { data: ptAssigned } = await (supabase as any)
        .from("placement_test_assignments")
        .select("id")
        .eq("user_id", studentId)
        .eq("tenant_id", currentTenant.id)
        .maybeSingle();
      setPlacementTestAssigned(!!ptAssigned);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.message || "No se pudo cargar el seguimiento del estudiante",
        variant: "destructive",
      });
    } finally {
      setIsLoadingDetail(false);
    }
  };

  useEffect(() => {
    if (!currentTenant) return;
    fetchStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTenant?.id]);

  useEffect(() => {
    if (!currentTenant || !selectedStudentId) {
      setAssignedLessons([]);
      setProgressRows([]);
      return;
    }
    fetchStudentDetail(selectedStudentId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTenant?.id, selectedStudentId]);

  const filteredStudents = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return students;
    return students.filter(
      (s) =>
        (s.full_name || "").toLowerCase().includes(q) ||
        (s.email || "").toLowerCase().includes(q)
    );
  }, [students, searchTerm]);

  const progressByLessonId = useMemo(() => {
    const map = new Map<string, LessonProgressRow>();
    for (const p of progressRows) map.set(p.lesson_id, p);
    return map;
  }, [progressRows]);

  const mergedLessonRows = useMemo(() => {
    const normalizeLevelOrder = { A1: 1, A2: 2, B1: 3, B2: 4, C1: 5, C2: 6 } as const;
    const rows = (assignedLessons || []).map((a) => {
      const p = progressByLessonId.get(a.lesson_id);
      const lesson = a.lessons || null;
      const progressPct = p?.progress_percentage ?? 0;
      const completed = p?.completed ?? false;
      const er = p?.exercise_results;
      const correctIds = er?.correct ?? [];
      const completedIds = er?.completed ?? [];
      const correctCount = correctIds.length;
      const attemptedCount = completedIds.length;
      const incorrectCount = Math.max(0, attemptedCount - correctCount);
      const scorePct = attemptedCount > 0 ? Math.round((correctCount / attemptedCount) * 100) : null;
      return {
        lesson_id: a.lesson_id,
        title: lesson?.title || "Lección",
        level: lesson?.level || "—",
        order_index: lesson?.order_index ?? 0,
        assigned_at: a.assigned_at,
        submitted_at: a.submitted_at ?? null,
        progress_percentage: progressPct,
        completed,
        time_spent_minutes: p?.time_spent_minutes ?? 0,
        last_accessed_at: p?.last_accessed_at ?? null,
        completed_at: p?.completed_at ?? null,
        correctCount,
        incorrectCount,
        scorePct,
        _levelSort: normalizeLevelOrder[(lesson?.level as keyof typeof normalizeLevelOrder) || "A1"] ?? 999,
      };
    });

    rows.sort((x, y) => x._levelSort - y._levelSort || x.order_index - y.order_index || x.title.localeCompare(y.title));
    return rows;
  }, [assignedLessons, progressByLessonId]);

  const stats = useMemo(() => {
    const totalAssigned = mergedLessonRows.length;
    const completed = mergedLessonRows.filter((r) => r.completed || r.progress_percentage >= 100).length;
    const avg = totalAssigned > 0
      ? Math.round(mergedLessonRows.reduce((sum, r) => sum + (r.progress_percentage || 0), 0) / totalAssigned)
      : 0;
    const lastActivity = mergedLessonRows
      .map((r) => r.last_accessed_at)
      .filter(Boolean)
      .map((d) => new Date(d as string).getTime())
      .sort((a, b) => b - a)[0];
    return {
      totalAssigned,
      completed,
      averageProgress: avg,
      lastActivity: lastActivity ? new Date(lastActivity).toLocaleString() : null,
    };
  }, [mergedLessonRows]);

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserRound className="w-5 h-5" />
            Estudiantes
          </CardTitle>
          <CardDescription>
            Selecciona un estudiante para ver su progreso en las lecciones asignadas.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Buscar por nombre o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex justify-end">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => fetchStudents()}
              disabled={!currentTenant || isLoadingStudents}
              title="Refrescar estudiantes"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoadingStudents ? "animate-spin" : ""}`} />
              Refrescar
            </Button>
          </div>

          {isLoadingStudents ? (
            <div className="py-6 flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : filteredStudents.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4">No se encontraron estudiantes.</p>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <div className="max-h-[420px] overflow-y-auto">
                {filteredStudents.map((s) => {
                  const selected = s.user_id === selectedStudentId;
                  return (
                    <button
                      key={s.user_id}
                      type="button"
                      onClick={() => setSelectedStudentId(s.user_id)}
                      className={`w-full text-left px-3 py-2 border-b last:border-b-0 hover:bg-muted/50 transition-colors ${
                        selected ? "bg-muted" : ""
                      }`}
                    >
                      <div className="font-medium text-sm">{s.full_name}</div>
                      <div className="text-xs text-muted-foreground">{s.email}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Seguimiento
            </CardTitle>
            <Button
              variant="outline"
              size="icon"
              title="Actualizar seguimiento"
              onClick={() => {
                fetchStudents();
                if (selectedStudentId) fetchStudentDetail(selectedStudentId);
              }}
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
          <CardDescription>
            {selectedStudent
              ? `Progreso de ${selectedStudent.full_name} en las lecciones asignadas`
              : "Selecciona un estudiante."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!selectedStudentId ? (
            <p className="text-sm text-muted-foreground">No hay estudiante seleccionado.</p>
          ) : isLoadingDetail ? (
            <div className="py-10 flex items-center justify-center">
              <Loader2 className="w-7 h-7 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="text-xs text-muted-foreground">Lecciones asignadas</div>
                  <div className="text-2xl font-bold">{stats.totalAssigned}</div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="text-xs text-muted-foreground">Completadas</div>
                  <div className="text-2xl font-bold">{stats.completed}</div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="text-xs text-muted-foreground">Progreso promedio</div>
                  <div className="text-2xl font-bold">{stats.averageProgress}%</div>
                </div>
              </div>

              {/* Test de Nivelación */}
              <div className="border rounded-lg p-4 space-y-2">
                <div className="text-sm font-semibold">Test de Nivelación</div>
                {placementTestAssigned ? (
                  placementTestResult ? (
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Estado:</span>{" "}
                          <Badge variant="secondary" className="bg-success/10 text-success">Completado</Badge>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Nivel recomendado:</span>{" "}
                          <Badge variant="outline">{placementTestResult.recommended_level}</Badge>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Correctas:</span>{" "}
                          <span className="font-medium text-success">{placementTestResult.correct_count}</span>
                          {" / "}
                          <span>{placementTestResult.total_questions}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Fecha:</span>{" "}
                          {new Date(placementTestResult.completed_at).toLocaleDateString()}
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={allowingPlacementRetake}
                        onClick={handleAllowPlacementRetake}
                      >
                        {allowingPlacementRetake ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Unlock className="w-4 h-4 mr-2" />}
                        Permitir reintento del test
                      </Button>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Asignado — pendiente de realizar.</p>
                  )
                ) : (
                  <p className="text-sm text-muted-foreground">No asignado.</p>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="text-sm text-muted-foreground">
                  Última actividad:{" "}
                  <span className="font-medium text-foreground">
                    {stats.lastActivity || "—"}
                  </span>
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => selectedStudentId && fetchStudentDetail(selectedStudentId)}
                  disabled={!selectedStudentId || isLoadingDetail}
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${isLoadingDetail ? "animate-spin" : ""}`} />
                  Refrescar
                </Button>
              </div>

              {mergedLessonRows.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Este estudiante aún no tiene lecciones asignadas.
                </p>
              ) : (
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Lección</TableHead>
                        <TableHead>Nivel</TableHead>
                        <TableHead className="w-[220px]">Progreso</TableHead>
                        <TableHead>Correctas / Incorrectas</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead className="text-right">Tiempo</TableHead>
                        <TableHead className="text-right">Reintento</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mergedLessonRows.map((r) => (
                        <TableRow key={r.lesson_id}>
                          <TableCell className="font-medium">
                            <div className="leading-tight">
                              <div>{r.title}</div>
                              <div className="text-xs text-muted-foreground">
                                Asignada: {new Date(r.assigned_at).toLocaleDateString()}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{r.level}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span className="text-muted-foreground">%</span>
                                <span className="font-medium">{r.progress_percentage}%</span>
                              </div>
                              <Progress value={r.progress_percentage} className="h-2" />
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">
                            <span className="text-success font-medium">{r.correctCount}</span>
                            {" / "}
                            <span className="text-destructive font-medium">{r.incorrectCount}</span>
                          </TableCell>
                          <TableCell className="text-sm">
                            {r.scorePct != null ? <span className="font-medium">{r.scorePct}%</span> : "—"}
                          </TableCell>
                          <TableCell>
                            {r.submitted_at ? (
                              <Badge variant="secondary" className="bg-amber-500/10 text-amber-700 dark:text-amber-400">
                                Entregada
                              </Badge>
                            ) : r.completed || r.progress_percentage >= 100 ? (
                              <Badge variant="secondary" className="bg-success/10 text-success">
                                Completada
                              </Badge>
                            ) : r.progress_percentage > 0 ? (
                              <Badge variant="secondary" className="bg-warning/10 text-warning">
                                En progreso
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="bg-muted text-muted-foreground">
                                Sin iniciar
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right text-sm">
                            {(r.time_spent_minutes || 0) > 0 ? `${r.time_spent_minutes} min` : "—"}
                          </TableCell>
                          <TableCell className="text-right">
                            {r.submitted_at ? (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                disabled={allowingRetakeLessonId === r.lesson_id}
                                onClick={() => handleAllowRetake(r.lesson_id)}
                                title="Permitir reintento"
                              >
                                {allowingRetakeLessonId === r.lesson_id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Unlock className="w-4 h-4" />
                                )}
                              </Button>
                            ) : (
                              "—"
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentsTracking;

