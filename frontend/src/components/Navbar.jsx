import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { ChatIcon, MoonIcon, SunIcon, MenuIcon, XIcon } from './Icons'

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
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    if (!mobileOpen) return
    const close = () => setMobileOpen(false)
    window.addEventListener('scroll', close, { passive: true })
    return () => window.removeEventListener('scroll', close)
  }, [mobileOpen])

  const navLinks = [
    { label: t('nav.features'),   href: '#features'     },
    { label: t('nav.howItWorks'), href: '#how-it-works' },
  ]

  const hasBg = scrolled || mobileOpen

  return (
    <header
      className="transition-theme"
      style={{
        position: 'sticky', top: 0, zIndex: 50,
        borderBottom: `1px solid ${hasBg ? 'var(--color-border)' : 'transparent'}`,
        background: hasBg ? 'var(--color-surface)' : 'transparent',
        backdropFilter: scrolled && !mobileOpen ? 'blur(12px)' : 'none',
        WebkitBackdropFilter: scrolled && !mobileOpen ? 'blur(12px)' : 'none',
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

        {/* Nav links — desktop only */}
        <nav style={{ display: 'flex', gap: 32, alignItems: 'center' }} className="hide-mobile">
          {navLinks.map(({ label, href }) => (
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
          <button
            className="btn-icon show-mobile"
            onClick={() => setMobileOpen(o => !o)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <XIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <nav style={{ background: 'var(--color-surface)', padding: '8px 24px 20px', display: 'flex', flexDirection: 'column' }}>
          {navLinks.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              style={{
                fontSize: '1rem', fontWeight: 500, color: 'var(--color-text)',
                padding: '14px 0', borderBottom: '1px solid var(--color-border)',
                textDecoration: 'none', display: 'block',
              }}
              onMouseEnter={e => e.target.style.color = 'var(--color-text-heading)'}
              onMouseLeave={e => e.target.style.color = 'var(--color-text)'}
            >
              {label}
            </a>
          ))}
          <a
            href="/chat"
            className="btn btn-primary"
            onClick={() => setMobileOpen(false)}
            style={{ marginTop: 16, fontSize: '0.95rem', justifyContent: 'center' }}
          >
            <ChatIcon /> {t('nav.openChat')}
          </a>
        </nav>
      )}
    </header>
  )
}
