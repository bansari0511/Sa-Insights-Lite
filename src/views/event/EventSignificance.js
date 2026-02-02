import * as React from "react";
import { EventContext } from "../../context/EventContext";
import { EventSimpleField } from "./EventSharedComponents";

export default function EventSignificance() {
  const { selectedEvent } = React.useContext(EventContext);

  if (!selectedEvent) {
    return null;
  }

  return <EventSimpleField label="Significance" value={selectedEvent.event_significance} />;
}
