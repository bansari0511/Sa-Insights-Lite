/**
 * Resolve a static asset URL in federation mode.
 */

const STYLE_PREFIX = 'css__news__';

const getChildOrigin = () => {
  // Strategy 1: remoteEntry.js <script> tag
  const script = document.querySelector('script[src*="remoteEntry.js"]');
  if (script?.src) {
    return new URL(script.src).origin;
  }

  // Strategy 2: federation-injected CSS <link> tags — check any cross-origin link
  const links = document.querySelectorAll('link[rel="stylesheet"]');
  for (const link of links) {
    const href = link.getAttribute('href');
    if (!href) continue;
    try {
      const url = new URL(href);
      if (url.origin !== window.location.origin) {
        return url.origin;
      }
    } catch { /* ignore */ }
  }

  // Strategy 3: federation CSS globals (set by remoteEntry.js).
  // The remoteEntry stores URLs under window["css__news__<module>"].
  for (const key of Object.keys(window)) {
    if (key.startsWith(STYLE_PREFIX)) {
      const val = window[key];
      if (Array.isArray(val) && val.length > 0) {
        const first = val[0];
        if (typeof first === 'string' && first.startsWith('http')) {
          try { return new URL(first).origin; } catch { /* ignore */ }
        }
      }
    }
  }

  // Strategy 4: try import.meta.url as a fallback (remoteEntry.js uses it)
  try {
    const metaUrl = import.meta.url;
    if (metaUrl && metaUrl.includes('remoteEntry.js')) {
      return new URL(metaUrl).origin;
    }
  } catch { /* ignore */ }

  return window.location.origin;
};

const resolveAsset = (assetPath) => {
  if (!assetPath || !assetPath.startsWith('/')) return assetPath;
  return `${getChildOrigin()}${assetPath}`;
};

export default resolveAsset;
