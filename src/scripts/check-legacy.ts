import { getPayload } from 'payload'
import config from '../payload.config.js'

const payload = await getPayload({ config })

for (const collection of ['projects', 'pages', 'albums'] as const) {
  const { docs } = await payload.find({ collection, locale: 'he', limit: 50, depth: 0 })
  console.log(`\n--- ${collection} (${docs.length}) ---`)
  for (const doc of docs) {
    const paths = (doc as { legacyPaths?: { path?: string }[] }).legacyPaths ?? []
    console.log(`  ${String(doc.slug).padEnd(28)} legacyPaths=${JSON.stringify(paths.map((p) => p.path))}`)
  }
}

console.log('\n--- query test ---')
for (const p of ['/גלריה', '/פרויקט-1', '/אודות-גפן']) {
  for (const collection of ['projects', 'pages', 'albums'] as const) {
    const { docs } = await payload.find({
      collection,
      locale: 'he',
      depth: 0,
      limit: 1,
      where: { 'legacyPaths.path': { equals: p } },
    })
    if (docs[0]) console.log(`  ${p} -> ${collection}/${docs[0].slug}`)
  }
}

process.exit(0)
