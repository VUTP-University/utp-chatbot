import { useTranslation } from 'react-i18next'
import { ChatIcon, SparkleIcon, ShieldIcon, BookIcon, GithubIcon } from '../components/Icons'

const TECH_STACK = [
  { name: 'React + Vite', desc: 'Frontend framework & build tool' },
  { name: 'Tailwind CSS v4', desc: 'Utility-first styling' },
  { name: 'Flask', desc: 'Python backend API' },
  { name: 'DigitalOcean AI Agent', desc: 'LLM inference & knowledge base' },
  { name: 'i18next', desc: 'Internationalisation (EN / BG)' },
]

export default function About() {
  const { t } = useTranslation()

  return (
    <div style={{ background: 'var(--color-background)', minHeight: 'calc(100svh - 64px)' }}>
      {/* Hero */}
      <section
        className="dot-grid"
        style={{ padding: '80px 24px 64px', position: 'relative', overflow: 'hidden' }}
      >
        <div aria-hidden style={{
          position: 'absolute', top: -120, left: '50%', transform: 'translateX(-50%)',
          width: 600, height: 600, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(37,99,235,0.10) 0%, transparent 65%)',
          pointerEvents: 'none',
        }} />
        <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <div className="section-label" style={{ justifyContent: 'center', marginBottom: 20 }}>
            {t('about.badge')}
          </div>
          <h1
            style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', marginBottom: 20, lineHeight: 1.08 }}
            className="text-balance"
          >
            {t('about.title')}
          </h1>
          <p
            style={{ fontSize: '1.05rem', color: 'var(--color-text)', lineHeight: 1.8, maxWidth: 580, margin: '0 auto' }}
            className="text-pretty"
          >
            {t('about.subtitle')}
          </p>
        </div>
      </section>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px 88px', display: 'flex', flexDirection: 'column', gap: 60 }}>

        {/* What is it */}
        <section>
          <SectionHeader icon={<ChatIcon />} title={t('about.whatTitle')} />
          <p style={{ color: 'var(--color-text)', lineHeight: 1.85, fontSize: '0.97rem' }}>
            {t('about.whatBody')}
          </p>
        </section>

        {/* Goals */}
        <section>
          <SectionHeader icon={<BookIcon />} title={t('about.goalsTitle')} />
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {(t('about.goals', { returnObjects: true })).map((goal, i) => (
              <li key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <span style={{
                  marginTop: 5, width: 22, height: 22, borderRadius: 7,
                  background: 'var(--color-primary-muted)',
                  border: '1px solid var(--color-primary-border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-accent)', display: 'block' }} />
                </span>
                <span style={{ color: 'var(--color-text)', lineHeight: 1.75, fontSize: '0.97rem' }}>{goal}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Tech stack */}
        <section>
          <SectionHeader icon={<ShieldIcon />} title={t('about.techTitle')} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
            {TECH_STACK.map(({ name, desc }) => (
              <div
                key={name}
                style={{
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '18px 20px',
                  display: 'flex', flexDirection: 'column', gap: 6,
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'border-color 200ms ease, box-shadow 200ms ease',
                }}
              >
                <span style={{
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 700, fontSize: '0.95rem',
                  color: 'var(--color-text-heading)', letterSpacing: '-0.02em',
                }}>
                  {name}
                </span>
                <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
                  {desc}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Open source CTA */}
        <section>
          <div
            className="about-oss-box-pad"
            style={{
              borderRadius: 'var(--radius-2xl)',
              background: 'linear-gradient(135deg, #080f22 0%, #0a1a3a 100%)',
              border: '1px solid rgba(59,130,246,0.20)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              flexWrap: 'wrap', gap: 24,
              boxShadow: '0 16px 48px rgba(0,0,0,0.20)',
              position: 'relative', overflow: 'hidden',
            }}
          >
            <div aria-hidden style={{
              position: 'absolute', top: -30, right: -30,
              width: 140, height: 140, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(6,182,212,0.15) 0%, transparent 70%)',
              pointerEvents: 'none',
            }} />
            <div style={{ position: 'relative' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: 10, color: '#e4eeff', letterSpacing: '-0.03em' }}>
                {t('about.openSourceTitle')}
              </h3>
              <p style={{ color: '#7a9abe', fontSize: '0.9rem', lineHeight: 1.7, maxWidth: 440 }}>
                {t('about.openSourceBody')}
              </p>
            </div>
            <a
              href="https://github.com/VUTP-University/utp-chatbot"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              style={{ gap: 8, whiteSpace: 'nowrap', position: 'relative' }}
            >
              <GithubIcon /> {t('about.openSourceCta')}
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}

function SectionHeader({ icon, title }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
      <div style={{
        width: 38, height: 38, borderRadius: 11,
        background: 'var(--color-primary-muted)',
        border: '1px solid var(--color-primary-border)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'var(--color-primary)', flexShrink: 0,
      }}>
        {icon}
      </div>
      <h2 style={{ fontSize: '1.3rem', letterSpacing: '-0.03em' }}>{title}</h2>
    </div>
  )
}
