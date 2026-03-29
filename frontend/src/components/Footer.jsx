import { useTranslation } from 'react-i18next'
import { ChatIcon } from './Icons'

export default function Footer() {
  const { t } = useTranslation()

  return (
    <footer style={{ borderTop: '1px solid var(--color-border)', padding: '28px 24px', background: 'var(--color-surface)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
            <ChatIcon />
          </div>
          <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-text-heading)' }}>
            {t('nav.brand')} ChatBot
          </span>
        </div>
        <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
          {t('footer.copyright', { year: new Date().getFullYear() })}
        </p>
      </div>
    </footer>
  )
}
