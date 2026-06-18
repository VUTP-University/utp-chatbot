import { useRef, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ChatIcon, SparkleIcon, ArrowIcon, BookIcon, ClockIcon, ShieldIcon } from '../components/Icons'
import ChatPreview from '../components/ChatPreview'

const FEATURE_ICONS = [<BookIcon />, <ClockIcon />, <SparkleIcon />, <ShieldIcon />]
const FEATURE_NUMS  = ['01', '02', '03', '04']

/* ── Scroll-reveal wrapper ── */
function Reveal({ children, delay = 0, style = {} }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.12 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : 'translateY(22px)',
        transition: `opacity 0.65s ease ${delay}ms, transform 0.65s cubic-bezier(0.22,0.61,0.36,1) ${delay}ms`,
        ...style,
      }}
    >
      {children}
    </div>
  )
}

/* ── Floating particle field for CTA background ── */
const CTA_PARTICLES = Array.from({ length: 28 }, (_, i) => ({
  x:        ((i * 41 + 7)  % 94) + 3,
  y:        ((i * 67 + 13) % 86) + 7,
  size:      1.4 + (i % 3) * 0.7,
  delay:    ((i * 0.38) % 5).toFixed(2),
  duration: (3.2 + (i % 6) * 0.5).toFixed(1),
  cyan:      i % 3 === 0,
  dx:       ((i % 5) - 2) * 3,
  dy:       -8 - (i % 5) * 2,
}))

function CTAParticles() {
  return (
    <>
      {CTA_PARTICLES.map((p, i) => (
        <div
          key={i}
          aria-hidden
          style={{
            position: 'absolute',
            left: `${p.x}%`, top: `${p.y}%`,
            width: p.size, height: p.size,
            borderRadius: '50%',
            background: p.cyan ? 'rgba(34,211,238,0.9)' : 'rgba(96,165,250,0.7)',
            boxShadow: p.cyan
              ? `0 0 ${p.size * 4}px rgba(34,211,238,0.45)`
              : `0 0 ${p.size * 4}px rgba(96,165,250,0.35)`,
            animation: `particle-drift ${p.duration}s ease-in-out ${p.delay}s infinite alternate`,
            '--dx': `${p.dx}px`,
            '--dy': `${p.dy}px`,
            pointerEvents: 'none',
          }}
        />
      ))}
    </>
  )
}

/* ── Scrolling ticker strip ── */
function TickerStrip() {
  const { t } = useTranslation()
  const items = t('features.items', { returnObjects: true }).map(f => f.title)
  const extras = [t('hero.disclaimer').split('·')[0].trim()]
  const all = [...items, ...extras]
  const doubled = [...all, ...all] // seamless loop

  return (
    <div style={{
      overflow: 'hidden',
      borderTop: '1px solid var(--color-border)',
      borderBottom: '1px solid var(--color-border)',
      background: 'var(--color-surface)',
      padding: '11px 0',
      position: 'relative',
    }}>
      {/* Fade masks */}
      <div aria-hidden style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 100, background: 'linear-gradient(90deg, var(--color-surface), transparent)', zIndex: 1, pointerEvents: 'none' }} />
      <div aria-hidden style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 100, background: 'linear-gradient(-90deg, var(--color-surface), transparent)', zIndex: 1, pointerEvents: 'none' }} />

      <div style={{ display: 'flex', animation: 'marquee 28s linear infinite', whiteSpace: 'nowrap', willChange: 'transform' }}>
        {doubled.map((item, i) => (
          <span key={i} style={{
            padding: '0 28px',
            fontSize: '0.72rem',
            fontWeight: 600,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            fontFamily: 'var(--font-mono)',
            color: 'var(--color-text-muted)',
            display: 'inline-flex', alignItems: 'center', gap: 10,
          }}>
            <span style={{ color: 'var(--color-accent)', fontSize: '0.55rem' }}>✦</span>
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <>
      <HeroSection />
      <TickerStrip />
      <FeaturesSection />
      <HowItWorksSection />
      <CTASection />
    </>
  )
}

function HeroSection() {
  const { t } = useTranslation()

  return (
    <section
      className="hero-section-pad dot-grid"
      style={{ position: 'relative', overflow: 'hidden' }}
    >
      {/* Animated ambient orbs */}
      <div aria-hidden style={{
        position: 'absolute', top: -160, left: '40%',
        width: 720, height: 720, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(37,99,235,0.13) 0%, transparent 65%)',
        pointerEvents: 'none', transform: 'translateX(-50%)',
        animation: 'blob1 9s ease-in-out infinite',
      }} />
      <div aria-hidden style={{
        position: 'absolute', bottom: -100, right: '-8%',
        width: 460, height: 460, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(6,182,212,0.11) 0%, transparent 65%)',
        pointerEvents: 'none',
        animation: 'blob2 7s ease-in-out 1.5s infinite',
      }} />
      <div aria-hidden style={{
        position: 'absolute', top: '30%', left: '-6%',
        width: 280, height: 280, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(37,99,235,0.07) 0%, transparent 65%)',
        pointerEvents: 'none',
        animation: 'blob2 11s ease-in-out 3s infinite',
      }} />

      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 72, position: 'relative' }}>
        {/* Text */}
        <div style={{ flex: '1 1 0', minWidth: 0 }}>
          <div className="section-label anim-fade-up d-0">AI University Assistant</div>

          <h1 className="anim-fade-up d-100 text-balance"
            style={{ fontSize: 'clamp(2.6rem, 5vw, 3.8rem)', marginBottom: 24, lineHeight: 1.05 }}
          >
            {t('hero.headline')}{' '}
            <span className="text-gradient">{t('hero.headlineHighlight')}</span>
          </h1>

          <p className="anim-fade-up d-200 text-pretty"
            style={{ fontSize: '1.05rem', lineHeight: 1.75, color: 'var(--color-text)', maxWidth: 480, marginBottom: 40 }}
          >
            {t('hero.subtext')}
          </p>

          <div className="anim-fade-up d-300" style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <a href="/chat" className="btn btn-primary" style={{ fontSize: '1rem', padding: '14px 28px', gap: 10 }}>
              <ChatIcon /> {t('hero.ctaChat')}
            </a>
            <a href="#features" className="btn btn-ghost" style={{ fontSize: '1rem', padding: '14px 28px', gap: 10 }}>
              {t('hero.ctaLearn')} <ArrowIcon />
            </a>
          </div>

          <p className="anim-fade-up d-400"
            style={{ marginTop: 24, fontSize: '0.78rem', color: 'var(--color-text-muted)', letterSpacing: '0.02em' }}
          >
            {t('hero.disclaimer')}
          </p>
        </div>

        {/* Chat preview — desktop, floats + glow */}
        <div
          className="anim-float-in hide-mobile"
          style={{
            flex: '0 0 420px', maxWidth: '100%',
            filter: 'drop-shadow(0 20px 40px rgba(37,99,235,0.14))',
          }}
        >
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
    <section id="features" style={{ padding: '88px 24px', background: 'var(--color-surface)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <Reveal>
          <div style={{ marginBottom: 56 }}>
            <div className="section-label">{t('features.badge')}</div>
            <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', marginBottom: 16, maxWidth: 560 }} className="text-balance">
              {t('features.title')}
            </h2>
            <p style={{ color: 'var(--color-text)', maxWidth: 440, lineHeight: 1.75 }}>
              {t('features.subtitle')}
            </p>
          </div>
        </Reveal>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
          {items.map((f, i) => (
            <Reveal key={i} delay={i * 80}>
              <div className="feature-card" style={{ height: '100%' }}>
                <span className="feature-num" aria-hidden>{FEATURE_NUMS[i]}</span>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: 'var(--color-primary-muted)',
                  border: '1px solid var(--color-primary-border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--color-primary)',
                }}>
                  {FEATURE_ICONS[i]}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.05rem', marginBottom: 8, color: 'var(--color-text-heading)', letterSpacing: '-0.02em' }}>
                    {f.title}
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--color-text)', lineHeight: 1.7 }}>
                    {f.desc}
                  </p>
                </div>
              </div>
            </Reveal>
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
    <section id="how-it-works" style={{ padding: '88px 24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <div className="section-label" style={{ justifyContent: 'center' }}>{t('howItWorks.badge')}</div>
            <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', marginBottom: 16 }} className="text-balance">
              {t('howItWorks.title')}
            </h2>
            <p style={{ color: 'var(--color-text)', maxWidth: 380, margin: '0 auto', lineHeight: 1.75 }}>
              {t('howItWorks.subtitle')}
            </p>
          </div>
        </Reveal>

        <div style={{ position: 'relative' }}>
          {/* Connector line — desktop */}
          {/* <div className="hide-mobile" aria-hidden style={{
            position: 'absolute', top: 24,
            left: 'calc(16.67% + 24px)', right: 'calc(16.67% + 24px)',
            height: 1,
            background: 'linear-gradient(90deg, var(--color-primary-border), var(--color-accent-border), var(--color-primary-border))',
            zIndex: 0,
          }} /> */}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 40, position: 'relative', zIndex: 1 }}>
            {steps.map((step, i) => (
              <Reveal key={i} delay={i * 120}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                  <div className="step-num">{step.number}</div>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: 10, color: 'var(--color-text-heading)', letterSpacing: '-0.02em' }}>
                      {step.title}
                    </h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--color-text)', lineHeight: 1.7 }}>
                      {step.desc}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function CTASection() {
  const { t } = useTranslation()

  return (
    <section style={{ padding: '88px 24px', background: 'var(--color-surface)' }}>
      <Reveal>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div
            className="cta-box-pad"
            style={{
              borderRadius: 'var(--radius-2xl)',
              background: '#060c1a',
              border: '1px solid rgba(59,130,246,0.16)',
              position: 'relative', overflow: 'hidden', textAlign: 'center',
              boxShadow: '0 32px 80px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.04)',
            }}
          >
            {/* Aurora orb — top-left, blue */}
            <div aria-hidden style={{
              position: 'absolute', width: 420, height: 420, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(37,99,235,0.38) 0%, transparent 70%)',
              top: '-35%', left: '-12%',
              filter: 'blur(52px)',
              animation: 'aurora1 9s ease-in-out infinite',
              pointerEvents: 'none',
            }} />

            {/* Aurora orb — bottom-right, cyan */}
            <div aria-hidden style={{
              position: 'absolute', width: 340, height: 340, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(6,182,212,0.28) 0%, transparent 70%)',
              bottom: '-25%', right: '-8%',
              filter: 'blur(48px)',
              animation: 'aurora2 7s ease-in-out 2s infinite',
              pointerEvents: 'none',
            }} />

            {/* Aurora orb — centre-right, mid blue accent */}
            <div aria-hidden style={{
              position: 'absolute', width: 220, height: 220, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(99,179,237,0.18) 0%, transparent 70%)',
              top: '40%', right: '18%',
              filter: 'blur(36px)',
              animation: 'aurora1 13s ease-in-out 4.5s infinite',
              pointerEvents: 'none',
            }} />

            {/* Very subtle dot grid */}
            <div aria-hidden style={{
              position: 'absolute', inset: 0, borderRadius: 'inherit',
              backgroundImage: 'radial-gradient(circle, rgba(59,130,246,0.08) 1px, transparent 1px)',
              backgroundSize: '28px 28px', pointerEvents: 'none',
            }} />

            {/* Floating particles */}
            <CTAParticles />

            {/* Content */}
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div className="badge" style={{
                marginBottom: 24, display: 'inline-flex',
                background: 'rgba(37,99,235,0.15)',
                borderColor: 'rgba(37,99,235,0.35)',
                color: '#93c5fd',
              }}>
                <SparkleIcon /> {t('cta.badge')}
              </div>
              <h2
                style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', marginBottom: 18, color: '#e4eeff', letterSpacing: '-0.03em' }}
                className="text-balance"
              >
                {t('cta.title')}
              </h2>
              <p style={{ color: '#7a9abe', lineHeight: 1.8, maxWidth: 420, margin: '0 auto 40px', fontSize: '1rem' }}>
                {t('cta.subtitle')}
              </p>
              <a href="/chat" className="btn btn-primary" style={{ fontSize: '1rem', padding: '15px 36px', gap: 10, boxShadow: '0 4px 24px rgba(37,99,235,0.45)' }}>
                <ChatIcon /> {t('cta.button')}
              </a>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
