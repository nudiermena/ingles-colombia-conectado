# Options Curriculum Implementation Plan

## Overview
This document outlines the implementation plan for integrating the "Options" curriculum structure into the platform.

## Current System
- **Lessons**: Basic lessons with vocabulary, grammar, exercises
- **Tenants**: Organizations (schools)
- **Users**: Admin, Teacher, Student roles
- **Progress**: Tracks lesson completion

## Target Structure (Options Curriculum)

### 1. Course Structure
- **Options 1** → CEFR A1+ → Towards A2 Key for Schools
- **Options 2** → CEFR A2 → A2 Key for Schools  
- **Options 3** → CEFR B1 → B1 Preliminary for Schools
- **Options 4** → CEFR B1+ → Towards B2 First

### 2. Unit Structure (per Course)
Each unit contains:
- **Vocabulary** (topics, word lists)
- **Grammar** (structures, rules)
- **Listening** (audio exercises, comprehension)
- **Reading** (texts, articles, comprehension)
- **Speaking & Pronunciation** (dialogues, practice)
- **Writing** (tasks, formats)
- **Learning for life / Learning to learn** (skills, projects)
- **Culture and CLIL/SDG** (cultural content, sustainable development goals)

### 3. Digital Resources
- Videos (CLIL, documentaries, animations, vlogs, songs, grammar raps)
- Audio files
- E-books (Student's Book, Workbook)
- Exam Practice
- Vocabulary Trainer
- Cyber Homework
- Personal Learning Track

### 4. Teacher Resources
- Presentation Software (IWB)
- Testbuilder + Test Audio
- Placement Test
- Teacher's Book content

## Implementation Phases

### Phase 1: Database Schema ✅ (In Progress)
- [x] Create `courses` table
- [x] Create `units` table  
- [x] Create `unit_content` table (flexible for all content types)
- [x] Create `course_resources` table (videos, audio, files)
- [x] Link to existing `lessons` table (for backward compatibility)

### Phase 2: Admin UI - Course Management
- [ ] Course CRUD in Admin panel
- [ ] Unit CRUD per course
- [ ] Content editor for each content type (Vocabulary, Grammar, etc.)
- [ ] Resource upload/management (videos, audio)

### Phase 3: Student UI - Course Navigation
- [ ] Course selection page
- [ ] Unit navigation within course
- [ ] Content display (Vocabulary, Grammar, Reading, etc.)
- [ ] Progress tracking per unit/course

### Phase 4: Advanced Features
- [ ] Exam Practice module
- [ ] Vocabulary Trainer
- [ ] Personal Learning Track
- [ ] Teacher dashboard with resources

## Database Schema

### Tables Created:
1. **courses** - Options 1-4, CEFR mapping
2. **units** - Units within courses (Welcome, Unit 1-8)
3. **unit_content** - Flexible content storage (vocabulary, grammar, etc.)
4. **course_resources** - Digital files (videos, audio, PDFs)
5. **course_enrollments** - Student enrollment in courses
6. **unit_progress** - Student progress per unit

## Next Steps
1. Review and apply database migration
2. Create Course Management component
3. Create Unit Management component
4. Build student course navigation
5. Add resource upload functionality
