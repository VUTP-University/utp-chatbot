import { useState, useEffect } from 'react'

// returns: 'connecting' | 'online' | 'offline'
export function useBotStatus(intervalMs = 30_000) {
  const [status, setStatus] = useState('connecting')

  useEffect(() => {
    let cancelled = false

    const check = async () => {
      try {
        const res = await fetch('/api/health', { cache: 'no-store' })
        const data = await res.json()
        if (!cancelled) {
          setStatus(res.ok && data?.status === 'ok' ? 'online' : 'offline')
        }
      } catch {
        if (!cancelled) setStatus('offline')
      }
    }

    check()
    const id = setInterval(check, intervalMs)

    return () => {
      cancelled = true
      clearInterval(id)
    }
  }, [intervalMs])

  return status
}
