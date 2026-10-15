import { useState, useEffect } from "react";
import { styled, Box, Typography, useMediaQuery, useTheme } from "@mui/material";
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
  /* ── 100vh is a lie inside the host ──
     The METIS shell reserves --topbar-h for its persistent top bar, so the box
     this app is handed is that much shorter than the window. `100vh` measures
     the WINDOW, so embedded we rendered exactly one bar-height too tall and the
     host clipped the difference.

     That clipping was the visible half of the bug. The other half only showed up
     with the AI chat panel: opening it focuses the composer, the browser scrolls
     the nearest scrollable ancestor to bring it into view, and because this
     subtree overflowed there was somewhere to scroll TO — so the whole app slid
     up underneath the host's top bar. The bar looked like it was overlapping the
     app; in fact the app was climbing behind the bar. Remove the overflow and
     there is nothing to scroll, so the slip cannot happen.

     Gated on `embedded` rather than switched outright, and gated rather than
     left to the host's child-viewport-compat.css shim: 100% only resolves when
     every ancestor carries a height, which is true inside the shell and is NOT
     guaranteed for `html, body, #root` when this app runs standalone. Same
     pattern as sidebar/Sidebar.js, which already does exactly this. */
  display: "flex",
  height: embedded ? "100%" : "100vh",
  width: embedded ? "100%" : "100vw",
  overflow: "hidden",
  position: embedded ? "relative" : "static",
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    height: embedded ? '100%' : '100vh',
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
  console.log("hasAccess", hasAccess)

  const sidebarWidth = isSidebarOpen ? 260 : 70;
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
          /* 100% embedded — see the note on MainWrapper. This one is the element
             that actually moved: measured at 1600x900 with the chat panel open,
             `.page-wrapper` sat at top: 49px against a content box starting at
             56px, i.e. 7px of it was behind the host bar. */
          height: isEmbedded ? '100%' : '100vh',
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
            /* `auto` embedded, not another calc.

               This box is already `flex: 1` inside a column flex parent, so the
               explicit height was only ever a second opinion about a size the
               flexbox had already worked out — and it was the one measuring the
               window. Letting flex do it means this tracks whatever the host
               gives the app, at any bar height, with no number to keep in sync.

               `minHeight: 0` is required with it: a flex item's default
               `min-height: auto` refuses to shrink below its content, which
               would reintroduce the overflow this is removing. */
            height: isEmbedded ? 'auto' : 'calc(100vh - 70px)',
            minHeight: 0,
            // Aurora content backdrop — mirrors the METIS host + Saaransh theme
            // (near-white base washed with indigo/violet/cyan/fuchsia radial
            // "aurora" blobs over a fine indigo dot grid; deep-navy aurora in
            // dark mode) so OSINT Analysis reads as one surface with the parent.
            backgroundColor: theme.palette.mode === 'dark' ? '#0B1220' : '#f8f9fd',
            backgroundImage: theme.palette.mode === 'dark'
              ? [
                'radial-gradient(ellipse 80% 70% at 2% 20%, rgba(129, 140, 248, 0.14), transparent 60%)',
                'radial-gradient(ellipse 70% 60% at 98% 82%, rgba(217, 70, 239, 0.10), transparent 62%)',
                'radial-gradient(ellipse 60% 52% at 88% 4%, rgba(34, 211, 238, 0.09), transparent 60%)',
                'linear-gradient(135deg, #0B1220 0%, #111827 50%, #0B1220 100%)',
              ].join(', ')
              : [
                'radial-gradient(rgba(99, 102, 241, 0.05) 1px, transparent 1.5px)',
                'radial-gradient(ellipse 62% 52% at 88% 4%, rgba(34, 211, 238, 0.12), transparent 60%)',
                'radial-gradient(ellipse 74% 64% at 97% 80%, rgba(217, 70, 239, 0.09), transparent 62%)',
                'radial-gradient(ellipse 80% 70% at 2% 22%, rgba(129, 140, 248, 0.22), transparent 62%)',
                'radial-gradient(ellipse 66% 56% at 42% 68%, rgba(167, 139, 250, 0.10), transparent 60%)',
              ].join(', '),
            backgroundSize: theme.palette.mode === 'dark'
              ? 'auto'
              : '22px 22px, auto, auto, auto, auto',
            position: 'relative',
            overflow: 'hidden',
            transition: 'gap 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
            [theme.breakpoints.down('md')]: {
              height: isEmbedded ? 'auto' : 'calc(100vh - 60px)',
            },
            [theme.breakpoints.down('sm')]: {
              height: isEmbedded ? 'auto' : 'calc(100vh - 56px)',
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
              background: theme.palette.mode === 'dark'
                ? 'var(--dm-paper)'
                : `linear-gradient(135deg, ${theme.palette.grey[200]} 0%, ${theme.palette.brand.lightBlue} 100%)`,
              borderTop: `1px solid ${theme.palette.mode === 'dark'
                ? 'var(--dm-border)'
                : withOpacity(theme.palette.brand.cyan, 0.1)}`,
              width: '100%',
              flexShrink: 0,
            }}
          >
            <Typography
              variant="body2"
              sx={{
                // `brand.deepPurple` is #c7d2fe — a pale indigo despite the name.
                // At 70% over this pale footer gradient it composited to #d2dbfb
                // on #edf0f4: 1.2:1, i.e. invisible. Use the theme's own
                // secondary ink, which is mode-aware and meant for body copy.
                color: theme.palette.text.secondary,
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
