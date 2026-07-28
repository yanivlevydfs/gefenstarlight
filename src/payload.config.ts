import path from 'path'
import { createHash } from 'crypto'
import { fileURLToPath } from 'url'

import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { vercelBlobStorage } from './payload/storage/vercel-blob'
import { he as heAdmin } from '@payloadcms/translations/languages/he'
import { en as enAdmin } from '@payloadcms/translations/languages/en'
import sharp from 'sharp'

import { Users } from './payload/collections/Users'
import { Media } from './payload/collections/Media'
import { Albums } from './payload/collections/Albums'
import { Projects } from './payload/collections/Projects'
import { Articles } from './payload/collections/Articles'
import { Pages } from './payload/collections/Pages'
import { BoardMembers, Testimonials, Enquiries } from './payload/collections/People'
import { Navigation } from './payload/globals/Navigation'
import { SiteSettings } from './payload/globals/SiteSettings'
import { HomePage } from './payload/globals/HomePage'

const dirname = path.dirname(fileURLToPath(import.meta.url))

const blobToken = process.env.BLOB_READ_WRITE_TOKEN

if (!blobToken && process.env.NODE_ENV === 'production') {
  console.warn(
    '[payload] BLOB_READ_WRITE_TOKEN is not set. Uploads will be served from the ' +
      'local filesystem, which is read-only on Vercel — images will not load.',
  )
}

/**
 * The first Postgres connection string we can find. Vercel's Neon integration
 * provides POSTGRES_URL and DATABASE_URL automatically; DATABASE_URI is the
 * explicit override used by the seed script and by local development.
 */
const postgresUrl = [
  process.env.DATABASE_URI,
  process.env.POSTGRES_URL,
  process.env.DATABASE_URL,
].find((url) => url?.startsWith('postgres'))

/**
 * Payload refuses to start without a secret, which takes the whole admin
 * console down. Rather than fail, derive a stable one from the database
 * credential — already a secret, and already required for anything to work.
 *
 * This is a safety net, not the intended setup: set PAYLOAD_SECRET explicitly so
 * that rotating the database password does not sign every admin out.
 */
const payloadSecret =
  process.env.PAYLOAD_SECRET ||
  (postgresUrl
    ? createHash('sha256').update(`gefenstarlight:${postgresUrl}`).digest('hex')
    : 'gefenstarlight-local-development-secret')

if (!process.env.PAYLOAD_SECRET) {
  console.warn('[payload] PAYLOAD_SECRET is not set — using a derived fallback. Set it properly.')
}

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: {
      titleSuffix: '· אור הכוכבים של גפן',
    },
  },

  // Content is authored in both languages; Hebrew is the source of truth.
  localization: {
    locales: [
      { label: { he: 'עברית', en: 'Hebrew' }, code: 'he', rtl: true },
      { label: { he: 'אנגלית', en: 'English' }, code: 'en' },
    ],
    defaultLocale: 'he',
    fallback: true,
  },

  // The admin console itself, in Hebrew by default.
  i18n: {
    supportedLanguages: { he: heAdmin, en: enAdmin },
    fallbackLanguage: 'he',
  },

  collections: [
    Projects,
    Albums,
    Articles,
    Pages,
    Media,
    BoardMembers,
    Testimonials,
    Enquiries,
    Users,
  ],

  globals: [HomePage, Navigation, SiteSettings],

  editor: lexicalEditor(),

  // Postgres in production, SQLite locally so `run.bat` needs no setup.
  //
  // Vercel's Neon/Postgres integration sets POSTGRES_URL and DATABASE_URL on the
  // project by itself, so those are accepted too and nothing has to be copied by
  // hand. DATABASE_URI wins when set, which is how the seed targets a specific
  // database.
  //
  // `push` keeps the dev database in sync with this config automatically. It is
  // interactive, so scripts (seed, migrations, CI) turn it off with PAYLOAD_PUSH=false.
  db: postgresUrl
    ? postgresAdapter({
        pool: { connectionString: postgresUrl },
        push: process.env.PAYLOAD_PUSH !== 'false' && process.env.NODE_ENV !== 'production',
      })
    : sqliteAdapter({
        client: { url: process.env.DATABASE_URI || 'file:./gefen.db' },
        push: process.env.PAYLOAD_PUSH !== 'false',
      }),

  secret: payloadSecret,

  sharp,

  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  plugins: [
    seoPlugin({
      collections: ['projects', 'articles', 'pages'],
      uploadsCollection: 'media',
      generateTitle: ({ doc }) => `${doc?.title ?? ''} | אור הכוכבים של גפן`,
      generateDescription: ({ doc }) => doc?.summary ?? doc?.excerpt ?? '',
    }),
    // In production media lives in Vercel Blob; locally it stays on disk.
    // Uses our own adapter — see the note in payload/storage/vercel-blob.ts.
    ...(blobToken ? [vercelBlobStorage({ collections: { media: true }, token: blobToken })] : []),
  ],
})
