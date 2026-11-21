// Decorative radar screen: range rings, crosshair, rotating sweep and a few contacts
const BLIPS = [
  { x: '64%', y: '30%', d: '0.9s' },
  { x: '28%', y: '62%', d: '3.1s' },
  { x: '73%', y: '70%', d: '3.9s' },
  { x: '40%', y: '24%', d: '4.6s' },
]

export default function Radar({ className = '' }) {
  return (
    <div className={`radar ${className}`} aria-hidden="true">
      <div className="radar-sweep" />
      {BLIPS.map((b, i) => (
        <span key={i} className="radar-blip" style={{ left: b.x, top: b.y, animationDelay: b.d }} />
      ))}
    </div>
  )
}
