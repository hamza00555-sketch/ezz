'use client';

import { taskStatusLabels } from '@/lib/utils';
import type { TaskStatus } from '@/types';

const statusStyle: Record<TaskStatus, { bg: string; color: string }> = {
  new:                { bg: 'rgba(15,27,51,0.07)',         color: 'var(--text-muted)'     },
  pending_acceptance: { bg: 'var(--warning-soft)',           color: 'var(--warning)'        },
  accepted:           { bg: 'var(--info-soft)',              color: 'var(--info)'           },
  in_progress:        { bg: 'var(--warning-soft)',           color: 'var(--warning)'        },
  done:               { bg: 'var(--success-soft)',           color: 'var(--success)'        },
  rejected:           { bg: 'var(--danger-soft)',            color: 'var(--danger)'         },
  postponed:          { bg: 'rgba(201,122,102,0.10)',        color: 'var(--accent)'         },
  cancelled:          { bg: 'rgba(15,27,51,0.05)',         color: 'var(--text-muted)'     },
};

export function TaskStatusBadge({ status }: { status: TaskStatus }) {
  const s = statusStyle[status] ?? statusStyle.new;
  return (
    <span className="badge" style={{ background: s.bg, color: s.color }}>
      {taskStatusLabels[status]}
    </span>
  );
}
