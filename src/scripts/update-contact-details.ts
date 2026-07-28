/**
 * Sets the foundation's published contact details to the only correct ones,
 * confirmed by the owner against the old site: one email, one mobile number.
 * (The address text was already right — it only displayed wrong.)
 *
 *   node --env-file=.env.production.local --import tsx src/scripts/update-contact-details.ts
 */
export {}

const { getPayload } = await import('payload')
const { default: config } = await import('../payload.config.js')

const payload = await getPayload({ config })

const emails = [{ email: 'aaviram1@012.net.il' }]
const number = '054-4249142'

await payload.updateGlobal({
  slug: 'site-settings',
  locale: 'he',
  data: { emails, phones: [{ number, label: 'נייד' }] },
})
await payload.updateGlobal({
  slug: 'site-settings',
  locale: 'en',
  data: { emails, phones: [{ number, label: 'Mobile' }] },
})

const check = await payload.findGlobal({ slug: 'site-settings', locale: 'he', depth: 0 })
console.log('emails:', JSON.stringify(check.emails))
console.log('phones:', JSON.stringify(check.phones))
console.log('address:', check.address)
console.log('done')
process.exit(0)
