import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { hasLocale } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { ArrowLeft } from 'lucide-react'

import { GalleryGrid } from '@/components/site/gallery-grid'
import { PageHeader } from '@/components/site/page-header'
import { routing, type Locale } from '@/i18n/routing'
import { findAlbum, listAlbums } from '@/lib/payload'
import { localeHref } from '@/lib/nav'
import { mediaUrl, toGalleryItems } from '@/lib/media'

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
  const { locale, slug } = await params
  if (!hasLocale(routing.locales, locale)) return {}

  const album = await findAlbum(slug, locale as Locale)
  if (!album) return {}

  const cover = mediaUrl(album.cover, 'wide')
  return {
    title: album.title,
    description: album.description,
    openGraph: cover ? { images: [{ url: cover.url }] } : undefined,
  }
}

export default async function AlbumPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)

  const typedLocale = locale as Locale
  const t = await getTranslations()

  const album = await findAlbum(slug, typedLocale)
  if (!album) notFound()

  const items = toGalleryItems(album.items)

  return (
    <>
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
