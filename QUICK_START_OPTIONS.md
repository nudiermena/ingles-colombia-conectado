# Quick Start Guide: Options Curriculum Implementation

## ✅ What's Been Created

### 1. Database Schema (`20250203000003_options_curriculum_schema.sql`)
- **courses** table - Options 1-4 courses
- **units** table - Units within courses (Welcome + Units 1-8)
- **unit_content** table - Flexible content storage (vocabulary, grammar, listening, etc.)
- **course_resources** table - Digital files (videos, audio, PDFs)
- **course_enrollments** table - Student enrollments
- **unit_progress** table - Student progress tracking

### 2. Admin UI Component (`CoursesManagement.tsx`)
- Full CRUD for courses
- Integrated into Admin panel as "Cursos" tab

## 🚀 Getting Started

### Step 1: Apply Database Migration

**Option A: Supabase Dashboard (Easiest)**
1. Go to your Supabase Dashboard → **SQL Editor**
2. Open the file: `supabase/migrations/20250203000003_options_curriculum_schema.sql`
3. Copy all the SQL content
4. Paste into SQL Editor and click **Run**

**Option B: Supabase CLI**
```bash
supabase db push
```

### Step 2: Test Course Creation

1. Log in as **Admin** or **Teacher**
2. Go to `/admin`
3. Click the **"Cursos"** tab
4. Click **"Nuevo Curso"**
5. Fill in:
   - **Número de Curso**: 1 (Options 1)
   - **Título**: Options
   - **Nivel CEFR**: A1+
   - **Examen Cambridge**: Towards A2 Key for Schools
   - **Horas por Semana**: 4-8/semana
6. Click **"Crear"**

You should see "Options 1" appear in the table!

### Step 3: Create All 4 Courses

Create courses for Options 1-4 with these mappings:

| Course | CEFR | Cambridge Exam |
|--------|------|---------------|
| Options 1 | A1+ | Towards A2 Key for Schools |
| Options 2 | A2 | A2 Key for Schools |
| Options 3 | B1 | B1 Preliminary for Schools |
| Options 4 | B1+ | Towards B2 First |

## 📋 Next Steps (To Implement)

### Phase 2: Unit Management
- [ ] Create `UnitsManagement.tsx` component
- [ ] Add "Unidades" tab in Admin
- [ ] CRUD for units within courses
- [ ] Support for Welcome unit + Units 1-8

### Phase 3: Content Management
- [ ] Create `UnitContentManagement.tsx` component
- [ ] Content editor for each type:
  - Vocabulary
  - Grammar
  - Listening
  - Reading
  - Speaking & Pronunciation
  - Writing
  - Learning for life
  - Culture & CLIL/SDG

### Phase 4: Resource Management
- [ ] File upload component for videos/audio
- [ ] Integration with Supabase Storage
- [ ] Resource linking to courses/units

### Phase 5: Student Interface
- [ ] Course selection page
- [ ] Unit navigation
- [ ] Content display pages
- [ ] Progress tracking

## 📚 Example: Creating a Unit

Once Unit Management is implemented, you'll be able to:

1. Select a course (e.g., Options 1)
2. Create units:
   - Welcome unit
   - Unit 1: Feeling fine
   - Unit 2: The arts
   - Unit 3: Time to celebrate
   - ... etc

3. For each unit, add content:
   - **Vocabulary**: Jobs, Applying for a job
   - **Grammar**: Question tags, Indirect questions
   - **Listening**: A job interview
   - **Reading**: A magazine article
   - etc.

## 🔍 Database Structure Overview

```
Tenant (Organization)
  └── Courses (Options 1-4)
      └── Units (Welcome + Units 1-8)
          └── Unit Content (Vocabulary, Grammar, etc.)
              └── Resources (Videos, Audio, PDFs)
```

## 💡 Tips

1. **Start Small**: Create one course first, then add units gradually
2. **Use JSON**: The `unit_content.content` field is JSONB - store structured data there
3. **Resources**: Upload files to Supabase Storage, then link them in `course_resources`
4. **Progress**: Students' progress is tracked automatically in `unit_progress`

## 🐛 Troubleshooting

**Error: "relation does not exist"**
- Make sure you ran the migration SQL in Supabase

**Error: "permission denied"**
- Check that you're logged in as admin or teacher
- Verify RLS policies are correct

**Courses not showing**
- Check that `tenant_id` matches your current organization
- Verify you're in the correct tenant

## 📖 Reference

- See `OPTIONS_CURRICULUM_IMPLEMENTATION.md` for full implementation plan
- Database schema details in migration file
- Component code in `src/components/admin/CoursesManagement.tsx`
