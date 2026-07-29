import Script from 'next/script'

/**
 * Sienna — the accessibility toolbar (contrast, text size, spacing, cursor,
 * reading guide, pause animations). MIT licensed, no account, no trackers.
 *
 * Pinned to an exact version: the CDN would otherwise serve whatever ships
 * next, and a widget that injects itself into every page is not something to
 * take unreviewed updates from.
 *
 * Deliberately outside the cookie gate. The gate exists for analytics, and an
 * accessibility tool is the last thing that should wait for a visitor to
 * accept cookies — the people who need it most would be the ones locked out.
 *
 * `afterInteractive` keeps it off the critical path; the toolbar button
 * appears a moment after the page is usable, which is fine for a control the
 * visitor has to reach for.
 */
const SIENNA_VERSION = '2.2.333'

export function AccessibilityWidget() {
  return (
    <Script
      id="sienna-accessibility"
      src={`https://cdn.jsdelivr.net/npm/sienna-accessibility@${SIENNA_VERSION}/dist/sienna-accessibility.umd.js`}
      strategy="afterInteractive"
    />
  )
}
