import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Lesson {
  id: string;
  tenant_id: string;
  title: string;
  level: string;
  duration: string;
  difficulty: string;
  rating: number;
  type: string;
  objectives: string[];
  content: any;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface LessonProgress {
  id: string;
  user_id: string;
  tenant_id: string;
  lesson_id: string;
  progress_percentage: number;
  completed: boolean;
  time_spent_minutes: number;
  last_accessed_at: string | null;
  completed_at: string | null;
  exercise_results: any;
  created_at: string;
  updated_at: string;
}

export const useLessons = (tenantId: string | null) => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!tenantId) {
      setLoading(false);
      return;
    }
    fetchLessons();
  }, [tenantId]);

  const fetchLessons = async () => {
    if (!tenantId) return;

    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('lessons')
        .select('*')
        .eq('tenant_id', tenantId)
        .eq('is_active', true)
        .order('order_index', { ascending: true })
        .order('created_at', { ascending: true });

      if (fetchError) {
        console.error('Error fetching lessons:', fetchError);
        throw fetchError;
      }
      
      console.log(`Fetched ${data?.length || 0} lessons for tenant ${tenantId}`);
      if (data && data.length > 0) {
        console.log('Lessons by level:', data.reduce((acc, l) => {
          acc[l.level] = (acc[l.level] || 0) + 1;
          return acc;
        }, {} as Record<string, number>));
      }
      
      setLessons(data || []);
    } catch (err: any) {
      setError(err);
      console.error('Error fetching lessons:', err);
    } finally {
      setLoading(false);
    }
  };

  const createLesson = async (lessonData: Partial<Lesson>) => {
    if (!tenantId) throw new Error('No tenant selected');

    const { data, error: createError } = await supabase
      .from('lessons')
      .insert({
        ...lessonData,
        tenant_id: tenantId,
      })
      .select()
      .single();

    if (createError) throw createError;
    await fetchLessons();
    return data;
  };

  const updateLesson = async (lessonId: string, updates: Partial<Lesson>) => {
    const { data, error: updateError } = await supabase
      .from('lessons')
      .update(updates)
      .eq('id', lessonId)
      .select()
      .single();

    if (updateError) throw updateError;
    await fetchLessons();
    return data;
  };

  const deleteLesson = async (lessonId: string) => {
    const { error: deleteError } = await supabase
      .from('lessons')
      .delete()
      .eq('id', lessonId);

    if (deleteError) throw deleteError;
    await fetchLessons();
  };

  return {
    lessons,
    loading,
    error,
    fetchLessons,
    createLesson,
    updateLesson,
    deleteLesson,
  };
};

export const useLessonProgress = (userId: string | undefined, tenantId: string | null) => {
  const [progress, setProgress] = useState<LessonProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId || !tenantId) {
      setLoading(false);
      return;
    }
    fetchProgress();
  }, [userId, tenantId]);

  const fetchProgress = async () => {
    if (!userId || !tenantId) return;

    setLoading(true);
    try {
      const { data, error: fetchError } = await supabase
        .from('lesson_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('tenant_id', tenantId);

      if (fetchError) throw fetchError;
      setProgress(data || []);
    } catch (err) {
      console.error('Error fetching progress:', err);
    } finally {
      setLoading(false);
    }
  };

  const getProgressForLesson = (lessonId: string): LessonProgress | null => {
    return progress.find(p => p.lesson_id === lessonId) || null;
  };

  const updateProgress = async (
    lessonId: string,
    progressData: {
      progress_percentage: number;
      completed?: boolean;
      time_spent_minutes?: number;
      exercise_results?: any;
    }
  ) => {
    if (!userId || !tenantId) throw new Error('User or tenant not available');

    const existingProgress = getProgressForLesson(lessonId);
    const updateData = {
      ...progressData,
      last_accessed_at: new Date().toISOString(),
      completed_at: progressData.completed ? new Date().toISOString() : null,
    };

    if (existingProgress) {
      const { data, error: updateError } = await supabase
        .from('lesson_progress')
        .update(updateData)
        .eq('id', existingProgress.id)
        .select()
        .single();

      if (updateError) throw updateError;
      await fetchProgress();
      return data;
    } else {
      const { data, error: insertError } = await supabase
        .from('lesson_progress')
        .insert({
          user_id: userId,
          tenant_id: tenantId,
          lesson_id: lessonId,
          ...updateData,
        })
        .select()
        .single();

      if (insertError) throw insertError;
      await fetchProgress();
      return data;
    }
  };

  const getOverallStats = () => {
    const completed = progress.filter(p => p.completed).length;
    const total = progress.length;
    const totalTime = progress.reduce((sum, p) => sum + (p.time_spent_minutes || 0), 0);
    const averageProgress = progress.length > 0
      ? progress.reduce((sum, p) => sum + p.progress_percentage, 0) / progress.length
      : 0;

    return {
      completedLessons: completed,
      totalLessons: total,
      totalTimeMinutes: totalTime,
      totalTimeHours: totalTime / 60,
      averageProgress: Math.round(averageProgress),
    };
  };

  return {
    progress,
    loading,
    fetchProgress,
    getProgressForLesson,
    updateProgress,
    getOverallStats,
  };
};


