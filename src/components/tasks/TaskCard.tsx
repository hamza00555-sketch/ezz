'use client';

import { useState } from 'react';
import { Clock, RotateCcw } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { MemberAvatar } from '@/components/shared/MemberAvatar';
import { formatArabicDate, isOverdue, taskStatusLabels, priorityLabels, categoryLabels, cn } from '@/lib/utils';
import type { Task } from '@/types';

const priorityConfig: Record<string, { bar: string; badge: string; badgeText: string }> = {
  urgent: { bar: 'var(--danger)',            badge: 'var(--danger-soft)',           badgeText: 'var(--danger)'   },
  high:   { bar: 'var(--warning)',           badge: 'var(--warning-soft)',          badgeText: 'var(--warning)'  },
  medium: { bar: 'rgba(67,82,56,0.18)',   badge: 'rgba(67,82,56,0.07)',       badgeText: 'var(--text-secondary)' },
  low:    { bar: 'rgba(67,82,56,0.10)',   badge: 'rgba(67,82,56,0.05)',       badgeText: 'var(--text-muted)'     },
};

const statusConfig: Record<string, { badge: string; text: string }> = {
  new:                { badge: 'rgba(67,82,56,0.07)',   text: 'var(--text-muted)'     },
  pending_acceptance: { badge: 'var(--warning-soft)',      text: 'var(--warning)'        },
  accepted:           { badge: 'var(--info-soft)',         text: 'var(--info)'           },
  in_progress:        { badge: 'var(--warning-soft)',      text: 'var(--warning)'        },
  done:               { badge: 'var(--success-soft)',      text: 'var(--success)'        },
  rejected:           { badge: 'var(--danger-soft)',       text: 'var(--danger)'         },
  postponed:          { badge: 'rgba(167,130,255,0.12)',   text: '#A782FF'               },
  cancelled:          { badge: 'rgba(67,82,56,0.05)',   text: 'var(--text-muted)'     },
};

interface TaskCardProps {
  task: Task;
  showAssignee?: boolean;
}

export function TaskCard({ task, showAssignee = true }: TaskCardProps) {
  const { members, updateTaskStatus } = useAppStore();
  const assignee = members.find((m) => m.id === task.assignedTo);
  const creator  = members.find((m) => m.id === task.createdBy);
  const overdue  = isOverdue(task.dueDate);
  const isDone   = task.status === 'done';
  const [bouncing, setBouncing] = useState(false);

  const pCfg = priorityConfig[task.priority] ?? priorityConfig.medium;
  const sCfg = statusConfig[task.status] ?? statusConfig.new;

  function handleToggle() {
    if (bouncing) return;
    setBouncing(true);
    updateTaskStatus(task.id, isDone ? 'accepted' : 'done');
    setTimeout(() => setBouncing(false), 400);
  }

  return (
    <div
      style={{
        display: 'flex',
        background: 'var(--surface-card)',
        border: `1px solid ${overdue && !isDone ? 'rgba(249,112,102,0.30)' : 'var(--border-soft)'}`,
        borderRadius: 20,
        overflow: 'hidden',
        opacity: isDone ? 0.6 : 1,
        transition: 'opacity 0.2s ease',
      }}
    >
      {/* Priority bar */}
      <div style={{ width: 4, flexShrink: 0, background: isDone ? 'var(--success)' : pCfg.bar }} />

      {/* Content */}
      <div style={{ flex: 1, padding: '14px 14px 14px 12px', minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          {/* Checkbox */}
          <button
            onClick={handleToggle}
            className={cn(bouncing && 'check-bounce')}
            style={{
              marginTop: 2,
              width: 22, height: 22,
              borderRadius: '50%',
              border: `2px solid ${isDone ? 'var(--success)' : overdue ? 'var(--danger)' : 'rgba(67,82,56,0.22)'}`,
              background: isDone ? 'var(--success)' : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            {isDone && (
              <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>

          {/* Title + meta */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <p
              style={{
                fontSize: 14, fontWeight: 600, lineHeight: 1.4,
                color: isDone ? 'var(--text-muted)' : 'var(--text-primary)',
                textDecoration: isDone ? 'line-through' : 'none',
              }}
            >
              {task.title}
            </p>

            {task.description && (
              <p style={{ fontSize: 12, marginTop: 2, color: 'var(--text-muted)', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical' as const }}>
                {task.description}
              </p>
            )}

            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
              {/* Priority badge */}
              {!isDone && (
                <span
                  style={{
                    fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 10,
                    background: pCfg.badge, color: pCfg.badgeText,
                  }}
                >
                  {priorityLabels[task.priority]}
                </span>
              )}

              {/* Status badge */}
              <span
                style={{
                  fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 10,
                  background: sCfg.badge, color: sCfg.text,
                }}
              >
                {taskStatusLabels[task.status]}
              </span>

              {/* Due date */}
              {task.dueDate && (
                <span
                  style={{
                    display: 'flex', alignItems: 'center', gap: 4,
                    fontSize: 11,
                    color: overdue && !isDone ? 'var(--danger)' : 'var(--text-muted)',
                  }}
                >
                  <Clock size={10} />
                  {overdue && !isDone ? 'متأخرة · ' : ''}{formatArabicDate(task.dueDate)}
                </span>
              )}

              {/* Category */}
              {task.category && (
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                  {categoryLabels[task.category] || task.category}
                </span>
              )}

              {/* Recurring */}
              {task.isRecurring && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--text-muted)' }}>
                  <RotateCcw size={9} /> متكررة
                </span>
              )}
            </div>

            {/* CTA row */}
            {!isDone && (
              <div style={{ display: 'flex', gap: 8, marginTop: 10, justifyContent: 'flex-end' }}>
                {task.status !== 'postponed' && (
                  <button
                    onClick={(e) => { e.stopPropagation(); updateTaskStatus(task.id, 'postponed'); }}
                    style={{
                      fontSize: 11, fontWeight: 600, padding: '5px 12px', borderRadius: 12,
                      background: 'rgba(167,130,255,0.08)',
                      border: '1px solid rgba(167,130,255,0.20)',
                      color: '#A782FF', cursor: 'pointer', fontFamily: 'inherit',
                    }}
                  >
                    تأجيل
                  </button>
                )}
                <button
                  onClick={(e) => { e.stopPropagation(); handleToggle(); }}
                  style={{
                    fontSize: 11, fontWeight: 700, padding: '5px 14px', borderRadius: 12,
                    background: 'rgba(163,177,138,0.14)',
                    border: '1px solid rgba(163,177,138,0.30)',
                    color: 'var(--accent-strong)', cursor: 'pointer', fontFamily: 'inherit',
                  }}
                >
                  تم ✓
                </button>
              </div>
            )}
          </div>

          {/* Assignee */}
          {showAssignee && assignee && <MemberAvatar name={assignee.name} size="sm" />}
        </div>

        {/* Creator */}
        {creator && creator.id !== task.assignedTo && (
          <p style={{ fontSize: 11, marginTop: 8, paddingInlineEnd: 8, color: 'var(--text-muted)' }}>
            أنشأها {creator.name}
          </p>
        )}
      </div>
    </div>
  );
}
