import { Link } from 'react-router-dom';
import { useLabProgress } from '../hooks/useLabProgress';
import { courses } from '../data/courses';
import { challenges } from '../data/challenges';
import { COURSE_COLORS, DIFFICULTY_LABELS, TYPE_LABELS } from '../types';
import clsx from 'clsx';

export function Progress() {
  const { progress, courseStats } = useLabProgress();

  const difficultyBreakdown = {
    beginner: challenges.filter(
      (c) => c.difficulty === 'beginner' && progress.completed.includes(c.id)
    ).length,
    intermediate: challenges.filter(
      (c) => c.difficulty === 'intermediate' && progress.completed.includes(c.id)
    ).length,
    advanced: challenges.filter(
      (c) => c.difficulty === 'advanced' && progress.completed.includes(c.id)
    ).length,
  };

  const totalChallenges = challenges.length;

  return (
    <div className="space-y-8 animate-fade-in">
      <header>
        <h1 className="text-2xl font-bold text-[var(--color-text)] mb-1">
          YOUR LAB PROGRESS
        </h1>
        <p className="text-sm text-[var(--color-secondary)]">
          Your Lab practice is tracked separately from your VEXDYN Learn coursework.
        </p>
      </header>

      {/* Overview cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Completed" value={progress.stats.totalCompleted} />
        <StatCard label="Attempted" value={progress.stats.totalAttempted} />
        <StatCard label="Total Available" value={totalChallenges} />
        <StatCard label="Streak" value={`${progress.streak.current}d`} />
      </div>

      {/* Course Progress */}
      <section>
        <h2 className="text-xs font-semibold tracking-wider text-[var(--color-secondary)] uppercase mb-3">
          Course Progress
        </h2>
        <div className="space-y-3">
          {courses.map((course) => {
            const stats = courseStats[course.id];
            return (
              <div key={course.id} className="lab-surface rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: course.color }}
                    />
                    <span className="font-semibold text-sm">{course.name}</span>
                  </div>
                  <span className="text-xs text-[var(--color-secondary)]">
                    {stats.completed} / {stats.total}
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-[rgba(167,139,250,0.1)] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${stats.percent}%`,
                      backgroundColor: course.color,
                      opacity: 0.8,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Difficulty Breakdown */}
      <section>
        <h2 className="text-xs font-semibold tracking-wider text-[var(--color-secondary)] uppercase mb-3">
          Difficulty Breakdown
        </h2>
        <div className="grid grid-cols-3 gap-3">
          {(['beginner', 'intermediate', 'advanced'] as const).map((d) => (
            <div key={d} className="lab-surface rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-[var(--color-text)]">
                {difficultyBreakdown[d]}
              </p>
              <p className="text-[11px] text-[var(--color-secondary)] mt-1">
                {DIFFICULTY_LABELS[d]}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Activity */}
      <section>
        <h2 className="text-xs font-semibold tracking-wider text-[var(--color-secondary)] uppercase mb-3">
          Recent Activity
        </h2>
        {progress.recentActivity.length === 0 ? (
          <div className="lab-surface rounded-xl p-8 text-center">
            <p className="text-sm text-[var(--color-secondary)] mb-3">
              No recent activity.
            </p>
            <Link
              to="/practice"
              className="text-sm text-[var(--color-accent)] hover:underline"
            >
              Explore challenges →
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {progress.recentActivity.map((item) => (
              <Link
                key={item.id}
                to={`/challenge/${item.challengeId}`}
                className="flex items-center gap-3 lab-surface rounded-lg px-4 py-3 hover:border-[rgba(167,139,250,0.25)] transition-all"
              >
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{
                    backgroundColor:
                      COURSE_COLORS[item.course] || 'var(--color-accent)',
                  }}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-[var(--color-text)] truncate">
                    {item.title}
                  </p>
                  <p className="text-[11px] text-[var(--color-secondary)]">
                    {item.course.toUpperCase()} · {TYPE_LABELS[item.type]}
                  </p>
                </div>
                <span
                  className={clsx(
                    'text-[10px] font-medium px-1.5 py-0.5 rounded shrink-0',
                    item.status === 'completed'
                      ? 'text-emerald-300 bg-emerald-500/10'
                      : 'text-amber-300 bg-amber-500/10'
                  )}
                >
                  {item.status === 'completed' ? 'Completed' : 'Attempted'}
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="lab-surface rounded-xl p-4 text-center">
      <p className="text-2xl font-bold text-[var(--color-text)]">{value}</p>
      <p className="text-[11px] text-[var(--color-secondary)] mt-1">{label}</p>
    </div>
  );
}
