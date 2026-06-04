'use client';

import Link from 'next/link';
import { ListChecks, Building2, ChefHat, Lightbulb, Users, Wallet } from 'lucide-react';

const shortcuts = [
  { href: '/tasks',        icon: ListChecks, label: 'المهام',    color: 'var(--c-green)',  bg: 'var(--c-green-soft)' },
  { href: '/home-section', icon: Building2,  label: 'البيت',     color: '#1D4ED8',         bg: '#EFF6FF'             },
  { href: '/kitchen',      icon: ChefHat,    label: 'المطبخ',    color: '#B45309',         bg: 'var(--c-amber-soft)' },
  { href: '/more/wishes',  icon: Lightbulb,  label: 'الأفكار',   color: 'var(--c-gold)',   bg: 'var(--c-gold-light)' },
  { href: '/more/family',  icon: Users,      label: 'العائلة',   color: '#7C3AED',         bg: '#F5F3FF'             },
  { href: '/more/expenses',icon: Wallet,     label: 'المصاريف',  color: 'var(--c-red)',    bg: 'var(--c-red-soft)'   },
];

export function QuickShortcuts() {
  return (
    <div className="px-4 mb-8">
      <h2 className="text-[15px] font-bold mb-3" style={{ color: 'var(--foreground)' }}>اختصارات</h2>
      <div className="grid grid-cols-3 gap-2.5">
        {shortcuts.map((s) => {
          const Icon = s.icon;
          return (
            <Link
              key={s.href}
              href={s.href}
              className="flex flex-col items-center gap-2 p-3.5 rounded-[18px] active:scale-95 transition-transform"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-xs)' }}
            >
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: s.bg }}>
                <Icon size={18} color={s.color} strokeWidth={1.8} />
              </div>
              <span className="text-[12px] font-medium" style={{ color: 'var(--foreground)' }}>
                {s.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
