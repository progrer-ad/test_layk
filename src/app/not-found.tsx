// app/not-found.tsx
'use client';

import Link from 'next/link';
import { Box, Typography, Button, Paper } from '@mui/material';
import { styled, keyframes } from '@mui/system';
import { useTranslation } from 'react-i18next';

// --- Animations ---
const pulseGlow = keyframes`
  0% { text-shadow: 0 0 5px #ff007b, 0 0 10px #ff007b; }
  50% { text-shadow: 0 0 20px #ff007b, 0 0 40px #ff007b; }
  100% { text-shadow: 0 0 5px #ff007b, 0 0 10px #ff007b; }
`;

const slideBg = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(6),
  },
  borderRadius: '20px',
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
  maxWidth: '600px',
  width: '100%',
  textAlign: 'center',
  color: '#e0e0e0',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  mt: 2,
  py: 1.5,
  borderRadius: '10px',
  background: 'linear-gradient(45deg, #FF69B4 30%, #FF1493 90%)',
  color: '#fff',
  fontWeight: 'bold',
  letterSpacing: 1,
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: '0 8px 20px rgba(255, 20, 147, 0.5)',
  },
}));

export default function NotFound() {
    const { t } = useTranslation('common');

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(45deg, #120a1a 0%, #000a12 100%)',
        backgroundSize: '200% 200%',
        animation: `${slideBg} 15s ease infinite`,
        p: 4,
      }}
    >
      <StyledPaper>
        <Typography
          variant="h1"
          component="h1"
          sx={{
            fontSize: '8rem',
            fontWeight: 'bold',
            color: '#ff007b',
            animation: `${pulseGlow} 2s infinite ease-in-out`,
          }}
        >
          404
        </Typography>
        <Typography
          variant="h4"
          component="h2"
          sx={{
            mb: 2,
            fontWeight: 'bold',
            color: '#7fffd4',
            textShadow: '0 0 5px #7fffd4',
          }}
        >
          {t('notfound.title')}
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, color: '#b0b0b0' }}>
          {t('notfound.description')}
        </Typography>
        <Link href="/" passHref>
          <StyledButton variant="contained">
            {t('notfound.button_text')}
          </StyledButton>
        </Link>
      </StyledPaper>
    </Box>
  );
}