'use client'

import { useState, useSyncExternalStore } from 'react'
import Link from 'next/link'
import { Cookie } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { localeHref } from '@/lib/nav'
import type { Locale } from '@/i18n/routing'

const STORAGE_KEY = 'gefen-cookie-consent'

/** Fired on the window when this tab answers the banner. */
const CONSENT_EVENT = 'gefen-consent-change'

/**
 * One store, two subscribers: the banner (to hide itself) and the analytics
 * gate (to start or stay off). The storage event covers other tabs; the custom
 * event covers the tab the visitor clicked in, where storage events never fire.
 */
export function subscribeToConsent(onChange: () => void) {
  window.addEventListener('storage', onChange)
  window.addEventListener(CONSENT_EVENT, onChange)
  return () => {
    window.removeEventListener('storage', onChange)
    window.removeEventListener(CONSENT_EVENT, onChange)
  }
}

export function readConsent(): string | null {
  try {
    return window.localStorage.getItem(STORAGE_KEY)
  } catch {
    // Storage blocked (private browsing) — treat as answered rather than nag.
    return 'unavailable'
  }
}

/**
 * Consent banner for the analytics cookies.
 *
 * The stored choice is read through `useSyncExternalStore` so the server
 * renders nothing and the client decides after hydration — no mismatch, and no
 * flash of the banner for someone who already answered.
 */
export function CookieConsent({ locale }: { locale: Locale }) {
  const t = useTranslations('cookies')
  const [dismissed, setDismissed] = useState(false)
  const choice = useSyncExternalStore(subscribeToConsent, readConsent, () => 'server')

  const answer = (value: 'accepted' | 'declined') => {
    try {
      window.localStorage.setItem(STORAGE_KEY, value)
    } catch {
      // The choice simply is not remembered.
    }
    window.dispatchEvent(new Event(CONSENT_EVENT))
    setDismissed(true)
  }

  if (choice !== null || dismissed) return null

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label={t('title')}
      className="fixed inset-x-0 bottom-0 z-100 animate-fade-up p-3 sm:p-5"
    >
      <div className="glass mx-auto flex max-w-3xl flex-col gap-4 rounded-card border border-white/15 p-5 shadow-lift sm:flex-row sm:items-center">
        <Cookie className="size-6 shrink-0 text-star-400" aria-hidden />

        <p className="flex-1 text-sm leading-relaxed text-cream-50/80">
          {t('message')}{' '}
          <Link
            href={localeHref('/terms', locale)}
            className="text-star-300 underline underline-offset-4 hover:text-star-200"
          >
            {t('learnMore')}
          </Link>
        </p>

        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => answer('declined')}
            className="rounded-full border border-white/20 px-5 py-2.5 text-sm font-medium transition hover:border-white/40"
          >
            {t('decline')}
          </button>
          <button
            type="button"
            onClick={() => answer('accepted')}
            className="rounded-full bg-star-400 px-5 py-2.5 text-sm font-bold text-nightfall transition hover:bg-star-hover"
          >
            {t('accept')}
          </button>
        </div>
      </div>
    </div>
  )
}
