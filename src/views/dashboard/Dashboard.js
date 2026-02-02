import React from 'react';
import { Grid, Box, Typography, Card } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PageContainer from 'src/components/container/PageContainer';
import EquipmentIcon from '@mui/icons-material/Hardware';
import EventIcon from '@mui/icons-material/Event';
import GroupIcon from '@mui/icons-material/Group';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import TimelineIcon from '@mui/icons-material/Timeline';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import {
  componentGradients,
  componentColors,
  shadowStyles,
  cardStyles,
  typographyStyles,
  keyframes,
} from '../../theme';

const Dashboard = () => {
  const navigate = useNavigate();

  const dashboardCards = [
    {
      title: 'News',
      description: 'Latest intelligence briefings and updates',
      icon: NewspaperIcon,
      onClick: () => navigate('/newsRoom'),
      gradient: componentGradients.dashboard.news,
      bgColor: `${componentColors.accents.green}0D`,
      shadowColor: shadowStyles.green.sm.replace('0 4px 14px ', ''),
      iconColor: componentColors.accents.green,
    },
    {
      title: 'Map Timeline',
      description: 'Visualize events across geographic locations',
      icon: TimelineIcon,
      onClick: () => navigate('/map-and-timeline'),
      gradient: componentGradients.dashboard.mapTimeline,
      bgColor: `${componentColors.accents.amber}0D`,
      shadowColor: shadowStyles.amber.sm.replace('0 4px 14px ', ''),
      iconColor: componentColors.accents.amber,
    },
    {
      title: 'ORBAT',
      description: 'Order of Battle visualization and analysis',
      icon: AccountTreeIcon,
      onClick: () => navigate('/obat'),
      gradient: componentGradients.dashboard.orbat,
      bgColor: `${componentColors.accents.purple}0D`,
      shadowColor: shadowStyles.purple.sm.replace('0 4px 14px ', ''),
      iconColor: componentColors.accents.purple,
    },
    {
      title: 'Equipment',
      description: 'Comprehensive equipment database and management',
      icon: EquipmentIcon,
      onClick: () => navigate('/equipment'),
      gradient: componentGradients.dashboard.equipment,
      bgColor: `${componentColors.accents.indigo}0D`,
      shadowColor: shadowStyles.indigo.sm.replace('0 4px 14px ', ''),
      iconColor: componentColors.accents.indigo,
    },
    {
      title: 'Events',
      description: 'Track and analyze real-time events',
      icon: EventIcon,
      onClick: () => navigate('/event'),
      gradient: componentGradients.dashboard.events,
      bgColor: `${componentColors.accents.pink}0D`,
      shadowColor: `${componentColors.accents.pink}40`,
      iconColor: componentColors.accents.pink,
    },
    {
      title: 'Military Groups',
      description: 'Explore military organizations and hierarchies',
      icon: GroupIcon,
      onClick: () => navigate('/military-group'),
      gradient: componentGradients.dashboard.militaryGroups,
      bgColor: `${componentColors.accents.cyan}0D`,
      shadowColor: shadowStyles.cyan.sm.replace('0 4px 14px ', ''),
      iconColor: componentColors.accents.cyan,
    },

  ];

  return (
    <PageContainer title="Dashboard" description="this is Dashboard">
      <Box
        sx={{
          minHeight: 'calc(100vh - 75px)',
          background: `
            ${componentGradients.decorative.radialBlue},
            ${componentGradients.decorative.radialPink},
            ${componentGradients.decorative.radialCyan},
            ${componentGradients.decorative.page}
          `,
          py: 2,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Animated Gradient Orbs */}
        <Box
          sx={{
            position: 'absolute',
            right: '15%',
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.08) 40%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(50px)',
            pointerEvents: 'none',
            animation: 'float 20s ease-in-out infinite',
            '@keyframes float': {
              '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
              '33%': { transform: 'translate(30px, -30px) scale(1.1)' },
              '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
            },
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '8%',
            left: '10%',
            width: '350px',
            height: '350px',
            background: 'radial-gradient(circle, rgba(236, 72, 153, 0.12) 0%, rgba(244, 63, 94, 0.06) 40%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(45px)',
            pointerEvents: 'none',
            animation: 'float-reverse 18s ease-in-out infinite',
            '@keyframes float-reverse': {
              '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
              '33%': { transform: 'translate(-25px, 25px) scale(1.05)' },
              '66%': { transform: 'translate(20px, -15px) scale(0.95)' },
            },
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: '18%',
            left: '50%',
            width: '280px',
            height: '300px',
            background: 'radial-gradient(circle, rgba(14, 165, 233, 0.1) 0%, rgba(6, 182, 212, 0.05) 40%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(40px)',
            pointerEvents: 'none',
            animation: 'pulse 15s ease-in-out infinite',
            '@keyframes pulse': {
              '0%, 100%': { transform: 'translate(-50%, -50%) scale(1)', opacity: 0.6 },
              '50%': { transform: 'translate(-50%, -50%) scale(1.2)', opacity: 0.8 },
            },
          }}
        />

        {/* Geometric Patterns */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `
              linear-gradient(rgba(99, 102, 241, 0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(99, 102, 241, 0.03) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            pointerEvents: 'none',
            opacity: 0.4,
          }}
        />

        {/* Main Content Container with Border */}
        <Box
          sx={{
            position: 'relative',
            maxWidth: '1400px',
            margin: '0 auto',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.92) 100%)',
            backdropFilter: 'blur(20px)',
            borderRadius: '28px',
            padding: { xs: 3, sm: 4, md: 5, lg: 6 },
            border: '3px solid transparent',
            backgroundImage: `
              linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(255, 255, 255, 0.92)),
              linear-gradient(135deg, #6366f1 0%, #ec4899 25%, #0ea5e9 50%, #10b981 75%, #f59e0b 100%)
            `,
            backgroundOrigin: 'border-box',
            backgroundClip: 'padding-box, border-box',
            boxShadow: `
              0 0 0 1px rgba(99, 102, 241, 0.15),
              0 20px 60px -15px rgba(0, 0, 0, 0.15),
              0 0 80px rgba(99, 102, 241, 0.08),
              inset 0 1px 0 rgba(255, 255, 255, 0.9)
            `,
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: `
                0 0 0 1px rgba(99, 102, 241, 0.2),
                0 25px 70px -15px rgba(0, 0, 0, 0.2),
                0 0 100px rgba(99, 102, 241, 0.12),
                inset 0 1px 0 rgba(255, 255, 255, 0.9)
              `,
            },
          }}
        >

          {/* Header Section */}
          <Box
            sx={{
              mb: 1,
              textAlign: 'center',
              position: 'relative',
              zIndex: 1,
            }}
          >
            <Typography
              variant="h2"
              sx={{
                fontWeight: 800,
                mb: 1,
                fontSize: { xs: '2rem', md: '2.75rem' },
                letterSpacing: '-0.03em',
                ...typographyStyles.gradient(`linear-gradient(135deg, ${componentColors.accents.indigo} 0%, ${componentColors.accents.pink} 50%, ${componentColors.accents.cyan} 100%)`),
              }}
            >
              Intelligence Dashboard
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: componentColors.text.muted,
                fontSize: { xs: '0.9375rem', md: '1rem' },
                fontWeight: 400,
                maxWidth: '550px',
                margin: '0 auto',
              }}
            >
              Comprehensive strategic analysis & data intelligence platform
            </Typography>
          </Box>

          {/* Cards Grid - Centered */}
          <Box
            sx={{
              position: 'relative',
              zIndex: 1,
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Grid
              container
              spacing={3}
              sx={{
                maxWidth: '1100px',
                margin: '0 auto',
              }}
            >
              {dashboardCards.map((card, index) => {
                const Icon = card.icon;
                return (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card
                      onClick={card.onClick}
                      sx={{
                        height: '260px',
                        cursor: 'pointer',
                        background: '#ffffff',
                        border: '1.5px solid #e2e8f0',
                        borderRadius: '16px',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        position: 'relative',
                        overflow: 'hidden',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: card.bgColor,
                          opacity: 0,
                          transition: 'opacity 0.3s ease',
                          zIndex: 0,
                        },
                        '&:hover': {
                          transform: 'translateY(-6px)',
                          boxShadow: `0 12px 32px ${card.shadowColor}`,
                          border: `1.5px solid ${card.iconColor}`,
                          '&::before': {
                            opacity: 1,
                          },
                          '& .icon-box': {
                            transform: 'scale(1.08)',
                            boxShadow: `0 6px 20px ${card.shadowColor}`,
                          },
                          '& .arrow-icon': {
                            transform: 'translateX(6px)',
                            color: card.iconColor,
                          },
                          '& .explore-text': {
                            color: card.iconColor,
                          },
                        },
                      }}
                    >
                      <Box
                        sx={{
                          p: 3.5,
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          position: 'relative',
                          zIndex: 1,
                        }}
                      >
                        {/* Icon Container */}
                        <Box
                          className="icon-box"
                          sx={{
                            width: '64px',
                            height: '64px',
                            borderRadius: '14px',
                            background: card.gradient,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mb: 2.5,
                            boxShadow: `0 4px 12px ${card.shadowColor}`,
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          }}
                        >
                          <Icon sx={{ fontSize: '2rem', color: 'white' }} />
                        </Box>

                        {/* Title */}
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 700,
                            color: componentColors.text.primary,
                            mb: 1.5,
                            fontSize: '1.25rem',
                            letterSpacing: '-0.01em',
                          }}
                        >
                          {card.title}
                        </Typography>

                        {/* Description */}
                        <Typography
                          variant="body2"
                          sx={{
                            color: componentColors.text.muted,
                            fontSize: '0.875rem',
                            lineHeight: 1.6,
                            mb: 2.5,
                            flex: 1,
                          }}
                        >
                          {card.description}
                        </Typography>

                        {/* Action Button */}
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                          }}
                        >
                          <Typography
                            className="explore-text"
                            sx={{
                              fontSize: '0.875rem',
                              fontWeight: 600,
                              letterSpacing: '0.3px',
                              color: componentColors.text.muted,
                              transition: 'color 0.3s ease',
                            }}
                          >
                            Explore Module
                          </Typography>
                          <ArrowForwardIcon
                            className="arrow-icon"
                            sx={{
                              fontSize: '1.1rem',
                              transition: 'all 0.3s ease',
                              color: componentColors.text.muted,
                            }}
                          />
                        </Box>
                      </Box>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        </Box>

      </Box>
    </PageContainer>
  );
};

export default Dashboard;