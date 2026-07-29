'use client'

import { Cookie } from 'lucide-react'
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
export function CookiePreferences({ className }: { className?: string }) {
  const t = useTranslations('cookies')
  const choice = useSyncExternalStore(subscribeToConsent, readConsent, () => 'server')

  if (choice === null || choice === 'server' || choice === 'unavailable') return null

  return (
    <button type="button" onClick={clearConsent} className={className}>
      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-star-400/10 text-star-400 transition group-hover:bg-star-400/20">
        <Cookie className="size-4.5" aria-hidden />
      </span>
      <span className="text-start">
        <span className="block text-sm font-semibold">{t('preferences')}</span>
        <span className="block text-xs text-cream-50/55">{t('preferencesNote')}</span>
      </span>
    </button>
  )
}
