import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { hasLocale } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Banknote, ExternalLink, Globe2, Heart, Repeat, ShieldCheck } from 'lucide-react'

import { CopyButton } from '@/components/site/copy-button'
import { JsonLd } from '@/components/site/json-ld'
import { PageHeader } from '@/components/site/page-header'
import { Reveal } from '@/components/site/reveal'
import { routing, type Locale } from '@/i18n/routing'
import { getSiteSettings } from '@/lib/payload'
import { breadcrumbSchema, donateSchema, pageMetadata } from '@/lib/seo'

type Tier = {
  label?: string
  amount?: number
  url?: string
  kind?: 'oneTime' | 'monthly' | 'custom'
}

type Settings = {
  donationIntro?: string
  taxNote?: string
  donationTiers?: Tier[]
  bank?: { accountName?: string; bankName?: string; branch?: string; account?: string }
  international?: { beneficiary?: string; swift?: string; iban?: string }
} | null

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) return {}
  const t = await getTranslations({ locale, namespace: 'donate' })
  const settings = await getSiteSettings(locale as Locale)
  return pageMetadata({
    locale: locale as Locale,
    path: '/donate',
    title: t('title'),
    description: settings?.donationIntro ?? undefined,
  })
}

export default async function DonatePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)

  const t = await getTranslations()
  const settings = (await getSiteSettings(locale as Locale)) as Settings

  const tiers = settings?.donationTiers ?? []
  const oneTime = tiers.filter((tier) => tier.kind === 'oneTime' && tier.url)
  const monthly = tiers.find((tier) => tier.kind === 'monthly' && tier.url)
  const custom = tiers.find((tier) => tier.kind === 'custom' && tier.url)

  const bank = settings?.bank
  const intl = settings?.international

  return (
    <>
      <JsonLd
        data={[
          donateSchema(locale as Locale, t('donate.title')),
          breadcrumbSchema(locale as Locale, [
            { name: t('nav.home'), path: '' },
            { name: t('nav.donate'), path: '/donate' },
          ]),
        ]}
      />
      <PageHeader title={t('donate.title')} subtitle={settings?.donationIntro} />

      <div className="container-page grid gap-12 py-16 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-12">
          {/* ------------------------------------------------ one-off amounts */}
          {oneTime.length > 0 && (
            <section>
              <Reveal>
                <h2 className="flex items-center gap-2.5 text-2xl">
                  <Heart className="size-6 text-star-400" aria-hidden />
                  {t('donate.onlineTitle')}
                </h2>
              </Reveal>

              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {oneTime.map((tier, i) => (
                  <Reveal key={tier.url} delay={0.05 * i} as="li">
                    <a
                      href={tier.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="group flex items-center justify-between gap-3 rounded-card border border-white/12 bg-night-850/60 px-6 py-5 transition hover:border-star-400/60 hover:bg-night-800"
                    >
                      <span className="font-display text-2xl font-bold text-star-300">
                        {tier.amount ? t('donate.amount', { amount: tier.amount }) : tier.label}
                      </span>
                      <ExternalLink
                        className="size-4 text-cream-50/40 transition group-hover:text-star-300"
                        aria-hidden
                      />
                    </a>
                  </Reveal>
                ))}
              </ul>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {monthly && (
                  <Reveal delay={0.2}>
                    <a
                      href={monthly.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="flex h-full flex-col justify-between gap-3 rounded-card border border-star-400/50 bg-star-400/10 px-6 py-5 transition hover:border-star-300 hover:bg-star-400/15"
                    >
                      <span className="flex items-center gap-2 font-bold text-star-200">
                        <Repeat className="size-5" aria-hidden />
                        {monthly.label || t('donate.monthlyTitle')}
                      </span>
                      <span className="text-sm text-cream-50/70">{t('donate.monthlyNote')}</span>
                    </a>
                  </Reveal>
                )}

                {custom && (
                  <Reveal delay={0.26}>
                    <a
                      href={custom.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="flex h-full flex-col justify-between gap-3 rounded-card border border-white/12 bg-night-850/60 px-6 py-5 transition hover:border-star-400/60"
                    >
                      <span className="font-bold">{custom.label || t('donate.customTitle')}</span>
                      <span className="text-sm text-cream-50/70">{t('donate.customTitle')}</span>
                    </a>
                  </Reveal>
                )}
              </div>

              <p className="mt-5 flex items-start gap-2 text-sm text-cream-50/55">
                <ShieldCheck className="mt-0.5 size-4 shrink-0 text-star-400" aria-hidden />
                {t('donate.onlineNote')}
              </p>
            </section>
          )}

          {/* ---------------------------------------------------- bank details */}
          {bank?.account && (
            <section>
              <Reveal>
                <h2 className="flex items-center gap-2.5 text-2xl">
                  <Banknote className="size-6 text-star-400" aria-hidden />
                  {t('donate.bankTitle')}
                </h2>
              </Reveal>
              <p className="mt-2 text-sm text-cream-50/55">{t('donate.bankNote')}</p>

              <dl className="mt-5 divide-y divide-white/10 overflow-hidden rounded-card border border-white/10 bg-night-850/60">
                <Row label={t('donate.bankName')} value={bank.bankName} />
                <Row label={t('donate.branch')} value={bank.branch} copyable />
                <Row label={t('donate.account')} value={bank.account} copyable />
                <Row label={t('donate.accountName')} value={bank.accountName} />
              </dl>
            </section>
          )}

          {/* ------------------------------------------- international transfer */}
          {intl?.iban && (
            <section>
              <Reveal>
                <h2 className="flex items-center gap-2.5 text-2xl">
                  <Globe2 className="size-6 text-star-400" aria-hidden />
                  {t('donate.internationalTitle')}
                </h2>
              </Reveal>

              <dl className="mt-5 divide-y divide-white/10 overflow-hidden rounded-card border border-white/10 bg-night-850/60">
                <Row label={t('donate.beneficiary')} value={intl.beneficiary} />
                <Row label="SWIFT" value={intl.swift} copyable />
                <Row label="IBAN" value={intl.iban} copyable />
              </dl>
            </section>
          )}
        </div>

        {/* ------------------------------------------------------------ aside */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-card border border-white/10 bg-night-850/60 p-7">
            <h2 className="text-xl">{t('home.ctaTitle')}</h2>
            <p className="mt-3 leading-relaxed text-cream-50/70">{t('home.ctaBody')}</p>
            {settings?.taxNote && (
              <p className="mt-6 rounded-xl bg-night-800/70 p-4 text-sm text-cream-50/60">
                {settings.taxNote}
              </p>
            )}
          </div>
        </aside>
      </div>
    </>
  )
}

function Row({
  label,
  value,
  copyable,
}: {
  label: string
  value?: string
  copyable?: boolean
}) {
  if (!value) return null

  return (
    <div className="flex items-center justify-between gap-4 px-6 py-4">
      <dt className="text-sm text-cream-50/55">{label}</dt>
      <dd className="flex items-center gap-2 font-medium">
        <span dir="ltr">{value}</span>
        {copyable && <CopyButton value={value} />}
      </dd>
    </div>
  )
}
