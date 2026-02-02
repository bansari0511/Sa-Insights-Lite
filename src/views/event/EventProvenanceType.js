import * as React from "react";
import { EventContext } from "../../context/EventContext";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import SourceIcon from "@mui/icons-material/Source";

export default function EventProvenanceType() {
  const { selectedEvent } = React.useContext(EventContext);

  // Add null check
  if (!selectedEvent) {
    return null;
  }

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
      {/* Icon Badge */}
      <Box
        sx={{
          width: 36,
          height: 36,
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #5D87FF 0%, #7C4DFF 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 3px 10px rgba(93, 135, 255, 0.35)',
          flexShrink: 0,
        }}
      >
        <SourceIcon sx={{ color: 'white', fontSize: 18 }} />
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          sx={{
            fontWeight: 600,
            fontSize: '0.65rem',
            color: '#5A6A85',
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
            fontFamily: "'Inter', 'Roboto', 'Segoe UI', -apple-system, sans-serif",
            mb: 0.3,
          }}
        >
          Provenance Type
        </Typography>
        {selectedEvent.provenance_type ? (
          <Box
            sx={{
              display: 'inline-flex',
              px: 1.25,
              py: 0.5,
              borderRadius: '6px',
              background: 'linear-gradient(135deg, rgba(93, 135, 255, 0.1) 0%, rgba(124, 77, 255, 0.08) 100%)',
              border: '1px solid rgba(93, 135, 255, 0.2)',
            }}
          >
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: '0.9rem',
                color: '#1a1a2e',
                lineHeight: 1.2,
                fontFamily: "'Inter', 'Roboto', 'Segoe UI', -apple-system, sans-serif",
                letterSpacing: '0.01em',
              }}
            >
              {selectedEvent.provenance_type}
            </Typography>
          </Box>
        ) : (
          <Typography
            sx={{
              fontSize: '0.85rem',
              color: '#94A3B8',
              fontStyle: 'italic',
              fontFamily: "'Inter', 'Roboto', 'Segoe UI', -apple-system, sans-serif",
            }}
          >
            Not available
          </Typography>
        )}
      </Box>
    </Box>
  );
}
