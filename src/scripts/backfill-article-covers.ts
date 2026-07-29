/**
 * Gives every published article a cover.
 *
 * `add-first-articles.ts` falls back to the album's cover when an article
 * names no image of its own, but the wine article was created before
 * `fix-wine-album.ts` gave that album a cover — so the fallback resolved to
 * null and the news list rendered a card with no preview. This backfills any
 * article in that state rather than only the wine one, from the album's cover
 * or, failing that, its first photo.
 *
 *   node --env-file=.env.production.local --import tsx src/scripts/backfill-article-covers.ts
 */
export {}

const { getPayload } = await import('payload')
const { default: config } = await import('../payload.config.js')

const payload = await getPayload({ config })

const id = (v: unknown): number | null =>
  typeof v === 'number' ? v : typeof v === 'object' && v && 'id' in v ? (v.id as number) : null

const { docs } = await payload.find({
  collection: 'articles',
  limit: 500,
  locale: 'he',
  depth: 1,
  where: { cover: { exists: false } },
})

if (docs.length === 0) {
  console.log('every article already has a cover — nothing to do')
  process.exit(0)
}

for (const article of docs) {
  const albumId = id(article.album)
  if (!albumId) {
    console.log(`${article.slug}: no cover and no album — needs a picture in the admin console`)
    continue
  }

  const album = await payload.findByID({ collection: 'albums', id: albumId, depth: 0 })
  const cover = id(album.cover) ?? id((album.items ?? [])[0])
  if (!cover) {
    console.log(`${article.slug}: album "${album.slug}" is empty — nothing to borrow`)
    continue
  }

  await payload.update({
    collection: 'articles',
    id: article.id,
    locale: 'he',
    data: { cover },
  })
  console.log(`${article.slug}: cover set to media ${cover} (from album "${album.slug}")`)
}

console.log('done')
process.exit(0)
