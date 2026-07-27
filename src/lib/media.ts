type PayloadSize = { url?: string | null; width?: number | null; height?: number | null }

type PayloadMedia = {
  url?: string | null
  alt?: string | null
  caption?: string | null
  width?: number | null
  height?: number | null
  mimeType?: string | null
  poster?: unknown
  sizes?: Record<string, PayloadSize | undefined>
  /** Absolute CDN address recorded at import time. */
  publicUrl?: string | null
  publicSizes?: Record<string, string | null | undefined> | null
}

export type ResolvedMedia = {
  url: string
  alt: string
  caption?: string
  width?: number
  height?: number
  isVideo: boolean
}

export type SizeName = 'thumbnail' | 'card' | 'wide' | 'full'

/**
 * Turn a Payload upload relationship into something `next/image` can use.
 * Returns `null` when the field is empty or was not populated (depth too low).
 */
export function mediaUrl(value: unknown, size: SizeName = 'card'): ResolvedMedia | null {
  if (!value || typeof value !== 'object') return null
  const media = value as PayloadMedia

  const source = media.publicUrl || media.url
  if (!source) return null

  const isVideo = Boolean(media.mimeType?.startsWith('video/'))
  // Videos have no generated sizes — always use the original file.
  const chosen = isVideo ? undefined : media.sizes?.[size]

  // Always prefer the absolute CDN address captured at import time. When the
  // storage plugin is inactive Payload still returns a relative `/api/media`
  // path here, which looks valid but resolves to nothing once deployed — so it
  // must lose to the recorded URL, not merely act as a fallback.
  const sized = isVideo ? undefined : media.publicSizes?.[size]
  const url = sized || media.publicUrl || chosen?.url || source

  return {
    url,
    alt: media.alt ?? '',
    caption: media.caption ?? undefined,
    width: chosen?.width ?? media.width ?? undefined,
    height: chosen?.height ?? media.height ?? undefined,
    isVideo,
  }
}

/** Resolve a list of upload relationships, dropping any that failed to load. */
export function mediaList(value: unknown, size: SizeName = 'card'): ResolvedMedia[] {
  if (!Array.isArray(value)) return []
  const resolved: ResolvedMedia[] = []
  for (const item of value) {
    const media = mediaUrl(item, size)
    if (media) resolved.push(media)
  }
  return resolved
}

export type GalleryItem = {
  src: string
  thumb: string
  alt: string
  caption?: string
  width?: number
  height?: number
  isVideo: boolean
  poster?: string
}

/** Turn an album's `items` into the shape the gallery grid and lightbox want. */
export function toGalleryItems(value: unknown): GalleryItem[] {
  if (!Array.isArray(value)) return []

  const items: GalleryItem[] = []
  for (const raw of value) {
    const full = mediaUrl(raw, 'full')
    const thumb = mediaUrl(raw, 'thumbnail')
    if (!full || !thumb) continue

    const poster = full.isVideo
      ? (mediaUrl((raw as PayloadMedia).poster, 'card')?.url ?? undefined)
      : undefined

    items.push({
      src: full.url,
      thumb: thumb.url,
      alt: full.alt,
      caption: full.caption,
      width: full.width,
      height: full.height,
      isVideo: full.isVideo,
      poster,
    })
  }
  return items
}
