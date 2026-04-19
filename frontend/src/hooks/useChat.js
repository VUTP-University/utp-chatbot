import { useState, useCallback, useRef, useEffect } from 'react'

function generateSessionId() {
  return crypto.randomUUID()
}

function closeSession(id) {
  // sendBeacon is fire-and-forget and survives page unload unlike fetch
  navigator.sendBeacon(`/api/history/${id}`)
}

export function useChat() {
  const sessionId = useRef(generateSessionId())
  const [messages, setMessages] = useState([]) // { role: 'user'|'bot', text, timestamp }
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [budgetExceeded, setBudgetExceeded] = useState(false)

  // Close the session when the user leaves the page
  useEffect(() => {
    const handleUnload = () => closeSession(sessionId.current)

    window.addEventListener('beforeunload', handleUnload)
    return () => window.removeEventListener('beforeunload', handleUnload)
  }, [])

  const sendMessage = useCallback(async (text) => {
    const userMsg = { role: 'user', text, timestamp: new Date().toISOString() }
    setMessages(prev => [...prev, userMsg])
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, session_id: sessionId.current }),
      })

      const data = await res.json()

      if (res.status === 503 && data.reason === 'monthly_budget_exceeded') {
        setBudgetExceeded(true)
        return
      }

      if (!res.ok) {
        throw new Error(data.error || 'Request failed')
      }

      const botMsg = { role: 'bot', text: data.answer, timestamp: new Date().toISOString() }
      setMessages(prev => [...prev, botMsg])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const clearChat = useCallback(() => {
    fetch(`/api/history/${sessionId.current}`, { method: 'DELETE' }).catch(() => {})
    sessionId.current = generateSessionId()
    setMessages([])
    setError(null)
    setBudgetExceeded(false)
  }, [])

  return { messages, loading, error, budgetExceeded, sendMessage, clearChat }
}
