/**
 * Theme Context - Global Theme Management
 *
 * Provides theme mode switching (light/dark) with:
 * - React Context for global state
 * - localStorage persistence
 * - Scalable architecture for future themes
 *
 * Usage:
 *   // In components:
 *   import { useThemeContext } from '@/theme/ThemeContext';
 *   const { mode, toggleTheme, setMode } = useThemeContext();
 */

import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

// Storage key for persisting theme preference
const THEME_STORAGE_KEY = 'app-theme-mode';

// Available theme modes - easily extensible for future themes
export const THEME_MODES = {
  LIGHT: 'light',
  DARK: 'dark',
};

// Default theme mode
const DEFAULT_MODE = THEME_MODES.LIGHT;

// Create the context
const ThemeContext = createContext({
  mode: DEFAULT_MODE,
  toggleTheme: () => {},
  setMode: () => {},
  isDark: false,
  isLight: true,
  // True when the host is driving the theme, so consumers can drop a control that
  // would otherwise be present and inert.
  hostOwnsTheme: false,
});

/**
 * Get stored theme from localStorage
 * Returns default if not found or invalid
 */
const getStoredTheme = () => {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored && Object.values(THEME_MODES).includes(stored)) {
      return stored;
    }
  } catch (error) {
    console.warn('Error reading theme from localStorage:', error);
  }
  return DEFAULT_MODE;
};

/**
 * Save theme to localStorage
 */
const saveTheme = (mode) => {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, mode);
  } catch (error) {
    console.warn('Error saving theme to localStorage:', error);
  }
};

/**
 * ThemeContextProvider Component
 *
 * Wraps the application and provides theme context to all children.
 * Manages theme state and persistence.
 */
// Identifies this app while it is mounted. Every dark-mode rule in
// styles/common.css is gated on `html[data-metis-app="news"]`.
//
// Why: under Module Federation this app's stylesheet is injected into the Metis
// host document and is NEVER removed when you navigate to a sibling child app.
// Its rules are written against generic MUI classes (.MuiPaper-root,
// .MuiListItem-root, .MuiTypography-body1 …), so without this gate they keep
// repainting the *other* app's chrome — the sibling's sidebar visibly changed
// colour depending on which app you had opened first. The marker lives on
// <html> rather than an app wrapper so portalled surfaces (menus, dialogs,
// tooltips, which render under <body>) stay covered.
const APP_MARKER = 'news';

/**
 * ThemeContextProvider
 *
 * @param hostTheme  When this app runs embedded in the METIS host, the host passes its own
 *                   theme down through HostProps and the portal's top bar owns the switch.
 *                   Supplying it here makes this provider FOLLOW that value instead of
 *                   holding its own: `mode` is derived from it, the toggle becomes inert,
 *                   and nothing is written to storage.
 *
 * Why the presence of the prop is the switch, rather than an `isEmbedded` flag:
 * "a host is mounting me" and "that host drives the theme" are not the same claim, and the
 * host and this app deploy separately. A host build that does not pass `theme` leaves
 * `hostTheme` undefined, this provider keeps its own mode, and its header keeps its switch —
 * so an old host with a new child still has exactly one working theme control, and so does a
 * new host with an old child. Gating on `isEmbedded` would strand the middle case with none.
 *
 * It also settles a conflict that already existed. Both apps write to the SAME <html>: the
 * host toggles a `dark` class, this app sets `data-theme`. Running standalone that is fine;
 * embedded they could disagree, and the host's own chrome has `[data-theme='dark']` rules —
 * so this app being dark while the portal was light repainted parts of the portal's top bar.
 * One owner removes the disagreement rather than papering over it.
 */
export const ThemeContextProvider = ({ children, hostTheme }) => {
  // Only a value this app understands counts. A host that passes nothing, or passes
  // something unexpected, leaves this app in charge rather than in an unknown mode.
  const hostOwnsTheme = hostTheme === THEME_MODES.LIGHT || hostTheme === THEME_MODES.DARK;

  // Initialize state from localStorage (default to light)
  // The mode this app holds when nobody else is driving. Kept even while the host IS
  // driving, so unmounting back to standalone resumes the user's own last choice
  // rather than inheriting whatever the portal happened to be set to.
  const [ownMode, setOwnMode] = useState(() => getStoredTheme());
  const mode = hostOwnsTheme ? hostTheme : ownMode;

  useEffect(() => {
    document.documentElement.setAttribute('data-metis-app', APP_MARKER);
    return () => {
      // Only clear it if a sibling app has not already claimed it — on an app
      // switch the incoming app can mount before this one unmounts.
      if (document.documentElement.getAttribute('data-metis-app') === APP_MARKER) {
        document.documentElement.removeAttribute('data-metis-app');
      }
    };
  }, []);

  // Persist theme changes to localStorage
  useEffect(() => {
    // Not while the host owns it. Persisting the portal's value into this app's own
    // store would silently rewrite the user's standalone preference every time they
    // opened the app inside the portal.
    if (!hostOwnsTheme) saveTheme(mode);

    // Update document class for potential CSS variable usage
    document.documentElement.setAttribute('data-theme', mode);

    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        'content',
        mode === THEME_MODES.DARK ? '#1a1a1e' : '#edf0f4'
      );
    }
  }, [mode, hostOwnsTheme]);

  // Toggle between light and dark
  const toggleTheme = useCallback(() => {
    // Inert rather than removed: `useThemeContext()` keeps the same shape in both
    // modes, so no caller has to null-check it. The controls that would call this
    // are hidden via `hostOwnsTheme` — this guard is what makes any that are not
    // hidden harmless instead of desynchronising the two apps.
    if (hostOwnsTheme) return;
    setOwnMode((prevMode) =>
      prevMode === THEME_MODES.LIGHT ? THEME_MODES.DARK : THEME_MODES.LIGHT
    );
  }, [hostOwnsTheme]);

  // Set specific mode
  const setMode = useCallback((newMode) => {
    if (hostOwnsTheme) return;
    if (Object.values(THEME_MODES).includes(newMode)) {
      setOwnMode(newMode);
    } else {
      console.warn(`Invalid theme mode: ${newMode}`);
    }
  }, [hostOwnsTheme]);

  // Memoized context value
  const contextValue = useMemo(
    () => ({
      mode,
      toggleTheme,
      setMode,
      isDark: mode === THEME_MODES.DARK,
      isLight: mode === THEME_MODES.LIGHT,
      hostOwnsTheme,
    }),
    [mode, toggleTheme, setMode, hostOwnsTheme]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Custom hook to use theme context
 *
 * @returns {Object} Theme context value
 * @throws Error if used outside ThemeContextProvider
 */
export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within ThemeContextProvider');
  }
  return context;
};

export default ThemeContext;
