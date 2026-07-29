/**
 * Publishes the accessibility statement and the privacy policy.
 *
 * Both are ordinary `pages` documents, so once they exist the owner edits
 * every word of them in the admin console — this script only puts the first
 * draft in place, the same way the seed does for the terms page. Re-running it
 * updates the copy from `content/pages.ts`, so it is safe to run twice.
 *
 *   node --env-file=.env.production.local --import tsx src/scripts/add-legal-pages.ts
 */
export {}

const { getPayload } = await import('payload')
const { default: config } = await import('../payload.config.js')
const { pages } = await import('./content/pages.js')
const { toLexical } = await import('./lexical.js')

const payload = await getPayload({ config })

const WANTED = ['accessibility', 'privacy']

for (const page of pages.filter((p) => WANTED.includes(p.slug))) {
  const existing = await payload.find({
    collection: 'pages',
    limit: 1,
    where: { slug: { equals: page.slug } },
  })

  const heData = {
    title: page.he.title,
    slug: page.slug,
    subtitle: page.he.subtitle,
    body: toLexical(page.he.body ?? [], 'rtl'),
    legacyPaths: page.legacyPaths.map((path) => ({ path })),
    _status: 'published' as const,
  }

  const doc = existing.docs[0]
    ? await payload.update({
        collection: 'pages',
        id: existing.docs[0].id,
        locale: 'he',
        data: heData,
      })
    : await payload.create({ collection: 'pages', locale: 'he', data: heData })

  await payload.update({
    collection: 'pages',
    id: doc.id,
    locale: 'en',
    data: {
      title: page.en.title,
      subtitle: page.en.subtitle,
      body: toLexical(page.en.body ?? [], 'ltr'),
      _status: 'published' as const,
    },
  })

  console.log(`${page.slug}: ${existing.docs[0] ? 'updated' : 'published'} (id ${doc.id})`)
}

console.log('done')
process.exit(0)
