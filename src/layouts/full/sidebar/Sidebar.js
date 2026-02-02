import { useMediaQuery, Box, Drawer, Typography, Tooltip, IconButton, useTheme } from '@mui/material';
import { IconChevronLeft, IconChevronRight, IconChevronsLeft, IconChevronsRight } from '@tabler/icons-react';
import SidebarItems from './SidebarItems';
import { Upgrade } from './Updrade';
import logo from '../../../assets/images/logos/logo_landing.png';
import { withOpacity } from '../../../theme/palette';
import appConfig from '../../../config/appConfig';

const MSidebar = (props) => {
  const theme = useTheme();
  const lgUp = useMediaQuery(theme.breakpoints.up("lg"));
  const { isSidebarOpen, sidebarWidth = 270 } = props;
  const isCollapsed = !isSidebarOpen;
  const collapsedWidth = 70;

  // Enhanced scrollbar styling with modern look
  const scrollbarStyles = {
    '&::-webkit-scrollbar': {
      width: '6px',
    },
    '&::-webkit-scrollbar-track': {
      background: withOpacity(theme.palette.brand.cyan, 0.05),
      borderRadius: theme.custom.tokens.borderRadius.md,
      margin: '4px 0',
    },
    '&::-webkit-scrollbar-thumb': {
      background: theme.palette.brand.scrollbar,
      borderRadius: theme.custom.tokens.borderRadius.md,
      border: `2px solid ${withOpacity(theme.palette.brand.deepPurple, 0.1)}`,
      '&:hover': {
        background: theme.palette.brand.scrollbarHover,
      },
    },
  };


  if (lgUp) {
    return (
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100vh',
          width: isCollapsed ? collapsedWidth : sidebarWidth,
          zIndex: theme.custom.tokens.zIndex.fixed,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Modern Collapsible Sidebar for Desktop */}
        <Drawer
          anchor="left"
          open={true}
          variant="permanent"
          PaperProps={{
            sx: {
              width: '100%',
              height: '100vh',
              boxSizing: 'border-box',
              background: theme.palette.brand.gradientSidebarAlt,
              borderRight: 'none',
              boxShadow: `
                8px 0 32px rgba(0, 0, 0, 0.3),
                4px 0 16px ${withOpacity(theme.palette.brand.cyan, 0.15)},
                inset -1px 0 0 ${withOpacity(theme.palette.brand.cyan, 0.1)}
              `,
              position: 'relative',
              overflow: 'visible',
              display: 'flex',
              flexDirection: 'column',
              ...scrollbarStyles,
              // Modern glass-morphism edge effect - DISABLED
              // '&::before': {
              //   content: '""',
              //   position: 'absolute',
              //   top: 0,
              //   right: 0,
              //   width: '1px',
              //   height: '100%',
              //   background: `linear-gradient(180deg, ${withOpacity(theme.palette.brand.cyan, 0.3)} 0%, ${withOpacity(theme.palette.brand.cyan, 0.1)} 50%, ${withOpacity(theme.palette.brand.cyan, 0.3)} 100%)`,
              // },
              // Subtle ambient glow - DISABLED
              // '&::after': {
              //   content: '""',
              //   position: 'absolute',
              //   top: '-50%',
              //   right: '-50%',
              //   width: '200%',
              //   height: '200%',
              //   background: `radial-gradient(circle at 80% 50%, ${withOpacity(theme.palette.brand.cyan, 0.08)} 0%, transparent 50%)`,
              //   pointerEvents: 'none',
              //   animation: 'pulse 8s ease-in-out infinite',
              // },
              // '@keyframes pulse': {
              //   '0%, 100%': {
              //     opacity: 0.5,
              //   },
              //   '50%': {
              //     opacity: 1,
              //   },
              // },
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
                borderBottom: `1px solid ${theme.palette.divider}`,
                textAlign: 'center',
                position: 'relative',
                transition: 'none',
                background: `linear-gradient(180deg, ${withOpacity(theme.palette.brand.cyan, 0.05)} 0%, transparent 100%)`,
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
                    src={logo}
                    alt={`${appConfig.appName} Logo`}
                    sx={{
                      height: '160px',
                      width: '160px',
                      borderRadius: theme.custom.tokens.borderRadius.sm,
                      filter: `drop-shadow(0 4px 16px ${withOpacity(theme.palette.brand.cyan, 0.2)})`,
                      transition: 'none',
                      '&:hover': {
                        transform: 'none',
                        filter: `drop-shadow(0 6px 20px ${withOpacity(theme.palette.brand.cyan, 0.3)})`,
                      },
                    }}
                  />
                  <Typography
                    variant="h5"
                    sx={{
                      color: theme.palette.common.white,
                      fontWeight: 700,
                      fontSize: '1.5rem',
                      letterSpacing: '2px',
                      textTransform: 'uppercase',
                      textShadow: `
                        0 2px 10px rgba(0, 0, 0, 0.5),
                        0 0 30px ${withOpacity(theme.palette.brand.cyan, 0.6)},
                        0 0 15px ${withOpacity(theme.palette.common.white, 0.3)}
                      `,
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
                      background: `linear-gradient(135deg, ${theme.palette.brand.cyan} 0%, #3b82f6 50%, #8b5cf6 100%)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto',
                      border: `2px solid ${withOpacity(theme.palette.common.white, 0.3)}`,
                      boxShadow: `
                        0 8px 24px ${withOpacity(theme.palette.brand.cyan, 0.4)},
                        0 4px 12px rgba(139, 92, 246, 0.3),
                        inset 0 1px 0 ${withOpacity(theme.palette.common.white, 0.4)}
                      `,
                      cursor: 'pointer',
                      transition: 'none',
                      overflow: 'hidden',
                      // Animated gradient effect - DISABLED
                      // '&::before': {
                      //   content: '""',
                      //   position: 'absolute',
                      //   top: '-50%',
                      //   left: '-50%',
                      //   width: '200%',
                      //   height: '200%',
                      //   background: `linear-gradient(45deg, transparent 30%, ${withOpacity(theme.palette.common.white, 0.3)} 50%, transparent 70%)`,
                      //   animation: 'shimmer 3s infinite',
                      //   pointerEvents: 'none',
                      // },
                      '&:hover': {
                        background: `linear-gradient(135deg, #8b5cf6 0%, ${theme.palette.brand.cyan} 50%, #3b82f6 100%)`,
                        transform: 'none',
                        borderColor: withOpacity(theme.palette.common.white, 0.5),
                        boxShadow: `
                          0 12px 32px ${withOpacity(theme.palette.brand.cyan, 0.6)},
                          0 6px 16px rgba(139, 92, 246, 0.5),
                          inset 0 1px 0 ${withOpacity(theme.palette.common.white, 0.6)},
                          0 0 40px ${withOpacity(theme.palette.brand.cyan, 0.4)}
                        `,
                      },
                      // '@keyframes shimmer': {
                      //   '0%': {
                      //     transform: 'translateX(-100%) translateY(-100%) rotate(45deg)',
                      //   },
                      //   '100%': {
                      //     transform: 'translateX(100%) translateY(100%) rotate(45deg)',
                      //   },
                      // },
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
                      S
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
                    background: theme.palette.brand.gradientLight,
                    color: theme.palette.brand.deepPurple,
                    border: `2px solid ${withOpacity(theme.palette.brand.cyan, 0.4)}`,
                    borderRadius: '50%',
                    boxShadow: `
                      0 4px 16px ${withOpacity(theme.palette.brand.cyan, 0.3)},
                      0 2px 8px rgba(0, 0, 0, 0.1),
                      inset 0 1px 0 ${withOpacity(theme.palette.common.white, 0.8)}
                    `,
                    '&:hover': {
                      background: theme.palette.brand.gradientPrimary,
                      color: theme.palette.common.white,
                      borderColor: withOpacity(theme.palette.common.white, 0.6),
                      transform: 'none',
                      boxShadow: `
                        0 6px 24px ${withOpacity(theme.palette.brand.cyan, 0.5)},
                        0 3px 12px rgba(0, 0, 0, 0.15),
                        inset 0 1px 0 ${withOpacity(theme.palette.common.white, 0.4)}
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
        sx: {
          width: { xs: '280px', sm: '300px', md: '270px' },
          height: '100vh',
          background: theme.palette.brand.gradientSidebarAlt,
          borderRight: 'none',
          boxShadow: `
            8px 0 32px rgba(0, 0, 0, 0.3),
            4px 0 16px ${withOpacity(theme.palette.brand.cyan, 0.15)}
          `,
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
            borderBottom: `1px solid ${theme.palette.divider}`,
            textAlign: 'center',
            background: `linear-gradient(180deg, ${withOpacity(theme.palette.brand.cyan, 0.05)} 0%, transparent 100%)`,
          }}
        >
          <Box
            component="img"
            src={logo}
            alt={`${appConfig.appName} Logo`}
            sx={{
              maxHeight: '100px',
              maxWidth: '210px',
              background: theme.palette.common.white,
              padding: '4px 6px',
              borderRadius: theme.custom.tokens.borderRadius.sm,
              filter: `drop-shadow(0 4px 16px ${withOpacity(theme.palette.brand.cyan, 0.2)})`,
            }}
          />
          <Typography
            variant="h6"
            sx={{
              color: theme.palette.common.white,
              fontWeight: 700,
              fontSize: '1.25rem',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              mt: 1.5,
              textShadow: `
                0 2px 10px rgba(0, 0, 0, 0.5),
                0 0 30px ${withOpacity(theme.palette.brand.cyan, 0.6)},
                0 0 15px ${withOpacity(theme.palette.common.white, 0.3)}
              `,
            }}
          >
            SAARANSH
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
