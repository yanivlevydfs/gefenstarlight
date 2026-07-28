import type { MetadataRoute } from 'next'

/** PWA manifest — lets the site be installed to a phone home screen. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'אור הכוכבים של גפן',
    short_name: 'אור הכוכבים',
    description:
      'עמותת אור הכוכבים של גפן מממנת פעילות אומנויות לחימה לנוער בסיכון, לזכרו של גפן אבירם ז״ל.',
    // The bare path, so launching the installed app honours the visitor's
    // saved language instead of always opening Hebrew.
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#04060d',
    theme_color: '#04060d',
    lang: 'he',
    dir: 'rtl',
    categories: ['education', 'lifestyle'],
    icons: [
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  }
}
