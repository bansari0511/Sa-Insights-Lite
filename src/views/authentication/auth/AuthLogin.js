import { useState } from 'react';
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
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import { useAuth } from '../../../context/AuthContext';
import authService from '../../../services/authService';

const FONT = "'Inter', 'Segoe UI', -apple-system, BlinkMacSystemFont, 'Roboto', sans-serif";
const MONO = "'SF Mono', 'Fira Code', 'Cascadia Code', 'Consolas', monospace";

const AZURE = '#38bdf8';
const INDIGO = '#6366f1';
const INDIGO_DK = '#4f46e5';

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

    const inputSx = {
        '& .MuiOutlinedInput-root': {
            fontFamily: FONT,
            borderRadius: '10px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            color: '#e2e8f0',
            '& fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.1)',
                borderWidth: '1px',
            },
            '&:hover fieldset': {
                borderColor: alpha(AZURE, 0.3),
            },
            '&.Mui-focused fieldset': {
                borderColor: AZURE,
                borderWidth: '1.5px',
            },
            '&.Mui-focused': {
                backgroundColor: 'rgba(56, 189, 248, 0.03)',
                boxShadow: `0 0 0 3px ${alpha(AZURE, 0.06)}`,
            },
        },
        '& .MuiInputAdornment-root': {
            color: 'rgba(255, 255, 255, 0.3)',
        },
        '& .Mui-focused .MuiInputAdornment-root': {
            color: AZURE,
        },
        '& input': {
            fontFamily: FONT,
            padding: '12px 14px',
            fontSize: '0.9rem',
            fontWeight: 500,
            color: '#e2e8f0',
            '&::placeholder': {
                color: 'rgba(255, 255, 255, 0.25)',
                opacity: 1,
                fontWeight: 400,
            },
            '&:-webkit-autofill': {
                WebkitBoxShadow: '0 0 0 100px rgba(10, 12, 26, 0.9) inset',
                WebkitTextFillColor: '#e2e8f0',
                caretColor: '#e2e8f0',
                borderRadius: '10px',
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
                        borderRadius: '10px',
                        fontSize: '0.8rem',
                        fontFamily: FONT,
                        fontWeight: 500,
                        bgcolor: alpha('#ef4444', 0.08),
                        color: '#fca5a5',
                        border: `1px solid ${alpha('#ef4444', 0.12)}`,
                        '& .MuiAlert-icon': { alignItems: 'center', color: '#f87171' },
                    }}
                >
                    {error}
                </Alert>
            )}

            <Stack spacing={2}>
                {/* Username */}
                <Box>
                    <Typography sx={{
                        fontFamily: FONT,
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: focusedField === 'user' ? AZURE : '#94a3b8',
                        mb: 0.6,
                        pl: 0.2,
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
                                    <PersonOutlineIcon sx={{ fontSize: 19 }} />
                                </InputAdornment>
                            ),
                        }}
                        sx={inputSx}
                    />
                </Box>

                {/* Password */}
                <Box>
                    <Typography sx={{
                        fontFamily: FONT,
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: focusedField === 'pass' ? AZURE : '#94a3b8',
                        mb: 0.6,
                        pl: 0.2,
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
                                    <LockOutlinedIcon sx={{ fontSize: 19 }} />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowPassword(!showPassword)}
                                        edge="end"
                                        size="small"
                                        sx={{
                                            color: 'rgba(255, 255, 255, 0.35)',
                                            '&:hover': { color: AZURE, bgcolor: alpha(AZURE, 0.08) },
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
                        sx={inputSx}
                    />
                </Box>

                {/* Sign In Button */}
                <Box sx={{ pt: 0.5 }}>
                    <Button
                        variant="contained"
                        size="large"
                        fullWidth
                        type="submit"
                        disabled={isLoading}
                        endIcon={!isLoading && <ArrowForwardIcon sx={{ fontSize: '1rem !important' }} />}
                        sx={{
                            fontFamily: FONT,
                            py: 1.4,
                            borderRadius: '10px',
                            fontSize: '0.9rem',
                            fontWeight: 700,
                            textTransform: 'none',
                            letterSpacing: '0.02em',
                            background: `linear-gradient(135deg, ${AZURE} 0%, ${INDIGO} 60%, ${INDIGO_DK} 100%)`,
                            boxShadow: `0 4px 16px ${alpha(AZURE, 0.2)}, 0 2px 8px ${alpha(INDIGO, 0.15)}`,
                            '&:hover': {
                                boxShadow: `0 6px 24px ${alpha(AZURE, 0.3)}, 0 2px 12px ${alpha(INDIGO, 0.2)}`,
                                background: `linear-gradient(135deg, #5cc8f9 0%, #7c7ff7 60%, ${INDIGO} 100%)`,
                            },
                            '&.Mui-disabled': {
                                background: 'rgba(255, 255, 255, 0.06)',
                                color: 'rgba(255, 255, 255, 0.3)',
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

            {/* Mode indicator */}
            <Box sx={{ mt: 2.5, textAlign: 'center' }}>
                <Typography
                    component="div"
                    sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 0.6,
                        px: 1.5,
                        py: 0.5,
                        borderRadius: '8px',
                        backgroundColor: isDemoMode ? alpha(INDIGO, 0.08) : alpha('#22c55e', 0.08),
                        color: isDemoMode ? '#a5b4fc' : '#86efac',
                        fontWeight: 600,
                        fontSize: '0.62rem',
                        fontFamily: FONT,
                        border: `1px solid ${isDemoMode ? alpha(INDIGO, 0.14) : alpha('#22c55e', 0.14)}`,
                    }}
                >
                    <Box sx={{
                        width: 5,
                        height: 5,
                        borderRadius: '50%',
                        bgcolor: isDemoMode ? '#818cf8' : '#4ade80',
                        boxShadow: isDemoMode
                            ? '0 0 5px rgba(129,140,248,0.3)'
                            : '0 0 5px rgba(74,222,128,0.3)',
                        flexShrink: 0,
                    }} />
                    {isDemoMode ? (
                        <>Demo Mode &mdash; Any credentials work</>
                    ) : (
                        <>SSO Mode &mdash; Use: <code style={{
                            fontFamily: MONO,
                            backgroundColor: 'rgba(255,255,255,0.08)',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontWeight: 700,
                            fontSize: '0.64rem',
                        }}>labuser / labuser</code></>
                    )}
                </Typography>
            </Box>
        </Box>
    );
};

export default AuthLogin;
