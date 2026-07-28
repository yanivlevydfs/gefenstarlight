import type { Metadata } from 'next'

import { localeTag, routing, type Locale } from '@/i18n/routing'

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.gefenstarlight.com'
).replace(/\/$/, '')

/**
 * Canonical URL plus the hreflang set for a page.
 *
 * Search engines need to be told that /he/... and /en/... are the same page in
 * two languages, otherwise they compete with each other.
 */
export function alternates(locale: Locale, path = ''): Metadata['alternates'] {
  const clean = path && !path.startsWith('/') ? `/${path}` : path

  return {
    canonical: `${SITE_URL}/${locale}${clean}`,
    languages: {
      ...Object.fromEntries(
        routing.locales.map((l) => [localeTag[l], `${SITE_URL}/${l}${clean}`]),
      ),
      'x-default': `${SITE_URL}/${routing.defaultLocale}${clean}`,
    },
  }
}

type OgArgs = {
  locale: Locale
  path?: string
  title: string
  description?: string
  image?: { url: string; width?: number; height?: number } | null
  type?: 'website' | 'article'
  publishedTime?: string
}

/** Metadata shared by every page: canonical, hreflang, Open Graph, Twitter. */
export function pageMetadata({
  locale,
  path = '',
  title,
  description,
  image,
  type = 'website',
  publishedTime,
}: OgArgs): Metadata {
  const url = `${SITE_URL}/${locale}${path && !path.startsWith('/') ? `/${path}` : path}`
  const images = image
    ? [{ url: image.url, width: image.width ?? 1200, height: image.height ?? 630, alt: title }]
    : undefined

  return {
    title,
    description,
    alternates: alternates(locale, path),
    openGraph: {
      type,
      url,
      title,
      description,
      images,
      locale: localeTag[locale],
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title,
      description,
      images: images?.map((i) => i.url),
    },
  }
}

type JsonLd = Record<string, unknown>

/**
 * The organisation itself. Emitted once, on every page, so search engines can
 * build a knowledge panel with the right name, logo and contact details.
 */
export function organisationSchema({
  locale,
  name,
  description,
  logo,
}: {
  locale: Locale
  name: string
  description?: string
  logo?: string
}): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'NGO',
    '@id': `${SITE_URL}/#organisation`,
    name,
    alternateName: 'Gefen Starlight',
    url: `${SITE_URL}/${locale}`,
    description,
    ...(logo ? { logo, image: logo } : {}),
    foundingDate: '2022',
    nonprofitStatus: 'NonprofitANBI',
    // No address or telephone here on purpose. Structured data is plain text in
    // the page, so listing them would hand every harvester exactly what the
    // contact links were rewritten to hide — the street address included.
    // Visitors reach the foundation through the contact page, which search
    // engines index anyway.
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'general',
      url: `${SITE_URL}/${locale}/contact`,
      availableLanguage: ['he', 'en'],
    },
    knowsLanguage: ['he', 'en'],
    areaServed: { '@type': 'Country', name: 'Israel' },
  }
}

/** The site as a whole, so sitelinks and language variants are understood. */
export function websiteSchema(locale: Locale, name: string): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: `${SITE_URL}/${locale}`,
    name,
    inLanguage: localeTag[locale],
    publisher: { '@id': `${SITE_URL}/#organisation` },
  }
}

/** Trail of parent pages, shown under the result in search listings. */
export function breadcrumbSchema(
  locale: Locale,
  trail: { name: string; path: string }[],
): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: `${SITE_URL}/${locale}${crumb.path}`,
    })),
  }
}

/** A project write-up, so it can surface as an article with a date and image. */
export function articleSchema({
  locale,
  path,
  headline,
  description,
  image,
  datePublished,
  organisationName,
}: {
  locale: Locale
  path: string
  headline: string
  description?: string
  image?: string
  datePublished?: string
  organisationName: string
}): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    description,
    image: image ? [image] : undefined,
    datePublished,
    dateModified: datePublished,
    inLanguage: localeTag[locale],
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/${locale}${path}` },
    author: { '@type': 'Organization', name: organisationName },
    publisher: { '@id': `${SITE_URL}/#organisation` },
  }
}

/** A photo album, so the images are eligible for image search. */
export function imageGallerySchema({
  locale,
  path,
  name,
  description,
  images,
}: {
  locale: Locale
  path: string
  name: string
  description?: string
  images: string[]
}): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'ImageGallery',
    name,
    description,
    url: `${SITE_URL}/${locale}${path}`,
    inLanguage: localeTag[locale],
    associatedMedia: images.slice(0, 60).map((url) => ({
      '@type': 'ImageObject',
      contentUrl: url,
    })),
  }
}

/** Marks the donation page as a way to support the organisation. */
export function donateSchema(locale: Locale, name: string): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'DonateAction',
    name,
    recipient: { '@id': `${SITE_URL}/#organisation` },
    target: `${SITE_URL}/${locale}/donate`,
  }
}
