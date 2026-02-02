
import { API_ENDPOINTS } from "../config/apiEndpoints";
import urlsMap from "./urlsMap";
import { postJSON } from "../utils/fetchWrapper";
import logger from "../utils/errorLogger";
import { NODE_COLORS, EDGE_COLORS, getNodeColor, getEdgeColor } from "../theme";
import { generateNewRecords } from "../data/dummyGraphData";
import { USE_DUMMY_DATA } from "../config/appMode";

// Graph API Service for handling Neo4j data operations
// Uses centralized config for URLs (supports .env and LAN environments)

const API_BASE_URL = API_ENDPOINTS.GRAPH.QUERY || urlsMap.graphService;
const profilerServiceUrl = urlsMap.profilerService;

let EntityIdMap = {};

// Debug logging (only in development)
if (import.meta.env.DEV) {
  console.log("Graph API Base URL:", API_BASE_URL);
  console.log("Profiler Service URL:", profilerServiceUrl);
}

// Entity types for filtering (matching Neo4j node labels)
export const ENTITY_TYPES = [
  { value: 'MilitaryGroup', label: 'Military Group' },
  { value: 'Organization', label: 'Organization' },
  { value: 'NonStateGroup', label: 'Non-State Group' },
  { value: 'Imo', label: 'IMO' },
  { value: 'Port', label: 'PORT' },
  { value: 'Mmsi', label: 'MMSI' }
];

// Generic function to fetch entities by type for dropdown
export const fetchEntitiesByType = async (entityType) => {
  try {
    const cypherQuery = `MATCH (n:${entityType}) RETURN n.name LIMIT 25`;

    const requestBody = {
      cypher_query: cypherQuery,
      parameters: {
        additionalProp1: {},
        additionalProp2: {},
        additionalProp3: {}
      },
      page_identifier: 0,
      size: 0,
      enable_pagination: true,
      count_query: "string"
    };

    const data = await postJSON(API_BASE_URL, requestBody, {}, { maxRetries: 2 });

    if (data.status_code === 200 && data.result) {
      return data.result.map(item => item['n.name']).filter(name => name);
    }

    return [];
  } catch (error) {
    logger.logApiError('fetchEntitiesByType', 'POST', error, { entityType });
    console.error('Error fetching entities:', error.message || error);
    return [];
  }
};

function buildLabelEntityMap(data) {
 data.result.map(item => {
 if(!(item.label in EntityIdMap)) {
   EntityIdMap[item.label]=item.entity_id;
 }
 });
// [item.label,item.entity_id]));
// console.log("hello:",EntityIdMap);
}

// Autocomplete function for entity search with keyword filtering
export const searchEntityByKeyword = async (entityType, keyword = '') => {
  try {
    const requestBody = {
      req_id: '',
      user_id: '',
      entity_type: entityType,
      keyword: keyword
    };

    const data = await postJSON(
      profilerServiceUrl + "/entity_search",
      requestBody,
      {},
      { maxRetries: 2 }
    );

    buildLabelEntityMap(data);
    return data.result.map(item => item.label);
  } catch (error) {
    logger.logApiError('searchEntityByKeyword', 'POST', error, { entityType, keyword });
    console.error(`Error fetching ${entityType}:`, error.message || error);
    return [];
  }
};

// Fetch all MilitaryGroup names for dropdown
export const fetchMilitaryGroups = async () => {
  return fetchEntitiesByType('MilitaryGroup');
};

// Fetch all Organization names for dropdown
export const fetchOrganizations = async () => {
  return fetchEntitiesByType('Organization');
};

// Fetch all NonStateGroup names for dropdown
export const fetchNonStateGroups = async () => {
  return fetchEntitiesByType('NonStateGroup');
};


export const fetchIMO = async () => {
  return fetchEntitiesByType('IMO');
};

export const fetchPORT = async () => {
  return fetchEntitiesByType('PORT');
};

export const fetchMMSI = async () => {
  return fetchEntitiesByType('MMSI');
};
// Search entities using Neo4j API
export const searchEntities = async (query, entityType) => {
  try {
    const cypherQuery = `MATCH (n:${entityType}) WHERE n.name CONTAINS $query RETURN n.name LIMIT 25`;

    const requestBody = {
      cypher_query: cypherQuery,
      parameters: {
        query: query
      },
      page_identifier: 0,
      size: 25,
      enable_pagination: false,
      count_query: ""
    };

    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();

    if (data.status_code === 200 && data.result) {
      return data.result.map(item => item['n.name']).filter(name => name);
    }

    return [];
  } catch (error) {
    console.error('Error searching entities:', error);
    return [];
  }
};

// NODE_COLORS, EDGE_COLORS, getNodeColor, and getEdgeColor are now imported from centralized theme
// Re-export them here so existing imports still work
export { NODE_COLORS, EDGE_COLORS, getNodeColor, getEdgeColor };

// Helper function for random colors (used by getNodeColor from theme)
function getRandomColor() {
  return '#' + Math.floor(Math.random() * 16777215).toString(16);
}

// Transform Neo4j API response to graph format
const transformNeo4jResponse = (apiResponse) => {
  const nodes = new Map();
  const links = [];

  // Use the exported node colors
  const nodeColors = NODE_COLORS;

  apiResponse.result.forEach(item => {
    const { n, rel, dest } = item;

    // Add source node (n)
    if (n && n.properties && n.properties.id) {
      const nodeId = n.properties.id;
      if (!nodes.has(nodeId)) {
        const nodeType = n.labels && n.labels[0] ? n.labels[0] : 'Unknown';
        nodes.set(nodeId, {
          id: nodeId,
          name: n.properties.name || n.properties.label || nodeId,
          type: nodeType,
          category: nodeType,
          color: nodeColors[nodeType] || getRandomColor(), // '#95a5a6',
          size: 8,
          properties: n.properties,
          labels: n.labels
        });
      }
    }

    // Add destination node (dest)
    if (dest && dest.properties && dest.properties.id) {
      const nodeId = dest.properties.id;
      if (!nodes.has(nodeId)) {
        const nodeType = dest.labels && dest.labels[0] ? dest.labels[0] : 'Unknown';
        nodes.set(nodeId, {
          id: nodeId,
          name: dest.properties.name || dest.properties.label || nodeId,
          type: nodeType,
          category: nodeType,
          color: nodeColors[nodeType] ||getRandomColor(), // '#95a5a6',
          size: 6,
          properties: dest.properties,
          labels: dest.labels
        });
      }
    }

    // Add relationship (rel) - relationships might not have properties
    if (rel && n && n.properties && n.properties.id && dest && dest.properties && dest.properties.id) {
      const relType = rel.type || 'related';

      // Check for self-loop (same source and target)
      const isSelfLoop = n.properties.id === dest.properties.id;

      links.push({
        source: n.properties.id,
        target: dest.properties.id,
        type: relType,
        color: getEdgeColor(relType),
        strength: 0.5,
        properties: rel.properties || {},
        isSelfLoop: isSelfLoop
      });
    }
  });

  return {
    nodes: Array.from(nodes.values()),
    links: links,
    totalCount: apiResponse.totalCount || apiResponse.total_count || nodes.size // Use totalCount from API response
  };
};

// Fetch graph data using Neo4j API
// Uses global USE_DUMMY_DATA flag for consistency
export const fetchGraphData = async (entityType, entityValue, offset = 0, limit = 50) => {
  // If using dummy data, generate records instead of calling API
  if (USE_DUMMY_DATA) {
    if (import.meta.env.DEV) console.log(`Using dummy data for graph: ${entityType} - ${entityValue}`);
    const newData = generateNewRecords(limit);
    return newData;
  }

  try {
    let cypherQuery;
    const skip = offset > 0 ? `SKIP ${offset}` : '';

    if (entityType === 'node_explore') {
      // For exploring a specific node - use proper Neo4j syntax with node ID filter
      cypherQuery = `MATCH (n {id: "${entityValue}"})-[rel]->(dest) RETURN n,rel,dest ${skip} LIMIT ${limit}`;
    } else if (entityValue && entityValue.trim()) {
      // For specific entity search - use exact match for all entity types
      if (entityType === 'Port')
        cypherQuery = `MATCH (n:${entityType} {place_name:"${entityValue}"})-[rel]->(dest) RETURN n,rel,dest ${skip} LIMIT ${limit}`;
      else if (entityType === 'Mmsi')
        cypherQuery = `MATCH (n:${entityType} {mmsi:"${entityValue}"})-[rel]-(dest) RETURN n,rel,dest ${skip} LIMIT ${limit}`;
      else if (entityType === 'Imo')
        cypherQuery = `MATCH (n:${entityType} {imo:"${entityValue}"})-[rel]->(dest) RETURN n,rel,dest ${skip} LIMIT ${limit}`;
      else
      {
        var entityId = EntityIdMap[entityValue];
        if (import.meta.env.DEV) console.log("entityValue", entityId);
        cypherQuery = `MATCH (n:${entityType} {id:"${entityId}"})-[rel]->(dest)
         WITH n, rel, dest,["related_to", "orbats", "assets", "asset_usage", "location_location_country"] as exclude_rels
                  WHERE (NOT type(rel) IN exclude_rels)
                  RETURN n, rel, dest
                  ${skip} LIMIT ${limit}`;
       }
    } else {
      // For general search by entity type (fallback)
      if (entityType === 'Mmsi')
        cypherQuery = `MATCH (n:${entityType})<-[rel]-(dest) RETURN n,rel,dest ${skip} LIMIT ${limit}`;
      else if (entityType === 'Imo' || entityType === 'Port')
      cypherQuery = `MATCH (n:${entityType})-[rel]->(dest) RETURN n,rel,dest ${skip} LIMIT ${limit}`;
      else
        cypherQuery = `MATCH (n:${entityType})-[rel]->(dest)
         WITH n, rel, dest,["related_to","orbats", "assets", "asset_usage", "location_location_country"] as exclude_rels
         WHERE (NOT type(rel) IN exclude_rels)
         RETURN n, rel, dest
         ${skip} LIMIT ${limit}`;
    }

    const requestBody = {
      cypher_query: cypherQuery,
      parameters: {},
      page_identifier: offset / limit,
      size: limit,
      enable_pagination: true,
      count_query: ""
    };

    const data = await postJSON(API_BASE_URL, requestBody, {}, { maxRetries: 2 });

    if (data.status_code === 200 && data.result) {
      return transformNeo4jResponse(data);
    }

    return { nodes: [], links: [], totalCount: 0 };
  } catch (error) {
    logger.logApiError('fetchGraphData', 'POST', error, { entityType, entityValue });
    console.error('Error fetching graph data:', error.message || error);
    return { nodes: [], links: [], totalCount: 0 };
  }
};

// New function for exploring nodes by type and value (name)
// Uses global USE_DUMMY_DATA flag for consistency
export const fetchRelatedNodes = async (nodeType, nodeValue, useDummyData = USE_DUMMY_DATA, offset = 0, limit = 50) => {
  try {
    // If using dummy data (global flag or override), generate new records instead of calling API
    if (useDummyData || USE_DUMMY_DATA) {
      if (import.meta.env.DEV) console.log(`Exploring node: ${nodeType} - ${nodeValue}, generating 20 new dummy records (offset: ${offset})`);
      const newData = generateNewRecords(20);
      return newData;
    }

    // Original API logic with pagination support
    const skip = offset > 0 ? `SKIP ${offset}` : '';
    const cypherQuery = `
      MATCH (n:${nodeType} {id: "${nodeValue}"})
      OPTIONAL MATCH (n)-[rel1]->(dest)
      OPTIONAL MATCH (src)-[rel2]->(n)
      OPTIONAL MATCH (n)-[selfrel]->(n)
      WITH n, rel1, dest, rel2, src, selfrel,["related_to","orbats", "assets", "asset_usage", "location_location_country"] as exclude_rels WHERE (NOT type(rel1) IN exclude_rels) AND (NOT type(rel2) IN exclude_rels)
      RETURN n, rel1, dest, rel2, src, selfrel ${skip} LIMIT ${limit}
    `;

    const requestBody = {
      cypher_query: cypherQuery,
      parameters: {},
      page_identifier: offset / limit,
      size: limit,
      enable_pagination: true,
      count_query: ""
    };

    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();

    if (data.status_code === 200 && data.result) {
      return transformRelatedNodesResponse(data);
    }

    return { nodes: [], links: [], totalCount: 0 };
  } catch (error) {
    console.error('Error fetching related nodes:', error);
    return { nodes: [], links: [], totalCount: 0 };
  }
};

// Transform the related nodes response
const transformRelatedNodesResponse = (apiResponse) => {
  const nodes = new Map();
  const links = [];
  const nodeColors = NODE_COLORS;

  apiResponse.result.forEach(item => {
    const { n, rel1, dest, rel2, src, selfrel } = item;

    // Add central node (n)
    if (n && n.properties && n.properties.id) {
      const nodeId = n.properties.id;
      if (!nodes.has(nodeId)) {
        const nodeType = n.labels && n.labels[0] ? n.labels[0] : 'Unknown';
        nodes.set(nodeId, {
          id: nodeId,
          name: n.properties.name || n.properties.label || nodeId,
          type: nodeType,
          category: nodeType,
          color: nodeColors[nodeType] || nodeColors.Unknown,
          size: 10, // Make central node larger
          properties: n.properties,
          labels: n.labels
        });
      }
    }

    // Add outgoing relationships (n)-[rel1]->(dest)
    if (dest && dest.properties && dest.properties.id) {
      const nodeId = dest.properties.id;
      if (!nodes.has(nodeId)) {
        const nodeType = dest.labels && dest.labels[0] ? dest.labels[0] : 'Unknown';
        nodes.set(nodeId, {
          id: nodeId,
          name: dest.properties.name || dest.properties.label || nodeId,
          type: nodeType,
          category: nodeType,
          color: nodeColors[nodeType] || nodeColors.Unknown,
          size: 6,
          properties: dest.properties,
          labels: dest.labels
        });
      }

      if (rel1 && n.properties.id) {
        const relType = rel1.type || 'related';
        links.push({
          source: n.properties.id,
          target: dest.properties.id,
          type: relType,
          color: getEdgeColor(relType),
          strength: 0.5,
          properties: rel1.properties || {}
        });
      }
    }

    // Add incoming relationships (src)-[rel2]->(n)
    if (src && src.properties && src.properties.id) {
      const nodeId = src.properties.id;
      if (!nodes.has(nodeId)) {
        const nodeType = src.labels && src.labels[0] ? src.labels[0] : 'Unknown';
        nodes.set(nodeId, {
          id: nodeId,
          name: src.properties.name || src.properties.label || nodeId,
          type: nodeType,
          category: nodeType,
          color: nodeColors[nodeType] || nodeColors.Unknown,
          size: 6,
          properties: src.properties,
          labels: src.labels
        });
      }

      if (rel2 && n.properties.id) {
        const relType = rel2.type || 'related';
        links.push({
          source: src.properties.id,
          target: n.properties.id,
          type: relType,
          color: getEdgeColor(relType),
          strength: 0.5,
          properties: rel2.properties || {}
        });
      }
    }

    // Add self-loop relationships (n)-[selfrel]->(n)
    if (selfrel && n.properties.id) {
      const relType = selfrel.type || 'self_related';
      links.push({
        source: n.properties.id,
        target: n.properties.id,
        type: relType,
        color: getEdgeColor(relType),
        strength: 0.5,
        properties: selfrel.properties || {},
        isSelfLoop: true // Flag to indicate this is a self-loop
      });
    }
  });

  return {
    nodes: Array.from(nodes.values()),
    links: links,
    totalCount: apiResponse.totalCount || apiResponse.total_count || nodes.size // Use totalCount from API response
  };
};

// Export graph data as CSV
export const exportToCSV = (graphData) => {
  if (!graphData) return;

  // Prepare nodes CSV
  const nodeHeaders = ['ID', 'Name', 'Type', 'Category', 'Status', 'Connections', 'Description'];
  const nodeRows = graphData.nodes.map(node => [
    node.id,
    node.name || node.id,
    node.type || '',
    node.category || '',
    node.status || '',
    node.connections || 0,
    (node.description || '').replace(/,/g, ';') // Replace commas to avoid CSV issues
  ]);

  const nodesCSV = [nodeHeaders, ...nodeRows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');

  // Prepare links CSV
  const linkHeaders = ['Source', 'Target', 'Type', 'Strength'];
  const linkRows = graphData.links.map(link => [
    link.source.id || link.source,
    link.target.id || link.target,
    link.type || '',
    link.strength || 0
  ]);

  const linksCSV = [linkHeaders, ...linkRows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');

  // Create and download files
  const downloadCSV = (content, filename) => {
    const blob = new Blob([content], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  downloadCSV(nodesCSV, `graph-nodes-${Date.now()}.csv`);
  downloadCSV(linksCSV, `graph-links-${Date.now()}.csv`);
};

// Export graph as PNG - Fallback method
export const exportToPNG = (graphRef) => {
  if (import.meta.env.DEV) console.log('Using fallback PNG export method...');

  if (!graphRef.current) {
    console.error('Graph reference is not available');
    alert('Graph reference not available for export.');
    return;
  }

  try {
    let canvas = null;

    if (import.meta.env.DEV) console.log('Searching for canvas element...');

    // Method 1: Try all canvases on page and pick the largest one
    const allCanvases = document.querySelectorAll('canvas');
    if (import.meta.env.DEV) console.log('Found canvases on page:', allCanvases.length);

    if (allCanvases.length > 0) {
      // Find the largest canvas (most likely the graph)
      canvas = Array.from(allCanvases).reduce((largest, current) => {
        const largestArea = largest.width * largest.height;
        const currentArea = current.width * current.height;
        return currentArea > largestArea ? current : largest;
      });

      if (import.meta.env.DEV) console.log('Selected canvas:', canvas.width, 'x', canvas.height);
    }

    // Method 2: Try accessing through graph reference
    if (!canvas && graphRef.current.getGraphRef) {
      const graphInstance = graphRef.current.getGraphRef();
      if (graphInstance && graphInstance.graphDiv) {
        const graphDiv = graphInstance.graphDiv().current;
        if (graphDiv) {
          canvas = graphDiv.querySelector('canvas');
          if (import.meta.env.DEV) console.log('Canvas found via graph instance:', canvas);
        }
      }
    }

    // Method 3: Direct access from ref
    if (!canvas && graphRef.current.graphDiv) {
      const graphDiv = graphRef.current.graphDiv().current;
      if (graphDiv) {
        canvas = graphDiv.querySelector('canvas');
        if (import.meta.env.DEV) console.log('Canvas found via direct ref:', canvas);
      }
    }

    if (canvas) {
      if (import.meta.env.DEV) console.log('Canvas found, creating export...');
      if (import.meta.env.DEV) console.log('Canvas size:', canvas.width, 'x', canvas.height);

      // Check if canvas has content
      const ctx = canvas.getContext('2d');
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const hasContent = imageData.data.some(pixel => pixel !== 0);

      if (!hasContent) {
        console.warn('⚠️ Canvas appears to be empty');
        alert('Warning: Canvas appears to be empty. The export may be blank.');
      }

      // Create a new canvas with proper background
      const exportCanvas = document.createElement('canvas');
      exportCanvas.width = canvas.width;
      exportCanvas.height = canvas.height;
      const exportCtx = exportCanvas.getContext('2d');

      // Fill background with white
      exportCtx.fillStyle = '#ffffff';
      exportCtx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);

      // Draw the original canvas on top
      exportCtx.drawImage(canvas, 0, 0);

      // Create download link
      const link = document.createElement('a');
      link.download = `graph-fallback-export-${Date.now()}.png`;
      link.href = exportCanvas.toDataURL('image/png');

      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      if (import.meta.env.DEV) console.log('Fallback export completed successfully');
    } else {
      console.error('❌ Could not find any canvas element for PNG export');
      alert('Unable to export graph. No canvas element found on the page.');
    }
  } catch (error) {
    console.error('❌ Error in fallback export:', error);
    alert('Fallback export failed: ' + error.message);
  }
};


// Append explore data to existing graph
export const appendExploreDataToGraph = (currentGraphData, newGraphData) => {
  if (!currentGraphData || !newGraphData) return newGraphData || currentGraphData;

  const existingNodes = new Map();
  const existingLinks = new Set();

  // Track existing nodes
  currentGraphData.nodes.forEach(node => {
    existingNodes.set(node.id, node);
  });

  // Track existing links
  currentGraphData.links.forEach(link => {
    const sourceId = link.source.id || link.source;
    const targetId = link.target.id || link.target;
    existingLinks.add(`${sourceId}-${targetId}`);
    existingLinks.add(`${targetId}-${sourceId}`); // Bidirectional tracking
  });

  // Add new nodes (only if they don't exist)
  newGraphData.nodes.forEach(node => {
    if (!existingNodes.has(node.id)) {
      existingNodes.set(node.id, node);
    }
  });

  // Add new links (only if they don't exist)
  const mergedLinks = [...currentGraphData.links];
  newGraphData.links.forEach(link => {
    const sourceId = link.source.id || link.source;
    const targetId = link.target.id || link.target;
    const linkKey = `${sourceId}-${targetId}`;

    if (!existingLinks.has(linkKey)) {
      mergedLinks.push(link);
      existingLinks.add(linkKey);
      existingLinks.add(`${targetId}-${sourceId}`);
    }
  });

  return {
    nodes: Array.from(existingNodes.values()),
    links: mergedLinks
  };
};