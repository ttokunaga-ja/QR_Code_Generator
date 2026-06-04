import { createTheme } from '@mui/material/styles';

const FONT_FAMILY = "system-ui, 'Segoe UI', 'Noto Sans JP', sans-serif";

/**
 * モノクロのブルータリスト調デザインをMUIテーマに集約。
 * - 白地に黒、角丸ゼロ、太い黒枠
 * - ホバーで白黒反転、フォーカスは枠を太く
 * これまでTailwindのユーティリティで散在していた装飾をここへ一元化する。
 */
export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#000000', contrastText: '#FFFFFF' },
    background: { default: '#FFFFFF', paper: '#FFFFFF' },
    text: { primary: '#000000', secondary: '#000000' },
    grey: { 50: '#FAFAFA', 100: '#F5F5F5', 400: '#A3A3A3' },
  },
  shape: { borderRadius: 0 },
  typography: {
    fontFamily: FONT_FAMILY,
    fontSize: 16,
    button: { textTransform: 'none', fontWeight: 500 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: { backgroundColor: '#FFFFFF', color: '#000000' },
        canvas: {
          display: 'block',
          imageRendering: 'pixelated',
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true, disableRipple: true },
      styleOverrides: {
        root: { borderRadius: 0, transition: 'background-color 0.15s, color 0.15s' },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          backgroundColor: '#FFFFFF',
          '& .MuiOutlinedInput-notchedOutline': {
            borderWidth: 2,
            borderColor: '#000000',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#000000' },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderWidth: 3,
            borderColor: '#000000',
          },
          '&.Mui-error .MuiOutlinedInput-notchedOutline': { borderColor: '#000000' },
        },
        input: { padding: '12px', fontSize: 14, color: '#000000' },
      },
    },
  },
});

export default theme;
