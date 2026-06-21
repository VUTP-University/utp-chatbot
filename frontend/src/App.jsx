import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Chat from './pages/Chat'
import About from './pages/About'
import './App.css'

const PAGE_TITLES = {
  '/':      'UTP ChatBot — AI University Assistant',
  '/chat':  'Chat — UTP Assistant',
  '/about': 'About — UTP ChatBot',
}

export default function App() {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('theme')
    if (saved) return saved === 'dark'
    return false
  })
  const path = window.location.pathname
  const isChat = path === '/chat'

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])

  useEffect(() => {
    document.title = PAGE_TITLES[path] || 'UTP ChatBot'
  }, [path])

  const toggle = () => setDark(d => !d)

  const page = () => {
    if (isChat)          return <Chat dark={dark} onToggle={toggle} />
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
