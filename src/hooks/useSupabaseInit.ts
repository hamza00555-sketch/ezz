'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/appStore';

// Minimum milliseconds between full data refreshes. During a single session,
// client-side navigations (AppShell remounts per page) reuse the in-memory store
// instead of refetching. lastLoadedAt is NOT persisted, so a cold reload always
// refetches fresh data.
const REFRESH_THROTTLE_MS = 30_000;

// All primary routes. We prefetch their JS bundles during the splash so the
// first visit to each tab is instant instead of fetching a chunk on entry.
const APP_ROUTES = ['/dashboard', '/tasks', '/kitchen', '/home-section', '/more'];

export function useSupabaseInit() {
  const loadFromSupabase = useAppStore((s) => s.loadFromSupabase);
  const router = useRouter();

  useEffect(() => {
    const store = useAppStore.getState();
    const { setAppReady, clearUserData } = store;

    // Warm every route bundle while the splash is up so tab switches are instant.
    APP_ROUTES.forEach((r) => { try { router.prefetch(r); } catch { /* noop */ } });

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      setAppReady(true);
      return;
    }

    // Recover the family id from persisted groups if it wasn't persisted directly.
    if (!store.currentFamilyGroupId && store.familyGroups.length > 0) {
      useAppStore.setState({ currentFamilyGroupId: store.familyGroups[0].id });
    }

    const isStale = Date.now() - store.lastLoadedAt > REFRESH_THROTTLE_MS;

    // Same-session navigation: data is already fresh in memory, so reveal at once.
    // This path never shows the splash because appReady is already true from the
    // first load (the store is a singleton across client-side navigations).
    if (!isStale) {
      setAppReady(true);
      return;
    }

    let subscription: { unsubscribe: () => void } | null = null;

    async function init() {
      try {
        const { createClient } = await import('@/lib/supabase/client');
        const sb = createClient();

        // Cold start: hold the splash until the full dataset is in the store, so
        // every page is fully populated the moment the user enters the app.
        const { data: { session } } = await sb.auth.getSession();
        if (session?.user) {
          // Pin the user identity immediately so every component that reads
          // currentUserId / currentFamilyGroupId works even if the full DB
          // fetch fails (e.g. a transient network error).
          useAppStore.setState({ currentUserId: session.user.id });
          const { data: profile } = await sb
            .from('profiles')
            .select('family_group_id')
            .eq('id', session.user.id)
            .single();
          if (profile?.family_group_id) {
            useAppStore.setState({ currentFamilyGroupId: profile.family_group_id });
            await loadFromSupabase(session.user.id, profile.family_group_id);
          }
        }

        // Keep an auth subscription so sign-out / sign-in are caught instantly.
        const { data } = sb.auth.onAuthStateChange(async (event, sess) => {
          if (event === 'SIGNED_OUT') {
            clearUserData();
            router.push('/login');
            return;
          }
          // INITIAL_SESSION is already handled by getSession() above — skip it to
          // avoid a redundant second full data fetch on every mount.
          if (event === 'INITIAL_SESSION') return;
          if (sess?.user) {
            useAppStore.setState({ currentUserId: sess.user.id });
            const { data: profile } = await sb
              .from('profiles')
              .select('family_group_id')
              .eq('id', sess.user.id)
              .single();
            if (profile?.family_group_id) {
              useAppStore.setState({ currentFamilyGroupId: profile.family_group_id });
              await loadFromSupabase(sess.user.id, profile.family_group_id);
            }
          }
        });
        subscription = data.subscription;
      } catch (err) {
        console.error('[useSupabaseInit]', err);
      } finally {
        // Reveal the app only after data is loaded (or the attempt failed) — the
        // splash stays up for the whole cold-start load so entry is smooth.
        setAppReady(true);
      }
    }

    init();

    return () => { subscription?.unsubscribe(); };
  }, [loadFromSupabase, router]);
}
