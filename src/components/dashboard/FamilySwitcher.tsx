'use client';

import { ChevronDown, Bell } from 'lucide-react';
import { useAppStore } from '@/store/appStore';

export function FamilySwitcher() {
  const { familyGroups, currentFamilyGroupId, announcements, currentUserId } = useAppStore();
  const group = familyGroups.find((g) => g.id === currentFamilyGroupId);
  const unreadAnnouncements = announcements.filter(
    (a) => a.status === 'active' && !a.confirmedBy.includes(currentUserId)
  ).length;

  if (!group) return null;

  return (
    <div
      className="flex items-center justify-between px-4 py-3 sticky top-0 z-20"
      style={{ background: 'var(--background)' }}
    >
      {/* Family selector */}
      <button
        className="flex items-center gap-2 px-3 py-2 rounded-2xl transition-colors active:scale-95"
        style={{ background: '#FFFFFF', border: '1px solid var(--border)' }}
      >
        <span className="text-xl">{group.emoji}</span>
        <span className="font-bold text-sm" style={{ color: '#1C1917' }}>
          {group.name}
        </span>
        <ChevronDown size={14} color="#78716C" />
      </button>

      {/* Notifications */}
      <button
        className="relative p-2.5 rounded-2xl"
        style={{ background: '#FFFFFF', border: '1px solid var(--border)' }}
      >
        <Bell size={20} color="#1C1917" />
        {unreadAnnouncements > 0 && (
          <span
            className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
            style={{ background: '#DC2626' }}
          >
            {unreadAnnouncements}
          </span>
        )}
      </button>
    </div>
  );
}
