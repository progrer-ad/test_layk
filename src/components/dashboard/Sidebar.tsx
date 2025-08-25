'use client';

import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Drawer,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import InfoIcon from '@mui/icons-material/Info';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'; // Added for the Chats menu
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

interface SidebarProps {
  mobileOpen: boolean;
  handleDrawerToggle: () => void;
  onLogout: () => void;
  onExpandToggle: () => void;
  isSidebarExpanded: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  mobileOpen,
  handleDrawerToggle,
  onLogout,
  onExpandToggle,
  isSidebarExpanded,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const isPermanent = useMediaQuery(theme.breakpoints.up('sm'));
  const { t } = useTranslation('common');

  const expanded = isPermanent ? isSidebarExpanded : true;

  const drawerWidthExpanded = 240;
  const drawerWidthCollapsed = 80;

  const mobileDrawerWidth = '100%';

  const handleExpandToggle = () => {
    if (isPermanent) {
      onExpandToggle();
    }
  };

  const colors = {
    darkBackground: '#1A1A2E',
    accentMint: '#10FFCB',
    lightBlue: '#B5F8FE',
    pastelYellow: '#FBD87F',
    whiteText: '#FFFFFF',
    hoverBgLight: 'rgba(255,255,255,0.1)',
    selectedBgLight: 'rgba(255,255,255,0.15)',
    divider: 'rgba(255,255,255,0.15)',
  };

  const drawerContent = (
    <Box
      sx={{
        width: isPermanent
          ? isSidebarExpanded
            ? drawerWidthExpanded
            : drawerWidthCollapsed
          : mobileDrawerWidth,
        flexShrink: 0,
        bgcolor: colors.darkBackground,
        borderRight: { sm: 'none' },
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        boxShadow: { xs: 'none', sm: '0 4px 20px rgba(0,0,0,0.3)' },
        color: colors.whiteText,
        transition: 'width 0.3s ease-in-out',
      }}
    >
      {/* Top Section: Logo/Title and Toggle/Close Button */}
      <Box
        sx={{
          p: 3,
          textAlign: 'center',
          borderBottom: `1px solid ${colors.divider}`,
          mb: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: isPermanent
            ? isSidebarExpanded
              ? 'space-between'
              : 'center'
            : 'space-between',
          minHeight: '64px',
        }}
      >
        {(expanded || !isPermanent) && (
          <Typography
            variant="h5"
            sx={{
              fontWeight: 'bold',
              letterSpacing: '1px',
              textShadow: '0 2px 5px rgba(0,0,0,0.2)',
              flexGrow: 1,
              textAlign: isPermanent && !expanded ? 'center' : 'left',
              color: colors.whiteText,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            Elayk
          </Typography>
        )}
        {isPermanent && (
          <IconButton
            onClick={handleExpandToggle}
            sx={{
              color: colors.whiteText,
              ml: isSidebarExpanded ? 2 : 0,
              '&:hover': {
                bgcolor: colors.hoverBgLight,
              },
            }}
          >
            {isSidebarExpanded ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>
        )}
        {!isPermanent && (
          <IconButton
            onClick={handleDrawerToggle}
            sx={{
              color: colors.whiteText,
              ml: 2,
              '&:hover': {
                bgcolor: colors.hoverBgLight,
              },
            }}
          >
            <ChevronLeftIcon />
          </IconButton>
        )}
      </Box>

      {/* Menu Items */}
      <List sx={{ flexGrow: 1, pt: 0 }}>
        {[
{ text: t('sidebar.dashboard'), icon: <DashboardIcon />, href: '/dashboard' },
    { text: t('sidebar.my_profile'), icon: <PersonIcon />, href: '/profile-setup' },
    { text: t('sidebar.chats'), icon: <ChatBubbleOutlineIcon />, href: '/chat' },
    { text: t('sidebar.settings'), icon: <SettingsIcon />, href: '/dashboard/settings' },
    { text: t('sidebar.about_us'), icon: <InfoIcon />, href: '/dashboard/about' },
        ].map((item) => {
          const isSelected = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));

          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                component={Link}
                href={item.href}
                onClick={isPermanent ? undefined : handleDrawerToggle}
                sx={{
                  borderRadius: '12px',
                  mx: 2,
                  py: 1.2,
                  transition: 'background-color 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease',
                  color: isSelected ? colors.accentMint : colors.lightBlue,
                  justifyContent: expanded ? 'initial' : 'center',
                  '&:hover': {
                    bgcolor: colors.hoverBgLight,
                    transform: 'translateX(5px)',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                    color: colors.pastelYellow,
                    '& .MuiListItemIcon-root': {
                      color: colors.pastelYellow,
                    },
                  },
                  '&.Mui-selected': {
                    bgcolor: colors.selectedBgLight,
                    color: colors.accentMint,
                    boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                    borderLeft: expanded ? `4px solid ${colors.accentMint}` : 'none',
                    '& .MuiListItemIcon-root': {
                      color: colors.accentMint,
                    },
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.25)',
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isSelected ? colors.accentMint : colors.lightBlue,
                    minWidth: '40px',
                    justifyContent: 'center',
                    transition: 'color 0.3s ease',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {expanded && (
                  <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: 'medium' }} />
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* Logout Button */}
      <Divider sx={{ mx: 2, mb: 2, borderColor: colors.divider }} />
      <List sx={{ pb: 2 }}>
        <ListItem disablePadding sx={{ mb: 1 }}>
          <ListItemButton
            onClick={() => {
              onLogout();
              if (!isPermanent) handleDrawerToggle();
            }}
            sx={{
              borderRadius: '12px',
              mx: 2,
              py: 1.2,
              bgcolor: 'rgba(255, 255, 255, 0.1)',
              color: colors.whiteText,
              transition: 'background-color 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease',
              justifyContent: expanded ? 'initial' : 'center',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.25)',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
              },
              '& .MuiListItemIcon-root': {
                color: colors.whiteText,
              },
            }}
          >
            <ListItemIcon sx={{ color: 'inherit', minWidth: '40px', justifyContent: 'center' }}>
              <LogoutIcon />
            </ListItemIcon>
            {expanded && (
              <ListItemText primary="Logout" primaryTypographyProps={{ fontWeight: 'medium' }} />
            )}
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{
        width: { sm: isSidebarExpanded ? drawerWidthExpanded : drawerWidthCollapsed },
        flexShrink: { sm: 0 },
      }}
      aria-label="main menu"
    >
      {/* Mobile Drawer (temporary) */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: mobileDrawerWidth,
            bgcolor: colors.darkBackground,
            color: colors.whiteText,
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            zIndex: theme.zIndex.drawer,
          },
        }}
      >
        {drawerContent}
      </Drawer>
      {/* Desktop Drawer (permanent) */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: isSidebarExpanded ? drawerWidthExpanded : drawerWidthCollapsed,
            bgcolor: colors.darkBackground,
            borderRight: 'none',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            color: colors.whiteText,
            transition: 'width 0.3s ease-in-out',
            zIndex: theme.zIndex.drawer,
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
};

export default Sidebar;
