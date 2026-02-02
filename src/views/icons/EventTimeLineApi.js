// src/pages/dummyData.js
// Local-only dummy data loader: always uses src/resp.json and applies filters.
// No country API — everything is loaded from resp.json.

// <-- resp.json should live at src/resp.json
import urlsMap from "../../services/urlsMap";
import respData from "../../resp.json";

const profilerServiceUrl = urlsMap.profilerService
// small helper to parse date strings (returns Date or null)
function parseDate(d) {
  if (!d) return null;
  const dt = new Date(d);
  return isNaN(dt) ? null : dt;
}

// check if a date is between start and end (inclusive)
function inRange(dateStr, startStr, endStr) {
  const d = parseDate(dateStr);
  const s = parseDate(startStr);
  const e = parseDate(endStr);
  if (!d) return false;
  if (s && d < s) return false;
  if (e && d > e) return false;
  return true;
}

/**
 * filterLocalSource(source, filtersPayload)
 * Applies category and date filtering to the local JSON source.
 * Country filtering is supported if present in payload, but no external country API is used.
 * Returns shape: { result: [ ... ] }
 */
function filterLocalSource(source, filtersPayload = {}) {
  const sourceArr = Array.isArray(source) ? source.slice() : [];

  const filters = (filtersPayload && filtersPayload.filters) || {};
  // country filter will be applied if provided in payload, but we don't fetch countries from API
  const countryFilters = (filters.country_of_sovereignty || [])
    .map((c) => (c && c.label ? String(c.label).toLowerCase() : null))
    .filter(Boolean);
  const categoryFilters = (filters.event_category || [])
    .map((c) => (c && c.label ? String(c.label).toLowerCase() : null))
    .filter(Boolean);

  let startDate = null;
  let endDate = null;
  if (Array.isArray(filters.date_filter) && filters.date_filter.length > 0) {
    startDate = filters.date_filter[0].start_date || null;
    endDate = filters.date_filter[0].end_date || null;
  }

  const filtered = sourceArr.filter((item) => {
    try {
      const props = (item && item.e && item.e.properties) || {};
      const countryLabel = (item && item['c.label']) || props.country || '';
      const category = (props.event_category || props.type || '') || '';

      // country filter (only against data present in resp.json)
      if (countryFilters.length > 0) {
        const lowerCountry = String(countryLabel).toLowerCase();
        const matchCountry = countryFilters.some((c) => lowerCountry.includes(c));
        if (!matchCountry) return false;
      }

      // category filter
      if (categoryFilters.length > 0) {
        const lowerCat = String(category).toLowerCase();
        const matchCat = categoryFilters.some((c) => lowerCat.includes(c));
        if (!matchCat) return false;
      }

      // date filter (skip if using dummy data)
      if (startDate || endDate) {
        const sd = props.start_date || props.start || null;
        if (!inRange(sd, startDate, endDate)) {
          // temporarily disable strict date filtering for dummy JSON
          return true; // always include for now
        }
      }
      return true;
    } catch (err) {
      // On error exclude item
      return false;
    }
  });

  return { result: filtered };
}

/**
 * fetchEventsData(filtersPayload)
 * Loads data from local resp.json file and applies filters.
 * Can fallback to API if needed (currently using local data).
 * Returns Promise resolving to { result: [...] }.
 */
export async function fetchEventsData(filtersPayload = {}, useLocalData = true) {
  // simulate small latency
  await new Promise((r) => setTimeout(r, 200));

  // Option 1: Use local resp.json (default)
  if (useLocalData) {
    try {
      console.log('Loading events from local resp.json file...');

      // Extract result array from respData
      const sourceData = respData?.result || [];

      if (!Array.isArray(sourceData)) {
        console.warn('resp.json does not contain a valid result array');
        return { result: [] };
      }

      // Apply filters using the existing filterLocalSource function
      const filteredData = filterLocalSource(sourceData, filtersPayload);

      console.log(`Loaded ${sourceData.length} events, filtered to ${filteredData.result.length} events`);

      return filteredData;
    } catch (err) {
      console.error('Error loading from resp.json:', err);
      return { result: [] };
    }
  }

  // Option 2: Fallback to API (if useLocalData is false)
  try {
    console.log('Fetching events from API...');
    const resp = await fetch(profilerServiceUrl + '/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(filtersPayload || {}),
    });

    if (resp.ok) {
      const data = await resp.json();

      if (data && Array.isArray(data.result)) {
        console.log(`API returned ${data.result.length} events`);
        return data;
      }
      console.log("API data not formatted well!!");
    } else {
      console.warn('API request failed with status:', resp.status);
    }
  } catch (err) {
    console.warn("API error:", err);
  }

  return { result: [] };
}
