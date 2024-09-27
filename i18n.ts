import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import en from '@/translation/en.json';
import kr from '@/translation/ko.json';
import sw from '@/translation/sw.json';

// the translations
const resources = {
    en: {
        translation: en,
    },
    sw: {
        translation: sw,
    },
    ko: {
        translation: kr,
    },
};

//default language
i18n.use(initReactI18next).init({
    resources,
    fallbackLng: 'en',
    interpolation: {
        escapeValue: false,
    },
});

export default i18n;
