'use client';

import Link from 'next/link';
import { ArrowLeft, Clock, AlertCircle } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { useShallow } from 'zustand/react/shallow';
import { MemberAvatar } from '@/components/shared/MemberAvatar';
import { formatArabicDate, isOverdue, categoryLabels } from '@/lib/utils';

const priorityDot: Record<string, string> = {
  urgent: 'var(--danger)',
  high:   'var(--warning)',
  medium: 'rgba(255,255,255,0.25)',
  low:    'rgba(255,255,255,0.12)',
};

export function UrgentTasks() {
  const { tasks, members, currentFamilyGroupId } = useAppStore(
    useShallow((s) => ({ tasks: s.tasks, members: s.members, currentFamilyGroupId: s.currentFamilyGroupId }))
  );

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
    <div style={{ padding: `0 var(--page-px)`, marginBottom: 24 }}>
      {/* Section header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <AlertCircle size={15} color="var(--danger)" strokeWidth={2} />
          <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>الأهم الآن</span>
        </div>
        <Link
          href="/tasks"
          style={{
            display: 'flex', alignItems: 'center', gap: 3,
            fontSize: 12, fontWeight: 500, color: 'var(--accent)',
            textDecoration: 'none',
          }}
        >
          الكل <ArrowLeft size={12} />
        </Link>
      </div>

      {/* Cards container */}
      <div
        style={{
          background: 'var(--surface-card)',
          border: '1px solid var(--border-soft)',
          borderRadius: 24,
          overflow: 'hidden',
        }}
      >
        {urgent.map((task, i) => {
          const assignee = members.find((m) => m.id === task.assignedTo);
          const overdue  = isOverdue(task.dueDate);
          const dotColor = overdue ? 'var(--danger)' : priorityDot[task.priority];

          return (
            <Link
              key={task.id}
              href="/tasks"
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '14px 16px',
                borderBottom: i < urgent.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                textDecoration: 'none',
                transition: 'background 0.12s ease',
              }}
              className="active:opacity-70"
            >
              {/* Priority dot */}
              <div
                style={{
                  width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                  background: dotColor,
                  boxShadow: overdue || task.priority === 'urgent'
                    ? `0 0 6px ${dotColor}`
                    : 'none',
                }}
                className={overdue || task.priority === 'urgent' ? 'urgent-pulse' : ''}
              />

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    fontSize: 14, fontWeight: 500, color: 'var(--text-primary)',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    marginBottom: 3,
                  }}
                >
                  {task.title}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {task.dueDate && (
                    <span
                      style={{
                        display: 'flex', alignItems: 'center', gap: 3,
                        fontSize: 11,
                        color: overdue ? 'var(--danger)' : 'var(--text-muted)',
                      }}
                    >
                      <Clock size={9} />
                      {overdue ? 'متأخرة · ' : ''}{formatArabicDate(task.dueDate)}
                    </span>
                  )}
                  {task.category && (
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                      {categoryLabels[task.category] || task.category}
                    </span>
                  )}
                </div>
              </div>

              {assignee && <MemberAvatar name={assignee.name} size="sm" />}
              <ArrowLeft size={14} color="var(--text-muted)" style={{ flexShrink: 0 }} />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
