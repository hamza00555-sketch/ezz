'use client';

import { cn } from '@/lib/utils';

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
      className="flex sticky top-0 z-10 px-4 gap-1 overflow-x-auto"
      style={{
        background: 'var(--background)',
        borderBottom: '1px solid var(--border)',
        paddingTop: 10,
        paddingBottom: 10,
        scrollbarWidth: 'none',
      }}
    >
      {tabs.map((tab) => {
        const isActive = active === tab.key;
        return (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className={cn(
              'flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0',
            )}
            style={
              isActive
                ? { background: 'var(--c-green)', color: '#fff' }
                : { background: 'transparent', color: 'var(--foreground-muted)' }
            }
          >
            {tab.label}
            {tab.count !== undefined && tab.count > 0 && (
              <span
                className="text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center"
                style={
                  isActive
                    ? { background: 'rgba(255,255,255,0.25)', color: '#fff' }
                    : { background: 'var(--border)', color: 'var(--foreground-muted)' }
                }
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
