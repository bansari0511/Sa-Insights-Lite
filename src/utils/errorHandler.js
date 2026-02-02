/**
 * Centralized Error Handler
 * Provides utilities for consistent error handling across the application
 */

// Error types for categorization
export const ErrorTypes = {
  NETWORK: 'NETWORK_ERROR',
  API: 'API_ERROR',
  VALIDATION: 'VALIDATION_ERROR',
  AUTH: 'AUTHENTICATION_ERROR',
  PERMISSION: 'PERMISSION_ERROR',
  NOT_FOUND: 'NOT_FOUND_ERROR',
  DATABASE: 'DATABASE_ERROR',
  TIMEOUT: 'TIMEOUT_ERROR',
  UNKNOWN: 'UNKNOWN_ERROR',
  NEO4J: 'NEO4J_ERROR',
  ARCGIS: 'ARCGIS_ERROR',
};

// Error severity levels
export const ErrorSeverity = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
};

/**
 * Custom Application Error class
 */
export class AppError extends Error {
  constructor(message, type = ErrorTypes.UNKNOWN, severity = ErrorSeverity.MEDIUM, details = null) {
    super(message);
    this.name = 'AppError';
    this.type = type;
    this.severity = severity;
    this.details = details;
    this.timestamp = new Date().toISOString();
    this.isOperational = true; // Distinguishes operational errors from programming errors
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      type: this.type,
      severity: this.severity,
      details: this.details,
      timestamp: this.timestamp,
      stack: this.stack,
    };
  }
}

/**
 * Parse HTTP error responses
 */
export const parseHttpError = (error, response = null) => {
  const status = response?.status || error?.status;

  if (!status) {
    return new AppError(
      'Network error occurred. Please check your internet connection.',
      ErrorTypes.NETWORK,
      ErrorSeverity.HIGH,
      { originalError: error.message }
    );
  }

  switch (status) {
    case 400:
      return new AppError(
        'Invalid request. Please check your input.',
        ErrorTypes.VALIDATION,
        ErrorSeverity.LOW,
        { status, originalError: error.message }
      );
    case 401:
      return new AppError(
        'Authentication required. Please log in again.',
        ErrorTypes.AUTH,
        ErrorSeverity.HIGH,
        { status, originalError: error.message }
      );
    case 403:
      return new AppError(
        'You do not have permission to access this resource.',
        ErrorTypes.PERMISSION,
        ErrorSeverity.MEDIUM,
        { status, originalError: error.message }
      );
    case 404:
      return new AppError(
        'The requested resource was not found.',
        ErrorTypes.NOT_FOUND,
        ErrorSeverity.LOW,
        { status, originalError: error.message }
      );
    case 408:
      return new AppError(
        'Request timeout. Please try again.',
        ErrorTypes.TIMEOUT,
        ErrorSeverity.MEDIUM,
        { status, originalError: error.message }
      );
    case 500:
    case 502:
    case 503:
    case 504:
      return new AppError(
        'Server error occurred. Please try again later.',
        ErrorTypes.API,
        ErrorSeverity.HIGH,
        { status, originalError: error.message }
      );
    default:
      return new AppError(
        error.message || 'An unexpected error occurred.',
        ErrorTypes.API,
        ErrorSeverity.MEDIUM,
        { status, originalError: error.message }
      );
  }
};

/**
 * Parse Neo4j errors
 */
export const parseNeo4jError = (error) => {
  const errorMessage = error.message || error.toString();

  if (errorMessage.includes('connection')) {
    return new AppError(
      'Unable to connect to the database. Please try again later.',
      ErrorTypes.NEO4J,
      ErrorSeverity.HIGH,
      { originalError: errorMessage }
    );
  }

  if (errorMessage.includes('authentication') || errorMessage.includes('credentials')) {
    return new AppError(
      'Database authentication failed.',
      ErrorTypes.AUTH,
      ErrorSeverity.CRITICAL,
      { originalError: errorMessage }
    );
  }

  if (errorMessage.includes('syntax') || errorMessage.includes('cypher')) {
    return new AppError(
      'Database query error. Please contact support.',
      ErrorTypes.NEO4J,
      ErrorSeverity.MEDIUM,
      { originalError: errorMessage }
    );
  }

  return new AppError(
    'Database operation failed. Please try again.',
    ErrorTypes.DATABASE,
    ErrorSeverity.HIGH,
    { originalError: errorMessage }
  );
};

/**
 * Get user-friendly error message based on error type
 */
export const getUserFriendlyMessage = (error) => {
  if (error instanceof AppError) {
    return error.message;
  }

  if (error.message) {
    // Check for common error patterns
    if (error.message.includes('fetch') || error.message.includes('network')) {
      return 'Network connection error. Please check your internet connection.';
    }
    if (error.message.includes('timeout')) {
      return 'Request timed out. Please try again.';
    }
    if (error.message.includes('401') || error.message.includes('unauthorized')) {
      return 'Session expired. Please log in again.';
    }
    if (error.message.includes('403') || error.message.includes('forbidden')) {
      return 'You do not have permission to perform this action.';
    }
    if (error.message.includes('404') || error.message.includes('not found')) {
      return 'The requested resource was not found.';
    }
    if (error.message.includes('500') || error.message.includes('server error')) {
      return 'Server error occurred. Please try again later.';
    }
  }

  return 'An unexpected error occurred. Please try again.';
};

/**
 * Determine if error should be retried
 */
export const isRetryableError = (error) => {
  if (error instanceof AppError) {
    return [
      ErrorTypes.NETWORK,
      ErrorTypes.TIMEOUT,
      ErrorTypes.API,
    ].includes(error.type) &&
    error.severity !== ErrorSeverity.CRITICAL;
  }

  const errorMessage = error?.message?.toLowerCase() || '';
  return (
    errorMessage.includes('network') ||
    errorMessage.includes('timeout') ||
    errorMessage.includes('econnrefused') ||
    errorMessage.includes('503') ||
    errorMessage.includes('502')
  );
};

/**
 * Sanitize error data before logging (remove sensitive info)
 */
export const sanitizeError = (error) => {
  // Remove sensitive fields
  const sensitiveFields = ['password', 'token', 'apiKey', 'secret', 'authorization'];

  // Track visited objects to prevent infinite recursion from circular references
  const visited = new WeakSet();

  const removeSensitiveData = (obj, depth = 0) => {
    // Prevent excessively deep recursion (max depth of 20)
    if (depth > 20) return '[MAX_DEPTH_EXCEEDED]';

    if (typeof obj !== 'object' || obj === null) return obj;

    // Check for circular reference
    if (visited.has(obj)) {
      return '[CIRCULAR_REFERENCE]';
    }

    // Mark this object as visited
    visited.add(obj);

    try {
      const cleaned = Array.isArray(obj) ? [...obj] : { ...obj };

      Object.keys(cleaned).forEach(key => {
        if (sensitiveFields.some(field => key.toLowerCase().includes(field))) {
          cleaned[key] = '[REDACTED]';
        } else if (typeof cleaned[key] === 'object' && cleaned[key] !== null) {
          cleaned[key] = removeSensitiveData(cleaned[key], depth + 1);
        }
      });

      return cleaned;
    } catch (e) {
      // If any error occurs during sanitization, return a safe placeholder
      return '[SANITIZATION_ERROR]';
    }
  };

  try {
    // Handle non-object errors gracefully
    if (typeof error !== 'object' || error === null) {
      return { message: String(error) };
    }
    return removeSensitiveData(error);
  } catch (e) {
    // Fallback if sanitization fails entirely
    return { message: 'Error during sanitization', originalType: typeof error };
  }
};

/**
 * Handle errors in async functions with retry logic
 */
export const withRetry = async (fn, options = {}) => {
  const {
    maxRetries = 3,
    retryDelay = 1000,
    backoff = true,
    onRetry = null,
  } = options;

  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (attempt < maxRetries && isRetryableError(error)) {
        const delay = backoff ? retryDelay * Math.pow(2, attempt - 1) : retryDelay;

        if (onRetry) {
          onRetry(attempt, delay, error);
        }

        console.warn(`Retry attempt ${attempt}/${maxRetries} after ${delay}ms...`, error.message);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        break;
      }
    }
  }

  throw lastError;
};

/**
 * Wrap async function with error handling
 */
export const withErrorHandling = (fn, errorHandler = null) => {
  return async (...args) => {
    try {
      return await fn(...args);
    } catch (error) {
      const appError = error instanceof AppError ? error : parseHttpError(error);

      if (errorHandler) {
        errorHandler(appError);
      }

      throw appError;
    }
  };
};

export default {
  ErrorTypes,
  ErrorSeverity,
  AppError,
  parseHttpError,
  parseNeo4jError,
  getUserFriendlyMessage,
  isRetryableError,
  sanitizeError,
  withRetry,
  withErrorHandling,
};