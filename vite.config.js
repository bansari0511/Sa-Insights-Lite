import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import fs from 'fs/promises';
import svgr from '@svgr/rollup';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
envPrefix: ['REACT_APP_', 'VITE_'],
  resolve: {
    alias: {
      src: resolve(__dirname, 'src'),
      '@babel/runtime':resolve(__dirname,'node_modules/@babel/runtime'),
      '@babel/runtime/helpers/esm/createSuper':resolve(__dirname,'node_modules/@babel/runtime/helpers/esm/createSuper.js')
    },
  },
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.[jt]sx?$/, // cover .js, .jsx, .ts, .tsx
    exclude: [],
  },
  build: {
    sourcemap: false, // Disable source maps to avoid ArcGIS source map errors
    minify: 'esbuild',
    target: 'es2020', // Modern target for better optimization and smaller bundles
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
    cssCodeSplit: true, // Enable CSS code splitting
    reportCompressedSize: true, // Report compressed bundle size
    rollupOptions: {
    external:[],
    output:{
    // Enhanced code-splitting strategy for better caching and performance
    manualChunks: (id) => {
      // Core React libraries
      if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
        return 'react-vendor';
      }
      // MUI packages - separate chunk for better caching
      if (id.includes('node_modules/@mui')) {
        return 'mui';
      }
      // MUI icons - separate as they can be large
      if (id.includes('@mui/icons-material')) {
        return 'mui-icons';
      }
      // Emotion (CSS-in-JS for MUI)
      if (id.includes('node_modules/@emotion')) {
        return 'emotion';
      }
      // ArcGIS - very large library, separate chunk
      if (id.includes('node_modules/@arcgis')) {
        return 'arcgis';
      }
      // DevExtreme - large UI library
      if (id.includes('node_modules/devextreme')) {
        return 'devextreme';
      }
      // Charts libraries
      if (id.includes('node_modules/apexcharts') || id.includes('node_modules/react-apexcharts')) {
        return 'charts';
      }
      // D3 library
      if (id.includes('node_modules/d3')) {
        return 'd3';
      }
      // React Router
      if (id.includes('node_modules/react-router')) {
        return 'router';
      }
      // Axios
      if (id.includes('node_modules/axios')) {
        return 'axios';
      }
      // All other node_modules
      if (id.includes('node_modules')) {
        return 'vendor';
      }
    },
    entryFileNames: 'assets/[name].[hash].js',
    chunkFileNames: 'assets/[name].[hash].js',
    assetFileNames: 'assets/[name].[hash].[ext]'
    }
  },
  commonjsOptions:{
    include:[/node_modules/,/@babel\/runtime/],
  }
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
      'axios'
    ],
    esbuildOptions: {
      target: 'es2020',
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
    svgr(),
    react(),
    // Bundle analyzer - generates stats.html after build
    visualizer({
      open: false,
      filename: 'dist/stats.html',
      gzipSize: true,
      brotliSize: true,
    })
  ],
  base: '/sa-insights/',
  server: {
    port: parseInt(env.VITE_DEV_SERVER_PORT) || 9398,
    host: env.VITE_DEV_SERVER_HOST || '0.0.0.0',
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
  }
  };
});
