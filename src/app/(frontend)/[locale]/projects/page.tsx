import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { hasLocale } from 'next-intl'
import { getFormatter, getTranslations, setRequestLocale } from 'next-intl/server'
import { ArrowLeft, MapPin } from 'lucide-react'

import { PageHeader } from '@/components/site/page-header'
import { Reveal } from '@/components/site/reveal'
import { routing, type Locale } from '@/i18n/routing'
import { listProjects } from '@/lib/payload'
import { localeHref } from '@/lib/nav'
import { mediaUrl } from '@/lib/media'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) return {}
  const t = await getTranslations({ locale, namespace: 'projects' })
  return { title: t('title') }
}

export default async function ProjectsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)

  const typedLocale = locale as Locale
  const t = await getTranslations('projects')
  const tActions = await getTranslations('actions')
  const format = await getFormatter()

  const projects = await listProjects({ locale: typedLocale })

  return (
    <>
      {/* No image passed: the header falls back to the portrait of Gefen.
          Using the newest project's cover put an event poster behind the
          heading, and its text fought with the title. */}
      <PageHeader title={t('title')} subtitle={t('subtitle')} />

      <section className="container-page py-16">
        {projects.length === 0 ? (
          <p className="py-16 text-center text-cream-50/60">{t('empty')}</p>
        ) : (
          <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, i) => {
              const cover = mediaUrl(project.cover, 'card')
              return (
                <Reveal key={project.id} delay={0.05 * (i % 6)} as="li">
                  <Link
                    href={localeHref(`/projects/${project.slug}`, typedLocale)}
                    className="group flex h-full flex-col overflow-hidden rounded-card border border-white/10 bg-night-850/60 transition hover:border-star-400/40"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-night-800">
                      {cover && (
                        <Image
                          src={cover.url}
                          alt=""
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover transition duration-700 group-hover:scale-105"
                        />
                      )}
                    </div>

                    <div className="flex flex-1 flex-col p-6">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-star-300">
                        {project.date && (
                          <time dateTime={project.date}>
                            {format.dateTime(new Date(project.date), {
                              year: 'numeric',
                              month: 'long',
                            })}
                          </time>
                        )}
                        {project.location && (
                          <span className="inline-flex items-center gap-1 text-cream-50/50">
                            <MapPin className="size-3" aria-hidden />
                            {project.location}
                          </span>
                        )}
                      </div>

                      <h2 className="mt-2 text-xl transition group-hover:text-star-300">
                        {project.title}
                      </h2>
                      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-cream-50/70">
                        {project.summary}
                      </p>

                      <span className="mt-auto flex items-center gap-2 pt-5 text-sm font-semibold text-star-300">
                        {tActions('readMore')}
                        <ArrowLeft
                          className="flip-x size-4 transition group-hover:-translate-x-1"
                          aria-hidden
                        />
                      </span>
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
