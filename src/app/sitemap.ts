import type { MetadataRoute } from 'next'

import { localeTag, routing } from '@/i18n/routing'
import { listAlbums, listArticles, listPagesForSitemap, listProjects } from '@/lib/payload'
import { SITE_URL } from '@/lib/seo'

// Regenerate hourly, so content published in the admin console shows up
// without waiting for the next deploy.
export const revalidate = 3600

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

  // CMS entries carry their real edit date; a constant `new Date()` would tell
  // crawlers every URL changed every hour, and they learn to ignore it.
  const entries: { path: string; lastModified?: string }[] = [
    ...staticPaths.map((path) => ({ path })),
    ...projects.map((p) => ({ path: `/projects/${p.slug}`, lastModified: p.updatedAt })),
    ...albums.map((a) => ({ path: `/gallery/${a.slug}`, lastModified: a.updatedAt })),
    ...articles.map((a) => ({ path: `/news/${a.slug}`, lastModified: a.updatedAt })),
    // CMS pages that already have a static entry (e.g. /gefen) are dropped so
    // no URL is listed twice.
    ...pages
      .filter((p) => !staticPaths.includes(`/${p.slug}`))
      .map((p) => ({ path: `/${p.slug}`, lastModified: p.updatedAt })),
  ]

  return entries.map(({ path, lastModified }) => ({
    url: `${SITE_URL}/${routing.defaultLocale}${path}`,
    ...(lastModified ? { lastModified: new Date(lastModified) } : {}),
    changeFrequency: path === '' ? 'weekly' : 'monthly',
    priority: path === '' ? 1 : path === '/donate' ? 0.9 : 0.7,
    alternates: {
      // The same hreflang tags the pages themselves emit — differing signals
      // for one URL pair make search engines distrust both.
      languages: {
        ...Object.fromEntries(
          routing.locales.map((locale) => [localeTag[locale], `${SITE_URL}/${locale}${path}`]),
        ),
        'x-default': `${SITE_URL}/${routing.defaultLocale}${path}`,
      },
    },
  }))
}
