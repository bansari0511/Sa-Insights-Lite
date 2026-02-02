import React from 'react';
import { Box, Typography, keyframes } from '@mui/material';
import {
  componentColors,
  loadingStyles,
  cardStyles,
  shadowStyles,
  tokens,
  keyframes as themeKeyframes,
} from '../../theme';

// Pulse animation for the icon
const pulse = keyframes`
  0%, 100% {
    opacity: 0.4;
    transform: scale(0.95);
  }
  50% {
    opacity: 1;
    transform: scale(1);
  }
`;

// Shimmer animation for skeleton loading
const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

// Dot animation for loading text
const dotPulse = keyframes`
  0%, 80%, 100% {
    opacity: 0;
  }
  40% {
    opacity: 1;
  }
`;

/**
 * Lightweight page loader component with minimal DOM elements
 * @param {Object} props
 * @param {React.ReactNode} props.icon - Icon component to display
 * @param {string} props.title - Loading title text
 * @param {string} props.subtitle - Optional subtitle text
 * @param {string} props.accentColor - Primary accent color (default: #5D87FF)
 * @param {string} props.bgColor - Background color (default: #F5F7FA)
 */
export default function PageLoader({
  icon: Icon,
  title = 'Loading...',
  subtitle = 'Please wait while we fetch your data',
  accentColor = componentColors.accents.blue,
  bgColor = componentColors.background.light,
}) {
  return (
    <Box
      sx={{
        ...loadingStyles.container,
        width: '100%',
        minHeight: '100vh',
        background: bgColor,
        p: 3,
      }}
    >
      {/* Centered Loading Card */}
      <Box
        sx={{
          background: componentColors.white,
          borderRadius: tokens.borderRadius.xl,
          boxShadow: shadowStyles.lg,
          border: `1px solid ${accentColor}1A`,
          p: { xs: 4, sm: 5 },
          maxWidth: '400px',
          width: '100%',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Top accent line */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: `linear-gradient(90deg, ${accentColor}00 0%, ${accentColor} 50%, ${accentColor}00 100%)`,
            backgroundSize: '200% 100%',
            animation: `${shimmer} 2s ease-in-out infinite`,
          }}
        />

        {/* Icon with pulse animation */}
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: '20px',
            background: `linear-gradient(135deg, ${accentColor}15 0%, ${accentColor}08 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
            animation: `${pulse} 2s ease-in-out infinite`,
          }}
        >
          {Icon && (
            <Icon
              sx={{
                fontSize: 40,
                color: accentColor,
              }}
            />
          )}
        </Box>

        {/* Title */}
        <Typography
          variant="h6"
          sx={{
            color: componentColors.text.primary,
            fontWeight: 700,
            fontSize: '1.1rem',
            mb: 1,
            fontFamily: "'Inter', sans-serif",
          }}
        >
          {title}
        </Typography>

        {/* Subtitle with animated dots */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
          <Typography
            sx={{
              color: componentColors.text.muted,
              fontSize: '0.9rem',
              fontFamily: "'Inter', sans-serif",
            }}
          >
            {subtitle}
          </Typography>
          <Box sx={{ display: 'flex', gap: '3px', ml: 0.5 }}>
            {[0, 1, 2].map((i) => (
              <Box
                key={i}
                sx={{
                  width: 4,
                  height: 4,
                  borderRadius: '50%',
                  background: accentColor,
                  animation: `${dotPulse} 1.4s ease-in-out infinite`,
                  animationDelay: `${i * 0.2}s`,
                }}
              />
            ))}
          </Box>
        </Box>

        {/* Skeleton preview lines */}
        <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {[100, 80, 60].map((width, i) => (
            <Box
              key={i}
              sx={{
                height: 12,
                borderRadius: 6,
                width: `${width}%`,
                mx: 'auto',
                background: `linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)`,
                backgroundSize: '200% 100%',
                animation: `${shimmer} 1.5s ease-in-out infinite`,
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
}

/**
 * Inline loader for sections within a page
 */
export function SectionLoader({
  icon: Icon,
  message = 'Loading...',
  accentColor = componentColors.accents.blue,
  height = '200px',
}) {
  return (
    <Box
      sx={{
        width: '100%',
        height,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        background: componentColors.white,
        borderRadius: tokens.borderRadius.lg,
        border: `1px solid ${componentColors.border.light}`,
      }}
    >
      <Box
        sx={{
          width: 48,
          height: 48,
          borderRadius: tokens.borderRadius.lg,
          background: `${accentColor}12`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: `${pulse} 1.5s ease-in-out infinite`,
        }}
      >
        {Icon && <Icon sx={{ fontSize: 24, color: accentColor }} />}
      </Box>
      <Typography sx={{ color: componentColors.text.muted, fontSize: '0.85rem' }}>
        {message}
      </Typography>
    </Box>
  );
}

/**
 * Skeleton card loader
 */
export function CardSkeleton({ height = '180px', accentColor = componentColors.accents.blue }) {
  return (
    <Box
      sx={{
        width: '100%',
        height,
        background: componentColors.white,
        borderRadius: tokens.borderRadius.xl,
        border: `1px solid ${componentColors.border.light}`,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Top accent line */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: `linear-gradient(90deg, ${accentColor}00 0%, ${accentColor}40 50%, ${accentColor}00 100%)`,
          backgroundSize: '200% 100%',
          animation: `${shimmer} 2s ease-in-out infinite`,
        }}
      />

      {/* Skeleton content */}
      <Box sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Header skeleton */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '10px',
              background: `linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%)`,
              backgroundSize: '200% 100%',
              animation: `${shimmer} 1.5s ease-in-out infinite`,
            }}
          />
          <Box sx={{ flex: 1 }}>
            <Box
              sx={{
                height: 14,
                width: '60%',
                borderRadius: 7,
                background: `linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%)`,
                backgroundSize: '200% 100%',
                animation: `${shimmer} 1.5s ease-in-out infinite`,
                mb: 1,
              }}
            />
            <Box
              sx={{
                height: 10,
                width: '40%',
                borderRadius: 5,
                background: `linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%)`,
                backgroundSize: '200% 100%',
                animation: `${shimmer} 1.5s ease-in-out infinite`,
                animationDelay: '0.1s',
              }}
            />
          </Box>
        </Box>

        {/* Content skeleton lines */}
        {[95, 85, 70].map((width, i) => (
          <Box
            key={i}
            sx={{
              height: 12,
              width: `${width}%`,
              borderRadius: 6,
              background: `linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%)`,
              backgroundSize: '200% 100%',
              animation: `${shimmer} 1.5s ease-in-out infinite`,
              animationDelay: `${i * 0.15}s`,
            }}
          />
        ))}
      </Box>
    </Box>
  );
}
