/**
 * Completes the owner-created wine album: a cover (first bottle photo), so
 * the gallery list shows a preview, and English title + descriptions in both
 * languages, so the English site stops falling back to Hebrew.
 *
 *   node --env-file=.env.production.local --import tsx src/scripts/fix-wine-album.ts
 */
export {}

const { getPayload } = await import('payload')
const { default: config } = await import('../payload.config.js')

const payload = await getPayload({ config })

const found = await payload.find({
  collection: 'albums',
  limit: 1,
  locale: 'he',
  where: { slug: { equals: 'בקבוקי-היין' } },
})
const album = found.docs[0]
if (!album) {
  console.error('wine album not found')
  process.exit(1)
}

const items = (album.items ?? []).map((i) => (typeof i === 'object' && i ? i.id : i)) as number[]
const cover = (typeof album.cover === 'object' && album.cover ? album.cover.id : album.cover) ?? items[0]

await payload.update({
  collection: 'albums',
  id: album.id,
  locale: 'he',
  data: {
    cover,
    description: album.description ?? 'היינות של מיזם ההתרמה יין גפן — כל בקבוק תומך בפעילות העמותה.',
  },
})
await payload.update({
  collection: 'albums',
  id: album.id,
  locale: 'en',
  data: {
    title: 'Gefen Wine Bottles',
    description: 'The wines of the Gefen Wine fundraiser — every bottle supports the foundation.',
  },
})

const check = await payload.findByID({ collection: 'albums', id: album.id, locale: 'en', depth: 0 })
console.log('en title:', check.title, '| cover:', check.cover, '| desc:', (check.description ?? '').slice(0, 40))
console.log('done')
process.exit(0)
