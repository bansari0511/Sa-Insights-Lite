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

const ListItemStyled = styled(ListItem)(({ theme }) => ({
  whiteSpace: 'nowrap',
  marginBottom: '2px',
  paddingTop: 0,
  paddingBottom: 0,
  paddingLeft: 8,
  paddingRight: 8,
  borderRadius: '6px',
  backgroundColor: 'transparent',
  color: withOpacity('#ffffff', 0.8),
  transition: 'all 0.2s ease-out',
  border: 'none',
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
    height: '60%',
    background: theme.palette.brand.cyan,
    borderRadius: '0 2px 2px 0',
    transition: 'transform 0.2s ease-out',
  },

  '&:hover': {
    backgroundColor: withOpacity(theme.palette.brand.cyan, 0.1),
    color: '#ffffff',
    paddingLeft: 10,

    '&::before': {
      transform: 'translateY(-50%) scaleY(1)',
    },

    '& .MuiListItemIcon-root': {
      color: theme.palette.brand.cyan,
    },
  },

  '&.Mui-selected': {
    background: `linear-gradient(90deg, ${withOpacity(theme.palette.brand.cyan, 0.18)} 0%, ${withOpacity(theme.palette.brand.cyan, 0.08)} 100%)`,
    color: '#ffffff',
    fontWeight: 600,
    paddingLeft: 10,

    '&::before': {
      transform: 'translateY(-50%) scaleY(1)',
      background: `linear-gradient(180deg, ${theme.palette.brand.cyan} 0%, ${withOpacity(theme.palette.brand.cyan, 0.6)} 100%)`,
      boxShadow: `0 0 8px ${withOpacity(theme.palette.brand.cyan, 0.5)}`,
    },

    '& .MuiListItemIcon-root': {
      color: theme.palette.brand.cyan,
    },

    '&:hover': {
      background: `linear-gradient(90deg, ${withOpacity(theme.palette.brand.cyan, 0.22)} 0%, ${withOpacity(theme.palette.brand.cyan, 0.12)} 100%)`,
    },
  },
}));

const ListStyled = styled(List)(({ theme }) => ({
  paddingTop: 0,
  paddingBottom: 0,
  margin: 0,
}));

const NavItem = ({ item, level, pathDirect, onClick, isCollapsed = false, customActive }) => {
  const Icon = item.icon;
  const theme = useTheme();
  const navigate = useNavigate();
  const itemIcon = <Icon stroke={1.5} size={isCollapsed ? "1.25rem" : "1.125rem"} />;
  const isSelected = customActive !== undefined ? customActive : pathDirect === item.href;

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
      navigate('/NewsRoom', {
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
      to={!isUnderDevelopment ? item.href : undefined}
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
            background: withOpacity(theme.palette.brand.cyan, 0.2),
            borderRadius: '8px',
            '& .MuiListItemIcon-root': {
              color: theme.palette.brand.cyan,
              filter: `drop-shadow(0 0 4px ${withOpacity(theme.palette.brand.cyan, 0.6)})`,
            },
          },
          '&:hover': {
            background: withOpacity(theme.palette.brand.cyan, 0.15),
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
              fontWeight: 500,
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
                bgcolor: theme.palette.brand.deepPurple,
                color: '#fff',
                fontSize: '0.75rem',
                fontWeight: 500,
                px: 1.5,
                py: 0.75,
                borderRadius: '6px',
                boxShadow: `0 4px 12px ${withOpacity(theme.palette.brand.cyan, 0.2)}`,
              },
            },
            arrow: {
              sx: {
                color: theme.palette.brand.deepPurple,
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
};

export default NavItem;
