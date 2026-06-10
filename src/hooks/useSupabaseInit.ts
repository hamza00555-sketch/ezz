'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/appStore';

export function useSupabaseInit() {
  const loadFromSupabase = useAppStore((s) => s.loadFromSupabase);
  const router = useRouter();

  useEffect(() => {
    const { setAppReady } = useAppStore.getState();

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      // Demo mode — nothing to load, reveal the app immediately
      setAppReady(true);
      return;
    }

    let subscription: { unsubscribe: () => void } | null = null;

    async function init() {
      try {
        const { createClient } = await import('@/lib/supabase/client');
        const sb = createClient();

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

        const { data } = sb.auth.onAuthStateChange(async (event, sess) => {
          if (event === 'SIGNED_OUT') {
            router.push('/login');
            return;
          }
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
        // Reveal the app once the first auth + data load attempt settles,
        // whether it succeeded, failed, or there was nothing to load.
        setAppReady(true);
      }
    }

    init();

    return () => { subscription?.unsubscribe(); };
  }, [loadFromSupabase, router]);
}
