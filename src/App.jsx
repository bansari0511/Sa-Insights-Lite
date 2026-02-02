
import { CssBaseline, ThemeProvider } from '@mui/material';
import { useRoutes } from 'react-router-dom';
import Router from './routes/Router';
import { RequestContext } from "./context/RequestContext";
import { getTheme } from "./theme/theme";
import { ThemeContextProvider, useThemeContext } from "./theme/ThemeContext";
import { useContext, useEffect, useMemo, useCallback } from 'react';
import { queryAPI } from './utils/QueryGraph';
import urls from "./services/urlsMap";
const AutoCompleteUrl = urls.profilerService;

// Memoized helper function outside component to prevent recreation
const getMonthName = (monthNumber) => {
  const date = new Date();
  date.setMonth(monthNumber - 1);
  return date.toLocaleString("en-US", { month: "long" });
};

function App() {
  const {
    // Equipment, Event, and MilitaryGroup variables moved to their respective contexts
    // setEquipmentList, equipmentTypeFilterValue, equipmentRoleFilterValue, equipmentOperatorFilterValue,
    // setMilitaryGroupList, militaryGroupBranchFilterValue, militaryGroupEchelonFilterValue, militaryGroupCountryFilterValue,
    // setEventsList, eventCategoryFilterValue, eventTypeFilterValue, eventSubTypeFilterValue, setMainEventsList,
    neo4jUrl, neo4jToken, setCountryList,
    setSelectedEventsList, setItems, selectedEventsList, setSelectedTimelineEvent, baseApiUrl
    , setImoList, setPortList
  } = useContext(RequestContext);

  const routing = useRoutes(Router);

  // Military group API call moved to MilitaryGroupContext
  // useEffect(() => {
  //   // Prevent API call if baseApiUrl is not available
  //   if (!baseApiUrl) {
  //     return;
  //   }

  //   const filters = {}

  //   if (militaryGroupBranchFilterValue.length > 0) {
  //     filters["branch"] = militaryGroupBranchFilterValue;
  //   }

  //   if (militaryGroupEchelonFilterValue.length > 0) {
  //     filters["echelon"] = militaryGroupEchelonFilterValue;
  //   }

  //   if (militaryGroupCountryFilterValue.length > 0) {
  //     filters["country_of_sovereignty"] = militaryGroupCountryFilterValue;
  //   }

  //   queryAPI("militarygroup", null, filters || null, baseApiUrl)
  //     .then((res) => {
  //       if (res && res.resultRows) {
  //         const list = res.resultRows.map(a => ({ label: `${a[0]} (${a[2]})`, id: a[1] }))
  //         setMilitaryGroupList(list)
  //       } else {
  //         console.warn("No military group data received")
  //         setMilitaryGroupList([])
  //       }
  //     })
  //     .catch((error) => {
  //       // console.error("Error loading military group list:", error);
  //       setMilitaryGroupList([])
  //     })

  // }, [militaryGroupBranchFilterValue, militaryGroupEchelonFilterValue, militaryGroupCountryFilterValue, baseApiUrl, setMilitaryGroupList])

  // Memoize timeline items transformation to avoid recalculation
  const timelineItems = useMemo(() => {
    if (!selectedEventsList || selectedEventsList.length === 0) {
      return [];
    }

    return selectedEventsList
      .slice(0, 100)
      .map((doc) => {
        const dateParts = doc.last_modified_date.split("T")[0].split("-");
        const day = dateParts[2];
        const month = getMonthName(parseInt(dateParts[1]));
        const year = dateParts[0];

        return {
          id: doc.id,
          title: `${day} ${month} ${year}`,
          cardTitle: doc.label,
          cardSubtitle: doc.event_significance,
          cardDetailedText: doc.description,
        };
      });
  }, [selectedEventsList]);

  // Update items when timelineItems change
  useEffect(() => {
    if (timelineItems.length > 0) {
      setItems(timelineItems);
      setSelectedTimelineEvent(timelineItems[0].id);
    }
  }, [timelineItems, setItems, setSelectedTimelineEvent]);

  // Event API call moved to EventContext
  // useEffect(() => {
  //   // Prevent API call if baseApiUrl is not available
  //   if (!baseApiUrl) {
  //     return;
  //   }

  //   let query = `MATCH (e)-[:primary_country]->(c) where (e:AttackEvent OR e:ActionEvent OR e:JudicialEvent OR e:StatementEvent OR e:MilitaryEvent OR e:ForceMonitoringEvent or e:OperationEvent) AND e.primary_type IS NOT NULL`
  //   const filters = {}

  //   if (eventCategoryFilterValue.length > 0) {
  //     filters["event_category"] = eventCategoryFilterValue;
  //   }

  //   if (eventTypeFilterValue.length > 0) {
  //     filters["pmesii_pmesii_type"] = eventTypeFilterValue;
  //   }

  //   if (eventSubTypeFilterValue.length > 0) {
  //     filters["pmesii_pmesii_sub_type"] = eventSubTypeFilterValue;
  //   }

  //   queryAPI("event", null, filters || null, baseApiUrl)
  //     .then((res) => {
  //       if (res && res.resultRows) {
  //         const list = res.resultRows.map((a) => ({ ...a[0].properties, primary_country: a[1] }))
  //         setMainEventsList(list)
  //         setSelectedEventsList(list)

  //         const dropDownList = res.resultRows.map(a => ({ label: `${a[0].properties.end_date}: ${a[0].properties.type.split("/").pop()}, ${a[1]} - ${a[0].properties.label}`, id: a[0].properties.id }))
  //         setEventsList(dropDownList)
  //       } else {
  //         console.warn("No event data received")
  //         setMainEventsList([])
  //         setSelectedEventsList([])
  //         setEventsList([])
  //       }
  //     })
  //     .catch((error) => {
  //       console.error("Error loading events list:", error);
  //       setMainEventsList([])
  //       setSelectedEventsList([])
  //       setEventsList([])
  //     })
  // }, [eventCategoryFilterValue, eventTypeFilterValue, eventSubTypeFilterValue, baseApiUrl, setMainEventsList, setSelectedEventsList, setEventsList])

  useEffect(() => {
    // Prevent API call if baseApiUrl is not available
    if (!baseApiUrl) {
      return;
    }

    queryAPI("countries", null, null, baseApiUrl)
      .then((res) => {

        if (res && res.resultRows && Array.isArray(res.resultRows)) {
          const list = res.resultRows.map(a => ({ label: a[0], id: a[1] }))
          setCountryList(list)
        } else {
          // console.error("Invalid countries API response structure:", res)
          // Set a fallback with some sample countries for development
          const fallbackCountries = [
            { label: "United States", id: "US" },
            { label: "United Kingdom", id: "UK" },
            { label: "Canada", id: "CA" },
            { label: "Australia", id: "AU" },
            { label: "Germany", id: "DE" },
            { label: "France", id: "FR" },
            { label: "Japan", id: "JP" },
            { label: "China", id: "CN" },
            { label: "Russia", id: "RU" },
            { label: "India", id: "IN" }
          ]
          setCountryList(fallbackCountries)
        }
      })
      .catch((error) => {
        console.error("Error loading countries:", error)
        // Set a fallback with some sample countries for development
        const fallbackCountries = [
          { label: "United States", id: "US" },
          { label: "United Kingdom", id: "UK" },
          { label: "Canada", id: "CA" },
          { label: "Australia", id: "AU" },
          { label: "Germany", id: "DE" },
          { label: "France", id: "FR" },
          { label: "Japan", id: "JP" },
          { label: "China", id: "CN" },
          { label: "Russia", id: "RU" },
          { label: "India", id: "IN" }
        ]
        setCountryList(fallbackCountries)
      })

  }, [baseApiUrl, setCountryList])

  // Equipment API call moved to EquipmentContext
  // useEffect(() => {
  //   // Prevent API call if baseApiUrl is not available
  //   if (!baseApiUrl) {
  //     return;
  //   }

  //   const filters = {}

  //   if (equipmentTypeFilterValue.length > 0) {
  //     filters["equipment_type"] = equipmentTypeFilterValue;
  //   }

  //   if (equipmentRoleFilterValue.length > 0) {
  //     filters["role"] = equipmentRoleFilterValue;
  //   }

  //   if (equipmentOperatorFilterValue.length > 0) {
  //     filters["country_of_sovereignty"] = equipmentOperatorFilterValue;
  //   }

  //   queryAPI("equipment", null, filters || null, baseApiUrl)
  //     .then((res) => {
  //       if (res && res.resultRows) {
  //         const list = res.resultRows.map(a => ({ label: `${a[1]} (${a[2].split("/").pop()})`, id: a[0] }))
  //         setEquipmentList(list)
  //       } else {
  //         console.warn("No equipment data received")
  //         setEquipmentList([])
  //       }
  //     })
  //     .catch((error) => {
  //       console.error("Error loading equipment list:", error);
  //       setEquipmentList([])
  //     })

  // }, [equipmentTypeFilterValue, equipmentRoleFilterValue, equipmentOperatorFilterValue, baseApiUrl, setEquipmentList])


  return (
    <ThemeContextProvider>
      <ThemedApp routing={routing} />
    </ThemeContextProvider>
  );
}

/**
 * ThemedApp - Inner component that applies the theme based on context
 * Separated to allow useThemeContext to work within ThemeContextProvider
 */
function ThemedApp({ routing }) {
  const { mode } = useThemeContext();

  // Memoize theme to prevent unnecessary re-renders
  const theme = useMemo(() => getTheme(mode), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {routing}
    </ThemeProvider>
  );
}

// Export memoized version to prevent unnecessary re-renders
export default App;
