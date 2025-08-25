// components/theme.js
import { createTheme } from '@mui/material/styles';
import { pink, deepPurple } from '@mui/material/colors';

export const customTheme = createTheme({
  palette: {
    primary: {
      main: pink[500],
      light: pink[100],
      dark: pink[700],
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: deepPurple[500],
      light: deepPurple[200],
      dark: deepPurple[700],
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F7FAFC',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1A202C',
      secondary: '#4A5568',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '25px',
        },
      },
    },
  },
});
