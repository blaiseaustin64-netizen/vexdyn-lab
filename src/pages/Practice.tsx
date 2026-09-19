import { useMemo, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Filter } from '../components/Icons';
import { challenges } from '../data/challenges';
import { useLabProgress } from '../hooks/useLabProgress';
import {
  COURSE_COLORS,
  DIFFICULTY_LABELS,
  TYPE_LABELS,
  type CourseId,
  type Difficulty,
  type ChallengeType,
  type ChallengeStatus,
} from '../types';
import clsx from 'clsx';

const COURSES: (CourseId | 'all')[] = ['all', 'html', 'css', 'javascript', 'react'];
const DIFFICULTIES: (Difficulty | 'all')[] = ['all', 'beginner', 'intermediate', 'advanced'];
const TYPES: (ChallengeType | 'all')[] = [
  'all',
  'code-challenge',
  'fix-the-code',
  'predict-the-output',
  'complete-the-code',
  'multiple-choice',
  'mini-task',
  'debugging',
];
const STATUSES: (ChallengeStatus | 'all')[] = [
  'all',
  'not-started',
  'in-progress',
  'completed',
];

export function Practice() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { getChallengeStatus } = useLabProgress();

  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const courseFilter = (searchParams.get('course') as CourseId | 'all') || 'all';
  const difficultyFilter =
    (searchParams.get('difficulty') as Difficulty | 'all') || 'all';
  const typeFilter = (searchParams.get('type') as ChallengeType | 'all') || 'all';
  const statusFilter =
    (searchParams.get('status') as ChallengeStatus | 'all') || 'all';

  const setFilter = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value === 'all') next.delete(key);
    else next.set(key, value);
    setSearchParams(next, { replace: true });
  };

  const filtered = useMemo(() => {
    return challenges.filter((c) => {
      if (courseFilter !== 'all' && c.course !== courseFilter) return false;
      if (difficultyFilter !== 'all' && c.difficulty !== difficultyFilter)
        return false;
      if (typeFilter !== 'all' && c.type !== typeFilter) return false;
      const status = getChallengeStatus(c.id);
      if (statusFilter !== 'all' && status !== statusFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.topic.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [
    courseFilter,
    difficultyFilter,
    typeFilter,
    statusFilter,
    search,
    getChallengeStatus,
  ]);

  return (
    <div className="space-y-6 animate-fade-in">
      <header>
        <h1 className="text-2xl font-bold text-[var(--color-text)] mb-1">
          PRACTICE
        </h1>
        <p className="text-sm text-[var(--color-secondary)]">
          Choose a challenge. Test what you know. Build real skill.
        </p>
      </header>

      {/* Search + Filter toggle */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-secondary)]"
          />
          <input
            type="search"
            placeholder="Search challenges..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-[var(--color-surface-solid)] border border-[var(--color-border)]
                       text-sm text-[var(--color-text)] placeholder:text-[var(--color-secondary)]
                       focus:outline-none focus:border-[var(--color-accent)] transition-colors"
          />
        </div>
        <button
          onClick={() => setShowFilters((v) => !v)}
          className={clsx(
            'px-3 rounded-lg border transition-colors flex items-center gap-1.5 text-sm',
            showFilters
              ? 'border-[var(--color-accent)] text-[var(--color-accent)] bg-[rgba(124,58,237,0.1)]'
              : 'border-[var(--color-border)] text-[var(--color-secondary)] hover:text-[var(--color-text)]'
          )}
        >
          <Filter size={16} />
          <span className="hidden sm:inline">Filters</span>
        </button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="lab-surface rounded-xl p-4 space-y-4 animate-fade-in">
          <FilterGroup
            label="Course"
            options={COURSES}
            value={courseFilter}
            onChange={(v) => setFilter('course', v)}
            renderLabel={(v) => (v === 'all' ? 'All' : v.toUpperCase())}
          />
          <FilterGroup
            label="Difficulty"
            options={DIFFICULTIES}
            value={difficultyFilter}
            onChange={(v) => setFilter('difficulty', v)}
            renderLabel={(v) =>
              v === 'all' ? 'All' : DIFFICULTY_LABELS[v as Difficulty]
            }
          />
          <FilterGroup
            label="Type"
            options={TYPES}
            value={typeFilter}
            onChange={(v) => setFilter('type', v)}
            renderLabel={(v) =>
              v === 'all' ? 'All' : TYPE_LABELS[v as ChallengeType]
            }
          />
          <FilterGroup
            label="Status"
            options={STATUSES}
            value={statusFilter}
            onChange={(v) => setFilter('status', v)}
            renderLabel={(v) =>
              v === 'all'
                ? 'All'
                : v === 'not-started'
                  ? 'Not Started'
                  : v === 'in-progress'
                    ? 'In Progress'
                    : 'Completed'
            }
          />
        </div>
      )}

      {/* Results */}
      <div>
        <p className="text-xs text-[var(--color-secondary)] mb-3">
          {filtered.length} challenge{filtered.length !== 1 ? 's' : ''}
        </p>

        {filtered.length === 0 ? (
          <div className="lab-surface rounded-xl p-10 text-center">
            <p className="text-[var(--color-secondary)] text-sm">
              No matching challenges.
            </p>
            <button
              onClick={() => {
                setSearch('');
                setSearchParams({}, { replace: true });
              }}
              className="mt-3 text-sm text-[var(--color-accent)] hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filtered.map((c) => {
              const status = getChallengeStatus(c.id);
              return (
                <Link
                  key={c.id}
                  to={`/challenge/${c.id}`}
                  className="lab-surface rounded-xl p-4 hover:border-[rgba(167,139,250,0.3)] transition-all group flex flex-col"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="text-[10px] font-bold uppercase tracking-wider"
                      style={{ color: COURSE_COLORS[c.course] }}
                    >
                      {c.course}
                    </span>
                    <span className="text-[10px] text-[var(--color-secondary)] px-1.5 py-0.5 rounded bg-[rgba(167,139,250,0.08)]">
                      {DIFFICULTY_LABELS[c.difficulty]}
                    </span>
                    <span className="text-[10px] text-[var(--color-secondary)]">
                      {TYPE_LABELS[c.type]}
                    </span>
                  </div>
                  <h3 className="font-semibold text-[var(--color-text)] group-hover:text-[var(--color-accent)] transition-colors mb-1">
                    {c.title}
                  </h3>
                  <p className="text-xs text-[var(--color-secondary)] line-clamp-2 flex-1 mb-3">
                    {c.description}
                  </p>
                  <div className="flex items-center justify-between mt-auto">
                    <StatusBadge status={status} />
                    <span className="text-xs font-medium text-[var(--color-primary)] group-hover:underline">
                      {status === 'completed'
                        ? 'REVIEW →'
                        : status === 'in-progress'
                          ? 'CONTINUE →'
                          : 'START →'}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function FilterGroup<T extends string>({
  label,
  options,
  value,
  onChange,
  renderLabel,
}: {
  label: string;
  options: T[];
  value: T;
  onChange: (v: T) => void;
  renderLabel: (v: T) => string;
}) {
  return (
    <div>
      <p className="text-[10px] font-semibold tracking-wider text-[var(--color-secondary)] uppercase mb-1.5">
        {label}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={clsx(
              'px-2.5 py-1 rounded-md text-xs font-medium transition-colors',
              value === opt
                ? 'bg-[var(--color-primary)] text-white'
                : 'bg-[rgba(167,139,250,0.06)] text-[var(--color-secondary)] hover:text-[var(--color-text)]'
            )}
          >
            {renderLabel(opt)}
          </button>
        ))}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: ChallengeStatus }) {
  const styles = {
    'not-started': 'text-[var(--color-secondary)] bg-[rgba(169,163,184,0.1)]',
    'in-progress': 'text-amber-300 bg-amber-500/10',
    completed: 'text-emerald-300 bg-emerald-500/10',
  };
  const labels = {
    'not-started': 'Not Started',
    'in-progress': 'In Progress',
    completed: 'Completed',
  };
  return (
    <span className={clsx('text-[10px] font-medium px-1.5 py-0.5 rounded', styles[status])}>
      {labels[status]}
    </span>
  );
}
