# Guía Rápida para Importar Lecciones

## 🚀 Importar Lecciones Hardcodeadas a Supabase

Las lecciones están actualmente hardcodeadas en `src/data/lessonsData.ts`. Para importarlas a la base de datos de Supabase, sigue estos pasos:

### Opción 1: Usando la Interfaz de Administración (Recomendado)

1. **Inicia sesión como Administrador**
   - Accede a tu aplicación
   - Inicia sesión con una cuenta que tenga rol de "admin" en tu organización

2. **Navega a la página de importación**
   - Ve a `/admin` (Panel de Administración)
   - Haz clic en la pestaña "Lecciones"
   - Haz clic en el botón **"Importar Lecciones"**

3. **Selecciona los niveles a importar**
   - Marca los niveles que deseas importar (A1, A2, B1, B2)
   - Por defecto, todos los niveles disponibles están seleccionados

4. **Inicia la importación**
   - Haz clic en **"Importar Lecciones"**
   - Espera a que se complete el proceso
   - Verás un resumen con lecciones exitosas, errores y omitidas

### Opción 2: Usando la Consola del Navegador

1. **Inicia sesión como Administrador**
   - Abre tu aplicación en el navegador
   - Inicia sesión con una cuenta admin

2. **Abre la consola del navegador**
   - Presiona `F12` o `Ctrl+Shift+I` (Windows/Linux)
   - O `Cmd+Option+I` (Mac)
   - Ve a la pestaña "Console"

3. **Obtén tu Tenant ID**
   ```javascript
   // Ejecuta esto en la consola para obtener tu Tenant ID
   const tenantId = localStorage.getItem('currentTenantId');
   console.log('Tenant ID:', tenantId);
   ```

4. **Ejecuta el script de importación**
   ```javascript
   // Importar todas las lecciones (A1, A2, B1)
   await window.seedLessons(tenantId, ['A1', 'A2', 'B1']);

   // O importar solo un nivel específico
   await window.seedLessons(tenantId, ['A1']); // Solo A1
   await window.seedLessons(tenantId, ['A1', 'A2']); // A1 y A2
   ```

### Lecciones Disponibles

- **A1 (Básico)**: 24 lecciones
  - Saludos y Despedidas
  - El Alfabeto en Inglés
  - Números del 1 al 20
  - Colores y Objetos
  - Y más...

- **A2 (Intermedio)**: 32 lecciones
  - Presente Continuo
  - Simple Past - Regular Verbs
  - Adverbios de Frecuencia
  - Comparativos y Superlativos
  - Y más...

- **B1 (Avanzado)**: 40 lecciones
  - Present Perfect vs Simple Past
  - Presente Perfecto Continuo
  - Voz Pasiva
  - Condicionales
  - Y más...

**Total: 96 lecciones** listas para importar

### Características de la Importación

✅ **Detección de duplicados**: Las lecciones con el mismo título y nivel se omiten automáticamente

✅ **Orden correcto**: Las lecciones se importan en el orden correcto según su nivel y ID original

✅ **Inserción por lotes**: Las lecciones se insertan en lotes para mejor rendimiento

✅ **Manejo de errores**: Si hay errores, el script continúa con las demás lecciones

✅ **Progreso en tiempo real**: Puedes ver el progreso en la consola o en la interfaz

### Verificar la Importación

Después de importar, puedes verificar:

1. **En el Panel de Administración**
   - Ve a `/admin` → Pestaña "Lecciones"
   - Deberías ver todas las lecciones importadas
   - Filtra por nivel para verificar

2. **En la página de Lecciones**
   - Ve a `/lecciones`
   - Deberías ver todas las lecciones disponibles para tu organización

3. **En la base de datos**
   - Ve a tu proyecto de Supabase
   - Abre la tabla `lessons`
   - Filtra por `tenant_id` para ver las lecciones de tu organización

### Solución de Problemas

#### Error: "No tienes permisos"
- Asegúrate de estar logueado como admin del tenant
- Verifica que tu rol sea 'admin' en la tabla `user_roles`

#### Error: "Duplicate key"
- Esto es normal si intentas importar lecciones que ya existen
- El script automáticamente omite duplicados

#### Las lecciones no aparecen
- Verifica que `is_active = true` en la base de datos
- Asegúrate de estar en el tenant correcto
- Revisa los filtros en la página de lecciones

#### Errores de inserción
- Verifica que la migración de base de datos se haya ejecutado
- Asegúrate de que las políticas RLS permitan la inserción
- Revisa la consola del navegador para ver errores específicos

### Notas Importantes

⚠️ **Tenant-Specific**: Cada organización tiene su propio catálogo de lecciones. Las lecciones importadas son privadas por organización.

⚠️ **No se comparten entre tenants**: Si importas lecciones en una organización, no estarán disponibles en otras organizaciones.

⚠️ **Orden de lecciones**: Las lecciones se ordenan por `order_index` dentro de cada nivel. Este índice se establece automáticamente durante la importación.

### Próximos Pasos

Después de importar las lecciones:

1. **Revisa las lecciones** en el panel de administración
2. **Edita si es necesario** cualquier lección
3. **Asigna lecciones a grados** (funcionalidad futura)
4. **Los estudiantes pueden comenzar** a tomar las lecciones

---

## 📝 Ejemplo de Uso Completo

```javascript
// 1. Obtener Tenant ID
const tenantId = localStorage.getItem('currentTenantId');
console.log('Importing for tenant:', tenantId);

// 2. Importar todas las lecciones
const result = await window.seedLessons(tenantId, ['A1', 'A2', 'B1']);

// 3. Ver resultado
console.log('Import result:', result);
// {
//   success: 96,
//   errors: 0,
//   skipped: 0
// }
```

---

¡Listo! Ahora tienes todas las lecciones importadas en tu base de datos. 🎉

