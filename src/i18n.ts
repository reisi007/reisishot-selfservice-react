import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import en_US from './l18n/translations.json';
import de_AT from './l18n/translations-de.json';
import LanguageDetector from 'i18next-browser-languagedetector';

declare module 'react-i18next' {
  // and extend them!
  interface Resources {
    translation: typeof en_US;
  }
}

// const ensureAllKeysAreInGerman: typeof en_US = de_AT // Uncomment to check that the German translation has all keys of the english one

i18n
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    resources: {
      en: {translation: en_US},
      de: {translation: de_AT},
    },
    fallbackLng: 'en',
    debug: false,

    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
  });


export default i18n;
