'use client';

import { ReactNode } from 'react';

type IllustrationName =
  | 'empty-no-tasks'
  | 'empty-no-requests'
  | 'empty-no-reminders'
  | 'empty-no-bills'
  | 'empty-no-family-members'
  | 'connection-error'
  | 'organize-your-day'
  | 'success-task-completed'
  | 'invite-family-member';

interface EmptyStateProps {
  illustration?: IllustrationName;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ illustration, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center gap-4">
      {illustration && (
        <img
          src={`/brand/illustrations/${illustration}.png`}
          alt=""
          aria-hidden="true"
          className="w-40 h-40 object-contain select-none"
          draggable={false}
        />
      )}
      <div className="flex flex-col gap-1.5">
        <p
          className="font-bold text-lg text-[var(--color-text)]"
          style={{ fontFamily: '"Cairo", "IBM Plex Sans Arabic", sans-serif' }}
        >
          {title}
        </p>
        {description && (
          <p
            className="text-sm text-[var(--color-text-muted)] leading-relaxed"
            style={{ fontFamily: '"Cairo", "IBM Plex Sans Arabic", sans-serif' }}
          >
            {description}
          </p>
        )}
      </div>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
