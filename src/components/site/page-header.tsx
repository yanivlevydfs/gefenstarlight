import Image from 'next/image'

import { Starfield } from '@/components/site/starfield'
import { Reveal } from '@/components/site/reveal'
import type { ResolvedMedia } from '@/lib/media'

/** The shared hero band at the top of every inner page. */
export function PageHeader({
  kicker,
  title,
  subtitle,
  image,
  children,
}: {
  kicker?: string
  title: string
  subtitle?: string
  image?: ResolvedMedia | null
  children?: React.ReactNode
}) {
  return (
    <section className="relative isolate overflow-hidden border-b border-white/10">
      {image && (
        <Image
          src={image.url}
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover opacity-25"
        />
      )}
      <div className="aurora absolute inset-0 -z-10" />
      <Starfield />

      <div className="container-page py-20 sm:py-24">
        {kicker && (
          <Reveal>
            <p className="text-sm font-semibold tracking-[0.2em] text-star-300 uppercase">
              {kicker}
            </p>
          </Reveal>
        )}
        <Reveal delay={0.06}>
          <h1 className="mt-4 max-w-4xl text-4xl sm:text-5xl lg:text-6xl">
            <span className="text-gradient-star">{title}</span>
          </h1>
        </Reveal>
        {subtitle && (
          <Reveal delay={0.12}>
            <p className="mt-5 max-w-2xl text-lg text-cream-50/75">{subtitle}</p>
          </Reveal>
        )}
        {children}
      </div>
    </section>
  )
}
