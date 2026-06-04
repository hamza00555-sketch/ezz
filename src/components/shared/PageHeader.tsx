'use client';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <div
      className="sticky top-0 z-20 px-4 pt-4 pb-3"
      style={{ background: 'var(--background)', borderBottom: '1px solid var(--border)' }}
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold" style={{ color: '#1C1917' }}>
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm mt-0.5" style={{ color: '#78716C' }}>
              {subtitle}
            </p>
          )}
        </div>
        {action}
      </div>
    </div>
  );
}
