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
 *   - No ArcGIS config    → stays in bootstrap.jsx for standalone only
 *   - No login routes     → host handles authentication
 *   - EmbeddedProvider embedded={true} → components hide header/footer
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
import './styles/common.css';

const SAInsightsRoot = (props) => {
  return (
    <ErrorBoundary fallbackComponentName="NEWS">
      <HelmetProvider>
        <EmbeddedProvider embedded={true}>
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
