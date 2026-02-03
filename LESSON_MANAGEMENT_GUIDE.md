# Guía de Gestión de Lecciones por Grados/Tenants

## 📚 Flujo para Agregar Lecciones a Tenants/Usuarios por Grados

### Visión General

El sistema permite que cada organización (tenant) tenga su propio catálogo de lecciones. Las lecciones se pueden asignar a usuarios según su grado/nivel, pero actualmente las lecciones están organizadas por niveles de inglés (A1, A2, B1, B2) y son compartidas dentro de un tenant.

---

## 🎯 Flujo Actual de Lecciones

### 1. **Estructura de Datos**

```
Tenant (Organización)
  └── Lessons (Lecciones)
      ├── Level: A1, A2, B1, B2, C1, C2
      ├── Type: Vocabulario, Gramática, Conversación, etc.
      └── Content: JSONB con vocabulary y exercises

User (Usuario)
  └── Lesson Progress (Progreso por lección)
      ├── Progress Percentage
      ├── Completed Status
      └── Exercise Results
```

### 2. **Cómo Agregar Lecciones a un Tenant**

#### Opción A: Usando el Panel de Administración (Recomendado)

1. **Iniciar sesión como Admin**
   - Accede a `/admin`
   - Ve a la pestaña "Lecciones"

2. **Crear Lección Manualmente**
   - Click en "Nueva Lección"
   - Completa el formulario:
     - Título
     - Nivel (A1, A2, B1, B2)
     - Duración
     - Dificultad
     - Tipo
     - Objetivos (uno por línea)
     - Contenido (JSON con vocabulary y exercises)

3. **Formato del Contenido JSON:**
```json
{
  "vocabulary": [
    {
      "english": "Hello",
      "spanish": "Hola",
      "pronunciation": "/həˈloʊ/"
    }
  ],
  "exercises": [
    {
      "type": "multiple-choice",
      "question": "¿Cómo dices 'Hola'?",
      "options": ["Hello", "Goodbye", "Thanks"],
      "correct": 0
    }
  ]
}
```

#### Opción B: Importar Lecciones Masivamente (Script)

1. **Obtener el Tenant ID**
   - Ve a `/admin` → Pestaña "Organizaciones"
   - Copia el ID de tu organización

2. **Ejecutar el Script de Importación**

**En el navegador (consola):**
```javascript
// 1. Asegúrate de estar logueado como admin
// 2. Abre la consola del navegador (F12)
// 3. Ejecuta:

// Importar todas las lecciones (A1, A2, B1, B2)
await window.seedLessons('TU_TENANT_ID_AQUI', ['A1', 'A2', 'B1', 'B2']);

// O importar solo niveles específicos
await window.seedLessons('TU_TENANT_ID_AQUI', ['A1']); // Solo A1
await window.seedLessons('TU_TENANT_ID_AQUI', ['A1', 'A2']); // A1 y A2
```

**O crear un script TypeScript:**
```typescript
import { seedLessonsForTenant } from '@/scripts/seedLessons';

// Ejecutar en tu código
await seedLessonsForTenant('TU_TENANT_ID', ['A1', 'A2', 'B1', 'B2']);
```

---

## 📊 Organización por Grados (Futuro)

### Concepto Actual vs. Futuro

**Actual:**
- Lecciones están organizadas por **niveles de inglés** (A1, A2, B1, B2)
- Todas las lecciones de un tenant son visibles para todos los usuarios del tenant
- Los usuarios pueden elegir qué lecciones hacer

**Futuro (Sugerido):**
- Agregar campo `grade` o `grade_level` a la tabla `lessons`
- Crear tabla `user_grades` para asociar usuarios con grados
- Filtrar lecciones por grado del usuario

### Implementación Sugerida para Grados

```sql
-- Agregar campo grade a lessons
ALTER TABLE public.lessons 
ADD COLUMN grade_level TEXT CHECK (grade_level IN ('1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'));

-- Crear tabla de grados de usuarios
CREATE TABLE public.user_grades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  grade_level TEXT NOT NULL,
  school_year TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, tenant_id)
);
```

---

## 🔄 Flujo Completo de Gestión

### Para Administradores:

1. **Crear/Seleccionar Tenant**
   - Crear nueva organización o seleccionar existente

2. **Agregar Lecciones**
   - Manualmente desde el panel admin
   - O importar masivamente usando el script

3. **Asignar Lecciones a Grados** (Futuro)
   - Marcar lecciones con nivel de grado
   - Los estudiantes verán solo lecciones de su grado

### Para Estudiantes:

1. **Seleccionar Tenant**
   - Al iniciar sesión, seleccionar su organización

2. **Ver Lecciones Disponibles**
   - Filtrar por nivel (A1, A2, B1, B2)
   - Ver progreso en cada lección

3. **Completar Lecciones**
   - El progreso se guarda automáticamente
   - Los logros se desbloquean al completar lecciones

---

## 📝 Ejemplo de Uso del Script de Importación

### Paso 1: Obtener Tenant ID

1. Inicia sesión como admin
2. Ve a `/admin`
3. Abre la consola del navegador (F12)
4. Ejecuta:
```javascript
// Obtener tenant actual
const { data } = await supabase.from('tenants').select('id, name').limit(1);
console.log('Tenant ID:', data[0].id);
```

### Paso 2: Importar Lecciones

```javascript
// Importar todas las lecciones disponibles
const result = await window.seedLessons(
  'TU_TENANT_ID_AQUI',
  ['A1', 'A2', 'B1', 'B2']
);

console.log('Resultado:', result);
// { success: 96, errors: 0, skipped: 0 }
```

### Paso 3: Verificar

1. Ve a `/admin` → Pestaña "Lecciones"
2. Deberías ver todas las lecciones importadas
3. Filtra por nivel para verificar

---

## 🎓 Lecciones Disponibles por Nivel

### A1 (Básico) - 24 lecciones
- Saludos y Despedidas
- El Alfabeto
- Números del 1 al 20
- Colores y Objetos
- Pronombres Personales
- Verbo 'To Be'
- Días y Meses
- La Familia
- Y más...

### A2 (Intermedio) - 32 lecciones
- Presente Continuo
- Simple Past - Regular Verbs
- Adverbios de Frecuencia
- Comparativos y Superlativos
- Futuro con Will/Going to
- Y más...

### B1 (Avanzado) - 40 lecciones
- Present Perfect vs Simple Past
- Presente Perfecto Continuo
- Voz Pasiva
- Condicionales
- Phrasal Verbs
- Y más...

### B2 (Avanzado Superior) - 0 lecciones actualmente
- Se pueden agregar manualmente

---

## 🔧 Troubleshooting

### Error: "No tienes permisos"
- Asegúrate de estar logueado como admin del tenant
- Verifica que tu rol sea 'admin' en la tabla `user_roles`

### Error: "Duplicate key"
- La lección ya existe en el tenant
- El script automáticamente omite duplicados

### Lecciones no aparecen
- Verifica que `is_active = true`
- Asegúrate de estar en el tenant correcto
- Revisa los filtros en la página de lecciones

---

## 📌 Notas Importantes

1. **Tenant-Specific**: Cada organización tiene su propio catálogo de lecciones
2. **No se comparten entre tenants**: Las lecciones son privadas por organización
3. **Progreso por usuario**: Cada usuario tiene su propio progreso por lección
4. **Orden**: Las lecciones se ordenan por `order_index` dentro de cada nivel

---

## 🚀 Próximos Pasos Sugeridos

1. **Agregar soporte para grados escolares**
2. **Sistema de asignación automática** de lecciones por grado
3. **Plantillas de lecciones** para facilitar creación
4. **Importación desde archivos CSV/Excel**
5. **Sistema de versionado** de lecciones

