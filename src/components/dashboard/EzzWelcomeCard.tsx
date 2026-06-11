'use client';

import { ArrowLeft } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { EzzPattern } from '@/components/brand/EzzPattern';

/**
 * EzzWelcomeCard — a calm, premium welcome card shown at the top of the Dashboard.
 * Not a full welcome screen. Uses the brand logo + a very subtle corner pattern.
 * Colors come from design tokens so it adapts to light/dark automatically.
 */
export function EzzWelcomeCard() {
  const setActiveQuickForm = useAppStore((s) => s.setActiveQuickForm);

  return (
    <div style={{ padding: '0 var(--page-px)', marginBottom: 20 }}>
      <div
        style={{
          position: 'relative',
          overflow: 'hidden',
          background: 'var(--surface-card, #FFFDF8)',
          border: '1px solid var(--border-soft)',
          borderRadius: 24,
          padding: 22,
        }}
      >
        {/* Subtle brand pattern in the far corner — felt, not seen */}
        <EzzPattern name="quiet-flow-corner" position="top-start" opacity={0.07} className="w-28 h-28" />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 44,
              height: 44,
              borderRadius: 14,
              background: 'rgba(201,122,102,0.12)',
              marginBottom: 14,
            }}
          >
            <img
              src="/brand/app-icon/ezz-app-icon.svg"
              alt="عز"
              width={30}
              height={30}
              style={{ borderRadius: 9 }}
              draggable={false}
            />
          </div>

          <h2
            style={{
              fontSize: 19,
              fontWeight: 700,
              color: 'var(--text-primary)',
              lineHeight: 1.35,
              marginBottom: 6,
            }}
          >
            مرحبًا، وش نرتب اليوم؟
          </h2>
          <p
            style={{
              fontSize: 13.5,
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              marginBottom: 16,
            }}
          >
            خلّ كل شيء في البيت واضح ومرتب في مكان واحد.
          </p>

          <button
            onClick={() => setActiveQuickForm('task')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '9px 16px',
              borderRadius: 14,
              background: 'rgba(201,122,102,0.12)',
              border: '1px solid rgba(201,122,102,0.22)',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
            className="active:scale-[0.97] transition-all"
          >
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent)' }}>
              ابدأ بإضافة مهمة
            </span>
            <ArrowLeft size={15} strokeWidth={2.2} color="var(--accent)" />
          </button>
        </div>
      </div>
    </div>
  );
}
