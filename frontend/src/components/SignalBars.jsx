// Three-bar signal strength icon used as the bot status indicator
const LEVELS = { online: 3, connecting: 2, offline: 1 }

export default function SignalBars({ status }) {
  return (
    <span className={`signal-bars signal-bars--${status}`} aria-hidden="true">
      {[1, 2, 3].map((n) => (
        <span key={n} className={`signal-bar ${n <= LEVELS[status] ? 'is-on' : ''}`} style={{ '--n': n }} />
      ))}
    </span>
  )
}
