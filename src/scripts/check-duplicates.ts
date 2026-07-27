/**
 * Looks for documents the importer may have created more than once.
 *
 *   node --import tsx src/scripts/check-duplicates.ts
 */
export {}

const { getPayload } = await import('payload')
const { default: config } = await import('../payload.config.js')

const payload = await getPayload({ config })

const collections = ['albums', 'projects', 'pages', 'articles'] as const

for (const collection of collections) {
  const { docs, totalDocs } = await payload.find({ collection, limit: 500, depth: 0, locale: 'he' })

  const bySlug = new Map<string, number>()
  for (const doc of docs) {
    const slug = String((doc as { slug?: string }).slug ?? '(no slug)')
    bySlug.set(slug, (bySlug.get(slug) ?? 0) + 1)
  }

  const dupes = [...bySlug.entries()].filter(([, count]) => count > 1)
  console.log(`\n${collection}: ${totalDocs} documents, ${bySlug.size} distinct slugs`)
  if (dupes.length) {
    for (const [slug, count] of dupes) console.log(`   DUPLICATE  ${slug} x${count}`)
  } else {
    console.log('   no duplicates')
  }
}

// Media: duplicates show up as the same source file imported twice.
const media = await payload.find({ collection: 'media', limit: 1000, depth: 0 })
const bySource = new Map<string, number>()
let noSource = 0
for (const doc of media.docs) {
  const key = (doc as { sourceFile?: string | null }).sourceFile
  if (!key) {
    noSource++
    continue
  }
  bySource.set(key, (bySource.get(key) ?? 0) + 1)
}
const mediaDupes = [...bySource.entries()].filter(([, count]) => count > 1)
console.log(`\nmedia: ${media.totalDocs} documents, ${bySource.size} distinct source files`)
console.log(`   without a source file: ${noSource}`)
if (mediaDupes.length) {
  for (const [file, count] of mediaDupes.slice(0, 20)) console.log(`   DUPLICATE  ${file} x${count}`)
} else {
  console.log('   no duplicates')
}

// Albums pointing at the same media set would also read as duplicates.
const albums = await payload.find({ collection: 'albums', limit: 100, depth: 0, locale: 'he' })
console.log('\nalbum contents:')
for (const album of albums.docs) {
  const items = (album as { items?: unknown[] }).items ?? []
  console.log(`   ${String(album.slug).padEnd(28)} ${items.length} items`)
}

process.exit(0)
