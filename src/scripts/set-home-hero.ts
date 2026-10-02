/**
 * Swaps the home-page hero photo for one where Gefen is smiling, in his judo
 * uniform with a certificate. The hero crops to a wide strip at 20% from the
 * top (see the home page), which keeps his face in frame.
 *
 *   node --env-file=.env.production.local --import tsx src/scripts/set-home-hero.ts
 */
const { getPayload } = await import('payload')
const { default: config } = await import('../payload.config.js')

const HERO = 'a50afb_b6629c93bd6f45aaa9f0f8ce77bae747~mv2.jpg'

const payload = await getPayload({ config })

const r = await payload.find({ collection: 'media', limit: 1, where: { sourceFile: { equals: HERO } } })
const hero = r.docs[0]
if (!hero) throw new Error(`${HERO} is not in the media library`)

await payload.updateGlobal({ slug: 'home-page', data: { heroImage: hero.id } })
console.log(`home hero is now media ${hero.id}`)
process.exit(0)
