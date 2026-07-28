'use server'

import { headers } from 'next/headers'
import { z } from 'zod'

import { sendEnquiryNotification } from '@/lib/email'
import { getPayloadClient, getSiteSettings } from '@/lib/payload'
import { assessSubmission, RATE_LIMIT, senderKey } from '@/lib/spam'
import type { Locale } from '@/i18n/routing'

const schema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.email().max(200),
  phone: z.string().trim().max(40).optional(),
  message: z.string().trim().min(5).max(5000),
  locale: z.string().max(5),
  token: z.string().max(80).optional(),
  // Hidden from people; only automation fills it in. Deliberately accepts any
  // value: rejecting it at the schema would answer with the visible error state
  // and tell a bot exactly which check caught it. Instead the value flows into
  // the spam score, which refuses it behind a fake success.
  website: z.string().max(200).optional(),
})

export type ContactState = { status: 'idle' | 'success' | 'error' }

/**
 * The visitor's address. `x-vercel-forwarded-for` is set by the platform and
 * cannot be supplied by the client, so it is preferred — a spammer who mints a
 * fresh `x-forwarded-for` per request would otherwise get a fresh rate-limit
 * bucket each time.
 */
async function clientIp(): Promise<string | null> {
  const list = await headers()
  return (
    list.get('x-vercel-forwarded-for')?.split(',')[0]?.trim() ||
    list.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    list.get('x-real-ip') ||
    null
  )
}

/**
 * Records a contact-form submission and notifies the foundation.
 *
 * The enquiry is stored before the email is attempted, so a mail failure never
 * loses a message. Spam is scored server-side — see lib/spam.ts — and anything
 * that fails is answered as though it succeeded, so a bot learns nothing about
 * which of its attempts got through.
 */
export async function submitEnquiry(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const parsed = schema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone') || undefined,
    message: formData.get('message'),
    locale: formData.get('locale'),
    token: formData.get('token') || undefined,
    website: formData.get('website') || undefined,
  })

  if (!parsed.success) return { status: 'error' }
  const data = parsed.data

  try {
    const payload = await getPayloadClient()
    const ip = await clientIp()
    const key = senderKey(ip)

    // How many times has this sender written recently? Only counted when the
    // sender is actually identifiable — with no IP header every visitor shares
    // one bucket, and a handful of genuine messages would lock out the world.
    const since = new Date(Date.now() - RATE_LIMIT.windowMs).toISOString()
    const recent = ip
      ? await payload.count({
          collection: 'enquiries',
          overrideAccess: true,
          where: { and: [{ senderKey: { equals: key } }, { createdAt: { greater_than: since } }] },
        })
      : { totalDocs: 0 }

    // A sender already over the limit gets the fake success without a write —
    // otherwise a looping bot fills the database and buries the owner's
    // enquiries view under thousands of rows. The first over-limit submissions
    // were already recorded above the threshold, so nothing is lost.
    if (recent.totalDocs > RATE_LIMIT.max) {
      console.warn('[contact] rate limit exceeded, submission dropped')
      return { status: 'success' }
    }

    const assessment = assessSubmission({
      name: data.name,
      email: data.email,
      message: data.message,
      honeypot: data.website,
      token: data.token ?? null,
      recentFromSender: recent.totalDocs,
    })

    // Refused submissions are still recorded, marked as spam, so the owner can
    // see what was blocked and correct a false positive.
    const enquiry = await payload.create({
      collection: 'enquiries',
      overrideAccess: true,
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        message: data.message,
        locale: data.locale,
        senderKey: key,
        spamScore: assessment.score,
        status: assessment.reject ? 'spam' : 'new',
        emailSent: false,
      },
    })

    if (assessment.reject) {
      console.warn('[contact] refused a submission:', assessment.reasons.join('; '))
      // Answered as a success on purpose: telling a bot it was caught only
      // teaches it which check to defeat next.
      return { status: 'success' }
    }

    const settings = await getSiteSettings(data.locale as Locale)
    const recipients = (settings?.emails ?? [])
      .map((entry) => entry.email)
      .filter((email): email is string => Boolean(email))

    const { sent, error } = await sendEnquiryNotification(
      { ...data, phone: data.phone },
      recipients,
    )
    if (!sent) console.warn('[contact] notification not sent:', error)

    // Record whether the owner was actually told, so a silent mail failure is
    // visible in the admin console rather than assumed.
    await payload.update({
      collection: 'enquiries',
      id: enquiry.id,
      overrideAccess: true,
      data: { emailSent: sent },
    })

    return { status: 'success' }
  } catch (error) {
    console.error('[contact] failed to store enquiry:', (error as Error).message)
    return { status: 'error' }
  }
}
