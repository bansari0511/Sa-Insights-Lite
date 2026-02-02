import { useState, createContext, useContext, useEffect, useCallback, useRef } from "react";
import { RequestContext } from "./RequestContext";
import { installationService } from "../services/dataService";

export const InstallationContext = createContext();

// Prefix for external navigation hash (must match navigationUtils.js)
const EXTERNAL_NAV_PREFIX = 'xid_';

// Check if there's a pending installation ID from navigation
// Checks both sessionStorage and URL hash (for new tab navigation)
const getPendingInstallationId = () => {
    // Check sessionStorage first (for same-tab navigation)
    const sessionId = sessionStorage.getItem('pendingInstallationId');
    if (sessionId) return sessionId;

    // Check URL hash (for new tab navigation with #xid_xxx format)
    if (typeof window !== 'undefined') {
        const hash = window.location.hash;
        if (hash && hash.startsWith(`#${EXTERNAL_NAV_PREFIX}`)) {
            return 'pending_from_hash'; // Signal that we have a pending ID in hash
        }
    }

    return null;
};

export const InstallationContextProvider = (props) => {
    // Access global context for shared resources
    const { baseApiUrl, baseImageUrl } = useContext(RequestContext);

    // Track if we had a pending ID at initialization (checked once, before any effects)
    const [hadPendingId] = useState(() => !!getPendingInstallationId());

    // Installation-specific state
    const [querying, setQuerying] = useState(false);
    const [installation, setInstallation] = useState(null);
    const [installationList, setInstallationList] = useState([]);
    const [installationProfile, setInstallationProfile] = useState(null);
    const [isLoadingProfile, setIsLoadingProfile] = useState(false);
    const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

    // Search state
    const [searchValue, setSearchValue] = useState(null);
    const [inputValue, setInputValue] = useState('');
    const [displayOptions, setDisplayOptions] = useState([]);

    // Installation filters (for future use)
    const [installationTypeFilter, setInstallationTypeFilter] = useState([]);
    const [installationCountryFilter, setInstallationCountryFilter] = useState([]);

    // Installation layer for map
    const [installationLayer, setInstallationLayer] = useState(null);

    // Modal states
    const [openModalInstallationNews, setOpenModalInstallationNews] = useState(false);
    const [openModalInstallationEvents, setOpenModalInstallationEvents] = useState(false);
    const [newsData, setNewsData] = useState([]);
    const [eventData, setEventData] = useState([]);
    const [newsLoading, setNewsLoading] = useState(false);
    const [eventLoading, setEventLoading] = useState(false);

    // Map expanded state
    const [mapExpanded, setMapExpanded] = useState(false);

    // Refs for tracking
    const lastSelectedRef = useRef(null);
    const searchTimeoutRef = useRef(null);

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
        };
    }, []);

    // Load initial installation list
    useEffect(() => {
        if (!baseApiUrl) return;

        const loadInitialList = async () => {
            try {
                setIsLoadingSuggestions(true);
                const data = await installationService.getList();
                if (data?.result?.length > 0) {
                    setInstallationList(data.result);
                    setDisplayOptions(data.result.slice(0, 10));
                    // Only auto-select first installation if there was no pending ID from navigation
                    // This allows the profile card to load the correct installation from sessionStorage
                    if (!hadPendingId) {
                        const firstInstallation = data.result[0];
                        setSearchValue(firstInstallation);
                        setInputValue(firstInstallation.label);
                        setInstallation(firstInstallation);
                    }
                }
            } catch (error) {
                console.error('Error loading initial installation list:', error);
                setInstallationList([]);
            } finally {
                setIsLoadingSuggestions(false);
            }
        };
        loadInitialList();
    }, [baseApiUrl, hadPendingId]);

    // Fetch installation profile when selection changes
    useEffect(() => {
        const fetchProfile = async () => {
            if (!installation?.label && !installation?.entity_id) return;

            const selectedId = installation.label || installation.entity_id;
            if (lastSelectedRef.current === selectedId) return;

            lastSelectedRef.current = selectedId;
            setIsLoadingProfile(true);
            setQuerying(true);

            try {
                const data = await installationService.getProfile(selectedId);
                if (data?.result?.[0]) {
                    setInstallationProfile(data.result[0]);
                } else {
                    setInstallationProfile(data || null);
                }
            } catch (error) {
                console.error('Error fetching installation profile:', error);
                setInstallationProfile(null);
            } finally {
                setIsLoadingProfile(false);
                setQuerying(false);
            }
        };
        fetchProfile();
    }, [installation]);

    // Fetch suggestions with debounce
    const fetchSuggestions = useCallback(async (searchTerm) => {
        if (searchTerm.length < 3) {
            try {
                setIsLoadingSuggestions(true);
                const data = await installationService.getList();
                if (data?.result?.length > 0) {
                    setDisplayOptions(data.result.slice(0, 10));
                }
            } catch (error) {
                setDisplayOptions([]);
            } finally {
                setIsLoadingSuggestions(false);
            }
            return;
        }

        try {
            setIsLoadingSuggestions(true);
            const data = await installationService.getList(searchTerm);
            if (data?.result?.length > 0) {
                const filtered = data.result.filter(item =>
                    item.label?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.entity_id?.toLowerCase().includes(searchTerm.toLowerCase())
                );
                setDisplayOptions(filtered.slice(0, 50));
            } else {
                setDisplayOptions([]);
            }
        } catch (error) {
            setDisplayOptions([]);
        } finally {
            setIsLoadingSuggestions(false);
        }
    }, []);

    // Handle search input change with debounce
    const handleInputChange = useCallback((newInputValue, reason) => {
        if (reason === 'input') {
            setInputValue(newInputValue);
            if (searchValue && newInputValue !== searchValue.label) {
                setSearchValue(null);
            }
            if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
            searchTimeoutRef.current = setTimeout(() => fetchSuggestions(newInputValue), 300);
        } else if (reason === 'reset') {
            if (searchValue) setInputValue(searchValue.label);
        } else if (reason === 'clear') {
            setInputValue('');
            setSearchValue(null);
            setInstallation(null);
            lastSelectedRef.current = null;
            setDisplayOptions([]);
            setInstallationProfile(null);
        }
    }, [searchValue, fetchSuggestions]);

    // Handle selection change
    const handleSelectionChange = useCallback((newValue) => {
        setSearchValue(newValue);
        if (newValue) {
            setInputValue(newValue.label);
            setInstallation(newValue);
            if (!displayOptions.find(opt => opt.entity_id === newValue.entity_id)) {
                setDisplayOptions(prev => [newValue, ...prev]);
            }
        } else {
            setInputValue('');
            setInstallation(null);
            lastSelectedRef.current = null;
            setInstallationProfile(null);
        }
    }, [displayOptions]);

    return (
        <InstallationContext.Provider
            value={{
                // Shared resources from global context
                baseApiUrl,
                baseImageUrl,

                // Installation-specific state
                querying,
                setQuerying,
                installation,
                setInstallation,
                installationList,
                setInstallationList,
                installationProfile,
                setInstallationProfile,
                isLoadingProfile,
                setIsLoadingProfile,
                isLoadingSuggestions,

                // Search state
                searchValue,
                setSearchValue,
                inputValue,
                setInputValue,
                displayOptions,
                setDisplayOptions,

                // Filters
                installationTypeFilter,
                setInstallationTypeFilter,
                installationCountryFilter,
                setInstallationCountryFilter,

                // Installation layer for map
                installationLayer,
                setInstallationLayer,

                // Modal states
                openModalInstallationNews,
                setOpenModalInstallationNews,
                openModalInstallationEvents,
                setOpenModalInstallationEvents,
                newsData,
                setNewsData,
                eventData,
                setEventData,
                newsLoading,
                setNewsLoading,
                eventLoading,
                setEventLoading,

                // Map state
                mapExpanded,
                setMapExpanded,

                // Helper functions
                handleInputChange,
                handleSelectionChange,
                fetchSuggestions,
            }}
        >
            {props.children}
        </InstallationContext.Provider>
    );
};

// Custom hook for easier consumption
export const useInstallationContext = () => {
    const context = useContext(InstallationContext);
    if (!context) {
        console.warn('useInstallationContext must be used within InstallationContextProvider');
    }
    return context;
};
