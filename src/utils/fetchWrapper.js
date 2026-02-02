/**
 * Fetch Wrapper with Error Handling and Retry Logic
 * Provides a robust wrapper around the native fetch API
 */

import { AppError, ErrorTypes, ErrorSeverity, parseHttpError, withRetry } from './errorHandler';
import logger from './errorLogger';

/**
 * Enhanced fetch with automatic retry and error handling
 */
export const fetchWithRetry = async (url, options = {}, retryOptions = {}) => {
  const {
    maxRetries = 3,
    retryDelay = 1000,
    timeout = 30000,
    onRetry = null,
  } = retryOptions;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  const fetchOptions = {
    ...options,
    signal: controller.signal,
  };

  try {
    const result = await withRetry(
      async () => {
        const response = await fetch(url, fetchOptions);

        if (!response.ok) {
          const errorText = await response.text().catch(() => response.statusText);
          throw new AppError(
            errorText || `HTTP ${response.status}: ${response.statusText}`,
            ErrorTypes.API,
            response.status >= 500 ? ErrorSeverity.HIGH : ErrorSeverity.MEDIUM,
            {
              status: response.status,
              statusText: response.statusText,
              url,
              method: fetchOptions.method || 'GET',
            }
          );
        }

        return response;
      },
      {
        maxRetries,
        retryDelay,
        onRetry: (attempt, delay, error) => {
          logger.warn(`Retrying request to ${url}`, { attempt, delay, error: error.message });
          if (onRetry) {
            onRetry(attempt, delay, error);
          }
        },
      }
    );

    clearTimeout(timeoutId);
    return result;
  } catch (error) {
    clearTimeout(timeoutId);

    // Handle abort/timeout
    if (error.name === 'AbortError') {
      const timeoutError = new AppError(
        'Request timeout. Please try again.',
        ErrorTypes.TIMEOUT,
        ErrorSeverity.MEDIUM,
        { url, timeout }
      );
      logger.logApiError(url, fetchOptions.method || 'GET', timeoutError);
      throw timeoutError;
    }

    // Handle network errors
    if (error.message.includes('fetch') || error.message.includes('network')) {
      const networkError = new AppError(
        'Network error. Please check your connection.',
        ErrorTypes.NETWORK,
        ErrorSeverity.HIGH,
        { url, originalError: error.message }
      );
      logger.logApiError(url, fetchOptions.method || 'GET', networkError);
      throw networkError;
    }

    // Re-throw AppError or wrap unknown errors
    if (error instanceof AppError) {
      logger.logApiError(url, fetchOptions.method || 'GET', error);
      throw error;
    }

    const wrappedError = parseHttpError(error);
    logger.logApiError(url, fetchOptions.method || 'GET', wrappedError);
    throw wrappedError;
  }
};

/**
 * Fetch JSON with error handling
 */
export const fetchJSON = async (url, options = {}, retryOptions = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const response = await fetchWithRetry(url, { ...options, headers }, retryOptions);

  try {
    const data = await response.json();
    return data;
  } catch (error) {
    throw new AppError(
      'Invalid JSON response from server.',
      ErrorTypes.API,
      ErrorSeverity.MEDIUM,
      { url, originalError: error.message }
    );
  }
};

/**
 * POST JSON with error handling
 */
export const postJSON = async (url, body, options = {}, retryOptions = {}) => {
  return fetchJSON(
    url,
    {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
    },
    retryOptions
  );
};

/**
 * PUT JSON with error handling
 */
export const putJSON = async (url, body, options = {}, retryOptions = {}) => {
  return fetchJSON(
    url,
    {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body),
    },
    retryOptions
  );
};

/**
 * DELETE with error handling
 */
export const deleteRequest = async (url, options = {}, retryOptions = {}) => {
  const response = await fetchWithRetry(
    url,
    {
      ...options,
      method: 'DELETE',
    },
    retryOptions
  );

  // Check if response has content
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }

  return { success: true };
};

/**
 * GET with error handling
 */
export const get = async (url, options = {}, retryOptions = {}) => {
  return fetchWithRetry(url, { ...options, method: 'GET' }, retryOptions);
};

/**
 * Check if service is available (health check)
 */
export const checkServiceHealth = async (url, timeout = 5000) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    return false;
  }
};

export default {
  fetchWithRetry,
  fetchJSON,
  postJSON,
  putJSON,
  deleteRequest,
  get,
  checkServiceHealth,
};