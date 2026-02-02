import * as React from "react";
import { EventContext } from "../../context/EventContext";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { EventDateField } from "./EventSharedComponents";

export default function EventStartDate() {
  const { selectedEvent } = React.useContext(EventContext);

  if (!selectedEvent) {
    return null;
  }

  return (
    <EventDateField
      label="Start Date"
      date={selectedEvent.start_date}
      icon={CalendarTodayIcon}
      gradient="linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)"
      shadowColor="rgba(14, 165, 233, 0.35)"
    />
  );
}
