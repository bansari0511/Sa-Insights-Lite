import React, { useEffect, useState, useCallback, useRef, memo } from "react";
import {
  Typography,
  Box,
  TextField,
  Autocomplete,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import { EventContext } from "../../context/EventContext";
import { dataService } from "../../services/dataService";
import { useEventExternalNavigation } from "../../hooks/useExternalNavigation";

// Helper: Transform search result to option format
const transformSearchResult = (item) => ({
  id: item.entity_id || item.id,
  entity_id: item.entity_id || item.id,
  label: item.label || item.name,
  name: item.label || item.name,
  category: item.event_category || item.category,
});

// Theme colors
const colors = {
  blue: { main: '#5D87FF' },
  text: { primary: '#2A3547', secondary: '#5A6A85', tertiary: '#94A3B8', label: '#5A6A85' },
};

// Styles
const styles = {
  inputBox: {
    width: 32,
    height: 32,
    borderRadius: '8px',
    background: 'linear-gradient(135deg, #5D87FF 0%, #49BEFF 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 8px rgba(93, 135, 255, 0.3)',
  },
  inputProps: {
    borderRadius: '10px',
    background: '#FFFFFF',
    fontSize: '0.9rem',
    fontWeight: 500,
    border: '1px solid rgba(93, 135, 255, 0.2)',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
    minHeight: '44px',
    '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
    '&:hover': {
      border: '1px solid rgba(93, 135, 255, 0.4)',
      boxShadow: '0 4px 12px rgba(93, 135, 255, 0.1)',
    },
    '&.Mui-focused': {
      border: '1px solid rgba(93, 135, 255, 0.6)',
      boxShadow: '0 4px 16px rgba(93, 135, 255, 0.15)',
    },
  },
  labelProps: {
    color: colors.text.label,
    fontWeight: 600,
    fontSize: '0.9rem',
    transform: 'translate(50px, -9px) scale(0.85)',
    background: 'linear-gradient(180deg, transparent 45%, white 45%)',
    px: 0.75,
    '&.Mui-focused': { color: colors.blue.main, fontWeight: 700 },
    '&.MuiFormLabel-filled': { color: colors.text.primary }
  },
  autocomplete: {
    '& .MuiAutocomplete-popupIndicator': { color: colors.text.label },
    '& .MuiAutocomplete-clearIndicator': { color: colors.text.label },
    '& .MuiAutocomplete-listbox': {
      padding: '8px 4px',
      maxHeight: '320px',
      '&::-webkit-scrollbar': { width: '6px' },
      '&::-webkit-scrollbar-track': { background: 'rgba(0,0,0,0.02)', borderRadius: '3px' },
      '&::-webkit-scrollbar-thumb': {
        background: 'rgba(93, 135, 255, 0.3)',
        borderRadius: '3px',
        '&:hover': { background: 'rgba(93, 135, 255, 0.5)' },
      },
    },
    '& .MuiAutocomplete-paper': {
      borderRadius: '14px',
      border: '1px solid rgba(93, 135, 255, 0.15)',
      boxShadow: '0 10px 40px rgba(93, 135, 255, 0.15), 0 4px 12px rgba(0, 0, 0, 0.08)',
      background: 'linear-gradient(180deg, #FFFFFF 0%, #FAFBFC 100%)',
      marginTop: '8px',
      overflow: 'hidden',
    },
  },
};

// Main Component
function EventSearchBox() {
  // External navigation hook - handles hidden ID from sessionStorage or URL hash
  const { externalId: hiddenEventId } = useEventExternalNavigation();

  // Use ref to store the hidden ID (for consistent behavior across renders)
  const hiddenEventIdRef = useRef(hiddenEventId);

  // State
  const [selectedEventLocal, setSelectedEventLocal] = useState(null);
  const [val, setValue] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [displayOptions, setDisplayOptions] = useState([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);

  // Refs
  const lastSelectedRef = useRef(null);
  const searchTimeoutRef = useRef(null);
  const mountedRef = useRef(true);
  const isInitializedRef = useRef(false);
  const externalIdProcessedRef = useRef(false);

  // Context
  const { setSelectedEvent, setQuerying, eventsList, hasUserCleared, setHasUserCleared } = React.useContext(EventContext);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, []);

  // Update ref when hidden ID changes (hook may return value asynchronously)
  useEffect(() => {
    if (hiddenEventId) {
      hiddenEventIdRef.current = hiddenEventId;
    }
  }, [hiddenEventId]);

  // Handle external navigation - load event by ID from URL hash or sessionStorage
  useEffect(() => {
    const loadEventFromExternalId = async () => {
      // Use hidden ID from hook/sessionStorage
      const eventId = hiddenEventId || hiddenEventIdRef.current;

      // Only process once and if we have an ID
      if (!eventId || externalIdProcessedRef.current) return;

      externalIdProcessedRef.current = true;
      isInitializedRef.current = true;

      setIsLoadingProfile(true);
      setQuerying?.(true);

      try {
        const res = await dataService.event.getProfile(eventId);

        if (!mountedRef.current) return;

        if (res?.result?.[0]) {
          const result = res.result[0];
          const event = result.event || result.e?.properties || result;
          const eventLabel = event.label || event.name || 'Unknown Event';

          // Set event in context
          setSelectedEvent?.({
            id: event.id,
            name: event.name,
            label: eventLabel,
            event_category: event.event_category,
            description: event.description,
            ...event,
            primary_country: result.primary_country || result['c.label'],
            subGroups: result.subGroups || result.actors || [],
            subGroups2: result.subGroups2 || result.related_equipment || [],
          });

          // Sync searchbox with loaded event
          const eventOption = transformSearchResult({
            entity_id: eventId,
            label: eventLabel,
            event_category: event.event_category
          });

          setValue(eventOption);
          setInputValue(eventLabel);
          setSelectedEventLocal(eventId);
          lastSelectedRef.current = eventId;
          setDisplayOptions([eventOption]);
        }
      } catch (error) {
        console.error('Error loading event from external ID:', error);
      } finally {
        if (mountedRef.current) {
          setIsLoadingProfile(false);
          setQuerying?.(false);
        }
      }
    };

    loadEventFromExternalId();
  }, [hiddenEventId, setSelectedEvent, setQuerying]);

  // Initialize with first event from list (only once, if no external ID and user hasn't cleared)
  useEffect(() => {
    // Skip if external ID is present or already initialized or user cleared
    if (hiddenEventId || hiddenEventIdRef.current || isInitializedRef.current || hasUserCleared) return;

    if (eventsList?.length > 0) {
      const firstEvent = eventsList[0];
      if (firstEvent?.id) {
        isInitializedRef.current = true;
        setValue(firstEvent);
        setInputValue(firstEvent.label || firstEvent.name || '');
        setSelectedEventLocal(firstEvent.id);
        setDisplayOptions(eventsList.slice(0, 10));
      }
    }
  }, [eventsList, hasUserCleared, hiddenEventId]);

  // Fetch event profile when selection changes
  useEffect(() => {
    if (!selectedEventLocal || lastSelectedRef.current === selectedEventLocal) return;

    const fetchEventProfile = async () => {
      lastSelectedRef.current = selectedEventLocal;
      setIsLoadingProfile(true);
      setQuerying?.(true);

      try {
        const res = await dataService.event.getProfile(selectedEventLocal);
        if (!mountedRef.current) return;

        if (res?.result?.[0]) {
          const result = res.result[0];
          const event = result.event || result.e?.properties || result;
          setSelectedEvent?.({
            id: event.id,
            name: event.name,
            label: event.label || event.name,
            event_category: event.event_category,
            description: event.description,
            ...event,
            primary_country: result.primary_country || result['c.label'],
            subGroups: result.subGroups || result.actors || [],
            subGroups2: result.subGroups2 || result.related_equipment || [],
          });
        } else {
          setSelectedEvent?.(null);
        }
      } catch (error) {
        console.error('Error fetching event profile:', error);
        if (mountedRef.current) setSelectedEvent?.(null);
      } finally {
        if (mountedRef.current) {
          setIsLoadingProfile(false);
          setQuerying?.(false);
        }
      }
    };

    fetchEventProfile();
  }, [selectedEventLocal, setSelectedEvent, setQuerying]);

  // Fetch suggestions (debounced)
  const fetchEventSuggestions = useCallback(async (searchTerm) => {
    if (!searchTerm || searchTerm.length < 3) {
      if (eventsList?.length > 0) setDisplayOptions(eventsList.slice(0, 10));
      setIsLoadingSuggestions(false);
      return;
    }

    try {
      setIsLoadingSuggestions(true);
      const data = await dataService.entitySearch.search(searchTerm.trim(), 'event');

      if (!mountedRef.current) return;

      if (data?.result?.length > 0) {
        setDisplayOptions(data.result.map(transformSearchResult).slice(0, 50));
      } else {
        const filtered = (eventsList || []).filter(ev => {
          if (!ev) return false;
          const text = searchTerm.toLowerCase();
          return (ev.label || ev.name || '').toLowerCase().includes(text) ||
            (ev.id || '').toLowerCase().includes(text);
        });
        setDisplayOptions(filtered.slice(0, 50));
      }
    } catch (error) {
      if (mountedRef.current) {
        const filtered = (eventsList || []).filter(ev => {
          if (!ev) return false;
          return (ev.label || ev.name || '').toLowerCase().includes(searchTerm.toLowerCase());
        });
        setDisplayOptions(filtered.slice(0, 50));
      }
    } finally {
      if (mountedRef.current) setIsLoadingSuggestions(false);
    }
  }, [eventsList]);

  // Handle selection change
  const handleChange = useCallback((_event, newValue) => {
    setValue(newValue);
    if (newValue) {
      setHasUserCleared?.(false);
      setInputValue(newValue.label || newValue.name || '');
      setSelectedEventLocal(newValue.id || newValue.entity_id);
      if (!displayOptions.find(opt => (opt.id || opt.entity_id) === (newValue.id || newValue.entity_id))) {
        setDisplayOptions(prev => [newValue, ...prev]);
      }
    } else {
      setHasUserCleared?.(true);
      setInputValue('');
      setSelectedEventLocal(null);
      lastSelectedRef.current = null;
      setSelectedEvent?.(null);
    }
  }, [displayOptions, setSelectedEvent, setHasUserCleared]);

  // Handle input change
  const handleInputChange = useCallback((_event, newInputValue, reason) => {
    if (reason === 'input') {
      setInputValue(newInputValue);
      if (val && newInputValue !== (val.label || val.name)) {
        setValue(null);
        setSelectedEventLocal(null);
        lastSelectedRef.current = null;
      }
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
      searchTimeoutRef.current = setTimeout(() => fetchEventSuggestions(newInputValue), 300);
    } else if (reason === 'reset') {
      if (val) setInputValue(val.label || val.name || '');
    } else if (reason === 'clear') {
      setHasUserCleared?.(true);
      setInputValue('');
      setValue(null);
      setSelectedEventLocal(null);
      lastSelectedRef.current = null;
      setDisplayOptions([]);
      setSelectedEvent?.(null);
    }
  }, [val, fetchEventSuggestions, setSelectedEvent, setHasUserCleared]);

  const isLoading = isLoadingSuggestions || isLoadingProfile;

  return (
    <Box sx={{ width: '100%', maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <Autocomplete
        size="small"
        fullWidth
        value={val}
        inputValue={inputValue}
        onChange={handleChange}
        onInputChange={handleInputChange}
        options={displayOptions}
        loading={isLoading}
        getOptionLabel={(option) => option?.label || option?.name || ''}
        isOptionEqualToValue={(option, v) => {
          if (!option || !v) return option === v;
          return (option.id || option.entity_id) === (v.id || v.entity_id);
        }}
        filterOptions={(options) => options}
        openOnFocus={true}
        blurOnSelect={true}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search Events"
            placeholder="Enter event name..."
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <>
                  <InputAdornment position="start">
                    <Box sx={styles.inputBox}>
                      <EventIcon sx={{ color: '#FFFFFF', fontSize: '1rem' }} />
                    </Box>
                  </InputAdornment>
                  {params.InputProps.startAdornment}
                </>
              ),
              endAdornment: (
                <>
                  {isLoading ? <CircularProgress sx={{ color: colors.blue.main }} size={20} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
              sx: styles.inputProps
            }}
            InputLabelProps={{ shrink: true, sx: styles.labelProps }}
            sx={{
              '& .MuiInputBase-input': {
                padding: '10px 12px 10px 0',
                fontSize: '0.9rem',
                fontWeight: 500,
                color: colors.text.primary,
                '&::placeholder': { color: colors.text.tertiary, fontWeight: 400, opacity: 1, fontSize: '0.88rem' }
              },
            }}
          />
        )}
        renderOption={(props, option) => {
          const { key, ...otherProps } = props;
          return (
            <Box
              component="li"
              key={key}
              {...otherProps}
              sx={{
                padding: '12px 16px',
                borderRadius: '8px',
                margin: '4px 8px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                backgroundColor: 'transparent',
                '&:hover': { backgroundColor: 'rgba(93, 135, 255, 0.08)' },
                '&[aria-selected="true"]': { backgroundColor: 'rgba(93, 135, 255, 0.12)' },
                '&.Mui-focused': { backgroundColor: 'rgba(93, 135, 255, 0.08)' },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                <Box sx={{ ...styles.inputBox, flexShrink: 0 }}>
                  <EventIcon sx={{ color: '#FFFFFF', fontSize: '1rem' }} />
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25, flex: 1, minWidth: 0 }}>
                  <Typography sx={{
                    fontWeight: 600,
                    color: colors.text.primary,
                    fontSize: '0.875rem',
                    lineHeight: 1.4,
                    wordBreak: 'break-word',
                    whiteSpace: 'normal',
                  }}>
                    {option.label || option.name || 'Unknown Event'}
                  </Typography>
                  {option.category && (
                    <Typography variant="caption" sx={{
                      color: colors.text.secondary,
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      wordBreak: 'break-word',
                      whiteSpace: 'normal',
                    }}>
                      {option.category}
                    </Typography>
                  )}
                </Box>
              </Box>
            </Box>
          );
        }}
        loadingText={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 2, px: 1 }}>
            <CircularProgress size={20} sx={{ color: colors.blue.main }} />
            <Typography sx={{ color: colors.text.secondary, fontSize: '0.875rem', fontWeight: 500 }}>Searching events...</Typography>
          </Box>
        }
        noOptionsText={
          <Box sx={{ py: 3, px: 2, textAlign: 'center' }}>
            <Box sx={{ width: 48, height: 48, borderRadius: '12px', background: 'linear-gradient(135deg, rgba(93, 135, 255, 0.1) 0%, rgba(73, 190, 255, 0.05) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', border: '1px solid rgba(93, 135, 255, 0.15)' }}>
              <EventIcon sx={{ color: colors.text.tertiary, fontSize: '1.4rem' }} />
            </Box>
            <Typography sx={{ color: colors.text.secondary, fontSize: '0.875rem', fontWeight: 500 }}>
              {inputValue.length < 3 ? "Type at least 3 characters..." : "No events found"}
            </Typography>
          </Box>
        }
        sx={styles.autocomplete}
      />
      <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, color: colors.text.tertiary, textAlign: 'right', pr: 0.5, mt: 0.5, letterSpacing: '0.01em' }}>
        Type at least 3+ characters to search events
      </Typography>
    </Box>
  );
}

export default memo(EventSearchBox);
