'use client';

import { useEffect, useState } from 'react';
import { Box, Typography, Paper, CircularProgress } from '@mui/material';
import { motion, Variants } from 'framer-motion';
import { useTranslation } from 'react-i18next';

// Faqat bitta API URL o'zgaruvchisidan foydalanamiz
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// API so'rovlarini bajarish uchun yordamchi funksiya
const fetchNews = async () => {
    // URL mavjudligini tekshirish muhim
    if (!API_URL) {
        console.error("NEXT_PUBLIC_API_URL muhit o'zgaruvchisi topilmadi.");
        return null;
    }

    try {
        // Yangiliklar uchun to'g'ri API manziliga so'rov
        const response = await fetch(`${API_URL}/news`);

        if (!response.ok) {
            throw new Error('Tarmoq javobi muvaffaqiyatli emas edi');
        }

        const data = await response.json();
        // Serverdan kelgan ma'lumotlar to'g'ri formatda ekanligini tekshirish
        if (data && data.data) {
            return data.data;
        } else {
            console.error("API ma'lumotlari kutilgan formatda emas:", data);
            return null;
        }
    } catch (error) {
        console.error("Yangiliklarni yuklashda xato:", error);
        return null;
    }
};

interface NewsItem {
    id: number;
    title: string;
    content: string;
    created_at: string;
    image?: string;
}

const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
};

const NewsSection = () => {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const { t } = useTranslation('common');

    useEffect(() => {
        const getNews = async () => {
            setLoading(true);
            const fetchedNews = await fetchNews();

            if (fetchedNews === null) {
                setError(t('news_section.error'));
                setNews([]);
            } else if (Array.isArray(fetchedNews)) {
                setNews(fetchedNews);
                setError(null);
            } else {
                setError(t('news_section.error_format'));
                setNews([]);
            }
            setLoading(false);
        };

        getNews();
    }, [t]);

    return (
        <Box
            id="news-section"
            sx={{
                py: { xs: 10, md: 14 },
                px: { xs: 3, md: 8 },
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* ... Qolgan kod o'zgarmaydi ... */}
            <Box
                sx={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(120deg, #ffe4ec, #e0f7ff)',
                    zIndex: -2,
                }}
            />

            <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <Typography
                    variant="h2"
                    sx={{
                        fontWeight: 'bold',
                        mb: { xs: 6, md: 8 },
                        textAlign: 'center',
                        background: 'linear-gradient(90deg, #ff4081, #3f51b5)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}
                >
                    {t('news_section.title')}
                </Typography>
            </motion.div>

            {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                    <CircularProgress color="secondary" />
                </Box>
            )}

            {error && (
                <Typography color="error" align="center" variant="h6" sx={{ mt: 4 }}>
                    {error}
                </Typography>
            )}

            {!loading && news.length > 0 && (
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)' },
                        gap: { xs: 4, md: 6 },
                        maxWidth: 1400,
                        mx: 'auto',
                    }}
                >
                    {news.map((item, index) => (
                        <motion.div
                            key={item.id}
                            variants={fadeInUp}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.15 }}
                            whileHover={{ scale: 1.03 }}
                        >
                            <Paper
                                elevation={6}
                                sx={{
                                    borderRadius: '20px',
                                    overflow: 'hidden',
                                    background: 'rgba(255,255,255,0.7)',
                                    backdropFilter: 'blur(10px)',
                                    transition: 'all 0.3s ease',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    '&:hover': {
                                        boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
                                    },
                                }}
                            >
                                {item.image && (
                                    <Box
                                        sx={{
                                            height: 250,
                                            // Rasmlar backend'ning asosiy URL'idan olinishi kerak
                                            backgroundImage: `url(${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${item.image})`,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                            position: 'relative',
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                inset: 0,
                                                background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)',
                                            }}
                                        />
                                    </Box>
                                )}
                                {!item.image && (
                                    <Box sx={{ height: 250, bgcolor: 'grey.300', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Typography variant="body2" color="text.secondary">{t('news_section.no_image')}</Typography>
                                    </Box>
                                )}

                                <Box sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                                        {item.title}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'text.secondary', flex: 1 }}>
                                        {item.content}
                                    </Typography>
                                    <Typography variant="caption" sx={{ mt: 2, color: 'text.secondary' }}>
                                        {new Date(item.created_at).toLocaleDateString()}
                                    </Typography>
                                </Box>
                            </Paper>
                        </motion.div>
                    ))}
                </Box>
            )}

            {!loading && news.length === 0 && !error && (
                <Typography variant="h6" align="center" color="text.secondary" sx={{ mt: 4 }}>
                    {t('news_section.no_news')}
                </Typography>
            )}
        </Box>
    );
};

export default NewsSection;