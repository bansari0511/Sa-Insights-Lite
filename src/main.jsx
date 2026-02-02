import { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { RequestContextProvider } from "./context/RequestContext";
import { AuthProvider } from './context/AuthContext';
import { ErrorProvider } from './context/ErrorContext';
import ErrorBoundary from './components/ErrorBoundary';
import ErrorNotification from './components/ErrorNotification';
import './styles/common.css';
import esriConfig from "@arcgis/core/config.js";
import { setArcgisAssetPath as setMapAssetPath } from "@arcgis/map-components/dist/components";
import logger from './utils/errorLogger';

// =============================================================================
// GLOBAL ERROR HANDLERS
// =============================================================================

// Catch uncaught JavaScript errors
window.addEventListener('error', (event) => {
  logger.fatal('Uncaught Error', {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    error: event.error?.stack || event.error,
  });
});

// Catch unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  logger.fatal('Unhandled Promise Rejection', {
    reason: event.reason?.message || event.reason,
    stack: event.reason?.stack,
  });
});

// Log application startup
logger.info('Application starting', {
  environment: import.meta.env.MODE,
  useDummyData: import.meta.env.VITE_USE_DUMMY_DATA,
});

// Configure ArcGIS asset paths properly
const basePath = './';
setMapAssetPath(`${basePath}assets`);
esriConfig.assetsPath = `${basePath}assets`;

// Additional ArcGIS configuration to prevent issues
esriConfig.request.httpsDomains = ["*"];
esriConfig.workers.loaderConfig = {
  has: {
    "esri-featurelayer-webgl": 1
  }
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <ErrorBoundary fallbackComponentName="Application Root">
    <ErrorProvider>
      <Suspense fallback={<div>Loading...</div>}>
        <BrowserRouter basename="/sa-insights" >
          <AuthProvider>
            <RequestContextProvider>
              <App />
              <ErrorNotification />
            </RequestContextProvider>
          </AuthProvider>
        </BrowserRouter>
      </Suspense>
    </ErrorProvider>
  </ErrorBoundary>,
)
