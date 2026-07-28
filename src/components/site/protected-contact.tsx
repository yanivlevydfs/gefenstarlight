'use client'

import { useState } from 'react'

type Scheme = 'mailto' | 'tel' | 'whatsapp'

/**
 * Shows a contact detail without leaving a harvestable one in the markup.
 *
 * Two things had to be true for this to work:
 *
 *  - the value is passed in **already reversed**. A client component's props
 *    are serialised into the page for hydration, so handing this component a
 *    plain address would put that address straight back into the HTML — which
 *    is exactly what a scraper reads.
 *  - the link target is assembled only on interaction, so no `mailto:`, `tel:`
 *    or `wa.me` appears in the document either.
 *
 * The reversed text is flipped back by CSS rather than by a script, so it stays
 * readable, selectable and clickable with JavaScript disabled.
 */
export function ProtectedContact({
  reversed,
  scheme,
  className,
  children,
  label,
}: {
  /** The value written backwards, e.g. `li.ten.210@1marivaa`. */
  reversed: string
  scheme: Scheme
  className?: string
  /** Icon or other fixed content shown alongside the value. */
  children?: React.ReactNode
  /** Replaces the value as the visible text, e.g. "Message us on WhatsApp". */
  label?: string
}) {
  const [href, setHref] = useState<string | undefined>()

  const target = () => {
    const value = [...reversed].reverse().join('')
    const digits = value.replace(/[^+\d]/g, '')
    if (scheme === 'mailto') return `mailto:${value}`
    if (scheme === 'tel') return `tel:${digits}`
    return `https://wa.me/${digits.replace(/^\+/, '')}`
  }

  const reveal = () => setHref(target())

  return (
    <a
      href={href}
      className={className}
      rel={scheme === 'whatsapp' ? 'noreferrer noopener' : undefined}
      target={scheme === 'whatsapp' ? '_blank' : undefined}
      onMouseEnter={reveal}
      onFocus={reveal}
      onTouchStart={reveal}
      onClick={(event) => {
        if (href) return
        event.preventDefault()
        const url = target()
        if (scheme === 'whatsapp') window.open(url, '_blank', 'noreferrer,noopener')
        else window.location.href = url
      }}
    >
      {children}
      {label ? (
        <span>{label}</span>
      ) : (
        <span dir="ltr" style={{ unicodeBidi: 'bidi-override', direction: 'rtl' }}>
          {reversed}
        </span>
      )}
    </a>
  )
}
