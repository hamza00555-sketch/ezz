'use client';

import Link from 'next/link';
import { useAppStore } from '@/store/appStore';
import { isOverdue } from '@/lib/utils';

export function QuickShortcuts() {
  const { tasks, shortages, expenses, wallets, currentFamilyGroupId } = useAppStore();

  const pendingTasks = tasks.filter(
    (t) =>
      t.familyGroupId === currentFamilyGroupId &&
      !['done', 'cancelled'].includes(t.status)
  ).length;

  const missingItems = shortages.filter(
    (s) => s.familyGroupId === currentFamilyGroupId && s.status === 'missing'
  ).length;

  const totalSpent = expenses
    .filter((e) => e.familyGroupId === currentFamilyGroupId)
    .reduce((sum, e) => sum + e.amount, 0);

  const stats = [
    {
      href: '/tasks',
      label: 'المهام',
      value: pendingTasks,
      unit: 'معلقة',
      color: pendingTasks === 0 ? 'var(--success)' : 'var(--text-primary)',
      sub: pendingTasks === 0 ? 'كلها مكتملة' : `${pendingTasks} مهمة`,
    },
    {
      href: '/kitchen',
      label: 'المطبخ',
      value: missingItems,
      unit: 'ناقص',
      color: missingItems > 0 ? 'var(--warning)' : 'var(--success)',
      sub: missingItems === 0 ? 'المطبخ فل الفل' : `${missingItems} صنف`,
    },
    {
      href: '/more/expenses',
      label: 'المصاريف',
      value: totalSpent,
      unit: 'ريال',
      color: 'var(--text-primary)',
      sub: 'هذا الشهر',
      isAmount: true,
    },
  ];

  return (
    <div style={{ padding: `0 var(--page-px)`, marginBottom: 32 }}>
      <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 12, letterSpacing: '0.04em' }}>
        لمحة اليوم
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
        {stats.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            style={{
              display: 'block',
              background: 'var(--surface-card)',
              border: '1px solid var(--border-soft)',
              borderRadius: 20,
              padding: '14px 12px',
              textDecoration: 'none',
              transition: 'background 0.15s ease',
            }}
            className="active:scale-[0.97]"
          >
            <p
              style={{
                fontSize: s.isAmount ? 16 : 22,
                fontWeight: 800,
                color: s.color,
                lineHeight: 1,
                marginBottom: 4,
              }}
            >
              {s.isAmount ? s.value.toLocaleString('ar-SA') : s.value}
            </p>
            <p style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 2 }}>
              {s.label}
            </p>
            <p style={{ fontSize: 10, color: 'var(--text-muted)' }}>{s.sub}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
