import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { MoonIcon, SunIcon, MenuIcon, XIcon } from './Icons'
import BrandMark from './BrandMark'
import LangSwitcher from './LangSwitcher'

export default function Navbar({ dark, onToggle }) {
  const { t } = useTranslation()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    if (!mobileOpen) return
    const close = () => setMobileOpen(false)
    const onKey = (e) => { if (e.key === 'Escape') close() }
    window.addEventListener('scroll', close, { passive: true })
    document.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('scroll', close)
      document.removeEventListener('keydown', onKey)
    }
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
        backdropFilter: scrolled && !mobileOpen ? 'blur(16px) saturate(1.6)' : 'none',
        WebkitBackdropFilter: scrolled && !mobileOpen ? 'blur(16px) saturate(1.6)' : 'none',
      }}
    >
      <div style={{
        maxWidth: 1200, margin: '0 auto', padding: '0 24px',
        height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <span style={{ color: 'var(--color-accent)', display: 'flex', alignItems: 'center' }}>
            <BrandMark size={20} />
          </span>
          <span style={{
            fontFamily: 'var(--font-heading)',
            fontWeight: 800,
            fontSize: '1rem',
            letterSpacing: '-0.02em',
            color: 'var(--color-text-heading)',
          }}>
            <span style={{ color: 'var(--color-primary)' }}>{t('nav.brand')}</span>
            {' '}
            <span style={{ fontWeight: 500, color: 'var(--color-text)' }}>{t('nav.brandSuffix')}</span>
          </span>
        </a>

        {/* Nav links — desktop */}
        <nav style={{ display: 'flex', gap: 36, alignItems: 'center' }} className="hide-mobile">
          {navLinks.map(({ label, href }) => (
            <a key={href} href={href} className="nav-link">
              {label}
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <LangSwitcher />
          <button
            className="btn-icon transition-theme"
            onClick={onToggle}
            aria-label={t('a11y.toggleTheme')}
            style={{ border: '1px solid var(--color-border)', padding: '7px' }}
          >
            {dark ? <SunIcon /> : <MoonIcon />}
          </button>
          <a
            href="/chat"
            className="btn btn-primary hide-mobile"
            style={{ fontSize: '0.85rem', padding: '8px 20px' }}
          >
            {t('nav.openChat')}
          </a>
          <button
            className="btn-icon show-mobile"
            onClick={() => setMobileOpen(o => !o)}
            aria-label={t(mobileOpen ? 'a11y.closeMenu' : 'a11y.openMenu')}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <XIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <nav style={{
          background: 'var(--color-surface)',
          borderTop: '1px solid var(--color-border)',
          padding: '8px 24px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: 0,
        }}>
          {navLinks.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              style={{
                fontSize: '1rem', fontWeight: 500, color: 'var(--color-text)',
                padding: '15px 0', borderBottom: '1px solid var(--color-border)',
                textDecoration: 'none', display: 'block', transition: 'color 150ms ease',
              }}
            >
              {label}
            </a>
          ))}
          <a
            href="/chat"
            className="btn btn-primary"
            onClick={() => setMobileOpen(false)}
            style={{ marginTop: 20, fontSize: '0.95rem', justifyContent: 'center' }}
          >
            {t('nav.openChat')}
          </a>
        </nav>
      )}
    </header>
  )
}
