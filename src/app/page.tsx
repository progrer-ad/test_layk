'use client'

import HeroSection from '@/components/HeroSection';
import AboutUsSection from '@/components/AboutUsSection';
import ServicesSection from '@/components/ServicesSection';
import NewsSection from '@/components/NewsSection';
import ContactSection from '@/components/ContactSection';
import MotivationalQuotesSection from '@/components/MotivationalQuotesSection';
import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

export default function HomePage() {
  const { t } = useTranslation('common'); // Tarjimalar

  return (
    <Box>
      {/* Hero Section */}
      <Box id="home-section">
        <HeroSection title={t('hero.title')} subtitle={t('hero.subtitle')} />
      </Box>
      
      <Box id="about-testimonial">
        <MotivationalQuotesSection />
      </Box>
      {/* About Us Section */}
      <Box id="about-section">
        <AboutUsSection title={t('about.title')} desc={t('about.desc')} />
      </Box>

      {/* Services Section */}
      <Box id="services-section">
        <ServicesSection title={t('services.title')} />
      </Box>

      {/* News Section */}
      <Box id="news-section">
        <NewsSection title={t('news.title')} />
      </Box>

      {/* Contact Section */}
      <Box id="contact-section">
        <ContactSection title={t('contact.title')} />
      </Box>
    </Box>
  );
}
