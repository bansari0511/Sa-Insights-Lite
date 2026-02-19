/* src/pages/MapEventsPage.jsx */
import React, { useCallback, useState, useEffect, useRef, useMemo } from 'react';
import {
  Grid,
  Paper,
  Box,
  Button,
  TextField,
  Chip,
  Typography,
  Divider,
  CircularProgress,
  Slider,
  IconButton,
  Collapse,
} from '@mui/material';
import { Settings as SettingsIcon } from '@mui/icons-material';
import EventFilterBar from '../../components/shared/EventFilterBar';
import MapTemplate from './mapTemplate';
import { fetchEventsData } from './EventTimeLineApi';
import countryData from "../../country.json";
import { mapTheme, eventCategories } from '../../theme';
import { SHOW_INSIGHTS_SIDEBAR } from '../../config/appMode';

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

export default function MapEventsPage() {
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

  const buildPayload = useCallback((pageNum = 0) => {
  const filters = {};
  if(selectedCategories?.length > 0 )
  {
   filters.event_category = selectedCategories.map((c) => ({ label: c }));
  }
  if(selectedCountries?.length >0) {
  filters.country_of_sovereignty = selectedCountries.map((c) => ({ label: c }));
  }
  if(customFrom && customTo)
  {
  filters.date_filter = { start_date: customFrom, end_date: customTo };
  }
    return {
      req_id: 'req_id',
      user_id: 'Test',
      filters,
      keyword: keyword?.trim() || null,  // Pass keyword to API, default null
      page_identifier: pageNum,
      size: pageSize,
    };
  }, [selectedCategories, customFrom, customTo, selectedCountries, keyword, pageSize]);

  const parseEventData = useCallback((items) => {
    return (items || []).map((item) => {
      const p = (item && item.e && item.e.properties) || {};
      const labels = (item && item.e && item.e.labels) || [];
      const lat = Number(p.latitude ?? p.event_location_lat ?? NaN);
      const lon = Number(p.longitude ?? p.event_location_long ?? NaN);
      p._uid = p._uid || `evt_${Math.random().toString(36).slice(2)}`;
      return {
        id: p.id || p._uid,
        title: p.label || p.name || 'Event',
        description: p.description || '',
        start_date: p.start_date,
        end_date: p.end_date,
        country: item['c.label'],
        properties: p,
        labels: labels,
        latitude: isNaN(lat) ? null : lat,
        longitude: isNaN(lon) ? null : lon,
        event_category: p.event_category || 'Other',
      };
    });
  }, []);

  // Initial search - resets pagination
  const handleSubmit = useCallback(async () => {
    // Clear events immediately to show loading indicator on subsequent searches
    setEvents([]);
    setIsLoading(true);
    try {
      setPage(0);
      setHasMore(true);
      const payload = buildPayload(0);
      const resp = await fetchEventsData(payload);
      const parsed = parseEventData(resp.result);

      setEvents(parsed);
      setHasMore(parsed.length >= pageSize);
      setPage(1);

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
      const payload = buildPayload(page);
      const resp = await fetchEventsData(payload);
      const parsed = parseEventData(resp.result);

      if (parsed.length > 0) {
        setEvents(prev => [...prev, ...parsed]);
        setHasMore(parsed.length >= pageSize);
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
  }, [buildPayload, page, parseEventData, pageSize, isLoading, hasMore]);

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
    <Grid container spacing={2} sx={{ height: '100%', bgcolor: '#ffffff', color: '#000000' }}>
      {/* Filters */}
      <Grid item xs={12}>
        <EventFilterBar
          countries={countries}
          selectedCountries={selectedCountries}
          setSelectedCountries={setSelectedCountries}
          categories={categories}
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
          getCategoryConfig={getCategoryConfig}
          keyword={keyword}
          setKeyword={setKeyword}
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
          customFrom={customFrom}
          setCustomFrom={setCustomFrom}
          customTo={customTo}
          setCustomTo={setCustomTo}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          hasResults={events.length > 0}
        />
      </Grid>

      {/* Map - Full width when sidebar is hidden */}
      <Grid item xs={12} md={SHOW_INSIGHTS_SIDEBAR ? 7 : 12} sx={{ height: 'calc(100% - 120px)' }}>
        <Paper sx={{ height: '100%', p: 1 }} elevation={1}>
          <MapTemplate onMapReady={handleMapReady} />
        </Paper>
      </Grid>

      {/* Timeline - Conditionally rendered based on SHOW_INSIGHTS_SIDEBAR flag */}
      {SHOW_INSIGHTS_SIDEBAR && <Grid item xs={12} md={5} sx={{ height: 'calc(100% - 120px)' }}>
        <Paper sx={{ height: '100%', overflow: 'hidden', p: 2 }} elevation={1}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" sx={{ color: '#000', fontWeight: 600 }}>
              Event Timeline
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Button
                variant="contained"
                size="small"
                onClick={toggleAnimation}
                disabled={events.length === 0}
                sx={{
                  bgcolor: isAnimating ? '#d32f2f' : '#1976d2',
                  minWidth: 90,
                  '&:hover': {
                    bgcolor: isAnimating ? '#b71c1c' : '#1565c0',
                  },
                  '&:disabled': {
                    bgcolor: '#ccc',
                    color: '#999',
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
                  bgcolor: showAnimationControls ? '#f5f5f5' : 'transparent',
                  '&:hover': {
                    bgcolor: '#f5f5f5',
                  },
                  '&:disabled': {
                    bgcolor: 'transparent',
                    color: '#ccc',
                  }
                }}
              >
                <SettingsIcon fontSize="small" sx={{ color: showAnimationControls ? ACCENT : '#666' }} />
              </IconButton>
              <Chip
                label={`${events.length} events`}
                size="small"
                sx={{ bgcolor: ACCENT, color: '#fff', fontWeight: 600 }}
              />
            </Box>
          </Box>

          {/* Animation Controls - Collapsible */}
          {events.length > 0 && (
            <Collapse in={showAnimationControls}>
              <Box sx={{ p: 2, bgcolor: '#f9f9f9', borderRadius: 2, mb: 2 }}>
                {/* Animation Speed Control */}
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
                  <Typography variant="caption" sx={{ color: '#666', fontWeight: 600, minWidth: 80 }}>
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
                        color: '#999',
                      },
                      '& .MuiSlider-thumb': {
                        bgcolor: ACCENT,
                      },
                      '& .MuiSlider-track': {
                        bgcolor: ACCENT,
                      },
                      '& .MuiSlider-rail': {
                        bgcolor: '#ddd',
                      },
                    }}
                  />
                  <Typography variant="caption" sx={{ color: '#999', minWidth: 40, fontSize: 11 }}>
                    {animationSpeed / 1000}s/card
                  </Typography>
                </Box>

                {/* Animation Range Controls */}
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                  <Typography variant="caption" sx={{ color: '#666', fontWeight: 600, minWidth: 80 }}>
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
                  <Typography variant="caption" sx={{ color: '#999' }}>to</Typography>
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
                  <Typography variant="caption" sx={{ color: '#999', fontSize: 10 }}>
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
                      borderColor: '#ccc',
                      color: '#666',
                      '&:hover': {
                        borderColor: '#999',
                        bgcolor: '#fff',
                      }
                    }}
                  >
                    Reset
                  </Button>
                </Box>
              </Box>
            </Collapse>
          )}

          <Divider sx={{ mb: 2 }} />

          <Box sx={{ height: 'calc(100% - 120px)', overflowY: 'auto', px: 2, position: 'relative' }} ref={timelineContainerRef}>
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
                  bgcolor: 'rgba(255, 255, 255, 0.95)',
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
                    color: '#666',
                    fontWeight: 600,
                    mb: 1,
                  }}
                >
                  Loading Events...
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: '#999',
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
                              bgcolor: isActiveAnimation ? `${categoryColor}08` : '#fff',
                              border: isActiveAnimation ? `3px solid ${categoryColor}` : `2px solid ${categoryColor}30`,
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
                                    bgcolor: '#e8e8e8',
                                    color: '#555',
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
                                    bgcolor: '#e8e8e8',
                                    color: '#555',
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
                                color: '#1a1a1a',
                                mb: 0.5,
                                lineHeight: 1.3,
                              }}
                            >
                              {ev.title}
                            </Typography>

                            {/* Location */}
                            <Typography variant="caption" sx={{ color: '#666', display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                              <span style={{ fontSize: 11 }}>📍</span>
                              {ev.country}
                            </Typography>

                            {/* Description */}
                            <Typography
                              variant="body2"
                              sx={{
                                color: '#555',
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
                          bgcolor: '#e67e00',
                        },
                        '&:disabled': {
                          bgcolor: '#ccc',
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
                        bgcolor: '#f5f5f5',
                        border: '2px dashed #ccc',
                      }}
                    >
                      <Typography variant="caption" sx={{ color: '#999', fontWeight: 600 }}>
                        No more events to load
                      </Typography>
                    </Box>
                  </Box>
                )}
              </Box>
            ) : (
              <Paper sx={{ p: 3, bgcolor: '#f9f9f9', border: '1px solid #e0e0e0', textAlign: 'center' }}>
                <Typography sx={{ color: '#666', fontStyle: 'italic' }}>
                  No events to display. Use filters and click Search to load events.
                </Typography>
              </Paper>
            )}
          </Box>
        </Paper>
      </Grid>}
    </Grid>
  );
}