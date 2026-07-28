'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Play } from 'lucide-react'

/**
 * A "lite" YouTube embed: just the thumbnail until the visitor presses play,
 * then the privacy-enhanced player (youtube-nocookie.com). Nothing from
 * YouTube loads — no cookies, no scripts — for people who only scroll past.
 */
export function YouTubeEmbed({ id, title }: { id: string; title: string }) {
  const [playing, setPlaying] = useState(false)

  return (
    <figure className="overflow-hidden rounded-card border border-white/10 bg-night-850/60">
      <div className="relative aspect-video">
        {playing ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 size-full border-0"
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label={title}
            className="group absolute inset-0 block w-full"
          >
            <Image
              src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
              alt=""
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition duration-700 group-hover:scale-105"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-nightfall/70 via-transparent to-transparent" />
            <span className="absolute inset-0 grid place-items-center">
              <span className="grid size-14 place-items-center rounded-full bg-nightfall/70 text-daylight backdrop-blur-sm transition group-hover:bg-star-400 group-hover:text-nightfall">
                <Play className="size-6 translate-x-px" aria-hidden />
              </span>
            </span>
          </button>
        )}
      </div>
      <figcaption dir="auto" className="p-4 text-sm text-cream-50/80">
        {title}
      </figcaption>
    </figure>
  )
}
