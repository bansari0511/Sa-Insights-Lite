import { useState, useEffect } from "react";
import { styled,  Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import { Outlet } from "react-router-dom";
import BlockIcon from '@mui/icons-material/Block';

import Header from "./header/Header";
import Sidebar from "./sidebar/Sidebar";
import { withOpacity } from "../../theme/palette";
import appConfig from "../../config/appConfig";
import { useAuth } from "../../context/AuthContext";
import { useIsEmbedded } from "../../context/EmbeddedContext";

const CURRENT_APP_NAME = import.meta.env.VITE_CURRENT_APP_NAME || 'news';

const MainWrapper = styled("div", {
  shouldForwardProp: (prop) => prop !== 'embedded',
})(({ theme, embedded }) => ({
  display: "flex",
  height: "100vh",
  width: embedded ? "100%" : "100vw",
  overflow: "hidden",
  position: embedded ? "relative" : "static",
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    height: '100vh',
  },
}));

const CHAT_PANEL_WIDTH = 380;

const FullLayout = ({ onNavigateToHost } = {}) => {
  const theme = useTheme();
  const isEmbedded = useIsEmbedded();
  const lgUp = useMediaQuery(theme.breakpoints.up("lg"));
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Chat panel state — only used in federation mode
  const [isChatOpen, setChatOpen] = useState(false);
  const [ChatPanel, setChatPanel] = useState(null);

  const { hasAccess, isLoading, entitlementsLoaded } = useAuth();

  const sidebarWidth = isSidebarOpen ? 270 : 70;
  const showChat = isEmbedded && isChatOpen && ChatPanel;

  // Load chat panel component on demand (federation mode only)
  useEffect(() => {
    if (!isEmbedded) return;
    import('../../components/AIChatPanel').then(mod => {
      setChatPanel(() => mod.default);
    });
  }, [isEmbedded]);

  // Push host's fixed feedback button left when chat panel is open (federation only)
  useEffect(() => {
    if (!isEmbedded) return;
    const fb = document.querySelector('.feedback-bubble');
    if (fb) {
      fb.style.transition = 'right 0.35s cubic-bezier(0.4, 0, 0.2, 1)';
      fb.style.right = isChatOpen ? `${CHAT_PANEL_WIDTH + 16}px` : '';
    }
  }, [isChatOpen, isEmbedded]);

  // Wait for entitlements to load before rendering anything
  // This prevents a flash of "Access Denied" while the API call is in progress
  if (!isLoading && !entitlementsLoaded) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
          Checking access...
        </Typography>
      </Box>
    );
  }

  // Show access denied only after entitlements have been fetched from API
  // In embedded mode, HostAuthProvider sets hasAccess=()=>true, so this never triggers
  if (!isLoading && entitlementsLoaded && !hasAccess(CURRENT_APP_NAME)) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          gap: 2,
          background: theme.palette.brand?.gradientBackground || theme.palette.background.default,
        }}
      >
        <BlockIcon sx={{ fontSize: 64, color: theme.palette.error.main, opacity: 0.7 }} />
        <Typography variant="h5" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
          Access Denied
        </Typography>
        <Typography variant="body1" sx={{ color: theme.palette.text.secondary, textAlign: 'center', maxWidth: 400 }}>
          You do not have permission to access {appConfig.appName}. Please contact your administrator.
        </Typography>
      </Box>
    );
  }

  return (
    <MainWrapper className="mainwrapper" embedded={isEmbedded}>
      {/* ------------------------------------------- */}
      {/* Sidebar - Fixed Position */}
      {/* ------------------------------------------- */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        isMobileSidebarOpen={isMobileSidebarOpen}
        onSidebarClose={() => setMobileSidebarOpen(false)}
        onToggleSidebar={() => setSidebarOpen(!isSidebarOpen)}
        sidebarWidth={sidebarWidth}
        lgUp={lgUp}
        isEmbedded={isEmbedded}
      />

      {/* ------------------------------------------- */}
      {/* Main Content Area - Full Width */}
      {/* ------------------------------------------- */}
      <Box
        className="page-wrapper"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100vh',
          paddingLeft: lgUp ? sidebarWidth + 'px' : 0,
          transition: 'none',
          backgroundColor: 'transparent',
          // Mobile adjustments
          [theme.breakpoints.down('lg')]: {
            paddingLeft: 0,
          },
        }}
      >
        {/* ------------------------------------------- */}
        {/* Header */}
        {/* ------------------------------------------- */}
        <Header
          toggleSidebar={() => setSidebarOpen(!isSidebarOpen)}
          toggleMobileSidebar={() => setMobileSidebarOpen(true)}
          isEmbedded={isEmbedded}
          {...(isEmbedded ? {
            isChatOpen,
            onToggleChat: () => setChatOpen(prev => !prev),
          } : {})}
        />
        {/* ------------------------------------------- */}
        {/* Content area */}
        {/* ------------------------------------------- */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            gap: showChat ? '10px' : 0,
            width: '100%',
            height: 'calc(100vh - 70px)',
            background: theme.palette.brand.gradientBackground,
            position: 'relative',
            overflow: 'hidden',
            transition: 'gap 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
            [theme.breakpoints.down('md')]: {
              height: 'calc(100vh - 60px)',
            },
            [theme.breakpoints.down('sm')]: {
              height: 'calc(100vh - 56px)',
            },
          }}
        >
          {/* ── Main content ── */}
          <Box
            sx={{
              flex: 1,
              minWidth: 0,
              height: '100%',
              overflow: 'auto',
              transition: isEmbedded ? 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
            }}
          >
            <Box
              sx={{
                width: '100%',
                height: '100%',
                px: { xs: 2, sm: 3 },
                py: { xs: 2, sm: 3 },
                [theme.breakpoints.down('md')]: { px: 2, py: 2 },
                [theme.breakpoints.down('sm')]: { px: 1.5, py: 1.5 },
              }}
            >
              <Outlet />
            </Box>
          </Box>

          {/* ── Chat panel (federation mode only) ── */}
          {isEmbedded && ChatPanel && (
            <Box
              sx={{
                width: isChatOpen ? CHAT_PANEL_WIDTH : 0,
                minWidth: isChatOpen ? CHAT_PANEL_WIDTH : 0,
                height: '100%',
                overflow: 'hidden',
                transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                flexShrink: 0,
                pt: isChatOpen ? '6px' : 0,
                pr: isChatOpen ? '6px' : 0,
                pb: isChatOpen ? '6px' : 0,
              }}
            >
              <ChatPanel open={isChatOpen} onClose={() => setChatOpen(false)} onNavigateToHost={onNavigateToHost} />
            </Box>
          )}
        </Box>

        {/* ------------------------------------------- */}
        {/* Footer - Full Width (hidden in federation mode) */}
        {/* ------------------------------------------- */}
        {!isEmbedded && (
        <Box
          sx={{
            pt: 2,
            pb: 1.5,
            px: 3,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2,
            background: `linear-gradient(135deg, ${theme.palette.grey[200]} 0%, ${theme.palette.brand.lightBlue} 100%)`,
            borderTop: `1px solid ${withOpacity(theme.palette.brand.cyan, 0.1)}`,
            width: '100%',
            flexShrink: 0,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: withOpacity(theme.palette.brand.deepPurple, 0.7),
              textAlign: 'center',
              fontSize: '0.875rem',
            }}
          >
            © 2025 {appConfig.companyName}
          </Typography>
        </Box>
        )}
      </Box>
    </MainWrapper>
  );
};

export default FullLayout;
