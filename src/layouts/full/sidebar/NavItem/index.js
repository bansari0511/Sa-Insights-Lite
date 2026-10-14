import React from 'react';
import PropTypes from 'prop-types';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  ListItemIcon,
  ListItem,
  List,
  styled,
  ListItemText,
  useTheme,
  Tooltip,
  Box
} from '@mui/material';
import { withOpacity } from '../../../../theme/palette';
import { SB } from '../sidebarTheme';

const ListItemStyled = styled(ListItem)(({ theme }) => ({
  whiteSpace: 'nowrap',
  marginBottom: '2px',
  paddingTop: 0,
  paddingBottom: 0,
  paddingLeft: 8,
  paddingRight: 8,
  borderRadius: '10px',
  backgroundColor: 'transparent',
  color: SB.text,
  border: '1px solid transparent',
  transition: 'background 0.2s ease-out, color 0.2s ease-out, border-color 0.2s ease-out, transform 0.2s ease-out, box-shadow 0.2s ease-out',
  minHeight: '34px',
  maxHeight: '34px',
  position: 'relative',
  overflow: 'hidden',

  // Left accent bar (hidden by default)
  '&::before': {
    content: '""',
    position: 'absolute',
    left: 0,
    top: '50%',
    transform: 'translateY(-50%) scaleY(0)',
    width: '3px',
    height: '58%',
    background: SB.accentBar,
    borderRadius: '0 3px 3px 0',
    boxShadow: SB.accentBarGlow,
    transition: 'transform 0.2s ease-out',
  },

  '& .MuiListItemIcon-root': {
    color: SB.icon,
  },

  '&:hover': {
    backgroundColor: SB.hoverBg,
    color: SB.textStrong,
    borderColor: SB.divider,

    '&::before': {
      transform: 'translateY(-50%) scaleY(1)',
    },

    '& .MuiListItemIcon-root': {
      color: SB.indigo,
    },
  },

  '&.Mui-selected': {
    background: SB.activeBg,
    color: SB.indigoStrong,
    fontWeight: 600,
    borderColor: 'rgba(129, 140, 248, 0.32)',
    boxShadow: SB.activeShadow,

    '&::before': {
      transform: 'translateY(-50%) scaleY(1)',
    },

    '& .MuiListItemIcon-root': {
      color: SB.indigoStrong,
    },

    '&:hover': {
      background: SB.activeBg,
      filter: 'brightness(1.02)',
    },
  },
}));

const ListStyled = styled(List)(({ theme }) => ({
  paddingTop: 0,
  paddingBottom: 0,
  margin: 0,
}));

const NavItem = ({ item, level, pathDirect, onClick, isCollapsed = false, customActive, basePath = '' }) => {
  const Icon = item.icon;
  const theme = useTheme();
  const navigate = useNavigate();
  const itemIcon = <Icon stroke={1.5} size={isCollapsed ? "1.25rem" : "1.125rem"} />;
  const isSelected = customActive !== undefined ? customActive : pathDirect === item.href;

  // Prefix href with basePath for federation mode (e.g., '/assets' + '/equipment')
  const resolvedHref = basePath ? `${basePath}${item.href}` : item.href;

  // Check if item is under development
  var textColor = 'inherit', iconColor = 'inherit';
  var isUnderDevelopment = false;

  // Handle click for under development items and Intelligence Briefing special navigation
  const handleClick = (e) => {
    if (isUnderDevelopment) {
      e.preventDefault();
      alert("Under development. Will be available shortly");
    } else if (item.href === '/intelligenceBriefings') {
      e.preventDefault();
      navigate(`${basePath}/NewsRoom`, {
        state: {
          selectedCountry: 'intelligence_briefing',
          returnToPage: 1
        }
      });
    } else if (onClick) {
      onClick(e);
    }
  };

  const listItemContent = (
    <ListItemStyled
      component={isUnderDevelopment ? 'div' : (item.external ? 'a' : NavLink)}
      to={!isUnderDevelopment ? resolvedHref : undefined}
      href={item.external && !isUnderDevelopment ? item.href : undefined}
      target={item.external && !isUnderDevelopment ? '_blank' : undefined}
      onClick={handleClick}
      selected={isSelected}
      sx={{
        padding: isCollapsed ? '8px' : '6px 8px',
        justifyContent: isCollapsed ? 'center' : 'flex-start',
        borderRadius: '6px',
        margin: isCollapsed ? '2px auto' : '0px',
        cursor: isUnderDevelopment ? 'not-allowed' : 'pointer',
        opacity: isUnderDevelopment ? 0.5 : 1,
        minHeight: isCollapsed ? 40 : 34,
        maxHeight: isCollapsed ? 40 : 34,
        width: isCollapsed ? 40 : 'auto',
        // Collapsed state specific styling
        ...(isCollapsed && {
          '&::before': {
            display: 'none',
          },
          '&.Mui-selected': {
            background: SB.gradient,
            borderColor: 'transparent',
            borderRadius: '10px',
            boxShadow: '0 6px 16px rgba(99, 102, 241, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.35)',
            '& .MuiListItemIcon-root': {
              color: '#ffffff',
            },
          },
          '&:hover': {
            background: SB.hoverBg,
            paddingLeft: 8,
          },
        }),
      }}
    >
      <ListItemIcon
        sx={{
          minWidth: isCollapsed ? 'auto' : '28px',
          color: iconColor,
          justifyContent: 'center',
          transition: 'color 0.2s ease',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {itemIcon}
      </ListItemIcon>
      {!isCollapsed && (
        <ListItemText
          sx={{
            margin: 0,
            '& .MuiListItemText-primary': {
              fontSize: '0.8125rem',
              fontWeight: 700,
              color: textColor,
              letterSpacing: '0.15px',
              lineHeight: 1.2,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            },
          }}
        >
          <>{item.title}</>
        </ListItemText>
      )}
    </ListItemStyled>
  );

  return (
    <ListStyled component="li" key={item.id}>
      {isCollapsed ? (
        <Tooltip
          title={item.title}
          placement="right"
          arrow
          slotProps={{
            tooltip: {
              sx: {
                bgcolor: SB.indigoStrong,
                color: '#fff',
                fontSize: '0.75rem',
                fontWeight: 600,
                letterSpacing: '0.02em',
                px: 1.5,
                py: 0.75,
                borderRadius: '8px',
                boxShadow: '0 8px 22px rgba(79, 70, 229, 0.28)',
              },
            },
            arrow: {
              sx: {
                color: SB.indigoStrong,
              },
            },
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            {listItemContent}
          </Box>
        </Tooltip>
      ) : (
        listItemContent
      )}
    </ListStyled>
  );
};

NavItem.propTypes = {
  item: PropTypes.object,
  level: PropTypes.number,
  pathDirect: PropTypes.any,
  onClick: PropTypes.func,
  isCollapsed: PropTypes.bool,
  customActive: PropTypes.bool,
  basePath: PropTypes.string,
};

export default NavItem;
