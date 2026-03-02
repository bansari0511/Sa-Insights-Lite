import { Box, Typography, styled, keyframes } from '@mui/material';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import InsightsOutlinedIcon from '@mui/icons-material/InsightsOutlined';
import PageContainer from 'src/components/container/PageContainer';
import AuthLogin from './auth/AuthLogin';
import appConfig from 'src/config/appConfig';
import logo from 'src/assets/images/logos/logo_landing.png';

const FONT = "'Inter', 'Segoe UI', -apple-system, BlinkMacSystemFont, 'Roboto', sans-serif";
const MONO = "'SF Mono', 'Fira Code', 'Cascadia Code', 'Consolas', monospace";

/* ── Palette ── */
const AZURE = '#38bdf8';
const AZURE_DEEP = '#0ea5e9';
const INDIGO = '#6366f1';
const INDIGO_LIGHT = '#818cf8';
const VIOLET = '#8b5cf6';
const CYAN = '#22d3ee';

/* ── Keyframes ── */
const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(32px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const slideRight = keyframes`
  from { opacity: 0; transform: translateX(-40px); }
  to   { opacity: 1; transform: translateX(0); }
`;

const logoBreath = keyframes`
  0%, 100% {
    transform: scale(1);
    filter: drop-shadow(0 0 20px rgba(56, 189, 248, 0.3)) drop-shadow(0 0 60px rgba(99, 102, 241, 0.15));
  }
  50% {
    transform: scale(1.03);
    filter: drop-shadow(0 0 35px rgba(56, 189, 248, 0.5)) drop-shadow(0 0 80px rgba(99, 102, 241, 0.25));
  }
`;

const auroraShift = keyframes`
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const orbit1 = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`;

const orbit2 = keyframes`
  from { transform: rotate(120deg); }
  to   { transform: rotate(480deg); }
`;

const orbit3 = keyframes`
  from { transform: rotate(240deg); }
  to   { transform: rotate(600deg); }
`;

const scanLine = keyframes`
  0%   { top: -2px; opacity: 0; }
  10%  { opacity: 1; }
  90%  { opacity: 1; }
  100% { top: 100%; opacity: 0; }
`;

const pulseRing = keyframes`
  0%   { transform: scale(0.85); opacity: 0.6; }
  50%  { transform: scale(1.05); opacity: 0.2; }
  100% { transform: scale(0.85); opacity: 0.6; }
`;

const shimmer = keyframes`
  0%   { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

const gridFloat = keyframes`
  0%   { transform: translate(0, 0); }
  100% { transform: translate(-48px, -48px); }
`;

const particleDrift = keyframes`
  0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.3; }
  33% { transform: translate(25px, -35px) scale(1.15); opacity: 0.6; }
  66% { transform: translate(-15px, -55px) scale(0.9); opacity: 0.4; }
`;

const underlineFlow = keyframes`
  0%   { background-position: 0% 0%; }
  100% { background-position: 200% 0%; }
`;

const dotPulse = keyframes`
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.4); }
`;

const glowPulse = keyframes`
  0%, 100% { opacity: 0.4; }
  50%      { opacity: 0.7; }
`;

/* ── Styled Root ── */
const PageRoot = styled(Box)({
  minHeight: '100vh',
  width: '100vw',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  fontFamily: FONT,
  position: 'relative',
  overflow: 'hidden',
  backgroundImage: "url('/login-bgg.jpg')",
  backgroundSize: 'cover',
  backgroundPosition: 'center center',
  backgroundRepeat: 'no-repeat',
  padding: '48px 6% 56px',
});

/* ── Particles data ── */
const particles = [
  { size: 4, top: '12%', left: '8%', delay: '0s', dur: '18s', color: AZURE },
  { size: 3, top: '28%', left: '15%', delay: '-4s', dur: '22s', color: INDIGO_LIGHT },
  { size: 5, top: '65%', left: '12%', delay: '-8s', dur: '20s', color: CYAN },
  { size: 3, top: '80%', left: '25%', delay: '-2s', dur: '16s', color: VIOLET },
  { size: 4, top: '20%', left: '42%', delay: '-6s', dur: '24s', color: AZURE },
  { size: 3, top: '45%', left: '35%', delay: '-10s', dur: '19s', color: INDIGO_LIGHT },
  { size: 5, top: '72%', left: '55%', delay: '-3s', dur: '21s', color: CYAN },
  { size: 3, top: '15%', left: '65%', delay: '-7s', dur: '17s', color: AZURE },
  { size: 4, top: '50%', left: '70%', delay: '-1s', dur: '23s', color: VIOLET },
  { size: 3, top: '85%', left: '80%', delay: '-5s', dur: '20s', color: INDIGO_LIGHT },
];

const Login2 = () => {
  const titleWords = (appConfig.appName || 'SA Insights').split(' ');

  return (
    <PageContainer title="Login" description={`${appConfig.appName} - ${appConfig.tagline}`}>
      <PageRoot>

        {/* ── Dark Overlay ── */}
        <Box sx={{
          position: 'absolute', inset: 0, zIndex: 0,
          background: `linear-gradient(
            135deg,
            rgba(5, 8, 22, 0.88) 0%,
            rgba(10, 15, 35, 0.85) 40%,
            rgba(15, 10, 40, 0.90) 100%
          )`,
        }} />

        {/* ── Subtle grid dots ── */}
        <Box sx={{
          position: 'absolute', inset: 0, zIndex: 0,
          backgroundImage: 'radial-gradient(circle, rgba(56,189,248,0.04) 1px, transparent 1px)',
          backgroundSize: '52px 52px',
          animation: `${gridFloat} 35s linear infinite`,
          opacity: 0.6,
        }} />

        {/* ── Floating dot particles ── */}
        {particles.map((p, i) => (
          <Box key={i} sx={{
            position: 'absolute',
            width: p.size, height: p.size,
            borderRadius: '50%',
            bgcolor: p.color,
            top: p.top, left: p.left,
            animation: `${particleDrift} ${p.dur} ease-in-out infinite`,
            animationDelay: p.delay,
            pointerEvents: 'none', zIndex: 0,
            boxShadow: `0 0 ${p.size * 3}px ${p.color}60`,
          }} />
        ))}

        {/* ── Ambient aurora glow (top-left) ── */}
        <Box sx={{
          position: 'absolute',
          top: '-15%', left: '-10%',
          width: '55%', height: '70%',
          background: `radial-gradient(ellipse at center,
            rgba(56, 189, 248, 0.06) 0%,
            rgba(99, 102, 241, 0.04) 40%,
            transparent 70%
          )`,
          filter: 'blur(60px)',
          animation: `${glowPulse} 8s ease-in-out infinite`,
          pointerEvents: 'none', zIndex: 0,
        }} />

        {/* ── Ambient aurora glow (bottom-right) ── */}
        <Box sx={{
          position: 'absolute',
          bottom: '-20%', right: '-5%',
          width: '45%', height: '60%',
          background: `radial-gradient(ellipse at center,
            rgba(139, 92, 246, 0.05) 0%,
            rgba(34, 211, 238, 0.03) 40%,
            transparent 70%
          )`,
          filter: 'blur(60px)',
          animation: `${glowPulse} 10s ease-in-out infinite`,
          animationDelay: '-4s',
          pointerEvents: 'none', zIndex: 0,
        }} />

        {/* ================================================================
            LEFT BRANDING SECTION
            ================================================================ */}
        <Box sx={{
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          position: 'relative',
          zIndex: 1,
          maxWidth: 580,
          flexShrink: 0,
          alignSelf: 'stretch',
          animation: `${slideRight} 0.9s cubic-bezier(0.16, 1, 0.3, 1)`,
        }}>

          {/* ── Logo Hero ── */}
          <Box sx={{
            position: 'relative',
            width: 180, height: 180,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 4,
            alignSelf: 'flex-start',
          }}>
            {/* Outer glow backdrop */}
            <Box sx={{
              position: 'absolute',
              inset: -20,
              borderRadius: '50%',
              background: `radial-gradient(circle,
                rgba(56, 189, 248, 0.12) 0%,
                rgba(99, 102, 241, 0.08) 30%,
                rgba(139, 92, 246, 0.04) 60%,
                transparent 80%
              )`,
              animation: `${pulseRing} 4s ease-in-out infinite`,
            }} />

            {/* Orbit ring 1 - large, slow */}
            <Box sx={{
              position: 'absolute',
              width: 175, height: 175,
              borderRadius: '50%',
              border: '1px solid transparent',
              borderTopColor: `${AZURE}40`,
              borderRightColor: `${AZURE}15`,
              animation: `${orbit1} 12s linear infinite`,
              '&::after': {
                content: '""',
                position: 'absolute',
                top: -2, right: 20,
                width: 5, height: 5,
                borderRadius: '50%',
                bgcolor: AZURE,
                boxShadow: `0 0 10px ${AZURE}80`,
              },
            }} />

            {/* Orbit ring 2 - medium, reverse */}
            <Box sx={{
              position: 'absolute',
              width: 150, height: 150,
              borderRadius: '50%',
              border: '1px solid transparent',
              borderBottomColor: `${VIOLET}35`,
              borderLeftColor: `${VIOLET}12`,
              animation: `${orbit2} 9s linear infinite reverse`,
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: 0, left: 15,
                width: 4, height: 4,
                borderRadius: '50%',
                bgcolor: VIOLET,
                boxShadow: `0 0 8px ${VIOLET}80`,
              },
            }} />

            {/* Orbit ring 3 - tilted */}
            <Box sx={{
              position: 'absolute',
              width: 165, height: 165,
              borderRadius: '50%',
              border: '1px solid transparent',
              borderLeftColor: `${CYAN}25`,
              borderTopColor: `${CYAN}10`,
              animation: `${orbit3} 15s linear infinite`,
              transform: 'rotateX(60deg)',
            }} />

            {/* Inner glass frame */}
            <Box sx={{
              width: 120, height: 120,
              borderRadius: '28px',
              background: `linear-gradient(145deg,
                rgba(56, 189, 248, 0.08) 0%,
                rgba(99, 102, 241, 0.06) 50%,
                rgba(139, 92, 246, 0.04) 100%
              )`,
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(56, 189, 248, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: `
                0 8px 32px rgba(56, 189, 248, 0.08),
                inset 0 1px 0 rgba(255,255,255,0.06)
              `,
            }}>
              {/* Scan line effect */}
              <Box sx={{
                position: 'absolute',
                left: 0, right: 0,
                height: '2px',
                background: `linear-gradient(90deg, transparent, ${AZURE}30, transparent)`,
                animation: `${scanLine} 4s ease-in-out infinite`,
                animationDelay: '1s',
                zIndex: 2,
              }} />

              {/* Logo */}
              <Box component="img" src={logo} alt="Logo" sx={{
                width: 72, height: 72,
                objectFit: 'contain',
                animation: `${logoBreath} 5s ease-in-out infinite`,
                position: 'relative',
                zIndex: 1,
              }} />
            </Box>
          </Box>

          {/* ── Title ── */}
          <Box sx={{ mb: 1.5 }}>
            <Typography sx={{
              fontFamily: FONT,
              fontSize: '3.8rem',
              fontWeight: 900,
              lineHeight: 1.05,
              letterSpacing: '-0.03em',
            }}>
              {titleWords.map((word, wi) => (
                <Box key={wi} component="span" sx={{
                  display: 'inline-block',
                  mr: 1.5,
                  background: wi === 0
                    ? `linear-gradient(135deg, ${AZURE} 0%, #e0f2fe 50%, ${AZURE} 100%)`
                    : `linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 40%, ${INDIGO_LIGHT} 100%)`,
                  backgroundSize: wi === 0 ? '200% auto' : 'auto',
                  animation: wi === 0 ? `${shimmer} 4s linear infinite` : 'none',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>
                  {word}
                </Box>
              ))}
            </Typography>

            {/* Animated underline */}
            <Box sx={{
              height: 3,
              width: 100,
              borderRadius: 4,
              mt: 1.5,
              background: `linear-gradient(90deg, ${AZURE}, ${INDIGO}, ${VIOLET}, ${CYAN}, ${AZURE})`,
              backgroundSize: '200% 100%',
              animation: `${underlineFlow} 3s linear infinite`,
              boxShadow: `0 0 12px ${AZURE}40`,
            }} />
          </Box>

          {/* ── Tagline ── */}
          <Typography sx={{
            fontFamily: FONT,
            fontSize: '1.25rem',
            fontWeight: 400,
            color: 'rgba(226, 232, 240, 0.7)',
            lineHeight: 1.6,
            maxWidth: 440,
            mb: 3.5,
            letterSpacing: '0.01em',
          }}>
            {appConfig.tagline}
          </Typography>

          {/* ── Status strip ── */}
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 3,
          }}>
            {/* Live indicator */}
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              px: 2, py: 0.8,
              borderRadius: '10px',
              background: 'rgba(56, 189, 248, 0.06)',
              border: '1px solid rgba(56, 189, 248, 0.12)',
            }}>
              <Box sx={{
                width: 6, height: 6,
                borderRadius: '50%',
                bgcolor: '#4ade80',
                boxShadow: '0 0 8px rgba(74, 222, 128, 0.5)',
                animation: `${dotPulse} 2s ease-in-out infinite`,
              }} />
              <Typography sx={{
                fontFamily: MONO,
                fontSize: '0.65rem',
                fontWeight: 600,
                color: 'rgba(226, 232, 240, 0.6)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}>
                System Active
              </Typography>
            </Box>

            {/* Version badge */}
            <Typography sx={{
              fontFamily: MONO,
              fontSize: '0.6rem',
              fontWeight: 500,
              color: 'rgba(148, 163, 184, 0.5)',
              letterSpacing: '0.06em',
            }}>
              v{appConfig.version}
            </Typography>
          </Box>
        </Box>

        {/* ================================================================
            RIGHT SIDE — LOGIN CARD
            ================================================================ */}
        <Box sx={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          maxWidth: 400,
          flexShrink: 0,
          animation: `${slideUp} 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.15s both`,
        }}>
          <Box sx={{
            borderRadius: '24px',
            background: `linear-gradient(160deg,
              rgba(15, 20, 40, 0.65) 0%,
              rgba(10, 14, 30, 0.75) 100%
            )`,
            backdropFilter: 'blur(32px) saturate(1.2)',
            WebkitBackdropFilter: 'blur(32px) saturate(1.2)',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: `
              0 24px 64px rgba(0,0,0,0.4),
              0 0 0 1px rgba(255,255,255,0.03) inset,
              0 1px 0 rgba(255,255,255,0.05) inset
            `,
            overflow: 'hidden',
            position: 'relative',
          }}>

            {/* Top accent bar */}
            <Box sx={{
              position: 'absolute',
              top: 0, left: 0, right: 0,
              height: '3px',
              background: `linear-gradient(90deg,
                transparent 0%,
                ${AZURE} 20%,
                ${INDIGO} 50%,
                ${VIOLET} 80%,
                transparent 100%
              )`,
              opacity: 0.7,
            }} />

            {/* Corner glow */}
            <Box sx={{
              position: 'absolute',
              top: 0, left: 0,
              width: '50%', height: '40%',
              background: `radial-gradient(ellipse at top left,
                rgba(56, 189, 248, 0.06) 0%,
                transparent 60%
              )`,
              pointerEvents: 'none',
            }} />

            {/* Watermark */}
            <Box sx={{
              position: 'absolute',
              top: 20, right: 20,
              opacity: 0.02,
              pointerEvents: 'none',
              zIndex: 0,
            }}>
              <LockOpenOutlinedIcon sx={{ fontSize: 90, color: '#fff' }} />
            </Box>

            <Box sx={{ position: 'relative', zIndex: 1, p: { xs: 3, sm: 3.5 } }}>

              {/* Mobile Logo */}
              <Box sx={{
                display: { xs: 'flex', md: 'none' },
                alignItems: 'center',
                gap: 1.5,
                mb: 3,
              }}>
                <Box sx={{
                  width: 44, height: 44,
                  borderRadius: '12px',
                  background: 'rgba(56, 189, 248, 0.08)',
                  border: '1px solid rgba(56, 189, 248, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Box component="img" src={logo} alt="Logo" sx={{ width: 30, height: 30, objectFit: 'contain' }} />
                </Box>
                <Box>
                  <Typography sx={{
                    fontFamily: FONT,
                    fontSize: '1.1rem',
                    fontWeight: 800,
                    color: '#f1f5f9',
                    lineHeight: 1.1,
                  }}>
                    {appConfig.appName}
                  </Typography>
                  <Typography sx={{
                    fontFamily: MONO,
                    fontSize: '0.48rem',
                    color: AZURE,
                    fontWeight: 600,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    mt: 0.2,
                  }}>
                    {appConfig.tagline}
                  </Typography>
                </Box>
              </Box>

              {/* Welcome header */}
              <Box sx={{ mb: 3 }}>
                <Box sx={{
                  width: 42, height: 42,
                  borderRadius: '12px',
                  background: `linear-gradient(135deg, ${AZURE}15, ${INDIGO}10)`,
                  border: `1px solid ${AZURE}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2,
                }}>
                  <InsightsOutlinedIcon sx={{ fontSize: 22, color: AZURE }} />
                </Box>

                <Typography sx={{
                  fontFamily: FONT,
                  fontSize: '1.5rem',
                  fontWeight: 800,
                  color: '#f1f5f9',
                  lineHeight: 1.15,
                  letterSpacing: '-0.02em',
                }}>
                  Welcome Back
                </Typography>
                <Typography sx={{
                  fontFamily: FONT,
                  fontSize: '0.82rem',
                  color: '#64748b',
                  mt: 0.5,
                  fontWeight: 400,
                }}>
                  Sign in to access your dashboard
                </Typography>
              </Box>

              {/* Auth Form */}
              <AuthLogin />
            </Box>
          </Box>
        </Box>

      </PageRoot>
    </PageContainer>
  );
};

export default Login2;
