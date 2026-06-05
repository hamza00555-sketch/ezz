'use client';

import { CheckSquare, ShoppingCart, Wallet, Megaphone } from 'lucide-react';
import { useAppStore } from '@/store/appStore';

const actions = [
  {
    key: 'task',
    icon: CheckSquare,
    label: 'مهمة',
    sub: 'جديدة',
    color: 'var(--accent-strong)',
    bg: 'rgba(163,177,138,0.10)',
    border: 'rgba(163,177,138,0.20)',
  },
  {
    key: 'shortage',
    icon: ShoppingCart,
    label: 'نقص',
    sub: 'مطبخ',
    color: 'var(--warning)',
    bg: 'var(--warning-soft)',
    border: 'rgba(253,186,116,0.25)',
  },
  {
    key: 'expense',
    icon: Wallet,
    label: 'مصروف',
    sub: 'تسجيل',
    color: 'var(--info)',
    bg: 'var(--info-soft)',
    border: 'rgba(125,211,252,0.20)',
  },
  {
    key: 'announcement',
    icon: Megaphone,
    label: 'إعلان',
    sub: 'عائلي',
    color: 'var(--bronze)',
    bg: 'rgba(176,141,87,0.10)',
    border: 'rgba(176,141,87,0.22)',
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
        {actions.map((action) => {
          const Icon = action.icon;
          return (
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
                  background: `rgba(${action.color === 'var(--accent-strong)' ? '163,177,138' : '255,255,255'}, 0.10)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Icon size={18} color={action.color} strokeWidth={1.8} />
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 700, color: action.color, lineHeight: 1.2 }}>
                  {action.label}
                </p>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                  {action.sub}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
