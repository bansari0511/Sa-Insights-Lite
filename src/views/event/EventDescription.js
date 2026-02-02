import * as React from 'react';
import { EventContext } from '../../context/EventContext';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function EventDescription() {
    const { selectedEvent } = React.useContext(EventContext);

    // Add null check
    if (!selectedEvent) {
        return null;
    }

    if (!selectedEvent.description) return null;

    return (
        <Box
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <Typography
                sx={{
                    fontWeight: 500,
                    fontSize: '0.875rem',
                    lineHeight: 1.7,
                    color: '#4a5568',
                    fontFamily: "'Inter', 'Roboto', 'Segoe UI', -apple-system, sans-serif",
                    letterSpacing: '0.01em',
                }}
            >
                {selectedEvent.description}
            </Typography>
        </Box>
    );
}
