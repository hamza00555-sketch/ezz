'use client';

import { Megaphone, Check } from 'lucide-react';
import { useAppStore } from '@/store/appStore';

export function PinnedAnnouncements() {
  const { announcements, currentFamilyGroupId, currentUserId, members, confirmAnnouncement } =
    useAppStore();

  const pinned = announcements.filter(
    (a) =>
      a.familyGroupId === currentFamilyGroupId &&
      a.isPinned &&
      a.status === 'active'
  );

  if (pinned.length === 0) return null;

  return (
    <div className="px-4 mb-5">
      {pinned.map((ann) => {
        const publisher = members.find((m) => m.id === ann.publishedBy);
        const confirmed = ann.confirmedBy.includes(currentUserId);
        return (
          <div
            key={ann.id}
            className="p-4 rounded-2xl"
            style={{
              background: 'linear-gradient(135deg, #FFF7ED, #FFFBEB)',
              border: '1px solid #FED7AA',
            }}
          >
            <div className="flex items-start gap-3">
              <div
                className="p-2 rounded-xl flex-shrink-0"
                style={{ background: '#FED7AA' }}
              >
                <Megaphone size={16} color="#C8922A" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-sm mb-1" style={{ color: '#1C1917' }}>
                  {ann.title}
                </p>
                <p className="text-sm leading-relaxed" style={{ color: '#57534E' }}>
                  {ann.message}
                </p>
                {publisher && (
                  <p className="text-xs mt-2" style={{ color: '#78716C' }}>
                    نشره {publisher.name}
                  </p>
                )}
              </div>
            </div>

            {ann.requiresConfirmation && !confirmed && (
              <button
                onClick={() => confirmAnnouncement(ann.id, currentUserId)}
                className="mt-3 w-full py-2 rounded-xl text-sm font-medium flex items-center justify-center gap-2"
                style={{ background: '#C8922A', color: '#FFFFFF' }}
              >
                <Check size={16} />
                تأكيد القراءة
              </button>
            )}
            {confirmed && (
              <div
                className="mt-3 w-full py-2 rounded-xl text-sm font-medium flex items-center justify-center gap-2"
                style={{ background: '#D1FAE5', color: '#065F46' }}
              >
                <Check size={16} />
                تم تأكيد القراءة
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
