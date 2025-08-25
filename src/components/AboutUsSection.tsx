'use client';

import { Box, Typography, Container, Paper, Stack, Button } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import SecurityIcon from '@mui/icons-material/Security';
import ForumIcon from '@mui/icons-material/Forum';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import { keyframes } from '@emotion/react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
// Animatsiya
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
  100% { transform: translateY(0px); }
`;

type DecorShapeProps = {
  top?: string;
  left?: string;
  bottom?: string;
  right?: string;
  size: number;
  color: string;
};

const DecorShape = ({ top, left, bottom, right, size, color }: DecorShapeProps) => (
  <Box
    sx={{
      position: 'absolute',
      top,
      left,
      bottom,
      right,
      width: size,
      height: size,
      background: `radial-gradient(circle, ${color}, transparent 70%)`,
      borderRadius: '50%',
      filter: 'blur(100px)',
      animation: `${float} 12s ease-in-out infinite`,
    }}
  />
);

const InfoCard = ({
  icon,
  image,
  title,
  description,
}: {
  icon: React.ReactNode;
  image: string;
  title: string;
  description: string;
}) => (
  <Paper
    elevation={4}
    sx={{
      borderRadius: '20px',
      overflow: 'hidden',
      transition: 'transform 0.4s ease, box-shadow 0.4s ease',
      cursor: 'pointer',
      '&:hover': {
        transform: 'translateY(-8px)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
      },
    }}
  >
    <Box
      sx={{
        height: 200,
        backgroundImage: `url(${image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    />
    <Box sx={{ p: 3, textAlign: 'center' }}>
      <Box sx={{ mb: 2 }}>{icon}</Box>
      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>
    </Box>
  </Paper>
);

const HighlightCard = ({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) => (
  <Paper
    elevation={3}
    sx={{
      flex: 1,
      p: 4,
      borderRadius: '20px',
      textAlign: 'center',
      background: 'rgba(255,255,255,0.8)',
      backdropFilter: 'blur(8px)',
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'scale(1.05)',
        boxShadow: '0 15px 30px rgba(0,0,0,0.1)',
      },
    }}
  >
    <Box sx={{ mb: 2 }}>{icon}</Box>
    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
      {title}
    </Typography>
    <Typography variant="body2" color="text.secondary">
      {text}
    </Typography>
  </Paper>
);

const AboutUsSection = () => {
  // ✅ Hookni komponent ichida chaqiramiz
  const { t } = useTranslation('common');

  return (
    <Box
      sx={{
        py: { xs: 8, md: 14 },
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(180deg, #fff0f6 0%, #f3e5f5 50%, #e1f5fe 100%)',
      }}
    >
      {/* Dekorativ shakllar */}
      <DecorShape top="-150px" left="-150px" size={400} color="rgba(255,64,129,0.4)" />
      <DecorShape bottom="-150px" right="-150px" size={400} color="rgba(33,150,243,0.4)" />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Sarlavha */}
        <Typography
          variant="h2"
          align="center"
          sx={{
            fontWeight: 'bold',
            mb: 3,
            background: 'linear-gradient(90deg, #ff4081, #3b82f6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {t('about.title')}
        </Typography>
        <Typography
          align="center"
          sx={{
            maxWidth: 800,
            mx: 'auto',
            mb: { xs: 6, md: 10 },
            fontSize: '1.2rem',
            color: 'text.secondary',
          }}
        >
          {t('about.subtitle')}
        </Typography>

        {/* Asosiy kartalar */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
            gap: 4,
          }}
        >
          <InfoCard
            icon={<FavoriteBorderIcon sx={{ fontSize: '3rem', color: '#ff4081' }} />}
            image="https://plus.unsplash.com/premium_photo-1718474619729-614219d6b7df?q=80&w=1470&auto=format&fit=crop"
            title={t('about.cards.matchesTitle')}
            description={t('about.cards.matchesDesc')}
          />
          <InfoCard
            icon={<SecurityIcon sx={{ fontSize: '3rem', color: '#3b82f6' }} />}
            image="https://plus.unsplash.com/premium_photo-1677093906053-037cef85dba4?w=500&auto=format&fit=crop&q=60"
            title={t('about.cards.securityTitle')}
            description={t('about.cards.securityDesc')}
          />
          <InfoCard
            icon={<ForumIcon sx={{ fontSize: '3rem', color: '#22c55e' }} />}
            image="https://images.unsplash.com/photo-1543269865-cbf427effbad"
            title={t('about.cards.communityTitle')}
            description={t('about.cards.communityDesc')}
          />
        </Box>

        {/* Qo'shimcha imkoniyatlar */}
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={4}
          sx={{ mt: { xs: 8, md: 12 } }}
        >
          <HighlightCard
            icon={<EmojiEventsIcon sx={{ fontSize: '3rem', color: '#ff9800' }} />}
            title={t('about.highlights.awardTitle')}
            text={t('about.highlights.awardText')}
          />
          <HighlightCard
            icon={<Diversity3Icon sx={{ fontSize: '3rem', color: '#673ab7' }} />}
            title={t('about.highlights.diverseTitle')}
            text={t('about.highlights.diverseText')}
          />
        </Stack>

        {/* CTA tugma */}
        <Box textAlign="center" sx={{ mt: { xs: 10, md: 14 } }}>
 <Button
    component={Link}        // <--- shu qator
    href="/register"        // <--- shu qator
    variant="contained"
    size="large"
    sx={{
      px: 5,
      py: 1.5,
      borderRadius: '30px',
      background: 'linear-gradient(90deg, #ff4081, #3b82f6)',
      fontSize: '1.1rem',
      fontWeight: 'bold',
    }}
  >
    {t('about.cta')}
  </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default AboutUsSection;
