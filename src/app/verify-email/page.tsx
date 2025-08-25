'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Link,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import { styled } from '@mui/system';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import SendIcon from '@mui/icons-material/Send';
import { keyframes } from '@emotion/react';
import { useRouter } from 'next/navigation';
import api from '@/util/api';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

// --- ANIMATIONS ---
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;
const pulse = keyframes`
  0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(106, 27, 154, 0.5); }
  70% { transform: scale(1.05); box-shadow: 0 0 0 15px rgba(106, 27, 154, 0); }
  100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(106, 27, 154, 0); }
`;

// --- COMPONENT STYLES ---
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(6, 4),
  borderRadius: '25px',
  background: 'rgba(255, 255, 255, 0.85)',
  backdropFilter: 'blur(15px)',
  WebkitBackdropFilter: 'blur(15px)', // For Safari support
  boxShadow: '0 15px 40px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.4s ease-in-out',
  maxWidth: '550px',
  width: '100%',
  position: 'relative',
  zIndex: 2,
  textAlign: 'center',
  animation: `${fadeIn} 0.8s ease-out`,
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.15)',
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  mt: 3,
  py: 1.5,
  borderRadius: '12px',
  background: 'linear-gradient(45deg, #6a1b9a 30%, #ab47bc 90%)',
  boxShadow: '0 5px 15px 5px rgba(106, 27, 154, .3)',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'linear-gradient(45deg, #7b1fa2 30%, #ba68c8 90%)',
    boxShadow: '0 8px 20px 8px rgba(106, 27, 154, .5)',
    transform: 'translateY(-2px)',
  },
  fontSize: '1.1rem',
  fontWeight: 'bold',
  color: 'white',
  '&.Mui-disabled': {
    background: 'linear-gradient(45deg, #ccc 30%, #ddd 90%)',
    color: '#888',
    boxShadow: 'none',
  },
}));

const VerifyEmailPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info'>('info');
  const [canResend, setCanResend] = useState(true);
  const [countdown, setCountdown] = useState(60);
  const [isVerifyingStatus, setIsVerifyingStatus] = useState(true);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const { t } = useTranslation('common');

  useEffect(() => {
    const checkVerificationStatus = async () => {
      setIsVerifyingStatus(true);
      const token = localStorage.getItem('token');

      if (!token) {
        setSnackbarMessage(t('snackbar_messages.unauthenticated'));
        setSnackbarSeverity('info');
        setSnackbarOpen(true);
        setIsVerifyingStatus(false);
        return;
      }

      try {
        const csrfAxios = axios.create({
          baseURL: process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || "https://68ac5f519148d.xvest1.ru",
          withCredentials: true,
        });
        await csrfAxios.get('/sanctum/csrf-cookie');

        const response = await api.get('/user', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const user = response.data;

        if (user && user.email) {
          setUserEmail(user.email);
        }

        if (user && user.email_verified_at !== null && user.email_verified_at !== undefined) {
          setIsEmailVerified(true);
          setSnackbarMessage(t('snackbar_messages.already_verified'));
          setSnackbarSeverity('success');
          setSnackbarOpen(true);
          localStorage.setItem('user', JSON.stringify(user));
        } else {
          setIsEmailVerified(false);
          setSnackbarMessage(t('snackbar_messages.check_email'));
          setSnackbarSeverity('info');
          setSnackbarOpen(true);
        }
      } catch (error: any) {
        let errorMessage = t('snackbar_messages.user_data_fetch_error');
        if (error.response && error.response.status === 401) {
            errorMessage = t('snackbar_messages.session_expired');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        } else if (error.response && error.response.data && error.response.data.message) {
            errorMessage = error.response.data.message;
        } else if (error.message === 'Network Error') {
            errorMessage = t('snackbar_messages.network_error');
        }
        setSnackbarMessage(errorMessage);
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      } finally {
        setIsVerifyingStatus(false);
      }
    };

    checkVerificationStatus();
  }, [router, t]);

  // Cooldown timer logic for resending email
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (!canResend && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [canResend, countdown]);

  const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleResendVerification = async () => {
    if (!userEmail) {
        setSnackbarMessage(t('snackbar_messages.email_not_found'));
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        return;
    }
    if (isEmailVerified) {
        setSnackbarMessage(t('snackbar_messages.already_verified'));
        setSnackbarSeverity('info');
        setSnackbarOpen(true);
        return;
    }

    setLoading(true);
    setSnackbarOpen(false);
    setCanResend(false);
    setCountdown(60);

    try {
      const csrfAxios = axios.create({
        baseURL: process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || "https://68ac5f519148d.xvest1.ru",
        withCredentials: true,
      });
      await csrfAxios.get('/sanctum/csrf-cookie');

      const response = await api.post('/email/verification-notification', { email: userEmail }, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      setSnackbarMessage(response.data.message || t('snackbar_messages.resend_success'));
      setSnackbarSeverity('success');
      setSnackbarOpen(true);

    } catch (error: any) {
      let errorMessage = t('snackbar_messages.resend_fail');
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      } else if (error.message === 'Network Error') {
        errorMessage = t('snackbar_messages.network_error');
      }
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      setCanResend(true);
      setCountdown(0);
    } finally {
      setLoading(false);
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
        background: 'linear-gradient(45deg, #e3f2fd 0%, #ede7f6 100%)',
        backgroundSize: '200% 200%',
        animation: `${pulse} 15s ease infinite`,
        position: 'relative',
        overflow: 'hidden',
        py: 4,
        px: 2,
      }}
    >
      <StyledPaper elevation={3}>
        {isVerifyingStatus ? (
          // Loading state
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
            <CircularProgress sx={{ color: '#6a1b9a', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">{t('email_verification.loading_status')}</Typography>
          </Box>
        ) : isEmailVerified ? (
          // Email verified state
          <Box>
            <CheckCircleOutlineIcon sx={{ fontSize: 80, color: '#4caf50', mb: 2 }} />
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 2, color: '#333' }}>
              {t('email_verification.success_title')}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {t('email_verification.success_description')}
            </Typography>
            <Box sx={{ mt: 3 }}>
              <Link href="/login" variant="body2" sx={{ color: '#3f51b5', fontWeight: 'medium', '&:hover': { textDecoration: 'underline' } }}>
                {t('email_verification.back_to_login')}
              </Link>
            </Box>
          </Box>
        ) : (
          // Email not verified state
          <>
            <EmailOutlinedIcon sx={{ fontSize: 80, color: '#6a1b9a', mb: 2, animation: `${pulse} 2s infinite` }} />
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 2, color: '#333' }}>
              {t('email_verification.title')}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {t('email_verification.description_1')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
              {t('email_verification.description_2')}
            </Typography>

            <StyledButton
              variant="contained"
              onClick={handleResendVerification}
              disabled={loading || !canResend || !userEmail}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
            >
              {loading
                ? t('email_verification.resending_button')
                : canResend
                ? t('email_verification.resend_button')
                : `${t('email_verification.resend_cooldown')} ${countdown}s`}
            </StyledButton>

            <Box sx={{ mt: 3 }}>
              <Link href="/login" variant="body2" sx={{ color: '#3f51b5', fontWeight: 'medium', '&:hover': { textDecoration: 'underline' } }}>
                {t('email_verification.back_to_login')}
              </Link>
            </Box>
          </>
        )}
      </StyledPaper>

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default VerifyEmailPage;