import urls from "./urlsMap";

// Import dummy data loader
import {
  USE_DUMMY_DATA,
  loadAutocompleteData,
  loadNewsData,
  loadEventsData,
  loadIntelligenceData,
  //loadEquipmentData,
  loadCombinedData,
  //loadMilitaryData
} from '../data/dummyDataLoader';

// Dummy data service for search functionality
// Replace these functions with actual API calls when backend is ready

// Mock delay to simulate network request
const searchKeywordUrl = urls.searchKeywords;
const AutoCompleteUrl = urls.searchAutoComplete;
const assetsBaseUrl = urls.assetsService || '';
const simulateNetworkDelay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

console.log("urls", urls);
console.log("search url", searchKeywordUrl);
console.log("USE_DUMMY_DATA:", USE_DUMMY_DATA);

// Search suggestions API - returns dummy suggestions
export async function fetchSearchSuggestions(keyword) {
  console.log('fetchSearchSuggestions called with keyword:', keyword);
  await simulateNetworkDelay(150);

  if (!keyword || keyword.length < 3) {
    console.log('Keyword too short, returning empty results');
    return { titles: [], events: [] };
  }

  // Use dummy data if enabled
  if (USE_DUMMY_DATA) {
    console.log('Using dummy data, calling loadAutocompleteData');
    const result = await loadAutocompleteData(keyword);
    console.log('loadAutocompleteData returned:', result);
    return result;
  }

  // Original API call
  const res = await fetch(AutoCompleteUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      keyword
    }),
  });

  const data = await res.json();
  const titles = data.title;
  const entity = data.entity_name;


  return {
    titles,
    events: entity
  };
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
  await simulateNetworkDelay();

  // Use dummy data if enabled
  if (USE_DUMMY_DATA) {
    return await loadNewsData({ size, lastdocid });
  }

  // Original API call
  const reqFilterValues = filters.country.concat(filters.org, filters.nsag);
  const response = await fetch(searchKeywordUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      keywords,
      filters: reqFilterValues,
      req_id,
      fromDate: fromdate,
      toDate: todate,
      size: 20,
      page: "news",
      lastdocid,
    }),
  });

  const data = await response.json();



  // console.log("allRecords", allRecords);
  const country = data.country;
  const org = data.organization;
  const nsag = data.nsag;


  const records = data.records.map((record) => {
    const { id, title, lastModifiedDate, summary, index, image } = record;
    const date = lastModifiedDate;
    // const imageurl = image;

    let imageurl;
    if (assetsBaseUrl && image) {
      imageurl = image.replaceAll("/Intara_Image_Asset_new", assetsBaseUrl);
    }
    if (typeof image === 'string' && image.includes('<data')) {
      const match = imageurl.match(/value="([^"]+)"/);
      return match ? match[1] : '';
    }


    return { id, title, summary, date, index, imageurl };
  });
  const total = data.totalHits;
  const hasMore = (records.length === size) ? true : false;


  const newLastDocId = data.lastDocId;
  console.log("docid", newLastDocId);

  return {
    records,
    country,
    org,
    nsag,
    total,
    hasMore,
    lastDocId: newLastDocId
  };
}


export async function fetchProfilesData({
  keywords = '',
  filters = { country: [], org: [], nsag: [] },
  fromdate = '',
  todate = '',
  size = 6,
  lastdocid = '',
  req_id = ''
}) {
  await simulateNetworkDelay();

  // Use dummy data if enabled
  if (USE_DUMMY_DATA) {
    return await loadNewsData({ size, lastdocid });
  }

  // Original API call
  const reqFilterValues = filters.country.concat(filters.org, filters.nsag);
  const response = await fetch(searchKeywordUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      keywords,
      filters: reqFilterValues,
      req_id,
      fromDate: fromdate,
      toDate: todate,
      size: 20,
      page: "profile",
      lastdocid,
    }),
  });

  const data = await response.json();



  // console.log("allRecords", allRecords);
  const country = data.country;
  const org = data.organization;
  const nsag = data.nsag;


  const records = data.records.map((record) => {
    const { id, title, lastModifiedDate, summary, index, image } = record;
    const date = lastModifiedDate;
    // const imageurl = image;

    let imageurl;
    if (assetsBaseUrl && image) {
      imageurl = image.replaceAll("/Intara_Image_Asset_new", assetsBaseUrl);
    }
    if (typeof image === 'string' && image.includes('<data')) {
      const match = imageurl.match(/value="([^"]+)"/);
      return match ? match[1] : '';
    }


    return { id, title, summary, date, index, imageurl };
  });
  const total = data.totalHits;
  const hasMore = (records.length === size) ? true : false;


  const newLastDocId = data.lastDocId;
  console.log("docid", newLastDocId);

  return {
    records,
    country,
    org,
    nsag,
    total,
    hasMore,
    lastDocId: newLastDocId
  };
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
  await simulateNetworkDelay();

  // Use dummy data if enabled
  if (USE_DUMMY_DATA) {
    return await loadEventsData({ size, lastdocid });
  }

  // Original API call
  const response = await fetch(searchKeywordUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      keywords,
      eventFilters: filters,
      req_id: "",
      lastdocid: lastdocid,
      fromDate: fromdate,
      toDate: todate,
      size: 20,
      page: "events"

    }),
  });

  const data = await response.json();

  const { country, location, category, actorType, actorLabel, actorNation, platforms } = data;

  console.log("data:", data);



  const records = data.records.map((record) => {
    const { id, title, lastModifiedDate, summary, index, imageurl } = record;

    const date = lastModifiedDate;

    let imageurlNew;
    if (assetsBaseUrl && imageurl) {
      imageurlNew = imageurl.replaceAll("/Intara_Image_Asset_new", assetsBaseUrl);
    }
    if (typeof imageurl === 'string' && imageurl.includes('<data')) {
      const match = imageurlNew.match(/value="([^"]+)"/);
      return match ? match[1] : '';
    }

    return { id, title, summary, date, index, imageurl: imageurlNew };
  });
  const total = data.totalHits;

  const hasMore = (records.length === size) ? true : false;
  const newLastDocId = data.lastDocId;

  return {
    records,
    eventcountry: country,
    eventcategory: category,
    eventlocation: location,
    platforms: platforms,
    actorlabel: actorLabel,
    actornation: actorNation,
    actortype: actorType,
    total,
    hasMore,
    lastDocId: newLastDocId
  };
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
  await simulateNetworkDelay();

  // Use dummy data if enabled
  if (USE_DUMMY_DATA) {
    return await loadIntelligenceData({ size, lastdocid });
  }

  // Original API call
  const reqFilterValues = filters.country.concat(filters.org, filters.nsag);
  const response = await fetch(searchKeywordUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      keywords,
      filters: reqFilterValues,
      req_id,
      fromDate: fromdate,
      toDate: todate,
      size: 20,
      page: "intelligence",
      lastdocid,
    }),
  });

  const data = await response.json();



  // console.log("allRecords", allRecords);
  const country = data.country;
  const org = data.organization;
  const nsag = data.nsag;


  const records = data.records.map((record) => {
    const { id, title, lastModifiedDate, summary, image } = record;
    const date = lastModifiedDate;
    const index = "intelligence briefings";

    let imageurl;
    if (assetsBaseUrl && image) {
      imageurl = image.replaceAll("/Intara_Image_Asset_new", assetsBaseUrl);
    }
    if (typeof image === 'string' && image.includes('<data')) {
      const match = imageurl.match(/value="([^"]+)"/);
      return match ? match[1] : '';
    }

    return { id, title, summary, date, index, imageurl };
  });
  const total = data.totalHits;
  const hasMore = (records.length === size) ? true : false;


  const newLastDocId = data.lastDocId;
  console.log("docid", newLastDocId);

  return {
    records,
    country,
    org,
    nsag,
    total,
    hasMore,
    lastDocId: newLastDocId
  };
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
  await simulateNetworkDelay();

  // Use dummy data if enabled
  if (USE_DUMMY_DATA) {
    return await loadEquipmentData({ size, lastdocid });
  }

  // Original API call
  const response = await fetch(searchKeywordUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      keywords,
      req_id,
      fromDate: fromdate,
      toDate: todate,
      size: 20,
      page: "equipment",
      lastdocid,
    }),
  });

  const data = await response.json();

  const records = data.records.map((record) => {
    let { id, title, lastModifiedDate, summary, index } = record;
    const date = lastModifiedDate;
    //  const index = "equipment";
    if (index === 'military-groups')
      summary = generateMilitarySummary(record);

    if (index === 'non-state-group')
      summary = generateNSAGSummary(record);

    if (index === 'organization')
      summary = generateOrganizationSummary(record);

    if (index === 'installations')
      summary = generateInstallationsSummary(record);

    return { id, title, summary, date, index };
  });
  const total = data.totalHits;
  const hasMore = (records.length === size) ? true : false;

  const newLastDocId = data.lastDocId;

  return {
    records,
    total,
    hasMore,
    lastDocId: newLastDocId
  };
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

// Helper function to generate paragraph-style summary from NSAG data fields
function generateNSAGSummary(record) {
  const sentences = [];

  // First sentence - introduce the unit with branch
  if (record.title) {
    sentences.push(`This group is called as  ${record.title} .`);
  }

  // Second sentence - echelon information
  if (record.countryOrigin?.label) {
    sentences.push(`its orginated country is  ${record.countryOrigin.label} .`);
  }

  if (record.legacyJguid) {
    sentences.push(`its legacy Jgid is  ${record.legacyJguid} .`);
  }

  return sentences.join(' ');
}

function generateInstallationsSummary(record) {
  const sentences = [];

  // First sentence - introduce the unit with branch
  if (record.title) {
    sentences.push(`This orbat Installation  is called as  ${record.title} .`);
  }

  // Second sentence - echelon information
  if (record.operatedBy?.label) {
    sentences.push(`its operated by ${record.operatedBy.label} and belongs to the branch ${record.operatedBy.branch.label} .`);
  }

  if (record.installationType) {
    sentences.push(`its installationType is  ${record.installationType.label} .`);
  }

  return sentences.join(' ');
}


function generateOrganizationSummary(record) {
  const sentences = [];

  // First sentence - introduce the unit with branch
  if (record.label) {
    sentences.push(`This Organization  is called as  ${record.label} .`);
  }

  // Second sentence - echelon information
  if (record.headOrganization?.label) {
    sentences.push(`its headOrganization is  ${record.headOrganization.label} .`);
  }

  if (record.parentOrganization?.label) {
    sentences.push(`its parentOrganization is  ${record.parentOrganization.label} .`);
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
  await simulateNetworkDelay();

  // Use dummy data if enabled
  if (USE_DUMMY_DATA) {
    return await loadMilitaryData({ size, lastdocid });
  }

  // Original API call
  const response = await fetch(searchKeywordUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      keywords,
      req_id,
      fromDate: fromdate,
      toDate: todate,
      size: 20,
      page: "military",
      lastdocid,
    }),
  });

  const data = await response.json();

  const records = data.records.map((record) => {
    const { id, title, lastModifiedDate, branch, echelon, indigenousEchelon, orbat } = record;
    const date = lastModifiedDate;
    const index = "military-groups";
    const summary = generateMilitarySummary(record);

    return { id, title, summary, date, index, branch, echelon, indigenousEchelon, orbat };
  });
  const total = data.totalHits;
  const hasMore = (records.length === size) ? true : false;

  const newLastDocId = data.lastDocId;

  return {
    records,
    total,
    hasMore,
    lastDocId: newLastDocId
  };
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
  await simulateNetworkDelay();

  // Use dummy data if enabled
  if (USE_DUMMY_DATA) {
    return await loadCombinedData({ size, lastdocid });
  }

  // Original API call
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

  }

  const response = await fetch(searchKeywordUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      keywords,
      eventFilters: allfilters,
      req_id: "",
      lastdocid: lastdocid,
      fromDate: fromdate,
      toDate: todate,
      size: 20,
      page: "newsAll"

    }),
  });

  const data = await response.json();

  const { country, eventcountry, organization, nsag, location, category, actorType, actorLabel, actorNation, platforms } = data;

  console.log("data:", data);



  const records = data.records.map((record) => {
    let { id, lastModifiedDate, title, summary, index, imageurl } = record;

    index = (index === 'analysis') ? 'intelligence briefings' : index;

    const date = lastModifiedDate;
    let imageurlNew;
    if (assetsBaseUrl && imageurl) {
      imageurlNew = imageurl.replaceAll("/Intara_Image_Asset_new", assetsBaseUrl);
    }
    if (typeof imageurl === 'string' && imageurl.includes('<data')) {
      const match = imageurlNew.match(/value="([^"]+)"/);
      return match ? match[1] : '';
    }

    return { id, title, summary, date, index, imageurl: imageurlNew };
  });
  const total = data.totalHits;


  const hasMore = (records.length === size) ? true : false;
  const newLastDocId = data.lastDocId;

  return {
    records,
    // Combine all filter options
    country: country,
    org: organization,
    nsag: nsag,
    eventcountry: eventcountry,
    eventcategory: category,
    eventlocation: location,
    platforms: platforms,
    actorlabel: actorLabel,
    actornation: actorNation,
    actortype: actorType,
    total,
    hasMore,
    lastDocId: newLastDocId
  };
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