'use client';

import type { LucideIcon } from 'lucide-react';

type IconBadgeTone =
  | 'olive' | 'bronze' | 'kitchen' | 'sage'
  | 'warning' | 'danger' | 'info' | 'success' | 'purple';

type IconBadgeSize = 'small' | 'medium' | 'large';

interface IconBadgeProps {
  icon: LucideIcon;
  tone?: IconBadgeTone;
  size?: IconBadgeSize;
  className?: string;
}

const sizeMap: Record<IconBadgeSize, { cls: string; iconSize: number; strokeWidth: number }> = {
  small:  { cls: 'icon-badge--small',  iconSize: 15, strokeWidth: 1.8 },
  medium: { cls: 'icon-badge--medium', iconSize: 20, strokeWidth: 1.7 },
  large:  { cls: 'icon-badge--large',  iconSize: 26, strokeWidth: 1.6 },
};

export function IconBadge({ icon: Icon, tone = 'olive', size = 'medium', className = '' }: IconBadgeProps) {
  const { cls, iconSize, strokeWidth } = sizeMap[size];
  return (
    <span className={`icon-badge ${cls} icon-badge--${tone} ${className}`}>
      <Icon size={iconSize} strokeWidth={strokeWidth} />
    </span>
  );
}
