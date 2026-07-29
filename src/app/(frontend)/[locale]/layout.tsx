import type { Metadata } from 'next'
import type React from 'react'
import { notFound } from 'next/navigation'
import { Frank_Ruhl_Libre, Heebo } from 'next/font/google'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import { AccessibilityWidget } from '@/components/site/accessibility-widget'
import { ConsentGate } from '@/components/site/consent-gate'
import { CookieConsent } from '@/components/site/cookie-consent'
import { PwaRegister } from '@/components/site/pwa-register'
import { JsonLd } from '@/components/site/json-ld'
import { SiteFooter } from '@/components/site/site-footer'
import { SiteHeader } from '@/components/site/site-header'
import { VineBackdrop } from '@/components/site/vine-backdrop'
import { localeDir, localeTag, routing, type Locale } from '@/i18n/routing'
import { mediaUrl } from '@/lib/media'
import { getNavigation, getSiteSettings } from '@/lib/payload'
import { alternates, organisationSchema, SITE_URL, websiteSchema } from '@/lib/seo'
import { THEME_COLORS } from '@/lib/theme'

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

/**
 * Pages are prerendered for speed, then refreshed in the background every
 * minute. Without this every page is frozen at build time, so anything the
 * owner changes in the admin console stays invisible until the next deploy.
 */
export const revalidate = 60

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
  const share = mediaUrl(settings?.shareImage, 'wide')

  return {
    metadataBase: new URL(SITE_URL),
    title: { default: siteName, template: `%s · ${siteName}` },
    description,
    applicationName: siteName,
    manifest: '/manifest.webmanifest',
    appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: siteName },
    alternates: alternates(locale),
    keywords:
      locale === 'he'
        ? ['עמותה', 'נוער בסיכון', 'ג׳ודו', 'קרב מגע', 'אומנויות לחימה', 'תרומה', 'גפן אבירם']
        : ['charity', 'youth at risk', 'judo', 'krav maga', 'martial arts', 'donate', 'Israel'],
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
    },
    openGraph: {
      type: 'website',
      siteName,
      title: siteName,
      description,
      locale: localeTag[locale],
      images: share ? [{ url: share.url, width: share.width, height: share.height }] : undefined,
    },
    twitter: {
      card: share ? 'summary_large_image' : 'summary',
      title: siteName,
      description,
      images: share ? [share.url] : undefined,
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

  const t = await getTranslations({ locale, namespace: 'meta' })
  const siteName = settings?.organisationName || t('siteName')
  const logo = mediaUrl(settings?.shareImage, 'wide')

  const schema = [
    organisationSchema({
      locale: typedLocale,
      name: siteName,
      description: settings?.description ?? undefined,
      logo: logo?.url,
    }),
    websiteSchema(typedLocale, siteName),
  ]

  return (
    <html
      lang={localeTag[typedLocale]}
      dir={localeDir[typedLocale]}
      className={`${body.variable} ${display.variable}`}
      suppressHydrationWarning
    >
      <body className="flex min-h-dvh flex-col">
        {/*
          Applies the visitor's saved theme (falling back to the system
          preference) before anything paints, so a light-mode visitor never
          sees a dark flash. Runs inline for that reason; `<html>` already has
          suppressHydrationWarning for the attribute this sets.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              `(function(){try{` +
              `var t=localStorage.getItem('theme');` +
              `if(t!=='light'&&t!=='dark')t=matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';` +
              `document.documentElement.dataset.theme=t;` +
              `var m=document.createElement('meta');m.name='theme-color';` +
              `m.content=t==='light'?'${THEME_COLORS.light}':'${THEME_COLORS.dark}';` +
              `document.head.appendChild(m)` +
              `}catch(e){}})()`,
          }}
        />
        <JsonLd data={schema} />
        <VineBackdrop />
        <NextIntlClientProvider>
          <SiteHeader
            navigation={navigation}
            organisationName={siteName}
            locale={typedLocale}
            backdrop={logo?.url}
          />
          <main id="main" className="flex-1">
            {children}
          </main>
          <SiteFooter navigation={navigation} settings={settings} locale={typedLocale} />
          <CookieConsent locale={typedLocale} />
        </NextIntlClientProvider>

        <AccessibilityWidget />

        {/* Analytics mount only after the cookie banner is accepted. */}
        <ConsentGate />
        <PwaRegister />
      </body>
    </html>
  )
}
