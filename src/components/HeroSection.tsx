'use client'

import { Box, Typography, Button, Container } from '@mui/material'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import headerImage from '@/assets/img/landing-hero.png'

const MotionBox = motion(Box)
const MotionContainer = motion(Container)

const HeroSection = () => {
  const { t } = useTranslation('common')

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.25 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' as const } },
  }

  return (
    <Box
      id="hero-section"
      sx={{
    minHeight: {
      xs: '80vh',   
      sm: '75vh',   
      md: '65vh',   
      lg: '55vh',   
      xl: '50vh',  
    },        py: { xs: 6, md: 12 },
        px: { xs: 2, md: 4 },
        position: 'relative',
        overflow: 'hidden',
        bgcolor: '#f9fafb',
        backgroundImage: `url('https://images.unsplash.com/photo-1684670179697-7b6d0213f152?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          background: 'rgba(255,255,255,0.6)',
          zIndex: 0,
        },
      }}
    >
      {/* Floating gradients */}
      <Box
        sx={{
          position: 'absolute',
          top: '-15%',
          right: '-15%',
          width: '550px',
          height: '550px',
          background: 'radial-gradient(circle, rgba(255,107,107,0.25) 0%, rgba(255,107,107,0) 70%)',
          borderRadius: '50%',
          animation: 'pulse 5s infinite',
          zIndex: 0,
          '@keyframes pulse': {
            '0%, 100%': { transform: 'scale(1)' },
            '50%': { transform: 'scale(1.15) translate(-25px, 20px)' },
          },
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '-20%',
          left: '-15%',
          width: '650px',
          height: '650px',
          background: 'radial-gradient(circle, rgba(74,144,226,0.25) 0%, rgba(74,144,226,0) 70%)',
          borderRadius: '50%',
          animation: 'pulse-reverse 5s infinite',
          zIndex: 0,
          '@keyframes pulse-reverse': {
            '0%, 100%': { transform: 'scale(1)' },
            '50%': { transform: 'scale(1.2) translate(30px, -25px)' },
          },
        }}
      />

      <MotionContainer
        variants={containerVariants}
        initial="hidden"
        animate="show"
        maxWidth="lg"
        sx={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: { xs: 4, md: 10 },
        }}
      >
        {/* Left: Text */}
        <MotionBox
          variants={itemVariants}
          sx={{
            flex: 1,
            textAlign: { xs: 'center', md: 'left' },
            maxWidth: { xs: '100%', md: '50%' },
            order: { xs: 2, md: 1 },
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3.2rem' },
              lineHeight: 1.2,
              mb: 2,
              color: '#1e293b',
            }}
          >
            {t('heroTitle1')}
          </Typography>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3.2rem' },
              lineHeight: 1.2,
              mb: 3,
              color: '#2563eb',
            }}
          >
            {t('heroTitle2')}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: '0.95rem', md: '1.1rem' },
              lineHeight: 1.7,
              mb: 4,
              color: '#475569',
            }}
          >
            {t('heroDescription')}
          </Typography>
          <Link href="/login" passHref>
            <Button
              variant="contained"
              size="large"
              sx={{
                px: { xs: 4, sm: 6 },
                py: { xs: 1.2, sm: 1.6 },
                fontSize: { xs: '0.95rem', sm: '1.1rem' },
                fontWeight: 600,
                bgcolor: '#2563eb',
                color: '#fff',
                borderRadius: '999px',
                boxShadow: '0 6px 14px rgba(37,99,235,0.35)',
                '&:hover': {
                  bgcolor: '#1d4ed8',
                  transform: 'translateY(-3px) scale(1.05)',
                  boxShadow: '0 12px 24px rgba(37,99,235,0.45)',
                },
                transition: 'all 0.3s ease-in-out',
              }}
            >
              {t('joinNow')}
            </Button>
          </Link>
        </MotionBox>

        {/* Right: Image */}
        <MotionBox
          variants={itemVariants}
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            order: { xs: 1, md: 2 },
          }}
        >
          <motion.div
            initial={{ scale: 0.92, rotate: -2, y: 20 }}
            animate={{ scale: 1, rotate: 2, y: 0 }}
            transition={{
              repeat: Infinity,
              duration: 8,
              repeatType: 'reverse',
              ease: 'easeInOut',
            }}
            whileHover={{ scale: 1.05, rotate: 0 }}
            style={{ width: '85%' }}
          >
            <Image
              src={headerImage}
              alt="Hero illustration"
              width={800}
              height={800}
              style={{
                width: '100%',
                height: 'auto',
                borderRadius: '20px',
                boxShadow: '0 14px 28px rgba(0,0,0,0.15)',
              }}
              priority
            />
          </motion.div>
        </MotionBox>
      </MotionContainer>
    </Box>
  )
}

export default HeroSection
