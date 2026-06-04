'use client';

interface Tab {
  key: string;
  label: string;
  count?: number;
}

interface TabsProps {
  tabs: Tab[];
  active: string;
  onChange: (key: string) => void;
}

export function Tabs({ tabs, active, onChange }: TabsProps) {
  return (
    <div
      style={{
        position: 'sticky', top: 0, zIndex: 10,
        padding: '12px 16px',
        background: 'var(--bg-app)',
        borderBottom: '1px solid var(--border-soft)',
      }}
    >
      <div
        style={{
          display: 'flex', gap: 6,
          overflowX: 'auto', scrollbarWidth: 'none',
          padding: '2px 0',
        }}
      >
        {tabs.map((tab) => {
          const isActive = active === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => onChange(tab.key)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '7px 16px',
                borderRadius: 20,
                fontSize: 13,
                fontWeight: isActive ? 700 : 400,
                whiteSpace: 'nowrap',
                flexShrink: 0,
                cursor: 'pointer',
                border: 'none',
                transition: 'all 0.2s ease',
                background: isActive ? 'rgba(163,177,138,0.18)' : 'transparent',
                color: isActive ? 'var(--accent-strong)' : 'var(--text-muted)',
              }}
            >
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span
                  style={{
                    fontSize: 10, fontWeight: 700,
                    padding: '1px 6px', borderRadius: 10,
                    background: isActive ? 'rgba(199,231,123,0.25)' : 'rgba(255,255,255,0.07)',
                    color: isActive ? 'var(--accent-strong)' : 'var(--text-muted)',
                    minWidth: 18, textAlign: 'center',
                  }}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
