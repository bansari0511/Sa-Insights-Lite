import { useState, useEffect, useRef } from 'react';
import {
  Box, AppBar, Toolbar, styled, Stack,
  TextField, InputAdornment, Paper, List, ListItemButton,
  Typography, ClickAwayListener, Grow, useTheme, Chip, Popper
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  Search as SearchIcon,
  Newspaper as NewspaperIcon,
  EventAvailable as EventAvailableIcon,
  ArrowForwardIos as ArrowIcon,
} from '@mui/icons-material';

// components
import Profile from './Profile';
import { fetchSearchSuggestions } from '../../../services/searchApi';
import { withOpacity } from '../../../theme/palette';

/* ── Color tokens (indigo / blue / cyan / slate) ── */
const C = {
  indigo: { 50: '#EEF2FF', 100: '#E0E7FF', 200: '#C7D2FE', 300: '#A5B4FC', 400: '#818CF8', 500: '#6366F1', 600: '#4F46E5', 700: '#4338CA', 800: '#3730A3', 900: '#312E81' },
  blue:   { 50: '#EFF6FF', 100: '#DBEAFE', 200: '#BFDBFE', 300: '#93C5FD', 400: '#60A5FA', 500: '#3B82F6', 600: '#2563EB', 700: '#1D4ED8', 800: '#1E40AF', 900: '#1E3A8A' },
  cyan:   { 50: '#ECFEFF', 100: '#CFFAFE', 200: '#A5F3FC', 300: '#67E8F9', 400: '#22D3EE', 500: '#06B6D4', 600: '#0891B2', 700: '#0E7490', 800: '#155E75', 900: '#164E63' },
  slate:  { 50: '#F8FAFC', 100: '#F1F5F9', 200: '#E2E8F0', 300: '#CBD5E1', 400: '#94A3B8', 500: '#64748B', 600: '#475569', 700: '#334155', 800: '#1E293B', 900: '#0F172A' },
};

const AppBarStyled = styled(AppBar)(({ theme }) => ({
  boxShadow: `0 1px 3px ${C.indigo[500]}0A, 0 4px 14px ${C.blue[500]}08`,
  background: `linear-gradient(135deg, ${C.indigo[50]}F0 0%, #ffffffF5 50%, ${C.blue[50]}EE 100%)`,
  justifyContent: 'center',
  backdropFilter: 'blur(16px)',
  width: '100%',
  position: 'relative',
  zIndex: theme.zIndex.drawer + 1,
  overflow: 'visible',
  borderBottom: `1px solid ${C.indigo[200]}40`,
  minHeight: '68px',
}));

const ToolbarStyled = styled(Toolbar)(() => ({
  width: '100%',
  color: C.slate[700],
  padding: '0 24px',
  minHeight: '68px',
  position: 'relative',
  overflow: 'visible',
}));

const Header = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const searchRef = useRef(null);

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
                  bgcolor: '#fff',
                  transition: 'all 0.2s ease',
                  boxShadow: `0 1px 4px ${C.indigo[500]}10, 0 2px 12px ${C.blue[500]}08`,
                  '& fieldset': { borderColor: `${C.indigo[200]}90`, borderWidth: 1.5 },
                  '&:hover': {
                    bgcolor: C.indigo[50],
                    boxShadow: `0 2px 8px ${C.indigo[500]}18, 0 4px 16px ${C.blue[500]}10`,
                    '& fieldset': { borderColor: C.indigo[300] },
                  },
                  '&.Mui-focused': {
                    bgcolor: '#fff',
                    boxShadow: `0 0 0 3px ${C.indigo[500]}18, 0 4px 16px ${C.indigo[500]}12`,
                    '& fieldset': { borderColor: C.indigo[500], borderWidth: 1.5 },
                  },
                },
                '& .MuiInputBase-input': {
                  padding: '12px 14px',
                  color: C.slate[800],
                  fontWeight: 500,
                  fontSize: '0.88rem',
                  '&::placeholder': { color: C.slate[400], opacity: 1, fontWeight: 400 },
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
                      bgcolor: '#fff',
                      border: `1.5px solid ${C.indigo[200]}`,
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
                    {/* Loading State */}
                    {isLoadingSuggestions && (
                      <Box sx={{ py: 2, px: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5 }}>
                        <Box sx={{
                          width: 18, height: 18,
                          border: `2.5px solid ${C.indigo[500]}`,
                          borderTopColor: 'transparent',
                          borderRadius: '50%',
                          animation: 'spin 0.8s linear infinite',
                          '@keyframes spin': {
                            '0%': { transform: 'rotate(0deg)' },
                            '100%': { transform: 'rotate(360deg)' },
                          },
                        }} />
                        <Typography sx={{ color: C.slate[600], fontWeight: 500, fontSize: '0.82rem' }}>
                          Searching...
                        </Typography>
                      </Box>
                    )}

                    {/* No Results */}
                    {noResults && (
                      <Box sx={{ py: 3, px: 2.5, textAlign: 'center' }}>
                        <Typography sx={{ color: C.slate[700], fontWeight: 600, fontSize: '0.85rem', mb: 0.5 }}>
                          No results found
                        </Typography>
                        <Typography sx={{ color: C.slate[400], fontSize: '0.75rem' }}>
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
                        '&::-webkit-scrollbar-track': { background: C.slate[50] },
                        '&::-webkit-scrollbar-thumb': {
                          background: C.indigo[200], borderRadius: '5px',
                          '&:hover': { background: C.indigo[300] },
                        },
                      }}>
                        {/* ── News Articles ── */}
                        {suggestions.title?.length > 0 && (
                          <Box>
                            {/* Section Header */}
                            <Box sx={{
                              px: 2, py: 1,
                              background: `linear-gradient(135deg, ${C.indigo[50]} 0%, ${C.blue[50]} 100%)`,
                              borderBottom: `1px solid ${C.indigo[100]}`,
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
                                color: C.indigo[800], fontWeight: 700, fontSize: '0.72rem',
                                textTransform: 'uppercase', letterSpacing: '0.05em',
                              }}>
                                News Articles
                              </Typography>
                              <Chip
                                label={suggestions.title.length}
                                size="small"
                                sx={{
                                  ml: 'auto', height: 22, minWidth: 22,
                                  bgcolor: C.indigo[100], color: C.indigo[700],
                                  fontWeight: 700, fontSize: '0.65rem',
                                  border: `1px solid ${C.indigo[200]}`,
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
                                  sx={{
                                    py: 0.85, px: 1.5, mb: 0.3,
                                    borderRadius: '8px',
                                    transition: 'all 0.15s ease',
                                    bgcolor: 'transparent',
                                    borderLeft: `3px solid transparent`,
                                    '&:hover': {
                                      bgcolor: C.indigo[50],
                                      borderLeft: `3px solid ${C.indigo[400]}`,
                                      '& .item-arrow': { opacity: 1, transform: 'translateX(0)' },
                                    },
                                    '&:active': { bgcolor: C.indigo[100] },
                                  }}
                                >
                                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 1 }}>
                                    <Box sx={{
                                      width: 7, height: 7, borderRadius: '50%',
                                      bgcolor: C.indigo[400], flexShrink: 0,
                                    }} />
                                    <Typography sx={{
                                      color: C.slate[800], fontWeight: 500,
                                      fontSize: '0.8rem', lineHeight: 1.45,
                                      flex: 1, minWidth: 0,
                                      overflow: 'hidden', textOverflow: 'ellipsis',
                                      display: '-webkit-box',
                                      WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                                    }}>
                                      {title}
                                    </Typography>
                                    <ArrowIcon className="item-arrow" sx={{
                                      fontSize: 11, color: C.indigo[400],
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
                            <Box sx={{
                              px: 2, py: 1,
                              background: `linear-gradient(135deg, ${C.cyan[50]} 0%, ${C.blue[50]} 100%)`,
                              borderTop: suggestions.title?.length > 0 ? `1px solid ${C.slate[200]}` : 'none',
                              borderBottom: `1px solid ${C.cyan[100]}`,
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
                                color: C.cyan[800], fontWeight: 700, fontSize: '0.72rem',
                                textTransform: 'uppercase', letterSpacing: '0.05em',
                              }}>
                                Events & Entities
                              </Typography>
                              <Chip
                                label={suggestions.entity_name.length}
                                size="small"
                                sx={{
                                  ml: 'auto', height: 22, minWidth: 22,
                                  bgcolor: C.cyan[100], color: C.cyan[700],
                                  fontWeight: 700, fontSize: '0.65rem',
                                  border: `1px solid ${C.cyan[200]}`,
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
                                  sx={{
                                    py: 0.85, px: 1.5, mb: 0.3,
                                    borderRadius: '8px',
                                    transition: 'all 0.15s ease',
                                    bgcolor: 'transparent',
                                    borderLeft: `3px solid transparent`,
                                    '&:hover': {
                                      bgcolor: C.cyan[50],
                                      borderLeft: `3px solid ${C.cyan[400]}`,
                                      '& .item-arrow': { opacity: 1, transform: 'translateX(0)' },
                                    },
                                    '&:active': { bgcolor: C.cyan[100] },
                                  }}
                                >
                                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 1 }}>
                                    <Box sx={{
                                      width: 7, height: 7, borderRadius: '2px',
                                      bgcolor: C.cyan[400], flexShrink: 0,
                                    }} />
                                    <Typography sx={{
                                      color: C.slate[800], fontWeight: 500,
                                      fontSize: '0.8rem', lineHeight: 1.45,
                                      flex: 1, minWidth: 0,
                                      overflow: 'hidden', textOverflow: 'ellipsis',
                                      display: '-webkit-box',
                                      WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                                    }}>
                                      {entity}
                                    </Typography>
                                    <ArrowIcon className="item-arrow" sx={{
                                      fontSize: 11, color: C.cyan[400],
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

        {/* Welcome & Profile */}
        <Stack spacing={{ xs: 1, md: 1.2 }} direction="row" alignItems="center">
          <Box
            sx={{
              display: { xs: 'none', sm: 'flex' },
              alignItems: 'center',
              gap: { sm: 0.8, md: 1 },
              px: { sm: 1.2, md: 1.5 },
              py: { sm: 0.6, md: 0.8 },
              borderRadius: '10px',
              background: `linear-gradient(135deg,
                ${theme.palette.common.white} 0%,
                ${withOpacity(theme.palette.primary[50], 0.6)} 100%
              )`,
              border: `1px solid ${withOpacity(theme.palette.primary[300], 0.4)}`,
              boxShadow: `
                0 3px 10px ${withOpacity(theme.palette.primary[400], 0.12)},
                0 2px 5px ${withOpacity(theme.palette.primary[500], 0.08)},
                inset 0 1px 0 ${withOpacity(theme.palette.common.white, 0.85)}
              `,
              backdropFilter: 'blur(10px)',
              cursor: 'pointer',
              '&:hover': {
                border: `1px solid ${withOpacity(theme.palette.primary[400], 0.5)}`,
                boxShadow: `
                  0 4px 14px ${withOpacity(theme.palette.primary[400], 0.18)},
                  0 2px 7px ${withOpacity(theme.palette.primary[500], 0.12)},
                  inset 0 1px 0 ${withOpacity(theme.palette.common.white, 0.95)},
                  0 0 0 2px ${withOpacity(theme.palette.primary[200], 0.35)}
                `,
              }
            }}
          >
            <Box sx={{
              minWidth: { sm: 28, md: 32 },
              height: { sm: 28, md: 32 },
              borderRadius: '50%',
              background: `linear-gradient(135deg,
                ${theme.palette.primary[400]} 0%,
                ${theme.palette.primary[500]} 50%,
                ${theme.palette.primary[600]} 100%
              )`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: `0 2px 8px ${withOpacity(theme.palette.primary[400], 0.3)}`,
              border: `1px solid ${withOpacity(theme.palette.primary[300], 0.35)}`,
              position: 'relative',
              '&::before': {
                content: '""', position: 'absolute',
                top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '100%', height: '100%',
                borderRadius: '50%',
                border: `2px solid ${theme.palette.primary[500]}`,
                animation: 'ripple 2s infinite ease-out',
              },
              '&::after': {
                content: '""', position: 'absolute',
                top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '100%', height: '100%',
                borderRadius: '50%',
                border: `2px solid ${theme.palette.primary[400]}`,
                animation: 'ripple 2s infinite ease-out 1s',
              },
              '@keyframes ripple': {
                '0%': { width: '100%', height: '100%', opacity: 1 },
                '100%': { width: '180%', height: '180%', opacity: 0 },
              }
            }}>
              <Typography sx={{
                fontSize: { sm: '0.85rem', md: '0.95rem' },
                position: 'relative', zIndex: 1,
              }}>
                👋
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.2 }}>
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 700,
                  fontSize: { sm: '0.45rem', md: '0.52rem' },
                  lineHeight: 1,
                  background: `linear-gradient(135deg, ${theme.palette.primary[700]}, ${theme.palette.primary[500]})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Welcome
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    fontSize: { sm: '0.62rem', md: '0.66rem' },
                    lineHeight: 1,
                    background: `linear-gradient(135deg, ${theme.palette.primary[700]}, ${theme.palette.primary[500]})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  User
                </Typography>
                <Box sx={{
                  width: 5, height: 5, borderRadius: '50%',
                  background: '#4CAF50',
                  boxShadow: '0 0 4px #4CAF50',
                }} />
              </Box>
            </Box>
          </Box>

          <Profile />
        </Stack>
      </ToolbarStyled>
    </AppBarStyled>
  );
};

export default Header;
