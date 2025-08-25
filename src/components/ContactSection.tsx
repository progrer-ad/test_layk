'use client';

import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const ContactSection = () => {
  const { t, i18n } = useTranslation('common');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <Box
      id="contact-section"
      sx={{
        py: { xs: 10, md: 14 },
        px: { xs: 3, md: 8 },
        position: 'relative',
        backgroundImage: `linear-gradient(rgba(240, 250, 255, 0.85), rgba(255, 255, 255, 0.9)), url('https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1920&q=80')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
      >
        <Typography
          variant="h2"
          sx={{
            fontWeight: 'bold',
            mb: { xs: 6, md: 8 },
            textAlign: 'center',
            background: 'linear-gradient(90deg, #0072ff, #00c6ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {t('contact.title')}
        </Typography>
      </motion.div>

      <Grid container spacing={6} justifyContent="center">
        {/* Info Card */}
        <Grid item xs={12} md={5}>
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: '20px',
                background: 'rgba(255,255,255,0.85)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,0.3)',
              }}
            >
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <LocationOnIcon sx={{ mr: 1.5, color: '#0072ff' }} />
                  <Typography variant="body1">{t('contact.address')}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <EmailIcon sx={{ mr: 1.5, color: '#0072ff' }} />
                  <Typography variant="body1">{t('contact.emailAddress')}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <PhoneIcon sx={{ mr: 1.5, color: '#0072ff' }} />
                  <Typography variant="body1">{t('contact.phone')}</Typography>
                </Box>
              </Box>

              {/* Map */}
              <Box
                sx={{
                  borderRadius: '15px',
                  overflow: 'hidden',
                  height: 250,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                }}
              >
                <iframe
                  src="https://maps.google.com/maps?q=Tashkent&t=&z=13&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  title="map"
                ></iframe>
              </Box>
            </Paper>
          </motion.div>
        </Grid>

        {/* Form Card */}
        <Grid item xs={12} md={7}>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Paper
              elevation={0}
              sx={{
                p: 5,
                borderRadius: '20px',
                background: 'rgba(255,255,255,0.9)',
                backdropFilter: 'blur(15px)',
                border: '1px solid rgba(0,0,0,0.05)',
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 'bold',
                  mb: 3,
                  color: '#0072ff',
                }}
              >
                {t('contact.sendMessageTitle')}
              </Typography>
              <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
              >
                <TextField label={t('contact.name')} required fullWidth />
                <TextField label={t('contact.email')} type="email" required fullWidth />
                <TextField label={t('contact.subject')} required fullWidth />
                <TextField
                  label={t('contact.message')}
                  multiline
                  rows={5}
                  required
                  fullWidth
                />
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    mt: 1,
                    py: 1.4,
                    fontWeight: 'bold',
                    background: 'linear-gradient(90deg, #0072ff, #00c6ff)',
                    '&:hover': {
                      background: 'linear-gradient(90deg, #005fcc, #009bcc)',
                    },
                  }}
                >
                  {submitted ? t('contact.sentButton') : t('contact.sendButton')}
                </Button>
              </Box>
            </Paper>
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ContactSection;
