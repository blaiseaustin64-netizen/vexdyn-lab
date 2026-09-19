import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Play,
  RotateCcw,
  ChevronRight,
  Lightbulb,
  CheckCircle2,
  XCircle,
  Loader2,
} from '../components/Icons';
import { getChallenge, getNextChallenge } from '../data/challenges';
import { useLabProgress } from '../hooks/useLabProgress';
import { evaluateChallenge, type EvaluationResult } from '../lib/evaluator';
import {
  COURSE_COLORS,
  DIFFICULTY_LABELS,
  TYPE_LABELS,
} from '../types';
import { CodeEditor } from '../components/CodeEditor';
import clsx from 'clsx';

export function Challenge() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const challenge = id ? getChallenge(id) : undefined;
  const {
    getChallengeStatus,
    completeChallenge,
    attemptChallenge,
    saveCode,
    getInProgressCode,
  } = useLabProgress();

  const [code, setCode] = useState('');
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [revealedHints, setRevealedHints] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const codeRef = useRef(code);

  useEffect(() => {
    if (!challenge) return;
    const saved = getInProgressCode(challenge.id);
    setCode(saved ?? challenge.starterCode ?? '');
    setSelectedAnswer(null);
    setResult(null);
    setRevealedHints(0);
    setShowExplanation(false);
  }, [challenge?.id]);

  useEffect(() => {
    codeRef.current = code;
  }, [code]);

  // Persist code on change (debounced via effect)
  useEffect(() => {
    if (!challenge || !code) return;
    const t = setTimeout(() => {
      if (code !== (challenge.starterCode ?? '')) {
        saveCode(challenge.id, code);
      }
    }, 800);
    return () => clearTimeout(t);
  }, [code, challenge?.id]);

  const handleRun = useCallback(async () => {
    if (!challenge) return;
    setIsRunning(true);
    setResult(null);

    // Small delay for UX
    await new Promise((r) => setTimeout(r, 400));

    const evaluation = evaluateChallenge(
      challenge,
      code,
      selectedAnswer ?? undefined
    );
    setResult(evaluation);
    setIsRunning(false);

    if (evaluation.success) {
      completeChallenge(
        challenge.id,
        challenge.title,
        challenge.course,
        challenge.type
      );
      setShowExplanation(true);
    } else {
      attemptChallenge(
        challenge.id,
        challenge.title,
        challenge.course,
        challenge.type,
        code
      );
    }
  }, [challenge, code, selectedAnswer, completeChallenge, attemptChallenge]);

  const handleReset = () => {
    if (!challenge) return;
    if (code !== (challenge.starterCode ?? '') && !window.confirm('Reset to starter code? Your changes will be lost.')) {
      return;
    }
    setCode(challenge.starterCode ?? '');
    setResult(null);
    setSelectedAnswer(null);
    setRevealedHints(0);
    setShowExplanation(false);
  };

  const revealHint = () => {
    if (!challenge) return;
    setRevealedHints((h) => Math.min(h + 1, challenge.hints.length));
  };

  if (!challenge) {
    return (
      <div className="text-center py-20">
        <p className="text-[var(--color-secondary)] mb-4">Challenge not found.</p>
        <Link to="/practice" className="text-[var(--color-accent)] hover:underline text-sm">
          Back to Practice
        </Link>
      </div>
    );
  }

  const status = getChallengeStatus(challenge.id);
  const isChoice =
    challenge.type === 'multiple-choice' ||
    challenge.type === 'predict-the-output';
  const next = getNextChallenge(challenge.id);

  return (
    <div className="animate-fade-in max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate('/practice')}
          className="p-2 rounded-lg text-[var(--color-secondary)] hover:text-[var(--color-text)] hover:bg-[rgba(167,139,250,0.08)] transition-colors"
          aria-label="Back to Practice"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-0.5">
            <span
              className="text-[10px] font-bold uppercase tracking-wider"
              style={{ color: COURSE_COLORS[challenge.course] }}
            >
              {challenge.course}
            </span>
            <span className="text-[10px] text-[var(--color-secondary)]">
              {challenge.topic}
            </span>
            <span className="text-[10px] text-[var(--color-secondary)] px-1.5 py-0.5 rounded bg-[rgba(167,139,250,0.08)]">
              {DIFFICULTY_LABELS[challenge.difficulty]} · {TYPE_LABELS[challenge.type]}
            </span>
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-[var(--color-text)] truncate">
            {challenge.title}
          </h1>
        </div>
      </div>

      {/* Desktop: side by side / Mobile: stacked */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Instructions panel */}
        <div className="lg:col-span-2 space-y-4">
          <section className="lab-surface rounded-xl p-4">
            <h2 className="text-xs font-semibold tracking-wider text-[var(--color-secondary)] uppercase mb-2">
              Instructions
            </h2>
            <div className="text-sm text-[var(--color-text)] whitespace-pre-wrap leading-relaxed">
              {challenge.instructions}
            </div>
          </section>

          {/* Hints */}
          <section className="lab-surface rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xs font-semibold tracking-wider text-[var(--color-secondary)] uppercase flex items-center gap-1.5">
                <Lightbulb size={12} />
                Hints
              </h2>
              {revealedHints < challenge.hints.length && (
                <button
                  onClick={revealHint}
                  className="text-[11px] text-[var(--color-accent)] hover:underline"
                >
                  Reveal hint ({revealedHints}/{challenge.hints.length})
                </button>
              )}
            </div>
            {revealedHints === 0 ? (
              <p className="text-xs text-[var(--color-secondary)]">
                Try solving it first. Hints are available if you need them.
              </p>
            ) : (
              <ul className="space-y-2">
                {challenge.hints.slice(0, revealedHints).map((h, i) => (
                  <li
                    key={i}
                    className="text-sm text-[var(--color-text)] pl-3 border-l-2 border-[var(--color-primary)]"
                  >
                    {h}
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Explanation (after success) */}
          {showExplanation && (
            <section className="lab-surface rounded-xl p-4 border-[rgba(167,139,250,0.25)]">
              <h2 className="text-xs font-semibold tracking-wider text-[var(--color-accent)] uppercase mb-2">
                Why it works
              </h2>
              <p className="text-sm text-[var(--color-text)] leading-relaxed">
                {challenge.explanation}
              </p>
            </section>
          )}
        </div>

        {/* Editor / Answer panel */}
        <div className="lg:col-span-3 space-y-4">
          {isChoice ? (
            <section className="lab-surface rounded-xl p-4">
              <h2 className="text-xs font-semibold tracking-wider text-[var(--color-secondary)] uppercase mb-3">
                Your Answer
              </h2>
              <div className="space-y-2">
                {challenge.options?.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedAnswer(idx);
                      setResult(null);
                    }}
                    className={clsx(
                      'w-full text-left px-4 py-3 rounded-lg text-sm transition-all border',
                      selectedAnswer === idx
                        ? 'border-[var(--color-primary)] bg-[rgba(124,58,237,0.15)] text-[var(--color-text)]'
                        : 'border-[var(--color-border)] text-[var(--color-secondary)] hover:border-[rgba(167,139,250,0.3)] hover:text-[var(--color-text)]'
                    )}
                  >
                    <span className="font-mono text-xs text-[var(--color-accent)] mr-2">
                      {String.fromCharCode(65 + idx)}.
                    </span>
                    {opt}
                  </button>
                ))}
              </div>
            </section>
          ) : (
            <section className="lab-surface rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-3 py-2 border-b border-[var(--color-border)]">
                <span className="text-[10px] font-semibold tracking-wider text-[var(--color-secondary)] uppercase">
                  Code
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={handleReset}
                    className="p-1.5 rounded text-[var(--color-secondary)] hover:text-[var(--color-text)] hover:bg-[rgba(167,139,250,0.08)] transition-colors"
                    title="Reset to starter code"
                    aria-label="Reset code"
                  >
                    <RotateCcw size={14} />
                  </button>
                </div>
              </div>
              <CodeEditor
                value={code}
                onChange={setCode}
                language={challenge.course === 'javascript' || challenge.course === 'react' ? 'javascript' : challenge.course}
              />
            </section>
          )}

          {/* Run button */}
          <button
            onClick={handleRun}
            disabled={isRunning || (isChoice && selectedAnswer === null)}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[var(--color-primary)] text-white font-semibold text-sm
                       hover:bg-[#6d28d9] disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all shadow-[0_0_20px_rgba(124,58,237,0.25)]"
          >
            {isRunning ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                CHECKING YOUR SOLUTION...
              </>
            ) : (
              <>
                <Play size={16} />
                {isChoice ? 'SUBMIT ANSWER' : 'RUN CODE'}
              </>
            )}
          </button>

          {/* Result */}
          {result && (
            <section
              className={clsx(
                'rounded-xl p-4 border animate-fade-in',
                result.success
                  ? 'bg-[rgba(16,185,129,0.08)] border-emerald-500/30'
                  : 'bg-[rgba(239,68,68,0.06)] border-red-500/20'
              )}
            >
              <div className="flex items-center gap-2 mb-2">
                {result.success ? (
                  <CheckCircle2 size={18} className="text-emerald-400" />
                ) : (
                  <XCircle size={18} className="text-red-400" />
                )}
                <h3
                  className={clsx(
                    'font-semibold text-sm',
                    result.success ? 'text-emerald-300' : 'text-red-300'
                  )}
                >
                  {result.success ? 'CHALLENGE COMPLETE' : 'NOT QUITE'}
                </h3>
                {result.success && (
                  <span className="text-[10px] font-bold tracking-wider text-emerald-400/80 ml-auto">
                    VERIFIED
                  </span>
                )}
              </div>
              <p className="text-sm text-[var(--color-text)] mb-2">
                {result.message}
              </p>
              {result.details && result.details.length > 0 && (
                <ul className="space-y-1 mb-3">
                  {result.details.map((d, i) => (
                    <li
                      key={i}
                      className="text-xs text-[var(--color-secondary)] font-mono"
                    >
                      {d}
                    </li>
                  ))}
                </ul>
              )}
              {!result.success && (
                <div className="flex flex-wrap gap-2 mt-3">
                  <button
                    onClick={() => {
                      setResult(null);
                    }}
                    className="text-xs font-medium px-3 py-1.5 rounded-lg bg-[rgba(167,139,250,0.1)] text-[var(--color-accent)] hover:bg-[rgba(167,139,250,0.2)] transition-colors"
                  >
                    TRY AGAIN
                  </button>
                  {revealedHints < challenge.hints.length && (
                    <button
                      onClick={revealHint}
                      className="text-xs font-medium px-3 py-1.5 rounded-lg text-[var(--color-secondary)] hover:text-[var(--color-text)] transition-colors"
                    >
                      Show hint
                    </button>
                  )}
                </div>
              )}
              {result.success && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {next && (
                    <Link
                      to={`/challenge/${next.id}`}
                      className="inline-flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg bg-[var(--color-primary)] text-white hover:bg-[#6d28d9] transition-colors"
                    >
                      NEXT CHALLENGE
                      <ChevronRight size={14} />
                    </Link>
                  )}
                  <Link
                    to="/practice"
                    className="text-xs font-medium px-3 py-1.5 rounded-lg text-[var(--color-secondary)] hover:text-[var(--color-text)] transition-colors"
                  >
                    Back to Practice
                  </Link>
                </div>
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
