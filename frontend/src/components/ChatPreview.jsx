import { useTranslation } from 'react-i18next'
import { ArrowIcon } from './Icons'
import StatusIndicator from './StatusIndicator'
import BrandMark from './BrandMark'
import TypingWave from './TypingWave'

// Static, decorative preview of a conversation shown in the home page hero
export default function ChatPreview() {
  const { t } = useTranslation()
  const messages = t('preview.messages', { returnObjects: true })

  return (
    <div className="preview" aria-hidden="true">
      <div className="airmail" />
      <div className="preview-head">
        <div className="preview-avatar"><BrandMark size={15} /></div>
        <div>
          <div className="preview-title">{t('preview.title')}</div>
          <StatusIndicator />
        </div>
        <span className="preview-freq">CH·01</span>
      </div>

      <div className="preview-body">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`${msg.role === 'user' ? 'bubble-user' : 'bubble-bot'} preview-msg`}
            style={{ animationDelay: `${0.6 + i * 0.35}s` }}
          >
            {msg.text}
          </div>
        ))}
        <div className="bubble-bot preview-msg preview-typing" style={{ animationDelay: `${0.6 + messages.length * 0.35}s` }}>
          <TypingWave />
        </div>
      </div>

      <div className="preview-input">
        <div className="input preview-field">{t('preview.placeholder')}</div>
        <span className="btn btn-primary preview-send"><ArrowIcon /></span>
      </div>
    </div>
  )
}
