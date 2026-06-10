'use client';

/**
 * Full-screen branded splash shown on the cream app background while the
 * first auth + data load settles. Replaces both the old black PWA flash and
 * the empty "zeros" dashboard that used to appear before data arrived.
 */
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
        gap: 18,
        background: 'var(--bg-app)',
        color: 'var(--text-primary)',
      }}
    >
      <div
        style={{
          fontSize: 44,
          fontWeight: 800,
          letterSpacing: '-0.02em',
          color: 'var(--accent-strong, #435238)',
        }}
      >
        عز
      </div>
      <div
        aria-label="جاري التحميل"
        style={{
          width: 26,
          height: 26,
          borderRadius: '50%',
          border: '3px solid rgba(67, 82, 56, 0.18)',
          borderTopColor: 'var(--accent-strong, #435238)',
          animation: 'spin 0.7s linear infinite',
        }}
      />
    </div>
  );
}
