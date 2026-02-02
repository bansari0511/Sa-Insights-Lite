import * as React from "react";
import { EventContext } from "../../context/EventContext";
import { Typography, Box, Chip } from '@mui/material';

import EventIcon from "@mui/icons-material/Event";
import LabelIcon from "@mui/icons-material/Label";

export default function EventLabel() {
    const { selectedEvent } = React.useContext(EventContext);

    if (!selectedEvent) return null;

    return (
        <Box
            sx={{
                background: 'transparent',
                borderRadius: '14px',
                p: 1.5,
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                    '& .event-icon-box': {
                        transform: 'scale(1.05)',
                        boxShadow: '0 8px 24px rgba(93, 135, 255, 0.4)',
                    },
                }
            }}
        >
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                position: 'relative',
                zIndex: 1
            }}>
                {/* Icon Section */}
                <Box
                    className="event-icon-box"
                    sx={{
                        background: 'linear-gradient(135deg, #5D87FF 0%, #49BEFF 100%)',
                        borderRadius: '12px',
                        p: 1.25,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minWidth: '44px',
                        height: '44px',
                        boxShadow: '0 4px 16px rgba(93, 135, 255, 0.35)',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        position: 'relative',
                        flexShrink: 0,
                    }}
                >
                    <EventIcon sx={{
                        fontSize: '1.4rem',
                        color: '#FFFFFF',
                    }} />
                </Box>

                {/* Content Section */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    {/* Label Badge Row */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.75, flexWrap: 'wrap' }}>
                        <Chip
                            icon={<LabelIcon sx={{ fontSize: '0.8rem !important' }} />}
                            label="Event Label"
                            size="small"
                            sx={{
                                height: '22px',
                                fontSize: '0.68rem',
                                fontWeight: 700,
                                letterSpacing: '0.5px',
                                textTransform: 'uppercase',
                                background: 'linear-gradient(135deg, rgba(93, 135, 255, 0.12) 0%, rgba(73, 190, 255, 0.08) 100%)',
                                color: '#5A6A85',
                                border: '1px solid rgba(93, 135, 255, 0.25)',
                                fontFamily: "'Inter', 'Roboto', sans-serif",
                                '& .MuiChip-icon': {
                                    color: '#5A6A85',
                                    marginLeft: '6px',
                                },
                                '& .MuiChip-label': {
                                    paddingRight: '10px',
                                },
                            }}
                        />
                        {/* ID badge */}
                        {selectedEvent.id && (
                            <Box
                                sx={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 0.5,
                                    px: 1,
                                    py: 0.25,
                                    borderRadius: '6px',
                                    background: 'rgba(0, 0, 0, 0.04)',
                                    border: '1px solid rgba(0, 0, 0, 0.08)',
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontSize: '0.6rem',
                                        fontWeight: 600,
                                        color: '#94A3B8',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px',
                                    }}
                                >
                                    ID:
                                </Typography>
                                <Typography
                                    sx={{
                                        fontSize: '0.68rem',
                                        fontWeight: 700,
                                        color: '#5A6A85',
                                        fontFamily: "'Roboto Mono', monospace",
                                    }}
                                >
                                    {selectedEvent.id}
                                </Typography>
                            </Box>
                        )}
                    </Box>

                    {/* Event Label Text */}
                    <Typography
                        variant="h5"
                        sx={{
                            fontWeight: 700,
                            color: '#1a1a2e',
                            lineHeight: 1.3,
                            wordBreak: 'break-word',
                            fontSize: '1.1rem',
                            letterSpacing: '-0.01em',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            fontFamily: "'Inter', 'Roboto', sans-serif",
                        }}
                    >
                        {selectedEvent.label || 'Untitled Event'}
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
}
