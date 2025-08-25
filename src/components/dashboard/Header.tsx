'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Box,
    Avatar,
    Button,
    Menu,
    MenuItem,
    useTheme,
    useMediaQuery,
    Badge,
    Divider,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import PersonIcon from '@mui/icons-material/Person';
import { LogOut as LogoutIcon, Zap as ZapIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Foydalanuvchi ma'lumotlari interfeysi
export interface UserData {
    name: string;
    avatar: string;
    currentSubscription: {
        subscription: {
            name: string;
        };
    };
}

// Bildirishnoma ma'lumotlari interfeysi
export interface NotificationData {
    id: string;
    title: string;
    message: string;
    read_at: string | null;
}

interface HeaderProps {
    user: UserData | null;
    onLogout: () => void;
    handleDrawerToggle: () => void;
    isSidebarExpanded: boolean;
    mobileOpen: boolean;
}

const drawerWidthCollapsed = 80;
const drawerWidthExpanded = 240;

const Header: React.FC<HeaderProps> = ({ user, onLogout, handleDrawerToggle, isSidebarExpanded, mobileOpen }) => {
  const { t } = useTranslation('common');
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [notificationsAnchorEl, setNotificationsAnchorEl] = useState<null | HTMLElement>(null);
    const [notificationsCount, setNotificationsCount] = useState(0);
    const [notifications, setNotifications] = useState<NotificationData[]>([]);

    const openProfileMenu = Boolean(anchorEl);
    const openNotificationsMenu = Boolean(notificationsAnchorEl);

    // Laravel API manzilini environment variable'dan oling
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
    
    // Foydalanuvchi tokenini localStorage'dan olish
    const userToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    /**
     * API'dan barcha bildirishnomalarni (o'qilgan va o'qilmagan) oladi.
     */
    const fetchNotifications = async () => {
        if (!userToken) return;

        try {
            const response = await axios.get(`${API_BASE_URL}/notifications`, {
                headers: {
                    Authorization: `Bearer ${userToken}`,
                },
            });

            const unreadCount = response.data.data.unread_count || 0;
            const notificationList = response.data.data.notifications || [];

            setNotificationsCount(unreadCount);
            setNotifications(notificationList);

        } catch (error) {
            console.error("Bildirishnomalarni olishda xatolik:", error);
            setNotificationsCount(0);
            setNotifications([]);
        }
    };

    /**
     * Komponent yuklanganda yoki foydalanuvchi tokeni o'zgarganda bildirishnomalarni oladi.
     */
    useEffect(() => {
        if (userToken) {
            fetchNotifications();
        }
    }, [userToken]);

    /**
     * Bildirishnomalar menyusini ochadi va barcha bildirishnomalarni o'qilgan deb belgilash funksiyasini chaqiradi.
     */
    const handleNotificationsClick = (event: React.MouseEvent<HTMLElement>) => {
        setNotificationsAnchorEl(event.currentTarget);
        markAllAsRead();
    };

    /**
     * Bildirishnomalar menyusini yopadi.
     */
    const handleNotificationsClose = () => {
        setNotificationsAnchorEl(null);
    };

    /**
     * API orqali barcha bildirishnomalarni o'qilgan deb belgilaydi.
     */
    const markAllAsRead = async () => {
        if (!userToken) return;
        try {
            await axios.patch(`${API_BASE_URL}/notifications/mark-all-as-read`, {}, {
                headers: { Authorization: `Bearer ${userToken}` },
            });
            // Frontend holatini yangilash
            setNotificationsCount(0);
            const updatedNotifications = notifications.map(notif => ({ ...notif, read_at: new Date().toISOString() }));
            setNotifications(updatedNotifications);
        } catch (error) {
            console.error("Bildirishnomalarni o'qishda xatolik:", error);
        }
    };
    
    /**
     * Alifbo bo'yicha bildirishnomalarni o'qilgan deb belgilaydi va menyuni yopadi.
     */
    const handleNotificationItemClick = async (notificationId: string) => {
        handleNotificationsClose();
        if (!userToken) return;
        try {
            await axios.patch(`${API_BASE_URL}/notifications/mark-as-read/${notificationId}`, {}, {
                headers: { Authorization: `Bearer ${userToken}` },
            });
            // Frontend holatini yangilash
            const updatedNotifications = notifications.map(notif => 
                notif.id === notificationId ? { ...notif, read_at: new Date().toISOString() } : notif
            );
            setNotifications(updatedNotifications);
            const newUnreadCount = updatedNotifications.filter(notif => !notif.read_at).length;
            setNotificationsCount(newUnreadCount);
        } catch (error) {
            console.error("Bildirishnomani o'qishda xatolik:", error);
        }
    };

    // Profil menyusini boshqarish funksiyalari
    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleProfileClick = () => {
        handleClose();
        window.location.href = '/dashboard/profile';
    };

    const handleSettingsClick = () => {
        handleClose();
        window.location.href = '/dashboard/settings';
    };

    const handleLogoutClick = () => {
        handleClose();
        onLogout();
    };

    const handleUpgradeClick = () => {
        window.location.href = '/pricing';
    };

    // Zamonaviy va professional ranglar palitrasi
    const colors = {
        background: '#0F172A', // Slate-900
        surface: '#1E293B',    // Slate-800
        text: '#F8FAFC',       // Slate-50
        mutedText: '#94A3B8',  // Slate-400
        accentPrimary: '#34D399', // Emerald-400
        accentSecondary: '#8B5CF6', // Violet-500
        upgradeBtn: '#FBBF24', // Amber-400
        upgradeBtnHover: '#F59E0B', // Amber-500
    };

    // Obuna darajasini tekshirish
    const isUpgradeButtonVisible = user?.currentSubscription?.subscription?.name !== 'Premium' && user?.currentSubscription?.subscription?.name !== 'VIP';

    if (isMobile && mobileOpen) {
        return null;
    }

    return (
        <AppBar
            position="fixed"
            sx={{
                width: {
                    sm: `calc(100% - ${isSidebarExpanded ? drawerWidthExpanded : drawerWidthCollapsed}px)`,
                },
                ml: {
                    sm: isSidebarExpanded ? drawerWidthExpanded : drawerWidthCollapsed,
                },
                transition: theme.transitions.create(['width', 'margin'], {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.enteringScreen,
                }),
                bgcolor: colors.background,
                boxShadow: `0 6px 20px rgba(0,0,0,0.4)`,
                zIndex: theme.zIndex.drawer + 1,
                height: '80px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderBottom: `1px solid ${colors.surface}`,
            }}
        >
            <Toolbar
                sx={{
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                    minHeight: '80px',
                    px: { xs: 2, sm: 3 },
                    [theme.breakpoints.up('sm')]: {
                        minHeight: '80px',
                    },
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
                    {isMobile && (
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{
                                mr: 2,
                                color: colors.mutedText,
                                transition: 'color 0.3s ease, transform 0.3s ease, background-color 0.3s ease',
                                '&:hover': {
                                    bgcolor: colors.surface,
                                    color: colors.accentPrimary,
                                    transform: 'scale(1.1)',
                                },
                            }}
                        >
                            <MenuIcon />
                        </IconButton>
                    )}
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        justifyContent: 'center',
                        maxWidth: { xs: 'calc(100vw - 150px)', sm: 'none' },
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                    }}>
                        <Typography variant="h5" component="h1" sx={{
                            fontWeight: 'bold',
                            color: colors.text,
                            mb: 0.5,
                            fontSize: { xs: '1.1rem', sm: '1.4rem', md: '1.6rem' },
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                        }}>
                            {t('header.title')}
                        </Typography>
                        <Typography variant="body2" sx={{
                            color: colors.mutedText,
                            fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.9rem' },
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                        }}>
                            {t('header.subtitle')}
                        </Typography>
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
                    {isUpgradeButtonVisible && (
                        <>
                            <Button
                                onClick={handleUpgradeClick}
                                variant="contained"
                                sx={{
                                    display: { xs: 'none', sm: 'flex' },
                                    bgcolor: colors.upgradeBtn,
                                    color: colors.background,
                                    fontWeight: 'bold',
                                    borderRadius: '9999px',
                                    boxShadow: `0 4px 10px rgba(0,0,0,0.2)`,
                                    fontSize: { sm: '0.75rem', md: '1rem' },
                                    px: { sm: 1.5, md: 2 },
                                    py: { sm: 0.5, md: 1 },
                                    alignItems: 'center',
                                    gap: 0.5,
                                    '&:hover': { bgcolor: colors.upgradeBtnHover, transform: 'translateY(-2px)', boxShadow: `0 6px 15px rgba(0,0,0,0.3)` },
                                }}
                            >
                                <ZapIcon style={{ width: '1.2rem', height: '1.2rem' }} />
                                {t('header.upgrade_button')}
                            </Button>
                            <IconButton
                                color="inherit"
                                aria-label="upgrade subscription"
                                onClick={handleUpgradeClick}
                                sx={{
                                    display: { xs: 'flex', sm: 'none' },
                                    color: colors.upgradeBtn,
                                    transition: 'color 0.3s ease, transform 0.3s ease, background-color 0.3s ease',
                                    '&:hover': { color: colors.upgradeBtnHover, bgcolor: colors.surface, transform: 'scale(1.2) rotate(15deg)' },
                                }}
                            >
                                <ZapIcon />
                            </IconButton>
                        </>
                    )}

                    <IconButton
                        color="inherit"
                        aria-label="show notifications"
                        onClick={handleNotificationsClick}
                        aria-controls={openNotificationsMenu ? 'notifications-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={openNotificationsMenu ? 'true' : undefined}
                        sx={{
                            color: colors.mutedText,
                            transition: 'color 0.3s ease, transform 0.3s ease, background-color 0.3s ease',
                            '&:hover': { color: colors.accentPrimary, bgcolor: colors.surface, transform: 'rotate(15deg) scale(1.1)' },
                        }}
                    >
                        <Badge
                            badgeContent={notificationsCount}
                            color="error"
                            sx={{
                                '& .MuiBadge-badge': {
                                    top: 8,
                                    right: 8,
                                    padding: '0 4px',
                                    height: '20px',
                                    minWidth: '20px',
                                    borderRadius: '10px',
                                    fontSize: '0.75rem'
                                }
                            }}
                        >
                            <NotificationsIcon />
                        </Badge>
                    </IconButton>

                    <Button
                        id="profile-button"
                        aria-controls={openProfileMenu ? 'profile-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={openProfileMenu ? 'true' : undefined}
                        onClick={handleMenu}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            color: colors.text,
                            textTransform: 'none',
                            p: 1,
                            borderRadius: '12px',
                            bgcolor: 'transparent',
                            transition: 'background-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease',
                            '&:hover': { bgcolor: colors.surface, transform: 'translateY(-2px) scale(1.02)', boxShadow: `0 4px 10px ${colors.surface}` },
                            boxShadow: 'none',
                        }}
                    >
                        <Avatar
                            src={user?.avatar || '/default-avatar.png'}
                            alt={user?.name || 'User'}
                            sx={{
                                width: 40,
                                height: 40,
                                border: `2px solid ${colors.accentPrimary}`,
                                transition: 'border-color 0.3s ease, transform 0.3s ease',
                                '&:hover': { borderColor: colors.accentSecondary, transform: 'scale(1.1)' },
                            }}
                        />
                        {!isMobile && (
                            <Box sx={{
                                textAlign: 'left',
                                maxWidth: { sm: '120px', md: '150px' },
                                overflow: 'hidden',
                                whiteSpace: 'nowrap',
                                textOverflow: 'ellipsis'
                            }}>
                                <Typography variant="body1" sx={{
                                    fontWeight: 'medium', lineHeight: 1,
                                    color: colors.text,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                }}>
                                    {user?.name || 'Guest'}
                                </Typography>
                                {user?.currentSubscription?.subscription?.name && (
                                    <Typography variant="caption" sx={{
                                        color: colors.mutedText,
                                        lineHeight: 1,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                    }}>
                                        {user.currentSubscription.subscription.name === 'Premium' ? t('header.subscription.premium') : user.currentSubscription.subscription.name === 'VIP' ? t('header.subscription.vip') : t('header.subscription.free')}
                                    </Typography>
                                )}
                            </Box>
                        )}
                        <ArrowDropDownIcon sx={{
                            color: colors.mutedText,
                            display: { xs: 'none', sm: 'block' }
                        }} />
                    </Button>

                    <Menu
                        id="profile-menu"
                        MenuListProps={{ 'aria-labelledby': 'profile-button' }}
                        anchorEl={anchorEl}
                        open={openProfileMenu}
                        onClose={handleClose}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                        PaperProps={{
                            sx: {
                                borderRadius: '12px',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                                mt: 1.5,
                                minWidth: '200px',
                                bgcolor: colors.surface,
                                border: `1px solid ${colors.mutedText}`,
                                animation: `fadeInMenu 0.3s ease-out forwards`,
                                '@keyframes fadeInMenu': {
                                    'from': { opacity: 0, transform: 'scale(0.95) translateY(-10px)' },
                                    'to': { opacity: 1, transform: 'scale(1) translateY(0)' },
                                },
                            },
                        }}
                    >
                        <MenuItem onClick={handleProfileClick} sx={{ color: colors.text, '&:hover': { bgcolor: colors.background, color: colors.accentPrimary, transform: 'translateX(5px)' } }}>
                            <PersonIcon sx={{ mr: 1.5, color: colors.accentPrimary }} /> {t('header.profile_menu.profile')}
                        </MenuItem>
                        <MenuItem onClick={handleSettingsClick} sx={{ color: colors.text, '&:hover': { bgcolor: colors.background, color: colors.accentPrimary, transform: 'translateX(5px)' } }}>
                            <SettingsIcon sx={{ mr: 1.5, color: colors.accentPrimary }} /> {t('header.profile_menu.settings')}
                        </MenuItem>
                        <MenuItem onClick={handleLogoutClick} sx={{ color: colors.text, '&:hover': { bgcolor: colors.background, color: colors.accentPrimary, transform: 'translateX(5px)' } }}>
                            <LogoutIcon style={{ marginRight: 12, color: colors.accentPrimary }} size={24} /> {t('header.profile_menu.logout')}
                        </MenuItem>
                    </Menu>

                    {/* Bildirishnomalar menyusi */}
                    <Menu
                        id="notifications-menu"
                        MenuListProps={{ 'aria-labelledby': 'notifications-button' }}
                        anchorEl={notificationsAnchorEl}
                        open={openNotificationsMenu}
                        onClose={handleNotificationsClose}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                        PaperProps={{
                            sx: {
                                borderRadius: '12px',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                                mt: 1.5,
                                minWidth: '300px',
                                maxWidth: '350px',
                                bgcolor: colors.surface,
                                border: `1px solid ${colors.mutedText}`,
                                animation: `fadeInMenu 0.3s ease-out forwards`,
                            },
                        }}
                    >
                        <Box sx={{ p: 2, pb: 0 }}>
                            <Typography variant="h6" sx={{ color: colors.text, fontWeight: 'bold' }}>
                                {t('header.notifications_title')}
                            </Typography>
                            <Typography variant="caption" sx={{ color: colors.mutedText, mb: 1 }}>
                                {t('header.notifications_unread_count', { count: notificationsCount })}
                            </Typography>
                            <Divider sx={{ my: 1, bgcolor: colors.mutedText }} />
                        </Box>

                        {notifications.length > 0 ? (
                            notifications.map((notification) => (
                                <MenuItem
                                    key={notification.id}
                                    onClick={() => handleNotificationItemClick(notification.id)}
                                    sx={{ 
                                        display: 'flex', 
                                        flexDirection: 'column', 
                                        alignItems: 'flex-start',
                                        py: 2,
                                        px: 2,
                                        borderBottom: `1px solid ${colors.background}`,
                                        '&:hover': { 
                                            bgcolor: colors.background, 
                                            color: colors.text,
                                            '& .MuiTypography-root': { color: colors.text }
                                        }
                                    }}
                                >
                                    <Typography 
                                        variant="subtitle1" 
                                        sx={{ 
                                            fontWeight: notification.read_at ? 'normal' : 'bold', 
                                            color: notification.read_at ? colors.mutedText : colors.text,
                                            mb: 0.5,
                                        }}
                                    >
                                        {notification.title}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: colors.mutedText, whiteSpace: 'normal', lineHeight: 1.4 }}>
                                        {notification.message}
                                    </Typography>
                                </MenuItem>
                            ))
                        ) : (
                            <MenuItem sx={{ color: colors.mutedText, textAlign: 'center' }}>
                                {t('header.notifications_none')}
                            </MenuItem>
                        )}
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;