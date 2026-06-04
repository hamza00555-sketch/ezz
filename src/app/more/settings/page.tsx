'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, Bell, BellOff, Loader } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/shared/PageHeader';
import { subscribeToPush, unsubscribeFromPush } from '@/lib/push';
import { savePushSubscription, deletePushSubscription } from '@/actions/push';

type PushState = 'loading' | 'unsupported' | 'denied' | 'subscribed' | 'unsubscribed';

export default function SettingsPage() {
  const [pushState, setPushState] = useState<PushState>('loading');

  useEffect(() => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      setPushState('unsupported');
      return;
    }
    if (Notification.permission === 'denied') {
      setPushState('denied');
      return;
    }
    navigator.serviceWorker.ready.then((reg) =>
      reg.pushManager.getSubscription().then((sub) =>
        setPushState(sub ? 'subscribed' : 'unsubscribed')
      )
    );
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
                onClick={handleTogglePush}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '8px 16px', borderRadius: 12,
                  fontSize: 13, fontWeight: 600, cursor: 'pointer', border: 'none',
                  background: pushState === 'subscribed' ? 'var(--danger-soft)' : 'rgba(199,231,123,0.15)',
                  color: pushState === 'subscribed' ? 'var(--danger)' : 'var(--accent-strong)',
                }}
              >
                {pushState === 'subscribed'
                  ? <><BellOff size={14} /> إيقاف</>
                  : <><Bell size={14} /> تفعيل</>
                }
              </button>
            )}
          </div>
        </div>

        {/* App info */}
        <div style={{ padding: 16, borderRadius: 20, background: 'var(--surface-card)', border: '1px solid var(--border-soft)' }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 14, letterSpacing: '0.04em' }}>
            عن التطبيق
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>الإصدار</p>
            <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)' }}>1.0.0</p>
          </div>
          <div style={{ height: 1, background: 'var(--border-soft)', margin: '12px 0' }} />
          <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6, textAlign: 'center' }}>
            عز — بيت العز يا بتنا 🏡
          </p>
        </div>
      </div>
    </AppShell>
  );
}
