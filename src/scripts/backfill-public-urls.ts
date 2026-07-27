/**
 * Records the absolute CDN address of every uploaded file.
 *
 * Payload only builds Blob URLs while its storage plugin is active, so a
 * deployment without the Blob token serves image paths that resolve to nothing.
 * Capturing the addresses here means the site never depends on that.
 *
 *   BLOB_READ_WRITE_TOKEN=... DATABASE_URI=... \
 *     node --import tsx src/scripts/backfill-public-urls.ts
 */
export {}

const { getPayload } = await import('payload')
const { default: config } = await import('../payload.config.js')

if (!process.env.BLOB_READ_WRITE_TOKEN) {
  console.error('BLOB_READ_WRITE_TOKEN must be set, otherwise there are no CDN URLs to record.')
  process.exit(1)
}

const payload = await getPayload({ config })

let updated = 0
let skipped = 0
let page = 1

for (;;) {
  const { docs, hasNextPage } = await payload.find({
    collection: 'media',
    limit: 50,
    page,
    depth: 0,
  })
  if (docs.length === 0) break

  for (const doc of docs) {
    if (!doc.url?.startsWith('http')) {
      skipped++
      continue
    }

    const publicSizes: Record<string, string> = {}
    for (const [name, variant] of Object.entries(doc.sizes ?? {})) {
      const url = (variant as { url?: string | null } | undefined)?.url
      if (url?.startsWith('http')) publicSizes[name] = url
    }

    await payload.update({
      collection: 'media',
      id: doc.id,
      data: { publicUrl: doc.url, publicSizes },
    })
    updated++
  }

  console.log(`  page ${page}: ${updated} recorded, ${skipped} skipped`)
  if (!hasNextPage) break
  page++
}

console.log(`done — ${updated} media documents now carry an absolute URL (${skipped} skipped)`)
process.exit(0)
