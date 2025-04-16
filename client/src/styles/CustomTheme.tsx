import { createTheme, ThemeOptions } from '@mui/material/styles';

const theme: ThemeOptions = createTheme({
  palette: {
    background: {
      default: '#fafafa',
    },
    primary: {
      main: '#000',
      light: '#fff',
    },
  },
  typography: {
    h1: {
      fontSize: 'clamp(36px, 5vw, 50px)',
      fontWeight: 700,
      lineHeight: 1,
    },
    h3: {
      fontSize: 'clamp(20px, 2.4vw, 24px)',
      fontWeight: 700,
      lineHeight: 1,
    },
  },
});

export default theme;
