import { Box } from '@mui/material';
import EnhancedNewsTabs from 'src/views/newsRoom/EnhancedNewsTabs';
import IntelligenceBriefings from 'src/views/newsRoom/IntelligenceBriefings';
import ArticleDetailPage from 'src/views/newsRoom/ArticleDetailPage';
import NewsRoomHeader from 'src/views/newsRoom/NewsRoomHeader';
import { useLocation, useNavigate } from 'react-router-dom';
import PageContainer from 'src/components/container/PageContainer';

function NewsRoomPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { userId, reqId, docId, title, returnToTab, selectedCountry, returnToPage, returnUrl, last_updated } = location.state || {};
    const isViewingArticle = userId && reqId && docId && title && last_updated;

    const handleBackToNews = () => {
        // Use returnUrl if available (contains the proper URL with query params)
        // Otherwise, use browser back or navigate to base NewsRoom
        if (returnUrl) {
            navigate(returnUrl);
        } else {
            // Fallback: use browser back if there's history, otherwise go to NewsRoom
            navigate(-1);
        }
    };

    // Determine page subtitle based on current view
    const getPageInfo = () => {
        if (selectedCountry === "intelligence_briefing") {
            return {
                title: "Intelligence Briefings",
                secondarySubtitle: "Strategic Analysis & Insights",
                subtitle: "Comprehensive intelligence reports and strategic assessments from global sources"
            };
        }
        return {
            title: "News and Analysis",
            secondarySubtitle: null,
            subtitle: "View Details of any article or analysis"
        };
    };

    const pageInfo = getPageInfo();

    // const handleBackToHome = () => {
    //     navigate('/dashboard');
    // };

    return (
        <PageContainer
            title={isViewingArticle ? "Article Details" : "Saaransh"}
            description="View Details of an article or analysis"
        >
            <Box
                sx={{
                    minHeight: 'calc(100vh - 64px)',
                }}
            >
                {/* Dashboard Header */}
                <Box >
                    <NewsRoomHeader
                        title={pageInfo.title}
                        showBackButton={isViewingArticle}
                        onBackClick={handleBackToNews}
                    />
                </Box>

                {/* Content Grid - Dashboard Style - Full width, no side padding */}
                <Box>
                    {isViewingArticle ? (
                        <Box sx={{ px: 2 }}>
                            <ArticleDetailPage
                                userId={userId}
                                reqId={reqId}
                                docId={docId}
                                title={title}
                                last_updated={last_updated}
                            />
                        </Box>
                    ) : selectedCountry === "intelligence_briefing" ? (
                        <IntelligenceBriefings initialTab={returnToPage} />
                    ) : (
                        <EnhancedNewsTabs
                            initialTab={returnToTab}
                            initialCountry={selectedCountry}
                        />
                    )}
                </Box>
            </Box>
        </PageContainer>
    );
}

export default NewsRoomPage;
