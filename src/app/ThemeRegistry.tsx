// src/app/ThemeRegistry.tsx
'use client'; // Bu komponent mijoz tomonida ishlashini belgilaydi

import * as React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import NextAppDirEmotionCacheProvider from './EmotionCache';
import theme from './theme'; // Bizning mavzu faylimizni import qilamiz

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  return (
    <NextAppDirEmotionCacheProvider options={{ key: 'mui' }}>
      <ThemeProvider theme={theme}>
        {/* CssBaseline MUI stilini normalizatsiya qiladi va Material Design fon rangini qo'llaydi */}
        <CssBaseline />
        {children}
      </ThemeProvider>
    </NextAppDirEmotionCacheProvider>
  );
}