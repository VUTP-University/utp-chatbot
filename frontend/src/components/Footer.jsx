import { useTranslation } from 'react-i18next'
import { GlobeIcon, GithubIcon, FacebookIcon, LinkedinIcon, YoutubeIcon } from './Icons'
import BrandMark from './BrandMark'

const UNIVERSITY_LINKS = [
  { labelKey: 'footer.links.admissions', href: 'https://www.utp.bg/admission-of-students/' },
  { labelKey: 'footer.links.programs',   href: 'https://www.utp.bg/training/curricula/' },
  { labelKey: 'footer.links.calendar',   href: 'https://www.utp.bg/training/academic-calendar/' },
  { labelKey: 'footer.links.fees',       href: 'https://www.utp.bg/admission-of-students/taxes/' },
]

const PROJECT_LINKS = [
  { labelKey: 'footer.links.about',  href: '/about', internal: true },
  { labelKey: 'footer.links.github', href: 'https://github.com/VUTP-University/utp-chatbot' },
]

const SOCIAL_LINKS = [
  { label: 'utp.bg',   icon: <GlobeIcon />,    href: 'https://www.utp.bg/' },
  { label: 'Facebook', icon: <FacebookIcon />, href: 'https://www.facebook.com/www.utp.bg' },
  { label: 'LinkedIn', icon: <LinkedinIcon />, href: 'https://www.linkedin.com/school/university-of-telecommunications-and-post-sofia/posts/?feedView=all' },
  { label: 'YouTube',  icon: <YoutubeIcon />,  href: 'https://www.youtube.com/@%D0%92%D0%B8%D1%81%D1%88%D0%B5%D1%83%D1%87%D0%B8%D0%BB%D0%B8%D1%89%D0%B5%D0%BF%D0%BE%D1%82%D0%B5%D0%BB%D0%B5%D0%BA%D0%BE%D0%BC%D1%83%D0%BD%D0%B8%D0%BA%D0%B0-%D1%8F6%D1%89' },
  { label: 'GitHub',   icon: <GithubIcon />,   href: 'https://github.com/VUTP-University' },
]

function LinkColumn({ title, links }) {
  const { t } = useTranslation()
  return (
    <nav aria-label={title}>
      <h4 className="footer-heading">{title}</h4>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {links.map(({ labelKey, href, internal }) => (
          <li key={labelKey}>
            <a
              href={href}
              className="footer-link"
              target={internal ? undefined : '_blank'}
              rel={internal ? undefined : 'noopener noreferrer'}
            >
              {t(labelKey)}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default function Footer() {
  const { t } = useTranslation()

  return (
    <footer style={{ background: 'var(--color-surface)', position: 'relative' }}>
      <div aria-hidden style={{
        height: 1,
        background: 'linear-gradient(90deg, transparent 0%, var(--color-primary-border) 30%, var(--color-accent-border) 70%, transparent 100%)',
      }} />

      <div style={{
        maxWidth: 1200, margin: '0 auto',
        padding: '52px 24px 36px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 44,
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 7, textDecoration: 'none' }}>
            <span style={{ color: 'var(--color-accent)', display: 'flex', alignItems: 'center' }}>
              <BrandMark />
            </span>
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '0.95rem', letterSpacing: '-0.02em' }}>
              <span style={{ color: 'var(--color-primary)' }}>{t('nav.brand')}</span>
              {' '}
              <span style={{ fontWeight: 500, color: 'var(--color-text)' }}>{t('nav.brandSuffix')}</span>
            </span>
          </a>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text)', lineHeight: 1.7, maxWidth: 260 }}>
            {t('footer.tagline')}
          </p>
        </div>

        <LinkColumn title={t('footer.usefulLinks')} links={UNIVERSITY_LINKS} />
        <LinkColumn title={t('footer.project')} links={PROJECT_LINKS} />
      </div>

      <div style={{ borderTop: '1px solid var(--color-border)', padding: '16px 24px' }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 12,
        }}>
          <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
            {t('footer.copyright', { year: new Date().getFullYear() })}
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {SOCIAL_LINKS.map(({ label, icon, href }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="social-link">
                {icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
