'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Play } from 'lucide-react'
import { useTranslations } from 'next-intl'

import Lightbox, { type Slide } from 'yet-another-react-lightbox'
import Captions from 'yet-another-react-lightbox/plugins/captions'
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails'
import Video from 'yet-another-react-lightbox/plugins/video'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'

import 'yet-another-react-lightbox/styles.css'
import 'yet-another-react-lightbox/plugins/captions.css'
import 'yet-another-react-lightbox/plugins/thumbnails.css'

import type { GalleryItem } from '@/lib/media'

/** The lightbox needs a MIME type; derive it from the file rather than assuming mp4. */
function videoType(src: string): string {
  const ext = src.split('?')[0].split('.').pop()?.toLowerCase()
  if (ext === 'webm') return 'video/webm'
  if (ext === 'mov') return 'video/quicktime'
  if (ext === 'ogg' || ext === 'ogv') return 'video/ogg'
  return 'video/mp4'
}

export function GalleryGrid({ items, emptyLabel }: { items: GalleryItem[]; emptyLabel?: string }) {
  const t = useTranslations('gallery')
  const [index, setIndex] = useState(-1)

  if (items.length === 0) {
    return <p className="py-16 text-center text-cream-50/60">{emptyLabel ?? t('empty')}</p>
  }

  const slides: Slide[] = items.map((item) =>
    item.isVideo
      ? {
          type: 'video',
          poster: item.poster,
          width: item.width ?? 1280,
          height: item.height ?? 720,
          sources: [{ src: item.src, type: videoType(item.src) }],
          description: item.caption,
        }
      : {
          src: item.src,
          alt: item.alt,
          width: item.width,
          height: item.height,
          description: item.caption,
        },
  )

  return (
    <>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((item, i) => (
          <li key={`${item.src}-${i}`}>
            <button
              type="button"
              onClick={() => setIndex(i)}
              aria-label={item.alt || t('openImage')}
              className="group relative block aspect-square w-full overflow-hidden rounded-xl border border-white/10 bg-night-850 transition hover:border-star-400/50 focus-visible:border-star-400"
            >
              {item.isVideo && !item.poster ? (
                // No poster frame uploaded — next/image cannot resize a video
                // file, so show the clip's own first frame instead.
                <video
                  src={item.src}
                  muted
                  playsInline
                  preload="metadata"
                  aria-hidden
                  tabIndex={-1}
                  className="absolute inset-0 size-full object-cover transition duration-700 group-hover:scale-108"
                />
              ) : (
                <Image
                  src={item.isVideo && item.poster ? item.poster : item.thumb}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover transition duration-700 group-hover:scale-108"
                />
              )}
              <span className="absolute inset-0 bg-gradient-to-t from-nightfall/60 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
              {item.isVideo && (
                <span className="absolute inset-0 grid place-items-center">
                  <span className="grid size-12 place-items-center rounded-full bg-nightfall/70 text-daylight backdrop-blur-sm transition group-hover:bg-star-400 group-hover:text-nightfall">
                    <Play className="size-5 translate-x-px" aria-hidden />
                  </span>
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>

      <Lightbox
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
        slides={slides}
        plugins={[Captions, Thumbnails, Zoom, Video]}
        controller={{ closeOnBackdropClick: true }}
        styles={{ container: { backgroundColor: 'rgba(4, 6, 13, 0.96)' } }}
        video={{ controls: true, playsInline: true }}
      />
    </>
  )
}
