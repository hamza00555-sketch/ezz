'use client';

import Link from 'next/link';
import { ChevronRight, Link2, MapPin } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/shared/PageHeader';
import { EmptyState } from '@/components/shared/EmptyState';
import { MemberAvatar } from '@/components/shared/MemberAvatar';
import { useAppStore } from '@/store/appStore';
import { wishStatusLabels, priorityLabels } from '@/lib/utils';

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

const wishStatusStyle: Record<string, { bg: string; color: string }> = {
  idea:      { bg: 'rgba(199,231,123,0.12)', color: 'var(--accent-strong)' },
  studying:  { bg: 'var(--info-soft)',        color: 'var(--info)'          },
  approved:  { bg: 'var(--success-soft)',     color: 'var(--success)'       },
  done:      { bg: 'rgba(255,255,255,0.07)',  color: 'var(--text-muted)'    },
  postponed: { bg: 'rgba(167,130,255,0.12)', color: '#A782FF'               },
  cancelled: { bg: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)'    },
};

const priorityStyle: Record<string, { color: string }> = {
  urgent: { color: 'var(--danger)'   },
  high:   { color: 'var(--warning)'  },
  medium: { color: 'var(--text-muted)' },
  low:    { color: 'var(--text-muted)' },
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
          <Link href="/more" style={{ padding: 8, display: 'block' }}>
            <ChevronRight size={20} color="var(--text-muted)" />
          </Link>
        }
      />

      <div style={{ padding: '16px' }}>
        {items.length === 0 ? (
          <EmptyState
            icon="💡"
            title="لا توجد أفكار بعد"
            description="سجّل أفكارك واحتياجاتك المستقبلية للبيت"
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {statusOrder.map((status) => {
              const group = grouped[status];
              if (!group || group.length === 0) return null;
              const sStyle = wishStatusStyle[status] ?? wishStatusStyle.idea;
              return (
                <div key={status}>
                  <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', marginBottom: 10, color: sStyle.color }}>
                    {wishStatusLabels[status as keyof typeof wishStatusLabels]} ({group.length})
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {group.map((item) => {
                      const creator = members.find((m) => m.id === item.createdBy);
                      const isDone = ['done', 'cancelled'].includes(item.status);
                      const pStyle = priorityStyle[item.priority] ?? priorityStyle.medium;
                      return (
                        <div
                          key={item.id}
                          style={{
                            padding: 14, borderRadius: 20,
                            background: 'var(--surface-card)',
                            border: '1px solid var(--border-soft)',
                            opacity: isDone ? 0.6 : 1,
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                            <span style={{ fontSize: 22, flexShrink: 0, marginTop: 2 }}>
                              {typeIcons[item.type]}
                            </span>
                            <div style={{ flex: 1 }}>
                              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                                <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', textDecoration: item.status === 'done' ? 'line-through' : 'none' }}>
                                  {item.title}
                                </p>
                                <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 10, fontWeight: 600, flexShrink: 0, background: sStyle.bg, color: sStyle.color }}>
                                  {wishStatusLabels[item.status as keyof typeof wishStatusLabels]}
                                </span>
                              </div>
                              {item.description && (
                                <p style={{ fontSize: 12, marginTop: 4, color: 'var(--text-muted)' }}>
                                  {item.description}
                                </p>
                              )}
                              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, marginTop: 8 }}>
                                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                                  {typeLabels[item.type]}
                                </span>
                                <span style={{ fontSize: 11, fontWeight: 600, color: pStyle.color }}>
                                  {priorityLabels[item.priority]}
                                </span>
                                {item.location && (
                                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--text-muted)' }}>
                                    <MapPin size={10} />{item.location}
                                  </span>
                                )}
                                {item.link && (
                                  <a
                                    href={item.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--info)', textDecoration: 'none' }}
                                  >
                                    <Link2 size={10} />رابط
                                  </a>
                                )}
                              </div>
                              {creator && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10 }}>
                                  <MemberAvatar name={creator.name} size="sm" />
                                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
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
