import * as React from 'react';
import { Box, Grid, Stack, Typography, IconButton, Collapse, Modal, useTheme, Button, Table, TableBody, TableCell, TableContainer, TableRow, Tooltip } from '@mui/material';
import { EquipmentContext } from '../../context/EquipmentContext';
import { withOpacity } from '../../theme/palette';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FamilyIcon from '@mui/icons-material/FamilyRestroom';
import WorkIcon from '@mui/icons-material/Work';
import ClassificationIcon from '@mui/icons-material/Category';
import ArticleIcon from '@mui/icons-material/Article';
import InventoryIcon from '@mui/icons-material/Inventory';
import StraightenIcon from '@mui/icons-material/Straighten';
import SpeedIcon from '@mui/icons-material/Speed';
import CloseIcon from '@mui/icons-material/Close';
import PublicIcon from '@mui/icons-material/Public';
import TuneIcon from '@mui/icons-material/Tune';
import EquipmentImages from './EquipmentImages';
import EquipmentManufacturedBy from './EquipmentManufacturedBy';
import EquipmentOperatedBy from './EquipmentOperatedBy';
import EquipmentInventory from './EquipmentInventory';
import MapComponent from '../MapComponent';
import { queryAPI } from '../../utils/QueryGraph';
import BusinessIcon from "@mui/icons-material/Business";

const EquipmentInfoCard = ({ equipmentData = null, showMap = true }) => {
  const theme = useTheme();
  const {
    equipment: contextEquipment,
    setQuerying,
    setEquipmentProfile,
    setOpenModalEquipmentProfile,
  } = React.useContext(EquipmentContext);

  // Use equipmentData prop if provided, otherwise fall back to context equipment
  const equipment = equipmentData || contextEquipment;

  // State for collapsible sections
  const [manufacturedByExpanded, setManufacturedByExpanded] = React.useState(true);
  const [operatedByExpanded, setOperatedByExpanded] = React.useState(false);
  const [inventoryExpanded, setInventoryExpanded] = React.useState(false);
  const [measurementsModalOpen, setMeasurementsModalOpen] = React.useState(false);
  const [performanceModalOpen, setPerformanceModalOpen] = React.useState(false);
  const [attributesModalOpen, setAttributesModalOpen] = React.useState(false);
  const [inventoryCount, setInventoryCount] = React.useState(0);

  const queryProfile = () => {
    setOpenModalEquipmentProfile(true);
    setQuerying(true);
    queryAPI("news_profile", equipment.id, null, undefined, "equipment")
      .then((res) => {
        setQuerying(false);
        const items = res.resultRows.map(a => ({ ...a[0].properties }));
        setEquipmentProfile(items);
      });
  };

  if (!equipment) return null;

  return (
    <Box>
      {/* Equipment Images and Details */}
      {/* Equipment Details Card - Professional Design */}

      {/* Equipment Images and Details - Minimal */}
      <Box sx={{ mb: 3 }}>
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            flexWrap: 'wrap',
            alignItems: 'stretch',
          }}
        >
          {/* Left Side - Equipment Images (Main Focus) */}
          <Box
            sx={{
              flex: { xs: '1 1 100%', md: '1 1 calc(45% - 12px)' },
              minWidth: 0,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Box
              className="glass-card depth-3 hover-lift"
              sx={{
                background: theme.palette.mode === 'dark'
                  ? `linear-gradient(135deg, ${withOpacity(theme.palette.primary.dark, 0.15)} 0%, ${withOpacity(theme.palette.primary.main, 0.08)} 100%)`
                  : 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.95) 50%, rgba(239, 246, 255, 0.92) 100%)',
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                borderRadius: '16px',
                overflow: 'hidden',
                border: `1px solid ${withOpacity(theme.palette.primary[300], 0.2)}`,
                boxShadow: `
                    0 8px 32px -8px ${withOpacity(theme.palette.primary[500], 0.15)},
                    0 4px 16px -4px ${withOpacity(theme.palette.common.black, 0.08)},
                    inset 0 1px 1px 0 ${withOpacity(theme.palette.common.white, 0.9)},
                    inset 0 -1px 2px 0 ${withOpacity(theme.palette.primary[300], 0.08)}
                  `,
                height: '320px',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',

                '&:hover': {
                  boxShadow: `
                      0 16px 48px -8px ${withOpacity(theme.palette.primary[500], 0.25)},
                      0 8px 24px -4px ${withOpacity(theme.palette.common.black, 0.12)},
                      inset 0 1px 1px 0 ${withOpacity(theme.palette.common.white, 0.95)},
                      inset 0 -1px 2px 0 ${withOpacity(theme.palette.primary[300], 0.12)}
                    `,
                  transform: 'translateY(-6px)',
                  borderColor: withOpacity(theme.palette.primary[400], 0.35),
                },
              }}
            >
              <EquipmentImages />
            </Box>
          </Box>

          {/* Right Side - Equipment Family, Role & Type */}
          <Box
            sx={{
              flex: { xs: '1 1 100%', md: '1 1 calc(55% - 12px)' },
              minWidth: 0,
              display: 'flex',
              flexDirection: 'row',
              gap: 2,
              flexWrap: 'wrap',
            }}
          >
            {/* Equipment Family Box */}
            {(equipment.overall_family || (equipment.in_family && equipment.in_family !== "nan") ||
              (equipment.parent_equipment && equipment.parent_equipment !== "nan") ||
              (equipment.derived_from && equipment.derived_from !== "nan")) && (
                <Box
                  sx={{
                    flex: { xs: '1 1 100%', md: '1 1 calc(85% - 8px)' },
                    minWidth: 0,
                  }}
                >
                  <Box
                    // className="glass-card depth-2 hover-lift"
                    sx={{
                      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.95) 100%)',
                      backdropFilter: 'blur(20px) saturate(180%)',
                      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                      borderRadius: '14px',
                      p: 1.5,
                      border: '1px solid rgba(139, 92, 246, 0.2)',
                      boxShadow: `
                          0 6px 24px -4px rgba(139, 92, 246, 0.12),
                          0 3px 12px -2px rgba(0, 0, 0, 0.06),
                          inset 0 1px 0 rgba(255, 255, 255, 0.9),
                          inset 0 -1px 2px 0 rgba(139, 92, 246, 0.05)
                        `,
                      height: '115px',
                      display: 'flex',
                      flexDirection: 'column',
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        boxShadow: `
                            0 12px 36px -4px rgba(139, 92, 246, 0.18),
                            0 6px 18px -2px rgba(0, 0, 0, 0.08),
                            inset 0 1px 0 rgba(255, 255, 255, 0.95),
                            inset 0 -1px 2px 0 rgba(139, 92, 246, 0.08)
                          `,
                        borderColor: 'rgba(139, 92, 246, 0.35)',
                        transform: 'translateY(-4px)',
                      },
                      // '&::before': {
                      //   content: '""',
                      //   position: 'absolute',
                      //   top: 0,
                      //   left: 0,
                      //   right: 0,
                      //   height: '3px',
                      //   background: 'linear-gradient(90deg, transparent 0%, #8B5CF6 50%, transparent 100%)',
                      //   opacity: 0.7,
                      // },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.75, flexShrink: 0 }}>
                      <Box
                        sx={{
                          width: 22,
                          height: 22,
                          borderRadius: '6px',
                          background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 3px 10px rgba(139, 92, 246, 0.25)',
                        }}
                      >
                        <FamilyIcon sx={{ fontSize: '1rem', color: 'white' }} />
                      </Box>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: 700,
                          color: '#080f20ff',
                          fontSize: '0.85rem',
                          lineHeight: 1,
                        }}
                      >
                        Equipment Family
                      </Typography>
                    </Box>

                    <Box sx={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(4, 1fr)',
                      gap: 1,
                      flex: 1,
                      minHeight: 0,
                    }}>
                      {equipment.overall_family && (
                        <Box
                          className="stat-card hover-scale"
                          sx={{
                            px: 1.2,
                            py: 0.75,
                            borderRadius: '10px',
                            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(167, 139, 250, 0.06) 100%)',
                            border: '1px solid rgba(139, 92, 246, 0.25)',
                            position: 'relative',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            boxShadow: '0 2px 8px rgba(139, 92, 246, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.5)',
                            '&:hover': {
                              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(167, 139, 250, 0.1) 100%)',
                              borderColor: 'rgba(139, 92, 246, 0.45)',
                              transform: 'translateY(-3px) scale(1.03)',
                              boxShadow: '0 6px 16px rgba(139, 92, 246, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.7)',
                            },
                          }}
                        >
                          <Typography variant="caption" sx={{
                            color: '#002480ff',
                            fontSize: '0.65rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            fontWeight: 700,
                            display: 'block',
                            mb: 0.5,
                          }}>
                            Overall Family
                          </Typography>
                          <Typography variant="body2" sx={{
                            fontWeight: 600,
                            color: '#0F172A',
                            fontSize: '0.85rem',
                            lineHeight: 1.3,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}>
                            {equipment.overall_family}
                          </Typography>
                        </Box>
                      )}
                      {equipment.in_family && equipment.in_family !== "nan" && (
                        <Box
                          className="stat-card hover-scale"
                          sx={{
                            px: 1.2,
                            py: 0.75,
                            borderRadius: '10px',
                            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(96, 165, 250, 0.06) 100%)',
                            border: '1px solid rgba(59, 130, 246, 0.25)',
                            position: 'relative',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            boxShadow: '0 2px 8px rgba(59, 130, 246, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.5)',
                            '&:hover': {
                              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(96, 165, 250, 0.1) 100%)',
                              borderColor: 'rgba(59, 130, 246, 0.45)',
                              transform: 'translateY(-3px) scale(1.03)',
                              boxShadow: '0 6px 16px rgba(59, 130, 246, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.7)',
                            },
                          }}
                        >
                          <Typography variant="caption" sx={{
                            color: '#002480ff',
                            fontSize: '0.65rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            fontWeight: 700,
                            display: 'block',
                            mb: 0.5,
                          }}>
                            In Family
                          </Typography>
                          <Typography variant="body2" sx={{
                            fontWeight: 600,
                            color: '#0F172A',
                            fontSize: '0.85rem',
                            lineHeight: 1.3,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}>
                            {equipment.in_family}
                          </Typography>
                        </Box>
                      )}
                      {equipment.parent_equipment && equipment.parent_equipment !== "nan" && (
                        <Box
                          className="stat-card hover-scale"
                          sx={{
                            px: 1.2,
                            py: 0.75,
                            borderRadius: '10px',
                            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(52, 211, 153, 0.06) 100%)',
                            border: '1px solid rgba(16, 185, 129, 0.25)',
                            position: 'relative',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            boxShadow: '0 2px 8px rgba(16, 185, 129, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.5)',
                            '&:hover': {
                              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(52, 211, 153, 0.1) 100%)',
                              borderColor: 'rgba(16, 185, 129, 0.45)',
                              transform: 'translateY(-3px) scale(1.03)',
                              boxShadow: '0 6px 16px rgba(16, 185, 129, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.7)',
                            },
                          }}
                        >
                          <Typography variant="caption" sx={{
                            color: '#002480ff',
                            fontSize: '0.65rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            fontWeight: 700,
                            display: 'block',
                            mb: 0.5,
                          }}>
                            Parent Equipment
                          </Typography>
                          <Typography variant="body2" sx={{
                            fontWeight: 600,
                            color: '#0F172A',
                            fontSize: '0.85rem',
                            lineHeight: 1.3,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}>
                            {equipment.parent_equipment}
                          </Typography>
                        </Box>
                      )}
                      {equipment.derived_from && equipment.derived_from !== "nan" && (
                        <Box
                          className="stat-card hover-scale"
                          sx={{
                            px: 1.2,
                            py: 0.75,
                            borderRadius: '10px',
                            background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.1) 0%, rgba(244, 114, 182, 0.06) 100%)',
                            border: '1px solid rgba(236, 72, 153, 0.25)',
                            position: 'relative',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            boxShadow: '0 2px 8px rgba(236, 72, 153, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.5)',
                            '&:hover': {
                              background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.15) 0%, rgba(244, 114, 182, 0.1) 100%)',
                              borderColor: 'rgba(236, 72, 153, 0.45)',
                              transform: 'translateY(-3px) scale(1.03)',
                              boxShadow: '0 6px 16px rgba(236, 72, 153, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.7)',
                            },
                          }}
                        >
                          <Typography variant="caption" sx={{
                            color: '#002480ff',
                            fontSize: '0.65rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            fontWeight: 700,
                            display: 'block',
                            mb: 0.5,
                          }}>
                            Derived From
                          </Typography>
                          <Typography variant="body2" sx={{
                            fontWeight: 600,
                            color: '#0F172A',
                            fontSize: '0.85rem',
                            lineHeight: 1.3,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}>
                            {equipment.derived_from}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>
                </Box>
              )}

            {/* News Profile Box */}
            <Box
              sx={{
                flex: { xs: '1 1 100%', md: '1 1 calc(15% - 8px)' },
                minWidth: 0,
              }}
            >
              <Box
                // className="card"
                sx={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '10px',
                  p: 1.4,
                  // border: '1px solid rgba(16, 185, 129, 0.2)',
                  boxShadow: '0 4px 16px rgba(16, 185, 129, 0.1), 0 2px 6px rgba(0, 0, 0, 0.04)',
                  height: '110px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover': {
                    boxShadow: '0 8px 24px rgba(16, 185, 129, 0.15), 0 4px 12px rgba(0, 0, 0, 0.06)',
                    borderColor: 'rgba(16, 185, 129, 0.35)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                {/* News Profile Button */}
                <Box
                  onClick={queryProfile}
                  sx={{
                    height: '100px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    // px: 1,
                    // py: 1,
                    background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                    borderRadius: '12px',
                    border: '1px solid rgba(5, 150, 105, 0.3)',
                    cursor: 'pointer',
                    boxShadow: '0 4px 16px rgba(16, 185, 129, 0.25)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    width: '100%',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                      boxShadow: '0 8px 24px rgba(16, 185, 129, 0.35)',
                      transform: 'translateY(-4px)',
                    },
                  }}
                >
                  <ArticleIcon sx={{ fontSize: '2rem', color: 'white' }} />
                  <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: 'white', letterSpacing: '0.05em', textAlign: 'center' }}>
                    News Profile
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Equipment Role & Type Row */}
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                flexWrap: 'wrap',
                alignItems: 'stretch',
                width: '100%',
              }}
            >
              {/* Equipment Role */}
              {equipment.role && equipment.role !== "nan" && (
                <Box
                  sx={{
                    flex: '1 1 calc(50% - 12px)',
                    minWidth: 0,
                  }}
                >
                  <Box
                    // className="card"
                    sx={{
                      width: "100%",
                      borderRadius: 3,
                      backgroundColor: "#0085db",
                      color: "white",
                      position: "relative",
                      overflow: "hidden",
                      border: "none",
                      transition: "all 300ms cubic-bezier(0.4,0,0.2,1)",
                      boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
                      height: '195px',
                      // Hover Effect (Premium)
                      "&:hover": {
                        transform: "translateY(-6px)",
                        boxShadow: "0 12px 30px rgba(0, 0, 0, 0.25)",
                      },

                      // Optional Gradient Overlay for Modern Look
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        inset: 0,
                        background:
                          "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)",
                        pointerEvents: "none",
                      },
                    }}
                  >
                    <img
                      src="src/assets/images/profile/top-warning-shape.png"
                      alt="shape"
                      className="top-img"
                      style={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        width: 60,
                        pointerEvents: "none",
                      }}
                    />
                    <Box sx={{ p: 1.5, height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5, flexShrink: 0 }}>
                        <Box
                          sx={{
                            width: 25,
                            height: 25,
                            borderRadius: '8px',
                            background: 'linear-gradient(135deg, rgba(237, 240, 244, 0.25) 0%, rgba(169, 191, 212, 0.25) 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 2px 8px rgba(237, 240, 244, 0.2)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                          }}
                        >
                          <WorkIcon sx={{ fontSize: '1rem', color: 'white' }} />
                        </Box>
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontWeight: 700,
                            color: 'white',
                            fontSize: '0.95rem',
                            lineHeight: 1,
                          }}
                        >
                          Equipment Role
                        </Typography>
                      </Box>
                      {(() => {
                        const roles = equipment.role.split(',');
                        const roleCount = roles.length;
                        const hasMany = roleCount > 10;

                        return (
                          <Box sx={{
                            display: 'grid',
                            gridTemplateColumns: hasMany ? {
                              xs: 'repeat(2, 1fr)',
                              sm: 'repeat(3, 1fr)',
                              md: 'repeat(3, 1fr)',
                              lg: 'repeat(4, 1fr)',
                            } : {
                              xs: 'repeat(2, 1fr)',
                              sm: 'repeat(2, 1fr)',
                              md: 'repeat(3, 1fr)',
                              lg: 'repeat(3, 1fr)',
                            },
                            gap: hasMany ? 0.75 : 1,

                            flex: 1,
                            alignContent: 'flex-start',
                            maxHeight: hasMany ? '170px' : '170px',
                            overflowY: 'auto',
                            pr: 0.5,
                            '&::-webkit-scrollbar': {
                              width: '5px',
                            },
                            '&::-webkit-scrollbar-track': {
                              background: 'rgba(255, 255, 255, 0.1)',
                              borderRadius: '3px',
                            },
                            '&::-webkit-scrollbar-thumb': {
                              background: 'rgba(255, 255, 255, 0.3)',
                              borderRadius: '3px',
                              '&:hover': {
                                background: 'rgba(255, 255, 255, 0.5)',
                              },
                            },
                          }}>
                            {roles.map((role, index) => {
                              const roleLabel = role.trim();
                              const roleModified = roleLabel.replaceAll('/', '_');
                              return (
                                <Tooltip
                                  key={index}
                                  title={roleLabel}
                                  arrow
                                  placement="top"
                                  componentsProps={{
                                    tooltip: {
                                      sx: {
                                        bgcolor: 'rgba(0, 0, 0, 0.9)',
                                        color: 'white',
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                        padding: '8px 12px',
                                        borderRadius: '6px',
                                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                                      },
                                    },
                                    arrow: {
                                      sx: {
                                        color: 'rgba(0, 0, 0, 0.9)',
                                      },
                                    },
                                  }}
                                >
                                  <Box
                                    sx={{
                                      p: hasMany ? 0.55 : 0.75,
                                      borderRadius: '8px',
                                      background: 'rgba(255, 255, 255, 0.15)',
                                      border: '1px solid rgba(255, 255, 255, 0.25)',
                                      display: 'flex',
                                      flexDirection: 'column',
                                      alignItems: 'center',
                                      gap: hasMany ? 0.5 : 0.75,
                                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                      cursor: 'pointer',
                                      minHeight: hasMany ? '40px' : '50px',

                                      '&:hover': {
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 4px 12px rgba(237, 240, 244, 0.25)',
                                        borderColor: 'rgba(255, 255, 255, 0.4)',
                                        background: 'rgba(255, 255, 255, 0.25)',
                                      },
                                    }}
                                  >
                                    <Box
                                      component="img"
                                      src={`./images/role/${roleModified}.svg`}
                                      alt={roleLabel}
                                      sx={{
                                        height: hasMany ? '20px' : '24px',
                                        width: hasMany ? '20px' : '24px',
                                        objectFit: 'contain',
                                        filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))',
                                        flexShrink: 0,
                                      }}
                                    />
                                    <Typography
                                      variant="body2"
                                      sx={{
                                        fontWeight: 600,
                                        color: '${theme.palette.common.white}',
                                        fontSize: hasMany ? '0.65rem' : '0.7rem',
                                        textAlign: 'center',
                                        lineHeight: 1.2,
                                        wordBreak: 'break-word',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                        textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
                                      }}
                                    >
                                      {roleLabel}
                                    </Typography>
                                  </Box>
                                </Tooltip>
                              );
                            })}
                          </Box>
                        );
                      })()}
                    </Box>
                  </Box>
                </Box>
              )}

              {/* Equipment Type */}
              {equipment.equipment_type && (
                <Box
                  sx={{
                    flex: '1 1 calc(50% - 12px)',
                    minWidth: 0,
                  }}
                >
                  <Box
                    // className="card"
                    sx={{
                      width: "100%",
                      // p: 1,
                      borderRadius: 3,
                      backgroundColor: "#0085db",
                      color: "white",
                      position: "relative",
                      overflow: "hidden",
                      border: "none",
                      transition: "all 300ms cubic-bezier(0.4,0,0.2,1)",
                      boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
                      height: '195px',
                      // Hover Effect (Premium)
                      "&:hover": {
                        transform: "translateY(-6px)",
                        boxShadow: "0 12px 30px rgba(0, 0, 0, 0.25)",
                      },

                      // Optional Gradient Overlay for Modern Look
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        inset: 0,
                        background:
                          "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)",
                        pointerEvents: "none",
                      },
                      // background: theme.palette.mode === 'dark'
                      //   ? 'linear-gradient(135deg, rgba(39, 70, 104, 0.15) 0%, rgba(73, 107, 146, 0.08) 100%)'
                      //   : 'linear-gradient(135deg, #496b92ff 0%, #71b4fcff 100%)',
                      // backdropFilter: 'blur(10px)',
                      // borderRadius: '14px',
                      // border: '2px solid rgba(145, 178, 211, 0.25)',
                      // boxShadow: '0 4px 20px rgba(39, 70, 104, 0.15), 0 2px 6px rgba(22, 53, 110, 0.08)',
                      // overflow: 'hidden',
                      // position: 'relative',
                      // height: '195px',
                      // display: 'flex',
                      // flexDirection: 'column',
                      // transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      // '&:hover': {
                      //   boxShadow: '0 12px 32px rgba(39, 70, 104, 0.25), 0 4px 12px rgba(22, 53, 110, 0.15)',
                      //   transform: 'translateY(-4px)',
                      //   borderColor: 'rgba(145, 178, 211, 0.4)',
                      // },
                    }}
                  >
                    <img
                      src="src/assets/images/profile/top-warning-shape.png"
                      alt="shape"
                      className="top-img"
                      style={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        width: 60,
                        // opacity: 0.4,
                        pointerEvents: "none",
                      }}
                    />
                    <Box sx={{ p: 1.5, height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5, flexShrink: 0 }}>

                        <Box
                          sx={{
                            width: 25,
                            height: 25,
                            borderRadius: '8px',
                            background: 'linear-gradient(135deg, rgba(237, 240, 244, 0.25) 0%, rgba(169, 191, 212, 0.25) 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 2px 8px rgba(237, 240, 244, 0.2)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                          }}
                        >
                          <ClassificationIcon sx={{ fontSize: '1rem', color: 'white' }} />
                        </Box>

                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontWeight: 700,
                            color: 'white',
                            fontSize: '0.95rem',
                            lineHeight: 1,
                          }}
                        >
                          Equipment Type
                        </Typography>
                      </Box>
                      {(() => {
                        const types = equipment.equipment_type.split(',');
                        const typeCount = types.length;
                        const hasMany = typeCount > 10;

                        return (
                          <Box sx={{
                            display: 'grid',
                            gridTemplateColumns: hasMany ? {
                              xs: 'repeat(2, 1fr)',
                              sm: 'repeat(3, 1fr)',
                              md: 'repeat(3, 1fr)',
                              lg: 'repeat(4, 1fr)',
                            } : {
                              xs: 'repeat(2, 1fr)',
                              sm: 'repeat(2, 1fr)',
                              md: 'repeat(3, 1fr)',
                              lg: 'repeat(3, 1fr)',
                            },
                            gap: hasMany ? 0.75 : 1,

                            flex: 1,
                            alignContent: 'flex-start',
                            maxHeight: hasMany ? '170px' : '170px',
                            overflowY: 'auto',
                            pr: 0.5,
                            '&::-webkit-scrollbar': {
                              width: '5px',
                            },
                            '&::-webkit-scrollbar-track': {
                              background: 'rgba(255, 255, 255, 0.1)',
                              borderRadius: '3px',
                            },
                            '&::-webkit-scrollbar-thumb': {
                              background: 'rgba(255, 255, 255, 0.3)',
                              borderRadius: '3px',
                              '&:hover': {
                                background: 'rgba(255, 255, 255, 0.5)',
                              },
                            },
                          }}>
                            {types.map((type, index) => {
                              const typeLabel = type.trim();
                              const typeModified = typeLabel.replaceAll('/', '_');
                              return (
                                <Tooltip
                                  key={index}
                                  title={typeLabel}
                                  arrow
                                  placement="top"
                                  componentsProps={{
                                    tooltip: {
                                      sx: {
                                        bgcolor: 'rgba(0, 0, 0, 0.9)',
                                        color: 'white',
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                        padding: '8px 12px',
                                        borderRadius: '6px',
                                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                                      },
                                    },
                                    arrow: {
                                      sx: {
                                        color: 'rgba(0, 0, 0, 0.9)',
                                      },
                                    },
                                  }}
                                >
                                  <Box
                                    sx={{
                                      p: hasMany ? 0.55 : 0.75,
                                      borderRadius: '8px',
                                      background: 'rgba(255, 255, 255, 0.15)',
                                      border: '1px solid rgba(255, 255, 255, 0.25)',
                                      display: 'flex',
                                      flexDirection: 'column',
                                      alignItems: 'center',
                                      gap: hasMany ? 0.5 : 0.75,
                                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                      cursor: 'pointer',
                                      minHeight: hasMany ? '40px' : '50px',

                                      '&:hover': {
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 4px 12px rgba(237, 240, 244, 0.25)',
                                        borderColor: 'rgba(255, 255, 255, 0.4)',
                                        background: 'rgba(255, 255, 255, 0.25)',
                                      },
                                    }}
                                  >
                                    <Box
                                      component="img"
                                      src={`./images/type/${typeModified}.svg`}
                                      alt={typeLabel}
                                      sx={{
                                        height: hasMany ? '20px' : '24px',
                                        width: hasMany ? '20px' : '24px',
                                        objectFit: 'contain',
                                        filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))',
                                        flexShrink: 0,
                                      }}
                                    />
                                    <Typography
                                      variant="body2"
                                      sx={{
                                        fontWeight: 600,
                                        color: '${theme.palette.common.white}',
                                        fontSize: hasMany ? '0.65rem' : '0.7rem',
                                        textAlign: 'center',
                                        lineHeight: 1.2,
                                        wordBreak: 'break-word',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                        textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
                                      }}
                                    >
                                      {typeLabel}
                                    </Typography>
                                  </Box>
                                </Tooltip>
                              );
                            })}
                          </Box>
                        );
                      })()}
                    </Box>
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Three Column Layout - Main Content */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* First Column - Manufacturing & Operations */}
        <Grid item xs={12} md={6} lg={5}>
          <Stack spacing={2.5} sx={{ height: '100%' }}>

            {/* Manufactured By Section */}
            {equipment.manufacturedBy && equipment.manufacturedBy.length > 0 && (
              <Box
                // className="card"
                sx={{
                  width: "100%",
                  borderRadius: "18px",
                  position: "relative",
                  overflow: "hidden",
                  backgroundColor: "#e1f5fa",
                  color: "#111c2d",
                  border: "none",

                  // Padding (you had duplicate 30px → 0px, choose 0px final)
                  p: 0,

                  // Transition & Shadow
                  boxShadow: "0px 6px 18px rgba(0,0,0,0.08)",
                  transition: "box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1)",

                  // Hover effect (modern upgrade)
                  "&:hover": {
                    boxShadow: "0px 10px 28px rgba(0,0,0,0.15)",
                  },
                  // background: theme.palette.mode === 'dark'
                  //   ? 'linear-gradient(135deg, rgba(39, 70, 104, 0.15) 0%, rgba(22, 53, 110, 0.08) 100%)'
                  //   : 'linear-gradient(135deg, #FFFFFF 0%, #FFFFFF 50%, #FFFFFF 100%)',
                  // borderRadius: '14px',
                  // border: '1px solid rgba(28, 89, 158, 0.25)',
                  // boxShadow: '0 4px 16px rgba(39, 70, 104, 0.12), 0 2px 8px rgba(22, 53, 110, 0.08)',
                  // overflow: 'hidden',
                  // position: 'relative',
                  // transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  // '&:hover': {
                  //   boxShadow: '0 8px 32px rgba(39, 70, 104, 0.22), 0 4px 16px rgba(22, 53, 110, 0.15)',
                  //   transform: 'translateY(-4px)',
                  //   borderColor: 'rgba(73, 107, 146, 0.4)',
                  // },
                  // // '&::before': {
                  // //   content: '""',
                  // //   position: 'absolute',
                  // //   top: 0,
                  // //   left: 0,
                  // //   right: 0,
                  // //   height: '2px',
                  // //   background: 'linear-gradient(90deg, #3b68acff, #A78BFA, #3b68acff)',
                  // // },
                  // '&::before': {
                  //   content: '""',
                  //   position: 'absolute',
                  //   top: 0,
                  //   left: 0,
                  //   right: 0,
                  //   height: '3px',
                  //   background: 'linear-gradient(90deg, transparent 0%, #8B5CF6 50%, transparent 100%)',
                  //   opacity: 0.7,
                  // },

                }}
              >
                <img
                  src="src/assets/images/profile/top-info-shape.png"
                  alt="shape"
                  className="top-img"
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: 60,
                    // opacity: 0.4,
                    pointerEvents: "none",
                  }}
                />
                <Box
                  onClick={() => setManufacturedByExpanded(!manufacturedByExpanded)}
                  sx={{
                    p: 2,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: manufacturedByExpanded ? `1px solid ${theme.palette.divider}` : 'none',
                    transition: 'background 0.2s ease',
                    '&:hover': {
                      background: 'rgba(16, 185, 129, 0.04)',
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                    <Box
                      sx={{
                        width: 30,
                        height: 30,
                        borderRadius: '8px',
                        background: 'linear-gradient(135deg, #274668 0%, #16356e 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 12px rgba(39, 70, 104, 0.3)',

                      }}
                    >
                      <BusinessIcon sx={{ fontSize: '1rem', color: 'white' }} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: 700,
                          color: theme.palette.text.primary,
                          fontSize: '0.9rem',
                          lineHeight: 1,
                          mb: 0.75,
                        }}
                      >
                        Manufactured By
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.75 }}>
                        <Typography
                          variant="h5"
                          sx={{
                            fontWeight: 700,
                            fontSize: '1rem',
                            background: 'linear-gradient(135deg, #1a3a54 0%, #0d1f3e 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            lineHeight: 1,
                          }}
                        >
                          {equipment.manufacturedBy.length}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 600,
                            color: theme.palette.text.secondary,
                            fontSize: '0.8rem',
                            letterSpacing: '0.5px',
                          }}
                        >
                          {equipment.manufacturedBy.length === 1 ? 'Manufacturer' : 'Manufacturers'}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  <IconButton
                    size="small"
                    sx={{
                      mr: '33px',
                      transform: manufacturedByExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.3s ease',
                      color: theme.palette.success.main,
                      background: withOpacity(theme.palette.success.main, 0.1),
                      '&:hover': {
                        background: withOpacity(theme.palette.success.main, 0.2),
                      }
                    }}
                  >
                    <ExpandMoreIcon sx={{ fontSize: '1.25rem' }} />
                  </IconButton>
                </Box>
                <Collapse in={manufacturedByExpanded}>
                  <Box
                    sx={{
                      p: 1.2,
                      // pt: 1,
                      background: 'rgba(16, 185, 129, 0.02)',
                      maxHeight: equipment.manufacturedBy.length > 4 ? '280px' : 'auto',
                      overflowY: equipment.manufacturedBy.length > 4 ? 'auto' : 'visible',
                      '&::-webkit-scrollbar': {
                        width: '5px',
                      },
                      '&::-webkit-scrollbar-track': {
                        background: 'rgba(16, 185, 129, 0.05)',
                        borderRadius: '3px',
                      },
                      '&::-webkit-scrollbar-thumb': {
                        background: 'rgba(16, 185, 129, 0.3)',
                        borderRadius: '3px',
                        '&:hover': {
                          background: 'rgba(16, 185, 129, 0.5)',
                        },
                      },
                    }}
                  >
                    <EquipmentManufacturedBy />
                  </Box>
                </Collapse>
              </Box>
            )}

            {/* Operated By Section */}
            <Box
              className="card"
              sx={{
                width: "100%",
                borderRadius: "18px",
                position: "relative",
                overflow: "hidden",
                backgroundColor: "#e1f5fa",
                color: "#111c2d",
                border: "none",

                // Padding (you had duplicate 30px → 0px, choose 0px final)
                p: 0,

                // Transition & Shadow
                boxShadow: "0px 6px 18px rgba(0,0,0,0.08)",
                transition: "box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1)",

                // Hover effect (modern upgrade)
                "&:hover": {
                  boxShadow: "0px 10px 28px rgba(0,0,0,0.15)",
                },
              }}
            >
              <img
                src="src/assets/images/profile/top-info-shape.png"
                alt="shape"
                className="top-img"
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: 60,
                  pointerEvents: "none",
                }}
              />
              <Box
                onClick={() => setOperatedByExpanded(!operatedByExpanded)}
                sx={{
                  p: 2,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: operatedByExpanded ? `1px solid ${theme.palette.divider}` : 'none',
                  transition: 'background 0.2s ease',
                  '&:hover': {
                    background: 'rgba(16, 185, 129, 0.04)',
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                  <Box
                    sx={{
                      width: 30,
                      height: 30,
                      borderRadius: '8px',
                      background: 'linear-gradient(135deg, #274668 0%, #16356e 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 12px rgba(39, 70, 104, 0.3)',

                    }}
                  >
                    <PublicIcon sx={{ fontSize: '1rem', color: 'white' }} />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 700,
                        color: theme.palette.text.primary,
                        fontSize: '0.9rem',
                        lineHeight: 1,
                        mb: 0.75,
                      }}
                    >
                      Operated By
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.75 }}>
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 700,
                          fontSize: '1rem',
                          background: 'linear-gradient(135deg, #1a3a54 0%, #0d1f3e 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text',
                          lineHeight: 1,
                        }}
                      >
                        {equipment?.operatedBy?.length || 0}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color: theme.palette.text.secondary,
                          fontSize: '0.8rem',
                          letterSpacing: '0.5px',
                        }}
                      >
                        {(equipment?.operatedBy?.length || 0) === 1 ? 'Operator' : 'Operators'}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <IconButton
                  size="small"
                  sx={{
                    mr: '33px',
                    transform: operatedByExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s ease',
                    color: theme.palette.success.main,
                    background: withOpacity(theme.palette.success.main, 0.1),
                    '&:hover': {
                      background: withOpacity(theme.palette.success.main, 0.2),
                    }
                  }}
                >
                  <ExpandMoreIcon sx={{ fontSize: '1.25rem' }} />
                </IconButton>
              </Box>
              <Collapse in={operatedByExpanded}>
                <Box
                  sx={{
                    p: 1.2,
                    // pt: 1,
                    background: 'rgba(16, 185, 129, 0.02)',
                    maxHeight: equipment.operatedBy.length > 4 ? '280px' : 'auto',
                    overflowY: equipment.operatedBy.length > 4 ? 'auto' : 'visible',
                    '&::-webkit-scrollbar': {
                      width: '5px',
                    },
                    '&::-webkit-scrollbar-track': {
                      background: 'rgba(16, 185, 129, 0.05)',
                      borderRadius: '3px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      background: 'rgba(16, 185, 129, 0.3)',
                      borderRadius: '3px',
                      '&:hover': {
                        background: 'rgba(16, 185, 129, 0.5)',
                      },
                    },
                  }}
                >
                  <EquipmentOperatedBy />
                </Box>
              </Collapse>
            </Box>
            {/* </Stack>
            <Stack spacing={2.5} sx={{ height: '100%' }}> */}
            {/* Equipment Inventory */}
            <Box
              className="card"
              sx={{
                background: theme.palette.mode === 'dark'
                  ? 'linear-gradient(135deg, rgba(39, 70, 104, 0.15) 0%, rgba(22, 53, 110, 0.08) 100%)'
                  : 'linear-gradient(135deg, #FFFFFF 0%, #FFFFFF 50%, #FFFFFF 100%)',
                borderRadius: '14px',
                border: '2px solid rgba(145, 178, 211, 0.30)',
                boxShadow: '0 4px 16px rgba(39, 70, 104, 0.12), 0 2px 8px rgba(22, 53, 110, 0.08)',
                overflow: 'hidden',
                position: 'relative',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  boxShadow: '0 8px 32px rgba(39, 70, 104, 0.22), 0 4px 16px rgba(22, 53, 110, 0.15)',
                  transform: 'translateY(-4px)',
                  borderColor: 'rgba(145, 178, 211, 0.45)',
                },
                // '&::before': {
                //   content: '""',
                //   position: 'absolute',
                //   top: 0,
                //   left: 0,
                //   right: 0,
                //   height: '2px',
                //   background: 'linear-gradient(90deg, #3b68acff, #A78BFA, #3b68acff)',
                // },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '3px',
                  background: 'linear-gradient(90deg, transparent 0%, #A78BFA 50%, transparent 100%)',
                  opacity: 0.7,
                },
              }}
            >
              <Box
                onClick={() => setInventoryExpanded(!inventoryExpanded)}
                sx={{
                  p: 2,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: inventoryExpanded ? `1px solid ${theme.palette.divider}` : 'none',
                  transition: 'background 0.2s ease',
                  '&:hover': {
                    background: 'rgba(145, 178, 211, 0.08)',
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box
                    sx={{
                      width: 30,
                      height: 30,
                      borderRadius: '8px',
                      background: 'linear-gradient(135deg, #1a1249 0%, #140e35 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 12px rgba(26, 18, 73, 0.3)',
                    }}
                  >
                    <InventoryIcon sx={{ fontSize: '1.1rem', color: 'white' }} />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 700,
                        color: theme.palette.text.primary,
                        fontSize: '0.95rem',
                        lineHeight: 1,
                        mb: 0.75,
                      }}
                    >
                      Inventory
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.75 }}>
                      <Typography
                        variant="h4"
                        sx={{
                          fontWeight: 700,
                          fontSize: '1.1rem',
                          background: 'linear-gradient(135deg, #0f0a2e 0%, #0a0620 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text',
                          lineHeight: 1,
                        }}
                      >
                        {inventoryCount}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color: theme.palette.text.secondary,
                          fontSize: '0.8rem',
                          letterSpacing: '0.5px',
                        }}
                      >
                        {inventoryCount === 1 ? 'Item' : 'Items'}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <IconButton
                  size="small"
                  sx={{
                    transform: inventoryExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s ease',
                    color: theme.palette.secondary.main,
                    background: withOpacity(theme.palette.secondary.main, 0.1),
                    '&:hover': {
                      background: withOpacity(theme.palette.secondary.main, 0.2),
                    }
                  }}
                >
                  <ExpandMoreIcon sx={{ fontSize: '1.25rem' }} />
                </IconButton>
              </Box>
              <Collapse in={inventoryExpanded}>
                <Box
                  sx={{
                    p: 1.5,
                    // pt: 1,
                    background: 'rgba(145, 178, 211, 0.05)',
                  }}
                >
                  <EquipmentInventory setInventoryCount={setInventoryCount} />
                </Box>
              </Collapse>
            </Box>


          </Stack>
        </Grid>



        {/* Second Column -  {/* Measurements, Performance, Attributes - 3 Box Row */}
        <Grid item xs={12} md={6} lg={2}>
          <Stack spacing={2.5} sx={{ height: '100%' }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'column', lg: 'column' },
                gap: 2.5,
                flexWrap: { xs: 'wrap', lg: 'nowrap' },
                height: '380px',
              }}
            >
              {/* Measurements Box */}
              <Box
                onClick={() => setMeasurementsModalOpen(true)}
                sx={{
                  flex: 1,
                  minWidth: { xs: '140px', lg: 'auto' },
                  background: 'rgba(255, 255, 255, 0.92)',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  border: '1px solid rgba(139, 92, 246, 0.15)',
                  boxShadow: '0 4px 20px rgba(139, 92, 246, 0.08), 0 2px 6px rgba(0, 0, 0, 0.04)',
                  transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer',
                  position: 'relative',
                  // '&::before': {
                  //   content: '""',
                  //   position: 'absolute',
                  //   top: 0,
                  //   left: 0,
                  //   right: 0,
                  //   height: '4px',
                  //   background: 'linear-gradient(90deg, #8B5CF6, #A78BFA, #3B82F6)',
                  // },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '3px',
                    background: 'linear-gradient(90deg, transparent 0%, #3B82F6 50%, transparent 100%)',
                    opacity: 0.7,
                  },

                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 32px rgba(139, 92, 246, 0.12), 0 4px 12px rgba(0, 0, 0, 0.06)',
                    borderColor: 'rgba(139, 92, 246, 0.3)',
                  },
                }}
              >
                <Box
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    p: 1.5,
                  }}
                >
                  {/* Header with Icon and Label */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: '8px',
                        background: 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 8px rgba(139, 92, 246, 0.25)',
                      }}
                    >
                      <StraightenIcon sx={{ fontSize: '1.1rem', color: 'white' }} />
                    </Box>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: 600,
                        color: theme.palette.text.primary,
                        fontSize: '0.8rem',
                        lineHeight: 1.2,
                      }}
                    >
                      Measurements
                    </Typography>
                  </Box>

                  {/* Count Display */}
                  <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', py: 0.5 }}>
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 700,
                        fontSize: '2.25rem',
                        background: '#002480ff',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        lineHeight: 1,
                        mb: 0.25,
                      }}
                    >
                      {equipment.specifications.filter(a => a.properties.specification_area === "Measurement").length}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: '#002480ff',
                      }}
                    >
                      View Details
                    </Typography>
                  </Box>

                  {/* Action Button */}
                  {/* <Box
                      sx={{
                        width: '100%',
                        py: 0.75,
                        borderRadius: '6px',
                        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(99, 102, 241, 0.08) 100%)',
                        border: '1px solid rgba(139, 92, 246, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(99, 102, 241, 0.15) 100%)',
                          borderColor: 'rgba(139, 92, 246, 0.4)',
                        },
                      }}
                    >

                    </Box> */}
                </Box>
              </Box>

              {/* Performance Box */}
              <Box
                onClick={() => setPerformanceModalOpen(true)}
                sx={{
                  flex: 1,
                  minWidth: { xs: '140px', lg: 'auto' },
                  background: 'rgba(255, 255, 255, 0.92)',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  border: '1px solid rgba(139, 92, 246, 0.15)',
                  boxShadow: '0 4px 20px rgba(139, 92, 246, 0.08), 0 2px 6px rgba(0, 0, 0, 0.04)',
                  transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer',
                  position: 'relative',
                  // '&::before': {
                  //   content: '""',
                  //   position: 'absolute',
                  //   top: 0,
                  //   left: 0,
                  //   right: 0,
                  //   height: '4px',
                  //   background: 'linear-gradient(90deg, #8B5CF6, #A78BFA, #3B82F6)',
                  // },
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 32px rgba(139, 92, 246, 0.12), 0 4px 12px rgba(0, 0, 0, 0.06)',
                    borderColor: 'rgba(139, 92, 246, 0.3)',
                  },
                }}
              >
                <Box
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    p: 1.5,
                  }}
                >
                  {/* Header with Icon and Label */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: '8px',
                        background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 8px rgba(59, 130, 246, 0.25)',
                      }}
                    >
                      <SpeedIcon sx={{ fontSize: '1.1rem', color: 'white' }} />
                    </Box>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: 600,
                        color: theme.palette.text.primary,
                        fontSize: '0.8rem',
                        lineHeight: 1.2,
                      }}
                    >
                      Performance
                    </Typography>
                  </Box>

                  {/* Count Display */}
                  <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', py: 0.5 }}>
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 700,
                        fontSize: '2.25rem',
                        background: '#002480ff',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        lineHeight: 1,
                        mb: 0.25,
                      }}
                    >
                      {equipment.specifications.filter(a => a.properties.specification_area === "Performance").length}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: '#002480ff',
                      }}
                    >
                      View Details
                    </Typography>
                  </Box>

                  {/* Action Button */}
                  {/* <Box
                      sx={{
                        width: '100%',
                        py: 0.75,
                        borderRadius: '6px',
                        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(37, 99, 235, 0.08) 100%)',
                        border: '1px solid rgba(59, 130, 246, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(37, 99, 235, 0.15) 100%)',
                          borderColor: 'rgba(59, 130, 246, 0.4)',
                        },
                      }}
                    >
                     
                    </Box> */}
                </Box>
              </Box>

              {/* Attributes Box */}
              <Box
                onClick={() => setAttributesModalOpen(true)}
                sx={{
                  flex: 1,
                  minWidth: { xs: '140px', lg: 'auto' },
                  background: 'rgba(253, 223, 215, 1);',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  // border: '1px solid rgba(139, 92, 246, 0.15)',
                  boxShadow: '0 4px 20px rgba(139, 92, 246, 0.08), 0 2px 6px rgba(0, 0, 0, 0.04)',
                  transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer',
                  position: 'relative',
                  // '&::before': {
                  //   content: '""',
                  //   position: 'absolute',
                  //   top: 0,
                  //   left: 0,
                  //   right: 0,
                  //   height: '3px',
                  //   background: 'linear-gradient(90deg, transparent 0%, #06B6D4 50%, transparent 100%)',
                  //   opacity: 0.7,
                  // },
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 32px rgba(139, 92, 246, 0.12), 0 4px 12px rgba(0, 0, 0, 0.06)',
                    borderColor: 'rgba(139, 92, 246, 0.3)',
                  },
                }}
              >
                <img
                  src="src/assets/images/profile/top-error-shape.png"
                  alt="shape"
                  className="top-img"
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: 60,
                    // opacity: 0.4,
                    pointerEvents: "none",
                  }}
                />
                <Box
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    p: 1.5,
                  }}
                >
                  {/* Header with Icon and Label */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: '8px',
                        background: 'linear-gradient(135deg, #754f4fff 0%, #5e4747ff 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 8px rgba(6, 182, 212, 0.25)',
                      }}
                    >
                      <TuneIcon sx={{ fontSize: '1.1rem', color: 'white' }} />
                    </Box>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: 600,
                        color: theme.palette.text.primary,
                        fontSize: '0.8rem',
                        lineHeight: 1.2,
                      }}
                    >
                      Attributes
                    </Typography>
                  </Box>

                  {/* Count Display */}
                  <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', py: 0.5 }}>
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 700,
                        fontSize: '2.2rem',
                        background: '#002480ff',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        lineHeight: 1,
                        mb: 0.25,
                      }}
                    >
                      {equipment.specifications.filter(a => a.properties.specification_area === "Attribute").length}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: '#002480ff',
                      }}
                    >
                      View Details
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Stack>
        </Grid>


        {/* Third Column - Map Component */}
        <Grid item xs={12} md={12} lg={5}>
          <Stack spacing={2.5} sx={{ height: '100%' }}>
            {showMap && (
              <Box
                sx={{
                  background: theme.palette.mode === 'dark'
                    ? `linear-gradient(135deg, ${withOpacity(theme.palette.primary.dark, 0.08)} 0%, ${withOpacity(theme.palette.primary.main, 0.05)} 100%)`
                    : 'linear-gradient(135deg, #FFFFFF 0%, #F0F9FF 50%, #E0F2FE 100%)',
                  borderRadius: '14px',
                  overflow: 'hidden',
                  border: `1.5px solid ${withOpacity(theme.palette.primary.main, 0.15)}`,
                  boxShadow: `0 2px 12px ${withOpacity(theme.palette.primary.main, 0.08)}, 0 1px 3px ${withOpacity(theme.palette.primary.dark, 0.05)}`,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  minHeight: '380px',

                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: `0 8px 32px ${withOpacity(theme.palette.primary.main, 0.18)}, 0 4px 12px ${withOpacity(theme.palette.primary.dark, 0.12)}`,
                    borderColor: withOpacity(theme.palette.primary.main, 0.3),
                  },
                }}
              >
                <Box
                  sx={{
                    px: 2,
                    py: 1,
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    background: 'linear-gradient(135deg, rgba(79, 172, 254, 0.1) 0%, rgba(0, 242, 254, 0.05) 100%)',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      sx={{
                        width: 30,
                        height: 30,
                        borderRadius: '10px',
                        background: `linear-gradient(135deg, ${theme.palette.info.main} 0%, ${theme.palette.info.light} 100%)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 16px rgba(79, 172, 254, 0.3)',
                      }}
                    >
                      <PublicIcon sx={{ fontSize: '1rem', color: 'white' }} />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                      Global Distribution
                    </Typography>
                  </Box>
                </Box>
                <Box
                  sx={{
                    p: 1,
                    height: '310px',
                    overflow: 'hidden',
                    '& > *': {
                      height: '100%',
                    }
                  }}
                >
                  <MapComponent />
                </Box>
              </Box>
            )}
          </Stack>
        </Grid>
      </Grid>

      {/* Modals for Measurements, Performance, Attributes */}
      {/* Measurements Modal */}
      <Modal
        open={measurementsModalOpen}
        onClose={() => setMeasurementsModalOpen(false)}
        aria-labelledby="measurements-modal-title"
        closeAfterTransition
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: '90%',
            maxWidth: '800px',
            maxHeight: '90vh',
            background: theme.palette.background.paper,
            borderRadius: '12px',
            border: '1.5px solid rgba(73, 107, 146, 0.15)',
            boxShadow: '0 8px 32px rgba(39, 70, 104, 0.2)',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              px: 2.5,
              py: 2,
              background: 'linear-gradient(135deg, #496b92ff 0%, #274668 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <StraightenIcon sx={{ fontSize: '1.8rem', color: 'white' }} />
              <Typography
                id="measurements-modal-title"
                variant="h5"
                sx={{
                  fontWeight: 700,
                  color: 'white',
                }}
              >
                Measurements
              </Typography>
            </Box>
            <IconButton
              onClick={() => setMeasurementsModalOpen(false)}
              sx={{
                color: 'white',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          <Box
            sx={{
              p: 2.5,
              maxHeight: 'calc(90vh - 100px)',
              overflowY: 'auto',
            }}
          >
            {equipment && equipment.specifications && equipment.specifications.filter(a => a.properties.specification_area === "Measurement").length > 0 ? (
              <TableContainer
                sx={{
                  background: theme.palette.background.paper,
                  borderRadius: '12px',
                  border: '1px solid rgba(73, 107, 146, 0.2)',
                }}
              >
                <Table>
                  <TableBody>
                    {equipment.specifications
                      .filter(a => a.properties.specification_area === "Measurement")
                      .map((spec, index) => (
                        <TableRow key={index}>
                          <TableCell sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                            {spec.properties.specification_type}
                          </TableCell>
                          <TableCell>
                            {spec.properties.specification_value}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography>No measurements available</Typography>
            )}
          </Box>
        </Box>
      </Modal>

      {/* Performance Modal */}
      <Modal
        open={performanceModalOpen}
        onClose={() => setPerformanceModalOpen(false)}
        aria-labelledby="performance-modal-title"
        closeAfterTransition
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: '90%',
            maxWidth: '800px',
            maxHeight: '90vh',
            background: theme.palette.background.paper,
            borderRadius: '12px',
            border: '1.5px solid rgba(22, 53, 110, 0.15)',
            boxShadow: '0 8px 32px rgba(26, 18, 73, 0.2)',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              px: 2.5,
              py: 2,
              background: 'linear-gradient(135deg, #16356e 0%, #1a1249 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <SpeedIcon sx={{ fontSize: '1.8rem', color: 'white' }} />
              <Typography
                id="performance-modal-title"
                variant="h5"
                sx={{
                  fontWeight: 700,
                  color: 'white',
                }}
              >
                Performance
              </Typography>
            </Box>
            <IconButton
              onClick={() => setPerformanceModalOpen(false)}
              sx={{
                color: 'white',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          <Box
            sx={{
              p: 2.5,
              maxHeight: 'calc(90vh - 100px)',
              overflowY: 'auto',
            }}
          >
            {equipment && equipment.specifications && equipment.specifications.filter(a => a.properties.specification_area === "Performance").length > 0 ? (
              <TableContainer
                sx={{
                  background: theme.palette.background.paper,
                  borderRadius: '12px',
                  border: '1px solid rgba(22, 53, 110, 0.2)',
                }}
              >
                <Table>
                  <TableBody>
                    {equipment.specifications
                      .filter(a => a.properties.specification_area === "Performance")
                      .map((spec, index) => (
                        <TableRow key={index}>
                          <TableCell sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                            {spec.properties.specification_type}
                          </TableCell>
                          <TableCell>
                            {spec.properties.specification_value}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography>No performance data available</Typography>
            )}
          </Box>
        </Box>
      </Modal>

      {/* Attributes Modal */}
      <Modal
        open={attributesModalOpen}
        onClose={() => setAttributesModalOpen(false)}
        aria-labelledby="attributes-modal-title"
        closeAfterTransition
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: '90%',
            maxWidth: '800px',
            maxHeight: '90vh',
            background: theme.palette.background.paper,
            borderRadius: '12px',
            border: '1.5px solid rgba(27, 132, 255, 0.15)',
            boxShadow: '0 8px 32px rgba(27, 132, 255, 0.2)',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              px: 2.5,
              py: 2,
              background: 'linear-gradient(135deg, rgb(27, 132, 255) 0%, #16356e 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <TuneIcon sx={{ fontSize: '1.8rem', color: 'white' }} />
              <Typography
                id="attributes-modal-title"
                variant="h5"
                sx={{
                  fontWeight: 700,
                  color: 'white',
                }}
              >
                Attributes
              </Typography>
            </Box>
            <IconButton
              onClick={() => setAttributesModalOpen(false)}
              sx={{
                color: 'white',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          <Box
            sx={{
              p: 2.5,
              maxHeight: 'calc(90vh - 100px)',
              overflowY: 'auto',
            }}
          >
            {equipment && equipment.specifications && equipment.specifications.filter(a => a.properties.specification_area === "Attribute").length > 0 ? (
              <TableContainer
                sx={{
                  background: theme.palette.background.paper,
                  borderRadius: '12px',
                  border: '1px solid rgba(27, 132, 255, 0.2)',
                }}
              >
                <Table>
                  <TableBody>
                    {equipment.specifications
                      .filter(a => a.properties.specification_area === "Attribute")
                      .map((spec, index) => (
                        <TableRow key={index}>
                          <TableCell sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                            {spec.properties.specification_type}
                          </TableCell>
                          <TableCell>
                            {spec.properties.specification_value}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography>No attributes available</Typography>
            )}
          </Box>
        </Box>
      </Modal>
    </Box >
  );
};

export default EquipmentInfoCard;