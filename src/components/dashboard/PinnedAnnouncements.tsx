'use client';

import { Megaphone, Check } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { useShallow } from 'zustand/react/shallow';

export function PinnedAnnouncements() {
  const { announcements, currentFamilyGroupId, currentUserId, members, confirmAnnouncement } = useAppStore(
    useShallow((s) => ({
      announcements: s.announcements,
      currentFamilyGroupId: s.currentFamilyGroupId,
      currentUserId: s.currentUserId,
      members: s.members,
      confirmAnnouncement: s.confirmAnnouncement,
    }))
  );

  const pinned = announcements.filter(
    (a) => a.familyGroupId === currentFamilyGroupId && a.isPinned && a.status === 'active'
  );

  if (pinned.length === 0) return null;

  return (
    <div style={{ padding: `0 var(--page-px)`, marginBottom: 24 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {pinned.map((ann) => {
          const publisher = members.find((m) => m.id === ann.publishedBy);
          const confirmed = ann.confirmedBy.includes(currentUserId);

          return (
            <div
              key={ann.id}
              style={{
                background: 'linear-gradient(135deg, rgba(176,141,87,0.12), rgba(176,141,87,0.06))',
                border: '1px solid rgba(176,141,87,0.25)',
                borderRadius: 20,
                padding: '16px',
              }}
            >
              <div style={{ display: 'flex', gap: 12, marginBottom: ann.requiresConfirmation ? 14 : 0 }}>
                <div
                  style={{
                    width: 36, height: 36, borderRadius: 12, flexShrink: 0,
                    background: 'rgba(176,141,87,0.18)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <Megaphone size={16} color="var(--bronze)" strokeWidth={1.8} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
                    {ann.title}
                  </p>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {ann.message}
                  </p>
                  {publisher && (
                    <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>
                      نشره {publisher.name}
                    </p>
                  )}
                </div>
              </div>

              {ann.requiresConfirmation && (
                confirmed ? (
                  <div
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                      padding: '9px 0', borderRadius: 12,
                      background: 'var(--success-soft)', color: 'var(--success)',
                      fontSize: 12, fontWeight: 600,
                    }}
                  >
                    <Check size={13} strokeWidth={2.5} /> تم تأكيد القراءة
                  </div>
                ) : (
                  <button
                    onClick={() => confirmAnnouncement(ann.id, currentUserId)}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                      padding: '10px 0', borderRadius: 12,
                      background: 'rgba(176,141,87,0.22)',
                      border: '1px solid rgba(176,141,87,0.35)',
                      color: 'var(--bronze)', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                    }}
                    className="active:scale-[0.98]"
                  >
                    <Check size={13} strokeWidth={2.5} /> تأكيد القراءة
                  </button>
                )
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
