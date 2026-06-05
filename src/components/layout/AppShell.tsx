'use client';

import { BottomNav } from './BottomNav';
import { DemoReviewBanner } from './DemoReviewBanner'; // DEMO_REVIEW
import { useSupabaseInit } from '@/hooks/useSupabaseInit';

export function AppShell({ children, extraClass }: { children: React.ReactNode; extraClass?: string }) {
  useSupabaseInit();

  return (
    <div
      className={`app-bg${extraClass ? ` ${extraClass}` : ''}`}
      style={{ minHeight: '100dvh', color: 'var(--text-primary)' }}
    >
      <DemoReviewBanner />{/* DEMO_REVIEW */}
      <main
        style={{
          paddingBottom: 'calc(var(--bottom-nav-height) + env(safe-area-inset-bottom, 0px))',
        }}
      >
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
