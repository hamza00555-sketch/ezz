'use client';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <div
      style={{
        position: 'sticky', top: 0, zIndex: 20,
        padding: 'calc(16px + env(safe-area-inset-top, 0px)) 16px 14px',
        background: 'var(--bg-app)',
        borderBottom: '1px solid var(--border-soft)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: 19, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2 }}>
            {title}
          </h1>
          {subtitle && (
            <p style={{ fontSize: 13, marginTop: 2, color: 'var(--text-secondary)' }}>
              {subtitle}
            </p>
          )}
        </div>
        {action}
      </div>
    </div>
  );
}
