'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Container,
  Paper,
  MenuItem,
  Snackbar,
  Alert,
  Avatar as MuiAvatar,
} from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import BottomNav from '@/components/layout/BottomNav';
import { useTranslation } from 'react-i18next';

// --- ANIMATIONS & STYLES ---

// Keyframes for the background elements' animation
const float = keyframes`
  0% { transform: translateY(0) rotate(0deg); opacity: 0.7; }
  25% { transform: translateY(-50px) rotate(25deg); opacity: 0.8; }
  50% { transform: translateY(-100px) rotate(50deg); opacity: 0.6; }
  75% { transform: translateY(-50px) rotate(25deg); opacity: 0.7; }
  100% { transform: translateY(0) rotate(0deg); opacity: 0.7; }
`;

const floatAlternate = keyframes`
  0% { transform: translateY(0) rotate(0deg); opacity: 0.6; }
  50% { transform: translateY(-70px) rotate(-45deg); opacity: 0.8; }
  100% { transform: translateY(0) rotate(0deg); opacity: 0.6; }
`;

// Keyframes for the main content to fade in
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

// New Keyframes for the creative loader
const bounce = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
`;

// New Color Palette for a fresh, modern look
const colors = {
  pageBackground: 'linear-gradient(135deg, #2C2A4A 0%, #1B1A36 100%)',
  cardBackground: '#FFFFFF',
  primaryAccent: '#7E57C2',
  secondaryAccent: '#9575CD',
  textColor: '#212121',
  lightTextColor: '#757575',
  inputBorder: '#D1C4E9',
  inputFocusBorder: '#7E57C2',
  buttonGradient: 'linear-gradient(45deg, #7E57C2 30%, #9575CD 90%)',
  buttonShadow: '0 4px 15px rgba(126, 87, 194, 0.4)',
  hoverButtonGradient: 'linear-gradient(45deg, #9575CD 30%, #7E57C2 90%)',
  hoverButtonShadow: '0 6px 20px rgba(126, 87, 194, 0.6)',
  avatarBorder: '#7E57C2',
  avatarHoverBorder: '#9575CD',
};

// --- COMPONENT STYLES ---
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(5),
  },
  borderRadius: '16px',
  backgroundColor: colors.cardBackground,
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
  border: `1px solid ${colors.inputBorder}`,
  animation: `${fadeIn} 0.8s ease-out forwards`,
  maxWidth: '500px',
  width: '100%',
  position: 'relative',
  zIndex: 10, // Ensure form is on top of background animation
}));

// Background animation container
const AnimatedBackground = styled(Box)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 1; // Ensure background is behind everything
  
  & > div {
    position: absolute;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(5px);
    border-radius: 50%;
    animation: ${float} 20s linear infinite, ${floatAlternate} 25s ease-in-out infinite alternate;
  }
  
  // Individual animated shapes
  & > div:nth-of-type(1) {
    width: 200px;
    height: 200px;
    top: 10%;
    left: 20%;
    animation-delay: 0s;
  }
  & > div:nth-of-type(2) {
    width: 150px;
    height: 150px;
    bottom: 5%;
    right: 15%;
    background: rgba(150, 150, 255, 0.15);
    animation-delay: 5s;
    animation-duration: 25s;
  }
  & > div:nth-of-type(3) {
    width: 100px;
    height: 100px;
    top: 50%;
    left: 5%;
    background: rgba(255, 200, 200, 0.1);
    animation-delay: 10s;
    animation-duration: 18s;
  }
  & > div:nth-of-type(4) {
    width: 180px;
    height: 180px;
    bottom: 20%;
    left: 30%;
    background: rgba(255, 255, 255, 0.05);
    animation-delay: 8s;
    animation-duration: 22s;
  }
  & > div:nth-of-type(5) {
    width: 120px;
    height: 120px;
    top: 15%;
    right: 5%;
    background: rgba(255, 255, 255, 0.15);
    animation-delay: 3s;
    animation-duration: 28s;
  }
`;

// New styled component for the creative loader
const CreativeLoaderContainer = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  flex-direction: column;
  background: ${colors.pageBackground};
  color: #fff;
`;

const CreativeLoaderDots = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CreativeLoaderDot = styled('span')`
  width: 20px;
  height: 20px;
  background-color: ${colors.secondaryAccent};
  border-radius: 50%;
  margin: 0 8px;
  animation: ${bounce} 1.2s infinite ease-in-out;
  
  &:nth-of-type(1) {
    animation-delay: 0s;
  }
  &:nth-of-type(2) {
    animation-delay: 0.2s;
  }
  &:nth-of-type(3) {
    animation-delay: 0.4s;
  }
`;

// User data interface (should match your profile fields)
interface UserProfileData {
  name: string;
  gender: string;
  age_range: string;
  country: string;
  language: string;
}

const ProfileSetupPage: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { t } = useTranslation('common');

  // State for profile data
  const [profileData, setProfileData] = useState<UserProfileData>({
    name: '',
    gender: '',
    age_range: '',
    country: '',
    language: '',
  });

  // States for avatar
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // Snackbar (notification message) states
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('info');

  const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  useEffect(() => {
    const fetchExistingProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setSnackbarMessage('You are not logged in. Please log in to your account.');
        setSnackbarSeverity('warning');
        setSnackbarOpen(true);
        router.push('/login');
        return;
      }

      try {
        const response = await axios.get(`https://68ac5f519148d.xvest1.ru/api/user`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
          withCredentials: true,
        });

        const apiUser = response.data;
        if (apiUser?.profile) {
          setProfileData({
            name: apiUser.name || '',
            gender: apiUser.profile.gender || '',
            age_range: apiUser.profile.age_range || '',
            country: apiUser.profile.country || '',
            language: apiUser.profile.language || '',
          });
        }
        if (apiUser?.current_avatar?.path) {
          setAvatarPreview(`${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${apiUser.current_avatar.path}`);
        }
      } catch (error: any) {
        setSnackbarMessage('Error loading profile data.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        localStorage.removeItem('token');
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchExistingProfile();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const token = localStorage.getItem('token');

    if (!token) {
      setSnackbarMessage('You are not logged in. Please log in to your account.');
      setSnackbarSeverity('warning');
      setSnackbarOpen(true);
      setSaving(false);
      router.push('/login');
      return;
    }

    try {
      await axios.put(`68ac5f519148d.xvest1.ru/api/profile`, profileData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });

      if (avatarFile) {
        const formData = new FormData();
        formData.append('avatar', avatarFile);

        await axios.post(`68ac5f519148d.xvest1.ru/api/profile/avatar`, formData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
          withCredentials: true,
        });
      }

      setSnackbarMessage('Profile successfully saved and avatar uploaded!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      
      router.push('/dashboard'); 

    } catch (error: any) {
      setSnackbarMessage('Error saving profile.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <CreativeLoaderContainer>
        <CreativeLoaderDots>
          <CreativeLoaderDot />
          <CreativeLoaderDot />
          <CreativeLoaderDot />
        </CreativeLoaderDots>
      </CreativeLoaderContainer>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: colors.pageBackground,
        py: 4,
        px: 2,
        position: 'relative', // Relative positioning is needed for absolute children
      }}
    >
      {/* Background Animation Layer */}
      <AnimatedBackground>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </AnimatedBackground>
      
      <Container maxWidth="sm">
        <StyledPaper>
          <Button
            onClick={() => router.push('/dashboard')}
            variant="outlined"
            sx={{
              mb: 2,
              animation: `${fadeIn} 0.6s ease-out`,
              borderColor: colors.primaryAccent,
              color: colors.primaryAccent,
              fontWeight: 'bold',
              textTransform: 'none',
              '&:hover': {
                borderColor: colors.secondaryAccent,
                backgroundColor: '#E0F7FA',
              },
            }}
          >
            ← Back to Dashboard
          </Button>

          <Typography variant="h5" component="h1" gutterBottom align="center" sx={{ mb: 3, fontWeight: 'bold', color: colors.textColor }}>
            Complete Your Profile
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
            <MuiAvatar 
              src={avatarPreview || '/default-avatar.png'}
              alt="Profile Avatar"
              sx={{ 
                width: 140,
                height: 140,
                mb: 2,
                border: `4px solid ${colors.avatarBorder}`,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s ease-in-out, border-color 0.3s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.05)',
                  borderColor: colors.avatarHoverBorder,
                }
              }}
            />
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="avatar-upload-button"
              type="file"
              onChange={handleAvatarChange}
            />
            <label htmlFor="avatar-upload-button">
              <Button 
                variant="contained"
                component="span" 
                startIcon={<PhotoCamera />}
                sx={{
                  background: colors.buttonGradient,
                  color: '#FFFFFF',
                  borderRadius: '8px',
                  boxShadow: colors.buttonShadow,
                  '&:hover': {
                    background: colors.hoverButtonGradient,
                    boxShadow: colors.hoverButtonShadow,
                    transform: 'translateY(-2px)',
                  },
                  textTransform: 'none',
                  px: 3,
                  py: 1.2,
                }}
              >
                Upload Avatar
              </Button>
            </label>
            {avatarFile && (
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1, color: colors.lightTextColor }}>
                Selected file: {avatarFile.name}
              </Typography>
            )}
          </Box>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              margin="normal"
              label="Name"
              name="name"
              value={profileData.name}
              onChange={handleChange}
              required
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  '& fieldset': { borderColor: colors.inputBorder },
                  '&:hover fieldset': { borderColor: colors.inputFocusBorder, borderWidth: '2px' },
                  '&.Mui-focused fieldset': { borderColor: colors.inputFocusBorder, borderWidth: '2px' },
                },
                '& .MuiInputLabel-root': { color: colors.lightTextColor },
                '& .MuiInputLabel-root.Mui-focused': { color: colors.primaryAccent },
              }}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Gender"
              name="gender"
              select
              value={profileData.gender}
              onChange={handleChange}
              required
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  '& fieldset': { borderColor: colors.inputBorder },
                  '&:hover fieldset': { borderColor: colors.inputFocusBorder, borderWidth: '2px' },
                  '&.Mui-focused fieldset': { borderColor: colors.inputFocusBorder, borderWidth: '2px' },
                },
                '& .MuiInputLabel-root': { color: colors.lightTextColor },
                '& .MuiInputLabel-root.Mui-focused': { color: colors.primaryAccent },
              }}
            >
              <MenuItem value="">Select</MenuItem>
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="female">Female</MenuItem>
              <MenuItem value="couple">Couple</MenuItem>
              <MenuItem value="unspecified">Unspecified</MenuItem>
            </TextField>
            <TextField
              fullWidth
              margin="normal"
              label="Age Range"
              name="age_range"
              value={profileData.age_range}
              onChange={handleChange}
              placeholder="e.g., 20-30"
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  '& fieldset': { borderColor: colors.inputBorder },
                  '&:hover fieldset': { borderColor: colors.inputFocusBorder, borderWidth: '2px' },
                  '&.Mui-focused fieldset': { borderColor: colors.inputFocusBorder, borderWidth: '2px' },
                },
                '& .MuiInputLabel-root': { color: colors.lightTextColor },
                '& .MuiInputLabel-root.Mui-focused': { color: colors.primaryAccent },
              }}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Country"
              name="country"
              value={profileData.country}
              onChange={handleChange}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  '& fieldset': { borderColor: colors.inputBorder },
                  '&:hover fieldset': { borderColor: colors.inputFocusBorder, borderWidth: '2px' },
                  '&.Mui-focused fieldset': { borderColor: colors.inputFocusBorder, borderWidth: '2px' },
                },
                '& .MuiInputLabel-root': { color: colors.lightTextColor },
                '& .MuiInputLabel-root.Mui-focused': { color: colors.primaryAccent },
              }}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Language"
              name="language"
              value={profileData.language}
              onChange={handleChange}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  '& fieldset': { borderColor: colors.inputBorder },
                  '&:hover fieldset': { borderColor: colors.inputFocusBorder, borderWidth: '2px' },
                  '&.Mui-focused fieldset': { borderColor: colors.inputFocusBorder, borderWidth: '2px' },
                },
                '& .MuiInputLabel-root': { color: colors.lightTextColor },
                '& .MuiInputLabel-root.Mui-focused': { color: colors.primaryAccent },
              }}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ 
                mt: 3, 
                mb: 2,
                py: 1.5,
                borderRadius: '10px',
                background: colors.buttonGradient,
                boxShadow: colors.buttonShadow,
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: colors.hoverButtonGradient,
                  boxShadow: colors.hoverButtonShadow,
                  transform: 'translateY(-2px)',
                },
                fontSize: '1.05rem',
                fontWeight: 'bold',
                color: '#FFFFFF',
              }}
              disabled={saving}
            >
              {saving ? <CircularProgress size={24} color="inherit" /> : 'Save Profile'}
            </Button>
          </form>
        </StyledPaper>
      </Container>

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <BottomNav />
    </Box>
  );
};

export default ProfileSetupPage;
