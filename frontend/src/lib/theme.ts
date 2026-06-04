import { createTheme } from '@mui/material/styles';

const FONT_FAMILY = "system-ui, 'Segoe UI', 'Noto Sans JP', sans-serif";

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#146C6C', dark: '#0D4F4F', contrastText: '#FFFFFF' },
    secondary: { main: '#E35D45', contrastText: '#FFFFFF' },
    background: { default: '#F6F8F7', paper: '#FFFFFF' },
    text: { primary: '#172326', secondary: '#657174' },
    divider: '#DDE5E2',
    grey: { 50: '#FAFBFA', 100: '#EEF3F1', 300: '#DDE5E2', 400: '#98A5A7' },
  },
  shape: { borderRadius: 8 },
  typography: {
    fontFamily: FONT_FAMILY,
    fontSize: 16,
    h1: { fontWeight: 800, letterSpacing: 0 },
    h2: { fontWeight: 800, letterSpacing: 0 },
    h3: { fontWeight: 700, letterSpacing: 0 },
    button: { textTransform: 'none', fontWeight: 700, letterSpacing: 0 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#F6F8F7',
          color: '#172326',
        },
        canvas: {
          display: 'block',
          imageRendering: 'pixelated',
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: 999,
          transition: 'background-color 0.18s, color 0.18s, border-color 0.18s',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: { borderRadius: 999 },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          backgroundColor: '#FFFFFF',
          '& .MuiOutlinedInput-notchedOutline': {
            borderWidth: 1,
            borderColor: '#D7E0DD',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#146C6C' },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderWidth: 2,
            borderColor: '#146C6C',
          },
          '&.Mui-error .MuiOutlinedInput-notchedOutline': { borderColor: '#E35D45' },
        },
        input: { padding: '14px 14px', fontSize: 15, color: '#172326' },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: '#657174',
          '&.Mui-focused': { color: '#146C6C' },
        },
      },
    },
    MuiPaper: {
      defaultProps: { elevation: 0 },
    },
  },
});

export default theme;
