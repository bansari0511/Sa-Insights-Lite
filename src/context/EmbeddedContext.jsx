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

export default EmbeddedContext;
