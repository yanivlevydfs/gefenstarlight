import Image from 'next/image'
import { getLocale } from 'next-intl/server'

import { Starfield } from '@/components/site/starfield'
import { Reveal } from '@/components/site/reveal'
import { mediaUrl, type ResolvedMedia } from '@/lib/media'
import { getDefaultHero } from '@/lib/payload'
import type { Locale } from '@/i18n/routing'

/** The shared hero band at the top of every inner page. */
export async function PageHeader({
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
  // Pages without artwork of their own fall back to the portrait of Gefen.
  const locale = (await getLocale()) as Locale
  const hero = image ?? mediaUrl(await getDefaultHero(locale), 'wide')

  return (
    <section className="relative isolate overflow-hidden border-b border-white/10">
      {hero && (
        <Image
          src={hero.url}
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-10 animate-drift object-cover opacity-25"
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
          {/* CMS text may be untranslated Hebrew on the English site — `auto`
              resolves direction from the text itself. */}
          <h1 dir="auto" className="mt-4 max-w-4xl text-4xl sm:text-5xl lg:text-6xl">
            <span className="text-gradient-star">{title}</span>
          </h1>
        </Reveal>
        {subtitle && (
          <Reveal delay={0.12}>
            <p dir="auto" className="mt-5 max-w-2xl text-lg text-cream-50/75">
              {subtitle}
            </p>
          </Reveal>
        )}
        {children}
      </div>
    </section>
  )
}
