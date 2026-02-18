/**
 * Application Mode Configuration
 *
 * Global feature flags and mode switches for the application.
 *
 * Usage:
 * import { USE_DUMMY_DATA, SHOW_IMO_PROFILE, SHOW_PORT_PROFILE } from '../config/appMode';
 *
 * Environment Variables:
 * Set VITE_USE_DUMMY_DATA=true in .env to use dummy data
 * Set VITE_USE_DUMMY_DATA=false (or omit) to use real API
 * Set VITE_SHOW_IMO_PROFILE=true/false to show/hide IMO Profile in sidebar
 * Set VITE_SHOW_PORT_PROFILE=true/false to show/hide Port Profile in sidebar
 */

/**
 * Master flag to switch between dummy data and real API
 *
 * true  = Use dummy/mock data (no API calls)
 * false = Use real API endpoints (default)
 */
export const USE_DUMMY_DATA =
    import.meta.env?.VITE_USE_DUMMY_DATA === 'true' ||
    import.meta.env?.VITE_USE_DUMMY_DATA === true ||
    false;

/**
 * Feature flag to show/hide IMO Profile in sidebar
 *
 * true  = Show IMO Profile menu item
 * false = Hide IMO Profile menu item (default if undefined)
 */
export const SHOW_IMO_PROFILE =
    import.meta.env?.VITE_SHOW_IMO_PROFILE === 'true' ||
    import.meta.env?.VITE_SHOW_IMO_PROFILE === true;

/**
 * Feature flag to show/hide Port Profile in sidebar
 *
 * true  = Show Port Profile menu item
 * false = Hide Port Profile menu item (default if undefined)
 */
export const SHOW_PORT_PROFILE =
    import.meta.env?.VITE_SHOW_PORT_PROFILE === 'true' ||
    import.meta.env?.VITE_SHOW_PORT_PROFILE === true;

/**
 * Feature flag to show/hide Insights Sidebar across pages
 * Affects: EnhancedNewsTabs (country sidebar), IntelligenceBriefings, MapEventsPage (timeline sidebar)
 *
 * true  = Show sidebar panels (default)
 * false = Hide sidebar panels (full-width content)
 */
export const SHOW_INSIGHTS_SIDEBAR =
    import.meta.env?.VITE_SHOW_INSIGHTS_SIDEBAR === 'false' ||
    import.meta.env?.VITE_SHOW_INSIGHTS_SIDEBAR === false
        ? false
        : true; // Default to true (show sidebar)

// Log in development only
if (import.meta.env.DEV) {
  console.log('[appMode] Raw VITE_SHOW_IMO_PROFILE:', import.meta.env.VITE_SHOW_IMO_PROFILE);
  console.log('[appMode] Raw VITE_SHOW_PORT_PROFILE:', import.meta.env.VITE_SHOW_PORT_PROFILE);
  console.log('[appMode] All VITE env vars:', Object.keys(import.meta.env).filter(k => k.startsWith('VITE_')));
  console.log('[appMode] USE_DUMMY_DATA:', USE_DUMMY_DATA);
  console.log('[appMode] SHOW_IMO_PROFILE:', SHOW_IMO_PROFILE);
  console.log('[appMode] SHOW_PORT_PROFILE:', SHOW_PORT_PROFILE);
  console.log('[appMode] Raw VITE_SHOW_INSIGHTS_SIDEBAR:', import.meta.env.VITE_SHOW_INSIGHTS_SIDEBAR);
  console.log('[appMode] SHOW_INSIGHTS_SIDEBAR:', SHOW_INSIGHTS_SIDEBAR);
}

export default { USE_DUMMY_DATA, SHOW_IMO_PROFILE, SHOW_PORT_PROFILE, SHOW_INSIGHTS_SIDEBAR };
