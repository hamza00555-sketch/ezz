'use client';

import { Bell, ChevronDown } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { useShallow } from 'zustand/react/shallow';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

export function FamilySwitcher() {
  const { familyGroups, currentFamilyGroupId, announcements, currentUserId, members } = useAppStore(
    useShallow((s) => ({
      familyGroups: s.familyGroups,
      currentFamilyGroupId: s.currentFamilyGroupId,
      announcements: s.announcements,
      currentUserId: s.currentUserId,
      members: s.members,
    }))
  );
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
    <div
      style={{
        padding: `max(24px, env(safe-area-inset-top, 24px)) var(--page-px) 20px`,
      }}
    >
      {/* Top row: family pill + avatar/bell */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        {/* Family switcher */}
        <button
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 12px',
            borderRadius: 20,
            background: 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.10)',
            cursor: 'pointer',
            transition: 'background 0.15s ease',
          }}
          className="active:scale-[0.97]"
        >
          <span style={{ fontSize: 15, lineHeight: 1 }}>{group.emoji}</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
            {group.name}
          </span>
          <ChevronDown size={12} strokeWidth={2.5} color="var(--text-muted)" />
        </button>

        {/* Bell */}
        <button
          style={{
            width: 40, height: 40,
            borderRadius: 16,
            background: 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.10)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
            position: 'relative',
          }}
          className="active:scale-95"
        >
          <Bell size={17} strokeWidth={1.8} color="var(--text-secondary)" />
          {unread > 0 && (
            <span
              style={{
                position: 'absolute', top: -3, right: -3,
                width: 16, height: 16,
                borderRadius: '50%',
                background: 'var(--danger)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 9, fontWeight: 700, color: '#fff',
              }}
            >
              {unread}
            </span>
          )}
        </button>
      </div>

      {/* Greeting */}
      <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 4 }}>
        {format(today, 'EEEE، dd MMMM', { locale: ar })}
      </p>
      <h1 style={{ fontSize: 26, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>
        {greeting}،{' '}
        <span style={{ color: 'var(--accent-strong)' }}>{me?.name.split(' ')[0]}</span>
      </h1>
    </div>
  );
}
