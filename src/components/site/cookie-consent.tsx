'use client'

import { useSyncExternalStore } from 'react'
import Link from 'next/link'
import { Cookie } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { localeHref } from '@/lib/nav'
import type { Locale } from '@/i18n/routing'

export type Consent = 'accepted' | 'declined' | null

/**
 * The banner belongs to the live site only.
 *
 * Vercel sets NEXT_PUBLIC_VERCEL_ENV on every deployment, and leaves it unset
 * when the app runs anywhere else — so this is false on localhost and on
 * preview deployments, and the banner never interrupts development or review.
 * Analytics ride on the same switch: consent can only be given where the
 * banner appears, so nothing is measured off production either.
 */
export const IS_LIVE_SITE = process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'

/**
 * The answer lives in memory for the length of the page view and is never
 * written to storage — deliberately. Nothing is remembered between visits, so
 * a returning visitor is asked again rather than held to a choice they made
 * once and cannot see.
 *
 * The practical consequence: the banner returns on every full page load. It
 * survives navigation within the site, because the App Router keeps this
 * module alive across client-side route changes.
 */
let consent: Consent = null
const listeners = new Set<() => void>()

/** One store, two subscribers: the banner (to hide itself) and the analytics gate. */
export function subscribeToConsent(onChange: () => void) {
  listeners.add(onChange)
  return () => {
    listeners.delete(onChange)
  }
}

export function readConsent(): Consent {
  return consent
}

function setConsent(value: Consent) {
  consent = value
  for (const notify of listeners) notify()
}

/**
 * Forget the answer, which brings the banner back so the visitor can choose
 * again. Withdrawing consent has to be as easy as giving it, and the banner is
 * the only place the choice is offered.
 */
export function clearConsent() {
  setConsent(null)
}

/**
 * Consent banner for the analytics cookies.
 *
 * The answer is read through `useSyncExternalStore` so the server renders
 * nothing and the client decides after hydration — no mismatch, and no flash
 * of the banner on a page that has already been answered.
 */
export function CookieConsent({ locale }: { locale: Locale }) {
  const t = useTranslations('cookies')
  const choice = useSyncExternalStore(subscribeToConsent, readConsent, () => null)

  if (!IS_LIVE_SITE || choice !== null) return null

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
            href={localeHref('/privacy', locale)}
            className="text-star-300 underline underline-offset-4 hover:text-star-200"
          >
            {t('learnMore')}
          </Link>
        </p>

        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => setConsent('declined')}
            className="rounded-full border border-white/20 px-5 py-2.5 text-sm font-medium transition hover:border-white/40"
          >
            {t('decline')}
          </button>
          <button
            type="button"
            onClick={() => setConsent('accepted')}
            className="rounded-full bg-star-400 px-5 py-2.5 text-sm font-bold text-nightfall transition hover:bg-star-hover"
          >
            {t('accept')}
          </button>
        </div>
      </div>
    </div>
  )
}
