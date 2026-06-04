'use client';

import { BottomNav } from './BottomNav';
import { QuickAddButton } from './QuickAddButton';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh" style={{ background: 'var(--background)' }}>
      <main className="pb-[72px]">{children}</main>
      <BottomNav />
      <QuickAddButton />
    </div>
  );
}
