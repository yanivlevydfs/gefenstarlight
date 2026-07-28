'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'motion/react'
import { Heart, Menu, X } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { StarMark } from '@/components/site/star-mark'
import { Starfield } from '@/components/site/starfield'
import { LocaleSwitcher } from '@/components/site/locale-switcher'
import { defaultNav, localeHref, navFromGlobal, type NavItem } from '@/lib/nav'
import type { Locale } from '@/i18n/routing'

type Props = {
  navigation: unknown
  /**
   * Only the name, never the settings object. A client component's props are
   * serialised into every page, so passing the whole record would publish the
   * contact addresses and phone numbers in the markup.
   */
  organisationName?: string
  locale: Locale
  /** Photograph shown faintly behind the menu, when the CMS has one. */
  backdrop?: string
}

export function SiteHeader({ navigation, organisationName, locale, backdrop }: Props) {
  const t = useTranslations()
  const pathname = usePathname()
  // The menu is open only for the route it was opened on, so navigating away
  // closes it without an effect that would trigger a cascading render.
  const [openedAt, setOpenedAt] = useState<string | null>(null)
  const open = openedAt === pathname
  const setOpen = (next: boolean) => setOpenedAt(next ? pathname : null)

  const [scrolled, setScrolled] = useState(false)

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

  const primary = items.filter((item) => !item.highlight)
  const donate = items.find((item) => item.highlight)
  const orgName = organisationName || t('meta.siteName')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const isActive = (href: string) => {
    const full = localeHref(href, locale)
    return href === '/' ? pathname === full : pathname.startsWith(full)
  }

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:start-3 focus:z-100 focus:rounded-full focus:bg-star-400 focus:px-5 focus:py-2 focus:font-semibold focus:text-night-950"
      >
        {t('nav.skipToContent')}
      </a>

      <header
        className={`sticky top-0 z-50 transition-all duration-500 ${
          scrolled ? 'glass border-b border-white/10 py-2' : 'border-b border-transparent py-4'
        }`}
      >
        <div className="container-page flex items-center gap-4">
          <Link
            href={localeHref('/', locale)}
            className="group flex shrink-0 items-center gap-3"
            aria-label={orgName}
          >
            <StarMark className="size-9 text-star-400 transition-transform duration-500 group-hover:rotate-12" />
            <span className="hidden font-display text-lg leading-tight font-bold sm:block">
              {orgName}
            </span>
          </Link>

          <nav className="mx-auto hidden items-center gap-1 lg:flex" aria-label={t('nav.menu')}>
            {primary.slice(0, 7).map((item) => (
              <Link
                key={item.href}
                href={localeHref(item.href, locale)}
                aria-current={isActive(item.href) ? 'page' : undefined}
                className={`relative rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? 'text-star-300'
                    : 'text-cream-50/75 hover:text-cream-50'
                }`}
              >
                {item.label}
                {isActive(item.href) && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-x-3 -bottom-0.5 h-px bg-star-400"
                  />
                )}
              </Link>
            ))}
          </nav>

          <div className="ms-auto flex items-center gap-2 lg:ms-0">
            <LocaleSwitcher locale={locale} />

            {donate && (
              <Link
                href={localeHref(donate.href, locale)}
                className="hidden items-center gap-2 rounded-full bg-star-400 px-5 py-2.5 text-sm font-bold text-night-950 shadow-lg shadow-star-500/25 transition hover:bg-star-300 hover:shadow-star-400/40 sm:inline-flex"
              >
                <Heart className="size-4" aria-hidden />
                {donate.label}
              </Link>
            )}

            <button
              type="button"
              onClick={() => setOpen(true)}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2.5 text-sm font-medium transition hover:border-star-400/60 hover:text-star-300"
              aria-expanded={open}
              aria-haspopup="dialog"
            >
              <Menu className="size-4" aria-hidden />
              <span className="hidden sm:inline">{t('nav.menu')}</span>
              <span className="sr-only sm:hidden">{t('nav.openMenu')}</span>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <MegaMenu
            items={items}
            locale={locale}
            backdrop={backdrop}
            onClose={() => setOpen(false)}
            closeLabel={t('nav.closeMenu')}
            title={t('nav.menu')}
          />
        )}
      </AnimatePresence>
    </>
  )
}

function MegaMenu({
  items,
  locale,
  backdrop,
  onClose,
  closeLabel,
  title,
}: {
  items: NavItem[]
  locale: Locale
  backdrop?: string
  onClose: () => void
  closeLabel: string
  title: string
}) {
  const panel = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // A modal dialog owns the keyboard: focus moves into it on open, Tab wraps
    // inside it, and Escape (or closing) hands focus back to the menu button.
    // Without this, Tab kept walking the page underneath the overlay.
    const opener = document.activeElement as HTMLElement | null

    const focusables = () =>
      Array.from(
        panel.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      )

    focusables()[0]?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') return onClose()
      if (e.key !== 'Tab') return

      const list = focusables()
      if (list.length === 0) return
      const first = list[0]
      const last = list[list.length - 1]
      const active = document.activeElement

      if (e.shiftKey && (active === first || !panel.current?.contains(active))) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && (active === last || !panel.current?.contains(active))) {
        e.preventDefault()
        first.focus()
      }
    }

    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      opener?.focus()
    }
  }, [onClose])

  return (
    <motion.div
      ref={panel}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-100"
    >
      {/*
        Gefen's portrait and the starfield sit behind the menu, in a layer of
        their own that never scrolls.

        The blur has to live on its own element too: a backdrop filter makes an
        element the containing block for fixed descendants, so putting it on the
        wrapper pinned the background to the scroller and the portrait stopped
        partway down a long menu.
      */}
      <div className="absolute inset-0 bg-night-950/95 backdrop-blur-xl" aria-hidden />
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        {backdrop && (
          <Image src={backdrop} alt="" fill sizes="100vw" className="object-cover opacity-15" />
        )}
        <div className="aurora absolute inset-0" />
        <Starfield />
      </div>

      <div className="absolute inset-0 overflow-y-auto">
        <div className="container-page py-6">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2.5 text-sm transition hover:border-star-400/60 hover:text-star-300"
            >
              <X className="size-4" aria-hidden />
              {closeLabel}
            </button>
          </div>

          <ul className="mt-8 grid gap-4 pb-16 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item, index) => (
              <motion.li
                key={item.href}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.03 * index, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link
                  href={localeHref(item.href, locale)}
                  className={`group relative flex h-40 flex-col justify-end overflow-hidden rounded-card border p-5 transition-colors ${
                    item.highlight
                      ? 'border-star-400/50 bg-star-400/10 hover:border-star-300'
                      : 'border-white/10 bg-night-850/60 hover:border-star-400/40'
                  }`}
                >
                  {item.image ? (
                    <Image
                      src={item.image.url}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="object-cover opacity-35 transition duration-700 group-hover:scale-105 group-hover:opacity-55"
                    />
                  ) : (
                    <span
                      aria-hidden
                      className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_120%,var(--color-night-700),transparent_70%)] opacity-70 transition group-hover:opacity-100"
                    />
                  )}

                  <span className="relative">
                    <span className="block font-display text-2xl font-bold">{item.label}</span>
                    {item.description && (
                      <span className="mt-1 block text-sm text-cream-50/70">
                        {item.description}
                      </span>
                    )}
                  </span>
                </Link>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  )
}
