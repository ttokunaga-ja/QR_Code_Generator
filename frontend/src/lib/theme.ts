import { createTheme } from '@mui/material/styles';

const FONT_FAMILY = "system-ui, 'Segoe UI', 'Noto Sans JP', sans-serif";

export const theme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'media',
  },
  colorSchemes: {
    light: {
      palette: {
        primary: { main: '#146C6C', dark: '#0D4F4F', contrastText: '#FFFFFF' },
        secondary: { main: '#E35D45', dark: '#B63F2D', contrastText: '#FFFFFF' },
        background: { default: '#F6F8F7', paper: '#FFFFFF' },
        text: { primary: '#172326', secondary: '#657174' },
        divider: '#DDE5E2',
        grey: { 50: '#FAFBFA', 100: '#EEF3F1', 300: '#DDE5E2', 400: '#98A5A7' },
      },
    },
    dark: {
      palette: {
        primary: { main: '#63C7BF', dark: '#34A69C', contrastText: '#071211' },
        secondary: { main: '#F28A76', dark: '#D86550', contrastText: '#2B100B' },
        background: { default: '#071211', paper: '#101C1B' },
        text: { primary: '#F2F7F6', secondary: '#B8C7C4' },
        divider: 'rgba(255, 255, 255, 0.14)',
        grey: { 50: '#14211F', 100: '#1A2A28', 300: '#314541', 400: '#91A39F' },
      },
    },
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
        ':root': {
          colorScheme: 'light dark',
        },
        body: {
          backgroundColor: 'var(--mui-palette-background-default)',
          color: 'var(--mui-palette-text-primary)',
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
          backgroundColor: 'var(--mui-palette-background-paper)',
          '& .MuiOutlinedInput-notchedOutline': {
            borderWidth: 1,
            borderColor: 'var(--mui-palette-divider)',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'var(--mui-palette-primary-main)',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderWidth: 2,
            borderColor: 'var(--mui-palette-primary-main)',
          },
          '&.Mui-error .MuiOutlinedInput-notchedOutline': {
            borderColor: 'var(--mui-palette-secondary-main)',
          },
        },
        input: {
          padding: '14px 14px',
          fontSize: 15,
          color: 'var(--mui-palette-text-primary)',
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: 'var(--mui-palette-text-secondary)',
          '&.Mui-focused': { color: 'var(--mui-palette-primary-main)' },
        },
      },
    },
    MuiPaper: {
      defaultProps: { elevation: 0 },
    },
  },
});

export default theme;
