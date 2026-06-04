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

  // Tasks with due dates
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

  // Maintenance reminders
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

  // Warranty expiry
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

  // Document expiry
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
    task: { icon: CheckSquare, color: '#2563EB', bg: '#EFF6FF', label: 'مهمة' },
    maintenance: { icon: Wrench, color: '#C8922A', bg: '#FFF7ED', label: 'صيانة' },
    warranty: { icon: ShieldAlert, color: '#7C3AED', bg: '#F5F3FF', label: 'ضمان' },
    document: { icon: FileWarning, color: '#DC2626', bg: '#FEF2F2', label: 'وثيقة' },
  };

  // Group by relative period
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
      <div key={label} className="mb-5">
        <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: labelColor }}>
          {label} ({group.length})
        </p>
        <div className="flex flex-col gap-2">
          {group.map((e) => {
            const cfg = typeConfig[e.type];
            const Icon = cfg.icon;
            return (
              <div
                key={`${e.type}-${e.id}`}
                className="flex items-center gap-3 p-3.5 rounded-2xl"
                style={{
                  background: '#FFFFFF',
                  border: `1px solid ${e.isUrgent ? '#FECACA' : 'var(--border)'}`,
                }}
              >
                <div className="p-2.5 rounded-xl flex-shrink-0" style={{ background: cfg.bg }}>
                  <Icon size={16} color={cfg.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: '#1C1917' }}>
                    {e.title}
                  </p>
                  {e.subtitle && (
                    <p className="text-xs" style={{ color: '#78716C' }}>
                      {e.subtitle}
                    </p>
                  )}
                </div>
                <span
                  className="text-xs font-medium flex-shrink-0"
                  style={{ color: e.isUrgent ? '#DC2626' : '#78716C' }}
                >
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
          <Link href="/more" className="p-2">
            <ChevronRight size={20} color="#78716C" />
          </Link>
        }
      />

      <div className="p-4">
        {entries.length === 0 ? (
          <EmptyState icon="📅" title="لا توجد أحداث" description="المهام والصيانة والضمانات ستظهر هنا" />
        ) : (
          <>
            {renderGroup('متأخر', overdue, '#DC2626')}
            {renderGroup('هذا الأسبوع', upcoming, '#D97706')}
            {renderGroup('قادم', later, '#78716C')}
          </>
        )}
      </div>
    </AppShell>
  );
}
