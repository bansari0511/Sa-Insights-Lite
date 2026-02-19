import React, { useEffect, useState, useMemo } from "react";
import {
  Box, Paper, Typography, Container, Stack, Grid, Chip,
  Skeleton, Button, ToggleButtonGroup, ToggleButton, Tooltip,
  Card, CardMedia, CardContent, alpha, useTheme, TextField,
  IconButton, Drawer, Autocomplete, CircularProgress, Backdrop, Fade,
  Dialog, DialogContent, DialogTitle
} from "@mui/material";
import {
  CalendarMonth as CalendarMonthIcon,
  ViewModule as ViewModuleIcon,
  ViewList as ViewListIcon,
  ClearAll as ClearAllIcon,
  Newspaper as NewspaperIcon,
  EventAvailable as EventAvailableIcon,
  Security as SecurityIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  ArrowBack as ArrowBackIcon,
  Close as CloseIcon,
  Category as CategoryIcon
} from "@mui/icons-material";
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchNewsData, fetchEventsData, fetchCombinedData, fetchIntelligenceData } from '../../services/searchApi';
import ArticleDetailPage from '../newsRoom/ArticleDetailPage';

// Enhanced Filter Dropdown Component with Autocomplete
function FilterDropdown({ label, values, selected, setSelected, color = "primary", loading = false, accentColor }) {
  const theme = useTheme();
  const accent = accentColor || theme.palette.primary.main;

  const handleChange = (event, newValue) => {
    setSelected(newValue);
  };

  return (
    <Autocomplete
      multiple
      disabled={loading}
      size="small"
      options={values || []}
      value={selected.filter(v => values.includes(v))}
      onChange={handleChange}
      limitTags={1}
      disableCloseOnSelect
      getOptionLabel={(option) => {
        if (!option) return '';
        if (typeof option === 'string') return option;
        return option.label || option['c.label'] || String(option);
      }}
      isOptionEqualToValue={(option, value) => {
        const o = typeof option === 'string' ? option : (option.label || option['c.label'] || option.id || '');
        const val = typeof value === 'string' ? value : (value.label || value['c.label'] || value.id || '');
        return o === val;
      }}
      renderTags={(value, getTagProps) =>
        value.map((option, index) => {
          const { key, ...tagProps } = getTagProps({ index });
          const lbl = typeof option === 'string' ? option : (option.label || option['c.label'] || String(option));
          return (
            <Chip
              key={key}
              label={lbl}
              {...tagProps}
              size="small"
              sx={{
                height: 20, fontSize: '0.65rem', fontWeight: 600, borderRadius: '5px',
                bgcolor: alpha(accent, 0.08),
                color: accent,
                border: `1px solid ${alpha(accent, 0.2)}`,
                '& .MuiChip-deleteIcon': {
                  fontSize: 13, color: alpha(accent, 0.5),
                  '&:hover': { color: theme.palette.error.main },
                },
              }}
            />
          );
        })
      }
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder={label}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
              bgcolor: alpha(theme.palette.background.default, 0.5),
              fontSize: '0.82rem',
              transition: 'all 0.2s ease',
              '& fieldset': { borderColor: 'transparent' },
              '&:hover': {
                bgcolor: alpha(theme.palette.background.default, 0.8),
                '& fieldset': { borderColor: alpha(accent, 0.25) },
              },
              '&.Mui-focused': {
                bgcolor: theme.palette.background.paper,
                boxShadow: `0 0 0 2px ${alpha(accent, 0.12)}`,
                '& fieldset': { borderColor: accent, borderWidth: 1.5 },
              }
            },
            '& .MuiInputLabel-root': { fontSize: '0.78rem', fontWeight: 500 },
          }}
        />
      )}
      loading={loading}
      loadingText={<CircularProgress size={16} />}
    />
  );
}

// Section header helper for FilterBar
function FilterSectionHeader({ icon, title, color, theme, count }) {
  return (
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 0.75,
      mb: 1.25,
    }}>
      {React.cloneElement(icon, { sx: { fontSize: 13, color: color || theme.palette.primary.main } })}
      <Typography sx={{
        fontSize: '0.65rem',
        fontWeight: 700,
        color: alpha(theme.palette.text.primary, 0.6),
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        flex: 1,
      }}>
        {title}
      </Typography>
      {count > 0 && (
        <Chip
          label={count}
          size="small"
          sx={{
            height: 18,
            minWidth: 18,
            fontSize: '0.6rem',
            fontWeight: 700,
            bgcolor: alpha(color || theme.palette.primary.main, 0.1),
            color: color || theme.palette.primary.main,
            border: `1px solid ${alpha(color || theme.palette.primary.main, 0.2)}`,
            '& .MuiChip-label': { px: 0.5 },
          }}
        />
      )}
    </Box>
  );
}

// Content type button configs for FilterBar
const contentTypeConfig = [
  {
    value: 'news',
    label: 'News / Insights',
    icon: <NewspaperIcon sx={{ fontSize: '1.1rem' }} />,
    color: '#1976d2',
    bgLight: '#e3f2fd',
    bgGradient: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
  },
  {
    value: 'events',
    label: 'Events',
    icon: <EventAvailableIcon sx={{ fontSize: '1.1rem' }} />,
    color: '#e65100',
    bgLight: '#fff3e0',
    bgGradient: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)',
  },
  {
    value: 'intelligence',
    label: 'Intelligence Briefings',
    icon: <SecurityIcon sx={{ fontSize: '1.1rem' }} />,
    color: '#0d47a1',
    bgLight: '#e3f2fd',
    bgGradient: 'linear-gradient(135deg, #e8eaf6 0%, #c5cae9 100%)',
  },
  {
    value: 'both',
    label: 'All Categories',
    icon: null,
    color: '#7b1fa2',
    bgLight: '#f3e5f5',
    bgGradient: 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)',
  },
];

// Color tokens matching EventFilterBar style
const FC = {
  indigo: { 50: '#EEF2FF', 100: '#E0E7FF', 200: '#C7D2FE', 300: '#A5B4FC', 400: '#818CF8', 500: '#6366F1', 600: '#4F46E5', 700: '#4338CA', 800: '#3730A3' },
  blue:   { 50: '#EFF6FF', 100: '#DBEAFE', 200: '#BFDBFE', 400: '#60A5FA', 500: '#3B82F6', 600: '#2563EB', 700: '#1D4ED8' },
  cyan:   { 50: '#ECFEFF', 100: '#CFFAFE', 400: '#22D3EE', 500: '#06B6D4', 600: '#0891B2' },
  orange: { 50: '#FFF7ED', 100: '#FFEDD5', 400: '#FB923C', 500: '#F97316', 600: '#EA580C' },
  slate:  { 400: '#94A3B8', 500: '#64748B' },
};

// Enhanced Filter Bar Component
function FilterBar({
  mode, filters, setFilters, clearAll,
  options, setMode, dateFrom, setDateFrom, dateTo, setDateTo,
  onCollapse
}) {
  const theme = useTheme();

  const activeFilterCount = Object.values(filters).reduce((sum, arr) => sum + (arr ? arr.length : 0), 0) + (dateFrom ? 1 : 0) + (dateTo ? 1 : 0);
  const newsFilterCount = (filters.country?.length || 0) + (filters.org?.length || 0) + (filters.nsag?.length || 0);
  const eventFilterCount = (filters.eventcountry?.length || 0) + (filters.eventcategory?.length || 0) + (filters.eventlocation?.length || 0) + (filters.platforms?.length || 0) + (filters.actorlabel?.length || 0) + (filters.actornation?.length || 0) + (filters.actortype?.length || 0);

  const dateFieldSx = (accentColor) => ({
    '& .MuiOutlinedInput-root': {
      borderRadius: '8px',
      bgcolor: alpha(theme.palette.background.default, 0.5),
      fontSize: '0.82rem',
      transition: 'all 0.2s ease',
      '& fieldset': { borderColor: 'transparent' },
      '&:hover': {
        bgcolor: alpha(theme.palette.background.default, 0.8),
        '& fieldset': { borderColor: alpha(accentColor, 0.25) },
      },
      '&.Mui-focused': {
        bgcolor: theme.palette.background.paper,
        boxShadow: `0 0 0 2px ${alpha(accentColor, 0.12)}`,
        '& fieldset': { borderColor: accentColor, borderWidth: 1.5 },
      }
    },
    '& .MuiInputLabel-root': { fontSize: '0.78rem', fontWeight: 500 },
    '& input[type="date"]::-webkit-calendar-picker-indicator': {
      cursor: 'pointer', opacity: 0.6,
      transition: 'opacity 0.2s',
      '&:hover': { opacity: 1 }
    },
  });

  // Card wrapper for each filter group
  const FilterCard = ({ children, accentColor }) => (
    <Box sx={{
      borderRadius: '10px',
      border: `1px solid ${alpha(accentColor || FC.indigo[200], 0.18)}`,
      bgcolor: alpha(accentColor || FC.indigo[50], 0.06),
      p: 1.5,
      transition: 'all 0.2s ease',
      '&:hover': {
        bgcolor: alpha(accentColor || FC.indigo[50], 0.12),
        borderColor: alpha(accentColor || FC.indigo[300], 0.25),
      },
    }}>
      {children}
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* ─── Header with collapse toggle ─── */}
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: 2,
        py: 1,
        flexShrink: 0,
        background: `linear-gradient(135deg, ${FC.indigo[50]} 0%, ${FC.blue[50]} 50%, ${FC.cyan[50]} 100%)`,
        borderBottom: `1px solid ${FC.indigo[100]}`,
        position: 'relative',
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: 0, left: 0, right: 0,
          height: '2px',
          background: `linear-gradient(90deg, ${FC.indigo[400]}, ${FC.blue[400]}, ${FC.cyan[400]})`,
          opacity: 0.5,
        },
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: 28, height: 28, borderRadius: '7px',
            background: `linear-gradient(135deg, ${FC.indigo[500]}, ${FC.blue[500]})`,
            boxShadow: `0 2px 8px ${alpha(FC.indigo[500], 0.3)}`,
          }}>
            <FilterListIcon sx={{ fontSize: 14, color: '#fff' }} />
          </Box>
          <Typography sx={{ fontWeight: 700, fontSize: '0.84rem', color: FC.indigo[800], letterSpacing: '-0.01em' }}>
            Filters
          </Typography>
          {activeFilterCount > 0 && (
            <Chip
              label={activeFilterCount}
              size="small"
              sx={{
                height: 18, minWidth: 18,
                bgcolor: FC.indigo[500],
                color: '#fff',
                fontWeight: 700,
                fontSize: '0.6rem',
                '& .MuiChip-label': { px: 0.5 },
              }}
            />
          )}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {activeFilterCount > 0 && (
            <Tooltip title="Clear all" arrow>
              <IconButton
                size="small"
                onClick={clearAll}
                sx={{
                  width: 24, height: 24, borderRadius: '6px',
                  color: FC.slate[400],
                  transition: 'all 0.2s ease',
                  '&:hover': { color: '#EF4444', bgcolor: '#FEF2F2' },
                }}
              >
                <ClearAllIcon sx={{ fontSize: 14 }} />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="Collapse panel" arrow>
            <IconButton
              size="small"
              onClick={() => onCollapse && onCollapse()}
              sx={{
                width: 24, height: 24, borderRadius: '6px',
                color: FC.slate[400],
                transition: 'all 0.2s ease',
                '&:hover': { color: FC.indigo[600], bgcolor: FC.indigo[50] },
              }}
            >
              <ChevronLeftIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* ─── Filter Sections ─── */}
      <Box sx={{
        px: 1.5, py: 1.5,
        flex: 1,
        overflowY: 'auto',
        minHeight: 0,
        '&::-webkit-scrollbar': { width: 4 },
        '&::-webkit-scrollbar-track': { bgcolor: 'transparent' },
        '&::-webkit-scrollbar-thumb': {
          bgcolor: alpha(FC.indigo[300], 0.25),
          borderRadius: 4,
          '&:hover': { bgcolor: alpha(FC.indigo[400], 0.4) },
        },
      }}>
        <Stack spacing={1.25}>

          {/* ─── Content Type Section ─── */}
          <FilterCard accentColor={FC.indigo[400]}>
            <FilterSectionHeader
              icon={<CategoryIcon />}
              title="Content Type"
              color={FC.indigo[500]}
              theme={theme}
            />
            <ToggleButtonGroup
              orientation="vertical"
              size="small"
              exclusive
              value={mode}
              onChange={(_, v) => v && setMode(v)}
              sx={{
                width: '100%',
                display: 'flex',
                gap: 0.4,
                '& .MuiToggleButtonGroup-grouped': {
                  border: 'none !important',
                  '&:not(:first-of-type)': { borderRadius: '8px !important', marginLeft: '0 !important' },
                  '&:first-of-type': { borderRadius: '8px !important' },
                },
              }}
            >
              {contentTypeConfig.map((ct) => (
                <ToggleButton
                  key={ct.value}
                  value={ct.value}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    gap: 0.75,
                    py: 0.6,
                    px: 1,
                    borderRadius: '8px !important',
                    border: `1px solid transparent !important`,
                    background: '#fff',
                    color: theme.palette.text.secondary,
                    textTransform: 'none',
                    transition: 'all 0.2s ease',
                    position: 'relative',
                    overflow: 'hidden',
                    '&:hover': {
                      background: alpha(ct.bgLight, 0.7),
                      borderColor: `${alpha(ct.color, 0.2)} !important`,
                      '& .ct-icon-badge': {
                        background: alpha(ct.color, 0.18),
                        transform: 'scale(1.05)',
                      }
                    },
                    '&.Mui-selected': {
                      background: ct.bgGradient,
                      borderColor: `${alpha(ct.color, 0.35)} !important`,
                      boxShadow: `0 1px 4px ${alpha(ct.color, 0.12)}`,
                      '& .ct-icon-badge': {
                        background: ct.color,
                        color: '#fff',
                        boxShadow: `0 2px 6px ${alpha(ct.color, 0.35)}`,
                      },
                      '& .ct-label': { color: ct.color, fontWeight: 700 },
                      '&:hover': { background: ct.bgGradient },
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        left: 0, top: '18%', bottom: '18%',
                        width: '2.5px',
                        borderRadius: '0 2px 2px 0',
                        background: ct.color,
                      },
                    },
                  }}
                >
                  <Box
                    className="ct-icon-badge"
                    sx={{
                      width: 24, height: 24, borderRadius: '6px',
                      background: alpha(ct.color, 0.08),
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: ct.color,
                      transition: 'all 0.2s ease',
                      flexShrink: 0,
                    }}
                  >
                    {ct.value === 'both' ? (
                      <Box sx={{ display: 'flex', gap: 0.2 }}>
                        <NewspaperIcon sx={{ fontSize: '0.65rem' }} />
                        <EventAvailableIcon sx={{ fontSize: '0.65rem' }} />
                      </Box>
                    ) : React.cloneElement(ct.icon, { sx: { fontSize: '0.85rem' } })}
                  </Box>
                  <Typography
                    className="ct-label"
                    sx={{
                      fontSize: '0.74rem', fontWeight: 600,
                      color: theme.palette.text.primary,
                      transition: 'all 0.2s ease',
                      lineHeight: 1.2, textAlign: 'left',
                    }}
                  >
                    {ct.label}
                  </Typography>
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </FilterCard>

          {/* ─── Date Range Section ─── */}
          <FilterCard accentColor={FC.cyan[400]}>
            <FilterSectionHeader icon={<CalendarMonthIcon />} title="Date Range" color={FC.cyan[600]} theme={theme} count={(dateFrom ? 1 : 0) + (dateTo ? 1 : 0)} />
            <Stack spacing={0.75}>
              <TextField type="date" label="From" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} fullWidth size="small" InputLabelProps={{ shrink: true }}
                inputProps={{ max: dateTo || new Date().toISOString().split('T')[0], style: { cursor: 'pointer', colorScheme: theme.palette.mode === 'dark' ? 'dark' : 'light' } }}
                sx={dateFieldSx(FC.cyan[500])} />
              <TextField type="date" label="To" value={dateTo} onChange={(e) => setDateTo(e.target.value)} fullWidth size="small" InputLabelProps={{ shrink: true }}
                inputProps={{ min: dateFrom || undefined, max: new Date().toISOString().split('T')[0], style: { cursor: 'pointer', colorScheme: theme.palette.mode === 'dark' ? 'dark' : 'light' } }}
                sx={dateFieldSx(FC.cyan[500])} />
            </Stack>
          </FilterCard>

          {/* ─── News Filters Section ─── */}
          {(mode === "news" || mode === "both" || mode === "intelligence") && (
            <FilterCard accentColor={FC.blue[400]}>
              <FilterSectionHeader icon={<NewspaperIcon />} title="News Filters" color={FC.blue[600]} theme={theme} count={newsFilterCount} />
              <Stack spacing={0.75}>
                <FilterDropdown label="Country" values={options.country || []} selected={filters.country || []} setSelected={(v) => setFilters(f => ({ ...f, country: v }))} accentColor={FC.blue[500]} />
                <FilterDropdown label="Organisation" values={options.org || []} selected={filters.org || []} setSelected={(v) => setFilters(f => ({ ...f, org: v }))} accentColor={FC.blue[500]} />
                <FilterDropdown label="NSAG" values={options.nsag || []} selected={filters.nsag || []} setSelected={(v) => setFilters(f => ({ ...f, nsag: v }))} accentColor={FC.blue[500]} />
              </Stack>
            </FilterCard>
          )}

          {/* ─── Events Filters Section ─── */}
          {(mode === "events" || mode === "both") && (
            <FilterCard accentColor={FC.orange[400]}>
              <FilterSectionHeader icon={<EventAvailableIcon />} title="Event Filters" color={FC.orange[600]} theme={theme} count={eventFilterCount} />
              <Stack spacing={0.75}>
                <FilterDropdown label="Event Country" values={options.eventcountry || []} selected={filters.eventcountry || []} setSelected={(v) => setFilters(f => ({ ...f, eventcountry: v }))} accentColor={FC.orange[500]} />
                <FilterDropdown label="Event Category" values={options.eventcategory || []} selected={filters.eventcategory || []} setSelected={(v) => setFilters(f => ({ ...f, eventcategory: v }))} accentColor={FC.orange[500]} />
                <FilterDropdown label="Event Location" values={options.eventlocation || []} selected={filters.eventlocation || []} setSelected={(v) => setFilters(f => ({ ...f, eventlocation: v }))} accentColor={FC.orange[500]} />
                <FilterDropdown label="Platforms" values={options.platforms || []} selected={filters.platforms || []} setSelected={(v) => setFilters(f => ({ ...f, platforms: v }))} accentColor={FC.orange[500]} />
                <FilterDropdown label="Actor Label" values={options.actorlabel || []} selected={filters.actorlabel || []} setSelected={(v) => setFilters(f => ({ ...f, actorlabel: v }))} accentColor={FC.orange[500]} />
                <FilterDropdown label="Actor Nation" values={options.actornation || []} selected={filters.actornation || []} setSelected={(v) => setFilters(f => ({ ...f, actornation: v }))} accentColor={FC.orange[500]} />
                <FilterDropdown label="Actor Type" values={options.actortype || []} selected={filters.actortype || []} setSelected={(v) => setFilters(f => ({ ...f, actortype: v }))} accentColor={FC.orange[500]} />
              </Stack>
            </FilterCard>
          )}

        </Stack>
      </Box>
    </Box>
  );
}

// Enhanced News/Event Card Component
function ContentCard({ item, view, onArticleClick, selectedItemId, isViewingArticle }) {
  const theme = useTheme();
  const isSelected = isViewingArticle && selectedItemId === item.id;

  const handleCardClick = () => {
    try {
      const currentState = {
        scrollPosition: window.scrollY,
        timestamp: Date.now()
      };
      sessionStorage.setItem('search_page_return_state', JSON.stringify(currentState));
    } catch (error) {
      console.warn('Failed to save return state:', error);
    }
    onArticleClick(item);
  };

  if (view === 'list') {
    return (
      <Card
        elevation={isSelected ? 4 : 2}
        onClick={handleCardClick}
        sx={{
          borderRadius: 3,
          transition: 'all 0.3s ease-in-out',
          cursor: 'pointer',
          transform: isSelected ? 'translateY(-2px)' : 'none',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: theme.shadows[8],
            '& img': {
              transform: 'scale(1.02)',
            }
          },
          border: isSelected
            ? `2px solid ${theme.palette.primary.main}`
            : `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          boxShadow: isSelected ? theme.shadows[8] : theme.shadows[2],
          bgcolor: isSelected
            ? alpha(theme.palette.primary.main, 0.05)
            : 'background.paper',
          overflow: 'hidden'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'stretch' }}>
          {!['events', 'intelligence briefings'].includes(item.index) && (
            <CardMedia
              component="img"
              sx={{
                width: 240,
                height: 180,
                transition: 'transform 0.3s ease-in-out',
                objectFit: 'cover',
                flexShrink: 0
              }}
              image={item.imageurl}
              alt={item.title}
            />
          )}
          <CardContent sx={{
            p: 3,
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <CalendarMonthIcon
                  fontSize="small"
                  sx={{ color: theme.palette.text.secondary }}
                />
                <Typography variant="caption" color="text.secondary">
                  {new Date(item.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </Typography>
                <Chip
                  size="small"
                  label={item.index.toUpperCase()}
                  color={item.index === 'news' ? 'primary' : 'secondary'}
                  variant="outlined"
                  sx={{ ml: 'auto', fontSize: '0.7rem' }}
                />
              </Box>

              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  lineHeight: 1.3,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  color: theme.palette.text.primary,
                  mb: 1.5
                }}
              >
                {item.title}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  lineHeight: 1.5
                }}
              >
                {item.summary}
              </Typography>
            </Box>
          </CardContent>
        </Box>
      </Card>
    );
  }

  // Vertical layout for grid view
  return (
    <Card
      elevation={isSelected ? 4 : 2}
      onClick={handleCardClick}

      sx={{
        height: "100%",
        minHeight: ['events', 'intelligence briefings'].includes(item.index) ? 320 : 'auto',
        borderRadius: 3,
        transition: 'all 0.3s ease-in-out',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        transform: isSelected ? 'translateY(-4px)' : 'none',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: theme.shadows[12],
          '& img': {
            transform: 'scale(1.05)',
          }
        },
        border: isSelected
          ? `2px solid ${theme.palette.primary.main}`
          : `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        boxShadow: isSelected ? theme.shadows[8] : theme.shadows[2],
        bgcolor: isSelected
          ? alpha(theme.palette.primary.main, 0.05)
          : 'background.paper',
        overflow: 'hidden'
      }}
    >
      {!['events', 'intelligence briefings'].includes(item.index) && (
        <CardMedia
          component="img"
          height="180"
          image={item.imageurl}
          alt={item.title}
          sx={{
            transition: 'transform 0.3s ease-in-out',
            objectFit: 'cover',
          }}
        />
      )}
      <CardContent sx={{ p: 2 }}>
        <Stack spacing={1.5}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CalendarMonthIcon
              fontSize="small"
              sx={{ color: theme.palette.text.secondary }}
            />
            <Typography variant="caption" color="text.secondary">
              {new Date(item.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </Typography>
            <Chip
              size="small"
              label={item.index.toUpperCase()}
              color={item.index === 'news' ? 'primary' : 'secondary'}
              variant="outlined"
              sx={{ ml: 'auto', fontSize: '0.7rem' }}
            />
          </Box>

          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              lineHeight: 1.3,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              color: theme.palette.text.primary
            }}
          >
            {item.title}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: ['events', 'intelligence briefings'].includes(item.index) ? 6 : 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: 1.4

            }}
          >
            {item.summary}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}

// Detail Modal Component for viewing item details
function DetailModal({ open, item, onClose }) {
  const theme = useTheme();

  if (!item) return null;

  const getTypeConfig = () => {
    switch (item.index) {
      case 'events':
        return {
          color: theme.palette.secondary.main,
          gradient: `linear-gradient(135deg, ${alpha(theme.palette.secondary.light, 0.3)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
          icon: <EventAvailableIcon sx={{ color: theme.palette.secondary.main }} />,
          label: 'Event'
        };
      case 'intelligence briefings':
        return {
          color: theme.palette.info.main,
          gradient: `linear-gradient(135deg, ${alpha(theme.palette.info.light, 0.3)} 0%, ${alpha(theme.palette.info.main, 0.1)} 100%)`,
          icon: <SecurityIcon sx={{ color: theme.palette.info.main }} />,
          label: 'Intelligence'
        };
      default:
        return {
          color: theme.palette.primary.main,
          gradient: `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.3)} 0%, ${alpha(theme.palette.primary.main, 0.1)} 100%)`,
          icon: <NewspaperIcon sx={{ color: theme.palette.primary.main }} />,
          label: 'News'
        };
    }
  };

  const typeConfig = getTypeConfig();

  const renderContent = () => {
    if (item.index === 'news' || item.index === 'intelligence briefings') {
      return (
        <ArticleDetailPage
          userId={1}
          reqId=""
          docId={item.id}
        />
      );
    } else {
      return (
        <Box sx={{ p: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
            {item.title}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
            <CalendarMonthIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {new Date(item.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
            {item.summary}
          </Typography>
        </Box>
      );
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      scroll="paper"
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxHeight: '90vh',
          m: 2,
        }
      }}
    >
      <DialogTitle
        sx={{
          background: typeConfig.gradient,
          borderBottom: `2px solid ${typeConfig.color}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          py: 2,
          px: 3,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, minWidth: 0 }}>
          <Chip
            icon={typeConfig.icon}
            label={typeConfig.label}
            size="small"
            sx={{
              bgcolor: 'white',
              color: typeConfig.color,
              fontWeight: 600,
              border: `1px solid ${typeConfig.color}`,
              '& .MuiChip-icon': {
                color: typeConfig.color,
              }
            }}
          />
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: theme.palette.text.primary,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {item.title}
          </Typography>
        </Box>
        <IconButton
          onClick={onClose}
          sx={{
            bgcolor: alpha(theme.palette.common.white, 0.8),
            '&:hover': {
              bgcolor: alpha(theme.palette.common.white, 1),
            },
            ml: 2,
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent
        sx={{
          p: 0,
          bgcolor: theme.palette.background.default,
        }}
      >
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
}

// Main Results Panel Component
function ResultsPanel({ query, initialMode }) {
  const theme = useTheme();
  const sidebarWidth = 275;
  const collapsedWidth = 60;

  const [mode, setMode] = useState(initialMode || "news");
  const [filters, setFilters] = useState({
    country: [], org: [], nsag: [],
    eventcountry: [], eventcategory: [], eventlocation: [],
    platforms: [], actorlabel: [], actornation: [], actortype: []
  });
  const [options, setOptions] = useState({});
  const [view, setView] = useState('grid');
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [allRecords, setAllRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastDocId, setLastDocId] = useState("");
  const [hasNextPage, setHasNextPage] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [isViewingArticle, setIsViewingArticle] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);

  // Reset article view and filters when query changes
  useEffect(() => {
    setIsViewingArticle(false);
    setSelectedArticle(null);
    setFilters({
      country: [], org: [], nsag: [],
      eventcountry: [], eventcategory: [], eventlocation: [],
      platforms: [], actorlabel: [], actornation: [], actortype: []
    });
    setDateFrom("");
    setDateTo("");
    sessionStorage.removeItem('search_page_return_state');
  }, [query]);

  const pageSize = 20;

  const clearAll = () => {
    setFilters({
      country: [], org: [], nsag: [],
      eventcountry: [], eventcategory: [], eventlocation: [],
      platforms: [], actorlabel: [], actornation: [], actortype: []
    });
    setDateFrom("");
    setDateTo("");
  };

  const handleArticleClick = (item) => {
    setSelectedArticle(item);
    setIsViewingArticle(true);
  };

  const handleCloseModal = () => {
    setIsViewingArticle(false);
    setSelectedArticle(null);
  };

  // Data fetch when query or filters change
  useEffect(() => {
    if (!query) return;

    const fetchData = async () => {
      setLoading(true);
      setAllRecords([]);
      setLastDocId("");
      setHasNextPage(false);

      try {
        let response;
        const commonParams = {
          keywords: query,
          fromdate: dateFrom,
          todate: dateTo,
          size: pageSize,
          lastdocid: "",
          req_id: `search-${Date.now()}`
        };

        switch (mode) {
          case "news":
            response = await fetchNewsData({
              ...commonParams,
              filters: {
                country: filters.country,
                org: filters.org,
                nsag: filters.nsag
              }
            });
            break;
          case "intelligence":
            response = await fetchIntelligenceData({
              ...commonParams,
              filters: {
                country: filters.country,
                org: filters.org,
                nsag: filters.nsag
              }
            });
            break;
          case "events":
            response = await fetchEventsData({
              ...commonParams,
              filters: {
                eventcountry: filters.eventcountry,
                eventcategory: filters.eventcategory,
                eventlocation: filters.eventlocation,
                platforms: filters.platforms,
                actorlabel: filters.actorlabel,
                actornation: filters.actornation,
                actortype: filters.actortype
              }
            });
            break;
          case "both":
            response = await fetchCombinedData({
              ...commonParams,
              newsFilters: {
                country: filters.country,
                org: filters.org,
                nsag: filters.nsag
              },
              eventFilters: {
                eventcountry: filters.eventcountry,
                eventcategory: filters.eventcategory,
                eventlocation: filters.eventlocation,
                platforms: filters.platforms,
                actorlabel: filters.actorlabel,
                actornation: filters.actornation,
                actortype: filters.actortype
              }
            });
            break;
          default:
            return;
        }

        setAllRecords(response.records || []);

        setOptions(response);
        if (response.hasMore && response.records && response.records.length > 0) {
          setLastDocId(response.lastdocid || "");
        } else {
          setLastDocId("");
        }
        setHasNextPage(response.hasMore || false);
        setTotalRecords(response.total || 0);
      } catch (error) {
        console.error('Error fetching search data:', error);
        setAllRecords([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [query, mode, filters, dateFrom, dateTo]);

  const displayedItems = useMemo(() => {
    return allRecords;
  }, [allRecords]);

  // Load more data for infinite scrolling
  const loadMoreData = async () => {
    if (!hasNextPage || loadingMore) return;

    setLoadingMore(true);

    try {
      let response;
      const commonParams = {
        keywords: query,
        fromdate: dateFrom,
        todate: dateTo,
        size: pageSize,
        lastdocid: lastDocId,
        req_id: `search-${Date.now()}`
      };

      switch (mode) {
        case "news":
          response = await fetchNewsData({
            ...commonParams,
            filters: { country: filters.country, org: filters.org, nsag: filters.nsag }
          });
          break;
        case "intelligence":
          response = await fetchIntelligenceData({
            ...commonParams,
            filters: { country: filters.country, org: filters.org, nsag: filters.nsag }
          });
          break;
        case "events":
          response = await fetchEventsData({
            ...commonParams,
            filters: {
              eventcountry: filters.eventcountry,
              eventcategory: filters.eventcategory,
              eventlocation: filters.eventlocation,
              platforms: filters.platforms,
              actorlabel: filters.actorlabel,
              actornation: filters.actornation,
              actortype: filters.actortype
            }
          });
          break;
        case "both":
          response = await fetchCombinedData({
            ...commonParams,
            newsFilters: { country: filters.country, org: filters.org, nsag: filters.nsag },
            eventFilters: {
              eventcountry: filters.eventcountry,
              eventcategory: filters.eventcategory,
              eventlocation: filters.eventlocation,
              platforms: filters.platforms,
              actorlabel: filters.actorlabel,
              actornation: filters.actornation,
              actortype: filters.actortype
            }
          });
          break;
        default:
          return;
      }

      // Append new records to existing ones
      setAllRecords(prev => [...prev, ...(response.records || [])]);

      setLastDocId(response.lastdocid || "");
      setHasNextPage(response.hasMore || false);

    } catch (error) {
      console.error('Error loading more data:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  // Infinite scroll effect
  useEffect(() => {
    if (!hasNextPage || loadingMore) {
      return;
    }

    let isScrolling = false;

    const handleScroll = () => {
      if (isScrolling || loadingMore || !hasNextPage) {
        return;
      }

      const scrollThreshold = 400;
      const windowHeight = window.innerHeight;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const documentHeight = document.documentElement.scrollHeight;

      const distanceFromBottom = documentHeight - (scrollTop + windowHeight);

      if (distanceFromBottom <= scrollThreshold) {
        isScrolling = true;
        loadMoreData().finally(() => {
          setTimeout(() => {
            isScrolling = false;
          }, 1000);
        });
      }
    };

    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', throttledScroll);
    };
  }, [hasNextPage, loadingMore, lastDocId, query, mode, filters, dateFrom, dateTo]);

  const filterBarProps = {
    mode, setMode, filters, setFilters, clearAll, options,
    dateFrom, setDateFrom, dateTo, setDateTo,
  };

  return (
    <>
    <Box sx={{ display: "flex", minHeight: "calc(100vh - 100px)" }}>
      {/* Desktop Sidebar */}
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          flexShrink: 0,
          width: sidebarOpen ? sidebarWidth : collapsedWidth,
          bgcolor: '#fff',
          borderRight: `1px solid ${alpha(FC.indigo[200], 0.25)}`,
          overflow: 'hidden',
          height: 'calc(100vh - 100px)',
          position: 'sticky',
          top: 0,
          flexDirection: 'column',
          transition: theme.transitions.create(['width'], {
            easing: theme.transitions.easing.easeInOut,
            duration: 250,
          }),
          boxShadow: `1px 0 12px ${alpha(FC.indigo[500], 0.04)}, 4px 0 24px ${alpha(FC.blue[500], 0.03)}`,
        }}
      >
          {/* ── Expanded state ── */}
          {sidebarOpen && (
            <FilterBar {...filterBarProps} onCollapse={() => setSidebarOpen(false)} />
          )}

          {/* ── Collapsed state ── */}
          {!sidebarOpen && (
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              height: '100%',
            }}>
              {/* Collapsed header — expand button */}
              <Box sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                py: 1,
                background: `linear-gradient(135deg, ${FC.indigo[50]} 0%, ${FC.blue[50]} 100%)`,
                borderBottom: `1px solid ${FC.indigo[100]}`,
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: 0, left: 0, right: 0,
                  height: '2px',
                  background: `linear-gradient(90deg, ${FC.indigo[400]}, ${FC.blue[400]}, ${FC.cyan[400]})`,
                  opacity: 0.5,
                },
              }}>
                <Tooltip title="Expand filters" arrow placement="right">
                  <IconButton
                    size="small"
                    onClick={() => setSidebarOpen(true)}
                    sx={{
                      width: 34, height: 34, borderRadius: '8px',
                      background: `linear-gradient(135deg, ${FC.indigo[500]}, ${FC.blue[500]})`,
                      color: '#fff',
                      boxShadow: `0 2px 8px ${alpha(FC.indigo[500], 0.3)}`,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        boxShadow: `0 4px 12px ${alpha(FC.indigo[500], 0.4)}`,
                        transform: 'scale(1.05)',
                      },
                    }}
                  >
                    <ChevronRightIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                </Tooltip>
              </Box>

              {/* Collapsed icon strip — vertical content type icons */}
              <Stack spacing={1} sx={{ pt: 1.5, alignItems: 'center' }}>
                {contentTypeConfig.map((ct) => (
                  <Tooltip key={ct.value} title={ct.label} arrow placement="right">
                    <IconButton
                      size="small"
                      onClick={() => { setMode(ct.value); setSidebarOpen(true); }}
                      sx={{
                        width: 34, height: 34, borderRadius: '8px',
                        bgcolor: mode === ct.value ? alpha(ct.color, 0.12) : alpha(ct.color, 0.04),
                        color: ct.color,
                        border: `1px solid ${mode === ct.value ? alpha(ct.color, 0.3) : 'transparent'}`,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          bgcolor: alpha(ct.color, 0.15),
                          transform: 'scale(1.08)',
                          boxShadow: `0 2px 8px ${alpha(ct.color, 0.2)}`,
                        },
                      }}
                    >
                      {ct.value === 'both' ? (
                        <Box sx={{ display: 'flex', gap: 0.15 }}>
                          <NewspaperIcon sx={{ fontSize: '0.7rem' }} />
                          <EventAvailableIcon sx={{ fontSize: '0.7rem' }} />
                        </Box>
                      ) : React.cloneElement(ct.icon, { sx: { fontSize: '1rem' } })}
                    </IconButton>
                  </Tooltip>
                ))}
              </Stack>
            </Box>
          )}
      </Box>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={mobileDrawerOpen || (window.innerWidth < 900)}
        onClose={() => setMobileDrawerOpen(false)}
        sx={{
          display: { md: 'none' },
          '& .MuiDrawer-paper': {
            width: sidebarWidth,
            bgcolor: '#fff',
            borderRight: `1px solid ${alpha(FC.indigo[200], 0.25)}`,
            boxShadow: `4px 0 24px ${alpha(FC.indigo[500], 0.08)}`,
          },
        }}
      >
        <FilterBar {...filterBarProps} onCollapse={() => setMobileDrawerOpen(false)} />
      </Drawer>

      {/* Mobile Filter FAB */}
      <IconButton
        onClick={() => setMobileDrawerOpen(true)}
        sx={{
          display: { md: 'none' },
          position: 'fixed',
          bottom: 20,
          left: 20,
          width: 44,
          height: 44,
          borderRadius: '12px',
          background: `linear-gradient(135deg, ${FC.indigo[600]} 0%, ${FC.blue[600]} 100%)`,
          color: '#fff',
          zIndex: 1000,
          boxShadow: `0 4px 16px ${alpha(FC.indigo[500], 0.35)}, 0 2px 8px ${alpha(FC.blue[500], 0.2)}`,
          transition: 'all 0.2s ease',
          '&:hover': {
            background: `linear-gradient(135deg, ${FC.indigo[700]} 0%, ${FC.blue[700]} 100%)`,
            transform: 'translateY(-2px)',
            boxShadow: `0 6px 20px ${alpha(FC.indigo[500], 0.4)}, 0 4px 12px ${alpha(FC.blue[500], 0.25)}`,
          },
        }}
      >
        <FilterListIcon sx={{ fontSize: 20 }} />
      </IconButton>

      {/* Content Area */}
      <Box sx={{
        flexGrow: 1,
        bgcolor: theme.palette.background.default,
        transition: theme.transitions.create(['margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        })
      }}>
        <Container maxWidth={false} sx={{ p: 0 }}>
          {/* Results Header */}
          <Box sx={{
            mb: 2,
            px: 2.5,
            py: 1.5,
            background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.primary.main, 0.04)} 100%)`,
            borderRadius: 3,
            border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
            backdropFilter: 'blur(8px)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1, minWidth: 0 }}>
              <Box sx={{
                width: 36,
                height: 36,
                borderRadius: '10px',
                background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.12)} 0%, ${alpha(theme.palette.primary.main, 0.06)} 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <SearchIcon sx={{ fontSize: '1.2rem', color: theme.palette.primary.main }} />
              </Box>
              <Box sx={{ minWidth: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, flexWrap: 'wrap' }}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 700,
                      color: theme.palette.text.primary,
                      lineHeight: 1.3,
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Search Results
                  </Typography>
                  {query && (
                    <Chip
                      label={query}
                      size="small"
                      color="primary"
                      variant="outlined"
                      sx={{
                        height: 22,
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        borderRadius: '6px',
                        maxWidth: 200,
                        '& .MuiChip-label': { px: 1 }
                      }}
                    />
                  )}
                </Box>
                <Typography
                  variant="caption"
                  sx={{
                    color: theme.palette.text.secondary,
                    fontWeight: 500,
                    lineHeight: 1.2
                  }}
                >
                  {allRecords.length > 0
                    ? <>{' '}<Box component="span" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>{allRecords.length}</Box> of {totalRecords} records</>
                    : totalRecords > 0
                      ? `0 of ${totalRecords} records`
                      : 'No records found'
                  }
                </Typography>
              </Box>
            </Box>

            {/* View Toggle Buttons */}
            <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center' }}>
              <ToggleButtonGroup
                size="small"
                exclusive
                value={view}
                onChange={(_, v) => v && setView(v)}
                sx={{
                  bgcolor: alpha(theme.palette.background.paper, 0.6),
                  borderRadius: '10px',
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  overflow: 'hidden',
                  '& .MuiToggleButtonGroup-grouped': {
                    border: 'none',
                    '&:not(:first-of-type)': {
                      borderLeft: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                      borderRadius: 0,
                    },
                    '&:first-of-type': {
                      borderRadius: 0,
                    },
                  }
                }}
              >
                <ToggleButton
                  value="grid"
                  sx={{
                    px: 1.5,
                    py: 0.5,
                    gap: 0.5,
                    textTransform: 'none',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    color: theme.palette.text.secondary,
                    transition: 'all 0.2s ease',
                    '&.Mui-selected': {
                      bgcolor: theme.palette.primary.main,
                      color: 'white',
                      boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.3)}`,
                      '&:hover': {
                        bgcolor: theme.palette.primary.dark,
                      }
                    }
                  }}
                >
                  <ViewModuleIcon sx={{ fontSize: '1rem' }} />
                  Grid
                </ToggleButton>
                <ToggleButton
                  value="list"
                  sx={{
                    px: 1.5,
                    py: 0.5,
                    gap: 0.5,
                    textTransform: 'none',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    color: theme.palette.text.secondary,
                    transition: 'all 0.2s ease',
                    '&.Mui-selected': {
                      bgcolor: theme.palette.primary.main,
                      color: 'white',
                      boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.3)}`,
                      '&:hover': {
                        bgcolor: theme.palette.primary.dark,
                      }
                    }
                  }}
                >
                  <ViewListIcon sx={{ fontSize: '1rem' }} />
                  List
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
          </Box>

          {/* Active Filters */}
          {(Object.values(filters).some(arr => arr && arr.length > 0) || dateFrom || dateTo) && (
            <Box sx={{ mb: 3, p: 2, bgcolor: alpha(theme.palette.background.paper, 0.8), borderRadius: 2, boxShadow: theme.shadows[1] }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>
                  Active Filters
                </Typography>
                <Button
                  startIcon={<ClearAllIcon />}
                  size="small"
                  variant="outlined"
                  color="error"
                  onClick={clearAll}
                  sx={{
                    borderRadius: 1.5,
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    py: 0.5,
                    px: 1.5,
                    '&:hover': {
                      bgcolor: alpha(theme.palette.error.main, 0.1)
                    }
                  }}
                >
                  Clear All
                </Button>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {Object.entries(filters).flatMap(([key, values]) =>
                  (values || []).map(val => (
                    <Chip
                      key={`${key}-${val}`}
                      label={`${key}: ${val}`}
                      size="small"
                      onDelete={() => setFilters(f => ({
                        ...f,
                        [key]: (f[key] || []).filter(x => x !== val)
                      }))}
                      color={key.startsWith('event') ? 'secondary' : 'primary'}
                      variant="filled"
                    />
                  ))
                )}
                {(dateFrom || dateTo) && (
                  <Chip
                    label={`${dateFrom || '...'} - ${dateTo || '...'}`}
                    size="small"
                    onDelete={() => { setDateFrom(""); setDateTo(""); }}
                    color="info"
                    variant="filled"
                  />
                )}
              </Box>
            </Box>
          )}

          {/* Results Grid/List */}
          {view === "grid" ? (
            <Grid container spacing={3}>
              {loading && allRecords.length === 0 ?
                Array.from({ length: pageSize }).map((_, i) => (
                  <Grid item xs={12} sm={6} lg={4} key={i}>
                    <Skeleton
                      variant="rectangular"
                      height={320}
                      sx={{ borderRadius: 3 }}
                    />
                  </Grid>
                )) :
                displayedItems.map((item) => (
                  <Grid item xs={12} sm={6} lg={4} key={item.id}>
                    <ContentCard
                      item={item}
                      view={view}
                      onArticleClick={handleArticleClick}
                      selectedItemId={selectedArticle?.id}
                      isViewingArticle={isViewingArticle}
                    />
                  </Grid>
                ))
              }
            </Grid>
          ) : (
            <Stack spacing={3}>
              {loading && allRecords.length === 0 ?
                Array.from({ length: pageSize }).map((_, i) => (
                  <Skeleton
                    key={i}
                    variant="rectangular"
                    height={200}
                    sx={{ borderRadius: 3 }}
                  />
                )) :
                displayedItems.map((item) => (
                  <ContentCard
                    key={item.id}
                    item={item}
                    view={view}
                    onArticleClick={handleArticleClick}
                    selectedItemId={selectedArticle?.id}
                    isViewingArticle={isViewingArticle}
                  />
                ))
              }
            </Stack>
          )}


          {/* Infinite Scroll Loading Indicator */}
          {loadingMore && (
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 3 }}>
                <Box sx={{
                  width: 40,
                  height: 40,
                  border: '4px solid #f0f0f0',
                  borderTop: '4px solid #1976d2',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  '@keyframes spin': {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' }
                  }
                }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                  Loading more results...
                </Typography>
              </Box>
            </Box>
          )}

          {hasNextPage && !loadingMore && (
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', py: 3 }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => {
                  loadMoreData();
                }}
                sx={{
                  borderRadius: 2,
                  px: 4,
                  py: 1.5,
                  fontWeight: 600,
                  fontSize: '1rem',

                }}
              >
                Load More
              </Button>
            </Box>
          )}

          {/* End of Results Message */}
          {!hasNextPage && allRecords.length > 0 && (
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', py: 3 }}>
              <Typography variant="body1" sx={{ fontWeight: 600, color: theme.palette.text.secondary }}>
                You've reached the end! All {totalRecords} records loaded.
              </Typography>
            </Box>
          )}
        </Container>
      </Box>

      {/* Full-Page Loader for API Calls */}
      <Backdrop
        open={loading}
        sx={{
          color: '#fff',
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: alpha(theme.palette.common.black, 0.7),
          backdropFilter: 'blur(8px)',
        }}
      >
        <Fade in={loading}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3,
              p: 4,
              bgcolor: alpha(theme.palette.background.paper, 0.9),
              borderRadius: 3,
              boxShadow: theme.shadows[24],
            }}
          >
            <CircularProgress
              size={60}
              thickness={4}
              sx={{
                color: theme.palette.primary.main,
              }}
            />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: theme.palette.text.primary,
                textAlign: 'center',
              }}
            >
              Loading search results...
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.text.secondary,
                textAlign: 'center',
              }}
            >
              Please wait while we fetch your data
            </Typography>
          </Box>
        </Fade>
      </Backdrop>
    </Box>

      {/* Detail Modal */}
      <DetailModal
        open={isViewingArticle}
        item={selectedArticle}
        onClose={handleCloseModal}
      />
    </>
  );
}

// Main SearchPage Component
export default function SearchPage() {
  const location = useLocation();
  const [query, setQuery] = useState("");
  const [initialMode, setInitialMode] = useState(null);

  // Set page title
  useEffect(() => {
    document.title = "SearchPage";
  }, []);

  // Get query from URL parameters and check for saved state
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchQuery = urlParams.get('q');
    const modeParam = urlParams.get('mode');
    const forceRefresh = urlParams.get('refresh');

    // If we have a new search query, clear old state to force fresh load
    if (searchQuery && searchQuery !== query) {
      sessionStorage.removeItem('search_page_return_state');

      const stateKey = `search_state_${searchQuery}`;
      sessionStorage.removeItem(stateKey);
    }

    if (modeParam) {
      setInitialMode(modeParam);
    } else if (searchQuery) {
      setInitialMode('both');
    }

    if (modeParam === 'intelligence') {
      setQuery(searchQuery || 'intelligence Briefings');
    } else if (searchQuery) {
      setQuery(searchQuery);
    } else {
      try {
        const keys = Object.keys(sessionStorage).filter(key => key.startsWith('search_state_'));

        if (keys.length > 0) {
          let mostRecentKey = '';
          let mostRecentTime = 0;

          keys.forEach(key => {
            try {
              const state = JSON.parse(sessionStorage.getItem(key));
              const timestamp = state.timestamp || 0;
              if (timestamp > mostRecentTime) {
                mostRecentTime = timestamp;
                mostRecentKey = key;
              }
            } catch (e) {
              console.warn('SearchPage: Invalid state in key:', key, e);
            }
          });

          if (mostRecentKey) {
            const savedQuery = mostRecentKey.replace('search_state_', '');
            if (savedQuery && savedQuery !== 'undefined' && savedQuery !== 'null') {
              setQuery(savedQuery);
            }
          }
        }
      } catch (error) {
        console.warn('Failed to restore search state:', error);
      }
    }
  }, [location, query]);

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      {query ? (
        <ResultsPanel query={query} initialMode={initialMode} />
      ) : (
        <Container maxWidth="md" sx={{ pt: 8 }}>
          <Paper elevation={3} sx={{ p: 6, borderRadius: 4, textAlign: 'center' }}>
            <SearchIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
              Search News & Events
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Use the search functionality in the header to find relevant news articles and events.
            </Typography>
          </Paper>
        </Container>
      )}
    </Box>
  );
}
