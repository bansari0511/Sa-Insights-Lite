import * as React from "react";
import { EventContext } from "../../context/EventContext";
import { EventChipList } from "./EventSharedComponents";

export default function EventTargets() {
  const { selectedEvent } = React.useContext(EventContext);

  if (!selectedEvent) {
    return null;
  }

  // Parse targets from comma-separated string
  const targets = selectedEvent.targets_target_sector &&
    typeof selectedEvent.targets_target_sector === 'string' &&
    selectedEvent.targets_targetobjects_label !== "nan"
    ? selectedEvent.targets_target_sector.split(",").map(t => t.trim()).filter(t => t)
    : [];

  return (
    <EventChipList
      label="Targets"
      items={targets}
      emptyMessage="No targets available"
      colorScheme="targets"
    />
  );
}
