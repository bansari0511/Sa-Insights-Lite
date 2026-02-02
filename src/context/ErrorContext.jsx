/**
 * Error Context
 * Provides global error state management and notification system
 */

import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { AppError, getUserFriendlyMessage } from '../utils/errorHandler';
import logger from '../utils/errorLogger';

const ErrorContext = createContext();

export const useError = () => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error('useError must be used within an ErrorProvider');
  }
  return context;
};

export const ErrorProvider = ({ children }) => {
  const [errors, setErrors] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const notificationIdCounter = useRef(0);

  /**
   * Add error to the error stack
   */
  const addError = useCallback((error, options = {}) => {
    const {
      silent = false,
      showNotification = true,
      notificationDuration = 6000,
      context = {},
    } = options;

    const errorObject = error instanceof AppError ? error : new AppError(
      error?.message || 'An unexpected error occurred',
      null,
      null,
      { originalError: error }
    );

    // Log the error
    logger.error(errorObject.message, errorObject, context);

    // Add to error stack
    setErrors(prev => [...prev, {
      id: Date.now(),
      error: errorObject,
      context,
      timestamp: new Date().toISOString(),
    }]);

    // Show notification if not silent
    if (!silent && showNotification) {
      showErrorNotification(errorObject, notificationDuration);
    }

    return errorObject;
  }, []);

  /**
   * Show error notification
   */
  const showErrorNotification = useCallback((error, duration = 6000) => {
    const id = ++notificationIdCounter.current;
    const message = getUserFriendlyMessage(error);

    const notification = {
      id,
      message,
      severity: 'error',
      error,
      timestamp: new Date().toISOString(),
    };

    setNotifications(prev => [...prev, notification]);

    // Auto dismiss after duration
    if (duration > 0) {
      setTimeout(() => {
        dismissNotification(id);
      }, duration);
    }

    return id;
  }, []);

  /**
   * Show success notification
   */
  const showSuccess = useCallback((message, duration = 4000) => {
    const id = ++notificationIdCounter.current;

    const notification = {
      id,
      message,
      severity: 'success',
      timestamp: new Date().toISOString(),
    };

    setNotifications(prev => [...prev, notification]);

    if (duration > 0) {
      setTimeout(() => {
        dismissNotification(id);
      }, duration);
    }

    return id;
  }, []);

  /**
   * Show info notification
   */
  const showInfo = useCallback((message, duration = 4000) => {
    const id = ++notificationIdCounter.current;

    const notification = {
      id,
      message,
      severity: 'info',
      timestamp: new Date().toISOString(),
    };

    setNotifications(prev => [...prev, notification]);

    if (duration > 0) {
      setTimeout(() => {
        dismissNotification(id);
      }, duration);
    }

    return id;
  }, []);

  /**
   * Show warning notification
   */
  const showWarning = useCallback((message, duration = 5000) => {
    const id = ++notificationIdCounter.current;

    const notification = {
      id,
      message,
      severity: 'warning',
      timestamp: new Date().toISOString(),
    };

    setNotifications(prev => [...prev, notification]);

    if (duration > 0) {
      setTimeout(() => {
        dismissNotification(id);
      }, duration);
    }

    return id;
  }, []);

  /**
   * Dismiss a notification
   */
  const dismissNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  /**
   * Clear all notifications
   */
  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  /**
   * Clear all errors
   */
  const clearErrors = useCallback(() => {
    setErrors([]);
  }, []);

  /**
   * Get error by ID
   */
  const getError = useCallback((id) => {
    return errors.find(e => e.id === id);
  }, [errors]);

  /**
   * Handle async operation with error handling
   */
  const handleAsync = useCallback(async (asyncFn, options = {}) => {
    try {
      return await asyncFn();
    } catch (error) {
      addError(error, options);
      throw error;
    }
  }, [addError]);

  const value = {
    errors,
    notifications,
    addError,
    showErrorNotification,
    showSuccess,
    showInfo,
    showWarning,
    dismissNotification,
    clearNotifications,
    clearErrors,
    getError,
    handleAsync,
  };

  return (
    <ErrorContext.Provider value={value}>
      {children}
    </ErrorContext.Provider>
  );
};

export default ErrorContext;