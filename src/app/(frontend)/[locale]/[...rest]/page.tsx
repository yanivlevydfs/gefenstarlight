import type { Metadata } from 'next'
import { notFound, permanentRedirect } from 'next/navigation'
import { hasLocale } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'

import { GalleryGrid } from '@/components/site/gallery-grid'
import { PageHeader } from '@/components/site/page-header'
import { RichText } from '@/components/site/rich-text'
import { routing, type Locale } from '@/i18n/routing'
import { findByLegacyPath, findPage } from '@/lib/payload'
import { mediaUrl, toGalleryItems } from '@/lib/media'

/**
 * The last route to be tried. It serves two purposes:
 *
 *  1. Renders any page the owner created in the admin console, at /<locale>/<slug>.
 *  2. Redirects old Wix URLs (e.g. /גלריה) to wherever their content now lives,
 *     by asking the CMS which document claims that path. Nothing is hard-coded.
 */

async function resolve(locale: Locale, rest: string[]) {
  const slug = rest[rest.length - 1]
  const page = rest.length === 1 ? await findPage(slug, locale) : null
  return { slug, page }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; rest: string[] }>
}): Promise<Metadata> {
  const { locale, rest } = await params
  if (!hasLocale(routing.locales, locale)) return {}

  const { page } = await resolve(locale as Locale, rest)
  if (!page) return {}

  const hero = mediaUrl(page.hero, 'wide')
  return {
    title: page.title,
    description: page.subtitle ?? undefined,
    openGraph: hero ? { images: [{ url: hero.url }] } : undefined,
  }
}

export default async function CatchAllPage({
  params,
}: {
  params: Promise<{ locale: string; rest: string[] }>
}) {
  const { locale, rest } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)

  const typedLocale = locale as Locale
  const { page } = await resolve(typedLocale, rest)

  if (!page) {
    // Not a CMS page — see whether an old Wix URL points at something.
    const destination = await findByLegacyPath('/' + rest.join('/'), typedLocale)
    if (destination) permanentRedirect(destination)
    notFound()
  }

  const album = typeof page.album === 'object' ? page.album : null
  const albumItems = toGalleryItems(album?.items)

  return (
    <>
      <PageHeader
        title={page.title}
        subtitle={page.subtitle ?? undefined}
        image={mediaUrl(page.hero, 'wide')}
      />

      <article className="container-page py-14">
        <div className="max-w-3xl">
          <RichText data={page.body} />
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
