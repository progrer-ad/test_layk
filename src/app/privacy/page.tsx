'use client';

import React from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Divider,
} from '@mui/material';
import { styled } from '@mui/system';
import { keyframes } from '@emotion/react';
import { useTranslation } from 'react-i18next';

// --- ANIMATIONS ---
const slideBg = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// --- COMPONENT STYLES ---
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(6),
  },
  borderRadius: '25px',
  background: 'rgba(255, 255, 255, 0.85)',
  backdropFilter: 'blur(15px)',
  WebkitBackdropFilter: 'blur(15px)', // For Safari support
  boxShadow: '0 15px 40px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.4s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.15)',
  },
}));

const StyledList = styled('ul')(({ theme }) => ({
  listStyle: 'none',
  padding: 0,
  margin: 0,
}));

const StyledListItem = styled('li')(({ theme }) => ({
  marginBottom: theme.spacing(2),
  '&::before': {
    content: '"•"',
    color: '#d81b60',
    fontWeight: 'bold',
    display: 'inline-block',
    width: '1em',
    marginLeft: '-1em',
  },
  lineHeight: 1.8,
}));

const PrivacyPage = () => {
  const { t } = useTranslation('common');

  // Funktsiya matnlarni t-kalitlari orqali render qilish uchun
  const renderList = (key) => {
    const items = t(`privacy.${key}`, { returnObjects: true });
    return (
      <StyledList>
        {items.map((item, index) => (
          <StyledListItem key={index}>
            <Typography component="span" sx={{ fontWeight: 'bold', color: '#444' }}>
              {t(`privacy.${key}.${index}.label`)}
            </Typography>
            <Typography component="span" sx={{ color: '#666' }}>
              {t(`privacy.${key}.${index}.text`)}
            </Typography>
          </StyledListItem>
        ))}
      </StyledList>
    );
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      background: 'linear-gradient(45deg, #e3f2fd 0%, #ede7f6 100%)',
      backgroundSize: '200% 200%',
      animation: `${slideBg} 15s ease infinite`,
      py: { xs: 4, sm: 6 },
      px: { xs: 2, sm: 4, md: 6 },
    }}>
      <Container component="main" maxWidth="md">
        <StyledPaper>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#d81b60', textAlign: 'center', mb: 1 }}>
            {t('privacy.title')}
          </Typography>
          <Typography variant="h5" component="h2" sx={{ color: '#d81b60', textAlign: 'center', mb: 2 }}>
            {t('privacy.for_alike')}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mb: 4 }}>
            {t('privacy.effective_date')}
          </Typography>
          <Typography variant="body1" sx={{ color: '#666', lineHeight: 1.8, mb: 3 }}>
            {t('privacy.intro_text')}
          </Typography>

          <Divider sx={{ my: 4 }} />

          {/* 1. Ma'lumotlar */}
          <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold', color: '#6a1b9a', mt: 4, mb: 2 }}>
            {t('privacy.section_1_title')}
          </Typography>
          {renderList('section_1_points')}

          <Divider sx={{ my: 4 }} />

          {/* 2. Qanday foydalanamiz */}
          <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold', color: '#6a1b9a', mt: 4, mb: 2 }}>
            {t('privacy.section_2_title')}
          </Typography>
          {renderList('section_2_points')}

          <Divider sx={{ my: 4 }} />

          {/* 3. Uzatish */}
          <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold', color: '#6a1b9a', mt: 4, mb: 2 }}>
            {t('privacy.section_3_title')}
          </Typography>
          <Typography variant="body1" sx={{ color: '#666', lineHeight: 1.8, mb: 2 }}>
            {t('privacy.section_3_intro')}
          </Typography>
          {renderList('section_3_points')}
          <Typography variant="body1" sx={{ color: '#666', lineHeight: 1.8, mt: 2, mb: 3, fontWeight: 'bold' }}>
            {t('privacy.section_3_outro')}
          </Typography>

          <Divider sx={{ my: 4 }} />

          {/* 4. Cookies */}
          <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold', color: '#6a1b9a', mt: 4, mb: 2 }}>
            {t('privacy.section_4_title')}
          </Typography>
          <Typography variant="body1" sx={{ color: '#666', lineHeight: 1.8, mb: 3 }}>
            {t('privacy.section_4_text')}
          </Typography>

          <Divider sx={{ my: 4 }} />

          {/* 5. Xalqaro */}
          <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold', color: '#6a1b9a', mt: 4, mb: 2 }}>
            {t('privacy.section_5_title')}
          </Typography>
          <Typography variant="body1" sx={{ color: '#666', lineHeight: 1.8, mb: 3 }}>
            {t('privacy.section_5_text')}
          </Typography>

          <Divider sx={{ my: 4 }} />

          {/* 6. Saqlash */}
          <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold', color: '#6a1b9a', mt: 4, mb: 2 }}>
            {t('privacy.section_6_title')}
          </Typography>
          <Typography variant="body1" sx={{ color: '#666', lineHeight: 1.8, mb: 3 }}>
            {t('privacy.section_6_text')}
          </Typography>

          <Divider sx={{ my: 4 }} />

          {/* 7. Huquqlar */}
          <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold', color: '#6a1b9a', mt: 4, mb: 2 }}>
            {t('privacy.section_7_title')}
          </Typography>
          <Typography variant="body1" sx={{ color: '#666', lineHeight: 1.8, mb: 2 }}>
            {t('privacy.section_7_intro')}
          </Typography>
          {renderList('section_7_points')}

          <Divider sx={{ my: 4 }} />

          {/* 8. Bolalar */}
          <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold', color: '#6a1b9a', mt: 4, mb: 2 }}>
            {t('privacy.section_8_title')}
          </Typography>
          <Typography variant="body1" sx={{ color: '#666', lineHeight: 1.8, mb: 3 }}>
            {t('privacy.section_8_text')}
          </Typography>

          <Divider sx={{ my: 4 }} />

          {/* 9. Xavfsizlik */}
          <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold', color: '#6a1b9a', mt: 4, mb: 2 }}>
            {t('privacy.section_9_title')}
          </Typography>
          <Typography variant="body1" sx={{ color: '#666', lineHeight: 1.8, mb: 3 }}>
            {t('privacy.section_9_text')}
          </Typography>

          <Divider sx={{ my: 4 }} />

          {/* 10. Aloqa */}
          <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold', color: '#6a1b9a', mt: 4, mb: 2 }}>
            {t('privacy.section_10_title')}
          </Typography>
          <Typography variant="body1" sx={{ color: '#666', lineHeight: 1.8, mb: 2 }}>
            {t('privacy.section_10_text_1')}
            <a href="mailto:privacy@alike.app" style={{ color: '#d81b60', fontWeight: 'bold' }}>privacy@alike.app</a>
          </Typography>
          <Typography variant="body1" sx={{ color: '#666', lineHeight: 1.8, mb: 3 }}>
            {t('privacy.section_10_text_2')}
          </Typography>
        </StyledPaper>
      </Container>
    </Box>
  );
};

export default PrivacyPage;