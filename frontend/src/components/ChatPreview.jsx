import { useTranslation } from 'react-i18next'
import { ArrowIcon } from './Icons'
import StatusIndicator from './StatusIndicator'

const BotLogoSmall = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z" />
  </svg>
)

export default function ChatPreview() {
  const { t } = useTranslation()
  const messages = t('preview.messages', { returnObjects: true })

  return (
    <div style={{
      background: 'var(--color-surface)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-2xl)',
      overflow: 'hidden',
      boxShadow: '0 24px 60px rgba(8,15,34,0.14), 0 4px 16px rgba(8,15,34,0.06), 0 0 0 1px var(--color-primary-border)',
      maxWidth: 420,
    }}>
      {/* Header */}
      <div style={{
        padding: '14px 18px',
        borderBottom: '1px solid var(--color-border)',
        display: 'flex', alignItems: 'center', gap: 10,
        background: 'var(--color-surface-raised)',
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: 9,
          background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
          flexShrink: 0, boxShadow: '0 2px 8px rgba(37,99,235,0.28)',
        }}>
          <BotLogoSmall />
        </div>
        <div>
          <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.88rem', color: 'var(--color-text-heading)', letterSpacing: '-0.02em' }}>
            {t('preview.title')}
          </div>
          <StatusIndicator />
        </div>
      </div>

      {/* Messages — no height cap, all bubbles always fully visible */}
      <div
        style={{
          padding: '18px 16px',
          display: 'flex', flexDirection: 'column', gap: 10,
          background: 'var(--color-background)',
        }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={msg.role === 'user' ? 'bubble-user' : 'bubble-bot'}
            style={{ fontSize: '0.86rem' }}
          >
            {msg.text}
          </div>
        ))}

        {/* Typing indicator */}
        <div className="bubble-bot" style={{ display: 'flex', gap: 5, alignItems: 'center', width: 'fit-content', padding: '11px 14px' }}>
          {[0, 1, 2].map(i => (
            <span key={i} style={{
              width: 6, height: 6, borderRadius: '50%',
              background: 'var(--color-accent)',
              display: 'inline-block',
              animation: `bounce 1.2s ${i * 0.18}s ease-in-out infinite`,
            }} />
          ))}
        </div>
      </div>

      {/* Input bar */}
      <div style={{
        padding: '12px 16px',
        borderTop: '1px solid var(--color-border)',
        display: 'flex', gap: 8,
        background: 'var(--color-surface)',
      }}>
        <div className="input" style={{ flex: 1, color: 'var(--color-text-muted)', cursor: 'default', fontSize: '0.86rem', padding: '9px 12px' }}>
          {t('preview.placeholder')}
        </div>
        <button className="btn btn-primary" style={{ padding: '9px 14px', flexShrink: 0 }}>
          <ArrowIcon />
        </button>
      </div>
    </div>
  )
}
