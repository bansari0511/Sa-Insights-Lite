import * as React from "react";
import { EventContext } from "../../context/EventContext";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function EventTargetEnvironment() {
  const { selectedEvent } = React.useContext(EventContext);

  // Add null check
  if (!selectedEvent) {
    return null;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 0.5,
      }}
    >
      <Typography
        sx={{
          fontWeight: 600,
          fontSize: "0.6rem",
          color: "#5A6A85",
          letterSpacing: "0.5px",
          textTransform: "uppercase",
          fontFamily: "'Inter', 'Roboto', 'Segoe UI', -apple-system, sans-serif",
          mb: 0.3,
        }}
      >
        Target Environment
      </Typography>
      {selectedEvent.event_target_environment && typeof selectedEvent.event_target_environment === 'string' ? (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 0.75,
          }}
        >
          {selectedEvent.event_target_environment.split(",").map((env, index) => {
            const envTrimmed = env.trim();
            return (
              <Box
                key={`${envTrimmed}-${index}`}
                sx={{
                  px: 1.25,
                  py: 0.5,
                  borderRadius: "6px",
                  background: "linear-gradient(135deg, rgba(14, 165, 233, 0.1) 0%, rgba(14, 165, 233, 0.05) 100%)",
                  border: "1px solid rgba(14, 165, 233, 0.25)",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    background: "linear-gradient(135deg, rgba(14, 165, 233, 0.18) 0%, rgba(14, 165, 233, 0.1) 100%)",
                    transform: "translateY(-1px)",
                    boxShadow: "0 2px 8px rgba(14, 165, 233, 0.15)",
                  },
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    color: "#1a1a2e",
                    lineHeight: 1.2,
                    fontFamily: "'Inter', 'Roboto', 'Segoe UI', -apple-system, sans-serif",
                    letterSpacing: "0.01em",
                  }}
                >
                  {envTrimmed}
                </Typography>
              </Box>
            );
          })}
        </Box>
      ) : (
        <Typography
          sx={{
            fontSize: "0.85rem",
            color: "#94A3B8",
            fontStyle: "italic",
            fontFamily: "'Inter', 'Roboto', 'Segoe UI', -apple-system, sans-serif",
          }}
        >
          No environment data
        </Typography>
      )}
    </Box>
  );
}
