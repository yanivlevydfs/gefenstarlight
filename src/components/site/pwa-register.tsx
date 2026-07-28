'use client'

import { useEffect } from 'react'

/**
 * Registers the service worker that makes the site a complete, installable
 * PWA with an offline fallback. Production only — in development a worker
 * would fight the dev server's hot reloading.
 */
export function PwaRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return
    if (!('serviceWorker' in navigator)) return

    navigator.serviceWorker.register('/sw.js').catch((error) => {
      console.warn('[pwa] service worker registration failed:', error)
    })
  }, [])

  return null
}
