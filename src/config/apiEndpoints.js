/**
 * API Endpoints Configuration
 *
 * All API endpoints in one place, built from base URLs in urlsMap.js
 * Works with USE_DUMMY_DATA flag - when true, endpoints are not used.
 *
 * Usage:
 * import { API_ENDPOINTS } from 'src/config/apiEndpoints';
 * const url = API_ENDPOINTS.PROFILER.EQUIPMENT;
 */

import urlsMap from '../services/urlsMap';
import { USE_DUMMY_DATA } from './appMode';

// =============================================================================
// API ENDPOINTS (only used when USE_DUMMY_DATA = false)
// =============================================================================

export const API_ENDPOINTS = {
  // Flag to check if using dummy data
  IS_DUMMY_MODE: USE_DUMMY_DATA,

  // ---------------------------------------------------------------------------
  // PROFILER ENDPOINTS (all use profilerService as base)
  // ---------------------------------------------------------------------------
  PROFILER: {
    BASE: urlsMap.profilerService,

    // Equipment endpoints
    EQUIPMENT: `${urlsMap.profilerService}/equipment`,
    EQUIPMENT_IMAGES: `${urlsMap.profilerService}/images`,
    EQUIPMENT_INVENTORY: `${urlsMap.profilerService}/inventory`,
    EQUIPMENT_NEWS_PROFILE: `${urlsMap.profilerService}/news_profile`,
    EQUIPMENT_EVENT: `${urlsMap.profilerService}/equipment_event`,

    // Military Group endpoints
    MILITARY_GROUP: `${urlsMap.profilerService}/militarygroup`,
    MILITARY_ORBAT: `${urlsMap.profilerService}/orbat`,
    MILITARY_OPERATED_EQUIPMENT: `${urlsMap.profilerService}/military_operated_equipment`,
    MILITARY_GROUP_INSTALLATION: `${urlsMap.profilerService}/military_group_installation`,

    // Event endpoint
    EVENT: `${urlsMap.profilerService}/event`,

    // Organization endpoint
    ORGANIZATION: `${urlsMap.profilerService}/manufacturer`,

    // Other endpoints
    ENTITY_SEARCH: `${urlsMap.profilerService}/entity_search`,
    MANUFACTURER_DETAILS: `${urlsMap.profilerService}/manufacturer_details`,
    COUNTRIES: `${urlsMap.profilerService}/countries`,
  },

  // ---------------------------------------------------------------------------
  // NEWS ENDPOINTS (full URLs from env)
  // ---------------------------------------------------------------------------
  NEWS: {
    HEADLINES: urlsMap.newsHeadlines,
    DETAILS: urlsMap.newsDetails,
    LAST_UPDATED: urlsMap.lastUpdated,
  },

  // ---------------------------------------------------------------------------
  // SEARCH ENDPOINTS (full URLs from env)
  // ---------------------------------------------------------------------------
  SEARCH: {
    AUTOCOMPLETE: urlsMap.autocomplete,
    KEYWORDS: urlsMap.searchNews,
    NEWS: urlsMap.searchNews,
    EVENTS: urlsMap.searchEvents,
    COMBINED: urlsMap.searchBoth,
  },

  // ---------------------------------------------------------------------------
  // GRAPH ENDPOINTS (full URL from env)
  // ---------------------------------------------------------------------------
  GRAPH: {
    QUERY: urlsMap.graphService,
    DATA: urlsMap.graphService,
  },

  // ---------------------------------------------------------------------------
  // ASSETS ENDPOINTS (optional)
  // ---------------------------------------------------------------------------
  ASSETS: {
    BASE: urlsMap.assetsService,
    IMAGES: urlsMap.assetsService ? `${urlsMap.assetsService}/assets/images` : '',
  },

  // ---------------------------------------------------------------------------
  // GEOSERVER ENDPOINTS (optional - for map features)
  // ---------------------------------------------------------------------------
  GEOSERVER: {
    BASE: urlsMap.geoserver,
    BASEMAP: urlsMap.geoserverBasemap,
    OSM: urlsMap.osmLayer,
    STRATEGIC: urlsMap.strategicLayer,
  },
};

// Excluded relationships for graph queries
export const EXCLUDED_RELATIONSHIPS = [
  'related_to',
  'orbats',
  'assets',
  'asset_usage',
  'location_location_country',
];

export default API_ENDPOINTS;
