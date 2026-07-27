'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Languages } from 'lucide-react'

import { routing, type Locale } from '@/i18n/routing'

/** Swaps the locale segment while keeping the visitor on the same page. */
export function LocaleSwitcher({ locale }: { locale: Locale }) {
  const t = useTranslations('language')
  const pathname = usePathname()

  const other = routing.locales.find((l) => l !== locale) ?? routing.defaultLocale
  const segments = pathname.split('/').filter(Boolean)
  if (routing.locales.includes(segments[0] as Locale)) segments[0] = other
  else segments.unshift(other)
  const href = '/' + segments.join('/')

  return (
    <Link
      href={href}
      lang={other}
      hrefLang={other}
      aria-label={t('switcher')}
      className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3.5 py-2.5 text-sm font-medium transition hover:border-star-400/60 hover:text-star-300"
    >
      <Languages className="size-4" aria-hidden />
      {t(other)}
    </Link>
  )
}
