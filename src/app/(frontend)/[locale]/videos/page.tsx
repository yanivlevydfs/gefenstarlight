import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { hasLocale } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import { GalleryGrid } from '@/components/site/gallery-grid'
import { PageHeader } from '@/components/site/page-header'
import { routing, type Locale } from '@/i18n/routing'
import { listVideos } from '@/lib/payload'
import { toGalleryItems } from '@/lib/media'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) return {}
  const t = await getTranslations({ locale, namespace: 'videos' })
  return { title: t('title'), description: t('subtitle') }
}

export default async function VideosPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)

  const t = await getTranslations('videos')
  const videos = await listVideos(locale as Locale)

  return (
    <>
      <PageHeader title={t('title')} subtitle={t('subtitle')} />
      <section className="container-page py-16">
        <GalleryGrid items={toGalleryItems(videos)} />
      </section>
    </>
  )
}
