'use client';

import { useEffect, useState } from 'react';
import { Box, Typography, Paper, CircularProgress } from '@mui/material';
import { motion, Variants } from 'framer-motion';
import { useTranslation } from 'react-i18next';
const API_URL = process.env.NEXT_PUBLIC_API_URL;
// API so'rovlarini bajarish uchun yordamchi funksiya
const fetchNews = async () => {
  try {
    const response = await fetch(`${API_URL}/news`);

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Failed to fetch news:", error);
    return [];
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
      if (Array.isArray(fetchedNews)) {
        setNews(fetchedNews);
        setError(null);
      } else {
        setError(t('news_section.error'));
      }
      setLoading(false);
    };

    getNews();
  }, []); // `[t]` o'rniga bo'sh massiv `[]` qo'yildi

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
      {/* Background */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(120deg, #ffe4ec, #e0f7ff)',
          zIndex: -2,
        }}
      />

      {/* Title */}
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

      {/* Kontentni yuklash holati */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress color="secondary" />
        </Box>
      )}

      {/* Xato xabari */}
      {error && (
        <Typography color="error" align="center" variant="h6" sx={{ mt: 4 }}>
          {error}
        </Typography>
      )}

      {/* Yangiliklar kartalari */}
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
                {/* Rasm mavjud bo'lsa ko'rsatish */}
                {item.image && (
                  <Box
                    sx={{
                      height: 250,
                      backgroundImage: `url(http://localhost:8000/storage/${item.image})`,
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
                {/* Agar rasm bo'lmasa, bo'sh joy qoldirish */}
                {!item.image && (
                  <Box sx={{ height: 250, bgcolor: 'grey.300', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography variant="body2" color="text.secondary">{t('news_section.no_image')}</Typography>
                  </Box>
                )}

                {/* Kontent */}
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

      {/* Agar yangiliklar topilmasa */}
      {!loading && news.length === 0 && !error && (
        <Typography variant="h6" align="center" color="text.secondary" sx={{ mt: 4 }}>
          {t('news_section.no_news')}
        </Typography>
      )}
    </Box>
  );
};

export default NewsSection;