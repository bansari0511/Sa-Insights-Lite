/**
 * SA Insights — Federation Entry Point
 *
 * Exposed to the METIS host via Module Federation.
 * Receives HostProps (user, isAdmin, entitlements, basePath) from the host
 * and wires them into this app's own context providers.
 *
 * Key differences from standalone (bootstrap.jsx):
 *   - No <BrowserRouter>  → host already provides one
 *   - No <AuthProvider>   → replaced by HostAuthProvider (host auth pass-through)
 *   - No login routes     → host handles authentication
 *   - EmbeddedProvider embedded={true} → components hide header/footer
 *
 * ArcGIS config is required here too (not just bootstrap.jsx) so that
 * map assets resolve locally instead of hitting the CDN (offline LAN).
 *
 * Same pattern as my-ontology-app/src/OntologyRoot.tsx
 */

import { RequestContextProvider } from './context/RequestContext';
import { ErrorProvider } from './context/ErrorContext';
import { ThemeContextProvider } from './theme/ThemeContext';
import { EmbeddedProvider } from './context/EmbeddedContext';
import HostAuthProvider from './context/HostAuthProvider';
import EmbeddedApp from './EmbeddedApp';
import ErrorBoundary from './components/ErrorBoundary';
import { HelmetProvider } from 'react-helmet-async';
import esriConfig from '@arcgis/core/config.js';
import './styles/common.css';

// Configure ArcGIS to load assets from the child app's own origin (offline LAN)
//
// Problem: import.meta.url resolves to http://localhost:9398/... which breaks on LAN
// because "localhost" on a LAN client points to the client itself, not the server.
//
// Solution: Find the actual origin of this child app by looking at:
// 1. The remoteEntry.js script tag (host inserted it with the correct URL)
// 2. Fallback to import.meta.url (works on the build machine / localhost)
const getChildOrigin = () => {
  // Look for the remoteEntry.js script — its src has the real server origin
  const remoteScript = document.querySelector('script[src*="remoteEntry.js"][src*="9398"]')
    || document.querySelector('script[src*="remoteEntry.js"][src*="news"]');
  if (remoteScript?.src) {
    const url = new URL(remoteScript.src);
    return `${url.origin}/`;
  }
  // Fallback: derive from import.meta.url (works on same machine)
  const moduleDir = new URL('./', import.meta.url).href;
  return new URL('../', moduleDir).href;
};

const childOrigin = getChildOrigin();
const childAssetsBase = `${childOrigin}assets`;

// 1. ArcGIS core widgets (Zoom, TimeSlider, Expand, etc.)
esriConfig.assetsPath = childAssetsBase;

// 2. ArcGIS worker config (required for layer loading — matches standalone bootstrap.jsx)
esriConfig.request.httpsDomains = ["*"];
esriConfig.workers.loaderConfig = {
  has: {
    "esri-featurelayer-webgl": 1
  }
};

// 3. Calcite/map-components (icons, t9n for Stencil web components)
//    Dynamic import avoids build failures if @arcgis/map-components has resolution issues
import('@arcgis/map-components').then(({ setArcgisAssetPath }) => {
  setArcgisAssetPath(childAssetsBase);
}).catch(() => {});

const SAInsightsRoot = (props) => {
  return (
    <ErrorBoundary fallbackComponentName="NEWS">
      <HelmetProvider>
        <EmbeddedProvider embedded={true} remoteBaseUrl={props.remoteBaseUrl || ''}>
          <ErrorProvider>
            <HostAuthProvider hostProps={props}>
              <RequestContextProvider>
                <ThemeContextProvider>
                  <EmbeddedApp basePath={props.basePath} />
                </ThemeContextProvider>
              </RequestContextProvider>
            </HostAuthProvider>
          </ErrorProvider>
        </EmbeddedProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
};

export default SAInsightsRoot;
