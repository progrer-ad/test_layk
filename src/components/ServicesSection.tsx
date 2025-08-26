// src/components/ServicesSection.tsx
'use client';

import { Box, Typography, Container } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import SearchIcon from '@mui/icons-material/Search';
import { motion, Variants } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import headerImage from '@/assets/img/services.png'

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
};

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const ServiceCard = ({ icon, title, description }: ServiceCardProps) => (
  <motion.div
    variants={fadeInUp}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true }}
    whileHover={{ scale: 1.05, rotate: 1 }} 
    transition={{ type: 'spring', stiffness: 200 }}
    style={{
      background: 'rgba(255,255,255,0.7)',
      borderRadius: '24px',
      padding: '2rem',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255,255,255,0.2)',
      boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
      textAlign: 'center',
      cursor: 'pointer',
    }}
  >
    <Box sx={{ mb: 2 }}>{icon}</Box>
    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
      {title}
    </Typography>
    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
      {description}
    </Typography>
  </motion.div>
);

const ServicesSection = () => {
  const { t } = useTranslation('common');

  return (
    <Box
      id="services-section"
      sx={{
        py: { xs: 10, md: 14 },
        position: 'relative',
        overflow: 'hidden',
        backgroundImage:
          `url(${headerImage.src})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(255, 255, 255, 0.85)',
          zIndex: 0,
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <Typography
            variant="h2"
            sx={{
              fontWeight: 'bold',
              textAlign: 'center',
              mb: 2,
              background: 'linear-gradient(90deg, #ff4081, #3b82f6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {t('services.title')}
          </Typography>
          <Typography
            variant="h6"
            sx={{
              textAlign: 'center',
              maxWidth: 700,
              mx: 'auto',
              mb: { xs: 8, md: 12 },
              color: 'text.secondary',
              fontWeight: 400,
            }}
          >
            {t('services.subtitle')}
          </Typography>
        </motion.div>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: '1fr 1fr',
              md: 'repeat(4, 1fr)',
            },
            gap: 4,
          }}
        >
          <ServiceCard
            icon={<AutoAwesomeIcon sx={{ fontSize: '3rem', color: '#ff4081' }} />}
            title={t('services.cards.advancedMatching.title')}
            description={t('services.cards.advancedMatching.desc')}
          />
          <ServiceCard
            icon={<ChatBubbleOutlineIcon sx={{ fontSize: '3rem', color: '#3b82f6' }} />}
            title={t('services.cards.secureChat.title')}
            description={t('services.cards.secureChat.desc')}
          />
          <ServiceCard
            icon={<VerifiedUserIcon sx={{ fontSize: '3rem', color: '#22c55e' }} />}
            title={t('services.cards.verifiedProfiles.title')}
            description={t('services.cards.verifiedProfiles.desc')}
          />
          <ServiceCard
            icon={<SearchIcon sx={{ fontSize: '3rem', color: '#f59e0b' }} />}
            title={t('services.cards.easySearch.title')}
            description={t('services.cards.easySearch.desc')}
          />
        </Box>
      </Container>
    </Box>
  );
};

export default ServicesSection;
