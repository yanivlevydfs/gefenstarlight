import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { hasLocale } from 'next-intl'
import { getFormatter, getTranslations, setRequestLocale } from 'next-intl/server'

import { CoverImage } from '@/components/site/cover-image'
import { PageHeader } from '@/components/site/page-header'
import { Reveal } from '@/components/site/reveal'
import { routing, type Locale } from '@/i18n/routing'
import { alternates } from '@/lib/seo'
import { listArticles } from '@/lib/payload'
import { localeHref } from '@/lib/nav'
import { coverImage } from '@/lib/media'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) return {}
  const t = await getTranslations({ locale, namespace: 'news' })
  return {
    title: t('title'),
    description: t('subtitle'),
    alternates: alternates(locale as Locale, '/news'),
  }
}

export default async function NewsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)

  const typedLocale = locale as Locale
  const t = await getTranslations('news')
  const format = await getFormatter()

  const articles = await listArticles({ locale: typedLocale })

  return (
    <>
      <PageHeader title={t('title')} subtitle={t('subtitle')} />

      <section className="container-page py-16">
        {articles.length === 0 ? (
          <p className="py-16 text-center text-cream-50/60">{t('empty')}</p>
        ) : (
          <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article, i) => {
              const cover = coverImage(article, 'card')
              return (
                <Reveal key={article.id} delay={0.05 * (i % 6)} as="li">
                  <Link
                    href={localeHref(`/news/${article.slug}`, typedLocale)}
                    className="group flex h-full flex-col overflow-hidden rounded-card border border-white/10 bg-night-850/60 transition hover:border-star-400/40"
                  >
                    <CoverImage
                      media={cover}
                      aspect="aspect-[16/10]"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="flex flex-1 flex-col p-6">
                      <time dateTime={article.publishedAt} className="text-xs text-star-300">
                        {format.dateTime(new Date(article.publishedAt), {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </time>
                      <h2 className="mt-2 text-xl transition group-hover:text-star-300">
                        {article.title}
                      </h2>
                      {article.excerpt && (
                        <p dir="auto" className="mt-2 line-clamp-3 text-sm leading-relaxed text-cream-50/70">
                          {article.excerpt}
                        </p>
                      )}
                    </div>
                  </Link>
                </Reveal>
              )
            })}
          </ul>
        )}
      </section>
    </>
  )
}
