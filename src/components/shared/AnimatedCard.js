import * as React from 'react';
import { Card, CardContent, Box, useTheme } from '@mui/material';
import { keyframes } from '@mui/system';

// Fade-in and slide-up animation
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Shimmer effect animation
const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`;

/**
 * AnimatedCard - A reusable, animated card component with hover effects
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Card content
 * @param {number} props.delay - Animation delay in milliseconds (default: 0)
 * @param {boolean} props.hover - Enable hover animations (default: true)
 * @param {Object} props.sx - Additional MUI sx styling
 */
const AnimatedCard = ({
  children,
  delay = 0,
  hover = true,
  gradient = false,
  compact = false,
  ...props
}) => {
  const theme = useTheme();
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <Card
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '16px',
        background: gradient
          ? `linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.95) 100%)`
          : 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        border: `1px solid rgba(139, 92, 246, 0.12)`,
        boxShadow: `
          0 4px 20px rgba(139, 92, 246, 0.08),
          0 2px 8px rgba(0, 0, 0, 0.04),
          inset 0 1px 0 rgba(255, 255, 255, 0.8)
        `,
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        animation: `${fadeInUp} 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms both`,

        // Top gradient border
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: 'linear-gradient(90deg, #8B5CF6 0%, #A78BFA 50%, #3B82F6 100%)',
          opacity: 0.8,
          transition: 'all 0.3s ease',
        },

        // Shimmer effect overlay
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(
            90deg,
            transparent 0%,
            rgba(139, 92, 246, 0.05) 50%,
            transparent 100%
          )`,
          backgroundSize: '1000px 100%',
          animation: isHovered ? `${shimmer} 2s infinite` : 'none',
          pointerEvents: 'none',
        },

        ...(hover && {
          '&:hover': {
            transform: 'translateY(-8px) scale(1.01)',
            boxShadow: `
              0 12px 40px rgba(139, 92, 246, 0.15),
              0 6px 16px rgba(0, 0, 0, 0.08),
              inset 0 1px 0 rgba(255, 255, 255, 0.9)
            `,
            borderColor: 'rgba(139, 92, 246, 0.25)',

            '&::before': {
              height: '4px',
              opacity: 1,
              boxShadow: '0 2px 12px rgba(139, 92, 246, 0.4)',
            },
          },
        }),

        ...(compact && {
          '& .MuiCardContent-root': {
            padding: '16px',
            '&:last-child': {
              paddingBottom: '16px',
            },
          },
        }),

        ...props.sx,
      }}
      {...props}
    >
      {/* Glow effect on hover */}
      <Box
        sx={{
          position: 'absolute',
          top: -100,
          right: -100,
          width: 200,
          height: 200,
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
          borderRadius: '50%',
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 0.6s ease',
          pointerEvents: 'none',
        }}
      />

      <CardContent sx={{ position: 'relative', zIndex: 1 }}>
        {children}
      </CardContent>
    </Card>
  );
};

export default AnimatedCard;
