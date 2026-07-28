/**
 * Displays a sensitive value (the street address, say) without leaving a
 * harvestable copy in the markup. Same trick as `ProtectedContact`: the value
 * is stored reversed and CSS flips it back for the eye — the DOM, the RSC
 * payload and any scraper only ever contain the reversed string. Works with
 * JavaScript disabled, since nothing here is interactive.
 *
 * The trick only holds for Latin and digits. Hebrew renders backwards under
 * the override — the flip puts its first letter on the left — so values with
 * RTL characters are shown as ordinary bidi text instead: a Hebrew street
 * address is not what harvesters scrape for anyway.
 */
const RTL = /[֐-߿]/

export function ProtectedText({ value, className }: { value: string; className?: string }) {
  if (RTL.test(value)) {
    return (
      <span dir="auto" className={className}>
        {value}
      </span>
    )
  }

  const reversed = [...value].reverse().join('')
  return (
    <span className={className} dir="ltr" style={{ unicodeBidi: 'bidi-override', direction: 'rtl' }}>
      {reversed}
    </span>
  )
}
