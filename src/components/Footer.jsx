import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Divider,
  useTheme,
} from '@mui/material';
import {
  GitHub,
  LinkedIn,
  Twitter,
  Facebook,
  Email,
  Phone,
  LocationOn,
} from '@mui/icons-material';

const Footer = () => {
  const theme = useTheme();
  const grey = theme.palette.grey;

  return (
    <Box
      component="footer"
      sx={{
        background: `linear-gradient(135deg, ${grey[50]} 0%, ${grey[200]} 100%)`,
        color: grey[600],
        borderTop: `1px solid ${theme.palette.divider}`,
        boxShadow: `0 -2px 10px ${grey[200]}40`,
        mt: 'auto',
        py: 3,
        position: 'relative',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          {/* Company Info */}
          <Grid item xs={12} md={4}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: grey[700],
                mb: 1,
                fontSize: '1.1rem',
              }}
            >
              Your Company
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: grey[500],
                mb: 2,
                lineHeight: 1.5,
                fontSize: '0.875rem',
              }}
            >
              Creating modern, elegant solutions with cutting-edge technology.
            </Typography>

            {/* Contact Info */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Email sx={{
                fontSize: 16,
                mr: 1,
                color: theme.palette.accent.main,
              }} />
              <Typography variant="body2" sx={{ color: grey[500], fontSize: '0.8rem' }}>
                contact@yourcompany.com
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Phone sx={{
                fontSize: 16,
                mr: 1,
                color: theme.palette.accent.main,
              }} />
              <Typography variant="body2" sx={{ color: grey[500], fontSize: '0.8rem' }}>
                +1 (555) 123-4567
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LocationOn sx={{
                fontSize: 16,
                mr: 1,
                color: theme.palette.accent.main,
              }} />
              <Typography variant="body2" sx={{ color: grey[500], fontSize: '0.8rem' }}>
                123 Business St, City, State 12345
              </Typography>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                color: grey[700],
                mb: 1,
                fontSize: '0.95rem',
              }}
            >
              Quick Links
            </Typography>
            {[
              'Home',
              'About Us',
              'Services',
              'Portfolio',
              'Contact',
            ].map((item) => (
              <Link
                key={item}
                href="#"
                underline="none"
                sx={{
                  display: 'block',
                  color: grey[500],
                  fontSize: '0.8rem',
                  mb: 0.5,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    color: theme.palette.accent.main,
                    transform: 'translateX(2px)',
                  },
                }}
              >
                {item}
              </Link>
            ))}
          </Grid>

          {/* Services */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                color: grey[700],
                mb: 1,
                fontSize: '0.95rem',
              }}
            >
              Our Services
            </Typography>
            {[
              'Web Development',
              'Mobile Apps',
              'UI/UX Design',
              'Digital Marketing',
              'Cloud Solutions',
            ].map((item) => (
              <Link
                key={item}
                href="#"
                underline="none"
                sx={{
                  display: 'block',
                  color: grey[500],
                  fontSize: '0.8rem',
                  mb: 0.5,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    color: theme.palette.accent.main,
                    transform: 'translateX(2px)',
                  },
                }}
              >
                {item}
              </Link>
            ))}
          </Grid>

          {/* Social Media */}
          <Grid item xs={12} md={3}>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                color: grey[700],
                mb: 1,
                fontSize: '0.95rem',
              }}
            >
              Connect With Us
            </Typography>

            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              {[
                { icon: GitHub, href: '#' },
                { icon: LinkedIn, href: '#' },
                { icon: Twitter, href: '#' },
                { icon: Facebook, href: '#' },
              ].map((social, index) => (
                <IconButton
                  key={index}
                  href={social.href}
                  size="small"
                  sx={{
                    color: grey[500],
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 2,
                    width: 32,
                    height: 32,
                    transition: 'all 0.2s ease',
                    background: theme.palette.common.white,
                    '&:hover': {
                      color: theme.palette.accent.main,
                      backgroundColor: grey[100],
                      borderColor: theme.palette.accent.main,
                      transform: 'translateY(-1px)',
                    },
                  }}
                >
                  <social.icon fontSize="small" />
                </IconButton>
              ))}
            </Box>

            <Typography
              variant="body2"
              sx={{
                color: grey[500],
                lineHeight: 1.4,
                fontSize: '0.8rem',
              }}
            >
              Follow us for updates and insights.
            </Typography>
          </Grid>
        </Grid>

        <Divider
          sx={{
            my: 2,
            borderColor: theme.palette.divider,
          }}
        />

        {/* Copyright */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'flex-start', sm: 'center' },
            justifyContent: 'space-between',
            gap: 1,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: grey[500],
              fontSize: '0.8rem',
            }}
          >
            © {new Date().getFullYear()} Your Company. All rights reserved.
          </Typography>

          <Box sx={{ display: 'flex', gap: 2 }}>
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
              <Link
                key={item}
                href="#"
                underline="none"
                sx={{
                  color: grey[500],
                  fontSize: '0.8rem',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    color: theme.palette.accent.main,
                  },
                }}
              >
                {item}
              </Link>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;