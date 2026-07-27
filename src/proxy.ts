import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

/**
 * Next.js 16 renamed Middleware to Proxy. This one only does locale routing —
 * everything under /admin and /api belongs to Payload and is left alone.
 */
export const proxy = createMiddleware(routing)

export const config = {
  matcher: [
    // Everything except Payload's admin + API, Next internals and real files.
    '/((?!admin|api|_next|_vercel|media|.*\\..*).*)',
  ],
}
