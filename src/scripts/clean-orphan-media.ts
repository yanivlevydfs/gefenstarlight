/**
 * Removes media documents whose file never made it to storage.
 *
 * A failed upload can still leave the database row behind, and because the seed
 * matches media by filename it would then reuse that broken record forever.
 * Run this before re-seeding after an upload failure.
 *
 *   node --import tsx src/scripts/clean-orphan-media.ts
 */
import { getPayload } from 'payload'
import config from '../payload.config.js'

const payload = await getPayload({ config })

const { docs, totalDocs } = await payload.find({ collection: 'media', limit: 1000, depth: 0 })
console.log(`media documents: ${totalDocs}`)

const orphans = docs.filter((doc) => !doc.url || !doc.filesize)
console.log(`orphans (no stored file): ${orphans.length}`)

if (process.argv.includes('--delete') && orphans.length > 0) {
  for (const doc of orphans) {
    await payload.delete({ collection: 'media', id: doc.id })
  }
  console.log(`deleted ${orphans.length} orphaned media documents`)
} else if (orphans.length > 0) {
  console.log('re-run with --delete to remove them')
  for (const doc of orphans.slice(0, 5)) {
    console.log(`  ${doc.filename} url=${doc.url ?? '(none)'} size=${doc.filesize ?? '(none)'}`)
  }
}

process.exit(0)
