'use client';

import { ChevronDown, Bell } from 'lucide-react';
import { useAppStore } from '@/store/appStore';

export function FamilySwitcher() {
  const { familyGroups, currentFamilyGroupId, announcements, currentUserId, members } = useAppStore();
  const group = familyGroups.find((g) => g.id === currentFamilyGroupId);
  const me = members.find((m) => m.id === currentUserId);
  const unread = announcements.filter(
    (a) => a.status === 'active' && !a.confirmedBy.includes(currentUserId)
  ).length;

  if (!group) return null;

  return (
    <div
      className="px-4 pt-safe-top pb-3 flex items-center justify-between"
      style={{
        background: 'linear-gradient(180deg, #FFFFFF 0%, rgba(255,255,255,0) 100%)',
        paddingTop: 'max(16px, env(safe-area-inset-top, 16px))',
      }}
    >
      <button
        className="flex items-center gap-2.5 py-2 px-3 rounded-2xl active:scale-95 transition-transform"
        style={{ background: '#FFFFFF', border: '1px solid var(--border)', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
      >
        <span className="text-xl leading-none">{group.emoji}</span>
        <div className="text-right">
          <p className="font-bold text-sm leading-tight" style={{ color: '#1C1917' }}>{group.name}</p>
          <p className="text-[10px] leading-none mt-0.5" style={{ color: '#78716C' }}>{me?.name}</p>
        </div>
        <ChevronDown size={14} color="#78716C" />
      </button>

      <button
        className="relative p-3 rounded-2xl active:scale-95 transition-transform"
        style={{ background: '#FFFFFF', border: '1px solid var(--border)', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
      >
        <Bell size={20} color="#1C1917" />
        {unread > 0 && (
          <span
            className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
            style={{ background: '#DC2626' }}
          >
            {unread}
          </span>
        )}
      </button>
    </div>
  );
}
