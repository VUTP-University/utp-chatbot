import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Chat from './pages/Chat'
import About from './pages/About'

const PAGE_TITLE_KEYS = {
  '/':      'meta.home',
  '/chat':  'meta.chat',
  '/about': 'meta.about',
}

const darkQuery = () => window.matchMedia?.('(prefers-color-scheme: dark)')

function readThemePref() {
  try {
    const saved = localStorage.getItem('theme')
    return saved === 'dark' || saved === 'light' ? saved : null
  } catch {
    return null
  }
}

export default function App() {
  const { t, i18n } = useTranslation()
  // Explicit user choice ('dark' | 'light'), or null to follow the OS setting
  const [themePref, setThemePref] = useState(readThemePref)
  const [systemDark, setSystemDark] = useState(() => darkQuery()?.matches ?? false)
  const dark = themePref ? themePref === 'dark' : systemDark
  const path = window.location.pathname
  const isChat = path === '/chat'

  useEffect(() => {
    const mq = darkQuery()
    if (!mq) return
    const onChange = (e) => setSystemDark(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  useEffect(() => {
    document.title = t(PAGE_TITLE_KEYS[path] || 'meta.home')
  }, [path, t, i18n.language])

  const toggle = () => {
    const next = dark ? 'light' : 'dark'
    setThemePref(next)
    try {
      localStorage.setItem('theme', next)
    } catch {
      // storage unavailable — the choice lasts for this visit only
    }
  }

  const page = () => {
    if (isChat)            return <Chat dark={dark} onToggle={toggle} />
    if (path === '/about') return <About />
    return <Home />
  }

  return (
    <>
      {!isChat && <Navbar dark={dark} onToggle={toggle} />}
      <main>{page()}</main>
      {!isChat && <Footer />}
    </>
  )
}
