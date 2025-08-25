'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
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
import LockIcon from '@mui/icons-material/Lock';
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

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(6, 4),
  borderRadius: '25px',
  background: 'rgba(255, 255, 255, 0.85)',
  backdropFilter: 'blur(15px)',
  WebkitBackdropFilter: 'blur(15px)', // For Safari support
  boxShadow: '0 15px 40px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.4s ease-in-out',
  maxWidth: '500px',
  width: '100%',
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


const ResetPasswordPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t } = useTranslation('common');

  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info'>('info');

  useEffect(() => {
    const emailParam = searchParams.get('email');
    const tokenParam = searchParams.get('token');

    if (emailParam) setEmail(emailParam);
    if (tokenParam) setToken(tokenParam);
  }, [searchParams]);

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

    if (!email || !token || !password || !passwordConfirmation) {
      setSnackbarMessage(t('notifications_r.all_fields_required'));
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      setLoading(false);
      return;
    }
    if (password.length < 8) {
      setSnackbarMessage(t('notifications_r.password_length_error'));
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      setLoading(false);
      return;
    }
    if (password !== passwordConfirmation) {
      setSnackbarMessage(t('notifications_r.passwords_mismatch'));
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      setLoading(false);
      return;
    }

    try {
      const csrfAxios = axios.create({
        baseURL: process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || "https://68ac5f519148d.xvest1.ru",
        withCredentials: true,
      });
      await csrfAxios.get('/sanctum/csrf-cookie');

      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/forgot-password/reset`, {
        email,
        token,
        password,
        password_confirmation: passwordConfirmation,
      }, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      setSnackbarMessage(response.data.message || t('notifications_r.reset_success'));
      setSnackbarSeverity('success');
      setSnackbarOpen(true);

      router.push('/login');

    } catch (error: any) {
      let errorMessage = t('notifications_r.reset_fail');
      if (error.response && error.response.data && error.response.data.errors) {
        const firstErrorKey = Object.keys(error.response.data.errors)[0];
        errorMessage = error.response.data.errors[firstErrorKey][0];
      } else if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      } else {
        errorMessage = error.message || t('notifications_r.network_error');
      }
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
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
        animation: `${slideBg} 15s ease infinite`,
        py: 4,
        px: 2,
      }}
    >
      <StyledPaper>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 4, color: '#333' }}>
          {t('reset_password.title')}
        </Typography>

        <TextField
          margin="normal"
          fullWidth
          id="email-display"
          label={t('reset_password.email_label')}
          name="email-display"
          value={email}
          InputProps={{
            readOnly: true,
            startAdornment: (
              <InputAdornment position="start">
                <EmailIcon sx={{ color: '#6a1b9a' }} />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />

        <Box component="form" noValidate onSubmit={handleSubmit}>
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label={t('reset_password.new_password_label')}
            type="password"
            id="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 3 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon sx={{ color: '#6a1b9a' }} />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="passwordConfirmation"
            label={t('reset_password.confirm_password_label')}
            type="password"
            id="passwordConfirmation"
            autoComplete="new-password"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            sx={{ mb: 3 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon sx={{ color: '#6a1b9a' }} />
                </InputAdornment>
              ),
            }}
          />
          <StyledButton
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : t('reset_password.button_text')}
          </StyledButton>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 3 }}>
            <Link href="/login" variant="body2" sx={{ color: '#3f51b5', fontWeight: 'medium' }}>
              {t('reset_password.back_to_login_link')}
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

export default ResetPasswordPage;