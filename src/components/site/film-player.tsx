'use client'

import { useEffect, useRef } from 'react'

/**
 * The home-page film: starts by itself, silent, with the controls there to
 * unmute. A client component because React does not reliably emit the
 * `muted` attribute in server-rendered markup, and browsers refuse to
 * autoplay an unmuted video — so mute is (re)applied before playing.
 * Visitors who ask the system for reduced motion get a paused player.
 */
export function FilmPlayer({ src, poster }: { src: string; poster?: string }) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    el.muted = true
    el.play().catch(() => {
      // Autoplay refused (rare once muted) — the visitor presses play.
    })
  }, [])

  return (
    <video
      ref={ref}
      controls
      controlsList="nodownload"
      autoPlay
      muted
      playsInline
      preload="metadata"
      poster={poster}
      src={src}
      className="aspect-video w-full"
    />
  )
}
