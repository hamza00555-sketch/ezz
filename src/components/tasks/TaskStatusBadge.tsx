'use client';

import { Badge } from '@/components/shared/Badge';
import { taskStatusLabels, taskStatusColors } from '@/lib/utils';
import type { TaskStatus } from '@/types';

export function TaskStatusBadge({ status }: { status: TaskStatus }) {
  return (
    <Badge className={taskStatusColors[status]}>
      {taskStatusLabels[status]}
    </Badge>
  );
}
