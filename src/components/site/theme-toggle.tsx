'use client'

import { Moon, Sun } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { THEME_COLORS, type Theme } from '@/lib/theme'

/**
 * Switches between the night and daylight palettes by stamping
 * `data-theme` on <html>, which globals.css turns into a wholesale remap of
 * the colour variables. The choice is remembered in localStorage and applied
 * before first paint by the inline script in the locale layout.
 *
 * Both icons are always in the markup and CSS shows the right one, so the
 * server render never disagrees with a stored client preference.
 */
export function ThemeToggle() {
  const t = useTranslations('theme')

  const toggle = () => {
    const root = document.documentElement
    const next: Theme = root.dataset.theme === 'light' ? 'dark' : 'light'
    root.dataset.theme = next
    try {
      localStorage.setItem('theme', next)
    } catch {
      // Storage can be blocked (private browsing); the theme still switches.
    }
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', THEME_COLORS[next])
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={t('toggle')}
      title={t('toggle')}
      className="inline-flex items-center rounded-full border border-white/15 p-2.5 transition hover:border-star-400/60 hover:text-star-300"
    >
      <Sun className="theme-icon-sun size-4" aria-hidden />
      <Moon className="theme-icon-moon size-4" aria-hidden />
    </button>
  )
}
