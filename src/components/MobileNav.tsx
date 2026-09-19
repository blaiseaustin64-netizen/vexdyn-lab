import { NavLink } from 'react-router-dom';
import { Home, Code2, BarChart3, User } from './Icons';
import clsx from 'clsx';

const links = [
  { to: '/home', label: 'Home', icon: Home },
  { to: '/practice', label: 'Practice', icon: Code2 },
  { to: '/progress', label: 'Progress', icon: BarChart3 },
  { to: '/profile', label: 'Profile', icon: User },
];

export function MobileNav() {
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 border-t border-[var(--color-border)] bg-[rgba(8,6,15,0.92)] backdrop-blur-lg pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around h-16">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              clsx(
                'flex flex-col items-center justify-center gap-0.5 w-full h-full text-[10px] font-medium transition-colors',
                isActive
                  ? 'text-[var(--color-accent)]'
                  : 'text-[var(--color-secondary)]'
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  size={20}
                  strokeWidth={isActive ? 2 : 1.5}
                  className={isActive ? 'drop-shadow-[0_0_6px_rgba(167,139,250,0.5)]' : ''}
                />
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
