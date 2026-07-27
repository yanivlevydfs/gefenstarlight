import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { hasLocale } from 'next-intl'
import { getFormatter, getTranslations, setRequestLocale } from 'next-intl/server'
import { ArrowLeft } from 'lucide-react'

import { GalleryGrid } from '@/components/site/gallery-grid'
import { PageHeader } from '@/components/site/page-header'
import { RichText } from '@/components/site/rich-text'
import { routing, type Locale } from '@/i18n/routing'
import { findArticle, listArticles } from '@/lib/payload'
import { localeHref } from '@/lib/nav'
import { mediaUrl, toGalleryItems } from '@/lib/media'

export async function generateStaticParams() {
  const articles = await listArticles({ locale: 'he', depth: 0 })
  return routing.locales.flatMap((locale) =>
    articles.map((article) => ({ locale, slug: article.slug })),
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  if (!hasLocale(routing.locales, locale)) return {}

  const article = await findArticle(slug, locale as Locale)
  if (!article) return {}

  const cover = mediaUrl(article.cover, 'wide')
  return {
    title: article.title,
    description: article.excerpt ?? undefined,
    openGraph: {
      type: 'article',
      publishedTime: article.publishedAt,
      images: cover ? [{ url: cover.url }] : undefined,
    },
  }
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)

  const typedLocale = locale as Locale
  const t = await getTranslations()
  const format = await getFormatter()

  const article = await findArticle(slug, typedLocale)
  if (!article) notFound()

  const album = typeof article.album === 'object' ? article.album : null
  const albumItems = toGalleryItems(album?.items)

  return (
    <>
      <PageHeader
        kicker={format.dateTime(new Date(article.publishedAt), {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
        title={article.title}
        subtitle={article.excerpt ?? undefined}
        image={mediaUrl(article.cover, 'wide')}
      />

      <article className="container-page py-14">
        <Link
          href={localeHref('/news', typedLocale)}
          className="inline-flex items-center gap-2 text-sm font-semibold text-star-300 transition hover:text-star-200"
        >
          <ArrowLeft className="flip-x size-4" aria-hidden />
          {t('actions.backToNews')}
        </Link>

        <div className="mt-10 max-w-3xl">
          <RichText data={article.body} />
        </div>

        {albumItems.length > 0 && (
          <div className="mt-16">
            <GalleryGrid items={albumItems} />
          </div>
        )}
      </article>
    </>
  )
}
