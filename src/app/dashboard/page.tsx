// src/app/dashboard/page.tsx
'use client';

import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Box, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import axios from 'axios';

const DashboardIndexPage = () => {
  const [userName, setUserName] = useState('Foydalanuvchi'); // Default value
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Backenddan foydalanuvchini olish (cookie bilan)
    axios.get("https://68ac5f519148d.xvest1.ru/api/debug-auth", {
      withCredentials: true, // Cookie yuborilsin
      headers: {
        Accept: "application/json",
      }
    })
      .then(res => {
        console.log("Backenddan foydalanuvchi:", res.data);
        if (res.data?.user) {
          setUserName(res.data.user.name);
        }
      })
      .catch(err => {
        console.error("Auth tekshiruv xatosi:", err.response?.data || err);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout>
      <Box sx={{ py: { xs: 1, sm: 2 } }}>

      </Box>
    </DashboardLayout>
  );
};

export default DashboardIndexPage;
