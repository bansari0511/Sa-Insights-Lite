import React, { useEffect, useState } from "react";
import {
  Box, Paper, Typography, Container, Stack, Grid, Chip,
  Skeleton, FormControl, InputLabel, Select,
  MenuItem, Button, ToggleButtonGroup, ToggleButton,
  Card, CardMedia, CardContent, alpha, useTheme, TextField,
  IconButton, Drawer, Checkbox, ListItemText, OutlinedInput,
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
  Menu as MenuIcon,
  ArrowBack as ArrowBackIcon,
  Close as CloseIcon,
  SelectAll as SelectAllIcon
} from "@mui/icons-material";
import { useLocation, useNavigate } from 'react-router-dom';
import { mapTheme } from '../../theme';

import { fetchNewsData, fetchEventsData, fetchCombinedData, fetchIntelligenceData } from '../../services/searchApi';
import ArticleDetailPage from '../newsRoom/ArticleDetailPage';

// Multi-select Filter Dropdown Component
function FilterDropdown({ label, values, selected, setSelected, color = 'primary' }) {
  const theme = useTheme();

  const handleChange = (event) => {
    const value = event.target.value;
    setSelected(typeof value === 'string' ? value.split(',') : value);
  };

  const handleSelectAll = () => {
    if (selected.length === values.length) {
      setSelected([]);
    } else {
      setSelected([...values]);
    }
  };

  return (
    <FormControl size="small" fullWidth>
      <InputLabel
        sx={{
          fontSize: '0.875rem',
          '&.Mui-focused': {
            color: theme.palette[color].main
          }
        }}
      >
        {label}
      </InputLabel>
      <Select
        multiple
        value={selected}
        onChange={handleChange}
        input={<OutlinedInput label={label} />}
        renderValue={(selected) => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {selected.length > 2 ? (
              <Chip
                size="small"
                label={`${selected.length} selected`}
                sx={{
                  height: 22,
                  fontSize: '0.75rem',
                  bgcolor: alpha(theme.palette[color].main, 0.1),
                  color: theme.palette[color].main,
                  fontWeight: 500
                }}
              />
            ) : (
              selected.map((value) => (
                <Chip
                  key={value}
                  label={value}
                  size="small"
                  sx={{
                    height: 22,
                    fontSize: '0.75rem',
                    bgcolor: alpha(theme.palette[color].main, 0.1),
                    color: theme.palette[color].main,
                    fontWeight: 500
                  }}
                />
              ))
            )}
          </Box>
        )}
        sx={{
          borderRadius: 1.5,
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: alpha(theme.palette.divider, 0.3),
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette[color].main,
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette[color].main,
          }
        }}
        MenuProps={{
          PaperProps: {
            sx: {
              maxHeight: 300,
              borderRadius: 2,
              boxShadow: theme.shadows[8],
              mt: 0.5
            }
          }
        }}
      >
        <MenuItem
          onClick={handleSelectAll}
          sx={{
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
            mb: 0.5,
            '&:hover': {
              bgcolor: alpha(theme.palette[color].main, 0.08)
            }
          }}
        >
          <Checkbox
            checked={selected.length === values.length && values.length > 0}
            indeterminate={selected.length > 0 && selected.length < values.length}
            sx={{
              color: theme.palette[color].main,
              '&.Mui-checked': {
                color: theme.palette[color].main,
              }
            }}
          />
          <ListItemText
            primary={
              <Typography variant="body2" fontWeight={600}>
                {selected.length === values.length ? 'Deselect All' : 'Select All'}
              </Typography>
            }
          />
          <SelectAllIcon fontSize="small" sx={{ color: theme.palette[color].main, ml: 1 }} />
        </MenuItem>
        {values.map((value) => (
          <MenuItem
            key={value}
            value={value}
            sx={{
              '&:hover': {
                bgcolor: alpha(theme.palette[color].main, 0.08)
              }
            }}
          >
            <Checkbox
              checked={selected.indexOf(value) > -1}
              sx={{
                color: theme.palette[color].main,
                '&.Mui-checked': {
                  color: theme.palette[color].main,
                }
              }}
            />
            <ListItemText
              primary={
                <Typography variant="body2" sx={{ fontWeight: selected.indexOf(value) > -1 ? 600 : 400 }}>
                  {value}
                </Typography>
              }
            />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

// Enhanced Filter Bar Component
function FilterBar({
  mode, filters, setFilters, clearAll,
  options, setMode, dateFrom, setDateFrom, dateTo, setDateTo
}) {
  const theme = useTheme();

  return (
    <Box sx={{ p: 3 }}>
      <Stack spacing={3}>
        {/* Mode Selection */}
        <Box>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
            Content Type
          </Typography>
          <ToggleButtonGroup
            orientation="vertical"
            size="small"
            exclusive
            value={mode}
            onChange={(_, v) => v && setMode(v)}
            sx={{ width: '100%', justifyContent: "flex-start", display: "flex" }}
          >
            <ToggleButton
              value="news"
              sx={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'flex-start',
                gap: 1,
                py: 1,
                borderRadius: '6px !important',
                border: `2px solid ${alpha(theme.palette.divider, 0.3)} !important`,
                color: theme.palette.text.secondary,
                background: '#ffffff',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: theme.shadows[2],
                  border: `2px solid ${alpha(mapTheme.colors.searchUI.news.main, 0.5)} !important`,
                },
                '&.Mui-selected': {
                  background: mapTheme.colors.searchUI.news.gradient,
                  color: mapTheme.colors.searchUI.news.dark,
                  border: `2px solid ${mapTheme.colors.searchUI.news.main} !important`,
                  fontWeight: 'bold',
                  transform: 'translateY(-2px)',
                  boxShadow: theme.shadows[4],
                  '& .MuiSvgIcon-root': {
                    color: '#1976d2',
                    filter: 'drop-shadow(0 1px 2px rgba(25,118,210,0.3))'
                  }
                }
              }}
            >
              <NewspaperIcon fontSize="small" />
              <Typography variant="caption" fontWeight="inherit" fontSize="0.8rem" color="black">
                News/Insights
              </Typography>
            </ToggleButton>

            <ToggleButton
              value="events"
              sx={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'flex-start',
                gap: 1,
                py: 1,
                borderRadius: '6px !important',
                border: `2px solid ${alpha(theme.palette.divider, 0.3)} !important`,
                color: theme.palette.text.secondary,
                background: '#ffffff',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: theme.shadows[2],
                  border: `2px solid ${alpha('#ff5722', 0.5)} !important`,
                },
                '&.Mui-selected': {
                  background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
                  color: '#d84315',
                  border: `2px solid #ff5722 !important`,
                  fontWeight: 'bold',
                  transform: 'translateY(-2px)',
                  boxShadow: theme.shadows[4],
                  '& .MuiSvgIcon-root': {
                    color: '#d84315',
                    filter: 'drop-shadow(0 1px 2px rgba(216,67,21,0.3))'
                  }
                }
              }}
            >
              <EventAvailableIcon fontSize="small" />
              <Typography variant="caption" fontWeight="inherit" fontSize="0.8rem" color="black">
                Events
              </Typography>
            </ToggleButton>

            <ToggleButton
              value="intelligence"
              sx={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'flex-start',
                gap: 1,
                py: 1,
                borderRadius: '6px !important',
                border: `2px solid ${alpha(theme.palette.divider, 0.3)} !important`,
                color: theme.palette.text.secondary,
                background: '#ffffff',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: theme.shadows[2],
                  border: `2px solid ${alpha('#2196f3', 0.5)} !important`,
                },
                '&.Mui-selected': {
                  background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
                  color: '#1976d2',
                  border: `2px solid #2196f3 !important`,
                  fontWeight: 'bold',
                  transform: 'translateY(-2px)',
                  boxShadow: theme.shadows[4],
                  '& .MuiSvgIcon-root': {
                    color: '#1976d2',
                    filter: 'drop-shadow(0 1px 2px rgba(25,118,210,0.3))'
                  }
                }
              }}
            >
              <SecurityIcon fontSize="small" />
              <Typography variant="caption" fontWeight="inherit" fontSize="0.8rem" color="black">
                Intelligence Briefings
              </Typography>
            </ToggleButton>

            <ToggleButton
              value="both"
              sx={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'flex-start',
                gap: 1,
                py: 1,
                borderRadius: '6px !important',
                border: `2px solid ${alpha(theme.palette.divider, 0.3)} !important`,
                color: theme.palette.text.secondary,
                background: '#ffffff',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: theme.shadows[2],
                  border: `2px solid ${alpha('#9c27b0', 0.5)} !important`,
                },
                '&.Mui-selected': {
                  background: 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)',
                  color: '#7b1fa2',
                  border: `2px solid #9c27b0 !important`,
                  fontWeight: 'bold',
                  transform: 'translateY(-2px)',
                  boxShadow: theme.shadows[4],
                  '& .MuiSvgIcon-root': {
                    color: '#7b1fa2',
                    filter: 'drop-shadow(0 1px 2px rgba(123,31,162,0.3))'
                  }
                }
              }}
            >
              <Box sx={{ display: "flex", gap: 0.5 }}>
                <NewspaperIcon fontSize="small" />
                <EventAvailableIcon fontSize="small" />
              </Box>
              <Typography variant="caption" fontWeight="inherit" color="black">All</Typography>
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* Date Range */}
        <Box>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: theme.palette.text.primary, fontSize: '0.95rem' }}>
            <CalendarMonthIcon sx={{ mr: 0.5, verticalAlign: 'middle', fontSize: '1.1rem' }} />
            Date Range
          </Typography>
          <Stack spacing={1.5}>
            <TextField
              type="date"
              label="From"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              fullWidth
              size="small"
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                max: dateTo || new Date().toISOString().split('T')[0],
                style: {
                  cursor: 'pointer',
                  colorScheme: theme.palette.mode === 'dark' ? 'dark' : 'light'
                }
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1.5,
                  bgcolor: alpha(theme.palette.background.paper, 0.6),
                  fontSize: '0.875rem',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    bgcolor: alpha(theme.palette.background.paper, 0.9),
                    boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.1)}`,
                  },
                  '&.Mui-focused': {
                    bgcolor: theme.palette.background.paper,
                    boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.15)}`,
                  }
                },
                '& .MuiInputLabel-root': {
                  fontSize: '0.875rem',
                },
              }}
            />
            <TextField
              type="date"
              label="To"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              fullWidth
              size="small"
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                min: dateFrom || undefined,
                max: new Date().toISOString().split('T')[0],
                style: {
                  cursor: 'pointer',
                  colorScheme: theme.palette.mode === 'dark' ? 'dark' : 'light'
                }
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1.5,
                  bgcolor: alpha(theme.palette.background.paper, 0.6),
                  fontSize: '0.875rem',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    bgcolor: alpha(theme.palette.background.paper, 0.9),
                    boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.1)}`,
                  },
                  '&.Mui-focused': {
                    bgcolor: theme.palette.background.paper,
                    boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.15)}`,
                  }
                },
                '& .MuiInputLabel-root': {
                  fontSize: '0.875rem',
                },
              }}
            />
          </Stack>
        </Box>

        {/* News Filters */}
        {(mode === "news" || mode === "both" || mode === "intelligence") && (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: theme.palette.text.primary, fontSize: '0.95rem' }}>
              <FilterListIcon sx={{ mr: 0.5, verticalAlign: 'middle', fontSize: '1.1rem' }} />
              News Filters
            </Typography>
            <Stack spacing={1.5}>
              <FilterDropdown
                label="Country"
                values={options.country || []}
                selected={filters.country || []}
                setSelected={(v) => setFilters(f => ({ ...f, country: v }))}
                color="primary"
              />
              <FilterDropdown
                label="Organisation"
                values={options.org || []}
                selected={filters.org || []}
                setSelected={(v) => setFilters(f => ({ ...f, org: v }))}
                color="primary"
              />
              <FilterDropdown
                label="NSAG"
                values={options.nsag || []}
                selected={filters.nsag || []}
                setSelected={(v) => setFilters(f => ({ ...f, nsag: v }))}
                color="primary"
              />
            </Stack>
          </Box>
        )}

        {/* Events Filters */}
        {(mode === "events" || mode === "both") && (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: theme.palette.text.primary, fontSize: '0.95rem' }}>
              <EventAvailableIcon sx={{ mr: 0.5, verticalAlign: 'middle', fontSize: '1.1rem' }} />
              Event Filters
            </Typography>
            <Stack spacing={1.5}>
              <FilterDropdown
                label="Event Country"
                values={options.eventcountry || []}
                selected={filters.eventcountry || []}
                setSelected={(v) => setFilters(f => ({ ...f, eventcountry: v }))}
                color="secondary"
              />
              <FilterDropdown
                label="Event Category"
                values={options.eventcategory || []}
                selected={filters.eventcategory || []}
                setSelected={(v) => setFilters(f => ({ ...f, eventcategory: v }))}
                color="secondary"
              />
              <FilterDropdown
                label="Event Location"
                values={options.eventlocation || []}
                selected={filters.eventlocation || []}
                setSelected={(v) => setFilters(f => ({ ...f, eventlocation: v }))}
                color="secondary"
              />
              <FilterDropdown
                label="Platforms"
                values={options.platforms || []}
                selected={filters.platforms || []}
                setSelected={(v) => setFilters(f => ({ ...f, platforms: v }))}
                color="secondary"
              />
              <FilterDropdown
                label="Actor Label"
                values={options.actorlabel || []}
                selected={filters.actorlabel || []}
                setSelected={(v) => setFilters(f => ({ ...f, actorlabel: v }))}
                color="secondary"
              />
              <FilterDropdown
                label="Actor Nation"
                values={options.actornation || []}
                selected={filters.actornation || []}
                setSelected={(v) => setFilters(f => ({ ...f, actornation: v }))}
                color="secondary"
              />
              <FilterDropdown
                label="Actor Type"
                values={options.actortype || []}
                selected={filters.actortype || []}
                setSelected={(v) => setFilters(f => ({ ...f, actortype: v }))}
                color="secondary"
              />
            </Stack>
          </Box>
        )}
      </Stack>
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
        display: "flex",
        flexDirection: "column",
        borderRadius: 3,
        transition: 'all 0.3s ease-in-out',
        cursor: 'pointer',
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
        <Box sx={{ overflow: 'hidden', position: 'relative' }}>
          <CardMedia
            component="img"
            height="200"
            image={item.imageurl}
            alt={item.title}
            sx={{
              transition: 'transform 0.3s ease-in-out',
              objectFit: 'cover',
            }}
          />
          <Box sx={{
            position: 'absolute',
            top: 12,
            right: 12,
          }}>
            <Chip
              size="small"
              label={item.index.toUpperCase()}
              sx={{
                bgcolor: item.index === 'news'
                  ? alpha(theme.palette.primary.main, 0.9)
                  : alpha(theme.palette.secondary.main, 0.9),
                color: 'white',
                fontWeight: 600,
                fontSize: '0.7rem',
                backdropFilter: 'blur(4px)'
              }}
            />
          </Box>
        </Box>
      )}
      <CardContent sx={{ flexGrow: 1, p: 2.5, display: 'flex', flexDirection: 'column' }}>
        {['events', 'intelligence briefings'].includes(item.index) && (
          <Box sx={{ mb: 2 }}>
            <Chip
              size="small"
              label={item.index.toUpperCase()}
              sx={{
                bgcolor: alpha(theme.palette.secondary.main, 0.9),
                color: 'white',
                fontWeight: 600,
                fontSize: '0.7rem',
              }}
            />
          </Box>
        )}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
          <CalendarMonthIcon
            fontSize="small"
            sx={{ color: theme.palette.text.secondary }}
          />
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
            {new Date(item.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}
          </Typography>
        </Box>

        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            lineHeight: 1.3,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            color: theme.palette.text.primary,
            mb: 1.5,
            fontSize: '1rem'
          }}
        >
          {item.title}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            display: '-webkit-box',
            WebkitLineClamp: 4,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: 1.6,
            flex: 1
          }}
        >
          {item.summary}
        </Typography>
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
  const sidebarWidth = 320;
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
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastDocId, setLastDocId] = useState("");
  const [hasNextPage, setHasNextPage] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [isViewingArticle, setIsViewingArticle] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);

  const stateKey = `search_state_${query}`;

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
      setItems([]);
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
            response = await fetchNewsData({
              ...commonParams,
              filters: {
                country: filters.country,
                org: filters.org,
                nsag: filters.nsag
              }
            });
        }

        if (response) {
          const records = response.records || [];
          setAllRecords(records);
          setItems(records);
          setLastDocId(response.lastdocid || "");
          setHasNextPage(response.hasMore || false);
          setTotalRecords(response.total || records.length);

          // Set filter options from response top-level fields
          setOptions(response);
        }
      } catch (error) {
        console.error('Error fetching search data:', error);
        setAllRecords([]);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [query, mode, filters, dateFrom, dateTo]);

  // Load more data
  const loadMore = async () => {
    if (!hasNextPage || loadingMore || !lastDocId) return;

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
          response = await fetchNewsData({
            ...commonParams,
            filters: { country: filters.country, org: filters.org, nsag: filters.nsag }
          });
      }

      if (response) {
        const newRecords = response.records || [];
        setAllRecords(prev => [...prev, ...newRecords]);
        setItems(prev => [...prev, ...newRecords]);
        setLastDocId(response.lastdocid || "");
        setHasNextPage(response.hasMore || false);
      }
    } catch (error) {
      console.error('Error loading more data:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  const FilterSidebar = () => (
    <Box sx={{ position: 'relative', height: '100%' }}>
      <FilterBar
        mode={mode}
        setMode={setMode}
        filters={filters}
        setFilters={setFilters}
        clearAll={clearAll}
        options={options}
        dateFrom={dateFrom}
        setDateFrom={setDateFrom}
        dateTo={dateTo}
        setDateTo={setDateTo}
      />
    </Box>
  );

  return (
    <>
      <Box sx={{ display: "flex", minHeight: "calc(100vh - 100px)" }}>
        {/* Desktop Sidebar */}
        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
          <Paper
            elevation={2}
            sx={{
              width: sidebarOpen ? sidebarWidth : collapsedWidth,
              flexShrink: 0,
              borderRadius: 0,
              borderRight: `1px solid ${theme.palette.divider}`,
              bgcolor: alpha(theme.palette.background.paper, 0.95),
              backdropFilter: 'blur(20px)',
              overflowY: sidebarOpen ? "auto" : "hidden",
              maxHeight: "calc(100vh - 100px)",
              position: 'sticky',
              top: 0,
              transition: theme.transitions.create(['width'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
              }),
            }}
          >
            {/* Sidebar Toggle Button */}
            <Box
              sx={{
                position: 'absolute',
                top: 16,
                right: sidebarOpen ? 16 : 8,
                zIndex: 10,
              }}
            >
              <IconButton
                onClick={() => setSidebarOpen(!sidebarOpen)}
                sx={{
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main,
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.2),
                  },
                  boxShadow: theme.shadows[4],
                  transition: 'all 0.3s ease'
                }}
              >
                {sidebarOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
              </IconButton>
            </Box>

            {sidebarOpen && <FilterSidebar />}

            {!sidebarOpen && (
              <Box sx={{ p: 2, pt: 8 }}>
                <Stack spacing={2} alignItems="center">
                  <IconButton
                    onClick={() => setMobileDrawerOpen(true)}
                    sx={{
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      color: theme.palette.primary.main,
                      '&:hover': {
                        bgcolor: alpha(theme.palette.primary.main, 0.2),
                      }
                    }}
                  >
                    <FilterListIcon />
                  </IconButton>
                  <IconButton
                    sx={{
                      bgcolor: alpha(theme.palette.secondary.main, 0.1),
                      color: theme.palette.secondary.main,
                    }}
                  >
                    <SearchIcon />
                  </IconButton>
                </Stack>
              </Box>
            )}
          </Paper>
        </Box>

        {/* Mobile Drawer */}
        <Drawer
          anchor="left"
          open={mobileDrawerOpen}
          onClose={() => setMobileDrawerOpen(false)}
          sx={{
            display: { md: 'none' },
            '& .MuiDrawer-paper': {
              width: sidebarWidth,
              bgcolor: alpha(theme.palette.background.paper, 0.95),
              backdropFilter: 'blur(20px)',
            },
          }}
        >
          <Box sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Filters
              </Typography>
              <IconButton onClick={() => setMobileDrawerOpen(false)}>
                <ChevronLeftIcon />
              </IconButton>
            </Box>
            <FilterSidebar />
          </Box>
        </Drawer>

        {/* Mobile Filter Button */}
        <IconButton
          onClick={() => setMobileDrawerOpen(true)}
          sx={{
            display: { md: 'none' },
            position: 'fixed',
            bottom: 20,
            left: 20,
            bgcolor: theme.palette.primary.main,
            color: 'white',
            zIndex: 1000,
            '&:hover': {
              bgcolor: theme.palette.primary.dark,
            },
            boxShadow: theme.shadows[8]
          }}
        >
          <MenuIcon />
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
          <Container maxWidth={false} sx={{ p: 3 }}>
            {/* Results Header */}
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2 }}>
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    color: theme.palette.text.primary,
                    mb: 1
                  }}
                >
                  Search Results {query && `for "${query}"`}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: theme.palette.primary.main,
                    mb: 0.5
                  }}
                >
                  {allRecords.length > 0
                    ? `${allRecords.length} out of ${totalRecords} records showing`
                    : totalRecords > 0
                      ? `0 out of ${totalRecords} records`
                      : 'No records found'
                  }
                </Typography>
              </Box>

              {/* View Toggle Buttons */}
              <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                <ToggleButtonGroup
                  size="small"
                  exclusive
                  value={view}
                  onChange={(_, v) => v && setView(v)}
                  sx={{
                    bgcolor: alpha(theme.palette.background.paper, 0.8),
                    boxShadow: theme.shadows[2]
                  }}
                >
                  <ToggleButton
                    value="grid"
                    sx={{
                      px: 2,
                      py: 1,
                      borderRadius: '8px 0 0 8px !important',
                      '&.Mui-selected': {
                        bgcolor: theme.palette.primary.main,
                        color: 'white',
                        '&:hover': {
                          bgcolor: theme.palette.primary.dark,
                        }
                      }
                    }}
                  >
                    <ViewModuleIcon sx={{ mr: 0.5 }} fontSize="small" />
                    Grid
                  </ToggleButton>
                  <ToggleButton
                    value="list"
                    sx={{
                      px: 2,
                      py: 1,
                      borderRadius: '0 8px 8px 0 !important',
                      '&.Mui-selected': {
                        bgcolor: theme.palette.primary.main,
                        color: 'white',
                        '&:hover': {
                          bgcolor: theme.palette.primary.dark,
                        }
                      }
                    }}
                  >
                    <ViewListIcon sx={{ mr: 0.5 }} fontSize="small" />
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
                    }}
                  >
                    Clear All
                  </Button>
                </Box>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {dateFrom && (
                    <Chip
                      label={`From: ${dateFrom}`}
                      size="small"
                      onDelete={() => setDateFrom("")}
                      sx={{ m: 0.25 }}
                    />
                  )}
                  {dateTo && (
                    <Chip
                      label={`To: ${dateTo}`}
                      size="small"
                      onDelete={() => setDateTo("")}
                      sx={{ m: 0.25 }}
                    />
                  )}
                  {Object.entries(filters).map(([key, values]) =>
                    values?.map((value) => (
                      <Chip
                        key={`${key}-${value}`}
                        label={value}
                        size="small"
                        onDelete={() => setFilters(f => ({ ...f, [key]: f[key].filter(v => v !== value) }))}
                        sx={{ m: 0.25 }}
                      />
                    ))
                  )}
                </Stack>
              </Box>
            )}

            {/* Results Grid/List */}
            {loading ? (
              <Grid container spacing={3}>
                {[...Array(6)].map((_, i) => (
                  <Grid item xs={12} sm={6} md={4} key={i}>
                    <Skeleton variant="rounded" height={view === 'list' ? 180 : 380} sx={{ borderRadius: 3 }} />
                  </Grid>
                ))}
              </Grid>
            ) : items.length > 0 ? (
              <>
                <Grid container spacing={3}>
                  {items.map((item, index) => (
                    <Grid
                      item
                      xs={12}
                      sm={view === 'list' ? 12 : 6}
                      md={view === 'list' ? 12 : 4}
                      lg={view === 'list' ? 12 : 4}
                      key={item.id || index}
                    >
                      <ContentCard
                        item={item}
                        view={view}
                        onArticleClick={handleArticleClick}
                        selectedItemId={selectedArticle?.id}
                        isViewingArticle={isViewingArticle}
                      />
                    </Grid>
                  ))}
                </Grid>

                {/* Load More Button */}
                {hasNextPage && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Button
                      variant="contained"
                      onClick={loadMore}
                      disabled={loadingMore}
                      sx={{
                        px: 4,
                        py: 1.5,
                        borderRadius: 3,
                        textTransform: 'none',
                        fontWeight: 600,
                      }}
                    >
                      {loadingMore ? 'Loading...' : 'Load More Results'}
                    </Button>
                  </Box>
                )}
              </>
            ) : (
              <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 400,
                textAlign: 'center'
              }}>
                <SearchIcon sx={{ fontSize: 80, color: alpha(theme.palette.text.secondary, 0.3), mb: 2 }} />
                <Typography variant="h5" color="text.secondary" sx={{ fontWeight: 600, mb: 1 }}>
                  No results found
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Try adjusting your search terms or filters
                </Typography>
              </Box>
            )}
          </Container>
        </Box>
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
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('q') || '';
  const mode = searchParams.get('mode') || null;

  return (
    <Box sx={{ minHeight: '100vh' }}>
      <ResultsPanel query={query} initialMode={mode} />
    </Box>
  );
}
