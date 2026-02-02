import { useState, createContext, useContext, useEffect, useCallback } from "react";
import { RequestContext } from "./RequestContext";
import { dataService } from "../services/dataService";

export const NSAGActorContext = createContext();

export const NSAGActorContextProvider = (props) => {
  // Access global context for shared resources
  const {
    baseApiUrl,
    baseImageUrl,
  } = useContext(RequestContext);

  // NSAG Actor-specific state
  const [querying, setQuerying] = useState(false);
  const [nsagActor, setNsagActor] = useState(null);
  const [nsagActorList, setNsagActorList] = useState([]);

  // NSAG Actor profile and modals
  const [nsagActorProfile, setNsagActorProfile] = useState(null);
  const [openModalNsagActorNews, setOpenModalNsagActorNews] = useState(false);
  const [openModalNsagActorEvent, setOpenModalNsagActorEvent] = useState(false);

  // News and Event data
  const [newsProfileData, setNewsProfileData] = useState([]);
  const [newsProfileLoading, setNewsProfileLoading] = useState(false);
  const [eventProfileData, setEventProfileData] = useState([]);
  const [eventProfileLoading, setEventProfileLoading] = useState(false);

  // Load initial NSAG actor list
  useEffect(() => {
    const loadInitialList = async () => {
      try {
        setQuerying(true);
        const response = await dataService.nsagActor.getList();
        if (response && response.result && Array.isArray(response.result)) {
          // Data is now in consistent object format from dataService/dummyDataLoader
          // Normalize field names for consistency
          const formattedList = response.result.map(actor => ({
            entity_id: actor.entity_id || actor.id,
            label: actor.label || actor.name || actor.display_name_label,
            short_label: actor.short_label || actor.acronym_label || '',
            group_type: actor.group_type || '',
            group_orientation: actor.group_orientation || '',
            entity_status: actor.entity_status || '',
            countries: actor.countries || [],
            entity_type: actor.entity_type || 'nsag_actor'
          }));
          setNsagActorList(formattedList);
        }
      } catch (error) {
        console.error('Error loading NSAG actor list:', error);
        setNsagActorList([]);
      } finally {
        setQuerying(false);
      }
    };

    loadInitialList();
  }, []);

  // Fetch NSAG Actor profile
  const fetchNsagActorProfile = useCallback(async (entityId) => {
    if (!entityId) return;

    try {
      setQuerying(true);
      const response = await dataService.nsagActor.getProfile(entityId);
      if (response && response.result) {
        // Transform the profile data - handle multiple response formats
        let actorData;

        // Format 1: { result: { nsagActor: { properties: {...} } } }
        if (response.result.nsagActor) {
          actorData = response.result.nsagActor.properties || response.result.nsagActor;
        }
        // Format 2: { result: { properties: {...} } } (direct properties)
        else if (response.result.properties) {
          actorData = response.result.properties;
        }
        // Format 3: { result: {...} } (result is the actor data directly)
        else {
          actorData = response.result;
        }

        const transformedData = {
          nsagActor: actorData
        };
        setNsagActorProfile(transformedData);
        setNsagActor(actorData);
      } else {
        setNsagActorProfile(null);
        setNsagActor(null);
      }
    } catch (error) {
      console.error('Error fetching NSAG actor profile:', error);
      setNsagActorProfile(null);
      setNsagActor(null);
    } finally {
      setQuerying(false);
    }
  }, []);

  // Fetch news profile for NSAG actor
  const fetchNewsProfile = useCallback(async (entityId) => {
    if (!entityId) return;

    try {
      setNewsProfileLoading(true);
      const response = await dataService.newsProfile.get(entityId, 'nsag_actor');
      if (response && response.result) {
        setNewsProfileData(response.result);
      } else {
        setNewsProfileData([]);
      }
    } catch (error) {
      console.error('Error fetching news profile:', error);
      setNewsProfileData([]);
    } finally {
      setNewsProfileLoading(false);
    }
  }, []);

  // Fetch event profile for NSAG actor
  const fetchEventProfile = useCallback(async (entityId) => {
    if (!entityId) return;

    try {
      setEventProfileLoading(true);
      const response = await dataService.eventProfile.get(entityId, 'nsag_actor');
      if (response && response.result) {
        setEventProfileData(response.result);
      } else {
        setEventProfileData([]);
      }
    } catch (error) {
      console.error('Error fetching event profile:', error);
      setEventProfileData([]);
    } finally {
      setEventProfileLoading(false);
    }
  }, []);

  // Clear NSAG actor data
  const clearNsagActor = useCallback(() => {
    setNsagActor(null);
    setNsagActorProfile(null);
    setNewsProfileData([]);
    setEventProfileData([]);
  }, []);

  return (
    <NSAGActorContext.Provider
      value={{
        // Shared resources from global context
        baseApiUrl,
        baseImageUrl,

        // NSAG Actor-specific state
        querying,
        setQuerying,
        nsagActor,
        setNsagActor,
        nsagActorList,
        setNsagActorList,

        // NSAG Actor profile and modals
        nsagActorProfile,
        setNsagActorProfile,
        openModalNsagActorNews,
        setOpenModalNsagActorNews,
        openModalNsagActorEvent,
        setOpenModalNsagActorEvent,

        // News and Event data
        newsProfileData,
        setNewsProfileData,
        newsProfileLoading,
        eventProfileData,
        setEventProfileData,
        eventProfileLoading,

        // Actions
        fetchNsagActorProfile,
        fetchNewsProfile,
        fetchEventProfile,
        clearNsagActor,
      }}
    >
      {props.children}
    </NSAGActorContext.Provider>
  );
};
