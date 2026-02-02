import * as React from "react";
import { EventContext } from "../../context/EventContext";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material";

export default function EventCategory() {
  const theme = useTheme()
  const { selectedEvent } = React.useContext(EventContext);

  // Add null check
  if (!selectedEvent) {
    return null;
  }

  return (
    <Stack
      direction="row"
      spacing={2}
      style={{ height: "100%" }}
      useFlexGap
      flexWrap="wrap"
    >
      <Typography
        sx={{
          fontWeight: 600,
          fontSize: "0.65rem",
          color: '#5A6A85',
          letterSpacing: "0.5px",
          textTransform: "uppercase",
          fontFamily: "'Inter', 'Roboto', 'Segoe UI', -apple-system, sans-serif",
          display: "flex",
          alignItems: "center",
        }}
      >
        Category
      </Typography>
      {selectedEvent.event_category && (
        <Stack
          direction="row"
          spacing={1}
          style={{ height: "100%" }}
          useFlexGap
          flexWrap="wrap"
        >

            <Tooltip
              title={selectedEvent.event_category}
              placement="top"
              arrow
            >
              <img
                alt={selectedEvent.event_category}
                src={"./images/eventCategory/" + selectedEvent.event_category.replaceAll("/", "_").replaceAll(" ", "_") + ".svg"}
                style={{ maxWidth: "25px" }}
              />
            </Tooltip>

        </Stack>
      )}
    </Stack>
  );
}
