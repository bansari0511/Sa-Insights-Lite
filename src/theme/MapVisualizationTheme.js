/**
 * Map & Visualization Design Tokens
 * Centralized colors, fonts, and styling values for map and graph components
 * Compatible with MUI, ArcGIS, D3.js, and force-graph libraries
 */

// ========================
// BASE COLOR PALETTE
// ========================
// Named colors for better readability and reusability

const colorPalette = {
  // Brand Colors
  royalBlue: '#0a4392ff',
  skyBlue: '#f0f9ff',
  deepPurple: '#20175e',
  darkPurple: '#08003fff',
  slateLight: '#f8fafc',
  navyDark: '#0a1d3bff',

  // Accent Colors
  cyan: '#6bc3eb',
  orange: '#ff8c00',
  yellow: '#ffca28',

  // Blues
  brightBlue: '#3b82f6',
  oceanBlue: '#0079c1',
  skyBlue2: '#1976d2',
  navyBlue: '#2c3e50',
  blueGray: '#34495e',
  steelBlue: '#2980b9',
  lightSteelBlue: '#5dade2',
  deepOcean: '#0d47a1',
  indigoBlue: '#1565c0',
  sapphire: '#01579b',
  cobalt: '#003c71',
  cerulean: '#0277bd',
  azure: '#0288d1',

  // Greens
  emerald: '#10b981',
  lightGreen: '#66bb6a',
  forestGreen: '#27ae60',
  limeGreen: '#2ecc71',
  jade: '#1abc9c',
  mintGreen: '#48c9b0',
  seafoam: '#58d68d',
  paleGreen: '#82e5aa',
  pasteleGreen: '#a9dfbf',
  teal: '#16a085',
  darkForest: '#2e7d32',
  deepForest: '#1b5e20',
  darkTeal: '#00695c',
  oceanTeal: '#00796b',
  turquoise: '#00897b',
  aquamarine: '#26a69a',
  mediumAquamarine: '#66cdaa',

  // Reds/Pinks
  red: '#ef4444',
  pink: '#ec407a',
  maroon: '#A52A2A',
  crimson: '#e74c3c',
  darkRed: '#c0392b',
  bloodRed: '#b71c1c',
  burgundy: '#8e0000',
  cardinal: '#c62828',
  ruby: '#d32f2f',
  scarlet: '#e53935',
  coral: '#f44336',
  salmon: '#fadbd8',
  mistyRose: '#ffe4e1',

  // Oranges
  amber: '#f59e0b',
  lightOrange: '#ffa726',
  tangerine: '#e67e22',
  darkOrange: '#d35400',
  pumpkin: '#f39c12',
  goldOrange: '#f1c40f',
  sunflower: '#f4d03f',
  peach: '#f8c471',
  deepOrange: '#e65100',
  rustOrange: '#bf360c',
  brown: '#8c2f00',
  chocolate: '#5d1f00',
  darkBrown: '#3e1400',
  espresso: '#2e0f00',
  burntOrange: '#5d1a01',
  auburn: '#bf360c',
  copper: '#d84315',
  bronze: '#e64a19',
  terracotta: '#f4511e',
  sienna: '#ff5722',
  carrot: '#ef6c00',
  goldenrod: '#ff8f00',
  marigold: '#ffa000',
  apricot: '#ffb300',
  peru: 'peru',
  peachpuff: 'peachpuff',

  // Yellows
  gold: '#ffc107',
  lemon: '#f7dc6f',
  canary: '#f9e79f',
  mustard: '#f57f17',
  saffron: '#f9a825',
  banana: '#fbc02d',
  palegreen: 'palegreen',

  // Purples
  violet: '#8b5cf6',
  magenta: '#ec4899',
  purple: '#9c27b0',
  amethyst: '#8e44ad',
  lavender: '#9b59b6',
  orchid: '#da70d6',
  plum: '#bb8fce',
  lilac: '#d7bde2',
  mauve: '#e8daef',
  deepPurple2: '#4a148c',
  royalPurple: '#6a1b9a',
  iris: '#7b1fa2',
  heliotrope: '#8e24aa',
  mediumOrchid: '#ba55d3',

  // Search/UI Toggle Button Colors
  blueToggle: '#2196f3',
  blueDark: '#1976d2',
  blueLight: '#e3f2fd',
  blueLighter: '#bbdefb',

  orangeToggle: '#ff5722',
  orangeDark: '#d84315',
  orangeLight: '#ffecd2',
  orangeLighter: '#fcb69f',

  purpleToggle: '#9c27b0',
  purpleDark: '#7b1fa2',
  purpleLight: '#f3e5f5',
  purpleLighter: '#e1bee7',

  grayLight: '#f0f0f0',

  // Grays
  slate: '#64748b',
  gray: '#757575',
  charcoal: '#334155',
  lightGray: '#e0e0e0',
  steel: '#85929e',
  silver: '#aab7b8',
  darkSteel: '#5d6d7e',
  mediumSteel: '#717d7e',
  pewter: '#839192',
  fog: '#95a5a6',
  mist: '#a6acaf',
  cloud: '#b7babd',
  graphite: '#424242',
  iron: '#616161',

  // Neutrals
  white: '#ffffff',
  black: '#000000',
  darkGray: '#374151',
  mediumGray: '#1f2937',

  // Special
  maroon2: '#800000',

  // Manufacturing greens
  manufacture1: '#1b5e20',
  manufacture2: '#2e7d32',
  manufacture3: '#388e3c',
  manufacture4: '#4caf50',
};

// ========================
// COLOR SYSTEM
// ========================

export const mapColors = {
  // Primary Brand Colors (aligned with main theme)
  primary: colorPalette.royalBlue,
  primaryLight: colorPalette.skyBlue,
  primaryDark: colorPalette.deepPurple,

  secondary: colorPalette.darkPurple,
  secondaryLight: colorPalette.slateLight,
  secondaryDark: colorPalette.navyDark,

  accent: colorPalette.cyan,
  accentOrange: colorPalette.orange,

  // ArcGIS Widget Colors
  arcgis: {
    widgetIcon: colorPalette.oceanBlue,
    widgetBackground: colorPalette.white,
    widgetBorder: colorPalette.lightGray,
    widgetHover: `rgba(107, 195, 235, 0.15)`, // cyan with opacity
    toggleIcon: colorPalette.oceanBlue,
    expandIcon: colorPalette.charcoal,
  },

  // Map Layer Colors
  layers: {
    basemap: colorPalette.brightBlue,
    boundary: colorPalette.red,
    strategic: colorPalette.amber,
    osm: colorPalette.emerald,
    selection: colorPalette.orange,
    highlight: `rgba(255, 180, 0, 1)`, // amber highlight
    highlightHalo: `rgba(255, 0, 0, 1)`, // red halo
  },

  // Event Category Colors (for map markers and events)
  events: {
    protestsRiots: colorPalette.maroon,
    terrorism: colorPalette.lightOrange,
    organizedCrime: colorPalette.pink,
    governmentPolitical: colorPalette.skyBlue2,
    military: colorPalette.lightGreen,
    disaster: colorPalette.purple,
    default: colorPalette.gray,
  },

  // Graph Visualization Colors
  graph: {
    // Node colors by type
    nodes: {
      equipment: colorPalette.cyan,
      organization: colorPalette.emerald,
      militaryGroup: colorPalette.amber,
      event: colorPalette.red,
      person: colorPalette.violet,
      location: colorPalette.magenta,
      default: colorPalette.slate,
    },

    // Link/Edge colors
    links: {
      default: `rgba(107, 195, 235, 0.3)`, // cyan with low opacity
      hover: colorPalette.cyan,
      selected: colorPalette.royalBlue,
      strong: `rgba(107, 195, 235, 0.6)`, // cyan with medium opacity
      weak: `rgba(107, 195, 235, 0.15)`, // cyan with very low opacity
    },

    // Highlight states
    highlight: {
      node: colorPalette.orange,
      nodeHalo: `rgba(255, 140, 0, 0.3)`, // orange with opacity
      link: colorPalette.orange,
      neighbor: `rgba(107, 195, 235, 0.6)`, // cyan with opacity
    },

    // Background
    background: colorPalette.slateLight,
    canvas: colorPalette.white,
  },

  // Popup & Tooltip Colors
  popup: {
    background: colorPalette.white,
    border: `rgba(107, 195, 235, 0.3)`, // cyan with opacity
    shadow: `rgba(32, 23, 94, 0.15)`, // deep purple with opacity
    headerBg: `linear-gradient(135deg, ${colorPalette.skyBlue} 0%, rgba(107, 195, 235, 0.1) 100%)`,
    headerText: colorPalette.deepPurple,
    contentText: colorPalette.darkGray,
    divider: `rgba(107, 195, 235, 0.15)`, // cyan with opacity
  },

  // Status Colors
  status: {
    success: colorPalette.emerald,
    warning: colorPalette.amber,
    error: colorPalette.red,
    info: colorPalette.cyan,
    neutral: colorPalette.slate,
  },

  // Search Page UI Colors
  searchUI: {
    news: {
      main: colorPalette.blueToggle,
      dark: colorPalette.blueDark,
      light: colorPalette.blueLight,
      lighter: colorPalette.blueLighter,
      gradient: `linear-gradient(135deg, ${colorPalette.blueLight} 0%, ${colorPalette.blueLighter} 100%)`,
    },
    events: {
      main: colorPalette.orangeToggle,
      dark: colorPalette.orangeDark,
      light: colorPalette.orangeLight,
      lighter: colorPalette.orangeLighter,
      gradient: `linear-gradient(135deg, ${colorPalette.orangeLight} 0%, ${colorPalette.orangeLighter} 100%)`,
    },
    intelligence: {
      main: colorPalette.blueToggle,
      dark: colorPalette.blueDark,
      light: colorPalette.blueLight,
      lighter: colorPalette.blueLighter,
      gradient: `linear-gradient(135deg, ${colorPalette.blueLight} 0%, ${colorPalette.blueLighter} 100%)`,
    },
    both: {
      main: colorPalette.purpleToggle,
      dark: colorPalette.purpleDark,
      light: colorPalette.purpleLight,
      lighter: colorPalette.purpleLighter,
      gradient: `linear-gradient(135deg, ${colorPalette.purpleLight} 0%, ${colorPalette.purpleLighter} 100%)`,
    },
    loading: {
      spinner: colorPalette.blueDark,
      background: colorPalette.grayLight,
    },
  },

  // Opacity Utilities
  opacity: {
    light: 0.1,
    medium: 0.3,
    heavy: 0.6,
    solid: 1,
  },
};

// ========================
// TYPOGRAPHY
// ========================

export const mapTypography = {
  // Font Families
  fontFamily: {
    primary: "'Segoe UI', -apple-system, BlinkMacSystemFont, 'Roboto', 'Helvetica Neue', Arial, sans-serif",
    monospace: "'Courier New', Courier, monospace",
  },

  // Map Widget Typography
  widget: {
    fontSize: '12px',
    fontWeight: '600',
    labelSize: '24px',
    smallSize: '10px',
  },

  // Map Marker/Label Typography
  marker: {
    fontSize: '14px',
    fontWeight: '700',
    labelColor: colorPalette.white,
    shadowColor: `rgba(0, 0, 0, 0.5)`, // black with opacity
  },

  // Popup Typography
  popup: {
    titleSize: '1.25rem',
    titleWeight: '700',
    contentSize: '0.875rem',
    contentWeight: '400',
    captionSize: '0.75rem',
    captionWeight: '400',
  },

  // Graph Label Typography
  graph: {
    nodeLabel: {
      fontSize: '12px',
      fontWeight: '600',
      color: colorPalette.mediumGray,
    },
    legend: {
      fontSize: '14px',
      fontWeight: '500',
      color: colorPalette.darkGray,
    },
  },

  // Timeline Typography
  timeline: {
    dateSize: '0.75rem',
    dateWeight: '600',
    titleSize: '0.875rem',
    titleWeight: '700',
    contentSize: '0.8rem',
    contentWeight: '400',
  },
};

// ========================
// SPACING & SIZING
// ========================

export const mapSizing = {
  // Widget Dimensions
  widget: {
    padding: '10px',
    gap: '8px',
    minWidth: '120px',
    iconSize: '24px',
    borderRadius: '8px',
  },

  // Popup Dimensions
  popup: {
    maxWidth: '400px',
    padding: '16px',
    borderRadius: '12px',
    shadowBlur: '20px',
  },

  // Map Controls
  controls: {
    buttonSize: '40px',
    iconSize: '20px',
    spacing: '8px',
  },

  // Timeline
  timeline: {
    width: 140,
    markerSize: '12px',
    lineWidth: '2px',
  },
};

// ========================
// EFFECTS & ANIMATIONS
// ========================

export const mapEffects = {
  // Transitions
  transition: {
    fast: '0.2s ease',
    normal: '0.3s ease-in-out',
    slow: '0.5s ease-in-out',
  },

  // Shadows
  shadow: {
    light: '0 2px 8px rgba(107, 195, 235, 0.1)',
    medium: '0 4px 20px rgba(107, 195, 235, 0.15)',
    heavy: '0 8px 32px rgba(107, 195, 235, 0.2)',
    widget: '0 4px 12px rgba(0, 0, 0, 0.15)',
  },

  // Hover States
  hover: {
    transform: 'translateY(-2px)',
    scale: 'scale(1.05)',
    opacity: '0.8',
  },
};

// ========================
// EVENT CATEGORIES (Pre-configured)
// ========================

export const eventCategories = {
  'Protests&Riots': {
    color: mapColors.events.protestsRiots,
    icon: '✊',
    name: 'Protests & Riots',
  },
  'Terrorism & Insurgency': {
    color: mapColors.events.terrorism,
    icon: '⚠️',
    name: 'Terrorism & Insurgency',
  },
  'Serious & Organised Crime': {
    color: mapColors.events.organizedCrime,
    icon: '🚔',
    name: 'Serious & Organised Crime',
  },
  'Government & Political': {
    color: mapColors.events.governmentPolitical,
    icon: '🏛️',
    name: 'Government & Political',
  },
  'Military': {
    color: mapColors.events.military,
    icon: '🎖️',
    name: 'Military',
  },
  'OSINT Forces Monitoring': {
    color: colorPalette.yellow,
    icon: '📡',
    name: 'OSINT Forces Monitoring',
  },
  'Disaster & Accidents': {
    color: mapColors.events.disaster,
    icon: '⚡',
    name: 'Disaster & Accidents',
  },
};

// ========================
// MAP LAYER CONFIGURATIONS
// ========================

export const mapLayerConfig = {
  basemap: {
    color: mapColors.layers.basemap,
    opacity: 1,
    visible: true,
  },
  boundary: {
    color: mapColors.layers.boundary,
    opacity: 0.7,
    strokeWidth: 2,
    visible: true,
  },
  strategic: {
    color: mapColors.layers.strategic,
    opacity: 0.8,
    visible: false,
  },
  osm: {
    color: mapColors.layers.osm,
    opacity: 1,
    visible: false,
  },
};

// ========================
// HIGHLIGHT OPTIONS (ArcGIS)
// ========================

export const highlightOptions = {
  color: [255, 180, 0, 1],      // RGBA for ArcGIS
  haloColor: [255, 0, 0, 1],
  haloOpacity: 1,
  fillOpacity: 0.01,
  shadowColor: 'black',
  shadowOpacity: 1,
};

// ========================
// GRAPH NODE COLORS
// ========================
// Comprehensive color palette for all Neo4j node types

export const NODE_COLORS = {
  // Events
  ActionEvent: colorPalette.crimson,
  AttackEvent: colorPalette.darkRed,
  Event: colorPalette.tangerine,
  ForceMonitoringEvent: colorPalette.darkOrange,
  JudicialEvent: colorPalette.amethyst,
  MilitaryEvent: colorPalette.lavender,
  OperationEvent: colorPalette.navyBlue,
  StatementEvent: colorPalette.blueGray,

  // Organizations & Groups
  Agent: colorPalette.teal,
  MilitaryGroup: colorPalette.forestGreen,
  NonStateGroup: colorPalette.limeGreen,
  Organization: colorPalette.brightBlue,
  SupranationalGroup: colorPalette.jade,
  JointVenture: colorPalette.mintGreen,
  GroupInOrbat: colorPalette.seafoam,
  Unit: colorPalette.paleGreen,
  Units: colorPalette.pasteleGreen,

  // Equipment & Assets
  Equipment: colorPalette.pumpkin,
  EquipmentFamily: colorPalette.goldOrange,
  EquipmentVariant: colorPalette.sunflower,
  ShipFamily: colorPalette.lightSteelBlue,
  ShipInstance: colorPalette.brightBlue,
  ShipVariant: colorPalette.steelBlue,
  DocumentAsset: colorPalette.plum,
  ImageAsset: colorPalette.lilac,
  VideoAsset: colorPalette.mauve,
  AssetUsage: colorPalette.salmon,
  InServiceInventory: colorPalette.peach,

  // Geographic & Infrastructure
  Country: colorPalette.crimson,
  Installation: colorPalette.steel,
  Runway: colorPalette.silver,

  // Special Maritime
  MMSI: colorPalette.maroon2,
  IMO: colorPalette.orchid,
  PORT: colorPalette.palegreen,
  TERMINAL: colorPalette.peachpuff,
  COUNTRY: colorPalette.peru,

  // Administrative & Classification
  Classification: colorPalette.darkSteel,
  ClassificationGroup: colorPalette.mediumSteel,
  Condition: colorPalette.pewter,
  Analysis: colorPalette.fog,
  Profile: colorPalette.mist,
  Specification: colorPalette.cloud,

  // Operational
  Orbat: colorPalette.lemon,
  Fragment: colorPalette.canary,
  News: colorPalette.mediumAquamarine,
  Relationship: colorPalette.mediumOrchid,

  // Default
  Unknown: colorPalette.mistyRose,
};

// ========================
// GRAPH EDGE/RELATIONSHIP COLORS
// ========================
// Comprehensive color palette for all relationship/edge types

export const EDGE_COLORS = {
  // Actor relationships
  actors_actor: colorPalette.bloodRed,
  actors_actor_nationalities: colorPalette.burgundy,
  actors_equipment_used: colorPalette.burntOrange,

  // Location relationships
  addresses_country: colorPalette.indigoBlue,
  event_address_country: colorPalette.deepOcean,
  located_at_location_country: colorPalette.sapphire,
  location_location_country: colorPalette.cobalt,
  group_based_at: colorPalette.darkForest,
  group_location_of: colorPalette.deepForest,

  // Equipment relationships
  equipment: colorPalette.deepOrange,
  operates_equipment: colorPalette.rustOrange,
  operates_instance: colorPalette.brown,
  operates_system: colorPalette.chocolate,
  current_instance_operated_by: colorPalette.darkBrown,
  current_instance_operator_country: colorPalette.espresso,

  // Manufacturing relationships
  manufactured_by: colorPalette.manufacture1,
  manufacturer: colorPalette.manufacture2,
  manufactures: colorPalette.manufacture3,
  country_of_final_assembly: colorPalette.manufacture4,

  // Organizational relationships
  parent_group: colorPalette.deepPurple2,
  parent_organization: colorPalette.royalPurple,
  head_organization: colorPalette.iris,
  partner_of: colorPalette.heliotrope,
  partnerships_partner: colorPalette.purple,

  // Classification relationships
  classification_group: colorPalette.graphite,
  parent_classification: colorPalette.iron,
  conditions: colorPalette.gray,

  // Family relationships
  in_family: colorPalette.darkTeal,
  overall_family: colorPalette.oceanTeal,
  instance_of_variant: colorPalette.turquoise,
  derived_from: colorPalette.aquamarine,

  // Country relationships
  country_of_domicile: colorPalette.auburn,
  country_of_operation: colorPalette.copper,
  country_of_origin: colorPalette.bronze,
  country_of_sovereignty: colorPalette.terracotta,
  primary_country: colorPalette.sienna,

  // Asset relationships
  asset_usage: colorPalette.royalPurple,
  assets: colorPalette.iris,
  primary_image: colorPalette.heliotrope,

  // Operational relationships
  orbats: colorPalette.mustard,
  grouping: colorPalette.saffron,
  runways: colorPalette.banana,

  // Related relationships
  related_equipment: colorPalette.darkTeal,
  related_to: colorPalette.oceanTeal,
  relationships: colorPalette.turquoise,
  relationships_related_to: colorPalette.aquamarine,

  // Casualties relationships
  militant_casualties_arrested_impacted_entity: colorPalette.cardinal,
  militant_casualties_captured_impacted_entity: colorPalette.ruby,
  militant_casualties_killed_impacted_entity: colorPalette.scarlet,
  militant_casualties_wounded_impacted_entity: colorPalette.coral,

  // Ship relationships
  ship_instance_history_operated_by: colorPalette.cerulean,
  ship_instance_history_operator_country: colorPalette.azure,

  // Equipment specific
  parent_equipment: colorPalette.carrot,
  measurement_system: colorPalette.goldenrod,
  of_dimension: colorPalette.marigold,
  operator: colorPalette.apricot,
  overview: colorPalette.gold,

  // Default
  default: colorPalette.graphite,
};

// ========================
// HELPER FUNCTIONS
// ========================

// Get color for a node type with fallback to random color
export const getNodeColor = (nodeType) => {
  return NODE_COLORS[nodeType] || '#' + Math.floor(Math.random() * 16777215).toString(16);
};

// Get color for an edge/relationship type with fallback to default
export const getEdgeColor = (edgeType) => {
  return EDGE_COLORS[edgeType] || EDGE_COLORS.default;
};

// ========================
// COMPLETE THEME EXPORT
// ========================

export const mapTheme = {
  colors: mapColors,
  typography: mapTypography,
  sizing: mapSizing,
  effects: mapEffects,
  eventCategories,
  layerConfig: mapLayerConfig,
  highlightOptions,
  nodeColors: NODE_COLORS,
  edgeColors: EDGE_COLORS,
  getNodeColor,
  getEdgeColor,
};

// Default export
export default mapTheme;