import * as React from "react";
import { EventContext } from "../../context/EventContext";
import { EventChipList } from "./EventSharedComponents";

export default function EventActors() {
  const { selectedEvent } = React.useContext(EventContext);

  if (!selectedEvent) {
    return null;
  }

  // Get actors from array or parse from string fields
  const getActors = () => {
    // If actors array exists and has data, use it
    if (selectedEvent.actors && Array.isArray(selectedEvent.actors) && selectedEvent.actors.length > 0) {
      return selectedEvent.actors;
    }

    // Otherwise, parse from string fields (actors_actor_type)
    if (selectedEvent.actors_actor_type && typeof selectedEvent.actors_actor_type === 'string' && selectedEvent.actors_actor_type !== 'nan') {
      return selectedEvent.actors_actor_type.split(',').map(a => a.trim()).filter(a => a);
    }

    return [];
  };

  const actors = getActors();

  return (
    <EventChipList
      label="Actors"
      items={actors}
      emptyMessage="No actors available"
      colorScheme="actors"
    />
  );
}
