'use client';

interface EzzLogoProps {
  variant?: 'light' | 'dark' | 'auto';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showText?: boolean;
}

const sizes = {
  sm: { icon: 28, text: 'text-xl' },
  md: { icon: 36, text: 'text-2xl' },
  lg: { icon: 48, text: 'text-3xl' },
};

/**
 * Renders the عز logo.
 * Uses the approved SVG from /brand/logo/ when available.
 * Falls back to styled text until the vector master is supplied.
 *
 * NOTE: Replace /brand/logo/ezz-logo-light.svg and ezz-logo-dark.svg
 * with the approved vector master files when they are ready.
 */
export function EzzLogo({ variant = 'auto', size = 'md', className = '', showText = false }: EzzLogoProps) {
  const s = sizes[size];

  const imgSrc = variant === 'dark'
    ? '/brand/logo/ezz-logo-dark.svg'
    : '/brand/logo/ezz-logo-light.svg';

  // auto: use CSS to swap based on color-scheme
  const lightSrc = '/brand/logo/ezz-logo-light.svg';
  const darkSrc  = '/brand/logo/ezz-logo-dark.svg';

  if (variant === 'auto') {
    return (
      <span className={`inline-flex items-center gap-2 ${className}`} aria-label="عز">
        {/* Light mode logo */}
        <img
          src={lightSrc}
          alt="عز"
          width={s.icon * 2.5}
          height={s.icon}
          className="block dark:hidden"
          draggable={false}
        />
        {/* Dark mode logo */}
        <img
          src={darkSrc}
          alt="عز"
          width={s.icon * 2.5}
          height={s.icon}
          className="hidden dark:block"
          draggable={false}
        />
        {showText && (
          <span
            className={`font-bold ${s.text} hidden`}
            style={{ fontFamily: '"Cairo", "IBM Plex Sans Arabic", sans-serif' }}
          >
            عز
          </span>
        )}
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-2 ${className}`} aria-label="عز">
      <img
        src={imgSrc}
        alt="عز"
        width={s.icon * 2.5}
        height={s.icon}
        draggable={false}
      />
    </span>
  );
}
