'use client';

import { Megaphone, Check } from 'lucide-react';
import { useAppStore } from '@/store/appStore';

export function PinnedAnnouncements() {
  const { announcements, currentFamilyGroupId, currentUserId, members, confirmAnnouncement } = useAppStore();

  const pinned = announcements.filter(
    (a) => a.familyGroupId === currentFamilyGroupId && a.isPinned && a.status === 'active'
  );

  if (pinned.length === 0) return null;

  return (
    <div className="px-4 mb-5">
      <h2 className="text-[15px] font-bold mb-3" style={{ color: 'var(--foreground)' }}>
        إعلانات مثبّتة
      </h2>

      <div className="flex flex-col gap-2">
        {pinned.map((ann) => {
          const publisher = members.find((m) => m.id === ann.publishedBy);
          const confirmed = ann.confirmedBy.includes(currentUserId);

          return (
            <div
              key={ann.id}
              className="p-4"
              style={{
                background: 'linear-gradient(135deg, var(--c-gold-light), #FDF4E3)',
                border: '1px solid rgba(201,164,92,0.3)',
                borderRadius: 'var(--card-radius)',
              }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(201,164,92,0.2)' }}
                >
                  <Megaphone size={16} color="var(--c-gold)" strokeWidth={1.8} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold mb-1" style={{ color: 'var(--foreground)' }}>
                    {ann.title}
                  </p>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--foreground-muted)' }}>
                    {ann.message}
                  </p>
                  {publisher && (
                    <p className="text-[11px] mt-2" style={{ color: 'var(--foreground-faint)' }}>
                      نشره {publisher.name}
                    </p>
                  )}
                </div>
              </div>

              {ann.requiresConfirmation && (
                <div className="mt-3">
                  {confirmed ? (
                    <div
                      className="flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold"
                      style={{ background: 'var(--c-green-soft)', color: 'var(--c-green)' }}
                    >
                      <Check size={13} strokeWidth={2.5} />
                      تم تأكيد القراءة
                    </div>
                  ) : (
                    <button
                      onClick={() => confirmAnnouncement(ann.id, currentUserId)}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold active:scale-[0.98] transition-transform"
                      style={{ background: 'var(--c-gold)', color: '#fff' }}
                    >
                      <Check size={13} strokeWidth={2.5} />
                      تأكيد القراءة
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
