'use client'

import { useState } from 'react'

type Scheme = 'mailto' | 'tel' | 'whatsapp'

/**
 * Shows a contact detail without leaving a harvestable one in the markup.
 *
 * Scrapers read the served HTML for `user@domain`, for `mailto:` and `tel:`
 * links, and for phone numbers. None of those appear here:
 *
 *  - the characters are written in reverse and flipped back by CSS, so the
 *    readable value never exists as a contiguous string in the document;
 *  - the link target is assembled only when somebody hovers, focuses or clicks.
 *
 * It stays readable, selectable and usable with JavaScript disabled, because
 * the reversal is done in CSS and a click falls back to navigating directly.
 */
export function ProtectedContact({
  value,
  scheme,
  className,
  children,
  label,
}: {
  /** The real value: an address, or a phone number in any readable form. */
  value: string
  scheme: Scheme
  className?: string
  /** Icon and any other fixed content shown alongside the value. */
  children?: React.ReactNode
  /** Replaces the value as the visible text, e.g. "Message us on WhatsApp". */
  label?: string
}) {
  const [href, setHref] = useState<string | undefined>()

  const target = () => {
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
          {[...value].reverse().join('')}
        </span>
      )}
    </a>
  )
}
