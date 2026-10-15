import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve, join } from 'path';
import fs from 'fs/promises';
import http from 'http';
import svgr from '@svgr/rollup';
import { visualizer } from 'rollup-plugin-visualizer';
import federation from '@originjs/vite-plugin-federation';

/**
 * Vite plugin: Copy federation CSS to dist root after build.
 *
 * The federation plugin references CSS as "style-xxx.css" (without assets/ prefix)
 * but Vite outputs it to dist/assets/. This plugin copies the CSS to dist/ root
 * so it's accessible at both paths. .
 * 
 */
function federationReactShim() {
  const SHIM_PREFIX = '\0federation-react-shim:';
  const SHIMMED = [
    'react', 'react-dom',
    'react/jsx-runtime', 'react/jsx-dev-runtime',
  ];

  const REACT_EXPORTS = [
    'Children', 'Component', 'Fragment', 'Profiler', 'PureComponent', 'StrictMode', 'Suspense',
    'act', 'cache', 'cloneElement', 'createContext', 'createElement', 'createRef',
    'forwardRef', 'isValidElement', 'lazy', 'memo', 'startTransition', 'use',
    'useActionState', 'useCallback', 'useContext', 'useDebugValue', 'useDeferredValue',
    'useEffect', 'useId', 'useImperativeHandle', 'useInsertionEffect', 'useLayoutEffect',
    'useMemo', 'useOptimistic', 'useReducer', 'useRef', 'useState', 'useSyncExternalStore',
    'useTransition', 'version',
  ];

  const REACT_DOM_EXPORTS = [
    'createPortal', 'flushSync', 'preconnect', 'prefetchDNS', 'preinit', 'preload',
    'requestFormReset', 'unstable_batchedUpdates', 'useFormState', 'useFormStatus', 'version',
    'createRoot', 'hydrateRoot',
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

function copyFederationCss() {
  return {
    name: 'copy-federation-css',
    apply: 'build',
    closeBundle: async () => {
      const distDir = resolve(__dirname, 'dist');
      const assetsDir = join(distDir, 'assets');
      try {
        const files = await fs.readdir(assetsDir);
        for (const file of files) {
          if (file.startsWith('style') && file.endsWith('.css')) {
            await fs.copyFile(join(assetsDir, file), join(distDir, file));
            console.log(`[copy-federation-css] Copied ${file} to dist root`);
          }
        }
      } catch (err) {
        console.warn('[copy-federation-css] Warning:', err.message);
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
  const basePath = env.VITE_FEDERATION_BASE_URL || '/';
  // if (command !== 'build') {
  //   basePath = './';
  // } else if (mode === 'pilot' || mode === 'production') {
  //   basePath = env.VITE_FEDERATION_BASE_URL || '/news/';
  // } else {
  //   const port = env.VITE_DEV_SERVER_PORT || '9398';
  //   const host = env.VITE_DEV_SERVER_HOST || 'localhost';
  //   basePath = `http://${host === '0.0.0.0' ? 'localhost' : host}:${port}/`;
  // }

  console.log("basePath", basePath)
  console.log("env.VITE_DEV_SERVER_PORT ", env.VITE_DEV_SERVER_PORT)
  return {
    envPrefix: ['REACT_APP_', 'VITE_'],
    resolve: {
      alias: {
        src: resolve(__dirname, 'src'),
        '@babel/runtime': resolve(__dirname, 'node_modules/@babel/runtime'),
        '@babel/runtime/helpers/esm/createSuper': resolve(__dirname, 'node_modules/@babel/runtime/helpers/esm/createSuper.js'),
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
      minify: mode === 'development' ? false : 'esbuild',
      target: 'esnext',
      modulePreload: false,
      cssCodeSplit: false,
      chunkSizeWarningLimit: 1000,
      reportCompressedSize: true,
      manualChunks: {
        // React core
        'vendor-react': ['react', 'react-dom'],
        // Charts
        'vendor-charts': ['chart.js', 'react-chartjs-2'],
        // Markdown rendering
        'vendor-markdown': ['react-markdown', 'remark-gfm'],
      },
      rollupOptions: {
        external: [],
      },
      commonjsOptions: {
        include: [/node_modules/, /@babel\/runtime/],
      },
    },
    optimizeDeps: {
      exclude: ['@arcgis/core', '@arcgis/map-components', 'devlop', 'dequal'],
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
        name: 'news',
        filename: 'remoteEntry.js',
        exposes: {
          './App': './src/SAInsightsRoot.jsx',
        },
        shared: {
          'react': { singleton: true, requiredVersion: false },
          'react-dom': { singleton: true, requiredVersion: false },
          'react-router': { singleton: true, requiredVersion: false },
          'react-router-dom': { singleton: true, requiredVersion: false },
        },
      }),
      copyFederationCss(),
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
      port: parseInt(env.VITE_DEV_SERVER_PORT) || 9398,
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
    proxy: {
      // User Management Service (test-user-management via Tyk: /users)
      '/osintsearch': {
        target: env.DEV_OSINT_SEARCH_API_TARGET || 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/osintsearch/, ''),
      },
      '/fileutils': {
        target: env.DEV_FILEUTILS_API_TARGET || 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/fileutils/, ''),
      },
     '/users': {
               target: env.DEV_PROXY_TARGET || 'http://localhost:8080',
               changeOrigin: true,
               secure: false,
             },
     '/api': {
       target: env.DEV_PROXY_TARGET || 'http://localhost:8080',
       changeOrigin: true,
       secure: false,
       rewrite: (path) => `${env.DEV_PROXY_AUTH_PATH_REWRITE || '/auth'}${path}`,
     },
    },
    preview: {
      port: parseInt(env.VITE_DEV_SERVER_PORT) || 9398,
      host: env.VITE_DEV_SERVER_HOST || '0.0.0.0',
      cors: true,
    }
  };
});
