/**
 * Authentication Context
 *
 * Provides authentication state and methods throughout the application.
 * Supports both real authentication via Keycloak SSO and demo mode.
 * Includes cross-app SSO sync via window focus events.
 */

import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import authService from '../services/authService';

// Demo mode flag
const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true';

// Demo user for demo mode
const DEMO_USER = {
  username: 'demo_user',
  email: 'demo@saaranalytics.ai',
  roles: ['user'],
};

const AuthContext = createContext(null);

/**
 * Authentication Provider Component
 *
 * Wraps the application and provides authentication state and methods
 * to all child components via React Context.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(!DEMO_MODE);
  const justLoggedOut = useRef(false);
  const loginInProgress = useRef(false);

  /**
   * Check authentication status
   * In demo mode, bypasses real authentication check
   */
  const checkAuthStatus = useCallback(async (forceCheck = false) => {
    // Skip if login is in progress or just logged out
    if (loginInProgress.current || justLoggedOut.current) {
      return;
    }

    // Demo mode: don't auto-authenticate, let user go through login page
    if (DEMO_MODE) {
      setIsLoading(false);
      return;
    }

    // Only set loading on initial check, not on focus-triggered checks
    if (forceCheck) {
      setIsLoading(true);
    }

    try {
      const result = await authService.checkAuth();

      if (result.isAuthenticated) {
        setUser({
          username: result.user?.username || result.user?.name || 'SSO User',
          email: result.user?.email,
          roles: result.user?.roles,
        });
        setIsAuthenticated(true);
      } else {
        // Clear state when not authenticated
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('[AuthContext] Auth status check failed:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      if (forceCheck) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    checkAuthStatus(true); // Force check on initial load

    // Re-check auth when window gains focus (for cross-app SSO sync)
    const handleFocus = () => {
      if (!DEMO_MODE) {
        // Skip auth check if we just logged out (prevents race condition)
        if (justLoggedOut.current) {
          console.debug('[AuthContext] Window focused - skipping auth check (just logged out)');
          return;
        }
        console.debug('[AuthContext] Window focused - checking auth status for cross-app SSO');
        checkAuthStatus();
      }
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [checkAuthStatus]);

  /**
   * SSO Login via Keycloak (or demo mode)
   * @param {string} username - User's username
   * @param {string} password - User's password
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  const login = useCallback(async (username, password) => {
    // Set flag to prevent concurrent auth checks
    loginInProgress.current = true;

    try {
      // Demo mode: accept any credentials and create a demo user
      if (DEMO_MODE) {
        const demoUser = {
          username: username || 'demo_user',
          email: `${username || 'demo'}@saaranalytics.ai`,
          roles: ['user'],
        };
        setUser(demoUser);
        setIsAuthenticated(true);
        return { success: true };
      }

      const result = await authService.ssoLogin(username, password);
      if (result.success) {
        // Fetch user info after successful login without triggering loading state
        try {
          const authResult = await authService.checkAuth();
          if (authResult.isAuthenticated) {
            setUser({
              username: authResult.user?.username || authResult.user?.name || username,
              email: authResult.user?.email,
              roles: authResult.user?.roles,
            });
            setIsAuthenticated(true);
          }
        } catch {
          // Even if user fetch fails, login was successful
          setUser({ username, email: '', roles: [] });
          setIsAuthenticated(true);
        }
      }
      return result;
    } finally {
      // Clear the flag after a short delay to allow navigation to complete
      setTimeout(() => {
        loginInProgress.current = false;
      }, 1000);
    }
  }, []);

  /**
   * SSO Logout (or demo mode)
   */
  const logout = useCallback(async () => {
    // Set flag to prevent focus listener from re-authenticating
    justLoggedOut.current = true;

    // Demo mode: just clear state
    if (DEMO_MODE) {
      setUser(null);
      setIsAuthenticated(false);
      // Reset the flag after a delay
      setTimeout(() => {
        justLoggedOut.current = false;
      }, 3000);
      return;
    }

    await authService.ssoLogout();
    setUser(null);
    setIsAuthenticated(false);

    // Reset the flag after a delay to allow cross-app SSO to work again
    setTimeout(() => {
      justLoggedOut.current = false;
    }, 3000);
  }, []);

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    checkAuthStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook to access authentication context
 * @returns {Object} Authentication context value
 * @throws {Error} If used outside of AuthProvider
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
