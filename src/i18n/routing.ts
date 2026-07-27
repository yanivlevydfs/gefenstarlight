import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['he', 'en'],
  defaultLocale: 'he',
  // Hebrew is the default but still carries its prefix, so `/he/...` and
  // `/en/...` are symmetrical and hreflang stays unambiguous.
  localePrefix: 'always',
})

export type Locale = (typeof routing.locales)[number]

/** Text direction per locale — drives `<html dir>` and logical CSS. */
export const localeDir: Record<Locale, 'rtl' | 'ltr'> = {
  he: 'rtl',
  en: 'ltr',
}

/** BCP-47 tags for `<html lang>`, hreflang and Intl formatting. */
export const localeTag: Record<Locale, string> = {
  he: 'he-IL',
  en: 'en',
}
