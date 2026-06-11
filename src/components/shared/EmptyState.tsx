'use client';

import { BrandIcon, type BrandIconName } from '@/components/brand/BrandIcon';

type IllustrationName =
  | 'empty-no-tasks'
  | 'empty-no-requests'
  | 'empty-no-reminders'
  | 'empty-no-bills'
  | 'empty-no-family-members'
  | 'connection-error'
  | 'organize-your-day'
  | 'success-task-completed'
  | 'invite-family-member'
  | 'bill-reminder';

interface EmptyStateProps {
  /** Full brand illustration (PNG) — preferred for primary empty states. */
  illustration?: IllustrationName;
  /** Brand line icon (SVG) — used when no matching illustration exists. */
  brandIcon?: BrandIconName;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ illustration, brandIcon, title, description, action }: EmptyStateProps) {
  return (
    <div
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', padding: '56px 24px', textAlign: 'center',
      }}
    >
      {illustration ? (
        <img
          src={`/brand/illustrations/${illustration}.png`}
          alt=""
          aria-hidden="true"
          width={148}
          height={148}
          style={{ objectFit: 'contain', marginBottom: 18, userSelect: 'none' }}
          draggable={false}
        />
      ) : (
        <div
          style={{
            width: 72, height: 72, borderRadius: 24,
            background: 'rgba(201,122,102,0.10)',
            border: '1px solid rgba(201,122,102,0.18)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 16,
          }}
        >
          <BrandIcon name={brandIcon ?? 'notes'} size={32} color="var(--accent)" />
        </div>
      )}
      <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>
        {title}
      </h3>
      {description && (
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          {description}
        </p>
      )}
      {action && <div style={{ marginTop: 20 }}>{action}</div>}
    </div>
  );
}
