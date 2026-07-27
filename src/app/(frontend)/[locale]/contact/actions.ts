'use server'

import { z } from 'zod'

import { getPayloadClient } from '@/lib/payload'

const schema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.email().max(200),
  phone: z.string().trim().max(40).optional(),
  message: z.string().trim().min(5).max(5000),
  locale: z.string().max(5),
  // Bots fill hidden fields; humans leave them empty.
  website: z.string().max(0).optional(),
})

export type ContactState = { status: 'idle' | 'success' | 'error' }

/** Stores a contact-form submission so it shows up in the admin console. */
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
    website: formData.get('website') || undefined,
  })

  if (!parsed.success) return { status: 'error' }

  // Silently accept honeypot hits so bots do not learn they were caught.
  if (parsed.data.website) return { status: 'success' }

  try {
    const payload = await getPayloadClient()
    await payload.create({
      collection: 'enquiries',
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone,
        message: parsed.data.message,
        locale: parsed.data.locale,
      },
    })
    return { status: 'success' }
  } catch (error) {
    console.error('[contact] failed to store enquiry:', (error as Error).message)
    return { status: 'error' }
  }
}
