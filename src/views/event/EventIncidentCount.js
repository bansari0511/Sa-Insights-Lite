import * as React from "react";
import { EventContext } from "../../context/EventContext";
import { EventSimpleField } from "./EventSharedComponents";

export default function EventIncidentCount() {
  const { selectedEvent } = React.useContext(EventContext);

  if (!selectedEvent) {
    return null;
  }

  const formatValue = (value) => parseInt(value).toLocaleString();

  return (
    <EventSimpleField
      label="Total Incidents"
      value={selectedEvent.incident_count}
      formatValue={formatValue}
    />
  );
}
