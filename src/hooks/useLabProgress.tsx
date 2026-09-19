import {
  createContext,
  useContext,
  useCallback,
  useMemo,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import type { UserProgress, ChallengeStatus, CourseId } from '../types';
import {
  loadProgress,
  saveProgress,
  markCompleted,
  markAttempted,
  saveInProgressCode,
  getStatus,
} from '../lib/storage';
import { challenges } from '../data/challenges';
import { courses } from '../data/courses';

interface LabProgressContextValue {
  progress: UserProgress;
  getChallengeStatus: (id: string) => ChallengeStatus;
  completeChallenge: (
    id: string,
    title: string,
    course: string,
    type: string
  ) => void;
  attemptChallenge: (
    id: string,
    title: string,
    course: string,
    type: string,
    code?: string
  ) => void;
  saveCode: (id: string, code: string) => void;
  getInProgressCode: (id: string) => string | undefined;
  getContinueChallenge: () => {
    id: string;
    title: string;
    course: CourseId;
    difficulty: string;
  } | null;
  courseStats: Record<
    CourseId,
    { completed: number; total: number; percent: number }
  >;
  resetAll: () => void;
}

const LabProgressContext = createContext<LabProgressContextValue | null>(null);

export function LabProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<UserProgress>(() => loadProgress());

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  const getChallengeStatus = useCallback(
    (id: string) => getStatus(progress, id),
    [progress]
  );

  const completeChallenge = useCallback(
    (id: string, title: string, course: string, type: string) => {
      setProgress((prev) => markCompleted(prev, id, title, course, type));
    },
    []
  );

  const attemptChallenge = useCallback(
    (
      id: string,
      title: string,
      course: string,
      type: string,
      code?: string
    ) => {
      setProgress((prev) => markAttempted(prev, id, title, course, type, code));
    },
    []
  );

  const saveCode = useCallback((id: string, code: string) => {
    setProgress((prev) => saveInProgressCode(prev, id, code));
  }, []);

  const getInProgressCode = useCallback(
    (id: string) => progress.inProgress[id]?.code,
    [progress]
  );

  const getContinueChallenge = useCallback(() => {
    const entries = Object.entries(progress.inProgress);
    if (entries.length === 0) return null;

    // Most recently updated
    entries.sort((a, b) => b[1].lastUpdated - a[1].lastUpdated);
    const [id] = entries[0];
    const challenge = challenges.find((c) => c.id === id);
    if (!challenge) return null;
    if (progress.completed.includes(id)) return null;

    return {
      id: challenge.id,
      title: challenge.title,
      course: challenge.course,
      difficulty: challenge.difficulty,
    };
  }, [progress]);

  const courseStats = useMemo(() => {
    const stats = {} as Record<
      CourseId,
      { completed: number; total: number; percent: number }
    >;
    for (const course of courses) {
      const courseChallenges = challenges.filter((c) => c.course === course.id);
      const completed = courseChallenges.filter((c) =>
        progress.completed.includes(c.id)
      ).length;
      const total = courseChallenges.length;
      stats[course.id] = {
        completed,
        total,
        percent: total === 0 ? 0 : Math.round((completed / total) * 100),
      };
    }
    return stats;
  }, [progress.completed]);

  const resetAll = useCallback(() => {
    setProgress(loadProgress()); // will be default if cleared
    localStorage.removeItem('vexdyn-lab-progress-v1');
    setProgress({
      completed: [],
      inProgress: {},
      attempted: [],
      recentActivity: [],
      streak: { current: 0, lastPracticeDate: null },
      stats: { totalCompleted: 0, totalAttempted: 0 },
    });
  }, []);

  const value = useMemo(
    () => ({
      progress,
      getChallengeStatus,
      completeChallenge,
      attemptChallenge,
      saveCode,
      getInProgressCode,
      getContinueChallenge,
      courseStats,
      resetAll,
    }),
    [
      progress,
      getChallengeStatus,
      completeChallenge,
      attemptChallenge,
      saveCode,
      getInProgressCode,
      getContinueChallenge,
      courseStats,
      resetAll,
    ]
  );

  return (
    <LabProgressContext.Provider value={value}>
      {children}
    </LabProgressContext.Provider>
  );
}

export function useLabProgress() {
  const ctx = useContext(LabProgressContext);
  if (!ctx) {
    throw new Error('useLabProgress must be used within LabProgressProvider');
  }
  return ctx;
}
