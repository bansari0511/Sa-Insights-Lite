import * as React from "react";
import { EventContext } from "../../context/EventContext";
import EventIcon from "@mui/icons-material/Event";
import { EventDateField } from "./EventSharedComponents";

export default function EventEndDate() {
  const { selectedEvent } = React.useContext(EventContext);

  if (!selectedEvent) {
    return null;
  }

  return (
    <EventDateField
      label="End Date"
      date={selectedEvent.end_date}
      icon={EventIcon}
      gradient="linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)"
      shadowColor="rgba(99, 102, 241, 0.35)"
    />
  );
}
