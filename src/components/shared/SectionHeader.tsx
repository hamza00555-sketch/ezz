'use client';

interface SectionHeaderProps {
  title: string;
  action?: React.ReactNode;
}

export function SectionHeader({ title, action }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-base font-bold" style={{ color: '#1C1917' }}>
        {title}
      </h2>
      {action}
    </div>
  );
}
