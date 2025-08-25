'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Link,
  InputAdornment,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import { styled } from '@mui/system';
import EmailIcon from '@mui/icons-material/Email';
import { keyframes } from '@emotion/react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

// --- ANIMATIONS ---
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideBg = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// Styled component with responsive design improvements
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4, 3),
  borderRadius: '20px',
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.4s ease-in-out',
  animation: `${fadeIn} 0.8s ease-out`,
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 15px 40px rgba(0, 0, 0, 0.15)',
  },
  maxWidth: '450px',
  width: '100%',
  boxSizing: 'border-box',
  textAlign: 'center',
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(6, 4),
  },
}));

const ForgotPasswordPage = () => {
  const { t } = useTranslation('common');
  const [emailSent, setEmailSent] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info'>('info');

  const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setSnackbarOpen(false);

    try {
      if (!email) {
        setSnackbarMessage(t('notifications_f.email_required'));
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        setLoading(false);
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setSnackbarMessage(t('notifications_f.email_invalid'));
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        setLoading(false);
        return;
      }

      const csrfAxios = axios.create({
        baseURL: process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || "https://68ac5f519148d.xvest1.ru",
        withCredentials: true,
      });
      await csrfAxios.get('/sanctum/csrf-cookie');

      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/forgot-password/email`, { email }, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      setSnackbarMessage(response.data.message || t('notifications_f.reset_link_success'));
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      setEmailSent(true);

    } catch (error: any) {
      let errorMessage = t('notifications_f.reset_link_fail');
      if (error.response && error.response.data && error.response.data.errors) {
        const firstErrorKey = Object.keys(error.response.data.errors)[0];
        errorMessage = error.response.data.errors[firstErrorKey][0];
      } else if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      } else {
        errorMessage = error.message || t('notifications_f.network_error');
      }
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      setEmailSent(false);
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
        background: 'linear-gradient(45deg, #f0e6f9 0%, #dbe8f9 100%)',
        backgroundSize: '200% 200%',
        animation: `${slideBg} 15s ease infinite`,
        py: 4,
        px: 2,
        boxSizing: 'border-box',
      }}
    >
      <StyledPaper elevation={10}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 2, color: '#3f51b5' }}>
          {t('forgot_password.title')}
        </Typography>

        {!emailSent ? (
          <Box component="form" noValidate onSubmit={handleSubmit}>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              {t('forgot_password.instruction')}
            </Typography>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label={t('forgot_password.email_label')}
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon sx={{ color: '#6a1b9a' }} />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 2,
                py: 1.5,
                borderRadius: '10px',
                background: 'linear-gradient(45deg, #6a1b9a 30%, #ab47bc 90%)',
                boxShadow: '0 3px 5px 2px rgba(106, 27, 154, .3)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #7b1fa2 30%, #ba68c8 90%)',
                  boxShadow: '0 3px 8px 3px rgba(106, 27, 154, .5)',
                },
              }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : t('forgot_password.button_text')}
            </Button>
            <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 3 }}>
              <Link href="/login" variant="body2" sx={{ color: '#3f51b5', fontWeight: 'medium' }}>
                {t('forgot_password.back_to_login_link')}
              </Link>
            </Typography>
          </Box>
        ) : (
          <Box>
            <EmailIcon sx={{ fontSize: '5rem', color: '#4caf50', mb: 3 }} />
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1, color: '#333' }}>
              {t('forgot_password.success_title')}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              {t('forgot_password.success_message')}
            </Typography>
            <Button
              variant="contained"
              sx={{
                mt: 2,
                py: 1.5,
                borderRadius: '10px',
                background: 'linear-gradient(45deg, #6a1b9a 30%, #ab47bc 90%)',
                boxShadow: '0 3px 5px 2px rgba(106, 27, 154, .3)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #7b1fa2 30%, #ba68c8 90%)',
                  boxShadow: '0 3px 8px 3px rgba(106, 27, 154, .5)',
                },
              }}
              onClick={() => setEmailSent(false)}
            >
              {t('forgot_password.send_again_button')}
            </Button>
            <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 3 }}>
              <Link href="/login" variant="body2" sx={{ color: '#3f51b5', fontWeight: 'medium' }}>
                {t('forgot_password.back_to_login_link')}
              </Link>
            </Typography>
          </Box>
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

export default ForgotPasswordPage;