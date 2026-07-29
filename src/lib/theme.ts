/**
 * Shared between the pre-paint script in the locale layout (server) and the
 * ThemeToggle (client), so the browser-chrome colour always matches the
 * `--color-night-950` surface of the active theme.
 */
export const THEME_COLORS = { dark: '#04060d', light: '#faf8f2' } as const

export type Theme = keyof typeof THEME_COLORS
