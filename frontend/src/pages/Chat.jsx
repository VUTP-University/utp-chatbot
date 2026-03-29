import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useChat } from '../hooks/useChat'
import { ChatIcon, ArrowIcon, SparkleIcon } from '../components/Icons'

const SendIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
)

const TrashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
)

const SUGGESTED_QUESTIONS_EN = [
  'What programs does VUTП offer?',
  'How do I apply for admission?',
  'What are the tuition fees?',
  'Where is the campus located?',
]

const SUGGESTED_QUESTIONS_BG = [
  'Какви специалности предлага ВУТП?',
  'Как да кандидатствам за прием?',
  'Какви са таксите за обучение?',
  'Къде се намира кампусът?',
]

function TypingIndicator() {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
      <BotAvatar />
      <div className="bubble-bot" style={{ display: 'flex', gap: 5, alignItems: 'center', padding: '14px 16px' }}>
        {[0, 1, 2].map(i => (
          <span key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--color-text-muted)', display: 'inline-block', animation: `bounce 1.2s ${i * 0.2}s ease-in-out infinite` }} />
        ))}
      </div>
    </div>
  )
}

function BotAvatar() {
  return (
    <div style={{ width: 30, height: 30, borderRadius: 8, background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0, alignSelf: 'flex-end', marginBottom: 2 }}>
      <ChatIcon />
    </div>
  )
}

function Message({ msg }) {
  const isUser = msg.role === 'user'

  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, justifyContent: isUser ? 'flex-end' : 'flex-start' }}>
      {!isUser && <BotAvatar />}
      <div
        className={isUser ? 'bubble-user' : 'bubble-bot'}
        style={{ fontSize: '0.95rem', whiteSpace: 'pre-wrap' }}
      >
        {msg.text}
      </div>
    </div>
  )
}

export default function Chat() {
  const { t, i18n } = useTranslation()
  const { messages, loading, error, sendMessage, clearChat } = useChat()
  const [input, setInput] = useState('')
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  const suggestedQuestions = i18n.language === 'bg' ? SUGGESTED_QUESTIONS_BG : SUGGESTED_QUESTIONS_EN

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const handleSend = () => {
    const text = input.trim()
    if (!text || loading) return
    setInput('')
    sendMessage(text)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const isEmpty = messages.length === 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100svh - 64px)', background: 'var(--color-background)' }}>
      {/* Top bar */}
      <div style={{ borderBottom: '1px solid var(--color-border)', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--color-surface)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
            <ChatIcon />
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--color-text-heading)' }}>
              {t('chat.title')}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-success)', display: 'inline-block' }} />
              {t('chat.online')}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {messages.length > 0 && (
            <button
              className="btn btn-ghost"
              onClick={clearChat}
              style={{ fontSize: '0.82rem', padding: '7px 14px', gap: 6 }}
            >
              <TrashIcon /> {t('chat.newChat')}
            </button>
          )}
          <a href="/" className="btn btn-ghost" style={{ fontSize: '0.82rem', padding: '7px 14px', gap: 6 }}>
            ← {t('chat.backHome')}
          </a>
        </div>
      </div>

      {/* Message area */}
      <div className="scrollbar-thin" style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ maxWidth: 760, width: '100%', margin: '0 auto', flex: 1, display: 'flex', flexDirection: 'column' }}>

          {/* Empty state */}
          {isEmpty && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 32, textAlign: 'center' }}>
              <div>
                <div style={{ width: 64, height: 64, borderRadius: 20, background: 'var(--color-primary-muted)', border: '1px solid var(--color-primary-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)', margin: '0 auto 20px' }}>
                  <SparkleIcon />
                </div>
                <h2 style={{ fontSize: '1.4rem', marginBottom: 8 }}>{t('chat.emptyTitle')}</h2>
                <p style={{ color: 'var(--color-text)', maxWidth: 380, margin: '0 auto', lineHeight: 1.65 }}>
                  {t('chat.emptySubtitle')}
                </p>
              </div>

              {/* Suggested questions */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center', maxWidth: 560 }}>
                {suggestedQuestions.map((q, i) => (
                  <button
                    key={i}
                    className="btn btn-ghost"
                    style={{ fontSize: '0.85rem', padding: '9px 16px', textAlign: 'left' }}
                    onClick={() => sendMessage(q)}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          {!isEmpty && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {messages.map((msg, i) => (
                <Message key={i} msg={msg} />
              ))}
              {loading && <TypingIndicator />}
              {error && (
                <div style={{ alignSelf: 'flex-start', padding: '10px 14px', borderRadius: 'var(--radius-md)', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: 'var(--color-danger)', fontSize: '0.88rem' }}>
                  {t('chat.error')}
                </div>
              )}
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input bar */}
      <div style={{ borderTop: '1px solid var(--color-border)', padding: '16px 24px', background: 'var(--color-surface)', flexShrink: 0 }}>
        <div style={{ maxWidth: 760, margin: '0 auto', display: 'flex', gap: 10, alignItems: 'flex-end' }}>
          <textarea
            ref={inputRef}
            className="input scrollbar-thin"
            rows={1}
            placeholder={t('chat.placeholder')}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
            style={{ resize: 'none', minHeight: 44, maxHeight: 160, overflowY: 'auto', lineHeight: 1.5, padding: '10px 14px', field_sizing: 'content' }}
          />
          <button
            className="btn btn-primary"
            onClick={handleSend}
            disabled={!input.trim() || loading}
            style={{ padding: '11px 16px', flexShrink: 0, alignSelf: 'flex-end' }}
            aria-label={t('chat.send')}
          >
            <SendIcon />
          </button>
        </div>
        <p style={{ textAlign: 'center', marginTop: 10, fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
          {t('chat.disclaimer')}
        </p>
      </div>
    </div>
  )
}
