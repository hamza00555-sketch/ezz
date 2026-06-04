'use client';

import Link from 'next/link';
import { ArrowLeft, Clock } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { MemberAvatar } from '@/components/shared/MemberAvatar';
import { formatArabicDate, isOverdue, categoryLabels } from '@/lib/utils';

const priorityConfig: Record<string, { label: string; badgeClass: string }> = {
  urgent: { label: 'عاجلة',   badgeClass: 'badge-red'   },
  high:   { label: 'مهمة',    badgeClass: 'badge-amber' },
  medium: { label: 'متوسطة',  badgeClass: 'badge-muted' },
  low:    { label: 'منخفضة',  badgeClass: 'badge-muted' },
};

export function UrgentTasks() {
  const { tasks, members, currentFamilyGroupId } = useAppStore();

  const urgent = tasks
    .filter(
      (t) =>
        t.familyGroupId === currentFamilyGroupId &&
        !['done', 'cancelled'].includes(t.status) &&
        (t.priority === 'urgent' || t.priority === 'high' || isOverdue(t.dueDate))
    )
    .sort((a, b) => {
      const o: Record<string, number> = { urgent: 0, high: 1, medium: 2, low: 3 };
      return (o[a.priority] ?? 4) - (o[b.priority] ?? 4);
    })
    .slice(0, 4);

  if (urgent.length === 0) return null;

  return (
    <div className="px-4 mb-5">
      {/* Section header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-[15px] font-bold" style={{ color: 'var(--foreground)' }}>
          مهام عاجلة
        </h2>
        <Link href="/tasks" className="flex items-center gap-0.5 text-xs font-medium" style={{ color: 'var(--c-green)' }}>
          الكل <ArrowLeft size={12} className="mt-px" />
        </Link>
      </div>

      <div className="flex flex-col gap-2">
        {urgent.map((task) => {
          const assignee = members.find((m) => m.id === task.assignedTo);
          const overdue = isOverdue(task.dueDate);
          const cfg = priorityConfig[task.priority] ?? priorityConfig.medium;

          return (
            <Link
              key={task.id}
              href="/tasks"
              className="flex items-center gap-3 p-3.5 active:scale-[0.98] transition-transform"
              style={{
                background: 'var(--surface)',
                border: `1px solid ${overdue ? 'rgba(217,74,74,0.25)' : 'var(--border)'}`,
                borderRadius: 'var(--card-radius)',
                boxShadow: 'var(--shadow-xs)',
              }}
            >
              {/* Priority indicator */}
              <div
                className="w-1 self-stretch rounded-full flex-shrink-0"
                style={{
                  background: overdue ? 'var(--c-red)'
                    : task.priority === 'urgent' ? 'var(--c-red)'
                    : task.priority === 'high'   ? 'var(--c-amber)'
                    : 'var(--border)',
                  minHeight: 32,
                }}
              />

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate mb-1" style={{ color: 'var(--foreground)' }}>
                  {task.title}
                </p>
                <div className="flex items-center gap-2">
                  <span className={`badge ${cfg.badgeClass}`}>{cfg.label}</span>
                  {task.dueDate && (
                    <span
                      className="flex items-center gap-1 text-[11px]"
                      style={{ color: overdue ? 'var(--c-red)' : 'var(--foreground-muted)' }}
                    >
                      <Clock size={10} />
                      {overdue ? 'متأخرة · ' : ''}{formatArabicDate(task.dueDate)}
                    </span>
                  )}
                  {task.category && !task.dueDate && (
                    <span className="text-[11px]" style={{ color: 'var(--foreground-faint)' }}>
                      {categoryLabels[task.category] || task.category}
                    </span>
                  )}
                </div>
              </div>

              {assignee && <MemberAvatar name={assignee.name} size="sm" />}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
