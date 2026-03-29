import { useState, useCallback, useRef } from 'react'

function generateSessionId() {
  return crypto.randomUUID()
}

export function useChat() {
  const sessionId = useRef(generateSessionId())
  const [messages, setMessages] = useState([]) // { role: 'user'|'bot', text, timestamp }
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

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
  }, [])

  return { messages, loading, error, sendMessage, clearChat }
}
