import { Outlet } from 'react-router-dom';
import { DesktopNav } from './DesktopNav';
import { MobileNav } from './MobileNav';

export function Layout() {
  return (
    <div className="min-h-dvh flex flex-col bg-[var(--color-bg)] text-[var(--color-text)]">
      <DesktopNav />
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 pb-24 md:pb-10 pt-4 md:pt-6">
        <Outlet />
      </main>
      <MobileNav />
    </div>
  );
}
