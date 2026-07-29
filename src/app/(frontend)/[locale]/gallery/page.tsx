import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { hasLocale } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import { CoverImage } from '@/components/site/cover-image'
import { PageHeader } from '@/components/site/page-header'
import { Reveal } from '@/components/site/reveal'
import { routing, type Locale } from '@/i18n/routing'
import { alternates } from '@/lib/seo'
import { listAlbums } from '@/lib/payload'
import { localeHref } from '@/lib/nav'
import { coverImage } from '@/lib/media'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) return {}
  const t = await getTranslations({ locale, namespace: 'gallery' })
  return {
    title: t('title'),
    description: t('subtitle'),
    alternates: alternates(locale as Locale, '/gallery'),
  }
}

export default async function GalleryIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)

  const typedLocale = locale as Locale
  const t = await getTranslations('gallery')

  const albums = await listAlbums({
    locale: typedLocale,
    where: { showInGallery: { equals: true } },
  })

  return (
    <>
      <PageHeader title={t('title')} subtitle={t('subtitle')} />

      <section className="container-page py-16">
        {albums.length === 0 ? (
          <p className="py-16 text-center text-cream-50/60">{t('empty')}</p>
        ) : (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {albums.map((album, i) => {
              const cover = coverImage(album, 'card')
              const count = album.items?.length ?? 0

              return (
                <Reveal key={album.id} delay={0.05 * (i % 6)} as="li">
                  <Link
                    href={localeHref(`/gallery/${album.slug}`, typedLocale)}
                    className="group block overflow-hidden rounded-card border border-white/10 bg-night-850/60 transition hover:border-star-400/40"
                  >
                    <CoverImage
                      media={cover}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    >
                      <span className="absolute inset-0 bg-gradient-to-t from-nightfall/70 to-transparent" />
                      <span className="absolute bottom-3 start-4 text-sm font-medium text-daylight/85">
                        {t('itemCount', { count })}
                      </span>
                    </CoverImage>
                    <div className="p-5">
                      <h2 className="text-xl transition group-hover:text-star-300">{album.title}</h2>
                      {album.description && (
                        <p className="mt-2 line-clamp-2 text-sm text-cream-50/65">
                          {album.description}
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
