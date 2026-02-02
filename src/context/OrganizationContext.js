import { useState, createContext, useContext, useEffect, useCallback, useRef } from "react";
import { RequestContext } from "./RequestContext";
import { organizationService } from "../services/dataService";
import { queryAPI } from "../utils/QueryGraph";

export const OrganizationContext = createContext();

export const OrganizationContextProvider = (props) => {
    // Access global context for shared resources
    const { baseApiUrl, baseImageUrl } = useContext(RequestContext);

    // Organization-specific state
    const [querying, setQuerying] = useState(false);
    const [organization, setOrganization] = useState(null);
    const [organizationList, setOrganizationList] = useState([]);
    const [organizationProfile, setOrganizationProfile] = useState(null);
    const [isLoadingProfile, setIsLoadingProfile] = useState(false);
    const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

    // Search state
    const [searchValue, setSearchValue] = useState(null);
    const [inputValue, setInputValue] = useState('');
    const [displayOptions, setDisplayOptions] = useState([]);

    // Organization filters (for future use)
    const [organizationTypeFilter, setOrganizationTypeFilter] = useState([]);
    const [organizationCountryFilter, setOrganizationCountryFilter] = useState([]);

    // Organization layer for map
    const [organizationLayer, setOrganizationLayer] = useState(null);

    // Related data
    const [equipmentTypes, setEquipmentTypes] = useState([]);
    const [isLoadingEquipment, setIsLoadingEquipment] = useState(false);

    // Modal states
    const [openModalOrgNews, setOpenModalOrgNews] = useState(false);
    const [openModalOrgEvents, setOpenModalOrgEvents] = useState(false);
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

    // Process API response helper
    const processApiResponse = (row) => {
        const properties = row.c?.properties || {};
        const country = row["m.name"] || null;
        const equipmentArray = row.subGroups || [];
        const partners = row.subGroups2 || [];
        const headOrgArray = row.subGroups3 || [];
        const parentOrgArray = row.subGroups4 || [];

        const uniqueEquipment = equipmentArray.filter((item, index, self) => {
            const itemName = item?.name || item?.label;
            return itemName && self.findIndex(p => (p?.name || p?.label) === itemName) === index;
        });
        const uniquePartners = partners.filter((item, index, self) => {
            const itemName = item?.label || item?.name;
            return itemName && self.findIndex(p => (p?.label || p?.name) === itemName) === index;
        });
        const uniqueHeadOrgs = headOrgArray.filter((item, index, self) => {
            const itemName = item?.label || item?.name;
            return itemName && self.findIndex(p => (p?.label || p?.name) === itemName) === index;
        });
        const uniqueParentOrgs = parentOrgArray.filter((item, index, self) => {
            const itemName = item?.label || item?.name;
            return itemName && self.findIndex(p => (p?.label || p?.name) === itemName) === index;
        });

        return {
            label: properties.label, name: properties.name, display_name_label: properties.display_name_label,
            legal_name: properties.legal_name, legal_name_label: properties.legal_name_label,
            organization_type: properties.organization_type, organization_sub_type: properties.organization_sub_type,
            status: properties.status, ownership: properties.ownership,
            address_city: properties.address_city, address_street: properties.address_street,
            address_address_line1: properties.address_address_line1, address_postal_code: properties.address_postal_code,
            address_postcode: properties.address_postcode, telephone_numbers: properties.telephone_numbers,
            lat: properties.lat, long: properties.long, legacy_jguid: properties.legacy_jguid,
            last_modified_date: properties.last_modified_date, synonym_label: properties.synonym_label,
            country_of_domicile: country, manufactures: uniqueEquipment, partner_of: uniquePartners,
            head_organizations: uniqueHeadOrgs.map(item => item?.label || item?.name || item),
            head_organization: uniqueHeadOrgs.length > 0 ? (uniqueHeadOrgs[0]?.label || uniqueHeadOrgs[0]?.name) : null,
            parent_organizations: uniqueParentOrgs.map(item => item?.label || item?.name || item),
            parent_organization: uniqueParentOrgs.length > 0 ? (uniqueParentOrgs[0]?.label || uniqueParentOrgs[0]?.name) : null,
        };
    };

    // Load initial organization list
    useEffect(() => {
        if (!baseApiUrl) return;

        const loadInitialList = async () => {
            try {
                setIsLoadingSuggestions(true);
                const data = await organizationService.getList('');
                if (data?.result?.length > 0) {
                    setOrganizationList(data.result);
                    setDisplayOptions(data.result.slice(0, 10));
                    // Auto-select first organization
                    const firstOrg = data.result[0];
                    setSearchValue(firstOrg);
                    setInputValue(firstOrg.label);
                    setOrganization(firstOrg);
                }
            } catch (error) {
                console.error('Error loading initial organization list:', error);
                setOrganizationList([]);
            } finally {
                setIsLoadingSuggestions(false);
            }
        };
        loadInitialList();
    }, [baseApiUrl]);

    // Fetch organization profile when selection changes
    useEffect(() => {
        const fetchProfile = async () => {
            if (!organization?.entity_id && !organization?.label) return;

            const selectedId = organization.entity_id || organization.label;
            if (lastSelectedRef.current === selectedId) return;

            lastSelectedRef.current = selectedId;
            setIsLoadingProfile(true);
            setQuerying(true);

            try {
                // Try manufacturer endpoint first
                const res = await queryAPI("manufacturer", selectedId, null, baseApiUrl);
                if (res?.result?.length > 0) {
                    setOrganizationProfile(processApiResponse(res.result[0]));
                } else {
                    // Fallback to organization service
                    const orgData = await organizationService.getProfile(selectedId);
                    if (orgData?.result?.length > 0) {
                        setOrganizationProfile(processApiResponse(orgData.result[0]));
                    } else {
                        setOrganizationProfile(null);
                    }
                }
            } catch (error) {
                console.error('Error fetching organization profile:', error);
                setOrganizationProfile(null);
            } finally {
                setIsLoadingProfile(false);
                setQuerying(false);
            }
        };
        fetchProfile();
    }, [organization, baseApiUrl]);

    // Fetch equipment types when organization profile changes
    useEffect(() => {
        const fetchEquipmentTypes = async () => {
            // Use entity_id from organization selection, fallback to label
            const orgEntityId = organization?.entity_id || organizationProfile?.legacy_jguid || organizationProfile?.label;
            if (!orgEntityId || !baseApiUrl) return;

            try {
                setIsLoadingEquipment(true);
                const res = await queryAPI("manufacturer_details", orgEntityId, null, baseApiUrl);
                if (res?.result?.length > 0) {
                    // Extract equipment_types from the response
                    const manufacturerData = res.result[0];
                    const types = manufacturerData?.equipment_types || [];
                    setEquipmentTypes(types);
                } else {
                    setEquipmentTypes([]);
                }
            } catch (error) {
                console.error('Error fetching equipment types:', error);
                setEquipmentTypes([]);
            } finally {
                setIsLoadingEquipment(false);
            }
        };
        fetchEquipmentTypes();
    }, [organization?.entity_id, organizationProfile?.legacy_jguid, organizationProfile?.label, baseApiUrl]);

    // Fetch suggestions with debounce
    const fetchSuggestions = useCallback(async (searchTerm) => {
        if (searchTerm.length < 3) {
            try {
                setIsLoadingSuggestions(true);
                const data = await organizationService.getList('');
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
            const data = await organizationService.getList(searchTerm);
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
            setOrganization(null);
            lastSelectedRef.current = null;
            setDisplayOptions([]);
            setOrganizationProfile(null);
        }
    }, [searchValue, fetchSuggestions]);

    // Handle selection change
    const handleSelectionChange = useCallback((newValue) => {
        setSearchValue(newValue);
        if (newValue) {
            setInputValue(newValue.label);
            setOrganization(newValue);
            if (!displayOptions.find(opt => opt.entity_id === newValue.entity_id)) {
                setDisplayOptions(prev => [newValue, ...prev]);
            }
        } else {
            setInputValue('');
            setOrganization(null);
            lastSelectedRef.current = null;
            setOrganizationProfile(null);
        }
    }, [displayOptions]);

    return (
        <OrganizationContext.Provider
            value={{
                // Shared resources from global context
                baseApiUrl,
                baseImageUrl,

                // Organization-specific state
                querying,
                setQuerying,
                organization,
                setOrganization,
                organizationList,
                setOrganizationList,
                organizationProfile,
                setOrganizationProfile,
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
                organizationTypeFilter,
                setOrganizationTypeFilter,
                organizationCountryFilter,
                setOrganizationCountryFilter,

                // Organization layer for map
                organizationLayer,
                setOrganizationLayer,

                // Related data
                equipmentTypes,
                setEquipmentTypes,
                isLoadingEquipment,

                // Modal states
                openModalOrgNews,
                setOpenModalOrgNews,
                openModalOrgEvents,
                setOpenModalOrgEvents,
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
                processApiResponse,
            }}
        >
            {props.children}
        </OrganizationContext.Provider>
    );
};

// Custom hook for easier consumption
export const useOrganizationContext = () => {
    const context = useContext(OrganizationContext);
    if (!context) {
        console.warn('useOrganizationContext must be used within OrganizationContextProvider');
    }
    return context;
};
