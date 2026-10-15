/**
 * Authentication Type Definitions
 *
 * JSDoc type definitions for authentication-related data structures.
 * These provide IDE support and documentation for the auth system.
 */

/**
 * @typedef {Object} User
 * @property {string} username - User's username
 * @property {string} [email] - User's email address
 * @property {string[]} [roles] - User's roles/permissions
 */

/**
 * @typedef {Object} AuthState
 * @property {User|null} user - Current authenticated user
 * @property {boolean} isAuthenticated - Whether user is authenticated
 * @property {boolean} isLoading - Whether auth check is in progress
 */

/**
 * @typedef {Object} LoginResult
 * @property {boolean} success - Whether login was successful
 * @property {string} [error] - Error message if login failed
 */

/**
 * @typedef {Object} AuthCheckResult
 * @property {boolean} isAuthenticated - Whether user is authenticated
 * @property {User|null} user - User data if authenticated
 */

/**
 * @typedef {Object} AuthContextValue
 * @property {User|null} user - Current authenticated user
 * @property {boolean} isAuthenticated - Whether user is authenticated
 * @property {boolean} isLoading - Whether auth check is in progress
 * @property {function(string, string): Promise<LoginResult>} login - SSO Login function
 * @property {function(): Promise<void>} logout - SSO Logout function
 * @property {function(): Promise<void>} checkAuthStatus - Check auth status function
 */

/**
 * @typedef {Object} ApiResponse
 * @property {boolean} success - Whether API call was successful
 * @property {*} [data] - Response data
 * @property {string} [error] - Error message if failed
 */

/**
 * @typedef {Object} TokenInfo
 * @property {string} accessToken - Access token
 * @property {string} [refreshToken] - Refresh token
 * @property {string} [tokenType] - Token type (e.g., 'Bearer')
 * @property {string} issuedAt - Token issue timestamp
 * @property {string} expiresAt - Token expiry timestamp
 * @property {string} [expiresIn] - Time until expiry
 * @property {boolean} isExpired - Whether token is expired
 */

// Export empty object to make this a module
export {};
