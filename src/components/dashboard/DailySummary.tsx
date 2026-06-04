'use client';

import { CheckSquare, ShoppingCart, Wallet, Megaphone } from 'lucide-react';
import { useAppStore } from '@/store/appStore';

const actions = [
  { key: 'task',         icon: CheckSquare,  label: 'مهمة',    color: 'var(--c-green)', bg: 'var(--c-green-soft)' },
  { key: 'shortage',     icon: ShoppingCart, label: 'نقص',     color: '#B45309',        bg: 'var(--c-amber-soft)' },
  { key: 'expense',      icon: Wallet,       label: 'مصروف',   color: 'var(--c-muted)', bg: '#F2F4F7'             },
  { key: 'announcement', icon: Megaphone,    label: 'إعلان',   color: 'var(--c-dark)',  bg: '#EAECF0'             },
];

export function DailySummary() {
  const { setActiveQuickForm } = useAppStore();

  return (
    <div className="px-4 mb-5">
      <p className="text-[13px] font-semibold mb-3" style={{ color: 'var(--foreground-muted)' }}>إضافة سريع</p>
      <div className="grid grid-cols-4 gap-2.5">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.key}
              onClick={() => setActiveQuickForm(action.key)}
              className="flex flex-col items-center gap-2 py-3.5 rounded-[18px] active:scale-95 transition-transform"
              style={{ background: action.bg }}
            >
              <Icon size={20} color={action.color} strokeWidth={1.8} />
              <span className="text-[11px] font-semibold leading-none" style={{ color: action.color }}>
                {action.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
