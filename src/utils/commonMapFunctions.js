/**
 * Common Map Functions Utility
 * Comprehensive ArcGIS Maps SDK utility functions for geospatial analysis
 */

import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import MapImageLayer from '@arcgis/core/layers/MapImageLayer';
import WMSLayer from '@arcgis/core/layers/WMSLayer';
import TileLayer from '@arcgis/core/layers/TileLayer';
import Graphic from '@arcgis/core/Graphic';
import Sketch from '@arcgis/core/widgets/Sketch';
import Home from '@arcgis/core/widgets/Home';
import Zoom from '@arcgis/core/widgets/Zoom';
import Search from '@arcgis/core/widgets/Search';
import CoordinateConversion from '@arcgis/core/widgets/CoordinateConversion';
import BasemapGallery from '@arcgis/core/widgets/BasemapGallery';
import LayerList from '@arcgis/core/widgets/LayerList';
import Legend from '@arcgis/core/widgets/Legend';
import Expand from '@arcgis/core/widgets/Expand';
import Fullscreen from '@arcgis/core/widgets/Fullscreen';
import ScaleBar from '@arcgis/core/widgets/ScaleBar';
import Compass from '@arcgis/core/widgets/Compass';
import Locate from '@arcgis/core/widgets/Locate';
import Print from '@arcgis/core/widgets/Print';
import Measurement from '@arcgis/core/widgets/Measurement';
import FeatureTable from '@arcgis/core/widgets/FeatureTable';

// ==========================================
// 1. LAYER CREATION FUNCTIONS
// ==========================================

/**
 * Create a layer by passing URL and layer name
 * @param {string} url - Layer service URL
 * @param {string} layerName - Name for the layer
 * @param {Object} options - Additional layer options
 * @returns {FeatureLayer|MapImageLayer} Created layer
 */
export function createLayerFromUrl(url, layerName, options = {}) {
  const {
    type = 'feature', // 'feature' or 'mapimage'
    opacity = 1,
    visible = true,
    popupEnabled = true,
    ...additionalOptions
  } = options;

  try {
    if (type === 'mapimage') {
      return new MapImageLayer({
        url,
        title: layerName,
        opacity,
        visible,
        ...additionalOptions
      });
    } else {
      return new FeatureLayer({
        url,
        title: layerName,
        opacity,
        visible,
        popupEnabled,
        ...additionalOptions
      });
    }
  } catch (error) {
    console.error('Error creating layer:', error);
    throw error;
  }
}

/**
 * Create a graphics layer for drawing
 * @param {string} layerName - Name for the layer
 * @param {Object} options - Additional options
 * @returns {GraphicsLayer} Created graphics layer
 */
export function createGraphicsLayer(layerName, options = {}) {
  return new GraphicsLayer({
    title: layerName,
    ...options
  });
}

/**
 * Create a WMS Layer (Web Map Service)
 * @param {string} url - WMS service URL
 * @param {string} layerName - Name for the layer
 * @param {Object} options - Additional WMS options
 * @returns {WMSLayer} Created WMS layer
 */
export function createWMSLayer(url, layerName, options = {}) {
  const {
    sublayers = [],
    opacity = 1,
    visible = true,
    version = '1.3.0',
    customParameters = {},
    ...additionalOptions
  } = options;

  try {
    return new WMSLayer({
      url,
      title: layerName,
      sublayers: sublayers.length > 0 ? sublayers : undefined,
      opacity,
      visible,
      version,
      customParameters,
      ...additionalOptions
    });
  } catch (error) {
    console.error('Error creating WMS layer:', error);
    throw error;
  }
}

/**
 * Create a Tile Layer (cached map tiles)
 * @param {string} url - Tile service URL
 * @param {string} layerName - Name for the layer
 * @param {Object} options - Additional tile layer options
 * @returns {TileLayer} Created tile layer
 */
export function createTileLayer(url, layerName, options = {}) {
  const {
    opacity = 1,
    visible = true,
    minScale = 0,
    maxScale = 0,
    ...additionalOptions
  } = options;

  try {
    return new TileLayer({
      url,
      title: layerName,
      opacity,
      visible,
      minScale,
      maxScale,
      ...additionalOptions
    });
  } catch (error) {
    console.error('Error creating tile layer:', error);
    throw error;
  }
}

/**
 * Create a 3D SceneView from a Map
 * @param {Object} config - Configuration object
 * @param {HTMLElement} config.container - Container element for the scene
 * @param {Map} config.map - Map object (optional, creates default if not provided)
 * @param {Object} config.camera - Initial camera position
 * @param {Object} config.options - Additional SceneView options
 * @returns {Promise<SceneView>} Created SceneView
 */
export async function create3DScene(config) {
  const {
    container,
    map = null,
    camera = {
      position: {
        x: -118.805,
        y: 34.027,
        z: 50000
      },
      tilt: 65
    },
    options = {}
  } = config;

  try {
    // Dynamically import 3D modules
    const [
      { default: Map },
      { default: SceneView },
      { default: WebScene }
    ] = await Promise.all([
      import('@arcgis/core/Map'),
      import('@arcgis/core/views/SceneView'),
      import('@arcgis/core/WebScene')
    ]);

    // Create map if not provided
    const sceneMap = map || new Map({
      basemap: 'satellite',
      ground: 'world-elevation'
    });

    // Create SceneView
    const sceneView = new SceneView({
      container,
      map: sceneMap,
      camera,
      qualityProfile: 'high',
      ...options
    });

    await sceneView.when();
    return sceneView;

  } catch (error) {
    console.error('Error creating 3D scene:', error);
    throw error;
  }
}

/**
 * Create a 3D SceneView from a WebScene portal item
 * @param {Object} config - Configuration object
 * @param {HTMLElement} config.container - Container element for the scene
 * @param {string} config.portalItemId - ArcGIS Online portal item ID
 * @param {Object} config.options - Additional SceneView options
 * @returns {Promise<SceneView>} Created SceneView with WebScene
 */
export async function create3DSceneFromPortal(config) {
  const {
    container,
    portalItemId,
    options = {}
  } = config;

  try {
    // Dynamically import 3D modules
    const [
      { default: SceneView },
      { default: WebScene }
    ] = await Promise.all([
      import('@arcgis/core/views/SceneView'),
      import('@arcgis/core/WebScene')
    ]);

    // Load WebScene from portal
    const webScene = new WebScene({
      portalItem: {
        id: portalItemId
      }
    });

    // Create SceneView
    const sceneView = new SceneView({
      container,
      map: webScene,
      qualityProfile: 'high',
      ...options
    });

    await sceneView.when();
    return sceneView;

  } catch (error) {
    console.error('Error creating 3D scene from portal:', error);
    throw error;
  }
}

/**
 * Convert 2D MapView to 3D SceneView
 * @param {MapView} mapView - Existing 2D MapView
 * @param {HTMLElement} container - Container for the 3D view
 * @returns {Promise<SceneView>} Created SceneView
 */
export async function convertTo3DScene(mapView, container) {
  try {
    const { default: SceneView } = await import('@arcgis/core/views/SceneView');

    // Create SceneView with same map and center
    const sceneView = new SceneView({
      container,
      map: mapView.map,
      center: mapView.center,
      zoom: mapView.zoom,
      camera: {
        position: {
          x: mapView.center.longitude,
          y: mapView.center.latitude,
          z: 50000
        },
        tilt: 65
      }
    });

    await sceneView.when();
    return sceneView;

  } catch (error) {
    console.error('Error converting to 3D scene:', error);
    throw error;
  }
}

// ==========================================
// 2. SKETCH FUNCTIONS
// ==========================================

/**
 * Create sketch widget for a layer
 * @param {Object} config - Configuration object
 * @param {MapView} config.view - Map view
 * @param {GraphicsLayer} config.layer - Graphics layer
 * @param {Array} config.tools - Tools to enable (default: all)
 * @param {Function} config.onCreate - Callback when graphic is created
 * @param {Function} config.onUpdate - Callback when graphic is updated
 * @param {Function} config.onDelete - Callback when graphic is deleted
 * @returns {Sketch} Sketch widget
 */
export function createSketchWidget(config) {
  const {
    view,
    layer,
    tools = ['point', 'polyline', 'polygon', 'rectangle', 'circle'],
    onCreate,
    onUpdate,
    onDelete,
    ...additionalOptions
  } = config;

  const sketch = new Sketch({
    view,
    layer,
    creationMode: 'update',
    availableCreateTools: tools,
    ...additionalOptions
  });

  // Event listeners
  if (onCreate) {
    sketch.on('create', (event) => {
      if (event.state === 'complete') {
        onCreate(event.graphic);
      }
    });
  }

  if (onUpdate) {
    sketch.on('update', (event) => {
      if (event.state === 'complete') {
        onUpdate(event.graphics);
      }
    });
  }

  if (onDelete) {
    sketch.on('delete', (event) => {
      onDelete(event.graphics);
    });
  }

  return sketch;
}

// ==========================================
// 3. GRAPHIC CREATION FUNCTIONS
// ==========================================

/**
 * Add graphic to layer with automatic field detection
 * @param {GraphicsLayer} layer - Target layer
 * @param {Object} graphicData - Graphic data
 * @param {Object} graphicData.geometry - Geometry object
 * @param {Object} graphicData.attributes - Attributes object
 * @param {Object} graphicData.symbol - Symbol object (optional)
 * @returns {Graphic} Created graphic
 */
export function addGraphicToLayer(layer, graphicData) {
  const { geometry, attributes = {}, symbol, popupTemplate } = graphicData;

  const graphic = new Graphic({
    geometry,
    attributes,
    symbol: symbol || createDefaultSymbol(geometry.type),
    popupTemplate: popupTemplate || createPopupFromAttributes(attributes)
  });

  layer.add(graphic);
  return graphic;
}

/**
 * Create multiple graphics at once
 * @param {GraphicsLayer} layer - Target layer
 * @param {Array} graphicsData - Array of graphic data
 * @returns {Array} Array of created graphics
 */
export function addMultipleGraphics(layer, graphicsData) {
  const graphics = graphicsData.map(data => {
    const { geometry, attributes = {}, symbol, popupTemplate } = data;
    return new Graphic({
      geometry,
      attributes,
      symbol: symbol || createDefaultSymbol(geometry.type),
      popupTemplate: popupTemplate || createPopupFromAttributes(attributes)
    });
  });

  layer.addMany(graphics);
  return graphics;
}

// ==========================================
// 4. POPUP TEMPLATE FUNCTIONS
// ==========================================

/**
 * Create dynamic popup template from graphic attributes
 * @param {Object} attributes - Graphic attributes
 * @param {Object} options - Popup options
 * @returns {Object} Popup template
 */
export function createPopupFromAttributes(attributes, options = {}) {
  const {
    title = 'Feature Details',
    excludeFields = ['OBJECTID', 'FID', '_uid'],
    fieldFormatters = {},
    customFields = []
  } = options;

  if (!attributes || Object.keys(attributes).length === 0) {
    return {
      title,
      content: 'No data available'
    };
  }

  // Build field infos
  const fieldInfos = [];
  Object.keys(attributes).forEach(key => {
    if (!excludeFields.includes(key)) {
      const value = attributes[key];
      const formatter = fieldFormatters[key];

      fieldInfos.push({
        fieldName: key,
        label: formatFieldName(key),
        format: formatter || getFieldFormat(value)
      });
    }
  });

  // Add custom fields
  customFields.forEach(field => fieldInfos.push(field));

  return {
    title: attributes.title || attributes.name || attributes.label || title,
    content: [
      {
        type: 'fields',
        fieldInfos
      }
    ]
  };
}

/**
 * Create HTML popup template
 * @param {Object} attributes - Graphic attributes
 * @param {Function} contentBuilder - Custom content builder function
 * @returns {Object} Popup template
 */
export function createHTMLPopup(attributes, contentBuilder) {
  const content = contentBuilder ? contentBuilder(attributes) : buildDefaultHTMLContent(attributes);

  return {
    title: attributes.title || attributes.name || 'Details',
    content
  };
}

/**
 * Build default HTML content for popup
 * @param {Object} attributes - Attributes object
 * @returns {string} HTML content
 */
function buildDefaultHTMLContent(attributes) {
  const rows = Object.entries(attributes)
    .filter(([key]) => !['OBJECTID', 'FID', '_uid'].includes(key))
    .map(([key, value]) => `
      <tr>
        <td style="padding: 8px; font-weight: 600; color: #555;">${formatFieldName(key)}</td>
        <td style="padding: 8px;">${formatFieldValue(value)}</td>
      </tr>
    `).join('');

  return `
    <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
      <tbody>${rows}</tbody>
    </table>
  `;
}

// ==========================================
// 5. SYMBOL CREATION FUNCTIONS
// ==========================================

/**
 * Create symbol for graphic
 * @param {string} type - Geometry type ('point', 'polyline', 'polygon')
 * @param {Object} options - Symbol options
 * @returns {Object} Symbol object
 */
export function createSymbol(type, options = {}) {
  switch (type.toLowerCase()) {
    case 'point':
      return createPointSymbol(options);
    case 'polyline':
      return createPolylineSymbol(options);
    case 'polygon':
      return createPolygonSymbol(options);
    default:
      return createPointSymbol(options);
  }
}

/**
 * Create point symbol
 * @param {Object} options - Point symbol options
 * @returns {Object} Point symbol
 */
export function createPointSymbol(options = {}) {
  const {
    style = 'circle',
    color = [0, 122, 194, 0.8],
    size = 12,
    outlineColor = [255, 255, 255],
    outlineWidth = 2,
    icon = null
  } = options;

  if (icon) {
    return {
      type: 'picture-marker',
      url: icon,
      width: size + 'px',
      height: size + 'px'
    };
  }

  return {
    type: 'simple-marker',
    style,
    color,
    size,
    outline: {
      color: outlineColor,
      width: outlineWidth
    }
  };
}

/**
 * Create polyline symbol
 * @param {Object} options - Polyline symbol options
 * @returns {Object} Polyline symbol
 */
export function createPolylineSymbol(options = {}) {
  const {
    color = [0, 122, 194, 0.8],
    width = 3,
    style = 'solid'
  } = options;

  return {
    type: 'simple-line',
    color,
    width,
    style
  };
}

/**
 * Create polygon symbol
 * @param {Object} options - Polygon symbol options
 * @returns {Object} Polygon symbol
 */
export function createPolygonSymbol(options = {}) {
  const {
    color = [0, 122, 194, 0.3],
    outlineColor = [0, 122, 194, 0.8],
    outlineWidth = 2,
    style = 'solid'
  } = options;

  return {
    type: 'simple-fill',
    color,
    style,
    outline: {
      color: outlineColor,
      width: outlineWidth
    }
  };
}

/**
 * Create text symbol
 * @param {Object} options - Text symbol options
 * @returns {Object} Text symbol
 */
export function createTextSymbol(options = {}) {
  const {
    text = '',
    color = [0, 0, 0],
    size = 12,
    family = 'arial-unicode-ms',
    weight = 'normal',
    haloColor = [255, 255, 255],
    haloSize = 1
  } = options;

  return {
    type: 'text',
    color,
    text,
    font: {
      size,
      family,
      weight
    },
    haloColor,
    haloSize
  };
}

// ==========================================
// 6. MAP TOOLS & WIDGETS
// ==========================================

/**
 * Add all essential map tools to view
 * @param {MapView} view - Map view
 * @param {Object} options - Widget options
 * @returns {Object} Object containing all widgets
 */
export function addMapTools(view, options = {}) {
  const {
    includeHome = true,
    includeZoom = true,
    includeSearch = true,
    includeCoordinates = true,
    includeLocate = true,
    includeCompass = true,
    includeScaleBar = true,
    positions = {}
  } = options;

  const widgets = {};

  // Home widget
  if (includeHome) {
    widgets.home = new Home({ view });
    view.ui.add(widgets.home, positions.home || 'top-left');
  }

  // Zoom widget (manual, since it's default)
  if (includeZoom) {
    widgets.zoom = new Zoom({ view });
    view.ui.add(widgets.zoom, positions.zoom || 'top-left');
  }

  // Search widget
  if (includeSearch) {
    widgets.search = new Search({ view });
    view.ui.add(widgets.search, positions.search || 'top-right');
  }

  // Coordinate Conversion widget
  if (includeCoordinates) {
    widgets.coordinates = new CoordinateConversion({ view });
    view.ui.add(widgets.coordinates, positions.coordinates || 'bottom-right');
  }

  // Locate widget (GPS)
  if (includeLocate) {
    widgets.locate = new Locate({ view });
    view.ui.add(widgets.locate, positions.locate || 'top-left');
  }

  // Compass widget
  if (includeCompass) {
    widgets.compass = new Compass({ view });
    view.ui.add(widgets.compass, positions.compass || 'top-left');
  }

  // Scale bar
  if (includeScaleBar) {
    widgets.scaleBar = new ScaleBar({
      view,
      unit: 'dual'
    });
    view.ui.add(widgets.scaleBar, positions.scaleBar || 'bottom-left');
  }

  return widgets;
}

/**
 * Add specific widget to map
 * @param {MapView} view - Map view
 * @param {string} widgetType - Type of widget
 * @param {Object} options - Widget options
 * @returns {Object} Created widget
 */
export function addWidget(view, widgetType, options = {}) {
  const { position = 'top-right', ...widgetOptions } = options;

  let widget;

  switch (widgetType.toLowerCase()) {
    case 'basemapgallery':
      widget = new BasemapGallery({ view, ...widgetOptions });
      break;
    case 'layerlist':
      widget = new LayerList({ view, ...widgetOptions });
      break;
    case 'legend':
      widget = new Legend({ view, ...widgetOptions });
      break;
    case 'fullscreen':
      widget = new Fullscreen({ view, ...widgetOptions });
      break;
    case 'print':
      widget = new Print({ view, ...widgetOptions });
      break;
    case 'measurement':
      widget = new Measurement({ view, ...widgetOptions });
      break;
    default:
      console.warn(`Unknown widget type: ${widgetType}`);
      return null;
  }

  view.ui.add(widget, position);
  return widget;
}

// ==========================================
// 7. EXPAND WIDGET FUNCTIONS
// ==========================================

/**
 * Create expand widget
 * @param {MapView} view - Map view
 * @param {Object} options - Expand options
 * @returns {Expand} Expand widget
 */
export function createExpandWidget(view, options = {}) {
  const {
    content,
    expandIcon = 'info',
    expandTooltip = 'Expand',
    position = 'top-right',
    expanded = false,
    mode = 'floating',
    ...additionalOptions
  } = options;

  const expand = new Expand({
    view,
    content,
    expandIcon,
    expandTooltip,
    expanded,
    mode,
    ...additionalOptions
  });

  view.ui.add(expand, position);
  return expand;
}

/**
 * Create expand with widget inside
 * @param {MapView} view - Map view
 * @param {Object} widget - Widget to wrap
 * @param {Object} options - Expand options
 * @returns {Expand} Expand widget
 */
export function createExpandWithWidget(view, widget, options = {}) {
  return createExpandWidget(view, {
    content: widget,
    ...options
  });
}

// ==========================================
// 8. PUSHPIN & FULLSCREEN WIDGETS
// ==========================================

/**
 * Add pushpin (marker) at location
 * @param {GraphicsLayer} layer - Graphics layer
 * @param {Object} location - Location object {longitude, latitude}
 * @param {Object} options - Pushpin options
 * @returns {Graphic} Created pushpin graphic
 */
export function addPushpin(layer, location, options = {}) {
  const {
    title = 'Pin',
    color = [226, 119, 40],
    icon = null,
    attributes = {},
    ...symbolOptions
  } = options;

  const geometry = {
    type: 'point',
    longitude: location.longitude || location.x,
    latitude: location.latitude || location.y
  };

  const symbol = icon
    ? { type: 'picture-marker', url: icon, width: '32px', height: '32px' }
    : createPointSymbol({ color, size: 16, ...symbolOptions });

  return addGraphicToLayer(layer, {
    geometry,
    attributes: { title, ...attributes },
    symbol
  });
}

/**
 * Add fullscreen widget
 * @param {MapView} view - Map view
 * @param {string} position - Widget position
 * @returns {Fullscreen} Fullscreen widget
 */
export function addFullscreenWidget(view, position = 'top-right') {
  const fullscreen = new Fullscreen({ view });
  view.ui.add(fullscreen, position);
  return fullscreen;
}

// ==========================================
// 9. GEOSPATIAL ANALYSIS TEMPLATES
// ==========================================

/**
 * Buffer analysis
 * @param {Geometry} geometry - Input geometry
 * @param {number} distance - Buffer distance
 * @param {string} unit - Distance unit
 * @returns {Promise<Geometry>} Buffered geometry
 */
export async function bufferGeometry(geometry, distance, unit = 'meters') {
  const { default: geometryEngine } = await import('@arcgis/core/geometry/geometryEngine');
  return geometryEngine.buffer(geometry, distance, unit);
}

/**
 * Find features within distance
 * @param {Array} features - Array of features
 * @param {Geometry} targetGeometry - Target geometry
 * @param {number} distance - Search distance
 * @param {string} unit - Distance unit
 * @returns {Array} Features within distance
 */
export async function findFeaturesWithinDistance(features, targetGeometry, distance, unit = 'meters') {
  const { default: geometryEngine } = await import('@arcgis/core/geometry/geometryEngine');

  return features.filter(feature => {
    const dist = geometryEngine.distance(feature.geometry, targetGeometry, unit);
    return dist <= distance;
  });
}

/**
 * Calculate area
 * @param {Geometry} polygon - Polygon geometry
 * @param {string} unit - Area unit
 * @returns {number} Area value
 */
export async function calculateArea(polygon, unit = 'square-meters') {
  const { default: geometryEngine } = await import('@arcgis/core/geometry/geometryEngine');
  return geometryEngine.geodesicArea(polygon, unit);
}

/**
 * Calculate length
 * @param {Geometry} polyline - Polyline geometry
 * @param {string} unit - Length unit
 * @returns {number} Length value
 */
export async function calculateLength(polyline, unit = 'meters') {
  const { default: geometryEngine } = await import('@arcgis/core/geometry/geometryEngine');
  return geometryEngine.geodesicLength(polyline, unit);
}

/**
 * Check if geometries intersect
 * @param {Geometry} geometry1 - First geometry
 * @param {Geometry} geometry2 - Second geometry
 * @returns {boolean} True if intersect
 */
export async function checkIntersection(geometry1, geometry2) {
  const { default: geometryEngine } = await import('@arcgis/core/geometry/geometryEngine');
  return geometryEngine.intersects(geometry1, geometry2);
}

/**
 * Get intersection geometry
 * @param {Geometry} geometry1 - First geometry
 * @param {Geometry} geometry2 - Second geometry
 * @returns {Geometry} Intersection geometry
 */
export async function getIntersection(geometry1, geometry2) {
  const { default: geometryEngine } = await import('@arcgis/core/geometry/geometryEngine');
  return geometryEngine.intersect(geometry1, geometry2);
}

/**
 * Check if point is within polygon
 * @param {Geometry} point - Point geometry
 * @param {Geometry} polygon - Polygon geometry
 * @returns {boolean} True if contains
 */
export async function pointInPolygon(point, polygon) {
  const { default: geometryEngine } = await import('@arcgis/core/geometry/geometryEngine');
  return geometryEngine.contains(polygon, point);
}

/**
 * Find nearest feature
 * @param {Geometry} targetGeometry - Target geometry
 * @param {Array} features - Array of features
 * @returns {Object} Nearest feature with distance
 */
export async function findNearestFeature(targetGeometry, features) {
  const { default: geometryEngine } = await import('@arcgis/core/geometry/geometryEngine');

  let nearest = null;
  let minDistance = Infinity;

  features.forEach(feature => {
    const distance = geometryEngine.distance(targetGeometry, feature.geometry, 'meters');
    if (distance < minDistance) {
      minDistance = distance;
      nearest = feature;
    }
  });

  return { feature: nearest, distance: minDistance };
}

// ==========================================
// 10. FEATURE TABLE WIDGET
// ==========================================

/**
 * Create FeatureTable widget from a FeatureLayer
 * Automatically captures all necessary configurations from the layer
 * @param {Object} config - Configuration object
 * @param {FeatureLayer} config.layer - FeatureLayer to display
 * @param {MapView} config.view - Map view (optional, for selection sync)
 * @param {HTMLElement} config.container - Container element for the table
 * @param {Object} config.options - Additional FeatureTable options
 * @returns {Promise<FeatureTable>} Configured FeatureTable widget
 */
export async function createFeatureTable(config) {
  const {
    layer,
    view = null,
    container = null,
    options = {}
  } = config;

  if (!layer || !layer.fields) {
    throw new Error('A valid FeatureLayer with fields is required');
  }

  // Wait for layer to load to get all field information
  await layer.load();

  // Build field configs from layer fields
  const fieldConfigs = layer.fields
    .filter(field => {
      // Exclude system fields unless specified
      const excludeFields = options.excludeFields || [
        'OBJECTID',
        'FID',
        'Shape',
        'Shape_Length',
        'Shape_Area',
        'SHAPE_Length',
        'SHAPE_Area'
      ];
      return !excludeFields.includes(field.name);
    })
    .map(field => {
      // Create field config with proper formatting
      const fieldConfig = {
        name: field.name,
        label: field.alias || formatFieldName(field.name),
        direction: 'asc',
        editable: field.editable !== false
      };

      // Add format based on field type
      if (field.type === 'date') {
        fieldConfig.format = {
          dateFormat: 'short-date-short-time'
        };
      } else if (field.type === 'double' || field.type === 'single') {
        fieldConfig.format = {
          digitSeparator: true,
          places: 2
        };
      } else if (field.type === 'integer' || field.type === 'small-integer') {
        fieldConfig.format = {
          digitSeparator: true,
          places: 0
        };
      }

      return fieldConfig;
    });

  // Configure the FeatureTable
  const featureTableConfig = {
    layer,
    view,
    container,

    // Field configurations
    fieldConfigs,

    // Enable selection
    highlightEnabled: true,

    // Menu configuration
    menuConfig: {
      items: [
        {
          label: 'Zoom to feature',
          iconClass: 'esri-icon-zoom-in-magnifying-glass',
          clickFunction: async (event) => {
            if (view && event.feature) {
              await view.goTo({
                target: event.feature.geometry,
                zoom: view.zoom < 15 ? 15 : view.zoom
              });
            }
          }
        },
        {
          label: 'Show popup',
          iconClass: 'esri-icon-description',
          clickFunction: (event) => {
            if (view && event.feature) {
              view.popup.open({
                features: [event.feature],
                location: event.feature.geometry
              });
            }
          }
        }
      ]
    },

    // Allow multiple row selection
    multiSortEnabled: true,

    // Table options
    ...options
  };

  // Create the FeatureTable widget
  const featureTable = new FeatureTable(featureTableConfig);

  // Add selection sync between table and map if view is provided
  if (view) {
    // When rows are selected in table, highlight on map
    featureTable.on('selection-change', (event) => {
      // Get selected features
      event.added.forEach((item) => {
        view.whenLayerView(layer).then((layerView) => {
          if (layerView.highlight) {
            layerView.highlight(item.feature);
          }
        });
      });
    });

    // When features are clicked on map, select in table
    view.on('click', (event) => {
      view.hitTest(event).then((response) => {
        const graphic = response.results.find(
          (result) => result.graphic.layer === layer
        )?.graphic;

        if (graphic) {
          featureTable.selectRows(graphic);
        }
      });
    });
  }

  return featureTable;
}

/**
 * Create FeatureTable with custom columns
 * @param {Object} config - Configuration object
 * @param {FeatureLayer} config.layer - FeatureLayer to display
 * @param {Array} config.columns - Array of column configurations
 * @param {MapView} config.view - Map view (optional)
 * @param {HTMLElement} config.container - Container element
 * @returns {FeatureTable} Configured FeatureTable widget
 */
export function createFeatureTableWithColumns(config) {
  const { layer, columns, view = null, container = null, options = {} } = config;

  const featureTable = new FeatureTable({
    layer,
    view,
    container,
    fieldConfigs: columns,
    highlightEnabled: true,
    multiSortEnabled: true,
    ...options
  });

  return featureTable;
}

/**
 * Create a simple FeatureTable with default settings
 * @param {FeatureLayer} layer - FeatureLayer to display
 * @param {HTMLElement} container - Container element for the table
 * @returns {Promise<FeatureTable>} FeatureTable widget
 */
export async function createSimpleFeatureTable(layer, container) {
  return await createFeatureTable({
    layer,
    container
  });
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

/**
 * Format field name for display
 * @param {string} fieldName - Field name
 * @returns {string} Formatted field name
 */
function formatFieldName(fieldName) {
  return fieldName
    .replace(/_/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase());
}

/**
 * Format field value for display
 * @param {any} value - Field value
 * @returns {string} Formatted value
 */
function formatFieldValue(value) {
  if (value === null || value === undefined) return 'N/A';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (typeof value === 'number') return value.toLocaleString();
  if (Array.isArray(value)) return value.join(', ');
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

/**
 * Get field format based on value type
 * @param {any} value - Field value
 * @returns {Object|null} Format object
 */
function getFieldFormat(value) {
  if (typeof value === 'number') {
    return {
      digitSeparator: true,
      places: 2
    };
  }
  return null;
}

/**
 * Create default symbol based on geometry type
 * @param {string} geometryType - Geometry type
 * @returns {Object} Symbol object
 */
function createDefaultSymbol(geometryType) {
  switch (geometryType.toLowerCase()) {
    case 'point':
      return createPointSymbol();
    case 'polyline':
      return createPolylineSymbol();
    case 'polygon':
      return createPolygonSymbol();
    default:
      return createPointSymbol();
  }
}

/**
 * Clear all graphics from layer
 * @param {GraphicsLayer} layer - Graphics layer
 */
export function clearGraphics(layer) {
  if (layer && layer.removeAll) {
    layer.removeAll();
  }
}

/**
 * Zoom to graphic
 * @param {MapView} view - Map view
 * @param {Graphic} graphic - Target graphic
 * @param {Object} options - Zoom options
 */
export async function zoomToGraphic(view, graphic, options = {}) {
  const { zoom = 12, duration = 1000 } = options;

  await view.goTo(
    {
      target: graphic.geometry,
      zoom
    },
    { duration }
  );
}

/**
 * Zoom to multiple graphics
 * @param {MapView} view - Map view
 * @param {Array} graphics - Array of graphics
 */
export async function zoomToGraphics(view, graphics) {
  if (!graphics || graphics.length === 0) return;

  await view.goTo(graphics.map(g => g.geometry));
}

export default {
  // Layer functions
  createLayerFromUrl,
  createGraphicsLayer,
  createWMSLayer,
  createTileLayer,

  // 3D Map functions
  create3DScene,
  create3DSceneFromPortal,
  convertTo3DScene,

  // Sketch functions
  createSketchWidget,

  // Graphic functions
  addGraphicToLayer,
  addMultipleGraphics,
  clearGraphics,
  zoomToGraphic,
  zoomToGraphics,

  // Popup functions
  createPopupFromAttributes,
  createHTMLPopup,

  // Symbol functions
  createSymbol,
  createPointSymbol,
  createPolylineSymbol,
  createPolygonSymbol,
  createTextSymbol,

  // Widget functions
  addMapTools,
  addWidget,
  createExpandWidget,
  createExpandWithWidget,
  addPushpin,
  addFullscreenWidget,

  // Analysis functions
  bufferGeometry,
  findFeaturesWithinDistance,
  calculateArea,
  calculateLength,
  checkIntersection,
  getIntersection,
  pointInPolygon,
  findNearestFeature,

  // FeatureTable functions
  createFeatureTable,
  createFeatureTableWithColumns,
  createSimpleFeatureTable
};