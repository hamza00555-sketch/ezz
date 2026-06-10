'use client';

import { BottomNav } from './BottomNav';
import { DemoReviewBanner } from './DemoReviewBanner'; // DEMO_REVIEW
import { BootSplash } from './BootSplash';
import { useSupabaseInit } from '@/hooks/useSupabaseInit';
import { useAppStore } from '@/store/appStore';

export function AppShell({ children, extraClass }: { children: React.ReactNode; extraClass?: string }) {
  useSupabaseInit();
  const appReady = useAppStore((s) => s.appReady);

  if (!appReady) return <BootSplash />;

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
