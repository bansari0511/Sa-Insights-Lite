import { useState, useEffect } from 'react';
import { withOpacity } from '../../theme/palette';
import {
    Box, Typography, LinearProgress, Card, Chip, Pagination,
    Grid, Fade, Button, Divider, useTheme
} from '@mui/material';
import {
    Schedule as ScheduleIcon,
    TrendingUp as TrendingUpIcon,
    Public as PublicIcon,
    Article as ArticleIcon,
    PriorityHigh as PriorityHighIcon,
    ExpandMore as ExpandMoreIcon,
    ExpandLess as ExpandLessIcon,
    Security as SecurityIcon,
} from '@mui/icons-material';
import { newsService } from 'src/services/dataService';

const currentCountry = "intelligence_briefing";
// Fetch news from API or dummy data (uses unified dataService)
const fetchNews = async (countryCode, pageIdentifier = 0, pageSize = 20) => {
    try {
        return await newsService.getHeadlines({
            size: pageSize,
            page_identifier: String(pageIdentifier),
            country_code: countryCode,
        });
    } catch (error) {
        console.error("News Fetch Error:", error);
        return { result: [] };
    }
};
import { useNavigate, useLocation } from 'react-router-dom';



const fetchNewsDetails = async (pageIdentifier, pageSize) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const mockArticles = Array.from({ length: pageSize }, (_, i) => ({
        doc_id: `article-${pageIdentifier}-${i}`,
        title: `${pageIdentifier * pageSize + i + 1}`,
        classifications: ['Politics', 'Breaking', 'International'].slice(0, Math.floor(Math.random() * 3) + 1),
    }));

    return { result: mockArticles, req_id: 'req-123' };
};

function IntelligenceBriefings({ initialTab }) {
    const theme = useTheme();

    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(initialTab || 1);
    const [pageIdentifier, setPageIdentifier] = useState(0);
    const [newsresponse, setNewsResponse] = useState({});
    const [hasMoreData, setHasMoreData] = useState(true);
    const [pageSize] = useState(20);
    const [expandedSummaries, setExpandedSummaries] = useState({});
    const [loadingMore, setLoadingMore] = useState(false);
    const itemsPerPage = 10;
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        loadInitialNews();
    }, []);

    useEffect(() => {
        // Restore page from location state if available
        if (location.state?.returnToPage) {
            setPage(location.state.returnToPage);
        }
    }, [location.state]);

    const loadInitialNews = async () => {
        setLoading(true);
        try {
            const nextPageIdentifier = pageIdentifier + pageSize;
            const newsData = await fetchNews(currentCountry, nextPageIdentifier, pageSize);
            console.log("newsData", newsData)
            fetchNewsDetails(0, pageSize)
            setArticles(newsData.result || []);
            setPage(1);
            setPageIdentifier(0);
            setHasMoreData(true);
            setNewsResponse(newsData);
        } catch (error) {
            console.error('Error loading news:', error);
        } finally {
            setLoading(false);
        }
    };

    const onArticleClick = ({ userId, reqId, docId, title, last_updated }) => {
        navigate('/NewsRoom', {
            state: {
                userId,
                reqId,
                docId,
                title,
                selectedCountry: 'intelligence_briefing',
                selectedTab: '',
                returnToPage: page,
                last_updated
            },
        });
    };

    const loadMoreNews = async () => {
        setLoadingMore(true);
        try {
            const nextPageIdentifier = pageIdentifier + 1;
            const newsData = await fetchNews(currentCountry, nextPageIdentifier, pageSize);
            if (newsData.result && newsData.result.length > 0) {
                setArticles(prev => [...prev, ...newsData.result]);
                setPageIdentifier(nextPageIdentifier);
                setNewsResponse(newsData);
            } else {
                setHasMoreData(false);
            }
        } catch (error) {
            console.error('Error loading more news:', error);
        } finally {
            setLoadingMore(false);
        }
    };

    const toggleSummaryExpansion = (docId, e) => {
        e.stopPropagation();
        setExpandedSummaries(prev => ({
            ...prev,
            [docId]: !prev[docId]
        }));
    };

    const getDisplayedSummary = (summary, docId) => {
        const truncatedSummary = summary.length > 300 ? summary.substring(0, 300) + '...' : summary;
        const isExpanded = expandedSummaries[docId];
        return isExpanded ? summary : truncatedSummary;
    };

    const shouldShowExpandButton = (summary) => {
        return summary.length > 300;
    };

    const getPriorityLevel = (article) => {
        if (article.title?.toLowerCase().includes('breaking')) {
            return 'high';
        }
        return 'normal';
    };

    const totalPages = Math.ceil(articles.length / itemsPerPage);
    const startIndex = (page - 1) * itemsPerPage;
    const currentArticles = articles.slice(startIndex, startIndex + itemsPerPage);

    // Separate priority articles
    const priorityArticles = currentArticles.filter(article => getPriorityLevel(article) === 'high');
    const normalArticles = currentArticles.filter(article => getPriorityLevel(article) === 'normal');

    const handlePageChange = (_event, value) => {
        setPage(value);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (loading && articles.length === 0) {
        return (
            <Box sx={{ p: 4, textAlign: 'center' }}>
                <SecurityIcon sx={{ fontSize: 64, color: theme.palette.brand.cyan, mb: 2, opacity: 0.7 }} />
                <Typography variant="h6" sx={{ mb: 2, color: theme.palette.brand.deepPurple, fontWeight: theme.custom.tokens.fontWeight.semibold }}>
                    Loading Intelligence Briefings...
                </Typography>
                <LinearProgress
                    sx={{
                        borderRadius: 2,
                        height: 6,
                        maxWidth: 400,
                        mx: 'auto',
                        backgroundColor: withOpacity(theme.palette.brand.cyan, 0.2),
                        '& .MuiLinearProgress-bar': {
                            background: 'linear-gradient(90deg, theme.palette.brand.deepPurple 0%, theme.palette.brand.cyan 100%)',
                        },
                    }}
                />
            </Box>
        );
    }

    return (
        <Box sx={{ px: 2 }}>
            {/* Stats Header */}
            <Box sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                mb: 2,
                flexWrap: 'wrap',
                gap: 1
            }}>
                <Chip
                    icon={<ArticleIcon />}
                    label={`${articles.length} Total Briefings`}
                    sx={{
                        background: 'linear-gradient(135deg, theme.palette.brand.deepPurple 0%, theme.palette.brand.cyan 100%)',
                        color: 'white',
                        fontWeight: theme.custom.tokens.fontWeight.semibold,
                        fontSize: '0.85rem',
                        height: 36,
                        '& .MuiChip-icon': { color: 'white' }
                    }}
                />
                <Chip
                    icon={<PublicIcon />}
                    label={`Page ${page} of ${totalPages}`}
                    sx={{
                        bgcolor: withOpacity(theme.palette.brand.cyan, 0.15),
                        color: theme.palette.brand.deepPurple,
                        fontWeight: theme.custom.tokens.fontWeight.semibold,
                        fontSize: '0.85rem',
                        height: 36,
                        border: '1px solid withOpacity(theme.palette.brand.cyan, 0.3)',
                    }}
                />
            </Box>

            {/* Priority/Breaking News Section */}
            {priorityArticles.length > 0 && (
                <Fade in={true}>
                    <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                            <PriorityHighIcon sx={{ color: '#d32f2f', fontSize: 24 }} />
                            <Typography variant="h6" sx={{ color: theme.palette.primary[900], fontWeight: 600, fontSize: '1.1rem' }}>
                                Priority Briefings
                            </Typography>
                            <Chip
                                label={priorityArticles.length}
                                size="small"
                                sx={{
                                    bgcolor: '#d32f2f',
                                    color: 'white',
                                    fontWeight: 600,
                                    minWidth: 24,
                                    height: 24,
                                }}
                            />
                        </Box>
                        <Grid container spacing={1.5}>
                            {priorityArticles.map((article, idx) => {
                                const articleKey = `${article.docId || article.reqId || article.userId || article.link || article.title || article.last_updated}-${idx}`;
                                const isExpanded = expandedSummaries[articleKey];

                                return (
                                    <Grid item xs={12} key={articleKey}>
                                        <Card
                                            elevation={0}
                                            sx={{
                                                background: '#fff',
                                                border: '2px solid #d32f2f',
                                                borderRadius: 2,
                                                overflow: 'hidden',
                                                transition: 'all 0.2s ease',
                                                position: 'relative',
                                                '&:hover': {
                                                    transform: 'translateY(-2px)',
                                                    boxShadow: '0 4px 12px rgba(211, 47, 47, 0.2)',
                                                },
                                                '&::before': {
                                                    content: '""',
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    width: '4px',
                                                    height: '100%',
                                                    background: '#d32f2f',
                                                }
                                            }}
                                        >
                                            <Box sx={{ p: 2, pl: 3, display: 'flex', flexDirection: 'column', minHeight: isExpanded ? 'auto' : '280px' }}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                                    <Box sx={{ flex: 1 }}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                                            <Chip
                                                                label="BREAKING"
                                                                size="small"
                                                                sx={{
                                                                    bgcolor: '#d32f2f',
                                                                    color: 'white',
                                                                    fontWeight: 600,
                                                                    fontSize: '0.7rem',
                                                                    height: 20,
                                                                }}
                                                            />
                                                            <Typography variant="caption" sx={{ color: theme.palette.primary[600], fontWeight: 500 }}>
                                                                #{(page - 1) * itemsPerPage + idx + 1}
                                                            </Typography>
                                                        </Box>
                                                        <Typography
                                                            variant="h6"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                onArticleClick({
                                                                    userId: 1,
                                                                    reqId: newsresponse.req_id,
                                                                    docId: article.doc_id,
                                                                    title: article.title,
                                                                    last_updated: article.last_updated,
                                                                });
                                                            }}
                                                            sx={{
                                                                color: theme.palette.primary[900],
                                                                fontWeight: 600,
                                                                fontSize: '1.1rem',
                                                                mb: 1,
                                                                cursor: 'pointer',
                                                                textDecoration: 'none',
                                                                lineHeight: 1.3,
                                                                '&:hover': {
                                                                    color: '#d32f2f',
                                                                }
                                                            }}
                                                        >
                                                            {article.title}
                                                        </Typography>
                                                    </Box>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: 2 }}>
                                                        <ScheduleIcon sx={{ fontSize: 14, color: theme.palette.primary[600] }} />
                                                        <Typography variant="caption" sx={{ color: theme.palette.primary[600], fontWeight: 500, fontSize: '0.75rem' }}>
                                                            {new Date(article.last_updated).toLocaleDateString('en-US', {
                                                                month: 'short',
                                                                day: 'numeric',
                                                                year: 'numeric'
                                                            })}
                                                        </Typography>
                                                    </Box>
                                                </Box>

                                                <Box sx={{ flex: 1 }}>
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            color: theme.palette.primary[800],
                                                            lineHeight: 1.6,
                                                            fontSize: '0.9rem',
                                                            mb: 1,
                                                            whiteSpace: 'pre-wrap',
                                                            wordWrap: 'break-word',
                                                        }}
                                                    >
                                                        {getDisplayedSummary(article.summary, articleKey)}
                                                    </Typography>

                                                    {shouldShowExpandButton(article.summary) && (
                                                        <Button
                                                            size="small"
                                                            onClick={(e) => toggleSummaryExpansion(articleKey, e)}
                                                            endIcon={isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                                            sx={{
                                                                color: '#d32f2f',
                                                                fontWeight: 600,
                                                                fontSize: '0.8rem',
                                                                textTransform: 'none',
                                                                mb: 1,
                                                                p: 0.5,
                                                                minHeight: 'auto',
                                                                '&:hover': {
                                                                    bgcolor: 'rgba(211, 47, 47, 0.08)',
                                                                }
                                                            }}
                                                        >
                                                            {isExpanded ? 'Show Less' : 'Read More'}
                                                        </Button>
                                                    )}
                                                </Box>

                                                <Box sx={{ mt: 'auto' }}>
                                                    <Divider sx={{ my: 1, borderColor: theme.palette.primary[200] }} />

                                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                                        {article.classifications?.slice(0, 10).map((cls, idx) => (
                                                            <Chip
                                                                key={idx}
                                                                label={cls}
                                                                size="small"
                                                                sx={{
                                                                    bgcolor: 'rgba(211, 47, 47, 0.1)',
                                                                    color: '#d32f2f',
                                                                    fontWeight: theme.custom.tokens.fontWeight.semibold,
                                                                    fontSize: '0.8rem',
                                                                    border: '1px solid rgba(211, 47, 47, 0.3)',
                                                                }}
                                                            />
                                                        ))}
                                                    </Box>
                                                </Box>
                                            </Box>
                                        </Card>
                                    </Grid>
                                );
                            })}
                        </Grid>
                    </Box>
                </Fade>
            )}

            {/* Normal Briefings Section */}
            {normalArticles.length > 0 && (
                <Box>
                    {priorityArticles.length > 0 && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                            <TrendingUpIcon sx={{ color: theme.palette.primary.main, fontSize: 24 }} />
                            <Typography variant="h6" sx={{ color: theme.palette.primary[900], fontWeight: 600, fontSize: '1.1rem' }}>
                                Standard Briefings
                            </Typography>
                        </Box>
                    )}
                    <Grid container spacing={1.5}>
                        {normalArticles.map((article, idx) => {
                            const actualIdx = priorityArticles.length + idx;
                            const articleKey = `${article.docId || article.reqId || article.userId || article.link || article.title || article.last_updated}-${actualIdx}`;
                            const isExpanded = expandedSummaries[articleKey];

                            return (
                                <Grid item xs={12} md={6} key={articleKey}>
                                    <Card
                                        elevation={0}
                                        sx={{
                                            height: '100%',
                                            background: '#fff',
                                            border: `1.5px solid ${theme.palette.primary[300]}`,
                                            borderRadius: 2,
                                            overflow: 'hidden',
                                            transition: 'all 0.2s ease',
                                            position: 'relative',
                                            '&:hover': {
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                                borderColor: theme.palette.primary[400],
                                            },
                                            '&::before': {
                                                content: '""',
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                width: '3px',
                                                height: '100%',
                                                background: theme.palette.primary.main,
                                            }
                                        }}
                                    >
                                        <Box sx={{ p: 2, pl: 2.5, display: 'flex', flexDirection: 'column', minHeight: isExpanded ? 'auto' : '250px' }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                                <Chip
                                                    label={`#${(page - 1) * itemsPerPage + actualIdx + 1}`}
                                                    size="small"
                                                    sx={{
                                                        color: theme.palette.primary[700],
                                                        fontWeight: 600,
                                                        bgcolor: theme.palette.primary[100],
                                                        height: 20,
                                                        fontSize: '0.7rem',
                                                    }}
                                                />
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    <ScheduleIcon sx={{ fontSize: 14, color: theme.palette.primary[600] }} />
                                                    <Typography variant="caption" sx={{ color: theme.palette.primary[600], fontWeight: 500, fontSize: '0.75rem' }}>
                                                        {new Date(article.last_updated).toLocaleDateString('en-US', {
                                                            month: 'short',
                                                            day: 'numeric'
                                                        })}
                                                    </Typography>
                                                </Box>
                                            </Box>

                                            <Box sx={{ flex: 1 }}>
                                                <Typography
                                                    variant="h6"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onArticleClick({
                                                            userId: 1,
                                                            reqId: newsresponse.req_id,
                                                            docId: article.doc_id,
                                                            title: article.title,
                                                            last_updated: article.last_updated,
                                                        });
                                                    }}
                                                    sx={{
                                                        color: theme.palette.primary[900],
                                                        fontWeight: 600,
                                                        fontSize: '1rem',
                                                        mb: 1,
                                                        cursor: 'pointer',
                                                        lineHeight: 1.3,
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: 2,
                                                        WebkitBoxOrient: 'vertical',
                                                        overflow: 'hidden',
                                                        '&:hover': {
                                                            color: theme.palette.primary[600],
                                                        }
                                                    }}
                                                >
                                                    {article.title}
                                                </Typography>

                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        color: theme.palette.primary[800],
                                                        lineHeight: 1.6,
                                                        fontSize: '0.875rem',
                                                        mb: 1,
                                                        whiteSpace: 'pre-wrap',
                                                        wordWrap: 'break-word',
                                                    }}
                                                >
                                                    {getDisplayedSummary(article.summary, articleKey)}
                                                </Typography>

                                                {shouldShowExpandButton(article.summary) && (
                                                    <Button
                                                        size="small"
                                                        onClick={(e) => toggleSummaryExpansion(articleKey, e)}
                                                        endIcon={isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                                        sx={{
                                                            color: theme.palette.primary.main,
                                                            fontWeight: 600,
                                                            fontSize: '0.8rem',
                                                            textTransform: 'none',
                                                            minHeight: 'auto',
                                                            '&:hover': {
                                                                bgcolor: theme.palette.primary[50],
                                                            }
                                                        }}
                                                    >
                                                        {isExpanded ? 'Show Less' : 'Read More'}
                                                    </Button>
                                                )}
                                            </Box>

                                            <Box sx={{ mt: 'auto' }}>
                                                <Divider sx={{ my: 1, borderColor: theme.palette.primary[200] }} />
                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                    {article.classifications?.slice(0, 3).map((cls, idx) => (
                                                        <Chip
                                                            key={idx}
                                                            label={cls}
                                                            size="small"
                                                            sx={{
                                                                bgcolor: theme.palette.primary[100],
                                                                color: theme.palette.primary[800],
                                                                fontWeight: 600,
                                                                fontSize: '0.7rem',
                                                                height: 22,
                                                                border: `1px solid ${theme.palette.primary[300]}`,
                                                            }}
                                                        />
                                                    ))}
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Card>
                                </Grid>
                            );
                        })}
                    </Grid>
                </Box>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 2,
                        mt: 3,
                        p: 2,
                        borderRadius: 2,
                        background: theme.palette.primary[50],
                    }}
                >
                    <Pagination
                        count={totalPages}
                        page={page}
                        onChange={handlePageChange}
                        size="large"
                        shape="rounded"
                        sx={{
                            '& .MuiPaginationItem-root': {
                                color: '#64748b',
                                borderColor: withOpacity(theme.palette.brand.cyan, 0.3),
                                fontWeight: theme.custom.tokens.fontWeight.semibold,
                                fontSize: '1rem',
                                minWidth: '40px',
                                height: '40px',
                                '&:hover': {
                                    bgcolor: withOpacity(theme.palette.brand.cyan, 0.15),
                                    borderColor: theme.palette.brand.cyan,
                                    color: theme.palette.brand.deepPurple,
                                },
                                '&.Mui-selected': {
                                    background: 'linear-gradient(135deg, theme.palette.brand.deepPurple 0%, theme.palette.brand.cyan 100%)',
                                    color: 'white',
                                    fontWeight: theme.custom.tokens.fontWeight.bold,
                                    border: 'none',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #1a1350 0%, #5ab5e0 100%)',
                                    },
                                },
                            },
                        }}
                    />

                    {/* Load More Button */}
                    {page === totalPages && hasMoreData && (
                        <Button
                            variant="contained"
                            onClick={loadMoreNews}
                            disabled={loadingMore}
                            sx={{
                                background: 'linear-gradient(135deg, theme.palette.brand.deepPurple 0%, theme.palette.brand.cyan 100%)',
                                color: 'white',
                                fontWeight: theme.custom.tokens.fontWeight.bold,
                                fontSize: '1rem',
                                py: 1.5,
                                px: 5,
                                borderRadius: theme.custom.tokens.borderRadius.sm,
                                textTransform: 'none',
                                boxShadow: '0 4px 20px withOpacity(theme.palette.brand.cyan, 0.4)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #1a1350 0%, #5ab5e0 100%)',
                                    boxShadow: '0 6px 25px withOpacity(theme.palette.brand.cyan, 0.5)',
                                },
                                '&:disabled': {
                                    background: 'linear-gradient(135deg, #94a3b8 0%, #cbd5e1 100%)',
                                }
                            }}
                        >
                            {loadingMore ? (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                    <LinearProgress
                                        sx={{
                                            width: 120,
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
                                `Load More Briefings`
                            )}
                        </Button>
                    )}

                    {!hasMoreData && page === totalPages && (
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
                                ✓ All briefings loaded
                            </Typography>
                        </Box>
                    )}
                </Box>
            )}

            {articles.length === 0 && !loading && (
                <Box sx={{
                    textAlign: 'center',
                    py: 8,
                    background: 'linear-gradient(135deg, theme.palette.grey[50] 0%, theme.palette.brand.lightBlue 100%)',
                    borderRadius: 3,
                }}>
                    <SecurityIcon sx={{ fontSize: 80, color: '#cbd5e1', mb: 2 }} />
                    <Typography variant="h5" sx={{ color: '#64748b', fontWeight: theme.custom.tokens.fontWeight.semibold, mb: 1 }}>
                        No Intelligence Briefings Available
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#94a3b8' }}>
                        Check back later for new strategic updates and analysis
                    </Typography>
                </Box>
            )}
        </Box>
    );
}

export default IntelligenceBriefings;
