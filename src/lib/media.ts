type PayloadSize = { url?: string | null; width?: number | null; height?: number | null }

type PayloadMedia = {
  url?: string | null
  alt?: string | null
  caption?: string | null
  width?: number | null
  height?: number | null
  mimeType?: string | null
  sizes?: Record<string, PayloadSize | undefined>
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
  if (!media.url) return null

  const isVideo = Boolean(media.mimeType?.startsWith('video/'))
  // Videos have no generated sizes — always use the original file.
  const chosen = isVideo ? undefined : media.sizes?.[size]

  return {
    url: chosen?.url ?? media.url,
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
  return value
    .map((item) => mediaUrl(item, size))
    .filter((item): item is ResolvedMedia => item !== null)
}
