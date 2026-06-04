'use client';

import { cn } from '@/lib/utils';

const avatarColors = [
  { bg: '#FEF3C7', text: '#92400E' },
  { bg: '#DBEAFE', text: '#1E40AF' },
  { bg: '#D1FAE5', text: '#065F46' },
  { bg: '#FCE7F3', text: '#9D174D' },
  { bg: '#EDE9FE', text: '#5B21B6' },
  { bg: '#FEE2E2', text: '#991B1B' },
];

function getColor(name: string) {
  const idx = name.charCodeAt(0) % avatarColors.length;
  return avatarColors[idx];
}

interface MemberAvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function MemberAvatar({ name, size = 'md', className }: MemberAvatarProps) {
  const color = getColor(name);
  const sizeClasses = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-12 h-12 text-base',
  };
  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center font-bold flex-shrink-0',
        sizeClasses[size],
        className
      )}
      style={{ background: color.bg, color: color.text }}
    >
      {name.charAt(0)}
    </div>
  );
}
