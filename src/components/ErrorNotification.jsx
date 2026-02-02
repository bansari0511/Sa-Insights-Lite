/**
 * Error Notification Component
 * Displays user-friendly error notifications using Material-UI Snackbar
 */

import React from 'react';
import { Snackbar, Alert, AlertTitle, IconButton, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useError } from '../context/ErrorContext';

const ErrorNotification = () => {
  const { notifications, dismissNotification } = useError();

  return (
    <Box>
      {notifications.map((notification, index) => (
        <Snackbar
          key={notification.id}
          open={true}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          style={{ top: `${80 + index * 70}px` }}
        >
          <Alert
            severity={notification.severity}
            action={
              <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={() => dismissNotification(notification.id)}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            }
            sx={{
              width: '100%',
              minWidth: '350px',
              maxWidth: '500px',
              boxShadow: 3,
            }}
          >
            {notification.severity === 'error' && <AlertTitle>Error</AlertTitle>}
            {notification.severity === 'warning' && <AlertTitle>Warning</AlertTitle>}
            {notification.message}
          </Alert>
        </Snackbar>
      ))}
    </Box>
  );
};

export default ErrorNotification;