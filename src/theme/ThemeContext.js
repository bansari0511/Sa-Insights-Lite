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
export const ThemeContextProvider = ({ children }) => {
  // Initialize state from localStorage (default to light)
  const [mode, setModeState] = useState(() => getStoredTheme());

  // Persist theme changes to localStorage
  useEffect(() => {
    saveTheme(mode);

    // Update document class for potential CSS variable usage
    document.documentElement.setAttribute('data-theme', mode);

    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        'content',
        mode === THEME_MODES.DARK ? '#0d1117' : '#edf0f4'
      );
    }
  }, [mode]);

  // Toggle between light and dark
  const toggleTheme = useCallback(() => {
    setModeState((prevMode) =>
      prevMode === THEME_MODES.LIGHT ? THEME_MODES.DARK : THEME_MODES.LIGHT
    );
  }, []);

  // Set specific mode
  const setMode = useCallback((newMode) => {
    if (Object.values(THEME_MODES).includes(newMode)) {
      setModeState(newMode);
    } else {
      console.warn(`Invalid theme mode: ${newMode}`);
    }
  }, []);

  // Memoized context value
  const contextValue = useMemo(
    () => ({
      mode,
      toggleTheme,
      setMode,
      isDark: mode === THEME_MODES.DARK,
      isLight: mode === THEME_MODES.LIGHT,
    }),
    [mode, toggleTheme, setMode]
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
