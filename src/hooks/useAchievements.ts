import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useLessonProgress } from './useLessons';

export interface Achievement {
  id: string;
  user_id: string;
  tenant_id: string;
  achievement_type: string;
  achievement_data: any;
  unlocked_at: string;
}

const ACHIEVEMENT_TYPES = {
  FIRST_LESSON: 'first_lesson',
  STREAK_7_DAYS: 'streak_7_days',
  STREAK_30_DAYS: 'streak_30_days',
  LEVEL_COMPLETE_A1: 'level_complete_a1',
  LEVEL_COMPLETE_A2: 'level_complete_a2',
  LEVEL_COMPLETE_B1: 'level_complete_b1',
  SPEED_LEARNER: 'speed_learner',
  PERFECT_SCORE: 'perfect_score',
} as const;

export const useAchievements = (userId: string | undefined, tenantId: string | null) => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const { progress, getOverallStats } = useLessonProgress(userId, tenantId);

  useEffect(() => {
    if (!userId || !tenantId) {
      setLoading(false);
      return;
    }
    fetchAchievements();
  }, [userId, tenantId]);

  useEffect(() => {
    if (userId && tenantId && progress.length > 0) {
      checkAndUnlockAchievements();
    }
  }, [progress, userId, tenantId]);

  const fetchAchievements = async () => {
    if (!userId || !tenantId) return;

    setLoading(true);
    try {
      const { data, error: fetchError } = await (supabase as any)
        .from('user_achievements')
        .select('*')
        .eq('user_id', userId)
        .eq('tenant_id', tenantId)
        .order('unlocked_at', { ascending: false });

      if (fetchError) throw fetchError;
      setAchievements(data || []);
    } catch (err) {
      console.error('Error fetching achievements:', err);
    } finally {
      setLoading(false);
    }
  };

  const unlockAchievement = async (type: string, data: any = {}) => {
    if (!userId || !tenantId) return;

    // Check if already unlocked
    const exists = achievements.find(a => a.achievement_type === type);
    if (exists) return;

    try {
      const { error: insertError } = await (supabase as any)
        .from('user_achievements')
        .insert({
          user_id: userId,
          tenant_id: tenantId,
          achievement_type: type,
          achievement_data: data,
        });

      if (insertError) throw insertError;
      await fetchAchievements();
    } catch (err) {
      console.error('Error unlocking achievement:', err);
    }
  };

  const checkAndUnlockAchievements = async () => {
    if (!userId || !tenantId) return;

    const stats = getOverallStats();
    const completedLessons = progress.filter(p => p.completed);

    // First lesson
    if (completedLessons.length >= 1) {
      await unlockAchievement(ACHIEVEMENT_TYPES.FIRST_LESSON);
    }

    // Level completions
    const a1Lessons = completedLessons.filter(p => {
      const lesson = progress.find(pr => pr.lesson_id === p.lesson_id);
      return lesson; // Would need lesson data to check level
    });

    // Speed learner (5 lessons in one day)
    const today = new Date().toDateString();
    const todayCompleted = completedLessons.filter(p => {
      if (!p.completed_at) return false;
      return new Date(p.completed_at).toDateString() === today;
    });
    if (todayCompleted.length >= 5) {
      await unlockAchievement(ACHIEVEMENT_TYPES.SPEED_LEARNER, {
        count: todayCompleted.length,
        date: today,
      });
    }
  };

  const hasAchievement = (type: string): boolean => {
    return achievements.some(a => a.achievement_type === type);
  };

  return {
    achievements,
    loading,
    fetchAchievements,
    hasAchievement,
    unlockAchievement,
  };
};


