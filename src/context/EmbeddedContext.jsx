/**
 * Embedded Mode Context
 *
 * Tells components whether the app is running inside the METIS host
 * (embedded via federation) or standalone.
 * Same pattern as my-ontology-app/src/context/EmbeddedContext.tsx
 */

import { createContext, useContext } from 'react';

const EmbeddedContext = createContext(false);

export const EmbeddedProvider = ({ embedded, children }) => (
  <EmbeddedContext.Provider value={embedded}>{children}</EmbeddedContext.Provider>
);

export const useIsEmbedded = () => useContext(EmbeddedContext);

/**
 * Returns the remote base URL of the child app for resolving asset paths
 * when running in federation mode. Falls back to '' when not available.
 */
export const useRemoteBaseUrl = () => {
  const isEmbedded = useContext(EmbeddedContext);
  if (!isEmbedded) return '';
  try {
    const base = import.meta.env.BASE_URL;
    return base?.endsWith('/') ? base.slice(0, -1) : base || '';
  } catch {
    return '';
  }
};

export default EmbeddedContext;
