export type CourseId = 'html' | 'css' | 'javascript' | 'react';
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';
export type ChallengeType =
  | 'code-challenge'
  | 'fix-the-code'
  | 'predict-the-output'
  | 'complete-the-code'
  | 'multiple-choice'
  | 'mini-task'
  | 'debugging';
export type ChallengeStatus = 'not-started' | 'in-progress' | 'completed';

export interface Course {
  id: CourseId;
  name: string;
  color: string;
  description: string;
  challengeCount: number;
}

export interface Challenge {
  id: string;
  course: CourseId;
  topic: string;
  difficulty: Difficulty;
  type: ChallengeType;
  title: string;
  description: string;
  instructions: string;
  starterCode?: string;
  solutionCode?: string;
  // For multiple choice
  options?: string[];
  correctAnswer?: string | number;
  // Evaluation
  tests?: TestCase[];
  expectedOutput?: string;
  // Learning aids
  hints: string[];
  explanation: string;
  relatedLesson?: string;
}

export interface TestCase {
  id: string;
  description: string;
  // Simple string match or function-based for V1
  input?: string;
  expected: string;
  // For JS evaluation: a function body that returns true/false
  validate?: string;
}

export interface UserProgress {
  completed: string[]; // challenge ids
  inProgress: Record<string, { code?: string; lastUpdated: number }>;
  attempted: string[];
  recentActivity: ActivityItem[];
  streak: {
    current: number;
    lastPracticeDate: string | null; // YYYY-MM-DD
  };
  stats: {
    totalCompleted: number;
    totalAttempted: number;
  };
}

export interface ActivityItem {
  id: string;
  challengeId: string;
  title: string;
  course: CourseId;
  type: ChallengeType;
  status: 'completed' | 'attempted';
  timestamp: number;
}

export const COURSE_COLORS: Record<CourseId, string> = {
  html: '#E34F26',
  css: '#1572B6',
  javascript: '#F7DF1E',
  react: '#61DAFB',
};

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};

export const TYPE_LABELS: Record<ChallengeType, string> = {
  'code-challenge': 'Code Challenge',
  'fix-the-code': 'Fix the Code',
  'predict-the-output': 'Predict the Output',
  'complete-the-code': 'Complete the Code',
  'multiple-choice': 'Multiple Choice',
  'mini-task': 'Mini Task',
  debugging: 'Debugging',
};
