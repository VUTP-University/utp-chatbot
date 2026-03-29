import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { ChatIcon, MoonIcon, SunIcon } from './Icons'

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
      style={{ fontWeight: 700, fontSize: '0.8rem', minWidth: 36, letterSpacing: '0.04em', color: 'var(--color-text-heading)' }}
    >
      {current === 'en' ? 'BG' : 'EN'}
    </button>
  )
}

export default function Navbar({ dark, onToggle }) {
  const { t } = useTranslation()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <header
      className="transition-theme"
      style={{
        position: 'sticky', top: 0, zIndex: 50,
        borderBottom: `1px solid ${scrolled ? 'var(--color-border)' : 'transparent'}`,
        background: scrolled ? 'var(--color-surface)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Logo */}
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
            <ChatIcon />
          </div>
          <span style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--color-text-heading)', letterSpacing: '-0.02em' }}>
            {t('nav.brand')} <span style={{ color: 'var(--color-primary)' }}>ChatBot</span>
          </span>
        </a>

        {/* Nav links */}
        <nav style={{ display: 'flex', gap: 32, alignItems: 'center' }} className="hide-mobile">
          {[
            { label: t('nav.features'),   href: '#features'     },
            { label: t('nav.howItWorks'), href: '#how-it-works' },
          ].map(({ label, href }) => (
            <a key={href} href={href}
              style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--color-text)', transition: 'color 150ms ease' }}
              onMouseEnter={e => e.target.style.color = 'var(--color-text-heading)'}
              onMouseLeave={e => e.target.style.color = 'var(--color-text)'}
            >
              {label}
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <LangSwitcher />
          <button className="btn-icon transition-theme" onClick={onToggle} aria-label="Toggle theme">
            {dark ? <SunIcon /> : <MoonIcon />}
          </button>
          <a href="/chat" className="btn btn-primary hide-mobile" style={{ fontSize: '0.85rem', padding: '8px 18px' }}>
            {t('nav.openChat')}
          </a>
        </div>
      </div>
    </header>
  )
}
