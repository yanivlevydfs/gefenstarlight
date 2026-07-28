import type React from 'react'

/**
 * Fades content up as it scrolls into view.
 *
 * Deliberately CSS-only. The previous version rendered everything at zero
 * opacity and relied on a script to reveal it, so any section the reader had
 * not scrolled to was blank — and stayed blank if the script never ran. Here the
 * content is visible by default and the animation is an enhancement.
 */
export function Reveal({
  children,
  as: Component = 'div',
  className,
}: {
  children: React.ReactNode
  /** Kept for call sites that need the correct element inside a list. */
  as?: 'div' | 'li' | 'section'
  /** Accepted for API compatibility; ordering now comes from scroll position. */
  delay?: number
  className?: string
}) {
  return <Component className={['reveal', className].filter(Boolean).join(' ')}>{children}</Component>
}
