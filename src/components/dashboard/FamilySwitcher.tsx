'use client';

import { Bell, ChevronDown } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

export function FamilySwitcher() {
  const { familyGroups, currentFamilyGroupId, announcements, currentUserId, members } = useAppStore();
  const group = familyGroups.find((g) => g.id === currentFamilyGroupId);
  const me = members.find((m) => m.id === currentUserId);
  const unread = announcements.filter(
    (a) => a.status === 'active' && !a.confirmedBy.includes(currentUserId)
  ).length;

  const today = new Date();
  const h = today.getHours();
  const greeting = h < 12 ? 'صباح الخير' : h < 17 ? 'مساء الخير' : 'مساء النور';

  if (!group) return null;

  return (
    <div className="px-4 pb-5" style={{ paddingTop: 'max(20px, env(safe-area-inset-top, 20px))' }}>
      {/* Top bar */}
      <div className="flex items-center justify-between mb-5">
        <button
          className="flex items-center gap-2 py-2 px-3 rounded-2xl active:scale-[0.97] transition-transform"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-xs)' }}
        >
          <span className="text-base leading-none">{group.emoji}</span>
          <span className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{group.name}</span>
          <ChevronDown size={13} strokeWidth={2.2} color="var(--foreground-muted)" />
        </button>

        <button
          className="relative w-10 h-10 rounded-2xl flex items-center justify-center active:scale-[0.97] transition-transform"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-xs)' }}
        >
          <Bell size={18} strokeWidth={1.8} color="var(--foreground)" />
          {unread > 0 && (
            <span
              className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
              style={{ background: 'var(--c-red)' }}
            >
              {unread}
            </span>
          )}
        </button>
      </div>

      {/* Greeting */}
      <p className="text-[13px] mb-1" style={{ color: 'var(--foreground-muted)' }}>
        {format(today, 'EEEE، dd MMMM', { locale: ar })}
      </p>
      <h1 className="text-[25px] font-bold leading-tight" style={{ color: 'var(--foreground)' }}>
        {greeting}،{' '}
        <span style={{ color: 'var(--c-green)' }}>{me?.name.split(' ')[0]}</span>
      </h1>
    </div>
  );
}
