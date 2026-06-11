'use client';

export function BootSplash() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,
        background: 'var(--color-bg, #F7F2EC)',
        overflow: 'hidden',
      }}
    >
      {/* Subtle corner pattern */}
      <img
        src="/brand/patterns/quiet-flow-corner-light.svg"
        aria-hidden="true"
        alt=""
        draggable={false}
        style={{ position: 'absolute', top: 0, insetInlineEnd: 0, opacity: 0.07, width: 180, pointerEvents: 'none' }}
        className="dark:hidden"
      />
      <img
        src="/brand/patterns/quiet-flow-corner-dark.svg"
        aria-hidden="true"
        alt=""
        draggable={false}
        style={{ position: 'absolute', top: 0, insetInlineEnd: 0, opacity: 0.07, width: 180, pointerEvents: 'none' }}
        className="hidden dark:block"
      />
      <img
        src="/brand/patterns/quiet-flow-corner-light.svg"
        aria-hidden="true"
        alt=""
        draggable={false}
        style={{ position: 'absolute', bottom: 0, insetInlineStart: 0, opacity: 0.05, width: 140, transform: 'rotate(180deg)', pointerEvents: 'none' }}
        className="dark:hidden"
      />

      {/* Logo */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <span
          style={{
            fontFamily: '"Cairo", "IBM Plex Sans Arabic", sans-serif',
            fontSize: 52,
            fontWeight: 700,
            color: 'var(--color-navy, #0F1B33)',
            lineHeight: 1,
            letterSpacing: '-0.01em',
          }}
        >
          عز
        </span>
      </div>

      {/* Spinner */}
      <div
        aria-label="جاري التحميل"
        style={{
          width: 24,
          height: 24,
          borderRadius: '50%',
          border: '2.5px solid rgba(201, 122, 102, 0.25)',
          borderTopColor: '#C97A66',
          animation: 'spin 0.7s linear infinite',
        }}
      />
    </div>
  );
}
