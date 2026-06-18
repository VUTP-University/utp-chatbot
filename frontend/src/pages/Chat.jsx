import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeSanitize from 'rehype-sanitize'
import { useChat } from '../hooks/useChat'
import { useBotStatus } from '../hooks/useBotStatus'
import { SparkleIcon, MoonIcon, SunIcon } from '../components/Icons'
import StatusIndicator from '../components/StatusIndicator'

const MAX_INPUT_LENGTH = 2000

const SendIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
)

const TrashIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
)

const AIIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <path d="M12 2l1.6 6.4L20 10l-6.4 1.6L12 18l-1.6-6.4L4 10l6.4-1.6L12 2z" />
    <path d="M19.5 1l.6 2.4 2.4.6-2.4.6-.6 2.4-.6-2.4-2.4-.6 2.4-.6L19.5 1z" opacity="0.65" />
  </svg>
)

function LangSwitcher() {
  const { i18n } = useTranslation()
  const current = i18n.language
  const toggle = () => {
    const next = current === 'en' ? 'bg' : 'en'
    i18n.changeLanguage(next)
    localStorage.setItem('lang', next)
  }
  return (
    <button
      className="btn-icon transition-theme"
      onClick={toggle}
      aria-label="Switch language"
      style={{
        fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: '0.7rem',
        letterSpacing: '0.08em', minWidth: 36,
        color: 'var(--color-text-heading)',
        border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)',
        padding: '6px 8px',
      }}
    >
      {current === 'en' ? 'BG' : 'EN'}
    </button>
  )
}

const SUGGESTED_QUESTIONS_EN = [
  'What programs does UTP offer?',
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
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10 }}>
      <BotAvatar />
      <div className="bubble-bot" style={{ display: 'flex', gap: 6, alignItems: 'center', padding: '14px 18px' }}>
        {[0, 1, 2].map(i => (
          <span key={i} style={{
            width: 7, height: 7, borderRadius: '50%',
            background: 'var(--color-accent)',
            display: 'inline-block',
            animation: `bounce 1.2s ${i * 0.18}s ease-in-out infinite`,
          }} />
        ))}
      </div>
    </div>
  )
}

function BotAvatar() {
  return (
    <div className="bot-avatar">
      <AIIcon />
    </div>
  )
}

function Message({ msg }) {
  const isUser = msg.role === 'user'
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, justifyContent: isUser ? 'flex-end' : 'flex-start' }}>
      {!isUser && <BotAvatar />}
      <div className={isUser ? 'bubble-user' : 'bubble-bot markdown-body'} style={{ fontSize: '0.95rem' }}>
        {isUser ? msg.text : (
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>
            {msg.text}
          </ReactMarkdown>
        )}
      </div>
    </div>
  )
}

export default function Chat({ dark, onToggle }) {
  const { t, i18n } = useTranslation()
  const { messages, loading, error, budgetExceeded, sendMessage, clearChat, retryLast } = useChat()
  const botStatus = useBotStatus()
  const [input, setInput] = useState('')
  const bottomRef = useRef(null)
  const inputRef = useRef(null)
  const prevLoadingRef = useRef(false)

  const suggestedQuestions = i18n.language === 'bg' ? SUGGESTED_QUESTIONS_BG : SUGGESTED_QUESTIONS_EN

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  useEffect(() => {
    if (prevLoadingRef.current && !loading) {
      inputRef.current?.focus()
    }
    prevLoadingRef.current = loading
  }, [loading])

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
  const charsLeft = MAX_INPUT_LENGTH - input.length
  const showCharWarning = charsLeft < 200

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100svh', background: 'var(--color-background)' }}>

      {/* ── Top bar (replaces main navbar on the chat page) ── */}
      <div
        className="transition-theme"
        style={{
          borderBottom: '1px solid var(--color-border)',
          padding: '0 20px',
          height: 60,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'var(--color-surface)',
          flexShrink: 0,
        }}
      >
        {/* Brand + status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <div style={{
              width: 34, height: 34, borderRadius: 10,
              background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
              boxShadow: '0 2px 10px rgba(37,99,235,0.28)', flexShrink: 0,
            }}>
              <AIIcon />
            </div>
            <span style={{
              fontFamily: 'var(--font-heading)', fontWeight: 800,
              fontSize: '0.95rem', letterSpacing: '-0.02em',
            }}>
              <span style={{ color: 'var(--color-primary)' }}>{t('nav.brand')}</span>
              {' '}
              <span style={{ fontWeight: 500, color: 'var(--color-text)' }}>{t('nav.brandSuffix')}</span>
            </span>
          </a>

          {/* Divider */}
          <div style={{ width: 1, height: 20, background: 'var(--color-border)' }} />
          <StatusIndicator status={botStatus} />
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {messages.length > 0 && (
            <button
              className="btn btn-ghost"
              onClick={clearChat}
              style={{ fontSize: '0.8rem', padding: '6px 12px', gap: 6 }}
            >
              <TrashIcon />
              <span className="mobile-hidden-text">{t('chat.newChat')}</span>
            </button>
          )}
          <LangSwitcher />
          <button
            className="btn-icon transition-theme"
            onClick={onToggle}
            aria-label="Toggle theme"
            style={{ border: '1px solid var(--color-border)', padding: '7px' }}
          >
            {dark ? <SunIcon /> : <MoonIcon />}
          </button>
          <a href="/" className="btn btn-ghost" style={{ fontSize: '0.8rem', padding: '6px 14px' }}>
            ←<span className="mobile-hidden-text" style={{ marginLeft: 6 }}>{t('chat.backHome')}</span>
          </a>
        </div>
      </div>

      {/* ── Message area ── */}
      <div className="chat-messages-area scrollbar-thin">
        <div style={{ width: '100%', flex: 1, display: 'flex', flexDirection: 'column' }}>

          {isEmpty && (
            <div style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              gap: 36, textAlign: 'center', padding: '0 16px',
            }}>
              <div>
                <div style={{ position: 'relative', width: 72, height: 72, margin: '0 auto 24px' }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} aria-hidden style={{
                      position: 'absolute',
                      inset: `${-i * 12}px`,
                      borderRadius: '50%',
                      border: '1px solid var(--color-primary-border)',
                      opacity: 1 - i * 0.28,
                      animation: `glow-pulse ${1.8 + i * 0.6}s ease-in-out ${i * 0.3}s infinite`,
                    }} />
                  ))}
                  <div style={{
                    width: 72, height: 72, borderRadius: 22,
                    background: 'linear-gradient(135deg, var(--color-primary-muted), var(--color-accent-muted))',
                    border: '1px solid var(--color-primary-border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--color-primary)', position: 'relative',
                  }}>
                    <SparkleIcon />
                  </div>
                </div>
                <h2 style={{ fontSize: '1.5rem', marginBottom: 10, letterSpacing: '-0.03em' }}>
                  {t('chat.emptyTitle')}
                </h2>
                <p style={{ color: 'var(--color-text)', maxWidth: 360, margin: '0 auto', lineHeight: 1.7 }}>
                  {t('chat.emptySubtitle')}
                </p>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center', maxWidth: 560 }}>
                {suggestedQuestions.map((q, i) => (
                  <button key={i} className="btn btn-ghost"
                    style={{ fontSize: '0.85rem', padding: '9px 16px', textAlign: 'left' }}
                    onClick={() => sendMessage(q)}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!isEmpty && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}
              aria-live="polite" aria-relevant="additions" aria-label={t('chat.title')}
            >
              {messages.map((msg, i) => <Message key={i} msg={msg} />)}
              {loading && <TypingIndicator />}
              {error && (
                <div style={{
                  alignSelf: 'flex-start', padding: '10px 16px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(239,68,68,0.07)',
                  border: '1px solid rgba(239,68,68,0.22)',
                  color: 'var(--color-danger)', fontSize: '0.88rem',
                  display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
                }}>
                  <span>{t('chat.error')}</span>
                  <button className="btn btn-ghost" onClick={retryLast}
                    style={{ fontSize: '0.8rem', padding: '5px 12px', color: 'var(--color-danger)', borderColor: 'rgba(239,68,68,0.35)' }}
                  >
                    {t('chat.retry')}
                  </button>
                </div>
              )}
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* ── Status banner ── */}
      {(botStatus !== 'online' || budgetExceeded) && (
        <div style={{
          padding: '10px 24px',
          background: (botStatus === 'offline' || budgetExceeded) ? 'rgba(239,68,68,0.06)' : 'rgba(245,158,11,0.06)',
          borderTop: `1px solid ${(botStatus === 'offline' || budgetExceeded) ? 'rgba(239,68,68,0.18)' : 'rgba(245,158,11,0.18)'}`,
          color: (botStatus === 'offline' || budgetExceeded) ? 'var(--color-danger)' : 'var(--color-warning)',
          fontSize: '0.85rem', textAlign: 'center', flexShrink: 0,
        }}>
          {budgetExceeded
            ? t('chat.errorBudget')
            : t(botStatus === 'offline' ? 'chat.errorOffline' : 'chat.errorConnecting')}
        </div>
      )}

      {/* ── Input bar ── */}
      <div className="chat-input-bar">
        <div style={{ maxWidth: 760, margin: '0 auto', display: 'flex', gap: 10, alignItems: 'flex-end' }}>
          <textarea
            ref={inputRef}
            className="input scrollbar-thin"
            rows={1}
            placeholder={t('chat.placeholder')}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading || botStatus !== 'online'}
            maxLength={MAX_INPUT_LENGTH}
            style={{ resize: 'none', minHeight: 44, maxHeight: 160, overflowY: 'auto', lineHeight: 1.5, padding: '10px 14px', fieldSizing: 'content' }}
          />
          <button
            className="btn btn-primary"
            onClick={handleSend}
            disabled={!input.trim() || loading || botStatus !== 'online'}
            style={{ padding: '11px 16px', flexShrink: 0, alignSelf: 'flex-end' }}
            aria-label={t('chat.send')}
          >
            <SendIcon />
          </button>
        </div>
        <div style={{ maxWidth: 760, margin: '6px auto 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ fontSize: '0.73rem', color: 'var(--color-text-muted)' }}>
            {t('chat.disclaimer')}
          </p>
          {showCharWarning && (
            <span style={{
              fontSize: '0.72rem',
              color: charsLeft < 50 ? 'var(--color-danger)' : 'var(--color-text-muted)',
              flexShrink: 0, marginLeft: 12,
              fontFamily: 'var(--font-mono)',
            }}>
              {charsLeft}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
