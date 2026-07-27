/**
 * Deletes every album and media document so the import can start clean.
 *
 * Needed because a media upload is matched by filename: when Payload renames an
 * upload (appending -1, -2 on collision) the next seed no longer recognises it
 * and uploads a second copy, leaving duplicates whose resized variants are
 * missing.
 *
 *   node --import tsx src/scripts/reset-media.ts --delete
 */
export {}

const { getPayload } = await import('payload')
const { default: config } = await import('../payload.config.js')

const payload = await getPayload({ config })

const albums = await payload.count({ collection: 'albums' })
const media = await payload.count({ collection: 'media' })
console.log(`albums: ${albums.totalDocs}, media: ${media.totalDocs}`)

if (!process.argv.includes('--delete')) {
  console.log('re-run with --delete to remove them')
  process.exit(0)
}

// Albums first: they hold the relationships to media.
await payload.delete({ collection: 'albums', where: { id: { exists: true } } })
console.log('albums deleted')

// Media in batches — deleting also removes the file from Blob storage.
let removed = 0
for (;;) {
  const { docs } = await payload.find({ collection: 'media', limit: 50, depth: 0 })
  if (docs.length === 0) break
  for (const doc of docs) {
    try {
      await payload.delete({ collection: 'media', id: doc.id })
      removed++
    } catch (error) {
      console.log(`  failed to delete ${doc.filename}: ${(error as Error).message}`)
      // Avoid an infinite loop on a document that refuses to go.
      await payload.update({
        collection: 'media',
        id: doc.id,
        data: { alt: '__undeletable__' },
      })
    }
  }
  console.log(`  removed ${removed}…`)
}

console.log(`done — removed ${removed} media documents`)
process.exit(0)
