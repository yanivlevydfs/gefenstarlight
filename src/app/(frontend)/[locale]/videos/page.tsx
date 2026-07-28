import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { hasLocale } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import { GalleryGrid } from '@/components/site/gallery-grid'
import { PageHeader } from '@/components/site/page-header'
import { YouTubeEmbed } from '@/components/site/youtube-embed'
import { routing, type Locale } from '@/i18n/routing'
import { listVideos, listYouTubeVideos } from '@/lib/payload'
import { youtubeId } from '@/payload/collections/YouTubeVideos'
import { toGalleryItems } from '@/lib/media'
import { alternates } from '@/lib/seo'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) return {}
  const t = await getTranslations({ locale, namespace: 'videos' })
  return {
    title: t('title'),
    description: t('subtitle'),
    alternates: alternates(locale as Locale, '/videos'),
  }
}

export default async function VideosPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)

  const t = await getTranslations('videos')
  const [videos, external] = await Promise.all([
    listVideos(locale as Locale),
    listYouTubeVideos(locale as Locale),
  ])

  const embeds = external
    .map((video) => ({ id: youtubeId(video.url), title: video.title }))
    .filter((video): video is { id: string; title: string } => Boolean(video.id))
  const uploaded = toGalleryItems(videos)

  return (
    <>
      <PageHeader title={t('title')} subtitle={t('subtitle')} />
      <section className="container-page space-y-12 py-16">
        {embeds.length > 0 && (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {embeds.map((video) => (
              <li key={video.id}>
                <YouTubeEmbed id={video.id} title={video.title} />
              </li>
            ))}
          </ul>
        )}

        {(uploaded.length > 0 || embeds.length === 0) && (
          <GalleryGrid items={uploaded} emptyLabel={t('empty')} />
        )}
      </section>
    </>
  )
}
