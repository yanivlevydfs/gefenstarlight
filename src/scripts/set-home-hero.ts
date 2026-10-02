/**
 * Swaps the sad close-up of Gefen (cropped to just his eyes by the wide
 * banners) for one where he is smiling, in his judo uniform with a
 * certificate — on the home hero, the About Gefen page, and the site share
 * image that every other page header falls back to. Banners crop at 20% from
 * the top (home page, PageHeader) to keep his face in frame.
 *
 *   node --env-file=.env.production.local --import tsx src/scripts/set-home-hero.ts
 */
export {}

const { getPayload } = await import('payload')
const { default: config } = await import('../payload.config.js')

const HERO = 'a50afb_b6629c93bd6f45aaa9f0f8ce77bae747~mv2.jpg'

const payload = await getPayload({ config })

const r = await payload.find({ collection: 'media', limit: 1, where: { sourceFile: { equals: HERO } } })
const hero = r.docs[0]
if (!hero) throw new Error(`${HERO} is not in the media library`)

await payload.updateGlobal({ slug: 'home-page', data: { heroImage: hero.id } })
await payload.updateGlobal({ slug: 'site-settings', data: { shareImage: hero.id } })

const gefen = await payload.find({ collection: 'pages', limit: 1, locale: 'he', where: { slug: { equals: 'gefen' } } })
if (gefen.docs[0]) await payload.update({ collection: 'pages', id: gefen.docs[0].id, data: { hero: hero.id } })

console.log(`hero, share image and gefen page now use media ${hero.id}`)
process.exit(0)
