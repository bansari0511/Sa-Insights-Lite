import { useState } from 'react';
import { Box, Typography, ButtonBase, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PageContainer from 'src/components/container/PageContainer';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import TimelineIcon from '@mui/icons-material/Timeline';
import ReportIcon from '@mui/icons-material/Assessment';
import SearchIcon from '@mui/icons-material/ManageSearch';
import ExploreIcon from '@mui/icons-material/Explore';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import HubIcon from '@mui/icons-material/Hub';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import appConfig from '../../config/appConfig';
import {
  componentGradients,
  typographyStyles,
} from '../../theme';

/* ── Color Palette ── */
const P = {
  slate: { 50: '#f8fafc', 100: '#f1f5f9', 200: '#e2e8f0', 300: '#cbd5e1', 400: '#94a3b8', 500: '#64748b', 600: '#475569', 700: '#334155', 800: '#1e293b', 900: '#0f172a' },
  indigo: { 50: '#eef2ff', 100: '#e0e7ff', 200: '#c7d2fe', 300: '#a5b4fc', 400: '#818cf8', 500: '#6366f1', 600: '#4f46e5', 700: '#4338ca' },
  cyan: { 50: '#ecfeff', 100: '#cffafe', 200: '#a5f3fc', 300: '#67e8f9', 400: '#22d3ee', 500: '#06b6d4', 600: '#0891b2' },
};

/* ── Module Data ── */
const modules = [
  {
    id: 'news',
    title: 'News Room',
    subtitle: 'SIGINT / OSINT',
    description: 'Real-time intelligence briefings, open-source analysis, and curated news feeds',
    icon: NewspaperIcon,
    route: '/NewsRoom',
    gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    accentColor: '#10b981',
    shadowColor: 'rgba(16, 185, 129, 0.35)',
    tag: 'Live Feed',
  },
  {
    id: 'briefings',
    title: 'Intelligence Briefings',
    subtitle: 'Analysis Reports',
    description: 'Curated strategic intelligence reports, assessments, and analytical briefs',
    icon: ReportIcon,
    route: '/intelligenceBriefings',
    gradient: `linear-gradient(135deg, ${P.indigo[500]} 0%, ${P.indigo[700]} 100%)`,
    accentColor: P.indigo[500],
    shadowColor: 'rgba(99, 102, 241, 0.35)',
    tag: 'Reports',
  },
  {
    id: 'map',
    title: 'Event Timeline',
    subtitle: 'GEOINT',
    description: 'Geospatial visualization of events, movements, and intelligence overlays',
    icon: TimelineIcon,
    route: '/map-and-timeline',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    accentColor: '#f59e0b',
    shadowColor: 'rgba(245, 158, 11, 0.35)',
    tag: 'Geospatial',
  },
  {
    id: 'search',
    title: 'Search & Discovery',
    subtitle: 'Cross-Domain',
    description: 'Unified search across all intelligence sources, entities, and datasets',
    icon: SearchIcon,
    route: '/search',
    gradient: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
    accentColor: '#ec4899',
    shadowColor: 'rgba(236, 72, 153, 0.35)',
    tag: 'Discovery',
  },
  {
    id: 'overview',
    title: 'Global Overview',
    subtitle: 'Situation Awareness',
    description: 'High-level strategic overview with key indicators and operational summary',
    icon: ExploreIcon,
    route: '/',
    gradient: `linear-gradient(135deg, ${P.cyan[500]} 0%, ${P.cyan[600]} 100%)`,
    accentColor: P.cyan[500],
    shadowColor: 'rgba(6, 182, 212, 0.35)',
    tag: 'Overview',
  },
];

const statItems = [
  { icon: HubIcon, label: 'Multi-Source Fusion', value: '5 Modules' },
  { icon: SecurityIcon, label: 'Classification', value: 'Secured' },
  { icon: SpeedIcon, label: 'System Status', value: 'Operational' },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <PageContainer title="Dashboard" description="Multi-Source Intelligence Dashboard">
      <Box
        sx={{
          minHeight: 'calc(100vh - 75px)',
          background: `
            ${componentGradients.decorative.radialBlue},
            ${componentGradients.decorative.radialPink},
            ${componentGradients.decorative.radialCyan},
            ${componentGradients.decorative.page}
          `,
          py: 3,
          px: { xs: 2, sm: 3 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background grid */}
        <Box sx={{
          position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.3,
          backgroundImage: `
            linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }} />

        {/* Floating orbs */}
        <Box sx={{
          position: 'absolute', top: '-5%', right: '10%', width: 320, height: 320,
          background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)',
          borderRadius: '50%', filter: 'blur(50px)', pointerEvents: 'none',
          animation: 'orbFloat 20s ease-in-out infinite',
          '@keyframes orbFloat': {
            '0%, 100%': { transform: 'translate(0,0) scale(1)' },
            '50%': { transform: 'translate(25px,-20px) scale(1.1)' },
          },
        }} />
        <Box sx={{
          position: 'absolute', bottom: '5%', left: '5%', width: 280, height: 280,
          background: 'radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)',
          borderRadius: '50%', filter: 'blur(45px)', pointerEvents: 'none',
          animation: 'orbFloat2 18s ease-in-out infinite',
          '@keyframes orbFloat2': {
            '0%, 100%': { transform: 'translate(0,0) scale(1)' },
            '50%': { transform: 'translate(-20px,15px) scale(1.05)' },
          },
        }} />

        {/* ── Main Container ── */}
        <Box sx={{
          position: 'relative', zIndex: 1,
          maxWidth: 1280, mx: 'auto',
        }}>
          {/* ── Header ── */}
          <Box sx={{ textAlign: 'center', mb: { xs: 3, md: 4 } }}>
            {/* Platform badge */}
            <Box sx={{
              display: 'inline-flex', alignItems: 'center', gap: 0.75,
              px: 2, py: 0.6, mb: 2,
              borderRadius: '20px',
              bgcolor: 'rgba(99,102,241,0.08)',
              border: '1px solid rgba(99,102,241,0.15)',
              backdropFilter: 'blur(8px)',
            }}>
              <Box sx={{
                width: 6, height: 6, borderRadius: '50%', bgcolor: '#22c55e',
                boxShadow: '0 0 8px rgba(34,197,94,0.5)',
                animation: 'pulse 2s ease-in-out infinite',
                '@keyframes pulse': {
                  '0%, 100%': { opacity: 1 }, '50%': { opacity: 0.5 },
                },
              }} />
              <Typography sx={{
                fontSize: '0.7rem', fontWeight: 700, color: P.indigo[500],
                letterSpacing: '0.08em', textTransform: 'uppercase',
              }}>
                {appConfig.appNameShort} Platform &bull; {appConfig.version}
              </Typography>
            </Box>

            <Typography variant="h3" sx={{
              fontWeight: 800, mb: 0.75,
              fontSize: { xs: '1.75rem', sm: '2.2rem', md: '2.6rem' },
              letterSpacing: '-0.03em', lineHeight: 1.15,
              ...typographyStyles.gradient(`linear-gradient(135deg, ${P.indigo[600]} 0%, ${P.indigo[400]} 40%, ${P.cyan[500]} 100%)`),
            }}>
              Multi-Source Intelligence Engine
            </Typography>
            <Typography sx={{
              color: P.slate[500], fontSize: { xs: '0.875rem', md: '1rem' },
              fontWeight: 400, maxWidth: 520, mx: 'auto', lineHeight: 1.6,
            }}>
              Unified access to intelligence modules &mdash; analyze, correlate, and act on multi-domain data from a single platform
            </Typography>
          </Box>

          {/* ── Stats Row ── */}
          <Box sx={{
            display: 'flex', justifyContent: 'center', flexWrap: 'wrap',
            gap: { xs: 1.5, md: 2.5 }, mb: { xs: 3, md: 4 },
          }}>
            {statItems.map((stat) => {
              const Icon = stat.icon;
              return (
                <Box key={stat.label} sx={{
                  display: 'flex', alignItems: 'center', gap: 1,
                  px: 2, py: 0.8,
                  borderRadius: '12px',
                  bgcolor: 'rgba(255,255,255,0.7)',
                  border: '1px solid rgba(226,232,240,0.8)',
                  backdropFilter: 'blur(8px)',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                }}>
                  <Icon sx={{ fontSize: 17, color: P.indigo[400] }} />
                  <Typography sx={{ fontSize: '0.72rem', fontWeight: 600, color: P.slate[500], letterSpacing: '0.02em' }}>
                    {stat.label}
                  </Typography>
                  <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: P.indigo[600] }}>
                    {stat.value}
                  </Typography>
                </Box>
              );
            })}
          </Box>

          {/* ── Module Grid ── */}
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
            gap: { xs: 2, md: 2.5 },
            maxWidth: 1080, mx: 'auto',
          }}>
            {modules.map((mod) => {
              const Icon = mod.icon;
              const isHovered = hoveredCard === mod.id;
              return (
                <ButtonBase
                  key={mod.id}
                  onClick={() => navigate(mod.route)}
                  onMouseEnter={() => setHoveredCard(mod.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  sx={{
                    display: 'block', textAlign: 'left', width: '100%',
                    borderRadius: '18px',
                    transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                    transform: isHovered ? 'translateY(-6px)' : 'translateY(0)',
                  }}
                >
                  <Box sx={{
                    p: { xs: 2.5, md: 3 },
                    borderRadius: '18px',
                    bgcolor: 'rgba(255,255,255,0.85)',
                    border: `1.5px solid ${isHovered ? mod.accentColor : P.slate[200]}`,
                    backdropFilter: 'blur(16px)',
                    boxShadow: isHovered
                      ? `0 16px 40px -8px ${mod.shadowColor}, 0 0 0 1px ${mod.accentColor}18`
                      : '0 2px 8px rgba(0,0,0,0.04), 0 0 0 1px rgba(226,232,240,0.5)',
                    transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute', top: 0, left: 0, right: 0,
                      height: '3px',
                      background: mod.gradient,
                      opacity: isHovered ? 1 : 0,
                      transition: 'opacity 0.3s ease',
                    },
                  }}>
                    {/* Top row: Icon + Tag */}
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                      <Box sx={{
                        width: 50, height: 50, borderRadius: '14px',
                        background: mod.gradient,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: `0 4px 14px ${mod.shadowColor}`,
                        transition: 'all 0.3s ease',
                        transform: isHovered ? 'scale(1.08)' : 'scale(1)',
                      }}>
                        <Icon sx={{ fontSize: '1.5rem', color: '#fff' }} />
                      </Box>
                      <Chip
                        label={mod.tag}
                        size="small"
                        sx={{
                          height: 22, fontSize: '0.62rem', fontWeight: 700,
                          letterSpacing: '0.04em', textTransform: 'uppercase',
                          bgcolor: `${mod.accentColor}10`,
                          color: mod.accentColor,
                          border: `1px solid ${mod.accentColor}20`,
                          '& .MuiChip-label': { px: 1 },
                        }}
                      />
                    </Box>

                    {/* Title + Subtitle */}
                    <Typography sx={{
                      fontSize: '1.05rem', fontWeight: 700,
                      color: P.slate[800], lineHeight: 1.25, mb: 0.25,
                    }}>
                      {mod.title}
                    </Typography>
                    <Typography sx={{
                      fontSize: '0.68rem', fontWeight: 600,
                      color: mod.accentColor, letterSpacing: '0.06em',
                      textTransform: 'uppercase', mb: 1,
                      opacity: 0.85,
                    }}>
                      {mod.subtitle}
                    </Typography>

                    {/* Description */}
                    <Typography sx={{
                      fontSize: '0.8rem', color: P.slate[500],
                      lineHeight: 1.55, mb: 2,
                      minHeight: '2.5em',
                    }}>
                      {mod.description}
                    </Typography>

                    {/* Launch row */}
                    <Box sx={{
                      display: 'flex', alignItems: 'center', gap: 0.75,
                      transition: 'all 0.3s ease',
                    }}>
                      <Typography sx={{
                        fontSize: '0.76rem', fontWeight: 600,
                        color: isHovered ? mod.accentColor : P.slate[400],
                        transition: 'color 0.3s ease',
                        letterSpacing: '0.02em',
                      }}>
                        Launch Module
                      </Typography>
                      <ArrowForwardIcon sx={{
                        fontSize: 14,
                        color: isHovered ? mod.accentColor : P.slate[400],
                        transition: 'all 0.3s ease',
                        transform: isHovered ? 'translateX(4px)' : 'translateX(0)',
                      }} />
                    </Box>
                  </Box>
                </ButtonBase>
              );
            })}
          </Box>

          {/* ── Footer ── */}
          <Box sx={{ textAlign: 'center', mt: { xs: 3, md: 4 }, pb: 1 }}>
            <Typography sx={{
              fontSize: '0.68rem', color: P.slate[400], fontWeight: 500,
              letterSpacing: '0.03em',
            }}>
              {appConfig.appName} &bull; {appConfig.tagline} &bull; {appConfig.companyName}
            </Typography>
          </Box>
        </Box>
      </Box>
    </PageContainer>
  );
};

export default Dashboard;
