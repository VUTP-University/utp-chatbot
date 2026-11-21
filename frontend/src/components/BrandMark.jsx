// Four-pointed "sparkle" mark used in the logo, favicon and bot avatar
export default function BrandMark({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true">
      <path d="M12 2l1.6 6.4L20 10l-6.4 1.6L12 18l-1.6-6.4L4 10l6.4-1.6L12 2z" />
      <path d="M19.5 1l.6 2.4 2.4.6-2.4.6-.6 2.4-.6-2.4-2.4-.6 2.4-.6L19.5 1z" opacity="0.65" />
    </svg>
  )
}
