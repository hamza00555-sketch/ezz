'use client';

import Link from 'next/link';
import { ChevronRight, Lightbulb, Link2, MapPin } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/shared/PageHeader';
import { EmptyState } from '@/components/shared/EmptyState';
import { MemberAvatar } from '@/components/shared/MemberAvatar';
import { useAppStore } from '@/store/appStore';
import { wishStatusLabels, wishStatusColors, priorityLabels, priorityColors } from '@/lib/utils';

const typeIcons: Record<string, string> = {
  idea: '💡',
  need: '🛒',
  link: '🔗',
  fix: '🔧',
};

const typeLabels: Record<string, string> = {
  idea: 'فكرة',
  need: 'احتياج',
  link: 'رابط',
  fix: 'إصلاح',
};

export default function WishesPage() {
  const { wishItems, members, currentFamilyGroupId } = useAppStore();
  const items = wishItems.filter((w) => w.familyGroupId === currentFamilyGroupId);

  const grouped: Record<string, typeof items> = {};
  items.forEach((w) => {
    if (!grouped[w.status]) grouped[w.status] = [];
    grouped[w.status].push(w);
  });

  const statusOrder = ['idea', 'studying', 'approved', 'done', 'postponed', 'cancelled'];

  return (
    <AppShell>
      <PageHeader
        title="الأفكار والـ Wish List"
        action={
          <Link href="/more" className="p-2">
            <ChevronRight size={20} color="#78716C" />
          </Link>
        }
      />

      <div className="p-4">
        {items.length === 0 ? (
          <EmptyState
            icon="💡"
            title="لا توجد أفكار بعد"
            description="سجّل أفكارك واحتياجاتك المستقبلية للبيت"
          />
        ) : (
          <div className="flex flex-col gap-5">
            {statusOrder.map((status) => {
              const group = grouped[status];
              if (!group || group.length === 0) return null;
              return (
                <div key={status}>
                  <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: '#78716C' }}>
                    {wishStatusLabels[status as keyof typeof wishStatusLabels]} ({group.length})
                  </p>
                  <div className="flex flex-col gap-2">
                    {group.map((item) => {
                      const creator = members.find((m) => m.id === item.createdBy);
                      return (
                        <div
                          key={item.id}
                          className="p-3.5 rounded-2xl"
                          style={{
                            background: ['done', 'cancelled'].includes(item.status) ? '#F9FAFB' : '#FFFFFF',
                            border: '1px solid var(--border)',
                            opacity: ['done', 'cancelled'].includes(item.status) ? 0.65 : 1,
                          }}
                        >
                          <div className="flex items-start gap-3">
                            <span className="text-xl flex-shrink-0 mt-0.5">{typeIcons[item.type]}</span>
                            <div className="flex-1">
                              <div className="flex items-start justify-between gap-2">
                                <p
                                  className="font-semibold text-sm"
                                  style={{ color: '#1C1917', textDecoration: item.status === 'done' ? 'line-through' : 'none' }}
                                >
                                  {item.title}
                                </p>
                                <span
                                  className={`text-[10px] px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${wishStatusColors[item.status as keyof typeof wishStatusColors]}`}
                                >
                                  {wishStatusLabels[item.status as keyof typeof wishStatusLabels]}
                                </span>
                              </div>
                              {item.description && (
                                <p className="text-xs mt-0.5" style={{ color: '#78716C' }}>
                                  {item.description}
                                </p>
                              )}
                              <div className="flex flex-wrap items-center gap-2 mt-1.5">
                                <span className="text-xs" style={{ color: '#A8A29E' }}>
                                  {typeLabels[item.type]}
                                </span>
                                <span className={`text-xs font-medium ${priorityColors[item.priority]}`}>
                                  {priorityLabels[item.priority]}
                                </span>
                                {item.location && (
                                  <span className="flex items-center gap-0.5 text-xs" style={{ color: '#78716C' }}>
                                    <MapPin size={10} />{item.location}
                                  </span>
                                )}
                                {item.link && (
                                  <a
                                    href={item.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-0.5 text-xs text-blue-500"
                                  >
                                    <Link2 size={10} />رابط
                                  </a>
                                )}
                              </div>
                              {creator && (
                                <div className="flex items-center gap-1.5 mt-2">
                                  <MemberAvatar name={creator.name} size="sm" />
                                  <span className="text-xs" style={{ color: '#A8A29E' }}>
                                    {creator.name}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppShell>
  );
}
