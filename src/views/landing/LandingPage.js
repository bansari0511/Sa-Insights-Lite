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
  Newspaper as NewspaperIcon,
  Security as SecurityIcon,
  Map as MapIcon,
  EventAvailable as EventIcon,
  Explore as ExploreIcon,
  Email as EmailIcon,
  Phone as PhoneIcon
} from '@mui/icons-material';
import logo from 'src/assets/images/logos/logo_landing.png';
import backgroundVideo from 'src/assets/video/videoplayback.mp4';
import appConfig from 'src/config/appConfig';

// ─── Animations ───
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
`;

const scaleIn = keyframes`
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
`;

const particleFloat = keyframes`
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  25% { transform: translate(15px, -25px) rotate(90deg); }
  50% { transform: translate(-20px, -50px) rotate(180deg); }
  75% { transform: translate(-15px, -25px) rotate(270deg); }
`;

const glowPulse = keyframes`
  0%, 100% { box-shadow: 0 0 24px rgba(0,191,255,0.15), 0 0 60px rgba(0,191,255,0.05); }
  50% { box-shadow: 0 0 40px rgba(0,191,255,0.3), 0 0 100px rgba(0,191,255,0.1); }
`;

const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

const gradientShift = keyframes`
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
`;

const lineGlow = keyframes`
  0%, 100% { opacity: 0.5; box-shadow: 0 0 8px rgba(0,191,255,0.2); }
  50% { opacity: 1; box-shadow: 0 0 20px rgba(0,191,255,0.5), 0 0 40px rgba(0,191,255,0.15); }
`;

const subtlePulse = keyframes`
  0%, 100% { opacity: 0.12; }
  50% { opacity: 0.2; }
`;

const radarSweep = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const dataFlicker = keyframes`
  0%, 100% { opacity: 0.03; }
  50% { opacity: 0.07; }
`;

const typeIn = keyframes`
  from { width: 0; }
  to { width: 100%; }
`;

const blinkCaret = keyframes`
  0%, 100% { border-color: transparent; }
  50% { border-color: rgba(0,191,255,0.7); }
`;

// ─── Styled Components ───
const StyledContainer = styled(Box)(() => ({
  minHeight: '100vh',
  width: '100vw',
  position: 'relative',
  overflow: 'hidden',
  background: '#0a0e1a',
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(180deg, rgba(10,14,26,0.15) 0%, rgba(10,14,26,0.25) 50%, rgba(10,14,26,0.55) 100%)',
    zIndex: 1,
  },
}));

const VideoBackground = styled('video')({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  zIndex: 0,
  opacity: 0.85,
  filter: 'brightness(1.05) saturate(1.1)',
});

const FloatingParticle = styled(Box)(({ size, top, left, delay, duration, theme }) => ({
  position: 'absolute',
  width: size,
  height: size,
  borderRadius: '50%',
  background: `radial-gradient(circle, ${withOpacity(theme.palette.brand.cyan, 0.6)}, rgba(0, 191, 255, 0.2))`,
  top,
  left,
  animation: `${particleFloat} ${duration}s ease-in-out infinite`,
  animationDelay: delay,
  boxShadow: `0 0 14px ${withOpacity(theme.palette.brand.cyan, 0.4)}`,
  pointerEvents: 'none',
  zIndex: 1,
}));

const CTAButton = styled(Button)(({ theme }) => ({
  fontSize: '1.1rem',
  padding: '15px 50px',
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
    0 6px 28px ${withOpacity(theme.palette.brand.cyan, 0.4)},
    0 3px 14px rgba(0, 0, 0, 0.35)
  `,
  transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
  letterSpacing: '0.5px',
  position: 'relative',
  overflow: 'hidden',
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `linear-gradient(90deg, transparent 0%, ${withOpacity(theme.palette.common.white, 0.15)} 50%, transparent 100%)`,
    backgroundSize: '200% 100%',
    animation: `${shimmer} 3s ease-in-out infinite`,
    pointerEvents: 'none',
  },
  '&:hover': {
    transform: 'translateY(-3px) scale(1.02)',
    backgroundPosition: 'right center',
    boxShadow: `
      0 10px 36px ${withOpacity(theme.palette.brand.cyan, 0.55)},
      0 5px 18px rgba(0, 0, 0, 0.45)
    `,
    borderColor: withOpacity(theme.palette.brand.cyan, 0.7),
  },
  '&:active': {
    transform: 'translateY(0) scale(1)',
  },
}));

// Contact styled components (same as sa-web-service)
const ContactSection = styled(Box)({
  position: 'absolute',
  bottom: '40px',
  right: '50px',
  maxWidth: '360px',
  zIndex: 10,
  '@media (max-width: 960px)': {
    position: 'relative',
    bottom: 'auto',
    right: 'auto',
    maxWidth: '100%',
    marginTop: '40px',
  },
});

const ContactContainer = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, rgba(10, 14, 26, 0.92) 0%, rgba(15, 20, 35, 0.88) 100%)`,
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

const LandingPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
    return () => clearTimeout(t);
  }, []);

  const handleExplore = () => {
    navigate('/NewsRoom');
  };

  const particles = Array.from({ length: 5 }, () => ({
    size: `${Math.random() * 5 + 3}px`,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 60}%`,
    delay: `${Math.random() * 5}s`,
    duration: Math.random() * 15 + 20,
  }));

  const capabilities = [
    { icon: <NewspaperIcon />, label: 'Global News', color: theme.palette.brand.cyan },
    { icon: <SecurityIcon />, label: 'Intel Briefings', color: '#a78bfa' },
    { icon: <EventIcon />, label: 'Event Tracking', color: '#00bfff' },
    { icon: <MapIcon />, label: 'Geospatial Map', color: '#34d399' },
  ];

  const contacts = [
    {
      icon: <EmailIcon sx={{ fontSize: 32 }} />,
      label: 'Email Us',
      value: 'contact@saaranalytics.ai',
      color: theme.palette.brand.cyan,
    },
    {
      icon: <PhoneIcon sx={{ fontSize: 32 }} />,
      label: 'Call Us',
      value: '+1 (234) 567-8901',
      color: '#00bfff',
    },
  ];

  return (
    <StyledContainer>
      {/* Background Video */}
      <VideoBackground
        ref={videoRef}
        autoPlay loop muted playsInline preload="auto"
        onError={(e) => console.error('Video failed to load:', e)}
      >
        <source src={backgroundVideo} type="video/mp4" />
      </VideoBackground>

      {/* Soft edge vignette — keeps center open for video */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(ellipse at center, transparent 0%, transparent 55%, rgba(10,14,26,0.3) 85%, rgba(10,14,26,0.6) 100%)',
        zIndex: 1,
        pointerEvents: 'none',
      }} />

      {/* Floating Particles */}
      {particles.map((p, i) => (
        <FloatingParticle key={i} size={p.size} top={p.top} left={p.left} delay={p.delay} duration={p.duration} />
      ))}

      {/* ─── Intel grid dot overlay ─── */}
      <Box sx={{
        position: 'absolute',
        inset: 0,
        zIndex: 1,
        pointerEvents: 'none',
        backgroundImage: `radial-gradient(circle, ${withOpacity(theme.palette.brand.cyan, 0.08)} 1px, transparent 1px)`,
        backgroundSize: '40px 40px',
        animation: `${dataFlicker} 4s ease-in-out infinite`,
      }} />

      {/* ─── Radar/sonar element — top-right ─── */}
      <Box sx={{
        position: 'absolute',
        top: { xs: 20, md: 40 },
        right: { xs: 20, md: 60 },
        width: { xs: 80, md: 120 },
        height: { xs: 80, md: 120 },
        borderRadius: '50%',
        border: `1px solid ${withOpacity(theme.palette.brand.cyan, 0.15)}`,
        zIndex: 2,
        pointerEvents: 'none',
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: '15%',
          borderRadius: '50%',
          border: `1px solid ${withOpacity(theme.palette.brand.cyan, 0.12)}`,
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '50%',
          height: '2px',
          transformOrigin: '0 50%',
          background: `linear-gradient(90deg, ${withOpacity(theme.palette.brand.cyan, 0.6)}, transparent)`,
          animation: `${radarSweep} 4s linear infinite`,
          boxShadow: `0 0 8px ${withOpacity(theme.palette.brand.cyan, 0.3)}`,
        },
      }} />

      {/* ─── Side accent lines — left edge ─── */}
      <Box sx={{
        position: 'absolute',
        top: { xs: '10%', md: '8%' },
        left: 0,
        width: '3px',
        height: { xs: '50%', md: '60%' },
        zIndex: 3,
        pointerEvents: 'none',
        background: `linear-gradient(180deg, transparent, ${withOpacity(theme.palette.brand.cyan, 0.5)}, ${withOpacity('#a78bfa', 0.3)}, transparent)`,
        animation: `${lineGlow} 3s ease-in-out infinite`,
        borderRadius: '0 2px 2px 0',
      }} />
      <Box sx={{
        position: 'absolute',
        top: { xs: '15%', md: '12%' },
        left: '8px',
        width: '1.5px',
        height: { xs: '35%', md: '40%' },
        zIndex: 3,
        pointerEvents: 'none',
        background: `linear-gradient(180deg, transparent, ${withOpacity(theme.palette.brand.cyan, 0.25)}, transparent)`,
        borderRadius: '2px',
      }} />

      {/* ─── Main Content Layer ─── */}
      <Box sx={{
        position: 'relative',
        zIndex: 2,
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        px: { xs: 2, sm: 4, md: 6, lg: 8 },
        pt: { xs: 4, sm: 5, md: 6 },
        pb: { xs: 3, md: 4 },
      }}>

        {/* ═══ HERO CONTENT — aligned left, starts from top ═══ */}
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          textAlign: 'left',
          maxWidth: '720px',
          width: '100%',
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateX(0)' : 'translateX(-30px)',
          transition: 'all 1s cubic-bezier(0.16, 1, 0.3, 1)',
        }}>

          {/* Logo with glow ring */}
          <Box sx={{
            mb: 3,
            animation: `${glowPulse} 4s ease-in-out infinite`,
            borderRadius: '24px',
          }}>
            <Box sx={{
              width: { xs: 80, md: 100 },
              height: { xs: 80, md: 100 },
              background: `linear-gradient(145deg, rgba(12,16,30,0.9) 0%, rgba(22,32,55,0.85) 100%)`,
              backdropFilter: 'blur(12px)',
              border: `2px solid ${withOpacity(theme.palette.brand.cyan, 0.4)}`,
              borderRadius: '22px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `
                0 0 30px ${withOpacity(theme.palette.brand.cyan, 0.2)},
                0 4px 24px rgba(0, 0, 0, 0.4),
                inset 0 1px 0 ${withOpacity(theme.palette.common.white, 0.1)}
              `,
            }}>
              <Box component="img" src={logo} alt="Logo" sx={{
                width: '78%',
                height: '78%',
                objectFit: 'contain',
                filter: 'drop-shadow(0 2px 8px rgba(0,191,255,0.15))',
              }} />
            </Box>
          </Box>

          {/* Intel classification label */}
          <Box sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 1,
            px: 1.5,
            py: 0.4,
            mb: 1.5,
            borderRadius: '6px',
            border: `1px solid ${withOpacity(theme.palette.brand.cyan, 0.25)}`,
            background: withOpacity(theme.palette.brand.cyan, 0.06),
            animation: `${fadeInUp} 0.6s ease-out 0.1s both`,
          }}>
            <Box sx={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              bgcolor: theme.palette.brand.cyan,
              boxShadow: `0 0 8px ${theme.palette.brand.cyan}`,
              animation: `${subtlePulse} 2s ease-in-out infinite`,
            }} />
            <Typography sx={{
              color: withOpacity(theme.palette.brand.cyan, 0.85),
              fontSize: '0.65rem',
              fontWeight: 700,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
            }}>
              Intelligence Platform
            </Typography>
          </Box>

          {/* App Name — animated gradient with glow aura */}
          <Typography variant="h1" sx={{
            fontSize: { xs: '2.6rem', sm: '3.4rem', md: '4rem' },
            fontWeight: 800,
            background: `linear-gradient(135deg, #ffffff 0%, ${theme.palette.brand.cyan} 50%, #00bfff 100%)`,
            backgroundSize: '200% 200%',
            animation: `${gradientShift} 6s ease-in-out infinite`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            lineHeight: 1.05,
            letterSpacing: '-0.03em',
            mb: 1.2,
            filter: `drop-shadow(0 0 20px rgba(0,191,255,0.25)) drop-shadow(0 3px 12px rgba(0,0,0,0.6))`,
          }}>
            {appConfig.appName}
          </Typography>

          {/* Tagline with subtle glow */}
          <Typography sx={{
            color: withOpacity(theme.palette.brand.cyan, 0.9),
            fontSize: { xs: '0.75rem', md: '0.85rem' },
            fontWeight: 600,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            mb: 2.5,
            textShadow: `0 0 16px ${withOpacity(theme.palette.brand.cyan, 0.3)}, 0 2px 10px rgba(0,0,0,0.7)`,
          }}>
            {appConfig.tagline}
          </Typography>

          {/* Animated gradient divider line */}
          <Box sx={{
            width: { xs: '160px', md: '220px' },
            height: '2px',
            background: `linear-gradient(90deg, ${withOpacity(theme.palette.brand.cyan, 0.7)}, ${withOpacity(theme.palette.brand.cyan, 0.3)}, transparent)`,
            mb: 3,
            borderRadius: '2px',
            animation: `${lineGlow} 3s ease-in-out infinite 0.5s`,
          }} />

          {/* Description with enhanced readability */}
          <Typography sx={{
            color: 'rgba(255, 255, 255, 0.88)',
            fontSize: { xs: '0.95rem', md: '1.08rem' },
            lineHeight: 1.8,
            maxWidth: '560px',
            mb: 4,
            px: { xs: 1, md: 0 },
            textShadow: '0 2px 12px rgba(0,0,0,0.6), 0 1px 3px rgba(0,0,0,0.4)',
            fontWeight: 400,
          }}>
            Your unified command center for curated global news, intelligence briefings,
            real-time event tracking, and interactive geospatial analysis — delivering
            strategic clarity in a single platform.
          </Typography>

          {/* ─── Capability Chips with frosted pill backgrounds ─── */}
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            gap: { xs: 1, sm: 1.5 },
            mb: 5,
            flexWrap: 'wrap',
            animation: `${fadeInUp} 0.8s ease-out 0.3s both`,
          }}>
            {capabilities.map((cap) => (
              <Box key={cap.label} sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.8,
                px: { xs: 1.2, sm: 1.8 },
                py: 0.8,
                borderRadius: '12px',
                background: `linear-gradient(135deg, ${withOpacity(cap.color, 0.08)} 0%, ${withOpacity(cap.color, 0.03)} 100%)`,
                border: `1px solid ${withOpacity(cap.color, 0.18)}`,
                backdropFilter: 'blur(4px)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: `linear-gradient(135deg, ${withOpacity(cap.color, 0.15)} 0%, ${withOpacity(cap.color, 0.06)} 100%)`,
                  borderColor: withOpacity(cap.color, 0.35),
                  boxShadow: `0 0 18px ${withOpacity(cap.color, 0.2)}, 0 4px 12px rgba(0,0,0,0.2)`,
                  transform: 'translateY(-2px)',
                },
              }}>
                <Box sx={{
                  width: 28,
                  height: 28,
                  borderRadius: '8px',
                  background: withOpacity(cap.color, 0.15),
                  border: `1px solid ${withOpacity(cap.color, 0.3)}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: cap.color,
                  flexShrink: 0,
                  boxShadow: `0 0 10px ${withOpacity(cap.color, 0.15)}`,
                  '& .MuiSvgIcon-root': { fontSize: '0.95rem' },
                }}>
                  {cap.icon}
                </Box>
                <Typography sx={{
                  color: 'rgba(255, 255, 255, 0.92)',
                  fontSize: { xs: '0.74rem', sm: '0.82rem' },
                  fontWeight: 600,
                  letterSpacing: '0.02em',
                  whiteSpace: 'nowrap',
                  textShadow: '0 1px 6px rgba(0,0,0,0.5)',
                }}>
                  {cap.label}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* CTA Button with glow halo */}
          <Box sx={{
            animation: `${scaleIn} 0.6s ease-out 0.5s both`,
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              inset: '-12px',
              borderRadius: '26px',
              background: `radial-gradient(ellipse at center, ${withOpacity(theme.palette.brand.cyan, 0.1)} 0%, transparent 70%)`,
              pointerEvents: 'none',
              animation: `${subtlePulse} 3s ease-in-out infinite`,
            },
          }}>
            <CTAButton
              variant="contained"
              size="large"
              onClick={handleExplore}
              startIcon={<ExploreIcon sx={{ fontSize: '1.5rem !important' }} />}
            >
              Explore Platform
            </CTAButton>
          </Box>

          {/* Status line with typewriter caret */}
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            mt: 3,
            px: 1.5,
            py: 0.6,
            borderRadius: '8px',
            border: `1px solid ${withOpacity(theme.palette.brand.cyan, 0.12)}`,
            background: withOpacity(theme.palette.brand.cyan, 0.03),
          }}>
            <Box sx={{
              width: 5,
              height: 5,
              borderRadius: '50%',
              bgcolor: '#34d399',
              boxShadow: '0 0 6px #34d399',
            }} />
            <Typography sx={{
              color: 'rgba(255, 255, 255, 0.45)',
              fontSize: '0.62rem',
              fontWeight: 500,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              fontFamily: 'monospace',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              borderRight: '2px solid transparent',
              animation: `${typeIn} 2s steps(30) 1.5s both, ${blinkCaret} 1s step-end 3.5s infinite`,
            }}>
              System Active — v{appConfig.version} — All Feeds Online
            </Typography>
          </Box>
        </Box>

        {/* ═══ Bottom-left data readout — intel HUD effect ═══ */}
        <Box sx={{
          position: 'fixed',
          bottom: { xs: 16, md: 32 },
          left: { xs: 16, md: 32 },
          zIndex: 4,
          display: { xs: 'none', sm: 'flex' },
          flexDirection: 'column',
          gap: 0.5,
          animation: `${fadeInUp} 1s ease-out 1.2s both`,
        }}>
          {['DATA FEEDS: 4 ACTIVE', 'COVERAGE: GLOBAL', 'LATENCY: < 2ms'].map((line, i) => (
            <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
              <Box sx={{
                width: 4, height: 4, borderRadius: '50%',
                bgcolor: i === 0 ? '#34d399' : withOpacity(theme.palette.brand.cyan, 0.5),
                boxShadow: i === 0 ? '0 0 4px #34d399' : 'none',
              }} />
              <Typography sx={{
                color: withOpacity(theme.palette.brand.cyan, 0.35),
                fontSize: '0.55rem',
                fontWeight: 500,
                letterSpacing: '0.12em',
                fontFamily: 'monospace',
                textTransform: 'uppercase',
              }}>
                {line}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* ═══ Contact Section - Bottom Right (same as sa-web-service) ═══ */}
        <ContactSection sx={{ animation: `${scaleIn} 0.8s ease-out 0.8s both` }}>
          <ContactContainer>
            <Typography variant="h5" sx={{
              fontSize: '1.5rem',
              fontWeight: 900,
              color: 'white',
              mb: 1,
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
            }}>
              Get in Touch
            </Typography>
            <Typography variant="body2" sx={{
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '0.95rem',
              mb: 3,
            }}>
              Connect with our team
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {contacts.map((contact, index) => (
                <ContactItem key={index}>
                  <Box sx={{
                    color: contact.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: '40px',
                    height: '40px',
                  }}>
                    {contact.icon}
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="caption" sx={{
                      color: contact.color,
                      fontWeight: 700,
                      fontSize: '0.75rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      display: 'block',
                      mb: 0.5,
                    }}>
                      {contact.label}
                    </Typography>
                    <Typography variant="body2" sx={{
                      color: 'rgba(255, 255, 255, 0.95)',
                      fontSize: '0.9rem',
                      fontWeight: 500,
                      wordBreak: 'break-word',
                      lineHeight: 1.4,
                    }}>
                      {contact.value}
                    </Typography>
                  </Box>
                </ContactItem>
              ))}
            </Box>
          </ContactContainer>
        </ContactSection>
      </Box>
    </StyledContainer>
  );
};

export default LandingPage;
