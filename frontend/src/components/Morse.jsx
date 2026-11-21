// Renders a word in Morse code as dots and dashes that "transmit" one by one.
// Only the letters used in the brand names are mapped (Bulgarian Morse for ВУТП, ITU for UTP).
const CODE = {
  В: '.--', У: '..-', Т: '-', П: '.--.',
  U: '..-', T: '-', P: '.--.',
}

export default function Morse({ word, className = '' }) {
  let index = 0
  const letters = [...word.toUpperCase()].filter((ch) => CODE[ch])

  return (
    <span className={`morse ${className}`} aria-hidden="true">
      {letters.map((ch, li) => (
        <span key={li} className="morse-letter">
          {[...CODE[ch]].map((sym, si) => (
            <span
              key={si}
              className={sym === '.' ? 'morse-dot' : 'morse-dash'}
              style={{ '--i': index++ }}
            />
          ))}
        </span>
      ))}
    </span>
  )
}
