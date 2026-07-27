import type { MetadataRoute } from 'next'

import { routing } from '@/i18n/routing'
import { listAlbums, listArticles, listPagesForSitemap, listProjects } from '@/lib/payload'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.gefenstarlight.com'

/** Routes that exist in code rather than in the CMS. */
const staticPaths = [
  '',
  '/gefen',
  '/about',
  '/projects',
  '/gallery',
  '/videos',
  '/news',
  '/thanks',
  '/donate',
  '/contact',
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, albums, articles, pages] = await Promise.all([
    listProjects({ locale: 'he', depth: 0 }),
    listAlbums({ locale: 'he', depth: 0 }),
    listArticles({ locale: 'he', depth: 0 }),
    listPagesForSitemap('he'),
  ])

  const paths = [
    ...staticPaths,
    ...projects.map((p) => `/projects/${p.slug}`),
    ...albums.map((a) => `/gallery/${a.slug}`),
    ...articles.map((a) => `/news/${a.slug}`),
    ...pages.map((p) => `/${p.slug}`),
  ]

  return paths.map((path) => ({
    url: `${SITE_URL}/${routing.defaultLocale}${path}`,
    lastModified: new Date(),
    changeFrequency: path === '' ? 'weekly' : 'monthly',
    priority: path === '' ? 1 : path === '/donate' ? 0.9 : 0.7,
    alternates: {
      languages: Object.fromEntries(
        routing.locales.map((locale) => [locale, `${SITE_URL}/${locale}${path}`]),
      ),
    },
  }))
}
