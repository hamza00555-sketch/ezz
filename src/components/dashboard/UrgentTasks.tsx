'use client';

import Link from 'next/link';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { MemberAvatar } from '@/components/shared/MemberAvatar';
import { formatArabicDate, isOverdue, priorityColors, categoryLabels } from '@/lib/utils';

export function UrgentTasks() {
  const { tasks, members, currentFamilyGroupId } = useAppStore();

  const urgent = tasks
    .filter(
      (t) =>
        t.familyGroupId === currentFamilyGroupId &&
        !['done', 'cancelled'].includes(t.status) &&
        (t.priority === 'urgent' || t.priority === 'high' || isOverdue(t.dueDate))
    )
    .slice(0, 4);

  if (urgent.length === 0) return null;

  return (
    <div className="px-4 mb-5">
      <SectionHeader
        title="مهام عاجلة"
        action={
          <Link href="/tasks" className="text-xs font-medium" style={{ color: '#C8922A' }}>
            الكل <ArrowLeft size={12} className="inline" />
          </Link>
        }
      />
      <div className="flex flex-col gap-2">
        {urgent.map((task) => {
          const assignee = members.find((m) => m.id === task.assignedTo);
          const overdue = isOverdue(task.dueDate);
          return (
            <Link
              key={task.id}
              href="/tasks"
              className="flex items-center gap-3 p-3 rounded-2xl active:scale-[0.98] transition-transform"
              style={{ background: '#FFFFFF', border: `1px solid ${overdue ? '#FECACA' : 'var(--border)'}` }}
            >
              {overdue && <AlertCircle size={16} color="#DC2626" className="flex-shrink-0" />}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: '#1C1917' }}>
                  {task.title}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  {task.dueDate && (
                    <span className={`text-xs ${overdue ? 'text-red-500 font-medium' : ''}`} style={!overdue ? { color: '#78716C' } : {}}>
                      {overdue ? 'متأخرة — ' : ''}{formatArabicDate(task.dueDate)}
                    </span>
                  )}
                  {task.category && (
                    <span className="text-xs" style={{ color: '#78716C' }}>
                      · {categoryLabels[task.category] || task.category}
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
