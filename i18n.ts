import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import en from '@/translation/en.json';
import kr from '@/translation/kr.json';
import sw from '@/translation/sw.json';
import {useAtom} from 'jotai';
import {DefaultLanguage, languageAtom, getDefaultLanguage} from '@/storage/atoms/language';

// the translations
const resources = {
    en: {
        translation: en,
    },
    sw: {
        translation: sw,
    },
    kr: {
        translation: kr,
    },
};

//default language
i18n.use(initReactI18next) // passes i18n down to react-i18next
    .init({
        resources,
        lng: 'sw', // language to use
        fallbackLng: 'en', // fallback language in case the user’s language is not available
        interpolation: {
            escapeValue: false, // react already safes from xss
        },
    });

export default i18n;
