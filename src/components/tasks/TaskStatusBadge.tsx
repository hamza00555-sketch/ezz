'use client';

import { taskStatusLabels } from '@/lib/utils';
import type { TaskStatus } from '@/types';

const statusStyle: Record<TaskStatus, { bg: string; color: string }> = {
  new:                { bg: '#F2F4F7',             color: '#667085'         },
  pending_acceptance: { bg: 'var(--c-amber-soft)', color: '#92400E'         },
  accepted:           { bg: '#EFF6FF',             color: '#1D4ED8'         },
  in_progress:        { bg: 'var(--c-amber-soft)', color: '#B45309'         },
  done:               { bg: 'var(--c-green-soft)', color: 'var(--c-green)'  },
  rejected:           { bg: 'var(--c-red-soft)',   color: 'var(--c-red)'    },
  postponed:          { bg: '#F5F3FF',             color: '#7C3AED'         },
  cancelled:          { bg: '#F2F4F7',             color: '#94A3B8'         },
};

export function TaskStatusBadge({ status }: { status: TaskStatus }) {
  const s = statusStyle[status] ?? statusStyle.new;
  return (
    <span className="badge" style={{ background: s.bg, color: s.color }}>
      {taskStatusLabels[status]}
    </span>
  );
}
