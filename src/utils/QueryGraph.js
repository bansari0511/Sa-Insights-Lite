import neo4j from 'neo4j-driver/lib/browser/neo4j-web.esm.min.js'
import urlsMap from "../services/urlsMap";
import { USE_DUMMY_DATA } from "../config/appMode";
import {
  loadEquipmentProfile,
  loadEquipmentList,
  loadMilitaryGroupProfile,
  loadMilitaryGroupList,
  loadEventProfile,
  loadEventList,
  loadInventory,
  loadOrbat,
  loadMilitaryOperatedEquipment,
  loadMilitaryGroupInstallation,
  loadImages,
  loadManufacturerDetails,
  loadManufacturerDetailsFull,
  loadNewsProfile,
  loadEquipmentEvent,
} from "../data/dummyDataLoader";

const profilerServiceUrl = urlsMap.profilerService

const queryGraph = async (neo4jURL, token, query) => {
  let driverParent = null;
  let sessionParent = null;

  try {
    driverParent = neo4j.driver(neo4jURL, token)
    sessionParent = driverParent.session();
    const response = await sessionParent.run(query)
    let res2 = {}
    res2.resultRows = response.records.map(a => ([...a._fields])).map(a => {
      const copy_a = []
      a.forEach(b => {
        const isJsonArray = Array.isArray(b) && b.length > 0 && b.every(item => typeof item === 'object' && item !== null && !Array.isArray(item));
        if (isJsonArray) {
          copy_a.push(b.map(c => ({ properties: c })))
        } else {
          copy_a.push(b)
        }
      })
      return copy_a
    })
    return res2
  } catch (error) {
    console.error('Error in queryGraph:', error);
    return { resultRows: [] };
  } finally {
    // Clean up resources
    if (sessionParent) {
      await sessionParent.close();
    }
    if (driverParent) {
      await driverParent.close();
    }
  }
};

// =============================================================================
// DUMMY DATA LOADER FOR QUERY API
// =============================================================================

// Helper: Transform value to match expected format (wrap with properties)
function transformValue(value) {
  if (value === null || value === undefined) {
    return [];
  }

  // If it's an array of objects, wrap each with { properties: {...} } if not already wrapped
  if (Array.isArray(value)) {
    if (value.length === 0) return [];
    if (typeof value[0] === 'object' && value[0] !== null) {
      return value.map(item => {
        // If item already has properties key, return as-is
        if (item.properties !== undefined) {
          return item;
        }
        return { properties: item };
      });
    }
    return value;
  }

  // If it's a single object, check if it already has a properties key
  if (typeof value === 'object' && value !== null) {
    // If already has properties key (like the 'e' object), return as-is
    if (value.properties !== undefined) {
      return value;
    }
    return { properties: value };
  }

  // Primitive values
  return value;
}

async function loadDummyDataForEndpoint(endpoint, entity_id) {
  try {
    let dummyData = null;
    let isListCall = !entity_id; // List call when entity_id is null/undefined

    // Map endpoint to dummy data loader
    switch (endpoint) {
      case 'equipment':
        // List call vs Profile call
        dummyData = isListCall ? await loadEquipmentList() : await loadEquipmentProfile(entity_id);
        break;
      case 'militarygroup':
      case 'military_group':
        // List call vs Profile call
        dummyData = isListCall ? await loadMilitaryGroupList() : await loadMilitaryGroupProfile(entity_id);
        break;
      case 'event':
        // List call vs Profile call
        dummyData = isListCall ? await loadEventList() : await loadEventProfile(entity_id);
        break;
      case 'inventory':
        dummyData = await loadInventory(entity_id);
        break;
      case 'orbat':
        dummyData = await loadOrbat(entity_id);
        break;
      case 'military_operated_equipment':
        dummyData = await loadMilitaryOperatedEquipment(entity_id);
        break;
      case 'military_group_installation':
        dummyData = await loadMilitaryGroupInstallation(entity_id);
        break;
      case 'images':
        dummyData = await loadImages(entity_id);
        break;
      case 'manufacturer':
        // Return manufacturer data directly in API response format (with result array)
        const manufacturerData = await loadManufacturerDetails(entity_id);
        return manufacturerData || { result: [] };
      case 'manufacturer_details':
        // Return manufacturer details with equipment_types
        const manufacturerDetailsFullResponse = await loadManufacturerDetailsFull(entity_id);
        return manufacturerDetailsFullResponse || { result: [] };
      case 'news_profile':
        // Transform news profile data to resultRows format to match component expectations
        // Component expects: res.resultRows.map(a => ({...a[0].properties}))
        const newsData = await loadNewsProfile(entity_id);
        if (newsData && newsData.result && Array.isArray(newsData.result)) {
          // Transform each result item to an array with the properties object
          const resultRows = newsData.result.map(item => {
            // The news_profile data has structure like { c: { properties: {...} } }
            // We need to return [[{properties: {...}}], ...]
            const rowData = [];
            for (let key in item) {
              rowData.push(item[key]);
            }
            return rowData;
          });
          return { resultRows };
        }
        return { resultRows: [] };
      case 'equipment_event':
      case 'event_profile':
        // Return event profile data directly in API response format
        // Response: { status_code, status_message, result: [{description, label, entity_type, last_modified_date}, ...] }
        const eventData = await loadEquipmentEvent(entity_id);
        return eventData || { result: [] };
      default:
        console.warn(`No dummy data loader for endpoint: ${endpoint}`);
        return { resultRows: [] };
    }

    // If the dummy data loader already provides resultRows, use them directly
    // (e.g., loadMilitaryGroupProfile returns pre-transformed resultRows)
    if (dummyData && dummyData.resultRows && dummyData.resultRows.length > 0) {
      return { resultRows: dummyData.resultRows };
    }

    // Transform dummy data to match queryAPI response format
    if (dummyData && dummyData.result && dummyData.result.length > 0) {
      // Check if result is simple arrays (list call) or objects (profile call)
      const firstItem = dummyData.result[0];
      const isSimpleArrayFormat = Array.isArray(firstItem);

      if (isSimpleArrayFormat) {
        // List format: result is array of arrays like [[id, name, type], ...]
        // Return as-is, no transformation needed
        return { resultRows: dummyData.result };
      } else {
        // Profile format: result is array of objects, transform with {properties}
        const resultRows = dummyData.result.map(obj => {
          const row = [];
          for (let key in obj) {
            row.push(transformValue(obj[key]));
          }
          return row;
        });
        return { resultRows };
      }
    }

    return { resultRows: [] };
  } catch (error) {
    console.error(`Error loading dummy data for endpoint ${endpoint}:`, error);
    return { resultRows: [] };
  }
}

// =============================================================================
// QUERY API - Supports both dummy data and real API calls
// =============================================================================
// entity_type parameter: Used for news_profile and event_profile endpoints
// Values: "equipment", "militarygroup", "installation", "organization", "nsag_actor"
export const queryAPI = async (endpoint, entity_id = null, filters = null, baseApiUrl = profilerServiceUrl, entity_type = null) => {
  // Use dummy data if flag is set
  if (USE_DUMMY_DATA) {
    return await loadDummyDataForEndpoint(endpoint, entity_id);
  }

  // Real API call
  try {
    const reqBody = {
      user_id: "Test",
      req_id: "req_id",
      entity_id: entity_id,
      filters: filters
    }

    // Add entity_type parameter for news_profile and event_profile endpoints
    if ((endpoint === 'news_profile' || endpoint === 'event_profile' || endpoint === 'equipment_event') && entity_type) {
      reqBody.entity_type = entity_type;
    }

    const resp = await fetch(`${baseApiUrl}/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reqBody),
    });

    if (!resp.ok) {
      throw new Error(`HTTP error! status: ${resp.status}`);
    }

    const data = await resp.json();

    // Special handling for event_profile/equipment_event - return data as-is without transformation
    // Response format: { status_code, result: [{label, description, entity_type, last_modified_date}, ...] }
    if (endpoint === 'event_profile' || endpoint === 'equipment_event') {
      return data;
    }

    const results = data.result || []
    const resultsArray = results.map(obj => {
      const objArray = []
      for (let key in obj) {
        objArray.push(obj[key])
      }
      return objArray
    });

    let res2 = {}
    res2.resultRows = resultsArray.map(a => {
      const copy_a = []
      a.forEach(b => {
        const isJsonArray = Array.isArray(b) && b.length > 0 && b.every(item => typeof item === 'object' && item !== null && !Array.isArray(item));
        if (isJsonArray) {
          copy_a.push(b.map(c => ({ properties: c })))
        } else {
          copy_a.push(b)
        }
      })

      return copy_a
    })
    return res2
  } catch (error) {
    console.error(`Error in queryAPI for endpoint ${endpoint}:`, error);
    return { resultRows: [] };
  }
}

export default queryGraph;