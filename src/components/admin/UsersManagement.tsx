import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Users, Search, Loader2, Trash2, Pencil, Plus, BookOpen, Upload, FileText, ClipboardCheck, Building2 } from "lucide-react";
import type { Tenant } from "@/hooks/useTenant";

interface UsersManagementProps {
  currentTenant: Tenant | null;
  currentUserRole?: 'admin' | 'teacher' | 'student' | null;
  /** All tenants (for admin: list all users and add/remove from any org) */
  tenants?: Tenant[];
  onInvite?: () => void;
}

/** One org membership for a user (admin view) */
export interface UserOrgMembership {
  tenant_id: string;
  tenant_name: string;
  role: 'admin' | 'teacher' | 'student';
  role_id: string;
}

interface UserWithRole {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'teacher' | 'student' | null;
  role_id: string | null;
  created_at: string;
  /** Only in admin mode: memberships across all orgs */
  organizations?: UserOrgMembership[];
}

const UsersManagement = ({ currentTenant, currentUserRole, tenants = [], onInvite }: UsersManagementProps) => {
  const { user: currentUser } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [assignedSummaryByUserId, setAssignedSummaryByUserId] = useState<Record<string, { total: number; byLevel: Record<string, number> }>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingUser, setEditingUser] = useState<UserWithRole | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    full_name: "",
    role: "student" as "admin" | "teacher" | "student",
  });
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [assigningUser, setAssigningUser] = useState<UserWithRole | null>(null);
  const [availableLessons, setAvailableLessons] = useState<{ id: string; title: string; level: string }[]>([]);
  const [assignedLessonIds, setAssignedLessonIds] = useState<string[]>([]);
  const [assignmentDueDate, setAssignmentDueDate] = useState<string>("");
  const [assignmentTimeLimitMinutes, setAssignmentTimeLimitMinutes] = useState<string>("");
  const [isAssigning, setIsAssigning] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importPreview, setImportPreview] = useState<{ email: string; full_name: string; role: "admin" | "teacher" | "student" }[]>([]);
  const [importDefaultPassword, setImportDefaultPassword] = useState("Cambiar123!");
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<{ success: number; errors: string[] } | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [placementTestDialogOpen, setPlacementTestDialogOpen] = useState(false);
  const [placementTestSelectedIds, setPlacementTestSelectedIds] = useState<Set<string>>(new Set());
  const [placementTestAssignedIds, setPlacementTestAssignedIds] = useState<Set<string>>(new Set());
  const [isAssigningPlacementTest, setIsAssigningPlacementTest] = useState(false);
  const assignDialogUserHasChangedSelection = useRef(false);
  const [addToOrgDialogOpen, setAddToOrgDialogOpen] = useState(false);
  const [addToOrgUser, setAddToOrgUser] = useState<UserWithRole | null>(null);
  const [addToOrgTenantId, setAddToOrgTenantId] = useState("");
  const [addToOrgRole, setAddToOrgRole] = useState<"admin" | "teacher" | "student">("student");
  const [isAddingToOrg, setIsAddingToOrg] = useState(false);

  const isAdminView = currentUserRole === 'admin' && tenants.length > 0;

  useEffect(() => {
    if (isAdminView || currentTenant) {
      fetchUsers();
    }
  }, [isAdminView, currentTenant?.id, tenants.length]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      if (isAdminView) {
        // Admin: fetch ALL user_roles and all profiles to show every user and their organizations
        const { data: rolesData, error: rolesError } = await supabase
          .from('user_roles')
          .select('*')
          .order('created_at', { ascending: false });

        if (rolesError) throw rolesError;

        const userIds = [...new Set((rolesData || []).map(r => r.user_id))];
        if (userIds.length === 0) {
          setUsers([]);
          setAssignedSummaryByUserId({});
          setIsLoading(false);
          return;
        }

        const { data: profilesData, error: profilesError } = await (supabase as any)
          .from('profiles')
          .select('user_id, full_name, email, created_at')
          .in('user_id', userIds);

        if (profilesError) throw profilesError;

        const profileByUserId = new Map<string, { full_name: string | null; email: string | null; created_at: string }>();
        (profilesData || []).forEach((p: { user_id: string; full_name: string | null; email: string | null; created_at: string }) => {
          profileByUserId.set(p.user_id, { full_name: p.full_name ?? null, email: p.email ?? null, created_at: p.created_at });
        });

        const tenantIds = [...new Set((rolesData || []).map(r => r.tenant_id))];
        const tenantIdToName = new Map<string, string>();
        if (tenantIds.length > 0 && tenants.length > 0) {
          tenants.forEach(t => tenantIdToName.set(t.id, t.name));
        } else if (tenantIds.length > 0) {
          const { data: tenantsData } = await supabase.from('tenants').select('id, name').in('id', tenantIds);
          (tenantsData || []).forEach((t: { id: string; name: string }) => tenantIdToName.set(t.id, t.name));
        }

        const usersById = new Map<string, UserWithRole>();
        for (const roleRow of rolesData || []) {
          const profile = profileByUserId.get(roleRow.user_id);
          const displayEmail = profile?.email?.trim() || null;
          const displayName = profile?.full_name?.trim() || null;
          const existing = usersById.get(roleRow.user_id);
          const membership: UserOrgMembership = {
            tenant_id: roleRow.tenant_id,
            tenant_name: tenantIdToName.get(roleRow.tenant_id) ?? roleRow.tenant_id.slice(0, 8),
            role: (roleRow.role as 'admin' | 'teacher' | 'student') ?? 'student',
            role_id: roleRow.id ?? '',
          };
          if (existing) {
            existing.organizations = [...(existing.organizations || []), membership];
          } else {
            usersById.set(roleRow.user_id, {
              id: roleRow.user_id,
              email: displayEmail ?? roleRow.user_id.substring(0, 8) + '...',
              full_name: displayName ?? 'Sin nombre',
              role: roleRow.role ?? null,
              role_id: roleRow.id ?? null,
              created_at: profile?.created_at ?? roleRow.created_at,
              organizations: [membership],
            });
          }
        }

        const usersWithRoles = Array.from(usersById.values());
        setUsers(usersWithRoles);

        const tenantIdForAssignments = currentTenant?.id ?? usersWithRoles[0]?.organizations?.[0]?.tenant_id;
        if (tenantIdForAssignments) {
          const { data: assignmentsData, error: assignmentsError } = await (supabase as any)
            .from('user_lesson_assignments')
            .select('user_id, lesson_id, lessons(level)')
            .eq('tenant_id', tenantIdForAssignments)
            .in('user_id', userIds);
          if (!assignmentsError && assignmentsData) {
            const summary: Record<string, { total: number; byLevel: Record<string, number> }> = {};
            (assignmentsData || []).forEach((row: any) => {
              const uid = row.user_id as string;
              const level = row.lessons?.level as string | undefined;
              if (!summary[uid]) summary[uid] = { total: 0, byLevel: {} };
              summary[uid].total += 1;
              if (level) summary[uid].byLevel[level] = (summary[uid].byLevel[level] || 0) + 1;
            });
            setAssignedSummaryByUserId(summary);
          } else {
            setAssignedSummaryByUserId({});
          }
        } else {
          setAssignedSummaryByUserId({});
        }
        setIsLoading(false);
        return;
      }

      if (!currentTenant) {
        setUsers([]);
        setIsLoading(false);
        return;
      }

      // Teacher/non-admin: only users in current tenant; teachers see only students
      let query = supabase
        .from('user_roles')
        .select('*')
        .eq('tenant_id', currentTenant.id)
        .order('created_at', { ascending: false });
      if (currentUserRole === 'teacher') {
        query = query.eq('role', 'student');
      }
      const { data: rolesData, error: rolesError } = await query;

      if (rolesError) throw rolesError;

      const userIds = rolesData?.map(r => r.user_id) || [];
      if (userIds.length === 0) {
        setUsers([]);
        setAssignedSummaryByUserId({});
        setIsLoading(false);
        return;
      }

      const { data: profilesData, error: profilesError } = await (supabase as any)
        .from('profiles')
        .select('user_id, full_name, email, created_at')
        .in('user_id', userIds);

      if (profilesError) throw profilesError;

      const profileByUserId = new Map<string, { full_name: string | null; email: string | null; created_at: string }>();
      (profilesData || []).forEach((p: { user_id: string; full_name: string | null; email: string | null; created_at: string }) => {
        profileByUserId.set(p.user_id, { full_name: p.full_name ?? null, email: p.email ?? null, created_at: p.created_at });
      });

      const { data: assignmentsData, error: assignmentsError } = await (supabase as any)
        .from('user_lesson_assignments')
        .select('user_id, lesson_id, lessons(level)')
        .eq('tenant_id', currentTenant.id)
        .in('user_id', userIds);

      if (assignmentsError) throw assignmentsError;

      const summary: Record<string, { total: number; byLevel: Record<string, number> }> = {};
      (assignmentsData || []).forEach((row: any) => {
        const uid = row.user_id as string;
        const level = row.lessons?.level as string | undefined;
        if (!summary[uid]) summary[uid] = { total: 0, byLevel: {} };
        summary[uid].total += 1;
        if (level) {
          summary[uid].byLevel[level] = (summary[uid].byLevel[level] || 0) + 1;
        }
      });
      setAssignedSummaryByUserId(summary);

      const usersWithRoles: UserWithRole[] = (rolesData || []).map((roleRow) => {
        const profile = profileByUserId.get(roleRow.user_id);
        const displayEmail = profile?.email?.trim() || null;
        const displayName = profile?.full_name?.trim() || null;
        return {
          id: roleRow.user_id,
          email: displayEmail ?? roleRow.user_id.substring(0, 8) + '...',
          full_name: displayName ?? 'Sin nombre',
          role: roleRow.role ?? null,
          role_id: roleRow.id ?? null,
          created_at: profile?.created_at ?? roleRow.created_at,
        };
      });

      setUsers(usersWithRoles);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudieron cargar los usuarios",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  /** Remove user from a single organization (admin only when passing tenantId) */
  const handleRemoveUserFromOrg = async (userId: string, tenantId: string, tenantName?: string, targetUserRole?: string | null) => {
    if (userId === currentUser?.id) {
      toast({
        title: "Acción no permitida",
        description: "No puedes eliminarte a ti mismo de la organización",
        variant: "destructive"
      });
      return;
    }
    if (currentUserRole !== 'admin' && targetUserRole === 'admin') {
      toast({
        title: "Acción no permitida",
        description: "No tienes permisos para eliminar administradores",
        variant: "destructive"
      });
      return;
    }
    const label = tenantName ? ` de "${tenantName}"` : "";
    if (!confirm(`¿Quitar a este usuario${label}? Ya no tendrá acceso a esa organización.`)) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .match({ user_id: userId, tenant_id: tenantId });
      if (error) throw error;
      toast({ title: "Usuario removido", description: `Removido de la organización${label}` });
      await fetchUsers();
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "No se pudo remover", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string, targetUserRole: string | null) => {
    const tenantId = currentTenant?.id;
    if (!tenantId) return;

    if (userId === currentUser?.id) {
      toast({
        title: "Acción no permitida",
        description: "No puedes eliminar tu propia cuenta de la organización",
        variant: "destructive"
      });
      return;
    }

    if (currentUserRole !== 'admin' && targetUserRole === 'admin') {
      toast({
        title: "Acción no permitida",
        description: "No tienes permisos para eliminar administradores",
        variant: "destructive"
      });
      return;
    }

    if (!confirm("¿Estás seguro de que deseas eliminar a este usuario de la organización? Esta acción no se puede deshacer.")) {
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .match({ user_id: userId, tenant_id: tenantId });

      if (error) throw error;

      toast({
        title: "Usuario eliminado",
        description: "El usuario ha sido removido de la organización exitosamente",
      });

      await fetchUsers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo eliminar al usuario",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToOrgOpen = (user: UserWithRole) => {
    setAddToOrgUser(user);
    setAddToOrgTenantId(tenants.length ? tenants[0].id : "");
    setAddToOrgRole("student");
    setAddToOrgDialogOpen(true);
  };

  const handleAddToOrgSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addToOrgUser || !addToOrgTenantId) return;
    const alreadyIn = addToOrgUser.organizations?.some(o => o.tenant_id === addToOrgTenantId);
    if (alreadyIn) {
      toast({ title: "Ya está en la organización", description: "El usuario ya tiene un rol en esa organización.", variant: "destructive" });
      return;
    }
    setIsAddingToOrg(true);
    try {
      const { error } = await (supabase as any).rpc("add_user_role_to_tenant", {
        _user_id: addToOrgUser.id,
        _tenant_id: addToOrgTenantId,
        _role: addToOrgRole,
      });
      if (error) throw error;
      toast({ title: "Usuario agregado", description: "Se agregó el usuario a la organización con el rol seleccionado." });
      setAddToOrgDialogOpen(false);
      setAddToOrgUser(null);
      await fetchUsers();
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "No se pudo agregar", variant: "destructive" });
    } finally {
      setIsAddingToOrg(false);
    }
  };

  const handleCreate = () => {
    setIsEditing(false);
    setEditingUser(null);
    setFormData({
      email: "",
      password: "",
      full_name: "",
      role: "student",
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (user: UserWithRole) => {
    setIsEditing(true);
    setEditingUser(user);
    const roleInCurrentTenant = currentTenant && user.organizations?.find(o => o.tenant_id === currentTenant.id)?.role;
    setFormData({
      email: "",
      password: "",
      full_name: user.full_name || "",
      role: (roleInCurrentTenant ?? user.role) || "student",
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTenant) return;

    const role =
      currentUserRole === 'teacher'
        ? 'student'
        : formData.role && ['admin', 'teacher', 'student'].includes(formData.role)
          ? formData.role
          : 'student';

    setIsSubmitting(true);
    try {
      if (isEditing && editingUser) {
        await supabase
          .from("profiles")
          .update({ full_name: formData.full_name })
          .eq("user_id", editingUser.id)
          .select();

        if (currentUserRole === 'admin') {
          const roleInCurrentTenant = editingUser.organizations?.find(o => o.tenant_id === currentTenant.id);
          if (roleInCurrentTenant?.role_id) {
            await supabase
              .from("user_roles")
              .update({ role })
              .eq("id", roleInCurrentTenant.role_id);
          } else {
            await (supabase as any).rpc("add_user_role_to_tenant", {
              _user_id: editingUser.id,
              _tenant_id: currentTenant.id,
              _role: role,
            });
          }
        }
        toast({
          title: "Usuario actualizado",
          description: currentUserRole === 'teacher' ? "Nombre actualizado correctamente" : "El usuario ha sido actualizado exitosamente",
        });
      } else {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: formData.email.trim(),
          password: formData.password,
          options: {
            data: { full_name: formData.full_name || formData.email.trim() },
          },
        });

        if (signUpError) throw signUpError;
        if (!data.user) {
          throw new Error("No se pudo crear el usuario. ¿El correo ya está registrado?");
        }

        const userId = data.user.id;

        // Ensure profile exists (trigger may run async). Upsert so we have a row for this user.
        await supabase.from("profiles").upsert(
          {
            user_id: userId,
            full_name: formData.full_name?.trim() || data.user.email || "Usuario",
            email: data.user.email,
          },
          { onConflict: "user_id" }
        );

        const addRoleWithRetry = async (attempt = 0): Promise<void> => {
          const maxAttempts = 3;
          const { error: roleError } = await (supabase as any).rpc("add_user_role_to_tenant", {
            _user_id: userId,
            _tenant_id: currentTenant.id,
            _role: role,
          });
          if (roleError) {
            const isFkViolation = roleError.message?.includes("user_roles_user_id_fkey") || roleError.code === "23503";
            const isConflict =
              roleError.code === "409" ||
              roleError.status === 409 ||
              String(roleError.message || "").includes("409");
            if (isConflict) {
              const { data: existing } = await supabase
                .from("user_roles")
                .select("id")
                .eq("user_id", userId)
                .eq("tenant_id", currentTenant.id)
                .maybeSingle();
              if (existing) return;
            }
            if (isFkViolation && attempt < maxAttempts - 1) {
              await new Promise((r) => setTimeout(r, 600 * (attempt + 1)));
              return addRoleWithRetry(attempt + 1);
            }
            throw roleError;
          }
        };

        await addRoleWithRetry();

        toast({
          title: "Usuario creado",
          description: "El usuario ha sido creado y agregado a la organización",
        });
      }

      setIsDialogOpen(false);
      setFormData({ email: "", password: "", full_name: "", role: "student" });
      setEditingUser(null);
      await fetchUsers();
    } catch (error: any) {
      const isFkOrConflict =
        error?.message?.includes("user_roles_user_id_fkey") ||
        error?.code === "23503" ||
        error?.code === "409" ||
        error?.status === 409;
      const message = isFkOrConflict
        ? "El usuario se creó pero no se pudo asignar a la organización. Asigna el rol manualmente desde la lista de usuarios o intenta de nuevo en unos segundos."
        : error?.message || "No se pudo guardar";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAssignLessons = async (user: UserWithRole) => {
    if (!currentTenant) return;
    setAssigningUser(user);
    setAssignDialogOpen(true);
    assignDialogUserHasChangedSelection.current = false;
    try {
      const { data: lessonsData } = await (supabase as any)
        .from('lessons')
        .select('id, title, level')
        .eq('tenant_id', currentTenant.id)
        .eq('is_active', true)
        .order('level')
        .order('order_index');
      setAvailableLessons(lessonsData || []);

      const { data: assignments } = await (supabase as any)
        .from('user_lesson_assignments')
        .select('lesson_id, due_date, time_limit_minutes')
        .eq('user_id', user.id)
        .eq('tenant_id', currentTenant.id);
      if (!assignDialogUserHasChangedSelection.current) {
        setAssignedLessonIds((assignments || []).map((a: { lesson_id: string }) => a.lesson_id));
      }
      const first = (assignments || [])[0];
      if (first) {
        setAssignmentDueDate(first.due_date ? String(first.due_date).slice(0, 16) : "");
        setAssignmentTimeLimitMinutes(first.time_limit_minutes != null ? String(first.time_limit_minutes) : "");
      } else {
        setAssignmentDueDate("");
        setAssignmentTimeLimitMinutes("");
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "No se pudieron cargar las lecciones", variant: "destructive" });
    }
  };

  const parseImportFile = (file: File): Promise<{ email: string; full_name: string; role: "admin" | "teacher" | "student" }[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const text = (reader.result as string) || "";
        const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
        const isCsv = file.name.toLowerCase().endsWith(".csv");
        const rows: { email: string; full_name: string; role: "admin" | "teacher" | "student" }[] = [];
        const validRoles = ["admin", "teacher", "student"] as const;

        let start = 0;
        if (isCsv && lines.length > 0) {
          const first = lines[0].toLowerCase();
          if (first.includes("email") && (first.includes("name") || first.includes("nombre") || first.includes("role") || first.includes("rol"))) start = 1;
        }
        for (let i = start; i < lines.length; i++) {
          const line = lines[i];
          const parts = isCsv ? line.split(/[,;]/).map((p) => p.trim()) : line.split(/[\t,]/).map((p) => p.trim());
          if (parts.length === 0) continue;
          const email = parts[0];
          if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) continue;
          const full_name = parts[1] || email.split("@")[0] || "Usuario";
          const roleRaw = (parts[2] || "student").toLowerCase();
          const role = validRoles.includes(roleRaw as any) ? (roleRaw as "admin" | "teacher" | "student") : "student";
          rows.push({ email, full_name, role });
        }
        resolve(rows);
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsText(file, "UTF-8");
    });
  };

  const handleImportFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const ext = file.name.toLowerCase();
    if (!ext.endsWith(".txt") && !ext.endsWith(".csv")) {
      toast({ title: "Formato no válido", description: "Usa un archivo .txt o .csv", variant: "destructive" });
      return;
    }
    setImportFile(file);
    setImportResult(null);
    try {
      const rows = await parseImportFile(file);
      setImportPreview(rows);
      if (rows.length === 0) {
        toast({ title: "Sin datos", description: "No se encontraron filas válidas (correo obligatorio).", variant: "destructive" });
      }
    } catch (err: any) {
      toast({ title: "Error", description: err?.message || "No se pudo leer el archivo", variant: "destructive" });
    }
  };

  const handleImportUsers = async () => {
    if (!currentTenant || importPreview.length === 0) return;
    setIsImporting(true);
    setImportResult(null);
    const errors: string[] = [];
    let success = 0;

    for (const row of importPreview) {
      try {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: row.email.trim(),
          password: importDefaultPassword,
          options: { data: { full_name: row.full_name || row.email.trim() } },
        });
        if (signUpError) {
          if (signUpError.message?.includes("already registered")) {
            errors.push(`${row.email}: ya está registrado`);
          } else {
            errors.push(`${row.email}: ${signUpError.message}`);
          }
          continue;
        }
        if (!data.user) continue;
        const userId = data.user.id;
        await supabase.from("profiles").upsert(
          { user_id: userId, full_name: row.full_name || data.user.email || "Usuario", email: data.user.email },
          { onConflict: "user_id" }
        );
        const addRoleWithRetry = async (attempt = 0): Promise<void> => {
          const roleToAssign = currentUserRole === 'teacher' ? 'student' : row.role;
          const { error: roleError } = await (supabase as any).rpc("add_user_role_to_tenant", {
            _user_id: userId,
            _tenant_id: currentTenant.id,
            _role: roleToAssign,
          });
          if (roleError) {
            const isConflict = roleError.code === "409" || roleError.status === 409;
            if (isConflict) {
              const { data: existing } = await supabase.from("user_roles").select("id").eq("user_id", userId).eq("tenant_id", currentTenant.id).maybeSingle();
              if (existing) return;
            }
            if (attempt < 2) {
              await new Promise((r) => setTimeout(r, 500 * (attempt + 1)));
              return addRoleWithRetry(attempt + 1);
            }
            errors.push(`${row.email}: no se pudo asignar rol`);
            return;
          }
        };
        await addRoleWithRetry();
        success++;
      } catch (err: any) {
        errors.push(`${row.email}: ${err?.message || "Error"}`);
      }
    }

    setImportResult({ success, errors });
    await fetchUsers();
    setIsImporting(false);
    if (success > 0) {
      toast({ title: "Importación completada", description: `Se crearon ${success} usuario(s). Contraseña por defecto: ${importDefaultPassword}` });
    }
    if (errors.length > 0 && success === 0) {
      toast({ title: "Error", description: errors.slice(0, 3).join("; "), variant: "destructive" });
    }
  };

  const handleOpenPlacementTestDialog = async () => {
    if (!currentTenant) return;
    setPlacementTestDialogOpen(true);
    try {
      const { data } = await (supabase as any)
        .from('placement_test_assignments')
        .select('user_id')
        .eq('tenant_id', currentTenant.id);
      const ids = new Set<string>((data || []).map((r: { user_id: string }) => r.user_id));
      setPlacementTestAssignedIds(ids);
      setPlacementTestSelectedIds(ids);
    } catch {
      setPlacementTestAssignedIds(new Set());
      setPlacementTestSelectedIds(new Set());
    }
  };

  const handleSavePlacementTestAssignments = async () => {
    if (!currentTenant || !currentUser) return;
    setIsAssigningPlacementTest(true);
    try {
      const toAdd = [...placementTestSelectedIds].filter(id => !placementTestAssignedIds.has(id));
      const toRemove = [...placementTestAssignedIds].filter(id => !placementTestSelectedIds.has(id));
      for (const userId of toRemove) {
        await (supabase as any)
          .from('placement_test_assignments')
          .delete()
          .eq('user_id', userId)
          .eq('tenant_id', currentTenant.id);
      }
      for (const userId of toAdd) {
        await (supabase as any)
          .from('placement_test_assignments')
          .insert({ user_id: userId, tenant_id: currentTenant.id, assigned_by: currentUser.id });
      }
      setPlacementTestAssignedIds(placementTestSelectedIds);
      toast({ title: "Test de nivelación", description: "Asignaciones actualizadas correctamente." });
    } catch (err: any) {
      toast({ title: "Error", description: err?.message || "No se pudieron guardar", variant: "destructive" });
    } finally {
      setIsAssigningPlacementTest(false);
    }
  };

  const handleSaveAssignments = async () => {
    if (!currentTenant || !assigningUser) return;
    setIsAssigning(true);
    try {
      const lessonById = new Map(availableLessons.map((l) => [l.id, l] as const));

      const { data: existing } = await (supabase as any)
        .from('user_lesson_assignments')
        .select('id, lesson_id')
        .eq('user_id', assigningUser.id)
        .eq('tenant_id', currentTenant.id);
      const existingIds = new Set((existing || []).map(e => e.lesson_id));
      const toAdd = assignedLessonIds.filter(id => !existingIds.has(id));
      const toRemove = (existing || []).filter(e => !assignedLessonIds.includes(e.lesson_id));

      const dueDateValue = assignmentDueDate.trim() ? new Date(assignmentDueDate).toISOString() : null;
      const timeLimitValue = assignmentTimeLimitMinutes.trim() ? parseInt(assignmentTimeLimitMinutes, 10) : null;

      for (const a of toRemove) {
        const { error: delAssignError } = await (supabase as any).from('user_lesson_assignments').delete().eq('id', a.id);
        if (delAssignError) throw delAssignError;
        const { error: delProgressError } = await (supabase as any)
          .from('lesson_progress')
          .delete()
          .eq('user_id', assigningUser.id)
          .eq('tenant_id', currentTenant.id)
          .eq('lesson_id', a.lesson_id);
        if (delProgressError) {
          console.warn('No se pudo borrar progreso al desasignar (¿migración aplicada?):', delProgressError);
          toast({ title: "Aviso", description: "Asignación actualizada. Si el estudiante ya tenía progreso, aplica la migración de permisos para que al reasignar empiece desde cero.", variant: "destructive" });
        }
      }
      for (const lessonId of toAdd) {
        const { error: delProgressError } = await (supabase as any)
          .from('lesson_progress')
          .delete()
          .eq('user_id', assigningUser.id)
          .eq('tenant_id', currentTenant.id)
          .eq('lesson_id', lessonId);
        if (delProgressError) {
          console.warn('No se pudo borrar progreso al reasignar (¿migración aplicada?):', delProgressError);
          toast({ title: "Aviso", description: "Lección asignada. Si el estudiante ya tenía progreso, aplica la migración de permisos para que empiece desde cero.", variant: "destructive" });
        }
        const { error: insertError } = await (supabase as any).from('user_lesson_assignments').insert({
          user_id: assigningUser.id,
          tenant_id: currentTenant.id,
          lesson_id: lessonId,
          assigned_by: currentUser?.id,
          due_date: dueDateValue,
          time_limit_minutes: timeLimitValue,
        }).select();
        if (insertError) throw insertError;
      }
      const toUpdate = (existing || []).filter((e: { lesson_id: string }) => assignedLessonIds.includes(e.lesson_id));
      for (const row of toUpdate) {
        await (supabase as any).from('user_lesson_assignments').update({ due_date: dueDateValue, time_limit_minutes: timeLimitValue }).eq('id', (row as { id: string }).id);
      }

      // Optimistic: update summary in the grid immediately (avoid needing a manual refresh).
      const nextByLevel: Record<string, number> = {};
      for (const lessonId of assignedLessonIds) {
        const level = lessonById.get(lessonId)?.level;
        if (!level) continue;
        nextByLevel[level] = (nextByLevel[level] || 0) + 1;
      }
      setAssignedSummaryByUserId((prev) => ({
        ...prev,
        [assigningUser.id]: { total: assignedLessonIds.length, byLevel: nextByLevel },
      }));

      toast({ title: "Lecciones asignadas", description: "Las lecciones han sido actualizadas correctamente" });
      setAssignDialogOpen(false);
      setAssigningUser(null);
      await fetchUsers();
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "No se pudieron guardar las asignaciones", variant: "destructive" });
    } finally {
      setIsAssigning(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Gestión de Usuarios
            </CardTitle>
            <CardDescription>
              {isAdminView
                ? "Todos los usuarios del sistema. Agrega, quita o edita usuarios en cualquier organización."
                : currentUserRole === 'teacher'
                ? `Estudiantes de ${currentTenant?.name || "la organización"}. Solo puedes ver y gestionar estudiantes.`
                : `Administra los usuarios de ${currentTenant?.name || "la organización"}`}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            {onInvite && (
              <Button variant="outline" onClick={onInvite}>
                <Plus className="w-4 h-4 mr-2" />
                Nueva Invitación
              </Button>
            )}
            <Button type="button" variant="outline" onClick={handleOpenPlacementTestDialog}>
              <ClipboardCheck className="w-4 h-4 mr-2" />
              Test de nivelación
            </Button>
            <Button type="button" variant="outline" onClick={() => { setImportDialogOpen(true); setImportPreview([]); setImportFile(null); setImportResult(null); }}>
              <Upload className="w-4 h-4 mr-2" />
              Importar
            </Button>
            <Button type="button" onClick={handleCreate}>
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Usuario
            </Button>
            <Dialog
              open={isDialogOpen}
              onOpenChange={(open) => {
                setIsDialogOpen(open);
                if (!open) {
                  setEditingUser(null);
                  setFormData({ email: "", password: "", full_name: "", role: "student" });
                }
              }}
            >
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>
                    {isEditing ? "Editar Usuario" : "Nuevo Usuario"}
                  </DialogTitle>
                  <DialogDescription>
                    {isEditing
                      ? currentUserRole === 'teacher'
                        ? "Actualiza el nombre del estudiante"
                        : "Actualiza el nombre y rol del usuario"
                      : currentUserRole === 'teacher'
                        ? "Crea un estudiante con correo y contraseña y asígnalo a la organización"
                        : "Crea un usuario con correo y contraseña y asígnalo a la organización"}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4 py-4">
                    {!isEditing && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="email">Correo electrónico</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) =>
                              setFormData({ ...formData, email: e.target.value })
                            }
                            placeholder="usuario@ejemplo.com"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="password">Contraseña</Label>
                          <Input
                            id="password"
                            type="password"
                            value={formData.password}
                            onChange={(e) =>
                              setFormData({ ...formData, password: e.target.value })
                            }
                            placeholder="Mínimo 6 caracteres"
                            required={!isEditing}
                            minLength={6}
                          />
                        </div>
                      </>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="full_name">Nombre completo</Label>
                      <Input
                        id="full_name"
                        value={formData.full_name}
                        onChange={(e) =>
                          setFormData({ ...formData, full_name: e.target.value })
                        }
                        placeholder="Nombre del usuario"
                        required
                      />
                    </div>
                    {currentUserRole === "admin" && (
                      <div className="space-y-2">
                        <Label htmlFor="role">Rol</Label>
                        <Select
                          value={formData.role}
                          onValueChange={(value: "admin" | "teacher" | "student") =>
                            setFormData({ ...formData, role: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Administrador</SelectItem>
                            <SelectItem value="teacher">Profesor</SelectItem>
                            <SelectItem value="student">Estudiante</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
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
                      {isSubmitting && (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      )}
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
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Buscar usuarios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Email</TableHead>
                {isAdminView && <TableHead>Organizaciones</TableHead>}
                {!isAdminView && <TableHead>Rol</TableHead>}
                <TableHead>Lecciones asignadas</TableHead>
                <TableHead>Fecha de Registro</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={isAdminView ? 6 : 6} className="text-center py-8 text-muted-foreground">
                    {searchTerm ? "No se encontraron usuarios" : "No hay usuarios registrados"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {user.id === currentUser?.id && (
                          <span className="w-2 h-2 bg-primary rounded-full" />
                        )}
                        {user.full_name || "Sin nombre"}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{user.email}</TableCell>
                    {isAdminView ? (
                      <TableCell>
                        <div className="flex flex-wrap gap-1.5 items-center">
                          {(user.organizations ?? []).map((org) => (
                            <span
                              key={org.tenant_id}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-muted"
                            >
                              <Building2 className="w-3 h-3" />
                              {org.tenant_name}
                              <span className="text-muted-foreground">
                                ({org.role === "admin" ? "Admin" : org.role === "teacher" ? "Profesor" : "Estudiante"})
                              </span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-5 w-5 p-0 text-destructive hover:text-destructive"
                                onClick={() => handleRemoveUserFromOrg(user.id, org.tenant_id, org.tenant_name, org.role)}
                                disabled={isLoading || user.id === currentUser?.id}
                                title="Quitar de esta organización"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </span>
                          ))}
                        </div>
                      </TableCell>
                    ) : (
                      <TableCell>
                        <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium">
                          {user.role === "admin"
                            ? "Administrador"
                            : user.role === "teacher"
                            ? "Profesor"
                            : user.role === "student"
                            ? "Estudiante"
                            : "Sin rol"}
                        </span>
                      </TableCell>
                    )}
                    <TableCell>
                      {(() => {
                        const s = assignedSummaryByUserId[user.id];
                        if (!s || s.total === 0) return <span className="text-sm text-muted-foreground">0</span>;
                        const levels = Object.entries(s.byLevel);
                        return (
                          <div className="flex flex-wrap gap-1 justify-start">
                            <span className="text-sm font-medium">{s.total}</span>
                            {levels.slice(0, 3).map(([lvl, cnt]) => (
                              <span key={lvl} className="text-xs px-1.5 py-0.5 bg-muted rounded">
                                {lvl}: {cnt}
                              </span>
                            ))}
                          </div>
                        );
                      })()}
                    </TableCell>
                    <TableCell>
                      {new Date(user.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2 flex-wrap">
                        {isAdminView && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleAddToOrgOpen(user)}
                            disabled={isLoading || (tenants.length === 0)}
                            title="Agregar a una organización"
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            Agregar a org
                          </Button>
                        )}
                        {!isAdminView && (currentUserRole === 'admin' || currentUserRole === 'teacher') && (user.role === 'student' || !user.role) && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAssignLessons(user)}
                            disabled={isLoading}
                            title="Asignar lecciones a este estudiante"
                          >
                            <BookOpen className="w-4 h-4 mr-1" />
                            Asignar
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(user)}
                          disabled={isLoading}
                          title="Editar usuario"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        {!isAdminView && currentUserRole === 'admin' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteUser(user.id, user.role)}
                            disabled={
                              isLoading ||
                              user.id === currentUser?.id ||
                              (user.role === "admin" && currentUserRole !== "admin")
                            }
                            title="Eliminar de la organización (solo administrador)"
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>

      {/* Add user to organization (admin only) */}
      <Dialog open={addToOrgDialogOpen} onOpenChange={(open) => {
        if (!open) { setAddToOrgUser(null); setAddToOrgTenantId(""); }
        setAddToOrgDialogOpen(open);
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Agregar a organización</DialogTitle>
            <DialogDescription>
              {addToOrgUser
                ? `Agregar a ${addToOrgUser.full_name || addToOrgUser.email} a una organización con un rol.`
                : "Selecciona organización y rol."}
            </DialogDescription>
          </DialogHeader>
          {addToOrgUser && (
            <form onSubmit={handleAddToOrgSubmit} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Organización</Label>
                <Select value={addToOrgTenantId} onValueChange={setAddToOrgTenantId} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Elegir organización" />
                  </SelectTrigger>
                  <SelectContent>
                    {tenants
                      .filter(t => !addToOrgUser.organizations?.some(o => o.tenant_id === t.id))
                      .map(t => (
                        <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                {tenants.filter(t => !addToOrgUser.organizations?.some(o => o.tenant_id === t.id)).length === 0 && (
                  <p className="text-sm text-muted-foreground">El usuario ya está en todas las organizaciones.</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Rol</Label>
                <Select value={addToOrgRole} onValueChange={(v: "admin" | "teacher" | "student") => setAddToOrgRole(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrador</SelectItem>
                    <SelectItem value="teacher">Profesor</SelectItem>
                    <SelectItem value="student">Estudiante</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setAddToOrgDialogOpen(false)}>Cancelar</Button>
                <Button type="submit" disabled={isAddingToOrg || !addToOrgTenantId}>
                  {isAddingToOrg && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Agregar
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Import Users Dialog */}
      <Dialog open={importDialogOpen} onOpenChange={(open) => {
        setImportDialogOpen(open);
        if (!open) { setImportFile(null); setImportPreview([]); setImportResult(null); }
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Importar usuarios
            </DialogTitle>
            <DialogDescription>
              Sube un archivo .txt o .csv. Formato: una línea por usuario. CSV: email, nombre, rol. TXT: email por línea o email,nombre,rol. Rol por defecto: student.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-2">
              <Input
                ref={fileInputRef as any}
                type="file"
                accept=".txt,.csv"
                className="hidden"
                onChange={handleImportFileChange}
              />
              <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                Elegir archivo .txt o .csv
              </Button>
              {importFile && <span className="text-sm text-muted-foreground">{importFile.name}</span>}
            </div>
            <div className="space-y-2">
              <Label>Contraseña por defecto para nuevos usuarios</Label>
              <Input
                type="password"
                value={importDefaultPassword}
                onChange={(e) => setImportDefaultPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
              />
            </div>
            {importPreview.length > 0 && (
              <div className="border rounded-lg max-h-48 overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Rol</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {importPreview.slice(0, 20).map((row, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium">{row.email}</TableCell>
                        <TableCell>{row.full_name}</TableCell>
                        <TableCell>{row.role}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {importPreview.length > 20 && <p className="text-xs text-muted-foreground p-2">y {importPreview.length - 20} más</p>}
              </div>
            )}
            {importResult && (
              <div className="p-3 rounded-lg bg-muted text-sm">
                <p className="font-medium">Creados: {importResult.success}</p>
                {importResult.errors.length > 0 && (
                  <ul className="mt-2 text-destructive text-xs list-disc list-inside">
                    {importResult.errors.slice(0, 5).map((e, i) => <li key={i}>{e}</li>)}
                    {importResult.errors.length > 5 && <li>… y {importResult.errors.length - 5} más</li>}
                  </ul>
                )}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setImportDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleImportUsers} disabled={isImporting || importPreview.length === 0}>
              {isImporting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Importar {importPreview.length > 0 ? `(${importPreview.length})` : ""}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Placement Test Assignment Dialog */}
      <Dialog open={placementTestDialogOpen} onOpenChange={(open) => { setPlacementTestDialogOpen(open); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Asignar Test de Nivelación</DialogTitle>
            <DialogDescription>
              Selecciona los estudiantes a quienes asignar el test de nivelación. Podrán realizarlo antes de asignarles lecciones para ver su desempeño.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-64 overflow-y-auto space-y-2 py-4">
            {users.filter(u => u.role === 'student' || !u.role).map((u) => (
              <div key={u.id} className="flex items-center gap-3 p-2 hover:bg-muted/50 rounded">
                <Checkbox
                  id={`pt-${u.id}`}
                  checked={placementTestSelectedIds.has(u.id)}
                  onCheckedChange={(checked) => {
                    setPlacementTestSelectedIds(prev => {
                      const next = new Set(prev);
                      if (checked) next.add(u.id); else next.delete(u.id);
                      return next;
                    });
                  }}
                />
                <label htmlFor={`pt-${u.id}`} className="flex-1 cursor-pointer text-sm">
                  {u.full_name || u.email}
                </label>
                {placementTestAssignedIds.has(u.id) && (
                  <span className="text-xs text-muted-foreground">asignado</span>
                )}
              </div>
            ))}
            {users.filter(u => u.role === 'student' || !u.role).length === 0 && (
              <p className="text-sm text-muted-foreground">No hay estudiantes en esta organización.</p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPlacementTestDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSavePlacementTestAssignments} disabled={isAssigningPlacementTest}>
              {isAssigningPlacementTest && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Lessons Dialog */}
      <Dialog open={assignDialogOpen} onOpenChange={(open) => {
        setAssignDialogOpen(open);
        if (!open) { setAssigningUser(null); setAssignmentDueDate(""); setAssignmentTimeLimitMinutes(""); }
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Asignar Lecciones a {assigningUser?.full_name || "Estudiante"}</DialogTitle>
            <DialogDescription>
              Selecciona las lecciones que el estudiante debe completar. Opcionalmente define una fecha límite para temporizar las lecciones.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="assign-due-date">Fecha límite (opcional)</Label>
                <Input
                  id="assign-due-date"
                  type="datetime-local"
                  value={assignmentDueDate}
                  onChange={(e) => setAssignmentDueDate(e.target.value)}
                  min={new Date().toISOString().slice(0, 16)}
                />
                <p className="text-xs text-muted-foreground">Fecha y hora tope.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="assign-time-limit">Límite en minutos (opcional)</Label>
                <Input
                  id="assign-time-limit"
                  type="number"
                  min={1}
                  placeholder="Ej: 30"
                  value={assignmentTimeLimitMinutes}
                  onChange={(e) => setAssignmentTimeLimitMinutes(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Tiempo permitido desde la asignación.</p>
              </div>
            </div>
            {availableLessons.length > 0 && (
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="text-sm text-muted-foreground">
                  Seleccionadas: <span className="font-medium text-foreground">{assignedLessonIds.length}</span> / {availableLessons.length}
                </div>
                {(() => {
                  const allLessonIds = availableLessons.map((l) => l.id);
                  const assignedSet = new Set(assignedLessonIds);
                  const allSelected = allLessonIds.length > 0 && allLessonIds.every((id) => assignedSet.has(id));
                  const noneSelected = assignedLessonIds.length === 0;
                  return (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={isAssigning || noneSelected}
                      onClick={() => {
                        assignDialogUserHasChangedSelection.current = true;
                        if (allSelected) {
                          setAssignedLessonIds([]);
                        } else if (!noneSelected) {
                          setAssignedLessonIds([...allLessonIds]);
                        }
                      }}
                    >
                      {noneSelected ? "Ninguna seleccionada" : allSelected ? "Deseleccionar todo" : "Seleccionar todo"}
                    </Button>
                  );
                })()}
              </div>
            )}
            {availableLessons.length === 0 ? (
              <p className="text-muted-foreground text-sm">No hay lecciones disponibles en esta organización.</p>
            ) : (
              <div className="border rounded-lg max-h-80 overflow-y-auto p-2 space-y-4">
                {(['A1', 'A2', 'B1', 'B2'] as const).map((level) => {
                  const levelLessons = availableLessons.filter((l) => l.level === level);
                  if (levelLessons.length === 0) return null;
                  return (
                    <div key={level}>
                      <div className="sticky top-0 bg-muted/90 backdrop-blur px-2 py-1.5 rounded text-xs font-semibold text-muted-foreground uppercase tracking-wide border-b mb-2">
                        Nivel {level}
                      </div>
                      <div className="space-y-1">
                        {levelLessons.map((lesson) => (
                          <div key={lesson.id} className="flex items-center gap-3 p-2 hover:bg-muted/50 rounded">
                            <Checkbox
                              id={`assign-${lesson.id}`}
                              checked={assignedLessonIds.includes(lesson.id)}
                              onCheckedChange={(checked) => {
                                assignDialogUserHasChangedSelection.current = true;
                                setAssignedLessonIds((prev) => {
                                  const has = prev.includes(lesson.id);
                                  if (checked) return has ? prev : [...prev, lesson.id];
                                  return has ? prev.filter((id) => id !== lesson.id) : prev;
                                });
                              }}
                            />
                            <label htmlFor={`assign-${lesson.id}`} className="flex-1 cursor-pointer">
                              <span className="font-medium">{lesson.title}</span>
                              <span className="text-xs text-muted-foreground ml-2">({lesson.level})</span>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveAssignments} disabled={isAssigning}>
              {isAssigning && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Guardar asignaciones
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default UsersManagement;

