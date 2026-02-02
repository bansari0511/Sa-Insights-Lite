import React from 'react';
import { useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';


const StyledCardContainer = styled(Paper)(({ theme, accentcolor = 'primary' }) => ({
  borderRadius: '12px',
  background: `linear-gradient(135deg, ${theme.palette[accentcolor].main}08, ${theme.palette.background.paper}f0)`,
  border: `1px solid ${theme.palette[accentcolor].main}20`,
  boxShadow: `0 2px 12px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.6)`,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',

  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: `0 8px 24px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.8)`,
    border: `1px solid ${theme.palette[accentcolor].main}40`,
  }
}));

const CardHeader = styled(Box)(({ theme, accentcolor = 'primary' }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  padding: theme.spacing(1.5, 2, 1),
  borderBottom: `1px solid ${theme.palette[accentcolor].main}10`,
  background: `linear-gradient(135deg, rgba(255, 255, 255, 0.8), ${theme.palette[accentcolor].main}04)`,
}));

const IconContainer = styled(Box)(({ theme, accentcolor = 'primary' }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '32px',
  height: '32px',
  borderRadius: '8px',
  background: `linear-gradient(135deg, ${theme.palette[accentcolor].main}15, ${theme.palette[accentcolor].light}10)`,
  border: `1px solid ${theme.palette[accentcolor].main}20`,

  '& .MuiSvgIcon-root': {
    fontSize: '1.2rem',
    color: theme.palette[accentcolor].main,
    filter: `drop-shadow(0 1px 2px ${theme.palette[accentcolor].main}30)`,
  }
}));

const CardContent = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1.5, 2, 2),
  minHeight: 'fit-content',
}));

// Memoized to prevent unnecessary re-renders
const StyledCard = React.memo(({
  title,
  icon: Icon,
  children,
  accentColor = 'primary',
  ...other
}) => {
  const theme = useTheme();

  return (
    <StyledCardContainer
      elevation={0}
      accentcolor={accentColor}
      {...other}
    >
      <CardHeader accentcolor={accentColor}>
        <IconContainer accentcolor={accentColor}>
          <Icon />
        </IconContainer>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 600,
            color: theme.palette[accentColor]?.dark || theme.palette.primary.dark,
            fontSize: '0.9rem',
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
          }}
        >
          {title}
        </Typography>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </StyledCardContainer>
  );
});

StyledCard.displayName = 'StyledCard';

export default StyledCard;