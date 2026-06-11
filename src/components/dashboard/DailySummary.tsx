'use client';

import { useAppStore } from '@/store/appStore';
import { BrandIcon, type BrandIconName } from '@/components/brand/BrandIcon';

const actions: { key: string; icon: BrandIconName; label: string; sub: string; color: string; bg: string; border: string }[] = [
  {
    key: 'task',
    icon: 'tasks',
    label: 'مهمة',
    sub: 'جديدة',
    color: 'var(--accent-strong)',
    bg: 'rgba(15,27,51,0.06)',
    border: 'rgba(15,27,51,0.12)',
  },
  {
    key: 'shortage',
    icon: 'groceries',
    label: 'نقص',
    sub: 'مطبخ',
    color: '#B8604E',
    bg: 'rgba(246,201,178,0.30)',
    border: 'rgba(246,201,178,0.55)',
  },
  {
    key: 'expense',
    icon: 'wallet',
    label: 'مصروف',
    sub: 'تسجيل',
    color: 'var(--accent-strong)',
    bg: 'rgba(15,27,51,0.06)',
    border: 'rgba(15,27,51,0.12)',
  },
  {
    key: 'announcement',
    icon: 'announcements',
    label: 'إعلان',
    sub: 'عائلي',
    color: 'var(--accent)',
    bg: 'rgba(201,122,102,0.10)',
    border: 'rgba(201,122,102,0.20)',
  },
];

export function DailySummary() {
  const setActiveQuickForm = useAppStore((s) => s.setActiveQuickForm);

  return (
    <div style={{ padding: `0 var(--page-px)`, marginBottom: 24 }}>
      <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 12, letterSpacing: '0.04em' }}>
        إضافة سريع
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {actions.map((action) => (
          <button
            key={action.key}
            onClick={() => setActiveQuickForm(action.key)}
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '14px 16px',
              borderRadius: 20,
              background: action.bg,
              border: `1px solid ${action.border}`,
              cursor: 'pointer',
              transition: 'transform 0.12s ease',
              textAlign: 'right',
            }}
            className="active:scale-[0.97]"
          >
            <div
              style={{
                width: 38, height: 38,
                borderRadius: 12,
                background: 'rgba(15,27,51,0.06)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <BrandIcon name={action.icon} size={18} color={action.color} />
            </div>
            <div>
              <p style={{ fontSize: 14, fontWeight: 700, color: action.color, lineHeight: 1.2 }}>
                {action.label}
              </p>
              <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>
                {action.sub}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
