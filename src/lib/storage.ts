import type { UserProgress, ActivityItem } from '../types';

const STORAGE_KEY = 'vexdyn-lab-progress-v1';

const defaultProgress: UserProgress = {
  completed: [],
  inProgress: {},
  attempted: [],
  recentActivity: [],
  streak: {
    current: 0,
    lastPracticeDate: null,
  },
  stats: {
    totalCompleted: 0,
    totalAttempted: 0,
  },
};

export function loadProgress(): UserProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...defaultProgress };
    const parsed = JSON.parse(raw) as UserProgress;
    return {
      ...defaultProgress,
      ...parsed,
      completed: parsed.completed || [],
      inProgress: parsed.inProgress || {},
      attempted: parsed.attempted || [],
      recentActivity: parsed.recentActivity || [],
      streak: parsed.streak || defaultProgress.streak,
      stats: parsed.stats || defaultProgress.stats,
    };
  } catch {
    return { ...defaultProgress };
  }
}

export function saveProgress(progress: UserProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Storage full or unavailable — fail silently in V1
  }
}

export function getToday(): string {
  return new Date().toISOString().slice(0, 10);
}

export function updateStreak(progress: UserProgress): UserProgress {
  const today = getToday();
  const last = progress.streak.lastPracticeDate;

  if (last === today) {
    return progress;
  }

  let current = progress.streak.current;
  if (last) {
    const lastDate = new Date(last);
    const todayDate = new Date(today);
    const diffDays = Math.round(
      (todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (diffDays === 1) {
      current += 1;
    } else {
      current = 1;
    }
  } else {
    current = 1;
  }

  return {
    ...progress,
    streak: {
      current,
      lastPracticeDate: today,
    },
  };
}

export function markCompleted(
  progress: UserProgress,
  challengeId: string,
  title: string,
  course: string,
  type: string
): UserProgress {
  const completed = progress.completed.includes(challengeId)
    ? progress.completed
    : [...progress.completed, challengeId];

  const attempted = progress.attempted.includes(challengeId)
    ? progress.attempted
    : [...progress.attempted, challengeId];

  const { [challengeId]: _, ...restInProgress } = progress.inProgress;

  const activity: ActivityItem = {
    id: `${challengeId}-${Date.now()}`,
    challengeId,
    title,
    course: course as any,
    type: type as any,
    status: 'completed',
    timestamp: Date.now(),
  };

  let next = {
    ...progress,
    completed,
    attempted,
    inProgress: restInProgress,
    recentActivity: [activity, ...progress.recentActivity].slice(0, 20),
    stats: {
      totalCompleted: completed.length,
      totalAttempted: attempted.length,
    },
  };

  next = updateStreak(next);
  return next;
}

export function markAttempted(
  progress: UserProgress,
  challengeId: string,
  title: string,
  course: string,
  type: string,
  code?: string
): UserProgress {
  const attempted = progress.attempted.includes(challengeId)
    ? progress.attempted
    : [...progress.attempted, challengeId];

  const activity: ActivityItem = {
    id: `${challengeId}-attempt-${Date.now()}`,
    challengeId,
    title,
    course: course as any,
    type: type as any,
    status: 'attempted',
    timestamp: Date.now(),
  };

  // Only add attempted activity if not already completed
  const recentActivity = progress.completed.includes(challengeId)
    ? progress.recentActivity
    : [activity, ...progress.recentActivity].slice(0, 20);

  const next = {
    ...progress,
    attempted,
    inProgress: {
      ...progress.inProgress,
      [challengeId]: {
        code,
        lastUpdated: Date.now(),
      },
    },
    recentActivity,
    stats: {
      ...progress.stats,
      totalAttempted: attempted.length,
    },
  };

  return updateStreak(next);
}

export function saveInProgressCode(
  progress: UserProgress,
  challengeId: string,
  code: string
): UserProgress {
  return {
    ...progress,
    inProgress: {
      ...progress.inProgress,
      [challengeId]: {
        code,
        lastUpdated: Date.now(),
      },
    },
  };
}

export function getStatus(
  progress: UserProgress,
  challengeId: string
): 'not-started' | 'in-progress' | 'completed' {
  if (progress.completed.includes(challengeId)) return 'completed';
  if (progress.inProgress[challengeId]) return 'in-progress';
  return 'not-started';
}
