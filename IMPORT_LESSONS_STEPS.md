# 📥 Pasos para Importar Lecciones a Supabase

## Método Rápido (Recomendado)

### Paso 1: Acceder como Administrador
1. Inicia sesión en la aplicación
2. Asegúrate de estar en una organización donde tengas rol de **admin**

### Paso 2: Ir a la Página de Importación
1. Ve a: **`/admin`** (Panel de Administración)
2. Haz clic en la pestaña **"Lecciones"**
3. Haz clic en el botón **"Importar Lecciones"** (botón azul con ícono de libro)

### Paso 3: Importar Lecciones
1. Verás checkboxes para seleccionar niveles:
   - ✅ A1 (Básico) - 24 lecciones
   - ✅ A2 (Intermedio) - 32 lecciones
   - ✅ B1 (Avanzado) - 40 lecciones
   - ⬜ B2 (Avanzado Superior) - 0 lecciones (no disponible aún)

2. Por defecto, A1, A2 y B1 están seleccionados
3. Haz clic en **"Importar Lecciones"**
4. Espera a que se complete (verás una barra de progreso)
5. Verás un resumen con:
   - ✅ Lecciones exitosas
   - ❌ Errores
   - ⏭️ Omitidas (duplicados)

### Paso 4: Verificar
1. Ve a **`/admin`** → Pestaña "Lecciones"
2. Deberías ver todas las lecciones importadas
3. Filtra por nivel para verificar

---

## Método Alternativo: Consola del Navegador

Si prefieres usar la consola:

1. **Inicia sesión como admin**
2. **Abre la consola** (F12 → Console)
3. **Ejecuta:**

```javascript
// Obtener Tenant ID actual
const tenantId = localStorage.getItem('currentTenantId');
console.log('Tenant ID:', tenantId);

// Importar todas las lecciones
await window.seedLessons(tenantId, ['A1', 'A2', 'B1']);

// Ver resultado
// { success: 96, errors: 0, skipped: 0 }
```

---

## ✅ ¿Qué se Importa?

Cada lección incluye:
- **Título**: Nombre de la lección
- **Nivel**: A1, A2, B1, B2
- **Duración**: Tiempo estimado (ej: "15 min")
- **Dificultad**: Básico, Intermedio, Avanzado
- **Tipo**: Vocabulario, Gramática, Conversación, etc.
- **Objetivos**: Array de objetivos de aprendizaje
- **Contenido**: 
  - Vocabulary (vocabulario con traducción y pronunciación)
  - Exercises (ejercicios interactivos)

---

## 📊 Estadísticas de Importación

- **Total de lecciones disponibles**: 96
  - A1: 24 lecciones
  - A2: 32 lecciones
  - B1: 40 lecciones
  - B2: 0 lecciones (se pueden agregar manualmente)

---

## 🔍 Verificar en la Base de Datos

1. Ve a tu proyecto de Supabase
2. Abre la tabla `lessons`
3. Filtra por `tenant_id` = tu ID de organización
4. Deberías ver todas las lecciones importadas

---

## ⚠️ Notas Importantes

- **Las lecciones son por organización**: Cada tenant tiene su propio catálogo
- **No se duplican**: Si importas dos veces, las lecciones duplicadas se omiten
- **Orden correcto**: Las lecciones se importan en el orden correcto según el nivel
- **Inserción por lotes**: Se insertan en grupos de 10 para mejor rendimiento

---

## 🎯 Después de Importar

Una vez importadas, las lecciones estarán disponibles para:
- ✅ Ver en `/lecciones`
- ✅ Tomar en `/leccion/:id`
- ✅ Gestionar en `/admin` → Lecciones
- ✅ Ver progreso en `/progreso`

---

¡Listo! 🎉 Tus lecciones están ahora en la base de datos.

