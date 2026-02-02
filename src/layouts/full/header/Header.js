import { useState, useEffect } from 'react';
import {
  Box, AppBar, Toolbar, styled, Stack,
  TextField, InputAdornment, Paper, List, ListItemButton,
  Typography, ClickAwayListener, Fade, useTheme
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon, Newspaper as NewspaperIcon, EventAvailable as EventAvailableIcon } from '@mui/icons-material';

// components
import Profile from './Profile';
import { fetchSearchSuggestions } from '../../../services/searchApi';
import { withOpacity } from '../../../theme/palette';

// Define styled components outside to prevent re-creation on each render
const AppBarStyled = styled(AppBar)(({ theme }) => ({
  boxShadow: `
      0 4px 24px ${withOpacity(theme.palette.primary[600], 0.15)},
      0 2px 8px ${withOpacity(theme.palette.primary[900], 0.08)}
    `,
  background: `linear-gradient(135deg,
      ${withOpacity(theme.palette.primary[50], 0.95)} 0%,
      ${withOpacity(theme.palette.primary[100], 0.92)} 30%,
      ${withOpacity(theme.palette.primary[50], 0.94)} 70%,
      ${withOpacity(theme.palette.common.white, 0.96)} 100%
    )`,
  justifyContent: 'center',
  backdropFilter: 'blur(24px) saturate(180%)',
  width: '100%',
  position: 'relative',
  zIndex: theme.zIndex.drawer + 1,
  overflow: 'visible',  // Changed from 'hidden' to 'visible' to allow dropdown to show
  borderBottom: `1px solid ${withOpacity(theme.palette.primary[200], 0.4)}`,
  [theme.breakpoints.up('lg')]: {
    minHeight: '76px',
  },

  // Animated gradient overlay - DISABLED
  // '&::before': {
  //   content: '""',
  //   position: 'absolute',
  //   top: 0,
  //   left: '-100%',
  //   width: '200%',
  //   height: '100%',
  //   background: `linear-gradient(90deg,
  //       transparent,
  //       ${withOpacity(theme.palette.primary[200], 0.3)},
  //       transparent
  //     )`,
  //   animation: 'shimmer 10s infinite ease-in-out',
  //   pointerEvents: 'none',
  // },

  // Decorative pattern overlay - DISABLED
  // '&::after': {
  //   content: '""',
  //   position: 'absolute',
  //   top: 0,
  //   left: 0,
  //   right: 0,
  //   bottom: 0,
  //   background: `
  //       radial-gradient(circle at 10% 20%, ${withOpacity(theme.palette.primary[300], 0.08)} 0%, transparent 40%),
  //       radial-gradient(circle at 90% 80%, ${withOpacity(theme.palette.primary[400], 0.06)} 0%, transparent 40%)
  //     `,
  //   pointerEvents: 'none',
  // },

  // Bottom accent line with gradient - DISABLED
  // '& .header-accent': {
  //   position: 'absolute',
  //   bottom: 0,
  //   left: 0,
  //   right: 0,
  //   height: '3px',
  //   background: `linear-gradient(90deg,
  //       transparent 0%,
  //       ${theme.palette.primary[400]} 15%,
  //       ${theme.palette.primary[600]} 50%,
  //       ${theme.palette.primary[400]} 85%,
  //       transparent 100%
  //     )`,
  //   boxShadow: `0 0 12px ${withOpacity(theme.palette.primary[500], 0.4)}`,
  // },

  // '@keyframes shimmer': {
  //   '0%': { transform: 'translateX(0)' },
  //   '50%': { transform: 'translateX(50%)' },
  //   '100%': { transform: 'translateX(0%)' },
  // },
}));

const ToolbarStyled = styled(Toolbar)(({ theme }) => ({
  width: '100%',
  color: theme.palette.primary[700],
  padding: '0 24px',
  minHeight: '76px',
  position: 'relative',
  zIndex: 2,
}));

const Header = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState({ title: [], entity_name: [] });
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

  // Search functionality
  useEffect(() => {
    let timeout;
    let cancelled = false;

    if (searchQuery && searchQuery.length >= 3) {
      console.log('Search query length >= 3, will fetch suggestions for:', searchQuery);
      setIsLoadingSuggestions(true);
      timeout = setTimeout(() => {
        console.log('Fetching suggestions for:', searchQuery);
        fetchSearchSuggestions(searchQuery)
          .then(data => {
            console.log('Received suggestions data:', data);
            if (!cancelled) {
              // Map API response (titles, events) to component state (title, entity_name)
              const mappedData = {
                title: data.titles || [],
                entity_name: data.events || []
              };
              console.log('Mapped data:', mappedData);
              console.log('Total titles:', mappedData.title.length);
              console.log('Total entities:', mappedData.entity_name.length);
              setSuggestions(mappedData);
              setIsLoadingSuggestions(false);
              // Open suggestions if there's data
              if (mappedData.title.length > 0 || mappedData.entity_name.length > 0) {
                setSuggestionsOpen(true);
                console.log('Suggestions set and dropdown opened');
              } else {
                setSuggestionsOpen(false);
                console.log('No suggestions found');
              }
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
      console.log('Search query too short, closing suggestions');
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
      // Add refresh=true to force fresh data load on every search
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

  return (
    <AppBarStyled position="static" color="default">
      <ToolbarStyled>
        {/* Enhanced Search Section - Left Side with Attractive Design */}
        <Box sx={{
          position: 'relative',
          width: { xs: '100%', sm: 380, md: 450, lg: 520 },
          maxWidth: 520,
          mr: { xs: 1, md: 3 },
        }}>
          <ClickAwayListener onClickAway={() => {
            setSuggestionsOpen(false);
          }}>
            <Box sx={{ position: 'relative' }}>
              <TextField
                size="small"
                placeholder="Search news, events, and more..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                autoComplete="off"
                name="search-query"
                inputProps={{
                  autoComplete: 'off',
                  'aria-autocomplete': 'list',
                  'aria-controls': 'search-suggestions',
                }}
                InputProps={{
                  autoComplete: 'off',
                  startAdornment: (
                    <InputAdornment position="start">
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: 38,
                          height: 38,
                          borderRadius: '11px',
                          background: `linear-gradient(135deg,
                              ${withOpacity(theme.palette.primary[200], 0.95)} 0%,
                              ${withOpacity(theme.palette.primary[300], 0.85)} 50%,
                              ${withOpacity(theme.palette.primary[400], 0.9)} 100%
                            )`,
                          border: `2px solid ${withOpacity(theme.palette.primary[400], 0.4)}`,
                          boxShadow: `
                              0 3px 12px ${withOpacity(theme.palette.primary[400], 0.35)},
                              0 2px 6px ${withOpacity(theme.palette.primary[500], 0.25)},
                              inset 0 1px 0 ${withOpacity(theme.palette.common.white, 0.6)}
                            `,
                          transition: 'none',
                        }}
                      >
                        <SearchIcon sx={{
                          color: theme.palette.primary[900],
                          fontSize: 22,
                          filter: 'drop-shadow(0 1px 2px rgba(255, 255, 255, 0.4))',
                          fontWeight: 600,
                        }} />
                      </Box>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  width: '100%',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '14px',
                    height: '52px',
                    fontSize: '0.95rem',
                    background: `linear-gradient(135deg,
                        ${theme.palette.common.white} 0%,
                        ${withOpacity(theme.palette.primary[50], 0.5)} 100%
                      )`,
                    color: theme.palette.primary[900],
                    position: 'relative',
                    transition: 'none',
                    boxShadow: `
                        0 3px 12px ${withOpacity(theme.palette.primary[600], 0.2)},
                        0 2px 6px ${withOpacity(theme.palette.primary[700], 0.15)},
                        0 1px 3px rgba(0, 0, 0, 0.1),
                        inset 0 1px 0 rgba(255, 255, 255, 1)
                      `,
                    backdropFilter: 'blur(12px) saturate(160%)',
                    WebkitBackdropFilter: 'blur(12px) saturate(160%)',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '3px',
                      borderRadius: '16px 16px 0 0',
                      background: `linear-gradient(90deg,
                          ${theme.palette.primary[300]} 0%,
                          ${theme.palette.primary[500]} 25%,
                          ${theme.palette.primary.main} 50%,
                          ${theme.palette.primary[500]} 75%,
                          ${theme.palette.primary[300]} 100%
                        )`,
                      opacity: 0.5,
                      boxShadow: `0 0 8px ${withOpacity(theme.palette.primary[500], 0.3)}`,
                    },
                    '& fieldset': {
                      borderColor: theme.palette.primary[300],
                      borderWidth: '2.5px',
                      transition: 'none',
                    },
                    '&:hover': {
                      transform: 'none',
                      background: `linear-gradient(135deg,
                          ${theme.palette.common.white} 0%,
                          ${withOpacity(theme.palette.primary[100], 0.6)} 100%
                        )`,
                      boxShadow: `
                          0 5px 20px ${withOpacity(theme.palette.primary[600], 0.28)},
                          0 3px 10px ${withOpacity(theme.palette.primary[600], 0.2)},
                          0 2px 6px rgba(0, 0, 0, 0.12),
                          inset 0 1px 0 rgba(255, 255, 255, 1)
                        `,
                      '&::before': {
                        opacity: 0.9,
                        height: '4px',
                      },
                    },
                    '&:hover fieldset': {
                      borderColor: theme.palette.primary[400],
                      borderWidth: '3px',
                    },
                    '&.Mui-focused': {
                      transform: 'none',
                      background: theme.palette.common.white,
                      boxShadow: `
                          0 0 0 4px ${withOpacity(theme.palette.primary[300], 0.35)},
                          0 6px 28px ${withOpacity(theme.palette.primary[600], 0.35)},
                          0 4px 14px ${withOpacity(theme.palette.primary[600], 0.25)},
                          0 2px 8px rgba(0, 0, 0, 0.15),
                          inset 0 2px 0 rgba(255, 255, 255, 1),
                          0 0 20px ${withOpacity(theme.palette.primary[500], 0.2)}
                        `,
                      '&::before': {
                        opacity: 1,
                        height: '4px',
                        background: `linear-gradient(90deg,
                            ${theme.palette.primary[500]} 0%,
                            ${theme.palette.primary[600]} 25%,
                            ${theme.palette.primary[700]} 50%,
                            ${theme.palette.primary[600]} 75%,
                            ${theme.palette.primary[500]} 100%
                          )`,
                        boxShadow: `0 0 14px ${withOpacity(theme.palette.primary[600], 0.5)}`,
                      },
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: theme.palette.primary[600],
                      borderWidth: '3px',
                    },
                  },
                  '& .MuiInputBase-input': {
                    padding: '15px 18px',
                    color: theme.palette.primary[900],
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    letterSpacing: '0.2px',
                    '&::placeholder': {
                      color: theme.palette.primary[600],
                      opacity: 0.7,
                      fontWeight: 500,
                    },
                  },
                }}
              />

              {/* Search Suggestions - Professional Dark Theme */}
              <Box
                id="search-suggestions"
                role="listbox"
                sx={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  zIndex: 1300,
                  mt: 1.5,
                }}
              >
                {/* Loading Indicator */}
                {isLoadingSuggestions && searchQuery.length >= 3 && (
                  <Fade in={true} timeout={200}>
                    <Paper
                      elevation={0}
                      sx={{
                        borderRadius: '14px',
                        background: `linear-gradient(145deg,
                            ${theme.palette.common.white} 0%,
                            ${withOpacity(theme.palette.primary[50], 0.95)} 100%
                          )`,
                        border: `2px solid ${withOpacity(theme.palette.primary[300], 0.5)}`,
                        boxShadow: `
                            0 16px 48px ${withOpacity(theme.palette.primary[400], 0.25)},
                            0 8px 24px ${withOpacity(theme.palette.primary[300], 0.2)}
                          `,
                        backdropFilter: 'blur(30px)',
                        py: 2,
                        px: 3,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 1.5,
                      }}
                    >
                      <Box
                        sx={{
                          width: 20,
                          height: 20,
                          border: `2.5px solid ${theme.palette.primary[500]}`,
                          borderTopColor: 'transparent',
                          borderRadius: '50%',
                          animation: 'none',
                        }}
                      />
                      <Typography sx={{
                        color: theme.palette.primary[900],
                        fontWeight: 600,
                        fontSize: '0.85rem',
                      }}>
                        Loading suggestions...
                      </Typography>
                    </Paper>
                  </Fade>
                )}

                {/* No Results Message */}
                {!isLoadingSuggestions && searchQuery.length >= 3 && suggestionsOpen &&
                  suggestions.title?.length === 0 && suggestions.entity_name?.length === 0 && (
                    <Fade in={true} timeout={300}>
                      <Paper
                        elevation={0}
                        sx={{
                          borderRadius: '14px',
                          background: `linear-gradient(145deg,
                            ${theme.palette.common.white} 0%,
                            ${withOpacity(theme.palette.primary[50], 0.95)} 100%
                          )`,
                          border: `2px solid ${withOpacity(theme.palette.primary[300], 0.5)}`,
                          boxShadow: `
                            0 16px 48px ${withOpacity(theme.palette.primary[400], 0.25)},
                            0 8px 24px ${withOpacity(theme.palette.primary[300], 0.2)}
                          `,
                          backdropFilter: 'blur(30px)',
                          py: 3,
                          px: 3,
                          textAlign: 'center',
                        }}
                      >
                        <Typography sx={{
                          color: theme.palette.primary[900],
                          fontWeight: 600,
                          fontSize: '0.9rem',
                          mb: 0.75,
                        }}>
                          No results found
                        </Typography>
                        <Typography sx={{
                          color: theme.palette.primary[700],
                          fontSize: '0.75rem',
                        }}>
                          Try a different search term
                        </Typography>
                      </Paper>
                    </Fade>
                  )}

                {/* Suggestions List */}
                {!isLoadingSuggestions && suggestionsOpen && (suggestions.title?.length > 0 || suggestions.entity_name?.length > 0) && (
                  <Fade in={true} timeout={350}>
                    <Paper
                      elevation={0}
                      sx={{
                        maxHeight: 420,
                        overflow: 'auto',
                        borderRadius: '16px',
                        // Better contrast background for visibility
                        background: theme.palette.common.white,
                        border: `2px solid ${theme.palette.primary[300]}`,
                        boxShadow: `
                            0 18px 56px ${withOpacity(theme.palette.primary[400], 0.25)},
                            0 10px 28px ${withOpacity(theme.palette.primary[300], 0.2)},
                            0 3px 12px ${withOpacity(theme.palette.primary[200], 0.15)},
                            inset 0 1px 0 ${withOpacity(theme.palette.common.white, 0.95)},
                            inset 0 -1px 0 ${withOpacity(theme.palette.primary[200], 0.3)}
                          `,
                        backdropFilter: 'blur(32px) saturate(180%)',
                        WebkitBackdropFilter: 'blur(32px) saturate(180%)',
                        position: 'relative',

                        // Subtle gradient overlay
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          borderRadius: '16px',
                          background: `radial-gradient(circle at 20% 10%,
                            ${withOpacity(theme.palette.primary[200], 0.08)} 0%,
                            transparent 60%
                          )`,
                          pointerEvents: 'none',
                        },

                        // Compact scrollbar
                        '&::-webkit-scrollbar': {
                          width: '8px',
                        },
                        '&::-webkit-scrollbar-track': {
                          background: withOpacity(theme.palette.primary[100], 0.5),
                          borderRadius: '8px',
                          margin: '8px',
                        },
                        '&::-webkit-scrollbar-thumb': {
                          background: `linear-gradient(145deg,
                              ${theme.palette.primary[400]} 0%,
                              ${theme.palette.primary[500]} 50%,
                              ${theme.palette.primary[600]} 100%
                            )`,
                          borderRadius: '8px',
                          border: `2px solid ${withOpacity(theme.palette.primary[100], 0.5)}`,
                          boxShadow: `0 2px 6px ${withOpacity(theme.palette.primary[500], 0.25)}`,
                          '&:hover': {
                            background: `linear-gradient(145deg,
                                ${theme.palette.primary[300]} 0%,
                                ${theme.palette.primary[400]} 50%,
                                ${theme.palette.primary[500]} 100%
                              )`,
                          }
                        },
                      }}
                    >
                      {/* News Titles Section */}
                      {suggestions.title && suggestions.title.length > 0 && (
                        <Box sx={{ position: 'relative' }}>
                          {/* Compact Section Header */}
                          <Box sx={{
                            px: 2,
                            py: 1.5,
                            background: theme.palette.primary[600],
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.5,
                            borderBottom: `2px solid ${theme.palette.primary[200]}`,
                            borderTopLeftRadius: '16px',
                            borderTopRightRadius: '16px',
                          }}>
                            {/* Compact Icon Badge */}
                            <Box sx={{
                              width: 28,
                              height: 28,
                              borderRadius: '8px',
                              background: theme.palette.primary[600],
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              boxShadow: `0 2px 6px ${withOpacity(theme.palette.primary[600], 0.25)}`,
                            }}>
                              <NewspaperIcon sx={{
                                color: 'white',
                                fontSize: 14,
                              }} />
                            </Box>
                            {/* Compact Section Title */}
                            <Typography
                              sx={{
                                color: theme.palette.primary[900],
                                fontWeight: 700,
                                fontSize: '0.85rem',
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                                fontFamily: "'Inter', 'Segoe UI', sans-serif",
                              }}
                            >
                              News Articles
                            </Typography>
                            {/* Compact Count Badge */}
                            <Box sx={{
                              ml: 'auto',
                              px: 1.2,
                              py: 0.4,
                              borderRadius: '10px',
                              background: theme.palette.primary[600],
                              boxShadow: `0 2px 4px ${withOpacity(theme.palette.primary[600], 0.2)}`,
                            }}>
                              <Typography sx={{
                                color: 'white',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                fontFamily: "'Inter', 'Segoe UI', sans-serif",
                              }}>
                                {suggestions.title.length}
                              </Typography>
                            </Box>
                          </Box>

                          {/* Compact News Items List */}
                          <List sx={{ py: 1.5, px: 1.5 }}>
                            {suggestions.title.map((title, index) => (
                              <ListItemButton
                                key={`title-${index}`}
                                onClick={() => handleSuggestionSelect(title)}
                                sx={{
                                  mb: 0.8,
                                  borderRadius: '12px',
                                  transition: 'all 0.2s ease',
                                  background: theme.palette.primary[400],
                                  border: `1.5px solid ${theme.palette.primary[400]}`,
                                  boxShadow: `0 2px 6px ${withOpacity(theme.palette.primary[300], 0.1)}`,
                                  position: 'relative',
                                  overflow: 'hidden',

                                  // Animated left accent
                                  '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    left: 0,
                                    top: 0,
                                    bottom: 0,
                                    width: '4px',
                                    background: theme.palette.primary[600],
                                    opacity: 0.4,
                                    transition: 'all 0.2s ease',
                                  },

                                  // Hover effects
                                  '&:hover': {
                                    background: theme.palette.primary[50],
                                    transform: 'translateX(4px)',
                                    border: `1.5px solid ${theme.palette.primary[400]}`,
                                    boxShadow: `0 4px 10px ${withOpacity(theme.palette.primary[400], 0.15)}`,
                                    '&::before': {
                                      opacity: 1,
                                      width: '5px',
                                    },
                                  },

                                  '&:active': {
                                    transform: 'translateX(2px)',
                                  }
                                }}
                              >
                                <Box sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  width: '100%',
                                  gap: 1,
                                }}>

                                  {/* Compact Text Content */}
                                  <Box sx={{ flex: 1, minWidth: 0 }}>
                                    <Typography
                                      sx={{
                                        color: theme.palette.primary[900],
                                        fontWeight: 600,
                                        fontSize: '0.8rem',
                                        lineHeight: 1.1,
                                        letterSpacing: '0.01em',
                                        fontFamily: "'Inter', 'Segoe UI', sans-serif",
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                      }}
                                    >
                                      {title}
                                    </Typography>
                                  </Box>
                                </Box>
                              </ListItemButton>
                            ))}
                          </List>
                        </Box>
                      )}

                      {/* Entity Names Section */}
                      {suggestions.entity_name && suggestions.entity_name.length > 0 && (
                        <Box sx={{ position: 'relative' }}>
                          {/* Compact Separator if both sections exist */}
                          {suggestions.title && suggestions.title.length > 0 && (
                            <Box sx={{                            
                              height: '1.5px',
                              background: `linear-gradient(90deg,
                                transparent 0%,
                                ${withOpacity(theme.palette.primary[500], 0.4)} 20%,
                                ${withOpacity(theme.palette.primary[400], 0.5)} 50%,
                                ${withOpacity(theme.palette.primary[500], 0.4)} 80%,
                                transparent 100%
                              )`,
                              position: 'relative',
                              '&::after': {
                                content: '""',
                                position: 'absolute',
                                top: -0.75,
                                left: '45%',
                                width: '10%',
                                height: '3px',
                                background: theme.palette.primary[300],
                                filter: 'blur(3px)',
                              }
                            }} />
                          )}

                          {/* Compact Section Header */}
                          <Box sx={{
                            px: 2,
                            py: 1.5,
                            background: theme.palette.primary[600],
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.5,
                            borderBottom: `2px solid ${theme.palette.primary[200]}`,
                          }}>
                            {/* Compact Icon Badge */}
                            <Box sx={{
                              width: 28,
                              height: 28,
                              borderRadius: '8px',
                              background: theme.palette.primary[600],
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              boxShadow: `0 2px 6px ${withOpacity(theme.palette.primary[600], 0.25)}`,
                            }}>
                              <EventAvailableIcon sx={{
                                color: 'white',
                                fontSize: 15,
                              }} />
                            </Box>
                            {/* Compact Section Title */}
                            <Typography
                              sx={{
                                color: theme.palette.primary[900],
                                fontWeight: 700,
                                fontSize: '0.85rem',
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                                fontFamily: "'Inter', 'Segoe UI', sans-serif",
                              }}
                            >
                              Events & Entities
                            </Typography>
                            {/* Compact Count Badge */}
                            <Box sx={{
                              ml: 'auto',
                              px: 1.2,
                              py: 0.4,
                              borderRadius: '10px',
                              background: theme.palette.primary[600],
                              boxShadow: `0 2px 4px ${withOpacity(theme.palette.primary[600], 0.2)}`,
                            }}>
                              <Typography sx={{
                                color: 'white',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                fontFamily: "'Inter', 'Segoe UI', sans-serif",
                              }}>
                                {suggestions.entity_name.length}
                              </Typography>
                            </Box>
                          </Box>

                          {/* Compact Entity Names List */}
                          <List sx={{ py: 1.5, px: 1.5 }}>
                            {suggestions.entity_name.map((entity, index) => (
                              <ListItemButton
                                key={`entity-${index}`}
                                onClick={() => handleSuggestionSelect(entity)}
                                sx={{
                                  mb: 0.8,                                  
                                  borderRadius: '12px',
                                  transition: 'all 0.2s ease',
                                  background: theme.palette.primary[400],
                                  border: `1.5px solid ${theme.palette.primary[200]}`,
                                  boxShadow: `0 2px 6px ${withOpacity(theme.palette.primary[300], 0.1)}`,
                                  position: 'relative',
                                  overflow: 'hidden',

                                  // Animated left accent
                                  '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    left: 0,
                                    top: 0,
                                    bottom: 0,
                                    width: '4px',
                                    background: theme.palette.primary[600],
                                    opacity: 0.4,
                                    transition: 'all 0.2s ease',
                                  },

                                  // Hover effects
                                  '&:hover': {
                                    background: theme.palette.primary[50],
                                    transform: 'translateX(4px)',
                                    border: `1.5px solid ${theme.palette.primary[400]}`,
                                    boxShadow: `0 4px 10px ${withOpacity(theme.palette.primary[400], 0.15)}`,
                                    '&::before': {
                                      opacity: 1,
                                      width: '5px',
                                    },
                                  },

                                  '&:active': {
                                    transform: 'translateX(2px)',
                                  }
                                }}
                              >
                                <Box sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  width: '100%',
                                  gap: 1,
                                }}>

                                  {/* Compact Text Content */}
                                  <Box sx={{ flex: 1, minWidth: 0 }}>
                                    <Typography
                                      sx={{
                                        color: theme.palette.primary[900],
                                        fontWeight: 600,
                                        fontSize: '0.8rem',
                                        lineHeight: 1.1,
                                        letterSpacing: '0.01em',
                                        fontFamily: "'Inter', 'Segoe UI', sans-serif",
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                      }}
                                    >
                                      {entity}
                                    </Typography>

                                  </Box>


                                </Box>
                              </ListItemButton>
                            ))}
                          </List>
                        </Box>
                      )}
                    </Paper>
                  </Fade>
                )}
              </Box>
            </Box>
          </ClickAwayListener>
        </Box>

        {/* Flexible Spacer - Push Welcome/Profile to Right */}
        <Box sx={{ flex: 1 }} />

        {/* Welcome Section & Profile - Compact Design */}
        <Stack spacing={{ xs: 1, md: 1.2 }} direction="row" alignItems="center">
          {/* Welcome Card - Compact & Creative */}
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
              transition: 'none',
              position: 'relative',
              overflow: 'hidden',
              cursor: 'pointer',
              '&:hover': {
                transform: 'none',
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
            {/* Compact Icon Circle with Ring Animation */}
            <Box sx={{
              minWidth: { sm: 28, md: 32 },
              height: { sm: 28, md: 32 },
              borderRadius: '50%',
              background: `linear-gradient(135deg,
                ${theme.palette.primary[400]} 0%,
                ${theme.palette.primary[500]} 50%,
                ${theme.palette.primary[600]} 100%
              )`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `
                0 2px 8px ${withOpacity(theme.palette.primary[400], 0.3)},
                inset 0 1px 0 ${withOpacity(theme.palette.common.white, 0.2)}
              `,
              border: `1px solid ${withOpacity(theme.palette.primary[300], 0.35)}`,
              transition: 'none',
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                border: `2px solid ${theme.palette.primary[500]}`,
                animation: 'ripple 2s infinite ease-out',
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                border: `2px solid ${theme.palette.primary[400]}`,
                animation: 'ripple 2s infinite ease-out 1s',
              },
              '@keyframes ripple': {
                '0%': {
                  width: '100%',
                  height: '100%',
                  opacity: 1,
                },
                '100%': {
                  width: '180%',
                  height: '180%',
                  opacity: 0,
                }
              }
            }}>
              <Typography sx={{
                fontSize: { sm: '0.85rem', md: '0.95rem' },
                filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.18))',
                position: 'relative',
                zIndex: 1,
              }}>
                👋
              </Typography>
            </Box>

            {/* Compact Text Content */}
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: 0.2,
            }}>
              {/* Compact Greeting Text */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Typography
                  variant="caption"
                  sx={{
                    color: theme.palette.primary[700],
                    fontWeight: 700,
                    fontSize: { sm: '0.45rem', md: '0.52rem' },
                    lineHeight: 1,
                    letterSpacing: '0.25px',
                    background: `linear-gradient(135deg,
                      ${theme.palette.primary[700]} 0%,
                      ${theme.palette.primary[600]} 50%,
                      ${theme.palette.primary[500]} 100%
                    )`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    position: 'relative',
                    display: 'inline-block',
                  }}
                >
                  Welcome
                </Typography>
              </Box>

              {/* Name with Compact Badge */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
                <Typography
                  variant="h6"
                  sx={{
                    color: theme.palette.primary[700],
                    fontWeight: 600,
                    fontSize: { sm: '0.62rem', md: '0.66rem' },
                    mb: 0,
                    lineHeight: 1,
                    letterSpacing: '-0.015em',
                    background: `linear-gradient(135deg,
                      ${theme.palette.primary[700]} 0%,
                      ${theme.palette.primary[600]} 50%,
                      ${theme.palette.primary[500]} 100%
                    )`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    position: 'relative',
                    display: 'inline-block',
                  }}
                >
                  User
                </Typography>

                {/* Compact Status Badge */}
                <Box sx={{
                  px: 0.5,
                  py: 0.15,
                  borderRadius: '5px',
                  background: `linear-gradient(135deg,
                    ${withOpacity(theme.palette.primary[100], 0.6)} 0%,
                    ${withOpacity(theme.palette.primary[200], 0.4)} 100%
                  )`,
                  border: `0.5px solid ${withOpacity(theme.palette.primary[400], 0.3)}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.3,
                }}>
                  <Box sx={{
                    width: 3.5,
                    height: 3.5,
                    borderRadius: '50%',
                    background: '#4CAF50',
                    boxShadow: '0 0 3px #4CAF50',
                    animation: 'none',
                  }} />

                </Box>
              </Box>
            </Box>
          </Box>

          {/* Profile Avatar */}
          <Profile />
        </Stack>
      </ToolbarStyled>

      {/* Bottom accent line - DISABLED */}
      {/* <Box className="header-accent" /> */}
    </AppBarStyled>
  );
};

export default Header;
