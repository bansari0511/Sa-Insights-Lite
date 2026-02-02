/**
 * useExternalNavigation Hook
 *
 * Custom React hook for handling external navigation to profile pages.
 * Manages the lifecycle of hidden profile IDs from external applications.
 *
 * FEATURES:
 * - Consumes external navigation hash on mount
 * - Reads pending ID from sessionStorage
 * - Persists across page refresh
 * - Auto-clears after consumption
 * - Supports postMessage and cross-tab listeners
 *
 * USAGE:
 * ```jsx
 * function InstallationProfileCard() {
 *   const { externalId, isExternalNavigation, clearExternalId } = useExternalNavigation('installation');
 *
 *   useEffect(() => {
 *     if (externalId) {
 *       // Auto-populate searchbox and fetch profile
 *       fetchProfile(externalId);
 *     }
 *   }, [externalId]);
 * }
 * ```
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import {
    getHiddenProfileId,
    consumeExternalNavigationHash,
    setupPostMessageListener,
    setupCrossTabListener,
    clearHiddenProfileId,
    peekHiddenProfileId,
} from '../utils/navigationUtils';

/**
 * Hook for handling external navigation to profile pages
 * @param {string} profileType - The type of profile ('installation', 'event', etc.)
 * @param {Object} options - Configuration options
 * @param {boolean} options.enablePostMessage - Listen for postMessage events (default: false)
 * @param {boolean} options.enableCrossTab - Listen for cross-tab events (default: false)
 * @param {boolean} options.autoClear - Auto-clear ID after reading (default: true)
 * @returns {Object} { externalId, isExternalNavigation, clearExternalId, refreshExternalId }
 */
export function useExternalNavigation(profileType, options = {}) {
    const {
        enablePostMessage = false,
        enableCrossTab = false,
        autoClear = true,
    } = options;

    // State for the external ID
    const [externalId, setExternalId] = useState(null);
    const [isExternalNavigation, setIsExternalNavigation] = useState(false);

    // Track if initial check has been done
    const initialCheckDone = useRef(false);
    const mountedRef = useRef(true);

    // Initial check on mount - runs only once
    useEffect(() => {
        if (initialCheckDone.current) return;
        initialCheckDone.current = true;

        // Priority 1: Check URL hash for external navigation
        const hashId = consumeExternalNavigationHash(profileType);
        if (hashId) {
            setExternalId(hashId);
            setIsExternalNavigation(true);
            return;
        }

        // Priority 2: Check sessionStorage for pending ID
        const pendingId = autoClear
            ? getHiddenProfileId(profileType, true)
            : peekHiddenProfileId(profileType);

        if (pendingId) {
            setExternalId(pendingId);
            setIsExternalNavigation(true);
        }
    }, [profileType, autoClear]);

    // Set up postMessage listener if enabled
    useEffect(() => {
        if (!enablePostMessage) return;

        const cleanup = setupPostMessageListener(({ profileType: type, entityId }) => {
            if (type === profileType && mountedRef.current) {
                setExternalId(entityId);
                setIsExternalNavigation(true);
            }
        });

        return cleanup;
    }, [profileType, enablePostMessage]);

    // Set up cross-tab listener if enabled
    useEffect(() => {
        if (!enableCrossTab) return;

        const cleanup = setupCrossTabListener(({ profileType: type, entityId }) => {
            if (type === profileType && mountedRef.current) {
                setExternalId(entityId);
                setIsExternalNavigation(true);
            }
        });

        return cleanup;
    }, [profileType, enableCrossTab]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            mountedRef.current = false;
        };
    }, []);

    // Function to manually clear the external ID
    const clearExternalId = useCallback(() => {
        setExternalId(null);
        setIsExternalNavigation(false);
        clearHiddenProfileId(profileType);
    }, [profileType]);

    // Function to refresh/re-check for external ID
    const refreshExternalId = useCallback(() => {
        const pendingId = peekHiddenProfileId(profileType);
        if (pendingId) {
            setExternalId(pendingId);
            setIsExternalNavigation(true);
            if (autoClear) {
                clearHiddenProfileId(profileType);
            }
        }
    }, [profileType, autoClear]);

    return {
        externalId,
        isExternalNavigation,
        clearExternalId,
        refreshExternalId,
    };
}

/**
 * Hook specifically for Installation profiles
 */
export function useInstallationExternalNavigation(options = {}) {
    return useExternalNavigation('installation', options);
}

/**
 * Hook specifically for Event profiles
 */
export function useEventExternalNavigation(options = {}) {
    return useExternalNavigation('event', options);
}

/**
 * Hook specifically for Equipment profiles
 */
export function useEquipmentExternalNavigation(options = {}) {
    return useExternalNavigation('equipment', options);
}

/**
 * Hook specifically for Organization profiles
 */
export function useOrganizationExternalNavigation(options = {}) {
    return useExternalNavigation('organization', options);
}

/**
 * Hook specifically for Military Group profiles
 */
export function useMilitaryGroupExternalNavigation(options = {}) {
    return useExternalNavigation('militaryGroup', options);
}

/**
 * Hook specifically for NSAG Actor profiles
 */
export function useNsagActorExternalNavigation(options = {}) {
    return useExternalNavigation('nsagActor', options);
}

export default useExternalNavigation;
