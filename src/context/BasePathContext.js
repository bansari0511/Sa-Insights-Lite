/**
 * BasePathContext — Provides the federation base path to all components.
 *
 * In federation mode: basePath = '/news' (from host registry)
 * In standalone mode: basePath = '' (empty, paths work as-is)
 *
 * Components use: const bp = useBasePath();
 * Then navigate(`${bp}/NewsRoom`) or NavLink to={`${bp}/NewsRoom`}
 */

import { createContext, useContext } from 'react';

const BasePathContext = createContext('');

export const BasePathProvider = BasePathContext.Provider;

export const useBasePath = () => useContext(BasePathContext);

export default BasePathContext;
