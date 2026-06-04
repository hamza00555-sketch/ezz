'use client';

import Link from 'next/link';
import { ChevronRight, CheckSquare, Wrench, ShieldAlert, FileWarning } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/shared/PageHeader';
import { EmptyState } from '@/components/shared/EmptyState';
import { useAppStore } from '@/store/appStore';
import { formatArabicDate, isOverdue } from '@/lib/utils';

interface CalEntry {
  id: string;
  date: string;
  title: string;
  subtitle?: string;
  type: 'task' | 'maintenance' | 'warranty' | 'document';
  isUrgent?: boolean;
}

export default function CalendarPage() {
  const { tasks, maintenance, homeItems, documents, currentFamilyGroupId } = useAppStore();

  const entries: CalEntry[] = [];

  tasks
    .filter((t) => t.familyGroupId === currentFamilyGroupId && t.dueDate && !['done', 'cancelled'].includes(t.status))
    .forEach((t) => {
      entries.push({
        id: t.id,
        date: t.dueDate!,
        title: t.title,
        subtitle: 'مهمة',
        type: 'task',
        isUrgent: isOverdue(t.dueDate) || t.priority === 'urgent',
      });
    });

  maintenance
    .filter((m) => m.familyGroupId === currentFamilyGroupId && m.nextReminder)
    .forEach((m) => {
      const item = homeItems.find((i) => i.id === m.linkedItemId);
      entries.push({
        id: m.id,
        date: m.nextReminder!,
        title: m.type,
        subtitle: item?.name || 'صيانة',
        type: 'maintenance',
      });
    });

  homeItems
    .filter((i) => i.familyGroupId === currentFamilyGroupId && i.warrantyExpiry)
    .forEach((i) => {
      const expiry = new Date(i.warrantyExpiry!);
      const threeMonths = new Date(Date.now() + 7776000000);
      if (expiry <= threeMonths) {
        entries.push({
          id: i.id,
          date: i.warrantyExpiry!,
          title: `انتهاء ضمان ${i.name}`,
          type: 'warranty',
          isUrgent: expiry <= new Date(Date.now() + 2592000000),
        });
      }
    });

  documents
    .filter((d) => d.familyGroupId === currentFamilyGroupId && d.expiryDate)
    .forEach((d) => {
      entries.push({
        id: d.id,
        date: d.expiryDate!,
        title: `انتهاء ${d.name}`,
        type: 'document',
        isUrgent: isOverdue(d.expiryDate),
      });
    });

  entries.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const typeConfig = {
    task:        { icon: CheckSquare,  color: 'var(--info)',    bg: 'var(--info-soft)',            label: 'مهمة'  },
    maintenance: { icon: Wrench,       color: 'var(--bronze)',  bg: 'rgba(176,141,87,0.15)',        label: 'صيانة' },
    warranty:    { icon: ShieldAlert,  color: '#A782FF',        bg: 'rgba(167,130,255,0.12)',       label: 'ضمان'  },
    document:    { icon: FileWarning,  color: 'var(--danger)',  bg: 'var(--danger-soft)',           label: 'وثيقة' },
  };

  const upcoming: CalEntry[] = [];
  const later: CalEntry[] = [];
  const overdue: CalEntry[] = [];

  entries.forEach((e) => {
    const d = new Date(e.date);
    const now = new Date();
    const sevenDays = new Date(Date.now() + 604800000);
    if (d < now) overdue.push(e);
    else if (d <= sevenDays) upcoming.push(e);
    else later.push(e);
  });

  const renderGroup = (label: string, group: CalEntry[], labelColor: string) => {
    if (group.length === 0) return null;
    return (
      <div key={label} style={{ marginBottom: 20 }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', marginBottom: 10, color: labelColor }}>
          {label} ({group.length})
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {group.map((e) => {
            const cfg = typeConfig[e.type];
            const Icon = cfg.icon;
            return (
              <div
                key={`${e.type}-${e.id}`}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: 14, borderRadius: 20,
                  background: 'var(--surface-card)',
                  border: `1px solid ${e.isUrgent ? 'rgba(249,112,102,0.30)' : 'var(--border-soft)'}`,
                }}
              >
                <div style={{ padding: 10, borderRadius: 14, flexShrink: 0, background: cfg.bg }}>
                  <Icon size={16} color={cfg.color} strokeWidth={1.8} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {e.title}
                  </p>
                  {e.subtitle && (
                    <p style={{ fontSize: 11, marginTop: 2, color: 'var(--text-muted)' }}>
                      {e.subtitle}
                    </p>
                  )}
                </div>
                <span style={{ fontSize: 11, fontWeight: 500, flexShrink: 0, color: e.isUrgent ? 'var(--danger)' : 'var(--text-muted)' }}>
                  {formatArabicDate(e.date)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <AppShell>
      <PageHeader
        title="التقويم"
        action={
          <Link href="/more" style={{ padding: 8, display: 'block' }}>
            <ChevronRight size={20} color="var(--text-muted)" />
          </Link>
        }
      />

      <div style={{ padding: '16px' }}>
        {entries.length === 0 ? (
          <EmptyState icon="📅" title="لا توجد أحداث" description="المهام والصيانة والضمانات ستظهر هنا" />
        ) : (
          <>
            {renderGroup('متأخر', overdue, 'var(--danger)')}
            {renderGroup('هذا الأسبوع', upcoming, 'var(--warning)')}
            {renderGroup('قادم', later, 'var(--text-muted)')}
          </>
        )}
      </div>
    </AppShell>
  );
}
