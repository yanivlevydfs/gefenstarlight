import path from 'path'
import { fileURLToPath } from 'url'

import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
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

  // Postgres in production (Vercel/Neon). With no DATABASE_URI set, the site
  // runs off a local SQLite file so `run.bat` works with zero setup.
  db: process.env.DATABASE_URI?.startsWith('postgres')
    ? postgresAdapter({ pool: { connectionString: process.env.DATABASE_URI } })
    : sqliteAdapter({ client: { url: process.env.DATABASE_URI || 'file:./gefen.db' } }),

  secret: process.env.PAYLOAD_SECRET || '',

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
    ...(blobToken
      ? [vercelBlobStorage({ collections: { media: true }, token: blobToken })]
      : []),
  ],
})
