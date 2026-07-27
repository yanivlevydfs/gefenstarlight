import type { Metadata } from 'next'
import type React from 'react'
import { notFound } from 'next/navigation'
import { Frank_Ruhl_Libre, Heebo } from 'next/font/google'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'

import { SiteFooter } from '@/components/site/site-footer'
import { SiteHeader } from '@/components/site/site-header'
import { localeDir, localeTag, routing, type Locale } from '@/i18n/routing'
import { getNavigation, getSiteSettings } from '@/lib/payload'

import '../../globals.css'

const body = Heebo({
  subsets: ['hebrew', 'latin'],
  variable: '--font-body',
  display: 'swap',
})

const display = Frank_Ruhl_Libre({
  subsets: ['hebrew', 'latin'],
  variable: '--font-display',
  display: 'swap',
})

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) return {}

  const t = await getTranslations({ locale, namespace: 'meta' })
  const settings = await getSiteSettings(locale)

  const siteName = (settings?.organisationName as string) || t('siteName')
  const description = (settings?.description as string) || t('description')

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.gefenstarlight.com'),
    title: { default: siteName, template: `%s · ${siteName}` },
    description,
    alternates: {
      canonical: `/${locale}`,
      languages: { he: '/he', en: '/en', 'x-default': '/he' },
    },
    openGraph: {
      type: 'website',
      siteName,
      title: siteName,
      description,
      locale: localeTag[locale],
    },
  }
}

export default async function FrontendLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()

  // Opt this tree into static rendering where possible.
  setRequestLocale(locale)

  const typedLocale = locale as Locale
  const [navigation, settings] = await Promise.all([
    getNavigation(typedLocale),
    getSiteSettings(typedLocale),
  ])

  return (
    <html
      lang={localeTag[typedLocale]}
      dir={localeDir[typedLocale]}
      className={`${body.variable} ${display.variable}`}
      suppressHydrationWarning
    >
      <body className="flex min-h-dvh flex-col">
        <NextIntlClientProvider>
          <SiteHeader navigation={navigation} settings={settings} locale={typedLocale} />
          <main id="main" className="flex-1">
            {children}
          </main>
          <SiteFooter navigation={navigation} settings={settings} locale={typedLocale} />
        </NextIntlClientProvider>

        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
