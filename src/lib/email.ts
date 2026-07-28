import 'server-only'

/**
 * Sends the notification for a contact-form submission through Resend.
 *
 * Delivery is best-effort: the enquiry is always stored first, so a mail outage
 * or a missing API key never loses somebody's message. The admin console shows
 * whether the notification went out.
 */

type Enquiry = {
  name: string
  email: string
  phone?: string
  message: string
  locale: string
}

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

export async function sendEnquiryNotification(
  enquiry: Enquiry,
  recipients: string[],
): Promise<{ sent: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return { sent: false, error: 'RESEND_API_KEY is not set' }
  if (recipients.length === 0) return { sent: false, error: 'no recipients configured' }

  // Resend only accepts a verified sender domain; until one is set up their
  // shared address works and still delivers.
  const from = process.env.RESEND_FROM || 'Gefen Starlight <onboarding@resend.dev>'
  const rtl = enquiry.locale === 'he'

  try {
    const { Resend } = await import('resend')
    const resend = new Resend(apiKey)

    const { error } = await resend.emails.send({
      from,
      to: recipients,
      // Replying in the mail client goes straight back to the sender.
      replyTo: enquiry.email,
      subject: `פנייה חדשה מהאתר — ${enquiry.name}`,
      text: [
        `שם: ${enquiry.name}`,
        `דוא"ל: ${enquiry.email}`,
        enquiry.phone ? `טלפון: ${enquiry.phone}` : null,
        '',
        enquiry.message,
      ]
        .filter(Boolean)
        .join('\n'),
      html: `
        <div dir="${rtl ? 'rtl' : 'ltr'}" style="font-family:system-ui,sans-serif;line-height:1.6;color:#1a1c26">
          <h2 style="margin:0 0 16px">פנייה חדשה מהאתר</h2>
          <p style="margin:0 0 4px"><strong>שם:</strong> ${escapeHtml(enquiry.name)}</p>
          <p style="margin:0 0 4px"><strong>דוא"ל:</strong> ${escapeHtml(enquiry.email)}</p>
          ${enquiry.phone ? `<p style="margin:0 0 4px"><strong>טלפון:</strong> ${escapeHtml(enquiry.phone)}</p>` : ''}
          <hr style="margin:16px 0;border:none;border-top:1px solid #e3d3b4" />
          <p style="white-space:pre-wrap;margin:0">${escapeHtml(enquiry.message)}</p>
        </div>
      `,
    })

    if (error) return { sent: false, error: error.message }
    return { sent: true }
  } catch (error) {
    return { sent: false, error: (error as Error).message }
  }
}
