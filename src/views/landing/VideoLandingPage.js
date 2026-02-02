import React from 'react';
import { Box, Typography, Button, Stack, Container, useTheme, useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Email as EmailIcon, Phone as PhoneIcon, LocationOn as LocationIcon } from '@mui/icons-material';
import { withOpacity } from '../../theme/palette';

/**
 * VideoLandingPage Component
 *
 * A professional landing page with:
 * - Full-screen background video with dark overlay
 * - Main content positioned in top-left corner
 * - Contact information in bottom-right corner
 * - Responsive design for all screen sizes
 * - Modern hover effects and animations
 */
const VideoLandingPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
        background: theme.palette.primary[900],
      }}
    >
      {/* Background Video */}
      <Box
        component="video"
        autoPlay
        loop
        muted
        playsInline
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 0,
        }}
      >
        <source src="/assets/video/your-video.mp4" type="video/mp4" />
        {/* Fallback for browsers that don't support video */}
        Your browser does not support the video tag.
      </Box>

      {/* Dark Overlay for Content Readability */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: `linear-gradient(135deg,
            ${withOpacity(theme.palette.primary[900], 0.85)} 0%,
            ${withOpacity(theme.palette.primary[800], 0.75)} 50%,
            ${withOpacity(theme.palette.primary[900], 0.9)} 100%
          )`,
          zIndex: 1,
        }}
      />

      {/* Decorative Gradient Overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: `
            radial-gradient(circle at top left, ${withOpacity(theme.palette.primary[600], 0.3)} 0%, transparent 50%),
            radial-gradient(circle at bottom right, ${withOpacity(theme.palette.primary[500], 0.2)} 0%, transparent 50%)
          `,
          zIndex: 2,
        }}
      />

      {/* Main Content - Top Left Corner */}
      <Box
        sx={{
          position: 'absolute',
          top: { xs: 40, sm: 60, md: 80 },
          left: { xs: 24, sm: 40, md: 60 },
          zIndex: 3,
          maxWidth: { xs: 'calc(100% - 48px)', sm: '520px', md: '600px' },
        }}
      >
        {/* Logo/Brand Name */}
        <Typography
          variant="h6"
          sx={{
            color: theme.palette.primary[300],
            fontWeight: 700,
            fontSize: { xs: '0.9rem', sm: '1rem' },
            textTransform: 'uppercase',
            letterSpacing: '3px',
            mb: { xs: 4, sm: 6 },
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            '&::before': {
              content: '""',
              width: '40px',
              height: '2px',
              background: `linear-gradient(90deg,
                ${theme.palette.primary[400]} 0%,
                transparent 100%
              )`,
            },
          }}
        >
          SAARANSH
        </Typography>

        {/* Main Heading */}
        <Typography
          variant="h1"
          sx={{
            color: theme.palette.common.white,
            fontWeight: 800,
            fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
            lineHeight: 1.1,
            mb: 3,
            textShadow: `
              0 4px 20px ${withOpacity(theme.palette.primary[900], 0.6)},
              0 2px 10px rgba(0, 0, 0, 0.8)
            `,
            background: `linear-gradient(135deg,
              ${theme.palette.common.white} 0%,
              ${theme.palette.primary[100]} 100%
            )`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Intelligence
          <br />
          Reimagined
        </Typography>

        {/* Subheading */}
        <Typography
          variant="h5"
          sx={{
            color: theme.palette.primary[200],
            fontWeight: 400,
            fontSize: { xs: '1rem', sm: '1.25rem', md: '1.4rem' },
            lineHeight: 1.6,
            mb: 5,
            maxWidth: { xs: '100%', md: '500px' },
            textShadow: `0 2px 8px ${withOpacity(theme.palette.primary[900], 0.8)}`,
          }}
        >
          Advanced intelligence analysis platform for defense and security professionals
        </Typography>

        {/* Call-to-Action Buttons */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{ mb: 4 }}
        >
          {/* Primary CTA Button */}
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/dashboard')}
            sx={{
              px: 4,
              py: 1.8,
              borderRadius: '12px',
              fontSize: '1rem',
              fontWeight: 600,
              textTransform: 'none',
              color: theme.palette.common.white,
              background: `linear-gradient(135deg,
                ${theme.palette.primary.main} 0%,
                ${theme.palette.primary[600]} 100%
              )`,
              border: `2px solid ${theme.palette.primary[500]}`,
              boxShadow: `
                0 8px 24px ${withOpacity(theme.palette.primary[600], 0.4)},
                0 4px 12px rgba(0, 0, 0, 0.3),
                inset 0 1px 0 ${withOpacity(theme.palette.common.white, 0.2)}
              `,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                background: `linear-gradient(135deg,
                  ${theme.palette.primary[600]} 0%,
                  ${theme.palette.primary[700]} 100%
                )`,
                transform: 'translateY(-3px)',
                boxShadow: `
                  0 12px 32px ${withOpacity(theme.palette.primary[600], 0.5)},
                  0 6px 16px rgba(0, 0, 0, 0.4),
                  inset 0 1px 0 ${withOpacity(theme.palette.common.white, 0.3)}
                `,
              },
              '&:active': {
                transform: 'translateY(-1px)',
              },
            }}
          >
            Get Started
          </Button>

          {/* Secondary CTA Button */}
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate('/about')}
            sx={{
              px: 4,
              py: 1.8,
              borderRadius: '12px',
              fontSize: '1rem',
              fontWeight: 600,
              textTransform: 'none',
              color: theme.palette.common.white,
              background: withOpacity(theme.palette.common.white, 0.1),
              border: `2px solid ${withOpacity(theme.palette.common.white, 0.3)}`,
              backdropFilter: 'blur(10px)',
              boxShadow: `
                0 4px 16px ${withOpacity(theme.palette.primary[900], 0.3)},
                inset 0 1px 0 ${withOpacity(theme.palette.common.white, 0.1)}
              `,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                background: withOpacity(theme.palette.common.white, 0.2),
                border: `2px solid ${withOpacity(theme.palette.common.white, 0.5)}`,
                transform: 'translateY(-3px)',
                boxShadow: `
                  0 8px 24px ${withOpacity(theme.palette.primary[900], 0.4)},
                  inset 0 1px 0 ${withOpacity(theme.palette.common.white, 0.2)}
                `,
              },
              '&:active': {
                transform: 'translateY(-1px)',
              },
            }}
          >
            Learn More
          </Button>
        </Stack>

        {/* Feature Highlights */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={{ xs: 2, sm: 4 }}
          sx={{ mt: { xs: 4, sm: 6 } }}
        >
          {[
            { label: 'Real-time', value: 'Intelligence' },
            { label: 'Global', value: 'Coverage' },
            { label: 'Secure', value: 'Platform' },
          ].map((item, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 0.5,
              }}
            >
              <Typography
                sx={{
                  color: theme.palette.primary[300],
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '1.5px',
                }}
              >
                {item.label}
              </Typography>
              <Typography
                sx={{
                  color: theme.palette.common.white,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                }}
              >
                {item.value}
              </Typography>
            </Box>
          ))}
        </Stack>
      </Box>

      {/* Contact Information - Bottom Right Corner */}
      <Box
        sx={{
          position: 'absolute',
          bottom: { xs: 30, sm: 40, md: 60 },
          right: { xs: 24, sm: 40, md: 60 },
          zIndex: 3,
          background: withOpacity(theme.palette.primary[900], 0.6),
          backdropFilter: 'blur(20px)',
          borderRadius: '16px',
          border: `1px solid ${withOpacity(theme.palette.common.white, 0.1)}`,
          p: { xs: 2.5, sm: 3 },
          boxShadow: `
            0 8px 32px ${withOpacity(theme.palette.primary[900], 0.6)},
            inset 0 1px 0 ${withOpacity(theme.palette.common.white, 0.1)}
          `,
        }}
      >
        {/* Contact Heading */}
        <Typography
          sx={{
            color: theme.palette.primary[200],
            fontSize: '0.85rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '2px',
            mb: 2.5,
          }}
        >
          Contact Us
        </Typography>

        {/* Contact Items */}
        <Stack spacing={2}>
          {/* Email */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              transition: 'all 0.2s ease',
              cursor: 'pointer',
              '&:hover': {
                transform: 'translateX(5px)',
                '& .contact-icon': {
                  background: theme.palette.primary.main,
                  transform: 'scale(1.1)',
                },
              },
            }}
          >
            <Box
              className="contact-icon"
              sx={{
                width: 36,
                height: 36,
                borderRadius: '10px',
                background: withOpacity(theme.palette.primary[600], 0.3),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
              }}
            >
              <EmailIcon sx={{ color: theme.palette.common.white, fontSize: 18 }} />
            </Box>
            <Box>
              <Typography
                sx={{
                  color: theme.palette.primary[300],
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                }}
              >
                Email
              </Typography>
              <Typography
                sx={{
                  color: theme.palette.common.white,
                  fontSize: '0.9rem',
                  fontWeight: 500,
                }}
              >
                info@saaransh.com
              </Typography>
            </Box>
          </Box>

          {/* Phone */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              transition: 'all 0.2s ease',
              cursor: 'pointer',
              '&:hover': {
                transform: 'translateX(5px)',
                '& .contact-icon': {
                  background: theme.palette.primary.main,
                  transform: 'scale(1.1)',
                },
              },
            }}
          >
            <Box
              className="contact-icon"
              sx={{
                width: 36,
                height: 36,
                borderRadius: '10px',
                background: withOpacity(theme.palette.primary[600], 0.3),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
              }}
            >
              <PhoneIcon sx={{ color: theme.palette.common.white, fontSize: 18 }} />
            </Box>
            <Box>
              <Typography
                sx={{
                  color: theme.palette.primary[300],
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                }}
              >
                Phone
              </Typography>
              <Typography
                sx={{
                  color: theme.palette.common.white,
                  fontSize: '0.9rem',
                  fontWeight: 500,
                }}
              >
                +1 (555) 123-4567
              </Typography>
            </Box>
          </Box>

          {/* Location */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              transition: 'all 0.2s ease',
              cursor: 'pointer',
              '&:hover': {
                transform: 'translateX(5px)',
                '& .contact-icon': {
                  background: theme.palette.primary.main,
                  transform: 'scale(1.1)',
                },
              },
            }}
          >
            <Box
              className="contact-icon"
              sx={{
                width: 36,
                height: 36,
                borderRadius: '10px',
                background: withOpacity(theme.palette.primary[600], 0.3),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
              }}
            >
              <LocationIcon sx={{ color: theme.palette.common.white, fontSize: 18 }} />
            </Box>
            <Box>
              <Typography
                sx={{
                  color: theme.palette.primary[300],
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                }}
              >
                Location
              </Typography>
              <Typography
                sx={{
                  color: theme.palette.common.white,
                  fontSize: '0.9rem',
                  fontWeight: 500,
                }}
              >
                Washington, DC
              </Typography>
            </Box>
          </Box>
        </Stack>
      </Box>

      {/* Scroll Indicator - Bottom Center */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 30,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 3,
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          alignItems: 'center',
          gap: 1,
          animation: 'bounce 2s infinite',
          '@keyframes bounce': {
            '0%, 100%': {
              transform: 'translateX(-50%) translateY(0)',
            },
            '50%': {
              transform: 'translateX(-50%) translateY(-10px)',
            },
          },
        }}
      >
        <Typography
          sx={{
            color: theme.palette.primary[300],
            fontSize: '0.75rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '2px',
          }}
        >
          Scroll
        </Typography>
        <Box
          sx={{
            width: '2px',
            height: '30px',
            background: `linear-gradient(180deg,
              ${theme.palette.primary[400]} 0%,
              transparent 100%
            )`,
          }}
        />
      </Box>
    </Box>
  );
};

export default VideoLandingPage;
