import { useTranslation } from 'react-i18next'
import { ChatIcon, GlobeIcon, GithubIcon, FacebookIcon, LinkedinIcon, YoutubeIcon } from './Icons'

const USEFUL_LINKS = [
  { labelKey: 'footer.links.admissions',  href: 'https://www.utp.bg/admission-of-students/' },
  { labelKey: 'footer.links.programs',    href: 'https://www.utp.bg/training/curricula/' },
  { labelKey: 'footer.links.schedule',    href: 'https://www.utp.bg/training/academic-calendar/' },
  { labelKey: 'footer.links.about',       href: '/about', internal: true },
]

const SOCIAL_LINKS = [
  { label: 'Website',  icon: <GlobeIcon />,    href: 'https://www.utp.bg/' },
  { label: 'Facebook', icon: <FacebookIcon />,  href: 'https://www.facebook.com/www.utp.bg' },
  { label: 'LinkedIn', icon: <LinkedinIcon />,  href: 'https://www.linkedin.com/school/university-of-telecommunications-and-post-sofia/posts/?feedView=all' },
  { label: 'YouTube',  icon: <YoutubeIcon />,   href: 'https://www.youtube.com/@%D0%92%D0%B8%D1%81%D1%88%D0%B5%D1%83%D1%87%D0%B8%D0%BB%D0%B8%D1%89%D0%B5%D0%BF%D0%BE%D1%82%D0%B5%D0%BB%D0%B5%D0%BA%D0%BE%D0%BC%D1%83%D0%BD%D0%B8%D0%BA%D0%B0-%D1%8F6%D1%89' },
  { label: 'GitHub',   icon: <GithubIcon />,   href: 'https://github.com/VUTP-University' },
]

export default function Footer() {
  const { t } = useTranslation()

  return (
    <footer style={{ borderTop: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
      {/* Main footer grid */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px 32px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 40 }}>

        {/* Brand column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{ width: 32, height: 32, borderRadius: 9, background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
              <ChatIcon />
            </div>
            <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--color-text-heading)', letterSpacing: '-0.02em' }}>
              {t('nav.brand')} <span style={{ color: 'var(--color-primary)' }}>ChatBot</span>
            </span>
          </a>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text)', lineHeight: 1.65, maxWidth: 240 }}>
            {t('footer.tagline')}
          </p>
          {/* Social icons */}
          <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
            {SOCIAL_LINKS.map(({ label, icon, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                style={{
                  width: 34, height: 34, borderRadius: 8,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--color-text-muted)',
                  border: '1px solid var(--color-border)',
                  transition: 'color 150ms ease, border-color 150ms ease, background 150ms ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = 'var(--color-primary)'
                  e.currentTarget.style.borderColor = 'var(--color-primary-border)'
                  e.currentTarget.style.background = 'var(--color-primary-muted)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = 'var(--color-text-muted)'
                  e.currentTarget.style.borderColor = 'var(--color-border)'
                  e.currentTarget.style.background = 'transparent'
                }}
              >
                {icon}
              </a>
            ))}
          </div>
        </div>

        {/* Useful links column */}
        <div>
          <h4 style={{ fontSize: '0.82rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 16 }}>
            {t('footer.usefulLinks')}
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
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
          <h4 style={{ fontSize: '0.82rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 16 }}>
            {t('footer.project')}
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { labelKey: 'footer.links.about',  href: '/about', internal: true },
              { labelKey: 'footer.links.github', href: 'https://github.com/VUTP-University/utp-chatbot' },
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
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
            {t('footer.copyright', { year: new Date().getFullYear() })}
          </p>
          <a href="/about" style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textDecoration: 'none', transition: 'color 150ms ease' }}
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
