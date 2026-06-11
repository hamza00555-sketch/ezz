// ─── Color Tokens ─────────────────────────────────────────────────────────────
// Source: ezz brand identity — do not add colors outside this set.

export const colors = {
  // Core Navy
  primaryNavy:     '#0F1B33',
  darkBackground:  '#07111F',
  darkSurface:     '#101D31',
  darkElevated:    '#14213A',

  // Warm Tones
  clayRose:        '#C97A66',
  darkAccent:      '#D18A76',
  softPeach:       '#F6C9B2',

  // Light Base
  warmIvory:       '#F7F2EC',
  whiteIvory:      '#FFFDF8',

  // Text
  mutedText:       '#667085',
  darkMutedText:   '#B8C0CC',

  // Borders
  lightBorder:     '#E8DDD3',
  darkBorder:      'rgba(255, 247, 239, 0.10)',

  // Semantic
  successGreen:    '#72BFA3',  // success states only — not a primary color
} as const;

// ─── Typography ───────────────────────────────────────────────────────────────

export const fontFamily = {
  arabic: '"Cairo", "IBM Plex Sans Arabic", sans-serif',
} as const;

export const fontWeight = {
  regular:   '400',
  medium:    '500',
  semiBold:  '600',
  bold:      '700',
} as const;

export const fontSize = {
  xs:   '0.75rem',   // 12px
  sm:   '0.875rem',  // 14px
  base: '1rem',      // 16px
  lg:   '1.125rem',  // 18px
  xl:   '1.25rem',   // 20px
  '2xl':'1.5rem',    // 24px
  '3xl':'1.875rem',  // 30px
  '4xl':'2.25rem',   // 36px
} as const;

export const lineHeight = {
  tight:  '1.25',
  normal: '1.5',
  relaxed:'1.75',
} as const;

// ─── Spacing ──────────────────────────────────────────────────────────────────

export const spacing = {
  0:    '0',
  1:    '0.25rem',   // 4px
  2:    '0.5rem',    // 8px
  3:    '0.75rem',   // 12px
  4:    '1rem',      // 16px
  5:    '1.25rem',   // 20px
  6:    '1.5rem',    // 24px
  8:    '2rem',      // 32px
  10:   '2.5rem',    // 40px
  12:   '3rem',      // 48px
  16:   '4rem',      // 64px
  20:   '5rem',      // 80px
} as const;

// ─── Border Radius ────────────────────────────────────────────────────────────

export const radii = {
  sm:   '0.375rem',  // 6px
  md:   '0.75rem',   // 12px
  lg:   '1rem',      // 16px
  xl:   '1.25rem',   // 20px
  '2xl':'1.5rem',    // 24px
  full: '9999px',
} as const;

// ─── Shadows ──────────────────────────────────────────────────────────────────

export const shadows = {
  sm:   '0 1px 3px rgba(15, 27, 51, 0.06)',
  md:   '0 4px 12px rgba(15, 27, 51, 0.08)',
  lg:   '0 8px 24px rgba(15, 27, 51, 0.10)',
  card: '0 2px 8px rgba(15, 27, 51, 0.06)',
  // Dark mode equivalents use lower opacity
  smDark:   '0 1px 3px rgba(0, 0, 0, 0.20)',
  mdDark:   '0 4px 12px rgba(0, 0, 0, 0.30)',
  lgDark:   '0 8px 24px rgba(0, 0, 0, 0.40)',
  cardDark: '0 2px 8px rgba(0, 0, 0, 0.25)',
} as const;

// ─── Z-Index ──────────────────────────────────────────────────────────────────

export const zIndex = {
  base:      0,
  raised:    10,
  dropdown:  20,
  sticky:    30,
  overlay:   40,
  modal:     50,
  toast:     60,
  tooltip:   70,
} as const;

// ─── Transitions ──────────────────────────────────────────────────────────────

export const transitions = {
  fast:   '150ms ease',
  normal: '250ms ease',
  slow:   '350ms ease',
} as const;
