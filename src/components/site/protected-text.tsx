/**
 * Displays a sensitive value (the street address, say) without leaving a
 * harvestable copy in the markup. Same trick as `ProtectedContact`: the value
 * arrives already reversed and CSS flips it back for the eye — the DOM, the
 * RSC payload and any scraper only ever contain the reversed string. Works
 * with JavaScript disabled, since nothing here is interactive.
 */
export function ProtectedText({ reversed, className }: { reversed: string; className?: string }) {
  return (
    <span className={className} dir="ltr" style={{ unicodeBidi: 'bidi-override', direction: 'rtl' }}>
      {reversed}
    </span>
  )
}
