/**
 * MUI Component Overrides - Unified Theme
 *
 * All components use the unified color palette from palette.js for consistency.
 * No duplicate color definitions - everything references the single source of truth.
 *
 * Usage: This file is imported by theme.js and applied globally.
 */

import { colors, gradients, darkGradients } from './palette';
import { tokens } from './tokens';

// Primary palette reference (navy scale from colors)
const primaryPalette = colors.navy;

/**
 * Get mode-aware colors and gradients
 * @param {string} mode - 'light' or 'dark'
 */
const getModeColors = (mode) => {
  const isDark = mode === 'dark';
  return {
    isDark,
    // Background colors
    background: {
      body: isDark ? '#0d1117' : primaryPalette[50],
      paper: isDark ? '#161b22' : colors.white,
      secondary: isDark ? '#21262d' : primaryPalette[100],
      elevated: isDark ? '#1c2128' : colors.white,
    },
    // Text colors
    text: {
      primary: isDark ? '#e6edf3' : primaryPalette[900],
      secondary: isDark ? '#8b949e' : primaryPalette[700],
      disabled: isDark ? '#484f58' : colors.gray[400],
      inverse: isDark ? '#0d1117' : colors.white,
    },
    // Border colors
    border: {
      default: isDark ? '#30363d' : primaryPalette[300],
      light: isDark ? '#21262d' : primaryPalette[200],
      dark: isDark ? '#484f58' : primaryPalette[400],
    },
    // Primary colors (adjusted for mode)
    primary: {
      main: isDark ? primaryPalette[400] : primaryPalette[600],
      light: isDark ? primaryPalette[300] : primaryPalette[400],
      dark: isDark ? primaryPalette[600] : primaryPalette[800],
      hover: isDark ? primaryPalette[500] : primaryPalette[700],
    },
    // Gradients
    gradients: isDark ? darkGradients : gradients,
    // Action states
    action: {
      hover: isDark ? 'rgba(177, 186, 196, 0.12)' : `${primaryPalette[600]}14`,
      selected: isDark ? 'rgba(177, 186, 196, 0.16)' : `${primaryPalette[600]}1F`,
      focus: isDark ? 'rgba(177, 186, 196, 0.2)' : `${primaryPalette[600]}29`,
    },
  };
};

/**
 * Get component overrides based on theme mode
 * @param {string} mode - 'light' or 'dark'
 * @returns {Object} MUI component overrides
 */
export const getComponents = (mode = 'light') => {
  const c = getModeColors(mode);

  return {
    // CSS Baseline - Global body styles
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: c.background.body,
          minHeight: '100vh',
          color: c.text.primary,
        },
        ':root': {
          '--tw-bg-opacity': '1',
          '--tw-gradient-to-position': '100%',
          '--primary-50': primaryPalette[50],
          '--primary-600': primaryPalette[600],
          '--primary-900': primaryPalette[900],
          // Dark mode CSS variables
          '--bg-default': c.background.body,
          '--bg-paper': c.background.paper,
          '--text-primary': c.text.primary,
          '--text-secondary': c.text.secondary,
          '--border-default': c.border.default,
        },
      },
    },

    // Button Component
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: tokens.borderRadius.button,
          fontWeight: 600,
          fontSize: '0.95rem',
          padding: '10px 20px',
          transition: 'none',
          '&:hover': {
            transform: 'none',
            boxShadow: c.isDark ? `0 4px 12px rgba(0, 0, 0, 0.4)` : `0 4px 12px rgba(0, 0, 0, 0.15)`,
          },
        },
        contained: {
          background: c.primary.main,
          color: colors.white,
          boxShadow: c.isDark ? `0 1px 3px rgba(0, 0, 0, 0.3)` : `0 1px 3px rgba(0, 0, 0, 0.12)`,
          '&:hover': {
            background: c.primary.hover,
            boxShadow: c.isDark ? `0 4px 12px rgba(0, 0, 0, 0.5)` : `0 4px 12px rgba(0, 0, 0, 0.2)`,
          },
        },
        outlined: {
          borderColor: c.border.dark,
          borderWidth: '1.5px',
          color: c.isDark ? c.text.primary : primaryPalette[700],
          '&:hover': {
            borderColor: c.primary.main,
            borderWidth: '1.5px',
            background: c.action.hover,
            color: c.isDark ? colors.white : primaryPalette[800],
          },
        },
        text: {
          color: c.primary.main,
          '&:hover': {
            background: c.action.hover,
            color: c.primary.hover,
          },
        },
      },
    },

    // Card Component
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: tokens.borderRadius.card,
          background: c.background.paper,
          boxShadow: c.isDark
            ? `0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2)`
            : `0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.08)`,
          border: `1px solid ${c.border.default}`,
          transition: 'none',
          position: 'relative',
          overflow: 'hidden',
          '&:hover': {
            transform: 'none',
            boxShadow: c.isDark
              ? `0 4px 12px rgba(0, 0, 0, 0.4), 0 2px 4px rgba(0, 0, 0, 0.3)`
              : `0 4px 12px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.1)`,
            borderColor: c.border.dark,
          },
          '& .MuiCardHeader-root': {
            padding: '20px 24px 16px',
            '& .MuiCardHeader-title': {
              fontSize: '1.25rem',
              fontWeight: tokens.fontWeight.bold,
              color: c.text.primary,
              lineHeight: 1.4,
            },
            '& .MuiCardHeader-subheader': {
              fontSize: '0.9rem',
              fontWeight: tokens.fontWeight.medium,
              color: c.text.secondary,
              marginTop: '4px',
            },
          },
          '& .MuiCardContent-root': {
            padding: '16px 24px 24px',
            '&:last-child': {
              paddingBottom: '24px',
            },
          },
        },
      },
    },

    // Paper Component
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: tokens.borderRadius.lg,
          background: c.background.paper,
          boxShadow: c.isDark
            ? `0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2)`
            : `0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.08)`,
          border: `1px solid ${c.border.default}`,
          transition: 'none',
        },
      },
    },

    // AppBar Component
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: c.gradients.appBar,
          backdropFilter: tokens.backdropFilter.md,
          borderBottom: `1px solid ${c.isDark ? '#30363d' : primaryPalette[400] + '33'}`,
          boxShadow: c.isDark
            ? `0 4px 20px rgba(0, 0, 0, 0.4)`
            : `0 4px 20px ${primaryPalette[800]}26`,
          '& .MuiToolbar-root': {
            color: colors.white,
            minHeight: '64px',
            padding: '0 24px',
          },
          '& .MuiTypography-root': {
            color: colors.white,
            fontWeight: tokens.fontWeight.bold,
            fontSize: '1.25rem',
          },
          '& .MuiIconButton-root': {
            color: colors.white,
            transition: 'none',
            '&:hover': {
              background: c.isDark ? 'rgba(255, 255, 255, 0.1)' : `${primaryPalette[400]}26`,
              boxShadow: c.isDark ? 'none' : `0 0 20px ${primaryPalette[400]}4D`,
              transform: 'none',
            },
          },
        },
      },
    },

    // Drawer Component (Sidebar)
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: c.gradients.sidebar,
          borderRight: `1px solid ${c.isDark ? '#30363d' : primaryPalette[400] + '4D'}`,
          boxShadow: c.isDark
            ? `8px 0 32px rgba(0, 0, 0, 0.5)`
            : `8px 0 32px ${primaryPalette[900]}26`,
          width: '280px',
          '& .MuiList-root': {
            padding: '3px 12px',
          },
          '& .MuiTypography-root': {
            color: colors.white,
          },
          '& .MuiDivider-root': {
            borderColor: c.isDark ? '#30363d' : `${primaryPalette[400]}33`,
            margin: '8px 0',
          },
        },
      },
    },

    // ListItemButton Component (Sidebar navigation)
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: tokens.borderRadius.md,
          margin: '2px 8px',
          padding: '8px 12px',
          transition: 'none',
          position: 'relative',
          color: colors.white,
          minHeight: '44px',
          '&::before': {
            content: '""',
            position: 'absolute',
            left: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            width: '3px',
            height: '0px',
            background: c.isDark
              ? `linear-gradient(135deg, #58a6ff 0%, #79c0ff 100%)`
              : `linear-gradient(135deg, ${primaryPalette[300]} 0%, #ffffff 100%)`,
            borderRadius: '0 2px 2px 0',
            transition: 'none',
          },
          '&:hover': {
            background: c.isDark ? 'rgba(255, 255, 255, 0.08)' : `${primaryPalette[400]}26`,
            transform: 'none',
            boxShadow: c.isDark ? 'none' : `0 2px 12px ${primaryPalette[400]}33`,
            '&::before': {
              height: '60%',
            },
          },
          '&.Mui-selected': {
            background: c.isDark ? 'rgba(255, 255, 255, 0.12)' : `${primaryPalette[400]}33`,
            '&::before': {
              height: '60%',
            },
            '&:hover': {
              background: c.isDark ? 'rgba(255, 255, 255, 0.16)' : `${primaryPalette[400]}40`,
            },
          },
          '& .MuiListItemIcon-root': {
            color: colors.white,
            minWidth: '36px',
            transition: 'none',
          },
          '& .MuiListItemText-root': {
            margin: '0',
          },
          '& .MuiListItemText-primary': {
            color: colors.white,
            fontWeight: tokens.fontWeight.semibold,
            fontSize: '0.9rem',
            lineHeight: 1.3,
            textShadow: c.isDark ? 'none' : `0 0 8px ${primaryPalette[400]}4D`,
          },
          '& .MuiListItemText-secondary': {
            color: 'rgba(255, 255, 255, 0.75)',
            fontSize: '0.8rem',
            lineHeight: 1.2,
            marginTop: '2px',
          },
        },
      },
    },

    // TextField Component
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: tokens.borderRadius.input,
            background: c.background.paper,
            color: c.text.primary,
            transition: 'none',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: c.border.default,
              borderWidth: '1.5px',
              transition: 'none',
            },
            '&:hover': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: c.border.dark,
              },
            },
            '&.Mui-focused': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: c.primary.main,
                borderWidth: '2px',
              },
            },
          },
          '& .MuiInputBase-input': {
            color: c.text.primary,
            '&::placeholder': {
              color: c.text.secondary,
              opacity: 1,
            },
          },
          '& .MuiInputLabel-root': {
            color: c.text.secondary,
            fontWeight: 500,
            '&.Mui-focused': {
              color: c.primary.main,
            },
          },
        },
      },
    },

    // Chip Component
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: tokens.borderRadius.chip,
          fontWeight: tokens.fontWeight.medium,
          background: c.gradients.chip,
          border: `1px solid ${c.border.light}`,
          color: c.isDark ? c.text.primary : primaryPalette[700],
          transition: 'none',
          '&:hover': {
            transform: 'none',
            boxShadow: c.isDark ? 'none' : `0 4px 20px ${primaryPalette[300]}66`,
            background: c.gradients.chipHover,
          },
          '&.MuiChip-filled': {
            background: c.primary.main,
            color: colors.white,
          },
        },
      },
    },

    // IconButton Component
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: tokens.borderRadius.md,
          transition: 'none',
          color: c.primary.main,
          '&:hover': {
            background: c.action.hover,
            boxShadow: c.isDark ? 'none' : `0 4px 16px ${primaryPalette[300]}66`,
            transform: 'none',
          },
        },
      },
    },

    // Table Components
    MuiTableContainer: {
      styleOverrides: {
        root: {
          borderRadius: tokens.borderRadius.card,
          background: c.background.paper,
          boxShadow: c.isDark ? 'none' : `0 4px 20px ${primaryPalette[200]}4D`,
          border: `1px solid ${c.border.light}`,
        },
      },
    },

    MuiTableHead: {
      styleOverrides: {
        root: {
          background: c.gradients.table,
          '& .MuiTableCell-root': {
            color: c.isDark ? c.text.primary : primaryPalette[700],
            fontWeight: tokens.fontWeight.semibold,
            fontSize: '0.875rem',
            textTransform: 'uppercase',
            letterSpacing: tokens.letterSpacing.wider,
            borderBottom: `1px solid ${c.border.default}`,
          },
        },
      },
    },

    MuiTableCell: {
      styleOverrides: {
        root: {
          color: c.text.primary,
          borderBottom: `1px solid ${c.border.light}`,
        },
      },
    },

    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            background: c.action.hover,
          },
        },
      },
    },

    // Divider Component
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: c.border.default,
        },
      },
    },

    // Dialog Component
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: tokens.borderRadius.dialog,
          background: c.background.paper,
          border: `1px solid ${c.border.default}`,
          boxShadow: c.isDark
            ? `0 20px 60px rgba(0, 0, 0, 0.6)`
            : `0 20px 60px ${primaryPalette[900]}26`,
        },
      },
    },

    MuiDialogTitle: {
      styleOverrides: {
        root: {
          color: c.text.primary,
        },
      },
    },

    MuiDialogContent: {
      styleOverrides: {
        root: {
          color: c.text.primary,
        },
      },
    },

    // BottomNavigation Component
    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          background: c.gradients.appBar,
          borderTop: `1px solid ${c.isDark ? '#30363d' : primaryPalette[400] + '33'}`,
          boxShadow: c.isDark
            ? `0 -4px 20px rgba(0, 0, 0, 0.4)`
            : `0 -4px 20px ${primaryPalette[800]}26`,
          padding: '20px 0',
          '& .MuiBottomNavigationAction-root': {
            color: 'rgba(255, 255, 255, 0.7)',
            transition: 'none',
            '&.Mui-selected': {
              color: c.isDark ? '#79c0ff' : primaryPalette[200],
            },
            '&:hover': {
              color: colors.white,
              transform: 'none',
            },
          },
        },
      },
    },

    // Typography Component (Clean, readable typography)
    MuiTypography: {
      styleOverrides: {
        h1: {
          fontSize: '2.5rem',
          fontWeight: 700,
          lineHeight: 1.2,
          letterSpacing: '-0.02em',
          marginBottom: '1.5rem',
          color: c.text.primary,
        },
        h2: {
          fontSize: '2rem',
          fontWeight: 700,
          color: c.text.primary,
          lineHeight: 1.3,
          letterSpacing: '-0.01em',
          marginBottom: '1.25rem',
        },
        h3: {
          fontSize: '1.75rem',
          fontWeight: 600,
          color: c.text.primary,
          lineHeight: 1.3,
          marginBottom: '1rem',
        },
        h4: {
          fontSize: '1.5rem',
          fontWeight: 600,
          color: c.isDark ? c.text.primary : primaryPalette[800],
          lineHeight: 1.4,
          marginBottom: '0.875rem',
        },
        h5: {
          fontSize: '1.25rem',
          fontWeight: 600,
          color: c.isDark ? c.text.primary : primaryPalette[800],
          lineHeight: 1.4,
          marginBottom: '0.75rem',
        },
        h6: {
          fontSize: '1.125rem',
          fontWeight: 600,
          color: c.isDark ? c.text.secondary : primaryPalette[700],
          lineHeight: 1.4,
          marginBottom: '0.625rem',
        },
        body1: {
          fontSize: '1rem',
          fontWeight: 400,
          color: c.text.primary,
          lineHeight: 1.6,
          letterSpacing: '0.01em',
        },
        body2: {
          fontSize: '0.875rem',
          fontWeight: 400,
          color: c.isDark ? c.text.secondary : primaryPalette[800],
          lineHeight: 1.6,
          letterSpacing: '0.01em',
        },
        subtitle1: {
          fontSize: '1.125rem',
          fontWeight: 500,
          color: c.text.secondary,
          lineHeight: 1.5,
        },
        subtitle2: {
          fontSize: '1rem',
          fontWeight: 500,
          color: c.text.secondary,
          lineHeight: 1.5,
        },
        caption: {
          fontSize: '0.75rem',
          fontWeight: 400,
          color: c.text.secondary,
          lineHeight: 1.4,
          letterSpacing: '0.02em',
        },
        overline: {
          fontSize: '0.75rem',
          fontWeight: 600,
          color: c.text.secondary,
          lineHeight: 1.4,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
        },
      },
    },

    // Menu Component
    MuiMenu: {
      styleOverrides: {
        paper: {
          background: c.background.paper,
          border: `1px solid ${c.border.default}`,
          boxShadow: c.isDark
            ? `0 8px 24px rgba(0, 0, 0, 0.5)`
            : `0 8px 24px rgba(0, 0, 0, 0.15)`,
        },
      },
    },

    MuiMenuItem: {
      styleOverrides: {
        root: {
          color: c.text.primary,
          '&:hover': {
            background: c.action.hover,
          },
          '&.Mui-selected': {
            background: c.action.selected,
            '&:hover': {
              background: c.action.selected,
            },
          },
        },
      },
    },

    // Select Component
    MuiSelect: {
      styleOverrides: {
        select: {
          color: c.text.primary,
        },
        icon: {
          color: c.text.secondary,
        },
      },
    },

    // Tooltip Component
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          background: c.isDark ? '#21262d' : primaryPalette[800],
          color: colors.white,
          fontSize: '0.75rem',
          borderRadius: tokens.borderRadius.sm,
        },
      },
    },

    // Box Component - Clean spacing
    MuiBox: {
      styleOverrides: {
        root: {
          // Remove unnecessary default padding where it's not needed
        },
      },
    },

    // Stack Component - Consistent spacing
    MuiStack: {
      defaultProps: {
        spacing: 2,
      },
    },

    // Container Component - Responsive, centered layout
    MuiContainer: {
      defaultProps: {
        maxWidth: 'xl',
      },
      styleOverrides: {
        root: {
          paddingLeft: '24px',
          paddingRight: '24px',
          '@media (max-width: 600px)': {
            paddingLeft: '16px',
            paddingRight: '16px',
          },
        },
      },
    },

    // Tabs Component
    MuiTabs: {
      styleOverrides: {
        indicator: {
          background: c.primary.main,
        },
      },
    },

    MuiTab: {
      styleOverrides: {
        root: {
          color: c.text.secondary,
          '&.Mui-selected': {
            color: c.primary.main,
          },
        },
      },
    },

    // Alert Component
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: tokens.borderRadius.md,
        },
        standardInfo: {
          background: c.isDark ? 'rgba(56, 139, 253, 0.15)' : undefined,
          color: c.isDark ? '#79c0ff' : undefined,
        },
        standardSuccess: {
          background: c.isDark ? 'rgba(63, 185, 80, 0.15)' : undefined,
          color: c.isDark ? '#56d364' : undefined,
        },
        standardWarning: {
          background: c.isDark ? 'rgba(210, 153, 34, 0.15)' : undefined,
          color: c.isDark ? '#e3b341' : undefined,
        },
        standardError: {
          background: c.isDark ? 'rgba(248, 81, 73, 0.15)' : undefined,
          color: c.isDark ? '#ff7b72' : undefined,
        },
      },
    },

    // Autocomplete Component
    MuiAutocomplete: {
      styleOverrides: {
        paper: {
          background: c.background.paper,
          border: `1px solid ${c.border.default}`,
        },
        option: {
          color: c.text.primary,
          '&:hover': {
            background: c.action.hover,
          },
          '&[aria-selected="true"]': {
            background: c.action.selected,
          },
        },
      },
    },
  };
};

// For backward compatibility - export default light components
export const components = getComponents('light');

export default getComponents;
