import React from 'react';
import { Grid, Box, Card, Typography } from '@mui/material';

// components
import PageContainer from 'src/components/container/PageContainer';
import Logo from 'src/layouts/full/shared/logo/Logo';
import AuthLogin from './auth/AuthLogin';
import appConfig from 'src/config/appConfig';

// Network/Link Analysis SVG Component
const NetworkGraphic = () => (
  <svg
    viewBox="0 0 400 300"
    style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      opacity: 0.15,
      pointerEvents: 'none',
    }}
  >
    {/* Connection lines */}
    <line x1="50" y1="50" x2="150" y2="100" stroke="url(#lineGradient)" strokeWidth="2" />
    <line x1="150" y1="100" x2="250" y2="60" stroke="url(#lineGradient)" strokeWidth="2" />
    <line x1="150" y1="100" x2="200" y2="180" stroke="url(#lineGradient)" strokeWidth="2" />
    <line x1="250" y1="60" x2="350" y2="120" stroke="url(#lineGradient)" strokeWidth="2" />
    <line x1="200" y1="180" x2="300" y2="220" stroke="url(#lineGradient)" strokeWidth="2" />
    <line x1="200" y1="180" x2="100" y2="240" stroke="url(#lineGradient)" strokeWidth="2" />
    <line x1="350" y1="120" x2="300" y2="220" stroke="url(#lineGradient)" strokeWidth="2" />
    <line x1="100" y1="240" x2="200" y2="280" stroke="url(#lineGradient)" strokeWidth="2" />
    <line x1="300" y1="220" x2="200" y2="280" stroke="url(#lineGradient)" strokeWidth="2" />
    <line x1="50" y1="50" x2="100" y2="150" stroke="url(#lineGradient)" strokeWidth="1.5" />
    <line x1="100" y1="150" x2="100" y2="240" stroke="url(#lineGradient)" strokeWidth="1.5" />

    {/* Nodes */}
    <circle cx="50" cy="50" r="8" fill="url(#nodeGradient)" />
    <circle cx="150" cy="100" r="12" fill="url(#nodeGradient)" />
    <circle cx="250" cy="60" r="10" fill="url(#nodeGradient)" />
    <circle cx="200" cy="180" r="14" fill="url(#nodeGradient)" />
    <circle cx="350" cy="120" r="8" fill="url(#nodeGradient)" />
    <circle cx="300" cy="220" r="10" fill="url(#nodeGradient)" />
    <circle cx="100" cy="240" r="9" fill="url(#nodeGradient)" />
    <circle cx="200" cy="280" r="11" fill="url(#nodeGradient)" />
    <circle cx="100" cy="150" r="6" fill="url(#nodeGradient)" />

    {/* Gradients */}
    <defs>
      <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#1976d2" />
        <stop offset="100%" stopColor="#7c4dff" />
      </linearGradient>
      <radialGradient id="nodeGradient">
        <stop offset="0%" stopColor="#42a5f5" />
        <stop offset="100%" stopColor="#1565c0" />
      </radialGradient>
    </defs>
  </svg>
);

const Login2 = () => {

  return (
    <PageContainer title="Login" description={`${appConfig.appName} - ${appConfig.tagline}`}>
      <Box
        sx={{
          position: 'relative',
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 25%, #1565c0 50%, #1976d2 75%, #42a5f5 100%)',
          '&:before': {
            content: '""',
            background: 'radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(66, 165, 245, 0.3) 0%, transparent 50%)',
            position: 'absolute',
            height: '100%',
            width: '100%',
          },
        }}
      >
        {/* Network Graphics Background */}
        <NetworkGraphic />

        <Grid container spacing={0} justifyContent="center" sx={{ height: '100vh' }}>
          <Grid
            item
            xs={12}
            sm={12}
            lg={4}
            xl={3}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Card
              elevation={12}
              sx={{
                p: 4,
                zIndex: 1,
                width: '100%',
                maxWidth: '500px',
                backdropFilter: 'blur(10px)',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: 3,
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <Box display="flex" alignItems="center" justifyContent="center">
                <Logo />
              </Box>
              <AuthLogin
                subtext={
                  <Typography
                    variant="body1"
                    textAlign="center"
                    sx={{
                      color: 'rgba(25, 118, 210, 0.9)',
                      fontSize: '1rem',
                      mb: 1,
                      fontWeight: 500,
                    }}
                  >
                    {appConfig.tagline}
                  </Typography>
                }
              />
            </Card>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default Login2;
