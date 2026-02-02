import { useState, createContext, useContext, useEffect } from "react";
import { RequestContext } from "./RequestContext";
import { queryAPI } from "../utils/QueryGraph";

export const EventContext = createContext();

export const EventContextProvider = (props) => {
  // Access global context for shared resources
  const {
    neo4jUrl,
    neo4jToken,
    baseApiUrl,
    baseImageUrl
  } = useContext(RequestContext);

  // Local state for user tracking (not in RequestContext)
  const [userId, setUserId] = useState('');
  const [reqId, setReqId] = useState('');

  // Event-specific state
  const [querying, setQuerying] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventsList, setEventsList] = useState([]);
  const [hasUserCleared, setHasUserCleared] = useState(false);

  // Event category data (initialized with proper values)
  const [jticEventCategories, setJticEventCategories] = useState([
    "Terrorism & Insurgency",
    "Serious & Organised Crime",
    "Protests & Riots",
    "Government & Political",
  ]);
  const [ofmEventCategories, setOfmEventCategories] = useState([
    "OSINT Forces Monitoring",
  ]);
  const [milEventCategories, setMilEventCategories] = useState([
    "Military",
  ]);

  // Event filters
  const [eventTypeFilterValue, setEventTypeFilterValue] = useState([]);
  const [eventCategoryFilterValue, setEventCategoryFilterValue] = useState([]);
  const [eventSubTypeFilterValue, setEventSubTypeFilterValue] = useState([]);

  // Event relationships
  const [eventRelatedEquipment, setEventRelatedEquipment] = useState(null);
  const [eventRelatedEquipmentRelatedEquipment, setEventRelatedEquipmentRelatedEquipment] = useState(null);
  const [eventRelatedMG, setEventRelatedMG] = useState(null);

  // Main events data
  const [mainEventsList, setMainEventsList] = useState([]);
  const [selectedEventsList, setSelectedEventsList] = useState([]);

  // Event map layers
  const [eventLayer, setEventLayer] = useState(null);
  const [mainEventsLayer, setMainEventsLayer] = useState(null);

  // Event API call - load events list based on filters
  // Added: Loading state for better UX
  const [eventsListLoading, setEventsListLoading] = useState(false);

  useEffect(() => {
      // Prevent API call if baseApiUrl is not available
      if (!baseApiUrl) {
        return;
      }

      let query = `MATCH (e)-[:primary_country]->(c) where (e:AttackEvent OR e:ActionEvent OR e:JudicialEvent OR e:StatementEvent OR e:MilitaryEvent OR e:ForceMonitoringEvent or e:OperationEvent) AND e.primary_type IS NOT NULL`
      const filters = {}

      if (eventCategoryFilterValue.length > 0) {
        filters["event_category"] = eventCategoryFilterValue;
      }

      if (eventTypeFilterValue.length > 0) {
        filters["pmesii_pmesii_type"] = eventTypeFilterValue;
      }

      if (eventSubTypeFilterValue.length > 0) {
        filters["pmesii_pmesii_sub_type"] = eventSubTypeFilterValue;
      }

      // Set loading state before API call
      setEventsListLoading(true);

      queryAPI("event", null, filters || null, baseApiUrl)
        .then((res) => {
          if (res && res.resultRows) {
            const list = res.resultRows.map((a) => ({ ...a[0].properties, primary_country: a[1] }))
            setMainEventsList(list)
            setSelectedEventsList(list)

            // Create dropdown list with simpler, more usable format for EventSearchBox
            const dropDownList = res.resultRows.map(a => {
              const props = a[0].properties || {};
              const eventLabel = props.label || props.name || 'Unknown Event';
              const country = a[1] || '';
              return {
                id: props.id,
                entity_id: props.id,
                label: eventLabel,
                name: eventLabel,
                category: props.event_category,
                event_category: props.event_category,
                primary_country: country,
                // Include display label for dropdown (shorter format)
                displayLabel: country ? `${eventLabel} (${country})` : eventLabel
              };
            });
            setEventsList(dropDownList)
          } else {
            console.warn("No event data received")
            setMainEventsList([])
            setSelectedEventsList([])
            setEventsList([])
          }
        })
        .catch((error) => {
          console.error("Error loading events list:", error);
          setMainEventsList([])
          setSelectedEventsList([])
          setEventsList([])
        })
        .finally(() => {
          setEventsListLoading(false);
        })
    }, [eventCategoryFilterValue, eventTypeFilterValue, eventSubTypeFilterValue, baseApiUrl, setMainEventsList, setSelectedEventsList, setEventsList])

  return (
    <EventContext.Provider
      value={{
        // Shared resources from global context
        neo4jUrl,
        neo4jToken,
        baseApiUrl,
        baseImageUrl,
        userId,
        reqId,

        // Event-specific state
        querying,
        setQuerying,
        selectedEvent,
        setSelectedEvent,
        eventsList,
        setEventsList,
        eventsListLoading,
        hasUserCleared,
        setHasUserCleared,

        // Event category data
        jticEventCategories,
        setJticEventCategories,
        ofmEventCategories,
        setOfmEventCategories,
        milEventCategories,
        setMilEventCategories,

        // Event filters
        eventTypeFilterValue,
        setEventTypeFilterValue,
        eventCategoryFilterValue,
        setEventCategoryFilterValue,
        eventSubTypeFilterValue,
        setEventSubTypeFilterValue,

        // Event relationships
        eventRelatedEquipment,
        setEventRelatedEquipment,
        eventRelatedEquipmentRelatedEquipment,
        setEventRelatedEquipmentRelatedEquipment,
        eventRelatedMG,
        setEventRelatedMG,

        // Main events data
        mainEventsList,
        setMainEventsList,
        selectedEventsList,
        setSelectedEventsList,

        // Event map layers
        eventLayer,
        setEventLayer,
        mainEventsLayer,
        setMainEventsLayer,
      }}
    >
      {props.children}
    </EventContext.Provider>
  );
};