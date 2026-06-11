'use client';

type PatternName = 'quiet-flow-corner' | 'quiet-flow-pattern' | 'quiet-flow-strip' | 'subtle-background';
type PatternVariant = 'light' | 'dark' | 'auto';
type PatternPosition = 'top-end' | 'bottom-start' | 'bottom-end' | 'top-start' | 'fill';

interface EzzPatternProps {
  name?: PatternName;
  variant?: PatternVariant;
  position?: PatternPosition;
  opacity?: number;
  className?: string;
}

const positionClasses: Record<PatternPosition, string> = {
  'top-end':     'absolute top-0 end-0 pointer-events-none',
  'top-start':   'absolute top-0 start-0 pointer-events-none',
  'bottom-end':  'absolute bottom-0 end-0 pointer-events-none',
  'bottom-start':'absolute bottom-0 start-0 pointer-events-none',
  'fill':        'absolute inset-0 w-full h-full pointer-events-none',
};

/**
 * Renders a brand pattern SVG at a given position.
 * Uses Quiet Flow patterns from /brand/patterns/.
 * Always use low opacity (0.04–0.08) — the pattern should be felt, not seen.
 */
export function EzzPattern({
  name = 'quiet-flow-corner',
  variant = 'auto',
  position = 'top-end',
  opacity = 0.06,
  className = '',
}: EzzPatternProps) {
  const lightSrc = `/brand/patterns/${name}-light.svg`;
  const darkSrc  = `/brand/patterns/${name}-dark.svg`;

  const posClass = positionClasses[position];

  const imgClass = `${posClass} select-none ${className}`;
  const style = { opacity };

  if (variant === 'auto') {
    return (
      <>
        <img src={lightSrc} aria-hidden="true" className={`${imgClass} dark:hidden`} style={style} draggable={false} alt="" />
        <img src={darkSrc}  aria-hidden="true" className={`${imgClass} hidden dark:block`} style={style} draggable={false} alt="" />
      </>
    );
  }

  const src = variant === 'dark' ? darkSrc : lightSrc;
  return <img src={src} aria-hidden="true" className={imgClass} style={style} draggable={false} alt="" />;
}
