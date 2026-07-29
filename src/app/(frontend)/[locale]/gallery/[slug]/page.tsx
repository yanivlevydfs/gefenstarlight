import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { hasLocale } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { ArrowLeft, Heart } from 'lucide-react'

import { GalleryGrid } from '@/components/site/gallery-grid'
import { JsonLd } from '@/components/site/json-ld'
import { PageHeader } from '@/components/site/page-header'
import { routing, type Locale } from '@/i18n/routing'
import { findAlbum, findProjectByAlbum, listAlbums } from '@/lib/payload'
import { decodeSlug, localeHref } from '@/lib/nav'
import { coverImage, toGalleryItems } from '@/lib/media'
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

  const cover = coverImage(album, 'wide')
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

  // When a project claims this album, send visitors onward to it — using the
  // project's own call to action ("buy Gefen wine") when it has one.
  const project = await findProjectByAlbum(album.id, typedLocale)

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
        image={coverImage(album, 'wide')}
      />

      <section className="container-page py-14">
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <Link
            href={localeHref('/gallery', typedLocale)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-star-300 transition hover:text-star-200"
          >
            <ArrowLeft className="flip-x size-4" aria-hidden />
            {t('actions.backToGallery')}
          </Link>

          {project && (
            <Link
              href={localeHref(`/projects/${project.slug}`, typedLocale)}
              className="inline-flex items-center gap-2 rounded-full bg-star-400 px-6 py-3 font-bold text-nightfall shadow-lg shadow-star-500/25 transition hover:bg-star-hover"
            >
              <Heart className="size-4" aria-hidden />
              {project.ctaLabel || t('gallery.toProject')}
            </Link>
          )}
        </div>

        <GalleryGrid items={items} />
      </section>
    </>
  )
}
