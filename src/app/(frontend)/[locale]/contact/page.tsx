import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { hasLocale } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react'

import { ContactForm } from '@/components/site/contact-form'
import { PageHeader } from '@/components/site/page-header'
import { Reveal } from '@/components/site/reveal'
import { routing, type Locale } from '@/i18n/routing'
import { getSiteSettings } from '@/lib/payload'
import { issueFormToken } from '@/lib/spam'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) return {}
  const t = await getTranslations({ locale, namespace: 'contact' })
  return { title: t('title'), description: t('subtitle') }
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)

  const t = await getTranslations()
  const settings = await getSiteSettings(locale as Locale)

  const emails = settings?.emails?.map((e) => e.email).filter(Boolean) ?? []
  const phones = settings?.phones ?? []

  return (
    <>
      <PageHeader title={t('contact.title')} subtitle={t('contact.subtitle')} />

      <div className="container-page grid gap-12 py-16 lg:grid-cols-[1fr_1.2fr]">
        <Reveal>
          <div className="space-y-6">
            {settings?.address && (
              <Detail icon={<MapPin className="size-5" />} label={t('contact.address')}>
                {settings.address}
              </Detail>
            )}

            {emails.length > 0 && (
              <Detail icon={<Mail className="size-5" />} label={t('contact.email')}>
                <ul className="space-y-1">
                  {emails.map((email) => (
                    <li key={email}>
                      <a
                        href={`mailto:${email}`}
                        dir="ltr"
                        className="transition hover:text-star-300"
                      >
                        {email}
                      </a>
                    </li>
                  ))}
                </ul>
              </Detail>
            )}

            {phones.length > 0 && (
              <Detail icon={<Phone className="size-5" />} label={t('contact.phone')}>
                <ul className="space-y-1">
                  {phones.map((phone) => (
                    <li key={phone.id ?? phone.number}>
                      <a
                        href={`tel:${phone.number.replace(/[^+\d]/g, '')}`}
                        dir="ltr"
                        className="transition hover:text-star-300"
                      >
                        {phone.number}
                      </a>
                    </li>
                  ))}
                </ul>
              </Detail>
            )}

            {settings?.whatsapp && (
              <a
                href={`https://wa.me/${settings.whatsapp}`}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 font-medium transition hover:border-star-400/60 hover:text-star-300"
              >
                <MessageCircle className="size-5" aria-hidden />
                {t('actions.whatsapp')}
              </a>
            )}
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="rounded-card border border-white/10 bg-night-850/60 p-7">
            <h2 className="text-2xl">{t('contact.formTitle')}</h2>
            <div className="mt-6">
              <ContactForm locale={locale} token={issueFormToken()} />
            </div>
          </div>
        </Reveal>
      </div>
    </>
  )
}

function Detail({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex gap-4">
      <span className="mt-0.5 text-star-400" aria-hidden>
        {icon}
      </span>
      <div>
        <h2 className="font-display text-sm tracking-wide text-star-300 uppercase">{label}</h2>
        <div className="mt-1.5 text-cream-50/80">{children}</div>
      </div>
    </div>
  )
}
