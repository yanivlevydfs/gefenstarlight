import Link from 'next/link'
import { getLocale, getTranslations } from 'next-intl/server'

import { Starfield } from '@/components/site/starfield'

export default async function NotFound() {
  const t = await getTranslations('errors')
  const locale = await getLocale()

  return (
    <section className="relative isolate grid min-h-[70vh] place-items-center overflow-hidden">
      <div className="aurora absolute inset-0 -z-10" />
      <Starfield />

      <div className="container-page text-center">
        <p className="font-display text-7xl text-star-400/60">404</p>
        <h1 className="mt-4 text-3xl sm:text-4xl">{t('notFoundTitle')}</h1>
        <p className="mx-auto mt-4 max-w-md text-cream-50/70">{t('notFoundBody')}</p>
        <Link
          href={`/${locale}`}
          className="mt-9 inline-flex rounded-full bg-star-400 px-7 py-3 font-bold text-night-950 transition hover:bg-star-300"
        >
          {t('backHome')}
        </Link>
      </div>
    </section>
  )
}
