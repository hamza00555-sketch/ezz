'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/appStore';

// Minimum milliseconds between full data refreshes to avoid hammering Supabase
// on every client-side navigation (AppShell remounts on each page).
const REFRESH_THROTTLE_MS = 30_000;

export function useSupabaseInit() {
  const loadFromSupabase = useAppStore((s) => s.loadFromSupabase);
  const router = useRouter();

  useEffect(() => {
    const store = useAppStore.getState();
    const { setAppReady, clearUserData } = store;

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      setAppReady(true);
      return;
    }

    // Stale-while-revalidate: if we have valid cached credentials + data from a
    // previous session, reveal the app immediately so the user never waits on
    // an empty screen. The background refresh below will silently update data.
    //
    // If currentFamilyGroupId isn't persisted yet (first load after this update),
    // try to derive it from the persisted familyGroups array as a fallback.
    if (!store.currentFamilyGroupId && store.familyGroups.length > 0) {
      useAppStore.setState({ currentFamilyGroupId: store.familyGroups[0].id });
    }
    const hasCachedData = useAppStore.getState().currentFamilyGroupId !== '' && store.members.length > 0;
    if (hasCachedData) {
      setAppReady(true);
    }

    // True if enough time has passed to warrant a fresh data fetch.
    const isStale = Date.now() - store.lastLoadedAt > REFRESH_THROTTLE_MS;

    let subscription: { unsubscribe: () => void } | null = null;

    async function init() {
      try {
        const { createClient } = await import('@/lib/supabase/client');
        const sb = createClient();

        // Initial fetch: skip when data is fresh to avoid 12+ queries on every
        // client-side navigation (AppShell remounts on each page change).
        if (isStale) {
          const { data: { session } } = await sb.auth.getSession();
          if (session?.user) {
            const { data: profile } = await sb
              .from('profiles')
              .select('family_group_id')
              .eq('id', session.user.id)
              .single();
            if (profile?.family_group_id) {
              await loadFromSupabase(session.user.id, profile.family_group_id);
            }
          }
        }

        // Always subscribe for auth changes — sign-out must be caught regardless
        // of the throttle so the user gets redirected to /login immediately.
        const { data } = sb.auth.onAuthStateChange(async (event, sess) => {
          if (event === 'SIGNED_OUT') {
            clearUserData();
            router.push('/login');
            return;
          }
          // INITIAL_SESSION is already handled by getSession() above — skip to
          // avoid a redundant second full data fetch on every mount.
          if (event === 'INITIAL_SESSION') return;
          if (sess?.user) {
            const { data: profile } = await sb
              .from('profiles')
              .select('family_group_id')
              .eq('id', sess.user.id)
              .single();
            if (profile?.family_group_id) {
              await loadFromSupabase(sess.user.id, profile.family_group_id);
            }
          }
        });
        subscription = data.subscription;
      } catch (err) {
        console.error('[useSupabaseInit]', err);
      } finally {
        setAppReady(true);
      }
    }

    init();

    return () => { subscription?.unsubscribe(); };
  }, [loadFromSupabase, router]);
}
