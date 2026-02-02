// ============================================
// DUMMY GRAPH DATA FOR TESTING
// ============================================
// This data represents a sample military intelligence graph
// Used for testing graph visualization without API connection

export const DUMMY_GRAPH_DATA = {
  totalCount: 150, // Total nodes available from backend (for pagination demo)
  nodes: [
    // Military Groups
    {
      id: "mg_001",
      name: "Alpha Force",
      type: "MilitaryGroup",
      category: "Armed Forces",
      status: "Active",
      description: "Elite military unit specialized in reconnaissance",
      color: "#27ae60",
      size: 8,
      lat: 35.1399,
      lon: -79.0075,
      properties: {
        display_name_label: "Alpha Force",
        country: "USA",
        established: "2010",
        strength: "500 personnel"
      }
    },
    {
      id: "mg_002",
      name: "Bravo Battalion",
      type: "MilitaryGroup",
      category: "Infantry",
      status: "Active",
      description: "Heavy infantry battalion",
      color: "#27ae60",
      size: 10,
      lat: 52.4093,
      lon: 0.5610,
      properties: {
        display_name_label: "Bravo Battalion",
        country: "UK",
        established: "2015",
        strength: "800 personnel"
      }
    },

    // Equipment
    {
      id: "eq_001",
      name: "M1 Abrams Tank",
      type: "Equipment",
      category: "Heavy Armor",
      status: "Operational",
      description: "Main battle tank",
      color: "#e67e22",
      size: 7,
      lat: 33.4484,
      lon: -112.0740,
      properties: {
        display_name_label: "M1 Abrams Tank",
        manufacturer: "General Dynamics",
        year: "1980",
        units: "50"
      }
    },
    {
      id: "eq_002",
      name: "F-35 Fighter Jet",
      type: "Equipment",
      category: "Aircraft",
      status: "Operational",
      description: "Stealth multirole fighter",
      color: "#e67e22",
      size: 9,
      lat: 34.0522,
      lon: -118.2437,
      properties: {
        display_name_label: "F-35 Fighter Jet",
        manufacturer: "Lockheed Martin",
        year: "2015",
        units: "25"
      }
    },
    {
      id: "eq_003",
      name: "AH-64 Apache",
      type: "Equipment",
      category: "Helicopter",
      status: "Operational",
      description: "Attack helicopter",
      color: "#e67e22",
      size: 6,
      lat: 47.6062,
      lon: -122.3321,
      properties: {
        display_name_label: "AH-64 Apache",
        manufacturer: "Boeing",
        year: "1986",
        units: "15"
      }
    },

    // Persons
    {
      id: "p_001",
      name: "General John Smith",
      type: "Person",
      category: "Military Officer",
      status: "Active",
      description: "Commander of Alpha Force",
      color: "#3498db",
      size: 8,
      lat: 38.9072,
      lon: -77.0369,
      properties: {
        display_name_label: "General John Smith",
        rank: "General",
        nationality: "American",
        service_years: "25"
      }
    },
    {
      id: "p_002",
      name: "Colonel Sarah Johnson",
      type: "Person",
      category: "Military Officer",
      status: "Active",
      description: "Deputy Commander",
      color: "#3498db",
      size: 6,
      lat: 39.7392,
      lon: -104.9903,
      properties: {
        display_name_label: "Colonel Sarah Johnson",
        rank: "Colonel",
        nationality: "American",
        service_years: "18"
      }
    },

    // Countries
    {
      id: "c_001",
      name: "United States",
      type: "Country",
      category: "Nation",
      status: "Active",
      description: "North American country",
      color: "#9b59b6",
      size: 12,
      lat: 38.9072,
      lon: -77.0369,
      properties: {
        display_name_label: "United States",
        region: "North America",
        population: "330 million",
        capital: "Washington DC"
      }
    },
    {
      id: "c_002",
      name: "United Kingdom",
      type: "Country",
      category: "Nation",
      status: "Active",
      description: "European country",
      color: "#9b59b6",
      size: 10,
      lat: 51.5074,
      lon: -0.1278,
      properties: {
        display_name_label: "United Kingdom",
        region: "Europe",
        population: "67 million",
        capital: "London"
      }
    },

    // Organizations
    {
      id: "org_001",
      name: "NATO",
      type: "Organization",
      category: "Military Alliance",
      status: "Active",
      description: "North Atlantic Treaty Organization",
      color: "#e74c3c",
      size: 11,
      lat: 50.8503,
      lon: 4.3517,
      properties: {
        display_name_label: "NATO",
        established: "1949",
        members: "31 countries",
        headquarters: "Brussels"
      }
    },

    // Locations
    {
      id: "loc_001",
      name: "Fort Bragg",
      type: "Location",
      category: "Military Base",
      status: "Active",
      description: "Major US Army installation",
      color: "#f39c12",
      size: 7,
      lat: 35.1399,
      lon: -79.0075,
      properties: {
        display_name_label: "Fort Bragg",
        country: "USA",
        state: "North Carolina",
        coordinates: "35.1399°N, 79.0075°W"
      }
    },
    {
      id: "loc_002",
      name: "RAF Lakenheath",
      type: "Location",
      category: "Air Force Base",
      status: "Active",
      description: "Royal Air Force station",
      color: "#f39c12",
      size: 6,
      lat: 52.4093,
      lon: 0.5610,
      properties: {
        display_name_label: "RAF Lakenheath",
        country: "UK",
        region: "Suffolk",
        coordinates: "52.4093°N, 0.5610°E"
      }
    },

    // Events
    {
      id: "evt_001",
      name: "Operation Shield",
      type: "Event",
      category: "Military Operation",
      status: "Completed",
      description: "Joint training exercise",
      color: "#16a085",
      size: 8,
      lat: 35.1399,
      lon: -79.0075,
      properties: {
        display_name_label: "Operation Shield",
        date: "2024-06-15",
        duration: "30 days",
        participants: "2000 personnel"
      }
    }
  ],

  links: [
    // Military Group relationships
    {
      source: "mg_001",
      target: "p_001",
      type: "commanded_by",
      color: "#2ecc71",
      width: 2,
      properties: {
        since: "2020-01-01",
        creation_date: "2020-01-01",
        last_modified_date: "2024-01-01"
      }
    },
    {
      source: "mg_001",
      target: "p_002",
      type: "has_officer",
      color: "#3498db",
      width: 1.5,
      properties: {
        since: "2021-03-15",
        creation_date: "2021-03-15",
        last_modified_date: "2024-01-01"
      }
    },
    {
      source: "mg_002",
      target: "p_001",
      type: "cooperates_with",
      color: "#9b59b6",
      width: 1.5,
      properties: {
        since: "2022-01-01",
        creation_date: "2022-01-01",
        last_modified_date: "2024-01-01"
      }
    },

    // Equipment relationships
    {
      source: "mg_001",
      target: "eq_001",
      type: "operates_equipment",
      color: "#e67e22",
      width: 2,
      properties: {
        quantity: "10 units",
        creation_date: "2020-06-01",
        last_modified_date: "2024-01-01"
      }
    },
    {
      source: "mg_001",
      target: "eq_002",
      type: "operates_equipment",
      color: "#e67e22",
      width: 2,
      properties: {
        quantity: "5 units",
        creation_date: "2021-01-01",
        last_modified_date: "2024-01-01"
      }
    },
    {
      source: "mg_002",
      target: "eq_003",
      type: "operates_equipment",
      color: "#e67e22",
      width: 2,
      properties: {
        quantity: "8 units",
        creation_date: "2022-03-01",
        last_modified_date: "2024-01-01"
      }
    },

    // Country relationships
    {
      source: "mg_001",
      target: "c_001",
      type: "based_in",
      color: "#c0392b",
      width: 2.5,
      properties: {
        creation_date: "2010-01-01",
        last_modified_date: "2024-01-01"
      }
    },
    {
      source: "mg_002",
      target: "c_002",
      type: "based_in",
      color: "#c0392b",
      width: 2.5,
      properties: {
        creation_date: "2015-01-01",
        last_modified_date: "2024-01-01"
      }
    },
    {
      source: "c_001",
      target: "org_001",
      type: "member_of",
      color: "#8e44ad",
      width: 3,
      properties: {
        since: "1949-04-04",
        creation_date: "1949-04-04",
        last_modified_date: "2024-01-01"
      }
    },
    {
      source: "c_002",
      target: "org_001",
      type: "member_of",
      color: "#8e44ad",
      width: 3,
      properties: {
        since: "1949-04-04",
        creation_date: "1949-04-04",
        last_modified_date: "2024-01-01"
      }
    },

    // Location relationships
    {
      source: "mg_001",
      target: "loc_001",
      type: "stationed_at",
      color: "#d35400",
      width: 2,
      properties: {
        since: "2010-01-01",
        creation_date: "2010-01-01",
        last_modified_date: "2024-01-01"
      }
    },
    {
      source: "mg_002",
      target: "loc_002",
      type: "stationed_at",
      color: "#d35400",
      width: 2,
      properties: {
        since: "2015-01-01",
        creation_date: "2015-01-01",
        last_modified_date: "2024-01-01"
      }
    },
    {
      source: "loc_001",
      target: "c_001",
      type: "located_in",
      color: "#16a085",
      width: 1.5,
      properties: {
        creation_date: "1918-01-01",
        last_modified_date: "2024-01-01"
      }
    },
    {
      source: "loc_002",
      target: "c_002",
      type: "located_in",
      color: "#16a085",
      width: 1.5,
      properties: {
        creation_date: "1941-01-01",
        last_modified_date: "2024-01-01"
      }
    },

    // Event relationships
    {
      source: "evt_001",
      target: "mg_001",
      type: "involves",
      color: "#27ae60",
      width: 2,
      properties: {
        role: "Primary participant",
        creation_date: "2024-06-15",
        last_modified_date: "2024-07-15"
      }
    },
    {
      source: "evt_001",
      target: "mg_002",
      type: "involves",
      color: "#27ae60",
      width: 2,
      properties: {
        role: "Supporting participant",
        creation_date: "2024-06-15",
        last_modified_date: "2024-07-15"
      }
    },
    {
      source: "evt_001",
      target: "loc_001",
      type: "took_place_at",
      color: "#f39c12",
      width: 1.5,
      properties: {
        creation_date: "2024-06-15",
        last_modified_date: "2024-07-15"
      }
    },

    // Person relationships
    {
      source: "p_001",
      target: "c_001",
      type: "citizen_of",
      color: "#2980b9",
      width: 1,
      properties: {
        creation_date: "1975-05-20",
        last_modified_date: "2024-01-01"
      }
    },
    {
      source: "p_002",
      target: "c_001",
      type: "citizen_of",
      color: "#2980b9",
      width: 1,
      properties: {
        creation_date: "1980-08-12",
        last_modified_date: "2024-01-01"
      }
    }
  ]
};

/**
 * Generate 20 new dummy records
 * Call this function each time to get new nodes and links
 */
let recordCounter = 100; // Start from 100 to avoid conflicts

export const generateNewRecords = (count = 20) => {
  const nodeTypes = [
    { type: 'MilitaryGroup', category: 'Armed Forces', color: '#27ae60', fields: ['country', 'established', 'strength'] },
    { type: 'Equipment', category: 'Military Hardware', color: '#e67e22', fields: ['manufacturer', 'year', 'units'] },
    { type: 'Person', category: 'Military Officer', color: '#3498db', fields: ['rank', 'nationality', 'service_years'] },
    { type: 'Country', category: 'Nation', color: '#9b59b6', fields: ['region', 'population', 'capital'] },
    { type: 'Organization', category: 'Alliance', color: '#e74c3c', fields: ['established', 'members', 'headquarters'] },
    { type: 'Location', category: 'Military Base', color: '#f39c12', fields: ['country', 'coordinates'] },
    { type: 'Event', category: 'Operation', color: '#16a085', fields: ['date', 'duration', 'participants'] }
  ];

  const linkTypes = [
    'commanded_by', 'has_officer', 'cooperates_with', 'operates_equipment',
    'based_in', 'member_of', 'stationed_at', 'located_in',
    'involves', 'took_place_at', 'citizen_of'
  ];

  const statuses = ['Active', 'Inactive', 'Operational', 'Completed'];
  const countries = ['USA', 'UK', 'France', 'Germany', 'Japan', 'Australia'];
  const ranks = ['General', 'Colonel', 'Major', 'Captain', 'Lieutenant'];
  const manufacturers = ['Lockheed Martin', 'Boeing', 'Northrop Grumman', 'BAE Systems', 'Raytheon'];

  const newNodes = [];
  const newLinks = [];

  // Generate nodes using loop
  for (let i = 0; i < count; i++) {
    recordCounter++;
    const nodeType = nodeTypes[Math.floor(Math.random() * nodeTypes.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const nodeId = `${nodeType.type.toLowerCase()}_${String(recordCounter).padStart(3, '0')}`;

    // Base node structure with random lat/lon
    const node = {
      id: nodeId,
      name: `${nodeType.type} ${recordCounter}`,
      type: nodeType.type,
      category: nodeType.category,
      status: status,
      description: `Generated ${nodeType.type.toLowerCase()} record`,
      color: nodeType.color,
      size: Math.floor(Math.random() * 6) + 6,
      lat: (Math.random() * 140) - 70, // Random latitude between -70 and 70
      lon: (Math.random() * 360) - 180, // Random longitude between -180 and 180
      properties: {
        display_name_label: `${nodeType.type} ${recordCounter}`
      }
    };

    // Add type-specific properties
    if (nodeType.type === 'MilitaryGroup') {
      node.properties.country = countries[Math.floor(Math.random() * countries.length)];
      node.properties.established = String(2000 + Math.floor(Math.random() * 24));
      node.properties.strength = `${Math.floor(Math.random() * 900) + 100} personnel`;
    } else if (nodeType.type === 'Equipment') {
      node.properties.manufacturer = manufacturers[Math.floor(Math.random() * manufacturers.length)];
      node.properties.year = String(1990 + Math.floor(Math.random() * 34));
      node.properties.units = String(Math.floor(Math.random() * 50) + 1);
    } else if (nodeType.type === 'Person') {
      node.properties.rank = ranks[Math.floor(Math.random() * ranks.length)];
      node.properties.nationality = ['American', 'British', 'French', 'German'][Math.floor(Math.random() * 4)];
      node.properties.service_years = String(Math.floor(Math.random() * 30) + 1);
    } else if (nodeType.type === 'Country') {
      node.properties.region = ['Europe', 'Asia', 'North America', 'Oceania'][Math.floor(Math.random() * 4)];
      node.properties.population = `${Math.floor(Math.random() * 300) + 10} million`;
      node.properties.capital = `Capital ${recordCounter}`;
    } else if (nodeType.type === 'Organization') {
      node.properties.established = String(1940 + Math.floor(Math.random() * 84));
      node.properties.members = `${Math.floor(Math.random() * 50) + 5} countries`;
      node.properties.headquarters = ['Brussels', 'Geneva', 'New York', 'Paris'][Math.floor(Math.random() * 4)];
    } else if (nodeType.type === 'Location') {
      node.properties.country = countries[Math.floor(Math.random() * countries.length)];
      node.properties.coordinates = `${(Math.random() * 90).toFixed(4)}°N, ${(Math.random() * 180).toFixed(4)}°W`;
    } else if (nodeType.type === 'Event') {
      const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
      const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
      node.properties.date = `2024-${month}-${day}`;
      node.properties.duration = `${Math.floor(Math.random() * 60) + 1} days`;
      node.properties.participants = `${Math.floor(Math.random() * 5000) + 100} personnel`;
    }

    newNodes.push(node);

    // Create 1-3 links for each node
    const numLinks = Math.floor(Math.random() * 3) + 1;
    for (let j = 0; j < numLinks; j++) {
      const linkType = linkTypes[Math.floor(Math.random() * linkTypes.length)];

      // Connect to either existing nodes or previously generated nodes in this batch
      let targetNodeId;
      if (i > 0 && Math.random() > 0.5) {
        // Connect to a previously generated node
        const targetIndex = Math.floor(Math.random() * i);
        targetNodeId = newNodes[targetIndex].id;
      } else {
        // Connect to original nodes
        const originalNodeIds = [
          'mg_001', 'mg_002', 'eq_001', 'eq_002', 'eq_003',
          'p_001', 'p_002', 'c_001', 'c_002', 'org_001',
          'loc_001', 'loc_002', 'evt_001'
        ];
        targetNodeId = originalNodeIds[Math.floor(Math.random() * originalNodeIds.length)];
      }

      newLinks.push({
        source: nodeId,
        target: targetNodeId,
        type: linkType,
        color: nodeType.color,
        width: Math.random() * 2 + 1,
        properties: {
          creation_date: new Date().toISOString().split('T')[0],
          last_modified_date: new Date().toISOString().split('T')[0]
        }
      });
    }
  }

  return {
    nodes: newNodes,
    links: newLinks,
    totalCount: count * 5 // Simulate that backend has more data available (5x the batch size)
  };
};