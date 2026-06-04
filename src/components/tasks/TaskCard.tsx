'use client';

import { Clock, RotateCcw, ChevronLeft } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { TaskStatusBadge } from './TaskStatusBadge';
import { MemberAvatar } from '@/components/shared/MemberAvatar';
import {
  formatArabicDate,
  isOverdue,
  priorityColors,
  priorityLabels,
  categoryLabels,
  cn,
} from '@/lib/utils';
import type { Task } from '@/types';

interface TaskCardProps {
  task: Task;
  showAssignee?: boolean;
}

const priorityDotColors: Record<string, string> = {
  low: '#94A3B8',
  medium: '#3B82F6',
  high: '#F97316',
  urgent: '#EF4444',
};

export function TaskCard({ task, showAssignee = true }: TaskCardProps) {
  const { members, updateTaskStatus } = useAppStore();
  const assignee = members.find((m) => m.id === task.assignedTo);
  const creator = members.find((m) => m.id === task.createdBy);
  const overdue = isOverdue(task.dueDate);
  const isDone = task.status === 'done';

  return (
    <div
      className={cn(
        'p-3.5 rounded-2xl transition-all',
        isDone ? 'opacity-60' : '',
        overdue && !isDone ? 'border-red-200' : ''
      )}
      style={{
        background: '#FFFFFF',
        border: `1px solid ${overdue && !isDone ? '#FECACA' : 'var(--border)'}`,
      }}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <button
          onClick={() =>
            updateTaskStatus(task.id, isDone ? 'accepted' : 'done')
          }
          className={cn(
            'mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all',
            isDone
              ? 'bg-[#16A34A] border-[#16A34A]'
              : 'border-[#D6D3D1] hover:border-[#C8922A]'
          )}
        >
          {isDone && (
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
              <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p
              className={cn('text-sm font-medium leading-snug', isDone && 'line-through')}
              style={{ color: isDone ? '#78716C' : '#1C1917' }}
            >
              {task.title}
            </p>
            {/* Priority dot */}
            <div
              className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5"
              style={{ background: priorityDotColors[task.priority] }}
              title={priorityLabels[task.priority]}
            />
          </div>

          {task.description && (
            <p className="text-xs mt-0.5 line-clamp-1" style={{ color: '#78716C' }}>
              {task.description}
            </p>
          )}

          <div className="flex items-center flex-wrap gap-2 mt-2">
            <TaskStatusBadge status={task.status} />

            {task.dueDate && (
              <span
                className={cn(
                  'flex items-center gap-1 text-xs',
                  overdue && !isDone ? 'text-red-500 font-medium' : ''
                )}
                style={!overdue || isDone ? { color: '#78716C' } : {}}
              >
                <Clock size={11} />
                {overdue && !isDone ? 'متأخرة · ' : ''}
                {formatArabicDate(task.dueDate)}
              </span>
            )}

            {task.category && (
              <span className="text-xs" style={{ color: '#A8A29E' }}>
                {categoryLabels[task.category] || task.category}
              </span>
            )}

            {task.isRecurring && (
              <span className="flex items-center gap-0.5 text-xs" style={{ color: '#78716C' }}>
                <RotateCcw size={10} /> متكررة
              </span>
            )}
          </div>
        </div>

        {/* Assignee */}
        {showAssignee && assignee && (
          <MemberAvatar name={assignee.name} size="sm" />
        )}
      </div>

      {/* Created by */}
      {creator && creator.id !== task.assignedTo && (
        <p className="text-xs mt-2 pe-8" style={{ color: '#A8A29E' }}>
          أنشأها {creator.name}
        </p>
      )}
    </div>
  );
}
