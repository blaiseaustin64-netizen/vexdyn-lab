import { Link } from 'react-router-dom';
import { ArrowRight, Play, BookOpen, Wrench } from '../components/Icons';
import { useLabProgress } from '../hooks/useLabProgress';
import { courses } from '../data/courses';
import { COURSE_COLORS, DIFFICULTY_LABELS } from '../types';
import clsx from 'clsx';

const challengeTypes = [
  { id: 'code-challenge', label: 'Code Challenge', icon: CodeIcon },
  { id: 'fix-the-code', label: 'Fix the Code', icon: Wrench },
  { id: 'predict-the-output', label: 'Predict the Output', icon: EyeIcon },
  { id: 'complete-the-code', label: 'Complete the Code', icon: BookOpen },
  { id: 'multiple-choice', label: 'Multiple Choice', icon: ListIcon },
  { id: 'mini-task', label: 'Mini Task', icon: ZapIcon },
  { id: 'debugging', label: 'Debugging', icon: BugIcon },
];

function CodeIcon() {
  return <span className="text-xs font-mono">{ }</span>;
}
function EyeIcon() {
  return <span className="text-xs">◎</span>;
}
function ListIcon() {
  return <span className="text-xs">☰</span>;
}
function ZapIcon() {
  return <span className="text-xs">⚡</span>;
}
function BugIcon() {
  return <span className="text-xs">🐛</span>;
}

export function Home() {
  const { getContinueChallenge, courseStats, progress } = useLabProgress();
  const continueItem = getContinueChallenge();

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Hero */}
      <section className="pt-2">
        <p className="text-xs font-medium tracking-widest text-[var(--color-accent)] mb-1">
          VEXDYN LAB
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--color-text)] mb-2">
          Ready to practice?
        </h1>
        <p className="text-[var(--color-secondary)] text-sm max-w-md">
          Turn knowledge into real programming skill.
        </p>
      </section>

      {/* Continue Practice */}
      <section>
        <h2 className="text-xs font-semibold tracking-wider text-[var(--color-secondary)] uppercase mb-3">
          Continue Practice
        </h2>
        {continueItem ? (
          <Link
            to={`/challenge/${continueItem.id}`}
            className="block lab-surface rounded-xl p-5 hover:border-[rgba(167,139,250,0.3)] transition-all group"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="text-xs font-semibold uppercase tracking-wide"
                    style={{ color: COURSE_COLORS[continueItem.course] }}
                  >
                    {continueItem.course}
                  </span>
                  <span className="text-[10px] text-[var(--color-secondary)] px-1.5 py-0.5 rounded bg-[rgba(167,139,250,0.1)]">
                    {DIFFICULTY_LABELS[continueItem.difficulty as keyof typeof DIFFICULTY_LABELS] ||
                      continueItem.difficulty}
                  </span>
                </div>
                <h3 className="font-semibold text-[var(--color-text)] group-hover:text-[var(--color-accent)] transition-colors">
                  {continueItem.title}
                </h3>
                <p className="text-xs text-[var(--color-secondary)] mt-1">In Progress</p>
              </div>
              <span className="flex items-center gap-1.5 text-sm font-medium text-[var(--color-primary)] group-hover:gap-2 transition-all">
                CONTINUE
                <ArrowRight size={16} />
              </span>
            </div>
          </Link>
        ) : (
          <div className="lab-surface rounded-xl p-6 text-center">
            <p className="text-sm text-[var(--color-secondary)] mb-3">
              No recent practice yet.
            </p>
            <Link
              to="/practice"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-accent)] hover:underline"
            >
              <Play size={14} />
              Start a challenge
            </Link>
          </div>
        )}
      </section>

      {/* Course Practice */}
      <section>
        <h2 className="text-xs font-semibold tracking-wider text-[var(--color-secondary)] uppercase mb-3">
          Course Practice
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {courses.map((course) => {
            const stats = courseStats[course.id];
            return (
              <Link
                key={course.id}
                to={`/practice?course=${course.id}`}
                className="lab-surface rounded-xl p-4 hover:border-[rgba(167,139,250,0.25)] transition-all group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: course.color }}
                  />
                  <h3 className="font-semibold text-[var(--color-text)] group-hover:text-[var(--color-accent)] transition-colors">
                    {course.name}
                  </h3>
                </div>
                <p className="text-xs text-[var(--color-secondary)] mb-3">
                  {course.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-[var(--color-secondary)]">
                    {stats.completed} / {stats.total} challenges
                  </span>
                  <div className="w-20 h-1 rounded-full bg-[rgba(167,139,250,0.1)] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[var(--color-primary)] transition-all"
                      style={{ width: `${stats.percent}%` }}
                    />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Challenge Discovery */}
      <section>
        <h2 className="text-xs font-semibold tracking-wider text-[var(--color-secondary)] uppercase mb-3">
          Challenge Types
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {challengeTypes.map((t) => (
            <Link
              key={t.id}
              to={`/practice?type=${t.id}`}
              className="lab-surface rounded-lg px-3 py-3 text-center hover:border-[rgba(167,139,250,0.25)] transition-all"
            >
              <div className="text-[var(--color-accent)] mb-1 flex justify-center">
                <t.icon />
              </div>
              <span className="text-xs font-medium text-[var(--color-text)]">
                {t.label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent Activity teaser */}
      {progress.recentActivity.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-semibold tracking-wider text-[var(--color-secondary)] uppercase">
              Recent Activity
            </h2>
            <Link
              to="/progress"
              className="text-xs text-[var(--color-accent)] hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="space-y-2">
            {progress.recentActivity.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 text-sm lab-surface rounded-lg px-3 py-2.5"
              >
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{
                    backgroundColor:
                      COURSE_COLORS[item.course] || 'var(--color-accent)',
                  }}
                />
                <span className="text-[var(--color-secondary)] text-xs uppercase w-16 shrink-0">
                  {item.status}
                </span>
                <span className="truncate text-[var(--color-text)]">
                  {item.title}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
