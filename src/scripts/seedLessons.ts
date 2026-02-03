/**
 * Script to seed lessons from lessonsData.ts into Supabase for a specific tenant
 * 
 * Usage:
 * 1. Update the TENANT_ID below with your tenant ID
 * 2. Update the LEVELS array to specify which levels to import
 * 3. Run: npm run seed-lessons (or add to package.json scripts)
 * 
 * Or use this in the browser console after logging in as an admin
 */

import { supabase } from '@/integrations/supabase/client';
import { lessonsData } from '@/data/lessonsData';

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

export const seedLessonsForTenant = async (
  tenantId: string,
  levels: string[] = ['A1', 'A2', 'B1', 'B2']
): Promise<{ success: number; errors: number; skipped: number }> => {
  let success = 0;
  let errors = 0;
  let skipped = 0;

  if (!tenantId) {
    throw new Error('Tenant ID is required');
  }

  console.log(`Starting to seed lessons for tenant: ${tenantId}`);
  console.log(`Levels to import: ${levels.join(', ')}`);
  
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
      // First sort by level
      const levelOrder = { 'A1': 1, 'A2': 2, 'B1': 3, 'B2': 4 };
      const levelDiff = (levelOrder[a.level as keyof typeof levelOrder] || 99) - 
                       (levelOrder[b.level as keyof typeof levelOrder] || 99);
      if (levelDiff !== 0) return levelDiff;
      // Then sort by original ID within each level
      return a.id - b.id;
    }) as LessonData[];

  console.log(`Found ${lessonsToImport.length} lessons to import`);

  // Get existing lessons for this tenant to avoid duplicates
  const { data: existingLessons } = await supabase
    .from('lessons' as any)
    .select('title, level')
    .eq('tenant_id', tenantId);

  const existingTitles = new Set(
    existingLessons?.map((l: any) => `${l.title}::${l.level}`) || []
  );

  // Group lessons by level for proper order_index
  const lessonsByLevel: Record<string, LessonData[]> = {};
  lessonsToImport.forEach(lesson => {
    if (!lessonsByLevel[lesson.level]) {
      lessonsByLevel[lesson.level] = [];
    }
    lessonsByLevel[lesson.level].push(lesson);
  });

  // Insert lessons grouped by level (batch insert for better performance)
  for (const level of levels) {
    const levelLessons = lessonsByLevel[level] || [];
    
    // Prepare lessons to insert (filter out duplicates)
    const lessonsToInsert = [];
    for (let i = 0; i < levelLessons.length; i++) {
      const lesson = levelLessons[i];
      const uniqueKey = `${lesson.title}::${lesson.level}`;

      // Skip if already exists
      if (existingTitles.has(uniqueKey)) {
        console.log(`Skipping duplicate: ${lesson.title} (${lesson.level})`);
        skipped++;
        continue;
      }

      lessonsToInsert.push({
        tenant_id: tenantId,
        title: lesson.title,
        level: lesson.level,
        duration: lesson.duration,
        difficulty: lesson.difficulty,
        rating: lesson.rating || 0,
        type: lesson.type,
        objectives: lesson.objectives || [],
        content: lesson.content || {},
        order_index: i, // Index within the level
        is_active: true,
      });
    }

    // Batch insert lessons for this level (insert in chunks of 10 for better performance)
    if (lessonsToInsert.length > 0) {
      const chunkSize = 10;
      for (let i = 0; i < lessonsToInsert.length; i += chunkSize) {
        const chunk = lessonsToInsert.slice(i, i + chunkSize);
        try {
          const { error, data } = await supabase
            .from('lessons' as any)
            .insert(chunk as any)
            .select();

          if (error) {
            console.error(`Error inserting batch for level ${level}:`, error);
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
                  console.error('Single insert error details:', JSON.stringify(singleError, null, 2));
                  errors++;
                } else {
                  console.log(`✓ Inserted: ${lessonData.title} (${lessonData.level})`);
                  success++;
                }
              } catch (err: any) {
                console.error(`Error processing ${lessonData.title}:`, err);
                console.error('Exception details:', err.message, err.stack);
                errors++;
              }
            }
          } else {
            chunk.forEach(lesson => {
              console.log(`✓ Inserted: ${lesson.title} (${lesson.level})`);
              success++;
            });
          }
        } catch (error: any) {
          console.error(`Error processing batch for level ${level}:`, error);
          errors += chunk.length;
        }
      }
    }
  }

  console.log('\n=== Seeding Complete ===');
  console.log(`Success: ${success}`);
  console.log(`Errors: ${errors}`);
  console.log(`Skipped: ${skipped}`);
  console.log(`Total: ${lessonsToImport.length}`);

  return { success, errors, skipped };
};

// Browser console helper function
if (typeof window !== 'undefined') {
  (window as any).seedLessons = async (tenantId: string, levels?: string[]) => {
    return await seedLessonsForTenant(tenantId, levels);
  };
}

