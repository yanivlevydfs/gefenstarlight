/**
 * Attaches the classic Wix photo pairing to the home-page goals, so the
 * carousel photos appear in the admin console where the owner can change,
 * add or remove them per goal. Running this also pushes the new `image`
 * column to the database, the same way every schema change here has shipped.
 *
 *   node --env-file=.env.production.local --import tsx src/scripts/backfill-goal-images.ts
 */
export {}

const { getPayload } = await import('payload')
const { default: config } = await import('../payload.config.js')
const { GOAL_PHOTO_SOURCE_FILES } = await import('../lib/payload.js')

const payload = await getPayload({ config })

const media = await payload.find({
  collection: 'media',
  limit: GOAL_PHOTO_SOURCE_FILES.length,
  depth: 0,
  where: { sourceFile: { in: GOAL_PHOTO_SOURCE_FILES } },
})
const idFor = (file: string) => media.docs.find((d) => d.sourceFile === file)?.id ?? null

const home = await payload.findGlobal({ slug: 'home-page', locale: 'he', depth: 0 })
const goals = (home.goals ?? []).map((goal, i) => {
  const file = GOAL_PHOTO_SOURCE_FILES[i]
  return {
    ...goal,
    image: goal.image ?? (file ? idFor(file) : null),
  }
})

await payload.updateGlobal({ slug: 'home-page', locale: 'he', data: { goals } })

const check = await payload.findGlobal({ slug: 'home-page', locale: 'he', depth: 0 })
for (const [i, g] of (check.goals ?? []).entries())
  console.log(`goal ${i + 1}: "${g.title}" image=${typeof g.image === 'object' && g.image ? (g.image as { id: number }).id : g.image}`)

console.log('done')
process.exit(0)
