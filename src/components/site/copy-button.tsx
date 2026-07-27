'use client'

import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { useTranslations } from 'next-intl'

/** Copies a bank detail to the clipboard and confirms it did. */
export function CopyButton({ value }: { value: string }) {
  const t = useTranslations('actions')
  const [copied, setCopied] = useState(false)

  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value)
          setCopied(true)
          setTimeout(() => setCopied(false), 2000)
        } catch {
          // Clipboard denied — the value is on screen either way.
        }
      }}
      aria-label={copied ? t('copied') : t('copy')}
      className="rounded-md p-1.5 text-cream-50/45 transition hover:bg-white/5 hover:text-star-300"
    >
      {copied ? (
        <Check className="size-4 text-star-300" aria-hidden />
      ) : (
        <Copy className="size-4" aria-hidden />
      )}
    </button>
  )
}
