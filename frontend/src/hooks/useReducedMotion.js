import { useEffect, useState } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

// True when the OS asks for reduced motion; updates if the setting changes
export function useReducedMotion() {
  const [reduced, setReduced] = useState(() => window.matchMedia?.(QUERY).matches ?? false)

  useEffect(() => {
    const mq = window.matchMedia?.(QUERY)
    if (!mq) return
    const onChange = (e) => setReduced(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return reduced
}
