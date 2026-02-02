/**
 * Error Logger Service
 * Provides centralized error logging with different levels and optional remote logging
 */

import { sanitizeError } from './errorHandler';

// Log levels
export const LogLevel = {
  DEBUG: 'debug',
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error',
  FATAL: 'fatal',
};

class ErrorLogger {
  constructor() {
    this.logs = [];
    this.maxLogs = 1000; // Keep last 1000 logs in memory
    this.remoteLoggingEnabled = false;
    this.remoteLoggingUrl = null;
  }

  /**
   * Configure remote logging
   */
  configureRemoteLogging(url) {
    this.remoteLoggingUrl = url;
    this.remoteLoggingEnabled = !!url;
  }

  /**
   * Log message with context
   */
  log(level, message, context = {}) {
    const logEntry = {
      level,
      message,
      context: sanitizeError(context),
      timestamp: new Date().toISOString(),
      userAgent: navigator?.userAgent,
      url: window?.location?.href,
    };

    // Add to in-memory logs
    this.logs.push(logEntry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Console logging with appropriate method
    this._logToConsole(level, message, context);

    // Send to remote logging service if configured
    if (this.remoteLoggingEnabled && [LogLevel.ERROR, LogLevel.FATAL].includes(level)) {
      this._sendToRemote(logEntry);
    }

    return logEntry;
  }

  /**
   * Log to browser console
   */
  _logToConsole(level, message, context) {
    const prefix = `[${new Date().toISOString()}] [${level.toUpperCase()}]`;

    switch (level) {
      case LogLevel.DEBUG:
        console.debug(prefix, message, context);
        break;
      case LogLevel.INFO:
        console.info(prefix, message, context);
        break;
      case LogLevel.WARN:
        console.warn(prefix, message, context);
        break;
      case LogLevel.ERROR:
      case LogLevel.FATAL:
        console.error(prefix, message, context);
        break;
      default:
        console.log(prefix, message, context);
    }
  }

  /**
   * Send log to remote logging service
   */
  async _sendToRemote(logEntry) {
    if (!this.remoteLoggingUrl) return;

    try {
      await fetch(this.remoteLoggingUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(logEntry),
      });
    } catch (error) {
      // Fail silently to avoid infinite loop
      console.error('Failed to send log to remote service:', error);
    }
  }

  /**
   * Debug level logging
   */
  debug(message, context = {}) {
    return this.log(LogLevel.DEBUG, message, context);
  }

  /**
   * Info level logging
   */
  info(message, context = {}) {
    return this.log(LogLevel.INFO, message, context);
  }

  /**
   * Warning level logging
   */
  warn(message, context = {}) {
    return this.log(LogLevel.WARN, message, context);
  }

  /**
   * Error level logging
   */
  error(message, error = null, context = {}) {
    return this.log(LogLevel.ERROR, message, {
      ...context,
      error: error ? {
        message: error.message,
        stack: error.stack,
        name: error.name,
        type: error.type,
        ...error,
      } : null,
    });
  }

  /**
   * Fatal level logging
   */
  fatal(message, error = null, context = {}) {
    return this.log(LogLevel.FATAL, message, {
      ...context,
      error: error ? {
        message: error.message,
        stack: error.stack,
        name: error.name,
        type: error.type,
        ...error,
      } : null,
    });
  }

  /**
   * Log API errors
   */
  logApiError(endpoint, method, error, request = null) {
    return this.error(`API Error: ${method} ${endpoint}`, error, {
      endpoint,
      method,
      request: request ? sanitizeError(request) : null,
    });
  }

  /**
   * Log Neo4j errors
   */
  logNeo4jError(query, error, params = null) {
    return this.error('Neo4j Query Error', error, {
      query: query?.substring(0, 200), // Truncate long queries
      params: params ? sanitizeError(params) : null,
    });
  }

  /**
   * Log component errors
   */
  logComponentError(componentName, error, props = null) {
    return this.error(`Component Error: ${componentName}`, error, {
      componentName,
      props: props ? sanitizeError(props) : null,
    });
  }

  /**
   * Get recent logs
   */
  getRecentLogs(count = 100, level = null) {
    let logs = [...this.logs];

    if (level) {
      logs = logs.filter(log => log.level === level);
    }

    return logs.slice(-count);
  }

  /**
   * Clear logs
   */
  clearLogs() {
    this.logs = [];
  }

  /**
   * Export logs as JSON
   */
  exportLogs() {
    return JSON.stringify(this.logs, null, 2);
  }

  /**
   * Download logs as file
   */
  downloadLogs() {
    const dataStr = this.exportLogs();
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `error-logs-${new Date().toISOString()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

// Create singleton instance
const logger = new ErrorLogger();

export default logger;