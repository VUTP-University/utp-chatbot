import { useRef, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ChatIcon, SparkleIcon, ArrowIcon, BookIcon, ClockIcon, ShieldIcon } from '../components/Icons'
import ChatPreview from '../components/ChatPreview'
import NetworkMap from '../components/NetworkMap'
import Radar from '../components/Radar'
import Morse from '../components/Morse'
import Postmark from '../components/Postmark'

const FEATURE_ICONS = [<BookIcon />, <ClockIcon />, <SparkleIcon />, <ShieldIcon />]

/* ── Scroll-reveal wrapper ── */
function Reveal({ children, delay = 0, className = '', style = {} }) {
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
      className={`reveal ${visible ? 'is-visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms`, ...style }}
    >
      {children}
    </div>
  )
}

// Moves the radial "spotlight" on a card to follow the pointer
function trackPointer(e) {
  const r = e.currentTarget.getBoundingClientRect()
  e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
  e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
}

export default function Home() {
  // Arriving from another page via /#features or /#how-it-works: the sections only exist
  // after React renders, so the browser's own anchor jump can miss them — scroll explicitly.
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1))
    if (id) document.getElementById(id)?.scrollIntoView()
  }, [])

  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <FieldsSection />
      <HowItWorksSection />
      <CTASection />
    </>
  )
}

function HeroSection() {
  const { t } = useTranslation()
  const readout = t('hero.disclaimer').split('·').map((s) => s.trim()).filter(Boolean)

  return (
    <section className="hero">
      <div className="hero-glow" aria-hidden />
      <NetworkMap className="hero-net" />

      <div className="hero-inner">
        <div className="hero-copy">
          <div className="hero-kicker anim-fade-up d-0">
            <span className="live-dot" aria-hidden />
            <span>{t('hero.badge')}</span>
            <Morse word={t('nav.brand')} />
          </div>

          <h1 className="hero-title anim-fade-up d-100 text-balance">
            {t('hero.headline')}{' '}
            <span className="hero-title-mark">{t('hero.headlineHighlight')}</span>
            <span className="caret" aria-hidden />
          </h1>

          <p className="hero-sub anim-fade-up d-200 text-pretty">
            {t('hero.subtext')}
          </p>

          <div className="hero-actions anim-fade-up d-300">
            <a href="/chat" className="btn btn-primary btn-lg btn-shine">
              <ChatIcon /> {t('hero.ctaChat')}
            </a>
            <a href="#how-it-works" className="btn btn-ghost btn-lg">
              {t('hero.ctaLearn')} <ArrowIcon />
            </a>
          </div>

          <ul className="readout anim-fade-up d-400" aria-label={t('hero.disclaimer')}>
            {readout.map((item, i) => (
              <li key={item}>
                <span className="readout-ch" aria-hidden>CH{i + 1}</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="hero-preview anim-float-in hide-mobile">
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
    <section id="features" className="section section-surface">
      <div className="container">
        <Reveal>
          <header className="section-head">
            <div className="section-label">{t('features.badge')}</div>
            <h2 className="section-title text-balance">{t('features.title')}</h2>
            <p className="section-lead">{t('features.subtitle')}</p>
          </header>
        </Reveal>

        <div className="stamp-grid">
          {items.map((f, i) => (
            <Reveal key={f.title} delay={i * 90} className={`stamp-wrap stamp-tilt-${i % 4}`}>
              <article className="stamp" onPointerMove={trackPointer}>
                <div className="stamp-inner">
                  <div className="stamp-top">
                    <div className="stamp-icon">{FEATURE_ICONS[i]}</div>
                    <Postmark number={String(i + 1).padStart(2, '0')} text={t('postmark')} />
                  </div>
                  <h3 className="stamp-title">{f.title}</h3>
                  <p className="stamp-desc">{f.desc}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function FieldsSection() {
  const { t } = useTranslation()
  const items = t('fields.items', { returnObjects: true })

  return (
    <section id="programs" className="section">
      <div className="container">
        <Reveal>
          <header className="section-head">
            <div className="section-label">{t('fields.badge')}</div>
            <h2 className="section-title text-balance">{t('fields.title')}</h2>
            <p className="section-lead">{t('fields.subtitle')}</p>
          </header>
        </Reveal>

        <div className="term-grid">
          {items.map((field, i) => {
            const total = field.degrees.reduce((sum, d) => sum + d.count, 0)
            return (
              <Reveal key={field.code} delay={i * 110}>
                <article className="term">
                  <div className="term-bar" aria-hidden>
                    <span /><span /><span />
                    <code>~/utp/pn-{field.code}</code>
                  </div>
                  <div className="term-body">
                    <div className="term-code">{field.code}</div>
                    <h3 className="term-name">{field.name}</h3>
                    <p className="term-total">
                      <span className="term-count">{total}</span> {t('fields.countLabel')}
                    </p>
                    <ul className="term-rows">
                      {field.degrees.map((d) => (
                        <li key={d.label}>
                          <span>{d.label}</span>
                          <span className="term-leader" aria-hidden />
                          <span className="term-num">{String(d.count).padStart(2, '0')}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              </Reveal>
            )
          })}
        </div>

        <Reveal>
          <a className="term-link" href="https://www.utp.bg/training/curricula/" target="_blank" rel="noopener noreferrer">
            {t('fields.cta')} <ArrowIcon />
          </a>
        </Reveal>
      </div>
    </section>
  )
}

function HowItWorksSection() {
  const { t } = useTranslation()
  const steps = t('howItWorks.steps', { returnObjects: true })

  return (
    <section id="how-it-works" className="section section-surface">
      <div className="container">
        <Reveal>
          <header className="section-head section-head--center">
            <div className="section-label">{t('howItWorks.badge')}</div>
            <h2 className="section-title text-balance">{t('howItWorks.title')}</h2>
            <p className="section-lead">{t('howItWorks.subtitle')}</p>
          </header>
        </Reveal>

        <div className="relay">
          <svg className="relay-line hide-mobile" viewBox="0 0 1000 20" preserveAspectRatio="none" aria-hidden="true" focusable="false">
            <line x1="0" y1="10" x2="1000" y2="10" className="relay-track" />
            <line x1="0" y1="10" x2="1000" y2="10" className="relay-pulse" />
          </svg>

          <ol className="relay-steps">
            {steps.map((step, i) => (
              <Reveal key={step.number} delay={i * 140}>
                <li className="relay-step">
                  <div className="relay-node">
                    <span>{step.number}</span>
                  </div>
                  <h3 className="relay-title">{step.title}</h3>
                  <p className="relay-desc">{step.desc}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

function CTASection() {
  const { t } = useTranslation()

  return (
    <section className="section">
      <Reveal>
        <div className="scope cta-box-pad">
          <Radar />
          <div className="scope-content">
            <div className="scope-badge">
              <span className="live-dot" aria-hidden /> {t('cta.badge')}
            </div>
            <h2 className="scope-title text-balance">{t('cta.title')}</h2>
            <p className="scope-sub">{t('cta.subtitle')}</p>
            <a href="/chat" className="btn btn-primary btn-lg btn-shine">
              <ChatIcon /> {t('cta.button')}
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
