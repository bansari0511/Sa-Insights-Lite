/**
 * EventSharedComponents - Reusable components for Event child components
 *
 * Eliminates duplicate code patterns across:
 * - EventScale, EventSignificance, EventIncidentCount (Simple text display)
 * - EventActors, EventTargets (Chip list display)
 * - EventStartDate, EventEndDate, EventReportedDate (Date display)
 */

import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

// ============================================
// SHARED TYPOGRAPHY STYLES
// ============================================

export const EVENT_TYPOGRAPHY = {
  label: {
    fontWeight: 600,
    fontSize: "0.65rem",
    color: "#5A6A85",
    letterSpacing: "0.5px",
    textTransform: "uppercase",
    fontFamily: "'Inter', 'Roboto', 'Segoe UI', -apple-system, sans-serif",
  },
  value: {
    fontWeight: 700,
    fontSize: "0.9rem",
    color: "#1a1a2e",
    lineHeight: 1.2,
    fontFamily: "'Inter', 'Roboto', 'Segoe UI', -apple-system, sans-serif",
    letterSpacing: "0.01em",
  },
  empty: {
    fontSize: "0.7rem",
    color: "#94A3B8",
    fontStyle: "italic",
    fontFamily: "'Inter', 'Roboto', 'Segoe UI', -apple-system, sans-serif",
  },
};

// ============================================
// SIMPLE TEXT FIELD COMPONENT
// Used by: EventScale, EventSignificance, EventIncidentCount
// ============================================

export const EventSimpleField = React.memo(({ label, value, formatValue }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 0.25,
        height: "100%",
        justifyContent: "center",
      }}
    >
      <Typography sx={EVENT_TYPOGRAPHY.label}>
        {label}
      </Typography>
      {value && (
        <Typography sx={EVENT_TYPOGRAPHY.value}>
          {formatValue ? formatValue(value) : value}
        </Typography>
      )}
    </Box>
  );
});

// ============================================
// CHIP LIST COMPONENT
// Used by: EventActors, EventTargets
// ============================================

const CHIP_COLORS = {
  actors: {
    bg: "rgba(93, 135, 255, 0.1)",
    bgEnd: "rgba(93, 135, 255, 0.05)",
    border: "rgba(93, 135, 255, 0.2)",
    hoverBg: "rgba(93, 135, 255, 0.18)",
    hoverBgEnd: "rgba(93, 135, 255, 0.1)",
    shadow: "rgba(93, 135, 255, 0.15)",
  },
  targets: {
    bg: "rgba(99, 102, 241, 0.1)",
    bgEnd: "rgba(99, 102, 241, 0.05)",
    border: "rgba(99, 102, 241, 0.2)",
    hoverBg: "rgba(99, 102, 241, 0.18)",
    hoverBgEnd: "rgba(99, 102, 241, 0.1)",
    shadow: "rgba(99, 102, 241, 0.15)",
  },
};

export const EventChipList = React.memo(({ label, items, emptyMessage, colorScheme = 'actors' }) => {
  const colors = CHIP_COLORS[colorScheme] || CHIP_COLORS.actors;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 0.3,
      }}
    >
      <Typography sx={{ ...EVENT_TYPOGRAPHY.label, mb: 0.3 }}>
        {label}
      </Typography>
      {items && items.length > 0 ? (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 0.5,
          }}
        >
          {items.map((item, index) => {
            const itemLabel = typeof item === 'string' ? item.trim() : (item.label ? item.label.trim() : 'Unknown');
            return (
              <Box
                key={`${itemLabel}-${index}`}
                sx={{
                  px: 0.75,
                  py: 0.25,
                  borderRadius: "5px",
                  background: `linear-gradient(135deg, ${colors.bg} 0%, ${colors.bgEnd} 100%)`,
                  border: `1px solid ${colors.border}`,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    background: `linear-gradient(135deg, ${colors.hoverBg} 0%, ${colors.hoverBgEnd} 100%)`,
                    transform: "translateY(-1px)",
                    boxShadow: `0 2px 8px ${colors.shadow}`,
                  },
                }}
              >
                <Typography sx={EVENT_TYPOGRAPHY.value}>
                  {itemLabel}
                </Typography>
              </Box>
            );
          })}
        </Box>
      ) : (
        <Typography sx={EVENT_TYPOGRAPHY.empty}>
          {emptyMessage}
        </Typography>
      )}
    </Box>
  );
});

// ============================================
// DATE FIELD COMPONENT
// Used by: EventStartDate, EventEndDate, EventReportedDate
// ============================================

export const EventDateField = React.memo(({ label, date, icon: Icon, gradient, shadowColor }) => {
  const formattedDate = date ? new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }) : null;

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
          background: gradient,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `0 3px 10px ${shadowColor}`,
          flexShrink: 0,
        }}
      >
        <Icon sx={{ color: 'white', fontSize: 16 }} />
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography sx={{ ...EVENT_TYPOGRAPHY.label, mb: 0.3 }}>
          {label}
        </Typography>
        {formattedDate && (
          <Typography sx={EVENT_TYPOGRAPHY.value}>
            {formattedDate}
          </Typography>
        )}
      </Box>
    </Box>
  );
});
