import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react'

import { StarMark } from '@/components/site/star-mark'
import { defaultNav, localeHref, navFromGlobal } from '@/lib/nav'
import type { Locale } from '@/i18n/routing'

type Settings = {
  organisationName?: string
  legalName?: string
  tagline?: string
  address?: string
  whatsapp?: string
  emails?: { email?: string }[]
  phones?: { number?: string; label?: string }[]
} | null

export async function SiteFooter({
  navigation,
  settings,
  locale,
}: {
  navigation: unknown
  settings: unknown
  locale: Locale
}) {
  const t = await getTranslations()
  const s = settings as Settings

  const items = navFromGlobal(
    navigation,
    defaultNav({
      home: t('nav.home'),
      gefen: t('nav.gefen'),
      about: t('nav.about'),
      projects: t('nav.projects'),
      gallery: t('nav.gallery'),
      videos: t('nav.videos'),
      news: t('nav.news'),
      thanks: t('nav.thanks'),
      contact: t('nav.contact'),
      donate: t('nav.donate'),
    }),
  )

  const orgName = s?.organisationName || t('meta.siteName')
  const emails = s?.emails?.map((e) => e.email).filter(Boolean) ?? []
  const phones = s?.phones ?? []

  return (
    <footer className="mt-24 border-t border-white/10 bg-night-900">
      <div className="container-page grid gap-10 py-14 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-3">
            <StarMark className="size-8 text-star-400" />
            <span className="font-display text-xl font-bold">{orgName}</span>
          </div>
          {s?.tagline && <p className="mt-3 max-w-xs text-sm text-cream-50/65">{s.tagline}</p>}
          <p className="mt-6 text-sm text-cream-50/45">{t('footer.builtWith')}</p>
        </div>

        <nav aria-label={t('footer.navTitle')}>
          <h2 className="font-display text-sm tracking-wide text-star-300 uppercase">
            {t('footer.navTitle')}
          </h2>
          <ul className="mt-4 grid grid-cols-2 gap-y-2 text-sm">
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={localeHref(item.href, locale)}
                  className="text-cream-50/70 transition hover:text-star-300"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="font-display text-sm tracking-wide text-star-300 uppercase">
            {t('footer.contactTitle')}
          </h2>
          <ul className="mt-4 space-y-3 text-sm">
            {s?.address && (
              <li className="flex items-start gap-2.5 text-cream-50/70">
                <MapPin className="mt-0.5 size-4 shrink-0 text-star-400" aria-hidden />
                <span>{s.address}</span>
              </li>
            )}
            {emails.map((email) => (
              <li key={email}>
                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-2.5 text-cream-50/70 transition hover:text-star-300"
                >
                  <Mail className="size-4 shrink-0 text-star-400" aria-hidden />
                  <span dir="ltr">{email}</span>
                </a>
              </li>
            ))}
            {phones.map((phone) => (
              <li key={phone.number}>
                <a
                  href={`tel:${phone.number}`}
                  className="flex items-center gap-2.5 text-cream-50/70 transition hover:text-star-300"
                >
                  <Phone className="size-4 shrink-0 text-star-400" aria-hidden />
                  <span dir="ltr">{phone.number}</span>
                </a>
              </li>
            ))}
            {s?.whatsapp && (
              <li>
                <a
                  href={`https://wa.me/${s.whatsapp}`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="flex items-center gap-2.5 text-cream-50/70 transition hover:text-star-300"
                >
                  <MessageCircle className="size-4 shrink-0 text-star-400" aria-hidden />
                  <span>{t('actions.whatsapp')}</span>
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-5">
        <p className="container-page text-center text-xs text-cream-50/45">
          © {new Date().getFullYear()} {s?.legalName || orgName} · {t('footer.rights')}
        </p>
      </div>
    </footer>
  )
}
