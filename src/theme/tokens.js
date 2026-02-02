/**
 * Design Tokens - Single Source of Truth
 *
 * All design tokens for spacing, borders, transitions, shadows, typography, and animations.
 * These tokens ensure consistency across the application.
 *
 * Usage:
 *   import { tokens, typography, shadows } from '@/theme/tokens';
 *   sx={{ borderRadius: tokens.borderRadius.card }}
 */

// ============================================================================
// BORDER RADIUS TOKENS
// ============================================================================

export const borderRadius = {
  none: 0,
  sm: 3,
  md: 6,
  lg: 8,
  xl: 16,
  xxl: 20,
  card: 5,
  button: 12,
  input: 12,
  dialog: 20,
  chip: 10,
  full: 9999,
};

// ============================================================================
// SPACING TOKENS (multiplied by 8px - MUI default)
// ============================================================================

export const spacing = {
  xxs: 0.5,  // 4px
  xs: 1,     // 8px
  sm: 1.5,   // 12px
  md: 2,     // 16px
  lg: 3,     // 24px
  xl: 4,     // 32px
  xxl: 6,    // 48px
  xxxl: 8,   // 64px
};

// ============================================================================
// TRANSITION TOKENS (Disabled for performance)
// ============================================================================

export const transitions = {
  default: 'none',
  smooth: 'none',
  fast: 'none',
  slow: 'none',
  transform: 'none',
  opacity: 'none',
  color: 'none',
  background: 'none',
};

// ============================================================================
// Z-INDEX TOKENS
// ============================================================================

export const zIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
};

// ============================================================================
// FONT WEIGHT TOKENS
// ============================================================================

export const fontWeight = {
  light: 300,
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
  black: 900,
};

// ============================================================================
// LETTER SPACING TOKENS
// ============================================================================

export const letterSpacing = {
  tighter: '-0.02em',
  tight: '-0.01em',
  normal: '0',
  wide: '0.01em',
  wider: '0.02em',
  widest: '0.15em',
};

// ============================================================================
// LINE HEIGHT TOKENS
// ============================================================================

export const lineHeight = {
  none: 1,
  tight: 1.2,
  snug: 1.3,
  normal: 1.5,
  relaxed: 1.6,
  loose: 1.7,
};

// ============================================================================
// ANIMATION TOKENS (Disabled for performance)
// ============================================================================

export const animations = {
  pulse: 'none',
  float: 'none',
  shimmer: 'none',
  gradientShift: 'none',
  duration: {
    fast: '0ms',
    normal: '0ms',
    slow: '0ms',
    slower: '0ms',
  },
  easing: {
    default: 'linear',
    easeIn: 'linear',
    easeOut: 'linear',
    easeInOut: 'linear',
  },
};

// ============================================================================
// BACKDROP FILTER TOKENS
// ============================================================================

export const backdropFilter = {
  none: 'none',
  sm: 'blur(10px)',
  md: 'blur(20px)',
  lg: 'blur(30px)',
};

// ============================================================================
// OPACITY TOKENS
// ============================================================================

export const opacity = {
  disabled: 0.38,
  hover: 0.08,
  selected: 0.12,
  focus: 0.16,
  backdrop: 0.5,
  glass: 0.9,
};

// ============================================================================
// BORDER TOKENS
// ============================================================================

export const border = {
  width: {
    thin: 1,
    medium: 2,
    thick: 3,
  },
  style: {
    solid: 'solid',
    dashed: 'dashed',
    dotted: 'dotted',
  },
};

// ============================================================================
// SHADOW TOKENS
// ============================================================================

export const shadowTokens = {
  none: 'none',
  xs: '0 2px 4px rgba(32, 23, 94, 0.05)',
  sm: '0 4px 8px rgba(32, 23, 94, 0.08)',
  md: '0 4px 20px rgba(32, 23, 94, 0.1)',
  lg: '0 8px 32px rgba(32, 23, 94, 0.12)',
  xl: '0 12px 40px rgba(32, 23, 94, 0.15)',
  xxl: '0 20px 60px rgba(32, 23, 94, 0.2)',
  card: '0 4px 20px rgba(32, 23, 94, 0.08), 0 1px 3px rgba(32, 23, 94, 0.05)',
  cardHover: '0 12px 40px rgba(32, 23, 94, 0.15), 0 4px 8px rgba(32, 23, 94, 0.1)',
  button: '0 4px 20px rgba(96, 87, 161, 0.3)',
  buttonHover: '0 8px 30px rgba(96, 87, 161, 0.4)',
  dialog: '0 20px 60px rgba(13, 9, 38, 0.2)',
  glow: {
    light: '0 0 20px rgba(159, 146, 215, 0.3)',
    primary: '0 0 25px rgba(32, 23, 94, 0.25)',
    dark: '0 0 30px rgba(13, 9, 38, 0.3)',
  },
};

// ============================================================================
// MUI SHADOWS ARRAY (25 levels required by MUI)
// ============================================================================

export const shadows = [
  'none',
  '0px 2px 3px rgba(0,0,0,0.10)',
  '0 0 1px 0 rgba(0,0,0,0.31), 0 2px 2px -2px rgba(0,0,0,0.25)',
  '0 0 1px 0 rgba(0,0,0,0.31), 0 3px 4px -2px rgba(0,0,0,0.25)',
  '0 0 1px 0 rgba(0,0,0,0.31), 0 3px 4px -2px rgba(0,0,0,0.25)',
  '0 0 1px 0 rgba(0,0,0,0.31), 0 4px 6px -2px rgba(0,0,0,0.25)',
  '0 0 1px 0 rgba(0,0,0,0.31), 0 4px 6px -2px rgba(0,0,0,0.25)',
  '0 0 1px 0 rgba(0,0,0,0.31), 0 4px 8px -2px rgba(0,0,0,0.25)',
  '0 9px 17.5px rgb(0,0,0,0.05)',
  'rgb(145 158 171 / 30%) 0px 0px 2px 0px, rgb(145 158 171 / 12%) 0px 12px 24px -4px',
  '0 0 1px 0 rgba(0,0,0,0.31), 0 7px 12px -4px rgba(0,0,0,0.25)',
  '0 0 1px 0 rgba(0,0,0,0.31), 0 6px 16px -4px rgba(0,0,0,0.25)',
  '0 0 1px 0 rgba(0,0,0,0.31), 0 7px 16px -4px rgba(0,0,0,0.25)',
  '0 0 1px 0 rgba(0,0,0,0.31), 0 8px 18px -8px rgba(0,0,0,0.25)',
  '0 0 1px 0 rgba(0,0,0,0.31), 0 9px 18px -8px rgba(0,0,0,0.25)',
  '0 0 1px 0 rgba(0,0,0,0.31), 0 10px 20px -8px rgba(0,0,0,0.25)',
  '0 0 1px 0 rgba(0,0,0,0.31), 0 11px 20px -8px rgba(0,0,0,0.25)',
  '0 0 1px 0 rgba(0,0,0,0.31), 0 12px 22px -8px rgba(0,0,0,0.25)',
  '0 0 1px 0 rgba(0,0,0,0.31), 0 13px 22px -8px rgba(0,0,0,0.25)',
  '0 0 1px 0 rgba(0,0,0,0.31), 0 14px 24px -8px rgba(0,0,0,0.25)',
  '0 0 1px 0 rgba(0,0,0,0.31), 0 16px 28px -8px rgba(0,0,0,0.25)',
  '0 0 1px 0 rgba(0,0,0,0.31), 0 18px 30px -8px rgba(0,0,0,0.25)',
  '0 0 1px 0 rgba(0,0,0,0.31), 0 20px 32px -8px rgba(0,0,0,0.25)',
  '0 0 1px 0 rgba(0,0,0,0.31), 0 22px 34px -8px rgba(0,0,0,0.25)',
  '0 0 1px 0 rgba(0,0,0,0.31), 0 24px 36px -8px rgba(0,0,0,0.25)',
];

export const darkShadows = [
  'none',
  '0px 2px 3px rgba(0,0,0,0.30)',
  '0 0 1px 0 rgba(0,0,0,0.50), 0 2px 2px -2px rgba(0,0,0,0.40)',
  '0 0 1px 0 rgba(0,0,0,0.50), 0 3px 4px -2px rgba(0,0,0,0.40)',
  '0 0 1px 0 rgba(0,0,0,0.50), 0 3px 4px -2px rgba(0,0,0,0.40)',
  '0 0 1px 0 rgba(0,0,0,0.50), 0 4px 6px -2px rgba(0,0,0,0.40)',
  '0 0 1px 0 rgba(0,0,0,0.50), 0 4px 6px -2px rgba(0,0,0,0.40)',
  '0 0 1px 0 rgba(0,0,0,0.50), 0 4px 8px -2px rgba(0,0,0,0.40)',
  '0 9px 17.5px rgb(0,0,0,0.20)',
  'rgb(0 0 0 / 40%) 0px 0px 2px 0px, rgb(0 0 0 / 30%) 0px 12px 24px -4px',
  '0 0 1px 0 rgba(0,0,0,0.50), 0 7px 12px -4px rgba(0,0,0,0.40)',
  '0 0 1px 0 rgba(0,0,0,0.50), 0 6px 16px -4px rgba(0,0,0,0.40)',
  '0 0 1px 0 rgba(0,0,0,0.50), 0 7px 16px -4px rgba(0,0,0,0.40)',
  '0 0 1px 0 rgba(0,0,0,0.50), 0 8px 18px -8px rgba(0,0,0,0.40)',
  '0 0 1px 0 rgba(0,0,0,0.50), 0 9px 18px -8px rgba(0,0,0,0.40)',
  '0 0 1px 0 rgba(0,0,0,0.50), 0 10px 20px -8px rgba(0,0,0,0.40)',
  '0 0 1px 0 rgba(0,0,0,0.50), 0 11px 20px -8px rgba(0,0,0,0.40)',
  '0 0 1px 0 rgba(0,0,0,0.50), 0 12px 22px -8px rgba(0,0,0,0.40)',
  '0 0 1px 0 rgba(0,0,0,0.50), 0 13px 22px -8px rgba(0,0,0,0.40)',
  '0 0 1px 0 rgba(0,0,0,0.50), 0 14px 24px -8px rgba(0,0,0,0.40)',
  '0 0 1px 0 rgba(0,0,0,0.50), 0 16px 28px -8px rgba(0,0,0,0.40)',
  '0 0 1px 0 rgba(0,0,0,0.50), 0 18px 30px -8px rgba(0,0,0,0.40)',
  '0 0 1px 0 rgba(0,0,0,0.50), 0 20px 32px -8px rgba(0,0,0,0.40)',
  '0 0 1px 0 rgba(0,0,0,0.50), 0 22px 34px -8px rgba(0,0,0,0.40)',
  '0 0 1px 0 rgba(0,0,0,0.50), 0 24px 36px -8px rgba(0,0,0,0.40)',
];

// ============================================================================
// TYPOGRAPHY TOKENS
// ============================================================================

export const typography = {
  fontFamily: "'Inter', 'Segoe UI', -apple-system, BlinkMacSystemFont, 'Roboto', 'Helvetica Neue', Arial, sans-serif",

  h1: {
    fontWeight: fontWeight.extrabold,
    fontSize: '2.75rem',
    lineHeight: lineHeight.tight,
    letterSpacing: letterSpacing.tighter,
  },
  h2: {
    fontWeight: fontWeight.bold,
    fontSize: '2.25rem',
    lineHeight: lineHeight.snug,
    letterSpacing: letterSpacing.tight,
  },
  h3: {
    fontWeight: fontWeight.semibold,
    fontSize: '1.75rem',
    lineHeight: lineHeight.snug,
    letterSpacing: letterSpacing.tight,
  },
  h4: {
    fontWeight: fontWeight.semibold,
    fontSize: '1.5rem',
    lineHeight: lineHeight.normal,
    letterSpacing: '-0.005em',
  },
  h5: {
    fontWeight: fontWeight.semibold,
    fontSize: '1.25rem',
    lineHeight: lineHeight.normal,
  },
  h6: {
    fontWeight: fontWeight.semibold,
    fontSize: '1.125rem',
    lineHeight: lineHeight.normal,
  },
  body1: {
    fontSize: '1rem',
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight.relaxed,
    letterSpacing: '0.01em',
  },
  body2: {
    fontSize: '0.875rem',
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight.normal,
    letterSpacing: '0.01em',
  },
  subtitle1: {
    fontSize: '1.125rem',
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.normal,
  },
  subtitle2: {
    fontSize: '1rem',
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.normal,
  },
  caption: {
    fontSize: '0.75rem',
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight.normal,
    letterSpacing: '0.02em',
  },
  overline: {
    fontSize: '0.75rem',
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.normal,
    textTransform: 'uppercase',
    letterSpacing: '0.15em',
  },
  button: {
    textTransform: 'none',
    fontWeight: fontWeight.semibold,
    letterSpacing: '0.01em',
    fontSize: '0.875rem',
  },
};

// Responsive typography utilities
export const responsiveTypography = {
  h1: { fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem', lg: '2.75rem' } },
  h2: { fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem', lg: '2.25rem' } },
  h3: { fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' } },
  h4: { fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.5rem' } },
};

// Typography mixins for sx prop
export const typographyMixins = {
  truncate: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  truncateLines: (lines) => ({
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: lines,
    WebkitBoxOrient: 'vertical',
  }),
};

// ============================================================================
// CONSOLIDATED TOKENS EXPORT
// ============================================================================

export const tokens = {
  borderRadius,
  spacing,
  transitions,
  shadows: shadowTokens,
  zIndex,
  fontWeight,
  letterSpacing,
  lineHeight,
  animations,
  backdropFilter,
  opacity,
  border,
};

export default tokens;
