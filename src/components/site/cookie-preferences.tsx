'use client'

import { useTranslations } from 'next-intl'
import { useSyncExternalStore } from 'react'

import { clearConsent, readConsent, subscribeToConsent } from '@/components/site/cookie-consent'

/**
 * Footer control that reopens the cookie banner.
 *
 * Consent has to be as easy to withdraw as it was to give, and the banner
 * disappears for good once answered — so without this the first click was
 * final. Hidden while the banner is already on screen (no answer stored yet)
 * and where storage is blocked, since there is then nothing to change.
 */
export function CookiePreferences() {
  const t = useTranslations('cookies')
  const choice = useSyncExternalStore(subscribeToConsent, readConsent, () => 'server')

  if (choice === null || choice === 'server' || choice === 'unavailable') return null

  return (
    <button
      type="button"
      onClick={clearConsent}
      className="underline underline-offset-4 transition hover:text-star-300"
    >
      {t('preferences')}
    </button>
  )
}
