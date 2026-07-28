import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { hasLocale } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { ArrowLeft } from 'lucide-react'

import { GalleryGrid } from '@/components/site/gallery-grid'
import { JsonLd } from '@/components/site/json-ld'
import { PageHeader } from '@/components/site/page-header'
import { routing, type Locale } from '@/i18n/routing'
import { findAlbum, listAlbums } from '@/lib/payload'
import { decodeSlug, localeHref } from '@/lib/nav'
import { mediaUrl, toGalleryItems } from '@/lib/media'
import { breadcrumbSchema, imageGallerySchema, pageMetadata } from '@/lib/seo'

export async function generateStaticParams() {
  const albums = await listAlbums({ locale: 'he', depth: 0 })
  return routing.locales.flatMap((locale) =>
    albums.map((album) => ({ locale, slug: album.slug })),
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug: rawSlug } = await params
  if (!hasLocale(routing.locales, locale)) return {}

  const slug = decodeSlug(rawSlug)
  const album = await findAlbum(slug, locale as Locale)
  if (!album) return {}

  const cover = mediaUrl(album.cover, 'wide')
  return pageMetadata({
    locale: locale as Locale,
    path: `/gallery/${slug}`,
    title: album.title,
    description: album.description ?? undefined,
    image: cover,
  })
}

export default async function AlbumPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug: rawSlug } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)

  const slug = decodeSlug(rawSlug)

  const typedLocale = locale as Locale
  const t = await getTranslations()

  const album = await findAlbum(slug, typedLocale)
  if (!album) notFound()

  const items = toGalleryItems(album.items)

  const schema = [
    imageGallerySchema({
      locale: typedLocale,
      path: `/gallery/${slug}`,
      name: album.title,
      description: album.description ?? undefined,
      images: items.filter((i) => !i.isVideo).map((i) => i.src),
    }),
    breadcrumbSchema(typedLocale, [
      { name: t('nav.home'), path: '' },
      { name: t('gallery.title'), path: '/gallery' },
      { name: album.title, path: `/gallery/${slug}` },
    ]),
  ]

  return (
    <>
      <JsonLd data={schema} />
      <PageHeader
        kicker={t('gallery.albums')}
        title={album.title}
        subtitle={album.description ?? undefined}
        image={mediaUrl(album.cover, 'wide')}
      />

      <section className="container-page py-14">
        <Link
          href={localeHref('/gallery', typedLocale)}
          className="mb-10 inline-flex items-center gap-2 text-sm font-semibold text-star-300 transition hover:text-star-200"
        >
          <ArrowLeft className="flip-x size-4" aria-hidden />
          {t('actions.backToGallery')}
        </Link>

        <GalleryGrid items={items} />
      </section>
    </>
  )
}
