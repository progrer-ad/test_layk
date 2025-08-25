'use client';

import { useState, useEffect, useRef } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    Link,
    IconButton,
    InputAdornment,
    CircularProgress,
    Snackbar,
    Alert,
} from '@mui/material';
import { styled } from '@mui/system';
import EmailIcon from '@mui/icons-material/Email';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { RefreshCcw } from 'lucide-react';
import { keyframes } from '@emotion/react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import api from '@/util/api';
import axios from 'axios';

// --- ANIMATION KEYFRAMES ---
const fadeIn = keyframes`
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
`;
const slideBg = keyframes`
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
`;
const floatUp = keyframes`
    0% { transform: translateY(0) rotate(0deg); opacity: 0.8; border-radius: 50%; }
    25% { transform: translateY(-20px) rotate(90deg); opacity: 0.6; border-radius: 60%; }
    50% { transform: translateY(-40px) rotate(180deg); opacity: 0.9; border-radius: 40%; }
    75% { transform: translateY(-20px) rotate(270deg); opacity: 0.7; border-radius: 55%; }
    100% { transform: translateY(0) rotate(-360deg); opacity: 0.8; border-radius: 50%; }
`;
const floatDown = keyframes`
    0% { transform: translateY(0) rotate(0deg); opacity: 0.7; border-radius: 50%; }
    25% { transform: translateY(20px) rotate(-90deg); opacity: 0.9; border-radius: 40%; }
    50% { transform: translateY(40px) rotate(-180deg); opacity: 0.6; border-radius: 60%; }
    75% { transform: translateY(20px) rotate(-270deg); opacity: 0.8; border-radius: 55%; }
    100% { transform: translateY(0) rotate(-360deg); opacity: 0.7; border-radius: 50%; }
`;

// --- COMPONENT STYLING ---
const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(6),
    borderRadius: '25px',
    background: 'linear-gradient(145deg, #ffffff, #fef5f8)',
    boxShadow: '0 20px 50px rgba(255, 100, 150, 0.25)',
    transition: 'all 0.4s ease-in-out',
    '&:hover': {
        boxShadow: '0 30px 70px rgba(255, 100, 150, 0.4)',
        transform: 'translateY(-5px)',
    },
    maxWidth: '500px',
    width: '100%',
    position: 'relative',
    zIndex: 2,
}));

// --- MAIN LOGIN PAGE COMPONENT ---
const LoginPage = () => {

    const router = useRouter();
    const { t } = useTranslation('common');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('info');

    // --- CAPTCHA state variables ---
    const [isCaptchaEnabled, setIsCaptchaEnabled] = useState(false);
    const [captchaText, setCaptchaText] = useState('');
    const [captchaInput, setCaptchaInput] = useState('');
    const [captchaError, setCaptchaError] = useState('');
    const canvasRef = useRef(null);

    // --- Xato holatini saqlash uchun state'lar ---
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [captchaInputError, setCaptchaInputError] = useState('');

    // --- Redirects authenticated users from this page ---
    useEffect(() => {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        if (token || user) {
            router.replace('/dashboard');
        }
    }, [router]);

    // --- Fetches CAPTCHA status on component mount ---
    useEffect(() => {
        const fetchCaptchaStatus = async () => {
            try {
                const response = await api.get('/settings/captcha-status');
                if (response.data.enable_captcha) {
                    setIsCaptchaEnabled(true);
                }
            } catch (error) {
                // Terminalda xato chiqmasligi uchun log olib tashlandi.
            }
        };
        fetchCaptchaStatus();
    }, []);

    // --- CAPTCHA yoqilgan bo'lsa, uni yaratish
    useEffect(() => {
        if (isCaptchaEnabled) {
            generateCaptcha();
        }
    }, [isCaptchaEnabled]);

    // --- CAPTCHA rasmini canvasda yaratish funksiyasi ---
    const generateCaptcha = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let newCaptchaText = '';
        for (let i = 0; i < 6; i++) {
            newCaptchaText += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setCaptchaText(newCaptchaText);
        setCaptchaInput('');
        setCaptchaError('');

        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Foni va chiziqlar
        ctx.fillStyle = '#fef5f8';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = '#ff6384';
        ctx.lineWidth = 1;
        for (let i = 0; i < 10; i++) {
            ctx.beginPath();
            ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
            ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
            ctx.stroke();
        }

        ctx.font = 'bold 28px Arial';
        ctx.fillStyle = '#d81b60';
        ctx.textBaseline = 'middle';
        ctx.fillText(newCaptchaText, 10, canvas.height / 2);
    };

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        setSnackbarOpen(false);

        // Hato state'larini tozalash
        setEmailError('');
        setPasswordError('');
        setCaptchaInputError('');

        // --- Frontend validatsiyasi ---
        if (!email) {
            setEmailError(t('emailRequired'));
            setSnackbarMessage(t('emailRequired'));
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            setLoading(false);
            return;
        }
        if (!password) {
            setPasswordError(t('passwordRequired'));
            setSnackbarMessage(t('passwordRequired'));
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            setLoading(false);
            return;
        }
        if (isCaptchaEnabled && captchaInput.toLowerCase() !== captchaText.toLowerCase()) {
            setCaptchaInputError(t('captchaInvalid'));
            setSnackbarMessage(t('captchaInvalid'));
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            generateCaptcha(); // Xato bo'lsa, yangi CAPTCHA yaratish
            setLoading(false);
            return;
        }

        try {
            // --- CORS and CSRF cookie for (important) ---
            const csrfAxios = axios.create({
                baseURL: process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || "https://68ac5f519148d.xvest1.ru",
                withCredentials: true,
            });
            await csrfAxios.get('/sanctum/csrf-cookie');

            const payload: any = { email, password };
            const response = await api.post('/login', payload);

            setSnackbarMessage(response.data.message || t('loginSuccess'));
            setSnackbarSeverity('success');
            setSnackbarOpen(true);

            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
            }
            if (response.data.user) {
                localStorage.setItem('user', JSON.stringify(response.data.user));
                const user = response.data.user;
                if (!user.email_verified_at) {
                    setSnackbarMessage(t('emailNotVerified'));
                    setSnackbarSeverity('info');
                    router.push('/verify-email');
                } else {
                    router.push('/dashboard');
                }
            } else {
                router.push('/dashboard');
            }

        } catch (error: any) {
            setLoading(false);

            let errorMessage = t('loginError');
            if (isCaptchaEnabled) {
                generateCaptcha(); // Xato bo'lganda CAPTCHA'ni yangilash
            }

            if (axios.isAxiosError(error) && error.response && error.response.data) {
                const responseData = error.response.data;

                if (responseData.email_not_verified) {
                    errorMessage = responseData.message || t('emailNotVerified');
                    setSnackbarSeverity('info');
                } else if (responseData.errors) {
                    const validationErrors = Object.values(responseData.errors).flat();
                    errorMessage = validationErrors.join(' ');
                    setSnackbarSeverity('error');
                } else if (responseData.message) {
                    errorMessage = responseData.message;
                    setSnackbarSeverity('error');
                }
            } else {
                errorMessage = t('networkError');
                setSnackbarSeverity('error');
            }

            setSnackbarMessage(errorMessage);
            setSnackbarOpen(true);
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(45deg, #ffe0f0 0%, #d8eaff 100%)',
                backgroundSize: '200% 200%',
                animation: `${slideBg} 20s ease infinite`,
                position: 'relative',
                overflow: 'hidden',
                py: 4,
                px: 2,
            }}
        >
            {/* --- BACKGROUND ANIMATED ELEMENTS --- */}
            <Box
                sx={{
                    position: 'absolute', top: '10%', left: '15%', width: '80px', height: '80px',
                    bgcolor: 'rgba(255, 200, 220, 0.7)', borderRadius: '50%',
                    animation: `${floatUp} 10s infinite ease-in-out alternate`, zIndex: 1,
                }}
            />
            <Box
                sx={{
                    position: 'absolute', bottom: '15%', right: '10%', width: '100px', height: '100px',
                    bgcolor: 'rgba(200, 220, 255, 0.7)', borderRadius: '50%',
                    animation: `${floatDown} 12s infinite ease-in-out alternate-reverse`, zIndex: 1,
                }}
            />
            <Box
                sx={{
                    position: 'absolute', top: '50%', left: '5%', width: '60px', height: '60px',
                    bgcolor: 'rgba(255, 230, 200, 0.7)', borderRadius: '50%',
                    animation: `${floatUp} 8s infinite ease-in-out alternate-reverse`, zIndex: 1,
                }}
            />
            <Box
                sx={{
                    position: 'absolute', top: '20%', right: '5%', width: '70px', height: '70px',
                    bgcolor: 'rgba(230, 200, 255, 0.7)', borderRadius: '50%',
                    animation: `${floatDown} 9s infinite ease-in-out alternate`, zIndex: 1,
                }}
            />
            <Box
                sx={{
                    position: 'absolute', bottom: '5%', left: '30%', width: '90px', height: '90px',
                    bgcolor: 'rgba(255, 200, 255, 0.7)', borderRadius: '50%',
                    animation: `${floatUp} 11s infinite ease-in-out alternate`, zIndex: 1,
                }}
            />

            <StyledPaper>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 4, color: '#d81b60', textAlign: 'center' }}>
                    {t('loginTitle')}
                </Typography>
                <Box component="form" noValidate onSubmit={handleLogin} sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label={t('emailLabel')}
                        name="email"
                        autoComplete="email"
                        autoFocus
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setEmailError('');
                        }}
                        error={!!emailError}
                        helperText={emailError}
                        sx={{
                            mb: 2,
                            '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#ff6384' }, '&:hover fieldset': { borderColor: '#d81b60', borderWidth: '2px' }, '&.Mui-focused fieldset': { borderColor: '#d81b60', borderWidth: '2px' }, },
                            '& .MuiInputLabel-root': { color: '#ff6384' },
                            '& .MuiInputLabel-root.Mui-focused': { color: '#d81b60' },
                        }}
                        InputProps={{
                            startAdornment: (<InputAdornment position="start"><EmailIcon sx={{ color: '#ff6384' }} /></InputAdornment>),
                        }}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label={t('passwordLabel')}
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setPasswordError('');
                        }}
                        error={!!passwordError}
                        helperText={passwordError}
                        sx={{
                            mb: 1,
                            '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#ff6384' }, '&:hover fieldset': { borderColor: '#d81b60', borderWidth: '2px' }, '&.Mui-focused fieldset': { borderColor: '#d81b60', borderWidth: '2px' }, },
                            '& .MuiInputLabel-root': { color: '#ff6384' },
                            '& .MuiInputLabel-root.Mui-focused': { color: '#d81b60' },
                        }}
                        InputProps={{
                            startAdornment: (<InputAdornment position="start"><LockOutlinedIcon sx={{ color: '#ff6384' }} /></InputAdornment>),
                            endAdornment: (<InputAdornment position="end"><IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword} edge="end">{showPassword ? <Visibility /> : <VisibilityOff />}</IconButton></InputAdornment>),
                        }}
                    />
                    {/* --- CAPTCHA UI: Faqat yoqilgan bo'lsa ko'rinadi. --- */}
                    {isCaptchaEnabled && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, my: 2 }}>
                            <canvas
                                ref={canvasRef}
                                width="120"
                                height="40"
                                className="border rounded-lg"
                                style={{ border: `1px solid ${captchaInputError ? '#d32f2f' : '#ff6384'}` }}
                            ></canvas>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="captcha"
                                label={t('captchaLabel')}
                                id="captcha"
                                value={captchaInput}
                                onChange={(e) => {
                                    setCaptchaInput(e.target.value);
                                    setCaptchaInputError('');
                                }}
                                error={!!captchaInputError}
                                helperText={captchaInputError}
                                sx={{
                                    '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#ff6384' }, '&:hover fieldset': { borderColor: '#d81b60', borderWidth: '2px' }, '&.Mui-focused fieldset': { borderColor: '#d81b60', borderWidth: '2px' }, },
                                    '& .MuiInputLabel-root': { color: '#ff6384' },
                                    '& .MuiInputLabel-root.Mui-focused': { color: '#d81b60' },
                                }}
                            />
                            <IconButton onClick={generateCaptcha} color="primary" sx={{ color: '#d81b60' }}>
                                <RefreshCcw size={20} />
                            </IconButton>
                        </Box>
                    )}
                    
                    <Link href="/forgot-password" variant="body2" sx={{ color: '#d81b60', fontWeight: 'medium', display: 'block', mb: 3, textAlign: 'right', '&:hover': { textDecoration: 'underline' } }}>
                        {t('forgotPassword')}
                    </Link>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{
                            mt: 3, mb: 2, py: 1.8,
                            borderRadius: '12px',
                            background: 'linear-gradient(45deg, #ff5f7f 30%, #ff8c6d 90%)',
                            boxShadow: '0 5px 15px 5px rgba(255, 105, 135, .4)',
                            transition: 'all 0.3s ease',
                            '&:hover': { background: 'linear-gradient(45deg, #ff4d6d 30%, #ff7f5f 90%)', boxShadow: '0 8px 20px 8px rgba(255, 105, 135, .6)', transform: 'translateY(-2px)', },
                            fontSize: '1.1rem', fontWeight: 'bold',
                        }}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : t('loginButton')}
                    </Button>
                    <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 3 }}>
                        {t('noAccount')} {' '}
                        <Link href="/register" variant="body2" sx={{ color: '#d81b60', fontWeight: 'medium', '&:hover': { textDecoration: 'underline' } }}>
                            {t('registerLink')}
                        </Link>
                    </Typography>
                </Box>
            </StyledPaper>

            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default LoginPage;
