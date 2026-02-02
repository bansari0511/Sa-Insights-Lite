import { useState, } from "react";
import { styled,  Box, Typography, Link, useMediaQuery, useTheme } from "@mui/material";
import { Outlet } from "react-router-dom";

import Header from "./header/Header";
import Sidebar from "./sidebar/Sidebar";
import { withOpacity } from "../../theme/palette";
import appConfig from "../../config/appConfig";

const MainWrapper = styled("div")(({ theme }) => ({
  display: "flex",
  height: "100vh",
  width: "100vw",
  overflow: "hidden",
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    height: '100vh',
  },
}));

const FullLayout = () => {
  const theme = useTheme();
  const lgUp = useMediaQuery(theme.breakpoints.up("lg"));
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const sidebarWidth = isSidebarOpen ? 270 : 70;


  return (
    <MainWrapper className="mainwrapper">
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
        />
        {/* ------------------------------------------- */}
        {/* Main Content - Full Width */}
        {/* ------------------------------------------- */}
        <Box
          sx={{
            flex: 1,
            width: '100%',
            height: 'calc(100vh - 70px)',
            background: theme.palette.brand.gradientBackground,
            position: 'relative',
            overflow: 'auto',
            // Mobile responsive adjustments
            [theme.breakpoints.down('md')]: {
              height: 'calc(100vh - 60px)',
            },
            [theme.breakpoints.down('sm')]: {
              height: 'calc(100vh - 56px)',
            },
          }}
        >
          {/* ------------------------------------------- */}
          {/* Page Content */}
          {/* ------------------------------------------- */}
          <Box
            sx={{
              width: '100%',
              height: '100%',
              px: { xs: 2, sm: 3 },
              py: { xs: 2, sm: 3 },
              // Mobile responsive adjustments
              [theme.breakpoints.down('md')]: {
                px: 2,
                py: 2,
              },
              [theme.breakpoints.down('sm')]: {
                px: 1.5,
                py: 1.5,
              },
            }}
          >
            <Outlet />
          </Box>
        </Box>

        {/* ------------------------------------------- */}
        {/* Footer - Full Width */}
        {/* ------------------------------------------- */}
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
            © 2025 {' '}
            <Link
              target="_blank"
              href="https://www.adminmart.com"
              sx={{
                color: theme.palette.brand.deepPurple,
                textDecoration: 'none',
                fontWeight: theme.custom.tokens.fontWeight.semibold,
                transition: 'none',
                '&:hover': { color: theme.palette.brand.cyan }
              }}
            >
              XYZ
            </Link>
            {' • '}
            Designed and Developed by{' '}
            <Link
              target="_blank"
              href="https://themewagon.com"
              sx={{
                color: theme.palette.brand.deepPurple,
                textDecoration: 'none',
                fontWeight: theme.custom.tokens.fontWeight.semibold,
                transition: 'none',
                '&:hover': { color: theme.palette.brand.cyan }
              }}
            >
              {appConfig.companyName}
            </Link>
          </Typography>
        </Box>
      </Box>
    </MainWrapper>
  );
};

export default FullLayout;
