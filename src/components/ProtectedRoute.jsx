/**
 * Protected Route Component
 *
 * Wraps routes that require authentication.
 * Redirects to login page if user is not authenticated.
 * Shows loading spinner while checking auth status.
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './ProtectedRoute.css';

/**
 * Error boundary specifically for protected routes
 * Catches errors during auth state transitions and redirects to login
 */
class ProtectedRouteErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ProtectedRoute] Error during render:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // On error, redirect to login
      return <Navigate to="/auth/login" replace />;
    }
    return this.props.children;
  }
}

/**
 * ProtectedRoute - Route guard component
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to render if authenticated
 * @returns {React.ReactNode}
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking auth status
  if (isLoading) {
    return (
      <div className="protected-route-loading">
        <div className="loading-spinner"></div>
        <p className="loading-text">Checking authentication...</p>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    // Save the attempted URL for redirecting after login
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Render protected content with error boundary
  // Key resets the error boundary when location changes
  return (
    <ProtectedRouteErrorBoundary key={location.pathname}>
      {children}
    </ProtectedRouteErrorBoundary>
  );
};

export default ProtectedRoute;
