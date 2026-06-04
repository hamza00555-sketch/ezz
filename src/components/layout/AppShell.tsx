'use client';

import { BottomNav } from './BottomNav';
import { QuickAddButton } from './QuickAddButton';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="app-bg"
      style={{ minHeight: '100dvh', color: 'var(--text-primary)' }}
    >
      <main
        style={{
          paddingBottom: 'calc(var(--bottom-nav-height) + env(safe-area-inset-bottom, 0px))',
        }}
      >
        {children}
      </main>
      <BottomNav />
      <QuickAddButton />
    </div>
  );
}
