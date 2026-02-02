import React, { useState } from 'react';
import {
    Box,
    Typography,
    Button,
    Stack,
    Alert,
    CircularProgress,
    InputAdornment,
    IconButton,
    TextField,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Navigate, useLocation } from 'react-router-dom';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import LoginIcon from '@mui/icons-material/Login';

import { useAuth } from '../../../context/AuthContext';
import authService from '../../../services/authService';

const AuthLogin = ({ title, subtext }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { login, isAuthenticated } = useAuth();
    const location = useLocation();

    const isDemoMode = authService.isDemoMode();

    // Get the intended destination from location state, or default to /NewsRoom
    const from = location.state?.from?.pathname || '/NewsRoom';

    // If already authenticated, redirect immediately
    if (isAuthenticated) {
        return <Navigate to={from} replace />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!username.trim() || !password.trim()) {
            setError('Please enter username and password');
            return;
        }

        setIsLoading(true);

        try {
            const result = await login(username, password);
            if (!result.success) {
                setError(result.error || 'Invalid credentials. Please try again.');
                setIsLoading(false);
            }
        } catch (err) {
            setError('Login failed. Please try again.');
            setIsLoading(false);
        }
    };

    const inputStyles = {
        '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.04),
            transition: 'all 0.3s ease',
            '& fieldset': {
                borderColor: (theme) => alpha(theme.palette.primary.main, 0.2),
                borderWidth: '1.5px',
            },
            '&:hover fieldset': {
                borderColor: (theme) => alpha(theme.palette.primary.main, 0.4),
            },
            '&.Mui-focused fieldset': {
                borderColor: 'primary.main',
                borderWidth: '2px',
            },
            '&.Mui-focused': {
                backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.08),
                boxShadow: (theme) => `0 0 0 4px ${alpha(theme.palette.primary.main, 0.1)}`,
            },
        },
        '& .MuiInputAdornment-root': {
            color: 'primary.main',
        },
        '& input': {
            padding: '14px 16px',
            fontSize: '0.95rem',
        },
    };

    return (
        <Box component="form" onSubmit={handleSubmit}>
            {title && (
                <Typography fontWeight="700" variant="h4" mb={1} textAlign="center">
                    {title}
                </Typography>
            )}

            {subtext}

            {error && (
                <Alert
                    severity="error"
                    sx={{
                        mb: 3,
                        borderRadius: '12px',
                        '& .MuiAlert-icon': { alignItems: 'center' }
                    }}
                >
                    {error}
                </Alert>
            )}

            <Stack spacing={3} sx={{ mt: 3 }}>
                <TextField
                    id="username"
                    placeholder="Username"
                    variant="outlined"
                    fullWidth
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={isLoading}
                    autoComplete="username"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <PersonOutlineIcon />
                            </InputAdornment>
                        ),
                    }}
                    sx={inputStyles}
                />

                <TextField
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    variant="outlined"
                    fullWidth
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    autoComplete="current-password"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <LockOutlinedIcon />
                            </InputAdornment>
                        ),
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={() => setShowPassword(!showPassword)}
                                    edge="end"
                                    size="small"
                                    sx={{ color: 'text.secondary' }}
                                >
                                    {showPassword ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                    sx={inputStyles}
                />

                <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    type="submit"
                    disabled={isLoading}
                    startIcon={!isLoading && <LoginIcon />}
                    sx={{
                        py: 1.6,
                        borderRadius: '12px',
                        fontSize: '1rem',
                        fontWeight: 600,
                        textTransform: 'none',
                        background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 50%, #0d47a1 100%)',
                        boxShadow: '0 4px 14px 0 rgba(25, 118, 210, 0.39)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 50%, #1a237e 100%)',
                            boxShadow: '0 6px 20px 0 rgba(25, 118, 210, 0.5)',
                            transform: 'translateY(-2px)',
                        },
                        '&:active': {
                            transform: 'translateY(0)',
                        },
                        '&.Mui-disabled': {
                            background: 'linear-gradient(135deg, #90caf9 0%, #64b5f6 100%)',
                        },
                    }}
                >
                    {isLoading ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <CircularProgress size={22} color="inherit" thickness={3} />
                            <span>Signing in...</span>
                        </Box>
                    ) : (
                        'Sign In'
                    )}
                </Button>
            </Stack>

            {/* Subtle Mode Indicator */}
            <Box sx={{ mt: 4, textAlign: 'center' }}>
                <Typography
                    variant="caption"
                    sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 1,
                        px: 2,
                        py: 0.8,
                        borderRadius: '20px',
                        backgroundColor: (theme) =>
                            isDemoMode
                                ? alpha(theme.palette.info.main, 0.1)
                                : alpha(theme.palette.success.main, 0.1),
                        color: isDemoMode ? 'info.dark' : 'success.dark',
                        fontWeight: 500,
                    }}
                >
                    {isDemoMode ? (
                        <>Demo Mode - Any credentials work</>
                    ) : (
                        <>SSO Mode - Use: <code style={{
                            backgroundColor: 'rgba(0,0,0,0.06)',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontFamily: 'monospace'
                        }}>labuser / labuser</code></>
                    )}
                </Typography>
            </Box>
        </Box>
    );
};

export default AuthLogin;
