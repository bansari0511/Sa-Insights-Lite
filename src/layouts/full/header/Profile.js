import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Menu,
  Typography,
  ButtonBase,
  Divider,
  useTheme,
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import HomeIcon from '@mui/icons-material/Home';
import ArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

import { RequestContext } from '../../../context/RequestContext';
import { useAuth } from '../../../context/AuthContext';
import { useIsEmbedded } from '../../../context/EmbeddedContext';

/* ── Color tokens ── */
const C = {
  indigo: { 50: '#EEF2FF', 100: '#E0E7FF', 200: '#C7D2FE', 300: '#A5B4FC', 400: '#818CF8', 500: '#6366F1', 600: '#4F46E5', 700: '#4338CA' },
  slate: { 50: '#F8FAFC', 100: '#F1F5F9', 200: '#E2E8F0', 300: '#CBD5E1', 400: '#94A3B8', 500: '#64748B', 600: '#475569', 700: '#334155', 800: '#1E293B', 900: '#0F172A' },
};

/* Dark counterparts, mirroring the `--dm-*` ladder in src/styles/common.css.
   This component paints its trigger and menu with inline sx, which the
   dark stylesheet cannot reach (emotion classes, and there is no
   .MuiButtonBase-root surface rule) — so the light values above rendered a
   near-white pill with near-white ink on the dark AppBar, at 1.5:1. */
const D = {
  triggerBg: 'rgba(255, 255, 255, 0.06)',
  triggerBgOpen: 'rgba(255, 255, 255, 0.10)',
  border: 'rgba(255, 255, 255, 0.08)',
  borderOpen: '#a6a0f0',
  surface: '#232328',
  surfaceRaised: '#2a2a2f',
  text: '#ededf0',
  textMuted: '#a8a8b3',
  accent: '#a6a0f0',
  danger: '#f87171',
  dangerWash: 'rgba(248, 113, 113, 0.14)',
  dangerEdge: 'rgba(248, 113, 113, 0.35)',
};

const Profile = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const { user, logout } = useAuth();
  const isEmbedded = useIsEmbedded();
  const username = user?.username || 'User';
  const initial = username.charAt(0).toUpperCase();

  const requestContext = useContext(RequestContext);
  const setOpenModalEquipmentOrg = requestContext?.setOpenModalEquipmentOrg;
  const setOpenModalEquipmentMg = requestContext?.setOpenModalEquipmentMg;
  const setOpenModalEquipmentProfile = requestContext?.setOpenModalEquipmentProfile;
  const setOpenModalMilitaryGroupEquipment = requestContext?.setOpenModalMilitaryGroupEquipment;
  const setEquipment = requestContext?.setEquipment;
  const setMilitaryGroup = requestContext?.setMilitaryGroup;

  const closeModals = () => {
    setOpenModalEquipmentOrg?.(false);
    setOpenModalEquipmentMg?.(false);
    setOpenModalEquipmentProfile?.(false);
    setOpenModalMilitaryGroupEquipment?.(false);
    setEquipment?.(null);
    setMilitaryGroup?.(null);
  };

  const handleOpen = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleBackToHome = () => {
    handleClose();
    closeModals();
    if (isEmbedded) {
      // Navigate to host's home page
      navigate('/home');
    } else {
      navigate('/NewsRoom');
    }
  };

  const handleLogout = async () => {
    handleClose();
    closeModals();
    await logout();
    if (!isEmbedded) {
      navigate('/login');
    }
    // In embedded mode, HostAuthProvider.logout() handles navigation to host login
  };

  return (
    <Box>
      {/* ── User Chip Trigger ── */}
      <ButtonBase
        onClick={handleOpen}
        disableRipple
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.25,
          pl: 0.75,
          pr: 1.75,
          py: 0.75,
          borderRadius: '28px',
          bgcolor: isDark
            ? (open ? D.triggerBgOpen : D.triggerBg)
            : (open ? '#fff' : C.slate[50]),
          border: `1.5px solid ${isDark
            ? (open ? D.borderOpen : D.border)
            : (open ? C.indigo[300] : C.slate[200])}`,
          boxShadow: isDark
            ? (open ? `0 0 0 3px rgba(166, 160, 240, 0.18)` : 'none')
            : (open
              ? `0 0 0 3px ${C.indigo[500]}12, 0 4px 12px ${C.indigo[500]}10`
              : `0 1px 3px rgba(0,0,0,0.04)`),
          transition: 'all 0.2s ease',
          cursor: 'pointer',
          '&:hover': {
            bgcolor: isDark ? D.triggerBgOpen : '#fff',
            border: `1.5px solid ${isDark ? D.borderOpen : C.indigo[300]}`,
            boxShadow: isDark
              ? `0 0 0 3px rgba(166, 160, 240, 0.14)`
              : `0 0 0 3px ${C.indigo[500]}0A, 0 4px 14px ${C.indigo[500]}12`,
          },
        }}
      >
        {/* Avatar */}
        <Box sx={{
          position: 'relative',
          width: 36,
          height: 36,
          borderRadius: '50%',
          background: `linear-gradient(145deg, ${C.indigo[400]}, ${C.indigo[600]})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `0 2px 8px ${C.indigo[500]}40`,
          flexShrink: 0,
        }}>
          <Typography sx={{
            color: '#fff',
            fontSize: '0.95rem',
            fontWeight: 700,
            lineHeight: 1,
            letterSpacing: '0.02em',
          }}>
            {initial}
          </Typography>
          {/* Online indicator */}
          <Box sx={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: 11,
            height: 11,
            borderRadius: '50%',
            bgcolor: '#22c55e',
            border: `2.5px solid ${isDark ? D.surface : '#fff'}`,
            boxShadow: '0 0 6px #22c55e80',
          }} />
        </Box>

        {/* Welcome + Username */}
        <Box sx={{ display: { xs: 'none', sm: 'flex' }, flexDirection: 'column', minWidth: 0 }}>
          <Typography sx={{
            fontSize: '0.65rem',
            fontWeight: 600,
            color: isDark ? D.textMuted : C.slate[500],
            lineHeight: 1,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
          }}>
            Welcome
          </Typography>
          <Typography sx={{
            fontSize: '0.9rem',
            fontWeight: 700,
            color: isDark ? D.text : C.indigo[900],
            lineHeight: 1.3,
            maxWidth: 120,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            mt: 0.15,
          }}>
            {username}
          </Typography>
        </Box>

        {/* Chevron */}
        <ArrowDownIcon sx={{
          display: { xs: 'none', sm: 'flex' },
          fontSize: 20,
          color: isDark ? (open ? D.accent : D.textMuted) : (open ? C.indigo[500] : C.slate[400]),
          transition: 'all 0.2s ease',
          transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          ml: -0.25,
        }} />
      </ButtonBase>

      {/* ── Dropdown Menu ── */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        slotProps={{
          paper: {
            sx: {
              width: 210,
              borderRadius: '12px',
              mt: 1,
              bgcolor: isDark ? D.surfaceRaised : '#fff',
              border: `1px solid ${isDark ? D.border : C.slate[200]}`,
              boxShadow: `0 12px 36px -8px rgba(0,0,0,0.12), 0 4px 12px -4px ${C.indigo[500]}10`,
              overflow: 'hidden',
            },
          },
        }}
      >
        {/* ── Compact User Info ── */}
        <Box sx={{
          px: 1.75, py: 1.25,
          background: isDark
            ? 'linear-gradient(135deg, #33323c 0%, #3a3444 100%)'
            : `linear-gradient(135deg, ${C.indigo[50]} 0%, ${C.slate[50]} 100%)`,
          borderBottom: `1px solid ${isDark ? D.border : C.slate[100]}`,
          display: 'flex', alignItems: 'center', gap: 1,
        }}>
          <Box sx={{
            width: 32, height: 32, borderRadius: '8px',
            background: `linear-gradient(145deg, ${C.indigo[400]}, ${C.indigo[600]})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 2px 6px ${C.indigo[500]}30`,
            flexShrink: 0,
          }}>
            <Typography sx={{ color: '#fff', fontSize: '0.8rem', fontWeight: 700 }}>
              {initial}
            </Typography>
          </Box>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography sx={{
              fontSize: '0.8rem', fontWeight: 700, color: isDark ? D.text : C.slate[800],
              lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {username}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4, mt: 0.15 }}>
              <Box sx={{ width: 5, height: 5, borderRadius: '50%', bgcolor: '#22c55e', boxShadow: '0 0 4px #22c55e60' }} />
              <Typography sx={{ fontSize: '0.62rem', color: isDark ? '#4ade80' : '#16a34a', fontWeight: 600 }}>Online</Typography>
            </Box>
          </Box>
        </Box>

        {/* ── Menu Items ── */}
        <Box sx={{ py: 0.5, px: 0.5 }}>
          {/* <ButtonBase
            onClick={handleBackToHome}
            sx={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 1,
              px: 1.25, py: 0.75, borderRadius: '8px',
              transition: 'all 0.15s ease',
              '&:hover': { bgcolor: C.indigo[50] },
            }}
          >
            <Box sx={{
              width: 28, height: 28, borderRadius: '7px',
              bgcolor: C.indigo[50], border: `1px solid ${C.indigo[100]}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <HomeIcon sx={{ fontSize: 15, color: C.indigo[500] }} />
            </Box>
            <Typography sx={{ fontSize: '0.78rem', fontWeight: 600, color: C.slate[700] }}>
              Back to Home
            </Typography>
          </ButtonBase>

          <Divider sx={{ my: 0.4, mx: 0.75, borderColor: C.slate[100] }} /> */}

          <ButtonBase
            onClick={handleLogout}
            sx={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 1,
              px: 1.25, py: 0.75, borderRadius: '8px',
              transition: 'all 0.15s ease',
              '&:hover': { bgcolor: isDark ? D.dangerWash : '#fef2f2' },
            }}
          >
            <Box sx={{
              width: 28, height: 28, borderRadius: '7px',
              bgcolor: isDark ? D.dangerWash : '#fef2f2', border: `1px solid ${isDark ? D.dangerEdge : '#fecaca'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <LogoutIcon sx={{ fontSize: 14, color: isDark ? D.danger : '#ef4444' }} />
            </Box>
            <Typography sx={{ fontSize: '0.78rem', fontWeight: 600, color: isDark ? D.danger : '#ef4444' }}>
              Logout
            </Typography>
          </ButtonBase>
        </Box>
      </Menu>
    </Box>
  );
};

export default Profile;
