/**
 * Unified Theme Configuration - Single Source of Truth
 *
 * This is the ONLY theme file that creates MUI themes for the application.
 *
 * Usage:
 *   import { getTheme, theme } from '@/theme';
 *   const theme = getTheme(mode); // mode = 'light' | 'dark'
 */

import { createTheme } from '@mui/material/styles';
import { palette, darkPalette, gradients, darkGradients, colors, profileCardColors, getSectionHeaderStyles, getModalStyles } from './palette';
import { tokens, typography, shadows, darkShadows, responsiveTypography, typographyMixins } from './tokens';
import { getComponents } from './components';

// ============================================================================
// EQUIPMENT INFO CARD STYLES (moved from componentStyles.js)
// ============================================================================

export const equipmentInfoCardStyles = {
  // Equipment Type & Role Section Styles
  equipmentTypeRole: {
    container: {
      gap: 2,
    },
    card: {
      borderRadius: '12px',
      boxShadow: '0 3px 12px',
    },
    header: {
      px: 1.5,
      py: 1,
      gap: 1,
      iconBox: {
        width: 32,
        height: 32,
        borderRadius: '8px',
      },
      icon: {
        fontSize: '18px',
      },
      title: {
        fontWeight: 700,
        fontSize: '0.9rem',
        lineHeight: 1.2,
        letterSpacing: '-0.01em',
      },
      subtitle: {
        fontSize: '0.7rem',
        fontWeight: 500,
      },
    },
    content: {
      px: 1.5,
      py: 1.5,
      minHeight: '90px',
      maxHeight: '140px',
    },
    type: {
      background: 'linear-gradient(135deg, rgba(238, 242, 255, 0.94) 0%, rgba(224, 231, 255, 0.96) 100%)',
      headerBackground: 'linear-gradient(135deg, rgba(238, 242, 255, 0.95) 0%, rgba(224, 231, 255, 0.98) 100%)',
      border: '1px solid rgba(99, 102, 241, 0.15)',
      boxShadow: '0 3px 12px rgba(99, 102, 241, 0.1)',
      borderBottom: '1px solid rgba(99, 102, 241, 0.12)',
      iconGradient: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)',
      iconBorder: '1px solid rgba(99, 102, 241, 0.2)',
      titleColor: '#3730a3',
      subtitleColor: '#6366f1',
      scrollbarThumb: 'rgba(99, 102, 241, 0.2)',
    },
    role: {
      background: 'linear-gradient(135deg, rgba(239, 246, 255, 0.94) 0%, rgba(219, 234, 254, 0.96) 100%)',
      headerBackground: 'linear-gradient(135deg, rgba(239, 246, 255, 0.95) 0%, rgba(219, 234, 254, 0.98) 100%)',
      border: '1px solid rgba(59, 130, 246, 0.15)',
      boxShadow: '0 3px 12px rgba(59, 130, 246, 0.1)',
      borderBottom: '1px solid rgba(59, 130, 246, 0.12)',
      iconGradient: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
      iconBorder: '1px solid rgba(59, 130, 246, 0.2)',
      titleColor: '#1e3a8a',
      subtitleColor: '#3b82f6',
      scrollbarThumb: 'rgba(59, 130, 246, 0.2)',
    },
    item: {
      minWidth: 56,
      py: 0.75,
      px: 0.5,
      borderRadius: '8px',
      iconBox: {
        width: 26,
        height: 26,
        borderRadius: '6px',
      },
      label: {
        fontSize: '0.58rem',
        fontWeight: 600,
        lineHeight: 1.1,
        maxWidth: '52px',
      },
    },
  },
  familyBoxes: {
    overallFamily: {
      background: `linear-gradient(135deg, ${colors.white} 0%, ${colors.sky[50]} 100%)`,
      boxShadow: '0 2px 8px rgba(3,105,161,0.08)',
      border: `1px solid ${colors.sky[200]}`,
      borderLeft: `3px solid #0369A1`,
      hoverBoxShadow: `0 6px 16px rgba(3,105,161,0.15)`,
      iconBg: 'rgba(3,105,161,0.1)',
      iconBorder: `1px solid rgba(3,105,161,0.2)`,
      iconColor: '#0369A1',
      labelColor: '#0369A1',
      valueColor: '#075985',
    },
    inFamily: {
      background: `linear-gradient(135deg, ${colors.white} 0%, ${colors.sky[50]} 100%)`,
      boxShadow: '0 2px 8px rgba(3,105,161,0.08)',
      border: `1px solid ${colors.sky[200]}`,
      borderLeft: `3px solid #0369A1`,
      hoverBoxShadow: `0 6px 16px rgba(3,105,161,0.15)`,
      iconBg: 'rgba(3,105,161,0.1)',
      iconBorder: `1px solid rgba(3,105,161,0.2)`,
      iconColor: '#0369A1',
      labelColor: '#0369A1',
      valueColor: '#075985',
    },
    parent: {
      background: `linear-gradient(135deg, ${colors.white} 0%, ${colors.sky[50]} 100%)`,
      boxShadow: '0 2px 8px rgba(3,105,161,0.08)',
      border: `1px solid ${colors.sky[200]}`,
      borderLeft: `3px solid #0369A1`,
      hoverBoxShadow: `0 6px 16px rgba(3,105,161,0.15)`,
      iconBg: 'rgba(3,105,161,0.1)',
      iconBorder: `1px solid rgba(3,105,161,0.2)`,
      iconColor: '#0369A1',
      labelColor: '#0369A1',
      valueColor: '#075985',
    },
    derived: {
      background: `linear-gradient(135deg, ${colors.white} 0%, ${colors.sky[50]} 100%)`,
      boxShadow: '0 2px 8px rgba(3,105,161,0.08)',
      border: `1px solid ${colors.sky[200]}`,
      borderLeft: `3px solid #0369A1`,
      hoverBoxShadow: `0 6px 16px rgba(3,105,161,0.15)`,
      iconBg: 'rgba(3,105,161,0.1)',
      iconBorder: `1px solid rgba(3,105,161,0.2)`,
      iconColor: '#0369A1',
      labelColor: '#0369A1',
      valueColor: '#075985',
    },
  },
  overlays: {
    glossHighlight: 'linear-gradient(180deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 100%)',
    lightOverlay: 'linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 50%)',
  },
  newsProfile: {
    background: `linear-gradient(145deg, ${colors.sky[500]} 0%, ${colors.sky[600]} 50%, ${colors.sky[700]} 100%)`,
    border: `1px solid ${colors.sky[500]}4D`,
    boxShadow: `0 4px 16px ${colors.sky[500]}40`,
    hoverBoxShadow: `0 10px 28px ${colors.sky[500]}59`,
    iconBg: 'rgba(255, 255, 255, 0.2)',
    iconShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    textColor: colors.white,
  },
  techSpecs: {
    titleColor: '#0369A1',
    measurements: {
      background: colors.white,
      border: `1px solid ${colors.slate[200]}`,
      hoverBoxShadow: `0 4px 12px rgba(3,105,161,0.15)`,
      boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
      iconBg: 'rgba(3,105,161,0.12)',
      iconColor: '#0369A1',
      labelColor: '#0369A1',
      valueColor: '#075985',
    },
    performance: {
      background: colors.white,
      border: `1px solid ${colors.slate[200]}`,
      hoverBoxShadow: `0 4px 12px rgba(3,105,161,0.15)`,
      boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
      iconBg: 'rgba(3,105,161,0.12)',
      iconColor: '#0369A1',
      labelColor: '#0369A1',
      valueColor: '#075985',
    },
    attributes: {
      background: colors.white,
      border: `1px solid ${colors.slate[200]}`,
      hoverBoxShadow: `0 4px 12px rgba(3,105,161,0.15)`,
      boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
      iconBg: 'rgba(3,105,161,0.12)',
      iconColor: '#0369A1',
      labelColor: '#0369A1',
      valueColor: '#075985',
    },
  },
  additionalDetails: {
    background: colors.white,
    headerBg: colors.indigo[100],
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
    border: `1px solid ${colors.indigo[200]}`,
    borderBottom: `1px solid ${colors.indigo[200]}`,
    iconBg: `${colors.indigo[500]}20`,
    iconBorder: `1px solid ${colors.indigo[300]}`,
    iconColor: colors.indigo[600],
    titleColor: colors.indigo[700],
    subtitleColor: colors.indigo[500],
    expandIconColor: colors.indigo[500],
    itemBg: colors.slate[50],
    itemBgHover: colors.indigo[50],
    itemBorder: `1px solid ${colors.slate[200]}`,
    itemBorderLeft: `3px solid ${colors.indigo[400]}`,
    itemLabelColor: colors.indigo[600],
    itemValueColor: colors.slate[800],
  },
  cards: {
    white: {
      background: colors.white,
      boxShadow: '0 2px 14px 0 rgba(32, 40, 45, 0.08)',
      hoverBoxShadow: '0 4px 20px 0 rgba(32, 40, 45, 0.12)',
      borderBottom: `1px solid ${colors.gray[100]}`,
    },
    map: {
      border: `1px solid ${colors.slate[100]}`,
      background: colors.slate[50],
    },
  },
  ui: {
    expandIconColor: colors.slate[500],
    emptyIconColor: colors.gray[300],
    emptyTextColor: colors.gray[400],
    scrollbarThumb: colors.gray[300],
    scrollbarThumbHover: colors.gray[400],
  },
  modals: {
    paper: {
      ...profileCardColors.modal.paper,
    },
    closeButton: {
      ...profileCardColors.modal.closeButton,
    },
    measurements: {
      headerBg: profileCardColors.modal.header.indigo,
      rowAltBg: colors.indigo[50],
      labelColor: colors.indigo[600],
      valueColor: profileCardColors.table.valueColor,
      emptyIconColor: colors.indigo[300],
      emptyTextColor: profileCardColors.text.tertiary,
    },
    performance: {
      headerBg: profileCardColors.modal.header.blue,
      rowAltBg: colors.blue[50],
      labelColor: colors.blue[600],
      valueColor: profileCardColors.table.valueColor,
      emptyIconColor: colors.blue[300],
      emptyTextColor: profileCardColors.text.tertiary,
    },
    attributes: {
      headerBg: profileCardColors.modal.header.cyan,
      rowAltBg: colors.cyan[50],
      labelColor: colors.cyan[600],
      valueColor: profileCardColors.table.valueColor,
      emptyIconColor: colors.cyan[300],
      emptyTextColor: profileCardColors.text.tertiary,
    },
  },
  glassCard: {
    light: {
      background: `linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, ${colors.slate[50]}F2 50%, ${colors.blue[50]}EB 100%)`,
    },
  },
  eventProfile: {
    modal: {
      background: colors.white,
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    },
    header: {
      background: `linear-gradient(135deg, #0369A1 0%, #075985 100%)`,
      iconBg: 'rgba(255, 255, 255, 0.15)',
      textColor: colors.white,
    },
    card: {
      background: colors.white,
      border: `1px solid ${colors.slate[200]}`,
      borderLeft: `4px solid #0369A1`,
      boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
      hoverBoxShadow: '0 4px 12px rgba(3,105,161,0.15)',
    },
    badge: {
      military: {
        background: `${colors.red[500]}15`,
        color: colors.red[600],
        border: `1px solid ${colors.red[200]}`,
      },
      force: {
        background: `${colors.blue[500]}15`,
        color: colors.blue[600],
        border: `1px solid ${colors.blue[200]}`,
      },
    },
    date: {
      background: `rgba(3,105,161,0.08)`,
      color: '#0369A1',
      iconColor: '#0369A1',
    },
    title: {
      color: '#075985',
    },
    description: {
      color: colors.slate[600],
    },
    empty: {
      iconColor: colors.slate[300],
      textColor: colors.slate[400],
    },
    scrollbar: {
      thumb: colors.slate[300],
      thumbHover: colors.slate[400],
    },
  },
};

// ============================================================================
// IMO PROFILE CARD STYLES
// ============================================================================

export const imoProfileCardStyles = {
  // Search box styles
  searchBox: {
    container: {
      background: colors.white,
      borderRadius: '8px',
    },
    input: {
      borderRadius: '8px',
      background: 'transparent',
      fontSize: '0.95rem',
      minHeight: '44px',
    },
  },

  // Section card styles
  sectionCard: {
    background: colors.white,
    borderRadius: '10px',
    border: `2px solid ${colors.blue[100]}`,
    boxShadow: '0 2px 8px rgba(59, 130, 246, 0.08)',
  },

  // Owner/Operator type styles
  ownerTypes: {
    registered_owner: {
      bg: `linear-gradient(135deg, ${colors.blue[100]} 0%, ${colors.blue[200]} 100%)`,
      color: colors.blue[700],
      border: colors.blue[300],
    },
    operated_by_company: {
      bg: `linear-gradient(135deg, ${colors.sky[100]} 0%, ${colors.sky[200]} 100%)`,
      color: colors.sky[700],
      border: colors.sky[300],
    },
    ship_manager: {
      bg: `linear-gradient(135deg, ${colors.indigo[100]} 0%, ${colors.indigo[200]} 100%)`,
      color: colors.indigo[700],
      border: colors.indigo[300],
    },
    technical_manager: {
      bg: `linear-gradient(135deg, ${colors.blue[50]} 0%, ${colors.blue[100]} 100%)`,
      color: colors.blue[600],
      border: colors.blue[300],
    },
    default: {
      bg: `linear-gradient(135deg, ${colors.gray[100]} 0%, ${colors.gray[200]} 100%)`,
      color: colors.gray[600],
      border: colors.gray[300],
    },
  },

  // Flag state section
  flagState: {
    container: {
      background: colors.white,
      borderRadius: '10px',
      border: `2px solid ${colors.green[100]}`,
      boxShadow: '0 2px 8px rgba(34, 197, 94, 0.1)',
    },
    iconBox: {
      width: 48,
      height: 48,
      borderRadius: '12px',
      bgcolor: profileCardColors.background.subtle,
    },
  },

  // Technical specifications
  techSpecs: {
    container: {
      background: colors.white,
      borderRadius: '10px',
      border: `2px solid ${colors.blue[100]}`,
      boxShadow: '0 2px 8px rgba(59, 130, 246, 0.1)',
    },
    header: {
      borderBottom: `1px solid ${colors.sky[200]}`,
    },
    itemBg: profileCardColors.background.hover,
    itemBorder: profileCardColors.border.default,
    itemHoverBg: profileCardColors.blue.hover,
  },

  // Vessel info cards
  vesselInfo: {
    card: {
      background: colors.white,
      borderRadius: '10px',
      border: `1px solid ${colors.slate[200]}`,
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
    },
    iconBox: {
      width: 36,
      height: 36,
      borderRadius: '10px',
    },
    iconColors: {
      blue: { bg: colors.blue[100], color: colors.blue[600] },
      cyan: { bg: colors.cyan[100], color: colors.cyan[600] },
      teal: { bg: colors.teal[100], color: colors.teal[600] },
      orange: { bg: colors.orange[100], color: colors.orange[600] },
      red: { bg: colors.red[100], color: colors.red[600] },
    },
  },

  // Port calling trend
  portTrend: {
    container: {
      background: colors.white,
      borderRadius: '10px',
      border: `1px solid ${colors.slate[200]}`,
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
    },
    header: {
      background: `linear-gradient(135deg, ${colors.blue[600]} 0%, ${colors.blue[700]} 100%)`,
    },
    chartColors: profileCardColors.chartVibrant,
  },

  // Scrollbar styles
  scrollbar: {
    track: colors.blue[50],
    thumb: colors.blue[300],
    thumbHover: colors.blue[400],
    borderRadius: '4px',
  },

  // Common text colors
  text: {
    primary: colors.gray[900],
    secondary: colors.gray[600],
    muted: colors.gray[500],
    accent: colors.blue[600],
  },
};

// ============================================================================
// PORT PROFILE CARD STYLES
// ============================================================================

export const portProfileCardStyles = {
  // Section card styles
  sectionCard: {
    background: colors.white,
    borderRadius: '10px',
    border: `1px solid ${colors.slate[200]}`,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
  },

  // Port identifiers section
  identifiers: {
    header: {
      background: `linear-gradient(135deg, ${colors.blue[50]} 0%, ${colors.blue[100]} 100%)`,
      border: colors.blue[200],
      iconBg: `linear-gradient(135deg, ${colors.blue[500]} 0%, ${colors.blue[600]} 100%)`,
      iconColor: colors.white,
      titleColor: colors.blue[800],
    },
  },

  // Port country section
  country: {
    header: {
      background: `linear-gradient(135deg, ${colors.cyan[50]} 0%, ${colors.cyan[100]} 100%)`,
      border: colors.cyan[200],
      iconBg: `linear-gradient(135deg, ${colors.cyan[500]} 0%, ${colors.cyan[600]} 100%)`,
      iconColor: colors.white,
      titleColor: colors.cyan[800],
    },
  },

  // Vessel type trend
  vesselTrend: {
    container: {
      background: colors.white,
      borderRadius: '10px',
      border: `1px solid ${colors.slate[200]}`,
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
    },
    chartColors: profileCardColors.chartVibrant,
  },

  // Scrollbar styles
  scrollbar: {
    track: colors.slate[100],
    thumb: colors.slate[300],
    thumbHover: colors.slate[400],
    borderRadius: '4px',
  },
};

// ============================================================================
// INSTALLATION PROFILE CARD STYLES
// ============================================================================

export const installationProfileCardStyles = {
  // Section card styles
  sectionCard: {
    background: colors.white,
    borderRadius: '14px',
    border: `1px solid ${colors.emerald ? colors.emerald[200] : '#a7f3d0'}`,
    boxShadow: '0 2px 12px rgba(5, 150, 105, 0.08)',
  },

  // Infrastructure section
  infrastructure: {
    header: {
      background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
      iconBg: 'rgba(255,255,255,0.2)',
      iconColor: colors.white,
      titleColor: colors.white,
    },
    item: {
      background: colors.white,
      border: '#d1fae5',
      hoverBg: '#ecfdf5',
      hoverBorder: '#059669',
    },
  },

  // Military affiliation section
  militaryAffiliation: {
    header: {
      background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
      iconBg: 'rgba(255,255,255,0.2)',
      iconColor: colors.white,
      titleColor: colors.white,
    },
    item: {
      background: colors.white,
      border: '#fee2e2',
      hoverBg: '#fef2f2',
      hoverBorder: '#dc2626',
    },
  },

  // Location section
  location: {
    header: {
      background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
      iconBg: 'rgba(255,255,255,0.2)',
      iconColor: colors.white,
      titleColor: colors.white,
    },
    item: {
      background: '#f0f9ff',
      border: '#bae6fd',
    },
  },

  // Info cards
  infoCards: {
    types: {
      name: { color: '#059669', bgColor: '#d1fae5' },
      type: { color: '#7c3aed', bgColor: '#ede9fe' },
      use: { color: '#dc2626', bgColor: '#fee2e2' },
      status: { color: '#0284c7', bgColor: '#e0f2fe' },
      coordinates: { color: '#ea580c', bgColor: '#ffedd5' },
      confidence: { color: '#0891b2', bgColor: '#cffafe' },
    },
  },

  // Scrollbar styles
  scrollbar: {
    track: '#f0fdf4',
    thumb: '#6ee7b7',
    thumbHover: '#34d399',
    borderRadius: '4px',
  },

  // Premium header (green theme)
  premiumHeader: {
    background: 'linear-gradient(135deg, #059669 0%, #047857 50%, #065f46 100%)',
    boxShadow: '0 8px 28px -8px rgba(5, 150, 105, 0.3), 0 4px 16px -4px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
  },
};

// ============================================================================
// ORGANIZATION PROFILE CARD STYLES
// ============================================================================

export const organizationProfileCardStyles = {
  // Search box styles
  searchBox: {
    container: {
      background: colors.white,
      borderRadius: '8px',
    },
    icon: {
      color: colors.navy[600],
      fontSize: 20,
    },
    loadingSpinner: {
      color: colors.blue[500],
    },
    input: {
      color: colors.slate[800],
      placeholderColor: colors.slate[500],
      clearIndicator: colors.slate[500],
    },
    option: {
      labelColor: colors.slate[800],
      sublabelColor: colors.slate[500],
    },
  },

  // Header premium gradient
  header: {
    gradient: `linear-gradient(135deg, ${colors.navy[600]} 0%, ${colors.navy[700]} 50%, ${colors.navy[800]} 100%)`,
    boxShadow: `0 8px 32px ${colors.navy[700]}40, 0 4px 16px rgba(0,0,0,0.1)`,
    decorativeGradient: `radial-gradient(circle at 100% 0%, ${colors.indigo[500]}26 0%, transparent 50%)`,
    backgroundGradient: 'linear-gradient(180deg, #e8eff7 0%, #f0f5fa 100%)',
  },

  // Core information section
  coreInfo: {
    background: colors.white,
    borderRadius: '12px',
    border: `1px solid ${colors.slate[300]}`,
    headerGradient: `linear-gradient(135deg, ${colors.navy[500]} 0%, ${colors.navy[600]} 100%)`,
    iconBoxBg: 'rgba(255, 255, 255, 0.2)',
    iconColor: colors.white,
    titleColor: colors.white,
  },

  // Info card styles (for individual data fields)
  infoCard: {
    background: colors.slate[50],
    borderRadius: '8px',
    padding: '10px 12px',
    iconBox: {
      size: 28,
      borderRadius: '6px',
      background: `linear-gradient(135deg, ${colors.navy[500]} 0%, ${colors.navy[600]} 100%)`,
      boxShadow: `0 2px 6px ${colors.navy[500]}40`,
    },
    label: {
      fontSize: '0.6rem',
      fontWeight: 600,
      color: colors.gray[500],
      textTransform: 'uppercase',
      letterSpacing: '0.03em',
    },
    value: {
      fontSize: '0.75rem',
      fontWeight: 600,
      color: colors.gray[800],
    },
    subValue: {
      fontSize: '0.65rem',
      fontWeight: 500,
      color: colors.gray[500],
    },
  },

  // Also known as / Synonym section
  synonymSection: {
    background: colors.slate[100],
    border: `1px solid ${colors.slate[200]}`,
    borderRadius: '8px',
    iconColor: colors.slate[500],
    labelColor: colors.gray[500],
    valueColor: colors.gray[900],
  },

  // Legal name section
  legalNameSection: {
    background: colors.blue[50],
    border: `1px solid ${colors.blue[200]}`,
    borderRadius: '8px',
    iconColor: colors.blue[500],
    labelColor: colors.gray[500],
    valueColor: colors.gray[900],
  },

  // Org hierarchy cards (Head/Parent organization)
  orgHierarchy: {
    violet: {
      bg: colors.violet[50],
      borderColor: colors.violet[200],
      iconColor: colors.violet[500],
      labelColor: colors.violet[700],
      dotColor: colors.violet[400],
    },
    blue: {
      bg: colors.blue[50],
      borderColor: colors.blue[200],
      iconColor: colors.blue[500],
      labelColor: colors.blue[700],
      dotColor: colors.blue[400],
    },
    itemColor: colors.gray[900],
    noDataColor: colors.gray[400],
  },

  // Address section
  address: {
    background: colors.slate[50],
    borderRadius: '8px',
    padding: '10px 12px',
    iconColor: colors.slate[500],
    labelColor: colors.gray[500],
    valueColor: colors.gray[800],
  },

  // Geographic location section
  location: {
    containerBg: colors.white,
    border: `1px solid ${colors.slate[200]}`,
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.04)',
    headerGradient: `linear-gradient(135deg, ${colors.cyan[500]} 0%, ${colors.cyan[600]} 100%)`,
    iconBoxBg: 'rgba(255, 255, 255, 0.25)',
    iconColor: colors.white,
    titleColor: colors.white,
    coordBg: colors.cyan[50],
    coordBorder: `1px solid ${colors.cyan[100]}`,
    coordLabelColor: colors.cyan[700],
    coordValueColor: colors.cyan[800],
    countryBg: colors.cyan[50],
    countryBorder: `1px solid ${colors.cyan[200]}`,
    countryIconBg: `linear-gradient(135deg, ${colors.cyan[500]} 0%, ${colors.cyan[600]} 100%)`,
    countryLabelColor: colors.cyan[800],
  },

  // Products & Equipment section
  products: {
    containerBg: colors.white,
    border: `1px solid ${colors.slate[200]}`,
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.04)',
    headerGradient: `linear-gradient(135deg, ${colors.indigo[500]} 0%, ${colors.indigo[600]} 100%)`,
    iconBoxBg: 'rgba(255, 255, 255, 0.25)',
    iconColor: colors.white,
    titleColor: colors.white,
    countBadgeBg: colors.cyan[500],
    countBadgeColor: colors.white,
    typeHeaderColor: colors.gray[800],
    typeCountBg: colors.cyan[50],
    typeCountColor: colors.cyan[600],
    itemBg: 'transparent',
    itemHoverBg: colors.indigo[50],
    itemDotColor: colors.indigo[400],
    itemTextColor: colors.gray[800],
    expandIconColor: colors.indigo[500],
    expandIconInactiveColor: colors.indigo[400],
  },

  // Partners section
  partners: {
    containerBg: colors.white,
    border: `1px solid ${colors.slate[200]}`,
    borderRadius: '10px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
    headerGradient: `linear-gradient(135deg, ${colors.violet[500]} 0%, ${colors.violet[600]} 100%)`,
    iconBoxBg: 'rgba(255, 255, 255, 0.2)',
    iconColor: colors.white,
    titleColor: colors.white,
    subtitleColor: 'rgba(255,255,255,0.8)',
    scrollbarThumb: colors.violet[200],
    scrollbarThumbHover: colors.violet[300],
    itemBg: colors.violet[50],
    itemBorder: `1px solid ${colors.violet[100]}`,
    itemHoverBg: colors.violet[100],
    itemIconBg: `linear-gradient(135deg, ${colors.violet[400]} 0%, ${colors.violet[500]} 100%)`,
    itemTextColor: colors.violet[700],
    emptyIconColor: colors.violet[300],
    emptyTextColor: colors.slate[500],
  },

  // Last modified date badge
  lastModified: {
    background: `linear-gradient(135deg, ${colors.green[50]} 0%, ${colors.green[100]} 100%)`,
    border: `1px solid ${colors.green[200]}`,
    boxShadow: `0 1px 3px ${colors.green[600]}14`,
    iconColor: colors.green[600],
    labelColor: colors.green[700],
    valueColor: colors.green[800],
  },

  // Action buttons (News, Event, Map)
  actionButtons: {
    news: {
      background: `linear-gradient(135deg, ${colors.cyan[600]} 0%, ${colors.cyan[500]} 50%, ${colors.cyan[400]} 100%)`,
      hoverBackground: `linear-gradient(135deg, ${colors.cyan[700]} 0%, ${colors.cyan[600]} 50%, ${colors.cyan[500]} 100%)`,
      boxShadow: `0 4px 16px ${colors.cyan[600]}4D, inset 0 1px 0 rgba(255, 255, 255, 0.2)`,
      hoverBoxShadow: `0 12px 32px ${colors.cyan[600]}73, inset 0 1px 0 rgba(255, 255, 255, 0.25)`,
      iconBg: 'rgba(255, 255, 255, 0.25)',
      textColor: colors.white,
    },
    event: {
      background: `linear-gradient(135deg, ${colors.indigo[600]} 0%, ${colors.indigo[500]} 50%, ${colors.indigo[400]} 100%)`,
      hoverBackground: `linear-gradient(135deg, ${colors.indigo[700]} 0%, ${colors.indigo[600]} 50%, ${colors.indigo[500]} 100%)`,
      boxShadow: `0 4px 16px ${colors.indigo[500]}4D, inset 0 1px 0 rgba(255, 255, 255, 0.2)`,
      hoverBoxShadow: `0 12px 32px ${colors.indigo[500]}73, inset 0 1px 0 rgba(255, 255, 255, 0.25)`,
      iconBg: 'rgba(255, 255, 255, 0.25)',
      textColor: colors.white,
    },
    map: {
      background: `linear-gradient(135deg, ${colors.blue[900]} 0%, ${colors.blue[800]} 50%, ${colors.blue[500]} 100%)`,
      hoverBackground: `linear-gradient(135deg, ${colors.blue[900]} 0%, ${colors.blue[700]} 50%, ${colors.blue[600]} 100%)`,
      boxShadow: `0 4px 16px ${colors.blue[800]}4D, inset 0 1px 0 rgba(255, 255, 255, 0.2)`,
      hoverBoxShadow: `0 12px 32px ${colors.blue[800]}73, inset 0 1px 0 rgba(255, 255, 255, 0.25)`,
      iconBg: 'rgba(255, 255, 255, 0.25)',
      textColor: colors.white,
    },
    mapActive: {
      background: `linear-gradient(135deg, ${colors.blue[900]} 0%, ${colors.blue[800]} 50%, ${colors.blue[600]} 100%)`,
      hoverBackground: `linear-gradient(135deg, #172554 0%, ${colors.blue[900]} 50%, ${colors.blue[800]} 100%)`,
      boxShadow: `0 6px 20px ${colors.blue[800]}80, inset 0 1px 0 rgba(255, 255, 255, 0.3)`,
      border: '2px solid rgba(255, 255, 255, 0.5)',
      iconBg: 'rgba(255, 255, 255, 0.35)',
      textColor: colors.white,
    },
  },

  // Modal styles (News, Event)
  modals: {
    backdrop: {
      backgroundColor: 'rgba(15, 23, 42, 0.6)',
      backdropFilter: 'blur(4px)',
    },
    paper: {
      background: colors.white,
      borderRadius: '20px',
      boxShadow: '0 25px 80px rgba(0,0,0,0.25)',
    },
    news: {
      headerGradient: `linear-gradient(135deg, ${colors.cyan[500]} 0%, ${colors.cyan[600]} 100%)`,
      iconColor: colors.white,
      titleColor: colors.white,
      subtitleColor: 'rgba(255,255,255,0.85)',
    },
    event: {
      headerGradient: `linear-gradient(135deg, ${colors.indigo[500]} 0%, ${colors.indigo[600]} 100%)`,
      iconColor: colors.white,
      titleColor: colors.white,
      subtitleColor: 'rgba(255,255,255,0.85)',
    },
    closeButton: {
      color: colors.white,
      background: 'rgba(255,255,255,0.15)',
      hoverBackground: 'rgba(255,255,255,0.25)',
    },
  },

  // Map expanded section
  mapSection: {
    containerBg: colors.white,
    containerBorder: `1px solid ${colors.blue[800]}33`,
    containerShadow: `0 4px 20px ${colors.blue[800]}1F, 0 1px 3px rgba(0,0,0,0.05)`,
    headerBg: `linear-gradient(135deg, ${colors.blue[800]}14 0%, ${colors.blue[500]}0A 100%)`,
    headerBorder: `1px solid ${colors.blue[800]}1A`,
    iconBoxBg: `linear-gradient(135deg, ${colors.blue[900]} 0%, ${colors.blue[800]} 100%)`,
    iconBoxShadow: `0 2px 8px ${colors.blue[800]}4D`,
    closeButtonBg: `${colors.blue[800]}14`,
    closeButtonHoverBg: `${colors.blue[800]}26`,
    primary: colors.blue[800],
  },

  // Scrollbar styles
  scrollbar: {
    width: '4px',
    track: 'transparent',
    thumb: colors.slate[300],
    thumbHover: colors.slate[400],
    borderRadius: '2px',
  },

  // Loading/Empty states
  states: {
    loading: {
      background: colors.white,
      border: `1px solid ${colors.slate[300]}`,
      spinnerColor: colors.blue[600],
      textColor: colors.slate[500],
    },
    empty: {
      iconColor: colors.slate[300],
      textColor: colors.slate[500],
    },
  },

  // Common text colors
  text: {
    primary: colors.slate[900],
    secondary: colors.slate[600],
    muted: colors.slate[500],
    light: colors.white,
    accent: colors.blue[600],
  },

  // Common overlays
  overlays: {
    white10: 'rgba(255, 255, 255, 0.1)',
    white15: 'rgba(255, 255, 255, 0.15)',
    white20: 'rgba(255, 255, 255, 0.2)',
    white25: 'rgba(255, 255, 255, 0.25)',
    white30: 'rgba(255, 255, 255, 0.3)',
    white80: 'rgba(255, 255, 255, 0.8)',
    black5: 'rgba(0, 0, 0, 0.05)',
    black10: 'rgba(0, 0, 0, 0.1)',
    black20: 'rgba(0, 0, 0, 0.2)',
  },
};

// ============================================================================
// NSAG ACTOR PROFILE CARD STYLES
// ============================================================================

export const nsagActorProfileCardStyles = {
  // Page container
  pageContainer: {
    background: `linear-gradient(135deg, ${colors.slate[100]} 0%, ${colors.slate[200]} 100%)`,
    borderRadius: '12px',
  },

  // Search box styles
  searchBox: {
    container: {
      background: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '8px',
      padding: '4px 8px',
      border: '1px solid rgba(255, 255, 255, 0.5)',
      boxShadow: '0 2px 12px rgba(39, 70, 104, 0.12)',
      hoverBackground: 'rgba(255, 255, 255, 0.98)',
    },
  },

  // Main content card
  contentCard: {
    background: `linear-gradient(180deg, ${colors.white} 0%, rgba(238, 242, 255, 0.5) 100%)`,
    borderRadius: '20px',
    border: `1px solid rgba(199, 210, 254, 0.6)`,
    boxShadow: `0 4px 6px -1px rgba(99, 102, 241, 0.08),
                0 10px 15px -3px rgba(99, 102, 241, 0.1),
                0 20px 25px -5px rgba(15, 23, 42, 0.08),
                inset 0 1px 0 rgba(255, 255, 255, 0.8)`,
  },

  // Decorative elements
  decorative: {
    topRight: {
      background: `radial-gradient(circle, rgba(199, 210, 254, 0.3) 0%, transparent 70%)`,
    },
    bottomLeft: {
      background: `radial-gradient(circle, rgba(191, 219, 254, 0.2) 0%, transparent 70%)`,
    },
  },

  // Section header
  sectionHeader: {
    background: `linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(59, 130, 246, 0.03) 100%)`,
    borderBottom: `1px solid rgba(199, 210, 254, 0.5)`,
    iconBox: {
      width: 44,
      height: 44,
      borderRadius: '12px',
      background: `linear-gradient(135deg, ${colors.indigo[500]} 0%, ${colors.indigo[600]} 100%)`,
      boxShadow: `0 4px 12px rgba(99, 102, 241, 0.3)`,
    },
    titleColor: colors.slate[800],
    subtitleColor: colors.slate[500],
    badge: {
      background: `linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)`,
      border: `1px solid rgba(165, 180, 252, 0.3)`,
      textColor: colors.indigo[600],
    },
  },

  // Also Known As / Transition banners
  banner: {
    indigo: {
      background: `linear-gradient(135deg, rgba(99, 102, 241, 0.04) 0%, rgba(59, 130, 246, 0.02) 100%)`,
      border: `1px solid rgba(199, 210, 254, 0.5)`,
      accentBar: `linear-gradient(180deg, ${colors.indigo[400]} 0%, ${colors.indigo[600]} 100%)`,
      iconBg: `rgba(99, 102, 241, 0.1)`,
      iconColor: colors.indigo[500],
      labelColor: colors.indigo[500],
      valueColor: colors.slate[700],
    },
    cyan: {
      background: `linear-gradient(135deg, rgba(6, 182, 212, 0.04) 0%, rgba(14, 165, 233, 0.02) 100%)`,
      border: `1px solid rgba(103, 232, 249, 0.5)`,
      accentBar: `linear-gradient(180deg, ${colors.cyan[400]} 0%, ${colors.cyan[600]} 100%)`,
      iconBg: `rgba(6, 182, 212, 0.1)`,
      iconColor: colors.cyan[500],
      labelColor: colors.cyan[600],
      valueColor: colors.slate[700],
    },
  },

  // Info card styles
  infoCard: {
    base: {
      padding: 1.75,
      borderRadius: '12px',
      background: `linear-gradient(145deg, ${colors.white} 0%, rgba(248, 250, 252, 0.8) 100%)`,
      border: `1px solid rgba(226, 232, 240, 0.8)`,
      minHeight: '68px',
    },
    iconBox: {
      width: 38,
      height: 38,
      borderRadius: '10px',
    },
    label: {
      fontSize: '0.7rem',
      fontWeight: 700,
      color: colors.slate[400],
      textTransform: 'uppercase',
      letterSpacing: '0.06em',
    },
    value: {
      fontSize: '0.875rem',
      fontWeight: 600,
      color: colors.slate[700],
      lineHeight: 1.3,
    },
  },

  // Color schemes for info cards
  colorSchemes: {
    indigo: {
      icon: colors.indigo[500],
      gradient: `linear-gradient(135deg, ${colors.indigo[500]} 0%, ${colors.indigo[600]} 100%)`,
      iconBg: `rgba(99, 102, 241, 0.08)`,
      hoverShadow: `0 8px 16px rgba(99, 102, 241, 0.12), 0 4px 6px rgba(15, 23, 42, 0.05)`,
      hoverBorder: `rgba(99, 102, 241, 0.25)`,
    },
    blue: {
      icon: colors.blue[500],
      gradient: `linear-gradient(135deg, ${colors.blue[500]} 0%, ${colors.blue[600]} 100%)`,
      iconBg: `rgba(59, 130, 246, 0.08)`,
      hoverShadow: `0 8px 16px rgba(59, 130, 246, 0.12), 0 4px 6px rgba(15, 23, 42, 0.05)`,
      hoverBorder: `rgba(59, 130, 246, 0.25)`,
    },
    cyan: {
      icon: colors.cyan[500],
      gradient: `linear-gradient(135deg, ${colors.cyan[500]} 0%, ${colors.cyan[600]} 100%)`,
      iconBg: `rgba(6, 182, 212, 0.08)`,
      hoverShadow: `0 8px 16px rgba(6, 182, 212, 0.12), 0 4px 6px rgba(15, 23, 42, 0.05)`,
      hoverBorder: `rgba(6, 182, 212, 0.25)`,
    },
    sky: {
      icon: colors.sky[500],
      gradient: `linear-gradient(135deg, ${colors.sky[500]} 0%, ${colors.sky[600]} 100%)`,
      iconBg: `rgba(14, 165, 233, 0.08)`,
      hoverShadow: `0 8px 16px rgba(14, 165, 233, 0.12), 0 4px 6px rgba(15, 23, 42, 0.05)`,
      hoverBorder: `rgba(14, 165, 233, 0.25)`,
    },
  },

  // Status colors
  statusColors: {
    active: colors.green[500],
    dormant: colors.indigo[400],
    disbanded: colors.slate[500],
    defunct: colors.slate[500],
    degraded: colors.blue[400],
    default: colors.indigo[500],
  },

  // Action buttons
  actionButtons: {
    news: {
      background: `linear-gradient(135deg, ${colors.cyan[600]} 0%, ${colors.cyan[500]} 50%, ${colors.cyan[400]} 100%)`,
      hoverBackground: `linear-gradient(135deg, ${colors.cyan[700]} 0%, ${colors.cyan[600]} 50%, ${colors.cyan[500]} 100%)`,
      boxShadow: `0 4px 16px rgba(6, 182, 212, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)`,
      hoverBoxShadow: `0 12px 32px rgba(6, 182, 212, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.25)`,
      iconBg: 'rgba(255, 255, 255, 0.25)',
      textColor: colors.white,
    },
    event: {
      background: `linear-gradient(135deg, ${colors.indigo[600]} 0%, ${colors.indigo[500]} 50%, ${colors.indigo[400]} 100%)`,
      hoverBackground: `linear-gradient(135deg, ${colors.indigo[700]} 0%, ${colors.indigo[600]} 50%, ${colors.indigo[500]} 100%)`,
      boxShadow: `0 4px 16px rgba(99, 102, 241, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)`,
      hoverBoxShadow: `0 12px 32px rgba(99, 102, 241, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.25)`,
      iconBg: 'rgba(255, 255, 255, 0.25)',
      textColor: colors.white,
    },
  },

  // Last updated badge
  lastUpdated: {
    background: `linear-gradient(135deg, ${colors.green[50]} 0%, ${colors.green[100]} 100%)`,
    border: `1px solid ${colors.green[200]}`,
    boxShadow: `0 1px 3px rgba(22, 163, 74, 0.08)`,
    iconColor: colors.green[600],
    labelColor: colors.green[700],
    valueColor: colors.green[800],
  },

  // Modal styles
  modals: {
    backdrop: {
      backgroundColor: 'rgba(15, 23, 42, 0.6)',
      backdropFilter: 'blur(4px)',
    },
    paper: {
      background: colors.white,
      borderRadius: '20px',
      boxShadow: '0 25px 80px rgba(0, 0, 0, 0.25)',
    },
    news: {
      headerGradient: `linear-gradient(135deg, ${colors.cyan[500]} 0%, ${colors.cyan[600]} 100%)`,
      iconColor: colors.white,
      titleColor: colors.white,
    },
    event: {
      headerGradient: `linear-gradient(135deg, ${colors.indigo[500]} 0%, ${colors.indigo[600]} 100%)`,
      iconColor: colors.white,
      titleColor: colors.white,
    },
  },

  // Loading/Empty states
  states: {
    loading: {
      background: colors.white,
      border: `1px solid ${colors.slate[300]}`,
      spinnerColor: colors.indigo[600],
      textColor: colors.slate[500],
    },
    empty: {
      iconColor: colors.slate[300],
      textColor: colors.slate[500],
    },
  },

  // Common text colors
  text: {
    primary: colors.slate[900],
    secondary: colors.slate[600],
    muted: colors.slate[500],
    light: colors.white,
    accent: colors.indigo[600],
  },
};

// ============================================================================
// PREMIUM HEADER STYLES
// ============================================================================

const premiumHeader = {
  profileCard: {
    mb: 1.5,
    borderRadius: '14px',
    overflow: 'visible !important',
    position: 'relative',
    zIndex: 1000,
    background: 'linear-gradient(135deg, #0D47A1 0%, #1565C0 50%, #1e40af 100%)',
    boxShadow: '0 8px 28px -8px rgba(13, 71, 161, 0.3), 0 4px 16px -4px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
  },
  content: {
    display: 'flex',
    flexDirection: { xs: 'column', lg: 'row' },
    alignItems: { xs: 'stretch', lg: 'center' },
    justifyContent: 'space-between',
    gap: 1,
    px: 1.5,
    py: 1,
    position: 'relative',
    zIndex: 10,
  },
  titleBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 0.5,
    px: 0.9,
    py: 0.6,
    background: 'rgba(255, 255, 255, 0.15)',
    borderRadius: '16px',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
  },
  titleText: {
    fontSize: '1rem',
    fontWeight: 700,
    color: 'white',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
  },
  sourceLabel: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 0.5,
    background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
    borderRadius: '4px',
    px: 1,
    py: 0.3,
    ml: 0.5,
    boxShadow: '0 2px 8px rgba(251, 191, 36, 0.5)',
    border: '1px solid #fcd34d',
  },
  sourceText: {
    fontSize: '0.62rem',
    fontWeight: 700,
    color: '#78350f',
    letterSpacing: '0.03em',
    textTransform: 'uppercase',
  },
  sourceValue: {
    fontSize: '0.68rem',
    fontWeight: 800,
    color: '#451a03',
    letterSpacing: '0.02em',
  },
  icon: {
    fontSize: '1.2rem',
    color: 'white',
  },
};

// ============================================================================
// THEME CREATOR
// ============================================================================

/**
 * Create theme based on mode (light/dark)
 * @param {string} mode - 'light' or 'dark'
 * @returns {Theme} MUI Theme object
 */
export const getTheme = (mode = 'light') => {
  const isDark = mode === 'dark';
  const currentPalette = isDark ? darkPalette : palette;
  const currentGradients = isDark ? darkGradients : gradients;
  const currentShadows = isDark ? darkShadows : shadows;

  return createTheme({
    direction: 'ltr',

    palette: {
      ...currentPalette,
      mode,
    },

    typography: {
      ...typography,
      fontFamily: typography.fontFamily,
    },

    shadows: currentShadows,

    components: getComponents(mode),

    shape: {
      borderRadius: tokens.borderRadius.sm,
    },

    spacing: 8,

    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 960,
        lg: 1280,
        xl: 1920,
      },
    },

    transitions: {
      create: () => 'none',
      duration: {
        shortest: 0,
        shorter: 0,
        short: 0,
        standard: 0,
        complex: 0,
        enteringScreen: 0,
        leavingScreen: 0,
      },
      easing: {
        easeInOut: 'linear',
        easeOut: 'linear',
        easeIn: 'linear',
        sharp: 'linear',
      },
    },

    custom: {
      mode,
      isDark,
      tokens,
      responsiveTypography,
      typographyMixins,
      gradients: currentGradients,
      premiumHeader,
      equipmentInfoCardStyles,
    },
  });
};

// Create default themes
export const theme = getTheme('light');
export const darkTheme = getTheme('dark');

// Backward compatibility exports
export const baselightTheme = theme;

// Re-export from palette and tokens for convenience
export { palette, darkPalette, gradients, darkGradients, colors } from './palette';
export { tokens, typography, shadows, darkShadows, responsiveTypography, typographyMixins } from './tokens';
export { getComponents } from './components';

export default theme;
