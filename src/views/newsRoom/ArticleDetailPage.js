import { useState, useEffect, useRef, useCallback } from 'react';
import { withOpacity } from '../../theme/palette';
import {
  Box, Typography, CircularProgress, IconButton, Card, Divider, useTheme, Modal, Tabs, Tab
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import InfoIcon from '@mui/icons-material/Info';
import PreviewIcon from '@mui/icons-material/Preview';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import AudiotrackIcon from '@mui/icons-material/Audiotrack';
import DescriptionIcon from '@mui/icons-material/Description';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import DownloadIcon from '@mui/icons-material/Download';
import CloseIcon from '@mui/icons-material/Close';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import MapIcon from '@mui/icons-material/Map';
import BarChartIcon from '@mui/icons-material/BarChart';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AttachmentIcon from '@mui/icons-material/Attachment';
import * as XLSX from 'xlsx';
import mammoth from 'mammoth';
import WikipediaTooltip, { WikipediaPopperTooltip } from './WikipediaTooltip';
import { dataService } from '../../services/dataService';
import urlsMap from '../../services/urlsMap';
import PageContainer from 'src/components/container/PageContainer';
import 'src/assets/css/ArticleDetailPage.css';

// Fetch news details using unified dataService
const fetchNewsDetails = async (userId, reqId, docId) => {
  try {
    return await dataService.news.getDetails(userId, reqId, docId);
  } catch (error) {
    console.error("API Fetch Error:", error);
    return null;
  }
};

// Function to extract <data> tag image URLs and replace them with <img> tags
const renderImagesInContent = (htmlString) => {
  if (!htmlString) return '';
  // Use assets service URL from urlsMap config
  const assetsBaseUrl = urlsMap.assetsService || '';
  if (assetsBaseUrl) {
    htmlString = htmlString.replaceAll("/Intara_Image_Asset_new", assetsBaseUrl);
  }

  return htmlString.replace(
    /<data\s+value="([^"]+)"[^>]*data-caption="([^"]+)"[^>]*>/g,
    (_, imgUrl, caption) => `
      <figure style="display: flex; flex-direction: column; align-items: center; margin: 16px 0;">
        <img src="${imgUrl}"  width="60%" height="50%"/>
        <figcaption style="font-size: 14px; color: #666; margin-top: 8px; text-align: center;">
          ${caption}
        </figcaption>
      </figure>
    `
  );
};
// Check if entity type supports hover preview
const hasEntityHoverPreview = (entityType) => {
  const type = entityType?.toLowerCase() || '';
  return type.includes('equipmentvariant') ||
    type.includes('equipmentfamily') ||
    type.includes('shipvariant') ||
    type.includes('shipfamily') ||
    type.includes('shipinstance') ||
    type.includes('militarygroup') ||
    type.includes('organization') ||
    type.includes('event') ||
    type.includes('attack') ||
    type.includes('action') ||
    type.includes('installation');
};

// Escape HTML attribute values to prevent breaking HTML structure
const escapeHtmlAttr = (str) => {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
};

// Shared color palette for entity tooltips - used by both sidebar and content highlights
const entityColorPalette = [
  { primary: '#6366f1', light: '#eef2ff', dark: '#4338ca', text: '#312e81' }, // Indigo
  { primary: '#06b6d4', light: '#ecfeff', dark: '#0891b2', text: '#164e63' }, // Cyan
  { primary: '#3b82f6', light: '#eff6ff', dark: '#2563eb', text: '#1e3a8a' }, // Blue
];

// Function to highlight content based on the provided highlights with different colors
const renderHighlightedContent = (htmlString, highlights = [], entities = []) => {
  let content = renderImagesInContent(htmlString);

  // Define the same colors as the entities
  const highlightColors = [
    'highlight-primary',    // #5aadd3ff
    'highlight-secondary',  // theme.palette.brand.deepPurple
    'highlight-tertiary',   // #66a5a1ff
    'highlight-quaternary', // #5d957bff
    'highlight-quinary',    // #F38BA8
    'highlight-senary',     // #A8DADC
  ];

  // Group highlights by entity type if entities are provided
  if (entities && entities.length > 0) {
    // Collect all terms with their metadata, then sort by length (longest first)
    const allTerms = [];
    entities.forEach((entity, entityIndex) => {
      const entries = Object.entries(entity);
      if (!entries.length) return;
      const [key, values] = entries[0];
      const valueArray = Array.isArray(values) ? values : (values ? [values] : []);
      valueArray.forEach((term) => {
        if (typeof term === 'string' && term.trim()) {
          allTerms.push({ term, key, entityIndex });
        }
      });
    });

    // Sort by term length (longest first) to prevent partial matches
    allTerms.sort((a, b) => b.term.length - a.term.length);
    // Use placeholder approach to prevent replacing inside already-replaced content
    const placeholders = [];

    allTerms.forEach(({ term, key, entityIndex }, idx) => {
      const colorClass = highlightColors[entityIndex % highlightColors.length];
      const supportsPreview = hasEntityHoverPreview(key);
      const escapedKey = escapeHtmlAttr(key);
      const escapedTerm = escapeHtmlAttr(term);

      // Create unique placeholder
      const placeholder = `__ENTITY_PLACEHOLDER_${idx}__`;

      // Build the span HTML - include data-color-index for matching tooltip colors
      const spanHtml = supportsPreview
        ? `<span class="${colorClass} entity-with-preview" data-entity-type="${escapedKey}" data-entity-name="${escapedTerm}" data-color-index="${entityIndex}" data-has-preview="true" title="Entity: ${escapedKey}">__MATCH__</span>`
        : `<span class="${colorClass}" title="Entity: ${escapedKey}">__MATCH__</span>`;

      placeholders.push({ placeholder, spanHtml });

      // Only replace in text content (not inside HTML tags)
      // Match the entity term even when followed by extra characters (e.g., "F-16B" matches "F-16Bs", "Russia" matches "Russian")
      // Escape special regex characters (but NOT hyphen - it's literal outside character class)
      const escapedTermForRegex = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

      // Pattern: match entity term + optional additional characters (word chars, apostrophe-s)
      // This will match: "F-16B", "F-16Bs", "Russia", "Russian", "Russia's", etc.
      const regex = new RegExp(`(${escapedTermForRegex}(?:'s|'s)?\\w*)`, 'gi');

      // Split content by HTML tags and only replace in text parts
      const parts = content.split(/(<[^>]*>)/g);
      content = parts.map((part) => {
        // Skip HTML tags
        if (part.startsWith('<')) return part;
        // Skip if already contains a placeholder
        if (part.includes('__ENTITY_PLACEHOLDER_')) return part;
        // Replace term with placeholder markers
        return part.replace(regex, (match) => `${placeholder}START${match}${placeholder}END`);
      }).join('');
    });

    // Now replace all placeholders with actual spans
    placeholders.forEach(({ placeholder, spanHtml }) => {
      const placeholderRegex = new RegExp(`${placeholder}START(.+?)${placeholder}END`, 'g');
      content = content.replace(placeholderRegex, (_, match) => spanHtml.replace('__MATCH__', match));
    });

  } else if (highlights && highlights.length > 0) {
    // Fallback: highlight terms with primary color
    highlights.forEach((term, index) => {
      const colorClass = highlightColors[index % highlightColors.length];
      // Escape special regex characters (but NOT hyphen - it's literal outside character class)
      const escapedTermForRegex = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      // Pattern: match term + optional additional characters (word chars, apostrophe-s)
      const regex = new RegExp(`(${escapedTermForRegex}(?:'s|'s)?\\w*)`, 'gi');
      content = content.replace(regex, (match) => `<span class="${colorClass}">${match}</span>`);
    });
  }

  return content;
};

function ArticleDetailPage({ userId, reqId, docId, title, last_updated }) {
  const theme = useTheme();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRelatedInfo, setShowRelatedInfo] = useState(true);

  // State for media modal
  const [mediaModalOpen, setMediaModalOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [docType, setDocType] = useState(null); // 'pdf' | 'excel' | 'word' | null
  const [docBlobUrl, setDocBlobUrl] = useState(null);
  const [excelData, setExcelData] = useState(null);
  const [activeSheet, setActiveSheet] = useState(0);
  const [docHtml, setDocHtml] = useState(null);
  const [mediaTab, setMediaTab] = useState(0);

  // State for content entity hover preview
  const [contentHoverEntity, setContentHoverEntity] = useState(null);
  const [contentHoverAnchor, setContentHoverAnchor] = useState(null);
  const contentRef = useRef(null);
  const hoverTimeoutRef = useRef(null);

  useEffect(() => {
    const loadArticle = async () => {
      try {
        setLoading(true);
        const articleDetails = await fetchNewsDetails(userId, reqId, docId);
        // Extract article from response (handles both { article: {...} } and direct article object)
        setArticle(articleDetails?.article || articleDetails);
      } catch (error) {
        console.error('Error fetching article:', error);
        setArticle(null);
      } finally {
        setLoading(false);
      }
    };

    loadArticle();
  }, [userId, reqId, docId]);

  // Event delegation for content entity hover preview
  useEffect(() => {
    const contentElement = contentRef.current;
    if (!contentElement) return;

    const handleMouseEnter = (e) => {
      const target = e.target;
      if (target.dataset?.hasPreview === 'true') {
        // Clear any existing timeout
        if (hoverTimeoutRef.current) {
          clearTimeout(hoverTimeoutRef.current);
        }

        // Small delay before showing tooltip
        hoverTimeoutRef.current = setTimeout(() => {
          const entityType = target.dataset.entityType;
          const entityName = target.dataset.entityName;
          const colorIndex = parseInt(target.dataset.colorIndex, 10) || 0;

          if (entityType && entityName) {
            setContentHoverEntity({ entityType, entityName, colorIndex });
            setContentHoverAnchor(target);
          }
        }, 200);
      }
    };

    const handleMouseLeave = (e) => {
      const target = e.target;
      if (target.dataset?.hasPreview === 'true') {
        // Clear timeout if leaving before it fires
        if (hoverTimeoutRef.current) {
          clearTimeout(hoverTimeoutRef.current);
        }

        // Small delay before hiding to allow moving to tooltip
        hoverTimeoutRef.current = setTimeout(() => {
          setContentHoverEntity(null);
          setContentHoverAnchor(null);
        }, 150);
      }
    };

    contentElement.addEventListener('mouseenter', handleMouseEnter, true);
    contentElement.addEventListener('mouseleave', handleMouseLeave, true);

    return () => {
      contentElement.removeEventListener('mouseenter', handleMouseEnter, true);
      contentElement.removeEventListener('mouseleave', handleMouseLeave, true);
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, [article]);

  // Handle tooltip mouse events to keep it open when hovering over tooltip
  const handleTooltipMouseEnter = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
  }, []);

  const handleTooltipMouseLeave = useCallback(() => {
    hoverTimeoutRef.current = setTimeout(() => {
      setContentHoverEntity(null);
      setContentHoverAnchor(null);
    }, 150);
  }, []);

  // Media handling functions
  const getFileIcon = (extension, size = 22) => {
    const ext = extension?.toLowerCase();
    // Video icons
    if (['mp4', 'webm', 'mov', 'avi', 'mkv'].includes(ext)) {
      return <VideoLibraryIcon sx={{ fontSize: '1.5rem' }} />;
    }
    // Audio icons
    if (['mp3', 'wav', 'ogg', 'aac', 'm4a'].includes(ext)) {
      return <AudiotrackIcon sx={{ fontSize: '1.5rem' }} />;
    }
    // Professional document icons
    if (ext === 'pdf') return (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 2h14l8 8v20a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" fill="#E53935"/>
        <path d="M20 2l8 8h-6a2 2 0 0 1-2-2V2z" fill="#FFCDD2"/>
        <text x="16" y="24" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="700" fontFamily="Arial,sans-serif">PDF</text>
      </svg>
    );
    if (ext === 'xlsx' || ext === 'xls') return (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 2h14l8 8v20a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" fill="#1B5E20"/>
        <path d="M20 2l8 8h-6a2 2 0 0 1-2-2V2z" fill="#A5D6A7"/>
        <text x="16" y="24" textAnchor="middle" fill="#fff" fontSize="7" fontWeight="700" fontFamily="Arial,sans-serif">XLS</text>
      </svg>
    );
    if (ext === 'docx' || ext === 'doc') return (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 2h14l8 8v20a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" fill="#1565C0"/>
        <path d="M20 2l8 8h-6a2 2 0 0 1-2-2V2z" fill="#90CAF9"/>
        <text x="16" y="24" textAnchor="middle" fill="#fff" fontSize="7" fontWeight="700" fontFamily="Arial,sans-serif">DOC</text>
      </svg>
    );
    if (ext === 'twbx') return <BarChartIcon sx={{ fontSize: '1.5rem' }} />;
    if (ext === 'kmz') return <MapIcon sx={{ fontSize: '1.5rem' }} />;
    return <InsertDriveFileIcon sx={{ fontSize: '1.5rem' }} />;
  };

  const getMediaTypeColor = (type) => {
    switch (type) {
      case 'video': return { primary: '#3b82f6', light: '#eff6ff', dark: '#1d4ed8' }; // Blue
      case 'audio': return { primary: '#06b6d4', light: '#ecfeff', dark: '#0891b2' }; // Cyan
      case 'document': return { primary: '#6366f1', light: '#eef2ff', dark: '#4f46e5' }; // Indigo
      default: return { primary: '#6b7280', light: '#f3f4f6', dark: '#4b5563' };
    }
  };

  // MIME type lookup for video/audio extensions
  const getMimeType = (type, ext) => {
    const mimeMap = {
      video: { mp4: 'video/mp4', webm: 'video/webm', ogg: 'video/ogg', mov: 'video/quicktime', avi: 'video/x-msvideo', mkv: 'video/x-matroska', m4v: 'video/mp4', '3gp': 'video/3gpp' },
      audio: { mp3: 'audio/mpeg', wav: 'audio/wav', ogg: 'audio/ogg', aac: 'audio/aac', m4a: 'audio/mp4', flac: 'audio/flac', weba: 'audio/webm', opus: 'audio/opus' },
    };
    return mimeMap[type]?.[ext] || '';
  };

  // Build full URL for assets (images, videos, audio, documents)
  // Uses assetsService from urlsMap when configured (LAN), otherwise Vite base URL (local dev)
  const getAssetUrl = (url) => {
    if (!url) return '';
    const assetsBaseUrl = urlsMap.assetsService || '';
    // Replace legacy asset path prefix with configured assets service URL
    if (assetsBaseUrl && url.includes('/Intara_Image_Asset_new')) {
      return url.replace('/Intara_Image_Asset_new', assetsBaseUrl);
    }
    // For absolute URLs on LAN: replace the origin with the local assets server
    if (url.startsWith('http://') || url.startsWith('https://')) {
      if (assetsBaseUrl) {
        try {
          const parsed = new URL(url);
          const localOrigin = new URL(assetsBaseUrl);
          // If the URL points to a different server than our assets server, rewrite it
          if (parsed.origin !== localOrigin.origin && parsed.origin !== window.location.origin) {
            return `${assetsBaseUrl}${parsed.pathname}${parsed.search}${parsed.hash}`;
          }
        } catch { /* invalid URL, fall through */ }
      }
      return url;
    }
    // Relative URL: use assets service if configured, otherwise Vite base URL
    if (assetsBaseUrl) {
      return `${assetsBaseUrl}${url.startsWith('/') ? url : '/' + url}`;
    }
    const baseUrl = import.meta.env.BASE_URL || '/';
    return `${baseUrl}${url.startsWith('/') ? url.slice(1) : url}`;
  };

  // Extract file extension from URL path: "http://x.com/path/file.xlsx?q=1" → "xlsx"
  const getExtFromUrl = (url) => {
    try {
      const pathname = new URL(url, window.location.origin).pathname;
      const lastDot = pathname.lastIndexOf('.');
      return lastDot > -1 ? pathname.substring(lastDot + 1).toLowerCase() : '';
    } catch {
      return '';
    }
  };

  // Fetch that routes cross-origin requests through /cors-proxy (Vite plugin) to avoid CORS
  const fetchWithProxy = (url) => {
    if (url.startsWith('http') && !url.startsWith(window.location.origin)) {
      const base = import.meta.env.BASE_URL || '/';
      return fetch(`${base}cors-proxy?url=${encodeURIComponent(url)}`);
    }
    return fetch(url);
  };

  // Extensions that can be previewed in the modal
  const VIEWABLE_EXTENSIONS = ['pdf', 'xlsx', 'xls', 'docx', 'doc'];

  const isViewableDoc = (ext) => VIEWABLE_EXTENSIONS.includes(ext?.toLowerCase());

  const handleMediaClick = async (media, type) => {
    const resolvedUrl = getAssetUrl(media.url);
    const ext = (media.extension || getExtFromUrl(resolvedUrl)).toLowerCase().replace(/^\./, '').trim();

    // Non-viewable document types → download directly, no modal
    if (type === 'document' && !isViewableDoc(ext)) {
      window.open(resolvedUrl, '_blank');
      return;
    }

    // Determine document type once - used by both handler and rendering
    let detectedDocType = null;
    if (ext === 'pdf') detectedDocType = 'pdf';
    else if (['xlsx', 'xls'].includes(ext)) detectedDocType = 'excel';
    else if (['docx', 'doc'].includes(ext)) detectedDocType = 'word';

    setSelectedMedia({ ...media, type, resolvedUrl, extension: ext });
    setDocType(detectedDocType);

    // For PDF, set URL directly
    if (detectedDocType === 'pdf') {
      setDocBlobUrl(resolvedUrl);
    }

    // Open modal immediately (shows loading spinner for excel/word)
    setMediaModalOpen(true);

    // Fetch excel/word data asynchronously after modal is open
    if (detectedDocType === 'excel') {
      try {
        const response = await fetchWithProxy(resolvedUrl);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = new Uint8Array(await response.arrayBuffer());
        const workbook = XLSX.read(data, { type: 'array' });
        const sheets = {};
        workbook.SheetNames.forEach((name) => {
          sheets[name] = XLSX.utils.sheet_to_json(workbook.Sheets[name], { header: 1 });
        });
        setExcelData({ sheetNames: workbook.SheetNames, sheets });
        setActiveSheet(0);
      } catch (err) {
        console.error('Excel load error:', err);
        setExcelData('error');
      }
    } else if (detectedDocType === 'word') {
      try {
        const response = await fetchWithProxy(resolvedUrl);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const result = await mammoth.convertToHtml({ arrayBuffer: await response.arrayBuffer() });
        setDocHtml(result.value);
      } catch (err) {
        console.error('Document load error:', err);
        setDocHtml('error');
      }
    }
  };

  const handleCloseModal = () => {
    setMediaModalOpen(false);
    setSelectedMedia(null);
    setDocType(null);
    setDocBlobUrl(null);
    setExcelData(null);
    setActiveSheet(0);
    setDocHtml(null);
  };

  // Block Ctrl+S, Ctrl+P, Ctrl+Shift+S when document modal is open
  useEffect(() => {
    if (!mediaModalOpen || selectedMedia?.type !== 'document') return;
    const blockKeys = (e) => {
      if ((e.ctrlKey || e.metaKey) && ['s', 'p', 'S', 'P'].includes(e.key)) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    window.addEventListener('keydown', blockKeys, true);
    return () => window.removeEventListener('keydown', blockKeys, true);
  }, [mediaModalOpen, selectedMedia?.type]);

  // Check if assets exist
  const hasAssets = article?.assets && (
    (article.assets.videos && article.assets.videos.length > 0) ||
    (article.assets.audios && article.assets.audios.length > 0) ||
    (article.assets.documents && article.assets.documents.length > 0)
  );

  if (loading) {
    return (
      <PageContainer title="Loading Article" description="Loading article details">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 'calc(100vh - 64px)',
            background: `linear-gradient(135deg, ${theme.palette.brand.lightBlue} 0%, ${theme.palette.grey[50]} 100%)`,
          }}
        >
          <CircularProgress
            size={50}
            sx={{
              color: theme.palette.brand.cyan,
            }}
          />
        </Box>
      </PageContainer>
    );
  }

  if (!article) {
    return (
      <PageContainer title="Article Details" description="The requested article could not be found">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 'calc(100vh - 64px)',
            background: `linear-gradient(135deg, ${theme.palette.brand.lightBlue} 0%, ${theme.palette.grey[50]} 100%)`,
          }}
        >
          <Card
            sx={{
              p: 4,
              textAlign: 'center',
              background: `linear-gradient(135deg, ${theme.palette.common.white} 0%, ${theme.palette.brand.lightBlue} 100%)`,
              border: `1px solid ${withOpacity(theme.palette.brand.cyan, 0.1)}`,
              borderRadius: theme.custom.tokens.borderRadius.card,
              boxShadow: `0 4px 20px ${withOpacity(theme.palette.brand.cyan, 0.1)}`,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: withOpacity(theme.palette.brand.deepPurple, 0.7),
                fontWeight: theme.custom.tokens.fontWeight.semibold,
              }}
            >
              Article not found.
            </Typography>
          </Card>
        </Box>
      </PageContainer>
    );
  }

  // Combine both image processing and highlighting
  const highlightedContent = renderHighlightedContent(
    article?.content || '',
    article?.highlights || [],
    article?.entities || []
  );

  return (
    <PageContainer title={title + last_updated || "Article Details"} description="Read full article with related information">
      <Box
        sx={{
          minHeight: 'calc(100vh - 64px)',
          background: `linear-gradient(135deg, ${theme.palette.brand.lightBlue} 0%, ${theme.palette.grey[50]} 100%)`,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            gap: 1.5,
            height: 'calc(100vh - 80px)',
            alignItems: 'stretch',
          }}
        >
          {/* Main Content */}
          <Card
            sx={{
              flex: 1,
              background: `linear-gradient(135deg, ${theme.palette.common.white} 0%, ${theme.palette.brand.lightBlue} 100%)`,
              border: `1px solid ${withOpacity(theme.palette.brand.cyan, 0.1)}`,
              borderRadius: theme.custom.tokens.borderRadius.card,
              boxShadow: `0 4px 20px ${withOpacity(theme.palette.brand.cyan, 0.1)}`,
              overflow: 'auto',
              minWidth: 0,
            }}
          >

            <Box sx={{ p: 3 }}>
              {/* Article Title and Date */}
              {title && (
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2 }}>
                    <Typography
                      variant="h5"
                      sx={{
                        color: '#1e293b',
                        fontWeight: 700,
                        fontSize: '1.4rem',
                        lineHeight: 1.4,
                        flex: 1,
                        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                      }}
                    >
                      {title}
                    </Typography>
                    <Typography
                      sx={{
                        fontWeight: 600,
                        fontSize: '0.8rem',
                        color: '#475569',
                        backgroundColor: '#f1f5f9',
                        px: 1.5,
                        py: 0.5,
                        borderRadius: '6px',
                        border: '1px solid #e2e8f0',
                        whiteSpace: 'nowrap',
                        flexShrink: 0,
                      }}
                    >
                      {new Date(last_updated).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </Typography>
                  </Box>
                </Box>
              )}
              {/* Article Content */}
              <Box
                ref={contentRef}
                sx={{
                  lineHeight: 1.6,
                  fontSize: '16px',
                  color: '#1a202c',
                  fontFamily: "'Inter', 'Roboto', 'Segoe UI'",
                  '& h1, & h2, & h3, & h4, & h5, & h6': {
                    color: theme.palette.brand.deepPurple,
                    fontWeight: theme.custom.tokens.fontWeight.semibold,
                    mb: 1.5,
                    mt: 2,
                    '&:first-of-type': {
                      mt: 0,
                    },
                  },
                  '& h1': { fontSize: '1.6rem' },
                  '& h2': { fontSize: '1.4rem' },
                  '& h3': { fontSize: '1.2rem' },
                  '& h4': { fontSize: '1.1rem' },
                  '& p': {
                    mb: 1.5,
                    color: '#2d3748',
                    fontWeight: 400,
                  },
                  '& strong': {
                    color: theme.palette.brand.deepPurple,
                    fontWeight: theme.custom.tokens.fontWeight.semibold,
                  },
                  '& em': {
                    color: '#4a5568',
                    fontStyle: 'italic',
                  },
                  '& img': {
                    borderRadius: theme.custom.tokens.borderRadius.sm,
                    boxShadow: `0 4px 12px ${withOpacity(theme.palette.brand.cyan, 0.15)}`,
                    border: `1px solid ${withOpacity(theme.palette.brand.cyan, 0.1)}`,
                    maxWidth: '100%',
                    height: '50%',
                  },
                  '& .highlight-primary, & .highlight': {
                    backgroundColor: withOpacity(theme.palette.brand.cyan, 0.2),
                    color: theme.palette.brand.deepPurple,
                    fontWeight: theme.custom.tokens.fontWeight.semibold,
                    padding: '2px 6px',
                    borderRadius: '4px',
                    border: `1px solid ${theme.palette.brand.cyan}`,
                    boxShadow: `0 1px 3px ${withOpacity(theme.palette.brand.cyan, 0.2)}`,
                    transition: 'all 0.2s ease',
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: withOpacity(theme.palette.brand.cyan, 0.3),
                      boxShadow: `0 2px 6px ${withOpacity(theme.palette.brand.cyan, 0.3)}`,
                      transform: 'translateY(-1px)',
                    },
                  },
                  '& .highlight-secondary': {
                    backgroundColor: withOpacity(theme.palette.brand.deepPurple, 0.15),
                    color: theme.palette.brand.deepPurple,
                    fontWeight: theme.custom.tokens.fontWeight.semibold,
                    padding: '2px 6px',
                    borderRadius: '4px',
                    border: `1px solid ${theme.palette.brand.deepPurple}`,
                    boxShadow: `0 1px 3px ${withOpacity(theme.palette.brand.deepPurple, 0.2)}`,
                    transition: 'all 0.2s ease',
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: withOpacity(theme.palette.brand.deepPurple, 0.25),
                      boxShadow: `0 2px 6px ${withOpacity(theme.palette.brand.deepPurple, 0.3)}`,
                      transform: 'translateY(-1px)',
                    },
                  },
                  '& .highlight-tertiary': {
                    backgroundColor: 'rgba(78, 205, 196, 0.2)',
                    color: '#2c7a7b',
                    fontWeight: theme.custom.tokens.fontWeight.semibold,
                    padding: '2px 6px',
                    borderRadius: '4px',
                    border: '1px solid #4ECDC4',
                    boxShadow: '0 1px 3px rgba(78, 205, 196, 0.2)',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: 'rgba(78, 205, 196, 0.3)',
                      boxShadow: '0 2px 6px rgba(78, 205, 196, 0.3)',
                      transform: 'translateY(-1px)',
                    },
                  },
                  '& .highlight-quaternary': {
                    backgroundColor: 'rgba(150, 206, 180, 0.2)',
                    color: '#276749',
                    fontWeight: theme.custom.tokens.fontWeight.semibold,
                    padding: '2px 6px',
                    borderRadius: '4px',
                    border: '1px solid #96CEB4',
                    boxShadow: '0 1px 3px rgba(150, 206, 180, 0.2)',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: 'rgba(150, 206, 180, 0.3)',
                      boxShadow: '0 2px 6px rgba(150, 206, 180, 0.3)',
                      transform: 'translateY(-1px)',
                    },
                  },
                  '& .highlight-quinary': {
                    backgroundColor: 'rgba(243, 139, 168, 0.2)',
                    color: '#97266d',
                    fontWeight: theme.custom.tokens.fontWeight.semibold,
                    padding: '2px 6px',
                    borderRadius: '4px',
                    border: '1px solid #F38BA8',
                    boxShadow: '0 1px 3px rgba(243, 139, 168, 0.2)',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: 'rgba(243, 139, 168, 0.3)',
                      boxShadow: '0 2px 6px rgba(243, 139, 168, 0.3)',
                      transform: 'translateY(-1px)',
                    },
                  },
                  '& .highlight-senary': {
                    backgroundColor: 'rgba(168, 218, 220, 0.2)',
                    color: '#2d3748',
                    fontWeight: theme.custom.tokens.fontWeight.semibold,
                    padding: '2px 6px',
                    borderRadius: '4px',
                    border: '1px solid #A8DADC',
                    boxShadow: '0 1px 3px rgba(168, 218, 220, 0.2)',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: 'rgba(168, 218, 220, 0.3)',
                      boxShadow: '0 2px 6px rgba(168, 218, 220, 0.3)',
                      transform: 'translateY(-1px)',
                    },
                  },
                  '& .entity-with-preview': {
                    cursor: 'pointer',
                  },
                  '& blockquote': {
                    borderLeft: `3px solid ${theme.palette.brand.cyan}`,
                    backgroundColor: withOpacity(theme.palette.brand.cyan, 0.03),
                    margin: '12px 0',
                    padding: '12px 16px',
                    borderRadius: '6px',
                    fontStyle: 'italic',
                    color: '#4a5568',
                  },
                  '& ul, & ol': {
                    color: '#2d3748',
                    pl: 2,
                    mb: 1.5,
                  },
                  '& li': {
                    mb: 0.5,
                  },
                }}
                dangerouslySetInnerHTML={{ __html: highlightedContent }}
              />

              {/* Related Media Files Section */}
              <Box sx={{ mt: 4 }}>
                <Divider sx={{ mb: 3 }} />

                {/* Section Header */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '12px',
                      background: hasAssets
                        ? 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)'
                        : 'linear-gradient(135deg, #94a3b8 0%, #cbd5e1 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: hasAssets
                        ? '0 4px 12px rgba(79, 70, 229, 0.25)'
                        : '0 4px 12px rgba(148, 163, 184, 0.25)',
                    }}
                  >
                    <AttachmentIcon sx={{ color: '#fff', fontSize: '1.3rem' }} />
                  </Box>
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        fontSize: '1.1rem',
                        color: hasAssets ? '#1e293b' : '#64748b',
                        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                      }}
                    >
                      Related Media Files
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: '0.75rem',
                        color: '#64748b',
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      {hasAssets
                        ? 'Videos, audio files, and documents related to this article'
                        : 'No media files available for this article'}
                    </Typography>
                  </Box>
                </Box>

                {/* No Media Files Message */}
                {!hasAssets && (
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      py: 5,
                      px: 3,
                      backgroundColor: '#f8fafc',
                      borderRadius: '12px',
                      border: '2px dashed #e2e8f0',
                    }}
                  >
                    <Box
                      sx={{
                        width: 64,
                        height: 64,
                        borderRadius: '50%',
                        backgroundColor: '#f1f5f9',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 2,
                      }}
                    >
                      <AttachmentIcon sx={{ color: '#94a3b8', fontSize: '2rem' }} />
                    </Box>
                    <Typography
                      sx={{
                        fontWeight: 600,
                        fontSize: '1rem',
                        color: '#475569',
                        mb: 0.5,
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      No Media Files Available
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: '0.85rem',
                        color: '#94a3b8',
                        textAlign: 'center',
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      There are no videos, audio files, or documents attached to this article.
                    </Typography>
                  </Box>
                )}

                {/* Media Content with Tabs */}
                {hasAssets && (
                  <>
                    <Tabs
                      value={mediaTab}
                      onChange={(_, v) => setMediaTab(v)}
                      sx={{
                        minHeight: 36,
                        mb: 1.5,
                        '& .MuiTab-root': { minHeight: 36, textTransform: 'none', fontWeight: 600, fontSize: '0.8rem', py: 0.5, fontFamily: "'Inter', sans-serif" },
                        '& .Mui-selected': { color: '#4f46e5' },
                        '& .MuiTabs-indicator': { backgroundColor: '#4f46e5', height: 2.5, borderRadius: '2px 2px 0 0' },
                      }}
                    >
                      <Tab icon={<VideoLibraryIcon sx={{ fontSize: '0.95rem' }} />} iconPosition="start" label={`Videos (${article.assets.videos?.length || 0})`} disabled={!article.assets.videos?.length} />
                      <Tab icon={<AudiotrackIcon sx={{ fontSize: '0.95rem' }} />} iconPosition="start" label={`Audio (${article.assets.audios?.length || 0})`} disabled={!article.assets.audios?.length} />
                      <Tab icon={<DescriptionIcon sx={{ fontSize: '0.95rem' }} />} iconPosition="start" label={`Docs (${article.assets.documents?.length || 0})`} disabled={!article.assets.documents?.length} />
                    </Tabs>

                    {/* Videos Tab */}
                    {mediaTab === 0 && article.assets.videos?.length > 0 && (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, pb: 1 }}>
                        {article.assets.videos.map((item) => {
                          const colors = getMediaTypeColor('video');
                          return (
                            <Box key={item.id} onClick={() => handleMediaClick(item, 'video')}
                              sx={{ display: 'flex', alignItems: 'center', gap: 1.2, p: 1, flex: '1 1 calc(25% - 6px)', minWidth: 'calc(25% - 6px)', maxWidth: 'calc(33.33% - 6px)', cursor: 'pointer', borderRadius: '10px', border: `1px solid ${withOpacity(colors.primary, 0.25)}`, backgroundColor: '#fff', transition: 'all 0.2s ease', '&:hover': { backgroundColor: colors.light, boxShadow: `0 4px 14px ${withOpacity(colors.primary, 0.15)}`, transform: 'translateY(-1px)' } }}
                            >
                              <Box sx={{ width: 34, height: 34, borderRadius: '8px', background: `linear-gradient(135deg, ${colors.primary}, ${colors.dark})`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <VideoLibraryIcon sx={{ color: '#fff', fontSize: '1rem' }} />
                              </Box>
                              <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Typography sx={{ fontWeight: 600, fontSize: '0.75rem', color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</Typography>
                                <Typography sx={{ fontSize: '0.6rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>{item.extension}</Typography>
                              </Box>
                              <PlayArrowIcon sx={{ fontSize: '1rem', color: colors.primary, flexShrink: 0 }} />
                            </Box>
                          );
                        })}
                      </Box>
                    )}

                    {/* Audio Tab */}
                    {mediaTab === 1 && article.assets.audios?.length > 0 && (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, pb: 1 }}>
                        {article.assets.audios.map((item) => {
                          const colors = getMediaTypeColor('audio');
                          return (
                            <Box key={item.id} onClick={() => handleMediaClick(item, 'audio')}
                              sx={{ display: 'flex', alignItems: 'center', gap: 1.2, p: 1, flex: '1 1 calc(25% - 6px)', minWidth: 'calc(25% - 6px)', maxWidth: 'calc(33.33% - 6px)', cursor: 'pointer', borderRadius: '10px', border: `1px solid ${withOpacity(colors.primary, 0.25)}`, backgroundColor: '#fff', transition: 'all 0.2s ease', '&:hover': { backgroundColor: colors.light, boxShadow: `0 4px 14px ${withOpacity(colors.primary, 0.15)}`, transform: 'translateY(-1px)' } }}
                            >
                              <Box sx={{ width: 34, height: 34, borderRadius: '8px', background: `linear-gradient(135deg, ${colors.primary}, ${colors.dark})`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <AudiotrackIcon sx={{ color: '#fff', fontSize: '1rem' }} />
                              </Box>
                              <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Typography sx={{ fontWeight: 600, fontSize: '0.75rem', color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</Typography>
                                <Typography sx={{ fontSize: '0.6rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>{item.extension}</Typography>
                              </Box>
                              <PlayArrowIcon sx={{ fontSize: '1rem', color: colors.primary, flexShrink: 0 }} />
                            </Box>
                          );
                        })}
                      </Box>
                    )}

                    {/* Documents Tab */}
                    {mediaTab === 2 && article.assets.documents?.length > 0 && (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, pb: 1 }}>
                        {article.assets.documents.map((item) => {
                          const colors = getMediaTypeColor('document');
                          const viewable = isViewableDoc(item.extension);
                          return (
                            <Box key={item.id} onClick={() => handleMediaClick(item, 'document')}
                              sx={{ display: 'flex', alignItems: 'center', gap: 1.2, p: 1, width: 'calc(33.33% - 6px)', minWidth: 160, cursor: 'pointer', borderRadius: '10px', border: `1px solid ${withOpacity(colors.primary, 0.25)}`, backgroundColor: '#fff', transition: 'all 0.2s ease', '&:hover': { backgroundColor: colors.light, boxShadow: `0 4px 14px ${withOpacity(colors.primary, 0.15)}`, transform: 'translateY(-1px)' } }}
                            >
                              <Box sx={{ width: 34, height: 34, borderRadius: '8px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                {getFileIcon(item.extension, 24)}
                              </Box>
                              <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Typography sx={{ fontWeight: 600, fontSize: '0.75rem', color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</Typography>
                                <Typography sx={{ fontSize: '0.6rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600, mt: 0.2 }}>{item.extension}</Typography>
                              </Box>
                              {viewable
                                ? <VisibilityIcon sx={{ fontSize: '0.95rem', color: colors.primary, flexShrink: 0 }} />
                                : <DownloadIcon sx={{ fontSize: '0.95rem', color: colors.primary, flexShrink: 0 }} />
                              }
                            </Box>
                          );
                        })}
                      </Box>
                    )}
                  </>
                )}
              </Box>
            </Box>
          </Card>

          {/* Sidebar - Restored Original Design */}
          <Card
            sx={{
              width: showRelatedInfo ? 320 : 50,
              transition: 'all 0.3s ease',
              background: `linear-gradient(135deg, ${theme.palette.common.white} 0%, ${theme.palette.brand.lightBlue} 100%)`,
              color: theme.palette.brand.deepPurple,
              borderRadius: theme.custom.tokens.borderRadius.sm,
              boxShadow: `0 4px 16px ${withOpacity(theme.palette.brand.cyan, 0.15)}`,
              border: `1px solid ${withOpacity(theme.palette.brand.cyan, 0.2)}`,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '3px',
                background: `linear-gradient(90deg, ${theme.palette.brand.deepPurple}, ${theme.palette.brand.cyan}, ${theme.palette.brand.deepPurple})`,
                borderRadius: '12px 12px 0 0',
              },
            }}
          >
            {/* Header with Toggle */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: showRelatedInfo ? 'space-between' : 'center',
                px: 1.5,
                py: 1.25,
                background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 50%, #0891b2 100%)',
                flexShrink: 0,
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(79, 70, 229, 0.15)',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 100%)',
                  pointerEvents: 'none',
                },
              }}
            >
              {showRelatedInfo && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.85 }}>
                  <Box
                    sx={{
                      width: 26,
                      height: 26,
                      borderRadius: '16px',
                      background: 'rgba(255,255,255,0.18)',
                      backdropFilter: 'blur(4px)',
                      border: '1px solid rgba(255,255,255,0.22)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
                    }}
                  >
                    <InfoIcon sx={{ fontSize: 14, color: '#ffffff' }} />
                  </Box>
                  <Typography
                    sx={{
                      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                      fontWeight: 600,
                      color: '#ffffff',
                      fontSize: '0.78rem',
                      letterSpacing: '0.01em',
                      textShadow: '0 1px 2px rgba(0,0,0,0.08)',
                    }}
                  >
                    Related Information
                  </Typography>
                </Box>
              )}
              <IconButton
                size="small"
                onClick={() => setShowRelatedInfo(prev => !prev)}
                sx={{
                  width: 28,
                  height: 28,
                  color: '#ffffff',
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  backdropFilter: 'blur(4px)',
                  borderRadius: '6px',
                  border: '1px solid rgba(255,255,255,0.18)',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.25)',
                    transform: 'scale(1.05)',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                {showRelatedInfo ? <ChevronRightIcon sx={{ fontSize: 18 }} /> : <ChevronLeftIcon sx={{ fontSize: 18 }} />}
              </IconButton>
            </Box>

            {/* Content Section */}
            {showRelatedInfo ? (
              <Box
                sx={{
                  px: 1.25,
                  py: 1.25,
                  overflow: 'auto',
                  flex: 1,
                  background: '#f8fafc',
                }}
              >
                {article.entities && article.entities.length > 0 && article.entities.map((entity, index) => {
                  const entries = Object.entries(entity);
                  if (!entries.length) return null;

                  const [key, values] = entries[0];
                  const valueArray = Array.isArray(values) ? values : (values ? [values] : []);

                  const hasHoverPreview = hasEntityHoverPreview(key);

                  // Use shared color palette for consistency between sidebar and content tooltips
                  const c = entityColorPalette[index % entityColorPalette.length];

                  // Render single entity item - each in separate row
                  const renderItem = (item, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        py: 0.75,
                        px: 1,
                        mb: 0.6,
                        borderRadius: '8px',
                        backgroundColor: '#ffffff',
                        border: '1px solid #e5e7eb',
                        borderLeft: `3px solid ${c.primary}`,
                        cursor: hasHoverPreview ? 'pointer' : 'default',
                        transition: 'all 0.2s ease',
                        position: 'relative',
                        '&:hover': {
                          backgroundColor: hasHoverPreview ? `${c.light}` : '#ffffff',
                          borderColor: c.primary,
                          borderLeftWidth: '4px',
                          boxShadow: hasHoverPreview
                            ? `0 4px 15px ${withOpacity(c.primary, 0.2)}, 0 2px 4px rgba(0,0,0,0.05)`
                            : 'none',
                          transform: hasHoverPreview ? 'translateX(3px)' : 'none',
                          '& .preview-badge': {
                            opacity: 1,
                            transform: 'scale(1)',
                          },
                          '& .item-text': {
                            color: c.dark,
                            fontWeight: 600,
                          },
                          '& .hover-hint': {
                            opacity: 1,
                          },
                        },
                        '&:last-child': { mb: 0 },
                      }}
                    >
                      {/* Colored dot indicator */}
                      <Box
                        sx={{
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          backgroundColor: c.primary,
                          flexShrink: 0,
                          opacity: 0.7,
                        }}
                      />

                      {/* Item text */}
                      <Typography
                        className="item-text"
                        sx={{
                          fontSize: '0.78rem',
                          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                          color: '#374151',
                          fontWeight: 500,
                          lineHeight: 1.4,
                          flex: 1,
                          letterSpacing: '-0.01em',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        {item}
                      </Typography>

                      {/* Preview badge - always visible */}
                      {hasHoverPreview && (
                        <Box
                          className="preview-badge"
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.4,
                            px: 0.75,
                            py: 0.3,
                            borderRadius: '12px',
                            backgroundColor: `${c.primary}15`,
                            border: `1px solid ${c.primary}30`,
                            opacity: 0.8,
                            transform: 'scale(1)',
                            transition: 'all 0.2s ease',
                          }}
                        >
                          <PreviewIcon
                            sx={{
                              fontSize: '0.7rem',
                              color: c.primary,
                            }}
                          />
                          <Typography
                            className="hover-hint"
                            sx={{
                              fontSize: '0.55rem',
                              fontWeight: 600,
                              color: c.primary,
                              textTransform: 'uppercase',
                              letterSpacing: '0.03em',
                            }}
                          >
                            Preview
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  );

                  return (
                    <Box
                      key={index}
                      sx={{
                        mb: 1.2,
                        borderRadius: '8px',
                        overflow: 'hidden',
                        backgroundColor: '#ffffff',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                        border: '1px solid #e2e8f0',
                        '&:last-child': { mb: 0 },
                      }}
                    >
                      {/* Header */}
                      <Box
                        sx={{
                          px: 0.8,
                          py: 0.6,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.65,
                          background: `linear-gradient(135deg, ${c.light} 0%, #ffffff 100%)`,
                          borderBottom: '1px solid #e2e8f0',
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: '0.7rem',
                            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                            fontWeight: 600,
                            color: c.text,
                            flex: 1,
                            letterSpacing: '-0.01em',
                          }}
                        >
                          {key}
                        </Typography>

                      </Box>

                      {/* Values - Each item in its own row */}
                      <Box sx={{ p: 0.65, display: 'flex', flexDirection: 'column', backgroundColor: '#fafbfc' }}>
                        {valueArray.map((item, idx) =>
                          hasHoverPreview ? (
                            <WikipediaTooltip
                              key={idx}
                              entityName={item}
                              entityType={key}
                              colors={c}
                            >
                              {renderItem(item, idx)}
                            </WikipediaTooltip>
                          ) : (
                            renderItem(item, idx)
                          )
                        )}
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            ) : (
              <Box
                sx={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  writingMode: 'vertical-rl',
                  transform: 'rotate(180deg)',
                  fontWeight: theme.custom.tokens.fontWeight.bold,
                  letterSpacing: 2,
                  color: theme.palette.brand.deepPurple,
                  userSelect: 'none',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  background: theme.palette.grey[50],
                  '&:hover': {
                    color: theme.palette.brand.cyan,
                    letterSpacing: 3,
                    background: '#f1f5f9',
                  },
                  transition: 'all 0.3s ease',
                }}
                onClick={() => setShowRelatedInfo(true)}
                title="Expand Related Info"
              >
                Related Information
              </Box>
            )}
          </Card>
        </Box>
      </Box>

      {/* Content Entity Hover Tooltip - uses same color palette as sidebar */}
      <WikipediaPopperTooltip
        open={Boolean(contentHoverEntity && contentHoverAnchor)}
        anchorEl={contentHoverAnchor}
        entityName={contentHoverEntity?.entityName || ''}
        entityType={contentHoverEntity?.entityType || ''}
        colors={entityColorPalette[(contentHoverEntity?.colorIndex || 0) % entityColorPalette.length]}
        onClose={() => {
          setContentHoverEntity(null);
          setContentHoverAnchor(null);
        }}
        onMouseEnter={handleTooltipMouseEnter}
        onMouseLeave={handleTooltipMouseLeave}
      />

      {/* Media & Document Viewer Modal */}
      <Modal
        open={mediaModalOpen}
        onClose={handleCloseModal}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          onContextMenu={selectedMedia?.type === 'document' ? (e) => e.preventDefault() : undefined}
          sx={{
            position: 'relative',
            width: selectedMedia?.type === 'document' ? '85%' : selectedMedia?.type === 'video' ? '80%' : '500px',
            maxWidth: selectedMedia?.type === 'document' ? '1100px' : '900px',
            maxHeight: '90vh',
            backgroundColor: '#0f172a',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            outline: 'none',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Modal Header */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 2,
              borderBottom: '1px solid rgba(255,255,255,0.1)',
              background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
              flexShrink: 0,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: '10px',
                  backgroundColor: selectedMedia?.type === 'document' ? '#f1f5f9' : selectedMedia?.type === 'video' ? '#3b82f6' : '#06b6d4',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: selectedMedia?.type === 'document' ? 'inherit' : '#fff',
                }}
              >
                {selectedMedia?.type === 'video' ? (
                  <VideoLibraryIcon sx={{ fontSize: '1.2rem' }} />
                ) : selectedMedia?.type === 'audio' ? (
                  <AudiotrackIcon sx={{ fontSize: '1.2rem' }} />
                ) : (
                  getFileIcon(selectedMedia?.extension, 22)
                )}
              </Box>
              <Box>
                <Typography
                  sx={{
                    color: '#fff',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  {selectedMedia?.title}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {selectedMedia?.duration && (
                    <Typography sx={{ color: '#94a3b8', fontSize: '0.75rem' }}>
                      {selectedMedia.duration}
                    </Typography>
                  )}
                  {selectedMedia?.size && (
                    <Typography sx={{ color: '#94a3b8', fontSize: '0.75rem' }}>
                      {selectedMedia.size}
                    </Typography>
                  )}
                  <Typography
                    sx={{
                      color: '#64748b',
                      fontSize: '0.65rem',
                      textTransform: 'uppercase',
                      fontWeight: 600,
                    }}
                  >
                    {selectedMedia?.extension}
                  </Typography>
                </Box>
              </Box>
            </Box>
            <IconButton
              onClick={handleCloseModal}
              sx={{
                color: '#94a3b8',
                backgroundColor: 'rgba(255,255,255,0.05)',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  color: '#fff',
                },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Media / Document Content */}
          <Box sx={{ flex: 1, overflow: 'hidden', minHeight: 0 }}>
            {selectedMedia?.type === 'video' ? (
              <Box sx={{ p: 2 }}>
                <video
                  controls
                  autoPlay
                  style={{
                    width: '100%',
                    maxHeight: '70vh',
                    borderRadius: '8px',
                    backgroundColor: '#000',
                  }}
                >
                  <source src={selectedMedia.resolvedUrl} {...(getMimeType('video', selectedMedia.extension) ? { type: getMimeType('video', selectedMedia.extension) } : {})} />
                  Your browser does not support the video tag.
                </video>
              </Box>
            ) : selectedMedia?.type === 'audio' ? (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  py: 4,
                  px: 2,
                }}
              >
                <Box
                  sx={{
                    width: 120,
                    height: 120,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 3,
                    boxShadow: '0 0 40px rgba(6, 182, 212, 0.3)',
                  }}
                >
                  <AudiotrackIcon sx={{ color: '#fff', fontSize: '3rem' }} />
                </Box>
                <audio
                  controls
                  autoPlay
                  style={{
                    width: '100%',
                    maxWidth: '450px',
                  }}
                >
                  <source src={selectedMedia.resolvedUrl} {...(getMimeType('audio', selectedMedia.extension) ? { type: getMimeType('audio', selectedMedia.extension) } : {})} />
                  Your browser does not support the audio tag.
                </audio>
              </Box>
            ) : selectedMedia?.type === 'document' ? (
              // Document viewer - uses docType state set in handleMediaClick
              docType === 'pdf' ? (
                <Box sx={{ position: 'relative', width: '100%', height: 'calc(90vh - 120px)' }}>
                  <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: '40px', zIndex: 10, backgroundColor: '#525659', cursor: 'default' }} />
                  <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '28px', zIndex: 10, backgroundColor: '#525659', cursor: 'default' }} />
                  {docBlobUrl ? (
                    <iframe
                      src={`${docBlobUrl}#toolbar=0&navpanes=0&scrollbar=1`}
                      title={selectedMedia.title}
                      style={{ width: '100%', height: '100%', border: 'none', backgroundColor: '#525659' }}
                    />
                  ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', backgroundColor: '#fff' }}>
                      <CircularProgress size={40} />
                    </Box>
                  )}
                </Box>
              ) : docType === 'excel' && !excelData ? (
                // Loading state - fetch is in progress
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 'calc(90vh - 120px)', backgroundColor: '#1e293b' }}>
                  <CircularProgress size={40} sx={{ color: '#6366f1', mb: 2 }} />
                  <Typography sx={{ color: '#94a3b8', fontSize: '0.85rem' }}>Loading spreadsheet...</Typography>
                </Box>
              ) : docType === 'excel' && excelData && excelData !== 'error' ? (
                <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(90vh - 120px)', backgroundColor: '#1e293b' }}>
                  {excelData.sheetNames.length > 1 && (
                    <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '8px 8px 0' }}>
                      {excelData.sheetNames.map((name, idx) => (
                        <div key={name} onClick={() => setActiveSheet(idx)}
                          style={{
                            padding: '8px 16px', cursor: 'pointer', fontSize: '0.8rem',
                            fontWeight: activeSheet === idx ? 600 : 400,
                            color: activeSheet === idx ? '#fff' : '#94a3b8',
                            backgroundColor: activeSheet === idx ? 'rgba(99, 102, 241, 0.3)' : 'transparent',
                            borderRadius: '8px 8px 0 0',
                            borderBottom: activeSheet === idx ? '2px solid #6366f1' : '2px solid transparent',
                          }}
                        >{name}</div>
                      ))}
                    </div>
                  )}
                  <div style={{ flex: 1, overflow: 'auto', padding: 16 }}>
                    {(() => {
                      const sheetName = excelData.sheetNames[activeSheet];
                      const rows = excelData.sheets[sheetName] || [];
                      if (rows.length === 0) return <Typography sx={{ color: '#94a3b8' }}>No data in this sheet.</Typography>;
                      // Find max columns across all rows (handles sparse/jagged arrays)
                      const maxCols = rows.reduce((max, row) => Math.max(max, row.length), 0);
                      const headerRow = rows[0];
                      return (
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                          <thead>
                            <tr>
                              {Array.from({ length: maxCols }, (_, ci) => (
                                <th key={ci} style={{
                                  position: 'sticky', top: 0, backgroundColor: '#334155', color: '#e2e8f0',
                                  fontWeight: 600, padding: '8px 12px', textAlign: 'left', whiteSpace: 'nowrap',
                                  borderBottom: '2px solid #6366f1', zIndex: 1,
                                }}>
                                  {headerRow[ci] != null ? String(headerRow[ci]) : ''}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {rows.slice(1).map((row, ri) => (
                              <tr key={ri}>
                                {Array.from({ length: maxCols }, (_, ci) => (
                                  <td key={ci} style={{
                                    padding: '6px 12px', color: '#cbd5e1',
                                    borderBottom: '1px solid rgba(255,255,255,0.08)', whiteSpace: 'nowrap',
                                  }}>
                                    {row[ci] != null ? String(row[ci]) : ''}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      );
                    })()}
                  </div>
                </div>
              ) : docType === 'word' && !docHtml ? (
                // Loading state - fetch is in progress
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 'calc(90vh - 120px)', backgroundColor: '#fff' }}>
                  <CircularProgress size={40} sx={{ color: '#6366f1', mb: 2 }} />
                  <Typography sx={{ color: '#64748b', fontSize: '0.85rem' }}>Loading document...</Typography>
                </Box>
              ) : docType === 'word' && docHtml && docHtml !== 'error' ? (
                <Box
                  sx={{
                    height: 'calc(90vh - 120px)', overflow: 'auto', backgroundColor: '#fff', px: 5, py: 4,
                    '& img': { maxWidth: '100%', height: 'auto', borderRadius: '4px', my: 1 },
                    '& table': { borderCollapse: 'collapse', width: '100%', my: 2 },
                    '& th, & td': { border: '1px solid #e2e8f0', px: 1.5, py: 1, fontSize: '0.85rem' },
                    '& th': { backgroundColor: '#f1f5f9', fontWeight: 600 },
                    '& p': { fontSize: '0.9rem', lineHeight: 1.7, color: '#334155', mb: 1 },
                    '& h1': { fontSize: '1.5rem', fontWeight: 700, color: '#1e293b', mt: 3, mb: 1 },
                    '& h2': { fontSize: '1.25rem', fontWeight: 600, color: '#334155', mt: 2.5, mb: 1 },
                    '& ul, & ol': { pl: 3, mb: 1 },
                    '& li': { fontSize: '0.9rem', lineHeight: 1.6, color: '#334155', mb: 0.5 },
                    '& a': { color: '#6366f1', textDecoration: 'none' },
                  }}
                  dangerouslySetInnerHTML={{ __html: docHtml }}
                />
              ) : (excelData === 'error' || docHtml === 'error') ? (
                // CORS or parse error - show "Open in New Tab" fallback
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 8, px: 4 }}>
                  <Box sx={{ width: 80, height: 80, borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
                    {getFileIcon(selectedMedia?.extension, 40)}
                  </Box>
                  <Typography sx={{ color: '#fff', fontWeight: 600, fontSize: '1rem', mb: 1 }}>{selectedMedia?.title}</Typography>
                  <Typography sx={{ color: '#94a3b8', fontSize: '0.85rem', textAlign: 'center', mb: 3 }}>
                    Unable to preview this file. Click below to open it directly.
                  </Typography>
                  <IconButton
                    onClick={() => window.open(selectedMedia?.resolvedUrl, '_blank')}
                    sx={{ backgroundColor: 'rgba(99, 102, 241, 0.2)', color: '#a5b4fc', px: 3, py: 1, borderRadius: '8px', '&:hover': { backgroundColor: 'rgba(99, 102, 241, 0.3)' } }}
                  >
                    <OpenInNewIcon sx={{ mr: 1, fontSize: '1.1rem' }} />
                    <Typography sx={{ fontSize: '0.85rem', fontWeight: 600 }}>Open in New Tab</Typography>
                  </IconButton>
                </Box>
              ) : (
                // Fallback - unsupported format
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 8, px: 4 }}>
                  <Box sx={{ width: 80, height: 80, borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
                    {getFileIcon(selectedMedia?.extension, 40)}
                  </Box>
                  <Typography sx={{ color: '#fff', fontWeight: 600, fontSize: '1rem', mb: 1 }}>{selectedMedia?.title}</Typography>
                  <Typography sx={{ color: '#94a3b8', fontSize: '0.85rem', textAlign: 'center' }}>
                    Preview is not available for this file type.
                  </Typography>
                </Box>
              )
            ) : null}
          </Box>

          {/* Modal Footer - hidden for documents to prevent download */}
          {selectedMedia?.type !== 'document' && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: 1,
                p: 2,
                borderTop: '1px solid rgba(255,255,255,0.1)',
                background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                flexShrink: 0,
              }}
            >
              <IconButton
                onClick={() => window.open(selectedMedia?.resolvedUrl, '_blank')}
                sx={{
                  color: '#fff',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.2)',
                  },
                }}
                title="Open in new tab"
              >
                <OpenInNewIcon sx={{ fontSize: '1.1rem' }} />
              </IconButton>
              <IconButton
                component="a"
                href={selectedMedia?.resolvedUrl}
                download
                sx={{
                  color: '#fff',
                  backgroundColor: selectedMedia?.type === 'video' ? '#3b82f6' : '#06b6d4',
                  '&:hover': {
                    backgroundColor: selectedMedia?.type === 'video' ? '#2563eb' : '#0891b2',
                  },
                }}
                title="Download"
              >
                <DownloadIcon sx={{ fontSize: '1.1rem' }} />
              </IconButton>
            </Box>
          )}
        </Box>
      </Modal>
    </PageContainer>
  );
}

export default ArticleDetailPage;
