import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import fs from 'fs/promises';
import http from 'http';
import svgr from '@svgr/rollup';
import { visualizer } from 'rollup-plugin-visualizer';
import federation from '@originjs/vite-plugin-federation';

/**
 * Vite plugin: Federation React Shim
 *
 * Ensures ALL react / react-dom imports in the child app resolve through
 * the federation `importShared` function.  When running embedded in the
 * host, `importShared` returns the host's React (single instance).
 * When running standalone, it falls back to the locally installed copy.
 *
 * Without this plugin, deep node_modules dependencies (MUI, antd, …)
 * end up importing a separately-bundled React copy whose internal hooks
 * dispatcher is null, causing "can't access property useContext, H is null".
 */
function federationReactShim() {
  const SHIM_PREFIX = '\0federation-react-shim:';
  const SHIMMED = ['react', 'react-dom', 'react/jsx-runtime', 'react/jsx-dev-runtime', 'react-dom/client'];

  // Comprehensive named export lists for React 19
  const EXPORTS = {
    'react': [
      'Children','Component','Fragment','Profiler','PureComponent','StrictMode','Suspense',
      'act','cache','cloneElement','createContext','createElement','createRef',
      'forwardRef','isValidElement','lazy','memo','startTransition','use',
      'useActionState','useCallback','useContext','useDebugValue','useDeferredValue',
      'useEffect','useId','useImperativeHandle','useInsertionEffect','useLayoutEffect',
      'useMemo','useOptimistic','useReducer','useRef','useState','useSyncExternalStore',
      'useTransition','version',
    ],
    'react/jsx-runtime':     ['Fragment','jsx','jsxs'],
    'react/jsx-dev-runtime': ['Fragment','jsxDEV'],
    'react-dom': [
      'createPortal','flushSync','preconnect','prefetchDNS','preinit','preload',
      'requestFormReset','unstable_batchedUpdates','useFormState','useFormStatus','version',
    ],
    'react-dom/client': ['createRoot','hydrateRoot'],
  };

  return {
    name: 'federation-react-shim',
    enforce: 'pre',
    apply: 'build',  // Only during build — dev mode uses real React directly

    resolveId(source, importer) {
      // Never intercept imports from federation internals or from our own shims
      if (!importer) return null;
      if (importer.includes('__federation_') || importer.includes(SHIM_PREFIX)) return null;
      if (importer.includes('node_modules/@originjs')) return null;

      if (SHIMMED.includes(source)) {
        return { id: SHIM_PREFIX + source, moduleSideEffects: false };
      }
    },

    load(id) {
      if (!id.startsWith(SHIM_PREFIX)) return null;
      const pkg = id.slice(SHIM_PREFIX.length);
      const names = EXPORTS[pkg] || [];

      // For subpath modules, derive from the parent shared module
      // because only 'react' and 'react-dom' are in the federation shared config.
      if (pkg === 'react/jsx-runtime' || pkg === 'react/jsx-dev-runtime') {
        // Use React.createElement but adapt the jsx(type, props, key) signature.
        // jsx-runtime puts children INSIDE props, createElement needs them as extra args.
        // We must use createElement (not raw objects) so React sets _owner, _store, ref etc.
        return [
          `import { importShared } from '__federation_fn_import';`,
          `const React = await importShared('react');`,
          `const Fragment = React.Fragment;`,
          `function jsx(type, config, maybeKey) {`,
          `  const { children, ref, ...rest } = config || {};`,
          `  if (maybeKey !== undefined) rest.key = maybeKey;`,
          `  if (ref !== undefined) rest.ref = ref;`,
          `  if (children !== undefined) {`,
          `    return React.createElement(type, rest, ...(Array.isArray(children) ? children : [children]));`,
          `  }`,
          `  return React.createElement(type, rest);`,
          `}`,
          `const jsxs = jsx;`,
          pkg === 'react/jsx-dev-runtime'
            ? `const jsxDEV = jsx;\nexport { Fragment, jsxDEV };`
            : `export { Fragment, jsx, jsxs };`,
          `export default { Fragment, ${pkg.includes('dev') ? 'jsxDEV' : 'jsx, jsxs'} };`,
        ].join('\n');
      }

      if (pkg === 'react-dom/client') {
        return [
          `import { importShared } from '__federation_fn_import';`,
          `const _mod = await importShared('react-dom');`,
          `export const createRoot = _mod.createRoot || (await import('react-dom/client')).createRoot;`,
          `export const hydrateRoot = _mod.hydrateRoot || (await import('react-dom/client')).hydrateRoot;`,
          `export default { createRoot, hydrateRoot };`,
        ].join('\n');
      }

      // For top-level modules (react, react-dom) — use importShared directly
      return [
        `import { importShared } from '__federation_fn_import';`,
        `const _mod = await importShared('${pkg}');`,
        `export default (_mod && _mod.default !== undefined) ? _mod.default : _mod;`,
        ...names.map(n => `export const ${n} = _mod.${n};`),
      ].join('\n');
    },
  };
}

// Vite plugin: CORS proxy for fetching cross-origin files (xlsx, docx from assets server)
// Usage: fetch('/sa-insights/cors-proxy?url=' + encodeURIComponent('http://172.18.111.11/file.xlsx'))
function corsProxyPlugin() {
  return {
    name: 'cors-proxy',
    configureServer(server) {
      const handler = (req, res) => {
        // Parse target URL from query parameter: /cors-proxy?url=<encoded-url>
        const parsed = new URL(req.url, 'http://localhost');
        const targetUrl = parsed.searchParams.get('url');
        if (!targetUrl || !targetUrl.startsWith('http')) {
          res.statusCode = 400;
          return res.end('Invalid URL');
        }
        http.get(targetUrl, (proxyRes) => {
          res.writeHead(proxyRes.statusCode, {
            'content-type': proxyRes.headers['content-type'] || 'application/octet-stream',
            'access-control-allow-origin': '*',
          });
          proxyRes.pipe(res);
        }).on('error', (err) => {
          console.error('[CORS Proxy] Error fetching:', targetUrl, err.message);
          res.statusCode = 502;
          res.end('Proxy error');
        });
      };
      // Register at root path (direct access)
      server.middlewares.use('/cors-proxy', handler);
      // Also register under base path (for reverse proxy setups on LAN)
      const base = server.config.base;
      if (base && base !== '/') {
        server.middlewares.use(`${base}cors-proxy`, handler);
      }
    },
  };
}

export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
envPrefix: ['REACT_APP_', 'VITE_'],
  resolve: {
    alias: {
      src: resolve(__dirname, 'src'),
      '@babel/runtime':resolve(__dirname,'node_modules/@babel/runtime'),
      '@babel/runtime/helpers/esm/createSuper':resolve(__dirname,'node_modules/@babel/runtime/helpers/esm/createSuper.js'),
      'dingbat-to-unicode': resolve(__dirname, 'node_modules/dingbat-to-unicode/dist/index.js'),
    },
  },
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.[jt]sx?$/, // cover .js, .jsx, .ts, .tsx
    exclude: [],
  },
  build: {
    sourcemap: false,
    minify: 'esbuild',
    target: 'esnext',
    modulePreload: false,
    cssCodeSplit: false,
    chunkSizeWarningLimit: 1000,
    reportCompressedSize: true,
    rollupOptions: {
      external: [],
    },
    commonjsOptions: {
      include: [/node_modules/, /@babel\/runtime/],
    },
  },
  optimizeDeps: {
    exclude: ['@arcgis/core', '@arcgis/map-components'],
    include: [
      '@emotion/react',
      '@emotion/styled',
      '@mui/styled-engine',
      '@mui/system',
      '@mui/material',
      '@mui/material/Box',
      '@mui/material/Grid',
      '@mui/material/Paper',
      '@mui/material/Typography',
      '@mui/material/Button',
      'apexcharts',
      'react-apexcharts',
      'mammoth',
      'dingbat-to-unicode'
    ],
    esbuildOptions: {
      target: 'esnext',
      plugins: [
        {
          name: 'load-js-files-as-jsx',
          setup(build) {
            build.onLoad(
              { filter: /src\/.*\.js$/ },
              async (args) => {
                const contents = await fs.readFile(args.path, 'utf8');
                return {
                  loader: 'jsx',
                  contents,
                };
              }
            );
          },
        }
      ],
    },
  },
  plugins: [
    federationReactShim(),
    corsProxyPlugin(),
    svgr(),
    federation({
      name: 'news_app',
      filename: 'remoteEntry.js',
      exposes: {
        './App': './src/SAInsightsRoot.jsx',
      },
      shared: {
        'react':           { requiredVersion: false },
        'react-dom':       { requiredVersion: false },
        'react-router':    { requiredVersion: false },
        'react-router-dom':{ requiredVersion: false },
      },
    }),
    react(),
    // Bundle analyzer - generates stats.html after build
    visualizer({
      open: false,
      filename: 'dist/stats.html',
      gzipSize: true,
      brotliSize: true,
    })
  ],
  // In build mode, use absolute URL so assets (images, fonts) resolve to child's server
  // when loaded via federation from the host. In dev mode, use '/' for local serving.
  base: command === 'build'
    ? (env.VITE_FEDERATION_BASE_URL || `http://localhost:${parseInt(env.VITE_DEV_SERVER_PORT) || 9400}/`)
    : '/',
  server: {
    port: parseInt(env.VITE_DEV_SERVER_PORT) || 9400,
    host: env.VITE_DEV_SERVER_HOST || '0.0.0.0',
    cors: true,
    fs: {
      strict: false,
    },
    watch: {
      ignored: [
        '**/node_modules/**',
        '**/dist/**',
        '**/public/assets/esri/**',
        '**/.git/**',
        '**/coverage/**',
        '**/tmp/**',
        '**/temp/**',
        '**/*.log',
        '**/.DS_Store',
        '**/Thumbs.db'
      ]
    }
  },
  preview: {
    port: parseInt(env.VITE_DEV_SERVER_PORT) || 9400,
    host: env.VITE_DEV_SERVER_HOST || '0.0.0.0',
    cors: true,
  }
  };
});
