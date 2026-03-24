# NEWS Lite — Module Federation Integration

## Overview

NEWS Lite runs in two modes:

| Mode | Entry Point | Router | Auth | URL |
|------|-------------|--------|------|-----|
| **Standalone** | `bootstrap.jsx` → `App.jsx` → `Router.js` | Own `BrowserRouter` | Own `AuthProvider` | `http://localhost:9398/NewsRoom` |
| **Federation** (embedded in METIS) | `SAInsightsRoot.jsx` → `EmbeddedApp.jsx` | Host's `BrowserRouter` | `HostAuthProvider` (pass-through) | `http://localhost:9391/metis/news/NewsRoom` |

The METIS host loads NEWS inline via **Vite Module Federation** (`@originjs/vite-plugin-federation`).

---

## Architecture

```
METIS Host (my-react-app, port 9391)
├── BrowserRouter (basename=/metis)
│   ├── Route /login → LandingPage
│   ├── Route /home → Home
│   ├── Route /news/* → RemoteAppWrapper → SAInsightsRoot
│   ├── Route /onto/* → OntologyRoot
│   └── Route /* → redirect to /login
│
NEWS (news-lite, port 9398)
├── SAInsightsRoot.jsx (federation entry, exposed as ./App)
│   ├── EmbeddedProvider (embedded=true)
│   ├── HostAuthProvider (maps host auth → app's AuthContext)
│   ├── RequestContextProvider
│   ├── ThemeContextProvider
│   └── EmbeddedApp.jsx
│       ├── HistoryInterceptor (rewrites /NewsRoom → /news/NewsRoom)
│       ├── BasePathProvider (provides '/news' to components)
│       └── Routes (uses host's BrowserRouter)
│           └── FullLayout (sidebar + header + footer + profile)
│               ├── NewsHomePage
│               ├── IntelligenceBriefings
│               ├── EventTimeline
│               └── SearchPage
```

---

## Files Changed for Federation

### New Files

| File | Purpose |
|------|---------|
| `src/SAInsightsRoot.jsx` | Federation entry point — exposed via vite.config.js. Wraps with HostAuthProvider, EmbeddedProvider, contexts |
| `src/EmbeddedApp.jsx` | Content shell — HistoryInterceptor, BasePathProvider, routes with FullLayout |
| `src/context/EmbeddedContext.jsx` | Boolean context: `useIsEmbedded()` — tells components if running in federation mode |
| `src/context/HostAuthProvider.jsx` | Maps METIS host's `HostProps` (user, entitlements) into NEWS' own `AuthContext` shape |
| `src/context/BasePathContext.js` | Provides federation basePath (`/news`) to components that need it |

### Modified Files

| File | Change | Why |
|------|--------|-----|
| `vite.config.js` | Added federation plugin, shared deps, React shim plugin, `base` URL for builds | Federation setup |
| `src/bootstrap.jsx` | Added `EmbeddedProvider embedded={false}`, `HelmetProvider` | Standalone mode flag |
| `src/components/container/PageContainer.js` | `react-helmet` → `react-helmet-async` | Fixes UNSAFE_componentWillMount warning |
| `src/layouts/full/sidebar/SidebarItems.js` | Active detection uses `pathname.endsWith()` | Works for both `/NewsRoom` and `/news/NewsRoom` |
| `src/layouts/full/sidebar/NavItem/index.js` | Intelligence briefing check uses `.endsWith()` | Same reason |
| `package.json` | Upgraded react, react-dom, react-router, react-router-dom, vite, @vitejs/plugin-react | Version alignment with host |

### NOT Modified (standalone UI code unchanged)

- `src/layouts/full/FullLayout.js` — original 100vh/100vw layout preserved
- `src/views/newsRoom/NewsHomePage.js` — original navigate('/NewsRoom') preserved
- `src/views/newsRoom/EnhancedNewsTabs.js` — original navigate calls preserved
- `src/views/newsRoom/IntelligenceBriefings.js` — original navigate calls preserved
- `src/layouts/full/header/Header.js` — original search navigate preserved
- `src/layouts/full/header/Profile.js` — original logout/home navigate preserved
- `src/layouts/full/sidebar/MenuItems.js` — original href: '/NewsRoom' preserved
- All page components, theme, styles — completely unchanged

---

## Key Technical Decisions

### 1. Navigation: HistoryInterceptor (not MemoryRouter)

**Problem:** NEWS components call `navigate('/NewsRoom')` — absolute paths. In federation mode, this navigates to the host's root `/NewsRoom` instead of `/news/NewsRoom`.

**Rejected approaches:**
- `MemoryRouter` — React Router v7 throws "Router inside Router" error
- `RouterProvider` + `createMemoryRouter` — Same error (uses `<Router>` internally)
- `UNSAFE_NavigationContext` override — Different React instances between host and child
- Relative paths (`../NewsRoom`) — Inconsistent resolution depending on route depth

**Solution:** `HistoryInterceptor` patches `window.history.pushState/replaceState` to rewrite NEWS page paths:
```
navigate('/NewsRoom') → pushState(_, _, '/metis/news/NewsRoom')
navigate('/map-and-timeline') → pushState(_, _, '/metis/news/map-and-timeline')
navigate('/login') → passes through (host handles auth)
```

This is transparent to all components — they use standalone absolute paths, the interceptor rewrites at the browser level.

### 2. Sidebar Active State: `pathname.endsWith()`

**Problem:** SidebarItems checks `pathname === '/NewsRoom'` but in federation mode pathname is `/news/NewsRoom`.

**Solution:** Changed to `pathname.endsWith('/NewsRoom')` — works for both `/NewsRoom` (standalone) and `/news/NewsRoom` (federation).

### 3. React Version Alignment

**Problem:** Host uses React 19.2.4, child had React 18.2.0. Federation's `importShared` does a semver check — version mismatch causes fallback to bundled copy → two React instances → `useContext` fails (`H is null`).

**Solution:**
- Upgraded news-lite to React 19.2.4, React Router v7, Vite 6
- Added `requiredVersion: false` in federation shared config as safety net

### 4. JSX Runtime Shim

**Problem:** `react/jsx-runtime` is not in the federation shared scope. Deep MUI/antd dependencies import jsx-runtime directly, bundling their own React copy.

**Solution:** `federationReactShim` Vite plugin (build-only):
- Intercepts all `react`, `react-dom`, `react/jsx-runtime` imports
- Returns virtual modules that call `importShared('react')` from the host
- jsx-runtime shim uses `React.createElement` from the shared React instance
- Deep dependencies get the host's React → single instance → hooks work

### 5. Asset URLs (Logo, Fonts)

**Problem:** `import logo from '...'` creates `/assets/logo_landing-xxx.png`. In federation, this resolves to the host's origin (port 9391), not the child's (port 9398).

**Solution:** `base` in vite.config.js set to `http://localhost:9398/` for builds:
```js
base: command === 'build'
  ? `http://localhost:${port}/`
  : '/'
```
All asset URLs become absolute to the child's server.

### 6. CSS Containment

**Problem:** FullLayout uses `width: 100vw; height: 100vh` — covers the entire viewport including METIS sidebar.

**Solution (host-side CSS in AppShell.css):**
```css
.app-shell__content .mainwrapper { width: 100% !important; height: 100vh !important; }
.app-shell__content .page-wrapper { height: 100vh !important; }
.app-shell__content .MuiDrawer-paper { left: 60px; }
```
METIS sidebar z-index bumped to 1300 (above MUI's 1200).

---

## Running Locally

### All three apps together (federation mode)

```bash
# Terminal 1: Build + preview NEWS (port 9398)
cd news-lite
npm run build -- --mode development
npx vite preview --port 9398 --host 0.0.0.0

# Terminal 2: Build + preview Ontology (port 9399)
cd my-ontology-app
npm run build -- --mode development
npx vite preview --port 9399 --host 0.0.0.0

# Terminal 3: Host dev server (port 9391)
cd my-react-app
npm run dev
```

Open: http://localhost:9391/metis/

### NEWS standalone

```bash
cd news-lite
npm run dev
```

Open: http://localhost:9398/

---

## Onboarding Checklist (for new federation child apps)

When adding a new child app to METIS federation:

1. **Version alignment:** Match React, React DOM, React Router versions with host
2. **Federation entry point:** Create `AppRoot.jsx` with `HostAuthProvider` + `EmbeddedProvider`
3. **Navigation:** If app uses absolute paths (`/page`), add `HistoryInterceptor` or use relative paths
4. **Sidebar active states:** Use `pathname.endsWith()` instead of exact match
5. **CSS isolation:** Use `ScopedCssBaseline` or ensure no `100vw` overflow
6. **Assets:** Set `base` to child's absolute URL for builds
7. **Shared deps:** Configure `shared` in vite.config.js with `requiredVersion: false`
8. **JSX shim:** If host and child have different React instances, add `federationReactShim` plugin

---

## Troubleshooting

| Error | Cause | Fix |
|-------|-------|-----|
| `H is null` / `useContext` fails | Two React instances | Ensure shared React version matches, check `federationReactShim` |
| `Router inside Router` | MemoryRouter inside host's BrowserRouter | Don't use MemoryRouter/RouterProvider — use host's router with HistoryInterceptor |
| Clicks go to METIS login | `navigate('/page')` breaks out of child route | HistoryInterceptor rewrites paths; check `SA_PAGES` list |
| Sidebar items not highlighted | `pathname === '/page'` fails in federation | Use `pathname.endsWith('/page')` |
| Logo/images 404 | Asset URLs resolve to host origin | Set `base` to child's absolute URL in vite.config.js for builds |
| METIS sidebar hidden | Child's `100vw` covers sidebar | Host CSS: `.mainwrapper { width: 100% !important }`, sidebar z-index: 1300 |
| CORS errors | Preview server not sending CORS headers | `vite preview` handles CORS automatically; restart preview server |
| CSS/layout broken | MUI `CssBaseline` resets host styles | Use `ScopedCssBaseline` in embedded mode |

---

## Version History

| Date | Change |
|------|--------|
| 2026-03-18 | Initial federation integration with METIS host |
| 2026-03-18 | React 18→19, Router v6→v7, Vite 4→6 upgrade |
| 2026-03-18 | Added federationReactShim for single React instance |
| 2026-03-18 | Added HistoryInterceptor for navigation |
| 2026-03-18 | Added HelmetProvider (react-helmet → react-helmet-async) |
| 2026-03-18 | Host CSS adjustments for sidebar coexistence |
