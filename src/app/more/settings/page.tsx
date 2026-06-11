'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, Bell, BellOff, Loader, LogOut } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/shared/PageHeader';
import { MemberAvatar } from '@/components/shared/MemberAvatar';
import { EzzLogo } from '@/components/brand/EzzLogo';
import { useAppStore } from '@/store/appStore';
import { useShallow } from 'zustand/react/shallow';
import { roleLabels } from '@/lib/utils';
import { subscribeToPush, unsubscribeFromPush } from '@/lib/push';
import { savePushSubscription, deletePushSubscription } from '@/actions/push';

type PushState = 'loading' | 'unsupported' | 'denied' | 'subscribed' | 'unsubscribed';

export default function SettingsPage() {
  const [pushState, setPushState] = useState<PushState>('loading');
  const [loggingOut, setLoggingOut] = useState(false);
  const { members, currentUserId } = useAppStore(
    useShallow((s) => ({ members: s.members, currentUserId: s.currentUserId }))
  );
  const currentMember = members.find((m) => m.id === currentUserId);
  const isDemo = !process.env.NEXT_PUBLIC_SUPABASE_URL;

  async function handleLogout() {
    if (isDemo) return;
    setLoggingOut(true);
    const { createClient } = await import('@/lib/supabase/client');
    await createClient().auth.signOut();
    // useSupabaseInit's onAuthStateChange handles redirect to /login
  }

  useEffect(() => {
    async function loadPushState() {
      if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        setPushState('unsupported');
        return;
      }
      if (Notification.permission === 'denied') {
        setPushState('denied');
        return;
      }
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      setPushState(sub ? 'subscribed' : 'unsubscribed');
    }
    void loadPushState();
  }, []);

  async function handleTogglePush() {
    if (pushState === 'subscribed') {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        await deletePushSubscription(sub.endpoint);
        await unsubscribeFromPush();
        setPushState('unsubscribed');
      }
    } else {
      setPushState('loading');
      const sub = await subscribeToPush();
      if (!sub) { setPushState('unsubscribed'); return; }
      const json = sub.toJSON();
      await savePushSubscription({
        endpoint: json.endpoint!,
        keys: { p256dh: json.keys!.p256dh, auth: json.keys!.auth },
      });
      setPushState('subscribed');
    }
  }

  return (
    <AppShell>
      <PageHeader
        title="الإعدادات"
        action={
          <Link href="/more" style={{ padding: 8, display: 'block' }}>
            <ChevronRight size={20} color="var(--text-muted)" />
          </Link>
        }
      />

      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* ── Current user ─────────────────────────────────────────────────── */}
        {currentMember && (
          <div style={{ padding: 16, borderRadius: 20, background: 'var(--surface-card)', border: '1px solid var(--border-soft)', display: 'flex', alignItems: 'center', gap: 14 }}>
            <MemberAvatar name={currentMember.name} size="lg" />
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>{currentMember.name}</p>
              <p style={{ fontSize: 12, marginTop: 2, color: 'var(--text-muted)' }}>{roleLabels[currentMember.role]}</p>
            </div>
            {isDemo && (
              <span style={{ fontSize: 10, padding: '3px 10px', borderRadius: 10, background: 'rgba(201,122,102,0.15)', color: 'var(--bronze)', fontWeight: 600 }}>
                تجريبي
              </span>
            )}
          </div>
        )}

        {/* Notifications */}
        <div style={{ padding: 16, borderRadius: 20, background: 'var(--surface-card)', border: '1px solid var(--border-soft)' }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 14, letterSpacing: '0.04em' }}>
            الإشعارات
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
                تذكيرات المهام
              </p>
              <p style={{ fontSize: 12, marginTop: 2, color: 'var(--text-muted)' }}>
                {pushState === 'subscribed' ? 'مفعّلة — ستصلك تذكيرات قبل المواعيد' :
                 pushState === 'denied'     ? 'محظورة من إعدادات المتصفح' :
                 pushState === 'unsupported'? 'غير مدعومة في هذا المتصفح' :
                                              'غير مفعّلة'}
              </p>
            </div>

            {pushState === 'loading' ? (
              <Loader size={20} color="var(--text-muted)" className="animate-spin" />
            ) : pushState === 'unsupported' || pushState === 'denied' ? (
              <BellOff size={20} color="var(--text-muted)" />
            ) : (
              <button
                role="switch"
                aria-checked={pushState === 'subscribed'}
                aria-label="تذكيرات المهام"
                onClick={handleTogglePush}
                style={{
                  position: 'relative',
                  width: 48, height: 28,
                  flexShrink: 0,
                  borderRadius: 999,
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'background 0.2s ease',
                  background: pushState === 'subscribed' ? 'var(--accent-strong)' : 'rgba(15,27,51,0.14)',
                }}
              >
                <span
                  style={{
                    position: 'absolute',
                    top: 3,
                    insetInlineStart: pushState === 'subscribed' ? 23 : 3,
                    width: 22, height: 22,
                    borderRadius: '50%',
                    background: '#FFFDF8',
                    boxShadow: '0 1px 3px rgba(15,27,51,0.25)',
                    transition: 'inset-inline-start 0.2s cubic-bezier(0.34,1.56,0.64,1)',
                  }}
                />
              </button>
            )}
          </div>
        </div>

        {/* ── Logout ───────────────────────────────────────────────────────── */}
        {!isDemo && (
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              width: '100%', padding: '14px 16px', borderRadius: 20,
              background: 'rgba(220,38,38,0.08)',
              border: '1px solid rgba(220,38,38,0.22)',
              cursor: loggingOut ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit', opacity: loggingOut ? 0.6 : 1,
            }}
          >
            {loggingOut
              ? <Loader size={16} color="var(--danger)" className="animate-spin" />
              : <LogOut size={16} color="var(--danger)" />
            }
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--danger)' }}>
              {loggingOut ? 'جاري الخروج...' : 'تسجيل الخروج'}
            </span>
          </button>
        )}

        {/* App info */}
        <div style={{ padding: 16, borderRadius: 20, background: 'var(--surface-card)', border: '1px solid var(--border-soft)' }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 14, letterSpacing: '0.04em' }}>
            عن التطبيق
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <img
              src="/brand/app-icon/ezz-app-icon.svg"
              alt="عز"
              width={56}
              height={56}
              style={{ borderRadius: 16 }}
              draggable={false}
            />
            <EzzLogo size="md" />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>الإصدار</p>
            <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)' }}>1.0.0</p>
          </div>
          <div style={{ height: 1, background: 'var(--border-soft)', margin: '12px 0' }} />
          <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6, textAlign: 'center' }}>
            عز — بيت العز يا بتنا
          </p>
        </div>
      </div>
    </AppShell>
  );
}
