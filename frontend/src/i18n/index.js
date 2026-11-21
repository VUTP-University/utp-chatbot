import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.json'
import bg from './locales/bg.json'

const SUPPORTED = ['bg', 'en']

function readSavedLang() {
  try {
    return localStorage.getItem('lang')
  } catch {
    return null
  }
}

// Saved choice first; otherwise Bulgarian for Bulgarian browsers (or unknown), English for the rest
function initialLang() {
  const saved = readSavedLang()
  if (SUPPORTED.includes(saved)) return saved
  const browser = (navigator.language || '').slice(0, 2).toLowerCase()
  return !browser || browser === 'bg' ? 'bg' : 'en'
}

export function setLanguage(lang) {
  i18n.changeLanguage(lang)
  try {
    localStorage.setItem('lang', lang)
  } catch {
    // storage unavailable (private mode) — the choice just won't persist
  }
}

i18n.on('languageChanged', (lng) => {
  document.documentElement.lang = lng
})

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      bg: { translation: bg },
    },
    lng: initialLang(),
    fallbackLng: 'bg',
    interpolation: {
      escapeValue: false, // React already escapes
    },
  })

document.documentElement.lang = i18n.language

export default i18n
