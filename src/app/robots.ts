import type { MetadataRoute } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.gefenstarlight.com'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // The admin console and its API are not for crawlers.
      disallow: ['/admin', '/api'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
