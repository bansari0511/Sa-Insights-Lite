import { API_ENDPOINTS } from "../config/apiEndpoints";
import urlsMap from "./urlsMap";
import { postJSON } from '../utils/fetchWrapper';
import logger from '../utils/errorLogger';

// Import dummy data loader
import {
  USE_DUMMY_DATA,
  loadAutocompleteData,
  loadNewsData,
  loadEventsData,
  loadIntelligenceData,
  loadEquipmentData,
  loadCombinedData,
  loadMilitaryData
} from '../data/dummyDataLoader';

// Search API service for search functionality
// Uses centralized config for URLs (supports .env and LAN environments)

// Get URLs from centralized config with urlsMap fallback for LAN compatibility
const searchKeywordUrl = API_ENDPOINTS.SEARCH.KEYWORDS || urlsMap.searchKeywords;
const AutoCompleteUrl = API_ENDPOINTS.SEARCH.AUTOCOMPLETE || urlsMap.searchAutoComplete;

// Mock delay to simulate network request
const simulateNetworkDelay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

// Debug logging (only in development)
if (import.meta.env.DEV) {
  logger.debug("Search API Initialized", {
    endpoints: API_ENDPOINTS.SEARCH,
    searchKeywordUrl,
    useDummyData: USE_DUMMY_DATA
  });
}

// Search suggestions API - returns dummy suggestions
export async function fetchSearchSuggestions(keyword) {
  if (!keyword || keyword.length < 3) {
    return { titles: [], events: [] };
  }

  // Use dummy data if enabled
  if (USE_DUMMY_DATA) {
    const result = await loadAutocompleteData(keyword);
    return result;
  }

  // API call with error handling
  try {
    const data = await postJSON(AutoCompleteUrl, { keyword }, {}, { maxRetries: 1, timeout: 10000 });
    return {
      titles: data.title || [],
      events: data.entity_name || []
    };
  } catch (error) {
    logger.logApiError(AutoCompleteUrl, 'POST', error, { keyword });
    return { titles: [], events: [] }; // Return empty on error for autocomplete
  }
}


// Dummy events data with lastdocid simulation
const generateEventsData = (keywords, size, lastdocid = '') => {
  const eventTypes = [
    'Tech Conference', 'Business Summit', 'Research Symposium', 
    'Industry Workshop', 'Innovation Forum', 'Leadership Meeting',
    'Training Session', 'Product Launch', 'Networking Event', 'Awards Ceremony'
  ];
  
  // Use lastdocid to determine starting offset for simulation
  const offset = lastdocid ? parseInt(lastdocid.split('-').pop() || '0') : 0;
  
  return Array.from({ length: size }, (_, i) => ({
    id: `event-${Date.now()}-${offset + i}`,
    title: `${keywords || eventTypes[(offset + i) % eventTypes.length]} - ${new Date().getFullYear() + ((offset + i) % 2)}`,
    summary: `Join industry leaders and experts at this exclusive ${keywords || eventTypes[(offset + i) % eventTypes.length].toLowerCase()} event. Discover cutting-edge innovations, network with professionals, and gain insights into future trends and opportunities in the field.`,
    date: new Date(Date.now() + Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    imageurl: `https://picsum.photos/400/250?random=${Date.now() + offset + i + 100}`,
    index: 'event'
  }));
};

// News API with dummy data
export async function fetchNewsData({
  keywords = '',
  filters = { country: [], org: [], nsag: [] },
  fromdate = '',
  todate = '',
  size = 6,
  lastdocid = '',
  req_id = ''
}) {
  // Use dummy data if enabled
  if (USE_DUMMY_DATA) {
    await simulateNetworkDelay();
    return await loadNewsData({ size, lastdocid });
  }

  // API call with error handling
  try {
    const reqFilterValues = filters.country.concat(filters.org, filters.nsag);
    const data = await postJSON(searchKeywordUrl, {
      keywords,
      filters: reqFilterValues,
      req_id,
      fromDate: fromdate,
      toDate: todate,
      size: 20,
      page: "news",
      lastdocid,
    }, {}, { maxRetries: 2, timeout: 30000 });

    const records = (data.records || []).map((record) => {
      const { id, title, lastModifiedDate, summary, index, image } = record;
      return { id, title, summary, date: lastModifiedDate, index, imageurl: image };
    });

    return {
      records,
      country: data.country || [],
      org: data.organization || [],
      nsag: data.nsag || [],
      total: data.totalHits || 0,
      hasMore: records.length === size,
      lastdocid: data.nextFetch || ''
    };
  } catch (error) {
    logger.logApiError(searchKeywordUrl, 'POST', error, { keywords, page: 'news' });
    throw error; // Re-throw to let UI handle it
  }
}

// Events API with dummy data
export async function fetchEventsData({
  keywords = '',
  filters = {
    eventcountry: [],
    eventcategory: [],
    eventlocation: [],
    platforms: [],
    actorlabel: [],
    actornation: [],
    actortype: []
  },
  fromdate = '',
  todate = '',
  size = 6,
  lastdocid = '',
  req_id = ''
}) {
  // Use dummy data if enabled
  if (USE_DUMMY_DATA) {
    await simulateNetworkDelay();
    return await loadEventsData({ size, lastdocid });
  }

  // API call with error handling
  try {
    const data = await postJSON(searchKeywordUrl, {
      keywords,
      eventFilters: filters,
      req_id: "",
      lastdocid: lastdocid,
      fromDate: fromdate,
      toDate: todate,
      size: 20,
      page: "events"
    }, {}, { maxRetries: 2, timeout: 30000 });

    const records = (data.records || []).map((record) => {
      const { id, title, lastModifiedDate, summary, index, imageurl } = record;
      return { id, title, summary, date: lastModifiedDate, index, imageurl };
    });

    return {
      records,
      eventcountry: data.country || [],
      eventcategory: data.category || [],
      eventlocation: data.location || [],
      platforms: data.platforms || [],
      actorlabel: data.actorLabel || [],
      actornation: data.actorNation || [],
      actortype: data.actorType || [],
      total: data.totalHits || 0,
      hasMore: records.length === size,
      lastdocid: data.lastDocId || ''
    };
  } catch (error) {
    logger.logApiError(searchKeywordUrl, 'POST', error, { keywords, page: 'events' });
    throw error;
  }
}

// Intelligence API with dummy data
export async function fetchIntelligenceData({
  keywords = '',
  filters = { country: [], org: [], nsag: [] },
  fromdate = '',
  todate = '',
  size = 6,
  lastdocid = '',
  req_id = ''
}) {
  // Use dummy data if enabled
  if (USE_DUMMY_DATA) {
    await simulateNetworkDelay();
    return await loadIntelligenceData({ size, lastdocid });
  }

  // API call with error handling
  try {
    const reqFilterValues = filters.country.concat(filters.org, filters.nsag);
    const data = await postJSON(searchKeywordUrl, {
      keywords,
      filters: reqFilterValues,
      req_id,
      fromDate: fromdate,
      toDate: todate,
      size: 20,
      page: "intelligence",
      lastdocid,
    }, {}, { maxRetries: 2, timeout: 30000 });

    const records = (data.records || []).map((record) => {
      const { id, title, lastModifiedDate, summary, image } = record;
      return { id, title, summary, date: lastModifiedDate, index: "intelligence briefings", imageurl: image };
    });

    return {
      records,
      country: data.country || [],
      org: data.organization || [],
      nsag: data.nsag || [],
      total: data.totalHits || 0,
      hasMore: records.length === size,
      lastdocid: data.nextFetch || ''
    };
  } catch (error) {
    logger.logApiError(searchKeywordUrl, 'POST', error, { keywords, page: 'intelligence' });
    throw error;
  }
}

// Equipment API with dummy data
export async function fetchEquipmentData({
  keywords = '',
  filters = {},
  fromdate = '',
  todate = '',
  size = 6,
  lastdocid = '',
  req_id = ''
}) {
  // Use dummy data if enabled
  if (USE_DUMMY_DATA) {
    await simulateNetworkDelay();
    return await loadEquipmentData({ size, lastdocid });
  }

  // API call with error handling
  try {
    const data = await postJSON(searchKeywordUrl, {
      keywords,
      filters,
      req_id,
      fromDate: fromdate,
      toDate: todate,
      size: 20,
      page: "equipment",
      lastdocid,
    }, {}, { maxRetries: 2, timeout: 30000 });

    const records = (data.records || []).map((record) => {
      const { id, title, lastModifiedDate, summary } = record;
      return { id, title, summary, date: lastModifiedDate, index: "equipment" };
    });

    return {
      records,
      total: data.totalHits || 0,
      hasMore: records.length === size,
      lastdocid: data.nextFetch || ''
    };
  } catch (error) {
    logger.logApiError(searchKeywordUrl, 'POST', error, { keywords, page: 'equipment' });
    throw error;
  }
}

// Helper function to generate paragraph-style summary from military data fields
function generateMilitarySummary(record) {
  const sentences = [];

  // First sentence - introduce the unit with branch
  if (record.branch?.label) {
    sentences.push(`This military unit operates under the ${record.branch.label} branch of the armed forces.`);
  }

  // Second sentence - echelon information
  if (record.echelon?.label) {
    sentences.push(`It is organized at the ${record.echelon.label} level within the military hierarchy.`);
  }

  // Third sentence - indigenous echelon
  if (record.indigenousEchelon) {
    sentences.push(`The unit is classified as a ${record.indigenousEchelon} according to indigenous military designation standards.`);
  }

  // Fourth and fifth sentences - ORBAT details
  if (record.orbat && record.orbat.length > 0) {
    const orbatEntry = record.orbat[0];
    if (orbatEntry.unitType) {
      sentences.push(`The primary unit type is ${orbatEntry.unitType}, which defines its core operational capabilities.`);
    }
    if (orbatEntry.operationalDomain || orbatEntry.operationalDomainType) {
      const domainInfo = orbatEntry.operationalDomain || orbatEntry.operationalDomainType;
      sentences.push(`Its operational domain falls within ${domainInfo}, enabling specialized mission execution in this area.`);
    }
  }

  // If we have very few sentences, add a generic closing
  if (sentences.length < 3) {
    sentences.push(`This unit plays a significant role in maintaining operational readiness and strategic defense capabilities.`);
  }

  return sentences.join(' ');
}

// Military API with dummy data
export async function fetchMilitaryData({
  keywords = '',
  fromdate = '',
  todate = '',
  size = 6,
  lastdocid = '',
  req_id = ''
}) {
  // Use dummy data if enabled
  if (USE_DUMMY_DATA) {
    await simulateNetworkDelay();
    return await loadMilitaryData({ size, lastdocid });
  }

  // API call with error handling
  try {
    const data = await postJSON(searchKeywordUrl, {
      keywords,
      req_id,
      fromDate: fromdate,
      toDate: todate,
      size: 20,
      page: "military",
      lastdocid,
    }, {}, { maxRetries: 2, timeout: 30000 });

    const records = (data.records || []).map((record) => {
      const { id, title, lastModifiedDate, branch, echelon, indigenousEchelon, orbat } = record;
      return {
        id, title,
        summary: generateMilitarySummary(record),
        date: lastModifiedDate,
        index: "military-groups",
        branch, echelon, indigenousEchelon, orbat
      };
    });

    return {
      records,
      total: data.totalHits || 0,
      hasMore: records.length === size,
      lastdocid: data.lastDocId || ''
    };
  } catch (error) {
    logger.logApiError(searchKeywordUrl, 'POST', error, { keywords, page: 'military' });
    throw error;
  }
}

// Combined API for both news and events
export async function fetchCombinedData({
  keywords = '',
  newsFilters = { country: [], org: [], nsag: [] },
  eventFilters = {
    eventcountry: [],
    eventcategory: [],
    eventlocation: [],
    platforms: [],
    actorlabel: [],
    actornation: [],
    actortype: []
  },
  fromdate = '',
  todate = '',
  size = 6,
  lastdocid = '',
  req_id = ''
}) {
  // Use dummy data if enabled
  if (USE_DUMMY_DATA) {
    await simulateNetworkDelay();
    return await loadCombinedData({ size, lastdocid });
  }

  // API call with error handling
  try {
    const newsFilterValues = newsFilters.country.concat(newsFilters.org, newsFilters.nsag);
    const allfilters = {
      relatedTo: newsFilterValues,
      eventcountry: eventFilters.eventcountry,
      eventcategory: eventFilters.eventcategory,
      eventlocation: eventFilters.eventlocation,
      platforms: eventFilters.platforms,
      actorlabel: eventFilters.actorlabel,
      actornation: eventFilters.actornation,
      actortype: eventFilters.actortype
    };

    const data = await postJSON(searchKeywordUrl, {
      keywords,
      eventFilters: allfilters,
      req_id: "",
      lastdocid: lastdocid,
      fromDate: fromdate,
      toDate: todate,
      size: 20,
      page: ""
    }, {}, { maxRetries: 2, timeout: 30000 });

    const records = (data.records || []).map((record) => {
      let { id, lastModifiedDate, title, summary, index, imageurl } = record;
      index = (index === 'analysis') ? 'intelligence briefings' : index;
      return { id, title, summary, date: lastModifiedDate, index, imageurl };
    });

    return {
      records,
      country: data.country || [],
      org: data.organization || [],
      nsag: data.nsag || [],
      eventcountry: data.eventcountry || [],
      eventcategory: data.category || [],
      eventlocation: data.location || [],
      platforms: data.platforms || [],
      actorlabel: data.actorLabel || [],
      actornation: data.actorNation || [],
      actortype: data.actorType || [],
      total: data.totalHits || 0,
      hasMore: records.length === size,
      lastdocid: data.lastDocId || ''
    };
  } catch (error) {
    logger.logApiError(searchKeywordUrl, 'POST', error, { keywords, page: 'combined' });
    throw error;
  }
}

// Article detail API with dummy data
export async function fetchArticleDetail(id, title) {
  await simulateNetworkDelay();
  
  // Generate detailed article content based on ID and title
  const sampleContent = {
    paragraphs: [
      `In a groundbreaking development that could reshape the landscape of ${title.includes('Technology') ? 'technology' : title.includes('Event') ? 'industry events' : 'global markets'}, recent analysis reveals significant trends that are capturing the attention of experts worldwide.`,
      
      `According to leading researchers and industry analysts, the implications of these findings extend far beyond initial expectations. The comprehensive study, conducted over several months, has uncovered patterns that suggest a fundamental shift in how we approach ${title.includes('AI') ? 'artificial intelligence' : title.includes('Summit') ? 'professional networking' : 'business operations'}.`,
      
      `"This represents a pivotal moment in our industry," said Dr. Sarah Johnson, a leading expert in the field. "The data we're seeing indicates that organizations need to adapt quickly to these emerging trends to remain competitive in today's rapidly evolving marketplace."`,
      
      `The research methodology involved extensive data collection from multiple sources, including surveys from over 10,000 participants, market analysis spanning five years, and case studies from Fortune 500 companies. The results paint a clear picture of transformation across multiple sectors.`,
      
      `Key findings from the study include a 45% increase in adoption rates, significant improvements in efficiency metrics, and overwhelmingly positive feedback from early adopters. These statistics underscore the importance of staying ahead of industry curves.`,
      
      `Implementation strategies vary depending on organizational size and sector, but common themes emerge around the importance of stakeholder engagement, strategic planning, and phased rollout approaches. Companies that have successfully navigated this transition report substantial benefits.`,
      
      `Looking forward, industry experts predict continued growth and evolution in this space. The next 12-18 months will be crucial for organizations looking to capitalize on these emerging opportunities while mitigating potential risks.`,
      
      `As the situation continues to develop, stakeholders are advised to stay informed about the latest developments and consider how these trends might impact their specific circumstances. Professional consultation and strategic planning will be essential for successful adaptation.`
    ],
    
    keyPoints: [
      'Comprehensive analysis reveals significant industry trends',
      '45% increase in adoption rates across multiple sectors',
      'Expert consensus on the need for rapid organizational adaptation',
      'Successful implementation requires strategic planning and stakeholder engagement',
      'Next 12-18 months identified as crucial period for market positioning'
    ],
    
    relatedTopics: [
      'Industry Transformation Strategies',
      'Digital Innovation Trends',
      'Market Analysis and Forecasting',
      'Organizational Change Management',
      'Strategic Planning Best Practices'
    ],
    
    sources: [
      'International Journal of Industry Analysis',
      'Global Market Research Institute',
      'Strategic Planning Quarterly',
      'Technology Trends Magazine',
      'Business Transformation Review'
    ]
  };
  
  return {
    id,
    title,
    content: sampleContent.paragraphs.join('\n\n'),
    keyPoints: sampleContent.keyPoints,
    relatedTopics: sampleContent.relatedTopics,
    sources: sampleContent.sources,
    publishDate: new Date().toISOString().split('T')[0],
    author: 'Editorial Team',
    category: title.includes('Event') ? 'Events' : 'News',
    readTime: '8 min read',
    tags: title.split(' ').slice(0, 3).map(word => word.toLowerCase()),
    imageUrl: `https://picsum.photos/800/400?random=${id}`,
    views: Math.floor(Math.random() * 5000) + 1000,
    shares: Math.floor(Math.random() * 500) + 50
  };
}