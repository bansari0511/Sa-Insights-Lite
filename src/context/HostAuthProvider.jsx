/**
 * Host Auth Provider — Federation Auth Bridge
 *
 * Maps METIS host's HostProps into this app's existing AuthContext shape,
 * so every component calling useAuth() works unchanged in embedded mode.
 *
 * The host's EntitlementGuard has already verified access before loading
 * this app, so hasAccess() always returns true here.
 */

import AuthContext from './AuthContext';

const HostAuthProvider = ({ hostProps, children }) => {
  const value = {
    // Map host user shape → this app's user shape
    user: hostProps.user
      ? {
          username: hostProps.user.username,
          userid: hostProps.user.username,
          email: hostProps.user.email,
          roles: hostProps.user.roles || [],
        }
      : null,
    isAuthenticated: !!hostProps.user,
    isLoading: false,
    entitlements: hostProps.entitlements || [],
    entitlementsLoaded: true,
    // Host already checked entitlements — always grant access in embedded mode
    hasAccess: () => true,
    // Auth actions are managed by the host
    login: async () => ({ success: false, error: 'Login is managed by the host application.' }),
    logout: async () => {
      if (hostProps.onNavigateToHost) {
        hostProps.onNavigateToHost('/login');
      }
    },
    checkAuthStatus: async () => {},
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default HostAuthProvider;
