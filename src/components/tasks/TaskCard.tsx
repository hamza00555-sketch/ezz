'use client';

import { useState } from 'react';
import { Clock, RotateCcw } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { MemberAvatar } from '@/components/shared/MemberAvatar';
import { formatArabicDate, isOverdue, taskStatusLabels, categoryLabels, cn } from '@/lib/utils';
import type { Task } from '@/types';

const priorityConfig: Record<string, { bar: string; badge: string; badgeText: string }> = {
  urgent: { bar: 'var(--c-red)',   badge: 'var(--c-red-soft)',   badgeText: 'var(--c-red)'   },
  high:   { bar: 'var(--c-amber)', badge: 'var(--c-amber-soft)', badgeText: '#92400E'         },
  medium: { bar: '#CBD5E1',        badge: '#F2F4F7',             badgeText: 'var(--c-muted)'  },
  low:    { bar: '#E2E8F0',        badge: '#F8FAFC',             badgeText: '#94A3B8'         },
};

const statusConfig: Record<string, { badge: string; text: string }> = {
  new:               { badge: '#F2F4F7',             text: 'var(--c-muted)'  },
  pending_acceptance:{ badge: 'var(--c-amber-soft)', text: '#92400E'         },
  accepted:          { badge: '#EFF6FF',             text: '#1D4ED8'         },
  in_progress:       { badge: 'var(--c-amber-soft)', text: '#B45309'         },
  done:              { badge: 'var(--c-green-soft)', text: 'var(--c-green)'  },
  rejected:          { badge: 'var(--c-red-soft)',   text: 'var(--c-red)'    },
  postponed:         { badge: '#F5F3FF',             text: '#7C3AED'         },
  cancelled:         { badge: '#F2F4F7',             text: '#94A3B8'         },
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
      className={cn('flex items-stretch transition-all', isDone && 'opacity-60')}
      style={{
        background: 'var(--surface)',
        border: `1px solid ${overdue && !isDone ? 'rgba(217,74,74,0.3)' : 'var(--border)'}`,
        borderRadius: 'var(--card-radius)',
        boxShadow: 'var(--shadow-xs)',
        overflow: 'hidden',
      }}
    >
      {/* Priority bar */}
      <div className="w-1 flex-shrink-0" style={{ background: isDone ? 'var(--c-green)' : pCfg.bar }} />

      {/* Content */}
      <div className="flex-1 p-3.5 min-w-0">
        <div className="flex items-start gap-3">
          {/* Checkbox */}
          <button
            onClick={handleToggle}
            className={cn(
              'mt-0.5 w-[22px] h-[22px] rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all',
              bouncing && 'check-bounce',
              isDone
                ? 'border-[var(--c-green)]'
                : overdue
                ? 'border-[var(--c-red)]'
                : 'border-[var(--border)]'
            )}
            style={isDone ? { background: 'var(--c-green)' } : {}}
          >
            {isDone && (
              <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>

          {/* Title + meta */}
          <div className="flex-1 min-w-0">
            <p
              className={cn('text-[14px] font-medium leading-snug', isDone && 'line-through')}
              style={{ color: isDone ? 'var(--foreground-muted)' : 'var(--foreground)' }}
            >
              {task.title}
            </p>

            {task.description && (
              <p className="text-[12px] mt-0.5 line-clamp-1" style={{ color: 'var(--foreground-muted)' }}>
                {task.description}
              </p>
            )}

            <div className="flex items-center flex-wrap gap-1.5 mt-2">
              {/* Status badge */}
              <span
                className="badge"
                style={{ background: sCfg.badge, color: sCfg.text }}
              >
                {taskStatusLabels[task.status]}
              </span>

              {/* Due date */}
              {task.dueDate && (
                <span
                  className="flex items-center gap-1 text-[11px]"
                  style={{ color: overdue && !isDone ? 'var(--c-red)' : 'var(--foreground-muted)' }}
                >
                  <Clock size={10} />
                  {overdue && !isDone ? 'متأخرة · ' : ''}{formatArabicDate(task.dueDate)}
                </span>
              )}

              {/* Category */}
              {task.category && (
                <span className="text-[11px]" style={{ color: 'var(--foreground-faint)' }}>
                  {categoryLabels[task.category] || task.category}
                </span>
              )}

              {/* Recurring */}
              {task.isRecurring && (
                <span className="flex items-center gap-0.5 text-[11px]" style={{ color: 'var(--foreground-faint)' }}>
                  <RotateCcw size={9} /> متكررة
                </span>
              )}
            </div>
          </div>

          {/* Assignee */}
          {showAssignee && assignee && <MemberAvatar name={assignee.name} size="sm" />}
        </div>

        {/* Creator */}
        {creator && creator.id !== task.assignedTo && (
          <p className="text-[11px] mt-2 pe-2" style={{ color: 'var(--foreground-faint)' }}>
            أنشأها {creator.name}
          </p>
        )}
      </div>
    </div>
  );
}
