'use client'

import type React from 'react'
import { motion } from 'motion/react'

/** Fades content up the first time it scrolls into view. */
export function Reveal({
  children,
  delay = 0,
  as = 'div',
  className,
}: {
  children: React.ReactNode
  delay?: number
  as?: 'div' | 'li' | 'section'
  className?: string
}) {
  const Component = motion[as]

  return (
    <Component
      className={className}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Component>
  )
}
