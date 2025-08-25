// src/app/dashboard/page.tsx
'use client';

import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Box, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

const DashboardIndexPage = () => {
  const [userName, setUserName] = useState('Foydalanuvchi'); // Default value

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setUserName(user.name);
      } catch (e) {
        // Handle error, maybe clear localStorage
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
  }, []);

  return (
    <DashboardLayout>
      <Box sx={{ py: { xs: 1, sm: 2 } }}> {/* Paddingni responsiv qildik */}
        
        {/* Bu yerga kelajakda boshqa dashboard komponentlaringizni qo'shishingiz mumkin */}
        
      </Box>
    </DashboardLayout>
  );
};

export default DashboardIndexPage;