import { useState, useEffect, useRef, useInsertionEffect } from 'react';
import {
  Box, AppBar, Toolbar, styled,
  TextField, InputAdornment, Paper, List, ListItemButton,
  Typography, ClickAwayListener, Grow, Chip, Popper, Tooltip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import ArrowIcon from '@mui/icons-material/ArrowForwardIos';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';

// components
import Profile from './Profile';
import { fetchSearchSuggestions } from '../../../services/searchApi';
import { useThemeContext } from '../../../theme/ThemeContext';
import NovaToggle from './NovaToggle';

/* ── Color tokens (indigo / blue / cyan / slate) ── */
const C = {
  indigo: { 50: '#EEF2FF', 100: '#E0E7FF', 200: '#C7D2FE', 300: '#A5B4FC', 400: '#818CF8', 500: '#6366F1', 600: '#4F46E5', 700: '#4338CA', 800: '#3730A3', 900: '#312E81' },
  blue:   { 50: '#EFF6FF', 100: '#DBEAFE', 200: '#BFDBFE', 300: '#93C5FD', 400: '#60A5FA', 500: '#3B82F6', 600: '#2563EB', 700: '#1D4ED8', 800: '#1E40AF', 900: '#1E3A8A' },
  cyan:   { 50: '#ECFEFF', 100: '#CFFAFE', 200: '#A5F3FC', 300: '#67E8F9', 400: '#22D3EE', 500: '#06B6D4', 600: '#0891B2', 700: '#0E7490', 800: '#155E75', 900: '#164E63' },
  slate:  { 50: '#F8FAFC', 100: '#F1F5F9', 200: '#E2E8F0', 300: '#CBD5E1', 400: '#94A3B8', 500: '#64748B', 600: '#475569', 700: '#334155', 800: '#1E293B', 900: '#0F172A' },
};

/* Dark counterparts for the header controls, mirroring the `--dm-*` ladder in
   src/styles/common.css. The theme toggle and the Nova pill paint themselves
   with inline sx gradients, which the dark stylesheet cannot reach — so in dark
   mode they stayed a white disc and a pale lavender pill sitting on the dark
   AppBar. */
const D = {
  controlBg: 'rgba(255, 255, 255, 0.06)',
  controlBgHover: 'rgba(255, 255, 255, 0.10)',
  border: 'rgba(255, 255, 255, 0.14)',
  accent: '#A6A0F0',
  accentInk: '#C7D2FE',
  accentEdge: 'rgba(166, 160, 240, 0.35)',
  accentRing: 'rgba(166, 160, 240, 0.14)',
  accentRingHover: 'rgba(166, 160, 240, 0.22)',
  orbBg: 'linear-gradient(145deg, #2A2A2F 0%, #313136 100%)',
  novaBg: 'linear-gradient(135deg, rgba(166, 160, 240, 0.14) 0%, rgba(166, 160, 240, 0.06) 100%)',
  novaBgHover: 'linear-gradient(135deg, rgba(166, 160, 240, 0.22) 0%, rgba(166, 160, 240, 0.12) 100%)',
};

const AppBarStyled = styled(AppBar)(({ theme }) => {
  const isDark = theme.palette.mode === 'dark';
  return {
    boxShadow: isDark
      ? '0 1px 3px rgba(0,0,0,0.4), 0 4px 14px rgba(0,0,0,0.25)'
      : `0 1px 3px ${C.indigo[500]}0A, 0 4px 14px ${C.blue[500]}08`,
    background: isDark
      ? 'linear-gradient(135deg, var(--dm-paper) 0%, var(--dm-paper-2) 50%, var(--dm-paper) 100%)'
      : `linear-gradient(135deg, ${C.indigo[50]}F0 0%, #ffffffF5 50%, ${C.blue[50]}EE 100%)`,
    justifyContent: 'center',
    backdropFilter: 'blur(16px)',
    width: '100%',
    position: 'relative',
    zIndex: theme.zIndex.drawer + 1,
    overflow: 'visible',
    borderBottom: isDark
      ? '1px solid var(--dm-border)'
      : `1px solid ${C.indigo[200]}40`,
    minHeight: '68px',
  };
});

const ToolbarStyled = styled(Toolbar)(({ theme }) => {
  const isDark = theme.palette.mode === 'dark';
  return {
    width: '100%',
    color: isDark ? 'var(--dm-text)' : C.slate[700],
    padding: '0 24px',
    minHeight: '68px',
    position: 'relative',
    overflow: 'visible',
  };
});

// Style id for dark-mode search-dropdown overrides
const SEARCH_DM_STYLE_ID = 'news-search-dark-overrides';

const darkSearchStyles = `
  .news-search-section-header { background: linear-gradient(135deg, rgba(99,102,241,0.14) 0%, rgba(59,130,246,0.08) 100%) !important; border-bottom: 1px solid var(--dm-border) !important; }
  .news-search-section-header-entity { background: linear-gradient(135deg, rgba(6,182,212,0.12) 0%, rgba(59,130,246,0.06) 100%) !important; border-bottom: 1px solid var(--dm-border) !important; border-top: 1px solid var(--dm-border) !important; }
  .news-search-item:hover { background-color: rgba(255,255,255,0.05) !important; }
  .news-search-item-entity:hover { background-color: rgba(255,255,255,0.05) !important; }
  .news-search-chip { background-color: rgba(99,102,241,0.2) !important; color: var(--dm-accent-ink) !important; border-color: var(--dm-accent-edge) !important; }
  .news-search-chip-entity { background-color: rgba(6,182,212,0.2) !important; color: #67e8f9 !important; border-color: rgba(6,182,212,0.35) !important; }
`;

const Header = ({ isEmbedded = false, isChatOpen = false, onToggleChat }) => {
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const { isDark, toggleTheme, hostOwnsTheme } = useThemeContext();

  // Inject/remove the dark-mode search style block when isDark changes.
  // useInsertionEffect fires synchronously before DOM mutations are painted,
  // avoiding a flash of wrong styles on mode switch.
  useInsertionEffect(() => {
    let el = document.getElementById(SEARCH_DM_STYLE_ID);
    if (isDark) {
      if (!el) {
        el = document.createElement('style');
        el.id = SEARCH_DM_STYLE_ID;
        document.head.appendChild(el);
      }
      el.textContent = darkSearchStyles;
    } else if (el) {
      el.remove();
    }
    return () => el?.remove();
  }, [isDark]);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState({ title: [], entity_name: [] });
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

  // Determine if dropdown should show
  const showDropdown = searchQuery.length >= 3 && (
    isLoadingSuggestions ||
    suggestionsOpen ||
    (suggestions.title?.length === 0 && suggestions.entity_name?.length === 0 && !isLoadingSuggestions && suggestionsOpen)
  );

  useEffect(() => {
    let timeout;
    let cancelled = false;

    if (searchQuery && searchQuery.length >= 3) {
      setIsLoadingSuggestions(true);
      timeout = setTimeout(() => {
        fetchSearchSuggestions(searchQuery)
          .then(data => {
            if (!cancelled) {
              const mappedData = {
                title: data.titles || [],
                entity_name: data.events || []
              };
              setSuggestions(mappedData);
              setIsLoadingSuggestions(false);
              setSuggestionsOpen(mappedData.title.length > 0 || mappedData.entity_name.length > 0);
            }
          })
          .catch(error => {
            if (!cancelled) {
              console.error('Error fetching suggestions:', error);
              setSuggestions({ title: [], entity_name: [] });
              setIsLoadingSuggestions(false);
              setSuggestionsOpen(false);
            }
          });
      }, 300);
    } else {
      setSuggestions({ title: [], entity_name: [] });
      setIsLoadingSuggestions(false);
      setSuggestionsOpen(false);
    }

    return () => {
      cancelled = true;
      if (timeout) clearTimeout(timeout);
    };
  }, [searchQuery]);

  const handleSearchSubmit = (query) => {
    if (query && query.trim()) {
      setSuggestionsOpen(false);
      setSearchQuery('');
      navigate(`/search?q=${encodeURIComponent(query.trim())}&refresh=true`);
    }
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearchSubmit(searchQuery);
    } else if (e.key === 'Escape') {
      setSearchQuery('');
      setSuggestionsOpen(false);
    }
  };

  const handleSuggestionSelect = (suggestion) => {
    try {
      handleSearchSubmit(suggestion);
    } catch (error) {
      console.error('Error handling suggestion selection:', error);
    }
  };

  const hasSuggestions = suggestions.title?.length > 0 || suggestions.entity_name?.length > 0;
  const noResults = !isLoadingSuggestions && suggestionsOpen && !hasSuggestions;

  return (
    <AppBarStyled position="static" color="default">
      <ToolbarStyled>
        {/* ─── Search Section ─── */}
        <ClickAwayListener onClickAway={() => setSuggestionsOpen(false)}>
          <Box sx={{
            position: 'relative',
            width: { xs: '100%', sm: 380, md: 450, lg: 520 },
            maxWidth: 520,
            mr: { xs: 1, md: 3 },
          }}>
            {/* Search Input */}
            <TextField
              ref={searchRef}
              size="small"
              placeholder="Search news, events, and more..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              autoComplete="off"
              name="search-query"
              inputProps={{ autoComplete: 'off' }}
              InputProps={{
                autoComplete: 'off',
                startAdornment: (
                  <InputAdornment position="start">
                    <Box sx={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      width: 34, height: 34, borderRadius: '9px',
                      background: `linear-gradient(135deg, ${C.indigo[500]}, ${C.blue[500]})`,
                      boxShadow: `0 2px 8px ${C.indigo[500]}30`,
                    }}>
                      <SearchIcon sx={{ color: '#fff', fontSize: 18 }} />
                    </Box>
                  </InputAdornment>
                ),
              }}
              sx={{
                width: '100%',
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  height: '46px',
                  fontSize: '0.88rem',
                  bgcolor: isDark ? 'var(--dm-bg)' : '#fff',
                  transition: 'all 0.2s ease',
                  boxShadow: isDark
                    ? '0 1px 3px rgba(0,0,0,0.3)'
                    : `0 1px 4px ${C.indigo[500]}10, 0 2px 12px ${C.blue[500]}08`,
                  '& fieldset': {
                    borderColor: isDark ? `rgba(255,255,255,0.20)` : `${C.indigo[200]}90`,
                    borderWidth: 1.5,
                  },
                  '&:hover': {
                    bgcolor: isDark ? 'var(--dm-paper)' : C.indigo[50],
                    boxShadow: isDark
                      ? '0 1px 4px rgba(0,0,0,0.4), 0 0 0 1px var(--dm-accent-edge)'
                      : `0 2px 8px ${C.indigo[500]}18, 0 4px 16px ${C.blue[500]}10`,
                    '& fieldset': {
                      borderColor: isDark ? D.accent : C.indigo[300],
                    },
                  },
                  '&.Mui-focused': {
                    bgcolor: isDark ? 'var(--dm-paper)' : '#fff',
                    boxShadow: isDark
                      ? '0 0 0 2px var(--dm-accent-wash), 0 1px 4px rgba(0,0,0,0.4)'
                      : `0 0 0 3px ${C.indigo[500]}18, 0 4px 16px ${C.indigo[500]}12`,
                    '& fieldset': {
                      borderColor: isDark ? D.accent : C.indigo[500],
                      borderWidth: 1.5,
                    },
                  },
                },
                '& .MuiInputBase-input': {
                  padding: '12px 14px',
                  color: isDark ? 'var(--dm-text)' : C.slate[800],
                  fontWeight: 500,
                  fontSize: '0.88rem',
                  '&::placeholder': {
                    color: isDark ? 'var(--dm-text-disabled)' : C.slate[400],
                    opacity: 1,
                    fontWeight: 400,
                  },
                },
              }}
            />

            {/* ─── Suggestions Dropdown (Portal-based Popper) ─── */}
            <Popper
              open={showDropdown || noResults}
              anchorEl={searchRef.current}
              placement="bottom-start"
              transition
              style={{ zIndex: 9999, width: searchRef.current?.offsetWidth || 'auto' }}
              modifiers={[{ name: 'offset', options: { offset: [0, 6] } }]}
            >
              {({ TransitionProps }) => (
                <Grow {...TransitionProps} timeout={200}>
                  <Paper
                    elevation={16}
                    sx={{
                      borderRadius: '12px',
                      bgcolor: isDark ? 'var(--dm-paper-2)' : '#fff',
                      border: `1.5px solid ${isDark ? 'var(--dm-border)' : C.indigo[200]}`,
                      overflow: 'hidden',
                      maxHeight: 440,
                      display: 'flex',
                      flexDirection: 'column',
                      // Left accent bar
                      position: 'relative',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0, left: 0, bottom: 0,
                        width: '3px',
                        background: `linear-gradient(180deg, ${C.indigo[400]}, ${C.blue[400]}, ${C.cyan[400]})`,
                        borderRadius: '12px 0 0 12px',
                        zIndex: 2,
                      },
                    }}
                  >
                    {/* ── Dark-mode-tinted alternatives ── */}
                    {isDark && (
                      <style>{`
                        .news-search-section-header { background: linear-gradient(135deg, rgba(99,102,241,0.14) 0%, rgba(59,130,246,0.08) 100%) !important; border-bottom: 1px solid var(--dm-border) !important; }
                        .news-search-section-header-entity { background: linear-gradient(135deg, rgba(6,182,212,0.12) 0%, rgba(59,130,246,0.06) 100%) !important; border-bottom: 1px solid var(--dm-border) !important; border-top: 1px solid var(--dm-border) !important; }
                        .news-search-item:hover { background-color: rgba(255,255,255,0.05) !important; }
                        .news-search-item-entity:hover { background-color: rgba(255,255,255,0.05) !important; }
                        .news-search-chip { background-color: rgba(99,102,241,0.2) !important; color: var(--dm-accent-ink) !important; border-color: var(--dm-accent-edge) !important; }
                        .news-search-chip-entity { background-color: rgba(6,182,212,0.2) !important; color: #67e8f9 !important; border-color: rgba(6,182,212,0.35) !important; }
                      `}</style>
                    )}

                    {/* Loading State */}
                    {isLoadingSuggestions && (
                      <Box sx={{ py: 2, px: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5 }}>
                        <Box sx={{
                          width: 18, height: 18,
                          border: `2.5px solid ${isDark ? 'var(--dm-accent)' : C.indigo[500]}`,
                          borderTopColor: 'transparent',
                          borderRadius: '50%',
                          animation: 'spin 0.8s linear infinite',
                          '@keyframes spin': {
                            '0%': { transform: 'rotate(0deg)' },
                            '100%': { transform: 'rotate(360deg)' },
                          },
                        }} />
                        <Typography sx={{ color: isDark ? 'var(--dm-text-2)' : C.slate[600], fontWeight: 500, fontSize: '0.82rem' }}>
                          Searching...
                        </Typography>
                      </Box>
                    )}

                    {/* No Results */}
                    {noResults && (
                      <Box sx={{ py: 3, px: 2.5, textAlign: 'center' }}>
                        <Typography sx={{ color: isDark ? 'var(--dm-text)' : C.slate[700], fontWeight: 600, fontSize: '0.85rem', mb: 0.5 }}>
                          No results found
                        </Typography>
                        <Typography sx={{ color: isDark ? 'var(--dm-text-3)' : C.slate[400], fontSize: '0.75rem' }}>
                          Try a different search term
                        </Typography>
                      </Box>
                    )}

                    {/* Results */}
                    {!isLoadingSuggestions && hasSuggestions && (
                      <Box sx={{
                        overflow: 'auto',
                        maxHeight: 440,
                        '&::-webkit-scrollbar': { width: '5px' },
                        '&::-webkit-scrollbar-track': { background: isDark ? 'var(--dm-bg)' : C.slate[50] },
                        '&::-webkit-scrollbar-thumb': {
                          background: isDark ? 'var(--dm-accent-wash)' : C.indigo[200], borderRadius: '5px',
                          '&:hover': { background: isDark ? 'var(--dm-accent-wash-2)' : C.indigo[300] },
                        },
                      }}>
                        {/* ── News Articles ── */}
                        {suggestions.title?.length > 0 && (
                          <Box>
                            {/* Section Header */}
                            <Box className="news-search-section-header" sx={{
                              px: 2, py: 1,
                              background: isDark ? undefined : `linear-gradient(135deg, ${C.indigo[50]} 0%, ${C.blue[50]} 100%)`,
                              borderBottom: `1px solid ${isDark ? 'var(--dm-border)' : C.indigo[100]}`,
                              display: 'flex', alignItems: 'center', gap: 1,
                              position: 'sticky', top: 0, zIndex: 1,
                            }}>
                              <Box sx={{
                                width: 26, height: 26, borderRadius: '7px',
                                background: `linear-gradient(135deg, ${C.indigo[500]}, ${C.blue[500]})`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: `0 2px 6px ${C.indigo[500]}30`,
                              }}>
                                <NewspaperIcon sx={{ color: '#fff', fontSize: 14 }} />
                              </Box>
                              <Typography sx={{
                                color: isDark ? 'var(--dm-accent-ink)' : C.indigo[800], fontWeight: 700, fontSize: '0.72rem',
                                textTransform: 'uppercase', letterSpacing: '0.05em',
                              }}>
                                News Articles
                              </Typography>
                              <Chip
                                label={suggestions.title.length}
                                size="small"
                                className="news-search-chip"
                                sx={{
                                  ml: 'auto', height: 22, minWidth: 22,
                                  bgcolor: isDark ? undefined : C.indigo[100],
                                  color: isDark ? undefined : C.indigo[700],
                                  fontWeight: 700, fontSize: '0.65rem',
                                  border: `1px solid ${isDark ? 'var(--dm-accent-edge)' : C.indigo[200]}`,
                                  '& .MuiChip-label': { px: 0.75 },
                                }}
                              />
                            </Box>

                            {/* News Items */}
                            <List sx={{ py: 0.5, px: 0.75 }}>
                              {suggestions.title.map((title, index) => (
                                <ListItemButton
                                  key={`title-${index}`}
                                  onClick={() => handleSuggestionSelect(title)}
                                  className="news-search-item"
                                  sx={{
                                    py: 0.85, px: 1.5, mb: 0.3,
                                    borderRadius: '8px',
                                    transition: 'all 0.15s ease',
                                    bgcolor: 'transparent',
                                    borderLeft: `3px solid transparent`,
                                    '&:hover': {
                                      bgcolor: isDark ? 'rgba(255,255,255,0.05)' : C.indigo[50],
                                      borderLeft: `3px solid ${isDark ? 'var(--dm-accent)' : C.indigo[400]}`,
                                      '& .item-arrow': { opacity: 1, transform: 'translateX(0)' },
                                    },
                                    '&:active': { bgcolor: isDark ? 'rgba(255,255,255,0.08)' : C.indigo[100] },
                                  }}
                                >
                                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 1 }}>
                                    <Box sx={{
                                      width: 7, height: 7, borderRadius: '50%',
                                      bgcolor: isDark ? 'var(--dm-accent)' : C.indigo[400], flexShrink: 0,
                                    }} />
                                    <Typography sx={{
                                      color: isDark ? 'var(--dm-text)' : C.slate[800], fontWeight: 500,
                                      fontSize: '0.8rem', lineHeight: 1.45,
                                      flex: 1, minWidth: 0,
                                      overflow: 'hidden', textOverflow: 'ellipsis',
                                      display: '-webkit-box',
                                      WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                                    }}>
                                      {title}
                                    </Typography>
                                    <ArrowIcon className="item-arrow" sx={{
                                      fontSize: 11, color: isDark ? 'var(--dm-accent)' : C.indigo[400],
                                      opacity: 0, transform: 'translateX(-4px)',
                                      transition: 'all 0.15s ease', flexShrink: 0,
                                    }} />
                                  </Box>
                                </ListItemButton>
                              ))}
                            </List>
                          </Box>
                        )}

                        {/* ── Events & Entities ── */}
                        {suggestions.entity_name?.length > 0 && (
                          <Box>
                            {/* Section Header */}
                            <Box className="news-search-section-header-entity" sx={{
                              px: 2, py: 1,
                              background: isDark ? undefined : `linear-gradient(135deg, ${C.cyan[50]} 0%, ${C.blue[50]} 100%)`,
                              borderTop: suggestions.title?.length > 0 ? `1px solid ${isDark ? 'var(--dm-border)' : C.slate[200]}` : 'none',
                              borderBottom: `1px solid ${isDark ? 'var(--dm-border)' : C.cyan[100]}`,
                              display: 'flex', alignItems: 'center', gap: 1,
                              position: 'sticky', top: 0, zIndex: 1,
                            }}>
                              <Box sx={{
                                width: 26, height: 26, borderRadius: '7px',
                                background: `linear-gradient(135deg, ${C.cyan[500]}, ${C.blue[500]})`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: `0 2px 6px ${C.cyan[500]}30`,
                              }}>
                                <EventAvailableIcon sx={{ color: '#fff', fontSize: 14 }} />
                              </Box>
                              <Typography sx={{
                                color: isDark ? 'var(--dm-accent-ink)' : C.cyan[800], fontWeight: 700, fontSize: '0.72rem',
                                textTransform: 'uppercase', letterSpacing: '0.05em',
                              }}>
                                Events & Entities
                              </Typography>
                              <Chip
                                label={suggestions.entity_name.length}
                                size="small"
                                className="news-search-chip-entity"
                                sx={{
                                  ml: 'auto', height: 22, minWidth: 22,
                                  bgcolor: isDark ? undefined : C.cyan[100],
                                  color: isDark ? undefined : C.cyan[700],
                                  fontWeight: 700, fontSize: '0.65rem',
                                  border: `1px solid ${isDark ? 'rgba(6,182,212,0.35)' : C.cyan[200]}`,
                                  '& .MuiChip-label': { px: 0.75 },
                                }}
                              />
                            </Box>

                            {/* Entity Items */}
                            <List sx={{ py: 0.5, px: 0.75 }}>
                              {suggestions.entity_name.map((entity, index) => (
                                <ListItemButton
                                  key={`entity-${index}`}
                                  onClick={() => handleSuggestionSelect(entity)}
                                  className="news-search-item-entity"
                                  sx={{
                                    py: 0.85, px: 1.5, mb: 0.3,
                                    borderRadius: '8px',
                                    transition: 'all 0.15s ease',
                                    bgcolor: 'transparent',
                                    borderLeft: `3px solid transparent`,
                                    '&:hover': {
                                      bgcolor: isDark ? 'rgba(255,255,255,0.05)' : C.cyan[50],
                                      borderLeft: `3px solid ${isDark ? 'var(--dm-accent)' : C.cyan[400]}`,
                                      '& .item-arrow': { opacity: 1, transform: 'translateX(0)' },
                                    },
                                    '&:active': { bgcolor: isDark ? 'rgba(255,255,255,0.08)' : C.cyan[100] },
                                  }}
                                >
                                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 1 }}>
                                    <Box sx={{
                                      width: 7, height: 7, borderRadius: '2px',
                                      bgcolor: isDark ? 'var(--dm-accent)' : C.cyan[400], flexShrink: 0,
                                    }} />
                                    <Typography sx={{
                                      color: isDark ? 'var(--dm-text)' : C.slate[800], fontWeight: 500,
                                      fontSize: '0.8rem', lineHeight: 1.45,
                                      flex: 1, minWidth: 0,
                                      overflow: 'hidden', textOverflow: 'ellipsis',
                                      display: '-webkit-box',
                                      WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                                    }}>
                                      {entity}
                                    </Typography>
                                    <ArrowIcon className="item-arrow" sx={{
                                      fontSize: 11, color: isDark ? 'var(--dm-accent)' : C.cyan[400],
                                      opacity: 0, transform: 'translateX(-4px)',
                                      transition: 'all 0.15s ease', flexShrink: 0,
                                    }} />
                                  </Box>
                                </ListItemButton>
                              ))}
                            </List>
                          </Box>
                        )}
                      </Box>
                    )}
                  </Paper>
                </Grow>
              )}
            </Popper>
          </Box>
        </ClickAwayListener>

        {/* Spacer */}
        <Box sx={{ flex: 1 }} />

        {/* ── Theme Mode Toggle — hidden when the host drives the theme (federation mode) ── */}
        {!hostOwnsTheme && (
        <Tooltip title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'} arrow placement="bottom">
          <Box
            onClick={toggleTheme}
            sx={{
              flexShrink: 0,
              position: 'relative',
              zIndex: 2,
              width: 38, height: 38, borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', mr: 1.5,
              background: isDark
                ? D.controlBg
                : `linear-gradient(145deg, #fff 0%, ${C.indigo[50]} 100%)`,
              border: `2px solid ${isDark ? D.border : C.indigo[400]}`,
              boxShadow: isDark
                ? `0 0 0 3px ${D.accentRing}`
                : `0 0 0 3px ${C.indigo[100]}, 0 2px 8px ${C.indigo[400]}25`,
              transition: 'all 0.25s ease',
              '&:hover': {
                transform: 'scale(1.08)',
                background: isDark
                  ? D.controlBgHover
                  : `linear-gradient(145deg, ${C.indigo[50]} 0%, ${C.blue[50]} 100%)`,
                boxShadow: isDark
                  ? `0 0 0 3px ${D.accentRingHover}`
                  : `0 0 0 3px ${C.indigo[200]}, 0 4px 12px ${C.indigo[400]}30`,
              },
              '&:active': { transform: 'scale(0.96)' },
            }}
          >
            {isDark
              ? <LightModeOutlinedIcon sx={{ fontSize: 18, color: D.accentInk }} />
              : <DarkModeOutlinedIcon sx={{ fontSize: 18, color: C.indigo[600] }} />}
          </Box>
        </Tooltip>
        )}

        {/* ── Nova AI Assistant ──
            Drawn in NovaToggle.jsx, which is byte-identical in sa-web-service and
            sa-insights-lite. The two apps had drifted into visibly different controls for the
            same feature; the shared file is what makes them stay the same. It also carries the
            reasoning for the hexagon-and-lockup shape, which is borrowed from the portal bar
            directly above this one. */}
        <NovaToggle isChatOpen={isChatOpen} onToggleChat={onToggleChat} isDark={isDark} />

        {/* User Profile (hidden in federation mode — host shows its own) */}
        {!isEmbedded && <Profile />}
      </ToolbarStyled>
    </AppBarStyled>
  );
};

export default Header;
