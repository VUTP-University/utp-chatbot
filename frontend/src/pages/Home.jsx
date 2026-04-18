import { useTranslation } from 'react-i18next'
import { ChatIcon, SparkleIcon, ArrowIcon, BookIcon, ClockIcon, ShieldIcon } from '../components/Icons'

const FEATURE_ICONS = [<BookIcon />, <ClockIcon />, <SparkleIcon />, <ShieldIcon />]
import ChatPreview from '../components/ChatPreview'

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <CTASection />
    </>
  )
}

function HeroSection() {
  const { t } = useTranslation()

  return (
    <section style={{ padding: '96px 24px 80px', position: 'relative', overflow: 'hidden' }}>
      {/* Background blobs */}
      <div aria-hidden style={{ position: 'absolute', top: -120, left: '50%', transform: 'translateX(-60%)', width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle, rgba(37,99,235,0.10) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div aria-hidden style={{ position: 'absolute', top: 80, right: '5%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(14,165,233,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 64, position: 'relative' }}>
        {/* Text */}
        <div style={{ flex: '1 1 0', minWidth: 0 }}>
          <div className="badge" style={{ marginBottom: 24, display: 'inline-flex' }}>
            <SparkleIcon /> {t('hero.badge')}
          </div>
          <h1 style={{ fontSize: 'clamp(2.4rem, 5vw, 3.6rem)', marginBottom: 24, lineHeight: 1.1 }} className="text-balance">
            {t('hero.headline')}{' '}
            <span className="text-gradient">{t('hero.headlineHighlight')}</span>
          </h1>
          <p style={{ fontSize: '1.1rem', lineHeight: 1.7, color: 'var(--color-text)', maxWidth: 500, marginBottom: 40 }} className="text-pretty">
            {t('hero.subtext')}
          </p>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <a href="/chat" className="btn btn-primary" style={{ fontSize: '1rem', padding: '13px 28px', gap: 10 }}>
              <ChatIcon /> {t('hero.ctaChat')}
            </a>
            <a href="#features" className="btn btn-ghost" style={{ fontSize: '1rem', padding: '13px 28px', gap: 10 }}>
              {t('hero.ctaLearn')} <ArrowIcon />
            </a>
          </div>
          <p style={{ marginTop: 20, fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
            {t('hero.disclaimer')}
          </p>
        </div>

        {/* Chat preview — desktop only */}
        <div style={{ flex: '0 0 420px', maxWidth: '100%' }} className="hide-mobile">
          <ChatPreview />
        </div>
      </div>
    </section>
  )
}

function FeaturesSection() {
  const { t } = useTranslation()
  const items = t('features.items', { returnObjects: true })

  return (
    <section id="features" style={{ padding: '80px 24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div className="badge" style={{ marginBottom: 16, display: 'inline-flex' }}>{t('features.badge')}</div>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', marginBottom: 16 }} className="text-balance">
            {t('features.title')}
          </h2>
          <p style={{ color: 'var(--color-text)', maxWidth: 480, margin: '0 auto', lineHeight: 1.7 }}>
            {t('features.subtitle')}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
          {items.map((f, i) => (
            <div key={i} className="card transition-theme" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ width: 46, height: 46, borderRadius: 12, background: 'var(--color-primary-muted)', border: '1px solid var(--color-primary-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
                {FEATURE_ICONS[i]}
              </div>
              <div>
                <h3 style={{ fontSize: '1.05rem', marginBottom: 8, color: 'var(--color-text-heading)' }}>{f.title}</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text)', lineHeight: 1.65 }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function HowItWorksSection() {
  const { t } = useTranslation()
  const steps = t('howItWorks.steps', { returnObjects: true })

  return (
    <section id="how-it-works" style={{ padding: '80px 24px', background: 'var(--color-surface)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div className="badge" style={{ marginBottom: 16, display: 'inline-flex' }}>{t('howItWorks.badge')}</div>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', marginBottom: 16 }} className="text-balance">
            {t('howItWorks.title')}
          </h2>
          <p style={{ color: 'var(--color-text)', maxWidth: 420, margin: '0 auto', lineHeight: 1.7 }}>
            {t('howItWorks.subtitle')}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 32 }}>
          {steps.map((step, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1, background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                {step.number}
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: 8, color: 'var(--color-text-heading)' }}>{step.title}</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text)', lineHeight: 1.65 }}>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CTASection() {
  const { t } = useTranslation()

  return (
    <section style={{ padding: '80px 24px' }}>
      <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ padding: '56px 48px', borderRadius: 'var(--radius-xl)', background: 'linear-gradient(135deg, var(--color-primary-muted) 0%, var(--color-accent-muted) 100%)', border: '1px solid var(--color-primary-border)', position: 'relative', overflow: 'hidden' }}>
          <div aria-hidden style={{ position: 'absolute', top: -60, right: -60, width: 220, height: 220, borderRadius: '50%', background: 'radial-gradient(circle, rgba(37,99,235,0.18) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div className="badge" style={{ marginBottom: 20, display: 'inline-flex' }}>
            <SparkleIcon /> {t('cta.badge')}
          </div>
          <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', marginBottom: 16 }} className="text-balance">
            {t('cta.title')}
          </h2>
          <p style={{ color: 'var(--color-text)', lineHeight: 1.7, maxWidth: 420, margin: '0 auto 32px' }}>
            {t('cta.subtitle')}
          </p>
          <a href="/chat" className="btn btn-primary" style={{ fontSize: '1rem', padding: '14px 32px', gap: 10 }}>
            <ChatIcon /> {t('cta.button')}
          </a>
        </div>
      </div>
    </section>
  )
}
