import type { NextConfig } from 'next'
import { withPayload } from '@payloadcms/next/withPayload'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.public.blob.vercel-storage.com' },
      { protocol: 'https', hostname: '*.blob.vercel-storage.com' },
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

  async redirects() {
    // The bare domain goes to Hebrew, the default locale. Every other legacy
    // URL is resolved from the CMS at request time — see
    // src/app/(frontend)/[locale]/[...rest]/page.tsx — so the site owner can
    // add pages and their old links without a code change.
    return [{ source: '/', destination: '/he', permanent: false }]
  },
}

export default withPayload(withNextIntl(nextConfig), { devBundleServerPackages: false })
