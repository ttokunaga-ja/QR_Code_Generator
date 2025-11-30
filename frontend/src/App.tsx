import { useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from './lib/i18n';
import { QRGeneratorApp } from './components/QRGeneratorApp';

export default function App() {
  // Ensure i18n is initialized
  useEffect(() => {
    i18n.init();
  }, []);

  return (
    <I18nextProvider i18n={i18n}>
      <QRGeneratorApp />
    </I18nextProvider>
  );
}
