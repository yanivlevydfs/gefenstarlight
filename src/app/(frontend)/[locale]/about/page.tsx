import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { hasLocale } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import { PageHeader } from '@/components/site/page-header'
import { Reveal } from '@/components/site/reveal'
import { StarMark } from '@/components/site/star-mark'
import { routing, type Locale } from '@/i18n/routing'
import { alternates } from '@/lib/seo'
import { getSiteSettings, listBoardMembers } from '@/lib/payload'
import { mediaUrl } from '@/lib/media'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) return {}
  const t = await getTranslations({ locale, namespace: 'nav' })
  return { title: t('about'), alternates: alternates(locale as Locale, '/about') }
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)

  const typedLocale = locale as Locale
  const t = await getTranslations()

  const [members, settings] = await Promise.all([
    listBoardMembers(typedLocale),
    getSiteSettings(typedLocale),
  ])

  return (
    <>
      <PageHeader title={t('nav.about')} subtitle={settings?.tagline ?? undefined} />

      <section className="container-page py-16">
        <h2 className="text-2xl">{t('about.boardTitle')}</h2>

        <ul className="mt-8 grid gap-5 md:grid-cols-2">
          {members.map((member, i) => {
            const photo = mediaUrl(member.photo, 'card')
            return (
              <Reveal key={member.id} delay={0.05 * (i % 6)} as="li">
                <article className="flex h-full gap-5 rounded-card border border-white/10 bg-night-850/60 p-6">
                  <div className="relative size-20 shrink-0 overflow-hidden rounded-full bg-night-800">
                    {photo ? (
                      <Image src={photo.url} alt="" fill sizes="80px" className="object-cover" />
                    ) : (
                      <StarMark className="absolute inset-0 m-auto size-8 text-night-600" />
                    )}
                  </div>

                  <div>
                    <h3 className="text-lg">{member.name}</h3>
                    {member.role && (
                      <p className="text-sm font-semibold text-star-300">{member.role}</p>
                    )}
                    {member.bio && (
                      <p className="mt-3 text-sm leading-relaxed text-cream-50/70">{member.bio}</p>
                    )}
                  </div>
                </article>
              </Reveal>
            )
          })}
        </ul>
      </section>
    </>
  )
}
