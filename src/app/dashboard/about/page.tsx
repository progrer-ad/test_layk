'use client';

import React from 'react';
import Link from 'next/link';
import { Box, Typography, Container, Divider, IconButton, Button } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { motion } from 'framer-motion';
import SupportIcon from '@mui/icons-material/SupportAgent';

export default function AboutPage() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(to right top, #dfe9f3, #ffffff)',
        py: 10,
        px: 2,
      }}
    >
      <Container maxWidth="md">
        {/* Back Button */}
        <Box mb={3}>
          <Link href="/dashboard" passHref>
            <Button
              startIcon={<ArrowBack />}
              variant="outlined"
              sx={{
                textTransform: 'none',
                borderRadius: 20,
                fontWeight: 'bold',
              }}
            >
              Back to Dashboard
            </Button>
          </Link>
        </Box>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Box textAlign="center" mb={5}>
            <Typography
              variant="h3"
              fontWeight="bold"
              gutterBottom
              sx={{
                background: 'linear-gradient(45deg, #1e88e5, #42a5f5)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              About Us
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Learn more about our platform, mission, and values
            </Typography>
          </Box>
        </motion.div>

        <Divider sx={{ mb: 4 }} />

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <Typography variant="body1" paragraph>
            Our platform is built to provide modern and secure communication tools. We aim to create a user-friendly and safe environment where users can send messages, share media, and express themselves with fun stickers.
          </Typography>

          <Typography variant="body1" paragraph>
            Founded in 2025, our goal is to connect people more deeply through technology. Whether it’s a casual chat or a meaningful conversation, we’re here to support it.
          </Typography>

          <Typography variant="body1" paragraph>
            Every feature is designed based on user feedback. We continuously innovate and grow alongside our community. Thank you for being part of the journey!
          </Typography>
        </motion.div>

        {/* Contact Info */}
       <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.6, duration: 0.8 }}
>
  <Box
    mt={6}
    p={3}
    bgcolor="white"
    borderRadius={3}
    boxShadow={3}
    display="flex"
    alignItems="center"
    justifyContent="space-between"
    flexWrap="wrap"
  >
    <Box>
      <Typography variant="h6" gutterBottom>
        Need help or have questions?
      </Typography>
      <Typography color="text.secondary">
        Visit our support page for assistance or to get in touch.
      </Typography>
    </Box>

    <Link href="/dashboard/support" passHref>
      <Button
        variant="contained"
        startIcon={<SupportIcon />}
        sx={{
          mt: { xs: 2, sm: 0 },
          textTransform: 'none',
          borderRadius: 20,
          bgcolor: 'primary.main',
          color: 'white',
          '&:hover': { bgcolor: 'primary.dark' },
        }}
      >
        Go to Support
      </Button>
    </Link>
  </Box>
</motion.div>

      </Container>
    </Box>
  );
}
