import React from 'react';
import { EventContextProvider } from '../../context/EventContext';
import EventCard from './EventCard';

export default function EventPage() {
  return (
    <EventContextProvider>
      <EventCard />
    </EventContextProvider>
  );
}