import { useNavigate } from 'react-router-dom';
import { ArrowRight } from '../components/Icons';

export function Entry() {
  const navigate = useNavigate();

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center relative overflow-hidden lab-grid">
      {/* Subtle atmospheric glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% 40%, rgba(124,58,237,0.12) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 text-center px-6 max-w-lg animate-fade-in">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--color-primary)] mb-8 shadow-[0_0_40px_rgba(124,58,237,0.35)]">
          <span className="text-2xl font-bold text-white tracking-tight">V</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-[var(--color-text)] mb-3">
          VEXDYN LAB
        </h1>

        <p className="text-lg sm:text-xl font-medium text-[var(--color-accent)] tracking-wide mb-2">
          LEARN. PRACTICE. MASTER.
        </p>

        <p className="text-[var(--color-secondary)] text-sm sm:text-base mb-10 max-w-sm mx-auto">
          Turn what you learned into real skill.
        </p>

        <button
          onClick={() => navigate('/home')}
          className="group inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[var(--color-primary)] text-white font-semibold text-sm tracking-wide
                     hover:bg-[#6d28d9] transition-all duration-200
                     shadow-[0_0_24px_rgba(124,58,237,0.35)] hover:shadow-[0_0_32px_rgba(124,58,237,0.5)]
                     focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
        >
          ENTER THE LAB
          <ArrowRight
            size={18}
            className="transition-transform group-hover:translate-x-0.5"
          />
        </button>
      </div>

      <div className="absolute bottom-8 text-[11px] text-[var(--color-secondary)] opacity-60">
        VEXDYN Ecosystem · Practice Environment
      </div>
    </div>
  );
}
