'use client';

interface EzzLogoProps {
  variant?: 'light' | 'dark' | 'auto';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizes = {
  sm: { w: 56,  h: 22 },
  md: { w: 80,  h: 32 },
  lg: { w: 110, h: 44 },
};

export function EzzLogo({ variant = 'auto', size = 'md', className = '' }: EzzLogoProps) {
  const s = sizes[size];

  if (variant === 'auto') {
    return (
      <span className={`inline-flex items-center ${className}`} aria-label="عز">
        <img src="/brand/logo/ezz-logo-light.svg" alt="عز" width={s.w} height={s.h} className="block dark:hidden" draggable={false} />
        <img src="/brand/logo/ezz-logo-dark.svg"  alt="عز" width={s.w} height={s.h} className="hidden dark:block"  draggable={false} />
      </span>
    );
  }

  const src = variant === 'dark' ? '/brand/logo/ezz-logo-dark.svg' : '/brand/logo/ezz-logo-light.svg';
  return (
    <span className={`inline-flex items-center ${className}`} aria-label="عز">
      <img src={src} alt="عز" width={s.w} height={s.h} draggable={false} />
    </span>
  );
}
