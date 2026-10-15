/**
 * Shared Icon Library for Event Mapping
 * Contains 70+ icon definitions and SVG generation
 */

// Comprehensive icon library - 70+ icons with context-based selection
export const ICON_LIBRARY = [
  // Attack/Combat Icons (Red variants)
  { id: 1, name: 'Explosion', color: '#DC3C3C', keywords: ['explosion', 'blast', 'bomb', 'ied', 'detonation'], icon: 'explosion' },
  { id: 2, name: 'Gunfire', color: '#E53935', keywords: ['shoot', 'fire', 'gunfire', 'rifle', 'weapon'], icon: 'gunfire' },
  { id: 3, name: 'Artillery', color: '#C62828', keywords: ['artillery', 'shell', 'mortar', 'cannon'], icon: 'artillery' },
  { id: 4, name: 'Airstrike', color: '#B71C1C', keywords: ['airstrike', 'bombing', 'aerial', 'drone strike'], icon: 'airstrike' },
  { id: 5, name: 'Ambush', color: '#D32F2F', keywords: ['ambush', 'surprise', 'assault'], icon: 'ambush' },

  // Military Operations (Orange/Yellow variants)
  { id: 6, name: 'Military Base', color: '#FF8C00', keywords: ['base', 'camp', 'garrison', 'installation'], icon: 'military_base' },
  { id: 7, name: 'Patrol', color: '#FF9800', keywords: ['patrol', 'reconnaissance', 'scout'], icon: 'patrol' },
  { id: 8, name: 'Convoy', color: '#FB8C00', keywords: ['convoy', 'transport', 'logistics'], icon: 'convoy' },
  { id: 9, name: 'Checkpoint', color: '#F57C00', keywords: ['checkpoint', 'roadblock', 'barrier'], icon: 'checkpoint' },
  { id: 10, name: 'Deployment', color: '#EF6C00', keywords: ['deploy', 'mobilize', 'position'], icon: 'deployment' },

  // Naval/Maritime (Blue variants)
  { id: 11, name: 'Naval Ship', color: '#1976D2', keywords: ['ship', 'naval', 'vessel', 'fleet'], icon: 'naval_ship' },
  { id: 12, name: 'Submarine', color: '#1565C0', keywords: ['submarine', 'underwater'], icon: 'submarine' },
  { id: 13, name: 'Port', color: '#0D47A1', keywords: ['port', 'harbor', 'dock'], icon: 'port' },
  { id: 14, name: 'Maritime', color: '#0277BD', keywords: ['maritime', 'sea', 'ocean'], icon: 'maritime' },

  // Air Force (Sky blue variants)
  { id: 15, name: 'Aircraft', color: '#2196F3', keywords: ['aircraft', 'plane', 'jet', 'fighter'], icon: 'aircraft' },
  { id: 16, name: 'Helicopter', color: '#42A5F5', keywords: ['helicopter', 'chopper', 'helo'], icon: 'helicopter' },
  { id: 17, name: 'Drone', color: '#1E88E5', keywords: ['drone', 'uav', 'unmanned'], icon: 'drone' },
  { id: 18, name: 'Airport', color: '#1976D2', keywords: ['airport', 'airfield', 'airbase'], icon: 'airport' },

  // Intelligence/Cyber (Purple variants)
  { id: 19, name: 'Intelligence', color: '#9C27B0', keywords: ['intelligence', 'spy', 'surveillance'], icon: 'intelligence' },
  { id: 20, name: 'Cyber', color: '#8E24AA', keywords: ['cyber', 'hack', 'digital', 'electronic'], icon: 'cyber' },
  { id: 21, name: 'Satellite', color: '#7B1FA2', keywords: ['satellite', 'space', 'orbital'], icon: 'satellite' },
  { id: 22, name: 'Radar', color: '#6A1B9A', keywords: ['radar', 'detection', 'tracking'], icon: 'radar' },

  // Communication/Diplomacy (Cyan variants)
  { id: 23, name: 'Communication', color: '#00BCD4', keywords: ['communication', 'message', 'signal'], icon: 'communication' },
  { id: 24, name: 'Meeting', color: '#00ACC1', keywords: ['meeting', 'conference', 'summit'], icon: 'meeting' },
  { id: 25, name: 'Statement', color: '#0097A7', keywords: ['statement', 'announcement', 'declaration'], icon: 'statement' },
  { id: 26, name: 'Negotiation', color: '#00838F', keywords: ['negotiation', 'talk', 'dialogue'], icon: 'negotiation' },

  // Terrorism/Insurgency (Dark red variants)
  { id: 27, name: 'Terrorist', color: '#B71C1C', keywords: ['terror', 'terrorist', 'insurgent'], icon: 'terrorist' },
  { id: 28, name: 'Kidnapping', color: '#C62828', keywords: ['kidnap', 'abduct', 'hostage'], icon: 'kidnapping' },
  { id: 29, name: 'IED', color: '#D32F2F', keywords: ['ied', 'improvised', 'roadside'], icon: 'ied' },
  { id: 30, name: 'Suicide Attack', color: '#E53935', keywords: ['suicide', 'kamikaze'], icon: 'suicide_attack' },

  // Personnel (Green variants)
  { id: 31, name: 'Soldier', color: '#388E3C', keywords: ['soldier', 'troop', 'personnel'], icon: 'soldier' },
  { id: 32, name: 'Commander', color: '#43A047', keywords: ['commander', 'general', 'officer'], icon: 'commander' },
  { id: 33, name: 'Special Forces', color: '#2E7D32', keywords: ['special', 'elite', 'commando'], icon: 'special_forces' },
  { id: 34, name: 'Casualty', color: '#1B5E20', keywords: ['casualty', 'wounded', 'injured', 'killed'], icon: 'casualty' },

  // Weapons/Equipment (Gray variants)
  { id: 35, name: 'Tank', color: '#616161', keywords: ['tank', 'armor', 'armored'], icon: 'tank' },
  { id: 36, name: 'Missile', color: '#757575', keywords: ['missile', 'rocket', 'ballistic'], icon: 'missile' },
  { id: 37, name: 'Artillery Gun', color: '#424242', keywords: ['gun', 'howitzer'], icon: 'artillery_gun' },
  { id: 38, name: 'Vehicle', color: '#9E9E9E', keywords: ['vehicle', 'truck', 'transport'], icon: 'vehicle' },

  // Facilities (Brown variants)
  { id: 39, name: 'Building', color: '#795548', keywords: ['building', 'structure', 'facility'], icon: 'building' },
  { id: 40, name: 'Warehouse', color: '#8D6E63', keywords: ['warehouse', 'storage', 'depot'], icon: 'warehouse' },
  { id: 41, name: 'Factory', color: '#6D4C41', keywords: ['factory', 'plant', 'industrial'], icon: 'factory' },
  { id: 42, name: 'Bunker', color: '#5D4037', keywords: ['bunker', 'shelter', 'fortification'], icon: 'bunker' },

  // Border/Security (Teal variants)
  { id: 43, name: 'Border', color: '#009688', keywords: ['border', 'frontier', 'boundary'], icon: 'border' },
  { id: 44, name: 'Guard Post', color: '#00897B', keywords: ['guard', 'post', 'watchtower'], icon: 'guard_post' },
  { id: 45, name: 'Fence', color: '#00796B', keywords: ['fence', 'wall', 'barrier'], icon: 'fence' },
  { id: 46, name: 'Security', color: '#00695C', keywords: ['security', 'protect', 'defense'], icon: 'security' },

  // Training/Exercise (Lime variants)
  { id: 47, name: 'Training', color: '#689F38', keywords: ['training', 'exercise', 'drill'], icon: 'training' },
  { id: 48, name: 'Test', color: '#7CB342', keywords: ['test', 'trial', 'experiment'], icon: 'test' },
  { id: 49, name: 'Maneuver', color: '#8BC34A', keywords: ['maneuver', 'operation', 'tactical'], icon: 'maneuver' },

  // Chemical/Nuclear (Yellow variants)
  { id: 50, name: 'Chemical', color: '#FBC02D', keywords: ['chemical', 'gas', 'toxic'], icon: 'chemical' },
  { id: 51, name: 'Nuclear', color: '#F9A825', keywords: ['nuclear', 'atomic', 'radiation'], icon: 'nuclear' },
  { id: 52, name: 'Biological', color: '#F57F17', keywords: ['biological', 'bio', 'virus'], icon: 'biological' },

  // Civil/Humanitarian (Light blue variants)
  { id: 53, name: 'Civilian', color: '#03A9F4', keywords: ['civilian', 'citizen', 'population'], icon: 'civilian' },
  { id: 54, name: 'Refugee', color: '#039BE5', keywords: ['refugee', 'displaced', 'evacuate'], icon: 'refugee' },
  { id: 55, name: 'Aid', color: '#0288D1', keywords: ['aid', 'humanitarian', 'relief'], icon: 'aid' },
  { id: 56, name: 'Medical', color: '#0277BD', keywords: ['medical', 'hospital', 'health'], icon: 'medical' },

  // Political/Government (Indigo variants)
  { id: 57, name: 'Government', color: '#3F51B5', keywords: ['government', 'official', 'ministry'], icon: 'government' },
  { id: 58, name: 'Embassy', color: '#3949AB', keywords: ['embassy', 'consulate', 'diplomatic'], icon: 'embassy' },
  { id: 59, name: 'Election', color: '#303F9F', keywords: ['election', 'vote', 'poll'], icon: 'election' },
  { id: 60, name: 'Protest', color: '#283593', keywords: ['protest', 'demonstration', 'rally'], icon: 'protest' },

  // Infrastructure (Deep orange variants)
  { id: 61, name: 'Bridge', color: '#FF5722', keywords: ['bridge', 'overpass'], icon: 'bridge' },
  { id: 62, name: 'Road', color: '#F4511E', keywords: ['road', 'highway', 'route'], icon: 'road' },
  { id: 63, name: 'Power Plant', color: '#E64A19', keywords: ['power', 'energy', 'electricity'], icon: 'power_plant' },
  { id: 64, name: 'Dam', color: '#D84315', keywords: ['dam', 'reservoir', 'water'], icon: 'dam' },

  // Additional Military Operations
  { id: 65, name: 'Command Center', color: '#5E35B1', keywords: ['command', 'control', 'headquarters'], icon: 'command_center' },
  { id: 66, name: 'Supply Line', color: '#FFA726', keywords: ['supply', 'logistics', 'resources'], icon: 'supply_line' },
  { id: 67, name: 'Strategic Point', color: '#EC407A', keywords: ['strategic', 'key', 'critical'], icon: 'strategic_point' },
  { id: 68, name: 'Defense Line', color: '#26A69A', keywords: ['defense', 'line', 'fortify'], icon: 'defense_line' },
  { id: 69, name: 'Target', color: '#EF5350', keywords: ['target', 'objective', 'aim'], icon: 'target' },
  { id: 70, name: 'Unknown', color: '#78909C', keywords: [], icon: 'unknown' }
];

// Intelligent context-based icon selector with random fallback
export function selectIconByContext(feature) {
  const attr = feature.properties || {};
  const labels = feature.labels || attr.labels || [];

  // Combine all text fields for context analysis
  const contextText = [
    attr.label || '',
    attr.name || '',
    attr.description || '',
    attr.event_category || '',
    labels.join(' '),
    attr.type || ''
  ].join(' ').toLowerCase();

  // Find best match by keywords
  let bestMatch = null;
  let maxScore = 0;

  ICON_LIBRARY.forEach(iconDef => {
    if (iconDef.keywords.length === 0) return; // Skip unknown/default

    let score = 0;
    iconDef.keywords.forEach(keyword => {
      if (contextText.includes(keyword.toLowerCase())) {
        score += 10; // High score for keyword match
      }
    });

    if (score > maxScore) {
      maxScore = score;
      bestMatch = iconDef;
    }
  });

  // If no keyword match, select random icon for variety
  if (!bestMatch || maxScore === 0) {
    // Use event ID or UID to generate consistent "random" icon
    const uid = attr._uid || attr.id || '';
    const hash = uid.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const randomIndex = hash % (ICON_LIBRARY.length - 1); // Exclude 'unknown'
    bestMatch = ICON_LIBRARY[randomIndex];
  }

  return bestMatch || ICON_LIBRARY[ICON_LIBRARY.length - 1]; // Fallback to 'unknown'
}

// Create comprehensive SVG icon - 70+ different designs
export function createDiverseIconURL(iconDef, size = 28) {
  const color = iconDef.color;
  const iconType = iconDef.icon;

  // Massive SVG icon library - 70+ unique designs
  const svgPaths = {
    // Attack/Combat
    'explosion': `<path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5L12 2z" fill="${color}"/><circle cx="12" cy="12" r="7" fill="${color}" opacity="0.3"/><path d="M12 2C8 6 6 8 6 12s2 6 6 6 6-2 6-6-2-6-6-10z" fill="${color}" opacity="0.5"/>`,
    'gunfire': `<path d="M20 4l-2 14.5V20H6v-1.5L4 4h16z" fill="${color}"/><circle cx="12" cy="12" r="2" fill="white"/><path d="M10 2h4v3h-4z" fill="${color}"/>`,
    'artillery': `<path d="M4 12h3v8H4zm6-4h4v12h-4zm6 2h4v10h-4z" fill="${color}"/><circle cx="12" cy="6" r="2" fill="${color}"/>`,
    'airstrike': `<path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" fill="${color}"/>`,
    'ambush': `<path d="M12 2L3 14h8l-1 8 10-12h-8l1-8z" fill="${color}"/><path d="M7 18l3-3 3 3" stroke="${color}" opacity="0.5" fill="none"/>`,

    // Military Operations
    'military_base': `<path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3z" fill="${color}"/><path d="M12 12.5l-5.5 3v-4l5.5-3 5.5 3v4l-5.5-3z" fill="white" opacity="0.4"/>`,
    'patrol': `<path d="M12 4l-6 6h4v8h4v-8h4z" fill="${color}"/><circle cx="12" cy="20" r="1.5" fill="${color}"/>`,
    'convoy': `<path d="M18 8c-1.1 0-2-.9-2-2 0-1.1.9-2 2-2s2 .9 2 2c0 1.1-.9 2-2 2zm-12 0c-1.1 0-2-.9-2-2 0-1.1.9-2 2-2s2 .9 2 2c0 1.1-.9 2-2 2zm13 4H5v6h1c0 1.1.9 2 2 2s2-.9 2-2h4c0 1.1.9 2 2 2s2-.9 2-2h1v-6z" fill="${color}"/>`,
    'checkpoint': `<path d="M12 2L4 6v6h16V6l-8-4zm0 10H6v6h12v-6h-6z" fill="${color}"/><rect x="10" y="14" width="4" height="4" fill="white" opacity="0.5"/>`,
    'deployment': `<path d="M4 2v20h16V2H4zm14 18H6V4h12v16z" fill="${color}"/><path d="M8 6h8v2H8zm0 4h8v2H8zm0 4h8v2H8z" fill="white" opacity="0.5"/>`,

    // Naval
    'naval_ship': `<path d="M4 20l8-12 8 12z" fill="${color}"/><path d="M12 8v12" stroke="white" stroke-width="1"/><path d="M2 20h20" stroke="${color}" stroke-width="2"/>`,
    'submarine': `<ellipse cx="12" cy="12" rx="10" ry="4" fill="${color}"/><rect x="11" y="6" width="2" height="6" fill="${color}"/><circle cx="12" cy="6" r="1.5" fill="white"/>`,
    'port': `<path d="M2 20h20v2H2z" fill="${color}"/><rect x="4" y="8" width="4" height="12" fill="${color}"/><rect x="10" y="10" width="4" height="10" fill="${color}"/><rect x="16" y="6" width="4" height="14" fill="${color}"/>`,
    'maritime': `<path d="M4 18h16M4 18s2-4 4-4 4 4 4 4 2-4 4-4 4 4 4 4M12 2v8" stroke="${color}" stroke-width="2" fill="none"/>`,

    // Air Force
    'aircraft': `<path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" fill="${color}"/>`,
    'helicopter': `<path d="M5 16c0 3.87 3.13 7 7 7s7-3.13 7-7v-4H5v4z" fill="${color}"/><path d="M12 12V4" stroke="${color}" stroke-width="2"/><path d="M2 4h20" stroke="${color}" stroke-width="2"/>`,
    'drone': `<circle cx="12" cy="12" r="3" fill="${color}"/><circle cx="6" cy="6" r="2" fill="${color}"/><circle cx="18" cy="6" r="2" fill="${color}"/><circle cx="6" cy="18" r="2" fill="${color}"/><circle cx="18" cy="18" r="2" fill="${color}"/>`,
    'airport': `<path d="M22 16v-2l-8.5-5V3.5c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5V9L2 14v2l8.5-2.5V19L8 20.5V22l4-1 4 1v-1.5L13.5 19v-5.5L22 16z" fill="${color}"/>`,

    // Intelligence/Cyber
    'intelligence': `<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="${color}"/>`,
    'cyber': `<path d="M12 2L2 7l10 5 10-5-10-5z" fill="${color}"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="${color}" stroke-width="2" fill="none"/>`,
    'satellite': `<circle cx="12" cy="12" r="3" fill="${color}"/><path d="M2 12h4M18 12h4M12 2v4M12 18v4" stroke="${color}" stroke-width="2"/><path d="M5 5l3 3M16 16l3 3M19 5l-3 3M8 16l-3 3" stroke="${color}" stroke-width="1.5"/>`,
    'radar': `<circle cx="12" cy="12" r="10" stroke="${color}" stroke-width="2" fill="none"/><circle cx="12" cy="12" r="6" stroke="${color}" stroke-width="1.5" fill="none"/><circle cx="12" cy="12" r="2" fill="${color}"/><path d="M12 12l8-8" stroke="${color}" stroke-width="2"/>`,

    // Communication
    'communication': `<path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2z" fill="${color}"/><circle cx="9" cy="10" r="1" fill="white"/><circle cx="12" cy="10" r="1" fill="white"/><circle cx="15" cy="10" r="1" fill="white"/>`,
    'meeting': `<path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5z" fill="${color}"/>`,
    'statement': `<path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" fill="${color}"/><path d="M6 9h12v2H6zm0 3h12v2H6z" fill="white" opacity="0.7"/>`,
    'negotiation': `<path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3z" fill="${color}"/><path d="M8 13c-2.33 0-7 1.17-7 3.5V19h7v-2.5c0-.82.63-1.56 1.5-2.08C8.87 13.87 8.44 13 8 13zm8 0c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5z" fill="${color}"/>`,

    // Terrorism
    'terrorist': `<path d="M12 2L2 7l10 5 10-5-10-5z" fill="${color}" opacity="0.8"/><path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5L12 2z" fill="${color}"/>`,
    'kidnapping': `<path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="${color}"/><path d="M4 16h16" stroke="white" stroke-width="2"/>`,
    'ied': `<circle cx="12" cy="12" r="8" fill="${color}"/><path d="M12 8v8M8 12h8" stroke="white" stroke-width="2"/>`,
    'suicide_attack': `<path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5L12 2z" fill="${color}"/><circle cx="12" cy="12" r="4" fill="${color}" opacity="0.5"/>`,

    // Personnel
    'soldier': `<path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" fill="${color}"/><path d="M12 14c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="${color}"/>`,
    'commander': `<path d="M12 2L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-3z" fill="${color}"/><path d="M12 12c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z" fill="white"/>`,
    'special_forces': `<path d="M12 2L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-3zm-1.41 9L9 9.41 7.59 11 9 12.41l1.41-1.41L12.41 13 14 11.41l-1.41-1.41L11 8.41z" fill="${color}"/>`,
    'casualty': `<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="${color}"/><path d="M12 6v6l4 2" stroke="white" stroke-width="2"/>`,

    // Weapons
    'tank': `<rect x="4" y="10" width="16" height="6" rx="1" fill="${color}"/><rect x="8" y="7" width="8" height="4" rx="1" fill="${color}"/><circle cx="7" cy="16" r="2" fill="${color}"/><circle cx="17" cy="16" r="2" fill="${color}"/>`,
    'missile': `<path d="M12 2L3 14h8l-1 8 10-12h-8l1-8z" fill="${color}"/>`,
    'artillery_gun': `<path d="M4 12h16M12 4v16" stroke="${color}" stroke-width="3"/><circle cx="12" cy="12" r="4" fill="${color}"/>`,
    'vehicle': `<path d="M18 8h-1V6c0-1.1-.9-2-2-2H9c-1.1 0-2 .9-2 2v2H6c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-8c0-1.1-.9-2-2-2zM7 18c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm10 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z" fill="${color}"/>`,

    // Facilities
    'building': `<path d="M12 3L2 8v13h20V8L12 3z" fill="${color}"/><rect x="6" y="12" width="3" height="3" fill="white" opacity="0.5"/><rect x="10.5" y="12" width="3" height="3" fill="white" opacity="0.5"/><rect x="15" y="12" width="3" height="3" fill="white" opacity="0.5"/>`,
    'warehouse': `<path d="M2 20h20v2H2z" fill="${color}"/><rect x="3" y="8" width="18" height="12" fill="${color}" opacity="0.8"/><path d="M3 8l9-6 9 6" stroke="${color}" stroke-width="2" fill="none"/>`,
    'factory': `<rect x="4" y="10" width="4" height="10" fill="${color}"/><rect x="10" y="8" width="4" height="12" fill="${color}"/><rect x="16" y="6" width="4" height="14" fill="${color}"/><path d="M4 6h4M10 4h4M16 2h4" stroke="${color}" stroke-width="2"/>`,
    'bunker': `<path d="M12 2L2 8v13h20V8L12 2z" fill="${color}"/><path d="M2 21h20M6 15h12v6H6z" fill="${color}" opacity="0.6"/>`,

    // Border/Security
    'border': `<path d="M2 12h20M12 2v20M6 6v12M18 6v12" stroke="${color}" stroke-width="2"/>`,
    'guard_post': `<path d="M12 2L6 6v6h12V6l-6-4z" fill="${color}"/><rect x="8" y="12" width="8" height="10" fill="${color}" opacity="0.8"/>`,
    'fence': `<path d="M4 2v20M8 2v20M12 2v20M16 2v20M20 2v20M2 8h20M2 16h20" stroke="${color}" stroke-width="1.5"/>`,
    'security': `<path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" fill="${color}"/><path d="M10 17l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" fill="white"/>`,

    // Training
    'training': `<path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3z" fill="${color}"/>`,
    'test': `<circle cx="12" cy="12" r="10" stroke="${color}" stroke-width="2" fill="none"/><path d="M12 6v6l4 2" stroke="${color}" stroke-width="2"/>`,
    'maneuver': `<path d="M12 2L3 7l9 5 9-5-9-5z" fill="${color}"/><path d="M3 12l9 5 9-5M3 17l9 5 9-5" stroke="${color}" stroke-width="2" fill="none"/>`,

    // Chemical/Nuclear
    'chemical': `<circle cx="12" cy="12" r="10" stroke="${color}" stroke-width="2" fill="none"/><path d="M12 2v20M2 12h20" stroke="${color}" stroke-width="2"/><circle cx="12" cy="12" r="3" fill="${color}"/>`,
    'nuclear': `<circle cx="12" cy="12" r="10" fill="${color}" opacity="0.3"/><path d="M12 4l-4 8h8l-4-8zM8 16l4-4 4 4-4 4-4-4z" fill="${color}"/>`,
    'biological': `<circle cx="12" cy="12" r="10" stroke="${color}" stroke-width="2" fill="none"/><path d="M12 2c-3 0-5 2-5 5s2 5 5 5 5-2 5-5-2-5-5-5z" fill="${color}" opacity="0.5"/>`,

    // Civil/Humanitarian
    'civilian': `<path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="${color}"/>`,
    'refugee': `<path d="M15 11V5l-3-3-3 3v2H3v14h18V11h-6zm-8 8H5v-2h2v2zm0-4H5v-2h2v2zm0-4H5V9h2v2zm6 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V9h2v2zm0-4h-2V5h2v2zm6 12h-2v-2h2v2zm0-4h-2v-2h2v2z" fill="${color}"/>`,
    'aid': `<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 11h-4v4h-4v-4H6v-4h4V6h4v4h4v4z" fill="${color}"/>`,
    'medical': `<path d="M19 3H5c-1.1 0-1.99.9-1.99 2L3 19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 11h-4v4h-4v-4H6v-4h4V6h4v4h4v4z" fill="${color}"/>`,

    // Political
    'government': `<path d="M12 3L2 8v13h20V8L12 3z" fill="${color}"/><rect x="6" y="12" width="12" height="2" fill="white"/><rect x="9" y="15" width="6" height="2" fill="white"/>`,
    'embassy': `<path d="M12 3L2 9v11h20V9L12 3z" fill="${color}"/><rect x="10" y="14" width="4" height="6" fill="white" opacity="0.7"/>`,
    'election': `<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="${color}"/>`,
    'protest': `<path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05.02.01.03.03.04.04 1.14.83 1.93 1.94 1.93 3.41V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" fill="${color}"/>`,

    // Infrastructure
    'bridge': `<path d="M2 18h20M6 18V6h2v12M16 18V6h2v12M2 6h20v2H2z" stroke="${color}" stroke-width="2" fill="none"/>`,
    'road': `<path d="M18 2H6v20h12V2z" fill="${color}" opacity="0.3"/><rect x="11" y="4" width="2" height="3" fill="white"/><rect x="11" y="9" width="2" height="3" fill="white"/><rect x="11" y="14" width="2" height="3" fill="white"/><rect x="11" y="19" width="2" height="3" fill="white"/>`,
    'power_plant': `<rect x="4" y="8" width="4" height="12" fill="${color}"/><rect x="10" y="6" width="4" height="14" fill="${color}"/><rect x="16" y="4" width="4" height="16" fill="${color}"/><path d="M4 20h16v2H4z" fill="${color}"/>`,
    'dam': `<path d="M4 12l8-10 8 10v10H4V12z" fill="${color}"/><path d="M4 22h16v2H4z" fill="${color}" opacity="0.6"/>`,

    // Additional Military
    'command_center': `<path d="M12 2L2 7l10 5 10-5-10-5z" fill="${color}"/><path d="M2 12l10 5 10-5M2 17l10 5 10-5" stroke="${color}" stroke-width="2" fill="none"/><circle cx="12" cy="12" r="2" fill="white"/>`,
    'supply_line': `<path d="M4 12h4l2-4 4 8 2-4h4" stroke="${color}" stroke-width="2" fill="none"/><circle cx="4" cy="12" r="2" fill="${color}"/><circle cx="20" cy="12" r="2" fill="${color}"/>`,
    'strategic_point': `<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="${color}"/>`,
    'defense_line': `<path d="M2 12h20M6 6v12M12 6v12M18 6v12" stroke="${color}" stroke-width="2"/>`,
    'target': `<circle cx="12" cy="12" r="10" stroke="${color}" stroke-width="2" fill="none"/><circle cx="12" cy="12" r="6" stroke="${color}" stroke-width="2" fill="none"/><circle cx="12" cy="12" r="2" fill="${color}"/>`,
    'unknown': `<circle cx="12" cy="12" r="10" stroke="${color}" stroke-width="2" fill="none"/><path d="M12 8c-1.1 0-2 .9-2 2h2c0-.55.45-1 1-1s1 .45 1 1c0 1-2 .75-2 3h2c0-1.5 2-1.5 2-3 0-1.1-.9-2-2-2z" fill="${color}"/><circle cx="12" cy="17" r="1" fill="${color}"/>`,
  };

  const path = svgPaths[iconType] || svgPaths['unknown'];

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24">
      ${path}
    </svg>
  `;

  return 'data:image/svg+xml;base64,' + btoa(svg);
}