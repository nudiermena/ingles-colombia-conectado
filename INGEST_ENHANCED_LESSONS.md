# Ingest Enhanced Lessons into Supabase

## Navigation: From Lecciones to Enhanced Content

1. **Lecciones** (`/lecciones`) – List of all lessons for your organization.
2. Click **Comenzar** or **Repasar** on any lesson card → opens **Lección** (`/leccion/:id`).
3. On the lesson page you see (in order):
   - **Vocabulario** (vocabulary cards)
   - **Ejercicios** (multiple choice, fill-blank, pronunciation, etc.)
   - **Comprensión de Lectura** (reading passage + questions) – when the lesson has `content.reading`
   - **Comprensión Auditiva** (audio + questions) – when the lesson has `content.listening`
4. **Test de Nivelación** – From Lecciones, click the **Test de Nivelación** button (or go to `/placement-test`) to take the placement test.

So you don’t navigate to “new files” as separate pages: the new **reading** and **listening** sections appear inside each lesson when that lesson’s content includes them in the database.

---

## How Enhanced Content Gets Into the `lessons` Table

- **Source of truth:** `src/data/lessonsData.ts` (base lessons) + `src/data/lessonsDataEnhanced.ts` (extra exercises, reading, listening per lesson).
- **Seed script:** `src/scripts/seedLessons.ts` uses `getEnhancedLessonsData()` and **upserts** into Supabase:
  - If a lesson with the same **tenant_id** and **title** already exists → **update** its `content` (and other fields). That’s the “ingest” of enhanced content.
  - If it doesn’t exist → **insert** a new row.

So: **run the seed for your tenant** to both add new lessons and refresh existing ones with more questions/exercises and reading/listening.

---

## Steps to Ingest (Update + Insert) Lessons

### 1. Get your Tenant ID

- Log in as admin → go to **Admin** → **Organizaciones**.
- Copy the **ID** of the organization you want to seed.

### 2. Run the seed in the browser (recommended)

1. Log in to the app (admin or user with access to that tenant).
2. Open DevTools → **Console**.
3. Run:

```js
await seedLessons('YOUR-TENANT-UUID')
```

- Replace `YOUR-TENANT-UUID` with the tenant ID from step 1.
- Optional: pass levels to limit which levels are seeded, e.g.  
  `await seedLessons('YOUR-TENANT-UUID', ['A1', 'A2'])`

### 3. What the script does

- Loads **enhanced** lessons (from `lessonsData` + `lessonsDataEnhanced`).
- For each lesson:
  - **Exists** (same tenant + title) → **UPDATE** `content`, `objectives`, `duration`, etc.  
    → Existing lessons get the new exercises, reading, and listening.
  - **Does not exist** → **INSERT** new row.

After this, when you go to **Lecciones** and open a lesson (e.g. “Saludos y Despedidas”), you’ll see the extra exercises and the new reading/listening sections.

---

## Adding More Questions / Exercises / Reading / Listening

1. **Extra exercises and reading/listening for existing lessons**  
   Edit `src/data/lessonsDataEnhanced.ts`:
   - `enhancements` is keyed by `"Lesson Title::Level"` (e.g. `"Saludos y Despedidas::A1"`).
   - For each key you can set:
     - `exercises`: array of `{ type, question, options?, correct?, answer?, ... }`
     - `reading`: array of `{ title, passage, questions }`
     - `listening`: array of `{ title, textToSpeech?, transcript?, questions }`
   - Then run the seed again for your tenant; existing lessons will be **updated** with this content.

2. **Brand‑new lessons**  
   Add them to `src/data/lessonsData.ts` (and optionally add enhancements in `lessonsDataEnhanced.ts`). Run the seed again; they will be **inserted** for the tenant.

3. **Curso Inglés source**  
   For lessons coming from `cursoInglesLessons`, use `seedCursoInglesLessons(tenantId)`. That script also updates existing lessons by title. To add reading/listening to those, you’d need to add that content into `src/data/cursoInglesLessons.ts` and then run the Curso Inglés seed again.

---

## Quick reference

| Goal | Action |
|------|--------|
| See enhanced content (reading/listening) in the app | Run `seedLessons(tenantId)` so DB has latest `content`. Then open any lesson from Lecciones. |
| Add more questions/exercises to existing lessons | Edit `lessonsDataEnhanced.ts` → run `seedLessons(tenantId)` again. |
| Navigate from Lecciones to placement test | Click **Test de Nivelación** on Lecciones or go to `/placement-test`. |
| Ingest only (update DB without adding new lessons) | Run `seedLessons(tenantId)`; existing lessons are updated, new ones from data are inserted. |
