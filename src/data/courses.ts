import type { Course } from '../types';

export const courses: Course[] = [
  {
    id: 'html',
    name: 'HTML',
    color: '#E34F26',
    description: 'Practice your HTML skills.',
    challengeCount: 9,
  },
  {
    id: 'css',
    name: 'CSS',
    color: '#1572B6',
    description: 'Practice your CSS skills.',
    challengeCount: 9,
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    color: '#F7DF1E',
    description: 'Practice your JavaScript skills.',
    challengeCount: 18,
  },
  {
    id: 'react',
    name: 'React',
    color: '#61DAFB',
    description: 'Practice your React skills.',
    challengeCount: 9,
  },
];

export function getCourse(id: string) {
  return courses.find((c) => c.id === id);
}
