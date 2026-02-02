/**
 * Navigation Utilities
 *
 * Helper functions for navigating between profile pages with hidden IDs.
 * Supports both internal navigation and cross-application communication.
 * Uses sessionStorage to pass IDs without exposing them in the URL.
 *
 * ARCHITECTURE:
 * =============
 * 1. Internal Navigation: Direct sessionStorage + window.open()
 * 2. External App Navigation: URL hash (encrypted) -> consumed on load -> sessionStorage
 * 3. Page Refresh Support: sessionStorage persists until consumed
 *
 * USAGE FROM EXTERNAL APP:
 * ========================
 * Option 1: URL with encoded hash (recommended for cross-origin)
 *   window.open('https://yourapp.com/installationProfile#xid_BASE64_ENCODED_ID')
 *
 * Option 2: PostMessage (for same-origin iframe communication)
 *   targetWindow.postMessage({ type: 'PROFILE_NAVIGATION', profileType: 'installation', entityId: 'xxx' }, '*')
 *
 * Option 3: LocalStorage event (for cross-tab same-origin)
 *   localStorage.setItem('externalProfileNav', JSON.stringify({ profileType, entityId, timestamp }))
 */

// =============================================================================
// CONFIGURATION
// =============================================================================

// Base path for the application (must match BrowserRouter basename in main.jsx)
const APP_BASE_PATH = '/saaransh';

// SessionStorage keys for different profile types
const STORAGE_KEYS = {
    equipment: 'pendingEquipmentId',
    installation: 'pendingInstallationId',
    organization: 'pendingOrganizationId',
    militaryGroup: 'pendingMilitaryGroupId',
    event: 'pendingEventId',
    nsagActor: 'pendingNsagActorId',
    imo: 'pendingImoId',
    port: 'pendingPortId',
};

// Route paths for different profile types (relative to APP_BASE_PATH)
const RELATIVE_ROUTES = {
    equipment: '/equipment',
    installation: '/installationProfile',
    organization: '/organizationProfile',
    militaryGroup: '/military-group',
    event: '/event',
    nsagActor: '/nsagActors',
    imo: '/imoProfile',
    port: '/portProfile',
};

// Full route paths including base path (for window.open and external navigation)
const PROFILE_ROUTES = Object.fromEntries(
    Object.entries(RELATIVE_ROUTES).map(([key, path]) => [key, `${APP_BASE_PATH}${path}`])
);

// Prefix for external navigation hash
const EXTERNAL_NAV_PREFIX = 'xid_';

// LocalStorage key for cross-tab communication
const CROSS_TAB_NAV_KEY = 'externalProfileNav';

// =============================================================================
// ENCODING/DECODING (Simple base64 for obfuscation, not security)
// =============================================================================

/**
 * Encode an ID for URL hash (obfuscation, not encryption)
 */
const encodeId = (id) => {
    try {
        return btoa(encodeURIComponent(id));
    } catch {
        return btoa(id);
    }
};

/**
 * Decode an ID from URL hash
 */
const decodeId = (encoded) => {
    try {
        return decodeURIComponent(atob(encoded));
    } catch {
        try {
            return atob(encoded);
        } catch {
            return null;
        }
    }
};

// =============================================================================
// INTERNAL NAVIGATION (Same Application)
// =============================================================================

/**
 * Open a profile page in a new tab with the ID hidden from URL
 * @param {string} profileType - Type of profile ('equipment', 'installation', etc.)
 * @param {string} entityId - The entity ID to pass
 * @param {Object} options - Additional options
 * @param {boolean} options.newTab - Open in new tab (default: true)
 * @param {Function} options.navigate - React Router navigate function (for same-tab navigation)
 */
export const openProfileInNewTab = (profileType, entityId, options = {}) => {
    const { newTab = true, navigate } = options;

    if (!entityId || !profileType) {
        console.warn('openProfileInNewTab: Missing entityId or profileType');
        return;
    }

    const storageKey = STORAGE_KEYS[profileType];
    const route = PROFILE_ROUTES[profileType];

    if (!storageKey || !route) {
        console.warn(`Unknown profile type: ${profileType}`);
        return;
    }

    if (newTab) {
        // For new tabs, use URL hash since sessionStorage is NOT shared between tabs
        // The hash will be consumed and converted to sessionStorage on the target page
        const encodedId = encodeId(entityId);
        const urlWithHash = `${route}#${EXTERNAL_NAV_PREFIX}${encodedId}`;
        console.log('[NavigationUtils] Opening new tab:', {
            profileType,
            entityId,
            encodedId,
            route,
            urlWithHash
        });
        window.open(urlWithHash, '_blank');
    } else if (navigate) {
        // For same-tab navigation, use sessionStorage (it persists in the same tab)
        sessionStorage.setItem(storageKey, entityId);
        navigate(route);
    } else {
        // For same-tab redirect, use sessionStorage
        sessionStorage.setItem(storageKey, entityId);
        window.location.href = route;
    }
};

/**
 * Get the hidden ID from sessionStorage for a profile type
 * @param {string} profileType - Type of profile
 * @param {boolean} clear - Whether to clear after reading (default: true)
 * @returns {string|null} The hidden ID or null
 */
export const getHiddenProfileId = (profileType, clear = true) => {
    const storageKey = STORAGE_KEYS[profileType];
    if (!storageKey) return null;

    const hiddenId = sessionStorage.getItem(storageKey);
    if (hiddenId && clear) {
        sessionStorage.removeItem(storageKey);
    }
    return hiddenId;
};

/**
 * Peek at the hidden ID without clearing it
 */
export const peekHiddenProfileId = (profileType) => {
    return getHiddenProfileId(profileType, false);
};

/**
 * Set a pending profile ID (for programmatic setting)
 */
export const setHiddenProfileId = (profileType, entityId) => {
    const storageKey = STORAGE_KEYS[profileType];
    if (!storageKey || !entityId) return false;
    sessionStorage.setItem(storageKey, entityId);
    return true;
};

/**
 * Clear a pending profile ID
 */
export const clearHiddenProfileId = (profileType) => {
    const storageKey = STORAGE_KEYS[profileType];
    if (storageKey) {
        sessionStorage.removeItem(storageKey);
    }
};

// =============================================================================
// EXTERNAL NAVIGATION (Cross-Application)
// =============================================================================

/**
 * Generate a URL for external applications to link to a profile
 * The ID is encoded in the hash, which doesn't trigger server requests
 * @param {string} profileType - Type of profile
 * @param {string} entityId - The entity ID
 * @param {string} baseUrl - Base URL of this application (optional)
 * @returns {string} Full URL with encoded hash
 */
export const generateExternalProfileUrl = (profileType, entityId, baseUrl = window.location.origin) => {
    const route = PROFILE_ROUTES[profileType];
    if (!route || !entityId) return null;

    const encodedId = encodeId(entityId);
    return `${baseUrl}${route}#${EXTERNAL_NAV_PREFIX}${encodedId}`;
};

/**
 * Check if current URL has an external navigation hash and consume it
 * Should be called once on page load
 * @param {string} profileType - Expected profile type for this page
 * @returns {string|null} The decoded entity ID or null
 */
export const consumeExternalNavigationHash = (profileType) => {
    const hash = window.location.hash;
    const expectedPrefix = `#${EXTERNAL_NAV_PREFIX}`;

    console.log('[NavigationUtils] consumeExternalNavigationHash called:', {
        profileType,
        hash,
        expectedPrefix,
        hasHash: !!hash,
        startsWithPrefix: hash?.startsWith(expectedPrefix)
    });

    if (!hash || !hash.startsWith(expectedPrefix)) {
        console.log('[NavigationUtils] No valid hash found');
        return null;
    }

    // Extract and decode the ID - hash is "#xid_ENCODED", so skip "#xid_" (5 chars)
    const encodedId = hash.substring(expectedPrefix.length);
    const entityId = decodeId(encodedId);

    console.log('[NavigationUtils] Decoded hash:', {
        encodedId,
        entityId,
        decodedSuccessfully: !!entityId
    });

    if (entityId) {
        // Store in sessionStorage for persistence
        setHiddenProfileId(profileType, entityId);

        // Clear the hash from URL without triggering navigation
        if (window.history.replaceState) {
            window.history.replaceState(null, '', window.location.pathname + window.location.search);
        }

        console.log('[NavigationUtils] Successfully consumed hash, stored in sessionStorage:', entityId);
        return entityId;
    }

    return null;
};

/**
 * Set up listener for postMessage navigation (for iframe/popup communication)
 * @param {Function} callback - Called with { profileType, entityId } when message received
 * @returns {Function} Cleanup function to remove listener
 */
export const setupPostMessageListener = (callback) => {
    const handler = (event) => {
        // Validate message structure
        if (event.data?.type === 'PROFILE_NAVIGATION') {
            const { profileType, entityId } = event.data;
            if (profileType && entityId) {
                // Store in sessionStorage
                setHiddenProfileId(profileType, entityId);
                callback({ profileType, entityId });
            }
        }
    };

    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
};

/**
 * Set up listener for cross-tab navigation via localStorage
 * @param {Function} callback - Called with { profileType, entityId } when navigation detected
 * @returns {Function} Cleanup function to remove listener
 */
export const setupCrossTabListener = (callback) => {
    const handler = (event) => {
        if (event.key === CROSS_TAB_NAV_KEY && event.newValue) {
            try {
                const data = JSON.parse(event.newValue);
                const { profileType, entityId } = data;
                if (profileType && entityId) {
                    setHiddenProfileId(profileType, entityId);
                    callback({ profileType, entityId });
                }
            } catch (e) {
                console.warn('Invalid cross-tab navigation data');
            }
        }
    };

    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
};

/**
 * Trigger navigation from external app via localStorage (for same-origin cross-tab)
 * @param {string} profileType - Type of profile
 * @param {string} entityId - The entity ID
 */
export const triggerCrossTabNavigation = (profileType, entityId) => {
    const data = {
        profileType,
        entityId,
        timestamp: Date.now(),
    };
    localStorage.setItem(CROSS_TAB_NAV_KEY, JSON.stringify(data));
    // Clean up immediately (the event is already fired)
    setTimeout(() => localStorage.removeItem(CROSS_TAB_NAV_KEY), 100);
};

// =============================================================================
// CONVENIENCE FUNCTIONS
// =============================================================================

export const openEquipmentInNewTab = (equipmentId, options) => openProfileInNewTab('equipment', equipmentId, options);
export const openInstallationInNewTab = (installationId, options) => openProfileInNewTab('installation', installationId, options);
export const openOrganizationInNewTab = (organizationId, options) => openProfileInNewTab('organization', organizationId, options);
export const openMilitaryGroupInNewTab = (militaryGroupId, options) => openProfileInNewTab('militaryGroup', militaryGroupId, options);
export const openEventInNewTab = (eventId, options) => openProfileInNewTab('event', eventId, options);
export const openNsagActorInNewTab = (nsagActorId, options) => openProfileInNewTab('nsagActor', nsagActorId, options);

// =============================================================================
// UTILITY EXPORTS
// =============================================================================

export const PROFILE_TYPES = Object.keys(STORAGE_KEYS);
export { APP_BASE_PATH, STORAGE_KEYS, RELATIVE_ROUTES, PROFILE_ROUTES };
