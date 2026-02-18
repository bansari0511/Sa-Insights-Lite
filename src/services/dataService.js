/**
 * Unified Data Service
 *
 * Single entry point for all data fetching in the application.
 * Automatically switches between DUMMY DATA and REAL API based on configuration.
 *
 * Usage:
 *   import { dataService } from 'src/services/dataService';
 *
 *   // Profile data
 *   const profile = await dataService.equipment.getProfile(entityId);
 *   const list = await dataService.installation.getList('searchTerm');
 *
 *   // News and Events
 *   const news = await dataService.newsProfile.get(entityId, 'equipment');
 *   const events = await dataService.eventProfile.get(entityId, 'militarygroup');
 *
 *   // Search
 *   const results = await dataService.entitySearch.search('keyword', 'equipment');
 *
 * Configuration (.env file):
 *   VITE_USE_DUMMY_DATA=true   -> Uses dummy JSON data (no API calls)
 *   VITE_USE_DUMMY_DATA=false  -> Uses real API endpoints
 *
 * Entity Types for newsProfile and eventProfile:
 *   - 'equipment'     -> Equipment profiles
 *   - 'militarygroup' -> Military Group profiles
 *   - 'installation'  -> Installation profiles
 *   - 'organization'  -> Organization profiles
 *   - 'nsag_actor'    -> NSAG Actor profiles
 */

import { USE_DUMMY_DATA } from '../config/appMode';
import { API_ENDPOINTS } from '../config/apiEndpoints';
import urlsMap from './urlsMap';
import { fetchJSON, postJSON } from '../utils/fetchWrapper';
import logger from '../utils/errorLogger';

// Import dummy data loaders
import {
  loadImoList,
  loadImoProfile,
  loadPortList,
  loadPortProfile,
  loadInstallationList,
  loadInstallationProfile,
  loadOrganizationList,
  loadOrganizationProfile,
  loadEquipmentProfile,
  loadEquipmentList,
  loadMilitaryGroupProfile,
  loadMilitaryGroupList,
  loadMilitaryGroupInstallation,
  loadEventProfile,
  loadEventList,
  loadNsagActorProfile,
  loadNsagActorList,
  loadEntitySearch,
  loadNewsHeadlines,
  loadNewsDetails,
  loadLastUpdatedDate,
  loadCountries,
  loadInventory,
  loadOrbat,
  loadOrbatByCountry,
  loadMilitaryOperatedEquipment,
  loadManufacturerDetails,
  loadManufacturerDetailsFull,
  loadNewsProfile,
  loadEquipmentEvent,
  loadImages,
  loadMadeInCountry,
} from '../data/dummyDataLoader';

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * GET request with error handling and logging
 */
async function fetchGet(url, options = {}) {
  const { maxRetries = 2, timeout = 30000, fallback = null } = options;
  try {
    return await fetchJSON(url, {}, { maxRetries, timeout });
  } catch (error) {
    logger.logApiError(url, 'GET', error);
    if (fallback !== null) {
      logger.warn(`Using fallback data for ${url}`);
      return fallback;
    }
    throw error;
  }
}

/**
 * POST request with error handling and logging
 */
async function fetchPost(url, body = {}, options = {}) {
  const { maxRetries = 2, timeout = 30000, fallback = null } = options;
  try {
    return await postJSON(url, body, {}, { maxRetries, timeout });
  } catch (error) {
    logger.logApiError(url, 'POST', error, { requestBody: body });
    if (fallback !== null) {
      logger.warn(`Using fallback data for ${url}`);
      return fallback;
    }
    throw error;
  }
}

// =============================================================================
// IMO SERVICE
// =============================================================================

export const imoService = {
  async getList(keyword = '') {
    if (USE_DUMMY_DATA) return loadImoList(keyword);
    return fetchPost(`${urlsMap.profilerService}/entity_search`, {
      user_id: '', req_id: '', entity_type: 'imo', keyword,
    });
  },

  async getProfile(imoNumber) {
    if (USE_DUMMY_DATA) return loadImoProfile(imoNumber);
    return fetchPost(`${urlsMap.profilerService}/imo`, {
      req_id: 'req_id', user_id: 'user_id', imo: imoNumber,
    });
  },
};

// =============================================================================
// PORT SERVICE
// =============================================================================

export const portService = {
  async getList(keyword = '') {
    if (USE_DUMMY_DATA) return loadPortList(keyword);
    return fetchPost(`${urlsMap.profilerService}/entity_search`, {
      user_id: '', req_id: '', entity_type: 'port', keyword,
    });
  },

  async getProfile(portId) {
    if (USE_DUMMY_DATA) return loadPortProfile(portId);
    return fetchPost(`${urlsMap.profilerService}/port`, {
      req_id: 'req_id', user_id: 'user_id', port_name: portId,
    });
  },
};

// =============================================================================
// INSTALLATION SERVICE
// =============================================================================

export const installationService = {
  async getList(keyword = '') {
    if (USE_DUMMY_DATA) return loadInstallationList(keyword);
    return fetchPost(`${urlsMap.profilerService}/entity_search`, {
      user_id: '', req_id: '', entity_type: 'installation', keyword,
    });
  },

  async getProfile(installationId) {
    if (USE_DUMMY_DATA) return loadInstallationProfile(installationId);
    return fetchPost(`${urlsMap.profilerService}/installation`, {
      req_id: 'req_id', user_id: 'user_id', entity_id: installationId,
    });
  },
};

// =============================================================================
// ORGANIZATION SERVICE
// =============================================================================

export const organizationService = {
  async getList(keyword = '') {
    if (USE_DUMMY_DATA) return loadOrganizationList(keyword);
    return fetchPost(`${urlsMap.profilerService}/entity_search`, {
      user_id: '', req_id: '', entity_type: 'organization', keyword,
    });
  },

  async getProfile(organizationId) {
    if (USE_DUMMY_DATA) return loadOrganizationProfile(organizationId);
    return fetchPost(`${urlsMap.profilerService}/manufacturer`, {
      req_id: 'req_id', user_id: 'user_id', entity_id: organizationId,
    });
  },
};

// =============================================================================
// NSAG ACTOR SERVICE
// =============================================================================

export const nsagActorService = {
  async getList(keyword = '') {
    if (USE_DUMMY_DATA) return loadNsagActorList(keyword);
    return fetchPost(`${urlsMap.profilerService}/entity_search`, {
      user_id: '', req_id: '', entity_type: 'nsag_actor', keyword,
    });
  },

  async getProfile(entityId) {
    if (USE_DUMMY_DATA) return loadNsagActorProfile(entityId);
    return fetchPost(`${urlsMap.profilerService}/nsag_actor`, {
      user_id: 'user_id', req_id: 'req_id', entity_id: entityId,
    });
  },
};

// =============================================================================
// EQUIPMENT SERVICE
// =============================================================================

/**
 * Transform equipment API response to expected resultRows format
 * The components expect: { resultRows: [[entity, specifications, relatedEquipment, ...]] }
 */
function transformEquipmentResponse(response) {
  if (!response) return { resultRows: [] };

  // If already in resultRows format, return as-is
  if (response.resultRows) return response;

  // Transform from result format to resultRows format
  if (response.result && Array.isArray(response.result)) {
    const transformedRows = response.result.map(item => {
      // Return array format matching parseEquipmentResponse expectations:
      // row[0] = entity, row[1] = specifications, row[2] = relatedEquipment, etc.
      return [
        item.e,                          // row[0] - equipment entity with .properties
        item.subGroups || [],            // row[1] - specifications
        item.subGroups2 || [],           // row[2] - relatedEquipment
        item.subGroups3 || [],           // row[3] - derived_from
        item.subGroups4 || [],           // row[4] - parent_equipment
        item.subGroups5 || [],           // row[5] - in_family
        item.subGroups6 || [],           // row[6] - overall_family
        item.subGroups7 || [],           // row[7] - operatedBy
        item.subGroups8 || [],           // row[8] - manufacturedBy
        item.integrated_platforms || [], // row[9] - integrated_platforms
        item.installations || []         // row[10] - installations
      ];
    });

    return { resultRows: transformedRows };
  }

  return { resultRows: [] };
}

export const equipmentService = {
  async getList(keyword = '') {
    if (USE_DUMMY_DATA) return loadEquipmentList();
    return fetchPost(`${urlsMap.profilerService}/entity_search`, {
      user_id: '', req_id: '', entity_type: 'equipment', keyword,
    });
  },

  async getProfile(entityId) {
    if (USE_DUMMY_DATA) return loadEquipmentProfile(entityId);
    const response = await fetchPost(API_ENDPOINTS.PROFILER.EQUIPMENT, {
      user_id: 'user_id', req_id: 'req_id', entity_id: entityId,
    });
    // Transform API response to expected resultRows format
    return transformEquipmentResponse(response);
  },

  async getInventory(entityId) {
    if (USE_DUMMY_DATA) return loadInventory(entityId);
    return fetchPost(API_ENDPOINTS.PROFILER.EQUIPMENT_INVENTORY, {
      user_id: 'user_id', req_id: 'req_id', entity_id: entityId,
    });
  },

  async getManufacturerDetails(manufacturerId) {
    if (USE_DUMMY_DATA) return loadManufacturerDetails(manufacturerId);
    return fetchPost(API_ENDPOINTS.PROFILER.MANUFACTURER_DETAILS, {
      user_id: 'user_id', req_id: 'req_id', entity_id: manufacturerId,
    });
  },

  async getImages(entityId) {
    if (USE_DUMMY_DATA) return loadImages(entityId);
    return fetchPost(API_ENDPOINTS.PROFILER.EQUIPMENT_IMAGES, {
      user_id: 'user_id', req_id: 'req_id', entity_id: entityId,
    });
  },
};

// =============================================================================
// MILITARY GROUP SERVICE
// =============================================================================

export const militaryGroupService = {
  async getList(keyword = '') {
    if (USE_DUMMY_DATA) return loadMilitaryGroupList();
    return fetchPost(`${urlsMap.profilerService}/entity_search`, {
      user_id: '', req_id: '', entity_type: 'military_group', keyword,
    });
  },

  async getProfile(entityId) {
    if (USE_DUMMY_DATA) return loadMilitaryGroupProfile(entityId);
    return fetchPost(API_ENDPOINTS.PROFILER.MILITARY_GROUP, {
      user_id: 'user_id', req_id: 'req_id', entity_id: entityId,
    });
  },

  async getOrbat(entityId) {
    if (USE_DUMMY_DATA) return loadOrbat(entityId);
    return fetchPost(API_ENDPOINTS.PROFILER.MILITARY_ORBAT, {
      user_id: 'user_id', req_id: 'req_id', entity_id: entityId,
    });
  },

  async getOrbatByCountry(countries = []) {
    if (USE_DUMMY_DATA) return loadOrbatByCountry(countries);
    return fetchPost(API_ENDPOINTS.PROFILER.MILITARY_ORBAT, {
      user_id: 'user_id', req_id: 'req_id', countries,
    });
  },

  async getOperatedEquipment(entityId) {
    if (USE_DUMMY_DATA) return loadMilitaryOperatedEquipment(entityId);
    return fetchPost(API_ENDPOINTS.PROFILER.MILITARY_OPERATED_EQUIPMENT, {
      user_id: 'user_id', req_id: 'req_id', entity_id: entityId,
    });
  },

  async getInstallations(entityId) {
    if (USE_DUMMY_DATA) return loadMilitaryGroupInstallation(entityId);
    return fetchPost(API_ENDPOINTS.PROFILER.MILITARY_GROUP_INSTALLATION, {
      user_id: 'user_id', req_id: 'req_id', entity_id: entityId,
    });
  },
};

// =============================================================================
// EVENT SERVICE
// =============================================================================

/**
 * Transform event API response to expected format
 * The components expect: { result: [{ event: {...}, primary_country, actors, related_equipment }] }
 * Handles multiple response formats from different APIs
 */
function transformEventResponse(response) {
  if (!response) return { result: [] };

  // If already in result format with event objects, return as-is
  if (response.result && Array.isArray(response.result)) {
    // Check if it's already in the expected format
    if (response.result.length > 0 && response.result[0].event) {
      return response;
    }
    // Transform each item to expected format
    const transformedResult = response.result.map(item => {
      if (item.event) return item;

      // Handle format: { e: { properties: {...} }, c.label: "...", subGroups: [...] }
      if (item.e && item.e.properties) {
        const props = item.e.properties;
        return {
          event: {
            id: props.id,
            label: props.label || props.name,
            name: props.name || props.label,
            description: props.description,
            event_category: props.event_category,
            event_sub_type: props.event_sub_type,
            event_scale: props.event_scale,
            event_significance: props.event_significance,
            start_date: props.start_date,
            end_date: props.end_date,
            event_location_lat: props.event_location_lat,
            event_location_long: props.event_location_long,
            event_target_environment: props.event_target_environment,
            incident_count: props.incident_count,
            last_modified_date: props.last_modified_date,
            latitude: props.latitude,
            longitude: props.longitude,
            ...props
          },
          primary_country: item['c.label'] || item.primary_country || '',
          // Include both naming conventions for compatibility with different components
          actors: (item.subGroups || item.actors || []).map(a => ({ id: a.id, label: a.label, ...a })),
          related_equipment: (item.subGroups2 || item.related_equipment || []).map(e => ({ id: e.id, label: e.label, ...e })),
          subGroups: (item.subGroups || item.actors || []).map(a => ({ id: a.id, label: a.label, ...a })),
          subGroups2: (item.subGroups2 || item.related_equipment || []).map(e => ({ id: e.id, label: e.label, ...e }))
        };
      }

      // Handle case where item itself is the event object
      const actorsData = item.subGroups || item.actors || [];
      const equipmentData = item.subGroups2 || item.related_equipment || [];
      return {
        event: {
          id: item.id || item.entity_id,
          label: item.label || item.name,
          name: item.name || item.label,
          description: item.description,
          event_category: item.event_category,
          event_sub_type: item.event_sub_type,
          start_date: item.start_date,
          end_date: item.end_date,
          event_location_lat: item.event_location_lat,
          event_location_long: item.event_location_long,
          event_scale: item.event_scale || item.scale,
          event_significance: item.event_significance || item.significance,
          scale: item.event_scale || item.scale,
          significance: item.event_significance || item.significance,
          ...item
        },
        primary_country: item.primary_country || '',
        actors: actorsData,
        related_equipment: equipmentData,
        subGroups: actorsData,
        subGroups2: equipmentData
      };
    });
    return { ...response, result: transformedResult };
  }

  // Handle resultRows format (from graph queries)
  if (response.resultRows && Array.isArray(response.resultRows)) {
    const transformedResult = response.resultRows.map(row => {
      const eventData = Array.isArray(row) && row.length > 0 ? row[0] : row;
      const mainProps = eventData?.properties || eventData || {};
      const actorsData = (row[2] || []).map(actor => actor?.properties ? { ...actor.properties } : actor || {});
      const equipmentData = (row[3] || []).map(eq => eq?.properties ? { ...eq.properties } : eq || {});
      return {
        event: {
          id: mainProps.id,
          label: mainProps.label || mainProps.name,
          name: mainProps.name || mainProps.label,
          description: mainProps.description,
          event_category: mainProps.event_category,
          event_sub_type: mainProps.event_sub_type,
          start_date: mainProps.start_date,
          end_date: mainProps.end_date,
          event_location_lat: mainProps.event_location_lat,
          event_location_long: mainProps.event_location_long,
          event_scale: mainProps.event_scale || mainProps.scale,
          event_significance: mainProps.event_significance || mainProps.significance,
          scale: mainProps.event_scale || mainProps.scale,
          significance: mainProps.event_significance || mainProps.significance,
          ...mainProps
        },
        primary_country: row[1] || '',
        actors: actorsData,
        related_equipment: equipmentData,
        subGroups: actorsData,
        subGroups2: equipmentData
      };
    });
    return { result: transformedResult };
  }

  // Handle case where response itself is the event object (single event)
  if (response.id || response.entity_id || response.label) {
    const actorsData = response.subGroups || response.actors || [];
    const equipmentData = response.subGroups2 || response.related_equipment || [];
    return {
      result: [{
        event: {
          id: response.id || response.entity_id,
          label: response.label || response.name,
          name: response.name || response.label,
          description: response.description,
          event_category: response.event_category,
          event_sub_type: response.event_sub_type,
          start_date: response.start_date,
          end_date: response.end_date,
          event_scale: response.event_scale || response.scale,
          event_significance: response.event_significance || response.significance,
          ...response
        },
        primary_country: response.primary_country || '',
        actors: actorsData,
        related_equipment: equipmentData,
        subGroups: actorsData,
        subGroups2: equipmentData
      }]
    };
  }

  return { result: [] };
}

export const eventService = {
  async getList(keyword = '') {
    if (USE_DUMMY_DATA) return loadEventList();
    return fetchPost(`${urlsMap.profilerService}/entity_search`, {
      user_id: '', req_id: '', entity_type: 'event', keyword,
    });
  },

  async getProfile(entityId) {
    if (USE_DUMMY_DATA) return loadEventProfile(entityId);
    const response = await fetchPost(API_ENDPOINTS.PROFILER.EVENT, {
      user_id: 'user_id', req_id: 'req_id', entity_id: entityId,
    });
    // Transform API response to expected format
    return transformEventResponse(response);
  },
};

// =============================================================================
// NEWS SERVICE
// =============================================================================

export const newsService = {
  async getHeadlines(params = {}) {
    const { size = 20, page_identifier = '', country_code = '' } = params;

    if (USE_DUMMY_DATA) {
      return loadNewsHeadlines({ size, page_identifier, countryCode: country_code });
    }

    return fetchPost(API_ENDPOINTS.NEWS.HEADLINES, {
      date: '2000-02-02',
      classification: country_code,
      size,
      page_identifier,
    });
  },

  async getDetails(userId, reqId, docId) {
    if (USE_DUMMY_DATA) return loadNewsDetails(docId);
    return fetchPost(API_ENDPOINTS.NEWS.DETAILS, {
      user_id: userId, req_id: reqId, doc_id: docId,
    });
  },

  async getLastUpdatedDate() {
    if (USE_DUMMY_DATA) return loadLastUpdatedDate();
    return fetchPost(API_ENDPOINTS.NEWS.LAST_UPDATED, {});
  },
};

// =============================================================================
// NEWS PROFILE SERVICE
// =============================================================================

export const newsProfileService = {
  /**
   * Get news profile for an entity
   * @param {string} entityId - Entity ID
   * @param {string} entityType - 'equipment' | 'militarygroup' | 'installation' | 'organization' | 'nsag_actor'
   */
  async get(entityId, entityType = '') {
    if (USE_DUMMY_DATA) return loadNewsProfile(entityId);

    const body = { user_id: 'user_id', req_id: 'req_id', entity_id: entityId };
    if (entityType) body.entity_type = entityType;

    return fetchPost(`${urlsMap.profilerService}/news_profile`, body);
  },
};

// =============================================================================
// EVENT PROFILE SERVICE
// =============================================================================

export const eventProfileService = {
  /**
   * Get event profile for an entity
   * @param {string} entityId - Entity ID
   * @param {string} entityType - 'equipment' | 'militarygroup' | 'installation' | 'organization' | 'nsag_actor'
   */
  async get(entityId, entityType = '') {
    if (USE_DUMMY_DATA) return loadEquipmentEvent(entityId);

    const body = { user_id: 'user_id', req_id: 'req_id', entity_id: entityId };
    if (entityType) body.entity_type = entityType;

    return fetchPost(`${urlsMap.profilerService}/event_profile`, body);
  },
};

// =============================================================================
// ENTITY SEARCH SERVICE
// =============================================================================

export const entitySearchService = {
  async search(keyword = '', entityType = '') {
    if (USE_DUMMY_DATA) return loadEntitySearch({ keyword, entity_type: entityType });
    return fetchPost(`${urlsMap.profilerService}/entity_search`, {
      user_id: '', req_id: '', entity_type: entityType, keyword,
    });
  },
};

// =============================================================================
// COUNTRIES SERVICE
// =============================================================================

export const countriesService = {
  async getList() {
    if (USE_DUMMY_DATA) return loadCountries();
    return fetchGet(API_ENDPOINTS.PROFILER.COUNTRIES);
  },

  async getMadeInCountry(countryId) {
    if (USE_DUMMY_DATA) return loadMadeInCountry(countryId);
    return fetchPost(`${urlsMap.profilerService}/made_in_country`, {
      user_id: 'user_id', req_id: 'req_id', entity_id: countryId,
    });
  },
};

// =============================================================================
// INVENTORY SERVICE
// =============================================================================

export const inventoryService = {
  /**
   * Search inventory with filters
   */
  async search(filters = {}, pageIdentifier = '') {
    if (USE_DUMMY_DATA) return loadInventory();
    return fetchPost(`${urlsMap.profilerService}/inventory`, {
      user_id: 'user_id', req_id: 'req_id', filters, page_identifier: pageIdentifier,
    });
  },

  /**
   * Get inventory for specific entity
   */
  async getByEntity(entityId) {
    if (USE_DUMMY_DATA) return loadInventory(entityId);
    return fetchPost(`${urlsMap.profilerService}/inventory`, {
      user_id: 'user_id', req_id: 'req_id', entity_id: entityId,
    });
  },
};

// =============================================================================
// MANUFACTURER SERVICE
// =============================================================================

export const manufacturerService = {
  async getProfile(manufacturerId) {
    if (USE_DUMMY_DATA) return loadManufacturerDetails(manufacturerId);
    return fetchPost(`${urlsMap.profilerService}/manufacturer`, {
      user_id: 'user_id', req_id: 'req_id', entity_id: manufacturerId,
    });
  },

  async getDetails(manufacturerId) {
    if (USE_DUMMY_DATA) return loadManufacturerDetailsFull(manufacturerId);
    return fetchPost(`${urlsMap.profilerService}/manufacturer`, {
      user_id: 'user_id', req_id: 'req_id', entity_id: manufacturerId,
    });
  },
};

// =============================================================================
// UNIFIED DATA SERVICE
// =============================================================================

export const dataService = {
  // Mode indicator
  isDummyMode: USE_DUMMY_DATA,

  // Entity Profile Services
  imo: imoService,
  port: portService,
  installation: installationService,
  organization: organizationService,
  equipment: equipmentService,
  militaryGroup: militaryGroupService,
  event: eventService,
  nsagActor: nsagActorService,

  // News & Content Services
  news: newsService,
  newsProfile: newsProfileService,
  eventProfile: eventProfileService,

  // Search Service
  entitySearch: entitySearchService,

  // Other Services
  inventory: inventoryService,
  manufacturer: manufacturerService,
  countries: countriesService,
};

export default dataService;
