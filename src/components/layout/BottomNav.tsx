'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation'; // Import useRouter and usePathname
import {
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  useTheme,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import ChatIcon from '@mui/icons-material/Chat';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import { useTranslation } from 'react-i18next';

const BottomNav: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const { t } = useTranslation('common');

  // Define your paths as a simple array of strings
  const navPaths = [
    '/dashboard',
    '/chat',
    '/profile-setup',
    '/dashboard/settings',
  ];

  // Find the index of the current path to set the selected value
  const [value, setValue] = useState(navPaths.indexOf(pathname));

  useEffect(() => {
    // This effect ensures the selected icon is correct if the URL changes
    // without a full component re-mount (e.g., from a <Link> component)
    const currentIndex = navPaths.indexOf(pathname);
    if (currentIndex !== -1) {
      setValue(currentIndex);
    }
  }, [pathname]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    // Use the router.push() method for client-side navigation
    router.push(navPaths[newValue]);
  };

  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        display: { xs: 'block', sm: 'none' },
        bgcolor: '#FCE4D8', // Yumshoq fon
        borderTop: '2px solid #FBD87F',
        boxShadow: '0 -4px 10px rgba(0,0,0,0.1)',
      }}
      elevation={8}
    >
      <BottomNavigation
        value={value}
        onChange={handleChange}
        showLabels
        sx={{
          height: '55px',
          bgcolor: '#1A1A2E',
          '.Mui-selected': {
            color: '#10FFCB',
            fontWeight: 'bold',
          },
          '.MuiBottomNavigationAction-root': {
            minWidth: 'auto',
            padding: '8px 4px',
            color: '#B5F8FE',
            '&:hover': {
              color: '#FBD87F',
              transform: 'scale(1.1)',
              transition: 'transform 0.2s ease-in-out',
            },
            transition: 'transform 0.2s ease-in-out',
          },
        }}
      >
        <BottomNavigationAction label={t("sidebar.dashboard")} icon={<HomeIcon />} />
        <BottomNavigationAction label={t('sidebar.chats')} icon={<ChatIcon />} />
        <BottomNavigationAction label={t('sidebar.my_profile')} icon={<PersonIcon />} />
        <BottomNavigationAction label={t('sidebar.settings')} icon={<SettingsIcon />} />
      </BottomNavigation>
    </Paper>
  );
};

export default BottomNav;