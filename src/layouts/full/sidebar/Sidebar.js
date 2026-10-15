import { useMediaQuery, Box, Drawer, Typography, Tooltip, IconButton, useTheme } from '@mui/material';
import { IconChevronLeft, IconChevronRight, IconChevronsLeft, IconChevronsRight } from '@tabler/icons-react';
import SidebarItems from './SidebarItems';
import { Upgrade } from './Updrade';
import logo from '../../../assets/images/logos/logo_landing.png';
import { withOpacity } from '../../../theme/palette';
import { SB, sbForTheme } from './sidebarTheme';
import appConfig from '../../../config/appConfig';
import resolveAsset from '../../../utils/resolveAsset';
import { useRemoteBaseUrl } from '../../../context/EmbeddedContext';

const MSidebar = (props) => {
  const theme = useTheme();
  const lgUp = useMediaQuery(theme.breakpoints.up("lg"));
  const { isSidebarOpen, sidebarWidth = 260, isEmbedded = false } = props;
  const remoteBaseUrl = useRemoteBaseUrl();
  const logoResolved = resolveAsset(logo);

  const isCollapsed = !isSidebarOpen;
  const collapsedWidth = 70;

  // Enhanced scrollbar styling with modern look
  const scrollbarStyles = {
    scrollbarWidth: 'thin',
    scrollbarColor: `${SB.scrollThumb} transparent`,
    '&::-webkit-scrollbar': {
      width: '6px',
    },
    '&::-webkit-scrollbar-track': {
      background: SB.scrollTrack,
      borderRadius: theme.custom.tokens.borderRadius.md,
      margin: '4px 0',
    },
    '&::-webkit-scrollbar-thumb': {
      background: SB.scrollThumb,
      borderRadius: theme.custom.tokens.borderRadius.md,
      '&:hover': {
        background: SB.scrollThumbHover,
      },
    },
  };


  if (lgUp) {
    return (
      <Box
        sx={{
          position: isEmbedded ? 'absolute' : 'fixed',
          top: 0,
          left: 0,
          height: isEmbedded ? '100%' : '100vh',
          width: isCollapsed ? collapsedWidth : sidebarWidth,
          zIndex: theme.custom.tokens.zIndex.fixed,
          display: 'flex',
          flexDirection: 'column',
          // Full-height divider between sidebar and content (both app modes)
          boxSizing: 'border-box',
          borderRight: `1px solid ${SB.border}`,
        }}
      >
        {/* Modern Collapsible Sidebar for Desktop */}
        <Drawer
          anchor="left"
          open={true}
          variant="permanent"
          PaperProps={{
            // Scoping hook: this app's global stylesheet stays loaded in the
            // Metis host after you navigate to a sibling child app, so any
            // bare `.MuiDrawer-paper` rule would also repaint *their* sidebar.
            // Sidebar rules in common.css are keyed off this class instead.
            className: 'news-sidebar',
            sx: {
              width: '100%',
              height: '100vh',
              boxSizing: 'border-box',
              background: SB.surface,
              backdropFilter: 'blur(20px) saturate(1.4)',
              WebkitBackdropFilter: 'blur(20px) saturate(1.4)',
              borderRight: `1px solid ${SB.border}`,
              boxShadow: SB.surfaceShadow,
              position: 'relative',
              overflow: 'visible',
              display: 'flex',
              flexDirection: 'column',
              ...scrollbarStyles,
            },
          }}
        >
          {/* Sidebar Content */}
          <Box
            sx={{
              height: '100vh',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              flex: 1,
            }}
          >
            {/* Modern Brand Section */}
            <Box
              sx={{
                p: isCollapsed ? 1.5 : 3,
                borderBottom: `1px solid ${SB.divider}`,
                textAlign: 'center',
                position: 'relative',
                transition: 'none',
                background: `linear-gradient(180deg, ${withOpacity(SB.indigo, 0.06)} 0%, transparent 100%)`,
                backdropFilter: theme.custom.tokens.backdropFilter.sm,
              }}
            >
              {!isCollapsed ? (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 1.5,
                  }}
                >
                  <Box
                    component="img"
                    src={logoResolved}
                    alt={`${appConfig.appName} Logo`}
                    sx={{
                      height: '160px',
                      width: '160px',
                      borderRadius: theme.custom.tokens.borderRadius.sm,
                      filter: `drop-shadow(0 4px 16px ${withOpacity(SB.indigo, 0.22)})`,
                      transition: 'none',
                      '&:hover': {
                        transform: 'none',
                        filter: `drop-shadow(0 6px 20px ${withOpacity(SB.indigo, 0.3)})`,
                      },
                    }}
                  />
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 800,
                      fontSize: '1.5rem',
                      letterSpacing: '2px',
                      textTransform: 'uppercase',
                      background: SB.gradientText,
                      WebkitBackgroundClip: 'text',
                      backgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      color: 'transparent',
                      mt: 0.5,
                    }}
                  >
                    {appConfig.appName.toUpperCase()}
                  </Typography>
                </Box>
              ) : (
                <Tooltip title={appConfig.appName} placement="right" arrow>
                  <Box
                    sx={{
                      position: 'relative',
                      width: 52,
                      height: 52,
                      borderRadius: '14px',
                      background: SB.gradient,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto',
                      border: `1px solid ${withOpacity('#ffffff', 0.5)}`,
                      boxShadow: `
                        0 8px 22px rgba(99, 102, 241, 0.4),
                        0 4px 12px rgba(139, 92, 246, 0.28),
                        inset 0 1px 0 rgba(255, 255, 255, 0.45)
                      `,
                      cursor: 'pointer',
                      transition: 'none',
                      overflow: 'hidden',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 55%, #c026d3 100%)',
                        transform: 'none',
                        borderColor: withOpacity('#ffffff', 0.7),
                        boxShadow: `
                          0 12px 30px rgba(99, 102, 241, 0.55),
                          0 6px 16px rgba(217, 70, 239, 0.4),
                          inset 0 1px 0 rgba(255, 255, 255, 0.6)
                        `,
                      },
                    }}
                  >
                    <Typography
                      variant="h4"
                      sx={{
                        color: theme.palette.common.white,
                        fontWeight: theme.custom.tokens.fontWeight.black,
                        fontSize: '1.75rem',
                        textShadow: `
                          0 2px 8px rgba(0, 0, 0, 0.3),
                          0 0 20px ${withOpacity(theme.palette.common.white, 0.5)}
                        `,
                        fontFamily: theme.typography.fontFamily,
                        letterSpacing: '0.5px',
                        position: 'relative',
                        zIndex: 1,
                        margin: 0,
                        padding: 0,
                        lineHeight: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {appConfig.appName.charAt(0).toUpperCase()}
                    </Typography>
                  </Box>
                </Tooltip>
              )}
            </Box>

            {/* Navigation Section with enhanced styling */}
            <Box
              sx={{
                flex: 1,
                py: 1,
                px: isCollapsed ? 0.5 : 0,
                overflow: 'auto',
                overflowX: 'hidden',
                minHeight: 0,
                scrollbarWidth: 'thin',
                // Fade effect at top and bottom for scroll indication
                maskImage: 'linear-gradient(to bottom, transparent 0%, black 8px, black calc(100% - 8px), transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 8px, black calc(100% - 8px), transparent 100%)',
                ...scrollbarStyles,
              }}
            >
              <SidebarItems isCollapsed={isCollapsed} />
            </Box>

            {/* Modern Collapse Toggle Button */}
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                right: '-18px',
                transform: 'translateY(-50%)',
                zIndex: 1300,
              }}
            >
              <Tooltip
                title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                placement="right"
                arrow
              >
                <IconButton
                  onClick={props.onToggleSidebar}
                  sx={{
                    width: 36,
                    height: 36,
                    // Dark mode: a raised surface off the `--dm-*` ladder. The
                    // white disc read as a bright speck against the dark sidebar.
                    background: theme.palette.mode === 'dark' ? '#2A2A2F' : '#ffffff',
                    color: theme.palette.mode === 'dark' ? '#C7D2FE' : SB.indigoStrong,
                    border: `1.5px solid ${theme.palette.mode === 'dark'
                      ? 'rgba(166, 160, 240, 0.35)'
                      : withOpacity(SB.indigo, 0.35)}`,
                    borderRadius: '50%',
                    boxShadow: theme.palette.mode === 'dark'
                      ? '0 2px 8px rgba(0, 0, 0, 0.5)'
                      : `
                      0 4px 14px rgba(99, 102, 241, 0.22),
                      0 2px 6px rgba(15, 23, 42, 0.08),
                      inset 0 1px 0 rgba(255, 255, 255, 0.9)
                    `,
                    '&:hover': {
                      background: SB.gradient,
                      color: '#ffffff',
                      borderColor: withOpacity('#ffffff', 0.7),
                      transform: 'none',
                      boxShadow: `
                        0 6px 20px rgba(99, 102, 241, 0.45),
                        0 3px 10px rgba(217, 70, 239, 0.28),
                        inset 0 1px 0 rgba(255, 255, 255, 0.5)
                      `,
                    },
                    '&:active': {
                      transform: 'none',
                    },
                    transition: 'none',
                  }}
                >
                  {isCollapsed ? (
                    <IconChevronsRight size={18} stroke={2.5} />
                  ) : (
                    <IconChevronsLeft size={18} stroke={2.5} />
                  )}
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Drawer>
      </Box>
    );
  }

  // Mobile Sidebar
  return (
    <Drawer
      anchor="left"
      open={props.isMobileSidebarOpen}
      onClose={props.onSidebarClose}
      variant="temporary"
      ModalProps={{
        keepMounted: true, // Better mobile performance
      }}
      PaperProps={{
        className: 'news-sidebar',
        sx: {
          width: { xs: '280px', sm: '300px', md: '270px' },
          height: '100vh',
          background: SB.surface,
          backdropFilter: 'blur(20px) saturate(1.4)',
          WebkitBackdropFilter: 'blur(20px) saturate(1.4)',
          borderRight: `1px solid ${SB.border}`,
          boxShadow: SB.surfaceShadow,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          [theme.breakpoints.down('sm')]: {
            width: '85vw',
            maxWidth: '320px',
          },
          ...scrollbarStyles,
        },
      }}
    >
      {/* Mobile Sidebar Content */}
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          overflow: 'hidden',
        }}
      >
        {/* Brand Section for Mobile */}
        <Box
          sx={{
            p: 3,
            borderBottom: `1px solid ${SB.divider}`,
            textAlign: 'center',
            background: `linear-gradient(180deg, ${withOpacity(SB.indigo, 0.06)} 0%, transparent 100%)`,
          }}
        >
          <Box
            component="img"
            src={logoResolved}
            alt={`${appConfig.appName} Logo`}
            sx={{
              maxHeight: '100px',
              maxWidth: '210px',
              borderRadius: theme.custom.tokens.borderRadius.sm,
              filter: `drop-shadow(0 4px 16px ${withOpacity(SB.indigo, 0.22)})`,
            }}
          />
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              fontSize: '1.25rem',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              mt: 1.5,
              background: SB.gradientText,
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              color: 'transparent',
            }}
          >
            {appConfig.appName.toUpperCase()}
          </Typography>
        </Box>

        {/* Navigation Section for Mobile */}
        <Box
          sx={{
            flex: 1,
            py: 1,
            px: 0,
            overflow: 'auto',
            overflowX: 'hidden',
            minHeight: 0,
            scrollbarWidth: 'thin',
            // Fade effect at top and bottom for scroll indication
            maskImage: 'linear-gradient(to bottom, transparent 0%, black 8px, black calc(100% - 8px), transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 8px, black calc(100% - 8px), transparent 100%)',
            ...scrollbarStyles,
          }}
        >
          <SidebarItems isCollapsed={false} />
        </Box>

        {/* Upgrade Section for Mobile */}
        <Box
          sx={{
            p: 1.5,
            flexShrink: 0,
            borderTop: `1px solid ${theme.palette.divider}`,
            mt: 'auto',
          }}
        >
          <Upgrade />
        </Box>
      </Box>
    </Drawer>
  );
};
export default MSidebar;
