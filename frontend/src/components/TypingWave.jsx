// "Typing…" indicator drawn as a small equalizer / signal meter
export default function TypingWave() {
  return (
    <span className="eq" aria-hidden="true">
      {[0, 1, 2, 3, 4].map((i) => <span key={i} className="eq-bar" style={{ '--i': i }} />)}
    </span>
  )
}
