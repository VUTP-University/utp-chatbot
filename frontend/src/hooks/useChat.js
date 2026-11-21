import { useState, useCallback, useRef, useEffect } from 'react'

function generateSessionId() {
  return crypto.randomUUID()
}

function closeSession(id) {
  // sendBeacon is fire-and-forget and survives page unload unlike fetch
  navigator.sendBeacon(`/api/history/${id}`)
}

async function readJson(res) {
  try {
    return await res.json()
  } catch {
    return {}
  }
}

export function useChat() {
  const sessionId = useRef(generateSessionId())
  const lastMessageRef = useRef(null)
  const abortRef = useRef(null)
  const loadingRef = useRef(false)
  const [messages, setMessages] = useState([]) // { role: 'user'|'bot', text, timestamp }
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [budgetExceeded, setBudgetExceeded] = useState(false)

  // Close the session when the user leaves the page; abort any in-flight request on unmount
  useEffect(() => {
    const handleUnload = () => closeSession(sessionId.current)

    window.addEventListener('beforeunload', handleUnload)
    return () => {
      window.removeEventListener('beforeunload', handleUnload)
      abortRef.current?.abort()
    }
  }, [])

  // Sends the API request without adding a user message (used by both sendMessage and retryLast)
  const _sendRequest = useCallback(async (text) => {
    const controller = new AbortController()
    abortRef.current = controller
    const requestSessionId = sessionId.current
    // Ignore the response if the chat was cleared (or a newer request started) meanwhile
    const isStale = () => controller.signal.aborted || sessionId.current !== requestSessionId

    loadingRef.current = true
    setLoading(true)
    setError(null)

    const post = (id) => fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text, session_id: id }),
      signal: controller.signal,
    })

    try {
      let res = await post(requestSessionId)
      let data = await readJson(res)

      // Session was closed server-side (e.g. page restored from back/forward cache
      // after the unload beacon fired) — continue in a fresh session.
      if (res.status === 409 && data.error === 'session_closed' && !isStale()) {
        const freshId = generateSessionId()
        sessionId.current = freshId
        res = await post(freshId)
        data = await readJson(res)
        if (controller.signal.aborted || sessionId.current !== freshId) return
      } else if (isStale()) {
        return
      }

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
      if (controller.signal.aborted) return
      setError(err.message)
    } finally {
      if (abortRef.current === controller) {
        abortRef.current = null
        loadingRef.current = false
        setLoading(false)
      }
    }
  }, [])

  const sendMessage = useCallback(async (text) => {
    if (loadingRef.current) return
    lastMessageRef.current = text
    const userMsg = { role: 'user', text, timestamp: new Date().toISOString() }
    setMessages(prev => [...prev, userMsg])
    await _sendRequest(text)
  }, [_sendRequest])

  // Retries the last failed message — keeps the user message visible in the thread
  const retryLast = useCallback(() => {
    if (lastMessageRef.current && !loadingRef.current) {
      _sendRequest(lastMessageRef.current)
    }
  }, [_sendRequest])

  const clearChat = useCallback(() => {
    abortRef.current?.abort()
    abortRef.current = null
    loadingRef.current = false
    fetch(`/api/history/${sessionId.current}`, { method: 'DELETE' }).catch(() => {})
    sessionId.current = generateSessionId()
    lastMessageRef.current = null
    setMessages([])
    setLoading(false)
    setError(null)
    setBudgetExceeded(false)
  }, [])

  return { messages, loading, error, budgetExceeded, sendMessage, clearChat, retryLast }
}
