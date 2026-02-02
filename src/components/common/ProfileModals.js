/**
 * Common Profile Modals Component
 *
 * Reusable NewsProfileModal and EventProfileModal components
 * used across all profile cards (Equipment, Installation, Organization, MilitaryGroup, NSAGActors)
 *
 * Usage:
 * import { NewsProfileModal, EventProfileModal, useProfileModals } from 'src/components/common/ProfileModals';
 */

import React, { useState, useCallback } from 'react';
import {
    Typography,
    Box,
    Button,
    CircularProgress,
    Chip,
    Modal,
    IconButton,
} from '@mui/material';
import {
    Close as CloseIcon,
    Article as ArticleIcon,
    Event as EventIcon,
    KeyboardArrowRight as KeyboardArrowRightIcon,
    KeyboardArrowLeft as KeyboardArrowLeftIcon,
} from '@mui/icons-material';
import { withOpacity, colors } from '../../theme/palette';
import { dataService } from '../../services/dataService';

// ============================================================================
// CONSTANTS
// ============================================================================

const EVENTS_PER_PAGE = 15;

const modalTheme = {
    radius: { sm: '8px', md: '12px', lg: '16px' },
    colors: {
        news: {
            primary: colors.blue[500],
            secondary: colors.blue[600],
            gradient: `linear-gradient(135deg, ${colors.blue[500]} 0%, ${colors.blue[600]} 100%)`,
        },
        event: {
            primary: colors.violet[500],
            secondary: colors.violet[600],
            gradient: `linear-gradient(135deg, ${colors.violet[500]} 0%, ${colors.violet[600]} 100%)`,
        },
    },
};

// HTML content styles for news articles - matches ArticleDetailPage styling
const newsHtmlContentStyles = {
    '& p': { margin: '0 0 1em 0', lineHeight: 1.8, color: colors.gray[700] },
    '& a': {
        color: colors.blue[600],
        textDecoration: 'underline',
        '&:hover': { color: colors.blue[700] },
    },
    '& ul, & ol': { paddingLeft: '1.5em', marginBottom: '1em', color: colors.gray[700] },
    '& li': { marginBottom: '0.5em', lineHeight: 1.7 },
    '& h1, & h2, & h3, & h4, & h5, & h6': {
        fontWeight: 600,
        marginTop: '1.5em',
        marginBottom: '0.75em',
        color: colors.gray[900],
        borderBottom: `1px solid ${colors.gray[200]}`,
        paddingBottom: '0.5em',
    },
    '& h1': { fontSize: '1.5rem' },
    '& h2': { fontSize: '1.25rem', color: colors.blue[700] },
    '& h3': { fontSize: '1.1rem' },
    '& h4': { fontSize: '1rem' },
    '& blockquote': {
        borderLeft: `4px solid ${colors.blue[400]}`,
        margin: '1em 0',
        fontStyle: 'italic',
        color: colors.gray[600],
        backgroundColor: withOpacity(colors.blue[50], 0.5),
        padding: '0.75em 1em',
        borderRadius: '0 8px 8px 0',
    },
    '& img': {
        maxWidth: '100%',
        height: 'auto',
        borderRadius: '8px',
        margin: '1em 0',
        boxShadow: `0 4px 12px ${withOpacity(colors.gray[500], 0.2)}`,
    },
    '& .news-image-container': {
        margin: '1.5em 0',
        textAlign: 'center',
    },
    '& .news-image-caption': {
        fontSize: '0.8rem',
        color: colors.gray[500],
        fontStyle: 'italic',
        marginTop: '0.5em',
        textAlign: 'center',
    },
    '& .news-image-credit': {
        fontSize: '0.7rem',
        color: colors.gray[400],
        textAlign: 'center',
    },
    '& table': {
        width: '100%',
        borderCollapse: 'collapse',
        marginBottom: '1em',
        '& th, & td': {
            border: `1px solid ${colors.gray[300]}`,
            padding: '0.5em',
            textAlign: 'left',
        },
        '& th': { backgroundColor: colors.gray[100], fontWeight: 600 },
    },
    '& strong, & b': { fontWeight: 600, color: colors.gray[800] },
    '& em, & i': { fontStyle: 'italic' },
    '& br': { display: 'block', content: '""', marginTop: '0.5em' },
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Format date string to readable format
 */
export function formatDate(dateString) {
    if (!dateString) return 'N/A';
    try {
        const date = new Date(dateString);
        if (isNaN(date)) return dateString;
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
        return dateString;
    }
}

/**
 * Build proper image URL using baseImageUrl
 * Matches the approach used in Equipment's Profile.js
 */
function buildImageUrl(src, baseImageUrl) {
    if (!src) return '';
    if (!baseImageUrl) return src; // Fallback to raw URL if no baseImageUrl

    // Extract the image filename from the source path
    const imageName = src.split("/").slice(-1)[0];

    // Skip .tif files as they may not render properly
    if (imageName.includes('.tif')) return '';

    return `${baseImageUrl}/images/${imageName}.jpg`;
}

/**
 * Process HTML content to convert <data> tags to images
 * @param {string} html - Raw HTML content
 * @param {string} baseImageUrl - Base URL for image assets (e.g., from context)
 */
function processHtmlContent(html, baseImageUrl = '') {
    // Safety check: ensure html is a string and not too large
    if (!html) return '';
    if (typeof html !== 'string') {
        // Try to convert to string safely, but avoid circular references
        try {
            html = String(html);
        } catch (e) {
            console.warn('processHtmlContent: Could not convert html to string', e);
            return '';
        }
    }

    // Limit processing to prevent excessive memory usage
    if (html.length > 500000) {
        console.warn('processHtmlContent: HTML content too large, truncating');
        html = html.substring(0, 500000);
    }

    // Convert <data> tags with images to proper img tags
    let processed = html.replace(
        /<data\s+value="([^"]+)"\s+data-type="Asset"\s*(?:data-caption="([^"]*)")?\s*(?:data-credit="([^"]*)")?\s*><\/data>/gi,
        (match, src, caption, credit) => {
            const imageUrl = buildImageUrl(src, baseImageUrl);
            if (!imageUrl) return ''; // Skip if no valid URL (e.g., .tif file)

            let imgHtml = `<div class="news-image-container">
                <img src="${imageUrl}" alt="${caption || 'News image'}" style="max-width:100%; border-radius:8px;" />`;
            if (caption) {
                imgHtml += `<div class="news-image-caption">${caption}</div>`;
            }
            if (credit) {
                imgHtml += `<div class="news-image-credit">Credit: ${credit}</div>`;
            }
            imgHtml += `</div>`;
            return imgHtml;
        }
    );

    // Also handle self-closing data tags
    processed = processed.replace(
        /<data\s+value="([^"]+)"[^>]*\/>/gi,
        (match, src) => {
            const imageUrl = buildImageUrl(src, baseImageUrl);
            if (!imageUrl) return '';
            return `<div class="news-image-container"><img src="${imageUrl}" alt="News image" style="max-width:100%; border-radius:8px;" /></div>`;
        }
    );

    return processed;
}

/**
 * Safely extract string value from potentially complex object
 * Prevents "too much recursion" errors from circular references
 */
function safeStringExtract(value) {
    if (value === null || value === undefined) return '';
    if (typeof value === 'string') return value;
    if (typeof value === 'number' || typeof value === 'boolean') return String(value);
    // For objects/arrays, don't try to stringify - just return empty string
    // This prevents circular reference issues
    return '';
}

/**
 * Parse news data from API response (handles different response formats)
 * @param {Object} response - API response
 * @param {boolean} processHtml - Whether to process HTML content (default: true for modal display, false for Profile.js)
 * @param {string} baseImageUrl - Base URL for image assets (used when processHtml is true)
 */
export function parseNewsData(response, processHtml = true, baseImageUrl = '') {
    if (!response) return [];

    let items = [];

    // Safety wrapper for parsing to catch any recursion issues
    const safeParseItem = (item, getProps) => {
        try {
            const props = getProps(item);
            if (!props || typeof props !== 'object') return null;

            const rawContent = safeStringExtract(props.body) || safeStringExtract(props.content) || safeStringExtract(props.text) || '';
            return {
                id: safeStringExtract(props.id) || safeStringExtract(props.entity_id),
                title: safeStringExtract(props.title) || safeStringExtract(props.label) || 'Untitled Article',
                summary: safeStringExtract(props.summary) || safeStringExtract(props.description) || '',
                body: rawContent,
                content: processHtml ? processHtmlContent(rawContent, baseImageUrl) : rawContent,
                publish_date: safeStringExtract(props.publish_date) || safeStringExtract(props.published_date) || safeStringExtract(props.date) || safeStringExtract(props.creation_date),
                published_date: safeStringExtract(props.publish_date) || safeStringExtract(props.published_date) || safeStringExtract(props.date) || safeStringExtract(props.creation_date),
                url: safeStringExtract(props.url) || safeStringExtract(props.source_url) || safeStringExtract(props.link) || safeStringExtract(props.id),
                source: safeStringExtract(props.data_source) || safeStringExtract(props.source) || safeStringExtract(props.publisher) || 'Janes',
            };
        } catch (error) {
            console.warn('parseNewsData: Error parsing item', error);
            return null;
        }
    };

    try {
        // Handle resultRows format (QueryGraph transformed)
        if (response.resultRows && Array.isArray(response.resultRows)) {
            items = response.resultRows.map(row =>
                safeParseItem(row, (r) => r[0]?.properties || r[0] || r)
            );
        }
        // Handle result format with nested c.properties (direct API response)
        else if (response.result && Array.isArray(response.result)) {
            items = response.result.map(item =>
                safeParseItem(item, (i) => i.c?.properties || i.properties || i.news || i)
            );
        }
        // Handle array directly
        else if (Array.isArray(response)) {
            items = response.map(item =>
                safeParseItem(item, (i) => i)
            );
        }
    } catch (error) {
        console.error('parseNewsData: Error processing response', error);
        return [];
    }

    return items.filter(Boolean);
}

/**
 * Parse event data from API response
 * Handles multiple response formats:
 * 1. { result: [{ event: {...}, primary_country, actors, related_equipment }] } - event_profile API
 * 2. { resultRows: [[eventNode, locationNode]] } - QueryGraph format
 * 3. Direct array of event objects
 */
export function parseEventData(response) {
    if (!response) return [];

    let items = [];

    // Helper to extract event properties from various formats
    const extractEventData = (item) => {
        // Format 1: { event: {...}, primary_country, actors, related_equipment } - from event_profile API
        if (item.event && typeof item.event === 'object') {
            const evt = item.event;
            return {
                id: evt.id || evt.entity_id,
                label: evt.label || evt.name || evt.title || 'Untitled Event',
                description: evt.description || evt.summary || '',
                entity_type: evt.entity_type || evt.event_category || 'Event',
                event_type: evt.event_sub_type || evt.event_type || evt.type,
                event_date: evt.start_date || evt.event_date || evt.date,
                end_date: evt.end_date,
                last_modified_date: evt.last_modified_date || evt.modified_date,
                location: {
                    lat: evt.event_location_lat,
                    long: evt.event_location_long,
                },
                country: item.primary_country || evt.country,
                actors: item.actors || [],
                related_equipment: item.related_equipment || [],
                scale: evt.scale,
                significance: evt.significance,
            };
        }
        // Format 2: Direct event object (properties on item itself)
        return {
            id: item.id || item.entity_id,
            label: item.label || item.title || item.name || 'Untitled Event',
            description: item.description || item.summary || '',
            entity_type: item.entity_type || item.event_category || 'Event',
            event_type: item.event_sub_type || item.event_type || item.type,
            event_date: item.start_date || item.event_date || item.date,
            end_date: item.end_date,
            last_modified_date: item.last_modified_date || item.modified_date,
            location: item.location,
            country: item.country || item.primary_country,
            actors: item.actors || [],
            related_equipment: item.related_equipment || [],
            scale: item.scale,
            significance: item.significance,
        };
    };

    try {
        if (response.resultRows && Array.isArray(response.resultRows)) {
            // QueryGraph format: [[eventNode, locationNode], ...]
            items = response.resultRows.map(row => {
                const item = row[0]?.properties || row[0] || row;
                const location = row[1]?.properties || row[1] || null;
                return {
                    id: item.id || item.entity_id,
                    label: item.label || item.title || item.name || 'Untitled Event',
                    description: item.description || item.summary || '',
                    entity_type: item.entity_type || 'Event',
                    event_type: item.event_type || item.type,
                    event_date: item.event_date || item.date,
                    last_modified_date: item.last_modified_date || item.modified_date,
                    location: location,
                    country: item.country || location?.country,
                };
            });
        } else if (response.result && Array.isArray(response.result)) {
            // API response format: { result: [...] }
            items = response.result.map(item => extractEventData(item));
        } else if (Array.isArray(response)) {
            // Direct array
            items = response.map(item => extractEventData(item));
        }
    } catch (error) {
        console.error('parseEventData: Error processing response', error);
        return [];
    }

    return items.filter(Boolean);
}

// ============================================================================
// NEWS PROFILE MODAL COMPONENT
// ============================================================================

export function NewsProfileModal({
    open,
    onClose,
    newsData = [],
    loading = false,
    activeStep = 0,
    setActiveStep,
}) {
    if (!open) return null;

    const currentNews = newsData[activeStep] || {};
    const hasContent = currentNews.content && currentNews.content.trim().length > 0;
    const hasPrevious = activeStep > 0;
    const hasNext = activeStep < newsData.length - 1;

    const handlePrevious = () => {
        if (hasPrevious) setActiveStep(prev => prev - 1);
    };

    const handleNext = () => {
        if (hasNext) setActiveStep(prev => prev + 1);
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: { xs: 1, sm: 2 },
            }}
            slotProps={{
                backdrop: {
                    sx: {
                        background: 'rgba(15, 23, 42, 0.75)',
                        backdropFilter: 'blur(6px)',
                    },
                },
            }}
        >
            <Box sx={{
                width: { xs: '100%', sm: '95%', md: '900px' },
                maxWidth: '950px',
                maxHeight: { xs: '95vh', sm: '88vh' },
                background: '#ffffff',
                borderRadius: { xs: '12px', sm: '16px' },
                overflow: 'hidden',
                outline: 'none',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.3)',
            }}>
                {loading ? (
                    <Box sx={{ py: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                        <CircularProgress size={40} sx={{ color: '#3b82f6' }} />
                        <Typography sx={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 500 }}>Loading news articles...</Typography>
                    </Box>
                ) : newsData.length > 0 ? (
                    <>
                        {/* Modern Header */}
                        <Box sx={{
                            px: { xs: 2, sm: 2.5 },
                            py: 2,
                            background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
                            display: 'flex',
                            alignItems: 'flex-start',
                            justifyContent: 'space-between',
                            gap: 2,
                            flexShrink: 0,
                        }}>
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <Box sx={{
                                        px: 1.5, py: 0.375, borderRadius: '6px',
                                        background: 'rgba(255,255,255,0.2)',
                                        border: '1px solid rgba(255,255,255,0.25)',
                                    }}>
                                        <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: '#ffffff', letterSpacing: '0.03em' }}>
                                            {currentNews.source || 'NEWS'}
                                        </Typography>
                                    </Box>
                                    <Typography sx={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>
                                        {formatDate(currentNews.published_date)}
                                    </Typography>
                                </Box>
                                <Typography sx={{
                                    fontSize: { xs: '1rem', sm: '1.15rem' },
                                    fontWeight: 700,
                                    color: '#ffffff',
                                    lineHeight: 1.35,
                                    letterSpacing: '-0.01em',
                                }}>
                                    {currentNews.title || 'Untitled Article'}
                                </Typography>
                            </Box>
                            <IconButton
                                onClick={onClose}
                                sx={{
                                    width: 38, height: 38,
                                    borderRadius: '10px',
                                    background: 'rgba(255,255,255,0.15)',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    color: '#ffffff',
                                    flexShrink: 0,
                                    '&:hover': { background: 'rgba(255,255,255,0.25)' },
                                }}
                            >
                                <CloseIcon sx={{ fontSize: '1.2rem' }} />
                            </IconButton>
                        </Box>

                        {/* Content Area */}
                        <Box sx={{
                            flex: 1,
                            overflowY: 'auto',
                            bgcolor: '#f8fafc',
                            '&::-webkit-scrollbar': { width: '6px' },
                            '&::-webkit-scrollbar-track': { bgcolor: 'transparent' },
                            '&::-webkit-scrollbar-thumb': { bgcolor: '#cbd5e1', borderRadius: '3px' },
                        }}>
                            {/* Summary Section */}
                            {currentNews.summary && (
                                <Box sx={{
                                    mx: { xs: 2, sm: 2.5 },
                                    mt: 2.5,
                                    p: 2,
                                    borderRadius: '10px',
                                    background: 'linear-gradient(135deg, #eff6ff 0%, #e0f2fe 100%)',
                                    border: '1px solid #bfdbfe',
                                }}>
                                    <Typography sx={{
                                        fontSize: '0.7rem', fontWeight: 700,
                                        color: '#1d4ed8',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em',
                                        mb: 1,
                                    }}>
                                        Summary
                                    </Typography>
                                    <Box
                                        sx={{ fontSize: '0.875rem', color: '#334155', lineHeight: 1.7, ...newsHtmlContentStyles }}
                                        dangerouslySetInnerHTML={{ __html: currentNews.summary }}
                                    />
                                </Box>
                            )}

                            {/* Main Content */}
                            <Box sx={{ px: { xs: 2, sm: 2.5 }, py: 2.5 }}>
                                {hasContent ? (
                                    <Box sx={{
                                        bgcolor: '#ffffff',
                                        borderRadius: '10px',
                                        p: { xs: 2, sm: 2.5 },
                                        border: '1px solid #e2e8f0',
                                    }}>
                                        <Box
                                            sx={{ fontSize: '0.9rem', lineHeight: 1.85, color: '#374151', ...newsHtmlContentStyles }}
                                            dangerouslySetInnerHTML={{ __html: currentNews.content }}
                                        />
                                    </Box>
                                ) : (
                                    <Box sx={{
                                        bgcolor: '#ffffff',
                                        borderRadius: '10px',
                                        p: 4,
                                        border: '1px solid #e2e8f0',
                                        textAlign: 'center',
                                    }}>
                                        <ArticleIcon sx={{ fontSize: '2.5rem', color: '#cbd5e1', mb: 1.5 }} />
                                        <Typography sx={{ fontSize: '0.9rem', color: '#64748b' }}>
                                            No detailed content available for this article.
                                        </Typography>
                                    </Box>
                                )}
                            </Box>
                        </Box>

                        {/* Navigation Footer */}
                        <Box sx={{
                            px: { xs: 2, sm: 2.5 },
                            py: 1.5,
                            bgcolor: '#ffffff',
                            borderTop: '1px solid #e2e8f0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexShrink: 0,
                        }}>
                            {/* Back Button */}
                            <Box
                                onClick={handlePrevious}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.75,
                                    px: 2,
                                    py: 0.875,
                                    borderRadius: '8px',
                                    cursor: hasPrevious ? 'pointer' : 'default',
                                    bgcolor: hasPrevious ? '#f1f5f9' : '#f8fafc',
                                    border: '1px solid',
                                    borderColor: hasPrevious ? '#cbd5e1' : '#e2e8f0',
                                    color: hasPrevious ? '#334155' : '#94a3b8',
                                    transition: 'all 0.15s ease',
                                    '&:hover': hasPrevious ? {
                                        bgcolor: '#e2e8f0',
                                        borderColor: '#94a3b8',
                                    } : {},
                                }}
                            >
                                <KeyboardArrowLeftIcon sx={{ fontSize: '1.25rem' }} />
                                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600 }}>Back</Typography>
                            </Box>

                            {/* Page Indicator */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <Typography sx={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }}>
                                    Article
                                </Typography>
                                <Box sx={{
                                    px: 1.5, py: 0.5,
                                    borderRadius: '6px',
                                    bgcolor: '#3b82f6',
                                    color: '#ffffff',
                                }}>
                                    <Typography sx={{ fontSize: '0.8rem', fontWeight: 700 }}>
                                        {activeStep + 1} / {newsData.length}
                                    </Typography>
                                </Box>
                            </Box>

                            {/* Next Button */}
                            <Box
                                onClick={handleNext}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.75,
                                    px: 2,
                                    py: 0.875,
                                    borderRadius: '8px',
                                    cursor: hasNext ? 'pointer' : 'default',
                                    bgcolor: hasNext ? '#3b82f6' : '#f8fafc',
                                    border: '1px solid',
                                    borderColor: hasNext ? '#3b82f6' : '#e2e8f0',
                                    color: hasNext ? '#ffffff' : '#94a3b8',
                                    transition: 'all 0.15s ease',
                                    boxShadow: hasNext ? '0 2px 6px rgba(59, 130, 246, 0.3)' : 'none',
                                    '&:hover': hasNext ? {
                                        bgcolor: '#2563eb',
                                        boxShadow: '0 4px 10px rgba(59, 130, 246, 0.4)',
                                    } : {},
                                }}
                            >
                                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600 }}>Next</Typography>
                                <KeyboardArrowRightIcon sx={{ fontSize: '1.25rem' }} />
                            </Box>
                        </Box>
                    </>
                ) : (
                    <Box sx={{ py: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                        <Box sx={{
                            width: 64, height: 64, borderRadius: '16px',
                            bgcolor: '#f1f5f9',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <ArticleIcon sx={{ fontSize: '2rem', color: '#94a3b8' }} />
                        </Box>
                        <Typography sx={{ color: '#64748b', fontSize: '1rem', fontWeight: 500 }}>No news articles available</Typography>
                        <Box
                            onClick={onClose}
                            sx={{
                                px: 3, py: 1,
                                borderRadius: '8px',
                                bgcolor: '#3b82f6',
                                color: '#ffffff',
                                fontWeight: 600,
                                fontSize: '0.85rem',
                                cursor: 'pointer',
                                '&:hover': { bgcolor: '#2563eb' },
                            }}
                        >
                            Close
                        </Box>
                    </Box>
                )}
            </Box>
        </Modal>
    );
}

// ============================================================================
// EVENT PROFILE MODAL COMPONENT
// ============================================================================

export function EventProfileModal({
    open,
    onClose,
    eventData = [],
    loading = false,
    page = 1,
    setPage,
    eventsPerPage = EVENTS_PER_PAGE,
}) {
    if (!open) return null;

    const totalPages = Math.ceil(eventData.length / eventsPerPage);
    const paginatedEvents = eventData.slice((page - 1) * eventsPerPage, page * eventsPerPage);

    return (
        <Modal open={open} onClose={onClose} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Box sx={{
                width: { xs: '95%', md: '750px' },
                maxHeight: '90vh',
                background: colors.white,
                borderRadius: modalTheme.radius.lg,
                overflow: 'hidden',
                outline: 'none',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            }}>
                {/* Header */}
                <Box sx={{
                    px: 2.5, py: 1.5,
                    background: modalTheme.colors.event.gradient,
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    flexShrink: 0,
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{
                            width: 36, height: 36, borderRadius: '10px',
                            background: 'rgba(255,255,255,0.2)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <EventIcon sx={{ fontSize: '1.2rem', color: colors.white }} />
                        </Box>
                        <Box>
                            <Typography sx={{ fontWeight: 600, color: colors.white, fontSize: '1rem' }}>Event Profile</Typography>
                            <Typography sx={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.8)' }}>
                                {eventData.length} {eventData.length === 1 ? 'event' : 'events'} found
                            </Typography>
                        </Box>
                    </Box>
                    <IconButton onClick={onClose} size="small" sx={{ color: colors.white }}>
                        <CloseIcon sx={{ fontSize: '1.1rem' }} />
                    </IconButton>
                </Box>

                {/* Content */}
                <Box sx={{
                    flex: 1, overflowY: 'auto', maxHeight: '70vh', bgcolor: colors.slate[50],
                    '&::-webkit-scrollbar': { width: '6px' },
                    '&::-webkit-scrollbar-thumb': { background: colors.gray[300], borderRadius: '3px' },
                }}>
                    {loading ? (
                        <Box sx={{ py: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                            <CircularProgress size={36} sx={{ color: modalTheme.colors.event.primary }} />
                            <Typography sx={{ color: colors.gray[500] }}>Loading events...</Typography>
                        </Box>
                    ) : paginatedEvents.length > 0 ? (
                        <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                            {paginatedEvents.map((event, index) => (
                                <Box
                                    key={event.id || index}
                                    sx={{
                                        p: 2, borderRadius: modalTheme.radius.md,
                                        bgcolor: colors.white,
                                        border: `1px solid ${colors.slate[200]}`,
                                        boxShadow: `0 1px 3px ${withOpacity(colors.slate[500], 0.08)}`,
                                        transition: 'all 0.2s ease',
                                        '&:hover': {
                                            borderColor: colors.violet[300],
                                            boxShadow: `0 4px 12px ${withOpacity(colors.violet[500], 0.12)}`,
                                        },
                                    }}
                                >
                                    <Typography sx={{ fontWeight: 600, color: colors.gray[800], fontSize: '0.9rem', mb: 0.75, lineHeight: 1.4 }}>
                                        {event.label}
                                    </Typography>
                                    <Typography sx={{ fontSize: '0.8rem', color: colors.gray[600], lineHeight: 1.6, mb: 1.5 }}>
                                        {event.description || 'No description available'}
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                                        <Chip
                                            label={event.entity_type || 'Event'}
                                            size="small"
                                            sx={{ height: '22px', fontSize: '0.65rem', bgcolor: colors.violet[100], color: colors.violet[700], fontWeight: 600 }}
                                        />
                                        {event.event_type && (
                                            <Chip
                                                label={event.event_type}
                                                size="small"
                                                sx={{ height: '22px', fontSize: '0.65rem', bgcolor: colors.blue[100], color: colors.blue[700], fontWeight: 600 }}
                                            />
                                        )}
                                        {event.country && (
                                            <Chip
                                                label={event.country}
                                                size="small"
                                                sx={{ height: '22px', fontSize: '0.65rem', bgcolor: colors.green[100], color: colors.green[700], fontWeight: 600 }}
                                            />
                                        )}
                                        {event.significance && (
                                            <Chip
                                                label={event.significance}
                                                size="small"
                                                sx={{ height: '22px', fontSize: '0.65rem', bgcolor: colors.orange[100], color: colors.orange[700], fontWeight: 600 }}
                                            />
                                        )}
                                        <Typography sx={{ fontSize: '0.7rem', color: colors.gray[400], ml: 'auto' }}>
                                            {formatDate(event.event_date || event.last_modified_date)}
                                        </Typography>
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    ) : (
                        <Box sx={{ py: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                            <EventIcon sx={{ fontSize: '3rem', color: colors.gray[400] }} />
                            <Typography sx={{ color: colors.gray[500], fontSize: '1rem' }}>No events available</Typography>
                        </Box>
                    )}
                </Box>

                {/* Pagination */}
                {totalPages > 1 && (
                    <Box sx={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2,
                        py: 1.5, borderTop: `1px solid ${colors.slate[200]}`, flexShrink: 0,
                    }}>
                        <IconButton onClick={() => setPage(prev => Math.max(1, prev - 1))} disabled={page === 1} size="small">
                            <KeyboardArrowLeftIcon />
                        </IconButton>
                        <Typography sx={{ fontSize: '0.85rem', fontWeight: 500, color: colors.gray[600] }}>
                            Page {page} of {totalPages}
                        </Typography>
                        <IconButton onClick={() => setPage(prev => Math.min(totalPages, prev + 1))} disabled={page === totalPages} size="small">
                            <KeyboardArrowRightIcon />
                        </IconButton>
                    </Box>
                )}
            </Box>
        </Modal>
    );
}

// ============================================================================
// CUSTOM HOOK FOR PROFILE MODALS
// ============================================================================

/**
 * Custom hook for managing news and event profile modals
 * @param {string} entityId - The entity ID
 * @param {string} entityType - The entity type (equipment, installation, organization, militarygroup, nsag_actor)
 * @param {string} baseImageUrl - Base URL for image assets (optional, for proper image rendering)
 */
export function useProfileModals(entityId, entityType, baseImageUrl = '') {
    const [newsModalOpen, setNewsModalOpen] = useState(false);
    const [newsData, setNewsData] = useState([]);
    const [newsLoading, setNewsLoading] = useState(false);
    const [newsActiveStep, setNewsActiveStep] = useState(0);

    const [eventModalOpen, setEventModalOpen] = useState(false);
    const [eventData, setEventData] = useState([]);
    const [eventLoading, setEventLoading] = useState(false);
    const [eventPage, setEventPage] = useState(1);

    const openNewsModal = useCallback(async (idOrEvent, type) => {
        // Handle case where function is called as onClick handler (receives MouseEvent)
        // or called directly with custom id/type
        const id = (typeof idOrEvent === 'string') ? idOrEvent : entityId;
        const entityTypeToUse = (typeof type === 'string') ? type : entityType;

        if (!id) return;
        setNewsModalOpen(true);
        setNewsLoading(true);
        setNewsActiveStep(0);
        try {
            const response = await dataService.newsProfile.get(id, entityTypeToUse);
            setNewsData(parseNewsData(response, true, baseImageUrl));
        } catch (error) {
            console.error('Error fetching news profile:', error);
            setNewsData([]);
        } finally {
            setNewsLoading(false);
        }
    }, [entityId, entityType, baseImageUrl]);

    const openEventModal = useCallback(async (idOrEvent, type) => {
        // Handle case where function is called as onClick handler (receives MouseEvent)
        // or called directly with custom id/type
        const id = (typeof idOrEvent === 'string') ? idOrEvent : entityId;
        const entityTypeToUse = (typeof type === 'string') ? type : entityType;

        if (!id) return;
        setEventModalOpen(true);
        setEventLoading(true);
        setEventPage(1);
        try {
            const response = await dataService.eventProfile.get(id, entityTypeToUse);
            setEventData(parseEventData(response));
        } catch (error) {
            console.error('Error fetching event profile:', error);
            setEventData([]);
        } finally {
            setEventLoading(false);
        }
    }, [entityId, entityType]);

    return {
        newsModalProps: {
            open: newsModalOpen,
            onClose: () => setNewsModalOpen(false),
            newsData,
            loading: newsLoading,
            activeStep: newsActiveStep,
            setActiveStep: setNewsActiveStep,
        },
        eventModalProps: {
            open: eventModalOpen,
            onClose: () => setEventModalOpen(false),
            eventData,
            loading: eventLoading,
            page: eventPage,
            setPage: setEventPage,
        },
        openNewsModal,
        openEventModal,
        closeNewsModal: () => setNewsModalOpen(false),
        closeEventModal: () => setEventModalOpen(false),
    };
}

export default { NewsProfileModal, EventProfileModal, useProfileModals, parseNewsData, parseEventData, formatDate };
