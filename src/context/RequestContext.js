import { useState, createContext } from "react";
export const RequestContext = createContext();
import neo4j from 'neo4j-driver/lib/browser/neo4j-web.esm.min.js'
import urlsMap from "../services/urlsMap";

const profilerServiceUrl = urlsMap.profilerService
const assetsServiceUrl = urlsMap.assetsService

export const RequestContextProvider = (props) => {

  const [neo4jUrl, setNeo4jUrl] = useState("bolt://localhost:7687")
  const [neo4jToken, setNeo4jToken] = useState(neo4j.auth.basic("neo4j", "Neo4j@123"))
  const [querying, setQuerying] = useState(false)

  const [baseImageUrl, setBaseImageUrl] = useState(assetsServiceUrl)

  // Shared variables
  const [countryList, setCountryList] = useState([])

  // Ship and port profile variables
  const [imoProfile, setImoProfile] = useState(null);
  const [portProfile, setPortProfile] = useState(null);
  const [imoList, setImoList] = useState(null);
  const [portList, setPortList] = useState(null);

  // Timeline/event list variables (used in App.jsx)
  const [selectedEventsList, setSelectedEventsList] = useState([])
  const [selectedTimelineEvent, setSelectedTimelineEvent] = useState(null);
  const [items, setItems] = useState([]);

  const [baseApiUrl, setBaseApiUrl] = useState(profilerServiceUrl);

  return (
    <RequestContext.Provider
      value={{
        // Core shared resources
        neo4jUrl, setNeo4jUrl,
        neo4jToken, setNeo4jToken,
        baseApiUrl, setBaseApiUrl,
        querying, setQuerying,
        baseImageUrl, setBaseImageUrl,

        // Shared variables
        countryList, setCountryList,

        // Ship and port profile variables
        imoProfile, setImoProfile,
        portProfile, setPortProfile,
        imoList, setImoList,
        portList, setPortList,

        // Timeline/event list variables (used in App.jsx)
        selectedEventsList, setSelectedEventsList,
        selectedTimelineEvent, setSelectedTimelineEvent,
        items, setItems,
      }}
    >
      {props.children}

    </RequestContext.Provider>
  );
  };
