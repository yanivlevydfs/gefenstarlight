'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { useTranslations } from 'next-intl'
import { Check, Send } from 'lucide-react'

import { submitEnquiry, type ContactState } from '@/app/(frontend)/[locale]/contact/actions'

const fieldClass =
  'w-full rounded-xl border border-white/12 bg-night-900/60 px-4 py-3 text-cream-50 placeholder:text-cream-50/35 transition focus:border-star-400/70 focus:outline-none'

export function ContactForm({ locale }: { locale: string }) {
  const t = useTranslations('contact')
  const [state, formAction] = useActionState<ContactState, FormData>(submitEnquiry, {
    status: 'idle',
  })

  if (state.status === 'success') {
    return (
      <div className="flex items-start gap-3 rounded-card border border-star-400/40 bg-star-400/10 p-6">
        <Check className="mt-0.5 size-5 shrink-0 text-star-300" aria-hidden />
        <p className="text-cream-50/85">{t('success')}</p>
      </div>
    )
  }

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="locale" value={locale} />

      {/* Honeypot — hidden from people, tempting to bots. */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="absolute -left-[9999px] size-0 opacity-0"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-sm text-cream-50/70">{t('name')}</span>
          <input name="name" required minLength={2} className={fieldClass} autoComplete="name" />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm text-cream-50/70">{t('emailField')}</span>
          <input
            name="email"
            type="email"
            required
            dir="ltr"
            className={fieldClass}
            autoComplete="email"
          />
        </label>
      </div>

      <label className="block">
        <span className="mb-1.5 block text-sm text-cream-50/70">{t('phoneField')}</span>
        <input name="phone" type="tel" dir="ltr" className={fieldClass} autoComplete="tel" />
      </label>

      <label className="block">
        <span className="mb-1.5 block text-sm text-cream-50/70">{t('message')}</span>
        <textarea name="message" required minLength={5} rows={6} className={fieldClass} />
      </label>

      {state.status === 'error' && (
        <p role="alert" className="text-sm text-star-300">
          {t('error')}
        </p>
      )}

      <SubmitButton />
    </form>
  )
}

function SubmitButton() {
  const t = useTranslations('actions')
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center gap-2 rounded-full bg-star-400 px-7 py-3 font-bold text-night-950 transition hover:bg-star-300 disabled:opacity-60"
    >
      <Send className="flip-x size-4" aria-hidden />
      {pending ? t('sending') : t('send')}
    </button>
  )
}
