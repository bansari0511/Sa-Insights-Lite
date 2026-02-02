import * as React from "react";
import { EventContext } from "../../context/EventContext";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material";

export default function ForceMonitoringEventType() {
  const theme = useTheme()
  const { selectedEvent } = React.useContext(EventContext);

  // Add null check
  if (!selectedEvent) {
    return null;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        gap: 2,
        alignItems: "center",
        flexWrap: "wrap",
        height: "100%",
      }}
    >
      <Typography
        sx={{
          color: theme.palette.primary[700],
          display: "flex",
          alignItems: "center",
          fontWeight: 700,
          fontSize: '0.875rem',
          letterSpacing: '0.5px',
          textTransform: 'uppercase',
          fontFamily: "'Inter', 'Roboto', 'Segoe UI', -apple-system, sans-serif",
        }}
      >
        Event Type
      </Typography>
      {selectedEvent.force_monitoring_event_type && (
        <Typography
          sx={{
            color: theme.palette.primary[900],
            fontWeight: 700,
            fontSize: '0.9rem',
            fontFamily: "'Inter', 'Roboto', 'Segoe UI', -apple-system, sans-serif",
            letterSpacing: '0.01em',
          }}
        >
          {selectedEvent.force_monitoring_event_type}
        </Typography>
      )}
    </Box>
  );
}
