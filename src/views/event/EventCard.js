/**
 * EventCard - Optimized Dashboard UI
 * Unified layout with category-specific content rendering
 * Single PremiumHeader with EventSearchBox for all views
 */

import * as React from "react";
import { Suspense } from "react";
import { EventContext } from "../../context/EventContext";
import PageContainer from 'src/components/container/PageContainer';
import Box from "@mui/material/Box";
import {
  Typography,
  IconButton,
  Collapse,
  Modal,
  Button,
  useTheme,
} from "@mui/material";
import {
  Event as EventIcon,
  ExpandMore as ExpandMoreIcon,
  Category as CategoryIcon,
  Description as DescriptionIcon,
  Assessment as AssessmentIcon,
  Groups as GroupsIcon,
  Shield as ShieldIcon,
  LocationOn as LocationIcon,
  Visibility as VisibilityIcon,
  Source as SourceIcon,
  Close as CloseIcon,
  AccessTime as AccessTimeIcon,
  LocalHospital as CasualtyIcon,
  Gavel as WeaponIcon,
  Link as LinkIcon,
  Info as InfoIcon,
  GpsFixed as PrecisionIcon,
  Person as PersonIcon,
  Map as MapIcon,
} from "@mui/icons-material";

// Import components - ALL PRESERVED
import EventCategory from "./EventCategory";
import EventLabel from "./EventLabel";
import EventStartDate from "./EventStartDate";
import EventEndDate from "./EventEndDate";
import EventPrimaryCountry from "./EventPrimaryCountry";
import EventSubType from "./EventSubType";
import EventDescription from "./EventDescription";
import EventScale from "./EventScale";
import EventSignificance from "./EventSignificance";
import EventTargetEnvironment from "./EventTargetEnvironment";
import EventIncidentCount from "./EventIncidentCount";
import EventActors from "./EventActors";
import EventTargets from "./EventTargets";
import EventReportedDate from "./EventReportedDate";
import EventProvenanceType from "./EventProvenanceType";
import EventSearchBox from "./EventSearchBox";
import { SectionLoader } from "../../components/shared/PageLoader";
import {
  componentColors,
  componentGradients,
  shadowStyles,
  tokens,
} from "../../theme";
import { openEquipmentInNewTab } from "../../utils/navigationUtils";
import OrganizationProfileCard from "../organizationProfile/OrganizationProfileCard";
import BusinessIcon from "@mui/icons-material/Business";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

// Lazy load heavy components
const MapComponent = React.lazy(() => import("../MapComponent"));

// ============================================
// CATEGORY TYPES ENUM
// ============================================
const CATEGORY_TYPES = {
  JTIC: 'JTIC',
  OFM: 'OFM',
  MILITARY: 'MILITARY',
};

// ============================================
// SHARED STYLES & HELPERS
// ============================================

// Unified section header title style
const sectionTitleStyle = {
  fontWeight: 700,
  fontSize: '0.7rem',
  color: '#1e3a5f',
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
  fontFamily: "'Inter', 'Roboto', 'Segoe UI', -apple-system, sans-serif",
};

// Shared shimmer animation keyframes
const shimmerAnimation = {
  '@keyframes shimmer': {
    '0%': { backgroundPosition: '200% 0' },
    '100%': { backgroundPosition: '-200% 0' },
  },
};

// Helper to check if a value has valid data (not null, "nan", or empty)
const hasValidData = (value) => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed !== '' && trimmed.toLowerCase() !== 'nan';
  }
  if (Array.isArray(value)) return value.length > 0;
  return true;
};

// Helper to check if event has location data
const hasLocationData = (event) => {
  if (!event) return false;
  return !!(
    (event.latitude && event.longitude) ||
    (event.lat && event.lon) ||
    event.primary_country
  );
};

// Helper to format date/time for display
const formatDateTime = (dateString) => {
  const date = dateString ? new Date(dateString) : new Date();
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }) + ', ' + date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

// ============================================
// UNIFIED REUSABLE COMPONENTS
// ============================================

// Premium Header - Single component for all views
const PremiumHeader = React.memo(() => {
  const theme = useTheme();
  const premiumHeader = theme.custom.premiumHeader;
  return (
    <Box sx={{ ...premiumHeader.profileCard}}>
      <Box sx={{ ...premiumHeader.content, px: { xs: 1.5, sm: 2 } }}>
        {/* Left Side - Title */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ ...premiumHeader.titleBadge, px: 1.5, py: 0.5, borderRadius: '20px' }}>
            <EventIcon sx={premiumHeader.icon} />
            <Typography
              sx={{
                ...premiumHeader.titleText,
                fontSize: '1rem',
                fontWeight: 600,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              Event Profile
            </Typography>
          </Box>
        </Box>

        {/* Right Side - Search */}
        <Box
          sx={{
            maxWidth: { xs: '100%', lg: '800px' },
            minWidth: { xs: '100%', lg: '500px' },
            flexShrink: 0,
            position: 'relative',
            zIndex: 1001,
          }}
        >
          <Box
            sx={{
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '10px',
              padding: '4px 10px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              position: 'relative',
              overflow: 'visible',
            }}
          >
            <EventSearchBox />
          </Box>
        </Box>
      </Box>
    </Box>
  );
});

// Page Container Wrapper - Common layout wrapper
const PageWrapper = React.memo(({ children }) => (
  <Box
    sx={{
      width: '100%',
      maxWidth: '100%',
      margin: '0 auto',
      px: { xs: 1.5, sm: 2, md: 2.5, lg: 3 },
      pt: 2,
      pb: 4,
      borderRadius: '12px',
      background: 'linear-gradient(135deg, #e2e8f0 0%, #e2e8f0 50%, #e2e8f0 100%)',
      position: 'relative',
      minHeight: '100vh',
    }}
  >
    {children}
  </Box>
));

// Classification Card - Unified across all category types
const ClassificationCard = React.memo(({ accentColor = componentColors.accents.indigo, selectedEvent }) => {
  const hasCategory = hasValidData(selectedEvent?.event_category);
  const hasSubType = hasValidData(selectedEvent?.event_sub_type) || hasValidData(selectedEvent?.sub_type);
  const hasData = hasCategory || hasSubType;

  return (
    <Box
      sx={{
        flex: { xs: 1, md: '0 0 30%' },
        width: { md: '30%' },
        background: hasData ? componentColors.white : '#f8fafc',
        borderRadius: tokens.borderRadius.lg,
        border: `1.5px solid ${hasData ? `${accentColor}20` : '#e2e8f0'}`,
        boxShadow: hasData ? `0 8px 32px ${accentColor}12, 0 2px 8px rgba(0,0,0,0.04)` : '0 2px 8px rgba(0,0,0,0.04)',
        overflow: 'hidden',
        transition: tokens.transitions.default,
        opacity: hasData ? 1 : 0.6,
        '&:hover': hasData ? {
          transform: 'translateY(-3px)',
          boxShadow: `0 12px 40px ${accentColor}18, 0 4px 12px rgba(0,0,0,0.06)`,
        } : {},
      }}
    >
      {/* Animated Top Border */}
      <Box
        sx={{
          height: '4px',
          background: hasData
            ? `linear-gradient(90deg, ${accentColor} 0%, ${accentColor}CC 40%, ${accentColor}80 70%, ${accentColor} 100%)`
            : 'linear-gradient(90deg, #94a3b8 0%, #94a3b8CC 40%, #94a3b880 70%, #94a3b8 100%)',
          backgroundSize: '200% 100%',
          animation: hasData ? 'shimmer 3s ease-in-out infinite' : 'none',
          ...shimmerAnimation,
        }}
      />
      {/* Header */}
      <Box
        sx={{
          px: 1,
          py: 0.8,
          display: 'flex',
          alignItems: 'center',
          gap: 0.75,
          background: hasData ? `linear-gradient(180deg, ${accentColor}10 0%, transparent 100%)` : 'linear-gradient(180deg, rgba(148, 163, 184, 0.1) 0%, transparent 100%)',
        }}
      >
        <Box
          sx={{
            width: 26,
            height: 26,
            borderRadius: tokens.borderRadius.lg,
            background: hasData
              ? `linear-gradient(135deg, ${accentColor} 0%, ${accentColor}CC 100%)`
              : 'linear-gradient(135deg, #94a3b8 0%, #94a3b8CC 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: hasData ? `0 3px 8px ${accentColor}50` : '0 3px 8px rgba(148, 163, 184, 0.3)',
          }}
        >
          <CategoryIcon sx={{ color: componentColors.white, fontSize: 14 }} />
        </Box>
        <Typography sx={sectionTitleStyle}>
          Classification
        </Typography>
      </Box>
      {/* Content */}
      <Box sx={{ px: 1, pb: 1, pt: 0.3 }}>
        {hasData ? (
          <>
            {/* Category */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.75,
                p: 0.75,
                mb: 0.5,
                borderRadius: '10px',
                background: hasCategory
                  ? `linear-gradient(135deg, ${accentColor}15 0%, ${accentColor}08 100%)`
                  : '#f1f5f9',
                border: `1px solid ${hasCategory ? `${accentColor}20` : '#e2e8f0'}`,
                opacity: hasCategory ? 1 : 0.6,
                transition: 'all 0.2s ease',
                '&:hover': hasCategory ? {
                  background: `linear-gradient(135deg, ${accentColor}20 0%, ${accentColor}12 100%)`,
                  transform: 'scale(1.01)',
                } : {},
              }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: hasCategory
                    ? `linear-gradient(135deg, ${accentColor} 0%, ${accentColor}CC 100%)`
                    : '#94a3b8',
                  boxShadow: hasCategory ? `0 0 8px ${accentColor}70` : 'none',
                  flexShrink: 0,
                }}
              />
              <Box
                sx={{
                  flex: 1,
                  minWidth: 0,
                  '& .MuiTypography-root': {
                    fontSize: '0.78rem !important',
                    fontWeight: '600 !important',
                    color: hasCategory ? '#2A3547 !important' : '#94a3b8 !important',
                  },
                }}
              >
                {hasCategory ? <EventCategory /> : (
                  <Typography sx={{ fontSize: '0.78rem', fontWeight: 500, color: '#94a3b8', fontStyle: 'italic' }}>
                    No category data
                  </Typography>
                )}
              </Box>
            </Box>
            {/* SubType */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.75,
                p: 0.75,
                borderRadius: tokens.borderRadius.lg,
                background: hasSubType
                  ? `linear-gradient(135deg, ${componentColors.accents.blue}1A 0%, ${componentColors.accents.blue}0A 100%)`
                  : '#f1f5f9',
                border: `1px solid ${hasSubType ? `${componentColors.accents.blue}26` : '#e2e8f0'}`,
                opacity: hasSubType ? 1 : 0.6,
                transition: tokens.transitions.fast,
                '&:hover': hasSubType ? {
                  background: `linear-gradient(135deg, ${componentColors.accents.blue}26 0%, ${componentColors.accents.blue}14 100%)`,
                  transform: 'scale(1.01)',
                } : {},
              }}
            >
              <ShieldIcon sx={{ fontSize: 14, color: hasSubType ? componentColors.accents.blue : '#94a3b8', flexShrink: 0 }} />
              <Box
                sx={{
                  flex: 1,
                  minWidth: 0,
                  '& .MuiTypography-root': {
                    fontSize: '0.75rem !important',
                    fontWeight: '600 !important',
                    color: hasSubType ? '#2A3547 !important' : '#94a3b8 !important',
                  },
                }}
              >
                {hasSubType ? <EventSubType /> : (
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: '#94a3b8', fontStyle: 'italic' }}>
                    No subtype data
                  </Typography>
                )}
              </Box>
            </Box>
          </>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 2 }}>
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 500, color: '#94a3b8', fontStyle: 'italic' }}>
              No classification data available
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
});

// Country Info Box - Unified across all category types
const CountryInfoBox = React.memo(({ accentColor = componentColors.accents.blue, showLabel = true, selectedEvent }) => {
  const hasData = hasValidData(selectedEvent?.primary_country);

  return (
    <Box
      sx={{
        flex: 1,
        px: 1,
        py: 0.8,
        borderRadius: tokens.borderRadius.lg,
        background: hasData
          ? `linear-gradient(145deg, ${componentColors.white} 0%, #F8FAFF 100%)`
          : 'linear-gradient(145deg, #f8fafc 0%, #f1f5f9 100%)',
        border: `1px solid ${hasData ? `${accentColor}18` : '#e2e8f0'}`,
        boxShadow: hasData ? `0 2px 6px ${accentColor}10` : '0 2px 6px rgba(0,0,0,0.04)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        minHeight: '44px',
        position: 'relative',
        transition: tokens.transitions.fast,
        opacity: hasData ? 1 : 0.6,
        '&:hover': hasData ? {
          boxShadow: `0 4px 12px ${accentColor}15`,
          transform: 'translateY(-1px)',
        } : {},
        '&::after': {
          content: '""',
          position: 'absolute',
          left: 0,
          top: '50%',
          transform: 'translateY(-50%)',
          width: '3px',
          height: '55%',
          background: hasData
            ? `linear-gradient(180deg, ${accentColor} 0%, ${accentColor}80 100%)`
            : 'linear-gradient(180deg, #94a3b8 0%, #94a3b880 100%)',
          borderRadius: '0 3px 3px 0',
        },
      }}
    >
      <Box
        sx={{
          pl: 0.8,
          '& .MuiTypography-root': {
            fontSize: '0.8rem !important',
            fontWeight: '600 !important',
            color: hasData ? '#2A3547 !important' : '#94a3b8 !important',
          },
        }}
      >
        {hasData ? <EventPrimaryCountry /> : (
          <Typography sx={{ fontSize: '0.8rem', fontWeight: 500, color: '#94a3b8', fontStyle: 'italic' }}>
            No country data
          </Typography>
        )}
      </Box>
    </Box>
  );
});

// Event Label Box - Unified across all category types
const EventLabelBox = React.memo(({ accentColor = componentColors.accents.blue, selectedEvent }) => {
  const hasData = hasValidData(selectedEvent?.label);

  return (
    <Box
      sx={{
        flex: { xs: '1', md: '2.5' },
        px: 0,
        py: 0,
        borderRadius: tokens.borderRadius.lg,
        background: hasData ? componentColors.white : '#f8fafc',
        boxShadow: hasData ? `0 4px 20px ${accentColor}19, 0 1px 4px rgba(0,0,0,0.04)` : '0 2px 8px rgba(0,0,0,0.04)',
        display: 'flex',
        alignItems: 'center',
        minWidth: 0,
        position: 'relative',
        overflow: 'hidden',
        border: `1px solid ${hasData ? `${accentColor}18` : '#e2e8f0'}`,
        transition: tokens.transitions.default,
        opacity: hasData ? 1 : 0.6,
        '&:hover': hasData ? {
          boxShadow: `0 8px 28px ${accentColor}24`,
          transform: 'translateY(-2px)',
        } : {},
      }}
    >
      <Box sx={{ flex: 1, minWidth: 0, zIndex: 1 }}>
        {hasData ? <EventLabel /> : (
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 500, color: '#94a3b8', fontStyle: 'italic' }}>
              No event label available
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
});

// Date Info Box - Unified for Start/End dates
const DateInfoBox = React.memo(({ label, accentColor, children, hasData = true }) => {
  return (
    <Box
      sx={{
        flex: 1,
        px: 1,
        py: 0.8,
        borderRadius: '10px',
        background: hasData
          ? `linear-gradient(145deg, #FFFFFF 0%, ${accentColor}08 100%)`
          : 'linear-gradient(145deg, #f8fafc 0%, #f1f5f9 100%)',
        border: `1px solid ${hasData ? `${accentColor}20` : '#e2e8f0'}`,
        boxShadow: hasData ? `0 2px 6px ${accentColor}10` : '0 2px 6px rgba(0,0,0,0.04)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        minHeight: '44px',
        position: 'relative',
        opacity: hasData ? 1 : 0.6,
        '&::after': {
          content: '""',
          position: 'absolute',
          left: 0,
          top: '50%',
          transform: 'translateY(-50%)',
          width: '3px',
          height: '55%',
          background: hasData
            ? `linear-gradient(180deg, ${accentColor} 0%, ${accentColor}CC 100%)`
            : 'linear-gradient(180deg, #94a3b8 0%, #94a3b8CC 100%)',
          borderRadius: '0 3px 3px 0',
        },
      }}
    >
      {label && (
        <Typography
          sx={{
            fontSize: '0.6rem',
            fontWeight: 600,
            color: hasData ? accentColor : '#94a3b8',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            mb: 0.2,
            pl: 0.8,
          }}
        >
          {label}
        </Typography>
      )}
      <Box
        sx={{
          pl: 0.8,
          '& .MuiTypography-root': {
            fontSize: '0.8rem !important',
            fontWeight: '600 !important',
            color: hasData ? '#2A3547 !important' : '#94a3b8 !important',
          },
        }}
      >
        {hasData ? children : (
          <Typography sx={{ fontSize: '0.8rem', fontWeight: 500, color: '#94a3b8', fontStyle: 'italic' }}>
            No date data
          </Typography>
        )}
      </Box>
    </Box>
  );
});

// Section Panel - Container for grouped content
const SectionPanel = React.memo(({ title, icon, accentColor = componentColors.accents.blue, children, defaultExpanded = true }) => {
  const [expanded, setExpanded] = React.useState(defaultExpanded);

  return (
    <Box
      sx={{
        background: componentColors.white,
        borderRadius: tokens.borderRadius.xl,
        border: `1px solid ${accentColor}12`,
        boxShadow: `0 4px 24px ${accentColor}08`,
        overflow: 'hidden',
        position: 'relative',
        transition: tokens.transitions.default,
        mb: 2.5,
        '&:hover': {
          boxShadow: `0 8px 32px ${accentColor}12`,
          borderColor: `${accentColor}20`,
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: `linear-gradient(90deg, ${accentColor} 0%, ${accentColor}80 100%)`,
          borderRadius: '16px 16px 0 0',
        },
      }}
    >
      {/* Section Header */}
      <Box
        onClick={() => setExpanded(!expanded)}
        sx={{
          px: 2.5,
          py: 1.5,
          mt: 0.5,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: `linear-gradient(135deg, ${accentColor}06 0%, ${accentColor}02 100%)`,
          borderBottom: expanded ? `1px solid ${accentColor}10` : 'none',
          transition: 'all 0.2s ease',
          '&:hover': {
            background: `linear-gradient(135deg, ${accentColor}10 0%, ${accentColor}05 100%)`,
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '10px',
              background: `linear-gradient(135deg, ${accentColor} 0%, ${accentColor}90 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 4px 12px ${accentColor}35`,
            }}
          >
            {icon}
          </Box>
          <Typography sx={sectionTitleStyle}>
            {title}
          </Typography>
        </Box>
        <IconButton
          size="small"
          sx={{
            transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            bgcolor: `${accentColor}10`,
            border: `1px solid ${accentColor}20`,
            width: 32,
            height: 32,
            '&:hover': {
              bgcolor: `${accentColor}20`,
              borderColor: `${accentColor}40`,
            },
          }}
        >
          <ExpandMoreIcon sx={{ color: accentColor, fontSize: 22 }} />
        </IconButton>
      </Box>

      {/* Section Content */}
      <Collapse in={expanded}>
        <Box sx={{ p: 2.5 }}>
          {children}
        </Box>
      </Collapse>
    </Box>
  );
});

// Description Card Component - Modern Design with Modal
const DescriptionCard = React.memo(({ accentColor = componentColors.accents.blue, selectedEvent }) => {
  const [showModal, setShowModal] = React.useState(false);
  const hasData = hasValidData(selectedEvent?.description);

  return (
    <>
      {/* Description Box */}
      <Box
        sx={{
          flex: { xs: 1, md: '0 0 40%' },
          width: { md: '40%' },
          background: hasData ? componentColors.white : '#f8fafc',
          borderRadius: tokens.borderRadius.lg,
          border: `1.5px solid ${hasData ? `${accentColor}18` : '#e2e8f0'}`,
          boxShadow: hasData ? `0 8px 32px ${accentColor}10, 0 2px 8px rgba(0,0,0,0.04)` : '0 2px 8px rgba(0,0,0,0.04)',
          overflow: 'hidden',
          transition: tokens.transitions.default,
          display: 'flex',
          flexDirection: 'column',
          opacity: hasData ? 1 : 0.6,
          '&:hover': hasData ? {
            transform: 'translateY(-3px)',
            boxShadow: `0 12px 40px ${accentColor}15, 0 4px 12px rgba(0,0,0,0.06)`,
          } : {},
        }}
      >
        {/* Animated Top Border */}
        <Box sx={{
          height: '3px',
          background: hasData
            ? `linear-gradient(90deg, ${accentColor} 0%, #bce8ffff 40%, #e2f6ffff 70%, ${accentColor} 100%)`
            : 'linear-gradient(90deg, #94a3b8 0%, #94a3b8CC 40%, #94a3b880 70%, #94a3b8 100%)',
          backgroundSize: '200% 100%',
          animation: hasData ? 'shimmer 3s ease-in-out infinite' : 'none',
          ...shimmerAnimation,
        }} />

        {/* Header */}
        <Box sx={{
          px: 1,
          py: 0.8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: hasData ? `linear-gradient(180deg, ${accentColor}06 0%, transparent 100%)` : 'linear-gradient(180deg, rgba(148, 163, 184, 0.06) 0%, transparent 100%)'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <Box sx={{
              width: 26,
              height: 26,
              borderRadius: '8px',
              background: hasData
                ? `linear-gradient(135deg, ${accentColor} 0%, #0ea5e9 100%)`
                : 'linear-gradient(135deg, #94a3b8 0%, #94a3b8CC 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: hasData ? `0 3px 8px ${accentColor}50` : '0 3px 8px rgba(148, 163, 184, 0.3)'
            }}>
              <DescriptionIcon sx={{ color: 'white', fontSize: 14 }} />
            </Box>
            <Typography sx={sectionTitleStyle}>Description</Typography>
          </Box>
          {hasData && (
            <Button
              onClick={() => setShowModal(true)}
              size="small"
              sx={{
                minWidth: 'auto',
                px: 1.2,
                py: 0.5,
                borderRadius: '20px',
                background: `linear-gradient(135deg, ${accentColor} 0%, #0ea5e9 100%)`,
                color: 'white',
                fontWeight: 600,
                fontSize: '0.7rem',
                textTransform: 'none',
                boxShadow: `0 3px 10px ${accentColor}40`,
                '&:hover': { transform: 'scale(1.05)', boxShadow: `0 5px 15px ${accentColor}50` },
              }}
            >
              <VisibilityIcon sx={{ fontSize: 14, mr: 0.5 }} />
              View More
            </Button>
          )}
        </Box>

        {/* Content - 5 lines */}
        <Box sx={{ px: 1, py: 1, flex: 1, position: 'relative', overflow: 'hidden' }}>
          {hasData ? (
            <>
              <Box sx={{
                display: '-webkit-box',
                WebkitLineClamp: 5,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden', '& .MuiTypography-root': {
                  fontSize: '0.82rem !important',
                  lineHeight: '1.7 !important',
                  color: '#4a5568 !important'
                }
              }}>
                <EventDescription />
              </Box>
              <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '25px', background: 'linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,1) 100%)', pointerEvents: 'none' }} />
            </>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 3 }}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 500, color: '#94a3b8', fontStyle: 'italic' }}>
                No description data available
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      {/* Full Description Modal */}
      {hasData && (
        <Modal open={showModal} onClose={() => setShowModal(false)} closeAfterTransition sx={{ '& .MuiBackdrop-root': { backgroundColor: 'rgba(10, 15, 30, 0.7)', backdropFilter: 'blur(12px)' } }}>
          <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '94%', maxWidth: '800px', maxHeight: '85vh', bgcolor: '#FFFFFF', borderRadius: '24px', boxShadow: `0 30px 80px rgba(0,0,0,0.25), 0 0 0 1px ${accentColor}20`, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            {/* Modal Header */}
            <Box sx={{ background: `linear-gradient(135deg, ${accentColor} 0%, #0ea5e9 50%, #06b6d4 100%)`, px: 3, py: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', overflow: 'hidden' }}>
              <Box sx={{ position: 'absolute', top: -40, right: -40, width: 120, height: 120, background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }} />
              <Box sx={{ position: 'absolute', bottom: -60, left: '20%', width: 150, height: 150, background: 'rgba(255,255,255,0.08)', borderRadius: '50%' }} />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, zIndex: 1 }}>
                <Box sx={{ width: 48, height: 48, borderRadius: '14px', background: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.3)' }}>
                  <DescriptionIcon sx={{ color: 'white', fontSize: 26 }} />
                </Box>
                <Box>
                  <Typography sx={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', mb: 0.3 }}>Event Information</Typography>
                  <Typography sx={{ color: 'white', fontWeight: 700, fontSize: '1.2rem' }}>Full Description</Typography>
                </Box>
              </Box>
              <IconButton onClick={() => setShowModal(false)} sx={{ color: 'white', bgcolor: 'rgba(255, 255, 255, 0.15)', border: '1px solid rgba(255,255,255,0.25)', zIndex: 1, '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.3)', transform: 'rotate(90deg)' } }}>
                <CloseIcon />
              </IconButton>
            </Box>
            {/* Modal Content */}
            <Box sx={{ p: 3, overflow: 'auto', flex: 1, background: 'linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 100%)' }}>
              <Box sx={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid rgba(0, 0, 0, 0.06)', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', p: 3, '& .MuiTypography-root': { lineHeight: '1.9 !important', fontSize: '0.95rem !important', color: '#2d3748 !important' } }}>
                <EventDescription />
              </Box>
            </Box>
          </Box>
        </Modal>
      )}
    </>
  );
});

// Event Metrics Card - Unified component for JTIC, OFM and Military
const EventMetricsCard = React.memo(({ categoryType, selectedEvent }) => {
  const isJTIC = categoryType === CATEGORY_TYPES.JTIC;
  const isOFM = categoryType === CATEGORY_TYPES.OFM;

  // Check for data availability
  const hasScale = hasValidData(selectedEvent?.event_scale);
  const hasSignificance = hasValidData(selectedEvent?.event_significance);
  const hasIncidentCount = hasValidData(selectedEvent?.incident_count);
  const hasData = hasScale || hasSignificance || hasIncidentCount;

  // Get colors based on category type
  const getColors = () => {
    if (isOFM) return { border: 'rgba(14, 165, 233, 0.15)', shadow: 'rgba(14, 165, 233, 0.08)', bg: 'rgba(14, 165, 233, 0.06)', gradient: '#0ea5e9 0%, #06b6d4' };
    if (isJTIC) return { border: 'rgba(14, 165, 233, 0.15)', shadow: 'rgba(14, 165, 233, 0.08)', bg: 'rgba(14, 165, 233, 0.06)', gradient: '#0ea5e9 0%, #3b82f6' };
    return { border: 'rgba(59, 130, 246, 0.15)', shadow: 'rgba(59, 130, 246, 0.08)', bg: 'rgba(59, 130, 246, 0.06)', gradient: '#3b82f6 0%, #0ea5e9' };
  };

  const colors = getColors();

  return (
    <Box
      sx={{
        flex: { xs: 1, md: '0 0 30%' },
        width: { md: '30%' },
        background: hasData ? '#FFFFFF' : '#f8fafc',
        borderRadius: '16px',
        border: `1px solid ${hasData ? colors.border : 'rgba(226, 232, 240, 1)'}`,
        boxShadow: hasData ? `0 4px 20px ${colors.shadow}` : '0 2px 8px rgba(0,0,0,0.04)',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        opacity: hasData ? 1 : 0.6,
        '&:hover': hasData ? { transform: 'translateY(-2px)', boxShadow: `0 8px 30px ${colors.shadow.replace('0.08', '0.12')}` } : {},
      }}
    >
      {/* Header */}
      <Box sx={{
        px: 1,
        py: 0.6,
        display: 'flex',
        alignItems: 'center',
        gap: 0.6,
        background: hasData ? `linear-gradient(180deg, ${colors.bg} 0%, transparent 100%)` : 'linear-gradient(180deg, rgba(148, 163, 184, 0.06) 0%, transparent 100%)'
      }}>
        <Box sx={{
          width: 22,
          height: 22,
          borderRadius: '6px',
          background: hasData
            ? `linear-gradient(135deg, ${colors.gradient} 100%)`
            : 'linear-gradient(135deg, #94a3b8 0%, #94a3b8CC 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: hasData ? `0 2px 6px ${colors.shadow.replace('0.08', '0.4')}` : '0 2px 6px rgba(148, 163, 184, 0.3)'
        }}>
          <AssessmentIcon sx={{ color: 'white', fontSize: 12 }} />
        </Box>
        <Typography sx={sectionTitleStyle}>Event Metrics</Typography>
      </Box>
      {/* Metrics Content - Column Layout */}
      <Box sx={{ px: 1, pb: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        {hasData ? (
          <>
            {/* Scale */}
            <MetricItem color={isOFM ? '#0ea5e9' : isJTIC ? '#3b82f6' : '#6366f1'} hasData={hasScale}>
              {hasScale ? <EventScale /> : (
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: '#94a3b8', fontStyle: 'italic' }}>
                  Scale: No data
                </Typography>
              )}
            </MetricItem>
            {/* Significance */}
            <MetricItem color={isOFM ? '#06b6d4' : isJTIC ? '#6366f1' : '#4f46e5'} hasData={hasSignificance}>
              {hasSignificance ? <EventSignificance /> : (
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: '#94a3b8', fontStyle: 'italic' }}>
                  Significance: No data
                </Typography>
              )}
            </MetricItem>
            {/* Incident Count */}
            <MetricItem color="#0ea5e9" hasData={hasIncidentCount}>
              {hasIncidentCount ? <EventIncidentCount /> : (
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: '#94a3b8', fontStyle: 'italic' }}>
                  Incident Count: No data
                </Typography>
              )}
            </MetricItem>
          </>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 2 }}>
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 500, color: '#94a3b8', fontStyle: 'italic' }}>
              No metrics data available
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
});

// Metric Item - Reusable metric row component
const MetricItem = React.memo(({ color, children, hasData = true }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: 0.5,
      p: 0.5,
      borderRadius: '6px',
      background: hasData
        ? `linear-gradient(135deg, ${color}10 0%, ${color}05 100%)`
        : 'linear-gradient(135deg, rgba(148, 163, 184, 0.1) 0%, rgba(148, 163, 184, 0.05) 100%)',
      border: `1px solid ${hasData ? `${color}18` : '#e2e8f0'}`,
      opacity: hasData ? 1 : 0.6,
      transition: 'all 0.2s',
      '&:hover': hasData ? { background: `linear-gradient(135deg, ${color}18 0%, ${color}08 100%)` } : {},
    }}
  >
    <Box sx={{
      width: 5,
      height: 5,
      borderRadius: '50%',
      background: hasData ? color : '#94a3b8',
      boxShadow: hasData ? `0 0 5px ${color}80` : 'none',
      flexShrink: 0,
      mt: 0.4
    }} />
    <Box sx={{ flex: 1, minWidth: 0 }}>
      {children}
    </Box>
  </Box>
));

// Participants Card - Unified for JTIC, OFM and Military
// Shows Actors and Targets for all categories
const ParticipantsCard = React.memo(({ categoryType, selectedEvent }) => {
  // Check for data availability - actors can be array or string fields
  const hasActors = hasValidData(selectedEvent?.actors) ||
                    hasValidData(selectedEvent?.actors_actor_type) ||
                    hasValidData(selectedEvent?.actors_actor_role);
  const hasTargets = hasValidData(selectedEvent?.targets_target_sector) ||
                     hasValidData(selectedEvent?.targets);
  const hasData = hasActors || hasTargets;

  return (
    <Box
      sx={{
        flex: { xs: 1, md: '0 0 30%' },
        minWidth: { xs: '100%', md: 'auto' },
        width: { md: '30%' },
        background: hasData ? '#FFFFFF' : '#f8fafc',
        borderRadius: '12px',
        border: `1px solid ${hasData ? 'rgba(99, 102, 241, 0.15)' : '#e2e8f0'}`,
        boxShadow: hasData ? '0 2px 12px rgba(99, 102, 241, 0.06)' : '0 2px 8px rgba(0,0,0,0.04)',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        opacity: hasData ? 1 : 0.6,
        '&:hover': hasData ? { transform: 'translateY(-1px)', boxShadow: '0 4px 16px rgba(99, 102, 241, 0.1)' } : {},
      }}
    >
      {/* Header */}
      <Box sx={{
        px: 1.25,
        py: 0.75,
        display: 'flex',
        alignItems: 'center',
        gap: 0.75,
        background: hasData ? 'linear-gradient(180deg, rgba(99, 102, 241, 0.06) 0%, transparent 100%)' : 'linear-gradient(180deg, rgba(148, 163, 184, 0.06) 0%, transparent 100%)'
      }}>
        <Box sx={{
          width: 24,
          height: 24,
          borderRadius: '6px',
          background: hasData
            ? 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)'
            : 'linear-gradient(135deg, #94a3b8 0%, #94a3b8CC 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: hasData ? '0 2px 6px rgba(99, 102, 241, 0.35)' : '0 2px 6px rgba(148, 163, 184, 0.3)'
        }}>
          <GroupsIcon sx={{ color: 'white', fontSize: 14 }} />
        </Box>
        <Typography sx={sectionTitleStyle}>Participants</Typography>
      </Box>
      {/* Participants Content - Actors and Targets */}
      <Box sx={{ px: 1.25, pb: 1, display: 'flex', flexDirection: 'column', gap: 0.6 }}>
        {hasData ? (
          <>
            {/* Actors */}
            <MetricItem color="#3b82f6" hasData={hasActors}>
              {hasActors ? <EventActors /> : (
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: '#94a3b8', fontStyle: 'italic' }}>
                  Actors: No data
                </Typography>
              )}
            </MetricItem>
            {/* Targets */}
            <MetricItem color="#6366f1" hasData={hasTargets}>
              {hasTargets ? <EventTargets /> : (
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: '#94a3b8', fontStyle: 'italic' }}>
                  Targets: No data
                </Typography>
              )}
            </MetricItem>
          </>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 2 }}>
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 500, color: '#94a3b8', fontStyle: 'italic' }}>
              No participants data available
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
});

// Environment Card - Target Environment section (used by all categories)
const EnvironmentCard = React.memo(({ selectedEvent }) => {
  const targetEnv = selectedEvent?.event_target_environment || selectedEvent?.target_environment;
  const hasData = hasValidData(targetEnv);

  return (
    <Box
      sx={{
        background: hasData ? '#FFFFFF' : '#f8fafc',
        borderRadius: '12px',
        border: `1px solid ${hasData ? 'rgba(14, 165, 233, 0.15)' : '#e2e8f0'}`,
        boxShadow: hasData ? '0 2px 12px rgba(14, 165, 233, 0.08)' : '0 2px 8px rgba(0,0,0,0.04)',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        opacity: hasData ? 1 : 0.6,
        '&:hover': hasData ? { transform: 'translateY(-1px)', boxShadow: '0 4px 16px rgba(14, 165, 233, 0.12)' } : {},
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5 }}>
        <Box sx={{
          width: 32,
          height: 32,
          borderRadius: '8px',
          background: hasData
            ? 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)'
            : 'linear-gradient(135deg, #94a3b8 0%, #94a3b8CC 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: hasData ? '0 3px 10px rgba(14, 165, 233, 0.35)' : '0 3px 10px rgba(148, 163, 184, 0.3)',
          flexShrink: 0
        }}>
          <VisibilityIcon sx={{ color: 'white', fontSize: 16 }} />
        </Box>
        <Box sx={{
          flex: 1,
          minWidth: 0,
          '& .MuiTypography-root:first-of-type': {
            fontSize: '0.65rem !important',
            fontWeight: '700 !important',
            color: hasData ? '#1e3a5f !important' : '#94a3b8 !important',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            fontFamily: "'Inter', 'Roboto', 'Segoe UI', -apple-system, sans-serif",
            mb: '2px'
          },
          '& .MuiTypography-root:last-of-type': {
            fontSize: '0.9rem !important',
            fontWeight: '700 !important',
            color: hasData ? '#1a1a2e !important' : '#94a3b8 !important',
            lineHeight: '1.2'
          }
        }}>
          {hasData ? <EventTargetEnvironment /> : (
            <>
              <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', mb: '2px' }}>
                Target Environment
              </Typography>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 500, color: '#94a3b8', fontStyle: 'italic' }}>
                No data available
              </Typography>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
});

// Casualties Card - Compact design
const CasualtiesCard = React.memo(({ selectedEvent }) => {
  const totalKilled = selectedEvent?.total_casualties_killed;
  const totalWounded = selectedEvent?.total_casualties_wounded;
  const nonMilitantKilled = selectedEvent?.non_militant_casualties_killed;
  const nonMilitantWounded = selectedEvent?.non_militant_casualties_wounded;

  const hasKilled = hasValidData(totalKilled) && totalKilled !== "0";
  const hasWounded = hasValidData(totalWounded) && totalWounded !== "0";
  const hasNonMilitantKilled = hasValidData(nonMilitantKilled) && nonMilitantKilled !== "0";
  const hasNonMilitantWounded = hasValidData(nonMilitantWounded) && nonMilitantWounded !== "0";
  const hasData = hasKilled || hasWounded || hasNonMilitantKilled || hasNonMilitantWounded;

  if (!hasData) return null;

  const accentColor = componentColors.accents.indigo || '#6366f1';

  return (
    <Box
      sx={{
        flex: 1,
        background: componentColors.white,
        borderRadius: '10px',
        border: `1px solid ${accentColor}18`,
        boxShadow: `0 2px 8px ${accentColor}08`,
        overflow: 'hidden',
        transition: 'all 0.2s ease',
        '&:hover': { transform: 'translateY(-2px)', boxShadow: `0 4px 12px ${accentColor}12` },
      }}
    >
      {/* Header */}
      <Box sx={{ px: 1, py: 0.6, display: 'flex', alignItems: 'center', gap: 0.6, background: `linear-gradient(180deg, ${accentColor}08 0%, transparent 100%)` }}>
        <Box sx={{ width: 22, height: 22, borderRadius: '6px', background: `linear-gradient(135deg, ${accentColor} 0%, ${accentColor}CC 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CasualtyIcon sx={{ color: componentColors.white, fontSize: 12 }} />
        </Box>
        <Typography sx={sectionTitleStyle}>Casualties</Typography>
      </Box>
      {/* Content - Compact flex wrap */}
      <Box sx={{ px: 1, py: 0.6, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
        {hasKilled && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, px: 0.8, py: 0.4, borderRadius: '6px', background: `${accentColor}10`, border: `1px solid ${accentColor}15` }}>
            <Box sx={{ width: 6, height: 6, borderRadius: '50%', background: accentColor, flexShrink: 0 }} />
            <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: '#64748b' }}>Killed:</Typography>
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: '#2A3547' }}>{totalKilled}</Typography>
          </Box>
        )}
        {hasWounded && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, px: 0.8, py: 0.4, borderRadius: '6px', background: `${componentColors.accents.amber}10`, border: `1px solid ${componentColors.accents.amber}15` }}>
            <Box sx={{ width: 6, height: 6, borderRadius: '50%', background: componentColors.accents.amber, flexShrink: 0 }} />
            <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: '#64748b' }}>Wounded:</Typography>
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: '#2A3547' }}>{totalWounded}</Typography>
          </Box>
        )}
        {hasNonMilitantKilled && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, px: 0.8, py: 0.4, borderRadius: '6px', background: `${componentColors.accents.violet}10`, border: `1px solid ${componentColors.accents.violet}15` }}>
            <Box sx={{ width: 6, height: 6, borderRadius: '50%', background: componentColors.accents.violet, flexShrink: 0 }} />
            <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, color: '#64748b' }}>Non-Mil Killed:</Typography>
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: '#2A3547' }}>{nonMilitantKilled}</Typography>
          </Box>
        )}
        {hasNonMilitantWounded && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, px: 0.8, py: 0.4, borderRadius: '6px', background: `${componentColors.accents.blue}10`, border: `1px solid ${componentColors.accents.blue}15` }}>
            <Box sx={{ width: 6, height: 6, borderRadius: '50%', background: componentColors.accents.blue, flexShrink: 0 }} />
            <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, color: '#64748b' }}>Non-Mil Wounded:</Typography>
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: '#2A3547' }}>{nonMilitantWounded}</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
});

// Platforms & Weapons Card - Compact design
const PlatformsWeaponsCard = React.memo(({ selectedEvent }) => {
  const platform = selectedEvent?.platforms_platform;
  const weapon = selectedEvent?.platforms_weapon;

  const hasPlatform = hasValidData(platform);
  const hasWeapon = hasValidData(weapon);
  const hasData = hasPlatform || hasWeapon;

  if (!hasData) return null;

  const accentColor = componentColors.accents.cyan || '#06b6d4';

  return (
    <Box
      sx={{
        flex: 1,
        background: componentColors.white,
        borderRadius: '10px',
        border: `1px solid ${accentColor}18`,
        boxShadow: `0 2px 8px ${accentColor}08`,
        overflow: 'hidden',
        transition: 'all 0.2s ease',
        '&:hover': { transform: 'translateY(-2px)', boxShadow: `0 4px 12px ${accentColor}12` },
      }}
    >
      {/* Header */}
      <Box sx={{ px: 1, py: 0.6, display: 'flex', alignItems: 'center', gap: 0.6, background: `linear-gradient(180deg, ${accentColor}08 0%, transparent 100%)` }}>
        <Box sx={{ width: 22, height: 22, borderRadius: '6px', background: `linear-gradient(135deg, ${accentColor} 0%, ${accentColor}CC 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <WeaponIcon sx={{ color: componentColors.white, fontSize: 12 }} />
        </Box>
        <Typography sx={sectionTitleStyle}>Platforms & Weapons</Typography>
      </Box>
      {/* Content - Compact */}
      <Box sx={{ px: 1, py: 0.6, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        {hasPlatform && (
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.5, px: 0.8, py: 0.4, borderRadius: '6px', background: `${accentColor}10`, border: `1px solid ${accentColor}15` }}>
            <Box sx={{ width: 6, height: 6, borderRadius: '50%', background: accentColor, flexShrink: 0, mt: 0.5 }} />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Platform</Typography>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#2A3547', lineHeight: 1.3, wordBreak: 'break-word' }}>{platform}</Typography>
            </Box>
          </Box>
        )}
        {hasWeapon && (
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.5, px: 0.8, py: 0.4, borderRadius: '6px', background: `${componentColors.accents.blue}10`, border: `1px solid ${componentColors.accents.blue}15` }}>
            <Box sx={{ width: 6, height: 6, borderRadius: '50%', background: componentColors.accents.blue, flexShrink: 0, mt: 0.5 }} />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Weapon</Typography>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#2A3547', lineHeight: 1.3, wordBreak: 'break-word' }}>{weapon}</Typography>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
});

// Source Information Card - Compact design
const SourceInfoCard = React.memo(({ selectedEvent }) => {
  const sourceType = selectedEvent?.sources_source_type;
  const dataSource = selectedEvent?.data_source;
  const sourceUrl = selectedEvent?.sources_source_type_source_url_news;
  const incidentType = selectedEvent?.incident_type;
  const geoPrecision = selectedEvent?.event_location_geoprecision;

  const hasSourceType = hasValidData(sourceType);
  const hasDataSource = hasValidData(dataSource);
  const hasSourceUrl = hasValidData(sourceUrl);
  const hasIncidentType = hasValidData(incidentType);
  const hasGeoPrecision = hasValidData(geoPrecision);
  const hasData = hasSourceType || hasDataSource || hasSourceUrl || hasIncidentType || hasGeoPrecision;

  if (!hasData) return null;

  const accentColor = componentColors.accents.blue || '#3b82f6';

  return (
    <Box
      sx={{
        flex: 1,
        background: componentColors.white,
        borderRadius: '12px',
        border: `1px solid ${accentColor}20`,
        boxShadow: `0 2px 12px ${accentColor}10`,
        overflow: 'hidden',
        transition: 'all 0.2s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: `0 4px 16px ${accentColor}15`,
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 1,
          py: 0.6,
          display: 'flex',
          alignItems: 'center',
          gap: 0.75,
          background: `linear-gradient(180deg, ${accentColor}08 0%, transparent 100%)`,
          borderBottom: `1px solid ${accentColor}10`,
        }}
      >
        <Box
          sx={{
            width: 24,
            height: 24,
            borderRadius: '6px',
            background: `linear-gradient(135deg, ${accentColor} 0%, ${accentColor}CC 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 2px 6px ${accentColor}40`,
          }}
        >
          <InfoIcon sx={{ color: componentColors.white, fontSize: 13 }} />
        </Box>
        <Typography sx={sectionTitleStyle}>Source & Details</Typography>
      </Box>

      {/* Content - Compact flex wrap layout */}
      <Box sx={{ px: 1, pb: 1, pt: 0.5, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
        {hasDataSource && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              px: 0.75,
              py: 0.4,
              borderRadius: '6px',
              background: `linear-gradient(135deg, ${accentColor}12 0%, ${accentColor}06 100%)`,
              border: `1px solid ${accentColor}18`,
              transition: 'all 0.15s ease',
              '&:hover': { background: `linear-gradient(135deg, ${accentColor}18 0%, ${accentColor}10 100%)` },
            }}
          >
            <Box sx={{ width: 5, height: 5, borderRadius: '50%', background: accentColor, flexShrink: 0 }} />
            <SourceIcon sx={{ fontSize: 11, color: accentColor }} />
            <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: '#2A3547' }}>{dataSource}</Typography>
          </Box>
        )}
        {hasSourceType && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              px: 0.75,
              py: 0.4,
              borderRadius: '6px',
              background: `linear-gradient(135deg, ${componentColors.accents.indigo}12 0%, ${componentColors.accents.indigo}06 100%)`,
              border: `1px solid ${componentColors.accents.indigo}18`,
              transition: 'all 0.15s ease',
              '&:hover': { background: `linear-gradient(135deg, ${componentColors.accents.indigo}18 0%, ${componentColors.accents.indigo}10 100%)` },
            }}
          >
            <Box sx={{ width: 5, height: 5, borderRadius: '50%', background: componentColors.accents.indigo, flexShrink: 0 }} />
            <Typography sx={{ fontSize: '0.6rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Type:</Typography>
            <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: '#2A3547' }}>{sourceType}</Typography>
          </Box>
        )}
        {hasIncidentType && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              px: 0.75,
              py: 0.4,
              borderRadius: '6px',
              background: `linear-gradient(135deg, ${componentColors.accents.violet}12 0%, ${componentColors.accents.violet}06 100%)`,
              border: `1px solid ${componentColors.accents.violet}18`,
              transition: 'all 0.15s ease',
              '&:hover': { background: `linear-gradient(135deg, ${componentColors.accents.violet}18 0%, ${componentColors.accents.violet}10 100%)` },
            }}
          >
            <Box sx={{ width: 5, height: 5, borderRadius: '50%', background: componentColors.accents.violet, flexShrink: 0 }} />
            <Typography sx={{ fontSize: '0.6rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Incident:</Typography>
            <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: '#2A3547' }}>{incidentType}</Typography>
          </Box>
        )}
        {hasGeoPrecision && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              px: 0.75,
              py: 0.4,
              borderRadius: '6px',
              background: `linear-gradient(135deg, ${componentColors.accents.cyan}12 0%, ${componentColors.accents.cyan}06 100%)`,
              border: `1px solid ${componentColors.accents.cyan}18`,
              transition: 'all 0.15s ease',
              '&:hover': { background: `linear-gradient(135deg, ${componentColors.accents.cyan}18 0%, ${componentColors.accents.cyan}10 100%)` },
            }}
          >
            <Box sx={{ width: 5, height: 5, borderRadius: '50%', background: componentColors.accents.cyan, flexShrink: 0 }} />
            <PrecisionIcon sx={{ fontSize: 11, color: componentColors.accents.cyan }} />
            <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: '#2A3547' }}>{geoPrecision}</Typography>
          </Box>
        )}
        {hasSourceUrl && (
          <Box
            component="a"
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              px: 0.75,
              py: 0.4,
              borderRadius: '6px',
              background: `linear-gradient(135deg, ${componentColors.accents.emerald}12 0%, ${componentColors.accents.emerald}06 100%)`,
              border: `1px solid ${componentColors.accents.emerald}18`,
              textDecoration: 'none',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              '&:hover': {
                background: `linear-gradient(135deg, ${componentColors.accents.emerald}20 0%, ${componentColors.accents.emerald}12 100%)`,
              },
            }}
          >
            <Box sx={{ width: 5, height: 5, borderRadius: '50%', background: componentColors.accents.emerald, flexShrink: 0 }} />
            <LinkIcon sx={{ fontSize: 11, color: componentColors.accents.emerald }} />
            <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: '#2A3547' }}>View Source</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
});

// Extended Targets Card - Compact design
const ExtendedTargetsCard = React.memo(({ selectedEvent }) => {
  const targetObjects = selectedEvent?.targets_target_objects;
  const targetSubSector = selectedEvent?.targets_target_sub_sector;

  const hasTargetObjects = hasValidData(targetObjects);
  const hasTargetSubSector = hasValidData(targetSubSector);
  const hasData = hasTargetObjects || hasTargetSubSector;

  if (!hasData) return null;

  const accentColor = componentColors.accents.violet || '#8b5cf6';

  return (
    <Box
      sx={{
        flex: 1,
        background: componentColors.white,
        borderRadius: '10px',
        border: `1px solid ${accentColor}18`,
        boxShadow: `0 2px 8px ${accentColor}08`,
        overflow: 'hidden',
        transition: 'all 0.2s ease',
        '&:hover': { transform: 'translateY(-2px)', boxShadow: `0 4px 12px ${accentColor}12` },
      }}
    >
      {/* Header */}
      <Box sx={{ px: 1, py: 0.6, display: 'flex', alignItems: 'center', gap: 0.6, background: `linear-gradient(180deg, ${accentColor}08 0%, transparent 100%)` }}>
        <Box sx={{ width: 22, height: 22, borderRadius: '6px', background: `linear-gradient(135deg, ${accentColor} 0%, ${accentColor}CC 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <PersonIcon sx={{ color: componentColors.white, fontSize: 12 }} />
        </Box>
        <Typography sx={sectionTitleStyle}>Target Details</Typography>
      </Box>
      {/* Content - Compact */}
      <Box sx={{ px: 1, py: 0.6, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        {hasTargetObjects && (
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.5, px: 0.8, py: 0.4, borderRadius: '6px', background: `${accentColor}10`, border: `1px solid ${accentColor}15` }}>
            <Box sx={{ width: 6, height: 6, borderRadius: '50%', background: accentColor, flexShrink: 0, mt: 0.5 }} />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Target Objects</Typography>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#2A3547', lineHeight: 1.3, wordBreak: 'break-word' }}>{targetObjects}</Typography>
            </Box>
          </Box>
        )}
        {hasTargetSubSector && (
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.5, px: 0.8, py: 0.4, borderRadius: '6px', background: `${componentColors.accents.indigo}10`, border: `1px solid ${componentColors.accents.indigo}15` }}>
            <Box sx={{ width: 6, height: 6, borderRadius: '50%', background: componentColors.accents.indigo, flexShrink: 0, mt: 0.5 }} />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Target Sub-Sector</Typography>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#2A3547', lineHeight: 1.3, wordBreak: 'break-word' }}>{targetSubSector}</Typography>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
});

// Organizations Card - Display subGroups with clickable organization labels
const OrganizationsCard = React.memo(({ selectedEvent, onOrgClick }) => {
  const subGroups = selectedEvent?.subGroups || [];
  const hasData = hasValidData(subGroups);

  // Theme colors - using indigo as primary
  const primaryColor = hasData ? componentColors.indigo[500] : '#94a3b8';
  const primaryDark = hasData ? componentColors.indigo[600] : '#64748b';

  return (
    <Box
      sx={{
        flex: { xs: 1, md: '0 0 35%' },
        minWidth: { xs: '100%', md: 'auto' },
        width: { md: '35%' },
        background: hasData ? '#FFFFFF' : '#f8fafc',
        borderRadius: '12px',
        border: `1px solid ${hasData ? `${componentColors.indigo[500]}20` : '#e2e8f0'}`,
        boxShadow: hasData ? `0 2px 12px ${componentColors.indigo[500]}12` : '0 2px 8px rgba(0,0,0,0.04)',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        opacity: hasData ? 1 : 0.7,
        '&:hover': hasData ? {
          transform: 'translateY(-2px)',
          boxShadow: `0 6px 20px ${componentColors.indigo[500]}18`
        } : {},
      }}
    >
      {/* Animated Top Border */}
      <Box sx={{
        height: '3px',
        background: hasData
          ? `linear-gradient(90deg, ${componentColors.indigo[500]} 0%, ${componentColors.indigo[300]} 40%, ${componentColors.indigo[200]} 70%, ${componentColors.indigo[500]} 100%)`
          : 'linear-gradient(90deg, #94a3b8 0%, #94a3b8CC 40%, #94a3b880 70%, #94a3b8 100%)',
        backgroundSize: '200% 100%',
        animation: hasData ? 'shimmer 3s ease-in-out infinite' : 'none',
        ...shimmerAnimation,
      }} />

      {/* Header */}
      <Box sx={{
        px: 1.25,
        py: 0.75,
        display: 'flex',
        alignItems: 'center',
        gap: 0.75,
        background: hasData
          ? `linear-gradient(180deg, ${componentColors.indigo[500]}0A 0%, transparent 100%)`
          : 'linear-gradient(180deg, rgba(148, 163, 184, 0.06) 0%, transparent 100%)',
        borderBottom: `1px solid ${hasData ? `${componentColors.indigo[500]}12` : '#e2e8f0'}`,
        flexShrink: 0,
      }}>
        <Box sx={{
          width: 24,
          height: 24,
          borderRadius: '6px',
          background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryDark} 100%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: hasData ? `0 2px 6px ${componentColors.indigo[500]}50` : '0 2px 6px rgba(148, 163, 184, 0.3)'
        }}>
          <BusinessIcon sx={{ color: 'white', fontSize: 14 }} />
        </Box>
        <Typography sx={sectionTitleStyle}>Related Organizations</Typography>
        {hasData && (
          <Box sx={{
            ml: 'auto',
            px: 0.75,
            py: 0.25,
            borderRadius: '4px',
            background: `${componentColors.indigo[500]}15`,
            border: `1px solid ${componentColors.indigo[500]}25`,
          }}>
            <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: componentColors.indigo[500] }}>{subGroups.length}</Typography>
          </Box>
        )}
      </Box>

      {/* Content */}
      <Box sx={{
        flex: 1,
        overflowY: 'auto',
        px: 1,
        py: 0.75,
        minHeight: '100px',
        '&::-webkit-scrollbar': { width: '4px' },
        '&::-webkit-scrollbar-track': { background: '#f1f5f9', borderRadius: '2px' },
        '&::-webkit-scrollbar-thumb': {
          background: `linear-gradient(180deg, ${componentColors.indigo[500]}60 0%, ${componentColors.indigo[500]}40 100%)`,
          borderRadius: '2px',
        },
      }}>
        {hasData ? (
          subGroups.map((org, index) => {
            const orgId = org.id || org.entity_id;
            const label = org.label || org.name || 'Unknown';
            const isClickable = orgId && label !== "nan";

            return (
              <Box
                key={orgId || index}
                onClick={() => isClickable && onOrgClick(orgId)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.75,
                  px: 1,
                  py: 0.6,
                  mb: 0.5,
                  borderRadius: '8px',
                  background: `linear-gradient(135deg, ${componentColors.indigo[50]}80 0%, ${componentColors.indigo[50]}40 100%)`,
                  border: `1px solid ${componentColors.indigo[200]}60`,
                  cursor: isClickable ? 'pointer' : 'default',
                  transition: 'all 0.2s ease',
                  '&:hover': isClickable ? {
                    background: `linear-gradient(135deg, ${componentColors.indigo[100]} 0%, ${componentColors.indigo[50]} 100%)`,
                    borderColor: componentColors.indigo[300],
                    transform: 'translateX(2px)',
                  } : {},
                }}
              >
                <Box sx={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: isClickable
                    ? `linear-gradient(135deg, ${componentColors.indigo[500]} 0%, ${componentColors.indigo[400]} 100%)`
                    : '#94a3b8',
                  boxShadow: isClickable ? `0 0 6px ${componentColors.indigo[500]}60` : 'none',
                  flexShrink: 0,
                }} />
                <Typography
                  sx={{
                    flex: 1,
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: isClickable ? componentColors.indigo[700] : '#94a3b8',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {label !== "nan" ? label : 'Unknown'}
                </Typography>
                {isClickable && (
                  <KeyboardArrowRightIcon sx={{ fontSize: '1rem', color: componentColors.indigo[400] }} />
                )}
              </Box>
            );
          })
        ) : (
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            py: 2.5,
            height: '100%',
          }}>
            <BusinessIcon sx={{ fontSize: 28, color: '#94a3b8', mb: 1, opacity: 0.5 }} />
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: '#94a3b8', fontStyle: 'italic', textAlign: 'center' }}>
              No organizations data available
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
});

// Related Equipment Card - Display subGroups2 with clickable equipment labels (opens new tab)
const RelatedEquipmentCard = React.memo(({ selectedEvent }) => {
  const subGroups2 = selectedEvent?.subGroups2 || [];
  const hasData = hasValidData(subGroups2);

  // Theme colors - using cyan as primary
  const primaryColor = hasData ? componentColors.cyan[500] : '#94a3b8';
  const primaryDark = hasData ? componentColors.cyan[600] : '#64748b';

  const handleEquipmentClick = (equipmentId, label) => {
    // Store the equipment label in sessionStorage for the searchbox to display
    if (label) {
      sessionStorage.setItem('pendingEquipmentLabel', label);
    }
    openEquipmentInNewTab(equipmentId);
  };

  return (
    <Box
      sx={{
        flex: { xs: 1, md: '0 0 35%' },
        minWidth: { xs: '100%', md: 'auto' },
        width: { md: '35%' },
        background: hasData ? '#FFFFFF' : '#f8fafc',
        borderRadius: '12px',
        border: `1px solid ${hasData ? `${componentColors.cyan[500]}20` : '#e2e8f0'}`,
        boxShadow: hasData ? `0 2px 12px ${componentColors.cyan[500]}12` : '0 2px 8px rgba(0,0,0,0.04)',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        opacity: hasData ? 1 : 0.7,
        '&:hover': hasData ? {
          transform: 'translateY(-2px)',
          boxShadow: `0 6px 20px ${componentColors.cyan[500]}18`
        } : {},
      }}
    >
      {/* Animated Top Border */}
      <Box sx={{
        height: '3px',
        background: hasData
          ? `linear-gradient(90deg, ${componentColors.cyan[500]} 0%, ${componentColors.cyan[300]} 40%, ${componentColors.cyan[200]} 70%, ${componentColors.cyan[500]} 100%)`
          : 'linear-gradient(90deg, #94a3b8 0%, #94a3b8CC 40%, #94a3b880 70%, #94a3b8 100%)',
        backgroundSize: '200% 100%',
        animation: hasData ? 'shimmer 3s ease-in-out infinite' : 'none',
        ...shimmerAnimation,
      }} />

      {/* Header */}
      <Box sx={{
        px: 1.25,
        py: 0.75,
        display: 'flex',
        alignItems: 'center',
        gap: 0.75,
        background: hasData
          ? `linear-gradient(180deg, ${componentColors.cyan[500]}0A 0%, transparent 100%)`
          : 'linear-gradient(180deg, rgba(148, 163, 184, 0.06) 0%, transparent 100%)',
        borderBottom: `1px solid ${hasData ? `${componentColors.cyan[500]}12` : '#e2e8f0'}`,
        flexShrink: 0,
      }}>
        <Box sx={{
          width: 24,
          height: 24,
          borderRadius: '6px',
          background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryDark} 100%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: hasData ? `0 2px 6px ${componentColors.cyan[500]}50` : '0 2px 6px rgba(148, 163, 184, 0.3)'
        }}>
          <RocketLaunchIcon sx={{ color: 'white', fontSize: 14 }} />
        </Box>
        <Typography sx={sectionTitleStyle}>Related Equipment</Typography>
        {hasData && (
          <Box sx={{
            ml: 'auto',
            px: 0.75,
            py: 0.25,
            borderRadius: '4px',
            background: `${componentColors.cyan[500]}15`,
            border: `1px solid ${componentColors.cyan[500]}25`,
          }}>
            <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: componentColors.cyan[500] }}>{subGroups2.length}</Typography>
          </Box>
        )}
      </Box>

      {/* Content */}
      <Box sx={{
        flex: 1,
        overflowY: 'auto',
        px: 1,
        py: 0.75,
        minHeight: '100px',
        '&::-webkit-scrollbar': { width: '4px' },
        '&::-webkit-scrollbar-track': { background: '#f1f5f9', borderRadius: '2px' },
        '&::-webkit-scrollbar-thumb': {
          background: `linear-gradient(180deg, ${componentColors.cyan[500]}60 0%, ${componentColors.cyan[500]}40 100%)`,
          borderRadius: '2px',
        },
      }}>
        {hasData ? (
          subGroups2.map((equipment, index) => {
            const equipmentId = equipment.id || equipment.entity_id;
            const label = equipment.label || equipment.name || 'Unknown';
            const isClickable = equipmentId && label !== "nan";

            return (
              <Box
                key={equipmentId || index}
                onClick={() => isClickable && handleEquipmentClick(equipmentId, label)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.75,
                  px: 1,
                  py: 0.6,
                  mb: 0.5,
                  borderRadius: '8px',
                  background: `linear-gradient(135deg, ${componentColors.cyan[50]}80 0%, ${componentColors.cyan[50]}40 100%)`,
                  border: `1px solid ${componentColors.cyan[200]}60`,
                  cursor: isClickable ? 'pointer' : 'default',
                  transition: 'all 0.2s ease',
                  '&:hover': isClickable ? {
                    background: `linear-gradient(135deg, ${componentColors.cyan[100]} 0%, ${componentColors.cyan[50]} 100%)`,
                    borderColor: componentColors.cyan[300],
                    transform: 'translateX(2px)',
                  } : {},
                }}
              >
                <Box sx={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: isClickable
                    ? `linear-gradient(135deg, ${componentColors.cyan[500]} 0%, ${componentColors.cyan[400]} 100%)`
                    : '#94a3b8',
                  boxShadow: isClickable ? `0 0 6px ${componentColors.cyan[500]}60` : 'none',
                  flexShrink: 0,
                }} />
                <Typography
                  sx={{
                    flex: 1,
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: isClickable ? componentColors.cyan[700] : '#94a3b8',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {label !== "nan" ? label : 'Unknown'}
                </Typography>
                {isClickable && (
                  <KeyboardArrowRightIcon sx={{ fontSize: '1rem', color: componentColors.cyan[400] }} />
                )}
              </Box>
            );
          })
        ) : (
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            py: 2.5,
            height: '100%',
          }}>
            <RocketLaunchIcon sx={{ fontSize: 28, color: '#94a3b8', mb: 1, opacity: 0.5 }} />
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: '#94a3b8', fontStyle: 'italic', textAlign: 'center' }}>
              No equipment data available
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
});

// ============================================
// UNIFIED CONTENT SECTION (replaces duplicate JTIC/OFM/Military sections)
// ============================================

// Unified Content Section - Single component for all category types
const EventContentSection = React.memo(({ categoryType, selectedEvent, onOrgClick }) => (
  <>
    {/* Provenance Section - Only for OFM */}
    {categoryType === CATEGORY_TYPES.OFM && (
      <SectionPanel
        title="Provenance"
        icon={<SourceIcon sx={{ color: 'white', fontSize: 20 }} />}
        accentColor="#5D87FF"
      >
        <EventProvenanceType />
      </SectionPanel>
    )}

    {/* Participants & Organizations & Related Equipment Row */}
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 1.5, mb: 2 }}>
      <ParticipantsCard categoryType={categoryType} selectedEvent={selectedEvent} />
      <OrganizationsCard selectedEvent={selectedEvent} onOrgClick={onOrgClick} />
      <RelatedEquipmentCard selectedEvent={selectedEvent} />
    </Box>

    {/* Casualties & Platforms/Weapons Row */}
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 1.5, mb: 2 }}>
      <CasualtiesCard selectedEvent={selectedEvent} />
      <PlatformsWeaponsCard selectedEvent={selectedEvent} />
      <ExtendedTargetsCard selectedEvent={selectedEvent} />
    </Box>

    {/* Environment & Source Row */}
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 1.5, mb: 2 }}>
      <EnvironmentCard selectedEvent={selectedEvent} />
      <SourceInfoCard selectedEvent={selectedEvent} />
    </Box>
  </>
));

// ============================================
// EVENT OVERVIEW ROW - Category-specific date fields
// ============================================

// Map View Button - Exact match to MilitaryGroup ProfileActionButton
const MapViewButton = React.memo(({ showMap, onToggle, hasLocationData }) => {
  // Styles matching MilitaryGroup's getProfileButtonStyles for map type
  const getStyles = () => {
    if (!hasLocationData) {
      return {
        background: 'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)',
        hoverBackground: 'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)',
        border: '1px solid rgba(148, 163, 184, 0.4)',
        boxShadow: '0 4px 16px rgba(148, 163, 184, 0.2)',
        hoverBoxShadow: '0 4px 16px rgba(148, 163, 184, 0.2)',
        iconBg: 'rgba(255, 255, 255, 0.2)',
        textColor: '#ffffff',
      };
    }
    if (showMap) {
      // mapActive style
      return {
        background: 'linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)',
        hoverBackground: 'linear-gradient(135deg, #4338ca 0%, #3730a3 100%)',
        border: '1px solid rgba(67, 56, 202, 0.5)',
        boxShadow: '0 4px 16px rgba(67, 56, 202, 0.4), inset 0 0 12px rgba(255, 255, 255, 0.1)',
        hoverBoxShadow: '0 12px 32px rgba(67, 56, 202, 0.5)',
        iconBg: 'rgba(255, 255, 255, 0.3)',
        textColor: '#ffffff',
      };
    }
    // map style (inactive)
    return {
      background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
      hoverBackground: 'linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)',
      border: '1px solid rgba(79, 70, 229, 0.4)',
      boxShadow: '0 4px 16px rgba(79, 70, 229, 0.3)',
      hoverBoxShadow: '0 12px 32px rgba(79, 70, 229, 0.45)',
      iconBg: 'rgba(255, 255, 255, 0.25)',
      textColor: '#ffffff',
    };
  };

  const styles = getStyles();

  return (
    <Box
      onClick={hasLocationData ? onToggle : undefined}
      sx={{
        width: '90px',
        height: '80px',
        borderRadius: '12px',
        background: styles.background,
        border: styles.border,
        boxShadow: styles.boxShadow,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: hasLocationData ? 'pointer' : 'not-allowed',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        opacity: hasLocationData ? 1 : 0.6,
        flexShrink: 0,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(180deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 50%)',
          pointerEvents: 'none',
        },
        '&:hover': hasLocationData ? {
          transform: 'translateY(-3px) scale(1.03)',
          boxShadow: styles.hoverBoxShadow,
          background: styles.hoverBackground,
        } : {},
        '&:active': hasLocationData ? {
          transform: 'translateY(-1px) scale(1.01)',
        } : {},
      }}
    >
      {/* Icon Container */}
      <Box
        sx={{
          width: 34,
          height: 34,
          borderRadius: '10px',
          background: styles.iconBg,
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 0.75,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
        }}
      >
        <MapIcon sx={{ fontSize: '18px', color: styles.textColor, filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))' }} />
      </Box>
      {/* Label */}
      <Typography
        sx={{
          fontSize: '0.65rem',
          fontWeight: 700,
          color: styles.textColor,
          textAlign: 'center',
          lineHeight: 1.2,
          textShadow: '0 1px 2px rgba(0,0,0,0.2)',
        }}
      >
        {showMap ? 'Hide Map' : 'Map View'}
      </Typography>
      {/* Active indicator for Map View */}
      {showMap && hasLocationData && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 4,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 20,
            height: 3,
            borderRadius: '2px',
            background: 'rgba(255,255,255,0.8)',
          }}
        />
      )}
    </Box>
  );
});

const EventOverviewRow = React.memo(({ categoryType, selectedEvent, showMap, onToggleMap }) => {
  const accentColor = categoryType === CATEGORY_TYPES.OFM ? '#0ea5e9' :
                      categoryType === CATEGORY_TYPES.MILITARY ? '#6366f1' : '#3b82f6';

  // Check date data availability using shared helper
  const hasStartDate = hasValidData(selectedEvent?.start_date);
  const hasEndDate = hasValidData(selectedEvent?.end_date);
  const hasReportedDate = hasValidData(selectedEvent?.reported_date);

  // Check if location data is available using shared helper
  const eventHasLocation = hasLocationData(selectedEvent);

  return (
    <Box
      sx={{
        mb: 2,
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        gap: 1,
        alignItems: 'stretch',
      }}
    >
      {/* Event Label Box */}
      <EventLabelBox accentColor={accentColor} selectedEvent={selectedEvent} />

      {/* Country Box */}
      <CountryInfoBox accentColor="#3b82f6" showLabel={true} selectedEvent={selectedEvent} />

      {/* Date Fields - Based on category */}
      {categoryType === CATEGORY_TYPES.OFM ? (
        // OFM: Only Reported Date
        <DateInfoBox label="Reported Date" accentColor="#0ea5e9" hasData={hasReportedDate}>
          <EventReportedDate />
        </DateInfoBox>
      ) : (
        // JTIC & Military: Start and End Date
        <>
          <DateInfoBox label={categoryType === CATEGORY_TYPES.MILITARY ? "Start Date" : null} accentColor="#0ea5e9" hasData={hasStartDate}>
            <EventStartDate />
          </DateInfoBox>
          <DateInfoBox label={categoryType === CATEGORY_TYPES.MILITARY ? "End Date" : null} accentColor="#6366f1" hasData={hasEndDate}>
            <EventEndDate />
          </DateInfoBox>
        </>
      )}

      {/* Map View Button - Next to End Date */}
      <MapViewButton
        showMap={showMap}
        onToggle={onToggleMap}
        hasLocationData={eventHasLocation}
      />
    </Box>
  );
});

// ============================================
// UNIFIED EVENT LAYOUT
// ============================================

const EventLayout = React.memo(({ categoryType }) => {
  const { selectedEvent } = React.useContext(EventContext);

  // Map section state - local state like MilitaryGroup
  const [showMapSection, setShowMapSection] = React.useState(false);

  // Organization modal state - for displaying organization profile
  const [openOrgModal, setOpenOrgModal] = React.useState(false);
  const [selectedOrgId, setSelectedOrgId] = React.useState(null);

  // Handle toggling Map View section
  const handleToggleMapView = () => {
    setShowMapSection(prev => !prev);
  };

  // Handle organization click - open modal with selected org ID
  const handleOrgClick = React.useCallback((orgId) => {
    if (!orgId) return;
    setSelectedOrgId(orgId);
    setOpenOrgModal(true);
  }, []);

  // Get accent colors based on category (blue-themed)
  const getDescriptionColor = () => {
    switch (categoryType) {
      case CATEGORY_TYPES.OFM: return '#0ea5e9';
      case CATEGORY_TYPES.MILITARY: return '#6366f1';
      default: return '#3b82f6';
    }
  };

  const mapColor = componentColors.blue[500];

  // Check if location data is available using shared helper
  const eventHasLocation = hasLocationData(selectedEvent);

  return (
    <PageContainer title="Event" description="Event Profile">
      <PageWrapper>
        {/* Single Premium Header */}
        <PremiumHeader />

        {/* Last Updated Note - Same as MilitaryGroupCard */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            mb: 1,
            px: 0.5,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.75,
              px: 1.5,
              py: 0.6,
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
              border: '1px solid #bbf7d0',
              boxShadow: '0 1px 3px rgba(22, 163, 74, 0.08)',
            }}
          >
            <AccessTimeIcon sx={{ fontSize: '0.9rem', color: '#16a34a' }} />
            <Typography
              sx={{
                fontSize: '0.8rem',
                color: '#15803d',
                fontWeight: 600,
              }}
            >
              Last Updated:
            </Typography>
            <Typography
              sx={{
                fontSize: '0.8rem',
                color: '#166534',
                fontWeight: 700,
              }}
            >
              {formatDateTime(selectedEvent?.last_modified_date)}
            </Typography>
          </Box>
        </Box>

        {/* Event Overview Row - with Map View button */}
        <EventOverviewRow
          categoryType={categoryType}
          selectedEvent={selectedEvent}
          showMap={showMapSection}
          onToggleMap={handleToggleMapView}
        />

        {/* Map Section - Collapsible (similar to MilitaryGroup) */}
        <Collapse in={showMapSection && eventHasLocation}>
          <Box
            sx={{
              mb: 2,
              background: '#FFFFFF',
              borderRadius: '16px',
              border: `1px solid ${mapColor}20`,
              boxShadow: `0 4px 24px ${mapColor}12`,
              overflow: 'hidden',
              transition: 'all 0.3s ease',
            }}
          >
            {/* Map Header */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                px: 2,
                py: 1.25,
                background: `linear-gradient(135deg, ${mapColor}08 0%, ${mapColor}03 100%)`,
                borderBottom: `1px solid ${mapColor}15`,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: '10px',
                    background: `linear-gradient(135deg, ${mapColor} 0%, ${componentColors.blue[600]} 100%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: `0 3px 10px ${mapColor}40`,
                  }}
                >
                  <MapIcon sx={{ fontSize: '1.125rem', color: '#fff' }} />
                </Box>
                <Box>
                  <Typography sx={{ fontSize: '0.875rem', fontWeight: 700, color: componentColors.gray[800], lineHeight: 1.3 }}>
                    Event Location
                  </Typography>
                  <Typography sx={{ fontSize: '0.6875rem', fontWeight: 500, color: componentColors.gray[500], lineHeight: 1.3 }}>
                    Geographic visualization
                  </Typography>
                </Box>
              </Box>
              <IconButton
                onClick={handleToggleMapView}
                size="small"
                sx={{
                  color: mapColor,
                  bgcolor: `${mapColor}10`,
                  border: `1px solid ${mapColor}20`,
                  '&:hover': { bgcolor: `${mapColor}20`, transform: 'scale(1.05)' },
                }}
              >
                <CloseIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Box>

            {/* Map Container */}
            <Box sx={{ height: '350px' }}>
              <Suspense fallback={<SectionLoader icon={LocationIcon} message="Loading map..." accentColor={mapColor} height="350px" />}>
                <MapComponent enabledLayers={['events']} />
              </Suspense>
            </Box>
          </Box>
        </Collapse>

        {/* Main Dashboard Content */}
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          {/* Classification & Description Row with Event Metrics */}
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 1.5, mb: 2 }}>
            <ClassificationCard accentColor="#6366f1" selectedEvent={selectedEvent} />
            <DescriptionCard accentColor={getDescriptionColor()} selectedEvent={selectedEvent} />
            <EventMetricsCard categoryType={categoryType} selectedEvent={selectedEvent} />
          </Box>

          {/* Unified content section for all category types */}
          <EventContentSection
            categoryType={categoryType}
            selectedEvent={selectedEvent}
            onOrgClick={handleOrgClick}
          />
        </Box>

        {/* Organization Profile Modal - Same pattern as EquipmentCard */}
        <Modal
          open={openOrgModal}
          onClose={() => {
            setOpenOrgModal(false);
            setSelectedOrgId(null);
          }}
          closeAfterTransition
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            '& .MuiBackdrop-root': {
              backgroundColor: 'rgba(15, 23, 42, 0.5)',
              backdropFilter: 'blur(4px)',
            },
          }}
        >
          <Box
            sx={{
              position: 'relative',
              width: { xs: '95%', sm: '94%', md: '1150px' },
              minWidth: '360px',
              maxWidth: '95vw',
              maxHeight: '90vh',
              background: '#ffffff',
              borderRadius: '16px',
              boxShadow: '0 25px 60px rgba(15, 23, 42, 0.25), 0 10px 30px rgba(99, 102, 241, 0.15)',
              overflow: 'hidden',
              outline: 'none',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Premium Header */}
            <Box
              sx={{
                px: 2.5,
                py: 1.5,
                background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #818cf8 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexShrink: 0,
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'radial-gradient(ellipse at top right, rgba(255,255,255,0.15) 0%, transparent 60%)',
                  pointerEvents: 'none',
                },
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '1px',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, position: 'relative', zIndex: 1 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(8px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                  }}
                >
                  <BusinessIcon sx={{ fontSize: '1.25rem', color: '#ffffff' }} />
                </Box>
                <Box>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: '1.05rem',
                      color: '#ffffff',
                      letterSpacing: '-0.01em',
                      textShadow: '0 1px 2px rgba(0,0,0,0.1)',
                    }}
                  >
                    Organization Profile
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 0.25 }}>
                    <Box sx={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: '#4ade80',
                      boxShadow: '0 0 6px rgba(74, 222, 128, 0.6)',
                    }} />
                    <Typography
                      sx={{
                        fontSize: '0.725rem',
                        fontWeight: 500,
                        color: 'rgba(255, 255, 255, 0.8)',
                      }}
                    >
                      Organization Details
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <Box
                onClick={() => {
                  setOpenOrgModal(false);
                  setSelectedOrgId(null);
                }}
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  background: 'rgba(255, 255, 255, 0.15)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  position: 'relative',
                  zIndex: 1,
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.25)',
                    transform: 'scale(1.05)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  }
                }}
              >
                <CloseIcon sx={{ fontSize: '1rem', color: '#ffffff' }} />
              </Box>
            </Box>

            {/* Content Area */}
            <Box
              sx={{
                flex: 1,
                overflowY: 'auto',
                overflowX: 'hidden',
                background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)',
                '&::-webkit-scrollbar': { width: '8px' },
                '&::-webkit-scrollbar-track': {
                  bgcolor: 'rgba(99, 102, 241, 0.05)',
                  borderRadius: '4px',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: 'linear-gradient(180deg, #a5b4fc 0%, #818cf8 100%)',
                  borderRadius: '4px',
                  '&:hover': {
                    background: 'linear-gradient(180deg, #818cf8 0%, #6366f1 100%)',
                  },
                },
              }}
            >
              <OrganizationProfileCard
                selectedOrgId={selectedOrgId}
                isModal={true}
              />
            </Box>
          </Box>
        </Modal>
      </PageWrapper>
    </PageContainer>
  );
});

// ============================================
// EMPTY/NO DATA STATES
// ============================================

const EmptyStateCard = React.memo(({ title, description }) => (
  <Box
    sx={{
      background: componentColors.white,
      borderRadius: tokens.borderRadius.xl,
      boxShadow: shadowStyles.md,
      border: `1px solid ${componentColors.accents.blue}14`,
      p: 8,
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: componentGradients.events.blue,
      },
    }}
  >
    <Box
      sx={{
        width: 90,
        height: 90,
        borderRadius: '50%',
        background: `linear-gradient(135deg, ${componentColors.accents.blue}1A 0%, ${componentColors.accents.cyan}0D 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 24px',
        border: `2px solid ${componentColors.accents.blue}33`,
      }}
    >
      <EventIcon sx={{ fontSize: 45, color: componentColors.accents.blue }} />
    </Box>
    <Typography variant="h6" sx={{ color: componentColors.text.primary, fontWeight: 700, mb: 1 }}>
      {title}
    </Typography>
    <Typography sx={{ color: componentColors.text.muted, fontSize: '0.9rem', maxWidth: '400px', mx: 'auto' }}>
      {description}
    </Typography>
  </Box>
));

const EmptyStateLayout = React.memo(({ title, description }) => (
  <PageContainer title="Event" description="Event Profile">
    <PageWrapper>
      <PremiumHeader />
      <EmptyStateCard title={title} description={description} />
    </PageWrapper>
  </PageContainer>
));

// ============================================
// MAIN COMPONENT
// ============================================

// Loading Skeleton Component for Initial Page Load
const LoadingStateLayout = React.memo(() => (
  <PageContainer title="Event" description="Event Profile">
    <PageWrapper>
      <PremiumHeader />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '400px',
          background: componentColors.white,
          borderRadius: tokens.borderRadius.xl,
          boxShadow: shadowStyles.md,
          border: `1px solid ${componentColors.accents.blue}14`,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: componentGradients.events.blue,
          },
        }}
      >
        {/* Animated Loading Spinner */}
        <Box
          sx={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            border: '3px solid rgba(93, 135, 255, 0.1)',
            borderTopColor: componentColors.accents.blue,
            animation: 'spin 1s linear infinite',
            mb: 3,
            '@keyframes spin': {
              '0%': { transform: 'rotate(0deg)' },
              '100%': { transform: 'rotate(360deg)' },
            },
          }}
        />
        <Typography
          sx={{
            color: componentColors.text.primary,
            fontWeight: 600,
            fontSize: '1rem',
            mb: 1,
          }}
        >
          Loading Event Data...
        </Typography>
        <Typography
          sx={{
            color: componentColors.text.muted,
            fontSize: '0.85rem',
          }}
        >
          Please wait while we fetch the event information
        </Typography>
      </Box>
    </PageWrapper>
  </PageContainer>
));

export default function EventCard() {
  // ALL BUSINESS LOGIC PRESERVED
  const {
    selectedEvent,
    jticEventCategories,
    ofmEventCategories,
    milEventCategories,
    querying,
    eventsList,
    eventsListLoading
  } = React.useContext(EventContext);

  // Note: External navigation is now handled entirely by EventSearchBox via URL params
  // This component is purely for rendering - no API calls here

  const [hasQueriedBefore, setHasQueriedBefore] = React.useState(false);

  // Track if user has queried before
  React.useEffect(() => {
    if (querying || selectedEvent || (eventsList && eventsList.length > 0)) {
      setHasQueriedBefore(true);
    }
  }, [querying, selectedEvent, eventsList]);

  // Determine category type - with fallback to MILITARY for unknown categories
  const getCategoryType = () => {
    if (!selectedEvent) return null;

    const category = selectedEvent.event_category;
    if (!category) {
      // No category - default to MILITARY layout which has the most generic structure
      return CATEGORY_TYPES.MILITARY;
    }

    if (jticEventCategories.includes(category)) return CATEGORY_TYPES.JTIC;
    if (ofmEventCategories.includes(category)) return CATEGORY_TYPES.OFM;
    if (milEventCategories.includes(category)) return CATEGORY_TYPES.MILITARY;

    // Unknown category - default to MILITARY layout for general events
    return CATEGORY_TYPES.MILITARY;
  };

  const categoryType = getCategoryType();

  // Show loading state while fetching initial events list or querying event profile
  if ((eventsListLoading || querying) && !selectedEvent) {
    return <LoadingStateLayout />;
  }

  // No Data State - when no event selected and user has interacted before
  if (!querying && !selectedEvent && hasQueriedBefore) {
    return (
      <EmptyStateLayout
        title="No Event Data Available"
        description="No event data available for this category. Use the search box above to find events."
      />
    );
  }

  // Main Content - Unified layout with category-specific content
  if (selectedEvent && categoryType) {
    return (
      <EventLayout categoryType={categoryType} />
    );
  }

  // Default Empty State
  return (
    <EmptyStateLayout
      title="Select an Event"
      description="Use the search box above to find and display event information"
    />
  );
}
