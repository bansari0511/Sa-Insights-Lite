import { useState, createContext } from "react";
export const RequestContext = createContext();
import neo4j from 'neo4j-driver/lib/browser/neo4j-web.esm.min.js'
import urlsMap from "../services/urlsMap";

const profilerServiceUrl = urlsMap.profilerService
const assetsServiceUrl = urlsMap.assetsService

export const RequestContextProvider = (props) => {

  // let [neo4jUrl, setNeo4jUrl] = useState("bolt://1.2.3.4:7687")
  // let [neo4jToken, setNeo4jToken] = useState(neo4j.auth.basic("neo4j", "neo4j"))
  // http://172.18.139.29:5001
  let [neo4jUrl, setNeo4jUrl] = useState("bolt://localhost:7687")
  let [neo4jToken, setNeo4jToken] = useState(neo4j.auth.basic("neo4j", "Neo4j@123"))
  let [querying, setQuerying] = useState(false)

  const [baseImageUrl, setBaseImageUrl] = useState(assetsServiceUrl)

  // Equipment variables moved to EquipmentContext
  // let [equipment, setEquipment] = useState(null);
  // let [equipmentInventory, setEquipmentInventory] = useState([]);
  // let [equipmentList, setEquipmentList] = useState([]);
  // let [relatedEquipment, setRelatedEquipment] = useState(null);
  // let [openModalEquipmentOrg, setOpenModalEquipmentOrg] = useState(false)
  // let [equipmentRelatedOrg, setEquipmentRelatedOrg] = useState(null)
  // let [openModalEquipmentMg, setOpenModalEquipmentMg] = useState(false)
  // let [equipmentRelatedMg, setEquipmentRelatedMg] = useState(null)
  // let [equipmentProfile, setEquipmentProfile] = useState([])
  // let [openModalEquipmentProfile, setOpenModalEquipmentProfile] = useState(false)
  // let [equipmentTypeFilterValue, setEquipmentTypeFilterValue] = useState([])
  // let [equipmentRoleFilterValue, setEquipmentRoleFilterValue] = useState([])
  // let [equipmentOperatorFilterValue, setEquipmentOperatorFilterValue] = useState([])
  // let [equipmentLayer, setEquipmentLayer] = useState(null)

  // Military Group variables moved to MilitaryGroupContext
  // let [militaryGroup, setMilitaryGroup] = useState(null)
  // let [militaryGroupRelatedEquipment, setMilitaryGroupRelatedEquipment] = useState(null)
  // let [militaryGroupRelatedEquipmentRelatedEquipment, setMilitaryGroupRelatedEquipmentRelatedEquipment] = useState(null)
  // let [openModalMilitaryGroupEquipment, setOpenModalMilitaryGroupEquipment] = useState(false)
  // const [selectedRowKeysMgEquipment, setSelectedRowKeysMgEquipment] = useState([]);
  // let [militaryGroupLayer, setMilitaryGroupLayer] = useState(null)
  // let [militaryGroupList, setMilitaryGroupList] = useState([])
  // let [militaryGroupBranchFilterValue, setMilitaryGroupBranchFilterValue] = useState([])
  // let [militaryGroupEchelonFilterValue, setMilitaryGroupEchelonFilterValue] = useState([])
  // let [militaryGroupCountryFilterValue, setMilitaryGroupCountryFilterValue] = useState([])

  // Event variables moved to EventContext
  // let [selectedEvent, setSelectedEvent] = useState(null)
  // const [jticEventCategories, setJticEventCategories] = useState([
  //   "Terrorism & Insurgency",
  //   "Serious & Organised Crime",
  //   "Protests & Riots",
  //   "Government & Political",
  // ]);
  // let [eventsList, setEventsList] = useState([])
  // const [ofmEventCategories, setOfmEventCategories] = useState([
  //   "OSINT Forces Monitoring",
  // ]);
  // const [milEventCategories, setMilEventCategories] = useState([
  //   "Military",
  // ]);
  // const [eventRelatedEquipment, setEventRelatedEquipment] = useState(null)
  // const [eventRelatedEquipmentRelatedEquipment, setEventRelatedEquipmentRelatedEquipment] = useState(null)
  // const [eventRelatedMG, setEventRelatedMG] = useState(null)
  // const [eventLayer, setEventLayer] = useState(null)
  // const [eventCategoryFilterValue, setEventCategoryFilterValue] = useState([])
  // const [eventTypeFilterValue, setEventTypeFilterValue] = useState([])
  // const [eventSubTypeFilterValue, setEventSubTypeFilterValue] = useState([])
  // const [mainEventsLayer, setMainEventsLayer] = useState(null)
  // const [mainEventsList, setMainEventsList] = useState([])

  // Shared variables
  const [countryList, setCountryList] = useState([])

  // Ship and port profile variables
  let [imoProfile, setImoProfile] = useState(null);
  let [portProfile, setPortProfile] = useState(null);
  let [imoList, setImoList] = useState(null);
  let [portList, setPortList] = useState(null);

  // Timeline/event list variables (used in App.jsx)
  const [selectedEventsList, setSelectedEventsList] = useState([])
  let [selectedTimelineEvent, setSelectedTimelineEvent] = useState(null);
  let [items, setItems] = useState([]);

// const [baseApiUrl, setBaseApiUrl] = useState("http://localhost:8080");

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

        // Equipment variables moved to EquipmentContext
        // equipment, setEquipment,
        // equipmentInventory, setEquipmentInventory,
        // equipmentList, setEquipmentList,
        // relatedEquipment, setRelatedEquipment,
        // openModalEquipmentOrg, setOpenModalEquipmentOrg,
        // equipmentRelatedOrg, setEquipmentRelatedOrg,
        // equipmentRelatedMg, setEquipmentRelatedMg,
        // openModalEquipmentMg, setOpenModalEquipmentMg,
        // equipmentProfile, setEquipmentProfile,
        // openModalEquipmentProfile, setOpenModalEquipmentProfile,
        // equipmentTypeFilterValue, setEquipmentTypeFilterValue,
        // equipmentRoleFilterValue, setEquipmentRoleFilterValue,
        // equipmentOperatorFilterValue, setEquipmentOperatorFilterValue,
        // equipmentLayer, setEquipmentLayer,

        // Military Group variables moved to MilitaryGroupContext
        // militaryGroup, setMilitaryGroup,
        // militaryGroupList, setMilitaryGroupList,
        // openModalMilitaryGroupEquipment, setOpenModalMilitaryGroupEquipment,
        // selectedRowKeysMgEquipment, setSelectedRowKeysMgEquipment,
        // militaryGroupRelatedEquipment, setMilitaryGroupRelatedEquipment,
        // militaryGroupRelatedEquipmentRelatedEquipment, setMilitaryGroupRelatedEquipmentRelatedEquipment,
        // militaryGroupBranchFilterValue, setMilitaryGroupBranchFilterValue,
        // militaryGroupEchelonFilterValue, setMilitaryGroupEchelonFilterValue,
        // militaryGroupCountryFilterValue, setMilitaryGroupCountryFilterValue,
        // militaryGroupLayer, setMilitaryGroupLayer,

        // Event variables moved to EventContext
        // selectedEvent, setSelectedEvent,
        // jticEventCategories, setJticEventCategories,
        // ofmEventCategories, setOfmEventCategories,
        // milEventCategories, setMilEventCategories,
        // eventRelatedEquipment, setEventRelatedEquipment,
        // eventRelatedEquipmentRelatedEquipment, setEventRelatedEquipmentRelatedEquipment,
        // eventRelatedMG, setEventRelatedMG,
        // eventsList, setEventsList,
        // eventLayer, setEventLayer,
        // eventCategoryFilterValue, setEventCategoryFilterValue,
        // eventTypeFilterValue, setEventTypeFilterValue,
        // eventSubTypeFilterValue, setEventSubTypeFilterValue,
        // mainEventsLayer, setMainEventsLayer,
        // mainEventsList, setMainEventsList,

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