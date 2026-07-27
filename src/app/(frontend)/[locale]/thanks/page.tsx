import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { hasLocale } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Quote } from 'lucide-react'

import { PageHeader } from '@/components/site/page-header'
import { Reveal } from '@/components/site/reveal'
import { routing, type Locale } from '@/i18n/routing'
import { listTestimonials } from '@/lib/payload'

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
  const items = await listTestimonials(locale as Locale)

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
      </section>
    </>
  )
}
