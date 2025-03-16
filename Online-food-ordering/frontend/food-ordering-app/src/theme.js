import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ff1744', // Red color for primary elements
    },
    secondary: {
      main: '#2979ff', // Blue color for secondary elements
    },
    background: {
      default: '#121212', // Dark black
      paper: 'rgba(18, 18, 18, 0.8)', // Translucent black
    },
    text: {
      primary: '#ffffff', // White text
      secondary: '#b0b0b0', // Light gray for secondary text
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ff1744', // Red color for navigation bars
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
        containedPrimary: {
          backgroundColor: '#ff1744',
          '&:hover': {
            backgroundColor: '#d50000',
          },
        },
        containedSecondary: {
          backgroundColor: '#2979ff',
          '&:hover': {
            backgroundColor: '#2962ff',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 4,
        },
      },
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
  },
});

export default theme; 