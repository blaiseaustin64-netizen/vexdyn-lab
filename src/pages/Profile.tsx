import { Link } from 'react-router-dom';
import { useLabProgress } from '../hooks/useLabProgress';
import { COURSE_COLORS } from '../types';

export function Profile() {
  const { progress, courseStats, resetAll } = useLabProgress();

  const mostActiveCourse = Object.entries(courseStats).sort(
    (a, b) => b[1].completed - a[1].completed
  )[0];

  return (
    <div className="space-y-8 animate-fade-in max-w-lg mx-auto">
      <header className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--color-primary)] mb-4 shadow-[0_0_24px_rgba(124,58,237,0.3)]">
          <span className="text-2xl font-bold text-white">L</span>
        </div>
        <h1 className="text-xl font-bold text-[var(--color-text)]">Lab Practitioner</h1>
        <p className="text-sm text-[var(--color-secondary)] mt-1">
          Local practice profile · V1
        </p>
      </header>

      {/* Stats */}
      <section className="lab-surface rounded-xl p-5">
        <h2 className="text-xs font-semibold tracking-wider text-[var(--color-secondary)] uppercase mb-4">
          Practice Statistics
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-2xl font-bold text-[var(--color-text)]">
              {progress.stats.totalCompleted}
            </p>
            <p className="text-[11px] text-[var(--color-secondary)]">
              Challenges Completed
            </p>
          </div>
          <div>
            <p className="text-2xl font-bold text-[var(--color-text)]">
              {progress.stats.totalAttempted}
            </p>
            <p className="text-[11px] text-[var(--color-secondary)]">
              Challenges Attempted
            </p>
          </div>
          <div>
            <p className="text-2xl font-bold text-[var(--color-text)]">
              {progress.streak.current}
            </p>
            <p className="text-[11px] text-[var(--color-secondary)]">
              Day Streak
            </p>
          </div>
          <div>
            <p className="text-2xl font-bold text-[var(--color-text)]">
              {mostActiveCourse
                ? mostActiveCourse[0].toUpperCase()
                : '—'}
            </p>
            <p className="text-[11px] text-[var(--color-secondary)]">
              Most Active Course
            </p>
          </div>
        </div>
      </section>

      {/* Course activity */}
      <section className="lab-surface rounded-xl p-5">
        <h2 className="text-xs font-semibold tracking-wider text-[var(--color-secondary)] uppercase mb-3">
          Course Activity
        </h2>
        <div className="space-y-2">
          {Object.entries(courseStats).map(([id, stats]) => (
            <div key={id} className="flex items-center gap-3">
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{
                  backgroundColor:
                    COURSE_COLORS[id as keyof typeof COURSE_COLORS],
                }}
              />
              <span className="text-sm text-[var(--color-text)] w-20">
                {id.toUpperCase()}
              </span>
              <div className="flex-1 h-1 rounded-full bg-[rgba(167,139,250,0.1)] overflow-hidden">
                <div
                  className="h-full rounded-full bg-[var(--color-primary)]"
                  style={{ width: `${stats.percent}%` }}
                />
              </div>
              <span className="text-[11px] text-[var(--color-secondary)] w-10 text-right">
                {stats.completed}/{stats.total}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Recent */}
      {progress.recentActivity.length > 0 && (
        <section className="lab-surface rounded-xl p-5">
          <h2 className="text-xs font-semibold tracking-wider text-[var(--color-secondary)] uppercase mb-3">
            Recent Practice
          </h2>
          <div className="space-y-2">
            {progress.recentActivity.slice(0, 5).map((item) => (
              <Link
                key={item.id}
                to={`/challenge/${item.challengeId}`}
                className="flex items-center gap-2 text-sm text-[var(--color-secondary)] hover:text-[var(--color-text)] transition-colors"
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    backgroundColor:
                      COURSE_COLORS[item.course] || 'var(--color-accent)',
                  }}
                />
                <span className="truncate">{item.title}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Settings placeholder */}
      <section className="lab-surface rounded-xl p-5">
        <h2 className="text-xs font-semibold tracking-wider text-[var(--color-secondary)] uppercase mb-3">
          Settings
        </h2>
        <p className="text-xs text-[var(--color-secondary)] mb-4">
          Account settings and cloud sync will be available in a future release.
          Progress is currently stored locally on this device.
        </p>
        <button
          onClick={() => {
            if (
              window.confirm(
                'Reset all local Lab progress? This cannot be undone.'
              )
            ) {
              resetAll();
            }
          }}
          className="text-xs text-red-400/80 hover:text-red-400 transition-colors"
        >
          Reset local progress
        </button>
      </section>
    </div>
  );
}
