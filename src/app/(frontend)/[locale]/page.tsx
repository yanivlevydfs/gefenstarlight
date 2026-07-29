import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { hasLocale } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { ArrowLeft, Heart } from 'lucide-react'

import { CoverImage } from '@/components/site/cover-image'
import { FilmPlayer } from '@/components/site/film-player'
import { GoalsCarousel } from '@/components/site/goals-carousel'
import { Starfield } from '@/components/site/starfield'
import { Reveal } from '@/components/site/reveal'
import { routing, type Locale } from '@/i18n/routing'
import { getFilm, getGoalPhotos, getHomePage, listProjects } from '@/lib/payload'
import { localeHref } from '@/lib/nav'
import { coverImage, mediaUrl } from '@/lib/media'

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)

  const typedLocale = locale as Locale
  const t = await getTranslations()

  const [h, projects, film, goalPhotos] = await Promise.all([
    getHomePage(typedLocale),
    listProjects({ locale: typedLocale, limit: 3, where: { featured: { equals: true } } }),
    getFilm(),
    getGoalPhotos(),
  ])

  const heroImage = mediaUrl(h?.heroImage, 'wide')
  const filmSrc = mediaUrl(film, 'full')
  const filmPoster = film ? mediaUrl(film.poster, 'wide')?.url : undefined

  // The goals slider from the old site: each goal beside a photo of Gefen.
  // The admin chooses each goal's photo in the home-page settings; goals
  // without one fall back to the classic pairing carried over from Wix.
  const goalSlides = (h?.goals ?? []).map((goal, i) => {
    const photo = mediaUrl(goal.image, 'card') ?? mediaUrl(goalPhotos[i], 'card')
    return {
      title: goal.title,
      body: goal.body ?? undefined,
      image: photo ? { url: photo.url, alt: photo.alt } : null,
    }
  })

  return (
    <>
      {/* ---------------------------------------------------------------- Hero */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-20 bg-night-950" />
        {heroImage && (
          <Image
            src={heroImage.url}
            alt=""
            fill
            priority
            sizes="100vw"
            className="-z-10 animate-drift object-cover opacity-30"
          />
        )}
        <div className="aurora absolute inset-0 -z-10" />
        <div className="hero-light absolute inset-0 -z-10" />
        <Starfield />

        <div className="container-page relative flex min-h-[78vh] flex-col justify-center py-24">
          <Reveal>
            <p className="text-sm font-semibold tracking-[0.2em] text-star-300 uppercase">
              {h?.heroKicker || t('home.heroKicker')}
            </p>
          </Reveal>

          <Reveal delay={0.08}>
            <h1 className="mt-5 max-w-4xl text-5xl leading-[1.05] sm:text-6xl lg:text-7xl">
              <span className="text-gradient-star">{h?.heroTitle || t('home.heroTitle')}</span>
            </h1>
          </Reveal>

          <Reveal delay={0.16}>
            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-cream-50/80 sm:text-xl">
              {h?.heroLead || t('home.heroLead')}
            </p>
          </Reveal>

          <Reveal delay={0.24}>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href={localeHref('/donate', typedLocale)}
                className="inline-flex items-center gap-2 rounded-full bg-star-400 px-7 py-3.5 font-bold text-nightfall shadow-xl shadow-star-500/25 transition hover:bg-star-hover hover:shadow-star-400/40"
              >
                <Heart className="size-5" aria-hidden />
                {t('actions.donateNow')}
              </Link>
              <Link
                href={localeHref('/gefen', typedLocale)}
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-7 py-3.5 font-medium transition hover:border-star-400/60 hover:text-star-300"
              >
                {t('nav.gefen')}
                <ArrowLeft className="point-forward size-4" aria-hidden />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* --------------------------------------------------------------- Focus */}
      <section className="border-y border-white/10 bg-night-900">
        <div className="container-page grid gap-10 py-20 lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal>
            <h2 className="text-3xl sm:text-4xl">{h?.focusTitle || t('home.focusTitle')}</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-lg leading-relaxed text-cream-50/75">
              {h?.focusBody || t('home.focusBody')}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ---------------------------------------------------------------- Film */}
      {filmSrc && (
        <section className="container-page py-20">
          <Reveal>
            <h2 className="text-3xl sm:text-4xl">{t('home.filmTitle')}</h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mt-2 max-w-2xl text-cream-50/70">{t('home.filmSubtitle')}</p>
          </Reveal>
          <Reveal delay={0.16}>
            <div className="mt-8 overflow-hidden rounded-card border border-white/10 bg-nightfall shadow-lift">
              <FilmPlayer src={filmSrc.url} poster={filmPoster} />
            </div>
          </Reveal>
        </section>
      )}

      {/* --------------------------------------------------------------- Goals */}
      {goalSlides.length > 0 && (
        <section className="container-page py-20">
          <Reveal>
            <h2 className="text-3xl sm:text-4xl">{t('home.goalsTitle')}</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <GoalsCarousel
              slides={goalSlides}
              label={t('home.goalsTitle')}
              prevLabel={t('home.goalsPrev')}
              nextLabel={t('home.goalsNext')}
            />
          </Reveal>
        </section>
      )}

      {/* ------------------------------------------------------ Latest projects */}
      {projects.length > 0 && (
        <section className="container-page py-10 pb-20">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="text-3xl sm:text-4xl">{t('home.latestTitle')}</h2>
                <p className="mt-2 text-cream-50/60">{t('home.latestSubtitle')}</p>
              </div>
              <Link
                href={localeHref('/projects', typedLocale)}
                className="inline-flex items-center gap-2 text-sm font-semibold text-star-300 transition hover:text-star-200"
              >
                {t('projects.allProjects')}
                <ArrowLeft className="point-forward size-4" aria-hidden />
              </Link>
            </div>
          </Reveal>

          <ul className="mt-10 grid gap-6 md:grid-cols-3">
            {projects.map((project, i) => {
              const cover = coverImage(project, 'card')
              return (
                <Reveal key={project.id} delay={0.06 * i} as="li">
                  <Link
                    href={localeHref(`/projects/${project.slug}`, typedLocale)}
                    className="group block h-full overflow-hidden rounded-card border border-white/10 bg-night-850/60 transition hover:border-star-400/40"
                  >
                    <CoverImage media={cover} sizes="(max-width: 768px) 100vw, 33vw" />
                    <div className="p-6">
                      <h3 className="text-xl">{project.title}</h3>
                      <p dir="auto" className="mt-2 line-clamp-3 text-sm leading-relaxed text-cream-50/70">
                        {project.summary}
                      </p>
                    </div>
                  </Link>
                </Reveal>
              )
            })}
          </ul>
        </section>
      )}

      {/* ----------------------------------------------------------- Donate CTA */}
      <section className="relative isolate overflow-hidden border-t border-white/10">
        <div className="aurora absolute inset-0 -z-10" />
        <div className="container-page py-24 text-center">
          <Reveal>
            <h2 className="text-4xl sm:text-5xl">{h?.ctaTitle || t('home.ctaTitle')}</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-cream-50/75">
              {h?.ctaBody || t('home.ctaBody')}
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <Link
              href={localeHref('/donate', typedLocale)}
              className="mt-10 inline-flex items-center gap-2 rounded-full bg-star-400 px-8 py-4 text-lg font-bold text-nightfall shadow-xl shadow-star-500/25 transition hover:bg-star-hover"
            >
              <Heart className="size-5" aria-hidden />
              {t('actions.donateNow')}
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  )
}
