/**
 * Script to seed lessons from lessonsData (with enhanced content) into Supabase for a specific tenant.
 * Uses getEnhancedLessonsData() so lessons get extra exercises, reading, and listening when available.
 * If a lesson already exists (same tenant_id + title), it is UPDATED with the latest content (ingest).
 *
 * Usage:
 * 1. Get your tenant ID from Admin → Organizaciones
 * 2. In browser console (logged in): await seedLessons('your-tenant-uuid')
 * 3. Or run via npm script if configured
 */

import { supabase } from '@/integrations/supabase/client';
import { getEnhancedLessonsData } from '@/data/lessonsDataEnhanced';

interface LessonData {
  id: number;
  title: string;
  level: string;
  duration: string;
  difficulty: string;
  rating: number;
  type: string;
  objectives: string[];
  content: {
    vocabulary?: Array<{ english: string; spanish: string; pronunciation: string }>;
    exercises?: Array<any>;
    reading?: Array<any>;
    listening?: Array<any>;
  };
}

export const seedLessonsForTenant = async (
  tenantId: string,
  levels: string[] = ['A1', 'A2', 'B1', 'B2']
): Promise<{ success: number; errors: number; skipped: number; updated: number; inserted: number }> => {
  let success = 0;
  let errors = 0;
  let skipped = 0;
  let updated = 0;
  let inserted = 0;

  if (!tenantId) {
    throw new Error('Tenant ID is required');
  }

  console.log(`Starting to seed lessons for tenant: ${tenantId}`);
  console.log(`Levels to import: ${levels.join(', ')}`);
  console.log('Using enhanced content (extra exercises, reading, listening where defined).');

  const lessonsData = getEnhancedLessonsData();

  // Verify tenant exists
  const tenantResponse = await supabase
    .from('tenants' as any)
    .select('id, name')
    .eq('id', tenantId)
    .single();

  if (tenantResponse.error || !tenantResponse.data) {
    throw new Error(`Tenant not found: ${tenantResponse.error?.message || 'Unknown error'}`);
  }

  const tenant = tenantResponse.data as unknown as { id: string; name: string };
  console.log(`Tenant verified: ${tenant.name}`);

  // Filter and sort lessons by level and original ID to maintain order
  const lessonsToImport = Object.values(lessonsData)
    .filter((lesson: any) => levels.includes(lesson.level))
    .sort((a: any, b: any) => {
      const levelOrder = { A1: 1, A2: 2, B1: 3, B2: 4 };
      const levelDiff = (levelOrder[a.level as keyof typeof levelOrder] || 99) -
        (levelOrder[b.level as keyof typeof levelOrder] || 99);
      if (levelDiff !== 0) return levelDiff;
      return a.id - b.id;
    }) as LessonData[];

  console.log(`Found ${lessonsToImport.length} lessons to import`);

  // Get existing lessons for this tenant (id, title, level) for upsert
  const { data: existingLessons } = await supabase
    .from('lessons' as any)
    .select('id, title, level')
    .eq('tenant_id', tenantId);

  const existingMap = new Map<string, { id: string }>(
    (existingLessons || []).map((l: any) => [`${l.title}::${l.level}`, { id: l.id }])
  );

  // Group lessons by level for order_index
  const lessonsByLevel: Record<string, LessonData[]> = {};
  lessonsToImport.forEach(lesson => {
    if (!lessonsByLevel[lesson.level]) lessonsByLevel[lesson.level] = [];
    lessonsByLevel[lesson.level].push(lesson);
  });

  const lessonsToUpdate: Array<{ id: string; data: any }> = [];
  const lessonsToInsert: any[] = [];

  for (const level of levels) {
    const levelLessons = lessonsByLevel[level] || [];
    for (let i = 0; i < levelLessons.length; i++) {
      const lesson = levelLessons[i];
      const uniqueKey = `${lesson.title}::${lesson.level}`;
      const payload = {
        tenant_id: tenantId,
        title: lesson.title,
        level: lesson.level,
        duration: lesson.duration,
        difficulty: lesson.difficulty,
        rating: lesson.rating ?? 0,
        type: lesson.type,
        objectives: lesson.objectives || [],
        content: lesson.content || {},
        order_index: i,
        is_active: true,
      };
      const existing = existingMap.get(uniqueKey);
      if (existing) {
        lessonsToUpdate.push({ id: existing.id, data: payload });
      } else {
        lessonsToInsert.push(payload);
      }
    }
  }

  // Update existing lessons (ingest enhanced content)
  for (const { id, data } of lessonsToUpdate) {
    try {
      const { error } = await supabase
        .from('lessons' as any)
        .update({
          duration: data.duration,
          difficulty: data.difficulty,
          rating: data.rating,
          type: data.type,
          objectives: data.objectives,
          content: data.content,
          order_index: data.order_index,
          is_active: data.is_active,
        })
        .eq('id', id);

      if (error) {
        console.error(`Error updating ${data.title}:`, error);
        errors++;
      } else {
        console.log(`✓ Updated: ${data.title} (${data.level})`);
        success++;
        updated++;
      }
    } catch (err: any) {
      console.error(`Error updating ${data.title}:`, err);
      errors++;
    }
  }

  // Insert new lessons in batches
  const chunkSize = 10;
  for (let i = 0; i < lessonsToInsert.length; i += chunkSize) {
    const chunk = lessonsToInsert.slice(i, i + chunkSize);
    try {
      const { error } = await supabase
        .from('lessons' as any)
        .insert(chunk as any)
        .select();

      if (error) {
        for (const row of chunk) {
          try {
            const { error: singleError } = await supabase
              .from('lessons' as any)
              .insert(row as any)
              .select();
            if (singleError) {
              console.error(`Error inserting ${row.title}:`, singleError);
              errors++;
            } else {
              console.log(`✓ Inserted: ${row.title} (${row.level})`);
              success++;
              inserted++;
            }
          } catch (e: any) {
            console.error(`Error inserting ${row.title}:`, e);
            errors++;
          }
        }
      } else {
        chunk.forEach((row: any) => {
          console.log(`✓ Inserted: ${row.title} (${row.level})`);
          success++;
          inserted++;
        });
      }
    } catch (err: any) {
      console.error('Batch insert error:', err);
      errors += chunk.length;
    }
  }

  console.log('\n=== Seeding Complete ===');
  console.log(`Success: ${success} (${updated} updated, ${inserted} inserted)`);
  console.log(`Errors: ${errors}`);
  console.log(`Total: ${lessonsToImport.length}`);

  return { success, errors, skipped, updated, inserted };
};

// Browser console helper function
if (typeof window !== 'undefined') {
  (window as any).seedLessons = async (tenantId: string, levels?: string[]) => {
    return await seedLessonsForTenant(tenantId, levels);
  };
}

