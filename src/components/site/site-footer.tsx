import Image from 'next/image'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react'

import { CookiePreferences } from '@/components/site/cookie-preferences'
import { ProtectedContact } from '@/components/site/protected-contact'
import { ProtectedText } from '@/components/site/protected-text'
import { reverseValue } from '@/lib/contact'
import { StarMark } from '@/components/site/star-mark'
import { defaultNav, localeHref, navFromGlobal } from '@/lib/nav'
import type { Locale } from '@/i18n/routing'

const LEGAL_PAGES = [
  { href: '/accessibility', key: 'footer.accessibility' },
  { href: '/privacy', key: 'footer.privacy' },
  { href: '/terms', key: 'footer.terms' },
] as const

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
  const emails = (s?.emails ?? [])
    .map((entry) => entry.email)
    .filter((email): email is string => Boolean(email))
  const phones = (s?.phones ?? []).filter(
    (phone): phone is { number: string; label?: string } => Boolean(phone.number),
  )

  return (
    <footer className="mt-24 border-t border-white/10 bg-night-900">
      <div className="container-page grid gap-10 py-14 md:grid-cols-3">
        {/* The brand block reads as one centred unit: name, mark, tagline. */}
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-3">
            <StarMark className="size-8 text-star-400" />
            <span className="font-display text-xl font-bold">{orgName}</span>
          </div>
          {/* Two colourways of the same transparent mark: the brand blue on
              light surfaces, a starlight tint on the night sky. */}
          <div className="mt-5 w-28">
            <Image
              src="/logo-night.png"
              alt={orgName}
              width={293}
              height={447}
              sizes="120px"
              className="only-dark h-auto w-full"
            />
            <Image
              src="/logo.png"
              alt={orgName}
              width={293}
              height={447}
              sizes="120px"
              className="only-light h-auto w-full"
            />
          </div>
          {s?.tagline && <p className="mt-4 max-w-xs text-sm text-cream-50/65">{s.tagline}</p>}
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
                <ProtectedText value={s.address} />
              </li>
            )}
            {emails.map((email) => (
              <li key={email}>
                <ProtectedContact
                  reversed={reverseValue(email)}
                  scheme="mailto"
                  className="flex items-center gap-2.5 text-cream-50/70 transition hover:text-star-300"
                >
                  <Mail className="size-4 shrink-0 text-star-400" aria-hidden />
                </ProtectedContact>
              </li>
            ))}
            {phones.map((phone) => (
              <li key={phone.number}>
                <ProtectedContact
                  reversed={reverseValue(phone.number)}
                  scheme="tel"
                  className="flex items-center gap-2.5 text-cream-50/70 transition hover:text-star-300"
                >
                  <Phone className="size-4 shrink-0 text-star-400" aria-hidden />
                </ProtectedContact>
              </li>
            ))}
            {s?.whatsapp && (
              <li>
                <ProtectedContact
                  reversed={reverseValue(s.whatsapp)}
                  scheme="whatsapp"
                  label={t('actions.whatsapp')}
                  className="flex items-center gap-2.5 text-cream-50/70 transition hover:text-star-300"
                >
                  <MessageCircle className="size-4 shrink-0 text-star-400" aria-hidden />
                </ProtectedContact>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-5">
        <div className="container-page flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-center text-xs text-cream-50/45">
          <p>
            © {new Date().getFullYear()} {s?.legalName || orgName} · {t('footer.rights')}
          </p>
          {/* The legal pages the law expects to be reachable from every page.
              Each is an ordinary CMS page, so the owner edits the wording in
              the admin console; only the link lives here. */}
          {LEGAL_PAGES.map(({ href, key }) => (
            <Link
              key={href}
              href={localeHref(href, locale)}
              className="underline underline-offset-4 transition hover:text-star-300"
            >
              {t(key)}
            </Link>
          ))}
          <CookiePreferences />
        </div>
      </div>
    </footer>
  )
}
