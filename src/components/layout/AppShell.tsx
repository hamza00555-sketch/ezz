'use client';

import { BottomNav } from './BottomNav';
import { QuickAddButton } from './QuickAddButton';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh" style={{ background: 'var(--background)' }}>
      <main style={{ paddingBottom: 'calc(var(--bottom-nav-height) + env(safe-area-inset-bottom, 0px))' }}>
        {children}
      </main>
      <BottomNav />
      <QuickAddButton />
    </div>
  );
}
