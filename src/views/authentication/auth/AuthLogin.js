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
    keyframes,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Navigate, useLocation } from 'react-router-dom';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import { useAuth } from '../../../context/AuthContext';
import authService from '../../../services/authService';

const FONT = "'Inter', 'Segoe UI', -apple-system, BlinkMacSystemFont, 'Roboto', sans-serif";
const MONO = "'SF Mono', 'Fira Code', 'Cascadia Code', 'Consolas', monospace";

const INDIGO = '#6366f1';
const INDIGO_DK = '#4f46e5';

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const pulseRing = keyframes`
  0%   { box-shadow: 0 0 0 0 ${alpha('#6366f1', 0.3)}; }
  70%  { box-shadow: 0 0 0 6px ${alpha('#6366f1', 0)}; }
  100% { box-shadow: 0 0 0 0 ${alpha('#6366f1', 0)}; }
`;

const AuthLogin = ({ title, subtext }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [focusedField, setFocusedField] = useState(null);

    const { login, isAuthenticated } = useAuth();
    const location = useLocation();

    const isDemoMode = authService.isDemoMode();
    const from = location.state?.from?.pathname || '/NewsRoom';

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
            fontFamily: FONT,
            borderRadius: '12px',
            backgroundColor: 'rgba(255,255,255,0.06)',
            color: '#fff',
            transition: 'all 0.25s ease',
            '& fieldset': {
                borderColor: 'rgba(255,255,255,0.15)',
                borderWidth: '1.5px',
                transition: 'all 0.25s ease',
            },
            '&:hover fieldset': {
                borderColor: alpha(INDIGO, 0.5),
            },
            '&.Mui-focused fieldset': {
                borderColor: INDIGO,
                borderWidth: '2px',
            },
            '&.Mui-focused': {
                backgroundColor: 'rgba(255,255,255,0.1)',
                boxShadow: `0 0 0 3px ${alpha(INDIGO, 0.14)}, 0 2px 16px ${alpha(INDIGO, 0.1)}`,
            },
        },
        '& .MuiInputAdornment-root': {
            color: 'rgba(255,255,255,0.5)',
            transition: 'color 0.25s ease',
        },
        '& .Mui-focused .MuiInputAdornment-root': {
            color: INDIGO,
        },
        '& input': {
            fontFamily: FONT,
            padding: '14px 16px',
            fontSize: '0.95rem',
            fontWeight: 500,
            color: '#e2e8f0',
            letterSpacing: '0.01em',
            '&::placeholder': {
                color: 'rgba(255,255,255,0.40)',
                opacity: 1,
                fontWeight: 300,
                fontStyle: 'italic',
            },
            '&:-webkit-autofill': {
                WebkitBoxShadow: '0 0 0 100px rgba(10,12,30,1) inset',
                WebkitTextFillColor: '#e2e8f0',
                caretColor: '#e2e8f0',
                borderRadius: '12px',
            },
        },
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ fontFamily: FONT, color: '#fff' }}>
            {title && (
                <Typography fontWeight="700" variant="h4" mb={1} textAlign="center" sx={{ fontFamily: FONT, color: '#f1f5f9' }}>
                    {title}
                </Typography>
            )}

            {subtext}

            {error && (
                <Alert
                    severity="error"
                    sx={{
                        mb: 2,
                        borderRadius: '12px',
                        fontSize: '0.85rem',
                        fontFamily: FONT,
                        fontWeight: 500,
                        animation: `${slideUp} 0.3s ease-out`,
                        bgcolor: alpha('#ef4444', 0.12),
                        color: '#fca5a5',
                        border: `1px solid ${alpha('#ef4444', 0.22)}`,
                        '& .MuiAlert-icon': { alignItems: 'center', color: '#f87171' },
                    }}
                >
                    {error}
                </Alert>
            )}

            <Stack spacing={2.2}>
                {/* Username */}
                <Box sx={{ animation: `${slideUp} 0.35s ease-out 0.1s both` }}>
                    <Typography sx={{
                        fontFamily: FONT, fontSize: '0.76rem', fontWeight: 600,
                        color: focusedField === 'user' ? INDIGO : 'rgba(255,255,255,0.75)',
                        mb: 0.6, pl: 0.3, transition: 'color 0.25s ease',
                        letterSpacing: '0.05em', textTransform: 'uppercase',
                        textShadow: focusedField === 'user' ? `0 0 8px ${alpha(INDIGO, 0.3)}` : 'none',
                    }}>
                        Username
                    </Typography>
                    <TextField
                        id="username"
                        placeholder="Enter your username"
                        variant="outlined"
                        fullWidth
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        onFocus={() => setFocusedField('user')}
                        onBlur={() => setFocusedField(null)}
                        disabled={isLoading}
                        autoComplete="username"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <PersonOutlineIcon sx={{ fontSize: 20 }} />
                                </InputAdornment>
                            ),
                        }}
                        sx={inputStyles}
                    />
                </Box>

                {/* Password */}
                <Box sx={{ animation: `${slideUp} 0.35s ease-out 0.18s both` }}>
                    <Typography sx={{
                        fontFamily: FONT, fontSize: '0.76rem', fontWeight: 600,
                        color: focusedField === 'pass' ? INDIGO : 'rgba(255,255,255,0.75)',
                        mb: 0.6, pl: 0.3, transition: 'color 0.25s ease',
                        letterSpacing: '0.05em', textTransform: 'uppercase',
                        textShadow: focusedField === 'pass' ? `0 0 8px ${alpha(INDIGO, 0.3)}` : 'none',
                    }}>
                        Password
                    </Typography>
                    <TextField
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        variant="outlined"
                        fullWidth
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onFocus={() => setFocusedField('pass')}
                        onBlur={() => setFocusedField(null)}
                        disabled={isLoading}
                        autoComplete="current-password"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <LockOutlinedIcon sx={{ fontSize: 20 }} />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowPassword(!showPassword)}
                                        edge="end"
                                        size="small"
                                        sx={{
                                            color: 'rgba(255,255,255,0.5)',
                                            transition: 'all 0.2s ease',
                                            '&:hover': { color: INDIGO, bgcolor: alpha(INDIGO, 0.1) },
                                        }}
                                    >
                                        {showPassword
                                            ? <VisibilityOffOutlinedIcon sx={{ fontSize: 18 }} />
                                            : <VisibilityOutlinedIcon sx={{ fontSize: 18 }} />
                                        }
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        sx={inputStyles}
                    />
                </Box>

                {/* Sign In Button */}
                <Box sx={{ animation: `${slideUp} 0.35s ease-out 0.26s both`, pt: 0.5 }}>
                    <Button
                        variant="contained"
                        size="large"
                        fullWidth
                        type="submit"
                        disabled={isLoading}
                        endIcon={!isLoading && <ArrowForwardIcon sx={{ fontSize: '1.1rem !important', transition: 'transform 0.3s ease' }} />}
                        sx={{
                            fontFamily: FONT,
                            py: 1.6,
                            borderRadius: '12px',
                            fontSize: '0.95rem',
                            fontWeight: 700,
                            textTransform: 'none',
                            letterSpacing: '0.02em',
                            background: `linear-gradient(135deg, ${INDIGO} 0%, ${INDIGO_DK} 100%)`,
                            boxShadow: `0 4px 16px ${alpha(INDIGO, 0.35)}`,
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            position: 'relative',
                            overflow: 'hidden',
                            '&::after': {
                                content: '""',
                                position: 'absolute',
                                top: 0, left: '-100%', width: '100%', height: '100%',
                                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
                                transition: 'left 0.5s ease',
                            },
                            '&:hover': {
                                boxShadow: `0 6px 24px ${alpha(INDIGO, 0.45)}`,
                                transform: 'translateY(-1px)',
                                '&::after': { left: '100%' },
                                '& .MuiButton-endIcon': { transform: 'translateX(3px)' },
                            },
                            '&:active': { transform: 'translateY(0) scale(0.99)' },
                            '&.Mui-disabled': {
                                background: 'rgba(255,255,255,0.08)',
                                color: 'rgba(255,255,255,0.35)',
                                boxShadow: 'none',
                            },
                        }}
                    >
                        {isLoading ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <CircularProgress size={18} color="inherit" thickness={3} />
                                <span>Authenticating...</span>
                            </Box>
                        ) : (
                            'Sign In'
                        )}
                    </Button>
                </Box>
            </Stack>

            {/* Mode Indicator */}
            <Box sx={{ mt: 2.5, textAlign: 'center', animation: `${slideUp} 0.35s ease-out 0.34s both` }}>
                <Typography
                    component="div"
                    sx={{
                        display: 'inline-flex', alignItems: 'center', gap: 0.6,
                        px: 1.5, py: 0.5, borderRadius: '8px',
                        backgroundColor: isDemoMode ? alpha('#6366f1', 0.1) : alpha('#22c55e', 0.1),
                        color: isDemoMode ? '#a5b4fc' : '#86efac',
                        fontWeight: 600, fontSize: '0.68rem', fontFamily: FONT,
                        border: `1px solid ${isDemoMode ? alpha('#6366f1', 0.18) : alpha('#22c55e', 0.18)}`,
                    }}
                >
                    <Box sx={{
                        width: 5, height: 5, borderRadius: '50%',
                        bgcolor: isDemoMode ? '#818cf8' : '#4ade80',
                        animation: `${pulseRing} 2s ease-out infinite`,
                    }} />
                    {isDemoMode ? (
                        <>Demo Mode &mdash; Any credentials work</>
                    ) : (
                        <>SSO Mode &mdash; Use: <code style={{
                            fontFamily: MONO, backgroundColor: 'rgba(255,255,255,0.08)',
                            padding: '2px 6px', borderRadius: '4px', fontWeight: 700, fontSize: '0.7rem',
                        }}>labuser / labuser</code></>
                    )}
                </Typography>
            </Box>
        </Box>
    );
};

export default AuthLogin;
