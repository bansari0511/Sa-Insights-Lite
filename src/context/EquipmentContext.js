import { useState, createContext, useContext, useEffect } from "react";
import { RequestContext } from "./RequestContext";
import { queryAPI } from "../utils/QueryGraph";

export const EquipmentContext = createContext();

export const EquipmentContextProvider = (props) => {
  // Access global context for shared resources
  const {
    neo4jUrl,
    neo4jToken,
    baseApiUrl,
    baseImageUrl
  } = useContext(RequestContext);

  // Equipment-specific state
  const [querying, setQuerying] = useState(false);
  const [equipment, setEquipment] = useState(null);
  const [equipmentList, setEquipmentList] = useState([]);
  const [equipmentInventory, setEquipmentInventory] = useState([]);
  const [relatedEquipment, setRelatedEquipment] = useState(null);

  // Equipment profile and modals
  const [equipmentProfile, setEquipmentProfile] = useState([]);
  const [openModalEquipmentProfile, setOpenModalEquipmentProfile] = useState(false);
  const [openModalEquipmentOrg, setOpenModalEquipmentOrg] = useState(false);
  const [equipmentRelatedOrg, setEquipmentRelatedOrg] = useState(null);
  const [openModalEquipmentMg, setOpenModalEquipmentMg] = useState(false);
  const [equipmentRelatedMg, setEquipmentRelatedMg] = useState(null);

  // Equipment filters
  const [equipmentTypeFilterValue, setEquipmentTypeFilterValue] = useState([]);
  const [equipmentRoleFilterValue, setEquipmentRoleFilterValue] = useState([]);
  const [equipmentOperatorFilterValue, setEquipmentOperatorFilterValue] = useState([]);

  // Equipment layer for map
  const [equipmentLayer, setEquipmentLayer] = useState(null);

  // Equipment API call - load equipment list based on filters
  useEffect(() => {
      // Prevent API call if baseApiUrl is not available
      if (!baseApiUrl) {
        return;
      }

      const filters = {}

      if (equipmentTypeFilterValue.length > 0) {
        filters["equipment_type"] = equipmentTypeFilterValue;
      }

      if (equipmentRoleFilterValue.length > 0) {
        filters["role"] = equipmentRoleFilterValue;
      }

      if (equipmentOperatorFilterValue.length > 0) {
        filters["country_of_sovereignty"] = equipmentOperatorFilterValue;
      }

      queryAPI("equipment", null, filters || null, baseApiUrl)
        .then((res) => {
          if (res && res.resultRows) {
            const list = res.resultRows.map(a => ({ label: `${a[1]} (${a[2].split("/").pop()})`, id: a[0] }))
            setEquipmentList(list)
          } else {
            console.warn("No equipment data received")
            setEquipmentList([])
          }
        })
        .catch((error) => {
          console.error("Error loading equipment list:", error);
          setEquipmentList([])
        })

    }, [equipmentTypeFilterValue, equipmentRoleFilterValue, equipmentOperatorFilterValue, baseApiUrl, setEquipmentList])

  return (
    <EquipmentContext.Provider
      value={{
        // Shared resources from global context
        neo4jUrl,
        neo4jToken,
        baseApiUrl,
        baseImageUrl,

        // Equipment-specific state
        querying,
        setQuerying,
        equipment,
        setEquipment,
        equipmentList,
        setEquipmentList,
        equipmentInventory,
        setEquipmentInventory,
        relatedEquipment,
        setRelatedEquipment,

        // Equipment profile and modals
        equipmentProfile,
        setEquipmentProfile,
        openModalEquipmentProfile,
        setOpenModalEquipmentProfile,
        openModalEquipmentOrg,
        setOpenModalEquipmentOrg,
        equipmentRelatedOrg,
        setEquipmentRelatedOrg,
        openModalEquipmentMg,
        setOpenModalEquipmentMg,
        equipmentRelatedMg,
        setEquipmentRelatedMg,

        // Equipment filters
        equipmentTypeFilterValue,
        setEquipmentTypeFilterValue,
        equipmentRoleFilterValue,
        setEquipmentRoleFilterValue,
        equipmentOperatorFilterValue,
        setEquipmentOperatorFilterValue,

        // Equipment layer
        equipmentLayer,
        setEquipmentLayer,
      }}
    >
      {props.children}
    </EquipmentContext.Provider>
  );
};