# 📚 Guía de Asignación de Lecciones a Estudiantes

## 🔍 Cómo Funciona el Sistema Actual

### ✅ **Lecciones Automáticas por Tenant**

En el sistema actual, **las lecciones NO necesitan ser asignadas manualmente a estudiantes**. El sistema funciona así:

1. **Lecciones son Tenant-Específicas**: Cuando importas o creas lecciones, se asocian automáticamente a un tenant (organización).

2. **Visibilidad Automática**: **TODOS los miembros de un tenant** (estudiantes, profesores, administradores) pueden ver **TODAS las lecciones activas** de ese tenant automáticamente.

3. **No se Requiere Asignación**: No hay necesidad de asignar lecciones individualmente a cada estudiante. Si un estudiante es miembro del tenant, verá todas las lecciones.

---

## 📋 Proceso para que Estudiantes Vean las Lecciones

### Paso 1: Importar Lecciones (Admin)

1. Ve a `/admin` → Pestaña **"Lecciones"**
2. Click en **"Importar Lecciones"**
3. Selecciona la fuente:
   - **Lecciones Predeterminadas**: Lecciones del sistema (A1, A2, B1, B2)
   - **Curso-Ingles.com**: Lecciones de gramática A1
4. Selecciona los niveles (si es lecciones predeterminadas)
5. Click en **"Importar Lecciones"**

### Paso 2: Verificar que las Lecciones se Importaron

1. En la pestaña **"Lecciones"** del admin, deberías ver todas las lecciones importadas
2. Verifica que las lecciones tienen `is_active = true`

### Paso 3: Estudiantes Ven las Lecciones Automáticamente

**Los estudiantes NO necesitan hacer nada especial**. Las lecciones son visibles automáticamente si:

- ✅ El estudiante es miembro del tenant (tiene un rol en `user_roles`)
- ✅ Las lecciones tienen `is_active = true`
- ✅ El estudiante está en la página `/lecciones` o `/student`

---

## 🔄 Si los Estudiantes No Ven las Lecciones

### Solución 1: Refrescar la Página

Los estudiantes pueden:
1. Click en el botón **"Refrescar"** en la página de lecciones
2. O recargar la página (F5 o Ctrl+R)

### Solución 2: Verificar Membresía del Tenant

Asegúrate de que el estudiante:
1. Tiene un rol en `user_roles` para ese tenant
2. El rol puede ser: `student`, `teacher`, o `admin`

**Verificar en Admin:**
- Ve a `/admin` → Pestaña **"Usuarios"**
- Verifica que el estudiante aparece en la lista
- Si no aparece, invítalo o asigna un rol manualmente

### Solución 3: Verificar que las Lecciones Están Activas

En `/admin` → **"Lecciones"**:
- Verifica que las lecciones tienen el checkbox `is_active` marcado
- Si no, marca las lecciones como activas

### Solución 4: Verificar Tenant Seleccionado

Asegúrate de que:
1. El estudiante tiene el tenant correcto seleccionado
2. Puede cambiar de tenant en `/tenant-select` si tiene múltiples tenants

---

## 🎯 Flujo Completo de Ejemplo

### Escenario: Importar Lecciones y que Estudiantes las Vean

1. **Admin importa lecciones:**
   ```
   Admin → /admin → Lecciones → Importar Lecciones
   → Selecciona "Curso-Ingles.com"
   → Click "Importar Lecciones"
   → ✅ 24 lecciones importadas
   ```

2. **Estudiante ve las lecciones:**
   ```
   Estudiante → /student o /lecciones
   → ✅ Ve automáticamente las 24 lecciones
   → Puede hacer click en "Comenzar" para empezar
   ```

3. **Si no aparecen:**
   ```
   Estudiante → Click "Refrescar"
   → O recargar página (F5)
   → ✅ Lecciones aparecen
   ```

---

## 📊 Estructura de Datos

### Tabla `lessons`
```sql
- tenant_id: UUID (ID del tenant/organización)
- is_active: BOOLEAN (true = visible, false = oculta)
- title, level, content, etc.
```

### Tabla `user_roles`
```sql
- user_id: UUID (ID del usuario/estudiante)
- tenant_id: UUID (ID del tenant)
- role: 'student' | 'teacher' | 'admin'
```

### Política RLS (Row Level Security)
```sql
-- Todos los miembros del tenant pueden ver lecciones
CREATE POLICY "Tenant members can view lessons"
  ON public.lessons
  FOR SELECT
  USING (public.is_tenant_member(auth.uid(), tenant_id));
```

---

## ❓ Preguntas Frecuentes

### ¿Necesito asignar lecciones a cada estudiante?
**No.** Las lecciones son automáticamente visibles para todos los miembros del tenant.

### ¿Puedo ocultar lecciones de algunos estudiantes?
**Sí.** Puedes:
- Marcar lecciones como `is_active = false` (oculta para todos)
- O crear un sistema de asignación personalizado (requiere desarrollo adicional)

### ¿Los estudiantes ven lecciones de otros tenants?
**No.** Solo ven lecciones del tenant al que pertenecen.

### ¿Cómo asigno lecciones a estudiantes específicos?
**Actualmente no es posible** sin desarrollo adicional. El sistema está diseñado para que todas las lecciones del tenant sean visibles para todos los miembros.

Si necesitas asignación granular, necesitarías:
1. Crear tabla `lesson_assignments`
2. Modificar las queries para filtrar por asignaciones
3. Agregar UI para asignar lecciones a estudiantes específicos

---

## 🚀 Mejoras Futuras Sugeridas

Si necesitas un sistema de asignación más granular, podrías:

1. **Crear tabla de asignaciones:**
   ```sql
   CREATE TABLE lesson_assignments (
     id UUID PRIMARY KEY,
     lesson_id UUID REFERENCES lessons(id),
     user_id UUID REFERENCES auth.users(id),
     tenant_id UUID REFERENCES tenants(id),
     assigned_by UUID REFERENCES auth.users(id),
     assigned_at TIMESTAMP DEFAULT now(),
     due_date TIMESTAMP,
     UNIQUE(lesson_id, user_id, tenant_id)
   );
   ```

2. **Modificar queries** para filtrar por asignaciones

3. **Agregar UI** en admin para asignar lecciones a estudiantes específicos

---

## 📝 Resumen

✅ **Lecciones son automáticamente visibles** para todos los miembros del tenant  
✅ **No se requiere asignación manual**  
✅ **Estudiantes solo necesitan refrescar** si no ven las lecciones inmediatamente  
✅ **Verificar membresía del tenant** si hay problemas  
✅ **Lecciones deben estar activas** (`is_active = true`)

