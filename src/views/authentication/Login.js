import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, keyframes, styled } from '@mui/material';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import PageContainer from 'src/components/container/PageContainer';
import AuthLogin from './auth/AuthLogin';
import appConfig from 'src/config/appConfig';
import logo from 'src/assets/images/logos/logo_landing.png';
import backgroundVideo from 'src/assets/video/videoplayback.mp4';

const FONT = "'Inter', 'Segoe UI', -apple-system, BlinkMacSystemFont, 'Roboto', sans-serif";
const MONO = "'SF Mono', 'Fira Code', 'Cascadia Code', 'Consolas', monospace";

/* ── Keyframes ── */
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const slideInLeft = keyframes`
  from { opacity: 0; transform: translateX(-20px); }
  to   { opacity: 1; transform: translateX(0); }
`;

const slideInRight = keyframes`
  from { opacity: 0; transform: translateX(20px); }
  to   { opacity: 1; transform: translateX(0); }
`;

const shimmer = keyframes`
  0%   { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const pulseGlow = keyframes`
  0%, 100% { opacity: 0.5; }
  50%      { opacity: 1; }
`;

const cardGlow = keyframes`
  0%, 100% { box-shadow: 0 0 0 1.5px rgba(99,102,241,0.2), 0 0 40px rgba(99,102,241,0.1), 0 25px 60px rgba(0,0,0,0.5); }
  50%      { box-shadow: 0 0 0 1.5px rgba(99,102,241,0.35), 0 0 60px rgba(99,102,241,0.18), 0 25px 60px rgba(0,0,0,0.5); }
`;

const borderRotate = keyframes`
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

/* ── Styled ── */
const PageRoot = styled(Box)({
  minHeight: '100vh',
  width: '100vw',
  position: 'relative',
  overflow: 'hidden',
  display: 'flex',
  fontFamily: FONT,
  '&::after': {
    content: '""',
    position: 'absolute',
    inset: 0,
    background: `
      radial-gradient(ellipse 60% 50% at 10% 85%, rgba(99,102,241,0.08) 0%, transparent 55%),
      radial-gradient(ellipse 50% 40% at 85% 15%, rgba(6,182,212,0.06) 0%, transparent 50%),
      linear-gradient(180deg, rgba(0,0,0,0.05) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.08) 100%)
    `,
    zIndex: 1,
    pointerEvents: 'none',
  },
});

const VideoBg = styled('video')({
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  zIndex: 0,
  opacity: 0.85,
  filter: 'brightness(1.05) saturate(1.2) contrast(1.05)',
});

const INDIGO = '#6366f1';
const CYAN = '#06b6d4';

const Login2 = () => {
  const videoRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    videoRef.current?.play().catch(() => {});
  }, []);

  const contactPeople = [
    { name: 'Dr. Anand Kumar', designation: 'Chief Intelligence Analyst', phone: '+91 98765 43210', initials: 'AK', color: INDIGO },
    { name: 'Ms. Priya Sharma', designation: 'Sr. Operations Lead', phone: '+91 98765 43211', initials: 'PS', color: CYAN },
  ];

  return (
    <PageContainer title="Login" description={`${appConfig.appName} - ${appConfig.tagline}`}>
      <PageRoot>
        {/* Video Background */}
        <VideoBg ref={videoRef} autoPlay loop muted playsInline preload="auto">
          <source src={backgroundVideo} type="video/mp4" />
        </VideoBg>

        {/* Grid Overlay */}
        <Box sx={{
          position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
          backgroundImage: `
            linear-gradient(rgba(99,102,241,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,102,241,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }} />

        {/* ── Main Content ── */}
        <Box sx={{
          position: 'relative', zIndex: 2, width: '100%', minHeight: '100vh',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          p: { xs: 1.5, sm: 2, md: 3 },
        }}>
          {/* ── Glass Card ── */}
          <Box sx={{
            display: 'flex', flexDirection: 'column',
            maxWidth: 880, width: '100%', borderRadius: '24px',
            overflow: 'hidden', position: 'relative', color: '#fff',
            backdropFilter: 'blur(28px) saturate(1.4)',
            WebkitBackdropFilter: 'blur(28px) saturate(1.4)',
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'scale(1)' : 'scale(0.97)',
            transition: 'all 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
            animation: `${cardGlow} 4s ease-in-out infinite`,
            '&::before': {
              content: '""', position: 'absolute', inset: 0,
              borderRadius: '24px', padding: '1.5px',
              background: `linear-gradient(135deg, rgba(99,102,241,0.5), rgba(6,182,212,0.2), rgba(99,102,241,0.35), rgba(255,255,255,0.08))`,
              backgroundSize: '300% 300%',
              animation: `${borderRotate} 8s ease infinite`,
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor', maskComposite: 'exclude',
              pointerEvents: 'none', zIndex: 10,
            },
          }}>
            {/* ── Two-Panel Row ── */}
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>

              {/* ════ LEFT PANEL — Branding ════ */}
              <Box sx={{
                flex: { xs: 'none', md: '1 1 52%' },
                background: `linear-gradient(160deg,
                  rgba(2,4,15,0.96) 0%,
                  rgba(15,10,40,0.94) 40%,
                  rgba(8,20,50,0.9) 100%
                )`,
                p: { xs: 3, md: '32px 28px' },
                display: 'flex', flexDirection: 'column', justifyContent: 'center',
                position: 'relative', overflow: 'hidden',
                animation: `${slideInLeft} 0.6s cubic-bezier(0.16, 1, 0.3, 1)`,
              }}>
                {/* Dot grid */}
                <Box sx={{
                  position: 'absolute', inset: 0,
                  backgroundImage: `radial-gradient(rgba(99,102,241,0.06) 1px, transparent 1px)`,
                  backgroundSize: '20px 20px', pointerEvents: 'none',
                }} />

                {/* Logo + App Name */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5, position: 'relative' }}>
                  <Box sx={{
                    width: 48, height: 48, borderRadius: '12px',
                    background: 'linear-gradient(145deg, rgba(6,10,20,0.95), rgba(15,10,35,0.9))',
                    border: `1.5px solid rgba(99,102,241,0.3)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: `0 0 20px rgba(99,102,241,0.12)`,
                    flexShrink: 0,
                  }}>
                    <Box component="img" src={logo} alt="Logo" sx={{ width: 34, height: 34, objectFit: 'contain' }} />
                  </Box>
                  <Box>
                    <Typography sx={{
                      fontFamily: FONT, fontSize: { xs: '1.35rem', md: '1.5rem' }, fontWeight: 800,
                      background: `linear-gradient(135deg, #fff 0%, #e0e7ff 50%, ${INDIGO} 100%)`,
                      backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                      lineHeight: 1.1, letterSpacing: '-0.02em',
                      filter: `drop-shadow(0 0 10px rgba(99,102,241,0.15))`,
                    }}>
                      {appConfig.appName}
                    </Typography>
                    <Typography sx={{
                      fontFamily: MONO, fontSize: '0.6rem', color: INDIGO,
                      fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', mt: 0.3,
                      textShadow: `0 0 10px rgba(99,102,241,0.3)`,
                    }}>
                      {appConfig.tagline}
                    </Typography>
                  </Box>
                </Box>

                {/* Shimmer Divider */}
                <Box sx={{
                  height: '1px', mb: 2, borderRadius: 1,
                  background: `linear-gradient(90deg, transparent, rgba(99,102,241,0.35), rgba(6,182,212,0.12), transparent)`,
                  backgroundSize: '200% 100%', animation: `${shimmer} 3s linear infinite`,
                }} />

                {/* Description */}
                <Box sx={{ mb: 2.5, position: 'relative' }}>
                  <Typography component="div" sx={{
                    fontFamily: MONO, fontSize: '0.58rem', fontWeight: 600,
                    color: 'rgba(99,102,241,0.85)', letterSpacing: '0.12em',
                    textTransform: 'uppercase', mb: 0.75,
                  }}>
                    Intelligence Platform
                  </Typography>
                  <Typography sx={{
                    fontFamily: FONT, color: '#cbd5e1', fontSize: '0.84rem',
                    lineHeight: 1.6, fontWeight: 400, maxWidth: 340,
                    textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                  }}>
                    Real-time news intelligence, event tracking, and strategic analysis for informed decision-making across domains.
                  </Typography>
                </Box>

                {/* ── Contact Us ── */}
                <Box sx={{ mb: 2 }}>
                  <Typography sx={{
                    fontFamily: MONO, fontSize: '0.56rem', fontWeight: 600,
                    color: INDIGO, letterSpacing: '0.14em',
                    textTransform: 'uppercase', mb: 1,
                  }}>
                    Point of Contact
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {contactPeople.map((person, i) => (
                      <Box key={i} sx={{
                        display: 'flex', alignItems: 'center', gap: 1.25,
                        px: 1.5, py: 1, borderRadius: '10px',
                        background: `linear-gradient(135deg, rgba(99,102,241,0.06) 0%, transparent 100%)`,
                        border: `1px solid rgba(99,102,241,0.15)`,
                        animation: `${fadeInUp} 0.4s ease-out ${0.3 + i * 0.1}s both`,
                        transition: 'all 0.25s ease', cursor: 'default',
                        '&:hover': {
                          borderColor: `rgba(99,102,241,0.3)`,
                          background: `linear-gradient(135deg, rgba(99,102,241,0.12) 0%, transparent 100%)`,
                        },
                      }}>
                        {/* Avatar */}
                        <Box sx={{
                          width: 38, height: 38, borderRadius: '10px', flexShrink: 0,
                          background: `linear-gradient(135deg, ${person.color}25, ${person.color}0A)`,
                          border: `1px solid ${person.color}30`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <Typography sx={{
                            fontFamily: FONT, fontSize: '0.7rem', fontWeight: 700,
                            color: person.color, lineHeight: 1,
                          }}>
                            {person.initials}
                          </Typography>
                        </Box>
                        {/* Details */}
                        <Box sx={{ minWidth: 0 }}>
                          <Typography sx={{
                            fontFamily: FONT, fontSize: '0.78rem', fontWeight: 700,
                            color: '#fff', lineHeight: 1.2,
                            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                          }}>
                            {person.name}
                          </Typography>
                          <Typography sx={{
                            fontFamily: FONT, fontSize: '0.6rem', fontWeight: 500,
                            color: person.color, lineHeight: 1.2, mt: 0.15,
                          }}>
                            {person.designation}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4, mt: 0.3 }}>
                            <PhoneOutlinedIcon sx={{ fontSize: 11, color: '#a5b4c8' }} />
                            <Typography sx={{
                              fontFamily: MONO, fontSize: '0.6rem', fontWeight: 500,
                              color: '#c8d6e5', letterSpacing: '0.02em',
                            }}>
                              {person.phone}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Box>

                {/* ── Stats Row ── */}
                <Box sx={{
                  display: 'flex', gap: 3, pt: 1.5,
                  borderTop: '1px solid rgba(99,102,241,0.12)',
                }}>
                  {[
                    { val: '24/7', label: 'Monitoring' },
                    { val: '195+', label: 'Countries' },
                    { val: 'Live', label: 'Updates' },
                  ].map((s, i) => (
                    <Box key={i} sx={{ animation: `${fadeInUp} 0.5s ease-out ${0.5 + i * 0.08}s both` }}>
                      <Typography sx={{
                        fontFamily: MONO, fontSize: '1rem', fontWeight: 800, color: INDIGO,
                        lineHeight: 1, textShadow: `0 0 14px rgba(99,102,241,0.35)`,
                        letterSpacing: '-0.02em',
                      }}>
                        {s.val}
                      </Typography>
                      <Typography sx={{
                        fontFamily: MONO, fontSize: '0.5rem', color: '#a5b4c8',
                        mt: 0.3, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase',
                      }}>
                        {s.label}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>

              {/* ════ RIGHT PANEL — Login Form ════ */}
              <Box sx={{
                flex: { xs: 'none', md: '1 1 48%' },
                background: `linear-gradient(160deg,
                  rgba(4,6,18,0.96) 0%,
                  rgba(10,12,30,0.94) 50%,
                  rgba(4,6,18,0.96) 100%
                )`,
                p: { xs: 3, md: '32px 36px' },
                display: 'flex', flexDirection: 'column', justifyContent: 'center',
                animation: `${slideInRight} 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.08s both`,
                position: 'relative',
                borderLeft: { xs: 'none', md: '1px solid rgba(99,102,241,0.1)' },
                borderTop: { xs: '1px solid rgba(99,102,241,0.1)', md: 'none' },
              }}>
                {/* Heading */}
                <Typography sx={{
                  fontFamily: FONT, fontSize: { xs: '1.35rem', md: '1.5rem' },
                  fontWeight: 800, color: '#f1f5f9', lineHeight: 1.2, letterSpacing: '-0.02em',
                  textShadow: '0 2px 8px rgba(0,0,0,0.3)',
                }}>
                  Sign In
                </Typography>
                <Typography sx={{
                  fontFamily: FONT, fontSize: '0.84rem',
                  color: '#94a3b8', mt: 0.4, mb: 2.5, fontWeight: 400,
                }}>
                  Access the intelligence dashboard
                </Typography>

                {/* Auth Form */}
                <AuthLogin />

                {/* Footer */}
                <Box sx={{ mt: 2.5, textAlign: 'center' }}>
                  <Typography sx={{
                    fontFamily: MONO, fontSize: '0.54rem',
                    color: '#64748b', fontWeight: 400, letterSpacing: '0.04em',
                  }}>
                    {appConfig.companyName} // {appConfig.appName} v{appConfig.version}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Bottom-left status */}
        <Box sx={{
          position: 'absolute', bottom: 14, left: 18, zIndex: 3,
          display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 0.7,
          animation: `${fadeInUp} 0.6s ease-out 0.5s both`,
        }}>
          <Box sx={{
            width: 5, height: 5, borderRadius: '50%', bgcolor: '#22c55e',
            boxShadow: '0 0 7px rgba(34,197,94,0.45)',
            animation: `${pulseGlow} 2s ease-in-out infinite`,
          }} />
          <Typography sx={{
            fontFamily: MONO, fontSize: '0.52rem', color: '#64748b',
            letterSpacing: '0.1em', fontWeight: 500,
          }}>
            SYSTEM ACTIVE &bull; SECURE CONNECTION
          </Typography>
        </Box>

        {/* Bottom-right version */}
        <Box sx={{
          position: 'absolute', bottom: 14, right: 18, zIndex: 3,
          display: { xs: 'none', md: 'flex' },
          animation: `${fadeInUp} 0.6s ease-out 0.6s both`,
        }}>
          <Typography sx={{
            fontFamily: MONO, fontSize: '0.5rem', color: '#64748b',
            letterSpacing: '0.1em',
          }}>
            v{appConfig.version}
          </Typography>
        </Box>
      </PageRoot>
    </PageContainer>
  );
};

export default Login2;
