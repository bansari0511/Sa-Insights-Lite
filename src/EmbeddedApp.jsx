/**
 * EmbeddedApp — Content shell for federated (embedded) mode.
 *
 * Two mechanisms ensure navigation works in federation mode:
 *
 * 1. HistoryInterceptor: Patches history.pushState/replaceState to rewrite
 *    NEWS' absolute paths (/NewsRoom → /news/NewsRoom).
 *    This catches ALL navigation (navigate(), NavLink, etc.) transparently.
 *
 * 2. BasePathContext: Provides basePath to components that need to build
 *    paths programmatically (e.g., sidebar NavItem click handlers).
 *
 * No page component code is modified — standalone paths work as-is.
 */

import { lazy, useContext, useEffect, useMemo, useRef } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { useThemeContext } from './theme/ThemeContext';
import { getTheme } from './theme/theme';
import { RequestContext } from './context/RequestContext';
import { queryAPI } from './utils/QueryGraph';
import Loadable from './layouts/full/shared/loadable/Loadable';
import FullLayout from './layouts/full/FullLayout';
import { BasePathProvider } from './context/BasePathContext';

const NewsHomePage = Loadable(lazy(() => import('./views/newsRoom/NewsHomePage')));
const IntelligenceBriefings = Loadable(lazy(() => import('./views/newsRoom/IntelligenceBriefings')));
const EventTimeline = Loadable(lazy(() => import('./views/icons/mapandevent')));
const SearchPage = Loadable(lazy(() => import('./views/utilities/SearchPage')));

// NEWS page routes that need rewriting in federation mode
// Only child app pages — NOT host routes like 'home' or 'login'
const SA_PAGES = ['NewsRoom', 'intelligenceBriefings', 'map-and-timeline', 'search'];

/**
 * Patches history.pushState/replaceState to automatically rewrite
 * NEWS absolute paths to include the federation prefix.
 *
 * Example: /metis/NewsRoom → /metis/news/NewsRoom
 *
 * This is transparent to all components — they use navigate('/NewsRoom')
 * exactly like standalone, and the interceptor adds the prefix.
 */
const HistoryInterceptor = ({ basePath, children }) => {
  const patchedRef = useRef(false);

  useEffect(() => {
    if (patchedRef.current || !basePath) return;
    patchedRef.current = true;

    const originalPushState = window.history.pushState.bind(window.history);
    const originalReplaceState = window.history.replaceState.bind(window.history);

    // Get the host's basename from current URL (e.g., '/metis')
    const currentUrl = window.location.pathname; // e.g., '/metis/news/NewsRoom'
    const bpIdx = currentUrl.indexOf(basePath);
    const hostBasename = bpIdx > 0 ? currentUrl.substring(0, bpIdx) : ''; // '/metis'

    const rewriteUrl = (url) => {
      if (typeof url !== 'string') return url;

      // Check if URL starts with hostBasename + /pageName (without basePath)
      // e.g., /metis/NewsRoom → /metis/news/NewsRoom
      for (const page of SA_PAGES) {
        const withoutBp = `${hostBasename}/${page}`;
        const withBp = `${hostBasename}${basePath}/${page}`;

        if (url === withoutBp || url.startsWith(withoutBp + '?') || url.startsWith(withoutBp + '#')) {
          return url.replace(withoutBp, withBp);
        }
      }

      // Also handle /metis/auth/login → leave as-is (host handles auth)
      return url;
    };

    window.history.pushState = (state, title, url) => originalPushState(state, title, rewriteUrl(url));
    window.history.replaceState = (state, title, url) => originalReplaceState(state, title, rewriteUrl(url));

    return () => {
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
      patchedRef.current = false;
    };
  }, [basePath]);

  return children;
};

const EmbeddedApp = ({ basePath }) => {
  const { mode } = useThemeContext();
  const theme = useMemo(() => getTheme(mode), [mode]);
  const {
    setCountryList, setItems, selectedEventsList,
    setSelectedTimelineEvent, baseApiUrl,
  } = useContext(RequestContext);

  useEffect(() => {
    if (!baseApiUrl) return;
    queryAPI('countries', null, null, baseApiUrl)
      .then((res) => {
        if (res?.resultRows?.length)
          setCountryList(res.resultRows.map((a) => ({ label: a[0], id: a[1] })));
        else setCountryList(getFallbackCountries());
      })
      .catch(() => setCountryList(getFallbackCountries()));
  }, [baseApiUrl, setCountryList]);

  const timelineItems = useMemo(() => {
    if (!selectedEventsList || selectedEventsList.length === 0) return [];
    return selectedEventsList.slice(0, 100).map((doc) => {
      const dp = doc.last_modified_date.split('T')[0].split('-');
      return {
        id: doc.id,
        title: `${dp[2]} ${getMonthName(parseInt(dp[1]))} ${dp[0]}`,
        cardTitle: doc.label,
        cardSubtitle: doc.event_significance,
        cardDetailedText: doc.description,
      };
    });
  }, [selectedEventsList]);

  useEffect(() => {
    if (timelineItems.length > 0) {
      setItems(timelineItems);
      setSelectedTimelineEvent(timelineItems[0].id);
    }
  }, [timelineItems, setItems, setSelectedTimelineEvent]);

  const bp = basePath || '';

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      <HistoryInterceptor basePath={basePath}>
        <BasePathProvider value={bp}>
          <Routes>
            <Route element={<FullLayout />}>
              <Route index element={<Navigate to="NewsRoom" replace />} />
              <Route path="NewsRoom" element={<NewsHomePage />} />
              <Route path="intelligenceBriefings" element={<IntelligenceBriefings />} />
              <Route path="map-and-timeline" element={<EventTimeline />} />
              <Route path="search" element={<SearchPage />} />
            </Route>
            <Route path="*" element={<Navigate to="NewsRoom" replace />} />
          </Routes>
        </BasePathProvider>
      </HistoryInterceptor>
    </ThemeProvider>
  );
};

const getMonthName = (n) => {
  const d = new Date(); d.setMonth(n - 1);
  return d.toLocaleString('en-US', { month: 'long' });
};

const getFallbackCountries = () => [
  { label: 'United States', id: 'US' }, { label: 'United Kingdom', id: 'UK' },
  { label: 'Canada', id: 'CA' }, { label: 'Australia', id: 'AU' },
  { label: 'Germany', id: 'DE' }, { label: 'France', id: 'FR' },
  { label: 'Japan', id: 'JP' }, { label: 'China', id: 'CN' },
  { label: 'Russia', id: 'RU' }, { label: 'India', id: 'IN' },
];

export default EmbeddedApp;
