import { Box, Typography, Button, useTheme } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import { withOpacity } from '../../theme/palette';

function NewsRoomHeader({
  title = "News and Analysis",
  subtitle = "View Details of any article or analysis",
  secondarySubtitle = null,
  showBackButton = false,
  onBackClick,
  showStats = false,
  totalArticles = 0,
  currentPage = 1,
  totalPages = 1
}) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        mb: 1.2,
        pb: 1,
        position: 'relative',
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: `linear-gradient(90deg,
            ${theme.palette.primary[500]} 0%,
            ${theme.palette.primary[400]} 25%,
            ${withOpacity(theme.palette.primary[300], 0.3)} 75%,
            transparent 100%)`,
        }
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.2,
            background: `linear-gradient(135deg,
              ${withOpacity(theme.palette.primary[50], 0.6)} 0%,
              ${withOpacity(theme.palette.primary[100], 0.2)} 100%)`,
            padding: '10px 14px',
            borderRadius: '8px',
            boxShadow: `0 2px 8px ${withOpacity(theme.palette.primary[400], 0.08)}`,
            transition: 'all 0.3s ease',
            '&:hover': {
              background: `linear-gradient(135deg,
                ${withOpacity(theme.palette.primary[100], 0.7)} 0%,
                ${withOpacity(theme.palette.primary[50], 0.3)} 100%)`,
              boxShadow: `0 3px 12px ${withOpacity(theme.palette.primary[400], 0.12)}`,
              transform: 'translateY(-1px)',
            }
          }}
        >
          <Box sx={{
            width: 36,
            height: 36,
            borderRadius: '8px',
            background: `linear-gradient(135deg, ${theme.palette.primary[600]} 0%, ${theme.palette.primary[500]} 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 2px 8px ${withOpacity(theme.palette.primary[600], 0.3)}`,
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: -1,
              right: -1,
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: theme.palette.success.main,
              border: `2px solid ${theme.palette.common.white}`,
              boxShadow: `0 0 6px ${withOpacity(theme.palette.success.main, 0.5)}`,
            }
          }}>
            <NewspaperIcon
              sx={{
                fontSize: 20,
                color: 'white',
              }}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                fontSize: '1.15rem',
                color: theme.palette.primary[900],
                mb: 0,
                letterSpacing: '-0.015em',
                lineHeight: 1.2,
                fontFamily: "'Inter', 'Roboto', 'Segoe UI', -apple-system, sans-serif",
              }}
            >
              {title}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {showBackButton && (
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={onBackClick}
              size="small"
            >
              Back
            </Button>
          )}

          {showStats && (
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Box sx={{
                px: 2,
                py: 0.75,
                bgcolor: theme.palette.primary.main,
                color: 'white',
                borderRadius: 1,
                fontSize: '0.875rem',
                fontWeight: 600
              }}>
                {totalArticles} Articles
              </Box>
              <Box sx={{
                px: 2,
                py: 0.75,
                bgcolor: theme.palette.primary[500],
                color: 'white',
                borderRadius: 1,
                fontSize: '0.875rem',
                fontWeight: 600
              }}>
                Page {currentPage} of {totalPages}
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default NewsRoomHeader;
