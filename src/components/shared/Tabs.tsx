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
      className="flex gap-0 sticky top-0 z-10"
      style={{ background: 'var(--background)', borderBottom: '1px solid var(--border)' }}
    >
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={cn(
            'flex items-center gap-1.5 px-4 py-3 text-sm font-medium transition-all duration-200 border-b-2',
            active === tab.key
              ? 'text-[#C8922A] border-[#C8922A]'
              : 'text-[#78716C] border-transparent'
          )}
        >
          {tab.label}
          {tab.count !== undefined && tab.count > 0 && (
            <span
              className={cn(
                'text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center',
                active === tab.key
                  ? 'bg-[#F5E6CC] text-[#C8922A]'
                  : 'bg-[#F5F5F4] text-[#78716C]'
              )}
            >
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
