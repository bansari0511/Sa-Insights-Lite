/**
 * Unified Color Palette - Single Source of Truth
 *
 * This is the ONLY place where colors are defined for the entire application.
 * All components should access colors via useTheme().palette or import from here.
 *
 * Structure:
 * 1. CORE COLOR SCALES (blue, indigo, cyan, gray, navy) - 50 to 900 shades
 * 2. SEMANTIC COLORS (success, error, warning, info)
 * 3. MUI PALETTE (light/dark mode configurations)
 * 4. HELPER FUNCTIONS
 *
 * Usage:
 *   import { palette, colors, withOpacity } from '@/theme/palette';
 *   sx={{ color: colors.blue[600] }}
 */

// ============================================================================
// CORE COLOR SCALES - Single Definition (Used everywhere)
// ============================================================================

export const colors = {
  // Blue Scale - Primary actions, links, highlights
  blue: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6',
    600: '#2563EB',
    700: '#1D4ED8',
    800: '#1E40AF',
    900: '#1E3A8A',
    main: '#3B82F6',
    light: '#EFF6FF',
    hover: '#DBEAFE',
  },

  // Indigo Scale - Accent, special features, badges
  indigo: {
    50: '#EEF2FF',
    100: '#E0E7FF',
    200: '#C7D2FE',
    300: '#A5B4FC',
    400: '#818CF8',
    500: '#6366F1',
    600: '#4F46E5',
    700: '#4338CA',
    800: '#3730A3',
    900: '#312E81',
    main: '#6366F1',
    light: '#EEF2FF',
    hover: '#E0E7FF',
  },

  // Cyan Scale - Secondary actions, info, accents
  cyan: {
    50: '#ECFEFF',
    100: '#CFFAFE',
    200: '#A5F3FC',
    300: '#67E8F9',
    400: '#22D3EE',
    500: '#06B6D4',
    600: '#0891B2',
    700: '#0E7490',
    800: '#155E75',
    900: '#164E63',
    main: '#06B6D4',
    light: '#ECFEFF',
    hover: '#CFFAFE',
  },

  // Sky Scale - Info states, highlights
  sky: {
    50: '#F0F9FF',
    100: '#E0F2FE',
    200: '#BAE6FD',
    300: '#7DD3FC',
    400: '#38BDF8',
    500: '#0EA5E9',
    600: '#0284C7',
    700: '#0369A1',
    800: '#075985',
    900: '#0C4A6E',
  },

  // Gray Scale - Neutral elements
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },

  // Slate Scale - Alternative neutral
  slate: {
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
  },

  // Navy Scale - Deep brand colors
  navy: {
    50: '#EDF0F4',
    100: '#A9BFD4',
    200: '#91B2D3',
    300: '#7395BB',
    400: '#496B92',
    500: '#274668',
    600: '#16356E',
    700: '#1A1249',
    800: '#140E35',
    900: '#0D0920',
  },

  // Green Scale - Success states
  green: {
    50: '#F0FDF4',
    100: '#DCFCE7',
    200: '#BBF7D0',
    300: '#86EFAC',
    400: '#4ADE80',
    500: '#22C55E',
    600: '#16A34A',
    700: '#15803D',
    800: '#166534',
    900: '#14532D',
    main: '#22C55E',
    light: '#F0FDF4',
    hover: '#DCFCE7',
  },

  // Teal Scale - Between cyan and green
  teal: {
    50: '#F0FDFA',
    100: '#CCFBF1',
    200: '#99F6E4',
    300: '#5EEAD4',
    400: '#2DD4BF',
    500: '#14B8A6',
    600: '#0D9488',
    700: '#0F766E',
    800: '#115E59',
    900: '#134E4A',
  },

  // Violet Scale - Special accents
  violet: {
    50: '#F5F3FF',
    100: '#EDE9FE',
    200: '#DDD6FE',
    300: '#C4B5FD',
    400: '#A78BFA',
    500: '#8B5CF6',
    600: '#7C3AED',
    700: '#6D28D9',
    800: '#5B21B6',
    900: '#4C1D95',
  },

  // Amber Scale - Warning states
  amber: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    300: '#FCD34D',
    400: '#FBBF24',
    500: '#F59E0B',
    600: '#D97706',
    700: '#B45309',
    800: '#92400E',
    900: '#78350F',
  },

  // Orange Scale - Accent states
  orange: {
    50: '#FFF7ED',
    100: '#FFEDD5',
    200: '#FED7AA',
    300: '#FDBA74',
    400: '#FB923C',
    500: '#F97316',
    600: '#EA580C',
    700: '#C2410C',
    800: '#9A3412',
    900: '#7C2D12',
    main: '#F97316',
    light: '#FFF7ED',
    hover: '#FFEDD5',
  },

  // Red Scale - Error states
  red: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    200: '#FECACA',
    300: '#FCA5A5',
    400: '#F87171',
    500: '#EF4444',
    600: '#DC2626',
    700: '#B91C1C',
    800: '#991B1B',
    900: '#7F1D1D',
  },

  // Common
  white: '#FFFFFF',
  black: '#000000',

  // Semantic shortcuts for components (background, border, text)
  // These provide quick access for components like InstallationProfileCard
  background: {
    card: '#FFFFFF',
    hover: '#F8FAFC',
    section: '#F1F5F9',
    subtle: '#F9FAFB',
  },
  border: {
    light: '#E2E8F0',
    default: '#CBD5E1',
  },
  text: {
    primary: '#0F172A',
    secondary: '#475569',
    tertiary: '#64748B',
    muted: '#94A3B8',
  },
};

// ============================================================================
// SEMANTIC COLORS - Status & State Colors
// ============================================================================

export const semantic = {
  success: {
    main: colors.sky[500],
    light: colors.sky[100],
    dark: colors.sky[700],
  },
  info: {
    main: colors.blue[500],
    light: colors.blue[100],
    dark: colors.blue[700],
  },
  warning: {
    main: colors.indigo[500],
    light: colors.indigo[100],
    dark: colors.indigo[700],
  },
  error: {
    main: colors.indigo[600],
    light: colors.indigo[100],
    dark: colors.indigo[800],
  },
};

// ============================================================================
// GRADIENTS - Single Definition
// ============================================================================

export const gradients = {
  // Primary gradients
  primary: `linear-gradient(135deg, ${colors.navy[500]} 0%, ${colors.navy[700]} 100%)`,
  primaryLight: `linear-gradient(135deg, ${colors.navy[400]} 0%, ${colors.navy[600]} 100%)`,
  primaryDark: `linear-gradient(135deg, ${colors.navy[600]} 0%, ${colors.navy[900]} 100%)`,

  // Background gradients
  background: `linear-gradient(135deg, ${colors.navy[50]} 0%, #F8FAFC 100%)`,
  backgroundAlt: `linear-gradient(180deg, ${colors.white} 0%, ${colors.navy[50]} 100%)`,

  // Card gradients
  card: `linear-gradient(135deg, ${colors.white} 0%, ${colors.navy[50]} 100%)`,
  cardHover: `linear-gradient(135deg, ${colors.white} 0%, ${colors.navy[100]} 100%)`,

  // Button gradients
  button: `linear-gradient(135deg, ${colors.navy[500]} 0%, ${colors.navy[700]} 100%)`,
  buttonHover: `linear-gradient(135deg, ${colors.navy[400]} 0%, ${colors.navy[600]} 100%)`,

  // Sidebar & AppBar
  sidebar: `linear-gradient(180deg, ${colors.navy[600]} 0%, ${colors.navy[800]} 100%)`,
  appBar: `linear-gradient(180deg, ${colors.navy[600]} 0%, ${colors.navy[700]} 100%)`,

  // Table & Chip
  table: `linear-gradient(135deg, ${colors.navy[50]} 0%, ${colors.navy[100]} 100%)`,
  chip: `linear-gradient(135deg, ${colors.navy[50]} 0%, ${colors.navy[100]} 100%)`,
  chipHover: `linear-gradient(135deg, ${colors.navy[100]} 0%, ${colors.navy[200]} 100%)`,

  // Glass effects
  glass: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(247, 246, 251, 0.9) 100%)',

  // Modal headers
  modal: {
    blue: `linear-gradient(135deg, ${colors.blue[800]} 0%, ${colors.blue[500]} 50%, ${colors.blue[400]} 100%)`,
    indigo: `linear-gradient(135deg, ${colors.indigo[700]} 0%, ${colors.indigo[500]} 50%, ${colors.indigo[400]} 100%)`,
    cyan: `linear-gradient(135deg, ${colors.cyan[800]} 0%, ${colors.sky[500]} 50%, ${colors.sky[300]} 100%)`,
  },

  // Header gradients for cards
  header: {
    blue: `linear-gradient(135deg, ${colors.blue[100]} 0%, ${colors.blue[200]} 100%)`,
    indigo: `linear-gradient(135deg, ${colors.indigo[50]} 0%, ${colors.indigo[100]} 100%)`,
    cyan: `linear-gradient(135deg, ${colors.sky[100]} 0%, ${colors.sky[200]} 100%)`,
    navy: `linear-gradient(135deg, ${colors.navy[500]} 0%, ${colors.navy[600]} 100%)`,
  },

  // Icon gradients
  icon: {
    blue: `linear-gradient(135deg, ${colors.blue[500]} 0%, ${colors.blue[600]} 100%)`,
    indigo: `linear-gradient(135deg, ${colors.indigo[500]} 0%, ${colors.indigo[600]} 100%)`,
    cyan: `linear-gradient(135deg, ${colors.sky[500]} 0%, ${colors.sky[600]} 100%)`,
  },
};

// ============================================================================
// DARK MODE GRADIENTS
// ============================================================================

export const darkGradients = {
  primary: `linear-gradient(135deg, ${colors.navy[500]} 0%, ${colors.navy[700]} 100%)`,
  background: 'linear-gradient(135deg, #0D1117 0%, #161B22 100%)',
  card: 'linear-gradient(135deg, #161B22 0%, #1C2128 100%)',
  button: `linear-gradient(135deg, ${colors.navy[500]} 0%, ${colors.navy[600]} 100%)`,
  sidebar: 'linear-gradient(180deg, #161B22 0%, #0D1117 100%)',
  appBar: 'linear-gradient(180deg, #161B22 0%, #1C2128 100%)',
  table: 'linear-gradient(135deg, #161B22 0%, #1C2128 100%)',
  chip: 'linear-gradient(135deg, #21262D 0%, #30363D 100%)',
  chipHover: 'linear-gradient(135deg, #30363D 0%, #484F58 100%)',
  glass: 'linear-gradient(135deg, rgba(22, 27, 34, 0.95) 0%, rgba(33, 38, 45, 0.9) 100%)',
};

// ============================================================================
// MUI PALETTE - LIGHT MODE
// ============================================================================

export const palette = {
  mode: 'light',

  primary: {
    main: colors.navy[600],
    light: colors.navy[400],
    dark: colors.navy[800],
    contrastText: colors.white,
    ...colors.navy,
  },

  secondary: {
    main: colors.cyan[600],
    light: colors.cyan[400],
    dark: colors.cyan[800],
    contrastText: colors.white,
    ...colors.cyan,
  },

  accent: {
    main: colors.indigo[600],
    light: colors.indigo[400],
    dark: colors.indigo[800],
    contrastText: colors.white,
    ...colors.indigo,
  },

  success: {
    main: semantic.success.main,
    light: semantic.success.light,
    dark: semantic.success.dark,
    contrastText: colors.white,
  },

  info: {
    main: semantic.info.main,
    light: semantic.info.light,
    dark: semantic.info.dark,
    contrastText: colors.white,
  },

  error: {
    main: semantic.error.main,
    light: semantic.error.light,
    dark: semantic.error.dark,
    contrastText: colors.white,
  },

  warning: {
    main: semantic.warning.main,
    light: semantic.warning.light,
    dark: semantic.warning.dark,
    contrastText: colors.white,
  },

  grey: colors.gray,

  text: {
    primary: colors.navy[900],
    secondary: colors.navy[700],
    disabled: colors.gray[400],
    inverse: colors.white,
    accent: colors.navy[600],
  },

  action: {
    hover: `${colors.navy[600]}14`,
    selected: `${colors.navy[600]}1F`,
    disabled: `${colors.navy[600]}42`,
    disabledBackground: `${colors.navy[600]}1F`,
    focus: `${colors.navy[600]}29`,
    active: `${colors.navy[600]}33`,
  },

  background: {
    default: colors.navy[50],
    paper: colors.white,
    secondary: colors.navy[100],
    gradient: gradients.background,
    darkContrast: colors.navy[600],
    glass: 'rgba(255, 255, 255, 0.95)',
  },

  divider: `${colors.navy[600]}26`,

  common: {
    black: colors.black,
    white: colors.white,
  },

  // Brand colors for backward compatibility
  brand: {
    gradients,
    // Direct brand colors for sidebar and navigation
    cyan: colors.cyan[400],
    blue: colors.blue[500],
    indigo: colors.indigo[500],
    navy: colors.navy[600],
  },

  // Equipment colors - reference core scales with main/light/dark
  equipment: {
    blue: { ...colors.blue, main: colors.blue[600], light: colors.blue[400], dark: colors.blue[800] },
    cyan: { ...colors.cyan, main: colors.cyan[600], light: colors.cyan[400], dark: colors.cyan[800] },
    indigo: { ...colors.indigo, main: colors.indigo[600], light: colors.indigo[400], dark: colors.indigo[800] },
    gray: colors.gray,
    navy: { ...colors.navy, main: colors.navy[600], light: colors.navy[400], dark: colors.navy[800] },
    slate: colors.slate,
    backgrounds: {
      blueTint: `${colors.blue[600]}0A`,
      blueLight: `${colors.blue[600]}14`,
      cyanTint: `${colors.cyan[600]}0A`,
      indigoTint: `${colors.indigo[600]}0A`,
      page: '#F2F6FA',
    },
    shadows: {
      card: `0 1px 3px ${colors.blue[500]}0F, 0 4px 12px ${colors.blue[500]}14`,
      cardHover: `0 4px 8px ${colors.blue[500]}1A, 0 8px 24px ${colors.blue[500]}1F`,
      blue: `0 4px 14px ${colors.blue[600]}40`,
      cyan: `0 4px 14px ${colors.cyan[600]}40`,
      indigo: `0 4px 14px ${colors.indigo[600]}40`,
    },
    gradients: {
      blue: gradients.icon.blue,
      cyan: gradients.icon.cyan,
      indigo: gradients.icon.indigo,
      blueHeader: gradients.header.blue,
      indigoHeader: gradients.header.indigo,
      cyanHeader: gradients.header.cyan,
    },
    overlay: {
      white10: 'rgba(255, 255, 255, 0.1)',
      white15: 'rgba(255, 255, 255, 0.15)',
      white20: 'rgba(255, 255, 255, 0.2)',
      white30: 'rgba(255, 255, 255, 0.3)',
      white75: 'rgba(255, 255, 255, 0.75)',
      white80: 'rgba(255, 255, 255, 0.8)',
      black5: 'rgba(0, 0, 0, 0.05)',
      black8: 'rgba(0, 0, 0, 0.08)',
      black12: 'rgba(0, 0, 0, 0.12)',
      black20: 'rgba(0, 0, 0, 0.2)',
    },
    text: {
      primary: colors.slate[900],
      secondary: colors.slate[600],
      muted: colors.slate[400],
      slate: colors.slate[600],
      blue: colors.blue[700],
      indigo: colors.indigo[700],
      cyan: colors.cyan[700],
    },
    accent: {
      amber: colors.amber[500],
      amberGlow: `${colors.amber[500]}80`,
      orange: colors.amber[600],
      yellow: colors.amber[400],
    },
  },

  // Military group colors - reference core scales
  militaryGroup: {
    white: colors.white,
    blue: colors.blue,
    indigo: colors.indigo,
    cyan: { ...colors.cyan, main: colors.sky[500], light: colors.sky[100], dark: colors.sky[700] },
    gray: colors.slate,
    green: colors.green,
    backgrounds: {
      page: colors.slate[50],
      card: colors.white,
      blueTint: `${colors.blue[500]}0A`,
      indigoTint: `${colors.indigo[500]}0A`,
      cyanTint: `${colors.sky[500]}0A`,
    },
    shadows: {
      card: `0 1px 3px ${colors.blue[500]}0F, 0 4px 12px ${colors.blue[500]}14`,
      indigoCard: `0 1px 3px ${colors.indigo[500]}0F, 0 4px 12px ${colors.indigo[500]}14`,
      cyanCard: `0 1px 3px ${colors.sky[500]}0F, 0 4px 12px ${colors.sky[500]}14`,
    },
    gradients: {
      blueHeader: gradients.header.blue,
      indigoHeader: gradients.header.indigo,
      cyanHeader: gradients.header.cyan,
      blueIcon: gradients.icon.blue,
      indigoIcon: gradients.icon.indigo,
      cyanIcon: gradients.icon.cyan,
      modalHeader: gradients.modal.indigo,
    },
    borders: {
      light: colors.slate[200],
      default: colors.gray[200],
      blue: `${colors.blue[500]}14`,
      indigo: `${colors.indigo[500]}14`,
      cyan: `${colors.sky[500]}14`,
    },
    text: {
      primary: colors.slate[900],
      secondary: colors.slate[500],
      muted: colors.slate[400],
      blueHeading: colors.blue[800],
      indigoHeading: colors.indigo[700],
      cyanHeading: colors.sky[800],
      label: '#1E3A5F',
    },
    overlay: {
      white10: 'rgba(255, 255, 255, 0.1)',
      white15: 'rgba(255, 255, 255, 0.15)',
      white20: 'rgba(255, 255, 255, 0.2)',
      white25: 'rgba(255, 255, 255, 0.25)',
      white30: 'rgba(255, 255, 255, 0.3)',
      white35: 'rgba(255, 255, 255, 0.35)',
      white50: 'rgba(255, 255, 255, 0.5)',
      white80: 'rgba(255, 255, 255, 0.8)',
      backdrop: 'rgba(15, 23, 42, 0.6)',
    },
    // Section themes for different card sections
    sectionThemes: {
      organization: {
        primary: colors.blue[600],
        light: colors.blue[50],
        accent: colors.blue[100],
        icon: colors.blue[500],
      },
      operations: {
        primary: colors.indigo[600],
        light: colors.indigo[50],
        accent: colors.indigo[100],
        icon: colors.indigo[500],
      },
      location: {
        primary: colors.sky[600],
        light: colors.sky[50],
        accent: colors.sky[100],
        icon: colors.sky[700],
      },
    },
    // Profile action button styles (News, Event, Map buttons)
    profileButtons: {
      news: {
        background: `linear-gradient(135deg, ${colors.cyan[600]} 0%, ${colors.cyan[500]} 50%, ${colors.cyan[400]} 100%)`,
        hoverBackground: `linear-gradient(135deg, ${colors.cyan[700]} 0%, ${colors.cyan[600]} 50%, ${colors.cyan[500]} 100%)`,
        border: `1px solid rgba(${parseInt(colors.cyan[600].slice(1, 3), 16)}, ${parseInt(colors.cyan[600].slice(3, 5), 16)}, ${parseInt(colors.cyan[600].slice(5, 7), 16)}, 0.4)`,
        boxShadow: `0 4px 16px rgba(${parseInt(colors.cyan[600].slice(1, 3), 16)}, ${parseInt(colors.cyan[600].slice(3, 5), 16)}, ${parseInt(colors.cyan[600].slice(5, 7), 16)}, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)`,
        hoverBoxShadow: `0 12px 32px rgba(${parseInt(colors.cyan[600].slice(1, 3), 16)}, ${parseInt(colors.cyan[600].slice(3, 5), 16)}, ${parseInt(colors.cyan[600].slice(5, 7), 16)}, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.25)`,
        iconBg: 'rgba(255, 255, 255, 0.25)',
        textColor: colors.white,
      },
      event: {
        background: `linear-gradient(135deg, ${colors.indigo[600]} 0%, ${colors.indigo[500]} 50%, ${colors.indigo[400]} 100%)`,
        hoverBackground: `linear-gradient(135deg, ${colors.indigo[700]} 0%, ${colors.indigo[600]} 50%, ${colors.indigo[500]} 100%)`,
        border: `1px solid rgba(${parseInt(colors.indigo[500].slice(1, 3), 16)}, ${parseInt(colors.indigo[500].slice(3, 5), 16)}, ${parseInt(colors.indigo[500].slice(5, 7), 16)}, 0.4)`,
        boxShadow: `0 4px 16px rgba(${parseInt(colors.indigo[500].slice(1, 3), 16)}, ${parseInt(colors.indigo[500].slice(3, 5), 16)}, ${parseInt(colors.indigo[500].slice(5, 7), 16)}, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)`,
        hoverBoxShadow: `0 12px 32px rgba(${parseInt(colors.indigo[500].slice(1, 3), 16)}, ${parseInt(colors.indigo[500].slice(3, 5), 16)}, ${parseInt(colors.indigo[500].slice(5, 7), 16)}, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.25)`,
        iconBg: 'rgba(255, 255, 255, 0.25)',
        textColor: colors.white,
      },
      map: {
        background: `linear-gradient(135deg, ${colors.blue[900]} 0%, ${colors.blue[800]} 50%, ${colors.blue[500]} 100%)`,
        hoverBackground: `linear-gradient(135deg, ${colors.blue[900]} 0%, ${colors.blue[700]} 50%, ${colors.blue[600]} 100%)`,
        border: `1px solid rgba(${parseInt(colors.blue[800].slice(1, 3), 16)}, ${parseInt(colors.blue[800].slice(3, 5), 16)}, ${parseInt(colors.blue[800].slice(5, 7), 16)}, 0.4)`,
        boxShadow: `0 4px 16px rgba(${parseInt(colors.blue[800].slice(1, 3), 16)}, ${parseInt(colors.blue[800].slice(3, 5), 16)}, ${parseInt(colors.blue[800].slice(5, 7), 16)}, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)`,
        hoverBoxShadow: `0 12px 32px rgba(${parseInt(colors.blue[800].slice(1, 3), 16)}, ${parseInt(colors.blue[800].slice(3, 5), 16)}, ${parseInt(colors.blue[800].slice(5, 7), 16)}, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.25)`,
        iconBg: 'rgba(255, 255, 255, 0.25)',
        textColor: colors.white,
      },
      mapActive: {
        background: `linear-gradient(135deg, ${colors.blue[900]} 0%, ${colors.blue[800]} 50%, ${colors.blue[600]} 100%)`,
        hoverBackground: `linear-gradient(135deg, #172554 0%, ${colors.blue[900]} 50%, ${colors.blue[800]} 100%)`,
        border: '2px solid rgba(255, 255, 255, 0.5)',
        boxShadow: `0 6px 20px rgba(${parseInt(colors.blue[800].slice(1, 3), 16)}, ${parseInt(colors.blue[800].slice(3, 5), 16)}, ${parseInt(colors.blue[800].slice(5, 7), 16)}, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.3)`,
        hoverBoxShadow: `0 12px 32px rgba(${parseInt(colors.blue[800].slice(1, 3), 16)}, ${parseInt(colors.blue[800].slice(3, 5), 16)}, ${parseInt(colors.blue[800].slice(5, 7), 16)}, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.35)`,
        iconBg: 'rgba(255, 255, 255, 0.35)',
        textColor: colors.white,
      },
    },
    // Map section styles
    mapSection: {
      containerBg: colors.white,
      containerBorder: `1px solid rgba(${parseInt(colors.blue[800].slice(1, 3), 16)}, ${parseInt(colors.blue[800].slice(3, 5), 16)}, ${parseInt(colors.blue[800].slice(5, 7), 16)}, 0.2)`,
      containerShadow: `0 4px 20px rgba(${parseInt(colors.blue[800].slice(1, 3), 16)}, ${parseInt(colors.blue[800].slice(3, 5), 16)}, ${parseInt(colors.blue[800].slice(5, 7), 16)}, 0.12), 0 1px 3px rgba(0,0,0,0.05)`,
      headerBg: `linear-gradient(135deg, rgba(${parseInt(colors.blue[800].slice(1, 3), 16)}, ${parseInt(colors.blue[800].slice(3, 5), 16)}, ${parseInt(colors.blue[800].slice(5, 7), 16)}, 0.08) 0%, rgba(${parseInt(colors.blue[500].slice(1, 3), 16)}, ${parseInt(colors.blue[500].slice(3, 5), 16)}, ${parseInt(colors.blue[500].slice(5, 7), 16)}, 0.04) 100%)`,
      headerBorder: `1px solid rgba(${parseInt(colors.blue[800].slice(1, 3), 16)}, ${parseInt(colors.blue[800].slice(3, 5), 16)}, ${parseInt(colors.blue[800].slice(5, 7), 16)}, 0.1)`,
      iconBoxBg: `linear-gradient(135deg, ${colors.blue[900]} 0%, ${colors.blue[800]} 100%)`,
      iconBoxShadow: `0 2px 8px rgba(${parseInt(colors.blue[800].slice(1, 3), 16)}, ${parseInt(colors.blue[800].slice(3, 5), 16)}, ${parseInt(colors.blue[800].slice(5, 7), 16)}, 0.3)`,
      closeButtonBg: `rgba(${parseInt(colors.blue[800].slice(1, 3), 16)}, ${parseInt(colors.blue[800].slice(3, 5), 16)}, ${parseInt(colors.blue[800].slice(5, 7), 16)}, 0.08)`,
      closeButtonHoverBg: `rgba(${parseInt(colors.blue[800].slice(1, 3), 16)}, ${parseInt(colors.blue[800].slice(3, 5), 16)}, ${parseInt(colors.blue[800].slice(5, 7), 16)}, 0.15)`,
      primary: colors.blue[800],
    },
  },

  // Dashboard colors
  dashboard: {
    primary: colors.blue,
    secondary: colors.indigo,
    background: {
      default: '#F5F7FA',
      surface: colors.white,
      surfaceHover: '#FAFBFC',
    },
    border: {
      light: '#E5E8EB',
      medium: colors.gray[300],
      dark: colors.gray[400],
      divider: '#E5E8EB',
    },
    text: {
      primary: colors.gray[800],
      secondary: colors.gray[600],
      tertiary: colors.gray[500],
      muted: colors.gray[400],
      inverse: colors.white,
    },
    chart: [colors.blue[500], colors.sky[500], colors.indigo[500], colors.blue[700], colors.sky[600], colors.indigo[600]],
  },

  // Profile card colors
  profileCard: {
    // Base color sets with main, light, hover variants
    blue: { main: '#5D87FF', light: '#ECF2FF', hover: '#EEF2FF' },
    cyan: { main: '#49BEFF', light: '#E8F7FF', hover: '#DDF3FF' },
    teal: { main: colors.sky[500], light: colors.sky[100], gradient: gradients.icon.cyan },
    orange: { main: colors.orange[500], light: colors.orange[50], hover: colors.orange[100] },
    red: { main: colors.red[500], light: colors.red[50], hover: colors.red[100] },
    green: { main: colors.green[500], light: colors.green[50], hover: colors.green[100] },
    indigo: { main: colors.indigo[500], light: colors.indigo[50], hover: colors.indigo[100] },
    violet: { main: colors.violet[500], light: colors.violet[50], hover: colors.violet[100] },

    // Text colors
    text: {
      primary: colors.gray[900],
      secondary: colors.gray[700],
      tertiary: colors.gray[500],
      dark: colors.gray[950] || '#030712',
      muted: colors.gray[600],
      label: colors.gray[800],
      heading: colors.gray[900],
      light: colors.white,
      accent: colors.blue[600],
    },

    // Background colors
    background: {
      card: colors.white,
      section: '#F7F9FC',
      hover: colors.slate[50],
      light: colors.slate[50],
      subtle: colors.gray[50],
      overlay: 'rgba(0, 0, 0, 0.5)',
    },

    // Border colors
    border: {
      light: '#E5EAEF',
      default: colors.slate[200],
      subtle: colors.slate[100],
      accent: colors.blue[200],
    },

    // Card container styles
    card: {
      background: colors.white,
      borderRadius: '12px',
      border: `1px solid ${colors.slate[200]}`,
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
      boxShadowHover: '0 4px 16px rgba(0, 0, 0, 0.1)',
    },

    // Section header styles
    sectionHeader: {
      // Blue theme (default)
      blue: {
        background: `linear-gradient(135deg, ${colors.blue[50]} 0%, ${colors.blue[100]} 100%)`,
        backgroundExpanded: `linear-gradient(135deg, ${colors.blue[500]} 0%, ${colors.blue[600]} 100%)`,
        border: colors.blue[200],
        iconBg: `linear-gradient(135deg, ${colors.blue[500]} 0%, ${colors.blue[600]} 100%)`,
        iconColor: colors.white,
        titleColor: colors.blue[800],
        titleColorExpanded: colors.white,
        subtitleColor: colors.blue[600],
      },
      // Cyan theme
      cyan: {
        background: `linear-gradient(135deg, ${colors.cyan[50]} 0%, ${colors.cyan[100]} 100%)`,
        backgroundExpanded: `linear-gradient(135deg, ${colors.cyan[500]} 0%, ${colors.cyan[600]} 100%)`,
        border: colors.cyan[200],
        iconBg: `linear-gradient(135deg, ${colors.cyan[500]} 0%, ${colors.cyan[600]} 100%)`,
        iconColor: colors.white,
        titleColor: colors.cyan[800],
        titleColorExpanded: colors.white,
        subtitleColor: colors.cyan[600],
      },
      // Indigo theme
      indigo: {
        background: `linear-gradient(135deg, ${colors.indigo[50]} 0%, ${colors.indigo[100]} 100%)`,
        backgroundExpanded: `linear-gradient(135deg, ${colors.indigo[500]} 0%, ${colors.indigo[600]} 100%)`,
        border: colors.indigo[200],
        iconBg: `linear-gradient(135deg, ${colors.indigo[500]} 0%, ${colors.indigo[600]} 100%)`,
        iconColor: colors.white,
        titleColor: colors.indigo[800],
        titleColorExpanded: colors.white,
        subtitleColor: colors.indigo[600],
      },
      // Green theme
      green: {
        background: `linear-gradient(135deg, ${colors.green[50]} 0%, ${colors.green[100]} 100%)`,
        backgroundExpanded: `linear-gradient(135deg, ${colors.green[500]} 0%, ${colors.green[600]} 100%)`,
        border: colors.green[200],
        iconBg: `linear-gradient(135deg, ${colors.green[500]} 0%, ${colors.green[600]} 100%)`,
        iconColor: colors.white,
        titleColor: colors.green[800],
        titleColorExpanded: colors.white,
        subtitleColor: colors.green[600],
      },
      // Violet/Purple theme
      violet: {
        background: `linear-gradient(135deg, ${colors.violet[50]} 0%, ${colors.violet[100]} 100%)`,
        backgroundExpanded: `linear-gradient(135deg, ${colors.violet[500]} 0%, ${colors.violet[600]} 100%)`,
        border: colors.violet[200],
        iconBg: `linear-gradient(135deg, ${colors.violet[500]} 0%, ${colors.violet[600]} 100%)`,
        iconColor: colors.white,
        titleColor: colors.violet[800],
        titleColorExpanded: colors.white,
        subtitleColor: colors.violet[600],
      },
    },

    // Modal styles
    modal: {
      paper: {
        background: colors.white,
        borderRadius: '12px',
        boxShadow: '0 16px 48px rgba(0, 0, 0, 0.2)',
      },
      header: {
        blue: `linear-gradient(135deg, ${colors.blue[500]} 0%, ${colors.blue[600]} 100%)`,
        cyan: `linear-gradient(135deg, ${colors.cyan[500]} 0%, ${colors.cyan[600]} 100%)`,
        indigo: `linear-gradient(135deg, ${colors.indigo[500]} 0%, ${colors.indigo[600]} 100%)`,
        green: `linear-gradient(135deg, ${colors.green[500]} 0%, ${colors.green[600]} 100%)`,
        violet: `linear-gradient(135deg, ${colors.violet[500]} 0%, ${colors.violet[600]} 100%)`,
        gray: `linear-gradient(135deg, ${colors.gray[700]} 0%, ${colors.gray[800]} 100%)`,
      },
      closeButton: {
        color: colors.white,
        hoverBg: 'rgba(255, 255, 255, 0.15)',
      },
      content: {
        background: colors.white,
        padding: '16px',
      },
    },

    // Table styles
    table: {
      headerBg: colors.slate[50],
      rowAltBg: colors.slate[25] || '#FCFCFD',
      rowHoverBg: colors.blue[50],
      borderColor: colors.slate[200],
      labelColor: colors.gray[700],
      valueColor: colors.gray[900],
    },

    // Badge/Chip styles
    badge: {
      blue: { bg: colors.blue[100], color: colors.blue[700], border: colors.blue[200] },
      cyan: { bg: colors.cyan[100], color: colors.cyan[700], border: colors.cyan[200] },
      green: { bg: colors.green[100], color: colors.green[700], border: colors.green[200] },
      orange: { bg: colors.orange[100], color: colors.orange[700], border: colors.orange[200] },
      red: { bg: colors.red[100], color: colors.red[700], border: colors.red[200] },
      gray: { bg: colors.gray[100], color: colors.gray[700], border: colors.gray[200] },
    },

    // Icon box styles
    iconBox: {
      size: { sm: 28, md: 32, lg: 40 },
      borderRadius: '8px',
      boxShadow: (color) => `0 2px 8px ${color}40`,
    },

    // Header gradient styles
    header: {
      gradient: gradients.header.navy,
      premium: `linear-gradient(135deg, ${colors.slate[800]} 0%, ${colors.slate[900]} 100%)`,
      blue: `linear-gradient(135deg, ${colors.blue[600]} 0%, ${colors.blue[700]} 100%)`,
      indigo: `linear-gradient(135deg, ${colors.indigo[600]} 0%, ${colors.indigo[700]} 100%)`,
    },

    // Loading states
    loading: {
      background: colors.slate[50],
      border: colors.slate[200],
      primary: colors.blue[600],
      spinnerColor: colors.blue[500],
    },

    // Empty/Error states
    states: {
      empty: {
        background: `${colors.slate[100]}80`,
        border: colors.slate[300],
        icon: colors.slate[400],
        text: colors.slate[600],
      },
      error: {
        background: `${colors.red[50]}80`,
        border: colors.red[300],
        icon: colors.red[500],
        text: colors.red[600],
      },
    },

    // Section-specific headers
    section: {
      flagHeader: colors.blue[600],
      ownerHeader: colors.blue[600],
      operatorHeader: colors.indigo[600],
      managerHeader: colors.violet[600],
      classHeader: colors.cyan[600],
    },

    // Chart colors
    chart: [colors.blue[800], colors.cyan[600], colors.indigo[700], colors.sky[700], colors.violet[700]],
    chartVibrant: ['#0EA5E9', '#06B6D4', '#10B981', '#F59E0B', '#F97316', '#EF4444', '#EC4899', '#8B5CF6', '#6366F1'],

    // Scrollbar styles
    scrollbar: {
      width: '4px',
      track: colors.slate[100],
      thumb: colors.slate[300],
      thumbHover: colors.slate[400],
    },

    // Transitions
    transition: {
      fast: 'all 0.15s ease',
      normal: 'all 0.25s ease',
      slow: 'all 0.35s ease',
    },
  },
};

// ============================================================================
// PROFILE CARD STYLE HELPERS
// ============================================================================

/**
 * Get section header styles by theme color
 * @param {string} theme - 'blue' | 'cyan' | 'indigo' | 'green' | 'violet'
 * @param {boolean} expanded - Whether section is expanded
 */
export const getSectionHeaderStyles = (theme = 'blue', expanded = false) => {
  const headerTheme = palette.profileCard.sectionHeader[theme] || palette.profileCard.sectionHeader.blue;
  return {
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      px: 2,
      py: 1.25,
      cursor: 'pointer',
      background: expanded ? headerTheme.backgroundExpanded : headerTheme.background,
      borderBottom: expanded ? 'none' : `1px solid ${headerTheme.border}`,
      transition: palette.profileCard.transition.normal,
    },
    iconBox: {
      width: 32,
      height: 32,
      borderRadius: '8px',
      background: expanded ? 'rgba(255, 255, 255, 0.25)' : headerTheme.iconBg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: expanded ? 'none' : `0 2px 8px ${headerTheme.border}`,
    },
    icon: {
      fontSize: '1.1rem',
      color: headerTheme.iconColor,
    },
    title: {
      fontSize: '0.875rem',
      fontWeight: 700,
      color: expanded ? headerTheme.titleColorExpanded : headerTheme.titleColor,
      letterSpacing: '-0.01em',
    },
    subtitle: {
      fontSize: '0.65rem',
      fontWeight: 500,
      color: expanded ? 'rgba(255, 255, 255, 0.8)' : headerTheme.subtitleColor,
      mt: 0.125,
    },
  };
};

/**
 * Get modal styles by theme color
 * @param {string} theme - 'blue' | 'cyan' | 'indigo' | 'green' | 'violet' | 'gray'
 */
export const getModalStyles = (theme = 'blue') => {
  const modal = palette.profileCard.modal;
  return {
    paper: {
      ...modal.paper,
    },
    header: {
      background: modal.header[theme] || modal.header.blue,
      px: 2,
      py: 1.5,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    closeButton: {
      color: modal.closeButton.color,
      p: 0.5,
      '&:hover': { background: modal.closeButton.hoverBg },
    },
    content: {
      ...modal.content,
    },
  };
};

// ============================================================================
// MUI PALETTE - DARK MODE
// ============================================================================

const darkBackground = {
  default: '#0D1117',
  paper: '#161B22',
  secondary: '#21262D',
  elevated: '#1C2128',
};

const darkText = {
  primary: '#E6EDF3',
  secondary: '#8B949E',
  disabled: '#484F58',
  inverse: '#0D1117',
  accent: '#58A6FF',
};

export const darkPalette = {
  mode: 'dark',

  primary: {
    main: colors.navy[400],
    light: colors.navy[300],
    dark: colors.navy[600],
    contrastText: colors.white,
    ...colors.navy,
  },

  secondary: {
    main: colors.cyan[400],
    light: colors.cyan[300],
    dark: colors.cyan[600],
    contrastText: colors.white,
    ...colors.cyan,
  },

  accent: {
    main: colors.indigo[400],
    light: colors.indigo[300],
    dark: colors.indigo[600],
    contrastText: colors.white,
    ...colors.indigo,
  },

  success: { main: '#3FB950', light: '#56D364', dark: '#238636', contrastText: colors.white },
  info: { main: '#58A6FF', light: '#79C0FF', dark: '#388BFD', contrastText: colors.white },
  error: { main: '#F85149', light: '#FF7B72', dark: '#DA3633', contrastText: colors.white },
  warning: { main: '#D29922', light: '#E3B341', dark: '#9E6A03', contrastText: colors.white },
  grey: colors.gray,
  text: darkText,

  action: {
    hover: 'rgba(177, 186, 196, 0.12)',
    selected: 'rgba(177, 186, 196, 0.16)',
    disabled: 'rgba(177, 186, 196, 0.3)',
    disabledBackground: 'rgba(177, 186, 196, 0.12)',
    focus: 'rgba(177, 186, 196, 0.2)',
    active: 'rgba(177, 186, 196, 0.24)',
  },

  background: {
    ...darkBackground,
    gradient: darkGradients.background,
    darkContrast: darkBackground.elevated,
    glass: 'rgba(22, 27, 34, 0.95)',
  },

  divider: '#30363D',

  common: { black: colors.black, white: colors.white },

  brand: {
    gradients: darkGradients,
    // Direct brand colors for sidebar and navigation (lighter for dark mode)
    cyan: colors.cyan[300],
    blue: colors.blue[400],
    indigo: colors.indigo[400],
    navy: colors.navy[400],
  },

  equipment: {
    ...palette.equipment,
    gray: { 50: '#0D1117', 100: '#161B22', 200: '#21262D', 400: '#484F58', 600: '#8B949E', 800: '#C9D1D9' },
    backgrounds: {
      blueTint: 'rgba(56, 139, 253, 0.08)',
      blueLight: 'rgba(56, 139, 253, 0.12)',
      cyanTint: 'rgba(63, 185, 80, 0.08)',
      indigoTint: 'rgba(163, 113, 247, 0.08)',
      page: '#0D1117',
    },
  },

  militaryGroup: {
    ...palette.militaryGroup,
    backgrounds: {
      page: '#0D1117',
      card: '#161B22',
      blueTint: 'rgba(56, 139, 253, 0.08)',
      indigoTint: 'rgba(163, 113, 247, 0.08)',
      cyanTint: 'rgba(56, 139, 253, 0.08)',
    },
    text: {
      primary: '#E6EDF3',
      secondary: '#8B949E',
      muted: '#6E7681',
      blueHeading: '#79C0FF',
      indigoHeading: '#D2A8FF',
      cyanHeading: '#A5D6FF',
      label: '#C9D1D9',
    },
  },

  dashboard: {
    ...palette.dashboard,
    background: {
      default: '#0D1117',
      surface: '#161B22',
      surfaceHover: '#1C2128',
    },
    text: {
      primary: '#E6EDF3',
      secondary: '#8B949E',
      tertiary: '#6E7681',
      muted: '#484F58',
      inverse: '#0D1117',
    },
  },
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get color with custom opacity
 * @param {string} color - Hex color
 * @param {number} opacity - Opacity value (0-1)
 * @returns {string} RGBA color
 */
export const withOpacity = (color, opacity) => {
  if (!color) return `rgba(0, 0, 0, ${opacity})`;
  const colorStr = String(color);

  if (colorStr.startsWith('rgb')) {
    const match = colorStr.match(/\d+/g);
    if (match?.length >= 3) {
      return `rgba(${match[0]}, ${match[1]}, ${match[2]}, ${opacity})`;
    }
  }

  if (colorStr.startsWith('#')) {
    const r = parseInt(colorStr.slice(1, 3), 16);
    const g = parseInt(colorStr.slice(3, 5), 16);
    const b = parseInt(colorStr.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }

  return colorStr;
};

/**
 * Quick access to color shades
 */
export const getColor = (colorName, shade = 500) => colors[colorName]?.[shade];
export const blue = (shade) => colors.blue[shade];
export const indigo = (shade) => colors.indigo[shade];
export const cyan = (shade) => colors.cyan[shade];
export const gray = (shade) => colors.gray[shade];
export const navy = (shade) => colors.navy[shade];

// Backward compatibility exports
export const primaryPalette = colors.navy;
export const secondaryPalette = colors.cyan;
export const accentPalette = colors.indigo;
export const equipmentColors = palette.equipment;
export const militaryGroupColors = palette.militaryGroup;
export const profileCardColors = palette.profileCard;

export default palette;
