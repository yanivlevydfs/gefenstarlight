/**
 * One-off repair for media that the Wix scrape attributed to the wrong pages.
 *
 * The scraper let lazy-loaded images bleed between adjacent project pages, so
 * three albums shared photos that belong to one event each (verified against
 * the photographs themselves — venues, posters and dates). The board page also
 * carried two headshots swapped and one attached to a member who never had
 * one on the old site.
 *
 *   node --env-file=.env.production.local --import tsx src/scripts/fix-media-assignments.ts
 */
export {}

const { getPayload } = await import('payload')
const { default: config } = await import('../payload.config.js')

const payload = await getPayload({ config })

async function mediaId(sourceFile: string): Promise<number> {
  const found = await payload.find({
    collection: 'media',
    limit: 1,
    where: { sourceFile: { equals: sourceFile } },
  })
  const id = found.docs[0]?.id
  if (!id) throw new Error(`media not found for ${sourceFile}`)
  return id as number
}

/** The corrected photo list for each project's album, in display order. */
const albums: Record<string, string[]> = {
  'hod-hasharon-2024': [
    'd7301b_701460527aac4865b713d2558fcea3da~mv2.jpg',
    'd7301b_61e1678c813d4fdd8e80efc4d50c029d~mv2.jpg',
    'd7301b_013e4fdc63114f4dae13a6b0934382bb~mv2.jpg',
  ],
  'petah-tikva-2025': [
    'a50afb_ca7cbfaf052143b3920c02c28f06424f~mv2.jpg',
    'a50afb_af39dd7aed024b8ca0f610a7fc20b54a~mv2.jpg',
    'a50afb_cd0376a45801485ba248b5105043ae51~mv2.jpg',
    'a50afb_3c6779ff06ea45809a133cc7cb3102b6~mv2.jpg',
    'a50afb_e934bc2ec0a94ae39fab22334113988e~mv2.jpg',
    'a50afb_d830d8cb764d4befafd83733025143a9~mv2.jpg',
    'a50afb_99ca0e1e66944a83b786f95b90115669~mv2.jpg',
    'a50afb_a6dba72d2ed34845a8e0e831eba10308~mv2.jpg',
  ],
  'ramla-judo-2024': [
    'd7301b_473ad8d0d82a4e278c636bd425240dba~mv2.jpg',
    'd7301b_0ad5f31053ee4c40b51b5cede79dd670~mv2.jpg',
    'd7301b_502e256664de480a9a230e3ba1fa3ccd~mv2.jpg',
    'a50afb_fe79f0f12e97472bbd3ec2f110b1df3a~mv2.jpg',
    'a50afb_d29a11ca927e45b1bb5b20cb97b87eb3~mv2.jpg',
    'a50afb_df06d76f718a41a69dc341e98effe0a5~mv2.jpg',
    'a50afb_2e8ce55e594340a9a5258d88d80866c6~mv2.jpg',
    'a50afb_5059e4cc5710433290bbd916f55c83f9.mp4',
    'a50afb_af60b668649e47b198fa40ebf5bbc62e.mp4',
    'a50afb_d1ecfa7b394d417fb19be7cd892ee5d4.mp4',
    'a50afb_ad088c81daad4da58ac87a0581bdc438.mp4',
    'a50afb_b2ddac802b5e420c984ba2044a0dbe32~mv2.jpg',
  ],
}

for (const [projectSlug, files] of Object.entries(albums)) {
  const project = await payload.find({
    collection: 'projects',
    limit: 1,
    locale: 'he',
    where: { slug: { equals: projectSlug } },
  })
  const doc = project.docs[0]
  if (!doc) {
    console.error(`project ${projectSlug} not found — skipped`)
    continue
  }
  const albumId = typeof doc.album === 'object' && doc.album ? doc.album.id : doc.album
  if (!albumId) {
    console.error(`project ${projectSlug} has no album — skipped`)
    continue
  }

  const items = await Promise.all(files.map((f) => mediaId(f)))
  const cover = items[0]
  await payload.update({
    collection: 'albums',
    id: albumId as number,
    data: { items, cover },
  })
  console.log(`album for ${projectSlug}: ${items.length} items, cover ${cover}`)
}

/** name (he) -> correct headshot, or null for members who never had one. */
const headshots: Record<string, string | null> = {
  'הדר טל': 'a50afb_17b62465c45a4f8ba030eba3e81a3344~mv2.jpg',
  'ארנון מיינפלד': 'a50afb_e4f321ca6d5845e191bd1dc0d369ced2~mv2.jpg',
  'חגי נצר': null,
}

for (const [name, file] of Object.entries(headshots)) {
  const found = await payload.find({
    collection: 'board-members',
    limit: 1,
    locale: 'he',
    where: { name: { equals: name } },
  })
  const doc = found.docs[0]
  if (!doc) {
    console.error(`board member ${name} not found — skipped`)
    continue
  }
  const photo = file ? await mediaId(file) : null
  await payload.update({
    collection: 'board-members',
    id: doc.id,
    locale: 'he',
    data: { photo },
  })
  console.log(`board member ${name}: photo ${photo ?? 'removed'}`)
}

console.log('done')
process.exit(0)
