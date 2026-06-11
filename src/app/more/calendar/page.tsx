'use client';

import Link from 'next/link';
import { ChevronRight, CheckSquare, Wrench, ShieldAlert, FileWarning } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/shared/PageHeader';
import { EmptyState } from '@/components/shared/EmptyState';
import { useAppStore } from '@/store/appStore';
import { useShallow } from 'zustand/react/shallow';
import { formatArabicDate, isOverdue } from '@/lib/utils';

interface CalEntry {
  id: string;
  date: string;
  title: string;
  subtitle?: string;
  type: 'task' | 'maintenance' | 'warranty' | 'document';
  isUrgent?: boolean;
}

const typeConfig = {
  task:        { icon: CheckSquare, color: 'var(--accent-strong)', bg: 'rgba(201,122,102,0.10)', label: 'مهمة'  },
  maintenance: { icon: Wrench,      color: 'var(--bronze)',        bg: 'rgba(201,122,102,0.10)', label: 'صيانة' },
  warranty:    { icon: ShieldAlert, color: 'var(--info)',          bg: 'var(--info-soft)',        label: 'ضمان'  },
  document:    { icon: FileWarning, color: 'var(--danger)',        bg: 'var(--danger-soft)',      label: 'وثيقة' },
};

export default function CalendarPage() {
  const { tasks, maintenance, homeItems, documents, currentFamilyGroupId } = useAppStore(
    useShallow((s) => ({ tasks: s.tasks, maintenance: s.maintenance, homeItems: s.homeItems, documents: s.documents, currentFamilyGroupId: s.currentFamilyGroupId }))
  );

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
        subtitle: item?.name ?? 'صيانة',
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

  const todayStr    = new Date().toISOString().split('T')[0];
  const sevenDays   = new Date(Date.now() + 604800000);
  const now         = new Date();

  const overdue:  CalEntry[] = [];
  const today:    CalEntry[] = [];
  const week:     CalEntry[] = [];
  const later:    CalEntry[] = [];

  entries.forEach((e) => {
    const d = new Date(e.date);
    const dStr = e.date.slice(0, 10);
    if (d < now && dStr < todayStr) {
      overdue.push(e);
    } else if (dStr === todayStr) {
      today.push(e);
    } else if (d <= sevenDays) {
      week.push(e);
    } else {
      later.push(e);
    }
  });

  const renderGroup = (
    label: string,
    group: CalEntry[],
    labelColor: string,
    isOverdueGroup = false,
  ) => {
    if (group.length === 0) return null;
    return (
      <div style={{ marginBottom: 28 }}>
        {/* Section label */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          {isOverdueGroup && (
            <span
              style={{
                width: 7, height: 7, borderRadius: '50%',
                background: 'rgba(249,112,102,0.75)',
                flexShrink: 0,
              }}
            />
          )}
          <p
            style={{
              fontSize: 11, fontWeight: 700, letterSpacing: '0.08em',
              color: labelColor, textTransform: 'uppercase',
            }}
          >
            {label}
          </p>
          <span
            style={{
              fontSize: 11, padding: '1px 7px', borderRadius: 10,
              background: 'rgba(15,27,51,0.06)',
              color: 'var(--text-muted)', fontWeight: 600,
            }}
          >
            {group.length}
          </span>
        </div>

        {/* Entry cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {group.map((e) => {
            const cfg = typeConfig[e.type];
            const Icon = cfg.icon;
            const showUrgentBorder = isOverdueGroup || e.isUrgent;
            return (
              <div
                key={`${e.type}-${e.id}`}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '13px 14px', borderRadius: 18,
                  background: isOverdueGroup
                    ? 'rgba(249,112,102,0.04)'
                    : 'var(--surface-card)',
                  border: `1px solid ${showUrgentBorder ? 'rgba(249,112,102,0.18)' : 'var(--border-soft)'}`,
                }}
              >
                {/* Icon bubble */}
                <div
                  style={{
                    width: 40, height: 40, borderRadius: 14, flexShrink: 0,
                    background: cfg.bg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <Icon size={17} color={cfg.color} strokeWidth={1.7} />
                </div>

                {/* Text */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      fontSize: 13, fontWeight: 600,
                      color: 'var(--text-primary)',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}
                  >
                    {e.title}
                  </p>
                  {e.subtitle && (
                    <p style={{ fontSize: 11, marginTop: 2, color: 'var(--text-muted)' }}>
                      {e.subtitle}
                    </p>
                  )}
                </div>

                {/* Right side: badges + date */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
                  <span
                    style={{
                      fontSize: 10, fontWeight: 600,
                      padding: '2px 8px', borderRadius: 10,
                      background: cfg.bg,
                      color: cfg.color,
                    }}
                  >
                    {cfg.label}
                  </span>
                  {(isOverdueGroup || e.isUrgent) && (
                    <span
                      style={{
                        fontSize: 9, fontWeight: 700,
                        padding: '1px 7px', borderRadius: 8,
                        background: 'rgba(249,112,102,0.10)',
                        color: 'rgba(249,112,102,0.82)',
                      }}
                    >
                      {isOverdueGroup ? 'متأخر' : 'عاجل'}
                    </span>
                  )}
                  <span
                    style={{
                      fontSize: 11, fontWeight: 500,
                      color: (isOverdueGroup || e.isUrgent) ? 'rgba(249,112,102,0.78)' : 'var(--text-muted)',
                    }}
                  >
                    {formatArabicDate(e.date)}
                  </span>
                </div>
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
        subtitle="المواعيد والتنبيهات القادمة"
        action={
          <Link href="/more" style={{ padding: 8, display: 'block' }}>
            <ChevronRight size={20} color="var(--text-muted)" />
          </Link>
        }
      />

      <div style={{ padding: '16px' }}>
        {entries.length === 0 ? (
          <EmptyState brandIcon="calendar" title="لا توجد أحداث" description="المواعيد والصيانة والضمانات ستظهر هنا." />
        ) : (
          <>
            {renderGroup('متأخر', overdue, 'var(--danger)', true)}
            {renderGroup('اليوم', today, 'var(--accent-strong)')}
            {renderGroup('هذا الأسبوع', week, 'var(--warning)')}
            {renderGroup('قادم', later, 'var(--text-muted)')}
          </>
        )}
      </div>
    </AppShell>
  );
}
