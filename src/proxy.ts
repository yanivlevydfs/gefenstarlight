import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

/**
 * Next.js 16 renamed Middleware to Proxy. This one only does locale routing —
 * everything under /admin and /api belongs to Payload and is left alone.
 */
export const proxy = createMiddleware(routing)

export const config = {
  matcher: [
    // Everything except Payload's admin + API, the health check, Next internals
    // and real files. Anything matched here gets a locale prefix, which would
    // turn /health into /he/health and lose the route.
    '/((?!admin|api|health|_next|_vercel|media|.*\\..*).*)',
  ],
}
