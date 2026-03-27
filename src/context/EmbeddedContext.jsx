/**
 * Embedded Mode Context
 *
 * Tells components whether the app is running inside the METIS host
 * (embedded via federation) or standalone.
 *
 * Also provides remoteBaseUrl — the child server's base URL — so that
 * components can resolve static assets (logos, images) correctly in
 * federation mode (where asset paths would otherwise resolve against
 * the host origin).
 *
 * Same pattern as sa-web-service/src/context/EmbeddedContext.jsx
 */

import { createContext, useContext } from 'react';

const EmbeddedContext = createContext({ embedded: false, remoteBaseUrl: '' });

export const EmbeddedProvider = ({ embedded, remoteBaseUrl = '', children }) => (
  <EmbeddedContext.Provider value={{ embedded, remoteBaseUrl }}>
    {children}
  </EmbeddedContext.Provider>
);

export const useIsEmbedded = () => useContext(EmbeddedContext).embedded;

export const useRemoteBaseUrl = () => useContext(EmbeddedContext).remoteBaseUrl;

export default EmbeddedContext;
