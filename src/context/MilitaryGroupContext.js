import { useState, createContext, useContext, useEffect } from "react";
import { RequestContext } from "./RequestContext";
import { queryAPI } from "../utils/QueryGraph";

export const MilitaryGroupContext = createContext();

export const MilitaryGroupContextProvider = (props) => {
  // Access global context for shared resources
  const {
    neo4jUrl,
    neo4jToken,
    baseApiUrl,
    baseImageUrl,
    countryList
  } = useContext(RequestContext);

  // Military group-specific state
  const [querying, setQuerying] = useState(false);
  const [militaryGroup, setMilitaryGroup] = useState(null);
  const [militaryGroupList, setMilitaryGroupList] = useState([]);

  // Military group modals
  const [openModalMilitaryGroupEquipment, setOpenModalMilitaryGroupEquipment] = useState(false);
  const [militaryGroupRelatedEquipment, setMilitaryGroupRelatedEquipment] = useState(null);
  const [selectedRowKeysMgEquipment, setSelectedRowKeysMgEquipment] = useState([]);

  // Military group filters
  const [militaryGroupCountryFilterValue, setMilitaryGroupCountryFilterValue] = useState([]);
  const [militaryGroupBranchFilterValue, setMilitaryGroupBranchFilterValue] = useState([]);
  const [militaryGroupEchelonFilterValue, setMilitaryGroupEchelonFilterValue] = useState([]);

  // Military group map layer
  const [militaryGroupLayer, setMilitaryGroupLayer] = useState(null);

  // Military group API call - load military group list based on filters
  useEffect(() => {
    // Prevent API call if baseApiUrl is not available
    if (!baseApiUrl) {
      return;
    }

    const filters = {};

    if (militaryGroupBranchFilterValue.length > 0) {
      filters["branch"] = militaryGroupBranchFilterValue;
    }

    if (militaryGroupEchelonFilterValue.length > 0) {
      filters["echelon"] = militaryGroupEchelonFilterValue;
    }

    if (militaryGroupCountryFilterValue.length > 0) {
      filters["country_of_sovereignty"] = militaryGroupCountryFilterValue;
    }

    // Set querying true during initial list load
    setQuerying(true);

    queryAPI("militarygroup", null, filters || null, baseApiUrl)
      .then((res) => {
        if (res && res.resultRows) {
          const list = res.resultRows.map(a => ({ label: `${a[0]} (${a[2]})`, id: a[1] }));
          setMilitaryGroupList(list);
        } else {
          console.warn("No military group data received");
          setMilitaryGroupList([]);
        }
      })
      .catch((error) => {
        console.error("Error loading military group list:", error);
        setMilitaryGroupList([]);
      })
      .finally(() => {
        setQuerying(false);
      });

  }, [militaryGroupBranchFilterValue, militaryGroupEchelonFilterValue, militaryGroupCountryFilterValue, baseApiUrl])

  return (
    <MilitaryGroupContext.Provider
      value={{
        // Shared resources from global context
        neo4jUrl,
        neo4jToken,
        baseApiUrl,
        baseImageUrl,
        countryList,

        // Military group-specific state
        querying,
        setQuerying,
        militaryGroup,
        setMilitaryGroup,
        militaryGroupList,
        setMilitaryGroupList,

        // Military group modals
        openModalMilitaryGroupEquipment,
        setOpenModalMilitaryGroupEquipment,
        militaryGroupRelatedEquipment,
        setMilitaryGroupRelatedEquipment,
        selectedRowKeysMgEquipment,
        setSelectedRowKeysMgEquipment,

        // Military group filters
        militaryGroupCountryFilterValue,
        setMilitaryGroupCountryFilterValue,
        militaryGroupBranchFilterValue,
        setMilitaryGroupBranchFilterValue,
        militaryGroupEchelonFilterValue,
        setMilitaryGroupEchelonFilterValue,

        // Military group map layer
        militaryGroupLayer,
        setMilitaryGroupLayer,
      }}
    >
      {props.children}
    </MilitaryGroupContext.Provider>
  );
};