import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation files
import ja from '../locales/ja';
import en from '../locales/en';

function getInitialLanguage() {
  if (typeof window === 'undefined') return 'ja';

  const stored = window.localStorage.getItem('qr-locale');
  if (stored === 'ja' || stored === 'en') return stored;

  return window.navigator.language.toLowerCase().startsWith('en') ? 'en' : 'ja';
}

i18n
  .use(initReactI18next)
  .init({
    resources: {
      ja: { translation: ja },
      en: { translation: en }
    },
    lng: getInitialLanguage(),
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // React already escapes values
    }
  });

export default i18n;
