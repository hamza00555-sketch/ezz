'use client';

interface EzzAppIconProps {
  size?: number;
  className?: string;
}

export function EzzAppIcon({ size = 48, className = '' }: EzzAppIconProps) {
  return (
    <img
      src="/brand/app-icon/ezz-app-icon.svg"
      alt="عز"
      width={size}
      height={size}
      className={`rounded-2xl flex-shrink-0 ${className}`}
      draggable={false}
    />
  );
}
