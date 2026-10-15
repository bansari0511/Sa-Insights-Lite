/* src/pages/MapEventsPage.jsx */
import React, { useCallback, useState, useEffect, useRef, useMemo } from 'react';
import {
  Grid,
  Paper,
  Box,
  Button,
  TextField,
  Autocomplete,
  Chip,
  MenuItem,
  Typography,
  Divider,
  CircularProgress,
  Slider,
  IconButton,
  Collapse,
} from '@mui/material';
import { Settings as SettingsIcon } from '@mui/icons-material';
import MapTemplate from './mapTemplateEventTimeline';
import { fetchEventsData } from './EventTimeLineApi';
import countryData from "../../country.json";
import { mapTheme, eventCategories, useThemeContext } from '../../theme';
import { colors as themeColors } from '../../theme';

const ACCENT = mapTheme.colors.accentOrange;
const TIMELINE_WIDTH = mapTheme.sizing.timeline.width;

// Use centralized event categories from theme
const EVENT_CATEGORIES = eventCategories;

// Helper to get category config with fallback
const getCategoryConfig = (category) => {
  return EVENT_CATEGORIES[category] || {
    color: mapTheme.colors.events.default, // Gray for unknown
    icon: '📍', // Pin
    name: category || 'Other'
  };
};

function groupByDate(events) {
  const groups = {};
  events.forEach((ev) => {
    const dateKey = ev.start_date || 'Unknown';
    if (!groups[dateKey]) groups[dateKey] = [];
    groups[dateKey].push(ev);
  });
  const keys = Object.keys(groups).sort((a, b) => {
    if (a === 'Unknown') return 1;
    if (b === 'Unknown') return -1;
    return new Date(b) - new Date(a);
  });
  return keys.map((k) => ({
    date: k,
    label: k === 'Unknown' ? 'Unknown Date' : formatDate(k),
    items: groups[k]
  }));
}

function formatDate(dateString) {
  if (!dateString) return 'Unknown';
  const d = new Date(dateString);
  if (isNaN(d)) return dateString;
  const day = d.getDate().toString().padStart(2, '0');
  const month = d.toLocaleString('default', { month: 'short' }); // short month
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
}

/* --- Date helpers --- */
function formatISODate(d) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function computePresetRange(preset) {
  const today = new Date();
  const end = formatISODate(today);
  let startDate = today;
  switch (preset) {
    case 'today':
      startDate = today;
      break;
    case '2days':
      startDate = new Date(today.getTime() - (2 - 1) * 24 * 60 * 60 * 1000);
      break;
    case '3days':
      startDate = new Date(today.getTime() - (3 - 1) * 24 * 60 * 60 * 1000);
      break;
    case '7days':
      startDate = new Date(today.getTime() - (7 - 1) * 24 * 60 * 60 * 1000);
      break;
    case '30days':
      startDate = new Date(today.getTime() - (30 - 1) * 24 * 60 * 60 * 1000);
      break;
    case '90days':
      startDate = new Date(today.getTime() - (90 - 1) * 24 * 60 * 60 * 1000);
      break;
    default:
      startDate = new Date(today.getTime() - (90 - 1) * 24 * 60 * 60 * 1000);
  }
  return { start: formatISODate(startDate), end };
}

// Dummy data flag - set to true to use dummy data, false to use API
const DUMMY_DATA = false;

// Dummy data matching the new response structure
const DUMMY_RECORDS = [
  {
    0: {
      eventCategory: { label: "Terrorism" },
      eventCountry: [{ country: { label: "India" } }],
      eventLocation: { lat: 19.02, long: 72.33 },
      id: "evt_001",
      lastModifiedDate: "2025-11-08",
      summary: "A terrorist attack was thwarted by security forces in Mumbai. The operation was conducted based on intelligence inputs and led to the arrest of several suspects.",
      title: "Mumbai Terror Plot Foiled"
    },
    1: {
      eventCategory: { label: "Government" },
      eventCountry: [{ country: { label: "China" } }],
      eventLocation: { lat: 39.90, long: 116.40 },
      id: "evt_002",
      lastModifiedDate: "2025-11-07",
      summary: "Chinese government announces new policy reforms aimed at boosting economic growth and technological innovation in key sectors.",
      title: "China Announces Economic Reforms"
    }
  },
  {
    0: {
      eventCategory: { label: "Military" },
      eventCountry: [{ country: { label: "Pakistan" } }],
      eventLocation: { lat: 33.69, long: 73.05 },
      id: "evt_003",
      lastModifiedDate: "2025-11-06",
      summary: "Pakistan military conducts joint exercises with allied nations along the western border regions to enhance defense capabilities.",
      title: "Pakistan Military Exercises Begin"
    },
    1: {
      eventCategory: { label: "Terrorism" },
      eventCountry: [{ country: { label: "India" } }],
      eventLocation: { lat: 28.61, long: 77.23 },
      id: "evt_004",
      lastModifiedDate: "2025-11-05",
      summary: "Security agencies in Delhi intercept communication suggesting potential terror threats. High alert issued across the capital region.",
      title: "Delhi on High Alert After Terror Threat"
    }
  },
  {
    0: {
      eventCategory: { label: "Economy" },
      eventCountry: [{ country: { label: "China" } }],
      eventLocation: { lat: 31.23, long: 121.47 },
      id: "evt_005",
      lastModifiedDate: "2025-11-04",
      summary: "Shanghai stock market shows significant gains following positive economic indicators and increased foreign investment in the technology sector.",
      title: "Shanghai Markets Rally on Tech Investment"
    },
    1: {
      eventCategory: { label: "Cyber" },
      eventCountry: [{ country: { label: "India" } }],
      eventLocation: { lat: 12.97, long: 77.59 },
      id: "evt_006",
      lastModifiedDate: "2025-11-03",
      summary: "Cybersecurity experts in Bangalore detect and neutralize a major ransomware attack targeting critical infrastructure systems.",
      title: "Bangalore Thwarts Major Cyber Attack"
    }
  }
];

export default function MapEventsPage() {
  // =============================================================================
  // DARK MODE SUPPORT
  // =============================================================================
  const { isDark } = useThemeContext();
  const darkBg =        '#1A1A1E';
  const darkSurface =   '#232328';
  const darkSurfaceHov ='#2A2A2F';
  const darkBorder =    '#313136';
  const darkBorderLt =  '#3D3D45';
  const darkTextPri =   '#EDEDF0';
  const darkTextSec =   '#A8A8B3';
  const darkTextMut =   '#85858F';
  const darkTextDis =   '#6B6B75';
  const darkChipBg =    '#313136';
  const darkOverlay =   'rgba(26, 26, 30, 0.95)';

  // Shorthand helper: light value, dark value
  const c = (light, dark) => isDark ? dark : light;
  // static country list for now
  const [selectedCountries, setSelectedCountries] = useState(['China', 'Pakistan', 'India']);

  // Use the 6 defined categories
  const categories = Object.keys(EVENT_CATEGORIES);
  const [selectedCategories, setSelectedCategories] = useState([]);

  // Keyword search state
  const [keyword, setKeyword] = useState('');

  // default preset = 90 days
  const [dateFilter, setDateFilter] = useState('90days');
  const initialRange = computePresetRange('90days');
  const [customFrom, setCustomFrom] = useState(initialRange.start);
  const [customTo, setCustomTo] = useState(initialRange.end);

  const [events, setEvents] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [lastDocId, setLastDocId] = useState(''); // Track last document ID for pagination
  const [totalHits, setTotalHits] = useState(0); // Track total number of records available
  const pageSize = 100;

  const mapApiRef = useRef(null);
  const timelineContainerRef = useRef(null);
  const animationIntervalRef = useRef(null);

  // Animation state
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentAnimationIndex, setCurrentAnimationIndex] = useState(-1);
  const [animationStartIndex, setAnimationStartIndex] = useState(0);
  const [animationEndIndex, setAnimationEndIndex] = useState(-1); // -1 means use events.length
  const [animationSpeed, setAnimationSpeed] = useState(2000); // Default 2 seconds per card
  const [showAnimationControls, setShowAnimationControls] = useState(false); // Toggle for animation controls

  // map ready callback (MapTemplate should call this)
  const handleMapReady = useCallback((api) => {
    mapApiRef.current = api;
  }, []);

  const countries = countryData.result.map(item => item["e.label"]);

  // plot events on map whenever events change
  useEffect(() => {
    if (!mapApiRef.current) return;
    const api = mapApiRef.current;
    try {
      api.clearEvents();
    } catch (e) {
      // ignore if not present
    }
    events.forEach((ev) => {
      const lon = Number(ev.longitude ?? ev.lng ?? ev.lon ?? NaN);
      const lat = Number(ev.latitude ?? ev.lat ?? NaN);
      if (!isNaN(lon) && !isNaN(lat)) {
        const categoryConfig = getCategoryConfig(ev.event_category);
        // Pass category-based config to map
        api.addEventGraphic({
          longitude: lon,
          latitude: lat,
          properties: ev.properties,
          labels: ev.labels || ev.properties?.labels || [],
          eventCategory: ev.event_category,
          categoryColor: categoryConfig.color,
          categoryIcon: categoryConfig.icon
        });
      }
    });

    // Update TimeSlider extent after events are added
    if (api.updateTimeSliderExtent && events.length > 0) {
      console.log('Updating TimeSlider extent with', events.length, 'events');
      api.updateTimeSliderExtent();
    }
  }, [events]);

  // when preset changes, update from/to unless custom selected
  useEffect(() => {
    if (dateFilter === 'custom') return;
    const { start, end } = computePresetRange(dateFilter);
    setCustomFrom(start);
    setCustomTo(end);
  }, [dateFilter]);

  const buildPayload = useCallback((lastDocIdParam = '') => {
    const eventFilters = {};

    if(selectedCategories?.length > 0) {
      eventFilters.eventcategory = selectedCategories;
    } else
    {
    eventFilters.eventcategory = [];
    }

    if(selectedCountries?.length > 0) {
      eventFilters.eventcountry = selectedCountries;
    } else
    {
     eventFilters.eventcountry = [];
    }
    eventFilters.actorlabel = [];
    eventFilters.actornation = [];
    eventFilters.actortype = [];

    eventFilters.eventlocation = [];
    eventFilters.platforms = [];

    return {
      eventFilters,
      keywords: keyword?.trim() || "",
      fromDate: customFrom || "",
      toDate: customTo || "",
      lastdocid: lastDocIdParam, // Use provided lastdocid for pagination
      page: "events",
      req_id: "",
      size: pageSize,
    };
  }, [selectedCategories, customFrom, customTo, selectedCountries, keyword, pageSize]);

  const parseEventData = useCallback((records) => {
    if (!records || !Array.isArray(records)) return [];

    // Flatten the records array - convert object with numeric keys to array
//    const flattenedRecords = records.flatMap(recordObj => {
//      // Convert object with numeric keys (0, 1, 2...) to array
//      return Object.values(recordObj);
//    });
    console.log("check rcd:", records);
    return records.map((item) => {
      if (!item) return null;

      // Parse new response structure
      const eventCategory = item.eventCategory?.label || 'Other';
      const eventCountry = item.eventCountry?.[0]?.country?.label || '';
      const eventLocation = item.eventLocation || {};
      const lat = Number(eventLocation.lat ?? NaN);
      const lon = Number(eventLocation.long ?? NaN);
      const latLon = `${lat}, ${lon}`;
      const _uid = item.id || `evt_${Math.random().toString(36).slice(2)}`;

      return {
        id: _uid,
        title: item.title || 'Event',
        description: item.summary || '',
        start_date: item.lastModifiedDate,
        end_date: item.lastModifiedDate,
        country: eventCountry,
        properties: {
          ...item,
          location:latLon,
          country: eventCountry,
          _uid,
          event_category: eventCategory,
          lastModifiedDate: item.lastModifiedDate, // Explicitly include for TimeSlider
          start_date: item.lastModifiedDate, // Include for backwards compatibility
        },
        labels: item.labels || [],
        latitude: isNaN(lat) ? null : lat,
        longitude: isNaN(lon) ? null : lon,
        event_category: eventCategory,
      };
    }).filter(Boolean);
  }, []);

  // Initial search - resets pagination
  const handleSubmit = useCallback(async () => {
    // Clear events immediately to show loading indicator on subsequent searches
    setEvents([]);
    setIsLoading(true);
    setLastDocId(''); // Clear lastDocId on fresh search

    try {
      setPage(0);
      setHasMore(true);

      // Use dummy data if flag is enabled
      if (DUMMY_DATA) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        const parsed = parseEventData(DUMMY_RECORDS);
        setEvents(parsed);
        setHasMore(false); // No more pages for dummy data
        setPage(1);
      } else {
        // Use real API - pass empty string for fresh search
        const payload = buildPayload('');
        const resp = await fetchEventsData(payload);
        console.log("its:",resp.records);
        const parsed = parseEventData(resp.records);
        console.log("records", parsed);
        // Extract and store totalHits from response
        if (resp.totalHits !== undefined && resp.totalHits !== null) {
          setTotalHits(resp.totalHits);
          console.log('Total hits available:', resp.totalHits);
        }

        // Extract and store lastdocid from response for next page
        if (resp.lastDocId) {
          setLastDocId(resp.lastDocId);
          console.log('Stored lastdocid for pagination:', resp.lastdocid);
        }

        setEvents(parsed);
        // Check hasMore: if we got less than pageSize records, there are no more pages
        setHasMore(parsed.length >= pageSize);
        setPage(1);

        console.log(`Loaded ${parsed.length} events out of ${resp.totalHits || 0} total`);
      }

      setTimeout(() => {
        if (timelineContainerRef.current) timelineContainerRef.current.scrollTop = 0;
      }, 50);
    } catch (err) {
      console.error('Failed to fetch events:', err);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }, [buildPayload, parseEventData, pageSize]);

  // Load more events - appends to existing
  const handleLoadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      // Use stored lastDocId for pagination
      console.log('Loading more with lastdocid:', lastDocId);
      const payload = buildPayload(lastDocId);
      const resp = await fetchEventsData(payload);
      const parsed = parseEventData(resp.records);

      if (parsed.length > 0) {
        setEvents(prev => [...prev, ...parsed]);

        // Update lastDocId with the new value from response
        if (resp.lastDocId) {
          setLastDocId(resp.lastDocId);
          console.log('Updated lastdocid for next page:', resp.lastdocid);
        }

        setHasMore(resp.records.length === pageSize);
        setPage(prev => prev + 1);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error('Failed to load more events:', err);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }, [buildPayload, lastDocId, parseEventData, pageSize, isLoading, hasMore]);

  // initial load
  useEffect(() => {
    handleSubmit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTimelineSelect = (evt) => {
    if (!mapApiRef.current) return;
    const api = mapApiRef.current;
    const layer = api.eventsLayer;
    const graphicsCollection = layer && layer.graphics ? (Array.isArray(layer.graphics) ? layer.graphics : layer.graphics.items) : [];
    const found = graphicsCollection
      ? graphicsCollection.find((g) => {
          const a = g.attributes || {};
          return a._uid === evt.properties._uid || a.id === evt.id || a.label === evt.title;
        })
      : null;

    if (found) {
      api.zoomToGraphic(found);
    } else {
      const categoryConfig = getCategoryConfig(evt.event_category);
      const g = api.addEventGraphic({
        longitude: evt.longitude,
        latitude: evt.latitude,
        properties: evt.properties,
        eventCategory: evt.event_category,
        categoryColor: categoryConfig.color,
        categoryIcon: categoryConfig.icon
      });
      api.zoomToGraphic(g);
    }
  };

  const groups = useMemo(() => groupByDate(events), [events]);

  // Animation control functions
  const startAnimation = useCallback(() => {
    if (events.length === 0) return;

    // Determine the actual start and end indices
    const startIdx = Math.max(0, Math.min(animationStartIndex, events.length - 1));
    const endIdx = animationEndIndex === -1 ? events.length - 1 : Math.min(animationEndIndex, events.length - 1);

    // Validate range
    if (startIdx > endIdx) return;

    setIsAnimating(true);
    setCurrentAnimationIndex(startIdx);

    let index = startIdx;
    animationIntervalRef.current = setInterval(() => {
      if (index > endIdx) {
        // Loop back to start of range
        index = startIdx;
      }

      setCurrentAnimationIndex(index);
      handleTimelineSelect(events[index]);

      // Scroll to the event card
      if (timelineContainerRef.current) {
        const cardElement = document.getElementById(`event-card-${events[index].id}`);
        if (cardElement) {
          cardElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }

      index++;
    }, animationSpeed); // Use dynamic animation speed
  }, [events, animationStartIndex, animationEndIndex, animationSpeed]);

  const stopAnimation = useCallback(() => {
    setIsAnimating(false);
    setCurrentAnimationIndex(-1);
    if (animationIntervalRef.current) {
      clearInterval(animationIntervalRef.current);
      animationIntervalRef.current = null;
    }
  }, []);

  const toggleAnimation = useCallback(() => {
    if (isAnimating) {
      stopAnimation();
    } else {
      startAnimation();
    }
  }, [isAnimating, startAnimation, stopAnimation]);

  // Cleanup animation on unmount or when events change
  useEffect(() => {
    return () => {
      if (animationIntervalRef.current) {
        clearInterval(animationIntervalRef.current);
      }
    };
  }, []);

  // Stop animation and reset range when events change
  useEffect(() => {
    stopAnimation();
    setAnimationStartIndex(0);
    setAnimationEndIndex(-1);
  }, [events, stopAnimation]);

  // Reset animation range helper
  const resetAnimationRange = useCallback(() => {
    setAnimationStartIndex(0);
    setAnimationEndIndex(-1);
  }, []);

  return (
    <Grid container spacing={2} sx={{ height: '100%', bgcolor: c('#ffffff', darkBg), color: c('#000000', darkTextPri) }}>
      {/* Filters */}
      <Grid item xs={12}>
        <Paper sx={{ p: 2, bgcolor: c('#fff', darkSurface) }} elevation={1}>
          <Typography variant="h6" sx={{ color: c('#000', darkTextPri) }}>Filters</Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 1, flexWrap: 'wrap' }}>
            <Autocomplete
              multiple
              options={countries}
              value={selectedCountries}
              onChange={(e, v) => setSelectedCountries(v)}
              renderTags={(value, getTagProps) => value.map((option, index) => <Chip key={option} label={option} {...getTagProps({ index })} />)}
              sx={{ minWidth: 240 }}
              renderInput={(params) => <TextField {...params} label="Country" />}
            />

            <Autocomplete
              multiple
              options={categories}
              value={selectedCategories}
              onChange={(e, v) => setSelectedCategories(v)}
              renderTags={(value, getTagProps) => value.map((option, index) => {
                const config = getCategoryConfig(option);
                return (
                  <Chip
                    key={option}
                    label={`${config.icon} ${config.name}`}
                    {...getTagProps({ index })}
                    sx={{
                      bgcolor: `${config.color}15`,
                      color: config.color,
                      fontWeight: 600,
                      border: `1px solid ${config.color}40`
                    }}
                  />
                );
              })}
              sx={{ minWidth: 300 }}
              renderInput={(params) => <TextField {...params} label="Event Category" />}
              renderOption={(props, option) => {
                const config = getCategoryConfig(option);
                return (
                  <Box component="li" {...props} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <span style={{ fontSize: 20 }}>{config.icon}</span>
                    <Typography sx={{ color: config.color, fontWeight: 600 }}>
                      {config.name}
                    </Typography>
                  </Box>
                );
              }}
            />

            <TextField
              label="Keyword"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Enter keyword..."
              sx={{ minWidth: 200 }}
              size="small"
            />

            <TextField select label="Date Filter" value={dateFilter}  sx={{ minWidth:140 }} onChange={(e) => setDateFilter(e.target.value)}>
                          <MenuItem value="today">Today</MenuItem>
                          <MenuItem value="2days">2 Days</MenuItem>
                          <MenuItem value="3days">3 Days</MenuItem>
                          <MenuItem value="7days">7 Days</MenuItem>
                          <MenuItem value="30days">30 Days</MenuItem>
                          <MenuItem value="90days">90 Days</MenuItem>
                          <MenuItem value="custom">Custom</MenuItem>
                        </TextField>

                        {dateFilter === 'custom' && (
                          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                            <TextField label="From" type="date" value={customFrom} onChange={(e) => setCustomFrom(e.target.value)} InputLabelProps={{ shrink: true }} />
                            <TextField label="To" type="date" value={customTo} onChange={(e) => setCustomTo(e.target.value)} InputLabelProps={{ shrink: true }} />
                          </Box>
                        )}
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={isLoading}
              sx={{
                bgcolor: ACCENT,
                '&:hover': {
                  bgcolor: c('#e67e00', '#cc7000'),
                },
                '&:disabled': {
                  bgcolor: c('#ccc', darkBorderLt),
                  color: c('#999', darkTextDis),
                }
              }}
              startIcon={isLoading && events.length === 0 ? <CircularProgress size={20} color="inherit" /> : null}
            >
              {isLoading && events.length === 0 ? 'Searching...' : 'Search'}
            </Button>
          </Box>
        </Paper>
      </Grid>

      {/* Map */}
      <Grid item xs={12} md={7} sx={{ height: 'calc(100% - 120px)' }}>
        <Paper sx={{ height: '100%', p: 1, bgcolor: c('#fff', darkSurface) }} elevation={1}>
          <MapTemplate onMapReady={handleMapReady} />
        </Paper>
      </Grid>

      {/* Timeline */}
      <Grid item xs={12} md={5} sx={{ height: 'calc(100% - 120px)' }}>
        <Paper sx={{ height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column', bgcolor: c('#fff', darkSurface) }} elevation={1}>
          {/* Sticky Header with Controls */}
          <Box sx={{
            position: 'sticky',
            top: 0,
            bgcolor: c('#fff', darkSurface),
            zIndex: 10,
            p: 2,
            borderBottom: c('1px solid #e0e0e0', `1px solid ${darkBorder}`),
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6" sx={{ color: c('#000', darkTextPri), fontWeight: 600 }}>
                Event Timeline
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Button
                  variant="contained"
                  size="small"
                  onClick={toggleAnimation}
                  disabled={events.length === 0}
                  sx={{
                    bgcolor: c(isAnimating ? '#d32f2f' : '#1976d2', isAnimating ? '#b71c1c' : '#1565c0'),
                    minWidth: 56,
                    height: 28,
                    px:1,
                    py:0.25,
                    fontSize:12,
                    lineHeight:1.1,
                    '&:hover': {
                      bgcolor: c(isAnimating ? '#b71c1c' : '#1565c0', isAnimating ? '#d32f2f' : '#1976d2'),
                    },
                    '&:disabled': {
                      bgcolor: c('#ccc', darkBorderLt),
                      color: c('#999', darkTextDis),
                    }
                  }}
                >
                  {isAnimating ? '⏸ Pause' : '▶ Play'}
                </Button>
                <IconButton
                  size="small"
                  onClick={() => setShowAnimationControls(!showAnimationControls)}
                  disabled={events.length === 0}
                  sx={{
                    bgcolor: showAnimationControls ? c('#f5f5f5', darkSurfaceHov) : 'transparent',
                    '&:hover': {
                      bgcolor: c('#f5f5f5', darkSurfaceHov),
                    },
                    '&:disabled': {
                      bgcolor: 'transparent',
                      color: c('#ccc', darkBorderLt),
                    }
                  }}
                >
                  <SettingsIcon fontSize="small" sx={{ color: showAnimationControls ? ACCENT : c('#666', darkTextMut) }} />
                </IconButton>
                <Chip
                  label={`${events.length} events out of ${totalHits}`}
                  size="small"
                  sx={{ bgcolor: ACCENT, color: c('#fff', darkTextPri), fontWeight: 600 }}
                />
              </Box>
            </Box>

          {/* Animation Controls - Collapsible */}
          {events.length > 0 && (
            <Collapse in={showAnimationControls}>
              <Box sx={{ p: 2, bgcolor: c('#f9f9f9', darkSurfaceHov), borderRadius: 2, mb: 2 }}>
                {/* Animation Speed Control */}
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
                  <Typography variant="caption" sx={{ color: c('#666', darkTextMut), fontWeight: 600, minWidth: 80 }}>
                    Speed:
                  </Typography>
                  <Slider
                    value={animationSpeed}
                    onChange={(e, val) => setAnimationSpeed(val)}
                    min={1000}
                    max={5000}
                    step={500}
                    marks={[
                      { value: 1000, label: '1s' },
                      { value: 2000, label: '2s' },
                      { value: 3000, label: '3s' },
                      { value: 5000, label: '5s' },
                    ]}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => `${value / 1000}s`}
                    disabled={isAnimating}
                    sx={{
                      flex: 1,
                      maxWidth: 300,
                      '& .MuiSlider-markLabel': {
                        fontSize: 10,
                        color: c('#999', darkTextDis),
                      },
                      '& .MuiSlider-thumb': {
                        bgcolor: ACCENT,
                      },
                      '& .MuiSlider-track': {
                        bgcolor: ACCENT,
                      },
                      '& .MuiSlider-rail': {
                        bgcolor: c('#ddd', darkBorder),
                      },
                    }}
                  />
                  <Typography variant="caption" sx={{ color: c('#999', darkTextDis), minWidth: 40, fontSize: 11 }}>
                    {animationSpeed / 1000}s/card
                  </Typography>
                </Box>

                {/* Animation Range Controls */}
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                  <Typography variant="caption" sx={{ color: c('#666', darkTextMut), fontWeight: 600, minWidth: 80 }}>
                    Animation Range:
                  </Typography>
                  <TextField
                    label="Start"
                    type="number"
                    size="small"
                    value={animationStartIndex + 1}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) - 1;
                      if (!isNaN(val) && val >= 0 && val < events.length) {
                        setAnimationStartIndex(val);
                      }
                    }}
                    InputProps={{
                      inputProps: { min: 1, max: events.length }
                    }}
                    sx={{ width: 80 }}
                  />
                  <Typography variant="caption" sx={{ color: c('#999', darkTextDis) }}>to</Typography>
                  <TextField
                    label="End"
                    type="number"
                    size="small"
                    value={animationEndIndex === -1 ? events.length : animationEndIndex + 1}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) - 1;
                      if (!isNaN(val) && val >= 0 && val < events.length) {
                        setAnimationEndIndex(val);
                      }
                    }}
                    InputProps={{
                      inputProps: { min: 1, max: events.length }
                    }}
                    sx={{ width: 80 }}
                  />
                  <Typography variant="caption" sx={{ color: c('#999', darkTextDis), fontSize: 10 }}>
                    (of {events.length})
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={resetAnimationRange}
                    sx={{
                      fontSize: 10,
                      minWidth: 60,
                      height: 28,
                      borderColor: c('#ccc', darkBorderLt),
                      color: c('#666', darkTextMut),
                      '&:hover': {
                        borderColor: c('#999', darkTextDis),
                        bgcolor: c('#fff', darkSurface),
                      }
                    }}
                  >
                    Reset
                  </Button>
                </Box>
              </Box>
            </Collapse>
          )}
          </Box>

          {/* Scrollable Timeline Content */}
          <Box sx={{ flex: 1, overflowY: 'auto', px: 2, position: 'relative', bgcolor: c('transparent', darkBg) }} ref={timelineContainerRef}>
            {/* Loading Overlay - Shows during initial data fetch */}
            {isLoading && events.length === 0 && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: c('rgba(255, 255, 255, 0.95)', darkOverlay),
                  zIndex: 10,
                  backdropFilter: 'blur(4px)',
                }}
              >
                <CircularProgress
                  size={60}
                  thickness={4}
                  sx={{
                    color: ACCENT,
                    mb: 2,
                    '& .MuiCircularProgress-circle': {
                      strokeLinecap: 'round',
                    }
                  }}
                />
                <Typography
                  variant="h6"
                  sx={{
                    color: c('#666', darkTextMut),
                    fontWeight: 600,
                    mb: 1,
                  }}
                >
                  Loading Events...
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: c('#999', darkTextDis),
                    fontStyle: 'italic',
                  }}
                >
                  Fetching data from the server
                </Typography>
              </Box>
            )}

            {groups.length > 0 ? (
              <Box sx={{ position: 'relative', pl: '30px' }}>
                {/* Vertical Line Connecting Dots on Left */}
                <Box
                  sx={{
                    position: 'absolute',
                    left: '8px',
                    top: 0,
                    bottom: 0,
                    width: '3px',
                    background: 'linear-gradient(180deg, #A52A2A 0%, #ffa726 25%, #ec407a 45%, #1976d2 65%, #66bb6a 85%, #ffca28 100%)',
                    borderRadius: '2px',
                    opacity: 0.4,
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: -6,
                      left: '50%',
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      bgcolor: '#A52A2A',
                      transform: 'translateX(-50%)',
                      boxShadow: '0 0 8px rgba(165, 42, 42, 0.6)',
                    }
                  }}
                />

                {/* Events Flow */}
                {groups.map((g, groupIndex) => (
                  <Box key={groupIndex} sx={{ mb: 2 }}>
                    {/* Events - All on Right Side */}
                    {g.items.map((ev, itemIndex) => {
                      const categoryConfig = getCategoryConfig(ev.event_category);
                      const categoryColor = categoryConfig.color;
                      const categoryIcon = categoryConfig.icon;
                      const eventIndex = events.findIndex(e => e.id === ev.id);
                      const isActiveAnimation = isAnimating && currentAnimationIndex === eventIndex;
                      const isStartCard = eventIndex === animationStartIndex;
                      const isEndCard = eventIndex === (animationEndIndex === -1 ? events.length - 1 : animationEndIndex);

                      return (
                        <Box
                          key={ev.id}
                          id={`event-card-${ev.id}`}
                          sx={{
                            position: 'relative',
                            display: 'flex',
                            alignItems: 'center',
                            mb: 1.5,
                            pl: '10px',
                          }}
                        >
                          {/* Connector Line from Dot to Card */}
                          <Box
                            sx={{
                              position: 'absolute',
                              top: '20px',
                              left: '-22px',
                              width: '32px',
                              height: '2px',
                              bgcolor: categoryColor,
                              opacity: 0.5,
                              zIndex: 1,
                            }}
                          />

                          {/* Clickable Dot on Line - Triggers Map Highlight */}
                          <Box
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTimelineSelect(ev);
                            }}
                            sx={{
                              position: 'absolute',
                              left: '-30px',
                              top: '12px',
                              width: '18px',
                              height: '18px',
                              borderRadius: '50%',
                              bgcolor: categoryColor,
                              border: '3px solid #fff',
                              boxShadow: `0 0 0 2px ${categoryColor}50`,
                              zIndex: 2,
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: 8,
                              '&:hover': {
                                transform: 'scale(1.3)',
                                boxShadow: `0 0 0 4px ${categoryColor}50, 0 0 12px ${categoryColor}`,
                                zIndex: 5,
                                '& .dot-tooltip': {
                                  opacity: 1,
                                }
                              },
                              '&:active': {
                                transform: 'scale(1.1)',
                              },
                            }}
                          >
                            {/* Tooltip on hover */}
                            <Box
                              className="dot-tooltip"
                              sx={{
                                position: 'absolute',
                                left: '100%',
                                top: '50%',
                                transform: 'translate(8px, -50%)',
                                bgcolor: categoryColor,
                                color: '#fff',
                                px: 1,
                                py: 0.5,
                                borderRadius: 1,
                                fontSize: 10,
                                fontWeight: 600,
                                whiteSpace: 'nowrap',
                                opacity: 0,
                                pointerEvents: 'none',
                                transition: 'opacity 0.2s',
                                '&::before': {
                                  content: '""',
                                  position: 'absolute',
                                  right: '100%',
                                  top: '50%',
                                  transform: 'translateY(-50%)',
                                  width: 0,
                                  height: 0,
                                  borderTop: '4px solid transparent',
                                  borderBottom: '4px solid transparent',
                                  borderRight: `4px solid ${categoryColor}`,
                                },
                              }}
                            >
                              Click to view on map
                            </Box>
                          </Box>

                          {/* Event Card */}
                          <Paper
                            onClick={() => handleTimelineSelect(ev)}
                            sx={{
                              flex: 1,
                              p: 2,
                              bgcolor: isActiveAnimation ? c(`${categoryColor}08`, `${categoryColor}15`) : c('#fff', darkSurface),
                              border: isActiveAnimation ? c(`3px solid ${categoryColor}`, `3px solid ${categoryColor}`) : c(`2px solid ${categoryColor}30`, `2px solid ${categoryColor}40`),
                              borderRadius: 2,
                              position: 'relative',
                              cursor: 'pointer',
                              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                              boxShadow: isActiveAnimation ? `0 12px 32px ${categoryColor}60, 0 0 0 4px ${categoryColor}20` : undefined,
                              transform: isActiveAnimation ? 'scale(1.03)' : undefined,
                              zIndex: isActiveAnimation ? 5 : undefined,
                              '&:hover': {
                                boxShadow: `0 8px 24px ${categoryColor}40`,
                                transform: 'translateX(4px)',
                                borderColor: categoryColor,
                                zIndex: 3,
                              },
                              '&:active': {
                                transform: 'translateX(2px) scale(0.98)',
                              },
                              '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: '20px',
                                left: '-12px',
                                width: 0,
                                height: 0,
                                borderTop: '8px solid transparent',
                                borderBottom: '8px solid transparent',
                                borderRight: `12px solid ${categoryColor}`,
                                opacity: isActiveAnimation ? 1 : 0.8,
                              }
                            }}
                            elevation={isActiveAnimation ? 8 : 2}
                          >
                            {/* Start/End Range Indicators */}
                            {(isStartCard || isEndCard) && (
                              <Box
                                sx={{
                                  position: 'absolute',
                                  top: -8,
                                  right: 8,
                                  bgcolor: isStartCard ? '#4caf50' : '#ff9800',
                                  color: '#fff',
                                  px: 1.5,
                                  py: 0.3,
                                  borderRadius: 1,
                                  fontSize: 9,
                                  fontWeight: 800,
                                  letterSpacing: '0.5px',
                                  boxShadow: `0 2px 8px ${isStartCard ? '#4caf5080' : '#ff980080'}`,
                                  zIndex: 10,
                                }}
                              >
                                {isStartCard ? '⏵ START' : '⏹ END'}
                              </Box>
                            )}

                            {/* Enhanced Date Badge - Inside card at top - Uniform color for all events */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                              <Box
                                sx={{
                                  background: `linear-gradient(135deg, #5c6bc0 0%, #5c6bc0dd 100%)`,
                                  px: 2,
                                  py: 0.8,
                                  borderRadius: 2,
                                  minWidth: '140px',
                                  boxShadow: `0 2px 8px rgba(92, 107, 192, 0.4)`,
                                  border: `1px solid rgba(92, 107, 192, 0.3)`,
                                }}
                              >
                                <Typography sx={{ fontSize: 11, fontWeight: 700, color: '#fff', textAlign: 'center', letterSpacing: '0.5px' }}>
                                  📅 {ev.start_date ? formatDate(ev.start_date) : 'Unknown Date'}
                                </Typography>
                              </Box>
                            </Box>

                            {/* All Chips in One Line */}
                            <Box sx={{ display: 'flex', gap: 0.5, mb: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                              {/* Category Chip with Icon - Matches map point plot color */}
                              <Chip
                                icon={<span style={{ fontSize: 14 }}>{categoryIcon}</span>}
                                label={categoryConfig.name}
                                size="small"
                                sx={{
                                  bgcolor: categoryColor,
                                  color: '#ffffff',
                                  fontWeight: 700,
                                  fontSize: 10,
                                  height: 24,
                                  border: 'none',
                                  boxShadow: `0 2px 4px ${categoryColor}40`,
                                  '& .MuiChip-icon': {
                                    marginLeft: '4px',
                                    fontSize: 14,
                                    color: '#ffffff'
                                  }
                                }}
                              />

                              {/* Label Chips */}
                              {ev.labels && ev.labels.length > 0 && ev.labels.slice(0, 2).map((label, idx) => (
                                <Chip
                                  key={idx}
                                  label={label}
                                  size="small"
                                  sx={{
                                    height: 20,
                                    fontSize: 9,
                                    bgcolor: c('#e8e8e8', darkChipBg),
                                    color: c('#555', darkTextSec),
                                    fontWeight: 500,
                                    '& .MuiChip-label': { px: 0.8 }
                                  }}
                                />
                              ))}
                              {ev.labels && ev.labels.length > 2 && (
                                <Chip
                                  label={`+${ev.labels.length - 2}`}
                                  size="small"
                                  sx={{
                                    height: 20,
                                    fontSize: 9,
                                    bgcolor: c('#e8e8e8', darkChipBg),
                                    color: c('#555', darkTextSec),
                                    fontWeight: 500,
                                    '& .MuiChip-label': { px: 0.8 }
                                  }}
                                />
                              )}
                            </Box>

                            {/* Title */}
                            <Typography
                              sx={{
                                fontWeight: 700,
                                fontSize: 14,
                                color: c('#1a1a1a', darkTextPri),
                                mb: 0.5,
                                lineHeight: 1.3,
                              }}
                            >
                              {ev.title}
                            </Typography>

                            {/* Location */}
                            <Typography variant="caption" sx={{ color: c('#666', darkTextMut), display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                              <span style={{ fontSize: 11 }}>📍</span>
                              {ev.country}
                            </Typography>

                            {/* Description */}
                            <Typography
                              variant="body2"
                              sx={{
                                color: c('#555', darkTextSec),
                                lineHeight: 1.4,
                                fontSize: 12,
                              }}
                            >
                              {ev.description?.slice(0, 120)}
                              {ev.description && ev.description.length > 120 ? '...' : ''}
                            </Typography>
                          </Paper>
                        </Box>
                      );
                    })}
                  </Box>
                ))}

                {/* Load More Button */}
                {hasMore && (
                  <Box sx={{ textAlign: 'center', py: 3 }}>
                    <Button
                      variant="contained"
                      onClick={handleLoadMore}
                      disabled={isLoading}
                      sx={{
                        bgcolor: ACCENT,
                        px: 4,
                        py: 1.5,
                        fontWeight: 600,
                        fontSize: 14,
                        '&:hover': {
                          bgcolor: c('#e67e00', '#cc7000'),
                        },
                        '&:disabled': {
                          bgcolor: c('#ccc', darkBorderLt),
                        }
                      }}
                      startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
                    >
                      {isLoading ? 'Loading...' : `Load More Events (${pageSize} per page)`}
                    </Button>
                  </Box>
                )}

                {/* End Marker */}
                {!hasMore && (
                  <Box sx={{ textAlign: 'center', py: 3 }}>
                    <Box
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 1,
                        px: 2,
                        py: 1,
                        borderRadius: 2,
                        bgcolor: c('#f5f5f5', darkSurface),
                        border: c('2px dashed #ccc', `2px dashed ${darkBorderLt}`),
                      }}
                    >
                      <Typography variant="caption" sx={{ color: c('#999', darkTextDis), fontWeight: 600 }}>
                        No more events to load
                      </Typography>
                    </Box>
                  </Box>
                )}
              </Box>
            ) : (
              <Paper sx={{ p: 3, bgcolor: c('#f9f9f9', darkSurface), border: c('1px solid #e0e0e0', `1px solid ${darkBorder}`), textAlign: 'center' }}>
                <Typography sx={{ color: c('#666', darkTextMut), fontStyle: 'italic' }}>
                  No events to display. Use filters and click Search to load events.
                </Typography>
              </Paper>
            )}
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
}