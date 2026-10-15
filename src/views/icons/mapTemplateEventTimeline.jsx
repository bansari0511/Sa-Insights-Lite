/* src/components/MapTemplate.jsx
   Updated: robust popup open after zoom + hitTest handling
*/
import React, { useEffect, useRef } from 'react';

import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import Graphic from '@arcgis/core/Graphic';
import Sketch from '@arcgis/core/widgets/Sketch';
import Home from '@arcgis/core/widgets/Home';
import Compass from '@arcgis/core/widgets/Compass';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import MapImageLayer from '@arcgis/core/layers/MapImageLayer';
import TileLayer from "@arcgis/core/layers/TileLayer";
import LayerList from "@arcgis/core/widgets/LayerList.js";
import Expand from "@arcgis/core/widgets/Expand.js";
import TimeSlider from "@arcgis/core/widgets/TimeSlider.js";
import Popup from "@arcgis/core/widgets/Popup";
import  { getMap, getView, MapProvider } from '../../maputility/MapProvider';
import { mapTheme, eventCategories, useThemeContext } from '../../theme';

// Define 6 event categories with unique colors and icons (matching mapandevent.js)
const EVENT_CATEGORIES = eventCategories;

let graphicsAddedCheck = null;
let timeExtentUpdateTimer = null;
// Helper to get category config with fallback
const getCategoryConfig = (category) => {
  return EVENT_CATEGORIES[category] || {
    color: '#757575', // Gray for unknown
    icon: '📍', // Pin
    name: category || 'Other'
  };
};

// Create SVG data URL for category marker - No white border
const createCategoryMarkerSVG = (categoryConfig, size = 28) => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" fill="${categoryConfig.color}" opacity="1"/>
      <circle cx="12" cy="12" r="6" fill="${categoryConfig.color}" opacity="0.8"/>
      <text x="12" y="16" text-anchor="middle" font-size="10" fill="#ffffff" font-weight="bold">${categoryConfig.icon}</text>
    </svg>
  `;
  return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
};

export default function MapTemplate({ onMapReady, basemap = 'arcgis-topographic' }) {
  const { isDark } = useThemeContext();
  const mapDivRef = useRef(null);
  const viewRef = useRef(null);

  useEffect(() => {

/* let clickHandle = null;
let zoomWatchHandle = null;
let legendExpand = null;
let layerListExpand = null;
let timeSliderExpand = null;
let view = null; */

const initMap = async () => {

await MapProvider(mapDivRef.current);
const map = getMap();


 /* const layer = map.layers.find(l => l.title === "Janes Events");
  layer.visible = true;
 */


/* const view = new MapView({
                     container: mapDivRef.current,
                     map,
                     scale: 40000000,
                     center: [78.19342753563451, 21.591641645634088],
                     constraints: {
                     minScale: 100000000,
                     },
                     popup: {
                       dockEnabled: true,
                       autoOpenEnabled: true,
                       dockOptions: {
                         // Ignore the default sizes that trigger responsive docking
                         breakpoint: false,
                         position: "top-right",
                       },
                     },
                     highlightOptions: {
                       color: [255, 180, 0, 1],
                       haloColor: [255, 0, 0, 1],
                       haloOpacity: 1,
                       fillOpacity: 0.01,
                       shadowColor: "black",
                       shadowOpacity: 1,
                     },
                   }); */
/* const view = new MapView({
      container: mapDivRef.current,
       map,
       scale: 40000000,
       center: [78.19342753563451, 21.591641645634088],

    }); */
   const view = getView();

   if(!map || !view)
              {
               throw new error('map or view failed to initialize.');
              }

              await view.when();
    viewRef.current = view;

    function ensurePopupIntitialized(v) {

        if(!v.popup || typeof v.popup.open != 'function') {
            v.popupEnabled = true;
            v.popup = new Popup ({
                view:v,
                dockEnabled: true,
                autoOpenEnabled: true,
                dockOptions: {breakpoint:false, position:"top-right"}
                });
            }
        }

( async () => {
    await view.when();
    ensurePopupIntitialized(view);
    })();


    // graphics layer for events
    const eventsLayer = new GraphicsLayer({ title: 'Events' });
    map.add(eventsLayer);

    // graphics layer for labels (shown only at zoom > 8)
    const labelsLayer = new GraphicsLayer({ title: 'Event Labels' });
    map.add(labelsLayer);

    // Create legend container showing ALL available icons
    const legendContainer = document.createElement('div');
    legendContainer.style.backgroundColor = isDark ? '#232328' : 'white';
    legendContainer.style.color = isDark ? '#EDEDF0' : '#333';
    legendContainer.style.padding = '12px';
    legendContainer.style.maxHeight = '400px';
    legendContainer.style.overflowY = 'auto';
    legendContainer.style.minWidth = '250px';
    legendContainer.style.maxWidth = '300px';

    // Build legend with 6 event categories
    const buildLegend = () => {
      legendContainer.innerHTML = '';

      const title = document.createElement('div');
      title.style.fontWeight = '600';
      title.style.marginBottom = '12px';
      title.style.fontSize = '14px';
      title.style.color = isDark ? '#EDEDF0' : '#333';
      title.textContent = 'Event Categories';
      legendContainer.appendChild(title);

      Object.entries(EVENT_CATEGORIES).forEach(([key, config]) => {
        const row = document.createElement('div');
        row.style.display = 'flex';
        row.style.alignItems = 'center';
        row.style.gap = '10px';
        row.style.padding = '8px 10px';
        row.style.borderRadius = '6px';
        row.style.border = `2px solid ${config.color}30`;
        row.style.marginBottom = '8px';
        row.style.backgroundColor = isDark ? '#1A1A1E' : 'white';
        row.style.transition = 'all 0.2s';

        row.onmouseenter = () => {
          row.style.backgroundColor = isDark ? '#2A2A2F' : `${config.color}10`;
          row.style.borderColor = config.color;
          row.style.transform = 'translateX(4px)';
        };
        row.onmouseleave = () => {
          row.style.backgroundColor = isDark ? '#1A1A1E' : 'white';
          row.style.borderColor = `${config.color}30`;
          row.style.transform = 'translateX(0)';
        };

        // Color dot
        const colorDot = document.createElement('div');
        colorDot.style.width = '16px';
        colorDot.style.height = '16px';
        colorDot.style.backgroundColor = config.color;
        colorDot.style.borderRadius = '50%';
        colorDot.style.flexShrink = '0';
        colorDot.style.boxShadow = `0 0 6px ${config.color}80`;

        // Icon emoji
        const icon = document.createElement('span');
        icon.textContent = config.icon;
        icon.style.fontSize = '18px';
        icon.style.flexShrink = '0';

        // Name
        const name = document.createElement('span');
        name.style.flex = '1';
        name.style.fontSize = '13px';
        name.style.fontWeight = '600';
        name.style.color = config.color;
        name.textContent = config.name;

        row.appendChild(colorDot);
        row.appendChild(icon);
        row.appendChild(name);
        legendContainer.appendChild(row);
      });

      const footer = document.createElement('div');
      footer.style.marginTop = '12px';
      footer.style.paddingTop = '12px';
      footer.style.borderTop = isDark ? '2px solid #313136' : '2px solid #e0e0e0';
      footer.style.fontSize = '11px';
      footer.style.color = isDark ? '#85858F' : '#666';
      footer.style.fontStyle = 'italic';
      footer.textContent = 'Click on map points to view event details';
      legendContainer.appendChild(footer);
    };

    // Build the legend once on mount
    buildLegend();
view.when(() => {
    const legendExpand = new Expand({
      expandIcon: "legend",
      view: view,
      content: legendContainer,
      expandTooltip: "Event Categories Legend",
      expanded: false,
    });

    let layerList = new LayerList({
          view: view,
        });

        let layerListExpand = new Expand({
          expandIcon: "layers",
          view: view,
          content: layerList,
          expandTooltip: "Layers",
        });

    view.ui.add(layerListExpand, {
        position: "top-left",
      });

    view.ui.add(legendExpand, {
        position: "top-right",
      });
});
    // Create TimeSlider widget
    const timeSlider = new TimeSlider({
      container: document.createElement("div"),
      view: view,
      mode: "time-window",
      playRate: 2000, // 2 seconds per step
      loop: true,
      timeVisible: true,
      layout: "compact"
    });

    // Wrap TimeSlider in Expand widget
    const timeSliderExpand = new Expand({
      expandIcon: "clock",
      view: view,
      content: timeSlider,
      expandTooltip: "Time Filter",
      expanded: false,
      mode: "floating"
    });

    // Add TimeSlider Expand widget to the bottom-right of the map
    view.ui.add(timeSliderExpand, {
      position: "bottom-right"
    });

// 🔧 FIX 1: Initialize TimeSlider with default extent first
const initTimeSliderExtent = () => {
  const now = new Date();
  const pastYear = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());

  // Set initial full extent (will be updated when graphics load)
  timeSlider.fullTimeExtent = {
    start: pastYear,
    end: now
  };

  // Set initial time extent to show everything
  timeSlider.timeExtent = {
    start: pastYear,
    end: now
  };

  // Set initial stops
  timeSlider.stops = {
    interval: {
      value: 1,
      unit: "months"
    }
  };
};

// Call initialization
initTimeSliderExtent();


// 🔧 FIX 2: Watch for graphics changes to update TimeSlider

const watchGraphicsChanges = () => {
  const checkGraphics = () => {
    const graphics = eventsLayer.graphics;
    const graphicsArray = Array.isArray(graphics) ? graphics : graphics.items || [];

    if (graphicsArray.length > 0) {
      updateTimeSliderExtent();
      if (graphicsAddedCheck) {
        clearInterval(graphicsAddedCheck);
        graphicsAddedCheck = null;
      }
    }
  };

  // Check periodically until graphics are loaded
  graphicsAddedCheck = setInterval(checkGraphics, 1000);

  // Also check when graphics change
  eventsLayer.watch('graphics', () => {
    updateTimeSliderExtent();
    if (graphicsAddedCheck) {
      clearInterval(graphicsAddedCheck);
      graphicsAddedCheck = null;
    }
  });
};

// Start watching for graphics
watchGraphicsChanges();


   // 🔧 FIX 5: Watch for TimeSlider changes and filter graphics
   timeSlider.watch("timeExtent", (timeExtent) => {
     if (!timeExtent) {
       // Show all graphics if no time extent
       const graphics = eventsLayer.graphics;
       const graphicsArray = Array.isArray(graphics) ? graphics : graphics.items || [];
       graphicsArray.forEach(graphic => {
         graphic.visible = true;
       });
       return;
     }

     const startTime = timeExtent.start.getTime();
     const endTime = timeExtent.end.getTime();

     const graphics = eventsLayer.graphics;
     const graphicsArray = Array.isArray(graphics) ? graphics : graphics.items || [];

     let visibleCount = 0;
     graphicsArray.forEach(graphic => {
       const eventDateValue = graphic.attributes?.lastModifiedDate || graphic.attributes?.start_date;

       if (!eventDateValue) {
         graphic.visible = false;
         return;
       }

       let eventDate;
       if (eventDateValue instanceof Date) {
         eventDate = eventDateValue;
       } else {
         eventDate = new Date(eventDateValue);
       }

       if (isNaN(eventDate.getTime())) {
         graphic.visible = false;
         return;
       }

       const normalizedEventDate = new Date(Date.UTC(
         eventDate.getFullYear(),
         eventDate.getMonth(),
         eventDate.getDate(),
         0, 0, 0, 0
       ));

       const eventTime = normalizedEventDate.getTime();
       const isVisible = (eventTime >= startTime && eventTime <= endTime);
       graphic.visible = isVisible;

       if (isVisible) visibleCount++;
     });

     console.log(`TimeSlider filtering: ${visibleCount}/${graphicsArray.length} events visible`);
   });
    // widgets
    /* const homeWidget = new Home({ view });
    const compassWidget = new Compass({ view });
    view.ui.add(homeWidget, 'top-left');
    view.ui.add(compassWidget, 'top-left'); */

    // helper: category -> rgba color (kept for backward compatibility)
    function mapCategoryColor(category) {
      const map = {
        'Terrorism & Insurgency': [220, 60, 60, 0.95],
        Conflict: [220, 140, 40, 0.95],
        Accident: [200, 200, 60, 0.95],
      };
      return map[category] || [30, 144, 255, 0.95];
    }
    function rgbaToCss(arr) {
      if (!Array.isArray(arr)) return arr || '#1e90ff';
      const [r, g, b, a = 1] = arr;
      return `rgba(${r},${g},${b},${a})`;
    }

    /**
     * Create dynamic popup template from graphic attributes
     * @param {Graphic} graphic - The graphic object with attributes
     * @returns {Object} - ArcGIS popup template
     */
    function createPopupTemplateFromGraphic(graphic) {
      if (!graphic || !graphic.attributes) {
        return {
          title: 'Event',
          content: 'No data available'
        };
      }

      const attr = graphic.attributes;

      // Define field display configuration
      const fieldConfig = {
        // Primary fields (always show if available)
        primary: [
          { key: 'iconType', label: 'Type', isIconType: true },
          { key: 'description', label: 'Description', isLongText: true },
        ],
        // Secondary fields (show if available)
        secondary: [
          { key: 'start_date', label: 'Start Date', isDate: true },
          { key: 'end_date', label: 'End Date', isDate: true },
          { key: 'country', label: 'Country' },
          { key: 'location', label: 'Location' },
          { key: 'latitude', label: 'Latitude', isCoordinate: true },
          { key: 'longitude', label: 'Longitude', isCoordinate: true },
          { key: 'labels', label: 'Labels', isArray: true },
          { key: 'sources_source_type_source_url_social_media', label: 'Source', isURL: true },
        ],
        // Fields to exclude from display
        exclude: ['_uid', 'OBJECTID', 'iconColor','eventCategory','eventLocation','eventCountry']
      };

      // Build table rows
      let tableRows = [];

      // Add icon type if available
      if (attr.iconType && attr.iconColor) {
        tableRows.push(`
          <tr>
            <td style="padding: 8px; font-weight: 600; color: #555; border-bottom: 1px solid #e0e0e0; width: 35%; vertical-align: top;">Type</td>
            <td style="padding: 8px; border-bottom: 1px solid #e0e0e0; vertical-align: top;">
              <span style="color: ${attr.iconColor}; font-weight: 600;">● ${attr.iconType}</span>
            </td>
          </tr>
        `);
      }

      // Add description if available (spans full width)
      if (attr.description) {
        tableRows.push(`
          <tr>
            <td colspan="2" style="padding: 12px 8px; background-color: #f9f9f9; border-bottom: 1px solid #e0e0e0;">
              <div style="font-style: italic; color: #333; line-height: 1.5;">${attr.description}</div>
            </td>
          </tr>
        `);
      }

      // Process secondary fields
      fieldConfig.secondary.forEach(field => {
        const value = attr[field.key];

        if (value !== undefined && value !== null && value !== '') {
          let displayValue = value;

          // Format based on field type
          if (field.isDate && value) {
            displayValue = new Date(value).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            });
          } else if (field.isArray && Array.isArray(value)) {
            displayValue = value.join(', ');
          } else if (field.isCoordinate) {
            displayValue = Number(value).toFixed(6);
          } else if (field.isURL && value) {
            displayValue = `<a href="${value}" target="_blank" rel="noreferrer" style="color: #0066cc; text-decoration: none;">View Source →</a>`;
          }

          tableRows.push(`
            <tr>
              <td style="padding: 8px; font-weight: 600; color: #555; border-bottom: 1px solid #e0e0e0; width: 35%; vertical-align: top;">${field.label}</td>
              <td style="padding: 8px; border-bottom: 1px solid #e0e0e0; vertical-align: top;">${displayValue}</td>
            </tr>
          `);
        }
      });

      // Add any remaining attributes not in the config (auto-discovery)
      const configuredKeys = [
        ...fieldConfig.primary.map(f => f.key),
        ...fieldConfig.secondary.map(f => f.key),
        ...fieldConfig.exclude
      ];

      Object.keys(attr).forEach(key => {
        if (!configuredKeys.includes(key)) {
          const value = attr[key];
          if (value !== undefined && value !== null && value !== '') {
            // Format key name (convert snake_case to Title Case)
            const label = key
              .split('_')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ');

            let displayValue = value;
            if (Array.isArray(value)) {
              displayValue = value.join(', ');
            } else if (typeof value === 'object') {
              displayValue = JSON.stringify(value);
            }

            tableRows.push(`
              <tr>
                <td style="padding: 8px; font-weight: 600; color: #555; border-bottom: 1px solid #e0e0e0; width: 35%; vertical-align: top;">${label}</td>
                <td style="padding: 8px; border-bottom: 1px solid #e0e0e0; vertical-align: top;">${displayValue}</td>
              </tr>
            `);
          }
        }
      });

      // Build complete table HTML
      const tableHTML = `
        <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin: 0;">
          <tbody>
            ${tableRows.join('')}
          </tbody>
        </table>
      `;

      // Determine title
      const title = attr.label || attr.name || attr.title || 'Event Details';

      return {
        title: title,
        content: [
          {
            type: 'text',
            text: tableHTML
          }
        ]
      };
    }

    // open popup for a graphic (robust)
    async function openGraphicPopup(graphic) {
      if (!view || !graphic) {
        console.warn('No view or graphic');
        return;
      }

      try {
        // ensure view ready
        await view.when();

        // ensure geometry exists
        if (!graphic.geometry) {
          console.warn('Graphic has no geometry to open popup at.');
          return;
        }

        console.log('Opening popup for graphic:', graphic);

        // Close any existing popup first (if it exists and has close method)
        try {
          if (view.popup && typeof view.popup.close === 'function') {
            view.popup.close();
          }
        } catch (e) {
          console.warn('Could not close popup:', e);
        }

        // ensure popupTemplate exists; create fallback if needed
        if (!graphic.popupTemplate) {
          graphic.popupTemplate = createPopupTemplateFromGraphic(graphic);
        }

        // Open popup without zooming
        try {
          if (view.popup && typeof view.popup.open === 'function') {
            view.popup.open({
              features: [graphic],
              location: graphic.geometry
            });
          } else {
            console.warn('Popup.open not available, trying alternative method');
            // Alternative: set popup properties directly
            view.popup.features = [graphic];
            view.popup.location = graphic.geometry;
            view.popup.visible = true;
          }
        } catch (e) {
          console.error('Could not open popup:', e);
        }

        // Add highlight effect
        const highlightGraphic = new Graphic({
          geometry: graphic.geometry,
          symbol: {
            type: 'simple-marker',
            color: [255, 255, 0, 0.5],
            size: 40,
            outline: {
              color: [255, 140, 0, 1],
              width: 3
            }
          }
        });

        view.graphics.add(highlightGraphic);

        // Remove highlight after 2 seconds
        setTimeout(() => {
          view.graphics.remove(highlightGraphic);
        }, 2000);

      } catch (err) {
        console.error('openGraphicPopup error:', err);
      }
    }

    // view click -> hitTest to open graphic popup (handles multiple graphics at same location)
    const clickHandle = view.on('click', (evt) => {
      view.hitTest(evt).then((response) => {
        if (!response || !response.results || response.results.length === 0) return;

        // Find ALL graphics that belong to our eventsLayer (not just first one)
        const hits = response.results.filter((r) => r.graphic && r.graphic.layer === eventsLayer);

        if (hits.length === 0) return;

        if (hits.length === 1) {
          // Single graphic - open normal popup
          openGraphicPopup(hits[0].graphic);
        } else {
          // Multiple graphics at same location - show all in popup
          console.log(`Found ${hits.length} events at this location`);

          // Create an array of all graphics
          const graphics = hits.map(h => h.graphic);

          // Open popup with all features
          view.popup.open({
            features: graphics,
            location: evt.mapPoint,
            featureNavigationEnabled: true, // Enable navigation between features
            updateLocationEnabled: true
          });
        }
      }).catch((err) => {
        console.warn('hitTest error', err);
      });
    });

    // Function to update labels based on zoom level
    const updateLabels = () => {
      const currentZoom = view.zoom;

      if (currentZoom > 8) {
        // Show labels - create text graphics for each event
        labelsLayer.removeAll();

        const graphics = eventsLayer.graphics;
        const graphicsArray = Array.isArray(graphics) ? graphics : graphics.items || [];

        graphicsArray.forEach(graphic => {
          const attr = graphic.attributes;
          const labelText = attr.label || attr.title || attr.name || 'Event';

          const labelGraphic = new Graphic({
            geometry: graphic.geometry,
            symbol: {
              type: 'text',
              color: '#000000', // Black color for better readability
              text: labelText,
              xoffset: 0,
              yoffset: 10,
              font: {
                size: 10,
                family: 'arial-unicode-ms',
                weight: 'bold'
              },
              haloColor: '#ffffff',
              haloSize: 1 // Add subtle halo for better visibility
            },
            attributes: {
              _labelFor: attr._uid
            }
          });

          labelsLayer.add(labelGraphic);
        });
      } else {
        // Hide labels
        labelsLayer.removeAll();
      }
    };

    // Watch for zoom changes
    const zoomWatchHandle = view.watch('zoom', () => {
      updateLabels();
    });

    // Timer reference for debouncing time extent updates
   // 🔧 FIX 3: Improved updateTimeSliderExtent function


   const updateTimeSliderExtent = () => {
     // Clear any existing timer
     if (timeExtentUpdateTimer) {
       clearTimeout(timeExtentUpdateTimer);
     }

     // Debounce the update to ensure all graphics are loaded
     timeExtentUpdateTimer = setTimeout(() => {
       const graphics = eventsLayer.graphics;
       const graphicsArray = Array.isArray(graphics) ? graphics : graphics.items || [];

       if (graphicsArray.length === 0) {
         console.log('No graphics to update time extent');
         return;
       }

       console.log(`Updating TimeSlider extent for ${graphicsArray.length} events`);

       // Extract and validate dates from all graphics
       const dates = [];
       graphicsArray.forEach(graphic => {
         const dateValue = graphic.attributes?.lastModifiedDate || graphic.attributes?.start_date;
         if (dateValue) {
           let date;
           if (dateValue instanceof Date) {
             date = dateValue;
           } else if (typeof dateValue === 'string' || typeof dateValue === 'number') {
             date = new Date(dateValue);
           }

           if (date && !isNaN(date.getTime())) {
             const normalizedDate = new Date(Date.UTC(
               date.getFullYear(),
               date.getMonth(),
               date.getDate(),
               0, 0, 0, 0
             ));
             dates.push(normalizedDate);
           }
         }
       });

       if (dates.length === 0) {
         console.warn('No valid dates found in graphics');
         return;
       }

       // Sort dates
       dates.sort((a, b) => a.getTime() - b.getTime());
       const minDate = new Date(dates[0]);
       const maxDate = new Date(dates[dates.length - 1]);

       // Ensure min and max are different
       if (minDate.getTime() === maxDate.getTime()) {
         maxDate.setDate(maxDate.getDate() + 1);
       }

       console.log('TimeSlider extent:', {
         minDate: minDate.toISOString(),
         maxDate: maxDate.toISOString(),
         eventCount: dates.length
       });

       // 🔧 FIX 4: Properly update TimeSlider
       try {
         // First set fullTimeExtent
         timeSlider.fullTimeExtent = {
           start: minDate,
           end: maxDate
         };

         // Then set the time extent to show everything
         timeSlider.timeExtent = {
           start: minDate,
           end: maxDate
         };

         // Update stops based on time range
         const diffDays = (maxDate - minDate) / (1000 * 60 * 60 * 24);
         let intervalValue = 1;
         let intervalUnit = "days";

         if (diffDays > 365) {
           intervalValue = Math.floor(diffDays / 30);
           intervalUnit = "months";
         } else if (diffDays > 30) {
           intervalValue = Math.floor(diffDays / 7);
           intervalUnit = "weeks";
         }

         timeSlider.stops = {
           interval: {
             value: intervalValue,
             unit: intervalUnit
           }
         };

         // Schedule a refresh
         setTimeout(() => {
           try {
             timeSlider.refresh();
           } catch (e) {
             console.warn('TimeSlider refresh error:', e);
           }
         }, 100);

         console.log('TimeSlider updated successfully');
       } catch (error) {
         console.error('Error updating TimeSlider:', error);
       }
     }, 500); // Increased debounce to 500ms
   };

    // API to expose to parent
    const api = {
      map,
      view,
      eventsLayer,
      timeSlider,
      updateTimeSliderExtent,

      // Expose the popup template creator function
      createPopupTemplateFromGraphic,

      addEventGraphic: (feature) => {
        const lon = Number(feature.longitude ?? feature.lon ?? feature.lng ?? 0);
        const lat = Number(feature.latitude ?? feature.lat ?? 0);

        const pointGeom = {
          type: 'point',
          longitude: lon,
          latitude: lat,
        };

        // attributes + stable uid
        const attr = Object.assign({}, feature.properties || {});
        attr._uid = attr._uid || `evt_${Date.now()}_${Math.random().toString(36).slice(2)}`;

        // Get category configuration from event category (use passed values or fallback)
        const eventCategory = feature.eventCategory || attr.event_category || 'Other';
        const categoryConfig = feature.categoryColor && feature.categoryIcon
          ? { color: feature.categoryColor, icon: feature.categoryIcon, name: eventCategory }
          : getCategoryConfig(eventCategory);

        // Create category-based SVG marker (small size to look like a point)

        const iconUrl = createCategoryMarkerSVG(categoryConfig, 20);

        // Use picture marker symbol with category SVG
        const symbol = {
          type: 'picture-marker',
          url: iconUrl,
          width: '18px',
          height: '18px'
        };

        // Create graphic with attributes first
        const graphic = new Graphic({
          geometry: pointGeom,
          symbol,
          attributes: {
            ...attr,
            iconType: categoryConfig.name,
            iconColor: categoryConfig.color,
            event_category: eventCategory
          },
        });

        // Generate popup template dynamically from graphic attributes
        graphic.popupTemplate = createPopupTemplateFromGraphic(graphic);

        eventsLayer.add(graphic);

        // Update labels if zoom > 8
        updateLabels();

        return graphic;
      },

      clearEvents: () => {
        eventsLayer.removeAll();
        labelsLayer.removeAll();
        // Reset TimeSlider
        timeSlider.fullTimeExtent = null;
        timeSlider.timeExtent = null;
      },

      zoomToGraphic: async (graphic) => {
        await openGraphicPopup(graphic);
      },

      createLayerFromUrl: (url, options = {}) => {
        try {
          if (options.type === 'mapimage') {
            const ml = new MapImageLayer({ url, title: options.title || 'MapImageLayer' });
            map.add(ml);
            return ml;
          }
          const fl = new FeatureLayer({ url, title: options.title || 'FeatureLayer' });
          map.add(fl);
          return fl;
        } catch (err) {
          console.warn('createLayerFromUrl failed', err);
          return null;
        }
      },
    };

    // notify parent
    if (typeof onMapReady === 'function') onMapReady(api);
    };
initMap();

    // cleanup on unmount
    return () => {
      try { if (clickHandle && typeof clickHandle.remove === 'function') clickHandle.remove(); } catch (e) {}
      try { if (zoomWatchHandle && typeof zoomWatchHandle.remove === 'function') zoomWatchHandle.remove(); } catch (e) {}

      // Clean up interval
      if (graphicsAddedCheck) {
        clearInterval(graphicsAddedCheck);
      }

      // Clean up timers
      if (timeExtentUpdateTimer) {
        clearTimeout(timeExtentUpdateTimer);
      }

      try {
        if (timeSliderExpand) {
          view.ui.remove(timeSliderExpand);
          timeSliderExpand.destroy();
        }
      } catch (e) {}

      try {
        if (timeSlider) {
          timeSlider.destroy();
        }
      } catch (e) {}

      try {
        if (legendExpand) {
          view.ui.remove(legendExpand);
          legendExpand.destroy();
        }
      } catch (e) {}

      try {
        if (layerListExpand) {
          view.ui.remove(layerListExpand);
          layerListExpand.destroy();
        }
      } catch (e) {}

      try { if (view) view.container = null; } catch (err) {}
    };
  }, [onMapReady, basemap]);

  return (
    <div style={{ height: '100%', width: '100%', borderRadius: 8, overflow: 'hidden', background: isDark ? '#232328' : '#fff' }}>
      <div ref={mapDivRef} style={{ height: '100%', width: '100%' }} />
    </div>
  );
}
