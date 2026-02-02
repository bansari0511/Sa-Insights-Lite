/**
 * Authentication Service
 *
 * Handles all authentication-related API calls including SSO login/logout,
 * token management, and auth status checks.
 *
 * Supports both real SSO authentication via Keycloak and demo mode.
 */

// Demo mode flag - when true, bypasses real authentication
const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true';

// Demo user for demo mode
const DEMO_USER = {
  username: 'demo_user',
  email: 'demo@saaranalytics.ai',
  roles: ['user'],
};

// API Configuration from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

// API endpoint paths
const API_ENDPOINTS = {
  login: import.meta.env.VITE_API_LOGIN_ENDPOINT || '/api/auth/login',
  logout: import.meta.env.VITE_API_LOGOUT_ENDPOINT || '/api/auth/logout',
  refresh: import.meta.env.VITE_API_REFRESH_ENDPOINT || '/api/auth/refresh',
  authInfo: import.meta.env.VITE_API_AUTH_INFO_ENDPOINT || '/api/secure/info',
};

/**
 * Authentication service object containing all auth-related methods
 */
export const authService = {
  /**
   * Check if demo mode is enabled
   * @returns {boolean}
   */
  isDemoMode() {
    return DEMO_MODE;
  },

  /**
   * SSO Login - authenticates against Keycloak via backend API
   * In demo mode, accepts any credentials
   * @param {string} username - User's username
   * @param {string} password - User's password
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  async ssoLogin(username, password) {
    // Demo mode - simulate successful login
    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
      return { success: true };
    }

    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.login}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      });

      const text = await response.text();

      if (!text) {
        return { success: false, error: 'Server returned empty response. Please check if the backend is running.' };
      }

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        return { success: false, error: 'Invalid response from server. Please check if the backend is running.' };
      }

      if (response.ok && data.success) {
        return { success: true };
      }

      return { success: false, error: data.error || 'Login failed' };
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        return { success: false, error: 'Cannot connect to authentication server. Please check if the backend is running.' };
      }
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Login failed'
      };
    }
  },

  /**
   * SSO Logout - revokes tokens via backend API
   * Uses iframe/form approach to handle cross-origin SameSite=Lax cookies
   * @returns {Promise<void>}
   */
  async ssoLogout() {
    if (DEMO_MODE) {
      return;
    }

    console.debug('[authService] Logout - API_BASE_URL:', API_BASE_URL);
    console.debug('[authService] Logout - endpoint:', API_ENDPOINTS.logout);

    // Use iframe/form POST - this sends cookies even with SameSite=Lax
    return new Promise((resolve) => {
      let resolved = false;

      const cleanup = () => {
        if (resolved) return;
        resolved = true;
        try {
          document.body.removeChild(iframe);
          document.body.removeChild(form);
        } catch {
          // Elements may already be removed
        }
        resolve();
      };

      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.name = 'logout-frame';
      document.body.appendChild(iframe);

      const form = document.createElement('form');
      form.method = 'POST';
      form.action = `${API_BASE_URL}${API_ENDPOINTS.logout}`;
      form.target = 'logout-frame';
      form.style.display = 'none';
      document.body.appendChild(form);

      iframe.onload = () => {
        console.debug('[authService] Logout iframe onload fired');
        setTimeout(cleanup, 100);
      };

      form.submit();
      console.debug('[authService] Logout form submitted');

      // Fallback: if onload doesn't fire (e.g., X-Frame-Options blocks),
      // wait for request to complete then cleanup
      setTimeout(() => {
        console.debug('[authService] Logout fallback timeout fired');
        cleanup();
      }, 1500);
    });
  },

  /**
   * Check authentication status
   * In demo mode, always returns not authenticated (user must go through login)
   * @returns {Promise<{isAuthenticated: boolean, user: Object|null}>}
   */
  async checkAuth() {
    // Demo mode - don't auto-authenticate, let user go through login page
    if (DEMO_MODE) {
      return { isAuthenticated: false, user: null };
    }

    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.authInfo}`, {
        credentials: 'include',
      });

      if (response.ok) {
        const text = await response.text();
        if (!text) return { isAuthenticated: false, user: null };
        const data = JSON.parse(text);
        return { isAuthenticated: true, user: data.data || data };
      }

      if (response.status === 401) {
        const refreshed = await this.refreshToken();
        if (refreshed) {
          const retryResponse = await fetch(`${API_BASE_URL}${API_ENDPOINTS.authInfo}`, {
            credentials: 'include',
          });
          if (retryResponse.ok) {
            const text = await retryResponse.text();
            if (!text) return { isAuthenticated: false, user: null };
            const data = JSON.parse(text);
            return { isAuthenticated: true, user: data.data || data };
          }
        }
      }

      return { isAuthenticated: false, user: null };
    } catch {
      return { isAuthenticated: false, user: null };
    }
  },

  /**
   * Refresh authentication token
   * @returns {Promise<boolean>}
   */
  async refreshToken() {
    if (DEMO_MODE) {
      return true;
    }

    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.refresh}`, {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        window.dispatchEvent(new CustomEvent('sso-token-refreshed', {
          detail: { timestamp: new Date() }
        }));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },

  /**
   * Get demo user (for demo mode)
   * @returns {Object}
   */
  getDemoUser() {
    return DEMO_USER;
  },

  /**
   * Get all endpoint URLs for display/debugging purposes
   * @returns {Object}
   */
  getEndpointUrls() {
    return {
      baseUrl: API_BASE_URL,
      demoMode: DEMO_MODE,
      endpoints: {
        login: `${API_BASE_URL}${API_ENDPOINTS.login}`,
        logout: `${API_BASE_URL}${API_ENDPOINTS.logout}`,
        refresh: `${API_BASE_URL}${API_ENDPOINTS.refresh}`,
        authInfo: `${API_BASE_URL}${API_ENDPOINTS.authInfo}`,
      },
    };
  },
};

export default authService;
