/**
 * Confirms the app boots with only the variables Vercel's Neon integration sets
 * automatically — no DATABASE_URI, no PAYLOAD_SECRET.
 *
 *   node --import tsx src/scripts/check-env-fallback.ts
 */
export {} // makes this a module, so top-level await is allowed

delete process.env.DATABASE_URI
delete process.env.PAYLOAD_SECRET
process.env.PAYLOAD_PUSH = 'false'

if (!process.env.POSTGRES_URL) {
  console.error('Set POSTGRES_URL before running this check.')
  process.exit(1)
}

const { getPayload } = await import('payload')
const { default: config } = await import('../payload.config.js')

const payload = await getPayload({ config })
console.log('payload initialised with only POSTGRES_URL set')

const [projects, users, media, albums] = await Promise.all([
  payload.count({ collection: 'projects' }),
  payload.count({ collection: 'users' }),
  payload.count({ collection: 'media' }),
  payload.count({ collection: 'albums' }),
])
console.log(
  `projects=${projects.totalDocs} albums=${albums.totalDocs} media=${media.totalDocs} users=${users.totalDocs}`,
)

const home = await payload.findGlobal({ slug: 'home-page', locale: 'he' })
console.log('home hero:', home.heroTitle)

process.exit(0)
