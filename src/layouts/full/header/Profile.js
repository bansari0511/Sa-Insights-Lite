import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Avatar,
  Box,
  Menu,
  Button,
  IconButton,
  useTheme,
  Divider
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import HomeIcon from '@mui/icons-material/Home';

import { withOpacity } from '../../../theme/palette';
import { RequestContext } from '../../../context/RequestContext';
import { useAuth } from '../../../context/AuthContext';

import ProfileImg from 'src/assets/images/profile/exit3.png';

const Profile = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [anchorEl2, setAnchorEl2] = useState(null);

  // Get auth context for logout
  const { logout } = useAuth();

  // Get context to close any open modals (some may be undefined if not used)
  const requestContext = useContext(RequestContext);
  const setOpenModalEquipmentOrg = requestContext?.setOpenModalEquipmentOrg;
  const setOpenModalEquipmentMg = requestContext?.setOpenModalEquipmentMg;
  const setOpenModalEquipmentProfile = requestContext?.setOpenModalEquipmentProfile;
  const setOpenModalMilitaryGroupEquipment = requestContext?.setOpenModalMilitaryGroupEquipment;
  const setEquipment = requestContext?.setEquipment;
  const setMilitaryGroup = requestContext?.setMilitaryGroup;

  const handleClick2 = (event) => {
    setAnchorEl2(event.currentTarget);
  };

  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  const handleBackToHome = () => {
    // Close the menu first
    navigate('/');
    handleClose2();

    // Close any open modals and reset asset profile states (if available)
    setOpenModalEquipmentOrg?.(false);
    setOpenModalEquipmentMg?.(false);
    setOpenModalEquipmentProfile?.(false);
    setOpenModalMilitaryGroupEquipment?.(false);

    // Clear equipment and military group selections (if available)
    setEquipment?.(null);
    setMilitaryGroup?.(null);
  };

  const handleLogout = async () => {
    // Close the menu
    handleClose2();

    // Close any open modals and reset asset profile states (if available)
    setOpenModalEquipmentOrg?.(false);
    setOpenModalEquipmentMg?.(false);
    setOpenModalEquipmentProfile?.(false);
    setOpenModalMilitaryGroupEquipment?.(false);

    // Clear equipment and military group selections (if available)
    setEquipment?.(null);
    setMilitaryGroup?.(null);

    // Perform logout
    await logout();

    // Navigate to login page
    navigate('/auth/login');
  };

  return (
    <Box>
      <Box
        sx={{
          position: 'relative',
          display: 'inline-flex',
        }}
      >
        <IconButton
          size="medium"
          aria-label="Back to Home"
          color="inherit"
          aria-controls="msgs-menu"
          aria-haspopup="true"
          sx={{
            padding: 0.5,
            transition: 'none',
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              inset: -3,
              borderRadius: '50%',
              background: `linear-gradient(135deg,
                ${theme.palette.primary[400]} 0%,
                ${theme.palette.primary[600]} 100%
              )`,
              opacity: Boolean(anchorEl2) ? 0.15 : 0,
              filter: 'blur(10px)',
              transition: 'none',
              zIndex: -1,
            },
            '&:hover': {
              transform: 'none',
              backgroundColor: 'transparent',
              '&::before': {
                opacity: 0.18,
                inset: -4,
              },
            },
            '&:active': {
              transform: 'none',
            },
            ...(Boolean(anchorEl2) && {
              transform: 'none',
            }),
          }}
          onClick={handleClick2}
        >
          <Box
            sx={{
              position: 'relative',
              display: 'flex',
              borderRadius: '50%',
              padding: '2.5px',
              background: `linear-gradient(135deg,
                ${theme.palette.primary[300]} 0%,
                ${theme.palette.primary.main} 25%,
                ${theme.palette.primary[600]} 65%,
                ${theme.palette.primary[700]} 100%
              )`,
              backgroundSize: '200% 200%',
              boxShadow: `
                0 3px 12px ${withOpacity(theme.palette.primary[600], 0.35)},
                0 2px 6px ${withOpacity(theme.palette.primary[700], 0.25)},
                0 1px 3px rgba(0, 0, 0, 0.15),
                inset 0 1px 0 ${withOpacity(theme.palette.common.white, 0.25)},
                0 0 0 1px ${withOpacity(theme.palette.primary[400], 0.12)}
              `,
              transition: 'none',
              '&::after': {
                content: '""',
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                background: `linear-gradient(135deg,
                  transparent 0%,
                  ${withOpacity(theme.palette.common.white, 0.15)} 50%,
                  transparent 100%
                )`,
                opacity: 0,
                transition: 'none',
              },
              '&:hover': {
                backgroundPosition: '100% 100%',
                boxShadow: `
                  0 5px 18px ${withOpacity(theme.palette.primary[600], 0.4)},
                  0 3px 10px ${withOpacity(theme.palette.primary[700], 0.35)},
                  0 2px 6px rgba(0, 0, 0, 0.2),
                  inset 0 1px 0 ${withOpacity(theme.palette.common.white, 0.3)},
                  0 0 0 2px ${withOpacity(theme.palette.primary[300], 0.35)},
                  0 0 14px ${withOpacity(theme.palette.primary[500], 0.25)}
                `,
                background: `linear-gradient(135deg,
                  ${theme.palette.primary[400]} 0%,
                  ${theme.palette.primary[600]} 35%,
                  ${theme.palette.primary[700]} 70%,
                  ${theme.palette.primary[800]} 100%
                )`,
                '&::after': {
                  opacity: 1,
                },
              },
            }}
          >
            <Avatar
              src={ProfileImg}
              alt="Back to Home"
              sx={{
                width: 36,
                height: 36,
                border: `2px solid ${theme.palette.common.white}`,
                boxShadow: `
                  0 2px 8px rgba(0, 0, 0, 0.15),
                  inset 0 1px 0 rgba(255, 255, 255, 0.4),
                  inset 0 -1px 0 rgba(0, 0, 0, 0.08)
                `,
                transition: 'none',
                filter: 'brightness(1.05) contrast(1.05)',
              }}
            />
          </Box>
        </IconButton>
      </Box>
      {/* ------------------------------------------- */}
      {/* Message Dropdown */}
      {/* ------------------------------------------- */}
      <Menu
        id="msgs-menu"
        anchorEl={anchorEl2}
        keepMounted
        open={Boolean(anchorEl2)}
        onClose={handleClose2}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        sx={{
          '& .MuiMenu-paper': {
            width: '180px',
            borderRadius: '12px',
            mt: 1.2,
            background: `linear-gradient(135deg,
              ${withOpacity(theme.palette.common.white, 0.98)} 0%,
              ${withOpacity(theme.palette.primary[50], 0.95)} 100%
            )`,
            border: `1.5px solid ${theme.palette.primary[200]}`,
            boxShadow: `
              0 8px 28px ${withOpacity(theme.palette.primary[600], 0.18)},
              0 3px 12px rgba(0, 0, 0, 0.08)
            `,
            backdropFilter: 'blur(16px)',
            overflow: 'visible',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              right: 16,
              width: 10,
              height: 10,
              bgcolor: theme.palette.primary[50],
              transform: 'translateY(-50%) rotate(45deg)',
              border: `1.5px solid ${theme.palette.primary[200]}`,
              borderRight: 0,
              borderBottom: 0,
            },
          },
        }}
      >

        <Box mt={0.8} py={1} px={1.5}>
          <Button
            onClick={handleBackToHome}
            fullWidth
            startIcon={<HomeIcon />}
            sx={{
              position: 'relative',
              height: 38,
              borderRadius: '10px',
              fontSize: '0.8rem',
              fontWeight: 600,
              textTransform: 'none',
              color: theme.palette.common.white,
              background: `linear-gradient(135deg,
                ${theme.palette.primary.main} 0%,
                ${theme.palette.primary[500]} 100%
              )`,
              border: `1.5px solid ${theme.palette.primary[400]}`,
              boxShadow: `
                0 3px 12px ${withOpacity(theme.palette.primary[600], 0.28)},
                0 2px 6px rgba(0, 0, 0, 0.08),
                inset 0 1px 0 ${withOpacity(theme.palette.common.white, 0.18)}
              `,
              overflow: 'hidden',
              transition: 'none',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '2px',
                background: `linear-gradient(90deg,
                  transparent 0%,
                  ${withOpacity(theme.palette.common.white, 0.5)} 50%,
                  transparent 100%
                )`,
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '100%',
                height: '100%',
                background: `linear-gradient(90deg,
                  transparent,
                  ${withOpacity(theme.palette.common.white, 0.15)},
                  transparent
                )`,
                transition: 'none',
              },
              '&:hover': {
                transform: 'none',
                background: `linear-gradient(135deg,
                  ${theme.palette.primary[600]} 0%,
                  ${theme.palette.primary[700]} 100%
                )`,
                borderColor: theme.palette.primary[500],
                boxShadow: `
                  0 5px 18px ${withOpacity(theme.palette.primary[600], 0.35)},
                  0 3px 10px rgba(0, 0, 0, 0.12),
                  inset 0 1px 0 ${withOpacity(theme.palette.common.white, 0.25)}
                `,
                '&::after': {
                  left: '100%',
                },
              },
              '&:active': {
                transform: 'none',
              },
            }}
          >
            Back to Home
          </Button>
        </Box>

        <Divider sx={{ my: 1 }} />

        <Box py={1} px={1.5}>
          <Button
            onClick={handleLogout}
            fullWidth
            startIcon={<LogoutIcon />}
            sx={{
              position: 'relative',
              height: 38,
              borderRadius: '10px',
              fontSize: '0.8rem',
              fontWeight: 600,
              textTransform: 'none',
              color: theme.palette.common.white,
              background: `linear-gradient(135deg,
                ${theme.palette.error.main} 0%,
                ${theme.palette.error.dark} 100%
              )`,
              border: `1.5px solid ${theme.palette.error.main}`,
              boxShadow: `
                0 3px 12px ${withOpacity(theme.palette.error.main, 0.28)},
                0 2px 6px rgba(0, 0, 0, 0.08),
                inset 0 1px 0 ${withOpacity(theme.palette.common.white, 0.18)}
              `,
              overflow: 'hidden',
              transition: 'none',
              '&:hover': {
                transform: 'none',
                background: `linear-gradient(135deg,
                  ${theme.palette.error.dark} 0%,
                  ${theme.palette.error.main} 100%
                )`,
                boxShadow: `
                  0 5px 18px ${withOpacity(theme.palette.error.main, 0.35)},
                  0 3px 10px rgba(0, 0, 0, 0.12),
                  inset 0 1px 0 ${withOpacity(theme.palette.common.white, 0.25)}
                `,
              },
              '&:active': {
                transform: 'none',
              },
            }}
          >
            Logout
          </Button>
        </Box>
      </Menu>
    </Box>
  );
};

export default Profile;
