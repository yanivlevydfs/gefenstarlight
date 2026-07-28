/**
 * Imports the foundation's film — the video the old Wix home page played —
 * into the media library, and places it at the front of the videos album.
 * The home page finds it by source name (see FILM_SOURCE_FILE in lib/payload).
 *
 *   node --env-file=.env.production.local --import tsx src/scripts/add-homepage-film.ts
 */
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const { getPayload } = await import('payload')
const { default: config } = await import('../payload.config.js')

const dirname = path.dirname(fileURLToPath(import.meta.url))
const MEDIA_DIR = path.resolve(dirname, '../../seed-media')

const FILM = 'd7301b_1ad63cea63354905941e685bbea39916.mp4'
const POSTER = 'd7301b_1ad63cea63354905941e685bbea39916f000.jpg'
const ALT = 'הסרט של עמותת אור הכוכבים של גפן'

const payload = await getPayload({ config })

/** Create the file once, recording its CDN address like the seed does. */
async function uploadOnce(filename: string, alt: string): Promise<number> {
  const existing = await payload.find({
    collection: 'media',
    limit: 1,
    where: { sourceFile: { equals: filename } },
  })
  if (existing.docs[0]) {
    console.log(`${filename} already imported (id ${existing.docs[0].id})`)
    return existing.docs[0].id as number
  }

  const doc = await payload.create({
    collection: 'media',
    locale: 'he',
    data: { alt, sourceFile: filename },
    filePath: path.join(MEDIA_DIR, filename),
  })

  if (doc.url?.startsWith('http')) {
    const publicSizes: Record<string, string> = {}
    for (const [name, variant] of Object.entries(doc.sizes ?? {})) {
      const variantUrl = (variant as { url?: string | null } | undefined)?.url
      if (variantUrl?.startsWith('http')) publicSizes[name] = variantUrl
    }
    await payload.update({
      collection: 'media',
      id: doc.id,
      data: { publicUrl: doc.url, publicSizes },
    })
  }
  console.log(`${filename} imported (id ${doc.id})`)
  return doc.id as number
}

const posterId = await uploadOnce(POSTER, ALT)
const filmId = await uploadOnce(FILM, ALT)

await payload.update({ collection: 'media', id: filmId, data: { poster: posterId } })

// Put the film first in the videos album, so it also shows in the gallery.
const albums = await payload.find({
  collection: 'albums',
  limit: 1,
  locale: 'he',
  where: { slug: { equals: 'videos' } },
})
const album = albums.docs[0]
if (album) {
  const items = (album.items ?? []).map((i) => (typeof i === 'object' && i ? i.id : i)) as number[]
  if (!items.includes(filmId)) {
    await payload.update({
      collection: 'albums',
      id: album.id,
      data: { items: [filmId, ...items] },
    })
    console.log(`videos album now has ${items.length + 1} items, film first`)
  } else {
    console.log('film already in the videos album')
  }
} else {
  console.warn('videos album not found — the film is only on the home page')
}

console.log('done')
process.exit(0)
