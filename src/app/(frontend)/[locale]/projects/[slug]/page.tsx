import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { hasLocale } from 'next-intl'
import { getFormatter, getTranslations, setRequestLocale } from 'next-intl/server'
import { ArrowLeft, ExternalLink, MapPin, Quote } from 'lucide-react'

import { GalleryGrid } from '@/components/site/gallery-grid'
import { PageHeader } from '@/components/site/page-header'
import { Reveal } from '@/components/site/reveal'
import { RichText } from '@/components/site/rich-text'
import { routing, type Locale } from '@/i18n/routing'
import { findProject, listProjects } from '@/lib/payload'
import { localeHref } from '@/lib/nav'
import { mediaUrl, toGalleryItems } from '@/lib/media'

export async function generateStaticParams() {
  const projects = await listProjects({ locale: 'he', depth: 0 })
  return routing.locales.flatMap((locale) =>
    projects.map((project) => ({ locale, slug: project.slug })),
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  if (!hasLocale(routing.locales, locale)) return {}

  const project = await findProject(slug, locale as Locale)
  if (!project) return {}

  const cover = mediaUrl(project.cover, 'wide')
  return {
    title: project.title,
    description: project.summary,
    openGraph: cover ? { images: [{ url: cover.url }] } : undefined,
  }
}

export default async function ProjectPage({
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

  const project = await findProject(slug, typedLocale)
  if (!project) notFound()

  const album = typeof project.album === 'object' ? project.album : null
  const albumItems = toGalleryItems(album?.items)
  const quotes = project.quotes ?? []

  return (
    <>
      <PageHeader
        kicker={t('projects.title')}
        title={project.title}
        subtitle={project.summary}
        image={mediaUrl(project.cover, 'wide')}
      >
        <Reveal delay={0.18}>
          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-cream-50/60">
            {project.date && (
              <time dateTime={project.date}>
                {format.dateTime(new Date(project.date), {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            )}
            {project.location && (
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="size-4 text-star-400" aria-hidden />
                {project.location}
              </span>
            )}
          </div>
        </Reveal>
      </PageHeader>

      <article className="container-page py-14">
        <a
          href={localeHref('/projects', typedLocale)}
          className="inline-flex items-center gap-2 text-sm font-semibold text-star-300 transition hover:text-star-200"
        >
          <ArrowLeft className="flip-x size-4" aria-hidden />
          {t('actions.backToProjects')}
        </a>

        <div className="mt-10 max-w-3xl">
          <RichText data={project.body} />

          {project.ctaUrl && (
            <a
              href={project.ctaUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="mt-10 inline-flex items-center gap-2 rounded-full bg-star-400 px-6 py-3 font-bold text-night-950 transition hover:bg-star-300"
            >
              {project.ctaLabel || t('actions.readMore')}
              <ExternalLink className="size-4" aria-hidden />
            </a>
          )}
        </div>

        {quotes.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl">{t('projects.quotesTitle')}</h2>
            <ul className="mt-6 grid gap-5 lg:grid-cols-2">
              {quotes.map((q, i) => (
                <Reveal key={i} delay={0.06 * i} as="li">
                  <figure className="h-full rounded-card border border-white/10 bg-night-850/60 p-6">
                    <Quote className="size-6 text-star-400/70" aria-hidden />
                    <blockquote className="mt-3 leading-relaxed text-cream-50/80">
                      {q.quote}
                    </blockquote>
                    {q.author && (
                      <figcaption className="mt-4 text-sm font-semibold text-star-300">
                        {q.author}
                      </figcaption>
                    )}
                  </figure>
                </Reveal>
              ))}
            </ul>
          </section>
        )}

        {albumItems.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl">{t('projects.photosFromProject')}</h2>
            <div className="mt-6">
              <GalleryGrid items={albumItems} />
            </div>
          </section>
        )}
      </article>
    </>
  )
}
