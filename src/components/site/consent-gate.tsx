'use client'

import { useSyncExternalStore } from 'react'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'

import { readConsent, subscribeToConsent } from '@/components/site/cookie-consent'

/**
 * Analytics load only after the visitor accepts the cookie banner — before
 * that the banner's promise was decorative, since the scripts were mounted
 * unconditionally in the layout. Declining, or storage being unavailable,
 * keeps them off entirely.
 */
export function ConsentGate() {
  const choice = useSyncExternalStore(subscribeToConsent, readConsent, () => null)

  if (choice !== 'accepted') return null

  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  )
}
