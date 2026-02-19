
import { CssBaseline, ThemeProvider } from '@mui/material';
import { useRoutes } from 'react-router-dom';
import Router from './routes/Router';
import { RequestContext } from "./context/RequestContext";
import { getTheme } from "./theme/theme";
import { ThemeContextProvider, useThemeContext } from "./theme/ThemeContext";
import { useContext, useEffect, useMemo } from 'react';
import { queryAPI } from './utils/QueryGraph';

// Memoized helper function outside component to prevent recreation
const getMonthName = (monthNumber) => {
  const date = new Date();
  date.setMonth(monthNumber - 1);
  return date.toLocaleString("en-US", { month: "long" });
};

function App() {
  const {
    setCountryList, setItems, selectedEventsList, setSelectedTimelineEvent, baseApiUrl,
  } = useContext(RequestContext);

  const routing = useRoutes(Router);

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
