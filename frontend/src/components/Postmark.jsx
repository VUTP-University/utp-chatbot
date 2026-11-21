// Circular postmark used as the number badge on feature "stamps"
export default function Postmark({ number, text }) {
  const id = `postmark-ring-${number}`
  return (
    <svg className="postmark" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
      <defs>
        <path id={id} d="M50 50 m-36 0 a36 36 0 1 1 72 0 a36 36 0 1 1 -72 0" />
      </defs>
      <circle cx="50" cy="50" r="47" className="postmark-ring" />
      <circle cx="50" cy="50" r="27" className="postmark-ring" />
      <text className="postmark-text">
        <textPath href={`#${id}`} startOffset="0" textLength="222">{text}</textPath>
      </text>
      <text x="50" y="58" textAnchor="middle" className="postmark-number">{number}</text>
    </svg>
  )
}
