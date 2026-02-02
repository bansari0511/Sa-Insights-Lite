import { useState, useEffect, useRef, useCallback } from 'react';
import {
    Box, Typography, Grid, Pagination, Card, Tabs, Tab,
    useTheme, useMediaQuery, Fade, List, ListItemButton, ListItemText, TextField,
    Accordion, AccordionSummary, AccordionDetails, InputAdornment, Chip, Avatar,
    Tooltip, Paper, Badge, LinearProgress, Button
} from '@mui/material';
import { withOpacity } from '../../theme/palette';
import {
    ExpandMore as ExpandMoreIcon,
    Search as SearchIcon,
    Schedule as ScheduleIcon,
    Visibility as ViewIcon,
    Language as LanguageIcon,
    LocationOn as LocationIcon,
    Update as UpdateIcon,
    AccessTime as AccessTimeIcon,
} from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate, useSearchParams } from 'react-router-dom';
import regionsData from '../../../countries.json';
import { newsService } from 'src/services/dataService';
import { Popover } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { API_ENDPOINTS } from 'src/config/apiEndpoints';

function EnhancedNewsTabs({ initialTab = 0, initialCountry = null }) {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    // Get all countries from regions data (needed for initialization)
    const allCountries = regionsData.flatMap(region => region.countries);

    // Default initial tabs: China, India, Pakistan first
    const defaultInitialTabs = [
        { label: "🇨🇳 China", value: "China" },
        { label: "🇮🇳 India", value: "India" },
        { label: "🇵🇰 Pakistan", value: "Pakistan" },
    ];

    const getInitialTabCountries = useCallback(() => {
        if (initialCountry) {
            const countryObj = allCountries.find(c => c.value === initialCountry);
            if (countryObj) {
                const otherCountries = allCountries.filter(c => c.value !== initialCountry).slice(0, 5);
                return [countryObj, ...otherCountries];
            }
        }
        // Default: China, India, Pakistan first, then other countries
        const defaultValues = defaultInitialTabs.map(c => c.value);
        const remainingCountries = allCountries
            .filter(c => !defaultValues.includes(c.value))
            .slice(0, 3); // Get 3 more to make 6 total
        return [...defaultInitialTabs, ...remainingCountries];
    }, [initialCountry, allCountries]);

    // Initialize tab countries state
    const [tabCountries, setTabCountries] = useState(getInitialTabCountries);

    // Read initial state from URL params (or use defaults)
    const getInitialTab = () => {
        const urlTab = searchParams.get('tab');
        if (urlTab !== null) {
            const tabIndex = parseInt(urlTab, 10);
            if (!isNaN(tabIndex) && tabIndex >= 0 && tabIndex < tabCountries.length) {
                return tabIndex;
            }
        }
        return initialTab;
    };

    const getInitialPage = () => {
        const urlPage = searchParams.get('page');
        if (urlPage !== null) {
            const pageNum = parseInt(urlPage, 10);
            if (!isNaN(pageNum) && pageNum >= 1) {
                return pageNum;
            }
        }
        return 1;
    };

    const getInitialPageIdentifier = () => {
        const urlPageId = searchParams.get('pageId');
        if (urlPageId !== null) {
            const pageId = parseInt(urlPageId, 10);
            if (!isNaN(pageId) && pageId >= 0) {
                return pageId;
            }
        }
        return 0;
    };

    const [selectedTab, setSelectedTab] = useState(getInitialTab);
    const [page, setPage] = useState(getInitialPage);
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [newsresponse, setNewsResponse] = useState({});
    const [viewCounts, setViewCounts] = useState({});
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMoreData, setHasMoreData] = useState(true);
    const [pageIdentifier, setPageIdentifier] = useState(getInitialPageIdentifier);
    const [pageSize] = useState(20);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [lastUpdatedData, setLastUpdatedData] = useState({ last_updated_date: '', last_updated_list: [] });
    const [countryListAnchor, setCountryListAnchor] = useState(null);
    const [countrySearchQuery, setCountrySearchQuery] = useState('');
    const itemsPerPage = 10;


    const parseImageUrl = (image_url) => {
        // Use base assets URL from API endpoints config
        const assetsBaseUrl = API_ENDPOINTS.ASSETS.BASE || '';
        if (assetsBaseUrl && image_url) {
            image_url = image_url.replaceAll("/Intara_Image_Asset_new", assetsBaseUrl);
        }
        if (typeof image_url === 'string' && image_url.includes('<data')) {
            const match = image_url.match(/value="([^"]+)"/);
            return match ? match[1] : '';
        }
        return image_url;
    };

    const currentCountry = tabCountries[selectedTab]?.value || allCountries[0].value;

    // Track if initial load with URL restoration has been done
    const initialLoadDoneRef = useRef(false);
    const lastLoadedCountryRef = useRef(null);

    // Update URL when tab, page, or pageIdentifier changes (without triggering navigation)
    const updateUrlParams = useCallback((newTab, newPage, newPageId) => {
        const params = new URLSearchParams();
        if (newTab !== 0) params.set('tab', String(newTab));
        if (newPage !== 1) params.set('page', String(newPage));
        if (newPageId !== 0) params.set('pageId', String(newPageId));

        // Use replace to avoid polluting browser history on every pagination click
        setSearchParams(params, { replace: true });
    }, [setSearchParams]);

    // Main effect for loading news - handles both initial load and restoration from URL
    useEffect(() => {
        const loadNews = async () => {
            // Skip if we've already loaded for this country
            if (lastLoadedCountryRef.current === currentCountry && initialLoadDoneRef.current) {
                return;
            }

            setLoading(true);
            lastLoadedCountryRef.current = currentCountry;

            // Use the state values that were initialized from URL params
            // pageIdentifier and page were already set from URL during component initialization
            const targetPageId = pageIdentifier;

            // If we need to load multiple pages (for restoration), do so
            if (targetPageId > 0 && !initialLoadDoneRef.current) {
                let allArticles = [];
                let currentPageId = 0;
                let latestNewsData = {};

                // Load all pages up to the target pageIdentifier
                while (currentPageId <= targetPageId) {
                    const newsData = await newsService.getHeadlines({
                        country_code: currentCountry,
                        page_identifier: String(currentPageId),
                        size: pageSize,
                    });

                    latestNewsData = newsData;
                    const cleaned = (newsData.result || []).map(article => ({
                        ...article,
                        caption_img: parseImageUrl(article.caption_img),
                    }));

                    if (cleaned.length === 0) break;

                    allArticles = [...allArticles, ...cleaned];
                    currentPageId += pageSize;
                }

                setArticles(allArticles);
                setNewsResponse(latestNewsData);
                setHasMoreData(true);
                initialLoadDoneRef.current = true;
            } else {
                // Normal initial load - just load first page
                const newsData = await newsService.getHeadlines({
                    country_code: currentCountry,
                    page_identifier: '0',
                    size: pageSize,
                });

                const cleaned = (newsData.result || []).map(article => ({
                    ...article,
                    caption_img: parseImageUrl(article.caption_img),
                }));

                setArticles(cleaned || []);
                setNewsResponse(newsData);
                setHasMoreData(true);
                initialLoadDoneRef.current = true;
            }

            setLoading(false);
        };

        loadNews();

        const fetchLastUpdated = async () => {
            const dataLastUpdated = await newsService.getLastUpdatedDate();
            setLastUpdated(dataLastUpdated.last_updated_date);
            setLastUpdatedData(dataLastUpdated);
        };
        fetchLastUpdated();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentCountry, pageSize]);

    const totalPages = Math.ceil(articles.length / itemsPerPage);
    const startIndex = (page - 1) * itemsPerPage;
    const currentArticles = articles.slice(startIndex, startIndex + itemsPerPage);

    const handleTabChange = (_, newIndex) => {
        setSelectedTab(newIndex);
        setPage(1);
        setPageIdentifier(0);
        // Reset lastLoadedCountryRef to trigger reload for new country
        lastLoadedCountryRef.current = null;
        // Update URL with new tab, reset page to 1
        updateUrlParams(newIndex, 1, 0);
    };

    const handlePageChange = (_, newPage) => {
        setPage(newPage);
        // Update URL with current tab and new page
        updateUrlParams(selectedTab, newPage, pageIdentifier);
    };

    const handleLoadMore = async () => {
        setLoadingMore(true);
        try {
            // Calculate next page identifier by adding pageSize
            const nextPageIdentifier = pageIdentifier + pageSize;
            const newsData = await newsService.getHeadlines({
                country_code: currentCountry,
                page_identifier: String(nextPageIdentifier),
                size: pageSize,
            });
            const cleaned = (newsData.result || []).map(article => ({
                ...article,
                caption_img: parseImageUrl(article.caption_img),
            }));

            // Check if we got new data
            if (!cleaned || cleaned.length === 0) {
                setHasMoreData(false);
            } else {
                // Append new articles to existing ones
                setArticles(prevArticles => [...prevArticles, ...cleaned]);
                // Update page identifier for next load
                setPageIdentifier(nextPageIdentifier);
                // Update URL with new pageIdentifier
                updateUrlParams(selectedTab, page, nextPageIdentifier);
            }
        } catch (error) {
            console.error('Error loading more news:', error);
            setHasMoreData(false);
        } finally {
            setLoadingMore(false);
        }
    };

    const onArticleClick = ({ userId, reqId, docId, title, last_updated }) => {
        // Update view count
        const key = `${userId}-${reqId}-${docId}`;
        setViewCounts(prev => ({ ...prev, [key]: (prev[key] || 0) + 1 }));

        // Build the return URL with current state in query params
        const returnParams = new URLSearchParams();
        if (selectedTab !== 0) returnParams.set('tab', String(selectedTab));
        if (page !== 1) returnParams.set('page', String(page));
        if (pageIdentifier !== 0) returnParams.set('pageId', String(pageIdentifier));
        const returnUrl = `/NewsRoom${returnParams.toString() ? '?' + returnParams.toString() : ''}`;

        const navigationState = {
            userId,
            reqId,
            docId,
            title,
            selectedCountry: currentCountry,
            selectedTab: selectedTab,
            returnToPage: page,
            returnPageIdentifier: pageIdentifier,
            returnUrl, // Include the return URL for the back button
            last_updated
        };

        // Navigate to article detail - use state for article data, URL will handle return state
        navigate('/NewsRoom', { state: navigationState });
    };

    const handleCountrySelect = (country) => {
        const existsIndex = tabCountries.findIndex(c => c.value === country.value);
        if (existsIndex !== -1) {
            const updatedTabs = tabCountries.filter((_, i) => i !== existsIndex);
            setTabCountries(updatedTabs);
            let newSelectedTab = selectedTab;
            if (selectedTab === existsIndex) {
                newSelectedTab = 0;
                setSelectedTab(0);
            } else if (selectedTab > existsIndex) {
                newSelectedTab = selectedTab - 1;
                setSelectedTab(prev => prev - 1);
            }
            // Reset page and pageIdentifier, update URL
            setPage(1);
            setPageIdentifier(0);
            lastLoadedCountryRef.current = null;
            updateUrlParams(newSelectedTab, 1, 0);
        } else {
            const updatedTabs = [...tabCountries];
            let newSelectedTab = selectedTab;
            if (updatedTabs.length >= 6) {
                updatedTabs.shift();
                if (selectedTab > 0) {
                    newSelectedTab = selectedTab - 1;
                    setSelectedTab(prev => prev - 1);
                }
            }
            updatedTabs.push(country);
            setTabCountries(updatedTabs);
            newSelectedTab = updatedTabs.length - 1;
            setSelectedTab(updatedTabs.length - 1);
            // Reset page and pageIdentifier, update URL
            setPage(1);
            setPageIdentifier(0);
            lastLoadedCountryRef.current = null;
            updateUrlParams(newSelectedTab, 1, 0);
        }
    };

    const getPriorityLevel = (article) => {
        if (article.classifications?.includes('Breaking') ||
            article.title?.toLowerCase().includes('breaking')) {
            return 'high';
        }
        if (article.classifications?.includes('Important') ||
            article.classifications?.includes('Urgent')) {
            return 'medium';
        }
        return 'low';
    };

    let content;
    if (loading) {
        content = (
            <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6" sx={{ mb: 2, color: theme.palette.brand.deepPurple, fontWeight: theme.custom.tokens.fontWeight.semibold }}>
                    Loading latest news...
                </Typography>
                <LinearProgress
                    sx={{
                        borderRadius: 2,
                        height: 6,
                        '& .MuiLinearProgress-bar': {
                            background: `linear-gradient(45deg, ${theme.palette.brand.deepPurple} 30%, ${theme.palette.brand.cyan} 90%)`,
                        },
                    }}
                />
            </Box>
        );
    } else if (currentArticles.length > 0) {
        content = (
            <Box sx={{ p: 2 }}>
                {/* Enhanced Stats Header */}
                <Box
                    sx={{
                        mb: 2.5,
                        p: 2,
                        background: theme.palette.primary[50],
                        borderRadius: '12px',
                        border: `1px solid ${theme.palette.primary[200]}`,
                    }}
                >
                    {/* First Row - Title and Last Updated */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                        <Typography
                            variant="h6"
                            sx={{
                                color: theme.palette.primary[900],
                                fontWeight: 700,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                fontSize: '1.15rem',
                            }}
                        >
                            📰 News and Analysis
                        </Typography>

               
                    </Box>

                    {/* Second Row - Chips and Info text in one row */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                        {/* Left side - Chips */}
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                            <Chip
                                icon={<UpdateIcon />}
                                label={`${articles.length} Total Articles`}
                                variant="outlined"
                                size="small"
                                sx={{
                                    borderColor: theme.palette.brand.cyan,
                                    color: theme.palette.brand.deepPurple,
                                    fontWeight: theme.custom.tokens.fontWeight.semibold,
                                    background: withOpacity(theme.palette.brand.cyan, 0.05),
                                    height: 28,
                                }}
                            />
                            <Chip
                                icon={<LocationIcon />}
                                label={tabCountries[selectedTab]?.label.split(' ').slice(1).join(' ') || 'Country'}
                                variant="outlined"
                                size="small"
                                sx={{
                                    borderColor: theme.palette.brand.deepPurple,
                                    color: theme.palette.brand.deepPurple,
                                    fontWeight: theme.custom.tokens.fontWeight.semibold,
                                    background: withOpacity(theme.palette.brand.deepPurple, 0.05),
                                    height: 28,
                                }}
                            />
                            <Chip
                                label={`Page ${page} of ${totalPages}`}
                                size="small"
                                sx={{
                                    bgcolor: withOpacity(theme.palette.brand.cyan, 0.1),
                                    color: theme.palette.brand.deepPurple,
                                    fontWeight: theme.custom.tokens.fontWeight.semibold,
                                    border: `1px solid ${withOpacity(theme.palette.brand.cyan, 0.2)}`,
                                    height: 28,
                                }}
                            />
                        </Box>

                        {/* Right side - Info text */}
                        <Typography
                            variant="body2"
                            sx={{
                                color: theme.palette.primary[700],
                                fontWeight: 500,
                                fontSize: '0.8rem',
                            }}
                        >
                            Showing 10 articles per page
                        </Typography>
                    </Box>
                </Box>

                {/* Horizontal News Layout */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {currentArticles.map((article, index) => {
                        // const articleKey = `${article.userId || '1'}-${article.reqId || '1'}-${article.docId || '1'}`;
                        const articleKey = `${article.docId || article.reqId || article.userId || article.link || article.title || article.last_updated}-${index}`
                        const viewCount = viewCounts[articleKey] || 0;
                        const priority = getPriorityLevel(article);

                        return (
                            <Card
                                key={articleKey}
                                elevation={0}
                                sx={{
                                    display: 'flex',
                                    flexDirection: { xs: 'column', sm: 'row' },
                                    background: '#fff',
                                    border: priority === 'high'
                                        ? '2px solid #ff4444'
                                        : `1px solid ${theme.palette.primary[200]}`,
                                    borderRadius: '12px',
                                    cursor: 'pointer',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    minHeight: { xs: 'auto', sm: '160px' },
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                                    '&::before': priority === 'high' ? {
                                        content: '""',
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '4px',
                                        height: '100%',
                                        background: '#ff4444',
                                        zIndex: 1,
                                    } : {
                                        content: '""',
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '3px',
                                        height: '100%',
                                        background: theme.palette.primary.main,
                                        zIndex: 1,
                                    },
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: priority === 'high'
                                            ? '0 8px 24px rgba(255, 68, 68, 0.2)'
                                            : '0 8px 24px rgba(0, 0, 0, 0.12)',
                                        borderColor: priority === 'high' ? '#ff6666' : theme.palette.primary[300],
                                        '& .article-image': {
                                            transform: 'scale(1.08)',
                                        },
                                    },
                                }}
                                onClick={() =>
                                    onArticleClick({
                                        userId: 1,
                                        reqId: newsresponse.req_id,
                                        docId: article.doc_id,
                                        title: article.title,
                                        last_updated: article.last_updated,
                                    })
                                }
                            >

                                {/* Article Image or Placeholder */}
                                <Box
                                    sx={{
                                        width: { xs: '100%', sm: '200px', md: '220px' },
                                        height: { xs: '180px', sm: '140px', md: '150px' },
                                        flexShrink: 0,
                                        overflow: 'hidden',
                                        position: 'relative',
                                        borderRadius: { xs: '16px 16px 0 0', sm: '16px 0 0 16px' },
                                        background: article.caption_img
                                            ? 'transparent'
                                            : `linear-gradient(135deg, ${theme.palette.brand.lightBlue} 0%, #e0f2fe 100%)`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    {article.caption_img ? (
                                        <>
                                            <Box
                                                className="article-image"
                                                component="img"
                                                src={article.caption_img}
                                                alt={article.title}
                                                sx={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover',
                                                    transition: 'transform 0.5s ease',
                                                }}
                                            />

                                            {/* Gradient Overlay */}
                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    top: 0,
                                                    bottom: 0,
                                                    right: 0,
                                                    width: '30%',
                                                    background: {
                                                        xs: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                                                        sm: 'linear-gradient(to right, transparent, rgba(248,250,252,0.8))'
                                                    },
                                                }}
                                            />
                                        </>
                                    ) : (
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: '#94a3b8',
                                                textAlign: 'center',
                                                p: 3,
                                            }}
                                        >
                                            <ArticleIcon sx={{ fontSize: 48, mb: 1, opacity: 0.6 }} />
                                            <Typography variant="caption" sx={{ fontWeight: 500 }}>
                                                No Image
                                            </Typography>
                                        </Box>
                                    )}
                                </Box>

                                {/* Content */}
                                <Box
                                    sx={{
                                        flex: 1,
                                        p: 3,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                        minHeight: { xs: 'auto', sm: '150px', md: '160px' },
                                    }}
                                >
                                    {/* Title and Description */}
                                    <Box sx={{ flex: 1 }}>
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                color: '#1e293b',
                                                fontWeight: theme.custom.tokens.fontWeight.bold,
                                                mb: 1.5,
                                                lineHeight: 1.3,
                                                fontSize: { xs: '1rem', sm: '1.1rem' },
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden',
                                            }}
                                        >
                                            {article.title}
                                        </Typography>

                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: '#0f3670ff',
                                                lineHeight: 1.5,
                                                mb: 2,
                                                fontSize: '0.9rem',
                                                display: '-webkit-box',
                                                WebkitLineClamp: { xs: 2, sm: 3 },
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden',
                                            }}
                                        >
                                            {article.summary}
                                        </Typography>
                                    </Box>

                                    {/* Tags and Meta Info */}
                                    <Box>

                                        {/* Footer - Classification and Date in one row */}
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                pt: 2,
                                                borderTop: `1px solid ${theme.palette.primary[200]}`,  // Visible border
                                                flexWrap: 'wrap',
                                                gap: 1,
                                            }}
                                        >
                                            {/* Classifications */}
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, flex: 1 }}>

                                                {article.classifications?.slice(0, 3).map((cls, idx) => (
                                                    <Chip
                                                        key={idx}
                                                        label={cls}
                                                        size="small"
                                                        sx={{
                                                            bgcolor: withOpacity(theme.palette.brand.cyan, 0.1),
                                                            color: theme.palette.brand.deepPurple,
                                                            fontSize: '0.7rem',
                                                            fontWeight: theme.custom.tokens.fontWeight.semibold,
                                                            border: `1px solid withOpacity(theme.palette.brand.cyan, 0.2)`,
                                                            height: 22,
                                                        }}
                                                    />
                                                ))}
                                            </Box>

                                            {/* Date and View Count */}
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                {article.last_updated && (
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                        <ScheduleIcon sx={{ fontSize: 16, color: '#001430ff' }} />
                                                        <Typography
                                                            variant="caption"
                                                            sx={{
                                                                color: '#001430ff',
                                                                fontSize: '0.8rem',
                                                                fontWeight: 500,
                                                            }}
                                                        >
                                                            {new Date(article.last_updated).toLocaleDateString()}
                                                        </Typography>
                                                    </Box>
                                                )}

                                                {viewCount > 0 && (
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                        <ViewIcon sx={{ fontSize: 16, color: '#94a3b8' }} />
                                                        <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 500 }}>
                                                            {viewCount}
                                                        </Typography>
                                                    </Box>
                                                )}
                                            </Box>
                                        </Box>
                                    </Box>
                                </Box>
                            </Card>
                        );
                    })}
                </Box>

                {/* Pagination after content */}
                {/* Pagination after content */}
                {totalPages > 1 && (
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 2,
                            p: 2,
                            borderTop: `1px solid ${theme.palette.primary[200]}`,
                            background: theme.palette.primary[50],
                        }}
                    >
                        <Pagination
                            count={totalPages}
                            page={page}
                            onChange={handlePageChange}
                            shape="rounded"
                            size="medium"
                            sx={{
                                '& .MuiPaginationItem-root': {
                                    color: '#64748b',
                                    borderColor: withOpacity(theme.palette.brand.cyan, 0.3),
                                    fontWeight: theme.custom.tokens.fontWeight.semibold,
                                    fontSize: '0.9rem',
                                    minWidth: '32px',
                                    height: '32px',
                                    '&:hover': {
                                        bgcolor: withOpacity(theme.palette.brand.cyan, 0.1),
                                        borderColor: theme.palette.brand.cyan,
                                        color: theme.palette.brand.deepPurple,
                                        transform: 'scale(1.05)',
                                    },
                                    '&.Mui-selected': {
                                        background: `linear-gradient(135deg, ${theme.palette.brand.deepPurple} 0%, ${theme.palette.brand.cyan} 100%)`,
                                        color: 'white',
                                        fontWeight: theme.custom.tokens.fontWeight.bold,
                                        '&:hover': {
                                            background: 'linear-gradient(135deg, #1a1350 0%, #5ab5e0 100%)',
                                        },
                                    },
                                },
                            }}
                        />

                        {/* Load More Button - Appears when on last page AND there might be more data */}
                        {page === totalPages && totalPages >= 2 && hasMoreData && (
                            <Button
                                variant="contained"
                                startIcon={loadingMore ? null : <AddIcon />}
                                onClick={handleLoadMore}
                                disabled={loadingMore}
                                sx={{
                                    background: `linear-gradient(135deg, ${theme.palette.brand.deepPurple} 0%, ${theme.palette.brand.cyan} 100%)`,
                                    color: 'white',
                                    fontWeight: theme.custom.tokens.fontWeight.bold,
                                    fontSize: '0.95rem',
                                    py: 1.5,
                                    px: 4,
                                    borderRadius: theme.custom.tokens.borderRadius.sm,
                                    textTransform: 'none',
                                    boxShadow: `0 4px 20px withOpacity(theme.palette.brand.cyan, 0.3)`,
                                    transition: theme.custom.tokens.transitions.default,
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #1a1350 0%, #5ab5e0 100%)',
                                        transform: 'translateY(-2px)',
                                        boxShadow: `0 6px 25px withOpacity(theme.palette.brand.cyan, 0.4)`,
                                    },
                                    '&:disabled': {
                                        background: 'linear-gradient(135deg, #94a3b8 0%, #cbd5e1 100%)',
                                        color: 'white',
                                    }
                                }}
                            >
                                {loadingMore ? (
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <LinearProgress
                                            sx={{
                                                width: 100,
                                                borderRadius: 2,
                                                height: 4,
                                                backgroundColor: 'rgba(255,255,255,0.3)',
                                                '& .MuiLinearProgress-bar': {
                                                    backgroundColor: 'white',
                                                },
                                            }}
                                        />
                                        <Typography variant="body2">Loading...</Typography>
                                    </Box>
                                ) : (
                                    `Load More Articles (${articles.length} loaded)`
                                )}
                            </Button>
                        )}

                        {/* No More Data Message */}
                        {page === totalPages && totalPages >= 10 && !hasMoreData && (
                            <Typography
                                variant="body2"
                                sx={{
                                    color: '#64748b',
                                    fontWeight: 500,
                                    fontStyle: 'italic',
                                }}
                            >
                                No more articles available
                            </Typography>
                        )}
                    </Box>
                )}

            </Box>
        );
    } else {
        content = (
            <Box sx={{ p: 6, textAlign: 'center' }}>
                <LanguageIcon sx={{ fontSize: 64, color: '#94a3b8', mb: 2 }} />
                <Typography variant="h5" sx={{ color: '#64748b', fontWeight: theme.custom.tokens.fontWeight.semibold, mb: 1 }}>
                    No articles available
                </Typography>
                <Typography variant="body1" sx={{ color: '#94a3b8' }}>
                    No news articles found for this country at the moment.
                </Typography>
            </Box>
        );
    }

    const handleCountryListOpen = (event) => {
        setCountryListAnchor(event.currentTarget);
    };

    const handleCountryListClose = () => {
        setCountryListAnchor(null);
        setCountrySearchQuery('');
    };

    const isCountryListOpen = Boolean(countryListAnchor);

    return (
        <Box sx={{ position: 'relative' }}>
            {/* Last Updated Note - Top Right */}
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    mb: 1,
                    mt: 1,
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        px: 2,
                        py: 1,
                        borderRadius: '12px',
                        background: `linear-gradient(135deg, ${theme.palette.primary[50]} 0%, ${theme.palette.primary[100]} 100%)`,
                        border: `1px solid ${theme.palette.primary[200]}`,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    }}
                >
                    <AccessTimeIcon sx={{ fontSize: '1rem', color: theme.palette.primary.main }} />
                    <Typography
                        sx={{
                            fontSize: '0.85rem',
                            color: theme.palette.primary[700],
                            fontWeight: 500,
                        }}
                    >
                        Last Updated:
                    </Typography>
                    <Typography
                        sx={{
                            fontSize: '0.85rem',
                            color: theme.palette.primary.main,
                            fontWeight: 700,
                        }}
                    >
                        {lastUpdatedData?.last_updated_date ? new Date(lastUpdatedData.last_updated_date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                        }) : 'Loading...'}
                    </Typography>
                    <Tooltip title="View country-wise last updated dates" arrow>
                        <Box
                            onClick={handleCountryListOpen}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                ml: 0.5,
                                p: 0.5,
                                borderRadius: '8px',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                background: isCountryListOpen ? theme.palette.primary.main : 'transparent',
                                '&:hover': {
                                    background: isCountryListOpen ? theme.palette.primary.dark : theme.palette.primary[200],
                                },
                            }}
                        >
                            <InfoOutlinedIcon
                                sx={{
                                    fontSize: '1.1rem',
                                    color: isCountryListOpen ? '#fff' : theme.palette.primary.main,
                                }}
                            />
                        </Box>
                    </Tooltip>
                </Box>
            </Box>

            {/* Country List Popover */}
            <Popover
                open={isCountryListOpen}
                anchorEl={countryListAnchor}
                onClose={handleCountryListClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                PaperProps={{
                    sx: {
                        mt: 1,
                        borderRadius: '16px',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                        border: `1px solid ${theme.palette.primary[200]}`,
                        maxHeight: '400px',
                        overflow: 'hidden',
                    },
                }}
            >
                <Box sx={{ width: 320 }}>
                    {/* Header */}
                    <Box
                        sx={{
                            p: 2,
                            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary[700]} 100%)`,
                            borderBottom: `1px solid ${theme.palette.primary[300]}`,
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: '1rem',
                                fontWeight: 700,
                                color: '#fff',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                            }}
                        >
                            <LocationIcon sx={{ fontSize: '1.2rem' }} />
                            Country-wise Last Updated
                        </Typography>
                    </Box>
                    {/* Search Box */}
                    <Box sx={{ p: 1.5, borderBottom: `1px solid ${theme.palette.primary[100]}` }}>
                        <TextField
                            fullWidth
                            size="small"
                            placeholder="Search country..."
                            value={countrySearchQuery}
                            onChange={(e) => setCountrySearchQuery(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon sx={{ color: theme.palette.primary[400], fontSize: '1.1rem' }} />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '10px',
                                    background: theme.palette.primary[50],
                                    fontSize: '0.85rem',
                                    '& fieldset': {
                                        borderColor: theme.palette.primary[200],
                                    },
                                    '&:hover fieldset': {
                                        borderColor: theme.palette.primary[300],
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: theme.palette.primary.main,
                                    },
                                },
                                '& .MuiInputBase-input::placeholder': {
                                    color: theme.palette.primary[400],
                                    opacity: 1,
                                },
                            }}
                        />
                    </Box>
                    {/* Country List */}
                    <Box
                        sx={{
                            maxHeight: '260px',
                            overflowY: 'auto',
                            '&::-webkit-scrollbar': {
                                width: '6px',
                            },
                            '&::-webkit-scrollbar-track': {
                                background: theme.palette.primary[50],
                            },
                            '&::-webkit-scrollbar-thumb': {
                                background: theme.palette.primary[300],
                                borderRadius: '3px',
                            },
                        }}
                    >
                        {(lastUpdatedData?.last_updated_list || [])
                            .filter(item => item.country.toLowerCase().includes(countrySearchQuery.toLowerCase()))
                            .map((item, index, filteredArray) => (
                            <Box
                                key={item.country}
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    px: 1,
                                    py: 1,
                                    borderBottom: index < filteredArray.length - 1
                                        ? `1px solid ${theme.palette.primary[100]}`
                                        : 'none',
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                        background: theme.palette.primary[50],
                                    },
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                    <Box
                                        sx={{
                                            width: 8,
                                            height: 8,
                                            borderRadius: '50%',
                                            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                                        }}
                                    />
                                    <Typography
                                        sx={{
                                            fontSize: '0.9rem',
                                            fontWeight: 600,
                                            color: theme.palette.text.primary,
                                        }}
                                    >
                                        {item.country}
                                    </Typography>
                                </Box>
                                <Chip
                                    size="small"
                                    label={new Date(item.last_modified_date).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric',
                                    })}
                                    sx={{
                                        background: theme.palette.primary[100],
                                        color: theme.palette.primary[800],
                                        fontWeight: 600,
                                        fontSize: '0.75rem',
                                        height: 24,
                                    }}
                                />
                            </Box>
                        ))}
                        {/* No Results Message */}
                        {countrySearchQuery && (lastUpdatedData?.last_updated_list || []).filter(item =>
                            item.country.toLowerCase().includes(countrySearchQuery.toLowerCase())
                        ).length === 0 && (
                            <Box sx={{
                                py: 3,
                                px: 2,
                                textAlign: 'center',
                            }}>
                                <Typography sx={{
                                    color: theme.palette.text.secondary,
                                    fontSize: '0.85rem',
                                }}>
                                    No countries found for "{countrySearchQuery}"
                                </Typography>
                            </Box>
                        )}
                    </Box>
                </Box>
            </Popover>

            <Box sx={{
                display: 'flex',
                minHeight: 'calc(100vh - 150px)',
                height: 'calc(100vh - 190px)',
                gap: 2,
                background: 'transparent',
            }}>
                {/* Enhanced Sidebar */}
                <Paper
                    elevation={0}
                    sx={{
                        width: 260,
                        height: 'calc(100vh - 150px)',
                        background: '#fff',
                        border: `1px solid ${theme.palette.primary[200]}`,
                        borderRadius: '16px',
                        overflow: 'hidden',
                        flexShrink: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    }}
                >
                    {/* Enhanced Search Header */}
                    <Box
                        sx={{
                            p: 2,
                            background: theme.palette.primary.main,
                            borderBottom: `1px solid ${theme.palette.primary[300]}`,
                        }}
                    >
                        <Box sx={{ position: 'relative', zIndex: 1 }}>
                            <TextField
                                size="small"
                                fullWidth
                                placeholder="Search for any country..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                variant="outlined"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon sx={{
                                                color: theme.palette.secondary.main,
                                                fontSize: 20
                                            }} />
                                        </InputAdornment>
                                    ),
                                    sx: {
                                        color: theme.palette.text.primary,
                                        fontSize: '0.9rem',
                                        fontWeight: 500,
                                        height: '44px',
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderColor: `${theme.palette.primary.light}40`,
                                            borderWidth: '1px',
                                        },
                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                            borderColor: `${theme.palette.primary.light}80`,
                                            borderWidth: '1px',
                                        },
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                            borderColor: theme.palette.primary.main,
                                            borderWidth: '2px',
                                        },
                                    },
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '10px',
                                        backgroundColor: '#fff',
                                        transition: 'all 0.2s ease',
                                        '&:hover': {
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                        },
                                        '&.Mui-focused': {
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                        }
                                    },
                                    '& .MuiOutlinedInput-input': {
                                        '&::placeholder': {
                                            color: theme.palette.primary[600],
                                            opacity: 0.8,
                                            fontWeight: 500,
                                        }
                                    },
                                }}
                            />
                        </Box>
                    </Box>

                    {/* Countries List */}
                    <Box sx={{
                        flex: 1,
                        overflow: 'auto',
                        p: 1,
                        position: 'relative',
                        zIndex: 1,
                        scrollBehavior: 'smooth',
                        '&::-webkit-scrollbar': {
                            width: '6px',
                        },
                        '&::-webkit-scrollbar-track': {
                            background: `${theme.palette.primary.light}15`,
                            borderRadius: theme.custom.tokens.borderRadius.sm,
                        },
                        '&::-webkit-scrollbar-thumb': {
                            background: `linear-gradient(135deg,
                            ${theme.palette.primary.main} 0%,
                            ${theme.palette.primary.dark} 100%)`,
                            borderRadius: theme.custom.tokens.borderRadius.sm,
                            border: `1px solid ${theme.palette.primary.light}30`,
                        },
                        '&::-webkit-scrollbar-thumb:hover': {
                            background: `linear-gradient(135deg,
                            ${theme.palette.primary.dark} 0%,
                            ${theme.palette.primary.main} 100%)`,
                        },
                    }}>
                        {regionsData.map((region) => {
                            const visibleCountries = region.countries.filter(c =>
                                c.label.toLowerCase().includes(search.toLowerCase()) ||
                                c.value.toLowerCase().includes(search.toLowerCase())
                            );

                            if (visibleCountries.length === 0) return null;

                            const defaultExpanded = region.countries.some(country => tabCountries.some(c => c.value === country.value));
                            return (
                                <Accordion
                                    key={`${region.region}-${search.trim() ? 'search' : 'normal'}`}

                                    defaultExpanded={search.trim() || defaultExpanded}

                                    elevation={0}
                                    sx={{
                                        mb: 2,
                                        border: `1px solid ${theme.palette.primary.light}25`,
                                        borderRadius: `${theme.custom.tokens.borderRadius.card}px !important`,
                                        background: `linear-gradient(135deg,
                                        ${theme.palette.background.paper}80 0%,
                                        ${theme.palette.background.default}60 100%)`,
                                        backdropFilter: 'blur(10px)',
                                        WebkitBackdropFilter: 'blur(10px)',
                                        transition: theme.custom.tokens.transitions.default,
                                        '&:before': {
                                            display: 'none',
                                        },
                                        '&.Mui-expanded': {
                                            margin: '0 0 16px 0',
                                            boxShadow: `0 8px 24px ${theme.palette.primary.main}15`,
                                            border: `1px solid ${theme.palette.primary.light}40`,
                                            transform: 'translateY(-2px)',
                                        },
                                        '&:hover': {
                                            boxShadow: `0 6px 20px ${theme.palette.primary.main}10`,
                                            border: `1px solid ${theme.palette.primary.light}35`,
                                        }
                                    }}
                                >
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon sx={{
                                            color: theme.palette.primary.main,
                                            fontSize: 20
                                        }} />}
                                        sx={{
                                            minHeight: 48,
                                            background: theme.palette.primary[50],
                                            transition: 'all 0.2s ease',
                                            '&:hover': {
                                                background: theme.palette.primary[100],
                                            },
                                            '& .MuiAccordionSummary-content': {
                                                margin: '10px 0',
                                                alignItems: 'center',
                                            },
                                        }}
                                    >
                                        <Typography
                                            variant="subtitle2"
                                            sx={{
                                                fontWeight: 600,
                                                color: theme.palette.primary.main,
                                                fontSize: '0.85rem',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.5px',
                                            }}
                                        >
                                            {region.region}
                                        </Typography>
                                    </AccordionSummary>
                                    <AccordionDetails
                                        sx={{
                                            pt: 0,
                                            pb: 2,
                                            px: 2,
                                            mt:1,
                                        }}
                                    >
                                        {/* Countries Cards */}
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                            {visibleCountries.map((country) => {
                                                const selected = tabCountries.some(c => c.value === country.value);
                                                return (
                                                    <Box
                                                        key={country.value}
                                                        onClick={() => handleCountrySelect(country)}
                                                        sx={{
                                                            p: 1,
                                                            
                                                            cursor: 'pointer',
                                                            borderRadius: theme.custom.tokens.borderRadius.sm,
                                                            background: selected
                                                                ? `linear-gradient(135deg,
                                                                ${theme.palette.primary.light}15 0%,
                                                                ${theme.palette.primary.main}08 100%)`
                                                                : 'transparent',
                                                            border: selected
                                                                ? `1px solid ${theme.palette.primary.light}40`
                                                                : '1px solid transparent',
                                                            transition: theme.custom.tokens.transitions.default,
                                                            position: 'relative',
                                                            overflow: 'hidden',
                                                            '&::before': selected ? {
                                                                content: '""',
                                                                position: 'absolute',
                                                                left: 0,
                                                                top: 0,
                                                                bottom: 0,
                                                                width: '3px',
                                                                background: `linear-gradient(135deg,
                                                                ${theme.palette.primary.main} 0%,
                                                                ${theme.palette.secondary.main} 100%)`,
                                                                borderRadius: '0 12px 12px 0'
                                                            } : {},
                                                            '&:hover': {
                                                                background: selected
                                                                    ? `linear-gradient(135deg,
                                                                    ${theme.palette.primary.light}20 0%,
                                                                    ${theme.palette.primary.main}12 100%)`
                                                                    : `linear-gradient(135deg,
                                                                    ${theme.palette.primary.light}10 0%,
                                                                    ${theme.palette.primary.main}05 100%)`,
                                                                transform: 'translateX(4px)',
                                                                borderColor: `${theme.palette.primary.light}25`,
                                                                boxShadow: `0 4px 12px ${theme.palette.primary.main}08`,
                                                            },
                                                        }}
                                                    >
                                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                            <Typography
                                                                variant="body2"
                                                                sx={{
                                                                    fontSize: '0.9rem',
                                                                    fontWeight: selected ? 700 : 500,
                                                                    color: selected
                                                                        ? theme.palette.primary.main
                                                                        : theme.palette.text.primary,
                                                                    transition: 'all 0.2s ease',
                                                                }}
                                                            >
                                                                {country.label}
                                                            </Typography>
                                                            {selected && (
                                                                <Box
                                                                    sx={{
                                                                        width: 8,
                                                                        height: 8,
                                                                        borderRadius: '50%',
                                                                        background: `linear-gradient(135deg,
                                                                        ${theme.palette.primary.main} 0%,
                                                                        ${theme.palette.secondary.main} 100%)`,
                                                                        boxShadow: `0 2px 8px ${theme.palette.primary.main}50`,
                                                                        animation: 'pulse 2s infinite',
                                                                        '@keyframes pulse': {
                                                                            '0%, 100%': {
                                                                                transform: 'scale(1)',
                                                                                opacity: 1
                                                                            },
                                                                            '50%': {
                                                                                transform: 'scale(1.2)',
                                                                                opacity: 0.8
                                                                            }
                                                                        }
                                                                    }}
                                                                />
                                                            )}
                                                        </Box>
                                                    </Box>
                                                );
                                            })}
                                        </Box>
                                    </AccordionDetails>
                                </Accordion>
                            );
                        })}
                    </Box>
                </Paper>

                {/* Enhanced Main Content */}
                <Paper
                    elevation={0}
                    sx={{
                        flex: 1,
                        height: 'calc(100vh - 150px)',
                        background: '#fff',
                        borderRadius: '16px',
                        border: `1px solid ${theme.palette.primary[200]}`,
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    }}
                >
                    {/* Enhanced Tab Header */}
                    <Box
                        sx={{
                            background: 'linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%)',
                            borderBottom: `2px solid ${theme.palette.primary[200]}`,
                            position: 'relative',
                            pb: 0.5,
                        }}
                    >
                        <Tabs
                            value={selectedTab}
                            onChange={handleTabChange}
                            variant={isMobile ? 'scrollable' : 'fullWidth'}
                            scrollButtons={isMobile ? 'auto' : false}
                            TabIndicatorProps={{
                                style: {
                                    background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary[400]} 100%)`,
                                    height: 3,
                                    borderRadius: '3px 3px 0 0',
                                }
                            }}
                            sx={{
                                minHeight: 60,
                                '& .MuiTabs-flexContainer': {
                                    gap: 0.5,
                                },
                                '& .MuiTab-root': {
                                    textTransform: 'none',
                                    fontWeight: 600,  // Increased from 500 to 600 for better visibility
                                    fontSize: '1rem',  // Increased from 0.95rem to 1rem
                                    color: theme.palette.primary[900],  // Darker color (from [700] to [900]) for better visibility
                                    minHeight: 58,
                                    px: 2.5,
                                    borderRadius: '12px 12px 0 0',
                                    position: 'relative',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    background: 'rgba(255, 255, 255, 0.6)',
                                    border: `2px solid transparent`,
                                    borderBottom: 'none',
                                    overflow: 'hidden',
                                    '&::before': {
                                        content: '""',
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        height: '2px',
                                        background: 'transparent',
                                        transition: 'all 0.3s ease',
                                    },
                                    '&:hover': {
                                        color: theme.palette.primary.main,
                                        background: '#fff',
                                        transform: 'translateY(-3px)',
                                        border: `2px solid ${theme.palette.primary[200]}`,
                                        borderBottom: 'none',
                                        boxShadow: '0 -4px 12px rgba(0, 0, 0, 0.08)',
                                        '&::before': {
                                            background: `linear-gradient(90deg, ${theme.palette.primary[400]} 0%, ${theme.palette.primary[300]} 100%)`,
                                        },
                                    },
                                },
                                '& .Mui-selected': {
                                    color: theme.palette.primary.main,  // Dark purple text for visibility
                                    fontWeight: 700,  // Extra bold for better readability
                                    fontSize: '1.05rem',  // Slightly larger for selected state
                                    background: `linear-gradient(135deg, ${theme.palette.primary[100]} 0%, ${theme.palette.primary[50]} 100%)`,  // Light purple gradient background
                                    border: `2px solid ${theme.palette.primary.main}`,  // Dark border for emphasis
                                    borderBottom: 'none',
                                    transform: 'translateY(-4px)',
                                    boxShadow: `0 -6px 20px ${theme.palette.primary.main}40, 0 2px 8px rgba(0,0,0,0.1)`,
                                    '&::before': {
                                        content: '""',
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        height: '3px',
                                        background: theme.palette.primary.main,  // Solid color accent bar
                                    },
                                    '&:hover': {
                                        background: `linear-gradient(135deg, ${theme.palette.primary[100]} 0%, ${theme.palette.primary[50]} 100%)`,
                                        transform: 'translateY(-4px)',
                                    },
                                },
                            }}
                        >
                            {tabCountries.map((country) => (
                                <Tab
                                    key={country.value}
                                    label={
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <span style={{ fontSize: '1.2em' }}>
                                                {country.label.split(' ')[0]}
                                            </span>
                                            <Box>
                                                <Typography variant="body2" sx={{ fontWeight: 'inherit' }}>
                                                    {country.label.split(' ').slice(1).join(' ')}
                                                </Typography>
                                                {country.trending && (
                                                    <Chip
                                                        size="small"
                                                        label="Hot"
                                                        sx={{
                                                            height: 16,
                                                            fontSize: '0.65rem',
                                                            background: 'linear-gradient(45deg, #FF6B6B, #FF8E8E)',
                                                            color: 'white',
                                                            fontWeight: theme.custom.tokens.fontWeight.bold,
                                                        }}
                                                    />
                                                )}
                                            </Box>
                                        </Box>
                                    }
                                />
                            ))}
                        </Tabs>
                    </Box>

                    {/* Content Area */}
                    <Fade in>
                        <Box
                            sx={{
                                flex: 1,
                                overflowY: 'auto',
                                scrollBehavior: 'smooth',
                                display: 'flex',
                                flexDirection: 'column',
                                '&::-webkit-scrollbar': {
                                    width: '6px',
                                },
                                '&::-webkit-scrollbar-track': {
                                    background: withOpacity(theme.palette.brand.cyan, 0.1),
                                    borderRadius: '10px',
                                },
                                '&::-webkit-scrollbar-thumb': {
                                    background: `linear-gradient(135deg, ${theme.palette.brand.deepPurple} 0%, ${theme.palette.brand.cyan} 100%)`,
                                    borderRadius: '10px',
                                },
                                '&::-webkit-scrollbar-thumb:hover': {
                                    background: 'linear-gradient(135deg, #1a1350 0%, #5ab5e0 100%)',
                                },
                            }}
                        >
                            {content}
                        </Box>
                    </Fade>
                </Paper>
            </Box>
        </Box>
    );
}

export default EnhancedNewsTabs;