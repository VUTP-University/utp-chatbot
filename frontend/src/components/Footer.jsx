import { useTranslation } from 'react-i18next'
import { GlobeIcon, GithubIcon, FacebookIcon, LinkedinIcon, YoutubeIcon } from './Icons'

const AIIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <path d="M12 2l1.6 6.4L20 10l-6.4 1.6L12 18l-1.6-6.4L4 10l6.4-1.6L12 2z" />
    <path d="M19.5 1l.6 2.4 2.4.6-2.4.6-.6 2.4-.6-2.4-2.4-.6 2.4-.6L19.5 1z" opacity="0.65" />
  </svg>
)

const USEFUL_LINKS = [
  { labelKey: 'footer.links.admissions', href: 'https://www.utp.bg/admission-of-students/' },
  { labelKey: 'footer.links.programs',   href: 'https://www.utp.bg/training/curricula/' },
  { labelKey: 'footer.links.schedule',   href: 'https://www.utp.bg/training/academic-calendar/' },
  { labelKey: 'footer.links.about',      href: '/about', internal: true },
]

const SOCIAL_LINKS = [
  { label: 'Website',  icon: <GlobeIcon />,    href: 'https://www.utp.bg/' },
  { label: 'Facebook', icon: <FacebookIcon />,  href: 'https://www.facebook.com/www.utp.bg' },
  { label: 'LinkedIn', icon: <LinkedinIcon />,  href: 'https://www.linkedin.com/school/university-of-telecommunications-and-post-sofia/posts/?feedView=all' },
  { label: 'YouTube',  icon: <YoutubeIcon />,   href: 'https://www.youtube.com/@%D0%92%D0%B8%D1%81%D1%88%D0%B5%D1%83%D1%87%D0%B8%D0%BB%D0%B8%D1%89%D0%B5%D0%BF%D0%BE%D1%82%D0%B5%D0%BB%D0%B5%D0%BA%D0%BE%D0%BC%D1%83%D0%BD%D0%B8%D0%BA%D0%B0-%D1%8F6%D1%89' },
  { label: 'GitHub',   icon: <GithubIcon />,    href: 'https://github.com/VUTP-University' },
]

export default function Footer() {
  const { t } = useTranslation()

  return (
    <footer style={{ background: 'var(--color-surface)', position: 'relative' }}>
      {/* Signal gradient top line */}
      <div aria-hidden style={{
        height: 1,
        background: 'linear-gradient(90deg, transparent 0%, var(--color-primary-border) 30%, var(--color-accent-border) 70%, transparent 100%)',
      }} />

      {/* Main footer grid */}
      <div style={{
        maxWidth: 1200, margin: '0 auto',
        padding: '52px 24px 36px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 44,
      }}>
        {/* Brand column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 7, textDecoration: 'none' }}>
            <span style={{ color: 'var(--color-accent)', display: 'flex', alignItems: 'center' }}>
              <AIIcon />
            </span>
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '0.95rem', letterSpacing: '-0.02em' }}>
              <span style={{ color: 'var(--color-primary)' }}>{t('nav.brand')}</span>
              {' '}
              <span style={{ fontWeight: 500, color: 'var(--color-text)' }}>{t('nav.brandSuffix')}</span>
            </span>
          </a>

          <p style={{ fontSize: '0.85rem', color: 'var(--color-text)', lineHeight: 1.7, maxWidth: 240 }}>
            {t('footer.tagline')}
          </p>

          {/* Social icons */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 2 }}>
            {SOCIAL_LINKS.map(({ label, icon, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                style={{
                  width: 36, height: 36, borderRadius: 9,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--color-text-muted)',
                  border: '1px solid var(--color-border)',
                  transition: 'color 150ms ease, border-color 150ms ease, background 150ms ease, transform 150ms ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = 'var(--color-primary)'
                  e.currentTarget.style.borderColor = 'var(--color-primary-border)'
                  e.currentTarget.style.background = 'var(--color-primary-muted)'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = 'var(--color-text-muted)'
                  e.currentTarget.style.borderColor = 'var(--color-border)'
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                {icon}
              </a>
            ))}
          </div>
        </div>

        {/* Useful links column */}
        <div>
          <h4 style={{
            fontSize: '0.68rem', fontWeight: 600,
            letterSpacing: '0.12em', textTransform: 'uppercase',
            fontFamily: 'var(--font-mono)',
            color: 'var(--color-text-muted)', marginBottom: 20,
          }}>
            {t('footer.usefulLinks')}
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {USEFUL_LINKS.map(({ labelKey, href, internal }) => (
              <li key={labelKey}>
                <a
                  href={href}
                  target={internal ? undefined : '_blank'}
                  rel={internal ? undefined : 'noopener noreferrer'}
                  style={{ fontSize: '0.9rem', color: 'var(--color-text)', transition: 'color 150ms ease', textDecoration: 'none' }}
                  onMouseEnter={e => e.target.style.color = 'var(--color-primary)'}
                  onMouseLeave={e => e.target.style.color = 'var(--color-text)'}
                >
                  {t(labelKey)}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Project column */}
        <div>
          <h4 style={{
            fontSize: '0.68rem', fontWeight: 600,
            letterSpacing: '0.12em', textTransform: 'uppercase',
            fontFamily: 'var(--font-mono)',
            color: 'var(--color-text-muted)', marginBottom: 20,
          }}>
            {t('footer.project')}
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { labelKey: 'footer.links.about',  href: '/about', internal: true },
              { labelKey: 'footer.links.github',  href: 'https://github.com/VUTP-University/utp-chatbot' },
            ].map(({ labelKey, href, internal }) => (
              <li key={labelKey}>
                <a
                  href={href}
                  target={internal ? undefined : '_blank'}
                  rel={internal ? undefined : 'noopener noreferrer'}
                  style={{ fontSize: '0.9rem', color: 'var(--color-text)', transition: 'color 150ms ease', textDecoration: 'none' }}
                  onMouseEnter={e => e.target.style.color = 'var(--color-primary)'}
                  onMouseLeave={e => e.target.style.color = 'var(--color-text)'}
                >
                  {t(labelKey)}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid var(--color-border)', padding: '16px 24px' }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 8,
        }}>
          <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
            {t('footer.copyright', { year: new Date().getFullYear() })}
          </p>
          <a
            href="/about"
            style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', textDecoration: 'none', transition: 'color 150ms ease' }}
            onMouseEnter={e => e.target.style.color = 'var(--color-primary)'}
            onMouseLeave={e => e.target.style.color = 'var(--color-text-muted)'}
          >
            {t('footer.links.about')}
          </a>
        </div>
      </div>
    </footer>
  )
}
