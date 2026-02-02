/**
 * Theme Module - Single Entry Point
 *
 * This is the ONLY file you need to import for theme-related functionality.
 * All exports are consolidated here for easy access.
 *
 * Structure (6 essential files):
 * - palette.js    → All colors (single source of truth)
 * - tokens.js     → Design tokens (spacing, shadows, typography)
 * - components.js → MUI component overrides
 * - theme.js      → Theme creation + component styles
 * - ThemeContext.js → Theme mode switching
 * - MapVisualizationTheme.js → Map-specific theme (specialized)
 *
 * Usage:
 *   import { theme, colors, tokens, getTheme } from '@/theme';
 */

// ============================================================================
// THEME CREATION
// ============================================================================

export { getTheme, theme, darkTheme, baselightTheme, equipmentInfoCardStyles, imoProfileCardStyles, portProfileCardStyles, installationProfileCardStyles, organizationProfileCardStyles, nsagActorProfileCardStyles } from './theme';

// ============================================================================
// COLOR PALETTE (Single Source of Truth)
// ============================================================================

export {
  // Core color scales
  colors,
  // MUI palettes
  palette,
  darkPalette,
  // Gradients
  gradients,
  darkGradients,
  // Helper functions
  withOpacity,
  getColor,
  blue,
  indigo,
  cyan,
  gray,
  navy,
  // Profile card style helpers
  getSectionHeaderStyles,
  getModalStyles,
  // Backward compatibility
  primaryPalette,
  secondaryPalette,
  accentPalette,
  equipmentColors,
  militaryGroupColors,
  profileCardColors,
  semantic,
} from './palette';

// ============================================================================
// DESIGN TOKENS
// ============================================================================

export {
  tokens,
  // Individual token categories
  borderRadius,
  spacing,
  transitions,
  zIndex,
  fontWeight,
  letterSpacing,
  lineHeight,
  animations,
  backdropFilter,
  opacity,
  border,
  shadowTokens,
  // Typography
  typography,
  responsiveTypography,
  typographyMixins,
  // Shadows (MUI arrays)
  shadows,
  darkShadows,
} from './tokens';

// ============================================================================
// COMPONENT OVERRIDES
// ============================================================================

export { getComponents, components } from './components';

// ============================================================================
// THEME CONTEXT
// ============================================================================

export {
  ThemeContextProvider,
  useThemeContext,
  THEME_MODES,
} from './ThemeContext';

// ============================================================================
// MAP VISUALIZATION THEME
// ============================================================================

export {
  mapTheme,
  mapColors,
  mapTypography,
  mapSizing,
  mapEffects,
  NODE_COLORS,
  EDGE_COLORS,
  getNodeColor,
  getEdgeColor,
  eventCategories,
  mapLayerConfig,
  highlightOptions,
} from './MapVisualizationTheme';

// ============================================================================
// BACKWARD COMPATIBILITY EXPORTS (for gradual migration)
// These aliases help files that still import from old componentStyles
// ============================================================================

import { colors as _colors, gradients as _gradients } from './palette';
import { shadowTokens as _shadowTokens } from './tokens';

// Component colors - alias to colors from palette with additional semantic groups
export const componentColors = {
  // Core color scales
  blue: _colors.blue,
  indigo: _colors.indigo,
  cyan: _colors.cyan,
  gray: _colors.gray,
  slate: _colors.slate,
  navy: _colors.navy,
  sky: _colors.sky,
  violet: _colors.violet,
  white: _colors.white,
  black: _colors.black,
  // Semantic groups for backward compatibility
  accents: {
    blue: _colors.blue[500],
    indigo: _colors.indigo[500],
    cyan: _colors.cyan[500],
    navy: _colors.navy[600],
  },
  background: {
    light: '#F5F7FA',
    dark: _colors.slate[900],
    paper: _colors.white,
    default: _colors.slate[50],
  },
  text: {
    primary: _colors.slate[900],
    secondary: _colors.slate[600],
    muted: _colors.slate[400],
    disabled: _colors.gray[400],
  },
  border: {
    light: _colors.slate[200],
    default: _colors.gray[300],
    dark: _colors.gray[400],
  },
};

// Re-export gradients as componentGradients for backward compatibility
export const componentGradients = {
  ..._gradients,
  // Events gradients for EventCard
  events: {
    blue: `linear-gradient(90deg, ${_colors.blue[500]} 0%, ${_colors.cyan[500]} 100%)`,
    indigo: `linear-gradient(90deg, ${_colors.indigo[500]} 0%, ${_colors.violet[500]} 100%)`,
    cyan: `linear-gradient(90deg, ${_colors.cyan[500]} 0%, ${_colors.sky[500]} 100%)`,
  },
};

// Shadow styles - reference tokens
export const shadowStyles = _shadowTokens;

// Card styles placeholder
export const cardStyles = {
  base: {
    borderRadius: 5,
    boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)',
    background: '#FFFFFF',
  },
  hover: {
    boxShadow: '0 4px 12px rgba(0,0,0,0.15), 0 2px 4px rgba(0,0,0,0.1)',
  },
};

// Typography styles placeholder
export const typographyStyles = {
  heading: { fontWeight: 700, letterSpacing: '-0.01em' },
  body: { fontWeight: 400, lineHeight: 1.6 },
};

// Empty keyframes (animations disabled)
export const keyframes = {};

// Icon styles placeholder
export const iconStyles = {
  container: { display: 'flex', alignItems: 'center', justifyContent: 'center' },
  size: { sm: 20, md: 24, lg: 32 },
};

// Badge styles placeholder
export const badgeStyles = {
  default: { borderRadius: 4, px: 1, py: 0.5 },
};

// Loading styles placeholder
export const loadingStyles = {
  container: { display: 'flex', alignItems: 'center', justifyContent: 'center' },
  spinner: { color: _colors.blue[500] },
};

// Empty styles placeholder
export const emptyStyles = {
  container: { display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' },
  icon: { fontSize: 48, color: _colors.gray[300] },
  text: { color: _colors.gray[500] },
};

// Layout styles placeholder
export const layoutStyles = {
  flexCenter: { display: 'flex', alignItems: 'center', justifyContent: 'center' },
  flexBetween: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
};

// Modal styles placeholder
export const modalStyles = {
  paper: { borderRadius: 12, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' },
  backdrop: { backgroundColor: 'rgba(0,0,0,0.5)' },
};

// Button styles placeholder
export const buttonStyles = {
  primary: { background: _gradients.button },
  outlined: { borderWidth: 2 },
};

// Input styles placeholder
export const inputStyles = {
  root: { borderRadius: 8 },
};

// Table styles placeholder
export const tableStyles = {
  head: { background: _gradients.table },
  row: { '&:hover': { background: 'rgba(0,0,0,0.04)' } },
};

// Scrollbar styles placeholder
export const scrollbarStyles = {
  thin: { '&::-webkit-scrollbar': { width: 6 } },
};

// Helper functions for backward compatibility
export const createColoredShadow = (color, opacity = 0.3) =>
  `0 4px 14px rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(color.slice(3, 5), 16)}, ${parseInt(color.slice(5, 7), 16)}, ${opacity})`;

export const createGradient = (color1, color2, angle = 135) =>
  `linear-gradient(${angle}deg, ${color1} 0%, ${color2} 100%)`;

// Default export
export { default } from './theme';
