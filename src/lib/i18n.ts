import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from '@/locales/en/common.json'
import ru from '@/locales/ru/common.json'
import zh from '@/locales/zh/common.json'
import es from '@/locales/es/common.json'
import hi from '@/locales/hi/common.json'
import ar from '@/locales/ar/common.json'

const resources = {
  en: { common: en },
  ru: { common: ru },
  zh: { common: zh },
  es: { common: es },
  hi: { common: hi },
  ar: { common: ar },
}

if (!i18n.isInitialized) {
  i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: 'en',
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false,
      },
    })
}

export default i18n
