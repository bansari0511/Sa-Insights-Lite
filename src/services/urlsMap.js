/**
 * URL Mapping Configuration
 *
 * Simple mapping of environment variables to URL properties.
 * All env variables use REACT_APP_ prefix (configured in vite.config.js).
 *
 * Environment files: .env.localhost, .env.development
 */

const urlsMap = {
    // Profiler Service base (for equipment, military, event endpoints)
    searchKeywords: import.meta.env.REACT_APP_SEARCH_URL,
    searchAutoComplete: import.meta.env.REACT_APP_AUTOCOMPLETE_URL,
    graphData: import.meta.env.REACT_APP_GRAPH_DATA,

    // Search URLs (full endpoints)
    autocomplete: import.meta.env.REACT_APP_AUTOCOMPLETE_URL,
    searchNews: import.meta.env.REACT_APP_SEARCH_NEWS_URL,
    searchEvents: import.meta.env.REACT_APP_SEARCH_EVENTS_URL,
    searchBoth: import.meta.env.REACT_APP_SEARCH_BOTH_URL,

    // News URLs (full endpoints)
    newsHeadlines: import.meta.env.REACT_APP_NEWS_HEADLINES_URL,
    newsDetails: import.meta.env.REACT_APP_NEWS_DETAILS_URL,

    // Graph Service (full endpoint)
    graphService: import.meta.env.REACT_APP_GRAPH_SERVICE_URL,

    // Last Updated (full endpoint)
    lastUpdated: import.meta.env.REACT_APP_LASTUPDATE_SERVICE_URL,

    // GeoServer URLs (optional)
    geoserver: import.meta.env.REACT_APP_GEOSERVER,
    boundary: import.meta.env.REACT_APP_GEOSERVER_BOUNDARY,
    geoserverBasemap: import.meta.env.REACT_APP_GEOSERVER_BASEMAP,
    osmLayer: import.meta.env.REACT_APP_OSM_LAYER,
    strategicLayer: import.meta.env.REACT_APP_STRATEGIC_FACILITIES,
    profilerService: import.meta.env.REACT_APP_PROFILER_SERVICE_URL,
    // Assets URL (optional)
    assetsService: import.meta.env.REACT_APP_ASSETS_URL,

    //nova service
    queryService : import.meta.env.VITE_AI_CHAT_API_URL,
};

export default urlsMap;