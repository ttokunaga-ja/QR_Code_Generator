import { useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import i18n from './lib/i18n';
import theme from './lib/theme';
import { QRGeneratorApp } from './components/QRGeneratorApp';

export default function App() {
  // Ensure i18n is initialized
  useEffect(() => {
    i18n.init();
  }, []);

  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <QRGeneratorApp />
      </ThemeProvider>
    </I18nextProvider>
  );
}
