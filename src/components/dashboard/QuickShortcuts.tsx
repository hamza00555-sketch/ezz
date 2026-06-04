'use client';

import Link from 'next/link';
import { CheckSquare, Building2, ChefHat, Lightbulb, Users, Wallet } from 'lucide-react';

const shortcuts = [
  { href: '/tasks', icon: CheckSquare, label: 'المهام', color: '#2563EB', bg: '#EFF6FF' },
  { href: '/home-section', icon: Building2, label: 'البيت', color: '#059669', bg: '#ECFDF5' },
  { href: '/kitchen', icon: ChefHat, label: 'المطبخ', color: '#C8922A', bg: '#FFF7ED' },
  { href: '/more/wishes', icon: Lightbulb, label: 'الأفكار', color: '#D97706', bg: '#FFFBEB' },
  { href: '/more/family', icon: Users, label: 'العائلة', color: '#7C3AED', bg: '#F5F3FF' },
  { href: '/more/expenses', icon: Wallet, label: 'المصاريف', color: '#DC2626', bg: '#FEF2F2' },
];

export function QuickShortcuts() {
  return (
    <div className="px-4 mb-5">
      <div className="grid grid-cols-3 gap-2">
        {shortcuts.map((s) => {
          const Icon = s.icon;
          return (
            <Link
              key={s.href}
              href={s.href}
              className="flex flex-col items-center gap-2 p-3 rounded-2xl active:scale-95 transition-transform"
              style={{ background: '#FFFFFF', border: '1px solid var(--border)' }}
            >
              <div className="p-2.5 rounded-xl" style={{ background: s.bg }}>
                <Icon size={20} color={s.color} />
              </div>
              <span className="text-xs font-medium" style={{ color: '#1C1917' }}>
                {s.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
