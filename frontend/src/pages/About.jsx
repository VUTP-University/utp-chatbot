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
      <section style={{ padding: '72px 24px 56px', position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden style={{ position: 'absolute', top: -100, left: '50%', transform: 'translateX(-50%)', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(37,99,235,0.09) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <div className="badge" style={{ marginBottom: 20, display: 'inline-flex' }}>
            <SparkleIcon /> {t('about.badge')}
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: 20, lineHeight: 1.15 }} className="text-balance">
            {t('about.title')}
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--color-text)', lineHeight: 1.75, maxWidth: 600, margin: '0 auto' }} className="text-pretty">
            {t('about.subtitle')}
          </p>
        </div>
      </section>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px 80px', display: 'flex', flexDirection: 'column', gap: 56 }}>

        {/* What is it */}
        <section>
          <SectionHeader icon={<ChatIcon />} title={t('about.whatTitle')} />
          <p style={{ color: 'var(--color-text)', lineHeight: 1.8, fontSize: '0.97rem' }}>
            {t('about.whatBody')}
          </p>
        </section>

        {/* Goals */}
        <section>
          <SectionHeader icon={<BookIcon />} title={t('about.goalsTitle')} />
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {(t('about.goals', { returnObjects: true })).map((goal, i) => (
              <li key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <span style={{ marginTop: 4, width: 20, height: 20, borderRadius: 6, background: 'var(--color-primary-muted)', border: '1px solid var(--color-primary-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-primary)', display: 'block' }} />
                </span>
                <span style={{ color: 'var(--color-text)', lineHeight: 1.7, fontSize: '0.97rem' }}>{goal}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Tech stack */}
        <section>
          <SectionHeader icon={<ShieldIcon />} title={t('about.techTitle')} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
            {TECH_STACK.map(({ name, desc }) => (
              <div key={name} className="card" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--color-text-heading)' }}>{name}</span>
                <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>{desc}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Open source CTA */}
        <section>
          <div style={{ padding: '36px 40px', borderRadius: 'var(--radius-xl)', background: 'linear-gradient(135deg, var(--color-primary-muted) 0%, var(--color-accent-muted) 100%)', border: '1px solid var(--color-primary-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24 }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: 8 }}>{t('about.openSourceTitle')}</h3>
              <p style={{ color: 'var(--color-text)', fontSize: '0.9rem', lineHeight: 1.65, maxWidth: 480 }}>
                {t('about.openSourceBody')}
              </p>
            </div>
            <a
              href="https://github.com/utp-university-org/utp-chatbot"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              style={{ gap: 8, whiteSpace: 'nowrap' }}
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
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
      <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--color-primary-muted)', border: '1px solid var(--color-primary-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)', flexShrink: 0 }}>
        {icon}
      </div>
      <h2 style={{ fontSize: '1.25rem' }}>{title}</h2>
    </div>
  )
}
