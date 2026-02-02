import React from 'react';
import Menuitems from './MenuItems';
import { useLocation } from 'react-router';
import { Box, List, useTheme, Divider } from '@mui/material';
import NavItem from './NavItem';
import NavGroup from './NavGroup/NavGroup';
import { withOpacity } from '../../../theme/palette';

const SidebarItems = ({ isCollapsed = false }) => {
  const theme = useTheme()
  const location = useLocation();
  const { pathname, state } = location;
  const pathDirect = pathname;

  // Helper function to determine if an item should be active
  const isItemActive = (item) => {
    // Check if Intelligence Briefing should be active
    if (item.href === '/intelligenceBriefings') {
      // Active when on /intelligenceBriefings OR when on /NewsRoom with intelligence_briefing state
      return pathname === '/intelligenceBriefings' ||
             (pathname === '/NewsRoom' && state?.selectedCountry === 'intelligence_briefing');
    }

    // Check if News Updates should be active
    if (item.href === '/NewsRoom') {
      // Active when on /NewsRoom AND NOT in intelligence_briefing mode
      return pathname === '/NewsRoom' && state?.selectedCountry !== 'intelligence_briefing';
    }

    // Default: active when pathname matches href
    return pathname === item.href;
  };

  // Group menu items by subheader for better organization
  const groupedItems = [];
  let currentGroup = { subheader: null, items: [] };

  Menuitems.forEach((item) => {
    if (item.subheader) {
      if (currentGroup.items.length > 0 || currentGroup.subheader) {
        groupedItems.push(currentGroup);
      }
      currentGroup = { subheader: item, items: [] };
    } else {
      currentGroup.items.push(item);
    }
  });
  if (currentGroup.items.length > 0 || currentGroup.subheader) {
    groupedItems.push(currentGroup);
  }

  return (
    <Box
      sx={{
        px: isCollapsed ? 0.5 : 1.5,
        py: 0.5,
      }}
    >
      {groupedItems.map((group, groupIndex) => (
        <Box
          key={group.subheader?.subheader || `group-${groupIndex}`}
          sx={{
            mb: 0.5,
          }}
        >
          {/* Section Header */}
          {group.subheader && !isCollapsed && (
            <NavGroup item={group.subheader} isCollapsed={isCollapsed} isFirstGroup={groupIndex === 0} />
          )}

          {/* Collapsed mode divider */}
          {isCollapsed && groupIndex > 0 && (
            <Divider
              sx={{
                my: 1,
                mx: 0.5,
                borderColor: withOpacity(theme.palette.brand.cyan, 0.2),
              }}
            />
          )}

          {/* Menu Items List */}
          <List
            className="sidebarNav"
            sx={{
              py: 0,
              px: 0,
              '& .MuiListItem-root, & .MuiListItemButton-root': {
                my: 0,
                minHeight: isCollapsed ? 40 : 34,
                maxHeight: isCollapsed ? 40 : 34,
              },
              '& .MuiTypography-root': {
                fontSize: '0.8125rem',
              }
            }}
          >
            {group.items.map((item) => (
              <NavItem
                item={item}
                key={item.id}
                pathDirect={pathDirect}
                isCollapsed={isCollapsed}
                customActive={isItemActive(item)}
              />
            ))}
          </List>
        </Box>
      ))}
    </Box>
  );
};
export default SidebarItems;
