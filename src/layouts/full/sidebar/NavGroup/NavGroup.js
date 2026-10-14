import PropTypes from 'prop-types';
// mui imports
import { ListSubheader, useTheme } from '@mui/material';
import { SB } from '../sidebarTheme';

const NavGroup = ({ item, isFirstGroup = false }) => {
  const theme = useTheme();

  return (
    <ListSubheader
      disableSticky
      sx={{
        ...theme.typography.overline,
        fontWeight: 700,
        fontSize: '0.65rem',
        marginTop: isFirstGroup ? 0.5 : 1.5,
        marginBottom: 0.5,
        color: SB.textMuted,
        lineHeight: '16px',
        padding: '3px 8px 3px 10px',
        textTransform: 'uppercase',
        letterSpacing: '0.12em',
        backgroundColor: 'transparent',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',

        // Decorative accent dot
        '&::before': {
          content: '""',
          width: '4px',
          height: '4px',
          borderRadius: '50%',
          background: SB.indigo,
          boxShadow: `0 0 6px ${SB.indigo}`,
          flexShrink: 0,
        },

        // Decorative line extending after text
        '&::after': {
          content: '""',
          flex: 1,
          height: '1px',
          background: `linear-gradient(90deg, ${SB.border} 0%, transparent 100%)`,
          marginLeft: 1,
        },
      }}
    >
      {item.subheader}
    </ListSubheader>
  );
};

NavGroup.propTypes = {
  item: PropTypes.object,
  isFirstGroup: PropTypes.bool,
};

export default NavGroup;
