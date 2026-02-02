import React from 'react';
import { Card, CardContent, Typography, Stack, Box, useTheme } from '@mui/material';

// Memoized to prevent unnecessary re-renders when parent re-renders
const DashboardCard = React.memo(({
  title,
  subtitle,
  children,
  action,
  footer,
  cardheading,
  headtitle,
  headsubtitle,
  middlecontent,
}) => {
  const theme = useTheme();

  return (
    <Card
      sx={{ padding: 0 }}
      elevation={9}
      variant={undefined}
    >
      {cardheading ? (
        <CardContent>
          <Typography
            variant="h4"
            sx={{
              fontWeight: theme.custom.tokens.fontWeight.bold,
              color: theme.palette.brand.deepPurple,
              mb: 1,
              background: theme.palette.brand.gradientPrimary,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {headtitle}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: theme.palette.text.secondary,
              fontSize: '1rem',
            }}
          >
            {headsubtitle}
          </Typography>
        </CardContent>
      ) : (
        <CardContent sx={{ p: "30px" }}>
          {title ? (
            <Stack
              direction="row"
              spacing={2}
              justifyContent="space-between"
              alignItems={'center'}
              mb={3}
            >
              <Box>
                {title ? (
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: theme.custom.tokens.fontWeight.bold,
                      color: theme.palette.brand.deepPurple,
                      mb: 1,
                      background: theme.palette.brand.gradientPrimary,
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    {title}
                  </Typography>
                ) : ''}

                {subtitle ? (
                  <Typography
                    variant="body1"
                    sx={{
                      color: theme.palette.text.secondary,
                      fontSize: '1rem',
                    }}
                  >
                    {subtitle}
                  </Typography>
                ) : (
                  ''
                )}
              </Box>
              {action}
            </Stack>
          ) : null}

          {children}
        </CardContent>
      )}

      {middlecontent}
      {footer}
    </Card>
  );
});

DashboardCard.displayName = 'DashboardCard';

export default DashboardCard;
