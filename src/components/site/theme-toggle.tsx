'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Moon, Sun } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { THEME_COLORS, type Theme } from '@/lib/theme'

/** The saved choice, falling back to the system preference — the same rule as
 *  the pre-paint script in the locale layout. */
function resolveTheme(): Theme {
  try {
    const stored = localStorage.getItem('theme')
    if (stored === 'light' || stored === 'dark') return stored
  } catch {
    // Storage can be blocked (private browsing) — fall through.
  }
  return matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLORS[theme])
}

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
  const pathname = usePathname()

  // Changing route can re-render <html> — switching language rewrites its
  // lang/dir — and the reconciled element loses the data-theme attribute the
  // pre-paint script set. Re-assert the choice after every navigation.
  useEffect(() => {
    applyTheme(resolveTheme())
  }, [pathname])

  const toggle = () => {
    const next: Theme = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light'
    applyTheme(next)
    try {
      localStorage.setItem('theme', next)
    } catch {
      // Storage can be blocked (private browsing); the theme still switches.
    }
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
