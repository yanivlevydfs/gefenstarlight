import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { hasLocale } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Quote } from 'lucide-react'

import { GalleryGrid } from '@/components/site/gallery-grid'
import { PageHeader } from '@/components/site/page-header'
import { Reveal } from '@/components/site/reveal'
import { routing, type Locale } from '@/i18n/routing'
import { findAlbum, listTestimonials } from '@/lib/payload'
import { toGalleryItems } from '@/lib/media'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) return {}
  const t = await getTranslations({ locale, namespace: 'thanks' })
  return { title: t('title'), description: t('subtitle') }
}

export default async function ThanksPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)

  const t = await getTranslations('thanks')
  const [items, album] = await Promise.all([
    listTestimonials(locale as Locale),
    // The old site showed scans of the letters themselves alongside the quotes.
    findAlbum('thanks', locale as Locale),
  ])
  const letters = toGalleryItems(album?.items)

  return (
    <>
      <PageHeader title={t('title')} subtitle={t('subtitle')} />

      <section className="container-page py-16">
        <ul className="grid gap-6 lg:grid-cols-2">
          {items.map((item, i) => (
            <Reveal key={item.id} delay={0.06 * (i % 4)} as="li">
              <figure className="flex h-full flex-col rounded-card border border-white/10 bg-night-850/60 p-8">
                <Quote className="size-8 text-star-400/70" aria-hidden />
                <blockquote className="mt-4 flex-1 text-lg leading-relaxed text-cream-50/80">
                  {item.quote}
                </blockquote>
                <figcaption className="mt-6 border-t border-white/10 pt-4">
                  <span className="block font-semibold text-star-300">{item.author}</span>
                  {item.role && (
                    <span className="block text-sm text-cream-50/55">{item.role}</span>
                  )}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </ul>

        {letters.length > 0 && (
          <div className="mt-14">
            <GalleryGrid items={letters} />
          </div>
        )}
      </section>
    </>
  )
}
