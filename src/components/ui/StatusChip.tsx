'use client';

type Status = 'pending' | 'in_progress' | 'done' | 'late' | 'cancelled';

interface StatusChipProps {
  status: Status;
  label?: string;
  size?: 'sm' | 'md';
}

const statusConfig: Record<Status, { label: string; bg: string; text: string; dot: string }> = {
  pending:     { label: 'قيد الانتظار', bg: 'bg-[#F6C9B2]/30', text: 'text-[#9A4F35]',   dot: 'bg-[#C97A66]' },
  in_progress: { label: 'جاري التنفيذ', bg: 'bg-[#0F1B33]/08', text: 'text-[#0F1B33]',   dot: 'bg-[#0F1B33]' },
  done:        { label: 'مكتمل',        bg: 'bg-[#72BFA3]/15', text: 'text-[#2D7A5F]',   dot: 'bg-[#72BFA3]' },
  late:        { label: 'متأخر',        bg: 'bg-[#C97A66]/15', text: 'text-[#8B3A22]',   dot: 'bg-[#C97A66]' },
  cancelled:   { label: 'ملغي',         bg: 'bg-[#E8DDD3]/60', text: 'text-[#667085]',   dot: 'bg-[#B8C0CC]' },
};

export function StatusChip({ status, label, size = 'sm' }: StatusChipProps) {
  const config = statusConfig[status];
  const displayLabel = label ?? config.label;

  return (
    <span
      className={[
        'inline-flex items-center gap-1.5 font-medium rounded-full',
        config.bg, config.text,
        size === 'sm' ? 'text-xs px-2.5 py-1' : 'text-sm px-3 py-1.5',
      ].join(' ')}
      style={{ fontFamily: '"Cairo", "IBM Plex Sans Arabic", sans-serif' }}
    >
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${config.dot}`} />
      {displayLabel}
    </span>
  );
}
