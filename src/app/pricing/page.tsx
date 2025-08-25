'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';

/**
 * Ushbu komponent Next.js uchun to'g'irlangan va API dan ma'lumot olib kelishni simulyatsiya qiladi.
 * Dizayn Material-UI (MUI) yordamida yaratilgan.
 */
const PricingPage = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Laravel API'sidan ma'lumot olishni simulyatsiya qilamiz
  useEffect(() => {
    const fetchPricingPlans = async () => {
      try {
        setLoading(true);
        // Bu joyga o'zingizning haqiqiy Laravel API'ingizdan ma'lumot olish so'rovini qo'yishingiz mumkin.
        // Masalan: const response = await fetch('http://your-laravel-api.com/api/pricing-plans');

        // Soxta (mock) API javobi
        const mockApiResponse = [
          {
            id: 1,
            name: "Bepul",
            price: 0,
            period: "oyiga",
            description: "Oddiy loyihalar uchun ajoyib boshlanish.",
            features: [
              { text: "10 GB saqlash joyi", enabled: true },
              { text: "Cheklanmagan loyihalar", enabled: true },
              { text: "Asosiy yordam", enabled: true },
              { text: "Hisobotlar yo'q", enabled: false },
            ],
            isPopular: false,
          },
          {
            id: 2,
            name: "Pro",
            price: 29,
            period: "oyiga",
            description: "Kichik guruhlar va o'sib borayotgan loyihalar uchun.",
            features: [
              { text: "100 GB saqlash joyi", enabled: true },
              { text: "Cheklanmagan foydalanuvchilar", enabled: true },
              { text: "24/7 yordam", enabled: true },
              { text: "Advanced hisobotlar", enabled: true },
            ],
            isPopular: true,
          },
          {
            id: 3,
            name: "Biznes",
            price: 99,
            period: "oyiga",
            description: "Katta tashkilotlar va jamoalar uchun.",
            features: [
              { text: "Cheklanmagan saqlash joyi", enabled: true },
              { text: "Premium qo'llab-quvvatlash", enabled: true },
              { text: "Maxsus hisobotlar", enabled: true },
              { text: "Maxsus integratsiyalar", enabled: true },
            ],
            isPopular: false,
          },
        ];

        // Tarmoq kechikishini simulyatsiya qilamiz
        await new Promise(resolve => setTimeout(resolve, 1000));

        setPlans(mockApiResponse);

      } catch (err) {
        setError("Ma'lumotlarni yuklashda xatolik yuz berdi. Iltimos, keyinroq urinib ko'ring.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPricingPlans();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: '#f9fafb', minHeight: '100vh', py: 8 }}>
      <Container maxWidth="lg">
        <Box textAlign="center" mb={6}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Siz uchun eng mos narx rejasini tanlang
          </Typography>
          <Typography variant="h6" color="text.secondary" maxWidth="md" mx="auto">
            Oddiy loyihalardan tortib, yirik biznesgacha, barcha ehtiyojlaringiz uchun mos keladigan narx rejalarimiz mavjud.
          </Typography>
        </Box>

        <Grid container spacing={4} justifyContent="center">
          {plans.map((plan) => (
            <Grid item xs={12} sm={6} md={4} key={plan.id}>
              <Card
                sx={{
                  position: 'relative',
                  p: 3,
                  borderRadius: 4,
                  boxShadow: plan.isPopular ? '0 10px 15px -3px rgb(99 102 241 / 0.5), 0 4px 6px -4px rgb(99 102 241 / 0.5)' : '0 4px 6px rgba(0, 0, 0, 0.1)',
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                  backgroundColor: plan.isPopular ? '#4f46e5' : '#fff',
                  color: plan.isPopular ? '#fff' : 'inherit',
                }}
              >
                {plan.isPopular && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      backgroundColor: '#facc15',
                      color: '#713f12',
                      fontSize: '0.875rem',
                      fontWeight: 'bold',
                      py: 0.5,
                      px: 2,
                      borderTopRightRadius: 16,
                      borderBottomLeftRadius: 16,
                    }}
                  >
                    Eng yaxshi
                  </Box>
                )}
                <CardContent>
                  <Typography variant="h4" component="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
                    {plan.name}
                  </Typography>
                  <Typography variant="body2" color={plan.isPopular ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary'}>
                    {plan.description}
                  </Typography>
                  <Box my={3}>
                    <Typography variant="h3" component="p" sx={{ fontWeight: 'extrabold' }}>
                      ${plan.price}
                      <Typography component="span" variant="h6" ml={1} sx={{ fontWeight: 'normal', color: plan.isPopular ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary' }}>
                        /{plan.period}
                      </Typography>
                    </Typography>
                  </Box>

                  <List sx={{ mt: 3, p: 0 }}>
                    {plan.features.map((feature, idx) => (
                      <ListItem key={idx} disablePadding>
                        <ListItemIcon sx={{ minWidth: 36, color: feature.enabled ? (plan.isPopular ? '#d1f7d1' : '#10b981') : (plan.isPopular ? '#fca5a5' : '#ef4444')}}>
                          <CheckIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary={feature.text}
                          primaryTypographyProps={{
                            color: plan.isPopular ? 'rgba(255, 255, 255, 0.9)' : 'text.primary',
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>

                <Box mt={3}>
                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    sx={{
                      py: 2,
                      borderRadius: 2,
                      fontWeight: 'bold',
                      transition: 'background-color 0.3s ease-in-out',
                      backgroundColor: plan.isPopular ? '#fff' : '#4f46e5',
                      color: plan.isPopular ? '#4f46e5' : '#fff',
                      '&:hover': {
                        backgroundColor: plan.isPopular ? '#e0e0e0' : '#4338ca',
                      }
                    }}
                  >
                    Boshlash
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default PricingPage;
