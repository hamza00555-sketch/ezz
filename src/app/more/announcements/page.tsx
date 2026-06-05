'use client';

import Link from 'next/link';
import { ChevronRight, Megaphone, Check, Users } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/shared/PageHeader';
import { EmptyState } from '@/components/shared/EmptyState';
import { MemberAvatar } from '@/components/shared/MemberAvatar';
import { useAppStore } from '@/store/appStore';
import { useShallow } from 'zustand/react/shallow';
import { formatRelativeArabic } from '@/lib/utils';

export default function AnnouncementsPage() {
  const { announcements, members, currentFamilyGroupId, currentUserId, confirmAnnouncement } =
    useAppStore(useShallow((s) => ({ announcements: s.announcements, members: s.members, currentFamilyGroupId: s.currentFamilyGroupId, currentUserId: s.currentUserId, confirmAnnouncement: s.confirmAnnouncement })));
  const items = announcements
    .filter((a) => a.familyGroupId === currentFamilyGroupId)
    .sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));

  return (
    <AppShell>
      <PageHeader
        title="الإعلانات"
        action={
          <Link href="/more" style={{ padding: 8, display: 'block' }}>
            <ChevronRight size={20} color="var(--text-muted)" />
          </Link>
        }
      />

      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {items.length === 0 ? (
          <EmptyState icon="📢" title="لا توجد إعلانات" description="انشر إعلاناً مهماً لأفراد العائلة" />
        ) : (
          items.map((ann) => {
            const publisher = members.find((m) => m.id === ann.publishedBy);
            const confirmed = ann.confirmedBy.includes(currentUserId);
            const totalAudience = ann.audience === 'all'
              ? members.filter((m) => m.familyGroupId === currentFamilyGroupId).length
              : (ann.audience as string[]).length;

            return (
              <div
                key={ann.id}
                style={{
                  padding: 16, borderRadius: 20,
                  background: ann.isPinned
                    ? 'linear-gradient(135deg, rgba(176,141,87,0.14), rgba(176,141,87,0.07))'
                    : 'var(--surface-card)',
                  border: `1px solid ${ann.isPinned ? 'rgba(176,141,87,0.30)' : 'var(--border-soft)'}`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ padding: 10, borderRadius: 14, flexShrink: 0, background: ann.isPinned ? 'rgba(176,141,87,0.20)' : 'rgba(255,255,255,0.07)' }}>
                    <Megaphone size={18} color={ann.isPinned ? 'var(--bronze)' : 'var(--text-muted)'} strokeWidth={1.8} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                      <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
                        {ann.title}
                      </p>
                      {ann.isPinned && (
                        <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 10, fontWeight: 600, flexShrink: 0, background: 'rgba(176,141,87,0.20)', color: 'var(--bronze)' }}>
                          📌 مثبت
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: 13, marginTop: 6, lineHeight: 1.6, color: 'var(--text-secondary)' }}>
                      {ann.message}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 10 }}>
                      {publisher && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <MemberAvatar name={publisher.name} size="sm" />
                          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                            {publisher.name}
                          </span>
                        </div>
                      )}
                      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                        {formatRelativeArabic(ann.createdAt)}
                      </span>
                    </div>

                    {ann.requiresConfirmation && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                        <Users size={12} color="var(--text-muted)" />
                        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                          {ann.confirmedBy.length}/{totalAudience} أكدوا القراءة
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {ann.requiresConfirmation && !confirmed && ann.status === 'active' && (
                  <button
                    onClick={() => confirmAnnouncement(ann.id, currentUserId)}
                    style={{
                      marginTop: 14, width: '100%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      padding: '11px 0', borderRadius: 14,
                      background: 'rgba(176,141,87,0.22)',
                      border: '1px solid rgba(176,141,87,0.35)',
                      color: 'var(--bronze)', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                    }}
                    className="active:scale-[0.98]"
                  >
                    <Check size={16} />
                    تأكيد القراءة
                  </button>
                )}
                {confirmed && ann.requiresConfirmation && (
                  <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '10px 0', borderRadius: 14, background: 'var(--success-soft)', color: 'var(--success)', fontSize: 13, fontWeight: 600 }}>
                    <Check size={16} />
                    قرأت هذا الإعلان
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </AppShell>
  );
}
