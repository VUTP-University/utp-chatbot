import { useTranslation } from 'react-i18next'
import { setLanguage } from '../i18n'

export default function LangSwitcher() {
  const { t, i18n } = useTranslation()
  const next = i18n.language === 'bg' ? 'en' : 'bg'

  return (
    <button
      type="button"
      className="btn-icon lang-switcher transition-theme"
      onClick={() => setLanguage(next)}
      aria-label={t('a11y.switchLanguage')}
      lang={next}
    >
      {next.toUpperCase()}
    </button>
  )
}
