import type { MetadataRoute } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.gefenstarlight.com'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      // Media files are served from /api/media/file when Blob storage is off,
      // and those URLs are what OG tags and image search are given — so they
      // must stay crawlable even though the rest of the API is not.
      allow: ['/', '/api/media/file/'],
      // The admin console and its API are not for crawlers.
      disallow: ['/admin', '/api'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
