/**
 * Activity events (product analytics): POST /api/analytics/events on user-analytics-svc, batched. The same contract
 * as the other MXYZ apps (my-search-app's src/services/activity.ts). Off unless VITE_ENABLE_ACTIVITY_TRACKING=true.
 *
 * News/Insights and Asset Profiling are one bucket for user behaviour: both send app 'saaransh', and every event
 * carries props.module ('news' or 'assetsprofile') to tell them apart. This file is the same in both repos except
 * MODULE. Event names and prop keys must match events/EventCatalog.java there (EventCatalog.SAARANSH); anything
 * else is dropped by the server. The user is taken from the login on the server, never sent from here.
 */

const MODULE = 'news';

const ENABLED = import.meta.env.VITE_ENABLE_ACTIVITY_TRACKING === 'true';
const URL = import.meta.env.VITE_ACTIVITY_EVENTS_URL || '/useranalytics/api/analytics/events';
const APP_VERSION = import.meta.env.VITE_APP_VERSION || 'dev';
const SESSION_KEY = `saaransh.${MODULE}.activity.session`;
const IDLE_MS = 30 * 60 * 1000;
const FLUSH_MS = 10_000;
const FLUSH_AT = 20;

/** The browser's own fetch, taken at load, so a wrapper installed later (feedback capture) never sees these calls. */
const send = typeof window !== 'undefined' ? window.fetch.bind(window) : fetch;

let queue = [];
let timer = 0;
let view = 'other';
let hiddenAt = 0;

/** A visit: a new id after 30 minutes without an event. The first event of a visit is session_start. */
function sessionId() {
  const now = Date.now();
  let stored = null;
  try { stored = JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null'); } catch { /* none */ }
  const fresh = !stored || now - stored.last > IDLE_MS;
  const id = fresh ? `s-${now.toString(36)}-${Math.random().toString(36).slice(2, 8)}` : stored.id;
  try { sessionStorage.setItem(SESSION_KEY, JSON.stringify({ id, last: now })); } catch { /* per-tab only */ }
  if (fresh) queue.push(envelope('session_start', id, { screen: `${window.innerWidth}x${window.innerHeight}` }, {}));
  return id;
}

function envelope(event, session, props, ctx) {
  const clean = { module: MODULE };
  for (const [k, v] of Object.entries(props || {})) if (v !== undefined && v !== null && v !== '') clean[k] = v;
  return {
    app: 'saaransh',
    event,
    ts: new Date().toISOString(),
    sessionId: session,
    view,
    conversationId: ctx.conversationId || undefined,
    messageId: ctx.messageId || undefined,
    appVersion: APP_VERSION,
    props: clean,
  };
}

/** Never throws: activity is best-effort and must not break a click handler. */
export function track(event, props = {}, ctx = {}) {
  if (!ENABLED) return;
  try {
    queue.push(envelope(event, sessionId(), props, ctx));
    if (queue.length >= FLUSH_AT) flush();
    else if (!timer) timer = window.setTimeout(flush, FLUSH_MS);
  } catch { /* best-effort */ }
}

/** Returns the view it replaces. */
export function setActivityView(next) {
  const previous = view;
  view = next;
  return previous;
}

/** keepalive lets the request finish while the page is closing; it is capped at 64 KB. */
function flush() {
  window.clearTimeout(timer);
  timer = 0;
  if (!queue.length) return;
  const events = queue;
  queue = [];
  const body = JSON.stringify({ events });
  send(URL, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body,
    keepalive: body.length < 60_000,
  }).catch(() => { /* activity is best-effort */ });
}

if (ENABLED && typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      hiddenAt = Date.now();
      track('visibility', { state: 'hidden' });
      flush();
    } else {
      track('visibility', { state: 'visible', hiddenMs: hiddenAt ? Date.now() - hiddenAt : undefined });
    }
  });
  window.addEventListener('pagehide', flush);
}

/**
 * The view for a route path (the app's own path, base removed): the page name, lower-cased, so both apps and both
 * modes (standalone, embedded under /news or /assetsprofile) report the same names.
 */
const PAGES = {
  newsroom: 'newsroom', intelligencebriefings: 'briefings', 'map-and-timeline': 'map_timeline', search: 'search',
  equipment: 'equipment', 'military-group': 'military_group', event: 'event', imoprofile: 'imo', portprofile: 'port',
  installationprofile: 'installation', organizationprofile: 'organization', nsagactors: 'nsag_actor',
  shipprofile: 'ship', obat: 'orbat', inventory: 'inventory', 'graph-demo': 'graph', dashboard: 'dashboard',
};
export function viewForPath(path) {
  const parts = String(path || '').toLowerCase().split('/').filter(Boolean);
  for (let i = parts.length - 1; i >= 0; i--) if (PAGES[parts[i]]) return PAGES[parts[i]];
  return parts.length === 0 ? 'home' : 'other';
}

/** Profile kinds as navigationUtils names them, in the event's words. */
export const profileKind = (type) => ({
  equipment: 'equipment', installation: 'installation', organization: 'organization', militaryGroup: 'military_group',
  militarygroup: 'military_group', event: 'event', nsagActor: 'nsag_actor', imo: 'imo', port: 'port', ship: 'ship',
}[type] || 'other');

/** A file's type from its name or URL, for attachment events (never the name itself). */
export const fileTypeOf = (name) => {
  const m = /\.([a-z0-9]{1,6})(?:[?#].*)?$/i.exec(String(name || ''));
  return m ? m[1].toLowerCase() : 'other';
};

/**
 * A section of a profile card opened: a modal (Measurements, News...), a list expanded, the map view. The profile
 * kind is the page it is on (the current view), so a call site names the section only, in snake_case.
 */
export const trackSection = (section, props = {}) => track('section_opened', { section, kind: view, ...props });

/** The name of what a search box picked (an option object or a string), for profile_opened's entity. */
export const nameOf = (picked) => {
  if (!picked) return undefined;
  if (typeof picked === 'string') return picked;
  return picked.display_name_label || picked.label || picked.name || picked.title || undefined;
};
