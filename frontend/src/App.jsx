import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Chat from './pages/Chat'
import About from './pages/About'
import './App.css'

export default function App() {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('theme')
    if (saved) return saved === 'dark'
    return false // default: Light
  })
  const path = window.location.pathname

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])

  const isChat = path === '/chat'

  const page = () => {
    if (path === '/chat')  return <Chat />
    if (path === '/about') return <About />
    return <Home />
  }

  return (
    <>
      <Navbar dark={dark} onToggle={() => setDark(d => !d)} />
      <main>{page()}</main>
      {!isChat && <Footer />}
    </>
  )
}
