/**
 * Board headshot corrections from the owner: the photo previously thought to
 * be Arnon Meinfeld's is actually Hagai Netzer's, and Arnon gets a new
 * headshot supplied directly (seed-media/arnon-mainfeld.jpeg).
 *
 *   node --env-file=.env.production.local --import tsx src/scripts/update-board-photos.ts
 */
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const { getPayload } = await import('payload')
const { default: config } = await import('../payload.config.js')

const dirname = path.dirname(fileURLToPath(import.meta.url))
const MEDIA_DIR = path.resolve(dirname, '../../seed-media')

const payload = await getPayload({ config })

async function uploadOnce(filename: string, alt: string): Promise<number> {
  const existing = await payload.find({
    collection: 'media',
    limit: 1,
    where: { sourceFile: { equals: filename } },
  })
  if (existing.docs[0]) return existing.docs[0].id as number

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

async function setPhoto(name: string, photo: number) {
  const found = await payload.find({
    collection: 'board-members',
    limit: 1,
    locale: 'he',
    where: { name: { equals: name } },
  })
  const doc = found.docs[0]
  if (!doc) return console.error(`${name} not found`)
  await payload.update({ collection: 'board-members', id: doc.id, locale: 'he', data: { photo } })
  console.log(`${name}: photo ${photo}`)
}

const hagaiNetzer = await payload.find({
  collection: 'media',
  limit: 1,
  where: { sourceFile: { equals: 'a50afb_e4f321ca6d5845e191bd1dc0d369ced2~mv2.jpg' } },
})
const arnonNew = await uploadOnce('arnon-mainfeld.jpeg', 'ארנון מיינפלד')

await setPhoto('חגי נצר', hagaiNetzer.docs[0]!.id as number)
await setPhoto('ארנון מיינפלד', arnonNew)

console.log('done')
process.exit(0)
