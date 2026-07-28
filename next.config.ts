import type { NextConfig } from 'next'
import { withPayload } from '@payloadcms/next/withPayload'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

const nextConfig: NextConfig = {
  poweredByHeader: false,

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // No framing by other sites — protects a logged-in admin from
          // clickjacking. Same-origin keeps any future live preview working.
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
        ],
      },
    ]
  },

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.public.blob.vercel-storage.com' },
      { protocol: 'https', hostname: '*.blob.vercel-storage.com' },
      // Thumbnails for embedded YouTube videos.
      { protocol: 'https', hostname: 'i.ytimg.com' },
    ],
    // Uploads are served by Payload at /api/media/file/... whenever Blob storage
    // is not configured. Without this the optimizer rejects them outright and
    // every photo on the site fails to load.
    localPatterns: [
      { pathname: '/api/media/**' },
      { pathname: '/**' },
    ],
    formats: ['image/avif', 'image/webp'],
  },

  // No redirect for the bare domain here on purpose: config redirects run
  // before the proxy, so a hard `/` → `/he` rule would override next-intl's
  // locale negotiation and force Hebrew on every visitor — including those who
  // chose English (NEXT_LOCALE cookie) or whose browser asks for it. The proxy
  // sends `/` to the right locale, falling back to Hebrew.
}

export default withPayload(withNextIntl(nextConfig), { devBundleServerPackages: false })
