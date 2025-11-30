import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation files
import ja from '../locales/ja';
import en from '../locales/en';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      ja: { translation: ja },
      en: { translation: en }
    },
    lng: 'ja', // Default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // React already escapes values
    }
  });

export default i18n;