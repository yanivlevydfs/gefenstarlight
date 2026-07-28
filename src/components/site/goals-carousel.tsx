'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export type GoalSlide = {
  title: string
  body?: string
  image?: { url: string; alt: string } | null
}

/**
 * The goals slider carried over from the old Wix home page: each goal beside
 * a photograph of Gefen. Advances by itself every few seconds, pauses while
 * the visitor is on it, and stays still for people who ask the system for
 * reduced motion.
 */
export function GoalsCarousel({
  slides,
  label,
  prevLabel,
  nextLabel,
}: {
  slides: GoalSlide[]
  label: string
  prevLabel: string
  nextLabel: string
}) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const stillness = useReducedMotion()
  const count = slides.length
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)

  const go = useCallback((next: number) => setIndex(((next % count) + count) % count), [count])

  useEffect(() => {
    if (stillness || paused || count < 2) return
    timer.current = setInterval(() => setIndex((i) => (i + 1) % count), 6000)
    return () => {
      if (timer.current) clearInterval(timer.current)
    }
  }, [stillness, paused, count])

  if (count === 0) return null
  const slide = slides[index]

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className="relative mt-10 overflow-hidden rounded-card border border-white/10 bg-night-850/60"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={index}
          initial={stillness ? false : { opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={stillness ? undefined : { opacity: 0, x: -24 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="grid items-stretch md:grid-cols-2"
        >
          <div className="relative aspect-[4/3] md:aspect-auto md:min-h-96">
            {slide.image ? (
              <Image
                src={slide.image.url}
                alt={slide.image.alt}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            ) : (
              <div className="aurora absolute inset-0" aria-hidden />
            )}
          </div>

          <div className="flex flex-col justify-center gap-4 p-8 md:p-12">
            <h3 className="text-2xl sm:text-3xl">{slide.title}</h3>
            {slide.body && (
              <p className="max-w-md text-lg leading-relaxed text-star-300">{slide.body}</p>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {count > 1 && (
        <div className="absolute inset-x-0 bottom-4 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => go(index - 1)}
            aria-label={prevLabel}
            className="grid size-9 place-items-center rounded-full bg-nightfall/60 text-daylight backdrop-blur-sm transition hover:bg-star-400 hover:text-nightfall"
          >
            <ChevronLeft className="flip-x size-5" aria-hidden />
          </button>

          <div className="flex gap-2" aria-hidden>
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                tabIndex={-1}
                onClick={() => go(i)}
                className={`size-2 rounded-full transition ${
                  i === index ? 'bg-star-400' : 'bg-cream-50/35 hover:bg-cream-50/60'
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => go(index + 1)}
            aria-label={nextLabel}
            className="grid size-9 place-items-center rounded-full bg-nightfall/60 text-daylight backdrop-blur-sm transition hover:bg-star-400 hover:text-nightfall"
          >
            <ChevronRight className="flip-x size-5" aria-hidden />
          </button>
        </div>
      )}
    </div>
  )
}
