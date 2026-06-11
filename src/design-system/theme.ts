import { colors, shadows } from './tokens';

// ─── Theme Definitions ────────────────────────────────────────────────────────
// Each theme maps semantic roles to brand color values.

export const lightTheme = {
  // Backgrounds
  background:  colors.warmIvory,   // #F7F2EC
  surface:     colors.whiteIvory,  // #FFFDF8
  elevated:    colors.whiteIvory,

  // Text
  text:        colors.primaryNavy, // #0F1B33
  textMuted:   colors.mutedText,   // #667085
  textInverse: colors.whiteIvory,

  // Accents
  accent:      colors.clayRose,    // #C97A66
  accentSoft:  colors.softPeach,   // #F6C9B2

  // Borders
  border:      colors.lightBorder, // #E8DDD3

  // Status
  success:     colors.successGreen,// #72BFA3

  // Shadows
  shadowCard:  shadows.card,
  shadowMd:    shadows.md,

  // Logo variant
  logoVariant: 'light' as const,
} as const;

export const darkTheme = {
  // Backgrounds
  background:  colors.darkBackground, // #07111F
  surface:     colors.darkSurface,    // #101D31
  elevated:    colors.darkElevated,   // #14213A

  // Text
  text:        '#FFF7EF',
  textMuted:   colors.darkMutedText,  // #B8C0CC
  textInverse: colors.primaryNavy,

  // Accents
  accent:      colors.darkAccent,     // #D18A76
  accentSoft:  'rgba(201, 122, 102, 0.20)',

  // Borders
  border:      colors.darkBorder,     // rgba(255,247,239,0.10)

  // Status
  success:     colors.successGreen,

  // Shadows
  shadowCard:  shadows.cardDark,
  shadowMd:    shadows.mdDark,

  // Logo variant
  logoVariant: 'dark' as const,
} as const;

export type Theme = typeof lightTheme;

// CSS custom properties mapping — consumed by globals.css
export const cssVarsLight: Record<string, string> = {
  '--color-bg':            lightTheme.background,
  '--color-surface':       lightTheme.surface,
  '--color-elevated':      lightTheme.elevated,
  '--color-text':          lightTheme.text,
  '--color-text-muted':    lightTheme.textMuted,
  '--color-text-inverse':  lightTheme.textInverse,
  '--color-accent':        lightTheme.accent,
  '--color-accent-soft':   lightTheme.accentSoft,
  '--color-border':        lightTheme.border,
  '--color-success':       lightTheme.success,
  '--color-navy':          '#0F1B33',
  '--color-peach':         '#F6C9B2',
};

export const cssVarsDark: Record<string, string> = {
  '--color-bg':            darkTheme.background,
  '--color-surface':       darkTheme.surface,
  '--color-elevated':      darkTheme.elevated,
  '--color-text':          darkTheme.text,
  '--color-text-muted':    darkTheme.textMuted,
  '--color-text-inverse':  darkTheme.textInverse,
  '--color-accent':        darkTheme.accent,
  '--color-accent-soft':   darkTheme.accentSoft,
  '--color-border':        darkTheme.border,
  '--color-success':       darkTheme.success,
  '--color-navy':          '#0F1B33',
  '--color-peach':         '#F6C9B2',
};
