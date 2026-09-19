import { NavLink } from 'react-router-dom';
import { Home, Code2, BarChart3, User } from './Icons';
import clsx from 'clsx';

const links = [
  { to: '/home', label: 'Home', icon: Home },
  { to: '/practice', label: 'Practice', icon: Code2 },
  { to: '/progress', label: 'Progress', icon: BarChart3 },
  { to: '/profile', label: 'Profile', icon: User },
];

export function DesktopNav() {
  return (
    <header className="hidden md:block sticky top-0 z-40 border-b border-[var(--color-border)] bg-[rgba(8,6,15,0.85)] backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <NavLink to="/home" className="flex items-center gap-2 group">
          <div className="w-7 h-7 rounded-md bg-[var(--color-primary)] flex items-center justify-center text-xs font-bold text-white shadow-[0_0_12px_rgba(124,58,237,0.4)]">
            V
          </div>
          <span className="font-semibold tracking-wide text-[var(--color-text)] group-hover:text-[var(--color-accent)] transition-colors">
            VEXDYN LAB
          </span>
        </NavLink>

        <nav className="flex items-center gap-1">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                  isActive
                    ? 'text-[var(--color-accent)] bg-[rgba(124,58,237,0.15)]'
                    : 'text-[var(--color-secondary)] hover:text-[var(--color-text)] hover:bg-[rgba(167,139,250,0.06)]'
                )
              }
            >
              <Icon size={16} strokeWidth={1.75} />
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
