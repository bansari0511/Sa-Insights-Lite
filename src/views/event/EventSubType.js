import * as React from "react";
import { EventContext } from "../../context/EventContext";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import CategoryIcon from "@mui/icons-material/Category";

export default function EventSubType() {
  const { selectedEvent } = React.useContext(EventContext);

  if (!selectedEvent) {
    return null;
  }

  if (selectedEvent.event_sub_type && typeof selectedEvent.event_sub_type === 'string') {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 1.5,
          height: '100%',
          minWidth: 0,
        }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: '0.65rem',
              color: '#5A6A85',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              fontFamily: "'Inter', 'Roboto', 'Segoe UI', -apple-system, sans-serif",
              mb: 0.3,
            }}
          >
            Sub Type
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              gap: 0.75,
              flexWrap: 'wrap',
              alignItems: 'center',
            }}
          >
            {selectedEvent.event_sub_type.split(",").map((role, index) => {
              let rolelable = role.trim();
              return (
                <Tooltip
                  title={rolelable}
                  key={`${rolelable}-${index}`}
                  arrow
                  placement="top"
                  componentsProps={{
                    tooltip: {
                      sx: {
                        bgcolor: '#1a1a2e',
                        color: '#FFFFFF',
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        borderRadius: '8px',
                        py: 0.75,
                        px: 1.5,
                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
                      }
                    },
                    arrow: { sx: { color: '#1a1a2e' } }
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      p: 0.5,
                      borderRadius: '6px',
                      background: 'rgba(93, 135, 255, 0.08)',
                      border: '1px solid rgba(93, 135, 255, 0.15)',
                      transition: 'all 0.2s ease',
                      cursor: 'pointer',
                      '&:hover': {
                        background: 'rgba(93, 135, 255, 0.15)',
                        transform: 'scale(1.05)',
                        boxShadow: '0 2px 8px rgba(93, 135, 255, 0.2)',
                      }
                    }}
                  >
                    <img
                      src={"./images/eventSubType/" + rolelable.replaceAll("/", "_") + ".svg"}
                      style={{ height: "22px", display: 'block' }}
                      alt={rolelable}
                    />
                  </Box>
                </Tooltip>
              );
            })}
          </Box>
        </Box>
      </Box>
    );
  } else {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 1.5,
          height: '100%',
        }}
      >
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: '8px',
            background: 'linear-gradient(135deg, rgba(93, 135, 255, 0.2) 0%, rgba(124, 77, 255, 0.2) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <CategoryIcon sx={{ color: '#5D87FF', fontSize: 16 }} />
        </Box>
        <Typography
          sx={{
            color: '#94A3B8',
            fontWeight: 500,
            fontSize: '0.85rem',
            fontFamily: "'Inter', 'Roboto', 'Segoe UI', -apple-system, sans-serif",
            fontStyle: 'italic',
          }}
        >
          No sub type available
        </Typography>
      </Box>
    );
  }
}
