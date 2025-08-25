'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Typography,
    Grid,
    Button,
    MenuItem,
    Select,
    FormControl,
    CircularProgress,
    Card,
    CardContent,
    CardMedia,
    Chip,
    InputLabel,
    useTheme,
    createTheme,
    ThemeProvider
} from '@mui/material';
import { motion } from 'framer-motion';
import SearchIcon from '@mui/icons-material/Search';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatIcon from '@mui/icons-material/Chat';
import StarIcon from '@mui/icons-material/Star';
import axios from 'axios';
import { useRouter, useParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';

// --- Interfaces (Ma'lumot turlari aniqlanadi) ---
interface UserData {
    id: number;
    name: string;
    email: string;
    tariff?: 'free' | 'premium' | 'vip';
    avatar_url?: string;
    profile?: {
        gender?: string;
        age_range?: string;
    };
    current_avatar?: {
        path: string;
        url: string;
    };
    currentSubscription?: {
        id: number;
        user_id: number;
        subscription_id: number;
        start_date: string;
        end_date: string;
        is_active: boolean;
        daily_searches_remaining: number;
        subscription?: {
            id: number;
            name: 'Free' | 'Premium' | 'VIP';
            price: number;
            duration_days: number;
        };
    };
}

interface PartnerProfile {
    id: number;
    name: string;
    age: number;
    image_url: string;
    bio: string;
    location: string;
    interests: string[];
}

interface PartnerSearchProps {
    user: UserData | null;
    onSearch: (filters: any) => Promise<void>;
    onBuySearch: () => void;
}

// --- Yangi Zamonaviy Ranglar Palitrasi (Theme sifatida) ---
const customTheme = createTheme({
    palette: {
        primary: {
            main: '#FF6B6B', // Yumshoq qizil-pushti - asosiy harakat rangi
            light: '#FF9494', // Asosiy rangning ochiqroq varianti
            dark: '#E05A5A',  // Asosiy rangning to'qroq varianti
            contrastText: '#FFFFFF',
        },
        secondary: {
            main: '#FFD700', // Yorqin sariq
            light: '#FFDB8C',
            dark: '#E0BB5B',
            contrastText: '#333333', // To'q matn rang
        },
        error: {
            main: '#FF6B6B', // Xato xabarlari uchun qizil-pushti
        },
        success: {
            main: '#6BFF91', // Muvaffaqiyat xabarlari uchun yorqin yashil
        },
        text: {
            primary: '#333333', // Asosiy matn
            secondary: '#666666', // Ikkinchi darajali matn
        },
        background: {
            default: '#F8F8F8', // Umumiy fon rangi (loyiha bo'yicha)
            paper: '#FFFFFF',  // Card va shunga o'xshash elementlar foni
        },
    },
    typography: {
        fontFamily: 'Montserrat, sans-serif', // Zamonaviy shrift
        h3: {
            fontWeight: 700,
            fontSize: '2.8rem',
            '@media (max-width:900px)': {
                fontSize: '2.2rem',
            },
            '@media (max-width:600px)': {
                fontSize: '1.8rem',
            },
        },
        h4: {
            fontWeight: 600,
            fontSize: '2.2rem',
            '@media (max-width:900px)': {
                fontSize: '1.8rem',
            },
            '@media (max-width:600px)': {
                fontSize: '1.5rem',
            },
        },
        h6: {
            fontWeight: 500,
            fontSize: '1.2rem',
            '@media (max-width:600px)': {
                fontSize: '1rem',
            },
        },
        body1: {
            fontSize: '1rem',
            '@media (max-width:600px)': {
                fontSize: '0.9rem',
            },
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '50px',
                    textTransform: 'none',
                    fontWeight: 600,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        transform: 'translateY(-2px)',
                    },
                },
            },
        },
        MuiFormControl: {
            styleOverrides: {
                root: {
                    borderRadius: '16px',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: '24px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                    background: 'linear-gradient(135deg, #ffffff 0%, #fefcfc 100%)',
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: '16px',
                    fontWeight: 600,
                    padding: '4px 8px',
                }
            }
        }
    },
});

// YANGILANGAN KOMPONENT: Topilgan partnyor profilini ko'rsatish uchun
const MatchProfileCard: React.FC<{ profile: PartnerProfile, userTariff: string, baseDomain: string, user: UserData | null }> = ({ profile, userTariff, baseDomain, user }) => {
    const theme = useTheme();
    const router = useRouter();
    const [isChatCreating, setIsChatCreating] = useState(false);
    const [liked, setLiked] = useState(false);

    // Rasmni to'g'ri URL manzilini aniqlash uchun yordamchi funksiya
    const getImageUrl = (path: string | null) => {
        if (!path) {
            return 'https://placehold.co/320x320/E0E0E0/A0A0A0?text=No+Image';
        }
        if (path.startsWith('http') || path.startsWith('https') || path.startsWith('/')) {
            return path;
        }
        return `${baseDomain}/storage/${path}`;
    };

    const finalImageUrl = getImageUrl(profile.image_url);
    
    // --- FIKSLANGAN XATO: `handleLike` funksiyasi argument qabul qilmaydi, shuning uchun uni chaqirishda ham argument o'tkazilmaydi.
    // Funksiya o'z ichida `profile.id` ni prop orqali oladi.
    const handleLike = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://127.0.0.1:8000/api/likes/toggle', {
                liked_user_id: profile.id,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            setLiked(response.data.liked);
        } catch (error) {
            console.error('Error toggling like:', error);
        }
    };


    // Chat tugmasini bosish va yangi chat yaratish/navigatsiya qilish funksiyasi
    const handleChatClick = async () => {
        if (!user || !user.id) {
            return;
        }

        setIsChatCreating(true);

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setIsChatCreating(false);
                return;
            }

            // API'ga POST so'rov yuborib, yangi chatni yaratish
            const response = await axios.post(
                `${baseDomain}/api/chats`,
                { partner_id: profile.id }, // O'zgartirildi: user2_id o'rniga partner_id ishlatildi
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const newChatId = response.data.chat.id; // O'zgartirildi: response.data.chat_id o'rniga response.data.chat.id ishlatildi

            if (newChatId) {
                // Yangi chat ID'si bilan chat sahifasiga o'tish
                router.push(`/chat/${newChatId}`);
            } else {
                console.error("Chat ID was not returned from the API.");
            }
        } catch (error) {
            console.error('Error creating chat session:', error);
        } finally {
            setIsChatCreating(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            style={{ display: 'flex', justifyContent: 'center', width: '100%' }}
        >
            <Card
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    maxWidth: 900,
                    mx: { xs: 1, sm: 2, md: 'auto' }, // Responsiv margin
                    p: { xs: 2.5, sm: 4 },
                    borderRadius: '24px',
                    boxShadow: '0 12px 35px rgba(0,0,0,0.12)',
                    background: '#004953',
                    position: 'relative',
                }}
            >
                {/* Premium Badge */}
                {userTariff !== 'free' && (
                    <Chip
                        icon={<StarIcon sx={{ color: "#fffff" }} />}
                        label={userTariff.toUpperCase()}
                        color="secondary"
                        sx={{
                            position: 'absolute',
                            top: 20,
                            right: 20,
                            bgcolor: theme.palette.secondary.main,
                            color: theme.palette.secondary.contrastText,
                            fontWeight: 'bold',
                            zIndex: 1,
                            px: 2,
                            py: 1,
                            fontSize: '0.9rem',
                            borderRadius: '16px',
                        }}
                    />
                )}
                <CardMedia
                    component="img"
                    image={finalImageUrl}
                    alt={profile.name}
                    sx={{
                        width: { xs: '100%', md: 320 },
                        height: { xs: 280, sm: 320 },
                        borderRadius: '20px',
                        objectFit: 'cover',
                        mr: { md: 5 },
                        mb: { xs: 3, md: 0 },
                        boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
                    }}
                />
                <CardContent sx={{ textAlign: { xs: 'center', md: 'left' }, flex: 1 }}>
                    <Typography variant="h4" sx={{ mb: 2, color: "#ffffff" }}>
                        {profile.name}, {profile.age}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 3, color: "#ffffff" }}>
                        {profile.bio}
                    </Typography>
                    <Typography component="div" variant="body2" sx={{ mb: 1 }}>
                        Location: <Chip label={profile.location || 'N/A'} size="small" sx={{ bgcolor: theme.palette.primary.light + '1A', color: "#39FF14", fontWeight: 'bold' }} />
                    </Typography>
                    <Typography component="div" variant="body2" sx={{ mb: 3 }}>
                        Interests:
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1, justifyContent: { xs: 'center', md: 'flex-start' } }}>
                            {profile.interests?.length > 0 ? (
                                profile.interests.map((interest, idx) => (
                                    <Chip key={idx} label={interest} size="small" sx={{ bgcolor: theme.palette.primary.light + '1A', color: "#39FF14", fontWeight: 'bold' }} />
                                ))
                            ) : (
                                <Chip label="N/A" size="small" sx={{ bgcolor: theme.palette.primary.light + '1A', color: theme.palette.primary.dark, fontWeight: 'bold' }} />
                            )}
                        </Box>
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 2, sm: 2 }, mt: 3 }}>
                    <Button
                        startIcon={<FavoriteIcon />}
                        onClick={handleLike} // Xato tuzatildi: Funksiyaga ortiqcha argument o'tkazilmadi
                        sx={{
                            bgcolor: theme.palette.primary.main,
                            color: 'white',
                            px: 5,
                            py: 1.2,
                            fontSize: '1.1rem',
                            '&:hover': { bgcolor: theme.palette.primary.dark },
                            width: { xs: '100%', sm: 'auto' },
                        }}
                    >
                        {liked ? 'Unlike' : 'Like'}
                    </Button>
                        <Button
                            onClick={handleChatClick}
                            startIcon={isChatCreating ? <CircularProgress size={20} color="inherit" /> : <ChatIcon />}
                            variant="outlined"
                            disabled={isChatCreating}
                            sx={{
                                borderColor: theme.palette.primary.main,
                                color: theme.palette.primary.main,
                                px: 5,
                                py: 1.2,
                                fontSize: '1.1rem',
                                '&:hover': { bgcolor: theme.palette.primary.light + '10' },
                                width: { xs: '100%', sm: 'auto' },
                            }}
                        >
                            {isChatCreating ? 'Creating Chat...' : 'Chat'}
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </motion.div>
    );
};

// ASOSIY KOMPONENT
const PartnerSearchContent: React.FC<PartnerSearchProps> = ({ user, onSearch, onBuySearch }) => {
    const theme = useTheme();
    const [filters, setFilters] = useState({
        ageRange: '18-25',
        location: '',
        interests: '',
    });
    const [searching, setSearching] = useState(false);
    const [featuredProfile, setFeaturedProfile] = useState<PartnerProfile | null>(null);
    const [hasSearched, setHasSearched] = useState(false);
    const [countries, setCountries] = useState<string[]>([]);
    const [interestsList, setInterestsList] = useState<string[]>([]);
    const [searchError, setSearchError] = useState<string | null>(null);
    const { t } = useTranslation('common');

    // NEXT_PUBLIC_API_URL muhit o'zgaruvchisidan API URLni olamiz
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    // Rasmlar uchun asosiy domenni olamiz, masalan, "https://api.example.com" dan "https://example.com"
    const baseDomain = apiUrl?.replace('/api', '') || '';

    const userTariff = user?.currentSubscription?.subscription?.name?.toLowerCase() || 'free';
    const remainingSearches = user?.currentSubscription?.daily_searches_remaining ?? 0;

    // Foydalanuvchi qidiruv qila oladimi yoki yo'qligini tekshiramiz
    const canPerformSearch = userTariff !== 'free' || remainingSearches > 0;

    const searchButtonText = userTariff === 'free' && remainingSearches <= 0
        ? 'Buy More Searches'
        : (searching ? 'Searching...' : 'Show My Match');

    // Bir marta ishga tushadigan useEffect hook'i, dastlabki ma'lumotlarni (davlatlar, qiziqishlar) yuklash uchun
    useEffect(() => {
        const fetchDropdownData = async () => {
            // API URL mavjudligini tekshirish
            if (!apiUrl) {
                return;
            }
            try {
                // Tokenni localStorage'dan olish
                const token = localStorage.getItem('token');
                if (!token) {
                    return;
                }

                const headers = { Authorization: `Bearer ${token}` };

                // Davlatlar ro'yxatini API'dan olish
                const countriesResponse = await axios.get(`${apiUrl}/countries`, { headers });
                if (countriesResponse.data && Array.isArray(countriesResponse.data.countries)) {
                    setCountries(countriesResponse.data.countries);
                }

                // Qiziqishlar ro'yxatini API'dan olish
                const interestsResponse = await axios.get(`${apiUrl}/interests`, { headers });
                if (interestsResponse.data && Array.isArray(interestsResponse.data.interests)) {
                    setInterestsList(interestsResponse.data.interests);
                }
            } catch (error) {
                console.error('Error fetching dropdown data:', error);
            }
        };

        fetchDropdownData();
    }, [apiUrl]); // apiUrl o'zgarganda qayta ishga tushadi

    // Qidiruv tugmasi bosilganda ishga tushadigan funksiya
    const handleSearch = useCallback(async () => {
        if (!user || !canPerformSearch) {
            if (userTariff === 'free' && remainingSearches <= 0) {
                onBuySearch(); // Agar qidiruvlar tugagan bo'lsa, xarid qilish funksiyasini chaqiradi
            } else {
                console.warn('Search not allowed. User data missing or no remaining searches.');
            }
            return;
        }

        setSearching(true); // Qidiruv holatini o'rnatish
        setHasSearched(true); // Qidiruv amalga oshirilganini belgilash
        setSearchError(null); // Xatolarni tozalash

        if (!apiUrl) {
            setSearching(false);
            setSearchError('API URL is not configured.');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setSearching(false);
                setSearchError('Authentication token missing. Please log in.');
                return;
            }

            // Qidiruv filtrlari bilan API'ga so'rov yuborish
            const response = await axios.get(`${apiUrl}/partners/search`, {
                params: filters,
                headers: { Authorization: `Bearer ${token}` },
            });

            // Agar ma'lumot topilsa, featuredProfile state'ga o'rnatish
            if (response.data && response.data.profile) {
                setFeaturedProfile(response.data.profile);
            } else {
                setFeaturedProfile(null);
            }

            await onSearch(filters); // Qidiruvdan so'ng chaqiriladigan callback funksiyasi

        } catch (error: any) {
            setSearchError('Failed to fetch partner data. Please try again.');
        } finally {
            setSearching(false); // Qidiruv holatini yakunlash
        }
    }, [filters, user, apiUrl, onSearch, onBuySearch, userTariff, remainingSearches, canPerformSearch]);

    return (
        <ThemeProvider theme={customTheme}>
            <Box
                sx={{
                    minHeight: '60vh',
                    p: { xs: 2, md: 4 },
                    textAlign: 'center',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: '32px',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    maxWidth: '1000px',
                    mx: 'auto'
                }}
            >
                <Typography
                    variant="h3"
                    sx={{
                        mb: 2,
                        color: '#FFFFFF', // Adjusted color for better contrast
                        textShadow: '0 3px 10px rgba(0, 0, 0, 0.2)',
                    }}
                >
                    {t('Partner.discover_your_perfect_soulmate')}
                </Typography>
                <Typography
                    variant="h6"
                    sx={{
                        mb: 4,
                        color: '#E0E0E0', // Adjusted color for better contrast
                        maxWidth: 600,
                        mx: 'auto',
                    }}
                >
                    {t('Partner.discover_text2')}
                </Typography>

                {userTariff === 'free' && (
                    <Typography component="div" variant="body1" color="#e3f2fd" sx={{ mb: 2, fontWeight: 'medium' }}>
                       {t('Partner.free_searches_remaining_today:')} <Chip label={remainingSearches} color={remainingSearches > 0 ? 'success' : 'error'} size="medium" sx={{ ml: 1, px: 1.5, py: 0.5, fontSize: '0.9rem' }} />
                    </Typography>
                )}

                <Grid
                    container
                    spacing={2}
                    sx={{
                        mb: 4,
                        justifyContent: 'center',
                        '& > .MuiGrid-item': {
                            width: { xs: '100%', sm: 'auto' },
                        },
                        '& .MuiFormControl-root': {
                            minWidth: { xs: '100%', sm: 180 },
                            background: customTheme.palette.background.paper,
                            borderRadius: '16px',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                            border: 'none',
                        },
                        '& .MuiSelect-select': {
                            py: 1.8,
                            px: 2,
                        },
                        '& .MuiInputLabel-root': {
                            color: customTheme.palette.text.secondary,
                            '&.Mui-focused': {
                                color: customTheme.palette.primary.main,
                            },
                        },
                    }}
                >
                    <Grid item>
                        <FormControl fullWidth>
                            <InputLabel id="age-range-label">{t('Partner.age')}</InputLabel>
                            <Select
                                labelId="age-range-label"
                                id="age-range-select"
                                value={filters.ageRange}
                                label={t('Partner.age')}
                                onChange={(e) => setFilters({ ...filters, ageRange: e.target.value })}
                            >
                                <MenuItem value="18-25">{t('Partner.ages_1')}</MenuItem>
                                <MenuItem value="26-35">{t('Partner.ages_2')}</MenuItem>
                                <MenuItem value="36-50">{t('Partner.ages_3')}</MenuItem>
                                <MenuItem value="50+">{t('Partner.ages_4')}</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item>
                        <FormControl fullWidth>
                            <InputLabel id="location-label">{t('Partner.location')}</InputLabel>
                            <Select
                                labelId="location-label"
                                id="location-select"
                                value={filters.location}
                                label={t('Partner.location')}
                                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                            >
                                <MenuItem value="">{t('Partner.anywhere')}</MenuItem>
                                {countries.map((country) => (
                                    <MenuItem key={country} value={country.toLowerCase()}>
                                        {country}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item>
                        <FormControl fullWidth>
                            <InputLabel id="interests-label">{t('Partner.interests')}</InputLabel>
                            <Select
                                labelId="interests-label"
                                id="interests-select"
                                value={filters.interests}
                                label={t('Partner.interests')}
                                onChange={(e) => setFilters({ ...filters, interests: e.target.value })}
                            >
                                <MenuItem value="">{t('Partner.all_interests')}</MenuItem>
                                {interestsList.map((interest) => (
                                    <MenuItem key={interest} value={interest.toLowerCase()}>
                                        {interest}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>

                {/* Search Button */}
                <Button
                    onClick={handleSearch}
                    variant="contained"
                    startIcon={searching ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />}
                    disabled={searching || !canPerformSearch}
                    sx={{
                        bgcolor: customTheme.palette.primary.main,
                        px: 6,
                        py: 2,
                        borderRadius: '50px',
                        fontWeight: 'bold',
                        fontSize: '1.4rem',
                        textTransform: 'none',
                        boxShadow: '0 8px 25px rgba(255, 107, 107, 0.4)',
                        '&:hover': {
                            bgcolor: customTheme.palette.primary.dark,
                            transform: 'translateY(-3px) scale(1.02)',
                            boxShadow: '0 10px 30px rgba(255, 107, 107, 0.5)',
                        },
                        transition: 'all 0.3s ease-in-out',
                        width: { xs: '100%', sm: 'auto' },
                        mt: 2,
                    }}
                >
                    {t(searchButtonText)}
                </Button>

                {/* Main content area: loading, error, no-results, or profile */}
                <Box sx={{ mt: 6, minHeight: '300px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', px: { xs: 0, sm: 2, md: 4 } }}>
                    {searching ? (
                        <Box sx={{ textAlign: 'center' }}>
                            <CircularProgress size={60} sx={{ color: '#ffffff', mb: 2 }} />
                            <Typography variant="h6" color="#ffffff">{t('Partner.searching_for_your_match')}</Typography>
                        </Box>
                    ) : searchError ? (
                        <Typography variant="h6" color="#ffffff">{t('Partner.failed')}</Typography>
                    ) : hasSearched && !featuredProfile ? (
                        <Typography variant="h6" color="#ffffff">{t('Partner.No_matching')}</Typography>
                    ) : hasSearched && featuredProfile && (
                        <MatchProfileCard profile={featuredProfile} userTariff={userTariff} baseDomain={baseDomain} user={user} />
                    )}
                </Box>
            </Box>
        </ThemeProvider>
    );
};

export default PartnerSearchContent;