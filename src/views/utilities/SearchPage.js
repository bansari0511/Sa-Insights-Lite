import React, { useEffect, useMemo, useState } from "react";
import {
  Box, Paper, Typography, Container, Stack, Grid, Chip,
  Skeleton, Button, ToggleButtonGroup, ToggleButton,
  Tooltip, Card, CardMedia, CardContent, alpha, useTheme, TextField,
  IconButton, Drawer, Autocomplete, CircularProgress, Backdrop, Fade,
  Dialog, DialogContent, DialogTitle, Tabs, Tab
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
  Category as CategoryIcon,
  Close as CloseIcon,
  Person as PersonIcon,
  Hardware as HardwareIcon
} from "@mui/icons-material";
import { useLocation } from 'react-router-dom';
import { fetchNewsData, fetchEventsData, fetchCombinedData, fetchIntelligenceData, fetchProfilesData, fetchEquipmentData } from '../../services/searchApi';
import { track } from '../../services/activity';
import ArticleDetailPage from '../newsRoom/ArticleDetailPage';

// Color tokens
const FC = {
  indigo: { 50: '#EEF2FF', 100: '#E0E7FF', 200: '#C7D2FE', 300: '#A5B4FC', 400: '#818CF8', 500: '#6366F1', 600: '#4F46E5', 700: '#4338CA', 800: '#3730A3' },
  blue:   { 50: '#EFF6FF', 100: '#DBEAFE', 200: '#BFDBFE', 400: '#60A5FA', 500: '#3B82F6', 600: '#2563EB', 700: '#1D4ED8' },
  cyan:   { 50: '#ECFEFF', 100: '#CFFAFE', 400: '#22D3EE', 500: '#06B6D4', 600: '#0891B2' },
  orange: { 50: '#FFF7ED', 100: '#FFEDD5', 400: '#FB923C', 500: '#F97316', 600: '#EA580C' },
  slate:  { 400: '#94A3B8', 500: '#64748B' },
};

// FilterDropdown Component
function FilterDropdown({ label, values, selected, setSelected, loading = false, accentColor }) {
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
      getOptionLabel={(option) => (option ? (option.label || option['c.label'] || String(option)) : '')}
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
                bgcolor: alpha(accent, 0.08), color: accent,
                border: `1px solid ${alpha(accent, 0.2)}`,
                '& .MuiChip-deleteIcon': {
                  fontSize: 13, color: 'rgba(255, 255, 255, 0.26)',
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
              borderRadius: '8px', bgcolor: alpha(theme.palette.background.default, 0.5),
              fontSize: '0.82rem', transition: 'all 0.2s ease',
              '& fieldset': { borderColor: 'transparent' },
              '&:hover': { bgcolor: alpha(theme.palette.background.default, 0.8), '& fieldset': { borderColor: alpha(accent, 0.25) } },
              '&.Mui-focused': { bgcolor: theme.palette.background.paper, boxShadow: `0 0 0 2px ${alpha(accent, 0.12)}`, '& fieldset': { borderColor: accent, borderWidth: 1.5 } }
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

// FilterSectionHeader Component
function FilterSectionHeader({ icon, title, color, theme, count }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 1.25 }}>
      {React.cloneElement(icon, { sx: { fontSize: 13, color: color || theme.palette.primary.main } })}
      <Typography sx={{
        fontSize: '0.65rem', fontWeight: 700,
        color: alpha(theme.palette.text.primary, 0.6), letterSpacing: '0.06em',
        textTransform: 'uppercase', flex: 1,
      }}>
        {title}
      </Typography>
      {count > 0 && (
        <Chip
          label={count} size="small"
          sx={{
            height: 18, minWidth: 18, fontSize: '0.6rem', fontWeight: 700,
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

// Content type button configs for collapsed sidebar
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
    value: 'assets',
    label: 'Assets',
    icon: <HardwareIcon sx={{ fontSize: '1.1rem' }} />,
    color: '#2e7d32',
    bgLight: '#e8f5e9',
    bgGradient: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)',
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
      borderRadius: '8px', bgcolor: alpha(theme.palette.background.default, 0.5),
      fontSize: '0.82rem', transition: 'all 0.2s ease',
      '& fieldset': { borderColor: 'transparent' },
      '&:hover': { bgcolor: alpha(theme.palette.background.default, 0.8), '& fieldset': { borderColor: alpha(accentColor, 0.25) } },
      '&.Mui-focused': { bgcolor: theme.palette.background.paper, boxShadow: `0 0 0 2px ${alpha(accentColor, 0.12)}`, '& fieldset': { borderColor: accentColor, borderWidth: 1.5 } }
    },
    '& .MuiInputLabel-root': { fontSize: '0.78rem', fontWeight: 500 },
    '& input[type="date"]::-webkit-calendar-picker-indicator': { cursor: 'pointer', opacity: 0.6, transition: 'opacity 0.2s', '&:hover': { opacity: 1 } },
  });

  const filterContentTypeConfig = [
    {
      value: 'news',
      label: 'News',
      icon: <NewspaperIcon sx={{ fontSize: '1.1rem' }} />,
      color: '#1976d2',
      bgLight: '#e3f2fd',
      bgGradient: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
    },
    {
      value: 'insights',
      label: 'Insights',
      icon: <PersonIcon sx={{ fontSize: '1.1rem' }} />,
      color: '#7c3aed',
      bgLight: '#f3e8ff',
      bgGradient: 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)',
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

  const FilterCard = ({ children, accentColor }) => (
    <Box sx={{
      borderRadius: '10px', border: `1px solid ${alpha(accentColor || FC.indigo[200], 0.18)}`,
      bgcolor: alpha(accentColor || FC.indigo[50], 0.06), p: 1.5, transition: 'all 0.2s ease',
      '&:hover': { bgcolor: alpha(accentColor || FC.indigo[50], 0.12), borderColor: alpha(accentColor || FC.indigo[300], 0.25) },
    }}>
      {children}
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, py: 1,
        flexShrink: 0, background: `linear-gradient(135deg, ${FC.indigo[50]} 0%, ${FC.blue[50]} 50%, ${FC.cyan[50]} 100%)`,
        borderBottom: `1px solid ${FC.indigo[100]}`, position: 'relative',
        '&::after': {
          content: '""', position: 'absolute', bottom: 0, left: 0, right: 0,
          height: '2px', background: `linear-gradient(90deg, ${FC.indigo[400]}, ${FC.blue[400]}, ${FC.cyan[400]})`, opacity: 0.5,
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
          <Typography sx={{ fontWeight: 700, fontSize: '0.84rem', color: FC.indigo[800], letterSpacing: '-0.01em' }}>Filters</Typography>
          {activeFilterCount > 0 && (
            <Chip label={activeFilterCount} size="small" sx={{
              height: 18, minWidth: 18, bgcolor: FC.indigo[500], color: '#fff',
              fontWeight: 700, fontSize: '0.6rem', '& .MuiChip-label': { px: 0.5 },
            }} />
          )}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {activeFilterCount > 0 && (
            <Tooltip title="Clear all" arrow>
              <IconButton size="small" onClick={clearAll} sx={{
                width: 24, height: 24, borderRadius: '6px', color: FC.slate[400],
                transition: 'all 0.2s ease', '&:hover': { color: '#EF4444', bgcolor: '#FEF2F2' },
              }}>
                <ClearAllIcon sx={{ fontSize: 14 }} />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="Collapse panel" arrow>
            <IconButton size="small" onClick={() => onCollapse && onCollapse()} sx={{
              width: 24, height: 24, borderRadius: '6px', color: FC.slate[400],
              transition: 'all 0.2s ease', '&:hover': { color: FC.indigo[600], bgcolor: FC.indigo[50] },
            }}>
              <ChevronLeftIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Box sx={{
        px: 1.5, py: 1.5, flex: 1, overflowY: 'auto', minHeight: 0,
        '&::-webkit-scrollbar': { width: 4 }, '&::-webkit-scrollbar-track': { bgcolor: 'transparent' },
        '&::-webkit-scrollbar-thumb': { bgcolor: alpha(FC.indigo[300], 0.25), borderRadius: 4, '&:hover': { bgcolor: alpha(FC.indigo[400], 0.4) } },
      }}>
        <Stack spacing={1.25}>
          <FilterCard accentColor={FC.indigo[400]}>
            <FilterSectionHeader icon={<CategoryIcon />} title="Content Type" color={FC.indigo[500]} theme={theme} />
            <ToggleButtonGroup orientation="vertical" size="small" exclusive value={mode} onChange={(_, v) => v && setMode(v)} sx={{
              width: '100%', display: 'flex', gap: 0.4,
              '& .MuiToggleButtonGroup-grouped': { border: 'none !important', '&:not(:first-of-type)': { borderRadius: '8px !important', marginLeft: '0 !important' }, '&:first-of-type': { borderRadius: '8px !important' } },
            }}>
              {filterContentTypeConfig.map((ct) => (
                <ToggleButton key={ct.value} value={ct.value} sx={{
                  display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 0.75, py: 0.6, px: 1,
                  borderRadius: '8px !important', border: '1px solid transparent !important', background: '#fff',
                  color: theme.palette.text.secondary, textTransform: 'none', transition: 'all 0.2s ease',
                  position: 'relative', overflow: 'hidden',
                  '&:hover': { background: alpha(ct.bgLight, 0.7), borderColor: `${alpha(ct.color, 0.2)} !important` },
                  '&.Mui-selected': {
                    background: ct.bgGradient, borderColor: `${alpha(ct.color, 0.35)} !important`,
                    boxShadow: `0 1px 4px ${alpha(ct.color, 0.12)}`,
                    '& .ct-label': { color: ct.color, fontWeight: 700 },
                    '&::before': {
                      content: '""', position: 'absolute', left: 0, top: '18%', bottom: '18%',
                      width: '2.5px', borderRadius: '0 2px 2px 0', background: ct.color,
                    },
                  },
                }}>
                  <Box sx={{
                    width: 24, height: 24, borderRadius: '6px', background: alpha(ct.color, 0.08),
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: ct.color,
                    transition: 'all 0.2s ease', flexShrink: 0,
                  }}>
                    {ct.value === 'both' ? (
                      <Box sx={{ display: 'flex', gap: 0.2 }}>
                        <NewspaperIcon sx={{ fontSize: '0.65rem' }} />
                        <EventAvailableIcon sx={{ fontSize: '0.65rem' }} />
                      </Box>
                    ) : React.cloneElement(ct.icon, { sx: { fontSize: '0.85rem' } })}
                  </Box>
                  <Typography className="ct-label" sx={{ fontSize: '0.74rem', fontWeight: 600, color: theme.palette.text.primary, transition: 'all 0.2s ease', lineHeight: 1.2, textAlign: 'left' }}>
                    {ct.label}
                  </Typography>
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </FilterCard>

          <FilterCard accentColor={FC.cyan[400]}>
            <FilterSectionHeader icon={<CalendarMonthIcon />} title="Date Range" color={FC.cyan[600]} theme={theme} count={(dateFrom ? 1 : 0) + (dateTo ? 1 : 0)} />
            <Stack spacing={0.75}>
              <TextField type="date" label="From" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} fullWidth size="small" InputLabelProps={{ shrink: true }} inputProps={{ max: dateTo || new Date().toISOString().split('T')[0] }} sx={dateFieldSx(FC.cyan[500])} />
              <TextField type="date" label="To" value={dateTo} onChange={(e) => setDateTo(e.target.value)} fullWidth size="small" InputLabelProps={{ shrink: true }} inputProps={{ min: dateFrom || undefined, max: new Date().toISOString().split('T')[0] }} sx={dateFieldSx(FC.cyan[500])} />
            </Stack>
          </FilterCard>

          {(mode === "news" || mode === "both" || mode === "intelligence" || mode === "insights") && (
            <FilterCard accentColor={FC.blue[400]}>
              <FilterSectionHeader icon={<NewspaperIcon />} title="News & Intelligence Filters" color={FC.blue[600]} theme={theme} count={newsFilterCount} />
              <Stack spacing={0.75}>
                <FilterDropdown label="Country" values={options.country || []} selected={filters.country || []} setSelected={(v) => setFilters(f => ({ ...f, country: v }))} accentColor={FC.blue[500]} />
                <FilterDropdown label="Organisation" values={options.org || []} selected={filters.org || []} setSelected={(v) => setFilters(f => ({ ...f, org: v }))} accentColor={FC.blue[500]} />
                <FilterDropdown label="NSAG" values={options.nsag || []} selected={filters.nsag || []} setSelected={(v) => setFilters(f => ({ ...f, nsag: v }))} accentColor={FC.blue[500]} />
              </Stack>
            </FilterCard>
          )}

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

// EventDetailPanel Component
function EventDetailPanel({ item, onClose }) {
  const theme = useTheme();
  if (!item) return null;

  const renderField = (label, value) => {
    if (!value) return null;
    const displayValue = Array.isArray(value) ? value.join(', ') : value;
    return (
      <Box key={label} sx={{ display: 'flex', gap: 1.5, mb: 1.5, alignItems: 'flex-start' }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: theme.palette.text.primary, minWidth: 130, flexShrink: 0 }}>
          {label}:
        </Typography>
        <Typography variant="body2" sx={{ color: theme.palette.text.secondary, lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
          {displayValue}
        </Typography>
      </Box>
    );
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: theme.palette.text.primary, lineHeight: 1.3 }}>
        {item.title}
      </Typography>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: 3 }}>
        <Chip
          icon={<CalendarMonthIcon sx={{ fontSize: 16 }} />}
          label={item.date ? new Date(item.date).toLocaleDateString('en-US', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
          }) : 'Date N/A'}
          sx={{ fontWeight: 600, bgcolor: alpha(theme.palette.primary.main, 0.08), color: theme.palette.primary.main }}
        />
        {item.eventcategory && <Chip label={item.eventcategory} variant="outlined" sx={{ fontWeight: 600 }} />}
        {item.eventlocation && <Chip label={item.eventlocation} variant="outlined" sx={{ fontWeight: 600 }} />}
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mb: 3 }}>
        {renderField('Platforms', item.platforms)}
        {renderField('Actor Label', item.actorlabel)}
        {renderField('Actor Nation', item.actornation)}
        {renderField('Actor Type', item.actortype)}
      </Box>

      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: theme.palette.text.primary, mb: 1 }}>
        Description
      </Typography>
      <Typography variant="body1" sx={{ lineHeight: 1.7, color: theme.palette.text.secondary, whiteSpace: 'pre-wrap' }}>
        {item.summary || item.description || 'No additional details available.'}
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, mt: 3 }}>
        <Button variant="outlined" onClick={onClose}>Close</Button>
      </Box>
    </Box>
  );
}

// ContentCard Component
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

  const noImageTypes = ['events', 'intelligence briefings', 'equipment', 'military-groups', 'ships', 'organisation', 'installations', 'non-state-group'];

  return (
    <Card
      elevation={isSelected ? 4 : 2}
      onClick={handleCardClick}
      sx={{
        height: "100%",
        minHeight: noImageTypes.includes(item.index) ? 320 : 'auto',
        borderRadius: 3,
        transition: 'all 0.3s ease-in-out',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        transform: isSelected ? 'translateY(-4px)' : 'none',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: theme.shadows[12],
          '& img': { transform: 'scale(1.05)' }
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
      {!noImageTypes.includes(item.index) && (
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
            <CalendarMonthIcon fontSize="small" sx={{ color: theme.palette.text.secondary }} />
            <Typography variant="caption" color="text.secondary">
              {new Date(item.date).toLocaleDateString('en-US', {
                year: 'numeric', month: 'short', day: 'numeric'
              })}
            </Typography>
            <Chip
              size="small"
              label={item.index.toUpperCase()}
              color={item.index === 'news' ? 'primary' : item.index === 'events' ? 'secondary' : 'default'}
              variant="outlined"
              sx={{ ml: 'auto', fontSize: '0.7rem' }}
            />
          </Box>
          <Typography variant="h6" sx={{
            fontWeight: 600, lineHeight: 1.3,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
            overflow: 'hidden', color: theme.palette.text.primary
          }}>
            {item.title}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: noImageTypes.includes(item.index) ? 6 : 3,
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
      case 'equipment':
      case 'ships':
        return {
          color: '#4caf50',
          gradient: `linear-gradient(135deg, ${alpha('#4caf50', 0.3)} 0%, ${alpha('#4caf50', 0.1)} 100%)`,
          icon: <HardwareIcon sx={{ color: '#4caf50' }} />,
          label: 'Equipment'
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
  const [mode, setMode] = useState(initialMode || "both");
  const [contentTab, setContentTab] = useState('news');
  const [filters, setFilters] = useState({
    country: [], org: [], nsag: [],
    eventcountry: [], eventcategory: [], eventlocation: [],
    platforms: [], actorlabel: [], actornation: [], actortype: []
  });
  const [view, setView] = useState("grid");
  const [options, setOptions] = useState({});
  const [items, setItems] = useState([]);
  const [allRecords, setAllRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [lastDocId, setLastDocId] = useState("");
  const [hasNextPage, setHasNextPage] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [isViewingArticle, setIsViewingArticle] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);

  const sidebarWidth = 280;
  const collapsedWidth = 60;
  const pageSize = 20;

  const stateKey = `search_state_${query}`;

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

  useEffect(() => {
    const stateToSave = {
      mode, filters, view, dateFrom, dateTo, allRecords, lastDocId, hasNextPage, totalRecords, options,
      scrollPosition: window.scrollY, sidebarOpen, timestamp: Date.now()
    };
    try { sessionStorage.setItem(stateKey, JSON.stringify(stateToSave)); } catch (error) { console.warn('Failed to save search state:', error); }
  }, [mode, filters, view, dateFrom, dateTo, allRecords, lastDocId, hasNextPage, totalRecords, options, sidebarOpen, stateKey]);

  useEffect(() => {
    try {
      const savedState = sessionStorage.getItem(stateKey);
      if (savedState) {
        const state = JSON.parse(savedState);
        if (!initialMode) setMode(state.mode || "both");
        setFilters(state.filters || {
          country: [], org: [], nsag: [], eventcountry: [], eventcategory: [], eventlocation: [],
          platforms: [], actorlabel: [], actornation: [], actortype: []
        });
        setView(state.view || "grid");
        setDateFrom(state.dateFrom || "");
        setDateTo(state.dateTo || "");
        setSidebarOpen(state.sidebarOpen !== undefined ? state.sidebarOpen : true);
        setOptions(state.options || {});

        const returnState = sessionStorage.getItem('search_page_return_state');
        if (returnState && state.scrollPosition) {
          setTimeout(() => {
            window.scrollTo({ top: state.scrollPosition, behavior: 'smooth' });
            sessionStorage.removeItem('search_page_return_state');
          }, 1000);
        }
      } else {
        if (!initialMode) setMode("both");
      }
    } catch (error) { console.warn('Failed to restore search state:', error); if (!initialMode) setMode("both"); }
  }, [stateKey, initialMode]);

  const clearAll = () => {
    setFilters({
      country: [], org: [], nsag: [], eventcountry: [], eventcategory: [], eventlocation: [],
      platforms: [], actorlabel: [], actornation: [], actortype: []
    });
    setDateFrom("");
    setDateTo("");
  };

  const handleArticleClick = (item) => {
    track('result_opened', { mode, kind: item?.type || item?.category || undefined });
    setSelectedArticle(item);
    setIsViewingArticle(true);
  };

  const handleCloseModal = () => {
    setIsViewingArticle(false);
    setSelectedArticle(null);
  };

  const handleTabChange = (event, newValue) => {
    setContentTab(newValue);
    setFilters({
      country: [], org: [], nsag: [],
      eventcountry: [], eventcategory: [], eventlocation: [],
      platforms: [], actorlabel: [], actornation: [], actortype: []
    });
  };

  useEffect(() => {
    if (!query) return;
    const fetchData = async () => {
      const startedAt = Date.now();
      setLoading(true);
      setAllRecords([]);
      setItems([]);
      setLastDocId("");
      setHasNextPage(false);

      try {
        let response;
        const commonParams = { keywords: query, fromdate: dateFrom, todate: dateTo, size: pageSize, lastdocid: "", req_id: `search-${Date.now()}` };

        switch (mode) {
          case "news":
              response = await fetchNewsData({ ...commonParams, page: 'news', filters: { country: filters.country, org: filters.org, nsag: filters.nsag } });
            break;
          case "insights":
           response = await fetchProfilesData({ ...commonParams, page: 'profile', filters: { country: filters.country, org: filters.org, nsag: filters.nsag } });
           break;
          case "intelligence":
            response = await fetchIntelligenceData({ ...commonParams, filters: { country: filters.country, org: filters.org, nsag: filters.nsag } });
            break;
          case "events":
            response = await fetchEventsData({ ...commonParams, filters: { eventcountry: filters.eventcountry, eventcategory: filters.eventcategory, eventlocation: filters.eventlocation, platforms: filters.platforms, actorlabel: filters.actorlabel, actornation: filters.actornation, actortype: filters.actortype } });
            break;
          case "assets":
            response = await fetchEquipmentData({
              ...commonParams,
              size: 100 // Load more records for assets to include all types
            });
            break;
          case "both":
            response = await fetchCombinedData({ ...commonParams, newsFilters: { country: filters.country, org: filters.org, nsag: filters.nsag }, eventFilters: { eventcountry: filters.eventcountry, eventcategory: filters.eventcategory, eventlocation: filters.eventlocation, platforms: filters.platforms, actorlabel: filters.actorlabel, actornation: filters.actornation, actortype: filters.actortype } });
            break;
          default: return;
        }

        setAllRecords(response.records || []);
        setItems(response.records || []);
        setOptions(response);
        setLastDocId(response.hasMore && response.records?.length > 0 ? (response.lastDocId || "") : "");
        setHasNextPage(response.hasMore || false);
        setTotalRecords(response.total || 0);
        track('search_completed', { mode, results: response.total || 0, ms: Date.now() - startedAt });
      } catch (error) { track('search_failed', { mode, ms: Date.now() - startedAt, errorCode: error?.status || error?.name || 'Error' }); console.error('Error fetching data:', error); }
      finally { setLoading(false); }
    };
    fetchData();
  }, [query, filters, mode, dateFrom, dateTo, contentTab]);

  const displayedItems = useMemo(() => allRecords, [allRecords]);

  const loadMoreData = async () => {
    if (!hasNextPage || loadingMore) return;
    setLoadingMore(true);
    try {
      let response;
      const commonParams = { keywords: query, fromdate: dateFrom, todate: dateTo, size: pageSize, lastdocid: lastDocId, req_id: `search-${Date.now()}` };

      switch (mode) {
        case "news":
            response = await fetchNewsData({ ...commonParams, page: 'news', filters: { country: filters.country, org: filters.org, nsag: filters.nsag } });
          break;
          case "insights":
            response = await fetchProfilesData({ ...commonParams, page: 'profile', filters: { country: filters.country, org: filters.org ,nsag: filters.nsag } });
          break;
        case "intelligence":
          response = await fetchIntelligenceData({ ...commonParams, filters: { country: filters.country, org: filters.org, nsag: filters.nsag } });
          break;
        case "events":
          response = await fetchEventsData({ ...commonParams, filters: { eventcountry: filters.eventcountry, eventcategory: filters.eventcategory, eventlocation: filters.eventlocation, platforms: filters.platforms, actorlabel: filters.actorlabel, actornation: filters.actornation, actortype: filters.actortype } });
          break;
        case "assets":
          response = await fetchEquipmentData({
            ...commonParams
          });
          break;
        case "both":
          response = await fetchCombinedData({ ...commonParams, newsFilters: { country: filters.country, org: filters.org, nsag: filters.nsag }, eventFilters: { eventcountry: filters.eventcountry, eventcategory: filters.eventcategory, eventlocation: filters.eventlocation, platforms: filters.platforms, actorlabel: filters.actorlabel, actornation: filters.actornation, actortype: filters.actortype } });
          break;
        default: return;
      }

      setAllRecords(prev => [...prev, ...(response.records || [])]);
      setLastDocId(response.lastDocId || "");
      setHasNextPage(response.hasMore || false);
    } catch (error) { console.error('Error loading more data:', error); }
    finally { setLoadingMore(false); }
  };

  useEffect(() => {
    if (!hasNextPage || loadingMore) return;
    let isScrolling = false;
    const handleScroll = () => {
      if (isScrolling || loadingMore || !hasNextPage) return;
      const scrollThreshold = 400;
      const windowHeight = window.innerHeight;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const documentHeight = document.documentElement.scrollHeight;
      const distanceFromBottom = documentHeight - (scrollTop + windowHeight);
      if (distanceFromBottom <= scrollThreshold) {
        isScrolling = true;
        loadMoreData().finally(() => setTimeout(() => { isScrolling = false; }, 1000));
      }
    };
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) { requestAnimationFrame(() => { handleScroll(); ticking = false; }); ticking = true; }
    };
    window.addEventListener('scroll', throttledScroll, { passive: true });
    return () => window.removeEventListener('scroll', throttledScroll);
  }, [hasNextPage, loadingMore, lastDocId, query, mode, filters, dateFrom, dateTo]);

  // News/Insights Tab Component
  const NewsInsightsTabs = () => (
    <Box sx={{ mb: 2, borderBottom: 0.5, borderColor: 'divider' }}>
    </Box>
  );

  const filterBarProps = { mode, setMode, filters, setFilters, clearAll, options, dateFrom, setDateFrom, dateTo, setDateTo };

  return (
    <>
    <Box sx={{ display: "flex", minHeight: "calc(100vh - 100px)" }}>
      {/* Desktop Sidebar */}
      <Box sx={{
        display: { xs: 'none', md: 'flex' }, flexShrink: 0, width: sidebarOpen ? sidebarWidth : collapsedWidth,
        bgcolor: '#fff', borderRight: `1px solid ${alpha(FC.indigo[200], 0.25)}`, overflow: 'hidden',
        height: 'calc(100vh - 100px)', position: 'sticky', top: 0, flexDirection: 'column',
        transition: theme.transitions.create(['width'], { easing: theme.transitions.easing.easeInOut, duration: 250 }),
        boxShadow: `1px 0 12px ${alpha(FC.indigo[500], 0.04)}, 4px 0 24px ${alpha(FC.blue[500], 0.03)}`,
      }}>
        {sidebarOpen && <FilterBar {...filterBarProps} onCollapse={() => setSidebarOpen(false)} />}
        {!sidebarOpen && (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
            <Box sx={{
              width: '100%', display: 'flex', justifyContent: 'center', py: 1,
              background: `linear-gradient(135deg, ${FC.indigo[50]} 0%, ${FC.blue[50]} 100%)`,
              borderBottom: `1px solid ${FC.indigo[100]}`, position: 'relative',
              '&::after': { content: '""', position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg, ${FC.indigo[400]}, ${FC.blue[400]}, ${FC.cyan[400]})`, opacity: 0.5 },
            }}>
              <Tooltip title="Expand filters" arrow placement="right">
                <IconButton size="small" onClick={() => setSidebarOpen(true)} sx={{
                  width: 34, height: 34, borderRadius: '8px', background: `linear-gradient(135deg, ${FC.indigo[500]}, ${FC.blue[500]})`,
                  color: '#fff', boxShadow: `0 2px 8px ${alpha(FC.indigo[500], 0.3)}`, transition: 'all 0.2s ease',
                  '&:hover': { boxShadow: `0 4px 12px ${alpha(FC.indigo[500], 0.4)}`, transform: 'scale(1.05)' },
                }}>
                  <ChevronRightIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </Tooltip>
            </Box>
            <Stack spacing={1} sx={{ pt: 1.5, alignItems: 'center' }}>
              {contentTypeConfig.map((ct) => (
                <Tooltip key={ct.value} title={ct.label} arrow placement="right">
                  <IconButton size="small" onClick={() => { setMode(ct.value); setSidebarOpen(true); }} sx={{
                    width: 34, height: 34, borderRadius: '8px',
                    bgcolor: mode === ct.value ? alpha(ct.color, 0.12) : alpha(ct.color, 0.04),
                    color: ct.color, border: `1px solid ${mode === ct.value ? alpha(ct.color, 0.3) : 'transparent'}`,
                    transition: 'all 0.2s ease', '&:hover': { bgcolor: alpha(ct.color, 0.15), transform: 'scale(1.08)', boxShadow: `0 2px 8px ${alpha(ct.color, 0.2)}` },
                  }}>
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
      <Drawer anchor="left" open={mobileDrawerOpen} onClose={() => setMobileDrawerOpen(false)} sx={{
        display: { md: 'none' }, '& .MuiDrawer-paper': { width: sidebarWidth, bgcolor: '#fff', borderRight: `1px solid ${alpha(FC.indigo[200], 0.25)}`, boxShadow: `4px 0 24px ${alpha(FC.indigo[500], 0.08)}` },
      }}>
        <FilterBar {...filterBarProps} onCollapse={() => setMobileDrawerOpen(false)} />
      </Drawer>

      {/* Mobile Filter FAB */}
      <IconButton onClick={() => setMobileDrawerOpen(true)} sx={{
        display: { md: 'none' }, position: 'fixed', bottom: 20, left: 20, width: 44, height: 44, borderRadius: '12px',
        background: `linear-gradient(135deg, ${FC.indigo[600]} 0%, ${FC.blue[600]} 100%)`, color: '#fff', zIndex: 1000,
        boxShadow: `0 4px 16px ${alpha(FC.indigo[500], 0.35)}, 0 2px 8px ${alpha(FC.blue[500], 0.2)}`, transition: 'all 0.2s ease',
        '&:hover': { background: `linear-gradient(135deg, ${FC.indigo[700]} 0%, ${FC.blue[700]} 100%)`, transform: 'translateY(-2px)', boxShadow: `0 6px 20px ${alpha(FC.indigo[500], 0.4)}, 0 4px 12px ${alpha(FC.blue[500], 0.25)}` },
      }}>
        <FilterListIcon sx={{ fontSize: 20 }} />
      </IconButton>

      {/* Content Area */}
      <Box sx={{ flexGrow: 1, bgcolor: theme.palette.background.default, transition: theme.transitions.create(['margin'], { easing: theme.transitions.easing.sharp, duration: theme.transitions.duration.leavingScreen }) }}>
        <Container maxWidth={false} sx={{ p: 0 }}>
          {/* Search Results Header */}
          <Box sx={{ mb: 2, px: 2.5, py: 1.5, background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.primary.main, 0.04)} 100%)`, borderRadius: 3, border: `1px solid ${alpha(theme.palette.divider, 0.08)}`, backdropFilter: 'blur(8px)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1, minWidth: 0 }}>
              <Box sx={{ width: 36, height: 36, borderRadius: '10px', background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.12)} 0%, ${alpha(theme.palette.primary.main, 0.06)} 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <SearchIcon sx={{ fontSize: '1.2rem', color: theme.palette.primary.main }} />
              </Box>
              <Box sx={{ minWidth: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, flexWrap: 'wrap' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: theme.palette.text.primary, lineHeight: 1.3, whiteSpace: 'nowrap' }}>Search Results</Typography>
                  {query && <Chip label={query} size="small" color="primary" variant="outlined" sx={{ height: 22, fontSize: '0.75rem', fontWeight: 600, borderRadius: '6px', maxWidth: 200, '& .MuiChip-label': { px: 1 } }} />}
                </Box>
                <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontWeight: 500, lineHeight: 1.2 }}>
                  {allRecords.length > 0 ? <><Box component="span" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>{allRecords.length}</Box> of {totalRecords} records</> : totalRecords > 0 ? `0 of ${totalRecords} records` : 'No records found'}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center' }}>
              <ToggleButtonGroup size="small" exclusive value={view} onChange={(_, v) => v && setView(v)} sx={{
                bgcolor: alpha(theme.palette.background.paper, 0.6), borderRadius: '10px', border: `1px solid ${alpha(theme.palette.divider, 0.1)}`, overflow: 'hidden',
                '& .MuiToggleButtonGroup-grouped': { border: 'none', '&:not(:first-of-type)': { borderLeft: `1px solid ${alpha(theme.palette.divider, 0.1)}`, borderRadius: 0 }, '&:first-of-type': { borderRadius: 0 } }
              }}>
                <ToggleButton value="grid" sx={{ px: 1.5, py: 0.5, gap: 0.5, textTransform: 'none', fontSize: '0.8rem', fontWeight: 600, color: theme.palette.text.secondary, transition: 'all 0.2s ease', '&.Mui-selected': { bgcolor: theme.palette.primary.main, color: 'white', boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.3)}`, '&:hover': { bgcolor: theme.palette.primary.dark } } }}>
                  <ViewModuleIcon sx={{ fontSize: '1rem' }} /> Grid
                </ToggleButton>
                <ToggleButton value="list" sx={{ px: 1.5, py: 0.5, gap: 0.5, textTransform: 'none', fontSize: '0.8rem', fontWeight: 600, color: theme.palette.text.secondary, transition: 'all 0.2s ease', '&.Mui-selected': { bgcolor: theme.palette.primary.main, color: 'white', boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.3)}`, '&:hover': { bgcolor: theme.palette.primary.dark } } }}>
                  <ViewListIcon sx={{ fontSize: '1rem' }} /> List
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
          </Box>

          {/* News/Insights Tabs (only show when mode is 'news') */}
          {mode === 'news' && <NewsInsightsTabs />}

          {/* Active Filters Display */}
          {(Object.values(filters).some(arr => arr && arr.length > 0) || dateFrom || dateTo) && (
            <Box sx={{ mb: 3, p: 2, bgcolor: alpha(theme.palette.background.paper, 0.8), borderRadius: 2, boxShadow: theme.shadows[1] }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>Active Filters</Typography>
                <Button startIcon={<ClearAllIcon />} size="small" variant="outlined" color="error" onClick={clearAll} sx={{ borderRadius: 1.5, textTransform: 'none', fontWeight: 600, fontSize: '0.75rem', py: 0.5, px: 1.5, '&:hover': { bgcolor: alpha(theme.palette.error.main, 0.1) } }}>Clear All</Button>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {Object.entries(filters).flatMap(([key, values]) => (values || []).map(val => (
                  <Chip key={`${key}-${val}`} label={`${key}: ${val}`} size="small" onDelete={() => setFilters(f => ({ ...f, [key]: (f[key] || []).filter(x => x !== val) }))} color={key.startsWith('event') ? 'secondary' : 'primary'} variant="filled" />
                )))}
                {(dateFrom || dateTo) && <Chip label={`${dateFrom || '...'} - ${dateTo || '...'}`} size="small" onDelete={() => { setDateFrom(""); setDateTo(""); }} color="info" variant="filled" />}
              </Box>
            </Box>
          )}

          {/* Content Display */}
          {view === "grid" ? (
            <Grid container spacing={3}>
              {loading && allRecords.length === 0 ?
                Array.from({ length: pageSize }).map((_, i) => <Grid item xs={12} sm={6} lg={4} key={i}><Skeleton variant="rectangular" height={320} sx={{ borderRadius: 3 }} /></Grid>) :
                displayedItems.map((item) => <Grid item xs={12} sm={6} lg={4} key={item.id}><ContentCard item={item} view={view} onArticleClick={handleArticleClick} selectedItemId={selectedArticle?.id} isViewingArticle={isViewingArticle} /></Grid>)
              }
            </Grid>
          ) : (
            <Stack spacing={3}>
              {loading && allRecords.length === 0 ?
                Array.from({ length: pageSize }).map((_, i) => <Skeleton key={i} variant="rectangular" height={200} sx={{ borderRadius: 3 }} />) :
                displayedItems.map((item) => <ContentCard key={item.id} item={item} view={view} onArticleClick={handleArticleClick} selectedItemId={selectedArticle?.id} isViewingArticle={isViewingArticle} />)
              }
            </Stack>
          )}

          {/* Loading More Indicator */}
          {loadingMore && (
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 3 }}>
                <Box sx={{ width: 40, height: 40, border: '4px solid #f0f0f0', borderTop: '4px solid #1976d2', borderRadius: '50%', animation: 'spin 1s linear infinite', '@keyframes spin': { '0%': { transform: 'rotate(0deg)' }, '100%': { transform: 'rotate(360deg)' } } }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>Loading more results...</Typography>
              </Box>
            </Box>
          )}
          {hasNextPage && !loadingMore && (
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', py: 3 }}>
              <Button variant="contained" size="large" onClick={() => loadMoreData()} sx={{ borderRadius: 2, px: 4, py: 1.5, fontWeight: 600, fontSize: '1rem' }}>Load More</Button>
            </Box>
          )}
          {!hasNextPage && allRecords.length > 0 && (
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', py: 3 }}>
              <Typography variant="body1" sx={{ fontWeight: 600, color: theme.palette.text.secondary }}>All {totalRecords} records loaded.</Typography>
            </Box>
          )}
        </Container>
      </Box>

      <Backdrop open={loading} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1, bgcolor: alpha(theme.palette.common.black, 0.7), backdropFilter: 'blur(8px)' }}>
        <Fade in={loading}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, p: 4, bgcolor: alpha(theme.palette.background.paper, 0.9), borderRadius: 3, boxShadow: theme.shadows[24] }}>
            <CircularProgress size={60} thickness={4} sx={{ color: theme.palette.primary.main }} />
            <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.text.primary, textAlign: 'center' }}>Loading search results...</Typography>
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary, textAlign: 'center' }}>Please wait while we fetch your data</Typography>
          </Box>
        </Fade>
      </Backdrop>
    </Box>

    <DetailModal open={isViewingArticle} item={selectedArticle} onClose={handleCloseModal} />
    </>
  );
}

// Main Search Page Component
export default function SearchPage() {
  const location = useLocation();
  const [query, setQuery] = useState("");
  const [initialMode, setInitialMode] = useState(null);

  useEffect(() => { document.title = "SearchPage"; }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchQuery = urlParams.get('q');
    const modeParam = urlParams.get('mode');

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
              if (timestamp > mostRecentTime) { mostRecentTime = timestamp; mostRecentKey = key; }
            } catch (e) { console.warn('SearchPage: Invalid state in key:', key, e); }
          });
          if (mostRecentKey) {
            const savedQuery = mostRecentKey.replace('search_state_', '');
            if (savedQuery && savedQuery !== 'undefined' && savedQuery !== 'null') setQuery(savedQuery);
          }
        }
      } catch (error) { console.warn('Failed to restore search state:', error); }
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
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>Search News & Events</Typography>
            <Typography variant="body1" color="text.secondary">Use the search functionality in the header to find relevant news articles, events, and intelligence briefings.</Typography>
          </Paper>
        </Container>
      )}
    </Box>
  );
}
