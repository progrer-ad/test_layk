// src/app/theme.ts
import { createTheme } from '@mui/material/styles';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

const theme = createTheme({
  typography: {
    fontFamily: inter.style.fontFamily,
  },
  palette: {
    primary: {
      main: '#FF4081', // Asosiy pushti rang (tanishuv sayti uchun ideal)
    },
    secondary: {
      main: '#607D8B', // Kulrang rang (yordamchi)
    },
    background: {
      default: '#f4f6f8', // Ochiq kulrang fon
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '25px', // Tugmalarga yumaloq burchaklar berish
          textTransform: 'none', // Tugma matnini kichik harflarda qoldirish
          padding: '10px 25px',
        },
      },
    },
  },
});

export default theme;