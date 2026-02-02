import * as React from "react";
import { EventContext } from "../../context/EventContext";
import { EventSimpleField } from "./EventSharedComponents";

export default function EventScale() {
  const { selectedEvent } = React.useContext(EventContext);

  if (!selectedEvent) {
    return null;
  }

  const value = selectedEvent.event_scale && selectedEvent.event_scale !== "nan"
    ? selectedEvent.event_scale
    : null;

  return <EventSimpleField label="Scale" value={value} />;
}
