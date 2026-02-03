/**
 * Script to seed lessons from curso-ingles.com into Supabase for a specific tenant
 * Based on: https://curso-ingles.com/aprender/cursos/nivel-basico
 */

import { supabase } from '@/integrations/supabase/client';
import { cursoInglesLessons } from '@/data/cursoInglesLessons';

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
    vocabulary?: Array<{
      english: string;
      spanish: string;
      pronunciation: string;
    }>;
    exercises?: Array<any>;
  };
}

export const seedCursoInglesLessonsForTenant = async (
  tenantId: string
): Promise<{ success: number; errors: number; skipped: number; updated: number; inserted: number }> => {
  let success = 0;
  let errors = 0;
  let skipped = 0;
  let updated = 0;
  let inserted = 0;

  if (!tenantId) {
    throw new Error('Tenant ID is required');
  }

  console.log(`Starting to seed curso-ingles.com lessons for tenant: ${tenantId}`);
  
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

  // Get all lessons from cursoInglesLessons (all are A1)
  const lessonsToImport = Object.values(cursoInglesLessons) as LessonData[];

  console.log(`Found ${lessonsToImport.length} lessons to import`);

  // Get existing lessons for this tenant to check for duplicates
  const { data: existingLessons } = await supabase
    .from('lessons' as any)
    .select('id, title, level')
    .eq('tenant_id', tenantId);

  const existingLessonsMap = new Map(
    existingLessons?.map((l: any) => [`${l.title}::${l.level}`, l]) || []
  );

  // Prepare lessons to insert and update
  const lessonsToInsert = [];
  const lessonsToUpdate: Array<{ id: string; data: any }> = [];
  
  for (let i = 0; i < lessonsToImport.length; i++) {
    const lesson = lessonsToImport[i];
    const uniqueKey = `${lesson.title}::${lesson.level}`;
    const existingLesson = existingLessonsMap.get(uniqueKey);

    const lessonData = {
      tenant_id: tenantId,
      title: lesson.title,
      level: lesson.level,
      duration: lesson.duration,
      difficulty: lesson.difficulty,
      rating: lesson.rating || 0,
      type: lesson.type,
      objectives: lesson.objectives || [],
      content: lesson.content || {},
      order_index: i,
      is_active: true,
    };

    if (existingLesson) {
      // Update existing lesson
      lessonsToUpdate.push({
        id: existingLesson.id,
        data: lessonData
      });
    } else {
      // Insert new lesson
      lessonsToInsert.push(lessonData);
    }
  }

  // Update existing lessons
  if (lessonsToUpdate.length > 0) {
    console.log(`Updating ${lessonsToUpdate.length} existing lessons...`);
    for (const { id, data } of lessonsToUpdate) {
      try {
        const { error: updateError } = await supabase
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

        if (updateError) {
          console.error(`Error updating ${data.title}:`, updateError);
          errors++;
        } else {
          console.log(`✓ Updated: ${data.title} (${data.level})`);
          success++;
          updated++;
        }
      } catch (err: any) {
        console.error(`Error processing ${data.title}:`, err);
        errors++;
      }
    }
  }

  // Insert new lessons in batches
  if (lessonsToInsert.length > 0) {
    const batchSize = 10;
    for (let i = 0; i < lessonsToInsert.length; i += batchSize) {
      const chunk = lessonsToInsert.slice(i, i + batchSize);
      try {
        const { error, data } = await supabase
          .from('lessons' as any)
          .insert(chunk as any)
          .select();

        if (error) {
          console.error(`Error inserting batch:`, error);
          console.error('Error details:', JSON.stringify(error, null, 2));
          
          // Try inserting one by one if batch fails
          for (const lessonData of chunk) {
            try {
              const { error: singleError, data: insertedData } = await supabase
                .from('lessons' as any)
                .insert(lessonData as any)
                .select();
              
              if (singleError) {
                console.error(`Error inserting ${lessonData.title}:`, singleError);
                errors++;
              } else {
                console.log(`✓ Inserted: ${lessonData.title} (${lessonData.level})`);
                success++;
                inserted++;
              }
            } catch (err: any) {
              console.error(`Error processing ${lessonData.title}:`, err);
              errors++;
            }
          }
        } else {
          chunk.forEach((lesson: any) => {
            console.log(`✓ Inserted: ${lesson.title} (${lesson.level})`);
            success++;
            inserted++;
          });
        }
      } catch (error: any) {
        console.error(`Error processing batch:`, error);
        errors += chunk.length;
      }
    }
  }

  console.log('\n=== Seeding Complete ===');
  console.log(`Success: ${success} (${updated} updated, ${inserted} inserted)`);
  console.log(`Errors: ${errors}`);
  console.log(`Skipped: ${skipped}`);
  console.log(`Total: ${lessonsToImport.length}`);

  return { success, errors, skipped, updated, inserted };
};

// Browser console helper function
if (typeof window !== 'undefined') {
  (window as any).seedCursoInglesLessons = async (tenantId: string) => {
    return await seedCursoInglesLessonsForTenant(tenantId);
  };
}

