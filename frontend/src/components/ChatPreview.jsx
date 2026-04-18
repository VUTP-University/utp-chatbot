import { useTranslation } from 'react-i18next'
import { ChatIcon, ArrowIcon } from './Icons'
import StatusIndicator from './StatusIndicator'

export default function ChatPreview() {
  const { t } = useTranslation()
  const messages = t('preview.messages', { returnObjects: true })

  return (
    <div className="card glow-primary" style={{ padding: 0, overflow: 'hidden', maxWidth: 420 }}>
      {/* Header */}
      <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: 10, background: 'var(--color-surface-raised)' }}>
        <div style={{ width: 30, height: 30, borderRadius: 8, background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
          <ChatIcon />
        </div>
        <div>
          <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-text-heading)' }}>{t('preview.title')}</div>
          <StatusIndicator />
        </div>
      </div>

      {/* Messages */}
      <div className="scrollbar-thin" style={{ padding: '18px 16px', display: 'flex', flexDirection: 'column', gap: 12, maxHeight: 320, overflowY: 'auto', background: 'var(--color-surface)' }}>
        {messages.map((msg, i) => (
          <div key={i} className={msg.role === 'user' ? 'bubble-user' : 'bubble-bot'} style={{ fontSize: '0.88rem' }}>
            {msg.text}
          </div>
        ))}
        {/* Typing indicator */}
        <div className="bubble-bot" style={{ display: 'flex', gap: 5, alignItems: 'center', width: 'fit-content' }}>
          {[0, 1, 2].map(i => (
            <span key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--color-text-muted)', display: 'inline-block', animation: `bounce 1.2s ${i * 0.2}s ease-in-out infinite` }} />
          ))}
        </div>
      </div>

      {/* Input bar */}
      <div style={{ padding: '12px 16px', borderTop: '1px solid var(--color-border)', display: 'flex', gap: 8, background: 'var(--color-surface-raised)' }}>
        <div className="input" style={{ flex: 1, color: 'var(--color-text-muted)', cursor: 'default', fontSize: '0.88rem', padding: '9px 12px' }}>
          {t('preview.placeholder')}
        </div>
        <button className="btn btn-primary" style={{ padding: '9px 14px', flexShrink: 0 }}>
          <ArrowIcon />
        </button>
      </div>
    </div>
  )
}
