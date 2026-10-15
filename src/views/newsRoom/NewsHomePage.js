import { Box } from '@mui/material';
import EnhancedNewsTabs from 'src/views/newsRoom/EnhancedNewsTabs';
import IntelligenceBriefings from 'src/views/newsRoom/IntelligenceBriefings';
import ArticleDetailPage from 'src/views/newsRoom/ArticleDetailPage';
import { useLocation } from 'react-router-dom';
import PageContainer from 'src/components/container/PageContainer';

function NewsRoomPage() {
    const location = useLocation();
    const { userId, reqId, docId, title, returnToTab, selectedCountry, returnToPage, returnPageIdentifier, last_updated } = location.state || {};
    const isViewingArticle = userId && reqId && docId && title && last_updated;

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
                {/* Content Grid - Dashboard Style - Full width, no side padding */}
                <Box>
                    {isViewingArticle ? (
                        <Box sx={{ px: 1 }}>
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
