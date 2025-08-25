'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Box, Typography, Snackbar, Alert, useTheme, useMediaQuery, CssBaseline } from '@mui/material';
import { useRouter } from 'next/navigation';
import Sidebar from './Sidebar';
import Header from './Header';
import axios from 'axios';
import { keyframes } from '@emotion/react';
import PartnerSearchContent from './PartnerSearchContent';
import BottomNav from '../layout/BottomNav';
import { useTranslation } from 'react-i18next';

// --- Interfaces (Unchanged from original) ---
interface UserSubscription {
  id: number;
  user_id: number;
  subscription_id: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  daily_searches_remaining: number;
  created_at: string;
  updated_at: string;
  subscription: {
    id: number;
    name: string;
    price: string;
    duration_days: number | null;
    created_at: string;
    updated_at: string;
  };
}

interface UserAvatar {
  id: number;
  user_id: number;
  path: string;
  is_current: boolean;
  created_at: string;
  updated_at: string;
}

interface UserProfileDetails {
  id?: number;
  user_id?: number;
  gender?: string | null;
  couple_type?: string | null;
  height?: number | null;
  weight?: number | null;
  hide_parameters?: boolean;
  age_range?: string | null;
  country?: string | null;
  language?: string | null;
  marital_status?: string | null;
  marital_partner_language?: string | null;
  children_count?: number | null;
  condition?: string[];
  situation_details?: string[];
  disability_type?: string | null;
  immigrant_country?: string | null;
  looking_for_gender?: string | null;
  looking_for_couple_details?: string | null;
  looking_for_height?: string | null;
  looking_for_weight?: string | null;
  intimacy_preference?: string | null;
  other_intimacy?: string | null;
  psychological_needs?: string[];
  psychological_needs_details?: string[];
  what_to_fulfill?: string[];
  skills_training_type?: string | null;
  interests?: Array<{ id: number; name: string; pivot?: { other_interest_text?: string; } }>;
  created_at?: string;
  updated_at?: string;
}

export interface UserData {
  id: number;
  name: string;
  email: string;
  avatar: string | null;
  role: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;

  profile?: UserProfileDetails | null;
  current_avatar?: UserAvatar | null;
  current_subscription?: UserSubscription | null;
}

// --- Animations (Updated) ---
const gradientShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const rotate3d = keyframes`
  0% { transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg); }
  100% { transform: rotateX(360deg) rotateY(360deg) rotateZ(360deg); }
`;

const sparkle = keyframes`
  0% { transform: scale(0) translate(0, 0); opacity: 0; }
  50% { transform: scale(1) translate(var(--sparkle-x), var(--sparkle-y)); opacity: 1; }
  100% { transform: scale(0) translate(var(--sparkle-x), var(--sparkle-y)); opacity: 0; }
`;

const textAppear = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const fadeOutLoader = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`;

// --- Layout Constants (Unchanged from original) ---
const drawerWidthCollapsed = 80;
const drawerWidthExpanded = 240;
const appBarHeight = 80;

// --- DashboardLayout Component ---
interface DashboardLayoutProps {
  children?: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const router = useRouter();
  const theme = useTheme();

  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expanded, setExpanded] = useState(true);
  const [showLoader, setShowLoader] = useState(true);
  const loaderRef = useRef<HTMLDivElement>(null);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('info');

  const [currentView, setCurrentView] = useState('search');
  const { t } = useTranslation('common');

  const colors = {
    mainBackground: '#122946ff',
    sidebarBackground: '#FFFFFF',
    sidebarHover: '#FFF0F3',
    primaryText: '#333333',
    secondaryText: '#666666',
    accentText: '#FF6B6B',
    loaderBg: 'linear-gradient(270deg, #1A202C, #2D3748, #1A202C)',
    loaderOrbital: '#4F46E5', // Indigo
    loaderText: '#FFFFFF',
    sparkleColor: '#E2E8F0', // Gray-200
    snackbarSuccess: '#4CAF50',
    snackbarError: '#F44336',
    snackbarInfo: '#2196F3',
    snackbarWarning: '#FF9800',
  };

  const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSidebarExpandToggle = () => {
    setExpanded((prev) => !prev);
  };

  const handleBottomNavChange = (newValue: string) => {
    setCurrentView(newValue);
  };

  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      setSnackbarMessage(t('login_messages.not_logged_in'));
      setSnackbarSeverity('warning');
      setSnackbarOpen(true);
      router.push('/login');
      setLoading(false);
      setShowLoader(false);
      return;
    }

    try {
      const response = await axios.get<UserData>(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        withCredentials: true,
      });

      const apiUser = response.data;

      if (!apiUser) {
        throw new Error(t('login_messages.no_user_data'));
      }

      const hasAvatar = apiUser.current_avatar?.path;

      if (!hasAvatar) {
        setSnackbarMessage(t('login_messages.no_avatar'));
        setSnackbarSeverity('warning');
        setSnackbarOpen(true);
        router.push('/profile-setup');
        setLoading(false);
        setShowLoader(false);
        return;
      }

      if (apiUser.current_avatar && !apiUser.avatar) {
        apiUser.avatar = `${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${apiUser.current_avatar.path}`;
        
      }

      setUser(apiUser);
      localStorage.setItem('user', JSON.stringify(apiUser));
      
    } catch (err: any) {
      setSnackbarMessage(t('login_messages.fetch_error'));
      setSnackbarSeverity('error');
      setSnackbarOpen(true);

      localStorage.removeItem('token');
      localStorage.removeItem('user');
      router.push('/login');
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 5000);
    }
  }, [router, t]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    if (!loading && showLoader) {
      const timer = setTimeout(() => {
        setShowLoader(false);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [loading, showLoader]);

  useEffect(() => {
    if (showLoader && loaderRef.current) {
      const loaderElement = loaderRef.current;
      const createStars = () => {
        for (let i = 0; i < 50; i++) {
          const star = document.createElement('div');
          star.classList.add('loader-star');
          star.style.top = `${Math.random() * 100}vh`;
          star.style.left = `${Math.random() * 100}vw`;
          star.style.animationDuration = `${Math.random() * 2 + 1}s`;
          loaderElement.appendChild(star);
        }
      };
      createStars();
    }
  }, [showLoader]);


  const handleLogout = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/logout`, {}, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
          withCredentials: true,
        });
        setSnackbarMessage(t('logout_messages.logout_success'));
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
      } catch (err) {
        setSnackbarMessage(t('logout_messages.logout_error'));
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const handleSearchPartners = async (filters: any) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    setSnackbarMessage(t('search_messages.search_complete'));
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
    await fetchUser();
  };

  const handleBuySearch = () => {
    setSnackbarMessage(t('search_messages.redirect_to_payment'));
    setSnackbarSeverity('info');
    setSnackbarOpen(true);
    router.push('/pricing');
  };

  if (showLoader) {
    return (
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: colors.loaderBg,
          backgroundSize: '200% 200%',
          animation: `${gradientShift} 15s ease infinite`,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center', // This CSS property centers the children horizontally
          zIndex: 9999,
          opacity: loading ? 1 : 0,
          transition: 'opacity 0.8s ease-out',
          pointerEvents: 'none',
        }}
      >
        <Box
          ref={loaderRef}
          sx={{
            position: 'relative',
            width: '150px',
            height: '150px',
            transformStyle: 'preserve-3d',
            animation: `${rotate3d} 10s linear infinite`,
          }}
        >
          {/* Orbita 1 */}
          <Box sx={{
            position: 'absolute',
            width: '150px',
            height: '150px',
            borderRadius: '50%',
            border: `2px dashed ${colors.loaderOrbital}80`,
            transform: 'rotateX(70deg)',
          }} />
          {/* Orbita 2 */}
          <Box sx={{
            position: 'absolute',
            width: '150px',
            height: '150px',
            borderRadius: '50%',
            border: `2px dashed ${colors.loaderOrbital}80`,
            transform: 'rotateY(70deg)',
          }} />
          {/* Orbita 3 */}
          <Box sx={{
            position: 'absolute',
            width: '150px',
            height: '150px',
            borderRadius: '50%',
            border: `2px dashed ${colors.loaderOrbital}80`,
            transform: 'rotateZ(70deg)',
          }} />
          {/* Markaziy doira */}
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '20px',
            height: '20px',
            bgcolor: colors.loaderOrbital,
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
            boxShadow: `0 0 15px ${colors.loaderOrbital}`,
          }} />
        </Box>
        <Typography
          variant="h4"
          component="h1"
          sx={{
            mt: 8,
            mb: 1,
            fontWeight: 'bold',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            animation: `${textAppear} 1s ease-out forwards`,
            animationDelay: '0.8s',
            fontSize: { xs: '1.8rem', sm: '2.5rem' },
            textAlign: 'center', // This CSS property centers the text content
            px: 2,
            color: colors.loaderText,
          }}
        >
          {t('loader_messages.loading_system')}
        </Typography>

        <Typography variant="h6" sx={{
          mt: 1,
          color: colors.loaderText,
          opacity: 0.9,
          animation: `${textAppear} 1s ease-out forwards`,
          animationDelay: '1.2s',
          fontSize: { xs: '1rem', sm: '1.3rem' },
          textAlign: 'center', // This CSS property centers the text content
          px: 2,
        }}>
          {t('loader_messages.checking_data')}
        </Typography>

        <style jsx global>{`
          @keyframes moveStar {
            from { transform: translateY(0); }
            to { transform: translateY(-100vh); }
          }
          .loader-star {
            position: absolute;
            width: 2px;
            height: 2px;
            background: white;
            border-radius: 50%;
            opacity: 0;
            animation: moveStar 10s linear infinite;
          }
        `}</style>
      </Box>
    );
  }

  if (!user && !loading) {
    return null;
  }

  const renderContent = () => {
    switch (currentView) {
      case 'search':
        return user ? (
          <PartnerSearchContent
            user={user}
            onSearch={handleSearchPartners}
            onBuySearch={handleBuySearch}
          />
        ) : null;
      case 'profile':
        return <Typography variant="h4" sx={{ p: 4, textAlign: 'center' }}>{t('view_titles.profile')}</Typography>;
      case 'messages':
        return <Typography variant="h4" sx={{ p: 4, textAlign: 'center' }}>{t('view_titles.messages')}</Typography>;
      case 'likes':
        return <Typography variant="h4" sx={{ p: 4, textAlign: 'center' }}>{t('view_titles.likes')}</Typography>;
      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        bgcolor: colors.mainBackground,
        overflowX: 'hidden',
      }}
    >
      <CssBaseline />

      <Header
        user={user}
        onLogout={handleLogout}
        handleDrawerToggle={handleDrawerToggle}
        isSidebarExpanded={expanded}
        mobileOpen={isSmallScreen && mobileOpen}
        isSmallScreen={isSmallScreen}
      />

      <Sidebar
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
        onLogout={handleLogout}
        onExpandToggle={handleSidebarExpandToggle}
        isSidebarExpanded={expanded}
        onNavigationChange={handleBottomNavChange}
        isSmallScreen={isSmallScreen}
        sx={{
          '& .MuiDrawer-paper': {
            bgcolor: colors.sidebarBackground,
            boxShadow: theme.shadows[1],
          },
          '& .MuiListItemButton-root:hover': {
            bgcolor: colors.sidebarHover,
          },
          '& .MuiSvgIcon-root': {
            color: colors.secondaryText,
          },
          '& .MuiListItemText-primary': {
            color: colors.primaryText,
          }
        }}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: {
            md: `calc(100% - ${expanded ? drawerWidthExpanded : drawerWidthCollapsed}px)`,
          },
          mt: `100px`,
          mb: { xs: '80px', md: 0 },
          bgcolor: colors.mainBackground,
          minHeight: `calc(100vh - ${appBarHeight}px - ${isSmallScreen ? '80px' : '0px'})`,
          color: colors.primaryText,
        }}
      >
        {renderContent()}
        {children}
      </Box>

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{
            width: '100%',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            bgcolor: snackbarSeverity === 'success' ? colors.snackbarSuccess :
                     snackbarSeverity === 'error' ? colors.snackbarError :
                     snackbarSeverity === 'info' ? colors.snackbarInfo :
                     snackbarSeverity === 'warning' ? colors.snackbarWarning : undefined,
            color: 'white',
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
      {isSmallScreen && (
        <BottomNav onNavigationChange={handleBottomNavChange} currentPage={currentView} />
      )}
    </Box>
  );
};

export default DashboardLayout;