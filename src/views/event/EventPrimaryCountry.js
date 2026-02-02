import * as React from "react";
import { EventContext } from "../../context/EventContext";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import PublicIcon from "@mui/icons-material/Public";

import countries from "./countries";

export default function EventPrimaryCountry() {
  const { selectedEvent } = React.useContext(EventContext);

  // Add null check
  if (!selectedEvent) {
    return null;
  }

  // Check if primary_country exists and is a valid string (not an object)
  if (
    selectedEvent.primary_country &&
    typeof selectedEvent.primary_country === 'string' &&
    selectedEvent.primary_country.trim() !== ''
  ) {
    let iso2 = countries[selectedEvent.primary_country];
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 1.5,
          height: "100%",
          justifyContent: "flex-start",
          p: 1,
          minWidth: 0,
        }}
      >
        {/* Icon Badge */}
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #5D87FF 0%, #49BEFF 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 3px 10px rgba(93, 135, 255, 0.35)',
            flexShrink: 0,
          }}
        >
          <PublicIcon sx={{ color: 'white', fontSize: 18 }} />
        </Box>

        {/* Content */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: "0.65rem",
              color: '#5A6A85',
              letterSpacing: "0.5px",
              textTransform: "uppercase",
              fontFamily: "'Inter', 'Roboto', 'Segoe UI', -apple-system, sans-serif",
              mb: 0.3,
            }}
          >
            Primary Country
          </Typography>

          <Tooltip
            title={`${selectedEvent.primary_country}`}
            placement="top"
            arrow
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
                  maxWidth: '200px',
                  textAlign: 'center',
                  fontFamily: "'Inter', 'Roboto', 'Segoe UI', -apple-system, sans-serif",
                }
              },
              arrow: {
                sx: {
                  color: '#1a1a2e',
                }
              },
              popper: {
                sx: {
                  zIndex: 9999,
                }
              }
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  '& .flag-container': {
                    transform: 'scale(1.05)',
                    boxShadow: '0 4px 12px rgba(93, 135, 255, 0.25)',
                  }
                }
              }}
            >
              <Box
                className="flag-container"
                sx={{
                  width: '32px',
                  height: '22px',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  border: '1.5px solid rgba(93, 135, 255, 0.25)',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#FFFFFF',
                  flexShrink: 0,
                  transition: 'all 0.2s ease',
                }}
              >
                <img
                  alt={selectedEvent.primary_country}
                  src={"./images/flags/" + iso2 + ".png"}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </Box>
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  color: '#1a1a2e',
                  lineHeight: 1.2,
                  fontFamily: "'Inter', 'Roboto', 'Segoe UI', -apple-system, sans-serif",
                  letterSpacing: '0.01em',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {selectedEvent.primary_country}
              </Typography>
            </Box>
          </Tooltip>
        </Box>
      </Box>
    );
  } else {
    return null;
  }
}
