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
 * Ensures ALL react, react-dom, and jsx-runtime imports resolve through
 * the federation `importShared` function.  Without this, CJS dependencies
 * (MUI, Emotion, Popper, etc.) bundle a SEPARATE React copy via Rollup's
 * commonjs conversion — its hooks dispatcher is different from the host's
 * shared React, causing "f.H is null" in federation mode.
 *
 * Shimmed:  react, react-dom, react/jsx-runtime, react/jsx-dev-runtime
 * NOT shimmed:  react-dom/client (causes circular fallback in standalone),
 *               react-router, react-router-dom (federation handles them)
 */
function federationReactShim() {
  const SHIM_PREFIX = '\0federation-react-shim:';
  const SHIMMED = [
    'react', 'react-dom',
    'react/jsx-runtime', 'react/jsx-dev-runtime',
  ];

  const REACT_EXPORTS = [
    'Children','Component','Fragment','Profiler','PureComponent','StrictMode','Suspense',
    'act','cache','cloneElement','createContext','createElement','createRef',
    'forwardRef','isValidElement','lazy','memo','startTransition','use',
    'useActionState','useCallback','useContext','useDebugValue','useDeferredValue',
    'useEffect','useId','useImperativeHandle','useInsertionEffect','useLayoutEffect',
    'useMemo','useOptimistic','useReducer','useRef','useState','useSyncExternalStore',
    'useTransition','version',
  ];

  const REACT_DOM_EXPORTS = [
    'createPortal','flushSync','preconnect','prefetchDNS','preinit','preload',
    'requestFormReset','unstable_batchedUpdates','useFormState','useFormStatus','version',
    'createRoot','hydrateRoot',
  ];

  return {
    name: 'federation-react-shim',
    enforce: 'pre',
    apply: 'build',

    resolveId(source, importer) {
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

      // --- react/jsx-runtime & react/jsx-dev-runtime ---
      if (pkg === 'react/jsx-runtime' || pkg === 'react/jsx-dev-runtime') {
        return [
          `import { importShared } from '__federation_fn_import';`,
          `const _React = await importShared('react');`,
          `export const Fragment = _React.Fragment;`,
          `export function jsx(type, config, maybeKey) {`,
          `  if (!config) return _React.createElement(type, null);`,
          `  const { children, ...props } = config;`,
          `  if (maybeKey !== undefined) props.key = maybeKey;`,
          `  if (children === undefined) return _React.createElement(type, props);`,
          `  if (Array.isArray(children)) return _React.createElement(type, props, ...children);`,
          `  return _React.createElement(type, props, children);`,
          `}`,
          `export const jsxs = jsx;`,
          pkg === 'react/jsx-dev-runtime' ? `export const jsxDEV = jsx;` : ``,
          `export default { Fragment, ${pkg.includes('dev') ? 'jsxDEV' : 'jsx, jsxs'} };`,
        ].join('\n');
      }

      // --- react ---
      if (pkg === 'react') {
        return [
          `import { importShared } from '__federation_fn_import';`,
          `const _mod = await importShared('react');`,
          `export default (_mod && _mod.default !== undefined) ? _mod.default : _mod;`,
          ...REACT_EXPORTS.map(n => `export const ${n} = _mod.${n};`),
        ].join('\n');
      }

      // --- react-dom ---
      if (pkg === 'react-dom') {
        return [
          `import { importShared } from '__federation_fn_import';`,
          `const _mod = await importShared('react-dom');`,
          `export default (_mod && _mod.default !== undefined) ? _mod.default : _mod;`,
          ...REACT_DOM_EXPORTS.map(n => `export const ${n} = _mod.${n};`),
        ].join('\n');
      }
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

  // Base path for asset resolution:
  // - Production build: /news/ (nginx gateway routes /news/assets/ to this container)
  // - Dev build (federation preview): absolute URL so cross-origin assets resolve
  //   (root-relative '/' would resolve to host origin, not child server)
  // - Dev serve (standalone): relative path, dev server handles it
  let basePath = env.VITE_FEDERATION_BASE_URL || './';
  if (command === 'build' && basePath === '/') {
    const port = env.VITE_DEV_SERVER_PORT || '9400';
    const host = env.VITE_DEV_SERVER_HOST || 'localhost';
    basePath = `http://${host === '0.0.0.0' ? 'localhost' : host}:${port}/`;
  }

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
    supported: {
      'top-level-await': true,
    },
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
    react(),
    federationReactShim(),
    corsProxyPlugin(),
    svgr(),
    federation({
      name: 'news_app',
      filename: 'remoteEntry.js',
      exposes: {
        './App': './src/SAInsightsRoot.jsx',
      },
      shared: ['react', 'react-dom', 'react-router', 'react-router-dom'],
    }),
    // Bundle analyzer - generates stats.html after build
    visualizer({
      open: false,
      filename: 'dist/stats.html',
      gzipSize: true,
      brotliSize: true,
    })
  ],
  base: basePath,
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
