import * as React from "react";
import { EventContext } from "../../context/EventContext";
import ScheduleIcon from "@mui/icons-material/Schedule";
import { EventDateField } from "./EventSharedComponents";

export default function EventReportedDate() {
  const { selectedEvent } = React.useContext(EventContext);

  if (!selectedEvent) {
    return null;
  }

  return (
    <EventDateField
      label="Reported Date"
      date={selectedEvent.reporteddate}
      icon={ScheduleIcon}
      gradient="linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)"
      shadowColor="rgba(14, 165, 233, 0.35)"
    />
  );
}
