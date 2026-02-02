import React from 'react';
import { Box, Typography, Button, Collapse } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import logger from '../utils/errorLogger';
import { AppError, ErrorTypes, ErrorSeverity } from '../utils/errorHandler';
import ErrorPage from './ErrorPage';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to error logger
    const appError = error instanceof AppError ? error : new AppError(
      error.message || 'Component render error',
      ErrorTypes.UNKNOWN,
      ErrorSeverity.HIGH,
      {
        componentStack: errorInfo.componentStack,
        originalError: error,
      }
    );

    logger.logComponentError(
      this.props.fallbackComponentName || 'Unknown Component',
      appError,
      { errorInfo }
    );

    this.setState({
      error: error,
      errorInfo: errorInfo,
    });

    // Call optional error handler from props
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
    });

    // Call optional reset handler
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  toggleDetails = () => {
    this.setState(prev => ({ showDetails: !prev.showDetails }));
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback({
          error: this.state.error,
          errorInfo: this.state.errorInfo,
          resetError: this.handleReset,
        });
      }

      // Use branded ErrorPage component
      return (
        <ErrorPage
          error={this.state.error}
          resetError={this.handleReset}
          showDetails={import.meta.env.DEV}
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;