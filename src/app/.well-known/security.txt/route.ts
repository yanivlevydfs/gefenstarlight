import { getSiteSettings } from '@/lib/payload'
import { SITE_URL } from '@/lib/seo'

/**
 * RFC 9116 security.txt — where to report a vulnerability in this site.
 *
 * A route rather than a file in `public/`, because `Expires` is mandatory and
 * a served file goes stale silently: once the date passes, scanners treat the
 * whole record as invalid. Computing it a year ahead on each request means it
 * is always valid without anyone remembering to edit it.
 *
 * The contact address comes from the site settings the owner already
 * maintains, so it cannot drift from the one on the contact page.
 */
export const revalidate = 86_400

const FALLBACK_CONTACT = 'gefenstarlight@gmail.com'

export async function GET() {
  const settings = await getSiteSettings('he')
  const emails = (settings?.emails ?? []) as { email?: string }[]
  const contact = emails.find((entry) => entry.email)?.email ?? FALLBACK_CONTACT

  const expires = new Date()
  expires.setUTCFullYear(expires.getUTCFullYear() + 1)

  const body = [
    `Contact: mailto:${contact}`,
    `Expires: ${expires.toISOString().replace(/\.\d{3}Z$/, 'Z')}`,
    'Preferred-Languages: he, en',
    `Canonical: ${SITE_URL}/.well-known/security.txt`,
    '',
    '# This is a small charity site. Please report anything you find to the',
    '# address above and give us a reasonable window to fix it before',
    '# disclosing. Thank you for looking.',
    '',
  ].join('\n')

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  })
}
