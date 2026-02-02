import { useState, useEffect, useRef } from 'react';
import { withOpacity } from '../../theme/palette';
import {
  Box,
  Typography,
  Button,
  styled,
  keyframes,
  useTheme
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  Rocket as RocketIcon,
  Email as EmailIcon,
  Phone as PhoneIcon
} from '@mui/icons-material';
import logo from 'src/assets/images/logos/logo_landing.png';
// Video background imported from assets
import backgroundVideo from 'src/assets/video/videoplayback.mp4';
import appConfig from 'src/config/appConfig';


const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideInLeft = keyframes`
  from { opacity: 0; transform: translateX(-60px); }
  to { opacity: 1; transform: translateX(0); }
`;

const scaleIn = keyframes`
  from { opacity: 0; transform: scale(0.8); }
  to { opacity: 1; transform: scale(1); }
`;

const particleFloat = keyframes`
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  25% { transform: translate(15px, -25px) rotate(90deg); }
  50% { transform: translate(-20px, -50px) rotate(180deg); }
  75% { transform: translate(-15px, -25px) rotate(270deg); }
`;

const blinkCursor = keyframes`
  from, to { backgroundColor: transparent; }
  50% { backgroundColor: #00bfff; }
`;

// Styled Components
const StyledContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  width: '100vw',
  position: 'relative',
  overflow: 'hidden',
  background: '#0a0e1a',
  display: 'flex',
  // Very light overlay for best video clarity
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(10, 14, 26, 0.4)', // Minimal overlay for maximum video visibility
    zIndex: 1,
  },
}));

// Video Background Component - Best clarity without contrast
const VideoBackground = styled('video')({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  zIndex: 0,
  opacity: 0.8, // High opacity for best clarity
  filter: 'brightness(1)', // Natural brightness, no contrast
});

const ContentWrapper = styled(Box)({
  position: 'relative',
  zIndex: 2,
  width: '100%',
  minHeight: '100vh',
  display: 'flex',
  padding: '20px 50px', // Minimal top padding for top positioning
  alignItems: 'flex-start', // Align to top
  '@media (max-width: 960px)': {
    padding: '15px 20px',
    flexDirection: 'column',
  },
});

const FloatingParticle = styled(Box)(({ size, top, left, delay, duration, theme }) => ({
  position: 'absolute',
  width: size,
  height: size,
  borderRadius: '50%',
  background: `radial-gradient(circle, ${withOpacity(theme.palette.brand.cyan, 0.8)}, rgba(0, 191, 255, 0.4))`,
  top: top,
  left: left,
  animation: `${particleFloat} ${duration}s ease-in-out infinite`,
  animationDelay: delay,
  boxShadow: `0 0 20px ${withOpacity(theme.palette.brand.cyan, 0.6)}`,
  pointerEvents: 'none',
  zIndex: 1,
}));

const GlowingLogo = styled(Box)(({ theme }) => ({
  width: 110,
  height: 110,
  background: `linear-gradient(135deg,
    rgba(10, 14, 26, 0.9) 0%,
    rgba(20, 30, 50, 0.85) 100%
  )`,
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border: `2.5px solid ${withOpacity(theme.palette.brand.cyan, 0.35)}`,
  borderRadius: '20px',
  position: 'relative',
  boxShadow: `
    0 4px 24px ${withOpacity(theme.palette.brand.cyan, 0.25)},
    0 2px 12px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 ${withOpacity(theme.palette.common.white, 0.1)}
  `,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-3px) scale(1.02)',
    borderColor: withOpacity(theme.palette.brand.cyan, 0.5),
    boxShadow: `
      0 6px 28px ${withOpacity(theme.palette.brand.cyan, 0.35)},
      0 3px 16px rgba(0, 0, 0, 0.4)
    `,
  },
}));

const CTAButton = styled(Button)(({ theme }) => ({
  fontSize: '1.15rem',
  padding: '16px 45px',
  borderRadius: '14px',
  background: `linear-gradient(135deg,
    ${theme.palette.brand.cyan} 0%,
    #00bfff 50%,
    ${theme.palette.brand.cyan} 100%
  )`,
  backgroundSize: '200% auto',
  color: 'white',
  fontWeight: 700,
  textTransform: 'none',
  border: `2px solid ${withOpacity(theme.palette.brand.cyan, 0.5)}`,
  boxShadow: `
    0 8px 28px ${withOpacity(theme.palette.brand.cyan, 0.4)},
    0 4px 14px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 ${withOpacity(theme.palette.common.white, 0.2)}
  `,
  transition: 'all 0.3s ease',
  letterSpacing: '0.5px',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-2px)',
    backgroundPosition: 'right center',
    boxShadow: `
      0 12px 36px ${withOpacity(theme.palette.brand.cyan, 0.5)},
      0 6px 18px rgba(0, 0, 0, 0.4)
    `,
    borderColor: withOpacity(theme.palette.brand.cyan, 0.7),
  },
  '&:active': {
    transform: 'translateY(0)',
  },
}));

const FormulaBox = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg,
    rgba(10, 14, 26, 0.9) 0%,
    rgba(15, 20, 35, 0.85) 100%
  )`,
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border: `2px solid ${withOpacity(theme.palette.brand.cyan, 0.35)}`,
  borderRadius: '16px',
  padding: '22px 30px',
  boxShadow: `
    0 4px 20px rgba(0, 0, 0, 0.4),
    0 2px 10px ${withOpacity(theme.palette.brand.cyan, 0.15)},
    inset 0 1px 0 ${withOpacity(theme.palette.common.white, 0.1)}
  `,
  transition: 'all 0.3s ease',
  '&:hover': {
    borderColor: withOpacity(theme.palette.brand.cyan, 0.5),
    boxShadow: `
      0 6px 24px ${withOpacity(theme.palette.brand.cyan, 0.25)},
      0 3px 12px rgba(0, 0, 0, 0.5)
    `,
    transform: 'translateY(-2px)',
  },
}));

const ContactItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '18px',
  padding: '18px',
  background: `linear-gradient(135deg,
    ${withOpacity(theme.palette.brand.cyan, 0.08)} 0%,
    ${withOpacity(theme.palette.brand.cyan, 0.04)} 100%
  )`,
  borderRadius: '16px',
  border: `1.5px solid ${withOpacity(theme.palette.brand.cyan, 0.25)}`,
  transition: 'all 0.3s ease',
  boxShadow: `
    0 4px 16px rgba(0, 0, 0, 0.25),
    inset 0 1px 0 ${withOpacity(theme.palette.common.white, 0.06)}
  `,
  '&:hover': {
    background: `linear-gradient(135deg,
      ${withOpacity(theme.palette.brand.cyan, 0.14)} 0%,
      ${withOpacity(theme.palette.brand.cyan, 0.08)} 100%
    )`,
    borderColor: withOpacity(theme.palette.brand.cyan, 0.4),
    transform: 'translateX(-6px)',
    boxShadow: `
      0 6px 22px ${withOpacity(theme.palette.brand.cyan, 0.2)},
      0 3px 11px rgba(0, 0, 0, 0.3)
    `,
  },
}));


const MainContent = styled(Box)({
  flex: 1,
  display: 'flex',
  alignItems: 'flex-start', // Position at top
  maxWidth: '720px',
  '@media (max-width: 960px)': {
    maxWidth: '100%',
  },
});

const ContactSection = styled(Box)({
  position: 'absolute',
  bottom: '60px',
  right: '80px',
  maxWidth: '380px',
  zIndex: 10,
  '@media (max-width: 960px)': {
    position: 'relative',
    bottom: 'auto',
    right: 'auto',
    marginTop: '40px',
  },
});

const StatsSection = styled(Box)({
  position: 'absolute',
  bottom: '40px',
  left: '0',
  transform: 'none',
  width: '100%',
  maxWidth: '1400px',
  paddingLeft: '20px',
  paddingRight: '80px',
  zIndex: 10,
  '@media (max-width: 1200px)': {
    paddingLeft: '20px',
    paddingRight: '50px',
  },
  '@media (max-width: 960px)': {
    position: 'relative',
    bottom: 'auto',
    left: 'auto',
    transform: 'none',
    marginTop: '40px',
    paddingLeft: '20px',
    paddingRight: '20px',
  },
});

const ContactContainer = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg,
    rgba(10, 14, 26, 0.92) 0%,
    rgba(15, 20, 35, 0.88) 100%
  )`,
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  border: `2px solid ${withOpacity(theme.palette.brand.cyan, 0.35)}`,
  borderRadius: '20px',
  padding: '28px',
  boxShadow: `
    0 8px 36px rgba(0, 0, 0, 0.5),
    0 4px 18px ${withOpacity(theme.palette.brand.cyan, 0.15)},
    inset 0 1px 0 ${withOpacity(theme.palette.common.white, 0.12)}
  `,
  position: 'relative',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-3px)',
    borderColor: withOpacity(theme.palette.brand.cyan, 0.5),
    boxShadow: `
      0 12px 44px rgba(0, 0, 0, 0.6),
      0 6px 22px ${withOpacity(theme.palette.brand.cyan, 0.2)}
    `,
  },
}));

const LandingPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [mounted, setMounted] = useState(false);
  const [showTypewriter, setShowTypewriter] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Ensure video plays
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.log('Video autoplay prevented:', error);
      });
    }

    // Start typewriter animation after logo and title load (1.2s delay)
    const typewriterTimer = setTimeout(() => {
      setShowTypewriter(true);
    }, 1200);

    return () => clearTimeout(typewriterTimer);
  }, []);

  const handleExplore = () => {
    console.log('Navigate to News');
    navigate('/NewsRoom');
  };

  // Reduced particles for cleaner look
  const particles = Array.from({ length: 6 }, () => ({
    size: `${Math.random() * 6 + 3}px`,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 50}%`,
    delay: `${Math.random() * 5}s`,
    duration: Math.random() * 15 + 20,
  }));

  const stats = [
    { icon: '🌍', label: '195+ Countries', color: theme.palette.brand.cyan },
    { icon: '📡', label: '>10M Data Nodes', color: '#00bfff' },
    { icon: '🎯', label: '10K+ Assets', color: '#ffee66' },
  ];

  const contacts = [
    {
      icon: <EmailIcon sx={{ fontSize: 32 }} />,
      label: 'Email Us',
      value: 'contact@saaranalytics.ai',
      color: theme.palette.brand.cyan,
      delay: 0
    },
    {
      icon: <PhoneIcon sx={{ fontSize: 32 }} />,
      label: 'Call Us',
      value: '+1 (234) 567-8901',
      color: '#00bfff',
      delay: 0.15
    },
  ];

  return (
    <StyledContainer>
      {/* Background Video - Autoplay, Loop, Muted */}
      <VideoBackground
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        onLoadedData={() => {
          console.log('Video loaded successfully');
        }}
        onError={(e) => {
          console.error('Video failed to load:', e);
        }}
      >
        <source src={backgroundVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </VideoBackground>

      {/* Floating Particles */}
      {particles.map((particle, index) => (
        <FloatingParticle
          key={index}
          size={particle.size}
          top={particle.top}
          left={particle.left}
          delay={particle.delay}
          duration={particle.duration}
        />
      ))}

      <ContentWrapper>
        {/* Main Content - Left Side */}
        <MainContent>
          <Box
            sx={{
              width: '100%',
              opacity: mounted ? 1 : 0,
              transition: 'opacity 1.5s ease',
              animation: `${slideInLeft} 1s ease-out`,
            }}
          >
            {/* Professional Content Container - Main content Application */}
            {/* <Box
              sx={{
                maxWidth: { xs: '100%', sm: '560px', md: '640px' },
                background: 'rgba(10, 14, 26, 0.75)',
                backdropFilter: 'blur(20px) saturate(1.5)',
                WebkitBackdropFilter: 'blur(20px) saturate(1.5)',
                border: `2px solid ${withOpacity(theme.palette.brand.cyan, 0.3)}`,
                borderRadius: '24px',
                padding: { xs: '22px 18px', md: '28px 24px' },
                boxShadow: `
                  0 8px 32px rgba(0, 0, 0, 0.5),
                  0 4px 16px rgba(0, 191, 255, 0.15),
                  inset 0 1px 0 ${withOpacity(theme.palette.common.white, 0.15)}
                `,
                position: 'relative',
                mb: 2,
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  borderRadius: '24px',
                  padding: '2px',
                  background: `linear-gradient(135deg,
                    ${withOpacity(theme.palette.brand.cyan, 0.4)} 0%,
                    ${withOpacity(theme.palette.brand.cyan, 0.1)} 50%,
                    ${withOpacity(theme.palette.brand.cyan, 0.4)} 100%
                  )`,
                  WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  WebkitMaskComposite: 'xor',
                  maskComposite: 'exclude',
                  pointerEvents: 'none',
                  zIndex: -1,
                },
              }}
            > */}
            {/* Logo and Title Section - Application Heart */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, md: 2 }, mb: 2 }}>
              <GlowingLogo>
                <Box
                  component="img"
                  src={logo}
                  alt="Logo"
                  sx={{
                    width: '85px',
                    height: '85px',
                    objectFit: 'contain',
                  }}
                />
              </GlowingLogo>

              <Box sx={{ flex: 1 }}>
                {/* Main Title */}
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: { xs: '2.2rem', sm: '2.8rem', md: '3.5rem' },
                    fontWeight: 800,
                    background: `linear-gradient(135deg, ${theme.palette.common.white} 0%, ${theme.palette.brand.cyan} 60%, #00bfff 100%)`,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    lineHeight: 1.1,
                    letterSpacing: '-0.02em',
                    mb: 1,
                  }}
                >
                  {appConfig.appName}
                </Typography>

                {/* Subtitle */}
                <Typography
                  variant="h6"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.85)',
                    fontSize: { xs: '0.95rem', md: '1.1rem' },
                    fontWeight: 400,
                    letterSpacing: '0.03em',
                  }}
                >
                  {appConfig.tagline}
                </Typography>
              </Box>
            </Box>

            {/* Enhanced Gradient Divider */}
            <Box
              sx={{
                height: '2px',
                background: `linear-gradient(90deg,
                    transparent 0%,
                    ${withOpacity(theme.palette.brand.cyan, 0.2)} 20%,
                    ${withOpacity(theme.palette.brand.cyan, 0.5)} 50%,
                    ${withOpacity(theme.palette.brand.cyan, 0.2)} 80%,
                    transparent 100%
                  )`,
                borderRadius: '2px',
                mb: 2,
                boxShadow: `0 0 8px ${withOpacity(theme.palette.brand.cyan, 0.3)}`,
              }}
            />
            {/* </Box> */}

            {/* Formula Box */}
            <FormulaBox sx={{ mb: 2.5, maxWidth: { xs: '100%', sm: '520px', md: '600px' } }}>
              {showTypewriter ? (
                <Box
                  sx={{
                    position: 'relative',
                    display: 'inline-block',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      right: 0,
                      bottom: 2,
                      width: '3px',
                      height: '1.2em',
                      backgroundColor: '#00bfff',
                      animation: `${blinkCursor} 0.75s step-end infinite`,
                    },
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      color: 'white',
                      fontWeight: 500,
                      fontSize: { xs: '0.85rem', md: '1rem' },
                      lineHeight: 1.6,
                      fontFamily: 'Consolas, Monaco, monospace',
                      display: 'inline-flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      gap: 1,
                      opacity: 0,
                      animation: `${fadeInUp} 0.8s ease-out forwards`,
                      '& > span': {
                        display: 'inline-block',
                        opacity: 0,
                        animation: `${fadeInUp} 0.3s ease-out forwards`,
                      },
                    }}
                  >
                    <Box component="span" sx={{ color: theme.palette.brand.cyan, fontWeight: 700, animationDelay: '0s' }}>{'{'}</Box>
                    <Box component="span" sx={{ color: '#ffee66', fontWeight: 600, animationDelay: '0.1s' }}>Trusted OSINT by JANES</Box>
                    <Box component="span" sx={{ color: theme.palette.brand.cyan, fontWeight: 700, animationDelay: '0.2s' }}>{'}'}</Box>
                    <Box component="span" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 700, fontSize: '1.2em', animationDelay: '0.3s' }}>+</Box>
                    <Box component="span" sx={{ color: theme.palette.brand.cyan, fontWeight: 700, animationDelay: '0.4s' }}>{'{'}</Box>
                    <Box component="span" sx={{ color: '#ffee66', fontWeight: 600, animationDelay: '0.5s' }}>Our Internal Knowledge</Box>
                    <Box component="span" sx={{ color: theme.palette.brand.cyan, fontWeight: 700, animationDelay: '0.6s' }}>{'}'}</Box>
                    <Box component="span" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 700, fontSize: '1.2em', animationDelay: '0.7s' }}>{'='}</Box>
                    <Box component="span" sx={{ color: theme.palette.brand.cyan, fontWeight: 700, animationDelay: '0.8s' }}>{'{'}</Box>
                    <Box component="span" sx={{
                      color: '#00bfff',
                      fontWeight: 800,
                      fontSize: '1.05em',
                      textShadow: '0 0 20px rgba(0, 191, 255, 0.6)',
                      animationDelay: '0.9s'
                    }}>
                      Deeper Truths
                    </Box>
                    <Box component="span" sx={{ color: theme.palette.brand.cyan, fontWeight: 700, animationDelay: '1s' }}>{'}'}</Box>
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ height: '40px' }} />
              )}
            </FormulaBox>

            {/* CTA Button */}
            <Box sx={{ mb: 3 }}>
              <CTAButton
                variant="contained"
                size="large"
                onClick={handleExplore}
                startIcon={<RocketIcon sx={{ fontSize: '1.8rem !important' }} />}
              >
                Launch Platform
              </CTAButton>
            </Box>
          </Box>
        </MainContent>

        {/* Platform Insights Section - Bottom Center (Full Width) */}
        <StatsSection
          sx={{
            animation: `${fadeInUp} 0.8s ease-out 0.6s both`,
          }}
        >
          <Box
            sx={{
              background: `linear-gradient(135deg,
                rgba(10, 14, 26, 0.92) 0%,
                rgba(15, 20, 35, 0.88) 100%
              )`,
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: `2px solid ${withOpacity(theme.palette.brand.cyan, 0.35)}`,
              borderRadius: '18px',
              padding: { xs: '18px 22px', md: '20px 32px' },
              boxShadow: `
                0 8px 36px rgba(0, 0, 0, 0.5),
                0 4px 18px ${withOpacity(theme.palette.brand.cyan, 0.15)},
                inset 0 1px 0 ${withOpacity(theme.palette.common.white, 0.12)}
              `,
              position: 'relative',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-3px)',
                borderColor: withOpacity(theme.palette.brand.cyan, 0.5),
                boxShadow: `
                  0 12px 44px rgba(0, 0, 0, 0.6),
                  0 6px 22px ${withOpacity(theme.palette.brand.cyan, 0.2)}
                `,
              },
            }}
          >
            {/* Single Row Layout */}
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              gap: { xs: 2, md: 4 },
              flexWrap: { xs: 'wrap', md: 'nowrap' },
            }}>
              {/* Header Section - Compact */}
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                flexShrink: 0,
                pr: { xs: 0, md: 3 },
                borderRight: { xs: 'none', md: `1px solid ${withOpacity(theme.palette.brand.cyan, 0.2)}` },
                width: { xs: '100%', md: 'auto' },
                pb: { xs: 2, md: 0 },
                borderBottom: { xs: `1px solid ${withOpacity(theme.palette.brand.cyan, 0.2)}`, md: 'none' },
              }}>
                <Box
                  sx={{
                    width: 38,
                    height: 38,
                    borderRadius: '10px',
                    background: `linear-gradient(135deg, ${theme.palette.brand.cyan} 0%, #00bfff 100%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: `0 4px 16px ${withOpacity(theme.palette.brand.cyan, 0.4)}`,
                    flexShrink: 0,
                  }}
                >
                  <Typography sx={{ fontSize: '1.3rem' }}>📊</Typography>
                </Box>
                <Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontSize: { xs: '1.1rem', md: '1.2rem' },
                      fontWeight: 800,
                      color: 'white',
                      textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
                      lineHeight: 1.2,
                    }}
                  >
                    Platform Insights
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'rgba(255, 255, 255, 0.65)',
                      fontSize: '0.8rem',
                      fontWeight: 500,
                      letterSpacing: '0.02em',
                      display: { xs: 'none', md: 'block' },
                    }}
                  >
                    Real-time intelligence
                  </Typography>
                </Box>
              </Box>

              {/* Horizontal Stats - Single Row */}
              <Box sx={{
                display: 'flex',
                gap: { xs: 2, md: 3 },
                flex: 1,
                justifyContent: 'flex-start',
                flexWrap: { xs: 'wrap', md: 'nowrap' },
                width: { xs: '100%', md: 'auto' },
              }}>
                {stats.map((stat, index) => (
                  <Box
                    key={index}
                    sx={{
                      background: `linear-gradient(135deg,
                        ${withOpacity(stat.color, 0.08)} 0%,
                        ${withOpacity(stat.color, 0.04)} 100%
                      )`,
                      backdropFilter: 'blur(8px)',
                      border: `1.5px solid ${withOpacity(stat.color, 0.3)}`,
                      borderRadius: '14px',
                      padding: { xs: '14px 18px', md: '16px 24px' },
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      flex: 1,
                      minWidth: { xs: 'calc(50% - 8px)', sm: 'calc(33.333% - 12px)', md: 'auto' },
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      position: 'relative',
                      overflow: 'hidden',
                      boxShadow: `
                        0 4px 16px rgba(0, 0, 0, 0.25),
                        inset 0 1px 0 ${withOpacity(theme.palette.common.white, 0.08)}
                      `,
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '3px',
                        height: '100%',
                        background: `linear-gradient(180deg, ${stat.color}, ${withOpacity(stat.color, 0.6)})`,
                        opacity: 0.8,
                      },
                      '&:hover': {
                        transform: 'translateY(-4px) scale(1.03)',
                        borderColor: withOpacity(stat.color, 0.5),
                        background: `linear-gradient(135deg,
                          ${withOpacity(stat.color, 0.14)} 0%,
                          ${withOpacity(stat.color, 0.08)} 100%
                        )`,
                        boxShadow: `
                          0 8px 28px ${withOpacity(stat.color, 0.25)},
                          0 4px 14px rgba(0, 0, 0, 0.3),
                          inset 0 1px 0 ${withOpacity(theme.palette.common.white, 0.12)}
                        `,
                        '&::before': {
                          opacity: 1,
                          width: '4px',
                        },
                      },
                    }}
                  >
                    {/* Icon Container */}
                    <Box
                      sx={{
                        width: { xs: 44, md: 50 },
                        height: { xs: 44, md: 50 },
                        borderRadius: '12px',
                        background: `linear-gradient(135deg, ${withOpacity(stat.color, 0.2)}, ${withOpacity(stat.color, 0.1)})`,
                        border: `2px solid ${withOpacity(stat.color, 0.3)}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: `0 4px 12px ${withOpacity(stat.color, 0.2)}`,
                        transition: 'all 0.3s ease',
                        flexShrink: 0,
                      }}
                    >
                      <Typography sx={{ fontSize: { xs: '1.6rem', md: '1.8rem' } }}>{stat.icon}</Typography>
                    </Box>

                    {/* Label */}
                    <Typography
                      sx={{
                        fontSize: { xs: '0.95rem', md: '1.05rem' },
                        color: stat.color,
                        fontWeight: 700,
                        letterSpacing: '0.02em',
                        textShadow: `0 2px 8px ${withOpacity(stat.color, 0.3)}`,
                        lineHeight: 1.3,
                      }}
                    >
                      {stat.label}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </StatsSection>

        {/* Contact Section - Bottom Right Corner */}
        <ContactSection
          sx={{
            animation: `${scaleIn} 0.8s ease-out 0.6s both`,
          }}
        >
          <ContactContainer>
            <Typography
              variant="h5"
              sx={{
                fontSize: '1.5rem',
                fontWeight: 900,
                color: 'white',
                mb: 1,
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
              }}
            >
              Get in Touch
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '0.95rem',
                mb: 3,
              }}
            >
              Connect with our team
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {contacts.map((contact, index) => (
                <ContactItem key={index}>
                  <Box
                    sx={{
                      color: contact.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minWidth: '40px',
                      height: '40px',
                    }}
                  >
                    {contact.icon}
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      variant="caption"
                      sx={{
                        color: contact.color,
                        fontWeight: theme.custom.tokens.fontWeight.bold,
                        fontSize: '0.75rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        display: 'block',
                        mb: 0.5,
                      }}
                    >
                      {contact.label}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'rgba(255, 255, 255, 0.95)',
                        fontSize: '0.9rem',
                        fontWeight: 500,
                        wordBreak: 'break-word',
                        lineHeight: 1.4,
                      }}
                    >
                      {contact.value}
                    </Typography>
                  </Box>
                </ContactItem>
              ))}
            </Box>
          </ContactContainer>
        </ContactSection>
      </ContentWrapper>
    </StyledContainer>
  );
};

export default LandingPage;