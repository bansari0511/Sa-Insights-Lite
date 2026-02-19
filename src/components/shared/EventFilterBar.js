import React from 'react';
import {
  Box, Button, TextField, Autocomplete, Chip,
  MenuItem, Typography, CircularProgress, InputAdornment,
  IconButton, Tooltip, Grid,
} from '@mui/material';
import {
  Search as SearchIcon,
  CalendarToday as CalendarTodayIcon,
  Public as PublicIcon,
  Category as CategoryIcon,
  TuneRounded as TuneIcon,
  RestartAlt as ResetIcon,
  KeyboardArrowDown as ArrowDownIcon,
} from '@mui/icons-material';

/* ── Color tokens (indigo / blue / cyan) ── */
const C = {
  indigo: { 50: '#EEF2FF', 100: '#E0E7FF', 200: '#C7D2FE', 300: '#A5B4FC', 400: '#818CF8', 500: '#6366F1', 600: '#4F46E5', 700: '#4338CA', 800: '#3730A3', 900: '#312E81' },
  blue:   { 50: '#EFF6FF', 100: '#DBEAFE', 200: '#BFDBFE', 300: '#93C5FD', 400: '#60A5FA', 500: '#3B82F6', 600: '#2563EB', 700: '#1D4ED8', 800: '#1E40AF', 900: '#1E3A8A' },
  cyan:   { 50: '#ECFEFF', 100: '#CFFAFE', 200: '#A5F3FC', 300: '#67E8F9', 400: '#22D3EE', 500: '#06B6D4', 600: '#0891B2', 700: '#0E7490', 800: '#155E75', 900: '#164E63' },
  slate:  { 50: '#F8FAFC', 100: '#F1F5F9', 200: '#E2E8F0', 300: '#CBD5E1', 400: '#94A3B8', 500: '#64748B', 600: '#475569', 700: '#334155', 800: '#1E293B', 900: '#0F172A' },
};

/* ── Input field styling factory ── */
const fieldSx = (accentLight, accentMain, accentRing) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    bgcolor: accentLight,
    fontSize: '0.84rem',
    transition: 'all 0.2s ease',
    '& fieldset': { borderColor: 'transparent' },
    '&:hover': {
      bgcolor: accentRing,
      '& fieldset': { borderColor: `${accentMain}40` },
    },
    '&.Mui-focused': {
      bgcolor: '#fff',
      boxShadow: `0 0 0 2.5px ${accentMain}18, 0 1px 3px ${accentMain}12`,
      '& fieldset': { borderColor: accentMain, borderWidth: 1.5 },
    },
  },
  '& .MuiInputLabel-root': { fontSize: '0.8rem', fontWeight: 500 },
});

/* ── Field label ── */
const FieldLabel = ({ icon, label, color }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.75 }}>
    {React.cloneElement(icon, { sx: { fontSize: 13, color } })}
    <Typography
      variant="caption"
      sx={{
        fontWeight: 700,
        color: C.slate[600],
        fontSize: '0.65rem',
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
      }}
    >
      {label}
    </Typography>
  </Box>
);

/**
 * EventFilterBar — Modern filter panel using indigo, blue & cyan palette.
 */
export default function EventFilterBar({
  countries,
  selectedCountries,
  setSelectedCountries,
  categories,
  selectedCategories,
  setSelectedCategories,
  getCategoryConfig,
  keyword,
  setKeyword,
  dateFilter,
  setDateFilter,
  customFrom,
  setCustomFrom,
  customTo,
  setCustomTo,
  onSubmit,
  isLoading,
  hasResults = true,
}) {
  const activeCount =
    selectedCountries.length +
    selectedCategories.length +
    (keyword ? 1 : 0) +
    (dateFilter !== '90days' ? 1 : 0);

  const handleClearAll = () => {
    setSelectedCountries([]);
    setSelectedCategories([]);
    setKeyword('');
    setDateFilter('90days');
  };

  return (
    <Box
      sx={{
        borderRadius: '12px',
        overflow: 'hidden',
        border: `1px solid ${C.indigo[200]}50`,
        bgcolor: '#fff',
        boxShadow: `0 1px 3px ${C.indigo[500]}08, 0 4px 20px ${C.blue[500]}06`,
        position: 'relative',
        // Subtle left accent bar
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0, left: 0, bottom: 0,
          width: '3px',
          background: `linear-gradient(180deg, ${C.indigo[400]}, ${C.blue[400]}, ${C.cyan[400]})`,
          borderRadius: '12px 0 0 12px',
        },
      }}
    >
      {/* ─── Header ─── */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2.5,
          py: 1.25,
          background: `linear-gradient(135deg, ${C.indigo[50]} 0%, ${C.blue[50]} 50%, ${C.cyan[50]} 100%)`,
          borderBottom: `1px solid ${C.indigo[100]}`,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
          <Box
            sx={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 30, height: 30, borderRadius: '8px',
              background: `linear-gradient(135deg, ${C.indigo[500]}, ${C.blue[500]})`,
              boxShadow: `0 2px 8px ${C.indigo[500]}30`,
            }}
          >
            <TuneIcon sx={{ fontSize: 15, color: '#fff' }} />
          </Box>
          <Typography sx={{ fontWeight: 700, fontSize: '0.88rem', color: C.indigo[800], letterSpacing: '-0.01em' }}>
            Filters
          </Typography>
          {activeCount > 0 && (
            <Chip
              label={`${activeCount} applied`}
              size="small"
              sx={{
                height: 22,
                bgcolor: C.indigo[100],
                color: C.indigo[700],
                fontWeight: 700,
                fontSize: '0.65rem',
                border: `1px solid ${C.indigo[200]}`,
                '& .MuiChip-label': { px: 1 },
              }}
            />
          )}
        </Box>
        {activeCount > 0 && (
          <Tooltip title="Clear all filters" arrow>
            <IconButton
              size="small"
              onClick={handleClearAll}
              sx={{
                width: 28, height: 28, borderRadius: '7px',
                color: C.slate[400],
                transition: 'all 0.2s ease',
                '&:hover': { color: '#EF4444', bgcolor: '#FEF2F2' },
              }}
            >
              <ResetIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      {/* ─── Filter grid ─── */}
      <Box sx={{ px: 2.5, py: 2 }}>
        <Grid container spacing={2} alignItems="flex-end">

          {/* ── Country ── */}
          <Grid item xs={12} sm={6} md={3}>
            <FieldLabel icon={<PublicIcon />} label="Country" color={C.blue[500]} />
            <Autocomplete
              multiple
              size="small"
              options={countries}
              value={selectedCountries}
              onChange={(e, v) => setSelectedCountries(v)}
              limitTags={1}
              disableCloseOnSelect
              popupIcon={<ArrowDownIcon sx={{ fontSize: 18, color: C.blue[300] }} />}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => {
                  const { key, ...tagProps } = getTagProps({ index });
                  return (
                    <Chip
                      key={key}
                      label={option}
                      {...tagProps}
                      size="small"
                      sx={{
                        height: 22, fontSize: '0.68rem', fontWeight: 600, borderRadius: '5px',
                        bgcolor: C.blue[50],
                        color: C.blue[700],
                        border: `1px solid ${C.blue[200]}`,
                        '& .MuiChip-deleteIcon': {
                          fontSize: 14, color: C.blue[400],
                          '&:hover': { color: '#EF4444' },
                        },
                      }}
                    />
                  );
                })
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Select countries..."
                  sx={fieldSx(C.blue[50], C.blue[500], C.blue[100])}
                />
              )}
            />
          </Grid>

          {/* ── Event Category ── */}
          <Grid item xs={12} sm={6} md={3}>
            <FieldLabel icon={<CategoryIcon />} label="Event Category" color={C.indigo[500]} />
            <Autocomplete
              multiple
              size="small"
              options={categories}
              value={selectedCategories}
              onChange={(e, v) => setSelectedCategories(v)}
              limitTags={1}
              disableCloseOnSelect
              popupIcon={<ArrowDownIcon sx={{ fontSize: 18, color: C.indigo[300] }} />}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => {
                  const { key, ...tagProps } = getTagProps({ index });
                  const config = getCategoryConfig(option);
                  return (
                    <Chip
                      key={key}
                      label={`${config.icon} ${config.name}`}
                      {...tagProps}
                      size="small"
                      sx={{
                        height: 22, fontSize: '0.68rem', fontWeight: 600, borderRadius: '5px',
                        bgcolor: `${config.color}0D`,
                        color: config.color,
                        border: `1px solid ${config.color}22`,
                        '& .MuiChip-deleteIcon': {
                          fontSize: 14, color: `${config.color}90`,
                          '&:hover': { color: '#EF4444' },
                        },
                      }}
                    />
                  );
                })
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Select categories..."
                  sx={fieldSx(C.indigo[50], C.indigo[500], C.indigo[100])}
                />
              )}
              renderOption={(props, option) => {
                const { key, ...restProps } = props;
                const config = getCategoryConfig(option);
                return (
                  <Box component="li" key={key} {...restProps} sx={{ display: 'flex', gap: 1, alignItems: 'center', py: 0.5 }}>
                    <span style={{ fontSize: 16 }}>{config.icon}</span>
                    <Typography sx={{ color: config.color, fontWeight: 600, fontSize: '0.84rem' }}>
                      {config.name}
                    </Typography>
                  </Box>
                );
              }}
            />
          </Grid>

          {/* ── Keyword ── */}
          <Grid item xs={12} sm={6} md={2}>
            <FieldLabel icon={<SearchIcon />} label="Keyword" color={C.cyan[600]} />
            <TextField
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Search events..."
              size="small"
              fullWidth
              sx={fieldSx(C.cyan[50], C.cyan[500], C.cyan[100])}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ fontSize: 16, color: C.cyan[400] }} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          {/* ── Date Range ── */}
          <Grid item xs={12} sm={6} md={2}>
            <FieldLabel icon={<CalendarTodayIcon />} label="Date Range" color={C.blue[500]} />
            <TextField
              select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              size="small"
              fullWidth
              sx={fieldSx(C.blue[50], C.blue[500], C.blue[100])}
            >
              <MenuItem value="today">Today</MenuItem>
              <MenuItem value="2days">2 Days</MenuItem>
              <MenuItem value="3days">3 Days</MenuItem>
              <MenuItem value="7days">7 Days</MenuItem>
              <MenuItem value="30days">30 Days</MenuItem>
              <MenuItem value="90days">90 Days</MenuItem>
              <MenuItem value="custom">Custom Range</MenuItem>
            </TextField>
          </Grid>

          {/* ── Search ── */}
          <Grid item xs={12} md={2}>
            <Box sx={{ display: 'flex', gap: 1, justifyContent: { xs: 'flex-start', md: 'flex-end' }, alignItems: 'flex-end', height: '100%' }}>
              {activeCount > 0 && (
                <Tooltip title="Clear all" arrow>
                  <IconButton
                    size="small"
                    onClick={handleClearAll}
                    sx={{
                      width: 36, height: 36, borderRadius: '8px',
                      bgcolor: '#FEF2F2',
                      color: '#EF4444',
                      border: '1px solid #FECACA',
                      display: { xs: 'none', md: 'flex' },
                      '&:hover': { bgcolor: '#FEE2E2' },
                    }}
                  >
                    <ResetIcon sx={{ fontSize: 17 }} />
                  </IconButton>
                </Tooltip>
              )}
              <Button
                variant="contained"
                onClick={onSubmit}
                disabled={isLoading}
                disableElevation
                fullWidth
                sx={{
                  background: `linear-gradient(135deg, ${C.indigo[600]} 0%, ${C.blue[600]} 100%)`,
                  color: '#fff',
                  fontWeight: 700,
                  py: 0.95,
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontSize: '0.84rem',
                  maxWidth: { md: 130 },
                  boxShadow: `0 2px 8px ${C.indigo[500]}30, 0 4px 12px ${C.blue[500]}20`,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    background: `linear-gradient(135deg, ${C.indigo[700]} 0%, ${C.blue[700]} 100%)`,
                    boxShadow: `0 4px 16px ${C.indigo[500]}40, 0 6px 20px ${C.blue[500]}30`,
                    transform: 'translateY(-1px)',
                  },
                  '&:active': { transform: 'translateY(0)' },
                  '&:disabled': {
                    background: C.slate[200],
                    color: C.slate[400],
                    boxShadow: 'none',
                  },
                }}
                startIcon={
                  isLoading && !hasResults
                    ? <CircularProgress size={16} color="inherit" />
                    : <SearchIcon sx={{ fontSize: 18 }} />
                }
              >
                {isLoading && !hasResults ? 'Searching...' : 'Search'}
              </Button>
            </Box>
          </Grid>

          {/* ── Custom date fields ── */}
          {dateFilter === 'custom' && (
            <>
              <Grid item xs={6} sm={3} md={2}>
                <FieldLabel icon={<CalendarTodayIcon />} label="From" color={C.cyan[600]} />
                <TextField
                  type="date"
                  value={customFrom}
                  onChange={(e) => setCustomFrom(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  size="small"
                  fullWidth
                  sx={fieldSx(C.cyan[50], C.cyan[500], C.cyan[100])}
                />
              </Grid>
              <Grid item xs={6} sm={3} md={2}>
                <FieldLabel icon={<CalendarTodayIcon />} label="To" color={C.cyan[600]} />
                <TextField
                  type="date"
                  value={customTo}
                  onChange={(e) => setCustomTo(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  size="small"
                  fullWidth
                  sx={fieldSx(C.cyan[50], C.cyan[500], C.cyan[100])}
                />
              </Grid>
            </>
          )}
        </Grid>
      </Box>
    </Box>
  );
}
