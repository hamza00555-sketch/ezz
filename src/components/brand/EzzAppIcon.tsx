'use client';

interface EzzAppIconProps {
  size?: number;
  className?: string;
}

/**
 * App icon component.
 * NOTE: Replace the placeholder once the approved vector icon is supplied.
 * Expected path: /brand/app-icon/ezz-icon.svg
 */
export function EzzAppIcon({ size = 48, className = '' }: EzzAppIconProps) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-2xl ${className}`}
      style={{
        width: size,
        height: size,
        background: '#0F1B33',
        flexShrink: 0,
      }}
      aria-label="عز"
    >
      <span
        style={{
          fontFamily: '"Cairo", "IBM Plex Sans Arabic", sans-serif',
          fontWeight: 700,
          fontSize: size * 0.45,
          color: '#F6C9B2',
          lineHeight: 1,
        }}
      >
        ع
      </span>
    </span>
  );
}
