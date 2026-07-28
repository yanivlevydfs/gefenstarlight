'use client'

import { useEffect } from 'react'

/**
 * Catches anything thrown while rendering a page, so a visitor sees a styled
 * screen with a way out instead of Next's unstyled default. Runs outside the
 * i18n provider guarantee, so the copy is static in both languages rather
 * than translated.
 */
export default function FrontendError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[frontend] page failed to render:', error)
  }, [error])

  return (
    <section className="relative isolate grid min-h-[70vh] place-items-center overflow-hidden">
      <div className="aurora absolute inset-0 -z-10" />

      <div className="container-page text-center">
        <p className="font-display text-7xl text-star-400/60">:(</p>
        <h1 className="mt-4 text-3xl sm:text-4xl" dir="rtl" lang="he">
          משהו השתבש
        </h1>
        <p className="mx-auto mt-4 max-w-md text-cream-50/70" dir="rtl" lang="he">
          אירעה שגיאה בטעינת העמוד. אפשר לנסות שוב.
        </p>
        <p className="mx-auto mt-2 max-w-md text-cream-50/50" dir="ltr" lang="en">
          Something went wrong loading this page. Please try again.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-9 inline-flex rounded-full bg-star-400 px-7 py-3 font-bold text-nightfall transition hover:bg-star-hover"
        >
          <span lang="he">לנסות שוב</span>
          <span aria-hidden>&nbsp;·&nbsp;</span>
          <span lang="en">Try again</span>
        </button>
      </div>
    </section>
  )
}
