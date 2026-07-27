/** The four-point starlight mark used as the site's logo glyph. */
export function StarMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden focusable="false">
      <path
        d="M24 2c1.4 9.6 5.3 15.2 12.2 17.4C41.1 21 44.5 22.2 46 24c-9.6 1.4-15.2 5.3-17.4 12.2C27 41.1 25.8 44.5 24 46c-1.4-9.6-5.3-15.2-12.2-17.4C6.9 27 3.5 25.8 2 24c9.6-1.4 15.2-5.3 17.4-12.2C21 6.9 22.2 3.5 24 2Z"
        fill="currentColor"
      />
    </svg>
  )
}
