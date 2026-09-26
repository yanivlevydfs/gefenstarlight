import type { MetadataRoute } from 'next'

/**
 * The site is closed to crawlers: search engines and AI bots alike. `*` covers
 * every crawler that honours robots.txt; the named agents are listed as well
 * because some (AdsBot-Google, several AI crawlers) ignore the `*` group and
 * only obey rules addressed to them by name. The noindex meta tag and
 * X-Robots-Tag header (layout.tsx, next.config.ts) back this up for anything
 * that fetches a page anyway.
 */
const GOOGLE_CRAWLERS = [
  'Googlebot',
  'Googlebot-Image',
  'Googlebot-News',
  'Googlebot-Video',
  'Google-InspectionTool',
  'GoogleOther',
  'GoogleOther-Image',
  'GoogleOther-Video',
  'Google-Extended',
  'Google-CloudVertexBot',
  'Storebot-Google',
  'AdsBot-Google',
  'AdsBot-Google-Mobile',
  'Mediapartners-Google',
  'APIs-Google',
  'FeedFetcher-Google',
  'Google-Read-Aloud',
]

const AI_CRAWLERS = [
  'GPTBot',
  'ChatGPT-User',
  'OAI-SearchBot',
  'ClaudeBot',
  'Claude-User',
  'Claude-SearchBot',
  'claude-web',
  'anthropic-ai',
  'PerplexityBot',
  'Perplexity-User',
  'CCBot',
  'Bytespider',
  'Amazonbot',
  'Applebot',
  'Applebot-Extended',
  'meta-externalagent',
  'meta-externalfetcher',
  'FacebookBot',
  'cohere-ai',
  'cohere-training-data-crawler',
  'MistralAI-User',
  'DuckAssistBot',
  'YouBot',
  'Diffbot',
  'AI2Bot',
  'Ai2Bot-Dolma',
  'PetalBot',
  'PanguBot',
  'Timpibot',
  'ImagesiftBot',
  'omgili',
  'omgilibot',
  'Webzio-Extended',
  'img2dataset',
  'FirecrawlAgent',
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', disallow: '/' },
      { userAgent: [...GOOGLE_CRAWLERS, ...AI_CRAWLERS], disallow: '/' },
    ],
  }
}
