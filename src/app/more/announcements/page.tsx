'use client';

import Link from 'next/link';
import { ChevronRight, Megaphone, Check, Users } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/shared/PageHeader';
import { EmptyState } from '@/components/shared/EmptyState';
import { MemberAvatar } from '@/components/shared/MemberAvatar';
import { useAppStore } from '@/store/appStore';
import { formatRelativeArabic } from '@/lib/utils';

export default function AnnouncementsPage() {
  const { announcements, members, currentFamilyGroupId, currentUserId, confirmAnnouncement } =
    useAppStore();
  const items = announcements
    .filter((a) => a.familyGroupId === currentFamilyGroupId)
    .sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));

  return (
    <AppShell>
      <PageHeader
        title="الإعلانات"
        action={
          <Link href="/more" className="p-2">
            <ChevronRight size={20} color="#78716C" />
          </Link>
        }
      />

      <div className="p-4 flex flex-col gap-3">
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
                className="p-4 rounded-2xl"
                style={{
                  background: ann.isPinned ? 'linear-gradient(135deg, #FFF7ED, #FFFBEB)' : '#FFFFFF',
                  border: `1px solid ${ann.isPinned ? '#FED7AA' : 'var(--border)'}`,
                }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="p-2.5 rounded-xl flex-shrink-0"
                    style={{ background: ann.isPinned ? '#FED7AA' : '#F5F5F4' }}
                  >
                    <Megaphone size={18} color={ann.isPinned ? '#C8922A' : '#78716C'} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-bold text-sm" style={{ color: '#1C1917' }}>
                        {ann.title}
                      </p>
                      {ann.isPinned && (
                        <span
                          className="text-[10px] px-2 py-0.5 rounded-full font-medium flex-shrink-0"
                          style={{ background: '#FED7AA', color: '#92400E' }}
                        >
                          📌 مثبت
                        </span>
                      )}
                    </div>
                    <p className="text-sm mt-1.5 leading-relaxed" style={{ color: '#57534E' }}>
                      {ann.message}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      {publisher && (
                        <div className="flex items-center gap-1.5">
                          <MemberAvatar name={publisher.name} size="sm" />
                          <span className="text-xs" style={{ color: '#78716C' }}>
                            {publisher.name}
                          </span>
                        </div>
                      )}
                      <span className="text-xs" style={{ color: '#A8A29E' }}>
                        {formatRelativeArabic(ann.createdAt)}
                      </span>
                    </div>

                    {ann.requiresConfirmation && (
                      <div className="flex items-center gap-2 mt-2">
                        <Users size={12} color="#78716C" />
                        <span className="text-xs" style={{ color: '#78716C' }}>
                          {ann.confirmedBy.length}/{totalAudience} أكدوا القراءة
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {ann.requiresConfirmation && !confirmed && ann.status === 'active' && (
                  <button
                    onClick={() => confirmAnnouncement(ann.id, currentUserId)}
                    className="mt-3 w-full py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2"
                    style={{ background: '#C8922A', color: '#FFFFFF' }}
                  >
                    <Check size={16} />
                    تأكيد القراءة
                  </button>
                )}
                {confirmed && (
                  <div
                    className="mt-3 py-2 rounded-xl text-sm font-medium flex items-center justify-center gap-2"
                    style={{ background: '#D1FAE5', color: '#065F46' }}
                  >
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
