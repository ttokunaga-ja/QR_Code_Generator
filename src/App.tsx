import { I18nextProvider } from 'react-i18next';
import CssBaseline from '@mui/material/CssBaseline';
import GlobalStyles from '@mui/material/GlobalStyles';
import { ThemeProvider } from '@mui/material/styles';
import i18n from './lib/i18n';
import theme from './lib/theme';
import { QRGeneratorApp } from './components/QRGeneratorApp';

export default function App() {
  // i18n is initialized synchronously in ./lib/i18n on import.
  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider theme={theme} defaultMode="system">
        <CssBaseline enableColorScheme />
        <GlobalStyles
          styles={{
            'html, body, #root': {
              minHeight: '100%',
            },
            body: {
              backgroundColor: 'var(--mui-palette-background-default)',
            },
            '*, *::before, *::after': {
              boxSizing: 'border-box',
            },
          }}
        />
        <QRGeneratorApp />
      </ThemeProvider>
    </I18nextProvider>
  );
}
