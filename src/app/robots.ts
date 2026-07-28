import type { MetadataRoute } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.gefenstarlight.com'

// Media files are served from /api/media/file when Blob storage is off, and
// those URLs are what OG tags and image search are given — so they must stay
// crawlable even though the rest of the API is not. The admin console and its
// API are not for crawlers.
const ALLOW = ['/', '/api/media/file/']
const DISALLOW = ['/admin', '/api']

/**
 * AI search crawlers, listed explicitly so the foundation stays visible in
 * ChatGPT, Claude, Perplexity and Google's AI features — a small charity
 * benefits from every answer engine that can cite it. They get the same rules
 * as everyone else; being explicit documents that this is a choice.
 */
const AI_CRAWLERS = [
  'GPTBot',
  'OAI-SearchBot',
  'ClaudeBot',
  'anthropic-ai',
  'PerplexityBot',
  'Google-Extended',
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: ALLOW, disallow: DISALLOW },
      ...AI_CRAWLERS.map((userAgent) => ({ userAgent, allow: ALLOW, disallow: DISALLOW })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
