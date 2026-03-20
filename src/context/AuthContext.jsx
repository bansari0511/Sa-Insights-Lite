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
  const [entitlements, setEntitlements] = useState([]);
  const [entitlementsLoaded, setEntitlementsLoaded] = useState(false);
  const justLoggedOut = useRef(false);
  const loginInProgress = useRef(false);

  /**
   * Load entitlements from Metis API after successful authentication
   */
  const loadEntitlements = async (userData) => {
    try {
      const data = await authService.fetchEntitlements(userData?.userid || userData?.id, userData?.username || userData?.name);
      setEntitlements(data);
    } catch (err) {
      console.error('[AuthContext] Entitlement fetch failed:', err);
      setEntitlements([]);
    } finally {
      setEntitlementsLoaded(true);
    }
  };

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
        const userData = {
          username: result.user?.username || result.user?.name || 'SSO User',
          userid: result.user?.userid || result.user?.id,
          email: result.user?.email,
          roles: result.user?.roles,
        };
        setUser(userData);
        setIsAuthenticated(true);
        await loadEntitlements(userData);
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
          userid: 'demo_001',
          email: `${username || 'demo'}@saaranalytics.ai`,
          roles: ['user'],
        };
        setUser(demoUser);
        setIsAuthenticated(true);
        await loadEntitlements(demoUser);
        return { success: true };
      }

      const result = await authService.ssoLogin(username, password);
      if (result.success) {
        // Fetch user info after successful login without triggering loading state
        try {
          const authResult = await authService.checkAuth();
          if (authResult.isAuthenticated) {
            const userData = {
              username: authResult.user?.username || authResult.user?.name || username,
              userid: authResult.user?.userid || authResult.user?.id,
              email: authResult.user?.email,
              roles: authResult.user?.roles,
            };
            setUser(userData);
            setIsAuthenticated(true);
            await loadEntitlements(userData);
          }
        } catch {
          // Even if user fetch fails, login was successful
          const fallbackUser = { username, email: '', roles: [] };
          setUser(fallbackUser);
          setIsAuthenticated(true);
          await loadEntitlements(fallbackUser);
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
      setEntitlements([]);
      setEntitlementsLoaded(false);
      // Reset the flag after a delay
      setTimeout(() => {
        justLoggedOut.current = false;
      }, 3000);
      return;
    }

    await authService.ssoLogout();
    setUser(null);
    setIsAuthenticated(false);
    setEntitlements([]);
    setEntitlementsLoaded(false);

    // Reset the flag after a delay to allow cross-app SSO to work again
    setTimeout(() => {
      justLoggedOut.current = false;
    }, 3000);
  }, []);

  /**
   * Check if user has access by appname from the entitlements list.
   * Iterates through all entitlements and returns true only if a matching
   * appname is found with status 'has_access'. Returns false for 'no_access',
   * missing entries, or empty entitlements.
   *
   * @param {string} appName - The app name to check (e.g., 'news', 'SA Insights')
   * @returns {boolean}
   */
  const hasAccess = (appName) => {
    if (!entitlements || entitlements.length === 0) {
      console.debug('[AuthContext] hasAccess: no entitlements loaded yet');
      return false;
    }

    const normalizedInput = appName?.toLowerCase().trim();

    const result = entitlements.some(
      (e) =>
        e.appname?.toLowerCase().trim() === normalizedInput &&
        e.status === 'has_access'
    );

    console.debug(
      `[AuthContext] hasAccess("${appName}") → ${result}`,
      '| entitlements:',
      entitlements.map((e) => ({ appname: e.appname, status: e.status }))
    );

    return result;
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    entitlements,
    entitlementsLoaded,
    hasAccess,
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
