'use client';

type Priority = 'urgent' | 'high' | 'medium' | 'low';

interface PriorityChipProps {
  priority: Priority;
  size?: 'sm' | 'md';
}

const priorityConfig: Record<Priority, { label: string; bg: string; text: string }> = {
  urgent: { label: 'عاجل',   bg: 'bg-[#C97A66]/20', text: 'text-[#8B3A22]' },
  high:   { label: 'عالية',  bg: 'bg-[#F6C9B2]/40', text: 'text-[#9A4F35]' },
  medium: { label: 'متوسطة', bg: 'bg-[#E8DDD3]',    text: 'text-[#667085]' },
  low:    { label: 'منخفضة', bg: 'bg-[#E8DDD3]/60',  text: 'text-[#8A94A0]' },
};

export function PriorityChip({ priority, size = 'sm' }: PriorityChipProps) {
  const config = priorityConfig[priority];

  return (
    <span
      className={[
        'inline-flex items-center font-medium rounded-full',
        config.bg, config.text,
        size === 'sm' ? 'text-xs px-2.5 py-1' : 'text-sm px-3 py-1.5',
      ].join(' ')}
      style={{ fontFamily: '"Cairo", "IBM Plex Sans Arabic", sans-serif' }}
    >
      {config.label}
    </span>
  );
}
