import type { Locale } from '@/i18n/routing'

export type NavImage = {
  url: string
  alt: string
  width?: number
  height?: number
}

export type NavItem = {
  label: string
  href: string
  description?: string
  image?: NavImage
  highlight?: boolean
}

type Messages = Record<string, string>

/**
 * The menu the site ships with. The `navigation` global in the admin console
 * overrides this entirely once the owner saves it, so nothing here is fixed.
 */
export function defaultNav(t: Messages): NavItem[] {
  return [
    { label: t.home, href: '/' },
    { label: t.gefen, href: '/gefen' },
    { label: t.about, href: '/about' },
    { label: t.projects, href: '/projects' },
    { label: t.gallery, href: '/gallery' },
    { label: t.videos, href: '/videos' },
    { label: t.news, href: '/news' },
    { label: t.thanks, href: '/thanks' },
    { label: t.contact, href: '/contact' },
    { label: t.donate, href: '/donate', highlight: true },
  ]
}

type PayloadMediaLike = {
  url?: string | null
  alt?: string | null
  width?: number | null
  height?: number | null
  sizes?: Record<string, { url?: string | null; width?: number | null; height?: number | null }>
}

function toNavImage(media: unknown, fallbackAlt: string): NavImage | undefined {
  if (!media || typeof media !== 'object') return undefined
  const m = media as PayloadMediaLike
  const card = m.sizes?.card
  const url = card?.url ?? m.url
  if (!url) return undefined
  return {
    url,
    alt: m.alt ?? fallbackAlt,
    width: card?.width ?? m.width ?? undefined,
    height: card?.height ?? m.height ?? undefined,
  }
}

/** Normalise the Payload `navigation` global into plain, serialisable items. */
export function navFromGlobal(global: unknown, fallback: NavItem[]): NavItem[] {
  const items = (global as { items?: unknown[] } | null)?.items
  if (!Array.isArray(items) || items.length === 0) return fallback

  const resolved: NavItem[] = []

  for (const raw of items) {
    const item = raw as {
      label?: string
      href?: string
      description?: string
      image?: unknown
      highlight?: boolean
    }
    if (!item.label || !item.href) continue

    resolved.push({
      label: item.label,
      href: item.href.startsWith('/') ? item.href : `/${item.href}`,
      description: item.description || undefined,
      image: toNavImage(item.image, item.label),
      highlight: Boolean(item.highlight),
    })
  }

  return resolved.length > 0 ? resolved : fallback
}

/** Prefix a CMS-relative href with the active locale. */
export function localeHref(href: string, locale: Locale): string {
  if (/^(https?:)?\/\//.test(href) || href.startsWith('mailto:') || href.startsWith('tel:')) {
    return href
  }
  return href === '/' ? `/${locale}` : `/${locale}${href}`
}
