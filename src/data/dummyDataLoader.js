/**
 * Dummy Data Loader Utility
 *
 * Centralized loader for all dummy/mock data used in the application.
 * All dummy data files are located in src/data/dummy/ folder.
 *
 * Usage:
 * import { USE_DUMMY_DATA, loadEquipmentProfile, loadNewsHeadlines } from 'src/data/dummyDataLoader';
 *
 * if (USE_DUMMY_DATA) {
 *   return await loadEquipmentProfile(entityId);
 * }
 *
 * Mode is controlled by VITE_USE_DUMMY_DATA environment variable.
 * Set VITE_USE_DUMMY_DATA=true in .env to enable dummy data globally.
 */

// Import centralized dummy data flag
import { USE_DUMMY_DATA as DUMMY_FLAG } from '../config/appMode';

// =============================================================================
// SEARCH DUMMY DATA (from src/data/ - for search functionality)
// =============================================================================
import autocompleteData from './search-autocomplete-dummy.json';
import newsData from './search-news-dummy.json';
import eventsData from './search-events-dummy.json';
import intelligenceData from './search-intelligence-dummy.json';
import combinedData from './search-combined-dummy.json';
import equipmentSearchData from './search-equipment-dummy.json';
import militarySearchData from './search-military-dummy.json';

// =============================================================================
// PROFILER DUMMY DATA (from src/data/dummy/)
// =============================================================================

// Profile data
import equipmentProfileData from './dummy/equipment.json';
import shipProfileData from './dummy/ship.json';
import militaryGroupProfileData from './dummy/military_group.json';
import eventProfileData from './dummy/event.json';
import imoProfileData from './dummy/imo.json';
import portProfileData from './dummy/port.json';
import installationProfileData from './dummy/installation.json';
import organizationProfileData from './dummy/organization.json';
import nsagActorProfileData from './dummy/nsag_actor.json';

// List data for autocomplete
// List data for contexts (equipment, military group, event dropdown lists)
import equipmentListData from './dummy/equipment_list.json';
import militaryGroupListData from './dummy/military_group_list.json';
import eventListData from './dummy/event_list.json';
import imoListData from './dummy/imo_list.json';
import portListData from './dummy/port_list.json';
import installationListData from './dummy/installation_list.json';
import organizationListData from './dummy/organization_list.json';
import nsagActorListData from './dummy/nsag_actor_list.json';
import entitySearchData from './dummy/entity_search.json';


// News data
import newsHeadlinesData from './dummy/news_headlines.json';
import newsDetailsData from './dummy/news_details.json';

// Additional profiler data
import countriesData from './dummy/countries.json';
import madeInCountryData from './dummy/made_in_country.json';
import inventoryData from './dummy/inventory.json';
import orbatData from './dummy/orbat.json';
import militaryOperatedEquipmentData from './dummy/military_operated_equipment.json';
import manufacturerDetailsData from './dummy/manufacturer.json';
import manufacturerDetailsFullData from './dummy/manufacturer_details.json';
import newsProfileData from './dummy/news_profile.json';
import imagesData from './dummy/images.json';
import militaryGroupInstallationData from './dummy/military_group_installation.json';

// Graph and search data
import graphQueryData from './dummy/graph_query.json';
import searchKeywordsData from './dummy/search_keywords.json';
import searchAutocompleteData from './dummy/search_autocomplete.json';

// Utility data
import lastUpdatedData from './dummy/last_updated_date.json';

// =============================================================================
// EXPORTS
// =============================================================================

/**
 * Centralized dummy data flag
 * Controlled via VITE_USE_DUMMY_DATA environment variable
 */
export const USE_DUMMY_DATA = DUMMY_FLAG;

// Simulate network delay
const simulateDelay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

// =============================================================================
// PROFILE LOADERS (for EquipmentCard, MilitaryGroupCard, EventCard, etc.)
// =============================================================================

/**
 * Load equipment profile data
 * @param {string} entityId - Equipment entity ID
 * @returns {Promise<Object>} Equipment profile data
 *
 * Transforms dummy data to match the expected API response format:
 * - resultRows[i] = [entity, specifications, relatedEquipment, derived_from, parent_equipment,
 *                    in_family, overall_family, operatedBy, manufacturedBy, integrated_platforms, installations]
 */
export async function loadEquipmentProfile(entityId = '') {
  await simulateDelay();

  // Determine which data source to use based on entityId
  // Ship types (ShipFamily, ShipVariant, ShipInstance) use ship.json
  const isShipType = entityId && (
    entityId.startsWith('SHIP-') ||
    entityId.toLowerCase().includes('ship') ||
    entityId.includes('CVN') ||
    entityId.includes('DDG') ||
    entityId.includes('SSN') ||
    entityId.includes('LHA') ||
    entityId.includes('LHD') ||
    entityId.includes('CG-')
  );

  const profileData = isShipType ? shipProfileData : equipmentProfileData;

  // Transform the dummy data to match the expected API format
  // The EquipmentSearchBox expects: res.resultRows where each row is an array
  if (profileData && profileData.result) {
    const transformedRows = profileData.result.map(item => {
      // Clone the entity to avoid mutating original data
      const entity = JSON.parse(JSON.stringify(item.e));

      // If a specific entityId was requested, update the entity with that ID
      // This ensures the searchbox shows the correct equipment when navigating from MilitaryGroup
      if (entityId && entity.properties) {
        entity.properties.id = entityId;
        entity.properties.entity_id = entityId;
      }

      // Return array format matching parseEquipmentResponse expectations:
      // row[0] = entity, row[1] = specifications, row[2] = relatedEquipment, etc.
      return [
        entity,                          // row[0] - equipment entity with .properties
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

/**
 * Load military group profile data
 * @param {string} entityId - Military group entity ID
 * @returns {Promise<Object>} Military group profile data
 *
 * Transforms dummy data to match the expected API response format:
 * - resultRows[i] = [baseEntity, subGroups, subGroups2, subGroups3, equipment]
 */
export async function loadMilitaryGroupProfile(entityId = '') {
  await simulateDelay();

  // Transform the dummy data to match the expected API format
  // The API processing code expects: res.resultRows where each row is an array
  // [a[0]=baseEntity, a[1]=subGroups, a[2]=subGroups2, a[3]=subGroups3, a[4]=equipment, a[5]=installations]
  if (militaryGroupProfileData && militaryGroupProfileData.result) {
    const transformedRows = militaryGroupProfileData.result.map(item => {
      // Wrap subGroups2 and subGroups3 items in { properties: ... } to match expected format
      // The processing code expects a[2][0]?.properties and a[3][0]?.properties
      const wrappedSubGroups2 = (item.subGroups2 || []).map(sg => ({
        properties: sg
      }));
      const wrappedSubGroups3 = (item.subGroups3 || []).map(sg => ({
        properties: sg
      }));

      // Wrap equipment items in { properties: ... } to match expected format
      // The processing code does: a[4].map(b => ({ ...(b?.properties || {}) }))
      const wrappedEquipment = (item.equipment || []).map(eq => ({
        properties: eq
      }));

      // Wrap installations in { properties: ... } to match expected format
      // MapComponent expects: a[5][0].properties.lat, a[5][0].properties.long, a[5][0].properties.label
      const wrappedInstallations = (item.installations || []).map(inst => ({
        properties: {
          label: inst.label,
          lat: inst.lat,
          long: inst.long,
          id: inst.id || `installation-${inst.label}`
        }
      }));

      // Create the array structure expected by the processing code
      return [
        item.e,                    // a[0] - base entity with properties
        item.subGroups || [],      // a[1] - GroupInOrbat data (operational_domain, unit_type, etc.)
        wrappedSubGroups2,         // a[2] - parent_group data (wrapped in properties)
        wrappedSubGroups3,         // a[3] - within_orbat, orbat_type data (wrapped in properties)
        wrappedEquipment,          // a[4] - equipment list (wrapped in properties)
        wrappedInstallations       // a[5] - installations (for base location, wrapped in properties)
      ];
    });

    return {
      ...militaryGroupProfileData,
      resultRows: transformedRows
    };
  }

  return militaryGroupProfileData;
}

/**
 * Load event profile data
 * @param {string} entityId - Event entity ID
 * @returns {Promise<Object>} Event profile data
 *
 * Returns data in format expected by EventSearchBox:
 * { result: [{ event: {...}, primary_country: "...", actors: [...], related_equipment: [...] }] }
 */
export async function loadEventProfile(entityId = '') {
  await simulateDelay();

  // Transform raw event data to expected format
  const transformEventItem = (item) => {
    // Handle format: { e: { properties: {...} }, c.label: "...", subGroups: [...], subGroups2: [...] }
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
          incident_type: props.incident_type,
          last_modified_date: props.last_modified_date,
          data_source: props.data_source,
          ...props
        },
        primary_country: item['c.label'] || item.primary_country || '',
        actors: (item.subGroups || item.actors || []).map(actor => ({
          id: actor.id,
          label: actor.label || actor.name,
          ...actor
        })),
        related_equipment: (item.subGroups2 || item.related_equipment || []).map(eq => ({
          id: eq.id,
          label: eq.label || eq.name,
          ...eq
        }))
      };
    }
    // Handle already transformed format: { event: {...}, primary_country: "...", ... }
    if (item.event) {
      return item;
    }
    // Fallback: treat item itself as event
    return {
      event: item,
      primary_country: item.primary_country || '',
      actors: item.actors || [],
      related_equipment: item.related_equipment || []
    };
  };

  if (!eventProfileData || !eventProfileData.result) {
    return { result: [] };
  }

  // Transform all events
  const transformedResult = eventProfileData.result.map(transformEventItem);

  // If entityId is provided, try to find the matching event
  if (entityId) {
    const matchingEvent = transformedResult.find(item => {
      const eventId = item.event?.id || '';
      return eventId === entityId || eventId.includes(entityId);
    });

    if (matchingEvent) {
      return {
        ...eventProfileData,
        result: [matchingEvent]
      };
    }
  }

  // Return the transformed event profile data
  return {
    ...eventProfileData,
    result: transformedResult
  };
}

/**
 * Load IMO profile data
 * @param {string} entityId - IMO entity ID
 * @returns {Promise<Object>} IMO profile data
 */
export async function loadImoProfile(entityId = '') {
  await simulateDelay();
  return imoProfileData;
}

/**
 * Load port profile data
 * @param {string} entityId - Port entity ID
 * @returns {Promise<Object>} Port profile data
 */
export async function loadPortProfile(entityId = '') {
  await simulateDelay();
  return portProfileData;
}

/**
 * Load installation profile data
 * @param {string} entityId - Installation entity ID
 * @returns {Promise<Object>} Installation profile data
 */
export async function loadInstallationProfile(entityId = '') {
  await simulateDelay();
  // Wrap in result array format expected by InstallationProfileCard
  // Component expects: data.result[0] with installation, location, infrastructure, etc.
  return { result: [installationProfileData] };
}

/**
 * Load organization profile data
 * @param {string} entityId - Organization entity ID
 * @returns {Promise<Object>} Organization profile data
 */
export async function loadOrganizationProfile(entityId = '') {
  await simulateDelay();
  return organizationProfileData;
}

/**
 * Load NSAG actor profile data
 * @param {string} entityId - NSAG actor entity ID
 * @returns {Promise<Object>} NSAG actor profile data
 */
export async function loadNsagActorProfile(entityId = '') {
  await simulateDelay();
  return nsagActorProfileData;
}

// =============================================================================
// LIST LOADERS (for autocomplete/search)
// =============================================================================

/**
 * Load IMO list for autocomplete
 * @param {string} keyword - Search keyword (optional)
 * @returns {Promise<Object>} IMO list data
 */
export async function loadImoList(keyword = '') {
  await simulateDelay(150);

  if (keyword && keyword.length >= 3) {
    const filtered = imoListData.result.filter(item =>
      item.label.toLowerCase().includes(keyword.toLowerCase())
    );
    return { ...imoListData, result: filtered };
  }

  return imoListData;
}

/**
 * Load port list for autocomplete
 * @param {string} keyword - Search keyword (optional)
 * @returns {Promise<Object>} Port list data
 */
export async function loadPortList(keyword = '') {
  await simulateDelay(150);

  if (keyword && keyword.length >= 3) {
    const filtered = portListData.result.filter(item =>
      item.label.toLowerCase().includes(keyword.toLowerCase())
    );
    return { ...portListData, result: filtered };
  }

  return portListData;
}

/**
 * Load installation list for autocomplete
 * @param {string} keyword - Search keyword (optional)
 * @returns {Promise<Object>} Installation list data
 */
export async function loadInstallationList(keyword = '') {
  await simulateDelay(150);

  if (keyword && keyword.length >= 3) {
    const filtered = installationListData.result.filter(item =>
      item.label.toLowerCase().includes(keyword.toLowerCase())
    );
    return { ...installationListData, result: filtered };
  }

  return installationListData;
}

/**
 * Load organization list for autocomplete
 * @param {string} keyword - Search keyword (optional)
 * @returns {Promise<Object>} Organization list data
 */
export async function loadOrganizationList(keyword = '') {
  await simulateDelay(150);

  if (keyword && keyword.length >= 3) {
    const filtered = organizationListData.result.filter(item =>
      item.label.toLowerCase().includes(keyword.toLowerCase())
    );
    return { ...organizationListData, result: filtered };
  }

  return organizationListData;
}

/**
 * Load entity search results
 * Supports filtering by entity_type and keyword
 *
 * @param {Object} params - Search parameters
 * @param {string} params.user_id - User ID (optional)
 * @param {string} params.req_id - Request ID (optional)
 * @param {string} params.entity_type - Entity type: 'port', 'imo', 'equipment', 'military_group', 'event'
 * @param {string} params.keyword - Search keyword
 * @returns {Promise<Object>} Entity search data
 */
export async function loadEntitySearch(params = {}) {
  await simulateDelay(150);

  const { entity_type = '', keyword = '' } = params;

  // Normalize entity_type to match data keys (convert to lowercase and handle variations)
  let normalizedType = entity_type.toLowerCase().replace('-', '_');

  // Map equipmentvariant, equipmentfamily, and ship types to equipment for search
  if (normalizedType === 'equipmentvariant' || normalizedType === 'equipmentfamily' ||
      normalizedType === 'shipvariant' || normalizedType === 'shipfamily' || normalizedType === 'shipinstance') {
    normalizedType = 'equipment';
  }

  // Map militarygroup to military_group (underscore format used in entity_search.json)
  if (normalizedType === 'militarygroup') {
    normalizedType = 'military_group';
  }

  // Get data based on entity type
  let results = [];

  // Handle nsag_actor specially using loadNsagActorList
  if (normalizedType === 'nsag_actor') {
    const nsagData = await loadNsagActorList(keyword);
    return {
      status_code: 200,
      status_message: "Query executed successfully",
      req_id: params.req_id || "entity_search_001",
      result: nsagData.result || [],
      entity_types: entitySearchData.entity_types
    };
  }

  if (normalizedType && entitySearchData.data[normalizedType]) {
    // Get specific entity type data
    results = entitySearchData.data[normalizedType];
  } else if (!normalizedType) {
    // If no entity type specified, combine all data
    // Get nsag_actor data transformed to object format
    const nsagData = await loadNsagActorList('');
    results = [
      ...(entitySearchData.data.port || []),
      ...(entitySearchData.data.imo || []),
      ...(entitySearchData.data.equipment || []),
      ...(entitySearchData.data.military_group || []),
      ...(entitySearchData.data.event || []),
      ...(entitySearchData.data.installation || []),
      ...(entitySearchData.data.organization || []),
      ...(nsagData.result || [])
    ];
  }

  // Filter by keyword if provided
  if (keyword && keyword.length >= 2) {
    const searchTerm = keyword.toLowerCase();
    results = results.filter(item => {
      const label = item.label.toLowerCase();
      const entityId = item.entity_id.toLowerCase();
      // Match if either:
      // 1. The label includes the search term (e.g., "F-16B Falcon" includes "f-16b")
      // 2. The search term includes the label (e.g., "F-16B Fighting Falcon" includes "f-16b")
      // 3. The entity_id includes the search term
      return label.includes(searchTerm) ||
             searchTerm.includes(label) ||
             entityId.includes(searchTerm);
    });
  }

  return {
    status_code: 200,
    status_message: "Query executed successfully",
    req_id: params.req_id || "entity_search_001",
    result: results,
    entity_types: entitySearchData.entity_types
  };
}

/**
 * Load equipment list for dropdown/context
 * @returns {Promise<Object>} Equipment list data (simple arrays)
 */
export async function loadEquipmentList() {
  await simulateDelay(150);
  return equipmentListData;
}

/**
 * Load military group list for dropdown/context
 * @returns {Promise<Object>} Military group list data (simple arrays)
 */
export async function loadMilitaryGroupList() {
  await simulateDelay(150);
  return militaryGroupListData;
}

/**
 * Load event list for dropdown/context
 * @returns {Promise<Object>} Event list data
 *
 * Transforms dummy data to match the expected API response format:
 * - resultRows[i] = [{ properties: {...eventData} }, primary_country_string]
 *
 * EventContext expects:
 *   res.resultRows.map(a => ({ ...a[0].properties, primary_country: a[1] }))
 */
export async function loadEventList() {
  await simulateDelay(150);

  // Transform the event list data to match queryAPI response format
  if (eventListData && eventListData.result) {
    const transformedRows = eventListData.result.map(item => {
      const eventData = item.event || item;
      // Return array format matching EventContext expectations:
      // row[0] = { properties: { ...eventData } }
      // row[1] = primary_country string
      return [
        { properties: eventData },
        item.primary_country || ''
      ];
    });

    return { resultRows: transformedRows };
  }

  return { resultRows: [] };
}

/**
 * Load NSAG actor list for dropdown/context
 * @param {string} keyword - Search keyword (optional)
 * @returns {Promise<Object>} NSAG actor list data
 *
 * Transforms array format from nsag_actor_list.json to object format:
 * [entity_id, label, short_label, group_type, group_orientation, entity_status, countries[]]
 * -> { entity_id, label, short_label, group_type, group_orientation, entity_status, countries }
 */
export async function loadNsagActorList(keyword = '') {
  await simulateDelay(150);

  // Transform array format to object format (matching entity_search response)
  let results = [];
  if (nsagActorListData && nsagActorListData.result && Array.isArray(nsagActorListData.result)) {
    results = nsagActorListData.result.map(actor => {
      // Handle array format from nsag_actor_list.json
      if (Array.isArray(actor)) {
        return {
          entity_id: actor[0],
          label: actor[1],
          short_label: actor[2] || '',
          group_type: actor[3] || '',
          group_orientation: actor[4] || '',
          entity_status: actor[5] || '',
          countries: actor[6] || [],
          entity_type: 'nsag_actor'
        };
      }
      // Already object format
      return {
        entity_id: actor.entity_id || actor.id,
        label: actor.label || actor.name || actor.display_name_label,
        short_label: actor.short_label || actor.acronym_label || '',
        group_type: actor.group_type || '',
        group_orientation: actor.group_orientation || '',
        entity_status: actor.entity_status || '',
        countries: actor.countries || [],
        entity_type: 'nsag_actor'
      };
    });
  }

  // Filter by keyword if provided
  if (keyword && keyword.length >= 3) {
    const searchTerm = keyword.toLowerCase();
    results = results.filter(item =>
      item.label?.toLowerCase().includes(searchTerm) ||
      item.short_label?.toLowerCase().includes(searchTerm) ||
      item.entity_id?.toLowerCase().includes(searchTerm)
    );
  }

  return {
    ...nsagActorListData,
    result: results
  };
}

// =============================================================================
// NEWS LOADERS (for EnhancedNewsTabs, IntelligenceBriefings)
// =============================================================================

/**
 * Load news headlines
 * @param {Object} params - Query parameters
 * @param {string} params.countryCode - Filter by countryCode ('intelligence_briefing' for Intelligence Briefings, 'china' for News & Analysis)
 * @param {number} params.size - Page size
 * @param {string} params.page_identifier - Page identifier for pagination
 * @returns {Promise<Object>} News headlines data
 */
export async function loadNewsHeadlines(params = {}) {
  await simulateDelay();

  const { size = 20, page_identifier = '', countryCode = '' } = params;
  let records = newsHeadlinesData.records || [];

  // Filter by countryCode if provided (case-insensitive)
  if (countryCode) {
    const normalizedCode = countryCode.toLowerCase();
    records = records.filter(record =>
      record.countryCode && record.countryCode.toLowerCase() === normalizedCode
    );
  }

  // Simulate pagination
  const offset = page_identifier ? parseInt(page_identifier) || 0 : 0;
  const paginatedRecords = records.slice(offset, offset + size);
  const hasMore = (offset + size) < records.length;

  // Transform data to match expected format by pages
  const transformedRecords = paginatedRecords.map(record => ({
    doc_id: record.id || record.doc_id,
    title: record.title,
    summary: record.summary,
    last_updated: record.lastModifiedDate || record.last_updated || record.date,
    caption_img: record.image || record.caption_img || '',
    classifications: record.tags || (record.classification ? [record.classification] : []),
    source: record.source,
    category: record.category,
    region: record.region,
    country: record.country,
    countryCode: record.countryCode
  }));

  return {
    status_code: newsHeadlinesData.status_code || 200,
    status_message: newsHeadlinesData.status_message || 'Success',
    total_count: records.length,
    req_id: 'dummy-req-' + Date.now(),
    result: transformedRecords,
    hasMore,
    nextPageIdentifier: hasMore ? String(offset + size) : ''
  };
}

/**
 * Load news article details
 * @param {string} docId - Document ID
 * @returns {Promise<Object>} News details data
 */
export async function loadNewsDetails(docId = '') {
  await simulateDelay();
  return newsDetailsData;
}

/**
 * Load last updated date
 * @returns {Promise<Object>} Last updated date data
 */
export async function loadLastUpdatedDate() {
  await simulateDelay(100);
  return lastUpdatedData;
}

// =============================================================================
// ADDITIONAL PROFILER LOADERS
// =============================================================================

/**
 * Load countries data
 * @returns {Promise<Object>} Countries data
 */
export async function loadCountries() {
  await simulateDelay();
  return countriesData;
}

/**
 * Load made-in-country data
 * @param {string} countryId - Country ID
 * @returns {Promise<Object>} Made in country data
 */
export async function loadMadeInCountry(countryId = '') {
  await simulateDelay();
  return madeInCountryData;
}

/**
 * Load inventory data
 * @param {string} entityId - Entity ID
 * @returns {Promise<Object>} Inventory data
 */
export async function loadInventory(entityId = '') {
  await simulateDelay();
  return inventoryData;
}

/**
 * Load ORBAT data
 * @param {string} entityId - Entity ID
 * @returns {Promise<Object>} ORBAT data
 */
export async function loadOrbat(entityId = '') {
  await simulateDelay();
  return orbatData;
}

/**
 * Load ORBAT data filtered by country
 * @param {string[]} countries - Array of country names to filter
 * @returns {Promise<Object>} ORBAT data filtered by country
 */
export async function loadOrbatByCountry(countries = []) {
  await simulateDelay();

  // If no countries specified, return all data
  if (!countries || countries.length === 0) {
    return orbatData;
  }

  // Filter ORBAT data by country
  const filteredResult = (orbatData.result || []).filter(item => {
    const itemCountry = item.country || '';
    return countries.some(c =>
      c.toLowerCase() === itemCountry.toLowerCase()
    );
  });

  return {
    ...orbatData,
    result: filteredResult,
    total_count: filteredResult.length
  };
}

/**
 * Load military operated equipment data
 * @param {string} entityId - Entity ID
 * @returns {Promise<Object>} Military operated equipment data
 */
export async function loadMilitaryOperatedEquipment(entityId = '') {
  await simulateDelay();
  return militaryOperatedEquipmentData;
}

/**
 * Load military group installation data
 * @param {string} entityId - Entity ID
 * @returns {Promise<Object>} Military group installation data
 */
export async function loadMilitaryGroupInstallation(entityId = '') {
  await simulateDelay();
  return militaryGroupInstallationData;
}

/**
 * Load manufacturer details (basic - for manufacturer API)
 * @param {string} manufacturerId - Manufacturer ID
 * @returns {Promise<Object>} Manufacturer details data
 */
export async function loadManufacturerDetails(manufacturerId = '') {
  await simulateDelay();
  return manufacturerDetailsData;
}

/**
 * Load manufacturer details full (with equipment_types - for manufacturer_details API)
 * @param {string} manufacturerId - Manufacturer ID
 * @returns {Promise<Object>} Manufacturer details data with equipment_types
 */
export async function loadManufacturerDetailsFull(manufacturerId = '') {
  await simulateDelay();
  return manufacturerDetailsFullData;
}

/**
 * Load news profile data
 * @param {string} entityId - Entity ID
 * @returns {Promise<Object>} News profile data
 */
export async function loadNewsProfile(entityId = '') {
  await simulateDelay();
  return newsProfileData;
}

/**
 * Load images data
 * @param {string} entityId - Entity ID
 * @returns {Promise<Object>} Images data
 */
export async function loadImages(entityId = '') {
  await simulateDelay();
  return imagesData;
}

/**
 * Load event profile data (formerly equipment_event)
 * @param {string} entityId - Entity ID
 * @returns {Promise<Object>} Event profile data
 */
export async function loadEquipmentEvent(entityId = '') {
  await simulateDelay();
  return eventProfileData;
}

/**
 * Load graph query data
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Graph query data
 */
export async function loadGraphQuery(params = {}) {
  await simulateDelay();
  return graphQueryData;
}

// =============================================================================
// SEARCH LOADERS (for SearchPage)
// =============================================================================

/**
 * Load autocomplete suggestions
 * @param {string} keyword - Search keyword
 * @returns {Promise<Object>} Autocomplete data
 */
export async function loadAutocompleteData(keyword = '') {
  await simulateDelay(150);

  if (!keyword || keyword.length < 3) {
    return { titles: [], events: [] };
  }

  const lowerKeyword = keyword.toLowerCase();
  const titles = autocompleteData.title.filter(t =>
    t.toLowerCase().includes(lowerKeyword)
  );
  const events = autocompleteData.entity_name.filter(e =>
    e.toLowerCase().includes(lowerKeyword)
  );

  return {
    titles: titles.length > 0 ? titles : autocompleteData.title,
    events: events.length > 0 ? events : autocompleteData.entity_name
  };
}

/**
 * Expand a small set of base records to fill totalHits by cycling with unique IDs.
 * This ensures dummy pagination works properly.
 */
function expandRecords(baseRecords, totalHits) {
  if (baseRecords.length >= totalHits) return baseRecords.slice(0, totalHits);
  const expanded = [];
  for (let i = 0; i < totalHits; i++) {
    const base = baseRecords[i % baseRecords.length];
    expanded.push({ ...base, id: `${base.id}-pg${Math.floor(i / baseRecords.length)}-${i}` });
  }
  return expanded;
}

/**
 * Load news search data
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} News data
 */
export async function loadNewsData(params = {}) {
  await simulateDelay();

  const { size = 20, lastdocid = '' } = params;
  const allRecords = expandRecords(newsData.records, newsData.totalHits);
  const offset = lastdocid ? parseInt(lastdocid.split('-').pop() || '0') : 0;
  const records = allRecords.slice(offset, offset + size);
  const hasMore = (offset + size) < allRecords.length;

  return {
    records: records.map(record => ({
      id: record.id,
      title: record.title,
      summary: record.summary,
      date: record.lastModifiedDate,
      index: record.index,
      imageurl: record.image
    })),
    country: newsData.country,
    org: newsData.organization,
    nsag: newsData.nsag,
    total: allRecords.length,
    hasMore,
    lastdocid: hasMore ? `news-2024-001-${offset + size}` : ''
  };
}

/**
 * Load events search data
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Events data
 */
export async function loadEventsData(params = {}) {
  await simulateDelay();

  const { size = 20, lastdocid = '' } = params;
  const allRecords = expandRecords(eventsData.records, eventsData.totalHits);
  const offset = lastdocid ? parseInt(lastdocid.split('-').pop() || '0') : 0;
  const records = allRecords.slice(offset, offset + size);
  const hasMore = (offset + size) < allRecords.length;

  return {
    records: records.map(record => ({
      id: record.id,
      title: record.title,
      summary: record.summary,
      date: record.lastModifiedDate,
      index: record.index,
      imageurl: record.imageurl
    })),
    eventcountry: eventsData.country,
    eventcategory: eventsData.category,
    eventlocation: eventsData.location,
    platforms: eventsData.platforms,
    actorlabel: eventsData.actorLabel,
    actornation: eventsData.actorNation,
    actortype: eventsData.actorType,
    total: allRecords.length,
    hasMore,
    lastdocid: hasMore ? `event-2024-001-${offset + size}` : ''
  };
}

/**
 * Load intelligence briefings search data
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Intelligence data
 */
export async function loadIntelligenceData(params = {}) {
  await simulateDelay();

  const { size = 20, lastdocid = '' } = params;
  const allRecords = expandRecords(intelligenceData.records, intelligenceData.totalHits);
  const offset = lastdocid ? parseInt(lastdocid.split('-').pop() || '0') : 0;
  const records = allRecords.slice(offset, offset + size);
  const hasMore = (offset + size) < allRecords.length;

  return {
    records: records.map(record => ({
      id: record.id,
      title: record.title,
      summary: record.summary,
      date: record.lastModifiedDate,
      index: 'intelligence briefings',
      imageurl: record.image
    })),
    country: intelligenceData.country,
    org: intelligenceData.organization,
    nsag: intelligenceData.nsag,
    total: allRecords.length,
    hasMore,
    lastdocid: hasMore ? `intel-2024-001-${offset + size}` : ''
  };
}

/**
 * Load equipment search data
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Equipment data
 */
export async function loadEquipmentData(params = {}) {
  await simulateDelay();

  const { size = 80, lastdocid = '' } = params;
  const allRecords = expandRecords(equipmentSearchData.records, equipmentSearchData.totalHits);
  const offset = lastdocid ? parseInt(lastdocid.split('-').pop() || '0') : 0;
  const records = allRecords.slice(offset, offset + size);
  const hasMore = (offset + size) < allRecords.length;

  return {
    records: records.map(record => ({
      id: record.id,
      title: record.title,
      summary: record.summary,
      date: record.lastModifiedDate,
      index: record.index
    })),
    total: allRecords.length,
    hasMore,
    lastdocid: hasMore ? `equipment-2024-001-${offset + size}` : ''
  };
}

/**
 * Load combined search data
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Combined data
 */
export async function loadCombinedData(params = {}) {
  await simulateDelay();

  const { size = 20, lastdocid = '' } = params;
  const allRecords = expandRecords(combinedData.records, combinedData.totalHits);
  const offset = lastdocid ? parseInt(lastdocid.split('-').pop() || '0') : 0;
  const records = allRecords.slice(offset, offset + size);
  const hasMore = (offset + size) < allRecords.length;

  return {
    records: records.map(record => ({
      id: record.id,
      title: record.title,
      summary: record.summary,
      date: record.lastModifiedDate,
      index: record.index,
      imageurl: record.imageurl
    })),
    country: combinedData.country,
    org: combinedData.organization,
    nsag: combinedData.nsag,
    eventcountry: combinedData.eventcountry,
    eventcategory: combinedData.category,
    eventlocation: combinedData.location,
    platforms: combinedData.platforms,
    actorlabel: combinedData.actorLabel,
    actornation: combinedData.actorNation,
    actortype: combinedData.actorType,
    total: allRecords.length,
    hasMore,
    lastdocid: hasMore ? `combined-2024-001-${offset + size}` : ''
  };
}

/**
 * Load military search data
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Military data
 */
export async function loadMilitaryData(params = {}) {
  await simulateDelay();

  const { size = 20, lastdocid = '' } = params;
  const allRecords = expandRecords(militarySearchData.records, militarySearchData.totalHits);
  const offset = lastdocid ? parseInt(lastdocid.split('-').pop() || '0') : 0;
  const records = allRecords.slice(offset, offset + size);
  const hasMore = (offset + size) < allRecords.length;

  return {
    records: records.map(record => ({
      id: record.id,
      title: record.title,
      summary: generateMilitarySummary(record),
      date: record.lastModifiedDate,
      index: record.index,
      branch: record.branch,
      echelon: record.echelon,
      indigenousEchelon: record.indigenousEchelon,
      orbat: record.orbat
    })),
    total: allRecords.length,
    hasMore,
    lastdocid: hasMore ? `military-2024-001-${offset + size}` : ''
  };
}

// Helper function for military summary
function generateMilitarySummary(record) {
  const sentences = [];
  if (record.branch?.label) {
    sentences.push(`This military unit operates under the ${record.branch.label} branch.`);
  }
  if (record.echelon?.label) {
    sentences.push(`Organized at the ${record.echelon.label} level.`);
  }
  if (record.indigenousEchelon) {
    sentences.push(`Classified as ${record.indigenousEchelon}.`);
  }
  if (sentences.length < 2) {
    sentences.push('This unit maintains operational readiness and strategic defense capabilities.');
  }
  return sentences.join(' ');
}

/**
 * Get all available filter options
 * @returns {Object} All filter options
 */
export function getAllFilters() {
  return {
    news: {
      country: newsData.country,
      organization: newsData.organization,
      nsag: newsData.nsag
    },
    events: {
      country: eventsData.country,
      location: eventsData.location,
      category: eventsData.category,
      actorType: eventsData.actorType,
      actorLabel: eventsData.actorLabel,
      actorNation: eventsData.actorNation,
      platforms: eventsData.platforms
    },
    intelligence: {
      country: intelligenceData.country,
      organization: intelligenceData.organization,
      nsag: intelligenceData.nsag
    }
  };
}

// =============================================================================
// RAW DATA EXPORTS (for advanced usage)
// =============================================================================

export const rawData = {
  // Search data
  autocomplete: autocompleteData,
  news: newsData,
  events: eventsData,
  intelligence: intelligenceData,
  combined: combinedData,
  equipmentSearch: equipmentSearchData,
  militarySearch: militarySearchData,

  // Profile data
  equipmentProfile: equipmentProfileData,
  militaryGroupProfile: militaryGroupProfileData,
  eventProfile: eventProfileData,
  imoProfile: imoProfileData,
  portProfile: portProfileData,
  installationProfile: installationProfileData,

  // List data
  imoList: imoListData,
  portList: portListData,
  installationList: installationListData,
  entitySearch: entitySearchData,

  // News data
  newsHeadlines: newsHeadlinesData,
  newsDetails: newsDetailsData,

  // Additional data
  countries: countriesData,
  madeInCountry: madeInCountryData,
  inventory: inventoryData,
  orbat: orbatData,
  militaryOperatedEquipment: militaryOperatedEquipmentData,
  militaryGroupInstallation: militaryGroupInstallationData,
  manufacturerDetails: manufacturerDetailsData,
  newsProfile: newsProfileData,
  images: imagesData,
  equipmentEvent: eventProfileData,
  graphQuery: graphQueryData,
  searchKeywords: searchKeywordsData,
  searchAutocomplete: searchAutocompleteData,
  lastUpdated: lastUpdatedData
};

// =============================================================================
// DEFAULT EXPORT
// =============================================================================

export default {
  USE_DUMMY_DATA,

  // Profile loaders
  loadEquipmentProfile,
  loadMilitaryGroupProfile,
  loadEventProfile,
  loadImoProfile,
  loadPortProfile,
  loadInstallationProfile,
  loadOrganizationProfile,

  // List loaders
  loadImoList,
  loadPortList,
  loadInstallationList,
  loadOrganizationList,
  loadEntitySearch,

  // News loaders
  loadNewsHeadlines,
  loadNewsDetails,
  loadLastUpdatedDate,

  // Additional profiler loaders
  loadCountries,
  loadMadeInCountry,
  loadInventory,
  loadOrbat,
  loadOrbatByCountry,
  loadMilitaryOperatedEquipment,
  loadMilitaryGroupInstallation,
  loadManufacturerDetails,
  loadManufacturerDetailsFull,
  loadNewsProfile,
  loadImages,
  loadEquipmentEvent,
  loadGraphQuery,

  // Search loaders
  loadAutocompleteData,
  loadNewsData,
  loadEventsData,
  loadIntelligenceData,
  loadEquipmentData,
  loadCombinedData,
  loadMilitaryData,
  getAllFilters,

  // Raw data
  rawData
};
