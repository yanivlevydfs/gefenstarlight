import Image from 'next/image'
import type React from 'react'

import { StarMark } from '@/components/site/star-mark'
import type { ResolvedMedia } from '@/lib/media'

/**
 * The framed preview picture at the top of a listing card.
 *
 * Every listing used to write `{cover && <Image …>}`, which drops the whole
 * frame when an entry has no picture — one coverless article turned a row of
 * cards into a headline floating in an empty box. The frame is therefore
 * unconditional here: a real photo when there is one, the starlight mark on
 * the card surface when there is not. A missing picture then reads as a
 * deliberate placeholder rather than a broken page, and no caller can
 * reintroduce the ragged grid by forgetting the fallback.
 *
 * `children` renders above the picture, for the scrims and badges a card
 * paints over its own cover.
 */
export function CoverImage({
  media,
  sizes,
  aspect = 'aspect-[4/3]',
  children,
}: {
  media: ResolvedMedia | null
  sizes: string
  aspect?: string
  children?: React.ReactNode
}) {
  return (
    <div className={`relative ${aspect} overflow-hidden bg-night-800`}>
      {media ? (
        <Image
          src={media.url}
          alt=""
          fill
          sizes={sizes}
          className="object-cover transition duration-700 group-hover:scale-105"
        />
      ) : (
        <StarMark className="absolute inset-0 m-auto size-10 text-night-600" />
      )}
      {children}
    </div>
  )
}
