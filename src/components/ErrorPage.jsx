import React from 'react';
import { Box, Typography, Button, useTheme } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import HomeIcon from '@mui/icons-material/Home';
import logo from 'src/assets/images/logos/logo_landing.png';
import appConfig from 'src/config/appConfig';

/**
 * User-friendly error page that maintains app branding
 * Shows minimal header with logo for identity
 */
const ErrorPage = ({ error, resetError, showDetails = false }) => {
  const theme = useTheme();

  const handleGoHome = () => {
    window.location.href = '/saaransh/';
  };

  const handleRefresh = () => {
    if (resetError) {
      resetError();
    } else {
      window.location.reload();
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        background: theme.palette.mode === 'dark'
          ? 'linear-gradient(135deg, #0a0e1a 0%, #1a1f2e 100%)'
          : 'linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Mini Header for App Identity */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          p: 2,
          borderBottom: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Box
          component="img"
          src={logo}
          alt={appConfig.appName}
          sx={{
            width: 40,
            height: 40,
            objectFit: 'contain',
          }}
        />
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {appConfig.appName}
        </Typography>
      </Box>

      {/* Error Content */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: 4,
          textAlign: 'center',
        }}
      >
        {/* Error Icon */}
        <Box
          sx={{
            width: 120,
            height: 120,
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${theme.palette.error.light}20 0%, ${theme.palette.error.main}10 100%)`,
            border: `2px solid ${theme.palette.error.light}40`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 4,
          }}
        >
          <Typography sx={{ fontSize: '3.5rem' }}>⚠️</Typography>
        </Box>

        <Typography
          variant="h3"
          gutterBottom
          sx={{
            fontWeight: 700,
            color: theme.palette.text.primary,
            mb: 2,
          }}
        >
          Something went wrong
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: theme.palette.text.secondary,
            mb: 4,
            maxWidth: 500,
            lineHeight: 1.6,
          }}
        >
          We apologize for the inconvenience. An unexpected error has occurred.
          Please try refreshing the page or return to the home page.
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            size="large"
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            Try Again
          </Button>
          <Button
            variant="outlined"
            startIcon={<HomeIcon />}
            onClick={handleGoHome}
            size="large"
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            Go to Home
          </Button>
        </Box>

        {/* Error Reference */}
        <Typography
          variant="caption"
          sx={{
            color: theme.palette.text.disabled,
            fontFamily: 'monospace',
          }}
        >
          Error Reference: {Date.now().toString(36).toUpperCase()}
        </Typography>

        {/* Technical details only in development */}
        {showDetails && error && import.meta.env.DEV && (
          <Box
            sx={{
              mt: 4,
              p: 2,
              maxWidth: 600,
              backgroundColor: theme.palette.action.hover,
              borderRadius: 1,
              textAlign: 'left',
            }}
          >
            <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace', fontSize: '0.7rem' }}>
              {error.toString()}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Footer */}
      <Box
        sx={{
          p: 2,
          borderTop: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.paper,
          textAlign: 'center',
        }}
      >
        <Typography variant="caption" color="text.secondary">
          {appConfig.appName} • Powered by {appConfig.companyName}
        </Typography>
      </Box>
    </Box>
  );
};

export default ErrorPage;
