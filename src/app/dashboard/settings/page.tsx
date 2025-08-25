'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Stack,
  TextField,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
  useMediaQuery,
  useTheme,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  BottomNavigation,
  BottomNavigationAction,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Lock } from 'lucide-react';

const API_BASE_URL = 'http://localhost:8000/api';

/**
 * Backend API chaqiruvlari uchun yordamchi funksiya.
 * Bu funksiya HTTP sarlavhalari (headers), xatolarni qayta ishlash kabi ishlarni soddalashtiradi.
 * @param {string} endpoint - API manzili
 * @param {object} data - Yuboriladigan ma'lumot (agar bo'lsa)
 * @returns {Promise<any>}
 */
const api = {
  // 'endpoint' va 'data' parametrlari uchun tiplar qo'shildi
  post: async (endpoint: string, data: Record<string, any>) => {
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        // CSRF tokeni uchun:
        // 'X-CSRF-TOKEN': 'sizning-csrf-tokeningiz', // Backend'dan olingan CSRF tokenini shu yerga joylashtiring
      };

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Serverdan kutilmagan javob." }));
        throw { response: { data: errorData } };
      }

      return response.json();
    } catch (error: any) { // 'error' uchun 'any' tipi belgilandi
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw { isNetworkError: true, message: "Server bilan bog'lanishda xato. Iltimos, server ishlayotganiga ishonch hosil qiling." };
      }
      throw error;
    }
  }
};

/**
 * Mobil qurilmalar uchun pastki navigatsiya paneli.
 * @returns {JSX.Element}
 */
const BottomNav = () => {
  const router = useRouter();
  const pathname = usePathname();

  const navPaths = [
    '/dashboard',
    '/dashboard/search',
    '/profile-setup',
    '/dashboard/settings',
  ];

  const [value, setValue] = useState(navPaths.indexOf(pathname));

  useEffect(() => {
    const currentIndex = navPaths.indexOf(pathname);
    if (currentIndex !== -1) setValue(currentIndex);
  }, [pathname]);

  // 'event' va 'newValue' parametrlari uchun tiplar qo'shildi
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    router.push(navPaths[newValue]);
  };

  const backgroundColor = '#1A1A2E';
  const textColor = '#B5F8FE';
  const selectedColor = '#10FFCB';
  const hoverColor = '#FBD87F';

  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        display: { xs: 'block', sm: 'none' },
        bgcolor: backgroundColor,
        borderTop: `2px solid ${hoverColor}`,
        boxShadow: '0 -4px 10px rgba(0,0,0,0.1)',
      }}
      elevation={8}
    >
      <BottomNavigation
        value={value}
        onChange={handleChange}
        showLabels
        sx={{
          height: '70px',
          bgcolor: backgroundColor,
          '.Mui-selected': {
            color: selectedColor,
            fontWeight: 'bold',
          },
          '.MuiBottomNavigationAction-root': {
            minWidth: 'auto',
            padding: '8px 4px',
            color: textColor,
            '&:hover': {
              color: hoverColor,
            }
          },
        }}
      >
        <BottomNavigationAction label="Home" icon={<HomeIcon />} />
        <BottomNavigationAction label="Search" icon={<SearchIcon />} />
        <BottomNavigationAction label="Profile" icon={<PersonIcon />} />
        <BottomNavigationAction label="Settings" icon={<SettingsIcon />} />
      </BottomNavigation>
    </Paper>
  );
};

/**
 * Asosiy sozlamalar sahifasi komponenti.
 * @returns {JSX.Element}
 */
export default function Page() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeTab = searchParams.get('tab') || 'password';

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const isDarkMode = true;

  // 'e' parametri uchun tip qo'shildi
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    setPasswordError('');
  };

  // 'e' parametri uchun tip qo'shildi
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('Yangi parollar mos kelmadi.');
      return;
    }
    
    setIsChangingPassword(true);

    try {
      await api.post('/user/password', {
        current_password: passwordData.currentPassword,
        new_password: passwordData.newPassword,
        new_password_confirmation: passwordData.confirmPassword, // Ushbu qator qo'shildi
      });

      setPasswordSuccess(true);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setPasswordError('');

    } catch (error: any) { // 'error' uchun 'any' tipi belgilandi
      if (error.isNetworkError) {
        setPasswordError(error.message);
      } else if (error.response && error.response.data) {
        // 'errors' maydoni mavjudligini tekshirish
        const validationErrors = error.response.data.errors;
        if (validationErrors) {
            // Agar backend-dan validatsiya xatosi kelsa, uni foydalanuvchiga ko'rsatish
            const firstError = Object.values(validationErrors)[0] as string[];
            setPasswordError(firstError[0]);
        } else {
            const errorMessage = error.response.data.message || "Parolni o'zgartirishda xato yuz berdi.";
            setPasswordError(errorMessage);
        }
      } else {
        setPasswordError("Parolni o'zgartirishda noma'lum xato yuz berdi.");
      }
    } finally {
      setIsChangingPassword(false);
    }
  };

  const renderContent = () => {
    const textColor = isDarkMode ? '#10FFCB' : '#334155';
    const inputColor = isDarkMode ? '#B5F8FE' : '#0f172a';
    const inputBgColor = isDarkMode ? '#334155' : '#f8fafc';
    const inputBorderColor = isDarkMode ? '#475569' : '#e2e8f0';

    switch (activeTab) {
      case 'password':
        return (
          <form onSubmit={handleChangePassword}>
            <Stack spacing={3}>
              <Typography variant="h6" fontWeight="medium" sx={{ color: textColor }}>
                Parolni o'zgartirish
              </Typography>
              <TextField
                fullWidth
                label="Hozirgi parol"
                name="currentPassword"
                type="password"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                variant="outlined"
                InputLabelProps={{ style: { color: inputColor } }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: inputColor,
                    bgcolor: inputBgColor,
                    '& fieldset': { borderColor: inputBorderColor },
                    '&:hover fieldset': { borderColor: '#10FFCB' },
                    '&.Mui-focused fieldset': { borderColor: '#10FFCB' },
                  }
                }}
              />
              <TextField
                fullWidth
                label="Yangi parol"
                name="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                variant="outlined"
                InputLabelProps={{ style: { color: inputColor } }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: inputColor,
                    bgcolor: inputBgColor,
                    '& fieldset': { borderColor: inputBorderColor },
                    '&:hover fieldset': { borderColor: '#10FFCB' },
                    '&.Mui-focused fieldset': { borderColor: '#10FFCB' },
                  }
                }}
              />
              <TextField
                fullWidth
                label="Yangi parolni tasdiqlash"
                name="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                variant="outlined"
                InputLabelProps={{ style: { color: inputColor } }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: inputColor,
                    bgcolor: inputBgColor,
                    '& fieldset': { borderColor: inputBorderColor },
                    '&:hover fieldset': { borderColor: '#10FFCB' },
                    '&.Mui-focused fieldset': { borderColor: '#10FFCB' },
                  }
                }}
              />
              {passwordError && (
                <Typography color="error" variant="body2" sx={{ color: '#FBD87F' }}>
                  {passwordError}
                </Typography>
              )}
              <Button
                type="submit"
                variant="contained"
                disabled={isChangingPassword}
                sx={{ bgcolor: '#FBD87F', color: '#1A1A2E', '&:hover': { bgcolor: '#FBCF5E' }, borderRadius: '12px', fontWeight: 'bold' }}
              >
                {isChangingPassword ? <CircularProgress size={24} sx={{ color: '#1A1A2E' }} /> : "Parolni o'zgartirish"}
              </Button>
            </Stack>
          </form>
        );
      default:
        // 'tab' parametri uchun tip qo'shildi
        router.push('/dashboard/settings?tab=password');
        return null;
    }
  };

  // 'tab' parametri uchun tip qo'shildi
  const handleSidebarClick = (tab: string) => {
    router.push(`/dashboard/settings?tab=${tab}`);
  };

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        bgcolor: '#1A1A2E',
        color: '#FFFFFF',
        p: isMobile ? 2 : 4,
        fontFamily: 'Inter, sans-serif',
        transition: 'background-color 0.3s ease',
        pb: isMobile ? '70px' : 0
      }}
    >
      <Paper
        sx={{
          maxWidth: '1200px',
          mx: 'auto',
          borderRadius: '16px',
          bgcolor: '#1A1A2E',
          boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
          display: { xs: 'block', sm: 'flex' },
          overflow: 'hidden',
          border: `1px solid #2d3748`
        }}
      >
        <Box
          sx={{
            flexShrink: 0,
            width: { sm: '250px' },
            borderRight: { xs: 'none', sm: `1px solid #475569` },
            p: 3,
            bgcolor: '#1A1A2E',
          }}
        >
          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{
              mb: 3,
              color: '#B5F8FE',
              display: { xs: 'none', sm: 'block' }
            }}
          >
            Sozlamalar
          </Typography>
          <List
            component="nav"
            sx={{
              display: 'flex',
              flexDirection: { xs: 'row', sm: 'column' },
              overflowX: { xs: 'auto', sm: 'hidden' },
              '&::-webkit-scrollbar': { display: 'none' },
              msOverflowStyle: 'none',
              scrollbarWidth: 'none',
            }}
          >
            <ListItemButton
              selected={activeTab === 'password'}
              onClick={() => handleSidebarClick('password')}
              sx={{
                borderRadius: '8px',
                mb: { xs: 0, sm: 1 },
                mr: { xs: 1, sm: 0 },
                bgcolor: activeTab === 'password' ? '#2d3748' : 'transparent',
                '&:hover': { bgcolor: '#2d3748' },
              }}
            >
              <ListItemIcon sx={{ minWidth: { xs: 'auto', sm: '40px' } }}><Lock color={activeTab === 'password' ? '#10FFCB' : '#FFFFFF'} /></ListItemIcon>
              <ListItemText primary="Parol" sx={{ color: '#FFFFFF' }} />
            </ListItemButton>
          </List>
        </Box>

        <Box
          sx={{
            flexGrow: 1,
            p: isMobile ? 2 : 5,
            bgcolor: '#1A1A2E',
            color: '#B5F8FE',
          }}
        >
          {renderContent()}
        </Box>
      </Paper>

      {isMobile && (
        <BottomNav />
      )}

      <Snackbar open={passwordSuccess} autoHideDuration={6000} onClose={() => setPasswordSuccess(false)}>
        <Alert onClose={() => setPasswordSuccess(false)} severity="success" variant="filled" sx={{ bgcolor: '#10FFCB', color: '#1A1A2E', fontWeight: 'bold' }}>
          Parol muvaffaqiyatli o'zgartirildi!
        </Alert>
      </Snackbar>

      <Snackbar open={!!passwordError} autoHideDuration={6000} onClose={() => setPasswordError('')}>
        <Alert onClose={() => setPasswordError('')} severity="error" variant="filled" sx={{ bgcolor: '#FBD87F', color: '#1A1A2E', fontWeight: 'bold' }}>
          {passwordError}
        </Alert>
      </Snackbar>
    </Box>
  );
}
